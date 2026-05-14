---
campaignId: "TP-CAMP-2026-0007"
title: "Gray Sandstorm Microsoft 365 Password-Spray Campaign Targeting Middle East Cloud Environments 2026"
startDate: 2026-03-01
ongoing: true
attackType: "Credential Access / Cloud Compromise"
severity: high
sector: "Government / Multi-Sector"
geography: "Middle East"
threatActor: "Gray Sandstorm"
attributionConfidence: A3
reviewStatus: "draft_ai"
confidenceGrade: B
generatedBy: "dangermouse-bot"
generatedDate: 2026-05-13
cves: []
relatedIncidents: []
tags:
  - "gray-sandstorm"
  - "iran"
  - "password-spray"
  - "microsoft-365"
  - "cloud"
  - "middle-east"
  - "credential-access"
  - "state-sponsored"
sources:
  - url: "https://blog.checkpoint.com/research/iran-nexus-password-spray-campaign-targeting-cloud-environments-with-a-focus-on-the-middle-east"
    publisher: "Check Point Research"
    publisherType: vendor
    reliability: R2
    publicationDate: "2026-03-31"
    accessDate: "2026-05-13"
    archived: false
  - url: "https://www.microsoft.com/en-us/security/security-insider/threat-landscape/gray-sandstorm"
    publisher: "Microsoft Security"
    publisherType: vendor
    reliability: R2
    publicationDate: "2023-04-18"
    accessDate: "2026-05-13"
    archived: false
  - url: "https://news.risky.biz/risky-bulletin-iranian-password-sprays-came-first-then-came-the-missiles/"
    publisher: "Risky Business Media"
    publisherType: media
    reliability: R3
    publicationDate: "2026-04-01"
    accessDate: "2026-05-13"
    archived: false
  - url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-290a"
    publisher: "CISA"
    publisherType: government
    reliability: R1
    publicationDate: "2024-10-16"
    accessDate: "2026-05-13"
    archived: false
mitreMappings:
  - techniqueId: "T1110.003"
    techniqueName: "Password Spraying"
    tactic: "Credential Access"
    "attack-version": "v19"
    confidence: confirmed
    evidence: "Check Point Research documented systematic password-spraying against M365 authentication endpoints across hundreds of organizations, with sign-in log patterns showing multiple authentication failures across distinct accounts from shared rotating source IPs consistent with spray tradecraft."
  - techniqueId: "T1090.003"
    techniqueName: "Multi-hop Proxy"
    tactic: "Command and Control"
    "attack-version": "v19"
    confidence: confirmed
    evidence: "The actors routed spray activity through Tor exit nodes during the scanning phase, then transitioned to commercial VPN infrastructure (Windscribe AS185.191.204.X and NordVPN AS169.150.227.X) for authenticated post-compromise activity, with VPN exit nodes geolocated in Israel to potentially evade geographic conditional access restrictions."
  - techniqueId: "T1078.004"
    techniqueName: "Cloud Accounts"
    tactic: "Initial Access"
    "attack-version": "v19"
    confidence: confirmed
    evidence: "Following successful password spray, the actors authenticated to M365 using obtained valid credentials to access cloud-hosted email accounts and stored data within targeted organizations."
  - techniqueId: "T1114.002"
    techniqueName: "Remote Email Collection"
    tactic: "Collection"
    "attack-version": "v19"
    confidence: probable
    evidence: "Check Point Research documented that attacker-controlled accounts accessed personal email content within M365 mailboxes at targeted organizations during the exfiltration phase of the campaign."
---

## Executive Summary

A password-spraying campaign targeting Microsoft 365 cloud accounts was active during March 2026, primarily directed at government entities, municipalities, energy sector organizations, and private companies in Israel and the United Arab Emirates. Check Point Research documented the campaign and assessed with moderate confidence that the activity originates from an Iran-nexus threat actor, with technical indicators showing similarity to patterns associated with Gray Sandstorm.

The campaign used Tor exit nodes to conduct high-volume password-spraying attempts against M365 authentication endpoints across hundreds of organizations. Attacker-controlled Windscribe and NordVPN infrastructure was used in subsequent authenticated access stages once valid credentials were obtained. The targeting profile—focused on Israeli local government, satellite, aviation, energy, and maritime sectors during ongoing regional conflict—is consistent with Iranian state collection interests, per Check Point Research's assessment.

