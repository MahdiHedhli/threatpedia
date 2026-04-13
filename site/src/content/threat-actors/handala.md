---
name: Handala
aliases:
  - "Void Manticore"
  - "Storm-0842"
  - "Banished Kitten"
  - "Homeland Justice"
  - "Karma"
affiliation: Iran
motivation: Hacktivism / Destructive
status: active
reviewStatus: under_review
generatedBy: dangermouse-bot
generatedDate: 2026-04-13
---
## Overview

Handala is an Iran-linked hacktivist and destructive cyber operations group attributed to Void Manticore, an operational unit within Iran's Ministry of Intelligence and Security (MOIS). Microsoft tracks the underlying APT as Storm-0842. The group debuted its public persona in December 2023 and has since conducted over 85 claimed attacks, primarily targeting Israeli infrastructure, with expansion to US, Albanian, Jordanian, and Gulf State targets.

                    Handala is distinguished by its shift from traditional espionage to destructive operations, deploying custom wiper malware and abusing legitimate device management platforms for mass-scale attacks. In March 2026, the group executed its most significant operation — a wiper attack against Stryker Corporation that destroyed over 200,000 medical devices across 79 countries by weaponizing Microsoft Intune remote wipe capabilities. The attack was claimed as retaliation for a February 28 missile strike on an Iranian school that killed 175+ people.

                    The group was supervised by Seyed Yahya Hosseini Panjaki, who was killed in early March 2026. Despite this leadership disruption and FBI domain seizures on March 19, 2026, Handala continues operations, demonstrating MOIS institutional resilience. The group represents a significant escalation in Iran's cyber warfare capabilities, particularly the weaponization of enterprise management tools against civilian infrastructure.

## Tactics, Techniques & Procedures (TTPs)

MITRE ATT&CK Techniques
                        
                            Initial Access:
                            
                                T1566: Phishing
                                T1078: Valid Accounts
                                T1110: Brute Force
                            
                            Privilege Escalation:
                            
                                T1078: Valid Accounts (Compromised Admin Credentials)
                                T1098: Account Manipulation
                            
                            Defense Evasion:
                            
                                T1562: Impair Defenses
                                T1036: Masquerading (Hamsa wiper as system updates)
                            
                            Lateral Movement:
                            
                                T1021.001: Remote Desktop Protocol
                                T1572: Protocol Tunneling
                            
                            Impact:
                            
                                T1485: Data Destruction
                                T1561: Disk Wipe (MBR Overwrite)
                                T1529: System Shutdown/Reboot

                        Common Attack Vectors
                        
                            Device Management Platform Abuse: Compromised Microsoft 365 Global Admin accounts to weaponize Microsoft Intune for mass remote wipe operations across enterprise device fleets.
                            Credential Compromise: Brute force and credential reuse attacks targeting administrative accounts, particularly Global Admin roles in cloud environments.
                            Spear-Phishing: Targeted phishing campaigns against organizations in Israel, the US, and allied nations.
                            Supply Chain Targeting: Attacking managed service providers and contractors to reach downstream victims.

                        Tools & Malware
                        
                            Handala Wiper: Windows-based destructive malware that overwrites the Master Boot Record (MBR) and performs systematic file deletion to render systems unrecoverable.
                            Hamsa Wiper: Linux-focused wiper that masquerades as legitimate system updates with delayed execution to maximize impact before detection.
                            Microsoft Intune Weaponization: Abuse of legitimate enterprise device management to execute remote wipe commands at scale — the primary attack vector in the Stryker incident.
                            Basic Tunneling Tools: Standard tunneling and proxy tools for maintaining access and evading network monitoring.

                        Infrastructure Patterns
                        
                            Compromised Cloud Infrastructure: Abuse of legitimate Microsoft 365 and Azure AD environments for attack staging and execution.
                            Hacktivist Communication Channels: Public Telegram channels and social media for claiming operations and publishing stolen data.
                            Domains Seized by FBI: Multiple command-and-control domains were seized by the FBI on March 19, 2026, though the group has demonstrated ability to reconstitute infrastructure.

## Targeted Industries & Organizations

