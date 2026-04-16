---
name: "Wizard Spider"
aliases:
  - "Gold Blackburn"
  - "UNC1878"
  - "ITG23"
affiliation: "Unknown (Russia-based)"
motivation: "Financial"
status: inactive
country: "Russia"
firstSeen: "2016"
lastSeen: "2022"
targetSectors:
  - "Healthcare"
  - "Education"
  - "Finance"
  - "Government"
  - "Manufacturing"
targetGeographies:
  - "Global"
  - "United States"
  - "Europe"
  - "Canada"
tools:
  - "TrickBot"
  - "Ryuk Ransomware"
  - "Conti Ransomware"
  - "BazarLoader"
  - "Empire"
  - "Cobalt Strike"
mitreMappings:
  - techniqueId: "T1566.001"
    techniqueName: "Phishing: Spearphishing Attachment"
    tactic: "Initial Access"
    notes: "Utilized massive, botnet-driven email campaigns to deliver TrickBot and BazarLoader, which served as initial access vectors for high-stakes ransomware operations."
  - techniqueId: "T1486"
    techniqueName: "Data Encrypted for Impact"
    tactic: "Impact"
    notes: "The primary operator behind Ryuk and Conti ransomware, pioneering the 'Big Game Hunting' model of targeting large, revenue-rich organizations."
  - techniqueId: "T1021.002"
    techniqueName: "Remote Services: SMB/Windows Admin Shares"
    tactic: "Lateral Movement"
    notes: "Expertly utilized administrative tools and compromised credentials to move laterally across enterprise networks before deploying ransomware."
attributionConfidence: A1
attributionRationale: "Formally attributed to a structured Russia-based cybercrime syndicate by international law enforcement (Operation Cookie Monster for TrickBot) and major security firms. The group's leadership and infrastructure have been extensively mapped following internal leaks and disruption efforts."
reviewStatus: "draft_ai"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "wizard-spider"
  - "trickbot"
  - "ryuk"
  - "conti"
  - "ransomware"
  - "big-game-hunting"
sources:
  - url: "https://www.justice.gov/opa/pr/justice-department-disrupts-prolific-trickbot-botnet"
    publisher: "US Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2023-09-07"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa22-249a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2021-09-22"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://attack.mitre.org/groups/G0102/"
    publisher: "MITRE ATT&CK"
    publisherType: community
    reliability: R1
    publicationDate: "2023-10-21"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.microsoft.com/en-us/security/blog/2020/10/12/microsoft-and-partners-disrupt-key-infrastructure-of-trickbot-botnet/"
    publisher: "Microsoft Security"
    publisherType: vendor
    reliability: R1
    publicationDate: "2020-10-12"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

Wizard Spider is a highly sophisticated and resilient Russia-based cybercrime syndicate that dominated the ransomware landscape between 2018 and 2022. The group pioneered the **"Big Game Hunting"** model, which involves the targeted, manual deployment of ransomware against large, revenue-rich organizations to demand multi-million dollar ransoms. Wizard Spider is best known for its management of the **TrickBot** botnet and the subsequent development of the **Ryuk** and **Conti** ransomware families.

The group operated like a professional corporation, featuring specialized departments for malware development, network penetration, customer support for victims, and money laundering. Following the internal "ContiLeaks" in early 2022 and increased law enforcement pressure, the group fragmented into several smaller, highly capable successor clusters (such as BlackBasta and Royal), but the core Wizard Spider infrastructure remains one of the most significant chapters in the history of organized cybercrime.

## Notable Campaigns

### The Rise of Ryuk and Healthcare Targeting (2018-2020)
Between late 2018 and 2020, Wizard Spider utilized **Ryuk** ransomware to attack hundreds of organizations, with a particularly aggressive focus on the healthcare and education sectors in the United States. During the height of the COVID-19 pandemic, the group continued to target hospitals, causing significant disruptions to patient care and forcing emergency diversions. These attacks generated hundreds of millions of dollars in illicit revenue and led to a major international law enforcement crackdown.

