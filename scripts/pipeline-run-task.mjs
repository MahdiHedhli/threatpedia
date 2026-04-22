#!/usr/bin/env node
/**
 * pipeline-run-task.mjs — Pipeline Task Runner v2
 *
 * Single source of truth for article generation. An agent reads the brief,
 * writes the article, runs validate, fixes issues, repeats until clean.
 *
 * This script does NOT call any AI API. It prepares the context for
 * an agent (Claude Code, Gemini, or a human) to execute under their
 * own subscription, then validates the result.
 *
 * Usage:
 *   node scripts/pipeline-run-task.mjs --task TASK-2026-0001           # Show task brief
 *   node scripts/pipeline-run-task.mjs --task TASK-2026-0001 --lock    # Lock task for execution
 *   node scripts/pipeline-run-task.mjs --task TASK-2026-0001 --validate # Validate output
 *   node scripts/pipeline-run-task.mjs --task TASK-2026-0001 --open-pr # Create/reuse PR, record pr_open, and push bookkeeping commit
 *   node scripts/pipeline-run-task.mjs --task TASK-2026-0001 --open-pr --pr 123 # Record an already-open PR
 *   node scripts/pipeline-run-task.mjs --list                          # List pending tasks
 *   node scripts/pipeline-run-task.mjs --list --all                    # List all tasks
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdtempSync, rmSync } from 'fs';
import { resolve, dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';
import { execSync, execFileSync } from 'child_process';
import { tmpdir } from 'os';
import yaml from 'js-yaml';

// Shared schema enums (single source of truth — see scripts/pipeline-schema.mjs).
// The validator workflow loads the same enum via its CLI. Both track the
// authoritative definitions in site/src/content.config.ts manually.
import {
  SCHEMA_CANONICAL_PUBLISHER_ALIASES,
  SCHEMA_GENERATED_BY_VALUES,
  SCHEMA_MITRE_TACTICS,
  SCHEMA_REQUIRED_H2_BY_TYPE,
  SCHEMA_REVIEW_STATUSES,
} from './pipeline-schema.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const TASKS_DIR = resolve(ROOT, '.github/pipeline/tasks');
const CONTENT_DIR = resolve(ROOT, 'site/src/content');

// ── Editorial commentary words (EDIT-RULE-030) ─────────────────────────────
const EDITORIAL_WORDS = [
  'notably', 'significantly', 'interestingly', 'importantly',
  'remarkably', 'unfortunately', 'surprisingly', 'crucially',
  'strikingly', 'alarmingly', 'disturbingly', 'fascinatingly',
  'sophisticated', 'unprecedented', 'exceptionally',
];
const EDITORIAL_RE = new RegExp(`\\b(${EDITORIAL_WORDS.join('|')})\\b`, 'gi');
const SOURCE_BODY_LINE_RE = /^\s*-\s+\[(.+?):\s+(.+)\]\((https?:\/\/[^\s)]+)\)\s+([—–-])\s+(.+?),\s+(\d{4}-\d{2}-\d{2})\s*$/;

// ── Stage-aware reviewStatus rule matching ─────────────────────────────────
// A task's acceptance.review_status is a declarative contract the validator
// honors. Forms accepted:
//
//   - string (e.g. "draft_ai")  → exact match required
//   - "*"                        → any schema-enum value
//   - array (e.g. ["draft_ai","under_review"]) → any-of (must be a schema value)
//   - missing / null             → default "draft_ai" (safe legacy fallback)
//
// See docs/PIPELINE.md "Validation rules" section.
function matchesReviewStatus(actual, rule) {
  if (rule === undefined || rule === null) rule = 'draft_ai';

  if (rule === '*') {
    return { pass: SCHEMA_REVIEW_STATUSES.includes(actual), rule };
  }
  if (Array.isArray(rule)) {
    // Elements must themselves be schema-enum values or we'd allow garbage.
    const valid = rule.filter(v => SCHEMA_REVIEW_STATUSES.includes(v));
    return { pass: valid.includes(actual), rule };
  }
  if (typeof rule === 'string') {
    return { pass: actual === rule, rule };
  }
  // Unknown rule shape — be strict and reject.
  return { pass: false, rule };
}

function formatReviewStatusRule(rule) {
  if (rule === undefined || rule === null) rule = 'draft_ai';
  if (rule === '*') return `any schema-enum value (${SCHEMA_REVIEW_STATUSES.join(' | ')})`;
  if (Array.isArray(rule)) {
    const valid = rule.filter(v => SCHEMA_REVIEW_STATUSES.includes(v));
    return valid.length === 0 ? 'NONE (invalid rule — no schema-enum values listed)' : `one of: ${valid.join(' | ')}`;
  }
  if (typeof rule === 'string') return `must be "${rule}"`;
  return `unknown rule shape: ${JSON.stringify(rule)}`;
}

// ── Source object schema reference ──────────────────────────────────────────
const SOURCE_SCHEMA = `  Each source object requires:
    url: string (valid URL)
    publisher: string (organization name)
    publisherType: enum — government | vendor | media | research | community
    reliability: enum — R1 (confirmed) | R2 (probably true) | R3 (possibly true) | R4 (doubtful)
    publicationDate: string (REQUIRED, ISO 8601) — for living resources (MITRE ATT&CK, NVD), use last-modified date or access date
    accessDate: string (optional, ISO 8601)
    archived: boolean (default false)
    archiveUrl: string (optional, valid URL)`;

// ── Schemas per content type ────────────────────────────────────────────────
const SCHEMAS = {
  incident: {
    dir: 'incidents',
    frontmatterSpec: `YAML frontmatter fields (all required unless marked optional):
  eventId: string — format TP-YYYY-NNNN (YYYY = event year, NNNN = next available)
  title: string — concise incident name, max 80 chars
  date: date — ISO 8601 YYYY-MM-DD (date incident occurred)
  attackType: string — Data Breach, Ransomware, Espionage, Sabotage, Supply Chain, DDoS, Financial, etc.
  severity: enum — critical | high | medium | low
  sector: string — Energy & Utilities, Financial Services, Government, Healthcare, Technology, etc.
  geography: string — country or region
  threatActor: string (optional, default "Unknown")
  attributionConfidence: enum (optional, default A4) — A1 (confirmed by government) through A6 (unknown)
  reviewStatus: constrained by task acceptance (see ACCEPTANCE CRITERIA below)
  confidenceGrade: enum (optional, default C) — A through F
  generatedBy: string — your agent identity (e.g., "dangermouse-bot", "penfold-bot")
  generatedDate: date — today's date ISO 8601
  cves: array of strings (optional)
  relatedSlugs: array of strings (optional) — slugs of related articles for cross-referencing
  tags: array of strings — lowercase, hyphenated keywords
  sources: array of structured source objects — MINIMUM 3, at least 1 government source
${SOURCE_SCHEMA}
  mitreMappings: array of MITRE ATT&CK mapping objects — MINIMUM 1
    Each mapping requires:
      techniqueId: string (e.g., "T1566.001")
      techniqueName: string (e.g., "Phishing: Spearphishing Attachment")
      tactic: string (optional, e.g., "Initial Access")
      notes: string (optional, context for this article)`,
    bodySpec: `Required H2 sections (minimum 5):
  ## Summary — 2-3 paragraphs: what happened, who was affected, scope
  ## Technical Analysis — attack mechanism, tools used, vulnerability details
  ## Attack Chain — step-by-step using ### Stage N: Title format
  ## Impact Assessment — quantified damage, systems affected, financial cost
  ## Attribution — evidence basis, confidence level, government statements
  ## Timeline — chronological using ### YYYY-MM-DD — Event format
  ## Remediation & Mitigation — patches, defensive measures, lessons learned
  ## Sources & References — each source as a markdown hyperlink: [Publisher: Title](url). Must match frontmatter sources array. Example: - [CISA: Alert AA21-356A](https://www.cisa.gov/...) — CISA, 2021-12-22`,
    requiredFields: ['eventId', 'title', 'date', 'attackType', 'severity', 'sector', 'geography', 'reviewStatus', 'generatedBy', 'generatedDate'],
    idField: 'eventId',
    idPattern: /^TP-\d{4}-\d{4}$/,
  },
  campaign: {
    dir: 'campaigns',
    frontmatterSpec: `YAML frontmatter fields:
  campaignId: string — format TP-CAMP-YYYY-NNNN
  title: string
  startDate: date — ISO 8601
  endDate: date (optional)
  ongoing: boolean (default false)
  attackType: string
  severity: enum — critical | high | medium | low
  sector: string
  geography: string
  threatActor: string (optional, default "Unknown")
  attributionConfidence: enum (optional, default A4) — A1 through A6
  reviewStatus: constrained by task acceptance (see ACCEPTANCE CRITERIA below)
  confidenceGrade: enum (optional, default C) — A through F
  generatedBy: string — your agent identity
  generatedDate: date — today's date
  cves: array of strings (optional)
  relatedIncidents: array of strings (optional) — incident slugs; campaigns should reference confirmed constituent incidents where available
  tags: array of strings
  sources: array of structured source objects — MINIMUM 3, at least 1 government source
${SOURCE_SCHEMA}
  mitreMappings: array of MITRE ATT&CK mapping objects — MINIMUM 1`,
    bodySpec: `Required H2 sections (minimum 6):
  ## Executive Summary — campaign overview, objectives, scope, current status
  ## Technical Analysis — tools, techniques, infrastructure, operator workflow
  ## Attack Chain — multi-stage breakdown using ### Stage N: Title format
  ## MITRE ATT&CK Mapping — campaign-level techniques grouped by tactic using ### headings
  ## Timeline — key events chronologically using ### YYYY-MM-DD — Event format
  ## Remediation & Mitigation — defensive guidance and hardening steps
  ## Sources & References — each source as a markdown hyperlink: [Publisher: Title](url). Must match frontmatter sources array.`,
    requiredFields: ['campaignId', 'title', 'startDate', 'attackType', 'severity', 'sector', 'geography', 'reviewStatus', 'generatedBy', 'generatedDate'],
    idField: 'campaignId',
    idPattern: /^TP-CAMP-\d{4}-\d{4}$/,
  },
  'threat-actor': {
    dir: 'threat-actors',
    frontmatterSpec: `YAML frontmatter fields:
  name: string — primary name (e.g., "APT28")
  aliases: array of strings — all known aliases
  affiliation: string — nation-state or "Unknown"
  motivation: string — Espionage, Financial, Hacktivism, Sabotage, etc.
  status: enum — active | inactive | unknown
  country: string (optional)
  firstSeen: string (optional) — year or date
  lastSeen: string (optional) — year or date
  targetSectors: array of strings
  targetGeographies: array of strings
  tools: array of strings — known malware and tools
  mitreMappings: array of MITRE ATT&CK mapping objects — MINIMUM 3
    Each mapping requires:
      techniqueId: string
      techniqueName: string
      tactic: string (optional)
      notes: string (optional)
  attributionConfidence: enum (optional) — A1 through A6
  attributionRationale: string (optional, max 500 chars)
  reviewStatus: constrained by task acceptance (see ACCEPTANCE CRITERIA below)
  generatedBy: string — your agent identity
  generatedDate: date — today's date
  tags: array of strings
  sources: array of structured source objects — MINIMUM 3, at least 1 government source
${SOURCE_SCHEMA}`,
    bodySpec: `Required H2 sections (minimum 5):
  ## Executive Summary — group overview, significance, primary mandate
  ## Notable Campaigns — key operations with dates and targets
  ## Technical Capabilities — malware families, C2 infrastructure, exploitation patterns
  ## Attribution — evidence basis, government indictments, vendor assessments
  ## MITRE ATT&CK Profile — key techniques with operational context
  ## Sources & References — each source as a markdown hyperlink: [Publisher: Title](url). Must match frontmatter sources array.`,
    requiredFields: ['name', 'aliases', 'affiliation', 'motivation', 'status', 'reviewStatus', 'generatedBy', 'generatedDate'],
    idField: null,
    idPattern: null,
  },
  'zero-day': {
    dir: 'zero-days',
    frontmatterSpec: `YAML frontmatter fields:
  exploitId: string (optional) — format TP-EXP-YYYY-NNNN
    YYYY precedence: CVE year > disclosure year > current year
  title: string — vulnerability name including CVE
  cve: string — CVE-YYYY-NNNNN format (required)
  type: string — Remote Code Execution, Privilege Escalation, Auth Bypass, etc.
  platform: string — affected software with version range
  severity: enum — critical | high | medium | low
  status: enum — active | patched | mitigated | unknown
  isZeroDay: boolean (default true)
  disclosedDate: date (optional) — when publicly disclosed
  patchDate: date (optional) — when patch was released
  researcher: string (optional) — who discovered it
  confirmedBy: string (optional) — e.g., CISA, Microsoft
  daysInTheWild: number or null (optional) — days between first exploitation and patch
  cisaKev: boolean (default false) — whether in CISA KEV catalog
  reviewStatus: constrained by task acceptance (see ACCEPTANCE CRITERIA below)
  generatedBy: string — your agent identity
  generatedDate: date — today's date
  relatedIncidents: array of strings (optional) — slugs of incident articles
  relatedActors: array of strings (optional) — slugs of threat actor articles
  tags: array of strings
  sources: array of structured source objects — MINIMUM 3, at least 1 government source
${SOURCE_SCHEMA}
  mitreMappings: array of MITRE ATT&CK mapping objects — MINIMUM 1
    Each mapping requires:
      techniqueId: string
      techniqueName: string
      tactic: string (optional)
      notes: string (optional)`,
    bodySpec: `Required H2 sections (minimum 5):
  ## Severity Assessment — Exploitability, Impact, Weaponization Risk, Patch Urgency, Detection Coverage (scored X/10)
  ## Summary — what the vulnerability is, scope of affected systems, significance
  ## Exploit Chain — step-by-step using ### Stage N: Title format
  ## Detection Guidance — network signatures, host indicators, log patterns
  ## Indicators of Compromise — network, log, and host indicators
  ## Disclosure Timeline — chronological using ### YYYY-MM-DD — Event format
  ## Sources & References — each source as a markdown hyperlink: [Publisher: Title](url). Must match frontmatter sources array.`,
    requiredFields: ['title', 'cve', 'type', 'platform', 'severity', 'reviewStatus', 'generatedBy', 'generatedDate'],
    idField: 'exploitId',
    idPattern: /^TP-EXP-\d{4}-\d{4}$/,
  },
};

// ── RULES (printed in brief, enforced in validate) ──────────────────────────
// Rule #1 (reviewStatus) is stage-aware and rendered from the specific task's
// acceptance.review_status. See matchesReviewStatus() / formatReviewStatusRule().
function buildRules(task) {
  const acceptance = getAcceptance(task);
  const rsRule = acceptance.review_status;
  return `
  CRITICAL RULES — the validator enforces ALL of these:

  1. reviewStatus: ${formatReviewStatusRule(rsRule)}
  2. generatedBy MUST be one of the canonical agent identities (${SCHEMA_GENERATED_BY_VALUES.join(', ')})
  3. sources MUST be structured objects in frontmatter (not just prose in body)
     — Minimum 3 source objects
     — At least 1 must have publisherType: "government"
     — URLs must be real and verifiable (never fabricate)
     — Every source MUST have a publicationDate (for living resources like MITRE ATT&CK or NVD, use last-modified or access date)
  4. mitreMappings MUST be in frontmatter (not just mentioned in body text)
  5. EDIT-RULE-030: Do NOT use editorial commentary words:
     ${EDITORIAL_WORDS.join(', ')}
  6. Every H2 heading must have a blank line before it
  7. exploitId format is TP-EXP-YYYY-NNNN (year-namespaced per ADR 0007)
  8. H2 headings must match the canonical set for ${task.type}: ${(SCHEMA_REQUIRED_H2_BY_TYPE[task.type] || []).join(' | ')}
  9. Sources & References body section must use markdown hyperlinks that exactly match frontmatter:
     — Format: - [Publisher: Title](https://...) — Publisher, YYYY-MM-DD
     — Every frontmatter source URL must appear in the body exactly once
     — No orphan sources: every body source entry must have a matching frontmatter source object
     — No plain-text sources: every body entry must be a markdown hyperlink
  10. MITRE tactic casing must use the canonical ATT&CK vocabulary
  11. Canonical publisher aliases must be normalized in frontmatter and body
  12. The Astro build must pass: cd site && npm run build`;
}

// ── CLI Parsing ─────────────────────────────────────────────────────────────
function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = { taskId: null, action: 'brief', all: false, file: null, prNumber: null, usedDeprecatedComplete: false };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--task' && args[i + 1]) parsed.taskId = args[++i];
    if (args[i] === '--lock') parsed.action = 'lock';
    if (args[i] === '--validate') parsed.action = 'validate';
    if (args[i] === '--open-pr') parsed.action = 'open-pr';
    if (args[i] === '--complete') {
      parsed.action = 'open-pr';
      parsed.usedDeprecatedComplete = true;
    }
    if (args[i] === '--list') parsed.action = 'list';
    if (args[i] === '--all') parsed.all = true;
    if (args[i] === '--file' && args[i + 1]) parsed.file = args[++i];
    if (args[i] === '--pr' && args[i + 1]) parsed.prNumber = Number(args[++i]);
  }

  return parsed;
}

// ── Load / save task ────────────────────────────────────────────────────────
function loadTask(taskId) {
  const filePath = resolve(TASKS_DIR, `${taskId}.json`);
  if (!existsSync(filePath)) {
    console.error(`  ERROR: Task file not found: ${filePath}`);
    process.exit(1);
  }
  return { data: JSON.parse(readFileSync(filePath, 'utf8')), path: filePath };
}

function saveTask(task, filePath) {
  task.updated = new Date().toISOString();
  writeFileSync(filePath, JSON.stringify(task, null, 2) + '\n');
}

/** Safe accessor for acceptance_criteria (handles both old and new key names) */
function getAcceptance(task) {
  return task.acceptance_criteria || task.acceptance || {
    min_sources: 3,
    min_h2_sections: 5,
    min_mitre_mappings: 1,
    review_status: 'draft_ai',
    frontmatter_valid: true,
    astro_build: true,
  };
}

