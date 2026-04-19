# Threatpedia Bot Automation Processes

## Overview

Threatpedia automation is coordinated through scheduled agent tasks that execute on defined schedules across 11 active pipelines: new threat intelligence discovery, incident enrichment, gap-fill reporting, glossary term management, threat actor linking, zero-day tracking, source research, scraper development, data ingestion, and bot-assisted code review. All tasks follow a standardized workflow that includes:

- **Scheduled execution** via CloudFlare Workers or local schedulers
- **Token-secured GitHub operations** through bot and owner accounts
- **Atomic file coordination** using task-state.json for lock management and pipeline state
- **Automated code review** via Gemini Code Assist bot with comment resolution loops
- **Standardized PR workflow** with validation, linting, and approval checkpoints
- **Cross-task deduplication** and manifest-first coordination rules

The architecture prioritizes data consistency, security, and uniform operational patterns across all automated agents.

## Bot Accounts and Credentials

### dangermouse-bot
- **Purpose**: GitHub automation bot for all scheduled task commits, branches, and PRs
- **Token Location**: `~/Documents/Coding/Threatpedia/.envbot`
- **Scope**: Full repository write access (commits, branches, PRs, comments)
- **Token Format**: Personal access token with repo, workflow, and read:user scopes
- **Usage Pattern**: Read token into in-process variable at task start, never inline in commands
- **Cleanup**: After git push operations, sanitize remote URLs immediately to prevent token exposure in logs

### Owner Account
- **Purpose**: Final PR approval and merge operations when CODEOWNERS review is required
- **Token Location**: `~/Documents/Coding/Threatpedia/.env.owner`
- **Scope**: Repository admin access for PR approvals and merge
- **Token Format**: Personal access token with repo scope (elevated)
- **Usage Pattern**: Read token into in-process variable, used only for approve/merge operations
- **Timing**: After Gemini review comments are resolved, owner account approves and merges

### Gemini Code Assist Bot
- **Purpose**: Automated code review for all PRs, posting inline comments on violations
- **Account**: Google-managed bot (comments from user login containing "gemini")
- **Triggers**: Automatically reviews any PR created on MahdiHedhli/threatpedia
- **Severity Levels**: Critical, High, Medium, Low
- **Response Time**: Typically posts comments within 1-3 minutes of PR creation
- **Comment Format**: Includes file path, line number, violation description, and suggested fix
- **Integration**: PRs are not merge-ready until Gemini comments have been reviewed, actionable findings fixed, replies posted, and actionable threads resolved. Post-merge follow-up is only for late-arriving comments that appear after the merge gate was already cleared.

## Security Requirements

Security is non-negotiable in all automation processes. The following rules protect the repository and user credentials:

### Token Handling
- **Never inline tokens** in shell commands, URLs, git remotes, or log output
- **Always read from files** into in-process variables at task start
- **Sanitize URLs** immediately after git push operations — remove any embedded tokens
- **Clear credentials** from process memory after use (where language-supported)

### Commit and Push Safety
- **Never commit tokens, keys, or credentials** to git, even in temporary branches
- **Never push branches** with exposed credentials — abort and report if detected
- **Always use environment variables or file reads** for all authentication
- **Verify stale locks** (.git/index.lock, .git/HEAD.lock) exist >5 minutes old before clearing

### Code Quality
- **Validate all generated JSON** before committing (use json module or jq, catch parse errors)
- **Validate all generated HTML** before committing (basic structure check: opening/closing tags)
- **Lint generated Python** if scrapers are involved (flake8, black for consistency)
- **Never commit unvalidated data** — failed validation should cause task to abort and report

### PR Review and Merging
- **All PRs must pass Gemini Code Assist review** before owner account merges
- **Critical and high-priority findings** must be fixed before merge
- **Medium and low findings** should also be reviewed before merge; if one is deferred, the deferment must be explicit and owned by the merger
- **Reply to actionable Gemini comments** with the fix or disposition before resolving the thread
- **Resolve actionable Gemini threads** before merge so review state matches the code state
- **Never merge PRs** with dangling security issues (exposed tokens, hardcoded credentials)

