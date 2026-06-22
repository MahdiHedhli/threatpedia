#!/usr/bin/env node
/**
 * Supply Chain B1: live discovery + intake classification.
 *
 * This lane discovers package/advisory leads and writes a triaged candidate
 * queue only. It never creates article tasks, drafts, or corpus records.
 */

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { XMLParser } from 'fast-xml-parser';
import { loadPipelineConfig } from './pipeline-config.mjs';

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(moduleDir, '..');
const DEFAULT_QUEUE_PATH = '.github/pipeline/supply-chain-candidates/latest.json';
const DEFAULT_CURRENT_WINDOW_DAYS = 180;
const DEFAULT_RECENTLY_ADDED_DAYS = 30;
const DEFAULT_KEV_OVERDUE_GRACE_DAYS = 30;
const DEFAULT_KEV_AGED_DAYS = 180;
const DEFAULT_ACTIVE_EXPIRY_DAYS = 30;
const DEFAULT_MAX_CANDIDATES = 40;
const DEFAULT_MAX_PER_SOURCE = 25;
const DEFAULT_SINCE_HOURS = 6;
const CVE_RE = /\bCVE-\d{4}-\d{4,7}\b/gi;
const GHSA_RE = /\bGHSA-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}\b/gi;
const OSV_ID_RE = /\b(?:MAL|GHSA|PYSEC|GO|OSV|CVE)-[A-Z0-9][A-Z0-9.-]*\b/gi;
const SUPPLY_CHAIN_TERMS = [
  /supply[- ]chain/i,
  /malicious package/i,
  /package(?:\s|-)?publish/i,
  /typosquat/i,
  /protestware/i,
  /dependency confusion/i,
  /npm worm/i,
  /pypi/i,
  /github actions/i,
  /credential(?:s)? (?:stealer|theft|exfiltration)/i,
  /postinstall|preinstall/i,
];

const RSS_PARSER = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  parseTagValue: true,
  trimValues: true,
  processEntities: false,
  htmlEntities: false,
});

export function parseArgs(argv = process.argv) {
  const args = {
    execute: false,
    out: null,
    queuePath: null,
    fixturesDir: null,
    asOf: null,
    maxCandidates: null,
    maxPerSource: null,
    sinceHours: null,
    vulncheckIndex: null,
    check: false,
    includeLowSignal: false,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    const next = argv[i + 1];
    switch (token) {
      case '--execute':
        args.execute = true;
        break;
      case '--dry-run':
        args.execute = false;
        break;
      case '--out':
        if (!next) throw new Error('Missing value for --out');
        args.out = next;
        i += 1;
        break;
      case '--queue-path':
        if (!next) throw new Error('Missing value for --queue-path');
        args.queuePath = next;
        i += 1;
        break;
      case '--fixtures-dir':
        if (!next) throw new Error('Missing value for --fixtures-dir');
        args.fixturesDir = next;
        i += 1;
        break;
      case '--as-of':
        if (!next) throw new Error('Missing value for --as-of');
        args.asOf = next;
        i += 1;
        break;
      case '--max-candidates':
        if (!next) throw new Error('Missing value for --max-candidates');
        args.maxCandidates = positiveInteger(next, '--max-candidates');
        i += 1;
        break;
      case '--max-per-source':
        if (!next) throw new Error('Missing value for --max-per-source');
        args.maxPerSource = positiveInteger(next, '--max-per-source');
        i += 1;
        break;
      case '--since-hours':
        if (!next) throw new Error('Missing value for --since-hours');
        args.sinceHours = positiveInteger(next, '--since-hours');
        i += 1;
        break;
      case '--vulncheck-index':
        if (!next) throw new Error('Missing value for --vulncheck-index');
        args.vulncheckIndex = next;
        i += 1;
        break;
      case '--include-low-signal':
        args.includeLowSignal = true;
        break;
      case '--check':
        args.check = true;
        break;
      case '--help':
      case '-h':
        printUsage();
        process.exit(0);
      default:
        throw new Error(`Unknown argument: ${token}`);
    }
  }
  return args;
}

function printUsage() {
  console.log([
    'Usage:',
    '  node scripts/supply-chain-live-discovery.mjs --dry-run [options]',
    '  node scripts/supply-chain-live-discovery.mjs --execute [options]',
    '  node scripts/supply-chain-live-discovery.mjs --check --queue-path <path>',
    '',
    'Writes only a classified candidate queue. No tasks, drafts, or corpus records are created.',
  ].join('\n'));
}

function positiveInteger(value, name) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed < 1) throw new Error(`${name} must be a positive integer`);
  return parsed;
}

function readJson(relativeOrAbsolutePath) {
  const abs = path.isAbsolute(relativeOrAbsolutePath)
    ? relativeOrAbsolutePath
    : path.resolve(repoRoot, relativeOrAbsolutePath);
  return JSON.parse(readFileSync(abs, 'utf8'));
}

function writeJson(relativeOrAbsolutePath, value) {
  const abs = path.isAbsolute(relativeOrAbsolutePath)
    ? relativeOrAbsolutePath
    : path.resolve(repoRoot, relativeOrAbsolutePath);
  mkdirSync(path.dirname(abs), { recursive: true });
  writeFileSync(abs, `${JSON.stringify(value, null, 2)}\n`);
}

function readFixture(fixturesDir, name, fallback = null) {
  if (!fixturesDir) return fallback;
  const filePath = path.resolve(repoRoot, fixturesDir, name);
  if (!existsSync(filePath)) return fallback;
  return readFileSync(filePath, 'utf8');
}

function readFixtureJson(fixturesDir, name, fallback = null) {
  const text = readFixture(fixturesDir, name, null);
  return text == null ? fallback : JSON.parse(text);
}

