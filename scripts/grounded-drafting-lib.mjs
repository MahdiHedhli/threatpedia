import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

export const LANES = new Set(['incident', 'zero-day', 'campaign', 'threat-actor', 'malware-family']);
export const SOURCE_TYPES = new Set(['government', 'vendor', 'database', 'research', 'news', 'other']);
export const PRIMARY_SOURCE_TYPES = new Set(['government', 'vendor', 'database', 'research']);
export const CLAIM_TYPES = new Set(['date', 'product', 'vulnerability', 'exploitation', 'impact', 'mitigation', 'attribution', 'other']);
export const SECTION_MAP = {
  incident: 'incidents',
  'zero-day': 'zero-days',
  campaign: 'campaigns',
  'threat-actor': 'threat-actors',
  'malware-family': 'supply-chain-malware-families',
};

const HTML_TAG_RE = /<[^>]+>/g;
const WHITESPACE_RE = /\s+/g;
const CVE_RE = /\bCVE-\d{4}-\d{4,}\b/gi;
const GHSA_RE = /\bGHSA-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}\b/gi;
const OSV_RE = /\b(?:MAL|PYSEC|GO)-\d{4}-[A-Z0-9-]+\b/gi;
const FETCH_TIMEOUT_MS = 15000;

export function repoPath(root, relativeOrAbsolutePath) {
  return path.isAbsolute(relativeOrAbsolutePath)
    ? relativeOrAbsolutePath
    : path.resolve(root, relativeOrAbsolutePath);
}

export function readJson(root, relativeOrAbsolutePath) {
  return JSON.parse(readFileSync(repoPath(root, relativeOrAbsolutePath), 'utf8'));
}

export function writeJson(root, relativeOrAbsolutePath, value) {
  const abs = repoPath(root, relativeOrAbsolutePath);
  mkdirSync(path.dirname(abs), { recursive: true });
  writeFileSync(abs, `${JSON.stringify(value, null, 2)}\n`);
}

export function writeText(root, relativeOrAbsolutePath, value) {
  const abs = repoPath(root, relativeOrAbsolutePath);
  mkdirSync(path.dirname(abs), { recursive: true });
  writeFileSync(abs, value);
}

export function normalizeWhitespace(value) {
  return String(value || '').replace(WHITESPACE_RE, ' ').trim();
}

export function slugPart(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9@._/-]+/g, '-')
    .replace(/[\/@._]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

export function sha(value, len = 12) {
  return createHash('sha256').update(String(value)).digest('hex').slice(0, len);
}

export function uniqueStrings(values) {
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

export function isoDate(value) {
  if (!value) return null;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : new Date(parsed).toISOString().slice(0, 10);
}

export function classifySource(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return { publisher: 'Unknown', source_type: 'other' };
  }
  const host = parsed.hostname.toLowerCase();
  if (host === 'cisa.gov' || host.endsWith('.cisa.gov')) return { publisher: 'CISA', source_type: 'database' };
  if (host === 'cve.org' || host.endsWith('.cve.org') || host === 'cve.mitre.org') return { publisher: 'CVE Program', source_type: 'database' };
  if (host === 'nist.gov' || host.endsWith('.nist.gov')) return { publisher: 'NIST', source_type: 'database' };
  if (host === 'osv.dev' || host.endsWith('.osv.dev')) return { publisher: 'OSV.dev', source_type: 'database' };
  if (host === 'github.com' && parsed.pathname.startsWith('/advisories')) return { publisher: 'GitHub Advisory Database', source_type: 'database' };
  if (host === 'github.com' || host.endsWith('.github.com')) return { publisher: 'GitHub', source_type: 'research' };
  if (host === 'npmjs.com' || host.endsWith('.npmjs.com') || host === 'registry.npmjs.org') return { publisher: 'npm Registry', source_type: 'database' };
  if (host === 'pypi.org' || host.endsWith('.pypi.org')) return { publisher: 'PyPI', source_type: 'database' };
  if (host === 'microsoft.com' || host.endsWith('.microsoft.com')) return { publisher: 'Microsoft', source_type: 'vendor' };
  if (host === 'google.com' || host.endsWith('.google.com')) return { publisher: 'Google', source_type: 'vendor' };
  if (host === 'socket.dev' || host.endsWith('.socket.dev')) return { publisher: 'Socket', source_type: 'research' };
  if (host === 'snyk.io' || host.endsWith('.snyk.io')) return { publisher: 'Snyk', source_type: 'research' };
  if (host === 'wiz.io' || host.endsWith('.wiz.io')) return { publisher: 'Wiz', source_type: 'research' };
  if (host === 'trendmicro.com' || host.endsWith('.trendmicro.com')) return { publisher: 'Trend Micro', source_type: 'vendor' };
  if (host === 'thehackernews.com' || host.endsWith('.thehackernews.com')) return { publisher: 'The Hacker News', source_type: 'news' };
  return { publisher: parsed.hostname, source_type: 'other' };
}

export function sourceFixtureName(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return `${sha(url)}.txt`;
  }
  const stem = slugPart(`${parsed.hostname}${parsed.pathname}`) || sha(url);
  return `${stem}.txt`;
}

