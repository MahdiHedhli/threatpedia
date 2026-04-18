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
reviewStatus: under_review
confidenceGrade: C
generatedBy: new-threat-intel-automation
generatedDate: 2026-02-24
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
---
## Executive Summary

On or around February 24, 2026, threat actor FulcrumSec exploited a React2Shell vulnerability in an unpatched React frontend application to gain unauthorized access to LexisNexis Legal & Professional's Amazon Web Services (AWS) infrastructure. LexisNexis confirmed the breach on March 3, 2026, acknowledging that legitimate data had been exfiltrated from their cloud environment.

The attacker exfiltrated approximately 2.04 GB of structured data including 536 Redshift database tables, over 430 VPC database tables, 53 plaintext AWS Secrets Manager secrets, approximately 3.9 million database records, 21,042 customer accounts, and 5,582 attorney survey respondents with IP addresses. FulcrumSec also claimed access to around 400,000 cloud user profiles containing real names, emails, phone numbers, and job functions — including 118 users with .gov email addresses belonging to U.S. government employees, federal judges, Department of Justice attorneys, and SEC staff.

LexisNexis stated that the compromised data primarily consisted of legacy, deprecated information from before 2020, and that no sensitive PII such as Social Security numbers, driver's license numbers, financial data, active passwords, or customer search queries were included. However, the exposure of government user profiles, AWS infrastructure secrets, and the complete VPC infrastructure map raises significant concerns about potential follow-on attacks and the security posture of legal technology platforms serving government clients.

## Technical Analysis

Attack Vector: React2Shell Vulnerability
The React2Shell vulnerability in the unpatched React frontend application allowed remote code execution (RCE) on the web server. This critical flaw enabled FulcrumSec to execute arbitrary system commands within the context of the web application, which was running with credentials or permissions sufficient to access AWS APIs and configuration.

Infrastructure Compromise Chain

Initial Access: React2Shell RCE in unpatched React frontend application
Credential Theft: Extraction of 53 plaintext AWS Secrets Manager secrets containing API keys and IAM credentials
Cloud Pivot: Use of compromised credentials to authenticate to AWS API endpoints
Data Warehouse Access: Enumeration and extraction of 536 Redshift database tables
VPC Mapping: Reconnaissance of 430+ VPC-hosted database tables and complete infrastructure topology
Lateral Movement: Access to EC2 instances, RDS databases, and S3 storage via compromised IAM credentials
Secrets Exfiltration: Extraction of plaintext secrets from AWS Secrets Manager intended for database authentication

Data Exfiltrated

Redshift Tables
536

VPC Databases
430+

Secrets Exposed
53

Database Records
3.9M

Customer Accounts
21,042

Cloud User Profiles
~400K

Threat Actor Profile: FulcrumSec
FulcrumSec is a sophisticated threat actor known for targeting cloud infrastructure and exploiting unpatched vulnerabilities in web applications. The group specializes in:

Identifying and weaponizing public-facing vulnerabilities in web frameworks
Pivoting from web applications into cloud environments
Extracting cloud credentials and secrets for lateral movement
Large-scale data exfiltration from databases and data warehouses
Publishing breach claims and partial proof-of-access to pressure targets

## MITRE ATT&CK Mapping

T1190
Exploit Public-Facing Application - React2Shell vulnerability exploitation in frontend

T1078
Valid Accounts - Use of compromised AWS credentials and secrets

T1530
Data from Cloud Storage Object - Extraction from Redshift and RDS

T1537
Transfer Data to Cloud Account - Potential staging in attacker-controlled cloud

T1552.005
Unsecured Credentials - Plaintext secrets in Secrets Manager

T1005
Data from Local System - Database access and enumeration

## Timeline

February 24, 2026
Initial Exploitation - FulcrumSec exploits React2Shell vulnerability in LexisNexis React frontend application, gaining remote code execution on web server.

February 24-25, 2026
Credential Discovery - Attacker extracts 53 plaintext AWS Secrets Manager secrets containing IAM credentials and database connection strings.

February 25 - March 2, 2026
Data Exfiltration - Using compromised AWS credentials, FulcrumSec systematically exfiltrates 2.04 GB of data including Redshift tables, VPC databases, and cloud user profiles over multiple days.

March 3, 2026
Public Disclosure - LexisNexis confirms data breach to customers and regulators, stating the incident was discovered and contained.

March 4, 2026
Media Coverage - The Register and SC Media publish detailed coverage of the breach, reporting on exposed data and threat actor claims.

March 4, 2026
Threat Actor Claims - FulcrumSec publishes claims of accessing 400,000 cloud user profiles including 118 .gov accounts belonging to federal judges, DOJ attorneys, and SEC staff.

March 2026
Containment Confirmed - LexisNexis states the React2Shell vulnerability has been patched and AWS infrastructure access has been secured. The company claims compromised data was legacy/deprecated information from before 2020.

## Impact Assessment

Data Exposure

2.04 GB of structured data exfiltrated
~400,000 cloud user profiles accessed, containing real names, emails, phone numbers, job functions
118 .gov email accounts included federal judges, DOJ attorneys, SEC staff, and other government employees
21,042 customer accounts in Redshift data warehouse
5,582 attorney survey respondents with associated IP addresses
3.9 million database records from various Redshift and VPC tables

