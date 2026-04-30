---
eventId: TP-1999-0001
title: Melissa Macro Virus Outbreak
date: 1999-03-26
attackType: Email Macro Malware
severity: high
sector: Cross-Sector
geography: Global
threatActor: David Lee Smith
attributionConfidence: A1
reviewStatus: draft_ai
confidenceGrade: A
generatedBy: kernel-k
generatedDate: 2026-04-29
cves: []
relatedSlugs: []
tags:
  - melissa-virus
  - macro-malware
  - microsoft-word
  - microsoft-outlook
  - email-worm
  - social-engineering
  - fbi
  - cybercrime
sources:
  - url: https://www.fbi.gov/history/famous-cases/melissa-virus
    publisher: FBI
    publisherType: government
    reliability: R1
    publicationDate: "2026-04-29"
    accessDate: "2026-04-29"
    archived: false
  - url: https://www.justice.gov/archive/ag/annualreports/ar99/fullrep.htm
    publisher: U.S. Department of Justice
    publisherType: government
    reliability: R1
    publicationDate: "2000-03-31"
    accessDate: "2026-04-29"
    archived: false
  - url: https://csrc.nist.gov/csrc/media/publications/shared/documents/itl-bulletin/itlbul2000-06.pdf
    publisher: NIST
    publisherType: government
    reliability: R1
    publicationDate: "2000-06-01"
    accessDate: "2026-04-29"
    archived: false
mitreMappings:
  - techniqueId: T1566.001
    techniqueName: "Phishing: Spearphishing Attachment"
    tactic: Initial Access
    notes: Melissa spread through deceptive email messages carrying infected Microsoft Word attachments; recipients were induced to open the attachment by social-engineering text.
  - techniqueId: T1204.002
    techniqueName: "User Execution: Malicious File"
    tactic: Execution
    notes: Infection required a user to open the malicious Word document, after which the embedded macro executed and automated further email distribution.
  - techniqueId: T1499
    techniqueName: Endpoint Denial of Service
    tactic: Impact
    notes: The outbreak overwhelmed email servers at hundreds of corporations and government agencies, forcing some systems offline and disrupting approximately one million email accounts.
---

## Summary

The Melissa Macro Virus outbreak began spreading on March 26, 1999 after an infected Microsoft Word document was posted to an Internet newsgroup and then propagated through Microsoft Outlook address books. The malware combined a Word macro, deceptive email text, and automated mailing to the first 50 entries in a victim's Outlook address book.

The outbreak did not primarily destroy files or steal money. Its impact came from scale. The FBI reports that email servers at more than 300 corporations and government agencies worldwide were overloaded, some systems had to be shut down, approximately one million email accounts were disrupted, and cleanup and repair costs were estimated at about $80 million.

The FBI traced the activity to David Lee Smith, who was arrested on April 1, 1999 and pleaded guilty later that year. The case became a baseline example of email-borne macro malware, social engineering, and the operational risk created when common office software and email clients are widely deployed across organizations.

## Technical Analysis

Melissa was a Microsoft Word macro virus. According to the FBI, Smith used a hijacked America Online account to post an infected document to the `alt.sex` newsgroup. The post promised passwords for adult-content websites, inducing users to download and open the document.

When opened in Microsoft Word, the document's macro code used Microsoft Outlook to send infected messages to the first 50 contacts in the victim's address book. NIST described Melissa as a Word macro virus that propagated through email attachments and mailed itself to Outlook address-book entries after a user opened the attachment.

The social-engineering layer increased propagation. The FBI reports that infected messages used deceptive attachment names and text such as "Here is the document you requested ... don't show anyone else ;-)." Recipients who trusted the apparent sender were more likely to open the document, triggering another round of automated mailing.

The technical impact was a mail-volume and resource-exhaustion problem. As infected hosts sent copies to many contacts, email servers received surges of messages carrying the attachment. NIST described the primary impact as email servers worldwide being overwhelmed with virus copies. The FBI reported that some affected organizations shut down email servers entirely to contain the overload.

## Attack Chain

### Stage 1: Newsgroup Seeding

Smith used a hijacked AOL account to post an infected Microsoft Word document to an Internet newsgroup. The lure promised access to passwords for fee-based adult-content websites.

### Stage 2: User Execution

Users who downloaded and opened the Word document executed the embedded macro. The available sources describe user action as the trigger for infection.

### Stage 3: Outlook Address Book Propagation

After execution, Melissa used Microsoft Outlook to send infected messages to the first 50 addresses in the victim's address book. Each recipient then became a potential propagation point if they opened the attachment.

