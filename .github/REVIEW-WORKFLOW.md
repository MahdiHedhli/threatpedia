# Threatpedia Human Review Workflow

## Overview

Threatpedia uses a two-track publishing model built on GitHub's native review infrastructure:

- **Direct push** — Routine enrichments, glossary updates, roadmap syncs, and other operational changes go straight to `main` and deploy immediately.
- **PR-based review** — New incident reports and new threat actor pages go through a pull request with human approval before merging to `main`.

## What Requires a PR

| Content Type | Workflow | Why |
|---|---|---|
| New incident report | PR → Review → Merge | New claims need source verification, attribution checks |
| New threat actor page | PR → Review → Merge | Attribution and alias mapping need human validation |
| Existing report enrichment | Direct push | Low risk — adds sources, fixes links, improves quality |
| Glossary updates | Direct push | Terminology additions, role tagging |
| Roadmap / config / CSS | Direct push | Infrastructure maintenance |
| Manifest / index updates | Direct push (bundled with above) | Data coordination files |

## How It Works

### For Automated Tasks

The `new-threat-intel` and `incident-crosslink-gapfill` tasks create new content. Their prompts instruct them to:

1. Create the report files locally
2. Create a new branch: `incident/<slug>` or `actor/<slug>`
3. Commit the new files + manifest/index updates to that branch
4. Push the branch and open a PR using `gh pr create`
5. The PR auto-populates from `.github/PULL_REQUEST_TEMPLATE.md`

The `incident-review.yml` workflow then:
- Detects what type of content changed
- Applies appropriate labels (`new-incident`, `needs-review`, `auto-generated`, etc.)
- Posts a summary comment listing all new/changed files
- Validates JSON files and checks for required meta tags

### For Human Reviewers

1. Open the PR on GitHub
2. Review the incident report content:
   - Are sources credible and independently verifiable?
   - Is the threat actor attribution accurate? Is the confidence level appropriate?
   - Is the severity rating justified?
   - Are MITRE ATT&CK mappings correct?
   - Are cross-links to related incidents present and bidirectional?
3. Approve, request changes, or comment
4. Once approved by a CODEOWNERS reviewer, merge to `main`
5. GitHub Pages auto-deploys on merge

### Labels

| Label | Meaning |
|---|---|
| `new-incident` | PR adds a new incident report |
| `incident-update` | PR modifies an existing report |
| `new-threat-actor` | PR adds a new threat actor page |
| `actor-update` | PR modifies a threat actor page |
| `needs-review` | Awaiting human review |
| `approved` | Reviewed and approved |
| `changes-requested` | Reviewer requested changes |
| `auto-generated` | Created by a scheduled automation |
| `enrichment-only` | Updates to existing content only |

## Setup Checklist

- [x] CODEOWNERS file defining review owners
- [x] PR template with review checklist
- [x] GitHub Actions workflow for auto-labeling and validation
- [x] Label definitions (run `label-sync.yml` once to create them)
- [ ] Branch protection ruleset on `main` (see below)

## Branch Protection Setup

Go to **Settings → Rules → Rulesets → New branch ruleset** for `main`:

1. Enable "Require a pull request before merging"
2. Set required approvals to 1
3. Enable "Require review from Code Owners"
4. Enable "Require status checks to pass" and add the `label-and-validate` check
5. **Important**: If automated tasks need to push enrichments directly, add them as bypass actors or use path-based targeting

> **Note**: Branch rulesets (the newer GitHub feature) support path-based targeting. This lets you require PRs only for `incidents/*.html` additions while allowing direct pushes for everything else — which is exactly what we need since operational tasks (daily-updater, glossary, roadmap) push directly.
