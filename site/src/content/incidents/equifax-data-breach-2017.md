---
eventId: TP-2017-0003
title: Equifax Data Breach
date: 2017-05-13
attackType: Data Breach
severity: critical
sector: Financial Services
geography: United States
threatActor: PLA 54th Research Institute
attributionConfidence: A1
reviewStatus: draft_ai
confidenceGrade: A
generatedBy: dangermouse-bot
generatedDate: 2026-04-16
cves:
  - CVE-2017-5638
relatedSlugs: []
tags:
  - data-breach
  - equifax
  - apache-struts
  - pii
  - china
  - pla
  - ftc
  - cve-2017-5638
  - financial-services
sources:
  - url: https://www.ftc.gov/legal-library/browse/cases-proceedings/172-3203-equifax-inc
    publisher: Federal Trade Commission
    publisherType: government
    reliability: R1
    publicationDate: "2019-07-22"
    accessDate: "2026-04-16"
    archived: false
  - url: https://www.gao.gov/products/gao-18-559
    publisher: U.S. Government Accountability Office
    publisherType: government
    reliability: R1
    publicationDate: "2018-08-30"
    accessDate: "2026-04-16"
    archived: false
  - url: https://nvd.nist.gov/vuln/detail/CVE-2017-5638
    publisher: NIST NVD
    publisherType: government
    reliability: R1
    publicationDate: "2017-03-10"
    accessDate: "2026-04-16"
    archived: false
  - url: https://www.justice.gov/opa/pr/chinese-military-personnel-charged-computer-fraud-economic-espionage-and-wire-fraud-hacking
    publisher: U.S. Department of Justice
    publisherType: government
    reliability: R1
    publicationDate: "2020-02-10"
    accessDate: "2026-04-16"
    archived: false
  - url: https://oversight.house.gov/wp-content/uploads/2018/12/Equifax-Report.pdf
    publisher: U.S. House Committee on Oversight and Reform
    publisherType: government
    reliability: R1
    publicationDate: "2018-12-10"
    accessDate: "2026-04-16"
    archived: false
mitreMappings:
  - techniqueId: T1190
    techniqueName: "Exploit Public-Facing Application"
    tactic: Initial Access
    notes: Apache Struts CVE-2017-5638 exploited on Equifax's consumer dispute portal
  - techniqueId: T1083
    techniqueName: "File and Directory Discovery"
    tactic: Discovery
    notes: Attackers surveyed internal file systems to locate databases containing PII
  - techniqueId: T1041
    techniqueName: "Exfiltration Over C2 Channel"
    tactic: Exfiltration
    notes: Data exfiltrated in small increments over encrypted channels to avoid detection
---

## Summary

Between May and July 2017, threat actors exploited CVE-2017-5638, a remote code execution vulnerability in the Apache Struts web framework, to breach Equifax, one of the three major U.S. consumer credit reporting agencies. The attackers gained access to an internet-facing consumer dispute portal running an unpatched version of Apache Struts and used that foothold to move laterally through Equifax's internal network over a period of 76 days.

The breach resulted in the theft of personally identifiable information (PII) for approximately 147.9 million U.S. consumers, 15.2 million U.K. citizens, and approximately 19,000 Canadian residents. Stolen data included names, Social Security numbers, dates of birth, addresses, and in some cases driver's license numbers and credit card numbers. It remains one of the largest data breaches by volume of sensitive PII compromised.

Equifax publicly disclosed the breach on 7 September 2017. The incident triggered congressional hearings, a $700 million settlement with the Federal Trade Commission, and a landmark DOJ indictment of four members of the Chinese People's Liberation Army (PLA) in February 2020.

## Technical Analysis

The initial access vector was CVE-2017-5638, a critical remote code execution vulnerability in Apache Struts 2 (CVSS 10.0). The vulnerability existed in the Jakarta Multipart parser and allowed attackers to execute arbitrary commands on the server by sending a crafted HTTP Content-Type header. Apache Struts disclosed the vulnerability and released a patch on 6 March 2017. Equifax's vulnerable server remained unpatched for over two months.

After gaining code execution on the dispute portal server, the attackers conducted reconnaissance and discovered that the server had access to other internal databases. Equifax's network architecture did not adequately segment the consumer-facing web application from backend systems containing consumer credit data.

The attackers located and queried 48 databases containing consumer PII. Data was exfiltrated in small increments over 76 days, using encrypted connections that blended with normal network traffic. The exfiltration went undetected because Equifax's SSL certificate for inspecting encrypted traffic on the affected network segment had expired in January 2016 — 19 months before the breach — and had not been renewed. This lapse in SSL inspection rendered the organization's network monitoring tools blind to the encrypted exfiltration traffic.

The U.S. House Oversight Committee's investigation identified numerous systemic security failures at Equifax, including: a lack of a comprehensive IT asset inventory, failure to implement timely patching, expired SSL certificates preventing traffic inspection, a flat network architecture without adequate segmentation, and storage of sensitive data in plaintext.

## Attack Chain

### Stage 1: Exploitation of Apache Struts (CVE-2017-5638)

Attackers sent crafted HTTP requests with malicious Content-Type headers to the Equifax consumer dispute portal, achieving remote code execution on the web server. The vulnerability had been publicly disclosed and patched 68 days earlier.

### Stage 2: Web Shell Deployment

After achieving code execution, the attackers deployed web shells on the compromised server to maintain persistent access and enable interactive command execution.

### Stage 3: Internal Reconnaissance and Lateral Movement

The attackers discovered that the dispute portal server had network connectivity to internal databases. Using credentials found on the compromised server — including credentials stored in plaintext configuration files — they accessed additional systems and enumerated database contents.

