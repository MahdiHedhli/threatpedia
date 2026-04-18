#!/usr/bin/env node
/**
 * pipeline-schema.mjs — Shared JS view of DATA-STANDARDS schema enums.
 *
 * This file is a CODE-LEVEL MIRROR of enums defined authoritatively in
 * `site/src/content.config.ts`. It exists because the runner (Node script)
 * and the validator workflow (github-script in YAML) both need the enum
 * values at runtime, and neither can easily import Zod types from the
 * content-collection definitions at build time.
 *
 * If the authoritative schema changes in site/src/content.config.ts, this
 * file must be updated in the same PR. There is no automated sync.
 *
 * Usage:
 *   import { SCHEMA_REVIEW_STATUSES } from './pipeline-schema.mjs';
 *
 * CLI:
 *   node scripts/pipeline-schema.mjs             # print all exports as JSON
 *   node scripts/pipeline-schema.mjs --key reviewStatuses   # print one array
 */

import { fileURLToPath } from 'url';
import { resolve } from 'path';

/**
 * Article reviewStatus enum.
 * Authoritative: site/src/content.config.ts — const reviewStatus = z.enum([...])
 */
export const SCHEMA_REVIEW_STATUSES = Object.freeze([
  'draft_ai',
  'draft_human',
  'under_review',
  'certified',
  'disputed',
  'deprecated',
]);

// Structured view for CLI / env-var consumers.
export const SCHEMA = Object.freeze({
  reviewStatuses: SCHEMA_REVIEW_STATUSES,
});

// ── Self-test (runs during both CLI and module-import to catch shape drift) ─
function selfTest() {
  if (!Array.isArray(SCHEMA_REVIEW_STATUSES) || SCHEMA_REVIEW_STATUSES.length !== 6) {
    throw new Error(`SCHEMA_REVIEW_STATUSES expected array of length 6, got ${JSON.stringify(SCHEMA_REVIEW_STATUSES)}`);
  }
  for (const v of SCHEMA_REVIEW_STATUSES) {
    if (typeof v !== 'string' || !/^[a-z_]+$/.test(v)) {
      throw new Error(`SCHEMA_REVIEW_STATUSES element invalid: ${JSON.stringify(v)}`);
    }
  }
}
selfTest();

// ── CLI ────────────────────────────────────────────────────────────────────
// Portable entry-point check (same pattern as pipeline-config.mjs). Guards
// against process.argv[1] being undefined when imported via `node -e`.
if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const args = process.argv.slice(2);
  let key = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--key' && args[i + 1]) key = args[++i];
  }
  if (key) {
    if (!(key in SCHEMA)) {
      console.error(`Unknown key: ${key}`);
      process.exit(2);
    }
    console.log(JSON.stringify(SCHEMA[key]));
  } else {
    console.log(JSON.stringify(SCHEMA, null, 2));
  }
}
