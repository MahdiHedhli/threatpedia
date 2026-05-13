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
  - mini-shai-hulud
  - credential-theft
  - developer-tools
sources:
  - publisher: "Mistral AI"
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-05-12"
    url: https://docs.mistral.ai/resources/security-advisories
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
    evidence: "Mistral AI and NHS England Digital identify mistralai 2.4.6 as a compromised PyPI package in a supply-chain attack."
  - techniqueId: T1059.006
    techniqueName: "Python"
    tactic: Execution
    attack-version: "v19"
    confidence: confirmed
    evidence: "Mistral AI says malicious code in src/mistralai/client/__init__.py ran when the Python package was imported on Linux systems."
  - techniqueId: T1105
    techniqueName: "Ingress Tool Transfer"
    tactic: "Command and Control"
    attack-version: "v19"
    confidence: confirmed
    evidence: "Mistral AI says the malicious code downloaded transformers.pyz from 83.142.209.194 to /tmp/transformers.pyz before execution."
---

## Summary

On May 12, 2026, Mistral AI published security advisory MAI-2026-002 disclosing that version 2.4.6 of the `mistralai` Python SDK on PyPI had been compromised in a software supply-chain attack. The malicious release was uploaded at approximately 00:05 UTC on May 12, 2026. All prior versions of the package were unaffected. PyPI quarantined the package after the compromise was identified.

The incident is part of a broader campaign tracked by researchers as Mini Shai-Hulud, which NHS England Digital and OX Security link to more than 170 compromised packages across PyPI and npm. Additional affected projects include TanStack, UiPath, and OpenSearch. The attacker identity remains unknown.

## Technical Analysis

The malicious code was injected into `src/mistralai/client/__init__.py`. It activated at import time and ran only on Linux systems. Upon import, the code:

1. Downloaded a file named `transformers.pyz` from the IP address `83.142.209.194` to the local path `/tmp/transformers.pyz`.
2. Executed the downloaded payload as a detached background process.
3. Spawned a secondary process that harvested credentials from common storage locations.

NHS England Digital reports that the broader Mini Shai-Hulud campaign staged malicious package uploads in two phases: April 29, 2026 and May 11, 2026. Payloads executed during installation or import and attempted to collect GitHub tokens, npm tokens, CI/CD secrets, cloud provider credentials, API keys, and other development secrets from affected developer environments.

OX Security independently confirms `mistralai==2.4.6` as an affected package and describes the same Python infection mechanism: import-time code in `__init__.py` that downloads and executes `transformers.pyz`.

## Attack Chain

1. **Staging** -- Attackers gained the ability to publish to the `mistralai` PyPI namespace, likely through a compromised developer device according to Mistral AI.
2. **Publication** -- Malicious release `mistralai==2.4.6` was uploaded to PyPI at approximately 00:05 UTC on May 12, 2026.
3. **Distribution** -- Developers or automated pipelines that ran `pip install mistralai` or updated to the latest release during the exposure window received the backdoored package.
4. **Execution** -- On Linux hosts, importing the package triggered the malicious `__init__.py` code at runtime.
5. **Payload delivery** -- The code fetched `transformers.pyz` from `83.142.209.194` and launched it as a detached background process.
6. **Credential harvesting** -- A spawned subprocess collected credentials from common filesystem locations and developer tool stores.

## Timeline

- **2026-04-29** -- NHS England Digital reports the first phase of Mini Shai-Hulud package activity.
- **2026-05-11** -- NHS England Digital reports a second phase of package activity.
- **2026-05-12 00:05 UTC** -- Mistral AI says the compromised `mistralai==2.4.6` package was uploaded to PyPI.
- **2026-05-12** -- Mistral AI published MAI-2026-002 and quarantined the affected release on PyPI.

## Impact Assessment

Any developer or automated system that installed `mistralai==2.4.6` on a Linux host during the exposure window is at risk of credential theft. Secrets potentially exposed include GitHub and npm tokens, CI/CD pipeline credentials, cloud provider access keys, and API keys stored in standard locations.

Mistral AI states that current investigation indicated an affected developer device was involved and that there is no indication Mistral infrastructure was compromised. The advisory was described as under active investigation at time of publication.

The scope of the broader Mini Shai-Hulud campaign, covering more than 170 packages across npm and PyPI, indicates a systematic targeting of developer tooling ecosystems with the intent to harvest high-value secrets from software development environments.

## Attribution

The attacker is unknown. No threat actor has claimed responsibility. Mistral AI's advisory does not attribute the compromise to any named group or state actor. NHS England Digital and OX Security describe the activity under the campaign label Mini Shai-Hulud without attributing it to a specific actor.

## Remediation & Mitigation

Mistral AI quarantined `mistralai==2.4.6` on PyPI. Developers should take the following steps:

- Audit installed versions: any environment with `mistralai==2.4.6` should be treated as compromised.
- Rotate all credentials and secrets accessible from affected Linux hosts, including GitHub tokens, npm tokens, cloud provider keys, CI/CD secrets, and API keys.
- Check for unexpected processes on affected systems, particularly those involving `/tmp/transformers.pyz`.
- Block or monitor outbound connections to `83.142.209.194`.
- Upgrade to a verified clean release of the `mistralai` package after confirming it is no longer quarantined and reviewing the published checksum.
- Review CI/CD pipeline logs for evidence of unexpected package installation from the exposure window.

## Sources & References

- [Mistral AI: MAI-2026-002 security advisory](https://docs.mistral.ai/resources/security-advisories) — Mistral AI, 2026-05-12
- [NHS England Digital: Cyber Alert CC-4781](https://digital.nhs.uk/cyber-alerts/2026/cc-4781) — NHS England Digital, 2026-05-12
- [GitHub / Mistral AI: client-python issue #523](https://github.com/mistralai/client-python/issues/523) — GitHub / Mistral AI, 2026-05-12
- [SecurityWeek: TanStack, Mistral AI, UiPath hit in fresh supply chain attack](https://www.securityweek.com/tanstack-mistral-ai-uipath-hit-in-fresh-supply-chain-attack/) — SecurityWeek, 2026-05-12
- [OX Security: Shai-Hulud -- here we go again, 170 packages hit across npm and PyPI](https://www.ox.security/blog/shai-hulud-here-we-go-again-170-packages-hit-across-npm-pypi/) — OX Security, 2026-05-12
