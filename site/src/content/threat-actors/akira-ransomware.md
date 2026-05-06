---
name: "Akira"
aliases:
  - "Akira ransomware"
  - "GOLD SAHARA"
  - "PUNK SPIDER"
  - "Howling Scorpius"
affiliation: "Cybercriminal"
motivation: "Financial"
status: active
country: "Unknown"
firstSeen: "2023"
lastSeen: "2026"
targetSectors:
  - "Manufacturing"
  - "Education"
  - "Information Technology"
  - "Healthcare"
  - "Financial Services"
targetGeographies:
  - "North America"
  - "Europe"
  - "Australia"
tools:
  - "Akira"
  - "Akira_v2"
  - "Megazord"
  - "Rclone"
  - "AnyDesk"
  - "PuTTY"
  - "AdFind"
  - "LaZagne"
  - "Mimikatz"
  - "PsExec"
mitreMappings:
  - techniqueId: "T1078"
    techniqueName: "Valid Accounts"
    tactic: "Initial Access"
    notes: "CISA and MITRE describe Akira use of valid account material, including VPN credentials, for initial access."
  - techniqueId: "T1133"
    techniqueName: "External Remote Services"
    tactic: "Initial Access"
    notes: "Public reporting describes Akira operators using VPN and other remote access services to enter victim networks."
  - techniqueId: "T1059.001"
    techniqueName: "Command and Scripting Interpreter: PowerShell"
    tactic: "Execution"
    notes: "MITRE reports Akira use of PowerShell, including commands to delete volume shadow copies."
  - techniqueId: "T1560.001"
    techniqueName: "Archive Collected Data: Archive via Utility"
    tactic: "Collection"
    notes: "MITRE reports Akira use of archive utilities such as WinRAR before data exfiltration."
  - techniqueId: "T1567.002"
    techniqueName: "Exfiltration Over Web Service: Exfiltration to Cloud Storage"
    tactic: "Exfiltration"
    notes: "MITRE reports Akira use of Rclone and cloud storage paths for exfiltration."
  - techniqueId: "T1486"
    techniqueName: "Data Encrypted for Impact"
    tactic: "Impact"
    notes: "Akira ransomware variants encrypt victim filesystems as part of extortion operations."
  - techniqueId: "T1490"
    techniqueName: "Inhibit System Recovery"
    tactic: "Impact"
    notes: "MITRE and vendor reporting document Akira deletion of system volume shadow copies."
attributionConfidence: A3
attributionRationale: "Public reporting identifies Akira as a ransomware-as-a-service and deployment entity active since March 2023, but does not publicly identify the operators as named individuals or a state service."
reviewStatus: "draft_ai"
generatedBy: "kernel-k"
generatedDate: 2026-05-06
tags:
  - "ransomware"
  - "akira"
  - "extortion"
  - "vpn"
  - "ransomware-as-a-service"
sources:
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-109a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2024-04-18"
    accessDate: "2026-05-06"
    archived: false
  - url: "https://attack.mitre.org/groups/G1024/"
    publisher: "MITRE ATT&CK"
    publisherType: research
    reliability: R1
    publicationDate: "2025-03-11"
    accessDate: "2026-05-06"
    archived: false
  - url: "https://arcticwolf.com/resources/blog/smash-and-grab-aggressive-akira-campaign-targets-sonicwall-vpns/"
    publisher: "Arctic Wolf"
    publisherType: vendor
    reliability: R1
    publicationDate: "2025-09-26"
    accessDate: "2026-05-06"
    archived: false
  - url: "https://www.sentinelone.com/anthology/akira/"
    publisher: "SentinelOne"
    publisherType: vendor
    reliability: R2
    publicationDate: "2025-09-17"
    accessDate: "2026-05-06"
    archived: false
---

## Executive Summary

Akira is a financially motivated ransomware operation and deployment entity active since at least March 2023. A joint advisory from FBI, CISA, Europol's European Cybercrime Centre, and NCSC-NL describes Akira activity affecting organizations across North America, Europe, and Australia, with Windows and Linux or VMware ESXi variants observed in public reporting.

The operation is associated with double-extortion ransomware activity: operators obtain access, move through victim networks, exfiltrate data, and encrypt systems to pressure payment. MITRE ATT&CK tracks the group as G1024 and lists GOLD SAHARA, PUNK SPIDER, and Howling Scorpius as associated public names. Public sources support a cybercriminal attribution, but they do not identify a confirmed state sponsor or named operators.