## Standard PR Workflow

Every scheduled task that writes to the repository must follow this workflow precisely:

### 1. Initialization (Pre-Work Check)
```
a. Read task-state.json for lock status and pipeline state
b. Check activeLocks for any locked task with lockedAt < 30 minutes ago
   - If blocked: skip run, log "blocked by {locked-task}", report and exit
   - If clear: continue to step 2
c. Set your own lock: activeLocks[task-name].locked = true, lockedAt = now UTC
d. Read bot token from ~/Documents/Coding/Threatpedia/.envbot into variable
e. Check for stale git lock files (.git/index.lock, .git/HEAD.lock)
   - If age > 5 minutes: rename to .bak, then delete .bak files
f. Run Gemini Review Pre-Check (see section below)
```

### 2. Feature Branch Creation
```
a. git fetch origin main
b. git checkout -b feature/{task-slug}-{timestamp} origin/main
   - Example: feature/new-threat-intel-20260408-1400
c. Verify you are on the new branch: git branch --show-current
```

### 3. Task-Specific Work
```
a. Execute main task logic (create reports, update manifests, enrich data, etc.)
b. Validate all generated files:
   - JSON: parse and dump back to ensure valid structure
   - HTML: basic tag balance check (opening count == closing count)
   - Python: flake8 or equivalent linter if scrapers involved
c. Do NOT commit yet — validation is pre-commit check
d. If validation fails: abort work, release lock, report error
e. If validation succeeds: proceed to commit
```

### 4. Commit and Push
```
a. git add [specific-files-only] — NEVER use git add -A
   - Explicitly list all modified files you intend to commit
   - Example: git add incidents/manifest.json incidents/incident-*.html
b. Verify staging: git status (ensure only intended files are staged)
c. Commit with descriptive message:
   - Format: "type: description (task-name)"
   - Example: "feat: add 3 new incidents from CISA KEV (new-threat-intel)"
   - Include Co-Authored-By line: Co-Authored-By: dangermouse-bot <bot@threatpedia.dev>
d. git pull --rebase origin main (conflict resolution strategy: accept remote, re-apply)
e. git push origin feature/{task-slug}-{timestamp}
   - If push fails: clear git locks, pull --rebase again, retry push once
   - If still fails: abort rebase, release lock, report failure and skip run
f. Immediately after successful push: sanitize remote URLs in logs
   - Remove any token artifacts or sensitive strings from logged output
```

### 5. PR Creation via GitHub API
```
a. Create PR with title and body:
   - Title: "{Feature Name} — {Brief Description}"
   - Example: "New Threat Intel from CISA — 3 incidents added"
   - Body: Include ticket/issue references, summary of changes, validation notes
b. Set PR as draft if incomplete: reviewers understand it's not ready to merge
c. Capture PR number from API response
d. Log PR URL: https://github.com/MahdiHedhli/threatpedia/pull/{number}
```

### 6. Gemini Review Gate (see dedicated section below)
```
a. Wait 2 minutes after PR creation
b. Query GitHub API for Gemini comments on the PR branch
c. If comments found: apply fixes on the same branch or a direct follow-up branch, push, reply, and resolve actionable threads
d. Re-check at 5 min total, then 10 min total
e. Merge only after actionable Gemini comments are addressed and threads are resolved
f. If comments arrive only after merge, handle them in a follow-up PR and document the exception
```

### 7. Finalization (Always)
```
a. Release lock: activeLocks[task-name].locked = false
b. Update activeLocks[task-name].lastCompleted = now UTC
c. Update task-state.json on main branch with current status
d. Log final status: "Task completed: {task-name}, {items-processed} items, {issues} issues resolved"
e. Report any Gemini comments that were unresolved (medium/low severity)
```

