---
eventId: TP-2021-0001
title: Kaseya VSA Supply Chain Ransomware Attack
date: 2021-07-02
attackType: Supply Chain / Ransomware
severity: critical
sector: Technology
geography: Global
threatActor: REvil (Sodinokibi)
attributionConfidence: A2
reviewStatus: draft_ai
confidenceGrade: B
generatedBy: dangermouse-bot
generatedDate: 2026-04-16
cves:
  - CVE-2021-30116
  - CVE-2021-30119
  - CVE-2021-30120
relatedSlugs: []
tags:
  - supply-chain
  - ransomware
  - revil
  - sodinokibi
  - kaseya
  - msp
  - zero-day
  - cve-2021-30116
sources:
  - url: https://www.cisa.gov/news-events/cybersecurity-advisories/aa21-188a
    publisher: CISA
    publisherType: government
    reliability: R1
    publicationDate: "2021-07-04"
    accessDate: "2026-04-16"
    archived: false
  - url: https://nvd.nist.gov/vuln/detail/CVE-2021-30116
    publisher: NIST NVD
    publisherType: government
    reliability: R1
    publicationDate: "2021-07-09"
    accessDate: "2026-04-16"
    archived: false
  - url: https://www.huntress.com/blog/rapid-response-kaseya-vsa-mass-msp-ransomware-incident
    publisher: Huntress
    publisherType: vendor
    reliability: R2
    publicationDate: "2021-07-02"
    accessDate: "2026-04-16"
    archived: false
  - url: https://helpdesk.kaseya.com/hc/en-gb/articles/4403440684689-Important-Notice-July-2nd-2021
    publisher: Kaseya
    publisherType: vendor
    reliability: R1
    publicationDate: "2021-07-02"
    accessDate: "2026-04-16"
    archived: false
  - url: https://www.fbi.gov/news/press-releases/fbi-statement-on-kaseya
    publisher: FBI
    publisherType: government
    reliability: R1
    publicationDate: "2021-07-04"
    accessDate: "2026-04-16"
    archived: false
mitreMappings:
  - techniqueId: T1195.002
    techniqueName: "Supply Chain Compromise: Compromise Software Supply Chain"
    tactic: Initial Access
    notes: REvil exploited Kaseya VSA zero-days to push ransomware through MSP management infrastructure
  - techniqueId: T1486
    techniqueName: "Data Encrypted for Impact"
    tactic: Impact
    notes: REvil ransomware encrypted files on downstream customer systems
  - techniqueId: T1059.001
    techniqueName: "Command and Scripting Interpreter: PowerShell"
    tactic: Execution
    notes: PowerShell used to disable Windows Defender before deploying ransomware payload
---

## Summary

On 2 July 2021, the REvil (Sodinokibi) ransomware group executed a supply chain attack against Kaseya VSA, a remote monitoring and management (RMM) platform used by managed service providers (MSPs) worldwide. By exploiting a chain of zero-day vulnerabilities in the Kaseya VSA on-premises server, the attackers bypassed authentication and injected a malicious update that deployed REvil ransomware to the endpoints managed by each compromised MSP.

The attack affected approximately 60 MSPs and between 800 and 1,500 of their downstream customers. REvil initially demanded $70 million for a universal decryptor, later reducing the demand to $50 million. The attack was timed to coincide with the U.S. Independence Day holiday weekend, when IT staffing levels are typically reduced.

Kaseya immediately shut down its VSA SaaS service and advised all on-premises VSA customers to power off their servers. The company worked with CISA, the FBI, and third-party security firms to investigate the incident and develop patches. On 22 July 2021, Kaseya obtained a universal decryptor through undisclosed means and began distributing it to affected customers.

## Technical Analysis

The attack exploited three zero-day vulnerabilities in Kaseya VSA on-premises servers: CVE-2021-30116 (authentication bypass via credential leak in API endpoint), CVE-2021-30119 (cross-site scripting in the web interface), and CVE-2021-30120 (two-factor authentication bypass).

