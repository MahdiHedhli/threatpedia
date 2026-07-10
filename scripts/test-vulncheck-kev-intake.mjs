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
assert.equal(result.candidates[0].official_cisa_kev.listed, null);
assert.equal(result.candidates[0].official_cisa_kev.date_added, null);
assert.equal(
  result.candidates[0].official_cisa_kev.status_source,
  'not inferred from VulnCheck; verify CISA KEV membership against CISA before official labeling',
);
assert.equal(result.candidates[0].source_packet_prefill.key_dates.cisa_kev_added_at_from_vulncheck_record, '2026-06-11');
assert.ok(result.candidates[0].priority_reasons.includes('recent VulnCheck date_added'));
assert.ok(result.candidates[1].priority_reasons.includes('VulnCheck date_added present'));
assert.ok(!result.candidates[1].priority_reasons.includes('recent VulnCheck date_added'));
assert.equal(result.candidates[0].vulncheck_exploitation_signal.non_authoritative, true);
assert.equal(result.candidates[0].vulncheck_exploitation_signal.xdb_exploit_types[0], 'info-leak');
assert.equal(result.candidates[0].source_packet_prefill.status, 'prefill_only');
assert.equal(result.candidates[0].source_packet_prefill.source_quality.source_sufficiency, 'needs_human_review');
assert.match(result.candidates[0].source_packet_prefill.authority_boundary.instruction, /verify CISA KEV membership/);

const msrcPrimaryEvidence = buildRecentIntake({
  data: [{
    vendorProject: 'Microsoft',
    product: 'Windows',
    vulnerabilityName: 'Microsoft Windows vulnerability',
    shortDescription: 'Microsoft Windows vulnerability with first-party MSRC evidence.',
    required_action: 'Apply the vendor update.',
    knownRansomwareCampaignUse: 'Unknown',
    cve: ['CVE-2020-1027'],
    cwes: ['CWE-787'],
    vulncheck_xdb: [],
    vulncheck_reported_exploitation: [{
      url: 'https://api.msrc.microsoft.com/cvrf/v3.0/cvrf/2020-Apr',
      date_added: '2020-04-14T00:00:00Z',
    }],
    reported_exploited_by_vulncheck_canaries: false,
    date_added: '2020-03-23T00:00:00Z',
  }],
}, {
  lookbackDays: 30,
  maxCandidates: 1,
  asOf: '2026-07-09',
  seenCves: new Set(),
});

const msrcPacket = msrcPrimaryEvidence.candidates[0].source_packet_prefill;
assert.ok(msrcPacket.supporting_sources.some(source => (
  source.url === 'https://api.msrc.microsoft.com/cvrf/v3.0/cvrf/2020-Apr'
    && source.publisher === 'Microsoft'
    && source.source_type === 'vendor'
    && source.role === 'primary'
)));
assert.equal(msrcPacket.source_quality.has_primary_source, true);
assert.equal(msrcPacket.source_quality.source_sufficiency, 'needs_human_review');
assert.match(
  msrcPacket.not_supported.find(item => item.claim === 'Article-ready source sufficiency').reason,
  /direct primary references.*unverified.*human review.*authoritative cross-checking/,
);
assert.equal(msrcPrimaryEvidence.drafting_enabled, false);
assert.equal(msrcPrimaryEvidence.candidates[0].drafting_allowed, false);

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

const correctedProduct = buildRecentIntake({
  data: [
    {
      vendorProject: 'GNU',
      product: 'grub2',
      vulnerabilityName: 'GNU grub2 OS Command Injection',
      shortDescription: 'Cockpit remote login passes user-controlled values to SSH without validation.',
      required_action: 'Patch.',
      knownRansomwareCampaignUse: 'Unknown',
      cve: ['CVE-2025-12352', 'CVE-2026-4631'],
      cwes: ['CWE-78'],
      vulncheck_xdb: [],
      vulncheck_reported_exploitation: [],
      reported_exploited_by_vulncheck_canaries: false,
      date_added: '2026-07-08T00:00:00Z',
    },
  ],
}, {
  lookbackDays: 30,
  maxCandidates: 1,
  asOf: '2026-07-09',
  seenCves: new Set(),
});

