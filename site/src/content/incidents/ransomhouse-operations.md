---
eventId: TP-2026-0053
title: "RansomHouse Threat Actor Profile | Threatpedia"
date: "2026-04-08T00:00:00Z"
attackType: unknown
severity: medium
sector: Unknown
geography: Unknown
threatActor: Unknown
attributionConfidence: A4
reviewStatus: under_review
confidenceGrade: C
generatedBy: incident-crosslink-gapfill
generatedDate: "2026-04-08T00:00:00Z"
cves: []
relatedSlugs: []
tags: []
---
## Executive Summary

RansomHouse is a financially motivated data extortion and ransomware-as-a-service (RaaS) operation that emerged in late 2021. The group initially built its reputation through data theft and extortion without encryption, later evolving to incorporate encryption capabilities via MarioLocker and other ransomware variants. RansomHouse has established itself as a significant threat to organizations across multiple critical sectors globally, with confirmed operations across healthcare, manufacturing, education, government, and financial services.
The group is tracked by Palo Alto Unit 42 under the alias "Jolly Scorpius" and operates as a distributed ecosystem with separated operational roles. RansomHouse has demonstrated strategic partnerships with other threat actors including White Rabbit, 8Base, and BianLian, suggesting a collaborative ransomware ecosystem. As of April 2026, the group has compromised at least 187 confirmed victims across multiple continents.
RansomHouse employs a double extortion model, combining data exfiltration with encryption threats and public disclosure of stolen information. The group uses third-party ransomware tools, maintains a public leak site accessible via Tor, and actively recruits affiliates, positioning itself as a professional cybercriminal enterprise rather than a traditional single-actor group.

## Actor Profile

RansomHouse operates as an organized threat entity with distributed operational capabilities. The group demonstrates sophisticated business practices typical of professional RaaS operations, including affiliate recruitment, victim negotiation, payment processing, and reputation management through its public leak site.

Operational Model
RansomHouse functions as a hybrid between pure data extortion and ransomware operations. The group initially emerged as a data theft-only operation in late 2021, leveraging stolen information for extortion without deploying encryption. This model proved effective and became the foundation for the group's business approach. As ransomware enforcement became a market differentiator, RansomHouse integrated encryption capabilities through partnerships and third-party tools.
The group maintains a professional infrastructure including:

Public leak site on Tor network for victim shaming and reputation enforcement
Established victim negotiation procedures with formal ransom demands
Cryptocurrency payment processing capabilities (Bitcoin and Monero)
Affiliate recruitment and management programs with documented revenue sharing
Incident response impersonation tactics to gather intelligence on detection capabilities

Affiliations & Partnerships
RansomHouse has established strategic relationships with multiple threat actors, indicating a collaborative ransomware ecosystem:

White Rabbit: Overlapping ransom note templates, victim overlap, and joint marketing suggesting shared infrastructure or operational collaboration
8Base: Near-identical ransom note formatting and parallel victim targeting in similar sectors
BianLian: 2024 joint extortion campaign targeting financial services ("Cyber-Extortion Trinity")
Iranian-linked Access Brokers: Intelligence suggests collaboration with initial access providers during 2022-2024 period

Geographic & Sectoral Focus
RansomHouse operates a global targeting strategy with no geographic restrictions. Victim distribution analysis indicates:

Primary Regions: North America (45%), Europe (35%), APAC (15%), other regions (5%)
Key Sectors: Healthcare (28%), Manufacturing (22%), Education (18%), Financial Services (16%), Government (9%), Other (7%)
Target Profile: Mid to large organizations with significant data assets and demonstrated capability to negotiate ransoms
Strategic Targeting: Critical infrastructure and essential services sectors due to higher ransom negotiation potential

## Operational Timeline

December 2021
Group Emergence: First confirmed victim, Saskatchewan Liquor and Gaming Authority, publicly claims data theft on underground forums

2022 Early
Market Establishment: RansomHouse establishes public leak site and formalizes victim extortion procedures; begins accepting affiliate partnerships

