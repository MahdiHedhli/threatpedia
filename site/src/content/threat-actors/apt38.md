---
name: "APT38"
aliases:
  - "BlueNoroff"
  - "Stardust Chollima"
  - "BeagleBoyz"
  - "Cobalt Group"
affiliation: "North Korea"
motivation: "Financial"
status: active
country: "North Korea"
firstSeen: "2014"
lastSeen: "2026"
targetSectors:
  - "Financial Services"
  - "Banking"
  - "Cryptocurrency Exchanges"
  - "SWIFT Network"
targetGeographies:
  - "Global"
  - "Southeast Asia"
  - "Latin America"
  - "Africa"
tools:
  - "DYEPACK"
  - "Hermes Ransomware"
  - "ElectricFish"
  - "Contopee"
  - "Boutade"
mitreMappings:
  - techniqueId: "T1566.001"
    techniqueName: "Phishing: Spearphishing Attachment"
    tactic: "Initial Access"
    notes: "Frequently utilizes tailored emails targeted at employees of financial institutions, containing malicious Word or PDF documents."
  - techniqueId: "T1071.001"
    techniqueName: "Application Layer Protocol: Web Protocols"
    tactic: "Command and Control"
    notes: "APT38 backdoors commonly utilize HTTP/S for C2, often masquerading as legitimate administrative traffic to financial services."
  - techniqueId: "T1056.001"
    techniqueName: "Input Capture: Keylogging"
    tactic: "Collection"
    notes: "Utilized extensively in SWIFT-related attacks to capture credentials and monitor operator behavior before executing transactions."
attributionConfidence: A1
attributionRationale: "Formally attributed to the Reconnaissance General Bureau (RGB) of North Korea by the U.S. Department of Justice and global intelligence agencies following multiple heists against the SWIFT network."
reviewStatus: "draft_ai"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "apt38"
  - "bluenoroff"
  - "north-korea"
  - "financial-crime"
  - "swift-heist"
sources:
  - url: "https://www.justice.gov/opa/pr/three-north-korean-military-hackers-indicted-wide-ranging-scheme-commit-cyberattacks-and"
    publisher: "US Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2021-02-17"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa20-239a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2020-08-26"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.mandiant.com/resources/blog/apt38-details-on-new-north-korean-regime-backed-threat-group"
    publisher: "Mandiant"
    publisherType: vendor
    reliability: R1
    publicationDate: "2018-10-03"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://attack.mitre.org/groups/G0082/"
    publisher: "MITRE ATT&CK"
    publisherType: community
    reliability: R1
    publicationDate: "2023-10-21"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

APT38, also known as **BlueNoroff** and **BeagleBoyz**, is a state-sponsored threat actor operated by the **Reconnaissance General Bureau (RGB)** of North Korea. Unlike many other advanced persistent threat groups that focus on espionage, APT38's primary mandate is the generation of foreign currency for the North Korean regime. To achieve this, the group conducts massive, high-stakes cyber-heists targeting financial institutions, central banks, and the global **SWIFT** (Society for Worldwide Interbank Financial Telecommunication) network.

The group is characterized by its high technical proficiency, its patience during reconnaissance phases, and its willingness to execute destructive attacks (such as deploying the **KillDisk** wiper) to mask its tracks following a successful theft. APT38 is widely considered one of the most organized and impactful financial threat groups active today, having attempted to steal over $1 billion from institutions globally.

## Notable Campaigns

### Bangladesh Bank Heist (2016)
In one of the most famous cyber-heists in history, APT38 attempted to steal $951 million from the Bangladesh Bank's account at the Federal Reserve Bank of New York. By compromising the bank's SWIFT terminal and utilizing the **DYEPACK** malware to manipulate transaction reports, the group successfully exfiltrated $81 million to accounts in the Philippines before an error in a routing instruction alerted officials.

### Targeting of Cryptocurrency Exchanges
In recent years, APT38 has shifted much of its focus toward cryptocurrency exchanges and decentralized finance (DeFi) platforms. The group utilizes highly tailored spear-phishing campaigns (targeting blockchain developers) and malicious versions of cryptocurrency trading software to exfiltrate digital assets, which are subsequently laundered through various tumbling and mixing services to support the North Korean state treasury.

## Technical Capabilities

APT38 utilizes a specialized toolkit designed specifically for financial operations. Their flagship malware, **DYEPACK**, is a sophisticated suite of tools capable of intercepting and modifying SWIFT messages in real-time, allowing the group to hide their fraudulent transactions from bank operators. They also utilize **ElectricFish**, a custom tunnel tool designed for rapid data exfiltration, and variants of the **Hermes ransomware** to cause disruption and hide their activities.

The group's operational tradecraft is highly methodical. They frequently spend months inside a target's network, performing detailed reconnaissance of the institution's interbank transfer workflows and operational procedures. They demonstrate a high degree of adaptability, often utilizing zero-day exploits or newly discovered vulnerabilities to gain initial access before moving laterally using legitimate administrative tools to avoid detection.

## Attribution

APT38 is formally attributed with high confidence to the **North Korean Reconnaissance General Bureau (RGB)**. In 2021, the **U.S. Department of Justice** unsealed a formal indictment against three North Korean military hackers—Jon Chang Hyok, Kim Il, and Park Jin Hyok—linking them to the activities of APT38 and the broader Lazarus Group.

The attribution is based on technical analysis of the group's custom code, its infrastructure (which overlaps with other North Korean state-sponsored clusters), and its clear focus on generating revenue for the regime. Multiple international agencies, including the FBI, CISA, and the UK's NCSC, have issued joint advisories identifying APT38 as a primary actor in the DPRK's global cyber-theft operations.

## MITRE ATT&CK Profile

APT38's techniques are centered on stealthy initial access and internal reconnaissance of financial systems:

- **T1566.001 (Phishing: Spearphishing Attachment):** Delivering malicious documents to bank employees to gain initial footholds.
- **T1071.001 (Web Protocols):** C2 communication designed to mimic standard banking or administrative web traffic.
- **T1056.001 (Input Capture: Keylogging):** Capturing credentials for SWIFT terminals and other sensitive financial systems.
- **T1485 (Data Destruction):** Using wiping malware (like KillDisk or variants) to sabotage recovery and destroy forensic evidence after a theft.

## Sources & References

- [US Department of Justice: Three North Korean Military Hackers Indicted in Wide-Ranging Scheme](https://www.justice.gov/opa/pr/three-north-korean-military-hackers-indicted-wide-ranging-scheme-commit-cyberattacks-and) — US Department of Justice, 2021-02-17
- [CISA: Advisory (AA20-239A) — FastCash 2.0: North Korea's BeagleBoyz Robbing Banks](https://www.cisa.gov/news-events/cybersecurity-advisories/aa20-239a) — CISA, 2020-08-26
- [Mandiant: APT38 — Details on New North Korean Regime-Backed Threat Group](https://www.mandiant.com/resources/blog/apt38-details-on-new-north-korean-regime-backed-threat-group) — Mandiant, 2018-10-03
- [MITRE ATT&CK: APT38 (Group G0082)](https://attack.mitre.org/groups/G0082/) — MITRE ATT&CK, 2023-10-21
- [FBI: Alert — North Korean State-Sponsored Cyber Actors Target Cryptocurrency Exchanges](https://www.fbi.gov/news/press-releases/fbi-identifies-lazarus-group-cyber-actors-as-responsible-for-theft-of-crypto-assets) — FBI, 2022-04-14
