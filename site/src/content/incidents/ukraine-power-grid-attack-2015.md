---
eventId: TP-2015-0002
title: "Ukraine Power Grid Cyberattack"
date: 2015-12-23
attackType: Sabotage
severity: critical
sector: Energy & Utilities
geography: Ukraine
threatActor: Sandworm
attributionConfidence: A1
reviewStatus: draft_ai
confidenceGrade: A
generatedBy: dangermouse-bot
generatedDate: 2026-04-16
cves: []
relatedSlugs:
  - "notpetya-wiper-attack-2017"
tags:
  - sabotage
  - critical-infrastructure
  - energy
  - power-grid
  - ukraine
  - sandworm
  - blackenergy
  - ics
  - scada
  - russia
sources:
  - url: "https://www.cisa.gov/news-events/ics-alerts/ir-alert-h-16-056-01"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2016-02-25"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://attack.mitre.org/groups/G0034/"
    publisher: "MITRE"
    publisherType: research
    reliability: R1
    publicationDate: "2019-01-01"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.boozallen.com/content/dam/boozallen/documents/2016/09/ukraine-report-when-the-lights-went-out.pdf"
    publisher: "Booz Allen Hamilton"
    publisherType: vendor
    reliability: R2
    publicationDate: "2016-09-01"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.justice.gov/opa/pr/six-russian-gru-officers-charged-connection-worldwide-deployment-destructive-malware-and"
    publisher: "U.S. Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2020-10-19"
    accessDate: "2026-04-16"
    archived: false
mitreMappings:
  - techniqueId: T1566.001
    techniqueName: "Phishing: Spearphishing Attachment"
    tactic: "Initial Access"
    notes: "BlackEnergy malware was delivered via spearphishing emails containing weaponized Microsoft Office documents."
  - techniqueId: T1059.001
    techniqueName: "Command and Scripting Interpreter: PowerShell"
    tactic: "Execution"
    notes: "Macro-enabled documents executed PowerShell commands to download and install BlackEnergy."
  - techniqueId: T1021.001
    techniqueName: "Remote Services: Remote Desktop Protocol"
    tactic: "Lateral Movement"
    notes: "Attackers used stolen VPN credentials and RDP to access SCADA workstations."
  - techniqueId: T1489
    techniqueName: "Service Stop"
    tactic: "Impact"
    notes: "Attackers remotely opened breakers in distribution substations, cutting power to approximately 230,000 customers."
---

## Summary

On December 23, 2015, three Ukrainian regional electricity distribution companies — Prykarpattyaoblenergo, Chernivtsioblenergo, and Kyivoblenergo — experienced coordinated cyberattacks that disrupted electrical power distribution to approximately 230,000 customers for periods ranging from one to six hours. This event marked the first publicly confirmed case of a cyberattack causing a power outage, representing a watershed moment in the understanding of cyber threats to critical infrastructure.

The attackers, attributed to the Russian military intelligence (GRU) threat group known as Sandworm (also tracked as TEMP.Noble, Voodoo Bear, and IRIDIUM), had maintained access to the Ukrainian utility networks for approximately six months before executing the attack. During this period, they conducted reconnaissance of the industrial control systems (ICS) environment, harvested credentials, and mapped the SCADA networks controlling power distribution.

The attack was multi-faceted: the attackers remotely opened circuit breakers at multiple substations, deployed KillDisk wiper malware to destroy evidence and delay recovery, overwrote firmware on serial-to-Ethernet converters to prevent remote restoration, and launched a telephone denial-of-service attack against the utilities' call centers to prevent customers from reporting outages.

## Technical Analysis

The initial compromise occurred approximately six months before the attack through spearphishing emails containing weaponized Microsoft Word documents with embedded BlackEnergy malware. BlackEnergy is a modular backdoor toolkit that has been used by the Sandworm group since at least 2007. The macro-enabled documents, when opened, executed PowerShell commands that downloaded and installed the BlackEnergy payload, establishing a persistent foothold in the utility corporate networks.

From the corporate networks, the attackers used harvested VPN credentials to access the operational technology (OT) environments. They identified and mapped the SCADA systems controlling power distribution, which included SCADA platforms from vendors ABB, Siemens, and a Ukrainian manufacturer. The attackers gained familiarity with the specific SCADA implementations through months of observation and testing.

On the day of the attack, the operators manually took control of SCADA workstations at each of the three utility companies. Using either remote desktop connections or VPN access, they logged into the SCADA human-machine interface (HMI) systems and began opening circuit breakers at distribution substations. The attackers demonstrated detailed knowledge of the SCADA systems, navigating the interfaces to identify and open specific breakers.

Simultaneously, KillDisk wiper malware was deployed across affected systems. KillDisk overwrote the master boot records of targeted workstations and servers, rendering them unbootable and destroying logs that could be used for forensic analysis. The attackers also overwrote firmware on serial-to-Ethernet converters at substations, preventing utility operators from remotely restoring power through the SCADA systems and forcing manual restoration.

A telephone denial-of-service (TDoS) attack was launched against the call centers of the affected utilities, flooding phone lines with automated calls and preventing customers from reporting outages. This component delayed the utilities' awareness of the scope of the outage.

## Attack Chain

### Stage 1: Spearphishing and Initial Access

Targeted phishing emails with weaponized Microsoft Word documents were sent to employees at Ukrainian electricity distribution companies. The documents contained macros that downloaded and installed BlackEnergy malware.

### Stage 2: Credential Harvesting and Reconnaissance

Over approximately six months, the attackers harvested credentials, mapped the corporate and OT networks, and identified VPN pathways between the corporate IT environment and the SCADA control networks.

### Stage 3: SCADA System Familiarization

