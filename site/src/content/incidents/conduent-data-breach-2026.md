---
eventId: TP-2026-0028
title: Conduent Massive Data Breach Affects 25 Million Americans
date: 2026-02-20
attackType: data-breach
severity: critical
sector: Government Services / Healthcare / BPO
geography: United States
threatActor: Unknown
attributionConfidence: A4
reviewStatus: under_review
confidenceGrade: C
generatedBy: new-threat-intel-automation
generatedDate: 2026-02-20
cves: []
relatedSlugs:
  - "cegedim-sante-health-breach-2026"
  - "carecloud-healthcare-breach-2026"
  - "hims-hers-shinyhunters-breach-2026"
  - "adobe-mr-raccoon-breach-2026"
  - "lexisnexis-react2shell-breach-2026"
  - "ummc-medusa-ransomware-2026"
  - "docketwise-immigration-data-breach-2026"
tags:
  - "data-breach"
  - "healthcare"
  - "government-services"
  - "bpo"
  - "ssn"
  - "medical-data"
  - "texas"
  - "oregon"
  - "largest-breach"
---
## Executive Summary

Between October 2024 and January 2025, Conduent Business Solutions, a major business technology and outsourcing firm, suffered a massive data breach affecting 25+ million Americans. The breach, involving the exfiltration of approximately 8 terabytes of sensitive data, represents one of the largest known data breaches in U.S. history. Conduent provides critical services including medical billing, toll transaction processing, and prepaid card administration for government programs, positioning it as a central hub for personal information across multiple government and healthcare systems.

The breach was initially detected on January 13, 2025, and mitigated by late January 2025. However, notifications to affected individuals were significantly delayed, not beginning until October 2025—nine months after discovery. The delay in disclosure heightened regulatory scrutiny, leading Texas Attorney General Ken Paxton to launch a formal investigation in February 2026 after the full scale of the breach became public. Paxton characterized the incident as "likely the largest breach in U.S. history."

The compromised data includes names, dates of birth, addresses, Social Security numbers, health insurance information, and detailed medical records. Affected individuals span multiple states, with Texas accounting for 15.4 million and Oregon for 10.5 million of the known victims. The incident has triggered multiple regulatory investigations and class action lawsuits, establishing a critical case study in both the technical execution of sophisticated data exfiltration and the regulatory failures in timely breach notification.

## Technical Analysis

Initial Compromise

While the precise infection vector has not been disclosed, analysis patterns suggest initial compromise likely occurred through exploitation of a public-facing application (MITRE ATT&CK T1190). Conduent's extensive public-facing infrastructure supporting medical billing, toll processing, and government program operations provided multiple potential attack surfaces. The threat actor gained initial access to Conduent's environment in October 2024, establishing a persistent foothold that would remain undetected for approximately three months.

Dwell Time and Lateral Movement

The attackers maintained presence within Conduent's environment for approximately three months (October 2024 to January 2025), a significant dwell time characteristic of sophisticated ransomware groups. During this period, the threat actor conducted extensive reconnaissance and lateral movement across Conduent's infrastructure. The extended dwell time suggests either:

Sophisticated stealth techniques that evaded detection systems
Potential blind spots or gaps in Conduent's security monitoring
Deliberate pacing by attackers to extract maximum data without triggering alerts

The attackers accessed multiple systems across Conduent's environment, including medical billing databases, government program files, and customer personal information repositories. Use of valid credentials (MITRE ATT&CK T1078) appears likely, suggesting either compromised employee accounts or successful exploitation of authentication systems.

Data Exfiltration

The scale of data exfiltration—approximately 8 terabytes—represents one of the largest known exfiltration operations on record. Given the dwell time and data volume, attackers employed systematic discovery and exfiltration processes:

Exfiltration Characteristics:

File and Directory Discovery (MITRE ATT&CK T1083) to locate valuable data
Data from Local System (MITRE ATT&CK T1005) staged for transmission
Exfiltration over Alternative Protocol (MITRE ATT&CK T1048) to evade traditional monitoring
Multiple staging locations and potential use of compromised cloud infrastructure

