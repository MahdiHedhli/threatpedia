---
eventId: TP-2026-0026
title: LexisNexis AWS Cloud Breach via React2Shell Exploit
date: 2026-02-24
attackType: data-breach
severity: high
sector: Legal / Government / Information Services
geography: United States (Global)
threatActor: FulcrumSec
attributionConfidence: A4
reviewStatus: draft_ai
confidenceGrade: C
generatedBy: dangermouse-bot
generatedDate: 2026-04-21
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
mitreMappings:
  - techniqueId: "T1190"
    techniqueName: "Exploit Public-Facing Application"
    tactic: "Initial Access"
    notes: "React2Shell vulnerability exploited in the unpatched React frontend application to obtain RCE on the web server."
  - techniqueId: "T1552.005"
    techniqueName: "Unsecured Credentials: Cloud Instance Metadata API"
    tactic: "Credential Access"
    notes: "53 plaintext AWS Secrets Manager secrets extracted following RCE, providing IAM credentials and database connection strings."
  - techniqueId: "T1078.004"
    techniqueName: "Valid Accounts: Cloud Accounts"
    tactic: "Defense Evasion"
    notes: "Stolen IAM credentials used to authenticate to AWS APIs and enumerate Redshift, RDS, EC2, and S3 resources."
  - techniqueId: "T1530"
    techniqueName: "Data from Cloud Storage Object"
    tactic: "Collection"
    notes: "Exfiltration of approximately 2.04 GB across 536 Redshift tables, 430+ VPC database tables, and associated cloud user-profile stores."
sources:
  - url: "https://www.theregister.com/2026/03/04/lexisnexis_legal_professional_confirms_data/"
    publisher: "The Register"
    publisherType: media
    reliability: R1
    publicationDate: "2026-03-04"
    accessDate: "2026-04-21"
    archived: false
  - url: "https://www.scworld.com/brief/lexisnexis-legal-professional-confirms-data-breach-after-react2shell-exploit"
    publisher: "SC Media"
    publisherType: media
    reliability: R1
    publicationDate: "2026-03-04"
    accessDate: "2026-04-21"
    archived: false
  - url: "https://www.lawnext.com/2026/03/lexisnexis-confirms-data-breach-reports-say-hackers-claim-access-to-government-and-law-firm-user-data.html"
    publisher: "LawSites"
    publisherType: media
    reliability: R2
    publicationDate: "2026-03-04"
    accessDate: "2026-04-21"
    archived: false
  - url: "https://cyberpress.org/lexisnexis-data-breach/"
    publisher: "CyberPress"
    publisherType: media
    reliability: R2
    publicationDate: "2026-03-05"
    accessDate: "2026-04-21"
    archived: false
  - url: "https://www.idstrong.com/sentinel/lexisnexis-data-breach/"
    publisher: "IDStrong"
    publisherType: research
    reliability: R2
    publicationDate: "2026-03-05"
    accessDate: "2026-04-21"
    archived: false
  - url: "https://www.rescana.com/post/lexisnexis-aws-data-breach-2026-react2shell-exploit-exposes-legacy-data-in-cloud-hack"
    publisher: "Rescana"
    publisherType: research
    reliability: R2
    publicationDate: "2026-03-06"
    accessDate: "2026-04-21"
    archived: false
  - url: "https://www.cisa.gov/resources-tools/services/secure-cloud-business-applications-scuba-project"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2023-04-10"
    accessDate: "2026-04-21"
    archived: false
---
## Summary

On or around February 24, 2026, threat actor FulcrumSec exploited a React2Shell vulnerability in an unpatched React frontend application to gain unauthorized access to LexisNexis Legal & Professional's Amazon Web Services (AWS) infrastructure. LexisNexis confirmed the breach on March 3, 2026, acknowledging that legitimate data had been exfiltrated from their cloud environment.

The attacker exfiltrated approximately 2.04 GB of structured data including 536 Redshift database tables, over 430 VPC database tables, 53 plaintext AWS Secrets Manager secrets, approximately 3.9 million database records, 21,042 customer accounts, and 5,582 attorney survey respondents with IP addresses. FulcrumSec also claimed access to around 400,000 cloud user profiles containing real names, emails, phone numbers, and job functions — including 118 users with .gov email addresses belonging to U.S. government employees, federal judges, Department of Justice attorneys, and SEC staff.

