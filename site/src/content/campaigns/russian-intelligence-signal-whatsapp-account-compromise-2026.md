---
campaignId: "TP-CAMP-2026-0006"
title: "Russian Intelligence Services Signal and WhatsApp Account Compromise Campaign"
startDate: 2026-01-01
ongoing: true
attackType: "Social Engineering / Account Hijacking"
severity: high
sector: "Government / Defense / Media"
geography: "Global"
threatActor: "Russian Intelligence Services"
attributionConfidence: A3
reviewStatus: "draft_ai"
confidenceGrade: B
generatedBy: "dangermouse-bot"
generatedDate: 2026-05-13
cves: []
relatedIncidents: []
tags:
  - "russia"
  - "signal"
  - "whatsapp"
  - "account-hijacking"
  - "social-engineering"
  - "linked-devices"
  - "verification-code"
  - "messaging-apps"
  - "espionage"
  - "government-officials"
  - "qr-code"
  - "phishing"
sources:
  - url: "https://english.aivd.nl/latest/news/2026/03/09/russia-targets-signal-and-whatsapp-accounts-in-cyber-campaign"
    publisher: "AIVD"
    publisherType: government
    reliability: R1
    publicationDate: "2026-03-09"
    accessDate: "2026-05-13"
    archived: false
  - url: "https://www.ic3.gov/PSA/2026/PSA260320"
    publisher: "FBI"
    publisherType: government
    reliability: R1
    publicationDate: "2026-03-20"
    accessDate: "2026-05-13"
    archived: false
  - url: "https://www.cert.ssi.gouv.fr/alerte/CERTFR-2026-ALE-003/"
    publisher: "CERT-FR"
    publisherType: government
    reliability: R1
    publicationDate: "2026-03-20"
    accessDate: "2026-05-13"
    archived: false
mitreMappings:
  - techniqueId: "T1598"
    techniqueName: "Phishing for Information"
    tactic: "Reconnaissance"
    attack-version: "v19"
    confidence: confirmed
    evidence: "Actors impersonated Signal and WhatsApp customer support — using account names such as Signal Security Support Chatbot — to contact targets through the same messaging platforms and request verification codes or account PINs. AIVD/MIVD advisory and FBI/CISA PSA PSA260320 both document this technique."
  - techniqueId: "T1566.002"
    techniqueName: "Spearphishing Link"
    tactic: "Initial Access"
    attack-version: "v19"
    confidence: confirmed
    evidence: "Attackers distributed malicious links via messaging apps that, when activated by targets, triggered the Signal or WhatsApp linked-devices registration flow, silently connecting attacker-controlled devices to victim accounts. AIVD/MIVD and CERT-FR advisories document this method as distinct from the verification-code approach."
  - techniqueId: "T1078"
    techniqueName: "Valid Accounts"
    tactic: "Defense Evasion"
    attack-version: "v19"
    confidence: confirmed
    evidence: "Attackers used verification codes or PINs obtained through social engineering to register their own devices as legitimate linked devices on victim accounts, gaining authenticated persistent access that appeared to originate from a legitimate device registration."
  - techniqueId: "T1534"
    techniqueName: "Internal Spearphishing"
    tactic: "Lateral Movement"
    attack-version: "v19"
    confidence: probable
    evidence: "FBI/CISA PSA PSA260320 notes that after gaining account access, actors can send messages as the victim and conduct additional phishing from a trusted identity, enabling lateral movement to the victim's established contacts."
---

## Executive Summary

Russian intelligence services conducted a campaign beginning in early 2026 to compromise Signal and WhatsApp accounts belonging to government officials, military personnel, civil servants, and journalists across Europe and globally. The campaign targeted individual user accounts rather than the messaging platforms themselves, leaving the applications' end-to-end encryption intact.

On March 9, 2026, the Dutch General Intelligence and Security Service (AIVD) and Military Intelligence and Security Service (MIVD) issued a joint advisory warning that Russian state-backed actors were approaching high-value targets through the same messaging applications they sought to compromise, posing as official support staff to extract account credentials. Dutch government employees were confirmed among those whose accounts had been accessed before the advisory was issued.

