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
reviewStatus: "draft_human"
confidenceGrade: A
generatedBy: "kernel-k"
generatedDate: 2026-04-17
cves: []
relatedIncidents:
  - "ukraine-power-grid-attack-2015"
  - "ukraine-power-grid-industroyer-2016"
  - "notpetya-wiper-attack-2017"
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
    accessDate: "2026-04-17"
    archived: false
  - url: "https://www.justice.gov/opa/pr/six-russian-gru-officers-charged-connection-worldwide-deployment-destructive-malware-and-other"
    publisher: "U.S. Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2020-10-19"
    accessDate: "2026-04-17"
    archived: false
  - url: "https://www.welivesecurity.com/2017/06/12/industroyer-biggest-threat-industrial-control-systems-since-stuxnet/"
    publisher: "ESET"
    publisherType: vendor
    reliability: R1
    publicationDate: "2017-06-12"
    accessDate: "2026-04-17"
    archived: false
  - url: "https://attack.mitre.org/campaigns/C0028/"
    publisher: "MITRE ATT&CK"
    publisherType: research
    reliability: R1
    publicationDate: "2025-04-16"
    accessDate: "2026-04-17"
    archived: false
mitreMappings:
  - techniqueId: "T0822"
    techniqueName: "External Remote Services"
    tactic: "Lateral Movement"
    notes: "Sandworm used stolen VPN and remote access paths to reach power utility control environments."
  - techniqueId: "T0823"
    techniqueName: "Graphical User Interface"
    tactic: "Execution"
    notes: "Operators used SCADA HMIs to interact directly with breaker controls during the 2015 outage."
  - techniqueId: "T0831"
    techniqueName: "Manipulation of Control"
    tactic: "Impact"
    notes: "The campaign opened breakers and disrupted electrical service through direct control actions."
  - techniqueId: "T0814"
    techniqueName: "Denial of Service"
    tactic: "Impact"
    notes: "Telephone denial-of-service activity interfered with outage reporting during the 2015 attack."
---

## Executive Summary

The Sandworm Ukraine power grid campaign spans the December 2015 and December 2016 attacks on Ukrainian electric infrastructure. Together, these operations established the first and second widely documented cyber-induced power outages and marked a transition from theoretical discussion of cyber-physical grid disruption to an operational reality. The campaign is historically important not because it was noisy or broad, but because it showed a capable state actor could pair enterprise intrusion tradecraft with deliberate operational impact in the electric sector.

The 2015 phase used BlackEnergy-associated access, stolen credentials, SCADA operator workflows, KillDisk, and call-center disruption to cut power to roughly 225,000 customers. The 2016 phase built on that experience with Industroyer/CrashOverride, a purpose-built ICS malware framework designed to interact with electric-sector protocols directly. U.S. Department of Justice charging documents later attributed both attacks to GRU Unit 74455, the Sandworm team.

## Technical Analysis

The 2015 attack relied on a patient progression from enterprise intrusion to operational disruption. Sandworm gained initial access through targeted phishing, harvested credentials, moved through corporate networks, and then used legitimate remote access paths into the operational environment. Once on the day of action arrived, the operators used the same SCADA interfaces that utility staff used, opening breakers manually rather than relying on exotic malware to perform the switching itself.

That first attack paired operational disruption with recovery denial. KillDisk damaged Windows systems and erased evidence, while serial-to-Ethernet devices were tampered with to slow remote restoration. The parallel telephone denial-of-service against call centers added confusion and impeded situational awareness for both customers and operators.

The 2016 phase showed a sharper ICS toolset. Industroyer/CrashOverride contained protocol-aware modules built to speak directly to electric utility equipment over IEC 104, IEC 61850, and related protocols. That reflected a shift from compromise plus operator interaction toward compromise plus purpose-built industrial malware, which is why the combined campaign matters as an arc of tradecraft maturity rather than as two isolated outages.

## Attack Chain

### Stage 1: Initial Compromise

