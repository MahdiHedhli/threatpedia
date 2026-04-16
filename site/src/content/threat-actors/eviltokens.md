---
name: "EvilTokens"
aliases:
  - "OAuth Access Token Theft Cluster"
  - "Session Hijackers"
affiliation: "Unknown"
motivation: "Financial"
status: active
country: "Unknown"
firstSeen: "2022"
lastSeen: "2026"
targetSectors:
  - "Finance"
  - "Technology"
  - "Cloud Services"
  - "Enterprise Software"
targetGeographies:
  - "Global"
  - "United States"
  - "Europe"
tools:
  - "EvilProxy"
  - "Muraena"
  - "Modlishka"
  - "EvilGinx2"
mitreMappings:
  - techniqueId: "T1557.001"
    techniqueName: "Adversary-in-the-Middle: LLMNR/NBT-NS Poisoning and SMB Relay"
    tactic: "Credential Access"
    notes: "Utilizes AitM phishing frameworks to proxy authentication requests in real-time, allowing for the theft of session tokens and the bypass of MFA."
  - techniqueId: "T1566.002"
    techniqueName: "Phishing: Spearphishing Link"
    tactic: "Initial Access"
    notes: "Frequently utilizes tailored phishing links delivered via email or SMS that lead to a reverse-proxy phishing page."
  - techniqueId: "T1098.005"
    techniqueName: "Account Manipulation: Device Registration"
    tactic: "Persistence"
    notes: "Once initial access is achieved via a stolen session token, the group often attempts to register a new MFA device to ensure long-term persistence."
attributionConfidence: A3
attributionRationale: "Identified as a specialized cluster of initial access brokers and financial threat actors by major cloud security vendors (Microsoft, Okta, Proofpoint) following a surge in AitM phishing campaigns in 2023."
reviewStatus: "draft_ai"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "eviltokens"
  - "aitm-phishing"
  - "token-theft"
  - "mfa-bypass"
  - "access-broker"
sources:
  - url: "https://www.microsoft.com/en-us/security/blog/2023/06/08/detecting-and-mitigating-adversary-in-the-middle-phishing-campaigns-targeting-microsoft-365/"
    publisher: "Microsoft Security"
    publisherType: vendor
    reliability: R1
    publicationDate: "2023-06-08"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.proofpoint.com/us/blog/threat-insight/broken-tokens-deep-dive-into-aitm-phishing-and-token-theft"
    publisher: "Proofpoint"
    publisherType: vendor
    reliability: R1
    publicationDate: "2023-05-15"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://attack.mitre.org/techniques/T1557/001/"
    publisher: "MITRE ATT&CK"
    publisherType: community
    reliability: R1
    publicationDate: "2023-10-21"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

EvilTokens is a descriptive name for a specialized cluster of threat actors and initial access brokers that utilize **Adversary-in-the-Middle (AitM)** phishing techniques to bypass multi-factor authentication (MFA). Emerging as a major threat in late 2022, this group focuses on the theft of session cookies and OAuth access tokens rather than traditional passwords. By proxying the authentication process between the user and the legitimate service (such as Microsoft 365 or Okta) in real-time, the group can intercept the valid session token issued by the service.

The group is primarily motivated by financial gain, either through direct business email compromise (BEC) or by selling high-value access tokens on underground marketplaces. The rise of this cluster represents a significant shift in the threat landscape, as it effectively neutralizes many common forms of MFA, such as SMS-based codes and push notifications.

## Notable Campaigns

### Mass Phishing Against Microsoft 365 Tenants
Throughout 2023, EvilTokens-linked actors launched massive, automated phishing campaigns targeting thousands of corporate Microsoft 365 tenants. These campaigns utilized sophisticated AitM frameworks to create pixel-perfect replicas of login pages that acted as live transparent proxies. Once a user provided their credentials and completed their MFA, the actors instantly exfiltrated the resulting session token, allowing them to access the user's mailbox and SharePoint files without further authentication.

### Targeting of Financial Services and IT Admins
A subset of the EvilTokens cluster specifically targets high-value accounts, such as those belonging to IT administrators and financial controllers. In these operations, the group uses highly tailored spear-phishing lures related to security alerts or pending invoices. By gaining access to an administrative session token, the actors can create new global administrator accounts, register their own MFA devices, and gain complete control over the victim organization's cloud infrastructure.

## Technical Capabilities

The core technical capability of the EvilTokens cluster is the deployment and customization of AitM reverse-proxy frameworks. Their primary tool is **EvilGinx2** and its commercial counterparts like **EvilProxy**. These tools function as a man-in-the-middle server that sits between the victim and the legitimate login page. When the victim enters their credentials, the tool forwards them to the real site and, most importantly, captures the session cookie returned by the server upon successful authentication.

Once a session token is stolen, the actors utilize automated scripts to instantly check the token's validity and the user's permissions level. They often perform "token replay" attacks to maintain access even after the victim changes their password. More advanced members of the cluster have also demonstrated the ability to modify browser-based security headers and bypass some forms of device-context conditional access.

## Attribution

The EvilTokens cluster is currently unattributed to a specific nation-state or established hacking group, though many of its members are believed to operate out of Eastern Europe. The group is largely composed of initial access brokers (IABs) and specialized phishing service providers. They often operate on a "phishing-as-a-service" model, where they sell access to their AitM infrastructure to other cybercriminals.

Security researchers from **Microsoft**, **Proofpoint**, and **Zscaler** have tracked various "clusters" of this activity (such as DEV-1101), but the fluidity of the actors and the widespread availability of the underlying tools make definitive attribution challenging. The common thread among these actors is the shared infrastructure and the use of specific, high-end AitM frameworks that are marketed on Russian-language underground forums.

## MITRE ATT&CK Profile

EvilTokens tradecraft is focused on credential access and the bypass of modern security controls:

- **T1557.001 (Adversary-in-the-Middle):** Real-time proxying of authentication sessions to capture session tokens.
- **T1566.002 (Phishing: Spearphishing Link):** Delivery of fraudulent links that point to the AitM proxy server.
- **T1539 (Steal Web Session Cookie):** The primary objective of the AitM operation—acquiring the browser cookie that represents an authenticated session.
- **T1098.005 (Account Manipulation: Device Registration):** Using the initial access to register secondary MFA devices for persistent access.

## Sources & References

- [Microsoft Security: Detecting and Mitigating AitM Phishing Campaigns Targeting Microsoft 365](https://www.microsoft.com/en-us/security/blog/2023/06/08/detecting-and-mitigating-adversary-in-the-middle-phishing-campaigns-targeting-microsoft-365/) — Microsoft Security, 2023-06-08
- [Proofpoint: Broken Tokens — Deep Dive into AitM Phishing and Token Theft](https://www.proofpoint.com/us/blog/threat-insight/broken-tokens-deep-dive-into-aitm-phishing-and-token-theft) — Proofpoint, 2023-05-15
- [MITRE ATT&CK: Technique — Adversary-in-the-Middle (T1557.001)](https://attack.mitre.org/techniques/T1557/001/) — MITRE ATT&CK, 2023-10-21
- [Zscaler: Analysis of EvilProxy phishing-as-a-service](https://www.zscaler.com/blogs/security-research/rise-evilproxy-phishing-as-a-service) — Zscaler, 2022-09-06
- [Okta Security: Alert — Protecting against AitM and Token Theft](https://www.okta.com/blog/2023/08/how-to-protect-your-identity-against-proxy-based-phishing/) — Okta, 2023-08-24
