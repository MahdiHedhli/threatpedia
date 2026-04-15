---
name: APT41
aliases:
  - "BARIUM"
  - "Winnti"
  - "Double Dragon"
  - "BRASS TYPHOON"
affiliation: China
motivation: "Espionage & Financial"
status: active
reviewStatus: under_review
generatedBy: dangermouse-bot
generatedDate: 2026-04-13
---
## Overview

APT41 (BARIUM) is a sophisticated Chinese state-sponsored threat actor that operates a unique dual-purpose model, conducting both state-sponsored espionage operations and financially motivated cybercrime. Active since at least 2012, APT41 is known for targeting healthcare, telecommunications, and high-technology sectors across the United States, Europe, and Asia-Pacific regions, with particular focus on intellectual property theft and financial fraud.

                    The group is notable for combining advanced espionage tradecraft with operational security breaches, simultaneously conducting state-directed intelligence collection alongside financial cybercrime operations. This suggests possible compartmentalization between different operational teams within the organization, or alternatively, a group operating under implicit state approval for profit-driven activities alongside official tasking.

                    APT41 maintains extensive custom malware families including ShadowPad, Crosswalk, and various RAT variants. The group demonstrates sophistication in supply chain compromise, zero-day exploitation, and infrastructure management. As of 2025, APT41 continues active operations with expanded targeting of cloud infrastructure, healthcare technology, and emerging sectors including AI/ML companies.

## Tactics, Techniques & Procedures (TTPs)

MITRE ATT&CK Techniques
                        
                            Initial Access:
                            
                                T1190: Exploit Public-Facing Application
                                T1195: Supply Chain Compromise
                                T1566: Phishing
                                T1199: Trusted Relationship
                            
                            Execution:
                            
                                T1059: Command and Scripting Interpreter
                                T1203: Exploitation for Client Execution
                                T1559: Inter-Process Communication
                            
                            Persistence:
                            
                                T1547: Boot or Logon Autostart Execution
                                T1137: Office Application Startup
                                T1547.001: Registry Run Keys
                            
                            Defense Evasion:
                            
                                T1140: Deobfuscate/Decode Files or Information
                                T1036: Masquerading
                                T1027: Obfuscated Files or Information
                            
                            Credential Access:
                            
                                T1110: Brute Force
                                T1056: Input Capture
                                T1111: Multi-Stage Channels
                            
                            Exfiltration & Impact:
                            
                                T1041: Exfiltration Over C2 Channel
                                T1529: System Shutdown/Reboot
                                T1486: Data Encrypted for Impact

                        Common Attack Vectors
                        
                            Supply Chain Compromises: Compromise of software developers, legitimate vendors, and build pipelines to distribute backdoored software at scale.
                            Public-Facing Application Exploits: Rapid exploitation of zero-day and known vulnerabilities in web applications and enterprise software (Citrix, Pulse Secure, F5 BIG-IP).
                            Spear-phishing: Targeted phishing campaigns with custom malware attachments and links delivering remote access trojans.
                            Credential Harvesting: Aggressive credential theft campaigns using custom infostealers and keyloggers.
                            Ransomware Deployment: Dual-purpose operations conducting ransomware attacks for financial gain after intelligence collection.

                        Tools & Malware
                        
                            ShadowPad: Sophisticated modular backdoor used for command execution, lateral movement, and data exfiltration. Deployed via supply chain compromises and direct exploitation.
                            Crosswalk: Post-exploitation framework for lateral movement and system enumeration within victim networks.
                            PcShare RAT: Remote access trojan variant used for persistent access and command execution.
                            Winnti Malware: Legacy malware family still deployed in targeted operations.
                            Custom Infostealers: Multiple proprietary information stealer variants for credential and data harvesting.
                            Cobalt Strike: Post-exploitation framework abused for lateral movement and privilege escalation.
                            Living-off-the-Land Tools: Extensive use of PowerShell, WMI, and native Windows utilities for post-compromise activities.

                        Infrastructure Patterns
                        
                            Compromised Server Infrastructure: Operators use compromised legitimate web servers for command-and-control.
                            Commercial Hosting Abuse: Bullet-proof hosting providers across Eastern Europe and Asia for C2 infrastructure.
                            Domain Generation Algorithms: Use of DGA for dynamic domain generation and resilient C2.
                            Fast Flux Networks: Rapid DNS and IP rotation to evade detection and tracking.
                            Legitimate Service Abuse: Abuse of legitimate cloud services and CDNs for command-and-control communications.

## Targeted Industries & Organizations

