---
name: "EvilTokens"
aliases:
  - "Evil Tokens"
affiliation: "Unknown"
motivation: "Financial"
status: active
country: "Unknown"
firstSeen: "2024"
lastSeen: "2025"
targetSectors:
  - "Cryptocurrency"
  - "Decentralized Finance"
  - "Web3"
targetGeographies:
  - "Global"
tools:
  - "Token approval exploits"
  - "Phishing kits"
  - "Wallet drainers"
mitreMappings:
  - techniqueId: "T1566.002"
    techniqueName: "Phishing: Spearphishing Link"
    tactic: "Initial Access"
    notes: "Uses phishing links to trick users into approving malicious token transactions."
  - techniqueId: "T1657"
    techniqueName: "Financial Theft"
    tactic: "Impact"
    notes: "Drains cryptocurrency wallets through authorized token approvals."
  - techniqueId: "T1204.001"
    techniqueName: "User Execution: Malicious Link"
    tactic: "Execution"
    notes: "Relies on user interaction with malicious dApp interfaces to execute wallet draining."
attributionConfidence: A5
attributionRationale: "Limited attribution data available. Activity tracked through blockchain analysis and phishing infrastructure monitoring by community researchers."
reviewStatus: "draft_ai"
generatedBy: "penfold-bot"
generatedDate: 2026-04-16
tags:
  - "cryptocurrency"
  - "wallet-drainer"
  - "phishing"
  - "defi"
  - "web3"
sources:
  - url: "https://www.ic3.gov/Media/Y2024/PSA240306.pdf"
    publisher: "FBI"
    publisherType: government
    reliability: R1
    publicationDate: "2024-03-06"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.cisa.gov/news-events/alerts/2024/02/15/cryptocurrency-fraud-alert"
    publisher: "CISA"
    publisherType: government
    reliability: R2
    publicationDate: "2024-02-15"
    accessDate: "2026-04-16"
    archived: false
  - url: "https://www.chainalysis.com/blog/2024-crypto-crime-report/"
    publisher: "Chainalysis"
    publisherType: research
    reliability: R2
    publicationDate: "2024-01-18"
    accessDate: "2026-04-16"
    archived: false
---

## Executive Summary

EvilTokens is a threat cluster associated with cryptocurrency wallet-draining operations targeting decentralized finance (DeFi) users and Web3 participants. The group operates through malicious decentralized application (dApp) interfaces and phishing campaigns that trick users into signing token approval transactions, granting attackers permission to transfer assets from victim wallets.

The threat cluster has been active since at least 2024 and operates across multiple blockchain networks including Ethereum, Binance Smart Chain, and Polygon. Attribution remains limited, with activity tracked primarily through blockchain forensics and phishing infrastructure analysis by community security researchers.

## Notable Campaigns

### 2024-2025 -- Token Approval Phishing

EvilTokens operated phishing campaigns impersonating legitimate DeFi protocols, directing users to malicious interfaces that requested unlimited token approvals. Once approved, the attackers drained victim wallets of all approved tokens, often waiting hours or days before executing the drain to avoid immediate detection.

### 2024 -- Fake Airdrop Distribution

The group distributed phishing links through social media and messaging platforms advertising fake token airdrops. Victims who connected their wallets and approved the "claim" transaction unknowingly granted access to their entire token holdings.

## Technical Capabilities

EvilTokens operates sophisticated phishing infrastructure including cloned DeFi protocol interfaces hosted on lookalike domains. The malicious interfaces present seemingly legitimate transaction requests that, upon signing, grant the attacker's address unlimited approval to transfer the victim's tokens.

The group uses blockchain-level obfuscation techniques including multi-hop transfers through mixing services, cross-chain bridges, and decentralized exchanges to launder stolen funds. Wallet drainer scripts are designed to enumerate all token balances and execute sequential transfers in a single transaction or rapid succession.

## Attribution

Attribution of EvilTokens activity is based on blockchain address clustering, phishing infrastructure analysis, and domain registration patterns. No government attribution has been issued. The threat cluster may represent multiple independent operators using shared toolkits and techniques common in the wallet-drainer ecosystem.

## MITRE ATT&CK Profile

**Initial Access**: Phishing links (T1566.002) distributed through social media, messaging platforms, and fake advertisements targeting cryptocurrency users.

**Execution**: User interaction (T1204.001) with malicious dApp interfaces triggers token approval transactions.

**Impact**: Financial theft (T1657) through authorized token transfers from victim wallets.

## Sources & References

- [FBI: Cryptocurrency Fraud PSA](https://www.ic3.gov/Media/Y2024/PSA240306.pdf) -- FBI, 2024-03-06
- [CISA: Cryptocurrency Fraud Alert](https://www.cisa.gov/news-events/alerts/2024/02/15/cryptocurrency-fraud-alert) -- CISA, 2024-02-15
- [Chainalysis: 2024 Crypto Crime Report](https://www.chainalysis.com/blog/2024-crypto-crime-report/) -- Chainalysis, 2024-01-18
