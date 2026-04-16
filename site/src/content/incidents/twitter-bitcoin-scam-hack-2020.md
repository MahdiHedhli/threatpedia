---
eventId: TP-2020-0002
title: "Twitter High-Profile Account Compromise"
date: 2020-07-15
attackType: Data Breach
severity: high
sector: Technology
geography: United States
threatActor: Graham Ivan Clark
attributionConfidence: A1
reviewStatus: "draft_ai"
confidenceGrade: A
generatedBy: dangermouse-bot
generatedDate: 2026-04-16
cves: []
relatedSlugs: []
tags:
  - social-engineering
  - cryptocurrency
  - social-media
  - insider-access
  - bitcoin
  - account-takeover
sources:
  - url: https://www.justice.gov/usao-ndca/pr/florida-teen-charged-twitter-hack
    publisher: U.S. Department of Justice
    publisherType: government
    reliability: R1
    publicationDate: "2020-07-31"
    accessDate: "2026-04-16"
    archived: false
  - url: https://www.fbi.gov/news/press-releases/fbi-san-francisco-investigating-twitter-hack
    publisher: FBI
    publisherType: government
    reliability: R1
    publicationDate: "2020-07-16"
    accessDate: "2026-04-16"
    archived: false
  - url: https://blog.twitter.com/en_us/topics/company/2020/an-update-on-our-security-incident
    publisher: Twitter
    publisherType: vendor
    reliability: R1
    publicationDate: "2020-07-30"
    accessDate: "2026-04-16"
    archived: false
  - url: https://www.dfs.ny.gov/Twitter_Report
    publisher: New York Department of Financial Services
    publisherType: government
    reliability: R1
    publicationDate: "2020-10-14"
    accessDate: "2026-04-16"
    archived: false
mitreMappings:
  - techniqueId: T1566.004
    techniqueName: "Phishing: Spearphishing Voice"
    tactic: Initial Access
    notes: The attackers used phone-based social engineering (vishing) to contact Twitter employees, impersonating the IT department and directing them to a credential-phishing website that captured their internal tool credentials.
  - techniqueId: T1078
    techniqueName: Valid Accounts
    tactic: Persistence
    notes: Using stolen employee credentials, the attackers accessed Twitter's internal administrative tools, which allowed them to reset email addresses and disable two-factor authentication on targeted user accounts.
  - techniqueId: T1496
    techniqueName: Resource Hijacking
    tactic: Impact
    notes: The attackers posted cryptocurrency scam messages from 130 compromised accounts, collecting approximately $120,000 in Bitcoin from victims who sent funds to the advertised wallet address.
---

## Summary

On July 15, 2020, a coordinated social engineering attack against Twitter employees resulted in the compromise of 130 high-profile Twitter accounts, including those belonging to former U.S. President Barack Obama, then-presidential candidate Joe Biden, Elon Musk, Bill Gates, Jeff Bezos, Apple, Uber, and other prominent individuals and organizations. The attackers used the compromised accounts to post a cryptocurrency scam, claiming that any Bitcoin sent to a specified wallet address would be doubled and returned.

The attack was executed by a group of young individuals led by 17-year-old Graham Ivan Clark of Tampa, Florida, along with 22-year-old Nima Fazeli of Orlando and 19-year-old Mason Sheppard of the United Kingdom. The group gained access to Twitter's internal administrative tools through a phone-based social engineering campaign (vishing) targeting Twitter employees.

The scam collected approximately $120,000 in Bitcoin before Twitter detected and shut down the operation. While the financial impact was relatively limited, the attack exposed fundamental weaknesses in the security of social media platforms used for public communication by world leaders, government officials, and major corporations. The New York Department of Financial Services (NYDFS) published a detailed investigative report characterizing Twitter's internal security controls as inadequate.

## Technical Analysis

The attack began with telephone-based social engineering (vishing). The attackers called Twitter employees, impersonating members of Twitter's IT department and claiming they were responding to a VPN connectivity issue. The attackers directed the employees to visit a phishing website that mimicked the legitimate Twitter VPN login page. When employees entered their credentials, the attackers captured them in real time.

Using the stolen credentials, the attackers accessed Twitter's internal administrative tools. Twitter's administrative environment included tools that allowed employees to view and modify user account settings, including the ability to change the email address associated with an account and disable two-factor authentication. These tools were accessible to a broad set of Twitter employees, including customer support staff, and did not require additional authentication for sensitive actions.

With access to the admin tools, the attackers changed the email addresses associated with targeted accounts to addresses they controlled, then used the password reset functionality to gain full control of the accounts. They disabled two-factor authentication on accounts where it was enabled.

The attackers initially used their access to take over and sell access to high-value Twitter usernames (known as "OG" handles) on underground forums. The Bitcoin scam was the second phase, targeting the highest-profile accounts for maximum visibility. The scam tweets were posted from 45 of the 130 compromised accounts.

Twitter's detection of the attack came when employees noticed the scam tweets and escalated internally. The company temporarily disabled the ability of all verified accounts to tweet while the incident was investigated and contained. This emergency measure affected millions of Twitter users and interrupted political communications during the 2020 presidential campaign.

## Attack Chain

### Stage 1: Vishing Campaign

The attackers called Twitter employees by phone, impersonating the IT help desk and claiming to resolve VPN issues. Employees were directed to a phishing website that replicated the Twitter VPN login page.

### Stage 2: Credential Capture

