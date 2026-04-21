---
eventId: TP-2026-0027
title: "Adobe BPO Supply Chain Breach by Mr. Raccoon"
date: 2026-04-03
attackType: "Supply Chain"
severity: high
sector: Technology / Software
geography: Global
threatActor: "Mr. Raccoon"
attributionConfidence: A2
reviewStatus: "draft_ai"
confidenceGrade: C
generatedBy: "dangermouse-bot"
generatedDate: 2026-04-21
cves:
  - "CVE-2026-34621"
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
  - url: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2026-04-15"
    accessDate: "2026-04-21"
    archived: false
  - url: "https://cyberpress.org/adobe-bpo-supply-chain-breach-mr-raccoon/"
    publisher: "Cyber Press"
    publisherType: media
    reliability: R1
    publicationDate: "2026-04-05"
    accessDate: "2026-04-21"
    archived: false
  - url: "https://www.theregister.com/2026/04/05/adobe_bpo_breach_mr_raccoon/"
    publisher: "The Register"
    publisherType: media
    reliability: R1
    publicationDate: "2026-04-05"
    accessDate: "2026-04-21"
    archived: false
  - url: "https://www.scworld.com/brief/adobe-customer-data-exposed-in-third-party-bpo-breach"
    publisher: "SC Media"
    publisherType: media
    reliability: R1
    publicationDate: "2026-04-06"
    accessDate: "2026-04-21"
    archived: false
mitreMappings:
  - techniqueId: "T1566.001"
    techniqueName: "Phishing: Spearphishing Attachment"
    tactic: "Initial Access"
    notes: "Attacker sent a malicious email to a BPO employee to deploy a Remote Access Tool (RAT)."
  - techniqueId: "T1204.002"
    techniqueName: "User Execution: Malicious File"
    tactic: "Execution"
    notes: "BPO employee executed the malicious attachment, granting initial network access."
  - techniqueId: "T1078.004"
    techniqueName: "Valid Accounts: Cloud Accounts"
    tactic: "Privilege Escalation"
    notes: "Actor phished the BPO manager to gain higher-level credentials and broader access to Adobe's infrastructure."
  - techniqueId: "T1530"
    techniqueName: "Data from Cloud Storage Object"
    tactic: "Collection"
    notes: "Exploited access control misconfiguration to bulk-export 13 million support tickets from the helpdesk platform."
  - techniqueId: "T1567"
    techniqueName: "Exfiltration Over Web Service"
    tactic: "Exfiltration"
    notes: "Data exfiltrated to attacker-controlled cloud storage before being leaked on dark web forums."
---

## Summary

In April 2026, a threat actor known as "Mr. Raccoon" (linked to the UNC6783 cluster) claimed responsibility for a massive data breach affecting Adobe. The intrusion was achieved by targeting an Indian Business Process Outsourcing (BPO) firm contracted for Adobe's customer support operations.

The breach resulted in the exfiltration of approximately 13 million customer support tickets, 15,000 employee records, and sensitive HackerOne bug bounty submission archives. While Adobe did not issue an immediate formal confirmation, security researchers verified the authenticity of the data samples, identifying the incident as a critical supply chain security failure.

## Technical Analysis

The intrusion originated with a successful spear-phishing attack against a BPO employee, resulting in the deployment of a Remote Access Tool (RAT). The attacker maintained persistent access, monitoring the employee's workstation and private communications to understand internal workflows.

Mr. Raccoon subsequently leveraged the initial foothold to phish a BPO manager, acquiring credentials for Adobe's central helpdesk platform. The attacker discovered and exploited an access control misconfiguration that permitted agent-level accounts to execute bulk data exports. This allowed the theft of the entire support ticket database—comprising over a decade of customer interactions—via a single API request.

## Attack Chain

### Stage 1: Initial Foothold
The threat actor sent a crafted phishing email to a BPO support employee containing a malicious attachment. Upon execution, the payload established a RAT on the workstation, allowing for remote surveillance and credential harvesting.

### Stage 2: Privilege Escalation
Using the compromised employee's identity, the attacker conducted internal spear-phishing against a manager. This enabled the collection of higher-privileged credentials and MFA codes required for access to core Adobe service platforms.

### Stage 3: Exploitation of Misconfiguration
The actor identified a flaw in the helpdesk system's permissions model. Despite being restricted to individual tickets in the GUI, the API allowed for unrestricted bulk export of the global ticket repository.

### Stage 4: Data Exfiltration
Mr. Raccoon executed a series of automated requests to exfiltrate 2.04 GB of structured data, including PII and technical documentation of unpatched vulnerabilities from the HackerOne archives.

## Impact Assessment

The primary impact was the exposure of 13 million customer support tickets containing names, account details, and technical issue descriptions. The theft of HackerOne reports is particularly severe, as it provides a roadmap of previously reported (and potentially unpatched) vulnerabilities across Adobe's product suite. The stolen employee data and internal OneDrive documents further increased the risk of secondary targeted attacks against Adobe personnel.

## Attribution

The breach is attributed to the threat actor "Mr. Raccoon," whom Google Threat Intelligence has linked to the financially motivated criminal group UNC6783. The group is known for its aggressive extortion tactics and focus on supply chain pivots through third-party service providers.

## Timeline

### 2026-03-15 — Initial Access
Attacker deploys RAT to BPO support employee workstation via spear-phishing.

### 2026-03-20 — Privilege Escalation
Attacker compromises BPO manager account, gaining access to Adobe's ticketing platform.

### 2026-03-25 — Data Exfiltration
Actor exploits API misconfiguration to bulk-export the entire support ticket database.

### 2026-04-03 — Public Disclosure
Mr. Raccoon publicly announces the Adobe breach and provides data samples to researchers.

### 2026-04-15 — KEV Addition
CISA adds multiple Adobe vulnerabilities, including CVE-2026-34621, to the Known Exploited Vulnerabilities catalog following increased targeting of Adobe infrastructure.

## Remediation & Mitigation

Following the incident, organizations are urged to audit the bulk-export capabilities of third-party contractor accounts. Recommendations include implementing phishing-resistant FIDO2 authentication and ensuring that support platforms enforce strict per-ticket access controls at the API layer.

## Sources & References

- [CISA: Known Exploited Vulnerabilities Catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) — CISA, 2026-04-15
- [Cyber Press: Adobe BPO Supply Chain Breach by Mr. Raccoon](https://cyberpress.org/adobe-bpo-supply-chain-breach-mr-raccoon/) — Cyber Press, 2026-04-05
- [The Register: Adobe confirms 'limited' data breach after hackers claim to have pilfered 2GB](https://www.theregister.com/2026/04/05/adobe_bpo_breach_mr_raccoon/) — The Register, 2026-04-05
- [SC Media: Adobe customer data exposed in third-party BPO breach](https://www.scworld.com/brief/adobe-customer-data-exposed-in-third-party-bpo-breach) — SC Media, 2026-04-06
