---
campaignId: "TP-CAMP-2023-0001"
title: "CyberAv3ngers IRGC-Affiliated ICS and Water Sector Targeting Campaign"
startDate: 2023-11-01
endDate: 2024-04-30
ongoing: false
attackType: "ICS Exploitation / OT Targeting"
severity: high
sector: "Water and Wastewater"
geography: "Global"
threatActor: "CyberAv3ngers"
attributionConfidence: A2
reviewStatus: "draft_ai"
confidenceGrade: B
generatedBy: "dangermouse-bot"
generatedDate: 2026-05-12
cves: []
relatedIncidents: []
tags:
  - "cyberav3ngers"
  - "irgc"
  - "ics"
  - "ot"
  - "water-sector"
  - "unitronics"
  - "iran"
  - "plc"
  - "critical-infrastructure"
sources:
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-335a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2023-12-01"
    accessDate: "2026-05-12"
    archived: false
  - url: "https://www.cisa.gov/news-events/alerts/2023/11/28/exploitation-unitronics-plcs-used-water-and-wastewater-systems"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2023-11-28"
    accessDate: "2026-05-12"
    archived: false
  - url: "https://www.epa.gov/waterresilience/cybersecurity-water-sector"
    publisher: "U.S. Environmental Protection Agency"
    publisherType: government
    reliability: R1
    publicationDate: "2023-12-01"
    accessDate: "2026-05-12"
    archived: false
  - url: "https://www.waterisac.org/portal/warning-iranian-irgc-cyberav3ngers-water-utility-attacks"
    publisher: "WaterISAC"
    publisherType: community
    reliability: R2
    publicationDate: "2023-11-30"
    accessDate: "2026-05-12"
    archived: false
mitreMappings:
  - techniqueId: "T1595"
    techniqueName: "Active Scanning"
    tactic: "Reconnaissance"
    notes: "CyberAv3ngers used internet-wide scanning to identify Unitronics Vision series PLCs exposed on publicly routable IP addresses, targeting devices in water and wastewater utility environments."
  - techniqueId: "T1078.001"
    techniqueName: "Default Accounts"
    tactic: "Initial Access"
    notes: "Attackers authenticated to Unitronics Vision series PLCs using the default factory password '1111', which many operators had not changed, providing direct access to HMI functions and PLC configuration interfaces."
  - techniqueId: "T1491.001"
    techniqueName: "Internal Defacement"
    tactic: "Impact"
    notes: "After gaining access, operators replaced PLC HMI display panels with anti-Israel messaging. This disrupted operator visibility at affected facilities and was the primary visible impact at confirmed victim sites."
---

## Executive Summary

CyberAv3ngers is an Iran-affiliated threat group linked to the Islamic Revolutionary Guard Corps Cyber-Electronic Command (IRGC-CEC). Beginning in November 2023, the group conducted a targeted campaign against internet-exposed programmable logic controllers (PLCs) used in water and wastewater utilities, with operations documented in the United States, Israel, Ireland, and several other countries. The campaign exploited a straightforward attack vector: Unitronics Vision series PLCs that remained accessible over the public internet using the manufacturer's default password.

On December 1, 2023, a joint advisory (AA23-335A) issued by CISA, the FBI, the NSA, the EPA, and the U.K. National Cyber Security Centre publicly linked the activity to CyberAv3ngers and characterized the group as an IRGC-affiliated actor. The advisory confirmed compromises at water and wastewater facilities and noted that the group targeted equipment manufactured in Israel.

The threat to water services was assessed as low in terms of direct physical impact: public reporting identified no confirmed disruption to water treatment or distribution. Unauthorized access to ICS equipment carrying default credentials, combined with active parameter modification, nonetheless represented a meaningful operational risk requiring immediate response from affected utilities and the broader water sector.

## Technical Analysis

The technical approach CyberAv3ngers used in this campaign was low-sophistication but effective. The group targeted Unitronics Vision series PLCs — Israeli-manufactured industrial controllers deployed widely in water and wastewater facilities. These devices provide human-machine interface (HMI) control of physical processes including pump operations, chemical dosing, and flow monitoring.

The primary attack vector was exploitation of default credentials. Unitronics Vision series PLCs ship with a factory-default password of "1111." Many installations in the water sector had left this default in place on internet-facing deployments, allowing direct access to the device's HMI and configuration functions via the Unitronics proprietary protocol.

The group identified vulnerable targets through internet scanning, likely leveraging publicly available enumeration services to find PLCs running the Unitronics communication protocol on publicly routable addresses. Once authenticated, operators accessed the HMI panel, replaced the display with political messaging, and in some cases modified PLC setpoints or configuration parameters.

No custom malware or novel exploitation technique was attributed to this campaign. The entire access path relied on publicly accessible internet infrastructure, absent network segmentation, and unchanged factory credentials — a combination that reflects a common gap in operational technology (OT) security posture across the water sector. The most prominently reported victim was the Municipal Water Authority of Aliquippa, Pennsylvania, which confirmed on November 25, 2023 that CyberAv3ngers had accessed and defaced a booster station PLC. CISA's advisory confirmed additional victims in the United States, Israel, Ireland, and other countries. The group's stated targeting rationale was anti-Israel rather than critical infrastructure disruption: the operators asserted that equipment manufactured in Israel was a legitimate target, tying Unitronics PLC selection to the manufacturer's Israeli origin.