function stripHtml(text) {
  return String(text || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(HTML_TAG_RE, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function extractTitle(rawText) {
  const titleMatch = String(rawText || '').match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return titleMatch ? normalizeWhitespace(stripHtml(titleMatch[1])) : null;
}

export async function fetchSourceText(url, { fixturesDir = null, root = process.cwd() } = {}) {
  if (fixturesDir) {
    const fixturePath = repoPath(root, path.join(fixturesDir, sourceFixtureName(url)));
    if (!existsSync(fixturePath)) throw new Error(`missing source fixture ${fixturePath}`);
    return readFileSync(fixturePath, 'utf8');
  }
  const response = await fetch(url, {
    headers: {
      Accept: 'text/html, text/plain, application/json, */*',
      'User-Agent': 'threatpedia-grounded-drafting/1.0 (+https://threatpedia.wiki)',
    },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`${url} returned ${response.status} ${response.statusText}`);
  return response.text();
}

export async function extractSource(url, sourceId, options = {}) {
  const classification = classifySource(url);
  try {
    const raw = await fetchSourceText(url, options);
    const extractedText = normalizeWhitespace(stripHtml(raw)).slice(0, 5000);
    return {
      source: {
        id: sourceId,
        publisher: classification.publisher,
        url,
        published_at: null,
        source_type: classification.source_type,
        role: PRIMARY_SOURCE_TYPES.has(classification.source_type) ? 'primary' : 'supporting',
        notes: 'Fetched and extracted by the grounded source-packet builder.',
      },
      extract: {
        source_id: sourceId,
        status: 'ok',
        title: extractTitle(raw),
        extracted_at: new Date().toISOString(),
        extracted_text: extractedText,
      },
    };
  } catch (error) {
    return {
      source: {
        id: sourceId,
        publisher: classification.publisher,
        url,
        published_at: null,
        source_type: classification.source_type,
        role: PRIMARY_SOURCE_TYPES.has(classification.source_type) ? 'primary' : 'supporting',
        notes: `Fetch failed: ${error.message}`,
      },
      extract: {
        source_id: sourceId,
        status: 'failed',
        title: null,
        extracted_at: new Date().toISOString(),
        extracted_text: '',
        error: error.message,
      },
    };
  }
}

export function extractIds(text) {
  const joined = String(text || '');
  return {
    cves: uniqueStrings(joined.match(CVE_RE) || []).map((id) => id.toUpperCase()),
    ghsas: uniqueStrings(joined.match(GHSA_RE) || []).map((id) => id.toUpperCase()),
    osvIds: uniqueStrings(joined.match(OSV_RE) || []).map((id) => id.toUpperCase()),
  };
}

export function candidateById(queue, candidateId) {
  const candidates = Array.isArray(queue?.candidates) ? queue.candidates : [];
  return candidates.find((candidate) => candidate?.candidateId === candidateId || candidate?.canonicalSubjectId === candidateId);
}

export function laneForCandidate(candidate) {
  const lane = String(candidate?.proposedArchetype || 'incident');
  return LANES.has(lane) ? lane : 'incident';
}

export function claim(claims, claimText, type, sourceRefs, articleSection = 'summary', confidence = 'high') {
  const cleaned = normalizeWhitespace(claimText);
  const refs = uniqueStrings(sourceRefs);
  if (!cleaned || refs.length === 0) return;
  claims.push({
    claim_id: `claim-${claims.length + 1}`,
    claim: cleaned,
    claim_type: CLAIM_TYPES.has(type) ? type : 'other',
    source_refs: refs,
    confidence,
    article_section: articleSection,
  });
}

export function safeTitle(value) {
  return normalizeWhitespace(value).replace(/["<>]/g, '').slice(0, 100) || 'Untitled Threatpedia Draft';
}

export function markdownEscape(value) {
  return String(value || '').replace(/\|/g, '\\|').trim();
}

export function yamlString(value) {
  return `"${String(value || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

export function numericId(seed, year = new Date().getUTCFullYear()) {
  const value = Number.parseInt(sha(seed, 8), 16) % 9000 + 1000;
  return `TP-${year}-${String(value).padStart(4, '0')}`;
}
