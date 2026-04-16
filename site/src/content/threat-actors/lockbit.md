---
name: "LockBit"
aliases:
  - "LockBit Gang"
  - "ABCD ransomware"
  - "Bitwise Spider"
affiliation: "Cybercriminal (Russian-speaking)"
motivation: "Financial"
status: inactive
country: "Russia"
firstSeen: "2019"
lastSeen: "2024"
targetSectors:
  - "Healthcare"
  - "Government"
  - "Financial Services"
  - "Manufacturing"
  - "Technology"
  - "Education"
targetGeographies:
  - "Global"
  - "United States"
  - "Europe"
  - "Asia Pacific"
tools:
  - "LockBit 2.0"
  - "LockBit 3.0 (LockBit Black)"
  - "LockBit Green"
  - "StealBit"
  - "Cobalt Strike"
mitreMappings:
  - techniqueId: "T1486"
    techniqueName: "Data Encrypted for Impact"
    tactic: "Impact"
    notes: "LockBit ransomware encrypts files and appends the .lockbit extension."
  - techniqueId: "T1490"
    techniqueName: "Inhibit System Recovery"
    tactic: "Impact"
    notes: "Deletes volume shadow copies and disables Windows recovery options."
  - techniqueId: "T1078"
    techniqueName: "Valid Accounts"
    tactic: "Initial Access"
    notes: "Affiliates commonly use compromised RDP credentials and VPN access for initial entry."
attributionConfidence: A1
attributionRationale: "Disrupted by Operation Cronos (February 2024). Lead developer Dmitry Khoroshev identified and indicted by DOJ in May 2024. FBI and NCA confirmed identities of operators."
reviewStatus: "draft_ai"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "ransomware"
  - "raas"
  - "lockbit"
  - "double-extortion"
  - "operation-cronos"
sources:
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-165a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2023-06-14"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.justice.gov/opa/pr/us-and-uk-disrupt-lockbit-ransomware-variant"
    publisher: "US Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2024-02-20"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.nationalcrimeagency.gov.uk/news/nca-leads-international-investigation-targeting-worlds-most-harmful-ransomware-group"
    publisher: "UK National Crime Agency"
    publisherType: government
    reliability: R1
    publicationDate: "2024-02-20"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

LockBit was the most prolific ransomware-as-a-service (RaaS) operation from 2021 through early 2024, responsible for more ransomware attacks globally than any other group. Active since September 2019, LockBit operated an affiliate model that attracted hundreds of affiliates and accumulated over 2,000 victims across all sectors. The operation was disrupted by Operation Cronos, a multinational law enforcement action led by the UK's NCA and FBI in February 2024.

In May 2024, the DOJ indicted Dmitry Yuryevich Khoroshev, a Russian national identified as "LockBitSupp," the lead developer and administrator of the LockBit operation. The U.S. State Department offered a $10 million reward for information leading to his arrest. Multiple LockBit affiliates have been arrested across several countries.

## Notable Campaigns

### 2023 -- Boeing and ICBC Attacks

LockBit affiliates compromised Boeing (exfiltrating 43 GB of data) and the Industrial and Commercial Bank of China's (ICBC) U.S. operations, disrupting U.S. Treasury market settlements. The ICBC attack highlighted the potential systemic risk of ransomware attacks on financial infrastructure.

### 2022 -- Royal Mail Attack

A LockBit affiliate attacked the UK Royal Mail, disrupting international parcel and letter deliveries for weeks. The attack was attributed to a LockBit affiliate operating from Russia.

### 2023 -- Healthcare Sector Targeting

LockBit and its affiliates targeted multiple healthcare organizations globally, prompting a joint CISA/FBI advisory. The group's rules purportedly prohibited attacks on healthcare, but enforcement was inconsistent.

## Technical Capabilities

LockBit ransomware evolved through three major versions. **LockBit 2.0** introduced the StealBit data exfiltration tool and automated Active Directory propagation. **LockBit 3.0** (LockBit Black) incorporated anti-analysis features from BlackMatter ransomware and introduced a bug bounty program for vulnerability reports. **LockBit Green** used code from the leaked Conti ransomware source.

The RaaS operation provided affiliates with a web-based builder, negotiation panel, and data leak site. LockBit's competitive advantage was speed -- the ransomware was among the fastest encryptors available, capable of encrypting a network in minutes. The operation took a 20% commission on ransom payments.

## Attribution

Operation Cronos (February 2024) disrupted LockBit's infrastructure, seized servers, and recovered over 1,000 decryption keys. The DOJ subsequently indicted Khoroshev (May 2024) and identified him as the operation's leader. Multiple affiliates have been arrested including Mikhail Vasiliev (Canada), Ruslan Astamirov (U.S.), and Artur Sungatov (charged in absentia). The NCA published detailed technical intelligence gathered during the takedown.

## MITRE ATT&CK Profile

**Initial Access**: RDP compromise (T1078), exploitation of VPN and firewall vulnerabilities (T1190), and access broker purchases.

**Execution**: PowerShell (T1059.001), WMI (T1047), and Group Policy-based deployment for network-wide encryption.

**Exfiltration**: StealBit tool for automated data exfiltration (T1567.002) to attacker infrastructure.

**Impact**: File encryption (T1486), shadow copy deletion (T1490), service termination (T1489), and system shutdown commands.

## Sources & References

- [CISA: Advisory AA23-165A - LockBit](https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-165a) -- CISA, 2023-06-14
- [US DOJ: LockBit Disrupted](https://www.justice.gov/opa/pr/us-and-uk-disrupt-lockbit-ransomware-variant) -- US Department of Justice, 2024-02-20
- [UK NCA: LockBit Investigation](https://www.nationalcrimeagency.gov.uk/news/nca-leads-international-investigation-targeting-worlds-most-harmful-ransomware-group) -- UK National Crime Agency, 2024-02-20
