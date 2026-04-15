#!/usr/bin/env node
/**
 * generate-article.mjs — Threatpedia Article Generator
 *
 * Generates spec-compliant markdown articles for the Astro content collections.
 * Uses Claude API to produce articles that follow DATA-STANDARDS v1.0 and
 * EDITORIAL-WORKFLOW-SPEC §14A formatting rules.
 *
 * Usage:
 *   node generate-article.mjs --type incident --topic "Description of the incident"
 *   node generate-article.mjs --type campaign --topic "APT28 phishing campaign 2026"
 *   node generate-article.mjs --type threat-actor --topic "Volt Typhoon"
 *   node generate-article.mjs --type zero-day --topic "CVE-2026-XXXX in Product"
 *
 * Environment:
 *   ANTHROPIC_API_KEY — required (or reads from ../.env.dmbot)
 */

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_CONTENT = resolve(__dirname, '../site/src/content');

// ── Load API key ──────────────────────────────────────────────────────────────
function getApiKey() {
  if (process.env.ANTHROPIC_API_KEY) return process.env.ANTHROPIC_API_KEY;

  // Try reading from .env.dmbot (format: ANTHROPIC_API_KEY=sk-ant-...)
  const envPath = resolve(__dirname, '../../.env.dmbot');
  if (existsSync(envPath)) {
    const content = readFileSync(envPath, 'utf-8');
    const match = content.match(/ANTHROPIC_API_KEY=(.+)/);
    if (match) return match[1].trim();
  }

  // Try .env.kk
  const kkPath = resolve(__dirname, '../../.env.kk');
  if (existsSync(kkPath)) {
    const content = readFileSync(kkPath, 'utf-8');
    const match = content.match(/ANTHROPIC_API_KEY=(.+)/);
    if (match) return match[1].trim();
  }

  console.error('ERROR: No ANTHROPIC_API_KEY found. Set it in environment or .env.dmbot');
  process.exit(1);
}

// ── CLI parsing ───────────────────────────────────────────────────────────────
function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = { type: null, topic: null, model: 'claude-sonnet-4-20250514' };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--type' && args[i + 1]) parsed.type = args[++i];
    if (args[i] === '--topic' && args[i + 1]) parsed.topic = args[++i];
    if (args[i] === '--model' && args[i + 1]) parsed.model = args[++i];
  }

  const validTypes = ['incident', 'campaign', 'threat-actor', 'zero-day'];
  if (!validTypes.includes(parsed.type)) {
    console.error(`Usage: node generate-article.mjs --type <${validTypes.join('|')}> --topic "description"`);
    process.exit(1);
  }
  if (!parsed.topic) {
    console.error('ERROR: --topic is required');
    process.exit(1);
  }
  return parsed;
}

// ── Slug generator ────────────────────────────────────────────────────────────
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