assert.equal(correctedProduct.candidates[0].vendorProject, 'Red Hat');
assert.equal(correctedProduct.candidates[0].product, 'cockpit');
assert.equal(
  correctedProduct.candidates[0].vulnerabilityName,
  'Cockpit: unauthenticated remote code execution due to SSH command-line argument injection',
);
assert.equal(correctedProduct.candidates[0].source_packet_prefill.affected_products[0].vendor, 'Red Hat');
assert.equal(correctedProduct.candidates[0].source_packet_prefill.affected_products[0].product, 'cockpit');
assert.equal(correctedProduct.candidates[0].source_packet_prefill.preserved_vulncheck_fields.vendorProject, 'Red Hat');
assert.equal(correctedProduct.candidates[0].source_packet_prefill.preserved_vulncheck_fields.product, 'cockpit');
assert.equal(
  correctedProduct.candidates[0].source_packet_prefill.preserved_vulncheck_fields.vulnerabilityName,
  'Cockpit: unauthenticated remote code execution due to SSH command-line argument injection',
);
assert.ok(
  correctedProduct.candidates[0].source_packet_prefill.supporting_sources.some(
    source => source.url === 'https://www.cve.org/CVERecord?id=CVE-2026-4631'
      && source.id.startsWith('src-cve-normalization-')
      && !source.notes.includes('VulnCheck observed'),
  ),
);
assert.ok(
  correctedProduct.candidates[0].source_packet_prefill.affected_products[0].source_refs.some(
    sourceRef => sourceRef.startsWith('src-cve-normalization-'),
  ),
);
const correctedSourcesById = new Map(
  correctedProduct.candidates[0].source_packet_prefill.supporting_sources.map(source => [source.id, source]),
);
const correctedCvesById = new Map(
  correctedProduct.candidates[0].source_packet_prefill.cves.map(cve => [cve.id, cve]),
);
for (const cve of correctedCvesById.values()) {
  assert.ok(cve.source_refs.every(sourceRef => typeof sourceRef === 'string' && sourceRef.length > 0));
}
assert.ok(
  correctedCvesById.get('CVE-2026-4631').source_refs.some(
    sourceRef => correctedSourcesById.get(sourceRef)?.url.endsWith('CVE-2026-4631'),
  ),
);
assert.ok(
  correctedCvesById.get('CVE-2025-12352').source_refs.every(
    sourceRef => !correctedSourcesById.get(sourceRef)?.url.endsWith('CVE-2026-4631'),
  ),
);

const reportedEvidenceFixture = [
  { url: ' HTTPS://cyber.gov.au/example-alert ', date_added: '2026-07-09T00:00:00Z' },
  { url: 'https://www.cve.org/CVERecord?id=CVE-2026-31843', date_added: '2026-07-09T00:00:00Z' },
  { url: 'https://nvd.nist.gov/vuln/detail/CVE-2026-31843', date_added: '2026-07-09T00:00:00Z' },
  { url: 'https://www.ncsc.gov.uk/example-alert', date_added: '2026-07-09T00:00:00Z' },
  { url: 'https://cyber.gc.ca/example-alert', date_added: '2026-07-09T00:00:00Z' },
  { url: 'https://www.bsi.bund.de/example-alert', date_added: '2026-07-09T00:00:00Z' },
  { url: 'https://www.ncsc.govt.nz/example-alert', date_added: '2026-07-09T00:00:00Z' },
  { url: 'https://cyber.example.gov.scot/example-alert', date_added: '2026-07-09T00:00:00Z' },
  { url: 'https://cert.ssi.gouv.fr/example-alert', date_added: '2026-07-09T00:00:00Z' },
  { url: 'https://example.gc.ca/example-alert', date_added: '2026-07-09T00:00:00Z' },
  { url: 'https://example.gob.mx/example-alert', date_added: '2026-07-09T00:00:00Z' },
  { url: 'https://example.go.jp/example-alert', date_added: '2026-07-09T00:00:00Z' },
  { url: 'https://example.gv.at/example-alert', date_added: '2026-07-09T00:00:00Z' },
];