As employees entered their VPN credentials on the phishing site, the attackers captured the credentials in real time and used them to authenticate to Twitter's internal systems.

### Stage 3: Administrative Tool Access

Using the stolen credentials, the attackers accessed Twitter's internal administrative tools, which provided the ability to modify user account settings, change associated email addresses, and disable two-factor authentication.

### Stage 4: Account Takeover

The attackers changed the email addresses on targeted high-profile accounts to attacker-controlled addresses, reset passwords, and disabled 2FA, gaining full control of 130 accounts.

### Stage 5: Cryptocurrency Scam

The attackers posted Bitcoin scam messages from 45 of the compromised accounts, directing followers to send Bitcoin to a specified wallet with the false promise that contributions would be doubled and returned.

## Impact Assessment

The attack compromised 130 Twitter accounts, with scam messages posted from 45 of them. The attackers accessed the direct message inboxes of 36 accounts, downloaded the full Twitter Data archive for 8 accounts, and viewed personal information (including phone numbers and email addresses) for all 130 compromised accounts.

The financial proceeds from the Bitcoin scam totaled approximately $120,000. While modest in dollar terms, the attack demonstrated the potential for far more damaging exploitation — a compromised account belonging to a world leader could have been used to post market-moving statements, false emergency declarations, or inflammatory content with geopolitical consequences.

Twitter's temporary disabling of all verified accounts disrupted political communications, news dissemination, and public safety messaging. The incident prompted congressional scrutiny of social media platform security and internal access controls. The NYDFS report identified multiple deficiencies in Twitter's security posture, including inadequate access controls for internal tools, insufficient logging and monitoring of administrative actions, and a lack of role-based access restrictions for sensitive operations.

## Attribution

Graham Ivan Clark was arrested in Tampa, Florida, on July 31, 2020, and charged as an adult with 30 felony counts by Florida state prosecutors. Clark pleaded guilty and was sentenced to three years in juvenile detention in March 2021. Nima Fazeli was charged by federal prosecutors in the Northern District of California with aiding and abetting the intrusion. Mason Sheppard was charged by federal prosecutors with conspiracy to commit wire fraud and money laundering.

The investigation involved the FBI, the IRS Criminal Investigation Division, the U.S. Secret Service, and Florida law enforcement. The rapid identification of the attackers was facilitated by their operational security failures, including communications on platforms that cooperated with law enforcement and blockchain analysis of the Bitcoin transactions.

Attribution confidence is assessed as A1 (confirmed by government) based on arrests, guilty pleas, and convictions.

## Timeline

### 2020-07-15 14:00 UTC — Vishing Campaign

Attackers begin calling Twitter employees with social engineering pretexts, directing them to a credential-phishing website.

### 2020-07-15 17:00 UTC — Admin Tool Access Achieved

Attackers gain access to Twitter's internal administrative tools using stolen employee credentials.

### 2020-07-15 19:00 UTC — Scam Tweets Posted

Bitcoin scam messages begin appearing on high-profile accounts, including those of Barack Obama, Joe Biden, Elon Musk, and Bill Gates.

### 2020-07-15 21:00 UTC — Twitter Responds

Twitter disables the ability for all verified accounts to tweet and begins investigating the incident. Scam tweets are removed.

### 2020-07-16 — FBI Investigation Announced

The FBI San Francisco field office announces it is investigating the Twitter hack.

### 2020-07-31 — Arrests

Graham Ivan Clark is arrested in Tampa, Florida. Nima Fazeli and Mason Sheppard are charged by federal prosecutors.

### 2020-10-14 — NYDFS Report Published

The New York Department of Financial Services publishes a detailed report on the incident, identifying systemic security failures at Twitter.

### 2021-03-16 — Clark Sentenced

Graham Ivan Clark pleads guilty and is sentenced to three years in a juvenile detention facility.

## Remediation & Mitigation

Twitter implemented multiple security improvements following the attack, including restricting access to internal administrative tools, implementing additional authentication requirements for sensitive account operations, enhancing logging and monitoring of administrative actions, and conducting a comprehensive review of employee access privileges.

Organizations operating platforms with high-profile user accounts should implement strict role-based access controls for administrative tools, requiring elevated authentication (hardware security keys) for operations that modify account credentials or security settings. Administrative actions should be logged immutably and monitored in real time for anomalous patterns.

Vishing defenses should be incorporated into security awareness training programs. Employees should be trained to verify the identity of callers claiming to represent IT support through established callback procedures rather than following instructions from unsolicited calls. Organizations should implement phishing-resistant authentication methods (FIDO2/WebAuthn) that cannot be captured by credential-phishing websites.

## Sources & References

- [U.S. Department of Justice: Florida Teen Charged in Twitter Hack](https://www.justice.gov/usao-ndca/pr/florida-teen-charged-twitter-hack) — U.S. Department of Justice, 2020-07-31
- [FBI: FBI San Francisco Investigating Twitter Hack](https://www.fbi.gov/news/press-releases/fbi-san-francisco-investigating-twitter-hack) — FBI, 2020-07-16
- [Twitter: An Update on Our Security Incident](https://blog.twitter.com/en_us/topics/company/2020/an-update-on-our-security-incident) — Twitter, 2020-07-30
- [New York Department of Financial Services: Twitter Investigation Report](https://www.dfs.ny.gov/Twitter_Report) — NYDFS, 2020-10-14
