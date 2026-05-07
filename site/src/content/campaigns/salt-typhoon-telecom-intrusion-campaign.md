---
campaignId: "TP-CAMP-2024-0001"
title: "Salt Typhoon U.S. Telecommunications Intrusion Campaign"
startDate: 2024-01-01
ongoing: true
attackType: "Espionage / Communications Interception"
severity: critical
sector: "Telecommunications"
geography: "United States"
threatActor: "Salt Typhoon"
attributionConfidence: A2
reviewStatus: "draft_ai"
confidenceGrade: B
generatedBy: "dangermouse-bot"
generatedDate: 2026-05-07
cves: []
relatedIncidents: []
tags:
  - "salt-typhoon"
  - "china"
  - "prc"
  - "telecom"
  - "lawful-intercept"
  - "espionage"
  - "calea"
  - "state-sponsored"
sources:
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-335a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2024-11-30"
    accessDate: "2026-05-07"
    archived: false
  - url: "https://www.fbi.gov/news/press-releases/fbi-and-cisa-release-joint-statement-on-peoples-republic-of-china-targeting-of-commercial-telecommunications-infrastructure"
    publisher: "FBI"
    publisherType: government
    reliability: R1
    publicationDate: "2024-10-25"
    accessDate: "2026-05-07"
    archived: false
  - url: "https://www.cisa.gov/sites/default/files/2024-12/guidance-on-mobile-communications-best-practices.pdf"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2024-12-18"
    accessDate: "2026-05-07"
    archived: false
  - url: "https://www.microsoft.com/en-us/security/blog/2024/10/09/salt-typhoon-targets-telecommunications-companies-worldwide"
    publisher: "Microsoft Security"
    publisherType: vendor
    reliability: R2
    publicationDate: "2024-10-09"
    accessDate: "2026-05-07"
    archived: false
mitreMappings:
  - techniqueId: "T1190"
    techniqueName: "Exploit Public-Facing Application"
    tactic: "Initial Access"
    notes: "Salt Typhoon exploited vulnerabilities in telecommunications network edge devices and routers to gain initial footholds in targeted provider environments, as documented in advisory AA24-335a."
  - techniqueId: "T1078"
    techniqueName: "Valid Accounts"
    tactic: "Persistence"
    notes: "The actors used compromised credentials to maintain persistent access across targeted telecommunications provider networks over an extended period."
  - techniqueId: "T1557"
    techniqueName: "Adversary-in-the-Middle"
    tactic: "Collection"
    notes: "Salt Typhoon accessed lawful intercept systems and telecommunications backbone infrastructure, enabling interception of call metadata for multiple customer bases and communications content for a targeted subset of individuals."
  - techniqueId: "T1071"
    techniqueName: "Application Layer Protocol"
    tactic: "Command and Control"
    notes: "Command and control activity used standard application layer protocols to blend with normal network communications within targeted provider environments."
---

## Executive Summary

Salt Typhoon, a People's Republic of China (PRC) state-sponsored threat actor, conducted an intrusion campaign against U.S. telecommunications providers in 2024. The FBI and CISA confirmed that actors compromised the networks of multiple U.S. telecommunications companies and gained access to lawful intercept systems used for court-authorized surveillance operations. The actors also collected call detail records for multiple customers and, for a smaller targeted group, obtained communications content.

The FBI and CISA issued joint statements in October and November 2024 attributing the activity to PRC-affiliated actors. CISA published advisory AA24-335a in November 2024, documenting intrusion methods and providing hardening guidance for telecommunications network defenders. CISA subsequently released additional mobile communications security guidance in December 2024, aimed at reducing exposure for government personnel and other high-risk individuals.

Microsoft Security published independent research in October 2024 linking the activity to a threat cluster it tracks as Salt Typhoon, confirming targeting of telecommunications companies across multiple countries.

## Technical Analysis

The actors gained access to telecommunications provider networks by exploiting vulnerabilities in network edge devices and telecommunications infrastructure components. Once inside provider environments, they maintained persistent access using valid credentials and moved through internal networks to reach communications-handling systems, including lawful intercept infrastructure implemented under the Communications Assistance for Law Enforcement Act (CALEA).

Access to CALEA-compliant systems gave the actors visibility into the metadata surrounding court-authorized surveillance orders, including details about targeted subjects, law enforcement agency contacts, and intercept activation records. In addition to lawful intercept system access, the actors collected call detail records across multiple customer populations and obtained the content of calls and text messages for a smaller, targeted subset of individuals.

Advisory AA24-335a noted that the actors maintained access within provider networks for an extended period before detection. The advisory also noted that activity affected telecommunications providers outside the United States, consistent with Microsoft's reporting of global targeting.

## Attack Chain

### Stage 1: Initial Compromise

