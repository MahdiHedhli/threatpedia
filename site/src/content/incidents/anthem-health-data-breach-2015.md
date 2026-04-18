---
eventId: TP-2015-0001
title: "Anthem Health Insurance Data Breach"
date: 2015-01-29
attackType: Data Breach
severity: critical
sector: Healthcare
geography: United States
threatActor: "Black Vine / China-linked espionage operators"
attributionConfidence: A2
reviewStatus: "under_review"
confidenceGrade: B
generatedBy: dangermouse-bot
generatedDate: 2026-04-16
cves: []
relatedSlugs: []
tags:
  - data-breach
  - healthcare
  - china
  - espionage
  - pii
  - hipaa
  - insurance
sources:
  - url: https://www.fbi.gov/news/press-releases/chinese-member-of-sophisticated-hacking-group-indicted-for-series-of-computer-intrusions-including-2015-data-breach-of-health-insurer-anthem
    publisher: FBI
    publisherType: government
    reliability: R1
    publicationDate: "2019-05-09"
    accessDate: "2026-04-16"
    archived: false
  - url: https://www.hhs.gov/about/news/2018/10/15/anthem-pays-ocr-16-million-in-record-hipaa-settlement-following-largest-us-health-data-breach.html
    publisher: U.S. Department of Health and Human Services
    publisherType: government
    reliability: R1
    publicationDate: "2018-10-15"
    accessDate: "2026-04-16"
    archived: false
  - url: https://www.justice.gov/opa/pr/member-sophisticated-china-based-hacking-group-indicted-series-computer-intrusions-including
    publisher: U.S. Department of Justice
    publisherType: government
    reliability: R1
    publicationDate: "2019-05-09"
    accessDate: "2026-04-16"
    archived: false
  - url: https://www.symantec.com/connect/blogs/black-vine-formidable-cyberespionage-group-targeted-aerospace-and-healthcare
    publisher: Symantec
    publisherType: vendor
    reliability: R2
    publicationDate: "2015-07-29"
    accessDate: "2026-04-16"
    archived: false
mitreMappings:
  - techniqueId: T1566.002
    techniqueName: "Phishing: Spearphishing Link"
    tactic: Initial Access
    notes: Attackers sent spearphishing emails containing links to malicious domains that impersonated legitimate Anthem and healthcare-related websites.
  - techniqueId: T1071
    techniqueName: Application Layer Protocol
    tactic: Command and Control
    notes: The custom backdoor used HTTP/HTTPS for C2 communications, blending with legitimate web traffic to avoid detection.
  - techniqueId: T1041
    techniqueName: Exfiltration Over C2 Channel
    tactic: Exfiltration
    notes: The attackers exfiltrated 78.8 million records through the same C2 channel used for command and control, compressing data before transfer.
---

## Executive Summary

On January 29, 2015, Anthem Inc. (formerly WellPoint Inc.), the second-largest health insurance company in the United States, discovered that attackers had gained unauthorized access to its IT systems and exfiltrated personal data belonging to approximately 78.8 million current and former members, employees, and their dependents. The breach was the largest healthcare data breach in U.S. history at the time.

The compromised data included names, dates of birth, Social Security numbers, healthcare ID numbers, home addresses, email addresses, and employment information. Medical records, claims data, and financial information were not accessed. The data was stored in Anthem's Enterprise Data Warehouse, a centralized database used for analytics and reporting.

The breach was attributed to a Chinese state-sponsored group tracked by Symantec as "Black Vine" and by other vendors under various designations. In May 2019, the U.S. Department of Justice indicted Fujie Wang, a Chinese national, for his role in the Anthem breach and related intrusions targeting other U.S. companies.

## Technical Analysis

The attackers initiated the campaign through spearphishing emails sent to Anthem employees. The emails contained links to domains that mimicked legitimate healthcare and Anthem-related websites. When employees clicked the links, their systems were compromised with a custom backdoor that established persistent remote access.

The primary malware used in the intrusion was a custom backdoor that Symantec tracked as "Mivast." The malware communicated with command-and-control servers using HTTP/HTTPS protocols, making the C2 traffic difficult to distinguish from legitimate web browsing. The backdoor provided the attackers with remote shell access, file upload and download capabilities, and the ability to execute arbitrary commands.

After establishing persistent access, the attackers moved laterally through Anthem's network, escalating privileges until they obtained database administrator credentials for the Enterprise Data Warehouse. The attackers queried the warehouse over a period of several weeks, extracting records for approximately 78.8 million individuals.

Anthem's information security team detected the breach on January 29, 2015, after a database administrator noticed that a query was running under his credentials that he had not initiated. The administrator reported the suspicious activity, triggering an investigation that uncovered the full scope of the compromise. This internal detection — rather than a tip from law enforcement or a third party — was characteristic of a relatively mature security operations capability.

## Attack Chain

### Stage 1: Spearphishing

Attackers sent targeted phishing emails to Anthem employees with links to attacker-controlled domains masquerading as legitimate healthcare websites. The phishing infrastructure was prepared in advance with domain names designed to pass cursory inspection.

### Stage 2: Backdoor Installation

Employees who clicked the phishing links had the Mivast backdoor installed on their workstations. The malware established persistent access and began C2 communications over HTTPS.

