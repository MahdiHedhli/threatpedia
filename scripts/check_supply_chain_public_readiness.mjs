#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  SUPPLY_CHAIN_FEATURED_INCIDENT_IDS,
  getSupplyChainRoutes,
  loadSupplyChainData,
} from '../site/src/lib/supplyChainPages.mjs';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const siteDir = path.join(repoRoot, 'site');
const distDir = path.join(siteDir, 'dist');
const reportPath = path.join(repoRoot, '.worker-state/supply-chain-public-readiness.json');

const failures = [];
const checks = [];

function nowIso() {
  return new Date().toISOString();
}

function normalizeOutput(value) {
  return String(value || '').split('\n').slice(-20).join('\n').trim();
}

function runCheck(name, command, options = {}) {
  const startedAt = Date.now();
  const result = spawnSync(command, {
    cwd: options.cwd || repoRoot,
    env: { ...process.env, ...(options.env || {}) },
    shell: true,
    encoding: 'utf-8',
    maxBuffer: 1024 * 1024 * 20,
  });
  const check = {
    name,
    command,
    status: result.status === 0 ? 'pass' : 'fail',
    exit_code: result.status,
    duration_ms: Date.now() - startedAt,
    stdout_tail: normalizeOutput(result.stdout),
    stderr_tail: normalizeOutput(result.stderr),
  };
  checks.push(check);
  if (result.status !== 0) {
    failures.push(`${name} failed with exit code ${result.status}`);
  }
  return result.status === 0;
}

function assertReady(condition, message) {
  if (!condition) failures.push(message);
}

function readIfExists(filePath) {
  return existsSync(filePath) ? readFileSync(filePath, 'utf-8') : '';
}

function htmlPathForRoute(routePath) {
  const normalized = routePath.replace(/^\/+/, '').replace(/\/+$/, '');
  return normalized ? path.join(distDir, normalized, 'index.html') : path.join(distDir, 'index.html');
}

function walkFiles(dir, predicate, files = []) {
  if (!existsSync(dir)) return files;
  readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(filePath, predicate, files);
      return;
    }
    if (entry.isFile() && (!predicate || predicate(filePath))) {
      files.push(filePath);
    }
  });
  return files;
}

