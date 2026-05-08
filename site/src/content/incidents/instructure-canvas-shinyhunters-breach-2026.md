---
eventId: TP-2026-0056
title: "Instructure Canvas ShinyHunters Breach: Data Theft and Login Portal Defacement, May 2026"
date: 2026-05-07
attackType: Data Breach
severity: high
sector: Education & Research
geography: Global
threatActor: ShinyHunters
attributionConfidence: A4
reviewStatus: draft_ai
confidenceGrade: B
generatedBy: dangermouse-bot
generatedDate: 2026-05-08
cves: []
relatedSlugs:
  - "hims-hers-shinyhunters-breach-2026"
tags:
  - "data-breach"
  - "shinyhunters"
  - "extortion"
  - "education"
  - "canvas-lms"
  - "instructure"
  - "login-defacement"
sources:
  - url: "https://status.instructure.com/incidents/9wm4knj2r64z"
    publisher: "Instructure"
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-05-01"
    accessDate: "2026-05-08"
    archived: false
  - url: "https://www.bleepingcomputer.com/news/security/canvas-login-portals-hacked-in-mass-shinyhunters-extortion-campaign/"
    publisher: "BleepingComputer"
    publisherType: media
    reliability: R1
    publicationDate: "2026-05-07"
    accessDate: "2026-05-08"
    archived: false
  - url: "https://apnews.com/article/446c240d5aeb1b1a1e3795fb92237563"
    publisher: "AP News"
    publisherType: media
    reliability: R2
    publicationDate: "2026-05-08"
    accessDate: "2026-05-08"
    archived: false
  - url: "https://techcrunch.com/2026/05/07/hackers-deface-school-login-pages-after-claiming-another-instructure-hack/"
    publisher: "TechCrunch"
    publisherType: media
    reliability: R2
    publicationDate: "2026-05-07"
    accessDate: "2026-05-08"
    archived: false
  - url: "https://it.rutgers.edu/alerts/2026/05/04/nationwide-security-breach-involving-canvas/"
    publisher: "Rutgers University Information Technology"
    publisherType: government
    reliability: R2
    publicationDate: "2026-05-04"
    accessDate: "2026-05-08"
    archived: false
mitreMappings:
  - techniqueId: "T1078"
    techniqueName: "Valid Accounts"
    tactic: "Initial Access"
    notes: "ShinyHunters gained unauthorized access to Instructure backend systems, with the company detecting the activity on April 29, 2026, and revoking access upon detection."
  - techniqueId: "T1530"
    techniqueName: "Data from Cloud Storage"
    tactic: "Collection"
    notes: "The threat actor accessed and exfiltrated user records stored in Instructure's cloud-hosted Canvas LMS infrastructure. ShinyHunters claimed 3.65 terabytes of data covering approximately 275 million user records."
  - techniqueId: "T1491.002"
    techniqueName: "External Defacement"
    tactic: "Impact"
    notes: "On May 7, 2026, ShinyHunters replaced Canvas login portals at approximately 330 educational institutions with an extortion message for approximately 30 minutes before Instructure restored the pages."
  - techniqueId: "T1657"
    techniqueName: "Financial Theft"
    tactic: "Impact"
    notes: "ShinyHunters issued a ransom demand on May 3, 2026, threatening to publish the claimed dataset unless Instructure or affected institutions paid a ransom by May 12, 2026."
---

## Summary

In late April and early May 2026, a threat actor publicly associated with ShinyHunters breached Instructure, the operator of Canvas LMS, and exfiltrated user data from the platform. Instructure detected unauthorized activity on April 29, 2026, revoked access, and publicly disclosed a cybersecurity incident on May 1. On May 7, ShinyHunters escalated by defacing the Canvas login portals of approximately 330 educational institutions with an extortion message, claiming to have stolen 275 million user records totaling 3.65 terabytes of data, and setting a ransom deadline of May 12, 2026.

Canvas is used by approximately 8,800 educational institutions globally, including universities, K–12 schools, and educational ministries. Instructure confirmed that the exposed information may include names, email addresses, student identification numbers, and messages between users, and stated it found no evidence that passwords, dates of birth, government identifiers, or financial information were compromised.

## Technical Analysis

Instructure disclosed on May 1, 2026 that it detected unauthorized activity in its systems on April 29, 2026. The company stated it revoked the intruder's access upon detection and engaged external forensic experts. In its initial disclosure, Instructure characterized the breach as involving a limited subset of user accounts.

ShinyHunters publicly disputed Instructure's characterization. On May 3, 2026, the group distributed a ransom letter claiming to have obtained 275 million records from approximately 9,000 educational institutions, including names, email addresses, student identification numbers, and private messages between users. The group set a ransom deadline of May 12, 2026.

On May 7, 2026, ShinyHunters executed defacements of Canvas login portals at approximately 330 educational institutions. The defacement pages were visible for approximately 30 minutes before Instructure restored them. The defacement message stated that Instructure had applied "security patches" without engaging the group, and directed affected institutions to contact ShinyHunters via the TOX platform to negotiate ransom terms. The defacement also appeared within the Canvas mobile application.

Instructure subsequently reported on its status page that access had been restored and identified no ongoing incidents. The company did not publicly address the discrepancy between its initial scope characterization and ShinyHunters' claimed data volume.

