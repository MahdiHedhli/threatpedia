---
eventId: TP-2015-0003
title: U.S. Office of Personnel Management Breach
date: 2015-06-01
attackType: Data Breach
severity: critical
sector: Government
geography: United States
threatActor: Unknown
attributionConfidence: A6
reviewStatus: draft_ai
confidenceGrade: A
generatedBy: kernel-k
generatedDate: 2026-04-30
cves: []
relatedSlugs: []
tags:
  - opm
  - data-breach
  - background-investigations
  - personnel-records
  - federal-government
  - social-security-numbers
  - fingerprints
  - identity-protection
  - us-cert
sources:
  - url: https://www.opm.gov/cybersecurity-resource-center
    publisher: U.S. Office of Personnel Management
    publisherType: government
    reliability: R1
    publicationDate: "2026-04-30"
    accessDate: "2026-04-30"
    archived: false
  - url: https://www.gao.gov/products/gao-17-614
    publisher: U.S. Government Accountability Office
    publisherType: government
    reliability: R1
    publicationDate: "2017-08-03"
    accessDate: "2026-04-30"
    archived: false
  - url: https://www.opm.gov/news/testimony/114th-congress/under-attack-federal-cybersecurity-and-the-opm-data-breach.pdf
    publisher: U.S. Office of Personnel Management
    publisherType: government
    reliability: R1
    publicationDate: "2015-06-25"
    accessDate: "2026-04-30"
    archived: false
mitreMappings:
  - techniqueId: T1213
    techniqueName: Data from Information Repositories
    tactic: Collection
    notes: OPM reported that background-investigation databases and personnel records were stolen; public sources do not establish a more specific initial-access technique.
---

## Summary

The U.S. Office of Personnel Management breach was a 2015 federal data breach involving two separate but related cybersecurity incidents. OPM said the incidents affected Federal Government employees, contractors, and others through the theft of personnel records and background investigation records.

OPM reported that approximately 21.5 million individuals were impacted by the background-investigation-records incident and approximately 4.2 million individuals were impacted by the personnel-records incident. Most people in the personnel-records incident were also affected by the background-investigation incident, while approximately 600,000 people were impacted only by the personnel-records incident.

The exposed data included Social Security numbers and other sensitive information. OPM said some background-investigation records included interview findings, approximately 5.6 million fingerprints, and usernames and passwords used by applicants to complete background-investigation forms.

## Technical Analysis

The public OPM record describes the breach as malicious cyber activity that resulted in the exposure of background-investigation and personnel data. OPM said the background-investigation incident involved records for current, former, and prospective Federal employees and contractors, including people who applied for background investigations and non-applicants such as spouses or cohabitants.

The selected public sources do not identify a specific initial-access method, malware family, command-and-control path, or confirmed intrusion timeline. They support a high-confidence finding that sensitive records were stolen from OPM-managed systems, but they do not support assigning the intrusion to a named actor.

GAO reviewed OPM's post-breach security work and found that OPM had implemented or made progress toward implementing 19 US-CERT recommendations. GAO also found that some actions were incomplete or needed further improvement, including completion-date tracking, corrective-action validation, selected encryption requirements, and oversight of contractor-operated systems.

## Attack Chain

### Stage 1: Unauthorized Access to OPM Data Environments

OPM's public resource center states that malicious cyber activity affected OPM systems and resulted in the theft of personnel records and background-investigation records. The selected public sources do not establish how access was first obtained.

### Stage 2: Collection of Personnel and Background-Investigation Records

The stolen background-investigation data included information from SF-86, SF-85, and SF-85P-style investigation processes. OPM described the affected data as including Social Security numbers, residency and education history, employment history, immediate family and acquaintance information, and health, criminal, or financial history provided during background investigations.

### Stage 3: Exposure of High-Sensitivity Identity Data

OPM reported that the personnel-records incident affected information such as full name, birth date, home address, and Social Security number. For the background-investigation incident, OPM reported that approximately 5.6 million affected records included fingerprints.

