---
name: "UNC6671 / BlackFile"
aliases:
  - "UNC6671"
  - "BlackFile"
  - "Cordial Spider"
  - "CORDIAL SPIDER"
  - "O-UNC-045"
  - "CL-CRI-1116"
affiliation: "Cybercriminal"
motivation: "Financial / Data Extortion"
status: active
country: "Unknown"
firstSeen: "2025"
lastSeen: "2026"
targetSectors:
  - "Retail"
  - "Hospitality"
  - "Technology"
  - "Financial Services"
  - "SaaS-dependent enterprises"
targetGeographies:
  - "North America"
  - "Australia"
  - "United Kingdom"
tools:
  - "BlackFile data leak site"
  - "Voice phishing"
  - "SSO phishing pages"
  - "Microsoft Graph API"
  - "Python scripts"
  - "PowerShell scripts"
  - "python-requests"
  - "Tox"
  - "Session"
  - "Residential proxies"
  - "Antidetect browsers"
mitreMappings:
  - techniqueId: "T1583.001"
    techniqueName: "Domains"
    tactic: "Resource Development"
    attack-version: "v19"
    confidence: confirmed
    evidence: "Google GTIG and RH-ISAC/Unit 42 reporting describe UNC6671 and CL-CRI-1116 use of SSO-themed phishing domains and subdomains, including passkey and enrollment themes, to support credential-harvesting operations."
  - techniqueId: "T1566.004"
    techniqueName: "Spearphishing Voice"
    tactic: "Initial Access"
    attack-version: "v19"
    confidence: confirmed
    evidence: "Google GTIG and RH-ISAC/Unit 42 reporting describe voice phishing calls in which operators impersonate internal IT or help desk personnel and direct employees to credential-harvesting pages."
  - techniqueId: "T1078.004"
    techniqueName: "Cloud Accounts"
    tactic: "Initial Access"
    attack-version: "v19"
    confidence: confirmed
    evidence: "Google GTIG reporting states that UNC6671 uses compromised SSO accounts to access Microsoft 365, Okta, SharePoint, OneDrive, Salesforce, Zendesk, and related SaaS environments."
  - techniqueId: "T1119"
    techniqueName: "Automated Collection"
    tactic: "Collection"
    attack-version: "v19"
    confidence: confirmed
    evidence: "Google GTIG observed Python and PowerShell scripts used to harvest high-value data from SharePoint and OneDrive repositories after authentication."
  - techniqueId: "T1020"
    techniqueName: "Automated Exfiltration"
    tactic: "Exfiltration"
    attack-version: "v19"
    confidence: probable
    evidence: "Google GTIG reporting describes high-speed scripted exfiltration from Microsoft 365 repositories, including cases involving very large numbers of file access and download events."
  - techniqueId: "T1059.001"
    techniqueName: "PowerShell"
    tactic: "Execution"
    attack-version: "v19"
    confidence: confirmed
    evidence: "Google GTIG reporting identifies WindowsPowerShell user-agent strings and PowerShell-based direct HTTP requests during UNC6671 data theft operations."
attributionConfidence: "A3"
attributionRationale: "Google GTIG, RH-ISAC/Unit 42, and CrowdStrike describe overlapping public tracking names for a financially motivated data-extortion cluster. Public sources support the cluster identity and cybercriminal motivation, but not individual operators or a state sponsor."
reviewStatus: "draft_ai"
generatedBy: "kernel-k"
generatedDate: 2026-05-18
tags:
  - "unc6671"
  - "blackfile"
  - "cordial-spider"
  - "data-extortion"
  - "vishing"
  - "sso-phishing"
  - "saas"
  - "microsoft-365"
  - "okta"
