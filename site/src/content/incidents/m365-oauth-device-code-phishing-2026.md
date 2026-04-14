---
eventId: TP-2026-0031
title: Microsoft 365 OAuth Device Code Phishing Campaign Hits 340+ Organizations
date: 2026-02-19
attackType: phishing
severity: high
sector: Multi-Sector
geography: US, Canada, Australia, New Zealand, Germany, France, India, Switzerland, UAE
threatActor: EvilTokens PhaaS (Storm-2372, APT29, UTA0304, UTA0307)
attributionConfidence: A4
reviewStatus: under_review
confidenceGrade: C
generatedBy: new-threat-intel
generatedDate: 2026-02-19
cves: []
relatedSlugs:
  - "frostarmada-soho-dns-hijacking-2026"
  - "hims-hers-shinyhunters-breach-2026"
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

A sophisticated phishing campaign launched in mid-February 2026 has successfully compromised over 340 organizations worldwide by exploiting the Microsoft OAuth device code authentication flow. The threat actor group EvilTokens PhaaS (also tracked as Storm-2372, APT29, UTA0304, UTA0307) has developed and deployed an industrialized token theft-as-a-service platform that bypasses multi-factor authentication, captures valid OAuth access and refresh tokens, and maintains persistence even after victim password resets.

The attack chain is notably evasive: phishing emails direct victims to attacker-controlled infrastructure disguised as legitimate Microsoft 365, Adobe Acrobat, DocuSign, and SharePoint authentication pages. When victims complete MFA during the device code flow, they unknowingly grant the attacker valid OAuth tokens without triggering typical credential-based alerts. The campaign has targeted organizations across construction, non-profit, real estate, manufacturing, financial services, healthcare, legal, and government sectors in the US, Canada, Australia, New Zealand, Germany, France, India, Switzerland, and UAE.

Attribution Confidence: Confirmed (validated by multiple security vendors including Palo Alto Networks Unit 42, Huntress, and Sekoia).

## Technical Analysis

Attack Mechanism: OAuth Device Code Flow Abuse

The device code authentication flow is a legitimate OAuth 2.0 mechanism designed for devices with limited input capabilities (e.g., smart TVs, IoT devices). It normally operates as follows:

Device requests a device code from the authorization server
User is prompted to visit a user code URL and authenticate on another device
Upon successful user authentication, the device receives valid access and refresh tokens

EvilTokens exploits this flow by:

Generating fraudulent device codes through attacker-controlled OAuth applications registered with Microsoft
Embedding device codes in phishing emails disguised as security notifications or legitimate business communications
Directing victims to fake login pages hosted on compromised infrastructure or legitimate platforms (Cloudflare Workers, Railway.com PaaS)
Capturing MFA factors when victims enter their credentials and MFA codes on the attacker's replica pages
Intercepting the OAuth flow to extract valid access and refresh tokens before victims reach the legitimate Microsoft login endpoint
Maintaining persistence with refresh tokens that remain valid even after password resets

Infrastructure & Evasion Tactics

The EvilTokens platform leverages multiple evasion layers:

Cloudflare Workers: Attacker-controlled functions redirect phishing traffic through legitimate Cloudflare domains, obfuscating the true origin
Railway.com PaaS: Malicious applications hosted on Railway infrastructure (IP range 162.220.232.x–162.220.234.x) provide backend credential capture and token harvesting
Security vendor cloaking: Phishing URLs wrapped in legitimate redirects from Cisco Umbrella, Trend Micro, and Mimecast security appliances to evade email gateway detection
Template spoofing: Professional HTML/CSS replicas of Microsoft 365, Adobe Acrobat, DocuSign, and SharePoint interfaces with minimal visual differences from legitimate pages

This multi-layer approach defeats many traditional security controls that rely on URL reputation, email header analysis, and sender verification.

Token Persistence & MFA Bypass

A critical vulnerability in this attack is the persistence of OAuth refresh tokens:

Once an attacker captures a refresh token, they can obtain new access tokens without re-entering credentials
Refresh tokens remain valid even after the victim changes their password
MFA bypass occurs because the victim completes the MFA challenge on the attacker's page before the legitimate Microsoft authentication server processes the request
Organizations without token-aware conditional access policies cannot detect or revoke tokens until the victim reports suspicious activity

This creates a significant detection gap: organizations may only become aware of compromise weeks or months after the initial phishing attack.

Attack Stages

Stage 1
Phishing Email Delivery
Attacker sends spearphishing emails with lures related to financial transactions, meeting invitations, logistics updates, payroll information, construction bids, or voicemail notifications. Email headers are spoofed to appear from trusted internal senders or partners.

Stage 2
Initial Redirect via Security Vendor
Phishing link directs through legitimate security vendor redirects (e.g., Cisco Umbrella safe browsing, Trend Micro URL reputation lookup) to create a chain of trust and evade email gateway reputation checks.

Stage 3
Landing on Attacker Replica Page
Victim reaches a professional replica of Microsoft 365, Adobe, or DocuSign login page hosted on Cloudflare Workers or Railway.com. The page requests username, password, and MFA code.

Stage 4
OAuth Device Code Interception
Behind the scenes, attacker's backend initiates an OAuth device code flow with a pre-registered application. The attacker embeds the device code into the phishing page to intercept the MFA challenge response.

Stage 5
Token Harvesting
After victim enters MFA code on attacker's page, the attacker exchanges the device code for valid Microsoft OAuth access and refresh tokens. These tokens provide full application access (Mail, Teams, SharePoint, OneDrive, etc.) without triggering traditional login alerts.

Stage 6
Post-Compromise Activity
Attacker uses stolen tokens to access email, exfiltrate data, establish persistence, deploy malware, or pivot to other cloud services. Refresh token validity ensures continued access even if victim password is reset.

