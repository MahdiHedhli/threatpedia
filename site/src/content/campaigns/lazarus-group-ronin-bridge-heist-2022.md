---
campaignId: "TP-CAMP-2022-0001"
title: "Lazarus Group Ronin Bridge Cryptocurrency Heist (2022)"
startDate: 2022-03-23
endDate: 2022-03-23
ongoing: false
attackType: "Cryptocurrency Theft via Validator Key Compromise"
severity: critical
sector: "Cryptocurrency / Decentralized Finance"
geography: "Global — Ronin Network (Sky Mavis)"
threatActor: "Lazarus Group"
attributionConfidence: A1
reviewStatus: "draft_ai"
confidenceGrade: B
generatedBy: "new-threat-intel-automation"
generatedDate: 2026-05-08
cves: []
relatedIncidents: []
tags:
  - "lazarus-group"
  - "north-korea"
  - "ronin-network"
  - "axie-infinity"
  - "cryptocurrency"
  - "defi"
  - "ofac"
  - "bridge-exploit"
sources:
  - url: "https://home.treasury.gov/news/press-releases/jy0768"
    publisher: "U.S. Department of the Treasury"
    publisherType: government
    reliability: R1
    publicationDate: "2022-04-14"
    accessDate: "2026-05-08"
    archived: false
  - url: "https://ofac.treasury.gov/recent-actions/04142022"
    publisher: "U.S. Department of the Treasury"
    publisherType: government
    reliability: R1
    publicationDate: "2022-04-14"
    accessDate: "2026-05-08"
    archived: false
  - url: "https://www.justice.gov/opa/pr/justice-department-announces-charges-and-sanctions-against-north-korean-cryptocurrency"
    publisher: "U.S. Department of Justice"
    publisherType: government
    reliability: R1
    publicationDate: "2022-04-14"
    accessDate: "2026-05-08"
    archived: false
  - url: "https://www.fbi.gov/news/press-releases/fbi-confirms-north-korean-lazarus-group-responsible-for-harmony-horizon-bridge-theft"
    publisher: "Federal Bureau of Investigation"
    publisherType: government
    reliability: R1
    publicationDate: "2022-06-23"
    accessDate: "2026-05-08"
    archived: false
mitreMappings:
  - techniqueId: "T1078"
    techniqueName: "Valid Accounts"
    tactic: "Initial Access"
    notes: "The threat actor obtained private keys controlling five of the nine Ronin Network validator nodes, which was the threshold required to authorize bridge withdrawal transactions. These keys constituted valid credentials under the bridge multi-signature scheme, enabling the threat actor to authorize fraudulent withdrawals without exploiting a code vulnerability in the bridge smart contract."
  - techniqueId: "T1657"
    techniqueName: "Financial Theft"
    tactic: "Impact"
    notes: "Using the compromised validator key authority, the threat actor submitted two fraudulent withdrawal transactions that drained approximately 173,600 ETH and 25.5 million USDC from the Ronin Bridge, totaling approximately $625 million at the time of the theft. U.S. Treasury OFAC designated the primary receiving address and attributed the theft to the Lazarus Group in April 2022."
---

## Executive Summary

The Ronin Network bridge, a cross-chain bridge developed by Sky Mavis for the Axie Infinity blockchain game, was exploited on 2022-03-23 when a threat actor obtained private keys controlling five of the nine Ronin validator nodes and used them to authorize two fraudulent withdrawal transactions. The transactions drained approximately 173,600 ETH and 25.5 million USDC from the bridge, totaling approximately $625 million at the time of the theft. Sky Mavis did not detect the breach until 2022-03-29, when a user reported an inability to withdraw funds.

On 2022-04-14, the U.S. Department of the Treasury Office of Foreign Assets Control designated the Ethereum address associated with the stolen funds and publicly attributed the attack to the Lazarus Group, a threat actor assessed to operate on behalf of the North Korean government. The designation was coordinated with the U.S. Department of Justice. The U.S. government separately attributed the June 2022 Harmony Horizon Bridge cryptocurrency theft to the same threat actor, consistent with the Lazarus Group's documented pattern of targeting cross-chain bridge infrastructure during 2022.

