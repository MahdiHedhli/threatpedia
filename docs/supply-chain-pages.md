# Supply Chain Pages

Threatpedia Supply Chain pages render the curated supply-chain incident corpus
and graph primitives as static pages. The public label is **Supply Chain**. The
internal implementation may still use the supply-chain-canary codename.

## Feature Flag

Pages are disabled by default.

```bash
ENABLE_SUPPLY_CHAIN_PAGES=true
```

When the flag is not set to `true`, the static route generator emits no Supply
Chain routes and the public navigation does not include a Supply Chain link.

## Routes

When enabled, the static site generates:

```text
/supply-chain/
/supply-chain/incidents/[id]/
/supply-chain/packages/[id]/
/supply-chain/repositories/[id]/
/supply-chain/organizations/[id]/
/supply-chain/maintainers/[id]/
```

The pages are generated from checked-in JSON only:

```text
data/supply-chain-incidents/incidents.json
data/supply-chain-entities/*.json
data/supply-chain-relationships/relationships.json
```

## Local Build

Disabled/default build:

```bash
cd site
npm run build
```

Enabled build:

```bash
cd site
ENABLE_SUPPLY_CHAIN_PAGES=true npm run build
```

Focused page tests:

```bash
node scripts/test-supply-chain-pages.mjs
```

Run graph validation before page generation:

```bash
python3 scripts/validate_supply_chain_incidents.py
python3 scripts/validate_supply_chain_graph.py
```

## Page Content

The index page shows counts for:

- incidents
- packages
- repositories
- organizations
- maintainers
- build systems
- distribution channels
- relationships

Incident pages show corpus fields only: summary, confidence, evidence level,
attack stage, source-artifact divergence, affected entities, structured supply-
chain primitives, compromised accounts, and references.

Entity pages show the entity name, entity type, connected incidents, and
connected entities when relationships support those links.

## Non-Goals

These pages do not implement:

- scoring
- soak windows
- public UI conclusions beyond corpus fields
- graph databases
- live ingestion
- automated attribution
- AI-generated content
- generated recommendations
