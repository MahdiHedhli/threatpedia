---
eventId: TP-2011-0001
title: DigiNotar Certificate Authority Compromise
date: 2011-08-29
attackType: Certificate Authority Compromise
severity: critical
sector: Technology & Government
geography: Netherlands and Iran
threatActor: Unknown
attributionConfidence: A4
reviewStatus: draft_ai
confidenceGrade: A
generatedBy: kernel-k
generatedDate: 2026-04-30
cves: []
relatedSlugs: []
tags:
  - diginotar
  - certificate-authority
  - fraudulent-certificates
  - tls
  - pki
  - google
  - iran
  - man-in-the-middle
  - mozilla
  - microsoft
  - fox-it
sources:
  - url: https://learn.microsoft.com/en-us/security-updates/securityadvisories/2011/2607712
    publisher: Microsoft
    publisherType: vendor
    reliability: R1
    publicationDate: "2011-08-29"
    accessDate: "2026-04-30"
    archived: false
  - url: https://blog.mozilla.org/security/2011/09/02/diginotar-removal-follow-up/
    publisher: Mozilla
    publisherType: vendor
    reliability: R1
    publicationDate: "2011-09-02"
    accessDate: "2026-04-30"
    archived: false
  - url: https://security.googleblog.com/2011/08/
    publisher: Google
    publisherType: vendor
    reliability: R1
    publicationDate: "2011-08-29"
    accessDate: "2026-04-30"
    archived: false
  - url: https://www.sec.gov/Archives/edgar/data/1044777/000119312511241796/dex992.htm
    publisher: Fox-IT
    publisherType: research
    reliability: R1
    publicationDate: "2011-09-05"
    accessDate: "2026-04-30"
    archived: false
  - url: https://onderzoeksraad.nl/en/onderzoek/the-diginotar-incident/
    publisher: Dutch Safety Board
    publisherType: government
    reliability: R1
    publicationDate: "2012-06-28"
    accessDate: "2026-04-30"
    archived: false
mitreMappings:
  - techniqueId: T1557
    techniqueName: Adversary-in-the-Middle
    tactic: Credential Access
    notes: Fraudulent DigiNotar certificates were used in attempted SSL man-in-the-middle attacks against Google users, allowing an attacker on a network path to impersonate trusted services.
  - techniqueId: T1588.004
    techniqueName: "Obtain Capabilities: Digital Certificates"
    tactic: Resource Development
    notes: The attacker obtained fraudulent certificates from a trusted certificate authority and used that trust relationship to support spoofing and interception activity.
---

## Summary

The DigiNotar compromise was a 2011 breach of a Dutch certificate authority that resulted in fraudulent TLS certificates for Google and other domains. Google reported attempted SSL man-in-the-middle attacks against Google users on August 29, 2011, and Microsoft warned that fraudulent DigiNotar certificates could be used for spoofing, phishing, or man-in-the-middle attacks across supported Windows releases.

Mozilla removed DigiNotar from its trusted root program after DigiNotar confirmed that more than 200 certificates had been issued against more than 20 domains and after the scope of the breach remained uncertain. Fox-IT's interim investigation later identified 531 fraudulent certificates, found evidence of administrator-level compromise across DigiNotar certificate-authority systems, and linked observed misuse of the fraudulent Google certificate primarily to requesting IP addresses in Iran.

The incident damaged trust in DigiNotar's certificate authority operations and affected Dutch government PKI services that depended on DigiNotar-controlled infrastructure. The Dutch Safety Board later concluded that the reliability of PKI certificates used in government digital communication had been compromised because DigiNotar's systems were hacked.

## Technical Analysis

DigiNotar operated several certificate authorities, including public SSL services and certificates tied to the Dutch government's PKIoverheid program. Certificate authorities are trusted because browsers and operating systems rely on them to verify that a presented certificate belongs to the domain a user is visiting. A fraudulent certificate from a trusted authority can let an attacker impersonate a service during encrypted web sessions.

The incident first became public after a fraudulent certificate for Google domains was presented to users. Google reported attempted SSL man-in-the-middle attacks, and Mozilla said Google informed it that at least one fraudulent certificate for public Google websites had been issued by DigiNotar. Microsoft described the risk as spoofing, phishing, or man-in-the-middle attacks against browser users.

Fox-IT's interim report described a wider compromise. Investigators found that hackers had obtained administrator rights on multiple DigiNotar systems, including CA systems, and that malicious tools and certificate-generation scripts were present. Fox-IT also reported deleted log traces, unpatched public web servers, missing antivirus protection on investigated servers, and weak separation between critical CA systems and management infrastructure.

The certificate inventory remained difficult to bound because at least one fraudulent Google certificate was not found in the CA system records. Fox-IT therefore monitored OCSP responder traffic to identify known and unknown certificate serial numbers and changed DigiNotar's OCSP response behavior so unknown serials under its authority would be treated as revoked.

## Attack Chain

### Stage 1: Certificate Authority Environment Compromise

The attacker gained administrator-level access inside DigiNotar's environment. Fox-IT reported traces of hacker activity on CA servers and described all CA servers as members of the same Windows domain, giving an attacker with domain administrator rights broad access to the certificate authority environment.

### Stage 2: Fraudulent Certificate Issuance

Fraudulent certificates were generated from DigiNotar-controlled certificate authorities. DigiNotar initially detected 128 rogue certificates on July 19, 2011, found another 129 during analysis on July 20, and later identified additional certificates, including a fraudulent Google certificate that had been created on July 10.

