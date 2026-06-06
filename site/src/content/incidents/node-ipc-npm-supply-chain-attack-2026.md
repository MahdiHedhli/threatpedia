---
eventId: TP-2026-0336
title: "node-ipc npm Package Compromise, May 2026"
date: 2026-05-14
attackType: Supply Chain
severity: medium
sector: Open-source software / npm ecosystem
geography: Global
threatActor: Unknown
attributionConfidence: A6
reviewStatus: draft_ai
confidenceGrade: C
generatedBy: dangermouse-bot
generatedDate: 2026-06-06
generation:
  provider: openai
  model: gpt-5.3-spark
  tool: codex
  agent: dangermouse-bot
  promptProfile: threatpedia-pipeline-article
cves: []
relatedSlugs: []
tags:
  - supply-chain
  - npm
  - node-ipc
  - credential-theft
  - dns-exfiltration
  - developer-tools
sources:
  - url: "https://securitylabs.datadoghq.com/articles/node-ipc-npm-malware-analysis"
    publisher: "Datadog Security Labs"
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-05-14"
    accessDate: "2026-06-06"
    archived: false
  - url: "https://semgrep.dev/blog/2026/not-your-ipc-but-node-ipc-npm-hit-again-with-supply-chain-attack-but-this-time-its-not-a-worm"
    publisher: "Semgrep"
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-05-14"
    accessDate: "2026-06-06"
    archived: false
  - url: "https://www.stepsecurity.io/blog/node-ipc-npm-supply-chain-attack"
    publisher: "StepSecurity"
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-05-14"
    accessDate: "2026-06-06"
    archived: false
  - url: "https://socket.dev/blog/node-ipc-package-compromised"
    publisher: "Socket"
    publisherType: vendor
    reliability: R1
    publicationDate: "2026-05-14"
    accessDate: "2026-06-06"
    archived: false
  - url: "https://www.cyberscotland.com/wp-content/uploads/2026/05/SC3-Daily-Threat-Bulletin-15-May-2026.pdf"
    publisher: "CyberScotland"
    publisherType: government
    reliability: R2
    publicationDate: "2026-05-15"
    accessDate: "2026-06-06"
    archived: false
mitreMappings:
  - techniqueId: "T1195.001"
    techniqueName: "Compromise Software Dependencies and Development Tools"
    tactic: "Initial Access"
    attack-version: "v19"
    confidence: confirmed
    evidence: "Datadog, Semgrep, StepSecurity, and Socket identify node-ipc versions 9.1.6, 9.2.3, and 12.0.1 as malicious npm releases containing an added credential-stealing payload."
  - techniqueId: "T1059.007"
    techniqueName: "JavaScript"
    tactic: Execution
    attack-version: "v19"
    confidence: confirmed
    evidence: "The payload was appended to the CommonJS node-ipc.cjs bundle and executed when applications loaded the package through require(\"node-ipc\")."
  - techniqueId: "T1552.001"
    techniqueName: "Credentials In Files"
    tactic: "Credential Access"
    attack-version: "v19"
    confidence: confirmed
    evidence: "The decoded target lists harvested developer, package-manager, cloud, Kubernetes, SSH, Git, Terraform, database, shell-history, and local credential-store files."
  - techniqueId: "T1041"
    techniqueName: "Exfiltration Over C2 Channel"
    tactic: Exfiltration
    attack-version: "v19"
    confidence: confirmed
    evidence: "Datadog, Semgrep, and Socket describe exfiltration through DNS TXT query names under bt.node.js after resolving sh.azurestaticprovider.net."
---

## Summary

On May 14, 2026, three malicious versions of the npm package `node-ipc` were published to the npm registry: `9.1.6`, `9.2.3`, and `12.0.1`. Datadog Security Labs, Semgrep, StepSecurity, and Socket each identified the releases as malicious and described an obfuscated credential-stealing payload added to the package's CommonJS bundle, `node-ipc.cjs`.

The payload did not rely on an npm lifecycle hook. It executed when an application or build process loaded the CommonJS entrypoint, such as through `require("node-ipc")`. The affected versions collected host metadata, environment variables, `/etc/hosts` where readable, and a broad set of developer and infrastructure credential files, then attempted to exfiltrate the compressed archive through DNS TXT query names.

Public reporting available at time of writing did not identify a confirmed threat actor, confirmed victim count, or government attribution statement for the May 2026 `node-ipc` releases. Attribution remains Unknown, and the incident scope is limited to the three malicious npm package versions and the credential-exfiltration behavior documented by the cited sources.

## Technical Analysis

