---
eventId: "TP-2026-0050"
title: "Cegedim Santé Healthcare Data Breach"
date: 2026-03-15
attackType: "Data Breach"
severity: critical
sector: "Healthcare"
geography: "France"
threatActor: "Unknown"
attributionConfidence: A4
reviewStatus: "draft_ai"
confidenceGrade: C
generatedBy: "dangermouse-bot"
generatedDate: 2026-04-16
cves: []
relatedSlugs:
  - "conduent-data-breach-2026"
  - "chipsoft-ransomware-dutch-healthcare-2026"
  - "carecloud-healthcare-breach-2026"
tags:
  - "healthcare"
  - "pii"
  - "france"
  - "social-security"
  - "medical-records"
  - "gdpr"
  - "cnil"
sources:
  - url: "https://www.cnil.fr/en/home"
    publisher: "CNIL (Commission Nationale de l'Informatique et des Libertés)"
    publisherType: government
    reliability: R1
    publicationDate: "2024-09-15"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.theregister.com/2026/03/03/french_medical_leak"
    publisher: "The Register"
    publisherType: media
    reliability: R2
    publicationDate: "2026-03-03"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.connexionfrance.com/news/doctors-records-hit-by-cyberattack-up-to-15-million-patients-in-france-affected/773980"
    publisher: "Connexion France"
    publisherType: media
    reliability: R2
    publicationDate: "2026-03-01"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.scworld.com/brief/french-healthcare-software-provider-cegedim-sante-suffers-major-data-breach"
    publisher: "SC Media"
    publisherType: media
    reliability: R2
    publicationDate: "2026-03-04"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.aa.com.tr/en/europe/15m-french-citizens-affected-by-massive-data-breach-following-cyberattack-on-medical-software/3842345"
    publisher: "Anadolu Agency"
    publisherType: media
    reliability: R2
    publicationDate: "2026-03-05"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.cyber.gouv.fr/"
    publisher: "ANSSI (Agence Nationale de la Sécurité des Systèmes d'Information)"
    publisherType: government
    reliability: R1
    publicationDate: "2026-03-10"
    accessDate: "2026-04-16"
    archived: false
mitreMappings:
  - techniqueId: "T1190"
    techniqueName: "Exploit Public-Facing Application"
    tactic: "Initial Access"
    notes: "Suspected exploitation of the public-facing MonLogicielMedical application."
  - techniqueId: "T1530"
    techniqueName: "Data from Cloud Storage Object"
    tactic: "Collection"
    notes: "Patient databases and clinical note files exfiltrated from cloud-based storage."
  - techniqueId: "T1567"
    techniqueName: "Exfiltration Over Web Service"
    tactic: "Exfiltration"
    notes: "Large-scale data exfiltration of 15.8 million records over web service channels."
  - techniqueId: "T1005"
    techniqueName: "Data from Local System"
    tactic: "Collection"
    notes: "Local system data including doctor clinical notes and administrative records accessed."
---

## Summary

Cegedim Santé, a major French healthcare technology company, suffered a critical data breach of its MonLogicielMedical (MLM) electronic health record platform that resulted in the theft of 15.8 million patient records. The breach occurred in late 2025 but was not publicly disclosed until February 27, 2026, by France24. It represents one of the largest healthcare data breaches in European history.

The stolen data includes French Social Security numbers (permanent national identifiers) and approximately 165,000 files containing doctors' free-text clinical notes with sensitive health information including HIV/AIDS status, psychiatric diagnoses, sexual orientation details, and mental health conditions. High-profile individuals including French politicians were among those whose data was extracted.

Cegedim Santé had previously been fined 800,000 EUR by France's CNIL in September 2024 for illegal health data processing violations, including insufficient pseudonymization of patient data. This prior enforcement history raises questions about the company's data security posture leading into this breach.

## Technical Analysis

The specific attack vector remains under investigation. Initial assessments suggest exploitation of the public-facing MonLogicielMedical application, potentially through unpatched vulnerabilities or misconfigured cloud storage. Analysis of the breach indicates multiple layers of security controls were either absent or ineffective.

Patient data and clinical notes appear to have been stored without proper encryption or with weak encryption at rest. The lack of data classification and segmentation allowed full database exfiltration rather than limited subset access. No evidence of detection systems flagging the massive data exfiltration has been reported. Insufficient role-based access control allowed unauthorized queries of entire datasets, and no data loss prevention mechanisms were in place to prevent or alert on sensitive health data extraction.

The breach affected approximately 1,500 of 3,800 doctors using the platform. All data types were compromised including names, genders, dates of birth, phone numbers, addresses, emails, and French Social Security numbers.

## Attack Chain

### Stage 1: Initial Compromise

Attackers gained access to the MonLogicielMedical platform through suspected exploitation of a public-facing application vulnerability or misconfigured cloud storage endpoint.