function extractSupplyChainHrefs(html) {
  const hrefs = new Set();
  const hrefPattern = /\shref=(["'])(\/supply-chain\/[^"']*)\1/g;
  let match;
  while ((match = hrefPattern.exec(html)) !== null) {
    const href = match[2].split('#')[0].split('?')[0];
    if (href) hrefs.add(href.endsWith('/') ? href : `${href}/`);
  }
  return [...hrefs];
}

function extractJsonLdBlocks(html) {
  const blocks = [];
  const jsonLdPattern = /<script[^>]+type=(["'])application\/ld\+json\1[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = jsonLdPattern.exec(html)) !== null) {
    blocks.push(match[2].trim());
  }
  return blocks;
}

function assertSeo(filePath, routeLabel) {
  const html = readIfExists(filePath);
  assertReady(Boolean(html), `${routeLabel} was not generated`);
  if (!html) return;

  assertReady(/<title>[^<]+<\/title>/.test(html), `${routeLabel} missing title`);
  assertReady(/<meta name="description" content="[^"]+"/.test(html), `${routeLabel} missing meta description`);
  assertReady(/<link rel="canonical" href="[^"]+"/.test(html), `${routeLabel} missing canonical URL`);
  assertReady(/<meta property="og:title" content="[^"]+"/.test(html), `${routeLabel} missing Open Graph title`);
  assertReady(/<meta property="og:description" content="[^"]+"/.test(html), `${routeLabel} missing Open Graph description`);
  assertReady(!/<meta name="robots" content="noindex, nofollow"/.test(html), `${routeLabel} should not be noindex when enabled`);

  const jsonLdBlocks = extractJsonLdBlocks(html);
  assertReady(jsonLdBlocks.length > 0, `${routeLabel} missing JSON-LD`);
  jsonLdBlocks.forEach((block, index) => {
    try {
      JSON.parse(block);
    } catch (error) {
      failures.push(`${routeLabel} JSON-LD block ${index + 1} is invalid JSON: ${error.message}`);
    }
  });
}

function generatedSupplyChainPageCount() {
  return walkFiles(path.join(distDir, 'supply-chain'), (filePath) => path.basename(filePath) === 'index.html').length;
}

function routeUrl(route) {
  return route.slug ? `/supply-chain/${route.slug}/` : '/supply-chain/';
}

function writeReport(status, data, extra = {}) {
  mkdirSync(path.dirname(reportPath), { recursive: true });
  const enabledRoutes = getSupplyChainRoutes({ enabled: true, data });
  const report = {
    status,
    timestamp: nowIso(),
    counts: {
      incidents: data.incidents.length,
      packages: data.entities.packages.length,
      repositories: data.entities.repositories.length,
      organizations: data.entities.organizations.length,
      maintainers: data.entities.maintainers.length,
      build_systems: data.entities.build_systems.length,
      distribution_channels: data.entities.distribution_channels.length,
      compromised_accounts: data.entities.accounts.length,
      relationships: data.relationships.length,
      expected_routes: enabledRoutes.length,
      ...extra.counts,
    },
    checked_routes: {
      index: '/supply-chain/',
      featured_incidents: SUPPLY_CHAIN_FEATURED_INCIDENT_IDS.map((id) => `/supply-chain/incidents/${id}/`),
      sampled_routes: enabledRoutes.slice(0, 12).map(routeUrl),
    },
    checks,
    failures,
  };
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  return report;
}

function assertDisabledBuild() {
  rmSync(distDir, { recursive: true, force: true });
  const passed = runCheck('disabled build smoke', 'cd site && npm run build', {
    env: { ENABLE_SUPPLY_CHAIN_PAGES: '' },
  });
  const homeHtml = readIfExists(path.join(distDir, 'index.html'));
  assertReady(passed, 'disabled build did not complete');
  assertReady(!existsSync(path.join(distDir, 'supply-chain')), '/supply-chain/ output exists when disabled');
  assertReady(!homeHtml.includes('href="/supply-chain/"'), 'Supply Chain nav appears when disabled');
  assertReady(!/<meta name="robots" content="noindex, nofollow"/.test(homeHtml), 'disabled homepage should not be noindex');
  return passed;
}

function assertEnabledBuild(data) {
  rmSync(distDir, { recursive: true, force: true });
  const passed = runCheck('enabled build smoke', 'cd site && npm run build', {
    env: { ENABLE_SUPPLY_CHAIN_PAGES: 'true' },
  });
  assertReady(passed, 'enabled build did not complete');

  const expectedRoutes = getSupplyChainRoutes({ enabled: true, data });
  const expectedRouteUrls = new Set(expectedRoutes.map(routeUrl));
  const generatedCount = generatedSupplyChainPageCount();
  assertReady(existsSync(htmlPathForRoute('/supply-chain/')), '/supply-chain/ index missing when enabled');
  assertReady(generatedCount === expectedRoutes.length, `generated Supply Chain route count ${generatedCount} did not match expected ${expectedRoutes.length}`);

  const homeHtml = readIfExists(path.join(distDir, 'index.html'));
  const supplyChainHtmlFiles = walkFiles(path.join(distDir, 'supply-chain'), (filePath) => filePath.endsWith('.html'));
  const supplyChainHtml = supplyChainHtmlFiles.map((filePath) => readIfExists(filePath)).join('\n');
  assertReady(homeHtml.includes('href="/supply-chain/"'), 'Supply Chain nav missing when enabled');
  assertReady(!/Canary/i.test(supplyChainHtml), 'public Supply Chain output contains Canary');

  const indexPath = htmlPathForRoute('/supply-chain/');
  assertSeo(indexPath, '/supply-chain/');

  SUPPLY_CHAIN_FEATURED_INCIDENT_IDS.forEach((id) => {
    const route = `/supply-chain/incidents/${id}/`;
    const filePath = htmlPathForRoute(route);
    const html = readIfExists(filePath);
    assertReady(Boolean(html), `${route} missing when enabled`);
    assertReady(/Executive Summary/.test(html), `${route} missing Executive Summary`);
    assertReady(/Timeline/.test(html), `${route} missing Timeline`);
    assertReady(/Attack Chain/.test(html), `${route} missing Attack Chain`);
    assertReady(/Defensive Lessons/.test(html), `${route} missing Defensive Lessons`);
    assertSeo(filePath, route);
  });

  supplyChainHtmlFiles.forEach((filePath) => {
    const html = readIfExists(filePath);
    extractSupplyChainHrefs(html).forEach((href) => {
      assertReady(expectedRouteUrls.has(href), `generated page links to unknown Supply Chain route: ${href}`);
      assertReady(existsSync(htmlPathForRoute(href)), `generated page links to missing Supply Chain HTML: ${href}`);
    });
    assertReady(!/<meta name="robots" content="noindex, nofollow"/.test(html), `${filePath} should not be noindex when enabled`);
    extractJsonLdBlocks(html).forEach((block, index) => {
      try {
        JSON.parse(block);
      } catch (error) {
        failures.push(`${filePath} JSON-LD block ${index + 1} is invalid JSON: ${error.message}`);
      }
    });
  });

  return { passed, generatedCount };
}

const data = loadSupplyChainData();

runCheck('incident validation', 'python3 scripts/validate_supply_chain_incidents.py');
runCheck('graph validation', 'python3 scripts/validate_supply_chain_graph.py');
runCheck('page model test', 'node scripts/test-supply-chain-pages.mjs');
runCheck('site dependency install', 'cd site && npm ci --no-audit --no-fund');

assertDisabledBuild();
const enabledResult = assertEnabledBuild(data);

const status = failures.length === 0 ? 'pass' : 'fail';
const report = writeReport(status, data, {
  counts: {
    enabled_generated_routes: enabledResult.generatedCount,
  },
});

console.log(`Supply Chain public readiness: ${report.status.toUpperCase()}`);
console.log(`Report: ${path.relative(repoRoot, reportPath)}`);
if (failures.length > 0) {
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
