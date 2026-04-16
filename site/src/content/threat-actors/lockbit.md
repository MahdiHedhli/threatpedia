---
name: "LockBit"
aliases:
  - "LockBit 2.0"
  - "LockBit 3.0 (LockBit Black)"
  - "Bitwise Spider"
affiliation: "Unknown (Russia-based)"
motivation: "Financial"
status: active
country: "Russia"
firstSeen: "2019"
lastSeen: "2026"
targetSectors:
  - "Finance"
  - "Healthcare"
  - "Manufacturing"
  - "Government"
  - "Critical Infrastructure"
targetGeographies:
  - "Global"
  - "United States"
  - "United Kingdom"
  - "Germany"
  - "Australia"
tools:
  - "LockBit Ransomware"
  - "StealBit"
  - "Cobalt Strike"
  - "MimiKatz"
  - "SoftPerfect Network Scanner"
mitreMappings:
  - techniqueId: "T1486"
    techniqueName: "Data Encrypted for Impact"
    tactic: "Impact"
    notes: "Utilizes a highly optimized ransomware payload noted for its extremely fast encryption speed and its ability to target both Windows and Linux/ESXi environments."
  - techniqueId: "T1133"
    techniqueName: "External Remote Services"
    tactic: "Initial Access"
    notes: "Affiliates frequently gain initial access via compromised VPN and RDP credentials acquired from initial access brokers."
  - techniqueId: "T1048.003"
    techniqueName: "Exfiltration Over Alternative Protocol"
    tactic: "Exfiltration"
    notes: "Uses the custom StealBit tool to automatically exfiltrate large volumes of data to attacker-controlled storage before the encryption phase."
attributionConfidence: A2
attributionRationale: "Identified as a Russia-based cybercrime syndicate by international law enforcement (Operation Cronos). While multiple individuals have been indicted, the group operates as a large-scale ransomware-as-a-service (RaaS) platform with diverse affiliates."
reviewStatus: "draft_ai"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "lockbit"
  - "ransomware"
  - "cybercrime"
  - "raas"
  - "operation-cronos"
sources:
  - url: "https://www.nationalcrimeagency.gov.uk/news/nca-leads-international-takedown-of-lockbit-ransomware-group"
    publisher: "UK National Crime Agency"
    publisherType: government
    reliability: R1
    publicationDate: "2024-02-20"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-165a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2023-06-14"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://attack.mitre.org/software/S0504/"
    publisher: "MITRE ATT&CK"
    publisherType: community
    reliability: R1
    publicationDate: "2023-10-21"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.fbi.gov/news/press-releases/justice-department-announces-charges-against-russian-national-for-lockbit-ransomware-attacks"
    publisher: "FBI"
    publisherType: government
    reliability: R1
    publicationDate: "2024-05-07"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

LockBit is a prolific ransomware-as-a-service (RaaS) operation that surfaced in late 2019. It has since evolved into the world's most dominant ransomware family, accounting for an estimated 25% of all ransomware attacks globally at its peak in 2023. The group is characterized by its highly professionalized affiliate program, its relentless focus on technical innovation, and its aggressive "double-extortion" tactics.

The group's operational model revolves around its automated leak site and administrative portal, which affiliates use to manage victims and negotiate ransoms. In February 2024, an international law enforcement coalition led by the **UK National Crime Agency (NCA)** and the **FBI** executed **Operation Cronos**, which successfully disrupted LockBit's core infrastructure. Despite this, the group's administrators have attempted to relaunch operations, demonstrating significant resilience.

## Notable Campaigns

### The Attack on Royal Mail (2023)
In January 2023, a LockBit affiliate launched a major attack on the **UK Royal Mail**, disrupting its international export services for several weeks. The group exfiltrated sensitive operational data and demanded a multi-million dollar ransom. Royal Mail's refusal to pay led to the publication of the stolen data, highlighting LockBit's willingness to target high-visibility critical infrastructure to gain leverage.

### Multi-Sector Global Surge (2022-2024)
Throughout late 2022 and 2023, LockBit targeted a series of high-profile global entities, including the **Industrial and Commercial Bank of China (ICBC)**, **Boeing**, and the **City of Oakland**. These attacks demonstrated the group's ability to compromise large-scale, well-defended networks across diverse sectors. The ICBC attack, in particular, disrupted the settlement of U.S. Treasury trades, illustrating the potential for ransomware to cause systemic financial instability.

## Technical Capabilities

LockBit is noted for its high-performance encryption engine, which the group claims is the fastest in the industry. The ransomware supports multiple platforms, including Windows, Linux, and VMware ESXi, and features advanced self-spreading capabilities via Group Policy Objects (GPOs) and the exploitation of common vulnerabilities. Their custom data exfiltration tool, **StealBit**, is designed to automatically identify and upload sensitive file types to the group's storage servers.

The group's technical innovation also extends to its "Bug Bounty" program—the first of its kind for a criminal organization—where they offered payments to security researchers for finding vulnerabilities in their ransomware code or infrastructure. In its latest iteration, **LockBit 3.0 (LockBit Black)**, the group utilized code shared with the now-defunct BlackMatter family, further enhancing its obfuscation and anti-analysis features.

## Attribution

LockBit is widely believed to be operated by a core team of Russian-language developers based in or around Russia. The group maintains strict rules prohibiting its affiliates from targeting organizations in the Commonwealth of Independent States (CIS), a common indicator of safe haven status within Russian borders. As part of **Operation Cronos**, the U.S. and UK identified the primary administrator of the group as **Dmitry Khoroshev** (alias "LockBitSupp").

Law enforcement efforts have also led to the arrests and indictments of several high-level affiliates and developers in the United States, Canada, and Europe. Despite these actions, the group's primary development team remains at large, continuing to update their software and infrastructure to evade ongoing disruption attempts by global security agencies.

## MITRE ATT&CK Profile

LockBit's RaaS model means that TTPs can vary by affiliate, but consistent patterns include:

- **T1486 (Data Encrypted for Impact):** The deployment of the optimized LockBit payload for rapid, large-scale encryption.
- **T1048.003 (Exfiltration Over Alternative Protocol):** Use of the StealBit tool for automated data theft before encryption.
- **T1562.001 (Impair Defenses: Disable or Modify Tools):** The malware's ability to automatically terminate over 1,000 security-related processes and services.
- **T1133 (External Remote Services):** Exploiting unpatched vulnerabilities in VPNs and gaining access via compromised RDP credentials.

## Sources & References

- [UK National Crime Agency: NCA Leads International Takedown of LockBit Ransomware Group](https://www.nationalcrimeagency.gov.uk/news/nca-leads-international-takedown-of-lockbit-ransomware-group) — UK National Crime Agency, 2024-02-20
- [CISA: Advisory (AA23-165A) — StopRansomware: LockBit Ransomware](https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-165a) — CISA, 2023-06-14
- [MITRE ATT&CK: LockBit (Software S0504)](https://attack.mitre.org/software/S0504/) — MITRE ATT&CK, 2023-10-21
- [FBI: Justice Department Announces Charges Against Russian National for LockBit Attacks](https://www.fbi.gov/news/press-releases/justice-department-announces-charges-against-russian-national-for-lockbit-ransomware-attacks) — FBI, 2024-05-07
- [Microsoft: Analysis of LockBit 3.0 and its technical evolution](https://www.microsoft.com/en-us/security/blog/2022/07/27/the-shifting-landscape-of-lockbit-3-0/) — Microsoft Security, 2022-07-27