The attackers successfully removed the complete dataset without triggering network-level alerts, suggesting sophisticated data handling procedures and potential gaps in data loss prevention (DLP) implementations. The recovery of 8 TB of data by a single threat actor or small group required significant bandwidth and technical capability, pointing to either extended C2 sessions or the use of legitimate cloud services for staging.

## MITRE ATT&CK Mapping

Technique ID
Technique Name
Application to Incident

T1190
Exploit Public-Facing Application
Initial compromise likely via vulnerable public-facing application or web service exposed by Conduent

T1078
Valid Accounts
Attackers used compromised employee credentials or obtained valid account access to maintain persistence and move laterally

T1083
File and Directory Discovery
Systematic enumeration of file shares, databases, and directories to identify valuable PII and medical records

T1005
Data from Local System
Collection of data from local storage, file shares, and database systems across Conduent's environment

T1048
Exfiltration Over Alternative Protocol
Large-scale data exfiltration (8 TB) using non-standard protocols or legitimate services to avoid detection

## Impact Assessment

Scale of Impact

The Conduent breach affected 25+ million individuals across multiple U.S. states. Current confirmed impact by state includes:

State-Level Impact Summary:

Texas: 15.4 million affected
Oregon: 10.5 million affected
Other States: Additional millions in unreported/emerging counts

Compromised Data Categories

The exfiltrated dataset includes comprehensive personal and medical information, enabling multiple categories of fraud, identity theft, and harassment:

Personal Identifiers: Names, dates of birth, addresses, phone numbers
Government Identifiers: Social Security numbers, driver's license numbers
Health Information: Medical diagnoses, treatment history, prescription data
Insurance Data: Health insurance claims, policy numbers, member IDs
Financial Information: Bank account information, payment records (via toll and prepaid card systems)

This comprehensive dataset represents the "holy grail" for identity fraudsters, enabling not only financial fraud but sophisticated medical identity theft where attackers can seek medical services in victims' names or access prescription medications.

Real-World Impact on Individuals

For affected individuals, the breach creates immediate and long-term risks:

9-month delay in notification (October 2025) prevented victims from taking protective actions
Exposed medical records create privacy violations and potential discrimination risks
SSN exposure facilitates synthetic identity fraud and tax return fraud
Address data enables physical targeting, swatting, and harassment
Government program data exposes vulnerable populations (SNAP, Medicaid, disability benefits)

## Attack Timeline

October 2024

Threat actor gains initial access to Conduent's environment, likely through exploitation of public-facing application or remote service. Attacker establishes persistence mechanisms and begins reconnaissance.

October – December 2024

Extended dwell period of approximately three months. Attackers conduct lateral movement across Conduent's infrastructure, discover valuable data repositories, and begin systematic exfiltration of personal information, medical records, and government program data. Approximately 8 TB of data copied to attacker-controlled infrastructure.

January 13, 2025

Security team detects suspicious activity and confirms ongoing data exfiltration. Investigation launched to determine scope and impact of compromise.

January 2025

Conduent mitigates the active breach, removes attacker access, and implements remediation measures. However, begins process of notifying affected parties and regulatory agencies of the breach. Notifications not publicly disclosed at this time.

January – September 2025

Nine-month gap during which Conduent conducts forensic investigations and prepares breach notifications. The extended delay in notifying victims raises serious questions about investigation scope and regulatory notification procedures.

October 24, 2025

Conduent begins notifying affected individuals about the data breach. Initial notifications indicate millions of individuals have been affected. State healthcare systems begin receiving breach reports.

February 2026

Texas Attorney General Ken Paxton launches formal investigation as the full scope of the breach becomes public. Additional states and federal agencies initiate independent investigations. Breach scope expands to confirmed 25+ million affected individuals.

Ongoing

Multiple class action lawsuits filed on behalf of affected individuals. Regulatory investigations continue at state and federal levels. Conduent implements enhanced security measures and breach response protocols. Long-term impact assessment ongoing.

## Remediation & Lessons Learned

Conducted Remediation Measures

Following detection of the breach, Conduent implemented the following remediation steps:

Identified and removed attacker access from the environment
Isolated compromised systems and databases
Deployed enhanced monitoring across infrastructure
Reset credentials for potentially compromised accounts
Implemented multi-factor authentication across critical systems
Engaged third-party forensic investigators to determine breach scope
Established notification protocol for affected individuals and regulators

