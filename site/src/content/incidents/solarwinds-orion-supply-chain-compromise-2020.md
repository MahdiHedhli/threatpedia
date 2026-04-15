---
eventId: TP-2020-0001
title: "SolarWinds Orion Supply Chain Compromise (SUNBURST)"
date: 2020-12-13
attackType: Supply Chain
severity: critical
sector: Government
geography: United States
threatActor: APT29
attributionConfidence: A2
reviewStatus: "certified"
confidenceGrade: A
generatedBy: ai_ingestion
generatedDate: 2026-04-14
cves:
  - CVE-2020-10148
  - CVE-2021-35211
relatedSlugs: []
tags:
  - supply-chain
  - apt29
  - sunburst
  - cozy-bear
  - nation-state
  - espionage
  - solarwinds
  - backdoor
sources:
  - url: https://www.cisa.gov/news-events/directives/emergency-directive-21-01
    publisher: CISA
    publisherType: government
    reliability: R1
    publicationDate: "2020-12-13"
    archived: false
  - url: https://www.mandiant.com/resources/blog/evasive-attacker-leverages-solarwinds-supply-chain-compromises-with-sunburst-backdoor
    publisher: Mandiant (FireEye)
    publisherType: vendor
    reliability: R1
    publicationDate: "2020-12-13"
    archived: false
  - url: https://msrc-blog.microsoft.com/2020/12/13/customer-guidance-on-recent-nation-state-cyber-attacks/
    publisher: Microsoft MSRC
    publisherType: vendor
    reliability: R1
    publicationDate: "2020-12-13"
    archived: false
  - url: https://www.intelligence.senate.gov/hearings/open-hearing-hearing-hack-us-networks-solarwinds-and-microsoft-exchange-threats-supply
    publisher: US Senate Select Committee on Intelligence
    publisherType: government
    reliability: R1
    publicationDate: "2021-02-23"
    archived: false
  - url: https://www.crowdstrike.com/blog/sunspot-malware-technical-analysis/
    publisher: CrowdStrike
    publisherType: vendor
    reliability: R1
    publicationDate: "2021-01-11"
    archived: false
  - url: https://www.volexity.com/blog/2020/12/14/dark-halo-leverages-solarwinds-compromise-to-breach-organizations/
    publisher: Volexity
    publisherType: vendor
    reliability: R1
    publicationDate: "2020-12-14"
    archived: false
  - url: https://www.whitehouse.gov/briefing-room/statements-releases/2021/04/15/fact-sheet-imposing-costs-for-harmful-foreign-activities-by-the-russian-government/
    publisher: The White House
    publisherType: government
    reliability: R1
    publicationDate: "2021-04-15"
    archived: false
mitreMappings:
  - techniqueId: T1195.002
    techniqueName: Supply Chain Compromise — Compromise Software Supply Chain
    tactic: Initial Access
    notes: APT29 compromised the SolarWinds Orion build environment and injected the SUNBURST backdoor into legitimate software updates distributed to approximately 18,000 organizations via the official SolarWinds update mechanism.
  - techniqueId: T1071.001
    techniqueName: Application Layer Protocol — Web Protocols
    tactic: Command and Control
    notes: SUNBURST communicated with C2 infrastructure over HTTP/HTTPS, mimicking legitimate SolarWinds Orion Improvement Program (OIP) traffic to blend in with normal network activity.
  - techniqueId: T1027
    techniqueName: Obfuscated Files or Information
    tactic: Defense Evasion
    notes: SUNBURST employed steganography within HTTP response bodies, encoding C2 commands in XML data that appeared to be benign .NET assemblies. The backdoor also used base64 encoding and custom compression for data exfiltration.
  - techniqueId: T1036
    techniqueName: Masquerading
    tactic: Defense Evasion
    notes: The SUNBURST backdoor was injected into the legitimate SolarWinds.Orion.Core.BusinessLayer.dll, signed with a valid SolarWinds digital certificate, and its C2 traffic was disguised as legitimate Orion Improvement Program communications.
  - techniqueId: T1083
    techniqueName: File and Directory Discovery
    tactic: Discovery
    notes: SUNBURST performed extensive file and directory enumeration on compromised systems to identify high-value targets, security tools, and forensic artifacts before advancing to later-stage payloads.
  - techniqueId: T1005
    techniqueName: Data from Local System
    tactic: Collection
    notes: The threat actor collected sensitive data from compromised local systems including email archives, Active Directory databases, and internal documents from US government agencies and private sector organizations.