The Dutch Institute for Vulnerability Disclosure (DIVD) had discovered several of these vulnerabilities and reported them to Kaseya before the attack. Kaseya was in the process of developing patches when REvil independently discovered and weaponized the vulnerabilities.

The attack chain began with an unauthenticated request to the Kaseya VSA API that leaked administrative credentials. Using these credentials, the attackers uploaded a malicious agent update package to the VSA server. The VSA platform's agent update mechanism — designed to push legitimate management software to endpoints — was used to distribute the REvil ransomware payload.

On managed endpoints, the malicious update triggered a PowerShell command that disabled Windows Defender's real-time monitoring and then dropped the REvil ransomware DLL. The DLL was side-loaded using a legitimate copy of an older Microsoft Defender binary (MsMpEng.exe), a technique that exploited the trust relationship between the endpoint and the management platform.

The ransomware encrypted files using Salsa20 for bulk data encryption and RSA-2048 for key wrapping. Each infected machine generated a unique encryption key, and the ransom note demanded payment in Monero cryptocurrency.

## Attack Chain

### Stage 1: VSA Server Authentication Bypass

REvil exploited CVE-2021-30116 to bypass authentication on internet-facing Kaseya VSA on-premises servers. The vulnerability exposed administrative credentials through an API endpoint, granting the attackers full access to the VSA management console.

### Stage 2: Malicious Agent Update Injection

Using administrative access, the attackers uploaded a weaponized agent update package to the VSA server. The package contained the REvil ransomware payload, a legitimate Microsoft Defender binary for DLL side-loading, and a PowerShell script to disable endpoint security controls.

### Stage 3: Distribution via MSP Infrastructure

The VSA server's built-in agent management functionality pushed the malicious update to all endpoints managed by the compromised MSP. Each MSP's downstream customers received the payload through their trusted management channel.

### Stage 4: Endpoint Security Bypass

On each endpoint, a PowerShell command disabled Windows Defender's real-time monitoring. The legitimate MsMpEng.exe binary was used to side-load the REvil DLL, exploiting DLL search order hijacking to execute the ransomware in the context of a trusted process.

### Stage 5: File Encryption and Ransom Demand

The REvil payload encrypted files on local and network-accessible drives using Salsa20/RSA-2048 encryption. Ransom notes demanded payment in Monero, with amounts varying per victim. The group demanded $70 million for a universal decryptor.

## Impact Assessment

The Kaseya VSA attack affected approximately 60 MSPs and between 800 and 1,500 downstream organizations across at least 17 countries. The attack represented one of the largest single ransomware events by victim count.

Coop Sweden, a grocery chain with 800 stores, was forced to close most locations for nearly a week after its payment systems were encrypted through its MSP. Schools in New Zealand, accounting firms in the United States, and IT service providers across Europe were among the affected organizations.

REvil's initial $70 million universal decryptor demand was the largest known ransomware demand at the time. Individual ransom demands ranged from $45,000 to $5 million based on the perceived size of each victim organization.

On 13 July 2021, REvil's infrastructure went offline, and its dark web sites became unreachable. On 22 July, Kaseya announced it had obtained a universal decryptor and began distributing it to affected customers through Emsisoft. The source of the decryptor was not publicly disclosed, though media reports indicated it may have been obtained through law enforcement channels.

In November 2021, the U.S. Department of Justice announced the arrest of Ukrainian national Yaroslav Vasinskyi and the seizure of $6.1 million in ransom proceeds from Russian national Yevgeniy Polyanin, both alleged REvil affiliates connected to the Kaseya attack.

## Attribution

The REvil (Sodinokibi) ransomware-as-a-service operation claimed responsibility for the Kaseya attack on its dark web blog on 4 July 2021. REvil operated as a Russian-language ransomware affiliate program, providing ransomware tools and infrastructure to affiliates who conducted attacks and shared ransom proceeds with the REvil operators.

