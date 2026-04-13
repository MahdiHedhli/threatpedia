---
eventId: TP-2026-0045
title: "Operation TrueChaos: TrueConf Zero-Day Supply Chain Attack on Southeast Asian Governments"
date: 2026-03-28
attackType: supply-chain
severity: critical
sector: Government / International
geography: Southeast Asia
threatActor: Chinese-nexus (unattributed)
attributionConfidence: A4
reviewStatus: under_review
confidenceGrade: C
generatedBy: new-threat-intel-automation
generatedDate: 2026-03-28
cves:
  - "CVE-2026-3502"
relatedSlugs:
  - "fbi-dcsnet-salt-typhoon-2026"
  - "frostarmada-soho-dns-hijacking-2026"
tags:
  - "zero-day"
  - "supply-chain"
  - "trueconf"
  - "china"
  - "nation-state"
  - "dll-sideloading"
  - "havoc-c2"
  - "government"
  - "southeast-asia"
  - "update-mechanism"
  - "espionage"
---
## Executive Summary

Check Point Research disclosed Operation TrueChaos on March 28, 2026, a sophisticated supply-chain attack targeting Southeast Asian government entities through a zero-day vulnerability in TrueConf video conferencing client. The threat actor, attributed with moderate confidence to Chinese-nexus operations, compromised TrueConf on-premises servers and weaponized the product's automatic update mechanism to deliver malicious payloads to government endpoints.

                        CVE-2026-3502 (CVSS 7.8) in the TrueConf update client allowed privilege escalation and arbitrary code execution. The attack chain combined DLL sideloading via poweriso.exe, UAC bypass through iscsicpl.exe, and deployment of Havoc C2 framework implants. The attack specifically targeted Southeast Asian governments, indicating espionage objectives aligned with regional geopolitical interests.

                        TrueConf, with 100,000+ organizations globally, released patched version 8.5.3 in March 2026. The attack demonstrates how even mature supply-chain update mechanisms can be weaponized when combined with initial access to infrastructure, posing significant risk to government and critical infrastructure sectors worldwide.

## Timeline

Unknown — Initial Compromise
                                Server Infrastructure Access
                                Threat actor gains initial access to TrueConf on-premises server infrastructure. Specific vector not disclosed.

                                Unknown — Exploitation Period
                                Supply-Chain Preparation
                                Attacker establishes presence on compromised servers, modifies update package distribution mechanisms to inject malicious payloads into legitimate TrueConf client updates.

                                2026-03-17 — Campaign Execution
                                Malicious Updates Deployed
                                Government endpoints receiving TrueConf automatic updates download and install packages containing malicious payloads. DLL sideloading phase begins on affected systems.

                                2026-03-18 — Post-Exploitation
                                Privilege Escalation & Havoc Deployment
                                UAC bypass executed via iscsicpl.exe. Havoc C2 implants deployed to establish command and control channels. Data exfiltration begins.

                                2026-03-28 — Public Disclosure
                                Check Point Research Publication
                                Check Point Research publishes Operation TrueChaos analysis detailing TTPs, IOCs, and attack infrastructure.

                                2026-03-30 — Remediation Available
                                TrueConf v8.5.3 Patch Release
                                TrueConf releases patch version 8.5.3 remediating CVE-2026-3502. Users advised to update immediately.

## Technical Details

Vulnerability Overview: CVE-2026-3502 represents a critical gap in the TrueConf update client's handling of signed packages. The vulnerability permits elevation of privilege and arbitrary code execution when processing crafted update packages delivered through the standard update mechanism.

                                Stage 1: Infrastructure Compromise
                                
                                    Threat actor establishes persistent access to TrueConf on-premises server infrastructure. Specific initial access vector remains undisclosed in public reporting. Server-side access allows manipulation of update packages before distribution to clients.

                                Stage 2: Malicious Update Package Creation
                                
                                    Attacker crafts update packages containing:
                                    
                                        Legitimate TrueConf binaries (to avoid immediate detection)
                                        Malicious DLL files (7z-x64.dll, others)
                                        Sideloading trigger via poweriso.exe replacement

                                Stage 3: DLL Sideloading via poweriso.exe
                                
                                    Update package includes malicious poweriso.exe that sideloads 7z-x64.dll during execution. This DLL contains code for UAC bypass and C2 communication. The sideloading technique abuses Windows DLL search order to load attacker-controlled libraries during normal process execution.

                                Stage 4: UAC Bypass via iscsicpl.exe
                                
                                    Sideloaded DLL exploits iscsicpl.exe (iSCSI Initiator Control Panel, marked as auto-elevate) to bypass User Access Control. This permits the malicious payload to execute with System-level privileges without user interaction.

                                Stage 5: Havoc C2 Deployment
                                
                                    Elevated payload deploys Havoc C2 framework implant with capabilities for:
                                    
                                        Remote code execution and command execution
                                        File exfiltration
                                        Lateral movement within government networks
                                        Defense evasion and persistence mechanisms

                                Stage 6: Data Collection & Exfiltration
                                
                                    Havoc implants establish command and control communications with attacker infrastructure. Government networks become subject to targeted data collection aligned with espionage objectives. Persistence mechanisms ensure ongoing access beyond initial intrusion period.

                            File Hashes (Malicious Samples)
                            
                                22e32bcf113326e366ac480b077067cf
                                9b435ad985b733b64a6d5f39080f4ae0
                                248a4d7d4c48478dcbeade8f7dba80b3

                            C2 Infrastructure
                            
                                43.134.90[.]60
                                43.134.52[.]221
                                47.237.15[.]197

                            Havoc C2 Framework: Open-source command and control framework known for use in targeted attacks against government and critical infrastructure. Provides extensive capabilities for post-exploitation operations. Selection of Havoc indicates attacker sophistication and intent for sustained operations within compromised networks.