The malicious code was added to `node-ipc.cjs`, the CommonJS bundle selected by `require("node-ipc")`. Socket reported that the package metadata routed CommonJS consumers to `node-ipc.cjs` and ESM consumers to `node-ipc.js`, with the added payload present only in the CommonJS file. StepSecurity described the payload as an approximately 80 KB obfuscated immediately invoked function expression appended after the normal module export, while Datadog described the same malicious `node-ipc.cjs` file across all three affected releases.

Because the package did not include a malicious `preinstall`, `install`, or `postinstall` script, installing a malicious version was not by itself the execution trigger described by the sources. The primary risk was an environment that installed one of the affected versions and later loaded the CommonJS entrypoint at runtime, during tests, in build tooling, or in an application process.

Datadog and Socket describe a detached child-process pattern controlled by the environment variable `__ntw=1`. In the normal path, the payload attempted to fork the current module in a detached process, removed `NODE_OPTIONS`, ignored standard I/O, and returned control to the parent process while collection continued in the child. Socket also documented an exported marker named `__ntRun`, which could provide an additional activation path if downstream code called that property.

The collection phase targeted local developer and infrastructure secrets. Across the vendor analyses, examples included AWS, Azure, GCP, OCI, Kubernetes, Docker, npm, Yarn, Git, GitHub CLI, GitLab CLI, SSH, Terraform, database, shell-history, `.env`, macOS Keychain, Firefox key database, Linux keyring, and AI tooling configuration files. Datadog noted that collected files were renamed inside the archive using a truncated SHA-256 hash of the original path and a sanitized basename, with `fixtures/_paths.txt` preserving the mapping back to original paths.

The exfiltration path was DNS-based. Datadog described the payload resolving `sh.azurestaticprovider.net` and sending TXT lookups under `bt.node.js`, using query-name prefixes such as `xh`, `xd`, and `xf` for header, data, and footer chunks. Semgrep and Socket also documented DNS-based exfiltration involving `sh.azurestaticprovider.net` and `bt.node.js`. Datadog observed `37.16.75.69` as the resolved address for `sh.azurestaticprovider.net` on May 14, 2026.

## Attack Chain

### Stage 1: Malicious versions published

On May 14, 2026, the npm registry received three malicious `node-ipc` releases: `9.1.6`, `9.2.3`, and `12.0.1`. StepSecurity reported that the versions were published by the npm account `atiertant`, an account with publish rights but no prior release history for this package in the cited reporting. Socket also described a maintainer-compromise scenario involving the same dormant account, while noting that analysis was continuing.

### Stage 2: CommonJS bundle modified

The attacker placed the payload in the CommonJS bundle `node-ipc.cjs`. Socket reported that the ESM wrapper and individual source files did not contain the appended payload. StepSecurity said the 9.x malicious releases were synthetic package artifacts that copied the 12.x package structure, while Datadog reported the same malicious CommonJS file across all three affected versions.

### Stage 3: Runtime loading triggers payload

When a project loaded the affected CommonJS entrypoint through `require("node-ipc")`, the appended JavaScript executed during module evaluation. The payload attempted to fork a detached child with `__ntw=1`, allowing the parent process to continue normal package loading while credential collection and exfiltration ran in the background.

### Stage 4: Credential collection

The payload gathered host metadata and environment variables, then enumerated file patterns for developer secrets, cloud credentials, package manager tokens, source-control credentials, Kubernetes and container configuration, infrastructure-as-code secrets, database files, shell histories, and local credential stores. Files above the size thresholds described by the research sources were skipped, and collected material was compressed into a temporary gzip archive.

### Stage 5: DNS exfiltration attempted

The payload attempted to send the archive through DNS TXT query names. Datadog documented generated names under `bt.node.js` and a decoded endpoint of `sh.azurestaticprovider.net:443`, with `37.16.75.69` observed for that host on May 14, 2026. Lookup errors were handled silently, so failed exfiltration attempts may still leave host-side forensic artifacts such as temporary `nt-<pid>` directories or process telemetry.

## Impact Assessment

The incident affected projects that resolved and loaded `node-ipc@9.1.6`, `node-ipc@9.2.3`, or `node-ipc@12.0.1` through the CommonJS entrypoint. StepSecurity described `node-ipc` as a foundational inter-process communication library with more than 10 million weekly downloads, while Chainguard and other secondary reporting used lower download estimates. The public record does not provide a confirmed number of affected installations or victims.

The primary impact was potential credential exposure from developer workstations, CI systems, and application environments that loaded the malicious CommonJS bundle. The payload's target lists covered high-value secret classes including cloud credentials, registry tokens, SSH keys, Git and GitHub credentials, Kubernetes service account tokens, Terraform credentials, shell histories, and local application configuration. Environment variables were also collected, increasing the risk to CI/CD systems where secrets are commonly injected into process environments.

