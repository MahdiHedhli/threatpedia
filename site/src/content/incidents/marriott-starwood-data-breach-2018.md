---
eventId: TP-2018-0001
title: "Marriott International Starwood Reservation System Breach"
date: 2018-11-30
attackType: Data Breach
severity: critical
sector: Hospitality
geography: Global
threatActor: "China-linked espionage operators"
attributionConfidence: A2
reviewStatus: under_review
confidenceGrade: C
generatedBy: dangermouse-bot
generatedDate: 2026-04-16
cves: []
relatedSlugs: []
tags:
  - data-breach
  - hospitality
  - marriott
  - starwood
  - payment-card
  - passport
  - espionage
  - acquisition
sources:
  - url: "https://www.ftc.gov/legal-library/browse/cases-proceedings/marriott-international-inc-starwood-hotels-resorts-worldwide-llc"
    publisher: "Federal Trade Commission"
    publisherType: government
    reliability: R1
    publicationDate: "2020-10-01"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.justice.gov/opa/pr/chinese-military-personnel-charged-computer-fraud-economic-espionage-and-wire-fraud-hacking"
    publisher: "U.S. Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2020-02-10"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/2020/10/ico-fines-marriott-international-inc-184million-for-failing-to-keep-customers-personal-data-secure/"
    publisher: "UK Information Commissioner's Office"
    publisherType: government
    reliability: R1
    publicationDate: "2020-10-30"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.nytimes.com/2018/11/30/business/marriott-data-breach.html"
    publisher: "The New York Times"
    publisherType: media
    reliability: R2
    publicationDate: "2018-11-30"
    accessDate: "2026-04-16"
    archived: false
mitreMappings:
  - techniqueId: T1078
    techniqueName: "Valid Accounts"
    tactic: "Initial Access"
    notes: "Attackers used compromised administrator credentials to access the Starwood reservation database."
  - techniqueId: T1005
    techniqueName: "Data from Local System"
    tactic: "Collection"
    notes: "Guest reservation data including personal information and payment cards was collected from the Starwood database."
  - techniqueId: T1560
    techniqueName: "Archive Collected Data"
    tactic: "Collection"
    notes: "Attackers compressed and encrypted stolen data before exfiltration."
  - techniqueId: T1071
    techniqueName: "Application Layer Protocol"
    tactic: "Command and Control"
    notes: "Remote access trojan communicated using web-based protocols to blend with normal traffic."
---

## Executive Summary

On November 30, 2018, Marriott International disclosed that the Starwood guest reservation database had been subject to unauthorized access since 2014, affecting up to 500 million guest records. The initial compromise predated Marriott's $13.6 billion acquisition of Starwood Hotels & Resorts in September 2016, meaning the attackers were embedded in Starwood's systems for approximately two years before the merger and continued operating within the combined entity for an additional two years.

The compromised data included guest names, mailing addresses, phone numbers, email addresses, passport numbers, dates of birth, arrival and departure information, and communication preferences. For a subset of approximately 383 million records, encrypted payment card numbers and expiration dates were also exposed. Marriott acknowledged that the encryption keys may have been compromised as well, potentially rendering the encryption ineffective.

The breach resulted in regulatory fines totaling approximately $52 million, including a 18.4 million GBP penalty from the UK Information Commissioner's Office under the General Data Protection Regulation. Multiple media reports and U.S. intelligence assessments linked the intrusion to Chinese state-sponsored intelligence gathering, though Marriott itself did not publicly confirm this attribution.

## Technical Analysis

The intrusion into Starwood's reservation system began in 2014, well before the Marriott acquisition. The attackers gained access to the Starwood guest reservation database using compromised administrator credentials. Once inside, they deployed a remote access trojan (RAT) and a web shell to maintain persistent access to the network.

The attackers used Mimikatz and similar credential harvesting tools to extract additional credentials from the Starwood network, enabling them to access database servers containing guest reservation records. The Starwood reservation system operated on a legacy infrastructure that had not been fully integrated into Marriott's security monitoring environment following the 2016 acquisition.

An internal security tool detected suspicious database queries on September 8, 2018. Marriott's investigation, conducted with assistance from third-party forensic investigators, revealed that the unauthorized access had persisted since 2014. The investigation found that the attackers had been querying the reservation database and exfiltrating data over an extended period, using encryption to conceal the contents of exfiltrated files.

The attackers encrypted and compressed stolen data before exfiltration, which complicated forensic analysis and made it difficult to determine the precise scope of data accessed. Marriott engaged forensic investigators who were able to partially decrypt and analyze files left on compromised systems.

## Attack Chain

### Stage 1: Initial Access to Starwood Systems

Attackers compromised administrator credentials for the Starwood reservation system in 2014. The specific method of initial credential compromise has not been publicly disclosed.

### Stage 2: Persistence Establishment

Remote access tools and web shells were deployed on Starwood servers to maintain ongoing access. The tools were configured to blend with normal system operations and avoid detection.

### Stage 3: Credential Harvesting

The attackers used credential dumping tools to extract additional usernames and passwords from the Starwood network, including database administrator credentials for the reservation system.

### Stage 4: Database Access and Querying

With database administrator access, the attackers queried the Starwood guest reservation database, extracting guest personal information, passport numbers, and payment card data over an extended period.

### Stage 5: Data Encryption and Exfiltration

