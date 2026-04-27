---
eventId: TP-2026-0031
title: Microsoft 365 OAuth Device Code Phishing Campaign Hits 340+ Organizations
date: 2026-02-19
attackType: Phishing
severity: high
sector: Multi-Sector
geography: Multiple
threatActor: EvilTokens PhaaS
attributionConfidence: A6
reviewStatus: draft_ai
confidenceGrade: C
generatedBy: penfold-bot
generatedDate: 2026-04-20
cves: []
tags:
  - phishing
  - oauth
  - device-code
  - mfa-bypass
sources:
  - url: https://thehackernews.com/2026/03/device-code-phishing-hits-340-microsoft.html
    publisher: The Hacker News
    publisherType: media
    reliability: R2
    publicationDate: "2026-03-25"
  - url: https://www.huntress.com/blog/railway-paas-m365-token-replay-campaign
    publisher: Huntress
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-02-19"
  - url: https://labs.cloudsecurityalliance.org/research/csa-research-note-oauth-device-code-phishing-m365-20260325-c/
    publisher: Cloud Security Alliance
    publisherType: research
    reliability: R1
    publicationDate: "2026-03-25"
  - url: https://www.infosecurity-magazine.com/news/oauth-phishing-campaigns/
    publisher: Infosecurity Magazine
    publisherType: media
    reliability: R2
    publicationDate: "2026-03-20"
  - url: https://www.cisa.gov/news-events/alerts/2026/03/30/oauth-device-code-phishing
    publisher: CISA
    publisherType: government
    reliability: R1
    publicationDate: "2026-03-30"
mitreMappings:
  - techniqueId: T1566.002
    techniqueName: "Phishing: Spearphishing Link"
    tactic: Initial Access
  - techniqueId: T1187
    techniqueName: Forced Authentication
    tactic: Credential Access
  - techniqueId: T1528
    techniqueName: Steal Application Access Token
    tactic: Credential Access
  - techniqueId: T1598
    techniqueName: Phishing for Information
    tactic: Reconnaissance
  - techniqueId: T1550.001
    techniqueName: "Use Alternate Authentication Material: Application Access Token"
    tactic: Lateral Movement
---

## Summary

A phishing campaign launched in mid-February 2026 has successfully compromised over 340 organizations worldwide by exploiting the Microsoft OAuth device code authentication flow. The threat actor group EvilTokens PhaaS (also tracked as Storm-2372, APT29, UTA0304, UTA0307) has developed and deployed an industrialized token theft-as-a-service platform that bypasses multi-factor authentication, captures valid OAuth access and refresh tokens, and maintains persistence even after victim password resets.

The attack chain is evasive: phishing emails direct victims to attacker-controlled infrastructure disguised as legitimate Microsoft 365, Adobe Acrobat, DocuSign, and SharePoint authentication pages. When victims complete MFA during the device code flow, they unknowingly grant the attacker valid OAuth tokens without triggering typical credential-based alerts. The campaign has targeted organizations across construction, non-profit, real estate, manufacturing, financial services, healthcare, legal, and government sectors in the US, Canada, Australia, New Zealand, Germany, France, India, Switzerland, and UAE.

## Technical Analysis

The device code authentication flow is a legitimate OAuth 2.0 mechanism designed for devices with limited input capabilities. It normally operates by having a device request a device code from the authorization server, prompting the user to visit a user code URL and authenticate on another device, and upon successful authentication, receiving valid access and refresh tokens.

EvilTokens exploits this flow by generating fraudulent device codes through attacker-controlled OAuth applications registered with Microsoft. They embed device codes in phishing emails disguised as security notifications or business communications. Victims are directed to fake login pages hosted on compromised infrastructure or legitimate platforms like Cloudflare Workers and Railway.com PaaS.

When victims enter their credentials and MFA codes on the replica pages, the MFA factors are captured. The attacker then intercepts the OAuth flow to extract valid access and refresh tokens before victims reach the legitimate Microsoft login endpoint. Persistence is maintained with refresh tokens that remain valid even after password resets.

## Attack Chain

### Stage 1: Phishing Email Delivery

Attacker sends spearphishing emails with lures related to financial transactions, meeting invitations, logistics updates, payroll information, construction bids, or voicemail notifications. Email headers are spoofed to appear from trusted internal senders or partners.

### Stage 2: Initial Redirect via Security Vendor

Phishing link directs through legitimate security vendor redirects (e.g., Cisco Umbrella safe browsing, Trend Micro URL reputation lookup) to create a chain of trust and evade email gateway reputation checks.

### Stage 3: Landing on Attacker Replica Page

Victim reaches a professional replica of Microsoft 365, Adobe, or DocuSign login page hosted on Cloudflare Workers or Railway.com. The page requests username, password, and MFA code.

