---
name: "Scattered Spider"
aliases:
  - "UNC3944"
  - "Roasted 0ktapus"
  - "Scatter Swine"
  - "Muddled Libra"
  - "Octo Tempest"
  - "Star Fraud"
affiliation: "Cybercriminal (English-speaking)"
motivation: "Financial"
status: active
country: "United States / United Kingdom"
firstSeen: "2022"
lastSeen: "2025"
targetSectors:
  - "Telecommunications"
  - "Technology"
  - "Hospitality"
  - "Financial Services"
  - "Retail"
targetGeographies:
  - "United States"
  - "United Kingdom"
  - "Global"
tools:
  - "Phishing kits"
  - "SIM swapping"
  - "Social engineering"
  - "BlackCat/ALPHV ransomware"
  - "Cobalt Strike"
mitreMappings:
  - techniqueId: "T1566.002"
    techniqueName: "Phishing: Spearphishing Link"
    tactic: "Initial Access"
    notes: "Phishes employees with fake SSO login pages to harvest MFA-protected credentials."
  - techniqueId: "T1621"
    techniqueName: "Multi-Factor Authentication Request Generation"
    tactic: "Credential Access"
    notes: "Conducts MFA fatigue attacks by sending repeated push notifications."
  - techniqueId: "T1656"
    techniqueName: "Impersonation"
    tactic: "Defense Evasion"
    notes: "Social engineers IT help desks by impersonating employees to reset credentials."
attributionConfidence: A1
attributionRationale: "Multiple members arrested and charged by FBI in 2024, including a UK national extradited to the U.S. CISA advisory AA23-320A documented group TTPs."
reviewStatus: "draft_ai"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "cybercriminal"
  - "scattered-spider"
  - "social-engineering"
  - "sim-swapping"
  - "ransomware"
  - "english-speaking"
sources:
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-320a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2023-11-16"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.justice.gov/usao-cdca/pr/five-defendants-charged-multi-year-hacking-scheme-targeting-dozens-companies-and"
    publisher: "US Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2024-11-20"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.microsoft.com/en-us/security/blog/2023/10/25/octo-tempest-crosses-boundaries-to-facilitate-extortion-encryption-and-destruction/"
    publisher: "Microsoft Security"
    publisherType: vendor
    reliability: R1
    publicationDate: "2023-10-25"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

Scattered Spider (also tracked as UNC3944 and Octo Tempest) is an English-speaking cybercriminal group composed primarily of young adults in the United States and United Kingdom. Active since at least 2022, the group specializes in social engineering, SIM swapping, and identity-based attacks against large enterprises. Scattered Spider is distinguished by its advanced social engineering capabilities, targeting IT help desks and identity providers to bypass multi-factor authentication.

The group has conducted high-profile attacks including the 2023 MGM Resorts ($100 million estimated losses) and Caesars Entertainment ($15 million ransom paid) breaches. Microsoft described Scattered Spider as "one of the most dangerous financial criminal groups" based on the breadth of their targets and techniques. Multiple members have been arrested and charged by the FBI.

## Notable Campaigns

### 2023 -- MGM Resorts and Caesars Entertainment

Scattered Spider, operating as a BlackCat/ALPHV ransomware affiliate, compromised both MGM Resorts and Caesars Entertainment through social engineering of IT help desks. The MGM attack caused approximately $100 million in losses from extended system outages. Caesars reportedly paid a $15 million ransom.

### 2022 -- 0ktapus Phishing Campaign

The group conducted a large-scale phishing campaign targeting Okta SSO credentials across over 130 organizations, primarily technology and telecommunications companies. The campaign used SMS-based phishing to direct employees to fake Okta login pages.

### 2024 -- Continued Enterprise Targeting

Scattered Spider continued targeting large enterprises despite multiple arrests, demonstrating the distributed and resilient nature of the group's membership.

## Technical Capabilities

Scattered Spider's primary capability is advanced social engineering. The group conducts extensive reconnaissance on targets using social media, LinkedIn, and data breaches to build profiles of IT staff. They then call IT help desks impersonating employees to reset passwords and enroll new MFA devices. SIM swapping provides an additional avenue for bypassing SMS-based MFA.

Once inside a network, the group uses legitimate remote access tools, Cobalt Strike, and cloud management consoles for lateral movement and data theft. As BlackCat/ALPHV affiliates, they deployed ransomware against some targets while conducting data-theft-only extortion against others.

## Attribution

In November 2024, the DOJ charged five individuals associated with Scattered Spider, including Tyler Buchanan (UK national), Noah Urban, Ahmed Elbadawy, Evans Osiebo, and Joel Evans. The charges covered hacking, fraud, and identity theft across operations targeting dozens of companies. The FBI's investigation benefited from cooperation with international law enforcement agencies.

## MITRE ATT&CK Profile

**Initial Access**: Phishing for credentials (T1566.002), social engineering of help desks (T1656), and SIM swapping for MFA bypass.

**Credential Access**: MFA fatigue attacks (T1621), credential phishing with fake SSO pages, and SIM swapping.

**Persistence**: Creation of new user accounts (T1136), enrollment of new MFA devices, and OAuth application registration in cloud environments.

**Impact**: Ransomware deployment (T1486) as BlackCat affiliates, data theft, and extortion.

## Sources & References

- [CISA: Advisory AA23-320A - Scattered Spider](https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-320a) -- CISA, 2023-11-16
- [US DOJ: Five Defendants Charged in Multi-Year Hacking Scheme](https://www.justice.gov/usao-cdca/pr/five-defendants-charged-multi-year-hacking-scheme-targeting-dozens-companies-and) -- US Department of Justice, 2024-11-20
- [Microsoft: Octo Tempest Analysis](https://www.microsoft.com/en-us/security/blog/2023/10/25/octo-tempest-crosses-boundaries-to-facilitate-extortion-encryption-and-destruction/) -- Microsoft Security, 2023-10-25
