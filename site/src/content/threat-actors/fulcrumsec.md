---
name: "FulcrumSec"
aliases: []
affiliation: "Cybercriminal"
motivation: "Data Theft / Extortion"
status: active
country: "Unknown"
firstSeen: "2026-02"
lastSeen: "2026-03"
targetSectors:
  - "Legal"
  - "Government"
  - "Insurance"
  - "Higher Education"
targetGeographies:
  - "United States"
  - "Europe"
tools:
  - "React2Shell exploit (CVE-2025-55182)"
  - "AWS Secrets Manager"
  - "AWS Redshift"
mitreMappings:
  - techniqueId: "T1190"
    techniqueName: "Exploit Public-Facing Application"
    tactic: "Initial Access"
    notes: "Exploitation of React2Shell (CVE-2025-55182), a CVSS 10.0 RCE flaw in React Server Components."
  - techniqueId: "T1611"
    techniqueName: "Escape to Host"
    tactic: "Privilege Escalation"
    notes: "Leveraged permissions within a compromised React container to access the underlying host and AWS environment."
  - techniqueId: "T1530"
    techniqueName: "Data from Cloud Storage Object"
    tactic: "Collection"
    notes: "Systematic extraction of records from VPC databases and Redshift tables."
  - techniqueId: "T1567.003"
    techniqueName: "Exfiltration Over Web Service: Exfiltration to Public Sites"
    tactic: "Exfiltration"
    notes: "Leaked stolen data and manifestos via public links after failed extortion attempts."
attributionConfidence: A3
attributionRationale: "FulcrumSec is a self-identified intrusion cluster that emerged during the LexisNexis React2Shell breach. The group's identity is defined by their specific TTPs, including the use of manifestos and public shaming."
reviewStatus: "draft_ai"
generatedBy: "dangermouse-bot"
generatedDate: 2026-04-21
tags:
  - "fulcrumsec"
  - "lexisnexis"
  - "react2shell"
  - "cloud-extortion"
  - "aws"
sources:
  - url: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2025-12-05"
    accessDate: "2026-04-21"
    archived: false
  - url: "https://www.scworld.com/brief/lexisnexis-legal-professional-confirms-data-breach-after-react2shell-exploit"
    publisher: "SC Media"
    publisherType: media
    reliability: R1
    publicationDate: "2026-03-04"
    accessDate: "2026-04-21"
    archived: false
  - url: "https://www.theregister.com/2026/03/04/lexisnexis_legal_professional_confirms_data/"
    publisher: "The Register"
    publisherType: media
    reliability: R1
    publicationDate: "2026-03-04"
    accessDate: "2026-04-21"
    archived: false
---

## Executive Summary

FulcrumSec is an emerging cybercriminal intrusion set that gained public prominence in early 2026 following a high-profile data breach of LexisNexis Legal & Professional. The group is characterized by its focus on cloud-native exploitation and an aggressive extortion model that utilizes public "manifestos" to shame victims and damage their competitive standing.

The group demonstrates proficiency in "living off the cloud," leveraging compromised container environments to pivot into broader AWS infrastructure. FulcrumSec's primary lever is the threat of leaking sensitive commercial relationships and internal security failures, positioning themselves as a specialized data theft and reputation-damage franchise.

## Notable Campaigns

### 2026: LexisNexis React2Shell Intrusion

In February 2026, FulcrumSec claimed responsibility for exfiltrating approximately 2.04 GB of data from LexisNexis’s Legal & Professional division. The group gained initial access on February 24, 2026, by exploiting React2Shell (CVE-2025-55182), a critical remote code execution vulnerability in React Server Components.

The breach exposed over 3.9 million database records, including 400,000 cloud user profiles and sensitive data belonging to high-profile legal and government entities, including U.S. federal judges and attorneys at the Department of Justice. After LexisNexis refused ransom negotiations, FulcrumSec published a manifesto mocking the company's internal security posture, including the use of weak administrative passwords ("Lexis1234") and permissive AWS IAM policies.

## Technical Capabilities

FulcrumSec's technical tradecraft focuses on the discovery and exploitation of unpatched vulnerabilities in modern web application stacks, specifically targeting containerized environments. They demonstrate a high degree of familiarity with AWS-native services, including Secrets Manager, Redshift, and VPC database structures.

The group's methodology involves gaining a foothold in an edge-facing container and then systematically mapping the surrounding cloud infrastructure. They prioritize the extraction of credentials and identity tokens to maintain persistent access without the need for traditional malware. Their exfiltration patterns blend with legitimate cloud management traffic, making detection difficult for organizations without robust container-level monitoring and IAM auditing.

## Attribution

FulcrumSec is currently assessed as a criminal entity with unknown geographic origins. The group's identity is intrinsically linked to the "FulcrumSec" brand and their specific communication style, which combines technical mockery with targeted data leaks. While CISA added the React2Shell vulnerability to the KEV catalog in December 2025 citing China-nexus APT exploitation, FulcrumSec appears to be a distinct, financially motivated criminal cluster utilizing the same vulnerability for extortion.

## MITRE ATT&CK Profile

### Initial Access

T1190 - Exploit Public-Facing Application: Initial entry was achieved via the exploitation of the React2Shell vulnerability (CVE-2025-55182) in a customer-facing React container.

### Privilege Escalation

T1611 - Escape to Host: The group successfully leveraged the compromised container environment to access the underlying host and broader AWS network.

### Collection

T1530 - Data from Cloud Storage Object: FulcrumSec systematically queried and exfiltrated data from 17 VPC databases and over 500 Redshift tables.

### Exfiltration

T1567.003 - Exfiltration Over Web Service: Exfiltration to Public Sites: The group used public manifestos and data hosting links to pressure the victim after ransom negotiations failed.

## Sources & References

- [CISA: Known Exploited Vulnerabilities Catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) — CISA, 2025-12-05
- [SC Media: LexisNexis Legal & Professional confirms data breach after React2Shell exploit](https://www.scworld.com/brief/lexisnexis-legal-professional-confirms-data-breach-after-react2shell-exploit) — SC Media, 2026-03-04
- [The Register: LexisNexis confirms 'limited' data breach after hackers claim to have pilfered 2GB](https://www.theregister.com/2026/03/04/lexisnexis_legal_professional_confirms_data/) — The Register, 2026-03-04
