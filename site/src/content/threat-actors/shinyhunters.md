---
name: "ShinyHunters"
aliases:
  - "SH"
  - "UNC5537"
affiliation: "Cybercriminal"
motivation: "Financial"
status: active
country: "Unknown"
firstSeen: "2020"
lastSeen: "2026"
targetSectors:
  - "Technology"
  - "E-Commerce"
  - "Telecommunications"
  - "Financial Services"
  - "Healthcare"
targetGeographies:
  - "Global"
  - "United States"
  - "India"
  - "Europe"
tools:
  - "Custom scrapers"
  - "Cloud exploitation tools"
  - "Credential stuffing tools"
mitreMappings:
  - techniqueId: "T1078.004"
    techniqueName: "Valid Accounts: Cloud Accounts"
    tactic: "Initial Access"
    notes: "Uses stolen or leaked cloud credentials to access victim environments."
  - techniqueId: "T1213"
    techniqueName: "Data from Information Repositories"
    tactic: "Collection"
    notes: "Accesses code repositories (GitHub, GitLab) to find credentials and sensitive data."
  - techniqueId: "T1530"
    techniqueName: "Data from Cloud Storage Object"
    tactic: "Collection"
    notes: "Targets misconfigured cloud storage (S3 buckets, Azure Blobs) to steal databases."
  - techniqueId: "T1567"
    techniqueName: "Exfiltration Over Web Service"
    tactic: "Exfiltration"
    notes: "Stolen data published on ShinyHunters' Tor leak network for sale or free distribution."
  - techniqueId: "T1657"
    techniqueName: "Financial Theft"
    tactic: "Impact"
    notes: "Monetization through data sales on dark web marketplaces and extortion of victim organizations."
attributionConfidence: A2
attributionRationale: "French national Sebastien Raoult was arrested in Morocco in 2022, extradited to the United States, and sentenced to three years in prison in January 2024. Later ShinyHunters-branded leak-site activity has been publicly tied to the European Commission Trivy breach and Hims & Hers reporting."
reviewStatus: "certified"
generatedBy: "dangermouse-bot"
generatedDate: 2026-04-19
tags:
  - "cybercriminal"
  - "shinyhunters"
  - "data-breach"
  - "cloud"
  - "extortion"
sources:
  - url: "https://www.justice.gov/usao-wdwa/pr/french-national-sentenced-three-years-prison-computer-hacking-conspiracy"
    publisher: "US Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2024-01-10"
    accessDate: "2026-04-19"
    archived: false
  - url: "https://www.ic3.gov/Media/Y2023/PSA230921.pdf"
    publisher: "FBI"
    publisherType: government
    reliability: R1
    publicationDate: "2023-09-21"
    accessDate: "2026-04-19"
    archived: false
  - url: "https://www.recordedfuture.com/threat-intelligence-101/threat-actors/shinyhunters"
    publisher: "Recorded Future"
    publisherType: vendor
    reliability: R2
    publicationDate: "2023-05-15"
    accessDate: "2026-04-19"
    archived: false
  - url: "https://cert.europa.eu/blog/european-commission-cloud-breach-trivy-supply-chain"
    publisher: "CERT-EU"
    publisherType: government
    reliability: R1
    publicationDate: "2026-04-02"
    accessDate: "2026-04-19"
    archived: false
  - url: "https://www.bleepingcomputer.com/news/security/hims-and-hers-warns-of-data-breach-after-zendesk-support-ticket-breach/"
    publisher: "BleepingComputer"
    publisherType: media
    reliability: R2
    publicationDate: "2026-04-03"
    accessDate: "2026-04-19"
    archived: false
---

## Executive Summary

ShinyHunters is a cybercriminal organization that specializes in large-scale data breaches, extortion, and the operation of dark web leak infrastructure. Since their emergence in 2020, the group has evolved through distinct operational epochs: beginning as prolific database thieves, later participating in massive cloud infrastructure compromises alongside initial access brokers, and eventually operating as an extortion brand and publication outlet for other intrusion teams.

French national Sebastien Raoult was arrested in Morocco in 2022, extradited to the United States, and sentenced to three years in prison in January 2024 for his role in early ShinyHunters operations. Despite law enforcement action, the group's brand and infrastructure have remained active, most notably in the 2024 Snowflake cloud data thefts and as the publication outlet for the 2026 TeamPCP supply chain compromises.

