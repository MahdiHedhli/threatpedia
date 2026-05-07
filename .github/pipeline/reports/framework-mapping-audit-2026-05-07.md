# Framework Mapping Corpus Audit

Generated: 2026-05-07T13:11:08.564Z

Pinned framework data:

- ATT&CK Enterprise: v19.0
- Source URL: https://raw.githubusercontent.com/mitre-attack/attack-stix-data/master/enterprise-attack/enterprise-attack-19.0.json
- Source SHA-256: df520ea0775a57db7bff760145b02fed89290802913e056b7ed5970b02f3626a

Scope:

- Report mode only. No article frontmatter was modified.
- The audit compares existing corpus mitreMappings against pinned ATT&CK Enterprise v19.0.
- Technique-name normalization is mechanically checkable, but tactic reclassification still needs article-supported review before content changes.
- ATLAS coverage is not migrated here; atlasMappings remain optional and should only be added when article evidence supports adversarial AI/ML behavior.

## Summary

- Content files scanned: 161
- Files with MITRE mappings: 161
- MITRE mappings scanned: 484
- Findings: 1646

## Findings By Severity

| Count | Category |
|---:|---|
| 1431 | metadata-gap |
| 170 | fixable |
| 27 | review-required |
| 16 | error |
| 2 | warning |

## Findings By Category

| Count | Category |
|---:|---|
| 477 | missing-attack-version |
| 477 | missing-confidence |
| 477 | missing-evidence |
| 170 | technique-name-mismatch |
| 27 | v19-defense-evasion-split-candidate |
| 9 | revoked-technique |
| 7 | unknown-technique-id |
| 2 | tactic-mismatch |

## Collection Coverage

| Collection | Files | Files with mappings | Mappings |
|---|---:|---:|---:|
| campaigns | 14 | 14 | 59 |
| incidents | 67 | 67 | 192 |
| threat-actors | 40 | 40 | 140 |
| zero-days | 40 | 40 | 93 |

## Mechanically Fixable Candidates

