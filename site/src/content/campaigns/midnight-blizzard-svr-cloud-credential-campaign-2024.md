---
campaignId: "TP-CAMP-2024-0002"
title: "Midnight Blizzard SVR Cloud Credential and Spear-Phishing Campaign 2024"
startDate: 2023-10-01
endDate: 2024-05-31
ongoing: false
attackType: "Credential Theft / Cloud Access"
severity: critical
sector: "Government"
geography: "Global"
threatActor: "Midnight Blizzard"
attributionConfidence: A1
reviewStatus: "draft_ai"
confidenceGrade: A
generatedBy: "dangermouse-bot"
generatedDate: 2026-05-07
cves: []
relatedIncidents: []
tags:
  - "midnight-blizzard"
  - "apt29"
  - "svr"
  - "russia"
  - "spear-phishing"
  - "credential-theft"
  - "cloud"
  - "state-sponsored"
sources:
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-057a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2024-02-26"
    accessDate: "2026-05-07"
    archived: false
  - url: "https://www.ncsc.gov.uk/news/uk-and-allies-expose-russian-intelligence-services-targeting-political-and-diplomatic-entities"
    publisher: "NCSC UK"
    publisherType: government
    reliability: R1
    publicationDate: "2024-02-26"
    accessDate: "2026-05-07"
    archived: false
  - url: "https://www.microsoft.com/en-us/security/blog/2024/01/25/midnight-blizzard-guidance-for-responders-on-nation-state-attack"
    publisher: "Microsoft Security"
    publisherType: vendor
    reliability: R2
    publicationDate: "2024-01-25"
    accessDate: "2026-05-07"
    archived: false
  - url: "https://www.cisa.gov/news-events/alerts/2024/03/05/cisa-and-partner-agencies-release-advisory-midnight-blizzard"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2024-03-05"
    accessDate: "2026-05-07"
    archived: false
mitreMappings:
  - techniqueId: "T1566.002"
    techniqueName: "Spearphishing Link"
    tactic: "Initial Access"
    notes: "The actors sent targeted spear-phishing emails with links to credential-harvesting pages to obtain valid credentials for cloud service accounts at targeted organizations."
  - techniqueId: "T1110.003"
    techniqueName: "Password Spraying"
    tactic: "Credential Access"
    notes: "Advisory AA24-057a documented the use of password spraying against cloud accounts, including targeting dormant and service accounts that may not have consistent monitoring applied."
  - techniqueId: "T1078.004"
    techniqueName: "Cloud Accounts"
    tactic: "Persistence"
    notes: "After obtaining credentials, the actors authenticated using valid cloud accounts to access email and file storage systems, maintaining persistent access through legitimate authentication flows."
  - techniqueId: "T1550.001"
    techniqueName: "Application Access Token"
    tactic: "Lateral Movement"
    notes: "The actors used stolen OAuth tokens and application access tokens to authenticate to cloud services without requiring repeated credential use, reducing detection opportunities."
  - techniqueId: "T1090.003"
    techniqueName: "Multi-hop Proxy"
    tactic: "Command and Control"
    notes: "Advisory AA24-057a noted the use of residential proxy networks and IP addresses associated with legitimate commercial or residential services to obfuscate the geographic origin of authentication activity."
---

## Executive Summary

Midnight Blizzard, a threat actor attributed to the Russian Foreign Intelligence Service (SVR) by the United States, United Kingdom, and partner governments, conducted a credential theft and cloud access campaign targeting government, diplomatic, defense, technology, and civil society organizations in 2024. The campaign adapted established SVR intrusion tradecraft to target cloud-hosted services rather than on-premises infrastructure.

CISA, the FBI, NSA, and international partners published advisory AA24-057a in February 2024, documenting the tactics used by SVR actors to gain initial access to cloud environments. The advisory specifically noted that actors shifted to targeting cloud accounts after victim organizations migrated from on-premises systems, using password spraying, credential phishing, and token theft techniques against cloud service providers.

Microsoft disclosed in January 2024 that its own corporate email environment had been accessed by Midnight Blizzard beginning in November 2023, with the actors targeting the accounts of senior leadership and personnel in cybersecurity and legal functions. This disclosure provided technical detail corroborating the advisory and provided additional context on the campaign scope.

## Technical Analysis

The campaign reflected an adaptation of SVR tradecraft to cloud-hosted environments. Advisory AA24-057a documented that the actors used multiple credential acquisition methods: password spraying against cloud accounts, targeting of dormant accounts and service accounts that may receive less active monitoring, and spear-phishing for credentials to cloud services.

After obtaining valid credentials, the actors authenticated using those credentials to access cloud-hosted email and file storage services. CISA's advisory noted that the actors also used OAuth tokens and application access tokens as a means to maintain access to cloud resources without requiring repeated use of stolen passwords, reducing the likelihood of triggering credential-based alerting.

To obscure the origin of authentication activity, the actors routed connections through residential proxy infrastructure, using IP addresses associated with legitimate residential or commercial internet service providers. This technique allowed authentication events to appear to originate from locations consistent with normal user behavior, rather than from centralized attacker-controlled infrastructure.

The February 2024 advisory noted that the campaign targeted organizations across multiple sectors, with a documented focus on entities involved in government, diplomatic, and policy work. The actors sought access to email archives and internal communications.

## Attack Chain

### Stage 1: Credential Acquisition

The actors obtained valid credentials for cloud accounts through spear-phishing campaigns targeting specific individuals at organizations of interest, and through password spraying attacks against cloud authentication endpoints, including against dormant accounts and service accounts.

