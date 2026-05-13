---
eventId: TP-2026-0054
title: "Mistral AI Python SDK PyPI Package v2.4.6 Backdoor"
date: 2026-05-12
attackType: "Software supply-chain compromise / malicious PyPI package publication"
severity: critical
sector: "Open-source software / AI developer tooling"
geography: Global
threatActor: Unknown
attributionConfidence: A4
reviewStatus: draft_ai
confidenceGrade: C
generatedBy: dangermouse-bot
generatedDate: 2026-05-13
cves: []
relatedSlugs: []
tags:
  - supply-chain
  - pypi
  - python
  - mistral-ai
  - malicious-package
  - developer-tools
sources:
  - publisher: "Mistral AI"
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-05-12"
    url: https://docs.mistral.ai/resources/security-advisories
  - publisher: "GitHub / Mistral AI"
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-05-12"
    url: https://github.com/mistralai/client-python/security/advisories/GHSA-wx9m-wx4f-4cmg
  - publisher: "NHS England Digital"
    publisherType: government
    reliability: R1
    publicationDate: "2026-05-12"
    url: https://digital.nhs.uk/cyber-alerts/2026/cc-4781
  - publisher: "GitHub / Mistral AI"
    publisherType: vendor
    reliability: R2
    publicationDate: "2026-05-12"
    url: https://github.com/mistralai/client-python/issues/523
  - publisher: SecurityWeek
    publisherType: media
    reliability: R2
    publicationDate: "2026-05-12"
    url: https://www.securityweek.com/tanstack-mistral-ai-uipath-hit-in-fresh-supply-chain-attack/
  - publisher: "OX Security"
    publisherType: research
    reliability: R2
    publicationDate: "2026-05-12"
    url: https://www.ox.security/blog/shai-hulud-here-we-go-again-170-packages-hit-across-npm-pypi/
mitreMappings:
  - techniqueId: T1195.001
    techniqueName: "Compromise Software Dependencies and Development Tools"
    tactic: "Initial Access"
    attack-version: "v19"
    confidence: confirmed
    evidence: "Mistral AI and its GitHub security advisory identify mistralai 2.4.6 as a compromised PyPI package in a supply-chain attack."
  - techniqueId: T1059.006
    techniqueName: "Python"
    tactic: Execution
    attack-version: "v19"
    confidence: confirmed
    evidence: "Mistral AI and the GitHub advisory say malicious Python code in src/mistralai/client/__init__.py ran at import time on Linux systems."
  - techniqueId: T1105
    techniqueName: "Ingress Tool Transfer"
    tactic: "Command and Control"
    attack-version: "v19"
    confidence: confirmed
    evidence: "Mistral AI says the malicious code downloaded transformers.pyz from 83.142.209.194 to /tmp/transformers.pyz before execution."
---

## Summary

On May 12, 2026, Mistral AI published security advisory MAI-2026-002 disclosing that version 2.4.6 of the `mistralai` Python SDK on PyPI had been compromised during a software supply-chain attack. Mistral said the affected PyPI release was uploaded at approximately 00:05 UTC on May 12, 2026, and that the PyPI project was quarantined. A GitHub security advisory for the `mistralai` Python client states that no `v2.4.6` tag, commit, or release workflow run exists in the repository and that the upload bypassed the normal PyPI Trusted Publishing release pipeline.

Mistral linked the package compromise to a TanStack-related supply-chain incident and said an automated worm associated with the attack led to compromised npm and PyPI package versions. NHS England Digital and third-party security reporting described the broader activity as affecting TanStack, Mistral AI, UiPath, OpenSearch, and other packages across npm and PyPI. The public Mistral and GitHub advisories do not identify a confirmed actor for the `mistralai==2.4.6` PyPI release.

## Technical Analysis

The Mistral advisory says the malicious PyPI package ran a script at import time on Linux systems and spawned a background process to harvest credentials from common locations. The related GitHub security advisory describes a function named `_run_background_task` added to `src/mistralai/client/__init__.py` and called at module-load time. According to that advisory, the function:

1. Returned immediately on non-Linux systems or when the `MISTRAL_INIT` environment variable was already set.
2. Set `MISTRAL_INIT=1` before launching the child process.
3. Downloaded `https://83.142.209.194/transformers.pyz` to `/tmp/transformers.pyz` if the file was not already present.
4. Spawned the downloaded file with the current Python interpreter as a detached process.

The GitHub advisory narrows one important execution condition: a bare `import mistralai` alone did not trigger the loader because the package is laid out as a PEP 420 namespace package, while documented SDK usage through `mistralai.client.*` would trigger the path. The advisory also states that `pip install`, `pip download`, and `pip wheel` do not invoke the dropper by themselves.