The relationship between "ShinyHunters" and specific intrusion clusters like Mandiant's "UNC5537" is complex; UNC5537 largely functioned as the access and extraction crew during the Snowflake campaign, utilizing the ShinyHunters brand and infrastructure for public-facing extortion and data sales.

## Historical Context & Chronological Epochs

### 2020–2021: Database Theft & Sales

During their initial emergence, ShinyHunters operated primarily as a highly capable data theft ring targeting e-commerce and technology companies. Leveraging credential stuffing, exposed code repositories, and misconfigured cloud storage, the group stole massive databases. Notable victims included Tokopedia (91 million records), Wattpad (270 million records), and Mashable. The stolen data was typically monetized through direct sales on dark web forums and Telegram channels rather than through formalized double-extortion malware deployment.

### 2024: Snowflake Customer Data Theft (UNC5537 Partnership)

In 2024, the magnitude of ShinyHunters' operations escalated when they became the public face of the mass exploitation of Snowflake cloud data environments. Threat intelligence firms like Mandiant tracked the core intrusion activity under the cluster identifier UNC5537. UNC5537 exploited stolen customer credentials and the absence of mandatory multi-factor authentication (MFA) to access vast cloud data stores.

Rather than being a perfect 1:1 alias, UNC5537 partnered with or operated under the ShinyHunters umbrella. ShinyHunters' dark web leak sites were utilized to extort affected organizations and sell the stolen data. Major victims included AT&T (110 million customer records), Ticketmaster/Live Nation (560 million records), and Santander Bank, marking one of the largest aggregate data thefts in history.

### 2026: Leak-Site Extortion Resurgence

By early 2026, the ShinyHunters brand heavily prioritized its role as a leak-site and extortion clearinghouse. During the massive TeamPCP/Trivy supply chain compromise, the exfiltrated European Commission data was published on ShinyHunters' Tor leak site. ShinyHunters was also reported as the actor behind standalone compromises like the Hims & Hers Zendesk breach (TP-2026-0029).

This epoch marked a return to explicit leak-site branding and victim shaming. It demonstrated the group's willingness to monetize data acquired through specialized third-party intrusion crews (like TeamPCP), cementing ShinyHunters' position as a premier extortion and publication franchise.

## Technical Analysis

ShinyHunters' technical capabilities historically focus on discovering and exploiting weak identity perimeters in cloud and developer environments. Instead of deploying sophisticated custom malware or zero-day exploits, they rely on "living off the land" in cloud ecosystems.

They commonly identify exposed `.env` files, extract keys from public GitHub/GitLab repositories, or purchase logs from infostealers via Initial Access Brokers (IABs). Once valid API keys or session tokens are acquired, they authenticate directly to cloud infrastructure (AWS S3, Azure Blobs, SaaS admin portals) and execute bulk data extraction.

The 2024 Snowflake campaign (via UNC5537) and the 2026 incidents underscore a persistent reliance on valid accounts (`T1078.004`), proving that basic credential reuse combined with a lack of MFA on critical external services remains disastrously effective. Exfiltration is typically conducted over standard web-service protocols (`T1567`) to attacker-controlled infrastructure before being staged on Tor networks for extortion.

## MITRE ATT&CK Mapping

### Initial Access
T1078.004 - Valid Accounts: Cloud Accounts: ShinyHunters consistently uses compromised credentials (stolen via phishing, infostealers, or purchased from IABs) as their primary initial access vector.

### Collection
T1213 - Data from Information Repositories: The group actively accesses code repositories to find embedded credentials, API keys, and sensitive configuration data.
T1530 - Data from Cloud Storage Object: Targets misconfigured cloud-hosted data stores and multi-tenant SaaS platforms for bulk data theft.

### Exfiltration
T1567 - Exfiltration Over Web Service: Stolen data is transferred to attacker-controlled infrastructure and subsequently published on ShinyHunters' Tor leak network for sale or free distribution.

### Impact
T1657 - Financial Theft: Complete monetization strategy revolves around extortion of victim organizations and sales of raw data on dark web marketplaces.

## Sources & References

- [US DOJ: ShinyHunters Member Sentenced](https://www.justice.gov/usao-wdwa/pr/french-national-sentenced-three-years-prison-computer-hacking-conspiracy) — US Department of Justice, 2024-01-10
- [FBI: Data Breach Alert](https://www.ic3.gov/Media/Y2023/PSA230921.pdf) — FBI, 2023-09-21
- [Recorded Future: ShinyHunters Profile](https://www.recordedfuture.com/threat-intelligence-101/threat-actors/shinyhunters) — Recorded Future, 2023-05-15
