---
name: "APT32"
aliases:
  - "OceanLotus"
  - "SeaLotus"
  - "APT-C-00"
  - "Canvas Cyclone"
  - "Ocean Buffalo"
  - "Cobalt Kitty"
affiliation: "Vietnam (assessed state-sponsored)"
motivation: "Espionage"
status: active
country: "Vietnam"
firstSeen: "2014"
lastSeen: "2024"
targetSectors:
  - "Government"
  - "Media"
  - "Civil Society"
  - "Manufacturing"
  - "Technology"
  - "Automotive"
targetGeographies:
  - "Vietnam"
  - "Southeast Asia"
  - "United States"
  - "Philippines"
  - "Cambodia"
  - "Laos"
tools:
  - "KERRDOWN"
  - "METALJACK"
  - "PHOREAL"
  - "SOUNDBITE"
  - "Denis backdoor"
  - "Cobalt Strike"
mitreMappings:
  - techniqueId: "T1566.001"
    techniqueName: "Spearphishing Attachment"
    tactic: "Initial Access"
    confidence: confirmed
    evidence: "APT32 consistently delivers macro-laden Office documents and self-extracting archives via spearphishing emails targeting Vietnamese-language recipients."
  - techniqueId: "T1189"
    techniqueName: "Drive-by Compromise"
    tactic: "Initial Access"
    confidence: confirmed
    evidence: "The group operates strategic web compromises and watering hole attacks against Vietnamese news sites and community portals to deliver payloads."
  - techniqueId: "T1059.005"
    techniqueName: "Visual Basic"
    tactic: "Execution"
    confidence: confirmed
    evidence: "APT32 embeds malicious VBA macros in lure documents that download and execute secondary-stage payloads including KERRDOWN and Cobalt Strike beacons."
  - techniqueId: "T1053.005"
    techniqueName: "Scheduled Task"
    tactic: "Persistence"
    confidence: confirmed
    evidence: "Scheduled tasks maintain persistence of backdoors including PHOREAL and Denis across reboots on compromised hosts."
  - techniqueId: "T1071.001"
    techniqueName: "Web Protocols"
    tactic: "Command and Control"
    confidence: confirmed
    evidence: "APT32 backdoors communicate over HTTP and HTTPS to attacker-controlled infrastructure, blending with legitimate web traffic to evade detection."
attributionConfidence: A3
attributionRationale: "Multiple independent security firms including Mandiant (Google Threat Intelligence), ESET, and Cybereason have assessed APT32 as a Vietnam-linked, state-sponsored group based on targeting consistent with Vietnamese government intelligence priorities, infrastructure overlap, and Vietnamese-language artifacts in tooling. No formal government indictment or Western government cybersecurity advisory specifically naming APT32 has been issued as of this writing."
reviewStatus: "draft_ai"
generatedBy: "dangermouse-bot"
generatedDate: 2026-05-13
tags:
  - "nation-state"
  - "vietnam"
  - "espionage"
  - "apt32"
  - "oceanlotus"
  - "southeast-asia"
sources:
  - url: "https://attack.mitre.org/groups/G0050/"
    publisher: "MITRE ATT&CK"
    publisherType: research
    reliability: R1
    publicationDate: "2025-10-17"
    accessDate: "2026-05-13"
    archived: false
  - url: "https://cloud.google.com/blog/topics/threat-intelligence/cyber-espionage-apt32/"
    publisher: "Google Cloud (Mandiant)"
    publisherType: vendor
    reliability: R1
    publicationDate: "2017-05-14"
    accessDate: "2026-05-13"
    archived: false
  - url: "https://www.welivesecurity.com/2018/03/13/oceanlotus-ships-new-backdoor/"
    publisher: "ESET"
    publisherType: vendor
    reliability: R1
    publicationDate: "2018-03-13"
    accessDate: "2026-05-13"
    archived: false
  - url: "https://www.cybereason.com/blog/operation-cobalt-kitty-apt-lifecycle"
    publisher: "Cybereason"
    publisherType: vendor
    reliability: R2
    publicationDate: "2017-08-03"
    accessDate: "2026-05-13"
    archived: false
  - url: "https://www.state.gov/reports/2022-country-reports-on-human-rights-practices/vietnam/"
    publisher: "US Department of State"
    publisherType: government
    reliability: R1
    publicationDate: "2023-03-20"
    accessDate: "2026-05-13"
    archived: false
---

## Executive Summary

APT32, widely tracked as OceanLotus, is a Vietnam-linked cyber-espionage group assessed by multiple independent security organizations as operating in support of Vietnamese state intelligence interests. Active since at least 2014, the group conducts targeted intrusion campaigns against government agencies, media organizations, civil society groups, and foreign businesses operating in Vietnam and across Southeast Asia.

APT32 is notable for an aggressive targeting posture that includes Vietnamese domestic dissidents, foreign journalists covering Vietnamese affairs, and multinational corporations with commercial interests in the region. The US Department of State has documented Vietnamese government harassment and targeting of journalists, activists, and civil society members consistent with the observed APT32 victim profile. The group's toolset combines commodity frameworks such as Cobalt Strike with custom-developed malware including KERRDOWN, METALJACK, and PHOREAL. Strategic web compromise and spearphishing remain the group's primary initial access vectors.

