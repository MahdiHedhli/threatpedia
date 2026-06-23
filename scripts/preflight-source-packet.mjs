#!/usr/bin/env node
/**
 * Deterministic preflight for source-packet/1 packets.
 */

import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const ISO_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
const CVE_RE = /^CVE-\d{4}-\d{4,}$/;
const CWE_RE = /^CWE-\d+$/;
const ATTACK_RE = /^T\d{4}(?:\.\d{3})?$/;
const CLAIM_RE = /^claim-\d+$/;
const SOURCE_TYPES = new Set(['government', 'vendor', 'database', 'research', 'news', 'other']);
const SOURCE_ROLES = new Set(['primary', 'supporting']);
const SUFFICIENCY = new Set(['sufficient', 'insufficient', 'needs_human_review']);
const SOURCE_PACKET_STATUSES = new Set(['draft', 'preflight_passed', 'preflight_failed']);
const LANES = new Set(['zero-day', 'incident', 'campaign', 'threat-actor', 'malware-family']);
const PREFLIGHT_STATUSES = new Set(['not_run', 'pass', 'fail']);
const CONFIDENCE = new Set(['high', 'medium', 'low']);
const CLAIM_TYPES = new Set(['date', 'product', 'vulnerability', 'exploitation', 'impact', 'mitigation', 'attribution', 'other']);
const ARTICLE_SECTIONS = new Set(['frontmatter', 'summary', 'technical-analysis', 'timeline', 'mitigation', 'other']);
const SECRET_LIKE_RE = /(AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9_]+|github_pat_[A-Za-z0-9_]+|-----BEGIN [A-Z ]+PRIVATE KEY-----|\.env(?:\.|$)|\/Users\/|[A-Z]:\\|(?:api[_-]?key|access[_-]?token|client[_-]?secret|secret[_-]?key|password)\s*[:=]\s*['"]?[A-Za-z0-9_./+=-]{24,})/i;
const NON_ASCII_RE = /[^\x09\x0A\x0D\x20-\x7E]/;

function usage() {
  console.log([
    'Usage:',
    '  node scripts/preflight-source-packet.mjs <packet.json> [--json-out <report.json>]',
    '',
    'Returns exit 0 on pass and exit 1 on fail.',
  ].join('\n'));
}

function parseArgs(argv) {
  const args = { packet: null, jsonOut: null };
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    const next = argv[i + 1];
    switch (token) {
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
        if (args.packet) throw new Error(`Unexpected argument: ${token}`);
        args.packet = token;
    }
  }
  if (!args.packet) throw new Error('packet path is required');
  return args;
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isStringOrNull(value) {
  return value === null || isString(value);
}

function isBool(value) {
  return typeof value === 'boolean';
}

function add(list, message, path = '$') {
  list.push({ path, message });
}

function readPacket(path) {
  const abs = resolve(ROOT, path);
  return JSON.parse(readFileSync(abs, 'utf8'));
}

function formatPath(parent, key, isIndex = false) {
  if (isIndex) return `${parent}[${key}]`;
  const needsBracket = /[\s\-]/.test(key);
  return needsBracket ? `${parent}["${key}"]` : `${parent}.${key}`;
}

function scanStrings(value, path, errors, warnings) {
  if (typeof value === 'string') {
    const normalized = value.normalize('NFKC');
    if (NON_ASCII_RE.test(normalized)) add(warnings, 'non-ASCII text detected', path);
    if (SECRET_LIKE_RE.test(normalized)) add(errors, 'credential, local path, or secret-like pattern detected', path);
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => scanStrings(item, formatPath(path, index, true), errors, warnings));
    return;
  }

  if (!isObject(value)) return;

  Object.entries(value).forEach(([key, item]) => {
    if (key === 'preflight') return;
    scanStrings(item, formatPath(path, key), errors, warnings);
  });
}

function writeJsonReport(path, result) {
  const abs = resolve(ROOT, path);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, JSON.stringify(result, null, 2) + '\n');
}

function validateDateOrNull(value, errors, path) {
  if (value === null) return;
  if (!DATE_RE.test(value) || Number.isNaN(Date.parse(`${value}T00:00:00Z`))) {
    add(errors, 'must be YYYY-MM-DD or null', path);
  }
}