LexisNexis stated that the compromised data primarily consisted of legacy, deprecated information from before 2020, and that no sensitive PII such as Social Security numbers, driver's license numbers, financial data, active passwords, or customer search queries were included. The exposure of government user profiles, AWS infrastructure secrets, and the complete VPC infrastructure map nonetheless presents material follow-on risk to affected organizations and government agencies.

## Technical Analysis

The decisive technical failure was a **React2Shell** remote-code-execution vulnerability in an unpatched React frontend application. React2Shell allowed FulcrumSec to execute arbitrary system commands within the context of the web application process, which was running with permissions sufficient to reach AWS APIs and configuration stores.

Once RCE was established, the attack converted to a cloud-credential path: 53 plaintext secrets were read from AWS Secrets Manager. These included IAM access keys and database connection strings, enabling direct authentication to AWS control and data planes. From that foothold, FulcrumSec enumerated and extracted 536 Redshift tables, mapped 430+ VPC-hosted databases, and pivoted across EC2 / RDS / S3 surfaces within the affected AWS accounts.

The compromise breaks naturally into six stages documented under Attack Chain below. The defining characteristic of the incident is how rapidly an unpatched frontend web flaw became a full AWS-control-plane compromise once credentials were recoverable in plaintext from a managed secrets service — a credential-hygiene failure more than an AWS-product failure.

## Attack Chain

### Stage 1: Public-facing exploitation

FulcrumSec exploits the React2Shell RCE in the unpatched React frontend to execute arbitrary commands inside the web application process.

### Stage 2: Credential theft from AWS Secrets Manager

The web application's AWS role permits reads against Secrets Manager. FulcrumSec extracts 53 plaintext secrets — API keys, IAM credentials, and database connection strings.

### Stage 3: Cloud-plane authentication

Stolen IAM credentials authenticate directly to AWS APIs. The scope of the compromised role enables enumeration of Redshift, RDS, EC2, and S3 resources in the affected accounts.

### Stage 4: Data-warehouse extraction

536 Redshift tables are enumerated and extracted, along with 430+ VPC-hosted database tables. Volume reaches approximately 2.04 GB of structured data across 3.9 million records.

### Stage 5: Topology mapping and lateral reach

Attacker builds a complete VPC topology map and reaches EC2 instances, RDS databases, and S3 buckets via the compromised IAM credentials. No customer-managed encryption keys gate access to the extracted secrets in this deployment.

### Stage 6: Claim and disclosure

FulcrumSec publicly claims access to approximately 400,000 cloud user profiles, including 118 .gov accounts belonging to federal judges, DOJ attorneys, and SEC staff. LexisNexis confirms the breach on March 3, 2026, citing legacy-only data.

## Impact Assessment

**Data exposed.** Approximately 2.04 GB of structured data; around 400,000 cloud user profiles (names, emails, phone numbers, job functions); 118 .gov user accounts including federal judges, DOJ attorneys, SEC staff, and other government employees; 21,042 customer accounts in the Redshift data warehouse; 5,582 attorney survey respondents with associated IP addresses; and 3.9 million database records across Redshift and VPC tables.

**Infrastructure compromise.** 53 AWS Secrets Manager secrets exposed in plaintext; complete VPC topology captured; reported 45 employee password hashes exfiltrated from internal systems; durable access to Redshift, RDS, EC2, and S3 across multiple AWS accounts until credentials were rotated.

**Risk posture.** Federal judges, DOJ attorneys, and SEC staff are now known to be in an attacker database, creating targeted phishing and social-engineering risk. The infrastructure map plus rotated-but-previously-exposed secrets increase the cost of full remediation. Customer confidence in a major legal-research and government-data vendor is directly affected.

**Data classification per LexisNexis.** LexisNexis stated the compromised material did *not* include Social Security numbers, driver's license numbers, financial account numbers, active passwords, or customer search histories, and was primarily pre-2020 legacy data.

## Attribution

**Confidence: A4 (uncategorized).** FulcrumSec has publicly claimed the breach and published proof-of-access material consistent with the exfiltrated dataset descriptions reported by The Register, SC Media, and follow-on media. LexisNexis has confirmed the breach but has not publicly attributed it to a named actor. No U.S. government advisory has, at time of writing, named FulcrumSec in connection with this incident.

Public reporting characterizes FulcrumSec as a data-theft cluster specializing in cloud-infrastructure compromise and web-application exploitation, with a pattern of publishing claims and partial proof-of-access against named targets. That characterization derives from FulcrumSec's own public posture and the vendor reporting cited; it is not independently confirmed by a government source.