| Severity | Category | Location | Finding |
|---|---|---|---|
| fixable | technique-name-mismatch | site/src/content/campaigns/applejeus-dprk-cryptocurrency-targeting-campaign.md#mitreMappings[0] | Technique name should match ATT&CK v19.0: Spearphishing Link. |
| fixable | technique-name-mismatch | site/src/content/campaigns/applejeus-dprk-cryptocurrency-targeting-campaign.md#mitreMappings[1] | Technique name should match ATT&CK v19.0: Malicious File. |
| fixable | technique-name-mismatch | site/src/content/campaigns/applejeus-dprk-cryptocurrency-targeting-campaign.md#mitreMappings[2] | Technique name should match ATT&CK v19.0: Launch Daemon. |
| fixable | technique-name-mismatch | site/src/content/campaigns/applejeus-dprk-cryptocurrency-targeting-campaign.md#mitreMappings[3] | Technique name should match ATT&CK v19.0: Web Protocols. |
| fixable | technique-name-mismatch | site/src/content/campaigns/carbanak-banking-campaign-2013.md#mitreMappings[0] | Technique name should match ATT&CK v19.0: Spearphishing Attachment. |
| fixable | technique-name-mismatch | site/src/content/campaigns/carbanak-banking-campaign-2013.md#mitreMappings[1] | Technique name should match ATT&CK v19.0: Registry Run Keys / Startup Folder. |
| fixable | technique-name-mismatch | site/src/content/campaigns/carbanak-banking-campaign-2013.md#mitreMappings[2] | Technique name should match ATT&CK v19.0: Keylogging. |
| fixable | technique-name-mismatch | site/src/content/campaigns/carbanak-banking-campaign-2013.md#mitreMappings[3] | Technique name should match ATT&CK v19.0: Remote Access Tools. |
| fixable | technique-name-mismatch | site/src/content/campaigns/dragonforce-ransomware-campaign-april-2026.md#mitreMappings[1] | Technique name should match ATT&CK v19.0: Exfiltration to Cloud Storage. |
| fixable | technique-name-mismatch | site/src/content/campaigns/hafnium-exchange-server-exploitation-campaign-2021.md#mitreMappings[1] | Technique name should match ATT&CK v19.0: Web Shell. |
| fixable | technique-name-mismatch | site/src/content/campaigns/hafnium-exchange-server-exploitation-campaign-2021.md#mitreMappings[2] | Technique name should match ATT&CK v19.0: PowerShell. |
| fixable | technique-name-mismatch | site/src/content/campaigns/m365-oauth-device-code-phishing-2026.md#mitreMappings[0] | Technique name should match ATT&CK v19.0: Spearphishing Link. |
| fixable | technique-name-mismatch | site/src/content/campaigns/m365-oauth-device-code-phishing-2026.md#mitreMappings[2] | Technique name should match ATT&CK v19.0: Application Access Token. |
| fixable | technique-name-mismatch | site/src/content/campaigns/notpetya-destructive-campaign-2017.md#mitreMappings[0] | Technique name should match ATT&CK v19.0: Compromise Software Supply Chain. |
| fixable | technique-name-mismatch | site/src/content/campaigns/notpetya-destructive-campaign-2017.md#mitreMappings[1] | Technique name should match ATT&CK v19.0: LSASS Memory. |
| fixable | technique-name-mismatch | site/src/content/campaigns/notpetya-destructive-campaign-2017.md#mitreMappings[4] | Technique name should match ATT&CK v19.0: SMB/Windows Admin Shares. |
| fixable | technique-name-mismatch | site/src/content/campaigns/operation-aurora-espionage-campaign-2009.md#mitreMappings[0] | Technique name should match ATT&CK v19.0: Spearphishing Link. |
| fixable | technique-name-mismatch | site/src/content/campaigns/operation-cloud-hopper-msp-espionage-campaign.md#mitreMappings[1] | Technique name should match ATT&CK v19.0: Spearphishing Attachment. |
| fixable | technique-name-mismatch | site/src/content/campaigns/operation-cloud-hopper-msp-espionage-campaign.md#mitreMappings[3] | Technique name should match ATT&CK v19.0: Web Protocols. |
| fixable | technique-name-mismatch | site/src/content/campaigns/solarwinds-supply-chain-campaign.md#mitreMappings[0] | Technique name should match ATT&CK v19.0: Compromise Software Supply Chain. |
| fixable | technique-name-mismatch | site/src/content/campaigns/solarwinds-supply-chain-campaign.md#mitreMappings[1] | Technique name should match ATT&CK v19.0: Web Protocols. |
| fixable | technique-name-mismatch | site/src/content/campaigns/solarwinds-supply-chain-campaign.md#mitreMappings[2] | Technique name should match ATT&CK v19.0: Additional Cloud Credentials. |
| fixable | technique-name-mismatch | site/src/content/campaigns/solarwinds-supply-chain-campaign.md#mitreMappings[3] | Technique name should match ATT&CK v19.0: Trust Modification. |
| fixable | technique-name-mismatch | site/src/content/campaigns/solarwinds-supply-chain-campaign.md#mitreMappings[4] | Technique name should match ATT&CK v19.0: Remote Email Collection. |
| fixable | technique-name-mismatch | site/src/content/campaigns/teampcp-supply-chain-campaign-2026.md#mitreMappings[0] | Technique name should match ATT&CK v19.0: Compromise Software Supply Chain. |
| fixable | technique-name-mismatch | site/src/content/campaigns/teampcp-supply-chain-campaign-2026.md#mitreMappings[1] | Technique name should match ATT&CK v19.0: Credentials In Files. |
| fixable | technique-name-mismatch | site/src/content/campaigns/wannacry-ransomware-campaign-2017.md#mitreMappings[3] | Technique name should match ATT&CK v19.0: Windows Command Shell. |
| fixable | technique-name-mismatch | site/src/content/incidents/adobe-mr-raccoon-breach-2026.md#mitreMappings[0] | Technique name should match ATT&CK v19.0: Spearphishing Attachment. |
| fixable | technique-name-mismatch | site/src/content/incidents/adobe-mr-raccoon-breach-2026.md#mitreMappings[1] | Technique name should match ATT&CK v19.0: Malicious File. |
| fixable | technique-name-mismatch | site/src/content/incidents/adobe-mr-raccoon-breach-2026.md#mitreMappings[2] | Technique name should match ATT&CK v19.0: Cloud Accounts. |
| fixable | technique-name-mismatch | site/src/content/incidents/adobe-mr-raccoon-breach-2026.md#mitreMappings[3] | Technique name should match ATT&CK v19.0: Data from Cloud Storage. |
| fixable | technique-name-mismatch | site/src/content/incidents/anthem-health-data-breach-2015.md#mitreMappings[0] | Technique name should match ATT&CK v19.0: Spearphishing Link. |
| fixable | technique-name-mismatch | site/src/content/incidents/axios-unc1069-compromise.md#mitreMappings[1] | Technique name should match ATT&CK v19.0: Compromise Software Supply Chain. |
| fixable | technique-name-mismatch | site/src/content/incidents/cegedim-sante-health-breach-2026.md#mitreMappings[1] | Technique name should match ATT&CK v19.0: Data from Cloud Storage. |
| fixable | technique-name-mismatch | site/src/content/incidents/cisco-trivy-supply-chain-breach-2026.md#mitreMappings[0] | Technique name should match ATT&CK v19.0: Compromise Software Supply Chain. |
| fixable | technique-name-mismatch | site/src/content/incidents/cisco-trivy-supply-chain-breach-2026.md#mitreMappings[1] | Technique name should match ATT&CK v19.0: Credentials In Files. |
| fixable | technique-name-mismatch | site/src/content/incidents/code-red-nimda-worm-outbreaks-2001.md#mitreMappings[1] | Technique name should match ATT&CK v19.0: Spearphishing Attachment. |
| fixable | technique-name-mismatch | site/src/content/incidents/crowdstrike-falcon-global-bsod-outage-2024.md#mitreMappings[0] | Technique name should match ATT&CK v19.0: Compromise Software Supply Chain. |
| fixable | technique-name-mismatch | site/src/content/incidents/crowdstrike-falcon-global-bsod-outage-2024.md#mitreMappings[1] | Technique name should match ATT&CK v19.0: Application or System Exploitation. |
| fixable | technique-name-mismatch | site/src/content/incidents/crowdstrike-falcon-global-bsod-outage-2024.md#mitreMappings[2] | Technique name should match ATT&CK v19.0: Disk Structure Wipe. |
| fixable | technique-name-mismatch | site/src/content/incidents/diginotar-certificate-authority-compromise-2011.md#mitreMappings[1] | Technique name should match ATT&CK v19.0: Digital Certificates. |
| fixable | technique-name-mismatch | site/src/content/incidents/docketwise-immigration-data-breach-2026.md#mitreMappings[2] | Technique name should match ATT&CK v19.0: Data from Cloud Storage. |
| fixable | technique-name-mismatch | site/src/content/incidents/european-commission-trivy-breach-2026.md#mitreMappings[0] | Technique name should match ATT&CK v19.0: Compromise Software Supply Chain. |
| fixable | technique-name-mismatch | site/src/content/incidents/european-commission-trivy-breach-2026.md#mitreMappings[2] | Technique name should match ATT&CK v19.0: Data from Cloud Storage. |
| fixable | technique-name-mismatch | site/src/content/incidents/fireeye-red-team-tools-breach-2020.md#mitreMappings[0] | Technique name should match ATT&CK v19.0: Compromise Software Supply Chain. |
| fixable | technique-name-mismatch | site/src/content/incidents/iloveyou-worm-outbreak-2000.md#mitreMappings[0] | Technique name should match ATT&CK v19.0: Spearphishing Attachment. |
| fixable | technique-name-mismatch | site/src/content/incidents/iloveyou-worm-outbreak-2000.md#mitreMappings[1] | Technique name should match ATT&CK v19.0: Malicious File. |
| fixable | technique-name-mismatch | site/src/content/incidents/iloveyou-worm-outbreak-2000.md#mitreMappings[2] | Technique name should match ATT&CK v19.0: Visual Basic. |
| fixable | technique-name-mismatch | site/src/content/incidents/kaseya-vsa-supply-chain-attack-2021.md#mitreMappings[0] | Technique name should match ATT&CK v19.0: Compromise Software Supply Chain. |
| fixable | technique-name-mismatch | site/src/content/incidents/kaseya-vsa-supply-chain-attack-2021.md#mitreMappings[2] | Technique name should match ATT&CK v19.0: PowerShell. |


