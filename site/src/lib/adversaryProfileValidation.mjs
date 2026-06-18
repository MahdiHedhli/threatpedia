export const ENTITY_KINDS = [
  'activity_cluster',
  'state_unit',
  'state_sponsored_group',
  'criminal_group',
  'criminal_operation',
  'hacktivist_collective',
  'individual_persona',
  'unknown_cluster',
  'disputed_cluster',
];

export const OPERATING_MODELS = [
  'ransomware_operation',
  'affiliate_program',
  'data_extortion',
  'malware_brand',
  'access_broker',
  'botnet_service',
  'marketplace',
  'hacktivist_campaigning',
  'unknown',
];

export const CLAIM_CONFIDENCE_VALUES = ['A', 'B', 'C', 'D', 'E', 'F'];
export const SOURCE_RELIABILITY_VALUES = ['R1', 'R2', 'R3', 'R4'];

export const CANONICAL_NAME_SOURCES = [
  'threatpedia',
  'mitre',
  'misp',
  'vendor',
  'government',
  'common',
  'other',
];

export const ALIAS_STATUSES = ['current', 'deprecated', 'disputed'];

export const ATTRIBUTION_CLAIM_TYPES = [
  'suspected_sponsor',
  'operates_for',
  'located_in',
  'linked_to_actor',
  'aka_real_world',
];

export const RELATIONSHIP_PREDICATES = [
  'uses_malware',
  'uses_tool',
  'exhibits_technique',
  'conducted_campaign',
  'attributed_to_identity',
  'successor_of',
  'splinter_of',
  'merged_into',
  'shares_infrastructure_with',
  'associated_with',
];

export const RELATIONSHIP_TARGET_TYPES = [
  'malware_family',
  'tool',
  'attack_technique',
  'attackTechnique',
  'campaign',
  'identity',
  'adversary_profile',
  'adversaryProfile',
];

const ANALYTIC_CONSTRUCT_KINDS = new Set(['activity_cluster', 'unknown_cluster', 'disputed_cluster']);
const CRIMINAL_KINDS = new Set(['criminal_group', 'criminal_operation']);
const MALPEDIA_FAMILY_PREFIX_RE = /^(?:apk|elf|ios|jar|js|osx|ps1|py|vbs|win)\./i;
const HARD_ANCHOR_KEYS = ['mitreAttackGroup', 'mispGalaxyUuid'];
const SOFT_ANCHOR_KEYS = ['malpediaActor', 'etdaSlug'];
const ACTOR_EXTERNAL_ID_KEYS = new Set([
  'mitreAttackGroup',
  'mispGalaxyUuid',
  'malpediaActor',
  'etdaSlug',
  'vendorRefs',
]);
const RELATIONSHIP_EXTERNAL_REF_KEYS = new Set(['malpediaFamily', 'mitreSoftware']);

