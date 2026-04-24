---
eventId: "TP-2026-0015"
title: "Axios npm Package Compromise by UNC1069"
date: 2026-03-31
attackType: "Supply Chain"
severity: critical
sector: "Technology"
geography: "Global"
threatActor: "UNC1069 / Sapphire Sleet"
attributionConfidence: A4
reviewStatus: draft_ai
confidenceGrade: B
generatedBy: kernel-k
generatedDate: 2026-04-24
cves: []
relatedSlugs: []
tags:
  - "axios"
  - "npm"
  - "supply-chain"
  - "open-source"
  - "developer-tools"
  - "north-korea"
  - "rat"
sources:
  - url: "https://www.microsoft.com/en-us/security/blog/2026/04/01/mitigating-the-axios-npm-supply-chain-compromise/"
    publisher: "Microsoft Security Blog"
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-04-01"
    accessDate: "2026-04-24"
    archived: false
  - url: "https://snyk.io/blog/axios-npm-package-compromised-supply-chain-attack-delivers-cross-platform/"
    publisher: "Snyk"
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-04-01"
    accessDate: "2026-04-24"
    archived: false
  - url: "https://www.wiz.io/blog/axios-npm-compromised-in-supply-chain-attack"
    publisher: "Wiz"
    publisherType: vendor
    reliability: R2
    publicationDate: "2026-03-31"
    accessDate: "2026-04-24"
    archived: false
  - url: "https://securitylabs.datadoghq.com/articles/axios-npm-supply-chain-compromise/"
    publisher: "Datadog Security Labs"
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-04-01"
    accessDate: "2026-04-24"
    archived: false
  - url: "https://github.com/axios/axios/issues/10636"
    publisher: "Axios"
    publisherType: community
    reliability: R1
    publicationDate: "2026-03-31"
    accessDate: "2026-04-24"
    archived: false
  - url: "https://www.cisa.gov/resources-tools/resources/defending-against-software-supply-chain-attacks"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2021-04-26"
    accessDate: "2026-04-24"
    archived: false
mitreMappings:
  - techniqueId: "T1195.002"
    techniqueName: "Supply Chain Compromise: Compromise Software Supply Chain"
    tactic: "Initial Access"
    notes: "The malicious axios releases added a trojanized npm dependency that executed during installation."
  - techniqueId: "T1059.007"
    techniqueName: "Command and Scripting Interpreter: JavaScript"
    tactic: "Execution"
    notes: "plain-crypto-js executed a Node.js postinstall script named setup.js."
  - techniqueId: "T1105"
    techniqueName: "Ingress Tool Transfer"
    tactic: "Command and Control"
    notes: "The install-time loader fetched a platform-specific second-stage payload from actor infrastructure."
  - techniqueId: "T1071.001"
    techniqueName: "Application Layer Protocol: Web Protocols"
    tactic: "Command and Control"
    notes: "The second-stage flow used HTTP traffic to sfrclak.com on port 8000."
---

## Summary

On March 31, 2026, two malicious axios npm releases, `1.14.1` and `0.30.4`, were published through a compromised maintainer account. The releases added `plain-crypto-js@4.2.1`, a malicious dependency that ran during package installation and retrieved a second-stage remote access trojan for macOS, Windows, or Linux systems.

The exposure window was short, about three hours, but axios is widely used across application and CI/CD dependency trees. Any fresh install, update, or transitive dependency resolution that selected the affected versions during the window could have executed the postinstall script before application code ever loaded axios.

Microsoft attributed the infrastructure and compromise to Sapphire Sleet, a North Korea-nexus actor name. Public reporting also mapped the activity to UNC1069; this article keeps both names visible because the local task topic uses UNC1069 while the strongest direct source in this reconstruction uses Microsoft's Sapphire Sleet label.

## Technical Analysis

The attacker did not need to alter normal axios runtime logic. The malicious releases changed the npm package manifest so that installing axios pulled `plain-crypto-js@4.2.1`. That dependency contained a `postinstall` hook that launched `node setup.js`, giving the attacker code execution on developer workstations, build systems, and CI jobs that installed the package.

Several reports describe `plain-crypto-js` as pre-staged before the axios releases. A clean-looking `4.2.0` version appeared first, followed by the malicious `4.2.1` release. The axios releases then referenced the malicious dependency, which reduced the visible change inside axios itself to a manifest-level addition.

Microsoft and Snyk both describe the loader as obfuscated and self-removing. After execution, the package attempted to remove the postinstall artifacts and leave behind cleaner package metadata, making later inspection of `node_modules/plain-crypto-js` less useful than install-time telemetry, lockfile evidence, and network records.

The observed command-and-control endpoint was `sfrclak[.]com` on port `8000`, resolving to `142.11.206[.]73`. Microsoft described a single HTTP endpoint that served platform-specific responses, while Datadog and Snyk documented host artifacts and hunting logic for macOS, Windows, and Linux payload paths.

## Attack Chain

### Stage 1: Maintainer Account Compromise

The Axios postmortem states that malicious versions were published through a compromised maintainer account. The maintainer also reported follow-up actions including device resets, credential resets, session revocation, and publishing-flow changes.

### Stage 2: Dependency Staging

The attacker staged `plain-crypto-js` before the axios releases. The malicious `4.2.1` package included a postinstall path that was not part of legitimate axios application behavior.

### Stage 3: Malicious Axios Releases

`axios@1.14.1` was published at 00:21 UTC and `axios@0.30.4` around 01:00 UTC on March 31, 2026. Both releases referenced the malicious dependency and were later removed from npm.

### Stage 4: Install-Time Execution

