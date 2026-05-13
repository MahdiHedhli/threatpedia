---
name: "APT33 / Elfin"
aliases:
  - "APT33"
  - "Elfin"
  - "HOLMIUM"
  - "Peach Sandstorm"
affiliation: "Iran (Islamic Revolutionary Guard Corps)"
motivation: "Espionage"
status: active
country: "Iran"
firstSeen: "2013"
lastSeen: "2024"
targetSectors:
  - "Aviation"
  - "Aerospace"
  - "Energy"
  - "Petrochemical"
  - "Defense"
  - "Government"
  - "Satellite and Communications"
targetGeographies:
  - "United States"
  - "Saudi Arabia"
  - "South Korea"
  - "United Arab Emirates"
  - "Australia"
tools:
  - "TURNEDUP"
  - "DROPSHOT"
  - "ALFA Shell"
  - "NANOCORE"
  - "NETWIRE"
  - "Tickler"
  - "AD Explorer"
  - "AnyDesk"
mitreMappings:
  - techniqueId: "T1110.003"
    techniqueName: "Password Spraying"
    tactic: "Credential Access"
    attack-version: "v19"
    confidence: confirmed
    evidence: "Microsoft observed Peach Sandstorm conducting high-volume password spray attacks against internet-exposed services as a primary initial access technique in 2024 operations."
    notes: "Password spraying is used at scale against thousands of organizations to identify valid credentials without triggering account lockout thresholds."
  - techniqueId: "T1566.002"
    techniqueName: "Spearphishing Link"
    tactic: "Initial Access"
    attack-version: "v19"
    confidence: confirmed
    evidence: "Mandiant documented APT33 spearphishing campaigns using job-themed emails containing malicious HTA links, with domain masquerading to impersonate legitimate aviation and energy sector organizations."
    notes: "Job-themed lures were used to target employees at aviation manufacturers, energy firms, and related organizations."
  - techniqueId: "T1059.001"
    techniqueName: "PowerShell"
    tactic: "Execution"
    attack-version: "v19"
    confidence: probable
    evidence: "MITRE ATT&CK documents APT33 use of PowerShell for payload execution and post-compromise activity across multiple intrusion clusters."
    notes: "PowerShell is used alongside HTA execution for staging and executing additional tooling after initial access."
  - techniqueId: "T1105"
    techniqueName: "Ingress Tool Transfer"
    tactic: "Command and Control"
    attack-version: "v19"
    confidence: confirmed
    evidence: "Mandiant documented staged delivery of TURNEDUP, DROPSHOT, NANOCORE, and NETWIRE after initial compromise. Microsoft documented Tickler deployment during 2024 operations."
    notes: "APT33 consistently transfers additional tooling into compromised environments during post-exploitation phases."
  - techniqueId: "T1071.001"
    techniqueName: "Web Protocols"
    tactic: "Command and Control"
    attack-version: "v19"
    confidence: confirmed
    evidence: "Microsoft observed Peach Sandstorm using Azure-hosted infrastructure for HTTP/S-based command-and-control communications during 2024 Tickler operations."
    notes: "Azure cloud infrastructure used as C2 allows traffic to blend with legitimate cloud service activity."
  - techniqueId: "T1027.013"
    techniqueName: "Encrypted/Encoded File"
    tactic: "Defense Evasion"
    attack-version: "v19"
    confidence: probable
    evidence: "Mandiant described use of encrypted and encoded payloads in APT33 intrusion activity, including DROPSHOT and associated delivery chains."
    notes: "Encrypted and encoded payloads are used during delivery and execution stages to reduce detection by endpoint and network security controls."
atlasMappings: []
framework-mappings: []
attributionConfidence: A2
attributionRationale: "Mandiant and Microsoft both assess APT33 operates in support of the Iranian government, with Microsoft specifically assessing IRGC direction based on 2024 targeting patterns. No public government indictment has been issued as of the generatedDate."
reviewStatus: "draft_ai"
generatedBy: "dangermouse-bot"
generatedDate: 2026-05-13
tags:
  - "nation-state"
  - "iran"
  - "irgc"
  - "espionage"
  - "apt33"
  - "elfin"
  - "peach-sandstorm"
sources:
  - url: "https://attack.mitre.org/groups/G0064/"
    publisher: "MITRE ATT&CK"
    publisherType: research
    reliability: R1
    publicationDate: "2024-04-11"
    accessDate: "2026-05-13"
    archived: false
  - url: "https://cloud.google.com/blog/topics/threat-intelligence/apt33-insights-into-iranian-cyber-espionage/"
    publisher: "Mandiant"
    publisherType: vendor
    reliability: R1
    publicationDate: "2017-09-20"
    accessDate: "2026-05-13"
    archived: false
  - url: "https://www.microsoft.com/en-us/security/blog/2024/08/28/peach-sandstorm-deploys-new-custom-tickler-malware-in-long-running-intelligence-gathering-operations/"
    publisher: "Microsoft Security"
    publisherType: vendor
    reliability: R1
    publicationDate: "2024-08-28"
    accessDate: "2026-05-13"
    archived: false
  - url: "https://www.cisa.gov/topics/cyber-threats-and-advisories/nation-state-cyber-actors"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2026-05-13"
    accessDate: "2026-05-13"
    archived: false
---

## Executive Summary

