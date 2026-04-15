---
name: Medusa
aliases:
  - "Storm-1175"
affiliation: Criminal
motivation: Financial
status: active
reviewStatus: under_review
generatedBy: dangermouse-bot
generatedDate: 2026-04-13
---
## Overview

Medusa is a financially motivated ransomware group tracked by Microsoft as Storm-1175. Active since June 2021 with a significant operational spike beginning in 2023, Medusa operates a Ransomware-as-a-Service (RaaS) platform employing a double extortion model — encrypting victim data while simultaneously stealing it for leverage. The group maintains a dedicated dark web leak site where stolen data is published when ransom demands are not met.

                    Medusa is notable for its rapid exploitation capability, with Microsoft reporting that the group can move from initial access to ransomware deployment within 24 hours. The group aggressively targets N-day vulnerabilities during the patch adoption window, chaining exploits for persistence and lateral movement. Recent activity has been linked to China-based infrastructure, though the group's operational composition appears multinational.

                    In 2026, Medusa has been particularly active in the healthcare and government sectors, executing high-impact attacks against Passaic County, New Jersey (demanding $800K ransom), the University of Mississippi Medical Center (causing a 20% revenue drop), and other critical organizations. CISA issued a dedicated advisory (AA25-071A) warning of Medusa's growing threat to critical infrastructure.

## Tactics, Techniques & Procedures (TTPs)

MITRE ATT&CK Techniques
                        
                            Initial Access:
                            
                                T1566: Phishing
                                T1190: Exploit Public-Facing Application
                                T1133: External Remote Services
                            
                            Execution:
                            
                                T1059.001: PowerShell
                                T1059.003: Windows Command Shell
                                T1047: WMI
                            
                            Credential Access:
                            
                                T1003: OS Credential Dumping (Mimikatz)
                                T1110: Brute Force
                            
                            Discovery:
                            
                                T1135: Network Share Discovery
                                T1047: WMI
                            
                            Lateral Movement:
                            
                                T1021.001: Remote Desktop Protocol
                                T1569.002: Service Execution (PsExec)
                            
                            Defense Evasion:
                            
                                T1562.001: Impair Defenses - Disable or Modify Tools
                                T1548.002: UAC Bypass via COM
                            
                            Exfiltration:
                            
                                T1567.002: Exfiltration to Cloud Storage (Rclone)
                            
                            Impact:
                            
                                T1486: Data Encrypted for Impact

                        Common Attack Vectors
                        
                            Vulnerability Exploitation: Rapid exploitation of N-day vulnerabilities in web-facing applications, particularly during the patch adoption window. Known to chain multiple exploits for persistence.
                            Phishing Campaigns: Spear-phishing emails with malicious attachments or links targeting employees of healthcare, government, and education organizations.
                            RDP Brute Force: Large-scale credential brute force attacks against exposed Remote Desktop Protocol services.
                            Living-off-the-Land: Extensive use of native Windows tools (PowerShell, WMI, PsExec) for lateral movement and execution to avoid detection.

                        Tools & Malware
                        
                            Medusa Ransomware: Custom ransomware payload with AES-256 encryption. Deploys rapidly with the ability to go from initial access to full encryption within 24 hours.
                            Mimikatz: Credential dumping tool for extracting passwords, hashes, and Kerberos tickets from Windows systems.
                            PsExec: Microsoft Sysinternals tool used for remote command execution and lateral movement across Windows networks.
                            Rclone: Open-source cloud storage synchronization tool abused for large-scale data exfiltration to attacker-controlled cloud storage.
                            Bandizip: File archiving tool used to compress stolen data before exfiltration.
                            Encoded PowerShell Scripts: Obfuscated PowerShell for defense evasion and automated task execution.

                        Infrastructure Patterns
                        
                            Dark Web Leak Site: Dedicated Tor-hosted platform for publishing stolen data from non-paying victims and managing extortion negotiations.
                            RaaS Infrastructure: Affiliate program providing ransomware payloads, negotiation portals, and operational support to partner operators.
                            Cloud Exfiltration Staging: Abuse of legitimate cloud storage services (via Rclone) for staging and transferring stolen data.
                            China-Linked Infrastructure: Recent operations linked to China-based IP addresses and infrastructure, per Microsoft threat intelligence.