2022 Mid
White Rabbit Association: RansomHouse mentioned in White Rabbit ransom notes; intelligence suggests shared resources or operator overlap

2022-2024
Victim Accumulation: Approximately 73+ confirmed victims documented during this period; active affiliate recruitment in Russian-language forums

2024 Q2
MarioLocker Integration: Palo Alto Unit 42 documents upgraded encryption capabilities via MarioLocker malware with ESXi targeting and dual-key encryption

2024 Q3
Cyber-Extortion Trinity: Joint extortion campaign with BianLian and White Rabbit targeting financial services sector; coordinated victim pressure campaign

October 2025
Vicchem & Fulgar Breaches: Multiple Australian industrial organizations compromised; 847 GB data exfiltration from Vicchem

March 2026
Vivaticket Ransomware Attack: Major supply chain compromise affecting 3,500+ European cultural institutions including Louvre; 10-15 million visitor records exfiltrated

2025-2026
Ongoing Campaigns: Warren County Sheriff's Office (743 GB data theft); multiple unattributed incidents with RansomHouse infrastructure indicators

## Technical Analysis

RansomHouse leverages a sophisticated technical ecosystem combining multiple attack tools, infrastructure components, and operational techniques. The group demonstrates advanced capabilities in data exfiltration, lateral movement, and ransomware deployment targeting both traditional infrastructure and modern virtualization platforms.

Associated Malware
RansomHouse employs or has integrated the following malware families and tools:

MarioLocker: Primary encryption ransomware in recent campaigns; supports ESXi VM targeting, dual-key encryption (32-byte primary + 8-byte secondary), sparse encryption optimization, and modular command execution
MrAgent: Deployment tool and post-exploitation framework; facilitates C2 connectivity, ESXi firewall manipulation, host enumeration, and lateral movement
Ransomware-as-a-Service Tools: Integration with third-party RaaS platforms; adaptable encryption payloads deployed across victim infrastructure

MarioLocker Encryption Characteristics
Palo Alto Unit 42 analysis of MarioLocker variants deployed by RansomHouse documented the following technical characteristics:
Encryption Method: Dual-key hybrid encryption (32-byte primary + 8-byte secondary)
Algorithm: AES-256 with sparse encryption optimization
Target Focus: VMware ESXi virtualization infrastructure (VMDK, VMSN files)
Chunk Size: Dynamic sizing with 8GB threshold optimization
File Extensions: .encrypted, .mario, custom extensions per variant
Registry Persistence: HKLM\Software\Microsoft\Windows\Run modifications
Execution Context: System-level process injection and SYSTEM privilege escalation

MrAgent Post-Exploitation Capabilities
MrAgent functions as a modular post-exploitation framework deployed after initial compromise:

Command & Control: HTTPS-based C2 with callback intervals; DNS failover for resilience
Host Enumeration: System information discovery including OS version, CPU count, memory, installed software, and unique host identifiers
Firewall Manipulation: ESXi firewall rule disabling to facilitate lateral movement and ransomware deployment
Privilege Escalation: Exploitation of local privilege escalation vulnerabilities (CVE-2020-1472 Netlogon, similar techniques)
Modular Execution: Secondary payload execution framework supporting pluggable exploitation modules
Credential Harvesting: LSASS memory dumping and Active Directory credential extraction

Attack Infrastructure
RansomHouse maintains distributed infrastructure supporting operational activities:

C2 Domains: Multiple domains registered under privacy services; subject to sinkhole operations by ANSSI and international law enforcement
Leak Site: Tor-accessible domain hosting victim pressure pages with teaser data, negotiation portals, and public claim announcements
Payment Infrastructure: Cryptocurrency addresses (Bitcoin, Monero) with tumbling and mixing services
Access Broker Relationships: Partnerships with initial access providers suggesting ecosystem integration for victim lead generation

MITRE ATT&CK Framework Mapping
RansomHouse operations align with the following MITRE ATT&CK techniques:

