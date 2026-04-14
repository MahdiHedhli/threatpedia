---
name: "LockBit Black"
aliases:
  - "LockBit 3.0"
affiliation: "Unknown"
motivation: "Financial"
status: "active"
firstSeen: "2023"
lastSeen: "2026-Q1"
country: "Unknown"
targetSectors:
  - "Government"
  - "Healthcare"
  - "Financial"
  - "Education"
  - "Manufacturing"
targetGeographies:
  - "Global"
knownTools:
  - "LockBit 3.0 Ransomware"
  - "StealBit"
  - "Cobalt Strike"
tags:
  - "financially-motivated"
  - "cybercrime"
  - "ransomware"
  - "raas"
---

## Executive Summary
LockBit Black (commonly known as LockBit 3.0) is the third major iteration of the notorious LockBit Ransomware-as-a-Service (RaaS) operation. Emerging in mid-2022 and reaching peak dominance in 2023, LockBit 3.0 became the most widely deployed ransomware variant globally. Operating a sprawling affiliate model, the group targets organizations universally, severely impacting critical infrastructure, healthcare, and state governments. LockBit Black is distinctive for explicitly adopting corporate extortion tactics, including operating the first-ever ransomware bug bounty program and offering specialized tools designed for extreme encryption speeds.

## Notable Campaigns
- **Boeing Extortion (2023):** LockBit successfully breached parts of Boeing's global services division, attempting to extort the aerospace giant and subsequently leaking troves of proprietary corporate data after Boeing refused to pay the ransom.
- **ICBC US Subsidiary Incident:** A devastating attack against the US arm of the Industrial and Commercial Bank of China (ICBC), which severely temporarily disrupted the settlement of US Treasury trades, sending shockwaves through global financial markets.
- **Royal Mail Compromise (UK):** A prolonged disruption of the UK's Royal Mail international export services, causing massive logistical backlogs following a LockBit 3.0 infection.

## Technical Capabilities
LockBit Black demonstrates a high degree of technical sophistication, heavily borrowing code and techniques from the defunct BlackMatter and DarkSide ransomware families to optimize encryption speed and evasion. Initial access is highly varied due to the affiliate model (ranging from purchased RDP credentials to zero-day exploitation like CitrixBleed). Once deployed, LockBit 3.0 is highly modular, capable of booting infected systems into Safe Mode to bypass endpoint detection (EDR) before initiating multi-threaded encryption using AES and RSA cryptography. The toolkit also includes **StealBit**, a highly efficient custom data exfiltration tool designed to rapidly steal data before the encryption phase.

## Attribution
LockBit operates as a Russian-speaking cybercrime syndicate under a RaaS business model. In February 2024, an international law enforcement task force (Operation Cronos) successfully seized the LockBit leak sites and internal infrastructure, significantly degrading the operation. They subsequently unmasked the alleged mastermind behind the "LockBitSupp" persona as Russian national Dmitry Khoroshev, heavily sanctioning him and establishing definitive ties to Russian cybercrime ecosystems. Despite the takedown, the leaked LockBit 3.0 builder continues to be heavily utilized by numerous independent threat actors globally.

## Sources & References
- CISA #StopRansomware Advisory: LockBit 3.0
- Operation Cronos: NCA and FBI LockBit Takedown Press Release
