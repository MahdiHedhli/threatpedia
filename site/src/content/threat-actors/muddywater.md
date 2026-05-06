---
name: "MuddyWater"
aliases:
  - "Earth Vetala"
  - "MERCURY"
  - "Static Kitten"
  - "Seedworm"
  - "TEMP.Zagros"
  - "Mango Sandstorm"
  - "TA450"
  - "MuddyKrill"
affiliation: "Iranian Ministry of Intelligence and Security"
motivation: "Espionage"
status: active
country: "Iran"
firstSeen: "2017"
lastSeen: "2026"
targetSectors:
  - "Government"
  - "Telecommunications"
  - "Defense"
  - "Finance"
  - "Oil and Natural Gas"
  - "Local Government"
targetGeographies:
  - "Middle East"
  - "Asia"
  - "Africa"
  - "Europe"
  - "North America"
tools:
  - "POWERSTATS"
  - "POWGOOP"
  - "MORIAGENT"
  - "Small Sieve"
  - "Canopy"
  - "STARWHALE"
  - "GRAMDOOR"
  - "ScreenConnect"
  - "LaZagne"
mitreMappings:
  - techniqueId: "T1566.001"
    techniqueName: "Phishing: Spearphishing Attachment"
    tactic: "Initial Access"
    notes: "MuddyWater has used targeted spearphishing emails with malicious attachments and links to begin intrusions."
  - techniqueId: "T1190"
    techniqueName: "Exploit Public-Facing Application"
    tactic: "Initial Access"
    notes: "Public reporting and CISA advisory material describe exploitation of known vulnerabilities, including Microsoft Exchange and Netlogon issues."
  - techniqueId: "T1059.001"
    techniqueName: "Command and Scripting Interpreter: PowerShell"
    tactic: "Execution"
    notes: "The group has repeatedly used obfuscated PowerShell for payload execution and command-and-control functions."
  - techniqueId: "T1003.001"
    techniqueName: "OS Credential Dumping: LSASS Memory"
    tactic: "Credential Access"
    notes: "MuddyWater tooling and procedures include credential-dumping activity using tools such as Mimikatz and related utilities."
  - techniqueId: "T1105"
    techniqueName: "Ingress Tool Transfer"
    tactic: "Command and Control"
    notes: "The group has staged and transferred additional malware, remote access tools, and scripts during post-compromise operations."
attributionConfidence: A1
attributionRationale: "U.S. Cyber Command and a joint FBI/CISA/CNMF/NCSC-UK advisory publicly identify MuddyWater as a subordinate element within Iran's Ministry of Intelligence and Security."
reviewStatus: "draft_ai"
generatedBy: "kernel-k"
generatedDate: 2026-05-06
tags:
  - "nation-state"
  - "iran"
  - "mois"
  - "espionage"
  - "muddywater"
  - "seedworm"
  - "temp-zagros"
sources:
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa22-055a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2022-02-24"
    accessDate: "2026-05-06"
    archived: false
  - url: "https://www.cybercom.mil/Media/News/Article/2897570/iranian-intel-cyber-suite-of-malware-uses-open-source-tools/"
    publisher: "U.S. Cyber Command"
    publisherType: government
    reliability: R1
    publicationDate: "2022-01-12"
    accessDate: "2026-05-06"
    archived: false
  - url: "https://attack.mitre.org/groups/G0069/"
    publisher: "MITRE ATT&CK"
    publisherType: research
    reliability: R1
    publicationDate: "2026-04-23"
    accessDate: "2026-05-06"
    archived: false
  - url: "https://cloud.google.com/blog/topics/threat-intelligence/telegram-malware-iranian-espionage/"
    publisher: "Google Cloud"
    publisherType: vendor
    reliability: R1
    publicationDate: "2022-02-24"
    accessDate: "2026-05-06"
    archived: false
---

## Executive Summary

MuddyWater is an Iranian state-sponsored cyber-espionage group publicly identified by U.S. Cyber Command and a joint FBI, CISA, U.S. Cyber Command Cyber National Mission Force, and UK NCSC advisory as a subordinate element within Iran's Ministry of Intelligence and Security. The group is tracked by MITRE ATT&CK as G0069 and is also reported under aliases including Static Kitten, Seedworm, TEMP.Zagros, MERCURY, Mango Sandstorm, and Earth Vetala.

Public government and research reporting describes MuddyWater as active since at least 2017. Its operations have targeted government and private-sector organizations across telecommunications, defense, local government, finance, and oil and natural gas sectors in the Middle East, Asia, Africa, Europe, and North America. The public evidence supports an espionage-focused profile, with technical activity built around phishing, exploitation of known vulnerabilities, remote access tooling, credential collection, and post-compromise staging.

