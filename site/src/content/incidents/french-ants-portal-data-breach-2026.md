---
eventId: TP-2026-0058
title: "French ANTS Portal Data Breach, April 2026"
date: 2026-04-15
attackType: Data breach
severity: high
sector: Government / identity services
geography: France
threatActor: Unknown
attributionConfidence: A4
reviewStatus: draft_ai
confidenceGrade: C
generatedBy: dangermouse-bot
generatedDate: 2026-05-13
cves: []
relatedSlugs: []
tags:
  - ants
  - france
  - government
  - identity-services
  - data-breach
  - personal-data
sources:
  - url: "https://www.interieur.gouv.fr/actualites/communiques-de-presse/incident-de-securite-relatif-au-portail-antsgouvfr"
    publisher: "Ministère de l'Intérieur"
    publisherType: government
    reliability: R1
    publicationDate: "2026-04-20"
  - url: "https://today.rtl.lu/news/world/data-breach-at-french-ants-portal-exposes-personal-user-information-1266300012"
    publisher: "RTL Today"
    publisherType: media
    reliability: R2
    publicationDate: "2026-04-20"
  - url: "https://news.risky.biz/risky-bulletin-former-fbi-official-calls-for-terrorism-designations-for-ransomware-groups-that-target-hospitals-and-critical-infrastructure"
    publisher: "Risky Business Media"
    publisherType: media
    reliability: R2
    publicationDate: "2026-04-22"
  - url: "https://www.clubic.com/actualite-580066-le-hacker-qui-dit-vendre-des-bases-de-donnees-geantes-de-l-ants-et-de-france-travail-est-le-roi-du-pipeau.html"
    publisher: "Clubic"
    publisherType: media
    reliability: R3
    publicationDate: "2025-09-22"
mitreMappings:
  - techniqueId: T1213
    techniqueName: Data from Information Repositories
    tactic: Collection
    attack-version: v19
    confidence: confirmed
    evidence: "The French Ministry of the Interior confirmed a possible disclosure of account data from the ants.gouv.fr portal, including login identifiers, names, email addresses, and dates of birth; the access path and system component were not publicly identified."
---

## Summary

On 15 April 2026, the Agence Nationale des Titres Sécurisés (ANTS) detected a security incident that may have resulted in the disclosure of data from personal and professional accounts on the ants.gouv.fr portal. ANTS administers the portal used by French residents for official identity-document applications including passports and driving licences.

The French Ministry of the Interior confirmed the incident and identified the following data categories as potentially affected for personal accounts: login identifier, title/civility, surname, given names, email address, date of birth, unique account identifier, and — where provided — postal address, place of birth, and phone number. The ministry confirmed that supporting documents and attachments submitted during identity-document procedures were not involved, and that the exposed data do not permit illegitimate access to portal accounts.

ANTS notified the CNIL under GDPR Article 33, informed the Paris public prosecutor under criminal procedure Article 40, and alerted ANSSI. Security hardening measures were implemented and affected users were being notified directly at the time of the ministry's public disclosure.

## Technical Analysis

Public technical information is limited to the ministry's communiqué. ANTS detected a security incident that may have involved disclosure of account-level data from the ants.gouv.fr portal; the method, responsible party, and affected system component were not publicly identified. The specific attack vector has not been publicly disclosed; the investigation was ongoing at the time of disclosure.

The data categories reported — account metadata fields rather than submitted identity documents — indicate the possible disclosure was limited to account-level data. The ministry's explicit statement that supporting documents were not affected is consistent with this scope, though no access path or specific component was publicly identified.

No vulnerability identifier, malware family, or attributed infrastructure component has been publicly linked to this incident.

## Attack Chain

### Stage 1: Possible Disclosure of Account Data

ANTS detected a security incident that may have involved disclosure of data from personal and professional user accounts on the ants.gouv.fr portal. The method and responsible party have not been publicly identified.

