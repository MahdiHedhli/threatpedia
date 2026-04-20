---
eventId: TP-2026-0029
title: "Hims & Hers Health Zendesk Breach by ShinyHunters"
date: 2026-02-05
attackType: "Data Breach"
severity: high
sector: Healthcare
geography: United States
threatActor: ShinyHunters
attributionConfidence: A4
reviewStatus: draft_ai
confidenceGrade: C
generatedBy: penfold-bot
generatedDate: 2026-04-20
cves: []
relatedSlugs:
  - "shiny-hunters-leak-site"
  - "carecloud-healthcare-breach-2026"
  - "conduent-data-breach-2026"
  - "m365-oauth-device-code-phishing-2026"
tags:
  - "data-breach"
  - "telehealth"
  - "zendesk"
  - "okta"
  - "shinyhunters"
  - "support-tickets"
  - "healthcare"
sources:
  - url: https://www.bleepingcomputer.com/news/security/hims-and-hers-warns-of-data-breach-after-zendesk-support-ticket-breach/
    publisher: Bleeping Computer
    publisherType: media
    reliability: R2
    publicationDate: "2026-03-05"
  - url: https://techcrunch.com/2026/03/05/telehealth-giant-hims-hers-says-its-customer-support-system-was-hacked/
    publisher: TechCrunch
    publisherType: media
    reliability: R2
    publicationDate: "2026-03-05"
  - url: https://www.hhs.gov/hipaa/for-professionals/breach-notification/breach-portal/index.html
    publisher: HHS
    publisherType: government
    reliability: R1
    publicationDate: "2026-03-06"
mitreMappings:
  - techniqueId: T1078
    techniqueName: "Valid Accounts"
    tactic: initial-access
  - techniqueId: T1550.001
    techniqueName: "Use Alternate Authentication Material: Application Access Token"
    tactic: lateral-movement
  - techniqueId: T1530
    techniqueName: "Data from Cloud Storage"
    tactic: collection
  - techniqueId: T1567
    techniqueName: "Exfiltration Over Web Service"
    tactic: exfiltration
---

## Summary

Hims & Hers Health, a major U.S. telehealth company, suffered a significant data breach in early February 2026 when the threat group ShinyHunters gained unauthorized access to the company's Zendesk support platform using a compromised Okta SSO account. The breach exposed support tickets containing personally identifiable information (PII) of affected individuals, including names, email addresses, phone numbers, and medical information related to customer support interactions. The unauthorized access occurred between February 4-7, 2026. The company confirmed the breach on March 3, 2026, notifying affected individuals and regulatory authorities.

## Technical Analysis

The initial compromise vector involved a compromised Okta SSO (Single Sign-On) account. Typical attack vectors against SSO infrastructure include credential stuffing, phishing campaigns, or exploitation of unpatched Okta instances. Once the attackers obtained valid Okta credentials, they leveraged SSO trust relationships to gain access to Hims & Hers' Zendesk instance. With access to the Zendesk instance, the attackers were able to browse, search, and exfiltrate support ticket contents in multiple bulk data harvesting operations during a four-day access window without triggering immediate security alerts.

## Attack Chain

### Stage 1: Okta SSO Compromise
Initial compromise of an Okta SSO account likely via credential stuffing or phishing.

### Stage 2: Pivot to Zendesk
Leveraging the compromised Okta credentials to access the Zendesk customer support platform.

### Stage 3: Data Harvesting
Browsing and searching the Zendesk instance for sensitive support tickets containing PII.

### Stage 4: Exfiltration
Systematically exfiltrating support tickets to attacker-controlled infrastructure over standard web connections.

## Impact Assessment

Customer names, contact information, references to medical conditions, and historical customer service interactions were compromised. While full medical records and payment information were unaffected, the exposed data poses a severe identity theft and medical privacy risk. This breach impacted tens of thousands of customer records and required public disclosure to state and federal regulators.

## Attribution

The attack is attributed to ShinyHunters (UNC5537) with an A4 confidence ranking. The threat group is known to actively target identity and access management systems as a high-value entry point into enterprise networks, later publishing samples of the stolen data on their dark web leak site for extortion demands.

## Timeline

### 2026-02-04 — Event
Unauthorized access begins. Attackers use compromised Okta SSO credentials to access the Zendesk environment.

### 2026-02-05 — Event
Suspicious Activity Detected. Abnormal logins and data access patterns trigger investigations.

### 2026-02-07 — Event
Access Terminated. Hims & Hers security team revokes the compromised Okta credentials.

### 2026-03-03 — Event
Breach Publicly Confirmed. Hims & Hers publicly acknowledges the data breach and issues notifications to affected individuals and regulators.

## Remediation & Mitigation

Hims & Hers revoked compromised Okta credentials, reset SSO trust relationships, audited access logs, and notified regulatory authorities while offering 12-month credit monitoring. Long-term mitigation includes enforcing mandatory Phish-Resistant MFA on all Okta SSO accounts, implementing anomalous anomaly behavior detection, deploying Data Loss Prevention (DLP) to restrict exfiltration of PII, and establishing explicit Zero Trust architecture authorization checks in federated identity systems.

## Sources & References

- [Bleeping Computer: Hims & Hers Zendesk Support Breach](https://www.bleepingcomputer.com/news/security/hims-and-hers-warns-of-data-breach-after-zendesk-support-ticket-breach/)
- [TechCrunch: Telehealth Giant Hims & Hers Support System Hacked](https://techcrunch.com/2026/03/05/telehealth-giant-hims-hers-says-its-customer-support-system-was-hacked/)
- [HHS: OCR Breach Portal](https://www.hhs.gov/hipaa/for-professionals/breach-notification/breach-portal/index.html)