---

## Executive Summary

In December 2020, cybersecurity firm FireEye (now Mandiant) disclosed that its own systems had been compromised by a sophisticated threat actor later attributed to Russia's Foreign Intelligence Service (SVR), tracked as APT29 (also known as Cozy Bear). The investigation revealed that the intrusion originated from a supply chain compromise of SolarWinds' Orion IT monitoring platform — one of the most widely deployed network management tools in the world. The attackers had infiltrated the SolarWinds build environment and injected a backdoor, codenamed SUNBURST, into legitimate Orion software updates distributed between March and June 2020.

Approximately 18,000 SolarWinds customers installed the trojanized Orion updates, and of those, roughly 100 organizations were selected for active exploitation by the threat actor. The victims included multiple US federal agencies — the Departments of Treasury, Commerce, Homeland Security, Energy (including the National Nuclear Security Administration), and State — as well as major private sector companies including FireEye, Microsoft, Intel, Cisco, and Deloitte. The operation represented one of the most significant cyber espionage campaigns ever conducted against the United States.

The compromise triggered a whole-of-government response including CISA Emergency Directive 21-01, multiple National Security Council meetings, congressional hearings, and ultimately economic sanctions against Russia imposed by the Biden administration in April 2021. The incident fundamentally reshaped how the US government and private sector approach software supply chain security, leading to Executive Order 14028 on Improving the Nation's Cybersecurity.

## Technical Analysis

The SolarWinds compromise was a multi-stage operation that demonstrated exceptional operational security and technical sophistication. The attack began with the deployment of SUNSPOT, a specialized implant designed to monitor the SolarWinds Orion build process and inject malicious code during compilation. SUNSPOT targeted the specific Visual Studio build process for the Orion product, replacing a single source code file — InventoryManager.cs — with a modified version containing the SUNBURST backdoor code. The implant was designed to revert the source code after the build completed, leaving no trace in the source code repository itself.

The SUNBURST backdoor was injected into the SolarWinds.Orion.Core.BusinessLayer.dll, a legitimate component of the Orion platform. Because the modified DLL was compiled as part of the official build process, it was signed with SolarWinds' legitimate Authenticode certificate, making it appear entirely trustworthy to endpoint protection tools and security teams. The malicious code was carefully written to blend with existing code patterns and naming conventions within the Orion codebase.

Upon execution, SUNBURST implemented a dormancy period of approximately 12 to 14 days before activating. During this period it performed extensive anti-analysis checks: verifying the system was domain-joined, checking that no known security analysis tools or endpoint detection software were running, and confirming the system was not in a sandboxed or virtualized analysis environment. If any of these checks failed, the backdoor would permanently disable itself by setting a registry key, ensuring it would not execute again on that host.

Once activated, SUNBURST initiated command-and-control communications using a sophisticated domain generation algorithm (DGA) that produced subdomains of avsvmcloud[.]com. The generated subdomains encoded information about the victim environment, including the Active Directory domain name, allowing the operators to identify high-value targets before committing additional resources. The C2 protocol mimicked legitimate SolarWinds Orion Improvement Program (OIP) HTTP traffic, using HTTP GET and POST requests with XML payloads that appeared to be benign telemetry data.

The C2 responses employed steganography, embedding encoded commands within XML data structures that mimicked legitimate .NET assembly metadata. This made the C2 traffic extremely difficult to distinguish from normal Orion communications through network-level inspection alone. The backdoor supported commands for file transfer, file execution, registry manipulation, system profiling, and the ability to disable system services.

