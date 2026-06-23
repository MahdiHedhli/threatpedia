#!/usr/bin/env node
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildGroundedPacket } from './build-grounded-source-packet.mjs';
import { draftFromPacket } from './draft-grounded-article.mjs';
import { checkGroundedDraft } from './check-grounded-draft.mjs';
import { readJson, writeJson } from './grounded-drafting-lib.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const queuePath = 'tests/fixtures/grounded_drafting/candidate_queue.json';
const fixturesDir = 'tests/fixtures/grounded_drafting/sources';

function runNode(args) {
  return execFileSync(process.execPath, args, { cwd: repoRoot, encoding: 'utf8' });
}

async function testGroundedPacketDraftAndFidelityPass() {
  const tempDir = mkdtempSync(path.join(tmpdir(), 'threatpedia-b2-'));
  try {
    const packetPath = path.join(tempDir, 'packet.json');
    const draftPath = path.join(tempDir, 'draft.md');
    const packet = await buildGroundedPacket({
      queue: queuePath,
      candidateId: 'SC-CAND-1234abcd5678ef90',
      approvedBy: 'KernelK',
      approvalRef: 'fixture-approval',
      out: packetPath,
      fixturesDir,
      createdAt: '2026-06-22T00:00:00Z',
      allowFetchFailures: false,
    });
    writeJson(repoRoot, packetPath, packet);

    assert.equal(packet.lane, 'incident');
    assert.equal(packet.approval.approved_by, 'KernelK');
    assert.equal(packet.grounding_contract.drafting_mode, 'packet_claims_only');
    assert.equal(packet.source_quality.source_sufficiency, 'sufficient');
    assert.ok(packet.source_extracts.every((extract) => extract.status === 'ok'));
    assert.ok(packet.claims.length >= 5);
    assert.equal(packet.output_target.file_pattern, 'site/src/content/incidents/SC-CAND-1234abcd5678ef90.md');
    assert.ok(packet.uncertainties.some((item) => item.topic.includes('date')));
    assert.ok(packet.uncertainties.some((item) => item.topic.includes('exploit')));

    runNode(['scripts/preflight-source-packet.mjs', packetPath]);
    const draft = draftFromPacket(packet, { createdAt: '2026-06-22' });
    writeFileSync(draftPath, draft);
    const fidelity = checkGroundedDraft(packet, draft);
    assert.equal(fidelity.pass, true);
    assert.equal(fidelity.errors.length, 0);
    runNode(['scripts/check-grounded-draft.mjs', '--packet', packetPath, '--draft', draftPath]);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

function testCliRequiresExplicitApproval() {
  const result = spawnSync(process.execPath, [
    'scripts/build-grounded-source-packet.mjs',
    '--queue', queuePath,
    '--candidate-id', 'SC-CAND-1234abcd5678ef90',
    '--approval-ref', 'fixture-approval',
    '--out', path.join(tmpdir(), 'no-approval-packet.json'),
    '--fixtures-dir', fixturesDir,
  ], { cwd: repoRoot, encoding: 'utf8' });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /approved-by is required/);
}

async function testFidelityRejectsInventedUrl() {
  const packet = await buildGroundedPacket({
    queue: queuePath,
    candidateId: 'SC-CAND-1234abcd5678ef90',
    approvedBy: 'KernelK',
    approvalRef: 'fixture-approval',
    out: path.join(tmpdir(), 'unused.json'),
    fixturesDir,
    createdAt: '2026-06-22T00:00:00Z',
    allowFetchFailures: false,
  });
  const draft = `${draftFromPacket(packet, { createdAt: '2026-06-22' })}\n<!-- claims: claim-1 --> Invented URL https://invented.example.invalid/report\n`;
  const fidelity = checkGroundedDraft(packet, draft);
  assert.equal(fidelity.pass, false);
  assert.ok(fidelity.errors.some((error) => error.message.includes('draft URL is not in packet sources')));
}

async function testFidelityRejectsUnmarkedClaimLine() {
  const packet = readJson(repoRoot, queuePath);
  const draft = '---\ntitle: "bad"\n---\n\n## Executive Summary\nThis line has no claim marker.\n';
  const fidelity = checkGroundedDraft({ claims: [{ claim_id: 'claim-1' }], primary_sources: [], supporting_sources: [] }, draft);
  assert.equal(fidelity.pass, false);
  assert.ok(fidelity.errors.some((error) => error.message.includes('missing packet claim marker')));
  assert.ok(packet.candidates.length > 0);
}

async function testOutputTargetsUseCollectionNames() {
  const baseQueue = readJson(repoRoot, queuePath);
  const tempDir = mkdtempSync(path.join(tmpdir(), 'threatpedia-b2-lanes-'));
  try {
    const cases = [
      ['zero-day', 'site/src/content/zero-days/SC-CAND-1234abcd5678ef90.md'],
      ['campaign', 'site/src/content/campaigns/SC-CAND-1234abcd5678ef90.md'],
      ['threat-actor', 'site/src/content/threat-actors/SC-CAND-1234abcd5678ef90.md'],
      ['malware-family', '.github/pipeline/grounded-drafts/supply-chain-malware-families/SC-CAND-1234abcd5678ef90.md'],
    ];
    for (const [proposedArchetype, expectedPattern] of cases) {
      const queue = structuredClone(baseQueue);
      queue.candidates[0].proposedArchetype = proposedArchetype;
      const queueFile = path.join(tempDir, `${proposedArchetype}.json`);
      writeJson(repoRoot, queueFile, queue);
      const packet = await buildGroundedPacket({
        queue: queueFile,
        candidateId: 'SC-CAND-1234abcd5678ef90',
        approvedBy: 'KernelK',
        approvalRef: 'fixture-approval',
        out: path.join(tempDir, `${proposedArchetype}-packet.json`),
        fixturesDir,
        createdAt: '2026-06-22T00:00:00Z',
        allowFetchFailures: false,
      });
      assert.equal(packet.output_target.file_pattern, expectedPattern);
    }
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

await testGroundedPacketDraftAndFidelityPass();
await testOutputTargetsUseCollectionNames();
testCliRequiresExplicitApproval();
await testFidelityRejectsInventedUrl();
await testFidelityRejectsUnmarkedClaimLine();
console.log('Grounded drafting tests passed');
