---
name: "FIN7"
aliases:
  - "Carbanak (affiliated)"
  - "ITG14"
  - "Carbon Spider"
  - "ELBRUS"
affiliation: "Unknown (Russia/Ukraine-based)"
motivation: "Financial"
status: active
country: "Russia"
firstSeen: "2013"
lastSeen: "2026"
targetSectors:
  - "Retail"
  - "Hospitality"
  - "Gaming"
  - "Finance"
  - "Professional Services"
targetGeographies:
  - "Global"
  - "United States"
  - "Europe"
  - "Australia"
tools:
  - "Carbanak"
  - "Lizar"
  - "GRIFFON"
  - "IceID"
  - "Cobalt Strike"
  - "MimiKatz"
mitreMappings:
  - techniqueId: "T1566.001"
    techniqueName: "Phishing: Spearphishing Attachment"
    tactic: "Initial Access"
    notes: "The group's hallmark is the use of highly tailored spear-phishing emails containing malicious Word or RTF documents to infect specific employees in finance roles."
  - techniqueId: "T1557.001"
    techniqueName: "Adversary-in-the-Middle: LLMNR/NBT-NS Poisoning and SMB Relay"
    tactic: "Credential Access"
    notes: "Utilizes internal network sniffing and relay techniques to escalate privileges and move laterally toward systems that process credit card transactions."
  - techniqueId: "T1534"
    techniqueName: "Internal Spearphishing"
    tactic: "Lateral Movement"
    notes: "Frequently utilizes compromised internal accounts to send phishing emails to other employees, significantly increasing the success rate of internal movement."
attributionConfidence: A1
attributionRationale: "Formally attributed to a structured cybercrime organization following the 2018 arrests of Fedir Hladyr, Dmytro Fedorov, and Andrii Kolpakov, who were senior members of the group."
reviewStatus: "draft_ai"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "fin7"
  - "carbanak"
  - "cybercrime"
  - "pos-theft"
  - "credit-card-theft"
  - "retail-targeting"
sources:
  - url: "https://www.justice.gov/opa/pr/three-members-high-level-international-cybercrime-group-fin7-custody-role-targeting-more-100"
    publisher: "US Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2018-08-01"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.fbi.gov/news/press-releases/fbi-announces-arrests-and-sentencing-of-fin7-hackers"
    publisher: "FBI"
    publisherType: government
    reliability: R1
    publicationDate: "2021-04-16"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.mandiant.com/resources/blog/fin7-evolution-cybercrime-group"
    publisher: "Mandiant"
    publisherType: vendor
    reliability: R1
    publicationDate: "2021-08-31"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://attack.mitre.org/groups/G0046/"
    publisher: "MITRE ATT&CK"
    publisherType: community
    reliability: R1
    publicationDate: "2023-10-21"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

FIN7 is a highly organized and financially motivated cybercrime syndicate that has been active since at least 2013. The group is widely considered one of the most prolific threat actors in the history of retail-focused cybercrime, having stolen millions of credit and debit card numbers from thousands of business locations worldwide. FIN7 operates like a professional software development organization, utilizing its own front companies (such as "Combi Security") to recruit unsuspecting IT professionals to support its malicious operations.

The group is characterized by its high technical proficiency and its use of the **Carbanak** malware suite. While they initially focused on Point-of-Sale (POS) theft and banking heists, they have since expanded their operations to include ransomware-as-a-service (RaaS) and data extortion, frequently collaborating with other Russian-language cybercrime clusters.

## Notable Campaigns

### The Massive POS Heist Era (2015-2018)
In its most famous phase of activity, FIN7 compromised the POS systems of over 100 U.S. companies across the retail, restaurant, and hospitality sectors. Targeted organizations included Arby's, Chipotle, Red Robin, and Emerald Queen Hotel & Casino. By utilizing tailored spear-phishing emails to infect back-office employees, the group gained access to the networks that managed credit card transactions, successfully stealing an estimated 15 million card records which were subsequently sold on illicit marketplaces like Joker's Stash.