## Gemini Code Assist Review Protocol

Gemini Code Assist is an automated code review bot that runs on every PR and leaves inline comments with severity levels. The goal is to catch common issues (JSON syntax, missing cross-references, broken links, truncation) before they reach main. All Threatpedia tasks must integrate Gemini review checks into their workflows.

### Pre-Task Check (START of Every Run)

Before beginning main task work, check for any outstanding Gemini comments on open PRs:

```python
from github import Auth, Github
import os

# Step 1: Read token from file
with open(os.path.expanduser("~/Documents/Coding/Threatpedia/.envbot")) as f:
    token = f.read().strip()

# Step 2: Connect to GitHub
g = Github(auth=Auth.Token(token))
repo = g.get_repo("MahdiHedhli/threatpedia")

# Step 3: List all open PRs
open_prs = repo.get_pulls(state="open")
print(f"Checking {open_prs.totalCount} open PRs for Gemini comments...")

critical_issues = []
high_issues = []
medium_issues = []

for pr in open_prs:
    for comment in pr.get_comments():
        # Identify Gemini bot comments (user login contains "gemini")
        if comment.user and "gemini" in comment.user.login.lower():
            issue = {
                "pr_number": pr.number,
                "pr_title": pr.title,
                "file": comment.path,
                "line": comment.line,
                "body": comment.body,
                "severity": "critical" if "critical" in comment.body.lower()
                           else "high" if "high" in comment.body.lower()
                           else "medium" if "medium" in comment.body.lower()
                           else "low"
            }
            
            if issue["severity"] == "critical":
                critical_issues.append(issue)
            elif issue["severity"] == "high":
                high_issues.append(issue)
            elif issue["severity"] == "medium":
                medium_issues.append(issue)

# Step 4: Fix critical and high issues
if critical_issues or high_issues:
    print(f"Found {len(critical_issues)} critical and {len(high_issues)} high issues")
    for issue in critical_issues + high_issues:
        print(f"  PR #{issue['pr_number']}: {issue['file']} line {issue['line']}")
        # Clone PR branch, apply fix, commit, push (see detailed procedure below)
    # Create new PR with fixes, wait for Gemini review, repeat if needed
else:
    print("No critical/high issues found. Proceeding with main task.")
```

### Post-PR Check (AFTER Creating A PR, BEFORE MERGE)

Before merging a PR, check for Gemini comments and resolve them before the branch lands on `main`:

```python
import time

# After PR is opened and ready for review
print(f"PR #{pr_number} open. Checking for Gemini Code Assist comments before merge...")

# Timeline: check at 2 min, 5 min total, 10 min total
for wait_cycle, total_wait in [(120, 120), (180, 300), (300, 600)]:
    print(f"Waiting {wait_cycle} seconds (total: {total_wait}s)...")
    time.sleep(wait_cycle)
    
    target_pr = repo.get_pull(pr_number)
    if target_pr:
        gemini_comments = []
        for comment in target_pr.get_comments():
            if comment.user and "gemini" in comment.user.login.lower():
                gemini_comments.append({
                    "file": comment.path,
                    "line": comment.line,
                    "body": comment.body,
                    "severity": extract_severity(comment.body)
                })
        
        if gemini_comments:
            print(f"Found {len(gemini_comments)} Gemini comments at {total_wait}s")
            # Apply fixes, reply to comments, and resolve actionable threads (see Fix Procedure below)
            break
        else:
            print(f"No Gemini comments yet at {total_wait}s")
    
    if total_wait >= 600:  # 10 minutes
        print("No Gemini comments after 10 minutes. PR is clear to merge.")
        break
```

### Gemini Comment Resolution Procedure

When Gemini comments are found, update the PR branch, then reply to and resolve the actionable comments before merge:

