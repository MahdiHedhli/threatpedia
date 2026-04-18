---
eventId: TP-2013-0002
title: "Yahoo 2013 and 2014 Data Breaches"
date: 2013-08-01
attackType: Data Breach
severity: critical
sector: Technology
geography: United States
threatActor: "FSB-directed actors (2014 breach); unknown actor (2013 breach)"
attributionConfidence: A3
reviewStatus: "under_review"
confidenceGrade: A
generatedBy: dangermouse-bot
generatedDate: 2026-04-16
cves: []
relatedSlugs: []
tags:
  - data-breach
  - russia
  - fsb
  - email
  - technology
  - cookies
  - state-sponsored
sources:
  - url: https://www.justice.gov/opa/pr/us-charges-russian-fsb-officers-and-their-criminal-conspirators-hacking-yahoo-and-millions
    publisher: U.S. Department of Justice
    publisherType: government
    reliability: R1
    publicationDate: "2017-03-15"
    accessDate: "2026-04-16"
    archived: false
  - url: https://www.sec.gov/litigation/press/2018/2018-71.htm
    publisher: U.S. Securities and Exchange Commission
    publisherType: government
    reliability: R1
    publicationDate: "2018-04-24"
    accessDate: "2026-04-16"
    archived: false
  - url: https://www.fbi.gov/wanted/cyber/alexsey-belan
    publisher: FBI
    publisherType: government
    reliability: R1
    publicationDate: "2017-03-15"
    accessDate: "2026-04-16"
    archived: false
  - url: https://blog.yahoo.net/post/154309897759/important-security-information-for-yahoo-users
    publisher: Yahoo
    publisherType: vendor
    reliability: R1
    publicationDate: "2016-12-14"
    accessDate: "2026-04-16"
    archived: false
mitreMappings:
  - techniqueId: T1566.001
    techniqueName: "Phishing: Spearphishing Attachment"
    tactic: Initial Access
    notes: FSB officers directed criminal hackers to send spearphishing emails to targeted Yahoo employees to obtain credentials and initial network access.
  - techniqueId: T1539
    techniqueName: Steal Web Session Cookie
    tactic: Credential Access
    notes: The attackers stole Yahoo's proprietary Account Management Tool database and used it to forge authentication cookies, enabling access to any Yahoo account without the account password.
  - techniqueId: T1114
    techniqueName: Email Collection
    tactic: Collection
    notes: Using forged cookies, the attackers accessed and searched the email content of targeted accounts belonging to Russian journalists, US government officials, and financial industry employees.
---

## Executive Summary

Between 2013 and 2016, Yahoo Inc. suffered two distinct but related data breaches that collectively affected all 3 billion Yahoo user accounts, making them the largest known data breaches in history. The first breach, occurring in late 2013, compromised all Yahoo accounts but was not disclosed until December 2016. The second breach, carried out in 2014, was attributed to state-sponsored actors and compromised approximately 500 million accounts.

The 2014 breach was directed by two officers of the Russian Federal Security Service (FSB): Dmitry Dokuchaev, a deputy in the FSB's Center for Information Security (Center 18), and Igor Sushchin, also an FSB officer in the same unit. They recruited two criminal hackers, Alexsey Belan and Karim Baratov, to carry out the technical operations. The attackers obtained access to Yahoo's internal systems and exfiltrated the proprietary User Database (UDB) and Account Management Tool (AMT), enabling them to forge authentication cookies and access targeted email accounts. The larger 2013 breach, however, has never been publicly attributed to a named operator.

The breaches had direct financial consequences for Yahoo. During the pending acquisition by Verizon Communications, Yahoo was forced to reduce the sale price by $350 million after disclosing the breaches. The SEC fined Yahoo's successor entity $35 million for failing to disclose the breaches in a timely manner.

## Technical Analysis

