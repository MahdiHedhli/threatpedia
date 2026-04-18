---
eventId: TP-2026-0031
title: Microsoft 365 OAuth Device Code Phishing Campaign Hits 340+ Organizations
date: 2026-02-19
attackType: phishing
severity: high
sector: Multi-Sector
geography: United States, Canada, Australia, New Zealand, Germany
threatActor: EvilTokens-linked phishing infrastructure
attributionConfidence: A4
reviewStatus: under_review
confidenceGrade: C
generatedBy: new-threat-intel
generatedDate: 2026-02-19
cves: []
relatedSlugs:
  - "frostarmada-soho-dns-hijacking-2026"
tags:
  - "phishing"
  - "oauth"
  - "device-code"
  - "mfa-bypass"
  - "token-theft"
  - "microsoft-365"
  - "phaas"
  - "credential-theft"
  - "railway"
  - "cloudflare-workers"
---
## Executive Summary

A sophisticated phishing campaign launched in mid-February 2026 compromised more than 340 organizations by abusing Microsoft's OAuth device code authentication flow. Huntress and later Sekoia linked the infrastructure and phishing kit to the EvilTokens phishing-as-a-service (PhaaS) platform, which industrialized device-code phishing by combining Cloudflare Workers landing pages with Railway-hosted token-replay infrastructure.

The attack chain is evasive because the victim ultimately authenticates on the legitimate Microsoft device login page, not on a fake password-collection form. The attacker generates a device code, lures the victim through a decoy page or email, and persuades the victim to complete the sign-in on `microsoft.com/devicelogin`. Once the victim finishes the flow, the attacker redeems the resulting access and refresh tokens from actor-controlled infrastructure. Huntress observed the strongest initial concentration of victim organizations in the United States, Canada, Australia, New Zealand, and Germany, with later reporting indicating broader global adoption of the kit.

This campaign should not be flattened into a single confirmed nation-state attribution. Device-code phishing has also been used by other Russia-aligned clusters such as Storm-2372, but the 2026 Railway-centered campaign reviewed here is best described as EvilTokens-linked phishing infrastructure with broad downstream abuse potential.

## Technical Analysis

### Attack Mechanism: OAuth Device Code Flow Abuse

The device code authentication flow is a legitimate OAuth 2.0 mechanism designed for devices with limited input capability. In the abuse pattern documented by Huntress and later Sekoia, the attacker first requests a legitimate device code from Microsoft, then delivers that code to the victim through a phishing lure. The victim is instructed to continue to the legitimate Microsoft device-login experience and enter the supplied code, after which the attacker redeems the resulting tokens from their own infrastructure.

That distinction matters: public reporting on this campaign did not primarily describe a fake password page that steals the user's Microsoft password or MFA secret directly. Instead, the campaign abused a legitimate Microsoft authentication workflow and relied on social engineering to trick the victim into completing it on the attacker's behalf.

### Infrastructure & Evasion Tactics

The EvilTokens platform leverages multiple evasion layers:

Cloudflare Workers: Decoy pages and redirect logic were commonly hosted on `workers.dev` infrastructure to blend into trusted web traffic
Railway.com PaaS: Huntress observed a narrow block of Railway IPs functioning as the token replay engine once device code authentication succeeded
Security vendor cloaking: Phishing URLs were sometimes wrapped in legitimate redirects from products such as Cisco Umbrella, Trend Micro, and Mimecast
Template spoofing: The kit offered decoy pages impersonating Microsoft 365, Adobe Acrobat, DocuSign, SharePoint, and other business workflows before sending the victim to the legitimate Microsoft sign-in flow

This multi-layer approach degrades many traditional email and URL-reputation controls because the victim eventually interacts with legitimate Microsoft infrastructure and the attacker only needs the resulting token set.

### Token Persistence & MFA Bypass

A critical vulnerability in this attack is the persistence of OAuth refresh tokens:

Once an attacker captures a refresh token, they can obtain new access tokens without re-entering credentials
Refresh tokens remain valid even after the victim changes their password
The attacker does not need to steal the user's password if the victim completes the device code flow for them
Organizations without token-aware response controls may miss the compromise until suspicious mailbox or token activity is detected

This creates a significant detection gap: organizations may only become aware of compromise weeks or months after the initial phishing attack.