## Technical Analysis

The Ronin Network operated a sidechain for the Axie Infinity game ecosystem, connected to the Ethereum mainnet through a multi-party bridge controlled by nine validator nodes. Withdrawals from the bridge required authorization from at least five of the nine validator nodes. The security model depended on the assumption that no single entity could obtain a majority of validator private keys without detection.

The threat actor obtained private keys for five of the nine validator nodes, reaching the authorization threshold required for the bridge multi-signature withdrawal scheme. The mechanism by which the private keys were obtained has not been confirmed in detail by the U.S. government attribution sources cited here. The OFAC designation and associated DOJ announcements confirm the theft and Lazarus Group attribution without detailing the key acquisition method.

After obtaining the necessary validator key material, the threat actor submitted two withdrawal transactions on 2022-03-23: one for 173,600 ETH and one for 25.5 million USDC. These transactions were signed with the compromised validator keys and executed at the smart contract level, transferring the funds to addresses under the threat actor's control. The transactions did not trigger any automated monitoring alert at the time of execution.

The stolen funds were subsequently moved through intermediate addresses. OFAC designated the primary receiving Ethereum address under existing North Korea sanctions authorities, blocking U.S. persons from transacting with it and placing virtual asset service providers on notice to screen for and block associated transactions.

## Attack Chain

### Stage 1: Validator Key Compromise

The threat actor obtained private keys for five of the nine Ronin Network validator nodes. The Ronin Bridge withdrawal scheme required a minimum of five validator signatures to authorize a withdrawal. Acquisition of five keys was sufficient to authorize arbitrary withdrawals without triggering a threshold failure. The key compromise occurred prior to 2022-03-23 and was not detected before the execution of the fraudulent transactions.

### Stage 2: Fraudulent Withdrawal Transaction Submission

On 2022-03-23, the threat actor used the five compromised validator keys to sign and submit two withdrawal transactions from the Ronin Bridge smart contract: 173,600 ETH and 25.5 million USDC. The transactions were signed with valid validator credentials and executed successfully without triggering automated monitoring or alerting at the time of execution.

### Stage 3: Fund Transfer to Threat Actor Addresses

The withdrawn assets were transferred to Ethereum addresses under the threat actor's control. OFAC designated the primary receiving address in its 2022-04-14 action. The total value of assets transferred was approximately $625 million at the time of the theft.

### Stage 4: Post-Theft Asset Movement

Following the theft, the threat actor moved stolen assets through additional addresses. OFAC designation of the primary receiving address on 2022-04-14 placed virtual asset service providers under notice to block transactions with the designated address. Asset movement methodology following the designation is addressed in OFAC and DOJ statements rather than detailed in the attribution documents cited here.

## MITRE ATT&CK Mapping

T1078 - Valid Accounts: The threat actor obtained private keys controlling five of the nine Ronin Network validator nodes. These keys constituted valid authorization credentials for the bridge 5-of-9 multi-signature withdrawal scheme. Possession of five keys was sufficient to authorize any withdrawal transaction, enabling the threat actor to act as legitimate validator nodes and drain the bridge without exploiting a vulnerability in the smart contract code itself.

T1657 - Financial Theft: Using the compromised validator keys, the threat actor submitted fraudulent withdrawal transactions that drained approximately 173,600 ETH and 25.5 million USDC from the Ronin Bridge. U.S. Treasury OFAC designated the primary receiving address on 2022-04-14 and attributed the theft to the Lazarus Group in coordination with the U.S. Department of Justice. The approximately $625 million value at the time of theft represented the largest publicly confirmed state-sponsored cryptocurrency theft at that time.

## Timeline

### 2022-03-23 — Ronin Bridge Compromised