```python
# Step 1: Get PR branch name
pr = repo.get_pull(target_pr_number)
source_branch = pr.head.ref  # e.g., "feature/new-threat-intel-20260408-1400"

# Step 2: Clone and check out the branch
subprocess.run(["git", "fetch", "origin", source_branch], check=True)
subprocess.run(["git", "checkout", source_branch], check=True)

# Step 3: Read Gemini comments and apply fixes
for comment in gemini_comments:
    file_path = comment["file"]
    line_num = comment["line"]
    
    # Load the file and parse (assuming JSON/HTML)
    with open(file_path) as f:
        content = f.read()
    
    # Apply fix based on common patterns (see Common Gemini Findings below)
    fixed_content = apply_gemini_fix(content, comment["body"], comment["severity"])
    
    with open(file_path, "w") as f:
        f.write(fixed_content)

# Step 4: Commit and push
subprocess.run(["git", "add"] + [c["file"] for c in gemini_comments], check=True)
subprocess.run([
    "git", "commit", "-m", 
    "fix: resolve Gemini Code Assist findings — " + 
    ", ".join([f"{c['severity']}" for c in gemini_comments if c['severity'] in ('critical', 'high')])
], check=True)

subprocess.run(["git", "push", "origin", source_branch], check=True)

# Step 5: Reply to the actionable comments and resolve them
for comment in gemini_comments:
    review_comment = pr.get_review_comment(comment["id"])
    review_comment.reply("Fixed in follow-up commit on this PR branch.")
    # Resolve the review thread via GraphQL / gh if available

# Step 6: Approve and merge (using owner token) only after actionable threads are resolved
with open(os.path.expanduser("~/Documents/Coding/Threatpedia/.env.owner")) as f:
    owner_token = f.read().strip()

owner_g = Github(auth=Auth.Token(owner_token))
owner_repo = owner_g.get_repo("MahdiHedhli/threatpedia")
owner_pr = owner_repo.get_pull(target_pr_number)
owner_pr.create_review(event="APPROVE")
owner_pr.merge()

print(f"Gemini findings resolved and PR #{target_pr_number} merged")
```

### Common Gemini Findings to Watch For

These are the most frequent Gemini findings and their standard fixes:

| Pattern | Severity | Example | Fix |
|---------|----------|---------|-----|
| JSON objects outside array brackets | Critical | `{"key": "value"}` at root, should be `[{...}]` | Wrap objects in square brackets to form valid JSON array |
| Invisible Unicode characters in keys | High | Zero-width spaces or homograph characters in JSON keys | Replace with standard ASCII equivalents (e.g., U+200B → delete, U+2013 → `-`) |
| String literal mismatches | High | status field set to "active" but manifest schema expects "Active Exploitation" | Match enum values against canonical manifest schema, update test values |
| Missing mandatory fields | High | incident.html without `TP-` ID prefix in slug | Add missing fields per TEMPLATE rules (e.g., ID format, required metadata) |
| Favicon/asset path errors | Medium | `src="/assets/logo.png"` but file at `/threatpedia/assets/logo.png` | Correct paths using standard format from REPORT-TEMPLATE-NOTES.md |
| Duplicate entries | Medium | Same incident ID in manifest appears twice | Deduplicate, keep in most appropriate location or category |
| Truncation of data fields | Medium | Incident title truncated to 50 chars, losing key details | Remove artificial truncation limits or increase to maintain data fidelity |
| SVG data URI encoding | Medium | SVG with unencoded `<` and `>` in data URI | URL-encode special characters: `<` → `%3C`, `>` → `%3E`, `"` → `%22` |
| Missing cross-reference IDs | Medium | Incident references actor but actor-index.json has no matching entry | Add ID to index or fix reference to match existing ID format |
| Orphaned HTML elements | Low | Unused `<div>` or `<span>` with no content or CSS styling | Remove unused elements or restructure for clarity |
| Inconsistent date formats | Low | Dates as "2026-04-08" and "April 8, 2026" in same file | Standardize all dates to ISO 8601 format: YYYY-MM-DD |

