---
name: "DarkSide"
aliases:
  - "DarkSide ransomware"
affiliation: "Cybercriminal"
motivation: "Financial / Ransomware Extortion"
status: "unknown"
country: "Unknown"
firstSeen: "2020"
lastSeen: "2021"
targetSectors:
  - "Critical Infrastructure"
  - "Energy"
  - "Pipeline Operations"
  - "Business Services"
targetGeographies:
  - "United States"
  - "International"
tools:
  - "DarkSide ransomware"
  - "Cobalt Strike"
mitreMappings:
  - techniqueId: "T1566"
    techniqueName: "Phishing"
    tactic: "Initial Access"
    notes: "CISA and FBI reported that DarkSide actors had been observed gaining initial access through phishing."
  - techniqueId: "T1190"
    techniqueName: "Exploit Public-Facing Application"
    tactic: "Initial Access"
    notes: "CISA and FBI reported DarkSide access through exploitation of remotely accessible accounts and systems."
  - techniqueId: "T1133"
    techniqueName: "External Remote Services"
    tactic: "Initial Access"
    notes: "CISA and FBI reported DarkSide use of externally reachable services, including virtual desktop infrastructure, as an access path."
  - techniqueId: "T1090.003"
    techniqueName: "Multi-hop Proxy"
    tactic: "Command and Control"
    notes: "CISA and FBI reported DarkSide use of Tor for command-and-control and ransomware infrastructure."
  - techniqueId: "T1486"
    techniqueName: "Data Encrypted for Impact"
    tactic: "Impact"
    notes: "CISA and FBI reported DarkSide deployment of ransomware to encrypt victim data."
  - techniqueId: "T1490"
    techniqueName: "Inhibit System Recovery"
    tactic: "Impact"
    notes: "CISA and FBI reported a DarkSide variant that deletes Volume Shadow Copies on affected systems."
attributionConfidence: "A3"
attributionRationale: "CISA, FBI, and DOJ public sources describe DarkSide as a ransomware-as-a-service and extortion operation, including affiliates who deploy the ransomware. The cited sources support cybercriminal attribution but do not identify a state sponsor or named central operator."
reviewStatus: "draft_ai"
generatedBy: "dangermouse-bot"
generatedDate: 2026-05-12
tags:
  - "ransomware"
  - "raas"
  - "darkside"
  - "colonial-pipeline"
  - "critical-infrastructure"
sources:
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa21-131a"
    publisher: "CISA"
    publisherType: "government"
    reliability: "R1"
    publicationDate: "2021-07-08"
    accessDate: "2026-05-12"
    archived: false
  - url: "https://www.cisa.gov/news-events/alerts/2021/05/19/update-cisa-fbi-joint-cybersecurity-advisory-darkside-ransomware"
    publisher: "CISA"
    publisherType: "government"
    reliability: "R1"
    publicationDate: "2021-05-19"
    accessDate: "2026-05-12"
    archived: false
  - url: "https://www.justice.gov/opa/pr/department-justice-seizes-23-million-cryptocurrency-paid-ransomware-extortionists-darkside"
    publisher: "U.S. Department of Justice"
    publisherType: "government"
    reliability: "R1"
    publicationDate: "2021-06-07"
    accessDate: "2026-05-12"
    archived: false
---

## Executive Summary

DarkSide was a ransomware-as-a-service and extortion operation documented by CISA, FBI, and DOJ in connection with the May 2021 Colonial Pipeline incident. CISA and FBI reported that malicious cyber actors deployed DarkSide ransomware against a U.S. pipeline company's information technology network, while operational technology networks were not known to have been directly affected by the ransomware.

The operation used an affiliate model. CISA and FBI described DarkSide as ransomware-as-a-service in which developers receive a share of proceeds from cybercriminal actors who deploy the ransomware. DOJ later announced the seizure of cryptocurrency proceeds traceable to a Colonial Pipeline ransom payment to DarkSide-affiliated actors.

