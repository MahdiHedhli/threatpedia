---
name: "RansomHub"
aliases:
  - "Cyclops"
  - "Knight"
affiliation: "Cybercriminal"
motivation: "Financial / Ransomware Extortion"
status: "active"
country: "Unknown"
firstSeen: "2024"
lastSeen: "2025"
targetSectors:
  - "Water and Wastewater"
  - "Information Technology"
  - "Government Services and Facilities"
  - "Healthcare and Public Health"
  - "Emergency Services"
  - "Food and Agriculture"
  - "Financial Services"
  - "Commercial Facilities"
  - "Critical Manufacturing"
  - "Transportation"
  - "Communications"
tools:
  - "RansomHub ransomware"
  - "Mimikatz"
  - "AnyDesk"
  - "Cobalt Strike"
  - "Metasploit"
  - "Rclone"
  - "WinSCP"
  - "TDSSKiller"
  - "LaZagne"
mitreMappings:
  - techniqueId: "T1566"
    techniqueName: "Phishing"
    tactic: "Initial Access"
    attack-version: "v19"
    notes: "CISA reported that RansomHub affiliates used mass phishing and spear-phishing emails for initial access."
  - techniqueId: "T1190"
    techniqueName: "Exploit Public-Facing Application"
    tactic: "Initial Access"
    attack-version: "v19"
    notes: "CISA reported that RansomHub affiliates exploited known vulnerabilities in internet-facing systems."
  - techniqueId: "T1059.001"
    techniqueName: "PowerShell"
    tactic: "Execution"
    attack-version: "v19"
    notes: "CISA reported PowerShell-based living-off-the-land activity for network scanning and intrusion automation."
  - techniqueId: "T1047"
    techniqueName: "Windows Management Instrumentation"
    tactic: "Execution"
    attack-version: "v19"
    notes: "CISA reported affiliate use of Windows Management Instrumentation to execute commands and disable antivirus products."
  - techniqueId: "T1003"
    techniqueName: "OS Credential Dumping"
    tactic: "Credential Access"
    attack-version: "v19"
    notes: "CISA reported affiliate use of Mimikatz on Windows systems to gather credentials."
  - techniqueId: "T1486"
    techniqueName: "Data Encrypted for Impact"
    tactic: "Impact"
    attack-version: "v19"
    notes: "CISA reported that RansomHub affiliates used encryption for ransomware operations."
  - techniqueId: "T1490"
    techniqueName: "Inhibit System Recovery"
    tactic: "Impact"
    attack-version: "v19"
    notes: "CISA reported that RansomHub ransomware deleted volume shadow copies and affiliates removed backups."
attributionConfidence: "A3"
attributionRationale: "CISA, FBI, MS-ISAC, and HHS identify RansomHub as a ransomware-as-a-service variant formerly known as Cyclops and Knight. Public sources support cybercriminal extortion attribution but do not establish a state sponsor or fixed operator identity."
reviewStatus: "draft_ai"
generatedBy: "dangermouse-bot"
generatedDate: 2026-05-13
tags:
  - "ransomware"
  - "raas"
  - "double-extortion"
  - "edr-evasion"
  - "data-theft"
sources:
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-242a"
    publisher: "CISA"
    publisherType: "government"
    reliability: "R1"
    publicationDate: "2024-08-29"
    accessDate: "2026-05-13"
    archived: false
  - url: "https://www.threatdown.com/blog/new-ransomhub-attack-uses-tdskiller-and-lazagne-disables-edr/"
    publisher: "ThreatDown"
    publisherType: "vendor"
    reliability: "R2"
    publicationDate: "2024-09-09"
    accessDate: "2026-05-13"
    archived: false
  - url: "https://unit42.paloaltonetworks.com/2025-ransomware-extortion-trends/"
    publisher: "Unit 42"
    publisherType: "vendor"
    reliability: "R2"
    publicationDate: "2025-04-23"
    accessDate: "2026-05-13"
    archived: false
---

## Executive Summary

