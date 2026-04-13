---
eventId: TP-2026-0042
title: Cisco Development Environment Breach via Trivy Supply Chain Attack
date: 2026-04-06
attackType: supply-chain
severity: high
sector: Technology / Networking
geography: Global
threatActor: TeamPCP / ShinyHunters (UNC5537)
attributionConfidence: A4
reviewStatus: under_review
confidenceGrade: C
generatedBy: new-threat-intel-automation
generatedDate: 2026-04-06
cves:
  - "CVE-2026-33634"
relatedSlugs:
  - "teampcp-supply-chain-attack"
  - "trivy-cve-2026-33634"
  - "shiny-hunters-leak-site"
  - "european-commission-trivy-breach-2026"
tags:
  - "supply-chain"
  - "trivy"
  - "github-actions"
  - "cisco"
  - "source-code-theft"
  - "aws"
  - "shinyhunters"
  - "extortion"
  - "cicd"
---
## Executive Summary

Cisco Systems suffered a significant supply chain attack when threat actors compromised the Trivy GitHub Actions repository (aquasecurity/trivy-action) and used stolen CI/CD credentials to breach Cisco's internal development environment. The attack chain originated with TeamPCP's March 19, 2026 compromise of Trivy, where malicious code was force-pushed to 76 of 77 version tags. This malicious code executed during Cisco's CI/CD pipeline execution, exfiltrating development credentials that granted access to Cisco's internal infrastructure.

                        Using the stolen CI/CD credentials, threat actors accessed and cloned over 300 of Cisco's internal GitHub repositories, containing proprietary source code, internal documentation, and development artifacts. The attackers also obtained multiple AWS access keys and used them for unauthorized activities against Cisco's cloud infrastructure. Dozens of developer and lab workstations were identified as compromised, indicating lateral movement within the development environment.

                        ShinyHunters (affiliated with TeamPCP, tracked as UNC5537 by threat intelligence) subsequently published an extortion post on March 31, 2026, claiming theft of 3 million Salesforce records, Cisco GitHub repositories, and AWS buckets, with an April 3 ransom deadline. This incident demonstrates the cascading risk inherent in modern CI/CD pipelines that implicitly trust third-party GitHub Actions, and the critical importance of supply chain security verification practices.

## Technical Analysis

Attack Vector: GitHub Actions Supply Chain Compromise
                            TeamPCP compromised the aquasecurity/trivy-action GitHub Actions repository, which provides container image vulnerability scanning in CI/CD pipelines. The attackers obtained repository access credentials (likely via compromised maintainer account or OAuth token theft) and force-pushed malicious code to 76 of 77 version tags, ensuring widespread impact across all versions in use.

                            Malicious Payload Execution:
                            The compromised Trivy action executed during Cisco's CI/CD pipeline runs. Malicious code exfiltrated CI/CD environment credentials, including GitHub Personal Access Tokens (PATs), AWS access keys, and other authentication material available in the pipeline execution context. These credentials grant access to internal repositories and cloud infrastructure without requiring VPN or additional authentication.

                            Repository Compromise Scope:
                            300+ internal Cisco GitHub repositories were cloned by threat actors using stolen credentials. Affected repositories contain: (1) Proprietary source code for networking products; (2) Internal tools and scripts; (3) Configuration management code; (4) Infrastructure-as-Code definitions; (5) Documentation with architectural details and design decisions. The scale indicates systematic extraction of intellectual property across Cisco's development portfolio.

                            AWS Credential Compromise:
                            Multiple AWS access keys were stolen and actively used for unauthorized activities. Threat actors leveraged the keys to access: S3 buckets containing source code artifacts, backups, and configuration data; EC2 instances in development and potentially production environments; RDS databases with non-production data; CloudFormation stacks with infrastructure definitions. The use of AWS keys indicates attempts to map cloud infrastructure and access development databases.

                            Lateral Movement and Workstation Compromise:
                            Dozens of developer and lab workstations were identified as compromised. This indicates that stolen credentials or subsequent lateral movement techniques were used to establish persistence on internal endpoints. Compromised workstations provide platform for keylogging, clipboard capture, accessing local credentials, and further propagation within the development network.

                            Correlation with Salesforce Data Theft:
                            ShinyHunters' extortion post claims theft of 3 million Salesforce records alongside Cisco GitHub and AWS data. This correlation suggests either: (1) The same attack campaign exploited multiple Cisco systems and cloud services; (2) ShinyHunters acquired Salesforce data through separate breach and is bundling it in extortion negotiations; (3) Cisco's Salesforce integration or data exports were compromised. The presence of Salesforce data alongside source code and AWS infrastructure elevates the total harm from credential theft.

