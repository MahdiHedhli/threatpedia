#!/usr/bin/env node
/**
 * Validate changed pipeline task JSON files before they enter main.
 *
 * The full task corpus still contains tolerated legacy shapes. This validator
 * is intentionally stricter for newly added task files while keeping edited
 * historical tasks compatible with the reader paths documented in PIPELINE.md.
 */

import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

import { SCHEMA_REVIEW_STATUSES } from './pipeline-schema.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const TASKS_DIR = resolve(ROOT, '.github/pipeline/tasks');

const TASK_ID_RE = /^TASK-\d{4}-\d{4}$/;
const TASK_FILE_RE = /^\.github\/pipeline\/tasks\/TASK-\d{4}-\d{4}\.json$/;
const STAGES = new Set(['discovery', 'triage', 'draft', 'generation', 'validation', 'review', 'revision', 'approval', 'publish']);
const TYPES = new Set(['incident', 'campaign', 'threat-actor', 'zero-day']);
const PRIORITIES = new Set(['P0', 'P1', 'P2', 'P3']);
const STATUSES = new Set(['pending', 'locked', 'pr_open', 'complete', 'failed', 'blocked', 'cancelled']);
const SOURCES = new Set(['auto_discovery', 'manual_submission', 'enrichment', 'backfill']);

