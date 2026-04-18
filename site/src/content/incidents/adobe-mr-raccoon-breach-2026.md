---
eventId: TP-2026-0027
title: Adobe BPO Supply Chain Breach by Mr. Raccoon
date: 2026-04-03
attackType: data-breach
severity: high
sector: Technology / Software
geography: Global
threatActor: Mr. Raccoon
attributionConfidence: A4
reviewStatus: under_review
confidenceGrade: C
generatedBy: new-threat-intel-automation
generatedDate: 2026-04-03
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
---
## Executive Summary

In April 2026, a threat actor operating under the handle "Mr. Raccoon" published claims of a significant data breach affecting Adobe through a compromised Business Process Outsourcing (BPO) provider in India. The claim alleges access to approximately 13 million customer support tickets containing personally identifiable information (PII), approximately 15,000 Adobe employee records, complete HackerOne bug bounty submission archives, and internal corporate documents.

The attack vector leveraged a Remote Access Trojan (RAT) deployed via spear-phishing email to a BPO employee, followed by lateral movement and privilege escalation to compromise the employee's manager. The attacker reportedly exploited an access control misconfiguration in Adobe's helpdesk infrastructure that permitted bulk export of all customer support tickets through a single API request using an agent account. Adobe has neither confirmed nor denied the breach as of April 7, 2026.

vx-underground researchers examined samples and assessed the breach as appearing legitimate but potentially limited in scope to the helpdesk environment, with unclear scope regarding production systems and customer data repositories. The incident highlights supply chain risk in third-party customer support operations and the critical importance of access control segmentation in legacy helpdesk infrastructure.

## Technical Analysis

BPO Supply Chain Attack
Mr. Raccoon gained initial access through an Indian Business Process Outsourcing (BPO) firm contracted for Adobe's customer support operations. The attack began with a carefully crafted phishing email containing a malicious attachment that deployed a Remote Access Trojan (RAT) to the targeted BPO employee's workstation. Once the RAT was established, the attacker conducted reconnaissance and identified the victim's manager as a higher-value target with elevated helpdesk permissions.

The attacker then executed spear-phishing attacks specifically targeting the BPO manager, successfully capturing credentials and Multi-Factor Authentication codes. This supply chain compromise is notable for exploiting the trust relationship between Adobe and its third-party support provider, a common vector in enterprise breaches where external vendors maintain significant access to sensitive infrastructure.

Access Control Misconfiguration
Once authenticated as a manager account in the helpdesk system, the attacker discovered a critical access control flaw: the ability to export all customer support tickets in a single bulk request. This represents a significant failure in principle of least privilege — support agent accounts should be restricted to accessing only tickets assigned to them or their team, with bulk export functionality reserved for administrative roles subject to additional access controls and audit logging.

The configuration error allowed the attacker to retrieve approximately 13 million support tickets via a single API call, each potentially containing sensitive PII including customer names, email addresses, phone numbers, and support interaction details that may reference security-sensitive issues or account information.

Data Exfiltration
After successful bulk export of support tickets, the attacker leveraged the compromised account to access additional systems within the helpdesk environment, obtaining approximately 15,000 employee records, complete archives of HackerOne bug bounty submissions (potentially including vulnerability details and remediation timelines), and internal corporate documents. The data was exfiltrated over HTTPS connections, blending with legitimate support platform traffic and evading detection.

Data Exfiltration Method: Standard HTTPS connections to cloud storage; likely stored initially in temporary staging areas before bulk download and transfer to attacker-controlled infrastructure. No evidence of advanced evasion techniques reported.

## MITRE ATT&CK Mapping

T1566.001 — Phishing: Spearphishing Attachment

Initial RAT deployment via malicious email attachment targeting BPO support employee. Subsequent spear-phishing attacks targeting BPO manager with credential harvesting intent.

T1204.002 — User Execution: Malicious File

Initial malware execution relied on the targeted BPO employee opening a malicious attachment that deployed the remote access trojan.

T1078 — Valid Accounts

Compromised BPO manager account credentials used to authenticate to helpdesk system with elevated permissions, enabling unauthorized data access and bulk export operations.

T1530 — Data from Cloud Storage

Bulk retrieval and exfiltration of customer support tickets, employee records, and internal documents from cloud-hosted helpdesk infrastructure. Represents unauthorized access to cloud-stored data assets.

T1567 — Exfiltration Over Web Service

Data transferred from Adobe helpdesk system to attacker-controlled infrastructure via HTTPS connections, disguised as legitimate support platform traffic.

## Impact Assessment

Customer PII Exposure: Approximately 13 million customer support tickets potentially exposed, containing names, email addresses, phone numbers, and contextual information about customer issues. Represents significant identity theft risk and potential for social engineering attacks against exposed customers.

