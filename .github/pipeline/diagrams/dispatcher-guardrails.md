# Dispatcher Guardrails

The dispatcher's per-run decision flow: config load, then four gates
before any task is dispatched. Slices 4a (config authority) and 4e
(js-yaml swap) live here.

Companion diagrams:

- [`architecture.md`](./architecture.md) — system-level overview
- [`pipeline-flow.md`](./pipeline-flow.md) — full task lifecycle
- [`discovery-rejection.md`](./discovery-rejection.md) — discovery + rejection lane

```mermaid
%%{init: {'theme':'base','themeVariables':{
  'background':'#080b10',
  'primaryColor':'#0d1117','primaryTextColor':'#cdd5e0','primaryBorderColor':'#1e2733',
  'lineColor':'#e8a020','secondaryColor':'#0d1117','tertiaryColor':'#0d1117',
  'fontFamily':'IBM Plex Mono, ui-monospace, monospace'
}}}%%
flowchart TB
  CRON(["pipeline-dispatcher.yml<br/>(2h cron)"])

  subgraph LOAD["config load"]
    direction TB
    INSTALL["npm ci --no-audit --no-fund<br/>(scripts/ tree)"]
    READ["pipeline-config.mjs<br/>(js-yaml · YAML 1.2)"]
    CFG{"parse ok?"}
    DEFAULTS[/"DEFAULTS fallback<br/>_reason: file-not-found<br/>| read-error<br/>| parse-error<br/>| shape-error"/]
    RESOLVED["resolved config<br/>_source: file<br/>_path: config.yml"]
  end

  subgraph GATES["dispatch gates"]
    direction TB

    subgraph CB["circuit breaker"]
      CBQ{"3 failures<br/>in 120 min?"}
      CBI["open pipeline/alert Issue<br/>(Issue-as-state)"]
      CBW["halt · 60 min cooldown<br/>wait for Issue close"]
    end

    subgraph BP["backpressure (hysteresis)"]
      BPQ{"drafts pending<br/>≥ max_pending (50)?"}
      BPI["open pipeline/backpressure Issue"]
      BPW["pause · wait until<br/>queue < backpressure_resume (40)"]
      BPC["auto-close Issue on resume"]
    end

    subgraph SLK["stale locks"]
      SLQ{"any lock<br/>> stale_lock_minutes (30)?"}
      SLR["release → status: pending"]
    end

    subgraph DEP["dependencies"]
      DEPQ{"depends_on<br/>all complete?"}
      DEPW["defer to next run"]
    end
  end

  DISPATCH["select top pending (P0..P3)<br/>dispatch up to 3 per run"]
  PRIV["pipeline/ready Issue<br/>+ labels"]

  CRON --> INSTALL --> READ --> CFG
  CFG -->|no| DEFAULTS
  CFG -->|yes| RESOLVED
  DEFAULTS --> CBQ
  RESOLVED --> CBQ

  CBQ -->|yes| CBI --> CBW
  CBQ -->|no| BPQ
  BPQ -->|yes| BPI --> BPW
  BPQ -->|no| SLQ
  BPW -.->|queue drains| BPC -.-> SLQ
  SLQ -->|yes| SLR --> DEPQ
  SLQ -->|no| DEPQ
  DEPQ -->|no| DEPW
  DEPQ -->|yes| DISPATCH --> PRIV

  classDef fallback fill:#0d1117,stroke:#a06a10,color:#e8a020;
  classDef halt fill:#0d1117,stroke:#ff4444,color:#ff4444;
  classDef wait fill:#0d1117,stroke:#a06a10,color:#e8a020;
  classDef accent fill:#0d1117,stroke:#e8a020,color:#f0b030;
  class DEFAULTS fallback;
  class CBW,CBI halt;
  class BPI,BPW,BPC,SLR,DEPW wait;
  class DISPATCH,PRIV accent;
```

## Reading this diagram

- **Config load never fails closed.** Four safe-default reasons
  cover every failure mode (file missing, I/O error, malformed YAML,
  non-map root). The dispatcher degrades to `DEFAULTS` and logs
  `_reason` — it never halts on a config issue. `_source` / `_path`
  surface in the step log so operators can see whether the run was
  on file-backed config or defaults.

- **Gates are serial, single-purpose, and Issue-backed.** Circuit
  breaker and backpressure both use the Issue-as-state pattern —
  no separate persistence, no new branches, no hidden JSON. Open
  Issues are the visible state; closing them resumes.
  **Distinction:** circuit breaker requires operator acknowledgement
  (Issue close). Backpressure auto-closes on the first run where the
  queue falls below `backpressure_resume`.

- **Stale-lock sweep runs every dispatch.** A task locked longer
  than `stale_lock_minutes` gets auto-released to `status: pending`
  so a stuck agent can't block the queue indefinitely. 30-minute
  default is tuned for the typical agent run time.

- **Dependency ordering is per-task.** `depends_on` lists block
  dispatch until the parent task's status reads `complete`.
  Unblocked work still flows around a blocked task — the
  dispatcher doesn't serialize the whole queue on one dependency.

- **Per-run ceiling is intentional.** Up to 3 tasks dispatched per
  run, hardcoded. Tunable to a config knob in a later slice if the
  pattern changes; today it's a deliberate cap, not a knob.