function parseFrontmatter(content) {
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!fmMatch) {
    return { data: null, raw: null, body: content, error: 'Missing frontmatter (must start with ---)' };
  }

  try {
    return {
      data: yaml.load(fmMatch[1]) || {},
      raw: fmMatch[1],
      body: content.slice(fmMatch[0].length),
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      raw: fmMatch[1],
      body: content.slice(fmMatch[0].length),
      error: `Frontmatter YAML invalid: ${error.message}`,
    };
  }
}

function normalizePublisherAlias(value) {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  return SCHEMA_CANONICAL_PUBLISHER_ALIASES[trimmed.toLowerCase()] || trimmed;
}

function findCanonicalCaseMatch(value, allowedValues) {
  if (typeof value !== 'string') return null;
  const lower = value.trim().toLowerCase();
  return allowedValues.find(entry => entry.toLowerCase() === lower) || null;
}

function getBodyH2Headings(body) {
  return [...body.matchAll(/^## (.+)$/gm)].map(([, heading]) => heading.trim());
}

function getSourcesSection(body) {
  const headingMatch = body.match(/^## Sources & References\s*$/m);
  if (!headingMatch) return null;
  const start = body.indexOf(headingMatch[0]);
  const afterHeading = body.slice(start + headingMatch[0].length);
  const nextH2 = afterHeading.search(/^## /m);
  return nextH2 === -1 ? afterHeading : afterHeading.slice(0, nextH2);
}

function parseBodySourceEntries(sourcesBody) {
  const lines = sourcesBody
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('- '));

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

function loadPullRequest(prNumber) {
  if (!Number.isInteger(prNumber) || prNumber <= 0) {
    console.error('  ERROR: --pr must be a positive integer PR number');
    process.exit(1);
  }

  try {
    const raw = execFileSync(
      'gh',
      ['pr', 'view', String(prNumber), '--json', 'number,state,isDraft,headRefName,baseRefName,url'],
      { encoding: 'utf8', cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] }
    );
    return JSON.parse(raw);
  } catch (error) {
    const stderr = error.stderr ? error.stderr.toString().trim() : error.message;
    console.error(`  ERROR: Could not verify PR #${prNumber} via gh: ${stderr}`);
    console.error('  Open the PR first and ensure GitHub auth is available before recording PR state.');
    process.exit(1);
  }
}

function normalizeSourceDateValue(value) {
  if (value instanceof Date) {
    return value.toISOString().split('T')[0];
  }

  return typeof value === 'string' ? value.trim() : String(value || '');
}

function getCurrentBranchName() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8', cwd: ROOT }).trim();
  } catch (error) {
    const stderr = error.stderr ? error.stderr.toString().trim() : error.message;
    console.error(`  ERROR: Could not determine the current git branch: ${stderr}`);
    process.exit(1);
  }
}

function ensureTaskBranchCheckedOut(task) {
  const currentBranch = getCurrentBranchName();
  if (currentBranch !== task.output.branch) {
    console.error(`  ERROR: Current branch is ${currentBranch}, expected ${task.output.branch}`);
    console.error('  Switch to the task branch before running --open-pr.');
    process.exit(1);
  }
}

function normalizeStatusPath(pathValue) {
  return pathValue.includes(' -> ') ? pathValue.split(' -> ').pop().trim() : pathValue.trim();
}

function ensureNoUnexpectedTrackedWorktreeDrift(filePath) {
  const allowedDirtyPaths = new Set([relative(ROOT, filePath)]);

  try {
    const status = execSync('git status --porcelain --untracked-files=no', {
      encoding: 'utf8',
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();

    const unexpected = status
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .filter(line => {
        const pathValue = normalizeStatusPath(line.slice(3));
        return !allowedDirtyPaths.has(pathValue);
      });

    if (unexpected.length > 0) {
      console.error('  ERROR: Refusing to open or record a PR with unrelated tracked local changes still pending.');
      console.error(`  Allowed dirty path during --open-pr: ${[...allowedDirtyPaths].join(', ')}`);
      unexpected.slice(0, 5).forEach(line => console.error(`    ${line}`));
      if (unexpected.length > 5) {
        console.error(`    ...and ${unexpected.length - 5} more`);
      }
      console.error('  Commit or stash the unrelated tracked changes first so the PR reflects a stable snapshot.');
      process.exit(1);
    }
  } catch (error) {
    const stderr = error.stderr ? error.stderr.toString().trim() : error.message;
    console.error(`  ERROR: Could not inspect git status: ${stderr}`);
    process.exit(1);
  }
}

function ensureBranchPushed(task) {
  let upstream;
  try {
    upstream = execSync('git rev-parse --abbrev-ref --symbolic-full-name @{upstream}', {
      encoding: 'utf8',
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
  } catch (error) {
    const stderr = error.stderr ? error.stderr.toString().trim() : error.message;
    console.error(`  ERROR: Task branch ${task.output.branch} is not tracking a pushed remote branch yet: ${stderr}`);
    console.error(`  Push it first with: git push -u origin ${task.output.branch}`);
    process.exit(1);
  }

  const expectedUpstream = `origin/${task.output.branch}`;
  if (upstream !== expectedUpstream) {
    console.error(`  ERROR: Task branch upstream is ${upstream}, expected ${expectedUpstream}`);
    console.error(`  Push it first with: git push -u origin ${task.output.branch}`);
    process.exit(1);
  }

  try {
    const [aheadRaw, behindRaw] = execSync('git rev-list --left-right --count HEAD...@{upstream}', {
      encoding: 'utf8',
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim().split(/\s+/);
    const ahead = Number(aheadRaw || 0);
    const behind = Number(behindRaw || 0);

    if (ahead !== 0 || behind !== 0) {
      console.error(`  ERROR: Branch ${task.output.branch} is not in sync with ${expectedUpstream} (ahead ${ahead}, behind ${behind}).`);
      console.error('  Push and/or rebase first so the PR is created from the exact validated commit.');
      process.exit(1);
    }
  } catch (error) {
    const stderr = error.stderr ? error.stderr.toString().trim() : error.message;
    console.error(`  ERROR: Could not verify upstream sync for ${task.output.branch}: ${stderr}`);
    process.exit(1);
  }
}

function ensureArticleTracked(articleFile) {
  const relativeFile = relative(ROOT, articleFile);
  try {
    execFileSync('git', ['ls-files', '--error-unmatch', relativeFile], {
      cwd: ROOT,
      stdio: ['ignore', 'ignore', 'pipe'],
    });
  } catch {
    console.error(`  ERROR: Article file ${relativeFile} is not tracked by git yet.`);
    console.error('  Add, commit, and push the article before opening or recording the PR.');
    process.exit(1);
  }
}

function findExistingOpenPullRequest(task) {
  try {
    const raw = execFileSync(
      'gh',
      ['pr', 'list', '--head', task.output.branch, '--base', 'main', '--state', 'open', '--json', 'number,state,isDraft,headRefName,baseRefName,url'],
      { encoding: 'utf8', cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] }
    );
    const pulls = JSON.parse(raw);

    if (pulls.length > 1) {
      console.error(`  ERROR: Found ${pulls.length} open PRs for branch ${task.output.branch}.`);
      console.error('  Resolve the duplicate PR state manually before running --open-pr again.');
      process.exit(1);
    }

    return pulls[0] || null;
  } catch (error) {
    const stderr = error.stderr ? error.stderr.toString().trim() : error.message;
    console.error(`  ERROR: Could not inspect open PRs for ${task.output.branch}: ${stderr}`);
    console.error('  Ensure GitHub auth is available before opening or recording PR state.');
    process.exit(1);
  }
}

function buildPullRequestTitle(task) {
  const topic = String(task.input?.topic || task.task_id).replace(/\s+/g, ' ').trim();
  const prefix = `feat(pipeline): ${task.task_id} — `;
  const maxTopicLength = 118 - prefix.length;
  const trimmedTopic = topic.length > maxTopicLength
    ? `${topic.slice(0, Math.max(maxTopicLength - 3, 0)).trim()}...`
    : topic;
  return `${prefix}${trimmedTopic}`;
}

function buildPullRequestBody(task, articleFile) {
  const acceptance = getAcceptance(task);
  const relativeFile = relative(ROOT, articleFile);
  const topic = String(task.input?.topic || task.task_id).trim();

  return [
    '## Pipeline Task',
    '',
    `- Task: \`${task.task_id}\``,
    `- Type: \`${task.type}\``,
    `- Topic: ${topic}`,
    `- Output file: \`${relativeFile}\``,
    '',
    '## Validation',
    '',
    `- Local validator: \`node scripts/pipeline-run-task.mjs --task ${task.task_id} --validate\``,
    `- Minimum sources: \`${acceptance.min_sources ?? 3}\``,
    `- Minimum H2 sections: \`${acceptance.min_h2_sections ?? 5}\``,
    `- Minimum MITRE mappings: \`${acceptance.min_mitre_mappings ?? 1}\``,
    '',
    'Opened via the one-step pipeline wrapper so PR creation and task-state recording stay in sync.',
    '',
  ].join('\n');
}

function createPullRequest(task, articleFile) {
  const tempDir = mkdtempSync(join(tmpdir(), 'threatpedia-pr-'));
  const bodyFile = join(tempDir, 'body.md');
  writeFileSync(bodyFile, buildPullRequestBody(task, articleFile));

  try {
    execFileSync(
      'gh',
      ['pr', 'create', '--base', 'main', '--head', task.output.branch, '--title', buildPullRequestTitle(task), '--body-file', bodyFile],
      { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] }
    );
  } catch (error) {
    const stderr = error.stderr ? error.stderr.toString().trim() : error.message;
    console.error(`  ERROR: Could not create a PR for ${task.output.branch}: ${stderr}`);
    console.error('  If the PR already exists, rerun --open-pr --pr <number> or fix GitHub auth and try again.');
    process.exit(1);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }

  const created = findExistingOpenPullRequest(task);
  if (!created) {
    console.error(`  ERROR: gh reported success but no open PR was found for ${task.output.branch}.`);
    process.exit(1);
  }
  return created;
}

function findOpenPipelineIssues(taskId) {
  try {
    const raw = execFileSync(
      'gh',
      ['issue', 'list', '--state', 'open', '--label', 'pipeline/ready', '--limit', '200', '--json', 'number,title,body,url'],
      { encoding: 'utf8', cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] }
    );
    const issues = JSON.parse(raw);
    return issues.filter(issue =>
      String(issue.title || '').includes(`[PIPELINE] ${taskId}:`) ||
      String(issue.body || '').includes(`## Pipeline Task: \`${taskId}\``)
    );
  } catch (error) {
    const stderr = error.stderr ? error.stderr.toString().trim() : error.message;
    console.warn(`  WARNING: Could not inspect open pipeline issues for ${taskId}: ${stderr}`);
    return [];
  }
}

function closeOpenPipelineIssues(task, prNumber) {
  const issues = findOpenPipelineIssues(task.task_id);
  if (issues.length === 0) return;

  for (const issue of issues) {
    try {
      execFileSync(
        'gh',
        [
          'issue',
          'close',
          String(issue.number),
          '--reason', 'completed',
          '--comment', `Closing automatically because ${task.task_id} moved to PR #${prNumber}.`,
        ],
        { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] }
      );
      console.log(`  Closed pipeline issue #${issue.number}: ${issue.url}`);
    } catch (error) {
      const stderr = error.stderr ? error.stderr.toString().trim() : error.message;
      console.warn(`  WARNING: Could not close pipeline issue #${issue.number} for ${task.task_id}: ${stderr}`);
    }
  }
}

function assertPullRequestMatchesTask(task, pr) {
  if (pr.state !== 'OPEN') {
    console.error(`  ERROR: PR #${pr.number} is not open (state: ${pr.state})`);
    process.exit(1);
  }
  if (pr.baseRefName !== 'main') {
    console.error(`  ERROR: PR #${pr.number} targets ${pr.baseRefName}, expected main`);
    process.exit(1);
  }
  if (pr.headRefName !== task.output.branch) {
    console.error(`  ERROR: PR #${pr.number} head branch is ${pr.headRefName}, expected ${task.output.branch}`);
    process.exit(1);
  }
}

function commitAndPushTaskState(task, filePath, prNumber) {
  const relativeTaskPath = relative(ROOT, filePath);
  try {
    execFileSync('git', ['add', relativeTaskPath], { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] });
    execFileSync('git', ['commit', '-m', `chore(pipeline): record ${task.task_id} PR #${prNumber}`], {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    execFileSync('git', ['push'], { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (error) {
    const stderr = error.stderr ? error.stderr.toString().trim() : error.message;
    console.error(`  ERROR: PR #${prNumber} exists, but the task-state bookkeeping commit could not be pushed: ${stderr}`);
    console.error(`  Recover by committing ${relativeTaskPath} and pushing ${task.output.branch}.`);
    process.exit(1);
  }
}

// ── List tasks ──────────────────────────────────────────────────────────────
function listTasks(showAll) {
  if (!existsSync(TASKS_DIR)) {
    console.log('  No tasks directory found.');
    return;
  }

  const files = readdirSync(TASKS_DIR).filter(f => f.endsWith('.json'));
  if (files.length === 0) {
    console.log('  No tasks in queue.');
    return;
  }

  const tasks = files.map(f => JSON.parse(readFileSync(resolve(TASKS_DIR, f), 'utf8')));
  const filtered = showAll ? tasks : tasks.filter(t => t.status === 'pending');

  console.log(`\n  Threatpedia Pipeline — ${filtered.length} task(s)${showAll ? ' (all)' : ' (pending)'}\n`);
  console.log(`  ${'ID'.padEnd(16)} ${'Type'.padEnd(14)} ${'Priority'.padEnd(10)} ${'Status'.padEnd(10)} Topic`);
  console.log(`  ${'─'.repeat(16)} ${'─'.repeat(14)} ${'─'.repeat(10)} ${'─'.repeat(10)} ${'─'.repeat(40)}`);

  const priorityOrder = { P0: 0, P1: 1, P2: 2, P3: 3 };
  filtered
    .sort((a, b) => (priorityOrder[a.priority] ?? 9) - (priorityOrder[b.priority] ?? 9))
    .forEach(t => {
      const topic = t.input?.topic?.substring(0, 50) || '(no topic)';
      console.log(`  ${t.task_id.padEnd(16)} ${t.type.padEnd(14)} ${t.priority.padEnd(10)} ${t.status.padEnd(10)} ${topic}`);
    });

  console.log();
}

// ── Show task brief ─────────────────────────────────────────────────────────
function showBrief(task) {
  const schema = SCHEMAS[task.type];
  if (!schema) {
    console.error(`  ERROR: Unknown type "${task.type}"`);
    process.exit(1);
  }

  const acceptance = getAcceptance(task);
  const sources = (task.input.sources || []).map(s => `  - ${s}`).join('\n') || '  (none provided — agent must research)';
  const candidate = task.input.candidate_data
    ? Object.entries(task.input.candidate_data).map(([k, v]) => `  ${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join('\n')
    : '  (none)';

  const history = (task.history || []);
  const created = history.find(h => h.action === 'created');

  console.log(`
╔══════════════════════════════════════════════════════════════════════════════╗
║  PIPELINE TASK BRIEF: ${task.task_id.padEnd(54)}║
╚══════════════════════════════════════════════════════════════════════════════╝

  Task ID:    ${task.task_id}
  Type:       ${task.type}
  Priority:   ${task.priority}
  Status:     ${task.status}
  Created:    ${created ? `${created.agent} on ${created.timestamp}` : 'unknown'}

── TOPIC ──────────────────────────────────────────────────────────────────────

  ${task.input.topic}

── SOURCE URLs (starting points for research) ────────────────────────────────

${sources}

── CANDIDATE DATA ─────────────────────────────────────────────────────────────

${candidate}

${task.input.notes ? `── NOTES ──────────────────────────────────────────────────────────────────────\n\n  ${task.input.notes}\n` : ''}
── FRONTMATTER SCHEMA ─────────────────────────────────────────────────────────

${schema.frontmatterSpec}

── BODY STRUCTURE ─────────────────────────────────────────────────────────────

${schema.bodySpec}

── ACCEPTANCE CRITERIA ────────────────────────────────────────────────────────

  frontmatter_valid:     ${acceptance.frontmatter_valid ?? true}
  min_sources:           ${acceptance.min_sources ?? 3} (structured objects in frontmatter, ≥1 government)
  min_h2_sections:       ${acceptance.min_h2_sections ?? 5}
  min_mitre_mappings:    ${acceptance.min_mitre_mappings ?? 1}
  review_status:         ${formatReviewStatusRule(acceptance.review_status)}
  edit_rule_030:         no editorial commentary words
  astro_build:           must pass
${buildRules(task)}

── OUTPUT ─────────────────────────────────────────────────────────────────────

  File:   ${task.output.file_pattern}
  Branch: ${task.output.branch}

── EXECUTION STEPS ────────────────────────────────────────────────────────────

  1. Lock the task:    node scripts/pipeline-run-task.mjs --task ${task.task_id} --lock
  2. Create branch:    git checkout -b ${task.output.branch}
  3. Write article:    ${task.output.file_pattern}
     → Follow the frontmatter schema and body structure above
     → Include structured source objects in frontmatter (not just body text)
     → Include MITRE ATT&CK mappings in frontmatter mitreMappings array
     → Ensure all acceptance criteria are met
  4. Validate:         node scripts/pipeline-run-task.mjs --task ${task.task_id} --validate
  5. Fix any issues and re-validate until ALL CHECKS PASSED
  6. Commit & push:    git add . && git commit && git push -u origin ${task.output.branch}
  7. Open + record PR: node scripts/pipeline-run-task.mjs --task ${task.task_id} --open-pr
     → Creates (or reuses) the PR, records status: pr_open, commits the task JSON, and pushes the bookkeeping update

══════════════════════════════════════════════════════════════════════════════`);
}

// ── Lock task ───────────────────────────────────────────────────────────────
function lockTask(task, filePath) {
  if (task.status === 'locked') {
    console.error(`  Task ${task.task_id} is already locked by ${task.locked_by} since ${task.locked_at}`);
    process.exit(1);
  }
  if (task.status !== 'pending') {
    console.error(`  Task ${task.task_id} cannot be locked (status: ${task.status})`);
    process.exit(1);
  }

  let lockOwner = 'unknown';
  try { lockOwner = execSync('git config user.name', { encoding: 'utf8' }).trim(); } catch {}

  task.status = 'locked';
  task.locked_by = lockOwner;
  task.locked_at = new Date().toISOString();
  task.history = task.history || [];
  task.history.push({
    timestamp: new Date().toISOString(),
    from: 'pending',
    to: 'locked',
    agent: lockOwner,
    note: 'Locked for execution',
  });

  saveTask(task, filePath);
  console.log(`  Locked ${task.task_id} for ${lockOwner}`);
  console.log(`  Branch: ${task.output.branch}`);
  console.log(`  Run: git checkout -b ${task.output.branch}`);
}

// ── Find article file ───────────────────────────────────────────────────────
function findArticle(task, schema, explicitFile) {
  // If --file was passed, use that directly
  if (explicitFile) {
    const filePath = resolve(ROOT, explicitFile);
    if (existsSync(filePath)) return filePath;
    console.error(`  ERROR: Specified file not found: ${filePath}`);
    process.exit(1);
  }

  // If task.output.file_pattern is set and specific (no glob), try it directly
  if (task.output.file_pattern && !task.output.file_pattern.includes('{') && !task.output.file_pattern.includes('*')) {
    const direct = resolve(ROOT, task.output.file_pattern);
    if (existsSync(direct)) return direct;
  }

  const contentDir = resolve(CONTENT_DIR, schema.dir);

  // Try git diff (staged, unstaged, untracked) in order
  for (const gitCmd of [
    'git diff --name-only --cached',
    'git diff --name-only',
    'git ls-files --others --exclude-standard',
  ]) {
    try {
      const diff = execSync(gitCmd, { encoding: 'utf8', cwd: ROOT });
      const diffFiles = diff.split('\n').filter(f => f.includes(`content/${schema.dir}/`) && f.endsWith('.md'));
      if (diffFiles.length > 0) return resolve(ROOT, diffFiles[0]);
    } catch {}
  }

  return null;
}

// ── Validate output ─────────────────────────────────────────────────────────
function validateOutput(task, explicitFile) {
  const schema = SCHEMAS[task.type];
  const acceptance = getAcceptance(task);
  const issues = [];
  const warnings = [];

  const newFile = findArticle(task, schema, explicitFile);
  if (!newFile) {
    console.error(`  No article found in site/src/content/${schema.dir}/`);
    console.error(`  Write the article first, then run --validate`);
    if (task.output.file_pattern) {
      console.error(`  Expected: ${task.output.file_pattern}`);
    }
    process.exit(1);
  }

  console.log(`  Validating: ${newFile}\n`);
  const content = readFileSync(newFile, 'utf8');
  const parsed = parseFrontmatter(content);

  // ── 1. Frontmatter structure ──────────────────────────────────────────────
  if (parsed.error) {
    issues.push(parsed.error);
  } else {
    const frontmatter = parsed.data;
    const body = parsed.body;

    // ── 2. Required fields ────────────────────────────────────────────────
    for (const field of (schema.requiredFields || [])) {
      if (frontmatter[field] === undefined || frontmatter[field] === null || frontmatter[field] === '') {
        issues.push(`Missing required field: ${field}`);
      }
    }

    // ── 3. reviewStatus (stage-aware, per task.acceptance.review_status) ──
    const actualReviewStatus = typeof frontmatter.reviewStatus === 'string' ? frontmatter.reviewStatus : null;
    const rsRule = acceptance.review_status;
    const rsCheck = matchesReviewStatus(actualReviewStatus, rsRule);
    if (!rsCheck.pass) {
      issues.push(
        `reviewStatus ${formatReviewStatusRule(rsRule)}; got "${actualReviewStatus ?? '(not found)'}"`
      );
    }

    // ── 4. generatedBy vocabulary ─────────────────────────────────────────
    const generatedBy = typeof frontmatter.generatedBy === 'string' ? frontmatter.generatedBy.trim() : null;
    if (!generatedBy) {
      issues.push('Missing required field: generatedBy');
    } else if (!SCHEMA_GENERATED_BY_VALUES.includes(generatedBy)) {
      const canonical = findCanonicalCaseMatch(generatedBy, SCHEMA_GENERATED_BY_VALUES);
      issues.push(
        canonical
          ? `generatedBy "${generatedBy}" should use canonical value "${canonical}"`
          : `generatedBy "${generatedBy}" is not in the allowed set (${SCHEMA_GENERATED_BY_VALUES.join(', ')})`
      );
    }

    // ── 5. ID format (if applicable) ──────────────────────────────────────
    if (schema.idField && schema.idPattern && frontmatter[schema.idField]) {
      const identifier = String(frontmatter[schema.idField]).trim();
      if (!schema.idPattern.test(identifier)) {
        issues.push(`${schema.idField} format invalid: "${identifier}" — expected pattern: ${schema.idPattern}`);
      }
    }

    // ── 6. Structured sources in frontmatter ──────────────────────────────
    const minSources = acceptance.min_sources ?? 3;
    const sources = Array.isArray(frontmatter.sources) ? frontmatter.sources : [];
    const sourceCount = sources.length;

    if (sourceCount < minSources) {
      issues.push(`Only ${sourceCount} structured source(s) in frontmatter (need ${minSources}+). Sources must be YAML objects with url, publisher, publisherType, reliability — not just prose in the body.`);
    }

    if (sourceCount > 0 && !sources.some(source => source?.publisherType === 'government')) {
      issues.push('No government source found. At least 1 source must have publisherType: "government" (CISA, FBI, DOJ, etc.)');
    }

    for (let i = 0; i < sources.length; i++) {
      const source = sources[i] || {};
      const canonicalPublisher = normalizePublisherAlias(source.publisher || '');
      if (!source.url) issues.push(`Source ${i + 1}: missing url`);
      if (!source.publisher) issues.push(`Source ${i + 1}: missing publisher`);
      if (source.publisher && canonicalPublisher !== String(source.publisher).trim()) {
        issues.push(`Source ${i + 1} publisher "${source.publisher}" should use canonical "${canonicalPublisher}"`);
      }
      if (!source.publisherType) issues.push(`Source ${i + 1}: missing publisherType`);
      if (!source.reliability) issues.push(`Source ${i + 1}: missing reliability`);
      if (!source.publicationDate) issues.push(`Source ${i + 1} (${source.publisher || 'unknown'}): missing publicationDate`);
    }

    // ── 7. MITRE mappings in frontmatter ──────────────────────────────────
    const minMitre = acceptance.min_mitre_mappings ?? 1;
    const mitreMappings = Array.isArray(frontmatter.mitreMappings) ? frontmatter.mitreMappings : [];
    if (mitreMappings.length < minMitre) {
      issues.push(`Only ${mitreMappings.length} MITRE mapping(s) in frontmatter (need ${minMitre}+). Add mitreMappings array with techniqueId, techniqueName fields.`);
    }

    for (let i = 0; i < mitreMappings.length; i++) {
      const mapping = mitreMappings[i] || {};
      const techniqueId = mapping.techniqueId ? String(mapping.techniqueId).trim() : '';
      if (!/^T\d{4}(\.\d{3})?$/.test(techniqueId)) {
        issues.push(`MITRE mapping ${i + 1}: invalid techniqueId "${techniqueId}" — expected format T####[.###]`);
      }

      if (mapping.tactic) {
        const tactic = String(mapping.tactic).trim();
        const canonicalTactic = findCanonicalCaseMatch(tactic, SCHEMA_MITRE_TACTICS);
        if (!canonicalTactic) {
          issues.push(`MITRE mapping ${i + 1}: tactic "${tactic}" is not in the canonical ATT&CK tactic list`);
        } else if (canonicalTactic !== tactic) {
          issues.push(`MITRE mapping ${i + 1}: tactic "${tactic}" should use canonical casing "${canonicalTactic}"`);
        }
      }
    }

    // ── 8. Exact H2 section headings ───────────────────────────────────────
    const requiredH2 = SCHEMA_REQUIRED_H2_BY_TYPE[task.type] || [];
    const actualH2 = getBodyH2Headings(body);
    const minH2 = acceptance.min_h2_sections ?? requiredH2.length;

    if (actualH2.length < minH2) {
      issues.push(`Only ${actualH2.length} H2 section(s) (need ${minH2}+)`);
    }

    const missingH2 = requiredH2.filter(heading => !actualH2.includes(heading));
    const unexpectedH2 = actualH2.filter(heading => !requiredH2.includes(heading));
    const duplicateH2 = actualH2.filter((heading, index) => actualH2.indexOf(heading) !== index);

    for (const heading of missingH2) {
      issues.push(`Missing required H2 section: "${heading}"`);
    }
    if (unexpectedH2.length > 0) {
      issues.push(`Unexpected H2 section(s) for ${task.type}: ${unexpectedH2.join(', ')}`);
    }
    if (duplicateH2.length > 0) {
      issues.push(`Duplicate H2 section(s): ${[...new Set(duplicateH2)].join(', ')}`);
    }

    // ── 9. Sources section in body (exact format + URL parity) ────────────
    const sourcesBody = getSourcesSection(body);
    if (!sourcesBody) {
      issues.push('Missing required H2 section: "Sources & References"');
    } else {
      const parsedBodySources = parseBodySourceEntries(sourcesBody);
      if (parsedBodySources.lines.length === 0) {
        issues.push('Sources & References section has no bullet entries');
      }
      if (parsedBodySources.invalid.length > 0) {
        issues.push(`Sources & References contains ${parsedBodySources.invalid.length} line(s) that do not match the required format "[Publisher: Title](url) — Publisher, YYYY-MM-DD"`);
        for (const line of parsedBodySources.invalid.slice(0, 3)) {
          issues.push(`  → "${line.substring(0, 120)}"`);
        }
      }

      const bodyUrls = new Set(parsedBodySources.valid.map(source => source.url));
      const frontmatterUrls = new Set(sources.map(source => source.url).filter(Boolean));
      const missingBodyUrls = sources
        .filter(source => source?.url && !bodyUrls.has(source.url))
        .map(source => source.url);
      const orphanBodyUrls = parsedBodySources.valid
        .filter(source => !frontmatterUrls.has(source.url))
        .map(source => source.url);

      for (const url of missingBodyUrls) {
        issues.push(`Frontmatter source URL missing from Sources & References body section: ${url}`);
      }
      for (const url of orphanBodyUrls) {
        issues.push(`Body source URL missing from frontmatter sources array: ${url}`);
      }

      for (const bodySource of parsedBodySources.valid) {
        const frontmatterSource = sources.find(source => source?.url === bodySource.url);
        if (!frontmatterSource) continue;

        const canonicalFrontmatterPublisher = normalizePublisherAlias(frontmatterSource.publisher || '');
        const canonicalFrontmatterDate = normalizeSourceDateValue(frontmatterSource.publicationDate);
        if (bodySource.linkPublisher !== canonicalFrontmatterPublisher) {
          issues.push(`Source ${bodySource.url} link publisher "${bodySource.linkPublisher}" must match canonical frontmatter publisher "${canonicalFrontmatterPublisher}"`);
        }
        if (bodySource.separator !== '—') {
          issues.push(`Source ${bodySource.url} must use an em dash (—) between the link and trailing publisher`);
        }
        if (bodySource.trailingPublisher !== canonicalFrontmatterPublisher) {
          issues.push(`Source ${bodySource.url} trailing publisher "${bodySource.trailingPublisher}" must match canonical frontmatter publisher "${canonicalFrontmatterPublisher}"`);
        }
        if (bodySource.publicationDate !== canonicalFrontmatterDate) {
          issues.push(`Source ${bodySource.url} publication date "${bodySource.publicationDate}" must match frontmatter publicationDate "${canonicalFrontmatterDate}"`);
        }
      }
    }

    // ── 10. EDIT-RULE-030: editorial commentary words ─────────────────────
    const bodyLines = body.split('\n');
    const editorialHits = [];
    for (let i = 0; i < bodyLines.length; i++) {
      const line = bodyLines[i];
      if (line.startsWith('#') || line.startsWith('```') || line.startsWith('  - url:')) continue;
      if (/^\s*-\s*\[.*\]\(https?:\/\//.test(line)) continue;
      const match = line.match(EDITORIAL_RE);
      if (match) {
        editorialHits.push({ line: i + 1, word: match[0], context: line.trim().substring(0, 80) });
      }
    }
    if (editorialHits.length > 0) {
      issues.push(`EDIT-RULE-030: ${editorialHits.length} editorial commentary word(s) found:`);
      for (const hit of editorialHits.slice(0, 5)) {
        issues.push(`  → line ${hit.line}: "${hit.word}" in "${hit.context}..."`);
      }
      if (editorialHits.length > 5) {
        issues.push(`  → ...and ${editorialHits.length - 5} more`);
      }
    }

    // ── 11. EDIT-RULE-030: blank lines before headings ────────────────────
    const allLines = content.split('\n');
    for (let i = 1; i < allLines.length; i++) {
      if (allLines[i].match(/^#{2,3} /) && allLines[i - 1].trim() !== '' && !allLines[i - 1].startsWith('---')) {
        issues.push(`EDIT-RULE-030: Missing blank line before heading at line ${i + 1}: "${allLines[i].substring(0, 60)}"`);
        break;
      }
    }
  }

  // ── 11. Astro build ─────────────────────────────────────────────────────
  console.log('  Running Astro build...');
  try {
    execSync('npm run build', { cwd: resolve(ROOT, 'site'), stdio: 'pipe' });
    console.log('  Build: PASS');
  } catch (err) {
    issues.push('Astro build failed');
    console.log('  Build: FAIL');
    if (err.stderr) {
      const errLines = err.stderr.toString().split('\n').slice(0, 8);
      errLines.forEach(l => console.log(`    ${l}`));
    }
  }

  // ── Results ─────────────────────────────────────────────────────────────
  console.log();

  if (warnings.length > 0) {
    console.log(`  ⚠ ${warnings.length} WARNING(S):`);
    warnings.forEach(w => console.log(`    - ${w}`));
    console.log();
  }

  if (issues.length === 0) {
    console.log('  ✓ ALL CHECKS PASSED');
    console.log(`\n  Next: git add . && git commit -m "feat: ${task.task_id} — ${task.input.topic.substring(0, 50)}"`);
    console.log(`        git push -u origin ${task.output.branch}`);
    console.log(`        node scripts/pipeline-run-task.mjs --task ${task.task_id} --open-pr`);
  } else {
    console.log(`  ✗ ${issues.length} ISSUE(S):`);
    issues.forEach(i => console.log(`    - ${i}`));
    console.log('\n  Fix the issues and run --validate again.');
  }

  return issues.length === 0;
}

// ── Open or record a PR for a validated task ────────────────────────────────
function openPrTask(task, filePath, prNumber, explicitFile, usedDeprecatedComplete) {
  if (usedDeprecatedComplete) {
    console.log('  NOTE: --complete is deprecated. Use --open-pr going forward.\n');
  }
  if (task.status !== 'locked') {
    console.error(`  Task ${task.task_id} must be locked before recording an open PR (current status: ${task.status})`);
    process.exit(1);
  }

  ensureTaskBranchCheckedOut(task);
  ensureNoUnexpectedTrackedWorktreeDrift(filePath);

  const schema = SCHEMAS[task.type];
  const articleFile = findArticle(task, schema, explicitFile);
  if (!articleFile) {
    console.error(`  No article found in site/src/content/${schema.dir}/`);
    console.error(`  Write the article first, then run --open-pr`);
    process.exit(1);
  }

  const validationPassed = validateOutput(task, explicitFile);
  if (!validationPassed) {
    console.error('\n  Refusing to record PR state because validation is still failing.');
    process.exit(1);
  }

  ensureArticleTracked(articleFile);
  ensureBranchPushed(task);

  let pr = null;
  if (prNumber) {
    pr = loadPullRequest(prNumber);
  } else {
    pr = findExistingOpenPullRequest(task);
    if (!pr) {
      pr = createPullRequest(task, articleFile);
      console.log(`  Created PR #${pr.number}: ${pr.url}`);
    } else {
      console.log(`  Reusing existing PR #${pr.number}: ${pr.url}`);
    }
  }
  assertPullRequestMatchesTask(task, pr);

  let agent = 'unknown';
  try { agent = execSync('git config user.name', { encoding: 'utf8' }).trim(); } catch {}

  task.status = 'pr_open';
  task.pr_number = pr.number;
  task.pr_url = pr.url;
  task.locked_by = null;
  task.locked_at = null;
  task.history = task.history || [];
  task.history.push({
    timestamp: new Date().toISOString(),
    from: 'locked',
    to: 'pr_open',
    agent,
    action: 'pr_opened',
    note: `Article generated, validated, and recorded against PR #${pr.number}`,
  });

  saveTask(task, filePath);
  commitAndPushTaskState(task, filePath, pr.number);
  closeOpenPipelineIssues(task, pr.number);
  console.log(`  ✓ ${task.task_id} recorded against PR #${pr.number}`);
  console.log(`  Bookkeeping commit pushed to ${task.output.branch}.`);
  console.log('  Final completion is now driven by the PR merge event, not by local CLI state.');
}

// ── Main ────────────────────────────────────────────────────────────────────
const args = parseArgs();

console.log(`\n  Threatpedia Pipeline Task Runner v2\n`);

if (args.action === 'list') {
  listTasks(args.all);
} else if (!args.taskId) {
  console.error('  Usage: node scripts/pipeline-run-task.mjs --task TASK-YYYY-NNNN [--lock|--validate|--open-pr [--pr 123]]');
  console.error('         node scripts/pipeline-run-task.mjs --task TASK-YYYY-NNNN --validate --file path/to/article.md');
  console.error('         node scripts/pipeline-run-task.mjs --list [--all]');
  process.exit(1);
} else {
  const { data: task, path: filePath } = loadTask(args.taskId);

  switch (args.action) {
    case 'brief':
      showBrief(task);
      break;
    case 'lock':
      lockTask(task, filePath);
      break;
    case 'validate':
      validateOutput(task, args.file);
      break;
    case 'open-pr':
      openPrTask(task, filePath, args.prNumber, args.file, args.usedDeprecatedComplete);
      break;
  }
}