For high-value targets, the operators deployed second-stage payloads: TEARDROP, a memory-only dropper that loaded a customized Cobalt Strike Beacon directly into memory without touching disk, and RAINDROP, a loader that also deployed Cobalt Strike but used a different propagation mechanism for lateral movement within victim networks. The use of memory-only payloads and legitimate penetration testing frameworks (Cobalt Strike) further complicated forensic analysis and attribution.

## Attack Chain

### Stage 1: Build Environment Compromise

APT29 gained initial access to SolarWinds' internal network and development environment. The exact initial access vector to SolarWinds has not been publicly disclosed, though investigations indicated the attackers had access to SolarWinds systems as early as October 2019. Once inside, they deployed the SUNSPOT implant on the Orion build server, which monitored the MsBuild.exe process for the Orion software solution.

### Stage 2: SUNSPOT Source Code Injection

SUNSPOT intercepted the Orion build process and replaced the legitimate InventoryManager.cs source file with a trojanized version containing the SUNBURST backdoor code. The replacement was performed in-memory during compilation, and the original source file was restored after the build completed. This ensured that source code reviews and version control diffs would not reveal the modification.

### Stage 3: SUNBURST Distribution via Trusted Update Channel

The trojanized Orion updates (versions 2019.4 HF5 through 2020.2.1) were digitally signed with SolarWinds' legitimate code-signing certificate and distributed through the official SolarWinds update infrastructure between March and June 2020. Approximately 18,000 organizations downloaded and installed the compromised updates.

### Stage 4: DNS Beacon and Target Selection

After the dormancy period and anti-analysis checks, SUNBURST initiated DGA-based DNS queries to subdomains of avsvmcloud[.]com. These DNS requests encoded victim environment information, allowing the operators to passively profile all compromised organizations and selectively identify high-value targets for further exploitation.

### Stage 5: C2 Establishment

For selected targets, the DNS CNAME responses directed SUNBURST to dedicated C2 servers. The backdoor then established full HTTP/HTTPS C2 communications, disguised as legitimate Orion Improvement Program traffic, enabling the operators to issue commands and receive exfiltrated data.

### Stage 6: Lateral Movement and Privilege Escalation

Using Cobalt Strike Beacons deployed via TEARDROP or RAINDROP, the operators performed lateral movement within victim networks. They leveraged stolen credentials, SAML token forgery (dubbed "Golden SAML" by CyberArk researchers), and exploitation of on-premises Active Directory and Azure Active Directory trust relationships to escalate privileges and access cloud-hosted email and document repositories.

### Stage 7: Data Exfiltration

The threat actor collected and exfiltrated sensitive data from compromised organizations, including email archives from senior government officials, internal policy documents, security tool source code (in the case of FireEye), and intelligence on US sanctions policy and counter-intelligence operations. Exfiltrated data was staged on compromised servers within the victim environment before being transferred to attacker-controlled infrastructure.

## MITRE ATT&CK Mapping

### Initial Access

T1195.002 — Supply Chain Compromise — Compromise Software Supply Chain: APT29 compromised the SolarWinds build environment and injected malicious code into legitimate software updates distributed to approximately 18,000 organizations.

### Execution

T1569.002 — System Services — Service Execution: The trojanized SolarWinds Orion software executed as a Windows service (SolarWinds.BusinessLayerHost.exe), automatically loading the SUNBURST backdoor DLL during normal service operations.

### Defense Evasion

T1036 — Masquerading: SUNBURST was embedded in a legitimately signed SolarWinds DLL, and its C2 traffic was disguised as legitimate Orion Improvement Program communications.

T1027 — Obfuscated Files or Information: C2 commands were encoded using steganography within XML response bodies, and the backdoor employed custom encoding schemes for data exfiltration.

T1070.004 — Indicator Removal — File Deletion: The SUNSPOT implant removed evidence of source code manipulation after each build, and the operators systematically cleaned up forensic artifacts on compromised systems.

