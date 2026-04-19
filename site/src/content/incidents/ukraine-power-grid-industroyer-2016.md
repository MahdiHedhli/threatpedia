---
eventId: "TP-2016-0001"
title: "Kyiv Power Grid Attack (Industroyer)"
date: 2016-12-17
attackType: "Sabotage"
severity: critical
sector: "Energy & Utilities"
geography: "Ukraine"
threatActor: "Sandworm"
attributionConfidence: A1
reviewStatus: "certified"
confidenceGrade: A
generatedBy: "dangermouse-bot"
generatedDate: 2026-04-19
cves: []
relatedSlugs:
  - "ukraine-power-grid-attack-2015"
tags:
  - "ukr-power-grid"
  - "industroyer"
  - "sandworm"
  - "scada"
  - "sabotage"
sources:
  - url: "https://www.justice.gov/opa/pr/six-russian-gru-officers-charged-connection-worldwide-deployment-destructive-malware-and-other"
    publisher: "U.S. Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2020-10-19"
    accessDate: "2026-04-19"
    archived: false
  - url: "https://www.welivesecurity.com/2017/06/12/industroyer-biggest-threat-industrial-control-systems-since-stuxnet/"
    publisher: "ESET"
    publisherType: vendor
    reliability: R1
    publicationDate: "2017-06-12"
    accessDate: "2026-04-19"
    archived: false
  - url: "https://attack.mitre.org/campaigns/C0028/"
    publisher: "MITRE ATT&CK"
    publisherType: research
    reliability: R1
    publicationDate: "2025-04-16"
    accessDate: "2026-04-19"
    archived: false
mitreMappings:
  - techniqueId: "T0831"
    techniqueName: "Manipulation of Control"
    tactic: "Impact"
    notes: "Industroyer was designed to directly manipulate industrial control processes."
---

## Executive Summary

On December 17, 2016, a cyberattack on a transmission substation near Kyiv, Ukraine, caused a blackout affecting approximately one-fifth of the capital. The attack was carried out by the Russian GRU-associated group Sandworm, the same actor responsible for the earlier 2015 Ukrainian power grid attack. This event is exceptionally notable for the deployment of "Industroyer" (also known as CrashOverride), a purpose-built industrial control system (ICS) malware framework capable of directly speaking electric-sector protocols.

## Technical Analysis

Industroyer marked a massive evolution from the 2015 grid attack, where operators had to manually manipulate SCADA Human Machine Interfaces (HMIs) to open breakers. Industroyer contained a core backdoor with several payload modules specifically engineered to interact with standard ICS protocols commonly used in electric power systems, such as IEC 60870-5-101, IEC 60870-5-104, IEC 61850, and OLE for Process Control Data Access (OPC DA).

By speaking these native protocols, Industroyer could automate the process of opening circuit breakers and forcing them to remain open, completely circumventing the standard operator interface. The malware also included a Wiper component designed to obliterate operational systems and render them unbootable after the attack, vastly complicating the recovery and restoration processes for local engineers.

## Attack Chain

### Stage 1: Initial Compromise
Sandworm infiltrated the targeted transmission station's enterprise IT network. Technical specifics of the initial vector (such as spearphishing vs VPN compromise) were overshadowed by the final payloads.

### Stage 2: Lateral Movement to OT
Actors moved from the IT network into the Operational Technology (OT) network housing the SCADA environment.

### Stage 3: Automated ICS Disruption
The Industroyer framework was deployed. The payload communicated directly with local RTUs (Remote Terminal Units) across various ICS protocols to systematically open circuit breakers.

### Stage 4: Wiper Execution
The malware triggered a protective wiper routine to destroy the local operating systems and configuration data, blinding engineers and forcing manual recovery processes at the physical substations.

## Impact Assessment

The incident resulted in a loss of power for roughly 20% of Kyiv's electrical footprint for approximately an hour. While the outage duration was relatively short due to human intervention and physical manual overrides, the use of automated ICS-specific malware demonstrated a dangerous escalation in capability and intent by state-sponsored actors targeting civilian infrastructure.

## MITRE ATT&CK Mapping

### Impact
T0831 - Manipulation of Control: Industroyer directly manipulated circuit breakers via automated ICS protocol payloads.

## Historical Context

The U.S. Department of Justice fully attributed the 2016 Industroyer incident, alongside the 2015 BlackEnergy grid incident and the 2017 NotPetya wiper, to the Russian GRU Unit 74455 (Sandworm). The 2016 incident represents the second pillar of the overarching Sandworm Ukraine Power Grid Campaign.

## Timeline

### 2016-12-17 — The Outage
Kiev experiences a blackout as a direct result of the Industroyer malware interacting with the transmission station.

### 2017-06-12 — Malware Analysis Publicized
ESET formally names and publishes detailed analysis of the Industroyer malware.

### 2020-10-19 — DOJ Indictment
The U.S. Department of Justice issues indictments attributing the operation to GRU Unit 74455.

## Remediation & Mitigation

The incident solidifies the necessity of stringent architectural segmentation between IT and OT networks. Modern ICS environments cannot rely solely on the obfuscation of proprietary protocols; they must deploy rigid access controls, zero-trust credential architectures for pivoting into OT environments, physical backups for catastrophic software wipe events, and persistent offline operational playbooks for manual infrastructure control.

## Sources & References

- [ESET: Industroyer - The Biggest Threat to Industrial Control Systems Since Stuxnet](https://www.welivesecurity.com/2017/06/12/industroyer-biggest-threat-industrial-control-systems-since-stuxnet/) — ESET, 2017-06-12
- [U.S. Department of Justice: Six Russian GRU Officers Charged in Connection with Worldwide Deployment of Destructive Malware and Other Disruptive Actions in Cyberspace](https://www.justice.gov/opa/pr/six-russian-gru-officers-charged-connection-worldwide-deployment-destructive-malware-and-other) — U.S. Department of Justice, 2020-10-19
- [MITRE ATT&CK: 2016 Ukraine Electric Power Attack](https://attack.mitre.org/campaigns/C0028/) — MITRE, 2025-04-16