## Attack Chain

### Stage 1: Initial access and exfiltration

ShinyHunters obtained unauthorized access to Instructure's backend systems. The specific access vector has not been confirmed in public reporting. Instructure detected the intrusion on April 29, 2026. The company's disclosure stated that exposed data may include names, email addresses, student identification numbers, and messages between users, with no evidence of exposure of passwords, financial information, or government identifiers.

### Stage 2: Extortion initiation

On May 3, 2026, ShinyHunters distributed a ransom letter claiming possession of 275 million user records across approximately 9,000 institutions. The group set May 12, 2026 as the deadline for Instructure or affected institutions to initiate ransom negotiations, threatening public publication of the dataset if no contact was made.

### Stage 3: Login portal defacement

On May 7, 2026, after Instructure did not publicly engage with the group, ShinyHunters defaced Canvas login portals at approximately 330 institutions. The defacement served as a public proof-of-access demonstration and as a pressure mechanism directed at affected institutions. The defacement was removed within approximately 30 minutes.

## Impact Assessment

Canvas is used by approximately 41 percent of higher education institutions in the United States, as well as K–12 schools and institutions internationally. ShinyHunters' claim of 275 million affected individuals, if accurate, would represent a substantial breach by reported volume.

Instructure's confirmed scope covers names, email addresses, student identification numbers, and messages between users. Passwords, dates of birth, government identifiers, and financial information were not identified as compromised according to Instructure.

Multiple universities issued notices to their communities acknowledging the incident. The University of California system and Rutgers University both published community advisories confirming awareness of the Canvas security incident. The ransom deadline of May 12, 2026 had not passed as of May 8, 2026, and publication of the claimed dataset had not been confirmed by a reliable independent source.

## Attribution

This incident is attributed to ShinyHunters based on the group's public claim of responsibility, the defacement content consistent with prior ShinyHunters operations, and BleepingComputer reporting. Attribution is assessed at A4: the claim is public, credible given the group's prior activity, and corroborated by the defacement itself, but has not been confirmed by a government or law enforcement source as of May 8, 2026.

ShinyHunters has been associated with prior data theft and extortion operations. BleepingComputer reported that this breach represents a second Instructure intrusion by the group, with the defacement message referencing a prior compromise that the group characterized as having been addressed by Instructure with security patches rather than ransom payment. The relationship between ShinyHunters and other intrusion clusters such as UNC5537 has been reported by security researchers but is not formally confirmed.

## Timeline

### 2026-04-29 — Unauthorized Access Detected and Revoked

Instructure detects unauthorized activity in Canvas systems and revokes intruder access.

### 2026-05-01 — Public Disclosure

Instructure publicly discloses a cybersecurity incident; characterizes scope as limited.

### 2026-05-03 — Extortion Demand

ShinyHunters distributes a ransom letter claiming 275 million records from approximately 9,000 institutions and sets a May 12, 2026 deadline.

### 2026-05-04 — University Notifications

Multiple universities including Rutgers issue community notices about the Canvas security incident.

### 2026-05-07 — Login Portal Defacements

ShinyHunters defaces Canvas login portals at approximately 330 institutions; defacement removed in approximately 30 minutes.

### 2026-05-07 — Service Restoration

Instructure reports service restoration on its status page; does not address scope discrepancy.

### 2026-05-08 — Leak Site Update

AP News reports Canvas service restored and Instructure listing removed from ShinyHunters leak site.

## Remediation & Mitigation

Instructure has stated that passwords were not exposed in this incident. No immediate credential rotation is required based on the confirmed scope; however, affected users should monitor for phishing attempts using exposed email addresses, names, and student identification numbers, which are sufficient for targeted social engineering.

Institutions that communicate with students and staff through Canvas messaging should alert their communities to the risk of phishing messages referencing Canvas account information, course materials, or institutional identifiers that may have been obtained from the exposed dataset.

Higher education institutions that depend on third-party learning management system providers should review vendor agreements and incident notification requirements. The gap between Instructure's initial scope characterization and the threat actor's public data volume claim, and the delay between detection and public disclosure, illustrate the risk of relying on a single vendor's communications during an active incident.

## Sources & References

- [Instructure: Confirmed Security Incident](https://status.instructure.com/incidents/9wm4knj2r64z) — Instructure, 2026-05-01
- [BleepingComputer: Canvas Login Portals Hacked in Mass ShinyHunters Extortion Campaign](https://www.bleepingcomputer.com/news/security/canvas-login-portals-hacked-in-mass-shinyhunters-extortion-campaign/) — BleepingComputer, 2026-05-07
- [AP News: Canvas service restored after ShinyHunters hack](https://apnews.com/article/446c240d5aeb1b1a1e3795fb92237563) — AP News, 2026-05-08
- [TechCrunch: Hackers deface school login pages after claiming another Instructure hack](https://techcrunch.com/2026/05/07/hackers-deface-school-login-pages-after-claiming-another-instructure-hack/) — TechCrunch, 2026-05-07
- [Rutgers University Information Technology: Nationwide Security Breach Involving Canvas](https://it.rutgers.edu/alerts/2026/05/04/nationwide-security-breach-involving-canvas/) — Rutgers University Information Technology, 2026-05-04
