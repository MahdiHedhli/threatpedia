---
eventId: TP-2000-0001
title: ILOVEYOU Worm Outbreak
date: 2000-05-04
attackType: Email Worm
severity: high
sector: Cross-Sector
geography: Global
threatActor: Onel de Guzman (suspected)
attributionConfidence: A3
reviewStatus: draft_ai
confidenceGrade: A
generatedBy: kernel-k
generatedDate: 2026-04-29
cves: []
relatedSlugs:
  - melissa-macro-virus-outbreak-1999
tags:
  - iloveyou
  - love-letter
  - email-worm
  - vbscript
  - microsoft-outlook
  - mirc
  - social-engineering
  - file-overwrite
  - cert-cc
  - philippines
sources:
  - url: https://www.gao.gov/products/t-aimd-00-181
    publisher: U.S. Government Accountability Office
    publisherType: government
    reliability: R1
    publicationDate: "2000-05-18"
    accessDate: "2026-04-29"
    archived: false
  - url: https://www.sei.cmu.edu/documents/507/2000_019_001_496188.pdf
    publisher: Carnegie Mellon Software Engineering Institute
    publisherType: research
    reliability: R1
    publicationDate: "2000-05-09"
    accessDate: "2026-04-29"
    archived: false
  - url: https://archives.fbi.gov/archives/news/testimony/cyber-security
    publisher: FBI
    publisherType: government
    reliability: R1
    publicationDate: "2001-08-29"
    accessDate: "2026-04-29"
    archived: false
mitreMappings:
  - techniqueId: T1566.001
    techniqueName: "Phishing: Spearphishing Attachment"
    tactic: Initial Access
    notes: The worm arrived as an email with the subject "ILOVEYOU" and a VBS attachment named "LOVE-LETTER-FOR-YOU.TXT.VBS".
  - techniqueId: T1204.002
    techniqueName: "User Execution: Malicious File"
    tactic: Execution
    notes: Infection required the recipient to open the attached VBS file.
  - techniqueId: T1059.005
    techniqueName: "Command and Scripting Interpreter: Visual Basic"
    tactic: Execution
    notes: The worm payload was written in VBScript and required Windows Scripting Host to run.
---

## Summary

The ILOVEYOU worm outbreak began spreading globally on May 4, 2000 through email messages that used the subject line "ILOVEYOU" and an attachment named `LOVE-LETTER-FOR-YOU.TXT.VBS`. CERT/CC described it as a malicious VBScript worm that could also spread through Windows file sharing, Internet Relay Chat, USENET, and possibly webpages after a user executed the script.

The outbreak disrupted both public- and private-sector operations. GAO reported that the worm affected most federal agencies, while an archived FBI testimony later stated that at least 14 federal agencies were penetrated. CERT/CC reported on May 8, 2000 that it had received reports from more than 650 sites indicating that more than 500,000 individual systems were affected.

The public investigative record in the sources available here points to the Philippines and names Onel de Guzman as the suspected author, but the case did not end in a conviction. The incident remains a reference point for email-borne malware, cross-network self-propagation, and the operational risk created when scripting, address-book automation, and user trust are combined.

## Technical Analysis

CERT/CC stated that the Love Letter worm affected systems running Microsoft Windows with Windows Scripting Host enabled. GAO described the attachment as a Visual Basic Script file and noted that systems were not affected unless the recipient opened and ran the attachment.

Once executed, the worm attempted to send copies of itself through Microsoft Outlook to all entries in all address books. CERT/CC also documented additional propagation paths through Windows file sharing, IRC, USENET, and possibly webpages. In IRC environments, the worm created a `script.ini` file so that mIRC would send a copy of the worm to users who joined infected channels.

The payload also altered local files and system settings. CERT/CC reported that the worm replaced `.vbs` and `.vbe` files with copies of itself, converted several other script-related file types to `.vbs`, added `.vbs` copies alongside `.jpg` and `.jpeg` files, and hid original `.mp3` and `.mp2` files while dropping script copies in the same directories. CERT/CC further reported that the worm changed Internet Explorer start-page settings toward URLs associated with `WIN-BUGSFIX.exe`, and GAO reported that it attempted to install a password-stealing program that would activate after Internet Explorer was opened and the system was rebooted.

The operational damage came from both propagation volume and file manipulation. GAO reported overwhelmed email systems and lost files, while CERT/CC warned that file recovery could be difficult or impossible because affected files were overwritten by worm code rather than simply deleted.

## Attack Chain

### Stage 1: Social Engineering Email Delivery

Recipients received email messages with the subject line "ILOVEYOU" and a VBS attachment named `LOVE-LETTER-FOR-YOU.TXT.VBS`. CERT/CC reported that the message body read, "kindly check the attached LOVELETTER coming from me."

### Stage 2: User Execution of the Script

The worm required the recipient to open the attachment on a Windows system with Windows Scripting Host enabled. GAO noted that deleting the email without running the attachment was sufficient to avoid infection.

### Stage 3: Outlook Address Book Propagation

After execution, the worm attempted to use Microsoft Outlook to send copies of itself to all entries in all address books. GAO contrasted this behavior with Melissa, which had mailed itself only to the first 50 contacts in a victim's Outlook address book.

### Stage 4: Secondary Spread Through Files and IRC

