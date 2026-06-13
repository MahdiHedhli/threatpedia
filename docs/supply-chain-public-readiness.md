# Supply Chain Public Readiness Gate

The Supply Chain section is feature-flagged by `ENABLE_SUPPLY_CHAIN_PAGES`.
Before enabling it in a public deployment, run the public readiness gate from
the repository root:

```bash
node scripts/check_supply_chain_public_readiness.mjs
```

If working from the `scripts/` package directory, the same gate is available as:

```bash
cd scripts
npm run check:supply-chain-public-readiness
```

The gate writes a machine-readable report to:

```text
.worker-state/supply-chain-public-readiness.json
```

## PASS Criteria

A `pass` result means the gate completed all required checks and found no
public-enablement blockers. The gate verifies:

- supply-chain incident validation passes
- supply-chain graph validation passes
- supply-chain page model tests pass
- site dependencies install with `npm ci --no-audit --no-fund`
- the default disabled build emits no `/supply-chain/` output
- the enabled build emits `/supply-chain/` output
- public copy contains no `Canary` wording
- the Supply Chain nav link appears only when the flag is enabled
- `/supply-chain/` exists only when the flag is enabled
- all five featured incident pages exist when enabled
- featured incident pages render editorial sections
- generated Supply Chain pages have no broken internal Supply Chain links
- SEO metadata exists on the index and featured incident pages
- emitted JSON-LD blocks parse as valid JSON
- enabled Supply Chain pages are not marked `noindex`
- generated route count matches the corpus-derived route count

## Report Shape

The readiness report includes:

- `status`: `pass` or `fail`
- `timestamp`: ISO timestamp for the run
- `counts`: corpus and generated-route counts used by the gate
- `checked_routes`: index, featured incident, and sampled generated routes
- `checks`: command-level results with exit codes and output tails
- `failures`: operator-facing blockers

The report is intended for operator handoff and audit. A failed report should
be treated as a stop condition for public enablement until the listed blocker is
fixed and the gate returns `pass`.

## Operational Notes

The readiness gate does not enable the feature flag, change deployment
configuration, create pages when disabled, or relax validation policy. It only
answers whether the current corpus, graph, page code, and generated static
output are safe to deploy with `ENABLE_SUPPLY_CHAIN_PAGES=true`.

Existing campaign validator warnings may appear during the Astro build because
the site build runs campaign validation first. Those warnings are not Supply
Chain readiness failures unless the build exits non-zero.

## Preview Deploy Review

Before changing production deployment configuration, review an enabled preview
build. From the repository root:

```bash
node scripts/check_supply_chain_preview.mjs
```

The preview check runs the public readiness gate, confirms the enabled static
output includes `/supply-chain/` and the five featured incident pages, compares
the generated route count to the readiness report, and verifies that this branch
has not accidentally committed a production deploy flag change.

To inspect the generated preview locally:

```bash
cd site
ENABLE_SUPPLY_CHAIN_PAGES=true npm run build
npm run preview -- --host 127.0.0.1
```

Preview review checklist:

- `/supply-chain/` renders and shows corpus counts
- the five featured incident pages render editorial sections
- package, repository, organization, maintainer, build-system, distribution
  channel, and compromised-account entity pages render from JSON data
- the Supply Chain nav link is visible in the enabled preview
- index and featured incident pages include title, description, canonical,
  Open Graph metadata, and valid JSON-LD
- public copy does not contain `Canary`
- internal Supply Chain links resolve
- pages do not show unexpected `noindex`

Record the preview URL or local preview result before opening the production
enablement PR.
