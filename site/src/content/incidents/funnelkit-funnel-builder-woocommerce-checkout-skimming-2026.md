---
eventId: TP-2026-0308
title: "FunnelKit Funnel Builder Exploitation Injecting WooCommerce Checkout Skimmers (May 2026)"
date: 2026-05-14
attackType: web-skimming
severity: high
sector: E-commerce / WordPress and WooCommerce
geography: Global
threatActor: Unknown
attributionConfidence: A5
reviewStatus: draft_ai
confidenceGrade: C
generatedBy: dangermouse-bot
generatedDate: 2026-05-28
generation:
  provider: OpenAI
  model: gpt-5
  tool: codex
  agent: dangermouse-bot
  promptProfile: dangermouse-event-p1
cves:
  - "CVE-2026-47100"
relatedSlugs: []
tags:
  - funnelkit
  - funnel-builder
  - woocommerce
  - wordpress
  - web-skimming
  - magecart
sources:
  - url: "https://nvd.nist.gov/vuln/detail/CVE-2026-47100"
    publisher: "National Vulnerability Database"
    publisherType: government
    reliability: R1
    publicationDate: "2026-05-14"
    accessDate: "2026-05-28"
    archived: false
  - url: "https://sansec.io/research/funnelkit-woocommerce-vulnerability-exploited"
    publisher: "Sansec"
    publisherType: research
    reliability: R1
    publicationDate: "2026-05-14"
    accessDate: "2026-05-28"
    archived: false
  - url: "https://thehackernews.com/2026/05/funnel-builder-flaw-under-active.html"
    publisher: "The Hacker News"
    publisherType: media
    reliability: R2
    publicationDate: "2026-05-15"
    accessDate: "2026-05-28"
    archived: false
  - url: "https://www.scworld.com/brief/wordpress-funnel-builder-vulnerability-exploited-to-steal-payment-data"
    publisher: "SC Media"
    publisherType: media
    reliability: R2
    publicationDate: "2026-05-15"
    accessDate: "2026-05-28"
    archived: false
  - url: "https://wpscan.com/vulnerability/d553cff4-074a-44e7-aebe-e61c86ab8042"
    publisher: "WPScan"
    publisherType: research
    reliability: R2
    publicationDate: "2026-05-14"
    accessDate: "2026-05-28"
    archived: false
mitreMappings:
  - techniqueId: "T1059.007"
    techniqueName: "JavaScript"
    tactic: "Execution"
    confidence: confirmed
    evidence: Public reporting states attacker-injected JavaScript was executed on WooCommerce checkout pages.
  - techniqueId: "T1185"
    techniqueName: "Browser Session Hijacking"
    tactic: "Credential Access"
    confidence: possible
    evidence: Sources describe theft of payment and customer checkout data through browser-side skimming scripts.
atlasMappings: []
framework-mappings: []
---

## Summary

In May 2026, multiple security reports described active exploitation of a FunnelKit Funnel Builder vulnerability affecting WooCommerce environments. The reported abuse path allowed attackers to inject JavaScript into checkout pages, where malicious code could harvest payment and customer-entered data.

Sansec described observed skimmer activity and linked the exploitation to attacker-controlled script delivery infrastructure. Follow-on reporting by The Hacker News and SC Media amplified the same incident pattern and patch guidance.

FunnelKit released a patched version (`3.15.0.3`) and advised customers to update and review checkout script settings.

## Technical Analysis

Public reporting describes a vulnerable checkout-related endpoint in older Funnel Builder versions that could be reached without adequate permission checks. Attackers reportedly used this path to write malicious script references into plugin-controlled checkout script settings.

Once injected, the malicious JavaScript executed in shopper browser sessions during WooCommerce checkout. Reported payload behavior included remote script loading and exfiltration of payment-card fields and billing details.

Observed tradecraft reportedly included disguising malicious script fragments as routine analytics or tag-manager style snippets.

## Attack Chain

### Stage 1: Unauthenticated Request Path Abuse

Attackers send crafted requests to vulnerable Funnel Builder functionality in versions prior to `3.15.0.3`.

### Stage 2: Script Setting Injection

The vulnerable flow allows attacker-controlled content to be written into checkout-related external script settings.

### Stage 3: Checkout-Side JavaScript Execution

Injected script executes in customer checkout sessions and retrieves additional skimmer logic from attacker infrastructure.

### Stage 4: Payment Data Collection

Skimmer logic captures payment-related and billing data entered at checkout and sends it to attacker-controlled endpoints.

## Impact Assessment

Reported impact is concentrated on WooCommerce stores running vulnerable Funnel Builder versions. Successful compromise can affect confidentiality of shopper payment details and personal data entered during checkout.

Because exploitation occurs in browser-facing checkout workflows, business impact may include fraud exposure, incident response costs, customer-notification obligations, and trust erosion.

## Attribution

Current public reporting does not provide sufficient evidence to attribute activity to a named threat actor cluster. Attribution is best recorded as `Unknown` pending stronger technical or intelligence linkage.

## Timeline

### 2026-05-14 — Primary disclosure and exploitation report

Sansec publishes active exploitation reporting for Funnel Builder and details skimmer injection behavior and patch guidance.

### 2026-05-15 — Secondary security media amplification

The Hacker News and SC Media publish follow-on coverage summarizing exploitation risk and defensive actions for affected WooCommerce operators.

### 2026-05-14 onward — Vulnerability cataloging and patch tracking

WPScan lists technical tracking details and vulnerable/fixed version context for the issue.

## Remediation & Mitigation

1. Update Funnel Builder/FunnelKit to `3.15.0.3` or newer.
2. Review checkout external script configuration for unauthorized entries and remove suspicious code.
3. Inspect web and application logs for suspicious unauthenticated requests against vulnerable plugin paths.
4. Rotate potentially exposed payment workflow credentials or API keys where applicable.
5. Add file-integrity and JavaScript monitoring controls for checkout templates and plugin-managed script settings.

## Sources & References

- [Sansec: Critical FunnelKit vulnerability threatens 40,000+ WooCommerce checkouts](https://sansec.io/research/funnelkit-woocommerce-vulnerability-exploited) — Sansec, 2026-05-14
- [National Vulnerability Database: CVE-2026-47100](https://nvd.nist.gov/vuln/detail/CVE-2026-47100) — National Vulnerability Database, 2026-05-14
- [The Hacker News: Funnel Builder Flaw Under Active Exploitation Enables WooCommerce Checkout Skimming](https://thehackernews.com/2026/05/funnel-builder-flaw-under-active.html) — The Hacker News, 2026-05-15
- [SC Media: WordPress Funnel Builder vulnerability exploited to steal payment data](https://www.scworld.com/brief/wordpress-funnel-builder-vulnerability-exploited-to-steal-payment-data) — SC Media, 2026-05-15
- [WPScan: Funnel Builder vulnerability entry](https://wpscan.com/vulnerability/d553cff4-074a-44e7-aebe-e61c86ab8042) — WPScan, 2026-05-14
