# Supply Chain Canary Phase 0

Phase 0 establishes the minimum ingestion spine for normalized package release
events across npm, PyPI, and Go.

## Operator Contract

The Phase 0 path may:

- detect new package releases from supported registry feeds
- confirm registry facts through authoritative package metadata APIs
- normalize releases into `ReleaseEvent`
- store append-only observations in Postgres
- store raw registry metadata for re-derivation
- enqueue async enrichment placeholders
- schedule OSV trailing re-polls for 30 days after release

The Phase 0 path must not:

- score packages or maintainers
- infer actor attribution
- recommend policy decisions
- detect or label malware on its own
- replace dependency scanning
- create a trusted-registry concept
- ingest top-package lists as a special class

## Adapter Behavior

### npm

Use registry change detection as the trigger only. Confirm package-version facts
through `registry.npmjs.org` package metadata. Do not treat `include_docs`
payloads as the fact source.

Module: `supply_chain_canary/npm_adapter.py`

### PyPI

Poll PyPI updates RSS for release candidates, then confirm release details with
the PyPI JSON API.

Module: `supply_chain_canary/pypi_adapter.py`

### Go

Poll `index.golang.org/index?since=<RFC3339>`. Persist the cursor in
`supply_feed_cursor`. Persist boundary keys so rows repeated at the cursor edge
can be deduped.

Module: `supply_chain_canary/go_adapter.py`

## Postgres Tables

`supply_release_event` stores normalized release events and raw registry
metadata.

`supply_enrichment_observation` stores async enrichment observations and
placeholders for OSV, deps.dev, and OpenSSF Scorecard.

`supply_label_observation` stores labels observed from external enrichment
providers, including delayed OSV MAL labels. A label observation is a source
observation, not a Threatpedia verdict.

`supply_feed_cursor` stores per-feed cursor state and boundary metadata.

## Validation

Run the focused Phase 0 checks:

```bash
python3 -m compileall supply_chain_canary tests
python3 -m unittest discover -s tests
git diff --check
```

These checks validate parser behavior, PURL normalization, fixture-based
adapter output, enrichment placeholders, and the Postgres schema contract.

## Current Limits

Phase 0 does not include a scheduler, worker deployment, queue UI, graph
database, or scoring model. It provides the ingestion spine those later phases
can consume.
