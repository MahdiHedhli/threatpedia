---
eventId: TP-2026-0035
title: "FrostArmada: SOHO Router DNS Hijacking & AiTM Campaign (APT28)"
date: 2026-04-07
attackType: espionage
severity: high
sector: Government / Law Enforcement / IT / Telecom / Energy
geography: Global (120 countries)
threatActor: Forest Blizzard (APT28 / GRU Unit 26165 / Storm-2754)
attributionConfidence: A4
reviewStatus: under_review
confidenceGrade: C
generatedBy: manual-intel-extraction
generatedDate: 2026-04-07
cves:
  - "CVE-2023-50224"
relatedSlugs:
  - "fbi-dcsnet-salt-typhoon-2026"
  - "m365-oauth-device-code-phishing-2026"
  - "operation-truechaos-trueconf-zero-day-2026"
tags:
  - "dns-hijacking"
  - "aitm"
  - "soho-router"
  - "apt28"
  - "forest-blizzard"
  - "gru"
  - "russia"
  - "credential-theft"
  - "oauth-token-theft"
  - "tp-link"
  - "mikrotik"
  - "nation-state"
  - "fbi-takedown"
---
## Executive Summary

FrostArmada is a large-scale DNS hijacking and adversary-in-the-middle (AiTM) campaign attributed with high confidence to Forest Blizzard (APT28), the threat actor associated with Russia's GRU Unit 26165, with sub-group Storm-2754 specifically implicated. The campaign compromised small office and home office (SOHO) routers at scale, modified their DNS configurations to route queries through actor-controlled resolvers running dnsmasq, and selectively spoofed DNS responses for high-value targets to enable TLS adversary-in-the-middle attacks. The primary targets were Microsoft Outlook on the web and other cloud-hosted services.

At its peak in December 2025, FrostArmada had infected approximately 18,000 devices across 120 countries, primarily targeting government agencies, law enforcement, IT and hosting providers, telecommunications, energy, and organizations operating their own servers. Microsoft Threat Intelligence identified over 200 impacted organizations and approximately 5,000 consumer devices still compromised at the time of disclosure. Three African government organizations whose non-Microsoft servers were also targeted were specifically named in reporting.

The campaign was disrupted on April 7, 2026, via a coordinated multi-party operation involving Microsoft, Lumen Black Lotus Labs, the US Department of Justice, the FBI, and the Polish government. The FBI executed a court-authorized technical operation to remove APT28's malicious DNS resolvers from compromised routers by resetting DNS settings and forcing devices to reconnect to legitimate DNS resolvers provided by their internet service providers. Stolen credentials included passwords, OAuth tokens, and session cookies, enabling post-compromise access to victim cloud resources as legitimate users.

## Technical Analysis

Attack Class: DNS Hijacking + TLS Adversary-in-the-Middle (AiTM)
The campaign operates by compromising SOHO routers, reconfiguring their upstream DNS settings to point at attacker-controlled resolvers, and then selectively spoofing DNS responses for targeted domains. Endpoints on compromised networks receive malicious DNS settings via DHCP. Most DNS queries are transparently proxied to legitimate upstream resolvers to maintain stealth, while queries for high-value domains (primarily Microsoft 365 subdomains) are redirected to AiTM infrastructure that presents spoofed TLS certificates.

Primary Vulnerability: CVE-2023-50224 (CVSS 6.5) — TP-Link WR841N Authentication Bypass
APT28 exploited TP-Link WR841N routers via CVE-2023-50224, an authentication bypass vulnerability that allows extraction of stored credentials through specially crafted HTTP GET requests. The WR841N is a consumer-grade router retailing for approximately $20, first sold circa 2010, and now end-of-life with no further security updates from the manufacturer. The CVE was publicly disclosed in 2023; exploitation in this campaign began in 2024.

Secondary Targets: MikroTik Routers
MikroTik routers were also confirmed as targets in both the primary botnet expansion cluster and a secondary cluster conducting interactive operations against a small number of MikroTik routers in Ukraine. Specific MikroTik models and exploitation methods have not been publicly specified in available reporting.

