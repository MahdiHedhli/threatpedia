---
campaignId: "TP-CAMP-2023-0001"
title: "Volt Typhoon: Living-off-the-Land Campaign Against U.S. Critical Infrastructure"
startDate: 2021-01-01
ongoing: true
attackType: "Espionage / Pre-positioning"
severity: critical
sector: "Critical Infrastructure"
geography: "United States"
threatActor: "Volt Typhoon"
attributionConfidence: A1
reviewStatus: "draft_ai"
confidenceGrade: A
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
relatedSlugs:
  - "volt-typhoon"
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
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-144a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2023-05-24"
    accessDate: "2026-04-16"
    archived: false
mitreMappings:
  - techniqueId: "T1218"
    techniqueName: "System Binary Proxy Execution"
    tactic: "Defense Evasion"
    notes: "Exclusive use of LOLBins (cmd, PowerShell, wmic, ntdsutil) to avoid deploying detectable malware."
  - techniqueId: "T1090.002"
    techniqueName: "Proxy: External Proxy"
    tactic: "Command and Control"
    notes: "Routes traffic through compromised SOHO routers to blend with legitimate network activity."
  - techniqueId: "T1078"
    techniqueName: "Valid Accounts"
    tactic: "Persistence"
    notes: "Uses compromised credentials for persistent access without deploying backdoors."
---

## Summary

The Volt Typhoon campaign is an ongoing Chinese state-sponsored operation targeting U.S. critical infrastructure for pre-positioning purposes. Active since at least 2021, the campaign has compromised organizations across the communications, energy, transportation, water and wastewater, and government sectors. The campaign is assessed to be preparing for potential disruptive or destructive operations against U.S. infrastructure in the event of a geopolitical crisis, such as a conflict over Taiwan.

Volt Typhoon's exclusive use of living-off-the-land (LOTL) techniques -- relying on native operating system tools rather than deploying custom malware -- represents a strategic tradecraft choice that makes detection exceptionally difficult. The group has maintained access to some victim networks for over five years. CISA Director Jen Easterly described the campaign as a "defining threat of our generation."

## Technical Analysis

Volt Typhoon gains initial access by exploiting vulnerabilities in internet-facing network appliances, including Fortinet FortiGuard, Ivanti Connect Secure, Citrix NetScaler, and other VPN and firewall products. The group also uses valid credentials obtained through credential spraying and exploitation.

Post-compromise activity relies entirely on LOLBins and native tools:
- **cmd.exe** and **PowerShell** for command execution
- **wmic** for system enumeration
- **ntdsutil** for credential extraction from Active Directory
- **netsh** for network configuration and port forwarding
- **certutil** for file transfers

The group routes all traffic through networks of compromised SOHO routers (the KV Botnet), making C2 indistinguishable from legitimate network activity. No custom malware, no distinctive C2 protocols, and no newly created user accounts are used -- all hallmarks of a LOTL approach optimized for long-term persistence.

## Attack Chain

### Stage 1: Network Appliance Exploitation
Volt Typhoon exploits vulnerabilities in internet-facing firewalls, VPN appliances, and routers for initial access.

### Stage 2: Credential Harvesting
Using ntdsutil, Mimikatz-equivalent native tools, and LSASS memory dumps, the group harvests domain credentials.

### Stage 3: Lateral Movement via LOLBins
Operators move laterally using RDP, WMI, and PowerShell remoting with harvested credentials -- all legitimate administrative tools.

### Stage 4: Persistent Access
Valid credentials and native scheduled tasks provide persistent access without deploying detectable implants.

### Stage 5: Infrastructure Mapping
The group maps operational technology networks, SCADA systems, and critical infrastructure components, consistent with preparation for future disruptive operations.

## Impact Assessment

The campaign has compromised critical infrastructure operators across multiple sectors. The absence of observed data exfiltration and the focus on OT-adjacent network segments support the assessment that Volt Typhoon is pre-positioning for potential disruption rather than conducting traditional espionage.

The strategic implications are severe. If activated during a geopolitical crisis, the pre-positioned access could enable disruption of communications, energy distribution, water treatment, and transportation systems across the United States. Congressional hearings have addressed the threat, and CISA has issued multiple advisories with hardening guidance.

The January 2024 disruption of the KV Botnet by the FBI removed one layer of Volt Typhoon's proxy infrastructure, but the group is expected to rebuild or adapt its relay network.

## Attribution

CISA, NSA, and FBI jointly attributed the campaign to PRC state-sponsored actors in advisory AA24-038A (February 2024), co-signed by Five Eyes intelligence partners (Australia, Canada, New Zealand, UK). Microsoft first publicly identified the group in May 2023. FBI Director Christopher Wray provided Congressional testimony on the Volt Typhoon threat. The assessment that the campaign is pre-positioning for potential disruption represents a consensus view across U.S. intelligence and cybersecurity agencies.

## Timeline

### 2021-01 -- Campaign Begins
Earliest confirmed Volt Typhoon activity in U.S. critical infrastructure networks.

### 2023-05-24 -- Microsoft Public Disclosure
Microsoft publishes analysis of Volt Typhoon targeting U.S. critical infrastructure with LOTL techniques.

### 2023-05-24 -- Initial Joint Advisory
CISA, NSA, FBI, and international partners publish advisory AA23-144A.

### 2024-01-31 -- KV Botnet Disruption
FBI announces court-authorized disruption of the KV Botnet used by Volt Typhoon.

### 2024-02-07 -- Comprehensive Advisory
CISA/NSA/FBI publish advisory AA24-038A detailing Volt Typhoon pre-positioning in critical infrastructure.

## Sources & References

- [CISA: Advisory AA24-038A - Volt Typhoon](https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-038a) -- CISA, 2024-02-07
- [Microsoft: Volt Typhoon LOTL Techniques](https://www.microsoft.com/en-us/security/blog/2023/05/24/volt-typhoon-targets-us-critical-infrastructure-with-living-off-the-land-techniques/) -- Microsoft Security, 2023-05-24
- [FBI: KV Botnet Dismantled](https://www.fbi.gov/news/press-releases/fbi-partners-dismantle-botnet-used-by-peoples-republic-of-china-state-sponsored-hackers) -- FBI, 2024-01-31
- [CISA: Advisory AA23-144A - PRC State-Sponsored Activity](https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-144a) -- CISA, 2023-05-24
