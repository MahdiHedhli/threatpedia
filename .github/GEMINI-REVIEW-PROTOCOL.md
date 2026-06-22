# Automated Review Triage Protocol

Automated bot reviews are advisory and severity-gated. They help surface bugs,
security issues, data or evidence integrity problems, and semantic consistency
gaps, but they do not block merge on their own.

Blocking authority remains with the independent non-author lanes
(`ernestpenfold-bot` / EP-Grok and `dangermouse-bot`) and with any confirmed
bug, security defect, data-corruption risk, evidence-grading defect, or
semantic-consistency issue regardless of which reviewer surfaced it.

## Severity Handling

| Severity | Action |
|---|---|
| CRITICAL / HIGH | Fix in the current cycle. Treat bugs, security defects, data corruption, evidence-grading issues, and semantic-consistency violations as blockers. |
| MEDIUM / LOW | Batch into one final hardening pass or a follow-up issue unless the finding exposes a confirmed blocker. This includes defensive hardening on internal validators, cosmetic simplifications, "consider..." suggestions, and PR restatements. |

## Disposition

- Write one disposition note per head, not one reply per comment.
- Resolve advisory threads in batches after the disposition is recorded.
- Do not retrigger `/gemini review` repeatedly. One automated pass per
  meaningful head is enough; the blocking signal comes from EP/Grok, DM, and
  confirmed current-head defects.

## Gemini Code Assist Scope

Threatpedia keeps `ernestpenfold-bot` unchanged as the independent EP/Grok
review lane. The GitHub `gemini-code-assist[bot]` app is configured only as a
near-silent, HIGH-severity third opinion until its scheduled sunset. It should
not repost PR summaries, produce comment churn, or drive repeated remediation
cycles for medium/low advisory feedback.
