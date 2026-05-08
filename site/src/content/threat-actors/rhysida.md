---
name: "Rhysida"
aliases: []
affiliation: "Cybercriminal (Ransomware)"
motivation: "Financial"
status: active
country: "Unknown"
firstSeen: "2023"
lastSeen: "2025"
targetSectors:
  - "Healthcare"
  - "Education"
  - "Manufacturing"
  - "Information Technology"
  - "Government"
targetGeographies:
  - "United States"
  - "Global"
tools:
  - "AZCopy"
  - "AnyDesk"
  - "PsExec"
  - "PuTTy"
  - "Gootloader"
  - "ADRecon"
  - "Azure Storage Explorer"
mitreMappings:
  - techniqueId: "T1078"
    techniqueName: "Valid Accounts"
    tactic: "Initial Access"
    notes: "Rhysida actors authenticate to internal VPN access points using compromised valid credentials for initial access and persistence."
  - techniqueId: "T1021.001"
    techniqueName: "Remote Desktop Protocol"
    tactic: "Lateral Movement"
    notes: "Rhysida actors create RDP connections to move laterally through victim networks after establishing initial access."
  - techniqueId: "T1003.003"
    techniqueName: "NTDS"
    tactic: "Credential Access"
    notes: "Rhysida actors dump the NTDS.dit database from domain controllers using ntdsutil to extract Active Directory credential hashes."
  - techniqueId: "T1486"
    techniqueName: "Data Encrypted for Impact"
    tactic: "Impact"
    notes: "Rhysida ransomware encrypts victim data using a 4096-bit RSA key with ChaCha20 algorithm, appending a .rhysida extension to encrypted files."
attributionConfidence: A3
attributionRationale: "Documented through FBI and CISA joint investigations with published IOCs and TTPs. No specific country attribution or individual indictments in public government reporting."
reviewStatus: "draft_ai"
generatedBy: "dangermouse-bot"
generatedDate: 2026-05-08
tags:
  - "ransomware"
  - "cybercriminal"
  - "double-extortion"
  - "healthcare"
  - "rhysida"
sources:
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-319a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2025-04-30"
    accessDate: "2026-05-08"
    archived: false
  - url: "https://www.hhs.gov/sites/default/files/rhysida-ransomware-sector-alert-tlpclear.pdf"
    publisher: "HHS"
    publisherType: government
    reliability: R1
    publicationDate: "2023-11-15"
    accessDate: "2026-05-08"
    archived: false
  - url: "https://www.sentinelone.com/anthology/rhysida/"
    publisher: "SentinelOne"
    publisherType: vendor
    reliability: R1
    publicationDate: "2023-05-23"
    accessDate: "2026-05-08"
    archived: false
---

## Executive Summary

Rhysida is a financially motivated ransomware operation that emerged in May 2023. The group operates as a ransomware-as-a-service (RaaS) affiliate model and pursues "targets of opportunity" across the education, healthcare, manufacturing, information technology, and government sectors. A November 2023 joint advisory from the FBI, CISA, and the Multi-State Information Sharing and Analysis Center (MS-ISAC) disseminated Rhysida's known indicators of compromise (IOCs) and tactics, techniques, and procedures (TTPs).

Open-source reporting has documented behavioral and infrastructure similarities between Rhysida operators and Vice Society (DEV-0832) actors. While these similarities have been noted in multiple vendor reports, they do not constitute confirmed group identity, and the available public evidence does not support treating Rhysida and Vice Society as interchangeable labels. Rhysida actors employ a double-extortion model: they encrypt victim data and simultaneously threaten to publish exfiltrated files on a Tor-based leak site unless a Bitcoin ransom is paid.

## Notable Campaigns

### 2023–Present — Healthcare and Education Targeting

Rhysida has been consistently observed targeting the healthcare and public health sector, prompting a specific sector alert from the U.S. Department of Health and Human Services (HHS). The group's healthcare targeting has drawn focused government attention due to patient safety implications. CISA, FBI, and MS-ISAC investigations through December 2024 document a continuing operational pattern against healthcare organizations, with actors compromising VPN infrastructure and moving laterally before deploying the ransomware payload.

