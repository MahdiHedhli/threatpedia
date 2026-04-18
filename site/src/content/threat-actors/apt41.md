---
name: "APT41"
aliases:
  - "Double Dragon"
  - "Winnti"
  - "BARIUM"
  - "Wicked Panda"
  - "Brass Typhoon"
affiliation: "China (Ministry of State Security)"
motivation: "Espionage / Financial"
status: active
country: "China"
firstSeen: "2012"
lastSeen: "2025"
targetSectors:
  - "Technology"
  - "Healthcare"
  - "Gaming"
  - "Telecommunications"
  - "Government"
  - "Financial Services"
targetGeographies:
  - "Global"
  - "United States"
  - "Europe"
  - "Asia"
tools:
  - "ShadowPad"
  - "Winnti"
  - "POISONPLUG"
  - "DEADEYE"
  - "KEYPLUG"
  - "Cobalt Strike"
  - "DUSTPAN"
mitreMappings:
  - techniqueId: "T1195.002"
    techniqueName: "Supply Chain Compromise: Compromise Software Supply Chain"
    tactic: "Initial Access"
    notes: "APT41 has conducted multiple supply chain compromises of legitimate software vendors."
  - techniqueId: "T1059.001"
    techniqueName: "Command and Scripting Interpreter: PowerShell"
    tactic: "Execution"
    notes: "Uses PowerShell scripts for payload delivery and post-compromise operations."
  - techniqueId: "T1574.002"
    techniqueName: "Hijack Execution Flow: DLL Side-Loading"
    tactic: "Defense Evasion"
    notes: "DLL side-loading with signed legitimate binaries is a hallmark of APT41 operations."
attributionConfidence: A1
attributionRationale: "Attributed to Chinese MSS-affiliated actors by a September 2020 DOJ indictment of five Chinese nationals and two Malaysian nationals."
reviewStatus: "under_review"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "nation-state"
  - "china"
  - "mss"
  - "espionage"
  - "financial"
  - "apt41"
  - "supply-chain"
sources:
  - url: "https://attack.mitre.org/groups/G0096/"
    publisher: "MITRE ATT&CK"
    publicationDate: "2025-10-17"
    publisherType: research
    reliability: R1
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.justice.gov/opa/pr/seven-international-cyber-defendants-including-apt41-actors-charged-connection-computer"
    publisher: "US Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2020-09-16"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa20-258a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2020-09-14"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.mandiant.com/resources/blog/apt41-dual-espionage-and-cyber-crime-operation"
    publisher: "Mandiant"
    publisherType: vendor
    reliability: R1
    publicationDate: "2019-08-07"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

APT41, also known as Double Dragon and Wicked Panda, is a Chinese state-sponsored threat actor that uniquely conducts both state-directed espionage and financially motivated cybercrime. Attributed to actors affiliated with the **Ministry of State Security (MSS)**, APT41 has been active since at least 2012 and targets organizations across the technology, healthcare, gaming, telecommunications, and government sectors worldwide.

APT41 is distinguished by its dual mandate: conducting espionage operations aligned with Chinese government priorities during business hours, while pursuing financially motivated intrusions (gaming company targeting, cryptocurrency theft, ransomware deployment) outside those hours. The group has executed multiple supply chain compromises of legitimate software vendors, injecting backdoors into products used by millions of end users.

## Notable Campaigns

### 2017 -- CCleaner Supply Chain Compromise

APT41 compromised the build environment of Piriform's CCleaner utility, injecting the ShadowPad backdoor into legitimate software updates. Over 2.3 million users downloaded the trojanized version, though the group selectively targeted a smaller subset of technology and telecommunications companies for follow-on exploitation.

### 2019-2020 -- ASUS Live Update Supply Chain Attack

The group compromised ASUS's Live Update utility, distributing backdoored firmware updates to thousands of ASUS computers. The attack used stolen ASUS digital certificates to sign the malicious updates.

### 2021-2022 -- U.S. State Government Exploitation

APT41 exploited vulnerabilities in public-facing web applications (including Log4j and a zero-day in the USAHerds animal health application) to compromise networks of at least six U.S. state governments. The campaign demonstrated the group's rapid exploitation capabilities and interest in government data.

## Technical Capabilities

APT41's technical capabilities span supply chain compromise, zero-day exploitation, custom malware development, and extensive use of dual-use tools. **ShadowPad** is a modular backdoor platform shared among multiple Chinese threat groups, providing pluggable capabilities for keylogging, screen capture, file management, and credential theft. **KEYPLUG** is a cross-platform (Windows/Linux) backdoor used in recent operations.

The group demonstrates advanced supply chain compromise capabilities, having successfully injected backdoors into the build processes of multiple legitimate software vendors. APT41 also conducts rapid exploitation of newly disclosed vulnerabilities, including Log4Shell (CVE-2021-44228), ProxyLogon, and zero-day vulnerabilities in niche applications.

For financially motivated operations, APT41 has deployed ransomware, conducted cryptocurrency mining, and manipulated virtual gaming currencies in online games.

## Attribution

In September 2020, the U.S. DOJ indicted five Chinese nationals and two Malaysian nationals associated with APT41 operations. The indictment detailed the group's dual espionage/cybercrime mandate and identified specific intrusions. Two of the Malaysian nationals were arrested; the Chinese nationals remain at large.

CISA advisory AA20-258A detailed APT41 exploitation of public-facing applications targeting U.S. government and private-sector networks. Mandiant's comprehensive research has tracked the group since 2012, documenting the evolution of their toolset and operations.

## MITRE ATT&CK Profile

**Initial Access**: Supply chain compromise (T1195.002), exploitation of public-facing applications (T1190), and spearphishing (T1566.001) are primary vectors.

**Execution**: DLL side-loading (T1574.002), PowerShell (T1059.001), and custom loaders deploy backdoors while evading detection.

**Persistence**: ShadowPad and KEYPLUG install as services (T1543.003) or scheduled tasks (T1053). Bootkit-level persistence has been observed in some operations.

**Defense Evasion**: Code signing with stolen certificates (T1553.002), DLL side-loading, process injection (T1055), and rootkit capabilities.

**Impact**: Financial theft, ransomware deployment (T1486), and cryptocurrency mining (T1496) in financially motivated operations.

## Sources & References

- [MITRE ATT&CK: APT41](https://attack.mitre.org/groups/G0096/) -- MITRE ATT&CK
- [US DOJ: APT41 Actors Charged](https://www.justice.gov/opa/pr/seven-international-cyber-defendants-including-apt41-actors-charged-connection-computer) -- US Department of Justice, 2020-09-16
- [CISA: Advisory AA20-258A](https://www.cisa.gov/news-events/cybersecurity-advisories/aa20-258a) -- CISA, 2020-09-14
- [Mandiant: APT41 Dual Espionage and Cybercrime](https://www.mandiant.com/resources/blog/apt41-dual-espionage-and-cyber-crime-operation) -- Mandiant, 2019-08-07