_120 additional finding(s) omitted from this table; see JSON output if generated._

## Review-Required ATT&CK v19 Tactic Split Candidates

| Severity | Category | Location | Finding |
|---|---|---|---|
| review-required | v19-defense-evasion-split-candidate | site/src/content/campaigns/m365-oauth-device-code-phishing-2026.md#mitreMappings[2] | Mapped tactic "Defense Evasion" is not among ATT&CK v19.0 tactics: Lateral Movement. |
| review-required | v19-defense-evasion-split-candidate | site/src/content/campaigns/operation-cloud-hopper-msp-espionage-campaign.md#mitreMappings[2] | Mapped tactic "Defense Evasion" is not among ATT&CK v19.0 tactics: Initial Access, Persistence, Privilege Escalation, Stealth. |
| review-required | v19-defense-evasion-split-candidate | site/src/content/campaigns/operation-truechaos.md#mitreMappings[1] | Mapped tactic "Defense Evasion" is not among ATT&CK v19.0 tactics: Execution, Stealth. |
| review-required | v19-defense-evasion-split-candidate | site/src/content/campaigns/solarwinds-supply-chain-campaign.md#mitreMappings[3] | Mapped tactic "Defense Evasion" is not among ATT&CK v19.0 tactics: Defense Impairment, Privilege Escalation. |
| review-required | v19-defense-evasion-split-candidate | site/src/content/campaigns/teampcp-supply-chain-campaign-2026.md#mitreMappings[3] | Mapped tactic "Defense Evasion" is not among ATT&CK v19.0 tactics: Stealth. |
| review-required | v19-defense-evasion-split-candidate | site/src/content/incidents/lexisnexis-react2shell-breach-2026.md#mitreMappings[2] | Mapped tactic "Defense Evasion" is not among ATT&CK v19.0 tactics: Initial Access, Persistence, Privilege Escalation, Stealth. |
| review-required | v19-defense-evasion-split-candidate | site/src/content/incidents/m365-oauth-device-code-phishing-2026.md#mitreMappings[2] | Mapped tactic "Defense Evasion" is not among ATT&CK v19.0 tactics: Lateral Movement. |
| review-required | v19-defense-evasion-split-candidate | site/src/content/incidents/operation-truechaos-trueconf-zero-day-2026.md#mitreMappings[1] | Mapped tactic "Defense Evasion" is not among ATT&CK v19.0 tactics: Execution, Stealth. |
| review-required | v19-defense-evasion-split-candidate | site/src/content/incidents/solarwinds-orion-supply-chain-compromise-2020.md#mitreMappings[2] | Mapped tactic "Defense Evasion" is not among ATT&CK v19.0 tactics: Stealth. |
| review-required | v19-defense-evasion-split-candidate | site/src/content/incidents/solarwinds-orion-supply-chain-compromise-2020.md#mitreMappings[3] | Mapped tactic "Defense Evasion" is not among ATT&CK v19.0 tactics: Stealth. |
| review-required | v19-defense-evasion-split-candidate | site/src/content/threat-actors/apt27.md#mitreMappings[2] | Mapped tactic "Defense Evasion" is not among ATT&CK v19.0 tactics: Execution, Stealth. |
| review-required | v19-defense-evasion-split-candidate | site/src/content/threat-actors/apt29.md#mitreMappings[1] | Mapped tactic "Defense Evasion" is not among ATT&CK v19.0 tactics: Defense Impairment, Privilege Escalation. |
| review-required | v19-defense-evasion-split-candidate | site/src/content/threat-actors/apt41.md#mitreMappings[2] | Mapped tactic "Defense Evasion" is not among ATT&CK v19.0 tactics: Execution, Stealth. |
| review-required | v19-defense-evasion-split-candidate | site/src/content/threat-actors/evil-corp.md#mitreMappings[2] | Mapped tactic "Defense Evasion" is not among ATT&CK v19.0 tactics: Privilege Escalation, Stealth. |
| review-required | v19-defense-evasion-split-candidate | site/src/content/threat-actors/eviltokens.md#mitreMappings[2] | Mapped tactic "Defense Evasion" is not among ATT&CK v19.0 tactics: Lateral Movement. |
| review-required | v19-defense-evasion-split-candidate | site/src/content/threat-actors/ransomhouse.md#mitreMappings[2] | Mapped tactic "Defense Evasion" is not among ATT&CK v19.0 tactics: Stealth. |
| review-required | v19-defense-evasion-split-candidate | site/src/content/threat-actors/salt-typhoon.md#mitreMappings[2] | Mapped tactic "Defense Evasion" is not among ATT&CK v19.0 tactics: Stealth. |
| review-required | v19-defense-evasion-split-candidate | site/src/content/threat-actors/sandworm.md#mitreMappings[3] | Mapped tactic "Defense Evasion" is not among ATT&CK v19.0 tactics: Stealth. |
| review-required | v19-defense-evasion-split-candidate | site/src/content/threat-actors/scattered-spider.md#mitreMappings[2] | Mapped tactic "Defense Evasion" is not among ATT&CK v19.0 tactics: Stealth. |
| review-required | v19-defense-evasion-split-candidate | site/src/content/threat-actors/turla.md#mitreMappings[1] | Mapped tactic "Defense Evasion" is not among ATT&CK v19.0 tactics: Stealth. |
| review-required | v19-defense-evasion-split-candidate | site/src/content/threat-actors/volt-typhoon.md#mitreMappings[0] | Mapped tactic "Defense Evasion" is not among ATT&CK v19.0 tactics: Stealth. |
| review-required | v19-defense-evasion-split-candidate | site/src/content/threat-actors/wizard-spider.md#mitreMappings[2] | Mapped tactic "Defense Evasion" is not among ATT&CK v19.0 tactics: Privilege Escalation, Stealth. |
| review-required | v19-defense-evasion-split-candidate | site/src/content/zero-days/cisco-catalyst-sd-wan-manager-cve-2026-20128.md#mitreMappings[1] | Mapped tactic "Defense Evasion" is not among ATT&CK v19.0 tactics: Initial Access, Persistence, Privilege Escalation, Stealth. |
| review-required | v19-defense-evasion-split-candidate | site/src/content/zero-days/microsoft-windows-cve-2026-32202.md#mitreMappings[0] | Mapped tactic "Defense Evasion" is not among ATT&CK v19.0 tactics: Stealth. |
| review-required | v19-defense-evasion-split-candidate | site/src/content/zero-days/trueconf-cve-2026-3502.md#mitreMappings[1] | Mapped tactic "Defense Evasion" is not among ATT&CK v19.0 tactics: Execution, Stealth. |
| review-required | v19-defense-evasion-split-candidate | site/src/content/zero-days/trueconf-cve-2026-3502.md#mitreMappings[3] | Mapped tactic "Defense Evasion" is not among ATT&CK v19.0 tactics: Defense Impairment. |
| review-required | v19-defense-evasion-split-candidate | site/src/content/zero-days/webpros-cpanel-and-whm-and-wp2-wordpress-sq-cve-2026-41940.md#mitreMappings[2] | Mapped tactic "Defense Evasion" is not among ATT&CK v19.0 tactics: Initial Access, Persistence, Privilege Escalation, Stealth. |


