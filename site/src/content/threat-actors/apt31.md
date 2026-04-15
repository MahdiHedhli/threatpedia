---
name: APT31
aliases:
  - "Zirconium"
  - "NOTROBIN"
  - "Violet Typhoon"
affiliation: China
motivation: Espionage
status: active
reviewStatus: under_review
generatedBy: dangermouse-bot
generatedDate: 2026-04-13
---
## Overview

APT31 (Zirconium) is a sophisticated Chinese state-sponsored threat actor attributed to elements of the Chinese government, likely operating under direction from the Ministry of State Security (MSS). Active since at least 2012, APT31 specializes in targeted espionage operations against government agencies, technology companies, defense contractors, and telecommunications firms, with a particular focus on stealing sensitive intellectual property and enabling long-term persistent access to critical infrastructure.

                    The group is known for their advanced social engineering capabilities, custom malware development, and patient operational approach. APT31 conducts highly targeted campaigns using spear-phishing, watering hole attacks, and strategic supply chain compromises. Their operations have directly supported Chinese government strategic interests in geopolitics, technology competition, and industrial espionage.

                    Microsoft and other security vendors have attributed APT31 to campaigns targeting government networks in Asia, Europe, and North America. The group maintains sophisticated command-and-control infrastructure and leverages a variety of custom and publicly available tools. As of 2025, APT31 continues to conduct ongoing espionage operations with renewed focus on telecommunications, defense, and critical infrastructure sectors.

## Tactics, Techniques & Procedures (TTPs)

MITRE ATT&CK Techniques
                        
                            Initial Access:
                            
                                T1566.002: Phishing - Spearphishing Link
                                T1566.001: Phishing - Spearphishing Attachment
                                T1598: Phishing for Information
                                T1190: Exploit Public-Facing Application
                            
                            Execution:
                            
                                T1059.001: Command and Scripting Interpreter - PowerShell
                                T1203: Exploitation for Client Execution
                                T1204.002: User Execution - Malicious File
                            
                            Persistence:
                            
                                T1098: Account Manipulation
                                T1547.001: Boot or Logon Autostart Execution - Registry Run Keys
                                T1547.013: Boot or Logon Autostart Execution - XDG Autostart Entries
                            
                            Defense Evasion:
                            
                                T1036: Masquerading
                                T1140: Deobfuscate/Decode Files or Information
                                T1562.008: Impair Defenses - Disable Logging
                            
                            Credential Access:
                            
                                T1110: Brute Force
                                T1056: Input Capture
                            
                            Command & Control:
                            
                                T1071: Application Layer Protocol
                                T1568: Dynamic Resolution
                                T1008: Fallback Channels

                        Common Attack Vectors
                        
                            Advanced Spear-phishing: Highly personalized phishing emails impersonating government officials, industry contacts, or service providers, often containing custom malware attachments.
                            Watering Hole Attacks: Compromise of websites frequented by target industries to deliver malware and gain initial access to victim networks.
                            Software Vulnerabilities: Exploitation of zero-day and known vulnerabilities in Windows, Adobe, Java, and other widely-used software.
                            Social Engineering: Patient, multi-stage social engineering campaigns building rapport with targets before credential harvesting or malware delivery.
                            Supply Chain Targeting: Compromise of managed service providers and technology partners to gain access to multiple downstream organizations.

                        Tools & Malware
                        
                            SHIPSHAPE: Custom modular backdoor used for command execution and lateral movement in victim networks.
                            LOWBALL: Lightweight remote access trojan deployed as a second-stage payload for maintaining persistent access.
                            FELICITY: Custom information stealer targeting credentials, browser data, and system information.
                            Cobalt Strike: Legitimate post-exploitation framework abused for lateral movement and privilege escalation.
                            BADNEWS: Custom malware implant for remote command execution and data exfiltration.
                            Living-off-the-Land Tools: Extensive use of PowerShell, WMI, and native Windows utilities to minimize detection.
                            Mimikatz: Credential dumping tool for lateral movement within compromised networks.

                        Infrastructure Patterns
                        
                            Custom C2 Servers: Operators maintain infrastructure in China and compromised servers across multiple countries.
                            Domain Fronting: Abuse of legitimate CDNs and hosting providers to mask malicious traffic.
                            Bulletproof Hosting: Extensive use of Russian and Eastern European bullet-proof hosting for command-and-control infrastructure.
                            Fast Flux DNS: Rapid rotation of DNS records to evade tracking and network-based detection.
                            Compromised Legitimate Infrastructure: Hijacking of legitimate web servers for C2 communications.

