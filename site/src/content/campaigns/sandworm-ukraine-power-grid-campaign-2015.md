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
generatedDate: 2026-04-16
relatedSlugs:
  - "sandworm"
tags:
  - "sandworm"
  - "ukraine"
  - "power-grid"
  - "ics"
  - "scada"
  - "blackenergy"
  - "industroyer"
  - "sabotage"
sources:
  - url: "https://www.cisa.gov/news-events/alerts/2016/02/25/cyber-attack-against-ukrainian-critical-infrastructure"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2016-02-25"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.justice.gov/opa/pr/six-russian-gru-officers-charged-connection-worldwide-deployment-destructive-malware-and"
    publisher: "US Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2020-10-19"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.welivesecurity.com/2017/06/12/industroyer-biggest-threat-industrial-control-systems-since-stuxnet/"
    publisher: "ESET"
    publisherType: vendor
    reliability: R1
    publicationDate: "2017-06-12"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://dragos.com/blog/industry-news/crashoverride-analysis-of-the-threat-to-electric-grid-operations/"
    publisher: "Dragos"
    publisherType: vendor
    reliability: R1
    publicationDate: "2017-06-12"
    accessDate: "2026-04-16"
    archived: false
mitreMappings:
  - techniqueId: "T1059.001"
    techniqueName: "Command and Scripting Interpreter: PowerShell"
    tactic: "Execution"
    notes: "BlackEnergy3 used PowerShell scripts for lateral movement within power company networks."
  - techniqueId: "T1485"
    techniqueName: "Data Destruction"
    tactic: "Impact"
    notes: "KillDisk wiper deployed alongside SCADA manipulation to destroy systems and delay recovery."
  - techniqueId: "T1562.001"
    techniqueName: "Impair Defenses: Disable or Modify Tools"
    tactic: "Defense Evasion"
    notes: "Industroyer manipulated ICS protocols (IEC 104, IEC 61850) to directly control circuit breakers."
---

## Summary

The Sandworm Ukraine power grid campaign encompassed two distinct cyberattacks against Ukrainian electrical infrastructure: the December 2015 BlackEnergy3 attack on three power distribution companies and the December 2016 Industroyer/CrashOverride attack on the Ukrenergo transmission substation. Together, these operations represented the first and second confirmed cyberattacks to cause power outages, establishing a precedent for state-sponsored attacks against critical infrastructure.

Both attacks were attributed to Sandworm (GRU Unit 74455) by the U.S. DOJ in its October 2020 indictment of six GRU officers. The campaign demonstrated the evolution from manual SCADA manipulation (2015) to automated ICS-specific malware (2016), representing a qualitative advancement in cyber-physical attack capabilities.

## Technical Analysis

**2015 Attack (BlackEnergy3)**: The attackers used BlackEnergy3 malware, delivered through spearphishing emails with malicious Microsoft Word documents, to establish persistent access to the IT networks of three Ukrainian power distribution companies (Kyivoblenergo, Prykarpattyaoblenergo, Chernivtsioblenergo). Over several months, operators conducted reconnaissance, harvested VPN credentials, and gained access to SCADA systems. On December 23, 2015, operators remotely logged into SCADA workstations and manually opened circuit breakers, cutting power to approximately 225,000 customers. KillDisk wiper malware was deployed to destroy workstations and delay recovery. The attackers also jammed the call center phone system to prevent customers from reporting outages.

**2016 Attack (Industroyer/CrashOverride)**: One year later, Sandworm deployed Industroyer, a modular malware framework specifically designed to interact with industrial control system protocols. Industroyer contained modules for IEC 61850 (used in substation automation), IEC 104 (SCADA telecontrol), OPC DA (data access), and included a wiper component. On December 17, 2016, the malware automated the opening of circuit breakers at Ukrenergo's Pivnichna transmission substation near Kyiv, causing a localized outage lasting approximately one hour.

## Attack Chain

### Stage 1: Initial Access via Spearphishing
Both attacks began with spearphishing emails containing malicious Office documents that delivered BlackEnergy3 malware to IT network workstations.

### Stage 2: IT Network Compromise and Reconnaissance
Operators established persistent access, harvested credentials, and mapped network architecture including connections between IT and OT environments.

### Stage 3: VPN/Remote Access to SCADA
Using stolen VPN credentials and legitimate remote access tools, operators accessed SCADA systems controlling power distribution equipment.

### Stage 4: Power Grid Manipulation
In 2015, operators manually interacted with SCADA HMIs to open circuit breakers. In 2016, Industroyer automated this process through direct ICS protocol manipulation.

### Stage 5: Evidence Destruction
KillDisk wiper malware was deployed on IT systems to destroy evidence and delay recovery. Firmware on serial-to-Ethernet converters was also corrupted to prevent remote restoration.

## Impact Assessment

The 2015 attack affected approximately 225,000 customers across three power distribution regions, with outages lasting one to six hours. Power was restored through manual intervention at substations. The 2016 attack caused a localized outage in Kyiv lasting approximately one hour.

Beyond immediate power disruption, the attacks damaged IT infrastructure through KillDisk deployment, corrupted SCADA firmware, and disrupted telephone systems. Recovery required weeks of manual remediation. The attacks demonstrated that cyber operations could achieve kinetic effects on electrical infrastructure and established a precedent that has informed critical infrastructure protection policies worldwide.

## Attribution

The U.S. DOJ October 2020 indictment of six GRU Unit 74455 officers attributed both the 2015 and 2016 Ukraine power grid attacks to Sandworm. The indictment provided operational details linking the attacks to the GTsST (Main Centre for Special Technologies). CISA alert (February 2016) documented the 2015 attack's technical details. ESET and Dragos independently analyzed Industroyer and attributed it to Sandworm based on infrastructure overlap and malware code similarities with other Sandworm tools.

## Timeline

### 2015-12-23 -- BlackEnergy3 Power Grid Attack
Three Ukrainian power distribution companies attacked; 225,000 customers lose power.

### 2016-02-25 -- CISA Alert Published
CISA publishes technical analysis of the 2015 Ukraine power grid attack.

### 2016-12-17 -- Industroyer Power Grid Attack
Ukrenergo's Pivnichna substation attacked using Industroyer; localized outage in Kyiv.

### 2017-06-12 -- Industroyer Publicly Disclosed
ESET and Dragos publish technical analyses of Industroyer/CrashOverride malware.

### 2020-10-19 -- DOJ Indictment
Six GRU officers indicted for Sandworm operations including both Ukraine power grid attacks.

## Sources & References

- [CISA: Cyber Attack Against Ukrainian Critical Infrastructure](https://www.cisa.gov/news-events/alerts/2016/02/25/cyber-attack-against-ukrainian-critical-infrastructure) -- CISA, 2016-02-25
- [US DOJ: Six Russian GRU Officers Charged](https://www.justice.gov/opa/pr/six-russian-gru-officers-charged-connection-worldwide-deployment-destructive-malware-and) -- US Department of Justice, 2020-10-19
- [ESET: Industroyer Analysis](https://www.welivesecurity.com/2017/06/12/industroyer-biggest-threat-industrial-control-systems-since-stuxnet/) -- ESET, 2017-06-12
- [Dragos: CrashOverride Analysis](https://dragos.com/blog/industry-news/crashoverride-analysis-of-the-threat-to-electric-grid-operations/) -- Dragos, 2017-06-12
