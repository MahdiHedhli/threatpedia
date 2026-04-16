---
eventId: "TP-2017-0005"
title: "Equifax Data Breach"
date: 2017-05-13
attackType: "Data Breach"
severity: critical
sector: "Financial Services"
geography: "United States"
threatActor: "PLA Unit 54"
attributionConfidence: A1
reviewStatus: "draft_ai"
confidenceGrade: A
generatedBy: "penfold-bot"
generatedDate: 2026-04-15
cves:
  - "CVE-2017-5638"
tags:
  - "equifax"
  - "data-breach"
  - "china"
  - "pla"
  - "unit-54"
  - "apache-struts"
  - "cve-2017-5638"
  - "pii"
sources:
  - url: "https://www.ftc.gov/legal-library/browse/cases-proceedings/172-3203-equifax-inc"
    publisher: "FTC"
    publisherType: government
    reliability: R1
    publicationDate: "2019-07-22"
    accessDate: "2026-04-15"
    archived: false
  - url: "https://www.gao.gov/products/gao-18-559"
    publisher: "GAO"
    publisherType: government
    reliability: R1
    publicationDate: "2018-08-30"
    accessDate: "2026-04-15"
    archived: false
  - url: "https://nvd.nist.gov/vuln/detail/CVE-2017-5638"
    publisher: "NVD"
    publisherType: government
    reliability: R1
    publicationDate: "2017-03-10"
    accessDate: "2026-04-15"
    archived: false
  - url: "https://www.justice.gov/opa/pr/chinese-military-personnel-charged-computer-fraud-economic-espionage-and-wire-fraud-hacking"
    publisher: "US Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2020-02-10"
    accessDate: "2026-04-15"
    archived: false
  - url: "https://www.cisa.gov/news-events/alerts/2017/03/08/apache-releases-security-advisory-struts-2"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2017-09-08"
    accessDate: "2026-04-15"
    archived: false
mitreMappings:
  - techniqueId: "T1190"
    techniqueName: "Exploit Public-Facing Application"
    tactic: "Initial Access"
    notes: "Attackers exploited an unpatched Apache Struts vulnerability (CVE-2017-5638) in Equifax's online dispute portal."
  - techniqueId: "T1005"
    techniqueName: "Data from Local System"
    tactic: "Collection"
    notes: "The primary objective was the massive extraction of personally identifiable information (PII) from internal databases."
  - techniqueId: "T1567"
    techniqueName: "Exfiltration Over Web Service"
    tactic: "Exfiltration"
    notes: "Data was exfiltrated in small batches over several weeks to avoid detection."
---

## Summary

The Equifax data breach, disclosed in September 2017, was a catastrophic cybersecurity failure that exposed the personally identifiable information (PII) of approximately 147 million people, primarily in the United States. The exposed data included names, Social Security numbers, birth dates, addresses, and in some cases, driver's license numbers and credit card information. The breach resulted from Equifax’s failure to patch a known vulnerability in the Apache Struts web framework, despite being notified of the risk months earlier.

The incident is considered a watershed moment for corporate accountability and data privacy, lead to a $700 million settlement with the Federal Trade Commission (FTC), the Consumer Financial Protection Bureau (CFPB), and 50 U.S. states and territories. In February 2020, the U.S. Department of Justice formally indicted four members of the Chinese People's Liberation Army (PLA) Unit 54 for their roles in the hack, characterizing it as a state-sponsored campaign to harvest sensitive data on American citizens.

## Technical Analysis

The initial entry point for the attack was a remote code execution (RCE) vulnerability in **Apache Struts (CVE-2017-5638)**. This vulnerability involved improper handling of the `Content-Type` header in HTTP requests, which allowed an attacker to execute arbitrary commands on the web server with the privileges of the web application. Although a patch was released on March 7, 2017, Equifax failed to identify and update all instances of the software within its infrastructure.

Once the attackers gained access to the web server, they identified sensitive credentials, including usernames and passwords, stored in plain text or easily accessible configuration files. These credentials allowed them to move laterally through the network and gain access to over 50 internal databases. The attackers used sophisticated techniques to blend their traffic with legitimate administrative activity, executing over 9,000 queries to exfiltrate data in small, fragmented encrypted batches over a period of 76 days.