## Notable Campaigns

### 2023 — Emergence and Multi-Extortion Operations

SentinelOne and CISA reporting place Akira activity beginning in March 2023. Early reporting described the operation's data leak site, ransom negotiation process, and use of Windows ransomware payloads that appended the `.akira` extension to encrypted files. CISA later reported that Akira activity expanded to Linux and VMware ESXi environments, including the Megazord and Akira_v2 variants.

### 2024 — Joint Government Advisory on Akira Tactics

The April 2024 joint advisory from FBI, CISA, Europol EC3, and NCSC-NL documented Akira indicators of compromise and tactics, techniques, and procedures observed through FBI investigations and trusted third-party reporting. The advisory described initial access through VPN services without multifactor authentication, known Cisco vulnerabilities, external remote services, phishing, and valid account abuse.

### 2025 — SonicWall SSL VPN Targeting

Arctic Wolf reported a 2025 surge of Akira ransomware activity involving SonicWall SSL VPN access. Its September 2025 reporting described malicious SSL VPN logins, Impacket SMB activity, short dwell times, and rapid ransomware deployment. Arctic Wolf assessed that some activity may involve credentials previously exposed through SonicWall CVE-2024-40766 rather than a single confirmed new exploit path.

## Technical Capabilities

Akira operators use remote access paths, valid credentials, and known vulnerabilities to enter target networks. CISA reporting identifies VPN services, RDP, phishing, and valid account abuse as observed initial access methods. Arctic Wolf reporting highlights SonicWall SSL VPN access, suspicious logins from hosting infrastructure, SMB activity, and rapid movement from access to ransomware deployment.

Post-compromise activity includes discovery, credential access, lateral movement, data staging, exfiltration, and encryption. MITRE ATT&CK maps Akira to tools and behaviors including AdFind, LaZagne, Mimikatz, PsExec, Rclone, AnyDesk, PuTTY, PowerShell, valid account use, archive creation, cloud-service exfiltration, and volume shadow copy deletion.

Akira ransomware variants target Windows systems and VMware ESXi environments. MITRE tracks Akira ransomware as S1129 and Akira_v2 as S1194; public reporting describes C++ and Rust-based variants, including Megazord and Akira_v2. The ransomware tooling supports file encryption for financial extortion and may inhibit recovery by deleting shadow copies or stopping services.

## Attribution

Public reporting supports attribution to a cybercriminal ransomware operation. CISA and MITRE describe Akira as a ransomware threat actor or deployment entity rather than a state-sponsored group. The public evidence reviewed for this profile does not identify confirmed operators, public indictments, or a specific state sponsor.

Akira overlaps with several public tracking labels. MITRE lists GOLD SAHARA, PUNK SPIDER, and Howling Scorpius as associated group names. Public reporting also discusses technical or ecosystem overlap with prior ransomware activity, but the cited sources do not prove that Akira is controlled by another named ransomware group.

## MITRE ATT&CK Profile

**Initial Access**: Akira operators use valid accounts (T1078), external remote services (T1133), exploitation of public-facing applications, and phishing paths described in the joint government advisory.

**Execution and Discovery**: MITRE reports Akira use of PowerShell (T1059.001), command-line execution, file and directory discovery, network share discovery, process discovery, and system information discovery during ransomware execution and staging.

**Collection and Exfiltration**: MITRE maps Akira to archive creation with utilities such as WinRAR (T1560.001) and exfiltration to cloud storage using tools such as Rclone (T1567.002).

**Impact**: Akira ransomware encrypts victim filesystems (T1486). Public reporting also documents recovery inhibition, including deletion of volume shadow copies (T1490), and Akira_v2 behavior targeting VMware ESXi environments.

## Sources & References

- [CISA: #StopRansomware: Akira Ransomware](https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-109a) — CISA, 2024-04-18
- [MITRE ATT&CK: Akira](https://attack.mitre.org/groups/G1024/) — MITRE ATT&CK, 2025-03-11
- [Arctic Wolf: Smash and Grab: Aggressive Akira Campaign Targets SonicWall VPNs, Deploys Ransomware in an Hour or Less](https://arcticwolf.com/resources/blog/smash-and-grab-aggressive-akira-campaign-targets-sonicwall-vpns/) — Arctic Wolf, 2025-09-26
- [SentinelOne: Akira Ransomware: In-Depth Analysis, Detection, and Mitigation](https://www.sentinelone.com/anthology/akira/) — SentinelOne, 2025-09-17
