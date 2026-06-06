---
eventId: TP-2026-0336
title: "CISA Contractor AWS GovCloud Key Exposure"
date: 2026-05-18
attackType: Credential Exposure
severity: high
sector: Government
geography: United States
threatActor: "Unknown"
attributionConfidence: A4
reviewStatus: draft_ai
confidenceGrade: B
generatedBy: dangermouse-bot
generatedDate: 2026-06-06
generation:
  provider: "openai"
  model: "Codex GPT-5.3 Spark"
  tool: "codex"
  agent: "dangermouse-bot"
  promptProfile: "Threatpedia Danger Mouse"
cves: []
relatedSlugs: []
tags:
  - "cisa"
  - "aws-govcloud"
  - "github"
  - "credential-exposure"
  - "contractor"
sources:
  - url: "https://federalnewsnetwork.com/wp-content/uploads/2026/05/2026.05.19-T_Andrersen_F_BGT_DR_CISA-AWS-Credentials-Final.pdf"
    publisher: "U.S. House Committee on Homeland Security"
    publisherType: government
    reliability: R1
    publicationDate: "2026-05-19"
    accessDate: "2026-06-06"
    archived: false
  - url: "https://krebsonsecurity.com/2026/05/cisa-admin-leaked-aws-govcloud-keys-on-github/"
    publisher: "KrebsOnSecurity"
    publisherType: media
    reliability: R1
    publicationDate: "2026-05-18"
    accessDate: "2026-06-06"
    archived: false
  - url: "https://techcrunch.com/2026/05/19/us-cyber-agency-cisa-exposed-reams-of-passwords-and-cloud-keys-to-the-open-web/"
    publisher: "TechCrunch"
    publisherType: media
    reliability: R2
    publicationDate: "2026-05-19"
    accessDate: "2026-06-06"
    archived: false
  - url: "https://www.axios.com/2026/05/19/congress-cisa-briefing-credentials-leak"
    publisher: "Axios"
    publisherType: media
    reliability: R2
    publicationDate: "2026-05-19"
    accessDate: "2026-06-06"
    archived: false
mitreMappings:
  - techniqueId: "T1552.001"
    techniqueName: "Credentials In Files"
    tactic: "Credential Access"
    attack-version: "v19"
    confidence: "confirmed"
    evidence: "KrebsOnSecurity and TechCrunch reported plaintext credentials, cloud keys, access tokens, and password files exposed in a public GitHub repository."
  - techniqueId: "T1552.004"
    techniqueName: "Private Keys"
    tactic: "Credential Access"
    attack-version: "v19"
    confidence: "probable"
    evidence: "Reporting and the congressional briefing request described exposed AWS GovCloud keys and other secrets tied to CISA or DHS systems."
---

## Summary

On May 18, 2026, KrebsOnSecurity reported that a public GitHub repository maintained by a CISA contractor exposed credentials tied to AWS GovCloud accounts and internal CISA or Department of Homeland Security systems. The repository was reported under the name "Private-CISA" and was taken offline after notification to CISA.

The public reporting described exposed cloud keys, access tokens, plaintext passwords, logs, and internal deployment material. CISA told reporters it was aware of the reported exposure and was investigating, while stating there was no indication that sensitive data was compromised as a result of the incident.

On May 19, 2026, House Homeland Security Committee leaders requested an urgent briefing from CISA about the exposure. The available sources do not confirm malicious exploitation or identify a threat actor, so attribution remains Unknown.

## Technical Analysis

The exposure centered on a public GitHub repository associated with a contractor employee. KrebsOnSecurity reported that the repository included files for building, testing, and deploying software internally, along with credentials for cloud and internal resources.

The reported contents included a file titled "importantAWStokens" with administrative credentials for three AWS GovCloud servers. Another file named "AWS-Workspace-Firefox-Passwords.csv" reportedly listed usernames and passwords for internal systems, including a secure code development environment.