// ── Schema & formatting specs per type ────────────────────────────────────────
const SCHEMAS = {
  incident: {
    dir: 'incidents',
    frontmatterSpec: `
YAML frontmatter fields (all required unless marked optional):
  eventId: string — format TP-YYYY-NNNN (use current year, pick next available number)
  title: string — concise incident name, max 80 chars, NO " | Threatpedia" suffix
  date: date — ISO 8601 YYYY-MM-DD of the incident
  attackType: string — one of: Data Breach, Ransomware, Espionage, Sabotage, Supply Chain, DDoS, Financial, Disinformation, Vulnerability, Access Brokerage, Wiper, DeFi Exploit
  severity: enum — critical | high | medium | low
  sector: string — from taxonomy: Energy & Utilities, Financial Services, Government, Healthcare & Life Sciences, Critical Infrastructure, Technology, Telecommunications, Transportation & Logistics, Education & Research, Media & Entertainment, Retail & Consumer, Manufacturing & Industrial, Legal & Professional Services, Non-Profit & NGO, AI & ML Infrastructure, Cryptocurrency & DeFi
  geography: string — country or region
  threatActor: string (optional, default "Unknown") — attributed group name
  attributionConfidence: enum (optional, default A4) — A1 (confirmed) through A6 (unknown)
  reviewStatus: must be "draft_ai"
  confidenceGrade: enum (optional, default C) — A through F
  generatedBy: must be "ai_ingestion"
  generatedDate: date — today's date ISO 8601
  cves: array of strings (optional) — CVE-YYYY-NNNNN format
  relatedSlugs: array of strings (optional)
  tags: array of strings — relevant keywords
  sources: array of source objects (minimum 3):
    - url: string
      publisher: string
      publisherType: government | vendor | media | research | community
      reliability: R1 | R2 | R3 | R4
      publicationDate: string (YYYY-MM-DD)
      archived: false
  mitreMappings: array of MITRE objects (minimum 1):
    - techniqueId: string (T1234 or T1234.001)
      techniqueName: string
      tactic: string (Initial Access, Execution, Persistence, etc.)
      notes: string (evidence for this mapping)`,
    bodySpec: `
Required H2 sections IN THIS ORDER (use exactly these headings):

## Executive Summary
1-2 paragraphs. What happened, who was affected, how severe.

## Technical Analysis
Deep dive into the attack methodology. Multiple paragraphs.

## Attack Chain
Use ### Stage N: Title format (EDIT-RULE-036):
### Stage 1: Initial Access
[paragraph]
### Stage 2: Lateral Movement
[paragraph]
(etc, typically 3-6 stages)

## MITRE ATT&CK Mapping
Group by tactic using ### headings. One technique per line (EDIT-RULE-033):
### Initial Access
T1190 — Exploit Public-Facing Application: Evidence description here
### Execution
T1059.001 — PowerShell: Evidence description here

## Impact Assessment
Quantified impact: records exposed, financial loss, operational disruption.

## Timeline
Use ### YYYY-MM-DD — Title format (EDIT-RULE-040):
### 2026-01-15 — Initial Breach Detected
[paragraph]
### 2026-01-17 — Containment Initiated
[paragraph]
(chronological order, earliest first)

## Remediation & Mitigation
Detection guidance, containment steps, lessons learned.

## Indicators of Compromise
Group by type using ### headings (EDIT-RULE-045):
### Network Indicators
- IP or domain — description
### File Hashes
- filename (hash type: hash value)

## Sources & References
Numbered markdown list (EDIT-RULE-042):
1. [Title](URL) — Publisher, YYYY-MM-DD
2. [Title](URL) — Publisher, YYYY-MM-DD
(minimum 3, must match frontmatter sources array)`
  },

  campaign: {
    dir: 'campaigns',
    frontmatterSpec: `
YAML frontmatter fields (all required unless marked optional):
  campaignId: string (optional) — format TP-CAMP-YYYY-NNNN
  title: string — campaign name, max 80 chars
  startDate: date — ISO 8601 YYYY-MM-DD
  endDate: date (optional) — null if ongoing
  ongoing: boolean (optional, default false)
  attackType: string — same taxonomy as incidents
  severity: enum — critical | high | medium | low
  sector: string — from sector taxonomy
  geography: string — country or region
  threatActor: string (optional, default "Unknown")
  attributionConfidence: enum (optional, default A4) — A1 through A6
  reviewStatus: must be "draft_ai"
  confidenceGrade: enum (optional, default C) — A through F
  generatedBy: must be "ai_ingestion"
  generatedDate: date — today's date
  cves: array of strings (optional)
  relatedIncidents: array of strings (optional) — linked incident slugs
  relatedSlugs: array of strings (optional)
  tags: array of strings
  sources: array of source objects (minimum 3, same schema as incidents)
  mitreMappings: array of MITRE objects (minimum 1, same schema as incidents)`,
    bodySpec: `
Required H2 sections IN THIS ORDER:

## Executive Summary
Campaign overview: who, what, when, scope, current status.

## Technical Analysis
TTPs, malware families, infrastructure patterns across the campaign.

## Attack Chain
Typical attack pattern used across campaign events.
### Stage N: Title format (same as incidents)

## MITRE ATT&CK Mapping
Campaign-level techniques. Same format as incidents.

## Impact Assessment
Aggregate impact across all campaign events.

## Timeline
Major events/shifts over the campaign duration.
### YYYY-MM-DD — Title format.

## Remediation & Mitigation
Detection rules, defensive measures.

## Indicators of Compromise
IOCs seen across campaign events. Grouped by type.

## Sources & References
Numbered list, minimum 3.`
  },

  'threat-actor': {
    dir: 'threat-actors',
    frontmatterSpec: `
YAML frontmatter fields (all required unless marked optional):
  name: string — canonical threat actor name
  aliases: array of strings (optional) — alternative names across vendors
  affiliation: string (optional, default "Unknown") — nation-state or organization
  motivation: string (optional, default "Unknown") — Espionage, Financial, Sabotage, Hacktivism, Unknown
  status: enum (optional, default "unknown") — active | inactive | unknown
  country: string (optional) — ISO country code or full name
  firstSeen: string (optional) — year or YYYY-MM-DD
  lastSeen: string (optional) — year or YYYY-MM-DD
  targetSectors: array of strings (optional) — from sector taxonomy
  targetGeographies: array of strings (optional)
  tools: array of strings (optional) — known malware/tool names
  knownTools: array of strings (optional) — same as tools, for schema compatibility
  mitreMappings: array of MITRE objects (optional)
  reviewStatus: must be "draft_ai"
  generatedBy: must be "ai_ingestion"
  generatedDate: date — today's date
  tags: array of strings`,
    bodySpec: `
Required H2 sections IN THIS ORDER:

## Overview
Who is this actor: origin, founding/first observed, nation-state affiliation, primary motivation.
2-3 paragraphs.

## Tactics, Techniques & Procedures (TTPs)
Common attack vectors, malware families, infrastructure patterns.
Include MITRE ATT&CK techniques in em-dash format where relevant.

## Targeted Industries & Organizations
Sectors, notable victims, strategic focus areas.

## Attributable Attacks Timeline
Major campaigns/incidents attributed to this actor.
### YYYY — Campaign/Incident Name
[paragraph description]
(chronological order)

## Cross-Vendor Naming Reference
Table or list mapping vendor names:
- CrowdStrike: [name]
- Mandiant/Google: [name]
- Microsoft: [name]
- MITRE: [name]

## References & Sources
Numbered list:
1. [Title](URL) — Publisher, YYYY-MM-DD`
  },

  'zero-day': {
    dir: 'zero-days',
    frontmatterSpec: `
YAML frontmatter fields (all required unless marked optional):
  exploitId: string (optional) — format TP-EXP-NNNN
  title: string — vulnerability name, include CVE if applicable
  cve: string — CVE-YYYY-NNNNN format
  type: string — Code Execution, Privilege Escalation, Information Disclosure, Denial of Service, Authentication Bypass, Buffer Overflow, SQL Injection, etc.
  platform: string — affected software with version (e.g., "FortiClient EMS < 7.4.1")
  severity: enum — critical | high | medium | low
  status: enum (optional, default "unknown") — active | patched | mitigated | unknown
  isZeroDay: boolean (optional, default true)
  disclosedDate: date (optional) — when publicly disclosed
  patchDate: date (optional) — when vendor released fix
  researcher: string (optional) — who discovered it
  confirmedBy: string (optional) — authority that confirmed (CISA, NVD, etc.)
  daysInTheWild: number (optional, nullable) — days between discovery and patch
  cisaKev: boolean (optional, default false) — CISA Known Exploited Vulnerabilities
  reviewStatus: must be "draft_ai"
  generatedBy: must be "ai_ingestion"
  generatedDate: date — today's date
  relatedIncidents: array of strings (optional) — incident slugs
  relatedActors: array of strings (optional) — actor slugs
  tags: array of strings`,
    bodySpec: `
Required H2 sections IN THIS ORDER:

## Severity Assessment
Structured assessment with scores:
- Exploitability: X/10
- Impact: X/10
- Weaponization Risk: High/Medium/Low
- Patch Urgency: Critical/High/Medium/Low
- Detection Coverage: High/Medium/Low

## Summary
What is this vulnerability, what software, what's the impact. 1-2 paragraphs.

## Exploit Chain
How the vulnerability is exploited step-by-step:
### Stage 1: Title
[paragraph]
### Stage 2: Title
[paragraph]

## Detection Guidance
Signatures, behavioral indicators, log patterns to detect exploitation.

## Indicators of Compromise
IOCs from observed exploitation. Grouped by type with ### headings.

## Pre-Patch Mitigations
Workarounds available before/without the patch.

## Disclosure Timeline
### YYYY-MM-DD — Event
[paragraph]
(discovery, vendor notification, public disclosure, patch release, CISA KEV listing)

## Sources & References
Numbered list, minimum 3.`
  }
};