function validateUrl(value, errors, path) {
  if (!isString(value)) {
    add(errors, 'must be a non-empty URL string', path);
    return;
  }
  try {
    const parsed = new URL(value);
    if (!['http:', 'https:'].includes(parsed.protocol)) add(errors, 'must use http(s)', path);
  } catch {
    add(errors, 'must be a valid URL', path);
  }
}

function allSources(packet) {
  return [
    ...(Array.isArray(packet.primary_sources) ? packet.primary_sources : []),
    ...(Array.isArray(packet.supporting_sources) ? packet.supporting_sources : []),
  ];
}

function refSet(packet) {
  return new Set(allSources(packet).map(source => source?.id).filter(Boolean));
}

function validateRefs(refs, sourceIds, errors, path, { allowEmpty = false } = {}) {
  if (!Array.isArray(refs)) {
    add(errors, 'source_refs must be an array', path);
    return;
  }
  if (!allowEmpty && refs.length === 0) add(errors, 'source_refs must not be empty', path);
  refs.forEach((ref, index) => {
    if (!sourceIds.has(ref)) add(errors, `unknown source ref ${JSON.stringify(ref)}`, `${path}[${index}]`);
  });
}

function lower(value) {
  return String(value || '').toLowerCase();
}

function containsUnsupportedNote(packet, unsupportedClaim) {
  const needle = lower(unsupportedClaim);
  if (!Array.isArray(packet?.drafting_notes)) return false;
  return packet.drafting_notes.some(note => lower(note).includes(needle));
}

