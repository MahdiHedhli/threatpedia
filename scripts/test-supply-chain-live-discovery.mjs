#!/usr/bin/env node
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
  buildPurl,
  buildCandidateQueue,
  classifyLeads,
  loadCorpusIndex,
  validateCandidateQueue,
} from './supply-chain-live-discovery.mjs';

const fixtureDir = 'tests/fixtures/supply_chain_live_discovery';

function testMixedCaseEcosystemPurlsAreCanonical() {
  assert.equal(buildPurl('Go', 'github.com/boltdb/bolt', 'v1.3.9'), 'pkg:golang/github.com/boltdb/bolt@v1.3.9');
  assert.equal(buildPurl('golang', 'github.com/boltdb/bolt', 'v1.3.9'), 'pkg:golang/github.com/boltdb/bolt@v1.3.9');
  assert.equal(buildPurl('PyPI', 'Demo_Package.Name', '1.0.0'), 'pkg:pypi/demo-package-name@1.0.0');
  assert.equal(buildPurl('NPM', '@Scope/Package', '2.0.0'), 'pkg:npm/scope/package@2.0.0');
}

async function testFixtureDiscoveryBuildsSafeQueue() {
  const tempDir = mkdtempSync(path.join(tmpdir(), 'threatpedia-b1-'));
  try {
    const out = path.join(tempDir, 'queue.json');
    const queue = await buildCandidateQueue({
      execute: false,
      out,
      queuePath: out,
      fixturesDir: fixtureDir,
      asOf: '2026-06-22T00:00:00Z',
      maxCandidates: 20,
      maxPerSource: 5,
      sinceHours: 72,
      vulncheckIndex: null,
      check: false,
      includeLowSignal: false,
    });

    assert.equal(queue.schema_version, 'threatpedia-supply-chain-candidate-queue/1');
    assert.equal(queue.drafting_enabled, false);
    assert.equal(queue.auto_drafting_allowed, false);
    assert.equal(validateCandidateQueue(queue).length, 0);
    assert.ok(queue.summary.raw_leads_loaded >= 5);
    assert.ok(queue.summary.candidates_emitted >= 1);
    assert.ok(queue.currency.pending_candidate_count >= 1);

    const deduped = queue.candidates.find((candidate) => candidate.canonicalSubjectId === 'CVE-2026-99999');
    assert.ok(deduped, 'OSV and GHSA fixture should collapse to canonical CVE subject');
    assert.ok(deduped.sources.includes('osv'));
    assert.ok(deduped.sources.includes('github-advisory'));
    assert.equal(deduped.classification.leadClass, 'current');
    assert.equal(deduped.classification.effectiveActiveStatus, 'exploited_in_wild');
    assert.equal(deduped.draftingAllowed, false);
    assert.equal(deduped.queueAction, 'candidate_review');
    assert.equal(deduped.classification.kevStatusIsAuthoredTruth, false);
    assert.ok(deduped.matchedEntityHints.packages.length > 0, 'event-stream should connect to existing graph package');
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

async function testOsvAscendingCsvAndMalformedGoLinesAreSafe() {
  const tempDir = mkdtempSync(path.join(tmpdir(), 'threatpedia-b1-osv-'));
  try {
    writeFileSync(path.join(tempDir, 'npm_changes.json'), JSON.stringify({ results: [] }));
    writeFileSync(path.join(tempDir, 'pypi_updates.xml'), '<rss><channel></channel></rss>');
    writeFileSync(path.join(tempDir, 'go_index.jsonl'), '{"Path":"example.com/ok","Version":"v0.0.1","Timestamp":"2026-06-20T00:00:00Z"}\n{"Path":');
    writeFileSync(path.join(tempDir, 'ghsa_advisories.json'), '[]');
    writeFileSync(path.join(tempDir, 'osv_modified_id.csv'), [
      '2020-01-01T00:00:00Z,npm/MAL-2020-OLD',
      '2026-06-21T12:00:00Z,npm/MAL-2026-ASCENDING',
      '',
    ].join('\n'));
    writeFileSync(path.join(tempDir, 'osv-npm-mal-2026-ascending.json'), JSON.stringify({
      id: 'MAL-2026-ASCENDING',
      modified: '2026-06-21T12:00:00Z',
      published: '2026-06-21T12:00:00Z',
      summary: 'Malicious package supply-chain fixture',
      details: 'Malicious package supply-chain fixture for event-stream.',
      affected: [{ package: { ecosystem: 'npm', name: 'event-stream' }, versions: ['9.9.9'] }],
      database_specific: { malware_family: 'fixture' },
    }));

    const out = path.join(tempDir, 'queue.json');
    const queue = await buildCandidateQueue({
      execute: false,
      out,
      queuePath: out,
      fixturesDir: tempDir,
      asOf: '2026-06-22T00:00:00Z',
      maxCandidates: 20,
      maxPerSource: 5,
      sinceHours: 72,
      vulncheckIndex: null,
      check: false,
      includeLowSignal: false,
    });

    assert.equal(validateCandidateQueue(queue).length, 0);
    assert.ok(
      queue.candidates.some((candidate) => candidate.canonicalSubjectId === 'MAL-2026-ASCENDING'),
      'ascending OSV modified_id.csv rows should still collect recent records',
    );
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

async function testOsvDescendingCsvCollectsRecentRows() {
  const tempDir = mkdtempSync(path.join(tmpdir(), 'threatpedia-b1-osv-desc-'));
  try {
    writeFileSync(path.join(tempDir, 'npm_changes.json'), JSON.stringify({ results: [] }));
    writeFileSync(path.join(tempDir, 'pypi_updates.xml'), '<rss><channel></channel></rss>');
    writeFileSync(path.join(tempDir, 'go_index.jsonl'), 'not-json\n');
    writeFileSync(path.join(tempDir, 'ghsa_advisories.json'), '[]');
    writeFileSync(path.join(tempDir, 'osv_modified_id.csv'), [
      '2026-06-21T12:00:00Z,npm/MAL-2026-DESCENDING',
      '2020-01-01T00:00:00Z,npm/MAL-2020-OLD',
      '',
    ].join('\n'));
    writeFileSync(path.join(tempDir, 'osv-npm-mal-2026-descending.json'), JSON.stringify({
      id: 'MAL-2026-DESCENDING',
      modified: '2026-06-21T12:00:00Z',
      published: '2026-06-21T12:00:00Z',
      summary: 'Malicious package supply-chain fixture',
      details: 'Malicious package supply-chain fixture for event-stream.',
      affected: [{ package: { ecosystem: 'npm', name: 'event-stream' }, versions: ['9.9.8'] }],
      database_specific: { malware_family: 'fixture' },
    }));

    const out = path.join(tempDir, 'queue.json');
    const queue = await buildCandidateQueue({
      execute: false,
      out,
      queuePath: out,
      fixturesDir: tempDir,
      asOf: '2026-06-22T00:00:00Z',
      maxCandidates: 20,
      maxPerSource: 5,
      sinceHours: 72,
      vulncheckIndex: null,
      check: false,
      includeLowSignal: false,
    });

    assert.equal(validateCandidateQueue(queue).length, 0);
    assert.ok(
      queue.candidates.some((candidate) => candidate.canonicalSubjectId === 'MAL-2026-DESCENDING'),
      'newest-first OSV modified_id.csv rows should collect recent records',
    );
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

async function testGoIndexAdvancesSequentiallyWithoutSkippingRows() {
  const tempDir = mkdtempSync(path.join(tmpdir(), 'threatpedia-b1-go-newest-'));
  try {
    writeFileSync(path.join(tempDir, 'npm_changes.json'), JSON.stringify({ results: [] }));
    writeFileSync(path.join(tempDir, 'pypi_updates.xml'), '<rss><channel></channel></rss>');
    writeFileSync(path.join(tempDir, 'go_index.jsonl'), [
      '{"Path":"example.com/old","Version":"v0.0.1","Timestamp":"2026-06-20T00:00:00Z"}',
      '{"Path":"example.com/new","Version":"v0.0.2","Timestamp":"2026-06-21T00:00:00Z"}',
    ].join('\n'));
    writeFileSync(path.join(tempDir, 'ghsa_advisories.json'), '[]');
    writeFileSync(path.join(tempDir, 'osv_modified_id.csv'), 'not-a-date,no-record\n');

    const out = path.join(tempDir, 'queue.json');
    const queue = await buildCandidateQueue({
      execute: false,
      out,
      queuePath: out,
      fixturesDir: tempDir,
      asOf: '2026-06-22T00:00:00Z',
      maxCandidates: 20,
      maxPerSource: 1,
      sinceHours: 72,
      vulncheckIndex: path.join(tempDir, 'missing-vulncheck.json'),
      check: false,
      includeLowSignal: true,
    });

    assert.ok(
      queue.rejected.some((item) => item.canonicalSubjectId === 'pkg:golang/example.com/old@v0.0.1'),
      'Go index collection should inspect oldest rows first to prevent cursor gaps',
    );
    assert.ok(!queue.rejected.some((item) => item.canonicalSubjectId === 'pkg:golang/example.com/new@v0.0.2'));
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

async function testGoBoundaryKeysMergeWhenCursorUnchanged() {
  const tempDir = mkdtempSync(path.join(tmpdir(), 'threatpedia-b1-go-boundary-'));
  try {
    writeFileSync(path.join(tempDir, 'npm_changes.json'), JSON.stringify({ results: [] }));
    writeFileSync(path.join(tempDir, 'pypi_updates.xml'), '<rss><channel></channel></rss>');
    writeFileSync(path.join(tempDir, 'go_index.jsonl'), [
      '{"Path":"example.com/old","Version":"v0.0.1","Timestamp":"2026-06-21T00:00:00.000Z"}',
      '{"Path":"example.com/new","Version":"v0.0.2","Timestamp":"2026-06-21T00:00:00.000Z"}',
    ].join('\n'));
    writeFileSync(path.join(tempDir, 'ghsa_advisories.json'), '[]');
    writeFileSync(path.join(tempDir, 'osv_modified_id.csv'), 'not-a-date,no-record\n');
    const queuePath = path.join(tempDir, 'queue.json');
    writeFileSync(queuePath, JSON.stringify({
      feed_cursors: {
        go: {
          cursor: '2026-06-21T00:00:00.000Z',
          boundary_keys: ['example.com/old\tv0.0.1\t2026-06-21T00:00:00.000Z'],
        },
      },
      candidates: [],
    }));

    const queue = await buildCandidateQueue({
      execute: false,
      out: queuePath,
      queuePath,
      fixturesDir: tempDir,
      asOf: '2026-06-22T00:00:00Z',
      maxCandidates: 20,
      maxPerSource: 5,
      sinceHours: 72,
      vulncheckIndex: path.join(tempDir, 'missing-vulncheck.json'),
      check: false,
      includeLowSignal: true,
    });

    assert.deepEqual(queue.feed_cursors.go.boundary_keys, [
      'example.com/new\tv0.0.2\t2026-06-21T00:00:00.000Z',
      'example.com/old\tv0.0.1\t2026-06-21T00:00:00.000Z',
    ]);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

function testManualOverrideIsKernelKOnly() {
  const corpusIndex = loadCorpusIndex();
  const now = new Date('2026-06-22T00:00:00Z');
  const config = {
    currentWindowDays: 180,
    kev: { recentlyAddedDays: 30, overdueGraceDays: 30, agedDays: 180 },
    activeStatus: { defaultExpiryDays: 30 },
    minRank: 0,
  };
  const { candidates } = classifyLeads([
    {
      leadRef: 'manual:test',
      source: 'fixture',
      kind: 'advisory',
      advisoryId: 'MAL-2026-MANUAL',
      title: 'Malicious package supply-chain fixture',
      summary: 'Manual override fixture.',
      publishedAt: '2025-01-01T00:00:00Z',
      modifiedAt: '2025-01-01T00:00:00Z',
      lastMaterialActivityAt: '2025-01-01T00:00:00Z',
      url: 'https://example.invalid/manual',
      affected: [{ package: { ecosystem: 'npm', name: 'event-stream' } }],
      manualOverride: {
        value: true,
        by: 'ernestpenfold-bot',
        reason: 'EP may request but not set KK currency overrides.',
        expiresAt: '2026-07-01T00:00:00Z',
      },
    },
  ], { config, corpusIndex, now });

  assert.equal(candidates.length, 1);
  assert.equal(candidates[0].classification.manualOverrideValid, false);
  assert.deepEqual(candidates[0].classification.manualOverrideErrors, ['manualOverride.by must be KernelK']);
}

function testManualOverrideCarriesForwardFromPreviousQueue() {
  const corpusIndex = loadCorpusIndex();
  const now = new Date('2026-06-22T00:00:00Z');
  const config = {
    currentWindowDays: 180,
    kev: { recentlyAddedDays: 30, overdueGraceDays: 30, agedDays: 180 },
    activeStatus: { defaultExpiryDays: 30 },
    minRank: 0,
  };
  const previousQueue = {
    candidates: [{
      canonicalSubjectId: 'MAL-2026-MANUAL-CARRY',
      manualOverride: {
        value: true,
        by: 'KernelK',
        reason: 'Keep this candidate current during a bounded human review window.',
        expiresAt: '2026-07-01T00:00:00Z',
      },
    }],
  };
  const { candidates } = classifyLeads([
    {
      leadRef: 'manual-carry:test',
      source: 'fixture',
      kind: 'advisory',
      advisoryId: 'MAL-2026-MANUAL-CARRY',
      title: 'Old malicious package supply-chain fixture',
      summary: 'Manual override carry-forward fixture.',
      publishedAt: '2025-01-01T00:00:00Z',
      modifiedAt: '2025-01-01T00:00:00Z',
      lastMaterialActivityAt: '2025-01-01T00:00:00Z',
      url: 'https://example.invalid/manual-carry',
      affected: [{ package: { ecosystem: 'npm', name: 'event-stream' } }],
    },
  ], { config, corpusIndex, now, previousQueue });

  assert.equal(candidates.length, 1);
  assert.equal(candidates[0].classification.manualOverrideValid, true);
  assert.equal(candidates[0].classification.leadClass, 'current');
  assert.deepEqual(candidates[0].manualOverride, previousQueue.candidates[0].manualOverride);
}

function testComputedKevUsesEffectiveActiveStatus() {
  const corpusIndex = loadCorpusIndex();
  const now = new Date('2026-06-22T00:00:00Z');
  const config = {
    currentWindowDays: 180,
    kev: { recentlyAddedDays: 30, overdueGraceDays: 30, agedDays: 180 },
    activeStatus: { defaultExpiryDays: 30 },
    minRank: 0,
  };
  const { candidates } = classifyLeads([
    {
      leadRef: 'kev:test',
      source: 'fixture',
      kind: 'advisory',
      advisoryId: 'CVE-2020-1111',
      title: 'Old supply-chain CVE fixture',
      summary: 'Old CVE listed in KEV but no unexpired activity.',
      cves: ['CVE-2020-1111'],
      publishedAt: '2020-01-01T00:00:00Z',
      modifiedAt: '2020-01-01T00:00:00Z',
      lastMaterialActivityAt: '2020-01-01T00:00:00Z',
      url: 'https://example.invalid/kev',
      affected: [{ package: { ecosystem: 'npm', name: 'event-stream' } }],
      kev: {
        isKev: true,
        kevAddedAt: '2020-01-01T00:00:00Z',
        kevUpdatedAt: '2020-01-01T00:00:00Z',
        kevDueAt: '2020-02-01T00:00:00Z',
      },
    },
  ], { config, corpusIndex, now });

  assert.equal(candidates[0].classification.kevStatusDerived, 'aged');
  assert.equal(candidates[0].classification.leadClass, 'historical');
}

function testMixedCaseEcosystemMatchesExistingPackage() {
  const now = new Date('2026-06-22T00:00:00Z');
  const config = {
    currentWindowDays: 180,
    kev: { recentlyAddedDays: 30, overdueGraceDays: 30, agedDays: 180 },
    activeStatus: { defaultExpiryDays: 30 },
    minRank: 0,
  };
  const corpusIndex = {
    subjectIds: new Set(),
    packages: new Map([['pypi:demo-package', { id: 'pkg-pypi-demo-package', name: 'Demo_Package', ecosystem: 'PyPI' }]]),
    actors: [],
    campaigns: [],
  };
  const { candidates } = classifyLeads([
    {
      leadRef: 'mixed-case:test',
      source: 'fixture',
      kind: 'release',
      ecosystem: 'PyPI',
      packageName: 'Demo_Package',
      version: '1.0.0',
      purl: buildPurl('PyPI', 'Demo_Package', '1.0.0'),
      title: 'Demo_Package 1.0.0',
      summary: 'Package release candidate.',
      publishedAt: '2026-06-21T00:00:00Z',
      lastMaterialActivityAt: '2026-06-21T00:00:00Z',
      url: 'https://example.invalid/demo',
    },
  ], { config, corpusIndex, now });

  assert.equal(candidates.length, 1);
  assert.equal(candidates[0].entityMatch, 'matched');
  assert.deepEqual(candidates[0].matchedEntityHints.packages, [
    { id: 'pkg-pypi-demo-package', name: 'Demo_Package', ecosystem: 'PyPI' },
  ]);
}

function testGoEcosystemMatchesExistingPackage() {
  const now = new Date('2026-06-22T00:00:00Z');
  const config = {
    currentWindowDays: 180,
    kev: { recentlyAddedDays: 30, overdueGraceDays: 30, agedDays: 180 },
    activeStatus: { defaultExpiryDays: 30 },
    minRank: 0,
  };
  const corpusIndex = {
    subjectIds: new Set(),
    packages: new Map([['golang:github.com/boltdb/bolt', { id: 'pkg-go-bolt', name: 'github.com/boltdb/bolt', ecosystem: 'golang' }]]),
    actors: [],
    campaigns: [],
  };
  const { candidates } = classifyLeads([
    {
      leadRef: 'go-match:test',
      source: 'fixture',
      kind: 'release',
      ecosystem: 'Go',
      packageName: 'github.com/boltdb/bolt',
      version: '1.3.9',
      purl: buildPurl('Go', 'github.com/boltdb/bolt', '1.3.9'),
      title: 'github.com/boltdb/bolt 1.3.9',
      summary: 'Package release candidate.',
      publishedAt: '2026-06-21T00:00:00Z',
      lastMaterialActivityAt: '2026-06-21T00:00:00Z',
      url: 'https://example.invalid/demo',
    },
  ], { config, corpusIndex, now });

  assert.equal(candidates.length, 1);
  assert.equal(candidates[0].entityMatch, 'matched');
  assert.deepEqual(candidates[0].matchedEntityHints.packages, [
    { id: 'pkg-go-bolt', name: 'github.com/boltdb/bolt', ecosystem: 'golang' },
  ]);
}

function testKnownSubjectBypassesKeywordRelevance() {
  const now = new Date('2026-06-22T00:00:00Z');
  const config = {
    currentWindowDays: 180,
    kev: { recentlyAddedDays: 30, overdueGraceDays: 30, agedDays: 180 },
    activeStatus: { defaultExpiryDays: 30 },
    minRank: 0,
  };
  const { candidates } = classifyLeads([
    {
      leadRef: 'known-subject:test',
      source: 'fixture',
      kind: 'advisory',
      advisoryId: 'CVE-2026-77777',
      title: 'Existing CVE update',
      summary: 'Routine advisory wording without trigger keywords.',
      cves: ['CVE-2026-77777'],
      publishedAt: '2026-06-21T00:00:00Z',
      modifiedAt: '2026-06-21T00:00:00Z',
      lastMaterialActivityAt: '2026-06-21T00:00:00Z',
      url: 'https://example.invalid/known',
    },
  ], {
    config,
    corpusIndex: { subjectIds: new Set(['CVE-2026-77777']), packages: new Map(), actors: [], campaigns: [] },
    now,
  });

  assert.equal(candidates.length, 1);
  assert.equal(candidates[0].entityMatch, 'matched');
}

function testQueueValidatorRejectsInvalidRootShapes() {
  assert.deepEqual(validateCandidateQueue(null), ['Queue must be a valid object']);
  assert.deepEqual(validateCandidateQueue([]), ['Queue must be a valid object']);
  assert.ok(validateCandidateQueue({
    schema_version: 'threatpedia-supply-chain-candidate-queue/1',
    drafting_enabled: false,
    auto_drafting_allowed: false,
    candidates: [null],
  }).includes('candidates[0] must be a valid object'));
}

async function testVulncheckKevFeedsDerivedKevStatus() {
  const tempDir = mkdtempSync(path.join(tmpdir(), 'threatpedia-b1-vulncheck-'));
  try {
    writeFileSync(path.join(tempDir, 'npm_changes.json'), JSON.stringify({ results: [] }));
    writeFileSync(path.join(tempDir, 'pypi_updates.xml'), '<rss><channel></channel></rss>');
    writeFileSync(path.join(tempDir, 'go_index.jsonl'), 'not-json\n');
    writeFileSync(path.join(tempDir, 'osv_modified_id.csv'), 'not-a-date,no-record\n');
    writeFileSync(path.join(tempDir, 'ghsa_advisories.json'), '[]');
    const vulncheckIndex = path.join(tempDir, 'vulncheck-kev.json');
    writeFileSync(vulncheckIndex, JSON.stringify({
      candidates: [
        null,
        [],
        {
          candidate_key: 'CVE-2026-12345',
          cves: ['CVE-2026-12345'],
          vulnerabilityName: 'Supply-chain exploitation fixture',
          shortDescription: 'A supply-chain exploited package fixture for KEV derivation.',
          vulncheck_date_added: '2026-06-20',
          official_cisa_kev: {
            date_added: '2026-06-20',
            dueDate: '2026-07-10',
          },
          vulncheck_exploitation_signal: {
            evidence_urls: ['https://example.invalid/vulncheck'],
            reported_exploited_by_vulncheck_canaries: true,
          },
        },
      ],
    }));

    const out = path.join(tempDir, 'queue.json');
    const queue = await buildCandidateQueue({
      execute: false,
      out,
      queuePath: out,
      fixturesDir: tempDir,
      asOf: '2026-06-22T00:00:00Z',
      maxCandidates: 20,
      maxPerSource: 5,
      sinceHours: 72,
      vulncheckIndex,
      check: false,
      includeLowSignal: true,
    });

    assert.equal(validateCandidateQueue(queue).length, 0);
    const candidate = queue.candidates.find((item) => item.canonicalSubjectId === 'CVE-2026-12345');
    assert.ok(candidate, 'VulnCheck KEV fixture should be emitted as a candidate');
    assert.equal(candidate.classification.kevStatusDerived, 'recently_added');
    assert.equal(candidate.classification.kevStatusIsAuthoredTruth, false);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

async function testPendingCandidatesCarryForwardWhenNotRediscovered() {
  const tempDir = mkdtempSync(path.join(tmpdir(), 'threatpedia-b1-carry-'));
  try {
    writeFileSync(path.join(tempDir, 'npm_changes.json'), JSON.stringify({ results: [] }));
    writeFileSync(path.join(tempDir, 'pypi_updates.xml'), '<rss><channel></channel></rss>');
    writeFileSync(path.join(tempDir, 'go_index.jsonl'), 'not-json\n');
    writeFileSync(path.join(tempDir, 'osv_modified_id.csv'), 'not-a-date,no-record\n');
    writeFileSync(path.join(tempDir, 'ghsa_advisories.json'), '[]');
    const queuePath = path.join(tempDir, 'queue.json');
    writeFileSync(queuePath, JSON.stringify({
      schema_version: 'threatpedia-supply-chain-candidate-queue/1',
      drafting_enabled: false,
      auto_drafting_allowed: false,
      candidates: [{
        candidateId: 'SC-CAND-previous123',
        canonicalSubjectId: 'MAL-2026-PREVIOUS',
        subjectType: 'incident',
        proposedArchetype: 'incident',
        title: 'Previous pending candidate',
        summary: 'Pending supply-chain candidate awaiting review.',
        sources: ['osv'],
        sourceRefs: ['https://example.invalid/previous'],
        mergedLeadRefs: ['osv:MAL-2026-PREVIOUS'],
        firstSeenAt: '2026-06-20T00:00:00.000Z',
        lastMaterialActivityAt: '2026-06-20T00:00:00.000Z',
        activityBasis: ['advisory_updated'],
        entityMatch: 'new',
        matchedEntityHints: { actors: [], campaigns: [], packages: [], malwareFamilies: [] },
        classification: {
          leadClass: 'current',
          leadClassReason: 'material activity within 180 days',
          workIntent: 'create_article',
          routingPriority: 'p2',
          effectiveActiveStatus: 'none',
          activeStatus: 'none',
          activeStatusExpiresAt: null,
          needsReverify: false,
          kevStatusDerived: null,
          kevStatusIsAuthoredTruth: false,
          manualOverrideValid: false,
          manualOverrideErrors: [],
        },
        rank: 32,
        rankReasons: ['current lead'],
        queueAction: 'candidate_review',
        draftingAllowed: false,
        autoDraftingBlockedReason: 'B1 discovery/classification stops at candidate queue; grounded drafting is not implemented in this sprint.',
      }],
    }));

    const queue = await buildCandidateQueue({
      execute: false,
      out: queuePath,
      queuePath,
      fixturesDir: tempDir,
      asOf: '2026-06-22T00:00:00Z',
      maxCandidates: 20,
      maxPerSource: 5,
      sinceHours: 72,
      vulncheckIndex: path.join(tempDir, 'missing-vulncheck.json'),
      check: false,
      includeLowSignal: false,
    });

    assert.equal(validateCandidateQueue(queue).length, 0);
    assert.equal(queue.candidates.length, 1);
    assert.equal(queue.candidates[0].canonicalSubjectId, 'MAL-2026-PREVIOUS');
    assert.equal(queue.candidates[0].staleCarryForward, true);
    assert.equal(queue.summary.candidates_carried_forward, 1);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

function testSupplyChainCveRoutesAsIncidentWithoutKev() {
  const now = new Date('2026-06-22T00:00:00Z');
  const config = {
    currentWindowDays: 180,
    kev: { recentlyAddedDays: 30, overdueGraceDays: 30, agedDays: 180 },
    activeStatus: { defaultExpiryDays: 30 },
    minRank: 0,
  };
  const { candidates } = classifyLeads([
    {
      leadRef: 'ghsa:cve-alias',
      source: 'github-advisory',
      kind: 'advisory',
      advisoryId: 'GHSA-1111-2222-3333',
      title: 'Supply-chain package CVE fixture',
      summary: 'Malicious package supply-chain fixture with a CVE alias.',
      cves: ['CVE-2026-99999'],
      ghsas: ['GHSA-1111-2222-3333'],
      publishedAt: '2026-06-20T00:00:00Z',
      modifiedAt: '2026-06-20T00:00:00Z',
      lastMaterialActivityAt: '2026-06-20T00:00:00Z',
      url: 'https://example.invalid/ghsa',
      affected: [{ package: { ecosystem: 'npm', name: 'event-stream' } }],
    },
  ], {
    config,
    corpusIndex: { subjectIds: new Set(), packages: new Map(), actors: [], campaigns: [] },
    now,
  });

  assert.equal(candidates.length, 1);
  assert.equal(candidates[0].canonicalSubjectId, 'CVE-2026-99999');
  assert.equal(candidates[0].proposedArchetype, 'incident');
}

testMixedCaseEcosystemPurlsAreCanonical();
await testFixtureDiscoveryBuildsSafeQueue();
await testOsvAscendingCsvAndMalformedGoLinesAreSafe();
await testOsvDescendingCsvCollectsRecentRows();
await testGoIndexAdvancesSequentiallyWithoutSkippingRows();
await testGoBoundaryKeysMergeWhenCursorUnchanged();
testManualOverrideIsKernelKOnly();
testManualOverrideCarriesForwardFromPreviousQueue();
testComputedKevUsesEffectiveActiveStatus();
testMixedCaseEcosystemMatchesExistingPackage();
testGoEcosystemMatchesExistingPackage();
testKnownSubjectBypassesKeywordRelevance();
testQueueValidatorRejectsInvalidRootShapes();
await testVulncheckKevFeedsDerivedKevStatus();
await testPendingCandidatesCarryForwardWhenNotRediscovered();
testSupplyChainCveRoutesAsIncidentWithoutKev();
console.log('Supply Chain live discovery tests PASS');
