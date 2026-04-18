---
eventId: TP-2026-0043
title: University of Mississippi Medical Center Medusa Ransomware Attack
date: 2026-02-19
attackType: ransomware
severity: critical
sector: Healthcare
geography: United States (Mississippi)
threatActor: Medusa (claimed)
attributionConfidence: A4
reviewStatus: under_review
confidenceGrade: C
generatedBy: new-threat-intel-automation
generatedDate: 2026-02-19
cves: []
relatedSlugs:
  - "passaic-county-medusa-ransomware-2026"
  - "cegedim-sante-health-breach-2026"
  - "conduent-data-breach-2026"
  - "chipsoft-ransomware-dutch-healthcare-2026"
tags:
  - "ransomware"
  - "medusa"
  - "healthcare"
  - "mississippi"
  - "phi"
  - "data-exfiltration"
  - "clinic-shutdown"
  - "epic-ehr"
  - "double-extortion"
---
## Executive Summary

The University of Mississippi Medical Center (UMMC) suffered a critical ransomware attack on February 19, 2026, that forced UMMC to take 35 clinics offline and operate under complete manual procedures for 9 days (February 19 through March 2, 2026). Clinical staff reverted to paper charts, manual prescriptions, and analog communication systems. The emergency department remained open but operated with severely degraded capability and information access.

Medusa later claimed responsibility on its leak site, alleging exfiltration of over 1 terabyte of data containing more than 1 million files, including protected health information (PHI), employee and student personal information, and financial records. Public reporting documented an $800,000 ransom demand and leak-site pressure, but UMMC did not publicly validate the exfiltration volume or the attacker's detailed claims.

This incident represents one of the largest healthcare ransomware attacks in 2026 to date, demonstrating the catastrophic impact of ransomware on healthcare operations and the vulnerability of medical centers to extended service disruption. The 9-day recovery period is substantially longer than typical healthcare ransomware incidents and highlights the complexity of restoring encrypted healthcare systems and the difficulty in obtaining clean backups for recovery.

## Technical Analysis

Attack Classification: Ransomware with Concurrent Data Exfiltration
Medusa ransomware is a Russia-linked variant known for targeting healthcare and critical infrastructure. The attack deployed encryption across UMMC's EPIC EHR system, all connected clinical systems, and backup infrastructure. Exfiltration occurred before encryption, enabling blackmail ransom demands in addition to encryption-based demands.

Primary Target: EPIC Electronic Health Record System
UMMC's EPIC system was encrypted, making it inaccessible to all connected clinics and hospitals. EPIC is one of the largest EHR platforms in the US healthcare system. Encryption of the central EPIC database cascaded across 35 clinics and satellite facilities, eliminating access to patient records, medication histories, test results, and clinical decision support across the entire UMMC system.

Data Exfiltration Scope: 1TB+ / 1M+ Records
Medusa claims exfiltration of: 1 terabyte of data containing over 1 million files. Given UMMC's scope as a major academic medical center, the data likely includes: complete patient medical records (PHI); lab results and imaging; clinical notes; medication records; employee personal information; financial records; payroll data; insurance information; research data. The volume and diversity of records indicate systematic data harvesting, not targeted exfiltration.

Backup Infrastructure Compromise:
The 9-day recovery period (February 19 - March 2) suggests either: (1) Backup systems were encrypted alongside production systems; (2) Backup recovery procedures were compromised; (3) Data validation and integrity checks delayed recovery; (4) Ransomware infection prevented clean backup restoration. UMMC's inability to recover in less than 24 hours (typical for organizations with proper backup isolation) indicates backup infrastructure was either encrypted or severely compromised.

Ransom Negotiation Failure:
Initial ransom demand: $800,000. UMMC's counteroffer: $550,000. Negotiations failed and no payment was made. After failed negotiations, Medusa published stolen data to the public dark web leak site on March 12, 2026, executing the "name and shame" extortion tactic to pressure payment through reputational and regulatory damage.

Recovery Timeline and Operational Impact:
February 19: Ransomware detected; UMMC takes 35 clinics offline to prevent spread. Staff transition to paper-based records.
February 20-March 1: 9-day manual operations period. Clinical staff operated under extreme information degradation: no access to recent lab results, imaging, medication histories, or patient records beyond immediate memory.
March 2: Systems restoration completed. UMMC brings systems back online after forensic validation and malware removal.

## Timeline

Before February 19, 2026
Initial Access — Timing Unknown
Threat actor obtained initial access to UMMC infrastructure. Attack vector not publicly disclosed. Potential vectors include: VPN credential compromise, phishing attack targeting UMMC personnel, unpatched vulnerability in internet-facing application, or compromised third-party vendor access.

