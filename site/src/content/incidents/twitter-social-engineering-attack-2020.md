---
eventId: TP-2020-0001
title: "Twitter High-Profile Account Takeover via Social Engineering"
date: 2020-07-15
attackType: Financial
severity: high
sector: Technology
geography: United States
threatActor: Unknown
attributionConfidence: A1
reviewStatus: draft_ai
confidenceGrade: A
generatedBy: dangermouse-bot
generatedDate: 2026-04-16
cves: []
relatedSlugs: []
tags:
  - social-engineering
  - account-takeover
  - cryptocurrency
  - twitter
  - insider-threat
  - financial-fraud
  - vishing
sources:
  - url: "https://www.justice.gov/usao-ndca/pr/three-individuals-charged-alleged-roles-twitter-hack"
    publisher: "U.S. Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2020-07-31"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.fbi.gov/news/press-releases/fbi-san-francisco-division-investigating-twitter-hack"
    publisher: "FBI"
    publisherType: government
    reliability: R1
    publicationDate: "2020-07-16"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://blog.twitter.com/en_us/topics/company/2020/an-update-on-our-security-incident"
    publisher: "Twitter"
    publisherType: vendor
    reliability: R1
    publicationDate: "2020-07-30"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.nytimes.com/2020/07/15/technology/twitter-hack-bill-gates-elon-musk.html"
    publisher: "The New York Times"
    publisherType: media
    reliability: R2
    publicationDate: "2020-07-15"
    accessDate: "2026-04-16"
    archived: false
mitreMappings:
  - techniqueId: T1566.004
    techniqueName: "Phishing: Spearphishing Voice"
    tactic: "Initial Access"
    notes: "Attackers used phone-based social engineering (vishing) to trick Twitter employees into providing credentials."
  - techniqueId: T1078
    techniqueName: "Valid Accounts"
    tactic: "Persistence"
    notes: "Compromised employee credentials provided access to Twitter's internal administration tools."
  - techniqueId: T1098
    techniqueName: "Account Manipulation"
    tactic: "Persistence"
    notes: "Attackers modified account settings including email addresses and two-factor authentication to take over verified accounts."
---

## Summary

On July 15, 2020, a coordinated social engineering attack compromised 130 Twitter accounts, including high-profile verified accounts belonging to Barack Obama, Joe Biden, Elon Musk, Bill Gates, Jeff Bezos, Apple, Uber, and numerous cryptocurrency organizations. The attackers used the compromised accounts to post messages promoting a Bitcoin scam, directing victims to send Bitcoin to a specified wallet address with the promise of receiving double the amount in return.

The attack was enabled by a phone-based social engineering (vishing) campaign targeting Twitter employees. The attackers impersonated IT department staff and convinced employees to provide their credentials to a phishing site that mimicked Twitter's internal VPN login page. With these credentials, the attackers accessed Twitter's internal administration tools, which allowed them to reset email addresses, disable two-factor authentication, and post tweets from any account.

Within hours of the fraudulent tweets being posted, the Bitcoin wallet associated with the scam received approximately $120,000 in Bitcoin from victims. Twitter responded by temporarily disabling the ability for all verified accounts to tweet, an emergency action that highlighted the severity of the compromise. Three individuals were subsequently arrested and charged by the U.S. Department of Justice.

## Technical Analysis

The attack began with telephone calls to Twitter employees, a technique known as voice phishing or vishing. The attackers identified themselves as Twitter IT support staff and directed employees to a website that replicated the appearance of Twitter's internal VPN login page. When employees entered their credentials on the phishing site, the attackers captured them in real time.

The attackers initially targeted lower-level Twitter employees who did not have direct access to the internal account administration tools. However, the credentials obtained from these employees provided access to Twitter's internal network and Slack channels, which the attackers used to identify employees with access to the administration tools. The attackers then targeted those specific employees with additional vishing calls.

Once the attackers obtained credentials for employees with administration tool access, they used Twitter's internal "Agent Tools" to take control of targeted accounts. The process involved changing the email address associated with a target account, disabling two-factor authentication, and then using the password reset functionality to gain full control of the account.

Twitter's internal tools, designed for legitimate support operations such as assisting users locked out of their accounts, provided extensive access to account settings without requiring additional authorization or approval workflows for sensitive operations. The absence of additional access controls on high-value operations like email changes and two-factor authentication disablement enabled the attack to proceed rapidly.

The attackers targeted 130 accounts, successfully tweeted from 45, accessed the direct message inbox of 36, and downloaded the Twitter data archive of 7 accounts.

## Attack Chain

### Stage 1: Employee Reconnaissance

The attackers identified Twitter employees through LinkedIn and other sources, targeting individuals in IT support and operations roles.

### Stage 2: Voice Phishing Campaign

Attackers called Twitter employees, impersonating IT department staff and directing them to a credential-harvesting phishing site that mimicked Twitter's internal VPN login page.

### Stage 3: Internal Network Access

Compromised employee credentials provided access to Twitter's internal network, Slack workspace, and internal documentation that identified employees with elevated privileges.

### Stage 4: Privilege Escalation via Targeted Vishing

The attackers conducted additional vishing calls targeting employees identified as having access to Twitter's account administration tools, successfully obtaining their credentials.

### Stage 5: Account Takeover

Using the internal administration tools, the attackers modified email addresses and disabled two-factor authentication on targeted high-profile accounts, gaining full control.

### Stage 6: Bitcoin Scam Deployment

The attackers posted fraudulent tweets from compromised accounts promoting a Bitcoin doubling scam, directing victims to send cryptocurrency to a controlled wallet address.

