# Supply Chain Pages

Threatpedia Supply Chain pages render the curated supply-chain incident corpus
and graph primitives as static pages. The public label is **Supply Chain**.

## Feature Flag

Pages are disabled by default.

```bash
ENABLE_SUPPLY_CHAIN_PAGES=true
```

When the flag is not set to `true`, the static route generator emits no Supply
Chain routes and the public navigation does not include a Supply Chain link.
This is the default behavior and prevents disabled pages from being indexed.

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

The index page uses public-facing Supply Chain copy and explains:

- what Threatpedia tracks
- why supply chain incidents matter
- how entities connect
- the evidence and confidence model

It also shows five curated featured incident cards:

- XZ Utils backdoor attempt
- 3CX desktop application software supply-chain compromise
- SolarWinds Orion software build compromise
- event-stream malicious dependency insertion
- ua-parser-js npm package account compromise

The index page shows counts for:

- incidents
- packages
- repositories
- organizations
- maintainers
- build systems
- distribution channels
- compromised accounts
- relationships

Incident pages show corpus fields: summary, confidence, evidence level, attack
stage, source-artifact divergence, affected entities, structured supply-chain
primitives, compromised accounts, connected entities, and references. Featured
incidents may additionally render validated editorial sections when present:

- Executive Summary
- Timeline
- Attack Chain
- Affected Ecosystem
- Defensive Lessons
- Detection Notes
- Open Questions

Non-featured incidents continue to render as structured corpus pages without
editorial sections.

Entity pages show the entity name, entity type, connected incidents, and
connected entities when relationships support those links.

## SEO Metadata

Supply Chain pages use the shared site layout metadata path for:

- page title
- meta description
- canonical URL
- Open Graph title and description
- JSON-LD where a static corpus object maps cleanly to a generic web object

When `ENABLE_SUPPLY_CHAIN_PAGES` is not `true`, no Supply Chain static routes
are emitted. If a disabled page path is rendered in a nonstandard local context,
the page path also supports a noindex robots value.

## Public Enablement Checklist

Before enabling the section publicly, run the readiness gate:

```bash
node scripts/check_supply_chain_public_readiness.mjs
```

The gate writes `.worker-state/supply-chain-public-readiness.json` and returns a
single PASS/FAIL decision. See
[Supply Chain Public Readiness Gate](./supply-chain-public-readiness.md) for the
full readiness contract.

If the gate fails and an operator needs to inspect individual steps, the manual
checks are:

1. Run the corpus validators:

   ```bash
   python3 scripts/validate_supply_chain_incidents.py
   python3 scripts/validate_supply_chain_graph.py
   ```

2. Run the page contract test:

   ```bash
   node scripts/test-supply-chain-pages.mjs
   ```

3. Confirm the disabled build emits no Supply Chain output:

   ```bash
   cd site
   rm -rf dist
   npm run build
   test ! -e dist/supply-chain
   ```

4. Confirm the enabled build emits representative pages:

   ```bash
   cd site
   rm -rf dist
   ENABLE_SUPPLY_CHAIN_PAGES=true npm run build
   test -f dist/supply-chain/index.html
   test -f dist/supply-chain/incidents/SC-2024-XZ-UTILS/index.html
   test -f dist/supply-chain/packages/pkg-npm-event-stream/index.html
   ```

5. Spot-check the generated pages for:

   - no public use of internal codenames
   - working featured incident links
   - working related incident links
   - confidence and evidence fields visible on incident pages
   - featured incident editorial sections visible and citation-backed
   - non-featured incidents still render without editorial sections
   - no scoring, recommendations, live-feed copy, or generated conclusions

## Supply Chain Editorial Checklist

Use this checklist before adding or changing a featured incident editorial page:

1. Keep the incident count unchanged unless a separate corpus-expansion task
   explicitly approves new records.
2. Add or reuse `references[*].id` values before citing references from
   editorial fields.
3. Keep every editorial item as a bounded claim object with `reference_ids`.
4. Use valid timeline dates: `YYYY-MM-DD` or `YYYY-MM-DD/YYYY-MM-DD`.
5. Do not add claims that are not supported by the incident's own references.
6. Do not add scoring, severity rankings, soak windows, live-feed status, or
   automated attribution.
7. Run:

   ```bash
   python3 scripts/validate_supply_chain_incidents.py
   node scripts/test-supply-chain-pages.mjs
   ```

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
