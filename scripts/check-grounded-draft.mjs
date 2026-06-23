#!/usr/bin/env node
/**
 * Fidelity gate for B2 grounded drafts.
 *
 * Fails if a draft includes placeholder source recovery markers, URLs outside
 * the packet, claim IDs outside the packet, or substantive body lines without
 * packet claim markers.
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { readJson } from './grounded-drafting-lib.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const URL_RE = /https?:\/\/[^\s\])"'<>]+/g;
const CLAIM_MARKER_RE = /<!--\s*claims?:\s*([a-zA-Z0-9\-\s]+)\s*-->/g;
const PLACEHOLDER_RE = /(FIXME|VERIFY URL|SOURCE RECOVERY|placeholder URL|example\.com\/placeholder|TBD source)/i;
const FRONTMATTER_RE = /^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/;

function usage() {
  console.log([
    'Usage:',
    '  node scripts/check-grounded-draft.mjs --packet <packet.json> --draft <draft.md> [--json-out <report.json>]',
  ].join('\n'));
}

function parseArgs(argv = process.argv) {
  const args = { packet: null, draft: null, jsonOut: null };
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    const next = argv[i + 1];
    switch (token) {
      case '--packet':
        if (!next) throw new Error('Missing value for --packet');
        args.packet = next;
        i += 1;
        break;
      case '--draft':
        if (!next) throw new Error('Missing value for --draft');
        args.draft = next;
        i += 1;
        break;
      case '--json-out':
        if (!next) throw new Error('Missing value for --json-out');
        args.jsonOut = next;
        i += 1;
        break;
      case '--help':
      case '-h':
        usage();
        process.exit(0);
        break;
      default:
        throw new Error(`Unknown argument: ${token}`);
    }
  }
  if (!args.packet) throw new Error('--packet is required');
  if (!args.draft) throw new Error('--draft is required');
  return args;
}

function allSources(packet) {
  return [
    ...(Array.isArray(packet.primary_sources) ? packet.primary_sources : []),
    ...(Array.isArray(packet.supporting_sources) ? packet.supporting_sources : []),
  ];
}

function bodyWithoutFrontmatter(text) {
  const match = String(text).match(FRONTMATTER_RE);
  return match ? text.slice(match[0].length) : text;
}

function claimIdsFromMarker(line) {
  const ids = [];
  for (const match of line.matchAll(CLAIM_MARKER_RE)) {
    ids.push(...match[1].split(/\s+/).map((item) => item.trim()).filter(Boolean));
  }
  return ids;
}

function isSubstantiveLine(line, inSources) {
  const trimmed = line.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith('---')) return false;
  if (trimmed.startsWith('##')) return false;
  if (trimmed.startsWith('<!--') && trimmed.endsWith('-->')) return false;
  if (inSources && /^\d+\.\s+\[/.test(trimmed)) return false;
  if (/^\|?\s*:?-{3,}:?\s*\|/.test(trimmed)) return false;
  return /[A-Za-z0-9]/.test(trimmed);
}

export function checkGroundedDraft(packet, draftText) {
  const errors = [];
  const warnings = [];
  const sourceUrls = new Set(allSources(packet).map((source) => source.url));
  const packetClaimIds = new Set((packet.claims || []).map((claim) => claim.claim_id));
  const draftUrls = [...draftText.matchAll(URL_RE)].map((match) => match[0].replace(/[.,;:]$/, ''));
  for (const url of draftUrls) {
    if (!sourceUrls.has(url)) errors.push({ path: '$.draft.urls', message: `draft URL is not in packet sources: ${url}` });
  }
  if (PLACEHOLDER_RE.test(draftText)) {
    errors.push({ path: '$.draft', message: 'placeholder/FIXME source text is forbidden in grounded drafts' });
  }

  const referencedClaimIds = new Set();
  const body = bodyWithoutFrontmatter(draftText);
  let inSources = false;
  for (const [index, line] of body.split(/\r?\n/).entries()) {
    if (/^##\s+Sources\s*&\s*References\b/i.test(line.trim())) inSources = true;
    const lineClaimIds = claimIdsFromMarker(line);
    for (const claimId of lineClaimIds) {
      referencedClaimIds.add(claimId);
      if (!packetClaimIds.has(claimId)) errors.push({ path: `$.draft.lines[${index + 1}]`, message: `unknown packet claim marker ${claimId}` });
    }
    if (isSubstantiveLine(line, inSources) && lineClaimIds.length === 0) {
      errors.push({ path: `$.draft.lines[${index + 1}]`, message: 'substantive draft line is missing packet claim marker' });
    }
  }

  for (const claim of packet.claims || []) {
    if (!referencedClaimIds.has(claim.claim_id)) {
      warnings.push({ path: `$.claims.${claim.claim_id}`, message: 'packet claim is not referenced in draft body' });
    }
  }

  return {
    pass: errors.length === 0,
    status: errors.length === 0 ? 'pass' : 'fail',
    errors,
    warnings,
    summary: {
      packet_claims: packetClaimIds.size,
      referenced_claims: referencedClaimIds.size,
      packet_urls: sourceUrls.size,
      draft_urls: draftUrls.length,
    },
  };
}

function format(result) {
  const lines = [
    '## Grounded Draft Fidelity',
    '',
    result.pass ? ':white_check_mark: Grounded draft fidelity passed.' : `:x: Grounded draft fidelity failed with ${result.errors.length} error(s).`,
    '',
    `Packet claims: ${result.summary.packet_claims}`,
    `Referenced claims: ${result.summary.referenced_claims}`,
    `Packet URLs: ${result.summary.packet_urls}`,
    `Draft URLs: ${result.summary.draft_urls}`,
    '',
  ];
  if (result.errors.length) {
    lines.push('### Errors');
    for (const error of result.errors) lines.push(`- ${error.path}: ${error.message}`);
    lines.push('');
  }
  if (result.warnings.length) {
    lines.push('### Warnings');
    for (const warning of result.warnings) lines.push(`- ${warning.path}: ${warning.message}`);
    lines.push('');
  }
  return `${lines.join('\n').trim()}\n`;
}

async function run() {
  const args = parseArgs();
  const packet = readJson(repoRoot, args.packet);
  const draftText = readFileSync(path.resolve(repoRoot, args.draft), 'utf8');
  const result = checkGroundedDraft(packet, draftText);
  if (args.jsonOut) {
    const { writeText } = await import('./grounded-drafting-lib.mjs');
    writeText(repoRoot, args.jsonOut, `${JSON.stringify(result, null, 2)}\n`);
  }
  process.stdout.write(format(result));
  if (!result.pass) process.exit(1);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  run().catch((error) => {
    console.error(`[check-grounded-draft] ERROR: ${error.message}`);
    process.exit(1);
  });
}
