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
- `fixtures/zero-day-valid-packet.json` is a passing fixture.
- `fixtures/zero-day-invalid-packet.json` is an intentionally failing fixture.

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
