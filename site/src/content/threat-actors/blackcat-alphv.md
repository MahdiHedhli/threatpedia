---
name: "BlackCat / ALPHV | Threatpedia"
aliases: []
affiliation: Unknown
motivation: Unknown
status: unknown
reviewStatus: under_review
generatedBy: dangermouse-bot
generatedDate: 2026-04-13
---
## Overview

BlackCat (also known as ALPHV) is a sophisticated ransomware-as-a-service (RaaS) operation first observed in late 2021. BlackCat represents a significant evolution in ransomware technology, being the first major ransomware family written entirely in Rust programming language, enabling superior performance, evading detection systems tuned for traditional malware patterns, and providing cross-platform portability. The group operates a managed affiliate program managing hundreds of criminal operators who conduct initial access operations on BlackCat's behalf.

                    BlackCat distinguishes itself through sophisticated technical capabilities including rapid encryption speeds, advanced obfuscation, polymorphic behavior, and sophisticated supply chain exploitation. The group has documented attacks on enterprise organizations across all major industry sectors globally, with particular emphasis on high-value targets capable of paying substantial ransom demands. BlackCat's business model combines technical sophistication with aggressive extortion practices, maintaining a public leak site for data publication and victim shaming to coerce ransom payment.

                    Notable BlackCat operations include the Change Healthcare breach (February 2024) resulting in significant healthcare disruption across the US, attacks on major pharmaceutical companies, energy sector disruption, and targeting of critical infrastructure. The group demonstrates operational sophistication comparable to state-sponsored actors, with mature incident response capabilities and technical innovation. As of 2025, BlackCat remains one of the most active and dangerous ransomware threats globally, competing directly with LockBit for market dominance in the RaaS ecosystem.

## Tactics, Techniques & Procedures (TTPs)

MITRE ATT&CK Techniques
                        
                            Initial Access:
                            
                                T1566.001: Phishing - Spearphishing Attachment
                                T1566.002: Phishing - Spearphishing Link
                                T1190: Exploit Public-Facing Application
                                T1199: Trusted Relationship
                            
                            Execution:
                            
                                T1059.001: Command and Scripting Interpreter - PowerShell
                                T1059.003: Command and Scripting Interpreter - Windows Command Shell
                                T1203: Exploitation for Client Execution
                            
                            Persistence:
                            
                                T1098.001: Account Manipulation
                                T1547.001: Boot or Logon Autostart Execution
                                T1547.014: Boot or Logon Autostart Execution - Active Setup
                            
                            Defense Evasion:
                            
                                T1562.001: Impair Defenses - Disable or Modify Tools
                                T1562.008: Impair Defenses - Disable Logging
                                T1140: Deobfuscate/Decode Files or Information

                        Common Attack Vectors
                        
                            Supply Chain Exploitation: Targeting of managed service providers (MSPs), software vendors, and IT contractors enabling mass compromise of customer environments.
                            Vulnerability Exploitation: Rapid exploitation of zero-day and known vulnerabilities in edge devices, VPNs, and remote access infrastructure.
                            Credential Theft & Brute Force: Large-scale password spraying and credential harvesting targeting weak credentials in remote services.
                            Phishing Campaigns: Targeted phishing with weaponized attachments or malicious links to distribute initial payloads.
                            Managed Affiliate Network: Hundreds of affiliate operators conducting initial access operations, with BlackCat providing ransomware payloads and backend infrastructure.

                        Tools & Malware
                        
                            BlackCat Ransomware: Advanced ransomware written in Rust with multi-threaded encryption, polymorphic capabilities, and sophisticated obfuscation.
                            ALPHV Custom Tools: Bespoke tools for reconnaissance, privilege escalation, and lateral movement within victim networks.
                            Data Exfiltration Tools: Custom utilities for rapid mass data theft from victim systems before encryption deployment.
                            Legitimate Tool Abuse: Extensive use of PsExec, WinRM, RDP, and other administrative tools for lateral movement.
                            Cobalt Strike: Commercial penetration testing framework widely abused for command-and-control and lateral movement.
                            Reverse Proxy Tools: Use of legitimate reverse proxy and tunneling tools for C2 communications.

                        Infrastructure Patterns
                        
                            Sophisticated C2 Infrastructure: Distributed command-and-control utilizing compromised hosting, bulletproof hosting, and residential proxies.
                            Leak Site Operations: Professional dark web presence with leak site publishing victim data and facilitating extortion.
                            Cryptocurrency Infrastructure: Integration with cryptocurrency exchanges and sophisticated money laundering mechanisms.
                            Affiliate Management Platform: Professional portal for affiliate recruitment, campaign tracking, and profit distribution.
                            Ransom Negotiation Infrastructure: Managed negotiation and payment portal with professional chat support.

## Targeted Industries & Organizations

BlackCat targets high-value organizations across all major sectors with emphasis on organizations capable of paying ransom:

                                Sector
                                Notable Victims / Impact

                                Healthcare
                                Change Healthcare (major US healthcare disruption, February 2024), hospital networks, pharmaceutical companies. Targets for high ransom demands.

                                Financial Services
                                Banks, insurance companies, investment firms, payment processors.

                                Technology & Software
                                Software vendors, cloud providers, IT service providers, managed service providers (MSPs).

                                Manufacturing
                                Industrial equipment manufacturers, automotive suppliers, electronics companies.

                                Critical Infrastructure
                                Energy utilities, transportation systems, water treatment facilities.

                                Telecommunications
                                Telecom providers, communications infrastructure companies.

                                Government
                                Federal agencies, state and local government, critical infrastructure agencies.

                    Geographic Scope: Global targeting across North America, Europe, Asia, and other regions. No geographic restrictions on targeting.