Sector
                                Notable Targets / Focus

                                Healthcare & Medical Devices
                                Hospitals, pharmaceutical companies, medical device manufacturers, healthcare IT providers

                                Telecommunications
                                Telecom operators, network infrastructure providers, communications equipment manufacturers

                                Technology & Software
                                Software vendors, cloud providers, SaaS companies, open-source projects, development tools

                                Fintech & Financial Services
                                Banks, payment processors, cryptocurrency exchanges, financial institutions

                                Managed Service Providers
                                IT service providers, system integrators, managed security service providers

                                Government & Defense
                                Defense contractors, government agencies, military research institutions

## Attributable Attacks Timeline

2012-2013
                            
                                Early Operations Begin
                                APT41 begins targeted operations against healthcare and telecommunications sectors in Asia-Pacific region.

                            2014-2015
                            
                                Global Expansion
                                Operations expand to target organizations across North America and Europe, with dual-purpose espionage and financial crime focus.

                            2016-2017
                            
                                ShadowPad Supply Chain Compromise
                                Compromise of NetSarang XManager software to distribute ShadowPad backdoor to thousands of organizations worldwide.

                            2018-2019
                            
                                Ransomware Operations Expansion
                                Escalation of financially-motivated ransomware operations alongside continued espionage activities.

                            2020-2021
                            
                                Healthcare Industry Targeting
                                Intensive focus on healthcare organizations during COVID-19 pandemic for both espionage and financial exploitation.

                            2022-2023
                            
                                Cloud Infrastructure Focus
                                Shift to targeting cloud infrastructure, SaaS applications, and identity and access management systems.

                            2024-2025
                            
                                AI/ML and Emerging Tech Targeting
                                Expansion to artificial intelligence companies, machine learning platforms, and emerging technology sectors.

## Known Exploits & CVEs

CVE ID
                                Vulnerability
                                Affected Product
                                Year

                                CVE-2019-2725
                                Oracle WebLogic RCE
                                Oracle WebLogic Server
                                2019

                                CVE-2019-1040
                                Windows NTLM Relay Attack
                                Microsoft Windows
                                2019

                                CVE-2021-21985
                                vCenter Server RCE
                                VMware vCenter
                                2021

                                CVE-2021-44228
                                Apache Log4j Remote Code Execution
                                Apache Log4j
                                2021

                                CVE-2023-32315
                                Citrix NetScaler Authentication Bypass
                                Citrix NetScaler
                                2023

## Cross-Vendor Naming Reference

Vendor
                                Attribution Name

                                Microsoft
                                BRASS TYPHOON

                                CrowdStrike
                                OOGLELANG

                                Mandiant
                                APT41

                                FireEye
                                BARIUM

                                Kaspersky
                                Winnti

                                Symantec
                                Double Dragon

## Related Threat Actors

APT41 operates within the broader Chinese state-sponsored and contractor ecosystem. Related groups include:
                    
                        APT1 (Comment Crew) - Chinese PLA Unit 61398
                        APT10 (MenuPass) - Chinese MSS contractor
                        APT27 (Emissary Panda) - Chinese espionage group
                        APT31 (Zirconium) - Chinese government espionage
                        APT40 (Leviathan) - Chinese maritime espionage

## References & Sources

[1] Microsoft Threat Intelligence: "BRASS TYPHOON (APT41) - State-Sponsored and Financially-Motivated Threat" (2024)
                        [2] Mandiant Intelligence Report: "APT41 - China's Dual-Purpose Threat Actor" (2023)
                        [3] FireEye Report: "BARIUM - Supply Chain Compromise and ShadowPad" (2022)
                        [4] CrowdStrike Adversary Report: "OOGLELANG - Healthcare and Telecom Targeting" (2021)
                        [5] Kaspersky Securelist: "Winnti - The Evolution of Chinese Malware" (2020)
                        [6] CISA Alert: "APT41 Ransomware Operations" (2019)
                        [7] Symantec Report: "Double Dragon - Dual-Purpose APT Operations" (2018)
                        [8] Palo Alto Unit 42: "APT41 ShadowPad Analysis and Tracking" (2017)

                Quick Facts

                    Country of Origin
                    
                        🇨🇳
                        China

                    Nation-State Sponsored
                    Yes - Likely MSS

                    Motivation
                    Espionage & Financial

                    First Seen
                    2012

                    Last Seen
                    2025-Q1

                    Confidence Level
                    High

                    Associated Groups
                    Chinese Contractors

                    Status
                    ACTIVE

                    Review Status
                    ⚠ Pending Human Review
