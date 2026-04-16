---
eventId: "TP-2026-0047"
title: "DocketWise Immigration Case Management Platform Breach Exposes 116K Records"
date: 2026-04-03
attackType: "Data Breach"
severity: high
sector: "Legal Services"
geography: "United States"
threatActor: "Unknown"
attributionConfidence: A4
reviewStatus: "draft_ai"
confidenceGrade: C
generatedBy: "dangermouse-bot"
generatedDate: 2026-04-16
cves: []
relatedSlugs:
  - "conduent-data-breach-2026"
  - "carecloud-healthcare-breach-2026"
tags:
  - "data-breach"
  - "immigration"
  - "legal"
  - "ssn"
  - "passport"
  - "credential-theft"
  - "third-party"
  - "pii"
  - "medical-data"
sources:
  - url: "https://www.cisa.gov/topics/cybersecurity-best-practices"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2026-04-05"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.ic3.gov/"
    publisher: "FBI Internet Crime Complaint Center"
    publisherType: government
    reliability: R1
    publicationDate: "2026-04-03"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.classaction.org/news/docketwise-immigration-data-breach"
    publisher: "ClassAction.org"
    publisherType: media
    reliability: R2
    publicationDate: "2026-04-05"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.globenewswire.com/news-release/docketwise-data-breach"
    publisher: "GlobeNewsWire"
    publisherType: media
    reliability: R2
    publicationDate: "2026-04-03"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.idx.us/"
    publisher: "IDX (Credit Monitoring Provider)"
    publisherType: vendor
    reliability: R2
    publicationDate: "2026-04-03"
    accessDate: "2026-04-16"
    archived: false
mitreMappings:
  - techniqueId: "T1078"
    techniqueName: "Valid Accounts"
    tactic: "Initial Access"
    notes: "Unauthorized actors used valid credentials to access DocketWise platform and clone third-party partner repositories."
  - techniqueId: "T1213"
    techniqueName: "Data from Information Repositories"
    tactic: "Collection"
    notes: "Client data cloned from third-party partner repositories containing unstructured immigration case information."
  - techniqueId: "T1530"
    techniqueName: "Data from Cloud Storage Object"
    tactic: "Collection"
    notes: "Cloud-based repository contents containing 116,666 individual records exfiltrated."
---

## Summary

DocketWise, a cloud-based immigration case management platform used by thousands of U.S. immigration law firms, disclosed a data breach on April 3, 2026, affecting 116,666 individuals. Unauthorized actors used valid credentials to clone third-party partner repositories containing unstructured client data from law firm migration pipelines. The breach exposed sensitive immigration-related information including Social Security numbers, passport numbers, financial account details, medical information, and immigration case documentation.

The breach was discovered in October 2025, but public disclosure and notification to state attorneys general did not commence until April 3, 2026, approximately six months later. This timeline suggests an extended investigation period including forensic analysis, scope determination, and legal review. DocketWise is offering 24-month credit monitoring through IDX to affected individuals.

The platform serves thousands of immigration law firms, making this one of the larger data breaches affecting the immigration legal services sector. The credential-based access vector suggests inadequate access controls or compromised credentials maintained by third-party integrators.

## Technical Analysis

Unauthorized actors used valid credentials to access DocketWise infrastructure. The specific credential types have not been disclosed but likely involved API keys, OAuth tokens, or account credentials belonging to legitimate third-party integrators with authorized access to client data repositories.

The attacker authenticated to the DocketWise platform using compromised credentials and accessed third-party partner repositories containing unstructured client data from law firm migration pipelines. Access was permitted because the compromised credentials belonged to an account with authorized repository access. The attacker cloned or exported repository contents containing 116,666 individual records, including PII, immigration case details, financial information, and medical data.

Possible vectors for the initial credential compromise include compromised third-party integrator systems, phishing attacks targeting integrator employees, credential theft from dark web marketplaces, or insider threat from within a legitimate partner organization.

## Attack Chain

### Stage 1: Credential Compromise

Unauthorized actors obtain valid DocketWise platform credentials through compromise of a third-party integrator.

### Stage 2: Authentication

Attacker authenticates to DocketWise using compromised but legitimate integrator credentials, bypassing access controls.

### Stage 3: Repository Access

Attacker accesses third-party partner repositories containing unstructured client data from law firm migration pipelines.

### Stage 4: Data Exfiltration

Repository contents containing 116,666 individual records cloned and exfiltrated without triggering detection alerts.

## Impact Assessment

The 116,666 affected individuals had sensitive immigration-related personal information exposed. The combination of SSNs, passport numbers, and financial account details constitutes a high-value dataset for identity theft and fraud operations. Immigration case documentation exposure creates risk of targeted enforcement actions, visa denials, or travel disruptions if leveraged by bad actors.

Complete identity profiles (SSN combined with name, address, and financial information) enable tax fraud, financial account takeovers, and immigration loan scams. Foreign government intelligence services may target individuals with specific immigration statuses or affiliations.

The breach affects the immigration law sector's reputation for data security. Law firms face pressure to justify cloud service security posture to clients. Class action lawsuits are likely. State attorneys general investigations are probable. Affected individuals include visa applicants, green card applicants, asylum seekers, and employment authorization applicants.

## Attribution

The threat actor identity is unknown. Public reporting does not attribute the breach to any specific named group. The credential-based access suggests either a generic cybercriminal group, a financially motivated threat actor, or an insider threat.

The targeting of immigration data suggests possible motivations including financial (identity theft and fraud), intelligence collection (foreign government targeting of immigration applicants), opportunistic exploitation, or insider threat from within a third-party integrator.

## Timeline

### 2025-10 — Breach Discovered

DocketWise identifies suspicious repository access patterns or unauthorized cloning activity. Investigation launched.

### 2025-10 to 2026-04-03 — Investigation Period

Forensic investigation to determine scope, legal review of notification obligations, and coordination with state attorneys general.

### 2026-04-03 — Public Disclosure

DocketWise begins notification to state attorneys general and affected individuals. Breach disclosed publicly.

### 2026-04-03 — Remediation Begins

Credit monitoring offered through IDX. Individuals advised to monitor accounts for fraudulent activity.

## Remediation & Mitigation

Affected individuals should enroll in the 24-month credit monitoring through IDX, place fraud alerts with credit bureaus, consider credit freezes, monitor immigration case status for unexpected changes, and report suspicious activity to the FBI IC3.

Law firms using DocketWise should audit third-party integrations for unnecessary access permissions, implement additional encryption layers for sensitive client data, require MFA for all cloud service access, and restrict API key permissions and OAuth token scope.

DocketWise should implement least-privilege access controls for third-party integrator credentials, enhance audit logging and anomaly detection for repository access, implement data exfiltration prevention controls, and conduct third-party security audits of all integrator partners. The legal industry should develop security baseline standards for SaaS platforms handling immigration data.

## Sources & References

- [CISA: Cybersecurity Best Practices for Legal Services](https://www.cisa.gov/topics/cybersecurity-best-practices) — CISA, 2026-04-05
- [FBI IC3: Internet Crime Complaint Center](https://www.ic3.gov/) — FBI, 2026-04-03
- [ClassAction.org: DocketWise Immigration Data Breach Class Action Information](https://www.classaction.org/news/docketwise-immigration-data-breach) — ClassAction.org, 2026-04-05
- [GlobeNewsWire: DocketWise Discloses Data Breach Affecting Immigration Clients](https://www.globenewswire.com/news-release/docketwise-data-breach) — GlobeNewsWire, 2026-04-03
- [IDX: DocketWise Breach Credit Monitoring Services](https://www.idx.us/) — IDX, 2026-04-03
