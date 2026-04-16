---
name: "APT27"
aliases:
  - "Emissary Panda"
  - "Iron Tiger"
  - "LuckyMouse"
  - "Bronze Union"
  - "TG-3390"
affiliation: "China"
motivation: "Espionage"
status: active
country: "China"
firstSeen: "2010"
lastSeen: "2026"
targetSectors:
  - "Government"
  - "Technology"
  - "Energy"
  - "Aerospace"
  - "Manufacturing"
  - "Gaming"
targetGeographies:
  - "Global"
  - "United States"
  - "Germany"
  - "Middle East"
  - "Southeast Asia"
tools:
  - "SysUpdate"
  - "HyperBro"
  - "PlugX"
  - "Gh0st RAT"
  - "PandaBanker"
  - "MimiKatz"
mitreMappings:
  - techniqueId: "T1133"
    techniqueName: "External Remote Services"
    tactic: "Initial Access"
    notes: "Frequently exploits vulnerabilities in externally facing servers (e.g., SharePoint, Exchange) to gain initial entry."
  - techniqueId: "T1574.002"
    techniqueName: "Hijack Execution Flow: DLL Side-Loading"
    tactic: "Persistence"
    notes: "The group extensively uses DLL side-loading to execute custom loaders like HyperBro while masquerading as legitimate signed binaries."
  - techniqueId: "T1071.001"
    techniqueName: "Application Layer Protocol: Web Protocols"
    tactic: "Command and Control"
    notes: "APT27's custom RATs often utilize HTTP/S for stealthy C2 communication, sometimes incorporating legitimate cloud services for DNS."
attributionConfidence: A2
attributionRationale: "Consistently linked to Chinese state interests by global security agencies, including the German BfV and numerous threat intelligence firms (CrowdStrike, Secureworks)."
reviewStatus: "draft_ai"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "apt27"
  - "emissary-panda"
  - "china"
  - "espionage"
  - "lucky-mouse"
sources:
  - url: "https://www.verfassungsschutz.de/SharedDocs/publikationen/DE/cyber-it-sicherheit/2022-01-cyberbrief-1-2022.pdf"
    publisher: "BfV (German Federal Office for the Protection of the Constitution)"
    publisherType: government
    reliability: R1
    publicationDate: "2022-01-26"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.secureworks.com/research/bronze-union"
    publisher: "Secureworks"
    publisherType: vendor
    reliability: R1
    publicationDate: "2019-02-27"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://attack.mitre.org/groups/G0027/"
    publisher: "MITRE ATT&CK"
    publisherType: community
    reliability: R1
    publicationDate: "2023-10-21"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.trendmicro.com/vinfo/us/security/news/cyber-attacks/iron-tiger-apt3-updates-toolkit-with-sysupdate-malware-variant"
    publisher: "Trend Micro"
    publisherType: vendor
    reliability: R1
    publicationDate: "2022-08-04"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

APT27, also known as **Emissary Panda** and **LuckyMouse**, is a sophisticated nation-state threat actor attributed to China. Active since at least 2010, the group conducts long-term cyber-espionage operations targeting government entities, defense contractors, and technology firms worldwide. Their primary objective is the collection of strategic intelligence and intellectual property that aligns with China's long-term economic and geopolitical goals, such as the Belt and Road Initiative.

The group is characterized by its high technical proficiency and its ability to adapt its toolset. APT27 frequently utilizes a mixture of custom-developed malware and publicly available offensive security tools, often leveraging **DLL side-loading** and the exploitation of vulnerabilities in popular enterprise software (like Microsoft Exchange and SharePoint) to achieve their objectives.

## Notable Campaigns

### Targeting of the German Commercial Sector (2021-2022)
In early 2022, the German Federal Office for the Protection of the Constitution (BfV) issued a public warning regarding APT27's targeting of German companies. The group exploited vulnerabilities in **AdSelfService Plus** and other enterprise management software to gain initial access, subsequently deploying the **HyperBro** backdoor to maintain long-term presence and exfiltrate proprietary data from the manufacturing and technology sectors.

### Hacking of Regional Government Entities
APT27 has a consistent history of targeting regional government bodies in the Middle East and Southeast Asia. These operations often focus on sensitive diplomatic communications and policy documents. The group is known for its patience, sometimes remaining dormant within a network for months to avoid detection by automated security systems.

## Technical Capabilities

The group maintains a diverse and evolving malware arsenal. Their signature tool is **HyperBro**, a custom modular backdoor that supports various plugins for file management, credential theft, and remote shell execution. More recently, they have transitioned to the **SysUpdate** malware family, which utilizes advanced obfuscation and multi-stage loading processes to evade modern Endpoint Detection and Response (EDR) solutions.

APT27's operational methodology relies heavily on **DLL side-loading**, where they use a legitimate, digitally signed executable to load a malicious DLL. This technique allows their payloads to inherit the trust of the legitimate process, bypassing signature-based detection. They also frequently use **MimiKatz** for credential harvesting and **Gh0st RAT** for basic remote administration.

## Attribution

APT27 is attributed with high confidence to the Chinese state, although the specific military or intelligence unit remains undisclosed by most public sources. The group's targets (government, aerospace, and big data) and its operational hours (consistent with the UTC+8 time zone) strongly suggest Chinese origin.

The German **BfV** and other European intelligence agencies have explicitly linked the "LuckyMouse" and "Emissary Panda" clusters to Chinese state espionage. Furthermore, the group's focus on targets relevant to the Belt and Road Initiative and its usage of malware variants (like PlugX) shared among other Chinese APT groups further solidify this attribution.

## MITRE ATT&CK Profile

APT27's operations are defined by their focus on persistence and stealthy lateral movement:

- **T1133 (External Remote Services):** Exploiting VPNs and web-facing servers to bypass the network perimeter.
- **T1574.002 (DLL Side-Loading):** Using legitimate programs to execute malicious code to avoid detection.
- **T1003.001 (OS Credential Dumping: LSASS Memory):** Utilizing MimiKatz and other tools to extract administrative credentials from memory.
- **T1071.001 (Web Protocols):** C2 communication masquerading as standard HTTPS traffic, often utilizing cloud-based staging areas.

## Sources & References

- [BfV (German Intelligence): Cyber Brief 1/2022 — APT27 Targeting German Companies](https://www.verfassungsschutz.de/SharedDocs/publikationen/DE/cyber-it-sicherheit/2022-01-cyberbrief-1-2022.pdf) — BfV, 2022-01-26
- [Secureworks: BRONZE UNION — Analysis of Emissary Panda's Operations](https://www.secureworks.com/research/bronze-union) — Secureworks, 2019-02-27
- [MITRE ATT&CK: APT27 (Group G0027)](https://attack.mitre.org/groups/G0027/) — MITRE ATT&CK, 2023-10-21
- [Trend Micro: Iron Tiger (APT27) Updating Toolkit with SysUpdate Malware](https://www.trendmicro.com/vinfo/us/security/news/cyber-attacks/iron-tiger-apt3-updates-toolkit-with-sysupdate-malware-variant) — Trend Micro, 2022-08-04
- [ESET: LuckyMouse — Exploiting the Windows CryptoAPI vulnerability](https://www.welivesecurity.com/2020/03/10/luckymouse-exploiting-windows-cryptoapi-vulnerability/) — ESET WeLiveSecurity, 2020-03-10
