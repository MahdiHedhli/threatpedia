---
eventId: TP-2014-0002
title: Sony Pictures Destructive Attack
date: 2014-11-24
attackType: Destructive Malware and Data Theft
severity: critical
sector: Entertainment
geography: United States
threatActor: North Korean government / Lazarus Group
attributionConfidence: A1
reviewStatus: draft_ai
confidenceGrade: A
generatedBy: kernel-k
generatedDate: 2026-04-30
cves: []
relatedSlugs: []
tags:
  - sony-pictures
  - destructive-malware
  - data-theft
  - guardians-of-peace
  - north-korea
  - lazarus-group
  - destover
  - employee-data
  - confidential-communications
  - the-interview
sources:
  - url: https://www.fbi.gov/contact-us/field-offices/sandiego/news/press-releases/update-on-sony-investigation
    publisher: FBI
    publisherType: government
    reliability: R1
    publicationDate: "2014-12-19"
    accessDate: "2026-04-30"
    archived: false
  - url: https://www.justice.gov/archives/opa/pr/update-sony-investigation
    publisher: U.S. Department of Justice
    publisherType: government
    reliability: R1
    publicationDate: "2014-12-19"
    accessDate: "2026-04-30"
    archived: false
  - url: https://www.justice.gov/archives/opa/press-release/file/1092091/dl
    publisher: U.S. Department of Justice
    publisherType: government
    reliability: R1
    publicationDate: "2018-06-08"
    accessDate: "2026-04-30"
    archived: false
  - url: https://www.justice.gov/archives/opa/pr/north-korean-regime-backed-programmer-charged-conspiracy-conduct-multiple-cyber-attacks-and
    publisher: U.S. Department of Justice
    publisherType: government
    reliability: R1
    publicationDate: "2018-09-06"
    accessDate: "2026-04-30"
    archived: false
mitreMappings:
  - techniqueId: T1485
    techniqueName: Data Destruction
    tactic: Impact
    notes: The FBI and DOJ described destructive malware that rendered thousands of Sony Pictures computers inoperable, while the criminal complaint described overwriting disk structures.
  - techniqueId: T1566.001
    techniqueName: "Phishing: Spearphishing Attachment"
    tactic: Initial Access
    notes: The DOJ criminal complaint described spear-phishing emails sent to Sony Pictures employees before the overt destructive phase.
---

## Summary

The Sony Pictures destructive attack was a 2014 intrusion against Sony Pictures Entertainment that combined destructive malware, data theft, public leaks, and threats. The FBI said Sony Pictures confirmed in late November 2014 that it had been targeted by a cyber attack that destroyed systems and stole proprietary information, employee personally identifiable information, and confidential communications.

A group calling itself Guardians of Peace claimed responsibility for the attack. The FBI concluded on December 19, 2014 that the North Korean government was responsible, citing malware similarities, infrastructure overlap, and links to earlier North Korea-attributed activity.

The U.S. Department of Justice later unsealed a criminal complaint against Park Jin Hyok, alleging that he was a member of a North Korean government-sponsored hacking team known in the private sector as Lazarus Group and that the same conspiracy included the Sony Pictures attack, the Bangladesh Bank theft, WannaCry, and other activity.

## Technical Analysis

The public technical record describes both access activity and destructive payload effects. The FBI described the intrusion as involving destructive malware, theft of proprietary and personal data, and confidential communications exposure. The attack rendered thousands of Sony Pictures computers inoperable and forced the company to take its computer network offline.

The 2018 DOJ criminal complaint describes alleged preparation and access. It describes spear-phishing emails sent to Sony Pictures employees in 2014 and states that some accounts were not accessed after the first Guardians of Peace email on November 21, which the complaint viewed as consistent with the accounts being used to gain access before the rest of the attack was implemented.

The complaint also describes destructive behavior that impaired later forensics. It states that the harmful component overwrote the master file table and master boot record, making a reconstruction of activity during the intrusion unavailable through forensic analysis. Connection logs still showed when confidential Sony Pictures data had been exfiltrated.

## Attack Chain

### Stage 1: Spear-Phishing and Pre-Attack Access

The DOJ complaint described spear-phishing messages to Sony Pictures employees, including a message sent on October 15, 2014 from an account connected to other infrastructure discussed in the complaint. The complaint treated this activity as part of the access path into Sony Pictures.

### Stage 2: Data Theft

The FBI reported that proprietary information, employee personally identifiable information, and confidential communications were stolen. The DOJ complaint said confidential data had been exfiltrated and later distributed through email, social media, and public links.

### Stage 3: Destructive Malware Deployment

The destructive phase rendered thousands of Sony Pictures computers inoperable. The DOJ complaint described disk-structure damage involving the master file table and master boot record, which limited reconstruction of the intrusion through endpoint forensics.

