# Supply Chain PURL Model

Threatpedia uses Package URL (PURL) strings as the canonical join key for supply-chain package and release records. The PURL model is intentionally narrow in Phase 2A: it covers package identity, validates existing package entities, and prepares the release layer for Phase 2C.

## Canonical Helper

The single source of truth for PURL parsing, normalization, and emission is:

```text
scripts/supply_chain_purl.py
```

Validators and corpus builders must use this helper rather than ad hoc regular expressions. Page generation should consume the already-normalized `package_url` values from the validated JSON data and should not re-normalize PURLs independently.

## Supported Ecosystems

The Phase 2A grammar supports the package ecosystems currently needed by the corpus and the release-event spine.

### npm

Unscoped npm packages use lowercase package names:

```text
pkg:npm/event-stream
```

Scoped npm packages encode the leading `@` as `%40`:

```text
pkg:npm/%40ledgerhq/connect-kit
```

The canonical helper lowercases npm names and rejects whitespace, empty scopes, and malformed scoped names.

### PyPI

PyPI package names use PEP 503-style normalization: lowercase, with runs of `-`, `_`, and `.` collapsed to `-`.

```text
pkg:pypi/torchtriton
```

### Go

Go modules use the `golang` PURL type and preserve the module import path.

```text
pkg:golang/github.com/boltdb/bolt
```

Go module paths must be non-empty, contain no whitespace, and start with an import host.

### Generic Cross-Ecosystem Placeholders

When an incident intentionally models a cross-ecosystem package placeholder, such as dependency-confusion internal names, the corpus uses the `generic` PURL type.

```text
pkg:generic/internal-dependency-names
```

This is reserved for explicit abstract package placeholders. It must not be used to avoid modeling a known npm, PyPI, or Go package.

Every `pkg:generic/...` package component and package entity must include `purl_justification`. The justification records why no registry-specific PURL exists. This keeps `generic` visible as a reviewed exception because generic PURLs do not join cleanly to OSV, deps.dev, OpenSSF Scorecard, or release-feed package keys.

## Validator Contract

The incident validator requires every `affected_components` item with `component_type: "package"` to carry a canonical `package_url`.

The graph validator requires every package entity in `data/supply-chain-entities/packages.json` to carry a canonical `package_url`.

Both validators fail if a package PURL:

- is missing
- has an unsupported PURL type
- does not match the entity or component ecosystem
- does not match the entity or component package name after canonical normalization
- uses non-canonical spelling or encoding
- uses the `generic` PURL type without an explicit `purl_justification`

Non-package components, such as software, services, websites, and update channels, are not package records and do not require PURLs in Phase 2A.

## Relationship Integrity

The graph validator also performs the foundation dangling-reference check. Every relationship endpoint must resolve to an incident node or an existing entity node. Missing relationship targets remain hard failures.

## Deferred Work

Release PURL validation is wired through the same helper but becomes mandatory when Phase 2C adds `releases.json`.

The full PURL and edge audit report is intentionally deferred to Phase 2F, after corpus expansion, so the closing audit covers the complete expanded corpus.
