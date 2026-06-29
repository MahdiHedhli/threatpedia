# Source Packets and Grounded Drafting

Source packets are Threatpedia's evidence contract before drafting:

```
task/candidate approval -> source packet -> deterministic preflight -> grounded draft -> fidelity check -> validator -> PR -> review gate
```

The source packet is an evidence contract. A drafter should not add factual
claims beyond `claims[]` unless the packet is updated and preflight is rerun.

## Files

- `schema/source-packet-1.schema.json` defines the versioned packet shape.
- `scripts/build-source-packet.mjs` builds a conservative packet from one
  zero-day task JSON.
- `scripts/build-grounded-source-packet.mjs` builds a B2 grounded packet from
  an explicitly approved B1 supply-chain candidate.
- `scripts/preflight-source-packet.mjs` validates one packet and returns
  pass/fail, errors, warnings, and a normalized summary.
- `scripts/draft-grounded-article.mjs` generates a conservative draft from
  packet claims only.
- `scripts/check-grounded-draft.mjs` verifies claim-marker and source-URL
  fidelity for a grounded draft.
- `scripts/vulncheck-kev-intake.mjs` emits recent-first VulnCheck KEV
  prioritization/source-packet-prefill artifacts in dry-run or live mode.
- `fixtures/zero-day-valid-packet.json` is a passing fixture.
- `fixtures/zero-day-invalid-packet.json` is an intentionally failing fixture.

## B2 Grounded Candidate Drafting

B2 consumes B1 candidate-queue entries only after explicit human or EP approval.
The candidate queue remains non-drafting state (`draftingAllowed: false`); the
approval is recorded in the grounded packet.

Sample fixture-backed flow:

```bash
node scripts/build-grounded-source-packet.mjs \
  --queue tests/fixtures/grounded_drafting/candidate_queue.json \
  --candidate-id SC-CAND-1234abcd5678ef90 \
  --approved-by KernelK \
  --approval-ref fixture-approval \
  --fixtures-dir tests/fixtures/grounded_drafting/sources \
  --out /tmp/grounded-packet.json

node scripts/preflight-source-packet.mjs /tmp/grounded-packet.json
node scripts/draft-grounded-article.mjs --packet /tmp/grounded-packet.json --out /tmp/grounded-draft.md
node scripts/check-grounded-draft.mjs --packet /tmp/grounded-packet.json --draft /tmp/grounded-draft.md
```

The grounded path supports the approved archetype lanes:
`incident`, `zero-day`, `campaign`, `threat-actor`, and `malware-family`.
Drafting is packet-only:

- source fetch/extraction failures fail closed unless an operator deliberately
  uses `--allow-fetch-failures`;
- every substantive draft sentence must carry a packet claim marker;
- every draft URL must come from packet sources;
- placeholder or source-recovery URLs are hard failures;
- facts absent from `claims[]` are omitted or left as packet uncertainties.

This path does not make every B1 candidate draftable. Candidate approval,
source sufficiency, packet preflight, and grounded-draft fidelity must all pass
before an article PR is opened.

## VulnCheck KEV Prefill

ROAD-014 uses the VulnCheck KEV community backup endpoint as a first-class but
non-authoritative source for recent zero-day prioritization. The helper
requests one backup descriptor, follows the published backup payload URL, sorts
by top-level `date_added` descending, defaults to `lookback_days: 30` and
`max_candidates: 10`, and filters CVEs already present in public task,
source-packet, or zero-day state. When the recent window is exhausted, live mode
fills from older unhandled records newest-to-oldest.

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

Live artifacts are written under `.github/pipeline/source-packets/vulncheck-kev/`
and staged in bounded VulnCheck prefill PRs. The discovery workflow caps each
active branch at `queues.source_packets.max_pending`; when the current prefill
PR is full, intake rolls over to a separate PR instead of overfilling the
existing batch. They are candidate/source-packet queue
items, not article draft tasks.

Production use is controlled by the `discovery_sources.vulncheck_kev.enabled`
setting in `.github/pipeline/config.yml`. Scheduled discovery runs also require
the repository Actions secret `VULNCHECKAPI`; the helper fails closed when live
mode is enabled but the token is unavailable. The live path is intentionally
bounded to one VulnCheck KEV backup fetch per run, 10 emitted candidates by
default, latest-first ordering, seen-CVE filtering, and sibling dampening by
vendor/product/day. Do not treat the config flag alone as a scheduled rollback:
until the workflow/helper are changed to skip the step when disabled, rollback
requires pausing or reverting the VulnCheck workflow/helper path, or manually
dispatching discovery with `execute=false` or a non-zero-day lane.

Operators should review the discovery PR before merge. VulnCheck prefill files
can raise priority and provide source-packet evidence, but they do not create
article tasks by themselves and do not satisfy drafting source sufficiency.

## Preflight Coverage

Preflight checks:

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

Record these per source-packet-backed PR:

- preflight errors caught before drafting
- validator failures after drafting
- Gemini blocking comments per PR
- remediation commits per PR
- time from draft PR open to merge
- unsupported-claim fixes
- date/frontmatter fixes
- ATT&CK/CWE fixes

## Limitations

- `scripts/build-source-packet.mjs` remains the legacy zero-day task packet
  builder and does not fetch source URLs.
- The B2 grounded builder fetches/extracts sources but does not call a model.
- Publisher and source-type classification is URL-derived and conservative.
- A passing packet does not mean the future article is merge-ready; it only
  means the drafter has a bounded evidence contract to draft from.
- ATT&CK candidates default to excluded unless source support is explicit.
