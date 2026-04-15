---
eventId: TP-2026-0054
title: "ShinyHunters Operations & Leak Site Activity"
date: 2026-01-28
attackType: data-extortion
severity: high
sector: Multi-Sector
geography: Global
threatActor: ShinyHunters (UNC5537)
attributionConfidence: A4
reviewStatus: under_review
confidenceGrade: C
generatedBy: incident-crosslink-gapfill
generatedDate: 2026-01-28
cves: []
relatedSlugs:
  - "european-commission-trivy-breach-2026"
  - "trivy-cve-2026-33634"
  - "teampcp-supply-chain-attack"
  - "adobe-mr-raccoon-breach-2026"
  - "hims-hers-shinyhunters-breach-2026"
  - "cisco-trivy-supply-chain-breach-2026"
tags:
  - "shinyhunters"
  - "data-leak-site"
  - "extortion"
  - "vishing"
  - "saas"
  - "salesforce"
  - "snowflake"
---
## Executive Summary

ShinyHunters is a notorious black-hat criminal hacking and extortion group believed to have formed around 2020. The group has built a strong reputation as a "pay or leak" operation, systematically compromising organizations, exfiltrating sensitive data, and publishing stolen records on their dark web data leak site (DLS) when ransom demands go unmet. By March 2026, the group claimed data from approximately 400 organizations, making them one of the most prolific data theft and extortion operators globally.

In late January 2026, a new ShinyHunters-branded data leak site emerged, marking a strategic shift toward a traditional ransomware-style extortion model. The portal, hosted as a TOR hidden service, lists alleged victims with countdown timers and sample data. This evolution from pure data brokerage to structured extortion represents a maturation of their operational model. ShinyHunters served as the publication platform for the European Commission breach data exfiltrated via the TeamPCP/Trivy supply chain compromise (CVE-2026-33634), publishing 340 GB of sensitive EU institutional data on March 28, 2026.

The group's attack methodology primarily leverages sophisticated voice phishing (vishing) and victim-branded credential harvesting sites to gain initial access by obtaining SSO credentials and MFA codes. Once inside, they target cloud-based SaaS applications — particularly Salesforce, Snowflake, and similar platforms — to exfiltrate sensitive data for extortion. Key member Sébastien Raoult was arrested and convicted in 2024, but the group has continued operations uninterrupted.

## Technical Analysis — Attack Techniques

Initial Access

Voice phishing (vishing) campaigns impersonating IT support
SSO credential harvesting via victim-branded phishing sites
Exploitation of misconfigured SaaS guest user permissions (particularly Salesforce Experience Cloud)
Purchase of stolen credentials from initial access brokers

Persistence & Collection

Abuse of cloud SaaS APIs for bulk data extraction
Targeting of Snowflake, Salesforce, Okta environments
Systematic scanning for misconfigured guest permissions
Telegram-based coordination for operational comms

Exfiltration & Extortion

Dark web data leak site (DLS) with countdown timers
Direct extortion demands before publication
Sale of stolen data on underground forums (formerly BreachForums)
Publication of sample data as pressure tactic

## Notable Breaches & Operations

Snowflake Campaign (2024-2025): Compromised 165+ customer environments via stolen credentials. Attackers gained access to Snowflake instances and systematically extracted sensitive customer data before publishing claims on underground forums.

Salesforce Campaign (Sept 2025 - March 2026): Targeted 300-400 organizations via misconfigured guest permissions. Leveraged Salesforce Experience Cloud configurations that inadvertently exposed sensitive business records to guest users.

SoundCloud (December 2025): 29.8 million user accounts exposed. Data included usernames, email addresses, and partially hashed passwords. ShinyHunters published samples on their DLS before selling full database to other threat actors.

Mixpanel (November 2025): Third-party analytics breach affecting multiple companies. ShinyHunters accessed Mixpanel's internal infrastructure and exfiltrated customer data from dozens of organizations using the platform.

Canada Goose: 600,000 customer records via third-party payment processor compromise. Payment card data and personal information accessed through supply chain vulnerability.

European Commission (March 2026): Published 340 GB of sensitive EU institutional data stolen via TeamPCP/Trivy compromise (CVE-2026-33634). This marked first major nation-state level data publication by ShinyHunters.

Additional Notable Claims: Cisco source code breach, AMD, Sony, Okta, and LastPass data claims. BreachForums operated by ShinyHunters administrators with threats to leak user data.

## MITRE ATT&CK Techniques

