---
name: Sandworm
aliases:
  - "APT44"
  - "IRIDIUM"
  - "ELECTRUM"
  - "Voodoo Bear"
  - "Seashell Blizzard"
affiliation: Russia
motivation: "Sabotage & Espionage"
status: active
reviewStatus: under_review
generatedBy: dangermouse-bot
generatedDate: 2026-04-13
---
## Overview

Sandworm (APT44) is a destructive Russian state-sponsored threat actor attributed to Russia's Main Directorate of the General Staff (GRU) Unit 74455. The group is known for conducting destructive cyberattacks against Ukrainian critical infrastructure and NATO allies, with operations documented since at least 2009. Sandworm combines sophisticated espionage with wiper malware and infrastructure sabotage, representing one of the most aggressive and destructive threat actors globally.

                    The group gained notoriety for their involvement in multiple catastrophic attacks including the 2015 and 2016 Ukraine power grid attacks, the NotPetya ransomware campaign (2017), and ongoing infrastructure attacks during the 2022-2024 Ukraine conflict. Sandworm demonstrates advanced capabilities in network reconnaissance, vulnerability exploitation, and destructive payload delivery, with particular expertise in critical infrastructure targeting.

                    As of 2025, Sandworm continues active operations with focus on Ukraine critical infrastructure, NATO member infrastructure, and Western defense networks. The group's operational doctrine emphasizes rapid escalation from espionage to destructive attacks, making them a critical threat to critical infrastructure globally. Their toolsets and tactics continue to evolve with adoption of new exploitation techniques and destructive mechanisms.

## Tactics, Techniques & Procedures (TTPs)

MITRE ATT&CK Techniques
                        
                            Initial Access:
                            
                                T1190: Exploit Public-Facing Application
                                T1200: Hardware Additions
                                T1566: Phishing
                                T1091: Replication Through Removable Media
                            
                            Execution:
                            
                                T1059: Command and Scripting Interpreter
                                T1203: Exploitation for Client Execution
                                T1072: Software Deployment Tools
                            
                            Persistence:
                            
                                T1547: Boot or Logon Autostart Execution
                                T1547.001: Registry Run Keys
                                T1136: Create Account
                            
                            Defense Evasion:
                            
                                T1197: BITS Jobs
                                T1140: Deobfuscate/Decode Files or Information
                                T1070: Indicator Removal on Host
                            
                            Impact:
                            
                                T1561: Disk Wipe
                                T1529: System Shutdown/Reboot
                                T1486: Data Encrypted for Impact
                                T1565: Data Destruction

                        Common Attack Vectors
                        
                            Critical Infrastructure Targeting: Specialized focus on SCADA, ICS, and operational technology systems in power grids, water treatment, and energy infrastructure.
                            Vulnerability Exploitation: Rapid exploitation of zero-day vulnerabilities in Windows, industrial control systems, and custom software.
                            Supply Chain Attacks: Compromise of software vendors and build systems to distribute malware to thousands of organizations (NotPetya delivery).
                            Physical Access: Use of USB devices and removable media to infiltrate air-gapped networks in critical infrastructure environments.
                            Destructive Payload Deployment: Multi-stage attacks combining reconnaissance and espionage with rapid wiper malware deployment for maximum impact.

                        Tools & Malware
                        
                            NotPetya: Destructive wiper malware designed to appear as ransomware, capable of spreading rapidly across networks with devastating impact.
                            Black Energy: Sophisticated ICS-targeting malware used in 2015 Ukraine power grid attack with custom industrial control system exploitation.
                            VPNFilter: Destructive firmware-level implant targeting network equipment, capable of disrupting entire networks and erasing evidence.
                            Cyclops Blink: Advanced WireGuard-based malware targeting WatchGuard firewalls with destructive and espionage capabilities.
                            INDUSTROYER: Specialized malware targeting IEC 60870-5-104 industrial control systems with direct command injection.
                            Telebots: Remote access trojan framework for network reconnaissance and lateral movement before destructive attacks.
                            Custom Wipers: Multiple proprietary wiper families customized for specific target environments and operational objectives.

                        Infrastructure Patterns
                        
                            Dedicated Russian Infrastructure: Operators maintain command-and-control infrastructure hosted within Russia and Eastern Europe.
                            Compromised Ukrainian Systems: Extensive use of compromised Ukrainian government and private sector systems as staging points.
                            Fast Flux Networks: Rapid rotation of DNS and IP infrastructure to evade tracking and attribution.
                            Tor and VPN Abuse: Use of anonymization services to mask command-and-control communications.
                            Protocol-Level Attacks: Custom protocols and direct ICS protocol exploitation for command and control.

## Targeted Industries & Organizations

