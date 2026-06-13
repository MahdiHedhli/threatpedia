# Supply Chain Phase 2B Campaign Warning Audit

Date: 2026-06-13

## Purpose

Phase 2B will add supply-chain `RELATED_CAMPAIGN` edges and a hard dangling-edge check for campaign references. This audit separates existing campaign-quality warnings from the new Phase 2B failure class.

The current campaign validator warning is:

```text
has N related incident(s); spec target is 2+ confirmed incidents
```

That warning is a soft completeness target for public campaign articles. It is not evidence of a missing campaign node, and it must not be treated as the same thing as a dangling `RELATED_CAMPAIGN` edge.

## Current Warning Count

Command:

```bash
node scripts/validate-campaign-corpus.mjs
```

Result:

- 32 campaign files validated
- 29 warning-only campaign records have fewer than two `relatedIncidents`
- 0 campaign validator errors

## Supply-Chain-Relevant Warnings

These warning records are most relevant to Phase 2B because their campaign article title or tags are supply-chain-adjacent.

| campaign file | campaignId | related incident count | current relatedIncidents | Phase 2B handling |
| --- | --- | ---: | --- | --- |
| `ghost-cms-cve-2026-26980-fakecaptcha-campaign-may-2026.md` | `TP-CAMP-2026-0330` | 0 | none | Do not add a supply-chain corpus edge unless a modeled supply-chain incident exists and evidence supports it. |
| `lazarus-3cx-supply-chain-compromise-2023.md` | `TP-CAMP-2023-0002` | 1 | `3cx-desktopapp-software-supply-chain-compromise-2023` | Candidate for `SC-2023-THREE-CX-DESKTOP` only if evidence references support the campaign link. Existing low-count warning is not a dangling-edge blocker. |
| `megalodon-mass-github-repo-backdooring-campaign-2026.md` | `TP-CAMP-2026-0010` | 0 | none | Do not create Phase 2B edge unless corpus expansion later adds a modeled incident for this campaign. |
| `notpetya-destructive-campaign-2017.md` | `TP-CAMP-2017-0002` | 1 | `notpetya-wiper-attack-2017` | Candidate for `SC-2017-NOTPETYA-MEDOC` only if supply-chain incident references support the campaign link. Existing low-count warning is not a dangling-edge blocker. |
| `operation-truechaos.md` | `TP-CAMP-2026-0005` | 1 | `operation-truechaos-trueconf-zero-day-2026` | Do not add a supply-chain corpus edge unless a modeled supply-chain incident exists and evidence supports it. |

## Supply-Chain Campaigns Without Current Warning

These campaign records already meet the current public campaign related-incident count target and should still be resolved as campaign nodes if Phase 2B links to them.

| campaign file | campaignId | current relatedIncidents |
| --- | --- | --- |
| `solarwinds-supply-chain-campaign.md` | `TP-CAMP-2020-0001` | Existing related-incident count is at or above the current validator target. |
| `teampcp-supply-chain-campaign-2026.md` | `TP-CAMP-2026-0003` | `mercor-litellm-supply-chain-breach-2026`, `cisco-trivy-supply-chain-breach-2026`, `european-commission-trivy-breach-2026`, `trivy-cve-2026-33634` |

## Non-Supply-Chain Warnings

The remaining warning-only campaigns are outside the Phase 2B supply-chain graph path unless an incident explicitly links to them later:

- `applejeus-dprk-cryptocurrency-targeting-campaign.md`
- `carbanak-banking-campaign-2013.md`
- `china-nexus-covert-proxy-networks-2026.md`
- `cyberav3ngers-ics-water-sector-campaign-2023.md`
- `dragonforce-ransomware-campaign-april-2026.md`
- `frostarmada-soho-dns-hijacking-2026.md`
- `gray-sandstorm-m365-password-spray-middle-east-2026.md`
- `hafnium-exchange-server-exploitation-campaign-2021.md`
- `lazarus-group-ronin-bridge-heist-2022.md`
- `lockbit-ransomware-as-a-service-campaign.md`
- `m365-oauth-device-code-phishing-2026.md`
- `midnight-blizzard-svr-cloud-credential-campaign-2024.md`
- `moonlight-maze-us-government-espionage-campaign-1996-1999.md`
- `operation-aurora-espionage-campaign-2009.md`
- `operation-cloud-hopper-msp-espionage-campaign.md`
- `operation-dragon-whistle-ung0002-changzhou-university-2026.md`
- `operation-triangulation-ios-spyware-campaign-2019-2023.md`
- `red-lamassu-showboat-telecom-campaign-2026.md`
- `russian-intelligence-signal-whatsapp-account-compromise-2026.md`
- `salt-typhoon-telecom-intrusion-campaign.md`
- `seedworm-electronics-espionage-campaign-2026.md`
- `titan-rain.md`
- `wannacry-ransomware-campaign-2017.md`
- `world-cup-2026-ticket-and-brand-impersonation-campaigns.md`

## Phase 2B Implementation Guidance

- `RELATED_CAMPAIGN` validation should fail only when the supply-chain graph references a campaign node that cannot be resolved to an existing campaign record.
- The existing `relatedIncidents.length < 2` warning must remain a soft public-campaign completeness warning unless campaign policy is changed separately.
- Phase 2B should resolve campaign nodes from existing campaign records before adding edges. Use a stable campaign key consistently, and record both the public `campaignId` and file stem if the graph node format needs both operator readability and URL resolution.
- Add a supply-chain `RELATED_CAMPAIGN` edge only when the supply-chain incident has public evidence for that relationship and records the evidence reference.
- Do not create `RELATED_CAMPAIGN` edges simply to satisfy public campaign article related-incident counts.

## Phase 2B Candidate Edges To Review

These are candidate edges for Phase 2B review, not pre-approved links:

- `SC-2023-THREE-CX-DESKTOP` -> `TP-CAMP-2023-0002` / `lazarus-3cx-supply-chain-compromise-2023.md`
- `SC-2020-SOLARWINDS-ORION` -> `TP-CAMP-2020-0001` / `solarwinds-supply-chain-campaign.md`
- `SC-2017-NOTPETYA-MEDOC` -> `TP-CAMP-2017-0002` / `notpetya-destructive-campaign-2017.md`

Each candidate still needs an `attribution_evidence` or campaign evidence reference in the supply-chain incident before the edge is emitted.
