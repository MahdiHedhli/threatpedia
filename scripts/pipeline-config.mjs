#!/usr/bin/env node
/**
 * pipeline-config.mjs — Parse .github/pipeline/config.yml
 *
 * Reads the pipeline config and exposes a typed-enough object for the
 * workflows (dispatcher, discovery, validator) to consume. The config
 * file is the authoritative tunable-knob surface for the pipeline;
 * this script is the single reader.
 *
 * Usage:
 *   node scripts/pipeline-config.mjs                    # print full config as JSON
 *   node scripts/pipeline-config.mjs --section queues   # print one section
 *
 * Programmatic:
 *   import { loadPipelineConfig, DEFAULTS } from './pipeline-config.mjs';
 *   const cfg = loadPipelineConfig();
 *
 * Why an inline parser: js-yaml would be cleaner but would add a
 * dependency and a prerequisite install step to every workflow that
 * uses it. Our config is small, predictable, and under our control.
 * The inline parser handles the keys we need; if config grows to need
 * anchors, multi-line strings, or lists-of-maps, a future slice will
 * swap to js-yaml behind this same API.
 *
 * Parser supports:
 *   - Nested maps via indentation (2-space assumed)
 *   - Scalars: string (quoted or bare), integer, float, boolean
 *   - Comments (# … to end of line), blank lines
 *   - Does NOT support: sequences / lists, anchors, multi-line strings, flow syntax
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_CONFIG_PATH = resolve(__dirname, '..', '.github', 'pipeline', 'config.yml');

/**
 * Safe defaults — used when the config file is missing or malformed so the
 * dispatcher never fails-closed on a config error. Values must match the
 * intent documented in config.yml for current behavior.
 */
export const DEFAULTS = Object.freeze({
  queues: {
    editorial: { max_pending: 50, backpressure_resume: 40 },
    discovery: { max_candidates: 200 },
    draft_ready: { max_pending: 25 },
  },
  scheduling: {
    discovery_cron: '0 */6 * * *',
    dispatcher_cron: '30 */2 * * *',
    stale_lock_minutes: 30,
  },
  circuit_breaker: {
    failure_threshold: 3,
    cooldown_minutes: 60,
    failure_window_minutes: 120,
    alert_channel: 'issues',
  },
  validation: {
    min_sources: 3,
    min_h2_sections: 5,
    min_mitre_mappings: 1,
    required_review_status: 'draft_ai',
    build_must_pass: true,
    schema_must_pass: true,
  },
  generation: { mode: 'agent-executed' },
  auto_merge: { enabled: false, require_label: 'pipeline/validated' },
  branches: { prefix: 'pipeline', protect_main: true },
  discovery_sources: {
    cisa_kev: { enabled: true },
    nvd: { enabled: true, lookback_days: 7, min_cvss: 7.0 },
  },
});

// ── Minimal YAML parser (targeted for our config shape) ────────────────────
//
// Handles: nested maps via 2-space indentation; scalars (int / float / bool /
// bare-string / single- or double-quoted string); comments; blank lines.
// Does NOT handle: sequences / lists, anchors, multi-line strings, flow syntax.
function parseScalar(raw) {
  const s = raw.trim().replace(/\s+#.*$/, '').trim(); // strip inline comments
  if (s === '') return null;
  if (s === 'true' || s === 'True' || s === 'TRUE') return true;
  if (s === 'false' || s === 'False' || s === 'FALSE') return false;
  if (s === 'null' || s === '~' || s === 'Null' || s === 'NULL') return null;
  // Quoted string
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1);
  }
  // Number
  if (/^-?\d+$/.test(s)) return parseInt(s, 10);
  if (/^-?\d*\.\d+$/.test(s)) return parseFloat(s);
  // Bare string
  return s;
}

function parseIndent(line) {
  const m = line.match(/^( *)/);
  return m ? m[1].length : 0;
}

export function parseYaml(text) {
  const out = {};
  const stack = [{ indent: -1, node: out }];

  const lines = text.split(/\r?\n/);
  for (const rawLine of lines) {
    // Strip full-line comments and blank lines
    if (/^\s*#/.test(rawLine) || /^\s*$/.test(rawLine)) continue;

    const indent = parseIndent(rawLine);
    const content = rawLine.slice(indent);

    // Pop stack until we're at a parent indent
    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }

    const kvMatch = content.match(/^([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$/);
    if (!kvMatch) continue; // ignore lines we don't understand (e.g. list items — not in our schema)

    const key = kvMatch[1];
    const rawValue = kvMatch[2];

    const parent = stack[stack.length - 1].node;

    if (rawValue === '' || /^\s*#/.test(rawValue)) {
      // Nested map — create and push
      const child = {};
      parent[key] = child;
      stack.push({ indent, node: child });
    } else {
      parent[key] = parseScalar(rawValue);
    }
  }

  return out;
}

// ── Deep merge (for safe-defaults fallback) ────────────────────────────────
function deepMerge(base, override) {
  if (!override || typeof override !== 'object') return base;
  const result = Array.isArray(base) ? [...base] : { ...base };
  for (const [k, v] of Object.entries(override)) {
    if (v !== null && typeof v === 'object' && !Array.isArray(v) && k in result &&
        typeof result[k] === 'object' && !Array.isArray(result[k])) {
      result[k] = deepMerge(result[k], v);
    } else {
      result[k] = v;
    }
  }
  return result;
}

// ── Public API ─────────────────────────────────────────────────────────────
/**
 * Load the pipeline config. On any error (missing file, parse failure),
 * returns the built-in DEFAULTS and logs a warning to stderr. The dispatcher
 * never fails closed on config-parsing issues — it just runs with defaults.
 */
export function loadPipelineConfig(path = DEFAULT_CONFIG_PATH) {
  if (!existsSync(path)) {
    console.warn(`[pipeline-config] WARN: config not found at ${path}; using built-in defaults`);
    return { ...DEFAULTS, _source: 'defaults', _reason: 'file-not-found' };
  }
  let text;
  try {
    text = readFileSync(path, 'utf8');
  } catch (e) {
    console.warn(`[pipeline-config] WARN: read error: ${e.message}; using built-in defaults`);
    return { ...DEFAULTS, _source: 'defaults', _reason: 'read-error' };
  }
  let parsed;
  try {
    parsed = parseYaml(text);
  } catch (e) {
    console.warn(`[pipeline-config] WARN: parse error: ${e.message}; using built-in defaults`);
    return { ...DEFAULTS, _source: 'defaults', _reason: 'parse-error' };
  }
  const merged = deepMerge(DEFAULTS, parsed);
  merged._source = 'file';
  merged._path = path;
  return merged;
}

// ── CLI ────────────────────────────────────────────────────────────────────
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  let section = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--section' && args[i + 1]) section = args[++i];
  }
  const cfg = loadPipelineConfig();
  if (section) {
    if (!(section in cfg)) {
      console.error(`Unknown section: ${section}`);
      process.exit(2);
    }
    console.log(JSON.stringify(cfg[section], null, 2));
  } else {
    console.log(JSON.stringify(cfg, null, 2));
  }
}