const evidenceClassified = buildRecentIntake({
  data: [
    {
      vendorProject: null,
      product: null,
      vulnerabilityName: 'pay-uz remote code execution',
      shortDescription: 'The goodoneuz/pay-uz package allows unauthenticated remote code execution.',
      required_action: 'Patch.',
      knownRansomwareCampaignUse: 'Unknown',
      cve: ['CVE-2026-31843'],
      cwes: [],
      vulncheck_xdb: [],
      vulncheck_reported_exploitation: reportedEvidenceFixture,
      reported_exploited_by_vulncheck_canaries: false,
      date_added: '2026-07-09T00:00:00Z',
    },
  ],
}, {
  lookbackDays: 30,
  maxCandidates: 1,
  asOf: '2026-07-09',
  seenCves: new Set(),
});

const classifiedCandidate = evidenceClassified.candidates[0];
assert.equal(classifiedCandidate.vendorProject, 'goodoneuz');
assert.equal(classifiedCandidate.product, 'pay-uz');
assert.equal(classifiedCandidate.vulncheck_exploitation_signal.reported_exploitation_count, 11);
assert.deepEqual(classifiedCandidate.vulncheck_exploitation_signal.evidence_urls, [
  'https://cyber.gov.au/example-alert',
  'https://www.ncsc.gov.uk/example-alert',
  'https://cyber.gc.ca/example-alert',
  'https://www.bsi.bund.de/example-alert',
  'https://www.ncsc.govt.nz/example-alert',
  'https://cyber.example.gov.scot/example-alert',
  'https://cert.ssi.gouv.fr/example-alert',
  'https://example.gc.ca/example-alert',
  'https://example.gob.mx/example-alert',
  'https://example.go.jp/example-alert',
  'https://example.gv.at/example-alert',
]);
assert.ok(classifiedCandidate.priority_reasons.includes('11 VulnCheck reported exploitation reference(s)'));
assert.equal(classifiedCandidate.source_packet_prefill.source_quality.has_government_source, true);
assert.equal(classifiedCandidate.source_packet_prefill.source_quality.has_primary_source, false);
assert.ok(
  classifiedCandidate.source_packet_prefill.supporting_sources.some(
    source => source.url.includes('cve.org/CVERecord') && source.notes.includes('not counted as exploitation evidence'),
  ),
);
assert.ok(
  classifiedCandidate.source_packet_prefill.supporting_sources.some(
    source => source.publisher === 'National Vulnerability Database' && source.source_type === 'database',
  ),
);
const classifiedSourcesById = new Map(
  classifiedCandidate.source_packet_prefill.supporting_sources.map(source => [source.id, source]),
);
assert.ok(
  classifiedCandidate.source_packet_prefill.affected_products[0].source_refs.some(
    sourceRef => classifiedSourcesById.get(sourceRef)?.url.endsWith('CVE-2026-31843'),
  ),
);
for (const publisher of [
  'National Cyber Security Centre',
  'Canadian Centre for Cyber Security',
  'Federal Office for Information Security',
  'National Cyber Security Centre New Zealand',
]) {
  assert.ok(
    classifiedCandidate.source_packet_prefill.supporting_sources.some(
      source => source.publisher === publisher && source.source_type === 'government',
    ),
  );
}
assert.ok(
  classifiedCandidate.source_packet_prefill.supporting_sources.some(
    source => source.publisher === 'cyber.example.gov.scot' && source.source_type === 'government',
  ),
);
for (const publisher of ['cert.ssi.gouv.fr', 'example.gc.ca', 'example.gob.mx', 'example.go.jp', 'example.gv.at']) {
  assert.ok(
    classifiedCandidate.source_packet_prefill.supporting_sources.some(
      source => source.publisher === publisher && source.source_type === 'government',
    ),
  );
}
assert.deepEqual(
  classifiedCandidate.source_packet_prefill.preserved_vulncheck_fields.vulncheck_reported_exploitation,
  reportedEvidenceFixture,
);

const escapedMetadata = buildRecentIntake({
  data: [
    {
      vendorProject: 'icegram',
      product: 'email_subscribers_\\&_newsletters',
      vulnerabilityName: 'icegram email_subscribers_\\&_newsletters Missing Authorization',
      shortDescription: 'Email Subscribers & Newsletters vulnerability.',
      required_action: 'Patch.',
      knownRansomwareCampaignUse: 'Unknown',
      cve: ['CVE-2019-19985'],
      cwes: [],
      vulncheck_xdb: [],
      vulncheck_reported_exploitation: [],
      reported_exploited_by_vulncheck_canaries: false,
      date_added: '2019-11-13T00:00:00Z',
    },
  ],
}, {
  lookbackDays: 30,
  maxCandidates: 1,
  asOf: '2026-07-09',
  seenCves: new Set(),
});

