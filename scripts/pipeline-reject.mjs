#!/usr/bin/env node
/**
 * pipeline-reject.mjs — Append a rejected discovery candidate to
 * .github/pipeline/rejected-candidates.json.
 *
 * Supports two rejection keys:
 *   - CVE-backed discovery candidates (`--cve`)
 *   - Non-CVE discovery candidates (`--key`)
 *
 * Usage:
 *   node scripts/pipeline-reject.mjs --cve CVE-2026-34197 --reason "operator veto"
 *   node scripts/pipeline-reject.mjs --key "incident:ncsc_news:https://..." --type incident --reason "not article-worthy"
 */

import { fileURLToPath } from 'url';
import { resolve, join, dirname } from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';

const REJECTION_FILE_REL = '.github/pipeline/rejected-candidates.json';
const CVE_RE = /^CVE-\d{4}-\d{4,}$/;

export function normalizeCve(raw) {
  if (typeof raw !== 'string') return null;
  const up = raw.trim().toUpperCase();
  return CVE_RE.test(up) ? up : null;
}

export function normalizeCandidateKey(raw) {
  if (typeof raw !== 'string') return null;
  const value = raw.trim();
  return value ? value : null;
}

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
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

export function appendRejection(data, { cve, key, type, sourceFeed, topic, reason, pr, now }) {
  const normalizedCve = normalizeCve(cve);
  const normalizedKey = normalizeCandidateKey(key);

  if (!normalizedCve && !normalizedKey) {
    throw new Error('One of --cve or --key is required');
  }
  if (normalizedCve && normalizedKey) {
    throw new Error('Provide either --cve or --key, not both');
  }
  if (!reason || typeof reason !== 'string' || !reason.trim()) {
    throw new Error('--reason is required and must be a non-empty string');
  }

  const dupe = data.rejected.find(entry => (
    normalizedCve
      ? normalizeCve(entry.cve) === normalizedCve
      : normalizeCandidateKey(entry.candidate_key) === normalizedKey
  ));
  if (dupe) {
    const id = normalizedCve || normalizedKey;
    throw new Error(
      `${id} already in rejection list (rejected_at=${dupe.rejected_at}). ` +
      'To re-surface, remove the entry via PR edit.'
    );
  }

  const entry = {
    rejected_at: (now || new Date()).toISOString(),
    reason: reason.trim(),
  };

  if (normalizedCve) entry.cve = normalizedCve;
  if (normalizedKey) entry.candidate_key = normalizedKey;
  if (type && typeof type === 'string' && type.trim()) entry.candidate_type = type.trim();
  if (sourceFeed && typeof sourceFeed === 'string' && sourceFeed.trim()) entry.source_feed = sourceFeed.trim();
  if (topic && typeof topic === 'string' && topic.trim()) entry.topic = topic.trim();
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

function selfTest() {
  if (normalizeCve('cve-2026-1') !== null) throw new Error('selfTest: short CVE should fail');
  if (normalizeCve('CVE-2026-34197') !== 'CVE-2026-34197') throw new Error('selfTest: normalize identity');
  if (normalizeCandidateKey('  incident:test  ') !== 'incident:test') throw new Error('selfTest: normalize key');
  if (normalizeCandidateKey('   ') !== null) throw new Error('selfTest: blank key rejected');

  const fakeNow = new Date('2026-04-18T04:00:00Z');
  const data = { version: '1.0', description: 'x', lastUpdated: 'old', rejected: [] };
  const cveEntry = appendRejection(data, { cve: 'CVE-2026-00001', reason: 'test', now: fakeNow });
  if (cveEntry.cve !== 'CVE-2026-00001') throw new Error('selfTest: append cve');
  const keyEntry = appendRejection(data, { key: 'incident:demo:https://example.com', type: 'incident', reason: 'test', now: fakeNow });
  if (keyEntry.candidate_key !== 'incident:demo:https://example.com') throw new Error('selfTest: append key');
  let threwCve = false;
  try { appendRejection(data, { cve: 'cve-2026-00001', reason: 'dup', now: fakeNow }); } catch { threwCve = true; }
  if (!threwCve) throw new Error('selfTest: duplicate CVE must throw');
  let threw = false;
  try { appendRejection(data, { key: 'incident:demo:https://example.com', reason: 'dup', now: fakeNow }); } catch { threw = true; }
  if (!threw) throw new Error('selfTest: duplicate key must throw');
}
selfTest();

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--cve') out.cve = argv[++i];
    else if (arg === '--key') out.key = argv[++i];
    else if (arg === '--type') out.type = argv[++i];
    else if (arg === '--source-feed') out.sourceFeed = argv[++i];
    else if (arg === '--topic') out.topic = argv[++i];
    else if (arg === '--reason') out.reason = argv[++i];
    else if (arg === '--pr') out.pr = argv[++i];
    else if (arg === '--file') out.file = argv[++i];
    else if (arg === '--help' || arg === '-h') out.help = true;
  }
  return out;
}

function printHelp() {
  process.stdout.write(
    'Usage: node scripts/pipeline-reject.mjs (--cve <CVE-ID> | --key <candidate-key>) --reason <text> ' +
    '[--type <incident|campaign|threat-actor>] [--source-feed <feed>] [--topic <text>] [--pr <number>] [--file <path>]\n'
  );
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) { printHelp(); process.exit(0); }
  if ((!args.cve && !args.key) || !args.reason) {
    console.error('Error: provide one of --cve or --key, plus --reason');
    printHelp();
    process.exit(2);
  }

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
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(2);
  }

  let entry;
  try {
    entry = appendRejection(data, {
      cve: args.cve,
      key: args.key,
      type: args.type,
      sourceFeed: args.sourceFeed,
      topic: args.topic,
      reason: args.reason,
      pr: args.pr,
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(2);
  }

  writeRejectionFile(filePath, data);
  console.log(`Rejected ${entry.cve || entry.candidate_key} (${entry.reason}) at ${entry.rejected_at}`);
  console.log(`File: ${filePath}`);
  console.log(`Total rejected: ${data.rejected.length}`);
}