### The Conti Ransomware Era (2020-2022)
As Ryuk's effectiveness began to wane due to increased technical scrutiny, Wizard Spider transitioned to the **Conti** ransomware platform. Conti introduced a highly efficient "double-extortion" model, where the group not only encrypted the victim's data but also threatened to publish stolen information on its "Conti News" leak site. At its peak, Conti was the world's most active ransomware family, responsible for thousands of successful compromises globally before the group's publicly-declared support for the Russian invasion of Ukraine led to internal collapse.

## Technical Capabilities

Wizard Spider possessed one of the most advanced technical toolsets in the cybercrime ecosystem. Their foundational tool was **TrickBot**, a modular banking trojan that evolved into a versatile multi-stage delivery platform. TrickBot would typically be delivered via phishing, perform initial network harvesting, and then deploy second-stage loaders such as **BazarLoader** or **Empire** to facilitate manual lateral movement by "hands-on-keyboard" attackers.

The group's lateral movement tradecraft was remarkably fast, often achieving domain-wide compromise within hours of initial entry. They utilized a wide range of administrative tools, including **Cobalt Strike**, **PowerShell**, **WMI**, and **AdFind**, to navigate the network and identify the most sensitive data and backup servers. Their ransomware payloads (Ryuk and Conti) were noted for their efficient encryption and their ability to automatically search for and delete Volume Shadow Copies and other local data recovery mechanisms.

## Attribution

Wizard Spider is formally attributed to a Russia-based criminal syndicate. While the group operates with a high degree of technical independence, its leadership has been identified as having close ties to other elite Russian-language groups. In 2023, the U.S. and UK governments announced coordinated sanctions and indictments against several key members of the group's leadership, including those responsible for the management of the **TrickBot** infrastructure.

The internal hierarchy of the group was exposed in 2022 during the "ContiLeaks" event, where a disgruntled affiliate published thousands of internal chat logs. These logs confirmed the group's professionalized structure, its salary-based payment model for developers, and its strategic coordination with Russian intelligence services in some specific contexts. Despite the official "dissolution" of the Conti brand, the core technical team remains active within the Russian cyber-safe-haven.

## MITRE ATT&CK Profile

Wizard Spider's tradecraft represents the pinnacle of professionalized RaaS operations:

- **T1566.001 (Spearphishing Attachment):** Using massive, botnet-driven email campaigns to deliver TrickBot-family loaders.
- **T1059.001 (Command and Scripting Interpreter: PowerShell):** Extensive use of PowerShell for in-memory loaders and network reconnaissance.
- **T1486 (Data Encrypted for Impact):** Development and management of the global Ryuk and Conti ransomware networks.
- **T1021.002 (Remote Services: SMB/Windows Admin Shares):** Rapid manual lateral movement using legitimate administrative protocols.

## Sources & References

- [US Department of Justice: Justice Department Disrupts Prolific TrickBot Botnet](https://www.justice.gov/opa/pr/justice-department-disrupts-prolific-trickbot-botnet) — US Department of Justice, 2023-09-07
- [CISA: Advisory (AA22-249A) — Conti Ransomware Threat](https://www.cisa.gov/news-events/cybersecurity-advisories/aa22-249a) — CISA, 2022-05-19
- [MITRE ATT&CK: Wizard Spider (Group G0102)](https://attack.mitre.org/groups/G0102/) — MITRE ATT&CK, 2023-10-21
- [Microsoft: Analysis of TrickBot Infrastructure and Disruption Efforts](https://www.microsoft.com/en-us/security/blog/2020/10/12/microsoft-and-partners-disrupt-key-infrastructure-of-trickbot-botnet/) — Microsoft Security, 2020-10-12
- [Mandiant: UNC1878 — A deep dive into the Ryuk ransomware operators](https://www.mandiant.com/resources/blog/unc1878-ryuk-ransomware-operators) — Mandiant, 2020-10-28
