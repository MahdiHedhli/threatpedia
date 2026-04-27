---
eventId: TP-2026-0015
title: Axios npm Package Compromise Linked to UNC1069
date: 2026-03-31
attackType: supply-chain
severity: critical
sector: Technology / Open Source
geography: Global
threatActor: UNC1069
attributionConfidence: A4
reviewStatus: certified
confidenceGrade: C
generatedBy: dangermouse-bot
generatedDate: 2026-03-31
cves: []
relatedSlugs:
  - "teampcp-supply-chain-campaign-2026"
  - "european-commission-trivy-breach-2026"
  - "trivy-cve-2026-33634"
  - "drift-protocol-dprk-exploit-2026"
  - "fbi-dcsnet-surveillance-breach-2026"
tags:
  - "npm"
  - "north-korea"
  - "open-source"
  - "rat"
  - "supply-chain"
sources:
  - url: https://github.com/axios/axios/issues/10636
    publisher: GitHub
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-04-02"
  - url: https://www.microsoft.com/en-us/security/blog/2026/04/01/mitigating-the-axios-npm-supply-chain-compromise/
    publisher: Microsoft Security Blog
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-04-01"
  - url: https://openai.com/index/axios-developer-tool-compromise/
    publisher: OpenAI
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-04-11"
mitreMappings:
  - techniqueId: T1078
    techniqueName: "Valid Accounts"
    tactic: Initial Access
  - techniqueId: T1195.002
    techniqueName: "Supply Chain Compromise: Compromise Software Supply Chain"
    tactic: Initial Access
---

## Summary

On March 31, 2026, two malicious Axios releases, `axios@1.14.1` and `axios@0.30.4`, were published to npm through the compromised account of lead maintainer Jason Saayman. The malicious versions remained live for roughly three hours before removal and introduced a dependency on `plain-crypto-js@4.2.1`, which executed install-time logic and downloaded second-stage malware.

Microsoft later attributed the infrastructure used in the compromise to Sapphire Sleet and noted overlap with activity other vendors track as UNC1069. OpenAI also disclosed that one of its internal GitHub Actions workflows executed the compromised Axios version, underscoring the real downstream impact of the incident on developer and CI/CD environments.

## Technical Analysis

Axios source code itself was not modified in the malicious releases. Instead, the attacker added a dependency on `plain-crypto-js@4.2.1`, which Microsoft said was a fake runtime dependency used only to trigger an install-time script. During installation or update, the package executed `setup.js`, contacted attacker infrastructure, and retrieved a second-stage remote access trojan.

The Axios maintainer's post-mortem said the packages were published through a compromised maintainer account and that the compromise began with a targeted social-engineering campaign against the lead maintainer. The public record supports a valid-account compromise followed by malicious package publication, but it does not support broader claims about every downstream payload capability on every platform.

## Attack Chain

### Stage 1: Maintainer Account Compromise

The Axios maintainer said the attacker gained access to the lead maintainer's machine through a targeted social-engineering campaign and then used the compromised account to publish malicious versions to npm.

### Stage 2: Malicious Dependency Injection

Microsoft said the attacker seeded `plain-crypto-js@4.2.0`, then used `plain-crypto-js@4.2.1` as a malicious dependency in `axios@1.14.1` and `axios@0.30.4` while leaving Axios runtime application logic unchanged.

### Stage 3: Install-Time Execution

When affected systems resolved the malicious dependency during `npm install` or `npm update`, the package's post-install logic executed automatically and contacted attacker-controlled infrastructure to retrieve second-stage malware.

### Stage 4: Endpoint and Pipeline Exposure

Developer machines and CI/CD runners that installed the affected versions during the exposure window had to be treated as compromised and investigated for secret exposure and network connections to the attacker infrastructure.

## Impact Assessment

The immediate impact was exposure of developer endpoints and automated build environments that installed the affected Axios versions. The maintainer post-mortem said all secrets and credentials present on affected machines should be treated as compromised, including CI-injected secrets on build runners.

The incident also had confirmed downstream operational impact. OpenAI said an internal GitHub Actions workflow used in its macOS app-signing process executed a compromised Axios version and prompted a rotation of code-signing certificates, though the company said it found no evidence of user-data exposure or unauthorized software signing.

## Attribution

Microsoft said the account that created `plain-crypto-js` was associated with Sapphire Sleet infrastructure and noted overlap with activity other vendors track as UNC1069.

The package maintainer's post-mortem supports a targeted social-engineering precursor but does not independently establish actor identity. The attribution is based on the correlation with Microsoft-reported infrastructure.

## Timeline

### 2026-03-30 — Staging Package Published

The attacker published `plain-crypto-js@4.2.0`, which Microsoft later described as a preparatory release used to establish publishing history.

### 2026-03-31 — Malicious Axios Versions Published

Malicious versions `axios@1.14.1` and `axios@0.30.4` were published to npm through the compromised maintainer account.

### 2026-03-31 — Malicious Packages Removed

The malicious packages were removed after roughly three hours of exposure, and `plain-crypto-js` was subsequently removed from npm as well.

### 2026-04-01 — Microsoft Analysis Published

Microsoft published technical analysis and mitigation guidance for the compromise.

### 2026-04-11 — OpenAI Response Published

OpenAI published its response describing downstream exposure in an internal GitHub Actions workflow and certificate-rotation steps.

## Remediation & Mitigation

The Axios maintainer advised affected users to downgrade to safe versions, remove `node_modules/plain-crypto-js`, rotate all secrets and credentials on affected machines, and review network logs for connections to `sfrclak[.]com` or `142.11.206[.]73` on port 8000. Microsoft also recommended pinning Axios to safe versions, cleaning npm cache, reviewing CI/CD logs for installs of the malicious versions, and adopting trusted publishing with OIDC instead of stored credentials.

Organizations with possible exposure should treat developer endpoints and build runners as potentially compromised systems rather than limiting response to a dependency update alone.

## Sources & References

- [GitHub: Post Mortem - axios npm supply chain compromise](https://github.com/axios/axios/issues/10636) — GitHub, 2026-04-02
- [Microsoft Security Blog: Mitigating the Axios npm supply chain compromise](https://www.microsoft.com/en-us/security/blog/2026/04/01/mitigating-the-axios-npm-supply-chain-compromise/) — Microsoft Security Blog, 2026-04-01
- [OpenAI: Our response to the Axios developer tool compromise](https://openai.com/index/axios-developer-tool-compromise/) — OpenAI, 2026-04-11
