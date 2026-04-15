---
name: Scattered Spider
aliases:
  - UNC3944
  - Octo Tempest
  - Muddled Libra
  - Star Fraud
  - Scatter Swine
  - 0ktapus
affiliation: Non-State (English-speaking cybercriminal collective)
motivation: Financial
status: active
country: US
firstSeen: "2022"
lastSeen: "2025"
targetSectors:
  - Technology
  - Telecommunications
  - Financial Services
  - Retail & Consumer
  - Gaming
  - Hospitality
targetGeographies:
  - United States
  - United Kingdom
  - Canada
  - Australia
knownTools:
  - ALPHV/BlackCat Ransomware
  - DragonForce Ransomware
  - Mimikatz
  - Impacket
  - ADRecon
  - Raccoon Stealer
  - ScreenConnect
  - AnyDesk
  - Splashtop
tools:
  - ALPHV/BlackCat Ransomware
  - DragonForce Ransomware
  - Mimikatz
  - Impacket
  - ADRecon
mitreMappings:
  - techniqueId: T1566.004
    techniqueName: Spearphishing Voice
    tactic: Initial Access
    notes: Core TTP - vishing help desk staff for credential resets
  - techniqueId: T1621
    techniqueName: Multi-Factor Authentication Request Generation
    tactic: Credential Access
    notes: MFA fatigue bombing of targeted employees
  - techniqueId: T1078
    techniqueName: Valid Accounts
    tactic: Persistence
    notes: Uses socially engineered credentials for persistent access
  - techniqueId: T1219
    techniqueName: Remote Access Software
    tactic: Command and Control
    notes: Deploys legitimate RMM tools (ScreenConnect, AnyDesk, Splashtop)
  - techniqueId: T1486
    techniqueName: Data Encrypted for Impact
    tactic: Impact
    notes: Deploys ransomware (ALPHV/BlackCat, DragonForce) for extortion
reviewStatus: "certified"
generatedBy: ai_ingestion
generatedDate: 2025-04-14
tags:
  - financial
  - social-engineering
  - vishing
  - ransomware
  - english-speaking
  - mfa-bypass
  - sim-swapping
---

## Overview

Scattered Spider is a financially motivated, English-speaking cybercriminal collective that emerged in mid-2022 and rapidly became one of the most prolific and impactful threat groups in the cybercrime ecosystem. Unlike traditional advanced persistent threat (APT) groups backed by nation-states, Scattered Spider's membership consists primarily of young adults and teenagers based in the United States, United Kingdom, and other English-speaking countries. Many members are associated with the broader "Com" (community) subculture of online cybercriminals.

The group is distinguished by its mastery of social engineering — particularly voice phishing (vishing) attacks targeting corporate help desks — and its ability to bypass multi-factor authentication (MFA) through a combination of SIM swapping, MFA fatigue attacks, and direct social engineering of help desk staff. Scattered Spider has partnered with ransomware-as-a-service (RaaS) operations, notably ALPHV/BlackCat and more recently DragonForce, to monetize their access through encryption and data extortion.

The FBI and CISA issued a joint advisory on Scattered Spider in November 2023, and multiple members have been arrested and charged by the US Department of Justice, though the group continues to operate.

## Tactics, Techniques & Procedures (TTPs)

**Social Engineering (Primary Attack Vector):**
Scattered Spider's core capability is voice phishing. Operatives call corporate help desks impersonating employees, using OSINT-gathered personal information to pass identity verification. They request password resets and MFA device enrollment, granting them legitimate credentials. The group also conducts SMS phishing (smishing) campaigns directing employees to credential harvesting sites that mimic corporate SSO portals.

**MFA Bypass Methods:**
- SIM swapping to intercept SMS-based MFA codes
- MFA fatigue bombing (repeated push notification approval requests)
- Social engineering help desk staff to enroll attacker-controlled MFA devices
- Targeting Okta and other identity providers directly

**Post-Access Operations:**
Once inside, the group uses:

T1078 — Valid Accounts: Maintains access through legitimately obtained credentials

T1219 — Remote Access Software: Deploys ScreenConnect, AnyDesk, and Splashtop for persistent remote access

T1003.001 — LSASS Memory: Extracts credentials from memory using Mimikatz

