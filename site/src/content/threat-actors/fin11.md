---
name: "FIN11"
aliases:
  - "TA505 (overlapping)"
  - "DEV-0950"
affiliation: "Cybercriminal (Russian-speaking)"
motivation: "Financial"
status: active
country: "Russia"
firstSeen: "2016"
lastSeen: "2025"
targetSectors:
  - "Financial Services"
  - "Healthcare"
  - "Retail"
  - "Technology"
  - "Government"
targetGeographies:
  - "Global"
  - "North America"
  - "Europe"
tools:
  - "Cl0p ransomware"
  - "FlawedAmmyy"
  - "DEWMODE"
  - "SDBot"
  - "FRIENDSPEAK"
mitreMappings:
  - techniqueId: "T1190"
    techniqueName: "Exploit Public-Facing Application"
    tactic: "Initial Access"
    notes: "Exploits vulnerabilities in file transfer appliances including Accellion FTA."
  - techniqueId: "T1486"
    techniqueName: "Data Encrypted for Impact"
    tactic: "Impact"
    notes: "Deploys Cl0p ransomware for file encryption."
  - techniqueId: "T1566.001"
    techniqueName: "Phishing: Spearphishing Attachment"
    tactic: "Initial Access"
    notes: "Conducts high-volume phishing campaigns with malicious attachments."
attributionConfidence: A3
attributionRationale: "Tracked by Mandiant as a distinct cluster overlapping with TA505, based on shared tooling and infrastructure. Linked to Cl0p ransomware operations through operational overlap."
reviewStatus: "draft_ai"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "cybercriminal"
  - "fin11"
  - "cl0p"
  - "ransomware"
  - "financial"
sources:
  - url: "https://www.mandiant.com/resources/blog/fin11-email-campaigns-precursor-for-ransomware-data-theft"
    publisher: "Mandiant"
    publisherType: vendor
    reliability: R1
    publicationDate: "2020-10-14"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-158a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2023-06-07"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.justice.gov/opa/pr/ukrainian-arrested-and-charged-ransomware-attack-kaseya"
    publisher: "US Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2021-11-08"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

FIN11 is a financially motivated threat actor tracked by Mandiant as a distinct cluster within the broader TA505/Cl0p ecosystem. Active since at least 2016, the group conducts high-volume phishing campaigns and exploitation of enterprise software for ransomware deployment and data theft. FIN11 is closely associated with Cl0p ransomware operations.

The group's campaigns have evolved from widespread phishing to targeted exploitation of enterprise file transfer appliances, including the Accellion FTA campaign that compromised over 100 organizations in 2020-2021. FIN11 represents the operational arm responsible for initial access and deployment in the Cl0p ransomware ecosystem.

## Notable Campaigns

### 2020-2021 -- Accellion FTA Exploitation

FIN11 exploited multiple zero-day vulnerabilities in the Accellion File Transfer Appliance to steal data from organizations including Shell, Bombardier, Morgan Stanley, and several universities. The DEWMODE web shell was deployed on compromised appliances for data exfiltration.

### 2019-2020 -- High-Volume Phishing Campaigns

FIN11 conducted massive phishing campaigns using malicious Excel attachments with macros to deliver FlawedAmmyy RAT and SDBot, followed by Cl0p ransomware deployment on compromised networks.

## Technical Capabilities

FIN11 maintains high-volume email distribution infrastructure capable of sending millions of phishing emails across campaigns. The group uses macro-laden Office documents, HTML smuggling, and more recently, exploitation of zero-day vulnerabilities in file transfer platforms.

Post-compromise tools include FlawedAmmyy RAT, SDBot, and Cobalt Strike. The group shares operational infrastructure with Cl0p ransomware operators and is assessed to represent the initial access component of the Cl0p operation.

## Attribution

FIN11 is tracked by Mandiant as a distinct cluster based on unique operational patterns within the broader TA505 ecosystem. The overlap with Cl0p operations is supported by shared infrastructure, concurrent deployment timelines, and common tooling. Ukrainian law enforcement arrested Cl0p-linked individuals in 2021, though operations continued.

## MITRE ATT&CK Profile

**Initial Access**: High-volume spearphishing (T1566.001) and exploitation of public-facing file transfer applications (T1190).

**Execution**: Macro-based execution (T1059.005), PowerShell (T1059.001), and web shell deployment (T1505.003).

**Impact**: Cl0p ransomware deployment (T1486) and data theft/extortion.

## Sources & References

- [Mandiant: FIN11 Email Campaigns](https://www.mandiant.com/resources/blog/fin11-email-campaigns-precursor-for-ransomware-data-theft) -- Mandiant, 2020-10-14
- [CISA: Advisory AA23-158A - Cl0p/MOVEit](https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-158a) -- CISA, 2023-06-07
- [US DOJ: Ransomware Arrest](https://www.justice.gov/opa/pr/ukrainian-arrested-and-charged-ransomware-attack-kaseya) -- US Department of Justice, 2021-11-08