## Attack Chain

### Stage 1: Target Discovery

The group scanned the internet for Unitronics Vision series PLCs exposed on TCP port 20256 (the default Unitronics PCOM protocol port) or via web-accessible HMI interfaces. Multiple water utility networks had these controllers directly reachable from the public internet without VPN or firewall restriction.

### Stage 2: Authentication Using Default Credentials

Attackers authenticated using the Unitronics factory default password "1111." Many target devices had never had the default password changed, providing immediate access to the controller's HMI, configuration, and operational data without any credential theft or exploitation of software vulnerabilities.

### Stage 3: HMI Defacement

After gaining access, operators replaced the PLC display panel with anti-Israel political messaging: "You have been hacked, Down With Israel. Every equipment 'Made in Israel' is CyberAv3ngers legal target." This action was visible to facility operators and served both a disruptive and a signaling function.

### Stage 4: Parameter Modification

At some compromised installations, the group modified PLC setpoints and configuration values. Water sector operators reported needing to manually switch affected equipment to local manual control while the extent of unauthorized changes was assessed. No confirmed disruption to water treatment or distribution processes was publicly attributed to these modifications.

## MITRE ATT&CK Mapping


T1595 - Active Scanning: The group conducted internet-wide scanning to enumerate Unitronics Vision PLCs exposed on publicly routable addresses, using the Unitronics PCOM protocol port to identify eligible targets in the water sector.


T1078.001 - Default Accounts: Attackers used the Unitronics factory default password "1111" to authenticate directly to internet-exposed PLCs, bypassing the need for credential theft or exploitation of software vulnerabilities.


T1491.001 - Internal Defacement: Compromised PLCs had their HMI display panels replaced with anti-Israel political messaging, disrupting operator visibility and signaling the intrusion to facility staff.

## Timeline

### 2023-11-25 — Municipal Water Authority of Aliquippa Compromise

The first publicly confirmed victim, the Municipal Water Authority of Aliquippa, Pennsylvania, reported that CyberAv3ngers had accessed and defaced a booster station PLC. The facility switched to manual control and water service was not disrupted.

### 2023-11-28 — CISA Alert on Unitronics PLC Exploitation

CISA issued an emergency alert warning water and wastewater utilities about active exploitation of Unitronics Vision series PLCs using default credentials, advising immediate password rotation and network isolation.

### 2023-11-30 — WaterISAC Industry Warning

WaterISAC distributed a sector-specific advisory to water utility members, confirming the IRGC-CEC group's involvement and providing indicators and mitigations for Unitronics deployments.

### 2023-12-01 — Joint Government Advisory AA23-335A Published

CISA, the FBI, the NSA, the EPA, and the U.K. NCSC jointly published Advisory AA23-335A, publicly attributing the campaign to CyberAv3ngers as an IRGC-affiliated group, confirming multi-country victims, and providing technical indicators and recommended mitigations.

### 2024 — Continued Group Activity

CyberAv3ngers continued claiming attacks against industrial control systems into 2024, though the Unitronics water sector campaign's most concentrated documented activity was between November and December 2023.

## Remediation & Mitigation

CISA's joint advisory outlined immediate and longer-term mitigations for water sector operators running Unitronics PLCs. The most critical immediate action was password rotation: any Unitronics Vision series PLC running the default password "1111" had to be treated as potentially compromised and required immediate credential change.

Network isolation was the second priority. Unitronics PLCs and OT devices more broadly should not be directly accessible over the public internet. Recommended controls include placing PLCs behind firewalls with deny-by-default rules, requiring VPN for any remote access, and removing direct TCP port exposure for industrial protocols.

Additional mitigations recommended in the advisory included enabling multifactor authentication where the device supports it, reviewing remote access logs for unauthorized sessions, auditing PLC configuration and setpoints against known-good baselines, and applying available Unitronics firmware updates. Utilities were also advised to back up PLC configuration files to allow rapid restoration after any unauthorized modification.

The campaign reinforced durable OT security principles: internet-exposed industrial control systems with default credentials represent high-risk targets regardless of the perceived likelihood of adversary interest. Water sector operators were urged to complete an asset inventory of internet-connected OT devices and apply network segmentation sufficient to prevent direct internet access to any process control device.

## Sources & References

- [CISA: IRGC-Affiliated Cyber Actors Exploit PLCs in Multiple Sectors, Including U.S. Water and Wastewater Systems Facilities (AA23-335A)](https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-335a) — CISA, 2023-12-01
- [CISA: Exploitation of Unitronics PLCs Used in Water and Wastewater Systems](https://www.cisa.gov/news-events/alerts/2023/11/28/exploitation-unitronics-plcs-used-water-and-wastewater-systems) — CISA, 2023-11-28
- [U.S. Environmental Protection Agency: Cybersecurity for the Water Sector](https://www.epa.gov/waterresilience/cybersecurity-water-sector) — U.S. Environmental Protection Agency, 2023-12-01
- [WaterISAC: Warning — Iranian IRGC CyberAv3ngers Water Utility Attacks](https://www.waterisac.org/portal/warning-iranian-irgc-cyberav3ngers-water-utility-attacks) — WaterISAC, 2023-11-30
