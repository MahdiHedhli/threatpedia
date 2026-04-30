---
eventId: TP-2013-0003
title: Target POS Data Breach
date: 2013-11-27
attackType: Payment Card Data Breach
severity: critical
sector: Retail
geography: United States
threatActor: Unknown
attributionConfidence: A4
reviewStatus: draft_ai
confidenceGrade: A
generatedBy: kernel-k
generatedDate: 2026-04-30
cves: []
relatedSlugs: []
tags:
  - target
  - retail
  - point-of-sale
  - payment-card-data
  - data-breach
  - vendor-credentials
  - third-party-access
  - network-segmentation
  - exfiltration
  - settlement
sources:
  - url: https://corporate.target.com/press/release/2013/12/target-confirms-unauthorized-access-to-payment-card-data-in-u-s-stores
    publisher: Target
    publisherType: vendor
    reliability: R1
    publicationDate: "2013-12-19"
    accessDate: "2026-04-30"
    archived: false
  - url: https://corporate.target.com/press/release/2014/01/target-provides-update-on-data-breach-and-financial-performance
    publisher: Target
    publisherType: vendor
    reliability: R1
    publicationDate: "2014-01-10"
    accessDate: "2026-04-30"
    archived: false
  - url: https://www.commerce.senate.gov/services/files/24d3c229-4f2f-405d-b8db-a3a67f183883
    publisher: U.S. Senate Committee on Commerce, Science, and Transportation
    publisherType: government
    reliability: R1
    publicationDate: "2014-03-26"
    accessDate: "2026-04-30"
    archived: false
  - url: https://www.texasattorneygeneral.gov/news/releases/ag-paxton-announces-185-million-settlement-target-resolve-2013-data-breach
    publisher: Texas Attorney General
    publisherType: government
    reliability: R1
    publicationDate: "2017-05-23"
    accessDate: "2026-04-30"
    archived: false
mitreMappings:
  - techniqueId: T1078
    techniqueName: Valid Accounts
    tactic: Initial Access
    notes: The multistate settlement described attackers accessing Target's gateway server through credentials stolen from a third-party vendor.
  - techniqueId: T1041
    techniqueName: Exfiltration Over C2 Channel
    tactic: Exfiltration
    notes: The Senate Commerce staff report described stolen data leaving Target's network through external file-transfer infrastructure.
---

## Summary

The Target POS data breach was a 2013 retail payment-card and customer-information compromise affecting Target's U.S. stores. Target publicly confirmed on December 19, 2013 that unauthorized access to payment-card data may have affected guests who made credit and debit card purchases in U.S. stores between November 27 and December 15, 2013.

Target initially said approximately 40 million credit and debit card accounts may have been impacted. On January 10, 2014, Target reported that its investigation had also found separate guest information for up to 70 million individuals, including names, mailing addresses, phone numbers, or email addresses.

The U.S. Senate Commerce Committee staff report later analyzed the incident through a kill-chain framework. It described public reporting that attackers first gained access to Target's internal network on November 12, 2013, used third-party vendor credentials, installed point-of-sale malware, moved stolen data through internal systems, and exfiltrated data to external infrastructure.

## Technical Analysis

The available public record supports a vendor-credential and POS-malware breach, but not a confirmed named threat actor. The Texas Attorney General's settlement announcement states that attackers accessed Target's gateway server through credentials stolen from a third-party vendor around November 12, 2013. The same announcement said those credentials were used to exploit weaknesses in Target's system, access a customer-service database, install malware, and capture personal and banking information.

The Senate Commerce staff report described the vendor as a small Pennsylvania HVAC company and identified several defensive failure points in public reporting: third-party access, malware alerts that were not acted on, movement from less sensitive systems toward consumer-data environments, and warnings related to planned exfiltration paths.

The POS activity occurred during the holiday shopping period. Target said the payment-card exposure affected purchases made in U.S. stores between November 27 and December 15, 2013. The Senate report cited public analyses that malware was first installed on a small number of POS terminals between November 15 and November 28, with most POS systems infected by November 30.

## Attack Chain

### Stage 1: Third-Party Credential Access

Attackers obtained credentials associated with a third-party vendor and used them to access Target's environment. Public sources do not identify a confirmed malware family or named actor for this initial credential compromise.

### Stage 2: Internal Movement Toward Payment Systems

The Senate Commerce staff report said public reporting suggested attackers moved from less sensitive parts of Target's network to areas storing consumer data. It framed network isolation and segmentation as one of the control gaps relevant to the incident.

### Stage 3: POS Malware Installation

Attackers installed malware on Target point-of-sale systems. The Senate report cited public analyses that the first POS malware installations occurred between November 15 and November 28, 2013, and that most POS systems were infected by November 30.

### Stage 4: Data Staging and Exfiltration

The Senate report described malware on a Target server designed to move stolen data through Target's network and firewall. It also cited reporting that stolen data began leaving through an external FTP server on December 2 and that the attackers collected 11 GB of stolen information using a Russia-based server.