Attack Stages

### Stage 1: Phishing Email Delivery
Attacker sends spearphishing emails with lures related to financial transactions, meeting invitations, logistics updates, payroll information, construction bids, or voicemail notifications. Email headers are spoofed to appear from trusted internal senders or partners.

### Stage 2: Initial Redirect via Security Vendor
Phishing link directs through legitimate security vendor redirects (e.g., Cisco Umbrella safe browsing, Trend Micro URL reputation lookup) to create a chain of trust and evade email gateway reputation checks.

### Stage 3: Landing on Decoy Page
Victim reaches a decoy page hosted through Cloudflare Workers or adjacent infrastructure. The page presents a lure theme and provides the attacker-generated verification code.

### Stage 4: Legitimate Microsoft Device Login
Victim is redirected to the legitimate Microsoft device login experience and enters the attacker-provided code, then completes normal authentication and MFA.

### Stage 5: Token Harvesting
After the victim completes the legitimate device-code flow, the attacker redeems the corresponding access and refresh tokens from Railway-hosted infrastructure. Those tokens can grant access to Exchange Online, SharePoint, OneDrive, Teams, and other cloud resources.

### Stage 6: Post-Compromise Activity
Attacker uses stolen tokens to access email, exfiltrate data, establish persistence, deploy malware, or pivot to other cloud services. Refresh token validity ensures continued access even if victim password is reset.

## MITRE ATT&CK Mapping

T1566.002 — Phishing: Spearphishing Link
Targeted emails and lure pages directed victims into the attacker-controlled device-code workflow.

T1528 — Steal Application Access Token
The core objective of the campaign was theft of Microsoft access and refresh tokens created by the device code flow.

T1550.001 — Use Alternate Authentication Material: Application Access Token
Stolen OAuth tokens were then used to access Microsoft 365 services without re-entering credentials.

## Impact Assessment

Scope of Compromise: 340+ organizations across multiple sectors and geographies. Confirmed victims in:

United States
Canada
Australia
New Zealand
Germany

Sectoral Impact:

Construction and building services
Non-profit organizations
Real estate and property management
Manufacturing and industrial operations
Financial services and banking
Healthcare and life sciences
Legal services and law firms
Government agencies (local, state, federal)

Data Exposure Risks:

Email content compromise (Exchange Online access via stolen tokens)
Document theft (SharePoint, OneDrive exfiltration)
Real-time collaboration compromise (Teams message history, video recordings)
Calendar and meeting information disclosure
Contact directory and organizational hierarchy exposure
Lateral movement to connected SaaS applications (Salesforce, Slack, Jira, etc.) via OAuth token reuse

Operational Impact:

Business email compromise (BEC) and wire fraud facilitation
Ransomware deployment and extortion
Persistence establishment for long-term espionage
Supply chain attacks on downstream partners
Regulatory and compliance violations (HIPAA, GLBA, GDPR)

## Timeline

Mid-February 2026
EvilTokens appears on Telegram channels advertising Microsoft-focused phishing-as-a-service capabilities

February 18, 2026
Unit 42 and other researchers later identify early activity tied to the same device-code phishing infrastructure

February 19, 2026
Huntress publishes initial detection of Railway.com-based token replay campaign; public awareness begins

March 2-19, 2026
Huntress documents a wave of compromises affecting more than 340 organizations, with concentrated victimology in five countries and multiple lure themes

March 25, 2026
The Hacker News summarizes Huntress findings and notes later attribution of the infrastructure to EvilTokens

March 30, 2026
Sekoia publishes a deeper analysis of EvilTokens as a turnkey Microsoft device-code phishing kit

April 6, 2026
Microsoft publishes separate research on an AI-enabled device-code phishing campaign, reinforcing that the technique is now being reused by multiple actor sets and should not be attributed wholesale to a single cluster

## Remediation & Mitigation

Immediate Actions

Identify Compromised Accounts:

Check email logs for abnormal access patterns, unusual geographic locations, or off-hours activity
Review Azure AD sign-in logs for device code authentication flows from unusual IP addresses (especially 162.220.232.x and 162.220.234.x ranges)
Search for authenticated sessions from Railway.com or Cloudflare Worker IP ranges

