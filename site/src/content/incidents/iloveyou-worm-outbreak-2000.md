---
eventId: TP-2000-0001
title: ILOVEYOU Worm Outbreak
date: 2000-05-04
attackType: Email Worm
severity: high
sector: Cross-Sector
geography: Global
threatActor: Onel de Guzman (reported)
attributionConfidence: A3
reviewStatus: draft_ai
confidenceGrade: A
generatedBy: kernel-k
generatedDate: 2026-04-30
cves: []
relatedSlugs:
  - melissa-macro-virus-outbreak-1999
tags:
  - iloveyou
  - love-letter
  - email-worm
  - vbscript
  - microsoft-outlook
  - social-engineering
  - file-overwrite
  - cert-cc
sources:
  - url: https://www.gao.gov/products/t-aimd-00-181
    publisher: U.S. Government Accountability Office
    publisherType: government
    reliability: R1
    publicationDate: "2000-05-18"
    accessDate: "2026-04-30"
    archived: false
  - url: https://www.sei.cmu.edu/documents/507/2000_019_001_496188.pdf
    publisher: CERT Coordination Center
    publisherType: research
    reliability: R1
    publicationDate: "2000-05-04"
    accessDate: "2026-04-30"
    archived: false
  - url: https://usa.kaspersky.com/blog/cybersecurity-history-iloveyou/26869/
    publisher: Kaspersky
    publisherType: vendor
    reliability: R2
    publicationDate: "2022-08-08"
    accessDate: "2026-04-30"
    archived: false
mitreMappings:
  - techniqueId: T1566.001
    techniqueName: "Phishing: Spearphishing Attachment"
    tactic: Initial Access
    notes: ILOVEYOU arrived as an email attachment named LOVE-LETTER-FOR-YOU.TXT.VBS with the subject line ILOVEYOU and a short social-engineering message.
  - techniqueId: T1204.002
    techniqueName: "User Execution: Malicious File"
    tactic: Execution
    notes: The worm executed after a recipient opened the VBScript attachment on a Windows system with Windows Scripting Host enabled.
  - techniqueId: T1485
    techniqueName: Data Destruction
    tactic: Impact
    notes: CERT/CC documented file overwrite behavior affecting VBS, VBE, JS, JSE, CSS, WSH, SCT, HTA, JPG, JPEG, MP2, and MP3 file types.
---

## Summary

The ILOVEYOU worm outbreak began on May 4, 2000 and used email, social engineering, and VBScript execution on Microsoft Windows systems to spread through address books. CERT/CC described the worm as a malicious VBScript program affecting systems with Windows Scripting Host enabled, and GAO described it as both a virus and a worm because it propagated through networks while also damaging files.

ILOVEYOU arrived with the subject line `ILOVEYOU`, the attachment `LOVE-LETTER-FOR-YOU.TXT.VBS`, and body text asking the recipient to check the attached love letter. When a recipient opened the attachment, the worm used Microsoft Outlook to send itself to entries in the user's address books. CERT/CC also documented propagation paths through Windows file sharing, IRC, USENET news, and possibly webpages.

The incident disrupted organizations across government and the private sector. CERT/CC reported that, by 5:00 p.m. EDT on May 8, 2000, it had received reports from more than 650 sites covering more than 500,000 affected systems. GAO used the incident to examine weaknesses in federal alerting and coordination for computer-based threats.

## Technical Analysis

ILOVEYOU was written in VBScript and depended on Windows Scripting Host. The initial lure used a double-extension filename, `LOVE-LETTER-FOR-YOU.TXT.VBS`, which made the attachment appear more like a text file in environments where known file extensions were hidden or visually deemphasized.

When executed, the worm attempted to use Microsoft Outlook to mail copies of itself to entries in all Outlook address books. That design made trusted sender relationships part of the propagation path: recipients often recognized the sender because the message came from a previously infected contact.

CERT/CC documented multiple additional behaviors. The worm searched files and overwrote or modified file types including script files, image files, web files, and music files. It also attempted to create a `script.ini` file in directories associated with the mIRC client, enabling IRC-based distribution when an affected user joined channels.

Kaspersky's retrospective describes the same operational pattern as an evolution of Melissa's address-book propagation. ILOVEYOU extended that pattern by mailing itself to all address-book entries rather than a limited subset and by adding file damage and credential-theft-related behavior.

## Attack Chain

### Stage 1: Email Delivery

The recipient receives an email with the subject `ILOVEYOU`, a short message requesting that the recipient check the attached love letter, and an attachment named `LOVE-LETTER-FOR-YOU.TXT.VBS`.

### Stage 2: User Execution

The recipient opens the VBScript attachment. On Windows systems with Windows Scripting Host enabled, the script executes in the user's context.

### Stage 3: Outlook Address Book Propagation

After execution, the worm attempts to send copies of itself through Microsoft Outlook to entries in all address books. Each recipient becomes a potential propagation point if they open the attachment.