The 2014 state-sponsored breach was technically complex. The attackers gained initial access to Yahoo's corporate network through spearphishing emails targeting Yahoo employees. Once inside, they escalated privileges until they obtained access to Yahoo's User Database (UDB), which contained user account information including names, email addresses, phone numbers, dates of birth, hashed passwords (using the MD5 algorithm), and encrypted or unencrypted security questions and answers.

The attackers also obtained a copy of Yahoo's Account Management Tool (AMT), which contained the cryptographic values needed to generate authentication cookies. With these values, the attackers could mint forged cookies — called "nonce cookies" — that authenticated to any Yahoo account without requiring the account password. This technique provided persistent, stealthy access to targeted accounts.

The FSB officers directed the criminal hackers to use the forged cookie access to search and monitor the email accounts of specific targets of intelligence interest, including Russian journalists, US and Russian government officials, and employees of financial services companies. Simultaneously, Alexsey Belan used his access for personal financial gain, searching Yahoo email accounts for gift card and credit card information and manipulating Yahoo's search engine results to drive traffic to a pharmaceutical spam affiliate program.

The 2013 breach was distinct from the 2014 intrusion. While initially reported as affecting 1 billion accounts, Yahoo later revised the figure to 3 billion — every account in the system. The 2013 breach compromised names, email addresses, telephone numbers, dates of birth, hashed passwords, and security questions and answers. The perpetrators of the 2013 breach were not publicly identified.

## Attack Chain

### Stage 1: Spearphishing Campaign

FSB officers directed criminal hackers to send targeted spearphishing emails to Yahoo employees. The emails contained attachments or links designed to steal employee credentials for Yahoo's internal systems.

### Stage 2: Internal System Access

Using stolen employee credentials, the attackers accessed Yahoo's corporate network and navigated to systems hosting the User Database and Account Management Tool. The lateral movement exploited insufficient internal access controls.

### Stage 3: Database Exfiltration

The attackers copied Yahoo's User Database containing hashed passwords and account metadata for hundreds of millions of users. They also exfiltrated the Account Management Tool data needed to forge authentication cookies.

### Stage 4: Cookie Forging

Using the stolen AMT data, the attackers generated forged authentication cookies that allowed access to any Yahoo account. This technique bypassed password-based authentication entirely.

### Stage 5: Targeted Email Surveillance

The FSB officers used the forged cookie access to monitor the email accounts of intelligence targets, while the criminal hackers simultaneously exploited the access for financial crimes.

## Impact Assessment

The combined breaches affected all 3 billion Yahoo user accounts, exposing names, email addresses, telephone numbers, dates of birth, hashed passwords (MD5), and security questions. The scale of the compromise was the largest known data breach at the time of disclosure.

