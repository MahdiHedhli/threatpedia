---
eventId: TP-2013-0002
articleType: "incident"
title: "Yahoo 2013 Data Breach"
date_start: 2013-08-01
date_disclosed: 2016-12-14
attackType: Data Breach
severity: critical
sector: Technology
geography: United States
attributionConfidence: A6
reviewStatus: "certified"
confidenceGrade: A
generatedBy: dangermouse-bot
generatedDate: 2026-04-19
cves: []
relatedSlugs:
  - "yahoo-data-breach-2014"
tags:
  - data-breach
  - email
  - technology
sources:
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
  - url: https://www.justice.gov/opa/pr/us-charges-russian-fsb-officers-and-their-criminal-conspirators-hacking-yahoo-and-millions
    publisher: U.S. Department of Justice
    publisherType: government
    reliability: R1
    publicationDate: "2017-03-15"
    accessDate: "2026-04-19"
    archived: false
mitreMappings:
  - techniqueId: T1114
    techniqueName: Email Collection
    tactic: Collection
    attackVersion: "v15.1"
    confidence: "confirmed"
    evidence: "Attacker accessed user databases to steal metadata and hashed passwords."
---

## Executive Summary

In August 2013, an unknown actor breached Yahoo's internal network and exfiltrated user data for all 3 billion accounts on the platform—representing the largest data breach in history. The breach went undiscovered for over three years until late 2016. Because of the size and scope, the incident exposed names, email addresses, telephone numbers, dates of birth, MD5 hashed passwords, and security questions for every Yahoo user at that time.

Unlike the separate 2014 Yahoo breach orchestrated by the Russian FSB, the perpetrator of the 2013 breach was never publicly identified (A6 attribution). However, this incident compounded the structural, reputational, and financial damage to Yahoo during its pending acquisition by Verizon.

## Technical Analysis

The exact intrusion pathway for the 2013 breach was never disclosed in exhaustive technical detail like the 2014 incident. What was eventually confirmed in 2017 was the total compromise of Yahoo's user account database. The unknown adversaries bypassed perimeter security, accessed the database layer, and extracted the raw information representing the entirety of Yahoo's user base.

The compromised data included names, email addresses, telephone numbers, dates of birth, hashed passwords (using the outdated and vulnerable MD5 algorithm), and encrypted or unencrypted security questions and answers. Financial information (credit cards, bank accounts) was stored symmetrically on different systems and was reportedly unaffected. The failure of Yahoo's internal discovery meant the attackers had uncontested retention of 3 billion identities for years prior to the forced password reset.

## Attack Chain

### Stage 1: Initial Compromise
An unknown actor gained unauthorized access to Yahoo's corporate network through an unidentified vector in August 2013.

### Stage 2: Database Exfiltration
The attackers extracted the core user database containing account metadata for 3 billion users, including identifying information and MD5-hashed passwords.

## Impact Assessment

The 2013 breach was unprecedented in volume, affecting 3 billion accounts. The combination of this incident and the 2014 incident resulted in significant financial depreciation for Yahoo, reducing the purchase price of its core assets by Verizon by $350 million. Furthermore, the SEC fined Yahoo's successor entity $35 million for failing to disclose the breaches to investors in a timely manner. Millions were spent settling class-action lawsuits.

## MITRE ATT&CK Mapping

### Collection
T1114 - Email Collection: The attacker successfully collected internal database resources representing the entire email and user environment.

## Timeline

### 2013-08-01 — Breach Occurs
Unknown attackers breach Yahoo systems and exfiltrate data for 3 billion accounts.

### 2016-12-14 — Initial Disclosure (1 Billion)
Yahoo publicly discloses the 2013 breach, initially estimating the affected count at 1 billion users.

### 2017-10-03 — 3 Billion Accounts Revised
Oath (Verizon Media) revises the impact of the 2013 breach to include all 3 billion Yahoo accounts.

### 2018-04-24 — SEC Fine
The SEC fines Altaba $35 million for failing to disclose the breaches quickly to investors.

## Remediation & Mitigation

Following the disclosure, Yahoo forced password resets and invalidated unencrypted security questions. The company migrated from MD5 to bcrypt password hashing. This event became a canonical teaching case regarding the risks of maintaining legacy, vulnerable cryptographic standards like MD5 on massive user databases.

## Sources & References

- [Yahoo: Important Security Information for Yahoo Users](https://blog.yahoo.net/post/154309897759/important-security-information-for-yahoo-users) — Yahoo, 2016-12-14
- [U.S. Securities and Exchange Commission: Altaba Fined $35 Million](https://www.sec.gov/litigation/press/2018/2018-71.htm) — SEC, 2018-04-24
- [U.S. Department of Justice: U.S. Charges Russian FSB Officers and Criminal Conspirators for Hacking Yahoo](https://www.justice.gov/opa/pr/us-charges-russian-fsb-officers-and-their-criminal-conspirators-hacking-yahoo-and-millions) — U.S. Department of Justice, 2017-03-15
