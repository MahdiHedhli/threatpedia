---
campaignId: "TP-CAMP-2026-0001"
title: "Microsoft 365 Device Code Phishing Campaign"
startDate: 2026-02-18
endDate: 2026-04-06
ongoing: false
attackType: "Phishing / Cloud Account Takeover"
severity: high
sector: "Multi-Sector"
geography: "Global"
threatActor: "EvilTokens"
attributionConfidence: A4
reviewStatus: "draft_ai"
confidenceGrade: C
generatedBy: "dangermouse-bot"
generatedDate: 2026-04-18
cves: []
relatedIncidents: []
tags:
  - "microsoft-365"
  - "device-code"
  - "oauth"
  - "phishing"
  - "eviltokens"
  - "token-theft"
  - "phaas"
sources:
  - url: "https://www.cisa.gov/resources-tools/services/m365-entra-id"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2026-04-18"
    accessDate: "2026-04-18"
    archived: false
  - url: "https://www.huntress.com/blog/railway-paas-m365-token-replay-campaign"
    publisher: "Huntress"
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-03-23"
    accessDate: "2026-04-18"
    archived: false
  - url: "https://blog.sekoia.io/new-widespread-eviltokens-kit-device-code-phishing-as-a-service-part-1/"
    publisher: "Sekoia.io"
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-03-30"
    accessDate: "2026-04-18"
    archived: false
  - url: "https://www.microsoft.com/en-us/security/blog/2026/04/06/ai-enabled-device-code-phishing-campaign-april-2026/"
    publisher: "Microsoft Defender Security Research"
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-04-06"
    accessDate: "2026-04-18"
    archived: false
mitreMappings:
  - techniqueId: "T1566.002"
    techniqueName: "Phishing: Spearphishing Link"
    tactic: "Initial Access"
    notes: "Victims were lured into attacker-controlled workflows that ended at the legitimate Microsoft device login experience."
  - techniqueId: "T1528"
    techniqueName: "Steal Application Access Token"
    tactic: "Credential Access"
    notes: "The campaign's defining objective was theft of Microsoft access and refresh tokens issued through the device code flow."
  - techniqueId: "T1550.001"
    techniqueName: "Use Alternate Authentication Material: Application Access Token"
    tactic: "Defense Evasion"
    notes: "Stolen tokens were replayed to access Microsoft 365 resources without re-entering passwords."
---

## Executive Summary

This campaign abused Microsoft's legitimate OAuth device code flow to compromise Microsoft 365 accounts at scale. Huntress first documented the Railway-hosted replay infrastructure in March 2026, Sekoia later tied the ecosystem to the EvilTokens phishing-as-a-service kit, and Microsoft then described a broader rise in AI-enabled device code phishing in early April 2026.

The important analytical boundary is that this was campaign-shaped cloud phishing activity, not one canonical victim incident. Public reporting described more than 340 impacted organizations across multiple countries, shared infrastructure patterns, and a repeatable kit-driven workflow that enabled many separate downstream compromises. That makes campaign treatment more accurate than leaving the article in the incidents collection.

## Technical Analysis

The attack did not primarily rely on fake password collection pages. Instead, the actor generated a legitimate Microsoft device code, sent the victim through a lure page or themed decoy, and convinced the victim to complete the real `microsoft.com/devicelogin` workflow on the attacker's behalf. Once the victim completed authentication, the attacker redeemed the resulting access and refresh tokens from its own infrastructure.

Huntress documented Railway-hosted replay infrastructure and a concentrated set of victim countries in early reporting. Sekoia later described EvilTokens as a commercialized PhaaS offering that combined Cloudflare Workers lures, token replay infrastructure, and business-themed templates. Microsoft's April 2026 research reinforced that device code phishing had become a reusable ecosystem rather than a one-off cluster.

## Attack Chain

### Stage 1: Lure Delivery

Targets receive phishing emails or links themed as routine business workflows such as invoices, meetings, documents, or approvals.

### Stage 2: Device Code Staging

The attacker generates a legitimate device code and presents it to the victim through a decoy page or scripted workflow.

