#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  SUPPLY_CHAIN_FEATURED_INCIDENT_IDS,
  getSupplyChainRoutes,
  loadSupplyChainData,
} from '../site/src/lib/supplyChainPages.mjs';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const siteDistDir = path.join(repoRoot, 'site', 'dist');
const readinessReportPath = path.join(repoRoot, '.worker-state', 'supply-chain-public-readiness.json');
const deployWorkflowPath = path.join(repoRoot, '.github', 'workflows', 'deploy.yml');

const failures = [];

function run(command, options = {}) {
  const result = spawnSync(command, {
    cwd: options.cwd || repoRoot,
    env: { ...process.env, ...(options.env || {}) },
    shell: true,
    encoding: 'utf-8',
    stdio: 'inherit',
  });
  if (result.status !== 0) {
    failures.push(`${command} exited with ${result.status}`);
  }
  return result.status === 0;
}

function assertPreview(condition, message) {
  if (!condition) failures.push(message);
}

function htmlPathForRoute(routePath) {
  const normalized = routePath.replace(/^\/+/, '').replace(/\/+$/, '');
  return normalized ? path.join(siteDistDir, normalized, 'index.html') : path.join(siteDistDir, 'index.html');
}

function walkIndexFiles(dir, files = []) {
  if (!existsSync(dir)) return files;
  readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkIndexFiles(filePath, files);
      return;
    }
    if (entry.isFile() && entry.name === 'index.html') {
      files.push(filePath);
    }
  });
  return files;
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf-8'));
}

function productionDeployEnablesSupplyChain() {
  const workflow = readFileSync(deployWorkflowPath, 'utf-8');
  const productionEnablePatterns = [
    /ENABLE_SUPPLY_CHAIN_PAGES\s*:\s*['"]?true['"]?/i,
    /ENABLE_SUPPLY_CHAIN_PAGES=true/i,
    /ENABLE_SUPPLY_CHAIN_PAGES:\s*\$\{\{\s*vars\.ENABLE_SUPPLY_CHAIN_PAGES\s*\}\}/i,
  ];
  return productionEnablePatterns.some((pattern) => pattern.test(workflow));
}

const requireProductionDisabled = process.argv.includes('--require-production-disabled')
  || String(process.env.SUPPLY_CHAIN_PREVIEW_REQUIRE_PRODUCTION_DISABLED || '').toLowerCase() === 'true';

if (requireProductionDisabled) {
  assertPreview(
    !productionDeployEnablesSupplyChain(),
    'production deploy workflow appears to enable ENABLE_SUPPLY_CHAIN_PAGES',
  );
} else if (productionDeployEnablesSupplyChain()) {
  console.log('Production deploy already enables ENABLE_SUPPLY_CHAIN_PAGES; continuing preview output checks.');
}

run('node scripts/check_supply_chain_public_readiness.mjs');

assertPreview(existsSync(readinessReportPath), 'readiness report was not written');
const readinessReport = existsSync(readinessReportPath) ? readJson(readinessReportPath) : null;
assertPreview(readinessReport?.status === 'pass', 'readiness report status is not pass');

const data = loadSupplyChainData();
const expectedRoutes = getSupplyChainRoutes({ enabled: true, data });
const generatedRoutes = walkIndexFiles(path.join(siteDistDir, 'supply-chain')).length;

assertPreview(existsSync(htmlPathForRoute('/supply-chain/')), '/supply-chain/ preview page was not generated');
SUPPLY_CHAIN_FEATURED_INCIDENT_IDS.forEach((id) => {
  assertPreview(
    existsSync(htmlPathForRoute(`/supply-chain/incidents/${id}/`)),
    `/supply-chain/incidents/${id}/ preview page was not generated`,
  );
});

assertPreview(
  generatedRoutes === expectedRoutes.length,
  `generated preview route count ${generatedRoutes} did not match expected route count ${expectedRoutes.length}`,
);
assertPreview(
  readinessReport?.counts?.expected_routes === expectedRoutes.length,
  `readiness expected route count ${readinessReport?.counts?.expected_routes} did not match model route count ${expectedRoutes.length}`,
);
assertPreview(
  readinessReport?.counts?.enabled_generated_routes === generatedRoutes,
  `readiness generated route count ${readinessReport?.counts?.enabled_generated_routes} did not match preview route count ${generatedRoutes}`,
);

if (failures.length > 0) {
  console.error('Supply Chain preview check: FAIL');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Supply Chain preview check: PASS');
console.log(`Generated routes: ${generatedRoutes}`);
console.log(`Readiness report: ${path.relative(repoRoot, readinessReportPath)}`);
