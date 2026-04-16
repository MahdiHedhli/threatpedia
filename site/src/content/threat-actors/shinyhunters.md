---
name: "ShinyHunters"
aliases:
  - "Shiny Hunters"
affiliation: "Unknown (Cybercrime)"
motivation: "Financial"
status: active
country: "Unknown"
firstSeen: "2020"
lastSeen: "2026"
targetSectors:
  - "Technology"
  - "Retail"
  - "Finance"
  - "Media"
  - "Education"
targetGeographies:
  - "Global"
  - "United States"
  - "South America"
  - "Asia-Pacific"
tools:
  - "GitHub Scraping Scripts"
  - "Credential Stuffing Tools"
  - "Cloud Storage Exfiltrators"
mitreMappings:
  - techniqueId: "T1567.002"
    techniqueName: "Exfiltration Over Web Service: Exfiltration to Cloud Storage"
    tactic: "Exfiltration"
    notes: "Frequently exfiltrates large databases directly from compromised AWS S3 buckets or Azure Blob storage to attacker-controlled cloud instances."
  - techniqueId: "T1078.004"
    techniqueName: "Valid Accounts: Cloud Accounts"
    tactic: "Initial Access"
    notes: "Gains access to sensitive databases by acquiring administrative credentials for cloud service providers through credential stuffing or phishing."
  - techniqueId: "T1213.002"
    techniqueName: "Data from Information Repositories: Sharepoint/Confluence"
    tactic: "Collection"
    notes: "Focuses on identifying and collection sensitive configuration files and API keys hidden within corporate development environments and internal wikis."
attributionConfidence: A2
attributionRationale: "Identified as a high-volume data theft and extortion cluster by Microsoft and Mandiant. The group is characterized by its focus on cloud-native organizations and its use of high-profile data leak forums (such as BreachForums) to monetize stolen assets."
reviewStatus: "draft_ai"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "shinyhunters"
  - "data-leak"
  - "cloud-security"
  - "extortion"
  - "ticketmaster-hack"
  - "breachforums"
sources:
  - url: "https://www.justice.gov/opa/pr/french-national-sentenced-five-years-prison-conspiracy-commit-wire-fraud-and-aggravated"
    publisher: "US Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2024-02-06"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.fbi.gov/news/press-releases/fbi-announces-investigation-into-ticketmaster-data-breach"
    publisher: "FBI"
    publisherType: government
    reliability: R1
    publicationDate: "2024-05-31"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.mandiant.com/resources/blog/shinyhunters-leaks-massive-databases"
    publisher: "Mandiant"
    publisherType: vendor
    reliability: R1
    publicationDate: "2020-05-18"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://attack.mitre.org/groups/G1028/"
    publisher: "MITRE ATT&CK"
    publisherType: community
    reliability: R2
    publicationDate: "2024-06-15"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

ShinyHunters is a prolific and highly successful cybercrime group that specializing in large-scale data breaches and extortion of high-profile technology and retail companies. Since its emergence in early 2020, the group has been responsible for the theft and subsequent sale of personal information belonging to hundreds of millions of individuals globally. Unlike ransomware groups that focus on encryption, ShinyHunters primarily focuses on the theft of sensitive databases from cloud storage environments to sell on underground forums.

The group is characterized by its technical agility and its focus on cloud-native infrastructure. They have a proven track record of identifying poorly secured cloud databases and exploiting misconfigured development environments (such as GitHub) to harvest administrative credentials. ShinyHunters is also closely linked to the administration and operation of major data-leak forums, most notably **BreachForums**.

## Notable Campaigns

### Ticketmaster and Santander Data Breaches (2024)
In mid-2024, ShinyHunters claimed responsibility for the breach of **Ticketmaster** and **Santander Bank**. In the Ticketmaster attack, the group allegedly exfiltrated a massive database containing the personal and financial information of over 560 million customers. The group demanded a $500,000 ransom to prevent the sale of the data. Both attacks were linked to the compromise of a third-party cloud service provider (Snowflake) that hosted the victims' data, showcasing the group's ability to execute high-impact supply chain compromises.