sources:
  - url: "https://cloud.google.com/blog/topics/threat-intelligence/blackfile-vishing-extortion-operation"
    publisher: "Google Cloud"
    publisherType: "vendor"
    reliability: "R1"
    publicationDate: "2026-05-15"
    accessDate: "2026-05-18"
    archived: false
  - url: "https://rhisac.org/threat-intelligence/extortion-in-the-enterprise-defending-against-blackfile-attacks/"
    publisher: "RH-ISAC"
    publisherType: "research"
    reliability: "R2"
    publicationDate: "2026-04-23"
    accessDate: "2026-05-18"
    archived: false
  - url: "https://www.crowdstrike.com/en-us/adversaries/cordial-spider/"
    publisher: "CrowdStrike"
    publisherType: "vendor"
    reliability: "R2"
    publicationDate: "2026-05-18"
    accessDate: "2026-05-18"
    archived: false
  - url: "https://www.cisa.gov/news-events/news/phishing-resistant-mfa-key-peace-mind"
    publisher: "CISA"
    publisherType: "government"
    reliability: "R1"
    publicationDate: "2023-04-12"
    accessDate: "2026-05-18"
    archived: false
---

## Executive Summary

UNC6671 / BlackFile is a financially motivated data-extortion cluster tracked in public reporting by Google Threat Intelligence Group, RH-ISAC with Unit 42, and CrowdStrike. Google tracks the activity as UNC6671 and describes BlackFile as the brand used by the operators during extortion. CrowdStrike tracks the overlapping entity as Cordial Spider and lists UNC6671, BlackFile, O-UNC-045, and CL-CRI-1116 as community identifiers.

The activity centers on voice phishing, single sign-on phishing, and misuse of cloud and SaaS access rather than custom malware. Public reporting describes operators impersonating corporate IT or help desk staff, guiding employees to SSO-themed phishing pages, capturing credentials and MFA responses in real time, and then using compromised accounts to access Microsoft 365, Okta, SharePoint, OneDrive, Salesforce, Zendesk, and related enterprise services.

Google reported that UNC6671 emerged in early 2026 and had targeted dozens of organizations across North America, Australia, and the United Kingdom. CrowdStrike states that Cordial Spider has performed data theft and extortion since at least October 2025. RH-ISAC and Unit 42 report activity involving data theft and extortion across various industries, with retail and hospitality specifically targeted from February 2026.

## Notable Campaigns

### 2025-2026 — SaaS-Focused Data Extortion

CrowdStrike describes Cordial Spider as a financially motivated eCrime adversary conducting data theft and extortion since at least October 2025. The profile identifies the group with community identifiers that include UNC6671, BlackFile, O-UNC-045, and CL-CRI-1116, and states that the adversary uses vishing calls to direct victims to SSO-themed phishing pages.

### January-April 2026 — CL-CRI-1116 Retail and Hospitality Activity

RH-ISAC and Unit 42 report that CL-CRI-1116 activity first emerged in January 2026 and began actively targeting retail and hospitality organizations in February 2026. That reporting attributes a portion of financially motivated data-theft and extortion incidents to CL-CRI-1116 with moderate confidence and describes overlap with public reporting on BlackFile, UNC6671, and Cordial Spider.

### May 2026 — Google GTIG BlackFile Assessment

Google GTIG reported in May 2026 that UNC6671 operates under the BlackFile brand and targets Microsoft 365 and Okta infrastructure through vishing and adversary-in-the-middle credential theft. Google assessed UNC6671 as independent from ShinyHunters despite at least one instance in which the operators co-opted the ShinyHunters brand for credibility during extortion.

Google also reported that the BlackFile data leak site went offline in late April 2026, briefly returned on May 11, 2026 with a message that the operators were shutting down under that name, and was inaccessible at the time of Google's publication. Google framed that shutdown as a possible transition phase rather than proof that the operators had ceased activity.

## Technical Capabilities

The public source set describes a human-led, identity-focused intrusion model. Operators place voice calls to targeted employees, commonly using an IT deployment, help desk, MFA enrollment, or passkey migration pretext. During the call, the victim is directed to an SSO-themed phishing page that mirrors the organization's login flow. Google describes this as a live adversary-in-the-middle process in which the actor captures credentials, submits them to the legitimate provider, intercepts or elicits MFA approval, and then registers an attacker-controlled MFA device when possible.