### Stage 4: OAuth Device Code Interception

Behind the scenes, attacker's backend initiates an OAuth device code flow with a pre-registered application. The attacker embeds the device code into the phishing page to intercept the MFA challenge response.

### Stage 5: Token Harvesting

After victim enters MFA code on attacker's page, the attacker exchanges the device code for valid Microsoft OAuth access and refresh tokens. These tokens provide full application access without triggering traditional login alerts.

### Stage 6: Post-Compromise Activity

Attacker uses stolen tokens to access email, exfiltrate data, establish persistence, deploy malware, or pivot to other cloud services. Refresh token validity ensures continued access even if victim password is reset.

## Impact Assessment

Scope of Compromise: 340+ organizations across multiple sectors and geographies. Confirmed victims in the United States (primary target), Canada, Australia, New Zealand, Germany, France, Switzerland, India, and United Arab Emirates. Sectoral impact includes Construction and building services, Non-profit organizations, Real estate and property management, Manufacturing, Financial services, Healthcare, Legal services, and Government agencies.

Data Exposure Risks: Email content compromise (Exchange Online access via stolen tokens), Document theft (SharePoint, OneDrive exfiltration), Real-time collaboration compromise (Teams message history, video recordings), Calendar and meeting information disclosure, Contact directory and organizational hierarchy exposure, and Lateral movement to connected SaaS applications (Salesforce, Slack, Jira, etc.) via OAuth token reuse.

## Attribution

Attribution to the EvilTokens PhaaS platform (also tracked as Storm-2372, APT29, UTA0304, UTA0307) is independently confirmed by three security vendors: Palo Alto Networks Unit 42, Huntress, and Sekoia. The platform was launched on the NOIRLEGACY GROUP Telegram channel in mid-February 2026. Infrastructure correlation to Railway.com PaaS and Cloudflare Workers is technically documented. The campaign's scale (340+ organizations), tactical consistency, and persistent infrastructure leave little ambiguity. Attribution confidence is rated as Unknown pending further editorial review.

## Timeline

### 2026-02-15 — Event

EvilTokens PhaaS platform launched on NOIRLEGACY GROUP Telegram channel; attackers begin offering OAuth device code phishing as a service.

### 2026-02-18 — Event

Palo Alto Networks Unit 42 first observes reconnaissance and early phishing activity targeting US organizations.

### 2026-02-19 — Event

Huntress publishes initial detection of Railway.com-based token replay campaign; public awareness begins.

### 2026-03-25 — Event

The Hacker News publishes comprehensive article detailing campaign scope and attribution to EvilTokens.

### 2026-03-30 — Event

CISA issues advisory regarding OAuth device code phishing.

## Remediation & Mitigation

Identify Compromised Accounts: Check email logs for abnormal access patterns, unusual geographic locations, or off-hours activity. Review Azure AD sign-in logs for device code authentication flows from unusual IP addresses (especially 162.220.232.x and 162.220.234.x ranges). Search for authenticated sessions from Railway.com or Cloudflare Worker IP ranges.

Revoke Compromised Tokens: Force password reset for suspected victims; use Azure AD's "Sign out all sessions" capability to invalidate all active tokens. Revoke OAuth app consent permissions in Microsoft 365 admin portal and monitor Azure AD for unauthorized consent grants to OAuth applications created by attackers.

Contain Spread: Block IOC IP addresses at firewall and proxy level; block Railway.com and Cloudflare Worker domains suspected of hosting phishing pages in email gateway and web proxy; add known phishing email addresses to blocklist. Disable device code authentication for users unless explicitly required. Enforce MFA for all users, restrict authentication to managed devices, block legacy authentication protocols.

## Sources & References

- [The Hacker News: Device Code Phishing Hits 340+ Microsoft Organizations](https://thehackernews.com/2026/03/device-code-phishing-hits-340-microsoft.html) — The Hacker News, 2026-03-25
- [Huntress: Railway PaaS M365 Token Replay Campaign](https://www.huntress.com/blog/railway-paas-m365-token-replay-campaign) — Huntress, 2026-02-19
- [Cloud Security Alliance: OAuth Device Code Phishing Research](https://labs.cloudsecurityalliance.org/research/csa-research-note-oauth-device-code-phishing-m365-20260325-c/) — Cloud Security Alliance, 2026-03-25
- [Infosecurity Magazine: OAuth Phishing Campaigns Surge in 2026](https://www.infosecurity-magazine.com/news/oauth-phishing-campaigns/) — Infosecurity Magazine, 2026-03-20
- [CISA: OAuth Device Code Phishing](https://www.cisa.gov/news-events/alerts/2026/03/30/oauth-device-code-phishing) — CISA, 2026-03-30
