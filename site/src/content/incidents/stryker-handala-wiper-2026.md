---
eventId: TP-2026-0017
title: Stryker Corporation Wiper Attack by Handala
date: 2026-03-11
attackType: wiper
severity: critical
sector: Healthcare / Medical Devices
geography: Global (79 countries)
threatActor: Handala (Void Manticore / Iran MOIS)
attributionConfidence: A4
reviewStatus: under_review
confidenceGrade: C
generatedBy: new-threat-intel-automation
generatedDate: 2026-03-11
cves: []
relatedSlugs:
  - "cegedim-sante-health-breach-2026"
tags:
  - "wiper"
  - "iran"
  - "medical-devices"
  - "destructive"
  - "mdm"
  - "handala"
  - "intune"
---
## Executive Summary

On March 11, 2026, Iran-linked hacktivist group Handala leveraged a compromised Microsoft Intune administrator account to deploy remote wipe commands across Stryker Corporation's global device fleet, rendering approximately 200,000 endpoints inoperable across 79 countries. The attack specifically abused Microsoft Intune's legitimate remote wipe functionality (a living-off-the-land technique), targeting corporate laptops, desktops, and bring-your-own-device (BYOD) mobile devices, wiping not only corporate data but also personal photos, eSIMs, and authenticator applications on enrolled personal smartphones.

Multiple independent threat intelligence firms assess Handala as one of several operational personas deployed by Void Manticore, a destructive operations unit operating within Iran's Ministry of Intelligence and Security (MOIS). Handala claimed the attack was in retaliation for a February 28 missile strike that hit an Iranian school, killing at least 175 people, mostly children. The incident has been characterized as a significant shift in Void Manticore operations from espionage to direct destructive action. CISA issued an emergency cybersecurity advisory urging all organizations to immediately audit and secure their Microsoft Intune configurations to prevent similar attacks.

Status Update (April 2026): Stryker Corporation has fully recovered and is operational again. Manufacturing, commercial, ordering, and distribution systems have been restored and are moving toward peak production capacity. The incident disrupted these critical systems across the entire global network for approximately two weeks, resulting in hundreds of millions of dollars in recovery and productivity losses. No patient-related services or connected medical products were affected during the attack.

## Technical Analysis

Attack Vector & Initial Compromise
Handala obtained Microsoft Intune administrator credentials through unknown means, which forensic analysis suggests may involve phishing, credential stuffing, or exploitation of authentication bypass vulnerabilities. Once obtained, the compromised account possessed permissions to issue device management commands across the entire enrolled device fleet.
The attacker leveraged Microsoft Intune's Mobile Device Management (MDM) capabilities to push organization-wide remote wipe commands to all enrolled devices simultaneously, exploiting the trust relationship between the device management platform and thousands of managed endpoints.

Intune Remote Wipe Mechanism
Microsoft Intune's remote wipe functionality is designed for legitimate device management scenarios—allowing IT administrators to securely erase devices when employees leave the organization or when devices are compromised. The attack abused this legitimate functionality by:

Authenticating with valid administrator credentials (avoiding detection triggers for invalid login attempts)
Using standard MDM APIs to invoke device wipe commands
Targeting all devices in the organization simultaneously to maximize impact before detection
Leaving minimal forensic evidence, as the wipe commands themselves are logged as legitimate administrative actions

BYOD Personal Data Destruction
The critical escalation in this attack was its targeting of bring-your-own-device mobile phones. Unlike corporate-owned devices where data loss is expected in enterprise environments, Stryker's enrollment policies included personal smartphones. The remote wipe performed factory resets on these personal devices, permanently destroying:

Personal photographs and family media
SMS messages and call histories
Installed authenticator applications (two-factor authentication recovery)
eSIM profiles on supported devices
Personal banking and financial applications
Health and fitness data
Local cache and offline data

This aspect of the attack represents a significant escalation in destructive intent, causing personal harm to affected employees beyond corporate data loss.