CERT/CC reported that the worm replaced or added script copies to several file types on fixed and network drives, creating additional execution paths when users later opened those files. It also created an mIRC script so that infected users would automatically send the worm to other IRC participants through DCC file transfer.

### Stage 5: System and Network Degradation

As infected systems sent large volumes of mail and modified local or shared files, organizations experienced email outages, network congestion, and cleanup workload. CERT/CC reported considerable network degradation from the mail, file, and web traffic generated by the worm.

## Impact Assessment

The early spread was broad. GAO reported that by 6:00 p.m. on May 4, 2000, CERT/CC had received more than 400 direct reports involving more than 420,000 Internet hosts. CERT/CC then reported on May 8 that more than 650 individual sites had reported more than 500,000 affected systems.

The disruption crossed sectors and borders. GAO reported that large corporations including AT&T, TWA, and Ford Motor Company were affected, along with media outlets, state governments, school systems, and credit unions. GAO also reported international disruption affecting the International Monetary Fund, the British Parliament, Belgium's banking system, and organizations across multiple European countries.

Federal impact was also material. GAO stated that most federal agencies were affected and that some incurred system and file damage while many others spent substantial staff time restoring email service. The archived FBI testimony later stated that at least 14 federal agencies were penetrated, including the Department of Defense, the Social Security Administration, the CIA, NASA, and congressional offices.

The total economic loss remained uncertain in the contemporary record. GAO said initial damage estimates ranged from $100 million to over $10 billion, but it also stated that it did not have a basis for commenting on the overall loss because affected organizations were unlikely to fully disclose the true extent of their damage.

## Attribution

The archived FBI testimony states that investigative work by the FBI's New York Field Office, with assistance from the National Infrastructure Protection Center, traced the source of the worm to the Philippines within 24 hours. The FBI then worked with the Philippines' National Bureau of Investigation to identify the perpetrator.

That same testimony states that Onel de Guzman was charged on June 29, 2000 with fraud, theft, malicious mischief, and violation of the Devices Regulation Act. It also states that the charges were dropped in August by Philippine judicial authorities and that the prosecution was hampered by the lack of a specific computer crime statute at the time.

Onel de Guzman is identified as a suspected individual author rather than a judicially confirmed perpetrator. The available sources do not support state or organized-crime attribution.

## Timeline

### 2000-05-04 — Outbreak Begins

The ILOVEYOU worm began spreading globally through email messages carrying the `LOVE-LETTER-FOR-YOU.TXT.VBS` attachment.

### 2000-05-04 — Rapid Reporting and Federal Warning Activity

GAO reported that private-sector and federal warning channels began circulating alerts during the morning of May 4, and that CERT/CC had received more than 400 direct reports involving more than 420,000 Internet hosts by 6:00 p.m.

### 2000-05-08 — CERT/CC Reports More Than 500,000 Affected Systems

CERT/CC reported that it had received reports from more than 650 sites indicating that more than 500,000 individual systems were affected.

### 2000-05-18 — GAO Testifies on Federal Response

GAO testified before the U.S. Senate on the worm's spread, federal impact, and the need for improved national alert and coordination capabilities.

### 2000-06-14 — Philippines Approves E-Commerce Act

The archived FBI testimony states that the Philippines approved the E-Commerce Act, which criminalized computer hacking and virus propagation.

### 2000-06-29 — Charges Filed Against Onel de Guzman

According to the archived FBI testimony, Philippine authorities charged Onel de Guzman with fraud, theft, malicious mischief, and violation of the Devices Regulation Act.

### 2000-08 — Charges Dropped

The archived FBI testimony states that the charges were later dropped in August 2000 by Philippine judicial authorities.

## Remediation & Mitigation

CERT/CC recommended that users update anti-virus products, because vendors had released updated tools and virus databases for the worm. It also recommended disabling Windows Scripting Host, which the worm required for execution, while noting that doing so could remove desired functionality.

CERT/CC also recommended disabling active scripting in Internet Explorer, disabling automatic DCC reception in IRC clients, and using email filtering to block known ILOVEYOU subject lines and executable attachment types. It cautioned that subject-line filters alone would not stop variants that changed the email subject.

GAO framed the broader lesson as a warning and coordination problem as much as a malware problem. Its testimony argued that ILOVEYOU showed the difficulty of issuing timely warnings for information-based threats and the need for stronger national warning capabilities across government and private-sector networks.

Modern defenses against ILOVEYOU-like behavior include blocking scriptable attachments, restricting programmatic access to address books, disabling unnecessary legacy scripting features, and treating trusted-sender email as untrusted until the attachment origin is verified through another channel.

## Sources & References

- [U.S. Government Accountability Office: Critical Infrastructure Protection: 'ILOVEYOU' Computer Virus Highlights Need for Improved Alert and Coordination Capabilities](https://www.gao.gov/products/t-aimd-00-181) — U.S. Government Accountability Office, 2000-05-18
- [Carnegie Mellon Software Engineering Institute: CERT Advisory CA-2000-04 Love Letter Worm](https://www.sei.cmu.edu/documents/507/2000_019_001_496188.pdf) — Carnegie Mellon Software Engineering Institute, 2000-05-09
- [FBI: Cyber Security](https://archives.fbi.gov/archives/news/testimony/cyber-security) — FBI, 2001-08-29
