---
eventId: TP-2026-0046
title: Winona County Second Ransomware Attack Prompts National Guard Deployment
date: 2026-04-06
attackType: ransomware
severity: high
sector: Government
geography: United States
threatActor: Unknown
attributionConfidence: A4
reviewStatus: draft_ai
confidenceGrade: C
generatedBy: penfold-bot
generatedDate: 2026-04-20
cves: []
relatedSlugs:
  - "foster-city-ransomware-2026"
  - "passaic-county-medusa-ransomware-2026"
  - "patriot-regional-emergency-comms-attack-2026"
tags:
  - "ransomware"
  - "government"
  - "municipal"
  - "minnesota"
  - "national-guard"
  - "state-of-emergency"
  - "repeat-attack"
sources:
  - url: https://www.mprnews.org/
    publisher: MPR News
    publisherType: media
    reliability: R2
    publicationDate: "2026-04-06"
  - url: https://www.kttc.com/
    publisher: KTTC
    publisherType: media
    reliability: R2
    publicationDate: "2026-04-06"
  - url: https://www.winonadailynews.com/
    publisher: Winona Daily News
    publisherType: media
    reliability: R2
    publicationDate: "2026-04-07"
  - url: https://www.cisa.gov/news-events/alerts/2026/04/08/winona-county-ransomware
    publisher: CISA
    publisherType: government
    reliability: R1
    publicationDate: "2026-04-08"
mitreMappings:
  - techniqueId: T1190
    techniqueName: "Exploit Public-Facing Application"
    tactic: initial-access
  - techniqueId: T1078
    techniqueName: "Valid Accounts"
    tactic: privilege-escalation
  - techniqueId: T1021
    techniqueName: "Remote Services"
    tactic: lateral-movement
  - techniqueId: T1486
    techniqueName: "Data Encrypted for Impact"
    tactic: impact
  - techniqueId: T1489
    techniqueName: "Service Stop"
    tactic: impact
---

## Summary

On April 6, 2026, Winona County, Minnesota suffered its second devastating ransomware attack within three months. This catastrophic repeat attack directly spurred Minnesota Governor Tim Walz to authorize the immediate deployment of the Minnesota National Guard to assist the county's recovery operators under an active local state of emergency. Forensics preliminarily indicate the actors who originated this April sequence are formally distinct from the group responsible for the initial January intrusion, exposing systemic continuity voids in the target footprint.

## Technical Analysis

The network infrastructure of Winona County underwent rapid unauthorized encryption cascading across public-facing and internal database environments. While specific access vectors remain undisclosed pending FBI forensics, municipal ransomware deployments heavily target unpatched legacy RDP portals globally or actively re-leverage salvaged credentials sold heavily on underground brokerage services following initial localized intrusions. Post-access, lateral movement was aggressively utilized to pivot across local segments, ensuring full administrative lockout before defensive isolation protocols were finalized at 9:30 AM local time.

## Attack Chain

### Stage 1: Initial Entry
Attackers bypass external boundary firewalls either through unpatched public-facing vulnerabilities or credential replay from earlier January architectural scrapes. 

### Stage 2: Lateral Targeting
Attacker executes internal domain mapping, explicitly targeting administrative management servers, and bypassing isolated post-January defensive improvements.

### Stage 3: Encryption Payload
Ransomware is deliberately initialized against critical administrative and internal communication hubs. 

### Stage 4: Extortion Action
Impact forces wide outage leading to local state of emergency deployment of National Guard logistical and IT units.

## Impact Assessment

Core citizen services including general permit processing, property tax queries, land registry access, and standard municipal business licensing went completely offline. Importantly, 911 dispatch networks survived explicitly due to segmented, distinct topologies preserving life safety services while general operations degraded. The incident exposed historical records of county citizens to dual threat factors (extortion encryption directly mapping to public data exposure leaks), severely degrading baseline civic confidence and triggering federal-level assistance mechanisms locally. 

## Attribution

Attribution parameters point heavily to a new threat group, unlinked to the first disruption wave that occurred earlier in January 2026. This repeated attack pattern denotes highly aggressive opportunistic targeting, where subsequent extortionists identify newly-restored frameworks as highly monetizable. Attribution confidence formally remains logged as A4.

## Timeline

### 2026-01-15 — Event
Winona County is originally impacted by its first ransomware attack for 2026 resulting in significant operational closures. 

### 2026-04-06 — Event
At approximately 07:00 AM, the second intrusion begins cascading encryption through the system. Response protocols isolate domains by 09:30 AM.

### 2026-04-06 — Event
By evening, an emergency declaration facilitates Governor Walz activating the Minnesota National Guard cyber operators to directly manage local recovery efforts. 

### 2026-04-09 — Event
Active forensic operations are expanded across the networks with the FBI scaling C2 tracking efforts. 

## Remediation & Mitigation

Early action by Winona County IT definitively contained the spread faster than the earlier January assault because network partitioning strategies had been integrated during immediate post-incident remediation. Ongoing strategic mitigations now pivot on deploying strict endpoint behavior analysis (EDR sweeps) checking for long-dwell command-and-control communication, instituting explicit MFA gateways for every standard and root administrator, and relying completely on mathematically immutable physical local-site backups while scaling managed detection and response services.

## Sources & References

- [MPR News: Winona County ransomware](https://www.mprnews.org/)
- [KTTC: National Guard Deployed to Winona](https://www.kttc.com/)
- [Winona Daily News: Government Services Disrupted](https://www.winonadailynews.com/)
- [CISA: Winona County Status Alert](https://www.cisa.gov/news-events/alerts/2026/04/08/winona-county-ransomware)
