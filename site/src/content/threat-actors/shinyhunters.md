---
name: ShinyHunters
aliases:
  - "UNC5537"
  - "ShinyCorp"
  - "SLSH Alliance"
affiliation: Criminal
motivation: Financial
status: active
reviewStatus: under_review
generatedBy: dangermouse-bot
generatedDate: 2026-04-13
---
## Overview

ShinyHunters is a prolific financially motivated cybercriminal group active since April 2020, tracked by Mandiant as UNC5537. The group specializes in large-scale data theft and extortion, targeting SaaS platforms, cloud infrastructure, and enterprise applications. ShinyHunters has been responsible for some of the largest data breaches in recent history, including the compromise of over 160 Snowflake customer environments in 2024 and extensive Salesforce-targeting campaigns in 2025.

                    In late 2025, ShinyHunters formed the SLSH Alliance with Scattered Spider and Lapsus$, combining social engineering expertise with credential theft capabilities. The group operates a dedicated data leak site launched in October 2025, where stolen data is published when extortion demands are not met. Their operations leverage voice phishing (vishing), credential stuffing, and exploitation of misconfigured cloud environments — particularly those lacking multi-factor authentication.

                    In February 2026, ShinyHunters compromised Hims & Hers Health through a Zendesk breach via Okta SSO, and breached the European Commission via the Trivy supply chain attack, exfiltrating 350GB of data including signing keys from 71 EU entities. The group has demonstrated an ability to rapidly pivot across cloud platforms and SaaS services, making them one of the most dangerous data theft operations currently active.

## Tactics, Techniques & Procedures (TTPs)

MITRE ATT&CK Techniques
                        
                            Initial Access:
                            
                                T1598: Phishing for Information
                                T1566.004: Spearphishing Voice (Vishing)
                                T1078: Valid Accounts
                                T1190: Exploit Public-Facing Application
                            
                            Credential Access:
                            
                                T1589.001: Gather Victim Identity - Credentials
                                T1589.002: Gather Victim Identity - Email Addresses
                                T1528: Steal Application Access Token
                            
                            Persistence:
                            
                                T1078.004: Valid Accounts - Cloud Accounts
                            
                            Collection & Exfiltration:
                            
                                T1530: Data from Cloud Storage
                                T1567: Exfiltration Over Web Service
                                T1534: Internal Spearphishing

                        Common Attack Vectors
                        
                            Voice Phishing (Vishing): Social engineering attacks impersonating IT helpdesks to trick employees into revealing credentials or approving MFA prompts. Targeted Snowflake and Salesforce customer organizations.
                            Credential Stuffing: Large-scale reuse of stolen credentials from infostealer malware (Aurora Stealer) against cloud platforms lacking MFA enforcement.
                            SSO/OAuth Exploitation: Targeting Okta SSO and OAuth flows to gain access to downstream SaaS applications like Zendesk, Salesforce, and cloud storage.
                            Supply Chain Exploitation: Leveraging third-party compromises (e.g., Trivy supply chain attack) to access enterprise environments.

                        Tools & Malware
                        
                            Aurora Stealer: Golang-based infostealer (MaaS, ~$250/month) used to harvest browser cookies, credentials, and session tokens from victim systems.
                            Custom Data Exfiltration Scripts: Purpose-built tools for bulk extraction of data from Snowflake, Salesforce, and other cloud platforms.
                            Credential Harvesting Infrastructure: Phishing kits and vishing call centers for large-scale credential collection campaigns.
                            Dark Web Leak Site: Dedicated platform for publishing stolen data and managing extortion negotiations.

                        Infrastructure Patterns
                        
                            Dark Web Forums: Active presence on underground marketplaces for data sales and initial access brokerage.
                            Telegram Channels: Communication and coordination via encrypted messaging platforms.
                            Cloud-Based Infrastructure: Use of legitimate cloud services for staging and exfiltration of stolen data.
                            Bulletproof Hosting: Infrastructure hosted on resilient platforms designed to resist takedown efforts.

## Targeted Industries & Organizations

