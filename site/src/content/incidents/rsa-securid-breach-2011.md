---
eventId: TP-2011-0002
title: RSA SecurID Breach
date: 2011-03-17
attackType: Authentication Infrastructure Compromise
severity: high
sector: Technology & Defense
geography: United States
threatActor: Unknown
attributionConfidence: A4
reviewStatus: draft_ai
confidenceGrade: B
generatedBy: kernel-k
generatedDate: 2026-05-17
cves:
  - CVE-2011-0609
relatedSlugs: []
tags:
  - rsa
  - securid
  - two-factor-authentication
  - authentication
  - token-seeds
  - emc
  - lockheed-martin
  - spearphishing
  - poison-ivy
  - cve-2011-0609
sources:
  - url: https://www.sec.gov/Archives/edgar/data/790070/000119312511070159/dex991.htm
    publisher: EMC
    publisherType: vendor
    reliability: R1
    publicationDate: "2011-03-17"
    accessDate: "2026-05-17"
    archived: false
  - url: https://www.sec.gov/Archives/edgar/data/790070/000119312511070159/dex992.htm
    publisher: RSA
    publisherType: vendor
    reliability: R1
    publicationDate: "2011-03-17"
    accessDate: "2026-05-17"
    archived: false
  - url: https://www.sec.gov/Archives/edgar/data/790070/000119312511212329/d10q.htm
    publisher: EMC
    publisherType: government
    reliability: R1
    publicationDate: "2011-08-05"
    accessDate: "2026-05-17"
    archived: false
  - url: https://news.lockheedmartin.com/2011-05-28-Lockheed-Martin-Customer-Program-and-Employee-Data-Secure
    publisher: Lockheed Martin
    publisherType: vendor
    reliability: R1
    publicationDate: "2011-05-28"
    accessDate: "2026-05-17"
    archived: false
  - url: https://www.theregister.com/security/2011/04/04/rsa-explains-how-attackers-breached-its-systems/1047267
    publisher: The Register
    publisherType: media
    reliability: R2
    publicationDate: "2011-04-04"
    accessDate: "2026-05-17"
    archived: false
  - url: https://www.secureworks.com/blog/general-secureid-integrity
    publisher: SecureWorks
    publisherType: research
    reliability: R2
    publicationDate: "2011-06-16"
    accessDate: "2026-05-17"
    archived: false
mitreMappings:
  - techniqueId: T1566.001
    techniqueName: Spearphishing Attachment
    tactic: Initial Access
    attackVersion: v19
    confidence: probable
    evidence: The Register reported that the intrusion used targeted phishing messages with an attached Excel spreadsheet titled "2011 Recruitment plan.xls".
  - techniqueId: T1203
    techniqueName: Exploitation for Client Execution
    tactic: Execution
    attackVersion: v19
    confidence: probable
    evidence: The same reporting described the spreadsheet as carrying an Adobe Flash zero-day exploit for CVE-2011-0609.
  - techniqueId: T1068
    techniqueName: Exploitation for Privilege Escalation
    tactic: Privilege Escalation
    attackVersion: v19
    confidence: probable
    evidence: The Register reported that the attacker used privilege-elevation activity after the Poison Ivy foothold to reach higher-value administrator accounts.
  - techniqueId: T1105
    techniqueName: Ingress Tool Transfer
    tactic: Command and Control
    attackVersion: v19
    confidence: probable
    evidence: The Register reported that the Flash exploit installed backdoor malware and that the attack involved a Poison Ivy variant inside RSA's network.
  - techniqueId: T1005
    techniqueName: Data from Local System
    tactic: Collection
    attackVersion: v19
    confidence: confirmed
    evidence: RSA disclosed that the intrusion resulted in certain information being extracted from RSA systems, including information related to SecurID products.
---

## Summary