function normalizeWhitespace(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function slugPart(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9@._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function sha(value, len = 12) {
  return createHash('sha256').update(String(value)).digest('hex').slice(0, len);
}

function parseDate(value) {
  if (!value) return null;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : new Date(parsed);
}

function iso(value) {
  const parsed = parseDate(value);
  return parsed ? parsed.toISOString() : null;
}

function isoDate(value) {
  const parsed = parseDate(value);
  return parsed ? parsed.toISOString().slice(0, 10) : null;
}

function nowDate(args) {
  return args.asOf ? parseDate(args.asOf) : new Date();
}

function uniqueStrings(values) {
  const seen = new Set();
  return (Array.isArray(values) ? values.flat(Infinity) : [values])
    .filter((value) => value !== null && value !== undefined)
    .map((value) => String(value).trim())
    .filter(Boolean)
    .filter((value) => {
      const key = value.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function extractIds(text) {
  const joined = String(text || '');
  return {
    cves: uniqueStrings(joined.match(CVE_RE) || []).map((id) => id.toUpperCase()),
    ghsas: uniqueStrings(joined.match(GHSA_RE) || []).map((id) => id.toUpperCase()),
    osvIds: uniqueStrings(joined.match(OSV_ID_RE) || []).map((id) => id.toUpperCase()),
  };
}

function normalizePypiName(name) {
  return String(name || '').trim().toLowerCase().replace(/[-_.]+/g, '-');
}

function normalizeNpmName(name) {
  return String(name || '').trim().toLowerCase();
}

function normalizePackageName(ecosystem, name) {
  if (ecosystem === 'pypi') return normalizePypiName(name);
  if (ecosystem === 'npm') return normalizeNpmName(name);
  return String(name || '').trim();
}

function encodePurlName(ecosystem, name) {
  const normalized = normalizePackageName(ecosystem, name);
  if (ecosystem === 'npm' && normalized.startsWith('@') && normalized.includes('/')) {
    const [scope, pkg] = normalized.slice(1).split('/', 2);
    return `${encodeURIComponent(`@${scope}`)}/${encodeURIComponent(pkg)}`;
  }
  if (ecosystem === 'go') return normalized.split('/').map((part) => encodeURIComponent(part)).join('/');
  return encodeURIComponent(normalized);
}

function buildPurl(ecosystem, name, version = null) {
  const type = ecosystem === 'go' ? 'golang' : ecosystem;
  const suffix = version ? `@${encodeURIComponent(String(version).trim())}` : '';
  return `pkg:${type}/${encodePurlName(ecosystem, name)}${suffix}`;
}

async function fetchText(url, headers = {}) {
  const response = await fetch(url, {
    headers: {
      Accept: 'text/plain, application/json, application/xml, text/xml, */*',
      'User-Agent': 'threatpedia-supply-chain-discovery/1.0 (+https://threatpedia.wiki)',
      ...headers,
    },
  });
  if (!response.ok) throw new Error(`${url} returned ${response.status} ${response.statusText}`);
  return response.text();
}

async function fetchJson(url, headers = {}) {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'threatpedia-supply-chain-discovery/1.0 (+https://threatpedia.wiki)',
      ...headers,
    },
  });
  if (!response.ok) throw new Error(`${url} returned ${response.status} ${response.statusText}`);
  return response.json();
}

function loadB1Config(args) {
  const pipelineConfig = loadPipelineConfig();
  const supply = pipelineConfig.discovery_sources?.supply_chain_live || {};
  const intake = pipelineConfig.lead_intake || {};
  return {
    queuePath: args.queuePath || supply.queue_path || DEFAULT_QUEUE_PATH,
    maxCandidates: args.maxCandidates || supply.max_candidates || DEFAULT_MAX_CANDIDATES,
    maxPerSource: args.maxPerSource || supply.max_per_source || DEFAULT_MAX_PER_SOURCE,
    sinceHours: args.sinceHours || supply.since_hours || DEFAULT_SINCE_HOURS,
    minRank: args.includeLowSignal ? 0 : (supply.min_rank || 25),
    currentWindowDays: intake.current_window_days || DEFAULT_CURRENT_WINDOW_DAYS,
    kev: {
      recentlyAddedDays: intake.kev?.recently_added_days || DEFAULT_RECENTLY_ADDED_DAYS,
      overdueGraceDays: intake.kev?.overdue_grace_days || DEFAULT_KEV_OVERDUE_GRACE_DAYS,
      agedDays: intake.kev?.aged_days || DEFAULT_KEV_AGED_DAYS,
    },
    activeStatus: {
      defaultExpiryDays: intake.active_status?.default_expiry_days || DEFAULT_ACTIVE_EXPIRY_DAYS,
    },
    sources: {
      npm: {
        enabled: supply.npm?.enabled !== false,
        changesUrl: supply.npm?.changes_url || 'https://replicate.npmjs.com/registry/_changes',
        metadataBaseUrl: supply.npm?.metadata_base_url || 'https://registry.npmjs.org',
      },
      pypi: {
        enabled: supply.pypi?.enabled !== false,
        rssUrl: supply.pypi?.rss_url || 'https://pypi.org/rss/updates.xml',
        jsonBaseUrl: supply.pypi?.json_base_url || 'https://pypi.org/pypi',
      },
      go: {
        enabled: supply.go?.enabled !== false,
        indexUrl: supply.go?.index_url || 'https://index.golang.org/index',
      },
      osv: {
        enabled: supply.osv?.enabled !== false,
        modifiedCsvUrl: supply.osv?.modified_csv_url || 'https://osv-vulnerabilities.storage.googleapis.com/modified_id.csv',
        recordBaseUrl: supply.osv?.record_base_url || 'https://osv-vulnerabilities.storage.googleapis.com',
        ecosystems: supply.osv?.ecosystems || ['npm', 'PyPI', 'Go'],
      },
      ghsa: {
        enabled: supply.ghsa?.enabled !== false,
        url: supply.ghsa?.url || 'https://api.github.com/advisories',
        ecosystems: supply.ghsa?.ecosystems || ['npm', 'pip', 'go'],
        types: supply.ghsa?.types || ['malware', 'reviewed'],
      },
      vulncheck: {
        enabled: pipelineConfig.discovery_sources?.vulncheck_kev?.enabled === true,
      },
    },
  };
}

function packageMetadataUrl(baseUrl, packageName) {
  return `${baseUrl.replace(/\/$/, '')}/${encodeURIComponent(packageName)}`;
}

function pypiJsonUrl(baseUrl, projectName) {
  return `${baseUrl.replace(/\/$/, '')}/${encodeURIComponent(projectName)}/json`;
}

function latestNpmVersion(metadata) {
  const versions = metadata?.versions && typeof metadata.versions === 'object' ? metadata.versions : {};
  const latest = metadata?.['dist-tags']?.latest;
  if (latest && versions[latest]) return latest;
  const times = metadata?.time && typeof metadata.time === 'object' ? metadata.time : {};
  return Object.entries(times)
    .filter(([version]) => version !== 'created' && version !== 'modified' && versions[version])
    .sort((a, b) => String(b[1]).localeCompare(String(a[1])))[0]?.[0] || null;
}

function releaseLead({ source, ecosystem, name, version, publishedAt, url, feedCursor, summary, raw }) {
  const purl = buildPurl(ecosystem, name, version);
  return {
    leadRef: `${source}:${sha(`${purl}:${feedCursor || publishedAt || ''}`)}`,
    source,
    kind: 'release',
    ecosystem,
    packageName: normalizePackageName(ecosystem, name),
    version,
    purl,
    title: `${normalizePackageName(ecosystem, name)} ${version}`,
    summary: summary || `Observed ${ecosystem} release ${normalizePackageName(ecosystem, name)} ${version}.`,
    observedAt: new Date().toISOString(),
    publishedAt: iso(publishedAt),
    lastMaterialActivityAt: iso(publishedAt),
    feedCursor,
    url,
    raw,
  };
}

function vulnerabilityLead({ source, id, aliases, title, summary, modifiedAt, publishedAt, url, affected, severity, databaseSpecific, raw }) {
  const text = `${id} ${aliases?.join(' ') || ''} ${title || ''} ${summary || ''}`;
  const ids = extractIds(text);
  return {
    leadRef: `${source}:${id || sha(text)}`,
    source,
    kind: 'advisory',
    advisoryId: id,
    title: title || id,
    summary: normalizeWhitespace(summary),
    observedAt: new Date().toISOString(),
    publishedAt: iso(publishedAt),
    modifiedAt: iso(modifiedAt),
    lastMaterialActivityAt: iso(modifiedAt || publishedAt),
    url,
    cves: ids.cves,
    ghsas: ids.ghsas,
    osvIds: uniqueStrings([id, ids.osvIds]),
    affected: Array.isArray(affected) ? affected : [],
    severity,
    databaseSpecific: databaseSpecific || null,
    raw,
  };
}

function parseRssItems(xmlText) {
  const parsed = RSS_PARSER.parse(xmlText);
  const rawItems = parsed?.rss?.channel?.item || parsed?.feed?.entry || [];
  return (Array.isArray(rawItems) ? rawItems : [rawItems]).filter(Boolean);
}

function textValue(value) {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (value && typeof value === 'object' && typeof value['#text'] === 'string') return value['#text'];
  return '';
}

function parsePyPiRssItem(item) {
  const title = textValue(item.title);
  if (!title || !title.includes(' ')) return null;
  const [project, version] = title.split(/\s+(?=\S+$)/);
  return {
    project: normalizeWhitespace(project),
    version: normalizeWhitespace(version),
    cursor: textValue(item.pubDate) || textValue(item.link) || title,
    publishedAt: iso(textValue(item.pubDate)),
    link: textValue(item.link),
  };
}

function parseGoIndexLines(text) {
  return String(text || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function goBoundaryKey(row) {
  return `${row.Path || ''}\t${row.Version || ''}\t${row.Timestamp || ''}`;
}

function readPreviousQueue(queuePath) {
  if (!queuePath) return null;
  const abs = path.resolve(repoRoot, queuePath);
  if (!existsSync(abs)) return null;
  try {
    return JSON.parse(readFileSync(abs, 'utf8'));
  } catch {
    return null;
  }
}

function previousGoCursor(previousQueue, sinceHours, asOfDate) {
  const cursor = previousQueue?.feed_cursors?.go?.cursor;
  if (cursor) return cursor;
  return new Date(asOfDate.getTime() - sinceHours * 60 * 60 * 1000).toISOString();
}

async function collectNpmLeads(config, fixturesDir) {
  const fixtureChanges = readFixtureJson(fixturesDir, 'npm_changes.json', null);
  const changes = fixtureChanges || await fetchJson(`${config.sources.npm.changesUrl}?descending=true&limit=${config.maxPerSource}`);
  const rows = Array.isArray(changes?.results) ? changes.results : [];
  const leads = [];
  for (const row of rows.slice(0, config.maxPerSource)) {
    const packageName = row.id;
    if (!packageName) continue;
    const fixtureName = `npm-${slugPart(packageName)}.json`;
    let metadata = readFixtureJson(fixturesDir, fixtureName, null);
    if (!metadata) {
      try {
        metadata = await fetchJson(packageMetadataUrl(config.sources.npm.metadataBaseUrl, packageName));
      } catch {
        continue;
      }
    }
    const version = latestNpmVersion(metadata);
    const versionData = version ? metadata?.versions?.[version] : null;
    const publishedAt = version ? metadata?.time?.[version] : null;
    if (!version || !versionData || !publishedAt) continue;
    leads.push(releaseLead({
      source: 'npm-registry',
      ecosystem: 'npm',
      name: metadata.name || packageName,
      version,
      publishedAt,
      url: packageMetadataUrl(config.sources.npm.metadataBaseUrl, metadata.name || packageName),
      feedCursor: row.seq ? `seq:${row.seq}` : row.id,
      summary: versionData.description || metadata.description || '',
      raw: { change: row, version: versionData },
    }));
  }
  return leads;
}

async function collectPypiLeads(config, fixturesDir) {
  const rssText = readFixture(fixturesDir, 'pypi_updates.xml', null) || await fetchText(config.sources.pypi.rssUrl);
  const updates = parseRssItems(rssText).map(parsePyPiRssItem).filter(Boolean).slice(0, config.maxPerSource);
  const leads = [];
  for (const update of updates) {
    const fixtureName = `pypi-${slugPart(update.project)}.json`;
    let projectJson = readFixtureJson(fixturesDir, fixtureName, null);
    if (!projectJson) {
      try {
        projectJson = await fetchJson(pypiJsonUrl(config.sources.pypi.jsonBaseUrl, update.project));
      } catch {
        continue;
      }
    }
    const info = projectJson.info || {};
    const files = projectJson.releases?.[update.version] || [];
    const publishedAt = files.map((file) => iso(file.upload_time_iso_8601)).filter(Boolean).sort()[0] || update.publishedAt;
    if (!info.name || !update.version || !publishedAt) continue;
    leads.push(releaseLead({
      source: 'pypi-rss',
      ecosystem: 'pypi',
      name: info.name,
      version: update.version,
      publishedAt,
      url: pypiJsonUrl(config.sources.pypi.jsonBaseUrl, info.name),
      feedCursor: update.cursor,
      summary: info.summary || '',
      raw: { update, files },
    }));
  }
  return leads;
}

async function collectGoLeads(config, fixturesDir, previousQueue, asOfDate) {
  const since = previousGoCursor(previousQueue, config.sinceHours, asOfDate);
  const fixtureText = readFixture(fixturesDir, 'go_index.jsonl', null);
  const rows = fixtureText
    ? parseGoIndexLines(fixtureText)
    : await fetchText(`${config.sources.go.indexUrl}?since=${encodeURIComponent(since)}`).then(parseGoIndexLines);
  const previousBoundary = new Set(previousQueue?.feed_cursors?.go?.boundary_keys || []);
  const leads = [];
  for (const row of rows.slice(0, config.maxPerSource)) {
    if (!row.Path || !row.Version || !row.Timestamp) continue;
    const key = goBoundaryKey(row);
    if (previousBoundary.has(key)) continue;
    leads.push(releaseLead({
      source: 'go-index',
      ecosystem: 'go',
      name: row.Path,
      version: row.Version,
      publishedAt: row.Timestamp,
      url: config.sources.go.indexUrl,
      feedCursor: row.Timestamp,
      summary: `Observed Go module release ${row.Path} ${row.Version}.`,
      raw: row,
    }));
  }
  return leads;
}

function parseOsvModifiedCsv(text, ecosystems, cutoff) {
  const wanted = new Set(ecosystems.map((ecosystem) => ecosystem.toLowerCase()));
  const rows = [];
  for (const line of String(text || '').split(/\r?\n/)) {
    if (!line.trim()) continue;
    const [modifiedAt, recordPath] = line.split(',', 2);
    const modified = parseDate(modifiedAt);
    if (!modified || modified < cutoff) break;
    const ecosystem = String(recordPath || '').split('/')[0];
    if (!wanted.has(ecosystem.toLowerCase())) continue;
    rows.push({ modifiedAt: modified.toISOString(), recordPath });
  }
  return rows;
}

async function collectOsvLeads(config, fixturesDir, asOfDate) {
  const cutoff = new Date(asOfDate.getTime() - config.sinceHours * 60 * 60 * 1000);
  const csvText = readFixture(fixturesDir, 'osv_modified_id.csv', null) || await fetchText(config.sources.osv.modifiedCsvUrl);
  const rows = parseOsvModifiedCsv(csvText, config.sources.osv.ecosystems, cutoff).slice(0, config.maxPerSource);
  const leads = [];
  for (const row of rows) {
    const fixtureName = `osv-${slugPart(row.recordPath)}.json`;
    let record = readFixtureJson(fixturesDir, fixtureName, null);
    if (!record) {
      try {
        record = await fetchJson(`${config.sources.osv.recordBaseUrl.replace(/\/$/, '')}/${row.recordPath}.json`);
      } catch {
        continue;
      }
    }
    leads.push(vulnerabilityLead({
      source: 'osv',
      id: record.id,
      aliases: record.aliases || [],
      title: record.summary || record.id,
      summary: record.details || record.summary || '',
      modifiedAt: record.modified || row.modifiedAt,
      publishedAt: record.published,
      url: `https://osv.dev/vulnerability/${record.id}`,
      affected: record.affected || [],
      databaseSpecific: record.database_specific,
      raw: record,
    }));
  }
  return leads;
}

function ghsaPackageEcosystem(ecosystem) {
  if (ecosystem === 'pip') return 'pypi';
  return ecosystem === 'go' ? 'go' : ecosystem;
}

async function collectGhsaLeads(config, fixturesDir) {
  const fixture = readFixtureJson(fixturesDir, 'ghsa_advisories.json', null);
  const advisories = [];
  if (fixture) {
    advisories.push(...fixture);
  } else {
    for (const type of config.sources.ghsa.types) {
      for (const ecosystem of config.sources.ghsa.ecosystems) {
        const url = `${config.sources.ghsa.url}?type=${encodeURIComponent(type)}&ecosystem=${encodeURIComponent(ecosystem)}&sort=updated&direction=desc&per_page=${config.maxPerSource}`;
        advisories.push(...await fetchJson(url, { 'X-GitHub-Api-Version': '2022-11-28' }));
      }
    }
  }
  return advisories.slice(0, config.maxPerSource * 2).map((advisory) => {
    const affected = (advisory.vulnerabilities || []).map((vuln) => ({
      package: {
        ecosystem: ghsaPackageEcosystem(vuln.package?.ecosystem),
        name: vuln.package?.name,
      },
      ranges: [],
      versions: [],
    }));
    return vulnerabilityLead({
      source: 'github-advisory',
      id: advisory.ghsa_id,
      aliases: [advisory.cve_id, advisory.ghsa_id].filter(Boolean),
      title: advisory.summary || advisory.ghsa_id,
      summary: advisory.description || advisory.summary || '',
      modifiedAt: advisory.updated_at || advisory.published_at,
      publishedAt: advisory.published_at,
      url: advisory.html_url || `https://github.com/advisories/${advisory.ghsa_id}`,
      affected,
      severity: advisory.severity,
      databaseSpecific: { type: advisory.type },
      raw: advisory,
    });
  });
}

function collectVulncheckLeads(indexPath) {
  if (!indexPath || !existsSync(path.resolve(repoRoot, indexPath))) return [];
  const index = readJson(indexPath);
  const candidates = Array.isArray(index.candidates) ? index.candidates : [];
  return candidates.map((candidate) => vulnerabilityLead({
    source: 'vulncheck-kev',
    id: candidate.cves?.[0] || candidate.candidate_key,
    aliases: candidate.cves || [],
    title: candidate.vulnerabilityName || candidate.shortDescription || candidate.candidate_key,
    summary: candidate.shortDescription || '',
    modifiedAt: candidate.vulncheck_date_added,
    publishedAt: candidate.vulncheck_date_added,
    url: candidate.vulncheck_exploitation_signal?.evidence_urls?.[0] || 'https://vulncheck.com/',
    affected: (candidate.cves || []).map((cve) => ({
      package: { ecosystem: 'cve', name: cve },
      versions: [],
    })),
    databaseSpecific: {
      non_authoritative: true,
      cisaDatePresent: Boolean(candidate.official_cisa_kev?.date_added),
      reportedExploitedByCanaries: Boolean(candidate.vulncheck_exploitation_signal?.reported_exploited_by_vulncheck_canaries),
    },
    raw: candidate,
  }));
}

export function loadCorpusIndex() {
  const incidents = readJson('data/supply-chain-incidents/incidents.json');
  const entitiesDir = 'data/supply-chain-entities';
  const entities = {};
  for (const file of ['actors', 'campaigns', 'packages', 'releases', 'repositories', 'organizations', 'maintainers']) {
    const filePath = path.join(entitiesDir, `${file}.json`);
    entities[file] = existsSync(path.resolve(repoRoot, filePath)) ? readJson(filePath) : [];
  }

  const texts = [];
  const subjectIds = new Set();
  const packages = new Map();
  const actors = [];
  const campaigns = [];

  for (const incident of incidents) {
    const incidentText = JSON.stringify(incident);
    texts.push(incidentText);
    subjectIds.add(`incident:${incident.id}`);
    for (const id of [...extractIds(incidentText).cves, ...extractIds(incidentText).ghsas, ...extractIds(incidentText).osvIds]) {
      subjectIds.add(id.toUpperCase());
    }
    for (const component of incident.affected_components || []) {
      if (component.package_url) subjectIds.add(component.package_url);
    }
  }

  for (const pkg of entities.packages || []) {
    if (pkg.package_url) subjectIds.add(pkg.package_url);
    if (pkg.name) packages.set(`${pkg.ecosystem || ''}:${normalizePackageName(pkg.ecosystem, pkg.name)}`, pkg);
  }
  for (const release of entities.releases || []) {
    if (release.purl) subjectIds.add(release.purl);
  }
  for (const actor of entities.actors || []) {
    actors.push({ id: actor.id, name: actor.name, aliases: uniqueStrings([actor.name, actor.aliases || []]) });
  }
  for (const campaign of entities.campaigns || []) {
    campaigns.push({ id: campaign.id, name: campaign.name, aliases: uniqueStrings([campaign.name, campaign.aliases || []]) });
  }

  return {
    incidents,
    entities,
    subjectIds,
    packages,
    actors,
    campaigns,
    latestCorpusIncidentAt: incidents.map((incident) => iso(incident.disclosed_at || incident.first_public_warning_at || incident.first_observed_at)).filter(Boolean).sort().at(-1) || null,
  };
}

function canonicalSubjectForLead(lead) {
  const ids = uniqueStrings([lead.cves || [], lead.ghsas || [], lead.osvIds || []]).map((id) => id.toUpperCase());
  if (ids.length > 0) return ids.sort()[0];
  if (lead.purl) return lead.purl;
  if (lead.ecosystem && lead.packageName && lead.version) return buildPurl(lead.ecosystem, lead.packageName, lead.version);
  if (lead.advisoryId) return lead.advisoryId;
  return `${lead.source}:${sha(`${lead.title}:${lead.url}`)}`;
}

function subjectTypeFor(subject) {
  if (/^CVE-/.test(subject)) return 'cve';
  if (/^GHSA-/.test(subject) || /^MAL-/.test(subject) || /^PYSEC-/.test(subject) || /^GO-/.test(subject)) return 'incident';
  if (subject.startsWith('pkg:')) return 'package';
  return 'incident';
}

function proposedArchetype(lead, subjectType) {
  if (subjectType === 'cve') return 'zero-day';
  if (lead.kind === 'release') return 'incident';
  if (lead.databaseSpecific?.type === 'malware' || /^MAL-/.test(lead.advisoryId || '')) return 'incident';
  return 'incident';
}

function isSupplyChainRelevant(lead, corpusIndex) {
  const text = `${lead.title || ''}\n${lead.summary || ''}\n${lead.packageName || ''}\n${lead.purl || ''}`;
  if (SUPPLY_CHAIN_TERMS.some((regex) => regex.test(text))) return true;
  if (lead.source === 'vulncheck-kev') return true;
  if (lead.affected?.some((item) => item.package?.ecosystem && ['npm', 'PyPI', 'pypi', 'Go', 'go'].includes(item.package.ecosystem))) return true;
  if (lead.ecosystem && lead.packageName && corpusIndex.packages.has(`${lead.ecosystem}:${normalizePackageName(lead.ecosystem, lead.packageName)}`)) return true;
  return false;
}

function connectivityHints(lead, corpusIndex) {
  const text = `${lead.title || ''}\n${lead.summary || ''}\n${lead.packageName || ''}`.toLowerCase();
  const actors = corpusIndex.actors
    .filter((actor) => actor.aliases.some((alias) => alias && text.includes(alias.toLowerCase())))
    .map((actor) => ({ id: actor.id, name: actor.name }));
  const campaigns = corpusIndex.campaigns
    .filter((campaign) => campaign.aliases.some((alias) => alias && text.includes(alias.toLowerCase())))
    .map((campaign) => ({ id: campaign.id, name: campaign.name }));
  const packages = [];
  if (lead.ecosystem && lead.packageName) {
    const existing = corpusIndex.packages.get(`${lead.ecosystem}:${normalizePackageName(lead.ecosystem, lead.packageName)}`);
    if (existing) packages.push({ id: existing.id, name: existing.name, ecosystem: existing.ecosystem });
  }
  for (const affected of lead.affected || []) {
    const ecosystem = String(affected?.package?.ecosystem || '').toLowerCase() === 'pypi'
      ? 'pypi'
      : String(affected?.package?.ecosystem || '').toLowerCase();
    const name = affected?.package?.name;
    if (!ecosystem || !name) continue;
    const existing = corpusIndex.packages.get(`${ecosystem}:${normalizePackageName(ecosystem, name)}`);
    if (existing && !packages.some((pkg) => pkg.id === existing.id)) {
      packages.push({ id: existing.id, name: existing.name, ecosystem: existing.ecosystem });
    }
  }
  return {
    actors,
    campaigns,
    packages,
    malwareFamilies: uniqueStrings([lead.raw?.database_specific?.malware_family, lead.raw?.databaseSpecific?.malware_family]).map((name) => ({ name })),
  };
}

function computeActiveStatus(lead, config, now) {
  const sourced = lead.source === 'vulncheck-kev' ||
    lead.databaseSpecific?.type === 'malware' ||
    /^MAL-/.test(lead.advisoryId || '') ||
    /exploited in the wild|active exploitation/i.test(`${lead.title || ''} ${lead.summary || ''}`);
  if (!sourced) {
    return {
      activeStatus: 'none',
      effectiveActiveStatus: 'none',
      activeStatusSourceRefs: [],
      activeStatusExpiresAt: null,
      needsReverify: false,
    };
  }
  const basis = lead.source === 'vulncheck-kev' ? 'vulncheck-kev' : lead.advisoryId || lead.source;
  const verifiedAt = parseDate(lead.lastMaterialActivityAt) || now;
  const expires = new Date(verifiedAt.getTime() + config.activeStatus.defaultExpiryDays * 86400000);
  const effective = expires >= now ? 'exploited_in_wild' : 'none';
  return {
    activeStatus: 'exploited_in_wild',
    effectiveActiveStatus: effective,
    activeStatusSourceRefs: [basis],
    activeStatusLastVerifiedAt: verifiedAt.toISOString(),
    activeStatusExpiresAt: expires.toISOString(),
    needsReverify: effective === 'none',
  };
}

function computeManualOverrideValidity(lead, now) {
  const override = lead.manualOverride;
  if (!override) return { valid: false, errors: [] };
  const errors = [];
  if (override.by !== 'KernelK') errors.push('manualOverride.by must be KernelK');
  if (!override.reason) errors.push('manualOverride.reason is required');
  if (!override.expiresAt) errors.push('manualOverride.expiresAt is required');
  const expires = parseDate(override.expiresAt);
  return { valid: errors.length === 0 && expires && expires >= now && override.value === true, errors };
}

function daysBetween(now, earlier) {
  const date = parseDate(earlier);
  if (!date) return Infinity;
  return Math.floor((now.getTime() - date.getTime()) / 86400000);
}

function computeKevStatus(lead, active, config, now) {
  const kev = lead.kev || {};
  if (!kev.isKev) return null;
  if (daysBetween(now, kev.kevUpdatedAt) <= config.kev.recentlyAddedDays || daysBetween(now, kev.kevAddedAt) <= config.kev.recentlyAddedDays) {
    return 'recently_added';
  }
  const due = parseDate(kev.kevDueAt);
  if (due && now <= due) return 'due_open';
  if (due && now <= new Date(due.getTime() + config.kev.overdueGraceDays * 86400000)) return 'due_overdue';
  if (daysBetween(now, lead.lastMaterialActivityAt) > config.kev.agedDays && active.effectiveActiveStatus === 'none') return 'aged';
  return 'listed';
}

function classifyFreshness(lead, active, manual, kevStatus, config, now) {
  const activityAgeDays = daysBetween(now, lead.lastMaterialActivityAt);
  const currentReasons = [];
  if (manual.valid) currentReasons.push('manual override active');
  if (active.effectiveActiveStatus !== 'none') currentReasons.push(`active status ${active.effectiveActiveStatus}`);
  if (['recently_added', 'due_open', 'due_overdue'].includes(kevStatus)) currentReasons.push(`KEV ${kevStatus}`);
  if (activityAgeDays <= config.currentWindowDays) currentReasons.push(`material activity within ${config.currentWindowDays} days`);
  const leadClass = currentReasons.length > 0 ? 'current' : 'historical';
  return {
    leadClass,
    leadClassReason: currentReasons.join('; ') || `no material activity within ${config.currentWindowDays} days and no active/KEV/manual currency signal`,
  };
}

function rankLead(lead, classification, hints, duplicate) {
  let rank = 0;
  const reasons = [];
  if (classification.leadClass === 'current') {
    rank += 20;
    reasons.push('current lead');
  }
  if (classification.effectiveActiveStatus !== 'none') {
    rank += 25;
    reasons.push('active exploitation or malware signal');
  }
  if (lead.source === 'vulncheck-kev') {
    rank += 14;
    reasons.push('VulnCheck exploitation signal');
  }
  if (lead.source === 'github-advisory' || lead.source === 'osv') {
    rank += 14;
    reasons.push('advisory database signal');
  }
  if (hints.actors.length || hints.campaigns.length || hints.packages.length) {
    rank += 18;
    reasons.push('connects to existing Supply Chain graph');
  }
  if (duplicate) {
    rank += 8;
    reasons.push('matches existing corpus subject; route as enrichment/reverify');
  }
  if (SUPPLY_CHAIN_TERMS.some((regex) => regex.test(`${lead.title || ''} ${lead.summary || ''}`))) {
    rank += 12;
    reasons.push('supply-chain term match');
  }
  if (lead.kind === 'release' && reasons.length <= 1) {
    rank -= 20;
    reasons.push('release-only trigger without corroborating signal');
  }
  return { rank: Math.max(0, Math.min(100, rank)), rankReasons: reasons };
}

function chooseWorkIntent(entityMatch, leadClass) {
  if (entityMatch === 'ambiguous') return 'disambiguate';
  if (entityMatch === 'matched') return leadClass === 'current' ? 'reverify_existing' : 'enrich_existing';
  return 'create_article';
}

export function classifyLeads(rawLeads, { config, corpusIndex, now }) {
  const grouped = new Map();
  for (const lead of rawLeads) {
    const canonicalSubjectId = canonicalSubjectForLead(lead);
    const current = grouped.get(canonicalSubjectId) || [];
    current.push(lead);
    grouped.set(canonicalSubjectId, current);
  }

  const candidates = [];
  const rejected = [];
  for (const [canonicalSubjectId, leads] of grouped.entries()) {
    const primary = leads.sort((a, b) => String(b.lastMaterialActivityAt || '').localeCompare(String(a.lastMaterialActivityAt || '')))[0];
    if (!isSupplyChainRelevant(primary, corpusIndex)) {
      rejected.push({ canonicalSubjectId, reason: 'not_supply_chain_relevant', mergedLeadRefs: leads.map((lead) => lead.leadRef) });
      continue;
    }
    const subjectType = subjectTypeFor(canonicalSubjectId);
    const duplicate = corpusIndex.subjectIds.has(canonicalSubjectId);
    const hints = connectivityHints(primary, corpusIndex);
    const entityMatch = duplicate || hints.packages.length > 0 ? 'matched' : 'new';
    const active = computeActiveStatus(primary, config, now);
    const manual = computeManualOverrideValidity(primary, now);
    const kevStatus = computeKevStatus(primary, active, config, now);
    const freshness = classifyFreshness(primary, active, manual, kevStatus, config, now);
    const workIntent = chooseWorkIntent(entityMatch, freshness.leadClass);
    const ranking = rankLead(primary, { ...freshness, ...active }, hints, duplicate);

    candidates.push({
      candidateId: `SC-CAND-${sha(canonicalSubjectId, 16)}`,
      canonicalSubjectId,
      subjectType,
      proposedArchetype: proposedArchetype(primary, subjectType),
      title: primary.title,
      summary: primary.summary,
      sources: uniqueStrings(leads.map((lead) => lead.source)).sort(),
      sourceRefs: uniqueStrings(leads.map((lead) => lead.url)).filter(Boolean),
      mergedLeadRefs: leads.map((lead) => lead.leadRef).sort(),
      firstSeenAt: leads.map((lead) => lead.publishedAt || lead.observedAt).filter(Boolean).sort()[0] || null,
      lastMaterialActivityAt: primary.lastMaterialActivityAt,
      activityBasis: uniqueStrings([
        primary.kind === 'release' ? 'registry_release_observed' : 'advisory_updated',
        active.effectiveActiveStatus !== 'none' ? 'active_exploitation_or_malware_signal' : null,
        kevStatus ? `kev_${kevStatus}` : null,
      ]),
      entityMatch,
      matchedEntityHints: hints,
      classification: {
        leadClass: freshness.leadClass,
        leadClassReason: freshness.leadClassReason,
        workIntent,
        routingPriority: ranking.rank >= 70 ? 'p0' : ranking.rank >= 50 ? 'p1' : ranking.rank >= 25 ? 'p2' : 'p3',
        effectiveActiveStatus: active.effectiveActiveStatus,
        activeStatus: active.activeStatus,
        activeStatusExpiresAt: active.activeStatusExpiresAt,
        needsReverify: active.needsReverify,
        kevStatusDerived: kevStatus,
        kevStatusIsAuthoredTruth: false,
        manualOverrideValid: manual.valid,
        manualOverrideErrors: manual.errors,
      },
      rank: ranking.rank,
      rankReasons: ranking.rankReasons,
      queueAction: 'candidate_review',
      draftingAllowed: false,
      autoDraftingBlockedReason: 'B1 discovery/classification stops at candidate queue; grounded drafting is not implemented in this sprint.',
    });
  }

  return { candidates, rejected };
}

function candidateSort(a, b) {
  const classWeight = { current: 1, historical: 0 };
  const aw = classWeight[a.classification.leadClass] || 0;
  const bw = classWeight[b.classification.leadClass] || 0;
  if (aw !== bw) return bw - aw;
  if (a.rank !== b.rank) return b.rank - a.rank;
  return String(b.lastMaterialActivityAt || '').localeCompare(String(a.lastMaterialActivityAt || ''));
}

export function validateCandidateQueue(queue) {
  const errors = [];
  if (queue?.schema_version !== 'threatpedia-supply-chain-candidate-queue/1') errors.push('schema_version must be threatpedia-supply-chain-candidate-queue/1');
  if (queue?.drafting_enabled !== false) errors.push('drafting_enabled must be false');
  if (queue?.auto_drafting_allowed !== false) errors.push('auto_drafting_allowed must be false');
  const ids = new Set();
  for (const [index, candidate] of (queue?.candidates || []).entries()) {
    if (!candidate.canonicalSubjectId) errors.push(`candidates[${index}].canonicalSubjectId is required`);
    if (!candidate.classification?.workIntent) errors.push(`candidates[${index}].classification.workIntent is required`);
    if (!['current', 'historical'].includes(candidate.classification?.leadClass)) errors.push(`candidates[${index}].classification.leadClass invalid`);
    if (!candidate.classification?.leadClassReason) errors.push(`candidates[${index}].classification.leadClassReason is required`);
    if (candidate.draftingAllowed !== false) errors.push(`candidates[${index}].draftingAllowed must be false`);
    if (candidate.classification?.kevStatusIsAuthoredTruth !== false) errors.push(`candidates[${index}].classification.kevStatusIsAuthoredTruth must be false`);
    if (ids.has(candidate.candidateId)) errors.push(`duplicate candidateId ${candidate.candidateId}`);
    ids.add(candidate.candidateId);
  }
  return errors;
}

async function collectRawLeads(config, args, previousQueue, asOfDate) {
  const fixturesDir = args.fixturesDir;
  const results = [];
  const errors = [];
  const collectors = [
    ['npm', () => config.sources.npm.enabled ? collectNpmLeads(config, fixturesDir) : []],
    ['pypi', () => config.sources.pypi.enabled ? collectPypiLeads(config, fixturesDir) : []],
    ['go', () => config.sources.go.enabled ? collectGoLeads(config, fixturesDir, previousQueue, asOfDate) : []],
    ['osv', () => config.sources.osv.enabled ? collectOsvLeads(config, fixturesDir, asOfDate) : []],
    ['ghsa', () => config.sources.ghsa.enabled ? collectGhsaLeads(config, fixturesDir) : []],
    ['vulncheck-kev', () => config.sources.vulncheck.enabled ? collectVulncheckLeads(args.vulncheckIndex) : []],
  ];
  for (const [name, collector] of collectors) {
    try {
      const leads = await collector();
      results.push(...leads);
    } catch (error) {
      errors.push({ source: name, error: error.message });
    }
  }
  return { leads: results, errors };
}

function feedCursorsFromLeads(leads, previousQueue) {
  const goLeads = leads.filter((lead) => lead.source === 'go-index' && lead.feedCursor);
  const goCursor = goLeads.map((lead) => lead.feedCursor).sort().at(-1) || previousQueue?.feed_cursors?.go?.cursor || null;
  const maxGoCursor = goCursor ? parseDate(goCursor)?.getTime() : null;
  const boundaryKeys = maxGoCursor
    ? goLeads
        .filter((lead) => parseDate(lead.feedCursor)?.getTime() === maxGoCursor)
        .map((lead) => `${lead.packageName}\t${lead.version}\t${lead.feedCursor}`)
    : previousQueue?.feed_cursors?.go?.boundary_keys || [];
  return {
    go: { cursor: goCursor, boundary_keys: uniqueStrings(boundaryKeys).sort() },
  };
}

export async function buildCandidateQueue(args = parseArgs()) {
  const config = loadB1Config(args);
  const asOfDate = nowDate(args);
  if (!asOfDate) throw new Error(`Invalid --as-of value: ${args.asOf}`);
  const previousQueue = readPreviousQueue(config.queuePath);
  const corpusIndex = loadCorpusIndex();
  const { leads, errors } = await collectRawLeads(config, args, previousQueue, asOfDate);
  const { candidates, rejected } = classifyLeads(leads, { config, corpusIndex, now: asOfDate });
  const emitted = candidates
    .filter((candidate) => candidate.rank >= config.minRank)
    .sort(candidateSort)
    .slice(0, config.maxCandidates);
  const latestDiscoverySignalAt = emitted
    .map((candidate) => iso(candidate.lastMaterialActivityAt))
    .filter(Boolean)
    .sort()
    .at(-1) || null;

  return {
    schema_version: 'threatpedia-supply-chain-candidate-queue/1',
    generated_at: new Date().toISOString(),
    mode: args.execute ? 'live' : 'dry-run',
    drafting_enabled: false,
    auto_drafting_allowed: false,
    queue_action: 'candidate_review_only',
    boundaries: {
      no_auto_drafting: true,
      no_corpus_import: true,
      no_article_tasks_created: true,
      grounded_drafting_required_before_dispatch: true,
    },
    config: {
      current_window_days: config.currentWindowDays,
      since_hours: config.sinceHours,
      max_per_source: config.maxPerSource,
      max_candidates: config.maxCandidates,
      min_rank: config.minRank,
      queue_path: config.queuePath,
    },
    summary: {
      raw_leads_loaded: leads.length,
      deduped_subjects: new Set(leads.map(canonicalSubjectForLead)).size,
      rejected_low_relevance: rejected.length,
      classifier_candidates: candidates.length,
      candidates_emitted: emitted.length,
      current_candidates: emitted.filter((candidate) => candidate.classification.leadClass === 'current').length,
      matched_existing: emitted.filter((candidate) => candidate.entityMatch === 'matched').length,
      collector_errors: errors.length,
    },
    currency: {
      latest_corpus_incident_at: corpusIndex.latestCorpusIncidentAt,
      latest_discovery_signal_at: latestDiscoverySignalAt,
      pending_candidate_count: emitted.length,
      pending_current_count: emitted.filter((candidate) => candidate.classification.leadClass === 'current').length,
      graph_latest_reflects: latestDiscoverySignalAt && (!corpusIndex.latestCorpusIncidentAt || latestDiscoverySignalAt > corpusIndex.latestCorpusIncidentAt)
        ? 'discovery'
        : 'corpus',
    },
    feed_cursors: feedCursorsFromLeads(leads, previousQueue),
    collector_errors: errors,
    rejected,
    candidates: emitted,
  };
}

async function run() {
  const args = parseArgs();
  if (args.check) {
    const queuePath = args.queuePath || args.out || DEFAULT_QUEUE_PATH;
    const queue = readJson(queuePath);
    const errors = validateCandidateQueue(queue);
    if (errors.length > 0) {
      errors.forEach((error) => console.error(`[supply-chain-live-discovery] ${error}`));
      process.exit(1);
    }
    console.log(`Supply Chain candidate queue PASS: candidates=${queue.candidates?.length || 0}`);
    return;
  }
  const queue = await buildCandidateQueue(args);
  const errors = validateCandidateQueue(queue);
  if (errors.length > 0) throw new Error(`candidate queue validation failed: ${errors.join('; ')}`);
  if (args.execute) writeJson(queue.config.queue_path, queue);
  if (args.out) writeJson(args.out, queue);
  process.stdout.write(`${JSON.stringify(queue, null, 2)}\n`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  run().catch((error) => {
    console.error(`[supply-chain-live-discovery] ERROR: ${error.message}`);
    process.exit(1);
  });
}