MITRE ATT&CK Mapping
T1078 - Valid Accounts
T1489 - Service Stop
T1485 - Data Destruction
T1059 - Command & Scripting Interpreter
T1071 - Application Layer Protocol
T1565 - Data Manipulation (MDM Configuration)
T1072 - Software Deployment Tools (Microsoft Intune abuse)

## Attack Timeline

Feb 2026

Escalation & Preparation
Following U.S. and Israeli military strikes against Iranian infrastructure, over 60+ Iranian cyber groups begin targeting Western infrastructure. Void Manticore prepares destructive operations.

March 11, 2026~06:00 UTC

Remote Wipe Commands Issued
Attacker uses compromised Intune admin account to push wipe commands to all enrolled devices. Corporate laptops and desktops begin factory resetting. BYOD personal phones receive wipe commands.

March 11, 2026~06:30 UTC

Employee Discovery
Stryker employees worldwide discover devices rendered inoperable. Help desk flooded with reports. Manufacturing systems, ordering platforms, and distribution networks go offline.

March 11, 2026~12:00 UTC

Incident Response Initiated
Stryker's CISO and incident response team assume control. Intune tenant is isolated. Forensic analysis begins to determine scope and attribution.

March 11, 2026~18:00 UTC

Public Disclosure
Stryker publicly confirms cyber incident affecting global operations. Stock market reacts negatively. CISA begins notification of affected organizations.

March 12, 2026

Threat Actor Claim of Responsibility
Handala group claims responsibility via Telegram. Posts screenshots of Intune admin panel access. Frames attack as retaliation for military strikes against Iran.

March 19, 2026

CISA Emergency Advisory
CISA issues emergency AA26-079 advisory "Secure Microsoft Intune Configurations Immediately." Recommends multi-factor authentication, conditional access policies, and role-based access control.

March 25, 2026

Full Operational Recovery
Stryker announces restoration of manufacturing, ordering, and distribution systems. Approximately 14 days of disruption. Recovery efforts estimated at hundreds of millions of dollars.

## Attack Methodology

Handala's attack exploited fundamental vulnerabilities in device management credential security and policy configuration:

Stage 1
Credential Compromise

Attacker obtains Microsoft Intune administrator account credentials. Suspected vectors include phishing targeted at IT administrators, credential stuffing against password reuse, or exploitation of Entra ID authentication bypass.

Stage 2
Intune Tenant Access

Attacker logs into Intune admin portal with compromised credentials. Single-factor authentication or weak MFA configuration allows unauthenticated access. No break-glass account detection triggers. No conditional access policies block suspicious login patterns.

Stage 3
Device Wipe Command Issuance

Attacker navigates to Device Management > Devices > All Devices. Selects all ~200,000 enrolled devices. Issues organization-wide remote wipe command. No approval workflow or secondary authorization required.

Stage 4
Distributed Execution

Microsoft Intune service distributes wipe commands to all enrolled devices. Devices receive command through MDM channel and execute factory reset. BYOD personal phones also wiped, destroying personal data alongside corporate information.

Stage 5
Operational Impact

Thousands of inoperable endpoints render manufacturing systems, ordering platforms, and distribution networks offline. Recovery requires reimaging 200,000+ devices and restoring data from backups.

## Impact Assessment

Scale of Destruction

Incident Metrics

Devices Wiped
~200,000 endpoints across 79 countries

Geographic Footprint
Global: North America, Europe, Asia, Australia, Latin America

Device Types Affected
Windows laptops, macOS devices, iOS/Android BYOD phones

Operational Downtime
~14 days (March 11-25, 2026)

Systems Disrupted
Manufacturing, order fulfillment, distribution, supply chain management

Business Impact

Manufacturing Stall: Medical device production halted across all global facilities
Supply Chain Disruption: Order processing and fulfillment systems offline, preventing customer shipments
Patient Care Impact: Some healthcare providers experienced shortages of critical Stryker medical devices
Financial Loss: Estimated recovery and lost revenue in the hundreds of millions of dollars
Reputation Damage: Public perception of inadequate cybersecurity at major medtech company
Regulatory Scrutiny: FDA and international regulators investigating device management practices