assert.equal(escapedMetadata.candidates[0].product, 'email_subscribers_&_newsletters');
assert.equal(escapedMetadata.candidates[0].source_packet_prefill.affected_products[0].product, 'email_subscribers_&_newsletters');
assert.equal(escapedMetadata.candidates[0].source_packet_prefill.preserved_vulncheck_fields.product, 'email_subscribers_&_newsletters');

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
  ['ec52bbb216f8', 'ee72a50e36ee'],
);

const compressedMultiCveXdb = buildRecentIntake({
  data: [
    {
      vendorProject: 'linux',
      product: 'kernel',
      vulnerabilityName: 'Linux Kernel vulnerability',
      shortDescription: 'Linux Kernel CVE with compressed multi-CVE proof-of-concept repository name.',
      required_action: 'Patch.',
      knownRansomwareCampaignUse: 'Unknown',
      cve: ['CVE-2024-42009'],
      cwes: [],
      vulncheck_xdb: [
        {
          xdb_id: 'compressed',
          xdb_url: 'https://vulncheck.com/xdb/compressed',
          date_added: '2025-06-05T00:00:00Z',
          exploit_type: 'initial-access',
          clone_ssh_url: 'git@github.com:Foxer131/CVE-2024-42008-9-exploit.git',
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

assert.equal(compressedMultiCveXdb.candidates[0].vulncheck_exploitation_signal.xdb_count, 1);
assert.deepEqual(
  compressedMultiCveXdb.candidates[0].vulncheck_exploitation_signal.evidence_urls,
  ['https://vulncheck.com/xdb/compressed'],
);

const fullRangeXdb = buildRecentIntake({
  data: [
    {
      vendorProject: 'linux',
      product: 'kernel',
      vulnerabilityName: 'Linux Kernel vulnerability',
      shortDescription: 'Linux Kernel CVE with full multi-CVE proof-of-concept repository name.',
      required_action: 'Patch.',
      knownRansomwareCampaignUse: 'Unknown',
      cve: ['CVE-2025-6019'],
      cwes: [],
      vulncheck_xdb: [
        {
          xdb_id: 'full-range',
          xdb_url: 'https://vulncheck.com/xdb/full-range',
          date_added: '2025-06-05T00:00:00Z',
          exploit_type: 'initial-access',
          clone_ssh_url: 'git@github.com:example/CVE-2025-6018-6019.git',
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

assert.equal(fullRangeXdb.candidates[0].vulncheck_exploitation_signal.xdb_count, 1);

const shortSuffixRangeXdb = buildRecentIntake({
  data: [
    {
      vendorProject: 'linux',
      product: 'kernel',
      vulnerabilityName: 'Linux Kernel vulnerability',
      shortDescription: 'Linux Kernel CVE with short suffix proof-of-concept repository name.',
      required_action: 'Patch.',
      knownRansomwareCampaignUse: 'Unknown',
      cve: ['CVE-2025-6019'],
      cwes: [],
      vulncheck_xdb: [
        {
          xdb_id: 'short-suffix-range',
          xdb_url: 'https://vulncheck.com/xdb/short-suffix-range',
          date_added: '2025-06-05T00:00:00Z',
          exploit_type: 'initial-access',
          clone_ssh_url: 'git@github.com:example/CVE-2025-6018-19.git',
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

assert.equal(shortSuffixRangeXdb.candidates[0].vulncheck_exploitation_signal.xdb_count, 1);

const singleDigitSuffixRangeXdb = buildRecentIntake({
  data: [
    {
      vendorProject: 'example',
      product: 'example',
      vulnerabilityName: 'Four-digit CVE with single-digit compressed suffix',
      shortDescription: 'Repository name abbreviates a neighboring four-digit CVE with one digit.',
      required_action: 'Patch.',
      knownRansomwareCampaignUse: 'Unknown',
      cve: ['CVE-2024-5442'],
      cwes: [],
      vulncheck_xdb: [
        {
          xdb_id: 'single-digit-suffix-range',
          xdb_url: 'https://vulncheck.com/xdb/single-digit-suffix-range',
          date_added: '2025-06-05T00:00:00Z',
          exploit_type: 'initial-access',
          clone_ssh_url: 'git@github.com:example/CVE-2024-5441-2.git',
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

assert.equal(singleDigitSuffixRangeXdb.candidates[0].vulncheck_exploitation_signal.xdb_count, 1);

const fourDigitAbbreviatedSuffixXdb = buildRecentIntake({
  data: [
    {
      vendorProject: 'example',
      product: 'example',
      vulnerabilityName: 'Five-digit CVE with four-digit compressed suffix',
      shortDescription: 'Repository name abbreviates a neighboring five-digit CVE with four suffix digits.',
      required_action: 'Patch.',
      knownRansomwareCampaignUse: 'Unknown',
      cve: ['CVE-2024-12346'],
      cwes: [],
      vulncheck_xdb: [
        {
          xdb_id: 'four-digit-abbreviated-suffix',
          xdb_url: 'https://vulncheck.com/xdb/four-digit-abbreviated-suffix',
          date_added: '2025-06-05T00:00:00Z',
          exploit_type: 'initial-access',
          clone_ssh_url: 'git@github.com:example/CVE-2024-12345-2346.git',
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

assert.equal(fourDigitAbbreviatedSuffixXdb.candidates[0].vulncheck_exploitation_signal.xdb_count, 1);

const chainedMultiCveXdb = buildRecentIntake({
  data: [
    {
      vendorProject: 'example',
      product: 'appliance',
      vulnerabilityName: 'Chained multi-CVE proof-of-concept repository',
      shortDescription: 'Repository name lists several CVEs in one hyphenated chain.',
      required_action: 'Patch.',
      knownRansomwareCampaignUse: 'Unknown',
      cve: ['CVE-2025-32395'],
      cwes: [],
      vulncheck_xdb: [
        {
          xdb_id: 'chained-range',
          xdb_url: 'https://vulncheck.com/xdb/chained-range',
          date_added: '2025-06-05T00:00:00Z',
          exploit_type: 'initial-access',
          clone_ssh_url: 'git@github.com:example/CVE-2025-30208-31125-31486-32395.git',
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

assert.equal(chainedMultiCveXdb.candidates[0].vulncheck_exploitation_signal.xdb_count, 1);

const versionSuffixXdb = buildRecentIntake({
  data: [
    {
      vendorProject: 'chrome',
      product: 'v8',
      vulnerabilityName: 'Version suffix is not another CVE',
      shortDescription: 'PoC repository suffix should not be treated as a lower-numbered CVE.',
      required_action: 'Patch.',
      knownRansomwareCampaignUse: 'Unknown',
      cve: ['CVE-2025-0417'],
      cwes: [],
      vulncheck_xdb: [
        {
          xdb_id: 'version-suffix',
          xdb_url: 'https://vulncheck.com/xdb/version-suffix',
          date_added: '2025-06-05T00:00:00Z',
          exploit_type: 'initial-access',
          clone_ssh_url: 'git@github.com:example/CVE-2025-0411-7-Zip.git',
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

assert.equal(versionSuffixXdb.candidates[0].vulncheck_exploitation_signal.xdb_count, 0);

const dotVersionSuffixXdb = buildRecentIntake({
  data: [
    {
      vendorProject: 'example',
      product: 'app',
      vulnerabilityName: 'Dot version suffix is not another CVE',
      shortDescription: 'PoC repository version suffix starting with dot should not be treated as a CVE suffix.',
      required_action: 'Patch.',
      knownRansomwareCampaignUse: 'Unknown',
      cve: ['CVE-2024-34103'],
      cwes: [],
      vulncheck_xdb: [
        {
          xdb_id: 'dot-version-suffix',
          xdb_url: 'https://vulncheck.com/xdb/dot-version-suffix',
          date_added: '2025-06-05T00:00:00Z',
          exploit_type: 'initial-access',
          clone_ssh_url: 'git@github.com:example/CVE-2024-34102-3.9.20.git',
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

assert.equal(dotVersionSuffixXdb.candidates[0].vulncheck_exploitation_signal.xdb_count, 0);

console.log('vulncheck-kev-intake tests passed');