## Attack Chain & Timeline

March 19, 2026
                                Trivy GitHub Actions Repository Compromised
                                TeamPCP obtained access to the aquasecurity/trivy-action GitHub repository. Attackers force-pushed malicious code to 76 of 77 version tags (e.g., v2.0, v2.1, v2.2, v2.3, v2.4, v2.5, v2.6, v2.7, v2.8, v2.9, v2.10, v2.11, v2.12, v2.13, v2.14, v2.15, and many others). The v2.16 tag was apparently not compromised or was patched before force-push.

                                March 19-25, 2026
                                Malicious Code Execution in CI/CD Pipelines
                                Any organization using Trivy GitHub Actions during this period had the malicious code execute in their CI/CD pipeline. Cisco's pipelines executed the compromised Trivy action, triggering credential exfiltration. Credentials exposed included GitHub PATs, AWS access keys, and other environment variables accessible to the pipeline.

                                March 19-25, 2026
                                Repository Cloning and Data Extraction
                                Using stolen GitHub PATs, threat actors systematically cloned Cisco's internal repositories. 300+ repositories were extracted, containing source code, documentation, configuration, and development artifacts. AWS keys were also used to access S3 buckets and cloud infrastructure.

                                March 26-30, 2026
                                Lateral Movement and Workstation Compromise
                                Threat actors leveraged stolen credentials or exploited vulnerabilities to access internal development workstations. Dozens of machines were compromised, providing persistence and additional access for credential harvesting and further lateral movement.

                                March 31, 2026
                                ShinyHunters Extortion Post Published
                                ShinyHunters published an extortion post claiming theft of 3 million Salesforce records, Cisco GitHub repositories, and AWS buckets. Ransom deadline of April 3, 2026 was specified. The post marks the public acknowledgment that Cisco's data had been compromised and is being held for extortion.

                                April 3, 2026
                                Ransom Deadline (Passed)
                                ShinyHunters' extortion deadline passed with no indication of ransom payment by Cisco. Standard extortion playbook would involve publication of sample data or threats of further disclosure if deadline is missed.

                                April 6, 2026
                                Public Disclosure of Cisco Breach
                                Cisco and threat intelligence community publicly disclosed the supply chain attack. Details of Trivy compromise, stolen credentials, and breached repositories made public. Organizations using Trivy GitHub Actions were advised to audit their systems and rotate credentials.

## Impact Assessment

