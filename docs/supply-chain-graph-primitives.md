# Supply-Chain Graph Primitives

Phase 1B introduced first-class entity and relationship JSON files. Phase 1C
deepened those primitives by extracting build systems, distribution channels,
and compromised accounts from the curated incident corpus. Phase 2B connects
the supply-chain corpus to existing Threatpedia actor and campaign entities
where public evidence supports the edge.
Phase 2C adds version-addressable release entities for package incidents with
precise public release evidence. Phase 2D strengthens maintainer entities with
dated anchors and explicit repository/account links.
The Supply Chain 1.0 S0 pass adds evidence-gated `SEEDED_BY` propagation
edges for hand-modeled compromise chains.

This is a lightweight relationship layer, not a graph database.

## Inputs

```text
data/supply-chain-incidents/incidents.json
```

## Generated Entity Files

```text
data/supply-chain-entities/maintainers.json
data/supply-chain-entities/packages.json
data/supply-chain-entities/releases.json
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
Release entities carry `purl`, `package_name`, `version`, `published_at`,
`ecosystem`, `malicious_range`, `references`, and nullable `disclosed_at`.
Release PURLs are versioned canonical PURLs and must remain joinable to the
release-event spine.
Maintainer entities also carry `onboarding_date`, `first_publish_date`,
`repositories`, and `account_ids`. The graph does not store `tenure`; pages can
derive tenure-at-malicious-release from those anchors and release
`published_at` values.
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
- `PACKAGE_RELEASE`
- `INCIDENT_AFFECTED_RELEASE`
- `MAINTAINS_REPOSITORY`
- `USES_ACCOUNT`
- `SEEDED_BY`
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

Release edges make specific malicious or affected versions graph-addressable:

```json
{
  "source": "pkg-npm-flatmap-stream",
  "target": "release-npm-flatmap-stream-0-1-1",
  "type": "PACKAGE_RELEASE"
}
```

`PACKAGE_RELEASE` starts from a package entity and targets a release entity.
`INCIDENT_AFFECTED_RELEASE` starts from an incident node and targets the same
release entity. Release nodes are not public-routed entity pages in Phase 2C,
but incident pages can display them as affected releases.

Maintainer intelligence edges connect maintainer identities to supported
repository/account primitives:

```json
{
  "source": "maintainer-dominictarr",
  "target": "repo-github-com-dominictarr-event-stream",
  "type": "MAINTAINS_REPOSITORY"
}
```

`MAINTAINS_REPOSITORY` and `USES_ACCOUNT` start from maintainer nodes. These
edges are not trust or behavior scores; they only preserve structured public
evidence needed to compute future canary primitives.

Propagation edges connect package or release nodes when public evidence
supports an ordered compromise chain:

```json
{
  "source": "pkg-generic-x-trader",
  "target": "pkg-generic-3cx-desktopapp",
  "type": "SEEDED_BY",
  "propagation_tier": "causal",
  "evidence_refs": ["ref-mandiant-3cx"],
  "source_incident_id": "SC-2023-THREE-CX-DESKTOP",
  "summary": "Mandiant documented the 3CX compromise as a cascade from a prior X_TRADER software supply-chain compromise."
}
```

`SEEDED_BY` is directed and must start from a `pkg-*` or `release-*` node and
target a `pkg-*` or `release-*` node. Every edge carries:

- `propagation_tier`: `causal` when public analysis documents that one
  compromise enabled the next, or `temporal` when only ordering is supported.
- `evidence_refs`: one or more reference IDs from the source incident.
- `source_incident_id`: the corpus incident that carries the evidence.
- `summary`: the bounded evidence note.

Temporal edges are precedence markers, not causation claims. The default is to
omit a propagation edge rather than infer one. Validators require all
`SEEDED_BY` endpoints to resolve and the propagation subgraph to remain acyclic.

If a package exists only to anchor an upstream propagation source, model it as
an affected component with `component_role: "upstream_seed"`. The builder will
create the package entity so the `SEEDED_BY` edge resolves, but it will not emit
`AFFECTED_PACKAGE` or `AFFECTED_ORGANIZATION` edges for that upstream seed on
the downstream incident.

## Current Graph Density

The Phase 2E pass over 27 incidents currently emits:

- Maintainers: 5
- Packages: 21
- Releases: 7
- Repositories: 11
- Organizations: 19
- Build systems: 6
- Distribution channels: 14
- Compromised accounts: 10
- Actors: 6
- Campaigns: 3
- Relationships: 140

After S0, the graph also carries 3 `SEEDED_BY` propagation edges across the
3CX/X_TRADER and Shai-Hulud modeled chains.

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
- incidents involving a specific package release
- incidents involving a maintainer
- maintained repositories or accounts connected to a maintainer
- incidents involving a repository
- incidents involving an organization
- incidents involving a build system
- incidents involving a distribution channel
- incidents involving a compromised account
- supply-chain incidents connected to an existing actor or campaign
- provisional operator edges where the evidence supports a coherent operator
  but not a named public APT
- evidence-gated propagation chains where one package or release seeded another

It does not implement:

- Neo4j, Memgraph, or Apache AGE
- scoring
- automated actor attribution
- trust scores
- embeddings
- machine learning
- dashboards
- policy recommendations
- automated propagation reconstruction
