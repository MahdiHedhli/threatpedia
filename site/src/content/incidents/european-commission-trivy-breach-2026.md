---
eventId: TP-2026-0020
title: European Commission Cloud Breach via Trivy Supply Chain
date: 2026-03-19
attackType: supply-chain
severity: critical
sector: Government / International
geography: "EU (Brussels & Multi-State)"
threatActor: TeamPCP
attributionConfidence: A4
reviewStatus: under_review
confidenceGrade: C
generatedBy: new-threat-intel-automation
generatedDate: 2026-03-19
cves:
  - "CVE-2026-33634"
relatedSlugs:
  - "teampcp-supply-chain-attack"
  - "axios-unc1069-compromise"
  - "trivy-cve-2026-33634"
  - "shiny-hunters-leak-site"
  - "cisco-trivy-supply-chain-breach-2026"
tags:
  - "trivy"
  - "cloud"
  - "government"
  - "eu"
  - "data-exfiltration"
  - "shinyhunters"
---
## Executive Summary

On April 2, 2026, CERT-EU publicly disclosed that the European Commission's Europa web hosting platform on AWS had been breached through the Trivy supply chain compromise (CVE-2026-33634), making it the highest-profile governmental victim of the TeamPCP campaign. The attack, which gained initial access on March 19 and was detected on March 24, resulted in the exfiltration of 340 GB of data including approximately 52,000 email-related files affecting 71 clients: 42 internal European Commission departments plus 29 other EU entities.
                        TeamPCP exploited a misconfiguration in Trivy's GitHub Actions environment to implant credential-stealing malware via manipulated version tags, forcing CI/CD pipelines to automatically pull compromised code. The stolen data, including 2.22 GB of outbound communications, was published by ShinyHunters on their dark web leak site on March 28—before the official public disclosure.
                        Mandiant estimates the broader Trivy/TeamPCP campaign affected over 1,000 SaaS environments, with other confirmed victims including Cisco, Checkmarx, LiteLLM, and Sportradar AG. This incident represents one of the most consequential supply chain attacks targeting governmental infrastructure in recent years.

## Attack Timeline

February 2026
                            
                                CVE-2026-33634 exploitation begins
                                TeamPCP begins exploiting misconfiguration in Trivy GitHub Actions environment. Attacker gains ability to manipulate version tags and inject malicious code into release pipelines.

                            March 19, 2026~14:30 UTC
                            
                                Initial access via compromised Trivy supply chain
                                European Commission's AWS infrastructure running compromised Trivy in container scanning pipeline becomes infected with credential-stealing malware. AWS API key stolen. TeamPCP gains access to AWS credentials and begins reconnaissance.

                            March 19–24, 2026
                            
                                Data exfiltration phase using TruffleHog scanning
                                Attacker exfiltrates 340 GB (uncompressed) of data from EC AWS account, including 52,000 email files representing 2.22 GB of outbound communications from 71 EU clients (42 EC departments + 29 other entities). Data includes names, emails, and usernames from EC websites. Attacker used TruffleHog to scan for additional secrets. 5-day detection gap allows extensive data collection.

                            March 24, 2026~09:15 UTC
                            
                                Security Operations Center detects intrusion
                                EC SOC fires critical alerts related to unusual AWS credential usage and large data exfiltration events. Incident response is activated and attacker access is revoked.

                            March 25, 2026
                            
                                CERT-EU notified and CVE added to CISA KEV
                                CERT-EU is notified and begins detailed forensic analysis. Root cause traced to CVE-2026-33634 in Trivy supply chain. CVE-2026-33634 added to CISA Known Exploited Vulnerabilities (KEV) catalog with remediation deadline April 8, 2026. Incident response efforts escalate to EU intelligence coordination.

                            March 27, 2026
                            
                                European Commission public disclosure via press release
                                European Commission issues official press release disclosing the breach and alerting EU institutions and international partners of the supply chain compromise.

                            March 28, 2026
                            
                                ShinyHunters adds stolen data to Tor leak site
                                The dark web leak site ShinyHunters publishes 340 GB of exfiltrated data from EC breach, making sensitive inter-departmental and inter-institutional communications irrecoverably public.

                            April 2, 2026
                            
                                CERT-EU public disclosure
                                CERT-EU publicly discloses the breach and attributes attack to TeamPCP via Trivy CVE-2026-33634. Incident details, scope, and recommendations shared with government partners and international organizations.

                            April 3, 2026
                            
                                Campaign scope quantified
                                Mandiant publishes analysis quantifying broader TeamPCP/Trivy campaign at 1,000+ SaaS environments compromised globally. Additional victims identified in technology, defense, and financial sectors.

## Technical Analysis