## Timeline

### 2026-02-24 — Initial exploitation

FulcrumSec exploits the React2Shell vulnerability in the LexisNexis React frontend, gaining RCE on the web server.

### 2026-02-24 – 2026-02-25 — Credential discovery

Attacker extracts 53 plaintext AWS Secrets Manager secrets, including IAM credentials and database connection strings.

### 2026-02-25 – 2026-03-02 — Data exfiltration

FulcrumSec systematically exfiltrates 2.04 GB across Redshift tables, VPC databases, and cloud user-profile stores over several days using the compromised AWS credentials.

### 2026-03-03 — Public disclosure

LexisNexis confirms the data breach to customers and regulators, stating the incident has been discovered and contained.

### 2026-03-04 — Media coverage

The Register and SC Media publish detailed coverage of the breach, reporting exposed data types and FulcrumSec's public claims.

### 2026-03-04 — Threat-actor claims

FulcrumSec publishes claims of access to 400,000 cloud user profiles including 118 .gov accounts belonging to federal judges, DOJ attorneys, and SEC staff.

### 2026-03 — Containment confirmed

LexisNexis states the React2Shell vulnerability has been patched and AWS infrastructure access has been secured, characterizing compromised data as legacy / deprecated pre-2020 information.

## Remediation & Mitigation

**Immediate actions (per LexisNexis and public reporting).** React2Shell patched in frontend applications. All compromised AWS credentials and secrets rotated. Temporary restrictions applied to cloud data access. Full AWS configuration audit and forensic investigation initiated.

**Hardening guidance for similarly-exposed organizations.**

- Patch discipline for public-facing web frameworks: React2Shell had patches available; lagging rollout was the decisive failure.
- WAF signatures against the React2Shell exploitation pattern; runtime protections on the frontend process.
- Eliminate plaintext secrets in AWS Secrets Manager: use customer-managed KMS envelope encryption, key rotation, and application-level decryption paths that can log access.
- Tighten web-application IAM scope: the web tier should not have broad Secrets Manager read permissions; use per-secret policies and the smallest blast-radius role feasible.
- Reduce legacy-data retention: the bulk of the exfiltrated material was pre-2020. Aggressive aging-out of deprecated data shrinks the exposure surface.
- Continuous vulnerability scanning for internet-facing applications and CI-integrated SCA.
- Cloud detection-and-response coverage for anomalous IAM authentication, cross-region API calls, and Secrets Manager read bursts.

**Wider lessons.** Even "non-sensitive" user-profile data becomes operationally critical when it associates named government employees with employer and contact information. Cloud-credential hygiene — especially around Secrets Manager — is the control that most directly determined the blast radius here; the web-framework flaw was merely the entry point.

## Sources & References

- [The Register: LexisNexis Legal & Professional confirms data breach](https://www.theregister.com/2026/03/04/lexisnexis_legal_professional_confirms_data/) — The Register, 2026-03-04
- [SC Media: LexisNexis Legal & Professional confirms data breach after React2Shell exploit](https://www.scworld.com/brief/lexisnexis-legal-professional-confirms-data-breach-after-react2shell-exploit) — SC Media, 2026-03-04
- [LawSites: LexisNexis Says Data Breach Has Been Contained](https://www.lawnext.com/2026/03/lexisnexis-confirms-data-breach-reports-say-hackers-claim-access-to-government-and-law-firm-user-data.html) — LawSites, 2026-03-04
- [CyberPress: LexisNexis Data Breach — Threat Actor Claims Theft of 2.04 GB of Data](https://cyberpress.org/lexisnexis-data-breach/) — CyberPress, 2026-03-05
- [IDStrong: LexisNexis AWS Data Breach Exposes 400,000 Cloud User Profiles](https://www.idstrong.com/sentinel/lexisnexis-data-breach/) — IDStrong, 2026-03-05
- [Rescana: LexisNexis AWS Data Breach 2026 — React2Shell Exploit Exposes Legacy Data](https://www.rescana.com/post/lexisnexis-aws-data-breach-2026-react2shell-exploit-exposes-legacy-data-in-cloud-hack) — Rescana, 2026-03-06
- [CISA: Secure Cloud Business Applications (SCuBA) — cloud-hardening guidance for secrets management and identity abuse (corroborating defensive reference, not LexisNexis-specific)](https://www.cisa.gov/resources-tools/services/secure-cloud-business-applications-scuba-project) — CISA, 2023-04-10
