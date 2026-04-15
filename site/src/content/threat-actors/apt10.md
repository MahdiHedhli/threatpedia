---
name: APT10
aliases:
  - "Stone Panda"
  - "MenuPass"
  - "POTASSIUM"
affiliation: China
motivation: Espionage
status: active
reviewStatus: under_review
generatedBy: dangermouse-bot
generatedDate: 2026-04-13
---
## Overview

APT10 (also known as Stone Panda, MenuPass, or POTASSIUM) is a Chinese state-sponsored advanced persistent threat group attributed to China's Ministry of State Security (MSS). Operating since at least 2009, APT10 is one of the most prolific and active Chinese APT groups, conducting widespread espionage campaigns targeting government agencies, managed service providers (MSPs), technology companies, and multinational corporations across global markets. The group gained significant notoriety through the "Cloud Hopper" campaign, which compromised managed service providers to gain indirect access to hundreds of downstream client organizations.

                    APT10 is distinguished by their operational scale, targeting breadth, and strategic focus on supply chain compromise and managed service provider exploitation. The group demonstrates sophisticated technical capabilities, including custom malware development, command-and-control infrastructure sophistication, and ability to maintain persistence across complex network environments. APT10's campaigns have affected government organizations in dozens of countries and Fortune 500 companies across energy, aerospace, technology, finance, and healthcare sectors.

                    As of 2025, APT10 continues active espionage operations with refined tactical approaches and expanded targeting against cloud service providers and modern IT infrastructure. The group's operational focus has evolved to include cloud-native targeting, SaaS platform compromise, and supply chain leverage for large-scale intelligence collection supporting Chinese state interests.

## Tactics, Techniques & Procedures (TTPs)

MITRE ATT&CK Techniques
                        
                            Initial Access:
                            
                                T1566: Phishing
                                T1199: Trusted Relationship
                                T1190: Exploit Public-Facing Application
                                T1195.002: Supply Chain Compromise
                            
                            Execution & Persistence:
                            
                                T1059.001: PowerShell
                                T1059.003: Windows Command Shell
                                T1547.001: Registry Run Keys
                                T1547.008: LSASS Driver
                            
                            Lateral Movement & Defense Evasion:
                            
                                T1570: Lateral Tool Transfer
                                T1021: Remote Services
                                T1036: Masquerading
                                T1140: Deobfuscate/Decode
                            
                            Exfiltration:
                            
                                T1041: Exfiltration Over C2 Channel
                                T1020: Automated Exfiltration

                        Common Attack Vectors
                        
                            Managed Service Provider (MSP) Targeting: Compromise of MSP infrastructure and admin credentials to pivot to hundreds of downstream client organizations (Cloud Hopper campaign model).
                            Spear-Phishing with Weaponized Attachments: Highly targeted spear-phishing emails to technical staff at organizations, with attachments containing exploit code or malware.
                            Web Application Exploitation: Exploitation of known and zero-day vulnerabilities in web applications, remote access services, and infrastructure management tools.
                            Credential Harvesting: Collection of credentials through phishing, credential stuffing, and password spraying to gain initial access and facilitate lateral movement.
                            Living-off-the-Land Techniques: Extensive use of legitimate administrative tools (PowerShell, RDP, PsExec, WMI) to minimize malware footprint and avoid detection.

                        Tools & Malware
                        
                            POISONPLUG Malware: Custom backdoor used for remote command execution and system access in victim environments.
                            UPPERCUT Backdoor: Advanced multi-stage backdoor providing persistent access and lateral movement capabilities.
                            Quasar RAT: Open-source remote access trojan modified and deployed by APT10 for command execution and data exfiltration.
                            Cobalt Strike: Legitimate penetration testing framework weaponized for command execution and lateral movement post-compromise.
                            Custom Encoding Tools: Proprietary tools for encoding/obfuscating communications and evading network-based detection systems.
                            Droppers & Loaders: Multi-stage delivery mechanisms designed to bypass endpoint security controls and deploy second-stage payloads.

                        Infrastructure Patterns
                        
                            Compromised Infrastructure Reuse: Leveraging of previously compromised servers and hosting accounts for command-and-control communications.
                            Domain Hosting via China-based Registrars: Registration of C2 domains through Chinese registrars with minimal abuse response requirements.
                            Bulletproof Hosting: Use of bulletproof hosting providers to maintain infrastructure resilience and evade takedown efforts.
                            Dynamic DNS & Fast Flux: Rapid IP rotation and dynamic DNS to evade network-based blocking and signature detection.
                            Legitimate Service Abuse: Abuse of legitimate cloud services and content delivery networks (CDNs) for C2 communications.

## Targeted Industries & Organizations

APT10 targets a diverse range of global organizations with strategic focus on supply chain and MSP leverage:

                                Sector
                                Notable Targets

                                Managed Service Providers (MSPs)
                                Cloud Hopper campaign targeting major MSPs and IT service providers worldwide. Downstream impact affecting 100+ client organizations per MSP.

                                Government & Defense
                                US federal agencies, Department of Defense contractors, military research institutions, allied government organizations

                                Aerospace & Energy
                                Aerospace contractors, energy companies, infrastructure operators, nuclear facility operators

                                Technology
                                Software vendors, semiconductor companies, cloud service providers, IT infrastructure vendors

                                Finance & Banking
                                Financial institutions, investment firms, banking infrastructure operators

                                Healthcare & Pharmaceuticals
                                Healthcare providers, pharmaceutical manufacturers, medical research institutions

                    Geographic Scope: Global with particular focus on USA, Europe, Japan, South Korea, India, and Australia. Targets multinational organizations with presence across multiple continents for diversified intelligence collection.