### Stage 4: Mail Server Overload

The high volume of automatically generated mail overwhelmed email infrastructure. More than 300 corporations and government agencies had overloaded mail servers, and some systems were shut down to restore control.

### Stage 5: Containment and Cleanup

Cybersecurity teams contained the spread within days, but organizations needed additional time to remove infections and restore normal service. NIST later identified Melissa as part of the renewed worm wave that followed the Morris Worm era.

## Impact Assessment

The FBI reported worldwide impact across more than 300 corporations and government agencies. Approximately one million email accounts were disrupted, and some Internet traffic slowed in affected locations. The FBI estimated cleanup and repair costs at about $80 million.

The Department of Justice described the National Infrastructure Protection Center's response as a fast warning and coordination effort. Within hours of learning about Melissa, NIPC coordinated with Department of Defense cyber response components and the CERT Coordination Center at Carnegie Mellon University to distribute warnings intended to reduce damage.

NIST treated Melissa as a milestone in the return of worms. Its June 2000 bulletin stated that Melissa marked the first time in ten years that the Internet had experienced a worm, and it placed Melissa alongside Explorer.zip and ILOVEYOU as examples of email-attachment malware that could spread worldwide within hours.

The incident also exposed the systemic risk of software homogeneity. NIST noted that Melissa and ILOVEYOU used Microsoft Outlook address-book functionality as a propagation path. That common platform made email automation efficient for defenders and users, but it also gave the malware a large, consistent propagation surface.

## Attribution

The FBI investigation identified David Lee Smith as the author and operator of the Melissa release. The FBI credits information from AOL, cooperation with New Jersey law enforcement, and analysis of electronic evidence with tracing the virus to Smith.

Smith was arrested in northeastern New Jersey on April 1, 1999. The Department of Justice reported that he pleaded guilty in December 1999 to affecting one million computer systems. The FBI later reported that he was sentenced in May 2002 to 20 months in federal prison, fined $5,000, and agreed to cooperate with federal and state authorities.

The public record supports individual criminal attribution rather than state or organized-crime attribution. The available sources do not describe Melissa as an espionage, extortion, or data-theft operation.

## Timeline

### 1999-03 — Infected Document Posted

Smith used a hijacked AOL account to post a Microsoft Word document carrying Melissa to the `alt.sex` newsgroup.

### 1999-03-26 — Outbreak Begins

Melissa began propagating across the Internet through infected Word attachments and Outlook address-book mailing.

### 1999-03-26 — Federal and CERT Warnings

The Department of Justice reported that NIPC coordinated with Department of Defense cyber response components and the CERT Coordination Center within hours of learning about Melissa to distribute warning messages.

### 1999-04-01 — Smith Arrested

Authorities arrested David Lee Smith in northeastern New Jersey.

### 1999-12 — Guilty Plea

Smith pleaded guilty. DOJ's FY 1999 accountability report described the plea as covering effects on one million computer systems.

### 2000-06 — NIST Retrospective

NIST's ITL Bulletin placed Melissa in a timeline of major 1999 and 2000 hacking events and identified it as a milestone in the emergence of email worms.

### 2002-05 — Sentencing

Smith was sentenced to 20 months in federal prison and fined $5,000.

## Remediation & Mitigation

Initial remediation centered on containment: disabling or throttling overloaded mail systems, removing infected documents and macros, distributing warnings, and updating antivirus signatures. The FBI and DOJ both emphasized warning and coordination activity as part of the federal response.

The durable mitigation lesson was that email clients and office macros needed stronger default controls. NIST noted that Microsoft released an Outlook patch to prevent worms from sending copies of themselves to addresses contained in a user's Outlook address book.

Modern controls for Melissa-like behavior include blocking or sandboxing macro-enabled attachments, disabling unsigned Office macros, restricting programmatic address-book access, scanning outbound mail spikes, and training users to treat unsolicited attachments as hostile even when they appear to come from known contacts.

## Sources & References

- [FBI: Melissa Virus](https://www.fbi.gov/history/famous-cases/melissa-virus) — FBI, 2026-04-29
- [U.S. Department of Justice: Fiscal Year 1999 Annual Accountability Report](https://www.justice.gov/archive/ag/annualreports/ar99/fullrep.htm) — U.S. Department of Justice, 2000-03-31
- [NIST: ITL Bulletin, June 2000, Mitigating Emerging Hacker Threats](https://csrc.nist.gov/csrc/media/publications/shared/documents/itl-bulletin/itlbul2000-06.pdf) — NIST, 2000-06-01