### Discovery

T1083 — File and Directory Discovery: SUNBURST enumerated files, directories, and system configurations to identify high-value targets and determine whether security tools were present.

T1082 — System Information Discovery: The backdoor collected hostname, domain membership, OS version, and installed software information during its initial profiling phase.

### Command and Control

T1071.001 — Application Layer Protocol — Web Protocols: SUNBURST used HTTP/HTTPS for C2 communications, mimicking legitimate SolarWinds telemetry traffic patterns.

T1568.002 — Dynamic Resolution — Domain Generation Algorithms: SUNBURST used a DGA to generate subdomains of avsvmcloud[.]com for initial C2 beacon communications, encoding victim information in the generated domain names.

### Collection

T1005 — Data from Local System: The operators collected email archives, Active Directory databases, internal documents, and security tool source code from compromised systems.

T1114.002 — Email Collection — Remote Email Collection: The threat actor accessed and collected email from Microsoft 365 environments using forged SAML tokens and compromised OAuth application credentials.

### Exfiltration

T1041 — Exfiltration Over C2 Channel: Collected data was exfiltrated through the established C2 communications channels, blending with legitimate-appearing Orion telemetry traffic.

## Impact Assessment

The SolarWinds Orion compromise affected an estimated 18,000 organizations that installed the trojanized software updates. Of these, approximately 100 were selected by APT29 for active exploitation, representing the highest-value targets from an intelligence collection perspective.

Confirmed US government victims included the Department of the Treasury (including the Office of Foreign Assets Control, which administers sanctions), the Department of Commerce's National Telecommunications and Information Administration (NTIA), the Department of Homeland Security (including CISA itself), the Department of Energy and its National Nuclear Security Administration (responsible for the US nuclear weapons stockpile), the Department of State, the Department of Justice, and the National Institutes of Health.

Private sector victims included FireEye (which discovered the breach when investigating the theft of its own Red Team tools), Microsoft (which found the threat actor had accessed some of its source code repositories), Intel, Cisco, Deloitte, Palo Alto Networks, and numerous others. The full scope of private sector compromise has never been publicly disclosed due to victim notification confidentiality.

The operational impact was severe. CISA issued Emergency Directive 21-01 on December 13, 2020, ordering all federal civilian agencies to immediately disconnect or power down SolarWinds Orion products. The National Security Council convened emergency meetings, and the incident was briefed to the President. Multiple congressional hearings were held, including a joint hearing by the Senate Intelligence and Homeland Security committees.

In April 2021, the Biden administration formally attributed the operation to Russia's SVR and imposed economic sanctions, expelled Russian diplomats, and designated several Russian technology companies. The incident directly catalyzed Executive Order 14028 on Improving the Nation's Cybersecurity (May 2021), which mandated software bill of materials (SBOM) requirements, zero-trust architecture adoption across federal agencies, and enhanced cybersecurity standards for government software suppliers.

The financial impact on SolarWinds was substantial: the company's stock price dropped approximately 40% following disclosure, and the company incurred over $40 million in direct incident response and remediation costs in the first three quarters following the breach. The broader economic impact across all affected organizations has been estimated in the billions of dollars.

## Timeline

### 2019-10-XX — Initial Access to SolarWinds Environment

APT29 operatives gained initial access to SolarWinds' internal network, establishing the foothold that would later enable the build system compromise. The exact date and initial access vector have not been publicly disclosed.

### 2020-02-20 — SUNSPOT Implant Deployed

The SUNSPOT implant was compiled and deployed on the SolarWinds Orion build server, positioned to intercept future build processes and inject the SUNBURST backdoor into compiled DLLs.

### 2020-03-XX — First Trojanized Orion Update Released

SolarWinds Orion version 2019.4 HF5, containing the SUNBURST backdoor, was compiled, signed with SolarWinds' legitimate certificate, and made available for download through the official SolarWinds update infrastructure.

