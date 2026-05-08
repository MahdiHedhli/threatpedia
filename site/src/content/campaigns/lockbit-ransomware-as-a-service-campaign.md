---
campaignId: "TP-CAMP-2020-0002"
title: "LockBit Global Ransomware-as-a-Service Campaign and Operation Cronos"
startDate: 2020-01-01
endDate: 2024-02-20
ongoing: false
attackType: "Ransomware-as-a-Service"
severity: critical
sector: "Multiple Critical Infrastructure Sectors"
geography: "Global"
threatActor: "LockBit"
attributionConfidence: A1
reviewStatus: "draft_ai"
confidenceGrade: B
generatedBy: "new-threat-intel-automation"
generatedDate: 2026-05-08
cves: []
relatedIncidents: []
tags:
  - "lockbit"
  - "ransomware"
  - "raas"
  - "operation-cronos"
  - "nca"
  - "fbi"
  - "cisa"
  - "extortion"
  - "double-extortion"
sources:
  - url: "https://www.justice.gov/opa/pr/us-leads-international-action-against-lockbit-ransomware-group"
    publisher: "U.S. Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2024-02-20"
    accessDate: "2026-05-08"
    archived: false
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-075a"
    publisher: "Cybersecurity and Infrastructure Security Agency"
    publisherType: government
    reliability: R1
    publicationDate: "2023-03-16"
    accessDate: "2026-05-08"
    archived: false
  - url: "https://www.europol.europa.eu/media-press/newsroom/news/lockbit-power-cut-europol-national-police-agencies-dismantle-prolific-ransomware-group"
    publisher: "Europol"
    publisherType: government
    reliability: R1
    publicationDate: "2024-02-20"
    accessDate: "2026-05-08"
    archived: false
  - url: "https://www.fbi.gov/investigate/cyber/lockbit-ransomware"
    publisher: "Federal Bureau of Investigation"
    publisherType: government
    reliability: R1
    publicationDate: "2024-02-20"
    accessDate: "2026-05-08"
    archived: false
mitreMappings:
  - techniqueId: "T1190"
    techniqueName: "Exploit Public-Facing Application"
    tactic: "Initial Access"
    attack-version: "v19"
    confidence: confirmed
    evidence: "CISA advisory AA23-075A documents LockBit affiliates exploiting known vulnerabilities in public-facing applications and unpatched systems as a primary initial access vector, corroborated by FBI and DOJ reporting."
  - techniqueId: "T1133"
    techniqueName: "External Remote Services"
    tactic: "Initial Access"
    attack-version: "v19"
    confidence: confirmed
    evidence: "CISA advisory AA23-075A and DOJ charging documents document LockBit affiliates abusing Remote Desktop Protocol and VPN services with compromised or brute-forced credentials to gain initial access to victim environments."
  - techniqueId: "T1486"
    techniqueName: "Data Encrypted for Impact"
    tactic: "Impact"
    attack-version: "v19"
    confidence: confirmed
    evidence: "Core LockBit ransomware functionality documented in CISA advisory AA23-075A and FBI reporting: affiliates deploy LockBit encryptors to encrypt victim files and demand ransom payment for decryption keys."
  - techniqueId: "T1490"
    techniqueName: "Inhibit System Recovery"
    tactic: "Impact"
    attack-version: "v19"
    confidence: confirmed
    evidence: "CISA advisory AA23-075A documents LockBit affiliates deleting volume shadow copies and disabling backup and recovery mechanisms prior to encryption to prevent victim recovery without ransom payment."
  - techniqueId: "T1657"
    techniqueName: "Financial Theft"
    tactic: "Impact"
    attack-version: "v19"
    confidence: confirmed
    evidence: "FBI and DOJ document LockBit affiliates demanding and receiving ransom payments from victims globally. CISA advisory AA23-075A reports over $91 million in ransom payments from U.S. victims from January 2020 through mid-2023."
---

## Executive Summary

LockBit operated as a ransomware-as-a-service (RaaS) platform from at least January 2020 through February 2024, when a coordinated international law enforcement action designated Operation Cronos disrupted its infrastructure. The platform enabled affiliates to conduct ransomware attacks against organizations across multiple critical infrastructure sectors worldwide in exchange for a share of extorted ransom payments. LockBit progressed through major variants including LockBit 2.0 and LockBit 3.0 (also known as LockBit Black), with each iteration expanding affiliate tooling and operational capability.

The Cybersecurity and Infrastructure Security Agency, the Federal Bureau of Investigation, and international partners identified LockBit as the most deployed ransomware variant globally as of the period covered by CISA advisory AA23-075A (March 2023). The U.S. Department of Justice, the UK National Crime Agency, Europol, and law enforcement agencies from multiple countries coordinated Operation Cronos on February 20, 2024, seizing LockBit's public-facing infrastructure, obtaining decryption keys from seized servers, and unsealing criminal charges against identified LockBit operators and affiliates.