Sandworm used phishing and enterprise intrusion tradecraft to establish a foothold inside targeted Ukrainian utility environments.

### Stage 2: Credential Harvesting and Remote Access

The operators collected credentials, mapped access paths, and leveraged remote administration and VPN channels into systems supporting grid operations.

### Stage 3: Control Environment Familiarization

Before outage execution, the attackers studied utility workflows and the SCADA interfaces needed to operate breakers and supporting equipment.

### Stage 4: Outage Execution

In 2015, operators manually opened breakers through SCADA HMIs. In 2016, Industroyer automated control actions through industrial protocols.

### Stage 5: Recovery Denial and Cleanup

KillDisk, device tampering, and phone-line disruption were used to slow recovery, degrade visibility, and complicate response.

## MITRE ATT&CK Mapping

### Lateral Movement

T0822 - External Remote Services: Sandworm used stolen remote-access pathways to reach control systems from compromised enterprise environments.

### Execution

T0823 - Graphical User Interface: The 2015 phase depended on direct operator use of SCADA HMIs to manipulate live infrastructure.

### Impact

T0831 - Manipulation of Control: The campaign's core effect came from opening breakers and disrupting electric service.

T0814 - Denial of Service: Call-center disruption compounded the operational impact and hindered outage reporting.

## Timeline

### 2015-12-23 - BlackEnergy-Linked Grid Attack Causes Regional Outages

Sandworm cut power to multiple Ukrainian distribution companies, affecting roughly 225,000 customers and forcing manual restoration.

### 2016-02-25 - CISA Publishes Technical Alert

CISA documented the 2015 intrusion chain and the operational lessons from the outage.

### 2016-12-17 - Industroyer Phase Targets Kyiv Transmission Infrastructure

Sandworm used Industroyer/CrashOverride to automate disruptive actions against another Ukrainian power target.

### 2017-06-12 - Public Technical Analysis of Industroyer Emerges

Independent security researchers published detailed analysis of the 2016 malware and its industrial protocol logic.

### 2020-10-19 - U.S. DOJ Indicts Sandworm Operators

The Justice Department tied both the 2015 and 2016 power-grid attacks to GRU Unit 74455.

## Remediation & Mitigation

The campaign remains one of the clearest arguments for treating OT security as an operational resilience problem, not just an IT control problem. Grid operators need segmented enterprise-to-OT boundaries, stronger controls on remote access, multifactor protection for engineering pathways, logging that survives workstation destruction, and clear playbooks for manual operations when digital control is degraded.

The 2015 and 2016 cases also show why defenders should prepare for multi-layered disruption. Protecting SCADA and substation equipment matters, but so does protecting recovery systems, supporting communications, and the devices that make remote restoration possible. Detection engineering should watch for unauthorized remote sessions into ICS environments, unusual access to engineering workstations, and any signs that industrial protocol traffic is originating from systems or times that do not match operational norms.

## Sources & References

1. [CISA: Cyber Attack Against Ukrainian Critical Infrastructure](https://www.cisa.gov/news-events/alerts/2016/02/25/cyber-attack-against-ukrainian-critical-infrastructure) - CISA, 2016-02-25
2. [U.S. Department of Justice: Six Russian GRU Officers Charged in Connection with Worldwide Deployment of Destructive Malware and Other Disruptive Actions in Cyberspace](https://www.justice.gov/opa/pr/six-russian-gru-officers-charged-connection-worldwide-deployment-destructive-malware-and-other) - U.S. Department of Justice, 2020-10-19
3. [ESET: Industroyer - The Biggest Threat to Industrial Control Systems Since Stuxnet](https://www.welivesecurity.com/2017/06/12/industroyer-biggest-threat-industrial-control-systems-since-stuxnet/) - ESET, 2017-06-12
4. [MITRE ATT&CK: 2015 Ukraine Electric Power Attack (C0028)](https://attack.mitre.org/campaigns/C0028/) - MITRE ATT&CK, 2025-04-16
