import {
  SCHEMA_ATTACK_VERSION_PATTERN,
  SCHEMA_ATLAS_TECHNIQUE_ID_PATTERN,
  SCHEMA_ATLAS_VERSION_PATTERN,
  SCHEMA_FRAMEWORK_MAPPING_VALUES,
  SCHEMA_MAPPING_CONFIDENCE_VALUES,
  SCHEMA_MITRE_TECHNIQUE_ID_PATTERN,
} from './pipeline-schema.mjs';
import {
  getAtlasData,
  getAtlasTechnique,
  getAttackEnterpriseData,
  getAttackEnterpriseTechnique,
  isPinnedAtlasVersion,
  isPinnedAttackVersion,
  normalizeFrameworkName,
} from './framework-data.mjs';

const ATTACK_VERSION_RE = new RegExp(SCHEMA_ATTACK_VERSION_PATTERN);
const ATLAS_TECHNIQUE_ID_RE = new RegExp(SCHEMA_ATLAS_TECHNIQUE_ID_PATTERN);
const ATLAS_VERSION_RE = new RegExp(SCHEMA_ATLAS_VERSION_PATTERN);
const MITRE_TECHNIQUE_ID_RE = new RegExp(SCHEMA_MITRE_TECHNIQUE_ID_PATTERN);

function mappingLabel(prefix, index) {
  return `${prefix} ${index + 1}`;
}

function trimOptionalString(value) {
  return value ? String(value).trim() : '';
}

function getAttackVersion(mapping) {
  return mapping['attack-version'] ?? mapping.attackVersion ?? mapping.attack_version;
}

function getAtlasVersion(mapping) {
  return mapping['atlas-version'] ?? mapping.atlasVersion ?? mapping.atlas_version;
}

function getFrameworkMappingId(mapping) {
  return trimOptionalString(mapping['mapping-id'] ?? mapping.mappingId);
}

function getFrameworkMappingName(mapping) {
  return normalizeFrameworkName(mapping['mapping-name'] ?? mapping.mappingName);
}

export function getMitreMappingValidationIssues(mappings, options = {}) {
  const labelPrefix = options.labelPrefix || 'MITRE mapping';
  const issues = [];
  const attackData = getAttackEnterpriseData();

  for (let i = 0; i < mappings.length; i += 1) {
    const label = mappingLabel(labelPrefix, i);
    const mapping = mappings[i] || {};
    const techniqueId = trimOptionalString(mapping.techniqueId);
    const attackVersion = getAttackVersion(mapping);

    if (/^T\d{4}-\d{3}$/.test(techniqueId)) {
      issues.push(`${label}: techniqueId "${techniqueId}" should use canonical "." separator (${techniqueId.replace('-', '.')})`);
    } else if (!MITRE_TECHNIQUE_ID_RE.test(techniqueId)) {
      issues.push(`${label}: invalid techniqueId "${techniqueId}" — expected format T####[.###]`);
    } else {
      const shouldUsePinnedAttackData = isPinnedAttackVersion(attackVersion);
      const technique = shouldUsePinnedAttackData ? getAttackEnterpriseTechnique(techniqueId) : null;
      if (shouldUsePinnedAttackData && !technique) {
        issues.push(`${label}: techniqueId "${techniqueId}" is not present in ATT&CK Enterprise ${attackData.version}`);
      } else if (technique?.revoked || technique?.deprecated) {
        issues.push(`${label}: techniqueId "${techniqueId}" is ${technique.revoked ? 'revoked' : 'deprecated'} in ATT&CK Enterprise ${attackData.version}`);
      } else if (technique) {
        const providedName = normalizeFrameworkName(mapping.techniqueName);
        const officialName = normalizeFrameworkName(technique.name);
        if (providedName && providedName !== officialName) {
          issues.push(`${label}: techniqueName "${providedName}" should match ATT&CK Enterprise ${attackData.version} name "${officialName}"`);
        }
      }
    }

    if (!mapping.techniqueName || String(mapping.techniqueName).trim() === '') {
      issues.push(`${label}: missing techniqueName`);
    }

    if (attackVersion !== undefined) {
      const version = typeof attackVersion === 'string' ? attackVersion.trim() : '';
      if (!ATTACK_VERSION_RE.test(version)) {
        issues.push(`${label}: attack-version must match vNN[.N]`);
      }
    }

    if (
      mapping.confidence !== undefined &&
      !SCHEMA_MAPPING_CONFIDENCE_VALUES.includes(String(mapping.confidence).trim())
    ) {
      issues.push(`${label}: confidence must be ${SCHEMA_MAPPING_CONFIDENCE_VALUES.join(' | ')}`);
    }

    if (mapping.evidence !== undefined && (typeof mapping.evidence !== 'string' || mapping.evidence.trim() === '')) {
      issues.push(`${label}: evidence must be a non-empty string`);
    }
  }

  return issues;
}