### Stage 2: Potential Account-Data Disclosure

Potentially affected account-level fields included login identifiers, name and title fields, email addresses, dates of birth, unique account identifiers, and — where present — postal addresses, places of birth, and phone numbers.

### Stage 3: Detection and Response

ANTS detected the incident on 15 April 2026. The ministry implemented security hardening, notified CNIL, the Paris public prosecutor, and ANSSI, and began directly informing affected users.

## Timeline

### 2026-04-15 — Incident Detected

ANTS detects a security incident potentially involving the disclosure of data from personal and professional accounts on the ants.gouv.fr portal.

### 2026-04-15 — Response Initiated

Security hardening measures are implemented. CNIL is notified under GDPR Article 33, the Paris public prosecutor is notified under criminal procedure Article 40, and ANSSI is alerted. Direct notification of affected users begins.

### 2026-04-20 — Public Disclosure

The French Ministry of the Interior publishes its communiqué confirming the incident, the data categories potentially affected, and the response actions taken. RTL Today reports the same ministry-confirmed information.

### 2026-04-22 — Security Media Coverage

Risky Business Media includes the ANTS breach in its news bulletin.

## Impact Assessment

The incident potentially exposed personal account data for an unspecified number of ants.gouv.fr users. Potentially affected data categories include: login identifier, title/civility, surname, given names, email address, date of birth, and unique account identifier. Postal address, place of birth, and phone number may also be affected where users had provided those fields.

The ministry confirmed two limiting factors: supporting documents and attachments submitted during identity-document procedures were not involved, and the exposed data do not permit illegitimate access to portal accounts.

The combination of name, date of birth, email address, and — where present — postal address creates meaningful risk of phishing, smishing, and social-engineering attempts. The ministry advised affected users to remain vigilant for suspicious messages purporting to come from ANTS. The total number of affected accounts was not disclosed.

## Attribution

No threat actor has been publicly identified or claimed responsibility for this incident. The ministry's communications make no characterisation of a responsible party.

A separate underground-sale claim surfaced in approximately September 2025 asserting large databases purportedly from ANTS and France Travail were available; French technology reporting assessed that claim as unverified and likely fabricated, and France Titres denied an intrusion at the time. No confirmed connection between that prior claim and the April 2026 incident has been established.

## Remediation & Mitigation

The ministry confirmed that security hardening was implemented following detection of the incident. Affected users were notified directly and advised to treat unsolicited contact referencing their personal details with caution — particularly messages requesting credentials, payments, or urgent action related to identity-document procedures.

Operators of government identity portals should apply strict data minimisation to stored account fields, enforce strong authentication, implement anomaly detection for unusual access patterns against account-data services, and maintain logical separation between account-metadata systems and document-storage systems.

## Sources & References

- [Ministère de l'Intérieur: Incident de sécurité relatif au portail ants.gouv.fr](https://www.interieur.gouv.fr/actualites/communiques-de-presse/incident-de-securite-relatif-au-portail-antsgouvfr) — Ministère de l'Intérieur, 2026-04-20
- [RTL Today: Data breach at French ANTS portal exposes personal user information](https://today.rtl.lu/news/world/data-breach-at-french-ants-portal-exposes-personal-user-information-1266300012) — RTL Today, 2026-04-20
- [Risky Business Media: Risky Bulletin](https://news.risky.biz/risky-bulletin-former-fbi-official-calls-for-terrorism-designations-for-ransomware-groups-that-target-hospitals-and-critical-infrastructure) — Risky Business Media, 2026-04-22
- [Clubic: Le hacker qui dit vendre des bases de données géantes de l'ANTS et de France Travail est le roi du pipeau](https://www.clubic.com/actualite-580066-le-hacker-qui-dit-vendre-des-bases-de-donnees-geantes-de-l-ants-et-de-france-travail-est-le-roi-du-pipeau.html) — Clubic, 2025-09-22
