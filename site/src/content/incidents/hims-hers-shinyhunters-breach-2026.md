---
eventId: TP-2026-0029
title: "Hims & Hers Health Zendesk Breach Linked to ShinyHunters"
date: 2026-02-05
attackType: data-breach
severity: high
sector: Healthcare
geography: United States
threatActor: ShinyHunters
attributionConfidence: A4
reviewStatus: draft_ai
confidenceGrade: C
generatedBy: penfold-bot
generatedDate: 2026-04-20
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
sources:
  - url: https://www.bleepingcomputer.com/news/security/hims-and-hers-warns-of-data-breach-after-zendesk-support-ticket-breach/
    publisher: Bleeping Computer
    publisherType: media
    reliability: R2
    publicationDate: "2026-04-03"
  - url: https://techcrunch.com/2026/04/02/telehealth-giant-hims-hers-says-its-customer-support-system-was-hacked/
    publisher: TechCrunch
    publisherType: media
    reliability: R2
    publicationDate: "2026-04-02"
  - url: https://oag.ca.gov/ecrime/databreach/reports/sb24-621205
    publisher: California Attorney General
    publisherType: government
    reliability: R1
    publicationDate: "2026-04-02"
mitreMappings:
  - techniqueId: T1078
    techniqueName: "Valid Accounts"
    tactic: Initial Access
---

## Summary

Hims & Hers disclosed that an unauthorized party accessed certain customer-support tickets in its third-party customer service platform between February 4 and February 7, 2026. The company said the exposed information included customer names, contact details, and other data contained in support interactions, while medical records and communications with healthcare providers were not affected.

TechCrunch reported that Hims & Hers described the incident as a social engineering attack. BleepingComputer later linked the breach to ShinyHunters reporting and said it was told a compromised Okta single sign-on account was used to reach the company's Zendesk environment, but Hims & Hers did not publicly name the actor in its own notice.

## Technical Analysis

The company's public notice and TechCrunch's reporting establish that the incident affected a third-party support platform and involved unauthorized access to customer-support tickets during a four-day window in early February. The public record does not establish the full intrusion path beyond that access.

BleepingComputer reported that the attackers used a compromised Okta SSO account to access the Hims & Hers Zendesk instance as part of a broader support-platform intrusion cluster associated with ShinyHunters. Because that attribution detail comes from external reporting rather than from Hims & Hers directly, the technical description for this incident should remain limited to reported account compromise, access to support tickets, and theft of ticket data.

## Attack Chain

### Stage 1: Unauthorized Access to Support Platform

An unauthorized actor gained access to the third-party customer service environment used by Hims & Hers between February 4 and February 7, 2026.

### Stage 2: Access to Customer-Support Tickets

The attacker accessed support tickets submitted to the company's customer service team, exposing information contained in those records.

### Stage 3: Company Response and Notification

Hims & Hers said it identified suspicious activity on February 5, secured the affected environment, investigated the scope of access, and later filed a public breach notice and customer notifications.

## Impact Assessment

According to the California breach notice and TechCrunch's reporting, the exposed information included customer names and contact information along with other data contained in support tickets. Hims & Hers said customer medical records and communications with healthcare providers on the platform were not impacted.

The public source set does not confirm the total number of affected people or the full range of ticket contents, so the impact should be described as exposure of customer-support data rather than a quantified medical-record breach.

## Attribution

BleepingComputer linked the incident to ShinyHunters and reported that the attackers used a compromised Okta SSO account to access Zendesk. That reporting places the incident within the same broader support-platform intrusion activity that has been associated with ShinyHunters.

Hims & Hers itself publicly described the breach as a social engineering attack and did not publicly confirm a named threat actor. The attribution in this article should therefore remain framed as reported linkage rather than company-confirmed responsibility.

## Timeline

### 2026-02-04 - Event

The unauthorized access window to the third-party support platform began.

### 2026-02-05 - Event

Hims & Hers said it identified suspicious activity and took steps to secure the affected environment.

### 2026-02-07 - Event

The access window described in the public breach notice ended.

### 2026-04-02 - Event

Hims & Hers filed its California breach notice and began notifying affected individuals.

### 2026-04-03 - Event

BleepingComputer published reporting linking the incident to ShinyHunters and a compromised Okta SSO account.

## Remediation & Mitigation

Hims & Hers said it secured the affected customer service platform, investigated the incident, notified federal law enforcement, and offered 12 months of credit monitoring and identity restoration services to affected individuals. The company also said it was reviewing its policies and procedures following the attack.

For organizations with similar support-platform exposure, the public reporting highlights the need to secure identity-provider access to third-party SaaS tools and to treat support-ticket data as sensitive customer information.

## Sources & References

- [Bleeping Computer: Hims & Hers warns of data breach after Zendesk support ticket breach](https://www.bleepingcomputer.com/news/security/hims-and-hers-warns-of-data-breach-after-zendesk-support-ticket-breach/) — Bleeping Computer, 2026-04-03
- [TechCrunch: Telehealth giant Hims & Hers says its customer support system was hacked](https://techcrunch.com/2026/04/02/telehealth-giant-hims-hers-says-its-customer-support-system-was-hacked/) — TechCrunch, 2026-04-02
- [California Attorney General: Hims & Hers Notice of Data Event](https://oag.ca.gov/ecrime/databreach/reports/sb24-621205) — California Attorney General, 2026-04-02
