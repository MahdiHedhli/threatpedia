---
eventId: "TP-2023-0001"
title: "Volt Typhoon Critical Infrastructure Pre-positioning"
date: 2021-06-01
attackType: "Espionage / Pre-positioning"
severity: critical
sector: "Critical Infrastructure"
geography: "United States"
threatActor: "Volt Typhoon"
attributionConfidence: A1
reviewStatus: "draft_human"
confidenceGrade: A
generatedBy: "kernel-k"
generatedDate: 2026-04-17
cves: []
relatedSlugs: []
tags:
  - "volt-typhoon"
  - "china"
  - "critical-infrastructure"
  - "living-off-the-land"
  - "pre-positioning"
  - "lotl"
sources:
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-038a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2024-02-07"
    accessDate: "2026-04-17"
    archived: false
  - url: "https://www.microsoft.com/en-us/security/blog/2023/05/24/volt-typhoon-targets-us-critical-infrastructure-with-living-off-the-land-techniques/"
    publisher: "Microsoft Security"
    publisherType: vendor
    reliability: R1
    publicationDate: "2023-05-24"
    accessDate: "2026-04-17"
    archived: false
  - url: "https://www.fbi.gov/news/press-releases/fbi-partners-dismantle-botnet-used-by-peoples-republic-of-china-state-sponsored-hackers"
    publisher: "FBI"
    publisherType: government
    reliability: R1
    publicationDate: "2024-01-31"
    accessDate: "2026-04-17"
    archived: false
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-144a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2023-05-24"
    accessDate: "2026-04-17"
    archived: false
mitreMappings:
  - techniqueId: "T1190"
    techniqueName: "Exploit Public-Facing Application"
    tactic: "Initial Access"
    notes: "Initial access activity has been tied to exploitation of internet-facing appliances and related edge infrastructure."
  - techniqueId: "T1003.003"
    techniqueName: "OS Credential Dumping: NTDS"
    tactic: "Credential Access"
    notes: "CISA and Microsoft documented repeated NTDS extraction activity to retain valid credentials over time."
  - techniqueId: "T1090.002"
    techniqueName: "Proxy: External Proxy"
    tactic: "Command and Control"
    notes: "Volt Typhoon routed activity through compromised SOHO routers and other edge devices."
  - techniqueId: "T1078"
    techniqueName: "Valid Accounts"
    tactic: "Persistence"
    notes: "The campaign relies heavily on stolen legitimate credentials rather than broad malware deployment."
---

## Executive Summary

Volt Typhoon is a long-running China-linked campaign focused on maintaining covert access inside U.S. critical infrastructure environments. Microsoft publicly described the activity in May 2023 and assessed with moderate confidence that the campaign was building disruptive options for a future crisis, while later U.S. government advisories described the broader objective as maintaining persistent footholds in critical infrastructure organizations. The campaign spans communications, energy, transportation, water, government, and other sectors important to national resilience.

The most important analytical distinction is that Volt Typhoon is not just another espionage cluster using stealthy tradecraft. Its value lies in pre-positioning: maintaining access, revalidating credentials, and understanding the environment well enough to support later operational disruption if geopolitical conditions change. That is why the campaign matters even when public reporting shows relatively little immediate data theft.

## Technical Analysis

Microsoft's public reporting places the campaign in motion by mid-2021. Initial access has been associated with internet-facing network appliances and related edge infrastructure, after which the operators pivot into victim environments using stolen legitimate credentials. Once inside, Volt Typhoon favors living-off-the-land activity over heavy malware deployment, minimizing the number of artifacts that normal endpoint tooling can catch.

Credential retention is central to the campaign. Both Microsoft and CISA documented repeated efforts to dump or copy credential material, including NTDS data from domain controllers, so access could be re-established over long periods. This behavior aligns with a pre-positioning objective: the operators are not simply stealing a password once, they are maintaining a renewable access mechanism inside strategically important networks.

The command-and-control model is similarly built for stealth. Rather than relying primarily on obvious bespoke implants, Volt Typhoon proxies traffic through compromised SOHO routers and edge devices, blending malicious activity into ordinary network noise and making attribution and blocking harder at scale. In some instances the operators also used custom or modified open-source tooling, but the campaign's operational signature remains low-visibility access through valid accounts, native utilities, and relayed infrastructure.

