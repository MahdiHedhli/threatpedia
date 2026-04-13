# Gemini Code Assist — Review Protocol for Bot Tasks

All Threatpedia bot tasks that create PRs must handle Gemini Code Assist review
comments. This protocol ensures comments are triaged, fixed, replied to, and
resolved consistently across all automated tasks.

## Shared Utility

Use `scrapers/gemini_review.py` — a reusable handler that encapsulates the full
pre-check / post-check / reply workflow.

```python
from gemini_review import GeminiReviewHandler

handler = GeminiReviewHandler(token_path="~/Documents/Coding/Threatpedia/.envbot")
```

## Phase 0: Pre-Check (Before Main Work)

Scan all open PRs for unresolved Gemini comments before starting today's work.

```python
results = handler.precheck_all_open_prs()
for pr_num, result in results.items():
    for comment in result.actionable:  # critical + high only
        # Fix the issue on the PR branch, commit, push
        # Then reply:
        handler.reply_to_comment(
            pr_number=pr_num,
            comment_id=comment.comment_id,
            fix_description="Brief description of what was fixed",
            commit_hash="abc1234",
            comment_type=comment.comment_type,
        )
```

### Severity Triage

| Severity | Action |
|----------|--------|
| Critical | Fix immediately — clone, checkout branch, fix, commit, push, reply |
| High | Fix immediately — same as critical |
| Medium | Fix if straightforward (< 5 min). Otherwise acknowledge with reply |
| Low | Acknowledge with reply, defer to next run |

## Phase 7: Post-Check (After PR Creation)

After creating a PR, monitor for Gemini comments at timed intervals.

```python
result = handler.postcheck_pr(pr_number=26, wait_minutes=10)

# Fix actionable comments
for comment in result.actionable:
    # Apply fix...
    handler.reply_to_comment(
        pr_number=26,
        comment_id=comment.comment_id,
        fix_description="...",
        commit_hash="...",
    )

# Acknowledge medium/low comments
for comment in result.medium + result.low:
    handler.reply_to_comment(
        pr_number=26,
        comment_id=comment.comment_id,
        fix_description="Acknowledged — will address in next iteration",
        commit_hash="N/A",
    )
```

### Timing

| Check | When | Action |
|-------|------|--------|
| 1st | 2 min after PR | Fix critical/high, acknowledge medium |
| 2nd | 5 min after PR | Fix any new critical/high |
| 3rd | 10 min after PR | Final check, acknowledge remaining |

## Reply Format

All replies to Gemini comments should follow this format:

```
Fixed in {short_commit_hash} — {brief description of what was changed}
```

For acknowledged-but-deferred comments:

```
Acknowledged — will address in next iteration. {optional brief note}
```

## Reactions

Add an `eyes` reaction to each Gemini comment to signal it has been reviewed:

```python
comment.create_reaction("eyes")
```

## Tasks Using This Protocol

All tasks that create PRs should implement this protocol:

- `threatpedia-build-scrapers` — Connector/scraper PRs
- `threatpedia-source-deep-dive` — Spec PRs
- `new-threat-intel-*` — Incident report PRs
- `daily-incident-updater` — Enrichment PRs
- `incident-crosslink-gapfill` — Gap-fill PRs
- `glossary-term-updater` — Glossary PRs
- `threat-actor-updater` — Actor page PRs
- `zero-day-tracker` — Zero-day PRs
- `zero-day-enricher` — Enrichment PRs
- `tp-roadmap-updater` — Roadmap PRs