When a developer endpoint or CI runner installed an affected axios version, npm resolved `plain-crypto-js@4.2.1` and ran the dependency's lifecycle script. The script contacted the actor endpoint and selected a second-stage path based on host operating system.

### Stage 5: Payload Retrieval and Follow-On Risk

The retrieved payload gave the actor a foothold on machines or build runners that executed the install. Because CI runners and developer systems can hold registry tokens, cloud credentials, deployment secrets, and source access, responders were advised to treat exposed systems as potentially compromised and rotate secrets.

## Impact Assessment

The direct affected packages were `axios@1.14.1`, `axios@0.30.4`, and `plain-crypto-js@4.2.1`. Snyk reported that the malicious axios versions were removed by 03:29 UTC on March 31, while Datadog's timeline places npm cleanup and token revocation in the same early-morning UTC response window.

The main risk was not only direct application use of axios. Dependency ranges such as caret constraints, third-party libraries, and GitHub Actions could resolve axios transitively during a fresh install. Datadog highlighted this CI/CD exposure pattern and provided examples for reviewing dependency paths and workflow runs during the compromise window.

Potential impact included remote access on developer endpoints or CI systems, exposure of environment variables and build secrets, and follow-on access to source code or deployment infrastructure. The incident therefore required both package cleanup and credential response, not only upgrading away from the affected versions.

## Attribution

Microsoft Threat Intelligence attributed the infrastructure and axios compromise to Sapphire Sleet. Public reports citing Google Threat Intelligence Group associated the same incident with UNC1069, a North Korea-nexus activity cluster. The Axios project postmortem confirms maintainer-account compromise and package impact but does not independently attribute the actor.

Attribution confidence is set to A4 because the actor name relies on vendor intelligence rather than a public government attribution in the sources used here. The incident mechanics, affected versions, malicious dependency, and response timeline are higher-confidence because they are corroborated by the Axios postmortem and multiple security vendors.

## Timeline

### 2026-03-30 — Malicious Dependency Preparation

Datadog reports that the C2 domain was registered on March 30 and that `plain-crypto-js@4.2.0` appeared before the malicious release. The later `4.2.1` package contained the malicious postinstall behavior.

### 2026-03-31 00:21 UTC — axios 1.14.1 Published

The malicious `axios@1.14.1` package was published from the compromised maintainer account and referenced `plain-crypto-js@^4.2.1`.

### 2026-03-31 01:00 UTC — axios 0.30.4 Published

The malicious `axios@0.30.4` package was published from the same account, expanding exposure to the older axios release line.

### 2026-03-31 02:19-03:00 UTC — Community Reports Escalate

Datadog's timeline records multiple GitHub issues from StepSecurity reporting the compromise. Some early reports were deleted, while a later issue remained available to the community.

### 2026-03-31 03:15-03:40 UTC — Packages Removed

The Axios postmortem states that the malicious axios versions were removed around 03:15 UTC and that `plain-crypto-js` was removed at 03:29 UTC. Datadog reports npm replacement and cleanup actions in the same window.

### 2026-04-01 — Vendor Advisories Published

Microsoft, Snyk, Datadog, and other vendors published analysis and detection guidance covering affected versions, network indicators, platform artifacts, and remediation steps.

## Remediation & Mitigation

Organizations should audit lockfiles, package-manager logs, CI job logs, and software composition inventories for `axios@1.14.1`, `axios@0.30.4`, or `plain-crypto-js@4.2.1`. If any affected install ran, responders should treat the host or runner as potentially compromised, remove the malicious dependency, restore axios to a clean version, and rotate secrets exposed to that environment.

Network and endpoint hunts should cover connections to `sfrclak[.]com`, traffic to `142.11.206[.]73:8000`, and platform-specific payload paths described by Microsoft and Datadog. CI/CD review should include both first-party projects and third-party actions or tools that may install axios transitively.

Longer-term controls should reduce dependence on newly published packages during build time. Practical measures include lockfile enforcement, dependency cooldown or minimum-age policies, package provenance review, secret minimization in CI, short-lived credentials, immutable runners, and package install policies that account for lifecycle scripts.

CISA and NIST software supply chain guidance supports this response model: identify and manage critical components, monitor for unauthorized changes, protect release integrity, and integrate software supply chain risk into normal security operations rather than treating dependency updates as routine trusted events.

## Sources & References

- [Microsoft Security Blog: Mitigating the Axios npm supply chain compromise](https://www.microsoft.com/en-us/security/blog/2026/04/01/mitigating-the-axios-npm-supply-chain-compromise/) — Microsoft Security Blog, 2026-04-01
- [Snyk: Axios npm Package Compromised: Supply Chain Attack Delivers Cross-Platform RAT](https://snyk.io/blog/axios-npm-package-compromised-supply-chain-attack-delivers-cross-platform/) — Snyk, 2026-04-01
- [Wiz: Axios NPM Distribution Compromised in Supply Chain Attack](https://www.wiz.io/blog/axios-npm-compromised-in-supply-chain-attack) — Wiz, 2026-03-31
- [Datadog Security Labs: Compromised axios npm package delivers cross-platform RAT](https://securitylabs.datadoghq.com/articles/axios-npm-supply-chain-compromise/) — Datadog Security Labs, 2026-04-01
- [Axios: Post Mortem: axios npm supply chain compromise](https://github.com/axios/axios/issues/10636) — Axios, 2026-03-31
- [CISA: Defending Against Software Supply Chain Attacks](https://www.cisa.gov/resources-tools/resources/defending-against-software-supply-chain-attacks) — CISA, 2021-04-26
