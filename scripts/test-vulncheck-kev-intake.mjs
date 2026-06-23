#!/usr/bin/env node
import assert from 'node:assert/strict';
import { buildRecentIntake } from './vulncheck-kev-intake.mjs';

const fixture = {
  data: [
    {
      vendorProject: 'OldVendor',
      product: 'OldProduct',
      vulnerabilityName: 'Old Vulnerability',
      shortDescription: 'Old record outside lookback.',
      required_action: 'Patch.',
      knownRansomwareCampaignUse: 'Unknown',
      cve: ['CVE-2026-0001'],
      cwes: ['CWE-79'],
      vulncheck_xdb: [],
      vulncheck_reported_exploitation: [],
      reported_exploited_by_vulncheck_canaries: false,
      date_added: '2026-04-01T00:00:00Z',
    },
    {
      vendorProject: 'SeenVendor',
      product: 'SeenProduct',
      vulnerabilityName: 'Seen Vulnerability',
      shortDescription: 'Recent but already seen.',
      required_action: 'Patch.',
      knownRansomwareCampaignUse: 'Known',
      cve: ['CVE-2026-0002'],
      cwes: ['CWE-89'],
      vulncheck_xdb: [{ xdb_id: 'seen', xdb_url: 'https://vulncheck.com/xdb/seen', date_added: '2026-06-02T00:00:00Z', exploit_type: 'initial-access' }],
      vulncheck_reported_exploitation: [{ url: 'https://example.com/seen', date_added: '2026-06-02T00:00:00Z' }],
      reported_exploited_by_vulncheck_canaries: true,
      cisa_date_added: '2026-06-03T00:00:00Z',
      dueDate: '2026-06-24T00:00:00Z',
      date_added: '2026-06-02T00:00:00Z',
    },
    {
      vendorProject: 'NewVendor',
      product: 'NewProduct',
      vulnerabilityName: 'Newest Vulnerability',
      shortDescription: 'Newest recent record.',
      required_action: 'Patch.',
      knownRansomwareCampaignUse: 'Unknown',
      cve: ['CVE-2026-0003'],
      cwes: ['CWE-94'],
      vulncheck_xdb: [{ xdb_id: 'new', xdb_url: 'https://vulncheck.com/xdb/new', date_added: '2026-06-10T00:00:00Z', exploit_type: 'info-leak' }],
      vulncheck_reported_exploitation: [{ url: 'https://example.com/new', date_added: '2026-06-10T00:00:00Z' }],
      reported_exploited_by_vulncheck_canaries: false,
      cisa_date_added: '2026-06-11T00:00:00Z',
      dueDate: '2026-07-02T00:00:00Z',
      date_added: '2026-06-10T00:00:00Z',
    },
  ],
};

const result = buildRecentIntake(fixture, {
  lookbackDays: 30,
  maxCandidates: 25,
  asOf: '2026-06-11',
  seenCves: new Set(['CVE-2026-0002']),
  endpoint: 'https://api.vulncheck.com/v3/backup/vulncheck-kev',
});

assert.equal(result.mode, 'dry-run');
assert.equal(result.drafting_enabled, false);
assert.equal(result.summary.records_loaded, 3);
assert.equal(result.summary.candidates_in_lookback, 2);
assert.equal(result.summary.backlog_candidates_considered, 1);
assert.equal(result.summary.already_seen_filtered, 1);
assert.equal(result.summary.candidates_emitted, 2);
assert.equal(result.summary.recent_emitted, 1);
assert.equal(result.summary.backlog_emitted, 1);
assert.equal(result.candidates[0].cves[0], 'CVE-2026-0003');
assert.equal(result.candidates[0].recency_bucket, 'recent');
assert.equal(result.candidates[1].cves[0], 'CVE-2026-0001');
assert.equal(result.candidates[1].recency_bucket, 'backlog');
assert.equal(result.candidates[0].drafting_allowed, false);
assert.equal(result.candidates[0].official_cisa_kev.listed, true);
assert.equal(result.candidates[0].official_cisa_kev.date_added, '2026-06-11');
assert.equal(result.candidates[0].vulncheck_exploitation_signal.non_authoritative, true);
assert.equal(result.candidates[0].vulncheck_exploitation_signal.xdb_exploit_types[0], 'info-leak');
assert.equal(result.candidates[0].source_packet_prefill.status, 'prefill_only');
assert.equal(result.candidates[0].source_packet_prefill.source_quality.source_sufficiency, 'needs_human_review');
assert.match(result.candidates[0].source_packet_prefill.authority_boundary.instruction, /verify CISA KEV membership/);