### Stage 4: Data Discovery and Staging

Over 76 days, the attackers queried 48 internal databases containing consumer PII. Data was staged on compromised internal servers before exfiltration.

### Stage 5: Data Exfiltration

Stolen data was exfiltrated over encrypted channels in controlled volumes to avoid triggering data loss prevention alerts. The expired SSL inspection certificate on the affected network segment rendered encrypted traffic invisible to Equifax's monitoring infrastructure.

## Impact Assessment

The breach compromised PII for 147.9 million U.S. consumers — approximately 56% of all American adults at the time. Exposed data included Social Security numbers (145.5 million), dates of birth (99 million), addresses (209,000 with associated credit card numbers), and driver's license numbers (38,000).

The direct financial impact to Equifax included a $700 million settlement with the FTC (including a $425 million consumer restitution fund), $100 million in penalties to the Consumer Financial Protection Bureau, $175 million in settlements with state attorneys general, and an estimated $1.4 billion in security remediation and technology upgrades.

Equifax CEO Richard Smith, CIO David Webb, and CSO Susan Mauldin resigned or retired in the weeks following the public disclosure. The breach prompted congressional hearings in both the House and Senate, and the House Oversight Committee published a 96-page investigative report detailing systemic security failures.

The breach had lasting effects on consumer credit monitoring regulation and corporate cybersecurity accountability standards. Multiple states enacted data breach notification laws, and Equifax was required to provide free credit monitoring and identity theft protection to affected consumers.

## Attribution

In February 2020, the U.S. Department of Justice indicted four members of the Chinese People's Liberation Army's 54th Research Institute, part of the PLA's military intelligence apparatus. The four named defendants — Wu Zhiyong, Wang Qian, Xu Ke, and Liu Lei — were charged with computer fraud, economic espionage, and wire fraud.

The indictment detailed the attackers' operational security measures, including routing traffic through approximately 34 servers located in nearly 20 countries to obscure their origin, using encrypted communication channels, and wiping log files daily to hinder forensic investigation.

Then-Attorney General William Barr characterized the breach as a state-sponsored intelligence operation, stating that the stolen data would be used to support Chinese intelligence collection and counterintelligence operations. The scale of the data theft — covering more than half the U.S. adult population — is consistent with the bulk data collection operations attributed to Chinese intelligence services.

## Timeline

### 2017-03-06 — Apache Struts Patch Released

Apache Software Foundation disclosed CVE-2017-5638 and released Apache Struts 2.3.32 and 2.5.10.1 to address the vulnerability.

### 2017-03-09 — Equifax Notified of Vulnerability

The U.S. Department of Homeland Security CERT disseminated a notification about CVE-2017-5638. Equifax's internal distribution of this notification failed to reach the team responsible for the vulnerable system.

### 2017-05-13 — Initial Compromise

Attackers exploited CVE-2017-5638 on Equifax's consumer dispute portal and established persistent access via web shells.

### 2017-07-29 — Breach Detected

Equifax's security team discovered suspicious network traffic after renewing the expired SSL inspection certificate on the affected network segment.

### 2017-07-30 — Compromised Systems Taken Offline

Equifax took the affected web application offline and began forensic investigation with the assistance of Mandiant.

### 2017-09-07 — Public Disclosure

Equifax publicly disclosed the breach, announcing that PII for approximately 143 million consumers had been compromised (later revised to 147.9 million).

### 2019-07-22 — FTC Settlement

The FTC announced a settlement requiring Equifax to pay up to $700 million, including a $425 million consumer restitution fund.

### 2020-02-10 — DOJ Indictment of PLA Members

The U.S. Department of Justice indicted four members of the Chinese PLA's 54th Research Institute for their roles in the breach.

## Remediation & Mitigation

Organizations should maintain comprehensive software asset inventories and implement automated patch management programs with defined SLA timelines for critical vulnerabilities. CVE-2017-5638 had a patch available 68 days before Equifax was compromised.

Network segmentation should isolate internet-facing applications from backend databases and internal systems. The principle of least privilege should govern network connectivity between application tiers, with firewall rules restricting database access to authorized application servers.

SSL/TLS inspection infrastructure requires monitoring to ensure certificates remain valid and inspection capabilities remain operational. Expired certificates should be automatically flagged through certificate management systems.

Sensitive data should be encrypted at rest and in transit within internal networks. Data loss prevention (DLP) systems should monitor for anomalous data access patterns and large-volume data transfers from database servers.

Organizations should implement web application firewalls (WAFs) in front of internet-facing applications and configure them to detect and block exploitation attempts against known framework vulnerabilities.

## Sources & References

- [FTC: Equifax Inc. Case Proceedings](https://www.ftc.gov/legal-library/browse/cases-proceedings/172-3203-equifax-inc) — Federal Trade Commission, 2019-07-22
- [GAO: Report GAO-18-559 — Data Protection and Actions Taken](https://www.gao.gov/products/gao-18-559) — U.S. Government Accountability Office, 2018-08-30
- [NIST NVD: CVE-2017-5638](https://nvd.nist.gov/vuln/detail/CVE-2017-5638) — NIST NVD, 2017-03-10
- [DOJ: Chinese Military Personnel Charged for Equifax Hack](https://www.justice.gov/opa/pr/chinese-military-personnel-charged-computer-fraud-economic-espionage-and-wire-fraud-hacking) — U.S. Department of Justice, 2020-02-10
- [U.S. House Oversight Committee: Equifax Data Breach Report](https://oversight.house.gov/wp-content/uploads/2018/12/Equifax-Report.pdf) — U.S. House Committee on Oversight and Reform, 2018-12-10
