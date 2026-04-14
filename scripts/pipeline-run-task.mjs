#!/usr/bin/env node
/**
 * pipeline-run-task.mjs — Pipeline Task Runner
 *
 * Reads a pipeline task JSON, prepares the full agent brief, validates
 * the output, and manages task state transitions.
 *
 * This script does NOT call any AI API. It prepares the context for
 * an agent (Claude Code, Gemini, or a human) to execute under their
 * own subscription, then validates the result.
 *
 * Usage:
 *   node scripts/pipeline-run-task.mjs --task TASK-2026-0001           # Show task brief
 *   node scripts/pipeline-run-task.mjs --task TASK-2026-0001 --lock    # Lock task for execution
 *   node scripts/pipeline-run-task.mjs --task TASK-2026-0001 --validate # Validate output
 *   node scripts/pipeline-run-task.mjs --task TASK-2026-0001 --complete # Mark complete + open PR
 *   node scripts/pipeline-run-task.mjs --list                          # List all pending tasks
 *   node scripts/pipeline-run-task.mjs --list --all                    # List all tasks (any status)
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const TASKS_DIR = resolve(ROOT, '.github/pipeline/tasks');
const CONTENT_DIR = resolve(ROOT, 'site/src/content');

// ── Schemas (reused from generate-article.mjs) ──────────────────────────────
const SCHEMAS = {
  incident: {
    dir: 'incidents',
    frontmatterSpec: `YAML frontmatter fields (all required unless marked optional):
  eventId: string — format TP-YYYY-NNNN (use current year, pick next available number)
  title: string — concise incident name, max 80 chars
  date: date — ISO 8601 YYYY-MM-DD
  attackType: string — Data Breach, Ransomware, Espionage, Sabotage, Supply Chain, DDoS, Financial, etc.
  severity: enum — critical | high | medium | low
  sector: string — from taxonomy: Energy & Utilities, Financial Services, Government, Healthcare, Technology, etc.
  geography: string — country or region
  threatActor: string (optional, default "Unknown")
  attributionConfidence: enum (optional, default A4) — A1 (confirmed) through A6 (unknown)
  reviewStatus: must be "draft_ai"
  confidenceGrade: enum (optional, default C) — A through F
  generatedBy: must be "ai_ingestion"
  generatedDate: date — today's date ISO 8601
  cves: array of strings (optional)
  relatedSlugs: array of strings (optional)
  tags: array of strings
  sources: array of source objects (minimum 3)
  mitreMappings: array of MITRE objects (minimum 1)`,
    bodySpec: `Required H2 sections: Executive Summary, Technical Analysis, Attack Chain (### Stage N: Title), MITRE ATT&CK Mapping, Impact Assessment, Timeline (### YYYY-MM-DD — Title), Remediation & Mitigation, Indicators of Compromise, Sources & References`,
  },
  campaign: {
    dir: 'campaigns',
    frontmatterSpec: `YAML frontmatter fields: title, startDate, endDate (optional), ongoing, attackType, severity, sector, geography, threatActor, attributionConfidence, reviewStatus (must be draft_ai), confidenceGrade, generatedBy (must be ai_ingestion), generatedDate, cves, relatedIncidents, tags, sources (min 3), mitreMappings (min 1)`,
    bodySpec: `Required H2 sections: Executive Summary, Technical Analysis, Attack Chain, MITRE ATT&CK Mapping, Impact Assessment, Timeline, Remediation & Mitigation, Indicators of Compromise, Sources & References`,
  },
  'threat-actor': {
    dir: 'threat-actors',
    frontmatterSpec: `YAML frontmatter fields: name, aliases, affiliation, motivation, status (active|inactive|unknown), country, firstSeen, lastSeen, targetSectors, targetGeographies, tools, mitreMappings, reviewStatus (must be draft_ai), generatedBy (must be ai_ingestion), generatedDate, tags`,
    bodySpec: `Required H2 sections: Overview, Tactics Techniques & Procedures (TTPs), Targeted Industries & Organizations, Attributable Attacks Timeline, Cross-Vendor Naming Reference, References & Sources`,
  },
  'zero-day': {
    dir: 'zero-days',
    frontmatterSpec: `YAML frontmatter fields: exploitId (optional), title, cve, type, platform, severity, status, isZeroDay, disclosedDate, patchDate, researcher, confirmedBy, daysInTheWild, cisaKev, reviewStatus (must be draft_ai), generatedBy (must be ai_ingestion), generatedDate, relatedIncidents, relatedActors, tags`,
    bodySpec: `Required H2 sections: Severity Assessment, Summary, Exploit Chain, Detection Guidance, Indicators of Compromise, Pre-Patch Mitigations, Disclosure Timeline, Sources & References`,
  },
};

// ── CLI Parsing ──────────────────────────────────────────────────────────────
function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = { taskId: null, action: 'brief', all: false };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--task' && args[i + 1]) parsed.taskId = args[++i];
    if (args[i] === '--lock') parsed.action = 'lock';
    if (args[i] === '--validate') parsed.action = 'validate';
    if (args[i] === '--complete') parsed.action = 'complete';
    if (args[i] === '--list') parsed.action = 'list';
    if (args[i] === '--all') parsed.all = true;
  }

  return parsed;
}

// ── Load task ────────────────────────────────────────────────────────────────
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

// ── List tasks ───────────────────────────────────────────────────────────────
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

// ── Show task brief ──────────────────────────────────────────────────────────
function showBrief(task) {
  const schema = SCHEMAS[task.type];
  if (!schema) {
    console.error(`  ERROR: Unknown type "${task.type}"`);
    process.exit(1);
  }

  const sources = (task.input.sources || []).map(s => `  - ${s}`).join('\n') || '  (none provided — agent must research)';
  const candidate = task.input.candidate_data
    ? Object.entries(task.input.candidate_data).map(([k, v]) => `  ${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join('\n')
    : '  (none)';

  console.log(`
╔══════════════════════════════════════════════════════════════════════════════╗
║  PIPELINE TASK BRIEF: ${task.task_id.padEnd(54)}║
╚══════════════════════════════════════════════════════════════════════════════╝

  Task ID:    ${task.task_id}
  Type:       ${task.type}
  Priority:   ${task.priority}
  Status:     ${task.status}
  Source:     ${task.source}
  Submitted:  ${task.submitted_by} on ${task.created}

── TOPIC ──────────────────────────────────────────────────────────────────────

  ${task.input.topic}

── SOURCE URLs ────────────────────────────────────────────────────────────────

${sources}

── CANDIDATE DATA ─────────────────────────────────────────────────────────────

${candidate}

${task.input.notes ? `── NOTES ──────────────────────────────────────────────────────────────────────\n\n  ${task.input.notes}\n` : ''}
── SPECS TO FOLLOW ────────────────────────────────────────────────────────────

  ${(task.specs || []).join('\n  ')}

── FRONTMATTER SCHEMA ─────────────────────────────────────────────────────────

${schema.frontmatterSpec}

── BODY STRUCTURE ─────────────────────────────────────────────────────────────

${schema.bodySpec}

── ACCEPTANCE CRITERIA ────────────────────────────────────────────────────────

  frontmatter_valid:  ${task.acceptance.frontmatter_valid}
  min_sources:        ${task.acceptance.min_sources}
  min_h2_sections:    ${task.acceptance.min_h2_sections}
  min_mitre_mappings: ${task.acceptance.min_mitre_mappings}
  review_status:      ${task.acceptance.review_status}
  schema_validation:  ${task.acceptance.schema_validation}
  build_passes:       ${task.acceptance.build_passes}

── OUTPUT ─────────────────────────────────────────────────────────────────────

  File:   ${task.output.file_pattern}
  Branch: ${task.output.branch}
  PR:     ${task.output.pr ? 'yes' : 'no'}

── EXECUTION STEPS ────────────────────────────────────────────────────────────

  1. Lock the task:    node scripts/pipeline-run-task.mjs --task ${task.task_id} --lock
  2. Create branch:    git checkout -b ${task.output.branch}
  3. Write article:    site/src/content/${schema.dir}/{slug}.md
     → Use your AI agent (Claude Code, Gemini, etc.) to generate the article
     → Follow the frontmatter schema and body structure above
     → Ensure all acceptance criteria are met
  4. Validate:         node scripts/pipeline-run-task.mjs --task ${task.task_id} --validate
  5. Commit & push:    git add . && git commit && git push -u origin ${task.output.branch}
  6. Open PR:          gh pr create --base main
  7. Mark complete:    node scripts/pipeline-run-task.mjs --task ${task.task_id} --complete

══════════════════════════════════════════════════════════════════════════════`);
}

// ── Lock task ────────────────────────────────────────────────────────────────
function lockTask(task, filePath) {
  if (task.status === 'locked') {
    console.error(`  Task ${task.task_id} is already locked by ${task.locked_by} since ${task.locked_at}`);
    process.exit(1);
  }
  if (task.status !== 'pending') {
    console.error(`  Task ${task.task_id} cannot be locked (status: ${task.status})`);
    process.exit(1);
  }

  // Get current git user as lock owner
  let lockOwner = 'unknown';
  try {
    lockOwner = execSync('git config user.name', { encoding: 'utf8' }).trim();
  } catch {}

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

// ── Validate output ──────────────────────────────────────────────────────────
function validateOutput(task) {
  const schema = SCHEMAS[task.type];
  const contentDir = resolve(CONTENT_DIR, schema.dir);
  const issues = [];

  // Find the article file (match any .md in the content dir that wasn't there before)
  const files = readdirSync(contentDir).filter(f => f.endsWith('.md'));

  // Try to find by checking git diff for new files
  let newFile = null;
  try {
    const diff = execSync('git diff --name-only --cached', { encoding: 'utf8', cwd: ROOT });
    const diffFiles = diff.split('\n').filter(f => f.includes(`content/${schema.dir}/`) && f.endsWith('.md'));
    if (diffFiles.length > 0) newFile = resolve(ROOT, diffFiles[0]);
  } catch {}

  // Fallback: check unstaged
  if (!newFile) {
    try {
      const diff = execSync('git diff --name-only', { encoding: 'utf8', cwd: ROOT });
      const diffFiles = diff.split('\n').filter(f => f.includes(`content/${schema.dir}/`) && f.endsWith('.md'));
      if (diffFiles.length > 0) newFile = resolve(ROOT, diffFiles[0]);
    } catch {}
  }

  // Fallback: check untracked
  if (!newFile) {
    try {
      const diff = execSync('git ls-files --others --exclude-standard', { encoding: 'utf8', cwd: ROOT });
      const diffFiles = diff.split('\n').filter(f => f.includes(`content/${schema.dir}/`) && f.endsWith('.md'));
      if (diffFiles.length > 0) newFile = resolve(ROOT, diffFiles[0]);
    } catch {}
  }

  if (!newFile) {
    console.error(`  No new article found in site/src/content/${schema.dir}/`);
    console.error(`  Write the article first, then run --validate`);
    process.exit(1);
  }

  console.log(`  Validating: ${newFile}\n`);
  const content = readFileSync(newFile, 'utf8');

  // Frontmatter check
  if (!content.startsWith('---')) {
    issues.push('Missing frontmatter (must start with ---)');
  } else {
    const fmEnd = content.indexOf('---', 3);
    if (fmEnd === -1) {
      issues.push('Frontmatter not closed');
    } else {
      const fm = content.slice(3, fmEnd);
      const body = content.slice(fmEnd + 3);

      // Required fields
      const requiredFields = {
        incident: ['eventId', 'title', 'date', 'attackType', 'severity', 'sector', 'geography', 'reviewStatus', 'generatedBy', 'generatedDate'],
        campaign: ['title', 'startDate', 'attackType', 'severity', 'sector', 'geography', 'reviewStatus', 'generatedBy', 'generatedDate'],
        'threat-actor': ['name', 'reviewStatus', 'generatedBy', 'generatedDate'],
        'zero-day': ['title', 'cve', 'type', 'platform', 'severity', 'reviewStatus', 'generatedBy', 'generatedDate'],
      };

      for (const field of (requiredFields[task.type] || [])) {
        if (!fm.match(new RegExp(`^${field}:`, 'm'))) {
          issues.push(`Missing field: ${field}`);
        }
      }

      // reviewStatus check
      if (!fm.match(/reviewStatus:\s*["']?draft_ai/)) {
        issues.push('reviewStatus must be draft_ai');
      }

      // H2 count
      const h2s = body.match(/^## .+$/gm) || [];
      if (h2s.length < task.acceptance.min_h2_sections) {
        issues.push(`Only ${h2s.length} H2 sections (need ${task.acceptance.min_h2_sections}+)`);
      }

      // Sources section
      if (!body.match(/^## (?:Sources|References|Sources & References|Sources and References)/mi)) {
        issues.push('Missing Sources section');
      }

      // MITRE in frontmatter
      const mitreCount = (fm.match(/techniqueId:/g) || []).length;
      if (mitreCount < task.acceptance.min_mitre_mappings) {
        issues.push(`Only ${mitreCount} MITRE mappings (need ${task.acceptance.min_mitre_mappings}+)`);
      }

      // EDIT-RULE-030
      const lines = content.split('\n');
      for (let i = 1; i < lines.length - 1; i++) {
        if (lines[i].match(/^#{2,3} /) && lines[i - 1].trim() !== '' && !lines[i - 1].startsWith('---')) {
          issues.push(`EDIT-RULE-030: Missing blank line before heading at line ${i + 1}`);
          break;
        }
      }
    }
  }

  // Build check
  console.log('  Running Astro build...');
  try {
    execSync('npm run build', { cwd: resolve(ROOT, 'site'), stdio: 'pipe' });
    console.log('  Build: PASS');
  } catch (err) {
    issues.push('Astro build failed');
    console.log('  Build: FAIL');
    if (err.stderr) console.log(`  ${err.stderr.toString().split('\n').slice(0, 5).join('\n  ')}`);
  }

  // Results
  console.log();
  if (issues.length === 0) {
    console.log('  ✓ ALL CHECKS PASSED');
    console.log(`\n  Next: git add . && git commit -m "feat: ${task.task_id} — ${task.input.topic.substring(0, 50)}"`);
    console.log(`        git push -u origin ${task.output.branch}`);
    console.log(`        gh pr create --base main`);
    console.log(`        node scripts/pipeline-run-task.mjs --task ${task.task_id} --complete`);
  } else {
    console.log(`  ✗ ${issues.length} ISSUE(S):`);
    issues.forEach(i => console.log(`    - ${i}`));
    console.log('\n  Fix the issues and run --validate again.');
  }
}

// ── Complete task ────────────────────────────────────────────────────────────
function completeTask(task, filePath) {
  task.status = 'complete';
  task.locked_by = null;
  task.locked_at = null;
  task.history = task.history || [];
  task.history.push({
    timestamp: new Date().toISOString(),
    from: task.status,
    to: 'complete',
    agent: (() => { try { return execSync('git config user.name', { encoding: 'utf8' }).trim(); } catch { return 'unknown'; } })(),
    note: 'Article generated, validated, and PR opened',
  });

  saveTask(task, filePath);
  console.log(`  ✓ ${task.task_id} marked complete`);
}

// ── Main ─────────────────────────────────────────────────────────────────────
const args = parseArgs();

console.log(`\n  Threatpedia Pipeline Task Runner\n`);

if (args.action === 'list') {
  listTasks(args.all);
} else if (!args.taskId) {
  console.error('  Usage: node scripts/pipeline-run-task.mjs --task TASK-YYYY-NNNN [--lock|--validate|--complete]');
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
      validateOutput(task);
      break;
    case 'complete':
      completeTask(task, filePath);
      break;
  }
}