## Attack Chain

### Stage 1: Reconnaissance and Initial Entry
On May 13, 2017, the attackers identified a vulnerable Apache Struts installation on Equifax's legacy dispute portal and exploited CVE-2017-5638 to upload a web shell.

### Stage 2: Lateral Movement and Escalation
The attackers used the web shell to navigate the internal network, discovering unencrypted credentials that allowed them to jump from the web server to internal database clusters.

### Stage 3: Persistent Data Collection
For several weeks, the attackers ran queries against dozens of databases, systematically harvesting the PII of millions of consumers. They utilized internal file shares and staging servers to aggregate the data.

### Stage 4: Exfiltration
The harvested data was compressed and exfiltrated to offshore command-and-control servers. The attackers carefully managed the exfiltration rate to avoid triggering network anomaly detections.

## Impact Assessment

The scope of the Equifax breach remains one of the largest in history regarding the sensitivity of the data stolen. Access to Social Security numbers and birth dates provided the attackers (and potentially subsequent purchasers of the data) with the ability to facilitate long-term identity theft.

Financial and institutional impacts included:
- **Financial Settlement:** A global settlement with U.S. regulators exceeding $700 million.
- **Executive Turnover:** The retirement/resignation of the CEO, CIO, and CSO shortly after the disclosure.
- **Legislative Action:** Prompted new state-level data protection laws and federal discussions on national data privacy standards.

## Attribution

The breach is attributed with high confidence to **PLA Unit 54** (the 54th Research Institute of the Chinese People's Liberation Army). In February 2020, the U.S. Department of Justice released an indictment naming Wang Qian, Xu Ke, Liu Lei, and Wu Zhiyong as the individuals responsible for the attack.

The attribution was supported by technical evidence including the use of specific hacking tools previously associated with Chinese state actors, the routing of traffic through compromised infrastructure in multiple countries, and the strategic alignment of the theft with other Chinese "big data" collection efforts (such as the OPM and Marriott breaches).

## Timeline

### 2017-03-07 — Vulnerability Disclosure
Apache releases a security patch for CVE-2017-5638.

### 2017-05-13 — Breach Commences
Attackers exploit the unpatched portal and establish initial persistence.

### 2017-07-29 — Discovery
Equifax security personnel identify suspicious network traffic and shut down the affected portal.

### 2017-09-07 — Public Disclosure
Equifax publicly announces the breach, leading to immediate public and regulatory backlash.

### 2020-02-10 — DOJ Indictment
The U.S. Department of Justice announces the indictment of four Chinese military hackers for the Equifax breach.

## Remediation & Mitigation

Following the breach, Equifax implemented a massive security overhaul, including the appointment of new leadership and a $1.25 billion investment in security technology. Key lessons learned for the industry included:
- **Patch Management:** The critical necessity of automated asset discovery and rapid patching of third-party libraries.
- **Encryption:** The importance of encrypting sensitive PII both at rest and in transit within internal networks.
- **Detection:** Implementing behavioral analytics to detect unusual database query patterns and unauthorized exfiltration.

## Sources & References

- [FTC: Equifax Data Breach Settlement Case Overview](https://www.ftc.gov/legal-library/browse/cases-proceedings/172-3203-equifax-inc) — FTC, 2019-07-22
- [GAO: Actions Taken by Equifax and Federal Agencies in Response to the 2017 Breach](https://www.gao.gov/products/gao-18-559) — GAO, 2018-08-30
- [NVD: CVE-2017-5638 Detail](https://nvd.nist.gov/vuln/detail/CVE-2017-5638) — NVD, 2017-03-10
- [US Department of Justice: Chinese Military Personnel Charged with Computer Fraud, Economic Espionage, and Wire Fraud for Hacking Equifax](https://www.justice.gov/opa/pr/chinese-military-personnel-charged-computer-fraud-economic-espionage-and-wire-fraud-hacking) — US Department of Justice, 2020-02-10
- [CISA: Apache Struts Vulnerability Advisory](https://www.cisa.gov/news-events/alerts/2017/09/08/apache-struts-vulnerability) — CISA, 2017
