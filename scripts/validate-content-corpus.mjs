#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

import {
  SCHEMA_CANONICAL_PUBLISHER_ALIASES,
  SCHEMA_GENERATED_BY_VALUES,
  SCHEMA_MITRE_TACTICS,
  SCHEMA_REQUIRED_H2_BY_TYPE,
  SCHEMA_REVIEW_STATUSES,
} from './pipeline-schema.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const SOURCE_BODY_LINE_RE = /^\s*-\s+\[(.+?):\s+(.+)\]\((https?:\/\/[^\s)]+)\)\s+([—–-])\s+(.+?),\s+(\d{4}-\d{2}-\d{2})\s*$/;
const ZERO_DAY_SEVERITY_METRICS = [
  'Exploitability',
  'Impact',
  'Weaponization Risk',
  'Patch Urgency',
  'Detection Coverage',
];
const ZERO_DAY_US_SPELLING_MAP = new Map([
  ['authorised', 'authorized'],
  ['unauthorised', 'unauthorized'],
  ['behaviour', 'behavior'],
  ['behaviours', 'behaviors'],
  ['catalogue', 'catalog'],
  ['colour', 'color'],
  ['colours', 'colors'],
  ['defence', 'defense'],
  ['defences', 'defenses'],
  ['organisation', 'organization'],
  ['organisations', 'organizations'],
  ['sanitisation', 'sanitization'],
  ['weaponisation', 'weaponization'],
  ['weaponised', 'weaponized'],
]);

function usage() {
  console.log(`Usage:
  node scripts/validate-content-corpus.mjs --files-file <path> [--new-files-file <path>] [--json-out <path>]

Options:
  --files-file      Newline-delimited file containing changed article paths
  --new-files-file  Optional newline-delimited file containing newly added article paths
  --json-out        Optional path to write machine-readable results
`);
}

function parseArgs(argv) {
  const args = {
    filesFile: null,
    newFilesFile: null,
    jsonOut: null,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--files-file') {
      args.filesFile = argv[++i] || null;
    } else if (arg === '--new-files-file') {
      args.newFilesFile = argv[++i] || null;
    } else if (arg === '--json-out') {
      args.jsonOut = argv[++i] || null;
    } else if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    } else {
      console.error(`Unknown argument: ${arg}`);
      usage();
      process.exit(1);
    }
  }

  if (!args.filesFile) {
    console.error('ERROR: --files-file is required');
    usage();
    process.exit(1);
  }

  return args;
}