Revoke Compromised Tokens:

Force password reset for suspected victims (password reset alone does not invalidate existing refresh tokens)
Use Azure AD's "Sign out all sessions" capability to invalidate all active tokens
Revoke OAuth app consent permissions in Microsoft 365 admin portal
Monitor Azure AD for unauthorized consent grants to OAuth applications created by attackers

Contain Spread:

Block IOC IP addresses at firewall and proxy level
Block or scrutinize Railway and `workers.dev` infrastructure associated with active phishing activity where operationally feasible
Add known phishing email addresses to blocklist

Detection & Monitoring

Email Security:

Configure advanced phishing detection rules for device code lures and "verify identity" language
Train users that unsolicited requests to enter a code on `microsoft.com/devicelogin` can be malicious even if the page itself is legitimate
Implement external email banners to warn of untrusted senders
Monitor for emails forwarded through security vendor redirects (Cisco, Trend Micro, Mimecast) that terminate on attacker infrastructure

Cloud Access Management:

Enable Azure AD sign-in risk detection and conditional access policies to flag device code authentications from unusual locations
Monitor OAuth consent grants; alert on any new third-party application approvals
Review service principal activities in Azure AD; identify unauthorized applications with high permission levels

Network Detection:

Block or alert on traffic to Railway.com and Cloudflare Worker IP ranges
Monitor DNS queries for suspicious OAuth-related subdomains (e.g., device-auth-*.cloudflare.workers.dev)

Endpoint Detection:

Monitor browser history and network traffic for visits to fake Microsoft 365 or OAuth authentication domains
Alert on unusual PowerShell or Azure CLI authentication patterns from compromised accounts

Long-Term Hardening

Device Code Flow Restrictions: Disable device code authentication where it is not operationally required; consider allow-listing specific applications
Conditional Access Policies: Enforce MFA for all users, restrict authentication to managed devices, block legacy authentication protocols
Token Management: Implement token lifetime policies; configure automatic refresh token rotation; monitor for unusual token refresh patterns
User Training: Educate users on OAuth phishing tactics; emphasize that legitimate Microsoft never requests authentication via device codes in emails
Email Authentication: Implement strict SPF, DKIM, and DMARC policies to prevent domain spoofing
Threat Intelligence Integration: Subscribe to threat feeds for IoCs; automate blocking of known Railway.com and Cloudflare attacker infrastructure

## Sources & References

- [Huntress: Threat Actors Abuse Railway.com PaaS as Microsoft 365 Token Attack Infrastructure](https://www.huntress.com/blog/railway-paas-m365-token-replay-campaign) — Huntress, 2026-03-23 update
- [The Hacker News: Device Code Phishing Hits 340+ Microsoft 365 Orgs Across Five Countries via OAuth Abuse](https://thehackernews.com/2026/03/device-code-phishing-hits-340-microsoft.html) — The Hacker News, 2026-03-25
- [Microsoft Security Blog: Storm-2372 Conducts Device Code Phishing Campaign](https://www.microsoft.com/en-us/security/blog/2025/02/13/storm-2372-conducts-device-code-phishing-campaign/) — Microsoft Threat Intelligence, 2025-02-13
- [Microsoft Security Blog: Inside an AI-enabled Device Code Phishing Campaign](https://www.microsoft.com/en-us/security/blog/2026/04/06/ai-enabled-device-code-phishing-campaign-april-2026/) — Microsoft Defender Security Research, 2026-04-06

Azure AD Activity
Device code flow authentications from Railway.com IP ranges

Email Keywords
"Device Code", "Verify Identity", "Complete Authentication", "Confirm Session"

Consent Grants
Unauthorized OAuth app permissions in Azure AD tenant

Attribution

Threat Actor: EvilTokens PhaaS
Also Known As: Storm-2372, APT29 affiliates, UTA0304, UTA0307, UNK_AcademicFlare
Attribution Confidence: Confirmed (multiple security vendors)
Platforms: NOIRLEGACY GROUP Telegram channel
Operational Model: Phishing-as-a-Service (PhaaS)

Related Incidents

Business Email Compromise (BEC) via OAuth tokens
Cloud credential theft campaigns
Phishing-as-a-Service platforms
MFA bypass attacks
OAuth application abuse
