---
name: "APT40"
aliases:
  - "Leviathan"
  - "Gingham Panda"
  - "Kryptonite Panda"
  - "Periscope"
  - "TEMP.Periscope"
affiliation: "China"
motivation: "Espionage"
status: active
country: "China"
firstSeen: "2013"
lastSeen: "2026"
targetSectors:
  - "Maritime"
  - "Defense"
  - "Engineering"
  - "Government"
  - "Aerospace"
  - "Education"
targetGeographies:
  - "Global"
  - "United States"
  - "South China Sea Regions"
  - "Australia"
  - "Germany"
tools:
  - "ScanBox"
  - "BADFLICK"
  - "MURKYTOP"
  - "PhotoCheck"
  - "China Chopper"
  - "Derusbi"
mitreMappings:
  - techniqueId: "T1189"
    techniqueName: "Drive-by Compromise"
    tactic: "Initial Access"
    notes: "Utilizes the ScanBox reconnaissance framework on compromised websites to profile targets and deliver stage-two malware."
  - techniqueId: "T1133"
    techniqueName: "External Remote Services"
    tactic: "Initial Access"
    notes: "Frequent exploitation of vulnerabilities in internet-facing servers, including Microsoft Exchange, to gain entry into victim networks."
  - techniqueId: "T1071.001"
    techniqueName: "Application Layer Protocol: Web Protocols"
    tactic: "Command and Control"
    notes: "APT40 backdoors frequently utilize HTTP/S for C2 communication, often incorporating legitimate public cloud services for data exfiltration."
attributionConfidence: A1
attributionRationale: "Formally attributed to the Hainan State Security Department (HSSD) of the Chinese Ministry of State Security (MSS) by the U.S. Department of Justice through the 2021 indictment of four hackers."
reviewStatus: "draft_ai"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "apt40"
  - "leviathan"
  - "china"
  - "mss"
  - "maritime-espionage"
  - "hainan"
sources:
  - url: "https://www.justice.gov/opa/pr/four-chinese-nationals-working-ministry-state-security-charged-global-computer-intrusion"
    publisher: "US Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2021-07-19"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa21-200a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2021-07-19"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.fireeye.com/blog/threat-research/2018/03/suspected-chinese-espionage-group-targeting-maritime-and-engineering-sectors.html"
    publisher: "FireEye (Mandiant)"
    publisherType: vendor
    reliability: R1
    publicationDate: "2018-03-16"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://attack.mitre.org/groups/G0065/"
    publisher: "MITRE ATT&CK"
    publisherType: community
    reliability: R1
    publicationDate: "2023-10-21"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

APT40, also known as **Leviathan** and **Gingham Panda**, is a highly active nation-state threat actor operating on behalf of the **Chinese Ministry of State Security (MSS)**. Based primarily in the Hainan Province, the group focuses on maritime-related intelligence, targeting defense, engineering, and manufacturing organizations involved in South China Sea territorial and maritime development. Their mission is to support China's "One Belt One Road" initiative and other strategic regional objectives.

Active since at least 2013, APT40 is characterized by its sophisticated reconnaissance tradecraft and its ability to rapidly weaponize zero-day or N-day vulnerabilities in perimeter infrastructure. The group gained global attention in 2021 following a coordinated indictment by the U.S. Department of Justice, which identified the group as a component of the Hainan State Security Department.

## Notable Campaigns

### Targeting of the Maritime Supply Chain (2017-2018)
In a sustained campaign documented by security researchers, APT40 targeted over two dozen maritime and engineering firms across the globe. The group's primary objective was to steal proprietary technical data related to autonomous underwater vehicles (AUVs), submarine technologies, and maritime surface ship design. They utilized spear-phishing lures disguised as legitimate requests for information or RFP documents to gain initial access to employee workstations.

### Exploitation of Microsoft Exchange Vulnerabilities (2021)
APT40 was identified as a primary actor in the widespread exploitation of **ProxyLogon** and **ProxyShell** vulnerabilities in Microsoft Exchange servers. The group used these exploits to gain instant administrative access to the email environments of government and commercial organizations in Europe and North America, subsequently deploying web shells (like China Chopper) to move laterally and exfiltrate sensitive strategic communications.

## Technical Capabilities

APT40 possesses a diverse and frequently updated toolkit. A hallmark of their tradecraft is the use of the **ScanBox** framework—a browser-based reconnaissance tool that helps them profile a target's system, software, and patch levels without triggering traditional file-based alerts. Once a high-value target is identified, they deploy stage-two implants such as **BADFLICK**, **MURKYTOP**, and **PhotoCheck**.

The group's operational security is robust, often involving the use of legitimate but compromised infrastructure located in the victim's own country to host their command-and-control (C2) servers. They also frequently hide their traffic within standard administrative protocols (HTTP/S, DNS) and utilize multi-stage loading processes to evade automated sandbox analysis.

## Attribution

APT40 is formally attributed with high confidence to the **Hainan State Security Department (HSSD)**, a regional branch of the Chinese Ministry of State Security (MSS). In July 2021, the **U.S. Department of Justice** unsealed an indictment against four Chinese nationals—Ding Xiaoyang, Cheng Qingmin, Zhu Yunzhou, and Wu Shurong—linked to the group's operations. The indictment confirmed that the hackers operated through front companies, such as the Hainan Xiandun Technology Development Company.

Collaborative analysis from international agencies including the FBI, CISA, and the UK's NCSC supported this attribution, highlighting the linkage between the group's operational targets and the specific strategic interests handled by the Hainan provincial government. The group's activities align perfectly with Beijing's maritime security and economic dominance goals.

## MITRE ATT&CK Profile

APT40's techniques focus on sophisticated initial access and internal reconnaissance:

- **T1189 (Drive-by Compromise):** Using ScanBox on compromised websites to profile and infect high-value visitors.
- **T1133 (External Remote Services):** Exploiting vulnerabilities in internet-facing enterprise software (Exchange, SharePoint) to bypass firewalls.
- **T1071.001 (Web Protocols):** C2 communication masquerading as standard HTTPS traffic, often utilizing legitimate cloud infrastructure for staging.
- **T1016 (System Network Configuration Discovery):** Extensive pre-attack reconnaissance to identify specific vulnerable configurations within a target's internal network.

## Sources & References

- [US Department of Justice: Four Chinese Nationals Working with MSS Charged with Computer Intrusion](https://www.justice.gov/opa/pr/four-chinese-nationals-working-ministry-state-security-charged-global-computer-intrusion) — US Department of Justice, 2021-07-19
- [CISA: Advisory (AA21-200A) — Tactics, Techniques, and Procedures of Indicted APT40 Actors](https://www.cisa.gov/news-events/cybersecurity-advisories/aa21-200a) — CISA, 2021-07-19
- [Mandiant: Suspected Chinese Espionage Group Targeting Maritime and Engineering Sectors](https://www.fireeye.com/blog/threat-research/2018/03/suspected-chinese-espionage-group-targeting-maritime-and-engineering-sectors.html) — FireEye (Mandiant), 2018-03-16
- [MITRE ATT&CK: APT40 (Group G0065)](https://attack.mitre.org/groups/G0065/) — MITRE ATT&CK, 2023-10-21
- [Microsoft: HAFNIUM and APT40 targeting of Exchange Servers](https://www.microsoft.com/en-us/security/blog/2021/03/02/hafnium-targeting-exchange-servers/) — Microsoft Security, 2021-03-02