## Notable Campaigns

### 2017-present — Government and Commercial Network Targeting

The 2022 joint cybersecurity advisory describes MuddyWater activity against government and commercial networks across multiple regions. The advisory identifies telecommunications, defense, local government, and oil and natural gas organizations as part of the observed target set and provides intrusion patterns including spearphishing, exploitation of known vulnerabilities, and the use of open-source tools.

### 2021 -- Middle East Government Intrusion Tracked by Mandiant

Mandiant reported a 2021 intrusion at a Middle East government customer under the UNC3313 cluster. Mandiant assessed with moderate confidence that UNC3313 was associated with TEMP.Zagros, which open sources report as MuddyWater. The intrusion involved targeted phishing, public remote-access software, and malware families including GRAMDOOR and STARWHALE.

### 2022 -- Public Disclosure of MOIS-Linked Malware Activity

U.S. Cyber Command's Cyber National Mission Force publicly disclosed malware samples and tools associated with Iranian intelligence actors tracked as MuddyWater. The disclosure described the group's use of open-source tools, side-loading DLLs, obfuscated PowerShell, and JavaScript components used to connect to malicious infrastructure.

## Technical Capabilities

MuddyWater operations rely on social engineering and known-vulnerability exploitation rather than only custom malware. Public reporting describes spearphishing emails, malicious documents, archive files, and links used to initiate access. The group has also exploited publicly known vulnerabilities and used legitimate remote access or remote management tools to maintain access in victim environments.

The group's tooling has included POWERSTATS, POWGOOP, MORIAGENT, Small Sieve, Canopy, STARWHALE, and GRAMDOOR. CISA and MITRE reporting also document PowerShell, JavaScript, Visual Basic, command shell activity, DLL side-loading, credential-dumping utilities, and staged tool transfer during post-compromise operations.

MuddyWater's tradecraft includes obfuscating scripts, using legitimate administrative tools, collecting credentials, and transferring additional payloads after initial access. The available public reporting supports a profile of a persistent intelligence-collection group that blends custom tooling with publicly available offensive security tools and remote access software.

## Attribution

Attribution to Iran's Ministry of Intelligence and Security is documented in the public record. U.S. Cyber Command stated in January 2022 that MuddyWater is a subordinate element within MOIS, and the February 2022 joint advisory from FBI, CISA, CNMF, and UK NCSC repeated that assessment while describing global government and commercial targeting.

The alias boundary remains important. MITRE lists Earth Vetala, MERCURY, Static Kitten, Seedworm, TEMP.Zagros, Mango Sandstorm, TA450, and MuddyKrill as associated group names for MuddyWater. This profile treats those names as public tracking aliases or overlapping reporting labels and does not assume that every Iran-nexus intrusion using similar tools is MuddyWater unless a cited source makes that link.

## MITRE ATT&CK Profile

**Initial Access**: MuddyWater uses spearphishing attachments and links (T1566.001) and has exploited public-facing applications or known vulnerabilities (T1190) to gain initial access.

**Execution**: The group uses PowerShell (T1059.001), Windows command shell, JavaScript, and Visual Basic execution paths to run payloads and post-compromise scripts.

**Credential Access**: Public reporting describes credential-dumping activity, including LSASS memory access (T1003.001) and use of credential theft utilities such as LaZagne.

**Command and Control**: MuddyWater has transferred tools into victim environments (T1105), used HTTP-based communications, and relied on public or legitimate infrastructure and remote access software during operations.

**Collection and Exfiltration**: MITRE reporting documents local data staging, archive creation, and exfiltration over command-and-control or cloud storage services in MuddyWater-linked activity.

## Sources & References

- [CISA: Iranian Government-Sponsored Actors Conduct Cyber Operations Against Global Government and Commercial Networks](https://www.cisa.gov/news-events/cybersecurity-advisories/aa22-055a) — CISA, 2022-02-24
- [U.S. Cyber Command: Iranian intel cyber suite of malware uses open source tools](https://www.cybercom.mil/Media/News/Article/2897570/iranian-intel-cyber-suite-of-malware-uses-open-source-tools/) — U.S. Cyber Command, 2022-01-12
- [MITRE ATT&CK: MuddyWater](https://attack.mitre.org/groups/G0069/) — MITRE ATT&CK, 2026-04-23
- [Google Cloud: Left On Read: Telegram Malware Spotted in Latest Iranian Cyber Espionage Activity](https://cloud.google.com/blog/topics/threat-intelligence/telegram-malware-iranian-espionage/) — Google Cloud, 2022-02-24
