#!/usr/bin/env node
/**
 * pipeline-discover.mjs — Automated Discovery Pipeline
 *
 * Fetches high-trust discovery feeds, scores discovered events,
 * deduplicates against the existing corpus/task queue, and creates
 * pipeline tasks.
 *
 * Current lanes:
 *   - zero-day discovery: CISA KEV + NVD CVSS enrichment
 *   - incident discovery: CISA alerts/advisories RSS + NCSC News RSS + Microsoft Security Blog RSS
 *   - threat-actor promotion: recent incident corpus -> threat-actor tasks
 *   - campaign promotion: recent incident corpus -> conservative campaign tasks
 *
 * Usage:
 *   node scripts/pipeline-discover.mjs
 *   node scripts/pipeline-discover.mjs --execute
 *   node scripts/pipeline-discover.mjs --mode incident --days 7 --limit 3
 *   node scripts/pipeline-discover.mjs --mode zero-day --execute --days 3 --limit 5
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { resolve, dirname, basename } from 'path';
import { fileURLToPath } from 'url';
import { XMLParser } from 'fast-xml-parser';
import yaml from 'js-yaml';
import { loadPipelineConfig } from './pipeline-config.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const TASKS_DIR = resolve(ROOT, '.github/pipeline/tasks');
const CONTENT_DIR = resolve(ROOT, 'site/src/content');
const REJECTION_FILE = resolve(ROOT, '.github/pipeline/rejected-candidates.json');

const RSS_PARSER = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  parseTagValue: true,
  trimValues: true,
  processEntities: false,
  htmlEntities: false,
});

const ZERO_DAY_WEIGHTS = {
  R1_SOURCE_COUNT: 0.40,
  CISA_KEV: 0.20,
  CVSS_HIGH: 0.15,
  CROSS_SOURCE: 0.15,
  ACTIVE_EXPLOITATION: 0.10,
};

const INCIDENT_STRONG_PATTERNS = [
  { label: 'breach', regex: /\bbreach\b/i, points: 18 },
  { label: 'compromise', regex: /\bcompromis(?:e|ed|es|ing)\b/i, points: 16 },
  { label: 'intrusion', regex: /\bintrusion\b/i, points: 16 },
  { label: 'phishing', regex: /\bphishing\b/i, points: 14 },
  { label: 'ransomware', regex: /\bransomware\b/i, points: 16 },
  { label: 'malware', regex: /\bmalware\b/i, points: 12 },
  { label: 'supply chain', regex: /\bsupply[- ]chain\b/i, points: 18 },
  { label: 'exfiltration', regex: /\bexfiltrat(?:e|ion|ed)\b/i, points: 16 },
  { label: 'active exploitation', regex: /\b(active exploitation|exploited in the wild)\b/i, points: 14 },
];

const INCIDENT_BOUNDARY_PATTERNS = [
  { label: 'affects/impacts', regex: /\b(affect(?:s|ed|ing)?|impact(?:s|ed|ing)?)\b/i, points: 10 },
  { label: 'targets/against', regex: /\b(target(?:s|ed|ing)?|against)\b/i, points: 10 },
  { label: 'victim language', regex: /\b(victim|victims|victimised|victimized)\b/i, points: 10 },
  { label: 'org/service boundary', regex: /\b(compromise of|breach of|attack on)\b/i, points: 12 },
];

const INCIDENT_NEGATIVE_PATTERNS = [
  { label: 'kev catalog churn', regex: /\b(cisa adds?.*known exploited vulnerabilities|known exploited vulnerabilities(?: to)? catalog)\b/i, points: 50, hardReject: true },
  { label: 'generic strategy/guidance', regex: /\b(detection strategies|harder by design|best practices|guidance|defending against|security update)\b/i, points: 30, hardReject: true },
  { label: 'analysis-style writeup', regex: /\b(dissecting|investigating|playbook|lessons learned|containing a)\b/i, points: 30, hardReject: true },
  { label: 'vulnerability advisory only', regex: /\b(out-of-bounds|use-after-free|heap overflow|cvss|vulnerability)\b/i, points: 16 },
];

const ACTIVE_TASK_STATUSES = new Set(['pending', 'locked', 'blocked', 'pr_open', 'validation', 'review']);
const AUTO_CERTIFY_THRESHOLD = 80;
const INCIDENT_TASK_SUMMARY_MAX_LENGTH = 320;
const THREAT_ACTOR_PROMOTION_MIN_SOURCES = 3;
const THREAT_ACTOR_PROMOTION_MIN_INCIDENTS = 2;
const CAMPAIGN_PROMOTION_MIN_SOURCES = 3;
const CAMPAIGN_PROMOTION_MIN_INCIDENTS = 3;
const NVD_API_DELAY_MS = 6500; // Respect the unauthenticated NVD rate limit window.
const CAMPAIGN_THEME_LABELS = {
  'supply chain': 'Supply Chain',
  ransomware: 'Ransomware',
  wiper: 'Wiper',
  'data breach': 'Data Breach',
  phishing: 'Phishing',
  espionage: 'Espionage',
  extortion: 'Extortion',
};

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = { execute: false, days: 7, limit: 10, mode: 'all' };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--execute') parsed.execute = true;
    if (args[i] === '--days' && args[i + 1]) parsed.days = parseInt(args[++i], 10);
    if (args[i] === '--limit' && args[i + 1]) parsed.limit = parseInt(args[++i], 10);
    if (args[i] === '--mode' && args[i + 1]) parsed.mode = args[++i];
  }

  if (!['all', 'zero-day', 'incident', 'threat-actor', 'campaign'].includes(parsed.mode)) {
    throw new Error(`Unsupported --mode ${parsed.mode}. Expected all, zero-day, incident, threat-actor, or campaign.`);
  }
  if (!Number.isFinite(parsed.days) || parsed.days < 1) {
    throw new Error(`Invalid --days value ${parsed.days}. Expected integer >= 1.`);
  }
  if (!Number.isFinite(parsed.limit) || parsed.limit < 1) {
    throw new Error(`Invalid --limit value ${parsed.limit}. Expected integer >= 1.`);
  }

  return parsed;
}

function ensureArray(value) {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

function textValue(value) {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (!value || typeof value !== 'object') return '';
  if (typeof value['#text'] === 'string') return value['#text'];
  return '';
}

function stripHtml(html) {
  return String(html || '')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#8211;|&#x2013;/gi, '-')
    .replace(/&#8212;|&#x2014;/gi, '-')
    .replace(/&#8217;|&#x2019;/gi, "'")
    .replace(/&#8220;|&#8221;|&#x201c;|&#x201d;/gi, '"')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeUrl(rawUrl) {
  const value = String(rawUrl || '').trim();
  if (!value) return '';

  try {
    const url = new URL(value);
    url.hash = '';
    if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
      url.pathname = url.pathname.slice(0, -1);
    }
    return url.toString();
  } catch {
    return value;
  }
}

function normalizeTitleKey(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function slugify(text, maxLength = 90) {
  return String(text || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, maxLength)
    .replace(/-+$/g, '');
}

function extractMarkdownUrls(content) {
  return [...String(content || '').matchAll(/https?:\/\/[^\s)<>"']+/g)].map(match => normalizeUrl(match[0]));
}

function extractFrontmatterTitle(content) {
  const text = String(content || '');
  if (!text.startsWith('---\n')) return null;
  const end = text.indexOf('\n---\n', 4);
  if (end === -1) return null;
  const frontmatter = text.slice(4, end);
  const match = frontmatter.match(/^title:\s*(.+)$/m);
  if (!match) return null;
  return match[1].trim().replace(/^['"]|['"]$/g, '');
}

function extractStemFromPath(pathValue) {
  const fileName = basename(String(pathValue || '').trim());
  return fileName.endsWith('.md') ? fileName.slice(0, -3) : '';
}

function parseTimestamp(value) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function buildLookbackCutoff(days) {
  const value = Number(days);
  if (!Number.isFinite(value) || value < 1) return null;
  return new Date(Date.now() - value * 24 * 60 * 60 * 1000);
}

function isoDateOnly(value) {
  const parsed = parseTimestamp(value);
  if (!parsed) return null;
  return parsed.toISOString().split('T')[0];
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function parseFrontmatter(content) {
  const text = String(content || '');
  if (!text.startsWith('---\n')) return null;
  const end = text.indexOf('\n---\n', 4);
  if (end === -1) return null;
  const frontmatter = text.slice(4, end);
  const parsed = yaml.load(frontmatter);
  return parsed && typeof parsed === 'object' ? parsed : null;
}

function isPromotableActorName(name) {
  const value = String(name || '').trim();
  if (!value) return false;
  if (/^(unknown|none|n\/a)$/i.test(value)) return false;
  if (/\b(unknown|suspected|vendor error|unattributed|n\/a)\b/i.test(value)) return false;
  if (/\bnexus\b/i.test(value)) return false;
  if (/\bmultiple actors\b/i.test(value)) return false;
  return true;
}

function explodeActorIdentities(name) {
  const withoutParens = String(name || '')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/[–—]/g, '-')
    .trim();
  const parts = withoutParens
    .split(/\/|;|,|\band\b/gi)
    .map(part => part.trim())
    .filter(Boolean)
    .filter(isPromotableActorName);
  return [...new Set(parts)];
}

function selectPromotableActorIdentity(name, knownActors) {
  const aliases = explodeActorIdentities(name);
  if (aliases.length === 0) return null;
  if (aliases.some(alias => knownActors.has(normalizeTitleKey(alias)))) return null;

  const preferred = aliases.find(alias => !/^(APT\d+|UNC\d+|FIN\d+|TA\d+|UAC-\d+)/i.test(alias)) || aliases[0];
  return {
    canonicalName: preferred,
    aliases: aliases.filter(alias => alias !== preferred),
  };
}

function buildCorpusIndexes() {
  const indexes = {
    cves: new Set(),
    urls: new Set(),
    titleKeys: new Set(),
    slugs: new Set(),
  };

  const dirs = ['incidents', 'campaigns', 'zero-days', 'threat-actors'];
  for (const dir of dirs) {
    const dirPath = resolve(CONTENT_DIR, dir);
    if (!existsSync(dirPath)) continue;

    for (const file of readdirSync(dirPath).filter(name => name.endsWith('.md'))) {
      const fullPath = resolve(dirPath, file);
      const content = readFileSync(fullPath, 'utf8');
      const stem = file.replace(/\.md$/, '');
      indexes.slugs.add(stem);

      const stemKey = normalizeTitleKey(stem.replace(/-/g, ' '));
      if (stemKey) indexes.titleKeys.add(stemKey);

      const title = extractFrontmatterTitle(content);
      if (title) indexes.titleKeys.add(normalizeTitleKey(title));

      for (const url of extractMarkdownUrls(content)) {
        if (url) indexes.urls.add(url);
      }

      const matches = content.matchAll(/CVE-\d{4}-\d+/g);
      for (const match of matches) indexes.cves.add(match[0].toUpperCase());
    }
  }

  return indexes;
}

function buildTaskIndexes() {
  const indexes = {
    cves: new Set(),
    urls: new Set(),
    titleKeys: new Set(),
    slugs: new Set(),
    activeCount: 0,
    byType: {},
  };

  if (!existsSync(TASKS_DIR)) return indexes;

  for (const file of readdirSync(TASKS_DIR).filter(name => name.endsWith('.json'))) {
    const task = JSON.parse(readFileSync(resolve(TASKS_DIR, file), 'utf8'));
    const type = String(task.type || 'unknown');
    const status = String(task.status || 'pending');

    if (ACTIVE_TASK_STATUSES.has(status)) {
      indexes.activeCount += 1;
      indexes.byType[type] = (indexes.byType[type] || 0) + 1;
    }

    const topic = task.input?.topic;
    if (topic) indexes.titleKeys.add(normalizeTitleKey(topic));

    const outputStem = extractStemFromPath(task.output?.file_pattern);
    if (outputStem) {
      indexes.slugs.add(outputStem);
      indexes.titleKeys.add(normalizeTitleKey(outputStem.replace(/-/g, ' ')));
    }

    const targetStem = extractStemFromPath(task.input?.target_file);
    if (targetStem) {
      indexes.slugs.add(targetStem);
      indexes.titleKeys.add(normalizeTitleKey(targetStem.replace(/-/g, ' ')));
    }

    for (const source of ensureArray(task.input?.sources)) {
      const normalized = normalizeUrl(source);
      if (normalized) indexes.urls.add(normalized);
    }

    const candidateData = task.input?.candidate_data || {};
    const cve = candidateData.cve;
    if (cve) indexes.cves.add(String(cve).toUpperCase());
    for (const cveValue of ensureArray(candidateData.cves)) {
      indexes.cves.add(String(cveValue).toUpperCase());
    }

    const topicCves = String(task.input?.topic || '').matchAll(/CVE-\d{4}-\d+/g);
    for (const match of topicCves) indexes.cves.add(match[0].toUpperCase());
  }

  return indexes;
}

function buildIncidentCandidateKey(sourceKey, url) {
  return `incident:${sourceKey}:${normalizeUrl(url)}`;
}

function buildThreatActorCandidateKey(actorName) {
  return `threat-actor:${slugify(actorName, 80)}`;
}

function buildRejectionIndexes() {
  const indexes = {
    cves: new Set(),
    candidateKeys: new Set(),
  };
  if (!existsSync(REJECTION_FILE)) {
    console.log('::warning::rejected-candidates.json not found; proceeding with empty rejection set');
    return indexes;
  }

  let data;
  try {
    data = JSON.parse(readFileSync(REJECTION_FILE, 'utf8'));
  } catch (error) {
    console.log(`::warning::rejected-candidates.json parse error (${error.message}); proceeding with empty rejection set`);
    return indexes;
  }

  if (!data || !Array.isArray(data.rejected)) {
    console.log('::warning::rejected-candidates.json malformed (missing rejected[] array); proceeding with empty rejection set');
    return indexes;
  }

  for (const entry of data.rejected) {
    if (entry && typeof entry.cve === 'string') {
      indexes.cves.add(entry.cve.toUpperCase());
    }
    if (entry && typeof entry.candidate_key === 'string' && entry.candidate_key.trim()) {
      indexes.candidateKeys.add(entry.candidate_key.trim());
    }
  }

  return indexes;
}

function getNextTaskId() {
  if (!existsSync(TASKS_DIR)) return 'TASK-2026-0071';

  const existing = readdirSync(TASKS_DIR)
    .filter(file => file.match(/^TASK-\d{4}-\d{4}\.json$/))
    .map(file => parseInt(file.match(/TASK-\d{4}-(\d{4})/)[1], 10))
    .sort((a, b) => b - a);

  const next = existing.length > 0 ? existing[0] + 1 : 71;
  return `TASK-2026-${String(next).padStart(4, '0')}`;
}

function buildThreatActorIdentityIndex() {
  const keys = new Set();

  const actorDir = resolve(CONTENT_DIR, 'threat-actors');
  if (existsSync(actorDir)) {
    for (const file of readdirSync(actorDir).filter(name => name.endsWith('.md'))) {
      const stem = file.replace(/\.md$/, '');
      keys.add(normalizeTitleKey(stem.replace(/-/g, ' ')));

      const content = readFileSync(resolve(actorDir, file), 'utf8');
      const frontmatter = parseFrontmatter(content);
      if (!frontmatter) continue;
      if (frontmatter.name) keys.add(normalizeTitleKey(frontmatter.name));
      for (const alias of ensureArray(frontmatter.aliases)) {
        keys.add(normalizeTitleKey(alias));
      }
    }
  }

  if (existsSync(TASKS_DIR)) {
    for (const file of readdirSync(TASKS_DIR).filter(name => name.endsWith('.json'))) {
      const task = JSON.parse(readFileSync(resolve(TASKS_DIR, file), 'utf8'));
      if (task.type !== 'threat-actor') continue;
      const actorName = task.input?.candidate_data?.actor_name;
      if (actorName) keys.add(normalizeTitleKey(actorName));
      for (const alias of ensureArray(task.input?.candidate_data?.aliases)) {
        keys.add(normalizeTitleKey(alias));
      }
      const outputStem = extractStemFromPath(task.output?.file_pattern);
      if (outputStem) keys.add(normalizeTitleKey(outputStem.replace(/-/g, ' ')));
    }
  }

  keys.delete('');
  return keys;
}

function collectIncidentAttributionSources(lookbackDays) {
  const incidentDir = resolve(CONTENT_DIR, 'incidents');
  const records = [];
  const cutoff = buildLookbackCutoff(lookbackDays);
  if (!existsSync(incidentDir)) return records;

  for (const file of readdirSync(incidentDir).filter(name => name.endsWith('.md'))) {
    const fullPath = resolve(incidentDir, file);
    const content = readFileSync(fullPath, 'utf8');
    const frontmatter = parseFrontmatter(content);
    if (!frontmatter) continue;

    const incidentDate = parseTimestamp(frontmatter.date);
    if (!incidentDate) continue;
    if (cutoff && incidentDate < cutoff) continue;

    records.push({
      slug: file.replace(/\.md$/, ''),
      title: String(frontmatter.title || file.replace(/\.md$/, '')),
      date: incidentDate.toISOString(),
      threatActor: String(frontmatter.threatActor || '').trim(),
      sources: ensureArray(frontmatter.sources),
      attackType: String(frontmatter.attackType || '').trim(),
      geography: String(frontmatter.geography || '').trim(),
      sector: String(frontmatter.sector || '').trim(),
      tags: ensureArray(frontmatter.tags),
    });
  }

  return records;
}

function buildCampaignIdentityIndex() {
  const names = new Set();
  const relatedIncidents = new Set();
  const topicStrings = [];

  const campaignDir = resolve(CONTENT_DIR, 'campaigns');
  if (existsSync(campaignDir)) {
    for (const file of readdirSync(campaignDir).filter(name => name.endsWith('.md'))) {
      const stem = file.replace(/\.md$/, '');
      names.add(normalizeTitleKey(stem.replace(/-/g, ' ')));

      const content = readFileSync(resolve(campaignDir, file), 'utf8');
      const frontmatter = parseFrontmatter(content);
      if (!frontmatter) continue;

      for (const value of [frontmatter.name, frontmatter.title, ...ensureArray(frontmatter.aliases)]) {
        const key = normalizeTitleKey(value);
        if (key) names.add(key);
      }
      for (const incidentSlug of ensureArray(frontmatter.relatedIncidents)) {
        const normalized = slugify(incidentSlug, 120);
        if (normalized) relatedIncidents.add(normalized);
      }
    }
  }

  if (existsSync(TASKS_DIR)) {
    for (const file of readdirSync(TASKS_DIR).filter(name => name.endsWith('.json'))) {
      const task = JSON.parse(readFileSync(resolve(TASKS_DIR, file), 'utf8'));
      if (task.type !== 'campaign') continue;

      for (const value of [
        task.input?.topic,
        task.input?.candidate_data?.campaign_name,
        task.output?.file_pattern ? extractStemFromPath(task.output.file_pattern)?.replace(/-/g, ' ') : '',
      ]) {
        const key = normalizeTitleKey(value);
        if (key) {
          names.add(key);
          topicStrings.push(key);
        }
      }

      const relatedIncident = task.input?.candidate_data?.related_incident;
      if (relatedIncident) relatedIncidents.add(slugify(relatedIncident, 120));

      const targetStem = extractStemFromPath(task.input?.target_file);
      if (targetStem) relatedIncidents.add(slugify(targetStem, 120));
    }
  }

  names.delete('');
  return { names, relatedIncidents, topicStrings };
}

function findCampaignTheme(incident) {
  const candidates = [
    normalizeTitleKey(incident.attackType),
    ...ensureArray(incident.tags).map(tag => normalizeTitleKey(tag)),
  ].filter(Boolean);

  for (const candidate of candidates) {
    for (const [themeKey, label] of Object.entries(CAMPAIGN_THEME_LABELS)) {
      if (candidate === themeKey || candidate.includes(themeKey)) {
        return { key: themeKey, label };
      }
    }
  }

  return null;
}

function titleCaseWords(value) {
  return String(value || '')
    .split(/[\s-]+/)
    .filter(Boolean)
    .map(part => part[0].toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

function extractExplicitCampaignIdentity(incident) {
  const title = String(incident.title || '').trim();
  const operationMatch = title.match(/\b(Operation [A-Z][A-Za-z0-9-]+)\b/);
  if (operationMatch) {
    return { campaignName: operationMatch[1], explicitNamedOperation: true };
  }

  const operationTag = ensureArray(incident.tags).find(tag => /^operation-[a-z0-9-]+$/i.test(tag));
  if (operationTag) {
    const words = operationTag.replace(/^operation-/i, '').split('-').map(titleCaseWords).join(' ');
    return { campaignName: `Operation ${words}`, explicitNamedOperation: true };
  }

  if (/\bcampaign\b/i.test(title)) {
    return {
      campaignName: title.replace(/\s+\([^)]*\)\s*$/g, '').trim(),
      explicitNamedOperation: false,
    };
  }

  return null;
}

function buildCampaignCandidateKey(campaignName) {
  return `campaign:${slugify(campaignName, 100)}`;
}

function scoreCampaignPromotion(candidate) {
  let score = candidate.promotionKind === 'explicit' ? 68 : 60;
  if (candidate.incidentCount >= 3) score += 12;
  else if (candidate.incidentCount >= 2) score += 6;
  if (candidate.uniqueSourceCount >= 5) score += 10;
  if (candidate.hasGovernmentSource) score += 8;
  if (candidate.explicitNamedOperation) score += 8;
  if (candidate.latestDate) {
    const latest = parseTimestamp(candidate.latestDate);
    if (latest) {
      const ageDays = (Date.now() - latest.getTime()) / (1000 * 60 * 60 * 24);
      if (ageDays <= 365) score += 8;
    }
  }
  candidate.score = clampScore(score);
  return candidate;
}

function isKnownCampaignMatch(candidate, knownCampaigns) {
  const nameKey = normalizeTitleKey(candidate.campaignName);
  if (nameKey && knownCampaigns.names.has(nameKey)) return true;
  if (candidate.relatedIncidents.some(item => knownCampaigns.relatedIncidents.has(slugify(item.slug, 120)))) return true;

  const actorKey = normalizeTitleKey(candidate.actorName);
  const themeKey = normalizeTitleKey(candidate.themeLabel);
  if (actorKey && themeKey) {
    return knownCampaigns.topicStrings.some(topic =>
      topic.includes(actorKey) &&
      topic.includes(themeKey) &&
      topic.includes('campaign')
    );
  }

  return false;
}

async function fetchJSON(url, timeout = 30000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

async function fetchText(url, timeout = 30000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    return await response.text();
  } finally {
    clearTimeout(timer);
  }
}

async function fetchCvssScore(cveId, baseUrl) {
  try {
    const response = await fetch(`${baseUrl}?cveId=${cveId}`, {
      signal: AbortSignal.timeout(15000),
    });

    if (response.status === 403 || response.status === 429) {
      return { rateLimited: true };
    }
    if (!response.ok) return null;

    const data = await response.json();
    const vuln = data?.vulnerabilities?.[0]?.cve;
    if (!vuln) return null;

    const metrics = vuln.metrics || {};
    const v31 = metrics.cvssMetricV31?.[0]?.cvssData;
    const v30 = metrics.cvssMetricV30?.[0]?.cvssData;
    const v2 = metrics.cvssMetricV2?.[0]?.cvssData;
    const cvss = v31 || v30 || v2;
    if (!cvss) return null;

    return {
      score: cvss.baseScore,
      severity: cvss.baseSeverity || (cvss.baseScore >= 9 ? 'CRITICAL' : cvss.baseScore >= 7 ? 'HIGH' : cvss.baseScore >= 4 ? 'MEDIUM' : 'LOW'),
      vector: cvss.vectorString,
      version: v31 ? '3.1' : v30 ? '3.0' : '2.0',
    };
  } catch {
    return null;
  }
}

function scoreZeroDayCandidate(candidate) {
  let score = 0;

  const r1Count = candidate.r1Sources || 0;
  const r1Score = Math.min(r1Count / 2, 1) * 100;
  score += r1Score * ZERO_DAY_WEIGHTS.R1_SOURCE_COUNT;
  score += (candidate.inKev ? 100 : 0) * ZERO_DAY_WEIGHTS.CISA_KEV;

  if (candidate.cvss) {
    const cvssScore = Math.min(candidate.cvss.score / 10, 1) * 100;
    score += cvssScore * ZERO_DAY_WEIGHTS.CVSS_HIGH;
  }

  const noteUrls = (candidate.kev.notes || '')
    .split(';')
    .filter(segment => segment.trim().startsWith('http'))
    .length;
  const crossScore = Math.min((noteUrls + (candidate.kev.cwes?.length || 0)) / 3, 1) * 100;
  score += crossScore * ZERO_DAY_WEIGHTS.CROSS_SOURCE;
  score += (candidate.inKev ? 100 : 0) * ZERO_DAY_WEIGHTS.ACTIVE_EXPLOITATION;

  candidate.score = clampScore(score);
  candidate.autoCertify = (
    candidate.score >= AUTO_CERTIFY_THRESHOLD &&
    (candidate.r1Sources || 0) >= 2 &&
    (candidate.inKev || (candidate.cvss && candidate.cvss.score >= 7.0))
  );
  return candidate;
}

function evaluateIncidentItem(sourceKey, item) {
  const combined = `${item.title} ${item.summary}`.trim();
  const positiveHits = INCIDENT_STRONG_PATTERNS.filter(entry => entry.regex.test(combined));
  const boundaryHits = INCIDENT_BOUNDARY_PATTERNS.filter(entry => entry.regex.test(combined));
  const negativeHits = INCIDENT_NEGATIVE_PATTERNS.filter(entry => entry.regex.test(combined));

  if (sourceKey === 'cisa_alerts') {
    if (item.link.includes('/ics-advisories/')) {
      return { accepted: false, score: 0, reason: 'ICS advisory excluded', positiveHits: [], boundaryHits: [], negativeHits: [] };
    }
    if (!item.link.includes('/alerts/') && !item.link.includes('/cybersecurity-advisories/')) {
      return { accepted: false, score: 0, reason: 'Non-alert CISA entry excluded', positiveHits: [], boundaryHits: [], negativeHits: [] };
    }
  }
  if (sourceKey === 'ncsc_news' && !item.link.includes('/news/')) {
    return { accepted: false, score: 0, reason: 'Non-news NCSC entry excluded', positiveHits: [], boundaryHits: [], negativeHits: [] };
  }

  const hardReject = negativeHits.find(entry => entry.hardReject);
  if (hardReject) {
    return {
      accepted: false,
      score: 0,
      reason: `Hard reject: ${hardReject.label}`,
      positiveHits: positiveHits.map(entry => entry.label),
      boundaryHits: boundaryHits.map(entry => entry.label),
      negativeHits: negativeHits.map(entry => entry.label),
    };
  }

  let score = sourceKey === 'cisa_alerts' ? 48 : sourceKey === 'ncsc_news' ? 46 : 34;
  for (const hit of positiveHits) score += hit.points;
  for (const hit of boundaryHits) score += hit.points;
  for (const hit of negativeHits) score -= hit.points;

  if (sourceKey === 'cisa_alerts' && item.link.includes('/alerts/')) score += 10;
  if (sourceKey === 'ncsc_news' && /\b(alert:|warns?|advises?)\b/i.test(item.title)) score += 6;

  const clamped = clampScore(score);
  return {
    accepted: positiveHits.length > 0 && boundaryHits.length > 0 && clamped >= 60,
    score: clamped,
    reason: positiveHits.length > 0 && boundaryHits.length > 0 ? 'signal-threshold-met' : 'insufficient-incident-boundary',
    positiveHits: positiveHits.map(entry => entry.label),
    boundaryHits: boundaryHits.map(entry => entry.label),
    negativeHits: negativeHits.map(entry => entry.label),
  };
}

function determineArticleType(kevEntry) {
  if (kevEntry.knownRansomwareCampaignUse === 'Known') return 'zero-day';
  return 'zero-day';
}

function generateZeroDaySlug(kevEntry) {
  const vendor = slugify(kevEntry.vendorProject, 35);
  const product = slugify(kevEntry.product, 35);
  const cve = String(kevEntry.cveID || '').toLowerCase();
  const base = `${vendor}-${product}-${cve}`;
  return base.slice(0, 80).replace(/-+$/g, '');
}

function generateIncidentSlug(candidate) {
  const base = slugify(candidate.title, 72);
  const year = candidate.publishedAt ? String(new Date(candidate.publishedAt).getUTCFullYear()) : String(new Date().getUTCFullYear());
  const withYear = base.includes(year) ? base : `${base}-${year}`;
  return withYear.slice(0, 90).replace(/-+$/g, '');
}

function generateExploitId(cveId, existingIds) {
  const cveYear = cveId.match(/CVE-(\d{4})/)?.[1] || new Date().getFullYear().toString();
  const yearIds = existingIds
    .filter(id => id.includes(`TP-EXP-${cveYear}-`))
    .map(id => parseInt(id.match(/TP-EXP-\d{4}-(\d{4})/)?.[1] || '0', 10));
  const next = yearIds.length > 0 ? Math.max(...yearIds) + 1 : 1;
  return `TP-EXP-${cveYear}-${String(next).padStart(4, '0')}`;
}

function guessVulnType(kev) {
  const name = `${kev.vulnerabilityName} ${kev.shortDescription}`.toLowerCase();
  if (name.includes('remote code execution') || name.includes('rce')) return 'Remote Code Execution';
  if (name.includes('privilege escalation')) return 'Privilege Escalation';
  if (name.includes('authentication bypass') || name.includes('auth bypass')) return 'Authentication Bypass';
  if (name.includes('sql injection')) return 'SQL Injection';
  if (name.includes('cross-site scripting') || name.includes('xss')) return 'Cross-Site Scripting';
  if (name.includes('deserialization')) return 'Deserialization';
  if (name.includes('path traversal') || name.includes('directory traversal')) return 'Path Traversal';
  if (name.includes('buffer overflow') || name.includes('heap overflow') || name.includes('stack overflow')) return 'Buffer Overflow';
  if (name.includes('information disclosure') || name.includes('information leak')) return 'Information Disclosure';
  if (name.includes('denial of service') || name.includes('dos')) return 'Denial of Service';
  if (name.includes('command injection') || name.includes('os command')) return 'Command Injection';
  if (name.includes('use-after-free') || name.includes('memory corruption')) return 'Memory Corruption';
  if (name.includes('code execution')) return 'Remote Code Execution';
  if (name.includes('arbitrary file')) return 'Arbitrary File Access';
  return 'Unclassified';
}

function collectExploitIds() {
  const ids = [];
  const zeroDayDir = resolve(CONTENT_DIR, 'zero-days');
  if (existsSync(zeroDayDir)) {
    for (const file of readdirSync(zeroDayDir).filter(name => name.endsWith('.md'))) {
      const content = readFileSync(resolve(zeroDayDir, file), 'utf8');
      const match = content.match(/exploitId:\s*["']?(TP-EXP-\d{4}-\d{4})/);
      if (match) ids.push(match[1]);
    }
  }

  if (existsSync(TASKS_DIR)) {
    for (const file of readdirSync(TASKS_DIR).filter(name => name.endsWith('.json'))) {
      const task = JSON.parse(readFileSync(resolve(TASKS_DIR, file), 'utf8'));
      const exploitId = task.input?.candidate_data?.exploitId;
      if (exploitId) ids.push(exploitId);
    }
  }

  return ids;
}

function buildZeroDayTask(candidate, taskId, exploitId) {
  const slug = generateZeroDaySlug(candidate.kev);
  const sourcesSet = new Set([
    'https://www.cisa.gov/known-exploited-vulnerabilities-catalog',
    `https://nvd.nist.gov/vuln/detail/${candidate.kev.cveID}`,
  ]);

  const noteUrls = (candidate.kev.notes || '')
    .split(';')
    .map(segment => segment.trim())
    .filter(segment => segment.startsWith('http'));
  noteUrls.forEach(url => sourcesSet.add(url));

  const notes = [
    `CISA KEV entry added ${candidate.kev.dateAdded}.`,
    `Required action by ${candidate.kev.dueDate}.`,
    candidate.kev.knownRansomwareCampaignUse === 'Known'
      ? 'Known ransomware campaign use — mention in article body.'
      : null,
    candidate.cvss
      ? `CVSS ${candidate.cvss.version}: ${candidate.cvss.score} (${candidate.cvss.severity}).`
      : null,
    `Discovery score: ${candidate.score}/100${candidate.autoCertify ? ' (auto-certify eligible).' : '.'}`,
  ].filter(Boolean).join(' ');

  const nowIso = new Date().toISOString();

  return {
    task_id: taskId,
    stage: 'draft',
    type: determineArticleType(candidate.kev),
    priority: candidate.score >= 80 ? 'P0' : candidate.score >= 60 ? 'P1' : 'P2',
    status: 'pending',
    created: nowIso,
    updated: nowIso,
    source: 'auto_discovery',
    submitted_by: 'pipeline-discovery',
    locked_by: null,
    locked_at: null,
    input: {
      topic: `${candidate.kev.vulnerabilityName} (${candidate.kev.cveID})`,
      sources: [...sourcesSet],
      candidate_data: {
        cve: candidate.kev.cveID,
        cves: [candidate.kev.cveID],
        exploitId,
        type: guessVulnType(candidate.kev),
        platform: `${candidate.kev.vendorProject} ${candidate.kev.product}`,
        severity: candidate.cvss
          ? (candidate.cvss.score >= 9 ? 'critical' : candidate.cvss.score >= 7 ? 'high' : candidate.cvss.score >= 4 ? 'medium' : 'low')
          : 'high',
        cisaKev: true,
        disclosedDate: candidate.kev.dateAdded,
        cwes: candidate.kev.cwes || [],
        knownRansomwareUse: candidate.kev.knownRansomwareCampaignUse === 'Known',
      },
      notes,
    },
    specs: [
      'DATA-STANDARDS-v1.0.md',
      'EDITORIAL-WORKFLOW-SPEC.md §14A',
    ],
    acceptance_criteria: {
      frontmatter_valid: true,
      min_sources: 3,
      min_h2_sections: 5,
      min_mitre_mappings: 1,
      review_status: 'draft_ai',
      schema_validation: 'pass',
      astro_build: true,
    },
    depends_on: [],
    preconditions: ['editorial queue depth < 50'],
    output: {
      file_pattern: `site/src/content/zero-days/${slug}.md`,
      branch: `pipeline/${taskId}`,
      pr: true,
    },
    discovery: {
      feed: 'CISA_KEV',
      score: candidate.score,
      auto_certify: candidate.autoCertify,
      cvss: candidate.cvss,
      discovered_at: nowIso,
    },
    history: [
      {
        timestamp: nowIso,
        action: 'created',
        from: 'none',
        to: 'pending',
        agent: 'pipeline-discovery',
        note: `Auto-discovered from CISA KEV (score: ${candidate.score})`,
      },
    ],
  };
}

function buildIncidentTask(candidate, taskId) {
  const slug = generateIncidentSlug(candidate);
  const nowIso = new Date().toISOString();
  const notes = [
    `Auto-discovered from ${candidate.sourceLabel} on ${candidate.publishedDate}.`,
    candidate.summary
      ? `Source summary: ${candidate.summary.slice(0, INCIDENT_TASK_SUMMARY_MAX_LENGTH)}${candidate.summary.length > INCIDENT_TASK_SUMMARY_MAX_LENGTH ? '…' : ''}`
      : null,
    candidate.positiveHits.length > 0 ? `Incident signals: ${candidate.positiveHits.join(', ')}.` : null,
    candidate.boundaryHits.length > 0 ? `Boundary signals: ${candidate.boundaryHits.join(', ')}.` : null,
    candidate.negativeHits.length > 0 ? `Watch-outs: ${candidate.negativeHits.join(', ')}.` : null,
    'Treat this as incident intake first: keep the article grounded in the concrete event described by the sources, and only elevate to a campaign or actor follow-on if the evidence supports it.',
    `Discovery score: ${candidate.score}/100.`,
  ].filter(Boolean).join(' ');

  return {
    task_id: taskId,
    stage: 'draft',
    type: 'incident',
    priority: candidate.score >= 85 ? 'P0' : candidate.score >= 65 ? 'P1' : 'P2',
    status: 'pending',
    created: nowIso,
    updated: nowIso,
    source: 'auto_discovery',
    submitted_by: 'pipeline-discovery',
    locked_by: null,
    locked_at: null,
    input: {
      topic: candidate.title,
      sources: [candidate.url],
      candidate_data: {
        discovery_type: 'incident',
        candidate_key: candidate.candidateKey,
        source_url: candidate.url,
        source_feed: candidate.sourceKey,
        source_label: candidate.sourceLabel,
        published_at: candidate.publishedAt,
        discovered_signals: candidate.positiveHits,
        boundary_signals: candidate.boundaryHits,
        feed_categories: candidate.categories,
      },
      notes,
    },
    specs: [
      'DATA-STANDARDS-v1.0.md',
      'EDITORIAL-WORKFLOW-SPEC.md §14A',
    ],
    acceptance_criteria: {
      frontmatter_valid: true,
      min_sources: 3,
      min_h2_sections: 5,
      min_mitre_mappings: 1,
      review_status: 'draft_ai',
      schema_validation: 'pass',
      astro_build: true,
    },
    depends_on: [],
    preconditions: ['editorial queue depth < 50'],
    output: {
      file_pattern: `site/src/content/incidents/${slug}.md`,
      branch: `pipeline/${taskId}`,
      pr: true,
    },
    discovery: {
      feed: candidate.sourceKey,
      score: candidate.score,
      auto_certify: false,
      discovered_at: nowIso,
      published_at: candidate.publishedAt,
    },
    history: [
      {
        timestamp: nowIso,
        action: 'created',
        from: 'none',
        to: 'pending',
        agent: 'pipeline-discovery',
        note: `Auto-discovered incident candidate from ${candidate.sourceLabel} (score: ${candidate.score})`,
      },
    ],
  };
}

function scoreThreatActorPromotion(candidate) {
  let score = 55;
  if (candidate.incidentCount >= 2) score += 12;
  if (candidate.uniqueSourceCount >= 5) score += 10;
  if (candidate.hasGovernmentSource) score += 8;
  if (candidate.latestDate) {
    const latest = parseTimestamp(candidate.latestDate);
    if (latest) {
      const ageDays = (Date.now() - latest.getTime()) / (1000 * 60 * 60 * 24);
      if (ageDays <= 365) score += 10;
      else if (ageDays <= 730) score += 5;
    }
  }
  if (candidate.attackTypes.size >= 2) score += 5;
  candidate.score = clampScore(score);
  return candidate;
}

function buildThreatActorTask(candidate, taskId) {
  const actorSlug = slugify(candidate.actorName, 80);
  const nowIso = new Date().toISOString();
  const notes = [
    `Promoted from ${candidate.incidentCount} recent incident article${candidate.incidentCount === 1 ? '' : 's'} in the live corpus.`,
    `Supporting incidents: ${candidate.relatedIncidents.map(item => item.slug).join(', ')}.`,
    candidate.attackTypes.size > 0 ? `Observed attack types: ${[...candidate.attackTypes].join(', ')}.` : null,
    candidate.geographies.size > 0 ? `Observed geographies: ${[...candidate.geographies].join(', ')}.` : null,
    'Keep the profile tightly evidence-bound to the supporting incidents; do not inflate maturity, attribution confidence, or campaign breadth beyond what those incidents support.',
    `Promotion score: ${candidate.score}/100.`,
  ].filter(Boolean).join(' ');

  return {
    task_id: taskId,
    stage: 'draft',
    type: 'threat-actor',
    priority: candidate.score >= 80 ? 'P1' : 'P2',
    status: 'pending',
    created: nowIso,
    updated: nowIso,
    source: 'promotion',
    submitted_by: 'pipeline-discovery',
    locked_by: null,
    locked_at: null,
    input: {
      topic: `${candidate.actorName} threat actor profile build from incident corpus`,
      sources: candidate.sources.slice(0, 6).map(source => source.url),
      candidate_data: {
        actor_name: candidate.actorName,
        aliases: candidate.aliases,
        origin: 'Unknown',
        affiliation: 'Unknown',
        motivation: 'Unknown',
        active_since: candidate.firstSeenYear,
        promotion_key: candidate.candidateKey,
        supporting_incidents: candidate.relatedIncidents.map(item => item.slug),
      },
      notes,
    },
    specs: [
      'DATA-STANDARDS-v1.0.md',
      'EDITORIAL-WORKFLOW-SPEC.md §14A',
      'site/src/content.config.ts',
    ],
    acceptance_criteria: {
      frontmatter_valid: true,
      min_sources: 3,
      min_h2_sections: 6,
      min_mitre_mappings: 3,
      review_status: 'draft_ai',
      schema_validation: 'pass',
      astro_build: true,
    },
    depends_on: [],
    preconditions: ['editorial queue depth < 50'],
    output: {
      file_pattern: `site/src/content/threat-actors/${actorSlug}.md`,
      branch: `pipeline/${taskId}`,
      pr: true,
    },
    discovery: {
      feed: 'promotion:incidents',
      score: candidate.score,
      auto_certify: false,
      discovered_at: nowIso,
    },
    history: [
      {
        timestamp: nowIso,
        action: 'created',
        from: 'none',
        to: 'pending',
        agent: 'pipeline-discovery',
        note: `Auto-promoted threat actor candidate from incident corpus (${candidate.relatedIncidents.length} supporting incident${candidate.relatedIncidents.length === 1 ? '' : 's'})`,
      },
    ],
  };
}

async function buildThreatActorPromotionCandidates(config, opts, indexes, rejectedCandidateKeys) {
  const headroom = computeHeadroom(config, indexes, 'threat-actor', opts.limit);
  if (headroom <= 0) {
    console.log('  [2/6] Threat-actor headroom exhausted — skipping actor promotion\n');
    return [];
  }

  console.log(`  [2/6] Scanning last ${opts.days} day(s) of incident corpus for promotable threat-actor candidates...`);
  const knownActors = buildThreatActorIdentityIndex();
  const incidents = collectIncidentAttributionSources(opts.days);
  const aggregates = new Map();

  for (const incident of incidents) {
    if (!isPromotableActorName(incident.threatActor)) continue;
    const identity = selectPromotableActorIdentity(incident.threatActor, knownActors);
    if (!identity) continue;
    const actorKey = normalizeTitleKey(identity.canonicalName);
    const candidateKey = buildThreatActorCandidateKey(identity.canonicalName);
    if (rejectedCandidateKeys.has(candidateKey)) continue;

    let aggregate = aggregates.get(actorKey);
    if (!aggregate) {
      aggregate = {
        type: 'threat-actor',
        actorName: identity.canonicalName,
        aliases: identity.aliases,
        candidateKey,
        relatedIncidents: [],
        attackTypes: new Set(),
        geographies: new Set(),
        sectors: new Set(),
        sourceMap: new Map(),
        sources: [],
        uniqueSourceCount: 0,
        hasGovernmentSource: false,
        firstSeenYear: null,
        latestDate: null,
        incidentCount: 0,
        score: 0,
      };
      aggregates.set(actorKey, aggregate);
    } else {
      for (const alias of identity.aliases) {
        if (!aggregate.aliases.includes(alias)) aggregate.aliases.push(alias);
      }
    }

    aggregate.relatedIncidents.push({ slug: incident.slug, title: incident.title });
    aggregate.incidentCount += 1;
    if (incident.attackType) aggregate.attackTypes.add(incident.attackType);
    if (incident.geography) aggregate.geographies.add(incident.geography);
    if (incident.sector) aggregate.sectors.add(incident.sector);

    const incidentDate = parseTimestamp(incident.date);
    if (incidentDate) {
      const year = String(incidentDate.getUTCFullYear());
      if (!aggregate.firstSeenYear || year < aggregate.firstSeenYear) aggregate.firstSeenYear = year;
      if (!aggregate.latestDate || incidentDate.toISOString() > aggregate.latestDate) aggregate.latestDate = incidentDate.toISOString();
    }

    for (const source of incident.sources) {
      if (!source?.url) continue;
      const normalizedUrl = normalizeUrl(source.url);
      if (!aggregate.sourceMap.has(normalizedUrl)) {
        aggregate.sourceMap.set(normalizedUrl, source);
      }
      if (source.publisherType === 'government') aggregate.hasGovernmentSource = true;
    }
  }

  const candidates = [...aggregates.values()]
    .map(candidate => {
      candidate.sources = [...candidate.sourceMap.values()];
      candidate.uniqueSourceCount = candidate.sources.length;
      return scoreThreatActorPromotion(candidate);
    })
    .filter(candidate => (
      candidate.uniqueSourceCount >= THREAT_ACTOR_PROMOTION_MIN_SOURCES &&
      candidate.incidentCount >= THREAT_ACTOR_PROMOTION_MIN_INCIDENTS
    ))
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      return String(right.latestDate || '').localeCompare(String(left.latestDate || ''));
    })
    .slice(0, headroom);

  console.log(`         ${candidates.length} promotable threat-actor candidate${candidates.length === 1 ? '' : 's'}\n`);
  return candidates;
}

function buildCampaignTask(candidate, taskId) {
  const campaignSlug = slugify(candidate.campaignName, 90);
  const nowIso = new Date().toISOString();
  const notes = [
    candidate.promotionKind === 'explicit'
      ? `Promoted from a campaign-shaped incident record: ${candidate.relatedIncidents.map(item => item.slug).join(', ')}.`
      : `Promoted from ${candidate.incidentCount} recent incidents sharing the same actor/theme cluster.`,
    candidate.actorName ? `Primary actor signal: ${candidate.actorName}.` : null,
    candidate.themeLabel ? `Theme: ${candidate.themeLabel}.` : null,
    candidate.relatedIncidents.length > 0 ? `Supporting incidents: ${candidate.relatedIncidents.map(item => item.slug).join(', ')}.` : null,
    'Keep the campaign article evidence-bound to the supporting incidents. Do not merge actor identity, victim detail, or attribution confidence beyond what the cited reporting supports.',
    `Promotion score: ${candidate.score}/100.`,
  ].filter(Boolean).join(' ');

  return {
    task_id: taskId,
    stage: 'draft',
    type: 'campaign',
    priority: candidate.score >= 85 ? 'P1' : 'P2',
    status: 'pending',
    created: nowIso,
    updated: nowIso,
    source: 'promotion',
    submitted_by: 'pipeline-discovery',
    locked_by: null,
    locked_at: null,
    input: {
      topic: `${candidate.campaignName} campaign build from recent incident cluster`,
      sources: candidate.sources.slice(0, 6).map(source => source.url),
      candidate_data: {
        campaign_name: candidate.campaignName,
        related_incident: candidate.relatedIncidents[0]?.slug || null,
        related_incidents: candidate.relatedIncidents.map(item => item.slug),
        related_actor: candidate.actorName || null,
        promotion_key: candidate.candidateKey,
        promotion_kind: candidate.promotionKind,
        explicit_named_operation: !!candidate.explicitNamedOperation,
      },
      notes,
    },
    specs: [
      'DATA-STANDARDS-v1.0.md',
      'EDITORIAL-WORKFLOW-SPEC.md §14A',
      'site/src/content.config.ts',
    ],
    acceptance_criteria: {
      frontmatter_valid: true,
      min_sources: 3,
      min_h2_sections: 7,
      min_mitre_mappings: 1,
      review_status: 'draft_ai',
      schema_validation: 'pass',
      astro_build: true,
    },
    depends_on: [],
    preconditions: ['editorial queue depth < 50'],
    output: {
      file_pattern: `site/src/content/campaigns/${campaignSlug}.md`,
      branch: `pipeline/${taskId}`,
      pr: true,
    },
    discovery: {
      feed: 'promotion:incidents',
      score: candidate.score,
      auto_certify: false,
      discovered_at: nowIso,
    },
    history: [
      {
        timestamp: nowIso,
        action: 'created',
        from: 'none',
        to: 'pending',
        agent: 'pipeline-discovery',
        note: `Auto-promoted campaign candidate from recent incident clustering (${candidate.relatedIncidents.length} supporting incident${candidate.relatedIncidents.length === 1 ? '' : 's'})`,
      },
    ],
  };
}

async function buildCampaignPromotionCandidates(config, opts, indexes, rejectedCandidateKeys) {
  const headroom = computeHeadroom(config, indexes, 'campaign', opts.limit);
  if (headroom <= 0) {
    console.log('  [2/6] Campaign headroom exhausted — skipping campaign promotion\n');
    return [];
  }

  console.log(`  [2/6] Scanning last ${opts.days} day(s) of incident corpus for promotable campaign candidates...`);
  const incidents = collectIncidentAttributionSources(opts.days);
  const knownCampaigns = buildCampaignIdentityIndex();

  const explicitCandidates = new Map();
  const clusteredCandidates = new Map();

  for (const incident of incidents) {
    const explicit = extractExplicitCampaignIdentity(incident);
    if (explicit) {
      const candidateKey = buildCampaignCandidateKey(explicit.campaignName);
      if (!rejectedCandidateKeys.has(candidateKey)) {
        let aggregate = explicitCandidates.get(candidateKey);
        if (!aggregate) {
          aggregate = {
            type: 'campaign',
            promotionKind: 'explicit',
            campaignName: explicit.campaignName,
            candidateKey,
            actorName: isPromotableActorName(incident.threatActor) ? explodeActorIdentities(incident.threatActor)[0] || null : null,
            themeLabel: findCampaignTheme(incident)?.label || null,
            relatedIncidents: [],
            sourceMap: new Map(),
            sources: [],
            uniqueSourceCount: 0,
            hasGovernmentSource: false,
            incidentCount: 0,
            latestDate: null,
            explicitNamedOperation: explicit.explicitNamedOperation,
            score: 0,
          };
          explicitCandidates.set(candidateKey, aggregate);
        }

        aggregate.relatedIncidents.push({ slug: incident.slug, title: incident.title });
        aggregate.incidentCount += 1;
        if (!aggregate.latestDate || incident.date > aggregate.latestDate) aggregate.latestDate = incident.date;
        for (const source of incident.sources) {
          if (!source?.url) continue;
          const normalizedUrl = normalizeUrl(source.url);
          if (!aggregate.sourceMap.has(normalizedUrl)) aggregate.sourceMap.set(normalizedUrl, source);
          if (source.publisherType === 'government') aggregate.hasGovernmentSource = true;
        }
      }
    }

    if (!isPromotableActorName(incident.threatActor)) continue;
    const identities = explodeActorIdentities(incident.threatActor);
    if (identities.length !== 1) continue;

    const theme = findCampaignTheme(incident);
    if (!theme) continue;

    const actorName = identities[0];
    const clusterKey = `campaign-cluster:${slugify(actorName, 60)}:${slugify(theme.key, 40)}`;
    if (rejectedCandidateKeys.has(clusterKey)) continue;

    let aggregate = clusteredCandidates.get(clusterKey);
    if (!aggregate) {
      aggregate = {
        type: 'campaign',
        promotionKind: 'cluster',
        campaignName: `${actorName} ${theme.label} Campaign`,
        candidateKey: clusterKey,
        actorName,
        themeLabel: theme.label,
        relatedIncidents: [],
        sourceMap: new Map(),
        sources: [],
        uniqueSourceCount: 0,
        hasGovernmentSource: false,
        incidentCount: 0,
        latestDate: null,
        explicitNamedOperation: false,
        score: 0,
      };
      clusteredCandidates.set(clusterKey, aggregate);
    }

    aggregate.relatedIncidents.push({ slug: incident.slug, title: incident.title });
    aggregate.incidentCount += 1;
    if (!aggregate.latestDate || incident.date > aggregate.latestDate) aggregate.latestDate = incident.date;
    for (const source of incident.sources) {
      if (!source?.url) continue;
      const normalizedUrl = normalizeUrl(source.url);
      if (!aggregate.sourceMap.has(normalizedUrl)) aggregate.sourceMap.set(normalizedUrl, source);
      if (source.publisherType === 'government') aggregate.hasGovernmentSource = true;
    }
  }

  const candidates = [...explicitCandidates.values(), ...clusteredCandidates.values()]
    .map(candidate => {
      candidate.sources = [...candidate.sourceMap.values()];
      candidate.uniqueSourceCount = candidate.sources.length;
      return scoreCampaignPromotion(candidate);
    })
    .filter(candidate => candidate.uniqueSourceCount >= CAMPAIGN_PROMOTION_MIN_SOURCES)
    .filter(candidate => candidate.promotionKind === 'explicit' || candidate.incidentCount >= CAMPAIGN_PROMOTION_MIN_INCIDENTS)
    .filter(candidate => !isKnownCampaignMatch(candidate, knownCampaigns))
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      return String(right.latestDate || '').localeCompare(String(left.latestDate || ''));
    })
    .slice(0, headroom);

  console.log(`         ${candidates.length} promotable campaign candidate${candidates.length === 1 ? '' : 's'}\n`);
  return candidates;
}

async function fetchRssItems(sourceKey, sourceConfig) {
  const xml = await fetchText(sourceConfig.url);
  const parsed = RSS_PARSER.parse(xml);
  const items = ensureArray(parsed?.rss?.channel?.item);

  return items.map(item => ({
    sourceKey,
    title: stripHtml(textValue(item.title)),
    link: normalizeUrl(textValue(item.link)),
    published: textValue(item.pubDate),
    summary: stripHtml(textValue(item.description) || textValue(item.summary) || textValue(item['content:encoded'])),
    categories: ensureArray(item.category).map(textValue).map(stripHtml).filter(Boolean),
  })).filter(item => item.title && item.link);
}

function computeHeadroom(config, taskIndexes, type, requestedLimit) {
  const editorialMax = config.queues?.editorial?.max_pending ?? requestedLimit;
  const globalHeadroom = Math.max(0, editorialMax - taskIndexes.activeCount);
  const typedMax = config.queues?.by_type?.[type]?.max_pending;
  const typedHeadroom = typeof typedMax === 'number'
    ? Math.max(0, typedMax - (taskIndexes.byType[type] || 0))
    : requestedLimit;
  return Math.min(requestedLimit, globalHeadroom, typedHeadroom);
}

async function buildZeroDayCandidates(config, opts, indexes, rejectedCves) {
  const feedConfig = config.discovery_sources?.cisa_kev;
  const nvdConfig = config.discovery_sources?.nvd;
  if (!feedConfig?.enabled) return [];

  const headroom = computeHeadroom(config, indexes, 'zero-day', opts.limit);
  if (headroom <= 0) {
    console.log('         zero-day headroom exhausted — skipping zero-day discovery');
    return [];
  }

  console.log('  [2/6] Fetching CISA KEV catalog...');
  let kevData;
  try {
    kevData = await fetchJSON(feedConfig.url);
  } catch (error) {
    console.error(`  ERROR: Failed to fetch KEV: ${error.message}`);
    throw error;
  }
  console.log(`         ${kevData.count} total vulnerabilities in catalog`);
  console.log(`         Catalog version: ${kevData.catalogVersion}\n`);

  console.log('  [3/6] Filtering and deduplicating zero-day candidates...');
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - opts.days);
  const cutoffStr = cutoffDate.toISOString().split('T')[0];

  let rejectedSkipped = 0;
  const candidates = kevData.vulnerabilities
    .filter(entry => entry.dateAdded >= cutoffStr)
    .filter(entry => !indexes.cves.has(String(entry.cveID || '').toUpperCase()))
    .filter(entry => {
      if (rejectedCves.has(String(entry.cveID || '').toUpperCase())) {
        console.log(`::notice::Skipped ${entry.cveID} (in rejection memory)`);
        rejectedSkipped += 1;
        return false;
      }
      return true;
    })
    .map(entry => ({
      type: 'zero-day',
      kev: entry,
      inKev: true,
      r1Sources: 1,
      cvss: null,
      score: 0,
      autoCertify: false,
    }));

  const recentTotal = kevData.vulnerabilities.filter(entry => entry.dateAdded >= cutoffStr).length;
  const duplicateCount = recentTotal - candidates.length - rejectedSkipped;
  console.log(`         ${recentTotal} entries in last ${opts.days} days`);
  console.log(`         ${duplicateCount} already in corpus/tasks (deduped)`);
  console.log(`         ${rejectedSkipped} skipped via rejection memory`);
  console.log(`         ${candidates.length} new zero-day candidates\n`);

  if (candidates.length === 0) return [];
  if (!nvdConfig?.enabled || !nvdConfig?.base_url) {
    console.log('  [4/6] NVD enrichment disabled in config — scoring KEV candidates without CVSS enrichment\n');
    return candidates
      .map(scoreZeroDayCandidate)
      .sort((left, right) => right.score - left.score)
      .slice(0, headroom);
  }

  console.log(`  [4/6] Enriching ${Math.min(candidates.length, headroom * 2)} zero-day candidates with NVD CVSS data...`);
  const toEnrich = candidates.slice(0, headroom * 2);
  let enriched = 0;
  let rateLimited = false;

  for (const candidate of toEnrich) {
    if (rateLimited) break;
    const cvss = await fetchCvssScore(candidate.kev.cveID, nvdConfig.base_url);
    if (cvss?.rateLimited) {
      rateLimited = true;
      console.log('         ⚠ NVD rate limited — stopping enrichment early');
      break;
    }
    if (cvss) {
      candidate.cvss = cvss;
      candidate.r1Sources = 2;
      enriched += 1;
    }
    await new Promise(resolveDelay => setTimeout(resolveDelay, NVD_API_DELAY_MS));
  }

  console.log(`         Enriched ${enriched}/${toEnrich.length} with CVSS data${rateLimited ? ' (rate limited)' : ''}\n`);

  return candidates
    .map(scoreZeroDayCandidate)
    .sort((left, right) => right.score - left.score)
    .slice(0, headroom);
}

async function buildIncidentCandidates(config, opts, indexes, rejectedCandidateKeys) {
  const incidentSources = Object.entries(config.discovery_sources || {})
    .filter(([, sourceConfig]) => sourceConfig?.enabled && sourceConfig?.kind === 'incident');

  if (incidentSources.length === 0) return [];

  const headroom = computeHeadroom(config, indexes, 'incident', opts.limit);
  if (headroom <= 0) {
    console.log('  [2/6] Incident headroom exhausted — skipping incident discovery\n');
    return [];
  }

  console.log(`  [2/6] Fetching incident feeds (${incidentSources.length} configured)...`);

  const candidates = [];
  const seenUrls = new Set(indexes.urls);
  const seenTitleKeys = new Set(indexes.titleKeys);
  const seenSlugs = new Set(indexes.slugs);
  const seenCandidateKeys = new Set(rejectedCandidateKeys);
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - opts.days);

  for (const [sourceKey, sourceConfig] of incidentSources) {
    if (sourceConfig.format !== 'rss') {
      console.log(`         Skipping ${sourceKey} — unsupported format ${sourceConfig.format}`);
      continue;
    }

    let items;
    try {
      items = await fetchRssItems(sourceKey, sourceConfig);
    } catch (error) {
      console.log(`         WARN ${sourceKey}: ${error.message}`);
      continue;
    }

    const sourceCandidates = [];
    const sourceLocalKeys = new Set();
    for (const item of items) {
      const publishedAt = parseTimestamp(item.published);
      if (!publishedAt || publishedAt < cutoffDate) continue;

      const evaluation = evaluateIncidentItem(sourceKey, item);
      if (!evaluation.accepted) continue;

      const titleKey = normalizeTitleKey(item.title);
      const slug = generateIncidentSlug({ title: item.title, publishedAt: publishedAt.toISOString() });
      const candidateKey = buildIncidentCandidateKey(sourceKey, item.link);
      if (seenCandidateKeys.has(candidateKey)) continue;
      if (sourceLocalKeys.has(candidateKey)) continue;
      if (seenUrls.has(item.link)) continue;
      if (seenTitleKeys.has(titleKey)) continue;
      if (seenSlugs.has(slug)) continue;
      sourceLocalKeys.add(candidateKey);

      sourceCandidates.push({
        type: 'incident',
        sourceKey,
        sourceLabel: sourceConfig.label || sourceKey,
        candidateKey,
        title: item.title,
        url: item.link,
        publishedAt: publishedAt.toISOString(),
        publishedDate: publishedAt.toISOString().split('T')[0],
        summary: item.summary,
        categories: item.categories,
        score: evaluation.score,
        autoCertify: false,
        positiveHits: evaluation.positiveHits,
        boundaryHits: evaluation.boundaryHits,
        negativeHits: evaluation.negativeHits,
      });
    }

    sourceCandidates
      .sort((left, right) => {
        if (right.score !== left.score) return right.score - left.score;
        return String(right.publishedAt).localeCompare(String(left.publishedAt));
      })
      .slice(0, sourceConfig.limit_per_run || headroom)
      .forEach(candidate => {
        seenCandidateKeys.add(candidate.candidateKey);
        seenUrls.add(candidate.url);
        seenTitleKeys.add(normalizeTitleKey(candidate.title));
        seenSlugs.add(generateIncidentSlug(candidate));
        candidates.push(candidate);
      });

    console.log(`         ${sourceConfig.label || sourceKey}: ${sourceCandidates.length} scored candidates`);
  }

  console.log();

  return candidates
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      return String(right.publishedAt).localeCompare(String(left.publishedAt));
    })
    .slice(0, headroom);
}

function renderCandidateTable(candidates) {
  console.log(`  ${'Score'.padEnd(6)} ${'Type'.padEnd(11)} ${'Ref'.padEnd(24)} ${'Auto'.padEnd(5)} Topic`);
  console.log(`  ${'─'.repeat(6)} ${'─'.repeat(11)} ${'─'.repeat(24)} ${'─'.repeat(5)} ${'─'.repeat(64)}`);

  for (const candidate of candidates) {
    const type = candidate.type.padEnd(11);
    const ref = candidate.type === 'zero-day'
      ? String(candidate.kev.cveID).padEnd(24)
      : candidate.type === 'incident'
        ? `${candidate.sourceKey}:${candidate.publishedDate}`.slice(0, 24).padEnd(24)
        : candidate.type === 'threat-actor'
          ? `${candidate.firstSeenYear || 'unknown'}:${candidate.relatedIncidents.length} incidents`.slice(0, 24).padEnd(24)
          : `${candidate.promotionKind}:${candidate.relatedIncidents.length} incidents`.slice(0, 24).padEnd(24);
    const auto = candidate.autoCertify ? '  ✓ ' : '    ';
    const topic = candidate.type === 'zero-day'
      ? `${candidate.kev.vendorProject} ${candidate.kev.product} ${candidate.kev.cveID}`
      : candidate.type === 'incident'
        ? candidate.title
        : candidate.type === 'threat-actor'
          ? `${candidate.actorName} threat actor promotion`
          : `${candidate.campaignName} campaign promotion`;
    console.log(`  ${String(candidate.score).padEnd(6)} ${type} ${ref} ${auto} ${topic}`);
  }

  console.log();
}

async function main() {
  const opts = parseArgs();
  const config = loadPipelineConfig();
  const corpusIndexes = buildCorpusIndexes();
  const taskIndexes = buildTaskIndexes();
  const rejectionIndexes = buildRejectionIndexes();

  const knownIndexes = {
    cves: new Set([...corpusIndexes.cves, ...taskIndexes.cves]),
    urls: new Set([...corpusIndexes.urls, ...taskIndexes.urls]),
    titleKeys: new Set([...corpusIndexes.titleKeys, ...taskIndexes.titleKeys]),
    slugs: new Set([...corpusIndexes.slugs, ...taskIndexes.slugs]),
    activeCount: taskIndexes.activeCount,
    byType: taskIndexes.byType,
  };

  console.log('\n  Threatpedia Discovery Pipeline\n');
  console.log(`  Mode:      ${opts.execute ? 'EXECUTE (will write files)' : 'DRY RUN (preview only)'}`);
  console.log(`  Lane:      ${opts.mode}`);
  console.log(`  Lookback:  ${opts.days} days`);
  console.log(`  Limit:     ${opts.limit} tasks max`);
  console.log(`  Config:    ${config._source}${config._path ? ` (${config._path})` : ''}\n`);

  console.log('  [1/6] Building corpus/task indexes...');
  console.log(`         ${corpusIndexes.cves.size} CVEs in corpus, ${taskIndexes.cves.size} in pending tasks`);
  console.log(`         ${knownIndexes.urls.size} known source URLs across corpus/tasks`);
  console.log(`         ${knownIndexes.titleKeys.size} known title keys across corpus/tasks`);
  console.log(`         ${knownIndexes.activeCount} active tasks in queue`);
  console.log(`         ${rejectionIndexes.cves.size} operator-rejected CVEs (rejection memory)`);
  console.log(`         ${rejectionIndexes.candidateKeys.size} operator-rejected candidate keys\n`);

  const discovered = [];

  if (opts.mode === 'all' || opts.mode === 'zero-day') {
    const zeroDays = await buildZeroDayCandidates(config, opts, knownIndexes, rejectionIndexes.cves);
    discovered.push(...zeroDays);
  }

  if (opts.mode === 'all' || opts.mode === 'incident') {
    const incidents = await buildIncidentCandidates(config, opts, knownIndexes, rejectionIndexes.candidateKeys);
    discovered.push(...incidents);
  }

  if (opts.mode === 'all' || opts.mode === 'threat-actor') {
    const actors = await buildThreatActorPromotionCandidates(config, opts, knownIndexes, rejectionIndexes.candidateKeys);
    discovered.push(...actors);
  }

  if (opts.mode === 'all' || opts.mode === 'campaign') {
    const campaigns = await buildCampaignPromotionCandidates(config, opts, knownIndexes, rejectionIndexes.candidateKeys);
    discovered.push(...campaigns);
  }

  if (discovered.length === 0) {
    console.log('  No new candidates found. Nothing to do.\n');
    return;
  }

  const maxGlobalHeadroom = Math.max(0, (config.queues?.editorial?.max_pending ?? opts.limit) - knownIndexes.activeCount);
  const selected = discovered
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      if (left.type !== right.type) return left.type.localeCompare(right.type);
      const leftDate = left.type === 'zero-day'
        ? left.kev.dateAdded
        : left.type === 'incident'
          ? left.publishedAt
          : left.latestDate;
      const rightDate = right.type === 'zero-day'
        ? right.kev.dateAdded
        : right.type === 'incident'
          ? right.publishedAt
          : right.latestDate;
      return String(rightDate).localeCompare(String(leftDate));
    })
    .slice(0, Math.min(opts.limit, maxGlobalHeadroom));

  console.log('  [5/6] Ranked candidates...\n');
  renderCandidateTable(selected);

  if (!opts.execute) return;

  console.log('  [6/6] Creating pipeline tasks...\n');
  const existingExploitIds = collectExploitIds();
  let nextIdNum = parseInt(getNextTaskId().match(/(\d{4})$/)[1], 10);

  for (const candidate of selected) {
    const taskId = `TASK-2026-${String(nextIdNum).padStart(4, '0')}`;
    const task = candidate.type === 'zero-day'
      ? buildZeroDayTask(candidate, taskId, generateExploitId(candidate.kev.cveID, existingExploitIds))
      : candidate.type === 'incident'
        ? buildIncidentTask(candidate, taskId)
        : candidate.type === 'threat-actor'
          ? buildThreatActorTask(candidate, taskId)
          : buildCampaignTask(candidate, taskId);

    if (candidate.type === 'zero-day') {
      existingExploitIds.push(task.input.candidate_data.exploitId);
    }

    const filePath = resolve(TASKS_DIR, `${taskId}.json`);
    writeFileSync(filePath, `${JSON.stringify(task, null, 2)}\n`, 'utf8');
    console.log(`  ✓ Created ${taskId} → ${candidate.type} → ${task.input.topic}`);

    nextIdNum += 1;
  }

  console.log('\n  Done.\n');
}

main().catch(error => {
  console.error(`\n  ERROR: ${error.message}`);
  process.exit(1);
});