NHS England Digital reports that the broader supply-chain activity involved malicious package uploads in two phases, April 29, 2026 and May 11, 2026, and that affected packages executed during installation or import to collect development secrets. OX Security also lists `mistralai@2.4.6` as an affected PyPI package and describes a Python infection path that downloads and executes `transformers.pyz`.

## Attack Chain

1. **Staging** -- Mistral AI said current investigation indicated that an affected developer device was involved and that it had no indication Mistral infrastructure was compromised.
2. **Publication** -- Malicious release `mistralai==2.4.6` was uploaded to PyPI at approximately 00:05 UTC on May 12, 2026.
3. **Distribution** -- The compromised package was available through PyPI until the project was quarantined.
4. **Execution** -- On Linux hosts, SDK usage that imported through `mistralai.client.*` triggered malicious code in `__init__.py`.
5. **Payload delivery** -- The code fetched `transformers.pyz` from `83.142.209.194` and launched it as a detached Python process.
6. **Potential credential exposure** -- Mistral advised affected users to clean impacted systems and rotate secrets accessible from those systems.

## Timeline

- **2026-04-29** -- NHS England Digital reports the first phase of Mini Shai-Hulud package activity.
- **2026-05-11** -- NHS England Digital reports a second phase of package activity.
- **2026-05-12 00:05 UTC** -- Mistral AI says the compromised `mistralai==2.4.6` package was uploaded to PyPI.
- **2026-05-12** -- Mistral AI published MAI-2026-002, and the associated GitHub security advisory documented the malicious dropper behavior.

## Impact Assessment

Linux environments that imported code through `mistralai.client.*` from `mistralai==2.4.6` during the exposure window should be treated as potentially compromised. The GitHub advisory recommends rotating every credential reachable from the importing process and reviewing host and cloud audit logs from approximately 2026-05-12 00:05 UTC onward.

Mistral AI states that current investigation indicated an affected developer device was involved and that there was no indication Mistral infrastructure was compromised. The advisory was described as under active investigation at time of publication.

The broader npm and PyPI activity increased the operational risk for developer environments because affected packages were distributed through trusted package-management paths. For this specific PyPI event, the public advisories support treating affected Linux hosts as potentially compromised, but they do not provide a confirmed victim count or confirmed actor identity.

## Attribution

The attacker is unknown. Mistral AI's advisory does not attribute the PyPI compromise to a named group or state actor. Some third-party reporting associates the broader supply-chain activity with Mini Shai-Hulud or TeamPCP, but the primary Mistral and GitHub advisories do not confirm a responsible actor for `mistralai==2.4.6`.

## Remediation & Mitigation

Mistral AI and the GitHub security advisory recommend treating affected Linux systems conservatively. Operators should:

- Identify lockfiles, build artifacts, package caches, container images, and deployed environments that contain `mistralai==2.4.6`.
- Treat Linux environments that imported the affected package as potentially compromised pending forensic review.
- Rotate credentials reachable from the importing process and review host and cloud audit logs.
- Check for `/tmp/transformers.pyz`, `MISTRAL_INIT=1`, or a detached Python process running `/tmp/transformers.pyz`.
- Block or monitor outbound connections to `83.142.209.194`.
- Pin `mistralai` to `2.4.5` or earlier until a verified clean release path is available.

## Sources & References

- [Mistral AI: MAI-2026-002 security advisory](https://docs.mistral.ai/resources/security-advisories) — Mistral AI, 2026-05-12
- [GitHub / Mistral AI: Malicious dropper in mistralai 2.4.6 PyPI package](https://github.com/mistralai/client-python/security/advisories/GHSA-wx9m-wx4f-4cmg) — GitHub / Mistral AI, 2026-05-12
- [NHS England Digital: Cyber Alert CC-4781](https://digital.nhs.uk/cyber-alerts/2026/cc-4781) — NHS England Digital, 2026-05-12
- [GitHub / Mistral AI: client-python issue #523](https://github.com/mistralai/client-python/issues/523) — GitHub / Mistral AI, 2026-05-12
- [SecurityWeek: TanStack, Mistral AI, UiPath hit in fresh supply chain attack](https://www.securityweek.com/tanstack-mistral-ai-uipath-hit-in-fresh-supply-chain-attack/) — SecurityWeek, 2026-05-12
- [OX Security: Shai-Hulud -- here we go again, 170 packages hit across npm and PyPI](https://www.ox.security/blog/shai-hulud-here-we-go-again-170-packages-hit-across-npm-pypi/) — OX Security, 2026-05-12
