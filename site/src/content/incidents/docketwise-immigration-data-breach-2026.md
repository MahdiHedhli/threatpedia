---
eventId: TP-2026-0047
title: DocketWise Immigration Case Management Platform Breach Exposes 116K Records
date: 2026-04-03
attackType: data-breach
severity: high
sector: Legal / Immigration Services
geography: United States
threatActor: Unknown
attributionConfidence: A4
reviewStatus: under_review
confidenceGrade: C
generatedBy: new-threat-intel-automation
generatedDate: 2026-04-03
cves: []
relatedSlugs:
  - "conduent-data-breach-2026"
  - "carecloud-healthcare-breach-2026"
tags:
  - "data-breach"
  - "immigration"
  - "legal"
  - "ssn"
  - "passport"
  - "credential-theft"
  - "third-party"
  - "pii"
  - "medical-data"
---
## Executive Summary

DocketWise, a cloud-based immigration case management platform used by thousands of U.S. immigration law firms, disclosed a significant data breach on April 3, 2026, affecting 116,666 individuals. Unauthorized actors used valid credentials to clone third-party partner repositories containing unstructured client data from law firm migration pipelines. The breach exposed sensitive immigration-related information including Social Security numbers, passport numbers, financial account details, medical information, and immigration case documentation.

The breach was discovered in October 2025 but public disclosure and notification to state attorneys general commenced on April 3, 2026—approximately six months after initial discovery. This timeline suggests an extended investigation period, likely including forensic analysis, scope determination, and legal review before public notification. The delay underscores the challenges of coordinating notification across multiple state jurisdictions for a nationally operating platform.

DocketWise is offering 24-month credit monitoring through IDX to affected individuals. The platform serves thousands of immigration law firms across the United States, making this one of the larger data breaches affecting the immigration legal services sector. The credential-based access vector suggests inadequate access controls or compromised credentials maintained by third-party integrators with legitimate business relationships to the platform.

## Timeline

Unknown — Initial Compromise
Credential Compromise
Third-party integrator credentials compromised (mechanism not disclosed). Attacker gains ability to authenticate to DocketWise platform as legitimate user.

Unknown — Data Exfiltration Period
Repository Access & Cloning
Attacker uses valid credentials to access and clone third-party partner repositories containing unstructured client data. Duration of unauthorized access unknown.

October 2025 — Discovery
Breach Detection
DocketWise identifies suspicious repository access patterns or unauthorized cloning activity. Breach notification investigation launched.

October 2025 — April 3, 2026
Investigation & Legal Review Period
DocketWise conducts forensic investigation to determine scope of exposure. Legal team determines notification obligations and coordinates with state attorneys general. Timeline spans approximately six months.

April 3, 2026 — Notification Commencement
State AG Notification
DocketWise begins notification to state attorneys general as required by multi-state breach notification laws. Individual notifications follow. Breach disclosed publicly.

April 3, 2026 — Ongoing
Remediation & Monitoring
Credit monitoring offered through IDX. Individuals advised to monitor credit reports and accounts for fraudulent activity. DocketWise implements security improvements.

## Technical Details

Access Method: Unauthorized actors used valid credentials to access DocketWise infrastructure. Specific credential types not disclosed, but likely involved API keys, OAuth tokens, or account credentials belonging to legitimate third-party integrators with authorized access to client data repositories.

Stage 1: Credential Compromise

Unauthorized actors obtain valid DocketWise platform credentials. Possible vectors:

Compromised third-party integrator systems
Phishing attacks targeting integrator employees
Credential theft from dark web marketplaces
Social engineering of integrator personnel
Insider threat from legitimate partner organization

Stage 2: Authentication

Attacker authenticates to DocketWise platform using compromised credentials. Authentication succeeds because credentials are valid and associated with authorized integrator account.

Stage 3: Repository Access

Attacker accesses third-party partner repositories containing unstructured client data from law firm migration pipelines. Access is permitted because the compromised credentials belong to an account with authorized repository access.

Stage 4: Data Cloning & Exfiltration

Attacker clones or exports repository contents containing 116,666 individual records. Data includes PII, immigration case details, financial information, and medical data. Exfiltration occurs over network without triggering detection alerts.

Data Exposed:
• Social Security Numbers (SSN)
• Passport Numbers and Passport Scans
• Financial Account Information (Bank Accounts, Credit Cards)
• Medical Information (Health Records, Insurance Details)
• Immigration Case Documentation (Visa Applications, Case Decisions)
• Legal Correspondence and Attorney Work Product
• Names, Addresses, Phone Numbers, Email Addresses
• Dates of Birth and Biometric Identifiers

Affected User Base: Law firm clients across United States immigration law practices. Primary risk extends to individuals seeking immigration legal representation (visa applicants, green card applicants, asylum seekers, employment authorization applicants).

Breach Details

Records Exposed: 116,666 individuals
Data Type: Unstructured client data (repositories)
Access Vector: Valid credentials / Repository cloning
Dwell Time: October 2025 discovery; access period unknown
Detection: October 2025
Disclosure: April 3, 2026

## Impact Assessment

PII Exposure Scope: 116,666 individuals had sensitive immigration-related personal information exposed. SSNs, passport numbers, and financial account details are high-value for identity theft, fraud, and targeted attacks. Exposure affects both immigration applicants and their family members included in applications.

Immigration Status Risk: Immigration case documentation exposure creates risk of targeted enforcement actions, visa denials, or travel disruptions if bad actors leverage the information. Foreign government intelligence services may target individuals with specific immigration statuses or affiliations.

Identity Theft Vector: Complete identity profiles (SSN + name + address + financial info) create significant identity theft risk. Dark web availability of the dataset enables fraud operations targeting immigration loan scams, tax fraud, and financial account takeovers.

