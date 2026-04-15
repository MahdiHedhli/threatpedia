#!/usr/bin/env node
/**
 * pipeline-discover.mjs — Automated Discovery Pipeline
 *
 * Fetches high-trust threat intelligence feeds, scores discovered events,
 * deduplicates against the existing corpus, and creates pipeline tasks.
 *
 * Feed priority (by trust):
 *   1. CISA KEV Catalog  — R1 government, pre-vetted, structured
 *   2. NVD/CVE Feed      — R1 government, CVSS enrichment
 *   (future: CISA Alerts, NCSC UK, vendor advisories, research firms)
 *
 * Scoring model:
 *   R1 source count (40%) + CISA KEV (20%) + CVSS ≥7.0 (15%)
 *   + cross-source corroboration (15%) + active exploitation (10%)
 *
 * Auto-publish threshold: score ≥ 80 AND 2+ R1 sources AND (KEV OR CVSS ≥ 7.0)
 *
 * Usage:
 *   node scripts/pipeline-discover.mjs                    # Discover + create tasks (dry run)
 *   node scripts/pipeline-discover.mjs --execute          # Discover + create tasks (write files)
 *   node scripts/pipeline-discover.mjs --days 7           # Look back N days (default: 7)
 *   node scripts/pipeline-discover.mjs --limit 10         # Max tasks to create (default: 10)
 *   node scripts/pipeline-discover.mjs --execute --days 3 --limit 5
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const TASKS_DIR = resolve(ROOT, '.github/pipeline/tasks');
const CONTENT_DIR = resolve(ROOT, 'site/src/content');

// ── Feed URLs ──────────────────────────────────────────────────────────────
const FEEDS = {
  CISA_KEV: 'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json',
  NVD_CVE: 'https://services.nvd.nist.gov/rest/json/cves/2.0',
};

// ── Scoring weights ────────────────────────────────────────────────────────
const WEIGHTS = {
  R1_SOURCE_COUNT: 0.40,
  CISA_KEV: 0.20,
  CVSS_HIGH: 0.15,
  CROSS_SOURCE: 0.15,
  ACTIVE_EXPLOITATION: 0.10,
};

// Auto-publish threshold
const AUTO_CERTIFY_THRESHOLD = 80;

// ── CLI ────────────────────────────────────────────────────────────────────
function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = { execute: false, days: 7, limit: 10 };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--execute') parsed.execute = true;
    if (args[i] === '--days' && args[i + 1]) parsed.days = parseInt(args[++i], 10);
    if (args[i] === '--limit' && args[i + 1]) parsed.limit = parseInt(args[++i], 10);
  }

  return parsed;
}

// ── Corpus CVE index ───────────────────────────────────────────────────────
function buildCorpusCveIndex() {
  const cves = new Set();
  const dirs = ['incidents', 'campaigns', 'zero-days', 'threat-actors'];

  for (const dir of dirs) {
    const dirPath = resolve(CONTENT_DIR, dir);
    if (!existsSync(dirPath)) continue;

    for (const file of readdirSync(dirPath).filter(f => f.endsWith('.md'))) {
      const content = readFileSync(resolve(dirPath, file), 'utf8');
      const matches = content.matchAll(/CVE-\d{4}-\d+/g);
      for (const m of matches) cves.add(m[0]);
    }
  }

  return cves;
}

// ── Existing task CVE index ────────────────────────────────────────────────
function buildTaskCveIndex() {
  const cves = new Set();
  if (!existsSync(TASKS_DIR)) return cves;

  for (const file of readdirSync(TASKS_DIR).filter(f => f.endsWith('.json'))) {
    const task = JSON.parse(readFileSync(resolve(TASKS_DIR, file), 'utf8'));
    // Check candidate_data.cves and candidate_data.cve
    const cd = task.input?.candidate_data || {};
    if (cd.cve) cves.add(cd.cve);
    if (cd.cves) cd.cves.forEach(c => cves.add(c));
    // Check topic for CVE mentions
    const topicCves = (task.input?.topic || '').matchAll(/CVE-\d{4}-\d+/g);
    for (const m of topicCves) cves.add(m[0]);
  }

  return cves;
}

// ── Next available task ID ─────────────────────────────────────────────────
function getNextTaskId() {
  if (!existsSync(TASKS_DIR)) return 'TASK-2026-0071';

  const existing = readdirSync(TASKS_DIR)
    .filter(f => f.match(/^TASK-\d{4}-\d{4}\.json$/))
    .map(f => parseInt(f.match(/TASK-\d{4}-(\d{4})/)[1], 10))
    .sort((a, b) => b - a);

  const next = existing.length > 0 ? existing[0] + 1 : 71;
  return `TASK-2026-${String(next).padStart(4, '0')}`;
}

// ── Fetch with timeout ─────────────────────────────────────────────────────
async function fetchJSON(url, timeout = 30000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

// ── NVD CVSS enrichment ───────────────────────────────────────────────────
async function fetchCvssScore(cveId) {
  try {
    const data = await fetchJSON(`${FEEDS.NVD_CVE}?cveId=${cveId}`, 15000);
    const vuln = data?.vulnerabilities?.[0]?.cve;
    if (!vuln) return null;

    // Try CVSS 3.1 first, then 3.0, then 2.0
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
    return null; // NVD rate limited or unavailable — not fatal
  }
}

// ── Score a candidate ──────────────────────────────────────────────────────
function scoreCandidate(candidate) {
  let score = 0;

  // R1 source count (40%): KEV = 1 R1, NVD = 1 R1 → max 2 from our current feeds
  const r1Count = candidate.r1Sources || 0;
  const r1Score = Math.min(r1Count / 2, 1) * 100; // 2+ R1 sources = full marks
  score += r1Score * WEIGHTS.R1_SOURCE_COUNT;

  // CISA KEV (20%): binary — is it in KEV?
  score += (candidate.inKev ? 100 : 0) * WEIGHTS.CISA_KEV;

  // CVSS ≥ 7.0 (15%): scaled 0-100 based on CVSS score
  if (candidate.cvss) {
    const cvssScore = Math.min(candidate.cvss.score / 10, 1) * 100;
    score += cvssScore * WEIGHTS.CVSS_HIGH;
  }

  // Cross-source corroboration (15%): CWE data, notes with multiple URLs
  const noteUrls = (candidate.notes || '').split(';').filter(s => s.trim().startsWith('http')).length;
  const crossScore = Math.min((noteUrls + (candidate.cwes?.length || 0)) / 3, 1) * 100;
  score += crossScore * WEIGHTS.CROSS_SOURCE;

  // Active exploitation (10%): KEV implies active exploitation
  score += (candidate.inKev ? 100 : 0) * WEIGHTS.ACTIVE_EXPLOITATION;

  candidate.score = Math.round(score);

  // Auto-certify check
  candidate.autoCertify = (
    candidate.score >= AUTO_CERTIFY_THRESHOLD &&
    (candidate.r1Sources || 0) >= 2 &&
    (candidate.inKev || (candidate.cvss && candidate.cvss.score >= 7.0))
  );

  return candidate;
}

// ── Determine article type ─────────────────────────────────────────────────
function determineArticleType(kevEntry) {
  // KEV entries are vulnerabilities → zero-day articles
  // If knownRansomwareCampaignUse === "Known", also consider incident
  if (kevEntry.knownRansomwareCampaignUse === 'Known') {
    return 'zero-day'; // Still zero-day, but notes should mention ransomware use
  }
  return 'zero-day';
}

// ── Generate slug ──────────────────────────────────────────────────────────
function generateSlug(kevEntry) {
  const vendor = kevEntry.vendorProject.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const product = kevEntry.product.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const cve = kevEntry.cveID.toLowerCase();
  // Truncate to reasonable length
  const base = `${vendor}-${product}-${cve}`.substring(0, 80);
  return base.replace(/-+$/, '');
}

// ── Generate exploitId ─────────────────────────────────────────────────────
function generateExploitId(cveId, existingIds) {
  const cveYear = cveId.match(/CVE-(\d{4})/)?.[1] || new Date().getFullYear().toString();

  // Find next available sequence for this year
  const yearIds = existingIds
    .filter(id => id.includes(`TP-EXP-${cveYear}-`))
    .map(id => parseInt(id.match(/TP-EXP-\d{4}-(\d{4})/)?.[1] || '0', 10));

  const next = yearIds.length > 0 ? Math.max(...yearIds) + 1 : 1;
  return `TP-EXP-${cveYear}-${String(next).padStart(4, '0')}`;
}

// ── Build task JSON ────────────────────────────────────────────────────────
function buildTask(candidate, taskId) {
  const slug = generateSlug(candidate.kev);
  const cveYear = candidate.kev.cveID.match(/CVE-(\d{4})/)?.[1] || '????';

  const sourcesSet = new Set([
    `https://www.cisa.gov/known-exploited-vulnerabilities-catalog`,
    `https://nvd.nist.gov/vuln/detail/${candidate.kev.cveID}`,
  ]);

  // Add any URLs from KEV notes (deduped)
  const noteUrls = (candidate.kev.notes || '').split(';')
    .map(s => s.trim())
    .filter(s => s.startsWith('http'));
  noteUrls.forEach(u => sourcesSet.add(u));

  const sources = [...sourcesSet];

  const notes = [
    `CISA KEV entry added ${candidate.kev.dateAdded}.`,
    `Required action by ${candidate.kev.dueDate}.`,
    candidate.kev.knownRansomwareCampaignUse === 'Known'
      ? 'Known ransomware campaign use — mention in article body.'
      : null,
    candidate.cvss
      ? `CVSS ${candidate.cvss.version}: ${candidate.cvss.score} (${candidate.cvss.severity})`
      : null,
    `Discovery score: ${candidate.score}/100${candidate.autoCertify ? ' (auto-certify eligible)' : ''}.`,
  ].filter(Boolean).join(' ');

  return {
    task_id: taskId,
    type: 'zero-day',
    priority: candidate.score >= 80 ? 'P0' : candidate.score >= 60 ? 'P1' : 'P2',
    status: 'pending',
    input: {
      topic: `${candidate.kev.vulnerabilityName} (${candidate.kev.cveID})`,
      sources,
      candidate_data: {
        cve: candidate.kev.cveID,
        type: guessVulnType(candidate.kev),
        platform: `${candidate.kev.vendorProject} ${candidate.kev.product}`,
        severity: candidate.cvss
          ? (candidate.cvss.score >= 9 ? 'critical' : candidate.cvss.score >= 7 ? 'high' : candidate.cvss.score >= 4 ? 'medium' : 'low')
          : 'high', // Default high since it's in KEV
        cisaKev: true,
        disclosedDate: candidate.kev.dateAdded,
        cwes: candidate.kev.cwes || [],
        knownRansomwareUse: candidate.kev.knownRansomwareCampaignUse === 'Known',
      },
      notes,
    },
    output: {
      file_pattern: `site/src/content/zero-days/${slug}.md`,
      branch: `bot/discover-${taskId.toLowerCase()}`,
    },
    acceptance_criteria: {
      min_sources: 3,
      min_h2_sections: 5,
      min_mitre_mappings: 1,
      review_status: 'draft_ai',
      frontmatter_valid: true,
      astro_build: true,
    },
    discovery: {
      feed: 'CISA_KEV',
      score: candidate.score,
      auto_certify: candidate.autoCertify,
      cvss: candidate.cvss,
      discovered_at: new Date().toISOString(),
    },
    history: [
      {
        timestamp: new Date().toISOString(),
        action: 'created',
        agent: 'pipeline-discover',
        note: `Auto-discovered from CISA KEV (score: ${candidate.score})`,
      },
    ],
  };
}

// ── Guess vulnerability type from KEV data ─────────────────────────────────
function guessVulnType(kev) {
  const name = (kev.vulnerabilityName + ' ' + kev.shortDescription).toLowerCase();
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

// ── Collect existing exploitIds ────────────────────────────────────────────
function collectExploitIds() {
  const ids = [];
  const zdDir = resolve(CONTENT_DIR, 'zero-days');
  if (!existsSync(zdDir)) return ids;

  for (const file of readdirSync(zdDir).filter(f => f.endsWith('.md'))) {
    const content = readFileSync(resolve(zdDir, file), 'utf8');
    const match = content.match(/exploitId:\s*["']?(TP-EXP-\d{4}-\d{4})/);
    if (match) ids.push(match[1]);
  }

  // Also check pending tasks
  if (existsSync(TASKS_DIR)) {
    for (const file of readdirSync(TASKS_DIR).filter(f => f.endsWith('.json'))) {
      const task = JSON.parse(readFileSync(resolve(TASKS_DIR, file), 'utf8'));
      const eid = task.input?.candidate_data?.exploitId;
      if (eid) ids.push(eid);
    }
  }

  return ids;
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  const opts = parseArgs();

  console.log(`\n  Threatpedia Discovery Pipeline\n`);
  console.log(`  Mode:      ${opts.execute ? 'EXECUTE (will write files)' : 'DRY RUN (preview only)'}`);
  console.log(`  Lookback:  ${opts.days} days`);
  console.log(`  Limit:     ${opts.limit} tasks max\n`);

  // ── Step 1: Build dedup indexes ──────────────────────────────────────────
  console.log('  [1/5] Building corpus CVE index...');
  const corpusCves = buildCorpusCveIndex();
  const taskCves = buildTaskCveIndex();
  const allKnownCves = new Set([...corpusCves, ...taskCves]);
  console.log(`         ${corpusCves.size} CVEs in corpus, ${taskCves.size} in pending tasks`);
  console.log(`         ${allKnownCves.size} unique CVEs total (dedup set)\n`);

  // ── Step 2: Fetch CISA KEV ───────────────────────────────────────────────
  console.log('  [2/5] Fetching CISA KEV catalog...');
  let kevData;
  try {
    kevData = await fetchJSON(FEEDS.CISA_KEV);
  } catch (err) {
    console.error(`  ERROR: Failed to fetch KEV: ${err.message}`);
    process.exit(1);
  }
  console.log(`         ${kevData.count} total vulnerabilities in catalog`);
  console.log(`         Catalog version: ${kevData.catalogVersion}\n`);

  // ── Step 3: Filter by date + dedup ───────────────────────────────────────
  console.log('  [3/5] Filtering and deduplicating...');
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - opts.days);
  const cutoffStr = cutoffDate.toISOString().split('T')[0];

  const candidates = kevData.vulnerabilities
    .filter(v => v.dateAdded >= cutoffStr)
    .filter(v => !allKnownCves.has(v.cveID))
    .map(v => ({
      kev: v,
      inKev: true,
      r1Sources: 1, // KEV itself is 1 R1 source
      cvss: null,
      score: 0,
      autoCertify: false,
    }));

  const recentTotal = kevData.vulnerabilities.filter(v => v.dateAdded >= cutoffStr).length;
  const dupes = recentTotal - candidates.length;
  console.log(`         ${recentTotal} entries in last ${opts.days} days`);
  console.log(`         ${dupes} already in corpus/tasks (deduped)`);
  console.log(`         ${candidates.length} new candidates\n`);

  if (candidates.length === 0) {
    console.log('  No new candidates found. Nothing to do.\n');
    return;
  }

  // ── Step 4: Enrich with NVD CVSS ─────────────────────────────────────────
  console.log(`  [4/5] Enriching ${Math.min(candidates.length, opts.limit)} candidates with NVD CVSS data...`);

  // Only enrich up to limit (NVD has rate limits)
  const toEnrich = candidates.slice(0, opts.limit * 2); // Fetch extra in case some fail
  let enriched = 0;
  let rateLimited = false;

  for (const candidate of toEnrich) {
    if (rateLimited) break;

    const cvss = await fetchCvssScore(candidate.kev.cveID);
    if (cvss) {
      candidate.cvss = cvss;
      candidate.r1Sources = 2; // KEV + NVD = 2 R1 sources
      enriched++;
    }

    // NVD rate limit: 5 req / 30 sec without API key
    await new Promise(r => setTimeout(r, 6500));
  }

  console.log(`         Enriched ${enriched}/${toEnrich.length} with CVSS data\n`);

  // ── Step 5: Score and rank ───────────────────────────────────────────────
  console.log('  [5/5] Scoring candidates...\n');

  const scored = candidates
    .map(c => scoreCandidate(c))
    .sort((a, b) => b.score - a.score)
    .slice(0, opts.limit);

  // ── Output ───────────────────────────────────────────────────────────────
  console.log(`  ${'Score'.padEnd(6)} ${'CVE'.padEnd(18)} ${'CVSS'.padEnd(6)} ${'Type'.padEnd(25)} ${'Auto'.padEnd(5)} Vendor / Product`);
  console.log(`  ${'─'.repeat(6)} ${'─'.repeat(18)} ${'─'.repeat(6)} ${'─'.repeat(25)} ${'─'.repeat(5)} ${'─'.repeat(40)}`);

  for (const c of scored) {
    const cvssStr = c.cvss ? c.cvss.score.toFixed(1) : '  — ';
    const vulnType = guessVulnType(c.kev).substring(0, 24);
    const autoCert = c.autoCertify ? '  ✓ ' : '    ';
    console.log(`  ${String(c.score).padEnd(6)} ${c.kev.cveID.padEnd(18)} ${cvssStr.padEnd(6)} ${vulnType.padEnd(25)} ${autoCert} ${c.kev.vendorProject} ${c.kev.product}`);
  }

  console.log();

  // ── Create tasks ─────────────────────────────────────────────────────────
  if (opts.execute) {
    console.log('  Creating pipeline tasks...\n');
    const existingExploitIds = collectExploitIds();
    let nextIdNum = parseInt(getNextTaskId().match(/(\d{4})$/)[1], 10);

    for (const candidate of scored) {
      const taskId = `TASK-2026-${String(nextIdNum).padStart(4, '0')}`;
      const task = buildTask(candidate, taskId);

      const filePath = resolve(TASKS_DIR, `${taskId}.json`);
      writeFileSync(filePath, JSON.stringify(task, null, 2) + '\n');
      console.log(`  ✓ ${taskId} — ${candidate.kev.cveID} (score: ${candidate.score}${candidate.autoCertify ? ', auto-certify' : ''})`);

      nextIdNum++;
    }

    console.log(`\n  Created ${scored.length} task(s) in ${TASKS_DIR}`);
    console.log(`  Next: node scripts/pipeline-run-task.mjs --list\n`);
  } else {
    console.log(`  DRY RUN — ${scored.length} task(s) would be created.`);
    console.log(`  Run with --execute to write task files.\n`);
  }

  // ── Summary ──────────────────────────────────────────────────────────────
  const autoCount = scored.filter(c => c.autoCertify).length;
  const reviewCount = scored.length - autoCount;

  console.log('  ─── Summary ───────────────────────────────────────────');
  console.log(`  Candidates found:    ${candidates.length}`);
  console.log(`  Tasks to create:     ${scored.length}`);
  console.log(`  Auto-certify (≥80):  ${autoCount}`);
  console.log(`  Needs review (<80):  ${reviewCount}`);
  if (scored.length > 0) {
    console.log(`  Score range:         ${scored[scored.length - 1].score}–${scored[0].score}`);
  }
  console.log();
}

main().catch(err => {
  console.error(`\n  FATAL: ${err.message}\n`);
  process.exit(1);
});
