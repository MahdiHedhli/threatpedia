# Threatpedia Supply Chain Canary

Threatpedia Supply Chain Canary is a release-event ingestion spine for package
registry activity. Phase 0 records normalized release observations for npm,
PyPI, and Go so downstream systems can enrich, review, and re-derive facts from
raw registry metadata.

This is not a malware detector, dependency scanner, attribution engine, scoring
system, policy recommender, or trusted-registry model.

## Canonical Shape

Every observed package release is normalized into a `ReleaseEvent` with a
package URL (PURL) as the canonical package-version key:

- npm: `pkg:npm/<name>@<version>`
- PyPI: `pkg:pypi/<normalized-name>@<version>`
- Go: `pkg:golang/<module-path>@<version>`

The normalized event keeps:

- ecosystem, package name, version, PURL
- release publication time
- feed name and feed cursor
- observed registry facts
- raw registry metadata for re-derivation
- source URL and observation time

Observed facts are append-only registry observations. They are not verdicts.

## Feeds

### npm

npm registry change detection is used only as a trigger. Phase 0 does not rely
on `include_docs` as a fact source. Package and version facts are confirmed
through `https://registry.npmjs.org/<package>` before a `ReleaseEvent` is
emitted.

### PyPI

PyPI updates RSS is used as the change trigger. Release facts are confirmed
through the PyPI JSON API before a `ReleaseEvent` is emitted.

### Go

Go uses `https://index.golang.org/index?since=<RFC3339>`. Cursor state and
boundary-row dedupe data are persisted through `supply_feed_cursor`, because
the index can return rows at the cursor boundary again.

## Storage

Phase 0 uses Postgres only. The schema lives in
`supply_chain_canary/schema.sql` and creates:

- `supply_release_event`
- `supply_enrichment_observation`
- `supply_label_observation`
- `supply_feed_cursor`

`supply_release_event` is idempotent on:

```text
ecosystem, name, version, published_at, feed_cursor
```

The raw registry payload is stored with each event so future enrichers can
re-derive facts without trusting transient adapter behavior.

## Enrichment Placeholders

Phase 0 creates async enrichment placeholders only for:

- OSV
- deps.dev
- OpenSSF Scorecard

OSV has a trailing re-poll placeholder window of 30 days after release so
delayed MAL labels can be captured later. The placeholder does not classify a
release as malicious.

## Non-Goals

Phase 0 deliberately excludes:

- Neo4j or Memgraph graph storage
- actor attribution
- package or maintainer scoring
- malware detection
- policy recommendations
- trusted registry labeling
- top-500 package ingestion
- dependency scanner replacement behavior
