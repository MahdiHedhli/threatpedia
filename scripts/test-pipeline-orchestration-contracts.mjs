#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import yaml from 'js-yaml';

const supplyChainWorkflow = readFileSync(new URL('../.github/workflows/supply-chain-live-discovery.yml', import.meta.url), 'utf8');
const supplyChainValidationWorkflow = readFileSync(new URL('../.github/workflows/supply-chain-validate.yml', import.meta.url), 'utf8');
const discoveryWorkflow = readFileSync(new URL('../.github/workflows/pipeline-discovery.yml', import.meta.url), 'utf8');
const taskValidationWorkflow = readFileSync(new URL('../.github/workflows/pipeline-validate-tasks.yml', import.meta.url), 'utf8');
const reviewGateWorkflow = readFileSync(new URL('../.github/workflows/pipeline-review-gate.yml', import.meta.url), 'utf8');
const reviewGateScript = readFileSync(new URL('./pipeline-review-gate.mjs', import.meta.url), 'utf8');
const taskValidator = readFileSync(new URL('./validate-pipeline-tasks.mjs', import.meta.url), 'utf8');
const taskSchema = JSON.parse(readFileSync(new URL('../.github/pipeline/schema/task-schema.json', import.meta.url), 'utf8'));
const supplyChainWorkflowContract = yaml.load(supplyChainWorkflow, { schema: yaml.JSON_SCHEMA });
const supplyChainValidationContract = yaml.load(supplyChainValidationWorkflow, { schema: yaml.JSON_SCHEMA });
const taskValidationContract = yaml.load(taskValidationWorkflow, { schema: yaml.JSON_SCHEMA });

assert.match(supplyChainWorkflow, /git checkout -B "\$BRANCH" origin\/main/);
assert.doesNotMatch(supplyChainWorkflow, /git merge --no-edit origin\/main/);
assert.match(supplyChainWorkflow, /DISCOVERY_REMOTE_HEAD/);
assert.match(supplyChainWorkflow, /--force-with-lease=refs\/heads\/\$\{DISCOVERY_BRANCH\}/);
assert.match(supplyChainWorkflow, /refs\/heads\/\$\{BRANCH\}:refs\/remotes\/origin\/\$\{BRANCH\}/);
assert.deepEqual(supplyChainWorkflowContract.on.schedule, [{ cron: '17 */6 * * *' }]);
assert.ok(!supplyChainWorkflow.includes('Run VulnCheck KEV source-packet intake'));
assert.doesNotMatch(supplyChainWorkflow, /^\s+\.github\/pipeline\/source-packets\/vulncheck-kev\/\s*\\?$/m);
assert.ok(supplyChainWorkflow.includes("replace(/\\|/g, '\\\\|')"));
assert.ok(supplyChainWorkflow.includes("body += '\\n### Guardrails\\n\\n'"));
assert.ok(!supplyChainWorkflow.includes("body += '\\\\n### Guardrails"));

assert.match(discoveryWorkflow, /TOTAL_PENDING_PREFILLS/);
assert.match(discoveryWorkflow, /"\$TOTAL_PENDING_PREFILLS" -ge "\$PENDING_CAP"/);
assert.match(discoveryWorkflow, /FETCHED_PREFILL_BRANCHES/);
assert.match(discoveryWorkflow, /global backlog state is incomplete/);
assert.doesNotMatch(discoveryWorkflow, /\$\{BASE_BRANCH\}-\$\{GITHUB_RUN_ID\}/);
assert.match(discoveryWorkflow, /pauses at the configured global pending cap/);
assert.match(discoveryWorkflow, /refs\/heads\/\$\{candidate_branch\}:refs\/remotes\/origin\/\$\{candidate_branch\}/);
assert.ok(discoveryWorkflow.includes('OPEN_PREFILL_PAGE=1'));
assert.ok(discoveryWorkflow.includes('pulls?state=open&per_page=100&page=${OPEN_PREFILL_PAGE}'));
assert.ok(discoveryWorkflow.includes('OPEN_PREFILL_PAGE=$((OPEN_PREFILL_PAGE + 1))'));

assert.match(supplyChainWorkflow, /--retry 3 --retry-all-errors/);

const liveDiscoveryGraphBuild = supplyChainWorkflow.indexOf('node scripts/build-supply-chain-graph.mjs');
const liveDiscoveryCommit = supplyChainWorkflow.indexOf('- name: Commit candidate queue and public artifacts to branch');
assert.ok(liveDiscoveryGraphBuild > 0 && liveDiscoveryGraphBuild < liveDiscoveryCommit);
assert.ok(supplyChainWorkflow.includes('site/public/supply-chain-graph.json'));
assert.ok(supplyChainWorkflow.includes('site/public/supply-chain-malware-families-stix.json'));
assert.ok(supplyChainWorkflow.includes('site/public/supply-chain-search-index.json'));

const supplyChainValidationPaths = supplyChainValidationContract.on.pull_request.paths;
for (const requiredPath of [
  '.github/workflows/supply-chain-live-discovery.yml',
  'data/supply-chain-malware-families/**',
  'scripts/build-supply-chain-graph.mjs',
  'site/public/supply-chain-graph.json',
  'site/public/supply-chain-malware-families-stix.json',
  'site/public/supply-chain-search-index.json',
]) {
  assert.ok(supplyChainValidationPaths.includes(requiredPath), `supply-chain validation trigger missing ${requiredPath}`);
}
const supplyChainValidationCommands = supplyChainValidationContract.jobs['validate-supply-chain'].steps
  .map((step) => step.run || '')
  .join('\n');
assert.match(supplyChainValidationCommands, /cd scripts && npm ci --no-audit --no-fund/);
assert.match(supplyChainValidationCommands, /node scripts\/build-supply-chain-graph\.mjs --check/);
assert.match(supplyChainValidationCommands, /node scripts\/test-pipeline-orchestration-contracts\.mjs/);

const taskValidationPaths = taskValidationContract.on.pull_request.paths;
assert.ok(taskValidationPaths.includes('.github/pipeline/schema/task-schema.json'));
const taskValidationCommands = taskValidationContract.jobs['validate-tasks'].steps
  .map((step) => step.run || '')
  .join('\n');
assert.match(taskValidationCommands, /node scripts\/test-pipeline-orchestration-contracts\.mjs/);

assert.ok(taskSchema.properties.stage.enum.includes('generation'));
assert.ok(taskSchema.properties.status.enum.includes('pr_open'));
assert.ok(taskSchema.properties.acceptance_criteria);
assert.ok(taskSchema.properties.acceptance);
assert.ok(!taskSchema.required.includes('stage'));
assert.ok(taskSchema.properties.source.enum.includes('promotion'));
assert.ok(taskSchema.properties.source.enum.includes('historical_corpus_backlog'));
assert.ok(taskSchema.properties.output.properties.pr.type.includes('null'));
assert.ok(taskSchema.anyOf.some((rule) => rule.required?.includes('acceptance_criteria')));
assert.ok(taskSchema.anyOf.some((rule) => rule.required?.includes('acceptance')));
const taskSourceSetBody = taskValidator.match(/const SOURCES = new Set\(\[([\s\S]*?)\]\);/)?.[1] || '';
for (const source of taskSchema.properties.source.enum) {
  assert.ok(taskSourceSetBody.includes(`'${source}'`), `task validator SOURCES missing schema value: ${source}`);
}

assert.match(reviewGateWorkflow, /coderabbitai/);
assert.match(reviewGateScript, /'coderabbitai'/);

console.log('pipeline orchestration workflow contracts: PASS');
