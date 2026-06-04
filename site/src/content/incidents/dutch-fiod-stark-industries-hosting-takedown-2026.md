---
eventId: TP-2026-0062
title: Dutch FIOD Disrupts Sanctions-Evasion Hosting Infrastructure
date: 2026-05-22
attackType: Law Enforcement Disruption
severity: high
sector: Cybercrime Infrastructure / Internet Infrastructure
geography: Netherlands / European Union
threatActor: Unknown
attributionConfidence: A4
reviewStatus: draft_ai
confidenceGrade: B
generatedBy: dangermouse-bot
generatedDate: 2026-06-04
generation:
  provider: OpenAI
  model: Codex GPT-5.3 Spark
  tool: scripts/pipeline-run-task
  agent: dangermouse-bot
cves: []
relatedSlugs: []
tags:
  - law-enforcement
  - sanctions
  - bulletproof-hosting
  - infrastructure-seizure
  - fiod
  - stark-industries
  - worktitans
  - mirhosting
  - russia-linked
sources:
  - url: https://www.fiod.nl/fiod-houdt-twee-verdachten-aan-wegens-overtreding-sanctiewetgeving/
    publisher: Fiscal Information and Investigation Service
    publisherType: government
    reliability: R1
    publicationDate: "2026-05-22"
    accessDate: "2026-06-04"
    archived: false
  - url: https://www.securityweek.com/admins-of-bulletproof-hosting-service-used-by-russian-hackers-arrested-in-netherlands/
    publisher: SecurityWeek
    publisherType: media
    reliability: R2
    publicationDate: "2026-05-26"
    accessDate: "2026-06-04"
    archived: false
  - url: https://webhosting.today/2026/05/25/dutch-authorities-dismantle-stark-industries-the-rebrand-didnt-save-it/
    publisher: WebHosting.today
    publisherType: media
    reliability: R2
    publicationDate: "2026-05-25"
    accessDate: "2026-06-04"
    archived: false
mitreMappings:
  - techniqueId: T1583.004
    techniqueName: "Server"
    tactic: Resource Development
    attack-version: v19.0
    confidence: probable
    evidence: FIOD reported seizure of more than 800 servers tied to a web-hosting company alleged to support sanctioned entities.
  - techniqueId: T1090
    techniqueName: "Proxy"
    tactic: Command and Control
    attack-version: v19.0
    confidence: possible
    evidence: Public reporting described the infrastructure as bulletproof hosting used to keep customer servers online and obscure abuse detection.
---

## Summary

On May 22, 2026, the Dutch Fiscal Information and Investigation Service, FIOD, announced the arrest of two suspects in an investigation into alleged violations of Dutch sanctions law. FIOD said the arrests occurred on May 18 and involved searches at business premises in Enschede and Almere, plus two data centers in Dronten and Schiphol-Rijk.

The operation seized administrative records, laptops, phones, and more than 800 servers. FIOD described the investigation as focused on a web-hosting company that allegedly made economic resources available, directly or indirectly, to entities sanctioned by the European Union.

Public reporting connected the case to infrastructure associated with Stark Industries, WorkTitans, THE.Hosting, and Mirhosting. Those links are treated here as secondary-source context because FIOD did not name the companies or suspects in its public statement.

## Technical Analysis

FIOD stated that the investigated hosting company was founded on February 10, 2022, two weeks before Russia's invasion of Ukraine. According to FIOD, the company was later used to facilitate destabilizing activity directed at the European Union, including interference, cyberattacks, and disinformation.

FIOD said the hosting company was added to the European Union sanctions list on May 20, 2025. Around the same period, a substantial part of the sanctioned company's technical infrastructure was allegedly moved to a newly established Dutch company.

The investigation further alleged that the new Dutch company functioned as a front for the sanctioned entities. FIOD also described a second Dutch company as having a facilitating role by keeping the first company's servers connected to the internet.

SecurityWeek, citing FIOD and reporting by de Volkskrant, identified the broader infrastructure as tied to Stark Industries and associated hosting entities. SecurityWeek reported that the services were used by Russia-aligned threat actors, while WebHosting.today framed the case as an attempted rebrand and infrastructure migration after sanctions pressure.

## Attack Chain

