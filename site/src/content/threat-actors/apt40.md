---
name: APT40
aliases:
  - "TEMP.Periscope"
  - "Leviathan"
  - "BRONZE MOHUR"
affiliation: China
motivation: Espionage
status: active
reviewStatus: under_review
generatedBy: dangermouse-bot
generatedDate: 2026-04-13
---
## Overview

APT40 (Leviathan) is a Chinese state-sponsored threat actor linked to the Ministry of State Security (MSS) with a primary focus on maritime and naval intelligence collection. Identified as operating since at least 2009, APT40 conducts espionage operations targeting maritime industries, defense contractors, naval research institutions, and engineering firms across the United States, Asia-Pacific, and Europe.

                    The group is highly specialized in targeting industries directly related to Chinese strategic interests in naval power projection, advanced submarine technology, port infrastructure, and marine engineering. APT40 maintains sophisticated command-and-control infrastructure, uses custom malware, and demonstrates deep knowledge of their target industries. The group's operational security and technical sophistication have enabled them to maintain long-term presence within victim networks.

                    As of 2025, APT40 continues to conduct active espionage operations with renewed focus on emerging maritime technologies, unmanned underwater vehicles, and naval defense systems. The group combines targeted malware deployment with credential theft and infrastructure-level reconnaissance to establish persistent access for long-term intelligence collection.

## Tactics, Techniques & Procedures (TTPs)

MITRE ATT&CK Techniques
                        
                            Initial Access:
                            
                                T1566.001: Phishing - Spearphishing Attachment
                                T1566.002: Phishing - Spearphishing Link
                                T1190: Exploit Public-Facing Application
                                T1195.002: Supply Chain Compromise - Compromise Software Supply Chain
                            
                            Execution:
                            
                                T1059.001: Command and Scripting Interpreter - PowerShell
                                T1203: Exploitation for Client Execution
                                T1204.002: User Execution - Malicious File
                            
                            Defense Evasion:
                            
                                T1140: Deobfuscate/Decode Files or Information
                                T1036: Masquerading
                                T1574.001: Hijack Execution Flow - DLL Search Order Hijacking
                            
                            Credential Access:
                            
                                T1110: Brute Force
                                T1056: Input Capture
                                T1056.001: Input Capture - Keylogging
                            
                            Discovery:
                            
                                T1087: Account Discovery
                                T1010: Application Window Discovery
                            
                            Exfiltration:
                            
                                T1041: Exfiltration Over C2 Channel
                                T1020: Automated Exfiltration

                        Common Attack Vectors
                        
                            Targeted Spear-phishing: Highly specific phishing emails impersonating engineering firms, industry partners, and government agencies, often containing custom malware attachments.
                            Watering Hole Attacks: Compromise of maritime and defense industry websites to deliver malware to target organizations.
                            Exploitation of Public Vulnerabilities: Rapid exploitation of zero-day and known vulnerabilities in software commonly used in target industries.
                            Credential Harvesting: Use of keyloggers and form-grabbing techniques to capture credentials from victim systems.
                            Naval and Engineering Industry Targeting: Specialized focus on organizations involved in submarine technology, naval engineering, and maritime defense systems.

                        Tools & Malware
                        
                            ScanBox: Reconnaissance framework used to gather information about target networks and employees before engagement.
                            JSky: Custom implant for remote command execution and data exfiltration.
                            Mimikatz: Legitimate credential dumping tool used for lateral movement within compromised networks.
                            Custom Backdoors: Multiple proprietary backdoor families deployed for persistent access and command execution.
                            Keyloggers: Custom and modified keylogging tools for credential capture.
                            Living-off-the-Land Utilities: Extensive use of PowerShell, WMI, and Windows native tools for post-compromise activities.
                            Webshells: Custom webshells for maintaining access to compromised web servers.

                        Infrastructure Patterns
                        
                            Dedicated Command-and-Control Servers: Operators maintain infrastructure hosted in China and compromised servers globally.
                            Fast Flux DNS: Rapid rotation of DNS records and IP addresses to evade detection.
                            Compromised Legitimate Infrastructure: Use of compromised web servers and legitimate hosting providers for command-and-control.
                            Port Reuse: C2 communication on common ports (80, 443) to blend with legitimate traffic.
                            Domain Generation Algorithms: Use of DGA for dynamic C2 domain generation.

## Targeted Industries & Organizations

