#!/usr/bin/env node
/**
 * pipeline-reject.mjs — Append a CVE to .github/pipeline/rejected-candidates.json.
 *
 * Operator-invoked helper (via .github/workflows/pipeline-reject.yml) that
 * records an operator veto on a discovery candidate so the next discovery
 * run will skip it during dedup.
 *
 * Usage:
 *   node scripts/pipeline-reject.mjs --cve CVE-2026-34197 \
 *        --reason "operator veto" \
 *        [--topic "Apache ActiveMQ ..."] \
 *        [--pr 60]
 *
 * Behavior:
 *   - Reads .github/pipeline/rejected-candidates.json (file must exist)
 *   - Refuses to add a duplicate CVE (exits 2 with a clear message)
 *   - Appends {cve, rejected_at, topic, reason, rejected_via_pr?}
 *   - Updates lastUpdated
 *   - Writes JSON: 2-space indent, trailing newline, no unicode escapes
 *
 * Re-eligibility: operator removes the entry via PR edit. No automatic timeout.
 *
 * See docs/PIPELINE.md — Rejection memory. TASK-2026-0067 / Slice 4c.
 */

import { fileURLToPath } from 'url';
import { resolve, join, dirname } from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';

const REJECTION_FILE_REL = '.github/pipeline/rejected-candidates.json';

// ── CVE normalization ──────────────────────────────────────────────────────
const CVE_RE = /^CVE-\d{4}-\d{4,}$/;

export function normalizeCve(raw) {
  if (typeof raw !== 'string') return null;
  const up = raw.trim().toUpperCase();
  return CVE_RE.test(up) ? up : null;
}

// ── File I/O ───────────────────────────────────────────────────────────────
export function loadRejectionFile(path) {
  const raw = readFileSync(path, 'utf8');
  const parsed = JSON.parse(raw);
  if (!parsed || typeof parsed !== 'object') {
    throw new Error(`Malformed rejection file: root is not an object (${path})`);
  }
  if (!Array.isArray(parsed.rejected)) {
    throw new Error(`Malformed rejection file: 'rejected' is not an array (${path})`);
  }
  return parsed;
}

export function writeRejectionFile(path, data) {
  const out = JSON.stringify(data, null, 2) + '\n';
  writeFileSync(path, out, 'utf8');
}

// ── Core operation ─────────────────────────────────────────────────────────
export function appendRejection(data, { cve, topic, reason, pr, now }) {
  const normalized = normalizeCve(cve);
  if (!normalized) {
    throw new Error(`Invalid CVE: ${JSON.stringify(cve)} (expected CVE-YYYY-NNNN...)`);
  }
  if (!reason || typeof reason !== 'string' || !reason.trim()) {
    throw new Error('--reason is required and must be a non-empty string');
  }
  const dupe = data.rejected.find((e) => normalizeCve(e.cve) === normalized);
  if (dupe) {
    throw new Error(
      `${normalized} already in rejection list (rejected_at=${dupe.rejected_at}). ` +
      `To re-surface, remove the entry via PR edit.`
    );
  }
  const entry = {
    cve: normalized,
    rejected_at: (now || new Date()).toISOString(),
    reason: reason.trim(),
  };
  if (topic && typeof topic === 'string' && topic.trim()) {
    entry.topic = topic.trim();
  }
  if (pr !== undefined && pr !== null && pr !== '') {
    const n = Number(pr);
    if (!Number.isInteger(n) || n <= 0) {
      throw new Error(`--pr must be a positive integer, got ${JSON.stringify(pr)}`);
    }
    entry.rejected_via_pr = n;
  }
  data.rejected.push(entry);
  data.lastUpdated = entry.rejected_at;
  return entry;
}

// ── Self-test (runs at import to catch shape drift) ────────────────────────
function selfTest() {
  // normalizeCve
  if (normalizeCve('cve-2026-1') !== null) throw new Error('selfTest: short CVE should fail');
  if (normalizeCve('CVE-2026-34197') !== 'CVE-2026-34197') throw new Error('selfTest: normalize identity');
  if (normalizeCve('  cve-2026-34197  ') !== 'CVE-2026-34197') throw new Error('selfTest: normalize case/trim');
  if (normalizeCve('NOT-A-CVE') !== null) throw new Error('selfTest: bad shape rejected');
  if (normalizeCve(null) !== null) throw new Error('selfTest: null rejected');

  // appendRejection shape
  const fakeNow = new Date('2026-04-18T04:00:00Z');
  const data = { version: '1.0', description: 'x', lastUpdated: 'old', rejected: [] };
  const e = appendRejection(data, { cve: 'CVE-2026-00001', reason: 'test', now: fakeNow });
  if (e.cve !== 'CVE-2026-00001') throw new Error('selfTest: append cve');
  if (data.rejected.length !== 1) throw new Error('selfTest: append length');
  if (data.lastUpdated !== fakeNow.toISOString()) throw new Error('selfTest: lastUpdated');
  // duplicate
  let threw = false;
  try { appendRejection(data, { cve: 'cve-2026-00001', reason: 'test', now: fakeNow }); }
  catch { threw = true; }
  if (!threw) throw new Error('selfTest: duplicate must throw');
}
selfTest();

// ── CLI ────────────────────────────────────────────────────────────────────
function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--cve') out.cve = argv[++i];
    else if (a === '--topic') out.topic = argv[++i];
    else if (a === '--reason') out.reason = argv[++i];
    else if (a === '--pr') out.pr = argv[++i];
    else if (a === '--file') out.file = argv[++i];
    else if (a === '--help' || a === '-h') out.help = true;
  }
  return out;
}

function printHelp() {
  process.stdout.write(
    'Usage: node scripts/pipeline-reject.mjs --cve <CVE-ID> --reason <text> [--topic <text>] [--pr <number>] [--file <path>]\n'
  );
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) { printHelp(); process.exit(0); }
  if (!args.cve || !args.reason) {
    console.error('Error: --cve and --reason are required');
    printHelp();
    process.exit(2);
  }

  // Resolve rejection file relative to repo root (script lives in scripts/)
  const here = dirname(fileURLToPath(import.meta.url));
  const repoRoot = resolve(here, '..');
  const filePath = args.file ? resolve(args.file) : join(repoRoot, REJECTION_FILE_REL);

  if (!existsSync(filePath)) {
    console.error(`Error: rejection file not found at ${filePath}`);
    process.exit(2);
  }

  let data;
  try {
    data = loadRejectionFile(filePath);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(2);
  }

  let entry;
  try {
    entry = appendRejection(data, {
      cve: args.cve,
      topic: args.topic,
      reason: args.reason,
      pr: args.pr,
    });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(2);
  }

  writeRejectionFile(filePath, data);
  console.log(`Rejected ${entry.cve} (${entry.reason}) at ${entry.rejected_at}`);
  console.log(`File: ${filePath}`);
  console.log(`Total rejected: ${data.rejected.length}`);
}
