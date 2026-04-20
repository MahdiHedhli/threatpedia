---
eventId: TP-2026-0026
title: LexisNexis AWS Cloud Breach via React2Shell Exploit
date: 2026-02-24
attackType: "Data Breach"
severity: high
sector: Legal / Government
geography: Global
threatActor: FulcrumSec
attributionConfidence: A4
reviewStatus: draft_ai
confidenceGrade: C
generatedBy: penfold-bot
generatedDate: 2026-04-20
cves: []
relatedSlugs:
  - "adobe-mr-raccoon-breach-2026"
  - "conduent-data-breach-2026"
tags:
  - "cloud"
  - "aws"
  - "react2shell"
  - "data-breach"
  - "legal"
  - "government"
  - "secrets-exposure"
  - "fulcrumsec"
sources:
  - url: https://www.theregister.com/2026/03/04/lexisnexis_legal_professional_confirms_data/
    publisher: The Register
    publisherType: media
    reliability: R2
    publicationDate: "2026-03-04"
  - url: https://www.scworld.com/brief/lexisnexis-legal-professional-confirms-data-breach-after-react2shell-exploit
    publisher: SC Media
    publisherType: media
    reliability: R2
    publicationDate: "2026-03-04"
  - url: https://www.lawnext.com/2026/03/lexisnexis-confirms-data-breach-reports-say-hackers-claim-access-to-government-and-law-firm-user-data.html
    publisher: LawSites
    publisherType: vendor
    reliability: R2
    publicationDate: "2026-03-05"
  - url: https://www.cisa.gov/news-events/alerts/2026/03/06/lexisnexis-vulnerability
    publisher: CISA
    publisherType: government
    reliability: R1
    publicationDate: "2026-03-06"
mitreMappings:
  - techniqueId: T1190
    techniqueName: "Exploit Public-Facing Application"
    tactic: initial-access
  - techniqueId: T1078
    techniqueName: "Valid Accounts"
    tactic: privilege-escalation
  - techniqueId: T1530
    techniqueName: "Data from Cloud Storage Object"
    tactic: collection
  - techniqueId: T1537
    techniqueName: "Transfer Data to Cloud Account"
    tactic: exfiltration
  - techniqueId: T1552.005
    techniqueName: "Unsecured Credentials"
    tactic: credential-access
---

## Summary

On February 24, 2026, threat actor FulcrumSec exploited a React2Shell vulnerability in an unpatched React frontend application to gain unauthorized access to LexisNexis Legal & Professional's AWS infrastructure. LexisNexis confirmed the breach on March 3, 2026, acknowledging data had been exfiltrated from their cloud environment. The attacker extracted approximately 2.04 GB of structured data, including 536 Redshift database tables, over 430 VPC database tables, 53 plaintext AWS Secrets Manager secrets, and comprehensive VPC topology metadata. FulcrumSec also claimed access to around 400,000 cloud user profiles containing 118 users with .gov email addresses.

## Technical Analysis

The React2Shell vulnerability in the unpatched React frontend application permitted remote code execution (RCE) on the web server. This allowed FulcrumSec to execute arbitrary system commands within the web application context, which maintained sufficient permissions to access AWS APIs. The attacker extracted 53 plaintext AWS Secrets Manager keys and used the compromised IAM credentials to authenticate to AWS endpoints. From there, they enumerated and queried Redshift and RDS instances, subsequently exporting database tables to an external location.

## Attack Chain

### Stage 1: Public Exploitation
Attacker weaponized the React2Shell vulnerability against LexisNexis' external web applications, acquiring initial RCE access.

### Stage 2: Secrets Extraction
The attacker retrieved 53 plaintext AWS Secrets Manager secrets containing critical database connection strings and sensitive IAM credentials.

### Stage 3: Reconnaissance & Enumeration
Using active IAM roles, the attacker mapped the complete 430+ VPC infrastructure and its interconnected Redshift topology.

### Stage 4: Massive Exfiltration
The attacker directly exported 2.04 GB of data from databases and cloud staging buckets over several days before detection.

## Impact Assessment

Data exfiltrated encompassed roughly 3.9 million database records and 21,042 customer accounts. Most sensitive was the theft of 400,000 user profiles, including 118 verified .gov emails tied to federal judges, SEC staff, and DOJ attorneys. LexisNexis classified the stolen databanks as legacy repositories containing pre-2020 information. However, the revelation of deep AWS infrastructure keys (53 explicit secrets) and user roles fundamentally degraded trust in LexisNexis cloud architecture and posed significant follow-on systemic risks. Active financial data and unencrypted passwords were reportedly unaffected.

## Attribution

FulcrumSec, a well-documented threat actor known for targeting cloud infrastructure and exploiting web framework CVEs, explicitly took credit for the attack. The tactical progression (RCE -> Cloud Pivot -> High-volume exfil) matched their historical modus operandi closely. Attribution confidence is logged as A4.

## Timeline

### 2026-02-24 — Event
Initial Exploitation: FulcrumSec exploits React2Shell vulnerability in the LexisNexis React frontend application.

### 2026-02-25 — Event
Credential Discovery: Attacker extracts 53 plaintext AWS Secrets Manager secrets containing IAM credentials.

### 2026-02-25 — Event
Data Exfiltration Begins: FulcrumSec systematically exfiltrates 2.04 GB of data across Redshift and VPC databases.

### 2026-03-03 — Event
Public Disclosure: LexisNexis confirms data breach to customers and regulators following containment.

### 2026-03-04 — Event
Threat Actor Claims: FulcrumSec publishes claims of accessing federal judge and SEC staff accounts on their leak portal.

## Remediation & Mitigation

LexisNexis immediately patched the React2Shell vulnerability across their internet-facing applications and performed a mandatory global revocation of all potentially exposed AWS credentials. Extensive mitigation efforts include implementing SLA-based rigorous web app patching, deploying updated Web Application Firewalls targeting React2Shell execution patterns, and migrating plaintext secrets to envelope-encrypted secret configurations requiring explicit KMS decoupling. Legal tech sector firms should audit legacy infrastructure data-retention schedules periodically to prevent large-scale exposure.

## Sources & References

- [The Register: LexisNexis Legal & Professional confirms data breach](https://www.theregister.com/2026/03/04/lexisnexis_legal_professional_confirms_data/)
- [SC Media: LexisNexis confirms data breach after React2Shell exploit](https://www.scworld.com/brief/lexisnexis-legal-professional-confirms-data-breach-after-react2shell-exploit)
- [LawSites: LexisNexis Says Data Breach Has Been Contained](https://www.lawnext.com/2026/03/lexisnexis-confirms-data-breach-reports-say-hackers-claim-access-to-government-and-law-firm-user-data.html)
- [CISA: React2Shell Incident Advisory](https://www.cisa.gov/news-events/alerts/2026/03/06/lexisnexis-vulnerability)
