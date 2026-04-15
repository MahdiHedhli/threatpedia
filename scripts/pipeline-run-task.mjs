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
 *   node scripts/pipeline-run-task.mjs --task TASK-2026-0001 --complete # Mark complete
 *   node scripts/pipeline-run-task.mjs --list                          # List pending tasks
 *   node scripts/pipeline-run-task.mjs --list --all                    # List all tasks
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { resolve, dirname, basename } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const TASKS_DIR = resolve(ROOT, '.github/pipeline/tasks');
const CONTENT_DIR = resolve(ROOT, 'site/src/content');

// ── Editorial commentary words (EDIT-RULE-030) ─────────────────────────────
const EDITORIAL_WORDS = [
  'notably', 'significantly', 'interestingly', 'importantly',
  'remarkably', 'unfortunately', 'surprisingly', 'crucially',
  'strikingly', 'alarmingly', 'disturbingly', 'fascinatingly',
];
const EDITORIAL_RE = new RegExp(`\\b(${EDITORIAL_WORDS.join('|')})\\b`, 'gi');

// ── Source object schema reference ──────────────────────────────────────────
const SOURCE_SCHEMA = `  Each source object requires:
    url: string (valid URL)
    publisher: string (organization name)
    publisherType: enum — government | vendor | media | research | community
    reliability: enum — R1 (confirmed) | R2 (probably true) | R3 (possibly true) | R4 (doubtful)
    publicationDate: string (optional, ISO 8601)
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
  reviewStatus: must be "draft_ai"
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
  campaignId: string (optional) — format TP-CAMP-YYYY-NNNN
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
  reviewStatus: must be "draft_ai"
  confidenceGrade: enum (optional, default C) — A through F
  generatedBy: string — your agent identity
  generatedDate: date — today's date
  cves: array of strings (optional)
  relatedIncidents: array of strings (optional)
  relatedSlugs: array of strings (optional)
  tags: array of strings
  sources: array of structured source objects — MINIMUM 3, at least 1 government source
${SOURCE_SCHEMA}
  mitreMappings: array of MITRE ATT&CK mapping objects — MINIMUM 1`,
    bodySpec: `Required H2 sections (minimum 5):
  ## Summary — campaign overview, objectives, scope
  ## Technical Analysis — tools, techniques, infrastructure
  ## Attack Chain — multi-stage breakdown
  ## Impact Assessment — affected organizations, sectors, quantified damage
  ## Attribution — threat actor linkage and confidence
  ## Timeline — key events chronologically
  ## Sources & References — each source as a markdown hyperlink: [Publisher: Title](url). Must match frontmatter sources array.`,
    requiredFields: ['title', 'startDate', 'attackType', 'severity', 'sector', 'geography', 'reviewStatus', 'generatedBy', 'generatedDate'],
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
  reviewStatus: must be "draft_ai"
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
  reviewStatus: must be "draft_ai"
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
const RULES = `
  CRITICAL RULES — the validator enforces ALL of these:

  1. reviewStatus MUST be "draft_ai" (not certified, not under_review)
  2. generatedBy MUST be your agent name (not "ai_ingestion" — use YOUR identity)
  3. sources MUST be structured objects in frontmatter (not just prose in body)
     — Minimum 3 source objects
     — At least 1 must have publisherType: "government"
     — URLs must be real and verifiable (never fabricate)
  4. mitreMappings MUST be in frontmatter (not just mentioned in body text)
  5. EDIT-RULE-030: Do NOT use editorial commentary words:
     ${EDITORIAL_WORDS.join(', ')}
  6. Every H2 heading must have a blank line before it
  7. exploitId format is TP-EXP-YYYY-NNNN (year-namespaced per ADR 0007)
  8. Sources & References body section must use markdown hyperlinks: [Title](url)
     — Every frontmatter source URL must appear as a clickable link in the body
     — Format: - [Publisher: Title](https://...) — Publisher, YYYY-MM-DD
  9. The Astro build must pass: cd site && npm run build`;

// ── CLI Parsing ─────────────────────────────────────────────────────────────
function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = { taskId: null, action: 'brief', all: false, file: null };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--task' && args[i + 1]) parsed.taskId = args[++i];
    if (args[i] === '--lock') parsed.action = 'lock';
    if (args[i] === '--validate') parsed.action = 'validate';
    if (args[i] === '--complete') parsed.action = 'complete';
    if (args[i] === '--list') parsed.action = 'list';
    if (args[i] === '--all') parsed.all = true;
    if (args[i] === '--file' && args[i + 1]) parsed.file = args[++i];
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
  review_status:         draft_ai
  edit_rule_030:         no editorial commentary words
  astro_build:           must pass
