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
import { classifySource, readJson, sourceFixtureName, writeJson } from './grounded-drafting-lib.mjs';
import { SCHEMA_REQUIRED_H2_BY_TYPE } from './pipeline-schema.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const queuePath = 'tests/fixtures/grounded_drafting/candidate_queue.json';
const fixturesDir = 'tests/fixtures/grounded_drafting/sources';

function runNode(args) {
  return execFileSync(process.execPath, args, { cwd: repoRoot, encoding: 'utf8' });
}

function bodyH2s(markdown) {
  return markdown.split(/\r?\n/)
    .filter((line) => /^##\s+/.test(line))
    .map((line) => line.replace(/^##\s+/, '').trim());
}

function h2Section(markdown, heading) {
  const lines = markdown.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === `## ${heading}`);
  if (start < 0) return '';
  const endOffset = lines.slice(start + 1).findIndex((line) => /^##\s+/.test(line));
  const end = endOffset < 0 ? lines.length : start + 1 + endOffset;
  return lines.slice(start + 1, end).join('\n').trim();
}

function addCampaignGovernmentSource(packet) {
  packet.supporting_sources.push({
    source_id: 'src-cisa',
    url: 'https://www.cisa.gov/news-events/alerts/2026/06/21/fixture-alert',
    publisher: 'Cybersecurity and Infrastructure Security Agency',
    source_type: 'database',
    role: 'supporting',
    published_at: '2026-06-21',
  });
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
    assert.equal(packet.candidate.title, 'Fixture npm supply-chain compromise');
    assert.equal(packet.candidate.summary, 'A malicious npm package release attempted credential theft through a package install script.');
    assert.ok(packet.uncertainties.some((item) => item.topic.includes('date')));
    assert.ok(packet.uncertainties.some((item) => item.topic.includes('exploit')));
    assert.equal(packet.primary_sources.find((source) => source.publisher === 'Socket')?.published_at, '2026-06-20');

    runNode(['scripts/preflight-source-packet.mjs', packetPath]);
    const draft = draftFromPacket(packet, { createdAt: '2026-06-22' });
    writeFileSync(draftPath, draft);
    assert.match(draft, /^title: "Fixture npm supply-chain compromise"$/m);
    assert.doesNotMatch(draft, /^title: "Fixture npm supply-chain compromise is the candidate subject approved for grounded drafting\."$/m);
    assert.doesNotMatch(draft, /candidate subject approved for grounded drafting/);
    assert.doesNotMatch(draft, /classifier work intent/);
    assert.doesNotMatch(draft, /\bsource packet\b/i);
    assert.doesNotMatch(draft, /\bpacket-backed\b/i);
    assert.match(draft, /techniqueId: "T1195\.002"/);
    assert.match(draft, /\n- \[Socket: .+\]\(https:\/\/socket\.dev\/blog\/supply-chain-fixture\) — Socket, 2026-06-20\n/);
    assert.match(draft, /\ndate: 2026-06-21\n/);
    assert.deepEqual(bodyH2s(draft), SCHEMA_REQUIRED_H2_BY_TYPE.incident);
    assert.match(h2Section(draft, 'Attack Chain'), /Available sources do not establish a detailed attack chain/);
    assert.notEqual(h2Section(draft, 'Technical Analysis'), h2Section(draft, 'Attack Chain'));
    assert.doesNotMatch(h2Section(draft, 'Remediation & Mitigation'), /do not establish additional remediation facts/);
    const fidelity = checkGroundedDraft(packet, draft);
    assert.equal(fidelity.pass, true);
    assert.equal(fidelity.errors.length, 0);
    runNode(['scripts/check-grounded-draft.mjs', '--packet', packetPath, '--draft', draftPath]);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

async function testRawExtractedIdsDoNotPollutePacketCves() {
  const tempDir = mkdtempSync(path.join(tmpdir(), 'threatpedia-b2-sidebar-'));
  try {
    const queue = readJson(repoRoot, queuePath);
    for (const url of queue.candidates[0].sourceRefs) {
      const fixtureName = sourceFixtureName(url);
      const original = readFileSync(path.resolve(repoRoot, fixturesDir, fixtureName), 'utf8');
      const sidebar = url.includes('socket.dev')
        ? '\nTop Stories This Week: Chrome V8 Zero-Day CVE-2026-11645 Exploited in the Wild.\n'
        : '';
      writeFileSync(path.join(tempDir, fixtureName), `${original}${sidebar}`);
    }
    const packet = await buildGroundedPacket({
      queue: queuePath,
      candidateId: 'SC-CAND-1234abcd5678ef90',
      approvedBy: 'KernelK',
      approvalRef: 'fixture-approval',
      out: path.join(tempDir, 'packet.json'),
      fixturesDir: tempDir,
      createdAt: '2026-06-22T00:00:00Z',
      allowFetchFailures: false,
    });
    assert.deepEqual(packet.cves, []);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

async function testInvalidCalendarPublicationDateIsIgnored() {
  const tempDir = mkdtempSync(path.join(tmpdir(), 'threatpedia-b2-invalid-date-'));
  try {
    const queue = readJson(repoRoot, queuePath);
    for (const url of queue.candidates[0].sourceRefs) {
      const fixtureName = sourceFixtureName(url);
      const original = readFileSync(path.resolve(repoRoot, fixturesDir, fixtureName), 'utf8');
      const content = url.includes('socket.dev')
        ? original.replace('Published: June 20, 2026', 'Published: February 31, 2026')
        : original;
      writeFileSync(path.join(tempDir, fixtureName), content);
    }
    const packet = await buildGroundedPacket({
      queue: queuePath,
      candidateId: 'SC-CAND-1234abcd5678ef90',
      approvedBy: 'KernelK',
      approvalRef: 'fixture-approval',
      out: path.join(tempDir, 'packet.json'),
      fixturesDir: tempDir,
      createdAt: '2026-06-22T00:00:00Z',
      allowFetchFailures: false,
    });
    assert.equal(packet.primary_sources.find((source) => source.publisher === 'Socket')?.published_at, null);
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

async function testPreflightRequiresGroundedSourceExtracts() {
  const tempDir = mkdtempSync(path.join(tmpdir(), 'threatpedia-b2-preflight-'));
  try {
    const packetPath = path.join(tempDir, 'packet-without-extracts.json');
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
    delete packet.source_extracts;
    writeJson(repoRoot, packetPath, packet);
    const result = spawnSync(process.execPath, ['scripts/preflight-source-packet.mjs', packetPath], { cwd: repoRoot, encoding: 'utf8' });
    assert.notEqual(result.status, 0);
    assert.match(result.stdout, /grounded drafting packets need at least one successful source extract/);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
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

function testFidelityRejectsUnmarkedSentence() {
  const draft = '---\ntitle: "bad"\n---\n\n## Executive Summary\n<!-- claims: claim-1 --> This sentence is grounded. This sentence is not marked.\n';
  const fidelity = checkGroundedDraft({ claims: [{ claim_id: 'claim-1' }], primary_sources: [], supporting_sources: [] }, draft);
  assert.equal(fidelity.pass, false);
  assert.ok(fidelity.errors.some((error) => error.message.includes('missing packet claim marker')));
}

function testFidelityHandlesCrlfFrontmatter() {
  const draft = [
    '---',
    'title: "fixture"',
    '---',
    '',
    '## Executive Summary',
    '<!-- claims: claim-1 --> This line is grounded.',
    '',
  ].join('\r\n');
  const fidelity = checkGroundedDraft({ claims: [{ claim_id: 'claim-1' }], primary_sources: [], supporting_sources: [] }, draft);
  assert.equal(fidelity.pass, true);
  assert.equal(fidelity.errors.length, 0);
}

function testOfficialAdvisorySourceClassification() {
  assert.deepEqual(classifySource('https://www.cisa.gov/known-exploited-vulnerabilities-catalog'), {
    publisher: 'Cybersecurity and Infrastructure Security Agency',
    source_type: 'database',
  });
  assert.deepEqual(classifySource('https://nvd.nist.gov/vuln/detail/CVE-2026-12345'), {
    publisher: 'National Vulnerability Database',
    source_type: 'database',
  });
  assert.deepEqual(classifySource('https://www.cve.org/CVERecord?id=CVE-2026-12345'), {
    publisher: 'CVE Program',
    source_type: 'database',
  });
  assert.deepEqual(classifySource('https://checkmarx.com/blog/ongoing-security-updates/'), {
    publisher: 'Checkmarx',
    source_type: 'vendor',
  });
  assert.deepEqual(classifySource('https://www.stepsecurity.io/blog/megalodon'), {
    publisher: 'StepSecurity',
    source_type: 'research',
  });
  assert.deepEqual(classifySource('https://labs.cloudsecurityalliance.org/research/megalodon'), {
    publisher: 'Cloud Security Alliance',
    source_type: 'research',
  });
  assert.deepEqual(classifySource('https://www.securityweek.com/over-5500-github-repositories-infected-in-megalodon-supply-chain-attack/'), {
    publisher: 'SecurityWeek',
    source_type: 'news',
  });
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

async function testDraftFrontmatterMatchesLiveSchema() {
  const baseQueue = readJson(repoRoot, queuePath);
  const tempDir = mkdtempSync(path.join(tmpdir(), 'threatpedia-b2-frontmatter-'));
  try {
    const campaignQueue = structuredClone(baseQueue);
    campaignQueue.candidates[0].proposedArchetype = 'campaign';
    const campaignQueueFile = path.join(tempDir, 'campaign.json');
    writeJson(repoRoot, campaignQueueFile, campaignQueue);
    const campaignPacket = await buildGroundedPacket({
      queue: campaignQueueFile,
      candidateId: 'SC-CAND-1234abcd5678ef90',
      approvedBy: 'KernelK',
      approvalRef: 'fixture-approval',
      out: path.join(tempDir, 'campaign-packet.json'),
      fixturesDir,
      createdAt: '2026-06-22T00:00:00Z',
      allowFetchFailures: false,
    });
    assert.throws(() => draftFromPacket(campaignPacket, { createdAt: '2026-06-22' }), /Campaign grounded drafts require at least three packet sources/);
    addCampaignGovernmentSource(campaignPacket);
    const campaignDraft = draftFromPacket(campaignPacket, { createdAt: '2026-06-22' });
    assert.match(campaignDraft, /\nongoing: true\n/);
    assert.doesNotMatch(campaignDraft, /\nendDate:/);
    assert.match(campaignDraft, /\nmitreMappings:\n/);
    assert.match(campaignDraft, /techniqueId: "T1195\.002"/);
    assert.match(campaignDraft, /\n\s+publisherType: government\n/);
    assert.deepEqual(bodyH2s(campaignDraft), SCHEMA_REQUIRED_H2_BY_TYPE.campaign);

    const zeroDayQueue = structuredClone(baseQueue);
    zeroDayQueue.candidates[0].proposedArchetype = 'zero-day';
    zeroDayQueue.candidates[0].canonicalSubjectId = 'CVE-2026-12345';
    zeroDayQueue.candidates[0].summary = `${zeroDayQueue.candidates[0].summary} CVE-2026-12345 affects Fixture Platform.`;
    const zeroDayQueueFile = path.join(tempDir, 'zero-day.json');
    writeJson(repoRoot, zeroDayQueueFile, zeroDayQueue);
    const zeroDayPacket = await buildGroundedPacket({
      queue: zeroDayQueueFile,
      candidateId: 'SC-CAND-1234abcd5678ef90',
      approvedBy: 'KernelK',
      approvalRef: 'fixture-approval',
      out: path.join(tempDir, 'zero-day-packet.json'),
      fixturesDir,
      createdAt: '2026-06-22T00:00:00Z',
      allowFetchFailures: false,
    });
    zeroDayPacket.affected_products[0].product = 'Fixture Platform';
    const zeroDayDraft = draftFromPacket(zeroDayPacket, { createdAt: '2026-06-22' });
    assert.match(zeroDayDraft, /\ncve: "CVE-2026-12345"\n/);
    assert.match(zeroDayDraft, /\ntype: "Vulnerability"\n/);
    assert.match(zeroDayDraft, /\nplatform: "Fixture Platform"\n/);
    assert.doesNotMatch(zeroDayDraft, /\ncveId:/);
    assert.doesNotMatch(zeroDayDraft, /\npublishedDate:/);
    assert.deepEqual(bodyH2s(zeroDayDraft), SCHEMA_REQUIRED_H2_BY_TYPE['zero-day']);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

async function testNewsSourceMapsToMediaPublisherType() {
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
  packet.primary_sources[0].source_type = 'news';
  const draft = draftFromPacket(packet, { createdAt: '2026-06-22' });
  assert.match(draft, /\n\s+publisherType: media\n/);
  assert.doesNotMatch(draft, /\n\s+publisherType: news\n/);
}

await testGroundedPacketDraftAndFidelityPass();
await testRawExtractedIdsDoNotPollutePacketCves();
await testInvalidCalendarPublicationDateIsIgnored();
await testOutputTargetsUseCollectionNames();
await testDraftFrontmatterMatchesLiveSchema();
await testNewsSourceMapsToMediaPublisherType();
testCliRequiresExplicitApproval();
await testPreflightRequiresGroundedSourceExtracts();
await testFidelityRejectsInventedUrl();
await testFidelityRejectsUnmarkedClaimLine();
testFidelityRejectsUnmarkedSentence();
testFidelityHandlesCrlfFrontmatter();
testOfficialAdvisorySourceClassification();
console.log('Grounded drafting tests passed');
