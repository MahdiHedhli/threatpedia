---
eventId: TP-2026-0323
title: "Mini Shai Hulud: Compromised @antv npm Packages Enable CI/CD Credential Theft"
date: 2026-05-20
attackType: supply-chain
severity: high
sector: Software supply chain / DevOps
geography: Global
threatActor: Unknown
attributionConfidence: A4
reviewStatus: draft_ai
confidenceGrade: B
generatedBy: dangermouse-bot
generatedDate: 2026-05-28
cves: []
relatedSlugs: []
tags:
  - antv
  - npm
  - ci-cd
  - credential-theft
  - supply-chain
  - github-actions
mitreMappings:
  - techniqueId: "T1195.001"
    techniqueName: "Compromise Software Dependencies and Development Tools"
    tactic: "Initial Access"
    notes: "Microsoft reported compromised @antv package versions published to npm and consumed through dependency chains."
  - techniqueId: "T1552.001"
    techniqueName: "Credentials In Files"
    tactic: "Credential Access"
    notes: "Payload behavior described by Microsoft includes harvesting tokens and secrets from CI/CD environments."
  - techniqueId: "T1567"
    techniqueName: "Exfiltration Over Web Service"
    tactic: "Exfiltration"
    notes: "Microsoft described dual-channel exfiltration of stolen CI/CD and cloud credentials."
sources:
  - url: "https://www.cisa.gov/resources-tools/resources/defending-against-software-supply-chain-attacks-0"
    publisher: "Cybersecurity and Infrastructure Security Agency"
    publisherType: government
    reliability: R1
    publicationDate: "2023-11-21"
    accessDate: "2026-05-28"
    archived: false
  - url: "https://www.microsoft.com/en-us/security/blog/2026/05/20/mini-shai-hulud-compromised-antv-npm-packages-enable-ci-cd-credential-theft/"
    publisher: "Microsoft Security Blog"
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-05-20"
    accessDate: "2026-05-28"
    archived: false
  - url: "https://socket.dev/blog/antv-packages-compromised"
    publisher: "Socket"
    publisherType: research
    reliability: R2
    publicationDate: "2026-05-19"
    accessDate: "2026-05-28"
    archived: false
  - url: "https://github.com/advisories/GHSA-3xmh-6mvr-59p8"
    publisher: "GitHub Advisory Database"
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-05-20"
    accessDate: "2026-05-28"
    archived: false
---

## Summary

Microsoft reported an active npm supply-chain incident affecting the `@antv` ecosystem, where compromised package versions executed a payload during install to steal CI/CD and cloud credentials. Public reporting and GitHub malware advisories indicate broad downstream exposure through dependency chains, including packages with high weekly usage.

## Technical Analysis

According to Microsoft, the malware executed through package lifecycle behavior during installation and targeted Linux GitHub Actions environments. Reported capabilities included token and secret theft across development and cloud platforms, process-memory scraping on runners, and credential exfiltration.

Microsoft also reported that GitHub removed malicious packages and invalidated impacted npm granular access tokens with write permissions and 2FA bypass, reducing immediate follow-on abuse risk from leaked tokens.

## Attack Chain

### Stage 1: Upstream package compromise

A maintainer account in the `@antv` npm scope was reportedly compromised, and malicious versions were published.

### Stage 2: Dependency propagation

Downstream projects pulled affected versions through dependency resolution, extending impact across CI/CD pipelines.

### Stage 3: Install-time payload execution

Malicious code executed during install/lifecycle processing and gated behavior to specific build/runtime conditions.

### Stage 4: Credential theft and exfiltration

The payload harvested CI/CD and cloud credentials and exfiltrated them via attacker-controlled channels.

## Impact Assessment

This incident posed elevated risk to software build integrity and cloud account security because it targeted automation secrets with potential reuse for lateral compromise. The breadth of package propagation increased blast radius beyond directly compromised upstream packages.

## Attribution

**Threat actor: Unknown.** Available public sources describe intrusion and malware behavior but do not provide a high-confidence named actor attribution.

## Timeline

### 2026-05-19 - Ecosystem exposure reporting

Socket published reporting on widespread compromised `@antv` package versions.

### 2026-05-20 - Vendor incident publication

Microsoft published technical analysis of the Mini Shai Hulud supply-chain activity and observed credential-theft behavior.

### 2026-05-20 - Malware advisory publication

GitHub Advisory Database published malware advisories for affected `@antv` packages, including `GHSA-3xmh-6mvr-59p8`.

## Remediation & Mitigation

- Identify direct and transitive dependencies on affected `@antv` package versions and remove/replace compromised versions.
- Rotate potentially exposed CI/CD, npm, GitHub, cloud, and vault credentials from a clean environment.
- Review build logs and pipeline telemetry for suspicious lifecycle-script execution and unexpected outbound connections.
- Restrict package install script execution where possible and strengthen dependency controls in CI/CD.

## Sources & References

- [Cybersecurity and Infrastructure Security Agency: Defending Against Software Supply Chain Attacks](https://www.cisa.gov/resources-tools/resources/defending-against-software-supply-chain-attacks-0) — Cybersecurity and Infrastructure Security Agency, 2023-11-21
- [Microsoft Security Blog: Mini Shai Hulud: Compromised @antv npm packages enable CI/CD credential theft](https://www.microsoft.com/en-us/security/blog/2026/05/20/mini-shai-hulud-compromised-antv-npm-packages-enable-ci-cd-credential-theft/) — Microsoft Security Blog, 2026-05-20
- [Socket: Mini Shai-Hulud Hits @antv Ecosystem, 639 Compromised npm Package Versions](https://socket.dev/blog/antv-packages-compromised) — Socket, 2026-05-19
- [GitHub Advisory Database: Malware in @antv/li-sam-assets (GHSA-3xmh-6mvr-59p8)](https://github.com/advisories/GHSA-3xmh-6mvr-59p8) — GitHub Advisory Database, 2026-05-20
