---
eventId: TP-2021-0002
title: "JBS Foods Ransomware Attack by REvil"
date: 2021-05-30
attackType: Ransomware
severity: critical
sector: Food & Agriculture
geography: Global
threatActor: REvil
attributionConfidence: A1
reviewStatus: under_review
confidenceGrade: A
generatedBy: dangermouse-bot
generatedDate: 2026-04-16
cves: []
relatedSlugs:
  - "kaseya-vsa-supply-chain-attack-2021"
tags:
  - ransomware
  - revil
  - food-supply
  - critical-infrastructure
  - ransom-payment
  - russia
  - meat-processing
sources:
  - url: "https://www.fbi.gov/news/press-releases/fbi-statement-on-jbs-cyberattack"
    publisher: "FBI"
    publisherType: government
    reliability: R1
    publicationDate: "2021-06-02"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.whitehouse.gov/briefing-room/statements-releases/2021/06/02/statement-by-nsc-spokesperson-emily-horne-on-the-jbs-cybersecurity-attack/"
    publisher: "The White House"
    publisherType: government
    reliability: R1
    publicationDate: "2021-06-02"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.reuters.com/technology/jbs-paid-11-mln-response-ransomware-attack-2021-06-09/"
    publisher: "Reuters"
    publisherType: media
    reliability: R2
    publicationDate: "2021-06-09"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa21-287a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2021-10-14"
    accessDate: "2026-04-16"
    archived: false
mitreMappings:
  - techniqueId: T1486
    techniqueName: "Data Encrypted for Impact"
    tactic: "Impact"
    notes: "REvil ransomware encrypted critical systems across JBS meat processing operations worldwide."
  - techniqueId: T1490
    techniqueName: "Inhibit System Recovery"
    tactic: "Impact"
    notes: "REvil typically deletes volume shadow copies to prevent local recovery of encrypted files."
  - techniqueId: T1078
    techniqueName: "Valid Accounts"
    tactic: "Initial Access"
    notes: "The FBI assessed that the attackers gained access through compromised credentials."
---

## Executive Summary

On May 30, 2021, JBS S.A., the world's largest meat processing company, discovered that its IT systems in North America and Australia had been compromised by ransomware. The attack, attributed by the FBI to the REvil (also known as Sodinokibi) ransomware-as-a-service operation based in Russia, forced the temporary shutdown of meat processing plants across the United States, Canada, and Australia.

JBS operates facilities that process approximately one-fifth of the U.S. beef supply and a substantial portion of pork and poultry production. The shutdown of operations affected the meat supply chain across North America and Australia, prompting concerns about food supply disruptions and price increases.

On June 9, 2021, JBS confirmed that it had paid an $11 million ransom in Bitcoin to the attackers. The company stated that the payment was made to mitigate the risk of data exfiltration and to ensure no data was leaked. JBS had restored the majority of its operations from backups by the time the ransom was paid, but made the payment as a precautionary measure. The attack occurred just weeks after the Colonial Pipeline ransomware incident, elevating concerns about ransomware threats to critical infrastructure.

## Technical Analysis

The REvil ransomware operation functioned as a ransomware-as-a-service (RaaS) model, in which core developers maintained the ransomware code and infrastructure while affiliates conducted the actual intrusion operations. The affiliate responsible for the JBS attack gained initial access to the company's network through compromised credentials, according to the FBI's assessment.

REvil ransomware employs a hybrid encryption approach. The malware generates a unique AES session key for each file, encrypts the file contents with AES, then encrypts the AES key with an RSA public key embedded in the malware. This approach ensures that decryption requires the attacker's private RSA key. The ransomware is typically configured to avoid encrypting system files and executables, ensuring that the encrypted system remains bootable and the victim can read the ransom note.

Prior to deploying the ransomware payload, the attackers likely conducted network reconnaissance, privilege escalation, and lateral movement to identify and access critical systems across JBS's operational infrastructure. REvil affiliates commonly disable endpoint security tools and delete volume shadow copies before executing encryption to maximize impact and prevent local recovery.

The attack affected JBS's IT infrastructure supporting meat processing operations in the United States, Canada, and Australia. The company's Brazilian operations were not affected. JBS took systems offline as a containment measure and engaged incident response firms and law enforcement.

## Attack Chain

### Stage 1: Initial Access

The attackers gained access to JBS's network using compromised credentials. The specific mechanism for obtaining these credentials has not been publicly disclosed.

### Stage 2: Reconnaissance and Lateral Movement

The attackers mapped JBS's network infrastructure, identified critical servers supporting meat processing operations, and escalated privileges to gain domain administrator access.

### Stage 3: Security Tool Disablement

Prior to ransomware deployment, the attackers disabled endpoint detection tools and deleted backup mechanisms including volume shadow copies to prevent recovery.

### Stage 4: Ransomware Deployment

