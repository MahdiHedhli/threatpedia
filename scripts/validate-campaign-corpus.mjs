#!/usr/bin/env node

import { readdirSync, readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const campaignsDir = resolve(__dirname, '../site/src/content/campaigns');

const REQUIRED_HEADINGS = [
  'Executive Summary',
  'Technical Analysis',
  'Attack Chain',
  'MITRE ATT&CK Mapping',
  'Timeline',
  'Remediation & Mitigation',
  'Sources & References',
];

const OPTIONAL_HEADINGS = new Set([
  'Indicators of Compromise',
  'Discrepancies Across Disclosures',
  'Historical Context',
]);

const ALLOWED_HEADINGS = new Set([...REQUIRED_HEADINGS, ...OPTIONAL_HEADINGS]);

const errors = [];
const warnings = [];
const ids = new Map();

function fail(file, message) {
  errors.push(`${file}: ${message}`);
}

function warn(file, message) {
  warnings.push(`${file}: ${message}`);
}

function extractFrontmatter(content) {
  if (!content.startsWith('---\n')) return '';
  const end = content.indexOf('\n---\n', 4);
  return end === -1 ? '' : content.slice(4, end);
}

function readScalar(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*["']?([^\\n"']+)["']?\\s*$`, 'm'));
  return match ? match[1].trim() : null;
}

function readList(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*\\n((?:\\s+-\\s+.*\\n)*)`, 'm'));
  if (!match) return [];
  return match[1]
    .split('\n')
    .map((line) => line.match(/^\s+-\s+["']?(.+?)["']?\s*$/))
    .filter(Boolean)
    .map((item) => item[1]);
}

function readHeadings(content) {
  const headings = [];
  const pattern = /^##\s+(.+)$/gm;
  let match = pattern.exec(content);
  while (match) {
    headings.push(match[1].trim());
    match = pattern.exec(content);
  }
  return headings;
}

for (const file of readdirSync(campaignsDir).filter((name) => name.endsWith('.md')).sort()) {
  const absPath = resolve(campaignsDir, file);
  const content = readFileSync(absPath, 'utf8');
  const frontmatter = extractFrontmatter(content);
  const campaignId = readScalar(frontmatter, 'campaignId');
  const relatedIncidents = readList(frontmatter, 'relatedIncidents');
  const headings = readHeadings(content);

  if (!campaignId) {
    fail(file, 'missing required campaignId');
  } else if (ids.has(campaignId)) {
    fail(file, `duplicate campaignId ${campaignId} (also used by ${ids.get(campaignId)})`);
  } else {
    ids.set(campaignId, file);
  }

  if (/^relatedSlugs:/m.test(frontmatter)) {
    fail(file, 'contains legacy relatedSlugs frontmatter; campaigns must use relatedIncidents only');
  }

  for (const required of REQUIRED_HEADINGS) {
    if (!headings.includes(required)) {
      fail(file, `missing required H2 heading "${required}"`);
    }
  }

  for (const heading of headings) {
    if (!ALLOWED_HEADINGS.has(heading)) {
      fail(file, `contains non-spec H2 heading "${heading}"`);
    }
  }

  const requiredPositions = REQUIRED_HEADINGS.map((heading) => headings.indexOf(heading));
  for (let i = 1; i < requiredPositions.length; i += 1) {
    if (requiredPositions[i] !== -1 && requiredPositions[i - 1] !== -1 && requiredPositions[i] < requiredPositions[i - 1]) {
      fail(file, `required H2 headings are out of order around "${REQUIRED_HEADINGS[i]}"`);
      break;
    }
  }

  if (relatedIncidents.length < 2) {
    warn(file, `has ${relatedIncidents.length} related incident(s); spec target is 2+ confirmed incidents`);
  }
}

if (warnings.length > 0) {
  console.warn('Campaign validator warnings:');
  for (const warning of warnings) console.warn(`  - ${warning}`);
}

if (errors.length > 0) {
  console.error('Campaign validator errors:');
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(`Campaign validator passed for ${ids.size} campaign file(s).`);
