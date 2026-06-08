---
eventId: TP-2026-0338
title: art-template npm Package Browser-Bundle Compromise, May 2026
date: 2026-05-20
attackType: Supply Chain
severity: medium
sector: Software development / npm ecosystem
geography: Global
threatActor: Unknown
attributionConfidence: A6
reviewStatus: draft_ai
confidenceGrade: C
generatedBy: dangermouse-bot
generatedDate: 2026-06-08
generation:
  provider: openai
  model: gpt-5.3-spark
  tool: codex
  agent: dangermouse-bot
  promptProfile: threatpedia-danger-mouse
cves:
  - CVE-2024-23222
relatedSlugs: []
tags:
  - npm
  - supply-chain
  - art-template
  - browser-exploit
  - ios
  - safari
  - coruna
sources:
  - url: "https://safedep.io/art-template-npm-supply-chain-compromise/"
    publisher: "SafeDep"
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-05-20"
    accessDate: "2026-06-08"
    archived: false
  - url: "https://socket.dev/blog/coruna-respawned-compromised-art-template-npm-package"
    publisher: "Socket"
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-05-20"
    accessDate: "2026-06-08"
    archived: false
  - url: "https://www.technadu.com/compromised-art-template-npm-package-delivers-coruna-like-ios-exploit/628212/"
    publisher: "TechNadu"
    publisherType: media
    reliability: R2
    publicationDate: "2026-05-21"
    accessDate: "2026-06-08"
    archived: false
mitreMappings:
  - techniqueId: T1195.001
    techniqueName: "Compromise Software Dependencies and Development Tools"
    tactic: Initial Access
    attack-version: "v19.0"
    confidence: confirmed
    evidence: "SafeDep and Socket reported that unauthorized art-template npm versions modified the package browser bundle to load attacker-controlled remote JavaScript when the bundle was used in web pages."
---

## Summary

On May 20, 2026, SafeDep and Socket reported that the npm package `art-template` had been compromised through unauthorized package versions that modified the browser bundle. SafeDep identified versions 4.13.3 through 4.13.6 as unauthorized, with versions 4.13.5 and 4.13.6 appending remote-script loaders to `lib/template-web.js`.

The compromise affected browser-side consumers of `art-template`, not the server-side Node.js entry point. The injected code loaded JavaScript from `v3.jiathis[.]com`; SafeDep and Socket reported that the remote payload used referer-aware delivery, added Baidu Analytics tracking, and targeted iPhone Safari users through a hidden iframe chain.

SafeDep reported that the final payload was the Coruna exploit kit, an iOS browser exploit framework associated with multiple iOS vulnerabilities including CVE-2024-23222. Public sources reviewed for this entry did not confirm any end-user compromise, exact npm account-takeover mechanism, or actor identity.

## Technical Analysis

`art-template` is a JavaScript template engine that SafeDep described as having approximately 26,000 weekly downloads. The last known clean version in the reviewed reporting was 4.13.2, published in November 2018 by the original npm account `aui`.

SafeDep reported a maintainer and publisher trail involving accounts that did not have prior history with the project. The unauthorized versions 4.13.3 and 4.13.4 appeared in March 2025, while 4.13.5 and 4.13.6 appeared in May 2026. The May 2026 versions appended a `loadScript` function to the browser bundle, loading `https://v3.jiathis[.]com/code/jia.js?uid=artemplate` in version 4.13.5 and `https://v3.jiathis[.]com/code/art.js` in version 4.13.6.

The execution trigger was limited to browser-side use of `lib/template-web.js`. SafeDep reported that the package did not add install hooks and that the Node.js entry point did not import the modified browser bundle. That scope means risk depended on whether affected applications shipped or loaded the compromised browser bundle in user-facing pages.

Socket and SafeDep described the external payload as a multi-stage browser exploit chain. Socket reported that the payload included Safari and WebKit gating, browser fingerprinting, anti-headless checks, WebAssembly architecture fingerprinting, remote module loading, and persistent IP beaconing. SafeDep reported that iPhone users were routed through a hidden iframe chain to modules hosted under `utaq.cfww[.]shop`, with C2 synchronization at `l1ewsu3yjkqeroy[.]xyz`.

## Attack Chain

### Stage 1: Package ownership and publisher change

Public reporting described a change away from the original `aui` project identity and the appearance of new npm maintainers or publishers. SafeDep reported that three different npm accounts published unauthorized versions and that none was the original author.

### Stage 2: Unauthorized package publication

Version 4.13.3 was published in March 2025 with obfuscated code, version 4.13.4 restored the full package without detected injection, and versions 4.13.5 and 4.13.6 were published in May 2026 with plaintext browser-side script loaders.

### Stage 3: Browser bundle loads remote JavaScript

