#!/usr/bin/env node
import assert from 'node:assert/strict';
import {
  classifyAnchorCollision,
  getAdversaryProfileValidationIssues,
} from '../site/src/lib/adversaryProfileValidation.mjs';

function issues(record) {
  return getAdversaryProfileValidationIssues(record);
}

function messages(list) {
  return list.map((issue) => issue.message);
}

function assertNoErrors(record, label) {
  assert.deepEqual(messages(issues(record).errors), [], label);
}

function sourceRef(id = 'src-1') {
  return { sourceId: id };
}

const liveLegacyRecord = {
  name: 'APT29',
  aliases: ['Cozy Bear'],
  attributionConfidence: 'A1',
  reviewStatus: 'under_review',
  sources: [
    {
      url: 'https://attack.mitre.org/groups/G0016/',
      publisher: 'MITRE ATT&CK',
      publisherType: 'research',
      reliability: 'R1',
      publicationDate: '2025-10-17',
    },
  ],
};

{
  const result = issues(liveLegacyRecord);
  assert.equal(result.errors.length, 0, 'existing legacy threat actor remains valid');
  assert.ok(messages(result.warnings).some((message) => /entityKind is absent/.test(message)), 'legacy missing v0.5 fields warn');
  assert.ok(messages(result.warnings).some((message) => /attributionConfidence remains accepted legacy/.test(message)), 'legacy attributionConfidence warns');
}

const sparseDraft = {
  name: 'UNC0000',
  aliases: [],
  reviewStatus: 'draft_ai',
  entityKind: 'unknown_cluster',
  isAnalyticConstruct: true,
  sources: [
    {
      id: 'src-1',
      url: 'https://example.com/report',
      publisher: 'Example Research',
      publisherType: 'research',
      reliability: 'R2',
      publicationDate: '2026-06-18',
    },
  ],
};
assertNoErrors(sparseDraft, 'sparse draft_ai v0.5-shaped record is valid');

assertNoErrors({
  ...sparseDraft,
  attributionClaims: [
    {
      claimType: 'located_in',
      value: 'Unknown',
      confidence: 'D',
      sources: [sourceRef()],
    },
  ],
  relationshipClaims: [
    {
      predicate: 'associated_with',
      targetType: 'identity',
      targetId: 'TP-APT-0001',
      confidence: 'D',
      sources: [sourceRef()],
    },
  ],
}, 'claim sourceId references resolve against sources[].id');

{
  const result = issues({
    ...sparseDraft,
    attributionClaims: [
      {
        claimType: 'located_in',
        value: 'Unknown',
        confidence: 'D',
        sources: [sourceRef('missing-source')],
      },
    ],
  });
  assert.ok(messages(result.errors).some((message) => /sourceId must reference an existing sources\[\]\.id/.test(message)), 'dangling attribution sourceId is rejected');
}

const certifiedWithHardAnchor = {
  ...sparseDraft,
  reviewStatus: 'certified',
  entityKind: 'activity_cluster',
  externalIds: { mitreAttackGroup: 'G0045', vendorRefs: [] },
  canonicalNameSource: 'mitre',
  namingRationale: 'MITRE ATT&CK is the dominant source for this bootstrap record.',
};
assertNoErrors(certifiedWithHardAnchor, 'certified path (a) accepts a hard non-vendor anchor');

const certifiedWithAliases = {
  ...sparseDraft,
  reviewStatus: 'certified',
  aliases: ['Example Bear', 'Example Panda'],
  aliasRecords: [
    { value: 'Example Bear', sourceOrg: 'Vendor One', status: 'current', confidence: 'B' },
    { value: 'Example Panda', sourceOrg: 'Vendor Two', status: 'current', confidence: 'C' },
  ],
  canonicalNameSource: 'common',
  namingRationale: 'Two independent vendors use stable aliases for the same public cluster.',
};
assertNoErrors(certifiedWithAliases, 'certified path (b) accepts two independent aliases plus namingRationale');

{
  const certifiedLegacy = issues({
    name: 'Legacy Certified',
    aliases: [],
    reviewStatus: 'certified',
    operatingModels: [],
    sources: sparseDraft.sources,
  });
  assert.equal(certifiedLegacy.errors.length, 0, 'empty default operatingModels does not trigger v0.5 certification gate');
}