function readListFile(filePath) {
  if (!filePath || !existsSync(filePath)) return [];
  return readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function normalizePublisherAlias(value) {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  return SCHEMA_CANONICAL_PUBLISHER_ALIASES[trimmed.toLowerCase()] || trimmed;
}

function normalizeSourceDateValue(value) {
  if (value instanceof Date) {
    return value.toISOString().split('T')[0];
  }
  return typeof value === 'string' ? value.trim() : String(value || '');
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { error: 'No YAML frontmatter found', data: null, body: content };
  try {
    return {
      error: null,
      data: yaml.load(match[1]) || {},
      body: content.slice(match[0].length),
    };
  } catch (error) {
    return {
      error: `YAML parse error: ${error.message}`,
      data: null,
      body: content.slice(match[0].length),
    };
  }
}

function getBodyH2Headings(body) {
  const codeBlockRegex = /```[\s\S]*?```/g;
  const bodyWithoutCodeBlocks = body.replace(codeBlockRegex, '');
  return [...bodyWithoutCodeBlocks.matchAll(/^## (.+)$/gm)].map(([, heading]) => heading.trim());
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function stripCodeBlocks(body) {
  const codeBlockRegex = /```[\s\S]*?```/g;
  return body.replace(codeBlockRegex, (match) => ' '.repeat(match.length));
}

function findH2Section(body, heading) {
  const bodyWithoutCodeBlocks = stripCodeBlocks(body);
  const headingRegex = new RegExp(`^## ${escapeRegex(heading)}\\s*$`, 'm');
  const headingMatch = headingRegex.exec(bodyWithoutCodeBlocks);
  if (!headingMatch) return null;

  const start = headingMatch.index;
  const contentStart = start + headingMatch[0].length;
  const afterHeading = body.slice(contentStart);
  const afterHeadingNoCode = bodyWithoutCodeBlocks.slice(contentStart);
  const nextH2 = afterHeadingNoCode.search(/^## /m);
  const end = nextH2 === -1 ? body.length : contentStart + nextH2;

  return {
    start,
    end,
    content: nextH2 === -1 ? afterHeading : afterHeading.slice(0, nextH2),
  };
}

function getSourcesSection(body) {
  return findH2Section(body, 'Sources & References')?.content || null;
}

function getZeroDaySeverityIssues(body) {
  const section = findH2Section(body, 'Severity Assessment');
  if (!section) return ['Missing Severity Assessment section'];

  const issues = [];
  for (const metric of ZERO_DAY_SEVERITY_METRICS) {
    const metricRegex = new RegExp(
      `^-\\s+(?:\\*\\*)?${escapeRegex(metric)}(?:\\*\\*)?:\\s*([0-9]+(?:\\.[0-9]+)?)\\s*\\/\\s*([0-9]+)\\b`,
      'mi',
    );
    const match = metricRegex.exec(section.content);
    if (!match) {
      issues.push(`${metric} missing numeric X/10 score`);
      continue;
    }

    const score = Number(match[1]);
    const denominator = Number(match[2]);
    if (denominator !== 10 || Number.isNaN(score) || score < 0 || score > 10) {
      issues.push(`${metric} uses ${match[1]}/${match[2]}, expected 0-10/10`);
    }
  }

  return issues;
}

function getZeroDayBritishSpellingIssues(body) {
  let authoredBody = body;
  const sourcesSection = findH2Section(body, 'Sources & References');
  if (sourcesSection) {
    authoredBody = `${body.slice(0, sourcesSection.start)}${' '.repeat(sourcesSection.end - sourcesSection.start)}${body.slice(sourcesSection.end)}`;
  }
  authoredBody = stripCodeBlocks(authoredBody);

  const issues = [];
  for (const [british, american] of ZERO_DAY_US_SPELLING_MAP.entries()) {
    const matches = authoredBody.match(new RegExp(`\\b${escapeRegex(british)}\\b`, 'gi')) || [];
    if (matches.length > 0) {
      issues.push(`${british} -> ${american} (${matches.length})`);
    }
  }

  return issues;
}

function parseBodySourceEntries(sourcesBody) {
  const lines = sourcesBody
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '));

  const valid = [];
  const invalid = [];

  for (const line of lines) {
    const match = line.match(SOURCE_BODY_LINE_RE);
    if (!match) {
      invalid.push(line);
      continue;
    }

    const [, linkPublisher, linkTitle, url, separator, trailingPublisher, publicationDate] = match;
    valid.push({
      raw: line,
      linkPublisher: linkPublisher.trim(),
      linkTitle: linkTitle.trim(),
      url: url.trim(),
      separator,
      trailingPublisher: trailingPublisher.trim(),
      publicationDate,
    });
  }

  return { lines, valid, invalid };
}

function detectType(file) {
  if (file.includes('/incidents/')) return 'incident';
  if (file.includes('/campaigns/')) return 'campaign';
  if (file.includes('/threat-actors/')) return 'threat-actor';
  if (file.includes('/zero-days/')) return 'zero-day';
  return 'unknown';
}

function validateFile(file, newFiles) {
  if (!existsSync(resolve(ROOT, file))) {
    return {
      file,
      type: detectType(file),
      pass: false,
      checks: [
        {
          name: 'File exists in checkout',
          pass: false,
          detail: 'Changed file was not present in the checked-out tree. Exclude deleted files before validation.',
        },
      ],
    };
  }

  const content = readFileSync(resolve(ROOT, file), 'utf8');
  const checks = [];
  let pass = true;

  const parsed = parseFrontmatter(content);
  if (parsed.error) {
    checks.push({ name: 'Frontmatter exists', pass: false, detail: parsed.error });
    return { file, type: detectType(file), checks, pass: false };
  }
  checks.push({ name: 'Frontmatter exists', pass: true });

  const fm = parsed.data;
  const body = parsed.body;
  const type = detectType(file);
  const reviewStatus = typeof fm.reviewStatus === 'string' ? fm.reviewStatus : null;
  const isNewArticle = newFiles.has(file);

  if (isNewArticle) {
    checks.push({
      name: 'reviewStatus (new article → draft_ai)',
      pass: reviewStatus === 'draft_ai',
      detail: `${reviewStatus || 'not found'} · new articles must start as draft_ai`,
    });
    if (reviewStatus !== 'draft_ai') pass = false;
  } else {
    const inEnum = SCHEMA_REVIEW_STATUSES.includes(reviewStatus);
    checks.push({
      name: 'reviewStatus (edit → any schema value)',
      pass: inEnum,
      detail: `${reviewStatus || 'not found'} · must be one of ${SCHEMA_REVIEW_STATUSES.join(' | ')}`,
    });
    if (!inEnum) pass = false;
  }

  const requiredFields = {
    incident: ['eventId', 'title', 'date', 'attackType', 'severity', 'sector', 'geography'],
    campaign: ['title', 'startDate', 'attackType', 'severity', 'sector', 'geography'],
    'threat-actor': ['name', 'affiliation', 'motivation', 'status'],
    'zero-day': ['title', 'cve', 'type', 'platform', 'severity', 'status'],
  };

  const fields = requiredFields[type] || [];
  for (const field of fields) {
    const has = fm[field] !== undefined && fm[field] !== null && fm[field] !== '';
    checks.push({ name: `Field: ${field}`, pass: has });
    if (!has) pass = false;
  }

  const generatedBy = typeof fm.generatedBy === 'string' ? fm.generatedBy.trim() : '';
  checks.push({
    name: 'generatedBy canonical value',
    pass: SCHEMA_GENERATED_BY_VALUES.includes(generatedBy),
    detail: generatedBy || 'not found',
  });
  if (!SCHEMA_GENERATED_BY_VALUES.includes(generatedBy)) pass = false;

  const requiredH2 = SCHEMA_REQUIRED_H2_BY_TYPE[type] || [];
  const actualH2 = getBodyH2Headings(body);
  const missingH2 = requiredH2.filter((heading) => !actualH2.includes(heading));
  const unexpectedH2 = actualH2.filter((heading) => !requiredH2.includes(heading));
  const duplicateH2 = actualH2.filter((heading, index) => actualH2.indexOf(heading) !== index);
  const h2Pass = missingH2.length === 0 && unexpectedH2.length === 0 && duplicateH2.length === 0;
  checks.push({
    name: 'Canonical H2 headings',
    pass: h2Pass,
    detail: h2Pass
      ? `${actualH2.length} canonical headings present`
      : [
          missingH2.length ? `missing: ${missingH2.join(', ')}` : null,
          unexpectedH2.length ? `unexpected: ${unexpectedH2.join(', ')}` : null,
          duplicateH2.length ? `duplicate: ${[...new Set(duplicateH2)].join(', ')}` : null,
        ].filter(Boolean).join(' · '),
  });
  if (!h2Pass) pass = false;

  const lines = content.split('\n');
  let blankLineIssues = 0;
  let inCodeBlock = false;
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i].startsWith('```')) inCodeBlock = !inCodeBlock;
    if (inCodeBlock) continue;
    if (lines[i].match(/^#{2,3} /) && lines[i - 1].trim() !== '' && !lines[i - 1].startsWith('---')) {
      blankLineIssues += 1;
    }
  }
  checks.push({
    name: 'EDIT-RULE-030: blank lines around headings',
    pass: blankLineIssues === 0,
    detail: blankLineIssues > 0 ? `${blankLineIssues} issue(s)` : undefined,
  });
  if (blankLineIssues > 0) pass = false;

  if (type === 'zero-day') {
    const severityIssues = getZeroDaySeverityIssues(body);
    checks.push({
      name: 'Zero-day Severity Assessment uses X/10 scale',
      pass: severityIssues.length === 0,
      detail: severityIssues.length === 0 ? 'All five severity metrics use 0-10/10' : severityIssues.join(' | '),
    });
    if (severityIssues.length > 0) pass = false;

    const spellingIssues = getZeroDayBritishSpellingIssues(body);
    checks.push({
      name: 'Zero-day authored text uses US spelling',
      pass: spellingIssues.length === 0,
      detail: spellingIssues.length === 0 ? 'No en-GB spellings detected in authored prose' : spellingIssues.join(' | '),
    });
    if (spellingIssues.length > 0) pass = false;
  }

  const mitreMappings = Array.isArray(fm.mitreMappings) ? fm.mitreMappings : [];
  checks.push({
    name: 'MITRE mappings >= 1',
    pass: mitreMappings.length >= 1,
    detail: `Found ${mitreMappings.length} in frontmatter`,
  });
  if (mitreMappings.length < 1) pass = false;

  const invalidTactics = mitreMappings
    .map((mapping) => typeof mapping?.tactic === 'string' ? mapping.tactic.trim() : null)
    .filter(Boolean)
    .filter((tactic) => !SCHEMA_MITRE_TACTICS.includes(tactic));
  checks.push({
    name: 'MITRE tactic vocabulary',
    pass: invalidTactics.length === 0,
    detail: invalidTactics.length === 0 ? 'Canonical ATT&CK tactic casing' : invalidTactics.join(', '),
  });
  if (invalidTactics.length > 0) pass = false;

  const sources = Array.isArray(fm.sources) ? fm.sources : [];
  const publisherAliasViolations = [];
  for (const source of sources) {
    if (!source?.publisher) continue;
    const canonical = normalizePublisherAlias(source.publisher);
    if (canonical !== String(source.publisher).trim()) {
      publisherAliasViolations.push(`${source.publisher} -> ${canonical}`);
    }
  }
  checks.push({
    name: 'Canonical publisher names',
    pass: publisherAliasViolations.length === 0,
    detail: publisherAliasViolations.length === 0 ? 'Canonical' : publisherAliasViolations.join(' | '),
  });
  if (publisherAliasViolations.length > 0) pass = false;

  const sourcesSection = getSourcesSection(body);
  if (!sourcesSection) {
    checks.push({
      name: 'Sources & References section',
      pass: false,
      detail: 'Missing exact "Sources & References" H2 heading',
    });
    pass = false;
  } else {
    const parsedBodySources = parseBodySourceEntries(sourcesSection);
    checks.push({
      name: 'Sources body line format',
      pass: parsedBodySources.invalid.length === 0 && parsedBodySources.lines.length > 0,
      detail: parsedBodySources.invalid.length === 0
        ? `${parsedBodySources.valid.length} formatted source line(s)`
        : parsedBodySources.invalid.slice(0, 2).join(' | '),
    });
    if (parsedBodySources.invalid.length > 0 || parsedBodySources.lines.length === 0) pass = false;

    const frontmatterUrls = sources.map((source) => source?.url).filter(Boolean);
    const bodyUrls = parsedBodySources.valid.map((source) => source.url);
    const frontmatterUrlSet = new Set(frontmatterUrls);
    const bodyUrlSet = new Set(bodyUrls);

    const missingBodyUrls = [...frontmatterUrlSet].filter((url) => !bodyUrlSet.has(url));
    const orphanBodyUrls = [...bodyUrlSet].filter((url) => !frontmatterUrlSet.has(url));
    const hasDuplicates = frontmatterUrls.length !== frontmatterUrlSet.size || bodyUrls.length !== bodyUrlSet.size;

    checks.push({
      name: 'Frontmatter/body source URL parity',
      pass: missingBodyUrls.length === 0 && orphanBodyUrls.length === 0 && !hasDuplicates,
      detail: [
        missingBodyUrls.length ? `missing in body: ${missingBodyUrls.join(', ')}` : null,
        orphanBodyUrls.length ? `missing in frontmatter: ${orphanBodyUrls.join(', ')}` : null,
        hasDuplicates ? 'duplicate URLs detected' : null,
      ].filter(Boolean).join(' · ') || `${frontmatterUrls.length}:${bodyUrls.length} matched`,
    });
    if (missingBodyUrls.length > 0 || orphanBodyUrls.length > 0 || hasDuplicates) pass = false;

    const sourceMetadataMismatches = [];
    for (const bodySource of parsedBodySources.valid) {
      const frontmatterSource = sources.find((source) => source?.url === bodySource.url);
      if (!frontmatterSource) continue;
      const canonicalPublisher = normalizePublisherAlias(frontmatterSource.publisher || '');
      const canonicalDate = normalizeSourceDateValue(frontmatterSource.publicationDate);
      if (bodySource.linkPublisher !== canonicalPublisher) {
        sourceMetadataMismatches.push(`${bodySource.url} link publisher ${bodySource.linkPublisher} != ${canonicalPublisher}`);
      }
      if (bodySource.separator !== '—') {
        sourceMetadataMismatches.push(`${bodySource.url} separator ${bodySource.separator} != —`);
      }
      if (bodySource.trailingPublisher !== canonicalPublisher) {
        sourceMetadataMismatches.push(`${bodySource.url} publisher ${bodySource.trailingPublisher} != ${canonicalPublisher}`);
      }
      if (bodySource.publicationDate !== canonicalDate) {
        sourceMetadataMismatches.push(`${bodySource.url} date ${bodySource.publicationDate} != ${canonicalDate}`);
      }
    }
    checks.push({
      name: 'Source metadata matches frontmatter',
      pass: sourceMetadataMismatches.length === 0,
      detail: sourceMetadataMismatches.length === 0 ? 'Publisher/date parity confirmed' : sourceMetadataMismatches.slice(0, 3).join(' | '),
    });
    if (sourceMetadataMismatches.length > 0) pass = false;
  }

  return { file, type, checks, pass };
}

function buildMarkdown(results) {
  let markdown = '## Pipeline Validation Report\n\n';

  if (results.length === 0) {
    markdown += '_No article files detected in this run._\n';
    return markdown;
  }

  const allPass = results.every((result) => result.pass);
  for (const result of results) {
    const icon = result.pass ? ':white_check_mark:' : ':x:';
    markdown += `### ${icon} \`${result.file}\` (${result.type || 'unknown'})\n\n`;
    markdown += '| Check | Result | Detail |\n|---|---|---|\n';
    for (const check of result.checks) {
      markdown += `| ${check.name} | ${check.pass ? ':heavy_check_mark:' : ':x:'} | ${check.detail || '-'} |\n`;
    }
    markdown += '\n';
  }

  markdown += allPass
    ? '\n**All validation checks passed.** :rocket:\n'
    : '\n**Some checks failed.** Please fix the issues above before merge.\n';

  return markdown;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const files = [...new Set(readListFile(args.filesFile))];
  const newFiles = new Set(readListFile(args.newFilesFile));
  const results = files
    .map((file) => validateFile(file, newFiles))
    .filter(Boolean);

  const allPass = results.every((result) => result.pass);
  const payload = {
    allPass,
    summary: {
      totalFiles: results.length,
      passedFiles: results.filter((result) => result.pass).length,
      failedFiles: results.filter((result) => !result.pass).length,
    },
    results,
    markdown: buildMarkdown(results),
  };

  if (args.jsonOut) {
    writeFileSync(resolve(ROOT, args.jsonOut), JSON.stringify(payload, null, 2));
  }

  console.log(payload.markdown);

  if (!allPass) {
    process.exit(1);
  }
}

main();
