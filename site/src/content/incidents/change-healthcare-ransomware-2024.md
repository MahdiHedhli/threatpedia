---
eventId: TP-2024-0002
title: Change Healthcare Ransomware Attack
date: 2024-02-21
attackType: Ransomware
severity: critical
sector: Healthcare
geography: United States
threatActor: ALPHV/BlackCat
attributionConfidence: A3
reviewStatus: draft_ai
confidenceGrade: B
generatedBy: new-threat-intel
generatedDate: 2026-05-01
cves: []
relatedSlugs:
  - blackcat-alphv
tags:
  - ransomware
  - healthcare
  - alphv
  - blackcat
  - data-breach
  - hipaa
  - pharmacy
sources:
  - url: "https://www.unitedhealthgroup.com/newsroom/2024/2024-04-22-uhg-updates-on-change-healthcare-cyberattack.html"
    publisher: "UnitedHealth Group"
    publisherType: vendor
    reliability: R1
    publicationDate: "2024-04-22"
  - url: "https://www.unitedhealthgroup.com/newsroom/2024/2024-03-07-uhg-update-change-healthcare-cyberattack.html"
    publisher: "UnitedHealth Group"
    publisherType: vendor
    reliability: R1
    publicationDate: "2024-03-07"
  - url: "https://www.sec.gov/Archives/edgar/data/731766/000073176624000045/unh-20240221.htm"
    publisher: "U.S. Securities and Exchange Commission"
    publisherType: government
    reliability: R1
    publicationDate: "2024-02-21"
  - url: "https://www.hhs.gov/hipaa/for-professionals/special-topics/change-healthcare-cybersecurity-incident-bulletin/index.html"
    publisher: "U.S. Department of Health and Human Services"
    publisherType: government
    reliability: R1
    publicationDate: "2024-04-19"
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-353a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2023-12-19"
mitreMappings:
  - techniqueId: "T1078"
    techniqueName: "Valid Accounts"
    tactic: "Initial Access"
    notes: "Attacker used compromised credentials to access Change Healthcare's Citrix remote access portal, which lacked multi-factor authentication."
  - techniqueId: "T1486"
    techniqueName: "Data Encrypted for Impact"
    tactic: "Impact"
    notes: "ALPHV/BlackCat deployed ransomware across Change Healthcare systems, encrypting data and disrupting healthcare transaction processing."
  - techniqueId: "T1041"
    techniqueName: "Exfiltration Over C2 Channel"
    tactic: "Exfiltration"
    notes: "Approximately 6 TB of data containing protected health information was exfiltrated prior to ransomware deployment."
---

## Summary

On February 21, 2024, Change Healthcare — a subsidiary of UnitedHealth Group (UHG) and one of the largest healthcare technology companies in the United States — suffered a ransomware attack attributed to the ALPHV/BlackCat ransomware group. Change Healthcare processes approximately 15 billion healthcare transactions annually, representing roughly one-third of all U.S. patient records. The attack caused immediate disruption across the U.S. healthcare system, affecting pharmacies, hospitals, insurers, and provider billing operations for weeks.

UnitedHealth Group disclosed the incident to the U.S. Securities and Exchange Commission on February 21, 2024. In subsequent public updates and Congressional testimony, UHG confirmed that threat actors accessed Change Healthcare's systems through a compromised Citrix remote access portal that lacked multi-factor authentication. Approximately 6 TB of data was exfiltrated before ransomware was deployed. By October 2024, UHG had sent breach notifications to over 100 million individuals, making this the largest healthcare data breach in U.S. history by notification volume.

The ALPHV/BlackCat ransomware group claimed responsibility and was identified as the responsible actor in CISA and HHS advisories. UHG provided over $6 billion in accelerated payments and interest-free loans to affected healthcare providers to offset cash flow disruption during the outage period.

## Technical Analysis

The attacker gained initial access through Change Healthcare's Citrix remote access infrastructure using compromised employee credentials. UHG CEO Andrew Witty testified before Congress that the Citrix portal used to gain initial entry was not protected by multi-factor authentication (MFA). This single control gap allowed the attacker to authenticate as a legitimate user and establish a foothold within Change Healthcare's environment.

