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
import { SCHEMA_REQUIRED_H2_BY_TYPE } from './pipeline-schema.mjs';

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

function publisherTypeForSource(source) {
  const publisher = String(source.publisher || '').toLowerCase();
  const url = String(source.url || '').toLowerCase();
  if (publisher.includes('cybersecurity and infrastructure security agency') || url.includes('cisa.gov')) return 'government';
  if (source.source_type === 'database') return 'research';
  if (source.source_type === 'news') return 'media';
  if (source.source_type === 'other') return 'community';
  return source.source_type;
}

function sourceFrontmatter(source, fallbackDate) {
  const publisherType = publisherTypeForSource(source);
  return [
    '  - url: ' + yamlString(source.url),
    '    publisher: ' + yamlString(source.publisher),
    '    publisherType: ' + publisherType,
    '    reliability: ' + (source.role === 'primary' ? 'R1' : 'R2'),
    '    publicationDate: ' + yamlString(sourcePublicationDate(source, fallbackDate)),
    '    archived: false',
  ].join('\n');
}

function sourcePublicationDate(source, fallbackDate) {
  return source.published_at || fallbackDate;
}

function assertCampaignSourceReadiness(packet) {
  const sources = allSources(packet);
  const governmentSources = sources.filter((source) => publisherTypeForSource(source) === 'government');
  if (sources.length < 3) {
    throw new Error('Campaign grounded drafts require at least three packet sources for the live campaign schema');
  }
  if (governmentSources.length === 0) {
    throw new Error('Campaign grounded drafts require at least one government source for the live campaign schema');
  }
}

function firstAffectedProduct(packet) {
  const product = Array.isArray(packet.affected_products) ? packet.affected_products[0] : null;
  return product?.product || product?.vendor || 'Unknown';
}

function mappingConfidence(value) {
  if (value === 'high') return 'confirmed';
  if (value === 'medium') return 'probable';
  return 'possible';
}

function includedMitreMappings(packet) {
  return (Array.isArray(packet.mitre_candidates) ? packet.mitre_candidates : [])
    .filter((mapping) => mapping?.include_in_article === true && mapping.technique_id)
    .map((mapping) => ({
      techniqueId: mapping.technique_id,
      techniqueName: mapping.technique_name,
      tactic: mapping.tactic,
      confidence: mappingConfidence(mapping.confidence),
    }));
}

function mitreFrontmatter(packet, { required = false } = {}) {
  const mappings = includedMitreMappings(packet);
  if (required && mappings.length === 0) {
    throw new Error('Campaign grounded drafts require at least one cited-source MITRE mapping marked include_in_article=true');
  }
  if (mappings.length === 0) return ['mitreMappings: []'];
  return [
    'mitreMappings:',
    ...mappings.flatMap((mapping) => [
      `  - techniqueId: ${yamlString(mapping.techniqueId)}`,
      `    techniqueName: ${yamlString(mapping.techniqueName)}`,
      `    tactic: ${yamlString(mapping.tactic)}`,
      `    confidence: ${mapping.confidence}`,
      '    evidence: "Mapped from cited source claims."',
    ]),
  ];
}

function frontmatter(packet, createdAt) {
  const title = safeTitle(packet.candidate?.title || packet.claims?.[0]?.claim || packet.candidate?.canonical_subject_id || 'Grounded Threatpedia Draft');
  const tags = ['grounded-draft', packet.lane, 'supply-chain'].filter(Boolean);
  const fallbackDate = packet.created_at ? packet.created_at.slice(0, 10) : createdAt;
  const sources = allSources(packet).map((source) => sourceFrontmatter(source, fallbackDate)).join('\n');
  const date = packet.key_dates?.disclosed_at || packet.key_dates?.published_at || createdAt;
  const base = [
    '---',
  ];

  if (packet.lane === 'campaign') {
    assertCampaignSourceReadiness(packet);
    base.push(
      `campaignId: ${yamlString(`TP-CAMP-${createdAt.slice(0, 4)}-${numericId(packet.source_packet_id, Number(createdAt.slice(0, 4))).slice(-4)}`)}`,
      `title: ${yamlString(title)}`,
      `startDate: ${yamlString(date)}`,
      'ongoing: true',
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
      ...mitreFrontmatter(packet, { required: true }),
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
      ...mitreFrontmatter(packet),
    );
  } else if (packet.lane === 'zero-day') {
    base.push(
      `title: ${yamlString(title)}`,
      `cve: ${yamlString(packet.cves?.[0]?.id || packet.candidate?.canonical_subject_id || 'CVE-0000-0000')}`,
      'type: "Vulnerability"',
      `platform: ${yamlString(firstAffectedProduct(packet))}`,
      'severity: medium',
      'status: unknown',
      'isZeroDay: true',
      `disclosedDate: ${yamlString(date)}`,
      `cisaKev: ${packet.kev_status?.in_kev ? 'true' : 'false'}`,
      'reviewStatus: "draft_ai"',
      'generatedBy: "ai_ingestion"',
      `generatedDate: ${createdAt}`,
      'tags:',
      ...tags.map((tag) => `  - ${yamlString(tag)}`),
      'sources:',
      sources,
      ...mitreFrontmatter(packet),
    );
  } else {
    base.push(
      `eventId: ${yamlString(numericId(packet.source_packet_id, Number(createdAt.slice(0, 4))))}`,
      `title: ${yamlString(title)}`,
      `date: ${date}`,
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
      ...mitreFrontmatter(packet),
    );
  }

  base.push('---', '');
  return base.join('\n');
}