APT33 (also tracked as Elfin, HOLMIUM, and Peach Sandstorm) is a suspected Iranian state-linked threat actor active since at least 2013. Mandiant assessed that the group works at the behest of the Iranian government, and Microsoft assessed in 2024 that the group operates on behalf of the Islamic Revolutionary Guard Corps (IRGC). The group conducts long-running cyber espionage operations targeting the aviation, aerospace, energy, and petrochemical sectors, with observed activity against organizations in the United States, Saudi Arabia, South Korea, the United Arab Emirates, and Australia.

## Notable Campaigns

### 2013–2016 — Aviation and Energy Sector Spearphishing

Mandiant documented APT33 activity beginning in 2013, spanning campaigns against aviation and petrochemical organizations in the United States, Saudi Arabia, and South Korea. The group used spearphishing emails with job-themed lures containing malicious HTA links, and registered domains that masqueraded as legitimate aviation and energy companies. Targets included commercial aviation organizations, aviation manufacturing companies, and upstream energy and petrochemical firms with strategic relevance to Gulf state energy infrastructure.

### 2024 — Peach Sandstorm Intelligence-Gathering Operations with Tickler

Microsoft documented sustained intelligence-gathering activity by Peach Sandstorm through mid-2024 against satellite, communications equipment, oil and gas, federal and state government, education, defense, and space-related sector organizations in the United States, UAE, and Australia. The group conducted password spray attacks against internet-exposed services, used LinkedIn for target reconnaissance and social engineering under the guise of recruitment, and deployed the custom Tickler backdoor against select targets after credential access. Post-compromise activity included SMB-based lateral movement, attempted AnyDesk deployment for persistent access, malicious ZIP file delivery via Microsoft Teams, and use of AD Explorer to enumerate and snapshot Active Directory environments. Azure infrastructure was used for command-and-control.

## Technical Capabilities

APT33 maintains a mix of custom malware and commodity tooling. Mandiant documented several custom tools used in earlier operations: **TURNEDUP**, a backdoor delivered through spearphishing campaigns; **DROPSHOT**, a destructive tool with linkage to the SHAPESHIFT wiper family; and **ALFA Shell**, a web shell used for persistent access to internet-facing servers. The group also used commodity remote access tools **NANOCORE** and **NETWIRE** for post-compromise access.

In 2024, Microsoft observed deployment of **Tickler**, a custom multi-stage backdoor used in intelligence-gathering operations against high-value targets. Tickler communicates over HTTP/S using Azure-hosted C2 infrastructure. The group used **AD Explorer** to enumerate Active Directory and collect snapshots for offline analysis, and attempted to deploy **AnyDesk** as a persistent remote access mechanism. Microsoft Teams was used as a social engineering delivery channel for malicious ZIP files.

APT33's initial access tradecraft has evolved from spearphishing to include high-volume password spraying operations against internet-exposed authentication endpoints.

## Attribution

Mandiant assessed in 2017 that APT33 has conducted cyber espionage operations since at least 2013 and that the group works at the behest of the Iranian government, based on the alignment of targeting with Iranian national interests in aviation and energy sectors, infrastructure patterns, and tool development.

Microsoft assessed in 2024 that Peach Sandstorm is an Iranian state-sponsored threat actor operating on behalf of the Islamic Revolutionary Guard Corps (IRGC), based on targeting patterns consistent with IRGC intelligence collection priorities and sustained operational activity. MITRE ATT&CK associates the group with the aliases APT33, Elfin, HOLMIUM, and Peach Sandstorm.

CISA's nation-state cyber actor overview provides broader government context for Iranian cyber operations, while the APT33-specific attribution in this profile remains based on vendor assessments. No public government indictment or formal designation has been identified for APT33 as of 2026-05-13.

## MITRE ATT&CK Profile

APT33 employs techniques spanning multiple ATT&CK tactics across its documented operational history.

**Credential Access**: High-volume password spraying (T1110.003) is used as a primary initial access technique, targeting thousands of organizations' internet-exposed services to identify valid credentials without triggering account lockout controls.

**Initial Access**: The group uses spearphishing with malicious links (T1566.002), including job-themed lures with HTA payloads and domain masquerading to target employees at aviation and energy sector organizations.

**Execution**: PowerShell (T1059.001) is used for payload execution and post-compromise operations alongside HTA-based delivery mechanisms.

**Command and Control**: Custom backdoors including Tickler communicate over HTTP/S-based web protocols (T1071.001), with Azure infrastructure used as C2. Ingress tool transfer (T1105) is used to stage and deploy additional tooling after initial access.

**Defense Evasion**: Encrypted and encoded payloads (T1027.013) are used during delivery and execution phases to reduce detection by endpoint and network security controls.

## Sources & References

- [MITRE ATT&CK: APT33](https://attack.mitre.org/groups/G0064/) — MITRE ATT&CK, 2024-04-11
- [Mandiant: APT33 Insights into Iranian Cyber Espionage](https://cloud.google.com/blog/topics/threat-intelligence/apt33-insights-into-iranian-cyber-espionage/) — Mandiant, 2017-09-20
- [Microsoft Security: Peach Sandstorm Deploys New Custom Tickler Malware in Long-Running Intelligence Gathering Operations](https://www.microsoft.com/en-us/security/blog/2024/08/28/peach-sandstorm-deploys-new-custom-tickler-malware-in-long-running-intelligence-gathering-operations/) — Microsoft Security, 2024-08-28
- [CISA: Nation-State Cyber Actors](https://www.cisa.gov/topics/cyber-threats-and-advisories/nation-state-cyber-actors) — CISA, 2026-05-13