ShinyHunters targets organizations with valuable data stores across cloud and SaaS platforms:

                            SectorNotable Targets / Impact

                            Cloud / SaaS PlatformsSnowflake (160+ customers), Salesforce (39+ organizations), Microsoft 365
                            HealthcareHims & Hers Health (Zendesk breach via Okta SSO)
                            TelecommunicationsAT&T (110M call records via Snowflake)
                            Entertainment / MediaTicketmaster (560M records), Wattpad (270M records)
                            GovernmentEuropean Commission (350GB via Trivy supply chain)
                            Financial ServicesSantander Bank, Neiman Marcus

## Attributable Attacks Timeline

Apr 2020
                            
                                Group Emergence
                                ShinyHunters begins operations with breaches of GitHub, Tokopedia, and multiple other platforms, selling stolen data on dark web forums.

                            2020-2021
                            
                                Mass Breach Campaign
                                Compromises Wattpad (270M records), Pixlr, Pluto TV, AT&T (70M subscribers), establishing reputation as prolific data theft operation.

                            May 2022
                            
                                Key Member Arrested
                                Sébastien Raoult, a French national and alleged ShinyHunters member, arrested in Morocco and later extradited to the United States.

                            2024
                            
                                Snowflake Campaign
                                Massive campaign compromising 160+ Snowflake customer environments including AT&T (110M records), Ticketmaster (560M), Santander. Exploited missing MFA on cloud accounts. Leak Site Operations →

                            2025
                            
                                Salesforce & Alliance Formation
                                Launches vishing campaigns against 39+ Salesforce organizations. Forms SLSH Alliance with Scattered Spider and Lapsus$. Launches dedicated data leak site in October.

                            Feb 2026
                            
                                Hims & Hers Breach
                                Compromises Hims & Hers Health through Zendesk breach via Okta SSO voice phishing. Full Report →

                            Apr 2026
                            
                                EU Commission Breach
                                Exfiltrates 350GB from 71 EU entities via Trivy supply chain compromise. Full Report →

## Known Exploits & CVEs

CVE
                                Vulnerability
                                Affected Product
                                CVSS

                                CVE-2021-35587
                                Oracle Access Manager Authentication Bypass
                                Oracle Access Manager
                                9.8

                                CVE-2025-31324
                                SAP NetWeaver Remote Code Execution
                                SAP NetWeaver
                                9.8

## Cross-Vendor Naming Reference

Vendor / Organization
                                Name Used

                                Mandiant / Google
                                UNC5537

                                Microsoft Threat Intelligence
                                ShinyHunters

                                CrowdStrike
                                ShinyHunters

                                EclecticIQ
                                ShinyHunters

                                Intel 471
                                ShinyHunters

## Related Threat Actors

Scattered Spider: Alliance partner in the SLSH (Scattered Lapsus$ ShinyHunters) coalition formed in late 2025. Shares social engineering TTPs and target overlap in SaaS platforms.
                        Lapsus$: Third member of the SLSH Alliance. Known for extortion campaigns against major technology companies.
                        UNC1069: North Korean threat actor whose Axios npm compromise intersected with ShinyHunters operations via shared supply chain vectors.

## References & Sources

[1]
                            EclecticIQ: ShinyHunters Financially Motivated Data Extortion Group
                            EclecticIQ Research

                            [2]
                            Intel 471: ShinyHunters MITRE ATT&CK Analysis
                            Intel 471 Blog

                            [3]
                            Obsidian Security: ShinyHunters and Scattered Spider Salesforce Attacks
                            Obsidian Security

                            [4]
                            BleepingComputer: Hims and Hers Zendesk Breach
                            BleepingComputer

                            [5]
                            CISA Advisory: Snowflake Customer Breaches
                            CISA Alerts

                Quick Facts

                    Country of Origin
                    
                        🌐
                        International (Eastern Europe / Asia)

                    Nation-State Sponsored
                    No — Criminal Enterprise

                    Motivation
                    Financial (Data Theft & Extortion)

                    First Seen
                    April 2020

                    Last Seen
                    2026-Q2

                    Confidence Level
                    High

                    Associated Groups
                    UNC5537, ShinyCorp, SLSH Alliance

                    Status
                    ACTIVE

                    Review Status
                    ⚠ Pending Human Review
