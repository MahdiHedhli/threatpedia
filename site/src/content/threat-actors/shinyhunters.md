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
attributionRationale: "French national Sebastien Raoult was arrested in Morocco in 2022, extradited to the United States, and sentenced to three years in prison in January 2024. Later ShinyHunters-branded leak-site activity has been tied to the European Commission Trivy breach and Hims & Hers reporting."
reviewStatus: "draft_ai"
generatedBy: "dangermouse-bot"
generatedDate: 2026-04-20
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
  - url: "https://www.ic3.gov/Media/Y2023/PSA230921.pdf"
    publisher: "FBI"
    publisherType: government
    reliability: R1
    publicationDate: "2023-09-21"
  - url: "https://www.recordedfuture.com/threat-intelligence-101/threat-actors/shinyhunters"
    publisher: "Recorded Future"
    publisherType: vendor
    reliability: R2
    publicationDate: "2023-05-15"
  - url: "https://cert.europa.eu/blog/european-commission-cloud-breach-trivy-supply-chain"
    publisher: "CERT-EU"
    publisherType: government
    reliability: R1
    publicationDate: "2026-04-02"
  - url: "https://www.bleepingcomputer.com/news/security/hims-and-hers-warns-of-data-breach-after-zendesk-support-ticket-breach/"
    publisher: "BleepingComputer"
    publisherType: media
    reliability: R2
    publicationDate: "2026-04-03"
---

## Executive Summary

ShinyHunters is a cybercriminal organization that specializes in large-scale data breaches, extortion, and the operation of dark web leak infrastructure. Since their emergence in 2020, the group has evolved through distinct operational epochs: beginning as prolific database thieves, later participating in massive cloud infrastructure compromises alongside initial access brokers, and eventually operating as an extortion brand and publication outlet for other intrusion teams. French national Sebastien Raoult was arrested in Morocco in 2022, extradited to the United States, and sentenced to three years in prison in January 2024 for his role in early ShinyHunters operations. 

In 2024, the magnitude of ShinyHunters' operations escalated when they became the public face of the mass exploitation of Snowflake cloud data environments. Threat intelligence firms like Mandiant tracked the core intrusion activity under the cluster identifier UNC5537. Rather than being a perfect alias, UNC5537 functioned as the access and extraction crew during the Snowflake campaign, utilizing the ShinyHunters brand and infrastructure for public-facing extortion and data sales.

## Technical Analysis

ShinyHunters' technical capabilities focus on discovering and exploiting weak identity perimeters in cloud and developer environments. Instead of deploying custom malware or zero-day exploits, they rely on "living off the land" in cloud ecosystems. They commonly identify exposed `.env` files, extract keys from public GitHub/GitLab repositories, or purchase logs from infostealers via Initial Access Brokers (IABs). Once valid API keys or session tokens are acquired, they authenticate directly to cloud infrastructure (AWS S3, Azure Blobs, SaaS admin portals) and execute bulk data extraction.

The group adopted expansive targeting scopes capturing high-tier telecommunication logs, financial infrastructure service vectors, and sensitive multi-tenant healthcare SaaS aggregates. Operationally, the group prefers striking heavily inter-connected data hubs capable of leaking exponential volumes of client data beyond standard local intrusion potentials.

## Attack Chain

### Stage 1: Credential Acquisition
ShinyHunters acquires valid credentials via specialized Initial Access Brokers (IABs), infostealer logs, or by scraping public code repositories for exposed API tokens and environment secrets.

### Stage 2: Cloud Environment Penetration
Using the acquired credentials (often bypassing lack of MFA), the group authenticates directly to cloud storage platforms (AWS, Azure, Snowflake) to identify sensitive data stores.

### Stage 3: Data Exfiltration
The group executes massive data transfer operations, often using native cloud tools or standard web-service protocols to move exfiltrated databases to attacker-controlled infrastructure.

### Stage 4: Extortion and Publication
Stolen data is staged on the ShinyHunters Tor leak site. The group contacts victims to initiate extortion negotiations or proceeds directly to selling the data on dark web marketplaces.

## Impact Assessment

The 2024 Snowflake campaign linked to ShinyHunters resulted in some of the largest data thefts in history, including 560 million records from Ticketmaster/Live Nation and 110 million customer records from AT&T. The group's operations consistently prioritize volume, targeting databases that contain personally identifiable information (PII) for millions of consumers across global markets.

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

## Historical Context

During their initial emergence in 2020-2021, ShinyHunters operated primarily as a highly capable data theft ring targeting e-commerce and technology companies. Leveraging credential stuffing, exposed code repositories, and misconfigured cloud storage, the group stole massive databases. Notable victims included Tokopedia (91 million records), Wattpad (270 million records), and Mashable. The stolen data was typically monetized through direct sales on dark web forums and Telegram channels rather than through formalized double-extortion malware deployment.

## Sources & References

- [US Department of Justice: ShinyHunters Member Sentenced](https://www.justice.gov/usao-wdwa/pr/french-national-sentenced-three-years-prison-computer-hacking-conspiracy) — US Department of Justice, 2024-01-10
- [FBI: Data Breach Alert](https://www.ic3.gov/Media/Y2023/PSA230921.pdf) — FBI, 2023-09-21
- [Recorded Future: ShinyHunters Profile](https://www.recordedfuture.com/threat-intelligence-101/threat-actors/shinyhunters) — Recorded Future, 2023-05-15
- [CERT-EU: European Commission Cloud Breach](https://cert.europa.eu/blog/european-commission-cloud-breach-trivy-supply-chain) — CERT-EU, 2026-04-02
- [BleepingComputer: Hims & Hers Warns of Data Breach](https://www.bleepingcomputer.com/news/security/hims-and-hers-warns-of-data-breach-after-zendesk-support-ticket-breach/) — BleepingComputer, 2026-04-03
