---
campaignId: "TP-CAMP-2015-0001"
title: "Sandworm Ukraine Power Grid Attacks Campaign (2015-2016)"
startDate: 2015-03-01
endDate: 2016-12-31
ongoing: false
attackType: "ICS / Industrial Sabotage"
severity: critical
sector: "Energy / Utilities"
geography: "Ukraine"
threatActor: "Sandworm"
attributionConfidence: A1
reviewStatus: "draft_ai"
confidenceGrade: A
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
cves:
  - "CVE-2014-4114"
tags:
  - "sandworm"
  - "gru"
  - "ukraine"
  - "blackenergy"
  - "industroyer"
  - "ics"
  - "power-grid"
sources:
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/icsa-16-056-01"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2016-02-25"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.justice.gov/opa/pr/six-russian-gru-officers-charged-connection-worldwide-deployment-destructive-malware-and-other"
    publisher: "US Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2020-10-19"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.welivesecurity.com/2016/01/04/blackenergy-sshdore-war-ukrainian-critical-infrastructure/"
    publisher: "ESET (WeLiveSecurity)"
    publisherType: vendor
    reliability: R1
    publicationDate: "2016-01-04"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.mandiant.com/resources/blog/sandworm-team-historical-perspective"
    publisher: "Mandiant"
    publisherType: vendor
    reliability: R1
    publicationDate: "2016-01-07"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.dragos.com/blog/industry-news/industroyer-ii-sandworm-targeted-ukraine-power-grid-again-with-specialized-malware/"
    publisher: "Dragos"
    publisherType: vendor
    reliability: R1
    publicationDate: "2022-04-13"
    accessDate: "2026-04-16"
    archived: false
mitreMappings:
  - techniqueId: "T0812"
    techniqueName: "Default Credentials"
    tactic: "Initial Access"
    notes: "Attackers gained initially access by compromising VPN accounts of utility staff, leveraging weak or default credentials."
  - techniqueId: "T0806"
    techniqueName: "Exploitation of Removable Media"
    tactic: "Initial Access"
    notes: "The BlackEnergy3 malware was often delivered via spear-phishing emails containing malicious Office documents."
  - techniqueId: "T0848"
    techniqueName: "Impact File Wiping"
    tactic: "Impact"
    notes: "Attackers utilized the KillDisk wiper to destroy system files on HMI and workstations, complicating the recovery process."
  - techniqueId: "T0815"
    techniqueName: "External Remote Services"
    tactic: "Persistence"
    notes: "Malicious VPN access was maintained through backdoors to allow manual intervention in the SCADA systems."
---

## Summary

The Sandworm Ukraine Power Grid Attacks Campaign refers to a series of highly coordinated cyber-sabotage operations conducted by the Russian GRU against the Ukrainian energy sector. The most impactful events occurred in December 2015 and December 2016, marking the first instances in history where a cyberattack resulted in a widespread, physical blackout of a civilian power grid.

Attributed to **Sandworm** (also known as GRU Unit 74455 or Voodoo Bear), the campaign utilized a variety of industrial control system (ICS) specific malwares, including **BlackEnergy3** and **Industroyer**. The operations demonstrated extreme technical proficiency, as the attackers did not just use automated malware but manually interacted with SCADA (Supervisory Control and Data Acquisition) systems to open circuit breakers and disconnect electricity to hundreds of thousands of customers.

## Technical Analysis

The campaign utilized a modular toolkit designed for various stages of the IT and OT (Operational Technology) lifecycle. In the 2015 attack, the primary implant was **BlackEnergy3**, which featured plugins for credential theft, screen captures, and remote execution. To disrupt the power flow, the attackers used the **KillDisk** wiper to destroy master boot records and deleted system files on HMIs (Human Machine Interfaces), effectively blinding the utility operators.

The 2016 attack, directed at the Pivnichna substation in Kyiv, introduced **Industroyer** (or CrashOverride). This was a specialized, protocol-aware malware capable of communicating directly with grid equipment via various industrial protocols (IEC 60870-5-101, IEC 60870-5-104, IEC 61850, and OLE for Process Control). Industroyer's design allowed it to automate the substation control process, giving it the ability to operate circuit breakers without needing direct GUI access to the HMI.

## Attack Chain

### Stage 1: Initial Access and Reconnaissance
The attackers gained a foothold in the utilities' IT networks through spear-phishing emails containing malicious Word and Excel attachments. These documents leveraged social engineering to trick users into enabling macros, which then executed the BlackEnergy3 dropper.