## Notable Campaigns

### 2017 — Operation Cobalt Kitty

Cybereason documented a sustained APT32 intrusion into a global corporation with operations in Asia, designated Operation Cobalt Kitty. The attackers maintained persistence for approximately six months, deploying custom backdoors including Denis and PHOREAL alongside Cobalt Strike. The operation demonstrated the group's capability to operate undetected within enterprise environments for extended periods while conducting sustained data collection.

### 2018–2019 — Civil Society and Media Targeting

ESET documented OceanLotus malware delivery against Vietnamese-language targets, including macOS and Windows payloads distributed through phishing-style lures and disguised archives. Public reporting from Mandiant, ESET, MITRE ATT&CK, and the US Department of State supports a conservative description of APT32 targeting that includes media and civil society without relying on an additional Amnesty International attribution.

### 2020 — COVID-19 Intelligence Collection

In early 2020, Mandiant attributed a spearphishing campaign against the Wuhan City Government and Chinese Ministry of Emergency Management to APT32, assessing the group was collecting intelligence on China's handling of the COVID-19 outbreak. This represented a departure from the group's typical dissident and civil society focus toward a rival government target.

## Technical Capabilities

APT32 operates a multi-stage infection chain that typically begins with a spearphishing attachment — a macro-laden Office document or a self-extracting archive using double-extension filename deception. Execution of the initial stage downloads a secondary loader such as KERRDOWN, which decrypts and loads a final-stage backdoor in memory.

**KERRDOWN** is a custom downloader that retrieves and executes payloads from attacker-controlled servers. **METALJACK** is a .NET loader that uses shellcode injection to execute in memory. **PHOREAL** (also known as Rizzo) is a backdoor communicating over named pipes that supports file operations, shell execution, and screen capture. **Denis** is a memory-only backdoor that stores components in the Windows registry to evade file-based detection.

The group extensively uses Cobalt Strike for post-exploitation, including lateral movement, credential access, and C2 communications. APT32 also deploys web shells on externally facing servers to establish alternative persistence channels.

On macOS, the group delivers backdoors disguised as documents or applications via zip archives. ESET documented macOS-specific payloads with capabilities mirroring the Windows toolset, indicating deliberate cross-platform development investment.

## Attribution

Attribution of APT32 to Vietnam is based on convergent indicators across multiple independent investigations. The group's targeting pattern — Vietnamese dissidents, foreign journalists covering Vietnamese affairs, companies with commercial interests in Vietnam, and neighboring governments including Cambodia and Laos — aligns with collection priorities consistent with Vietnamese state intelligence organs.

Infrastructure and tooling overlap across campaigns tracked by Mandiant, ESET, and Cybereason corroborates a single threat actor rather than disparate groups. Vietnamese-language artifacts appear in malware samples, and operational scheduling patterns are consistent with Indochina Standard Time (UTC+7). The US Department of State's 2022 Country Reports on Human Rights Practices documents Vietnamese government harassment and surveillance of journalists, bloggers, and activists, consistent with the targeting profile of APT32 activity described by security researchers.

No Western government has issued a formal public cybersecurity attribution or indictment specifically naming APT32. The assessment rests on private-sector convergence and targeting alignment rather than formal government confirmation.

## MITRE ATT&CK Profile

**Initial Access**: APT32 uses spearphishing attachments (T1566.001) as the primary vector, with Vietnamese-language Office lures containing malicious macros. The group also conducts strategic web compromise and watering hole attacks (T1189) against high-value target communities.

**Execution**: Malicious VBA macros (T1059.005) execute downloader stages from within Office documents. Windows Script Host and PowerShell appear in later infection stages.

**Persistence**: Scheduled tasks (T1053.005), registry run keys (T1547.001), and web shells (T1505.003) maintain access across sessions and reboots.

**Defense Evasion**: APT32 uses process injection (T1055) and reflective DLL loading to execute payloads in memory, avoiding file-based detection. The Denis backdoor stores components in the registry rather than on disk.

**Command and Control**: Backdoors communicate over HTTP/HTTPS (T1071.001) to attacker-controlled domains. The group rotates infrastructure frequently to reduce takedown impact.

## Sources & References

- [MITRE ATT&CK: APT32 (G0050)](https://attack.mitre.org/groups/G0050/) — MITRE ATT&CK, 2025-10-17
- [Google Cloud (Mandiant): APT32 and the Threat to Global Enterprises](https://cloud.google.com/blog/topics/threat-intelligence/cyber-espionage-apt32/) — Google Cloud (Mandiant), 2017-05-14
- [ESET: OceanLotus Ships New Backdoor](https://www.welivesecurity.com/2018/03/13/oceanlotus-ships-new-backdoor/) — ESET, 2018-03-13
- [Cybereason: Operation Cobalt Kitty APT Lifecycle](https://www.cybereason.com/blog/operation-cobalt-kitty-apt-lifecycle) — Cybereason, 2017-08-03
- [US Department of State: 2022 Country Reports on Human Rights Practices — Vietnam](https://www.state.gov/reports/2022-country-reports-on-human-rights-practices/vietnam/) — US Department of State, 2023-03-20
