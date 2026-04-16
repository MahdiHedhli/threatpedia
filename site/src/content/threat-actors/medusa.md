---
name: "Medusa"
aliases:
  - "Medusa Ransomware Gang"
  - "Medusa Blog"
affiliation: "Cybercriminal"
motivation: "Financial"
status: active
country: "Unknown"
firstSeen: "2021"
lastSeen: "2025"
targetSectors:
  - "Education"
  - "Healthcare"
  - "Government"
  - "Technology"
  - "Manufacturing"
targetGeographies:
  - "Global"
  - "United States"
  - "Europe"
tools:
  - "Medusa ransomware"
  - "Cobalt Strike"
  - "Advanced IP Scanner"
  - "Mimikatz"
  - "PsExec"
mitreMappings:
  - techniqueId: "T1486"
    techniqueName: "Data Encrypted for Impact"
    tactic: "Impact"
    notes: "Medusa ransomware encrypts files using AES-256 encryption."
  - techniqueId: "T1078"
    techniqueName: "Valid Accounts"
    tactic: "Initial Access"
    notes: "Gains access through compromised credentials and initial access brokers."
  - techniqueId: "T1490"
    techniqueName: "Inhibit System Recovery"
    tactic: "Impact"
    notes: "Deletes shadow copies and disables recovery options before encryption."
attributionConfidence: A4
attributionRationale: "Tracked by FBI and CISA as a ransomware-as-a-service operation. No individuals publicly identified or indicted."
reviewStatus: "draft_ai"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "ransomware"
  - "raas"
  - "medusa"
  - "double-extortion"
  - "education"
sources:
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa25-071a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2025-03-12"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.ic3.gov/Media/News/2025/250312-2.pdf"
    publisher: "FBI"
    publisherType: government
    reliability: R1
    publicationDate: "2025-03-12"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://unit42.paloaltonetworks.com/medusa-ransomware-escalation-new-leak-site/"
    publisher: "Palo Alto Unit 42"
    publisherType: vendor
    reliability: R1
    publicationDate: "2023-01-12"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

Medusa is a ransomware-as-a-service (RaaS) operation active since June 2021. The group operates a double-extortion model, encrypting victim data and threatening to publish stolen information on their "Medusa Blog" leak site. By early 2025, Medusa had impacted over 300 organizations across critical infrastructure sectors including education, healthcare, and government.

In March 2025, CISA, FBI, and MS-ISAC published a joint advisory on Medusa ransomware, providing detailed indicators of compromise and recommended mitigations. The group has demonstrated a willingness to target educational institutions and healthcare providers.

## Notable Campaigns

### 2023 -- Minneapolis Public Schools

Medusa ransomware operators attacked Minneapolis Public Schools, encrypting systems and exfiltrating student and staff data. After the district refused to pay the $1 million ransom, the group published stolen data including sensitive student records.

### 2024-2025 -- Healthcare and Government Targeting

Medusa increased targeting of healthcare organizations and government agencies, prompting the March 2025 joint advisory from CISA and FBI.

## Technical Capabilities

Medusa ransomware is typically deployed after initial access gained through phishing, exploitation of unpatched vulnerabilities, or purchased credentials from access brokers. The ransomware uses AES-256 encryption and appends the .medusa extension. Before encryption, operators exfiltrate data for double extortion.

The group uses standard post-exploitation tools including Cobalt Strike, Mimikatz, PsExec, and Advanced IP Scanner for lateral movement and credential harvesting. Medusa operators disable security tools and delete volume shadow copies before deploying ransomware.

## Attribution

Medusa is tracked as a RaaS operation by FBI and CISA. No specific individuals have been publicly identified or indicted. The group operates a Tor-based leak site and uses encrypted communication channels for ransom negotiations.

## MITRE ATT&CK Profile

**Initial Access**: Phishing (T1566), valid accounts (T1078), and exploitation of public-facing applications (T1190).

**Credential Access**: Mimikatz (T1003), credential harvesting from browsers and cached credentials.

**Impact**: File encryption (T1486), shadow copy deletion (T1490), and double extortion through data leak site.

## Sources & References

- [CISA: Medusa Ransomware Advisory](https://www.cisa.gov/news-events/cybersecurity-advisories/aa25-071a) -- CISA, 2025-03-12
- [FBI: Medusa Ransomware Indicators](https://www.ic3.gov/Media/News/2025/250312-2.pdf) -- FBI, 2025-03-12
- [Palo Alto Unit 42: Medusa Ransomware Analysis](https://unit42.paloaltonetworks.com/medusa-ransomware-escalation-new-leak-site/) -- Palo Alto Unit 42, 2023-01-12
