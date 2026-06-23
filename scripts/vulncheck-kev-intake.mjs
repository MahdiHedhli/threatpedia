#!/usr/bin/env node
/**
 * ROAD-014 Slice 1: bounded recent-first VulnCheck KEV intake.
 *
 * This helper is intentionally source-packet-prefill only. It fetches the
 * VulnCheck KEV backup once per run, selects recent entries by top-level
 * date_added, filters already-seen CVEs, and emits prioritization artifacts.
 * Production mode writes source-packet prefill artifacts only; it does not
 * create article tasks, draft articles, or treat VulnCheck as official CISA
 * KEV authority.
 */

import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as sleep } from 'node:timers/promises';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { loadPipelineConfig } from './pipeline-config.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DEFAULT_ENDPOINT = 'https://api.vulncheck.com/v3/backup/vulncheck-kev';
const DEFAULT_LOOKBACK_DAYS = 30;
const DEFAULT_MAX_CANDIDATES = 25;
const DEFAULT_LOCAL_THROTTLE_MS = 250;
const DEFAULT_CACHE_TTL_MINUTES = 60;
const DEFAULT_SOURCE_PACKET_DIR = '.github/pipeline/source-packets/vulncheck-kev';
const DEFAULT_CANDIDATE_INDEX_PATH = '.github/pipeline/source-packets/vulncheck-kev/latest.json';
const DEFAULT_SIBLING_LIMIT = 4;
const CVE_RE = /\bCVE-\d{4}-\d{4,}\b/gi;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const PRODUCT_NORMALIZATION_BY_CVE = new Map([
  ['CVE-2025-12352', { vendorProject: 'rocketgenius', product: 'gravityforms' }],
  ['CVE-2026-6433', { vendorProject: 'custom_css_js_php_project', product: 'custom_css_js_php' }],
]);

export function usage() {
  console.log([
    'Usage:',
    '  node scripts/vulncheck-kev-intake.mjs --dry-run [options]',
    '  node scripts/vulncheck-kev-intake.mjs --execute [options]',
    '',
    'Options:',
    '  --execute                       Write production source-packet prefill artifacts',
    '  --input <backup.json>            Read a saved VulnCheck KEV backup JSON instead of fetching',
    '  --out <path>                     Write dry-run artifact JSON to this path',
    '  --source-packet-dir <path>       Production prefill artifact directory',
    '  --candidate-index <path>         Production latest candidate index path',
    '  --env-file <path>                Explicit key=value env file for VULNCHECKAPI or VULNCHECK_API_TOKEN',
    '  --lookback-days <n>              Recent window, default from config or 30',
    '  --max-candidates <n>             Maximum emitted candidates, default from config or 25',
    '  --disable-backlog-fill           Do not fill from older unhandled candidates after recent window',
    '  --sibling-limit <n>              Max emitted sibling CVEs per vendor/product/date, default 4',
    '  --as-of <YYYY-MM-DD>             Deterministic date for lookback cutoff, default today UTC',
    '  --cache <path>                   Optional backup cache path',
    '  --cache-ttl-minutes <n>          Cache TTL, default from config or 60',
    '  --seen-cves <CVE-...[,CVE-...]>  Extra seen CVEs for tests/manual filtering',
    '  --include-seen                   Report already-seen CVEs instead of filtering them',
    '  --endpoint <url>                 Override backup endpoint',
    '',
    'Live fetches require VULNCHECKAPI or VULNCHECK_API_TOKEN. Tokens are never printed.',
  ].join('\n'));
}

