---
name: "Evil Corp"
aliases:
  - "GOLD SOUTHFIELD"
  - "Indrik Spider"
  - "UNC2165"
affiliation: "Russia"
motivation: "Financial"
status: "active"
firstSeen: "2009"
lastSeen: "2026-03"
country: "Russia"
targetSectors:
  - "Financial"
  - "Manufacturing"
  - "Media"
  - "Healthcare"
targetGeographies:
  - "United States"
  - "Europe"
  - "Global"
tools:
  - "Dridex"
  - "BitPaymer"
  - "WastedLocker"
  - "Hades"
  - "Macaw"
attributionConfidence: "A1"
attributionRationale: "High-fidelity attribution based on US Treasury (OFAC) sanctions and DOJ indictments against known leadership, linking the group directly to the Dridex and WastedLocker operations."
reviewStatus: "under_review"
generatedBy: "penfold-bot"
generatedDate: 2026-04-14
tags:
  - "financially-motivated"
  - "cybercrime"
  - "russia"
  - "ransomware"
sources:
  - url: "https://attack.mitre.org/groups/G0096/"
    publisher: "MITRE ATT&CK"
    publisherType: "research"
    reliability: "R1"
    publicationDate: "2025-10-17"
    accessDate: "2026-04-14"
    archived: false
  - url: "https://home.treasury.gov/news/press-releases/sm845"
    publisher: "US Department of the Treasury"
    publisherType: "government"
    reliability: "R1"
    publicationDate: "2019-12-05"
    accessDate: "2026-04-14"
    archived: false
  - url: "https://www.crowdstrike.com/blog/indrik-spider-shifting-from-dridex-to-bitpaymer/"
    publisher: "CrowdStrike"
    publisherType: "vendor"
    reliability: "R1"
    publicationDate: "2018-12-05"
    accessDate: "2026-04-14"
    archived: false
---

## Executive Summary
Evil Corp (also tracked as GOLD SOUTHFIELD and Indrik Spider) is one of the oldest, wealthiest, and most sophisticated Russian cybercrime syndicates in the world. Operating since at least 2009, Evil Corp originally focused on developing the highly successful **Dridex** banking trojan, which allowed them to steal hundreds of millions of dollars from financial institutions globally. In later years, as the cybercrime landscape shifted, the group transitioned into running the highly lucrative **BitPaymer** and **WastedLocker** ransomware operations.

## Notable Campaigns
- **Dridex Banking Fraud:** Throughout the 2010s, Evil Corp's Dridex trojan infected computers in over 40 countries, resulting in massive corporate bank fraud and the theft of an estimated $100+ million.
- **Garmin WastedLocker Incident (2020):** Evil Corp purportedly deployed its WastedLocker ransomware against Garmin, causing a massive global outage of the company's GPS and aviation services and extorting a reported $10 million ransom.
- **Sanctions Evasion:** Following severe US Treasury sanctions in 2019, Evil Corp essentially engaged in a branding shell game, rapidly altering their ransomware payloads (creating Hades, Phoenix CryptoLocker, and Macaw Locker) to obscure their identity and continue receiving illicit payments from victims fearful of violating US sanctions.

## Technical Capabilities
Evil Corp develops highly advanced proprietary malware. Their capstone achievement was Dridex, an extremely modular and stealthy banking trojan that utilized the Windows API heavily for persistence and injection. As they pivoted to ransomware, they tailored their deployments specifically for massive enterprise environments (so-called "Big Game Hunting"). They frequently gained initial access via the **SocGholish** (FakeUpdates) framework. Once inside, they typically disable enterprise endpoint protection tools using custom kernel drivers before manually deploying their ransomware payload (like WastedLocker or Macaw) across the environment.

## Attribution
The US Department of the Treasury's Office of Foreign Assets Control (OFAC) explicitly sanctioned Evil Corp in 2019, naming its alleged leader, Maksim Yakubets. While primarily a financially motivated operation, the US Treasury noted that Yakubets and Evil Corp had occasionally provided technical assistance directly to the Russian Federal Security Service (FSB) and Russian government, demonstrating the blurred lines between Russian state intelligence and major domestic cybercrime syndicates.

## Sources & References
- US Treasury Sanctions on Evil Corp
- Mandiant Threat Intelligence on UNC2165 (Evil Corp Evolution)
- MITRE ATT&CK Group G0116