The threat actor submitted two fraudulent withdrawal transactions from the Ronin Bridge, draining approximately 173,600 ETH and 25.5 million USDC. The total value of stolen assets was approximately $625 million at the time of the theft. No automated monitoring alert was triggered at the time of execution.

### 2022-03-29 — Breach Discovered

Sky Mavis discovered the unauthorized withdrawals after a user reported an inability to withdraw 5,000 ETH from the Ronin Bridge. Sky Mavis suspended the bridge and began incident response. Approximately six days elapsed between the execution of the fraudulent transactions and the discovery of the breach.

### 2022-04-14 — U.S. Government Attribution and OFAC Designation

The U.S. Department of the Treasury OFAC designated the Ethereum address associated with the Ronin Bridge theft, attributing the attack to the Lazarus Group under existing North Korea sanctions authorities. The designation blocked U.S. persons from transacting with the designated address and placed virtual asset service providers on notice. The U.S. Department of Justice made coordinated announcements regarding North Korean cryptocurrency theft and sanctions on the same date.

### 2022-06-23 — FBI Confirms Lazarus Group Attribution for Harmony Horizon Bridge Theft

The Federal Bureau of Investigation confirmed that the Lazarus Group was responsible for a separate cryptocurrency theft from the Harmony Horizon Bridge in June 2022. While distinct from the Ronin heist, the FBI attribution for this second major bridge exploit during 2022 corroborates the pattern of Lazarus Group targeting of cross-chain bridge infrastructure as documented by U.S. government agencies.

## Remediation & Mitigation

Organizations operating cross-chain bridge infrastructure should implement multi-party key management with hardware-backed key storage and strict physical and logical separation of validator key material. The Ronin Network 5-of-9 threshold proved insufficient when the threat actor obtained keys for five nodes. Threshold security depends on the robustness of key custody practices for each participating node, not only the threshold count. Hardware security modules and geographically distributed key custody reduce the risk of bulk key compromise.

Implement continuous monitoring and anomaly detection for bridge withdrawal activity. The Ronin Bridge breach went undetected for approximately six days because no automated monitoring flagged the fraudulent transactions at execution time. Monitoring thresholds should be calibrated to alert on large transactions, unusual withdrawal patterns, or off-hours activity that deviates from established operational baselines.

Virtual asset service providers must maintain updated OFAC Specially Designated Nationals List screening and comply with OFAC guidance on sanctions compliance for virtual currency businesses. OFAC designation of the primary receiving address on 2022-04-14 required regulated entities to block transactions with the designated address. Organizations should ensure wallet screening and transaction monitoring capabilities are calibrated to detect and block transactions involving newly designated addresses promptly.

Organizations in the decentralized finance and cryptocurrency sectors should review OFAC published guidance on virtual currency sanctions compliance. Regular review of OFAC recent actions provides notice of new designations relevant to cryptocurrency operations.

## Sources & References

- [U.S. Department of the Treasury: Treasury Designates Lazarus Group Cryptocurrency Theft Addresses — Ronin Network Attribution](https://home.treasury.gov/news/press-releases/jy0768) — U.S. Department of the Treasury, 2022-04-14
- [U.S. Department of the Treasury: OFAC Recent Actions April 14 2022](https://ofac.treasury.gov/recent-actions/04142022) — U.S. Department of the Treasury, 2022-04-14
- [U.S. Department of Justice: Justice Department Announces Charges and Sanctions Against North Korean Cryptocurrency](https://www.justice.gov/opa/pr/justice-department-announces-charges-and-sanctions-against-north-korean-cryptocurrency) — U.S. Department of Justice, 2022-04-14
- [Federal Bureau of Investigation: FBI Confirms North Korean Lazarus Group Responsible for Harmony Horizon Bridge Theft](https://www.fbi.gov/news/press-releases/fbi-confirms-north-korean-lazarus-group-responsible-for-harmony-horizon-bridge-theft) — Federal Bureau of Investigation, 2022-06-23