${RULES}

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
  7. Open PR:          gh pr create --base main
  8. Mark complete:    node scripts/pipeline-run-task.mjs --task ${task.task_id} --complete

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

// ── Parse YAML frontmatter (lightweight, no deps) ───────────────────────────
function parseFrontmatterSources(fm) {
  const sources = [];
  const sourceBlocks = fm.split(/^  - url:/m);

  for (let i = 1; i < sourceBlocks.length; i++) {
    const block = '  - url:' + sourceBlocks[i];
    const source = {};

    const urlMatch = block.match(/url:\s*["']?([^\s"'\n]+)/);
    if (urlMatch) source.url = urlMatch[1];

    const publisherMatch = block.match(/publisher:\s*["']?([^\n"']+)/);
    if (publisherMatch) source.publisher = publisherMatch[1].trim().replace(/["']$/, '');

    const typeMatch = block.match(/publisherType:\s*["']?(\w+)/);
    if (typeMatch) source.publisherType = typeMatch[1];

    const reliabilityMatch = block.match(/reliability:\s*["']?(R[1-4])/);
    if (reliabilityMatch) source.reliability = reliabilityMatch[1];

    sources.push(source);
  }

  return sources;
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

  // ── 1. Frontmatter structure ──────────────────────────────────────────────
  if (!content.startsWith('---')) {
    issues.push('Missing frontmatter (must start with ---)');
  } else {
    const fmEnd = content.indexOf('---', 3);
    if (fmEnd === -1) {
      issues.push('Frontmatter not closed (missing closing ---)');
    } else {
      const fm = content.slice(3, fmEnd);
      const body = content.slice(fmEnd + 3);

      // ── 2. Required fields ────────────────────────────────────────────────
      for (const field of (schema.requiredFields || [])) {
        if (!fm.match(new RegExp(`^${field}:`, 'm'))) {
          issues.push(`Missing required field: ${field}`);
        }
      }

      // ── 3. reviewStatus ───────────────────────────────────────────────────
      if (!fm.match(/reviewStatus:\s*["']?draft_ai/)) {
        issues.push('reviewStatus must be "draft_ai"');
      }

      // ── 4. ID format (if applicable) ──────────────────────────────────────
      if (schema.idField && schema.idPattern) {
        const idMatch = fm.match(new RegExp(`^${schema.idField}:\\s*["']?([^\\s"'\\n]+)`, 'm'));
        if (idMatch && !schema.idPattern.test(idMatch[1])) {
          issues.push(`${schema.idField} format invalid: "${idMatch[1]}" — expected pattern: ${schema.idPattern}`);
        }
      }

      // ── 5. Structured sources in frontmatter ──────────────────────────────
      const minSources = acceptance.min_sources ?? 3;
      const sources = parseFrontmatterSources(fm);
      const sourceCount = sources.length;

      if (sourceCount < minSources) {
        issues.push(`Only ${sourceCount} structured source(s) in frontmatter (need ${minSources}+). Sources must be YAML objects with url, publisher, publisherType, reliability — not just prose in the body.`);
      }

      // Check for government source
      if (sourceCount > 0) {
        const hasGovSource = sources.some(s => s.publisherType === 'government');
        if (!hasGovSource) {
          issues.push('No government source found. At least 1 source must have publisherType: "government" (CISA, NCSC, FBI, NSA, etc.)');
        }
      }

      // Check source completeness
      for (let i = 0; i < sources.length; i++) {
        const s = sources[i];
        if (!s.url) issues.push(`Source ${i + 1}: missing url`);
        if (!s.publisher) warnings.push(`Source ${i + 1}: missing publisher`);
        if (!s.publisherType) issues.push(`Source ${i + 1}: missing publisherType`);
        if (!s.reliability) warnings.push(`Source ${i + 1}: missing reliability`);
      }

      // ── 6. MITRE mappings in frontmatter ──────────────────────────────────
      const minMitre = acceptance.min_mitre_mappings ?? 1;
      const mitreCount = (fm.match(/techniqueId:/g) || []).length;
      if (mitreCount < minMitre) {
        issues.push(`Only ${mitreCount} MITRE mapping(s) in frontmatter (need ${minMitre}+). Add mitreMappings array with techniqueId, techniqueName fields.`);
      }

      // Validate MITRE technique ID format
      const techniqueIds = [...fm.matchAll(/techniqueId:\s*["']?(T\d{4}(?:\.\d{3})?)/g)];
      for (const [, tid] of techniqueIds) {
        if (!/^T\d{4}(\.\d{3})?$/.test(tid)) {
          issues.push(`Invalid MITRE technique ID: "${tid}" — expected format: T####[.###]`);
        }
      }

      // ── 7. H2 section count ───────────────────────────────────────────────
      const minH2 = acceptance.min_h2_sections ?? 5;
      const h2s = body.match(/^## .+$/gm) || [];
      if (h2s.length < minH2) {
        issues.push(`Only ${h2s.length} H2 section(s) (need ${minH2}+)`);
      }

      // ── 8. Sources section in body ────────────────────────────────────────
      const sourcesHeadingMatch = body.match(/^## (?:Sources|References|Sources & References|Sources and References)/mi);
      if (!sourcesHeadingMatch) {
        issues.push('Missing Sources/References section in body');
      } else {
        // Extract the Sources section text (from heading to next H2 or end)
        const sourcesStart = body.indexOf(sourcesHeadingMatch[0]);
        const afterSources = body.slice(sourcesStart + sourcesHeadingMatch[0].length);
        const nextH2 = afterSources.search(/^## /m);
        const sourcesBody = nextH2 === -1 ? afterSources : afterSources.slice(0, nextH2);

        // Check for markdown links [text](url)
        const markdownLinks = sourcesBody.match(/\[([^\]]+)\]\(https?:\/\/[^\)]+\)/g) || [];
        if (markdownLinks.length === 0) {
          issues.push(`Sources section has no hyperlinks. Each source must be a markdown link: [Title](url). The URLs from your frontmatter sources: array must appear as clickable links in the body.`);
        } else if (sourceCount > 0 && markdownLinks.length < sourceCount) {
          warnings.push(`Sources section has ${markdownLinks.length} link(s) but frontmatter has ${sourceCount} source(s). Each frontmatter source should have a corresponding markdown link in the body.`);
        }
      }

      // ── 9. EDIT-RULE-030: editorial commentary words ──────────────────────
      const bodyLines = body.split('\n');
      const editorialHits = [];
      for (let i = 0; i < bodyLines.length; i++) {
        const line = bodyLines[i];
        // Skip headings, code blocks, and source URLs
        if (line.startsWith('#') || line.startsWith('```') || line.startsWith('  - url:')) continue;
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

      // ── 10. EDIT-RULE-030: blank lines before headings ────────────────────
      const allLines = content.split('\n');
      for (let i = 1; i < allLines.length; i++) {
        if (allLines[i].match(/^#{2,3} /) && allLines[i - 1].trim() !== '' && !allLines[i - 1].startsWith('---')) {
          issues.push(`EDIT-RULE-030: Missing blank line before heading at line ${i + 1}: "${allLines[i].substring(0, 60)}"`);
          break; // Report first occurrence only
        }
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
    console.log(`        gh pr create --base main`);
    console.log(`        node scripts/pipeline-run-task.mjs --task ${task.task_id} --complete`);
  } else {
    console.log(`  ✗ ${issues.length} ISSUE(S):`);
    issues.forEach(i => console.log(`    - ${i}`));
    console.log('\n  Fix the issues and run --validate again.');
  }

  return issues.length === 0;
}

// ── Complete task ───────────────────────────────────────────────────────────
function completeTask(task, filePath) {
  let agent = 'unknown';
  try { agent = execSync('git config user.name', { encoding: 'utf8' }).trim(); } catch {}

  task.status = 'complete';
  task.locked_by = null;
  task.locked_at = null;
  task.history = task.history || [];
  task.history.push({
    timestamp: new Date().toISOString(),
    from: 'locked',
    to: 'complete',
    agent,
    note: 'Article generated, validated, and PR opened',
  });

  saveTask(task, filePath);
  console.log(`  ✓ ${task.task_id} marked complete`);
}

// ── Main ────────────────────────────────────────────────────────────────────
const args = parseArgs();

console.log(`\n  Threatpedia Pipeline Task Runner v2\n`);

if (args.action === 'list') {
  listTasks(args.all);
} else if (!args.taskId) {
  console.error('  Usage: node scripts/pipeline-run-task.mjs --task TASK-YYYY-NNNN [--lock|--validate|--complete]');
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
    case 'complete':
      completeTask(task, filePath);
      break;
  }
}