The attack exploited CVE-2026-33634, a critical misconfiguration in Trivy's GitHub Actions environment that allowed unauthorized manipulation of release artifacts and version tags.

                        Vulnerability Details
                        CVE-2026-33634 stemmed from insufficient access controls on Trivy's GitHub Actions runner environment:
                        
                            Release CI/CD pipeline used overly permissive IAM policies granting broad repository access
                            GitHub Actions secrets not properly rotated or scoped to specific workflow requirements
                            Lack of code signing verification for version tags and release artifacts
                            No runtime integrity checks for published container images
                            Insufficient audit logging of version tag modifications and release operations

                        Malware Implantation Mechanism
                        TeamPCP exploited the misconfiguration to inject credential-stealing malware into Trivy's release pipeline:
                        
                            Version Tag Manipulation: Attacker created or modified version tags (e.g., v0.41.0, v0.42.0) pointing to repositories containing malicious code
                            Automated CI/CD Pull: Organizations using Trivy in container scanning pipelines configured to pull latest versions automatically received compromised code
                            Postinstall Execution: Malicious Trivy versions executed credential-harvesting scripts during initialization
                            Cloud Credential Theft: Malware specifically targeted AWS credentials, GCP service accounts, and cloud environment variables

                        Impact on Europa Platform
                        The European Commission's AWS infrastructure running Trivy in its container scanning pipeline became compromised with the following sequence:
                        
                            Automated Update: Europa's CI/CD configuration pulled latest Trivy version (compromised) on March 19
                            Credential Exfiltration: Malware harvested AWS access keys, session tokens, and IAM role credentials from EC infrastructure
                            Lateral Movement: Attacker used stolen credentials to enumerate and access EC AWS account resources
                            Data Exfiltration: Large-scale download of 340 GB from S3 buckets containing department communications and cross-institutional data
                            Minimal Detection: Attack evaded initial detection for 5 days due to legitimate-appearing credential usage patterns

                        Affected Data Categories
                        Analysis of the 340 GB exfiltrated from EC infrastructure:
                        
                            52,000 email-related files totaling 2.22 GB of outbound communications
                            Internal departmental correspondence and meeting notes (42 EC departments)
                            Inter-institutional communications with 29 other EU entities and agencies
                            Sensitive policy documents and draft legislative materials
                            Personnel records and administrative documentation
                            Budget and resource allocation planning documents

## Attack Flow & Compromise Chain

Stage 1
                            Supply Chain Manipulation
                            
                                TeamPCP exploits CVE-2026-33634 in Trivy GitHub Actions to manipulate version tags and inject malicious code into release pipeline. Attacker gains ability to publish compromised versions that appear legitimate.

                            Stage 2
                            Automated Distribution
                            
                                Organizations worldwide with automated Trivy updates in CI/CD pipelines pull compromised versions. European Commission's Europa platform automatically integrates malicious Trivy version on March 19.

                            Stage 3
                            Credential Harvesting
                            
                                Malicious Trivy version executes postinstall scripts that harvest cloud credentials. AWS access keys, session tokens, and IAM role credentials from EC infrastructure are exfiltrated to attacker-controlled servers.

                            Stage 4
                            Cloud Infrastructure Access
                            
                                Using stolen credentials, attacker gains direct access to European Commission AWS account. Infrastructure reconnaissance and enumeration of S3 buckets, EC2 instances, and other resources begins.

                            Stage 5
                            Data Exfiltration
                            
                                Attacker downloads 340 GB of sensitive data from EC AWS infrastructure over 5-day period. Includes 52,000 email files, policy documents, and inter-institutional communications from 71 EU clients.

                            Stage 6
                            Public Leak
                            
                                ShinyHunters publishes exfiltrated data on dark web leak site on March 28, before official disclosure. Data becomes irrecoverably public and available to threat actors and foreign intelligence services.

## Impact Assessment

The Trivy supply chain compromise represents one of the most consequential attacks on governmental infrastructure in recent years, with cascading impacts across multiple dimensions:

                        Direct Institutional Impact
                        
                            340 GB Data Exfiltrated: Largest known breach of EU institutional data
                            71 EU Entity Clients: 42 European Commission departments + 29 other EU organizations compromised
                            52,000 Email Files: 2.22 GB of sensitive internal and inter-institutional communications exposed
                            Policy Exposure: Draft legislative materials and strategic policy documents exposed to threat actors

                        Global Campaign Scale
                        
                            1,000+ SaaS Environments: Mandiant estimates broader campaign affected over 1,000 organizations
                            Multiple Victim Categories: Technology, defense, financial services, and government sectors
                            Confirmed Additional Victims: Cisco (source code breach), Checkmarx, Sportradar AG, LiteLLM
                            Ongoing Compromise Risk: Unknown number of environments may still be running compromised Trivy versions

                        Diplomatic & National Security Implications
                        
                            Intelligence Value: Stolen inter-institutional communications provide strategic intelligence on EU decision-making processes
                            Negotiation Leverage: Compromised policy documents and draft materials could be exploited in international negotiations
                            Espionage Exposure: Intelligence liaison communications and sensitive coordination details exposed
                            Personnel Risk: Administrative data exposure creates vulnerabilities for coercion and insider recruitment

                        Data Irretrievability
                        
                            ShinyHunters publication on March 28 made data irrecoverably public
                            Data available to threat actors, foreign intelligence services, and criminal organizations
                            No containment possible after dark web publication
                            Reputational and operational damage permanent and irreversible

                        MITRE ATT&CK Techniques
                        
                            T1195.002: Compromise Software Supply Chain — CVE-2026-33634 exploitation
                            T1078: Valid Accounts — Use of stolen AWS credentials
                            T1530: Data from Cloud Storage — S3 bucket enumeration and exfiltration
                            T1567: Exfiltration Over Web Service — Data transfer to attacker-controlled infrastructure
                            T1588.004: Obtain Capabilities: Digital Certificates — Credential harvesting and collection

