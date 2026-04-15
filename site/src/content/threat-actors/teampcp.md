---
name: TeamPCP
aliases:
  - "UNC6780"
  - "DeadCatx3"
  - "PCPcat"
  - "ShellForce"
affiliation: Criminal
motivation: Financial
status: active
reviewStatus: under_review
generatedBy: dangermouse-bot
generatedDate: 2026-04-13
---
## Overview

TeamPCP is a financially motivated cybercriminal group tracked by Mandiant as UNC6780, also known as DeadCatx3, PCPcat, and ShellForce. First observed in September 2025 with cryptocurrency theft and ransomware operations, the group pivoted to large-scale supply chain attacks in early 2026, executing one of the most significant cascading compromises in recent history.

                    In March 2026, TeamPCP launched a cascading supply chain campaign targeting Aqua Security's Trivy vulnerability scanner, Checkmarx KICS, LiteLLM, and Telnyx SDK. The group exploited a GitHub Actions PAT compromise (CVE-2026-33634) to inject malicious code into trusted security tools, then deployed CanisterWorm — a self-propagating worm using Internet Computer (ICP) canisters for decentralized command-and-control. The campaign compromised an estimated 500,000+ machines and harvested 300GB+ of credentials.

                    The downstream impact was massive: the European Commission suffered a 340GB breach affecting 71 EU entities, Cisco development environments were compromised, and the attack propagated through 141 malicious artifacts across 66+ npm packages. In late March 2026, TeamPCP announced a formal partnership with the Vect ransomware group for credential-based initial access operations, signaling continued escalation.

## Tactics, Techniques & Procedures (TTPs)

MITRE ATT&CK Techniques
                        
                            Initial Access:
                            
                                T1195.002: Supply Chain Compromise - Software Supply Chain
                                T1190: Exploit Public-Facing Application
                                T1133: External Remote Services
                            
                            Execution:
                            
                                T1059.004: Unix Shell
                                T1053.003: Cron/Scheduled Task
                                T1204: User Execution (via compromised packages)
                            
                            Persistence:
                            
                                T1547: Boot or Logon Autostart Execution
                                T1543: Create or Modify System Process
                            
                            Credential Access:
                            
                                T1552.001: Credentials in Files (SSH keys, cloud tokens)
                                T1555: Credentials from Password Stores
                            
                            Lateral Movement:
                            
                                T1210: Exploitation of Remote Services (Docker APIs, K8s)
                                T1021.004: SSH
                            
                            Command & Control:
                            
                                Custom: Decentralized C2 via Internet Computer (ICP) Canisters

                        Common Attack Vectors
                        
                            CI/CD Pipeline Compromise: Theft of GitHub Actions Personal Access Tokens (PATs) to inject malicious code into trusted open-source security tools during build processes.
                            Package Repository Poisoning: Publication of 141 malicious artifacts across 66+ npm packages, exploiting developer trust in popular package ecosystems.
                            Exposed Service Exploitation: Automated scanning for weakly-secured Docker APIs, Kubernetes control planes, and other externally accessible development services.
                            Credential Harvesting at Scale: CanisterWorm harvests SSH keys, cloud credentials, database passwords, Kubernetes tokens, and Docker configs from compromised systems.

                        Tools & Malware
                        
                            CanisterWorm: Self-propagating worm that uses Internet Computer (ICP) canisters for decentralized C2 communication, making takedown extremely difficult. Harvests credentials across cloud, container, and development environments.
                            Credential Infostealer Modules: Custom modules targeting SSH keys, AWS/GCP/Azure credentials, database connection strings, and CI/CD tokens.
                            Cloud Lateral Movement Toolkit: Purpose-built tools for moving between cloud environments using harvested credentials.

                        Infrastructure Patterns
                        
                            Internet Computer (ICP) Canisters: Decentralized C2 infrastructure leveraging blockchain-based compute to resist takedown and attribution.
                            Compromised CI/CD Pipelines: Abuse of GitHub Actions, PyPI, and npm infrastructure for malware distribution.
                            Automated Scanning Infrastructure: Large-scale scanning for exposed Docker APIs, Kubernetes clusters, and development services.

