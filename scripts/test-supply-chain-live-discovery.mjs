#!/usr/bin/env node
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
  buildCandidateQueue,
  classifyLeads,
  loadCorpusIndex,
  validateCandidateQueue,
} from './supply-chain-live-discovery.mjs';

const fixtureDir = 'tests/fixtures/supply_chain_live_discovery';

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

await testFixtureDiscoveryBuildsSafeQueue();
testManualOverrideIsKernelKOnly();
testComputedKevUsesEffectiveActiveStatus();
console.log('Supply Chain live discovery tests PASS');
