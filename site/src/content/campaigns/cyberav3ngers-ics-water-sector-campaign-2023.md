---
campaignId: "TP-CAMP-2023-0001"
title: "CyberAv3ngers IRGC ICS and Water Sector Targeting Campaign"
startDate: 2023-10-01
endDate: 2024-01-31
ongoing: false
attackType: "ICS Exploitation / Default Credential Abuse"
severity: high
sector: "Water and Wastewater / Critical Infrastructure / Industrial Control Systems"
geography: "United States, Israel, Ireland, Australia, France, Italy"
threatActor: "CyberAv3ngers"
attributionConfidence: A2
reviewStatus: "draft_ai"
confidenceGrade: B
generatedBy: "dangermouse-bot"
generatedDate: 2026-05-13
cves: []
relatedIncidents: []
tags:
  - "cyberav3ngers"
  - "iran"
  - "irgc"
  - "irgc-cec"
  - "ics"
  - "scada"
  - "water-sector"
  - "unitronics"
  - "critical-infrastructure"
  - "plc"
  - "default-credentials"
sources:
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-335a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2023-11-28"
    accessDate: "2026-05-13"
    archived: false
  - url: "https://www.fbi.gov/news/press-releases/fbi-cisa-nsa-epa-issue-advisory-on-irgc-affiliated-cyber-actors"
    publisher: "FBI"
    publisherType: government
    reliability: R1
    publicationDate: "2023-12-01"
    accessDate: "2026-05-13"
    archived: false
  - url: "https://www.waterisac.org/portal/warning-iranian-irgc-cyberav3ngers-water-utility-attacks"
    publisher: "WaterISAC"
    publisherType: research
    reliability: R2
    publicationDate: "2023-11-28"
    accessDate: "2026-05-13"
    archived: false
mitreMappings:
  - techniqueId: "T1078.001"
    techniqueName: "Default Accounts"
    tactic: "Initial Access"
    confidence: confirmed
    evidence: "CISA advisory AA23-335A confirmed that CyberAv3ngers exploited default credentials on internet-exposed Unitronics Vision Series PLCs to gain unauthorized access to water utility control systems."
  - techniqueId: "T1133"
    techniqueName: "External Remote Services"
    tactic: "Initial Access"
    confidence: confirmed
    evidence: "Targeted PLCs were directly internet-accessible on TCP port 20256 (Unitronics PCOM protocol). Operators had not restricted remote management access, enabling direct exploitation without traversing intermediate network barriers."
  - techniqueId: "T1485"
    techniqueName: "Data Destruction"
    tactic: "Impact"
    confidence: confirmed
    evidence: "CyberAv3ngers modified PLC configuration and HMI display screens at compromised facilities. CISA advisory AA23-335A confirmed unauthorized changes to set-points and display content at impacted water utilities."
---

## Executive Summary

CyberAv3ngers, a threat group affiliated with Iran's Islamic Revolutionary Guard Corps Cyber-Electronic Command (IRGC-CEC), conducted a targeted campaign against internet-exposed industrial control systems at water and wastewater utilities beginning in October 2023. The actors exploited default credentials on Unitronics Vision Series programmable logic controllers (PLCs) that were directly accessible over the public internet, gaining unauthorized access to operational technology environments at multiple facilities across the United States and other countries.

On November 28, 2023, CISA issued advisory AA23-335A jointly with the FBI, NSA, EPA, and international partner agencies, documenting the campaign and attributing it to IRGC-CEC. The advisory confirmed at least one publicly acknowledged victim in the United States and noted that devices at water utilities in multiple countries were targeted. The most publicly documented incident involved the Aliquippa Municipal Water Authority in Pennsylvania, where CyberAv3ngers displayed anti-Israel propaganda on an operator interface screen and accessed a booster station PLC.

## Technical Analysis

The campaign exploited a single, well-known security failure: internet-exposed industrial control system components configured with default vendor credentials. Unitronics Vision Series PLCs — programmable logic controllers widely used in water treatment, chemical dosing, and pressure management applications — shipped with a default administrative password of "1111" for the admin account. Facilities that deployed these devices without changing default credentials and without restricting remote network access created conditions that enabled direct access by any actor aware of the default values.

The Unitronics PCOM protocol operates on TCP port 20256 and provides read/write access to PLC programming, configuration, and HMI display content. TCP port 502 (Modbus) was also observed accessible on affected devices. Neither protocol requires strong authentication in default configurations, and neither provides encryption. CISA advisory AA23-335A confirmed that CyberAv3ngers accessed devices via this interface to modify HMI displays and alter configuration parameters.

The campaign did not require development of novel malware, exploitation of unpatched vulnerabilities, or lateral movement through enterprise IT networks. The attack surface was entirely the result of deployment and configuration failures at target facilities.

CyberAv3ngers operated public social media accounts claiming responsibility for attacks against Israeli-linked infrastructure. The group's public communications combined functional access demonstrations with political messaging, consistent with IRGC-CEC operational patterns that blend disruption with information operations.

## Attack Chain

### Stage 1: Target Identification