## Impact Assessment

Scope of Compromise: The attack targeted Southeast Asian government agencies operating TrueConf video conferencing infrastructure. The exact number of affected organizations has not been disclosed, though the region's government sector represents a high-value target set for espionage operations. TrueConf serves 100,000+ organizations globally, creating potential for collateral exposure if update mechanisms were compromised more broadly than disclosed.

                        Data at Risk: Government endpoints running compromised TrueConf clients became subject to full remote access and data exfiltration. Sensitive information potentially exposed includes: diplomatic communications, intelligence assessments, government decision-making processes, personnel information, and classified or controlled unclassified information related to government operations.

                        Lateral Movement Potential: Havoc implants operating at System privilege level can conduct reconnaissance and lateral movement within government networks. The presence of C2-capable implants suggests ongoing ability to maintain access and conduct secondary phases of espionage objectives aligned with strategic interests of the threat actor.

                        Supply-Chain Implications: Successful compromise of TrueConf server infrastructure and update mechanisms demonstrates a complete breach of the software supply chain. Organizations relying on TrueConf for secure government communications face the risk that any future update could be weaponized, requiring out-of-band verification procedures and increased supply-chain security scrutiny.

## Attribution Analysis

Primary Attribution: Check Point Research attributes Operation TrueChaos to a Chinese-nexus threat actor with moderate confidence. The attribution is based on operational tempo, targeting patterns (Southeast Asian governments), capabilities (Havoc C2 deployment), and overlaps with documented Chinese state-sponsored cyber operations.

                        Confidence Rationale: "Moderate confidence" indicates analysts possess supporting evidence but acknowledge the possibility of misattribution or false-flag operations. TTPs alone are insufficient for definitive attribution; geopolitical context, targeting patterns, and timing strengthen the assessment but do not constitute proof.

                        Regional Context: Southeast Asian government entities are consistent targets for Chinese intelligence collection due to regional geopolitical significance. The targeting aligns with known Chinese strategies to develop persistent access into government networks for long-term intelligence collection.

                        Caveats: Definitive attribution requires additional intelligence not disclosed in public reporting. Threat actors routinely implement OPSEC measures, false-flag operations, and misdirection. The assessment should be treated as "likely responsible" rather than definitive, and updated as additional evidence emerges.

## Mitigations & Defenses

Immediate Actions:
                            1. Update TrueConf to version 8.5.3 or later immediately. Prioritize government and critical infrastructure organizations.
                            2. Disable automatic updates temporarily and implement manual, controlled update procedures with verification steps.
                            3. Review server-side access logs for TrueConf infrastructure for signs of compromise or unauthorized access.
                            4. Block C2 IOCs (43.134.90[.]60, 43.134.52[.]221, 47.237.15[.]197) at network perimeter and endpoint firewalls.
                            5. Search endpoint security tools for file hashes associated with the malicious payloads.

                            Incident Response (If Compromised):
                            1. Isolate affected systems from network to prevent lateral movement and ongoing C2 communications.
                            2. Collect forensic images of affected endpoints before remediation (prioritize volatile memory capture).
                            3. Conduct full endpoint forensic analysis to identify dwell time, lateral movement scope, and exfiltrated data.
                            4. Assume all credentials and tokens stored/processed on compromised systems are potentially compromised. Rotate credentials immediately.
                            5. Review and revoke any OAuth tokens, session cookies, or API keys that may have been accessed during compromise window.

                            Detection & Hunting:
                            1. Hunt for poweriso.exe and 7z-x64.dll in TrueConf client installation directories (non-standard).
                            2. Monitor process execution for iscsicpl.exe spawning child processes (abnormal behavior).
                            3. Hunt for Havoc C2 network signatures (protocol beaconing patterns to C2 infrastructure).
                            4. Review Windows Defender SmartScreen / cloud-based detection logs for blocked or suspicious executables.
                            5. Search endpoint telemetry for UAC bypass techniques (token elevation, process token modifications).

                            Long-Term Supply-Chain Security:
                            1. Implement code signing verification procedures for all software updates before deployment.
                            2. Require vendors to publish software Bill of Materials (SBOM) for transparency and vulnerability tracking.
                            3. Establish supply-chain risk management framework for critical software dependencies.
                            4. Consider software composition analysis (SCA) tools to track third-party component vulnerabilities.
                            5. Require out-of-band verification of critical security updates before deployment to critical systems.

