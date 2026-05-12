---
name: "Hafnium"
aliases:
  - "HAFNIUM"
  - "G0125"
affiliation: "China-aligned"
motivation: "Espionage / Intelligence Collection"
status: "unknown"
country: "China"
firstSeen: "2021"
lastSeen: "2021"
targetSectors:
  - "Defense"
  - "Law"
  - "Higher Education"
  - "Non-Governmental Organizations"
  - "Infectious Disease Research"
  - "Policy and Think Tanks"
  - "Defense Industrial Base"
targetGeographies:
  - "United States"
tools:
  - "China Chopper"
  - "ASPX web shells"
  - "Covenant"
  - "PowerCat"
  - "Nishang"
mitreMappings:
  - techniqueId: "T1190"
    techniqueName: "Exploit Public-Facing Application"
    tactic: "Initial Access"
    notes: "Exploited ProxyLogon vulnerabilities (CVE-2021-26855 and chained CVEs) in on-premises Microsoft Exchange Server to gain unauthenticated remote code execution."
  - techniqueId: "T1505.003"
    techniqueName: "Web Shell"
    tactic: "Persistence"
    notes: "Deployed ASPX web shells to maintain persistent access to compromised Exchange servers after initial exploitation."
  - techniqueId: "T1003"
    techniqueName: "OS Credential Dumping"
    tactic: "Credential Access"
    notes: "Dumped credentials from LSASS memory to facilitate lateral movement within target environments."
  - techniqueId: "T1560.001"
    techniqueName: "Archive via Utility"
    tactic: "Collection"
    notes: "Used offline address book (OAB) virtual directory and Exchange web services to stage and compress data for exfiltration."
  - techniqueId: "T1048"
    techniqueName: "Exfiltration Over Alternative Protocol"
    tactic: "Exfiltration"
    notes: "Exfiltrated data to file-sharing services outside the organization using tools that blend with legitimate traffic."
  - techniqueId: "T1059.001"
    techniqueName: "PowerShell"
    tactic: "Execution"
    notes: "Used PowerShell-based post-exploitation frameworks including Nishang and PowerCat to facilitate command execution and reverse shells."
attributionConfidence: "A2"
attributionRationale: "Microsoft assessed Hafnium as a China-state-sponsored actor operating from China with high confidence, based on infrastructure, tooling, and victimology analysis. On 2021-07-19, CISA updated Advisory AA21-062A to attribute the Exchange Server exploitation activity to malicious cyber actors affiliated with China's Ministry of State Security (MSS), as corroborated by MITRE ATT&CK G0125."
reviewStatus: "draft_ai"
generatedBy: "dangermouse-bot"
generatedDate: 2026-05-12
tags:
  - "china"
  - "espionage"
  - "exchange-server"
  - "proxylogon"
  - "web-shell"
  - "apt"
sources:
  - url: "https://attack.mitre.org/groups/G0125/"
    publisher: "MITRE"
    publisherType: "research"
    reliability: "R1"
    publicationDate: "2021-03-09"
    accessDate: "2026-05-12"
    archived: false
  - url: "https://www.microsoft.com/en-us/security/blog/2021/03/02/hafnium-targeting-exchange-servers/"
    publisher: "Microsoft"
    publisherType: "vendor"
    reliability: "R1"
    publicationDate: "2021-03-02"
    accessDate: "2026-05-12"
    archived: false
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa21-062a"
    publisher: "CISA"
    publisherType: "government"
    reliability: "R1"
    publicationDate: "2021-03-03"
    accessDate: "2026-05-12"
    archived: false
---

## Executive Summary

Hafnium is a China-aligned threat actor assessed by Microsoft as operating from China. The group is known for exploiting multiple zero-day vulnerabilities in on-premises Microsoft Exchange Server in early 2021 — a vulnerability chain subsequently designated ProxyLogon (CVE-2021-26855, CVE-2021-26857, CVE-2021-26858, CVE-2021-27065). MITRE ATT&CK tracks the cluster as G0125.

Hafnium's targeting is consistent with espionage and intelligence collection objectives, with a documented focus on U.S.-based organizations across sectors of strategic interest to Chinese state intelligence. The actor exploited these vulnerabilities to install web shells for persistent access and conduct data collection operations. Microsoft and CISA both attributed the initial Exchange exploitation wave to Hafnium in March 2021.

