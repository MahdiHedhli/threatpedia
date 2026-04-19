---
eventId: "TP-2020-0002"
articleType: "incident"
title: "FireEye Red Team Tools Breach"
date_start: 2020-11-01
date_disclosed: 2020-12-08
attackType: "Espionage"
severity: critical
sector: "Technology"
geography: "Global"
attributionConfidence: A1
attributionRationale: "Linked unequivocally to the broader SVR/APT29 SolarWinds campaign by government attribution."
reviewStatus: "certified"
confidenceGrade: A
generatedBy: "dangermouse-bot"
generatedDate: 2026-04-19
cves: []
relatedSlugs:
  - "solarwinds-orion-supply-chain-compromise-2020"
tags:
  - "solarwinds"
  - "apt29"
  - "fireeye"
  - "svr"
sources:
  - url: "https://www.mandiant.com/resources/blog/fireeye-cyber-attack"
    publisher: "Mandiant"
    publisherType: vendor
    reliability: R1
    publicationDate: "2020-12-08"
    accessDate: "2026-04-19"
    archived: false
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa20-352a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2020-12-17"
    accessDate: "2026-04-19"
    archived: false
  - url: "https://attack.mitre.org/campaigns/C0024/"
    publisher: "MITRE ATT&CK"
    publisherType: research
    reliability: R1
    publicationDate: "2025-09-19"
    accessDate: "2026-04-19"
    archived: false
mitreMappings:
  - techniqueId: "T1195.002"
    techniqueName: "Supply Chain Compromise: Compromise Software Supply Chain"
    tactic: "Initial Access"
    attackVersion: "v15.1"
    confidence: "confirmed"
    evidence: "APT29 accessed FireEye through the trojanized SolarWinds Orion build."
---

## Executive Summary

On December 8, 2020, FireEye (now Mandiant) publicly disclosed that it had been breached by a highly sophisticated state-sponsored adversary. The attackers explicitly targeted and successfully exfiltrated the company's proprietary Red Team assessment tools. This breach served as the precipitating discovery event for the massive SolarWinds supply chain compromise. The actors gained initial access through the trojanized SolarWinds Orion software (SUNBURST), making FireEye one of the most critical victims in the broader SVR espionge campaign.

## Technical Analysis

The operators utilized the SUNBURST backdoor implanted in FireEye's SolarWinds Orion servers to gain a foothold. The subsequent lateral movement demonstrated extreme OPSEC and discipline, utilizing forged SAML tokens and manipulating federated trust to move undetected within the network. Their primary objective inside FireEye appeared to be the theft of offensive tools rather than customer data, likely an attempt to bolster the SVR's own capabilities or obfuscate future campaigns.

## Impact Assessment

While the theft of the Red Team tools was initially concerning, FireEye mitigated the impact by immediately publishing countermeasures and detection logic (YARA, Snort, ClamAV) for all stolen tools. The macro-impact of this incident was the resulting internal investigation at FireEye, which uncovered the SUNBURST backdoor and exposed the entire SolarWinds campaign.

## Timeline

### 2020-12-08 — FireEye Discloses Breach
FireEye publicly announces the theft of its Red Team tools.

### 2020-12-13 — SolarWinds Compromise Publicly Identified
FireEye attributes the initial access methodology to the trojanized SolarWinds update, exposing the global campaign.

## Sources & References
- [Mandiant: FireEye Cyber Attack](https://www.mandiant.com/resources/blog/fireeye-cyber-attack) — Mandiant, 2020-12-08