CISA, the FBI, NSA, and international partners documented Iranian cyber actors' use of brute force and password spray techniques against critical infrastructure in advisory AA24-290A (October 2024), establishing a government-attributed pattern for this actor class consistent with the tradecraft observed in the March 2026 campaign.

## Technical Analysis

The campaign employed password spraying against Microsoft 365 authentication endpoints rather than targeted brute force against individual accounts. By attempting a small number of commonly used or weak passwords against a large pool of accounts across many organizations, the technique avoids triggering per-account lockout policies while systematically identifying accounts with poor credential hygiene.

Spray activity during the scanning phase was routed through Tor exit nodes, which were changed frequently to complicate IP-based blocking. Authentication attempts used a User-Agent string masquerading as Internet Explorer 10 (Mozilla/5.0 compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0), consistent with the use of red-team tooling and deliberate obfuscation designed to make detection based on atomic indicators more difficult.

After successful credential identification, the actors transitioned to VPN infrastructure for authenticated access—specifically Windscribe IP ranges (185.191.204.X) and NordVPN ranges (169.150.227.X) with exit nodes geolocated in Israel. Check Point Research noted the use of VPN nodes hosted at AS35758 (Rachamim Aviel Twito), which has been associated with Iran-nexus operational infrastructure in the Middle East. The two-phase infrastructure design separated high-volume scanning activity from post-compromise operations, and the Israel-geolocated VPN exit nodes may have been intended to circumvent geographic conditional access restrictions applied by target organizations.

The campaign targeted Israel and the UAE, with Israel's municipal sector representing the primary focus by both the number of organizations targeted and the volume of spray attempts per organization. Additional targeted sectors included satellite, aviation, energy, and maritime organizations in Israel, along with government entities in the UAE. Check Point Research identified Saudi Arabia and European organizations with Middle East sector connections among the broader targeted set.

Gray Sandstorm is a threat actor tracked by Microsoft with activity origins assessed to be in Iran. The actor has previously been observed using password spray techniques for initial access and credential collection against organizations in the defense, government, energy, and technology sectors, with a focus on the Middle East. Check Point Research assessed moderate-confidence Iran attribution based on the targeting profile's alignment with Iranian state interests and technical indicator overlap with Gray Sandstorm patterns, including the use of red-team tooling via Tor exit nodes. CISA advisory AA24-290A attributed password spray and credential access activity to Iranian actors affiliated with the IRGC, establishing government-confirmed precedent for this actor class conducting operations of this type.

## Attack Chain

### Stage 1: Scanning and Password Spray

The actors conducted intensive password-spraying against M365 authentication endpoints across hundreds of targeted organizations in Israel and the UAE. Spray activity was routed through Tor exit nodes, rotated frequently to avoid blocking controls. A User-Agent string consistent with Internet Explorer 10 was used during authentication attempts in combination with the Tor routing.

### Stage 2: Credential Identification

Spray activity identified valid credentials for accounts using weak or commonly used passwords. Check Point Research observed M365 sign-in log patterns consistent with spray behavior: large numbers of authentication failures distributed across distinct user accounts from shared source IP addresses within the same tenant environments.

### Stage 3: Authenticated Infiltration

Following successful credential identification, the actors conducted full authentication sessions from VPN infrastructure (Windscribe and NordVPN IP ranges geolocated in Israel), transitioning away from the Tor routing used in the scanning phase to reduce detection risk during post-compromise activity.

### Stage 4: Data Exfiltration

Using authenticated access to M365 accounts, the actors accessed personal email content and data stored within targeted mailboxes. Check Point Research assessed the exfiltration phase as consistent with intelligence collection objectives, noting that the targeting of Israeli local government and conflict-adjacent sectors is consistent with situational awareness and operational planning collection activity.

## MITRE ATT&CK Mapping

T1110.003 - Password Spraying: The actors conducted systematic password-spraying against M365 authentication endpoints, targeting large numbers of accounts across hundreds of organizations using a small number of commonly used passwords. Check Point Research documented sign-in log patterns consistent with spray activity: multiple authentication failures distributed across distinct user accounts from shared or rotating source IP addresses within the same tenant environments.