function validatePreflight(packet) {
  const errors = [];
  const warnings = [];

  if (!isObject(packet)) {
    add(errors, 'root must be an object');
    return report(packet, errors, warnings);
  }

  const lane = packet.lane;
  const isZeroDay = lane === 'zero-day';

  if (packet.schema_version !== 'source-packet/1') add(errors, 'schema_version must be source-packet/1', '$.schema_version');
  if (!/^TASK-\d{4}-\d{4}$/.test(packet.task_id || '')) add(errors, 'task_id must match TASK-YYYY-NNNN', '$.task_id');
  if (!LANES.has(lane)) add(errors, 'lane is invalid', '$.lane');
  if (!/^sp-(?:TASK-\d{4}-\d{4}|SC-CAND-[a-f0-9]{16})$/.test(packet.source_packet_id || '')) add(errors, 'source_packet_id must match sp-TASK-YYYY-NNNN or sp-SC-CAND-<16 hex>', '$.source_packet_id');
  if (!ISO_RE.test(packet.created_at || '') || Number.isNaN(Date.parse(packet.created_at))) add(errors, 'created_at must be an ISO timestamp', '$.created_at');
  if (!SOURCE_PACKET_STATUSES.has(packet.source_packet_status)) add(errors, 'source_packet_status is invalid', '$.source_packet_status');

  if (!isObject(packet.output_target)) {
    add(errors, 'output_target is required for validator readiness', '$.output_target');
  } else {
    if (!isStringOrNull(packet.output_target.file_pattern)) add(errors, 'file_pattern must be null or a non-empty string', '$.output_target.file_pattern');
    if (!isStringOrNull(packet.output_target.branch)) add(errors, 'branch must be null or a non-empty string', '$.output_target.branch');
    if (!isBool(packet.output_target.pr)) add(errors, 'pr must be boolean', '$.output_target.pr');
  }

  for (const [field, role] of [['primary_sources', 'primary'], ['supporting_sources', 'supporting']]) {
    if (!Array.isArray(packet[field])) {
      add(errors, `${field} must be an array`, `$.${field}`);
      continue;
    }
    packet[field].forEach((source, index) => {
      const path = `$.${field}[${index}]`;
      if (!isObject(source)) {
        add(errors, 'source must be an object', path);
        return;
      }
      if (!isString(source.id)) add(errors, 'id is required', `${path}.id`);
      if (!isString(source.publisher)) add(errors, 'publisher is required', `${path}.publisher`);
      validateUrl(source?.url, errors, `${path}.url`);
      validateDateOrNull(source.published_at, errors, `${path}.published_at`);
      if (!SOURCE_TYPES.has(source.source_type)) add(errors, 'source_type is invalid', `${path}.source_type`);
      if (!SOURCE_ROLES.has(source.role)) add(errors, 'role is invalid', `${path}.role`);
      if (source.role !== role) add(errors, `role must be ${role}`, `${path}.role`);
      if (!isString(source.notes)) add(errors, 'notes are required', `${path}.notes`);
    });
  }

  const sources = allSources(packet);
  const sourceIds = refSet(packet);
  const sourceUrls = sources.map(source => source?.url);
  if (sources.length === 0) add(errors, 'at least one source is required', '$.primary_sources');
  if (sourceIds.size !== sources.length) add(errors, 'source ids must be unique', '$.primary_sources');
  if (new Set(sourceUrls).size !== sourceUrls.length) add(errors, 'source URLs must be deduped', '$.primary_sources');

  const hasGovernmentOrVendorOrDatabase = sources.some(source => ['government', 'vendor', 'database'].includes(source?.source_type));
  if (isZeroDay && !hasGovernmentOrVendorOrDatabase) add(errors, 'zero-day packets need at least one government, vendor, or database source', '$.source_quality');

  if (!isObject(packet.source_quality)) {
    add(errors, 'source_quality is required', '$.source_quality');
  } else {
    for (const field of ['has_government_source', 'has_vendor_source', 'has_primary_source']) {
      if (!isBool(packet.source_quality[field])) add(errors, `${field} must be boolean`, `$.source_quality.${field}`);
    }
    if (!SUFFICIENCY.has(packet.source_quality.source_sufficiency)) add(errors, 'source_sufficiency is invalid', '$.source_quality.source_sufficiency');
    if (!packet.source_quality.has_primary_source) add(errors, 'has_primary_source must be true for drafting readiness', '$.source_quality.has_primary_source');
    if (packet.source_quality.source_sufficiency !== 'sufficient') add(errors, 'source_sufficiency must be sufficient for drafting readiness', '$.source_quality.source_sufficiency');
  }

  if (packet.source_extracts !== undefined) {
    if (!Array.isArray(packet.source_extracts)) {
      add(errors, 'source_extracts must be an array when present', '$.source_extracts');
    } else {
      const okExtracts = packet.source_extracts.filter(extract => extract?.status === 'ok');
      if (packet.grounding_contract?.drafting_mode === 'packet_claims_only' && okExtracts.length === 0) {
        add(errors, 'grounded drafting packets need at least one successful source extract', '$.source_extracts');
      }
      packet.source_extracts.forEach((extract, index) => {
        const path = `$.source_extracts[${index}]`;
        if (!isObject(extract)) {
          add(errors, 'source_extract must be an object', path);
          return;
        }
        if (!sourceIds.has(extract.source_id)) add(errors, `unknown source_id ${JSON.stringify(extract.source_id)}`, `${path}.source_id`);
        if (!['ok', 'failed'].includes(extract.status)) add(errors, 'status must be ok or failed', `${path}.status`);
        if (!ISO_RE.test(extract.extracted_at || '') || Number.isNaN(Date.parse(extract.extracted_at))) add(errors, 'extracted_at must be an ISO timestamp', `${path}.extracted_at`);
        if (extract.status === 'ok' && !isString(extract.extracted_text)) add(errors, 'ok extracts require extracted_text', `${path}.extracted_text`);
        if (extract.status === 'failed' && !isString(extract.error)) add(errors, 'failed extracts require error', `${path}.error`);
      });
    }
  }

  if (packet.approval !== undefined) {
    if (!isObject(packet.approval)) {
      add(errors, 'approval must be an object when present', '$.approval');
    } else {
      for (const field of ['approved_by', 'approval_ref', 'approved_at', 'scope']) {
        if (!isString(packet.approval[field])) add(errors, `${field} is required`, `$.approval.${field}`);
      }
      if (packet.approval.approved_at && (!ISO_RE.test(packet.approval.approved_at) || Number.isNaN(Date.parse(packet.approval.approved_at)))) {
        add(errors, 'approved_at must be an ISO timestamp', '$.approval.approved_at');
      }
    }
  }

  if (packet.grounding_contract !== undefined) {
    if (!isObject(packet.grounding_contract)) {
      add(errors, 'grounding_contract must be an object when present', '$.grounding_contract');
    } else {
      if (packet.grounding_contract.drafting_mode !== 'packet_claims_only') add(errors, 'drafting_mode must be packet_claims_only', '$.grounding_contract.drafting_mode');
      for (const field of ['disallow_model_memory', 'disallow_placeholder_urls', 'require_claim_markers', 'require_source_url_parity']) {
        if (!isBool(packet.grounding_contract[field])) add(errors, `${field} must be boolean`, `$.grounding_contract.${field}`);
      }
    }
  }

  if (!isObject(packet.key_dates)) {
    add(errors, 'key_dates is required', '$.key_dates');
  } else {
    for (const field of ['disclosed_at', 'published_at', 'patched_at', 'kev_added_at']) {
      validateDateOrNull(packet.key_dates[field], errors, `$.key_dates.${field}`);
    }
    if (!['yes', 'no', 'unknown'].includes(packet.key_dates.exploited_before_disclosure)) {
      add(errors, 'exploited_before_disclosure is invalid', '$.key_dates.exploited_before_disclosure');
    }
    if (!Array.isArray(packet.key_dates.date_uncertainties)) add(errors, 'date_uncertainties must be an array', '$.key_dates.date_uncertainties');
    if (packet.key_dates.disclosed_at && packet.key_dates.published_at && packet.key_dates.published_at < packet.key_dates.disclosed_at) {
      add(warnings, 'published_at is before disclosed_at; verify source chronology', '$.key_dates.published_at');
    }
  }

  if (!Array.isArray(packet.affected_products) || packet.affected_products.length === 0) {
    add(errors, 'affected_products must not be empty', '$.affected_products');
  } else {
    packet.affected_products.forEach((product, index) => {
      const path = `$.affected_products[${index}]`;
      if (!isObject(product)) {
        add(errors, 'product must be an object', path);
        return;
      }
      if (!isString(product.vendor)) add(errors, 'vendor is required', `${path}.vendor`);
      if (!isString(product.product)) add(errors, 'product is required', `${path}.product`);
      if (!isString(product.versions)) add(errors, 'versions is required; use unknown when needed', `${path}.versions`);
      validateRefs(product.source_refs, sourceIds, errors, `${path}.source_refs`);
    });
  }

  if (!Array.isArray(packet.cves) || (isZeroDay && packet.cves.length === 0)) {
    add(errors, isZeroDay ? 'at least one CVE is required' : 'cves must be an array', '$.cves');
  } else {
    packet.cves.forEach((cve, index) => {
      const path = `$.cves[${index}]`;
      if (!isObject(cve)) {
        add(errors, 'CVE must be an object', path);
        return;
      }
      if (!CVE_RE.test(cve.id || '')) add(errors, 'CVE id is invalid', `${path}.id`);
      validateRefs(cve.source_refs, sourceIds, errors, `${path}.source_refs`);
    });
  }

  if (!Array.isArray(packet.cwes)) add(errors, 'cwes must be an array', '$.cwes');
  else packet.cwes.forEach((cwe, index) => {
    const path = `$.cwes[${index}]`;
    if (!isObject(cwe)) {
      add(errors, 'CWE must be an object', path);
      return;
    }
    if (!CWE_RE.test(cwe.id || '')) add(errors, 'CWE id is invalid', `${path}.id`);
    if (!isString(cwe.name)) add(errors, 'CWE name is required', `${path}.name`);
    validateRefs(cwe.source_refs, sourceIds, errors, `${path}.source_refs`);
  });

  if (!isObject(packet.kev_status)) add(errors, 'kev_status is required', '$.kev_status');
  else {
    if (!isBool(packet.kev_status.in_kev)) add(errors, 'in_kev must be boolean', '$.kev_status.in_kev');
    validateRefs(packet.kev_status.source_refs, sourceIds, errors, '$.kev_status.source_refs', { allowEmpty: packet.kev_status.in_kev === false });
  }

  if (!isObject(packet.exploit_status)) add(errors, 'exploit_status is required', '$.exploit_status');
  else {
    if (!isBool(packet.exploit_status.known_exploited)) add(errors, 'known_exploited must be boolean', '$.exploit_status.known_exploited');
    validateRefs(packet.exploit_status.source_refs, sourceIds, errors, '$.exploit_status.source_refs', { allowEmpty: packet.exploit_status.known_exploited === false });
    if (!isString(packet.exploit_status.notes)) add(errors, 'notes are required', '$.exploit_status.notes');
  }

  if (!Array.isArray(packet.claims) || packet.claims.length === 0) {
    add(errors, 'claims must not be empty', '$.claims');
  } else {
    packet.claims.forEach((claim, index) => {
      const path = `$.claims[${index}]`;
      if (!isObject(claim)) {
        add(errors, 'claim must be an object', path);
        return;
      }
      if (!CLAIM_RE.test(claim.claim_id || '')) add(errors, 'claim_id must match claim-N', `${path}.claim_id`);
      if (!isString(claim.claim)) add(errors, 'claim is required', `${path}.claim`);
      if (!CLAIM_TYPES.has(claim.claim_type)) add(errors, 'claim_type is invalid', `${path}.claim_type`);
      validateRefs(claim.source_refs, sourceIds, errors, `${path}.source_refs`);
      if (!CONFIDENCE.has(claim.confidence)) add(errors, 'confidence is invalid', `${path}.confidence`);
      if (!ARTICLE_SECTIONS.has(claim.article_section)) add(errors, 'article_section is invalid', `${path}.article_section`);
      if (claim.claim_type === 'date' && (!Array.isArray(claim.source_refs) || claim.source_refs.length === 0)) {
        add(errors, 'date claims must reference sources', `${path}.source_refs`);
      }
    });
  }

  if (!Array.isArray(packet.uncertainties)) add(errors, 'uncertainties must be an array', '$.uncertainties');
  else {
    packet.uncertainties.forEach((uncertainty, index) => {
      const path = `$.uncertainties[${index}]`;
      if (!isObject(uncertainty)) {
        add(errors, 'uncertainty must be an object', path);
        return;
      }
      if (!isString(uncertainty.topic)) add(errors, 'topic is required', `${path}.topic`);
      if (!isString(uncertainty.reason)) add(errors, 'reason is required', `${path}.reason`);
      if (!isString(uncertainty.drafting_instruction)) add(errors, 'drafting_instruction is required', `${path}.drafting_instruction`);
    });
  }

  const uncertaintyTopics = new Set((Array.isArray(packet.uncertainties) ? packet.uncertainties : []).map(item => lower(item?.topic)));
  const dateKeysToValidate = {
    disclosed_at: packet.key_dates?.disclosed_at,
    published_at: packet.key_dates?.published_at,
    patched_at: packet.key_dates?.patched_at,
  };
  if (packet.kev_status?.in_kev) {
    dateKeysToValidate.kev_added_at = packet.key_dates?.kev_added_at;
  }
  if (packet.key_dates && Object.values(dateKeysToValidate).some(value => value == null) && ![...uncertaintyTopics].some(topic => topic.includes('date') || topic.includes('patch'))) {
    add(errors, 'date or patch uncertainties must be documented when key dates are null', '$.uncertainties');
  }
  if (packet.exploit_status?.known_exploited === true && packet.key_dates?.exploited_before_disclosure === 'unknown' && ![...uncertaintyTopics].some(topic => topic.includes('exploit'))) {
    add(errors, 'exploitation uncertainty must be documented when exploitation timing is unknown', '$.uncertainties');
  }

  if (!Array.isArray(packet.not_supported)) add(errors, 'not_supported must be an array', '$.not_supported');
  else packet.not_supported.forEach((item, index) => {
    const path = `$.not_supported[${index}]`;
    if (!isObject(item)) {
      add(errors, 'item must be an object', path);
      return;
    }
    const hasClaim = isString(item.claim);
    if (!hasClaim) add(errors, 'claim is required', `${path}.claim`);
    if (!isString(item.reason)) add(errors, 'reason is required', `${path}.reason`);
    if (hasClaim && containsUnsupportedNote(packet, item.claim)) add(errors, 'not_supported claim appears in drafting_notes', path);
  });

  if (!Array.isArray(packet.mitre_candidates)) add(errors, 'mitre_candidates must be an array', '$.mitre_candidates');
  else packet.mitre_candidates.forEach((candidate, index) => {
    const path = `$.mitre_candidates[${index}]`;
    if (!isObject(candidate)) {
      add(errors, 'candidate must be an object', path);
      return;
    }
    if (candidate.technique_id !== null && !ATTACK_RE.test(candidate.technique_id || '')) add(errors, 'technique_id must be TXXXX, TXXXX.XXX, or null', `${path}.technique_id`);
    if (!isString(candidate.technique_name)) add(errors, 'technique_name is required', `${path}.technique_name`);
    if (!isString(candidate.tactic)) add(errors, 'tactic is required', `${path}.tactic`);
    if (!Array.isArray(candidate.source_refs)) add(errors, 'source_refs must be an array', `${path}.source_refs`);
    else validateRefs(candidate.source_refs, sourceIds, errors, `${path}.source_refs`, { allowEmpty: candidate.include_in_article === false });
    if (!CONFIDENCE.has(candidate.confidence)) add(errors, 'confidence is invalid', `${path}.confidence`);
    if (!isBool(candidate.include_in_article)) add(errors, 'include_in_article must be boolean', `${path}.include_in_article`);
    if (candidate.include_in_article === true) {
      if (!candidate.technique_id) add(errors, 'included ATT&CK candidate needs a technique_id', `${path}.technique_id`);
      if (!candidate.source_refs?.length) add(errors, 'included ATT&CK candidate needs source refs', `${path}.source_refs`);
      if (candidate.confidence === 'low') add(errors, 'low-confidence ATT&CK candidate cannot be included', `${path}.confidence`);
    }
  });

  if (!Array.isArray(packet.drafting_notes)) add(errors, 'drafting_notes must be an array', '$.drafting_notes');
  else {
    packet.drafting_notes.forEach((note, index) => {
      if (!isString(note)) add(errors, 'drafting note must be non-empty', `$.drafting_notes[${index}]`);
    });
  }

  if (!isObject(packet.preflight)) add(errors, 'preflight is required', '$.preflight');
  else {
    if (!PREFLIGHT_STATUSES.has(packet.preflight.status)) add(errors, 'preflight.status is invalid', '$.preflight.status');
    if (!Array.isArray(packet.preflight.errors)) add(errors, 'preflight.errors must be an array', '$.preflight.errors');
    if (!Array.isArray(packet.preflight.warnings)) add(errors, 'preflight.warnings must be an array', '$.preflight.warnings');
  }

  scanStrings(packet, '$', errors, warnings);

  return report(packet, errors, warnings);
}

