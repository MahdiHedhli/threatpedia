#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const supplyChainWorkflow = readFileSync(new URL('../.github/workflows/supply-chain-live-discovery.yml', import.meta.url), 'utf8');
const discoveryWorkflow = readFileSync(new URL('../.github/workflows/pipeline-discovery.yml', import.meta.url), 'utf8');
const reviewGateWorkflow = readFileSync(new URL('../.github/workflows/pipeline-review-gate.yml', import.meta.url), 'utf8');
const reviewGateScript = readFileSync(new URL('./pipeline-review-gate.mjs', import.meta.url), 'utf8');

assert.match(supplyChainWorkflow, /git checkout -B "\$BRANCH" origin\/main/);
assert.doesNotMatch(supplyChainWorkflow, /git merge --no-edit origin\/main/);
assert.match(supplyChainWorkflow, /DISCOVERY_REMOTE_HEAD/);
assert.match(supplyChainWorkflow, /--force-with-lease=refs\/heads\/\$\{DISCOVERY_BRANCH\}/);
assert.match(supplyChainWorkflow, /refs\/heads\/\$\{BRANCH\}:refs\/remotes\/origin\/\$\{BRANCH\}/);

assert.match(discoveryWorkflow, /TOTAL_PENDING_PREFILLS/);
assert.match(discoveryWorkflow, /"\$TOTAL_PENDING_PREFILLS" -ge "\$PENDING_CAP"/);
assert.match(discoveryWorkflow, /FETCHED_PREFILL_BRANCHES/);
assert.match(discoveryWorkflow, /global backlog state is incomplete/);
assert.doesNotMatch(discoveryWorkflow, /\$\{BASE_BRANCH\}-\$\{GITHUB_RUN_ID\}/);
assert.match(discoveryWorkflow, /pauses at the configured global pending cap/);
assert.match(discoveryWorkflow, /refs\/heads\/\$\{candidate_branch\}:refs\/remotes\/origin\/\$\{candidate_branch\}/);

assert.match(supplyChainWorkflow, /--retry 3 --retry-all-errors/);

assert.match(reviewGateWorkflow, /coderabbitai/);
assert.match(reviewGateScript, /'coderabbitai'/);

console.log('pipeline orchestration workflow contracts: PASS');