function splitSentences(text) {
  const cleaned = String(text || '').trim();
  if (!cleaned) return [];
  return cleaned.split(/(?<=[.!?])\s+/).map((sentence) => sentence.trim()).filter(Boolean);
}

function claimLine(claim) {
  const sentences = splitSentences(claim.claim);
  if (sentences.length === 0) return `<!-- claims: ${claim.claim_id} -->`;
  return sentences.map((sentence) => `<!-- claims: ${claim.claim_id} --> ${sentence}`).join('\n');
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

function claimLines(claims) {
  return claims.flatMap((claim) => claimLine(claim).split('\n'));
}

function fallbackLine(packet, text) {
  return `<!-- claims: ${packet.claims?.[0]?.claim_id || 'claim-1'} --> ${text}`;
}

function sectionContent(packet, heading, claimSets) {
  if (heading === 'Sources & References') {
    const extractTitles = new Map((packet.source_extracts || []).map((extract) => [extract.source_id, extract.title]));
    const fallbackDate = packet.created_at ? packet.created_at.slice(0, 10) : null;
    const sourceRows = allSources(packet)
      .map((source) => {
        const title = markdownEscape(extractTitles.get(source.id) || source.publisher);
        return `- [${markdownEscape(source.publisher)}: ${title}](${source.url}) — ${markdownEscape(source.publisher)}, ${sourcePublicationDate(source, fallbackDate)}`;
      });
    return sourceRows.length ? sourceRows : [fallbackLine(packet, 'No cited source rows are available for this draft.')];
  }
  if (/timeline/i.test(heading)) {
    return claimSets.timeline.length ? claimLines(claimSets.timeline) : [fallbackLine(packet, 'Available sources do not establish a complete public timeline.')];
  }
  if (/summary|severity/i.test(heading)) {
    return claimSets.summary.length ? claimLines(claimSets.summary) : [fallbackLine(packet, 'Available sources establish the incident subject but not additional summary detail.')];
  }
  if (/technical|mitre|capabilities/i.test(heading)) {
    return claimSets.findings.length ? claimLines(claimSets.findings) : [fallbackLine(packet, 'Available sources do not establish additional technical findings.')];
  }
  if (/attack chain|exploit chain/i.test(heading)) {
    return [fallbackLine(packet, 'Available sources do not establish a detailed attack chain.')];
  }
  if (/attribution|campaign/i.test(heading)) {
    return claimSets.attribution.length ? claimLines(claimSets.attribution) : [fallbackLine(packet, 'Available sources do not establish additional attribution beyond the current classification.')];
  }
  if (/remediation/i.test(heading)) {
    return claimSets.remediation.length ? claimLines(claimSets.remediation) : [fallbackLine(packet, 'Available sources do not establish additional remediation facts for this section.')];
  }
  if (/impact|detection|indicators|open questions/i.test(heading)) {
    return [fallbackLine(packet, 'Available sources do not establish additional facts for this section.')];
  }
  return claimLines(claimSets.reader);
}

function body(packet) {
  const groups = groupedClaims(packet);
  const readerClaims = (packet.claims || []).filter((claim) => !['frontmatter', 'internal'].includes(claim.article_section));
  const summaryClaims = groups.get('summary') || [];
  const technicalClaims = groups.get('technical-analysis') || [];
  const timelineClaims = groups.get('timeline') || [];
  const attributionClaims = groups.get('attribution') || (packet.claims || []).filter((claim) => claim.claim_type === 'attribution');
  const remediationClaims = [
    ...(groups.get('mitigation') || []),
    ...(groups.get('remediation') || []),
  ];
  const summaryClaimIds = new Set(summaryClaims.map((claim) => claim.claim_id));
  const technicalClaimIds = new Set(technicalClaims.map((claim) => claim.claim_id));
  const timelineClaimIds = new Set(timelineClaims.map((claim) => claim.claim_id));
  const attributionClaimIds = new Set(attributionClaims.map((claim) => claim.claim_id));
  const remediationClaimIds = new Set(remediationClaims.map((claim) => claim.claim_id));
  const supportingClaims = readerClaims.filter((claim) =>
    !summaryClaimIds.has(claim.claim_id)
    && !technicalClaimIds.has(claim.claim_id)
    && !timelineClaimIds.has(claim.claim_id)
    && !attributionClaimIds.has(claim.claim_id)
    && !remediationClaimIds.has(claim.claim_id)
  );
  const findingClaims = [...technicalClaims, ...supportingClaims];
  const headings = SCHEMA_REQUIRED_H2_BY_TYPE[packet.lane] || [
    'Executive Summary',
    'Source-Grounded Findings',
    'Timeline',
    'Open Questions',
    'Sources & References',
  ];
  const claimSets = {
    summary: summaryClaims,
    findings: findingClaims,
    timeline: timelineClaims,
    attribution: attributionClaims,
    remediation: remediationClaims,
    reader: readerClaims,
  };
  const lines = [];
  for (const heading of headings) {
    lines.push(`## ${heading}`, '', ...sectionContent(packet, heading, claimSets), '');
  }
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
    slug: slugPart(packet.candidate?.title || packet.claims[0]?.claim || packet.source_packet_id),
  }, null, 2)}\n`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  run().catch((error) => {
    console.error(`[draft-grounded-article] ERROR: ${error.message}`);
    process.exit(1);
  });
}
