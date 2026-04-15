---
campaignId: "TP-CAMP-2015-0001"
title: "Sandworm Ukraine Power Grid Attacks Campaign"
startDate: 2015-12-23
endDate: 2016-12-17
ongoing: false
attackType: "Sabotage"
severity: critical
sector: "Energy & Utilities"
geography: "Ukraine"
threatActor: "Sandworm"
attributionConfidence: A1
reviewStatus: "draft_ai"
confidenceGrade: A
generatedBy: "penfold-bot"
generatedDate: 2026-04-15
relatedIncidents:
  - "ukraine-power-grid-attack-2015"
relatedSlugs:
  - "sandworm"
  - "blackenergy"
  - "industroyer"
tags:
  - "sandworm"
  - "ukraine"
  - "power-grid"
  - "ics"
  - "scada"
  - "industroyer"
  - "blackenergy"
  - "sabotage"
  - "gru"
sources:
  - url: "https://www.cisa.gov/news-events/alerts/2016/02/25/cyber-attack-against-ukrainian-critical-infrastructure"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2016-02-25"
    accessDate: "2026-04-15"
    archived: false
  - url: "https://www.welivesecurity.com/2017/06/12/industroyer-biggest-threat-industrial-control-systems-since-stuxnet/"
    publisher: "ESET"
    publisherType: research
    reliability: R1
    publicationDate: "2017-06-12"
    accessDate: "2026-04-15"
    archived: false
  - url: "https://www.justice.gov/opa/pr/six-russian-gru-officers-charged-connection-worldwide-deployment-destructive-malware-and-other"
    publisher: "US Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2020-10-19"
    accessDate: "2026-04-15"
    archived: false
  - url: "https://www.dragos.com/blog/crashoverride-analysising-the-threat-to-electric-grid-operations/"
    publisher: "Dragos"
    publisherType: vendor
    reliability: R1
    publicationDate: "2017-06-12"
    accessDate: "2026-04-15"
    archived: false
  - url: "https://www.ncsc.gov.uk/news/reckless-campaign-cyber-attacks-russian-military-intelligence-service-gtsst"
    publisher: "NCSC UK"
    publisherType: government
    reliability: R1
    publicationDate: "2018-10-04"
    accessDate: "2026-04-15"
    archived: false
mitreMappings:
  - techniqueId: "T0817"
    techniqueName: "Bravo Zulu: Industrial Control System (ICS) Impact"
    tactic: "Impact"
    notes: "The attackers utilized the Industroyer malware to directly control electrical circuit breakers at substation level."
  - techniqueId: "T0868"
    techniqueName: "Data Acquisition"
    tactic: "Collection"
    notes: "Sandworm utilized specialized protocol modules to acquire real-time data from SCADA systems."
  - techniqueId: "T0813"
    techniqueName: "External Network Connection"
    tactic: "Command and Control"
    notes: "The campaign used compromised VPN credentials to establish remote access to the OT network."
---

## Summary

The Sandworm Ukraine Power Grid campaign refers to a series of landmark cyber-sabotage operations conducted by the Russian GRU targeting the Ukrainian electrical infrastructure in 2015 and 2016. These attacks represent the first documented instances of a cyberattack successfully causing large-scale power outages. The campaign's objective was to demonstrate technical dominance and cause psychological impact on the Ukrainian population during a period of geopolitical conflict.

In December 2015, the group successfully disconnected 30 substations across three regional power distribution companies, leaving approximately 230,000 residents without electricity for several hours. This was followed in December 2016 by an even more sophisticated attack using the **Industroyer** (CrashOverride) malware, which targeted the high-voltage transmission station in Pivnichna, Kiev. The campaign highlighted the vulnerability of critical infrastructure to specialized, ICS-aware malware.

## Technical Analysis

The campaign's tradecraft evolved rapidly between the two primary attacks. The 2015 operation relied on a combination of spearphishing with the **BlackEnergy 3** malware to gain initial access, followed by the manual manipulation of human-machine interfaces (HMI) by the attackers. To prevent recovery, the attackers utilized the **KillDisk** wiper to brick workstations and launched a telephone denial-of-service (TDoS) attack against utility call centers to prevent customers from reporting the outages.

The 2016 attack demonstrated a significant leap in capability with the deployment of **Industroyer**. Unlike the manual 2015 attack, Industroyer was an automated framework designed to speak industrial protocols (such as IEC 60870-5-104 and IEC 61850) natively. This allowed the malware to directly control circuit breakers and protection relays at substations. The malware also included a specialized wiper for Siemens SIPROTEC protection relays, which could have caused physical damage to the equipment if the safety systems had not been manually overridden by technicians.

