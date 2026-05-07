#!/usr/bin/env node

import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join, relative, resolve } from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

import {
  getAttackEnterpriseData,
  getAttackEnterpriseTechnique,
  isPinnedAttackVersion,
  normalizeFrameworkName,
} from './framework-data.mjs';
import {
  SCHEMA_ATTACK_VERSION_PATTERN,
  SCHEMA_MITRE_TACTICS,
  SCHEMA_MITRE_TECHNIQUE_ID_PATTERN,
} from './pipeline-schema.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const CONTENT_ROOT = resolve(ROOT, 'site/src/content');
const REPORT_DATE = new Date().toISOString().slice(0, 10);
const DEFAULT_MARKDOWN_OUT = resolve(ROOT, `.github/pipeline/reports/framework-mapping-audit-${REPORT_DATE}.md`);
const FRONTMATTER_REGEX = /^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/;
const CANONICAL_ID_REGEX = new RegExp(SCHEMA_MITRE_TECHNIQUE_ID_PATTERN);
const ATTACK_VERSION_REGEX = new RegExp(SCHEMA_ATTACK_VERSION_PATTERN);

const TACTIC_SLUG_BY_NAME = new Map(
  SCHEMA_MITRE_TACTICS.map((name) => [name, name.toLowerCase().replace(/\s+/g, '-')]),
);
const TACTIC_NAME_BY_SLUG = new Map(
  SCHEMA_MITRE_TACTICS.map((name) => [name.toLowerCase().replace(/\s+/g, '-'), name]),
);

function usage() {
  console.log(`Usage:
  node scripts/audit-framework-mappings.mjs [--markdown-out <path>] [--json-out <path>]

Options:
  --markdown-out  Write a Markdown report. Defaults to ${relative(ROOT, DEFAULT_MARKDOWN_OUT)}
  --json-out      Optional path for machine-readable audit results
`);
}

function parseArgs(argv) {
  const args = {
    markdownOut: DEFAULT_MARKDOWN_OUT,
    jsonOut: null,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    } else if (arg === '--markdown-out') {
      const value = argv[++i];
      if (!value) {
        console.error('--markdown-out requires a path');
        process.exit(1);
      }
      args.markdownOut = resolve(ROOT, value);
    } else if (arg === '--json-out') {
      const value = argv[++i];
      if (!value) {
        console.error('--json-out requires a path');
        process.exit(1);
      }
      args.jsonOut = resolve(ROOT, value);
    } else {
      console.error(`Unknown argument: ${arg}`);
      usage();
      process.exit(1);
    }
  }

  return args;
}

function listContentFiles(dir = CONTENT_ROOT) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listContentFiles(fullPath));
    } else if (entry.isFile() && /\.(md|mdx)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files.sort();
}

function parseFrontmatter(filePath) {
  const content = readFileSync(filePath, 'utf8');
  const match = content.match(FRONTMATTER_REGEX);
  if (!match) {
    return { data: null, error: 'No YAML frontmatter found' };
  }

  try {
    return { data: yaml.load(match[1]) || {}, error: null };
  } catch (error) {
    return { data: null, error: `YAML parse error: ${error.message}` };
  }
}

function collectionForFile(filePath) {
  const rel = relative(CONTENT_ROOT, filePath);
  return rel.split('/')[0] || 'unknown';
}

function displayTactics(slugs) {
  return slugs.map((slug) => TACTIC_NAME_BY_SLUG.get(slug) || slug).join(', ');
}