### Stage 1: Sanctioned Hosting Provider Supports Destabilizing Activity

FIOD reported that the investigated hosting provider supported activity directed against the European Union, including cyberattacks and disinformation. The public record does not provide a complete list of campaigns, victims, or customers.

### Stage 2: EU Sanctions Create Operational Pressure

The European Union sanctioned the hosting company on May 20, 2025. FIOD stated that technical infrastructure was then moved to a new Dutch company around the same period.

### Stage 3: Front Company and Connectivity Provider Allegedly Preserve Operations

FIOD alleged that the new Dutch company acted as a cover for sanctioned entities. It also alleged that another Dutch company helped keep the servers connected to the internet.

### Stage 4: Dutch Searches and Server Seizure

On May 18, 2026, authorities arrested two suspects and searched locations in Enschede, Almere, Dronten, and Schiphol-Rijk. The operation seized more than 800 servers and supporting material.

## Impact Assessment

The immediate operational impact was disruption of a large hosting footprint allegedly connected to sanctions evasion and destabilizing activity against the European Union. Seizing more than 800 servers may have removed or exposed infrastructure used by multiple customers or downstream operators.

For defenders, the case highlights the infrastructure layer behind cyberattacks and influence operations. Bulletproof hosting, reseller structures, and front-company arrangements can make abuse reporting and takedown coordination more difficult, even when the downstream activity appears in separate campaigns.

The public sources do not provide a verified victim count or a complete technical inventory of seized systems. This record therefore treats the seizure as an infrastructure disruption rather than attributing specific intrusions to the arrested suspects.

## Attribution

The threat actor is listed as `Unknown` because FIOD did not publicly name a single threat actor or operator group responsible for the broader activity. FIOD described suspected sanctions evasion and alleged support for sanctioned entities.

Secondary reporting connected the case to Stark Industries, WorkTitans, THE.Hosting, and Mirhosting. SecurityWeek also reported links to Russia-aligned activity and cited prior reporting that Stark Industries infrastructure was used by groups including NoName057(16). Those links remain contextual and are not expanded into direct campaign attribution here.

## Timeline

### 2022-02-10

FIOD reported that the investigated hosting company was established on February 10, 2022.

### 2025-05-20

The European Union added the relevant web-hosting company to its sanctions list, according to FIOD.

### Around May 2025

FIOD stated that a substantial part of the sanctioned company's technical infrastructure was transferred to a newly established Dutch company around the same period.

### 2026-05-18

FIOD arrested two suspects and searched premises and data centers in the Netherlands.

### 2026-05-22

FIOD publicly announced the arrests, searches, and seizure of more than 800 servers.

### 2026-05-25 to 2026-05-26

WebHosting.today and SecurityWeek published follow-on reporting connecting the case to Stark Industries and related hosting entities.

## Remediation & Mitigation

Infrastructure and abuse teams should review historical relationships with sanctioned hosting providers, reseller networks, and customers that move between newly formed companies after sanctions or enforcement actions.

Network defenders should treat abrupt hosting migration, repeated ASN or provider changes, and continued service availability after sanctions as potential risk signals for bulletproof-hosting behavior.

Organizations that observed traffic to infrastructure associated with Stark Industries, WorkTitans, THE.Hosting, or Mirhosting should preserve logs, compare activity against known intrusion timelines, and monitor for successor hosting arrangements.

## Sources & References

- [Fiscal Information and Investigation Service: FIOD houdt twee verdachten aan wegens overtreding sanctiewetgeving](https://www.fiod.nl/fiod-houdt-twee-verdachten-aan-wegens-overtreding-sanctiewetgeving/) — Fiscal Information and Investigation Service, 2026-05-22
- [SecurityWeek: Admins of Bulletproof Hosting Service Used by Russian Hackers Arrested in Netherlands](https://www.securityweek.com/admins-of-bulletproof-hosting-service-used-by-russian-hackers-arrested-in-netherlands/) — SecurityWeek, 2026-05-26
- [WebHosting.today: Dutch FIOD Dismantles Stark Industries](https://webhosting.today/2026/05/25/dutch-authorities-dismantle-stark-industries-the-rebrand-didnt-save-it/) — WebHosting.today, 2026-05-25
