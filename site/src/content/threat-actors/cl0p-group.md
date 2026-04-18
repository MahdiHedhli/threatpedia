---
name: "Cl0p"
aliases:
  - "CLOP"
  - "Cl0p Gang"
affiliation: "Cybercriminal (Russian-speaking)"
motivation: "Financial"
status: active
country: "Russia"
firstSeen: "2019"
lastSeen: "2025"
targetSectors:
  - "Financial Services"
  - "Healthcare"
  - "Government"
  - "Education"
  - "Technology"
targetGeographies:
  - "Global"
  - "United States"
  - "Europe"
tools:
  - "Cl0p ransomware"
  - "DEWMODE"
  - "TrueBot"
  - "FlawedAmmyy"
  - "Cobalt Strike"
mitreMappings:
  - techniqueId: "T1190"
    techniqueName: "Exploit Public-Facing Application"
    tactic: "Initial Access"
    notes: "Cl0p exploits zero-day vulnerabilities in file transfer appliances (MOVEit, GoAnywhere, Accellion)."
  - techniqueId: "T1486"
    techniqueName: "Data Encrypted for Impact"
    tactic: "Impact"
    notes: "Deploys Cl0p ransomware for file encryption, though recent campaigns focus on data theft only."
  - techniqueId: "T1567.002"
    techniqueName: "Exfiltration Over Web Service: Exfiltration to Cloud Storage"
    tactic: "Exfiltration"
    notes: "Mass data exfiltration from compromised file transfer platforms before disclosure."
attributionConfidence: A2
attributionRationale: "CISA and FBI attributed Cl0p as a Russian-speaking cybercriminal group. Ukrainian law enforcement arrested six suspected members in 2021, though the operation continued."
reviewStatus: "under_review"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "ransomware"
  - "cl0p"
  - "zero-day"
  - "file-transfer"
  - "mass-exploitation"
  - "double-extortion"
sources:
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-158a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2023-06-07"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.ic3.gov/Media/News/2023/230607.pdf"
    publisher: "FBI"
    publisherType: government
    reliability: R1
    publicationDate: "2023-06-07"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.mandiant.com/resources/blog/zero-day-moveit-data-theft"
    publisher: "Mandiant"
    publisherType: vendor
    reliability: R1
    publicationDate: "2023-06-02"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.state.gov/rewards-for-justice-cl0p-ransomware/"
    publisher: "US Department of State"
    publisherType: government
    reliability: R1
    publicationDate: "2023-06-16"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

Cl0p is a Russian-speaking cybercriminal group that has evolved from a traditional ransomware operation into one of the most prolific mass-exploitation threat actors. Active since 2019, Cl0p has pioneered a model of exploiting zero-day vulnerabilities in enterprise file transfer solutions to conduct mass data theft campaigns affecting thousands of organizations simultaneously.

The group's exploitation of vulnerabilities in Accellion FTA (2020-2021), Fortra GoAnywhere MFT (2023), and Progress MOVEit Transfer (2023) collectively compromised over 2,500 organizations. The MOVEit campaign alone affected over 2,000 organizations and exposed data belonging to more than 60 million individuals. The U.S. State Department's Rewards for Justice program has offered up to $10 million for information on Cl0p members.

## Notable Campaigns

### 2023 -- MOVEit Transfer Mass Exploitation

Cl0p exploited CVE-2023-34362, a SQL injection zero-day in Progress MOVEit Transfer, to exfiltrate data from over 2,000 organizations worldwide. Victims included the U.S. Department of Energy, Shell, British Airways, and the BBC. The group used automated scripts to extract data from MOVEit instances before any patches were available.

### 2023 -- Fortra GoAnywhere MFT Exploitation

Cl0p exploited CVE-2023-0669 in Fortra GoAnywhere MFT, claiming to have compromised 130 organizations in the campaign. The group used the DEWMODE web shell to access and exfiltrate data from compromised GoAnywhere instances.

### 2020-2021 -- Accellion FTA Exploitation

Cl0p exploited multiple vulnerabilities in the Accellion File Transfer Appliance to steal data from organizations including Shell, Bombardier, Morgan Stanley, and several U.S. universities. This campaign established the group's file-transfer-appliance exploitation model.

## Technical Capabilities

Cl0p specializes in identifying and exploiting zero-day vulnerabilities in enterprise file transfer platforms. The group appears to stockpile zero-days and deploy them in mass-exploitation campaigns, compromising hundreds of organizations in rapid succession before patches are available.

The Cl0p ransomware itself is a Windows-based encryptor that has been in development since 2019. However, in recent campaigns, the group has shifted to data-theft-only operations, exfiltrating data and threatening publication on their leak site without encrypting victim systems. This approach reduces operational complexity and incident response detection opportunities.

The group operates a Tor-based data leak site and uses a tiered extortion model: direct negotiation demands, followed by naming victims publicly, and finally publishing stolen data.

## Attribution

CISA and FBI published joint advisories (AA23-158A) attributing the MOVEit exploitation to Cl0p. The U.S. State Department offered a $10 million reward for information leading to the identification of Cl0p members. In 2021, Ukrainian law enforcement arrested six individuals linked to the Cl0p operation, though the group continued operating, suggesting leadership remained at large.

Cl0p has historical overlaps with the TA505/FIN11 threat clusters, sharing infrastructure, tooling, and operational patterns. Those overlaps are analytically important, but they do not justify treating TA505 or FIN11 as direct aliases of the Cl0p group.

## MITRE ATT&CK Profile

**Initial Access**: Exploitation of zero-day vulnerabilities in public-facing file transfer applications (T1190) is the primary and defining vector.

**Execution**: Web shells (T1505.003) deployed on compromised file transfer appliances enable command execution and data access. DEWMODE and custom web shells are used.

**Exfiltration**: Automated data exfiltration scripts extract files from compromised platforms and transfer them to attacker-controlled infrastructure (T1567.002).

**Impact**: Data encrypted for impact (T1486) in traditional ransomware deployments, though recent operations focus exclusively on data theft and extortion.

## Sources & References

- [CISA: Advisory AA23-158A - Cl0p MOVEit Exploitation](https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-158a) -- CISA, 2023-06-07
- [FBI: Cl0p Ransomware Gang Exploits MOVEit](https://www.ic3.gov/Media/News/2023/230607.pdf) -- FBI, 2023-06-07
- [Mandiant: Zero-Day MOVEit Data Theft](https://www.mandiant.com/resources/blog/zero-day-moveit-data-theft) -- Mandiant, 2023-06-02
- [US State Department: Rewards for Justice - Cl0p](https://www.state.gov/rewards-for-justice-cl0p-ransomware/) -- US Department of State, 2023-06-16
