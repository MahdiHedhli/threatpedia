# Supply Chain Live Discovery

Threatpedia Supply Chain B1 introduces live discovery and intake classification for supply-chain leads. The lane is intentionally a candidate queue only.

## Boundary

B1 may:

- read npm registry changes, PyPI updates RSS, OSV.dev, the Go module index, GitHub Security Advisories, and VulnCheck KEV prefills;
- normalize those signals into deduplicated leads;
- classify leads with the intake v1.2 freshness and work-intent model;
- write `.github/pipeline/supply-chain-candidates/latest.json`;
- expose pending candidate count and latest discovery signal on the Supply Chain graph surface.

B1 must not:

- create article tasks;
- generate article drafts;
- import records into the curated supply-chain corpus;
- treat registry-only release observations as evidence of compromise;
- persist derived KEV status as authored truth.

Grounded drafting is the B2 prerequisite before approved candidates may be consumed for generation.

## Candidate Queue

The live queue path is:

```text
.github/pipeline/supply-chain-candidates/latest.json
```

Each candidate carries:

- `canonicalSubjectId`
- `subjectType`
- `proposedArchetype`
- `sources` and `sourceRefs`
- `mergedLeadRefs`
- `entityMatch`
- `matchedEntityHints`
- `classification.leadClass`
- `classification.workIntent`
- `classification.effectiveActiveStatus`
- `classification.kevStatusDerived`
- `rank`
- `draftingAllowed: false`

`kevStatusDerived` is dispatch-cycle output. The durable CISA KEV inputs remain separate, and the candidate queue never becomes official KEV truth.

## Feed Behavior

- npm: registry changes are triggers only. Package and version facts are confirmed through `registry.npmjs.org` package metadata.
- PyPI: `https://pypi.org/rss/updates.xml` is the trigger. Package and version facts are confirmed through the PyPI JSON API.
- Go: `https://index.golang.org/index?since=<RFC3339>` is used with cursor/boundary dedupe persisted in the queue.
- OSV.dev: the modified-record index is used to find recent npm/PyPI/Go vulnerability records.
- GitHub Security Advisories: reviewed and malware advisories for npm, pip, and Go are treated as advisory signals.
- VulnCheck KEV: existing recent-first source-packet prefills are read as non-authoritative exploitation signals.

Registry release feeds are high-volume. Release-only observations without supply-chain terms, advisory corroboration, or existing graph connectivity are filtered out rather than queued.

## Running Locally

Fixture-backed run:

```bash
cd threatpedia
node scripts/supply-chain-live-discovery.mjs \
  --dry-run \
  --fixtures-dir tests/fixtures/supply_chain_live_discovery \
  --as-of 2026-06-22T00:00:00Z
```

Live dry run:

```bash
cd threatpedia
node scripts/supply-chain-live-discovery.mjs --dry-run --out /tmp/supply-chain-candidates.json
```

Live queue write:

```bash
cd threatpedia
node scripts/supply-chain-live-discovery.mjs --execute
node scripts/supply-chain-live-discovery.mjs --check
```

## Workflow

`.github/workflows/supply-chain-live-discovery.yml` runs every 30 minutes and can be manually dispatched. It opens or updates a PR from `pipeline/supply-chain-live-discovery`, requests review from Kernel K, DangerMouse, and Ernest Penfold, and includes `@codex review` plus `/gemini review`.

The workflow commits only:

- `.github/pipeline/supply-chain-candidates/**`
- `.github/pipeline/source-packets/vulncheck-kev/**`

It does not add `.github/pipeline/tasks/**`.

## Validation

Relevant checks:

```bash
node --check scripts/supply-chain-live-discovery.mjs
node scripts/test-supply-chain-live-discovery.mjs
node scripts/supply-chain-live-discovery.mjs --check --queue-path .github/pipeline/supply-chain-candidates/latest.json
```

The queue check fails if any candidate permits drafting, omits required classifier fields, stores KEV status as authored truth, or duplicates candidate IDs.