Employee Records: ~15,000 Adobe employee records compromised, including personnel information that enables targeted social engineering and credential harvesting campaigns against current and former staff.

HackerOne Bug Bounty Archive: Complete submission history including vulnerability descriptions, remediation details, and exploitation potential information. May reveal security issues already known to Adobe but not yet disclosed or patched.

Internal Documents: Corporate communications, strategy documents, and operational details that may inform future targeted attacks against Adobe or its customers. Competitive intelligence value to threat actors and rival organizations.

Supply Chain Risk: Incident demonstrates vulnerability of third-party support providers and the importance of zero-trust security models in managing external vendor access. Organizations relying on this BPO firm may be at elevated risk.

Regulatory Exposure: GDPR, CCPA, and other privacy regulations may apply to exposed customer records. Adobe likely faces notification obligations and regulatory inquiry regardless of breach confirmation status.

## Timeline

Unknown (Weeks Prior)
Initial Reconnaissance
Threat actor conducts targeting and reconnaissance on Adobe BPO support operations, identifies personnel structure and access controls.

Unknown Date
Malicious Email to BPO Employee
Spear-phishing email containing Remote Access Trojan (RAT) attachment sent to targeted BPO support employee. Employee opens attachment, RAT executed on workstation.

Unknown Date
Lateral Movement & Privilege Escalation
Attacker conducts reconnaissance on compromised BPO network, identifies BPO manager account with elevated helpdesk permissions as escalation target.

Unknown Date
Manager Credential Compromise
Spear-phishing attack targeting BPO manager yields credentials and MFA codes; attacker authenticates to helpdesk system as privileged user.

Unknown Date
Bulk Ticket Export
Attacker discovers access control misconfiguration permitting bulk export of all customer support tickets via single API request. ~13 million tickets exported.

Unknown Date
Additional Data Collection
Employee records (~15,000 records), HackerOne submission archives, and internal documents accessed and exfiltrated to attacker-controlled infrastructure.

April 2026
Public Breach Announcement
Threat actor "Mr. Raccoon" publicly announces Adobe breach, publishes sample data and breach details. Media coverage and security researcher analysis begins.

April 7, 2026
Status: Unconfirmed
Adobe has not confirmed or denied the breach. vx-underground researchers assess breach as potentially legitimate but possibly limited to helpdesk environment.

## Remediation & Mitigation

Principle of Least Privilege: Support agent accounts must be restricted to accessing only assigned tickets or team-level data. Bulk export functionality should require administrative approval, multi-factor authentication, and comprehensive audit logging. Access control review should be prioritized in all third-party support environments.

Third-Party Risk Management: BPO and external support providers require the same security posture as internal teams. Regular penetration testing, phishing simulations, and endpoint security assessments should be contractual requirements. Zero-trust architectures should be implemented for third-party access.

Endpoint Protection: RAT delivery via phishing email should be blocked through advanced email filtering, sandboxing, and endpoint detection and response (EDR) solutions. BPO environments in particular require robust EDR and behavior monitoring.

MFA Hardening: BPO employee credentials were compromised and MFA codes obtained through phishing. Organizations should implement FIDO2 authentication or push-based MFA that cannot be trivially harvested through social engineering.

Data Minimization: Historical support ticket retention policies should reflect regulatory and business requirements, not default indefinite retention. Older tickets with expired personal data should be purged to minimize blast radius of future breaches.

Audit Logging & Detection: Bulk data export operations should trigger immediate security alerts. API call patterns, export volumes, and unusual access patterns require real-time monitoring and incident response procedures.

Threat Intelligence: Monitor for Mr. Raccoon listings on dark web marketplaces and underground forums. Engage law enforcement and industry ISACs for coordinated response. Prepare customer notification and regulatory filing strategies.

Sources & References

1.
The Cybersec Guru — Adobe Data Breach 2026: Mr. Raccoon Claims Breach via BPO Provider

2.
Security Online — Adobe Data Breach: Mr. Raccoon BPO Supply Chain Leak

3.
Cybersecurity News — Adobe Customer Support Breach Investigation

4.
Cybernews — Threat Actor Claims Adobe Data Theft in Supply Chain Attack

Related Incidents
ShinyHunters Data Extortion Operations

Key Takeaways

Unconfirmed breach affecting 13M+ customer support records with PII
Supply chain compromise through Indian BPO support provider
Critical access control misconfiguration enabled bulk data export
RAT deployment + spear-phishing for credential compromise
HackerOne bug bounty archive and employee records exposed
Adobe has not confirmed or denied breach status as of April 7, 2026