## Scheduled Task Template

Every new scheduled task should follow this structure in its prompt or runbook:

```
## [TASK NAME] — [Brief Description]

### Pre-Task: Gemini Review Check
1. Read task-state.json for lock status
2. Check activeLocks for blocked tasks (< 30 min old)
   - If blocked: skip run, report blocking task name and exit
   - If clear: continue
3. Set own lock: activeLocks[{task-name}].locked = true, lockedAt = now UTC
4. Read bot token from ~/Documents/Coding/Threatpedia/.envbot
5. Clear stale git locks (.git/index.lock, .git/HEAD.lock > 5 min)
6. Query GitHub API for open PRs and list all Gemini Code Assist comments
7. For critical/high issues:
   - Clone the PR branch
   - Apply fixes using the Gemini Comment Resolution Procedure
   - Commit "fix: resolve Gemini Code Assist {severity} finding"
   - Push and create new PR
   - Wait for Gemini review, repeat if needed
8. Log pre-check results and continue to main task

### Main Task
[Task-specific instructions here — include:
 - Which manifest files to read first
 - What data sources to query
 - How to validate generated content
 - Output file names and locations
 - Specific deduplication rules for this task]

### Validation
[Before committing, validate:
 - JSON: parse and dump-back (no exceptions)
 - HTML: opening tag count == closing tag count
 - Manifest updates: all new entries have required fields
 - Cross-references: all IDs in links exist in target indices]

### Git Safety Protocol
1. git fetch origin main
2. git checkout -b feature/{task-slug}-{timestamp} origin/main
3. Make all changes (should be complete before this step)
4. git add [specific-files-only] — NEVER git add -A
5. git status to verify only intended files are staged
6. git commit -m "type: description (task-name)" (with Co-Authored-By line)
7. git pull --rebase origin main (accept remote on conflict, re-apply local)
8. git push origin feature/{task-slug}-{timestamp}
   - If fails: clear locks, pull --rebase, retry once, then abort and report
9. Sanitize remote URLs in logs immediately

### PR Creation
1. Create PR via GitHub API with descriptive title and body
2. Capture PR number and log URL
3. Proceed to Post-PR Gemini Check

### Post-PR: Gemini Review Check
1. Wait 2 minutes
2. Query GitHub API for Gemini comments on the open PR
3. If found: apply fixes using Comment Resolution Procedure on the PR branch
4. Reply to actionable comments and resolve actionable threads
5. Wait 3 more minutes (5 min total), check again — fix if needed
6. Wait 5 more minutes (10 min total), final check — fix if needed
7. Merge only after the actionable review state is clean

### Finalization
1. Release lock: activeLocks[{task-name}].locked = false
2. Update activeLocks[{task-name}].lastCompleted = now UTC
3. Update task-state.json on main with current status
4. Log final report: items processed, issues resolved, any deferred medium/low findings

### Coordination Notes
- Read {primary-manifest} as first step (incidents/manifest.json, zero-days/manifest.json, etc.)
- Follow noOverlap rules: {task-name} does NOT create/update/delete [specific categories]
- If modifying threat-actors.html: add actor slug to actorPages Set
- If creating zero-day: check incidents/manifest.json for related incidents, add bidirectional refs
```

## Task State Coordination

The `task-state.json` file in the repo root is the coordination hub for all scheduled tasks. All tasks must read and respect this file:

### Reading task-state.json
- **Read at task start** to understand pipeline state and avoid duplicate work
- **Check activeLocks** for any task with `locked: true` and `lockedAt` within 30 minutes
- **If blocked**: skip run, log which task is blocking, exit cleanly
- **Check schedules** for what other tasks are doing (frequency, timing, writesTo)
- **Check taskState** for stats like totalReports, glossaryTermCount, etc.