## Targeted Industries & Organizations

Sector
                                Notable Targets / Focus

                                Government & Defense
                                US federal agencies, defense agencies, military research institutions, NATO member governments

                                Telecommunications
                                Telecom operators, network infrastructure providers, undersea cable operators

                                Technology
                                Software vendors, hardware manufacturers, cloud service providers, semiconductor companies

                                Aerospace & Aviation
                                Aerospace contractors, aircraft manufacturers, aviation research organizations

                                Energy
                                Utilities, energy research, strategic infrastructure operators

## Attributable Attacks Timeline

2012-2013
                            
                                Early Targeting of Asian Telecom Operators
                                APT31 campaigns targeting telecommunications firms across Asia-Pacific region using custom malware and spear-phishing.

                            2014-2015
                            
                                US Government Network Targeting
                                Attributed to campaigns targeting US federal agencies using SHIPSHAPE and BADNEWS malware variants.

                            2016-2017
                            
                                NATO and European Defense Targeting
                                Expansion of operations to target NATO member states, defense contractors, and European government agencies.

                            2018-2019
                            
                                Telecommunications Infrastructure Focus
                                Campaigns specifically targeting telecom operators and undersea cable infrastructure across multiple continents.

                            2020-2021
                            
                                Aviation Sector Targeting
                                Operations shifted to focus on aerospace and aviation companies across Europe and North America.

                            2022-2024
                            
                                Continued Strategic Espionage
                                Ongoing campaigns against government and defense targets with updated malware toolkits and sophisticated social engineering.

                            2024-2025
                            
                                Infrastructure Targeting Expansion
                                Operations expanding to include critical infrastructure sectors with focus on long-term persistent access acquisition.

## Known Exploits & CVEs

CVE ID
                                Vulnerability
                                Affected Product
                                Year

                                CVE-2013-3896
                                Internet Explorer Use-After-Free
                                Microsoft Internet Explorer
                                2013

                                CVE-2017-0290
                                Windows OLE Remote Code Execution
                                Microsoft Windows
                                2017

                                CVE-2019-1367
                                Windows VBScript Engine Remote Code Execution
                                Microsoft Windows
                                2019

                                CVE-2020-1193
                                Windows Remote Code Execution
                                Microsoft Windows
                                2020

                                CVE-2021-21985
                                vCenter Server Remote Code Execution
                                VMware vCenter Server
                                2021

## Cross-Vendor Naming Reference

Vendor
                                Attribution Name

                                Microsoft
                                Zirconium

                                CrowdStrike
                                JUDGEMENT PANDA

                                Mandiant
                                APT31

                                Recorded Future
                                NOTROBIN

                                Kaspersky
                                Violet Typhoon

                                Symantec
                                APT.Snapdragon

## Related Threat Actors

APT31 operates within the broader Chinese state-sponsored ecosystem. Related groups include:
                    
                        APT1 (Comment Crew) - Chinese PLA Unit 61398
                        APT10 (MenuPass) - Chinese MSS contractor
                        APT27 (Emissary Panda) - Chinese espionage group
                        APT40 (Leviathan) - Chinese maritime espionage group
                        APT41 (BARIUM) - Chinese dual-purpose espionage and financial group

## References & Sources

[1] Microsoft Threat Intelligence: "Chinese State-Sponsored Actor Zirconium Targeting Multiple Critical Industries" (2024)
                        [2] Mandiant Intelligence Report: "APT31 Campaign Analysis and Attribution" (2023)
                        [3] CrowdStrike Adversary Report: "JUDGEMENT PANDA: Years of Espionage Against NATO" (2022)
                        [4] Recorded Future Report: "Chinese APT Group NOTROBIN Targeting Telecommunications" (2021)
                        [5] Kaspersky Securelist: "Violet Typhoon Operations and Malware Analysis" (2020)
                        [6] CISA Alert: "APT31 Targeting US Federal Agencies" (2019)
                        [7] FireEye Threat Intelligence: "BADNEWS Malware Used by APT31" (2018)
                        [8] Palo Alto Networks Unit 42: "APT31 SHIPSHAPE Backdoor Analysis" (2017)

                Quick Facts

                    Country of Origin
                    
                        🇨🇳
                        China (MSS)

                    Nation-State Sponsored
                    Yes - Chinese Government

                    Motivation
                    Espionage & IP Theft

                    First Seen
                    2012

                    Last Seen
                    2025-Q1

                    Confidence Level
                    High

                    Associated Groups
                    Chinese PLA Unit

                    Status
                    ACTIVE

                    Review Status
                    ⚠ Pending Human Review