### Stage 4: File Modification

The worm examines local files and overwrites or modifies selected file types. CERT/CC documented effects against script, image, web, and media files, including JPG, JPEG, MP2, and MP3 handling.

### Stage 5: Secondary Propagation Channels

The worm attempts to use mIRC by creating a `script.ini` file in directories containing mIRC-related files. CERT/CC also listed Windows file sharing, USENET news, and possible webpage distribution as propagation routes.

### Stage 6: Variants and Filter Bypass

Variants used alternate subject lines and themes such as Mother's Day, Joke, and Very Funny. GAO reported that variants retriggered disruptions because they bypassed filters created to block the original ILOVEYOU messages.

## Impact Assessment

CERT/CC's May 2000 advisory reported more than 650 affected reporting sites and more than 500,000 affected systems by May 8. It also reported site-level network degradation caused by mail, file, and web traffic generated by the worm.

GAO reported that the worm affected Microsoft Windows users and disrupted private businesses and government agencies. It documented a response timeline in which private-sector, federal, and defense organizations learned of and escalated the incident during the early morning hours of May 4, 2000.

The operational impact came from propagation volume, file modification, and response workload. Organizations had to block messages, update antivirus signatures, communicate warnings, remove infections, and manage variants that changed subjects or attachment names after the original filters were deployed.

The incident also exposed coordination limits. GAO concluded that the response showed the challenge of timely warning for information-based threats and the need for national warning capabilities that could coordinate across agencies, private-sector entities, state and local governments, and international partners.

## Attribution

Public attribution should be treated carefully. The GAO and CERT/CC sources used for the incident's technical and operational facts do not provide a court-proven attribution. Kaspersky's later retrospective identifies Onel de Guzman as the reported creator and states that he was not punished because of evidence limits and the absence of applicable cybercrime law in the Philippines at the time.

The available sources support individual criminal or disruptive malware authorship rather than state activity, espionage, or extortion. Because the core government and CERT sources focus on behavior and response rather than legal attribution, the named-individual attribution should be read as reported authorship rather than a conviction-based finding.

## Timeline

### 2000-05-04 — Initial Outbreak

The ILOVEYOU worm began spreading through email. CERT/CC listed May 4, 2000 as the original release date of its Love Letter advisory.

### 2000-05-04 — Federal and Private-Sector Escalation

GAO reported that the Financial Services Information Sharing and Analysis Center posted an alert at approximately 3:00 a.m. EDT, that NIPC was notified at 5:45 a.m. EDT, and that DOD's Joint Task Force-Computer Network Defense was alerted at 6:40 a.m. EDT.

### 2000-05-08 — CERT/CC Impact Count

By 5:00 p.m. EDT on May 8, CERT/CC had received reports from more than 650 sites indicating more than 500,000 affected systems.

### 2000-05-09 — CERT/CC Advisory Revision

CERT/CC revised the Love Letter advisory on May 9, 2000, adding variant and response details as the outbreak continued.

### 2000-05-18 — GAO Testimony

GAO published testimony before the Senate Banking Committee's Subcommittee on Financial Institutions, using ILOVEYOU to evaluate alerting and coordination capabilities for critical infrastructure protection.

### 2022-08-08 — Kaspersky Retrospective

Kaspersky published a retrospective that summarized the worm's propagation, variants, Outlook security changes, and reported attribution to Onel de Guzman.

## Remediation & Mitigation

Immediate response centered on blocking ILOVEYOU messages and variants, updating antivirus signatures, removing affected scripts and files, and communicating warnings not to execute unexpected VBScript attachments even when they appeared to come from known senders.

CERT/CC recommended disabling Windows Scripting Host where it was not needed, filtering or blocking VBS attachments, applying vendor antivirus updates, and using mail-server controls to stop known attachment names and variants. It also recommended educating users not to execute emailed code without firsthand knowledge of its origin.

The longer-term mitigation lesson was that email clients and scripting environments needed safer defaults. Kaspersky notes that Microsoft later released an Outlook security update that restricted script execution and warned when external programs attempted to access the address book or send mail automatically.

## Sources & References

- [U.S. Government Accountability Office: Critical Infrastructure Protection: 'ILOVEYOU' Computer Virus Highlights Need for Improved Alert and Coordination Capabilities](https://www.gao.gov/products/t-aimd-00-181) — U.S. Government Accountability Office, 2000-05-18
- [CERT Coordination Center: 2000 CERT Advisories, CA-2000-04 Love Letter Worm](https://www.sei.cmu.edu/documents/507/2000_019_001_496188.pdf) — CERT Coordination Center, 2000-05-04
- [Kaspersky: Evolution of security: the story of the ILOVEYOU worm](https://usa.kaspersky.com/blog/cybersecurity-history-iloveyou/26869/) — Kaspersky, 2022-08-08