## Notable Campaigns

The cited public sources center on the Colonial Pipeline incident. [CISA: DarkSide Ransomware: Best Practices for Preventing Business Disruption from Ransomware Attacks](https://www.cisa.gov/news-events/cybersecurity-advisories/aa21-131a) reported that DarkSide ransomware was deployed against a U.S. pipeline company's IT network and that the company proactively disconnected certain operational technology systems as a safety measure.

[U.S. Department of Justice: Department of Justice Seizes $2.3 Million in Cryptocurrency Paid to the Ransomware Extortionists DarkSide](https://www.justice.gov/opa/pr/department-justice-seizes-23-million-cryptocurrency-paid-ransomware-extortionists-darkside) stated that Colonial Pipeline reported a May 2021 ransomware attack to the FBI and that the company's computer network had been accessed by an organization named DarkSide. DOJ announced seizure of 63.7 bitcoins, then valued at approximately $2.3 million, allegedly representing proceeds of the ransom payment.

## Technical Capabilities

CISA and FBI reported that DarkSide actors had previously been observed gaining initial access through phishing, exploitation of public-facing systems, externally reachable accounts and systems, and virtual desktop infrastructure. The advisory also reported use of Remote Desktop Protocol for persistence and Cobalt Strike for command and control.

DarkSide activity included data theft and ransomware deployment. CISA and FBI reported that DarkSide actors encrypted and stole sensitive data, then threatened public release if the ransom was not paid. The advisory also described DarkSide ransomware use of Salsa20 and RSA encryption. A later CISA update described a DarkSide ransomware variant that deletes Volume Shadow Copies, collects and encrypts system information, sends system information to command-and-control domains, and generates a ransom note.

## Attribution

The cited sources support attribution to a financially motivated cybercriminal operation. CISA and FBI described DarkSide as ransomware-as-a-service, with developers and affiliates sharing proceeds. DOJ described funds seized from a wallet associated with DarkSide-affiliated actors and tied the funds to Colonial Pipeline's ransom payment.

The cited public sources do not identify a state sponsor, and they do not name a central DarkSide operator. Lineage claims between DarkSide and later ransomware operations should be treated separately unless supported by direct evidence in the relevant source set.

## MITRE ATT&CK Profile

T1566 - Phishing: CISA and FBI reported DarkSide initial access through phishing.

T1190 - Exploit Public-Facing Application: CISA and FBI reported DarkSide exploitation of remotely accessible systems.

T1133 - External Remote Services: CISA and FBI reported DarkSide access through externally reachable services, including virtual desktop infrastructure.

T1090.003 - Multi-hop Proxy: CISA and FBI reported DarkSide use of Tor for command-and-control infrastructure.

T1486 - Data Encrypted for Impact: CISA and FBI reported deployment of DarkSide ransomware to encrypt victim systems.

T1490 - Inhibit System Recovery: CISA and FBI reported a DarkSide variant that deletes Volume Shadow Copies.

## Sources & References

- [CISA: DarkSide Ransomware: Best Practices for Preventing Business Disruption from Ransomware Attacks](https://www.cisa.gov/news-events/cybersecurity-advisories/aa21-131a) — CISA, 2021-07-08
- [CISA: Update to CISA-FBI Joint Cybersecurity Advisory on DarkSide Ransomware](https://www.cisa.gov/news-events/alerts/2021/05/19/update-cisa-fbi-joint-cybersecurity-advisory-darkside-ransomware) — CISA, 2021-05-19
- [U.S. Department of Justice: Department of Justice Seizes $2.3 Million in Cryptocurrency Paid to the Ransomware Extortionists DarkSide](https://www.justice.gov/opa/pr/department-justice-seizes-23-million-cryptocurrency-paid-ransomware-extortionists-darkside) — U.S. Department of Justice, 2021-06-07