Following initial access, the attacker conducted reconnaissance and lateral movement over an undisclosed period before deploying ransomware. ALPHV/BlackCat is a ransomware-as-a-service (RaaS) operation whose affiliates use a Rust-based ransomware payload capable of targeting Windows, Linux, and VMware ESXi systems. The group employs double-extortion tactics, exfiltrating data prior to encryption to create additional leverage for ransom demands.

Approximately 6 TB of data was exfiltrated from Change Healthcare systems. The data contained protected health information (PHI), personally identifiable information (PII), and financial records belonging to patients, providers, and insurers. Following data exfiltration, ransomware was deployed to encrypt systems supporting Change Healthcare's transaction processing infrastructure, causing the immediate loss of connectivity between Change Healthcare and approximately 67,000 pharmacies, hospitals, and other provider systems.

The CISA advisory AA23-353A, published in December 2023 before this incident, documented ALPHV/BlackCat's pattern of targeting healthcare sector organizations and the technical indicators associated with the group's tooling.

## Attack Chain

### Stage 1: Credential Compromise

The attacker obtained valid credentials for a Change Healthcare employee account. The specific credential compromise method has not been publicly confirmed; however, the credentials were used to authenticate to Change Healthcare's Citrix remote access portal, which processed remote workforce connections.

### Stage 2: Initial Access via Citrix Portal

Using the compromised credentials, the attacker authenticated to Change Healthcare's Citrix environment. The portal lacked multi-factor authentication, enabling the attacker to gain access without a second verification factor. This provided an authenticated session within the Change Healthcare network perimeter.

### Stage 3: Reconnaissance and Lateral Movement

After establishing the initial foothold, the attacker conducted internal reconnaissance to identify high-value systems, data repositories, and the transaction processing infrastructure. The attacker moved laterally through the environment, escalating access to systems containing protected health information and financial data.

### Stage 4: Data Exfiltration

Prior to ransomware deployment, the attacker exfiltrated approximately 6 TB of data. Exfiltrated records included protected health information, claims data, patient and provider personal information, and financial records. This exfiltration established the basis for the group's double-extortion demands.

### Stage 5: Ransomware Deployment

The attacker deployed ALPHV/BlackCat ransomware across Change Healthcare's environment, encrypting systems that supported healthcare transaction processing, claims adjudication, pharmacy connectivity, and prior authorization workflows. The encryption caused an immediate outage affecting interconnected healthcare organizations across the United States.

## Impact Assessment

The operational impact of the attack extended across the U.S. healthcare sector for weeks following February 21, 2024. Approximately 67,000 pharmacies reported disruptions to prescription processing and insurance verification. Hospitals and provider practices lost access to electronic claims submission, prior authorization, and eligibility verification systems. Revenue cycle operations for healthcare providers were disrupted, leading to cash flow shortfalls.

UnitedHealth Group reported providing over $6 billion in accelerated payments and no-interest loans to affected healthcare providers to address the financial disruption caused by the outage. The company also disclosed costs exceeding $870 million attributed to the cyberattack as of mid-2024 SEC filings, with full recovery costs expected to exceed $1 billion.

By October 2024, UHG had issued breach notifications to over 100 million individuals, the largest volume in the history of U.S. healthcare data breach notifications under HIPAA. The affected data included: names, addresses, dates of birth, phone numbers, Social Security numbers, driver's license and state ID numbers, passport numbers, health insurance member IDs, medical record numbers, diagnoses, medication information, and financial and banking information for a subset of individuals.

The HHS Office for Civil Rights opened an investigation into UHG's HIPAA compliance and issued specific guidance clarifying that Change Healthcare — as a business associate — bore primary responsibility for breach notification to affected covered entities and, in some cases, directly to affected individuals.

## Attribution

ALPHV/BlackCat, a ransomware-as-a-service operation, claimed responsibility for the attack on its data leak site. The group stated it had exfiltrated 6 TB of data including PHI and financial records. CISA advisory AA23-353A, published in December 2023, documented ALPHV/BlackCat's targeting of healthcare sector organizations and the technical indicators associated with the group.

UHG CEO Andrew Witty confirmed before Congress in May 2024 that the ransomware group responsible was identified as ALPHV/BlackCat. UHG did not publicly dispute the group's claim of responsibility. The attribution is consistent with law enforcement assessments of ALPHV/BlackCat's operations during this period, though no government attribution statement specific to the Change Healthcare incident has been independently published by CISA or the FBI.