export function parseArgs(argv) {
  const args = {
    dryRun: true,
    execute: false,
    input: null,
    out: null,
    sourcePacketDir: null,
    candidateIndex: null,
    envFile: null,
    lookbackDays: null,
    maxCandidates: null,
    backlogFill: null,
    siblingLimit: null,
    asOf: null,
    cache: null,
    cacheTtlMinutes: null,
    seenCves: [],
    includeSeen: false,
    endpoint: null,
    localThrottleMs: null,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    const next = argv[i + 1];
    switch (token) {
      case '--dry-run':
        args.dryRun = true;
        args.execute = false;
        break;
      case '--execute':
        args.execute = true;
        args.dryRun = false;
        break;
      case '--input':
        if (!next) throw new Error('Missing value for --input');
        args.input = next;
        i += 1;
        break;
      case '--out':
        if (!next) throw new Error('Missing value for --out');
        args.out = next;
        i += 1;
        break;
      case '--source-packet-dir':
        if (!next) throw new Error('Missing value for --source-packet-dir');
        args.sourcePacketDir = next;
        i += 1;
        break;
      case '--candidate-index':
        if (!next) throw new Error('Missing value for --candidate-index');
        args.candidateIndex = next;
        i += 1;
        break;
      case '--env-file':
        if (!next) throw new Error('Missing value for --env-file');
        args.envFile = next;
        i += 1;
        break;
      case '--lookback-days':
        if (!next) throw new Error('Missing value for --lookback-days');
        args.lookbackDays = positiveInteger(next, '--lookback-days');
        i += 1;
        break;
      case '--max-candidates':
        if (!next) throw new Error('Missing value for --max-candidates');
        args.maxCandidates = positiveInteger(next, '--max-candidates');
        i += 1;
        break;
      case '--disable-backlog-fill':
        args.backlogFill = false;
        break;
      case '--sibling-limit':
        if (!next) throw new Error('Missing value for --sibling-limit');
        args.siblingLimit = positiveInteger(next, '--sibling-limit');
        i += 1;
        break;
      case '--as-of':
        if (!next) throw new Error('Missing value for --as-of');
        if (!ISO_DATE_RE.test(next)) throw new Error('--as-of must be YYYY-MM-DD');
        args.asOf = next;
        i += 1;
        break;
      case '--cache':
        if (!next) throw new Error('Missing value for --cache');
        args.cache = next;
        i += 1;
        break;
      case '--cache-ttl-minutes':
        if (!next) throw new Error('Missing value for --cache-ttl-minutes');
        args.cacheTtlMinutes = positiveInteger(next, '--cache-ttl-minutes');
        i += 1;
        break;
      case '--seen-cves':
        if (!next) throw new Error('Missing value for --seen-cves');
        args.seenCves.push(...splitCves(next));
        i += 1;
        break;
      case '--include-seen':
        args.includeSeen = true;
        break;
      case '--endpoint':
        if (!next) throw new Error('Missing value for --endpoint');
        args.endpoint = next;
        i += 1;
        break;
      case '--local-throttle-ms':
        if (!next) throw new Error('Missing value for --local-throttle-ms');
        args.localThrottleMs = positiveInteger(next, '--local-throttle-ms');
        i += 1;
        break;
      case '--help':
      case '-h':
        usage();
        process.exit(0);
        break;
      default:
        throw new Error(`Unknown argument: ${token}`);
    }
  }

  return args;
}

function positiveInteger(value, name) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed < 1) throw new Error(`${name} must be a positive integer`);
  return parsed;
}

function splitCves(value) {
  return String(value || '')
    .split(',')
    .map(item => item.trim().toUpperCase())
    .filter(item => /^CVE-\d{4}-\d{4,}$/.test(item));
}

function normalizeDate(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  const match = value.match(/^(\d{4}-\d{2}-\d{2})/);
  if (!match) return null;
  const parsed = Date.parse(`${match[1]}T00:00:00Z`);
  return Number.isNaN(parsed) ? null : match[1];
}

function parseTimestamp(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function uniqueStrings(values) {
  return [...new Set((Array.isArray(values) ? values : [])
    .filter(value => typeof value === 'string' && value.trim())
    .map(value => value.trim()))];
}

function readJson(path) {
  return JSON.parse(readFileSync(resolve(ROOT, path), 'utf8'));
}

function writeJson(path, payload) {
  const abs = resolve(ROOT, path);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, `${JSON.stringify(payload, null, 2)}\n`);
}