// ── System prompt ─────────────────────────────────────────────────────────────
function buildSystemPrompt(type) {
  const schema = SCHEMAS[type];
  return `You are a cybersecurity threat intelligence analyst writing articles for Threatpedia, an authoritative open-source cyber threat encyclopedia.

You produce factual, well-sourced articles. You NEVER fabricate sources — every URL, publisher, and date must be real and verifiable. If you cannot find real sources, use placeholder URLs with a <!-- FIXME: SOURCE RECOVERY REQUIRED --> comment.

You NEVER fabricate MITRE ATT&CK technique IDs. Every T-code must be a real technique from ATT&CK v16+. If unsure, omit rather than guess.

FORMATTING RULES (EDITORIAL-WORKFLOW-SPEC §14A — strictly enforced):
- Blank line before and after EVERY heading (## and ###)
- Blank line between paragraphs
- NO leading whitespace on content lines
- NO HTML tags — pure markdown only
- NO <br> tags
- MITRE techniques: one per line, format "T1234.001 — Name: Evidence" (em-dash separator)
- Attack stages: "### Stage N: Title" format
- Timeline entries: "### YYYY-MM-DD — Title" format
- Sources: numbered markdown list "N. [Title](URL) — Publisher, YYYY-MM-DD"
- IOCs grouped by type using ### sub-headings

OUTPUT FORMAT:
Return ONLY the complete markdown file content starting with --- (YAML frontmatter) and ending with the last line of the article. No explanatory text before or after. No code fences around the output.

FRONTMATTER SCHEMA FOR ${type.toUpperCase()}:
${schema.frontmatterSpec}

BODY STRUCTURE FOR ${type.toUpperCase()}:
${schema.bodySpec}

TODAY'S DATE: ${new Date().toISOString().split('T')[0]}`;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const { type, topic, model } = parseArgs();
  const apiKey = getApiKey();
  const schema = SCHEMAS[type];

  console.log(`\n  Threatpedia Article Generator`);
  console.log(`  ─────────────────────────────`);
  console.log(`  Type:  ${type}`);
  console.log(`  Topic: ${topic}`);
  console.log(`  Model: ${model}`);
  console.log(`  Output: site/src/content/${schema.dir}/\n`);

  const client = new Anthropic({ apiKey });

  console.log('  Generating article...');
  const startTime = Date.now();

  const response = await client.messages.create({
    model,
    max_tokens: 8192,
    system: buildSystemPrompt(type),
    messages: [
      {
        role: 'user',
        content: `Write a complete Threatpedia ${type} article about: ${topic}

Research this topic thoroughly using your knowledge. The article must be factually accurate and based on real events, real CVEs, real MITRE techniques, and real sources where possible.

For the sources section: use real published articles, advisories, and reports. Include the actual publisher name and approximate publication date. If you know the real URL, use it. If not, use a plausible URL structure for that publisher and mark it with <!-- FIXME: VERIFY URL -->.

Generate the complete markdown file now.`
      }
    ]
  });

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const content = response.content[0].text;
  const usage = response.usage;

  console.log(`  Done in ${elapsed}s (${usage.input_tokens} in / ${usage.output_tokens} out)`);

  // Extract slug from frontmatter title
  let slug;
  const titleMatch = content.match(/^title:\s*["']?(.+?)["']?\s*$/m);
  if (titleMatch) {
    slug = slugify(titleMatch[1]);
  } else {
    slug = slugify(topic);
  }

  // For threat actors, use a simpler slug from the name field
  if (type === 'threat-actor') {
    const nameMatch = content.match(/^name:\s*["']?(.+?)["']?\s*$/m);
    if (nameMatch) slug = slugify(nameMatch[1]);
  }

  const outPath = resolve(SITE_CONTENT, schema.dir, `${slug}.md`);

  if (existsSync(outPath)) {
    console.log(`\n  WARNING: ${outPath} already exists.`);
    console.log(`  Writing to ${slug}-new.md instead.\n`);
    writeFileSync(resolve(SITE_CONTENT, schema.dir, `${slug}-new.md`), content, 'utf-8');
  } else {
    writeFileSync(outPath, content, 'utf-8');
  }

  console.log(`  Written: site/src/content/${schema.dir}/${slug}.md`);

  // Quick validation
  const issues = validate(content, type);
  if (issues.length === 0) {
    console.log('  Validation: PASS\n');
  } else {
    console.log(`  Validation: ${issues.length} issue(s):`);
    issues.forEach((issue) => console.log(`    - ${issue}`));
    console.log();
  }
}

// ── Basic validation ──────────────────────────────────────────────────────────
function validate(content, type) {
  const issues = [];

  // Check frontmatter exists
  if (!content.startsWith('---')) {
    issues.push('Missing frontmatter (must start with ---)');
    return issues;
  }

  const fmEnd = content.indexOf('---', 3);
  if (fmEnd === -1) {
    issues.push('Frontmatter not closed (missing second ---)');
    return issues;
  }

  const frontmatter = content.slice(3, fmEnd);
  const body = content.slice(fmEnd + 3);

  // Type-specific required frontmatter fields
  const requiredFields = {
    incident: ['eventId', 'title', 'date', 'attackType', 'severity', 'sector', 'geography', 'reviewStatus', 'generatedBy', 'generatedDate'],
    campaign: ['title', 'startDate', 'attackType', 'severity', 'sector', 'geography', 'reviewStatus', 'generatedBy', 'generatedDate'],
    'threat-actor': ['name', 'reviewStatus', 'generatedBy', 'generatedDate'],
    'zero-day': ['title', 'cve', 'type', 'platform', 'severity', 'reviewStatus', 'generatedBy', 'generatedDate'],
  };

  for (const field of requiredFields[type]) {
    if (!frontmatter.match(new RegExp(`^${field}:`, 'm'))) {
      issues.push(`Missing required frontmatter field: ${field}`);
    }
  }

  // Check reviewStatus is draft_ai
  if (!frontmatter.includes('reviewStatus:') || !frontmatter.match(/reviewStatus:\s*["']?draft_ai/)) {
    issues.push('reviewStatus must be draft_ai');
  }

  // Check H2 sections exist
  const h2s = body.match(/^## .+$/gm) || [];
  if (h2s.length < 3) {
    issues.push(`Only ${h2s.length} H2 sections found (expected at least 5+)`);
  }

  // Check for blank lines around headings (EDIT-RULE-030)
  const lines = content.split('\n');
  for (let i = 1; i < lines.length - 1; i++) {
    if (lines[i].match(/^#{2,3} /)) {
      if (lines[i - 1].trim() !== '' && !lines[i - 1].startsWith('---')) {
        issues.push(`EDIT-RULE-030: Missing blank line before heading at line ${i + 1}: "${lines[i]}"`);
        break; // Only report first occurrence
      }
    }
  }

  // Check MITRE technique format (EDIT-RULE-033)
  const mitreLines = body.match(/^T\d{4}/gm) || [];
  for (const line of mitreLines) {
    if (!line.match(/^T\d{4}(\.\d{3})?\s*—/)) {
      issues.push(`EDIT-RULE-033: MITRE technique missing em-dash separator: "${line.slice(0, 50)}..."`);
      break;
    }
  }

  // Check sources section exists and has numbered list
  if (!body.match(/^## Sources & References|^## References & Sources/m)) {
    issues.push('Missing Sources & References section');
  }

  // Check for leading whitespace (EDIT-RULE-032)
  const bodyLines = body.split('\n');
  for (let i = 0; i < bodyLines.length; i++) {
    if (bodyLines[i].match(/^[ \t]+\S/) && !bodyLines[i].match(/^( {2,4}|- |\d+\.|```)/)) {
      issues.push(`EDIT-RULE-032: Leading whitespace at body line ${i + 1}: "${bodyLines[i].slice(0, 50)}..."`);
      break;
    }
  }

  return issues;
}

main().catch((err) => {
  console.error('\n  ERROR:', err.message);
  if (err.status === 401) console.error('  Check your ANTHROPIC_API_KEY');
  process.exit(1);
});