Enterprise Attack Framework

T1566.004 — Phishing: Spearphishing Voice (Vishing)
T1078 — Valid Accounts
T1078.004 — Valid Accounts: Cloud Accounts
T1213 — Data from Information Repositories
T1530 — Data from Cloud Storage
T1567 — Exfiltration Over Web Service
T1657 — Financial Theft (Extortion)
T1539 — Steal Web Session Cookie
T1528 — Steal Application Access Token

## Law Enforcement Actions

Sébastien Raoult (French National): Arrested in Morocco in May 2022, extradited to the United States, and pleaded guilty in January 2024 to conspiracy and aggravated identity theft. Sentenced to 3 years in federal prison and ordered to pay $5 million in restitution to victims. Despite his incarceration, ShinyHunters group operations continued and expanded, suggesting distributed command structure and multiple independent cells.

## Timeline

2020
Group Formation
ShinyHunters group emerges, begins data broker operations targeting mid-market and enterprise organizations.

2020–2023
Early Operations
Series of high-profile breaches across technology sector, establishing reputation as persistent data extortion group.

May 2022
Sébastien Raoult Arrested
Key ShinyHunters member Sébastien Raoult arrested in Morocco following international law enforcement investigation.

January 2024
Raoult Guilty Plea
Raoult pleads guilty to conspiracy and aggravated identity theft charges in federal court. Sentenced to 3 years imprisonment.

2024–2025
Snowflake Campaign
Large-scale campaign targeting Snowflake data warehouses via stolen credentials compromises 165+ customer environments.

September 2025
Salesforce Scanning Campaign
Organized scanning campaign targeting Salesforce instances with misconfigured guest user permissions begins.

November 2025
Mixpanel Breach
ShinyHunters accesses Mixpanel infrastructure, exfiltrates customer data affecting multiple organizations using the platform.

December 2025
SoundCloud Compromise
29.8 million SoundCloud user accounts exposed; data published on ShinyHunters data leak site with ransom demands.

Late January 2026
DLS Launch
New branded ShinyHunters data leak site launched on TOR network, marking shift to formalized extortion operations.

March 2026
Salesforce Campaign Peak
Salesforce campaign reaches peak activity with 300-400 total victim organizations compromised across enterprise segment.

March 28, 2026
EC Data Publication
ShinyHunters publishes 340 GB of sensitive European Commission institutional data on their DLS, exfiltrated via CVE-2026-33634.

## Group Profile Summary

Geography & Attribution: French and English-speaking operators believed operating from Eastern Europe. Mandiant tracks as UNC5537. Also known as ShinyCorp in some underground communities.

Operational Model: Hybrid data broker and extortion group. Data exfiltration followed by ransom demands with public DLS publication of samples and victim shaming. Recent evolution toward structured ransomware-style operations with countdown timers and public pressure tactics.

Infrastructure: TOR-hosted data leak site, underground forum accounts (BreachForums, other markets), Telegram channels for victim coordination, victim-branded credential harvesting infrastructure.

Approximate Victim Count: 400+ organizations by March 2026, spanning technology, finance, healthcare, government, manufacturing, and retail sectors globally.

References

1.
Google Cloud / Mandiant — Tracking the Expansion of ShinyHunters-Branded SaaS Data Theft
https://cloud.google.com/blog/topics/threat-intelligence/expansion-shinyhunters-saas-data-theft

2.
EclecticIQ — ShinyHunters Calling: Financially Motivated Data Extortion Group Targeting Enterprise Cloud Applications
https://blog.eclecticiq.com/shinyhunters-calling-financially-motivated-data-extortion-group-targeting-enterprise-cloud-applications

3.
Resecurity — ShinyHunters Launches Data Leak Site: Trinity of Chaos Announces New Ransomware Victims
https://www.resecurity.com/blog/article/shinyhunters-launches-data-leak-site-trinity-of-chaos-announces-new-ransomware-victims

4.
ZeroFox — Flash Report: Possible ShinyHunter SSO Phishing Campaign
https://www.zerofox.com/intelligence/flash-report-shinyhunters-sso-phishing-campaign/

5.
Wikipedia — ShinyHunters
https://en.wikipedia.org/wiki/ShinyHunters

Related Incidents
European Commission Cloud Breach
CVE-2026-33634 Analysis

Associated Aliases

ShinyHunters
UNC5537 (Mandiant)
ShinyCorp

Primary Targets

Technology
Finance
Healthcare
Government
Manufacturing