Salt Typhoon exploited publicly known and, in some cases, zero-day vulnerabilities in network edge devices and telecommunications equipment exposed to the internet to establish initial footholds in targeted provider environments.

### Stage 2: Credential Collection and Persistence

After establishing a foothold, the actors harvested credentials from compromised systems and used those credentials to move through the network and maintain persistent access without relying solely on exploitation-based entry.

### Stage 3: Lateral Movement to Core Systems

The actors moved through provider networks to reach core telecommunications infrastructure, including systems used to manage subscriber data, call routing, and communications intercepts.

### Stage 4: Lawful Intercept Access

The campaign included access to CALEA-compliant lawful intercept systems. These systems process court-authorized surveillance orders and contain records that reveal which subjects are under active law enforcement surveillance.

### Stage 5: Data Collection

The actors collected call detail records across multiple customer bases and obtained communications content — calls and text messages — for a smaller set of targeted individuals. The advisory confirmed that the collection targeted individuals associated with government and political activities.

## MITRE ATT&CK Mapping

T1190 - Exploit Public-Facing Application: Salt Typhoon exploited vulnerabilities in telecommunications network edge devices and routers to gain initial footholds in targeted provider environments, as documented in advisory AA24-335a.

T1078 - Valid Accounts: The actors used compromised credentials to maintain persistent access across targeted telecommunications provider networks over an extended period.

T1557 - Adversary-in-the-Middle: Salt Typhoon accessed lawful intercept systems and telecommunications backbone infrastructure, enabling interception of call metadata for multiple customer bases and communications content for a targeted subset of individuals.

T1071 - Application Layer Protocol: Command and control activity used standard application layer protocols to blend with normal network communications within targeted provider environments.

## Timeline

### 2024-01 — Campaign Activity Period Begins

Advisory AA24-335a and accompanying FBI and CISA statements confirm that the intrusion campaign was active in 2024. The exact start of the initial compromises was not publicly confirmed in available source material.

### 2024-10-09 — Microsoft Publishes Research

Microsoft Security published research identifying Salt Typhoon activity targeting telecommunications companies, providing the first public attribution of the activity to a named threat cluster.

### 2024-10-25 — FBI and CISA Issue Joint Statement

The FBI and CISA released a joint statement confirming that PRC-affiliated actors had compromised commercial telecommunications infrastructure and were actively investigating the intrusions.

### 2024-11-30 — CISA Publishes Advisory AA24-335a

CISA, in coordination with the FBI and NSA, published advisory AA24-335a, documenting the intrusion methods, confirming access to lawful intercept systems, and providing hardening guidance for telecommunications network defenders.

### 2024-12-18 — CISA Releases Mobile Communications Guidance

CISA released guidance on mobile communications best practices for high-risk individuals, including recommendations on encrypted messaging applications, hardware authentication keys, and the risks of SMS-based authentication in the context of carrier-level interception.

## Remediation & Mitigation

Advisory AA24-335a provided hardening guidance for telecommunications network operators. Defenders should apply available patches for vulnerabilities in network edge devices and telecommunications equipment on a priority basis, as exploitation of such devices was the documented initial access method. Network segmentation should isolate lawful intercept systems from general-purpose internal networks to limit the lateral movement paths available to actors who gain a foothold in provider environments.

Logging and monitoring of configuration changes and administrative access to network devices supports detection of unauthorized activity. Multi-factor authentication should be enforced on all administrative interfaces for telecommunications management systems, and account access rights for systems that process lawful intercept requests and subscriber data should be audited regularly.

For individuals assessed as high-risk targets, CISA's December 2024 mobile communications guidance recommended using end-to-end encrypted communications applications, adopting hardware security keys for authentication, and avoiding SMS-based two-factor authentication, which is vulnerable to interception through carrier infrastructure.

## Sources & References

- [CISA: Advisory AA24-335A — PRC State-Sponsored Cyber Actor Salt Typhoon Compromises U.S. Telecommunications Providers](https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-335a) — CISA, 2024-11-30
- [FBI: FBI and CISA Release Joint Statement on PRC Targeting of Commercial Telecommunications Infrastructure](https://www.fbi.gov/news/press-releases/fbi-and-cisa-release-joint-statement-on-peoples-republic-of-china-targeting-of-commercial-telecommunications-infrastructure) — FBI, 2024-10-25
- [CISA: Guidance on Mobile Communications Best Practices](https://www.cisa.gov/sites/default/files/2024-12/guidance-on-mobile-communications-best-practices.pdf) — CISA, 2024-12-18
- [Microsoft Security: Salt Typhoon Targets Telecommunications Companies Worldwide](https://www.microsoft.com/en-us/security/blog/2024/10/09/salt-typhoon-targets-telecommunications-companies-worldwide) — Microsoft Security, 2024-10-09
