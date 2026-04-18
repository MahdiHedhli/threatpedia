#!/usr/bin/env node
/**
 * pipeline-history-backfill.mjs — One-shot backfill of task creation-entry
 * history to the canonical shape documented in Slice 4b.
 *
 * Canonical creation entry (history[0]) per docs/PIPELINE.md:
 *   { timestamp, action: 'created', from: 'none', to: 'pending', agent, note }
 *
 * Two legacy flavors the corpus carries today:
 *   (A) action-only        — has `action: 'created'` but no `from`/`to`
 *   (B) from/to-only       — has `from: 'none', to: 'pending'` but no `action`
 *
 * This script adds the missing field(s) to creation entries only. It does
 * NOT touch transition entries (index ≥ 1), does NOT rewrite any other
 * field, and does NOT emit any new keys beyond the canonical five.
 *
 * Tolerant readers remain in place; this migration is purely a polish
 * pass so the runner's "Created:" display resolves for every task.
 *
 * Usage:
 *   node scripts/pipeline-history-backfill.mjs --dry-run    # preview per file
 *   node scripts/pipeline-history-backfill.mjs              # write changes
 *   node scripts/pipeline-history-backfill.mjs --tasks-dir <path>
 *
 * TASK-2026-0068 / Slice 4d.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_TASKS_DIR = resolve(__dirname, '..', '.github', 'pipeline', 'tasks');

// Canonical creation-entry key order on write. Matches what the current
// canonical writers (pipeline-discover.mjs, pipeline-ingest-issue.yml) emit.
const CANONICAL_KEY_ORDER = ['timestamp', 'action', 'from', 'to', 'agent', 'note'];

const CANONICAL_CREATION = Object.freeze({
  action: 'created',
  from: 'none',
  to: 'pending',
});

/**
 * Classify a creation entry (history[0]) and decide what to add.
 *
 * Returns one of:
 *   { kind: 'canonical' }          — already has action + from + to
 *   { kind: 'action-only' }        — flavor A; needs from + to added
 *   { kind: 'from-to-only' }       — flavor B; needs action added
 *   { kind: 'mismatch', reason }   — unexpected shape; refuse to touch
 *   { kind: 'empty' }              — no history at all
 */
export function classifyCreationEntry(history) {
  if (!Array.isArray(history) || history.length === 0) {
    return { kind: 'empty' };
  }
  const e = history[0];
  if (!e || typeof e !== 'object') {
    return { kind: 'mismatch', reason: 'history[0] is not an object' };
  }
  const hasAction = 'action' in e;
  const hasFrom = 'from' in e;
  const hasTo = 'to' in e;

  if (hasAction && hasFrom && hasTo) {
    // Sanity-check values match canonical before calling it canonical.
    if (e.action === 'created' && e.from === 'none' && e.to === 'pending') {
      return { kind: 'canonical' };
    }
    return { kind: 'mismatch', reason: `has all three keys but values are ${JSON.stringify({action: e.action, from: e.from, to: e.to})}` };
  }
  if (hasAction && !hasFrom && !hasTo) {
    if (e.action !== 'created') {
      return { kind: 'mismatch', reason: `action-only entry has action=${JSON.stringify(e.action)}, expected 'created'` };
    }
    return { kind: 'action-only' };
  }
  if (!hasAction && hasFrom && hasTo) {
    if (e.from !== 'none' || e.to !== 'pending') {
      return { kind: 'mismatch', reason: `from/to-only entry has ${JSON.stringify({from: e.from, to: e.to})}, expected {none → pending}` };
    }
    return { kind: 'from-to-only' };
  }
  return { kind: 'mismatch', reason: `partial keys present: action=${hasAction}, from=${hasFrom}, to=${hasTo}` };
}

/**
 * Produce a migrated creation entry preserving all existing fields and
 * enforcing canonical key order. Pure function — does not mutate input.
 */
export function migrateCreationEntry(entry, kind) {
  const merged = { ...entry };
  if (kind === 'action-only') {
    merged.from = CANONICAL_CREATION.from;
    merged.to = CANONICAL_CREATION.to;
  } else if (kind === 'from-to-only') {
    merged.action = CANONICAL_CREATION.action;
  } else if (kind === 'canonical') {
    return entry; // no-op
  } else {
    throw new Error(`Cannot migrate entry of kind ${kind}`);
  }
  // Re-order canonical keys first, then any extras preserved in insertion order.
  const out = {};
  for (const k of CANONICAL_KEY_ORDER) {
    if (k in merged) out[k] = merged[k];
  }
  for (const k of Object.keys(merged)) {
    if (!(k in out)) out[k] = merged[k];
  }
  return out;
}