T1087.002 — Domain Account: Enumerates Active Directory using ADRecon and native tools

**Ransomware Partnerships:**
Scattered Spider became an affiliate of the ALPHV/BlackCat ransomware operation in 2023 and has more recently been associated with DragonForce ransomware. The group handles initial access and lateral movement, then deploys the partner's ransomware payload for double extortion (encryption + data theft).

## Targeted Industries & Organizations

Scattered Spider targets large enterprises with extensive help desk operations and identity infrastructure, including:

- **Technology**: MGM Resorts International (September 2023), Caesars Entertainment (September 2023), Twilio (August 2022), Mailchimp (August 2022)
- **Telecommunications**: Multiple telecom providers targeted for SIM swapping access
- **Financial Services**: Multiple financial institutions targeted for credential harvesting
- **Retail**: Marks & Spencer (April 2025), Co-op (April 2025)
- **Gaming/Hospitality**: Extensive targeting of Las Vegas casino and hotel operators

The group preferentially targets organizations using Okta for identity management, exploiting the centralized trust model of SSO platforms.

## Attributable Attacks Timeline

### 2022-03 — 0ktapus Campaign Begins

Scattered Spider launched a large-scale phishing campaign targeting over 130 organizations using Okta for identity management. The campaign used fake Okta login pages sent via SMS to harvest credentials and MFA tokens.

### 2022-08 — Twilio and Mailchimp Compromises

The group compromised Twilio via SMS phishing, then leveraged Twilio's access to target downstream customers including Signal and Mailchimp. This supply-chain approach demonstrated early operational sophistication.

### 2023-09 — MGM Resorts Attack

Scattered Spider compromised MGM Resorts International through a vishing attack on the company's IT help desk. The attack deployed ALPHV/BlackCat ransomware, shutting down slot machines, hotel check-in systems, and digital room keys across Las Vegas properties for over a week. Estimated financial impact exceeded 100 million USD.

### 2023-09 — Caesars Entertainment

Shortly before or concurrent with the MGM attack, the group compromised Caesars Entertainment through similar social engineering. Caesars reportedly paid approximately 15 million USD in ransom to prevent data release.

### 2023-11 — FBI/CISA Joint Advisory

The FBI and CISA released Joint Cybersecurity Advisory AA23-320A detailing Scattered Spider's TTPs, marking the group as a priority threat.

### 2024-2025 — Arrests and Continued Operations

Multiple alleged Scattered Spider members were arrested and charged by the US DOJ, including individuals in the United States and United Kingdom. Despite arrests, the group continued operations, demonstrating organizational resilience.

### 2025-04 — Marks & Spencer and UK Retail Attacks

Scattered Spider compromised Marks & Spencer and the Co-operative Group in the UK, deploying DragonForce ransomware. The M&S attack disrupted online ordering and payment systems for several weeks.

## Cross-Vendor Naming Reference

- **CrowdStrike**: Scattered Spider
- **Mandiant/Google**: UNC3944
- **Microsoft**: Octo Tempest
- **Palo Alto Unit 42**: Muddled Libra
- **Okta**: Scatter Swine, 0ktapus (campaign name)
- **MITRE ATT&CK**: Not yet assigned a G-code as of April 2025

## References & Sources

1. [Scattered Spider cybercriminal group](https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-320a) — CISA, 2023-11-16
2. [Octo Tempest crosses boundaries to facilitate extortion, encryption, and destruction](https://www.microsoft.com/en-us/security/blog/2023/10/25/octo-tempest-crosses-boundaries-to-facilitate-extortion-encryption-and-destruction/) — Microsoft Threat Intelligence, 2023-10-25
3. [Scattered Spider: The Modus Operandi](https://www.trellix.com/blogs/research/scattered-spider-the-modus-operandi/) — Trellix, 2023-11-20
4. [0ktapus: 130+ organizations targeted in advanced phishing campaign](https://blog.group-ib.com/0ktapus) — Group-IB, 2022-08-25
5. [Five alleged members of Scattered Spider cybercrime group charged](https://www.justice.gov/usao-cdca/pr/five-alleged-members-scattered-spider-cybercrime-group-charged) — US Department of Justice, 2024-11-20
