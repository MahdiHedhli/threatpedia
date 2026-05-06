---
campaignId: "TP-CAMP-2013-0001"
title: "Carbanak Banking Campaign: Multi-Year Financial Institution Operations"
startDate: 2013-01-01
endDate: 2018-03-26
ongoing: false
attackType: "Financial Cybercrime / ATM Cashout and Fraudulent Bank Transfer"
severity: critical
sector: "Finance / Banking"
geography: "Global"
threatActor: "Carbanak Group"
attributionConfidence: A3
reviewStatus: "draft_ai"
confidenceGrade: B
generatedBy: "new-threat-intel-automation"
generatedDate: 2026-05-06
cves: []
relatedIncidents: []
tags:
  - "carbanak"
  - "anunak"
  - "financial-cybercrime"
  - "atm-cashout"
  - "banking"
  - "swift-fraud"
  - "spear-phishing"
sources:
  - url: "https://www.europol.europa.eu/media-press/newsroom/news/mastermind-behind-eur-1-billion-cyber-bank-robbery-arrested-in-spain"
    publisher: "Europol"
    publisherType: government
    reliability: R1
    publicationDate: "2018-03-26"
    accessDate: "2026-05-06"
    archived: false
  - url: "https://www.cisa.gov/uscert/ncas/alerts/aa19-206a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2019-07-25"
    accessDate: "2026-05-06"
    archived: false
  - url: "https://www.fbi.gov/news/press-releases/press-releases/three-members-of-notorious-international-cybercrime-group-fin7-in-custody-for-role-in-attacking-over-100-us-companies"
    publisher: "FBI"
    publisherType: government
    reliability: R1
    publicationDate: "2018-08-01"
    accessDate: "2026-05-06"
    archived: false
mitreMappings:
  - techniqueId: "T1566.001"
    techniqueName: "Phishing: Spearphishing Attachment"
    tactic: "Initial Access"
    notes: "The Carbanak Group sent targeted spear-phishing emails with malicious document attachments to bank employees, exploiting document viewer vulnerabilities to execute payloads on opening."
  - techniqueId: "T1547.001"
    techniqueName: "Boot or Logon Autostart Execution: Registry Run Keys / Startup Folder"
    tactic: "Persistence"
    notes: "The Carbanak backdoor used Windows registry run keys and startup folder entries to maintain persistence across reboots in compromised financial institution environments."
  - techniqueId: "T1056.001"
    techniqueName: "Input Capture: Keylogging"
    tactic: "Credential Access"
    notes: "Carbanak operators deployed keyloggers to harvest credentials of banking staff, enabling access to internal transaction and ATM management systems."
  - techniqueId: "T1219"
    techniqueName: "Remote Access Software"
    tactic: "Command and Control"
    notes: "Operators used remote access tools and the Carbanak backdoor's built-in remote control capabilities to maintain persistent interactive access to compromised banking systems over extended periods."
---

## Executive Summary

The Carbanak Banking Campaign was a multi-year financially motivated intrusion campaign attributed by Europol and associated law enforcement to a criminal group operating under the Carbanak and Anunak designations. The campaign targeted financial institutions globally, with confirmed operations documented from 2013 through 2018. The group accessed internal banking systems and ATM management infrastructure to facilitate fraudulent transfers and ATM cashouts.

Europol reported losses of up to EUR 1 billion across more than 100 financial institutions in approximately 40 countries. In March 2018, Spanish authorities arrested the identified leader of the operation in coordination with Europol, Europol's European Cybercrime Centre (EC3), the FBI, and law enforcement from multiple countries. The Carbanak Group is operationally distinct from — though frequently discussed in proximity to — FIN7, a separate criminal actor that used overlapping tooling for different targeting objectives.

## Technical Analysis

The Carbanak Group gained initial access to financial institution networks through spear-phishing campaigns targeting bank employees. Emails with malicious document attachments delivered the Carbanak backdoor (also referred to as Anunak in earlier reporting) by exploiting vulnerabilities in document processing applications. Once deployed, the backdoor provided persistent command-and-control capabilities and remote interactive access.

Inside compromised networks, operators spent extended periods — in some cases several months — conducting surveillance and reconnaissance before initiating financial extraction. Operators used keyloggers to capture credentials belonging to bank employees with access to transaction systems and ATM management platforms. Screen capture capabilities in the Carbanak backdoor allowed operators to observe banking workflows directly and learn the internal procedures of targeted institutions.

Financial extraction was conducted through two primary mechanisms. For ATM cashouts, operators accessed ATM management systems and programmed dispensing events timed to coordinated pickups by money mules at physical ATM locations. For high-value transfers, operators accessed internal interbank systems and SWIFT infrastructure to initiate fraudulent transfers to attacker-controlled accounts.

## Attack Chain

### Stage 1: Spear-Phishing Against Bank Employees

Operators sent targeted emails to bank employees with malicious document attachments. These documents exploited vulnerabilities in document viewer software to execute the Carbanak backdoor without requiring additional user interaction beyond opening the file.

### Stage 2: Backdoor Deployment and Persistence

The Carbanak backdoor established persistence using Windows registry run keys and startup mechanisms. The backdoor provided remote command execution, file transfer, keylogging, and screen capture capabilities.