RansomHub is a ransomware-as-a-service operation associated with double-extortion activity. [CISA: #StopRansomware: RansomHub Ransomware](https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-242a) identified RansomHub as a variant formerly known as Cyclops and Knight and reported that the operation had attracted affiliates from other ransomware variants.

CISA, FBI, MS-ISAC, and HHS reported that since RansomHub's inception in February 2024, affiliates had encrypted and exfiltrated data from at least 210 victims across water and wastewater, information technology, government services and facilities, healthcare and public health, emergency services, food and agriculture, financial services, commercial facilities, critical manufacturing, transportation, and communications sectors. [Unit 42: Extortion and Ransomware Trends January-March 2025](https://unit42.paloaltonetworks.com/2025-ransomware-extortion-trends/) reported that RansomHub was the most active ransomware leak-site name in Unit 42's vetted January-March 2025 public leak-site dataset.

## Notable Campaigns

CISA's August 2024 advisory describes RansomHub as an affiliate-driven ransomware-as-a-service model rather than a single fixed intrusion set. The advisory states that affiliates use double extortion by encrypting systems and exfiltrating data, while the ransom note generally directs victims to contact the group through a Tor-accessible site rather than listing an initial demand in the note.

[ThreatDown: New RansomHub attack uses TDSSKiller and LaZagne, disables EDR](https://www.threatdown.com/blog/new-ransomhub-attack-uses-tdskiller-and-lazagne-disables-edr/) reported a September 2024 case in which a RansomHub attack used TDSSKiller and LaZagne in an intrusion chain. ThreatDown described that case as part of a shift in the tools observed in RansomHub activity.

## Technical Capabilities

CISA reported that RansomHub affiliates typically compromise internet-facing systems and user endpoints through phishing, exploitation of known vulnerabilities, and password spraying. The advisory also reported affiliate use of proof-of-concept exploit code and cited observed exploitation of multiple known CVEs in exposed products.

Post-access activity described by CISA includes account creation, account manipulation, credential gathering with Mimikatz, lateral movement through Remote Desktop Protocol, and use of tools such as AnyDesk, Cobalt Strike, Metasploit, Rclone, and WinSCP. CISA reported that data exfiltration methods depend on the affiliate conducting the intrusion and that observed methods included PuTTY, Amazon S3 tools, HTTP POST requests, WinSCP, Rclone, Cobalt Strike, and Metasploit.

CISA reported that RansomHub ransomware uses encryption for impact and typically attempts to delete volume shadow copies with vssadmin.exe to inhibit recovery. ThreatDown reported a RansomHub case involving TDSSKiller to interfere with endpoint defense and LaZagne to recover stored credentials.

## Attribution

The cited public sources support attribution to a financially motivated cybercriminal ransomware ecosystem. CISA, FBI, MS-ISAC, and HHS identify RansomHub as a ransomware-as-a-service variant and describe affiliate behavior, but the advisory does not identify a state sponsor or a fixed central operator.

RansomHub's country of origin and any state relationship are unknown in the cited source set.

## MITRE ATT&CK Profile

T1566 - Phishing: CISA reported that RansomHub affiliates used mass phishing and spear-phishing emails to obtain initial access.

T1190 - Exploit Public-Facing Application: CISA reported that RansomHub affiliates exploited known vulnerabilities in internet-facing systems.

T1059.001 - PowerShell: CISA reported PowerShell-based living-off-the-land activity for network scanning and intrusion automation.

T1047 - Windows Management Instrumentation: CISA reported affiliate use of Windows Management Instrumentation to execute malicious commands and disable antivirus products.

T1003 - OS Credential Dumping: CISA reported use of Mimikatz on Windows systems to gather credentials.

T1486 - Data Encrypted for Impact: CISA reported that RansomHub affiliates used encryption for ransomware operations.

T1490 - Inhibit System Recovery: CISA reported that RansomHub ransomware deleted volume shadow copies and that affiliates removed backups.

## Sources & References

- [CISA: #StopRansomware: RansomHub Ransomware](https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-242a) — CISA, 2024-08-29
- [ThreatDown: New RansomHub attack uses TDSSKiller and LaZagne, disables EDR](https://www.threatdown.com/blog/new-ransomhub-attack-uses-tdskiller-and-lazagne-disables-edr/) — ThreatDown, 2024-09-09
- [Unit 42: Extortion and Ransomware Trends January-March 2025](https://unit42.paloaltonetworks.com/2025-ransomware-extortion-trends/) — Unit 42, 2025-04-23