{
  const result = issues({
    name: 'Operating Model Only',
    aliases: [],
    reviewStatus: 'certified',
    operatingModels: ['ransomware_operation'],
    sources: sparseDraft.sources,
  });
  assert.ok(messages(result.errors).some((message) => /canonicalNameSource/.test(message)), 'non-empty operatingModels triggers certified canonicalNameSource requirement');
  assert.ok(messages(result.errors).some((message) => /namingRationale/.test(message)), 'non-empty operatingModels triggers certified namingRationale requirement');
  assert.ok(messages(result.errors).some((message) => /non-vendor anchor/.test(message)), 'non-empty operatingModels triggers certified anchor or sourced-alias requirement');
}

const lockBitStyle = {
  ...sparseDraft,
  name: 'LockBit',
  reviewStatus: 'certified',
  entityKind: 'criminal_operation',
  operatingModels: ['ransomware_operation', 'affiliate_program', 'data_extortion'],
  aliases: ['LockBit 3.0', 'LockBit Black'],
  aliasRecords: [
    { value: 'LockBit 3.0', sourceOrg: 'Vendor One', status: 'current', confidence: 'B' },
    { value: 'LockBit Black', sourceOrg: 'Vendor Two', status: 'current', confidence: 'B' },
  ],
  canonicalNameSource: 'common',
  namingRationale: 'Dominant public brand across vendor and government reporting.',
  relationshipClaims: [
    {
      predicate: 'uses_malware',
      targetType: 'malware_family',
      targetId: null,
      unresolved: true,
      labelIfUnresolved: 'LockBit ransomware',
      externalRefs: { malpediaFamily: 'win.lockbit' },
      confidence: 'B',
      sources: [sourceRef()],
    },
  ],
};
assertNoErrors(lockBitStyle, 'LockBit-style criminalOperation with operatingModels is valid');

{
  const result = issues({
    ...sparseDraft,
    externalIds: { malpediaActor: 'win.lockbit', vendorRefs: [] },
  });
  assert.ok(messages(result.errors).some((message) => /malpediaActor must be a Malpedia actor slug/.test(message)), 'malpediaActor rejects malware-family keys');
}

{
  const result = issues(lockBitStyle);
  assert.equal(result.errors.filter((issue) => issue.path.join('.') === 'relationshipClaims.0.externalRefs.malpediaFamily').length, 0, 'malpedia family key is accepted only under relationshipClaims[].externalRefs.malpediaFamily');
}

{
  const result = classifyAnchorCollision(
    { externalIds: { mitreAttackGroup: 'G0045', vendorRefs: [] } },
    { externalIds: { mitreAttackGroup: 'G0045', vendorRefs: [] } },
  );
  assert.equal(result.classification, 'deterministic_merge_candidate');
  assert.equal(result.action, 'auto_merge_eligible');
  assert.equal(result.autoMerge, true);
}

{
  const result = classifyAnchorCollision(
    { externalIds: { mitreAttackGroup: 'G0045', mispGalaxyUuid: '11111111-1111-4111-8111-111111111111', vendorRefs: [] } },
    { externalIds: { mitreAttackGroup: 'G0045', mispGalaxyUuid: '22222222-2222-4222-8222-222222222222', vendorRefs: [] } },
  );
  assert.equal(result.classification, 'hard_anchor_conflict');
  assert.equal(result.action, 'ep_disambiguation');
  assert.equal(result.autoMerge, false);
}

{
  const result = classifyAnchorCollision(
    { externalIds: { mitreAttackGroup: 'G0045', vendorRefs: [] } },
    { externalIds: { mitreAttackGroup: 'G0050', vendorRefs: [] } },
  );
  assert.equal(result.classification, 'hard_anchor_conflict');
  assert.equal(result.action, 'ep_disambiguation');
  assert.deepEqual(result.conflicts, ['mitreAttackGroup']);
  assert.equal(result.autoMerge, false);
}

{
  const result = classifyAnchorCollision(
    { externalIds: { malpediaActor: 'apt10', vendorRefs: [] } },
    { externalIds: { malpediaActor: 'apt10', vendorRefs: [] } },
  );
  assert.equal(result.classification, 'soft_anchor_merge_candidate');
  assert.equal(result.action, 'ep_disambiguation');
  assert.equal(result.autoMerge, false);
}

{
  const left = { externalIds: { mitreAttackGroup: 'G0045', vendorRefs: [] } };
  const snapshot = JSON.stringify(left);
  classifyAnchorCollision(left, { externalIds: { mitreAttackGroup: 'G0045', vendorRefs: [] } });
  assert.equal(JSON.stringify(left), snapshot, 'anchor classification is pure and does not silently mutate content');
}