Credential Theft Scope: Passwords, OAuth Tokens, Session Cookies
The DNS hijacking and AiTM infrastructure facilitated theft of passwords, OAuth tokens, and other credentials for web and email-related services. OAuth token theft is particularly significant because tokens often outlive password changes and can bypass MFA protections. Compromised users who ignored TLS certificate warnings were subject to full interception of plaintext traffic within the hijacked TLS session, potentially including email content and other sensitive data.

Operational Structure: Two-Cluster Division of Labor
Per Lumen Black Lotus Labs, FrostArmada operated as two distinct operational clusters: (1) An "Expansion team" dedicated to device compromise and botnet growth through exploitation of vulnerable SOHO devices; (2) A separate AiTM/collection team handling targeted DNS redirection, credential harvesting, and exfiltration operations. This division of labor indicates a production-grade espionage operation, not an opportunistic side project.

## Attack Chain

Stage 1: Initial Access — Router Exploitation

Exploitation of known vulnerabilities in SOHO routers. Confirmed: TP-Link WR841N via CVE-2023-50224 (authentication bypass, CVSS 6.5). MikroTik routers also targeted. The Expansion team cluster handles large-scale exploitation to grow the botnet.

Stage 2: DNS Reconfiguration

Actor modifies compromised router's default DNS settings to point at attacker-controlled resolvers running dnsmasq. Endpoints on the network receive the malicious DNS configuration via DHCP and forward all DNS queries through actor infrastructure.

Stage 3: Passive DNS Collection

Majority of DNS queries are transparently proxied to legitimate upstream resolvers, maintaining normal connectivity and operational stealth. This provides persistent, passive visibility into the compromised network's external communications without alerting users to the compromise.

Stage 4: Selective DNS Spoofing

For specifically targeted domains (primarily Microsoft Outlook on the web subdomains, plus non-Microsoft servers belonging to specific government organizations), the actor returns spoofed DNS responses. These redirect victim connections to AiTM infrastructure controlled by the threat actor.

Stage 5: TLS Adversary-in-the-Middle

AiTM infrastructure presents an invalid TLS certificate impersonating the legitimate service. If the victim ignores the browser's certificate warning and proceeds, the actor intercepts the entire TLS session in plaintext. Captured data includes passwords, OAuth tokens, session cookies, email content, and other sensitive information.

Stage 6: Post-Compromise Access

Stolen credentials and OAuth tokens enable subsequent access to victim cloud resources (Microsoft 365 mailboxes, OAuth-protected APIs) as a legitimate user, potentially bypassing some detection logic and MFA controls.

## MITRE ATT&CK Mapping

Enterprise Attack Framework

T1584.008 — Compromise Infrastructure: Network Devices
T1190 — Exploit Public-Facing Application (CVE-2023-50224)
T1557 — Adversary-in-the-Middle
T1071.001 — Application Layer Protocol: Web Protocols
T1556 — Modify Authentication Process (DNS-based credential interception)
T1528 — Steal Application Access Token (OAuth tokens)
T1539 — Steal Web Session Cookie
T1114 — Email Collection (via AiTM plaintext interception)
T1584 — Compromise Infrastructure (SOHO router botnet)

## Impact Assessment

Scale of Compromise:
At peak in December 2025, approximately 18,000 devices across 120 countries were compromised (per Lumen Black Lotus Labs). Microsoft's post-takedown assessment identified over 200 organizations and 5,000 consumer devices still affected at disclosure. The DOJ confirmed indiscriminate compromise of TP-Link routers dating back to 2024. The discrepancy between peak (18,000) and current (5,000) figures reflects both the takedown operation and natural attrition.

Targeted Sectors:
Government agencies, law enforcement, information technology, telecommunications, energy, hosting providers, and organizations operating their own servers. Three named African government organizations were targeted with AiTM attacks against non-Microsoft infrastructure. A secondary cluster specifically targeted MikroTik routers in Ukraine for interactive operations, suggesting separate intelligence-collection objectives aligned with Russian military priorities.