### Stage 3: Use Against Google Users

Google reported attempted SSL man-in-the-middle attacks against Google users. Fox-IT's OCSP analysis associated the fraudulent Google certificate with about 300,000 unique requesting IP addresses, with more than 99 percent originating from Iran.

### Stage 4: Trust-Store Revocation

Browser and operating-system vendors removed trust in DigiNotar certificates. Microsoft added DigiNotar roots to the Untrusted Certificate Store, Mozilla removed DigiNotar from its trusted root program, and Mozilla later removed the temporary exemption for Dutch government-related DigiNotar certificates after the Dutch government's assessment changed.

### Stage 5: Government and PKI Response

The Dutch government and Dutch Safety Board examined the effects on public-sector digital communication. The Dutch Safety Board later reported that the reliability of government PKI certificates had been compromised because DigiNotar's systems were hacked.

## Impact Assessment

The immediate user impact centered on certificate trust and encrypted web sessions. A fraudulent certificate could make a spoofed service appear legitimate to a browser or operating system that still trusted DigiNotar. Google, Mozilla, and Microsoft described the threat in terms of man-in-the-middle attacks, spoofing, phishing, and potential credential or session interception.

Fox-IT identified 531 fraudulent certificates in the interim investigation. The observed misuse around the Google certificate was concentrated in Iran, where Fox-IT identified about 300,000 unique requesting IP addresses in OCSP logs. Fox-IT noted that email and login cookies could have been intercepted if users connected through the fraudulent certificate.

The operational impact extended to the certificate authority ecosystem. Mozilla removed DigiNotar from its trusted root program, Microsoft revoked trust through Windows updates, and Dutch government-related certificates were also affected after initial trust exceptions were withdrawn. The Dutch Safety Board framed the case as a public-administration digital safety issue because citizens needed to trust government digital communication.

## Attribution

Public reporting does not identify a confirmed organization or state sponsor responsible for the DigiNotar compromise. Fox-IT reported that a script left the phrase "Janam Fadaye Rahbar" and noted that the same text had appeared in the Comodo breach investigation earlier in 2011, but that evidence does not establish a confirmed actor identity.

Fox-IT assessed that the domain list and the concentration of affected users in Iran suggested an objective of intercepting private communications in Iran. Available public evidence supports unknown attribution rather than naming a confirmed actor.

## Timeline

### 2011-07-10 — Fraudulent Google Certificate Created

Fox-IT reported that the rogue Google certificate later observed in use had been created on July 10, 2011.

### 2011-07-19 — DigiNotar Detects Rogue Certificates

Fox-IT reported that DigiNotar detected 128 rogue certificates during a daily security check on July 19 and revoked them.

### 2011-07-20 — Additional Certificates Detected

During follow-up analysis, DigiNotar detected another 129 fraudulent certificates, which were revoked on July 21.

### 2011-08-29 — Public Disclosure and Vendor Response

Google reported attempted SSL man-in-the-middle attacks against Google users, Mozilla reported the fraudulent Google certificate issue, and Microsoft published Security Advisory 2607712.

### 2011-09-02 — Mozilla Removes DigiNotar Trust

Mozilla described complete removal of DigiNotar from its trusted root program and later removed the Dutch government certificate exemption after the government's assessment changed.

### 2011-09-05 — Fox-IT Publishes Interim Report

Fox-IT published the Operation Black Tulip interim report, identifying 531 fraudulent certificates and describing compromise across DigiNotar's certificate authority environment.

### 2012-06-28 — Dutch Safety Board Publishes Report

The Dutch Safety Board published its investigation into the DigiNotar incident and the safeguards for Dutch government digital communication.

## Remediation & Mitigation

Vendor remediation focused on removing trust in DigiNotar certificates. Microsoft shipped updates that placed DigiNotar root certificates into the Windows Untrusted Certificate Store, and Mozilla removed DigiNotar from its trusted root program. Users and organizations needed to apply browser and operating-system updates so fraudulent DigiNotar certificates would no longer be accepted.

DigiNotar-specific containment included revoking known fraudulent certificates, monitoring OCSP requests, changing OCSP behavior for unknown serial numbers, and replacing affected certificates. Organizations using DigiNotar certificates needed to migrate to certificates issued by trusted authorities.

The longer-term mitigation is stronger certificate authority governance and incident transparency. The case showed that certificate authorities require segmented CA infrastructure, protected audit logs, secure monitoring, timely vendor notification, and documented escalation paths when certificate mis-issuance affects public trust stores or government services.

## Sources & References

- [Microsoft: Security Advisory 2607712](https://learn.microsoft.com/en-us/security-updates/securityadvisories/2011/2607712) — Microsoft, 2011-08-29
- [Mozilla: DigiNotar Removal Follow Up](https://blog.mozilla.org/security/2011/09/02/diginotar-removal-follow-up/) — Mozilla, 2011-09-02
- [Google: August 2011 Online Security Blog](https://security.googleblog.com/2011/08/) — Google, 2011-08-29
- [Fox-IT: DigiNotar Certificate Authority Breach Operation Black Tulip](https://www.sec.gov/Archives/edgar/data/1044777/000119312511241796/dex992.htm) — Fox-IT, 2011-09-05
- [Dutch Safety Board: The DigiNotar Incident](https://onderzoeksraad.nl/en/onderzoek/the-diginotar-incident/) — Dutch Safety Board, 2012-06-28