Legal Services Industry Impact: The breach affects the immigration law sector's reputation for security. Immigration applicants may delay legal proceedings due to concerns about data security in cloud-based platforms. Law firms face pressure to justify cloud service security posture to clients.

Regulatory & Litigation Risk: Breach notification required by multiple state data protection laws. Class action lawsuits likely. State attorneys general investigations probable. CFAA criminal liability possible if unauthorized access prosecuted.

Mitigation Cost: Credit monitoring (24 months) represents immediate mitigation cost. Law firms may face compliance fines under state laws. DocketWise likely faces significant remediation expenses and reputational damage.

## Attribution & Threat Actor Analysis

Threat Actor Identity: Unknown. Public reporting does not attribute the breach to any specific named threat actor or threat group. The credential-based access suggests either a generic cybercriminal group, financially motivated threat actor, or insider threat.

Motivation Assessment: The targeting of immigration data suggests one of several possible motivations:

Financial motivation: Identity theft, fraud operations
Intelligence collection: Foreign government targeting of immigration applicants
Opportunistic targeting: Attacker identifying vulnerable cloud service and exploiting inadequate access controls
Insider threat: Disgruntled employee or contractor within third-party integrator

Industry Targeting Pattern: Immigration legal services sector includes sensitive PII and valuable immigration case information. The sector is often underrepresented in security investments compared to financial services or healthcare, creating relative vulnerability. SaaS platforms serving the legal industry are attractive targets because they aggregate data from multiple law firms.

Third-Party Risk: The breach mechanism (compromised third-party credentials) highlights supply chain security risks. Attackers identify and compromise lower-security integrator partners to access higher-value central platforms. DocketWise's reliance on third-party integrators created an expanded attack surface not fully under the company's direct control.

## Mitigations & Recommendations

For Affected Individuals:
1. Enroll in offered 24-month credit monitoring through IDX immediately.
2. Place fraud alerts with credit bureaus (Equifax, Experian, TransUnion).
3. Consider credit freezes to prevent unauthorized credit applications.
4. Monitor immigration case status for unexpected changes or denials.
5. Review financial statements and credit reports regularly for unauthorized activity.
6. Consider identity theft protection insurance.
7. Report suspicious activity to IC3.gov (FBI Internet Crime Complaint Center).

For Law Firm Clients of DocketWise:
1. Review DocketWise's security improvements and remediation measures before continuing platform use.
2. Audit third-party integrations with DocketWise for unnecessary access permissions.
3. Implement additional layers of encryption for sensitive client data in cloud services.
4. Require multi-factor authentication for all cloud service access.
5. Review and restrict API key permissions and OAuth token scope.
6. Consider hybrid or on-premises alternatives for highly sensitive immigration case data.

For DocketWise (Platform-Level):
1. Implement least-privilege access controls for third-party integrator credentials.
2. Enhance audit logging and anomaly detection for repository access and data cloning operations.
3. Implement data exfiltration prevention (DLP) controls to detect bulk data export attempts.
4. Require multi-factor authentication for all platform access, including API authentication.
5. Conduct third-party security audits of all integrator partners.
6. Implement encryption for sensitive PII at rest and in transit.
7. Establish data retention policies to minimize exposure window if breach occurs.

For Legal Industry Standards:
1. Develop legal industry security baseline standards for SaaS platforms handling immigration data.
2. Establish incident response playbooks for immigration data breaches.
3. Create law firm security assessment templates for evaluating cloud service providers.
4. Share threat intelligence on immigration SaaS platform vulnerabilities.
5. Advocate for regulatory framework requiring encryption and access controls for immigration data.

Sources & References

1.
ClaimDepot — DocketWise Immigration Platform Data Breach Notification
https://www.claimdepot.com/

2.
ClassAction.org — DocketWise Immigration Data Breach Class Action Information
https://www.classaction.org/

3.
GlobeNewsWire — DocketWise Discloses Data Breach Affecting Immigration Clients
https://www.globenewswire.com/

4.
HackNotice — DocketWise Breach: Immigration Data Exposure Analysis
https://www.hacknotice.com/

5.
IDX (Credit Monitoring Provider) — DocketWise Breach Notification & Credit Monitoring Services
https://www.idx.us/

6.
CISA (Cybersecurity and Infrastructure Security Agency) — Healthcare & Legal Services Sector Security Guidance
https://www.cisa.gov/

Key Takeaways

Large Scale Breach: 116,666 individuals affected by unauthorized platform access
Credential-Based Access: Attacker used valid credentials (likely compromised third-party integrator)
High-Value Data: SSNs, passports, financial data, medical info, immigration case details exposed
Identity Theft Risk: Complete identity profiles enable fraud, dark web sale, targeted attacks
Immigration Sector Impact: Cloud-based legal services handling sensitive government immigration data
Credit Monitoring: 24-month coverage through IDX offered to affected individuals

Exposed Data Types

PII: Full names, addresses, phone numbers, email addresses
Financial: Bank accounts, credit cards, routing numbers
Government ID: SSNs, Passport numbers, biometrics
Medical: Health records, insurance details
Legal: Immigration case files, visa applications, attorney work

Timeline

October 2025: Breach discovered
Oct-Apr: 6-month investigation period
April 3, 2026: Public disclosure
April 3, 2026: State AG notifications begin

Related Incidents
Conduent Data Breach (2026)
CareCloud Healthcare Breach (2026)
Legal Sector SaaS Security Trends
Cloud Credential Compromise Patterns

Affected Organizations

Primary: DocketWise (Cloud Platform)
Secondary: Immigration law firms nationwide
Tertiary: Individuals seeking immigration legal services
Third-Party: Unknown integrator with compromised credentials
