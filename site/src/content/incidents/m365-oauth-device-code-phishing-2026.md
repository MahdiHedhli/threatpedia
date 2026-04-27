---
eventId: TP-2026-0031
title: Railway-Hosted Microsoft 365 Device Code Phishing Activity Hits 340+ Organizations
date: 2026-02-19
attackType: Phishing
severity: high
sector: Multi-Sector
geography: Multiple
threatActor: Unknown
attributionConfidence: A6
reviewStatus: draft_ai
confidenceGrade: C
generatedBy: penfold-bot
generatedDate: 2026-04-20
cves: []
tags:
  - phishing
  - oauth
  - device-code
  - token-theft
sources:
  - url: https://www.huntress.com/blog/railway-paas-m365-token-replay-campaign
    publisher: Huntress
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-03-23"
  - url: https://labs.cloudsecurityalliance.org/research/csa-research-note-oauth-device-code-phishing-m365-20260325-c/
    publisher: Cloud Security Alliance
    publisherType: research
    reliability: R1
    publicationDate: "2026-03-25"
  - url: https://www.microsoft.com/en-us/security/blog/2026/04/06/ai-enabled-device-code-phishing-campaign-april-2026/
    publisher: Microsoft Security Blog
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-04-06"
  - url: https://www.cisa.gov/resources-tools/services/m365-entra-id
    publisher: CISA
    publisherType: government
    reliability: R1
    publicationDate: "2025-02-01"
mitreMappings:
  - techniqueId: T1566.002
    techniqueName: "Phishing: Spearphishing Link"
    tactic: Initial Access
  - techniqueId: T1528
    techniqueName: Steal Application Access Token
    tactic: Credential Access
  - techniqueId: T1550.001
    techniqueName: "Use Alternate Authentication Material: Application Access Token"
    tactic: Defense Evasion
---

## Summary

A Railway-hosted device code phishing operation targeting Microsoft 365 users compromised more than 340 organizations by abusing Microsoft's legitimate OAuth device code authentication flow. Huntress said the activity used Railway-hosted infrastructure for token replay and observed a broad victim set across multiple sectors and countries.

Public reporting links the Railway-hosted activity to the EvilTokens phishing-as-a-service ecosystem, and Microsoft later described an April 2026 campaign aligned with similar device-code-phishing tradecraft. The current public source set does not establish a single confirmed actor identity for every intrusion in the Railway-hosted cluster even where tooling overlap is strong.

## Technical Analysis

Device code phishing abuses a legitimate authentication flow meant for devices with limited input capability. In a normal workflow, a user enters a short code at Microsoft's device login portal and approves access for a device or session. In this campaign, the attacker generated the device code first, then tricked the victim into authorizing the attacker's session.

Huntress observed suspicious Microsoft 365 sign-ins originating from Railway.com infrastructure and described the environment as a token replay platform. Microsoft later documented a related campaign that used threat actor-controlled pages and dynamic infrastructure to steer targets into authentic Microsoft device sign-in flows, after which the attackers replayed valid access and refresh tokens from their own infrastructure. CSA noted that this approach can preserve access after a password reset unless defenders also revoke active sign-in sessions.

## Attack Chain

### Stage 1: Social Engineering Lure

Victims received phishing lures themed around business communications such as construction bids, DocuSign items, voicemail, or Microsoft Forms activity. The goal was to persuade the user to begin a seemingly legitimate Microsoft authentication step.

### Stage 2: Device Code Authorization

The victim was directed into a device code sign-in flow, either through a threat actor-controlled intermediary page or directly to Microsoft's device login experience. The attacker had already initiated the device authorization request and controlled the session waiting for approval.

### Stage 3: Token Issuance and Replay

Once the victim completed authentication, Microsoft issued valid access and refresh tokens to the attacker-controlled session. Huntress and Microsoft both described subsequent token use from cloud-hosted infrastructure rather than from the victim's normal environment.

### Stage 4: Post-Compromise Access

With valid tokens in hand, the attacker could access Microsoft 365 resources without stealing the user's password. Microsoft documented follow-on activity including mailbox access, Graph API reconnaissance, and persistence actions that relied on the captured session material.

## Impact Assessment

Huntress reported more than 340 affected organizations and described victims across multiple sectors, with observed compromises spanning the United States, Canada, Australia, New Zealand, and Germany. The public reporting supports a wide campaign footprint, but it does not support a precise victim breakdown beyond those confirmed observations.

The operational impact comes from token-backed access to Microsoft 365 resources. Depending on granted permissions and the compromised account's role, attackers may access mailboxes, cloud files, contact data, and other Entra-connected services until defenders revoke the session material and investigate follow-on activity.

## Attribution

Huntress updated its investigation on March 23, 2026 to say the Railway-based activity had been attributed to the EvilTokens phishing-as-a-service platform, which it said first advertised publicly on February 16, 2026. Microsoft later described an April campaign aligned with EvilTokens tradecraft and infrastructure patterns.

That evidence supports associating the observed Railway-hosted activity with the EvilTokens ecosystem, but the current source set does not prove that every related intrusion was conducted by one confirmed named actor or intrusion set.

## Timeline

### 2026-02-16 - Event

Huntress reported that EvilTokens made its first public Telegram post advertising the service.

### 2026-02-19 - Event

Huntress said the first compromises it tied to the Railway infrastructure appeared on February 19, 2026.

### 2026-03-23 - Event

Huntress published its updated investigation and attributed the Railway campaign to the EvilTokens platform.

### 2026-03-25 - Event

Cloud Security Alliance published mitigation guidance describing the campaign's abuse of device code authentication and durable refresh tokens.

### 2026-04-06 - Event

Microsoft published a detailed blog on an AI-enabled device code phishing campaign aligned with EvilTokens tradecraft.

## Remediation & Mitigation

Review Entra and Microsoft 365 telemetry for device code sign-ins that include unusual pauses, error code 50199 followed by success, or successful authentication from suspicious cloud infrastructure. Huntress highlighted Railway IP space in its investigation, and Microsoft published example detection logic for suspicious device code authentication and malicious post-authentication token use.

If compromise is suspected, revoke the affected user's sign-in sessions in addition to rotating credentials, because refresh tokens can remain valid after a password reset. Investigate mailbox activity, Graph API access, inbox rule changes, and other post-authentication actions performed after the device code event.

Microsoft also recommended strengthening anti-phishing controls, enabling Safe Links, and restricting or disabling device code authentication where it is not required for the business. CISA's Microsoft Entra ID baseline likewise says device code authentication should be blocked where organizations do not need it.

## Sources & References

- [Huntress: Riding the Rails - Threat Actors Abuse Railway.com PaaS as Microsoft 365 Token Attack Infrastructure](https://www.huntress.com/blog/railway-paas-m365-token-replay-campaign) — Huntress, 2026-03-23
- [Cloud Security Alliance: OAuth Device Code Phishing Research Note](https://labs.cloudsecurityalliance.org/research/csa-research-note-oauth-device-code-phishing-m365-20260325-c/) — Cloud Security Alliance, 2026-03-25
- [Microsoft Security Blog: Inside an AI-enabled device code phishing campaign](https://www.microsoft.com/en-us/security/blog/2026/04/06/ai-enabled-device-code-phishing-campaign-april-2026/) — Microsoft Security Blog, 2026-04-06
- [CISA: Microsoft Entra ID Secure Configuration Baseline](https://www.cisa.gov/resources-tools/services/m365-entra-id) — CISA, 2025-02-01