## Targeted Industries & Organizations

TeamPCP targets the software supply chain and cloud-native infrastructure:

                            SectorNotable Targets / Impact

                            Security Tools / DevOpsAqua Security Trivy, Checkmarx KICS — compromised via GitHub Actions PAT theft. Full Report →
                            AI / ML PlatformsLiteLLM AI proxy — PyPI package compromised for credential harvesting
                            TelecommunicationsTelnyx SDK — compromised for credential theft and downstream access
                            GovernmentEuropean Commission — 340GB stolen from 71 EU entities via Trivy supply chain. Full Report →
                            TechnologyCisco development environments — breached via Trivy supply chain compromise
                            npm Ecosystem66+ npm packages poisoned with 141 malicious artifacts

## Attributable Attacks Timeline

Sep 2025
                            
                                Initial Activity
                                TeamPCP begins operations with cryptocurrency theft and ransomware attacks, establishing financial motivation and technical capabilities.

                            Feb 2026
                            
                                Trivy GitHub Actions Compromise
                                Compromises Aqua Security Trivy via stolen GitHub Actions PAT, injecting malicious code into the trusted vulnerability scanner. CVE-2026-33634 assigned. CVE Report →

                            Mar 19, 2026
                            
                                Aqua-bot Service Account Breach
                                Breaches the Aqua-bot service account used for automated Trivy builds, expanding supply chain access.

                            Mar 27, 2026
                            
                                LiteLLM & Telnyx Compromises
                                Extends supply chain campaign to LiteLLM AI proxy (PyPI) and Telnyx SDK, deploying CanisterWorm for credential harvesting.

                            Mar 30, 2026
                            
                                Vect Ransomware Partnership
                                Announces formal partnership with Vect ransomware group for credential-based initial access operations.

                            Apr 2-3, 2026
                            
                                EU Commission Breach Confirmed
                                CERT-EU confirms European Commission breach — 340GB stolen from 71 entities, including signing keys. Full Report →

## Known Exploits & CVEs

CVE
                                Vulnerability
                                Affected Product
                                CVSS

                                CVE-2026-33634
                                GitHub Actions Misconfiguration in Aqua Security Trivy
                                Aqua Security Trivy
                                9.4

## Cross-Vendor Naming Reference

Vendor / Organization
                                Name Used

                                Mandiant / Google
                                UNC6780

                                Palo Alto Unit 42
                                TeamPCP

                                Datadog Security Labs
                                TeamPCP

                                SANS Institute
                                TeamPCP / DeadCatx3

                                Cloud Security Alliance
                                TeamPCP

                                Endor Labs
                                TeamPCP

## Related Threat Actors

Vect Ransomware Group: Formal partnership announced March 30, 2026 for credential-based initial access operations. TeamPCP provides initial compromise, Vect deploys ransomware.
                        CipherForce: Allied group participating in joint operations with TeamPCP for credential harvesting and monetization.
                        UNC1069: North Korean threat actor whose Axios npm compromise leveraged similar supply chain vectors. Related Incident →

## References & Sources

[1]
                            Palo Alto Unit 42: TeamPCP Supply Chain Attacks Analysis
                            Unit 42

                            [2]
                            Datadog Security Labs: LiteLLM Compromised — TeamPCP Supply Chain Campaign
                            Datadog Security Labs

                            [3]
                            SANS Institute: When a Security Scanner Became a Weapon
                            SANS Blog

                            [4]
                            Cloud Security Alliance: TeamPCP CI/CD Kill Chain
                            CSA Research

                            [5]
                            Endor Labs: TeamPCP Supply Chain Updates
                            Endor Labs

                Quick Facts

                    Country of Origin
                    
                        🌐
                        Unknown

                    Nation-State Sponsored
                    No — Criminal Enterprise

                    Motivation
                    Financial (Supply Chain Exploitation)

                    First Seen
                    September 2025

                    Last Seen
                    2026-Q2

                    Confidence Level
                    High

                    Associated Groups
                    UNC6780, DeadCatx3, PCPcat, ShellForce

                    Status
                    ACTIVE

                    Review Status
                    ⚠ Pending Human Review