REvil ransomware was deployed across JBS's IT infrastructure in the United States, Canada, and Australia, encrypting servers and workstations supporting meat processing operations.

### Stage 5: Ransom Demand and Negotiation

The attackers demanded a ransom payment in cryptocurrency. JBS engaged in negotiations and ultimately paid $11 million in Bitcoin.

## Impact Assessment

The attack forced the temporary suspension of meat processing operations at JBS facilities across the United States, Canada, and Australia. In the United States, JBS operates facilities that account for approximately 20% of the nation's beef processing capacity, along with substantial pork and poultry processing.

The disruption lasted approximately four days before the majority of operations were restored from backups. During this period, the USDA and White House monitored the situation for potential food supply impacts. Wholesale meat prices experienced temporary increases due to reduced processing capacity.

JBS reported paying an $11 million ransom in Bitcoin to the REvil operators. The company stated that the majority of its operations were already restored from backups at the time of payment, and the ransom was paid primarily to prevent potential data leakage and to protect customers.

The attack, coming weeks after the Colonial Pipeline incident, prompted the Biden administration to elevate ransomware to a national security priority. President Biden raised the issue of ransomware attacks originating from Russian territory during a summit with Russian President Vladimir Putin in June 2021.

## Historical Context

The FBI attributed the JBS attack to the REvil (Sodinokibi) ransomware operation in a statement published on June 2, 2021. REvil was a Russian-speaking ransomware-as-a-service group that had been active since April 2019 and was responsible for numerous high-profile ransomware attacks.

The White House confirmed the attribution and stated that the ransomware attack was conducted by a criminal organization likely based in Russia. The National Security Council engaged directly with the Russian government to convey that responsible states do not harbor ransomware criminals.

In January 2022, Russia's Federal Security Service (FSB) announced the arrest of 14 individuals associated with the REvil ransomware operation, following a request from U.S. law enforcement. The arrests included the seizure of funds, cryptocurrency, and computer equipment. This represented an unusual instance of Russian law enforcement action against ransomware operators.

## Timeline

### 2021-05-30 — Attack Discovered

JBS discovered that its IT systems in North America and Australia had been compromised by ransomware. The company began shutting down affected systems as a containment measure.

### 2021-05-31 — Plant Shutdowns

JBS suspended operations at its U.S. beef processing plants and Australian meat operations. The USDA began monitoring the situation.

### 2021-06-01 — White House Engagement

The White House announced that the National Security Council was engaging with the Russian government regarding the attack. The FBI confirmed it was investigating the incident.

### 2021-06-02 — FBI Attribution to REvil

The FBI publicly attributed the attack to the REvil ransomware organization and stated it was working to bring the threat actors to justice.

### 2021-06-03 — Operations Resume

JBS announced that the vast majority of its beef, pork, poultry, and prepared food plants were operational, with production restored from backups.

### 2021-06-09 — Ransom Payment Disclosed

JBS confirmed paying $11 million in Bitcoin to the attackers, stating the decision was made to mitigate potential risks including data exfiltration.

### 2022-01-14 — REvil Arrests in Russia

Russia's FSB announced the arrest of 14 individuals associated with REvil following a request from U.S. authorities.

## Remediation & Mitigation

The JBS attack reinforced the need for robust backup and recovery capabilities in critical infrastructure environments. JBS was able to restore the majority of operations from backups within days, limiting the operational disruption despite paying the ransom.

Organizations in the food and agriculture sector should implement comprehensive backup strategies with offline or immutable copies, deploy endpoint detection and response tools across both IT and operational environments, enforce multi-factor authentication on all remote access and privileged accounts, and segment networks between IT systems and operational technology environments.

CISA advisory AA21-287A, which specifically addresses BlackMatter and REvil ransomware variants, provides detailed mitigation guidance for organizations facing ransomware threats, including network segmentation, vulnerability management, and incident response planning.

The incident also highlighted the importance of credential security. Organizations should implement credential monitoring services that detect when employee credentials appear in underground markets or breach databases.

## Sources & References

- [FBI: Statement on JBS Cyberattack](https://www.fbi.gov/news/press-releases/fbi-statement-on-jbs-cyberattack) — FBI, 2021-06-02
- [White House: Statement on JBS Cybersecurity Attack](https://www.whitehouse.gov/briefing-room/statements-releases/2021/06/02/statement-by-nsc-spokesperson-emily-horne-on-the-jbs-cybersecurity-attack/) — The White House, 2021-06-02
- [Reuters: JBS Paid $11 Million in Response to Ransomware Attack](https://www.reuters.com/technology/jbs-paid-11-mln-response-ransomware-attack-2021-06-09/) — Reuters, 2021-06-09
- [CISA: BlackMatter Ransomware Advisory](https://www.cisa.gov/news-events/cybersecurity-advisories/aa21-287a) — CISA, 2021-10-14