const noBacklog = buildRecentIntake(fixture, {
  lookbackDays: 30,
  maxCandidates: 25,
  asOf: '2026-06-11',
  seenCves: new Set(['CVE-2026-0002']),
  backlogFill: false,
});

assert.equal(noBacklog.summary.backlog_candidates_considered, 0);
assert.deepEqual(noBacklog.candidates.map(candidate => candidate.cves[0]), ['CVE-2026-0003']);

const liveMode = buildRecentIntake(fixture, {
  lookbackDays: 30,
  maxCandidates: 1,
  asOf: '2026-06-11',
  seenCves: new Set(),
  execute: true,
});

assert.equal(liveMode.mode, 'live');
assert.equal(liveMode.drafting_enabled, false);
assert.equal(liveMode.candidates[0].drafting_allowed, false);

const includeSeen = buildRecentIntake(fixture, {
  lookbackDays: 30,
  maxCandidates: 2,
  asOf: '2026-06-11',
  seenCves: new Set(['CVE-2026-0002']),
  includeSeen: true,
});

assert.deepEqual(includeSeen.candidates.map(candidate => candidate.cves[0]), ['CVE-2026-0003', 'CVE-2026-0002']);
assert.equal(includeSeen.candidates[1].already_seen, true);

const productNormalized = buildRecentIntake({
  data: [
    {
      vendorProject: null,
      product: null,
      vulnerabilityName: ' Unrestricted Upload of File with Dangerous Type',
      shortDescription: 'The Gravity Forms plugin for WordPress is vulnerable to arbitrary file uploads.',
      required_action: 'Patch.',
      knownRansomwareCampaignUse: 'Unknown',
      cve: ['CVE-2025-12352'],
      cwes: [],
      vulncheck_xdb: [],
      vulncheck_reported_exploitation: [],
      reported_exploited_by_vulncheck_canaries: false,
      date_added: '2026-06-23T00:00:00Z',
    },
  ],
}, {
  lookbackDays: 30,
  maxCandidates: 1,
  asOf: '2026-06-23',
  seenCves: new Set(),
});

const normalizedPrefill = productNormalized.candidates[0].source_packet_prefill;
assert.equal(normalizedPrefill.affected_products[0].vendor, 'rocketgenius');
assert.equal(normalizedPrefill.affected_products[0].product, 'gravityforms');
assert.equal(normalizedPrefill.preserved_vulncheck_fields.vendorProject, null);
assert.equal(normalizedPrefill.preserved_vulncheck_fields.product, null);

const filteredXdb = buildRecentIntake({
  data: [
    {
      vendorProject: 'simplefilelist',
      product: 'simple_file_list',
      vulnerabilityName: 'simplefilelist simple_file_list Unrestricted Upload of File with Dangerous Type',
      shortDescription: 'Simple File List WordPress plugin remote code execution.',
      required_action: 'Patch.',
      knownRansomwareCampaignUse: 'Unknown',
      cve: ['CVE-2020-36847'],
      cwes: [],
      vulncheck_xdb: [
        {
          xdb_id: 'ec52bbb216f8',
          xdb_url: 'https://vulncheck.com/xdb/ec52bbb216f8',
          date_added: '2025-08-23T02:22:58Z',
          exploit_type: 'initial-access',
          clone_ssh_url: 'git@github.com:137f/PoC-CVE-2020-36847-WordPress-Plugin-4.2.2-RCE.git',
        },
        {
          xdb_id: 'ee72a50e36ee',
          xdb_url: 'https://vulncheck.com/xdb/ee72a50e36ee',
          date_added: '2026-02-10T10:46:55Z',
          exploit_type: 'initial-access',
          clone_ssh_url: 'git@github.com:0xGunrunner/CVE-2025-34085.git',
        },
      ],
      vulncheck_reported_exploitation: [],
      reported_exploited_by_vulncheck_canaries: false,
      date_added: '2026-06-23T00:00:00Z',
    },
  ],
}, {
  lookbackDays: 30,
  maxCandidates: 1,
  asOf: '2026-06-23',
  seenCves: new Set(),
});

assert.equal(filteredXdb.candidates[0].vulncheck_exploitation_signal.xdb_count, 1);
assert.deepEqual(
  filteredXdb.candidates[0].vulncheck_exploitation_signal.evidence_urls,
  ['https://vulncheck.com/xdb/ec52bbb216f8'],
);
assert.deepEqual(
  filteredXdb.candidates[0].source_packet_prefill.preserved_vulncheck_fields.vulncheck_xdb.map(item => item.xdb_id),
  ['ec52bbb216f8'],
);

console.log('vulncheck-kev-intake tests passed');