Before February 19, 2026
Reconnaissance and Data Staging
Threat actor conducted network reconnaissance to identify critical systems (EPIC database, backups, authentication systems). Data was staged for exfiltration. The 1TB+ dataset suggests weeks of data copying and preparation before encryption deployment.

February 19, 2026 — Early Morning
Ransomware Execution
Medusa ransomware payload was executed across UMMC infrastructure. EPIC database encryption began. Backup systems were also encrypted, preventing standard disaster recovery procedures. Ransom note displayed on encrypted systems.

February 19, 2026 — Morning
Discovery and Incident Response
UMMC detected the ransomware encryption and inaccessibility of EPIC system. All 35 connected clinics were notified of system unavailability. Clinical staff began transitioning to manual operations (paper charts, phone-based coordination).

February 19-28, 2026
Manual Operations / Forensic Investigation
Clinical staff operated under completely manual procedures. Nurses and doctors used paper-based patient records, manual calculation of medication dosing, and phone-based laboratory communication. Forensic investigation began to determine scope of breach and validate backup integrity.

February 19 - March 2, 2026
Incident Response and Extortion Pressure
UMMC managed restoration and incident response while threat actors applied external pressure through ransom demands and later leak-site claims. Public reporting did not establish that UMMC paid the ransom.

March 2, 2026
Systems Restoration Completed
After 9 days of manual operations, UMMC successfully restored EPIC and connected systems from cleaned backups. All 35 clinics transitioned back to electronic record systems. System validation and data integrity checks completed.

March 12, 2026
Data Published to Medusa Leak Site
Medusa published stolen UMMC data (1TB+, 1M+ files) to the Medusa dark web leak site, exposing PHI, employee information, financial records, and other sensitive data to the public. This represents retaliation for failed ransom negotiations and is intended to pressure late payment through regulatory fines and reputation damage.

## Impact Assessment

Patient Care Disruption:
Nine days of manual operations eliminated: automated drug interaction checking, real-time access to patient history, imaging and lab result integration, clinical decision support, medication dispensing automation, and care coordination across 35 clinics. While emergency care continued, the information degradation increased risk of medical error in medication dosing, allergy documentation, contraindication identification, and clinical decision-making.

Personal Health Information Exposure:
1TB+ of data containing over 1 million records was exfiltrated and published. UMMC serves the Mississippi region and broader patient population. Exposed data includes: complete medical histories, diagnoses, treatments, medications, lab results, imaging reports, and personal identifiers (names, birthdates, SSNs, addresses, insurance information). This data enables identity theft, insurance fraud, medical fraud, and targeted extortion of patients.

Operational Complexity of 9-Day Manual Operations:
A typical 24-48 hour manual operations window is manageable for healthcare organizations with contingency planning. A 9-day window exceeds the practical limits of manual processes: (1) Staff fatigue and burnout; (2) Increased medical error from manual documentation; (3) Inability to access prior medical history for complex cases; (4) Scheduling chaos for outpatient clinics; (5) Lost revenue from cancelled procedures; (6) Transfer of critical patients to other healthcare systems; (7) Degraded obstetrics care due to lack of fetal monitoring and laboratory access.

Backup Infrastructure Compromise:
The ability to encrypt both production and backup systems indicates: (1) Attacker had extensive network access to storage infrastructure; (2) Backup systems lacked proper air-gapping or isolation from production; (3) Backup credentials were compromised or predictable; (4) Backup authentication was integrated with production authentication. This is a critical infrastructure failure that enabled the extended recovery time.

Ransomware Ecosystem Analysis - Medusa / Storm-1175:
Medusa (Storm-1175) is a Russia-linked threat actor that specializes in healthcare targeting. Microsoft tracks Storm-1175 as conducting ransomware operations with alleged connections to China-linked threat group activities. The ransomware-as-a-service operation demonstrates: (1) Professional-grade malware and exfiltration tools; (2) Sophisticated negotiation tactics; (3) Data monetization via dark web leak site; (4) Resilience and continued operations despite law enforcement pressure.

## Historical Context

Public reporting linked the UMMC incident to Medusa through the group's own leak-site claim and follow-on media reporting. UMMC itself did not publicly attribute the attack to Medusa in the same level of certainty, so the actor reference in this article is best treated as a claimed attribution rather than a fully confirmed government or victim-side determination.

Medusa has been linked in public reporting to multiple healthcare-targeting incidents in 2025-2026 and is known for leak-site extortion operations following ransomware deployment. For UMMC specifically, the leak-site posting and sample-file publication remain the strongest public indicator tying the event to Medusa.