### Updating task-state.json
- **Set your lock** before writing to shared files (incidents/*, manifest.json, etc.)
  - Path: `activeLocks[{task-name}]`
  - Set: `locked: true`, `lockedAt: {current UTC timestamp}`
- **Release your lock** when done (even on error)
  - Path: `activeLocks[{task-name}]`
  - Set: `locked: false`, `lastCompleted: {current UTC timestamp}`
- **Update taskState** with current metrics
  - Example: `taskState.incidentReports.totalReports = {new count}`
  - Update `lastRunDate` with today's date
- **Commit task-state.json** in the same PR as your main changes
  - Use specific staging: `git add task-state.json incidents/manifest.json incident-*.html`

### Stale Lock Timeout
- Any lock with `lockedAt` older than 30 minutes is assumed to be from a crashed task
- Treating it as stale is safe — you can acquire your own lock and proceed
- If you encounter a 30+ minute old lock, log it for investigation but don't let it block your work

### Git Lock Files
- **Before any git operation**, check for `.git/index.lock` and `.git/HEAD.lock`
- These are left by crashed git processes, not by task-state.json locks
- If file age > 5 minutes: `mv .git/index.lock .git/index.lock.bak && rm .git/index.lock.bak`
- This clears stale locks from interrupted operations without data loss

## File Ownership Matrix

The following table defines which tasks primarily write to each file and which tasks read from it. Tasks should avoid unnecessary writes to files they don't own, and should read from canonical sources before making updates:

| Directory/File | Primary Writer(s) | Readers | Notes |
|---|---|---|---|
| `incidents/manifest.json` | new-threat-intel, daily-incident-updater, incident-crosslink-gapfill, zero-day-tracker | All incident-related tasks | Canonical index; all incident tasks read first |
| `incidents/*.html` | new-threat-intel, daily-incident-updater, incident-crosslink-gapfill | None (static pages) | Generated from manifest; do not hand-edit |
| `incidents/index.html` | (Auto-generated) | (None) | Loads manifest.json dynamically; never modify directly |
| `zero-days/manifest.json` | zero-day-tracker, zero-day-enricher | All zero-day-related tasks | Canonical index; read first, update last |
| `zero-days/*.html` | zero-day-tracker, zero-day-enricher | None (static pages) | Generated from manifest; do not hand-edit |
| `zero-days/index.html` | (Auto-generated) | (None) | Loads manifest.json dynamically; never modify directly |
| `threat-actors.html` | threat-actor-updater, (manual edits) | All incident-related tasks | Registry hub; threat-actor-updater adds actor slug to actorPages Set when creating new actor pages |
| `threat-actor-index.json` | threat-actor-updater | All incident-related tasks | Lightweight lookup index; read to check if actor exists before queueing |
| `threat-actor-queue.json` | new-threat-intel, daily-incident-updater, incident-crosslink-gapfill | threat-actor-updater | Work queue; incident tasks append 'create' or 'update-links' items |
| `glossary.html` | glossary-term-updater | (None) | Glossary page; updated by weekly term-updater task |
| `glossary-index.json` | glossary-term-updater | daily-incident-updater, all tasks needing tooltip data | Lightweight index for client-side tooltips; updated by term-updater |
| `glossary-candidates.json` | daily-incident-updater | glossary-term-updater | Queue of terms found in reports but missing from glossary |
| `task-state.json` | All tasks (with locking) | All tasks | Central coordination file; read at start for locks, update at end |
| `connectors/*.md` | source-deep-dive | build-scrapers | Source specifications; spec must exist before scraper implementation |
| `connectors/PROGRESS.md` | source-deep-dive, build-scrapers | Both | Tracks which specs are done, which are ready to build |
| `scrapers/*.py` | build-scrapers | (Manual review) | Python scrapers; generated from completed connector specs |
| `research/new-sources-*.md` | expand-sources | None (documentation) | Research logs for new source discovery |
| `research/MASTER-LOG.md` | expand-sources | expand-sources | Master index of all catalogued sources |
| `data/data-sources-manifest.json` | (External ingestion) | data-ingestion | Tracks staged external datasets; updated by ingestion task |

## Incident Reporting Architecture Note

**Important**: As of 2026-04-08, the incidents index page (`incidents/index.html`) loads dynamically from `incidents/manifest.json` via fetch(). Statistics (total count, critical severity count, supply-chain breach count, ransomware count) are computed client-side JavaScript.

**What this means for tasks**:
- You ONLY need to update `incidents/manifest.json` and individual `incidents/*.html` files
- The index page **automatically reflects changes** — no manual index editing required
- Do NOT embed hardcoded incident arrays or statistics in `incidents/index.html`
- Stats are always live and accurate because they're computed from the current manifest

**Similarly for zero-days**: The `zero-days/index.html` and `zero-days.html` hub pages load from `zero-days/manifest.json` dynamically. Update the manifest, and the pages auto-update.

## Coordination Rules Summary

All tasks must adhere to these rules to prevent conflicts and data corruption:

### Manifest-First Rule
- All incident-related tasks MUST read `incidents/manifest.json` as their first step
- All zero-day-related tasks MUST read `zero-days/manifest.json` as their first step
- This ensures deduplication and awareness of recent changes by other tasks

### Manifest Update Rule
- Update manifest files AFTER creating or modifying reports
- The index pages auto-load from manifest.json — no need to modify index.html directly
- Commit manifest.json in the same PR as your report files for consistency

### Actor Page Linking Rule
- When threat-actor-updater creates a new `threat-actors/*.html` page, it MUST also add the actor slug to the `actorPages` Set in `threat-actors.html`
- This ensures the registry page links to all actor profile pages

### Zero-Day Incident Cross-Linking Rule
- When zero-day-tracker or zero-day-enricher creates a zero-day entry, check `incidents/manifest.json` for related incidents
- Add bidirectional references:
  - In zero-day entry: `relatedIncidents: [incident-id-1, incident-id-2, ...]`
  - In incident entry: `relatedZeroDays: [TP-EXP-NNNN, ...]`
- This creates the web of connections for readers to explore relationships

### No Overlap Rule
- **new-threat-intel**: Only creates reports for brand-new incidents from news. Does NOT update existing reports or create gap-fill reports.
- **daily-incident-updater**: Only updates EXISTING reports (90-day window). Does NOT create new reports. Handles enrichment, link repair, image generation.
- **incident-crosslink-gapfill**: Only creates reports for items in manifest's `referencedButMissing[]`. Does NOT discover new incidents from external sources.

This ensures each task has a clear, non-overlapping scope and prevents duplicate effort.

### Git Conflict Prevention Rule
- ALL tasks use the standardized Git Safety Protocol defined in this document
- Protocol includes: stale lock clearing, fetch/rebase before work, specific-file staging, and push with retry
- Never use `git add -A` or `git add .` — always explicitly list the files you intend to commit
- On conflicts: accept remote version, then re-apply your local changes on top

### Task Locking Protocol
Before writing to shared files (incidents/*, manifest.json, zero-days/*, etc.):

1. Read `task-state.json`
2. Check `activeLocks` for any task with `locked: true` and `lockedAt < 30 minutes ago`
3. If blocked: skip this run, log the blocking task, exit cleanly
4. If clear: set your own lock with `locked: true` and current UTC timestamp
5. Proceed with work
6. **ALWAYS release your lock** when done (even on error): set `locked: false`

## Changelog

- **2026-04-08**: Initial version. Comprehensive documentation of bot automation processes, Gemini Code Assist review protocol, standard PR workflow, task state coordination, and file ownership matrix. Version 1.0 aligned with 11 active scheduled tasks and Threatpedia architecture as of April 2026.