### Stage 5: Public Disclosure and Regulatory Response

Target publicly confirmed the payment-card incident on December 19, 2013 and later disclosed additional customer-contact information exposure. State attorneys general reached an $18.5 million settlement with Target in 2017 that required security-program, assessment, encryption, segmentation, and access-control commitments.

## Impact Assessment

Target's public statements and regulatory settlement describe two affected data categories. Payment-card data for approximately 40 million credit and debit card accounts may have been impacted during the November 27 to December 15, 2013 in-store purchase window. Separate guest information for up to 70 million individuals included names, mailing addresses, phone numbers, or email addresses.

The multistate settlement described more than 41 million payment-card accounts and contact information for more than 60 million customers. Those numbers are consistent with Target's earlier public disclosures while using the settlement's own phrasing.

Target also disclosed business impact. In January 2014, the company lowered its fourth-quarter 2013 earnings and sales expectations, said post-disclosure sales were weaker than expected, and warned that breach-related costs could include payment-card network claims, fraud and reissuance costs, civil litigation, governmental investigations, legal and investigative expenses, consulting fees, and remediation investments.

## Attribution

No public source in the selected record identifies a confirmed named threat actor responsible for the Target breach. The sources support criminal data-theft activity, stolen vendor credentials, POS malware, and data exfiltration, but they do not support assigning the incident to a specific group.

For Threatpedia, the safest attribution is Unknown with A4 confidence. The article therefore avoids naming a malware operator, state sponsor, or criminal crew unless later authoritative sources provide stronger evidence.

## Timeline

### 2013-11-12 — Vendor-Credential Access Reported

The Texas Attorney General's settlement announcement states that attackers accessed Target's gateway server through credentials stolen from a third-party vendor around November 12, 2013.

### 2013-11-15 — POS Malware Installation Window Begins

The Senate Commerce staff report cited public reporting that attackers first installed malware on a small number of POS terminals between November 15 and November 28.

### 2013-11-27 — Payment-Card Exposure Window Begins

Target said approximately 40 million credit and debit card accounts may have been impacted for guests who made purchases in U.S. stores between November 27 and December 15, 2013.

### 2013-12-02 — Exfiltration Activity Reported

The Senate report cited public analysis that stolen data began being sent to an external FTP server through another compromised Target server on December 2.

### 2013-12-15 — Payment-Card Exposure Window Ends

Target's public disclosure identified December 15, 2013 as the end of the payment-card exposure window.

### 2013-12-19 — Target Publicly Confirms the Incident

Target confirmed unauthorized access to payment-card data and said it had identified and resolved the issue.

### 2014-01-10 — Additional Guest Information Disclosed

Target reported that its investigation had identified separate guest information for up to 70 million individuals.

### 2014-03-26 — Senate Commerce Staff Report Published

The U.S. Senate Commerce Committee majority staff published a kill-chain analysis of the breach.

### 2017-05-23 — Multistate Settlement Announced

The Texas Attorney General announced an $18.5 million multistate settlement requiring Target to maintain a security program and implement related security controls.

## Remediation & Mitigation

Target's public response included law-enforcement coordination, financial-institution coordination, a third-party forensic investigation, guest notification, zero-liability messaging for fraudulent charges, and free credit monitoring and identity-theft protection for affected guests.

The 2017 settlement required Target to develop, implement, and maintain a comprehensive information security program, appoint an executive officer to oversee it, and obtain independent third-party security assessments. It also required policies and controls around encryption, cardholder-data environment segmentation, password rotation, two-step authentication for certain accounts, and access control.

The incident remains a reference case for vendor-access governance, network segmentation, endpoint detection response, POS monitoring, and exfiltration detection. The Senate report emphasized that multiple control opportunities existed across the attack chain before data left Target's network.

## Sources & References

- [Target: Target Confirms Unauthorized Access to Payment Card Data in U.S. Stores](https://corporate.target.com/press/release/2013/12/target-confirms-unauthorized-access-to-payment-card-data-in-u-s-stores) — Target, 2013-12-19
- [Target: Target Provides Update on Data Breach and Financial Performance](https://corporate.target.com/press/release/2014/01/target-provides-update-on-data-breach-and-financial-performance) — Target, 2014-01-10
- [U.S. Senate Committee on Commerce, Science, and Transportation: A Kill Chain Analysis of the 2013 Target Data Breach](https://www.commerce.senate.gov/services/files/24d3c229-4f2f-405d-b8db-a3a67f183883) — U.S. Senate Committee on Commerce, Science, and Transportation, 2014-03-26
- [Texas Attorney General: AG Paxton Announces $18.5 Million Settlement with Target to Resolve 2013 Data Breach](https://www.texasattorneygeneral.gov/news/releases/ag-paxton-announces-185-million-settlement-target-resolve-2013-data-breach) — Texas Attorney General, 2017-05-23