function analyzeMapping(file, collection, mapping, index) {
  const findings = [];
  const techniqueId = normalizeFrameworkName(mapping?.techniqueId);
  const techniqueName = normalizeFrameworkName(mapping?.techniqueName);
  const tactic = normalizeFrameworkName(mapping?.tactic);
  const attackVersion = mapping?.['attack-version'] ?? mapping?.attackVersion ?? mapping?.attack_version;
  const normalizedAttackVersion = attackVersion == null ? '' : String(attackVersion).trim();
  const label = `${relative(ROOT, file)}#mitreMappings[${index}]`;

  if (!techniqueId) {
    findings.push({
      severity: 'error',
      category: 'missing-technique-id',
      label,
      collection,
      message: 'Missing techniqueId.',
    });
    return findings;
  }

  let effectiveTechniqueId = techniqueId;
  if (!CANONICAL_ID_REGEX.test(techniqueId)) {
    if (/^T\d{4}-\d{3}$/.test(techniqueId)) {
      effectiveTechniqueId = techniqueId.replace('-', '.');
      findings.push({
        severity: 'fixable',
        category: 'noncanonical-technique-id-separator',
        label,
        collection,
        techniqueId,
        recommended: effectiveTechniqueId,
        message: `Use canonical dot separator: ${effectiveTechniqueId}.`,
      });
    }
  }

  if (normalizedAttackVersion && !ATTACK_VERSION_REGEX.test(normalizedAttackVersion)) {
    findings.push({
      severity: 'error',
      category: 'invalid-attack-version',
      label,
      collection,
      techniqueId,
      attackVersion,
      message: 'attack-version must match vNN[.N].',
    });
    return findings;
  }

  if (normalizedAttackVersion && !isPinnedAttackVersion(normalizedAttackVersion)) {
    findings.push({
      severity: 'info',
      category: 'legacy-or-nonpinned-attack-version',
      label,
      collection,
      techniqueId,
      attackVersion,
      message: `Mapping declares non-pinned ATT&CK version ${JSON.stringify(attackVersion)}; v19 comparison skipped.`,
    });
    return findings;
  }

  const technique = getAttackEnterpriseTechnique(effectiveTechniqueId);
  if (!technique) {
    findings.push({
      severity: 'error',
      category: 'unknown-technique-id',
      label,
      collection,
      techniqueId: effectiveTechniqueId,
      message: `Technique ID is not present in pinned ATT&CK Enterprise ${getAttackEnterpriseData().version}.`,
    });
    return findings;
  }

  if (technique.revoked || technique.deprecated) {
    findings.push({
      severity: 'error',
      category: technique.revoked ? 'revoked-technique' : 'deprecated-technique',
      label,
      collection,
      techniqueId: effectiveTechniqueId,
      officialName: technique.name,
      message: `${effectiveTechniqueId} is ${technique.revoked ? 'revoked' : 'deprecated'} in pinned ATT&CK Enterprise ${getAttackEnterpriseData().version}.`,
    });
  }

  const officialName = normalizeFrameworkName(technique.name);
  if (techniqueName && techniqueName !== officialName) {
    findings.push({
      severity: 'fixable',
      category: 'technique-name-mismatch',
      label,
      collection,
      techniqueId: effectiveTechniqueId,
      current: techniqueName,
      recommended: officialName,
      message: `Technique name should match ATT&CK ${getAttackEnterpriseData().version}: ${officialName}.`,
    });
  }

  if (!attackVersion) {
    findings.push({
      severity: 'metadata-gap',
      category: 'missing-attack-version',
      label,
      collection,
      techniqueId: effectiveTechniqueId,
      recommended: getAttackEnterpriseData().version,
      message: `Mapping is missing attack-version metadata.`,
    });
  }

  if (!mapping?.confidence) {
    findings.push({
      severity: 'metadata-gap',
      category: 'missing-confidence',
      label,
      collection,
      techniqueId: effectiveTechniqueId,
      message: 'Mapping is missing confidence metadata.',
    });
  }

  if (!mapping?.evidence) {
    findings.push({
      severity: 'metadata-gap',
      category: 'missing-evidence',
      label,
      collection,
      techniqueId: effectiveTechniqueId,
      message: 'Mapping is missing evidence metadata.',
    });
  }

  if (tactic && technique.tactics.length > 0) {
    const tacticSlug = TACTIC_SLUG_BY_NAME.get(tactic);
    if (!tacticSlug) {
      findings.push({
        severity: 'error',
        category: 'unknown-tactic',
        label,
        collection,
        techniqueId: effectiveTechniqueId,
        current: tactic,
        message: `Tactic is not in the current schema enum.`,
      });
    } else if (!technique.tactics.includes(tacticSlug)) {
      const officialTactics = displayTactics(technique.tactics);
      findings.push({
        severity: tactic === 'Defense Evasion' ? 'review-required' : 'warning',
        category: tactic === 'Defense Evasion' ? 'v19-defense-evasion-split-candidate' : 'tactic-mismatch',
        label,
        collection,
        techniqueId: effectiveTechniqueId,
        current: tactic,
        recommended: officialTactics,
        message: `Mapped tactic "${tactic}" is not among ATT&CK ${getAttackEnterpriseData().version} tactics: ${officialTactics}.`,
      });
    }
  }

  return findings;
}