function loadConfigDefaults(args) {
  const config = loadPipelineConfig();
  const vc = config.discovery_sources?.vulncheck_kev || {};
  return {
    enabled: vc.enabled === true,
    endpoint: args.endpoint || vc.backup_url || DEFAULT_ENDPOINT,
    lookbackDays: args.lookbackDays || vc.lookback_days || DEFAULT_LOOKBACK_DAYS,
    maxCandidates: args.maxCandidates || vc.max_candidates || DEFAULT_MAX_CANDIDATES,
    localThrottleMs: args.localThrottleMs || vc.local_throttle_ms || DEFAULT_LOCAL_THROTTLE_MS,
    cacheTtlMinutes: args.cacheTtlMinutes || vc.cache_ttl_minutes || DEFAULT_CACHE_TTL_MINUTES,
    backlogFill: args.backlogFill ?? (vc.backlog_fill !== false),
    siblingLimit: args.siblingLimit || vc.sibling_limit_per_vendor_product_day || DEFAULT_SIBLING_LIMIT,
    sourcePacketDir: args.sourcePacketDir || vc.source_packet_dir || DEFAULT_SOURCE_PACKET_DIR,
    candidateIndex: args.candidateIndex || vc.candidate_index_path || DEFAULT_CANDIDATE_INDEX_PATH,
  };
}

function tokenFromEnvFile(path) {
  if (!path) return null;
  const abs = resolve(ROOT, path);
  const name = basename(abs);
  if (name.startsWith('.env.')) {
    throw new Error('Refusing to read .env.* files; pass a process environment variable or a non-suffixed env file explicitly');
  }
  const text = readFileSync(abs, 'utf8');
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const normalized = line.startsWith('export ') ? line.slice('export '.length).trim() : line;
    const index = normalized.indexOf('=');
    if (index === -1) continue;
    const key = normalized.slice(0, index).trim();
    let value = normalized.slice(index + 1).trim();
    if (!['VULNCHECKAPI', 'VULNCHECK_API_TOKEN'].includes(key)) continue;
    if (value.length >= 2 && value[0] === value[value.length - 1] && ['"', "'"].includes(value[0])) {
      value = value.slice(1, -1);
    }
    if (value) return value;
  }
  return null;
}

function readToken(args) {
  const token = process.env.VULNCHECKAPI || process.env.VULNCHECK_API_TOKEN || tokenFromEnvFile(args.envFile);
  if (!token || !token.trim()) {
    throw new Error('VulnCheck token not available; set VULNCHECKAPI or VULNCHECK_API_TOKEN, or pass --env-file explicitly');
  }
  return token.trim();
}

async function fetchJsonWithRetry({ url, headers = {}, localThrottleMs, retries = 2, label }) {
  if (localThrottleMs > 0) await sleep(localThrottleMs);

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    let response;
    try {
      response = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json', 'User-Agent': 'threatpedia-vulncheck-kev-intake/1.0', ...headers },
      });
    } catch (error) {
      if (attempt < retries) {
        await sleep(1000 * (2 ** attempt));
        continue;
      }
      throw error;
    }

    if (response.status === 429 && attempt < retries) {
      const retryAfter = Number.parseInt(response.headers.get('retry-after') || '', 10);
      const waitMs = Number.isInteger(retryAfter) ? retryAfter * 1000 : 1000 * (2 ** attempt);
      await sleep(waitMs);
      continue;
    }

    if (!response.ok) {
      if (response.status >= 500 && attempt < retries) {
        await sleep(1000 * (2 ** attempt));
        continue;
      }
      let errorSummary = `${response.status} ${response.statusText}`;
      try {
        const body = await response.json();
        if (Array.isArray(body?.errors)) errorSummary = `${errorSummary}: ${body.errors.join('; ')}`;
      } catch {
        // Keep the status-only message; do not dump arbitrary response bodies.
      }
      throw new Error(`${label} fetch failed: ${errorSummary}`);
    }

    const bytes = Buffer.from(await response.arrayBuffer());
    return parseJsonPayload(bytes, label);
  }

  throw new Error(`${label} fetch failed after retry budget`);
}