When an affected browser-side bundle executed in a web page, the appended `loadScript` function inserted a remote script element pointing to `v3.jiathis[.]com`.

### Stage 4: Referer-aware payload delivery

SafeDep reported that requests without a `Referer` header returned effectively empty content, while requests resembling browser script loads returned JavaScript payloads. This behavior reduced visibility during simple command-line fetching.

### Stage 5: iOS Safari targeting and exploit delivery

The payload tracked visitors and targeted iPhone Safari users. SafeDep and Socket reported a hidden iframe and module-loading chain leading to a Coruna-like exploit framework for vulnerable iOS versions.

## Impact Assessment

The most immediate impact was supply-chain exposure for projects that used affected `art-template` browser bundles. Affected versions could cause user browsers to load attacker-controlled JavaScript from remote infrastructure when a compromised bundle was served in a web application.

SafeDep reported that the external payload served Baidu Analytics tracking broadly and targeted iPhone users for further exploitation. Socket described the exploit path as rejecting non-target environments and using multiple fingerprinting and gating stages before final payload invocation.

The confirmed public impact remains bounded. SafeDep explicitly listed end-user impact and the exact account-takeover mechanism as unverified. Public sources also did not provide a confirmed count of affected websites, exploited devices, or stolen assets.

The incident is separate from npm install-time credential-stealing campaigns such as Mini Shai-Hulud. The reviewed sources describe a browser-side package compromise and iOS exploit-delivery path, so this entry does not infer worm behavior, CI/CD credential theft, or campaign clustering.

## Attribution

Attribution is Unknown. SafeDep identified npm publisher accounts and project-account anomalies, but did not confirm whether the same person controlled all accounts or whether multiple actors had access to the package.

Socket linked the payload behavior to a Coruna-like iOS browser exploit framework. That technical resemblance does not establish actor attribution in the reviewed public sources.

## Timeline

### 2018-11-13 — Last known clean version

SafeDep identified `art-template` version 4.13.2, published by `aui`, as the last known clean version.

### 2024-11-27 — GitHub account rename observed

SafeDep reported that the original GitHub identity `aui` redirected to `goofychris`, with repository metadata indicating an account rename rather than a new fork.

### 2025-03-12 — Unauthorized version 4.13.3 published

SafeDep reported that version 4.13.3 introduced obfuscated injection code and a stripped package layout.

### 2025-03-14 — Version 4.13.4 published

SafeDep reported that version 4.13.4 restored the full package and did not show the same injection.

### 2026-05-19 — Version 4.13.5 published

SafeDep and Socket reported that version 4.13.5 appended a browser-side loader for `v3.jiathis[.]com/code/jia.js?uid=artemplate`.

### 2026-05-20 — Version 4.13.6 and public disclosure

SafeDep and Socket reported that version 4.13.6 appended a loader for `v3.jiathis[.]com/code/art.js`. SafeDep and Socket published their public analyses the same day.

### 2026-05-21 — Corroborating coverage

TechNadu published a summary of the compromise, the iOS Safari targeting path, and the reported exploit-delivery infrastructure.

## Remediation & Mitigation

Projects using `art-template` should remove versions 4.13.3 through 4.13.6 from dependency locks and artifacts. SafeDep identified 4.13.2 as the last known clean version in the reviewed reporting; teams should verify package status against current npm registry metadata and their own software-composition inventory before republishing or redeploying.

Teams that served affected browser bundles should treat web users as potentially exposed to remote script execution and browser exploit delivery. Practical response steps include:

- Search built JavaScript assets for `v3.jiathis.com`, `jia.js?uid=artemplate`, and `art.js`.
- Inspect web telemetry for requests to `v3.jiathis[.]com`, `utaq.cfww[.]shop`, and `l1ewsu3yjkqeroy[.]xyz`.
- Rebuild browser assets from a known-clean dependency set.
- Review content-security-policy controls to restrict unexpected third-party script and iframe loads.
- Notify security teams responsible for any user-facing web applications that shipped affected bundles.

Package maintainers should review npm account access, maintainer lists, publish history, and repository ownership changes. For high-risk browser libraries, maintainers should monitor diff changes in built distribution files, not only source files.

## Sources & References

- [SafeDep: art-template npm Hijack Delivers iOS Browser Exploit Kit](https://safedep.io/art-template-npm-supply-chain-compromise/) — SafeDep, 2026-05-20
- [Socket: Coruna Respawned: Compromised art-template npm Package Leads to iOS Browser Exploit Kit](https://socket.dev/blog/coruna-respawned-compromised-art-template-npm-package) — Socket, 2026-05-20
- [TechNadu: Compromised art-template npm Package Delivers Coruna-Like iOS Exploit](https://www.technadu.com/compromised-art-template-npm-package-delivers-coruna-like-ios-exploit/628212/) — TechNadu, 2026-05-21