Handala primarily targets Israeli and Western organizations, with a focus on critical infrastructure and high-visibility targets:

                            SectorNotable Targets / Impact

                            Healthcare / Medical DevicesStryker Corporation — 200,000+ devices wiped across 79 countries, Lifenet ECG systems offline, surgical supply ordering disrupted. Full Report →
                            Defense / MilitaryIsraeli Defense Forces (IDF) — member data breach (March 2026), defense contractor targeting
                            GovernmentIsraeli government agencies, Albanian government (Homeland Justice persona)
                            Energy / Oil & GasEnergy infrastructure targeting in Israel and Gulf States
                            TelecommunicationsIsraeli telecom providers and IT services companies
                            TransportationAirlines, maritime, and transportation infrastructure

## Attributable Attacks Timeline

2022+
                            
                                Void Manticore Operations Begin
                                Iran MOIS cyber operations unit begins destructive campaigns under various personas, including Homeland Justice (targeting Albania).

                            Dec 2023
                            
                                Handala Persona Debuts
                                Public hacktivist persona launched, claiming pro-Palestinian motivation. Begins systematic targeting of Israeli organizations.

                            2024-2025
                            
                                Sustained Campaign
                                Over 85 claimed attacks against Israeli and Western targets, including defense contractors, government agencies, and critical infrastructure.

                            Mar 6, 2026
                            
                                IDF Data Breach
                                Claims breach of Israeli Defense Forces member data, publishing personal information of military personnel.

                            Mar 11, 2026
                            
                                Stryker Medical Device Wiper Attack
                                Executes mass wiper attack via compromised Microsoft Intune, destroying 200,000+ Stryker devices across 79 countries. Claimed as retaliation for Feb 28 missile strike. Full Report →

                            Mar 19, 2026
                            
                                FBI Domain Seizures
                                FBI seizes multiple Handala-associated command-and-control domains. Group reconstitutes infrastructure and continues operations.

## Known Exploits & CVEs

Handala primarily leverages compromised credentials and legitimate platform abuse rather than software vulnerability exploitation. Their most devastating attack (Stryker) used compromised Microsoft 365 Global Admin credentials to weaponize Microsoft Intune — no CVE exploitation was required.

## Cross-Vendor Naming Reference

Vendor / Organization
                                Name Used

                                Microsoft Threat Intelligence
                                Storm-0842

                                Check Point Research
                                Void Manticore / Handala

                                Palo Alto Unit 42
                                Handala

                                CrowdStrike
                                Banished Kitten

                                Fortinet FortiGuard
                                Handala

                                FBI / US Government
                                Handala

## Related Threat Actors

Void Manticore: The parent APT designation for the MOIS unit operating the Handala persona. Conducts both espionage and destructive operations.
                        Homeland Justice: Earlier persona used by the same MOIS unit for attacks against Albanian government infrastructure.
                        Karma: Additional hacktivist persona attributed to the same operational group.
                        Sandworm: Russian GRU unit with similar destructive cyber operations doctrine, though no direct collaboration is assessed.

## References & Sources

[1]
                            Check Point Research: Handala Hack — Unveiling the Group's Modus Operandi
                            Check Point Research

                            [2]
                            Palo Alto Unit 42: Iranian Cyberattacks 2026
                            Unit 42

                            [3]
                            Vectra AI: What the Stryker Incident Reveals About Handala's Attack Playbook
                            Vectra AI

                            [4]
                            SecurityWeek: MedTech Giant Stryker Crippled by Iran-Linked Hacker Attack
                            SecurityWeek

                            [5]
                            Fortinet FortiGuard: Handala Threat Actor Profile
                            FortiGuard Labs

                Quick Facts

                    Country of Origin
                    
                        🇮🇷
                        Iran

                    Nation-State Sponsored
                    Yes — Ministry of Intelligence and Security (MOIS)

                    Motivation
                    Hacktivism / Destructive Operations

                    First Seen
                    December 2023

                    Last Seen
                    2026-Q1

                    Confidence Level
                    High

                    Associated Groups
                    Void Manticore, Storm-0842, Banished Kitten

                    Status
                    ACTIVE

                    Review Status
                    ⚠ Pending Human Review