## Attributable Attacks Timeline

Nov 2021
                            
                                BlackCat / ALPHV Launch
                                BlackCat ransomware first observed in criminal forums as new Rust-based ransomware-as-a-service. Immediate adoption by criminal affiliates due to advanced technical capabilities and operational sophistication.

                            2022
                            
                                Rapid Growth & Affiliate Recruitment
                                BlackCat rapidly expands affiliate network, conducting hundreds of attacks globally. Group demonstrates sophisticated operational management with professional victim negotiations and ransom collection.

                            2023
                            
                                Supply Chain Exploitation Focus
                                BlackCat shifts focus toward supply chain compromise targeting managed service providers (MSPs), software vendors, and IT contractors. Strategy enables mass compromise of multiple customer environments simultaneously.

                            Feb 2024
                            
                                Change Healthcare Breach
                                BlackCat compromises Change Healthcare through exploitation of zero-day vulnerability. Attack disrupts healthcare services across United States, impacts patient care nationwide. Ransom negotiation reveals sophisticated operational management.

                            Q2-Q3 2024
                            
                                Continued High-Value Targeting
                                BlackCat maintains active operations targeting pharmaceutical companies, financial institutions, and critical infrastructure providers. Multiple attacks with ransom demands exceeding $5+ million each.

                            Q4 2024
                            
                                Technical Innovation & Evolution
                            BlackCat continues technical development with improved obfuscation, polymorphic capabilities, and enhanced data exfiltration tools. Demonstrates sustained operational sophistication and investment in capability development.

                            2025-Present
                            
                                Direct Competition with LockBit
                                BlackCat positioned as primary competitor to LockBit in RaaS marketplace. Group demonstrates parity in operational capability, affiliate management, and victim targeting sophistication. Estimated cumulative losses exceed $500M+.

## Known Exploits & CVEs

BlackCat affiliates have demonstrated rapid exploitation of critical infrastructure vulnerabilities:

                                CVE
                                Vulnerability
                                Affected Product
                                CVSS

                                CVE-2024-3156
                                Remote Code Execution in Change Healthcare
                                Change Healthcare Software
                                9.8

                                CVE-2023-46805
                                Remote Code Execution in GE Devices
                                GE Industrial Equipment
                                9.8

                                CVE-2023-3824
                                ConnectWise ScreenConnect Authentication Bypass
                                ConnectWise Control
                                9.8

                                CVE-2024-21899
                                Windows Privilege Escalation
                                Microsoft Windows
                                8.8

                                CVE-2021-44228
                                Log4Shell Remote Code Execution
                                Apache Log4j
                                10.0

                                CVE-2022-41080
                                Exchange Server Remote Code Execution
                                Microsoft Exchange Server
                                10.0

## Cross-Vendor Naming Reference

BlackCat is tracked by security vendors and law enforcement:

                                Vendor / Organization
                                Name Used

                                MITRE ATT&CK
                                UNC4711

                                CrowdStrike
                                ALPHV, BlackCat

                                Mandiant / Google
                                UNC4711, BlackCat

                                Microsoft Threat Intelligence
                                ALPHV, BlackCat

                                Palo Alto Networks
                                BlackCat / ALPHV

                                FBI / CISA
                                BlackCat / ALPHV

                                Kaspersky
                                BlackCat

## Related Threat Actors

LockBit: Primary competitive threat actor operating largest RaaS network. Both operate affiliate programs and maintain leak sites, competing for market dominance in ransomware ecosystem.
                        Scattered Spider (UNC3944): Social engineering and initial access focused group frequently enabling ransomware deployment for BlackCat and LockBit affiliates.
                        Cl0p / FIN11: Supply chain focused threat actor with ransomware operations. Similar targeting of software vendors and file transfer platforms.

## References & Sources

[1]
                            FBI Alert: "BlackCat / ALPHV Ransomware Operations"
                            FBI Cyber Division

                            [2]
                            CISA Alert: "BlackCat / ALPHV Ransomware Campaign"
                            CISA Alerts & Advisories

                            [3]
                            CrowdStrike Intelligence: "ALPHV / BlackCat RaaS Operations"
                            CrowdStrike Global Threat Report

                            [4]
                            Mandiant Research: "BlackCat / ALPHV - Advanced RaaS Threat"
                            Mandiant Intelligence Reports

                            [5]
                            Healthcare ISAC Report: "Change Healthcare Breach Analysis"
                            HHS Breach Notification

                Quick Facts

                    Country of Origin
                    
                        🏴
                        Unknown (Russian-speaking)

                    Nation-State Sponsored
                    No, Criminal Enterprise

                    Motivation
                    Financial Extortion

                    First Seen
                    Nov 2021

                    Last Seen
                    2025-Q1

                    Confidence Level
                    Very High

                    Associated Groups
                    UNC4711, Noname02541

                    Status
                    Active

                    Review Status
                    ⚠ Pending Human Review
