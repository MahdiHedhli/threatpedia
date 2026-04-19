---
campaignId: "TP-CAMP-2025-0001"
title: "FrostArmada SOHO Router DNS Hijacking Campaign"
startDate: 2025-05-19
endDate: 2026-04-07
ongoing: false
attackType: "DNS Hijacking / Adversary-in-the-Middle Espionage"
severity: high
sector: "Government / IT / Telecom / Energy"
geography: "Global"
threatActor: "APT28"
attributionConfidence: A2
reviewStatus: "draft_ai"
confidenceGrade: C
generatedBy: "dangermouse-bot"
generatedDate: 2026-04-18
cves:
  - "CVE-2023-50224"
relatedIncidents: []
tags:
  - "frostarmada"
  - "apt28"
  - "forest-blizzard"
  - "dns-hijacking"
  - "aitm"
  - "soho-router"
  - "oauth-token-theft"
sources:
  - url: "https://www.ncsc.gov.uk/news/uk-exposes-russian-military-intelligence-hijacking-vulnerable-routers-for-cyber-attacks"
    publisher: "NCSC"
    publisherType: government
    reliability: R1
    publicationDate: "2026-04-07"
    accessDate: "2026-04-18"
    archived: false
  - url: "https://www.microsoft.com/en-us/security/blog/2026/04/07/soho-router-compromise-leads-to-dns-hijacking-and-adversary-in-the-middle-attacks/"
    publisher: "Microsoft Threat Intelligence"
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-04-07"
    accessDate: "2026-04-18"
    archived: false
  - url: "https://www.lumen.com/blog/en-us/frostarmada-forest-blizzard-dns-hijacking"
    publisher: "Lumen Black Lotus Labs"
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-04-07"
    accessDate: "2026-04-18"
    archived: false
  - url: "https://www.ncsc.gov.uk/news/uk-call-out-russian-military-intelligence-use-espionage-tool"
    publisher: "NCSC"
    publisherType: government
    reliability: R1
    publicationDate: "2025-07-18"
    accessDate: "2026-04-18"
    archived: false
mitreMappings:
  - techniqueId: "T1190"
    techniqueName: "Exploit Public-Facing Application"
    tactic: "Initial Access"
    notes: "Public reporting ties the campaign to exploitation of exposed edge devices including TP-Link and MikroTik equipment."
  - techniqueId: "T1557"
    techniqueName: "Adversary-in-the-Middle"
    tactic: "Credential Access"
    notes: "The campaign redirected targeted authentication traffic through actor-controlled infrastructure for interception."
  - techniqueId: "T1528"
    techniqueName: "Steal Application Access Token"
    tactic: "Credential Access"
    notes: "OAuth tokens were one of the campaign's highest-value collection targets."
  - techniqueId: "T1539"
    techniqueName: "Steal Web Session Cookie"
    tactic: "Credential Access"
    notes: "Microsoft described collection of session material and related authentication data during AiTM operations."
---

## Executive Summary

FrostArmada was a long-running APT28-linked campaign that compromised vulnerable SOHO and edge networking devices, altered their DNS settings, and used the resulting traffic visibility to support credential and token theft. Public disclosures from Microsoft, Lumen, and the U.K. NCSC in April 2026 described a campaign that had been active since at least mid-2025 and that blended broad opportunistic router compromise with narrower intelligence-focused follow-on targeting.

This article is better handled as a campaign record than as a single incident because the public reporting describes months of activity, thousands of compromised devices, and multiple victim categories across many countries. The campaign's center of gravity was not one victim breach but the sustained use of hijacked network infrastructure to support APT28 collection objectives.

## Technical Analysis

The core technique was DNS hijacking through compromised routers and firewalls. Once the actor gained administrative access to exposed devices, it reconfigured upstream DNS settings so local systems would send queries to actor-controlled resolvers. Most traffic was passed through normally, preserving stealth, while selected authentication-related domains were answered with attacker-controlled infrastructure to enable adversary-in-the-middle collection.

Microsoft and Lumen described the campaign as combining broad device compromise with more selective follow-on targeting. Lumen observed activity as early as May 2025 and later saw major expansion after public reporting on the AUTHENTIC ANTICS malware family in August 2025. Microsoft documented over 200 organizations and roughly 5,000 consumer devices impacted at disclosure, while Lumen's broader telemetry described far larger exposure windows and much higher peak router counts.

## Attack Chain

### Stage 1: Edge Device Compromise

APT28 operators exploited exposed router and firewall management surfaces, including vulnerable TP-Link and MikroTik devices, to obtain administrative control.

### Stage 2: DNS Reconfiguration