## Technical Analysis

LockBit operated as a closed RaaS platform in which a core operator group developed, maintained, and leased the LockBit encryptor and supporting infrastructure to vetted affiliates. Affiliates conducted intrusions independently, deploying LockBit encryptors against victim organizations and negotiating ransom payments through LockBit's operator-managed leak site and payment portal. The platform provided affiliates with a customizable encryptor binary, a Tor-based negotiation panel, and a data leak site for publishing exfiltrated data when victims declined to pay.

CISA advisory AA23-075A documents that LockBit affiliates used diverse initial access techniques, including exploitation of vulnerabilities in public-facing applications, abuse of Remote Desktop Protocol and VPN services with compromised or brute-forced credentials, and phishing. The advisory identifies sectors targeted by LockBit affiliates as including financial services, food and agriculture, education, energy, government and emergency services, healthcare, information technology, manufacturing, and transportation. This breadth of targeting reflected the open affiliate recruitment model, which did not restrict affiliates by geography or sector.

LockBit 2.0, released in mid-2021, added automated lateral movement capabilities and built-in group policy abuse for Active Directory environments. LockBit 3.0 (LockBit Black), released in mid-2022, introduced a bug bounty program for identifying vulnerabilities in LockBit infrastructure and incorporated components from the leaked Conti ransomware source code and elements from BlackMatter.

Post-encryption, LockBit affiliates typically exfiltrated victim data prior to deploying the encryptor and threatened publication on the LockBit data leak site to increase pressure for ransom payment. This double-extortion model was standard across LockBit 2.0 and LockBit 3.0 operations.

## Attack Chain

### Stage 1: Initial Access

LockBit affiliates obtained initial access through multiple documented vectors. CISA advisory AA23-075A identifies exploitation of known vulnerabilities in public-facing systems, abuse of RDP and VPN services using valid or compromised credentials, and phishing as primary documented initial access methods. The decentralized affiliate model resulted in varied initial access tradecraft across LockBit-attributed intrusions.

### Stage 2: Persistence and Lateral Movement

Following initial access, affiliates established persistence using living-off-the-land techniques and legitimate remote management tools. LockBit 2.0 introduced automated lateral movement capabilities including propagation through Active Directory group policy abuse. Affiliates used credential-harvesting tools and network discovery to identify high-value systems including domain controllers, backup servers, and file servers as targets for the encryption phase.

### Stage 3: Data Exfiltration

Prior to deploying the LockBit encryptor, affiliates exfiltrated victim data to attacker-controlled infrastructure. Exfiltrated data was used as leverage in the extortion phase: affiliates published or threatened to publish victim data on the LockBit Tor-hosted leak site if ransom demands were not met.

### Stage 4: Ransomware Deployment and Encryption

Affiliates deployed the LockBit encryptor binary to target systems. The encryptor deleted volume shadow copies and disabled backup and recovery services prior to encrypting victim files. Encrypted files were marked with a LockBit-specific extension and a ransom note was deposited directing victims to a LockBit negotiation panel.

### Stage 5: Extortion and Payment Demand

LockBit affiliates demanded ransom payment in cryptocurrency for decryption keys and, where data exfiltration occurred, for non-publication of exfiltrated data. Negotiations were conducted through Tor-based portals maintained by the LockBit operator group. CISA advisory AA23-075A reports that LockBit affiliates received over $91 million in ransom payments from U.S. victims from January 2020 through mid-2023.

### Stage 6: Operation Cronos Disruption

On February 20, 2024, the UK National Crime Agency, the FBI, the U.S. Department of Justice, Europol, and law enforcement partners from multiple countries executed Operation Cronos, seizing LockBit's public-facing websites, recovering decryption keys from seized infrastructure, and unsealing criminal charges against identified LockBit affiliates and operators. The DOJ announced U.S. leadership in the international action and Europol confirmed the coordination across partner agencies.

## MITRE ATT&CK Mapping

T1190 - Exploit Public-Facing Application: LockBit affiliates exploited known vulnerabilities in public-facing applications to gain initial access to victim environments, as documented in CISA advisory AA23-075A and corroborated by FBI and DOJ reporting.

T1133 - External Remote Services: Affiliates abused RDP and VPN services using compromised or brute-forced credentials to establish initial footholds in victim environments, as documented in CISA advisory AA23-075A and DOJ charging documents.

T1486 - Data Encrypted for Impact: The LockBit encryptor deployed by affiliates encrypted victim files and demanded ransom payment for decryption keys. This is the core impact mechanism of the LockBit RaaS platform, documented across CISA advisory AA23-075A and FBI reporting.