The attack did not require a user to execute a package script at install time. That detail matters for triage because package-management logs may show installation without immediate execution, while test runners, build scripts, server processes, or other tooling could trigger the payload later by requiring the CommonJS bundle.

No public source reviewed for this draft confirmed successful exfiltration from a specific victim environment. Environments that loaded an affected version should therefore be treated as potentially compromised rather than assumed to have a known confirmed data loss scope.

## Attribution

The threat actor is Unknown. Vendor sources describe the publishing path as involving an npm account with maintainer rights, and Socket cites public analysis suggesting possible recovery of a dormant maintainer account through an expired email domain. Those details support a maintainer-account compromise hypothesis, but the public sources reviewed here do not identify a named actor or government-confirmed attribution.

This incident is separate from the 2022 `node-ipc` protestware incident. The May 2026 sources distinguish the 2026 credential-stealing package compromise from the earlier geopolitically motivated destructive versions.

## Timeline

### 2026-05-14 — Malicious releases published

`node-ipc@9.1.6`, `node-ipc@9.2.3`, and `node-ipc@12.0.1` were published to npm. Datadog, Semgrep, StepSecurity, and Socket all identify these three versions as affected.

### 2026-05-14 — Vendor detection and analysis

Socket reported detecting the malicious versions within roughly three minutes of publication. StepSecurity, Semgrep, and Datadog published technical analysis the same day describing the payload, trigger path, targeted credential files, and DNS exfiltration behavior.

### 2026-05-15 — Public-sector bulletin coverage

CyberScotland's daily threat bulletin for May 15, 2026 included coverage of the public reporting on malicious `node-ipc` versions.

## Remediation & Mitigation

Dependency consumers should identify whether any project resolved `node-ipc@9.1.6`, `node-ipc@9.2.3`, or `node-ipc@12.0.1` in `package.json`, `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, `npm-shrinkwrap.json`, cached package tarballs, container layers, CI workspaces, or deployed service artifacts. Runtime exposure should be prioritized where the package was loaded through the CommonJS entrypoint.

Affected environments should remove the malicious versions, reinstall from clean lockfiles pinned to known-good versions, and rotate credentials available to the process environment. Rotation should include npm and GitHub tokens, SSH keys, cloud provider credentials, Kubernetes tokens, CI/CD secrets, Terraform credentials, database credentials, and secrets stored in local `.env` or application configuration files.

Responders should preserve host and CI telemetry before rebuilding systems where possible. Useful host-side indicators include a Node.js process spawning a detached child with `__ntw=1`, temporary directories matching `nt-<pid>` under the system temporary directory, short-lived `.tar.gz` archives, the marker `__ntRun` in `node_modules/node-ipc/node-ipc.cjs`, and unexpected reads of many credential files shortly after package load.

Network defenders should alert on or block DNS activity involving `sh.azurestaticprovider.net`, direct DNS-like traffic to `37.16.75.69`, and TXT query names under `bt.node.js` using the `xh`, `xd`, or `xf` prefixes described by Datadog and Socket. Because sources describe resolver behavior that may bypass local DNS controls, egress policies should also restrict direct DNS to unapproved resolvers from developer workstations and build systems.

Maintainers should review npm account access, enforce phishing-resistant MFA where available, remove dormant maintainers, verify recovery email domains, and monitor package publication events. Consumers should use lockfiles, dependency cooldown controls, package malware scanning, and private registry quarantine policies to reduce exposure to newly published malicious versions.

## Sources & References

- [Datadog Security Labs: Backdoored node-ipc npm releases steal developer credentials through DNS queries](https://securitylabs.datadoghq.com/articles/node-ipc-npm-malware-analysis) — Datadog Security Labs, 2026-05-14
- [Semgrep: Not Your IPC, but node-ipc: npm Hit Again with Supply Chain Attack](https://semgrep.dev/blog/2026/not-your-ipc-but-node-ipc-npm-hit-again-with-supply-chain-attack-but-this-time-its-not-a-worm) — Semgrep, 2026-05-14
- [StepSecurity: Active Supply Chain Attack: Malicious node-ipc Versions Published to npm](https://www.stepsecurity.io/blog/node-ipc-npm-supply-chain-attack) — StepSecurity, 2026-05-14
- [Socket: Popular node-ipc npm Package Infected with Credential Stealer](https://socket.dev/blog/node-ipc-package-compromised) — Socket, 2026-05-14
- [CyberScotland: Daily Threat Bulletin](https://www.cyberscotland.com/wp-content/uploads/2026/05/SC3-Daily-Threat-Bulletin-15-May-2026.pdf) — CyberScotland, 2026-05-15
