---
name: "Cl0p"
aliases:
  - "TA505"
  - "Lace Tempest"
  - "FIN11"
  - "UN0969"
affiliation: "Unknown (Russia-based)"
motivation: "Financial"
status: active
country: "Russia"
firstSeen: "2014"
lastSeen: "2026"
targetSectors:
  - "Finance"
  - "Healthcare"
  - "Technology"
  - "Education"
  - "Legal"
targetGeographies:
  - "Global"
  - "United States"
  - "Canada"
  - "Europe"
tools:
  - "ClOp Ransomware"
  - "TrueBot"
  - "FlawedAmmyy"
  - "SDBOT"
  - "Cobalt Strike"
mitreMappings:
  - techniqueId: "T1190"
    techniqueName: "Exploit Public-Facing Application"
    tactic: "Initial Access"
    notes: "Historically successful at mass-exploiting zero-day vulnerabilities in file transfer appliances like MOVEit, Accellion FTA, and GoAnywhere MFT."
  - techniqueId: "T1566.001"
    techniqueName: "Phishing: Spearphishing Attachment"
    tactic: "Initial Access"
    notes: "TA505 (the cluster associated with Cl0p) frequently utilizes massive email volume containing malicious attachments to deliver loaders like FlawedAmmyy."
  - techniqueId: "T1048.003"
    techniqueName: "Exfiltration Over Alternative Protocol"
    tactic: "Exfiltration"
    notes: "In recent campaigns, the group has shifted toward pure data extortion, exfiltrating terabytes of data via custom scripts before threatening public disclosure."
attributionConfidence: A2
attributionRationale: "Consistently linked to Russia-based cybercrime clusters (TA505/FIN11) by major security vendors and law enforcement agencies following its highly publicized mass exploitation campaigns."
reviewStatus: "draft_ai"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "cl0p"
  - "ta505"
  - "ransomware"
  - "moveit-exploitation"
  - "cybercrime"
  - "extortion"
sources:
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-158a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2023-06-07"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.fbi.gov/news/press-releases/fbi-announces-disruption-of-cl0p-infrastructure"
    publisher: "FBI"
    publisherType: government
    reliability: R1
    publicationDate: "2023-06-16"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.mandiant.com/resources/blog/clop-ransomware-mass-exploitation"
    publisher: "Mandiant"
    publisherType: vendor
    reliability: R1
    publicationDate: "2023-06-01"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://attack.mitre.org/software/S0611/"
    publisher: "MITRE ATT&CK"
    publisherType: community
    reliability: R1
    publicationDate: "2023-10-21"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

Cl0p (or **ClOp**) is a prolific Russia-based ransomware gang that has evolved into one of the most successful data extortion syndicates in operation. The group is closely associated with the **TA505** and **FIN11** threat actor clusters and has been active in various forms since at least 2014. Cl0p is characterized by its shift away from traditional host-by-host encryption toward mass exploitation of **zero-day vulnerabilities in Managed File Transfer (MFT)** solutions, allowing them to compromise hundreds of organizations simultaneously.

The group operates on a ransomware-as-a-service (RaaS) model and maintains a high-volume data leak site where they name and shame victims who refuse to pay. Cl0p's operational methodology involves high-speed data exfiltration followed by aggressive negotiation tactics, including direct contact with victim executives and public announcements of the "exclusive" nature of the stolen data.

## Notable Campaigns

### MOVEit Transfer Mass Exploitation (2023)
In May 2023, Cl0p executed a globally impactful campaign by exploiting a zero-day SQL injection vulnerability in the **MOVEit Transfer** software (CVE-2023-34362). The group successfully compromised the file transfer servers of hundreds of organizations, including government agencies (such as the U.S. Department of Energy), major technology firms, and healthcare providers. The campaign resulted in the theft of personal information belonging to millions of individuals, cementing Cl0p's reputation for high-volume data theft.

### Accellion and GoAnywhere MFT Campaigns
Prior to the MOVEit campaign, Cl0p used similar tactics against other MFT solutions. In late 2020 and early 2021, the group exploited zero-day vulnerabilities in the **Accellion File Transfer Appliance (FTA)**, and in early 2023, they exploited a flaw in **GoAnywhere MFT (CVE-2023-0669)**. These campaigns demonstrated a transition in the group's strategy toward "extortion-only" attacks, where they skip the encryption phase entirely if they have successfully exfiltrated enough sensitive data.

## Technical Capabilities

Cl0p utilizes a modular suite of malware. Their flagship ransomware payload is a variant of the **CryptoMix** family, which features advanced anti-analysis techniques and the ability to disable security processes before encryption. However, their true technical edge lies in their ability to identify and weaponize zero-day vulnerabilities in enterprise appliance software. They frequently deploy specialized web shells (like **LEMURLOOT** used in the MOVEit campaign) to automate data exfiltration from compromised databases.

The group also utilizes the **TrueBot** (Silence) and **FlawedAmmyy** loaders for initial access in more targeted operations. Their lateral movement methodology relies on **Cobalt Strike** and legitimate administrative utilities such as PsExec. Cl0p is known for its highly disciplined exfiltration scripts, which are designed to identify and extract specific file types (e.g., .PDF, .XLSX, .DOCX) that are likely to contain sensitive or confidential information.

## Attribution

Cl0p is widely attributed to Russia-based cybercriminals, with strong technical linkages to the **TA505** grouping—one of the world's most prolific and longest-running cybercrime syndicates. The group's activities align with the work hours of the UTC+3 time zone and they avoid targeting organizations in the Commonwealth of Independent States (CIS).

Law enforcement efforts, including **Operation Cyclone** in 2021, led to several arrests in Ukraine of individuals allegedly involved in the group's money laundering operations. Despite these disruptions and the seizure of some C2 infrastructure, the core developers of the Cl0p ransomware and the operators of their leak site remain free and continue to launch high-impact campaigns from Russian territory.

## MITRE ATT&CK Profile

Cl0p's tradecraft is centered on mass exploitation and rapid data collection:

- **T1190 (Exploit Public-Facing Application):** Mass-exploitation of zero-day vulnerabilities in MFT software to achieve global reach.
- **T1566.001 (Spear-phishing Attachment):** Using massive botnet distributions to deliver initial loaders.
- **T1003 (OS Credential Dumping):** Methodically harvesting administrative credentials once initial access is achieved to move toward the MFT database.
- **T1048 (Exfiltration Over Alternative Protocol):** Stealthy and rapid exfiltration of terabytes of data to attacker-controlled storage buckets before the victim is aware of the breach.

## Sources & References

- [CISA: Advisory (AA23-158A) — StopRansomware: CL0P Ransomware Gang Exploits MOVEit Vulnerability](https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-158a) — CISA, 2023-06-07
- [FBI: Alert — Indicators of Compromise Associated with CL0P Ransomware](https://www.fbi.gov/news/press-releases/fbi-announces-disruption-of-cl0p-infrastructure) — FBI, 2023-06-16
- [Mandiant: CLOP Ransomware — Technical Analysis of the MOVEit Zero-Day Exploitation](https://www.mandiant.com/resources/blog/clop-ransomware-mass-exploitation) — Mandiant, 2023-06-01
- [MITRE ATT&CK: Cl0p (Software S0611)](https://attack.mitre.org/software/S0611/) — MITRE ATT&CK, 2023-10-21
- [Microsoft: Lace Tempest (Cl0p) — Analysis of recent data extortion campaigns](https://www.microsoft.com/en-us/security/blog/2023/06/14/lace-tempest-cl0p-ransomware-gang-exploits-moveit-transfer-vulnerability/) — Microsoft Security, 2023-06-14
