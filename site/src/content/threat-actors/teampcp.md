---
name: "TeamPCP"
aliases:
  - "Team PCP"
affiliation: "Cybercriminal"
motivation: "Financial / Hacktivism"
status: active
country: "Unknown"
firstSeen: "2024"
lastSeen: "2025"
targetSectors:
  - "Government"
  - "Healthcare"
  - "Education"
targetGeographies:
  - "Global"
  - "Asia"
tools:
  - "Web exploitation tools"
  - "DDoS tools"
  - "Custom defacement scripts"
mitreMappings:
  - techniqueId: "T1190"
    techniqueName: "Exploit Public-Facing Application"
    tactic: "Initial Access"
    notes: "Exploits vulnerabilities in web applications for unauthorized access."
  - techniqueId: "T1491.002"
    techniqueName: "Defacement: External Defacement"
    tactic: "Impact"
    notes: "Conducts website defacements as part of hacktivist operations."
  - techniqueId: "T1498"
    techniqueName: "Network Denial of Service"
    tactic: "Impact"
    notes: "Conducts DDoS attacks against targeted organizations."
attributionConfidence: A5
attributionRationale: "Limited public reporting. Tracked through hacktivist forums and claimed operations. No government attribution issued."
reviewStatus: "draft_ai"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "hacktivist"
  - "defacement"
  - "ddos"
  - "teampcp"
sources:
  - url: "https://www.ic3.gov/Media/Y2024/PSA241030.pdf"
    publisher: "FBI"
    publisherType: government
    reliability: R2
    publicationDate: "2024-10-30"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.cisa.gov/news-events/alerts/2024/03/15/hacktivist-activity"
    publisher: "CISA"
    publisherType: government
    reliability: R2
    publicationDate: "2024-03-15"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.radware.com/cyberpedia/ddos-attacks/hacktivist-groups-2024/"
    publisher: "Radware"
    publisherType: vendor
    reliability: R3
    publicationDate: "2024-06-15"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

TeamPCP is a hacktivist group that emerged in 2024, conducting website defacements, DDoS attacks, and limited data theft against government and institutional targets. The group operates through hacktivist forums and social media, claiming ideological motivations while also engaging in opportunistic attacks for reputation building.

Limited public reporting exists on TeamPCP's operations. The group's technical capabilities appear modest compared to state-sponsored actors, focusing on exploitation of known vulnerabilities in web applications and volumetric DDoS attacks.

## Notable Campaigns

### 2024-2025 -- Website Defacement Campaign

TeamPCP conducted a series of website defacements against government and educational institution websites, replacing content with hacktivist messaging. The defacements exploited known vulnerabilities in content management systems.

### 2024 -- DDoS Attacks

The group conducted DDoS attacks against government web portals and commercial websites, using both rented botnet infrastructure and open-source DDoS tools.

## Technical Capabilities

TeamPCP operates at a lower sophistication level, exploiting known vulnerabilities in web applications (WordPress, Joomla, and other CMS platforms) for website defacements. DDoS capabilities rely on commercial booter/stresser services and publicly available tools.

The group does not appear to develop custom malware. Operations focus on maximizing public visibility through defacements and service disruptions rather than sustained network compromise.

## Attribution

No government attribution has been issued for TeamPCP. The group is tracked through hacktivist forums, Telegram channels, and claimed operations. Attribution confidence is low due to the distributed and anonymous nature of hacktivist operations.

## MITRE ATT&CK Profile

**Initial Access**: Exploitation of public-facing web applications (T1190) using known CVEs.

**Impact**: Website defacement (T1491.002) and network denial of service (T1498).

## Sources & References

- [FBI: Hacktivist Activity PSA](https://www.ic3.gov/Media/Y2024/PSA241030.pdf) -- FBI, 2024-10-30
- [CISA: Hacktivist Activity Alert](https://www.cisa.gov/news-events/alerts/2024/03/15/hacktivist-activity) -- CISA, 2024-03-15
- [Radware: Hacktivist Groups 2024](https://www.radware.com/cyberpedia/ddos-attacks/hacktivist-groups-2024/) -- Radware, 2024-06-15
