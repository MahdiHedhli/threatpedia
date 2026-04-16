---
name: "APT29"
aliases:
  - "Cozy Bear"
  - "The Dukes"
  - "SVR"
  - "Nobelium"
  - "Midnight Blizzard"
  - "Dark Halo"
affiliation: "Russia"
motivation: "Espionage"
status: active
country: "Russia"
firstSeen: "2008"
lastSeen: "2026"
targetSectors:
  - "Government"
  - "Diplomatic"
  - "Think Tanks"
  - "Technology"
  - "Healthcare / Vaccine Research"
targetGeographies:
  - "Global"
  - "United States"
  - "Europe"
  - "NATO Member States"
tools:
  - "SUNBURST"
  - "TEARDROP"
  - "WellMess"
  - "GoldMax"
  - "Cobalt Strike"
  - "Envy Scout"
mitreMappings:
  - techniqueId: "T1195.002"
    techniqueName: "Supply Chain Compromise: Compromise Software Supply Chain"
    tactic: "Initial Access"
    notes: "Utilized the SolarWinds build pipeline to distribute the SUNBURST backdoor."
  - techniqueId: "T1484.002"
    techniqueName: "Domain Policy Modification: Domain Trust Modification"
    tactic: "Defense Evasion"
    notes: "Pioneered the 'Golden SAML' technique to bypass MFA and access cloud resources via forged tokens."
  - techniqueId: "T1071.001"
    techniqueName: "Application Layer Protocol: Web Protocols"
    tactic: "Command and Control"
    notes: "Uses highly disciplined C2 infrastructure often masquerading as legitimate administrative services or utilizing look-alike domains."
attributionConfidence: A1
attributionRationale: "Formally attributed to the Russian Foreign Intelligence Service (SVR) by the U.S. and UK governments in 2021 following the SolarWinds investigation."
reviewStatus: "draft_ai"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "apt29"
  - "cozy-bear"
  - "svr"
  - "russia"
  - "solarwinds"
  - "espionage"
sources:
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa21-116a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2021-04-26"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.whitehouse.gov/briefing-room/statements-releases/2021/04/15/fact-sheet-imposing-costs-for-harmful-foreign-activities-by-the-russian-government/"
    publisher: "The White House"
    publisherType: government
    reliability: R1
    publicationDate: "2021-04-15"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.microsoft.com/en-us/security/blog/2021/01/20/deep-dive-into-the-solorigate-second-stage-activation-from-sunburst-to-teardrop-and-raindrop/"
    publisher: "Microsoft Security"
    publisherType: vendor
    reliability: R1
    publicationDate: "2021-01-20"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://attack.mitre.org/groups/G0016/"
    publisher: "MITRE ATT&CK"
    publisherType: community
    reliability: R1
    publicationDate: "2023-10-21"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

APT29, widely known as **Cozy Bear** and **Midnight Blizzard**, is a premier nation-state threat actor operated by the **Russian Foreign Intelligence Service (SVR)**. Active since at least 2008, the group is tasked with collecting strategic intelligence from foreign governments, diplomatic entities, and technology sectors. APT29 is characterized by its extreme operational discipline, its focus on cloud identity exploitation, and its ability to conduct highly stealthy, multi-year campaigns.

Unlike the Russian GRU (APT28), which often engages in loud, disruptive "hack-and-leak" operations, APT29 adheres to a traditional intelligence mandate. They prioritize persistent, undetected access over public signaling. The group gained global attention for its involvement in the **SolarWinds supply chain campaign** and its repeated targeting of the U.S. Democratic National Committee (DNC) and COVID-19 vaccine research facilities.

## Notable Campaigns

### SolarWinds Supply Chain Campaign (2019-2021)
In one of the most sophisticated cyber-espionage operations in history, APT29 compromised the software build pipeline of SolarWinds. By injecting the **SUNBURST** backdoor into digitally signed updates, the group achieved entry into approximately 18,000 organizations, including nine U.S. federal agencies. The campaign showcased the group's ability to operate undetected for over 18 months.

### Targeting of COVID-19 Research (2020)
During the global pandemic, APT29 utilized the **WellMess** and **WellMail** malware families to target organizations involved in COVID-19 vaccine development in Canada, the United Kingdom, and the United States. The operation's objective was to steal proprietary research and clinical trial data, highlighting the group's role in supporting Russia's strategic scientific interests.

## Technical Capabilities

APT29's technical arsenal is distinguished by its use of memory-only malware and cloud-native exploitation techniques. Their primary tools include **TEARDROP** (a custom memory-only Cobalt Strike loader) and **GoldMax** (a sophisticated C2 implant). The group has also mastered the extraction of SAML signing certificates from Active Directory Federation Services (AD FS), enabling the "Golden SAML" attack which allows for persistence in cloud environments (like Office 365) without needing user passwords.

Their operational methodology involves highly curated C2 infrastructure. They frequently use legitimate but compromised websites and cloud services as staging areas for their malware, blending their traffic into normal administrative patterns. Their high degree of professionalization is reflected in the customized nature of their payloads, which are often tailored to the specific security environment of the target.

## Attribution

APT29 is formally attributed with high confidence to the **Russian Foreign Intelligence Service (SVR)**. In April 2021, the U.S. government, alongside the United Kingdom's NCSC, released a joint statement identifying the SVR as the entity behind the SolarWinds campaign and other malicious activities. Previously, the group was often referred to as "The Dukes" or "Cozy Bear" by the security community.

The attribution is based on technical indicators such as the group's preference for cloud identity exploitation (a known SVR tradecraft), overlaps with legacy SVR infrastructure, and the strategic alignment of their targets with Russia's foreign intelligence requirements. The formal attribution was accompanied by significant diplomatic and economic sanctions against Russia.

## MITRE ATT&CK Profile

APT29's techniques are centered on high-fidelity persistence and identity exploitation:

- **T1195.002 (Supply Chain Compromise):** Using trusted third-party software updates to gain widespread initial access.
- **T1484.002 (Domain Trust Modification):** Forging SAML tokens to bypass multi-factor authentication in cloud environments.
- **T1071.001 (Web Protocols):** C2 traffic designed to mimic legitimate HTTPS communication with trusted cloud providers.
- **T1027 (Obfuscated Files or Information):** Extensive use of steganography and custom encryption to hide stage-two payloads and data exfiltration.

## Sources & References

- [CISA: Advisory (AA21-116A) — Russian SVR Targets U.S. and Allied Networks](https://www.cisa.gov/news-events/cybersecurity-advisories/aa21-116a) — CISA, 2021-04-26
- [The White House: Fact Sheet — Imposing Costs for Harmful Foreign Activities by the Russian Government](https://www.whitehouse.gov/briefing-room/statements-releases/2021/04/15/fact-sheet-imposing-costs-for-harmful-foreign-activities-by-the-russian-government/) — The White House, 2021-04-15
- [Microsoft: Deep Dive into SUNBURST, TEARDROP, and Raindrop](https://www.microsoft.com/en-us/security/blog/2021/01/20/deep-dive-into-the-solorigate-second-stage-activation-from-sunburst-to-teardrop-and-raindrop/) — Microsoft Security, 2021-01-20
- [MITRE ATT&CK: APT29 (Group G0016)](https://attack.mitre.org/groups/G0016/) — MITRE ATT&CK, 2023-10-21
- [NCSC UK: Advisory — SVR cyber actors adapt to move to cloud](https://www.ncsc.gov.uk/news/svr-cyber-actors-adapt-to-move-to-cloud) — NCSC UK, 2024-02-26
