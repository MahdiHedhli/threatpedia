---
eventId: TP-2026-0338
title: Mastra npm Supply-Chain Compromise via easy-day-js Postinstall Payload
date: 2026-06-17
attackType: supply-chain
severity: critical
sector: Open-source software / developer tooling
geography: Global
threatActor: Unknown
attributionConfidence: A4
reviewStatus: draft_ai
confidenceGrade: C
generatedBy: dangermouse-bot
generatedDate: 2026-06-18
cves: []
relatedSlugs: []
tags: [supply-chain, npm, mastra, easy-day-js, postinstall, typosquat, malware]
generation:
  provider: anthropic
  model: claude-opus-4-8
  tool: claude-cli
  agent: dangermouse-bot
  lane: danger-mouse-claude
  surface: claude-cli
  promptProfile: task-driven-incident-draft
sources:
  - publisher: Microsoft Security Blog
    url: https://www.microsoft.com/en-us/security/blog/2026/06/17/postinstall-payload-inside-mastra-npm-supply-chain-compromise/
    publicationDate: "2026-06-17"
    accessDate: "2026-06-18"
    publisherType: vendor
    reliability: R1
  - publisher: StepSecurity
    url: https://www.stepsecurity.io/blog/mastra-npm-packages-compromised-using-easy-day-js
    publicationDate: "2026-06-17"
    accessDate: "2026-06-18"
    publisherType: research
    reliability: R1
  - publisher: Aikido
    url: https://www.aikido.dev/blog/over-140-popular-mastra-npm-packages-hit-by-supply-chain-attack
    publicationDate: "2026-06-17"
    accessDate: "2026-06-18"
    publisherType: vendor
    reliability: R1
mitreMappings:
  - techniqueId: T1195.001
    techniqueName: Compromise Software Dependencies and Development Tools
    tactic: Initial Access
    attack-version: v19
    confidence: confirmed
    evidence: Microsoft and StepSecurity reported compromise of the @mastra publish path and mass injection of easy-day-js across 140+ packages.
---

## Summary

On 2026-06-17, Microsoft, StepSecurity, and Aikido reported a supply-chain compromise affecting npm packages published under the `@mastra` scope. The packages were modified to depend on `easy-day-js`, a package whose `1.11.22` release carried a malicious `postinstall` hook. Microsoft reported that 140+ packages were affected, and Aikido reported 141 packages. The combined affected packages accounted for more than 1.1 million weekly downloads. Microsoft stated that the compromised packages were removed and that publish access to `@mastra` was revoked.

## Technical Analysis

The malicious code was delivered through `easy-day-js`. A clean `1.11.21` release was published first as a bait version, followed by a malicious `1.11.22` release containing a `postinstall` hook. When a package depending on the compromised release was installed, the hook executed automatically.

The `postinstall` payload acted as a dropper: it downloaded a second-stage payload from an external source and then deleted itself to reduce on-disk traces. Affected `@mastra` packages were altered to pull in the malicious `easy-day-js` release, propagating the payload to any environment that installed or updated those packages.

## Attack Chain

1. A clean `easy-day-js` `1.11.21` release was published as a bait version.
2. A malicious `easy-day-js` `1.11.22` release was published with a `postinstall` hook.
3. Packages under the `@mastra` scope were modified to depend on the malicious `easy-day-js` release.
4. Installation of an affected package triggered the `postinstall` hook.
5. The dropper downloaded a second-stage payload and deleted itself.

## Impact Assessment

The affected packages represented more than 1.1 million weekly downloads, exposing a large set of developer and build environments to automatic payload execution during installation. Any environment that installed or updated an affected `@mastra` package, or pulled in the malicious `easy-day-js` release transitively, may have executed the dropper. Because the payload ran at install time and retrieved a second stage, the full scope of post-execution activity depends on what the second stage performed in each environment.

## Attribution

The actor responsible for the compromise is unknown. Reporting from Microsoft, StepSecurity, and Aikido documented the technical mechanism and affected packages but did not attribute the activity to a named actor or group.

## Timeline

### 2026-06-17 — Compromise reported

Microsoft, StepSecurity, and Aikido published reports describing the compromise of `@mastra` packages via the malicious `easy-day-js` release.

### 2026-06-17 — Removal and access revocation

Microsoft reported that the compromised packages were removed and that publish access to `@mastra` was revoked.

## Remediation & Mitigation

- Identify whether any `@mastra` package or `easy-day-js` `1.11.22` was installed or cached in build, CI, or developer environments.
- Remove the malicious `easy-day-js` `1.11.22` release and rebuild affected dependency trees from a known-good state.
- Inspect environments that ran the `postinstall` hook for evidence of second-stage activity and outbound network connections.
- Rotate credentials and tokens that were accessible in any environment where the payload executed.
- Pin dependencies and review lockfiles before reinstalling, and consider disabling install scripts in untrusted contexts.

## Sources & References

- [Microsoft Security Blog: Postinstall Payload Inside Mastra npm Supply-Chain Compromise](https://www.microsoft.com/en-us/security/blog/2026/06/17/postinstall-payload-inside-mastra-npm-supply-chain-compromise/) — Microsoft Security Blog, 2026-06-17
- [StepSecurity: Mastra npm Packages Compromised Using easy-day-js](https://www.stepsecurity.io/blog/mastra-npm-packages-compromised-using-easy-day-js) — StepSecurity, 2026-06-17
- [Aikido: Over 140 Popular Mastra npm Packages Hit by Supply-Chain Attack](https://www.aikido.dev/blog/over-140-popular-mastra-npm-packages-hit-by-supply-chain-attack) — Aikido, 2026-06-17
