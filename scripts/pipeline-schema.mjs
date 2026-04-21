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

/**
 * Canonical MITRE ATT&CK tactics.
 * Authoritative for pipeline validation; values align with ATT&CK tactic casing.
 */
export const SCHEMA_MITRE_TACTICS = Object.freeze([
  'Reconnaissance',
  'Resource Development',
  'Initial Access',
  'Execution',
  'Persistence',
  'Privilege Escalation',
  'Defense Evasion',
  'Credential Access',
  'Discovery',
  'Lateral Movement',
  'Collection',
  'Command and Control',
  'Exfiltration',
  'Impact',
  'Impair Process Control',
]);

/**
 * Canonical generatedBy identities currently recognized in the corpus.
 * New generators must be added here and in site/src/content.config.ts together.
 */
export const SCHEMA_GENERATED_BY_VALUES = Object.freeze([
  'ai_ingestion',
  'dangermouse-bot',
  'incident-crosslink-gapfill',
  'kernel-k',
  'new-threat-intel',
  'new-threat-intel-automation',
  'penfold-bot',
  'zero-day-tracker',
]);

/**
 * Exact H2 headings required per content type.
 * These are the canonical section names used for generation and validation.
 */
export const SCHEMA_REQUIRED_H2_BY_TYPE = Object.freeze({
  incident: Object.freeze([
    'Summary',
    'Technical Analysis',
    'Attack Chain',
    'Impact Assessment',
    'Attribution',
    'Timeline',
    'Remediation & Mitigation',
    'Sources & References',
  ]),
  campaign: Object.freeze([
    'Executive Summary',
    'Technical Analysis',
    'Attack Chain',
    'MITRE ATT&CK Mapping',
    'Timeline',
    'Remediation & Mitigation',
    'Sources & References',
  ]),
  'threat-actor': Object.freeze([
    'Executive Summary',
    'Notable Campaigns',
    'Technical Capabilities',
    'Attribution',
    'MITRE ATT&CK Profile',
    'Sources & References',
  ]),
  'zero-day': Object.freeze([
    'Severity Assessment',
    'Summary',
    'Exploit Chain',
    'Detection Guidance',
    'Indicators of Compromise',
    'Disclosure Timeline',
    'Sources & References',
  ]),
});

/**
 * Alias -> canonical publisher mapping for high-churn source names.
 * Keys must be lowercase.
 */
export const SCHEMA_CANONICAL_PUBLISHER_ALIASES = Object.freeze({
  'msrc': 'Microsoft Security Response Center',
  'microsoft msrc': 'Microsoft Security Response Center',
  'nvd': 'National Vulnerability Database',
  'nist nvd': 'National Vulnerability Database',
  'national vulnerability database': 'National Vulnerability Database',
  'sec': 'U.S. Securities and Exchange Commission',
  'securities and exchange commission': 'U.S. Securities and Exchange Commission',
  'u.s. securities and exchange commission': 'U.S. Securities and Exchange Commission',
  'uk national cyber security centre': 'UK NCSC',
  'uk ncsc': 'UK NCSC',
  'us department of justice': 'U.S. Department of Justice',
  'u.s. department of justice': 'U.S. Department of Justice',
});

// Structured view for CLI / env-var consumers.
export const SCHEMA = Object.freeze({
  reviewStatuses: SCHEMA_REVIEW_STATUSES,
  mitreTactics: SCHEMA_MITRE_TACTICS,
  generatedByValues: SCHEMA_GENERATED_BY_VALUES,
  requiredH2ByType: SCHEMA_REQUIRED_H2_BY_TYPE,
  canonicalPublisherAliases: SCHEMA_CANONICAL_PUBLISHER_ALIASES,
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

  if (!Array.isArray(SCHEMA_MITRE_TACTICS) || SCHEMA_MITRE_TACTICS.length < 14) {
    throw new Error(`SCHEMA_MITRE_TACTICS expected >= 14 entries, got ${JSON.stringify(SCHEMA_MITRE_TACTICS)}`);
  }
  for (const v of SCHEMA_MITRE_TACTICS) {
    if (typeof v !== 'string' || v.trim() === '') {
      throw new Error(`SCHEMA_MITRE_TACTICS element invalid: ${JSON.stringify(v)}`);
    }
  }

  if (!Array.isArray(SCHEMA_GENERATED_BY_VALUES) || SCHEMA_GENERATED_BY_VALUES.length < 1) {
    throw new Error(`SCHEMA_GENERATED_BY_VALUES expected non-empty array, got ${JSON.stringify(SCHEMA_GENERATED_BY_VALUES)}`);
  }
  for (const v of SCHEMA_GENERATED_BY_VALUES) {
    if (typeof v !== 'string' || !/^[a-z0-9_-]+$/.test(v)) {
      throw new Error(`SCHEMA_GENERATED_BY_VALUES element invalid: ${JSON.stringify(v)}`);
    }
  }

  for (const [type, headings] of Object.entries(SCHEMA_REQUIRED_H2_BY_TYPE)) {
    if (!Array.isArray(headings) || headings.length < 1) {
      throw new Error(`SCHEMA_REQUIRED_H2_BY_TYPE.${type} expected non-empty array, got ${JSON.stringify(headings)}`);
    }
    for (const heading of headings) {
      if (typeof heading !== 'string' || heading.trim() === '') {
        throw new Error(`SCHEMA_REQUIRED_H2_BY_TYPE.${type} heading invalid: ${JSON.stringify(heading)}`);
      }
    }
  }

  for (const [alias, canonical] of Object.entries(SCHEMA_CANONICAL_PUBLISHER_ALIASES)) {
    if (alias !== alias.toLowerCase()) {
      throw new Error(`SCHEMA_CANONICAL_PUBLISHER_ALIASES key must be lowercase: ${alias}`);
    }
    if (typeof canonical !== 'string' || canonical.trim() === '') {
      throw new Error(`SCHEMA_CANONICAL_PUBLISHER_ALIASES.${alias} invalid: ${JSON.stringify(canonical)}`);
    }
  }
}
selfTest();

// ── CLI ────────────────────────────────────────────────────────────────────
// Portable entry-point check (same pattern as pipeline-config.mjs). Guards
// against process.argv[1] being undefined when imported via `node -e`.
if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const args = process.argv.slice(2);
  // Use lastIndexOf so `--key foo --key bar` takes the later value (standard
  // CLI precedence) and avoids the ++i side-effect pattern in a manual loop.
  const keyFlagIndex = args.lastIndexOf('--key');
  const key = (keyFlagIndex > -1 && keyFlagIndex + 1 < args.length)
    ? args[keyFlagIndex + 1]
    : null;
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