function parseJsonPayload(bytes, label) {
  if (bytes.length >= 4 && bytes[0] === 0x50 && bytes[1] === 0x4b) {
    const tempDir = mkdtempSync(join(tmpdir(), 'threatpedia-vulncheck-'));
    const zipPath = join(tempDir, 'backup.zip');
    try {
      writeFileSync(zipPath, bytes);
      const jsonBytes = execFileSync('unzip', ['-p', zipPath], { maxBuffer: 200 * 1024 * 1024 });
      return JSON.parse(jsonBytes.toString('utf8'));
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  }

  try {
    return JSON.parse(bytes.toString('utf8'));
  } catch (error) {
    throw new Error(`${label} response was not JSON or a supported ZIP JSON payload: ${error.message}`);
  }
}

async function fetchBackup({ endpoint, token, localThrottleMs }) {
  const descriptor = await fetchJsonWithRetry({
    url: endpoint,
    headers: { Authorization: `Bearer ${token}` },
    localThrottleMs,
    label: 'VulnCheck backup descriptor',
  });

  const backupUrl = backupPayloadUrl(descriptor);
  if (!backupUrl) return descriptor;

  return fetchJsonWithRetry({
    url: backupUrl,
    localThrottleMs,
    label: 'VulnCheck backup payload',
  });
}

function cacheFresh(path, ttlMinutes) {
  if (!path) return false;
  const abs = resolve(ROOT, path);
  if (!existsSync(abs)) return false;
  const ageMs = Date.now() - statSync(abs).mtimeMs;
  return ageMs <= ttlMinutes * 60 * 1000;
}

async function loadBackup(args, defaults) {
  if (args.input) return { payload: readJson(args.input), source: 'input' };

  if (args.cache && cacheFresh(args.cache, defaults.cacheTtlMinutes)) {
    return { payload: readJson(args.cache), source: 'cache' };
  }

  const token = readToken(args);
  const payload = await fetchBackup({
    endpoint: defaults.endpoint,
    token,
    localThrottleMs: defaults.localThrottleMs,
  });

  if (args.cache) writeJson(args.cache, payload);
  return { payload, source: 'live' };
}

function listFilesRecursive(root, predicate) {
  const absRoot = resolve(ROOT, root);
  if (!existsSync(absRoot)) return [];
  const files = [];
  const stack = [absRoot];
  while (stack.length) {
    const current = stack.pop();
    const stat = statSync(current);
    if (stat.isDirectory()) {
      for (const entry of readdirSync(current)) stack.push(join(current, entry));
    } else if (!predicate || predicate(current)) {
      files.push(current);
    }
  }
  return files;
}

function extractCvesFromText(text) {
  const value = String(text || '');
  const cves = [...value.matchAll(CVE_RE)].map(match => match[0].toUpperCase());
  for (const match of value.matchAll(/\bCVE-(\d{4})-(\d{4,7})-(\d{1,7})(?=\D|$)/gi)) {
    const [, year, baseNumber, suffix] = match;
    let expandedNumber = null;
    if (suffix.length >= 4 && suffix.length <= 7) {
      expandedNumber = suffix;
    } else if (suffix.length < baseNumber.length) {
      const baseTail = baseNumber.slice(baseNumber.length - suffix.length);
      if (Number.parseInt(suffix, 10) <= Number.parseInt(baseTail, 10)) continue;
      expandedNumber = `${baseNumber.slice(0, baseNumber.length - suffix.length)}${suffix}`;
    }
    if (!expandedNumber || Number.parseInt(expandedNumber, 10) <= Number.parseInt(baseNumber, 10)) continue;
    cves.push(`CVE-${year}-${expandedNumber}`.toUpperCase());
  }
  return uniqueStrings(cves);
}

function collectSeenCves(extra = []) {
  const seen = new Set(extra.map(cve => cve.toUpperCase()));
  const files = [
    ...listFilesRecursive('.github/pipeline/tasks', file => extname(file) === '.json'),
    ...listFilesRecursive('.github/pipeline/source-packets', file => extname(file) === '.json' && !file.includes(`${join('source-packets', 'fixtures')}`)),
    ...listFilesRecursive('site/src/content/zero-days', file => ['.md', '.mdx'].includes(extname(file))),
  ];

  for (const file of files) {
    try {
      for (const cve of extractCvesFromText(readFileSync(file, 'utf8'))) seen.add(cve);
    } catch {
      // Ignore unreadable state files; the intake path should still be inspectable.
    }
  }
  return seen;
}

function asRecords(payload) {
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  throw new Error('VulnCheck backup JSON must contain a data array');
}

function backupPayloadUrl(payload) {
  const candidate = Array.isArray(payload?.data) ? payload.data[0]?.url : null;
  if (typeof candidate !== 'string') return null;
  try {
    const parsed = new URL(candidate);
    if (!['http:', 'https:'].includes(parsed.protocol)) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

function candidateKey(record) {
  const cves = uniqueStrings(record.cve).join('+') || 'unknown-cve';
  return `vulncheck-kev:${cves}:${normalizeDate(record.date_added) || 'unknown-date'}`;
}

function candidateFileStem(candidate) {
  const cve = candidate.cves[0] || 'unknown-cve';
  const date = candidate.vulncheck_date_added || 'unknown-date';
  return `prefill-${cve.toLowerCase()}-${date}`;
}

function siblingKey(candidate) {
  return [
    String(candidate.vendorProject || 'unknown').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    String(candidate.product || 'unknown').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    candidate.vulncheck_date_added || 'unknown-date',
  ].join(':');
}

function sourceRefsFor(record) {
  const urls = [];
  for (const item of Array.isArray(record.vulncheck_reported_exploitation) ? record.vulncheck_reported_exploitation : []) {
    if (typeof item?.url === 'string' && item.url.startsWith('http')) urls.push(item.url);
  }
  for (const item of xdbEntriesFor(record)) {
    if (typeof item?.xdb_url === 'string' && item.xdb_url.startsWith('http')) urls.push(item.xdb_url);
  }
  return uniqueStrings(urls);
}

function xdbEntriesFor(record) {
  const cves = new Set(uniqueStrings(record?.cve));
  return (Array.isArray(record?.vulncheck_xdb) ? record.vulncheck_xdb : []).filter((item) => {
    const cloneCves = extractCvesFromText(item?.clone_ssh_url || '');
    if (!cloneCves.length) return true;
    return cloneCves.some((cve) => cves.has(cve));
  });
}

function exploitTypes(record) {
  return uniqueStrings(xdbEntriesFor(record).map(item => item?.exploit_type));
}

function priorityScore(record, addedDate) {
  let score = 0;
  const reasons = [];
  const reported = Array.isArray(record.vulncheck_reported_exploitation) ? record.vulncheck_reported_exploitation.length : 0;
  const xdb = xdbEntriesFor(record).length;

  if (addedDate) {
    score += 30;
    reasons.push('recent VulnCheck date_added');
  }
  if (record.cisa_date_added) {
    score += 20;
    reasons.push('CISA date present in VulnCheck record; verify against CISA before official labeling');
  }
  if (record.reported_exploited_by_vulncheck_canaries === true) {
    score += 18;
    reasons.push('VulnCheck canary exploitation signal');
  }
  if (reported > 0) {
    score += Math.min(20, reported * 4);
    reasons.push(`${reported} VulnCheck reported exploitation reference(s)`);
  }
  if (xdb > 0) {
    score += Math.min(16, xdb * 2);
    reasons.push(`${xdb} VulnCheck XDB reference(s)`);
  }
  if (String(record.knownRansomwareCampaignUse || '').toLowerCase() === 'known') {
    score += 12;
    reasons.push('known ransomware campaign use field');
  }

  return { score, reasons };
}

function normalizeKnownProductFields(record) {
  const cves = uniqueStrings(record?.cve);
  for (const cve of cves) {
    const normalized = PRODUCT_NORMALIZATION_BY_CVE.get(cve);
    if (!normalized) continue;
    return {
      ...record,
      vendorProject: record.vendorProject || normalized.vendorProject,
      product: record.product || normalized.product,
    };
  }
  return record;
}

function makePrefill(rawRecord) {
  const record = normalizeKnownProductFields(rawRecord);
  const cves = uniqueStrings(record.cve);
  const cwes = uniqueStrings(record.cwes);
  const refs = sourceRefsFor(record);
  const cisaDate = normalizeDate(record.cisa_date_added);
  const dueDate = normalizeDate(record.dueDate);
  const dateAdded = normalizeDate(record.date_added);
  const vulncheckSourceId = 'src-vulncheck-kev';

  return {
    status: 'prefill_only',
    drafting_allowed: false,
    authority_boundary: {
      cve_identity_authority: 'CVE.org / MITRE CVE Program',
      official_cisa_kev_authority: 'Cybersecurity and Infrastructure Security Agency',
      vulncheck_role: 'non-authoritative exploitation signal and supporting source',
      instruction: 'Do not draft or apply official KEV labeling from VulnCheck alone; verify CISA KEV membership against CISA before publication.',
    },
    supporting_sources: [
      {
        id: vulncheckSourceId,
        publisher: 'VulnCheck',
        url: 'https://api.vulncheck.com/v3/backup/vulncheck-kev',
        published_at: dateAdded,
        source_type: 'vendor',
        role: 'supporting',
        notes: 'VulnCheck KEV community backup record; prominent VulnCheck KEV attribution required when data is surfaced.',
      },
    ],
    source_quality: {
      has_government_source: false,
      has_vendor_source: true,
      has_primary_source: false,
      source_sufficiency: 'needs_human_review',
    },
    key_dates: {
      vulncheck_date_added: dateAdded,
      cisa_kev_added_at_from_vulncheck_record: cisaDate,
      cisa_due_date_from_vulncheck_record: dueDate,
    },
    affected_products: [
      {
        vendor: String(record.vendorProject || 'Unknown'),
        product: String(record.product || 'Unknown'),
        versions: 'unknown',
        source_refs: [vulncheckSourceId],
      },
    ],
    cves: cves.map(id => ({ id, source_refs: [vulncheckSourceId] })),
    cwes: cwes.map(id => ({ id, name: 'Unknown', source_refs: [vulncheckSourceId] })),
    preserved_vulncheck_fields: {
      vendorProject: rawRecord.vendorProject || null,
      product: rawRecord.product || null,
      vulnerabilityName: rawRecord.vulnerabilityName || null,
      shortDescription: rawRecord.shortDescription || null,
      required_action: rawRecord.required_action || null,
      knownRansomwareCampaignUse: rawRecord.knownRansomwareCampaignUse || null,
      reported_exploited_by_vulncheck_canaries: rawRecord.reported_exploited_by_vulncheck_canaries === true,
      vulncheck_reported_exploitation: Array.isArray(rawRecord.vulncheck_reported_exploitation) ? rawRecord.vulncheck_reported_exploitation : [],
      vulncheck_xdb: xdbEntriesFor(rawRecord),
      date_added: rawRecord.date_added || null,
      cisa_date_added: rawRecord.cisa_date_added || null,
      dueDate: rawRecord.dueDate || null,
    },
    not_supported: [
      {
        claim: 'Official CISA KEV membership based solely on VulnCheck',
        reason: 'CISA remains the authority for official CISA KEV status.',
      },
      {
        claim: 'Article-ready source sufficiency',
        reason: 'This prefill contains VulnCheck supporting evidence only and must be joined with CISA, CVE/NVD, vendor, or other primary sources before drafting.',
      },
    ],
  };
}

function toCandidate(record, seenCves, recencyBucket = 'recent') {
  const rawRecord = record;
  record = normalizeKnownProductFields(record);
  const cves = uniqueStrings(record.cve);
  const addedDate = normalizeDate(record.date_added);
  const seenMatches = cves.filter(cve => seenCves.has(cve));
  const priority = priorityScore(record, addedDate);

  return {
    candidate_key: candidateKey(record),
    cves,
    cwes: uniqueStrings(record.cwes),
    vendorProject: record.vendorProject || null,
    product: record.product || null,
    vulnerabilityName: record.vulnerabilityName || null,
    shortDescription: record.shortDescription || null,
    vulncheck_date_added: addedDate,
    recency_bucket: recencyBucket,
    already_seen: cves.length > 0 && seenMatches.length === cves.length,
    seen_cves: seenMatches,
    priority_score: priority.score,
    priority_reasons: priority.reasons,
    official_cisa_kev: {
      status_source: 'cisa_date_added field from VulnCheck record; verify against CISA before official labeling',
      listed: Boolean(record.cisa_date_added),
      date_added: normalizeDate(record.cisa_date_added),
      due_date: normalizeDate(record.dueDate),
    },
    vulncheck_exploitation_signal: {
      source: 'VulnCheck KEV',
      non_authoritative: true,
      date_added: addedDate,
      known_ransomware_campaign_use: record.knownRansomwareCampaignUse || 'Unknown',
      reported_exploited_by_vulncheck_canaries: record.reported_exploited_by_vulncheck_canaries === true,
      reported_exploitation_count: Array.isArray(record.vulncheck_reported_exploitation) ? record.vulncheck_reported_exploitation.length : 0,
      xdb_count: xdbEntriesFor(record).length,
      xdb_exploit_types: exploitTypes(record),
      evidence_urls: sourceRefsFor(record),
    },
    source_packet_prefill: makePrefill(rawRecord),
    drafting_allowed: false,
  };
}

export function buildRecentIntake(payload, options = {}) {
  const lookbackDays = options.lookbackDays || DEFAULT_LOOKBACK_DAYS;
  const maxCandidates = options.maxCandidates || DEFAULT_MAX_CANDIDATES;
  const asOf = options.asOf || new Date().toISOString().slice(0, 10);
  const asOfMs = Date.parse(`${asOf}T23:59:59Z`);
  if (Number.isNaN(asOfMs)) throw new Error('Invalid as-of date');
  const cutoffMs = asOfMs - (lookbackDays * 24 * 60 * 60 * 1000);
  const cutoffDate = new Date(cutoffMs).toISOString().slice(0, 10);
  const seenCves = options.seenCves instanceof Set ? options.seenCves : new Set(options.seenCves || []);
  const backlogFill = options.backlogFill !== false;
  const siblingLimit = options.siblingLimit || DEFAULT_SIBLING_LIMIT;

  const records = asRecords(payload);
  const withDates = records
    .map(record => ({ record, timestamp: parseTimestamp(record?.date_added), date: normalizeDate(record?.date_added) }))
    .filter(item => item.timestamp !== null)
    .sort((a, b) => b.timestamp - a.timestamp);
  const recent = withDates.filter(item => item.timestamp >= cutoffMs && item.timestamp <= asOfMs);
  const backlog = withDates.filter(item => item.timestamp < cutoffMs);
  const mappedRecent = recent.map(item => toCandidate(item.record, seenCves, 'recent'));
  const mappedBacklog = backlogFill ? backlog.map(item => toCandidate(item.record, seenCves, 'backlog')) : [];
  const mapped = [...mappedRecent, ...mappedBacklog];
  const filtered = options.includeSeen ? mapped : mapped.filter(candidate => !candidate.already_seen);
  const siblingCounts = new Map();
  const candidates = [];
  let siblingDampened = 0;
  for (const candidate of filtered) {
    const key = siblingKey(candidate);
    const count = siblingCounts.get(key) || 0;
    if (count >= siblingLimit) {
      siblingDampened += 1;
      continue;
    }
    siblingCounts.set(key, count + 1);
    candidates.push(candidate);
    if (candidates.length >= maxCandidates) break;
  }

  return {
    schema_version: 'vulncheck-kev-recent-intake/1',
    generated_at: new Date().toISOString(),
    mode: options.execute ? 'live' : 'dry-run',
    drafting_enabled: false,
    source: {
      publisher: 'VulnCheck',
      dataset: 'VulnCheck KEV',
      backup_endpoint: options.endpoint || DEFAULT_ENDPOINT,
      attribution_required: true,
      attribution_label: 'VulnCheck KEV',
      authority_boundary: 'VulnCheck KEV is a non-authoritative exploitation signal for Threatpedia; CISA remains authoritative for official CISA KEV membership.',
    },
    config: {
      lookback_days: lookbackDays,
      max_candidates: maxCandidates,
      as_of: asOf,
      cutoff_date: cutoffDate,
      sort: 'date_added desc',
      seen_filter_enabled: !options.includeSeen,
      backlog_fill_enabled: backlogFill,
      sibling_limit_per_vendor_product_day: siblingLimit,
    },
    summary: {
      records_loaded: records.length,
      records_with_date_added: withDates.length,
      candidates_in_lookback: mappedRecent.length,
      backlog_candidates_considered: mappedBacklog.length,
      already_seen_filtered: options.includeSeen ? 0 : mapped.filter(candidate => candidate.already_seen).length,
      sibling_dampened: siblingDampened,
      candidates_emitted: candidates.length,
      recent_emitted: candidates.filter(candidate => candidate.recency_bucket === 'recent').length,
      backlog_emitted: candidates.filter(candidate => candidate.recency_bucket === 'backlog').length,
    },
    candidates,
  };
}

function productionPacketFor(candidate) {
  return {
    schema_version: 'vulncheck-kev-prefill/1',
    generated_at: new Date().toISOString(),
    source: {
      publisher: 'VulnCheck',
      dataset: 'VulnCheck KEV',
      attribution_required: true,
      attribution_label: 'VulnCheck KEV',
    },
    candidate: {
      candidate_key: candidate.candidate_key,
      cves: candidate.cves,
      recency_bucket: candidate.recency_bucket,
      priority_score: candidate.priority_score,
      priority_reasons: candidate.priority_reasons,
      official_cisa_kev: candidate.official_cisa_kev,
      vulncheck_exploitation_signal: candidate.vulncheck_exploitation_signal,
      drafting_allowed: false,
    },
    source_packet_prefill: candidate.source_packet_prefill,
  };
}

function writeProductionArtifacts(result, defaults) {
  if (!defaults.enabled) {
    throw new Error('VulnCheck KEV production intake is disabled in config (discovery_sources.vulncheck_kev.enabled=false)');
  }
  if (result.candidates.length === 0) {
    return { index: null, packets: [] };
  }
  const packetDir = defaults.sourcePacketDir;
  const written = [];
  for (const candidate of result.candidates) {
    const packetPath = join(packetDir, `${candidateFileStem(candidate)}.json`);
    writeJson(packetPath, productionPacketFor(candidate));
    candidate.production_artifact = packetPath;
    written.push(packetPath);
  }
  writeJson(defaults.candidateIndex, {
    ...result,
    production: {
      artifact_type: 'source-packet-prefill',
      candidate_index_path: defaults.candidateIndex,
      source_packet_dir: packetDir,
      artifacts_written: written,
      article_tasks_created: 0,
      drafting_enabled: false,
    },
  });
  return { index: defaults.candidateIndex, packets: written };
}

async function run() {
  const args = parseArgs(process.argv);
  const defaults = loadConfigDefaults(args);
  const { payload, source } = await loadBackup(args, defaults);
  const seenCves = collectSeenCves(args.seenCves);
  const result = buildRecentIntake(payload, {
    ...defaults,
    execute: args.execute,
    asOf: args.asOf,
    endpoint: defaults.endpoint,
    seenCves,
    includeSeen: args.includeSeen,
  });
  result.input_source = source;

  if (args.execute) {
    result.production = writeProductionArtifacts(result, defaults);
  }
  if (args.out) writeJson(args.out, result);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  run().catch(error => {
    console.error(`[vulncheck-kev-intake] ERROR: ${error.message}`);
    process.exit(1);
  });
}
