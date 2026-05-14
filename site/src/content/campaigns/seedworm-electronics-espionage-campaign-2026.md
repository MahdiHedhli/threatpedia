---
campaignId: "TP-CAMP-2026-0009"
title: "Seedworm Cyber-Espionage Campaign Targeting South Korean Electronics and Global Organizations, 2026"
startDate: 2026-02-01
ongoing: true
attackType: "Cyber Espionage"
severity: high
sector: "Electronics Manufacturing"
geography: "South Korea; Global"
threatActor: "Seedworm"
attributionConfidence: A3
reviewStatus: "draft_ai"
confidenceGrade: B
generatedBy: "dangermouse-bot"
generatedDate: 2026-05-14
cves: []
relatedIncidents: []
tags:
  - "seedworm"
  - "muddywater"
  - "iran"
  - "mois"
  - "espionage"
  - "electronics"
  - "south-korea"
  - "state-sponsored"
sources:
  - url: "https://www.security.com/threat-intelligence/iran-seedworm-electronics"
    publisher: "Security.com"
    publisherType: vendor
    reliability: R2
    publicationDate: "2026-05-13"
    accessDate: "2026-05-14"
    archived: false
  - url: "https://news.risky.biz/risky-bulletin-rubygems-disables-sign-ups-after-attack-on-staff/"
    publisher: "Risky Business Media"
    publisherType: media
    reliability: R3
    publicationDate: "2026-05-13"
    accessDate: "2026-05-14"
    archived: false
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa22-055a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2022-02-24"
    accessDate: "2026-05-14"
    archived: false
mitreMappings:
  - techniqueId: "T1059.001"
    techniqueName: "PowerShell"
    tactic: "Execution"
    attackVersion: "v19"
    confidence: confirmed
    evidence: "Security.com observed PowerShell scripts dropped by a node.exe-based implant chain on the South Korean electronics host, used for reconnaissance, screenshot capture, SAM hive theft, privilege escalation, and SOCKS5 reverse-proxy tunnelling."
  - techniqueId: "T1574.001"
    techniqueName: "DLL"
    tactic: "Execution"
    attackVersion: "v19"
    confidence: confirmed
    evidence: "Security.com observed attackers sideloading malicious DLLs using legitimately signed Fortemedia fmapp.exe and SentinelOne sentinelmemoryscanner.exe binaries on the South Korean electronics host."
  - techniqueId: "T1105"
    techniqueName: "Ingress Tool Transfer"
    tactic: "Command and Control"
    attackVersion: "v19"
    confidence: confirmed
    evidence: "Security.com observed PowerShell and curl retrieving payloads from attacker-controlled infrastructure at 179.43.177[.]220 over HTTP on port 8080, with timetrakr[.]cloud used as an additional staging domain."
  - techniqueId: "T1113"
    techniqueName: "Screen Capture"
    tactic: "Collection"
    attackVersion: "v19"
    confidence: confirmed
    evidence: "Security.com observed screenshot capture executed via PowerShell scripts deployed as part of the node.exe-based implant chain on the South Korean electronics host."
  - techniqueId: "T1003.002"
    techniqueName: "Security Account Manager"
    tactic: "Credential Access"
    attackVersion: "v19"
    confidence: confirmed
    evidence: "Security.com observed attackers saving SAM, SECURITY, and SYSTEM registry hives on the South Korean electronics host for offline credential theft."
---

## Executive Summary

An espionage campaign attributed to Seedworm — publicly identified as a subordinate element of Iran's Ministry of Intelligence and Security (MOIS) and also tracked as MuddyWater — was active from at least February 2026. Security.com reported on the campaign, attributing intrusion activity against an electronics manufacturer in South Korea and additional organizations globally to Seedworm based on tooling and tradecraft consistent with the group's documented patterns. Security.com did not publicly name the South Korean electronics victim in its reporting.

The initial infection vector for the South Korean electronics-manufacturer intrusion was not determined. Once inside, attackers executed a DLL sideloading chain using legitimately signed third-party binaries, deployed a node.exe-based PowerShell implant chain for reconnaissance and collection, stole credential material via SAM hive extraction, and exfiltrated data through attacker-controlled infrastructure. The group spent approximately one week inside the electronics manufacturer, with first observed activity on February 20 and last observed activity on February 27, 2026.