### Stage 4: Federal Response and Victim Support

OPM said it partnered with US-CERT and the FBI to investigate and determine the potential impact. OPM also provided identity monitoring, credit monitoring, identity restoration, and identity-theft insurance services for impacted individuals and eligible dependent minor children.

## Impact Assessment

The impact was concentrated in federal personnel and background-investigation data. OPM reported approximately 21.5 million individuals affected by the background-investigation-records incident, including 19.7 million applicants and 1.8 million non-applicants. OPM separately reported approximately 4.2 million individuals affected by the personnel-records incident.

The sensitivity of the data created long-term identity and counterintelligence risk. The background-investigation data could include Social Security numbers, residency and education history, employment history, information about family members and contacts, health history, criminal history, financial history, interview findings, fingerprints, and account credentials used for background-investigation forms.

The public record also shows sustained remediation obligations. GAO found that OPM had taken post-breach actions but had not completed all work needed to prevent, mitigate, and respond to breaches involving sensitive personal and background-investigation information.

## Attribution

The selected official sources do not name a confirmed threat actor responsible for the OPM breach. OPM's public resource center discusses malicious cyber activity and its impact, while GAO focuses on OPM's controls and post-breach remediation status.

Because the public sources used here do not establish a named actor, the attribution remains Unknown. This avoids converting external reporting or political characterization into a corpus-level actor assignment.

## Timeline

### 2015-06-01 — OPM Identifies Related Personnel and Background-Investigation Incidents

OPM said it announced two separate but related cybersecurity incidents in 2015 involving personnel records and background-investigation records. The public resource center describes the background-investigation discovery as occurring in June 2015.

### 2015-06-25 — OPM Testifies Before Senate HSGAC

OPM Director Katherine Archuleta testified before the Senate Committee on Homeland Security and Governmental Affairs in a hearing titled "Under Attack: Federal Cybersecurity and the OPM Data Breach."

### 2015-07-01 — Impacted Population and Data Categories Clarified

OPM's public resource center later recorded the impact as approximately 21.5 million individuals in the background-investigation-records incident and approximately 4.2 million individuals in the personnel-records incident.

### 2017-08-03 — GAO Publishes Post-Breach Security Review

GAO published GAO-17-614, finding that OPM had improved controls after the breaches but still needed further efforts.

### 2022-07-06 — Settlement Notice Process Ordered

OPM's resource center states that, in related multidistrict litigation, the court ordered the claims administrator to issue notice of settlement by July 6, 2022.

## Remediation & Mitigation

OPM's immediate public response included coordination with US-CERT and the FBI, notification support, a verification center, and identity-protection services. OPM described identity monitoring, credit monitoring, identity restoration, and identity-theft insurance for impacted individuals.

GAO's post-breach review identified specific control areas that remained important after the incident. Those areas included implementation of US-CERT recommendations, validation of corrective actions, encryption of stored and transmitted data on selected systems, and oversight of contractor-operated systems.

For organizations that manage high-sensitivity identity data, the incident supports controls around inventorying high-value assets, encrypting sensitive data, monitoring privileged access to information repositories, validating remediation work, and testing contractor-operated system controls.

## Sources & References

- [U.S. Office of Personnel Management: Cybersecurity Resource Center](https://www.opm.gov/cybersecurity-resource-center) — U.S. Office of Personnel Management, 2026-04-30
- [U.S. Government Accountability Office: Information Security: OPM Has Improved Controls, but Further Efforts Are Needed](https://www.gao.gov/products/gao-17-614) — U.S. Government Accountability Office, 2017-08-03
- [U.S. Office of Personnel Management: Under Attack: Federal Cybersecurity and the OPM Data Breach](https://www.opm.gov/news/testimony/114th-congress/under-attack-federal-cybersecurity-and-the-opm-data-breach.pdf) — U.S. Office of Personnel Management, 2015-06-25