export function getAtlasMappingValidationIssues(atlasMappings, options = {}) {
  const labelPrefix = options.labelPrefix || 'ATLAS mapping';
  const issues = [];
  const atlasData = getAtlasData();

  if (atlasMappings !== undefined && !Array.isArray(atlasMappings)) {
    issues.push('atlasMappings must be an array when present');
  }

  if (Array.isArray(atlasMappings)) {
    for (let i = 0; i < atlasMappings.length; i += 1) {
      const label = mappingLabel(labelPrefix, i);
      const mapping = atlasMappings[i] || {};
      const techniqueId = trimOptionalString(mapping.techniqueId);
      const atlasVersion = getAtlasVersion(mapping);

      if (!ATLAS_TECHNIQUE_ID_RE.test(techniqueId)) {
        issues.push(`${label}: invalid techniqueId "${techniqueId}" — expected format AML.T####[.###]`);
      } else {
        const shouldUsePinnedAtlasData = isPinnedAtlasVersion(atlasVersion);
        const technique = shouldUsePinnedAtlasData ? getAtlasTechnique(techniqueId) : null;
        if (shouldUsePinnedAtlasData && !technique) {
          issues.push(`${label}: techniqueId "${techniqueId}" is not present in MITRE ATLAS ${atlasData.version}`);
        } else if (technique?.revoked || technique?.deprecated) {
          issues.push(`${label}: techniqueId "${techniqueId}" is ${technique.revoked ? 'revoked' : 'deprecated'} in MITRE ATLAS ${atlasData.version}`);
        } else if (technique) {
          const providedName = normalizeFrameworkName(mapping.techniqueName);
          const officialName = normalizeFrameworkName(technique.name);
          if (providedName && providedName !== officialName) {
            issues.push(`${label}: techniqueName "${providedName}" should match MITRE ATLAS ${atlasData.version} name "${officialName}"`);
          }
        }
      }

      if (!mapping.techniqueName || String(mapping.techniqueName).trim() === '') {
        issues.push(`${label}: missing techniqueName`);
      }

      if (
        mapping.confidence !== undefined &&
        !SCHEMA_MAPPING_CONFIDENCE_VALUES.includes(String(mapping.confidence).trim())
      ) {
        issues.push(`${label}: confidence must be ${SCHEMA_MAPPING_CONFIDENCE_VALUES.join(' | ')}`);
      }

      if (atlasVersion != null && atlasVersion !== '') {
        const version = typeof atlasVersion === 'string' ? atlasVersion.trim() : '';
        if (!ATLAS_VERSION_RE.test(version)) {
          issues.push(`${label}: atlas-version must match N.N.N`);
        }
      }

      if (mapping.evidence !== undefined && (typeof mapping.evidence !== 'string' || mapping.evidence.trim() === '')) {
        issues.push(`${label}: evidence must be a non-empty string`);
      }
    }
  }

  return issues;
}

export function getFrameworkMappingValidationIssues(frameworkMappings, options = {}) {
  const labelPrefix = options.labelPrefix || 'framework mapping';
  const issues = [];
  const atlasData = getAtlasData();

  if (frameworkMappings === undefined) {
    return issues;
  }
  if (!Array.isArray(frameworkMappings)) {
    issues.push('framework-mappings must be an array when present');
    return issues;
  }

  for (let i = 0; i < frameworkMappings.length; i += 1) {
    const label = mappingLabel(labelPrefix, i);
    const mapping = frameworkMappings[i] || {};
    const framework = trimOptionalString(mapping.framework);
    const version = trimOptionalString(mapping.version);
    const mappingId = getFrameworkMappingId(mapping);
    const mappingName = getFrameworkMappingName(mapping);

    if (!SCHEMA_FRAMEWORK_MAPPING_VALUES.includes(framework)) {
      issues.push(`${label}: framework must be ${SCHEMA_FRAMEWORK_MAPPING_VALUES.join(' | ')}`);
      continue;
    }

    if (!ATLAS_TECHNIQUE_ID_RE.test(mappingId)) {
      issues.push(`${label}: invalid mapping-id "${mappingId}" — expected format AML.T####[.###]`);
    } else {
      const shouldUsePinnedAtlasData = isPinnedAtlasVersion(version);
      const technique = shouldUsePinnedAtlasData ? getAtlasTechnique(mappingId) : null;
      if (shouldUsePinnedAtlasData && !technique) {
        issues.push(`${label}: mapping-id "${mappingId}" is not present in MITRE ATLAS ${atlasData.version}`);
      } else if (technique?.revoked || technique?.deprecated) {
        issues.push(`${label}: mapping-id "${mappingId}" is ${technique.revoked ? 'revoked' : 'deprecated'} in MITRE ATLAS ${atlasData.version}`);
      } else if (technique) {
        const officialName = normalizeFrameworkName(technique.name);
        if (mappingName && mappingName !== officialName) {
          issues.push(`${label}: mapping-name "${mappingName}" should match MITRE ATLAS ${atlasData.version} name "${officialName}"`);
        }
      }
    }

    if (!mappingName) {
      issues.push(`${label}: missing mapping-name`);
    }

    if (version && !ATLAS_VERSION_RE.test(version)) {
      issues.push(`${label}: version must match N.N.N`);
    }

    if (
      mapping.confidence !== undefined &&
      !SCHEMA_MAPPING_CONFIDENCE_VALUES.includes(String(mapping.confidence).trim())
    ) {
      issues.push(`${label}: confidence must be ${SCHEMA_MAPPING_CONFIDENCE_VALUES.join(' | ')}`);
    }

    if (mapping.evidence !== undefined && (typeof mapping.evidence !== 'string' || mapping.evidence.trim() === '')) {
      issues.push(`${label}: evidence must be a non-empty string`);
    }
  }

  return issues;
}