## Attributable Attacks Timeline

2009-2012
                            
                                Early Operations - Infrastructure Targeting
                                APT10 (Stone Panda/MenuPass) initiates espionage operations targeting Japanese and US organizations. Focuses on government and aerospace sectors with custom malware deployment.

                            2013-2016
                            
                                Global Expansion & MSP Targeting
                                APT10 expands operations globally, beginning targeted compromise of managed service providers. Identifies MSP supply chain model as effective leverage for multi-organization access.

                            Oct 2017 - Mar 2018
                            
                                Operation Cloud Hopper - MSP Mega Breach
                                APT10 launches "Operation Cloud Hopper" - coordinated compromise of multiple global managed service providers. Affects 100+ MSP client organizations in 41 countries. Targets include government agencies, Fortune 500 companies, technology firms. Estimated impact on thousands of downstream organizations.

                            2018-2019
                            
                                Post-Attribution Adaptation
                            Following public Cloud Hopper attribution, APT10 refines tactics and infrastructure. Operations continue with evolved malware families and enhanced operational security practices.

                            2019-2021
                            
                                Cloud-Native & SaaS Targeting
                                APT10 pivots to target cloud-native applications and SaaS platforms. Expands focus to include Office 365, Azure, and other cloud infrastructure commonly used by target organizations.

                            2021-2023
                            
                                Zero-Day Exploitation & Advanced Persistence
                                APT10 exploits multiple zero-days in enterprise applications and develops advanced persistence mechanisms. Shifts to exploiting supply chain vulnerabilities in software development tools.

                            2023-2025
                            
                                Modern Cloud Infrastructure Campaigns
                            APT10 continues active espionage against government and enterprise targets with focus on cloud infrastructure, identity and access management systems, and modern DevOps environments.

## Known Exploits & CVEs

APT10 has exploited numerous known and zero-day vulnerabilities across enterprise platforms:

                                CVE
                                Vulnerability
                                Affected Product
                                CVSS

                                CVE-2017-9822
                                Remote Code Execution - Jira
                                Atlassian Jira (versions 6.4-7.6)
                                9.8

                                CVE-2018-15473
                                OpenSSH User Enumeration
                                OpenSSH (7.4p1 through 7.8p1)
                                5.3

                                CVE-2017-10271
                                Remote Code Execution - Oracle WebLogic
                                Oracle WebLogic Server (multiple versions)
                                9.8

                                CVE-2019-2725
                                Remote Code Execution - Oracle WebLogic
                                Oracle WebLogic Server 10.3.6 - 12.2.1
                                9.8

                                CVE-2021-1732
                                Privilege Escalation - Windows Win32k
                                Microsoft Windows (multiple versions)
                                7.8

                                CVE-2021-28476
                                Authentication Bypass - Fortinet FortiOS
                                Fortinet FortiGate Firewall
                                9.8

## Cross-Vendor Naming Reference

APT10 is tracked under multiple designations across the threat intelligence community:

                                Vendor / Organization
                                Name Used

                                Mandiant / Google
                                APT10

                                CrowdStrike
                                Stone Panda

                                Recorded Future
                                MenuPass

                                Microsoft
                                POTASSIUM

                                Symantec
                                Passerby

                                MITRE ATT&CK
                                Group G0045

                                FireEye
                                APT10 / Cloud Hopper

                                Palo Alto Networks
                                APT10 / Stone Panda

## Related Threat Actors

APT1 (Comment Crew): Fellow Chinese-attributed APT group operating with similar strategic objectives targeting defense industrial base and government sectors, though with distinct operational patterns and tool preferences.
                        APT27 (Emissary Panda): Chinese-attributed APT group conducting parallel espionage operations. Some tactical overlap in targeting but different organizational focus and specialization areas.
                        APT41: Chinese-attributed group conducting both state-sponsored espionage and financially motivated operations. May coordinate with APT10 on select campaigns.

## References & Sources

[1]
                            FireEye: APT10 (Cloud Hopper) Campaign Analysis

                            [2]
                            Mandiant: APT10 Operations Targeting Cloud Infrastructure

                            [3]
                            MITRE ATT&CK: APT10 (Group G0045)

                            [4]
                            CrowdStrike: Stone Panda MSP Targeting Analysis

                            [5]
                            Recorded Future: MenuPass (APT10) Ongoing Operations

                            [6]
                            NCSC/NSA Joint Alert: APT10 Cloud Hopper Campaign

                            [7]
                            Microsoft Security Blog: POTASSIUM (APT10) Campaign Deep Dive

                            [8]
                            Symantec: Passerby (APT10) Threat Intelligence Report

                Quick Facts

                    Country of Origin
                    
                        🇨🇳
                        China (MSS)

                    Nation-State Sponsored
                    Yes

                    Motivation
                    Espionage

                    First Seen
                    2009

                    Last Seen
                    2025 (Active)

                    Confidence Level
                    Very High

                    Associated Groups
                    China MSS

                    Review Status
                    ⚠ Pending Human Review
