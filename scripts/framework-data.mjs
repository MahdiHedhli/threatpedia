import { existsSync, readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const FRAMEWORK_DATA_DIR = resolve(ROOT, '.github/pipeline/data/frameworks');

const ATTACK_DATA_FILE = resolve(FRAMEWORK_DATA_DIR, 'mitre-attack-enterprise-v19.0-techniques.json');
const ATLAS_DATA_FILE = resolve(FRAMEWORK_DATA_DIR, 'mitre-atlas-v5.6.0-techniques.json');

let attackData = null;
let atlasData = null;

function loadJson(filePath) {
  if (!existsSync(filePath)) {
    throw new Error(`Pinned framework data file not found: ${filePath}`);
  }
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function buildTechniqueMap(data) {
  const techniques = Array.isArray(data?.techniques) ? data.techniques : [];
  return new Map(techniques.map((technique) => [technique.id, technique]));
}

export function getAttackEnterpriseData() {
  if (!attackData) {
    const data = loadJson(ATTACK_DATA_FILE);
    attackData = {
      ...data,
      techniqueById: buildTechniqueMap(data),
    };
  }
  return attackData;
}

export function getAtlasData() {
  if (!atlasData) {
    const data = loadJson(ATLAS_DATA_FILE);
    atlasData = {
      ...data,
      techniqueById: buildTechniqueMap(data),
    };
  }
  return atlasData;
}

export function getAttackEnterpriseTechnique(techniqueId) {
  return getAttackEnterpriseData().techniqueById.get(techniqueId) || null;
}

export function getAtlasTechnique(techniqueId) {
  return getAtlasData().techniqueById.get(techniqueId) || null;
}

export function normalizeFrameworkName(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

export function isPinnedAttackVersion(value) {
  const version = normalizeFrameworkName(value);
  return version === '' || version === 'v19' || version === 'v19.0';
}

export function isPinnedAtlasVersion(value) {
  const version = normalizeFrameworkName(value);
  return version === '' || version === '5.6.0' || version === 'v5.6.0';
}
