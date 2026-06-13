# Supply-Chain Graph Primitives

Phase 1B introduced first-class entity and relationship JSON files. Phase 1C
deepens those primitives by extracting build systems, distribution channels,
and compromised accounts from the curated incident corpus.

This is a lightweight relationship layer, not a graph database.

## Inputs

```text
data/supply-chain-incidents/incidents.json
```

## Generated Entity Files

```text
data/supply-chain-entities/maintainers.json
data/supply-chain-entities/packages.json
data/supply-chain-entities/repositories.json
data/supply-chain-entities/organizations.json
data/supply-chain-entities/build_systems.json
data/supply-chain-entities/distribution_channels.json
data/supply-chain-entities/accounts.json
```

Each entity has:

- `id`: stable normalized identifier
- `name`: display name
- `aliases`: normalized duplicate-detection surface
- `source_incident_ids`: incident IDs that caused the entity to be emitted

Package entities also carry `ecosystem` and a required canonical `package_url`
PURL. See `docs/supply-chain-purl-model.md` for the canonical grammar.
Repository entities also carry `host`, `url`, and `owner`.
Build-system, distribution-channel, and account entities carry type-specific
fields copied from the incident corpus.

## Relationship Store

```text
data/supply-chain-relationships/relationships.json
```

Allowed relationship types are intentionally narrow:

- `AFFECTED_PACKAGE`
- `AFFECTED_MAINTAINER`
- `AFFECTED_REPOSITORY`
- `AFFECTED_ORGANIZATION`
- `RELATED_INCIDENT`
- `USED_BUILD_SYSTEM`
- `USED_DISTRIBUTION_CHANNEL`
- `COMPROMISED_ACCOUNT`
- `SOURCE_ARTIFACT_DIVERGENCE`

Relationships usually use an incident node as the source:

```json
{
  "source": "incident-SC-2018-NPM-EVENT-STREAM",
  "target": "pkg-npm-event-stream",
  "type": "AFFECTED_PACKAGE"
}
```

## Current Graph Density

The Phase 1C depth pass over the same 25 incidents currently emits:

- Maintainers: 5
- Packages: 16
- Repositories: 10
- Organizations: 19
- Build systems: 6
- Distribution channels: 11
- Compromised accounts: 8
- Relationships: 95

## Build and Validate

Regenerate graph primitives:

```bash
python3 scripts/build_supply_chain_entities.py
```

Validate graph primitives:

```bash
python3 scripts/validate_supply_chain_graph.py
```

Run the focused tests:

```bash
python3 -m unittest discover -s tests
```

## Current Scope

This phase supports lookup questions such as:

- incidents involving a package
- incidents involving a maintainer
- incidents involving a repository
- incidents involving an organization
- incidents involving a build system
- incidents involving a distribution channel
- incidents involving a compromised account

It does not implement:

- Neo4j, Memgraph, or Apache AGE
- scoring
- actor attribution
- trust scores
- embeddings
- machine learning
- dashboards
- policy recommendations