### Stage 2: Database Enumeration

The attackers systematically enumerated and accessed the complete patient database containing administrative records and clinical documentation for the MLM platform.

### Stage 3: Data Collection

15.8 million administrative patient files and 165,000 sensitive clinical note files were collected, including doctors' free-text notes containing detailed medical information.

### Stage 4: Exfiltration

The complete dataset was exfiltrated from Cegedim Santé infrastructure without triggering detection alerts, indicating either the absence of monitoring or the use of techniques that evaded existing controls.

## Impact Assessment

The breach exposed 15.8 million patient records, representing approximately one in four French citizens. The 165,000 clinical note files containing free-text health information create extreme risk for affected individuals. Exposed French Social Security numbers are permanent, irrevocable national identifiers that cannot be reissued, creating lifelong identity theft risk.

Medical identity theft risk is substantial, enabling fraudulent healthcare services, unauthorized billing, and prescription fraud. Clinical notes containing HIV status, psychiatric diagnoses, sexual orientation, and mental health conditions create risks of blackmail, employment discrimination, insurance discrimination, and social harm. Political figures whose health data was extracted face risks of coercion and information warfare.

The prior CNIL fine of 800,000 EUR in September 2024 for data protection violations, combined with delayed disclosure (October 2025 criminal complaint to February 2026 public reporting), could trigger additional GDPR penalties under Article 83(6). CNIL opened a formal investigation into the breach notification timeline and potential GDPR Article 33 violations in March 2026.

## Attribution

The threat actor responsible for the Cegedim Santé breach has not been identified. Cegedim filed a criminal complaint with French authorities in October 2025, and the investigation remains ongoing. No ransomware group or threat actor has publicly claimed responsibility for the breach.

Attribution confidence remains low (A4) given the absence of technical indicators, public claims, or government attribution statements. The scale and sophistication of the exfiltration (15.8 million records without detection) suggests a capable threat actor with experience in large-scale data theft operations.

## Timeline

### Late 2025 — Breach Occurs

Hackers breach MonLogicielMedical platform. 15.8 million patient records and 165,000 clinical note files exfiltrated.

### 2025-10 — Criminal Complaint Filed

Cegedim Santé files criminal complaint with French authorities. Breach not publicly disclosed.

### 2026-02-27 — Public Disclosure

France24 publicly reports the breach. Media coverage begins. The delay between the October 2025 complaint and public disclosure raises GDPR compliance questions.

### 2026-03-03 — Official Confirmation

Cegedim Santé officially confirms 15.8 million patient records compromised in statement to media and regulators.

### 2026-03 — CNIL Investigation Opened

CNIL opens formal investigation into breach notification timeline and potential GDPR Article 33 violations.

## Remediation & Mitigation

Healthcare organizations using MonLogicielMedical should notify affected patients and offer credit monitoring and identity theft protection. Providers should assume all data processed through MLM has been compromised and adjust security postures accordingly.

Healthcare platforms must implement per-patient encryption with unique cryptographic keys, hardware security modules for key management, AES-256 encryption at rest with monthly key rotation, and TLS 1.3 or later for all data in transit. Clinical notes should receive the highest protection classification with restricted access. Proper pseudonymization per GDPR Article 4(11) with irreversible techniques should be implemented for research datasets.

Organizations should deploy database activity monitoring for real-time alerts on unusual queries and bulk exports. Data loss prevention controls should block or alert on exfiltration of records containing clinical notes, SSNs, or health identifiers. Comprehensive, tamper-proof audit logs of all database access should be maintained for a minimum of three years.

## Sources & References

- [CNIL: Data Protection Enforcement Actions](https://www.cnil.fr/en/home) — CNIL, 2024-09-15
- [The Register: 15.8M Medical Records Stolen from French Health Ministry](https://www.theregister.com/2026/03/03/french_medical_leak) — The Register, 2026-03-03
- [Connexion France: Doctors' Records Hit by Cyberattack](https://www.connexionfrance.com/news/doctors-records-hit-by-cyberattack-up-to-15-million-patients-in-france-affected/773980) — Connexion France, 2026-03-01
- [SC Media: French Healthcare Software Provider Cegedim Santé Suffers Major Data Breach](https://www.scworld.com/brief/french-healthcare-software-provider-cegedim-sante-suffers-major-data-breach) — SC Media, 2026-03-04
- [Anadolu Agency: 15M French Citizens Affected by Massive Data Breach](https://www.aa.com.tr/en/europe/15m-french-citizens-affected-by-massive-data-breach-following-cyberattack-on-medical-software/3842345) — Anadolu Agency, 2026-03-05
- [ANSSI: French National Cybersecurity Agency](https://www.cyber.gouv.fr/) — ANSSI, 2026-03-10