TechCrunch reported that GitGuardian researcher Guillaume Valadon identified the exposed credentials and that some keys were tested to verify validity. KrebsOnSecurity reported that the GitHub account and repository were taken offline after notification, but that exposed AWS keys were reported to have remained valid for a period after the repository was removed.

## Attack Chain

### Stage 1: Repository exposure

A contractor-maintained GitHub repository containing operational files and credentials was publicly accessible.

### Stage 2: Secret discovery

GitGuardian identified the exposure while scanning public repositories and attempted to alert the account owner.

### Stage 3: Researcher notification

After the account owner reportedly did not respond, the issue was escalated through KrebsOnSecurity and then to CISA.

### Stage 4: Repository removal and investigation

The GitHub account and repository were taken offline after notification. CISA said it was investigating and had no indication that sensitive data was compromised.

## Impact Assessment

The potential impact was exposure of credentials for government cloud and internal systems. Reported materials included AWS GovCloud keys, access tokens, plaintext passwords, logs, and files related to internal build and deployment processes.

KrebsOnSecurity reported that a security researcher validated that exposed credentials could authenticate to three AWS GovCloud accounts with high privilege. The reporting also identified exposed credentials related to internal artifact repositories and development environments.

No public source reviewed for this draft confirmed malicious use of the credentials or a resulting breach. The incident remains an exposure and investigation event rather than a confirmed intrusion.

## Attribution

The repository was reported to be maintained by an employee of Nightwing, a government contractor. Nightwing directed inquiries to CISA in the available reporting.

There is no confirmed malicious actor attribution in the public sources. The exposure appears in reporting as a public repository and secrets-management failure, with independent researchers and journalists identifying and escalating the issue.

## Timeline

### 2025-11-13 - Repository reportedly created

KrebsOnSecurity reported that the "Private-CISA" repository was created on November 13, 2025, according to researcher review.

### 2026-05-15 - Researcher notification escalated

KrebsOnSecurity reported hearing from GitGuardian researcher Guillaume Valadon on May 15 after prior alerts to the account owner reportedly went unanswered.

### 2026-05-18 - Public reporting released

KrebsOnSecurity published the first public report describing exposed AWS GovCloud keys and internal credentials.

### 2026-05-19 - CISA statement and congressional request followed

TechCrunch and Axios published follow-up reporting. House Homeland Security Committee leaders also requested a briefing from CISA about the exposure.

## Remediation & Mitigation

- Revoke and rotate exposed cloud keys, access tokens, SSH keys, and plaintext passwords.
- Audit AWS GovCloud accounts and internal systems for access during and after the repository exposure window.
- Enforce secret scanning and push protection for public and private repositories used by employees and contractors.
- Block plaintext credential storage in code repositories, spreadsheets, browser profiles, and synchronization folders.
- Require contractor access controls, logging, and incident reporting that match agency security requirements.
- Review build, artifact, and deployment systems for unauthorized access or tampering.

## Sources & References

- [U.S. House Committee on Homeland Security: Letter to CISA on AWS Credentials Exposure](https://federalnewsnetwork.com/wp-content/uploads/2026/05/2026.05.19-T_Andrersen_F_BGT_DR_CISA-AWS-Credentials-Final.pdf) — U.S. House Committee on Homeland Security, 2026-05-19
- [KrebsOnSecurity: CISA Admin Leaked AWS GovCloud Keys on Github](https://krebsonsecurity.com/2026/05/cisa-admin-leaked-aws-govcloud-keys-on-github/) — KrebsOnSecurity, 2026-05-18
- [TechCrunch: US cyber agency CISA exposed reams of passwords and cloud keys to the open web](https://techcrunch.com/2026/05/19/us-cyber-agency-cisa-exposed-reams-of-passwords-and-cloud-keys-to-the-open-web/) — TechCrunch, 2026-05-19
- [Axios: Senator requests classified briefing on CISA credentials leak](https://www.axios.com/2026/05/19/congress-cisa-briefing-credentials-leak) — Axios, 2026-05-19
