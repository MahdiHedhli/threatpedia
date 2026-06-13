# Supply-Chain Graph Primitives

Phase 1B introduced first-class entity and relationship JSON files. Phase 1C
deepened those primitives by extracting build systems, distribution channels,
and compromised accounts from the curated incident corpus. Phase 2B connects
the supply-chain corpus to existing Threatpedia actor and campaign entities
where public evidence supports the edge.

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
data/supply-chain-entities/actors.json
data/supply-chain-entities/campaigns.json
```

Each entity has:

- `id`: stable normalized identifier
- `name`: display name
- `aliases`: normalized duplicate-detection surface
- `source_incident_ids`: incident IDs that caused the entity to be emitted

Package entities also carry `ecosystem` and a required canonical `package_url`
PURL. Generic package PURLs require `purl_justification` because they are
reviewed exceptions, not registry-joinable package keys. See
`docs/supply-chain-purl-model.md` for the canonical grammar.
Repository entities also carry `host`, `url`, and `owner`.
Build-system, distribution-channel, and account entities carry type-specific
fields copied from the incident corpus.
Actor entities may point at an existing Threatpedia actor page or at a
provisional supply-chain operator node. Provisional actor nodes are stable
placeholders for coherent operators and must not invent a nation-state label or
APT name. Campaign entities point at existing Threatpedia campaign pages.

## Relationship Store

```text
data/supply-chain-relationships/relationships.json
```

Allowed relationship types are intentionally narrow:

- `AFFECTED_PACKAGE`
- `AFFECTED_MAINTAINER`
- `AFFECTED_REPOSITORY`
- `AFFECTED_ORGANIZATION`
- `ATTRIBUTED_TO_ACTOR`
- `RELATED_INCIDENT`
- `RELATED_CAMPAIGN`
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

Actor and campaign edges are cross-corpus convergence edges:

```json
{
  "source": "incident-SC-2023-THREE-CX-DESKTOP",
  "target": "actor-lazarus-group",
  "type": "ATTRIBUTED_TO_ACTOR"
}
```

`RELATED_CAMPAIGN` must start from an incident node. `ATTRIBUTED_TO_ACTOR`
may start from an incident node or, for a provisional operator case such as XZ
Utils, from a maintainer node to preserve the relationship between the named
maintainer identity and the provisional operator node. Every actor and campaign
target must resolve to an emitted entity; dangling actor/campaign edges are hard
validation failures.

## Current Graph Density

The Phase 2B pass over the same 25 incidents currently emits:

- Maintainers: 5
- Packages: 16
- Repositories: 10
- Organizations: 17
- Build systems: 6
- Distribution channels: 11
- Compromised accounts: 8
- Actors: 4
- Campaigns: 3
- Relationships: 101

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
- supply-chain incidents connected to an existing actor or campaign
- provisional operator edges where the evidence supports a coherent operator
  but not a named public APT

It does not implement:

- Neo4j, Memgraph, or Apache AGE
- scoring
- automated actor attribution
- trust scores
- embeddings
- machine learning
- dashboards
- policy recommendations
