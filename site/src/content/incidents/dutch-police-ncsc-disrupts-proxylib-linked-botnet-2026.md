---
eventId: TP-2026-0334
title: Dutch Police and NCSC Disrupt Asocks-Linked Botnet Operation
date: 2026-05-28
attackType: Botnet
severity: high
sector: Cybercrime infrastructure / Proxy services
geography: Netherlands / Global
threatActor: Unknown
attributionConfidence: A4
reviewStatus: draft_ai
confidenceGrade: B
generatedBy: dangermouse-bot
generatedDate: 2026-06-11
cves: []
relatedSlugs: []
tags:
  - botnet
  - proxylib
  - asocks
  - ncsc
  - police
  - proxy-malware
  - command-and-control
  - botnet-infrastructure
  - cybersecurity
sources:
  - url: https://www.politie.nl/nieuws/2026/mei/28/06-politie-en-ncsc-halen-groot-botnetwerk-offline.html
    publisher: Dutch National Police
    publisherType: government
    reliability: R1
    publicationDate: "2026-05-28"
    accessDate: "2026-06-11"
    archived: false
  - url: https://www.ncsc.nl/nieuws/gezamenlijke-actie-politie-en-ncsc-legt-groot-botnetwerk-plat
    publisher: National Cyber Security Centre Netherlands
    publisherType: government
    reliability: R1
    publicationDate: "2026-05-28"
    accessDate: "2026-06-11"
    archived: false
  - url: https://risky.biz/risky-bulletin-dutch-police-take-down-giant-botnet-of-17-million-devices
    publisher: Risky Business
    publisherType: media
    reliability: R2
    publicationDate: "2026-05-28"
    accessDate: "2026-06-11"
    archived: false
  - url: https://nltimes.nl/2026/05/28/ncsc-dutch-police-disrupt-global-botnet-controlled-via-netherlands-based-servers
    publisher: NL Times
    publisherType: media
    reliability: R3
    publicationDate: "2026-05-28"
    accessDate: "2026-06-11"
    archived: false
  - url: https://www.humansecurity.com/learn/blog/satori-threat-intelligence-alert-proxylib-and-lumiapps-transform-mobile-devices-into-proxy-nodes
    publisher: Human Security
    publisherType: research
    reliability: R3
    publicationDate: "2026-05-28"
    accessDate: "2026-06-11"
    archived: false
mitreMappings:
  - techniqueId: T1090
    techniqueName: Proxy
    tactic: Command and Control
    attack-version: "v19.0"
    confidence: probable
    evidence: Dutch agencies described a network of infected devices used by controlled infrastructure to route and relay cyberattack traffic through proxy-like behavior.
  - techniqueId: T1496
    techniqueName: Resource Hijacking
    tactic: Impact
    attack-version: "v19.0"
    confidence: probable
    evidence: Sources describe millions of infected endpoints participating in coordinated attack activity, indicating heavy unauthorized consumption and abuse of device resources.
---

## Summary

On 2026-05-28, Dutch authorities and the Netherlands National Cyber Security Center (NCSC) took action to take a large botnet offline.

Public Dutch reporting says the operation identified roughly 200 command infrastructure servers and a large number of infected endpoints participating in cyber operations, including computers, tablets, and smartphones. The action was announced as a joint disruption effort to reduce ongoing abuse and the operational lifetime of the infrastructure.

The same reporting cluster has been referenced publicly as involving proxy-capable malware activity linked to PROXYLIB-style infrastructure and Asocks-associated actor naming in open-source coverage. Those attributions are therefore presented as **partially corroborated** and explicitly low to moderate confidence, because primary statements emphasize the takedown itself and infrastructure scale rather than formal legal attribution.

## Technical Analysis

The publicly described activity suggests a centralized infrastructure model: country-resident servers coordinating activity distributed across a very large pool of compromised endpoints. NCSC and police messaging emphasizes that this botnet-scale cluster was able to reach millions of potentially compromised devices and use them as part of attack traffic and campaign operations.

Publicly available technical details in the open sources focus on:

