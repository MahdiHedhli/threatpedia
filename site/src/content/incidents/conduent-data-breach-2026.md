---
eventId: "TP-2026-0028"
title: "Conduent Massive Data Breach Affects 25 Million Americans"
date: 2026-02-20
attackType: "Data Breach"
severity: critical
sector: "Government Services"
geography: "United States"
threatActor: "Unknown"
attributionConfidence: A4
reviewStatus: "under_review"
confidenceGrade: C
generatedBy: "dangermouse-bot"
generatedDate: 2026-04-16
cves: []
relatedSlugs:
  - "cegedim-sante-health-breach-2026"
  - "carecloud-healthcare-breach-2026"
  - "docketwise-immigration-data-breach-2026"
tags:
  - "data-breach"
  - "healthcare"
  - "government-services"
  - "bpo"
  - "ssn"
  - "medical-data"
  - "texas"
  - "oregon"
  - "largest-breach"
sources:
  - url: "https://www.hipaajournal.com/conduent-business-solutions-data-breach/"
    publisher: "HIPAA Journal"
    publisherType: media
    reliability: R2
    publicationDate: "2026-02-20"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.texasattorneygeneral.gov/"
    publisher: "Texas Attorney General"
    publisherType: government
    reliability: R1
    publicationDate: "2026-02-24"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://techcrunch.com/2026/02/24/conduent-data-breach-grows-affecting-at-least-25m-people/"
    publisher: "TechCrunch"
    publisherType: media
    reliability: R2
    publicationDate: "2026-02-24"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.malwarebytes.com/blog/news/2026/02/the-conduent-breach-from-10-million-to-25-million-and-counting"
    publisher: "Malwarebytes"
    publisherType: vendor
    reliability: R2
    publicationDate: "2026-02-25"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.hhs.gov/hipaa/for-professionals/breach-notification/index.html"
    publisher: "U.S. Department of Health and Human Services"
    publisherType: government
    reliability: R1
    publicationDate: "2026-02-20"
    accessDate: "2026-04-16"
    archived: false
mitreMappings:
  - techniqueId: "T1190"
    techniqueName: "Exploit Public-Facing Application"
    tactic: "Initial Access"
    notes: "Initial compromise likely via vulnerable public-facing application in Conduent's infrastructure."
  - techniqueId: "T1078"
    techniqueName: "Valid Accounts"
    tactic: "Persistence"
    notes: "Attackers used compromised credentials for persistence and lateral movement across Conduent environment."
  - techniqueId: "T1048"
    techniqueName: "Exfiltration Over Alternative Protocol"
    tactic: "Exfiltration"
    notes: "8 TB of data exfiltrated using non-standard protocols or legitimate services to evade detection."
  - techniqueId: "T1005"
    techniqueName: "Data from Local System"
    tactic: "Collection"
    notes: "Systematic collection from file shares, databases, and local storage across Conduent environment."
---

## Executive Summary

Between October 2024 and January 2025, Conduent Business Solutions, a major business technology and outsourcing firm, suffered a massive data breach affecting over 25 million Americans. The breach involved the exfiltration of approximately 8 terabytes of sensitive data, representing one of the largest known data breaches in U.S. history. Conduent provides critical services including medical billing, toll transaction processing, and prepaid card administration for government programs, positioning it as a central hub for personal information across multiple government and healthcare systems.

The breach was detected on January 13, 2025, and mitigated by late January 2025. However, notifications to affected individuals were delayed until October 2025, nine months after discovery. Texas Attorney General Ken Paxton launched a formal investigation in February 2026 after the full scale became public, characterizing the incident as "likely the largest breach in U.S. history."

The compromised data includes names, dates of birth, addresses, Social Security numbers, health insurance information, and detailed medical records. Affected individuals span multiple states, with Texas accounting for 15.4 million and Oregon for 10.5 million of the known victims.

## Technical Analysis

While the precise infection vector has not been disclosed, analysis patterns suggest initial compromise occurred through exploitation of a public-facing application. Conduent's extensive infrastructure supporting medical billing, toll processing, and government program operations provided multiple potential attack surfaces. The threat actor gained initial access in October 2024, establishing a persistent foothold that remained undetected for approximately three months.

The attackers maintained presence within Conduent's environment from October 2024 to January 2025, conducting extensive reconnaissance and lateral movement. The extended dwell time suggests sophisticated stealth techniques, gaps in security monitoring, or deliberate pacing to extract maximum data without triggering alerts.

The scale of data exfiltration (approximately 8 terabytes) represents one of the largest known exfiltration operations. The attackers employed systematic discovery and exfiltration processes, using file and directory discovery to locate valuable data, staging data from local systems, and exfiltrating over alternative protocols to evade traditional monitoring. The successful removal of 8 TB without triggering network-level alerts points to gaps in data loss prevention implementations.