## Targeted Industries & Organizations

Medusa targets organizations across healthcare, government, and education — sectors with critical data and high ransom payment incentive:

                            SectorNotable Targets / Impact

                            Government / MunicipalPassaic County, NJ — $800K ransom demand, county services disrupted. Full Report →
                            HealthcareUniversity of Mississippi Medical Center — 20% revenue drop, clinic shutdowns, Epic EHR disrupted. Full Report →
                            EducationMinneapolis Public Schools — 100GB+ stolen, 189K files including sensitive student data leaked
                            Financial ServicesMultiple financial institutions targeted across US, UK, Australia
                            Professional ServicesLaw firms, accounting firms, and consulting organizations

## Attributable Attacks Timeline

Jun 2021
                            
                                Group Emergence
                                Medusa ransomware operations begin, initially with limited activity and a smaller victim count.

                            2023
                            
                                Operational Spike
                                Significant increase in activity. Minneapolis Public Schools attacked (100GB+ data leaked). Group establishes dedicated dark web leak site and scales RaaS operations.

                            2024
                            
                                Healthcare Focus
                                Escalating attacks against healthcare organizations. Microsoft begins tracking as Storm-1175 and documents rapid 24-hour exploitation capability.

                            Feb 2026
                            
                                UMMC Attack
                                Compromises University of Mississippi Medical Center, causing 20% revenue drop, clinic shutdowns, and Epic EHR disruption. Full Report →

                            Mar 2026
                            
                                Passaic County Attack
                                Attacks Passaic County, New Jersey demanding $800K ransom. County services severely disrupted. Full Report →

                            Mar 2026
                            
                                CISA Advisory Issued
                                CISA publishes advisory AA25-071A warning of Medusa ransomware threat to critical infrastructure, providing detection guidance and IOCs.

## Known Exploits & CVEs

CVE
                                Vulnerability
                                Affected Product
                                CVSS

                                CVE-2025-10035
                                Remote Code Execution in GoAnywhere MFT
                                Fortra GoAnywhere MFT
                                9.8

                                CVE-2026-23760
                                Authentication Bypass in SmarterMail
                                SmarterMail
                                9.1

                                CVE-2025-31324
                                Remote Code Execution in SAP NetWeaver
                                SAP NetWeaver
                                9.8

## Cross-Vendor Naming Reference

Vendor / Organization
                                Name Used

                                Microsoft Threat Intelligence
                                Storm-1175

                                CISA / US Government
                                Medusa

                                Symantec / Broadcom
                                Medusa Ransomware

                                Trend Micro
                                Medusa

                                Palo Alto Unit 42
                                Medusa

## Related Threat Actors

LockBit: Rival RaaS operation with overlapping target sectors. Some affiliate crossover has been observed.
                        Cl0p: Another ransomware group known for mass exploitation of file transfer vulnerabilities. Similar targeting of healthcare and government sectors.
                        MedusaLocker: Distinct ransomware family — NOT affiliated with Medusa despite the similar name. Different operational infrastructure and TTPs.

## References & Sources

[1]
                            Microsoft Security Blog: Storm-1175 Medusa Operations
                            Microsoft Security

                            [2]
                            CISA Advisory AA25-071A: Medusa Ransomware
                            CISA

                            [3]
                            The Record: Medusa Ransomware Hits Mississippi Medical Center
                            The Record

                            [4]
                            The Hacker News: Storm-1175 Zero-Day Exploitation
                            The Hacker News

                Quick Facts

                    Country of Origin
                    
                        🌐
                        Unknown (China-linked infrastructure)

                    Nation-State Sponsored
                    No — Criminal Enterprise (RaaS)

                    Motivation
                    Financial (Ransomware & Double Extortion)

                    First Seen
                    June 2021

                    Last Seen
                    2026-Q2

                    Confidence Level
                    High

                    Associated Groups
                    Storm-1175

                    Status
                    ACTIVE

                    Review Status
                    ⚠ Pending Human Review