T1090.003 - Multi-hop Proxy: The campaign routed spray activity through Tor exit nodes during the scanning phase, rotated frequently to circumvent IP-based blocking. Following credential identification, the actors transitioned to commercial VPN infrastructure (Windscribe and NordVPN IP ranges) with exit nodes geolocated in Israel to conduct authenticated access. The two-phase proxy architecture separated high-volume detection-generating activity from post-compromise operations.

T1078.004 - Valid Accounts: Cloud Accounts: After obtaining valid M365 credentials through password spray, the actors authenticated to cloud services using those credentials to access cloud-hosted email accounts and data. Authentication using valid credentials allowed the actors to operate within normal M365 authentication flows without triggering credential-specific detections.

T1114.002 - Email Collection: Remote Email Collection: Using authenticated access to M365 accounts, the actors accessed personal email content within targeted cloud-hosted mailboxes. Check Point Research documented access to email data during the exfiltration phase as consistent with intelligence collection objectives.

## Timeline

### 2026-03 — Password-Spray Campaign Active

Check Point Research data shows the campaign was active during March 2026, with M365 sign-in log data documenting spray volume across targeted organizations in Israel and the UAE. The campaign targeted hundreds of organizations across government, municipal, energy, satellite, aviation, and maritime sectors.

### 2026-03-31 / 2026-04-01 — Check Point Research and Risky Business Media Publish Findings

Check Point Research published its analysis of the Iran-nexus M365 password-spray campaign on March 31, documenting the technical indicators, attack cycle, and targeting profile. Risky Business Media reported on the campaign findings in an April 1 bulletin, noting the temporal relationship between the cyber campaign activity and regional kinetic events in the Middle East.

## Remediation & Mitigation

Enforcing phishing-resistant multi-factor authentication across all M365 accounts—including service accounts, shared accounts, and external-facing accounts—directly reduces the value of credentials obtained through password spray, as a second authentication factor that cannot be guessed is required regardless of whether the password was successfully sprayed. CISA advisory AA24-290A identifies MFA enforcement as a primary mitigation for Iranian actors conducting credential access operations of this type and notes that accounts without MFA represent priority targets for actors conducting spray campaigns.

Monitoring M365 sign-in logs for spray behavioral indicators provides detection capability for this attack class. Indicators include multiple authentication failures distributed across distinct user accounts originating from the same or rotating source IPs; spike activity in failed sign-in attempts within short time windows; and authentication attempts using outdated User-Agent strings inconsistent with the organizational device fleet (such as IE10 User-Agents in environments where that browser version is not deployed).

Conditional access policies that block authentication from Tor exit node IP ranges and restrict authentication to approved geographic regions reduce the available scan surface. Check Point Research recommends geo-fencing and anonymization network blocking as priority mitigations given the observed spray infrastructure profile. Integration of real-time threat intelligence feeds tracking Tor exit node ranges into conditional access policies provides an automated and continuously updated control.

Strong credential hygiene—enforcing minimum password complexity requirements and prohibiting the use of commonly used or previously breached passwords—reduces the number of accounts vulnerable to low-attempt spray attacks. Organizations should verify that password policies are enforced consistently across all account types in M365 tenants. Audit logging of authentication events, including sign-in failures and successful authentications, should be enabled and retained at sufficient depth to support post-incident investigation.

## Sources & References

- [Check Point Research: Iran-nexus Password Spray Campaign Targeting Cloud Environments with a Focus on the Middle East](https://blog.checkpoint.com/research/iran-nexus-password-spray-campaign-targeting-cloud-environments-with-a-focus-on-the-middle-east) — Check Point Research, 2026-03-31
- [Microsoft Security: Gray Sandstorm](https://www.microsoft.com/en-us/security/security-insider/threat-landscape/gray-sandstorm) — Microsoft Security, 2023-04-18
- [Risky Business Media: Iranian Password Sprays Came First, Then Came the Missiles](https://news.risky.biz/risky-bulletin-iranian-password-sprays-came-first-then-came-the-missiles/) — Risky Business Media, 2026-04-01
- [CISA: Advisory AA24-290A — Iranian Cyber Actors' Brute Force and Credential Access Activity Compromises Critical Infrastructure Organizations](https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-290a) — CISA, 2024-10-16