Post-authentication activity focuses on SaaS and cloud data. Google reports access to Microsoft 365 and Okta environments, with follow-on access to SharePoint, OneDrive, Salesforce, Zendesk, and other connected applications. RH-ISAC and Unit 42 report living-off-the-land activity through APIs and legitimate internal resources rather than custom malware.

Google reports scripted exfiltration through Python and PowerShell, including use of Microsoft Graph, python-requests, direct HTTP GET requests to document resource URLs, and reuse of valid session cookies. Google observed user-agent mismatches, such as python-requests or WindowsPowerShell activity paired with client application identifiers that appeared to represent normal Microsoft Office use. RH-ISAC published indicators including the python-requests/2.28.1 user-agent and infrastructure associated with observed activity.

Extortion activity includes initial unbranded ransom communications, follow-on communications under the BlackFile name, and use of Tox or Session identifiers for negotiations. Google reported that the group generally sought multimillion-dollar demands but could pivot to lower six-figure demands during negotiation, and described pressure tactics that included spam campaigns, threatening voicemails to executives, and swatting threats in severe cases.

## Attribution

The cited sources support attribution to a financially motivated cybercriminal cluster. Google GTIG uses the tracking name UNC6671 and assesses that the group operates under the BlackFile brand. CrowdStrike tracks an overlapping entity as Cordial Spider. RH-ISAC and Unit 42 use CL-CRI-1116 for activity that overlaps with public reporting on BlackFile, UNC6671, and Cordial Spider.

Public reporting does not identify named operators, a confirmed state sponsor, or a fixed country of origin. RH-ISAC and Unit 42 assess with moderate confidence that the attackers behind CL-CRI-1116 are likely associated with The Com, but that relationship should be treated as a vendor assessment rather than a government-confirmed attribution.

The public source set also distinguishes UNC6671 from ShinyHunters. Google states that UNC6671 has co-opted the ShinyHunters brand in at least one extortion interaction, but assesses the operations as independent based on separate communication channels, domain registration patterns, and the BlackFile data leak site.

## MITRE ATT&CK Profile

T1583.001 - Acquire Infrastructure: Domains: Google and RH-ISAC/Unit 42 reporting describe phishing domains and subdomains used for SSO-themed credential harvesting, including passkey and enrollment naming themes.

T1566.004 - Phishing: Spearphishing Voice: The activity relies on voice calls in which operators impersonate internal IT or help desk personnel and guide victims through credential and MFA capture.

T1078.004 - Valid Accounts: Cloud Accounts: Compromised SSO accounts are used to access Microsoft 365, Okta, SharePoint, OneDrive, Salesforce, Zendesk, and related enterprise SaaS resources.

T1119 - Automated Collection: Google observed scripts used to collect high-value data from SharePoint and OneDrive, including targeted searching for terms associated with sensitive corporate data.

T1020 - Automated Exfiltration: Google reporting describes scripted, high-volume exfiltration and rapid file access or download sequences from Microsoft 365 repositories.

T1059.001 - Command and Scripting Interpreter: PowerShell: Google observed WindowsPowerShell user-agent strings and PowerShell-based direct HTTP requests during data theft operations.

## Sources & References

- [Google Cloud: Welcome to BlackFile: Inside a Vishing Extortion Operation](https://cloud.google.com/blog/topics/threat-intelligence/blackfile-vishing-extortion-operation) — Google Cloud, 2026-05-15
- [RH-ISAC: Extortion in the Enterprise: Defending Against BlackFile Attacks](https://rhisac.org/threat-intelligence/extortion-in-the-enterprise-defending-against-blackfile-attacks/) — RH-ISAC, 2026-04-23
- [CrowdStrike: Cordial Spider Adversary Profile](https://www.crowdstrike.com/en-us/adversaries/cordial-spider/) — CrowdStrike, 2026-05-18
- [CISA: Phishing Resistant MFA is Key to Peace of Mind](https://www.cisa.gov/news-events/news/phishing-resistant-mfa-key-peace-mind) — CISA, 2023-04-12
