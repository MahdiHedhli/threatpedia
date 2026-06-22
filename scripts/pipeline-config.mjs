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
 * Parser: js-yaml (YAML 1.2, load-only). Earlier versions of this
 * module shipped a hand-rolled parser to avoid the dependency; see git
 * history (TASK-2026-0065 Slice 4a) for that path. Slice 4e (this file)
 * replaced it with js-yaml after parity-checking the live config.yml
 * output byte-for-byte against the inline parser. The public API
 * (loadPipelineConfig, DEFAULTS, parseYaml wrapper), safe-default
 * fallbacks, and CLI output shape are all preserved unchanged.
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_CONFIG_PATH = resolve(__dirname, '..', '.github', 'pipeline', 'config.yml');

/**
 * Safe defaults — used when the config file is missing or malformed so the
 * dispatcher never fails-closed on a config error. Values must match the
 * intent documented in config.yml for current behavior.
 */
export const DEFAULTS = Object.freeze({
  queues: {
    dispatcher: { tasks_per_run: 12 },
    editorial: { max_pending: 100, backpressure_resume: 80 },
    by_type: {
      'zero-day': { max_pending: 40 },
      incident: { max_pending: 60 },
      'threat-actor': { max_pending: 16 },
      campaign: { max_pending: 16 },
    },
    discovery: { max_candidates: 400 },
    draft_ready: { max_pending: 60 },
    supply_chain_candidates: { max_pending: 40 },
  },
  scheduling: {
    discovery_cron: '0 */3 * * *',
    dispatcher_cron: '30 * * * *',
    stale_lock_minutes: 30,
  },
  circuit_breaker: {
    failure_threshold: 3,
    cooldown_minutes: 60,
    failure_window_minutes: 120,
    alert_channel: 'issues',
  },
  ready_issue: {
    warn_minutes: 60,
    stall_minutes: 180,
    stall_minutes_by_priority: {
      P0: 60,
    },
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
    vulncheck_kev: {
      enabled: true,
      backup_url: 'https://api.vulncheck.com/v3/backup/vulncheck-kev',
      lookback_days: 30,
      max_candidates: 30,
      backlog_fill: true,
      sibling_limit_per_vendor_product_day: 4,
      local_throttle_ms: 250,
      cache_ttl_minutes: 60,
      source_packet_dir: '.github/pipeline/source-packets/vulncheck-kev',
      candidate_index_path: '.github/pipeline/source-packets/vulncheck-kev/latest.json',
    },
    nvd: { enabled: true, lookback_days: 7, min_cvss: 7.0 },
    cisa_alerts: {
      enabled: true,
      kind: 'incident',
      format: 'rss',
      label: 'CISA Alerts & Advisories',
      limit_per_run: 6,
    },
    ncsc_news: {
      enabled: true,
      kind: 'incident',
      format: 'rss',
      label: 'NCSC News',
      limit_per_run: 4,
    },
    microsoft_security_blog: {
      enabled: true,
      kind: 'incident',
      format: 'rss',
      label: 'Microsoft Security Blog',
      limit_per_run: 4,
    },
    supply_chain_live: {
      enabled: true,
      queue_path: '.github/pipeline/supply-chain-candidates/latest.json',
      since_hours: 6,
      max_per_source: 25,
      max_candidates: 40,
      min_rank: 25,
      npm: {
        enabled: true,
        changes_url: 'https://replicate.npmjs.com/registry/_changes',
        metadata_base_url: 'https://registry.npmjs.org',
      },
      pypi: {
        enabled: true,
        rss_url: 'https://pypi.org/rss/updates.xml',
        json_base_url: 'https://pypi.org/pypi',
      },
      go: { enabled: true, index_url: 'https://index.golang.org/index' },
      osv: {
        enabled: true,
        modified_csv_url: 'https://osv-vulnerabilities.storage.googleapis.com/modified_id.csv',
        record_base_url: 'https://osv-vulnerabilities.storage.googleapis.com',
        ecosystems: ['npm', 'PyPI', 'Go'],
      },
      ghsa: {
        enabled: true,
        url: 'https://api.github.com/advisories',
        ecosystems: ['npm', 'pip', 'go'],
        types: ['malware', 'reviewed'],
      },
    },
  },
  lead_intake: {
    current_window_days: 180,
    kev: {
      recently_added_days: 30,
      overdue_grace_days: 30,
      aged_days: 180,
      status_is_computed: true,
    },
    active_status: { default_expiry_days: 30 },
    historical_throughput: { enabled: true, target_per_day: 0, alert_if_zero_for_days: 3 },
    manual_override: { max_days: 30, requires_reason: true },
  },
});

// ── YAML parsing ───────────────────────────────────────────────────────────
//
// js-yaml 4.x defaults to YAML 1.2 core schema via `load()` — handles nested
// maps, quoted + bare scalars, ints, floats, bools, and all the flow / block
// forms we don't currently use in config.yml but might in future. An empty
// file parses as `undefined`; we normalize to `{}` so callers always see a
// plain object on the happy path.
//
// `parseYaml` is retained as an exported thin wrapper for anyone who imports
// it (no in-tree callers today; belt-and-braces for the previous public API).
export function parseYaml(text) {
  const loaded = yaml.load(text);
  return loaded == null ? {} : loaded;
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
    // js-yaml throws YAMLException on malformed input. The message is more
    // detailed than the inline parser's would have been (it names line / col).
    console.warn(`[pipeline-config] WARN: parse error: ${e.message}; using built-in defaults`);
    return { ...DEFAULTS, _source: 'defaults', _reason: 'parse-error' };
  }
  // Shape-error guard — defensive new branch post-js-yaml swap.
  // The inline parser always returned a plain object. js-yaml can legally
  // return scalars / arrays / null for root values like `"just a string"` or
  // `- item`. None of those are valid for a config document; fall back to
  // DEFAULTS rather than letting deepMerge hit a non-object.
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    console.warn(`[pipeline-config] WARN: config root is not a map (got ${Array.isArray(parsed) ? 'array' : typeof parsed}); using built-in defaults`);
    return { ...DEFAULTS, _source: 'defaults', _reason: 'shape-error' };
  }
  const merged = deepMerge(DEFAULTS, parsed);
  merged._source = 'file';
  merged._path = path;
  return merged;
}

// ── CLI ────────────────────────────────────────────────────────────────────
// Portable "ran directly" check: compare the resolved absolute path of this
// module against argv[1]. Handles Windows path separators and relative
// invocations correctly, unlike a raw string compare against `file://...`.
// Guards against argv[1] being undefined (e.g. when imported via `node -e`).
if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
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