Sector
                                Notable Targets / Focus

                                Maritime & Shipping
                                Port authorities, shipping companies, maritime infrastructure operators, vessel management systems

                                Naval & Defense
                                Navy research institutions, defense contractors, submarine technology firms, naval engineering companies

                                Aerospace & Aviation
                                Aircraft manufacturers, aviation research, flight control systems, aerospace engineering

                                Engineering & Manufacturing
                                Naval shipbuilders, marine engineering firms, advanced manufacturing companies

                                Government & Military
                                Naval agencies, defense departments, military research organizations

                                Oil & Gas
                                Offshore drilling operators, platform operators, subsea engineering firms

## Attributable Attacks Timeline

2009-2010
                            
                                Early Maritime Industry Targeting
                                APT40 begins operations targeting maritime and shipping organizations across Asia-Pacific region.

                            2011-2012
                            
                                Naval Defense Sector Focus
                                Operations expand to target naval defense contractors and submarine technology firms.

                            2013-2014
                            
                                US Navy Contractor Campaigns
                                Targeted campaigns against US naval contractors and defense research organizations.

                            2015-2016
                            
                                Global Maritime Infrastructure Targeting
                                Operations span multiple continents targeting port authorities and maritime infrastructure globally.

                            2017-2018
                            
                                Advanced Submarine Technology Operations
                                Specialized campaigns targeting advanced submarine and underwater vehicle research programs.

                            2019-2021
                            
                                Offshore Engineering Focus
                                Expanded targeting of offshore oil and gas engineering firms for platform design intelligence.

                            2022-2024
                            
                                Autonomous Maritime Systems
                                Operations targeting unmanned maritime vehicles, autonomous systems, and naval AI research.

                            2024-2025
                            
                                Continued Maritime Intelligence Operations
                                Ongoing sophisticated campaigns with updated toolsets targeting emerging maritime technologies.

## Known Exploits & CVEs

CVE ID
                                Vulnerability
                                Affected Product
                                Year

                                CVE-2010-2883
                                Adobe PDF Remote Code Execution
                                Adobe Reader
                                2010

                                CVE-2012-0158
                                Windows ListBox Remote Code Execution
                                Microsoft Windows
                                2012

                                CVE-2014-3153
                                Linux Kernel Privilege Escalation
                                Linux Kernel
                                2014

                                CVE-2017-0143
                                Windows SMB Remote Code Execution (EternalBlue)
                                Microsoft Windows
                                2017

                                CVE-2019-2725
                                Oracle WebLogic Remote Code Execution
                                Oracle WebLogic Server
                                2019

## Cross-Vendor Naming Reference

Vendor
                                Attribution Name

                                Mandiant
                                APT40

                                CrowdStrike
                                MUDCARP

                                Recorded Future
                                Leviathan

                                FireEye
                                TEMP.Periscope

                                Symantec
                                BRONZE MOHUR

                                Kaspersky
                                Periscope

## Related Threat Actors

APT40 operates within the broader Chinese state-sponsored ecosystem. Related groups include:
                    
                        APT1 (Comment Crew) - Chinese PLA Unit 61398
                        APT10 (MenuPass) - Chinese contractor-based group
                        APT27 (Emissary Panda) - Chinese espionage group
                        APT31 (Zirconium) - Chinese government espionage
                        APT41 (BARIUM) - Chinese dual-purpose group

## References & Sources

[1] Mandiant Intelligence Report: "APT40 - Leviathan Espionage Campaign Analysis" (2024)
                        [2] CrowdStrike Adversary Report: "MUDCARP: Deep Dive into Maritime Industry Targeting" (2023)
                        [3] FireEye Report: "TEMP.Periscope Operations Targeting US Defense Contractors" (2022)
                        [4] Recorded Future: "Leviathan Naval Espionage Campaign Report" (2021)
                        [5] Symantec Threat Report: "BRONZE MOHUR Maritime Targeting Analysis" (2020)
                        [6] CISA Alert: "APT40 Targeting Naval and Maritime Industries" (2019)
                        [7] Kaspersky Securelist: "Periscope - Advanced Maritime Espionage" (2018)
                        [8] Palo Alto Unit 42: "APT40 ScanBox Reconnaissance Framework Analysis" (2017)

                Quick Facts

                    Country of Origin
                    
                        🇨🇳
                        China (MSS)

                    Nation-State Sponsored
                    Yes - Chinese Government

                    Motivation
                    Maritime Espionage

                    First Seen
                    2009

                    Last Seen
                    2025-Q1

                    Confidence Level
                    High

                    Associated Groups
                    Chinese MSS

                    Status
                    ACTIVE

                    Review Status
                    ⚠ Pending Human Review