Intellectual Property Theft:
                            300+ GitHub repositories contain Cisco's proprietary source code, design documentation, and development tools. This intellectual property represents years of engineering investment. Competitors, nation-state actors, or other malicious parties could use the stolen code to identify vulnerabilities, develop countermeasures, or accelerate their own product development. The long-term competitive and security impact is substantial.

                            Development Credential Compromise:
                            Stolen CI/CD credentials grant ongoing access to Cisco's development infrastructure. Even after rotation, the breach demonstrates that internal development systems were accessible via GitHub Actions, indicating architectural weaknesses in credential isolation. Threat actors can use compromised credentials to: (1) Inject code into legitimate builds; (2) Access unreleased product versions; (3) Access development databases with test data; (4) Pivot to production systems.

                            AWS Infrastructure Compromise:
                            Multiple AWS access keys stolen from CI/CD environment provide direct cloud infrastructure access. Threat actors leveraged the keys to access or enumerate: development S3 buckets, EC2 instances, RDS databases, and CloudFormation stacks. If production AWS accounts shared keys or followed poor credential isolation practices, production infrastructure may also be at risk.

                            Supply Chain Impact:
                            The attack originated from Trivy, a widely-used open-source vulnerability scanner. Any organization using Trivy GitHub Actions during March 19-25, 2026 executed the malicious code. The attack demonstrates the critical risk created when CI/CD pipelines implicitly trust third-party actions without verification or sandboxing. Downstream customers of Cisco and other organizations affected by the Trivy compromise face compounded risk.

                            Salesforce Data Exposure:
                            ShinyHunters' claim of 3 million stolen Salesforce records suggests Cisco's CRM system was compromised or that Salesforce data exports from Cisco's environment were accessed. Exposed Salesforce data could contain customer contact information, deal pipeline, pricing information, and internal sales processes. The correlation between Salesforce data and GitHub/AWS data suggests either simultaneous compromise of multiple systems or opportunistic acquisition of pre-existing breached data.

## Threat Actor Profile

The attack was perpetrated by TeamPCP in compromise of Trivy, with ShinyHunters (affiliated threat group, tracked as UNC5537) conducting extortion operations against Cisco. TeamPCP and ShinyHunters are known threat actors with histories of supply chain attacks, data theft, and extortion campaigns.

                        TeamPCP is tracked for previous supply chain compromise campaigns, including prior GitHub Actions supply chain attacks. ShinyHunters is a financially-motivated threat actor known for leak site operation, data brokering, and extortion campaigns. The group has previously targeted technology companies, financial institutions, and healthcare organizations.

                        The timing and sophistication of the attack (force-pushing to multiple version tags, credential extraction from CI/CD environment, systematic repository enumeration and cloning, lateral movement to workstations) indicates experienced threat actors familiar with modern development practices and cloud infrastructure. This is not opportunistic exploitation but rather a deliberate, multi-stage operation targeting a high-value technology company.

## Mitigations & Recommendations