### 2020-03-XX to 2020-06-XX — Trojanized Updates Distributed

Multiple trojanized Orion updates (versions 2019.4 HF5 through 2020.2.1) were distributed to SolarWinds customers. Approximately 18,000 organizations installed one or more of the compromised updates.

### 2020-06-XX — SUNSPOT Removed from Build Environment

APT29 removed the SUNSPOT implant from the SolarWinds build environment, and subsequent Orion builds no longer contained the SUNBURST backdoor. This timeline is consistent with the attacker's operational security discipline.

### 2020-12-08 — FireEye Discloses Breach and Red Team Tool Theft

FireEye CEO Kevin Mandia publicly disclosed that the company had been breached by a sophisticated nation-state actor and that the attackers had stolen FireEye's proprietary Red Team assessment tools. FireEye released detection signatures for the stolen tools.

### 2020-12-13 — Supply Chain Vector Identified and Publicly Disclosed

FireEye/Mandiant published detailed analysis identifying the SolarWinds Orion supply chain compromise as the initial access vector. The SUNBURST backdoor was publicly documented for the first time. CISA issued Emergency Directive 21-01 ordering federal agencies to disconnect SolarWinds Orion.

### 2020-12-14 — SolarWinds Issues Security Advisory

SolarWinds published Security Advisory 2020.2.1 acknowledging the supply chain compromise and providing guidance for affected customers. The company's stock price began its 40% decline.

### 2020-12-15 — Kill Switch Activated for SUNBURST C2

Microsoft, FireEye, and GoDaddy collaborated to seize control of the avsvmcloud[.]com domain and configure it as a kill switch, causing SUNBURST implants to deactivate themselves by returning IP addresses in the blocklist range.

### 2021-01-05 — Joint Attribution Statement

CISA, the FBI, the ODNI, and the NSA issued a joint statement attributing the SolarWinds compromise to a likely Russian-origin Advanced Persistent Threat actor, characterizing the operation as an intelligence gathering effort.

### 2021-01-11 — CrowdStrike Publishes SUNSPOT Analysis

CrowdStrike published a detailed technical analysis of the SUNSPOT implant, revealing how APT29 had compromised the build process itself rather than modifying source code in the repository.

### 2021-02-23 — Senate Intelligence Committee Hearing

The US Senate Select Committee on Intelligence held an open hearing on the SolarWinds compromise featuring testimony from SolarWinds, Microsoft, FireEye, and CrowdStrike executives.

### 2021-04-15 — US Sanctions Russia

The Biden administration formally attributed the SolarWinds operation to Russia's SVR, imposed economic sanctions on Russia, expelled 10 Russian diplomats, and designated several Russian technology companies that supported SVR cyber operations.

### 2021-05-12 — Executive Order 14028 Signed

President Biden signed Executive Order 14028 on Improving the Nation's Cybersecurity, directly informed by the SolarWinds incident, mandating SBOM requirements, zero-trust adoption, and enhanced supply chain security standards for federal software.

## Remediation & Mitigation

CISA Emergency Directive 21-01 required all federal civilian agencies to immediately take the following actions: identify all instances of SolarWinds Orion products on agency networks, disconnect or power down those instances, block all traffic to and from hosts running SolarWinds Orion products, and refrain from reconnecting or upgrading Orion products until CISA provided further guidance.

For organizations that had installed the trojanized updates, CISA recommended a comprehensive forensic investigation including: reviewing network telemetry for connections to the known C2 infrastructure, checking for the presence of the trojanized SolarWinds.Orion.Core.BusinessLayer.dll, examining authentication logs for anomalous SAML token usage or unexpected OAuth application registrations, and auditing Azure Active Directory configurations for unauthorized modifications.

Organizations that identified evidence of active exploitation were advised to assume full domain compromise and undertake complete environment rebuilds, including: resetting all credentials, revoking and reissuing all certificates, rebuilding Active Directory from known-clean backups, auditing all federated trust relationships, and implementing enhanced monitoring for persistence mechanisms.