### Stage 3: Lateral Movement and Privilege Escalation

The attackers navigated from initially compromised workstations to systems with access to the Enterprise Data Warehouse. They obtained database administrator credentials through credential harvesting techniques.

### Stage 4: Data Exfiltration

Using the stolen DBA credentials, the attackers queried the Enterprise Data Warehouse and exfiltrated 78.8 million records containing PII. The data was compressed and transferred through the established C2 channel.

## Impact Assessment

The breach exposed personal information for 78.8 million individuals, making it the largest healthcare data breach in U.S. history at the time. The compromised data included Social Security numbers for the majority of affected individuals, creating long-term identity theft risk.

Anthem agreed to a record $16 million settlement with the U.S. Department of Health and Human Services Office for Civil Rights (OCR) for potential HIPAA Privacy and Security Rule violations. This was the largest HIPAA settlement at the time. Anthem also reached a $115 million class-action settlement with affected individuals and paid additional fines to state attorneys general.

The total cost of the breach was estimated at over $260 million, including the regulatory settlements, legal fees, credit monitoring services, IT remediation, and business disruption. Anthem implemented a comprehensive cybersecurity improvement program, including the deployment of multi-factor authentication, enhanced network segmentation, and advanced threat detection capabilities.

## Historical Context

In May 2019, the U.S. Department of Justice indicted Fujie Wang, a member of a hacking group operating in China, for his role in the Anthem breach and intrusions targeting three other U.S. companies. The indictment described Wang as a member of an "extremely sophisticated hacking group" that conducted campaigns against U.S. businesses in the technology, healthcare, and other sectors.

Symantec tracked the group responsible for the Anthem breach under the designation "Black Vine" and documented connections between the Anthem intrusion and campaigns targeting defense contractors, energy companies, and technology firms. The group's toolset, infrastructure, and targeting patterns were consistent with Chinese state-sponsored espionage objectives.

The FBI attributed the breach to Chinese state-sponsored actors in its 2019 press release. The combination of the DOJ indictment, FBI attribution, and vendor analysis provides a strong basis for the China attribution.

Attribution confidence is assessed as A2 (probably true, from a reliable source) based on the DOJ indictment of a Chinese national and consistent vendor analysis.

## Timeline

### 2014-02-01 — Initial Compromise

Attackers began the spearphishing campaign targeting Anthem employees, establishing initial backdoor access to the company's network.

### 2014-05-01 — Enterprise Data Warehouse Accessed

The attackers escalated privileges and gained access to Anthem's Enterprise Data Warehouse containing member and employee records.

### 2015-01-29 — Breach Discovered

An Anthem database administrator detected a query running under his credentials that he had not initiated, triggering an internal investigation.

### 2015-02-04 — Public Disclosure

Anthem publicly disclosed the data breach, reporting that approximately 80 million records had been compromised.

### 2015-03-13 — Scope Confirmed

Anthem confirmed the final count of 78.8 million affected individuals and the specific data elements compromised.

### 2018-10-15 — HHS Settlement

Anthem agreed to pay $16 million to settle potential HIPAA violations with the HHS Office for Civil Rights, the largest HIPAA settlement at the time.

### 2019-05-09 — DOJ Indictment

The U.S. Department of Justice indicted Fujie Wang in connection with the Anthem breach and related computer intrusions.

## Remediation & Mitigation

Anthem implemented a corrective action plan as part of its HHS settlement, including enterprise-wide risk analysis, access controls review, security configuration management, and enhanced audit logging. The company deployed multi-factor authentication for remote and privileged access, enhanced network segmentation, and implemented data loss prevention (DLP) tools.

Healthcare organizations should implement robust phishing defenses including email filtering, URL analysis, and security awareness training focused on recognizing targeted spearphishing. Database access should require multi-factor authentication, and database query activity should be monitored for anomalous patterns. Large centralized data warehouses containing PII should be segmented from the general corporate network and subject to enhanced access controls.

The Anthem breach highlighted the need for healthcare organizations to encrypt sensitive data at rest within databases, implement database activity monitoring, and establish anomaly detection for unusual query patterns. Organizations should ensure that database administrator credentials are managed through privileged access management systems with just-in-time provisioning.

## Sources & References

- [FBI: Chinese Member of Hacking Group Indicted for Anthem Breach](https://www.fbi.gov/news/press-releases/chinese-member-of-sophisticated-hacking-group-indicted-for-series-of-computer-intrusions-including-2015-data-breach-of-health-insurer-anthem) — FBI, 2019-05-09
- [U.S. Department of Health and Human Services: Anthem Pays OCR $16 Million in Record HIPAA Settlement](https://www.hhs.gov/about/news/2018/10/15/anthem-pays-ocr-16-million-in-record-hipaa-settlement-following-largest-us-health-data-breach.html) — HHS, 2018-10-15
- [U.S. Department of Justice: Member of China-Based Hacking Group Indicted](https://www.justice.gov/opa/pr/member-sophisticated-china-based-hacking-group-indicted-series-computer-intrusions-including) — U.S. Department of Justice, 2019-05-09
- [Symantec: Black Vine Cyberespionage Group](https://www.symantec.com/connect/blogs/black-vine-formidable-cyberespionage-group-targeted-aerospace-and-healthcare) — Symantec, 2015-07-29