The RSA SecurID breach was a March 2011 compromise of RSA, then an EMC business unit, in which attackers extracted information related to RSA's SecurID two-factor authentication products. RSA disclosed the incident in an open letter to customers on March 17, 2011, describing the operation as an advanced persistent threat and warning that the extracted information could reduce the effectiveness of some SecurID implementations as part of a broader attack.

RSA did not publicly identify the exact data taken in its initial disclosure. Its customer advisory said affected products were RSA SecurID implementations and urged customers to apply immediate hardening steps around credentials, directory services, help-desk processes, administrative privileges, monitoring, and systems hosting security software.

The breach became historically significant because SecurID was widely used for enterprise and government remote-access authentication. EMC later reported a $66.3 million second-quarter 2011 charge tied to expanded customer remediation programs after heightened concerns around an unsuccessful cyber attack on a defense-sector customer and broader media coverage of high-profile intrusions.

## Technical Analysis

RSA's public disclosure established the core incident facts: RSA detected a targeted cyber attack, investigated with authorities, and determined that some information extracted from RSA systems related to SecurID two-factor authentication products. RSA said the extracted information did not by itself enable a successful direct attack against SecurID customers, but it could reduce the effectiveness of a current implementation when combined with other attack activity.

The Register later reported details from an RSA postmortem by Uri Rivner. According to that reporting, the intrusion began with targeted phishing emails sent over a two-day period to two small groups of employees. The message used the subject "2011 Recruitment Plan" and carried an Excel attachment titled "2011 Recruitment plan.xls". The spreadsheet contained an Adobe Flash zero-day exploit for CVE-2011-0609 and installed backdoor malware.

The same reporting described the payload as a Poison Ivy variant and said the attacker used privilege-escalation steps after initial compromise to reach higher-value administrator accounts. Those details support a multi-stage intrusion pattern: social engineering, client-side exploitation, malware installation, internal access expansion, and extraction of sensitive product-related information.

The sensitive point in the public record is what the extracted SecurID-related information meant. RSA's own disclosure did not say that token seed records had been taken. SecureWorks' Counter Threat Unit later assessed that there was growing evidence consistent with SecurID seed compromise, but also noted that the claim could not be independently verified without RSA releasing the specific information that had been compromised.

## Attack Chain

### Stage 1: Targeted Phishing

Public reporting described spear-phishing messages sent to small employee groups rather than a broad spam campaign. The attachment and subject line were crafted to appear business-relevant, and one employee reportedly recovered the message from a junk-mail folder and opened the spreadsheet.

### Stage 2: Client-Side Exploitation

The spreadsheet reportedly embedded an Adobe Flash exploit for CVE-2011-0609. That exploit path allowed code execution after the attachment was opened and provided a foothold on RSA's internal network.

### Stage 3: Backdoor Installation

The exploit installed backdoor malware. Reporting attributed the malware family to Poison Ivy, a remote-access tool used in targeted intrusions.

### Stage 4: Privilege Expansion

After initial access, the attacker reportedly used privilege-escalation activity to move from a lower-value account toward higher-value administrator access. The available public sources do not identify all systems reached during that stage.

### Stage 5: Extraction of SecurID-Related Information

RSA confirmed that information had been extracted from its systems and that some of it was specifically related to SecurID. The public evidence supports treating the stolen material as authentication-infrastructure sensitive data, while keeping the exact token-seed question bounded to later reporting and analysis.

## Impact Assessment

The direct impact was a loss of confidence in the integrity of a widely deployed two-factor authentication product. RSA told customers that the stolen information could reduce the effectiveness of SecurID implementations as part of a broader attack, which meant the incident affected not only RSA but also organizations that relied on SecurID for remote access and administrative authentication.

EMC's later Form 10-Q quantified part of the business impact. The company said it incurred and accrued costs for investigation, system hardening, and customer remediation in the first quarter of 2011, then recorded a $66.3 million charge in the second quarter for expanded customer remediation programs. EMC also reported an $81.3 million reserve in accrued liabilities at June 30, 2011.