On March 20, 2026, the Federal Bureau of Investigation (FBI) and the Cybersecurity and Infrastructure Security Agency (CISA) issued Public Service Announcement PSA260320 linking the campaign to Russian intelligence services and describing the same tactics as part of a global operation. The French national cybersecurity agency CERT-FR issued alert CERTFR-2026-ALE-003 on the same date, documenting the threat to French government personnel and other high-value targets. The FBI and CISA assessed that thousands of individual accounts had been compromised worldwide.

The campaign does not exploit technical vulnerabilities in Signal or WhatsApp. Both applications use the Signal Protocol for end-to-end encryption, which the actors did not break. Compromise is achieved through social engineering and abuse of legitimate account management features.

## Technical Analysis

The campaign exploits two documented methods, both of which depend on user action rather than any unpatched vulnerability.

The first method targets the account registration mechanism. Signal and WhatsApp use one-time verification codes delivered by SMS to confirm phone number ownership during account setup and account transfers. Actors initiate the registration process using a target's phone number, causing the application to send a legitimate SMS verification code to that number. The actors then contact the target through Signal or WhatsApp, posing as official support staff using account names designed to appear authoritative, and instruct the target to share the code to resolve a claimed account security issue. If the target provides the code, the attacker can complete registration on an attacker-controlled device, migrating the account or establishing secondary access.

The second method abuses the linked-devices feature present in both Signal and WhatsApp. This feature allows users to connect secondary devices — such as a desktop client — to their primary mobile account, enabling message synchronization. The linking process involves either scanning a QR code or activating a dedicated link. Actors distributed malicious QR codes and links to targets; when activated, these triggered the linked-devices registration flow, adding an attacker-controlled device to the victim's account without user notification. The victim's account remains accessible on their own device, and there may be no obvious indication of the additional linked device unless the user actively reviews their device list.

Once access is established through either method, actors can read existing message history, receive ongoing messages in real time, access contact lists, and send messages appearing to originate from the victim's account. The AIVD advisory confirmed that Dutch government employees had accounts accessed using these methods prior to the March 9 advisory. The FBI assessed this as a global operation targeting thousands of accounts.

Attribution across advisories is consistent: the FBI, CISA, AIVD, MIVD, and CERT-FR all attribute the campaign to Russian intelligence services. No specific Russian intelligence agency or named threat group is identified in the primary advisory sources.

## Attack Chain

### Stage 1: Target Identification

Actors identify high-value targets including government officials, civil servants, military personnel, and journalists with access to sensitive communications. Targets are selected based on their intelligence value to Russian state objectives.

### Stage 2: Initial Contact via Messaging Application

Actors contact targets directly through Signal or WhatsApp, using account names or display names designed to impersonate official support functions — for example, names such as Signal Security Support Chatbot or similar. This establishes a communication channel within the same application the actor intends to compromise.

### Stage 3: Credential or Access Extraction

Method A — Verification code extraction: The actor initiates the account registration flow for the target's phone number, triggering an SMS verification code to be sent to the target. The actor then instructs the target to share this code, citing a fabricated account security scenario. Sharing the code grants the actor the ability to register the account on an attacker-controlled device.

Method B — Linked device activation: The actor distributes a malicious QR code or a prepared link to the target through the messaging application or by other means. When the target scans the QR code or activates the link, the application's linked-devices registration flow is triggered, adding the actor's device as a linked device to the target's account without requiring a verification code.

### Stage 4: Persistent Account Access

The attacker's device is registered as a legitimate linked device or account registration, providing ongoing access to messages, contact lists, and account functions. In the linked-device case, the target's account continues to operate on their own device, and the additional linked device may not be noticed without deliberate review.

### Stage 5: Exploitation and Lateral Movement

With access established, actors read existing message history and receive new messages in real time. They can send messages as the victim, providing a basis for further social engineering against the victim's established contacts using a trusted identity.

## MITRE ATT&CK Mapping

T1598 - Phishing for Information: Actors impersonated Signal and WhatsApp support accounts to contact targets and extract SMS verification codes and account PINs through social engineering. The FBI/CISA PSA PSA260320 and AIVD/MIVD advisory document this as a confirmed technique in the campaign.