Broader supply chain security recommendations arising from the incident included: implementing build environment integrity monitoring and reproducible builds, requiring software bill of materials (SBOM) for all critical software, deploying network segmentation to limit the blast radius of compromised monitoring tools, implementing zero-trust architecture principles that do not implicitly trust internal network traffic, establishing runtime integrity verification for critical system components, and conducting regular threat hunting focused on supply chain compromise indicators.

SolarWinds itself undertook a comprehensive remediation program including rebuilding its build environment with enhanced security controls, engaging CrowdStrike for incident response and ongoing monitoring, implementing new secure software development lifecycle practices, and establishing an independent security advisory board.

## Indicators of Compromise

### Network Indicators

- avsvmcloud[.]com — Primary C2 domain used by SUNBURST for DGA-based DNS beacon communications
- freescanonline[.]com — Secondary C2 infrastructure associated with later-stage operations
- deftsecurity[.]com — Secondary C2 infrastructure associated with later-stage operations
- thedarkestside[.]org — Secondary C2 infrastructure associated with later-stage operations
- digitalcollege[.]org — C2 domain identified during incident response operations
- Known C2 IP addresses: 13.59.205[.]66, 54.193.127[.]66, 54.215.192[.]52, 34.203.203[.]23, 139.99.115[.]204

### File Hashes

- SUNBURST (SolarWinds.Orion.Core.BusinessLayer.dll): SHA256 32519b85c0b422e4656de6e6c41878e95fd95026267daab4215ee59c107d6c77
- SUNBURST (SolarWinds.Orion.Core.BusinessLayer.dll): SHA256 dab758bf98d9b36fa057a66cd0284737abf89857b73ca89280267ee7caf62f3b
- SUNSPOT implant: SHA256 c45c9bda8db1d470f1fd0dba53334571b10e40068d6fcb599a085e0fda1bdb61
- TEARDROP: SHA256 b820e8a2057112d0ed73bd7995201dbed79a79e13c23571bf1eb54a22b0fd068
- RAINDROP: SHA256 be2e1f68128988cce04a3c8b30ba3cc1bfc956c6052a16bc18b0d3a4de2b8ae3

## Sources & References

1. [CISA Emergency Directive 21-01](https://www.cisa.gov/news-events/directives/emergency-directive-21-01) — Cybersecurity and Infrastructure Security Agency, December 13, 2020
2. [Highly Evasive Attacker Leverages SolarWinds Supply Chain to Compromise Multiple Global Victims With SUNBURST Backdoor](https://www.mandiant.com/resources/blog/evasive-attacker-leverages-solarwinds-supply-chain-compromises-with-sunburst-backdoor) — Mandiant (FireEye), December 13, 2020
3. [Customer Guidance on Recent Nation-State Cyber Attacks](https://msrc-blog.microsoft.com/2020/12/13/customer-guidance-on-recent-nation-state-cyber-attacks/) — Microsoft Security Response Center, December 13, 2020
4. [Open Hearing on the Hack of US Networks by SolarWinds and Microsoft Exchange](https://www.intelligence.senate.gov/hearings/open-hearing-hearing-hack-us-networks-solarwinds-and-microsoft-exchange-threats-supply) — US Senate Select Committee on Intelligence, February 23, 2021
5. [SUNSPOT: An Implant in the Build Process](https://www.crowdstrike.com/blog/sunspot-malware-technical-analysis/) — CrowdStrike, January 11, 2021
6. [Dark Halo Leverages SolarWinds Compromise to Breach Organizations](https://www.volexity.com/blog/2020/12/14/dark-halo-leverages-solarwinds-compromise-to-breach-organizations/) — Volexity, December 14, 2020
7. [Fact Sheet: Imposing Costs for Harmful Foreign Activities by the Russian Government](https://www.whitehouse.gov/briefing-room/statements-releases/2021/04/15/fact-sheet-imposing-costs-for-harmful-foreign-activities-by-the-russian-government/) — The White House, April 15, 2021