## MITRE ATT&CK Framework Mapping

Tactic
Technique ID
Technique Name
Description

Initial Access
T1566.002
Phishing: Spearphishing Link
Targeted emails with malicious links to fake authentication pages

Credential Access
T1187
Forced Authentication
Victim credentials and MFA codes captured on replica pages

Credential Access
T1528
Steal Application Access Token
OAuth refresh and access tokens harvested via device code flow

Defense Evasion
T1598
Phishing for Information
Email lures designed to trigger credential submission

Lateral Movement
T1550.001
Use Alternate Authentication Material: Application Access Token
Stolen OAuth tokens used to access cloud services without re-authentication

## Impact Assessment

Scope of Compromise: 340+ organizations across multiple sectors and geographies. Confirmed victims in:

United States (primary target)
Canada, Australia, New Zealand
Germany, France, Switzerland
India, United Arab Emirates

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

## Attack Timeline

Mid-February 2026
EvilTokens PhaaS platform launched on NOIRLEGACY GROUP Telegram channel; attackers begin offering OAuth device code phishing as a service

February 18, 2026
Palo Alto Networks Unit 42 first observes reconnaissance and early phishing activity targeting US organizations

February 19, 2026
Huntress publishes initial detection of Railway.com-based token replay campaign; public awareness begins

Late February 2026
Campaign accelerates with increased spearphishing volume; multiple lure themes (financial, meeting, logistics, payroll) deployed

March 2026
Campaign reaches peak activity; over 340 organizations confirmed compromised; geographic expansion to EMEA and APAC regions

March 25, 2026
The Hacker News publishes comprehensive article detailing campaign scope and attribution to EvilTokens

March 30, 2026
Sekoia publishes updated threat intelligence analysis with technical deep-dive into OAuth flow abuse and evasion tactics

April 2026 (Ongoing)
Campaign continues with targeted spearphishing; new phishing templates and lures deployed to avoid email gateway updates

## Remediation & Detection

Immediate Actions

Identify Compromised Accounts:

Check email logs for abnormal access patterns, unusual geographic locations, or off-hours activity
Review Azure AD sign-in logs for device code authentication flows from unusual IP addresses (especially 162.220.232.x and 162.220.234.x ranges)
Search for authenticated sessions from Railway.com or Cloudflare Worker IP ranges

Revoke Compromised Tokens:

Force password reset for suspected victims (does not invalidate existing refresh tokens)
Use Azure AD's "Sign out all sessions" capability to invalidate all active tokens
Revoke OAuth app consent permissions in Microsoft 365 admin portal
Monitor Azure AD for unauthorized consent grants to OAuth applications created by attackers

Contain Spread:

Block IOC IP addresses at firewall and proxy level
Block Railway.com and Cloudflare Worker domains suspected of hosting phishing pages in email gateway and web proxy
Add known phishing email addresses to blocklist

Detection & Monitoring

Email Security:

Configure advanced phishing detection rules for device code lures and "verify identity" language
Block emails requesting users to "complete authentication" or "confirm credentials via device code"
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

Device Code Flow Restrictions: Disable device code authentication for users unless explicitly required; consider allow-listing specific applications
Conditional Access Policies: Enforce MFA for all users, restrict authentication to managed devices, block legacy authentication protocols
Token Management: Implement token lifetime policies; configure automatic refresh token rotation; monitor for unusual token refresh patterns
User Training: Educate users on OAuth phishing tactics; emphasize that legitimate Microsoft never requests authentication via device codes in emails
Email Authentication: Implement strict SPF, DKIM, and DMARC policies to prevent domain spoofing
Threat Intelligence Integration: Subscribe to threat feeds for IoCs; automate blocking of known Railway.com and Cloudflare attacker infrastructure

## Sources & References

The Hacker News: "Device Code Phishing Campaign Hits 340+ Microsoft 365 Organizations" — March 25, 2026
https://thehackernews.com/2026/03/device-code-phishing-hits-340-microsoft.html

Huntress: "Railway PaaS M365 Token Replay Campaign" — February 19, 2026
https://www.huntress.com/blog/railway-paas-m365-token-replay-campaign

Cloud Security Alliance: "OAuth Device Code Phishing Research" — March 25, 2026
https://labs.cloudsecurityalliance.org/research/csa-research-note-oauth-device-code-phishing-m365-20260325-c/

Infosecurity Magazine: "OAuth Phishing Campaigns Surge in 2026" — March 2026
https://www.infosecurity-magazine.com/news/oauth-phishing-campaigns/

Palo Alto Networks Unit 42: Threat intelligence research on Storm-2372 and EvilTokens PhaaS platform

Sekoia: Updated threat intelligence analysis with IOCs and YARA detection rules

Microsoft Security: OAuth device code flow security guidance and token management best practices

Key Takeaways

340+ organizations compromised by OAuth device code phishing
Attack bypasses MFA through token interception, not credential theft
Refresh tokens persist after password reset
Multi-layer evasion uses Cloudflare, Railway, and security vendor redirects
Campaign active since mid-February 2026, ongoing through April
Threat actor: EvilTokens PhaaS (Storm-2372, APT29 associates)
Global impact: US, Canada, EMEA, APAC regions
All sectors vulnerable: construction to government

IOCs (Indicators of Compromise)

Railway.com Infrastructure

IP Address
162.220.234.41

IP Address
162.220.234.66

IP Address
162.220.232.57

IP Address
162.220.232.99

IP Address
162.220.232.235

Infrastructure Patterns

Domain Pattern
*.cloudflare.workers.dev (attacker-controlled)

Domain Pattern
*.railway.app (phishing page hosting)

Redirect Pattern
Security vendor domains redirecting to attacker infrastructure

Threat Indicators

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