Sector
                                Notable Targets / Focus

                                Critical Infrastructure
                                Power grids, water treatment facilities, energy operators, distribution networks (primary target)

                                Defense & Military
                                NATO member militaries, defense contractors, military research institutions, command-and-control systems

                                Government
                                Ukrainian government networks, NATO member governments, US federal agencies

                                Telecommunications
                                Telecom operators, internet service providers, mobile networks

                                Transportation
                                Railway operators, aviation infrastructure, maritime systems

                                Industrial Control Systems
                                Manufacturing, oil and gas, chemical plants, nuclear research

## Attributable Attacks Timeline

2009-2012
                            
                                Early Operations
                                Sandworm begins operational activities targeting Ukrainian and NATO government networks.

                            Dec 2015
                            
                                Ukraine Power Grid Attack
                                Black Energy malware used to disable Ukrainian power grid, cutting power to 225,000 people. First documented destructive attack on critical infrastructure.

                            Dec 2016
                            
                                Second Ukraine Power Grid Attack
                                Sophisticated attack against Ukrainian power infrastructure using INDUSTROYER malware targeting ICS systems.

                            Jun 2017
                            
                                NotPetya Global Wiper Attack
                                Massive destructive campaign using NotPetya wiper disguised as ransomware, affecting over 10,000 organizations globally with $10B+ in damages.

                            May 2018
                            
                                VPNFilter Firmware Attack
                                Destructive firmware implant targeting network equipment, capable of disabling critical router infrastructure across multiple countries.

                            2020-2021
                            
                                Cyclops Blink Operations
                            Advanced WireGuard-based malware targeting WatchGuard firewalls with focus on NATO and critical infrastructure networks.

                            Feb 2022 - Present
                            
                                Ukraine Conflict Operations
                                Escalation of destructive attacks against Ukrainian critical infrastructure, telecommunications, and NATO member infrastructure during active conflict.

## Known Exploits & CVEs

CVE ID
                                Vulnerability
                                Affected Product
                                Year

                                CVE-2015-2360
                                Windows SCADA Vulnerability
                                Microsoft Windows
                                2015

                                CVE-2017-0199
                                Windows HTA/VBScript RCE (NotPetya delivery)
                                Microsoft Office/Windows
                                2017

                                CVE-2018-4878
                                Adobe Flash Remote Code Execution
                                Adobe Flash Player
                                2018

                                CVE-2019-19781
                                Citrix NetScaler Remote Code Execution (Cyclops Blink)
                                Citrix NetScaler
                                2019

                                CVE-2021-44228
                                Apache Log4j Remote Code Execution
                                Apache Log4j
                                2021

## Cross-Vendor Naming Reference

Vendor
                                Attribution Name

                                Microsoft
                                Seashell Blizzard

                                CrowdStrike
                                VOODOO BEAR

                                Mandiant
                                APT44

                                Recorded Future
                                Sandworm

                                ESET
                                Orcknot, Telebots

                                US-CERT
                                GRU Unit 74455

## Related Threat Actors

Sandworm operates within the broader Russian state-sponsored ecosystem. Related groups include:
                    
                        APT29 (Cozy Bear) - Russian SVR espionage group
                        Turla (Snake) - Russian long-term espionage group
                        Fancy Bear (APT28) - Russian GRU espionage group
                        Evil Corp - Russian cybercrime group
                        REvil - Russian ransomware-as-a-service

## References & Sources

[1] NSA/CISA Joint Alert: "Sandworm (GRU Unit 74455) Critical Infrastructure Attacks" (2024)
                        [2] Microsoft Threat Intelligence: "Seashell Blizzard - Ukraine Conflict Operations" (2023)
                        [3] ESET Report: "Telebots - Sandworm Advanced Operations Analysis" (2022)
                        [4] Mandiant Report: "APT44 - Destructive Operations Deep Dive" (2021)
                        [5] Recorded Future: "Sandworm NotPetya Campaign Analysis" (2020)
                        [6] Cisco Talos: "Cyclops Blink Malware Analysis" (2019)
                        [7] Dragos Report: "INDUSTROYER - ICS Attack Framework" (2017)
                        [8] US Department of Justice Indictment: "Russian Military Intelligence Officers - Sandworm Attribution" (2020)

                Quick Facts

                    Country of Origin
                    
                        🇷🇺
                        Russia (GRU)

                    Nation-State Sponsored
                    Yes - GRU Unit 74455

                    Motivation
                    Sabotage & Espionage

                    First Seen
                    2009

                    Last Seen
                    2025-Q1

                    Confidence Level
                    Very High

                    Associated Groups
                    Russian GRU Military

                    Status
                    ACTIVE

                    Review Status
                    ⚠ Pending Human Review
