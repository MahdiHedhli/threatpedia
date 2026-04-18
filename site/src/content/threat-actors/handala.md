---
name: "Handala"
aliases:
  - "Handala Hack Team"
  - "Handala Group"
affiliation: "Pro-Palestinian Hacktivist"
motivation: "Hacktivism / Disruption"
status: active
country: "Unknown"
firstSeen: "2023"
lastSeen: "2026"
targetSectors:
  - "Government"
  - "Technology"
  - "Critical Infrastructure"
  - "Financial Services"
targetGeographies:
  - "Israel"
  - "United States"
tools:
  - "Wiper malware"
  - "Custom phishing kits"
  - "DDoS tools"
mitreMappings:
  - techniqueId: "T1485"
    techniqueName: "Data Destruction"
    tactic: "Impact"
    notes: "Deploys wiper malware against Israeli targets."
  - techniqueId: "T1566.002"
    techniqueName: "Phishing: Spearphishing Link"
    tactic: "Initial Access"
    notes: "Targets Israeli organizations with phishing campaigns impersonating security updates."
  - techniqueId: "T1491.002"
    techniqueName: "Defacement: External Defacement"
    tactic: "Impact"
    notes: "Conducts website defacements with pro-Palestinian messaging."
attributionConfidence: A4
attributionRationale: "Handala publicly presents as a pro-Palestinian hacktivist persona. Vendors and journalists have described Iran-linked overlaps and broader proxy patterns, but the strongest public evidence supports a cautious Iran-aligned or Iran-linked framing rather than confirmed state control."
reviewStatus: "under_review"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "hacktivist"
  - "pro-palestinian"
  - "wiper"
  - "israel"
sources:
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-290a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2024-10-16"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.sentinelone.com/labs/handala-hacktivism-iran-israel/"
    publisher: "SentinelOne"
    publisherType: vendor
    reliability: R2
    publicationDate: "2024-04-22"
    accessDate: "2026-04-18"
    archived: false
  - url: "https://techcrunch.com/2026/03/11/stryker-hack-pro-iran-hacktivist-group-handala-says-it-is-behind-attack/"
    publisher: "TechCrunch"
    publisherType: media
    reliability: R2
    publicationDate: "2026-03-11"
    accessDate: "2026-04-18"
    archived: false
---

## Executive Summary

Handala (named after the Palestinian cartoon character by Naji al-Ali) is a pro-Palestinian hacktivist persona that emerged in late 2023 in the context of the Israel-Hamas conflict. The group claims operations in support of the Palestinian cause and has targeted Israeli organizations and international partners. Public reporting frequently describes Handala as Iran-linked or Iran-aligned, but the strongest public record still supports a cautious proxy or persona framing rather than a fully confirmed state command relationship.

Handala-linked operations include data theft, leaking, destructive endpoint wipe or remote-wipe claims, website defacements, and DDoS activity against Israeli and related targets. The group amplifies operations through social media and Telegram-style channels, using public claims and leaked material to shape the information impact of each intrusion.

## Notable Campaigns

### 2023-2024 -- Anti-Israel Cyber Operations

Following the outbreak of the Israel-Hamas conflict in October 2023, Handala launched sustained cyber operations against Israeli targets including government agencies, technology companies, and critical infrastructure operators. Operations included data theft, wiper malware deployment, and coordinated DDoS attacks.

### 2024 -- Israeli Cybersecurity Company Targeting

Handala claimed to have compromised Israeli cybersecurity firms, stealing and leaking internal data and source code. These operations targeted the cybersecurity supply chain serving Israeli government and military organizations.

## Technical Capabilities

Handala employs a mix of hacktivist and state-level capabilities. The group conducts phishing campaigns impersonating security advisories (including fake CrowdStrike and radar system updates) to deliver wiper malware and backdoors. DDoS attacks use both rented botnet infrastructure and volunteer-based tools.

Some public reporting describes destructive capabilities that go beyond typical low-skill defacement crews, including incidents involving rapid, organization-wide endpoint impact through Microsoft management tooling. That has contributed to assessments that Handala may overlap with or benefit from broader Iran-aligned tradecraft, even though public proof of direct state tasking remains incomplete.

## Attribution

Handala presents itself as an independent hacktivist group, but multiple vendors and journalists have described Iran-linked overlaps, and CISA has separately documented Iranian cyber operations that make use of hacktivist personas. That broader context supports a cautious Iran-aligned assessment, but the open-source record for Handala remains stronger on claimed operations and destructive impact than on a fully validated state-command chain.

## MITRE ATT&CK Profile

**Initial Access**: Spearphishing links (T1566.002) impersonating security updates and legitimate services.

**Impact**: Data destruction (T1485) via wiper malware, website defacement (T1491.002), and service disruption through DDoS.

**Exfiltration**: Stolen data published on Telegram channels and dark web forums.

## Sources & References

- [CISA: Advisory AA24-290A - Iranian Cyber Operations](https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-290a) -- CISA, 2024-10-16
- [SentinelOne: Handala Hacktivism Analysis](https://www.sentinelone.com/labs/handala-hacktivism-iran-israel/) -- SentinelOne, 2024-04-22
- [TechCrunch: Pro-Iran Hacktivist Group Says It Is Behind Attack on Medical Tech Giant Stryker](https://techcrunch.com/2026/03/11/stryker-hack-pro-iran-hacktivist-group-handala-says-it-is-behind-attack/) -- TechCrunch, 2026-03-11
