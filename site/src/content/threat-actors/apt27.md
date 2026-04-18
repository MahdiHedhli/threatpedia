---
name: "APT27"
aliases:
  - "Emissary Panda"
  - "TG-3390"
  - "Iron Tiger"
  - "Bronze Union"
  - "Lucky Mouse"
  - "Group 35"
affiliation: "China"
motivation: "Espionage"
status: active
country: "China"
firstSeen: "2010"
lastSeen: "2024"
targetSectors:
  - "Government"
  - "Technology"
  - "Aerospace & Defense"
  - "Energy & Utilities"
  - "Education"
targetGeographies:
  - "United States"
  - "Middle East"
  - "Southeast Asia"
  - "Europe"
tools:
  - "HyperBro"
  - "PlugX"
  - "SysUpdate"
  - "ZXShell"
  - "China Chopper"
  - "Gh0st RAT"
mitreMappings:
  - techniqueId: "T1190"
    techniqueName: "Exploit Public-Facing Application"
    tactic: "Initial Access"
    notes: "APT27 exploits web-facing applications including SharePoint, Exchange, and MySQL servers."
  - techniqueId: "T1505.003"
    techniqueName: "Server Software Component: Web Shell"
    tactic: "Persistence"
    notes: "Deploys China Chopper and custom web shells on compromised web servers."
  - techniqueId: "T1574.002"
    techniqueName: "Hijack Execution Flow: DLL Side-Loading"
    tactic: "Defense Evasion"
    notes: "Uses DLL side-loading with legitimate signed executables to load HyperBro and other backdoors."
attributionConfidence: A3
attributionRationale: "Attributed to China-nexus actors by multiple cybersecurity vendors including Secureworks, Trend Micro, and Mandiant, based on infrastructure, tooling, and targeting analysis. No government indictment to date."
reviewStatus: "under_review"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "nation-state"
  - "china"
  - "espionage"
  - "apt27"
  - "emissary-panda"
sources:
  - url: "https://attack.mitre.org/groups/G0027/"
    publisher: "MITRE ATT&CK"
    publicationDate: "2025-10-17"
    publisherType: research
    reliability: R1
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa21-200b"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2021-07-19"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.secureworks.com/research/bronze-union"
    publisher: "Secureworks"
    publisherType: vendor
    reliability: R1
    publicationDate: "2017-06-27"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

APT27, also known as Emissary Panda and Lucky Mouse, is a China-nexus threat actor active since at least 2010. The group conducts cyber-espionage operations targeting government, technology, aerospace, energy, and educational organizations across multiple regions, with a focus on the United States, Middle East, and Southeast Asia.

APT27 is distinguished by its preference for exploiting web-facing applications as an initial access vector rather than relying on spearphishing. The group maintains a diverse toolkit mixing custom malware (HyperBro, SysUpdate) with widely shared Chinese-origin tools (PlugX, China Chopper, Gh0st RAT). The group's operational mandate appears centered on strategic intelligence collection aligned with Chinese government priorities, including technology acquisition and geopolitical intelligence.

## Notable Campaigns

### 2015 -- Defense and Aerospace Targeting

APT27 conducted sustained intrusions against U.S. defense contractors and aerospace companies, exfiltrating technical documentation related to military systems and satellite communications. The group used China Chopper web shells deployed on vulnerable SharePoint servers for initial access.

### 2020-2021 -- Microsoft Exchange Exploitation

Following the disclosure of ProxyLogon vulnerabilities (CVE-2021-26855 and related CVEs), APT27 was among multiple Chinese-nexus groups that exploited vulnerable Exchange servers globally. The group deployed HyperBro backdoors and SysUpdate RAT on compromised servers across government and corporate networks.

### 2021-2023 -- SysUpdate Linux Variant Deployment

APT27 expanded its targeting to Linux systems, deploying a Linux variant of the SysUpdate RAT. This development indicated an evolution in the group's capabilities to target cloud infrastructure and Linux-based server environments in addition to traditional Windows targets.

## Technical Capabilities

APT27's preferred initial access method is exploitation of public-facing web applications, including Microsoft SharePoint, Microsoft Exchange, and MySQL database servers. After gaining access, the group deploys web shells (China Chopper, custom ASPX shells) for persistent access.

**HyperBro** is a custom backdoor used by APT27 since at least 2018, providing remote access, keylogging, screen capture, and file management capabilities. It is typically loaded through DLL side-loading using signed legitimate executables. **SysUpdate** is a more recent custom RAT with cross-platform (Windows/Linux) capabilities, modular architecture, and encrypted C2 communications.

The group uses legitimate tools including ProcDump, Mimikatz, and Windows built-in utilities for credential harvesting and lateral movement. APT27 demonstrates proficiency in living-off-the-land techniques, using native Windows tools to blend in with normal administrative activity.

## Attribution

APT27 is attributed to Chinese state-sponsored activity based on infrastructure analysis, tooling overlap with other Chinese-nexus groups, targeting alignment with Chinese strategic interests, and operational patterns consistent with MSS or PLA-affiliated units. Secureworks, Trend Micro, ESET, and Mandiant have independently tracked the group.

CISA advisory AA21-200B identified Chinese state-sponsored actors (including activity consistent with APT27) exploiting public-facing applications. While no government indictment specific to APT27 has been issued, the group's activity falls within the broader pattern of Chinese cyber-espionage operations documented in U.S.-China diplomatic engagements.

## MITRE ATT&CK Profile

**Initial Access**: Exploitation of public-facing applications (T1190) is the primary vector, targeting Exchange, SharePoint, and database servers. Spearphishing attachments (T1566.001) serve as a secondary vector.

**Persistence**: Web shells (T1505.003), scheduled tasks (T1053), and DLL side-loading (T1574.002) maintain persistent access. HyperBro and SysUpdate install as services or scheduled tasks.

**Credential Access**: The group uses OS credential dumping (T1003) via Mimikatz, ProcDump, and custom tools to harvest domain credentials.

**Defense Evasion**: DLL side-loading with signed binaries (T1574.002), process injection (T1055), and indicator removal (T1070) are used to evade security controls.

**Exfiltration**: Data is compressed (T1560) and exfiltrated over C2 channels (T1041) using encrypted HTTPS communications.

## Sources & References

- [MITRE ATT&CK: APT27](https://attack.mitre.org/groups/G0027/) -- MITRE ATT&CK
- [CISA: Advisory AA21-200B](https://www.cisa.gov/news-events/cybersecurity-advisories/aa21-200b) -- CISA, 2021-07-19
- [Secureworks: Bronze Union](https://www.secureworks.com/research/bronze-union) -- Secureworks, 2017-06-27