/**
 * Escape non-ASCII chars as `\uXXXX` sequences. Matches Python's
 * default `json.dumps(ensure_ascii=True)` output, which is how most of
 * the legacy corpus was originally written. Without this, a mixed
 * corpus (some files with literal em-dashes, some with `\u2014`) would
 * get inconsistently rewritten by the migration, inflating the diff
 * with unrelated encoding flips.
 *
 * Files that were originally written by the JS canonical writers have
 * no non-ASCII chars in their fields (agents, topics, notes are all
 * ASCII), so this pass is a no-op for them. Files that had `\u2014`
 * etc. keep them. Net result: the only diff per file is the added
 * canonical field(s) on history[0].
 */
function escapeNonAscii(s) {
  return s.replace(/[\u0080-\uffff]/g, (ch) =>
    '\\u' + ch.charCodeAt(0).toString(16).padStart(4, '0')
  );
}

/**
 * Serialize the task JSON back to disk preserving the file's original
 * encoding style. 2-space indent, trailing newline.
 *
 * The corpus has mixed encoding: early Python-written files use
 * `\uXXXX` escapes for non-ASCII (Python ensure_ascii=True default),
 * while newer JS-written files keep literal chars. Forcing either
 * direction universally would flip encoding on half the corpus —
 * not what this slice is about. Instead we detect the original file's
 * style (by checking for any `\uXXXX` escape sequence in the raw
 * input) and match it on write.
 */
function serialize(task, originalRaw) {
  const hasUnicodeEscapes = /\\u[0-9a-fA-F]{4}/.test(originalRaw);
  const base = JSON.stringify(task, null, 2);
  const out = hasUnicodeEscapes ? escapeNonAscii(base) : base;
  return out + '\n';
}

function processFile(path) {
  const raw = readFileSync(path, 'utf8');
  const task = JSON.parse(raw);
  const classification = classifyCreationEntry(task.history);

  if (classification.kind === 'mismatch') {
    throw new Error(`${path}: ${classification.reason}`);
  }
  if (classification.kind === 'empty') {
    return { path, kind: 'empty', changed: false };
  }
  if (classification.kind === 'canonical') {
    return { path, kind: 'canonical', changed: false };
  }

  const migrated = migrateCreationEntry(task.history[0], classification.kind);
  const newTask = { ...task, history: [migrated, ...task.history.slice(1)] };
  const newRaw = serialize(newTask, raw);
  const changed = newRaw !== raw;
  return { path, kind: classification.kind, changed, newRaw };
}

