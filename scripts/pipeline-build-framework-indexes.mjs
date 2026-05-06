#!/usr/bin/env node

import { createHash } from 'crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import yaml from 'js-yaml';
import {
  SCHEMA_ATLAS_TECHNIQUE_ID_PATTERN,
  SCHEMA_MITRE_TECHNIQUE_ID_PATTERN,
} from './pipeline-schema.mjs';

const ROOT = resolve(new URL('..', import.meta.url).pathname);
const OUT_DIR = resolve(ROOT, '.github/pipeline/data/frameworks');
const ATLAS_TECHNIQUE_ID_RE = new RegExp(SCHEMA_ATLAS_TECHNIQUE_ID_PATTERN);
const MITRE_TECHNIQUE_ID_RE = new RegExp(SCHEMA_MITRE_TECHNIQUE_ID_PATTERN);
const ATLAS_REFERENCE_NORMALIZATIONS = Object.freeze({
  '{{maschine_compromise.id}}': '{{machine_compromise.id}}',
});

function usage() {
  console.log(`Usage:
  node scripts/pipeline-build-framework-indexes.mjs \\
    --attack-source /path/to/enterprise-attack-19.0.json \\
    --attack-url https://raw.githubusercontent.com/.../enterprise-attack-19.0.json \\
    --attack-github-sha <github-blob-sha> \\
    --atlas-source /path/to/techniques.yaml \\
    --atlas-url https://raw.githubusercontent.com/.../techniques.yaml \\
    --atlas-github-sha <github-blob-sha>
`);
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    }
    if (!arg.startsWith('--')) {
      throw new Error(`Unexpected argument: ${arg}`);
    }
    const key = arg.slice(2);
    args[key] = argv[++i] || '';
  }

  for (const key of [
    'attack-source',
    'attack-url',
    'attack-github-sha',
    'atlas-source',
    'atlas-url',
    'atlas-github-sha',
  ]) {
    if (!args[key]) {
      throw new Error(`Missing required --${key}`);
    }
  }
  return args;
}

function sourceMetadata(filePath, url, githubBlobSha) {
  const bytes = readFileSync(filePath);
  return {
    url,
    githubBlobSha,
    sha256: createHash('sha256').update(bytes).digest('hex'),
    bytes: bytes.length,
  };
}

function compareTechniqueIds(a, b) {
  const aParts = String(a).match(/\d+/g)?.map(Number) || [];
  const bParts = String(b).match(/\d+/g)?.map(Number) || [];
  for (let i = 0; i < Math.max(aParts.length, bParts.length); i += 1) {
    const delta = (aParts[i] || 0) - (bParts[i] || 0);
    if (delta !== 0) return delta;
  }
  return String(a).localeCompare(String(b));
}

function findAttackTechniqueId(object) {
  const ref = object.external_references?.find((entry) => (
    entry?.source_name === 'mitre-attack' &&
    typeof entry.external_id === 'string' &&
    MITRE_TECHNIQUE_ID_RE.test(entry.external_id)
  ));
  return ref?.external_id || null;
}

function normalizeAtlasReference(value) {
  if (!value) return null;
  return ATLAS_REFERENCE_NORMALIZATIONS[value] || value;
}

function buildAttackIndex(args) {
  const raw = JSON.parse(readFileSync(args['attack-source'], 'utf8'));
  const techniques = raw.objects
    .filter((object) => object?.type === 'attack-pattern')
    .map((object) => {
      const id = findAttackTechniqueId(object);
      if (!id) return null;
      return {
        id,
        name: object.name,
        kind: id.includes('.') ? 'subtechnique' : 'technique',
        revoked: Boolean(object.revoked),
        deprecated: Boolean(object.x_mitre_deprecated),
        tactics: (object.kill_chain_phases || [])
          .filter((phase) => phase?.kill_chain_name === 'mitre-attack')
          .map((phase) => phase.phase_name)
          .sort(),
      };
    })
    .filter(Boolean)
    .sort((a, b) => compareTechniqueIds(a.id, b.id));

  return {
    framework: 'MITRE ATT&CK',
    domain: 'enterprise-attack',
    version: 'v19.0',
    source: sourceMetadata(args['attack-source'], args['attack-url'], args['attack-github-sha']),
    techniqueCount: techniques.length,
    activeTechniqueCount: techniques.filter((technique) => !technique.revoked && !technique.deprecated).length,
    techniques,
  };
}

function buildAtlasIndex(args) {
  const raw = yaml.load(readFileSync(args['atlas-source'], 'utf8'));
  if (!Array.isArray(raw)) {
    throw new Error('ATLAS techniques YAML must be an array');
  }

  const techniques = raw
    .filter((object) => object?.['object-type'] === 'technique')
    .map((object) => ({
      id: object.id,
      name: object.name,
      kind: String(object.id).includes('.', 'AML.T0000'.length) ? 'subtechnique' : 'technique',
      revoked: false,
      deprecated: false,
      subtechniqueOf: normalizeAtlasReference(object['subtechnique-of']),
      tactics: Array.isArray(object.tactics) ? [...object.tactics].sort() : [],
      createdDate: object.created_date || null,
      modifiedDate: object.modified_date || null,
    }))
    .filter((object) => ATLAS_TECHNIQUE_ID_RE.test(object.id))
    .sort((a, b) => compareTechniqueIds(a.id, b.id));

  return {
    framework: 'MITRE ATLAS',
    version: 'v5.6.0',
    source: sourceMetadata(args['atlas-source'], args['atlas-url'], args['atlas-github-sha']),
    upstreamNormalizations: [
      {
        field: 'subtechnique-of',
        from: '{{maschine_compromise.id}}',
        to: '{{machine_compromise.id}}',
        reason: 'MITRE ATLAS v5.6.0 upstream YAML uses a misspelled Machine Compromise anchor.',
      },
    ],
    techniqueCount: techniques.length,
    activeTechniqueCount: techniques.filter((technique) => !technique.revoked && !technique.deprecated).length,
    techniques,
  };
}

function writeJson(fileName, payload) {
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(resolve(OUT_DIR, fileName), `${JSON.stringify(payload, null, 2)}\n`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  writeJson('mitre-attack-enterprise-v19.0-techniques.json', buildAttackIndex(args));
  writeJson('mitre-atlas-v5.6.0-techniques.json', buildAtlasIndex(args));
}

main();