## Attack Chain

### Stage 1: Initial Access and Reconnaissance
Sandworm utilized targeted spearphishing emails with malicious attachments to compromise business networks. They then performed extensive horizontal movement to identify VPN credentials and paths into the industrial control system (ICS) environment.

### Stage 2: Capability Development
The group developed bespoke modules specifically for the Ukrainian power grid's hardware, including protocol-specific payloads for Industroyer and custom firmware-wiping tools (KillDisk).

### Stage 3: Sabotage Execution
On December 23, 2015 (and December 17, 2016), the attackers launched their payloads simultaneously. In 2015, they hijacked HMI sessions to manually open breakers; in 2016, Industroyer automated the disconnect sequence.

### Stage 4: Post-Impact Disruption
To hinder the remediation efforts, the attackers wiped the master boot records of critical servers and disabled uninterruptible power supplies (UPS), ensuring that utility personnel had to operate in the dark and without remote visibility.

## Impact Assessment

The campaign’s primary impact was the direct loss of power for hundreds of thousands of people in mid-winter. In the 2015 attack, approximately 230,000 residents lost power for up to six hours. The 2016 attack on the Kiev substation affected roughly one-fifth of the city's power consumption at its peak.

Beyond the immediate outages, the campaign had a systemic impact on global utility security. It forced a re-evaluation of the "air-gap" myth and led to the widespread adoption of multi-factor authentication for VPN access to OT networks. The 2016 Industroyer attack is considered a landmark event in cybersecurity, as it was the first malware since Stuxnet to be specifically designed to interact with physical industrial processes.

## Attribution

The campaign is attributed with high confidence to the **Russian General Staff Main Intelligence Directorate (GRU)**, specifically the **Main Center for Special Technologies (GTsST)**, known as **Sandworm Team** or Unit 74455. In October 2020, the U.S. Department of Justice indicted six GRU officers for their roles in the power grid attacks and other destructive campaigns.

Technical attribution is based on the use of the BlackEnergy infrastructure, which had been previously linked to GRU operations, and the strategic alignment of the attacks with Russian military objectives in Ukraine. Multiple cybersecurity vendors, including ESET and Dragos, have provided consistent analysis linking the tradecraft seen in the 2015 and 2016 attacks to the same threat actor.

## Timeline

### 2015-12-23 — First Grid Attack
Sandworm targets three regional power distribution companies (Oblenergos) in Ukraine, causing the first-ever cyber-induced blackout.

### 2016-01 — CISA/FBI Investigation
U.S. and Ukrainian authorities conduct a joint investigation, publishing the first official technical details of the BlackEnergy/KillDisk combination.

### 2016-12-17 — Second Grid Attack (Kiev)
The group deploys the Industroyer malware against the Pivnichna substation in Kiev, causing a 75-minute outage and demonstrating automated ICS control.

### 2017-06 — Industroyer Disclosure
ESET and Dragos release comprehensive technical reports on the Industroyer (CrashOverride) framework, alerting the global energy sector to the new threat.

### 2020-10-19 — US DOJ Indictment
The U.S. Department of Justice charges six GRU officers specifically for their involvement in the 2015 and 2016 Ukraine power grid attacks.

## Sources & References

- [CISA: Cyber-Attack Against Ukrainian Critical Infrastructure](https://www.cisa.gov/news-events/alerts/2016/02/25/cyber-attack-against-ukrainian-critical-infrastructure) — CISA, 2016-02-25
- [ESET: Industroyer — The Biggest Threat to Industrial Control Systems since Stuxnet](https://www.welivesecurity.com/2017/06/12/industroyer-biggest-threat-industrial-control-systems-since-stuxnet/) — ESET, 2017-06-12
- [US Department of Justice: Six Russian GRU Officers Charged in Connection with Worldwide Deployment of Destructive Malware](https://www.justice.gov/opa/pr/six-russian-gru-officers-charged-connection-worldwide-deployment-destructive-malware-and-other) — US Department of Justice, 2020-10-19
- [Dragos: CrashOverride - Analysis of the Threat to Electric Grid Operations](https://www.dragos.com/blog/crashoverride-analysising-the-threat-to-electric-grid-operations/) — Dragos, 2017
- [NCSC UK: Advisory on Sandworm activity targeting international organizations](https://www.ncsc.gov.uk/news/reckless-campaign-cyber-attacks-russian-military-intelligence-service-gtsst) — NCSC UK, 2018