Activity in Q1 2026 affected at least nine organizations across nine countries on four continents. Sectors included industrial and electronics manufacturing, education and public-sector bodies, financial services, and professional services. CISA advisory AA22-055A identifies MuddyWater as a subordinate element of MOIS; that advisory does not address the specific 2026 South Korean electronics intrusion but provides authoritative actor context.

## Technical Analysis

Seedworm is a persistent Iranian state-sponsored espionage group active since at least 2017, targeting government, telecommunications, defense, and technology organizations across the Middle East, Asia, Africa, Europe, and North America. CISA advisory AA22-055A identifies MuddyWater/Seedworm as a subordinate element of MOIS, operating with an intelligence-collection mandate.

Security.com's reporting on this campaign describes intrusion activity against a South Korean electronics manufacturer alongside organizations in eight additional countries spanning four continents. Targeted sectors included industrial and electronics manufacturing, education and public-sector bodies, financial services, and professional services. The victim identity for the South Korean organization was not disclosed.

For the South Korean electronics intrusion, Security.com determined that the initial infection vector was unknown. First observed malicious activity on the host was February 20, 2026. Attackers used DLL sideloading, abusing legitimately signed Fortemedia fmapp.exe and SentinelOne sentinelmemoryscanner.exe binaries to load malicious DLLs. A node.exe-based implant chain was used to deploy PowerShell scripts for reconnaissance, screenshot capture, SAM hive theft, privilege escalation, and SOCKS5 reverse-proxy tunnelling. Payloads were retrieved from 179.43.177[.]220 over HTTP on port 8080 using PowerShell and curl; timetrakr[.]cloud served as an additional staging domain. SAM, SECURITY, and SYSTEM hives were saved for credential extraction, and data was exfiltrated through sendit[.]sh. Last observed activity on the electronics host was February 27, 2026.

Risky Business Media's May 13, 2026 bulletin noted the Security.com findings as a development in Iranian cyber operations against the electronics sector.

## Attack Chain

### Stage 1: Initial Foothold — Vector Unknown

The initial infection vector for the South Korean electronics manufacturer intrusion was not determined by Security.com. First observed malicious activity on the host was February 20, 2026.

### Stage 2: Execution via DLL Sideloading

Attackers established execution by sideloading malicious DLLs through legitimately signed third-party binaries: Fortemedia fmapp.exe and SentinelOne sentinelmemoryscanner.exe. Using signed, trusted executables to load malicious libraries allowed execution to proceed under the authority of the signed binary.

### Stage 3: Implant Deployment and Payload Retrieval

A node.exe-based implant chain was deployed to orchestrate follow-on activity. PowerShell and curl retrieved additional payloads from attacker-controlled infrastructure at 179.43.177[.]220 over HTTP on port 8080. A secondary staging domain, timetrakr[.]cloud, was also used for payload hosting.

### Stage 4: Reconnaissance and Collection

PowerShell scripts executed from the implant chain performed host reconnaissance and captured screenshots. SAM, SECURITY, and SYSTEM registry hives were saved to disk for offline credential extraction. Privilege escalation tooling was also deployed during this phase.

### Stage 5: Exfiltration

Collected data was exfiltrated through sendit[.]sh. Last observed activity on the electronics host was February 27, 2026, approximately one week after first observed malicious activity.

## MITRE ATT&CK Mapping

T1059.001 - PowerShell: Security.com observed PowerShell scripts dropped by a node.exe-based implant chain on the South Korean electronics host. Scripts were used for host reconnaissance, screenshot capture, SAM hive extraction, privilege escalation, and SOCKS5 reverse-proxy tunnelling.

T1574.001 - DLL: Security.com observed attackers sideloading malicious DLLs using legitimately signed Fortemedia fmapp.exe and SentinelOne sentinelmemoryscanner.exe binaries. Abusing trusted signed executables allowed malicious code to execute under the authority of the legitimate binary.

