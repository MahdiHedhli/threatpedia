---
name: "FIN12"
aliases:
  - "Pistol Tempest"
  - "DEV-0237"
affiliation: "Cybercriminal (Russian-speaking)"
motivation: "Financial"
status: active
country: "Unknown"
firstSeen: "2018"
lastSeen: "2024"
targetSectors:
  - "Healthcare"
  - "Education"
  - "Financial Services"
  - "Government"
  - "Manufacturing"
targetGeographies:
  - "North America"
  - "Europe"
  - "Asia Pacific"
tools:
  - "Ryuk"
  - "Conti"
  - "BazarLoader"
  - "TrickBot"
  - "Cobalt Strike"
  - "SystemBC"
mitreMappings:
  - techniqueId: "T1486"
    techniqueName: "Data Encrypted for Impact"
    tactic: "Impact"
    notes: "Deploys Ryuk and Conti ransomware for file encryption."
  - techniqueId: "T1059.001"
    techniqueName: "Command and Scripting Interpreter: PowerShell"
    tactic: "Execution"
    notes: "Uses PowerShell for Cobalt Strike beacon deployment and lateral movement."
  - techniqueId: "T1078"
    techniqueName: "Valid Accounts"
    tactic: "Initial Access"
    notes: "Purchases access from initial access brokers to expedite intrusion timelines."
attributionConfidence: A3
attributionRationale: "Tracked by Mandiant as a distinct intrusion cluster specializing in rapid ransomware deployment. Linked to the Conti/TrickBot ecosystem through shared infrastructure."
reviewStatus: "under_review"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "cybercriminal"
  - "fin12"
  - "ransomware"
  - "healthcare"
  - "ryuk"
  - "conti"
sources:
  - url: "https://www.mandiant.com/resources/blog/fin12-ransomware-intrusion-actor"
    publisher: "Mandiant"
    publisherType: vendor
    reliability: R1
    publicationDate: "2021-10-07"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa20-302a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2020-10-28"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.hhs.gov/sites/default/files/fin12-profile.pdf"
    publisher: "HHS Health Sector Cybersecurity Coordination Center"
    publisherType: government
    reliability: R1
    publicationDate: "2021-11-15"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

FIN12 is a financially motivated threat actor that specializes in rapid ransomware deployment, often completing intrusions from initial access to encryption in under two days. Tracked by Mandiant since 2018, the group is distinguished by its willingness to target healthcare organizations, including during the COVID-19 pandemic, and its reliance on initial access brokers rather than running its own large phishing program.

FIN12 has deployed Ryuk and Conti ransomware and operates within the broader TrickBot/Conti ecosystem. The group's operations prioritize speed over data exfiltration, frequently encrypting systems without first stealing data -- a departure from the double-extortion model adopted by most ransomware groups.

## Notable Campaigns

### 2020 -- Healthcare Sector Targeting During COVID-19

FIN12 targeted multiple healthcare organizations during the COVID-19 pandemic, deploying Ryuk ransomware against hospitals and healthcare systems. These attacks disrupted patient care operations and drew condemnation from law enforcement agencies.

### 2021-2022 -- Conti Ransomware Deployment

FIN12 transitioned from Ryuk to Conti ransomware, maintaining its rapid deployment model. The group conducted operations across North America and Europe, with a focus on organizations with annual revenues exceeding $300 million.

## Technical Capabilities

FIN12's operational model relies on purchasing initial network access from brokers rather than conducting phishing campaigns. Access is typically obtained through TrickBot, BazarLoader, or compromised RDP credentials. Once inside a network, FIN12 operators move to domain-wide ransomware deployment within 24-48 hours.

The group uses Cobalt Strike for C2 and lateral movement, with SystemBC as a backup C2 channel. Ransomware deployment uses Group Policy Objects or PsExec for network-wide distribution.

## Attribution

Mandiant published a detailed report on FIN12 in October 2021, establishing it as a distinct intrusion cluster. The group's operations overlap with the broader Conti/TrickBot ecosystem, which was exposed through leaked internal communications (Conti Leaks) in 2022. HHS published a threat brief warning the healthcare sector of FIN12 targeting.

## MITRE ATT&CK Profile

**Initial Access**: Valid accounts from access brokers (T1078), TrickBot/BazarLoader infections (T1566.001).

**Execution**: PowerShell (T1059.001), WMI (T1047), Cobalt Strike beacons.

**Lateral Movement**: RDP (T1021.001), PsExec, and Group Policy deployment.

**Impact**: Rapid ransomware deployment (T1486) prioritizing encryption speed over data theft.

## Sources & References

- [Mandiant: FIN12 Ransomware Intrusion Actor](https://www.mandiant.com/resources/blog/fin12-ransomware-intrusion-actor) -- Mandiant, 2021-10-07
- [CISA: Advisory AA20-302A - Ransomware Activity](https://www.cisa.gov/news-events/cybersecurity-advisories/aa20-302a) -- CISA, 2020-10-28
- [HHS HC3: FIN12 Threat Profile](https://www.hhs.gov/sites/default/files/fin12-profile.pdf) -- HHS, 2021-11-15