{
  const result = issues({
    ...sparseDraft,
    aliases: ['Hand Edited Alias'],
    aliasRecords: [
      { value: 'Derived Alias', sourceOrg: 'Vendor One', status: 'current', confidence: 'B' },
    ],
  });
  assert.ok(messages(result.warnings).some((message) => /aliases should be derived/.test(message)), 'derived aliases mismatch warns');
}

{
  const result = issues({
    ...sparseDraft,
    attributionConfidence: 'A3',
    attributionClaims: [
      {
        claimType: 'suspected_sponsor',
        value: 'CN',
        confidence: 'R1',
        sources: [sourceRef()],
      },
    ],
  });
  assert.ok(messages(result.warnings).some((message) => /attributionConfidence remains accepted legacy/.test(message)), 'attributionConfidence remains accepted with warning');
  assert.ok(messages(result.errors).some((message) => /Source reliability R1-R4 must not appear as claim confidence/.test(message)), 'source reliability cannot be claim confidence');
}

{
  const result = issues({
    ...sparseDraft,
    importedSourceConfidence: 95,
  });
  assert.ok(messages(result.errors).some((message) => /MISP-only/.test(message)), 'importedSourceConfidence is MISP-only');
}

{
  const result = issues({
    ...sparseDraft,
    externalIds: {
      mispGalaxyUuid: '11111111-1111-4111-8111-111111111111',
      vendorRefs: [],
    },
    importedSourceConfidence: 101,
  });
  assert.ok(messages(result.errors).some((message) => /integer from 0 to 100/.test(message)), 'importedSourceConfidence must be numeric 0-100');
}

{
  const result = issues({
    ...sparseDraft,
    relationshipClaims: [
      {
        predicate: 'uses_malware',
        targetType: 'malware_family',
        targetId: 'TP-MAL-LOCKBIT',
        unresolved: true,
        confidence: 'B',
        sources: [sourceRef()],
      },
    ],
  });
  assert.ok(messages(result.errors).some((message) => /targetId to be null/.test(message)), 'unresolved relationship requires targetId null');
  assert.ok(messages(result.errors).some((message) => /labelIfUnresolved/.test(message)), 'unresolved relationship requires labelIfUnresolved');
}

{
  const result = issues({
    ...sparseDraft,
    relationshipClaims: [
      {
        predicate: 'exhibits_technique',
        targetType: 'attackTechnique',
        targetId: 'T1195.002',
        unresolved: false,
        confidence: 'B',
        sources: [sourceRef()],
      },
    ],
  });
  assert.ok(messages(result.errors).some((message) => /attackVersion/.test(message)), 'attack technique target requires attackVersion');
}

{
  const result = issues({
    ...sparseDraft,
    relationshipClaims: [
      {
        predicate: 'uses_malware',
        targetType: 'malware_family',
        targetId: 'TP-MAL-LOCKBIT',
        unresolved: false,
        externalRefs: { mitreAttackGroup: 'G0045' },
        confidence: 'B',
        sources: [sourceRef()],
      },
    ],
  });
  assert.ok(messages(result.errors).some((message) => /never actor identity anchors/.test(message)), 'externalRefs stores target entity IDs only');
}

{
  const result = issues({
    ...sparseDraft,
    externalIds: {
      malpediaFamily: 'win.lockbit',
      vendorRefs: [],
    },
  });
  assert.ok(messages(result.errors).some((message) => /not a valid actor externalIds key/.test(message)), 'malware IDs must not live under externalIds');
}

{
  const complete = issues({
    ...sparseDraft,
    revisions: [
      {
        actor: 'kernel-k',
        provider: 'openai',
        model: 'codex',
        action: 'created',
        ref: 'PR2',
        at: '2026-06-18T00:00:00Z',
      },
    ],
  });
  assert.equal(complete.errors.filter((issue) => issue.path[0] === 'revisions').length, 0, 'complete revisions[] validates');

  const incomplete = issues({
    ...sparseDraft,
    revisions: [{ actor: 'kernel-k', provider: 'openai', model: 'codex', action: 'created', ref: 'PR2' }],
  });
  assert.ok(messages(incomplete.errors).some((message) => /revisions\[\]\.at is required/.test(message)), 'revisions[] requires at');
}

console.log('adversary schema foundation tests passed');
