#!/usr/bin/env node

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');
const TASKS_DIR = resolve(ROOT, '.github/pipeline/tasks');
const CONTENT_DIR = resolve(ROOT, 'site/src/content');

function parseArgs(argv) {
  const args = {
    type: 'incident',
    priority: 'P2',
    severity: 'unknown',
    submittedBy: 'manual-cli',
    execute: false,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    const next = argv[i + 1];
    if (token === '--execute') {
      args.execute = true;
      continue;
    }
    if (token === '--url' && next) {
      args.urls = args.urls || [];
      args.urls.push(next.trim());
      i += 1;
      continue;
    }
    if (token === '--topic' && next) {
      args.topic = next.trim();
      i += 1;
      continue;
    }
    if (token === '--type' && next) {
      args.type = next.trim();
      i += 1;
      continue;
    }
    if (token === '--priority' && next) {
      args.priority = next.trim().toUpperCase();
      i += 1;
      continue;
    }
    if (token === '--severity' && next) {
      args.severity = next.trim().toLowerCase();
      i += 1;
      continue;
    }
    if (token === '--submitted-by' && next) {
      args.submittedBy = next.trim();
      i += 1;
      continue;
    }
    if (token === '--notes' && next) {
      args.notes = next.trim();
      i += 1;
      continue;
    }
    if (token === '--help' || token === '-h') {
      args.help = true;
      continue;
    }
    throw new Error(`Unknown/invalid argument: ${token}`);
  }

  return args;
}

function usage() {
  console.log([
    'Usage:',
    '  node scripts/pipeline-submit-link.mjs --url <url> [--url <url2> ...] [--topic <text>] [--type incident|campaign|threat-actor|zero-day]',
    '      [--priority P0|P1|P2|P3] [--severity critical|high|medium|low|unknown] [--notes <text>] [--submitted-by <name>] [--execute]',
    '',
    'Default is dry-run (no file write). Add --execute to create a task JSON in .github/pipeline/tasks/.',
  ].join('\n'));
}

