#!/usr/bin/env node
import assert from 'node:assert/strict';
import {
  getSupplyChainIncidentPage,
  getSupplyChainIndexModel,
  getSupplyChainRoutes,
  loadSupplyChainData,
  validateSupplyChainPageData,
} from '../site/src/lib/supplyChainPages.mjs';

const data = loadSupplyChainData();

function routeUrl(route) {
  return route.slug ? `/supply-chain/${route.slug}/` : '/supply-chain/';
}

function collectSupplyChainHrefs(value, hrefs = []) {
  if (!value || typeof value !== 'object') return hrefs;
  if (Array.isArray(value)) {
    value.forEach((item) => collectSupplyChainHrefs(item, hrefs));
    return hrefs;
  }
  if (typeof value.href === 'string' && value.href.startsWith('/supply-chain/')) {
    hrefs.push(value.href);
  }
  Object.values(value).forEach((item) => collectSupplyChainHrefs(item, hrefs));
  return hrefs;
}

const disabledRoutes = getSupplyChainRoutes({ enabled: false, data });
assert.equal(disabledRoutes.length, 0, 'feature flag disabled should generate no routes');

const routes = getSupplyChainRoutes({ enabled: true, data });
const routeUrls = new Set(routes.map(routeUrl));
assert.ok(routeUrls.has('/supply-chain/'), 'index route should be generated');
assert.ok(routeUrls.has('/supply-chain/incidents/SC-2021-CODECOV-BASH-UPLOADER/'), 'incident route should be generated');
assert.ok(routeUrls.has('/supply-chain/packages/pkg-npm-event-stream/'), 'package route should be generated');
assert.ok(routeUrls.has('/supply-chain/repositories/repo-github-com-codecov-codecov-bash/'), 'repository route should be generated');
assert.ok(routeUrls.has('/supply-chain/organizations/org-codecov/'), 'organization route should be generated');
assert.ok(routeUrls.has('/supply-chain/maintainers/maintainer-jia-tan/'), 'maintainer route should be generated');

const expectedRouteCount =
  1 +
  data.incidents.length +
  data.entities.packages.length +
  data.entities.repositories.length +
  data.entities.organizations.length +
  data.entities.maintainers.length;
assert.equal(routes.length, expectedRouteCount, 'enabled route count should match routed page types');

const index = getSupplyChainIndexModel(data);
assert.equal(index.counts.incidents, 25, 'index should expose incident count');
assert.equal(index.counts.relationships, 95, 'index should expose relationship count');
assert.equal(index.counts.buildSystems, 6, 'index should expose build system count');
assert.equal(index.counts.distributionChannels, 11, 'index should expose distribution channel count');

const codecov = getSupplyChainIncidentPage('SC-2021-CODECOV-BASH-UPLOADER', data);
assert.ok(codecov.incident.summary, 'incident page should include summary');
assert.equal(codecov.incident.confidence, 'high', 'incident page should include confidence');
assert.equal(codecov.incident.evidence_level, 'vendor', 'incident page should include evidence level');
assert.equal(codecov.incident.attack_stage, 'ci_cd_compromise', 'incident page should include attack stage');
assert.equal(codecov.incident.source_artifact_divergence, true, 'incident page should include source-artifact divergence');
assert.ok(codecov.sections.repositories.length > 0, 'incident page should include repositories');
assert.ok(codecov.sections.organizations.length > 0, 'incident page should include organizations');
assert.ok(codecov.sections.buildSystems.length > 0, 'incident page should include build systems');
assert.ok(codecov.sections.distributionChannels.length > 0, 'incident page should include distribution channels');
assert.ok(codecov.incident.references.length > 0, 'incident page should include references');

const brokenData = {
  ...data,
  relationships: data.relationships.map((relationship, index) =>
    index === 0 ? { ...relationship, target: 'pkg-missing' } : relationship
  ),
};
assert.ok(validateSupplyChainPageData(brokenData).some((error) => error.includes('target unknown')));
assert.throws(
  () => getSupplyChainRoutes({ enabled: true, data: brokenData }),
  /Supply Chain page data is invalid/,
  'broken relationship targets should block route generation'
);

routes.forEach((route) => {
  collectSupplyChainHrefs(route.page).forEach((href) => {
    assert.ok(routeUrls.has(href), `orphan internal supply-chain link: ${href}`);
  });
});

console.log(`Supply Chain page tests passed: routes=${routes.length}`);