### Expansion into Ransomware and Access Brokering
Starting in 2020, FIN7 transitioned much of its infrastructure toward supporting ransomware operations. They have been linked to the deployment of **REvil (Sodinokibi)**, **DarkSide**, and **BlackMatter** ransomware. The group leverages its long-standing initial access capabilities to find high-value targets, which they then compromise for data extortion or hand off to dedicated ransomware affiliates. This shift illustrates the group's ability to adapt its business model to the most profitable sectors of the cybercrime economy.

## Technical Capabilities

FIN7 possesses a highly specialized and frequently updated malware arsenal. Their primary backdoor, **Carbanak** (also used by the related Carbanak group), is a modular implant capable of screen recording, keylogging, and remote administration. They also utilize advanced JavaScript and PowerShell-based droppers like **GRIFFON** to infect targets while maintaining a low-file-based signature to evade traditional antivirus software.

The group's operational tradecraft is remarkably professional. They frequently utilize "front" Legitimate Security companies to perform reconnaissance on their targets, a technique that allows them to perform extensive pre-attack research without triggering suspicion. Once inside a network, they demonstrate elite lateral movement skills, often utilizing legitimate administrative tools like **PowerShell**, **WMI**, and **PsExec** to traverse the domain and identify the most sensitive financial data repositories.

## Attribution

FIN7 is attributed with high confidence to a structured criminal organization primarily composed of Russian and Ukrainian nationals. In a major law enforcement breakthrough in 2018, the **U.S. Department of Justice** announced the arrests of three key members of the group—Fedir Hladyr, Dmytro Fedorov, and Andrii Kolpakov. These individuals were identified as technical managers and systems administrators for the syndicate's infrastructure.

Further investigative work by the FBI and private security firms has revealed the group's internal hierarchy, which included specialized departments for malware development, phishing lure creation, and money laundering. Despite these arrests, the core leadership of FIN7 remains active, and the group has continued to launch new campaigns and evolve its technical tradecraft from the safety of Russian territory.

## MITRE ATT&CK Profile

FIN7's tradecraft is centered on stealthy initial access and internal financial reconnaissance:

- **T1566.001 (Phishing: Spearphishing Attachment):** Delivering highly customized lures (often disguised as resumes or customer complaints) to infect financial staff.
- **T1059.001 (Command and Scripting Interpreter: PowerShell):** Extensive use of PowerShell for memory-resident stage-one loaders and lateral movement.
- **T1003 (OS Credential Dumping):** Methodically harvesting administrative and service account credentials to gain access to POS management systems.
- **T1534 (Internal Spearphishing):** Leveraging compromised internal email accounts to gain the trust of other employees and spread deeper into the organization.

## Sources & References

- [US Department of Justice: Three Members of High-Level International Cybercrime Group FIN7 in Custody](https://www.justice.gov/opa/pr/three-members-high-level-international-cybercrime-group-fin7-custody-role-targeting-more-100) — US Department of Justice, 2018-08-01
- [FBI: Press Release — FBI Announces Arrests and Sentencing of FIN7 Hackers](https://www.fbi.gov/news/press-releases/fbi-announces-arrests-and-sentencing-of-fin7-hackers) — FBI, 2021-04-16
- [Mandiant: FIN7 — The Evolution of a Prolific Cybercrime Group](https://www.mandiant.com/resources/blog/fin11-email-campaigns-to-ransomware) — Mandiant, 2021-08-31
- [MITRE ATT&CK: FIN7 (Group G0046)](https://attack.mitre.org/groups/G0046/) — MITRE ATT&CK, 2023-10-21
- [Proofpoint: Analysis of FIN7's recent JavaScript-based toolset](https://www.proofpoint.com/us/blog/threat-insight/fin7-continues-thrive-despite-arrests-and-sentencings) — Proofpoint, 2022-05-18
- [Microsoft: FIN7 (ELBRUS) — Analysis of recent ransomware affiliation](https://www.microsoft.com/en-us/security/blog/2022/05/23/fin7-powering-up-how-a-prolific-cybercrime-group-turned-to-ransomware/) — Microsoft Security, 2022-05-23