### Stage 3: Internal Reconnaissance and Credential Harvesting

Operators conducted extended reconnaissance inside compromised networks. Keyloggers captured employee credentials for internal banking applications. Screen capture was used to observe transaction workflows, ATM management interfaces, and internal procedures.

### Stage 4: Lateral Movement to Financial Systems

Using harvested credentials, operators moved laterally to systems with access to ATM management software and interbank transaction platforms. This movement occurred gradually over weeks or months to avoid detection.

### Stage 5: Financial Extraction

Operators initiated extraction using one of two methods depending on the institution and accessible systems. ATM cashout operations involved programming ATMs to dispense cash at predetermined times. Transfer-based operations involved initiating fraudulent transactions through internal banking transfer systems and, in some cases, SWIFT messaging infrastructure.

### Stage 6: Money Mule Coordination

Physical cash extracted from ATMs was collected by coordinated money mule networks positioned at ATM locations at programmed cashout times. Fraudulent wire transfers were routed to attacker-controlled accounts across multiple jurisdictions.

## MITRE ATT&CK Mapping

### Initial Access

T1566.001 - Phishing: Spearphishing Attachment: Targeted bank employees received spear-phishing emails with malicious document attachments that exploited document viewer vulnerabilities to deploy the Carbanak backdoor without requiring additional user interaction.

### Persistence

T1547.001 - Boot or Logon Autostart Execution: Registry Run Keys / Startup Folder: Carbanak maintained persistence across system reboots using Windows registry run keys and startup folder entries within compromised banking environments.

### Credential Access

T1056.001 - Input Capture: Keylogging: Keyloggers captured credentials of bank employees with access to ATM management and internal transaction systems, enabling operator access to financial control infrastructure.

### Command and Control

T1219 - Remote Access Software: The Carbanak backdoor provided persistent interactive remote access, enabling operators to conduct extended reconnaissance and maintain control over compromised banking systems throughout the campaign's operational phases.

## Timeline

### 2013-01-01 — Campaign Activity Period Begins

Public reporting and law enforcement assessments indicate Carbanak Group intrusion activity targeting financial institutions was under way by at least early 2013. Initial targets were reported in Russia and Eastern Europe before expanding to institutions in other regions.

### 2015-02 — First Public Disclosure

Security researchers published technical analysis of the Carbanak malware and associated intrusion activity, providing the first public documentation of the campaign's methods, scope, and scale.

### 2018-03-26 — Lead Suspect Arrested in Spain

Spanish National Police, in coordination with Europol's EC3, the FBI, and partner agencies, arrested the identified leader of the Carbanak criminal group in Alicante, Spain. Europol attributed losses of up to EUR 1 billion across more than 100 financial institutions in approximately 40 countries to the group's operations.

### 2018-08-01 — U.S. Department of Justice Announces Related Indictments

The U.S. Department of Justice announced the arrest of three members of a criminal group associated with the overlapping FIN7 intrusion set. The FBI press release noted the group's financial cybercrime operations targeting U.S. and international companies. Public reporting and vendor analysis identified tool and operational overlaps with Carbanak-linked activity, though the FIN7 indictments address a distinct targeting focus.

### 2019-07-25 — CISA Issues Alert AA19-206A

CISA published advisory AA19-206A documenting observed tactics, techniques, and procedures relevant to the Carbanak and associated activity, providing guidance for financial institutions on detection and mitigation.

## Remediation & Mitigation

Financial institutions should treat email attachments from external sources as a primary initial access vector and apply layered controls at the email gateway, endpoint, and document processing layers.

Deploy endpoint detection and response capabilities on all systems with access to ATM management software, transaction processing platforms, and interbank transfer infrastructure. Extended dwell time is a documented characteristic of this campaign; detection should account for attacker presence measured in weeks rather than hours.

Implement behavioral monitoring for ATM management systems. Dispense schedule changes, diagnostic mode activations outside of standard maintenance windows, and access by accounts not associated with ATM operations are indicators associated with Carbanak-style ATM cashout preparation.

Apply network segmentation to limit lateral movement from general employee workstations to systems with access to SWIFT messaging infrastructure and internal transfer platforms. Require additional authentication steps for access to transaction-critical systems.

Audit privileged access to banking control systems. Accounts with access to ATM management and interbank transfer platforms require monitoring proportional to the financial risk they represent. Apply the principle of least privilege to limit the scope of credential theft impact.

Review CISA Alert AA19-206A for current indicators and detection guidance applicable to financial institution environments.

## Sources & References

- [Europol: Mastermind Behind EUR 1 Billion Cyber Bank Robbery Arrested in Spain](https://www.europol.europa.eu/media-press/newsroom/news/mastermind-behind-eur-1-billion-cyber-bank-robbery-arrested-in-spain) — Europol, 2018-03-26
- [CISA: Alert AA19-206A](https://www.cisa.gov/uscert/ncas/alerts/aa19-206a) — CISA, 2019-07-25
- [FBI: Three Members of Notorious International Cybercrime Group FIN7 in Custody](https://www.fbi.gov/news/press-releases/press-releases/three-members-of-notorious-international-cybercrime-group-fin7-in-custody-for-role-in-attacking-over-100-us-companies) — FBI, 2018-08-01
