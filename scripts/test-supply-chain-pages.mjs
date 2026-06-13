#!/usr/bin/env node
import assert from 'node:assert/strict';
import {
  SUPPLY_CHAIN_FEATURED_INCIDENT_IDS,
  getSupplyChainEntityPage,
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
assert.equal(index.counts.incidents, data.incidents.length, 'index should expose incident count');
assert.equal(index.counts.relationships, data.relationships.length, 'index should expose relationship count');
assert.equal(index.counts.buildSystems, data.entities.build_systems.length, 'index should expose build system count');
assert.equal(index.counts.distributionChannels, data.entities.distribution_channels.length, 'index should expose distribution channel count');
assert.ok(/supply chain/i.test(index.lede), 'index should include polished public copy');
assert.ok(!JSON.stringify(index).includes('Canary'), 'public page model should not expose the internal codename');
assert.equal(index.explanatorySections.length, 4, 'index should include explanatory sections');
assert.equal(index.featuredIncidents.length, 5, 'index should include five featured incidents');
assert.deepEqual(
  index.featuredIncidents.map((incident) => incident.id),
  SUPPLY_CHAIN_FEATURED_INCIDENT_IDS,
  'featured incident order should be curated and stable'
);
index.featuredIncidents.forEach((incident) => {
  assert.ok(routeUrls.has(incident.href), `featured incident route should resolve: ${incident.href}`);
});
assert.equal(index.entitySummaries.length, 7, 'index should include seven entity summary cards');
assert.ok(index.seo.title, 'index should include SEO title');
assert.ok(index.seo.description, 'index should include SEO description');
assert.equal(index.seo.canonicalPath, '/supply-chain/', 'index should include canonical path');
assert.ok(index.seo.ogTitle, 'index should include Open Graph title');
assert.ok(index.seo.ogDescription, 'index should include Open Graph description');
assert.ok(index.seo.jsonLd, 'index should include JSON-LD');

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
assert.ok(codecov.connectedEntities.length > 0, 'incident page should include relationship-aware connected entities');
assert.equal(
  new Set(codecov.connectedEntities.map((entity) => entity.href || entity.id)).size,
  codecov.connectedEntities.length,
  'incident connected entities should be deduplicated by entity'
);
codecov.connectedEntities.forEach((entity) => {
  assert.ok(
    ![
      'accounts',
      'build_systems',
      'distribution_channels',
      'maintainers',
      'organizations',
      'packages',
      'repositories',
    ].includes(entity.entityType),
    'connected entity labels should use singular display names'
  );
});
assert.ok(codecov.seo.title.includes('Supply Chain'), 'incident page should include SEO title');
assert.ok(codecov.seo.description, 'incident page should include SEO description');
assert.equal(
  codecov.seo.canonicalPath,
  '/supply-chain/incidents/SC-2021-CODECOV-BASH-UPLOADER/',
  'incident page should include canonical path'
);
assert.ok(codecov.seo.ogTitle, 'incident page should include Open Graph title');
assert.ok(codecov.seo.jsonLd, 'incident page should include JSON-LD');
assert.deepEqual(
  codecov.seo.jsonLd.about,
  codecov.incident.supply_chain_vectors.map((vector) => ({ '@type': 'Thing', name: vector })),
  'incident JSON-LD should expose supply-chain vectors as Thing objects'
);

const eventStreamPackage = getSupplyChainEntityPage('packages', 'pkg-npm-event-stream', data);
assert.ok(eventStreamPackage.relatedIncidents.length > 0, 'entity page should include related incidents');
eventStreamPackage.relatedIncidents.forEach((incident) => {
  assert.ok(routeUrls.has(incident.href), `related incident route should resolve: ${incident.href}`);
});
assert.ok(eventStreamPackage.connectedEntities.length > 0, 'entity page should include connected entities');
eventStreamPackage.connectedEntities.forEach((entity) => {
  assert.ok(
    ![
      'accounts',
      'build_systems',
      'distribution_channels',
      'maintainers',
      'organizations',
      'packages',
      'repositories',
    ].includes(entity.entityType),
    'entity labels should use singular display names'
  );
});
assert.ok(eventStreamPackage.seo.title.includes('Package'), 'entity page should include SEO title');
assert.ok(eventStreamPackage.seo.description, 'entity page should include SEO description');
assert.equal(
  eventStreamPackage.seo.canonicalPath,
  '/supply-chain/packages/pkg-npm-event-stream/',
  'entity page should include canonical path'
);
assert.ok(eventStreamPackage.seo.ogTitle, 'entity page should include Open Graph title');
assert.ok(eventStreamPackage.seo.jsonLd, 'entity page should include JSON-LD');

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