The financial impact on Yahoo was substantial. The pending acquisition by Verizon Communications was renegotiated, reducing the purchase price from $4.83 billion to $4.48 billion, a reduction of $350 million. The SEC fined Altaba (Yahoo's successor entity) $35 million for failing to disclose the 2014 breach in a timely manner to investors, marking the first time the SEC penalized a company for a data breach disclosure failure.

Class-action litigation resulted in a $117.5 million settlement fund for affected users. Yahoo's Chief Information Security Officer resigned following the disclosures. The breaches exposed systemic deficiencies in Yahoo's security infrastructure, including the use of weak MD5 password hashing, insufficient internal access controls, and a corporate culture that deprioritized security investments.

The intelligence impact was assessed as severe. The targeted email surveillance provided the FSB with access to the private communications of journalists, government officials, and business executives, with potential consequences for source protection, diplomatic negotiations, and competitive intelligence.

## Historical Context

The U.S. Department of Justice indicted four individuals in March 2017 in connection with the 2014 Yahoo breach: FSB officers Dmitry Dokuchaev and Igor Sushchin, and criminal hackers Alexsey Belan and Karim Baratov. Baratov was arrested in Canada and extradited to the United States, where he pleaded guilty and was sentenced to five years in prison. Belan, a Latvian national on the FBI's Cyber Most Wanted list, remained at large in Russia. The two FSB officers were also not arrested.

The indictment detailed a direct relationship between Russian intelligence officers and criminal hackers, with the FSB providing direction and protection to the criminals in exchange for their technical capabilities. This represented a public confirmation of the widely observed model in which Russian intelligence services leverage and protect cybercriminal talent.

Attribution for the separate 2013 breach affecting 3 billion accounts was never publicly assigned.

Overall attribution confidence for this combined article is assessed as A3 because the 2014 breach was confirmed by U.S. government charges, while the larger 2013 breach remains unattributed.

## Timeline

### 2013-08-01 — First Breach Occurs

Unknown attackers breach Yahoo's systems and exfiltrate data for all Yahoo user accounts. This breach would not be discovered and disclosed until late 2016.

### 2014-01-01 — FSB-Directed Breach Begins

FSB officers Dokuchaev and Sushchin initiate the operation to compromise Yahoo's systems through directed spearphishing and credential theft.

### 2014-09-01 — Database Exfiltration Complete

The attackers exfiltrate Yahoo's User Database and Account Management Tool, enabling the forging of authentication cookies for targeted account access.

### 2016-09-22 — 2014 Breach Disclosed

Yahoo publicly discloses the 2014 breach, initially reporting 500 million accounts affected and attributing the attack to a state-sponsored actor.

### 2016-12-14 — 2013 Breach Disclosed

Yahoo discloses the separate 2013 breach, initially reporting 1 billion accounts compromised.

### 2017-03-15 — DOJ Indictment

The U.S. Department of Justice indicts two FSB officers and two criminal hackers for their roles in the 2014 breach.

### 2017-06-13 — Verizon Acquisition Closes

Verizon completes its acquisition of Yahoo at a $350 million discount from the original price.

### 2017-10-03 — 3 Billion Accounts Revised

Yahoo's successor entity, Oath (later Verizon Media), revises the 2013 breach total to 3 billion accounts, representing every Yahoo account in existence at the time.

### 2018-04-24 — SEC Fine

The SEC fines Altaba $35 million for failing to disclose the breach to investors in a timely manner.

## Remediation & Mitigation

Following the breaches, Yahoo invalidated all forged cookies and required all users to change their passwords. The company transitioned from MD5 to bcrypt for password hashing, implemented stricter access controls on internal tools, and enhanced monitoring of privileged access to user data.

The broader lessons from the Yahoo breaches include the necessity of using strong, modern password hashing algorithms (bcrypt, scrypt, or Argon2 rather than MD5 or SHA-1), the requirement to implement robust access controls on authentication infrastructure and cookie-signing keys, and the need for timely breach disclosure to regulators, investors, and affected individuals.

Organizations should treat authentication cookie-signing keys and account management tools as crown jewels requiring the highest level of protection. Cryptographic key rotation should be performed regularly, and access to key material should require multi-factor authentication with comprehensive audit logging. Security teams should monitor for anomalous cookie generation patterns that could indicate forged credentials.

The SEC enforcement action established the precedent that failure to disclose known breaches constitutes a securities violation, increasing the regulatory pressure on publicly traded companies to implement prompt disclosure procedures.

## Sources & References

- [U.S. Department of Justice: U.S. Charges Russian FSB Officers and Criminal Conspirators for Hacking Yahoo](https://www.justice.gov/opa/pr/us-charges-russian-fsb-officers-and-their-criminal-conspirators-hacking-yahoo-and-millions) — U.S. Department of Justice, 2017-03-15
- [U.S. Securities and Exchange Commission: Altaba Fined $35 Million](https://www.sec.gov/litigation/press/2018/2018-71.htm) — SEC, 2018-04-24
- [FBI: Alexsey Belan Cyber Most Wanted](https://www.fbi.gov/wanted/cyber/alexsey-belan) — FBI, 2017-03-15
- [Yahoo: Important Security Information for Yahoo Users](https://blog.yahoo.net/post/154309897759/important-security-information-for-yahoo-users) — Yahoo, 2016-12-14