Critical Lessons and Failures

The Conduent breach highlights multiple organizational and systemic failures:

Detection and Response Gaps:

Dwell Time: Three months of attacker presence without detection indicates insufficient network monitoring or endpoint detection capabilities
Data Exfiltration: Movement of 8 TB of data without alerting suggests inadequate data loss prevention tools
Notification Delay: Nine-month delay in notifying victims raises questions about investigation competency and regulatory compliance

Systemic Vulnerabilities:

Excessive data concentration in a single vendor managing critical government programs
Inadequate segmentation of medical, personal, and financial data systems
Public-facing infrastructure exposing sensitive backend systems
Insufficient credential security allowing lateral movement after initial compromise

Recommendations for Industry

The incident underscores the need for:

Zero Trust Architecture: Eliminate assumptions about internal network safety through microsegmentation and continuous authentication
Enhanced Monitoring: Deploy behavioral analytics and anomaly detection to identify unusual data access patterns
Data Minimization: Reduce aggregation of sensitive datasets; enforce purpose limitation on data collection
Regulatory Compliance: State-level breach notification laws must enforce strict timelines (30 days maximum)
Vendor Assessment: Government agencies should evaluate cybersecurity posture of vendors with access to sensitive programs

Key Takeaways

25+ million Americans affected
~8 TB of data exfiltrated
3-month dwell time
9-month notification delay
Texas AG investigation launched
Called "largest in U.S. history"
Medical and SSN data exposed
Government programs affected
Multiple state investigations
Class action lawsuits filed

Related Incidents

Links to related incidents will be populated as the Threatpedia database is updated with cross-references to other large-scale government service breaches and healthcare data compromises.

Threat Actor Profile

Classification: Unknown (Likely Ransomware Group)

Indicators:

Sophisticated reconnaissance capabilities
Extended persistence and stealth
High-volume data exfiltration capability
Timing/targeting of critical infrastructure
Likely financially motivated

🔄 Intelligence Update — April 9, 2026
PENDING HUMAN REVIEW — Enrichment added by daily-incident-updater automation

Litigation Escalation
More than 35 class action lawsuits have now been filed in New Jersey federal court against Conduent, Health Care Service Corporation (Blue Cross Blue Shield), and AIG Procurement Services. All defendants have until April 20, 2026 to respond. No settlements have been reached; cases remain in early litigation with discovery just beginning.

Texas Attorney General Investigation
The Texas Attorney General has opened a formal investigation into the breach, with reports indicating 14.7 million victims in Texas alone — more than half the total affected population. The HIPAA Journal confirms the TX AG investigation is active.

Victim Count Revision
The breach now affects at least 25 million Americans, more than doubling the initial estimate of 10.5 million. It is now classified as the 8th largest healthcare data breach in U.S. history.

Credit Monitoring Deadline
Conduent offered two years of free credit monitoring through a third-party provider. The enrollment deadline was March 31, 2026. Affected individuals who missed this deadline may have limited remediation options.

Sources & References

https://www.malwarebytes.com/blog/news/2026/02/the-conduent-breach-from-10-million-to-25-million-and-counting
Malwarebytes Labs — Analysis of Conduent breach scale expansion

https://techcrunch.com/2026/02/24/conduent-data-breach-grows-affecting-at-least-25m-people/
TechCrunch — Breach scale revelation and industry analysis

https://www.foxbusiness.com/technology/data-breach-exposes-personal-data-25m-americans
Fox Business — Impact assessment and regulatory response

https://www.hipaajournal.com/conduent-business-solutions-data-breach/
HIPAA Journal — Healthcare compliance implications and analysis

https://topclassactions.com/lawsuit-settlements/lawsuit-news/10-5m-records-exposed-conduent-faces-massive-litigation-over-the-8th-largest-healthcare-data-breach-in-u-s-history/
Top Class Actions — 35+ lawsuits filed, 8th largest healthcare breach

https://www.hipaajournal.com/conduent-business-solutions-data-breach/
HIPAA Journal — Texas Attorney General investigation into 25M+ breach