## Attack Chain

### Stage 1: Initial Access

Threat actor gains initial access to Conduent's environment in October 2024, likely through exploitation of a public-facing application or remote service.

### Stage 2: Persistence and Reconnaissance

Attacker establishes persistence mechanisms and begins systematic reconnaissance of Conduent's infrastructure over a three-month period.

### Stage 3: Lateral Movement

Attackers conduct lateral movement across Conduent's infrastructure, discovering medical billing databases, government program files, and personal information repositories.

### Stage 4: Data Collection and Staging

Approximately 8 TB of data collected from multiple systems including medical records, Social Security numbers, and government program data.

### Stage 5: Exfiltration

Complete dataset exfiltrated to attacker-controlled infrastructure using non-standard protocols or legitimate services to avoid detection.

## Impact Assessment

The breach affected over 25 million individuals across multiple U.S. states. Texas accounted for 15.4 million affected individuals and Oregon for 10.5 million. The exfiltrated dataset includes comprehensive personal and medical information: names, dates of birth, addresses, Social Security numbers, driver's license numbers, medical diagnoses, treatment history, prescription data, health insurance claims, policy numbers, bank account information, and payment records.

This dataset enables multiple categories of fraud including financial fraud, medical identity theft (where attackers seek medical services in victims' names), synthetic identity fraud, and tax return fraud. The 9-month notification delay prevented victims from taking protective actions during that period. Exposed government program data affects vulnerable populations including SNAP, Medicaid, and disability benefits recipients.

More than 35 class action lawsuits have been filed in New Jersey federal court against Conduent and associated parties. The Texas Attorney General investigation is active, with reports indicating 14.7 million victims in Texas alone.

## Historical Context

The threat actor responsible for the Conduent breach has not been publicly identified. The attack characteristics (sophisticated reconnaissance, extended persistence, high-volume exfiltration capability, and targeting of critical infrastructure) suggest a capable, likely financially motivated group. No ransomware group has claimed responsibility.

Attribution confidence remains low (A4). The operational pattern is consistent with experienced cybercriminal organizations specializing in large-scale data theft for resale or fraud operations.

## Timeline

### 2024-10 — Initial Compromise

Threat actor gains initial access to Conduent's environment through a public-facing application or remote service.

### 2024-10 to 2024-12 — Extended Dwell Period

Three-month reconnaissance and lateral movement phase. Approximately 8 TB of data staged and exfiltrated.

### 2025-01-13 — Breach Detected

Conduent security team detects suspicious activity and confirms ongoing data exfiltration.

### 2025-01 — Breach Mitigated

Conduent removes attacker access and implements remediation measures.

### 2025-10-24 — Notification Begins

Conduent begins notifying affected individuals about the data breach, nine months after discovery.

### 2026-02 — Texas AG Investigation Launched

Texas Attorney General Ken Paxton launches formal investigation as the full scope of the breach becomes public at 25-plus million affected individuals.

## Remediation & Mitigation

Conduent implemented containment measures including isolation of compromised systems, credential rotation, deployment of enhanced monitoring, and multi-factor authentication across critical systems. Third-party forensic investigators were engaged to determine breach scope.

Organizations handling sensitive government and healthcare data should implement zero-trust architecture with microsegmentation and continuous authentication. Deploy behavioral analytics and anomaly detection for unusual data access patterns. Enforce data minimization principles and purpose limitation on data collection. State-level breach notification laws should enforce strict timelines (30 days maximum). Government agencies should evaluate cybersecurity posture of vendors with access to sensitive programs before contract renewal.

Affected individuals should monitor credit reports, consider credit freezes, and report suspicious activity to the FBI Internet Crime Complaint Center. The enrollment deadline for Conduent-offered credit monitoring through a third-party provider was March 31, 2026.

## Sources & References

- [HIPAA Journal: Conduent Business Solutions Data Breach](https://www.hipaajournal.com/conduent-business-solutions-data-breach/) — HIPAA Journal, 2026-02-20
- [Texas Attorney General: Data Breach Investigation](https://www.texasattorneygeneral.gov/) — Texas AG, 2026-02-24
- [TechCrunch: Conduent Data Breach Grows, Affecting at Least 25M People](https://techcrunch.com/2026/02/24/conduent-data-breach-grows-affecting-at-least-25m-people/) — TechCrunch, 2026-02-24
- [Malwarebytes: The Conduent Breach — From 10 Million to 25 Million and Counting](https://www.malwarebytes.com/blog/news/2026/02/the-conduent-breach-from-10-million-to-25-million-and-counting) — Malwarebytes, 2026-02-25
- [HHS: HIPAA Breach Notification Requirements](https://www.hhs.gov/hipaa/for-professionals/breach-notification/index.html) — HHS, 2026-02-20