The education sector has also been a prominent target, with Rhysida actors compromising universities and school districts using the same VPN-and-RDP lateral movement pattern documented in healthcare incidents. Government organizations and manufacturing firms have been targeted with equal opportunism.

### 2024–2025 — Continued Operations with Updated TTPs

CISA updated the Rhysida advisory in April 2025 to reflect new IOCs and TTPs employed by Rhysida associates, indicating the group remained operationally active through at least late 2024. Updated techniques include expanded use of AZCopy and Azure Storage Explorer for cloud-based data exfiltration, reflecting adaptation to cloud-heavy enterprise environments.

## Technical Capabilities

Rhysida actors gain initial access primarily by authenticating to external-facing VPN services with compromised valid credentials. In some cases, Gootloader malware has been used for initial access. Once inside, actors conduct Active Directory reconnaissance using ADRecon and native tools including `ipconfig`, `whoami`, `nltest`, and `net` commands to enumerate domain structure and user accounts.

Lateral movement relies on RDP connections, PuTTy SSH tunneling, and PsExec for remote execution. Credential harvesting targets the NTDS.dit database via ntdsutil and extracted via ntdsutil or secretsdump-style tooling, allowing actors to compromise domain-wide accounts. AnyDesk is deployed for persistent remote access.

Data staged for exfiltration is placed into designated `in` and `out` folders created on the C:\ drive. Exfiltration leverages AZCopy and Azure Storage Explorer to transfer collected data to actor-controlled cloud storage. Prior to deploying the ransomware payload, actors clear Windows event logs using wevtutil to hinder forensic investigation.

The Rhysida ransomware binary is a 64-bit Windows PE compiled with MinGW/GCC. It injects into running processes before encrypting files with a 4096-bit RSA key combined with a ChaCha20 algorithm, appending a `.rhysida` extension to encrypted files. A PDF ransom note is dropped on the compromised system. Following encryption, the binary deletes itself via PowerShell from a hidden command window. Ransom payments are demanded in Bitcoin to actor-provided wallet addresses.

## Attribution

Rhysida is documented through joint FBI, CISA, and MS-ISAC investigations with published IOCs and TTPs. No specific country attribution appears in available public government reporting, and no individual Rhysida operators have been publicly indicted as of the most recent advisory update. Vendor reporting has noted behavioral similarities with Vice Society but public evidence does not support confirmed group identity between the two.

Multiple independent government and vendor sources document this as a distinct operational cluster with consistent TTPs, but without a legal attribution or government country-level assignment.

## MITRE ATT&CK Profile

**Initial Access**: Compromised valid credentials used to authenticate to VPN services (T1078); Gootloader malware for phishing-based initial access in some cases.

**Discovery**: Domain and network enumeration via `ipconfig` (T1016), `whoami` (T1033), `nltest` (T1482), and `net` commands; ADRecon for Active Directory reconnaissance.

**Lateral Movement**: Remote Desktop Protocol connections (T1021.001); PuTTy SSH tunneling (T1021.004); PsExec for remote execution.

**Credential Access**: NTDS.dit database dumping via ntdsutil (T1003.003) to extract domain-wide credential hashes.

**Collection and Exfiltration**: Data staged in local directories before exfiltration via AZCopy (T1059.009) and Azure Storage Explorer to cloud storage (T1530).

**Command and Control**: AnyDesk remote access tool (T1219) for persistent access.

**Defense Evasion**: Windows event log clearing via wevtutil (T1070.001); self-deletion of ransomware binary post-encryption (T1070.004).

**Impact**: RSA-4096 + ChaCha20 data encryption (T1486); double extortion with threatened publication of exfiltrated data (T1657).

## Sources & References

- [CISA: #StopRansomware: Rhysida Ransomware](https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-319a) — CISA, 2025-04-30
- [HHS: Rhysida Ransomware Sector Alert](https://www.hhs.gov/sites/default/files/rhysida-ransomware-sector-alert-tlpclear.pdf) — HHS, 2023-11-15
- [SentinelOne: Rhysida Ransomware Analysis](https://www.sentinelone.com/anthology/rhysida/) — SentinelOne, 2023-05-23
