---
eventId: TP-2014-0001
title: "Yahoo 2014 FSB Data Breach"
date: 2014-01-01
attackType: Espionage
severity: critical
sector: Technology
geography: United States
threatActor: "FSB-directed actors"
attributionConfidence: A1
attributionRationale: "2017 DOJ charges identified FSB officers Dmitry Dokuchaev and Igor Sushchin, with Alexsey Belan and Karim Baratov as the technical operators in the 2014 intrusion."
reviewStatus: "certified"
confidenceGrade: A
generatedBy: penfold-bot
generatedDate: 2026-04-19
cves: []
relatedSlugs:
  - "yahoo-data-breach-2013"
tags:
  - data-breach
  - russia
  - fsb
  - email
  - cookies
  - state-sponsored
sources:
  - url: https://www.justice.gov/opa/pr/us-charges-russian-fsb-officers-and-their-criminal-conspirators-hacking-yahoo-and-millions
    publisher: U.S. Department of Justice
    publisherType: government
    reliability: R1
    publicationDate: "2017-03-15"
    accessDate: "2026-04-19"
    archived: false
  - url: https://www.fbi.gov/wanted/cyber/alexsey-belan
    publisher: FBI
    publisherType: government
    reliability: R1
    publicationDate: "2017-03-15"
    accessDate: "2026-04-19"
    archived: false
  - url: https://blog.yahoo.net/post/154309897759/important-security-information-for-yahoo-users
    publisher: Yahoo
    publisherType: vendor
    reliability: R1
    publicationDate: "2016-12-14"
    accessDate: "2026-04-19"
    archived: false
  - url: https://www.sec.gov/litigation/press/2018/2018-71.htm
    publisher: U.S. Securities and Exchange Commission
    publisherType: government
    reliability: R1
    publicationDate: "2018-04-24"
    accessDate: "2026-04-19"
    archived: false
mitreMappings:
  - techniqueId: T1566.001
    techniqueName: "Phishing: Spearphishing Attachment"
    tactic: "Initial Access"
    notes: "FSB officers directed criminal hackers to send spearphishing emails to targeted Yahoo employees to obtain credentials and initial network access."
  - techniqueId: T1539
    techniqueName: "Steal Web Session Cookie"
    tactic: "Credential Access"
    notes: "The attackers stole Yahoo's proprietary Account Management Tool database and used it to forge authentication cookies, enabling access to any Yahoo account without the account password."
  - techniqueId: T1114
    techniqueName: "Email Collection"
    tactic: "Collection"
    notes: "Using forged cookies, the attackers accessed and searched the email content of targeted accounts belonging to Russian journalists, US government officials, and financial industry employees."
---

## Executive Summary

In 2014, Yahoo suffered a severe, state-sponsored data breach affecting approximately 500 million user accounts. The operation was directed by officers of the Russian Federal Security Service (FSB), who recruited criminal hackers Alexsey Belan and Karim Baratov to carry out the technical intrusion.

Unlike the separate, unattributed 2013 breach of 3 billion accounts, the 2014 FSB incident was a targeted espionage operation. The attackers exfiltrated Yahoo's User Database (UDB) and the cryptographic values from the Account Management Tool (AMT), allowing them to forge authentication cookies and selectively monitor the email accounts of intelligence targets. The operation is a landmark example of Russian intelligence co-opting cybercriminal talent for state-directed activity.

## Technical Analysis

The 2014 state-sponsored breach was technically complex. The attackers gained initial access to Yahoo's corporate network through spearphishing emails targeting Yahoo employees. Once inside, they escalated privileges until they obtained access to Yahoo's User Database (UDB), which contained account information including names, email addresses, phone numbers, dates of birth, hashed passwords, and security questions and answers.

More importantly, the attackers obtained a copy of Yahoo's Account Management Tool (AMT), which contained the cryptographic values needed to generate authentication cookies. With these values, the attackers minted forged cookies that authenticated to any Yahoo account without requiring the account password. This technique provided persistent, stealthy access to targeted accounts.

The FSB officers directed the criminal hackers to use the forged cookie access to search and monitor the email accounts of specific targets of intelligence interest, including Russian journalists, U.S. and Russian government officials, and employees of financial services companies. Simultaneously, Alexsey Belan used his access for personal financial gain, searching Yahoo email accounts for gift card and credit card information and manipulating Yahoo's search engine results to drive traffic to a pharmaceutical spam affiliate program.

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

The 2014 breach impacted a reported 500 million user accounts, though its severity was heavily shaped by the intelligence value of the targeted compromise rather than raw numbers. Targeted email surveillance provided the FSB with access to private communications belonging to journalists, government officials, and business executives.

Financially, the incident contributed to the renegotiation of Yahoo's acquisition by Verizon and later supported the SEC's enforcement action for failure to disclose the breach to investors in a timely manner.

## Historical Context

The U.S. Department of Justice indicted four individuals in March 2017 in connection with the 2014 Yahoo breach: FSB officers Dmitry Dokuchaev and Igor Sushchin, and criminal hackers Alexsey Belan and Karim Baratov. Baratov was arrested in Canada and extradited to the United States, where he pleaded guilty and was sentenced to five years in prison. Belan, a Latvian national on the FBI's Cyber Most Wanted list, remained at large in Russia. The two FSB officers were also not arrested.

The indictment detailed a direct relationship between Russian intelligence officers and criminal hackers, with the FSB providing direction and protection to the criminals in exchange for their technical capabilities. This represented public confirmation of the model in which Russian intelligence services leverage cybercriminal talent.

## Timeline

### 2014-01-01 — FSB-Directed Breach Begins

FSB officers Dokuchaev and Sushchin initiate the operation to compromise Yahoo's systems through directed spearphishing and credential theft.

### 2014-09-01 — Database Exfiltration Complete

The attackers exfiltrate Yahoo's User Database and Account Management Tool, enabling the forging of authentication cookies for targeted account access.

### 2016-09-22 — Breach Disclosed

Yahoo publicly discloses the 2014 breach, initially reporting 500 million accounts affected and attributing the attack to a state-sponsored actor.

### 2017-03-15 — DOJ Indictment

The U.S. Department of Justice indicts two FSB officers and two criminal hackers for their roles in the 2014 breach.

### 2018-04-24 — SEC Fine

The SEC fines Altaba $35 million for failing to disclose the breach to investors in a timely manner.

## Remediation & Mitigation

Organizations should treat authentication cookie-signing keys and account management tools as crown jewels requiring the highest level of protection. Cryptographic key rotation should be performed regularly, and access to key material should require multi-factor authentication with comprehensive audit logging. Security teams should monitor for anomalous cookie generation patterns that could indicate forged credentials.

## Sources & References

- [U.S. Department of Justice: U.S. Charges Russian FSB Officers and Criminal Conspirators for Hacking Yahoo](https://www.justice.gov/opa/pr/us-charges-russian-fsb-officers-and-their-criminal-conspirators-hacking-yahoo-and-millions) — U.S. Department of Justice, 2017-03-15
- [FBI: Alexsey Belan Cyber Most Wanted](https://www.fbi.gov/wanted/cyber/alexsey-belan) — FBI, 2017-03-15
- [Yahoo: Important Security Information for Yahoo Users](https://blog.yahoo.net/post/154309897759/important-security-information-for-yahoo-users) — Yahoo, 2016-12-14
- [U.S. Securities and Exchange Commission: Altaba Fined $35 Million](https://www.sec.gov/litigation/press/2018/2018-71.htm) — SEC, 2018-04-24
