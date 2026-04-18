---
name: "Play Ransomware"
aliases:
  - "PLAY"
  - "Playcrypt"
affiliation: "Cybercriminal"
motivation: "Financial"
status: "active"
firstSeen: "2022"
lastSeen: "2026-03"
country: "Unknown"
targetSectors:
  - "Government"
  - "Healthcare"
  - "Education"
  - "Financial Services"
targetGeographies:
  - "North America"
  - "South America"
  - "Europe"
tools:
  - "Play Ransomware"
  - "Cobalt Strike"
  - "SystemBC"
  - "Mimikatz"
mitreMappings:
  - techniqueId: "T1486"
    techniqueName: "Data Encrypted for Impact"
    tactic: "Impact"
    notes: "Play deploys a custom ransomware payload and routinely encrypts enterprise systems after exfiltration."
  - techniqueId: "T1190"
    techniqueName: "Exploit Public-Facing Application"
    tactic: "Initial Access"
    notes: "Public reporting frequently links Play intrusions to exploitation of exposed edge systems such as Exchange and VPN appliances."
  - techniqueId: "T1078"
    techniqueName: "Valid Accounts"
    tactic: "Initial Access"
    notes: "Compromised credentials and remote access tooling are recurrent access paths in Play incidents."
attributionConfidence: "A2"
attributionRationale: "Assessed by CISA and the FBI as a distinct financial syndicate using a custom encryption algorithm and distinctive double-extortion tactics against critical infrastructure."
reviewStatus: "under_review"
generatedBy: "penfold-bot"
generatedDate: "2026-04-14"
tags:
  - "financially-motivated"
  - "cybercrime"
  - "ransomware"
sources:
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-352a"
    publisher: "CISA"
    publisherType: "government"
    reliability: "R1"
    publicationDate: "2023-12-18"
    accessDate: "2026-04-18"
    archived: false
  - url: "https://www.trendmicro.com/vinfo/us/security/news/ransomware-spotlight/ransomware-spotlight-play"
    publisher: "Trend Micro"
    publisherType: "vendor"
    reliability: "R1"
    publicationDate: "2023-09-08"
    accessDate: "2026-04-18"
    archived: false
  - url: "https://adlumin.com/post/playcrypt-ransomware/"
    publisher: "Adlumin"
    publisherType: "vendor"
    reliability: "R2"
    publicationDate: "2023-08-17"
    accessDate: "2026-04-18"
    archived: false
---

## Executive Summary

Play Ransomware (also tracked as PLAY or Playcrypt) is a financially motivated ransomware group that emerged in 2022 and has repeatedly targeted governments, healthcare providers, schools, and private-sector enterprises across the Americas and Europe. Unlike some large affiliate marketplaces, Play is often described as a more tightly controlled extortion crew that nevertheless shares tradecraft with other modern ransomware ecosystems. Its hallmark behaviors include rapid post-compromise movement, data theft before encryption, and sparse ransom notes that simply say "PLAY" and provide a dark-web contact path.

## Notable Campaigns

- **Rackspace Hosted Exchange Disruption:** In late 2022, Play was publicly linked to the ProxyNotShell compromise of Rackspace Hosted Exchange, causing broad downstream disruption.
- **City of Oakland Ransomware Attack:** Play was widely linked to the 2023 City of Oakland incident, which caused severe municipal IT disruption and emergency response measures.
- **Widespread Exploitation Operations:** By 2024-2025, Play remained one of the most active leak-site ransomware brands in public victim reporting.

## Technical Capabilities

Play Ransomware reporting frequently highlights exploitation of exposed edge infrastructure and use of compromised credentials for initial access, especially around Microsoft Exchange and enterprise VPN environments. Once inside, operators lean heavily on living-off-the-land techniques and common post-exploitation tooling such as Cobalt Strike, SystemBC, and Mimikatz. Their custom payload uses intermittent encryption for speed and appends the `.play` extension to encrypted files.

## Attribution

Play Ransomware is assessed as a financially motivated cybercriminal syndicate. Public reporting has not established a definitive state nexus. Some analysts note operational and tooling overlap with other ransomware ecosystems, but the safest public framing is that Play is its own criminal extortion cluster with recurring similarities to peers rather than a formally proven rebrand of another family.

## MITRE ATT&CK Profile

**Initial Access**: Exploitation of public-facing applications (T1190) and compromised valid accounts (T1078) appear repeatedly in Play intrusions.

**Credential Access and Movement**: Play operators use credential dumping, remote access tooling, and rapid lateral movement to stage broad network impact before detonation.

**Impact**: Play deploys ransomware for data encryption and extortion (T1486) after staging or stealing sensitive data.

## Sources & References

- [CISA: #StopRansomware Advisory - Play Ransomware](https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-352a) -- CISA, 2023-12-18
- [Trend Micro: Ransomware Spotlight - Play](https://www.trendmicro.com/vinfo/us/security/news/ransomware-spotlight/ransomware-spotlight-play) -- Trend Micro, 2023-09-08
- [Adlumin: PlayCrypt Ransomware Group Wreaks Havoc in Campaign Against Managed Service Providers](https://adlumin.com/post/playcrypt-ransomware/) -- Adlumin, 2023-08-17
