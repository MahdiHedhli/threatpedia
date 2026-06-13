# Supply-Chain Graph Primitives

Phase 1B converts the curated supply-chain incident corpus into first-class
entity and relationship JSON files. This is a lightweight relationship layer,
not a graph database.

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
```

Each entity has:

- `id`: stable normalized identifier
- `name`: display name
- `aliases`: normalized duplicate-detection surface
- `source_incident_ids`: incident IDs that caused the entity to be emitted

Package entities also carry `ecosystem` and `package_url` when available.
Repository entities also carry `host`, `url`, and `owner`.

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

Relationships usually use an incident node as the source:

```json
{
  "source": "incident-SC-2018-NPM-EVENT-STREAM",
  "target": "pkg-npm-event-stream",
  "type": "AFFECTED_PACKAGE"
}
```

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

It does not implement:

- Neo4j, Memgraph, or Apache AGE
- scoring
- actor attribution
- trust scores
- embeddings
- machine learning
- dashboards
- policy recommendations
