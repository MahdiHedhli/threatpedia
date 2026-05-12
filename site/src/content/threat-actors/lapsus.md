---
name: "LAPSUS$"
aliases:
  - "DEV-0537"
  - "Strawberry Tempest"
affiliation: "Cybercriminal"
motivation: "Extortion / Data Theft"
status: "unknown"
country: "Unknown"
firstSeen: "2021"
lastSeen: "2022"
targetSectors:
  - "Technology"
  - "Telecommunications"
  - "Government"
  - "Retail"
  - "Healthcare"
targetGeographies:
  - "United Kingdom"
  - "Brazil"
  - "International"
tools:
  - "Redline"
  - "AnyDesk"
  - "Mimikatz"
  - "AD Explorer"
mitreMappings:
  - techniqueId: "T1078"
    techniqueName: "Valid Accounts"
    tactic: "Initial Access"
    notes: "Microsoft reported DEV-0537 use of stolen credentials and session tokens to access target VPN, RDP, VDI, and identity-provider systems."
  - techniqueId: "T1621"
    techniqueName: "Multi-Factor Authentication Request Generation"
    tactic: "Credential Access"
    notes: "Microsoft and the CSRB reported MFA prompt abuse, including repeated prompts intended to obtain user approval."
  - techniqueId: "T1539"
    techniqueName: "Steal Web Session Cookie"
    tactic: "Credential Access"
    notes: "Microsoft reported DEV-0537 use of session token replay and stolen session tokens to satisfy access requirements."
  - techniqueId: "T1589"
    techniqueName: "Gather Victim Identity Information"
    tactic: "Reconnaissance"
    notes: "Microsoft reported that DEV-0537 gathered knowledge about employees, help desks, workflows, and business relationships before social-engineering activity."
  - techniqueId: "T1114.002"
    techniqueName: "Remote Email Collection"
    tactic: "Collection"
    notes: "Microsoft reported DEV-0537 access to personal email accounts and use of account recovery paths to support further access."
  - techniqueId: "T1485"
    techniqueName: "Data Destruction"
    tactic: "Impact"
    notes: "Microsoft described observed DEV-0537 activity as including destructive elements and a model focused on exfiltration and destruction rather than ransomware payload deployment."
attributionConfidence: "A3"
attributionRationale: "CISA's CSRB report describes LAPSUS$ as a loosely organized transnational criminal group and states that the Board received no evidence suggesting affiliation with a nation-state or political entity. Microsoft tracks related activity as DEV-0537, later Strawberry Tempest."
reviewStatus: "draft_ai"
generatedBy: "dangermouse-bot"
generatedDate: 2026-05-12
tags:
  - "extortion"
  - "social-engineering"
  - "identity"
  - "mfa"
  - "sim-swapping"
  - "data-theft"
sources:
  - url: "https://www.cisa.gov/resources-tools/resources/review-attacks-associated-lapsus-and-related-threat-groups-report"
    publisher: "CISA"
    publisherType: "government"
    reliability: "R1"
    publicationDate: "2023-08-10"
    accessDate: "2026-05-12"
    archived: false
  - url: "https://www.microsoft.com/en-us/security/blog/2022/03/22/dev-0537-criminal-actor-targeting-organizations-for-data-exfiltration-and-destruction/"
    publisher: "Microsoft Security"
    publisherType: "vendor"
    reliability: "R1"
    publicationDate: "2022-03-22"
    accessDate: "2026-05-12"
    archived: false
  - url: "https://www.cisa.gov/sites/default/files/2023-08/CSRB_Lapsus%24_508c.pdf"
    publisher: "CISA"
    publisherType: "government"
    reliability: "R1"
    publicationDate: "2023-08-10"
    accessDate: "2026-05-12"
    archived: false
---

## Executive Summary