function parseArgs(argv) {
  const args = {
    filesFile: null,
    newFilesFile: null,
    jsonOut: null,
    all: false,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    const next = argv[i + 1];
    switch (token) {
      case '--files-file':
        if (!next) throw new Error(`Missing value for ${token}`);
        args.filesFile = next;
        i += 1;
        break;
      case '--new-files-file':
        if (!next) throw new Error(`Missing value for ${token}`);
        args.newFilesFile = next;
        i += 1;
        break;
      case '--json-out':
        if (!next) throw new Error(`Missing value for ${token}`);
        args.jsonOut = next;
        i += 1;
        break;
      case '--all':
        args.all = true;
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

  return args;
}

function usage() {
  console.log([
    'Usage:',
    '  node scripts/validate-pipeline-tasks.mjs --files-file <changed.txt> [--new-files-file <new.txt>] [--json-out <report.json>]',
    '  node scripts/validate-pipeline-tasks.mjs --all [--json-out <report.json>]',
  ].join('\n'));
}

function readPathList(filePath) {
  if (!filePath || !existsSync(filePath)) return [];
  return readFileSync(filePath, 'utf8')
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)
    .map(normalizeRepoPath)
    .filter(path => path.startsWith('.github/pipeline/tasks/') && path.endsWith('.json'));
}

function normalizeRepoPath(path) {
  return String(path || '').replaceAll('\\', '/').replace(/^\.\//, '');
}

function listAllTaskFiles() {
  if (!existsSync(TASKS_DIR)) return [];
  return readdirSync(TASKS_DIR)
    .filter(file => /^TASK-\d{4}-\d{4}\.json$/.test(file))
    .sort()
    .map(file => `.github/pipeline/tasks/${file}`);
}

function repoPathToAbs(repoPath) {
  return resolve(ROOT, normalizeRepoPath(repoPath));
}

function isInsideRepoTaskDir(repoPath) {
  const abs = repoPathToAbs(repoPath);
  const rel = relative(TASKS_DIR, abs);
  return rel && !rel.startsWith('..') && !rel.includes(`..${sep}`);
}

function addIssue(issues, severity, message) {
  issues.push({ severity, message });
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isIsoDateTime(value) {
  if (!isNonEmptyString(value)) return false;
  const time = Date.parse(value);
  return Number.isFinite(time) && /\d{4}-\d{2}-\d{2}T/.test(value);
}

function isValidUrl(value) {
  if (!isNonEmptyString(value)) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function validateReviewStatusRule(rule, issues, prefix) {
  if (rule === undefined || rule === null) {
    addIssue(issues, 'error', `${prefix}.review_status is required.`);
    return;
  }

  if (rule === '*') return;

  if (typeof rule === 'string') {
    if (!SCHEMA_REVIEW_STATUSES.includes(rule)) {
      addIssue(issues, 'error', `${prefix}.review_status must be "*" or one of: ${SCHEMA_REVIEW_STATUSES.join(', ')}.`);
    }
    return;
  }

  if (Array.isArray(rule)) {
    if (rule.length === 0) {
      addIssue(issues, 'error', `${prefix}.review_status array must not be empty.`);
      return;
    }
    for (const value of rule) {
      if (!SCHEMA_REVIEW_STATUSES.includes(value)) {
        addIssue(issues, 'error', `${prefix}.review_status contains invalid value ${JSON.stringify(value)}.`);
      }
    }
    return;
  }

  addIssue(issues, 'error', `${prefix}.review_status must be a string, "*", or an array of schema review statuses.`);
}

function validateAcceptance(task, issues, isNew) {
  const hasCanonical = isObject(task.acceptance_criteria);
  const hasLegacy = isObject(task.acceptance);

  if (isNew && !hasCanonical) {
    addIssue(issues, 'error', 'New task files must use canonical acceptance_criteria.');
  }
  if (!hasCanonical && !hasLegacy) {
    addIssue(issues, 'error', 'Task must include acceptance_criteria or tolerated legacy acceptance.');
    return;
  }

  const acceptance = hasCanonical ? task.acceptance_criteria : task.acceptance;
  const prefix = hasCanonical ? 'acceptance_criteria' : 'acceptance';
  if (!hasCanonical) {
    addIssue(issues, isNew ? 'error' : 'warning', 'Legacy acceptance is tolerated only for existing task edits; new task writers must use acceptance_criteria.');
  }

  for (const [field, minimum] of [
    ['min_sources', 0],
    ['min_h2_sections', 1],
    ['min_mitre_mappings', 0],
  ]) {
    if (acceptance[field] !== undefined && (!Number.isInteger(acceptance[field]) || acceptance[field] < minimum)) {
      addIssue(issues, 'error', `${prefix}.${field} must be an integer >= ${minimum}.`);
    }
  }

  validateReviewStatusRule(acceptance.review_status, issues, prefix);

  if (acceptance.schema_validation !== undefined && !['pass', 'warn'].includes(acceptance.schema_validation)) {
    addIssue(issues, 'error', `${prefix}.schema_validation must be "pass" or "warn".`);
  }

  const buildField = acceptance.astro_build ?? acceptance.build_passes;
  if (buildField !== undefined && typeof buildField !== 'boolean') {
    addIssue(issues, 'error', `${prefix}.astro_build/build_passes must be boolean when present.`);
  }
}

function validateTask(repoPath, isNew) {
  const issues = [];
  const normalizedPath = normalizeRepoPath(repoPath);

  if (!TASK_FILE_RE.test(normalizedPath)) {
    addIssue(issues, 'error', 'Task file path must be .github/pipeline/tasks/TASK-YYYY-NNNN.json.');
  }
  if (!isInsideRepoTaskDir(normalizedPath)) {
    addIssue(issues, 'error', 'Task path escapes .github/pipeline/tasks/.');
  }

  const abs = repoPathToAbs(normalizedPath);
  let task;
  try {
    task = JSON.parse(readFileSync(abs, 'utf8'));
  } catch (error) {
    addIssue(issues, 'error', `Task JSON could not be parsed: ${error.message}`);
    return { path: normalizedPath, ok: false, issues };
  }

  if (!isObject(task)) {
    addIssue(issues, 'error', 'Task root must be a JSON object.');
    return { path: normalizedPath, ok: false, issues };
  }

  const fileId = normalizedPath.split('/').pop().replace(/\.json$/, '');
  if (!TASK_ID_RE.test(task.task_id)) {
    addIssue(issues, 'error', 'task_id must match TASK-YYYY-NNNN.');
  } else if (task.task_id !== fileId) {
    addIssue(issues, 'error', `task_id ${task.task_id} must match filename ${fileId}.`);
  }

  if (task.stage === undefined || task.stage === null) {
    addIssue(issues, isNew ? 'error' : 'warning', 'stage is missing; legacy tasks tolerate this, but new tasks must declare a stage.');
  } else if (!STAGES.has(task.stage)) {
    addIssue(issues, 'error', `stage must be one of: ${[...STAGES].join(', ')}.`);
  }
  if (!TYPES.has(task.type)) addIssue(issues, 'error', `type must be one of: ${[...TYPES].join(', ')}.`);
  if (!PRIORITIES.has(task.priority)) addIssue(issues, 'error', `priority must be one of: ${[...PRIORITIES].join(', ')}.`);
  if (!STATUSES.has(task.status)) addIssue(issues, 'error', `status must be one of: ${[...STATUSES].join(', ')}.`);

  if (task.source !== undefined && !SOURCES.has(task.source)) {
    addIssue(issues, isNew ? 'error' : 'warning', `source must be one of: ${[...SOURCES].join(', ')}.`);
  }

  if (task.created !== undefined && !isIsoDateTime(task.created)) addIssue(issues, 'error', 'created must be an ISO 8601 timestamp.');
  if (task.updated !== undefined && !isIsoDateTime(task.updated)) addIssue(issues, 'error', 'updated must be an ISO 8601 timestamp.');

  if (!isObject(task.input)) {
    addIssue(issues, 'error', 'input must be an object.');
  } else {
    if (!isNonEmptyString(task.input.topic)) addIssue(issues, 'error', 'input.topic is required.');
    if (task.input.sources !== undefined) {
      if (!Array.isArray(task.input.sources)) {
        addIssue(issues, 'error', 'input.sources must be an array when present.');
      } else {
        task.input.sources.forEach((source, index) => {
          if (!isValidUrl(source)) addIssue(issues, 'error', `input.sources[${index}] must be an http(s) URL.`);
        });
      }
    }
  }

  validateAcceptance(task, issues, isNew);

  if (!isObject(task.output)) {
    addIssue(issues, 'error', 'output must be an object.');
  } else {
    if (!isNonEmptyString(task.output.file_pattern)) addIssue(issues, 'error', 'output.file_pattern is required.');
    if (!isNonEmptyString(task.output.branch)) addIssue(issues, 'error', 'output.branch is required.');
    if (isNew && task.output.branch !== `pipeline/${task.task_id}`) {
      addIssue(issues, 'error', `New task output.branch must be pipeline/${task.task_id}.`);
    }
  }

  if (isNew) {
    if (task.stage !== 'draft') addIssue(issues, 'error', 'New task stage must be draft.');
    if (task.source === undefined) addIssue(issues, 'error', 'New task source is required.');
    if (task.status !== 'pending') addIssue(issues, 'error', 'New task status must be pending.');
    if (task.locked_by !== null) addIssue(issues, 'error', 'New task locked_by must be null.');
    if (task.locked_at !== null) addIssue(issues, 'error', 'New task locked_at must be null.');
    const firstHistory = Array.isArray(task.history) ? task.history[0] : null;
    if (!isObject(firstHistory)) {
      addIssue(issues, 'error', 'New task history[0] creation entry is required.');
    } else {
      if (firstHistory.action !== 'created') addIssue(issues, 'error', 'New task history[0].action must be "created".');
      if (firstHistory.from !== 'none' || firstHistory.to !== 'pending') {
        addIssue(issues, 'error', 'New task history[0] must transition from "none" to "pending".');
      }
    }
  }

  return {
    path: normalizedPath,
    ok: !issues.some(issue => issue.severity === 'error'),
    issues,
  };
}

function formatMarkdown(results) {
  const errors = results.flatMap(result => result.issues.filter(issue => issue.severity === 'error'));
  const warnings = results.flatMap(result => result.issues.filter(issue => issue.severity === 'warning'));
  const lines = [
    '## Pipeline Task Validation Report',
    '',
    errors.length === 0 ? ':white_check_mark: Task validation passed.' : `:x: Task validation failed with ${errors.length} error(s).`,
    '',
    `Validated task files: ${results.length}`,
  ];

  if (warnings.length > 0) lines.push(`Warnings: ${warnings.length}`);
  lines.push('');

  for (const result of results) {
    lines.push(`### ${result.path}`);
    if (result.issues.length === 0) {
      lines.push('- PASS');
    } else {
      for (const issue of result.issues) {
        lines.push(`- ${issue.severity.toUpperCase()}: ${issue.message}`);
      }
    }
    lines.push('');
  }

  return lines.join('\n').trim() + '\n';
}

function main() {
  const args = parseArgs(process.argv);
  const files = args.all ? listAllTaskFiles() : [...new Set(readPathList(args.filesFile))].sort();
  const newFiles = new Set(readPathList(args.newFilesFile));

  const results = files.map(file => validateTask(file, newFiles.has(file)));
  const allPass = results.every(result => result.ok);
  const payload = {
    allPass,
    results,
    markdown: formatMarkdown(results),
  };

  if (args.jsonOut) {
    writeFileSync(args.jsonOut, JSON.stringify(payload, null, 2) + '\n');
  }

  process.stdout.write(payload.markdown);
  if (!allPass) process.exit(1);
}

main();
