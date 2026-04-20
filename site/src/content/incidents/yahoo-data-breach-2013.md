---
eventId: TP-2013-0002
title: "Yahoo 2013 Data Breach"
date: 2013-08-01
attackType: Data Breach
severity: critical
sector: Technology
geography: United States
threatActor: Unknown
attributionConfidence: A4
reviewStatus: "draft_ai"
confidenceGrade: A
generatedBy: penfold-bot
generatedDate: 2026-04-19
cves: []
relatedSlugs:
  - "yahoo-data-breach-2014"
tags:
  - data-breach
  - yahoo
  - email
  - technology
  - credentials
  - consumer
sources:
  - url: https://blog.yahoo.net/post/154309897759/important-security-information-for-yahoo-users
    publisher: Yahoo
    publisherType: vendor
    reliability: R1
    publicationDate: "2016-12-14"
    accessDate: "2026-04-19"
    archived: false
  - url: https://www.yahoo.com/news/yahoo-says-3-billion-accounts-205639389.html
    publisher: Reuters
    publisherType: media
    reliability: R1
    publicationDate: "2017-10-03"
    accessDate: "2026-04-19"
    archived: false
  - url: https://www.sec.gov/news/press-release/2018-71
    publisher: SEC
    publisherType: government
    reliability: R1
    publicationDate: "2018-04-24"
    accessDate: "2026-04-19"
    archived: false
mitreMappings:
  - techniqueId: T1078
    techniqueName: "Valid Accounts"
    tactic: initial-access
---

## Executive Summary

In August 2013, an unknown actor breached Yahoo's internal network and exfiltrated user data for all 3 billion accounts on the platform, making it one of the largest data breaches in history. The breach went undiscovered for over three years and was first disclosed publicly in December 2016 before being revised in 2017 to reflect the full 3 billion-account scope.

This page covers the separate, unattributed 2013 breach. The distinct 2014 FSB-directed intrusion is tracked in [Yahoo 2014 Data Breach](/incidents/yahoo-data-breach-2014/).

## Technical Analysis

The exact intrusion pathway for the 2013 breach was never disclosed in exhaustive technical detail. What was eventually confirmed in 2017 was the total compromise of Yahoo's user account database. The unknown adversaries bypassed perimeter security, accessed the database layer, and extracted the raw information representing the entirety of Yahoo's user base.

The compromised data included names, email addresses, telephone numbers, dates of birth, hashed passwords, and security questions and answers. The failure of Yahoo's internal discovery meant the attackers had uncontested retention of 3 billion identities for years prior to the forced password reset.

## Attack Chain

### Stage 1: Initial Compromise

An unknown actor gained unauthorized access to Yahoo's corporate network through an unidentified vector in August 2013.

### Stage 2: Database Exfiltration

The attackers extracted the core user database containing account metadata for 3 billion users, including identifying information and hashed passwords.

## Impact Assessment

The 2013 breach was massive in volume, affecting 3 billion accounts. The breach exposed personal identifiers, password hashes, and security questions for nearly every Yahoo user at the time. It also forced broad password resets and heightened scrutiny of Yahoo's account-security practices.

## Historical Context

Attribution for the 2013 breach was never publicly assigned, even after Yahoo revised the incident to its full 3 billion-account scope. The event remains an important historical marker because it demonstrated how long a major account-compromise can go undetected when database access is not aggressively monitored.

## Timeline

### 2013-08-01 — Breach Occurs

Unknown attackers breach Yahoo's systems and exfiltrate data for all Yahoo user accounts.

### 2016-12-14 — Initial Disclosure

Yahoo publicly discloses the 2013 breach, initially reporting 1 billion accounts compromised.

### 2017-10-03 — 3 Billion Accounts Revised

Yahoo revises the 2013 breach total to 3 billion accounts, representing every Yahoo account in existence at the time.

## Remediation & Mitigation

Following the disclosure, Yahoo forced password resets and invalidated unencrypted security questions. The company migrated from MD5 to bcrypt password hashing. This event became a canonical teaching case regarding the risks of maintaining legacy, vulnerable cryptographic standards like MD5 on massive user databases.

## Sources & References

- [Yahoo: Important Security Information for Yahoo Users](https://blog.yahoo.net/post/154309897759/important-security-information-for-yahoo-users) — Yahoo, 2016-12-14
- [Yahoo/Reuters: Yahoo Says 3 Billion Accounts Were Affected by 2013 Breach](https://www.yahoo.com/news/yahoo-says-3-billion-accounts-205639389.html) — Reuters, 2017-10-03
- [CNBC: Yahoo Every Single Account Affected in 2013 Attack](https://www.cnbc.com/2017/10/03/yahoo-every-single-account-3-billion-people-affected-in-2013-attack.html) — CNBC, 2017-10-03
- [SEC: Altaba, Formerly Known as Yahoo!, Charged With Failing to Disclose Massive Cybersecurity Breach](https://www.sec.gov/news/press-release/2018-71) — SEC, 2018-04-24