## Operational Context

Operation TrueChaos represents a continuation of Chinese state-sponsored cyber operations targeting Southeast Asian governments for espionage purposes. Similar patterns have been observed in prior campaigns including: APT1 (Comment Crew) targeting of US federal agencies, Axiom targeting of NATO members, and ongoing operations against regional governments in Southeast Asia.

                        The exploitation of supply-chain mechanisms to deliver payloads demonstrates an evolution in TTPs. Rather than pursuing vulnerable software components within organizations, the threat actor conducted a highly targeted attack on the software vendor's infrastructure, enabling a precision strike against a specific region's government sector. This approach minimizes collateral exposure and maximizes dwell time before detection.

                        The use of Havoc C2 framework indicates the attacker seeks extended persistence and post-exploitation capabilities, not merely one-time data theft. This aligns with strategic intelligence objectives: maintaining access to government networks for ongoing collection of diplomatic, military, and intelligence information over extended periods.

                    Sources & References

                            1.
                            Check Point Research — Operation TrueChaos: TrueConf Zero-Day Supply Chain Attack on Southeast Asian Governments
                            https://research.checkpoint.com/

                            2.
                            The Hacker News — TrueConf Zero-Day Used in Targeted Attack Against Southeast Asian Governments
                            https://thehackernews.com/

                            3.
                            BleepingComputer — Chinese Hackers Exploit TrueConf Supply Chain in Targeted Attack
                            https://www.bleepingcomputer.com/

                            4.
                            Help Net Security — Operation TrueChaos: DLL Sideloading and UAC Bypass in Government Targeting Attack
                            https://www.helpnetsecurity.com/

                            5.
                            MITRE ATT&CK — Havoc C2 Framework Documentation and Detection Guidance
                            https://attack.mitre.org/

                            6.
                            CVE Details — CVE-2026-3502: TrueConf Update Client Privilege Escalation
                            https://www.cvedetails.com/

                    Key Takeaways
                    
                        Supply-Chain Attack: Compromise of TrueConf server infrastructure enabling injection of malicious payloads into legitimate client updates
                        Zero-Day Exploitation: CVE-2026-3502 (CVSS 7.8) in TrueConf update client facilitates privilege escalation and code execution
                        DLL Sideloading + UAC Bypass: Multi-stage exploitation chain: poweriso.exe → 7z-x64.dll → iscsicpl.exe elevation → System-level access
                        Havoc C2 Deployment: Post-exploitation implants provide remote access, lateral movement, and sustained espionage capabilities
                        Attribution: Chinese-nexus threat actor, moderate confidence, targeting Southeast Asian governments for espionage
                        Patch Available: TrueConf v8.5.3 (March 2026) — Update immediately, especially critical for government sector

                    Threat Actor Profile
                    
                        Classification: Nation-State / Espionage
                        Attribution: Chinese-Nexus (Unattributed)
                        Confidence Level: Moderate
                        Primary Target: Southeast Asian Governments
                        Motive: Intelligence Collection / Espionage
                        Sophistication Level: High (Supply-chain + zero-day)

                    Affected Technology
                    
                        Product: TrueConf
                        Affected Versions: Prior to 8.5.3
                        Type: Video Conferencing Client
                        Global Install Base: 100,000+ organizations
                        Patch Status: Available (v8.5.3, March 2026)

                    Related Incidents
                    FrostArmada: SOHO Router DNS Hijacking
                    Salt Typhoon: DCInet Telecom Compromise
                    APT1 (Comment Crew): Targeted US Federal Operations
                    Axiom: NATO Member Targeting

                    Quick Facts
                    
                        First Observed: Unknown (Publicly disclosed March 28, 2026)
                        Dwell Time: Likely months (pre-disclosure)
                        Attack Vector: Compromised supply-chain update mechanism
                        Data Risk: Government communications, intelligence, classified info
