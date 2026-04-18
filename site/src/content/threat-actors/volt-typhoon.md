---
name: "Volt Typhoon"
aliases:
  - "BRONZE SILHOUETTE"
  - "Vanguard Panda"
  - "DEV-0391"
  - "UNC3236"
  - "Insidious Taurus"
affiliation: "China (PRC state-sponsored)"
motivation: "Espionage / Pre-positioning"
status: active
country: "China"
firstSeen: "2021"
lastSeen: "2025"
targetSectors:
  - "Critical Infrastructure"
  - "Telecommunications"
  - "Energy & Utilities"
  - "Transportation"
  - "Water & Wastewater"
  - "Government"
targetGeographies:
  - "United States"
  - "Guam"
  - "Pacific Region"
tools:
  - "Living-off-the-land binaries (LOLBins)"
  - "Compromised SOHO routers"
  - "Custom web shells"
  - "Fast Reverse Proxy"
mitreMappings:
  - techniqueId: "T1218"
    techniqueName: "System Binary Proxy Execution"
    tactic: "Defense Evasion"
    notes: "Exclusively uses living-off-the-land techniques to avoid deploying malware detectable by EDR."
  - techniqueId: "T1090.002"
    techniqueName: "Proxy: External Proxy"
    tactic: "Command and Control"
    notes: "Routes traffic through compromised SOHO routers and VPN appliances to blend with normal traffic."
  - techniqueId: "T1078"
    techniqueName: "Valid Accounts"
    tactic: "Persistence"
    notes: "Uses compromised valid credentials for persistent access, avoiding creation of new accounts."
attributionConfidence: A1
attributionRationale: "Attributed to PRC state-sponsored actors by joint CISA/NSA/FBI advisory AA24-038A and supporting Five Eyes statements. Public sources consistently link the activity to the PRC, but the cited material does not require a public PLA-versus-MSS split in the profile metadata."
reviewStatus: "under_review"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "nation-state"
  - "china"
  - "critical-infrastructure"
  - "volt-typhoon"
  - "living-off-the-land"
  - "pre-positioning"
sources:
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-038a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2024-02-07"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.microsoft.com/en-us/security/blog/2023/05/24/volt-typhoon-targets-us-critical-infrastructure-with-living-off-the-land-techniques/"
    publisher: "Microsoft Security"
    publisherType: vendor
    reliability: R1
    publicationDate: "2023-05-24"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.fbi.gov/news/press-releases/fbi-partners-dismantle-botnet-used-by-peoples-republic-of-china-state-sponsored-hackers"
    publisher: "FBI"
    publisherType: government
    reliability: R1
    publicationDate: "2024-01-31"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

Volt Typhoon is a Chinese state-sponsored threat actor that has been pre-positioning within U.S. critical infrastructure networks since at least 2021. Attributed to PRC state-sponsored activity by CISA, NSA, FBI, and Five Eyes intelligence agencies, the group targets communications, energy, transportation, water and wastewater systems, and other critical infrastructure sectors, with a geographic focus on the U.S. mainland and Guam.

Volt Typhoon is assessed to be pre-positioning for potential disruptive or destructive operations against U.S. critical infrastructure in the event of a geopolitical crisis (such as a conflict over Taiwan). The group's heavy reliance on living-off-the-land (LOTL) techniques -- minimizing bespoke implants on victim Windows hosts in favor of native operating system tools and relay infrastructure -- makes detection challenging. CISA Director Jen Easterly described Volt Typhoon as a "defining threat of our generation."

## Notable Campaigns

### 2021-2025 -- U.S. Critical Infrastructure Pre-positioning

Volt Typhoon has maintained persistent access to critical infrastructure networks across communications, energy, transportation, and water sectors. The group has been present in some victim networks for over five years. The activity is characterized by long dwell times and no observed data exfiltration, consistent with pre-positioning rather than traditional espionage.

### 2024 -- KV Botnet Disruption

In January 2024, the FBI announced the court-authorized disruption of a botnet (KV Botnet) composed of compromised SOHO routers used by Volt Typhoon as operational relay infrastructure. The botnet included Cisco, Netgear, and other end-of-life devices.

## Technical Capabilities

Volt Typhoon's defining characteristic is its heavy use of living-off-the-land techniques. Rather than relying on large bespoke malware families on victim Windows systems, the group emphasizes native Windows tools (cmd.exe, PowerShell, wmic, ntdsutil, netsh), valid credentials, and compromised router infrastructure for post-compromise activity. This approach reduces obvious malware artifacts and complicates EDR-driven detection.

The group routes all traffic through networks of compromised SOHO routers and VPN appliances, making C2 traffic indistinguishable from legitimate network activity. Valid credentials (obtained through credential dumping or exploitation) provide persistent access without the need for backdoors.

This purely LOTL approach represents a strategic tradecraft choice optimized for long-term persistence in environments with mature security monitoring, at the cost of reduced operational flexibility.

## Attribution

The joint CISA/NSA/FBI advisory AA24-038A (February 2024) attributed Volt Typhoon to PRC state-sponsored actors and detailed the group's TTPs and indicators. Five Eyes partners (Australia, Canada, New Zealand, UK) co-signed the advisory. Microsoft first publicly identified the group in May 2023. FBI Director Christopher Wray testified to Congress about the Volt Typhoon threat to critical infrastructure.

## MITRE ATT&CK Profile

**Initial Access**: Exploitation of public-facing network appliances (T1190) including Fortinet, Ivanti, and Citrix devices, and valid accounts (T1078).

**Defense Evasion**: Exclusive use of LOLBins (T1218), no custom malware deployment, traffic proxied through compromised routers (T1090.002).

**Credential Access**: NTDS.dit extraction (T1003.003), credential dumping from domain controllers, and password spraying.

**Persistence**: Valid accounts (T1078) and maintenance of access through compromised network devices.

## Sources & References

- [CISA: Advisory AA24-038A - Volt Typhoon](https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-038a) -- CISA, 2024-02-07
- [Microsoft: Volt Typhoon Targeting U.S. Critical Infrastructure](https://www.microsoft.com/en-us/security/blog/2023/05/24/volt-typhoon-targets-us-critical-infrastructure-with-living-off-the-land-techniques/) -- Microsoft Security, 2023-05-24
- [FBI: KV Botnet Dismantled](https://www.fbi.gov/news/press-releases/fbi-partners-dismantle-botnet-used-by-peoples-republic-of-china-state-sponsored-hackers) -- FBI, 2024-01-31
