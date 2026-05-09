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
  - "ntdsutil"
  - "secretsdump"
  - "wevtutil"
  - "PuTTy"
  - "Gootloader"
  - "ADRecon"
  - "Azure Storage Explorer"
mitreMappings:
  - techniqueId: "T1078"
    techniqueName: "Valid Accounts"
    tactic: "Initial Access"
    notes: "Rhysida actors authenticate to internal VPN access points using compromised valid credentials for initial access and persistence."
  - techniqueId: "T1016"
    techniqueName: "System Network Configuration Discovery"
    tactic: "Discovery"
    notes: "Actors use ipconfig to enumerate network configuration on compromised hosts."
  - techniqueId: "T1033"
    techniqueName: "System Owner/User Discovery"
    tactic: "Discovery"
    notes: "Actors use whoami to identify the current user context on compromised systems."
  - techniqueId: "T1482"
    techniqueName: "Domain Trust Discovery"
    tactic: "Discovery"
    notes: "Actors use nltest to enumerate domain trusts and ADRecon for Active Directory reconnaissance."
  - techniqueId: "T1021.001"
    techniqueName: "Remote Desktop Protocol"
    tactic: "Lateral Movement"
    notes: "Rhysida actors create RDP connections to move laterally through victim networks after establishing initial access."
  - techniqueId: "T1021.004"
    techniqueName: "SSH"
    tactic: "Lateral Movement"
    notes: "Actors use PuTTy for SSH tunneling to facilitate lateral movement within victim environments."
  - techniqueId: "T1003.003"
    techniqueName: "NTDS"
    tactic: "Credential Access"
    notes: "Rhysida actors dump the NTDS.dit database from domain controllers using ntdsutil to extract Active Directory credential hashes."
  - techniqueId: "T1219"
    techniqueName: "Remote Access Tools"
    tactic: "Command and Control"
    notes: "AnyDesk is deployed on compromised systems to provide persistent remote access for actors."
  - techniqueId: "T1567.002"
    techniqueName: "Exfiltration to Cloud Storage"
    tactic: "Exfiltration"
    notes: "Actors use AZCopy and Azure Storage Explorer to transfer collected data to actor-controlled Azure cloud storage prior to ransomware deployment."
  - techniqueId: "T1070"
    techniqueName: "Indicator Removal"
    tactic: "Defense Evasion"
    notes: "Rhysida actors clear Windows event logs using wevtutil to hinder forensic investigation prior to ransomware deployment."
  - techniqueId: "T1070.004"
    techniqueName: "File Deletion"
    tactic: "Defense Evasion"
    notes: "The Rhysida ransomware binary deletes itself via PowerShell from a hidden command window following encryption."
  - techniqueId: "T1486"
    techniqueName: "Data Encrypted for Impact"
    tactic: "Impact"
    notes: "Rhysida ransomware encrypts victim data using a 4096-bit RSA key with ChaCha20 algorithm, appending a .rhysida extension to encrypted files."
  - techniqueId: "T1657"
    techniqueName: "Financial Theft"
    tactic: "Impact"
    notes: "Rhysida operates a double-extortion model, demanding Bitcoin ransom payments and threatening publication of exfiltrated data on a Tor-based leak site."
  - techniqueId: "T1566"
    techniqueName: "Phishing"
    tactic: "Initial Access"
    notes: "Gootloader malware delivers initial access via phishing in a subset of documented Rhysida intrusions."
  - techniqueId: "T1569.002"
    techniqueName: "Service Execution"
    tactic: "Execution"
    notes: "Actors use PsExec for remote execution across compromised hosts during lateral movement."
  - techniqueId: "T1074"
    techniqueName: "Data Staged"
    tactic: "Collection"
    notes: "Data staged for exfiltration is placed into designated 'in' and 'out' directories on the C:\ drive prior to transfer via AZCopy and Azure Storage Explorer."
  - techniqueId: "T1055"
    techniqueName: "Process Injection"
    tactic: "Defense Evasion"
    notes: "The Rhysida ransomware binary injects into running processes before encrypting files."
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

Rhysida has been observed targeting the healthcare and public health sector, prompting a specific sector alert from the U.S. Department of Health and Human Services (HHS). The group's healthcare targeting has drawn government attention due to patient safety implications. CISA, FBI, and MS-ISAC investigations through December 2024 document a continuing operational pattern against healthcare organizations, with actors compromising VPN infrastructure and moving laterally before deploying the ransomware payload.

