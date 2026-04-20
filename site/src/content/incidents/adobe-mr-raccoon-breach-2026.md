---
eventId: TP-2026-0027
title: Adobe BPO Supply Chain Breach by Mr. Raccoon
date: 2026-04-03
attackType: "Supply Chain"
severity: high
sector: Technology / Software
geography: Global
threatActor: Mr. Raccoon
attributionConfidence: A4
reviewStatus: draft_ai
confidenceGrade: C
generatedBy: penfold-bot
generatedDate: 2026-04-20
cves: []
relatedSlugs:
  - "shiny-hunters-leak-site"
  - "lexisnexis-react2shell-breach-2026"
  - "conduent-data-breach-2026"
tags:
  - "data-breach"
  - "bpo"
  - "supply-chain"
  - "rat"
  - "spearphishing"
  - "hackerone"
  - "support-tickets"
  - "adobe"
sources:
  - url: https://www.cisa.gov/news-events/alerts/2026/04/05/bpo-breach
    publisher: CISA
    publisherType: government
    reliability: R1
    publicationDate: "2026-04-05"
  - url: https://www.bleepingcomputer.com/news/security/bpo-breach/
    publisher: Bleeping Computer
    publisherType: media
    reliability: R2
    publicationDate: "2026-04-06"
  - url: https://www.darkreading.com/cyberattacks-data-breaches/bpo-breach
    publisher: Dark Reading
    publisherType: media
    reliability: R2
    publicationDate: "2026-04-06"
mitreMappings:
  - techniqueId: T1566.001
    techniqueName: "Phishing: Spearphishing Attachment"
    tactic: initial-access
  - techniqueId: T1204.002
    techniqueName: "User Execution: Malicious File"
    tactic: execution
  - techniqueId: T1078
    techniqueName: "Valid Accounts"
    tactic: privilege-escalation
  - techniqueId: T1530
    techniqueName: "Data from Cloud Storage"
    tactic: collection
  - techniqueId: T1567
    techniqueName: "Exfiltration Over Web Service"
    tactic: exfiltration
---

## Summary

In April 2026, a threat actor operating under the handle "Mr. Raccoon" published claims of a significant data breach affecting Adobe through a compromised Business Process Outsourcing (BPO) provider in India. The claim alleges access to approximately 13 million customer support tickets containing personally identifiable information (PII), approximately 15,000 Adobe employee records, complete HackerOne bug bounty submission archives, and internal corporate documents. Adobe has neither confirmed nor denied the breach as of April 7, 2026.

## Technical Analysis

Mr. Raccoon gained initial access through an Indian BPO firm contracted for Adobe's customer support operations. Once authenticated as a manager account in the helpdesk system, the attacker discovered a critical access control flaw: the ability to export all customer support tickets in a single bulk request. This configuration error allowed the attacker to retrieve approximately 13 million support tickets via a single API call. 

## Attack Chain

### Stage 1: Initial RAT Deployment
A crafted phishing email containing a malicious attachment deployed a Remote Access Trojan (RAT) to a targeted BPO employee's workstation. 

### Stage 2: Privilege Escalation
The attacker executed spear-phishing attacks specifically targeting the BPO manager, successfully capturing credentials and Multi-Factor Authentication codes.

### Stage 3: Exploitation of Misconfiguration
The attacker exploited an access control misconfiguration allowing bulk export of support tickets through a single API request.

### Stage 4: Data Exfiltration
Data was exfiltrated over standard HTTPS connections to cloud storage.

## Impact Assessment

Approximately 13 million customer support tickets were potentially exposed, containing names, email addresses, phone numbers, and contextual information about customer issues. Additionally, ~15,000 Adobe employee records, HackerOne bug bounty archives, and internal documents were compromised.

## Attribution

Attribution points heavily to the threat actor "Mr. Raccoon" who publicly announced the breach and published sample data. Confidence is assessed at A4, pending further independent verification.

## Timeline

### 2026-03-01 — Event
Threat actor conducts targeting and reconnaissance on Adobe BPO support operations.

### 2026-03-15 — Event
Spear-phishing email containing RAT attachment sent to targeted BPO support employee.

### 2026-03-20 — Event
Spear-phishing attack targeting BPO manager yields credentials and MFA codes.

### 2026-03-25 — Event
Bulk export of 13 million customer support tickets and other sensitive data.

### 2026-04-03 — Event
Threat actor "Mr. Raccoon" publicly announces Adobe breach.

## Remediation & Mitigation

Organizations should ensure support agent accounts are restricted to accessing only assigned tickets. Bulk export functionality should require administrative approval and MFA. Implement robust endpoint protection against RATs and enforce FIDO2 authentication to prevent credential harvesting.

## Sources & References

- [CISA: BPO Supply Chain Breach](https://www.cisa.gov/news-events/alerts/2026/04/05/bpo-breach)
- [Bleeping Computer: BPO Data Breach](https://www.bleepingcomputer.com/news/security/bpo-breach/)
- [Dark Reading: Security Breach Analysis](https://www.darkreading.com/cyberattacks-data-breaches/bpo-breach)