### Stage 2: Initial Cloud Authentication

Using obtained credentials, the actors authenticated to cloud service platforms. The use of residential proxy infrastructure routed initial authentication attempts through IP addresses that did not indicate attacker-controlled infrastructure.

### Stage 3: Token and Session Persistence

After initial authentication, the actors obtained OAuth application access tokens and session tokens associated with cloud service accounts, allowing subsequent access to cloud resources without repeated use of the stolen credentials, reducing reliance on password-based authentication.

### Stage 4: Data Collection from Cloud Services

The actors accessed cloud-hosted email accounts and file storage services, collecting email archives and documents. At Microsoft, the actors specifically targeted accounts of senior personnel and those in security and legal roles, according to Microsoft's January 2024 disclosure.

## MITRE ATT&CK Mapping

T1566.002 - Spearphishing Link: The actors sent targeted spear-phishing messages containing links to credential-harvesting infrastructure to obtain valid cloud account credentials from personnel at targeted organizations.

T1110.003 - Password Spraying: Advisory AA24-057a documented password spraying activity against cloud authentication endpoints, including targeting of dormant accounts and service accounts with potentially less robust monitoring controls.

T1078.004 - Cloud Accounts: Authenticated access using valid cloud credentials allowed the actors to operate within the normal authentication flows of cloud service providers, accessing email and file storage services as authenticated users.

T1550.001 - Application Access Token: After initial access, the actors used OAuth and application access tokens to authenticate to cloud services, maintaining access without requiring repeated use of stolen passwords.

T1090.003 - Multi-hop Proxy: Advisory AA24-057a noted the use of residential proxy networks and IP addresses associated with legitimate commercial or residential services, obscuring the geographic origin of authentication activity.

## Timeline

### 2023-10 — Campaign Activity Period

Advisory AA24-057a and Microsoft's January 2024 disclosure indicate that campaign activity targeting cloud environments was occurring in late 2023. The specific start date of the initial access phase was not confirmed in available source material.

### 2023-11 — Microsoft Corporate Email Access

Microsoft's January 2024 disclosure confirmed that Midnight Blizzard actors accessed Microsoft's corporate email environment beginning in November 2023, targeting accounts of senior leadership and personnel in cybersecurity and legal functions.

### 2024-01-12 — Microsoft Detects Intrusion

Microsoft disclosed that it detected the intrusion on January 12, 2024, and disclosed the incident publicly on January 19, 2024. The company confirmed active investigation and remediation in progress.

### 2024-01-25 — Microsoft Publishes Guidance

Microsoft Security published guidance for responders on the Midnight Blizzard intrusion, providing technical detail on the actor's techniques and recommended detection and mitigation steps for organizations using cloud services.

### 2024-02-26 — CISA and Partners Publish AA24-057a

CISA, the FBI, NSA, and international partners including NCSC UK published advisory AA24-057a, documenting SVR tactics for cloud access and providing hardening guidance. The advisory noted that the campaign reflected an adaptation to cloud-hosted environments as organizations migrated from on-premises infrastructure.

### 2024-03-05 — CISA Releases Companion Alert

CISA released a companion alert directing attention to the AA24-057a advisory and the associated Microsoft technical reporting, amplifying guidance for organizations using cloud services.

## Remediation & Mitigation

Advisory AA24-057a provided hardening guidance for organizations using cloud services. Enforcing phishing-resistant multi-factor authentication on all cloud accounts reduces the effectiveness of password spraying and credential phishing. This includes service accounts and dormant accounts, which may not consistently have MFA applied and represent an avenue the advisory documented as a target of the actors.

Organizations should review OAuth application authorizations and audit tokens granted to third-party applications connected to cloud tenants. Tokens associated with unfamiliar applications or applications that have not been used recently should be reviewed and revoked where there is no business justification. Conditional access policies that restrict authentication based on device compliance state and location reduce the value of stolen credentials used from attacker-controlled infrastructure.

Logging of authentication events, including OAuth token issuances and application access grants, supports detection of unauthorized access. The advisory recommended reviewing logs for authentication from residential proxy IP ranges and for accounts accessing resources from unfamiliar locations or at unusual times. Disabling or removing accounts that are no longer required reduces the available attack surface for password spraying.

For organizations that have migrated to cloud environments, reviewing the applicability of on-premises security controls to cloud services and ensuring that cloud-specific monitoring and access controls are in place is a documented baseline step from the advisory.

## Sources & References

- [CISA: Advisory AA24-057A — SVR Cyber Actors Adapt Tactics for Initial Cloud Access](https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-057a) — CISA, 2024-02-26
- [NCSC UK: UK and Allies Expose Russian Intelligence Services Targeting Political and Diplomatic Entities](https://www.ncsc.gov.uk/news/uk-and-allies-expose-russian-intelligence-services-targeting-political-and-diplomatic-entities) — NCSC UK, 2024-02-26
- [Microsoft Security: Midnight Blizzard — Guidance for Responders on Nation-State Attack](https://www.microsoft.com/en-us/security/blog/2024/01/25/midnight-blizzard-guidance-for-responders-on-nation-state-attack) — Microsoft Security, 2024-01-25
- [CISA: CISA and Partner Agencies Release Advisory on Midnight Blizzard](https://www.cisa.gov/news-events/alerts/2024/03/05/cisa-and-partner-agencies-release-advisory-midnight-blizzard) — CISA, 2024-03-05
