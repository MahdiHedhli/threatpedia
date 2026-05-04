# Threatpedia Enrichment Queue Proposal

Status: proposed, not implemented.

This document defines the proposed enrichment lane for Threatpedia. It is
intentionally a design artifact only; implementation should wait until the
incident, campaign, threat-actor, and zero-day discovery queues are open,
validated, and stable.

## Problem

The discovery pipeline currently uses deduplication to prevent duplicate task
creation. That protects the queue from churn, but it can also suppress
follow-up reporting. A source that is a duplicate for article creation can
still contain new victim counts, attribution updates, patch guidance, campaign
links, actor links, timeline detail, or corrections.

Threatpedia needs a separate enrichment path so duplicate or follow-up signals
can be evaluated without bypassing the same quality gates used for new
articles.

## Goals

- Preserve strict deduplication for new article creation.
- Route duplicate-with-new-signal inputs into an enrichment queue instead of
  discarding them silently.
- Periodically re-check active or recently closed entities for bounded updates.
- Identify relationship gaps between incidents, campaigns, zero-days, and
  threat actors.
- Require the same validation, review, and merge gates as normal corpus PRs.
- Keep high-judgment classification separate from lower-risk patch execution.

## Non-Goals

- No direct-to-main article updates.
- No automated merge-to-main.
- No automatic attribution upgrades.
- No cosmetic rewrite queue.
- No bulk retagging or canonicalization without explicit review.
- No private-repo coordination mirror for routine enrichment state.

## Queue Types

### `enrichment/candidate`

A source overlaps with an existing article or task but may contain new,
article-relevant information.

Examples:

- A duplicate incident source adds a confirmed victim count.
- A vendor advisory adds affected versions or patch status to a zero-day.
- A court filing confirms an actor link previously treated as unknown.

### `enrichment/watch`

An active or recently closed entity should be periodically checked for updates.
Suggested watch windows:

- Zero-days: 60 days after active exploitation or patch stabilization.
- Incidents: 45 to 60 days after the last public update.
- Campaigns: while ongoing, plus 60 days after conclusion.
- Threat actors: ongoing, lower cadence, only for high-confidence reporting.

### `enrichment/linkage`

A source suggests a relationship between existing or missing corpus entries.

Examples:

- An incident is linked to an actor not yet in the threat-actor collection.
- A zero-day exploitation report links to an existing campaign.
- A campaign report names an incident that should be cross-linked.

### `enrichment/canonical-review`

A source suggests a split, merge, rename, duplicate, or scope conflict that
needs high-judgment review before any article update.

Examples:

- Incident versus campaign boundary is unclear.
- Two actor aliases may or may not represent the same group.
- A duplicate article candidate may actually be a distinct event.

### `enrichment/no-op`

The source was evaluated and intentionally discarded. This should capture the
reason so inputs with insufficient evidence are not repeatedly reprocessed.

Example reasons:

- Exact duplicate, no new information.
- Blog repetition without new evidence.
- Unsupported speculation.
- Marketing language only.
- Source conflicts with stronger primary reporting.

## Duplicate Classification

Discovery and manual link intake should continue to block duplicate article
creation. The proposed enrichment path would add a second classification step
for duplicates:

| Classification | Meaning | Action |
|---|---|---|
| `exact_duplicate` | Source is already represented and adds no new fact. | Record `enrichment/no-op`. |
| `duplicate_with_new_signal` | Source overlaps but contains a concrete new supported fact. | Create `enrichment/candidate`. |
| `possible_canonical_conflict` | Source may require split, merge, rename, or scope review. | Create `enrichment/canonical-review`. |
| `relationship_signal` | Source suggests a missing or stale cross-reference. | Create `enrichment/linkage`. |

The classifier must prefer false negatives over enrichment with low confidence.
Inputs with insufficient evidence should be dropped with a no-op reason rather
than promoted into patch work.

## Worker Separation

### Enrichment Classifier

The classifier is the primary decision lane. It decides whether a source creates
an enrichment task and which queue type applies.