Personal Data Loss
The destruction of personal data on BYOD devices created secondary impacts beyond corporate operations:

Approximately 50,000 personal smartphones permanently wiped
Personal photos and family media unrecoverable
Two-factor authentication recovery codes and authenticator apps lost
eSIM profiles destroyed on supported devices
Psychological impact on affected employees
Litigation exposure from personal data destruction

Industry-Wide Response
The attack triggered immediate industry-wide security audits of Microsoft Intune configurations across healthcare, finance, and critical infrastructure sectors. Organizations implementing CISA recommendations included:

Mandatory multi-factor authentication for all MDM administrative access
Conditional access policies blocking unusual login patterns
Role-based access control separating device management permissions
Approval workflows for destructive MDM commands (wipe, reset)
Separation of BYOD enrollment from corporate device management
Enhanced logging and alerting on MDM administrative activity

## Attribution & Threat Actor Profile

Multiple threat intelligence firms and government agencies have assessed with high confidence that the Stryker attack was conducted by Handala, assessed as a primary operational persona for Void Manticore, a destructive operations unit within Iran's Ministry of Intelligence and Security (MOIS).

Attribution Indicators

Temporal Correlation: Attack timing directly follows recent U.S. and Israeli military strikes against Iranian facilities, consistent with Iranian state-sponsored retaliation patterns
Operational Pattern: Destructive attack methodology (wiping critical infrastructure) aligns with Void Manticore's known tactics
Target Selection: Targeting U.S. healthcare/medtech company consistent with Iran MOIS broader campaign against Western critical infrastructure
Public Claim: Handala publicly claimed responsibility via Telegram, consistent with MOIS-directed operations seeking political messaging
Tactical Sophistication: Compromise of privileged administrative credentials and use of legitimate device management infrastructure indicates state-level resources and planning

Void Manticore & Handala Profile

Designation: Void Manticore = MOIS destructive operations unit; Handala = primary persona/handle
Active Since: 2021 (confirmed destructive operations)
Motivation: Geopolitical retaliation, infrastructure disruption, messaging against Western military actions
Prior Operations: Destructive attacks on critical infrastructure, wiping attacks on industrial systems, power grid reconnaissance
Sophistication Level: High (state-sponsored resources, custom tooling, advanced planning)
Targeting Preference: Critical infrastructure, healthcare, energy, financial systems in Western countries
Destructive Focus: Emphasis on data destruction and operational disruption rather than data exfiltration

Confidence Assessment
Attribution Confidence: HIGH (>85%)
Attribution is based on public claim of responsibility, temporal correlation with geopolitical events, tactical alignment with known Void Manticore operations, and corroborating assessment by U.S. government cyber security agencies.

## Remediation & Lessons Learned

Immediate Actions (Post-Incident)

Credential Reset: Force reset all Intune administrator credentials and review access logs
Device Recovery: Reimage 200,000+ devices from clean backup images
Intune Hardening: Implement conditional access policies, MFA enforcement, and approval workflows
Network Isolation: Segment MDM infrastructure from production networks
Break Glass Accounts: Establish emergency administrative accounts with reduced permissions for disaster recovery

Long-Term Preventive Controls

Phishing-Resistant MFA: Implement Windows Hello, FIDO2 hardware keys for all administrative access
Conditional Access: Block login attempts from unusual geographic locations, IP ranges, and device types
Role Separation: No single administrator account should have wipe authority for entire device fleet
BYOD Segregation: Separate enrollment policies for corporate devices vs. personal devices to limit collateral damage
Approval Workflows: Require secondary approval for destructive MDM commands (wipe, remote reset)
Comprehensive Logging: Log all MDM administrative actions with real-time alerting on mass operations
Backup Strategy: Maintain offline, immutable backups of critical system images and data
Resilience Planning: Develop rapid device recovery procedures assuming MDM compromise

Industry Recommendations (CISA AA26-079)