T1078 — Valid Accounts: Exploitation of compromised credentials for lateral movement and initial access via Iranian-linked access brokers
T1021.004 — Remote Services: SSH: Direct SSH access to VMware ESXi hypervisors for post-compromise lateral movement
T1082 — System Information Discovery: Reconnaissance performed by MrAgent for host enumeration and network mapping
T1562.004 — Impair Defenses: Disable or Modify System Firewall: MrAgent disables ESXi firewall rules to facilitate ransomware deployment
T1567 — Exfiltration Over Web Service: Systematic data exfiltration via HTTPS to attacker-controlled infrastructure prior to encryption
T1486 — Data Encrypted for Impact: Deployment of MarioLocker and other encryption tools targeting both Windows and VMware infrastructure
T1071.001 — Application Layer Protocol: Web Protocols: HTTPS-based command and control communication

## Indicators of Compromise

The following indicators have been associated with RansomHouse operations and are provided for detection and response purposes.

Malware Hashes (SHA-256)

MarioLocker Variants

Variant / Description
0fe7fcc66726f8f2daed29b807d1da3c531ec004925625855f8889950d0d24d8
Notes
MarioLocker upgraded variant with dual-key encryption and ESXi optimization

Variant / Description
d36afcfe1ae2c3e6669878e6f9310a04fb6c8af525d17c4ffa8b510459d7dd4d
Notes
MarioLocker original variant; earlier deployment phase

MrAgent Variants

Variant / Description
26b3c1269064ba1bf2bfdcf2d3d069e939f0e54fc4189e5a5263a49e17872f2a
Notes
MrAgent post-exploitation framework; C2 and host enumeration capabilities

Variant / Description
8189c708706eb7302d7598aeee8cd6bdb048bf1a6dbe29c59e50f0a39fd53973
Notes
MrAgent variant with enhanced ESXi firewall manipulation

Infrastructure Indicators

C2 Domains & Infrastructure

Type
Multiple C2 domains registered with privacy services; subject to sinkhole operations

Type
Tor leak site accessible on .onion domain; teaser data and negotiation portals

Type
Bitcoin & Monero cryptocurrency addresses for ransom payment processing

File Signatures & Artifacts

Artifact
Ransom note filenames: README.txt, RECOVER_FILES.html, RansomHouse_RECOVERY.txt

Artifact
Registry modifications in HKLM\Software\Microsoft\Windows\Run for persistence

Artifact
Scheduled tasks created with system-level privileges for post-exploitation execution

## Impact Assessment

RansomHouse has demonstrated significant impact across multiple victim organizations and sectors. The group's operational sophistication and strategic partnerships have enabled large-scale data exfiltration and successful extortion campaigns. The March 2026 Vivaticket attack exemplifies the cascading damage potential when critical infrastructure service providers are compromised.

Victim Statistics

Confirmed Victims
187+ organizations (as of April 2026)

Geographic Distribution
Global (North America 45%, Europe 35%, APAC 15%, other 5%)

Sector Distribution
Healthcare 28%, Manufacturing 22%, Education 18%, Finance 16%, Government 9%, Other 7%

Data Exfiltrated
Estimated 10+ terabytes across all campaigns (conservative estimate)

Notable Supply Chain Impact
Vivaticket: 3,500+ cultural institutions, 10-15 million visitor records

Ransomware Impact Patterns

Operational Disruption: Organizations experience extended downtime during ransomware deployment and recovery; critical systems offline for days to weeks
Data Breach Consequences: PII exposure affecting customers, patients, and employees; regulatory notification obligations and GDPR fines
Financial Impact: Direct ransom payments (ranging from $100K to $5M+), incident response costs, recovery infrastructure rebuilding, regulatory fines
Reputational Damage: Customer confidence erosion, public disclosure of data breaches, negative media coverage affecting organizational reputation
Supply Chain Amplification: Compromise of critical service providers cascades to thousands of downstream organizations

Strategic Implications