The education sector has also been a target, with Rhysida actors compromising universities and school districts using the same VPN-and-RDP lateral movement pattern documented in healthcare incidents. Government organizations and manufacturing firms have also been targeted.

### 2024–2025 — Continued Operations with Updated TTPs

CISA updated the Rhysida advisory in April 2025 to reflect new IOCs and TTPs employed by Rhysida associates, indicating the group remained operationally active through at least late 2024. Updated techniques include expanded use of AZCopy and Azure Storage Explorer for cloud-based data exfiltration, reflecting adaptation to cloud-based enterprise environments.

## Technical Capabilities

Rhysida actors gain initial access primarily by authenticating to external-facing VPN services with compromised valid credentials. In some cases, Gootloader malware has been used for initial access. Once inside, actors conduct Active Directory reconnaissance using ADRecon and native tools including `ipconfig`, `whoami`, `nltest`, and `net` commands to enumerate domain structure and user accounts.

Lateral movement relies on RDP connections, PuTTy SSH tunneling, and PsExec for remote execution (T1569.002). Credential harvesting targets the NTDS.dit database, which is extracted via ntdsutil or secretsdump-style tooling, allowing actors to compromise domain-wide accounts. AnyDesk is deployed for persistent remote access.

Data staged for exfiltration is placed into designated `in` and `out` folders created on the C:\ drive. Exfiltration leverages AZCopy and Azure Storage Explorer to transfer collected data to actor-controlled cloud storage. Prior to deploying the ransomware payload, actors clear Windows event logs using wevtutil to hinder forensic investigation.

The Rhysida ransomware binary is a 64-bit Windows PE compiled with MinGW/GCC. It injects into running processes before encrypting files with a 4096-bit RSA key combined with a ChaCha20 algorithm, appending a `.rhysida` extension to encrypted files. A PDF ransom note is dropped on the compromised system. Following encryption, the binary deletes itself via PowerShell from a hidden command window. Ransom payments are demanded in Bitcoin to actor-provided wallet addresses.

## Attribution

Rhysida is documented through joint FBI, CISA, and MS-ISAC investigations with published IOCs and TTPs. No specific country attribution appears in available public government reporting, and no individual Rhysida operators have been publicly indicted as of the most recent advisory update. Vendor reporting has noted behavioral similarities with Vice Society but public evidence does not support confirmed group identity between the two.

Multiple independent government and vendor sources document this as a distinct operational cluster with consistent TTPs, but without a legal attribution or government country-level assignment.

## MITRE ATT&CK Profile

**Initial Access**: Compromised valid credentials used to authenticate to VPN services (T1078); Gootloader malware for phishing-based initial access in some cases (T1566).

**Discovery**: Domain and network enumeration via `ipconfig` (T1016), `whoami` (T1033), `nltest` (T1482), and `net` commands; ADRecon for Active Directory reconnaissance.

**Lateral Movement**: Remote Desktop Protocol connections (T1021.001); PuTTy SSH tunneling (T1021.004); PsExec for remote execution (T1569.002).

**Credential Access**: NTDS.dit database dumping via ntdsutil (T1003.003) to extract domain-wide credential hashes.

**Exfiltration**: Data staged in local directories (T1074) before exfiltration via AZCopy and Azure Storage Explorer to actor-controlled cloud storage (T1567.002).

**Command and Control**: AnyDesk remote access tool (T1219) for persistent access.

**Defense Evasion**: Windows event log clearing via wevtutil (T1070); self-deletion of ransomware binary post-encryption (T1070.004); process injection prior to file encryption (T1055).

**Impact**: RSA-4096 + ChaCha20 data encryption (T1486); double extortion with threatened publication of exfiltrated data (T1657).

## Sources & References

- [CISA: #StopRansomware: Rhysida Ransomware](https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-319a) — CISA, 2025-04-30
- [HHS: Rhysida Ransomware Sector Alert](https://www.hhs.gov/sites/default/files/rhysida-ransomware-sector-alert-tlpclear.pdf) — HHS, 2023-11-15
- [SentinelOne: Rhysida Ransomware Analysis](https://www.sentinelone.com/anthology/rhysida/) — SentinelOne, 2023-05-23