Infrastructure Compromise

53 AWS Secrets Manager secrets exposed in plaintext, including database credentials and API keys
Complete VPC infrastructure map and topology obtained by attacker
45 employee password hashes exfiltrated from internal systems
Access to Redshift, RDS, EC2, and S3 resources across multiple AWS accounts

Risk Assessment

Government Exposure: Federal judges, DOJ attorneys, and SEC staff are now known to be in an attacker database, creating targeted phishing and social engineering risks
Follow-on Attacks: Complete AWS infrastructure maps and secrets enable sophisticated lateral movement attacks and privilege escalation
Reputational Damage: As a major provider of legal research and government data services, LexisNexis' security failure undermines trust in the sector
Regulatory Exposure: Disclosure of government employee records may trigger investigation by federal agencies
Customer Confidence: Law firms, courts, and government agencies using LexisNexis services may seek alternative vendors

Data Classification
LexisNexis has stated that compromised data was legacy/deprecated and did NOT include:

Social Security numbers
Driver's license numbers
Financial account numbers or payment information
Active passwords or password hashes
Customer search queries or research histories

However, the combination of exposed data (user profiles, infrastructure maps, secrets) still presents significant operational risk to affected organizations and government agencies.

## Remediation & Mitigation

Immediate Actions Taken

Patched React2Shell vulnerability in frontend applications
Revoked and rotated all compromised AWS credentials and secrets
Implemented temporary restrictions on cloud data access
Conducted security audit of AWS infrastructure configuration
Initiated forensic investigation into scope of data access

Long-Term Improvements

Establishment of systematic web application patching program with defined SLAs for critical vulnerabilities
Implementation of Web Application Firewall (WAF) rules to detect and block React2Shell exploitation attempts
Migration of plaintext secrets from AWS Secrets Manager to envelope-encrypted, key-derived secret storage
Review and cleanup of legacy/deprecated data retention policies to minimize exposure surface
Enhanced IAM permission modeling to reduce blast radius of credential compromise
Implementation of continuous vulnerability scanning for public-facing applications
Deployment of threat detection and response capabilities for AWS environments

Industry Lessons

Web Framework Patching is Critical: React2Shell was a known vulnerability with available patches. Unpatched web frameworks are a critical vector for attackers to reach cloud infrastructure.
Secrets Management Requires Encryption: Plaintext storage of credentials in AWS Secrets Manager provided attacker with immediate cloud access. All secrets must be encrypted at rest with customer-managed keys.
Legacy Data Creates Risk: Maintaining "deprecated" data in cloud environments creates unnecessary exposure. Data retention policies should balance business needs with security risk.
Cloud Credential Hygiene: Separating cloud credentials from web application code, using temporary/rotated credentials, and monitoring credential usage can contain cloud breaches.
Government Data Sensitivity: Even "non-sensitive" user profile data becomes critical when associated with government employees and infrastructure information.

## Sources & References

The Register. "LexisNexis Legal & Professional confirms data breach" (March 4, 2026) - https://www.theregister.com/2026/03/04/lexisnexis_legal_professional_confirms_data/
SC Media. "LexisNexis Legal & Professional confirms data breach after React2Shell exploit" - https://www.scworld.com/brief/lexisnexis-legal-professional-confirms-data-breach-after-react2shell-exploit
LawSites. "LexisNexis Says Data Breach Has Been Contained" - https://www.lawnext.com/2026/03/lexisnexis-confirms-data-breach-reports-say-hackers-claim-access-to-government-and-law-firm-user-data.html
CyberPress. "LexisNexis Data Breach: Threat Actor Claims Theft of 2.04 GB of Data" - https://cyberpress.org/lexisnexis-data-breach/
IDStrong. "LexisNexis AWS Data Breach Exposes 400,000 Cloud User Profiles" - https://www.idstrong.com/sentinel/lexisnexis-data-breach/
Rescana. "LexisNexis AWS Data Breach 2026: React2Shell Exploit Exposes Legacy Data" - https://www.rescana.com/post/lexisnexis-aws-data-breach-2026-react2shell-exploit-exposes-legacy-data-in-cloud-hack

Key Facts

Attack Vector
React2Shell RCE

Threat Actor
FulcrumSec

Data Exfiltrated
2.04 GB

Cloud User Profiles
~400,000

Gov't Accounts Exposed
118 (.gov)

Secrets Exposed
53 plaintext

Sector
Legal / Government

Geographic Impact
Global (US-focused)

Severity Level

MITRE ATT&CK Tactics

T1190: Public App Exploit
T1078: Valid Accounts
T1530: Cloud Storage
T1537: Transfer Data
T1552: Unsecured Creds

Threat Actor Profile

Name
FulcrumSec

Known For
Cloud infrastructure breaches, web app exploitation, secrets theft

TTP Specialization
RCE → Cloud Pivot → Data Exfiltration

Attribution
High confidence

Related Incidents

Okta Auth Bypass (2025)
CircleCI Secrets Leak (2024)
AWS Creds in S3 Buckets (2024)
Uber Cloud Breach (2022)

Related Reading

React Security Best Practices
AWS Secrets Management Guide
IAM Privilege Escalation
Cloud Data Exfiltration Patterns
Threats to Government Sector