Credential and Token Compromise:
The AiTM component enabled theft of passwords, OAuth tokens, and session cookies. OAuth token theft is a severe outcome because tokens frequently survive password resets and can bypass multi-factor authentication. Organizations whose users connected through compromised routers and ignored certificate warnings face potential unauthorized access to email, file storage, and other cloud resources.

Remote Workforce Exposure:
With approximately 34.6 million Americans teleworking as of August 2025 (22-23% of the US workforce per BLS data), home routers have become de facto corporate network perimeter devices. The FrostArmada campaign demonstrates that compromised consumer-grade routers create a direct path to corporate credential theft for any organization with remote or hybrid workers. Most of the defense advice published alongside this disclosure requires enterprise infrastructure (MDM, Conditional Access, ZTDNS) that is structurally inaccessible to small businesses and individual remote workers.

## Campaign Timeline

2024
Campaign Begins
Per the US Department of Justice, APT28 begins indiscriminately compromising TP-Link routers, exploiting known vulnerabilities to steal credentials. This is the earliest confirmed start date for FrostArmada operations.

May 2025
Earliest Date in Third-Party Reporting
Independent reporting (InfoSec Today) places the campaign start at "at least May 2025," linking MikroTik and TP-Link router compromise to modified DNS settings under APT28 control.

August 2025
Earliest Date per Microsoft Disclosure
Microsoft Threat Intelligence states the campaign has been active "since at least August 2025." Black Lotus Labs notes activity increased sharply following an NCSC UK report on a Forest Blizzard toolset targeting Microsoft account credentials.

December 2025
Campaign Reaches Peak
Per Lumen Black Lotus Labs telemetry, FrostArmada reaches peak infection of approximately 18,000 devices across 120 countries. The two-cluster operational structure (Expansion team + AiTM/collection team) is fully active.

April 7, 2026
Coordinated Disclosure & Takedown
Microsoft Threat Intelligence, Lumen Black Lotus Labs, and the US DOJ publish coordinated disclosures. The FBI executes a court-authorized technical operation to remove APT28's DNS resolvers from compromised routers. Polish government cooperation enables the takedown. Approximately 5,000 devices and 200 organizations remain affected at time of disclosure.

## Remediation and Mitigation

Immediate Actions — All Organizations:
1. Replace any SOHO router that is end-of-life or no longer receiving firmware security updates from the manufacturer. The DOJ explicitly recommends this.
2. Verify DNS settings on all SOHO/home routers: check that upstream DNS resolvers are set to known-good providers (ISP defaults, Cloudflare 1.1.1.1, Quad9 9.9.9.9, NextDNS) and have not been changed without authorization.
3. Change default administrator credentials on all SOHO network equipment. Disable remote management unless actively required.
4. Review router firmware versions against manufacturer support pages. Apply all available security updates.

Enterprise / Remote Workforce Recommendations:
1. Certificate pinning via MDM (per Lumen): Deploy certificate pinning for corporate devices managed via MDM, targeting high-value domains (Microsoft 365, identity providers). This is the specific mitigation that defeats the AiTM component at the TLS layer.
2. Approved home router procurement: Consider providing company-approved routers to remote employees or reimbursing upgrades, treating the home router as corporate attack surface.
3. Deploy Zero Trust DNS on Windows endpoints where feasible.
4. Enable Microsoft Defender for Endpoint network and web protection, or equivalent EDR with network-layer visibility.
5. Enforce phishing-resistant MFA (hardware security keys, passkeys) for all users.
6. Implement Conditional Access policies evaluating sign-in risk with step-up authentication for anomalous sessions.
7. Enable continuous access evaluation (CAE) to revoke sessions when risk signals change mid-session.