function auditCorpus() {
  const files = listContentFiles();
  const findings = [];
  let mappedFiles = 0;
  let mappingCount = 0;
  const collectionCounts = {};

  for (const file of files) {
    const collection = collectionForFile(file);
    collectionCounts[collection] = collectionCounts[collection] || { files: 0, mappedFiles: 0, mappings: 0 };
    collectionCounts[collection].files += 1;

    const parsed = parseFrontmatter(file);
    if (parsed.error) {
      findings.push({
        severity: 'error',
        category: 'frontmatter-parse-error',
        label: relative(ROOT, file),
        collection,
        message: parsed.error,
      });
      continue;
    }

    const mappings = Array.isArray(parsed.data.mitreMappings) ? parsed.data.mitreMappings : [];
    if (mappings.length > 0) {
      mappedFiles += 1;
      collectionCounts[collection].mappedFiles += 1;
    }
    mappingCount += mappings.length;
    collectionCounts[collection].mappings += mappings.length;

    for (let i = 0; i < mappings.length; i += 1) {
      findings.push(...analyzeMapping(file, collection, mappings[i], i));
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    attackVersion: getAttackEnterpriseData().version,
    source: getAttackEnterpriseData().source,
    summary: {
      files: files.length,
      mappedFiles,
      mappings: mappingCount,
      findings: findings.length,
    },
    collectionCounts,
    findingCounts: countBy(findings, 'category'),
    severityCounts: countBy(findings, 'severity'),
    findings,
  };
}

function countBy(items, key) {
  const counts = {};
  for (const item of items) {
    counts[item[key]] = (counts[item[key]] || 0) + 1;
  }
  return Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)));
}

function markdownTable(rows) {
  if (rows.length === 0) return '_None._\n';
  return [
    '| Count | Category |',
    '|---:|---|',
    ...rows.map(([category, count]) => `| ${count} | ${category} |`),
    '',
  ].join('\n');
}

function renderFindings(findings, predicate, limit = 50) {
  const selected = findings.filter(predicate);
  if (selected.length === 0) return '_None._\n';

  const rows = selected.slice(0, limit).map((finding) => (
    `| ${finding.severity} | ${finding.category} | ${finding.label} | ${finding.message.replace(/\|/g, '\\|')} |`
  ));
  const suffix = selected.length > limit
    ? `\n\n_${selected.length - limit} additional finding(s) omitted from this table; see JSON output if generated._\n`
    : '\n';

  return [
    '| Severity | Category | Location | Finding |',
    '|---|---|---|---|',
    ...rows,
    suffix,
  ].join('\n');
}

function renderMarkdown(report) {
  const sortedFindingCounts = Object.entries(report.findingCounts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const sortedSeverityCounts = Object.entries(report.severityCounts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

  return `# Framework Mapping Corpus Audit

Generated: ${report.generatedAt}

Pinned framework data:

- ATT&CK Enterprise: ${report.attackVersion}
- Source URL: ${report.source.url}
- Source SHA-256: ${report.source.sha256}

Scope:

- Report mode only. No article frontmatter was modified.
- The audit compares existing corpus mitreMappings against pinned ATT&CK Enterprise ${report.attackVersion}.
- Technique-name normalization is mechanically checkable, but tactic reclassification still needs article-supported review before content changes.
- ATLAS coverage is not migrated here; atlasMappings remain optional and should only be added when article evidence supports adversarial AI/ML behavior.

## Summary

- Content files scanned: ${report.summary.files}
- Files with MITRE mappings: ${report.summary.mappedFiles}
- MITRE mappings scanned: ${report.summary.mappings}
- Findings: ${report.summary.findings}

## Findings By Severity

${markdownTable(sortedSeverityCounts)}
## Findings By Category

${markdownTable(sortedFindingCounts)}
## Collection Coverage

| Collection | Files | Files with mappings | Mappings |
|---|---:|---:|---:|
${Object.entries(report.collectionCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([collection, counts]) => `| ${collection} | ${counts.files} | ${counts.mappedFiles} | ${counts.mappings} |`)
    .join('\n')}

## Mechanically Fixable Candidates

${renderFindings(report.findings, (finding) => finding.severity === 'fixable')}
## Review-Required ATT&CK v19 Tactic Split Candidates

${renderFindings(report.findings, (finding) => finding.severity === 'review-required')}
## Errors And Warnings

${renderFindings(report.findings, (finding) => ['error', 'warning'].includes(finding.severity))}
## Metadata Gaps

${renderFindings(report.findings, (finding) => finding.severity === 'metadata-gap', 100)}
## Recommended Next Step

Open a follow-up migration PR that applies only mechanically safe technique-name corrections first. Handle v19 tactic split candidates in a separate source-supported review pass; do not bulk-reclassify Defense Evasion mappings without checking article evidence.
`;
}

function writeOutput(filePath, content) {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const report = auditCorpus();

  if (args.markdownOut) {
    writeOutput(args.markdownOut, renderMarkdown(report));
    console.log(`Wrote ${relative(ROOT, args.markdownOut)}`);
  }

  if (args.jsonOut) {
    writeOutput(args.jsonOut, `${JSON.stringify(report, null, 2)}\n`);
    console.log(`Wrote ${relative(ROOT, args.jsonOut)}`);
  }

  console.log(JSON.stringify(report.summary));
}

main();
