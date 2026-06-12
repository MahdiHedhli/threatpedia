# Zero-Day Source Packet Pilot

This pilot adds a deterministic source packet stage before zero-day drafting:

```
task JSON -> source packet -> deterministic preflight -> article draft -> validator -> PR -> review gate
```

The source packet is an evidence contract. A drafter should not add factual
claims beyond `claims[]` unless the packet is updated and preflight is rerun.

## Files

- `schema/source-packet-1.schema.json` defines the versioned packet shape.
- `scripts/build-source-packet.mjs` builds a conservative packet from one
  zero-day task JSON.
- `scripts/preflight-source-packet.mjs` validates one packet and returns
  pass/fail, errors, warnings, and a normalized summary.
- `scripts/vulncheck-kev-intake.mjs` emits recent-first VulnCheck KEV
  prioritization/source-packet-prefill artifacts in dry-run mode only.
- `fixtures/zero-day-valid-packet.json` is a passing fixture.
- `fixtures/zero-day-invalid-packet.json` is an intentionally failing fixture.

## VulnCheck KEV Prefill

ROAD-014 Slice 1 uses the VulnCheck KEV community backup endpoint as a
first-class but non-authoritative source for recent zero-day prioritization.
The helper requests one backup descriptor, follows the published backup payload
URL, sorts by top-level `date_added` descending, defaults to
`lookback_days: 30` and `max_candidates: 25`, and filters CVEs already present
in public task or zero-day state.

The helper output is deliberately not a source packet that can be drafted from
directly. Each candidate is marked `drafting_allowed: false` and includes a
`source_packet_prefill` object with VulnCheck supporting evidence, preserved
field lineage, and `needs_human_review` source sufficiency. CISA remains
authoritative for official CISA KEV membership, and CVE.org / MITRE remains
authoritative for CVE identity. VulnCheck-specific fields are treated as
exploitation signals and supporting evidence.

VulnCheck attribution is required when VulnCheck KEV data is surfaced to users.
Use the label `VulnCheck KEV` near any user-visible data derived from this
source.

## Preflight Coverage

The pilot preflight checks:

- source sufficiency, URL dedupe, and source refs
- date shape and source-backed date claims
- CVE, CWE, and affected-product shape
- claim source support
- `not_supported` leakage into drafting notes
- uncertainty coverage for ambiguous dates, patches, and exploitation
- ATT&CK inclusion safety
- ASCII, local path, credential, and internal-process prose scans
- output target readiness for the article drafting path

## Pilot Metrics

Record these per zero-day PR during the pilot:

- preflight errors caught before drafting
- validator failures after drafting
- Gemini blocking comments per PR
- remediation commits per PR
- time from draft PR open to merge
- unsupported-claim fixes
- date/frontmatter fixes
- ATT&CK/CWE fixes

## Limitations

- The builder does not fetch source URLs.
- The builder does not call a model.
- Publisher and source-type classification is URL-derived and conservative.
- A passing packet does not mean the future article is merge-ready; it only
  means the drafter has a bounded evidence contract to draft from.
- ATT&CK candidates default to excluded unless source support is explicit.
