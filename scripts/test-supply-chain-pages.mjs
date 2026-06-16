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
assert.ok(routeUrls.has('/supply-chain/packages/pkg-npm-ctrl-tinycolor/'), 'Shai-Hulud package route should be generated');
assert.ok(routeUrls.has('/supply-chain/packages/pkg-golang-github-com-boltdb-go-bolt/'), 'Go typosquat package route should be generated');
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
assert.equal(index.counts.releases, data.entities.releases.length, 'index should expose release count');
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
  const page = getSupplyChainIncidentPage(incident.id, data);
  assert.equal(page.editorialSections.length, 7, `featured incident should include all editorial sections: ${incident.id}`);
  page.editorialSections.forEach((section) => {
    assert.ok(section.items.length > 0, `featured editorial section should have items: ${incident.id} ${section.key}`);
    section.items.forEach((item) => {
      assert.ok(item.references.length > 0, `featured editorial item should resolve references: ${incident.id} ${section.key}`);
      item.references.forEach((reference) => {
        assert.ok(reference.url, `resolved reference should include URL: ${incident.id} ${section.key}`);
      });
    });
  });
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
assert.equal(codecov.editorialSections.length, 0, 'non-featured incident page should not render editorial sections');
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

const xz = getSupplyChainIncidentPage('SC-2024-XZ-UTILS', data);
assert.equal(xz.incident.attribution_confidence, 'suspected', 'XZ page should expose attribution confidence');
assert.ok(
  xz.sections.actors.some((actor) => actor.id === 'actor-unc-xz-utils-operator'),
  'XZ page should include provisional operator link'
);
assert.ok(
  xz.connectedEntities.some((entity) => entity.id === 'actor-unc-xz-utils-operator' && entity.entityType === 'Threat Actor'),
  'incident connected entities should include actor nodes with display labels'
);
assert.ok(xz.sections.attributionEvidence.length > 0, 'incident page should include attribution evidence');
assert.ok(
  xz.sections.attributionEvidence.every((item) => item.references.length > 0),
  'attribution evidence references should resolve'
);
const staleAttributionRelationshipData = {
  ...data,
  relationships: data.relationships.filter(
    (relationship) =>
      !(
        relationship.source === 'incident-SC-2024-XZ-UTILS' &&
        relationship.target === 'actor-unc-xz-utils-operator' &&
        relationship.type === 'ATTRIBUTED_TO_ACTOR'
      )
  ),
};
assert.equal(
  validateSupplyChainPageData(staleAttributionRelationshipData).length,
  0,
  'page data validator should still pass when an actor remains connected elsewhere'
);
const staleXz = getSupplyChainIncidentPage('SC-2024-XZ-UTILS', staleAttributionRelationshipData);
assert.ok(
  staleXz.sections.actors.some((actor) => actor.id === 'actor-unc-xz-utils-operator'),
  'incident pages should fall back to corpus threat_actors when generated incident attribution edges are stale'
);
assert.ok(
  staleXz.connectedEntities.some((entity) => entity.id === 'actor-unc-xz-utils-operator' && entity.entityType === 'Threat Actor'),
  'incident connected entities should fall back to corpus threat_actors when generated incident attribution edges are stale'
);

const uaParser = getSupplyChainIncidentPage('SC-2021-UA-PARSER-JS', data);
assert.equal(uaParser.sections.releases.length, 3, 'ua-parser-js page should include three affected releases');
assert.ok(
  uaParser.sections.releases.some((release) => release.id === 'release-npm-ua-parser-js-0-7-29'),
  'ua-parser-js page should include release entity details'
);
assert.ok(
  uaParser.sections.releases.every((release) => release.context.includes('pkg:npm/ua-parser-js@')),
  'release rows should expose versioned PURL context'
);

const eventStream = getSupplyChainIncidentPage('SC-2018-NPM-EVENT-STREAM', data);
assert.ok(
  eventStream.sections.maintainerTenureAtMaliciousRelease.some(
    (row) =>
      row.maintainer.id === 'maintainer-right9ctrl' &&
      row.release.id === 'release-npm-flatmap-stream-0-1-1' &&
      row.days === 0
  ),
  'event-stream page should derive maintainer tenure at malicious release from stored anchors'
);

const threeCx = getSupplyChainIncidentPage('SC-2023-THREE-CX-DESKTOP', data);
assert.ok(
  threeCx.sections.actors.some((actor) => actor.href === '/threat-actors/lazarus-group/'),
  '3CX page should link to the existing Lazarus actor page'
);
assert.ok(
  threeCx.sections.campaigns.some((campaign) => campaign.href === '/campaigns/lazarus-3cx-supply-chain-compromise-2023/'),
  '3CX page should link to the existing campaign page'
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

const jiaTanMaintainer = getSupplyChainEntityPage('maintainers', 'maintainer-jia-tan', data);
assert.ok(
  jiaTanMaintainer.connectedEntities.some((entity) => entity.id === 'repo-github-com-tukaani-project-xz'),
  'maintainer page should surface maintained repository connections'
);
assert.ok(
  jiaTanMaintainer.connectedEntities.some(
    (entity) => entity.id === 'actor-unc-xz-utils-operator' && entity.entityType === 'Threat Actor' && entity.href === null
  ),
  'maintainer page should surface provisional actor connections even without a public actor route'
);
assert.equal(
  jiaTanMaintainer.connectedEntities.filter((entity) => entity.id === 'actor-unc-xz-utils-operator').length,
  1,
  'maintainer page should not duplicate actor connections that are both direct and incident-derived'
);

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
