#!/usr/bin/env node
/**
 * Deterministic grounded drafter.
 *
 * This is intentionally not a model call. It turns a passing B2 source packet
 * into a conservative draft where every substantive sentence is tied to packet
 * claim IDs and every URL comes from packet sources.
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  markdownEscape,
  numericId,
  readJson,
  safeTitle,
  slugPart,
  writeText,
  yamlString,
} from './grounded-drafting-lib.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function usage() {
  console.log([
    'Usage:',
    '  node scripts/draft-grounded-article.mjs --packet <packet.json> --out <draft.md> [--created-at <YYYY-MM-DD>]',
    '',
    'The draft is generated only from packet claims and packet source URLs.',
  ].join('\n'));
}

function parseArgs(argv = process.argv) {
  const args = { packet: null, out: null, createdAt: null };
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    const next = argv[i + 1];
    switch (token) {
      case '--packet':
        if (!next) throw new Error('Missing value for --packet');
        args.packet = next;
        i += 1;
        break;
      case '--out':
        if (!next) throw new Error('Missing value for --out');
        args.out = next;
        i += 1;
        break;
      case '--created-at':
        if (!next) throw new Error('Missing value for --created-at');
        args.createdAt = next;
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
  if (!args.out) throw new Error('--out is required');
  return args;
}

function allSources(packet) {
  return [
    ...(Array.isArray(packet.primary_sources) ? packet.primary_sources : []),
    ...(Array.isArray(packet.supporting_sources) ? packet.supporting_sources : []),
  ];
}

function sourceFrontmatter(source) {
  const publisherType = source.source_type === 'database' ? 'research' : source.source_type === 'other' ? 'community' : source.source_type;
  return [
    '  - url: ' + yamlString(source.url),
    '    publisher: ' + yamlString(source.publisher),
    '    publisherType: ' + publisherType,
    '    reliability: ' + (source.role === 'primary' ? 'R1' : 'R2'),
    '    publicationDate: ' + yamlString(source.published_at || new Date().toISOString().slice(0, 10)),
    '    archived: false',
  ].join('\n');
}

function frontmatter(packet, createdAt) {
  const title = safeTitle(packet.claims?.[0]?.claim || packet.candidate?.canonical_subject_id || 'Grounded Threatpedia Draft');
  const tags = ['grounded-draft', packet.lane, 'supply-chain'].filter(Boolean);
  const sources = allSources(packet).map(sourceFrontmatter).join('\n');
  const date = packet.key_dates?.disclosed_at || packet.key_dates?.published_at || createdAt;
  const base = [
    '---',
  ];

  if (packet.lane === 'campaign') {
    base.push(
      `campaignId: ${yamlString(`TP-CAMP-${createdAt.slice(0, 4)}-${numericId(packet.source_packet_id, Number(createdAt.slice(0, 4))).slice(-4)}`)}`,
      `title: ${yamlString(title)}`,
      `startDate: ${yamlString(date)}`,
      'ongoing: false',
      'attackType: "Supply Chain"',
      'severity: medium',
      'sector: "Technology"',
      'geography: "Global"',
      'reviewStatus: "draft_ai"',
      'confidenceGrade: C',
      'generatedBy: "ai_ingestion"',
      `generatedDate: ${createdAt}`,
      'tags:',
      ...tags.map((tag) => `  - ${yamlString(tag)}`),
      'sources:',
      sources,
      'mitreMappings: []',
    );
  } else if (packet.lane === 'threat-actor') {
    base.push(
      `name: ${yamlString(title)}`,
      'aliases: []',
      'affiliation: "Unknown"',
      'motivation: "Unknown"',
      'status: unknown',
      'country: "Unknown"',
      'attributionConfidence: A6',
      'reviewStatus: "draft_ai"',
      'generatedBy: "ai_ingestion"',
      `generatedDate: ${createdAt}`,
      'tags:',
      ...tags.map((tag) => `  - ${yamlString(tag)}`),
      'sources:',
      sources,
      'mitreMappings: []',
    );
  } else if (packet.lane === 'zero-day') {
    base.push(
      `cveId: ${yamlString(packet.cves?.[0]?.id || packet.candidate?.canonical_subject_id || 'CVE-0000-0000')}`,
      `title: ${yamlString(title)}`,
      `discoveredDate: ${yamlString(date)}`,
      'publishedDate: null',
      'vendor: "Unknown"',
      'product: "Unknown"',
      'severity: medium',
      'reviewStatus: "draft_ai"',
      'confidenceGrade: C',
      'generatedBy: "ai_ingestion"',
      `generatedDate: ${createdAt}`,
      'tags:',
      ...tags.map((tag) => `  - ${yamlString(tag)}`),
      'sources:',
      sources,
      'mitreMappings: []',
    );
  } else {
    base.push(
      `eventId: ${yamlString(numericId(packet.source_packet_id, Number(createdAt.slice(0, 4))))}`,
      `title: ${yamlString(title)}`,
      `date: ${createdAt}`,
      'attackType: "Supply Chain"',
      'severity: medium',
      'sector: "Technology"',
      'geography: "Global"',
      'threatActor: "Unknown"',
      'attributionConfidence: A6',
      'reviewStatus: "draft_ai"',
      'confidenceGrade: C',
      'generatedBy: "ai_ingestion"',
      `generatedDate: ${createdAt}`,
      'tags:',
      ...tags.map((tag) => `  - ${yamlString(tag)}`),
      'sources:',
      sources,
      'mitreMappings: []',
    );
  }

  base.push('---', '');
  return base.join('\n');
}

function claimLine(claim) {
  return `<!-- claims: ${claim.claim_id} --> ${claim.claim}`;
}

function groupedClaims(packet) {
  const groups = new Map();
  for (const claim of packet.claims || []) {
    const section = claim.article_section || 'summary';
    if (!groups.has(section)) groups.set(section, []);
    groups.get(section).push(claim);
  }
  return groups;
}

function body(packet) {
  const groups = groupedClaims(packet);
  const summaryClaims = groups.get('summary') || packet.claims?.slice(0, 2) || [];
  const technicalClaims = groups.get('technical-analysis') || [];
  const timelineClaims = groups.get('timeline') || [];
  const summaryClaimIds = new Set(summaryClaims.map((claim) => claim.claim_id));
  const technicalClaimIds = new Set(technicalClaims.map((claim) => claim.claim_id));
  const timelineClaimIds = new Set(timelineClaims.map((claim) => claim.claim_id));
  const supportingClaims = (packet.claims || []).filter((claim) =>
    !summaryClaimIds.has(claim.claim_id)
    && !technicalClaimIds.has(claim.claim_id)
    && !timelineClaimIds.has(claim.claim_id)
  );
  const findingClaims = [...technicalClaims, ...supportingClaims];
  const sourceRows = allSources(packet)
    .map((source, index) => `${index + 1}. [${markdownEscape(source.publisher)}](${source.url}) — ${markdownEscape(source.publisher)}, ${source.published_at || 'accessed during packet assembly'}`)
    .join('\n');

  const lines = [
    '## Executive Summary',
    '',
    ...(summaryClaims.length ? summaryClaims.map(claimLine) : ['<!-- claims: claim-1 --> This draft has no additional executive-summary facts beyond the packet subject.']),
    '',
    '## Source-Grounded Findings',
    '',
    ...(findingClaims.length ? findingClaims.map(claimLine) : (packet.claims || []).map(claimLine)),
    '',
    '## Timeline',
    '',
    ...(timelineClaims.length ? timelineClaims.map(claimLine) : ['<!-- claims: claim-1 --> The source packet does not establish a complete public timeline.']),
    '',
    '## Open Questions',
    '',
    ...((packet.uncertainties || []).map((item) => `<!-- claims: ${packet.claims?.[0]?.claim_id || 'claim-1'} --> ${item.drafting_instruction}`)),
    '',
    '## Sources & References',
    '',
    sourceRows,
    '',
  ];
  return lines.join('\n');
}

export function draftFromPacket(packet, { createdAt = new Date().toISOString().slice(0, 10) } = {}) {
  if (packet?.grounding_contract?.drafting_mode !== 'packet_claims_only') {
    throw new Error('Packet is missing packet_claims_only grounding contract');
  }
  if (!Array.isArray(packet.claims) || packet.claims.length === 0) {
    throw new Error('Packet has no claims to draft from');
  }
  return frontmatter(packet, createdAt) + body(packet);
}

async function run() {
  const args = parseArgs();
  const packet = readJson(repoRoot, args.packet);
  const draft = draftFromPacket(packet, { createdAt: args.createdAt || new Date().toISOString().slice(0, 10) });
  writeText(repoRoot, args.out, draft);
  process.stdout.write(`${JSON.stringify({
    status: 'PASS',
    output: path.resolve(repoRoot, args.out),
    lane: packet.lane,
    claims: packet.claims.length,
    slug: slugPart(packet.claims[0]?.claim || packet.source_packet_id),
  }, null, 2)}\n`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  run().catch((error) => {
    console.error(`[draft-grounded-article] ERROR: ${error.message}`);
    process.exit(1);
  });
}