The attribution rests on public vendor confirmation and the group's own claim of responsibility; no independent government statement names ALPHV/BlackCat for this specific incident.

## Timeline

### 2024-02-21 — Ransomware Deployment and Initial Disclosure

Change Healthcare systems are encrypted following attacker access. UHG files an 8-K with the SEC disclosing a cybersecurity incident. Change Healthcare begins disconnecting systems to contain the spread.

### 2024-02-21 — Healthcare Sector Disruption Begins

Approximately 67,000 pharmacies and thousands of provider organizations begin reporting loss of connectivity to Change Healthcare's transaction processing services, affecting prescription fulfillment, claims, and eligibility verification.

### 2024-03-07 — UHG March Update

UHG publishes an update confirming ongoing remediation, the restoration of some pharmacy systems, and the initiation of financial assistance programs for affected providers totaling $3.3 billion in accelerated payments at that time.

### 2024-04-19 — HHS OCR Guidance Published

The U.S. Department of Health and Human Services Office for Civil Rights publishes a bulletin clarifying HIPAA breach notification obligations for covered entities and business associates affected by the Change Healthcare incident.

### 2024-04-22 — UHG April Update

UHG publishes an April update confirming that protected health information was compromised and that the company was working to notify affected individuals and entities. The company states that the Citrix portal lacked MFA and that an attacker used compromised credentials for initial access.

### 2024-05-01 — Congressional Testimony

UHG CEO Andrew Witty testifies before the U.S. Senate Finance Committee and House Energy and Commerce Committee, confirming that the Citrix portal used for initial access lacked multi-factor authentication and that the company paid a ransom demand.

### 2024-10-24 — Breach Notifications Reach 100 Million

UHG reports to HHS that breach notifications have been sent to over 100 million individuals, establishing the Change Healthcare attack as the largest healthcare data breach notification event in U.S. history.

## Remediation & Mitigation

UHG disconnected Change Healthcare systems immediately following detection to contain the ransomware deployment. Restoration of pharmacy connectivity and claims processing was conducted over a period of weeks, with some services restored in phases beginning in early March 2024. Full system restoration across all Change Healthcare services extended through late spring 2024.

The core control failure identified in public disclosures was the absence of multi-factor authentication on the Citrix remote access portal. Healthcare organizations should enforce MFA on all remote access infrastructure, including VPN and virtual desktop environments. The CISA advisory AA23-353A provides specific ALPHV/BlackCat indicators of compromise and recommended mitigations that apply to healthcare sector organizations.

HHS OCR and CISA have each recommended the following controls to reduce exposure to similar attacks: enforce MFA on all remote access systems and administrative consoles; implement network segmentation to limit lateral movement between clinical, administrative, and financial systems; apply the principle of least privilege to service accounts and administrator credentials; maintain offline and tested backups of critical data and systems; conduct regular vulnerability assessments of internet-facing systems and remote access infrastructure; and establish and test incident response and business continuity plans that account for third-party healthcare IT dependencies.

Organizations that rely on healthcare clearinghouses or transaction processors should assess their vendor concentration risk and establish contingency procedures that do not depend on single points of failure in their revenue cycle operations.

## Sources & References

- [UnitedHealth Group: UHG Update on Change Healthcare Cyberattack — April 2024](https://www.unitedhealthgroup.com/newsroom/2024/2024-04-22-uhg-updates-on-change-healthcare-cyberattack.html) — UnitedHealth Group, 2024-04-22
- [UnitedHealth Group: UHG Update on Change Healthcare Cyberattack — March 2024](https://www.unitedhealthgroup.com/newsroom/2024/2024-03-07-uhg-update-change-healthcare-cyberattack.html) — UnitedHealth Group, 2024-03-07
- [U.S. Securities and Exchange Commission: UNH Form 8-K — February 21, 2024](https://www.sec.gov/Archives/edgar/data/731766/000073176624000045/unh-20240221.htm) — U.S. Securities and Exchange Commission, 2024-02-21
- [U.S. Department of Health and Human Services: Change Healthcare Cybersecurity Incident Bulletin](https://www.hhs.gov/hipaa/for-professionals/special-topics/change-healthcare-cybersecurity-incident-bulletin/index.html) — U.S. Department of Health and Human Services, 2024-04-19
- [CISA: #StopRansomware: ALPHV Blackcat — Advisory AA23-353A](https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-353a) — CISA, 2023-12-19
