---
name: "Wizard Spider"
aliases:
  - "GRIM SPIDER"
  - "UNC1878"
  - "TEMP.MixMaster"
  - "Gold Blackburn"
affiliation: "Cybercriminal (Russian)"
motivation: "Financial"
status: inactive
country: "Russia"
firstSeen: "2016"
lastSeen: "2024"
targetSectors:
  - "Healthcare"
  - "Government"
  - "Education"
  - "Financial Services"
  - "Manufacturing"
targetGeographies:
  - "Global"
  - "United States"
  - "Europe"
tools:
  - "TrickBot"
  - "Conti"
  - "Ryuk"
  - "BazarLoader"
  - "Anchor"
  - "Diavol"
  - "Cobalt Strike"
mitreMappings:
  - techniqueId: "T1486"
    techniqueName: "Data Encrypted for Impact"
    tactic: "Impact"
    notes: "Operates Ryuk and Conti ransomware for file encryption and extortion."
  - techniqueId: "T1059.001"
    techniqueName: "Command and Scripting Interpreter: PowerShell"
    tactic: "Execution"
    notes: "Uses PowerShell scripts for Cobalt Strike deployment and lateral movement."
  - techniqueId: "T1055"
    techniqueName: "Process Injection"
    tactic: "Defense Evasion"
    notes: "TrickBot and BazarLoader use process injection to evade detection."
attributionConfidence: A1
attributionRationale: "Multiple members indicted and sanctioned. The February 2022 Conti Leaks exposed internal communications confirming Russian-based operations. UK NCA and U.S. sanctions identified key members."
reviewStatus: "draft_ai"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "cybercriminal"
  - "russia"
  - "ransomware"
  - "wizard-spider"
  - "trickbot"
  - "conti"
sources:
  - url: "https://attack.mitre.org/groups/G0102/"
    publisher: "MITRE ATT&CK"
    publicationDate: "2025-10-17"
    publisherType: research
    reliability: R1
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa21-265a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2021-09-22"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://home.treasury.gov/news/press-releases/jy1256"
    publisher: "US Department of the Treasury"
    publisherType: government
    reliability: R1
    publicationDate: "2023-02-09"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

Wizard Spider is a Russian cybercriminal group responsible for the TrickBot botnet, Conti ransomware, and Ryuk ransomware operations. Active since at least 2016, the group operated one of the most prolific and financially damaging cybercriminal enterprises until Conti's dissolution in mid-2022 following the leak of internal communications. Wizard Spider is estimated to have extorted hundreds of millions of dollars from victims worldwide.

The group operated a sophisticated organizational structure with specialized teams for malware development, infrastructure management, negotiation, and money laundering. The February 2022 "Conti Leaks" -- triggered by a member's response to the Russia-Ukraine war -- exposed internal chat logs, source code, and operational details, providing unprecedented visibility into ransomware group operations.

## Notable Campaigns

### 2018-2021 -- Ryuk Ransomware Operations

Wizard Spider (operating as GRIM SPIDER) deployed Ryuk ransomware against enterprise and healthcare targets, demanding ransoms ranging from $200,000 to over $14 million. Ryuk was delivered through TrickBot infections and was among the first ransomware families to conduct targeted "big game hunting."

### 2020-2022 -- Conti Ransomware Operations

Conti replaced Ryuk as Wizard Spider's primary ransomware, operating as a RaaS with a large affiliate network. Conti accumulated over 700 victims and was one of the most active ransomware operations. The group targeted healthcare organizations during the COVID-19 pandemic and attacked the Costa Rican government (May 2022), which declared a national state of emergency.

### 2016-2022 -- TrickBot Botnet

The TrickBot botnet served as the primary distribution and access platform for Wizard Spider's operations, with an estimated 1 million infected devices at its peak. TrickBot evolved from a banking trojan into a modular malware platform used for reconnaissance, credential theft, and ransomware deployment.

## Technical Capabilities

Wizard Spider maintained a mature malware development organization. **TrickBot** provided modular capabilities including banking credential theft, network reconnaissance, and ransomware deployment. **BazarLoader** served as a stealthier successor for high-value target access. **Anchor** framework provided an advanced persistent backdoor for longer-duration operations.

**Conti** ransomware used multi-threaded AES encryption for fast network-wide deployment and operated with a dedicated negotiation team, data leak site, and cryptocurrency laundering infrastructure. The Conti Leaks revealed the group employed over 100 people in various roles.

## Attribution

U.S. and UK authorities have identified and sanctioned multiple Wizard Spider members. The U.S. Treasury sanctioned TrickBot/Conti-associated individuals in February 2023, and the UK's NCA participated in the investigation. The Conti Leaks provided extensive evidence of Russian-based operations, including chat logs identifying members by pseudonym and real identity.

## MITRE ATT&CK Profile

**Initial Access**: TrickBot/BazarLoader infections via phishing (T1566.001), exploitation of public-facing applications (T1190), and access broker purchases (T1078).

**Execution**: PowerShell (T1059.001), WMI (T1047), and Cobalt Strike beacons.

**Impact**: Ransomware encryption (T1486), data theft for double extortion, shadow copy deletion (T1490), and service disruption (T1489).

## Sources & References

- [MITRE ATT&CK: Wizard Spider](https://attack.mitre.org/groups/G0102/) -- MITRE ATT&CK
- [CISA: Advisory AA21-265A - Conti Ransomware](https://www.cisa.gov/news-events/cybersecurity-advisories/aa21-265a) -- CISA, 2021-09-22
- [US Treasury: TrickBot/Conti Sanctions](https://home.treasury.gov/news/press-releases/jy1256) -- US Department of the Treasury, 2023-02-09