Recommended model routing:

- Use a high-capability model when running in ChatGPT/Codex.
- Use an advanced model for CoWork when the task uses limited sources, affects
  established canon, or has conflicting source data.

Classifier responsibilities:

- Evaluate duplicate sources for new supported information.
- Select queue type and blocker reason.
- Identify whether a human decision is needed.
- Avoid drafting or patching articles directly.

### Enrichment Executor

The executor is the bounded patch lane. It updates an existing article only
after a clear enrichment task exists.

Recommended model routing:

- Use a cost-effective model for bounded source-backed updates.
- Escalate to a high-capability model only when the update uses limited sources,
  affects canonicalization, or fails review.

Executor responsibilities:

- Update only the article fields or body sections required by the task.
- Add or revise sources with frontmatter/body parity.
- Avoid unsupported `relatedSlugs`, MITRE mappings, attribution changes, or
  impact expansion.
- Open a PR and pass all existing gates.

## Safeguards

Every enrichment PR must satisfy the same controls as a standard article PR:

- Local shared validation passes.
- GitHub validation passes on the current head SHA.
- Current-head AI review has zero unresolved threads.
- Actionable Gemini or non-author review threads are zero.
- Source/body parity is preserved.
- No internal process or confidence-scoring language leaks into public prose.
- No unsupported attribution, victim counts, impact scope, timeline entries,
  `relatedSlugs`, or MITRE mappings are added.
- Kernel K or another authorized reviewer handles merge.

Enrichment updates must be classified by change type:

- `new_source`
- `new_timeline_event`
- `new_impact_detail`
- `new_relationship`
- `correction`
- `canonical_cleanup`
- `source_replacement`

The PR body should state the exact change type and evidence basis.

## Watch Queue Lifecycle

Watch tasks should have an expiration policy so active monitoring does not
become permanent queue debt.

Suggested fields for a future task shape:

- `watch_start`
- `watch_until`
- `watch_reason`
- `entity_type`
- `entity_slug`
- `cadence`
- `last_checked`
- `last_signal`
- `no_signal_count`

Suggested cadence:

- Active zero-days with high CVSS scores: daily while active, then weekly until expiry.
- High-severity incidents: weekly for 45 to 60 days after last update.
- Ongoing campaigns: weekly while active, then weekly for 60 days.
- Threat actors: monthly, unless tied to a recent incident or campaign.

## Relationship Extraction

The enrichment classifier should look for supported relationships across the
four public content collections:

- Incident to threat actor.
- Incident to campaign.
- Incident to zero-day.
- Campaign to threat actor.
- Campaign to incident.
- Zero-day to incident.
- Zero-day to campaign.
- Threat actor to campaign or incident.

Relationship tasks must not assume a link from proximity alone. The source must
explicitly support the relationship, or the task should be blocked as
insufficiently sourced.

## Rollout Plan

1. Finish opening and validating the incident, campaign, threat-actor, and
   zero-day discovery queues.
2. Add a dry-run enrichment classifier that reports duplicate classifications
   without writing task files.
3. Test classifier output against recent duplicate discovery/manual-link inputs.
4. Add an `enrichment/no-op` memory path so exact duplicates are not repeatedly
   reconsidered.
5. Add `enrichment/candidate` task emission behind a manual flag.
6. Run one controlled enrichment pilot on a non-critical incident or zero-day.
7. Add watch-queue task shape and expiry rules.
8. Only after the pilot passes all gates, consider a recurring enrichment
   classifier.

## Open Decisions

- Whether enrichment task state should live in the existing task JSON schema or
  a separate `.github/pipeline/enrichment/` namespace.
- Whether duplicate classification should happen inside discovery, manual link
  intake, or a separate post-discovery workflow.
- Whether `enrichment/no-op` should share rejection memory or use a distinct
  evidence log.
- How strict the default watch windows should be for low-severity incidents.
- Whether relationship extraction should be enabled for all collections at once
  or piloted on incident-to-threat-actor links first.
