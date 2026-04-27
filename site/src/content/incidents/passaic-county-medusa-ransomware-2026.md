---
eventId: TP-2026-0033
title: Passaic County Ransomware Attack Claimed by Medusa
date: 2026-03-04
attackType: ransomware
severity: high
sector: Government
geography: United States
threatActor: Medusa
attributionConfidence: A4
reviewStatus: under_review
confidenceGrade: C
generatedBy: penfold-bot
generatedDate: 2026-04-20
cves: []
relatedSlugs:
  - "die-linke-qilin-ransomware-2026"
  - "ummc-medusa-ransomware-2026"
  - "winona-county-ransomware-2026"
tags:
  - "ransomware"
  - "medusa"
  - "government"
  - "new-jersey"
sources:
  - url: https://www.passaiccountynj.org/Home/Components/News/News/1275/
    publisher: Passaic County
    publisherType: government
    reliability: R1
    publicationDate: "2026-03-04"
  - url: https://www.comparitech.com/news/cybercriminals-say-they-hacked-passaic-county-nj-and-demand-ransom/
    publisher: Comparitech
    publisherType: vendor
    reliability: R2
    publicationDate: "2026-03-17"
  - url: https://therecord.media/medusa-ransomware-mississippi-cyber
    publisher: Recorded Future News
    publisherType: media
    reliability: R2
    publicationDate: "2026-03-17"
  - url: https://www.cisa.gov/news-events/cybersecurity-advisories/aa25-071a
    publisher: CISA
    publisherType: government
    reliability: R1
    publicationDate: "2025-03-12"
mitreMappings:
  - techniqueId: T1486
    techniqueName: "Data Encrypted for Impact"
    tactic: Impact
---

## Summary

Passaic County, New Jersey disclosed on March 4, 2026 that a malware attack was affecting county IT systems and phone lines. Later reporting from Comparitech and Recorded Future said the Medusa ransomware operation listed the county on its leak site, demanded $800,000, and posted sample documents to support the claim.

The county did not publicly confirm Medusa's attribution claim. Public reporting also did not establish the initial intrusion vector, the exact systems encrypted, or the confirmed scope of data theft. The incident is a county-disclosed malware event later claimed by Medusa.

## Technical Analysis

The county's public statement confirmed operational disruption to IT systems and phone lines but did not describe the technical entry point or the internal spread of the incident. Comparitech later reported that Medusa claimed responsibility on its leak site and published images it said were stolen county documents.

CISA's March 2025 advisory describes Medusa as a ransomware operation that commonly combines encryption with extortion pressure, but that advisory is background on the group rather than incident-specific evidence for Passaic County. For this incident, the public record supports only the county's malware disclosure, the reported leak-site claim, and the county's later statement that it was still determining the nature and scope of unauthorized data access.

## Attack Chain

### Stage 1: County Discloses Malware Attack

On March 4, 2026, Passaic County said it was aware of a malware attack affecting its IT systems and phone lines and that it was working with federal and state officials to investigate and contain the issue.

### Stage 2: Medusa Leak-Site Claim

On March 17, 2026, Comparitech and Recorded Future reported that the Medusa ransomware operation had listed Passaic County on its leak site, demanded $800,000, and published sample images it said were taken from county systems.

### Stage 3: Investigation and Partial Service Recovery

Comparitech reported a March 18 county statement saying the county had taken measures to address the security incident, restored most operations, and was still determining the nature and scope of unauthorized access to data.

## Impact Assessment

The confirmed operational impact was disruption to county IT systems and phone lines. Public reporting supports a prolonged service interruption, but it does not support precise claims about which resident-facing services were unavailable or whether specific categories of constituent data were exposed.

There is a credible risk of data exposure because the Medusa leak-site claim included sample documents and the county later said it was assessing unauthorized access to data. However, the public source set does not confirm the volume or sensitivity of any affected records.

## Attribution

The attribution to Medusa rests on the group's public leak-site claim and the publication of sample documents reported by Comparitech and Recorded Future. That is stronger than a rumor, but it is not the same as a county-confirmed attribution.

Because Passaic County did not publicly validate the actor identity, Medusa is identified here as a claimed perpetrator rather than an officially confirmed one.

## Timeline

### 2026-03-04 - Event

Passaic County publicly disclosed a malware attack affecting county IT systems and phone lines.

### 2026-03-17 - Event

Comparitech and Recorded Future reported that Medusa had listed the county on its leak site and demanded $800,000.

### 2026-03-18 - Event

Comparitech reported a county statement saying most operations had been restored while the investigation into unauthorized data access remained ongoing.

## Remediation & Mitigation

Passaic County said it was working with federal and state officials to investigate and contain the incident, and later said it had taken measures to address the security event while restoring most operations.

For organizations defending against Medusa-style ransomware activity more generally, CISA recommends hardening remote access, enforcing MFA, segmenting networks, and maintaining tested offline backups.

## Sources & References

- [Passaic County: Statement from Passaic County](https://www.passaiccountynj.org/Home/Components/News/News/1275/) — Passaic County, 2026-03-04
- [Comparitech: Cybercriminals say they hacked Passaic County, NJ and demand ransom](https://www.comparitech.com/news/cybercriminals-say-they-hacked-passaic-county-nj-and-demand-ransom/) — Comparitech, 2026-03-17
- [Recorded Future News: Medusa ransomware gang claims attacks on prominent Mississippi hospital, New Jersey county](https://therecord.media/medusa-ransomware-mississippi-cyber) — Recorded Future News, 2026-03-17
- [CISA: #StopRansomware: Medusa Ransomware](https://www.cisa.gov/news-events/cybersecurity-advisories/aa25-071a) — CISA, 2025-03-12