### Stage 3: Legitimate Microsoft Authentication

The victim completes the real Microsoft device login flow and enters the attacker-supplied code.

### Stage 4: Token Replay

The operator redeems the resulting access and refresh tokens from attacker-controlled infrastructure.

### Stage 5: Cloud Account Abuse

The stolen tokens are used to access mailbox, file-sharing, and collaboration resources without directly stealing the victim's password.

## MITRE ATT&CK Mapping

### Initial Access

T1566.002 - Phishing: Spearphishing Link: The campaign relied on lure links and decoy flows that drove victims into attacker-controlled device code workflows.

### Credential Access

T1528 - Steal Application Access Token: The decisive credential event was theft of Microsoft access and refresh tokens.

### Defense Evasion / Access Reuse

T1550.001 - Use Alternate Authentication Material: Application Access Token: Operators reused stolen tokens to retain cloud access without re-authentication.

## Timeline

### 2026-02-18 - Early Campaign Activity

Public reporting later traced the active EvilTokens-linked ecosystem back to February 2026.

### 2026-03-23 - Huntress Documents the Replay Infrastructure

Huntress publicly described the Railway-hosted token replay workflow and the scale of victim impact.

### 2026-03-30 - Sekoia Identifies EvilTokens as a PhaaS Kit

Sekoia linked the infrastructure and tradecraft to a documented phishing-as-a-service platform.

### 2026-04-06 - Microsoft Describes Broader Device Code Phishing Reuse

Microsoft published research showing how similar device code phishing tradecraft was being reused more broadly, reinforcing the campaign's ecosystem significance.

## Historical Context

The campaign enabled mailbox compromise, document theft, message monitoring, and broader cloud account takeover across many organizations without requiring direct password theft. Because refresh tokens can outlive password changes, victim organizations may remain exposed even after traditional credential-reset workflows if token revocation is not part of the response.

This campaign also matters because it lowered the barrier to entry. EvilTokens and similar kit-driven infrastructure turned what was once a more specialized cloud-phishing technique into a repeatable criminal service model.

Device code phishing did not begin in 2026, but the February-April 2026 wave marked a step change in industrialization. The public reporting showed that attackers could operationalize legitimate Microsoft login flows at scale while hiding behind a blend of commodity cloud infrastructure, business-themed templates, and token-centric post-compromise activity.

This is also why the campaign should not be conflated wholesale with every other device code phishing cluster. The public evidence is strongest for EvilTokens-linked criminal infrastructure in this wave, while other actor sets - including state-linked ones - have used the same technique in different contexts.

## Remediation & Mitigation

Organizations should block device code authentication where it is not operationally required, and CISA's Entra guidance explicitly recommends doing so for most tenants. Response playbooks should treat token revocation as mandatory, not optional, because password resets alone do not necessarily invalidate stolen refresh tokens.

Longer-term mitigation includes phishing-resistant MFA, conditional access policies, managed-device requirements, token-aware detections, and user education that `microsoft.com/devicelogin` can still be abused when the request itself is malicious. The campaign succeeded by abusing trust in a legitimate authentication flow, so defenses must focus on context and policy, not just page authenticity.

## Sources & References

1. [CISA: Microsoft Entra ID Secure Configuration Baseline](https://www.cisa.gov/resources-tools/services/m365-entra-id) - CISA, accessed 2026-04-18
2. [Huntress: Threat Actors Abuse Railway.com PaaS as Microsoft 365 Token Attack Infrastructure](https://www.huntress.com/blog/railway-paas-m365-token-replay-campaign) - Huntress, 2026-03-23
3. [Sekoia.io: New Widespread EvilTokens Kit: Device Code Phishing as-a-Service - Part 1](https://blog.sekoia.io/new-widespread-eviltokens-kit-device-code-phishing-as-a-service-part-1/) - Sekoia.io, 2026-03-30
4. [Microsoft Security Blog: Inside an AI-Enabled Device Code Phishing Campaign](https://www.microsoft.com/en-us/security/blog/2026/04/06/ai-enabled-device-code-phishing-campaign-april-2026/) - Microsoft Defender Security Research, 2026-04-06