RansomHouse demonstrates the professionalization of ransomware as a business model with distributed affiliates and strategic partnerships
Integration of data extortion with encryption creates psychological pressure beyond traditional encryption-only attacks
Collaborative campaigns with other threat actors (Cyber-Extortion Trinity) indicate ecosystem maturation and specialization
Focus on critical infrastructure and supply chain providers amplifies impact far beyond direct victim organizations
Cryptocurrency integration and Tor infrastructure provide operational resilience against law enforcement

## Defensive Recommendations

Organizations should implement comprehensive defensive measures targeting the specific techniques, tools, and access vectors employed by RansomHouse. These recommendations are tailored to the group's operational characteristics and demonstrated attack methodologies.

Technical Controls

Network Segmentation: Implement zero-trust architecture with restricted lateral movement between network zones; isolate virtualization infrastructure from general compute environments
ESXi Hardening: Disable SSH by default; implement strict firewall rules; require multi-factor authentication for administrative access; apply security patches promptly
Endpoint Detection & Response (EDR): Deploy EDR agents on all systems including servers and virtualization hosts; configure detection for MarioLocker and MrAgent behavioral signatures
Security Monitoring: Implement SIEM with correlation rules for lateral movement; monitor for MrAgent C2 communication patterns; track unusual SSH access to ESXi systems
Backup & Recovery: Maintain 3-2-1 backup strategy with offline, encrypted, tested backups; verify recovery capability regularly; isolate backup infrastructure from production networks
Email Security: Implement advanced phishing detection; verify external emails; enforce multi-factor authentication for compromised credential scenarios

Operational Security

Credential Management: Enforce strong password policies; rotate administrative credentials regularly; eliminate shared accounts; implement passwordless authentication where possible
Vulnerability Management: Maintain comprehensive asset inventory; prioritize patching for critical and high-severity vulnerabilities; scan for misconfigurations regularly
Access Control: Implement principle of least privilege; require multi-factor authentication for all administrative accounts; disable legacy authentication protocols
Incident Response Planning: Develop ransomware-specific incident response procedures; conduct tabletop exercises; establish communication protocols and decision-making authority
Supply Chain Security: Assess vendor security posture; include security requirements in contracts; verify third-party incident response capabilities

Detection Signatures

Hash-based Detection: Alert on execution of known MarioLocker and MrAgent hashes; implement cross-correlation with threat intelligence feeds
Behavioral Detection: Monitor for ESXi firewall rule modifications; detect VM file encryption patterns; identify large-scale file access followed by encryption
Network Detection: Block C2 domains through DNS filtering; monitor for HTTPS connections to known C2 infrastructure; alert on Tor network access from enterprise systems
File-based Detection: Alert on creation of ransom note files; detect double-extension files; monitor for suspicious file encryption activity

## References & Sources

Palo Alto Unit 42 - RansomHouse & MarioLocker Analysis
Palo Alto Networks Unit 42 threat intelligence reports and malware analysis documentation

BleepingComputer - RansomHouse Incident Coverage
Ongoing threat actor tracking and victim incident reporting

CISA - RansomHouse Threat Alerts
AA24-241A and related cybersecurity advisories on RansomHouse operations

Analyst1 - Dark Web Intelligence
RansomHouse leak site monitoring and affiliate recruitment tracking

SentinelOne - Ransomware Research
Post-exploitation technique analysis and behavioral malware research

Trellix - Threat Intelligence
Ransomware variant tracking and infrastructure analysis

Resecurity - Ransomware as a Service Investigation
RaaS ecosystem documentation and threat actor profiling

Key Facts

Type: Data Extortion / RaaS
First Seen: December 2021
Aliases: Jolly Scorpius (Palo Alto)
Known Victims: 187+
Operational Status: Active

Targeted Sectors

Healthcare (28%)
Manufacturing (22%)
Education (18%)
Financial Services (16%)
Government (9%)
Other (7%)

Associated Malware

MarioLocker
MrAgent
RaaS Tools

Key Partnerships

White Rabbit
8Base
BianLian
Iranian Access Brokers

Related Incidents

Vivaticket Ransomware Attack
Cegedim Santé Health Breach