### Stage 4: Public Claim and Leak Activity

Guardians of Peace claimed responsibility and distributed stolen material. The DOJ complaint described emails, social media activity, public links, and releases of confidential financial records, employee data, and pre-release film material.

### Stage 5: Threats Around Film Distribution

The FBI reported threats against Sony Pictures, employees, and theaters that distributed its movies. The DOJ complaint later described additional targeting of a movie theater chain where "The Interview" was scheduled to be shown.

## Impact Assessment

The operational impact centered on destructive malware and business disruption. The FBI said the attack rendered thousands of Sony Pictures computers inoperable and forced the company to take its entire computer network offline.

The confidentiality impact included proprietary information, employee personally identifiable information, and confidential communications. The DOJ complaint described stolen data being distributed publicly and included pre-release movie material, internal documents, and financial records in the categories of leaked information.

The use of public threats and demands distinguished the incident from data theft events that do not involve public exposure. Guardians of Peace issued demands and threats tied to Sony Pictures and theaters distributing "The Interview." The FBI described the attack as an effort to harm a U.S. business and suppress expression.

## Attribution

The attribution is based on public U.S. government findings. The FBI concluded on December 19, 2014 that the North Korean government was responsible for the Sony Pictures attack, citing malware-code similarities, encryption and data-deletion similarities, infrastructure overlap, and similarity to a 2013 attack against South Korean banks and media outlets.

The DOJ's 2018 charging announcement and criminal complaint connected the Sony Pictures attack to Park Jin Hyok, Chosun Expo Joint Venture, and a North Korean government-sponsored hacking team known in private-sector reporting as Lazarus Group. The complaint remains an allegation unless proven in court, but it provides the public basis for the U.S. government's attribution.

## Timeline

### 2014-10-15 — Spear-Phishing Email Described in DOJ Complaint

The DOJ complaint described a spear-phishing email sent to a Sony Pictures employee from an account later connected to other accounts and infrastructure discussed in the investigation.

### 2014-11-21 — Guardians of Peace Email Sent

The DOJ complaint references the first Guardians of Peace email on November 21, 2014, before the overt destructive phase became public.

### 2014-11-24 — Destructive Attack Becomes Overt

Sony Pictures workstations displayed a Guardians of Peace message and the destructive phase became visible inside the company.

### 2014-12-05 — Additional Guardians of Peace Email

The DOJ complaint described another email sent to Sony Pictures employees claiming to be from the head of Guardians of Peace.

### 2014-12-17 — Additional Stolen Data Disseminated

The DOJ complaint said new sets of stolen Sony Pictures data were disseminated by the subjects on December 17, 2014.

### 2014-12-19 — FBI Attributes the Attack to North Korea

The FBI publicly concluded that the North Korean government was responsible for the Sony Pictures attack.

### 2018-06-08 — Criminal Complaint Filed

The criminal complaint against Park Jin Hyok was filed in the Central District of California.

### 2018-09-06 — DOJ Unseals Charges

The DOJ unsealed the complaint and announced charges tied to Sony Pictures, WannaCry, Bangladesh Bank, and other activity.

## Remediation & Mitigation

Sony Pictures reported the incident and requested FBI assistance. The FBI emphasized that the timing of the report helped investigators identify the source of the attacks.

The incident reinforced several defensive priorities: phishing-resistant access controls, email attachment controls, endpoint detection, backup and recovery readiness, destructive-malware playbooks, network isolation, and tested processes for taking affected environments offline without losing investigative evidence.

The DOJ said the FBI and prosecutors provided victims and private-sector partners with information about accounts, tactics, and techniques used by the conspiracy to support remediation and disruption. For similar incidents, organizations need offline backups, recovery exercises, privileged-access controls, and legal and communications plans for simultaneous destructive malware, data exposure, and public threats.

## Sources & References

- [FBI: Update on Sony Investigation](https://www.fbi.gov/contact-us/field-offices/sandiego/news/press-releases/update-on-sony-investigation) — FBI, 2014-12-19
- [U.S. Department of Justice: Update on Sony Investigation](https://www.justice.gov/archives/opa/pr/update-sony-investigation) — U.S. Department of Justice, 2014-12-19
- [U.S. Department of Justice: Criminal Complaint Against Park Jin Hyok](https://www.justice.gov/archives/opa/press-release/file/1092091/dl) — U.S. Department of Justice, 2018-06-08
- [U.S. Department of Justice: North Korean Regime-Backed Programmer Charged With Conspiracy to Conduct Multiple Cyber Attacks and Intrusions](https://www.justice.gov/archives/opa/pr/north-korean-regime-backed-programmer-charged-conspiracy-conduct-multiple-cyber-attacks-and) — U.S. Department of Justice, 2018-09-06