### Stage 2: Credential Harvest and Lateral Movement
Once inside the IT network, the SVR used internal reconnaissance tools to steal credentials for the VPNs connecting the IT network to the OT (SCADA) network. They silently monitored the utility operators' behaviors during the reconnaissance phase.

### Stage 3: Operational Control
On the day of the attack, the adversaries logged into the SCADA network via the stolen VPN credentials. They took control of the HMI systems and manually began opening breakers at several substations. Simultaneously, they deployed a firmware-wiping attack against the serial-to-ethernet converters used for remote substation communication.

### Stage 4: Service Disruption and Sabotage
To prevent immediate recovery, the attackers executed the **KillDisk** wiper on workstations and servers. In the 2015 attack, they also launched a telephone denial-of-service (TDoS) attack against the utility's customer support center to overwhelm operators with calls and hide the extent of the outage.

## Impact Assessment

The 2015 attack resulted in a blackout for approximately 225,000 customers across multiple Ukrainian regions, lasting several hours. The 2016 attack on the Kyiv grid impacted about 1/5th of the city's power consumption. Beyond the immediate loss of electricity, the campaigns caused significant physical damage to grid infrastructure, forcing many utilities to operate substations manually for months following the attacks.

The campaign served as a global alarm for critical infrastructure protection. It proved that state actors are capable of and willing to use cyber-kinetic weapons against civilian populations. This led to a massive increase in funding and focus for ICS/SCAL security globally and prompted the U.S. and allies to issue specific security advisories regarding the "Sandworm" threat group.

## Attribution

The campaign is attributed with high confidence to the **Russian Main Intelligence Directorate (GRU)**, specifically the military unit **74455**, known in the industry as **Sandworm** or Voodoo Bear. In October 2020, the U.S. Department of Justice formally indicted six GRU officers for ihrer role in the Ukraine grid attacks and other destructive operations (like NotPetya).

Attribution was supported by the discovery of unique code overlaps between the BlackEnergy3 malware and previous GRU-linked tools, as well as the alignment of the attack timelines with broader Russian geopolitical objectives in Ukraine. The level of resources, planning, and specific ICS knowledge required for such an operation is consistent with a high-tier national intelligence service.

## Timeline

### 2015-03 — Initial Reconnaissance
Sandworm begins spear-phishing campaigns against Ukrainian regional energy distribution companies (oblenergos).

### 2015-12-23 — First Grid Attack
Attackers disconnect 30 substations across three oblenergos, leaving 225,000 people without power. They use KillDisk and a TDoS attack to hinder response.

### 2016-12-17 — Second Grid Attack (Kyiv)
The Pivnichna substation in Kyiv is targeted using the Industroyer malware, resulting in a blackout for a large portion of the capital's population.

### 2017-06-12 — Industroyer Analysis
ESET and Dragos publish detailed technical reports identifying the Industroyer malware and its specialized ICS protocol modules.

### 2020-10-19 — US DOJ Indictment
The US Department of Justice indicts six members of GRU Unit 74455 for the 2015 and 2016 grid attacks, among other crimes.

## Sources & References

- [CISA: Advisory (ICSA-16-056-01) — Cyber-Attack Against Ukrainian Critical Infrastructure](https://www.cisa.gov/news-events/cybersecurity-advisories/icsa-16-056-01) — CISA, 2016-02-25
- [US Department of Justice: Six Russian GRU Officers Charged in Connection with Worldwide Deployment of Destructive Malware](https://www.justice.gov/opa/pr/six-russian-gru-officers-charged-connection-worldwide-deployment-destructive-malware-and-other) — US Department of Justice, 2020-10-19
- [ESET: BlackEnergy SSHDore — War in Ukrainian Critical Infrastructure](https://www.welivesecurity.com/2016/01/04/blackenergy-sshdore-war-ukrainian-critical-infrastructure/) — ESET WeLiveSecurity, 2016-01-04
- [Mandiant: Sandworm Team — A Historical Perspective on destructive Russian operations](https://www.mandiant.com/resources/blog/sandworm-team-historical-perspective) — Mandiant, 2016-01-07
- [Dragos: Industroyer II — Sandworm Targeted Ukraine Power Grid Again with Specialized Malware](https://www.dragos.com/blog/industry-news/industroyer-ii-sandworm-targeted-ukraine-power-grid-again-with-specialized-malware/) — Dragos, 2022-04-13
