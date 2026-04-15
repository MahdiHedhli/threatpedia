---
eventId: TP-2026-0029
title: "Hims & Hers Health Zendesk Breach by ShinyHunters"
date: 2026-02-05
attackType: data-breach
severity: high
sector: Healthcare / Telehealth
geography: United States
threatActor: ShinyHunters (UNC5537)
attributionConfidence: A4
reviewStatus: under_review
confidenceGrade: C
generatedBy: new-threat-intel-automation
generatedDate: 2026-02-05
cves: []
relatedSlugs:
  - "shiny-hunters-leak-site"
  - "carecloud-healthcare-breach-2026"
  - "conduent-data-breach-2026"
  - "m365-oauth-device-code-phishing-2026"
tags:
  - "data-breach"
  - "telehealth"
  - "zendesk"
  - "okta"
  - "shinyhunters"
  - "support-tickets"
  - "healthcare"
---
## Threatpedia Incident Database

Hims & Hers Health Data Breach

Incident ID
TP-2026-0029

Classification
Data Breach / Identity Compromise

Date Detected
February 5, 2026

Status
Notification Phase

Severity
HIGH

Attribution
ShinyHunters (UNC5537)

Sector
Healthcare / Telehealth

Review Status
⚠ Pending Human Review

🔄 Intelligence Update — April 9, 2026
PENDING HUMAN REVIEW — Enrichment added by daily-incident-updater automation

Class Action Investigations Launched
Multiple law firms are now investigating class action lawsuits. Edelson Lechtzin LLP and attorneys working with ClassAction.org are investigating whether class actions can be filed on behalf of affected individuals.

Credit Monitoring Offered
Hims & Hers is offering 12 months of complimentary single-bureau credit monitoring and identity theft protection services to affected individuals.

Breach Window Clarified
The investigation determined unauthorized access occurred from February 4 to February 7, 2026, a three-day window during which certain support tickets were accessed or acquired without authorization.

https://www.classaction.org/data-breach-lawsuits/hims-and-hers-april-2026
ClassAction.org — Hims & Hers data breach investigation

https://www.malwarebytes.com/blog/data-breaches/2026/04/support-platform-breach-exposes-hims-hers-customer-data
Malwarebytes — Breach analysis and data exposure details

## Executive Summary

Hims & Hers Health, a major U.S. telehealth company, suffered a significant data breach in early February 2026 when the threat group ShinyHunters (UNC5537) gained unauthorized access to the company's Zendesk support platform using a compromised Okta SSO account. The breach exposed support tickets containing personally identifiable information (PII) of affected individuals, including names, email addresses, phone numbers, and medical information related to customer support interactions.
The unauthorized access occurred between February 4-7, 2026, with suspicious activity detected on February 5, 2026. Hims & Hers management terminated the attacker's access on February 7, 2026. The company confirmed the breach on March 3, 2026, and subsequently notified affected individuals and regulatory authorities, including the California Attorney General and law enforcement. The company offered 12 months of complimentary credit monitoring to impacted customers.
This incident highlights the critical risk of compromised identity and access management systems in protecting SaaS platforms. The reliance on a single authentication mechanism (Okta SSO) without apparent additional verification controls created a single point of failure that allowed attackers to pivot from the SSO infrastructure to downstream support systems containing sensitive customer data.

## Technical Analysis

Okta SSO Compromise

The initial compromise vector involved a compromised Okta SSO (Single Sign-On) account. While Hims & Hers did not publicly disclose the specific method by which the Okta credentials were obtained, typical attack vectors against SSO infrastructure include credential stuffing, phishing campaigns, or exploitation of unpatched Okta instances. The threat group ShinyHunters is known to actively target identity and access management systems as a high-value entry point into enterprise networks.
The compromised account likely belonged to an employee with legitimate access to the Zendesk support platform, or the attackers obtained admin-level SSO credentials that allowed them to provision new accounts or impersonate legitimate users. The use of SSO as an attack vector is particularly effective as it often bypasses additional authentication layers on downstream applications.

Zendesk Platform Access

Once the attackers obtained valid Okta credentials, they leveraged SSO trust relationships to gain access to Hims & Hers' Zendesk instance. Zendesk, a widely-used customer support platform, is a prime target for attackers seeking customer PII and sensitive business communications. The support platform contained support tickets spanning customer inquiries related to the company's telehealth services.
With access to the Zendesk instance, the attackers were able to browse, search, and exfiltrate support ticket contents. The lack of apparent session monitoring, rate limiting, or anomalous access detection allowed the attackers to conduct bulk data harvesting operations during the four-day access window (February 4-7, 2026) without triggering immediate security alerts.

Data Exfiltration

Support tickets containing PII were systematically exfiltrated to attacker-controlled infrastructure. The stolen data included customer names, email addresses, phone numbers, and references to medical conditions discussed in support interactions (though complete medical records were not compromised). ShinyHunters later published samples of the stolen data on their dark web leak site to demonstrate proof-of-breach and create pressure for extortion demands.
The exfiltration method likely involved standard web-based extraction techniques available within the Zendesk interface, combined with automated data processing to structure and compress the stolen information for rapid transfer off Hims & Hers' infrastructure. No technical indicators suggest the use of advanced data exfiltration tools or obfuscation techniques.

## MITRE ATT&CK Mapping

T1078: Valid Accounts
Compromise of Okta SSO Account
Attackers obtained legitimate user credentials through Okta SSO infrastructure, likely via credential compromise or account takeover.

T1550.001: Application Access Token
OAuth/SSO Token Abuse
Valid SSO tokens were leveraged to bypass authentication controls on downstream applications (Zendesk).