## Notable Campaigns

The most publicly documented Hafnium activity is the March 2021 Exchange Server exploitation campaign. Microsoft's disclosure on March 2, 2021 identified Hafnium as the initial threat actor exploiting four zero-day vulnerabilities in on-premises Exchange Server. Targeted sectors included U.S. defense contractors, law firms, infectious disease researchers, non-governmental organizations, think tanks, and higher education institutions.

CISA issued Emergency Directive 21-02 on March 3, 2021, requiring federal civilian agencies to apply Microsoft's emergency patches or disconnect Exchange servers within specific timeframes. The campaign is notable for the subsequent adoption of the same vulnerability chain by other actors — including ransomware groups — after Microsoft's public disclosure. Microsoft's attribution and the Exchange exploitation wave should be treated as distinct: Hafnium is the actor attributed to the initial exploitation; subsequent exploitation by other actors represents a separate threat surface.

## Technical Capabilities

Hafnium's documented capability is exploitation of the ProxyLogon vulnerability chain in Microsoft Exchange Server. CVE-2021-26855 is a server-side request forgery (SSRF) vulnerability that allowed unauthenticated HTTP requests to authenticate as the Exchange server. When chained with CVE-2021-26857, CVE-2021-26858, and CVE-2021-27065 — which enable post-authentication arbitrary file write — the chain permitted unauthenticated remote code execution on vulnerable on-premises Exchange installations.

Following initial access, Hafnium deployed ASPX web shells to maintain persistent access after the initial exploitation. MITRE ATT&CK associates Hafnium with China Chopper web shells and the Covenant command-and-control framework, alongside Nishang and PowerCat tool transfer during Exchange post-exploitation. Post-exploitation activity included credential dumping via LSASS memory access, lateral movement within target networks, and data staging using Exchange's offline address book (OAB) virtual directory to collect and compress email and mailbox data for exfiltration. Command and control was achieved using open-source post-exploitation frameworks including Nishang (PowerShell) and PowerCat.

## Attribution

Microsoft attributed Hafnium as a China-state-sponsored actor operating from China based on infrastructure, tooling, and victimology patterns identified during incident response. The CISA Emergency Directive 21-02 and Advisory AA21-062A corroborated the Exchange exploitation and directed mandatory remediation for U.S. federal agencies, referencing Microsoft's attribution. MITRE ATT&CK incorporated the group as G0125 following public reporting.

On 2021-07-19, CISA updated Advisory AA21-062A to attribute the Exchange Server exploitation activity to malicious cyber actors affiliated with China's Ministry of State Security (MSS). MITRE ATT&CK G0125 reflects this attribution. Attribution to a specific MSS unit or operational sub-element is not established in the supplied sources.

## MITRE ATT&CK Profile

Initial access was achieved by exploiting CVE-2021-26855 (SSRF) in Exchange, chained with additional CVEs to achieve remote code execution (T1190). Web shell installation (T1505.003) provided persistent access to compromised Exchange servers. Credential dumping (T1003) supported lateral movement. Data staging and compression (T1560.001) used Exchange web services to collect mailbox content. PowerShell frameworks including Nishang and PowerCat provided execution and reverse shell capability (T1059.001). Exfiltration (T1048) moved staged data outside target organizations. Technique coverage for G0125 is maintained in MITRE ATT&CK.

## Sources & References

Coverage of Hafnium in open-source reporting is concentrated in the March 2021 Exchange disclosure period. Post-2021 Hafnium-attributed activity is not documented in the supplied sources. The actor name Hafnium was coined by Microsoft; MITRE uses it as the canonical designation for G0125. Not all Exchange ProxyLogon exploitation activity is attributable to Hafnium — the vulnerability was subsequently exploited by multiple unrelated actors.

- [MITRE: ATT&CK Group G0125 — Hafnium](https://attack.mitre.org/groups/G0125/) — MITRE, 2021-03-09
- [Microsoft: HAFNIUM targeting Exchange Servers](https://www.microsoft.com/en-us/security/blog/2021/03/02/hafnium-targeting-exchange-servers/) — Microsoft, 2021-03-02
- [CISA: Advisory AA21-062A — Mitigate Microsoft Exchange Server Vulnerabilities](https://www.cisa.gov/news-events/cybersecurity-advisories/aa21-062a) — CISA, 2021-03-03