// ── Self-test (runs at import) ─────────────────────────────────────────────
function selfTest() {
  // classifyCreationEntry
  const c1 = classifyCreationEntry([{ action: 'created', timestamp: 't', agent: 'a' }]);
  if (c1.kind !== 'action-only') throw new Error(`selfTest classify A: ${JSON.stringify(c1)}`);

  const c2 = classifyCreationEntry([{ from: 'none', to: 'pending', timestamp: 't' }]);
  if (c2.kind !== 'from-to-only') throw new Error(`selfTest classify B: ${JSON.stringify(c2)}`);

  const c3 = classifyCreationEntry([{ action: 'created', from: 'none', to: 'pending' }]);
  if (c3.kind !== 'canonical') throw new Error(`selfTest classify canonical: ${JSON.stringify(c3)}`);

  const c4 = classifyCreationEntry([{ action: 'other' }]);
  if (c4.kind !== 'mismatch') throw new Error(`selfTest classify mismatch: ${JSON.stringify(c4)}`);

  const c5 = classifyCreationEntry([]);
  if (c5.kind !== 'empty') throw new Error(`selfTest classify empty: ${JSON.stringify(c5)}`);

  // migrateCreationEntry — A flavor
  const mA = migrateCreationEntry(
    { timestamp: 't', action: 'created', agent: 'a', note: 'n' },
    'action-only',
  );
  if (mA.action !== 'created' || mA.from !== 'none' || mA.to !== 'pending') {
    throw new Error(`selfTest migrate A values: ${JSON.stringify(mA)}`);
  }
  if (Object.keys(mA).join(',') !== 'timestamp,action,from,to,agent,note') {
    throw new Error(`selfTest migrate A key order: ${Object.keys(mA).join(',')}`);
  }

  // migrateCreationEntry — B flavor
  const mB = migrateCreationEntry(
    { timestamp: 't', from: 'none', to: 'pending', agent: 'a', note: 'n' },
    'from-to-only',
  );
  if (mB.action !== 'created' || mB.from !== 'none' || mB.to !== 'pending') {
    throw new Error(`selfTest migrate B values: ${JSON.stringify(mB)}`);
  }
  if (Object.keys(mB).join(',') !== 'timestamp,action,from,to,agent,note') {
    throw new Error(`selfTest migrate B key order: ${Object.keys(mB).join(',')}`);
  }

  // Unicode escape — non-ASCII is written as `\uXXXX` to match the
  // dominant corpus style (Python ensure_ascii=True). Round-trip via
  // JSON.parse still yields the original chars.
  const sample = {
    task_id: 'TASK-T',
    history: [{ timestamp: 't', action: 'created', agent: 'a', note: 'em—dash §' }],
  };
  const migrated = migrateCreationEntry(sample.history[0], 'action-only');
  // Original style = escaped → output escaped, round-trip recovers chars.
  const outEscaped = serialize({ ...sample, history: [migrated] }, 'prev \\u2014 prev');
  if (!outEscaped.includes('\\u2014') || !outEscaped.includes('\\u00a7')) {
    throw new Error(`selfTest: expected \\u-escaped output, got ${outEscaped}`);
  }
  if (JSON.parse(outEscaped).history[0].note !== 'em—dash §') {
    throw new Error('selfTest: escaped round-trip failed');
  }
  // Original style = literal → output literal.
  const outLiteral = serialize({ ...sample, history: [migrated] }, 'prev — prev');
  if (outLiteral.includes('\\u2014')) {
    throw new Error(`selfTest: expected literal output, got escaped: ${outLiteral}`);
  }
  if (!outLiteral.includes('em—dash §')) {
    throw new Error('selfTest: literal round-trip failed');
  }
}
selfTest();

// ── CLI ────────────────────────────────────────────────────────────────────
function parseArgs(argv) {
  const out = { dryRun: false, tasksDir: DEFAULT_TASKS_DIR };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') out.dryRun = true;
    else if (a === '--tasks-dir') out.tasksDir = resolve(argv[++i]);
    else if (a === '--help' || a === '-h') out.help = true;
  }
  return out;
}

function printHelp() {
  process.stdout.write(
    'Usage: node scripts/pipeline-history-backfill.mjs [--dry-run] [--tasks-dir <path>]\n'
  );
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) { printHelp(); process.exit(0); }

  if (!existsSync(args.tasksDir)) {
    console.error(`Error: tasks dir not found: ${args.tasksDir}`);
    process.exit(2);
  }

  const files = readdirSync(args.tasksDir)
    .filter((f) => /^TASK-\d{4}-\d{4}\.json$/.test(f))
    .map((f) => join(args.tasksDir, f))
    .sort();

  const summary = { 'action-only': 0, 'from-to-only': 0, canonical: 0, empty: 0 };
  const errors = [];

  for (const path of files) {
    let result;
    try {
      result = processFile(path);
    } catch (err) {
      errors.push(err.message);
      continue;
    }
    summary[result.kind] = (summary[result.kind] || 0) + 1;
    if (result.changed) {
      if (args.dryRun) {
        console.log(`[dry-run] would migrate ${result.kind}: ${path}`);
      } else {
        writeFileSync(path, result.newRaw, 'utf8');
        console.log(`migrated ${result.kind}: ${path}`);
      }
    }
  }

  console.log(`\nSummary (${files.length} files scanned):`);
  console.log(`  action-only    → migrated : ${summary['action-only'] || 0}`);
  console.log(`  from-to-only   → migrated : ${summary['from-to-only'] || 0}`);
  console.log(`  canonical      → untouched: ${summary['canonical'] || 0}`);
  console.log(`  empty/missing  → skipped  : ${summary['empty'] || 0}`);
  if (errors.length > 0) {
    console.error(`\n${errors.length} errors:`);
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
  if (args.dryRun) console.log('\n(dry-run: no files written)');
}