Detection and Hunting:
1. Hunt for unexpected DNS server IPs in DHCP-assigned client configurations on managed endpoints connecting from home/remote networks.
2. Monitor for DNS queries to resolvers outside the organization's approved list originating from remote employee networks.
3. Alert on TLS certificate warnings or errors for Microsoft 365 and corporate SaaS domains reported from remote employee networks.
4. Review Microsoft Entra ID sign-in logs for elevated risk sign-ins from VPS or residential proxy IP ranges, impossible travel alerts, and OAuth token usage from unfamiliar client applications.
5. Check MailItemsAccessed and Search events in Microsoft 365 audit logs for accounts showing signs of credential compromise.
6. For organizations with passive DNS visibility: hunt for Microsoft 365 domains resolving to non-Microsoft IP addresses and sudden changes in resolver behavior.

Post-Incident Actions:
1. Reset credentials and revoke active OAuth tokens and refresh tokens for any user whose home network may have been compromised.
2. Audit mailbox access logs (MailItemsAccessed, MailSend) for compromised accounts to assess data exposure.
3. Review OAuth application consents for affected accounts; revoke any unrecognized consented applications.
4. Report IOCs to your threat intelligence platform and correlate against network telemetry for additional exposure.

## Historical Context

FrostArmada is the latest in a well-established pattern of nation-state exploitation of SOHO router infrastructure. Lumen Black Lotus Labs has discovered six major SOHO router malware campaigns in less than two years: VPNFilter (2018), ZuoRAT (2022), HiatusRAT, AVrecon, Cuttlefish (2024), TheMoon/Faceless (2024), and now FrostArmada. These campaigns span Russian military intelligence (APT28), Chinese state actors (Volt Typhoon's KV-botnet), and criminal groups running residential proxy services.

APT28 specifically has a documented history of router exploitation. In 2023, NCSC UK published an advisory on APT28 accessing poorly maintained Cisco routers and deploying the Jaguar Tooth malware via CVE-2017-6742. The FrostArmada campaign represents an evolution from individual router exploitation to large-scale DNS hijacking at scale to support AiTM of TLS connections. Microsoft notes this is the first time they have observed Forest Blizzard using this specific combination of techniques.

Cisco Talos has reported 289 CVEs across just 13 SOHO and industrial router models since VPNFilter, averaging approximately 22 CVEs per device. This vulnerability density in the consumer router ecosystem is a structural problem that underlies FrostArmada and every campaign like it.

## Indicators of Compromise

Active IOCs for FrostArmada are maintained and published by Lumen Black Lotus Labs on their GitHub and by Microsoft Threat Intelligence through Microsoft Defender XDR threat analytics reports. Given active IOC rotation and the short useful life of infrastructure indicators post-takedown, this entry references the authoritative sources rather than reproducing a static IOC list.

IOC Sources

Lumen Black Lotus Labs — FrostArmada IOC repository (GitHub)
Microsoft Defender XDR — Threat Analytics: Forest Blizzard FrostArmada report
US DOJ — FrostArmada takedown press release (infrastructure details)

Key Detection Signatures

DNS resolver change on SOHO router to non-ISP, non-standard upstream resolver
DNS responses for Microsoft 365 domains (*.outlook.com, *.office.com) resolving to non-Microsoft IP ranges
TLS certificate mismatch or invalid certificate warnings for Microsoft 365 services
DHCP-assigned DNS settings on endpoints pointing to unknown resolvers via VPS IP ranges
dnsmasq instances on attacker infrastructure proxying DNS with selective spoofing

## Discrepancies Across Disclosures

The coordinated disclosure of FrostArmada across three organizations (Microsoft, Lumen, DOJ) produced materially different accounts on key data points. This is typical of multi-party takedowns where each entity reports within its own visibility and legal scope, but is worth noting for defenders assembling a complete operational picture.

Timeline Discrepancy:
Microsoft states "since at least August 2025." Third-party reporting (InfoSec Today) states "since at least May 2025." DOJ states "since 2024." The earliest credible date is 2024 per the DOJ press release. The three-source delta spans approximately 18+ months of campaign activity.

Scale Discrepancy:
Microsoft reports 5,000 consumer devices and 200+ organizations (post-takedown current state). Lumen reports 18,000 devices at peak in December 2025 across 120 countries. The 5,000 vs 18,000 figure represents the difference between a current-state snapshot and a historical peak. Defenders should use the 18,000 / 120-country figure for scoping potential exposure windows.

Targeting Discrepancy:
Microsoft lists: government, IT, telecommunications, energy. Lumen/Bleeping Computer adds: law enforcement, hosting providers, organizations operating their own servers. The Ukraine-targeted MikroTik interactive operations are absent from Microsoft's blog. Defenders in law enforcement, hosting, and self-hosted infrastructure sectors should consider themselves potentially in-scope even if not listed in Microsoft's report.

Sources & References

1.
Microsoft Threat Intelligence — SOHO router compromise leads to DNS hijacking and adversary-in-the-middle attacks
https://www.microsoft.com/en-us/security/blog/2026/04/07/soho-router-compromise-leads-to-dns-hijacking-and-adversary-in-the-middle-attacks/

2.
Lumen Black Lotus Labs — FrostArmada: Forest Blizzard DNS Hijacking Campaign
https://www.lumen.com/blog-and-news/en-us/frostarmada-forest-blizzard-dns-hijacking

3.
US Department of Justice — FrostArmada Takedown Press Release
https://www.justice.gov/

4.
BleepingComputer — FBI resets DNS on routers compromised by Russian APT28 hackers
https://www.bleepingcomputer.com/

5.
InfoSec Today — APT28 FrostArmada SOHO Router Campaign Analysis
https://www.infosectoday.com/

6.
NCSC UK — APT28 exploits known vulnerability to carry out reconnaissance and deploy malware on Cisco routers (2023)
https://www.ncsc.gov.uk/news/apt28-exploits-known-vulnerability-to-carry-out-reconnaissance-and-deploy-malware-on-cisco-routers

7.
Cisco Talos Intelligence — SOHO and Industrial Router Vulnerability Research (289 CVEs across 13 models since VPNFilter)
https://blog.talosintelligence.com/

8.
Lumen / PR Newswire — Six major SOHO router malware campaigns in less than two years
https://www.prnewswire.com/

Key Takeaways

Nation-State Campaign: GRU Unit 26165 (APT28 / Forest Blizzard) with sub-group Storm-2754, high-confidence attribution by Microsoft, Lumen, DOJ, FBI, and Polish government
Peak Scale: 18,000 compromised devices across 120 countries in December 2025
Novel Technique: First observed use of DNS hijacking at scale to support AiTM of TLS connections by Forest Blizzard after exploiting edge devices
Credential Theft: Passwords, OAuth tokens, session cookies stolen via AiTM; enables post-compromise cloud access as legitimate user
Disrupted: Coordinated takedown April 7, 2026 — FBI court-authorized DNS reset of compromised routers
Action Required: Replace end-of-life routers immediately; verify DNS settings; consider enterprise procurement of approved routers for remote workers

Threat Actor Profile

Actor: Forest Blizzard
Sub-Group: Storm-2754
AKA: APT28, Fancy Bear, STRONTIUM, Sofacy, Pawn Storm, Sednit
Affiliation: GRU Unit 26165 (Russian Military Intelligence)
Motive: Espionage / Intelligence Collection
Attribution: High Confidence

Affected Hardware

Confirmed:
TP-Link WR841N (CVE-2023-50224)
MikroTik routers (model unspecified)
Likely At-Risk:
Any end-of-life SOHO router
ISP-provided equipment without recent firmware updates

Related Campaigns
VPNFilter (2018) — APT28 router exploitation
Jaguar Tooth (2023) — APT28 Cisco router malware
ZuoRAT (2022) — SOHO router targeting
Volt Typhoon / KV-Botnet (2024) — Chinese state-sponsored
Cuttlefish (2024) — Router credential theft
TheMoon / Faceless (2024) — Residential proxy botnet

Takedown Participants

Microsoft Threat Intelligence
Lumen Black Lotus Labs
US Department of Justice
Federal Bureau of Investigation (FBI)
Polish Government