LAPSUS$ was a loosely organized cybercriminal extortion group associated with identity-focused intrusions, data theft, social engineering, and public pressure through online channels. [CISA: Review Of The Attacks Associated with LAPSUS$ And Related Threat Groups Report](https://www.cisa.gov/resources-tools/resources/review-attacks-associated-lapsus-and-related-threat-groups-report) published the Cyber Safety Review Board's review of LAPSUS$ and related groups in August 2023.

[Microsoft Security: DEV-0537 criminal actor targeting organizations for data exfiltration and destruction](https://www.microsoft.com/en-us/security/blog/2022/03/22/dev-0537-criminal-actor-targeting-organizations-for-data-exfiltration-and-destruction/) tracks the activity as DEV-0537 and later Strawberry Tempest. Microsoft reported that the actor used a pure extortion and destruction model without deploying ransomware payloads, targeting organizations across government, technology, telecom, media, retail, healthcare, and other sectors.

## Notable Campaigns

The CSRB report focused on attacks associated with LAPSUS$ and related threat groups during the 2021-2022 period. The Board described LAPSUS$ as operating against a broader criminal ecosystem and noted that the group used public channels, including Telegram, to discuss operations and pressure victims.

Microsoft reported in March 2022 that DEV-0537 had accelerated activity against multiple organizations, with Microsoft teams conducting detection, customer notification, threat intelligence briefings, and industry coordination. Microsoft also reported that the actor publicly announced attacks on social media and advertised interest in buying credentials from employees of target organizations.

## Technical Capabilities

LAPSUS$ and related groups relied heavily on identity and social-engineering tradecraft. Microsoft reported tactics including phone-based social engineering, SIM swapping, access to personal email accounts, payment offers to employees or suppliers for credentials and MFA approval, and intrusion into target crisis-communication calls. The CSRB report similarly emphasized identity and access management weaknesses, telecommunications-provider weaknesses, and outsourced support relationships.

Microsoft reported that DEV-0537 used stolen credentials and session tokens to access internet-facing systems such as VPN, RDP, VDI, and identity-provider platforms. The actor also used MFA prompt abuse, session token replay, repository and collaboration-platform searches for credentials, AD Explorer, Mimikatz, and ntdsutil during intrusions described by Microsoft.

## Attribution

The CSRB described LAPSUS$ as a loosely organized transnational threat actor group. It stated that the Board received no evidence suggesting that LAPSUS$ was affiliated with a nation-state or political entity, and it avoided definitive attribution for all attacks associated with the activity set.

Public reporting reviewed by the CSRB indicated that some perpetrators were teenagers and that law enforcement and juvenile cybercrime prevention were relevant response considerations. Those observations should not be generalized to every participant or related intrusion unless a source directly supports the claim.

## MITRE ATT&CK Profile

T1078 - Valid Accounts: Microsoft reported DEV-0537 use of stolen credentials and session tokens to access VPN, RDP, VDI, and identity-provider systems.

T1621 - Multi-Factor Authentication Request Generation: Microsoft and the CSRB reported MFA prompt abuse, including repeated prompts intended to obtain user approval.

T1539 - Steal Web Session Cookie: Microsoft reported use of session token replay and stolen session tokens to satisfy access requirements.

T1589 - Gather Victim Identity Information: Microsoft reported that DEV-0537 gathered information about employees, help desks, workflows, and business relationships before social-engineering attempts.

T1114.002 - Remote Email Collection: Microsoft reported access to personal email accounts and account-recovery paths as part of identity-focused intrusion activity.

T1485 - Data Destruction: Microsoft described DEV-0537 activity as including destructive elements and a model focused on data exfiltration and destruction.

## Sources & References

- [CISA: Review Of The Attacks Associated with LAPSUS$ And Related Threat Groups Report](https://www.cisa.gov/resources-tools/resources/review-attacks-associated-lapsus-and-related-threat-groups-report) — CISA, 2023-08-10
- [Microsoft Security: DEV-0537 criminal actor targeting organizations for data exfiltration and destruction](https://www.microsoft.com/en-us/security/blog/2022/03/22/dev-0537-criminal-actor-targeting-organizations-for-data-exfiltration-and-destruction/) — Microsoft Security, 2022-03-22
- [CISA: Review of the Attacks Associated with LAPSUS$ and Related Threat Groups](https://www.cisa.gov/sites/default/files/2023-08/CSRB_Lapsus%24_508c.pdf) — CISA, 2023-08-10
