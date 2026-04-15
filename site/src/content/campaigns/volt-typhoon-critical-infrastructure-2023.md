---
campaignId: TP-CAMP-2023-0001
title: "Volt Typhoon: Living-off-the-Land Campaign Against U.S. Critical Infrastructure"
startDate: 2021-06-01
ongoing: true
attackType: Espionage
severity: critical
sector: Critical Infrastructure
geography: United States
threatActor: Volt Typhoon
attributionConfidence: A1
reviewStatus: "certified"
confidenceGrade: B
generatedBy: ai_ingestion
generatedDate: 2025-04-14
cves:
  - CVE-2021-40539
  - CVE-2021-27860
  - CVE-2024-39717
relatedIncidents: []
relatedSlugs: []
tags:
  - espionage
  - china
  - volt-typhoon
  - critical-infrastructure
  - living-off-the-land
  - pre-positioning
  - lotl
sources:
  - url: https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-038a
    publisher: CISA
    publisherType: government
    reliability: R1
    publicationDate: "2024-02-07"
    archived: false
  - url: https://www.microsoft.com/en-us/security/blog/2023/05/24/volt-typhoon-targets-us-critical-infrastructure-with-living-off-the-land-techniques/
    publisher: Microsoft Threat Intelligence
    publisherType: vendor
    reliability: R1
    publicationDate: "2023-05-24"
    archived: false
  - url: https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-144a
    publisher: CISA
    publisherType: government
    reliability: R1
    publicationDate: "2023-05-24"
    archived: false
  - url: https://www.fbi.gov/news/press-releases/fbi-partners-dismantle-botnet-used-by-prc-linked-cyber-actors
    publisher: FBI
    publisherType: government
    reliability: R1
    publicationDate: "2024-01-31"
    archived: false
  - url: https://media.defense.gov/2024/Feb/07/2003389936/-1/-1/0/JOINT-GUIDANCE-IDENTIFYING-AND-MITIGATING-LOTL.PDF
    publisher: NSA
    publisherType: government
    reliability: R1
    publicationDate: "2024-02-07"
    archived: false
mitreMappings:
  - techniqueId: T1190
    techniqueName: Exploit Public-Facing Application
    tactic: Initial Access
    notes: Exploited Zoho ManageEngine (CVE-2021-40539) and FatPipe WARP (CVE-2021-27860)
  - techniqueId: T1059.001
    techniqueName: PowerShell
    tactic: Execution
    notes: Used PowerShell for discovery and lateral movement commands
  - techniqueId: T1218.001
    techniqueName: Compiled HTML File
    tactic: Defense Evasion
    notes: Used living-off-the-land binaries to avoid detection
  - techniqueId: T1003.003
    techniqueName: NTDS
    tactic: Credential Access
    notes: Extracted Active Directory database for offline credential cracking
  - techniqueId: T1046
    techniqueName: Network Service Discovery
    tactic: Discovery
    notes: Extensive network reconnaissance of OT environments
  - techniqueId: T1090.002
    techniqueName: External Proxy
    tactic: Command and Control
    notes: Routed C2 through compromised SOHO routers (KV Botnet)
---

## Executive Summary

Volt Typhoon is a People's Republic of China (PRC) state-sponsored cyber campaign targeting United States critical infrastructure sectors including communications, energy, transportation, and water systems. First publicly disclosed by Microsoft and a coalition of Five Eyes intelligence agencies in May 2023, the campaign has been active since at least mid-2021. Unlike typical Chinese espionage operations focused on data theft, Volt Typhoon's primary objective is pre-positioning — establishing persistent access to critical infrastructure networks to enable disruptive or destructive operations during a future geopolitical crisis, particularly a potential conflict over Taiwan. The campaign is distinguished by its exclusive use of living-off-the-land (LOTL) techniques, making detection extremely difficult.

## Technical Analysis

Volt Typhoon's operational tradecraft represents a significant evolution in Chinese cyber operations. The group almost exclusively uses legitimate system administration tools and built-in operating system commands rather than custom malware, making their activity nearly indistinguishable from normal network administration.

