#!/usr/bin/env node
/**
 * Build a conservative zero-day source packet from one pipeline task JSON.
 *
 * This v0 builder is intentionally deterministic: it uses task JSON fields,
 * obvious CVE/CWE extraction, source URLs, and lightweight URL publisher
 * classification. It does not fetch sources or call a model.
 */

import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const CVE_RE = /\bCVE-\d{4}-\d{4,}\b/gi;
const CWE_RE = /\bCWE-\d+\b/gi;

function usage() {
  console.log([
    'Usage:',
    '  node scripts/build-source-packet.mjs --task <task.json> [--out <packet.json>] [--created-at <iso>]',
    '',
    'Writes the source packet to --out when provided; otherwise prints JSON to stdout.',
  ].join('\n'));
}

function parseArgs(argv) {
  const args = { task: null, out: null, createdAt: null };

  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    const next = argv[i + 1];
    switch (token) {
      case '--task':
        if (!next) throw new Error('Missing value for --task');
        args.task = next;
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

  if (!args.task) throw new Error('--task is required');
  return args;
}

function readJson(path) {
  return JSON.parse(readFileSync(resolve(ROOT, path), 'utf8'));
}

function normalizeDate(value) {
  if (typeof value !== 'string' || value.trim() === '') return null;
  const match = value.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : null;
}

function uniqueStrings(values) {
  return [...new Set(values.filter(value => typeof value === 'string' && value.trim()).map(value => value.trim()))];
}

function extractMatches(text, regex) {
  if (typeof text !== 'string') return [];
  return uniqueStrings([...text.matchAll(regex)].map(match => match[0].toUpperCase()));
}

function classifySource(url) {
  let host = '';
  try {
    host = new URL(url).hostname.toLowerCase();
  } catch {
    return { publisher: 'Other', source_type: 'other' };
  }

  if (host.endsWith('cisa.gov')) return { publisher: 'Cybersecurity and Infrastructure Security Agency', source_type: 'government' };
  if (host === 'nvd.nist.gov' || host.endsWith('.nist.gov')) return { publisher: 'National Vulnerability Database', source_type: 'database' };
  if (host.includes('microsoft.com')) return { publisher: 'Microsoft', source_type: 'vendor' };
  if (host.includes('android.com')) return { publisher: 'Android', source_type: 'vendor' };
  if (host.includes('mirasvit.com')) return { publisher: 'Mirasvit', source_type: 'vendor' };
  if (host.includes('litespeedtech.com')) return { publisher: 'LiteSpeed', source_type: 'vendor' };
  return { publisher: 'Other', source_type: 'other' };
}

function sourceIdsByType(sources, sourceTypes) {
  return sources
    .filter(source => sourceTypes.includes(source.source_type))
    .map(source => source.id);
}

function sourceRefsForClaim(sources, preferredTypes) {
  const refs = sourceIdsByType(sources, preferredTypes);
  return refs.length ? refs : sources.slice(0, 1).map(source => source.id);
}

function parseKevAdded(notes) {
  if (typeof notes !== 'string') return null;
  const match = notes.match(/CISA KEV entry added\s+(\d{4}-\d{2}-\d{2})/i);
  return match ? match[1] : null;
}

function splitPlatform(platform) {
  const value = typeof platform === 'string' && platform.trim() ? platform.trim() : 'Unknown product';
  const parts = value.split(/\s+/);
  const vendor = parts[0] || 'Unknown';
  const escapedVendor = vendor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const product = value.replace(new RegExp(`^${escapedVendor}\\s+${escapedVendor}\\s+`, 'i'), `${vendor} `);
  return { vendor, product };
}

function addClaim(claims, claim) {
  if (!claim.claim || !claim.source_refs.length) return;
  claims.push({
    claim_id: `claim-${claims.length + 1}`,
    confidence: 'high',
    ...claim,
  });
}

function buildPacket(task, createdAt) {
  if (task.type !== 'zero-day') {
    throw new Error(`Only zero-day tasks are supported by this pilot; got ${JSON.stringify(task.type)}.`);
  }

  const candidate = task.input?.candidate_data || {};
  const sourceUrls = uniqueStrings(task.input?.sources || []);
  const allText = [
    task.input?.topic,
    candidate.cve,
    ...(Array.isArray(candidate.cves) ? candidate.cves : []),
    ...(Array.isArray(candidate.cwes) ? candidate.cwes : []),
    task.input?.notes,
    ...sourceUrls,
  ].filter(Boolean).join('\n');

  const sources = sourceUrls.map((url, index) => {
    const classification = classifySource(url);
    return {
      id: `src-${index + 1}`,
      publisher: classification.publisher,
      url,
      published_at: null,
      source_type: classification.source_type,
      role: ['government', 'vendor', 'database'].includes(classification.source_type) ? 'primary' : 'supporting',
      notes: 'Source URL supplied by the pipeline task.',
    };
  });

  const primarySources = sources.filter(source => source.role === 'primary');
  const supportingSources = sources.filter(source => source.role !== 'primary');
  const governmentRefs = sourceIdsByType(sources, ['government']);
  const databaseRefs = sourceIdsByType(sources, ['database']);
  const vendorRefs = sourceIdsByType(sources, ['vendor']);
  const officialRefs = sourceRefsForClaim(sources, ['government', 'vendor', 'database']);
  const cves = uniqueStrings([
    ...(Array.isArray(candidate.cves) ? candidate.cves : []),
    candidate.cve,
    ...extractMatches(allText, CVE_RE),
  ]).map(id => ({ id: id.toUpperCase(), source_refs: sourceRefsForClaim(sources, ['database', 'government']) }));
  const cwes = uniqueStrings([
    ...(Array.isArray(candidate.cwes) ? candidate.cwes : []),
    ...extractMatches(allText, CWE_RE),
  ]).map(id => ({ id: id.toUpperCase(), name: 'Unknown', source_refs: sourceRefsForClaim(sources, ['database', 'vendor', 'government']) }));
  const { vendor, product } = splitPlatform(candidate.platform || task.input?.topic);
  const disclosedAt = normalizeDate(candidate.disclosedDate);
  const kevAddedAt = parseKevAdded(task.input?.notes);
  const claims = [];

  addClaim(claims, {
    claim: `${cves[0]?.id || 'The tracked CVE'} affects ${product}.`,
    claim_type: 'vulnerability',
    source_refs: officialRefs,
    article_section: 'summary',
  });
  addClaim(claims, {
    claim: `${product} is the affected product identified by the task source data.`,
    claim_type: 'product',
    source_refs: sourceRefsForClaim(sources, ['vendor', 'database', 'government']),
    article_section: 'frontmatter',
  });
  if (candidate.type) {
    addClaim(claims, {
      claim: `The vulnerability type is ${candidate.type}.`,
      claim_type: 'vulnerability',
      source_refs: sourceRefsForClaim(sources, ['database', 'vendor', 'government']),
      article_section: 'technical-analysis',
    });
  }
  if (disclosedAt) {
    addClaim(claims, {
      claim: `The disclosed date is ${disclosedAt}.`,
      claim_type: 'date',
      source_refs: sourceRefsForClaim(sources, ['vendor', 'database', 'government']),
      article_section: 'timeline',
    });
  }
  if (candidate.cisaKev === true) {
    addClaim(claims, {
      claim: `${cves[0]?.id || 'The vulnerability'} is listed in CISA KEV.`,
      claim_type: 'exploitation',
      source_refs: governmentRefs.length ? governmentRefs : officialRefs,
      article_section: 'summary',
    });
  }
  if (candidate.cvss?.score !== undefined || task.discovery?.cvss?.score !== undefined) {
    const cvss = candidate.cvss?.score !== undefined ? candidate.cvss : task.discovery?.cvss;
    addClaim(claims, {
      claim: `NVD CVSS severity data records a ${cvss.severity || candidate.severity || 'known'} severity score of ${cvss.score}.`,
      claim_type: 'impact',
      source_refs: databaseRefs.length ? databaseRefs : officialRefs,
      article_section: 'technical-analysis',
      confidence: 'medium',
    });
  }

  return {
    schema_version: 'source-packet/1',
    task_id: task.task_id,
    lane: 'zero-day',
    source_packet_id: `sp-${task.task_id}`,
    created_at: createdAt,
    source_packet_status: 'draft',
    output_target: {
      file_pattern: task.output?.file_pattern || null,
      branch: task.output?.branch || null,
      pr: task.output?.pr === true,
    },
    primary_sources: primarySources,
    supporting_sources: supportingSources,
    source_quality: {
      has_government_source: governmentRefs.length > 0,
      has_vendor_source: vendorRefs.length > 0,
      has_primary_source: primarySources.length > 0,
      source_sufficiency: primarySources.length > 0 ? 'sufficient' : 'insufficient',
    },
    key_dates: {
      disclosed_at: disclosedAt,
      published_at: null,
      patched_at: null,
      kev_added_at: kevAddedAt,
      exploited_before_disclosure: 'unknown',
      date_uncertainties: [
        'published_at and patched_at are not deterministically available from the task JSON.',
      ],
    },
    affected_products: [
      {
        vendor,
        product,
        versions: 'unknown',
        source_refs: sourceRefsForClaim(sources, ['vendor', 'database', 'government']),
      },
    ],
    cves,
    cwes,
    kev_status: {
      in_kev: candidate.cisaKev === true,
      source_refs: candidate.cisaKev === true ? (governmentRefs.length ? governmentRefs : officialRefs) : [],
    },
    exploit_status: {
      known_exploited: candidate.cisaKev === true,
      source_refs: candidate.cisaKev === true ? (governmentRefs.length ? governmentRefs : officialRefs) : [],
      notes: candidate.cisaKev === true ? 'Known exploitation is limited to the KEV-backed statement unless the packet is updated.' : 'No deterministic known-exploitation source was present in the task JSON.',
    },
    claims,
    uncertainties: [
      {
        topic: 'affected versions',
        reason: 'The task JSON does not include a deterministic affected-version range.',
        drafting_instruction: 'Use "affected versions were not specified in the packet" or omit version range details.',
      },
      {
        topic: 'patch status',
        reason: 'The task JSON does not include a deterministic patch date.',
        drafting_instruction: 'Do not claim patched status unless the source packet is updated with vendor evidence.',
      },
      {
        topic: 'exploit chain',
        reason: 'The task JSON supports known exploitation only when KEV is true; it does not describe exploit-chain steps.',
        drafting_instruction: 'Do not add exploit-chain mechanics beyond the packet claims.',
      },
    ],
    not_supported: [
      {
        claim: 'Threat actor attribution',
        reason: 'The task JSON does not identify an actor.',
      },
      {
        claim: 'Ransomware use',
        reason: 'The task JSON does not support ransomware use.',
      },
      {
        claim: 'Specific affected versions',
        reason: 'Affected versions are unknown in deterministic task data.',
      },
    ],
    mitre_candidates: [
      {
        technique_id: 'T1190',
        technique_name: 'Exploit Public-Facing Application',
        tactic: 'Initial Access',
        source_refs: [],
        confidence: 'low',
        include_in_article: false,
      },
    ],
    drafting_notes: [
      'Use only the claims array for factual assertions.',
      'Phrase unknown dates, versions, actors, and exploit-chain details conservatively.',
      'Do not include any not_supported claim unless the source packet is updated first.',
    ],
    preflight: {
      status: 'not_run',
      errors: [],
      warnings: [],
    },
  };
}

function main() {
  const args = parseArgs(process.argv);
  const task = readJson(args.task);
  const createdAt = args.createdAt || new Date().toISOString();
  const packet = buildPacket(task, createdAt);
  const payload = JSON.stringify(packet, null, 2) + '\n';

  if (args.out) {
    const outPath = resolve(ROOT, args.out);
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, payload);
    return;
  }

  process.stdout.write(payload);
}

main();
