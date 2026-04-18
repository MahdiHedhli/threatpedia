---
name: "EvilTokens"
aliases:
  - "Evil Tokens"
affiliation: "Phishing-as-a-service (PhaaS)"
motivation: "Credential Theft / Financial"
status: active
country: "Unknown"
firstSeen: "2026"
lastSeen: "2026"
targetSectors:
  - "Financial Services"
  - "Professional Services"
  - "Government"
  - "Healthcare"
  - "Technology"
targetGeographies:
  - "Global"
  - "United States"
  - "Canada"
  - "Australia"
  - "New Zealand"
  - "Germany"
tools:
  - "Microsoft device code phishing kit"
  - "Cloudflare Workers landing pages"
  - "Railway-hosted token replay infrastructure"
  - "Telegram operator panel"
mitreMappings:
  - techniqueId: "T1566.002"
    techniqueName: "Phishing: Spearphishing Link"
    tactic: "Initial Access"
    notes: "Delivers lure links that direct users into attacker-controlled Microsoft device code authentication flows."
  - techniqueId: "T1528"
    techniqueName: "Steal Application Access Token"
    tactic: "Credential Access"
    notes: "Captures Microsoft access and refresh tokens issued after victims complete the legitimate device login flow."
  - techniqueId: "T1550.001"
    techniqueName: "Use Alternate Authentication Material: Application Access Token"
    tactic: "Defense Evasion"
    notes: "Reuses stolen OAuth tokens to access Microsoft 365 resources without re-entering credentials."
attributionConfidence: A4
attributionRationale: "Huntress and Sekoia linked the 2026 Railway-centered Microsoft device-code phishing infrastructure to the EvilTokens kit. The kit is a real, documented operator service, but the individual operators and any national nexus remain unknown."
reviewStatus: "under_review"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "microsoft-365"
  - "device-code"
  - "oauth"
  - "phaas"
  - "phishing"
  - "token-theft"
sources:
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
---

## Executive Summary

EvilTokens is a phishing-as-a-service (PhaaS) kit focused on abusing Microsoft's OAuth device code flow to steal access and refresh tokens from Microsoft 365 users. Rather than stealing passwords directly, the platform lures victims into completing a legitimate Microsoft device-login challenge on the attacker's behalf, then redeems the resulting tokens from actor-controlled infrastructure.

Public reporting tied EvilTokens to a broad 2026 campaign that affected more than 340 organizations across the United States, Canada, Australia, New Zealand, and Germany. Huntress first documented the Railway-hosted token replay infrastructure, and Sekoia later analyzed EvilTokens as a turnkey kit sold in phishing-focused cybercrime communities. Microsoft subsequently described a broader rise in AI-enabled device code phishing, reinforcing that EvilTokens reflects a maturing criminal service model rather than a one-off intrusion set.

## Notable Campaigns

### 2026 -- Microsoft 365 Device Code Phishing Campaign

EvilTokens-linked infrastructure was used in a device-code phishing wave that compromised more than 340 organizations. The kit combined lure pages hosted on Cloudflare Workers with Railway-hosted token replay infrastructure and business-themed phishing content to persuade victims to complete a legitimate Microsoft device code login.

### 2026 -- PhaaS Commercialization of Device-Code Abuse

Sekoia documented EvilTokens as a subscription-style operator service with built-in account-takeover, email harvesting, and post-compromise automation features. The kit lowered the barrier to entry for device-code phishing and helped turn a once-specialized identity abuse pattern into a repeatable criminal workflow.

## Technical Capabilities

EvilTokens operates layered phishing infrastructure rather than traditional credential-harvesting pages. Victims are first routed through a lure page or email theme, then redirected to the legitimate `microsoft.com/devicelogin` flow with an attacker-generated device code. Once the victim authenticates, the attacker redeems the corresponding Microsoft access and refresh tokens from actor-controlled infrastructure.

Reporting on the kit highlights multiple evasion layers: Cloudflare Workers for landing and redirect logic, Railway-hosted token replay servers, and templated lures impersonating Microsoft 365, Adobe Acrobat, DocuSign, SharePoint, payroll, and invoice workflows. Sekoia also described advanced post-compromise features such as refresh-token weaponization, mailbox access, reconnaissance, and business-email-compromise-style automation.

## Attribution

The public record supports treating EvilTokens as a documented PhaaS kit rather than a named nation-state or nationally attributed threat actor. Huntress and Sekoia tied the same device-code phishing ecosystem to EvilTokens infrastructure and tooling, but the operators' identities and any national affiliation remain unknown. The strongest attribution claims today are about the service platform and its tradecraft, not a specific state sponsor.

## MITRE ATT&CK Profile

**Initial Access**: Spearphishing links (T1566.002) carrying business-themed lures direct victims into attacker-controlled device-code workflows.

**Credential Access**: EvilTokens steals Microsoft application access and refresh tokens (T1528) after victims complete the legitimate device-code flow.

**Defense Evasion / Access Reuse**: Stolen OAuth tokens are reused as alternate authentication material (T1550.001) to access Microsoft 365 resources without re-entering credentials.

## Sources & References

- [Huntress: Threat Actors Abuse Railway.com PaaS as Microsoft 365 Token Attack Infrastructure](https://www.huntress.com/blog/railway-paas-m365-token-replay-campaign) -- Huntress, 2026-03-23
- [Sekoia.io: New Widespread EvilTokens Kit: Device Code Phishing as-a-Service - Part 1](https://blog.sekoia.io/new-widespread-eviltokens-kit-device-code-phishing-as-a-service-part-1/) -- Sekoia.io, 2026-03-30
- [Microsoft Security Blog: Inside an AI-enabled Device Code Phishing Campaign](https://www.microsoft.com/en-us/security/blog/2026/04/06/ai-enabled-device-code-phishing-campaign-april-2026/) -- Microsoft Defender Security Research, 2026-04-06
