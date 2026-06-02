---
eventId: TP-2026-0333
title: "Storm-2949 Cloud-Wide Breach From Compromised Identity"
date: 2026-05-18
attackType: "Identity compromise"
severity: high
sector: Cloud services / enterprise identity
geography: Global
threatActor: "Storm-2949"
attributionConfidence: A2
generatedBy: "dangermouse-bot"
generatedDate: 2026-06-02
cves: []
relatedSlugs: []
reviewStatus: "draft_ai"
confidenceGrade: C
tags:
  - "cloud"
  - "identity compromise"
  - "sspr"
  - "microsoft 365"
  - "azure"
  - "mfa"
sources:
  - url: "https://www.microsoft.com/en-us/security/blog/2026/05/18/storm-2949-turned-compromised-identity-into-cloud-wide-breach"
    publisher: "Microsoft Security Blog"
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-05-18"
    accessDate: "2026-06-02"
    archived: false
  - url: "https://www.techradar.com/pro/security/microsoft-warns-hackers-are-exploiting-password-resets-to-gain-access-to-user-accounts-heres-how-to-stay-safe"
    publisher: "TechRadar"
    publisherType: media
    reliability: R2
    publicationDate: "2026-05-20"
    accessDate: "2026-06-02"
    archived: false
  - url: "https://blog.admindroid.com/storm-2949-attack-in-microsoft-365/"
    publisher: "AdminDroid"
    publisherType: media
    reliability: R2
    publicationDate: "2026-05-20"
    accessDate: "2026-06-02"
    archived: false
  - url: "https://www.cisa.gov/news-events/alerts/2019/10/04/microsoft-reports-cyberattacks-targeted-email-accounts"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2019-10-04"
    accessDate: "2026-06-02"
    archived: false
mitreMappings:
  - techniqueId: "T1078.004"
    techniqueName: "Cloud Accounts"
    tactic: "Initial Access"
    confidence: "confirmed"
    notes: "Threat actors used compromised Microsoft Entra identities to access enterprise Microsoft 365 and Azure environments."
  - techniqueId: "T1098"
    techniqueName: "Account Manipulation"
    tactic: "Persistence"
    confidence: "confirmed"
    notes: "Attackers reset credentials and modified authentication settings to keep access after account takeover."
  - techniqueId: "T1530"
    techniqueName: "Data from Cloud Storage"
    tactic: "Exfiltration"
    confidence: "probable"
    notes: "Observed behavior included large-scale retrieval of data from cloud file and storage services."
---

## Summary

Microsoft documented a cloud intrusion linked to the actor tracked as Storm-2949, where compromised Microsoft Entra identities were leveraged to expand access into multiple cloud services. The campaign began with identity abuse and spread across Microsoft 365 and Azure resources.

The published analysis indicates a broad data-loss risk pathway driven by account abuse, privilege escalation behavior, and cloud management-plane activity.

## Technical Analysis

The campaign used social-engineered self-service password reset flows and credential reset steps to seize account control. Once access to multiple identities was established, the actors moved across SaaS, PaaS, and IaaS components of the victim’s environment.

The reporting highlights directory and tenant discovery with Microsoft Graph, followed by operations against Azure App Service, Key Vault, Storage, and SQL-related assets. This pattern reflects control-plane abuse through legitimate management features rather than a single custom malware chain.

## Attack Chain

### Stage 1: Initial account takeover
Attackers directed targets through approval-pressure tactics around account recovery and MFA prompts, enabling compromise of Microsoft Entra IDs.

### Stage 2: Tenant and role discovery
Post-takeover activity expanded to account and environment discovery, including use of API-driven enumeration to identify identities and privileged paths.

### Stage 3: Cloud resource abuse
After mapping access paths, the actors moved into Azure management and service surfaces, including app and vault interfaces, while continuing to pivot between related services.

### Stage 4: Data access and movement
The activity then included broad access and exfiltration actions across Microsoft 365 stores and Azure-linked storage and database surfaces.

## Impact Assessment

The principal impact is a single compromised identity leading to a broad cloud breach profile, where one foothold could be reused to access high-value workloads and sensitive repositories.

Organizations with wide role inheritance, weak MFA workflows, or permissive administrative surfaces are exposed to both immediate and secondary cloud-impact scenarios.

## Attribution

Microsoft’s write-up tracks the operation as Storm-2949 and documents a repeatable identity-to-cloud-control pattern. No public actor admission was identified in the available reporting.

Given available reporting, the confidence level remains bounded by the published evidence and does not extend beyond documented behavior.

## Timeline

### 2026-05-18
Microsoft released the detailed investigation summary for the Storm-2949 cloud-wide compromise sequence.

### 2026-05-20
TechRadar and AdminDroid published summaries that echoed the password-reset abuse, MFA-related social engineering, and Azure/365 impact path.

## Remediation & Mitigation

- Restrict identity privileges through least-privilege design and periodic audits of owner-level roles.
- Harden password-reset and MFA workflows to reduce approval-based account takeover risk.
- Restrict sensitive Microsoft Entra and Azure management operations to narrowly scoped service identities.
- Enforce phishing-resistant authentication methods and protect enrollment channels used for credential re-registration.
- Expand detection for abnormal cloud-API access, unusual cross-service movement, and unusual publish-profile or key vault activity.

## Sources & References

- [Microsoft Security Blog: How Storm-2949 turned a compromised identity into a cloud-wide breach](https://www.microsoft.com/en-us/security/blog/2026/05/18/storm-2949-turned-compromised-identity-into-cloud-wide-breach) — Microsoft Security Blog, 2026-05-18
- [TechRadar: Microsoft warns hackers are exploiting password resets to gain access to user accounts](https://www.techradar.com/pro/security/microsoft-warns-hackers-are-exploiting-password-resets-to-gain-access-to-user-accounts-heres-how-to-stay-safe) — TechRadar, 2026-05-20
- [AdminDroid: Storm-2949 Attack: A Complete M365 Cloud Breach](https://blog.admindroid.com/storm-2949-attack-in-microsoft-365/) — AdminDroid, 2026-05-20
- [CISA: Microsoft reports cyberattacks targeting email accounts](https://www.cisa.gov/news-events/alerts/2019/10/04/microsoft-reports-cyberattacks-targeted-email-accounts) — CISA, 2019-10-04