The UMMC attack is characteristic of Storm-1175 operations: targeting healthcare to maximize pressure for ransom payment (healthcare organizations prioritize operational restoration), exfiltrating sensitive PHI data for secondary blackmail, and publishing data to a dark web leak site when negotiations fail.

## Remediation & Mitigation

Immediate Actions — Healthcare Organizations:
1. Conduct full forensic analysis of UMMC incident to understand attack vector, dwell time, and scope of lateral movement within UMMC infrastructure.
2. Assess your own infrastructure for Medusa indicators of compromise (IOCs). Review recent backup restoration tests and backup system isolation.
3. Implement 24/7 ransomware detection and response procedures. Designate incident commander for ransomware scenarios to ensure rapid decision-making.
4. Test backup restoration procedures monthly. Ensure backup systems are isolated from production (air-gapped, separate authentication, offline copies).

Backup and Recovery Infrastructure:
1. Implement the 3-2-1 backup rule: 3 copies of data, 2 different storage media, 1 offline/air-gapped copy.
2. Ensure backup systems use separate authentication (not integrated with production AD/Azure AD). Backup administrator credentials should be stored in separate vault.
3. Test backup restoration monthly with realistic data volumes. A monthly test that takes 24 hours is inadequate; design for 4-8 hour recovery time objective.
4. Implement immutable backups (write-once-read-many / WORM) that prevent deletion or modification even by compromised administrator accounts.
5. Store at least one backup copy offline (not connected to network). This backup should be rotated into service at least quarterly.

Ransomware Defense — Prevention and Detection:
1. Implement multi-factor authentication (MFA) on all remote access (VPN, RDP). MFA prevents credential-based initial access, which is the most common ransomware entry vector.
2. Deploy endpoint detection and response (EDR) on all servers and workstations. Ransomware campaigns typically involve reconnaissance and lateral movement before encryption; EDR detects this activity before encryption deploys.
3. Implement network segmentation. Healthcare networks should isolate clinical systems (EPIC, pharmacy, lab) from administrative systems and research systems.
4. Monitor for unusual file encryption activity. Alert on mass file operations in protected health information storage areas.
5. Implement application whitelisting on critical servers to prevent execution of ransomware binaries.

Data Protection & Privacy Breach Response:
1. Conduct comprehensive forensic investigation to determine exact scope of exfiltrated data (patient count, data elements, sensitivity classification).
2. Prepare HIPAA breach notifications for all affected individuals. Notification requirement: "without unreasonable delay and in no case later than 60 calendar days after discovery."
3. Notify US Department of Health and Human Services (HHS) Office for Civil Rights (OCR) of breach. Healthcare organizations are required to report breaches affecting 500+ individuals.
4. Offer identity protection and credit monitoring services to affected individuals as appropriate.
5. Calculate and document HIPAA penalty exposure. Civil penalties range from $100 to $50,000 per violation, up to $1.5 million per violation category per year.

Incident Communication and Ransomware Negotiation:
1. Designate executive leadership to manage ransomware negotiations. Threat actors are sophisticated and exploit uncertainty in communication chains.
2. Engage with FBI and local law enforcement early in the incident. FBI can provide threat intelligence on specific threat actors, assist with negotiations, and coordinate with international law enforcement.
3. Do not make ransom payment without consulting legal counsel and law enforcement. Ransom payments may violate sanctions laws if the threat actor is designated as a state-sponsored actor.
4. Prepare public communication strategy. Healthcare organizations face intense media scrutiny during patient data breaches. Transparent communication about timeline and scope is essential.

Sources & References

1.
HIPAA Journal — University of Mississippi Medical Center Medusa Ransomware Breach
https://www.hipaajournal.com/

2.
The Record (Recorded Future) — UMMC 9-Day Outage from Medusa Ransomware
https://therecord.media/

3.
NPR — Mississippi Medical Center Offline After Ransomware Attack
https://www.npr.org/

4.
BleepingComputer — UMMC Medusa Ransomware Attack and Data Leak
https://www.bleepingcomputer.com/

5.
Cybersecurity Dive — Healthcare Ransomware Incidents 2026
https://www.cybersecuritydive.com/

6.
Mississippi Today — University of Mississippi Medical Center Ransomware Impact
https://mississippitoday.com/

7.
Microsoft Threat Intelligence — Storm-1175 Ransomware Operations
https://www.microsoft.com/security/

8.
US Department of Health and Human Services — HIPAA Breach Notification Rule
https://www.hhs.gov/
