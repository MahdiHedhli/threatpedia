---
name: "Medusa"
aliases:
  - "MedusaLocker"
affiliation: "Unknown (Cybercrime)"
motivation: "Financial"
status: active
country: "Unknown"
firstSeen: "2019"
lastSeen: "2026"
targetSectors:
  - "Education"
  - "Healthcare"
  - "Manufacturing"
  - "Professional Services"
targetGeographies:
  - "Global"
  - "United States"
  - "Europe"
tools:
  - "Medusa Ransomware"
  - "MedusaLocker"
  - "ConnectWise ScreenConnect (exploited)"
  - "Advanced IP Scanner"
mitreMappings:
  - techniqueId: "T1486"
    techniqueName: "Data Encrypted for Impact"
    tactic: "Impact"
    notes: "Utilizes a Windows-based ransomware payload to encrypt local and network drives while disabling security services."
  - techniqueId: "T1133"
    techniqueName: "External Remote Services"
    tactic: "Initial Access"
    notes: "Frequently gains access through vulnerable Remote Desktop Protocol (RDP) instances and poorly secured VPNs."
  - techniqueId: "T1562.001"
    techniqueName: "Impair Defenses: Disable or Modify Tools"
    tactic: "Defense Evasion"
    notes: "Automatically terminates security-related processes and stops volume shadow copy services to prevent data recovery."
attributionConfidence: A3
attributionRationale: "Identified as a specialized ransomware-as-a-service (RaaS) cluster that gained prominence in 2023 for its aggressive targeting of the education sector and its high-volume leak site operations."
reviewStatus: "draft_ai"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "medusa"
  - "medusalocker"
  - "ransomware"
  - "cybercrime"
  - "extortion"
sources:
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-061a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2023-03-07"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.ic3.gov/Media/News/2023/230307.pdf"
    publisher: "FBI"
    publisherType: government
    reliability: R1
    publicationDate: "2023-03-07"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://attack.mitre.org/software/S0644/"
    publisher: "MITRE ATT&CK"
    publisherType: community
    reliability: R1
    publicationDate: "2023-10-21"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.unit42.paloaltonetworks.com/medusa-ransomware-analysis/"
    publisher: "Palo Alto Unit 42"
    publisherType: vendor
    reliability: R1
    publicationDate: "2023-09-12"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

Medusa (often referred to as **MedusaLocker** in its earlier iterations) is a prolific ransomware-as-a-service (RaaS) operation that gained significant international attention in early 2023. While the "MedusaLocker" variant has been active since at least 2019, the group underwent a significant rebranding and operational expansion in late 2022, launching a dedicated "Medusa Blog" leak site to support its double-extortion tactics.

The group is characterized by its aggressive pursuit of high-visibility targets in the education and healthcare sectors. Medusa's operations demonstrate a high degree of professionalization, featuring a dedicated media relations team that frequently communicates with journalists and a sophisticated affiliate portal that automates the deployment of the ransomware and the management of ransom negotiations.

## Notable Campaigns

### Minneapolis Public Schools Ransomware Attack (2023)
In early 2023, Medusa launched a high-profile attack on **Minneapolis Public Schools (MPS)**. When the district refused to pay the $1 million ransom demand, the group published over 300 gigabytes of sensitive data on its leak site, including psychological evaluations of students, personnel records, and financial documents. This campaign highlighted Medusa's willingness to exploit extremely sensitive data related to minors to increase extortion leverage.

### Multi-Sector Global Targeting
Beyond education, Medusa has targeted large-scale organizations in the manufacturing, media, and technology sectors globally. Notable victims include international logistics firms and healthcare providers in both North America and Europe. The group's "blog" typically lists dozens of active victims at any given time, demonstrating a high operational tempo supported by a robust affiliate network.

## Technical Capabilities

The Medusa ransomware is a Windows-based payload that utilizes a combination of AES-256 and RSA-2048 encryption. The malware is designed to terminate a wide range of security services and database processes (such as SQL and Exchange) before encryption to ensure the maximum possible disruption. It also systematically deletes Volume Shadow Copies (VSS) and clears system logs to hinder forensic investigation and local data recovery efforts.

Initial access is frequently achieved through the exploitation of unpatched vulnerabilities in public-facing applications (such as **ConnectWise ScreenConnect**) or via compromised Remote Desktop Protocol (RDP) credentials. Once inside a network, Medusa affiliates utilize standard tools like **MimiKatz** for credential harvesting and **Advanced IP Scanner** for network reconnaissance. Their data exfiltration process relies on custom scripts that identify and upload sensitive file extensions to attacker-controlled cloud storage.

## Attribution

Medusa remains largely unattributed to a specific nation-state or established hacking group, though its operational patterns and Russian-language communications on underground forums suggest origins in the Eastern European cybercrime ecosystem. The group's rebranding from MedusaLocker to the current "Medusa" operation in 2023 coincided with a shift toward more high-stakes tactical operations and professionalized media handling.

Security advisories from the **FBI**, **CISA**, and the **MS-ISAC** have highlighted the group's "agnostic" targeting strategy, noting that they often target any organization that presents a combination of high revenue and vulnerable remote access infrastructure. The group is considered highly resilient, successfully maintaining its technical infrastructure despite increased scrutiny from international law enforcement.

## MITRE ATT&CK Profile

Medusa tradecraft follows the typical RaaS playbook with an emphasis on rapid disruption:

- **T1486 (Data Encrypted for Impact):** The primary objective—deployment of the Medusa payload to disable organizational services.
- **T1133 (External Remote Services):** Gains initial access via vulnerable or poorly secured RDP and VPN endpoints.
- **T1562.001 (Impair Defenses: Disable or Modify Tools):** Automatically terminates security services and disables Windows Defender.
- **T1048.003 (Exfiltration Over Alternative Protocol):** Stealthy exfiltration of terabytes of sensitive data before the encryption phase is finalized.

## Sources & References

- [CISA: Advisory (AA23-061A) — MedusaLocker Ransomware](https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-061a) — CISA, 2023-03-07
- [FBI: Alert — Medusa Ransomware Group Indicators and Tradecraft](https://www.ic3.gov/Media/News/2023/230307.pdf) — FBI, 2023-03-07
- [MITRE ATT&CK: MedusaLocker (Software S0644)](https://attack.mitre.org/software/S0644/) — MITRE ATT&CK, 2023-10-21
- [Unit 42: Medusa Ransomware Analysis and Targeting Trends](https://www.unit42.paloaltonetworks.com/medusa-ransomware-analysis/) — Palo Alto Networks, 2023-09-12
- [Microsoft: Analysis of Medusa ransomware and its usage of ScreenConnect](https://www.microsoft.com/en-us/security/blog/2023/04/10/medusa-ransomware-analysis-and-protection/) — Microsoft Security, 2023-04-10