The operators changed upstream DNS settings so downstream devices would resolve queries through actor-controlled infrastructure.

### Stage 3: Selective Redirection

Most traffic was proxied normally, while authentication-related requests were selectively redirected to malicious infrastructure.

### Stage 4: Adversary-in-the-Middle Collection

Victims who proceeded through the hostile path exposed credentials, tokens, cookies, and other authentication artifacts to the operators.

### Stage 5: Follow-on Intelligence Access

Captured authentication material enabled later access to victim email and cloud-hosted resources aligned with APT28 intelligence priorities.

## MITRE ATT&CK Mapping

### Initial Access

T1190 - Exploit Public-Facing Application: Public reporting ties the campaign to exploitation of exposed router and firewall interfaces.

### Credential Access

T1557 - Adversary-in-the-Middle: The campaign redirected targeted authentication traffic through actor-controlled infrastructure.

### Token Theft

T1528 - Steal Application Access Token: Microsoft and Lumen both described OAuth token collection as a key objective.

### Session Theft

T1539 - Steal Web Session Cookie: Session material and other web-authentication artifacts were exposed through the AiTM path.

## Timeline

### 2025-05-19 - Earliest Lumen-Observed AiTM Infrastructure

Lumen reported the earliest observed FrostArmada-related AiTM activity in May 2025.

### 2025-08-06 - Wider Expansion Follows Prior Public Exposure

Lumen observed a wider phase of router exploitation and DNS redirection immediately after the U.K. AUTHENTIC ANTICS reporting cycle.

### 2025-12 - Peak Global Exposure

Lumen telemetry showed the campaign at its broadest reach during December 2025.

### 2026-04-07 - Coordinated Public Disclosure

Microsoft, Lumen, and the U.K. NCSC publicly described the campaign, its router-compromise tradecraft, and mitigation guidance.

## Historical Context

The campaign mattered because it converted cheap, weakly managed network hardware into surveillance infrastructure. Compromised SOHO routers sat upstream of remote workers, small offices, and lightly managed branch environments, creating a quiet observation and interception layer that could expose cloud access without directly breaching enterprise-managed endpoints.

At scale, FrostArmada created both broad and narrow risk. The broad risk was the large population of infected devices and the passive visibility that came with them. The narrow risk was the targeted harvesting of authentication data from organizations aligned with Russian intelligence priorities, including government and communications-related entities.

FrostArmada fits a longer APT28 pattern of abusing network edge infrastructure and authentication workflows in service of intelligence collection. What changed here was scale and emphasis: rather than only using edge-device access as a stepping stone, the campaign turned router compromise into a durable DNS-hijacking and interception layer.

The campaign also sits downstream of earlier Russian credential-and-token collection efforts, including the AUTHENTIC ANTICS malware family that the U.K. later attributed to the same broader actor family. FrostArmada should therefore be read as evolution, not reinvention.

## Remediation & Mitigation

Defenders should treat unmanaged and lightly managed edge devices as real enterprise risk, especially in remote and hybrid work scenarios. Replace end-of-life routers, restrict or disable remote administration, rotate device credentials, and review upstream DNS settings across home-office and branch environments wherever visibility exists.

For cloud-facing defenses, token-aware response matters. Organizations should be prepared to revoke tokens, review high-risk sign-ins, and investigate abnormal cloud access that persists after a password reset. Phishing-resistant authentication, managed-device requirements, and monitoring for unexpected DNS behavior all reduce the value of campaigns like FrostArmada.

## Sources & References

1. [NCSC: UK Exposes Russian Military Intelligence Hijacking Vulnerable Routers for Cyber Attacks](https://www.ncsc.gov.uk/news/uk-exposes-russian-military-intelligence-hijacking-vulnerable-routers-for-cyber-attacks) - NCSC, 2026-04-07
2. [Microsoft Security Blog: SOHO Router Compromise Leads to DNS Hijacking and Adversary-in-the-Middle Attacks](https://www.microsoft.com/en-us/security/blog/2026/04/07/soho-router-compromise-leads-to-dns-hijacking-and-adversary-in-the-middle-attacks/) - Microsoft Threat Intelligence, 2026-04-07
3. [Lumen Black Lotus Labs: FrostArmada - Forest Blizzard DNS Hijacking](https://www.lumen.com/blog/en-us/frostarmada-forest-blizzard-dns-hijacking) - Lumen Black Lotus Labs, 2026-04-07
4. [NCSC: UK Calls Out Russian Military Intelligence for Use of Espionage Tool](https://www.ncsc.gov.uk/news/uk-call-out-russian-military-intelligence-use-espionage-tool) - NCSC, 2025-07-18