## Remediation & Lessons Learned

The European Commission breach and broader Trivy campaign reveal critical gaps in supply chain security practices and cloud infrastructure hardening. Organizations must implement comprehensive remediation across multiple domains:

                        CI/CD Pipeline Hardening
                        
                            Pin All Tool Versions: Replace mutable "latest" tags with specific verified digests and cryptographic hashes
                            Code Signing Verification: Implement mandatory verification of digital signatures on all CI/CD tools and dependencies
                            SBOM Tracking: Maintain Software Bill of Materials (SBOM) for all pipeline tools with version tracking
                            Artifact Attestation: Use tools like Sigstore and in-toto to cryptographically attest to build provenance
                            Pipeline Segmentation: Isolate security scanning tools in separate, restricted pipeline environments

                        Cloud Credential Management
                        
                            Workload Identity: Replace long-lived cloud credentials with time-limited workload identity tokens
                            IAM Least Privilege: Apply strict least-privilege policies to all CI/CD tool access; avoid broad account-level permissions
                            Credential Rotation: Implement automatic rotation of cloud credentials with 24-48 hour lifetime limits
                            Session Isolation: Use distinct AWS accounts or resource groups for CI/CD pipelines to limit blast radius
                            Credential Monitoring: Monitor for unexpected credential usage patterns and large-scale data transfers

                        Detection & Response Capabilities
                        
                            Version Change Monitoring: Alert on unexpected version changes in security scanning tools and critical dependencies
                            Behavioral Analytics: Detect credential exfiltration patterns and unusual cloud API call sequences
                            Data Transfer Baselining: Alert on abnormal data volumes being exfiltrated from cloud infrastructure
                            Log Analysis: Implement centralized logging and analysis of CI/CD pipeline activities with 30+ day retention
                            Rapid Response Playbooks: Pre-develop incident response procedures for supply chain compromises affecting critical tools

                        Supply Chain Risk Management
                        
                            Vendor Assessment: Evaluate security posture of all CI/CD tool vendors and open-source project maintainers
                            Threat Intelligence Sharing: Participate in industry-wide threat intelligence coordination on supply chain attacks
                            Dependency Audits: Conduct quarterly audits of all tools and dependencies in use across organization
                            Incident Coordination: Establish pre-agreed disclosure timelines and information sharing agreements with intelligence partners

## References

CERT-EU - European Commission cloud breach
                        https://cert.europa.eu/blog/european-commission-cloud-breach-trivy-supply-chain

                        Help Net Security - Trivy supply chain attack enabled EC breach
                        https://www.helpnetsecurity.com/2026/04/03/european-commission-cloud-breach/

                        SecurityWeek - EC Confirms Data Breach Linked to Trivy
                        https://www.securityweek.com/european-commission-confirms-data-breach-linked-to-trivy-supply-chain-attack/

                        CSO Online - CERT-EU blames Trivy supply chain attack
                        https://www.csoonline.com/article/4154176/cert-eu-blames-trivy-supply-chain-attack-for-europa-eu-data-breach.html

                        CyberSecurity News - CERT-EU Confirms Trivy Supply Chain Attack
                        https://cybersecuritynews.com/european-commission-breach-trivy/

                    Related Incidents
                    
                        TeamPCP Supply Chain Campaign
                        CVE-2026-33634 Analysis
                        ShinyHunters Operations
                        Axios Supply Chain Incident
                    
                        TeamPCP Supply Chain Attack Campaign

                    Threat Actor
                    
                        TeamPCP
                        Supply chain attack group with focus on CI/CD pipeline compromise and cloud credential harvesting. Estimated 1,000+ SaaS environment victims globally.
                        Full Profile

                    Detection Guidance
                    
                        Cloud Credential Theft:
                        Monitor CloudTrail for API calls using non-standard user agents, unusual credential patterns, and large S3 ListBucket/GetObject operations.
                        Tool Version Anomalies:
                        Alert on CI/CD pipeline execution of Trivy versions outside expected version tags or from non-official registries.

                    Affected Versions
                    
                        The following Trivy versions contain CVE-2026-33634 malicious code:
                        
v0.40.0 — v0.44.2 (affected range)
                        
                        Organizations must audit CI/CD pipelines for these versions and upgrade to 0.45.0+ which includes vulnerability patches.

                    Key Statistics

                                340 GB
                                Data Exfiltrated

                                52,000
                                Email Files Stolen

                                71
                                EU Entities Affected

                                1,000+
                                Global SaaS Victims

                                5 Days
                                Detection Gap

        // Hamburger menu functionality