The campaign's infrastructure relies on a network of compromised small office/home office (SOHO) routers — primarily end-of-life Cisco and NetGear devices — organized into a command-and-control network known as the KV Botnet. This botnet was partially disrupted by the FBI in January 2024, though the group has demonstrated the ability to reconstitute infrastructure quickly.

Initial access is achieved through exploitation of internet-facing network appliances, including Zoho ManageEngine ADSelfService Plus (CVE-2021-40539), FatPipe WARP/IPVPN/MPVPN (CVE-2021-27860), and Versa Director (CVE-2024-39717). Once inside, the actors use only native Windows tools: `wmic`, `ntdsutil`, `netsh`, `PowerShell`, and `cmd.exe` for discovery, credential harvesting, lateral movement, and persistence.

Of particular concern is the group's focus on operational technology (OT) environments within critical infrastructure. CISA has confirmed that Volt Typhoon actors have maintained access to some victim IT environments for at least five years, using that access to conduct reconnaissance of adjacent OT systems that control physical infrastructure.

## Attack Chain

### Stage 1: Perimeter Exploitation

Volt Typhoon identifies and exploits vulnerabilities in internet-facing network appliances — VPN concentrators, firewalls, and management platforms. The group conducts extensive reconnaissance to identify vulnerable devices using public scanning data and likely zero-day vulnerabilities in some cases.

### Stage 2: Credential Harvesting

After gaining a foothold, the actors use native tools to extract credentials. The primary method involves using `ntdsutil` to create a copy of the Active Directory NTDS.dit database, which is then exfiltrated for offline password cracking. They also harvest credentials from LSASS memory and local SAM databases.

### Stage 3: Lateral Movement via LOTL

Using harvested credentials and exclusively native tools (RDP, WMI, PowerShell remoting), the actors move laterally through victim networks. No custom tools or malware droppers are deployed at any stage, making the activity blend with legitimate system administration.

### Stage 4: Persistent Access Establishment

The actors establish persistence through valid account access, scheduled tasks using built-in Windows utilities, and maintenance of access to the perimeter device used for initial entry. Persistence mechanisms are deliberately minimal and rely on legitimate credentials rather than implants.

### Stage 5: OT Environment Reconnaissance

From established positions in IT networks, the actors conduct systematic reconnaissance of adjacent OT environments, mapping control systems, SCADA interfaces, and industrial control networks. This reconnaissance is consistent with pre-positioning for future disruptive operations rather than immediate data theft.

## MITRE ATT&CK Mapping

### Initial Access

T1190 — Exploit Public-Facing Application: Exploited Zoho ManageEngine (CVE-2021-40539), FatPipe WARP (CVE-2021-27860), and Versa Director (CVE-2024-39717)

### Execution

T1059.001 — PowerShell: Used PowerShell for discovery commands, credential access, and lateral movement scripting

### Defense Evasion

T1218.001 — Compiled HTML File: Extensive use of living-off-the-land binaries (LOLBins) including wmic, ntdsutil, netsh, and certutil to avoid triggering security tools

### Credential Access

T1003.003 — NTDS: Copied Active Directory NTDS.dit database using ntdsutil for offline credential extraction

### Discovery

T1046 — Network Service Discovery: Systematic reconnaissance of internal network topology with focus on OT/ICS boundaries

### Command and Control

T1090.002 — External Proxy: Routed all C2 communications through compromised SOHO routers (KV Botnet) to obscure true origin

## Impact Assessment

The strategic impact of Volt Typhoon transcends conventional cyber espionage metrics:

- **Pre-positioning scope**: CISA confirmed access to communications, energy, transportation, and water sector organizations across the United States
- **Dwell time**: Some victims compromised for five or more years before detection
- **Strategic risk**: Pre-positioned access could enable disruption of critical services during a Taiwan Strait crisis or other geopolitical confrontation
- **Detection challenge**: LOTL techniques mean many organizations cannot distinguish Volt Typhoon activity from normal administration
- **Infrastructure impact**: The KV Botnet compromised hundreds of SOHO routers across the US, representing a secondary infrastructure security concern
- **International scope**: Five Eyes partners (Australia, Canada, New Zealand, UK) confirmed Volt Typhoon targeting in their jurisdictions as well

## Timeline

### 2021-06 — Earliest Known Campaign Activity

