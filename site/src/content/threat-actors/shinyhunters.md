---
name: "ShinyHunters"
aliases:
  - "SH"
affiliation: "Cybercriminal"
motivation: "Financial"
status: active
country: "France"
firstSeen: "2020"
lastSeen: "2025"
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
tools:
  - "Custom scrapers"
  - "Cloud exploitation tools"
  - "Credential stuffing tools"
mitreMappings:
  - techniqueId: "T1530"
    techniqueName: "Data from Cloud Storage"
    tactic: "Collection"
    notes: "Targets misconfigured cloud storage (S3 buckets, Azure Blobs) to steal databases."
  - techniqueId: "T1213"
    techniqueName: "Data from Information Repositories"
    tactic: "Collection"
    notes: "Accesses code repositories (GitHub, GitLab) to find credentials and sensitive data."
  - techniqueId: "T1078.004"
    techniqueName: "Valid Accounts: Cloud Accounts"
    tactic: "Initial Access"
    notes: "Uses stolen or leaked cloud credentials to access victim environments."
attributionConfidence: A1
attributionRationale: "French national Sebastien Raoult arrested in Morocco (2022), extradited to U.S., and sentenced to three years (2024). DOJ confirmed ShinyHunters membership."
reviewStatus: "draft_ai"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "cybercriminal"
  - "shinyhunters"
  - "data-breach"
  - "cloud"
  - "france"
sources:
  - url: "https://www.justice.gov/usao-wdwa/pr/french-national-sentenced-three-years-prison-computer-hacking-conspiracy"
    publisher: "US Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2024-01-10"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.ic3.gov/Media/Y2023/PSA230921.pdf"
    publisher: "FBI"
    publisherType: government
    reliability: R1
    publicationDate: "2023-09-21"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.recordedfuture.com/threat-intelligence-101/threat-actors/shinyhunters"
    publisher: "Recorded Future"
    publisherType: vendor
    reliability: R2
    publicationDate: "2023-05-15"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

ShinyHunters is a cybercriminal group that specializes in large-scale data breaches through exploitation of cloud infrastructure, code repositories, and web applications. Active since 2020, the group has been linked to breaches affecting hundreds of millions of records. ShinyHunters monetizes stolen data through sales on dark web marketplaces and extortion of victim organizations.

French national Sebastien Raoult was arrested in Morocco in 2022 on a U.S. warrant, extradited to the United States, and sentenced to three years in prison in January 2024 for his role in ShinyHunters operations. The group has been linked to breaches at Tokopedia, Microsoft, AT&T (Snowflake), and Ticketmaster/Live Nation.

## Notable Campaigns

### 2024 -- Snowflake Customer Data Theft

ShinyHunters was linked to the mass exploitation of Snowflake cloud data platform customers, stealing data from AT&T (110 million customer records), Ticketmaster/Live Nation (560 million records), Santander Bank, and other organizations. The attacks exploited stolen credentials and the absence of mandatory MFA on Snowflake accounts.

### 2020-2021 -- Database Theft Campaign

The group conducted a rapid series of breaches targeting e-commerce and technology companies, including Tokopedia (91 million records), Wattpad (270 million records), and Mashable. Stolen databases were sold on dark web forums and Telegram channels.

## Technical Capabilities

ShinyHunters targets cloud infrastructure and developer environments. The group identifies exposed code repositories, extracts API keys and credentials, and uses them to access production databases and cloud storage. Techniques include searching for exposed .env files, misconfigured S3 buckets, and leaked credentials in public GitHub repositories.

The group also conducts credential stuffing attacks using previously leaked credential databases to access cloud accounts where password reuse exists. The Snowflake campaign demonstrated the group's ability to scale exploitation of a single vulnerability pattern across hundreds of organizations.

## Attribution

Sebastien Raoult was identified, arrested, and convicted as a ShinyHunters member. Additional members remain at large. The FBI has investigated ShinyHunters operations in coordination with French and international law enforcement.

## MITRE ATT&CK Profile

**Initial Access**: Cloud account compromise (T1078.004), exploitation of exposed code repositories (T1213), and credential stuffing.

**Collection**: Data from cloud storage (T1530), database exfiltration, and code repository mining.

**Exfiltration**: Bulk data transfer from cloud environments (T1567.002).

## Sources & References

- [US DOJ: ShinyHunters Member Sentenced](https://www.justice.gov/usao-wdwa/pr/french-national-sentenced-three-years-prison-computer-hacking-conspiracy) -- US Department of Justice, 2024-01-10
- [FBI: Data Breach Alert](https://www.ic3.gov/Media/Y2023/PSA230921.pdf) -- FBI, 2023-09-21
- [Recorded Future: ShinyHunters Profile](https://www.recordedfuture.com/threat-intelligence-101/threat-actors/shinyhunters) -- Recorded Future, 2023-05-15
