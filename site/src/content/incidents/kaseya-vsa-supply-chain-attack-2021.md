---
eventId: "TP-2026-0022"
title: "Kaseya VSA Supply Chain Ransomware Attack"
date: 2021-07-02
attackType: "Supply Chain / Ransomware"
severity: critical
sector: "Technology"
geography: "Global"
threatActor: "REvil"
attributionConfidence: A1
reviewStatus: "certified"
confidenceGrade: A
generatedBy: "penfold-bot"
generatedDate: 2026-04-15
cves:
  - "CVE-2021-30116"
relatedSlugs:
  - "revil"
tags:
  - "ransomware"
  - "supply-chain"
  - "kaseya"
  - "vsa"
  - "revil"
  - "sodinokibi"
  - "msp"
  - "cve-2021-30116"
sources:
  - url: "https://www.cisa.gov/news-events/alerts/2021/07/04/cisa-and-fbi-release-guidance-msps-and-their-customers-affected-kaseya-vsa"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2021-07-04"
    accessDate: "2026-04-15"
    archived: false
  - url: "https://www.fbi.gov/news/press-releases/press-releases/fbi-and-cisa-guidance-to-msps-and-their-customers-affected-by-the-kaseya-vsa-ransomware-attack"
    publisher: "FBI"
    publisherType: government
    reliability: R1
    publicationDate: "2021-07-04"
    accessDate: "2026-04-15"
    archived: false
  - url: "https://www.mandiant.com/resources/blog/kaseya-vsa-exploitation-initial-analysis"
    publisher: "Mandiant"
    publisherType: vendor
    reliability: R1
    publicationDate: "2021-07-03"
    accessDate: "2026-04-15"
    archived: false
  - url: "https://www.justice.gov/opa/pr/department-justice-announces-charges-and-arrests-two-separate-major-ransomware-cases"
    publisher: "US Department of Justice"
    publisherType: government
    reliability: R1
    accessDate: "2026-04-15"
    archived: false
  - url: "https://www.kaseya.com/trust-center/"
    publisher: "Kaseya"
    publisherType: vendor
    reliability: R2
    accessDate: "2026-04-15"
    archived: false
mitreMappings:
  - techniqueId: "T1195.002"
    techniqueName: "Supply Chain Compromise: Compromise Software Supply Chain"
    tactic: "Initial Access"
    notes: "Attacker exploited vulnerabilities in the Kaseya VSA software to distribute ransomware to downstream customers."
  - techniqueId: "T1486"
    techniqueName: "Data Encrypted for Impact"
    tactic: "Impact"
    notes: "The REvil ransomware encrypted data on thousands of endpoints belonging to MSP customers."
  - techniqueId: "T1105"
    techniqueName: "Ingress Tool Transfer"
    tactic: "Command and Control"
    notes: "The VSA agent was used to push malicious base64-encoded payloads to managed endpoints."
---

## Summary

On July 2, 2021, the REvil (Sodinokibi) ransomware group launched a massive, automated supply chain attack by exploiting a zero-day vulnerability in **Kaseya VSA**, a popular remote monitoring and management (RMM) software used by Managed Service Providers (MSPs). By compromising the VSA server infrastructure, the attackers were able to bypass localized security controls and deploy ransomware directly to thousands of downstream endpoints managed by these MSPs.

The attack was specifically timed for the U.S. Independence Day holiday weekend to maximize the delay in response. An estimated 60 MSPs were directly compromised, leading to the encryption of over 1,500 downstream businesses worldwide, including supermarkets, schools, and small-to-medium enterprises. REvil initially demanded a record-breaking $70 million Bitcoin ransom for a universal decryptor.

## Technical Analysis

The Kaseya VSA attack utilized a sophisticated multi-stage exploit chain targeting an authentication bypass vulnerability in the VSA web interface (**CVE-2021-30116**). This allowed the attackers to gain administrative access to the VSA server without valid credentials.

Once administrative access was achieved, the attackers leveraged the legitimate VSA functionality—intended for software deployment and patch management—to distribute a malicious payload. The payload was a base64-encoded certificate file (`KuserDeploy.ps1`) that, when executed via the VSA agent, leveraged PowerShell to disable Windows Defender and drop the REvil encryptor.

