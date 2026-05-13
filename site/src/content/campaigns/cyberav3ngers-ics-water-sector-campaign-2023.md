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
    techniqueName: "Valid Accounts: Default Accounts"
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
    evidence: "CyberAv3ngers modified PLC display screens and altered programmable logic controller configurations at compromised facilities. CISA advisory AA23-335A confirmed unauthorized changes to HMI display content at impacted water utilities."
---

## Executive Summary

CyberAv3ngers, a threat group affiliated with Iran's Islamic Revolutionary Guard Corps Cyber-Electronic Command (IRGC-CEC), conducted a targeted campaign against internet-exposed industrial control systems at water and wastewater utilities beginning in October 2023. The actors exploited default credentials on Unitronics Vision Series programmable logic controllers (PLCs) that were directly accessible over the public internet, gaining unauthorized access to operational technology environments at multiple facilities across the United States and other countries.

On November 28, 2023, CISA issued advisory AA23-335A jointly with the FBI, NSA, EPA, and international partner agencies, documenting the campaign and attributing it to IRGC-CEC. The advisory confirmed at least one publicly acknowledged victim in the United States and noted that devices at water utilities in multiple countries were targeted. The most publicly documented incident involved the Aliquippa Municipal Water Authority in Pennsylvania, where CyberAv3ngers displayed anti-Israel propaganda on an operator interface screen and are reported to have gained access to a booster station PLC.

## Background and Attribution

CyberAv3ngers is a threat group publicly linked to Iran's Islamic Revolutionary Guard Corps Cyber-Electronic Command (IRGC-CEC) by the United States government. The joint advisory AA23-335A, signed by CISA, the FBI, NSA, and EPA along with cybersecurity agencies from Israel, Australia, France, Italy, and the United Kingdom, attributed the campaign directly to IRGC-CEC.

The IRGC is a branch of the Iranian armed forces designated as a Foreign Terrorist Organization by the United States. The IRGC-CEC is the cyber operations arm of the IRGC. CyberAv3ngers has operated public social media accounts claiming responsibility for attacks against Israeli-linked infrastructure. The group's activity reflects a pattern of targeting civilian critical infrastructure with mixed destructive and propagandistic intent, consistent with broader Iranian state-sponsored disruption objectives documented in prior reporting.

Attribution confidence is assessed at A2 (confirmed by multiple US and allied government sources with public attribution statements).

## Technical Analysis

The campaign exploited a single, well-known security failure: internet-exposed industrial control system components configured with default vendor credentials. Unitronics Vision Series PLCs — programmable logic controllers widely used in water treatment, chemical dosing, and pressure management applications — shipped with a default administrative password of "1111" for the admin account. Facilities that deployed these devices without changing default credentials and without restricting remote network access created conditions that enabled direct, unauthenticated-equivalent access by any actor aware of the default values.

The Unitronics PCOM protocol operates on TCP port 20256 and provides full read/write access to PLC programming, configuration, and HMI display content. TCP port 502 (Modbus) was also observed accessible on affected devices. Neither protocol requires strong authentication in default configurations, and neither provides encryption. CISA advisory AA23-335A confirmed that CyberAv3ngers accessed devices via this interface to modify HMI displays and alter configuration parameters.

The campaign did not require development of novel malware, exploitation of unpatched vulnerabilities, or lateral movement through enterprise IT networks. The attack surface was entirely the result of deployment and configuration failures at target facilities.

## Attack Chain

### Stage 1: Target Identification

CyberAv3ngers identified internet-exposed Unitronics Vision Series PLCs using internet scanning tools. Industrial control system components accessible directly on the public internet without VPN or firewall restrictions can be discovered through services such as Shodan or Censys by querying for banners associated with the Unitronics PCOM protocol or by scanning the relevant port ranges.

### Stage 2: Default Credential Exploitation

The actors authenticated to exposed devices using default Unitronics administrative credentials. Advisory AA23-335A confirmed that default credentials remained in use on compromised devices. No exploitation of software vulnerabilities was required; authentication succeeded using credentials published in vendor documentation.

### Stage 3: PLC Configuration Modification

After authenticating, CyberAv3ngers modified PLC configuration and display settings. At the Aliquippa Municipal Water Authority, the actors displayed a message on the operator interface screen stating "You have been hacked, Down with Israel. Every equipment 'made in Israel' are CyberAv3ngers' legal target." The advisory noted that actors also changed set-points on affected devices. The extent of any operational impact on water treatment processes was not confirmed in public government statements beyond the HMI modification.

### Stage 4: Persistence and Propagandistic Activity

CyberAv3ngers claimed responsibility for the Aliquippa incident and additional attacks on Israeli-linked water infrastructure on social media. The group's public communications combined functional access demonstrations with political messaging, consistent with IRGC-CEC operational patterns that blend disruption with information operations.

## Target Profile and Impact

The confirmed US victim was the Aliquippa Municipal Water Authority in Pennsylvania, where a booster station PLC was compromised and its display screen altered. US water sector officials noted that affected facilities had in common the use of internet-exposed Unitronics devices with default credentials retained.

Advisory AA23-335A stated that CyberAv3ngers had targeted devices "across multiple countries," and that the campaign affected water utilities in the United States, Israel, Ireland, Australia, France, and Italy. The advisory did not enumerate specific victims beyond the general country scope, and public US government statements did not claim confirmed disruption of water treatment operations at any US facility. Pennsylvania officials stated at the time that no community water safety was affected at Aliquippa.

The Unitronics devices targeted are used in water treatment chemical dosing, pressure regulation, and similar operational functions. Unauthorized modification of set-points in these applications carries potential for public health impact if sustained, though no such impact was confirmed in the period covered by public reporting.

## Government Response

CISA issued advisory AA23-335A on November 28, 2023, jointly with the FBI, NSA, EPA, and partner agencies from Israel, Australia, France, Italy, and the United Kingdom. The advisory directed water utilities to immediately change all default Unitronics passwords, disconnect PLCs from direct internet access, require VPN for remote management, and apply available firmware updates. CISA also issued a broader advisory recommending water utilities audit all OT devices for internet exposure and default credentials.

EPA issued separate guidance reinforcing cybersecurity requirements for public water systems under the Safe Drinking Water Act. The Water Information Sharing and Analysis Center (WaterISAC) issued a sector alert to member utilities.

US law enforcement attributed the activity publicly to IRGC-CEC, consistent with the government's broader posture of public attribution for state-sponsored infrastructure attacks.

## Defensive Guidance

Organizations operating Unitronics Vision Series PLCs or similar OT equipment should apply the following controls documented in CISA advisory AA23-335A:

- Change all default passwords on PLC and HMI devices immediately; do not retain vendor-default credentials in any production environment.
- Remove OT devices from direct internet exposure; place PLCs behind firewalls and restrict access to authorized personnel via VPN with multi-factor authentication.
- Audit internet-facing OT assets using internal network scanning and cross-reference against external internet exposure data; remove or firewall any exposed devices.
- Apply Unitronics firmware updates as available; monitor vendor security advisories for the Vision Series product line.
- Implement network segmentation between IT and OT environments to prevent lateral movement from enterprise networks into control system environments.
- Enable logging on OT devices where supported and route logs to a centralized monitoring system with alerting on unauthorized access or configuration changes.
- Conduct regular tabletop exercises for water sector cyber incidents, including scenarios involving ICS access and set-point modification.