function present(value) {
  return value !== undefined && value !== null && String(value).trim() !== '';
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function uniqueValues(values) {
  return [...new Set(values.filter(present).map((value) => String(value).trim()))];
}

function normalizeVendorRef(ref) {
  if (!ref || typeof ref !== 'object') return null;
  if (!present(ref.vendor) || !present(ref.name)) return null;
  return `${String(ref.vendor).trim().toLowerCase()}::${String(ref.name).trim().toLowerCase()}`;
}

function sourceCount(claim) {
  return asArray(claim?.sources).length;
}

function collectSourceIds(sources = []) {
  return asArray(sources).map((source) => source?.id).filter(present).map((id) => String(id).trim());
}

function hasNonVendorAnchor(externalIds = {}) {
  return SOFT_ANCHOR_KEYS.concat(HARD_ANCHOR_KEYS).some((key) => present(externalIds[key]));
}

function hasTwoIndependentAliases(aliasRecords = []) {
  return uniqueValues(asArray(aliasRecords).map((alias) => alias?.sourceOrg)).length >= 2;
}

function hasV05IdentityFields(data) {
  return [
    'aptId',
    'entityKind',
    'isAnalyticConstruct',
    'externalIds',
    'aliasRecords',
    'attributionClaims',
    'relationshipClaims',
    'importedSourceConfidence',
    'notPubliclyEstablished',
    'canonicalNameSource',
    'canonicalNameSourceDetail',
    'namingRationale',
    'revisions',
  ].some((field) => data[field] !== undefined);
}

function issue(path, message) {
  return { path, message };
}

export function isMalpediaFamilyKey(value) {
  return typeof value === 'string' && MALPEDIA_FAMILY_PREFIX_RE.test(value.trim());
}

export function getAdversaryProfileValidationIssues(record) {
  const errors = [];
  const warnings = [];
  const data = record && typeof record === 'object' ? record : {};
  const externalIds = data.externalIds && typeof data.externalIds === 'object' ? data.externalIds : {};
  const aliasRecords = asArray(data.aliasRecords);
  const attributionClaims = asArray(data.attributionClaims);
  const relationshipClaims = asArray(data.relationshipClaims);
  const revisions = asArray(data.revisions);
  const sourceIds = collectSourceIds(data.sources);
  const knownSourceIds = new Set(sourceIds);

  for (const field of ['entityKind', 'isAnalyticConstruct', 'externalIds', 'aliasRecords', 'attributionClaims', 'relationshipClaims', 'revisions']) {
    if (data[field] === undefined) {
      warnings.push(issue([field], `${field} is absent; PR2 keeps this warning-mode for legacy records.`));
    }
  }

  if (data.entityKind !== undefined && !ENTITY_KINDS.includes(data.entityKind)) {
    errors.push(issue(['entityKind'], `entityKind must be one of: ${ENTITY_KINDS.join(', ')}`));
  }

  if (data.entityKind && ANALYTIC_CONSTRUCT_KINDS.has(data.entityKind) && data.isAnalyticConstruct !== true) {
    errors.push(issue(['isAnalyticConstruct'], `${data.entityKind} records must set isAnalyticConstruct to true.`));
  }

  for (const [index, value] of asArray(data.operatingModels).entries()) {
    if (!OPERATING_MODELS.includes(value) && !(typeof value === 'string' && value.startsWith('x-'))) {
      errors.push(issue(['operatingModels', index], 'operatingModels values must be controlled vocabulary values or x-* extensions.'));
    }
  }

  if (data.reviewStatus === 'certified' && hasV05IdentityFields(data)) {
    if (!present(data.canonicalNameSource)) {
      errors.push(issue(['canonicalNameSource'], 'certified adversary profiles require canonicalNameSource.'));
    }
    if (!present(data.namingRationale)) {
      errors.push(issue(['namingRationale'], 'certified adversary profiles require namingRationale.'));
    }
    if (!hasNonVendorAnchor(externalIds) && !hasTwoIndependentAliases(aliasRecords)) {
      errors.push(issue(['externalIds'], 'certified adversary profiles require a non-vendor anchor or two independent sourced aliases.'));
    }
    if (CRIMINAL_KINDS.has(data.entityKind) && asArray(data.operatingModels).length === 0) {
      errors.push(issue(['operatingModels'], `${data.entityKind} certified records require operatingModels.`));
    }
  }

  if (data.canonicalNameSource === 'other' && !present(data.canonicalNameSourceDetail)) {
    errors.push(issue(['canonicalNameSourceDetail'], 'canonicalNameSourceDetail is required when canonicalNameSource is other.'));
  }

  if (isMalpediaFamilyKey(externalIds.malpediaActor)) {
    errors.push(issue(['externalIds', 'malpediaActor'], 'malpediaActor must be a Malpedia actor slug, not a malware-family key.'));
  }

  for (const key of Object.keys(externalIds)) {
    if (!ACTOR_EXTERNAL_ID_KEYS.has(key)) {
      errors.push(issue(['externalIds', key], `${key} is not a valid actor externalIds key.`));
    }
  }

  if (data.importedSourceConfidence !== undefined) {
    if (!Number.isInteger(data.importedSourceConfidence) || data.importedSourceConfidence < 0 || data.importedSourceConfidence > 100) {
      errors.push(issue(['importedSourceConfidence'], 'importedSourceConfidence must be an integer from 0 to 100.'));
    }
    if (!present(externalIds.mispGalaxyUuid)) {
      errors.push(issue(['importedSourceConfidence'], 'importedSourceConfidence is MISP-only and requires externalIds.mispGalaxyUuid.'));
    }
  }

  for (const [index, source] of asArray(data.sources).entries()) {
    if (present(source?.id) && sourceIds.filter((id) => id === String(source.id).trim()).length > 1) {
      errors.push(issue(['sources', index, 'id'], 'sources[].id values must be unique when present.'));
    }
  }

  for (const [index, alias] of aliasRecords.entries()) {
    if (!ALIAS_STATUSES.includes(alias?.status)) {
      errors.push(issue(['aliasRecords', index, 'status'], 'aliasRecords[].status must be current, deprecated, or disputed.'));
    }
    if (!CLAIM_CONFIDENCE_VALUES.includes(alias?.confidence)) {
      errors.push(issue(['aliasRecords', index, 'confidence'], 'aliasRecords[].confidence must use claim confidence A-F.'));
    }
  }

  if (aliasRecords.length > 0) {
    const aliasValues = uniqueValues(asArray(data.aliases)).sort();
    const derivedValues = uniqueValues(aliasRecords.map((alias) => alias?.value)).sort();
    if (JSON.stringify(aliasValues) !== JSON.stringify(derivedValues)) {
      warnings.push(issue(['aliases'], 'aliases should be derived from aliasRecords[].value once aliasRecords are present.'));
    }
  }

  for (const [index, claim] of attributionClaims.entries()) {
    if (!ATTRIBUTION_CLAIM_TYPES.includes(claim?.claimType)) {
      errors.push(issue(['attributionClaims', index, 'claimType'], 'attributionClaims[].claimType is invalid.'));
    }
    if (!CLAIM_CONFIDENCE_VALUES.includes(claim?.confidence)) {
      errors.push(issue(['attributionClaims', index, 'confidence'], 'attributionClaims[].confidence must use claim confidence A-F.'));
    }
    if (SOURCE_RELIABILITY_VALUES.includes(claim?.confidence)) {
      errors.push(issue(['attributionClaims', index, 'confidence'], 'Source reliability R1-R4 must not appear as claim confidence.'));
    }
    if (sourceCount(claim) === 0) {
      errors.push(issue(['attributionClaims', index, 'sources'], 'attributionClaims[] entries require at least one source reference.'));
    }
    for (const [sourceIndex, sourceRef] of asArray(claim?.sources).entries()) {
      if (!present(sourceRef?.sourceId)) {
        errors.push(issue(['attributionClaims', index, 'sources', sourceIndex, 'sourceId'], 'attributionClaims[].sources[].sourceId is required.'));
      } else if (!knownSourceIds.has(String(sourceRef.sourceId).trim())) {
        errors.push(issue(['attributionClaims', index, 'sources', sourceIndex, 'sourceId'], 'attributionClaims[].sources[].sourceId must reference an existing sources[].id.'));
      }
    }
    if (claim?.importedSourceConfidence !== undefined) {
      if (!Number.isInteger(claim.importedSourceConfidence) || claim.importedSourceConfidence < 0 || claim.importedSourceConfidence > 100) {
        errors.push(issue(['attributionClaims', index, 'importedSourceConfidence'], 'importedSourceConfidence must be an integer from 0 to 100.'));
      }
      if (!present(externalIds.mispGalaxyUuid)) {
        errors.push(issue(['attributionClaims', index, 'importedSourceConfidence'], 'importedSourceConfidence is MISP-only and requires externalIds.mispGalaxyUuid.'));
      }
    }
  }

  for (const [index, claim] of relationshipClaims.entries()) {
    if (!RELATIONSHIP_PREDICATES.includes(claim?.predicate)) {
      errors.push(issue(['relationshipClaims', index, 'predicate'], 'relationshipClaims[].predicate is invalid.'));
    }
    if (!RELATIONSHIP_TARGET_TYPES.includes(claim?.targetType)) {
      errors.push(issue(['relationshipClaims', index, 'targetType'], 'relationshipClaims[].targetType is invalid.'));
    }
    if (claim?.unresolved === true) {
      if (claim.targetId !== null) {
        errors.push(issue(['relationshipClaims', index, 'targetId'], 'unresolved relationships require targetId to be null.'));
      }
      if (!present(claim.labelIfUnresolved)) {
        errors.push(issue(['relationshipClaims', index, 'labelIfUnresolved'], 'unresolved relationships require labelIfUnresolved.'));
      }
    } else if (!present(claim?.targetId)) {
      errors.push(issue(['relationshipClaims', index, 'targetId'], 'resolved relationships require targetId.'));
    }
    if ((claim?.targetType === 'attack_technique' || claim?.targetType === 'attackTechnique') && !present(claim.attackVersion)) {
      errors.push(issue(['relationshipClaims', index, 'attackVersion'], 'attack technique relationships require attackVersion.'));
    }
    if (!CLAIM_CONFIDENCE_VALUES.includes(claim?.confidence)) {
      errors.push(issue(['relationshipClaims', index, 'confidence'], 'relationshipClaims[].confidence must use claim confidence A-F.'));
    }
    if (SOURCE_RELIABILITY_VALUES.includes(claim?.confidence)) {
      errors.push(issue(['relationshipClaims', index, 'confidence'], 'Source reliability R1-R4 must not appear as claim confidence.'));
    }
    if (sourceCount(claim) === 0) {
      errors.push(issue(['relationshipClaims', index, 'sources'], 'relationshipClaims[] entries require at least one source reference.'));
    }
    for (const [sourceIndex, sourceRef] of asArray(claim?.sources).entries()) {
      if (!present(sourceRef?.sourceId)) {
        errors.push(issue(['relationshipClaims', index, 'sources', sourceIndex, 'sourceId'], 'relationshipClaims[].sources[].sourceId is required.'));
      } else if (!knownSourceIds.has(String(sourceRef.sourceId).trim())) {
        errors.push(issue(['relationshipClaims', index, 'sources', sourceIndex, 'sourceId'], 'relationshipClaims[].sources[].sourceId must reference an existing sources[].id.'));
      }
    }
    const refs = claim?.externalRefs && typeof claim.externalRefs === 'object' ? claim.externalRefs : {};
    for (const key of Object.keys(refs)) {
      if (!RELATIONSHIP_EXTERNAL_REF_KEYS.has(key) && !key.startsWith('x-')) {
        errors.push(issue(['relationshipClaims', index, 'externalRefs', key], `${key} is not a valid relationship target externalRefs key.`));
      }
      if (ACTOR_EXTERNAL_ID_KEYS.has(key)) {
        errors.push(issue(['relationshipClaims', index, 'externalRefs', key], 'externalRefs stores target entity IDs only, never actor identity anchors.'));
      }
    }
  }

  if (data.attributionConfidence !== undefined) {
    warnings.push(issue(['attributionConfidence'], 'attributionConfidence remains accepted legacy data; attributionClaims[] is the structured target.'));
  }

  for (const [index, revision] of revisions.entries()) {
    for (const field of ['actor', 'provider', 'model', 'action', 'ref', 'at']) {
      if (!present(revision?.[field])) {
        errors.push(issue(['revisions', index, field], `revisions[].${field} is required when revisions are present.`));
      }
    }
  }

  return { errors, warnings };
}

export function classifyAnchorCollision(left, right) {
  const leftExternalIds = left?.externalIds || {};
  const rightExternalIds = right?.externalIds || {};
  const sharedHardAnchors = HARD_ANCHOR_KEYS.filter((key) => present(leftExternalIds[key]) && leftExternalIds[key] === rightExternalIds[key]);
  const conflictingHardAnchors = HARD_ANCHOR_KEYS.filter(
    (key) => present(leftExternalIds[key]) && present(rightExternalIds[key]) && leftExternalIds[key] !== rightExternalIds[key],
  );

  if (conflictingHardAnchors.length > 0) {
    return {
      classification: 'hard_anchor_conflict',
      action: 'ep_disambiguation',
      autoMerge: false,
      anchors: sharedHardAnchors,
      conflicts: conflictingHardAnchors,
    };
  }

  if (sharedHardAnchors.length > 0) {
    return {
      classification: 'deterministic_merge_candidate',
      action: 'auto_merge_eligible',
      autoMerge: true,
      anchors: sharedHardAnchors,
      conflicts: [],
    };
  }

  const sharedSoftAnchors = SOFT_ANCHOR_KEYS.filter((key) => present(leftExternalIds[key]) && leftExternalIds[key] === rightExternalIds[key]);
  const leftVendorRefs = new Set(asArray(leftExternalIds.vendorRefs).map(normalizeVendorRef).filter(Boolean));
  const sharedVendorRefs = asArray(rightExternalIds.vendorRefs).map(normalizeVendorRef).filter((value) => value && leftVendorRefs.has(value));

  if (sharedSoftAnchors.length > 0 || sharedVendorRefs.length > 0) {
    return {
      classification: 'soft_anchor_merge_candidate',
      action: 'ep_disambiguation',
      autoMerge: false,
      anchors: [...sharedSoftAnchors, ...sharedVendorRefs.map((value) => `vendorRefs:${value}`)],
      conflicts: [],
    };
  }

  return {
    classification: 'no_anchor_match',
    action: 'no_merge_signal',
    autoMerge: false,
    anchors: [],
    conflicts: [],
  };
}
