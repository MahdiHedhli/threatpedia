---
eventId: TP-2026-0236
title: "Instructure Canvas Free-For-Teacher Account Compromise and Extortion Activity"
date: 2026-05-07
attackType: data-breach
severity: high
sector: Education & Research
geography: Global
threatActor: Unknown
attributionConfidence: A4
reviewStatus: draft_ai
confidenceGrade: B
generatedBy: dangermouse-bot
generatedDate: 2026-05-29
cves: []
relatedSlugs: []
tags:
  - instructure
  - canvas
  - free-for-teacher
  - education
  - extortion
  - account-compromise
  - shinyhunters
mitreMappings:
  - techniqueId: T1078
    techniqueName: Valid Accounts
    tactic: Initial Access
    notes: Public sources describe unauthorized account access against Canvas Free-For-Teacher users.
  - techniqueId: T1566
    techniqueName: Phishing
    tactic: Initial Access
    notes: FBI IC3 PSA I-051526-PSA describes broad LMS-targeting activity involving phishing and social engineering themes.
  - techniqueId: T1657
    techniqueName: Financial Theft
    tactic: Impact
    notes: Multiple sources describe extortion demands tied to stolen-access claims and institutional pressure tactics.
sources:
  - url: https://status.instructure.com/incidents/9wm4knj2r64z
    publisher: Instructure Status
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-05-07"
    accessDate: "2026-05-29"
    archived: false
  - url: https://fsapartners.ed.gov/knowledge-center/library/electronic-announcements/2026-05-12/technology-security-alert-ongoing-cybersecurity-incident-involving-canvas-learning-management-system
    publisher: Federal Student Aid
    publisherType: government
    reliability: R1
    publicationDate: "2026-05-12"
    accessDate: "2026-05-29"
    archived: false
  - url: https://www.ic3.gov/PSA/2026/PSA260515
    publisher: FBI Internet Crime Complaint Center
    publisherType: government
    reliability: R1
    publicationDate: "2026-05-15"
    accessDate: "2026-05-29"
    archived: false
  - url: https://apnews.com/article/446c240d5aeb1b1a1e3795fb92237563
    publisher: AP News
    publisherType: media
    reliability: R2
    publicationDate: "2026-05-08"
    accessDate: "2026-05-29"
    archived: false
  - url: https://www.bleepingcomputer.com/news/security/canvas-login-portals-hacked-in-mass-shinyhunters-extortion-campaign/
    publisher: BleepingComputer
    publisherType: media
    reliability: R2
    publicationDate: "2026-05-07"
    accessDate: "2026-05-29"
    archived: false
  - url: https://www.theverge.com/tech/926458/canvas-shinyhunters-breach
    publisher: The Verge
    publisherType: media
    reliability: R2
    publicationDate: "2026-05-07"
    accessDate: "2026-05-29"
    archived: false
  - url: https://techcrunch.com/2026/05/07/hackers-deface-school-login-pages-after-claiming-another-instructure-hack/
    publisher: TechCrunch
    publisherType: media
    reliability: R2
    publicationDate: "2026-05-07"
    accessDate: "2026-05-29"
    archived: false
---

## Summary

In early May 2026, Instructure reported unauthorized access affecting a subset of Canvas Free-For-Teacher accounts. Public statements from Instructure and Federal Student Aid indicate exposed data may include profile and account-linked metadata (such as names, email addresses, roles, institution names, and Canvas IDs), while available reporting states that passwords, grades, assignments, course content, and payment data were not identified as exposed in the confirmed incident scope.

Federal Student Aid and FBI IC3 both issued public alerts tied to ongoing education-sector cyber activity involving Canvas-related disruption and extortion messaging. Several media reports attributed defacement and extortion claims to ShinyHunters; however, official sources in this record primarily confirm the incident and extortion context rather than a definitive law-enforcement attribution for all campaign elements.

## Technical Analysis