T1566.002 - Spearphishing Link: Actors distributed malicious links and QR codes that activated the Signal or WhatsApp linked-devices registration flow when engaged by a target, adding an attacker-controlled device to the victim's account without user notification. This method does not require the target to share any credential and leaves few visible indicators. Documented in the AIVD/MIVD and CERT-FR advisories.

T1078 - Valid Accounts: Actors used verification codes obtained through social engineering to register attacker-controlled devices through the applications' normal account management mechanisms. The resulting access is authenticated and appears as a legitimate device registration, without triggering anomaly alerts that would typically accompany unauthorized access patterns.

T1534 - Internal Spearphishing: After gaining access to a target's account, actors can send messages from the compromised account to the target's established contacts. The FBI/CISA PSA PSA260320 assesses that actors used this capability to conduct additional phishing using the trusted identity of the compromised account holder.

## Timeline

### 2026-03-09 — AIVD and MIVD Issue Joint Advisory

The Netherlands' General Intelligence and Security Service (AIVD) and Military Intelligence and Security Service (MIVD) publish a joint advisory warning that Russian state-backed actors are conducting a campaign to compromise Signal and WhatsApp accounts belonging to government officials, military personnel, civil servants, and journalists. The advisory confirms that Dutch government employee accounts have already been accessed. AIVD Director-General Simone Smit states that the applications themselves have not been compromised; individual accounts are the target.

### 2026-03-20 — FBI, CISA, and CERT-FR Issue Coordinated Advisories

The FBI and CISA publish Public Service Announcement PSA260320 attributing the campaign to Russian intelligence services and describing it as a global operation that has resulted in unauthorized access to thousands of accounts. The PSA documents both attack methods — verification code extraction and linked device abuse — and provides defensive guidance for messaging application users. CERT-FR publishes alert CERTFR-2026-ALE-003 on the same date, documenting the same campaign techniques and advising French government personnel and other high-value targets.

## Remediation & Mitigation

Government advisories from AIVD/MIVD, FBI/CISA, and CERT-FR recommend the following controls.

Do not share SMS verification codes received from messaging applications. Signal and WhatsApp use these codes solely to verify phone number ownership during account setup or account transfers. Neither application sends support staff to request codes through in-app messages. Any in-app message requesting a verification code should be treated as a social engineering attempt.

Do not share application PINs or registration lock codes with any party. Signal's Registration Lock and WhatsApp's two-step verification PINs protect against unauthorized account registration. Enable these features if not already active and store the PIN in a password manager rather than using an easily guessable value.

Treat unsolicited messages from accounts claiming to represent Signal, WhatsApp, or their support functions as suspicious by default. Official support for these applications does not operate through in-app messages requesting credentials. If an account security issue is believed to be genuine, navigate to official application settings or the official website through independent means.

Regularly audit linked devices within Signal and WhatsApp settings and revoke any unrecognized devices immediately. Both applications provide a device list accessible through account settings. Reviewing this list is the primary method of detecting unauthorized linked device additions.

Do not scan QR codes or activate links received through messaging applications from unknown or unexpected sources. Both attack methods rely on user action to trigger the linked-devices registration or credential extraction flow.

Enable registration lock in Signal and two-step verification in WhatsApp using a strong PIN stored in a password manager. These controls require the PIN before an account can be registered on a new device, blocking the verification-code attack method even if a code is intercepted.

Enable disappearing messages on sensitive conversations to reduce the volume of content available if account access is obtained at a later point.

If compromise is suspected, immediately review and revoke all linked devices, re-register the account from the primary device to invalidate other registrations, change any account PINs, and warn established contacts that recent messages from the account should be treated with caution.

## Sources & References

- [AIVD: Russia Targets Signal and WhatsApp Accounts in Cyber Campaign](https://english.aivd.nl/latest/news/2026/03/09/russia-targets-signal-and-whatsapp-accounts-in-cyber-campaign) — AIVD, 2026-03-09
- [FBI: PSA260320 — Russian Intelligence Services Targeting Commercial Messaging Applications](https://www.ic3.gov/PSA/2026/PSA260320) — FBI, 2026-03-20
- [CERT-FR: Note d'alerte CERTFR-2026-ALE-003 — Ciblage des messageries instantanées](https://www.cert.ssi.gouv.fr/alerte/CERTFR-2026-ALE-003/) — CERT-FR, 2026-03-20