The encryption process used a specialized variant of the Sodinokibi ransomware that did not require a command-and-control connection to begin the encryption, as the keying material was embedded in the task push itself. This "offline" capability ensured that even machines without direct internet access were encrypted instantly once the task was received from the local VSA server.

## Attack Chain

### Stage 1: Authentication Bypass
Attacker exploits CVE-2021-30116 on the internet-facing Kaseya VSA server to gain an authenticated session.

### Stage 2: Payload Distribution
The attacker uploads a malicious PowerShell script disguised as a deployment task. The VSA server pushes this task to all connected VSA agents (on-premise servers and managed endpoints).

### Stage 3: Endpoint Execution
The VSA agent executes the PowerShell script with SYSTEM privileges. The script performs environment checks, bypasses AV, and executes the ransomware binary (`agent.exe`).

## Impact Assessment

The attack's scope was broad because of the "force multiplier" effect of targeting an MSP tool. Notable impacts included:
- **Coop Supermarkets (Sweden):** Forced to close over 800 stores for several days because their point-of-sale systems were encrypted.
- **Schools in New Zealand:** Multiple kindergartens and schools lost access to administrative and student data.
- **MSP Paralysis:** Dozens of MSPs were forced to shut down their entire infrastructure to prevent further spread, leaving thousands of customers without IT support.

Kaseya eventually obtained a universal decryptor from a "third party" on July 21, 2021, and worked with law enforcement to restore customer data without paying the ransom.

## Attribution

The attack is attributed with high confidence to **REvil** (also known as Sodinokibi), a Russia-linked Ransomware-as-a-Service (RaaS) group. This attribution is based on the specific ransomware code signatures, the use of the REvil leak site (Happy Blog) for negotiations, and technical indicators identified by the FBI and private sector firms like Mandiant and CrowdStrike.

In November 2021, the U.S. Department of Justice charged several individuals associated with REvil for their roles in the Kaseya attack and other campaigns, identifying them as part of a transnational criminal organization operating primarily from Russia.

## Timeline

### 2021-04-02 — DIVD Disclosure
Researchers at the Dutch Institute for Vulnerability Disclosure (DIVD) privately notified Kaseya of several zero-day vulnerabilities, including CVE-2021-30116.

### 2021-07-02 14:00 EST — Outbreak Begins
REvil begins exploiting unpatched VSA servers to distribute the ransomware payload.

### 2021-07-02 16:00 EST — Kaseya Advisory
Kaseya issues an "Immediate Advisory" instructing all customers to shut down their on-premise VSA servers and suspends its own SaaS infrastructure.

### 2021-07-04 — CISA/FBI Guidance
CISA and the FBI release joint technical guidance for MSPs and impacted businesses.

### 2021-07-21 — Decryptor Obtained
Kaseya announces it has obtained a universal decryptor and begins the restoration process.

## Sources & References

- [CISA Alert (AA21-187A): Guidance for MSPs and Customers Affected by Kaseya VSA](https://www.cisa.gov/news-events/alerts/2021/07/04/cisa-and-fbi-release-guidance-msps-and-their-customers-affected-kaseya-vsa) — CISA, 2021-07-04
- [FBI News Release: FBI and CISA Guidance to MSPs and Customers](https://www.fbi.gov/news/press-releases/press-releases/fbi-and-cisa-guidance-to-msps-and-their-customers-affected-by-the-kaseya-vsa-ransomware-attack) — FBI, 2021-07-04
- [US DOJ: Department of Justice Announces Charges Against REvil Ransomware Actors](https://www.justice.gov/opa/pr/department-justice-announces-charges-and-arrests-two-separate-major-ransomware-cases) — US Department of Justice, 2021
- [Mandiant: Kaseya VSA Exploitation Initial Analysis](https://www.mandiant.com/resources/blog/kaseya-vsa-exploitation-initial-analysis) — Mandiant, 2021-07-03
- [Kaseya: Trust Center — Incident Response Resources](https://www.kaseya.com/trust-center/) — Kaseya
