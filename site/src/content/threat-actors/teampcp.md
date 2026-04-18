---
name: "TeamPCP"
aliases:
  - "Team PCP"
  - "DeadCatx3"
  - "PCPcat"
  - "ShellForce"
affiliation: "Cybercriminal (cloud-native / supply-chain intrusion)"
motivation: "Financial / Extortion"
status: active
country: "Unknown"
firstSeen: "2026"
lastSeen: "2026"
targetSectors:
  - "Technology"
  - "Cloud Services"
  - "Government"
  - "Software Supply Chain"
targetGeographies:
  - "Global"
tools:
  - "TeamPCP Cloud Stealer"
  - "Malicious GitHub Actions"
  - "Trojanized PyPI packages"
  - "CanisterWorm"
mitreMappings:
  - techniqueId: "T1195.002"
    techniqueName: "Supply Chain Compromise: Compromise Software Supply Chain"
    tactic: "Initial Access"
    notes: "Compromises trusted CI/CD tooling and package release paths to distribute credential-stealing payloads."
  - techniqueId: "T1552.001"
    techniqueName: "Unsecured Credentials: Credentials In Files"
    tactic: "Credential Access"
    notes: "Harvests credentials and secrets exposed in runner environments, workflow logs, and build artifacts."
  - techniqueId: "T1199"
    techniqueName: "Trusted Relationship"
    tactic: "Initial Access"
    notes: "Abuses trust in widely used security tooling and downstream dependencies to cascade access across victim environments."
attributionConfidence: A4
attributionRationale: "The malware and campaign infrastructure self-identify as TeamPCP, and Aqua, Microsoft, Akamai, and Wiz all described a coherent March 2026 campaign spanning Trivy, KICS, LiteLLM, and Telnyx. Individual operators and any national nexus remain unknown."
reviewStatus: "under_review"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "supply-chain"
  - "github-actions"
  - "pypi"
  - "credential-theft"
  - "cicd"
  - "teampcp"
sources:
  - url: "https://www.microsoft.com/en-us/security/blog/2026/03/24/detecting-investigating-defending-against-trivy-supply-chain-compromise/"
    publisher: "Microsoft Security Blog"
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-03-24"
    accessDate: "2026-04-18"
    archived: false
  - url: "https://www.akamai.com/blog/security-research/2026/mar/telnyx-pypi-2026-teampcp-supply-chain-attacks"
    publisher: "Akamai Security Intelligence Group"
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-03-27"
    accessDate: "2026-04-18"
    archived: false
  - url: "https://www.wiz.io/blog/tracking-teampcp-investigating-post-compromise-attacks-seen-in-the-wild"
    publisher: "Wiz"
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-03-30"
    accessDate: "2026-04-18"
    archived: false
---

## Executive Summary

TeamPCP is a cloud-native intrusion and supply-chain compromise actor that emerged publicly in 2026 during a cascading campaign against trusted developer tooling. The group, also tracked under labels such as DeadCatx3, PCPcat, and ShellForce, compromised CI/CD infrastructure and package-release channels for Trivy, KICS, LiteLLM, Telnyx, and related ecosystems to harvest cloud credentials and secrets from downstream build environments.

Rather than behaving like a low-signal hacktivist crew, TeamPCP's public tradecraft centers on trusted software relationships, poisoned GitHub Actions or package releases, credential harvesting from automation runners, and follow-on extortion or monetization opportunities. The campaign showed a clear understanding of CI/CD environments, dependency trust, and cross-ecosystem propagation.

## Notable Campaigns

### 2026 -- Trivy, KICS, LiteLLM, and Telnyx Supply-Chain Cascade

Beginning with the March 2026 compromise of Aqua Security's Trivy ecosystem, TeamPCP hijacked trusted version tags, poisoned GitHub Actions, and later weaponized related software supply chain components such as Checkmarx KICS, LiteLLM, and Telnyx. The attack path was designed to harvest cloud credentials, SSH keys, secrets, and tokens from downstream CI/CD environments.

### 2026 -- European Commission and Cisco Follow-on Victimization

The same TeamPCP campaign was tied to major downstream victimization at the European Commission, Cisco, Mercor, and other organizations whose pipelines or dependencies consumed compromised artifacts. In several cases, later extortion or publication activity was carried out under related criminal branding such as ShinyHunters or partner groups rather than under the TeamPCP name alone.

## Technical Capabilities

TeamPCP's technical profile is centered on CI/CD trust abuse. Public reporting describes malicious force-pushes to version tags, poisoned GitHub Actions, trojanized PyPI packages, and credential-stealing payloads that target AWS, GCP, Azure, Kubernetes, SSH, and developer secrets present in runner environments.

The actor's malware has been described as "TeamPCP Cloud Stealer" and in some cases as part of the broader CanisterWorm propagation chain. Its value proposition is not loud website disruption but silent, high-leverage credential theft that lets the attackers pivot from one trusted software component to the next.

## Attribution

The strongest public attribution evidence comes from the malware's self-identification, repeated reuse of infrastructure and cryptographic patterns across multiple supply-chain incidents, and consistent vendor reporting from Microsoft, Akamai, Wiz, Aqua, and others. That is strong enough to treat TeamPCP as a coherent criminal intrusion cluster, but not strong enough to claim specific named operators or a state nexus.

## MITRE ATT&CK Profile

**Initial Access**: TeamPCP weaponizes trusted software relationships and release channels through supply-chain compromise (T1195.002) and trust abuse (T1199).

**Credential Access**: The campaign repeatedly harvested secrets from build environments and workflow artifacts, including credentials stored in files or exposed in automation contexts (T1552.001).

**Impact / Follow-on Access**: Stolen secrets enabled broader downstream compromise, cloud access, extortion, and publication activity against organizations that consumed poisoned developer tooling.

## Sources & References

- [Microsoft Security Blog: Guidance for Detecting, Investigating, and Defending Against the Trivy Supply Chain Compromise](https://www.microsoft.com/en-us/security/blog/2026/03/24/detecting-investigating-defending-against-trivy-supply-chain-compromise/) -- Microsoft Security Blog, 2026-03-24
- [Akamai: The Telnyx PyPI Compromise and the 2026 TeamPCP Supply Chain Attacks](https://www.akamai.com/blog/security-research/2026/mar/telnyx-pypi-2026-teampcp-supply-chain-attacks) -- Akamai, 2026-03-27
- [Wiz: Tracking TeamPCP: Investigating Post-Compromise Attacks Seen in the Wild](https://www.wiz.io/blog/tracking-teampcp-investigating-post-compromise-attacks-seen-in-the-wild) -- Wiz, 2026-03-30