T1105 - Ingress Tool Transfer: Security.com observed PowerShell and curl retrieving payloads from 179.43.177[.]220 over HTTP on port 8080. The domain timetrakr[.]cloud served as an additional attacker-controlled staging host for payload delivery.

T1113 - Screen Capture: Security.com observed screenshot capture executed via PowerShell scripts deployed as part of the node.exe-based implant chain, supporting intelligence collection on the compromised electronics-manufacturer host.

T1003.002 - Security Account Manager: Security.com observed attackers saving SAM, SECURITY, and SYSTEM registry hives to disk on the South Korean electronics host for subsequent offline credential extraction.

## Timeline

### 2026-02-20 — First Observed Malicious Activity on Electronics Host

Security.com identified February 20, 2026 as the first observed date of malicious activity on the South Korean electronics manufacturer's systems.

### 2026-02-27 — Last Observed Activity on Electronics Host

Security.com identified February 27, 2026 as the last observed date of attacker activity, indicating an approximately one-week presence inside the target environment.

### 2026-Q1 — Broader Campaign Activity Across Nine Countries

Security.com's reporting indicates that Seedworm intrusion activity in Q1 2026 affected at least nine organizations across nine countries on four continents, spanning industrial and electronics manufacturing, education, public-sector, financial services, and professional services sectors.

### 2026-05-13 — Security.com Publishes Findings; Risky Business Media Reports

Security.com published its analysis of the Seedworm campaign targeting the South Korean electronics manufacturer and global organizations. Risky Business Media's May 13, 2026 bulletin highlighted the findings as part of its coverage of significant developments in Iranian threat actor activity.

## Remediation & Mitigation

CISA advisory AA22-055A provides mitigations applicable to MuddyWater/Seedworm intrusions:

**DLL Load Order and Sideloading Controls**: Audit application directories for writable locations that could be abused to place malicious DLLs alongside signed executables. Restrict write access to directories containing legitimately signed binaries and monitor for DLL loads from unexpected paths or by unexpected parent processes.

**Script Execution Controls and Logging**: Restrict unauthorized script execution through application control policies. Enable PowerShell script block logging, module logging, and transcription to support detection and forensic analysis. CISA advisory AA22-055A recommends PowerShell logging as a mitigation for MuddyWater's obfuscated scripting tradecraft.

**Egress Filtering and Staging Domain Detection**: Monitor and restrict outbound HTTP connections to non-standard ports, including port 8080. Apply DNS and network-layer controls to detect or block access to attacker-controlled staging infrastructure. File-sharing and exfiltration services such as sendit[.]sh should be reviewed for policy compliance and blocked if not required.

**Credential Protection**: Restrict access to the SAM, SECURITY, and SYSTEM registry hives. Enable Credential Guard where supported to protect credential material from offline extraction. Monitor for registry hive save operations (reg save, Volume Shadow Copy access) as indicators of credential theft activity.

**Multi-Factor Authentication**: Enforce phishing-resistant MFA across all user and administrator accounts to limit the value of credentials captured through post-compromise collection. CISA advisory AA22-055A includes MFA enforcement as a recommended mitigation for Iranian state cyber actors.

**Patch Management**: Maintain systems and software with current patches to reduce the exploitable attack surface available to initial access activity, the vector for which was undetermined in this intrusion.

## Sources & References

- [Security.com: Iran-Based Seedworm Group Targets South Korean Electronics Firm and Global Organizations](https://www.security.com/threat-intelligence/iran-seedworm-electronics) — Security.com, 2026-05-13
- [Risky Business Media: Risky Bulletin — RubyGems Disables Sign-Ups After Attack on Staff](https://news.risky.biz/risky-bulletin-rubygems-disables-sign-ups-after-attack-on-staff/) — Risky Business Media, 2026-05-13
- [CISA: Iranian Government-Sponsored Actors Conduct Cyber Operations Against Global Government and Commercial Networks (AA22-055A)](https://www.cisa.gov/news-events/cybersecurity-advisories/aa22-055a) — CISA, 2022-02-24
