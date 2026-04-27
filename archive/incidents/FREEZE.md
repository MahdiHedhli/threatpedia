# INCIDENTS DIRECTORY — FROZEN

**Status:** FROZEN
**Frozen Since:** 2026-04-09
**Reason:** Pre-normalization sweep against DATA-STANDARDS.md v1.0
**Authority:** Project lead (Mahdi Hedhli) and DangerMouse-Bot
**Snapshot Tag:** [pre-normalization-snapshot](https://github.com/MahdiHedhli/threatpedia/releases/tag/pre-normalization-snapshot)

---

## Do Not

- Add new incident HTML files to this directory until the freeze is lifted
- Modify existing incident HTML files except via the normalization workflow
- Update `manifest.json` except via the normalization workflow
- Run ingestion agents that target this directory

## Why

The corpus is being swept for drift against DATA-STANDARDS.md v1.0. New articles produced under the old schema would create more cleanup work and risk corrupting the normalization pass.

## Agents — Required Behavior

All ingestion, gapfill, and crosslink agents MUST check for the existence of `FREEZE.md` in this directory at the start of every run. If this file exists, the agent MUST abort and emit a "directory frozen" log message. No exceptions.

```python
# Agent pre-flight check (Python example)
from pathlib import Path
if Path("incidents/FREEZE.md").exists():
    print("[ABORT] incidents/ is frozen — see FREEZE.md")
    sys.exit(0)
```

```javascript
// Agent pre-flight check (Node example)
const fs = require('fs');
if (fs.existsSync('incidents/FREEZE.md')) {
  console.log('[ABORT] incidents/ is frozen — see FREEZE.md');
  process.exit(0);
}
```

## How to Lift the Freeze

1. Confirm normalization sweep is complete and all articles validate against DATA-STANDARDS.md v1.0
2. Confirm canonical Astro template is in place
3. Tag a `post-normalization-snapshot` release
4. Delete this file
5. Re-enable any paused GitHub Actions and Antigravity tasks

---

*This file is the human-readable freeze marker. Its presence is the binding signal.*