Stolen data was compressed and encrypted on compromised servers before being transferred out of the network. The use of encryption for exfiltrated files indicated operational security awareness by the threat actors.

### Stage 6: Continued Operation Post-Acquisition

The attackers continued operating within the Starwood reservation infrastructure after the Marriott acquisition in September 2016. The reservation system was not immediately integrated into Marriott's security monitoring, allowing the intrusion to persist.

## Impact Assessment

The breach affected up to 500 million guest records, later revised to approximately 383 million unique records after deduplication. The compromised data encompassed a wide range of personal information collected from hotel guests over a multi-year period.

Among the compromised records, approximately 5.25 million unencrypted passport numbers were exposed. The theft of passport data represented a particular intelligence value, as passport numbers can be used for tracking individuals' international movements and establishing patterns of life.

Financial consequences for Marriott included regulatory fines in multiple jurisdictions. The UK ICO imposed a fine of 18.4 million GBP (reduced from an initially proposed 99 million GBP) under GDPR. The FTC entered a consent order requiring Marriott to implement a comprehensive information security program. Marriott also faced class-action lawsuits from affected guests and incurred costs for breach notification, identity monitoring services, and security improvements.

The breach highlighted acquisition-related cybersecurity risk. Marriott inherited the compromised Starwood infrastructure as part of the acquisition without conducting sufficient cybersecurity due diligence to detect the ongoing intrusion prior to completing the transaction.

## Historical Context

Attribution for the Marriott breach has been linked to Chinese state-sponsored intelligence gathering by multiple sources, though with varying degrees of specificity. The New York Times reported in December 2018, citing U.S. intelligence officials, that the breach was part of a Chinese intelligence-gathering effort to compile data on U.S. government officials and intelligence officers who traveled internationally.

The DOJ indictment of four Chinese military personnel (PLA) in February 2020 for the Equifax breach included language about a broader campaign of Chinese state-sponsored intrusions targeting large datasets of personal information, though the indictment did not specifically charge individuals for the Marriott breach.

The tools and techniques observed in the intrusion, including the use of specific RAT variants and credential harvesting methods, were consistent with those used by Chinese state-sponsored groups in other operations targeting the hospitality sector. The extended dwell time and focus on passport data suggested an intelligence collection operation rather than a financially motivated criminal enterprise.

## Timeline

### 2014-07-01 — Initial Compromise of Starwood Systems

Attackers first gained unauthorized access to the Starwood guest reservation database. The specific date has been approximated to mid-2014 based on forensic evidence.

### 2016-09-23 — Marriott Acquires Starwood

Marriott International completed its $13.6 billion acquisition of Starwood Hotels & Resorts. The compromised reservation system was inherited as part of the acquisition.

### 2018-09-08 — Suspicious Activity Detected

Marriott's internal security tool flagged an anomalous database query on the Starwood reservation system, triggering an investigation.

### 2018-11-19 — Scope Determined

Marriott's forensic investigation determined that unauthorized access to the Starwood reservation database had been ongoing since 2014 and affected up to 500 million guest records.

### 2018-11-30 — Public Disclosure

Marriott publicly disclosed the breach, notifying affected guests and offering free enrollment in a web monitoring service.

### 2020-10-30 — UK ICO Fine

The UK Information Commissioner's Office fined Marriott 18.4 million GBP for GDPR violations related to the breach.

### 2020-10-01 — FTC Consent Order

The Federal Trade Commission entered a consent order requiring Marriott to implement a comprehensive information security program.

## Remediation & Mitigation

Marriott undertook a multi-year effort to integrate and upgrade the Starwood reservation infrastructure following the breach. The company phased out legacy Starwood systems, migrated guest data to Marriott's platform, and implemented enhanced security monitoring across the combined estate.

The breach demonstrated the critical importance of cybersecurity due diligence during mergers and acquisitions. Organizations acquiring companies with significant digital assets should conduct thorough security assessments of inherited infrastructure, including compromise assessments to detect existing intrusions before completing integration.

Key defensive measures include implementing database activity monitoring to detect unusual query patterns, deploying data loss prevention controls on database systems containing sensitive records, enforcing multi-factor authentication on all administrative accounts, encrypting sensitive data at rest with properly managed encryption keys, and maintaining comprehensive audit logs of database access.

Organizations in the hospitality sector should minimize data retention periods for guest information, particularly for sensitive data elements such as passport numbers, and should evaluate whether all collected data elements are necessary for business operations.

## Sources & References

- [FTC: Marriott International / Starwood Hotels Case](https://www.ftc.gov/legal-library/browse/cases-proceedings/marriott-international-inc-starwood-hotels-resorts-worldwide-llc) — Federal Trade Commission, 2020-10-01
- [DOJ: Chinese Military Personnel Charged](https://www.justice.gov/opa/pr/chinese-military-personnel-charged-computer-fraud-economic-espionage-and-wire-fraud-hacking) — U.S. Department of Justice, 2020-02-10
- [UK ICO: Marriott Fine](https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/2020/10/ico-fines-marriott-international-inc-184million-for-failing-to-keep-customers-personal-data-secure/) — UK Information Commissioner's Office, 2020-10-30
- [NYT: Marriott Data Breach](https://www.nytimes.com/2018/11/30/business/marriott-data-breach.html) — The New York Times, 2018-11-30