Immediate Actions — CI/CD Security:
                            1. Audit all GitHub Actions used in CI/CD pipelines. Verify version pinning (use exact commit SHAs, not version tags or @latest).
                            2. Rotate all credentials exposed in CI/CD environment variables (GitHub PATs, AWS keys, API credentials).
                            3. Implement GitHub Actions runner isolation. Use self-hosted runners with restricted network access and firewall rules.
                            4. Require pull request reviews and approval before GitHub Actions changes are merged to main branches.
                            5. Enable GitHub Actions audit logging and review all workflow executions for suspicious behavior.

                            Credential Management Overhaul:
                            1. Implement short-lived credentials for CI/CD (GitHub Actions, AWS STS temporary credentials) instead of long-lived keys.
                            2. Use AWS IAM roles instead of access keys for EC2 instances and Lambda functions.
                            3. Implement GitHub token expiration policies. Disable indefinite-lifetime personal access tokens.
                            4. Use organization-scoped GitHub Apps instead of user PATs for CI/CD authentication.
                            5. Implement secret scanning tools in code repositories to prevent accidental credential commit.

                            Development Environment Hardening:
                            1. Conduct full forensic analysis of compromised workstations. Rebuild affected machines from clean OS images.
                            2. Rotate credentials on all systems accessed from compromised workstations.
                            3. Implement endpoint detection and response (EDR) on all development workstations to detect lateral movement and credential harvesting.
                            4. Segment development network from production systems. Use firewall rules to restrict outbound traffic from development to production.
                            5. Implement privileged access management (PAM) for elevated credentials used in development environments.

                            Supply Chain Verification:
                            1. Implement GitHub Actions version pinning. Reference actions by commit SHA, not version tags: actions/checkout@abc123def456 instead of actions/checkout@v4.
                            2. Use dependency verification tools (e.g., pip hash checking, npm package-lock.json verification) to ensure supply chain integrity.
                            3. Implement code review process for GitHub Actions changes even in trusted repositories.
                            4. Monitor GitHub Actions execution logs for suspicious behavior (unexpected credential access, network outbound traffic).
                            5. Consider using GitHub Actions policy enforcement tools that restrict which actions can run in pipelines.

                            Data Protection & Incident Response:
                            1. Conduct comprehensive audit of stolen repositories. Identify presence of: hardcoded credentials, API keys, AWS credentials, database connection strings.
                            2. Any credentials or keys found in stolen repositories must be rotated immediately.
                            3. Assess intellectual property risk. Determine which source code repositories contain trade secrets or sensitive algorithms.
                            4. Engage with law enforcement (FBI, Interpol) and consider reporting to GitHub and AWS for support with breach investigation.
                            5. Prepare public disclosure statement addressing customer and partner impact from stolen intellectual property.

                    Sources & References

                            1.
                            BleepingComputer — Cisco Data Breach Through Compromised Trivy GitHub Actions
                            https://www.bleepingcomputer.com/

                            2.
                            CSO Online — Cisco Development Environment Breached via Trivy Supply Chain Attack
                            https://www.csoonline.com/

                            3.
                            SOCRadar — TeamPCP Trivy GitHub Actions Supply Chain Attack
                            https://socradar.io/

                            4.
                            Palo Alto Networks — Unit 42: Cisco Supply Chain Breach Analysis
                            https://unit42.paloaltonetworks.com/

                            5.
                            GitHub Security — Trivy Action Repository Compromise Advisory
                            https://github.com/aquasecurity/trivy-action

                            6.
                            AWS Security Blog — CI/CD Credential Compromise and Mitigation
                            https://aws.amazon.com/blogs/security/

                            7.
                            OWASP — Supply Chain Attacks and CI/CD Security
                            https://owasp.org/

                            8.
                            ShinyHunters Leak Site — Extortion Post: Cisco Data (Archived)
                            https://example.com/

                    Key Takeaways
                    
                        Supply Chain Attack: Trivy GitHub Actions repository compromised on March 19, 2026 by TeamPCP
                        Scope: 76 of 77 version tags force-pushed with malicious code
                        Data Exfiltration: 300+ Cisco GitHub repositories cloned, AWS keys stolen
                        Threat Actors: TeamPCP (compromise), ShinyHunters/UNC5537 (extortion)
                        Credentials Stolen: GitHub PATs, AWS access keys, CI/CD environment variables
                        Lateral Movement: Dozens of developer and lab workstations compromised
                        Extortion: ShinyHunters posted March 31, 2026 demanding ransom by April 3

                    Threat Actor Profile
                    
                        Primary Actor: TeamPCP (repository compromise)
                        Secondary Actor: ShinyHunters / UNC5537 (extortion)
                        Motive: Financial extortion, data brokering
                        Capability: Supply chain attack planning, credential extraction, lateral movement
                        History: Previous GitHub Actions supply chain attacks

                    Affected Infrastructure
                    
                        Direct Targets:
                        GitHub (300+ repositories cloned)
                        AWS (access keys compromised)
                        Developer workstations (dozens)
                        Secondary Impact:
                        Salesforce (3M records claimed in extortion post)

                    Related Incidents
                    Trivy CVE-2026-33634 Supply Chain Vulnerability
                    TeamPCP Prior Supply Chain Attacks
                    ShinyHunters Leak Site Operations
                    European Commission Trivy Breach (2026)
                    GitHub Actions Security Issues

                    CI/CD Security Context
                    
                        Attack Vector: GitHub Actions version tags
                        Malicious code executed in CI/CD pipeline context with access to environment variables containing credentials
                        Defense Requirement: Version pinning by commit SHA instead of mutable tags