The FBI attributed the attack to REvil in a joint advisory with CISA published on 4 July 2021. In November 2021, Europol and the FBI arrested Yaroslav Vasinskyi, a Ukrainian national, at the Polish border in connection with the Kaseya attack. Vasinskyi was extradited to the United States and charged under the Computer Fraud and Abuse Act.

U.S. President Biden raised the Kaseya attack in a phone call with Russian President Putin on 9 July 2021, warning that the U.S. would take action against ransomware groups operating from Russian territory. REvil's infrastructure went offline shortly thereafter on 13 July, though the extent of Russian government involvement in the takedown remains unclear.

## Timeline

### 2021-07-02 — REvil Attacks Kaseya VSA

REvil exploited zero-day vulnerabilities in Kaseya VSA on-premises servers, distributing ransomware to downstream MSP customers. The attack was timed for the U.S. Independence Day weekend.

### 2021-07-02 — Kaseya Shuts Down VSA

Kaseya shut down its VSA SaaS platform and advised on-premises customers to immediately power off their VSA servers.

### 2021-07-04 — CISA and FBI Issue Joint Advisory

CISA published advisory AA21-188A with indicators of compromise and mitigation guidance for affected organizations.

### 2021-07-04 — REvil Demands $70 Million

REvil posted on its dark web blog claiming responsibility and demanding $70 million in Bitcoin for a universal decryptor.

### 2021-07-09 — Kaseya Releases Patches

Kaseya released VSA version 9.5.7a, patching the three zero-day vulnerabilities exploited in the attack.

### 2021-07-13 — REvil Infrastructure Goes Offline

All REvil dark web sites and infrastructure went offline without public explanation.

### 2021-07-22 — Universal Decryptor Obtained

Kaseya announced it had obtained a universal decryptor from an undisclosed third party and began distributing it to affected customers.

### 2021-11-08 — DOJ Announces Arrests

The U.S. Department of Justice announced the arrest of Yaroslav Vasinskyi and the seizure of $6.1 million from Yevgeniy Polyanin in connection with REvil operations.

## Remediation & Mitigation

MSPs should ensure RMM platforms are patched to the latest available version and restrict management console access to trusted networks. Internet-facing RMM servers should be protected with network-level access controls, multi-factor authentication, and web application firewalls.

MSPs should implement network segmentation between their management infrastructure and customer environments to limit the blast radius of a management platform compromise. Agent update mechanisms should be monitored for anomalous behavior, including unexpected update sizes, unusual deployment schedules, and modifications to security configurations.

Downstream organizations using MSP services should establish contractual requirements for MSP security practices, including vulnerability management timelines, incident notification procedures, and security audit rights.

Endpoint detection and response (EDR) solutions should monitor for indicators of RMM-based attacks, including DLL side-loading from management agent directories, PowerShell commands disabling security products, and unusual file encryption activity following management platform updates.

## Sources & References

- [CISA: Advisory AA21-188A — Kaseya VSA Supply Chain Ransomware Attack](https://www.cisa.gov/news-events/cybersecurity-advisories/aa21-188a) — CISA, 2021-07-04
- [NIST NVD: CVE-2021-30116](https://nvd.nist.gov/vuln/detail/CVE-2021-30116) — NIST NVD, 2021-07-09
- [Huntress: Rapid Response — Kaseya VSA Mass MSP Ransomware Incident](https://www.huntress.com/blog/rapid-response-kaseya-vsa-mass-msp-ransomware-incident) — Huntress, 2021-07-02
- [Kaseya: Important Notice — July 2nd, 2021](https://helpdesk.kaseya.com/hc/en-gb/articles/4403440684689-Important-Notice-July-2nd-2021) — Kaseya, 2021-07-02
- [FBI: Statement on Kaseya](https://www.fbi.gov/news/press-releases/fbi-statement-on-kaseya) — FBI, 2021-07-04