The incident also had downstream operational significance. Lockheed Martin disclosed that on May 21, 2011 it detected a significant and tenacious attack on its information systems network, and said its response kept customer, program, and employee personal data secure. EMC's filing linked the expansion of RSA customer remediation to heightened customer concerns after press coverage of an unsuccessful cyber attack on a defense-sector customer.

## Attribution

RSA described the operation as an advanced persistent threat, but the available public sources do not identify a confirmed organization, government, or named threat actor responsible for the breach. The available record supports conservative unknown attribution.

The tactics reported publicly, including targeted phishing, exploitation of a Flash zero-day, backdoor deployment, and privilege expansion, are consistent with a capable targeted intrusion. That technical characterization does not establish a named actor.

## Timeline

### 2011-03-17 — RSA Discloses the Breach

RSA published an open letter to customers and a SecurCare advisory stating that information related to SecurID had been extracted from RSA systems.

### 2011-04-04 — Intrusion Path Publicly Reported

The Register reported details from RSA's public discussion of the attack chain, including spear-phishing emails, a weaponized Excel spreadsheet, CVE-2011-0609, and Poison Ivy malware.

### 2011-05-21 — Lockheed Martin Detects an Attack

Lockheed Martin said it detected a significant and tenacious attack on its information systems network and took immediate defensive action.

### 2011-05-28 — Lockheed Martin Publishes Public Statement

Lockheed Martin stated that its systems remained secure and that no customer, program, or employee personal data had been compromised.

### 2011-06-16 — SecureWorks Reassesses SecurID Risk

SecureWorks' Counter Threat Unit published analysis arguing that recent events supported a cautious reassessment of SecurID seed integrity, while noting that RSA had not publicly confirmed the exact compromised data.

### 2011-08-05 — EMC Reports Remediation Costs

EMC's quarterly filing reported a $66.3 million special charge tied to expanded customer remediation programs and described earlier costs for investigation, system hardening, and remediation.

## Remediation & Mitigation

RSA's customer advisory emphasized compensating controls rather than a single product patch. Recommended steps included stronger password and PIN policies, least-privilege administration, renewed phishing awareness, tighter monitoring of privilege changes, additional protection around Active Directory, hardening and monitoring of systems hosting critical security software, help-desk process review, and patching of security products and host operating systems.

For SecurID customers, the main mitigation lesson was that two-factor authentication infrastructure depends on both token secrets and the surrounding identity environment. Organizations needed to treat directory services, remote-access gateways, help desks, administrator roles, and monitoring pipelines as part of the SecurID security boundary.

The incident also demonstrated the need for vendor-side segmentation and rapid customer support when authentication product data is exposed. EMC's remediation program, subsequent customer concern, and token replacement discussion show that authentication vendors may need to support customer-specific risk decisions even when the public record cannot safely disclose every technical detail of the compromised material.

## Sources & References

- [EMC: Open Letter to RSA Customers](https://www.sec.gov/Archives/edgar/data/790070/000119312511070159/dex991.htm) — EMC, 2011-03-17
- [RSA: Required Actions for SecurID Installations](https://www.sec.gov/Archives/edgar/data/790070/000119312511070159/dex992.htm) — RSA, 2011-03-17
- [EMC: Quarterly Report on Form 10-Q](https://www.sec.gov/Archives/edgar/data/790070/000119312511212329/d10q.htm) — EMC, 2011-08-05
- [Lockheed Martin: Customer, Program and Employee Data Secure](https://news.lockheedmartin.com/2011-05-28-Lockheed-Martin-Customer-Program-and-Employee-Data-Secure) — Lockheed Martin, 2011-05-28
- [The Register: RSA Explains How Attackers Breached Its Systems](https://www.theregister.com/security/2011/04/04/rsa-explains-how-attackers-breached-its-systems/1047267) — The Register, 2011-04-04
- [SecureWorks: Recent Events Cause Re-assessment of SecurID Integrity](https://www.secureworks.com/blog/general-secureid-integrity) — SecureWorks, 2011-06-16