T1530: Data from Cloud Storage
Cloud-Hosted Support Platform Access
Attackers accessed customer support tickets stored in Zendesk's cloud infrastructure.

T1567: Exfiltration Over Web Service
Data Exfiltration via Internet Connection
Stolen PII was exfiltrated over HTTPS to attacker-controlled infrastructure during the four-day access window.

## Impact Assessment

Data Compromised:

Customer names and contact information (email addresses, phone numbers)
References to medical conditions and health information from support tickets
Historical customer service interactions and communications
No full medical records, prescriptions, or payment information compromised

The breach affected an undisclosed number of individuals who had interacted with Hims & Hers customer support. While the company did not publicly release the total count of affected users, regulatory filings and notifications suggest the impact spans tens of thousands of customer records based on the four-day access window and volume of support tickets in the Zendesk instance.
Identity Theft Risk: The combination of personal names, email addresses, and phone numbers creates elevated risk for phishing attacks, social engineering, and impersonation. Individuals may receive fraudulent communications claiming to be from Hims & Hers or other healthcare providers.
Medical Privacy Risk: While complete medical records were not compromised, references to medical conditions in support tickets could enable targeted phishing attacks and social engineering campaigns using health-related pretexting.

## Attack Timeline

Feb 4, 2026
Unauthorized Access Begins - Attackers use compromised Okta SSO credentials to access Hims & Hers Zendesk support platform. Initial reconnaissance and access validation occurs.

Feb 5, 2026
Suspicious Activity Detected - Hims & Hers internal security systems or administrators identify suspicious login activity and data access patterns on the Zendesk instance. Investigation is initiated.

Feb 7, 2026
Access Terminated - Hims & Hers security team revokes the compromised Okta credentials and terminates attacker access to all connected systems. Access window closes after approximately 72 hours of activity.

Feb 7-Mar 3, 2026
Investigation & Confirmation Phase - Hims & Hers conducts forensic investigation, confirms data exfiltration, and identifies scope of compromised information. Legal and regulatory notification process begins.

Mar 3, 2026
Breach Publicly Confirmed - Hims & Hers publicly acknowledges the data breach and issues notifications to affected individuals and regulators, including the California Attorney General and law enforcement agencies.

Apr 2026
Incident Disclosure & Remediation Offer - Company announces 12-month complimentary credit monitoring and identity theft protection services for affected customers. Media coverage and regulatory scrutiny intensify.

## Remediation & Lessons Learned

Immediate Response Actions

Revoked compromised Okta credentials and reset all SSO trust relationships
Conducted full audit of Zendesk access logs and exfiltrated data
Notified regulatory authorities and law enforcement (FBI, DOJ, California AG)
Offered 12-month credit monitoring and identity theft protection
Engaged external cybersecurity firm for forensic investigation and remediation validation

Preventive Measures (Recommended)

Multi-Factor Authentication (MFA): Enforce mandatory MFA on all Okta SSO accounts, with particular focus on service accounts and high-privilege users with access to support platforms.
Conditional Access Policies: Implement device trust verification, geolocation restrictions, and anomalous behavior detection for access to sensitive systems.
Session Monitoring: Deploy real-time session monitoring and alerting on Zendesk and other customer-facing systems to detect bulk data access patterns.
Data Loss Prevention (DLP): Implement DLP tools to restrict exfiltration of PII from support platforms, including API-based data extraction.
Zero Trust Architecture: Transition away from implicit trust in SSO tokens; require re-authentication and authorization checks for sensitive data access.
Okta Security Hardening: Apply all recommended Okta security patches, disable legacy authentication protocols, and conduct quarterly Okta configuration audits.
Incident Response Planning: Establish and regularly test IR procedures for compromised credentials, including rapid account lockdown and system isolation workflows.

Key Lessons & Industry Implications

1. Identity and Access Management is a Critical Control: SSO systems are high-value targets for attackers. A single compromised SSO account can cascade into breaches across multiple downstream applications. Organizations must treat identity infrastructure as a crown jewel and apply the most rigorous security controls.
2. Support Platforms Contain Sensitive Data: Customer support ticketing systems (Zendesk, Jira Service Desk, etc.) are frequently overlooked in data security planning, but they routinely contain PII, health information, and proprietary business details. These systems warrant equivalent security controls to primary databases.
3. SaaS Dependency Requires Enhanced Monitoring: Organizations relying on cloud-based SaaS platforms for critical functions must implement comprehensive access logging, real-time alerting, and behavioral analysis. The four-day window in this breach (Feb 4-7) highlights the importance of rapid anomaly detection.
4. Implicit Trust in Federated Identity is Insufficient: The implicit trust model where SSO token validity automatically grants downstream access is fundamentally flawed. Organizations should implement explicit authorization checks and require re-authentication for access to the most sensitive data stores.

## Sources

Hims and Hers warns of data breach after Zendesk support ticket breach
Bleeping Computer

Telehealth giant Hims & Hers says its customer support system was hacked
TechCrunch

Support platform breach exposes Hims & Hers customer data
Malwarebytes Labs

Hims & Hers Data Breach
HIPAA Journal

Related Incidents

ShinyHunters Threat Profile

Key Takeaways

Compromised SSO credentials are a critical risk vector with cascade effects across SaaS ecosystems
Support platforms contain sensitive PII and require equivalent security controls to primary databases
Federated identity systems require explicit authorization checks, not implicit trust
Healthcare organizations must implement enhanced monitoring on all customer-facing systems
Four-day detection window underscores need for real-time anomaly detection on SaaS platforms

© 2026 Threatpedia Incident Database. Incident Report ID: TP-2026-0029 | Generated: April 7, 2026 | Review Status: Pending Human Verification
