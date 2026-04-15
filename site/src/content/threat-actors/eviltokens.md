---
name: EvilTokens
aliases:
  - "NOIRLEGACY GROUP"
affiliation: Criminal
motivation: Financial (PhaaS)
status: active
reviewStatus: under_review
generatedBy: dangermouse-bot
generatedDate: 2026-04-13
---
## Overview

EvilTokens is a Phishing-as-a-Service (PhaaS) platform that exploits the OAuth device code authentication flow (RFC 8628) to steal persistent access tokens from Microsoft 365 environments. Launched in mid-February 2026 and marketed through the NOIRLEGACY GROUP Telegram channel, EvilTokens has rapidly become one of the most effective phishing platforms in the threat landscape, powering campaigns against 340+ organizations across nine countries.

                    Unlike traditional credential phishing, EvilTokens targets the device code authentication flow — victims enter a legitimate Microsoft device code on a genuine login page, granting attackers persistent OAuth tokens that survive password resets and MFA changes. This technique requires no credential capture or MFA defeat, making it exceptionally effective against hardened environments. The platform provides turnkey B2B phishing capabilities including email filtering bypass, AI-powered workflow automation, and professional templates impersonating Microsoft, Adobe, DocuSign, and SharePoint.

                    EvilTokens serves as infrastructure for multiple sophisticated threat actors, including Storm-2372 (Russia-aligned), APT29 (Russian SVR), UTA0304, and UTA0307. The platform's professional support operations and modular architecture have lowered the barrier to entry for OAuth token theft, enabling even unsophisticated actors to conduct advanced identity-based attacks.

## Tactics, Techniques & Procedures (TTPs)

MITRE ATT&CK Techniques
                        
                            Initial Access:
                            
                                T1566.002: Spearphishing Link
                                T1566.004: Spearphishing Voice
                            
                            Credential Access:
                            
                                T1528: Steal Application Access Token
                                T1550.001: Use Alternate Authentication Material
                            
                            Collection:
                            
                                T1114.002: Remote Email Collection
                                T1213: Data from Information Repositories
                            
                            Persistence:
                            
                                T1098.003: Additional Cloud Credentials (OAuth tokens persist beyond password resets)
                            
                            Defense Evasion:
                            
                                T1550.001: Use Alternate Authentication Material (token replay)

                        Common Attack Vectors
                        
                            OAuth Device Code Phishing: Victims receive phishing emails with QR codes or links leading to decoy pages. When they enter the device code on Microsoft's legitimate login endpoint, attackers receive persistent OAuth tokens — no credentials or MFA defeat needed.
                            Template Impersonation: Professional phishing templates impersonating Adobe Acrobat, DocuSign, SharePoint, Microsoft Teams, OneDrive, eFax, and email quarantine notices.
                            Mass Distribution: B2B phishing sender with email filtering bypass for large-scale campaign deployment across organizations.
                            Post-Compromise Token Exchange: Stolen tokens are exchanged for access to Outlook, Azure, SharePoint, and other M365 services for data collection and lateral movement.

                        Tools & Malware
                        
                            EvilTokens Platform: Full-featured PhaaS with B2B phishing sender, email filtering bypass, Office 365 capture links, and AI-powered workflow automation.
                            SMTP Mass Distribution: High-volume email distribution infrastructure for campaign deployment.
                            Template Library: Professional impersonation templates for Adobe, DocuSign, SharePoint, Microsoft, OneDrive, eFax, calendar invites, and password expiry warnings.
                            Token Management Console: Webmail interface and reconnaissance tools for post-compromise operations using stolen OAuth tokens.

                        Infrastructure Patterns
                        
                            Telegram Distribution: NOIRLEGACY GROUP Telegram channel serves as primary marketing and sales platform with 24/7 professional support.
                            1,000+ Hosting Domains: By late March 2026, the platform operated across more than 1,000 hosting domains for phishing page delivery.
                            Railway.com Infrastructure: Some campaigns leveraged Railway PaaS for hosting phishing infrastructure.
                            Legitimate Microsoft Endpoints: The attack abuses Microsoft's genuine device code login flow, making the authentication page itself legitimate.