function normalizeUrl(rawUrl) {
  const value = String(rawUrl || '').trim().replace(/[.,;:'"]+$/g, '');
  if (!value) return null;
  try {
    const url = new URL(value);
    url.hash = '';
    if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
      url.pathname = url.pathname.slice(0, -1);
    }
    return url.toString();
  } catch {
    return null;
  }
}

function normalizeTitleKey(value) {
  return String(value || '')
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function extractMarkdownUrls(content) {
  return [...String(content || '').matchAll(/https?:\/\/[^\s)<>"']+/g)]
    .map(match => normalizeUrl(match[0]))
    .filter(Boolean);
}

function listContentFiles(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      listContentFiles(full, out);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      out.push(full);
    }
  }
  return out;
}

function buildIndexes() {
  const knownUrls = new Set();
  const knownTitles = new Map();

  if (existsSync(TASKS_DIR)) {
    for (const file of readdirSync(TASKS_DIR)) {
      if (!/^TASK-\d{4}-\d+\.json$/.test(file)) continue;
      const full = resolve(TASKS_DIR, file);
      const raw = readFileSync(full, 'utf8');
      let task;
      try {
        task = JSON.parse(raw);
      } catch {
        continue;
      }
      for (const source of task.input?.sources || []) {
        const normalized = normalizeUrl(source);
        if (normalized) knownUrls.add(normalized);
      }
      const topic = task.input?.topic;
      const titleKey = normalizeTitleKey(topic);
      if (titleKey) knownTitles.set(titleKey, `.github/pipeline/tasks/${file}`);
    }
  }

  for (const full of listContentFiles(CONTENT_DIR)) {
    const rel = full.replace(`${ROOT}/`, '');
    const content = readFileSync(full, 'utf8');
    for (const url of extractMarkdownUrls(content)) {
      knownUrls.add(url);
    }
    const heading = content.match(/^#\s+(.+)$/m)?.[1]?.trim();
    const titleKey = normalizeTitleKey(heading);
    if (titleKey) knownTitles.set(titleKey, rel);
  }

  return { knownUrls, knownTitles };
}

function nextTaskId() {
  const currentYear = new Date().getUTCFullYear();
  let maxNum = 0;
  if (!existsSync(TASKS_DIR)) return `TASK-${currentYear}-0001`;
  for (const file of readdirSync(TASKS_DIR)) {
    const match = file.match(new RegExp(`^TASK-${currentYear}-(\\d+)\\.json$`));
    if (!match) continue;
    maxNum = Math.max(maxNum, Number.parseInt(match[1], 10));
  }
  return `TASK-${currentYear}-${String(maxNum + 1).padStart(4, '0')}`;
}

function filePatternFor(type) {
  return `site/src/content/${type === 'threat-actor' ? 'threat-actors' : `${type}s`}/{slug}.md`;
}

function acceptanceCriteriaFor(type) {
  return {
    frontmatter_valid: true,
    min_sources: 3,
    min_h2_sections: type === 'campaign' ? 7 : (type === 'threat-actor' ? 6 : 5),
    min_mitre_mappings: type === 'threat-actor' ? 3 : 1,
    review_status: 'draft_ai',
    schema_validation: 'pass',
    astro_build: true,
  };
}

function buildTask(args, normalizedUrls, taskId) {
  const nowIso = new Date().toISOString();
  const candidateData = {};
  if (args.severity && args.severity !== 'unknown') candidateData.severity = args.severity;

  return {
    task_id: taskId,
    stage: 'draft',
    type: args.type,
    priority: args.priority,
    status: 'pending',
    created: nowIso,
    updated: nowIso,
    source: 'manual_submission',
    submitted_by: args.submittedBy,
    locked_by: null,
    locked_at: null,
    input: {
      topic: args.topic,
      sources: normalizedUrls,
      candidate_data: Object.keys(candidateData).length > 0 ? candidateData : undefined,
      notes: args.notes || undefined,
    },
    specs: [
      'DATA-STANDARDS-v1.0.md',
      'EDITORIAL-WORKFLOW-SPEC.md §14A',
      'INGESTION-SPEC.md §2',
    ],
    acceptance_criteria: acceptanceCriteriaFor(args.type),
    depends_on: [],
    preconditions: ['editorial queue depth < 50'],
    output: {
      file_pattern: filePatternFor(args.type),
      branch: `pipeline/${taskId}`,
      pr: true,
    },
    history: [
      {
        timestamp: nowIso,
        action: 'created',
        from: 'none',
        to: 'pending',
        agent: args.submittedBy,
        note: 'Manual link submission via scripts/pipeline-submit-link.mjs',
      },
    ],
  };
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    usage();
    return;
  }
  if (!args.urls || args.urls.length === 0) throw new Error('At least one --url is required.');

  const normalizedUrls = [...new Set(args.urls.map(normalizeUrl).filter(Boolean))];
  if (normalizedUrls.length === 0) throw new Error('No valid URL values were provided.');

  if (!args.topic) {
    const first = new URL(normalizedUrls[0]);
    args.topic = `${first.hostname}${first.pathname}`;
  }

  const validTypes = new Set(['incident', 'campaign', 'threat-actor', 'zero-day']);
  if (!validTypes.has(args.type)) throw new Error(`Invalid --type: ${args.type}`);
  if (!/^P[0-3]$/.test(args.priority)) throw new Error(`Invalid --priority: ${args.priority}`);

  const { knownUrls, knownTitles } = buildIndexes();
  const duplicateUrls = normalizedUrls.filter(url => knownUrls.has(url));
  const duplicateTitlePath = knownTitles.get(normalizeTitleKey(args.topic));

  console.log('Threatpedia manual link submission check');
  console.log(`  Topic: ${args.topic}`);
  console.log(`  Type: ${args.type} | Priority: ${args.priority}`);
  console.log(`  URLs: ${normalizedUrls.length}`);

  if (duplicateTitlePath) {
    console.log(`\nPotential topic overlap: ${duplicateTitlePath}`);
    console.log('This is informational only; URL dedup remains the blocking check.');
  }

  if (duplicateUrls.length > 0) {
    console.log('\nDUPLICATE DETECTED - task not created.');
    for (const url of duplicateUrls) {
      console.log(`  - URL already known: ${url}`);
    }
    process.exitCode = 2;
    return;
  }

  const taskId = nextTaskId();
  const task = buildTask(args, normalizedUrls, taskId);
  const taskPath = resolve(TASKS_DIR, `${taskId}.json`);

  if (!args.execute) {
    console.log(`\nNo duplicates found. Dry-run only; would create ${taskId}.`);
    console.log(`Add --execute to write: ${taskPath}`);
    return;
  }

  mkdirSync(TASKS_DIR, { recursive: true });
  writeFileSync(taskPath, `${JSON.stringify(task, null, 2)}\n`);
  console.log(`\nCreated task: ${taskId}`);
  console.log(`Path: ${taskPath}`);
}

main();