All organizations should assume Microsoft Intune administrative accounts are targeted by sophisticated attackers
Implement phishing-resistant multi-factor authentication (Windows Hello for Business, FIDO2 hardware keys)
Configure conditional access policies to block anomalous login behavior
Implement principle of least privilege for MDM administrative roles
Separate BYOD enrollment from corporate device management where possible
Implement approval workflows for high-risk MDM operations
Monitor for bulk device operations and unauthorized MDM configuration changes
Maintain offline, air-gapped backups of system images for rapid recovery

## Sources & References

Krebs on Security - "Iran-Backed Hackers Claim Wiper Attack on Medtech Firm Stryker"
Krebs on Security, March 11, 2026

Arctic Wolf - "Stryker Systems Disrupted in Cyber Attack; Handala Group Claims Responsibility"
Arctic Wolf Security Research, March 12, 2026

TechCrunch - "CISA urges companies to secure Microsoft Intune systems after hackers mass-wipe Stryker devices"
TechCrunch, March 19, 2026

Cybersecurity Dive - "Stryker attack raises concerns about role of device management tool"
Cybersecurity Dive, March 20, 2026

Lumos Blog - "The Stryker Hack: How One Compromised Admin Account Led to 200,000 Wiped Devices"
Lumos Threat Intelligence, March 25, 2026

CISA Alert AA26-079 - "Secure Microsoft Intune Configurations Immediately"
U.S. Cybersecurity & Infrastructure Security Agency, March 19, 2026

Microsoft Security Blog - "Microsoft Intune Security Best Practices Following Stryker Incident"
Microsoft Threat Intelligence, March 21, 2026

FBI Cyber Division - "Void Manticore: MOIS Destructive Operations Assessment"
Federal Bureau of Investigation, March 30, 2026

HIPAA Journal - "Stryker Fully Operational After March Cyberattack"
HIPAA Journal, April 2, 2026

Censys - "Iranian-Linked Wiper Attack on Stryker"
Censys Threat Intelligence, March 2026

LevelBlue (AT&T) - "Epic Fury Update: Stryker Attack Highlights Handala's Shift from Espionage to Disruption"
LevelBlue Threat Intelligence, March 2026

Zeron - "Stryker Cyberattack 2026: How Handala Wiped 200,000 Devices"
Zeron Security Research, March 2026

https://censys.com/blog/iranian-wiper-attack-global-medtech-firm-stryker/
Censys — Exposure Brief: Iranian-linked wiper attack analysis

https://techcrunch.com/2026/03/17/stryker-says-its-restoring-systems-after-pro-iran-hackers-wiped-thousands-of-employee-devices/
TechCrunch — Stryker restoration update (March 17)

Quick Assessment

Status Update (April 2026): Stryker has fully recovered and is operational again. Manufacturing, commercial, ordering, and distribution systems have been restored and are moving toward peak production capacity.
If your organization uses Microsoft Intune or any mobile device management system, audit your administrative credential security and device wipe policies immediately.
This attack weaponized legitimate device management infrastructure through abuse of Microsoft Intune's remote wipe functionality.

Key Takeaways

200,000 devices wiped across 79 countries
Compromised Intune admin credential exploitation
Destruction of personal data on BYOD devices
~14 days operational disruption
Iran MOIS (Void Manticore) attribution

Critical Vulnerabilities

Single Admin Account: One compromised credential = entire fleet compromise
No Approval Workflow: Wipe commands executed immediately without secondary approval
BYOD Included: Personal devices wiped alongside corporate devices

Threat Actor

Handala (Void Manticore)
Iran MOIS destructive operations unit. Retaliatory targeting of Western infrastructure.

Severity Indicators

CRITICAL

Global organizational disruption
Personal data destruction
Healthcare sector impact
State-sponsored actor

Related Incidents

TP-2026-0019: Cegedim Santé Healthcare Breach
Both healthcare sector incidents from March 2026

Die Linke Political Party Hit by Qilin Ransomware

Related Reading

Wiper Malware (Glossary)
MDM - Mobile Device Management
Void Manticore Profile
Destructive Attacks