## Attack Chain

### Stage 1: Initial Appliance Access

Operators gain entry through exposed or weakly protected edge infrastructure, including public-facing network appliances and related internet-facing services.

### Stage 2: Credential Acquisition

From the initial foothold, the campaign focuses on collecting credential material that can support durable re-entry and lateral access.

### Stage 3: Silent Internal Discovery

Volt Typhoon performs system, identity, and network discovery using native administrative tools rather than noisy malware-heavy playbooks.

### Stage 4: Proxy-Based Access Maintenance

The operators route activity through compromised SOHO infrastructure and reuse valid accounts to keep sessions low-profile and resilient.

### Stage 5: Long-Dwell Pre-positioning

The campaign prioritizes persistence, environmental understanding, and the ability to revisit critical infrastructure targets over time.

## MITRE ATT&CK Mapping

### Initial Access

T1190 - Exploit Public-Facing Application: Public reporting tied Volt Typhoon's initial access to internet-facing network appliances and edge systems.

### Credential Access

T1003.003 - OS Credential Dumping: NTDS: The campaign repeatedly targeted NTDS data to preserve valid credential access.

### Command and Control

T1090.002 - Proxy: External Proxy: Traffic was relayed through compromised SOHO routers and similar devices to hide operator origin.

### Persistence

T1078 - Valid Accounts: Volt Typhoon's durability depends on stolen legitimate credentials more than widespread malware persistence.

## Timeline

### 2021-06-01 - Earliest Publicly Referenced Campaign Activity

Microsoft later assessed that the campaign had been active since mid-2021 against U.S. and Guam-linked critical infrastructure targets.

### 2023-05-24 - Microsoft Publicly Identifies Volt Typhoon Activity

Microsoft published detailed reporting describing the campaign's living-off-the-land tradecraft and pre-positioning concern.

### 2023-05-24 - Joint Advisory AA23-144A Released

CISA, NSA, FBI, and partners published early technical guidance on the activity cluster associated with Volt Typhoon.

### 2024-01-31 - FBI Disrupts KV Botnet Infrastructure

The FBI announced court-authorized disruption of router infrastructure that had been used to relay Volt Typhoon traffic.

### 2024-02-07 - Advisory AA24-038A Expands the Government Picture

CISA and partners documented repeated credential extraction, long-term access patterns, and signs that some footholds had been maintained for years.

## Remediation & Mitigation

Volt Typhoon is a strong argument for treating identity and edge infrastructure as inseparable parts of critical infrastructure defense. Organizations should reduce exposed management surfaces, harden network appliances, aggressively rotate and monitor privileged credentials, and assume that appliance compromise can become a domain or enterprise compromise if credential material is stored or reused poorly.

Detection needs to focus on behavior that looks administrative but appears in the wrong place or at the wrong time: unusual appliance logins, repeated NTDS collection, long-term use of valid accounts from abnormal source infrastructure, and command-line discovery from systems that should not behave like jump hosts. Resilience planning matters just as much as hunting. If a campaign is designed for pre-positioning, defenders should be prepared to rebuild trust boundaries and credential hierarchies, not just evict a single host.

## Sources & References

1. [CISA: AA24-038A - PRC State-Sponsored Actors Compromise and Maintain Persistent Access to U.S. Critical Infrastructure](https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-038a) - CISA, 2024-02-07
2. [Microsoft Security: Volt Typhoon Targets US Critical Infrastructure With Living-off-the-Land Techniques](https://www.microsoft.com/en-us/security/blog/2023/05/24/volt-typhoon-targets-us-critical-infrastructure-with-living-off-the-land-techniques/) - Microsoft Security, 2023-05-24
3. [FBI: FBI Partners Dismantle Botnet Used by People's Republic of China State-Sponsored Hackers](https://www.fbi.gov/news/press-releases/fbi-partners-dismantle-botnet-used-by-peoples-republic-of-china-state-sponsored-hackers) - FBI, 2024-01-31
4. [CISA: AA23-144A - People's Republic of China State-Sponsored Cyber Actor Living off the Land to Evade Detection](https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-144a) - CISA, 2023-05-24
