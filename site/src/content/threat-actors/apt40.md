---
name: "APT40"
aliases:
  - "Leviathan"
  - "BRONZE MOHAWK"
  - "TEMP.Periscope"
  - "TEMP.Jumper"
  - "Gingham Typhoon"
affiliation: "China (Ministry of State Security, Hainan)"
motivation: "Espionage"
status: active
country: "China"
firstSeen: "2009"
lastSeen: "2024"
targetSectors:
  - "Maritime"
  - "Defense"
  - "Government"
  - "Technology"
  - "Transportation"
  - "Research"
targetGeographies:
  - "South China Sea region"
  - "United States"
  - "Australia"
  - "Southeast Asia"
  - "Europe"
tools:
  - "BADFLICK"
  - "ScanBox"
  - "PHOTO"
  - "MURKYTOP"
  - "Derusbi"
  - "China Chopper"
mitreMappings:
  - techniqueId: "T1190"
    techniqueName: "Exploit Public-Facing Application"
    tactic: "Initial Access"
    notes: "Rapidly exploits newly disclosed vulnerabilities in web-facing applications within hours of publication."
  - techniqueId: "T1505.003"
    techniqueName: "Server Software Component: Web Shell"
    tactic: "Persistence"
    notes: "Deploys web shells including China Chopper on compromised web servers for persistent access."
  - techniqueId: "T1003"
    techniqueName: "OS Credential Dumping"
    tactic: "Credential Access"
    notes: "Uses credential harvesting tools for lateral movement within targeted networks."
attributionConfidence: A1
attributionRationale: "Attributed to MSS Hainan State Security Department by a July 2021 joint advisory from CISA, NSA, FBI, and international partners (AA21-200A), and a 2021 DOJ indictment of four MSS officers."
reviewStatus: "draft_ai"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "nation-state"
  - "china"
  - "mss"
  - "espionage"
  - "apt40"
  - "maritime"
sources:
  - url: "https://attack.mitre.org/groups/G0065/"
    publisher: "MITRE ATT&CK"
    publicationDate: "2025-10-17"
    publisherType: research
    reliability: R1
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa21-200a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2021-07-19"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.justice.gov/opa/pr/four-chinese-nationals-working-ministry-state-security-charged-global-computer-intrusion"
    publisher: "US Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2021-07-19"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

APT40, also tracked as Leviathan and Gingham Typhoon, is a Chinese state-sponsored cyber-espionage group attributed to the **Ministry of State Security (MSS) Hainan State Security Department**. Active since at least 2009, the group conducts espionage operations targeting maritime industries, defense contractors, government agencies, and research institutions, with a geographic focus on countries surrounding the South China Sea.

APT40's targeting aligns with Chinese strategic interests in the South China Sea, including maritime territorial disputes and naval modernization. The group demonstrates a rapid capability to exploit newly disclosed vulnerabilities in public-facing applications, often weaponizing proof-of-concept exploits within hours of public disclosure.

## Notable Campaigns

### 2017-2018 -- Maritime and Defense Sector Targeting

APT40 conducted sustained intrusions against maritime engineering companies, naval defense contractors, and research institutions in the United States and Southeast Asia. The group targeted proprietary naval technology, including submarine designs and undersea communications systems.

### 2021 -- Microsoft Exchange Exploitation

APT40 exploited ProxyLogon (CVE-2021-26855) and related Exchange vulnerabilities to compromise organizations in multiple countries. The July 2021 joint advisory attributed the Exchange exploitation campaign to APT40 alongside the DOJ indictment.

### 2024 -- SOHO Router Exploitation

The Australian Cyber Security Centre (ACSC) published an advisory detailing APT40's exploitation of end-of-life SOHO routers as operational relay boxes, enabling the group to proxy traffic through compromised devices and evade network-level detection.

## Technical Capabilities

APT40 maintains a rapid vulnerability exploitation capability, often deploying exploits for newly disclosed flaws in web-facing applications (Exchange, Apache, Atlassian products) before most organizations apply patches. The group combines this with web shell deployment (China Chopper) for persistent access.

Custom backdoors including **BADFLICK** and **MURKYTOP** provide full remote access capabilities. **ScanBox** serves as a reconnaissance framework deployed through watering hole attacks to profile targets before committing more advanced tools.

The group increasingly uses compromised small office/home office (SOHO) routers and IoT devices as operational relay infrastructure, making network-level attribution and blocking more difficult.

## Attribution

In July 2021, the U.S. DOJ indicted four MSS officers affiliated with the Hainan State Security Department for computer intrusions targeting organizations in the United States and abroad. Simultaneously, CISA, NSA, FBI, and international partners (UK, EU, NATO, Australia, New Zealand, Canada, Japan) published a joint advisory (AA21-200A) attributing APT40 activity to the MSS.

The advisory identified the Hainan Xiandun Technology Development Company as an MSS front company used to recruit hackers and manage operations. The unprecedented breadth of international attribution reinforced the confidence level.

## MITRE ATT&CK Profile

**Initial Access**: Exploitation of public-facing applications (T1190) is the primary vector, with spearphishing (T1566.001) and watering hole attacks (T1189) as secondary methods.

**Persistence**: Web shells (T1505.003), scheduled tasks (T1053), and valid accounts (T1078) maintain access.

**Defense Evasion**: Use of compromised SOHO routers as proxy infrastructure (T1090.002), living-off-the-land binaries, and DLL side-loading (T1574.002).

**Credential Access**: OS credential dumping (T1003), credential harvesting from browsers, and pass-the-hash techniques enable lateral movement.

## Sources & References

- [MITRE ATT&CK: APT40](https://attack.mitre.org/groups/G0065/) -- MITRE ATT&CK
- [CISA: Advisory AA21-200A - Chinese State-Sponsored Cyber Operations](https://www.cisa.gov/news-events/cybersecurity-advisories/aa21-200a) -- CISA, 2021-07-19
- [US DOJ: Four Chinese Nationals Charged](https://www.justice.gov/opa/pr/four-chinese-nationals-working-ministry-state-security-charged-global-computer-intrusion) -- US Department of Justice, 2021-07-19
