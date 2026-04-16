---
name: "BlackCat"
aliases:
  - "ALPHV"
  - "Noberus"
  - "AlphaVM"
affiliation: "Unknown (Russia-based)"
motivation: "Financial"
status: active
country: "Russia"
firstSeen: "2021"
lastSeen: "2026"
targetSectors:
  - "Healthcare"
  - "Finance"
  - "Technology"
  - "Manufacturing"
  - "Retail"
targetGeographies:
  - "Global"
  - "United States"
  - "Europe"
  - "Australia"
tools:
  - "BlackCat Ransomware (Rust)"
  - "Exmatter"
  - "Munchkin"
  - "MimiKatz"
  - "Cobalt Strike"
mitreMappings:
  - techniqueId: "T1486"
    techniqueName: "Data Encrypted for Impact"
    tactic: "Impact"
    notes: "Utilizes a highly customizable Rust-based ransomware to encrypt files across Windows, Linux, and VMware ESXi environments."
  - techniqueId: "T1566.001"
    techniqueName: "Phishing: Spearphishing Attachment"
    tactic: "Initial Access"
    notes: "Frequently gains initial access through targeted phishing emails containing malicious attachments or links to credential harvesting sites."
  - techniqueId: "T1071.001"
    techniqueName: "Application Layer Protocol: Web Protocols"
    tactic: "Command and Control"
    notes: "The BlackCat payload and its associated exfiltration tools frequently utilize HTTP/S for C2 communication and data exfiltration to cloud storage."
attributionConfidence: A3
attributionRationale: "Widely assessed as a Russia-based cybercrime syndicate and a successor to the DarkSide/BlackMatter ransomware operations, though no formal individuals have been indicted as of early 2024."
reviewStatus: "draft_ai"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "blackcat"
  - "alphv"
  - "ransomware"
  - "cybercrime"
  - "raas"
  - "rust"
sources:
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-353a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2023-12-19"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.fbi.gov/news/press-releases/fbi-announces-disruption-of-blackcat-ransomware-group"
    publisher: "FBI"
    publisherType: government
    reliability: R1
    publicationDate: "2023-12-19"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.mandiant.com/resources/blog/alphv-blackcat-ransomware-rust"
    publisher: "Mandiant"
    publisherType: vendor
    reliability: R1
    publicationDate: "2021-12-08"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://attack.mitre.org/software/S0664/"
    publisher: "MITRE ATT&CK"
    publisherType: community
    reliability: R1
    publicationDate: "2023-10-21"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

BlackCat, also known as **ALPHV**, is a highly sophisticated ransomware-as-a-service (RaaS) operation that emerged in late 2021. It is notable for being the first major ransomware family to be written in the **Rust** programming language, which provides high performance and makes it easier for the developers to compile the malware for various operating systems, including Windows, Linux, and VMware ESXi.

Assessments from the cybersecurity community link BlackCat to the defunct DarkSide and BlackMatter ransomware groups, suggesting it is a rebrand or a successor operation run by the same core developers. The group employs a triple-extortion tactic, where they not only encrypt files but also threaten to leak stolen data and launch distributed denial-of-service (DDoS) attacks unless their ransom demands—often in the millions of dollars—are met.

## Notable Campaigns

### Change Healthcare Ransomware Attack (2024)
In February 2024, BlackCat claimed responsibility for a massive cyberattack against Change Healthcare, a unit of UnitedHealth Group. The attack caused widespread disruption to the U.S. healthcare payment system, preventing thousands of pharmacies and hospitals from processing claims and prescriptions. This campaign highlighted the group's willingness to target critical infrastructure sectors, leading to a renewed focus from U.S. federal law enforcement.

### Targeting of Global 2000 Firms
Since its inception, BlackCat has targeted hundreds of high-revenue organizations across the globe. Notable victims include companies in the energy, finance, and legal sectors. The group's affiliates are known for their deep reconnaissance within victim networks, often spending weeks exfiltrating terabytes of sensitive data before deploying the final ransomware payload to maximize their extortion leverage.

## Technical Capabilities

The defining technical feature of BlackCat is its **Rust-based** architecture. Rust is a memory-safe language that allows the developers to create highly stable and efficient malware that is resistant to traditional signature-based detection. The ransomware is highly customizable, allowing affiliates to specify which directories to skip, which services to stop, and which credentials to use for lateral movement.

For data exfiltration, the group frequently utilizes **Exmatter**, a custom tool designed to upload specific file types to various cloud storage providers (such as Mega.nz and various S3 buckets). They also utilize **Munchkin**, a specialized tool for automating the deployment of the ransomware across an entire domain. Their lateral movement TTPs involve the standard usage of **MimiKatz**, **Cobalt Strike**, and legitimate administrative tools like PsExec and Remote Desktop Protocol (RDP).

## Attribution

BlackCat is widely believed to be an evolution of the **DarkSide** and **BlackMatter** ransomware gangs, both of which were linked to Russia-based cybercriminals. Following the high-profile Colonial Pipeline attack by DarkSide, the group ostensibly "retired" before resurfacing as BlackMatter, and later as ALPHV/BlackCat. This attribution is based on significant code overlaps, shared C2 infrastructure patterns, and consistent Russian-language communications on underground forums.

In December 2023, the **FBI** announced a technical disruption of the BlackCat infrastructure, providing a decryption tool to dozens of victims and seizing several of the group's leak sites. Despite this, the group remained active, moving to new domains and continuing their operations, demonstrating a high degree of resilience and operational depth.

## MITRE ATT&CK Profile

BlackCat's operations are defined by their hybrid use of custom malware and legitimate administrative utilities:

- **T1486 (Data Encrypted for Impact):** Deployment of the customizable Rust-based ransomware to disable business operations.
- **T1021.001 (Remote Services: Remote Desktop Protocol):** Using stolen credentials to move laterally and gain control over domain controllers.
- **T1048.003 (Exfiltration Over Alternative Protocol):** Leveraging Exmatter to exfiltrate volumes of data to attacker-controlled cloud storage.
- **T1562.001 (Impair Defenses: Disable or Modify Tools):** Automatically stopping security services and deleting Volume Shadow Copies (VSS) before encryption begins.

## Sources & References

- [CISA: Advisory (AA23-353A) — ALPHV/BlackCat Ransomware Indicators of Compromise](https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-353a) — CISA, 2023-12-19
- [FBI: Press Release — FBI Announces Disruption of BlackCat Ransomware Group](https://www.fbi.gov/news/press-releases/fbi-announces-disruption-of-blackcat-ransomware-group) — FBI, 2023-12-19
- [Mandiant: ALPHV (BlackCat) Ransomware — A New Rust-Based Challenger](https://www.mandiant.com/resources/blog/alphv-blackcat-ransomware-rust) — Mandiant, 2021-12-08
- [MITRE ATT&CK: BlackCat (Software S0664)](https://attack.mitre.org/software/S0664/) — MITRE ATT&CK, 2023-10-21
- [Microsoft: BlackCat ransomware — A specialized look at its Rust implementation](https://www.microsoft.com/en-us/security/blog/2022/06/13/the-many-lives-of-blackcat-ransomware/) — Microsoft Security, 2022-06-13