## Errors And Warnings

| Severity | Category | Location | Finding |
|---|---|---|---|
| warning | tactic-mismatch | site/src/content/campaigns/notpetya-destructive-campaign-2017.md#mitreMappings[3] | Mapped tactic "Lateral Movement" is not among ATT&CK v19.0 tactics: Execution. |
| error | revoked-technique | site/src/content/campaigns/operation-truechaos.md#mitreMappings[1] | T1574.002 is revoked in pinned ATT&CK Enterprise v19.0. |
| error | unknown-technique-id | site/src/content/campaigns/sandworm-ukraine-power-grid-campaign-2015.md#mitreMappings[0] | Technique ID is not present in pinned ATT&CK Enterprise v19.0. |
| error | unknown-technique-id | site/src/content/campaigns/sandworm-ukraine-power-grid-campaign-2015.md#mitreMappings[1] | Technique ID is not present in pinned ATT&CK Enterprise v19.0. |
| error | unknown-technique-id | site/src/content/campaigns/sandworm-ukraine-power-grid-campaign-2015.md#mitreMappings[2] | Technique ID is not present in pinned ATT&CK Enterprise v19.0. |
| error | unknown-technique-id | site/src/content/campaigns/sandworm-ukraine-power-grid-campaign-2015.md#mitreMappings[3] | Technique ID is not present in pinned ATT&CK Enterprise v19.0. |
| error | revoked-technique | site/src/content/incidents/operation-truechaos-trueconf-zero-day-2026.md#mitreMappings[1] | T1574.002 is revoked in pinned ATT&CK Enterprise v19.0. |
| error | unknown-technique-id | site/src/content/incidents/stuxnet-iran-nuclear-sabotage-2010.md#mitreMappings[2] | Technique ID is not present in pinned ATT&CK Enterprise v19.0. |
| error | unknown-technique-id | site/src/content/incidents/ukraine-power-grid-industroyer-2016.md#mitreMappings[0] | Technique ID is not present in pinned ATT&CK Enterprise v19.0. |
| error | revoked-technique | site/src/content/threat-actors/apt27.md#mitreMappings[2] | T1574.002 is revoked in pinned ATT&CK Enterprise v19.0. |
| error | revoked-technique | site/src/content/threat-actors/apt41.md#mitreMappings[2] | T1574.002 is revoked in pinned ATT&CK Enterprise v19.0. |
| error | revoked-technique | site/src/content/threat-actors/ransomhouse.md#mitreMappings[2] | T1562.004 is revoked in pinned ATT&CK Enterprise v19.0. |
| error | revoked-technique | site/src/content/threat-actors/sandworm.md#mitreMappings[3] | T1562.001 is revoked in pinned ATT&CK Enterprise v19.0. |
| error | revoked-technique | site/src/content/threat-actors/scattered-spider.md#mitreMappings[2] | T1656 is revoked in pinned ATT&CK Enterprise v19.0. |
| warning | tactic-mismatch | site/src/content/zero-days/microsoft-visual-basic-for-applications-vba--cve-2012-1854.md#mitreMappings[0] | Mapped tactic "Persistence" is not among ATT&CK v19.0 tactics: Execution, Stealth. |
| error | revoked-technique | site/src/content/zero-days/microsoft-windows-cve-2026-32202.md#mitreMappings[0] | T1562 is revoked in pinned ATT&CK Enterprise v19.0. |
| error | unknown-technique-id | site/src/content/zero-days/stuxnet-lnk-shortcut-cve-2010-2568.md#mitreMappings[2] | Technique ID is not present in pinned ATT&CK Enterprise v19.0. |
| error | revoked-technique | site/src/content/zero-days/trueconf-cve-2026-3502.md#mitreMappings[1] | T1574.002 is revoked in pinned ATT&CK Enterprise v19.0. |