### The 2020-2021 Data Theft Surge
During its initial years of operation, ShinyHunters executed a series of lightning-fast breaches against numerous high-revenue targets, including **Microsoft** (the GitHub repository), **Tokopedia**, **Wattpad**, and **Pixlr**. In these campaigns, the group often released a "free" sample of the stolen data on illicit forums to prove the validity of the breach before auctioning the full database to the highest bidder. These operations caused significant reputational and financial damage to the affected organizations and forced widespread password resets.

## Technical Capabilities

ShinyHunters' technical methodology is focused on the exploitation of cloud-based assets. They are experts at identifying publicly exposed **AWS S3 buckets**, **Azure Blobs**, and **Google Cloud** storage instances that contain sensitive backups or configuration files. They frequently utilize custom scripts to scrape public **GitHub** repositories for accidentally committed API keys, tokens, and hard-coded credentials that provide administrative access to corporate cloud environments.

The group also makes extensive use of **credential stuffing** attacks, utilizing large databases of previously leaked credentials to gain access to employee accounts that do not have multi-factor authentication (MFA) enabled. Once they gain a foothold, they move rapidly to exfiltrate database contents using legitimate cloud management utilities, which allows their activity to blend in with authorized administrative tasks.

## Attribution

ShinyHunters is a decentralized cybercrime syndicate with members believed to be located in several countries, including France, Canada, and Morocco. In early 2024, a major attribution milestone was reached when **Sebastien Raoult** (alias "LaurenS"), a French national and a key member of the group, was sentenced to five years in U.S. federal prison for his role in the group's wire fraud and identity theft conspiracy.

Despite this sentencing, the core of the group remains active. ShinyHunters has long been associated with the individuals who operated **RaidForums** and its successor, **BreachForums**. The group's ability to maintain its operational tempo despite law enforcement pressure and the shutdown of its preferred monetization platforms demonstrates a high level of resilience and a deep integration into the global cybercrime ecosystem.

## MITRE ATT&CK Profile

ShinyHunters tradecraft focuses on database collection and cloud exploitation:

- **T1078.004 (Valid Accounts: Cloud Accounts):** Using harvested credentials or API keys to gain access to corporate cloud storage.
- **T1567.002 (Exfiltration Over Web Service: Exfiltration to Cloud Storage):** Moving stolen data from a victim's cloud environment to attacker-controlled cloud infrastructure.
- **T1213.002 (Data from Information Repositories: Sharepoint/GitHub):** Identifying sensitive configuration data and keys in development repositories.
- **T1530 (Data from Cloud Storage Object):** Directly accessing and downloading large-scale databases from misconfigured cloud storage services.

## Sources & References

- [US Department of Justice: French National Sentenced for Role in ShinyHunters Conspiracy](https://www.justice.gov/opa/pr/french-national-sentenced-five-years-prison-conspiracy-commit-wire-fraud-and-aggravated) — US Department of Justice, 2024-02-06
- [FBI: Investigation into Ticketmaster Data Breach Linked to ShinyHunters](https://www.fbi.gov/news/press-releases/fbi-announces-investigation-into-ticketmaster-data-breach) — FBI, 2024-05-31
- [Mandiant: ShinyHunters Leaks Massive Databases From Numerous Tech Firms](https://www.mandiant.com/resources/blog/shinyhunters-leaks-massive-databases) — Mandiant, 2020-05-18
- [MITRE ATT&CK: ShinyHunters (Group G1028)](https://attack.mitre.org/groups/G1028/) — MITRE ATT&CK, 2024-06-15
- [Snowflake Security: Alert — Investigation into Targeted Attacks Against Client Accounts](https://www.snowflake.com/blog/snowflake-security-update-investigation-into-targeted-attacks/) — Snowflake, 2024-06-02
