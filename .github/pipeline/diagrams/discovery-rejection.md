# Discovery + Rejection Memory Lane

How candidates move from the CISA KEV feed to a `pipeline/discovery`
PR — and how operator veto stays durable across runs. Covers Slices
2 / 4c hardening.

Companion diagrams:

- [`architecture.md`](./architecture.md) — system-level overview
- [`pipeline-flow.md`](./pipeline-flow.md) — full task lifecycle
- [`dispatcher-guardrails.md`](./dispatcher-guardrails.md) — dispatcher state machine

```mermaid
%%{init: {'theme':'base','themeVariables':{
  'background':'#080b10',
  'primaryColor':'#0d1117','primaryTextColor':'#cdd5e0','primaryBorderColor':'#1e2733',
  'lineColor':'#e8a020','secondaryColor':'#0d1117','tertiaryColor':'#0d1117',
  'fontFamily':'IBM Plex Mono, ui-monospace, monospace'
}}}%%
flowchart TB
  CRON(["pipeline-discovery.yml<br/>(6h cron)"])

  subgraph FETCH["fetch"]
    KEV["CISA KEV catalog<br/>(JSON)"]
    NVD["NVD CVE feed<br/>(CVSS enrichment)"]
  end

  subgraph DEDUP["dedup index"]
    direction LR
    CORP["corpus CVE index<br/>(site/src/content)"]
    TQ["task CVE index<br/>(.github/pipeline/tasks)"]
    RJ["rejected-candidates.json<br/>operator veto memory"]
  end

  SCORE{"score ≥ auto-cert threshold?<br/>R1 sources · KEV · CVSS ≥ 7<br/>cross-source · active exploitation"}
  SKIP[/"skip · ::notice::"/]
  WRITE["write TASK-YYYY-NNNN.json<br/>canonical shape<br/>to pipeline/discovery branch"]
  BRANCH{"pipeline/discovery<br/>branch state?"}
  CREATE["create from main"]
  ACCUM["accumulate onto existing branch<br/>(merge main to stay compatible)"]
  RESET["force-reset to main<br/>(durable rejection)"]
  PR["open / update PR<br/>labeled pipeline/discovery"]

  subgraph OUTCOMES["operator decision"]
    direction LR
    MERGE(["Kernel K merges<br/>→ tasks land on main"])
    CLOSE(["Kernel K closes<br/>without merging"])
  end

  REJFLOW["pipeline-reject.yml<br/>(workflow_dispatch)"]
  REJHELP["pipeline-reject.mjs<br/>append entry<br/>CVE + reason + PR ref"]
  REJPR["open reject PR<br/>(durable retry: clean up<br/>stale remote branch first)"]

  CRON --> KEV
  CRON --> NVD
  KEV --> DEDUP
  NVD --> DEDUP
  DEDUP --> SCORE
  SCORE -->|no · known or rejected| SKIP
  SCORE -->|yes · new and not rejected| WRITE
  WRITE --> BRANCH
  BRANCH -->|none| CREATE
  BRANCH -->|exists + open PR| ACCUM
  BRANCH -->|exists + no open PR| RESET
  CREATE --> PR
  ACCUM --> PR
  RESET --> PR
  PR --> OUTCOMES

  MERGE -.->|next cron: already-in-corpus dedup| DEDUP
  CLOSE -.->|next cron: branch reset + rejection optional| DEDUP

  CLOSE -. "operator veto path" .-> REJFLOW
  REJFLOW --> REJHELP --> REJPR
  REJPR -. "Kernel K merges" .-> RJ
  RJ -. "honored at next discovery" .-> DEDUP

  classDef data fill:#0d1117,stroke:#e8a020,color:#cdd5e0;
  classDef skip fill:#0d1117,stroke:#5a6a7e,color:#5a6a7e;
  classDef accent fill:#0d1117,stroke:#e8a020,color:#f0b030;
  classDef reject fill:#0d1117,stroke:#ff4444,color:#ffa500;
  class CORP,TQ,RJ data;
  class SKIP skip;
  class MERGE accent;
  class CLOSE,REJFLOW,REJHELP,REJPR reject;
```

## Reading this diagram

- **Three dedup sources, one filter.** Discovery dedups against the
  live corpus, pending tasks, AND the rejection-memory file. The
  rejection set was added in Slice 4c — CVEs operator-vetoed there
  get skipped at the filter stage with a `::notice::` for audit
  visibility. Missing / malformed rejection file → warning +
  empty set (never hard-fails).

- **Long-lived branch with three states.** `pipeline/discovery` is
  the accumulation lane (Issue #61). If no prior branch exists,
  create from `main`. If there's an open PR, accumulate onto it. If
  the branch exists but has no open PR (prior batch merged or
  closed-without-merge), force-reset to `main` — this makes
  rejection durable even without explicit rejection-memory entries.

- **Rejection is PR-gated.** The only way into `rejected-candidates.json`
  is the `pipeline-reject.yml` workflow → `pipeline-reject.mjs` helper
  → PR against `main`. No direct push. Stale-branch handling was
  hardened in the Slice 4c follow-up patch so retrying for the same
  CVE never wedges on a non-fast-forward push.

- **Re-eligibility is manual.** To restore discovery eligibility for
  a rejected CVE, remove the entry from `rejected-candidates.json`
  via a PR edit. No automatic timeout — operator veto stays sticky.