Instructure status communications and follow-on federal guidance describe unauthorized account access against Free-For-Teacher tenants and downstream institutional disruption through login-page tampering and extortion pressure.

The available source set supports three key technical points:

1. Account compromise was real and materially disruptive for some educational users.
2. Data exposure scope was bounded to account/profile metadata per vendor and federal statements.
3. Public extortion claims and portal defacement activity were contemporaneous with the incident window.

The sources do not provide confirmed evidence that all claimed stolen datasets were publicly released during this event window.

## Attack Chain

### Stage 1: Account Access

Attackers obtained unauthorized access to a subset of Canvas Free-For-Teacher accounts.

### Stage 2: Service and Portal Disruption

Affected institutions reported login and portal disruption consistent with tampering and extortion signaling.

### Stage 3: Extortion Pressure

Threat-actor messaging and media-reported claims were used to pressure institutions and raise incident visibility.

## Impact Assessment

The incident impacted the education sector with account-level exposure, authentication disruption, and operational pressure during active academic workflows. Even with bounded data-exposure findings in official statements, the event introduced significant trust and continuity risk for institutions relying on centralized LMS identity and access paths.

## Attribution

**Threat actor: Unknown (public claims reference ShinyHunters).** Public reporting links extortion and defacement claims to ShinyHunters, while government and vendor sources in this corpus focus on incident confirmation, impact scope, and defensive guidance. Additional primary-source confirmation is still needed for higher-confidence actor attribution.

## Timeline

### 2026-05-07 - Instructure incident disclosure

Instructure posts incident updates for unauthorized access affecting Free-For-Teacher accounts.

### 2026-05-08 - Service restoration reporting

AP reports restoration progress and changes in extortion-site listing status related to the incident.

### 2026-05-12 - Federal Student Aid alert

Federal Student Aid publishes a technology security alert for educational partners regarding the ongoing Canvas cybersecurity incident.

### 2026-05-15 - FBI IC3 PSA

FBI IC3 issues a public service announcement addressing broader LMS-targeting activity and associated extortion risk.

## Remediation & Mitigation

- Enforce MFA and strong identity controls across LMS administrative and support paths.
- Rotate potentially exposed credentials and session artifacts for impacted users and administrators.
- Audit SSO and portal configuration changes during the incident window for unauthorized modifications.
- Notify affected users with clear scope statements and account-hardening guidance.
- Correlate LMS access anomalies with extortion communications and phishing activity for rapid containment.

## Sources & References

- [Instructure Status: Incident 9wm4knj2r64z](https://status.instructure.com/incidents/9wm4knj2r64z) — Instructure Status, 2026-05-07
- [Federal Student Aid: Technology Security Alert on Canvas Cybersecurity Incident](https://fsapartners.ed.gov/knowledge-center/library/electronic-announcements/2026-05-12/technology-security-alert-ongoing-cybersecurity-incident-involving-canvas-learning-management-system) — Federal Student Aid, 2026-05-12
- [FBI Internet Crime Complaint Center: PSA I-051526-PSA](https://www.ic3.gov/PSA/2026/PSA260515) — FBI Internet Crime Complaint Center, 2026-05-15
- [AP News: Canvas cyber incident coverage](https://apnews.com/article/446c240d5aeb1b1a1e3795fb92237563) — AP News, 2026-05-08
- [BleepingComputer: Canvas login portals hacked in extortion campaign](https://www.bleepingcomputer.com/news/security/canvas-login-portals-hacked-in-mass-shinyhunters-extortion-campaign/) — BleepingComputer, 2026-05-07
- [The Verge: Canvas and ShinyHunters breach reporting](https://www.theverge.com/tech/926458/canvas-shinyhunters-breach) — The Verge, 2026-05-07
- [TechCrunch: School login page defacement and Instructure claim reporting](https://techcrunch.com/2026/05/07/hackers-deface-school-login-pages-after-claiming-another-instructure-hack/) — TechCrunch, 2026-05-07