- the scale of endpoint participation,
- the coordinated disruption action by law enforcement and NCSC,
- and the existence of multiple infrastructure points used to control or broker malicious activity.

At this stage, the available evidence in the public statements is strongest around disruption and scale, and weaker around precise malware family lineage, payload families, and end-to-end adversary command architecture.

## Attack Chain

### Stage 1: Persistent Infection and Device Enrollment

Sources indicate millions of infected devices were involved, including diverse endpoint types. This pattern is consistent with proxy-chain botnet behavior, where endpoint nodes are recruited and kept online for traffic redirection or attack orchestration.

### Stage 2: Infrastructure-Control Layer

The reports identify hundreds of servers on the operator side. The presence of that level of infrastructure aligns with a botnet control strategy that can reroute tasks and maintain service despite node churn.

### Stage 3: Law-Enforcement-Driven Sink/Take-Down Response

Dutch police and NCSC executed a coordinated disruption action and report that major portions of that operational stack were taken offline. That action appears to have targeted infrastructure and endpoint abuse at scale rather than a single host or campaign actor site.

## Impact Assessment

This takedown materially affects:

- botnet throughput and command reach,
- downstream attack campaigns relying on distributed proxy nodes,
- victimized endpoint owners who may have had devices used without permission.

The reported scale (millions of devices, hundreds of servers) indicates potential broad collateral impact if abuse had continued. The disruption likely reduced immediate attack capacity but should be interpreted as operational interruption, not guaranteed permanent eradication of all related tooling.

## Attribution

Attribution is intentionally constrained:

- Dutch official pages confirm the joint operation by police and NCSC.
- Public commentary and analysis mention Asocks/PROXYLIB-linked naming in this incident’s wider reporting ecosystem, but full, confirmed attribution remains limited in public statements.

Given available evidence, the safest attribution outcome is operator-level unknown with indirect infrastructure references marked separately.

## Timeline

### 2026-05-28 — Joint disruption action by Dutch police and NCSC

Public statements from Dutch police and NCSC report the coordinated takedown/disruption of a large botnet infrastructure.

### 2026-05-28 — Public reporting expands to scale figures

Subsequent coverage references the same action and adds scale context, including rough counts of servers and infected endpoints.

## Remediation & Mitigation

Organizations and users should treat devices as potentially exposed during such campaigns and use standard hygiene steps:

- Reset potentially compromised device accounts and credentials.
- Run anti-malware scans and remove unknown apps/services.
- Audit app permissions and installed VPN/proxy helpers.
- Segment and harden endpoint telemetry pipelines to detect unusual outbound proxy-like traffic.
- Keep devices patched and remove suspicious startup persistence.

## Sources & References

- [National Cyber Security Centre Netherlands: Gezamenlijke actie politie en NCSC legt groot botnetwerk plat](https://www.ncsc.nl/nieuws/gezamenlijke-actie-politie-en-ncsc-legt-groot-botnetwerk-plat) — National Cyber Security Centre Netherlands, 2026-05-28
- [Dutch National Police: Politie en NCSC halen groot botnetwerk offline](https://www.politie.nl/nieuws/2026/mei/28/06-politie-en-ncsc-halen-groot-botnetwerk-offline.html) — Dutch National Police, 2026-05-28
- [Risky Business: Dutch police take down giant botnet of 17 million devices](https://risky.biz/risky-bulletin-dutch-police-take-down-giant-botnet-of-17-million-devices) — Risky Business, 2026-05-28
- [NL Times: NCSC and Dutch police disrupt global botnet controlled via Netherlands-based servers](https://nltimes.nl/2026/05/28/ncsc-dutch-police-disrupt-global-botnet-controlled-via-netherlands-based-servers) — NL Times, 2026-05-28
- [Human Security: Satori Threat Intelligence Alert: PROXYLIB and LumiApps Transform Mobile Devices Into Proxy Nodes](https://www.humansecurity.com/learn/blog/satori-threat-intelligence-alert-proxylib-and-lumiapps-transform-mobile-devices-into-proxy-nodes) — Human Security, 2026-05-28