function report(packet, errors, warnings) {
  return {
    pass: errors.length === 0,
    status: errors.length === 0 ? 'pass' : 'fail',
    errors,
    warnings,
    summary: {
      schema_version: packet?.schema_version || null,
      task_id: packet?.task_id || null,
      lane: packet?.lane || null,
      source_packet_id: packet?.source_packet_id || null,
      source_count: isObject(packet) ? allSources(packet).length : 0,
      claim_count: Array.isArray(packet?.claims) ? packet.claims.length : 0,
      uncertainty_count: Array.isArray(packet?.uncertainties) ? packet.uncertainties.length : 0,
      not_supported_count: Array.isArray(packet?.not_supported) ? packet.not_supported.length : 0,
      output_target: packet?.output_target?.file_pattern || null,
    },
  };
}

function formatMarkdown(result) {
  const lines = [
    '## Source Packet Preflight',
    '',
    result.pass ? ':white_check_mark: Preflight passed.' : `:x: Preflight failed with ${result.errors.length} error(s).`,
    '',
    `Task: ${result.summary.task_id || 'unknown'}`,
    `Packet: ${result.summary.source_packet_id || 'unknown'}`,
    `Sources: ${result.summary.source_count}`,
    `Claims: ${result.summary.claim_count}`,
    `Uncertainties: ${result.summary.uncertainty_count}`,
    `Not supported: ${result.summary.not_supported_count}`,
    `Output target: ${result.summary.output_target || 'unknown'}`,
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

  return lines.join('\n').trim() + '\n';
}

function main() {
  const args = parseArgs(process.argv);
  let packet;
  try {
    packet = readPacket(args.packet);
  } catch (error) {
    const result = report(null, [{ path: '$', message: `JSON parse/read failed: ${error.message}` }], []);
    process.stdout.write(formatMarkdown(result));
    if (args.jsonOut) writeJsonReport(args.jsonOut, result);
    process.exit(1);
  }

  const result = validatePreflight(packet);
  if (args.jsonOut) writeJsonReport(args.jsonOut, result);
  process.stdout.write(formatMarkdown(result));
  if (!result.pass) process.exit(1);
}

main();