CyberAv3ngers identified internet-exposed Unitronics Vision Series PLCs using internet scanning. Industrial control system components accessible directly on the public internet without VPN or firewall restrictions can be discovered by querying for banners associated with the Unitronics PCOM protocol or by scanning TCP port 20256 across internet address ranges.

### Stage 2: Default Credential Exploitation

The actors authenticated to exposed devices using default Unitronics administrative credentials. Advisory AA23-335A confirmed that default credentials remained in use on compromised devices. No exploitation of software vulnerabilities was required.

### Stage 3: PLC Configuration Modification

After authenticating, CyberAv3ngers modified PLC configuration and display settings. At the Aliquippa Municipal Water Authority, the actors displayed a message on the operator interface screen asserting that the system had been compromised and referencing anti-Israel messaging. The advisory confirmed that actors also changed set-points on affected devices. No confirmed disruption of water treatment operations or public health impact was documented in government sources for US facilities.

### Stage 4: Public Claims

CyberAv3ngers claimed responsibility for the Aliquippa incident and additional attacks against Israeli-linked water infrastructure via social media. The group's public activity reinforced the campaign's dual purpose of operational intrusion and information operations.

## MITRE ATT&CK Mapping

T1078.001 - Default Accounts: CyberAv3ngers exploited default administrative credentials (admin/1111) on internet-exposed Unitronics Vision Series PLCs to gain initial access to water utility control systems, as confirmed in CISA advisory AA23-335A.

T1133 - External Remote Services: Unitronics PLCs were directly reachable via the public internet on TCP port 20256 (PCOM protocol). Operators had not restricted remote access or required VPN, enabling direct exploitation without traversing intermediate network controls.

T1485 - Data Destruction: CyberAv3ngers modified PLC display configurations and altered set-points at compromised facilities. CISA advisory AA23-335A confirmed unauthorized changes to HMI display content and operational parameters at impacted water utilities.

## Timeline

### 2023-10 — Campaign Activity Begins

CISA advisory AA23-335A states that CyberAv3ngers targeted internet-exposed Unitronics devices at water utilities beginning in or around October 2023. The Aliquippa Municipal Water Authority in Pennsylvania is among the confirmed affected facilities in the United States.

### 2023-11-25 — Aliquippa Incident Reported

The Aliquippa Municipal Water Authority reported that a booster station PLC was accessed by CyberAv3ngers, with an anti-Israel message displayed on the operator interface. Pennsylvania state officials and water authority representatives confirmed the incident publicly.

### 2023-11-28 — CISA Issues Advisory AA23-335A

CISA, jointly with the FBI, NSA, EPA, and cybersecurity agencies from Israel, Australia, France, Italy, and the United Kingdom, published advisory AA23-335A attributing the campaign to IRGC-CEC and directing water utilities to change all default Unitronics credentials, disconnect PLCs from direct internet exposure, and apply available firmware updates.

### 2023-11-28 — WaterISAC Issues Sector Alert

The Water Information Sharing and Analysis Center issued a warning to member water utilities describing the IRGC-affiliated CyberAv3ngers campaign and providing sector-specific defensive guidance.

### 2023-12 — FBI and EPA Issue Joint Guidance

The FBI and EPA issued additional joint guidance reinforcing cybersecurity requirements for public water systems and escalating awareness of the campaign within the water sector.

## Remediation & Mitigation

Organizations operating Unitronics Vision Series PLCs or similar internet-connected OT equipment should apply the following controls documented in CISA advisory AA23-335A:

Change all default passwords on PLC and HMI devices immediately. Do not retain vendor-default credentials in any production environment. Unitronics devices ship with a default admin password of "1111"; this must be changed before deployment and audited on all existing installations.

Remove OT devices from direct internet exposure. Place PLCs behind firewalls and restrict access to authorized personnel using VPN with multi-factor authentication. No industrial control system interface should be directly reachable from the public internet.

Audit internet-facing OT assets using internal network scanning and cross-reference against external internet exposure data. Remove or firewall any exposed devices discovered during the audit.

Apply Unitronics firmware updates as available and monitor vendor security advisories for the Vision Series product line.

Implement network segmentation between IT and OT environments to prevent lateral movement from enterprise networks into control system environments.

Enable logging on OT devices where supported and route logs to a centralized monitoring system with alerting on unauthorized access or configuration changes.

## Sources & References

- [CISA Advisory AA23-335A: IRGC-Affiliated Cyber Actors Exploit PLCs in Multiple Sectors, Including U.S. Water and Wastewater Systems Facilities](https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-335a) — CISA, 2023-11-28
- [FBI: FBI, CISA, NSA, EPA Issue Advisory on IRGC-Affiliated Cyber Actors](https://www.fbi.gov/news/press-releases/fbi-cisa-nsa-epa-issue-advisory-on-irgc-affiliated-cyber-actors) — FBI, 2023-12-01
- [WaterISAC: Warning on Iranian IRGC CyberAv3ngers Water Utility Attacks](https://www.waterisac.org/portal/warning-iranian-irgc-cyberav3ngers-water-utility-attacks) — WaterISAC, 2023-11-28