The attackers studied the SCADA systems controlling power distribution, learning the specific vendor implementations, interface navigation, and breaker control procedures at each targeted utility.

### Stage 4: Coordinated Attack Execution

On December 23, 2015, at approximately 3:35 PM local time, the attackers simultaneously accessed SCADA systems at three utilities and began opening circuit breakers at distribution substations, cutting power to customers.

### Stage 5: Evidence Destruction and Recovery Denial

KillDisk wiper malware was deployed to destroy systems and logs. Firmware on serial-to-Ethernet converters was overwritten to prevent remote power restoration. TDoS attacks targeted utility call centers.

### Stage 6: Manual Power Restoration

Utility operators dispatched crews to manually close breakers at affected substations, restoring power over the following one to six hours. Some substations remained on manual control for months afterward.

## Impact Assessment

The attack caused power outages affecting approximately 230,000 customers across three Ukrainian oblasts (regions). Prykarpattyaoblenergo in Ivano-Frankivsk reported the largest impact, with approximately 80,000 customers losing power for up to six hours. The other two utilities experienced shorter outages.

While the power outage itself was relatively brief due to the manual restoration capability of the Ukrainian grid, the broader impact was substantial. The destruction of SCADA infrastructure forced utilities to operate in manual mode for months, increasing the operational burden on staff and reducing the reliability and responsiveness of the distribution system.

The attack demonstrated that cyber operations could achieve physical effects on critical infrastructure, validating theoretical scenarios that had been discussed in the cybersecurity community for years. It prompted reassessment of ICS/SCADA security across the global energy sector and led to increased investment in industrial control system security.

## Attribution

The attack has been attributed to the Russian government's Main Intelligence Directorate (GRU) Unit 74455, known in the cybersecurity community as Sandworm. Attribution is supported by multiple lines of evidence.

CISA (then ICS-CERT) published Alert IR-ALERT-H-16-056-01 in February 2016, providing technical analysis of the attack without explicitly naming Russia. Subsequent analysis by multiple cybersecurity firms linked the BlackEnergy malware and attack infrastructure to the Sandworm group, which had previously been associated with Russian military intelligence.

In October 2020, the U.S. Department of Justice indicted six officers of GRU Unit 74455 for their roles in multiple cyberattacks, including the 2015 and 2016 Ukraine power grid attacks, NotPetya, the 2018 Olympic Destroyer malware, and other operations. The indictment identified the defendants by name and detailed their specific roles in the Sandworm team's operations.

The Government of Ukraine's Security Service (SBU) attributed the attack to Russia shortly after the incident, and multiple NATO member governments have endorsed this attribution.

## Timeline

### 2015-06-01 — Initial Compromise

Spearphishing emails delivered BlackEnergy malware to employees at Ukrainian electricity distribution companies, establishing persistent access.

### 2015-12-23 — Coordinated Power Grid Attack

At approximately 3:35 PM local time, attackers remotely opened circuit breakers at distribution substations across three Ukrainian utilities, cutting power to approximately 230,000 customers.

### 2015-12-23 — KillDisk Deployment

Wiper malware was deployed to destroy evidence and delay recovery. Firmware on serial-to-Ethernet converters was overwritten.

### 2015-12-24 — Power Restored

Utility operators completed manual restoration of power at affected substations within one to six hours of the attack.

### 2016-02-25 — CISA Alert Published

CISA published ICS Alert IR-ALERT-H-16-056-01 providing technical analysis of the Ukraine power grid attack.

### 2016-12-17 — Second Ukraine Power Grid Attack

A second cyberattack struck the Ukrainian power grid, this time using the Industroyer/CrashOverride malware against Ukrenergo's transmission-level infrastructure.

### 2020-10-19 — DOJ Indictment

The U.S. Department of Justice indicted six GRU officers for the Ukraine power grid attacks and other Sandworm operations.

## Remediation & Mitigation

The Ukraine power grid attack provided critical lessons for the global energy sector. Key mitigations include implementing strict network segmentation between corporate IT and operational technology environments, deploying application whitelisting on SCADA workstations and servers, implementing multi-factor authentication for all remote access to OT networks, and monitoring for unauthorized access to SCADA systems.

Organizations operating industrial control systems should disable unnecessary macro execution in office applications, implement VPN access controls with multi-factor authentication, maintain manual override capabilities for critical operational processes, and develop incident response plans that account for simultaneous cyber and physical operations.

The attack demonstrated the value of maintaining manual operating capabilities. The Ukrainian utilities were able to restore power through manual breaker operation because their infrastructure supported manual control. Highly automated systems without manual fallback procedures may be more vulnerable to this class of attack.

CISA's industrial control system security guidance, including the NIST Cybersecurity Framework for critical infrastructure, provides detailed recommendations for securing energy sector OT environments.

## Sources & References

- [CISA: ICS Alert IR-ALERT-H-16-056-01 — Cyber-Attack Against Ukrainian Critical Infrastructure](https://www.cisa.gov/news-events/ics-alerts/ir-alert-h-16-056-01) — CISA, 2016-02-25
- [MITRE ATT&CK: Sandworm Team](https://attack.mitre.org/groups/G0034/) — MITRE, 2019-01-01
- [Booz Allen Hamilton: When the Lights Went Out — Ukraine Cybersecurity Threat Briefing](https://www.boozallen.com/content/dam/boozallen/documents/2016/09/ukraine-report-when-the-lights-went-out.pdf) — Booz Allen Hamilton, 2016-09-01
- [DOJ: Six Russian GRU Officers Charged](https://www.justice.gov/opa/pr/six-russian-gru-officers-charged-connection-worldwide-deployment-destructive-malware-and) — U.S. Department of Justice, 2020-10-19
