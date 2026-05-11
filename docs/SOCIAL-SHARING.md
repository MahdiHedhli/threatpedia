# Threatpedia Social Sharing

Threatpedia prepares X share posts after the GitHub Pages deploy job completes.
The automation is intentionally safe by default: it runs in `dry-run` mode until
live posting is explicitly enabled in repository configuration.

## Current X Integration

- Script: `scripts/social-share-x.mjs`
- Workflow hook: `.github/workflows/deploy.yml`, job `social-share-x`
- Trigger: push to `main`, after the Pages deploy job succeeds
- Default behavior: write deterministic post drafts to the GitHub Actions job
  summary; do not call the X API

The script detects newly added Markdown/MDX files in:

- `site/src/content/incidents/`
- `site/src/content/campaigns/`
- `site/src/content/threat-actors/`
- `site/src/content/zero-days/`

It generates one post per new shareable article:

```text
New Threatpedia incident: Example Article Title
https://threatpedia.wiki/incidents/example-article/
#Threatpedia #Cybersecurity
```

## Live Posting Gate

Live posting requires all of the following:

1. Repository variable `X_SHARE_MODE` set to `post`.
2. Repository secret `X_POSTING_ENABLED` set exactly to `true`.
3. X user-context credentials with write permission.

Preferred credential option:

- `X_USER_ACCESS_TOKEN` - OAuth 2.0 user access token with write scope.

Supported OAuth 1.0a fallback:

- `X_API_KEY`
- `X_API_SECRET`
- `X_ACCESS_TOKEN`
- `X_ACCESS_TOKEN_SECRET`

Do not store X credentials in repo files, workflow logs, PR bodies, or local
notes. Use GitHub repository secrets.

## Optional Controls

- `X_SHARE_REVIEW_STATUSES`: comma-separated review statuses eligible for
  sharing. Default: `draft_ai,draft_human,under_review,certified`.
- `X_SHARE_MAX_POSTS`: maximum posts allowed in one run. Default: `10`.
- `X_ALLOW_RERUN_POSTS`: set to `true` only when deliberately reposting from a
  rerun after checking duplicate-post risk.

## Local Dry Run

Run from the public repo root after installing script dependencies:

```bash
npm --prefix scripts ci --no-audit --no-fund
npm --prefix scripts run social:share-x -- \
  --files site/src/content/incidents/example.md \
  --mode dry-run \
  --json
```

To test a commit range:

```bash
npm --prefix scripts run social:share-x -- \
  --base HEAD~1 \
  --head HEAD \
  --mode dry-run \
  --json
```

## Operational Notes

- The workflow runs after deployment so shared URLs should exist before any live
  post is attempted.
- X counts each URL as 23 characters for post-length enforcement. The sharing
  script uses that weighting instead of raw URL string length when drafting
  posts.
- The script does not invent a parallel state store. It uses the merge range to
  find newly added content files.
- Re-running a live-post workflow can duplicate posts. The script blocks GitHub
  rerun attempts unless `X_ALLOW_RERUN_POSTS=true`.
- Keep post copy conservative. The generated text includes only the article
  type, title, URL, and neutral hashtags.