## Metadata Gaps

| Severity | Category | Location | Finding |
|---|---|---|---|
| metadata-gap | missing-attack-version | site/src/content/campaigns/applejeus-dprk-cryptocurrency-targeting-campaign.md#mitreMappings[0] | Mapping is missing attackVersion/attack_version metadata. |
| metadata-gap | missing-confidence | site/src/content/campaigns/applejeus-dprk-cryptocurrency-targeting-campaign.md#mitreMappings[0] | Mapping is missing confidence metadata. |
| metadata-gap | missing-evidence | site/src/content/campaigns/applejeus-dprk-cryptocurrency-targeting-campaign.md#mitreMappings[0] | Mapping is missing evidence metadata. |
| metadata-gap | missing-attack-version | site/src/content/campaigns/applejeus-dprk-cryptocurrency-targeting-campaign.md#mitreMappings[1] | Mapping is missing attackVersion/attack_version metadata. |
| metadata-gap | missing-confidence | site/src/content/campaigns/applejeus-dprk-cryptocurrency-targeting-campaign.md#mitreMappings[1] | Mapping is missing confidence metadata. |
| metadata-gap | missing-evidence | site/src/content/campaigns/applejeus-dprk-cryptocurrency-targeting-campaign.md#mitreMappings[1] | Mapping is missing evidence metadata. |
| metadata-gap | missing-attack-version | site/src/content/campaigns/applejeus-dprk-cryptocurrency-targeting-campaign.md#mitreMappings[2] | Mapping is missing attackVersion/attack_version metadata. |
| metadata-gap | missing-confidence | site/src/content/campaigns/applejeus-dprk-cryptocurrency-targeting-campaign.md#mitreMappings[2] | Mapping is missing confidence metadata. |
| metadata-gap | missing-evidence | site/src/content/campaigns/applejeus-dprk-cryptocurrency-targeting-campaign.md#mitreMappings[2] | Mapping is missing evidence metadata. |
| metadata-gap | missing-attack-version | site/src/content/campaigns/applejeus-dprk-cryptocurrency-targeting-campaign.md#mitreMappings[3] | Mapping is missing attackVersion/attack_version metadata. |
| metadata-gap | missing-confidence | site/src/content/campaigns/applejeus-dprk-cryptocurrency-targeting-campaign.md#mitreMappings[3] | Mapping is missing confidence metadata. |
| metadata-gap | missing-evidence | site/src/content/campaigns/applejeus-dprk-cryptocurrency-targeting-campaign.md#mitreMappings[3] | Mapping is missing evidence metadata. |
| metadata-gap | missing-attack-version | site/src/content/campaigns/applejeus-dprk-cryptocurrency-targeting-campaign.md#mitreMappings[4] | Mapping is missing attackVersion/attack_version metadata. |
| metadata-gap | missing-confidence | site/src/content/campaigns/applejeus-dprk-cryptocurrency-targeting-campaign.md#mitreMappings[4] | Mapping is missing confidence metadata. |
| metadata-gap | missing-evidence | site/src/content/campaigns/applejeus-dprk-cryptocurrency-targeting-campaign.md#mitreMappings[4] | Mapping is missing evidence metadata. |
| metadata-gap | missing-attack-version | site/src/content/campaigns/carbanak-banking-campaign-2013.md#mitreMappings[0] | Mapping is missing attackVersion/attack_version metadata. |
| metadata-gap | missing-confidence | site/src/content/campaigns/carbanak-banking-campaign-2013.md#mitreMappings[0] | Mapping is missing confidence metadata. |
| metadata-gap | missing-evidence | site/src/content/campaigns/carbanak-banking-campaign-2013.md#mitreMappings[0] | Mapping is missing evidence metadata. |
| metadata-gap | missing-attack-version | site/src/content/campaigns/carbanak-banking-campaign-2013.md#mitreMappings[1] | Mapping is missing attackVersion/attack_version metadata. |
| metadata-gap | missing-confidence | site/src/content/campaigns/carbanak-banking-campaign-2013.md#mitreMappings[1] | Mapping is missing confidence metadata. |
| metadata-gap | missing-evidence | site/src/content/campaigns/carbanak-banking-campaign-2013.md#mitreMappings[1] | Mapping is missing evidence metadata. |
| metadata-gap | missing-attack-version | site/src/content/campaigns/carbanak-banking-campaign-2013.md#mitreMappings[2] | Mapping is missing attackVersion/attack_version metadata. |
| metadata-gap | missing-confidence | site/src/content/campaigns/carbanak-banking-campaign-2013.md#mitreMappings[2] | Mapping is missing confidence metadata. |
| metadata-gap | missing-evidence | site/src/content/campaigns/carbanak-banking-campaign-2013.md#mitreMappings[2] | Mapping is missing evidence metadata. |
| metadata-gap | missing-attack-version | site/src/content/campaigns/carbanak-banking-campaign-2013.md#mitreMappings[3] | Mapping is missing attackVersion/attack_version metadata. |
| metadata-gap | missing-confidence | site/src/content/campaigns/carbanak-banking-campaign-2013.md#mitreMappings[3] | Mapping is missing confidence metadata. |
| metadata-gap | missing-evidence | site/src/content/campaigns/carbanak-banking-campaign-2013.md#mitreMappings[3] | Mapping is missing evidence metadata. |
| metadata-gap | missing-attack-version | site/src/content/campaigns/dragonforce-ransomware-campaign-april-2026.md#mitreMappings[0] | Mapping is missing attackVersion/attack_version metadata. |
| metadata-gap | missing-confidence | site/src/content/campaigns/dragonforce-ransomware-campaign-april-2026.md#mitreMappings[0] | Mapping is missing confidence metadata. |
| metadata-gap | missing-evidence | site/src/content/campaigns/dragonforce-ransomware-campaign-april-2026.md#mitreMappings[0] | Mapping is missing evidence metadata. |
| metadata-gap | missing-attack-version | site/src/content/campaigns/dragonforce-ransomware-campaign-april-2026.md#mitreMappings[1] | Mapping is missing attackVersion/attack_version metadata. |
| metadata-gap | missing-confidence | site/src/content/campaigns/dragonforce-ransomware-campaign-april-2026.md#mitreMappings[1] | Mapping is missing confidence metadata. |
| metadata-gap | missing-evidence | site/src/content/campaigns/dragonforce-ransomware-campaign-april-2026.md#mitreMappings[1] | Mapping is missing evidence metadata. |
| metadata-gap | missing-attack-version | site/src/content/campaigns/dragonforce-ransomware-campaign-april-2026.md#mitreMappings[2] | Mapping is missing attackVersion/attack_version metadata. |
| metadata-gap | missing-confidence | site/src/content/campaigns/dragonforce-ransomware-campaign-april-2026.md#mitreMappings[2] | Mapping is missing confidence metadata. |
| metadata-gap | missing-evidence | site/src/content/campaigns/dragonforce-ransomware-campaign-april-2026.md#mitreMappings[2] | Mapping is missing evidence metadata. |
| metadata-gap | missing-attack-version | site/src/content/campaigns/dragonforce-ransomware-campaign-april-2026.md#mitreMappings[3] | Mapping is missing attackVersion/attack_version metadata. |
| metadata-gap | missing-confidence | site/src/content/campaigns/dragonforce-ransomware-campaign-april-2026.md#mitreMappings[3] | Mapping is missing confidence metadata. |
| metadata-gap | missing-evidence | site/src/content/campaigns/dragonforce-ransomware-campaign-april-2026.md#mitreMappings[3] | Mapping is missing evidence metadata. |
| metadata-gap | missing-attack-version | site/src/content/campaigns/frostarmada-soho-dns-hijacking-2026.md#mitreMappings[0] | Mapping is missing attackVersion/attack_version metadata. |
| metadata-gap | missing-confidence | site/src/content/campaigns/frostarmada-soho-dns-hijacking-2026.md#mitreMappings[0] | Mapping is missing confidence metadata. |
| metadata-gap | missing-evidence | site/src/content/campaigns/frostarmada-soho-dns-hijacking-2026.md#mitreMappings[0] | Mapping is missing evidence metadata. |
| metadata-gap | missing-attack-version | site/src/content/campaigns/frostarmada-soho-dns-hijacking-2026.md#mitreMappings[1] | Mapping is missing attackVersion/attack_version metadata. |
| metadata-gap | missing-confidence | site/src/content/campaigns/frostarmada-soho-dns-hijacking-2026.md#mitreMappings[1] | Mapping is missing confidence metadata. |
| metadata-gap | missing-evidence | site/src/content/campaigns/frostarmada-soho-dns-hijacking-2026.md#mitreMappings[1] | Mapping is missing evidence metadata. |
| metadata-gap | missing-attack-version | site/src/content/campaigns/frostarmada-soho-dns-hijacking-2026.md#mitreMappings[2] | Mapping is missing attackVersion/attack_version metadata. |
| metadata-gap | missing-confidence | site/src/content/campaigns/frostarmada-soho-dns-hijacking-2026.md#mitreMappings[2] | Mapping is missing confidence metadata. |
| metadata-gap | missing-evidence | site/src/content/campaigns/frostarmada-soho-dns-hijacking-2026.md#mitreMappings[2] | Mapping is missing evidence metadata. |
| metadata-gap | missing-attack-version | site/src/content/campaigns/frostarmada-soho-dns-hijacking-2026.md#mitreMappings[3] | Mapping is missing attackVersion/attack_version metadata. |
| metadata-gap | missing-confidence | site/src/content/campaigns/frostarmada-soho-dns-hijacking-2026.md#mitreMappings[3] | Mapping is missing confidence metadata. |
| metadata-gap | missing-evidence | site/src/content/campaigns/frostarmada-soho-dns-hijacking-2026.md#mitreMappings[3] | Mapping is missing evidence metadata. |
| metadata-gap | missing-attack-version | site/src/content/campaigns/hafnium-exchange-server-exploitation-campaign-2021.md#mitreMappings[0] | Mapping is missing attackVersion/attack_version metadata. |
| metadata-gap | missing-confidence | site/src/content/campaigns/hafnium-exchange-server-exploitation-campaign-2021.md#mitreMappings[0] | Mapping is missing confidence metadata. |
| metadata-gap | missing-evidence | site/src/content/campaigns/hafnium-exchange-server-exploitation-campaign-2021.md#mitreMappings[0] | Mapping is missing evidence metadata. |
| metadata-gap | missing-attack-version | site/src/content/campaigns/hafnium-exchange-server-exploitation-campaign-2021.md#mitreMappings[1] | Mapping is missing attackVersion/attack_version metadata. |
| metadata-gap | missing-confidence | site/src/content/campaigns/hafnium-exchange-server-exploitation-campaign-2021.md#mitreMappings[1] | Mapping is missing confidence metadata. |
| metadata-gap | missing-evidence | site/src/content/campaigns/hafnium-exchange-server-exploitation-campaign-2021.md#mitreMappings[1] | Mapping is missing evidence metadata. |
| metadata-gap | missing-attack-version | site/src/content/campaigns/hafnium-exchange-server-exploitation-campaign-2021.md#mitreMappings[2] | Mapping is missing attackVersion/attack_version metadata. |
| metadata-gap | missing-confidence | site/src/content/campaigns/hafnium-exchange-server-exploitation-campaign-2021.md#mitreMappings[2] | Mapping is missing confidence metadata. |
| metadata-gap | missing-evidence | site/src/content/campaigns/hafnium-exchange-server-exploitation-campaign-2021.md#mitreMappings[2] | Mapping is missing evidence metadata. |
| metadata-gap | missing-attack-version | site/src/content/campaigns/hafnium-exchange-server-exploitation-campaign-2021.md#mitreMappings[3] | Mapping is missing attackVersion/attack_version metadata. |
| metadata-gap | missing-confidence | site/src/content/campaigns/hafnium-exchange-server-exploitation-campaign-2021.md#mitreMappings[3] | Mapping is missing confidence metadata. |
| metadata-gap | missing-evidence | site/src/content/campaigns/hafnium-exchange-server-exploitation-campaign-2021.md#mitreMappings[3] | Mapping is missing evidence metadata. |
| metadata-gap | missing-attack-version | site/src/content/campaigns/m365-oauth-device-code-phishing-2026.md#mitreMappings[0] | Mapping is missing attackVersion/attack_version metadata. |
| metadata-gap | missing-confidence | site/src/content/campaigns/m365-oauth-device-code-phishing-2026.md#mitreMappings[0] | Mapping is missing confidence metadata. |
| metadata-gap | missing-evidence | site/src/content/campaigns/m365-oauth-device-code-phishing-2026.md#mitreMappings[0] | Mapping is missing evidence metadata. |
| metadata-gap | missing-attack-version | site/src/content/campaigns/m365-oauth-device-code-phishing-2026.md#mitreMappings[1] | Mapping is missing attackVersion/attack_version metadata. |
| metadata-gap | missing-confidence | site/src/content/campaigns/m365-oauth-device-code-phishing-2026.md#mitreMappings[1] | Mapping is missing confidence metadata. |
| metadata-gap | missing-evidence | site/src/content/campaigns/m365-oauth-device-code-phishing-2026.md#mitreMappings[1] | Mapping is missing evidence metadata. |
| metadata-gap | missing-attack-version | site/src/content/campaigns/m365-oauth-device-code-phishing-2026.md#mitreMappings[2] | Mapping is missing attackVersion/attack_version metadata. |
| metadata-gap | missing-confidence | site/src/content/campaigns/m365-oauth-device-code-phishing-2026.md#mitreMappings[2] | Mapping is missing confidence metadata. |
| metadata-gap | missing-evidence | site/src/content/campaigns/m365-oauth-device-code-phishing-2026.md#mitreMappings[2] | Mapping is missing evidence metadata. |
| metadata-gap | missing-attack-version | site/src/content/campaigns/notpetya-destructive-campaign-2017.md#mitreMappings[0] | Mapping is missing attackVersion/attack_version metadata. |
| metadata-gap | missing-confidence | site/src/content/campaigns/notpetya-destructive-campaign-2017.md#mitreMappings[0] | Mapping is missing confidence metadata. |
| metadata-gap | missing-evidence | site/src/content/campaigns/notpetya-destructive-campaign-2017.md#mitreMappings[0] | Mapping is missing evidence metadata. |
| metadata-gap | missing-attack-version | site/src/content/campaigns/notpetya-destructive-campaign-2017.md#mitreMappings[1] | Mapping is missing attackVersion/attack_version metadata. |
| metadata-gap | missing-confidence | site/src/content/campaigns/notpetya-destructive-campaign-2017.md#mitreMappings[1] | Mapping is missing confidence metadata. |
| metadata-gap | missing-evidence | site/src/content/campaigns/notpetya-destructive-campaign-2017.md#mitreMappings[1] | Mapping is missing evidence metadata. |
| metadata-gap | missing-attack-version | site/src/content/campaigns/notpetya-destructive-campaign-2017.md#mitreMappings[2] | Mapping is missing attackVersion/attack_version metadata. |
| metadata-gap | missing-confidence | site/src/content/campaigns/notpetya-destructive-campaign-2017.md#mitreMappings[2] | Mapping is missing confidence metadata. |
| metadata-gap | missing-evidence | site/src/content/campaigns/notpetya-destructive-campaign-2017.md#mitreMappings[2] | Mapping is missing evidence metadata. |
| metadata-gap | missing-attack-version | site/src/content/campaigns/notpetya-destructive-campaign-2017.md#mitreMappings[3] | Mapping is missing attackVersion/attack_version metadata. |
| metadata-gap | missing-confidence | site/src/content/campaigns/notpetya-destructive-campaign-2017.md#mitreMappings[3] | Mapping is missing confidence metadata. |
| metadata-gap | missing-evidence | site/src/content/campaigns/notpetya-destructive-campaign-2017.md#mitreMappings[3] | Mapping is missing evidence metadata. |
| metadata-gap | missing-attack-version | site/src/content/campaigns/notpetya-destructive-campaign-2017.md#mitreMappings[4] | Mapping is missing attackVersion/attack_version metadata. |
| metadata-gap | missing-confidence | site/src/content/campaigns/notpetya-destructive-campaign-2017.md#mitreMappings[4] | Mapping is missing confidence metadata. |
| metadata-gap | missing-evidence | site/src/content/campaigns/notpetya-destructive-campaign-2017.md#mitreMappings[4] | Mapping is missing evidence metadata. |
| metadata-gap | missing-attack-version | site/src/content/campaigns/notpetya-destructive-campaign-2017.md#mitreMappings[5] | Mapping is missing attackVersion/attack_version metadata. |
| metadata-gap | missing-confidence | site/src/content/campaigns/notpetya-destructive-campaign-2017.md#mitreMappings[5] | Mapping is missing confidence metadata. |
| metadata-gap | missing-evidence | site/src/content/campaigns/notpetya-destructive-campaign-2017.md#mitreMappings[5] | Mapping is missing evidence metadata. |
| metadata-gap | missing-attack-version | site/src/content/campaigns/operation-aurora-espionage-campaign-2009.md#mitreMappings[0] | Mapping is missing attackVersion/attack_version metadata. |
| metadata-gap | missing-confidence | site/src/content/campaigns/operation-aurora-espionage-campaign-2009.md#mitreMappings[0] | Mapping is missing confidence metadata. |
| metadata-gap | missing-evidence | site/src/content/campaigns/operation-aurora-espionage-campaign-2009.md#mitreMappings[0] | Mapping is missing evidence metadata. |
| metadata-gap | missing-attack-version | site/src/content/campaigns/operation-aurora-espionage-campaign-2009.md#mitreMappings[1] | Mapping is missing attackVersion/attack_version metadata. |
| metadata-gap | missing-confidence | site/src/content/campaigns/operation-aurora-espionage-campaign-2009.md#mitreMappings[1] | Mapping is missing confidence metadata. |
| metadata-gap | missing-evidence | site/src/content/campaigns/operation-aurora-espionage-campaign-2009.md#mitreMappings[1] | Mapping is missing evidence metadata. |
| metadata-gap | missing-attack-version | site/src/content/campaigns/operation-aurora-espionage-campaign-2009.md#mitreMappings[2] | Mapping is missing attackVersion/attack_version metadata. |
| metadata-gap | missing-confidence | site/src/content/campaigns/operation-aurora-espionage-campaign-2009.md#mitreMappings[2] | Mapping is missing confidence metadata. |
| metadata-gap | missing-evidence | site/src/content/campaigns/operation-aurora-espionage-campaign-2009.md#mitreMappings[2] | Mapping is missing evidence metadata. |
| metadata-gap | missing-attack-version | site/src/content/campaigns/operation-aurora-espionage-campaign-2009.md#mitreMappings[3] | Mapping is missing attackVersion/attack_version metadata. |


_1331 additional finding(s) omitted from this table; see JSON output if generated._

## Recommended Next Step

Open a follow-up migration PR that applies only mechanically safe technique-name corrections first. Handle v19 tactic split candidates in a separate source-supported review pass; do not bulk-reclassify Defense Evasion mappings without checking article evidence.