Retrospective analysis places the earliest Volt Typhoon intrusions in mid-2021, targeting communications and energy sector organizations.

### 2023-05-24 — Public Disclosure by Microsoft and Five Eyes

Microsoft Threat Intelligence published detailed analysis of "Volt Typhoon" targeting US critical infrastructure. CISA, NSA, FBI, and Five Eyes partners simultaneously released Joint Cybersecurity Advisory AA23-144A.

### 2023-12 — KV Botnet Identified

Researchers at Lumen Technologies' Black Lotus Labs identified the KV Botnet — a network of compromised SOHO routers used as Volt Typhoon's C2 infrastructure.

### 2024-01-31 — FBI Disrupts KV Botnet

The FBI, with court authorization, disrupted the KV Botnet by removing malware from hundreds of compromised routers across the United States.

### 2024-02-07 — CISA Issues Updated Advisory

CISA, NSA, and FBI released Joint Advisory AA24-038A with updated technical details, confirming Volt Typhoon had maintained access to some victim environments for at least five years and had conducted reconnaissance of OT systems.

### 2024-08 — Versa Director Zero-Day Disclosed

Volt Typhoon was identified exploiting CVE-2024-39717 in Versa Director, an SD-WAN management platform used by ISPs and managed service providers, demonstrating continued active operations despite public exposure.

## Remediation & Mitigation

**Detection priorities:**
- Implement behavioral analytics capable of identifying anomalous use of native tools (PowerShell, wmic, ntdsutil) — signature-based detection is ineffective against LOTL
- Monitor for unusual NTDS.dit access or volume shadow copy creation
- Audit authentication logs for credential use anomalies, especially service account activity outside normal patterns
- Monitor SOHO router firmware integrity and network traffic patterns

**Defensive measures:**
- Patch internet-facing appliances immediately, prioritizing the CVEs listed in CISA advisories
- Replace end-of-life SOHO routers that can no longer receive security updates
- Implement network segmentation between IT and OT environments with strict access controls
- Deploy phishing-resistant MFA across all remote access points
- Implement privileged access workstations (PAWs) for administrative activities
- Enable PowerShell logging (Script Block Logging, Module Logging) and forward to SIEM
- Conduct proactive threat hunting focused on LOTL indicators per CISA guidance

## Indicators of Compromise

### Behavioral Indicators

- ntdsutil.exe creating IFM (Install From Media) snapshots outside of planned AD maintenance
- PowerShell commands enumerating network topology and OT system interfaces
- Anomalous netsh portproxy configurations on servers
- Scheduled tasks created with wmic.exe or schtasks.exe outside change windows
- certutil.exe used for file downloads or Base64 encoding/decoding

### Network Indicators

- Outbound connections from internal systems to known compromised SOHO router IP ranges
- VPN connections from residential IP space to critical infrastructure management interfaces
- DNS queries or connections to Versa Director management interfaces from unexpected sources

### Infrastructure Indicators

- SOHO routers exhibiting unexpected configuration changes or firmware modifications
- KV Botnet remnant indicators on Cisco and NetGear end-of-life devices

## Sources & References

1. [PRC State-Sponsored Actors Compromise and Maintain Persistent Access to U.S. Critical Infrastructure](https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-038a) — CISA, 2024-02-07
2. [Volt Typhoon targets US critical infrastructure with living-off-the-land techniques](https://www.microsoft.com/en-us/security/blog/2023/05/24/volt-typhoon-targets-us-critical-infrastructure-with-living-off-the-land-techniques/) — Microsoft Threat Intelligence, 2023-05-24
3. [People's Republic of China State-Sponsored Cyber Actor Living off the Land to Evade Detection](https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-144a) — CISA, 2023-05-24
4. [FBI Partners Dismantle Botnet Used by PRC-Linked Cyber Actors](https://www.fbi.gov/news/press-releases/fbi-partners-dismantle-botnet-used-by-prc-linked-cyber-actors) — FBI, 2024-01-31
5. [Identifying and Mitigating Living Off the Land Techniques](https://media.defense.gov/2024/Feb/07/2003389936/-1/-1/0/JOINT-GUIDANCE-IDENTIFYING-AND-MITIGATING-LOTL.PDF) — NSA, 2024-02-07