## Impact Assessment

The direct financial impact of the Bitcoin scam was approximately $120,000, a relatively modest sum given the scale of the platform compromise. However, the incident exposed fundamental security weaknesses in one of the world's most prominent social media platforms and raised concerns about the potential for more damaging uses of such access.

The attackers could have accessed private direct messages from compromised accounts, potentially including communications of political leaders, business executives, and other high-profile individuals. Twitter confirmed that the attackers accessed the DM inbox of 36 accounts, though the contents of those messages were not publicly disclosed.

The incident temporarily disrupted Twitter's operations, as the company disabled tweeting for all verified accounts during the response. This affected millions of users and organizations that rely on Twitter for communication, including news organizations, emergency services, and government agencies.

Twitter's stock price declined approximately 4% following the disclosure. The incident prompted regulatory scrutiny, with the New York State Department of Financial Services launching an investigation into Twitter's security practices.

The attack demonstrated the risk posed by insider-access social engineering and the potential consequences when administrative tools lack adequate access controls and audit mechanisms for sensitive operations.

## Attribution

The U.S. Department of Justice charged three individuals in connection with the Twitter attack. Graham Ivan Clark, a 17-year-old from Tampa, Florida, was identified as the primary organizer. Mason John Sheppard, 19, of Bognor Regis, United Kingdom, and Nima Fazeli, 22, of Orlando, Florida, were also charged.

Clark was charged by Florida state prosecutors with 30 felony counts including organized fraud, communications fraud, and identity theft. He pleaded guilty in March 2021 and was sentenced to three years in a juvenile detention facility followed by three years of probation. The relatively light sentence reflected his age at the time of the offense and the terms of the plea agreement.

Sheppard was charged with conspiracy to commit wire fraud, conspiracy to commit money laundering, and intentional access of a protected computer. Fazeli was charged with aiding and abetting the intentional access of a protected computer.

The investigation was conducted by the FBI, the IRS Criminal Investigation division, and the U.S. Secret Service, with coordination from Florida law enforcement. The rapid identification and arrest of the suspects — within two weeks of the attack — was facilitated by cryptocurrency tracing of the Bitcoin transactions.

## Timeline

### 2020-07-15 — Vishing Campaign and Initial Access

Attackers began calling Twitter employees, successfully obtaining credentials through voice phishing and gaining access to internal systems.

### 2020-07-15 — Account Takeovers Begin

The attackers used Twitter's internal administration tools to take control of high-profile verified accounts, changing email addresses and disabling two-factor authentication.

### 2020-07-15 — Bitcoin Scam Tweets Posted

Fraudulent tweets promoting a Bitcoin doubling scam were posted from compromised accounts including those of Barack Obama, Joe Biden, Elon Musk, Bill Gates, and Apple.

### 2020-07-15 — Twitter Disables Verified Account Tweeting

Twitter took the extraordinary step of temporarily preventing all verified accounts from posting tweets while the incident was investigated and contained.

### 2020-07-16 — FBI Investigation Announced

The FBI San Francisco Division announced it was investigating the Twitter hack.

### 2020-07-30 — Twitter Security Update

Twitter published a detailed account of the incident, confirming that 130 accounts were targeted, 45 were tweeted from, 36 had DMs accessed, and 7 had data archives downloaded.

### 2020-07-31 — DOJ Charges Filed

The Department of Justice announced charges against three individuals — Graham Ivan Clark, Mason John Sheppard, and Nima Fazeli — for their roles in the attack.

### 2021-03-16 — Clark Sentenced

Graham Ivan Clark pleaded guilty and was sentenced to three years in juvenile detention and three years of probation.

## Remediation & Mitigation

The Twitter attack highlighted the need for organizations to defend against social engineering targeting employees, particularly those with access to sensitive internal tools. Key mitigations include implementing phishing-resistant multi-factor authentication (such as hardware security keys) for all employee accounts, establishing verification procedures for IT support requests that do not rely solely on caller identity claims, and implementing access controls on sensitive administrative operations.

Organizations with internal administration tools should implement tiered access controls that require additional authorization for high-impact operations such as modifying account security settings on high-value accounts. Audit logging and real-time alerting on administrative actions can enable rapid detection of unauthorized tool use.

Employee security awareness training should include specific scenarios for voice phishing attacks, and organizations should establish clear policies for how IT support requests are initiated and verified. Call-back procedures, out-of-band verification, and restricted channels for credential-related support can reduce the effectiveness of vishing campaigns.

The incident also demonstrated the importance of the principle of least privilege: administrative tools should provide only the minimum access necessary for each support function, with sensitive capabilities gated behind additional approval workflows.

## Sources & References

- [DOJ: Three Individuals Charged for Alleged Roles in Twitter Hack](https://www.justice.gov/usao-ndca/pr/three-individuals-charged-alleged-roles-twitter-hack) — U.S. Department of Justice, 2020-07-31
- [FBI: San Francisco Division Investigating Twitter Hack](https://www.fbi.gov/news/press-releases/fbi-san-francisco-division-investigating-twitter-hack) — FBI, 2020-07-16
- [Twitter: An Update on Our Security Incident](https://blog.twitter.com/en_us/topics/company/2020/an-update-on-our-security-incident) — Twitter, 2020-07-30
- [NYT: Twitter Hack — Bill Gates, Elon Musk](https://www.nytimes.com/2020/07/15/technology/twitter-hack-bill-gates-elon-musk.html) — The New York Times, 2020-07-15