T1490 - Inhibit System Recovery: LockBit affiliates routinely deleted volume shadow copies and disabled backup and recovery mechanisms prior to initiating encryption, as documented in CISA advisory AA23-075A.

T1657 - Financial Theft: LockBit affiliates demanded and received ransom payments from victims globally. CISA advisory AA23-075A reports that U.S. victims paid over $91 million in ransom to LockBit affiliates from January 2020 through mid-2023.

## Timeline

### 2020-01-01 — LockBit Ransomware-as-a-Service Begins Operations

LockBit, initially observed under the name "ABCD" ransomware in late 2019, became active under the LockBit name in early 2020. The platform operated under a RaaS model from the outset, recruiting affiliates to conduct ransomware intrusions in exchange for a share of ransom payments.

### 2021-06-01 — LockBit 2.0 Released

LockBit 2.0 was released, adding automated lateral movement through Active Directory group policy abuse and expanding the affiliate toolset. The version increased affiliate operational capability for enterprise network compromise.

### 2022-06-01 — LockBit 3.0 (LockBit Black) Released

LockBit 3.0, also known as LockBit Black, was released. The variant introduced a bug bounty program for identifying vulnerabilities in LockBit infrastructure and incorporated components from the leaked Conti ransomware source code and elements from BlackMatter. CISA advisory AA23-075A documents LockBit 3.0 activity as part of its coverage of the LockBit RaaS ecosystem.

### 2023-03-16 — CISA Advisory AA23-075A Published

CISA, the FBI, the Multi-State Information Sharing and Analysis Center, and international partners published advisory AA23-075A, identifying LockBit as the most deployed ransomware variant globally and documenting affiliate tactics, techniques, and procedures. The advisory reported over $91 million in confirmed ransom payments from U.S. victims from January 2020 through mid-2023.

### 2024-02-20 — Operation Cronos Executed

The UK National Crime Agency, the FBI, the U.S. Department of Justice, Europol, and law enforcement partners from multiple countries executed Operation Cronos. Law enforcement agencies seized LockBit's public-facing infrastructure, recovered decryption keys from seized servers, and unsealed criminal charges against identified LockBit operators and affiliates. The DOJ and Europol each issued public statements confirming the scope and coordination of the operation.

## Remediation & Mitigation

Organizations should prioritize patching of public-facing applications and systems against known exploited vulnerabilities. CISA advisory AA23-075A identifies exploitation of unpatched systems as a primary LockBit affiliate initial access vector. Maintaining an up-to-date asset inventory and patch management program reduces exposure to this vector.

Restrict and monitor Remote Desktop Protocol and VPN access. LockBit affiliates used RDP and VPN abuse as documented initial access vectors. Organizations should disable RDP where not required, enforce multi-factor authentication on all remote access services, and monitor for anomalous remote access activity.

Implement network segmentation to limit lateral movement. LockBit affiliates moved laterally to reach backup servers, domain controllers, and high-value file stores. Network segmentation and least-privilege access controls limit the scope of damage an affiliate can achieve following initial access.

Maintain offline or immutable backups. LockBit affiliates routinely deleted volume shadow copies and disabled backup services prior to encryption. Organizations should maintain offline or air-gapped backups that cannot be reached or modified from a compromised endpoint. Backup integrity should be verified regularly.

Organizations that receive ransom demands attributable to LockBit affiliates should contact the FBI or CISA. Law enforcement agencies recovered decryption keys from seized LockBit infrastructure during Operation Cronos; the FBI may hold applicable decryption keys for victims of LockBit affiliate intrusions.

Review CISA advisory AA23-075A for specific indicators of compromise, additional technical details, and sector-specific mitigation guidance applicable to LockBit affiliate activity.

## Sources & References

- [U.S. Department of Justice: U.S. Leads International Action Against LockBit Ransomware Group](https://www.justice.gov/opa/pr/us-leads-international-action-against-lockbit-ransomware-group) — U.S. Department of Justice, 2024-02-20
- [Cybersecurity and Infrastructure Security Agency: CISA Advisory AA23-075A — #StopRansomware: LockBit 3.0](https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-075a) — Cybersecurity and Infrastructure Security Agency, 2023-03-16
- [Europol: LockBit Power Cut — Europol and National Police Agencies Dismantle Prolific Ransomware Group](https://www.europol.europa.eu/media-press/newsroom/news/lockbit-power-cut-europol-national-police-agencies-dismantle-prolific-ransomware-group) — Europol, 2024-02-20
- [Federal Bureau of Investigation: LockBit Ransomware](https://www.fbi.gov/investigate/cyber/lockbit-ransomware) — Federal Bureau of Investigation, 2024-02-20
