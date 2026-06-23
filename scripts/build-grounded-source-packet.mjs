#!/usr/bin/env node
/**
 * Build a grounded source packet from an approved B1 candidate.
 *
 * This is the B2 path. It requires an explicit approval selector and fetches
 * source text before marking the packet sufficient for drafting. It never
 * mutates the B1 candidate queue and never creates article drafts by itself.
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  candidateById,
  claim,
  extractIds,
  extractSource,
  laneForCandidate,
  readJson,
  repoPath,
  safeTitle,
  SECTION_MAP,
  uniqueStrings,
  writeJson,
} from './grounded-drafting-lib.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function usage() {
  console.log([
    'Usage:',
    '  node scripts/build-grounded-source-packet.mjs --queue <queue.json> --candidate-id <id> --approved-by <name> --approval-ref <ref> --out <packet.json> [--fixtures-dir <dir>]',
    '',
    'The queue candidate must remain candidate-review only; B2 approval is recorded in the packet, not the queue.',
  ].join('\n'));
}

function parseArgs(argv = process.argv) {
  const args = {
    queue: null,
    candidateId: null,
    approvedBy: null,
    approvalRef: null,
    out: null,
    fixturesDir: null,
    createdAt: null,
    allowFetchFailures: false,
  };
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    const next = argv[i + 1];
    switch (token) {
      case '--queue':
        if (!next) throw new Error('Missing value for --queue');
        args.queue = next;
        i += 1;
        break;
      case '--candidate-id':
        if (!next) throw new Error('Missing value for --candidate-id');
        args.candidateId = next;
        i += 1;
        break;
      case '--approved-by':
        if (!next) throw new Error('Missing value for --approved-by');
        args.approvedBy = next;
        i += 1;
        break;
      case '--approval-ref':
        if (!next) throw new Error('Missing value for --approval-ref');
        args.approvalRef = next;
        i += 1;
        break;
      case '--out':
        if (!next) throw new Error('Missing value for --out');
        args.out = next;
        i += 1;
        break;
      case '--fixtures-dir':
        if (!next) throw new Error('Missing value for --fixtures-dir');
        args.fixturesDir = next;
        i += 1;
        break;
      case '--created-at':
        if (!next) throw new Error('Missing value for --created-at');
        args.createdAt = next;
        i += 1;
        break;
      case '--allow-fetch-failures':
        args.allowFetchFailures = true;
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
  for (const field of ['queue', 'candidateId', 'approvedBy', 'approvalRef', 'out']) {
    if (!args[field]) throw new Error(`--${field.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)} is required`);
  }
  return args;
}

function sourceRefsForAll(sources) {
  return sources.map((source) => source.id);
}

function sourceRefsByRole(sources, roles) {
  const wanted = new Set(roles);
  const refs = sources.filter((source) => wanted.has(source.role) || wanted.has(source.source_type)).map((source) => source.id);
  return refs.length ? refs : sourceRefsForAll(sources);
}

function affectedProducts(candidate, sources) {
  const sourceRefs = sourceRefsByRole(sources, ['primary', 'database', 'vendor', 'research']);
  const products = [];
  const subject = candidate.canonicalSubjectId || '';
  if (subject.startsWith('pkg:')) {
    products.push({
      vendor: 'Unknown',
      product: subject,
      versions: 'unknown',
      source_refs: sourceRefs,
    });
  }
  for (const pkg of candidate.matchedEntityHints?.packages || []) {
    products.push({
      vendor: 'Unknown',
      product: pkg.name || pkg.id,
      versions: 'unknown',
      source_refs: sourceRefs,
    });
  }
  if (products.length === 0) {
    products.push({
      vendor: 'Unknown',
      product: candidate.title || candidate.canonicalSubjectId,
      versions: 'unknown',
      source_refs: sourceRefs,
    });
  }
  return products;
}

const BOILERPLATE_SENTENCE_RE = /\b(?:secure \.gov websites|a lock \( lock|flipboard|whatsapp|reddit|email more|cookie|enable javascript|privacy policy|terms of use|subscribe|learn more)\b/i;
const LOW_SIGNAL_TERMS = new Set([
  'candidate',
  'classified',
  'current',
  'create',
  'article',
  'grounded',
  'drafting',
  'supply',
  'chain',
  'security',
  'compromise',
  'incident',
  'campaign',
  'package',
]);

function candidateTerms(candidate) {
  const values = [
    candidate.title,
    candidate.summary,
    candidate.canonicalSubjectId,
    candidate.matchedEntityHints?.actors?.map((item) => item.name || item.id),
    candidate.matchedEntityHints?.campaigns?.map((item) => item.name || item.id),
    candidate.matchedEntityHints?.packages?.map((item) => item.name || item.id),
  ].flat(Infinity);
  const words = uniqueStrings(values.join(' ').toLowerCase().match(/[a-z0-9][a-z0-9._-]{2,}/g) || []);
  return words.filter((word) => !LOW_SIGNAL_TERMS.has(word));
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function candidateTermRegex(term) {
  const escaped = escapeRegExp(term);
  return new RegExp(`(^|[^a-z0-9._-])${escaped}(?=$|[^a-z0-9._-])`, 'i');
}

function sourceSentenceForCandidate(text, candidate) {
  const termRegexes = candidateTerms(candidate).map((term) => candidateTermRegex(term));
  const sentences = String(text || '')
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length >= 40 && sentence.length <= 320)
    .filter((sentence) => !BOILERPLATE_SENTENCE_RE.test(sentence));
  if (sentences.length === 0) return null;

  let best = null;
  for (const sentence of sentences) {
    const lower = sentence.toLowerCase();
    const score = termRegexes.reduce((total, regex) => total + (regex.test(lower) ? 1 : 0), 0);
    if (score > (best?.score || 0)) best = { sentence, score };
  }
  return best?.score > 0 ? best.sentence : sentences[0];
}

function articleSectionForSourceSentence(sentence) {
  if (/\b(?:ensure that you are using|update|upgrade|patch|patched|released|rotate|rotated|remove|removed|mitigat|remediat|addresses the concerns)\b/i.test(sentence)) {
    return 'mitigation';
  }
  return 'technical-analysis';
}

function contextualizeSourceRelativeSentence(sentence, source) {
  const text = String(sentence || '').trim();
  const phraseIndex = text.toLowerCase().indexOf('what has not yet been publicly reported is that');
  const relevantText = phraseIndex >= 0 ? text.slice(phraseIndex) : text;
  const match = relevantText.match(/^What has not yet been publicly reported is that\s+(.+)$/i);
  if (!match) return text;
  const detail = match[1].trim().replace(/\s+([.,;:!?])/g, '$1');
  const prefix = source?.publisher && source?.published_at
    ? `${source.publisher} reported on ${source.published_at} that`
    : 'A cited source reported that';
  return `${prefix} ${detail}`;
}

function mitreCandidates(candidate, sources) {
  const text = [
    candidate.title,
    candidate.summary,
    candidate.proposedArchetype,
    candidate.classification?.workIntent,
    candidate.classification?.effectiveActiveStatus,
    candidate.matchedEntityHints?.packages?.map((item) => `${item.name || ''} ${item.ecosystem || ''}`),
  ].flat(Infinity).join(' ');
  if (!/\b(?:supply[- ]chain|ci\/cd|github actions|jenkins|npm|pypi|package|registry|workflow)\b/i.test(text)) {
    return [];
  }
  return [{
    technique_id: 'T1195.002',
    technique_name: 'Compromise Software Supply Chain',
    tactic: 'Initial Access',
    source_refs: sourceRefsByRole(sources, ['primary', 'database', 'vendor', 'research']),
    confidence: 'medium',
    include_in_article: true,
  }];
}

function outputPatternForLane(lane, candidateId) {
  const section = SECTION_MAP[lane];
  if (!section) throw new Error(`Unsupported grounded drafting lane: ${lane}`);
  if (lane === 'malware-family') {
    return `.github/pipeline/grounded-drafts/${section}/${candidateId}.md`;
  }
  return `site/src/content/${section}/${candidateId}.md`;
}

function candidateClaims(candidate, sources, extracts) {
  const claims = [];
  const primaryRefs = sourceRefsByRole(sources, ['primary', 'database', 'vendor', 'research']);
  const allRefs = sourceRefsForAll(sources);
  claim(claims, `${safeTitle(candidate.title)} is the candidate subject approved for grounded drafting.`, 'other', primaryRefs, 'frontmatter');
  if (candidate.summary) claim(claims, candidate.summary, 'other', primaryRefs, 'summary', 'medium');
  if (candidate.canonicalSubjectId) claim(claims, `The canonical subject identifier is ${candidate.canonicalSubjectId}.`, 'other', primaryRefs, 'frontmatter');
  if (candidate.classification?.leadClass) claim(claims, `The candidate is classified as ${candidate.classification.leadClass}.`, 'other', allRefs, 'frontmatter', 'medium');
  if (candidate.classification?.workIntent) claim(claims, `The classifier work intent is ${candidate.classification.workIntent}.`, 'other', allRefs, 'frontmatter', 'medium');
  if (candidate.classification?.effectiveActiveStatus && candidate.classification.effectiveActiveStatus !== 'none') {
    claim(claims, `The classifier effective active status is ${candidate.classification.effectiveActiveStatus}.`, 'exploitation', primaryRefs, 'frontmatter', 'medium');
  }
  for (const actor of candidate.matchedEntityHints?.actors || []) {
    claim(claims, `Available source evidence connects this incident to actor ${actor.name || actor.id}.`, 'attribution', allRefs, 'other', 'low');
  }
  for (const campaign of candidate.matchedEntityHints?.campaigns || []) {
    claim(claims, `Available source evidence connects this incident to campaign ${campaign.name || campaign.id}.`, 'attribution', allRefs, 'other', 'low');
  }
  const sourceById = new Map(sources.map((source) => [source.id, source]));
  for (const extract of extracts.filter((item) => item.status === 'ok')) {
    const sourceSentence = contextualizeSourceRelativeSentence(
      sourceSentenceForCandidate(extract.extracted_text, candidate),
      sourceById.get(extract.source_id),
    );
    if (sourceSentence) claim(claims, sourceSentence, 'other', [extract.source_id], articleSectionForSourceSentence(sourceSentence), 'medium');
  }
  return claims;
}

export async function buildGroundedPacket(args) {
  const queue = readJson(repoRoot, args.queue);
  const candidate = candidateById(queue, args.candidateId);
  if (!candidate) throw new Error(`Candidate ${args.candidateId} not found in ${args.queue}`);
  if (candidate.queueAction !== 'candidate_review') throw new Error(`Candidate ${candidate.candidateId} is not in candidate_review state`);
  if (candidate.draftingAllowed !== false) throw new Error('B1 candidate queue must remain draftingAllowed=false; approval belongs in the B2 packet');

  const sourceUrls = uniqueStrings(candidate.sourceRefs || []);
  if (sourceUrls.length === 0) throw new Error(`Candidate ${candidate.candidateId} has no sourceRefs`);

  const extracted = await Promise.all(sourceUrls.map((url, index) => extractSource(url, `src-${index + 1}`, {
    root: repoRoot,
    fixturesDir: args.fixturesDir,
  })));
  const sources = extracted.map((item) => item.source);
  const extracts = extracted.map((item) => item.extract);
  const failed = extracts.filter((extract) => extract.status !== 'ok');
  if (failed.length && !args.allowFetchFailures) {
    throw new Error(`Source extraction failed for ${failed.map((item) => item.source_id).join(', ')}; rerun only after sources can be fetched or fixture-backed`);
  }

  const lane = laneForCandidate(candidate);
  const primarySources = sources.filter((source) => source.role === 'primary');
  const supportingSources = sources.filter((source) => source.role !== 'primary');
  const successfulExtractRefs = extracts.filter((extract) => extract.status === 'ok').map((extract) => extract.source_id);
  const claims = candidateClaims(candidate, sources, extracts);
  const idText = [candidate.title, candidate.summary, candidate.canonicalSubjectId, claims.map((item) => item.claim)].flat().join('\n');
  const ids = extractIds(idText);
  const createdAt = args.createdAt || new Date().toISOString();

  return {
    schema_version: 'source-packet/1',
    task_id: `TASK-${createdAt.slice(0, 4)}-${String(Number.parseInt(candidate.candidateId?.slice(-4) || '0', 16) % 10000).padStart(4, '0')}`,
    lane,
    source_packet_id: `sp-${candidate.candidateId}`,
    created_at: createdAt,
    source_packet_status: 'draft',
    candidate: {
      candidate_id: candidate.candidateId,
      canonical_subject_id: candidate.canonicalSubjectId,
      proposed_archetype: candidate.proposedArchetype,
      title: candidate.title || null,
      summary: candidate.summary || null,
      classification: candidate.classification,
      rank: candidate.rank,
      rank_reasons: candidate.rankReasons || [],
    },
    approval: {
      approved_by: args.approvedBy,
      approval_ref: args.approvalRef,
      approved_at: createdAt,
      scope: 'grounded_draft_sample_or_candidate',
    },
    grounding_contract: {
      drafting_mode: 'packet_claims_only',
      disallow_model_memory: true,
      disallow_placeholder_urls: true,
      require_claim_markers: true,
      require_source_url_parity: true,
      generation_must_fail_on_fetch_error: !args.allowFetchFailures,
    },
    output_target: {
      file_pattern: outputPatternForLane(lane, candidate.candidateId),
      branch: null,
      pr: true,
    },
    primary_sources: primarySources,
    supporting_sources: supportingSources,
    source_extracts: extracts,
    source_quality: {
      has_government_source: sources.some((source) => source.source_type === 'government'),
      has_vendor_source: sources.some((source) => source.source_type === 'vendor'),
      has_primary_source: primarySources.length > 0,
      source_sufficiency: primarySources.length > 0 && successfulExtractRefs.length > 0 && claims.length > 0 ? 'sufficient' : 'insufficient',
    },
    key_dates: {
      disclosed_at: null,
      published_at: candidate.firstSeenAt ? candidate.firstSeenAt.slice(0, 10) : null,
      patched_at: null,
      kev_added_at: null,
      exploited_before_disclosure: 'unknown',
      date_uncertainties: ['Candidate queue data does not establish all article timeline dates.'],
    },
    affected_products: affectedProducts(candidate, sources),
    cves: ids.cves.map((id) => ({ id, source_refs: sourceRefsByRole(sources, ['database', 'government', 'vendor', 'primary']) })),
    cwes: [],
    kev_status: {
      in_kev: candidate.classification?.kevStatusDerived ? true : false,
      source_refs: candidate.classification?.kevStatusDerived ? sourceRefsByRole(sources, ['government', 'database', 'primary']) : [],
    },
    exploit_status: {
      known_exploited: candidate.classification?.effectiveActiveStatus !== 'none',
      source_refs: candidate.classification?.effectiveActiveStatus !== 'none' ? sourceRefsByRole(sources, ['database', 'research', 'vendor', 'primary']) : [],
      notes: candidate.classification?.effectiveActiveStatus !== 'none'
        ? 'Known-exploitation or malware signal is limited to classifier-backed source data in this packet.'
        : 'No effective active-exploitation signal is present in the candidate classification.',
    },
    claims,
    uncertainties: [
      {
        topic: 'source packet scope',
        reason: 'This packet is built from a candidate queue item and fetched sources only.',
        drafting_instruction: 'Do not add facts, dates, attribution, or impact figures unless they are represented in claims with source_refs.',
      },
      {
        topic: 'date and patch status',
        reason: 'The candidate queue and fetched source extracts do not establish every timeline or remediation date required for publication.',
        drafting_instruction: 'Do not claim disclosure, publication, patch, or remediation dates unless a packet claim states the date with source_refs.',
      },
      {
        topic: 'exploit timing',
        reason: 'The candidate classification can indicate active signal without establishing exploitation timing relative to disclosure.',
        drafting_instruction: 'Do not claim exploitation timing, pre-disclosure exploitation, or campaign dwell time unless a packet claim states it with source_refs.',
      },
    ],
    not_supported: [
      {
        claim: 'Any fact not present in claims[]',
        reason: 'B2 grounded drafting forbids model-memory additions and placeholder source recovery.',
      },
    ],
    mitre_candidates: mitreCandidates(candidate, sources),
    drafting_notes: [
      'Draft strictly from claims[] and source_extracts[].',
      'Every substantive article sentence must carry a claim marker.',
      'Do not introduce URLs outside primary_sources/supporting_sources.',
    ],
    preflight: {
      status: 'not_run',
      errors: [],
      warnings: [],
    },
  };
}

async function run() {
  const args = parseArgs();
  const packet = await buildGroundedPacket(args);
  writeJson(repoRoot, args.out, packet);
  process.stdout.write(`${JSON.stringify({
    status: 'PASS',
    packet: repoPath(repoRoot, args.out),
    candidate_id: packet.candidate.candidate_id,
    lane: packet.lane,
    sources: packet.primary_sources.length + packet.supporting_sources.length,
    claims: packet.claims.length,
  }, null, 2)}\n`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  run().catch((error) => {
    console.error(`[build-grounded-source-packet] ERROR: ${error.message}`);
    process.exit(1);
  });
}