## Targeted Industries & Organizations

EvilTokens campaigns have targeted diverse sectors across nine countries:

                            SectorNotable Impact

                            Multi-Sector (340+ orgs)Microsoft 365 environments across US, Canada, Australia, New Zealand, Germany, France, India, Switzerland, UAE. Full Report →
                            ConstructionMultiple firms targeted via device code phishing
                            NonprofitsNGOs and nonprofits — often with weaker security posture
                            Financial ServicesFinancial institutions and real estate firms
                            HealthcareHealthcare organizations with M365 environments
                            LegalLaw firms and legal services organizations
                            GovernmentLocal government agencies

## Attributable Attacks Timeline

Feb 16-19, 2026
                            
                                Platform Launch
                                EvilTokens advertised on NOIRLEGACY GROUP Telegram channel, offering turnkey OAuth device code phishing capabilities for Microsoft 365 environments.

                            Feb-Mar 2026
                            
                                Mass Campaign Deployment
                                Multiple threat actors (Storm-2372, APT29, UTA0304, UTA0307) begin using EvilTokens to target 340+ M365 organizations across nine countries. Full Report →

                            Mar 2026
                            
                                Infrastructure Expansion
                                Platform scales to 1,000+ hosting domains. SEKOIA publishes detailed analysis of EvilTokens kit and device code phishing techniques.

                            Mar-Apr 2026
                            
                                Continued Operations
                                Platform continues active operations with expanding customer base. Professional support and regular template updates maintain effectiveness against evolving defenses.

## Known Exploits & CVEs

EvilTokens does not exploit software vulnerabilities. The platform abuses the legitimate OAuth device code authentication flow (RFC 8628) built into Microsoft 365. The attack exploits human trust rather than technical flaws — victims authenticate on a genuine Microsoft login page, making technical detection challenging.

## Cross-Vendor Naming Reference

Vendor / Organization
                                Name Used

                                SEKOIA
                                EvilTokens

                                Microsoft Threat Intelligence
                                Device Code Phishing Kit

                                Huntress
                                EvilTokens / Railway M365 Token Campaign

                                BleepingComputer
                                EvilTokens

                                Cloud Security Alliance
                                EvilTokens

## Related Threat Actors

APT29 (Cozy Bear): Russian SVR-affiliated threat actor using EvilTokens for device code phishing campaigns since 2008. Long history of sophisticated espionage operations.
                        Storm-2372: Russia-aligned threat actor and prominent EvilTokens customer, conducting campaigns since August 2024.
                        UTA0304 & UTA0307: Additional threat actors leveraging EvilTokens platform for M365 targeting campaigns.
                        UNK_AcademicFlare: Threat actor using EvilTokens to target academic and research institutions.

## References & Sources

[1]
                            SEKOIA: New Widespread EvilTokens Kit — Device Code Phishing-as-a-Service
                            SEKOIA Blog

                            [2]
                            The Hacker News: Device Code Phishing Hits 340+ Microsoft Organizations
                            The Hacker News

                            [3]
                            BleepingComputer: New EvilTokens Service Fuels Microsoft Device Code Phishing
                            BleepingComputer

                            [4]
                            Huntress: Railway PaaS M365 Token Replay Campaign
                            Huntress Blog

                            [5]
                            CSA Research: OAuth Device Code Phishing M365
                            Cloud Security Alliance

                Quick Facts

                    Country of Origin
                    
                        🌐
                        Unknown

                    Nation-State Sponsored
                    No — Criminal Enterprise (PhaaS Operator)

                    Motivation
                    Financial (Phishing-as-a-Service)

                    First Seen
                    February 2026

                    Last Seen
                    2026-Q2

                    Confidence Level
                    High

                    Associated Groups
                    NOIRLEGACY GROUP

                    Status
                    ACTIVE

                    Review Status
                    ⚠ Pending Human Review
