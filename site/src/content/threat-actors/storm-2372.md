---
name: "Storm-2372"
aliases: []
affiliation: "Suspected nation-state"
motivation: "Espionage"
status: active
country: "Russia"
firstSeen: "2024-08"
lastSeen: "2025-02"
targetSectors:
  - "Government"
  - "Non-Governmental Organizations (NGO)"
  - "Defense"
  - "Information Technology"
  - "Telecommunications"
  - "Healthcare"
  - "Higher Education"
  - "Energy"
targetGeographies:
  - "North America"
  - "Europe"
  - "Africa"
  - "Middle East"
tools:
  - "Device code phishing"
  - "Microsoft Graph API"
  - "Microsoft Authentication Broker"
mitreMappings:
  - techniqueId: "T1566.003"
    techniqueName: "Phishing: Spearphishing via Service"
    tactic: "Initial Access"
    notes: "Uses WhatsApp, Signal, and Microsoft Teams to build rapport before delivery of phishing lures."
  - techniqueId: "T1528"
    techniqueName: "Steal or Forge Authentication Tokens"
    tactic: "Credential Access"
    notes: "Exploits the OAuth 2.0 device code flow to obtain access and refresh tokens."
  - techniqueId: "T1098.005"
    techniqueName: "Account Manipulation: Device Registration"
    tactic: "Persistence"
    notes: "Abuses the Microsoft Authentication Broker to register actor-controlled devices and obtain Primary Refresh Tokens (PRTs)."
  - techniqueId: "T1071.001"
    techniqueName: "Application Layer Protocol: Web Protocols"
    tactic: "Command and Control"
    notes: "Leverages the Microsoft Graph API for automated searching and exfiltration of sensitive emails."
attributionConfidence: A2
attributionRationale: "Microsoft assesses with moderate confidence that Storm-2372 aligns with Russian state interests, victimology, and established tradecraft patterns common to other Russia-aligned espionage clusters."
reviewStatus: "draft_ai"
generatedBy: "dangermouse-bot"
generatedDate: 2026-04-21
tags:
  - "storm-2372"
  - "russia"
  - "device-code-phishing"
  - "espionage"
  - "token-theft"
sources:
  - url: "https://www.microsoft.com/en-us/security/blog/2025/02/13/storm-2372-conducts-device-code-phishing-campaign/"
    publisher: "Microsoft"
    publisherType: vendor
    reliability: R1
    publicationDate: "2025-02-13"
    accessDate: "2026-04-21"
    archived: false
  - url: "https://www.aha.org/system/files/media/file/2025/02/h-isac-tlp-white-threat-bulletin-storm-2372-conducts-device-code-phishing-campaign--2-14-2025.pdf"
    publisher: "H-ISAC"
    publisherType: community
    reliability: R1
    publicationDate: "2025-02-14"
    accessDate: "2026-04-21"
    archived: false
  - url: "https://www.dc3.mil/Portals/100/Documents/DC3/Missions/DCISE/DCISE%20Cyber%20Threat%20Roundup/2025/february/20250218%20Cyber%20Threat%20Roundup.pdf"
    publisher: "DC3"
    publisherType: government
    reliability: R1
    publicationDate: "2025-02-18"
    accessDate: "2026-04-21"
    archived: false
---

## Executive Summary

Storm-2372 is an emerging Russia-aligned threat activity cluster that specialized in device code phishing operations beginning in mid-2024. Microsoft identifies the group as a suspected nation-state actor primarily motivated by espionage and intelligence collection against government, defense, and IT service organizations globally.

The group is defined by its disciplined use of social engineering on third-party messaging platforms to build rapport with targets before executing specialized OAuth token theft. Storm-2372 evolved its tradecraft through early 2025, moving from simple credential access to registering unauthorized devices within victim environments to obtain persistent Primary Refresh Tokens (PRTs), allowing for long-dwell access to sensitive organizational communications.

## Notable Campaigns

### 2024–2025: Global Device-Code Phishing Campaign

Since August 2024, Storm-2372 conducted a continuous operation targeting a wide array of sectors across North America, Europe, Africa, and the Middle East. The campaign utilized lures posing as prominent individuals on WhatsApp, Signal, and Microsoft Teams.

In the initial phase of the campaign, the actor focused on obtaining session tokens via the OAuth device code flow. By February 2025, the tradecraft matured to include the abuse of the Microsoft Authentication Broker. This allowed the registration of actor-controlled devices within the target's Entra ID environment, granting the attackers persistent access that bypassed standard MFA protections and password resets.

## Technical Capabilities

Storm-2372 focuses on discovering and exploiting identity perimeters within Microsoft 365 environments. Instead of deploying custom malware, they utilize "living off the cloud" techniques to blend with legitimate administrative activity.

The group's primary method for initial access is device code phishing. They generate a legitimate device code request and trick the victim into entering it on the official Microsoft sign-in page. This bypasses the need for passwords and many traditional MFA implementations. Once access is gained, they utilize the Microsoft Graph API to perform automated keyword searches for terms such as "password," "secret," and "ministry" to identify and exfiltrate sensitive data.

To maintain stealth, Storm-2372 uses regionally appropriate proxies that match the geographic location of the victim organization, reducing the likelihood of detection by identity protection systems monitoring for impossible travel or anomalous sign-in origins.

## Attribution

Microsoft assesses with moderate confidence that Storm-2372 aligns with Russian state interests. This assessment is based on the group's victimology—which targets government ministries and defense contractors—and its tradecraft, which mirrors patterns established by other Russia-aligned espionage clusters. While it remains a "Storm" temporary designation, the group's objectives and operational focus suggest a formal state-sponsored mandate.

## MITRE ATT&CK Profile

### Initial Access

T1566.003 - Phishing: Spearphishing via Service: Storm-2372 uses third-party messaging apps to establish trust with targets before delivering malicious lures.

### Credential Access

T1528 - Steal or Forge Authentication Tokens: The group's hallmark technique involves exploiting the OAuth 2.0 device code flow to steal session and refresh tokens.

### Persistence

T1098.005 - Account Manipulation: Device Registration: Storm-2372 registers unauthorized devices in the victim's tenant to obtain persistent Primary Refresh Tokens (PRTs).

### Command and Control

T1071.001 - Application Layer Protocol: Web Protocols: The actor leverages the Microsoft Graph API as a primary interface for automated data discovery and collection.

## Sources & References

- [Microsoft: Storm-2372 conducts device code phishing campaign](https://www.microsoft.com/en-us/security/blog/2025/02/13/storm-2372-conducts-device-code-phishing-campaign/) — Microsoft, 2025-02-13
- [H-ISAC: H-ISAC TLP-WHITE Threat Bulletin: Storm-2372 conducts device code phishing campaign](https://www.aha.org/system/files/media/file/2025/02/h-isac-tlp-white-threat-bulletin-storm-2372-conducts-device-code-phishing-campaign--2-14-2025.pdf) — H-ISAC, 2025-02-14
- [DC3: DCISE Cyber Threat Roundup - February 18, 2025](https://www.dc3.mil/Portals/100/Documents/DC3/Missions/DCISE/DCISE%20Cyber%20Threat%20Roundup/2025/february/20250218%20Cyber%20Threat%20Roundup.pdf) — DC3, 2025-02-18
