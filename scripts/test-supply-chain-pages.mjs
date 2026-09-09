#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  SUPPLY_CHAIN_FEATURED_INCIDENT_IDS,
  getSupplyChainEntityPage,
  getSupplyChainExploreModel,
  getSupplyChainIncidentPage,
  getSupplyChainIndexModel,
  getSupplyChainMalwareFamilyPage,
  getSupplyChainRoutes,
  loadSupplyChainData,
  validateSupplyChainPageData,
} from '../site/src/lib/supplyChainPages.mjs';
import { buildMalwareFamilyStixBundle, buildSupplyChainGraphData, buildSupplyChainSearchIndex } from './build-supply-chain-graph.mjs';

const data = loadSupplyChainData();
const baseLayoutSource = readFileSync(new URL('../site/src/layouts/Base.astro', import.meta.url), 'utf-8');
const supplyChainPagesSource = readFileSync(new URL('../site/src/lib/supplyChainPages.mjs', import.meta.url), 'utf-8');
const supplyChainRouteSource = readFileSync(new URL('../site/src/pages/supply-chain/[...slug].astro', import.meta.url), 'utf-8');
const supplyChainEntityListSource = readFileSync(new URL('../site/src/components/SupplyChainEntityList.astro', import.meta.url), 'utf-8');
const supplyChainGraphSource = readFileSync(new URL('../site/public/js/supply-chain-graph-core.js', import.meta.url), 'utf-8');
const supplyChainGraphPayload = JSON.parse(
  readFileSync(new URL('../site/public/supply-chain-graph.json', import.meta.url), 'utf-8')
);
const supplyChainSearchIndexPayload = JSON.parse(
  readFileSync(new URL('../site/public/supply-chain-search-index.json', import.meta.url), 'utf-8')
);
const malwareFamilyStixPayload = JSON.parse(
  readFileSync(new URL('../site/public/supply-chain-malware-families-stix.json', import.meta.url), 'utf-8')
);

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
const indexModel = getSupplyChainIndexModel(data);
const routeUrls = new Set(routes.map(routeUrl));
assert.ok(routeUrls.has('/supply-chain/'), 'index route should be generated');
assert.ok(routeUrls.has('/supply-chain/explore/'), 'explore route should be generated');
assert.ok(routeUrls.has('/supply-chain/incidents/SC-2021-CODECOV-BASH-UPLOADER/'), 'incident route should be generated');
assert.ok(routeUrls.has('/supply-chain/packages/pkg-npm-event-stream/'), 'package route should be generated');
assert.ok(routeUrls.has('/supply-chain/packages/pkg-npm-ctrl-tinycolor/'), 'Shai-Hulud package route should be generated');
assert.ok(routeUrls.has('/supply-chain/packages/pkg-golang-github-com-boltdb-go-bolt/'), 'Go typosquat package route should be generated');
assert.ok(routeUrls.has('/supply-chain/repositories/repo-github-com-codecov-codecov-bash/'), 'repository route should be generated');
assert.ok(routeUrls.has('/supply-chain/organizations/org-codecov/'), 'organization route should be generated');
assert.ok(routeUrls.has('/supply-chain/maintainers/maintainer-jia-tan/'), 'maintainer route should be generated');
assert.ok(routeUrls.has('/supply-chain/malware-families/family-shai-hulud/'), 'malware-family lineage route should be generated');
assert.ok(
  indexModel.lineageViews.some((view) =>
    view.id === 'family-shai-hulud' &&
    view.href === '/supply-chain/malware-families/family-shai-hulud/' &&
    view.command.graphType === 'malware_family' &&
    view.strainCount > 0
  ),
  'index model should expose malware-family lineage views with graph commands'
);
const shaiHuludFamily = getSupplyChainMalwareFamilyPage('family-shai-hulud', data);
assert.equal(shaiHuludFamily.kind, 'malware-family', 'malware-family page model should use dedicated kind');
assert.ok(
  shaiHuludFamily.phylogeny.edges.some((edge) => edge.type === 'EVOLVED_FROM' && edge.confidence === 'confirmed') &&
    shaiHuludFamily.phylogeny.edges.some((edge) => edge.type === 'VARIANT_OF' && edge.confidence === 'suspected') &&
    shaiHuludFamily.phylogeny.forks.some((event) => event.id === 'fork-mini-shai-source-release'),
  'malware-family page should model confirmed genealogy, suspected forks, and fork events'
);
assert.deepEqual(
  shaiHuludFamily.phylogeny.ticks,
  data.malwareFamilies[0].timeline_ticks,
  'malware-family timeline ticks should come from the family object'
);
assert.ok(
  !supplyChainPagesSource.includes("{ label: 'Sep 2025', x: 90 }"),
  'malware-family page model should not fall back to Shai-Hulud-specific timeline ticks'
);
assert.deepEqual(
  shaiHuludFamily.phylogeny.parentByChild['strain-miasma'],
  ['strain-mini-shai-hulud'],
  'malware-family parent map should retain parent arrays for DAG lineage'
);
assert.equal(
  shaiHuludFamily.phylogeny.edges.find((edge) => edge.id === 'strain-ironworm->strain-mini-shai-hulud')?.labelY,
  306,
  'fork-linked lineage labels should align from the fork marker layout'
);
assert.ok(
  supplyChainRouteSource.includes('transition:persist="supply-chain-graph-hero"'),
  'route should persist graph hero across Supply Chain navigation'
);
assert.equal(getSupplyChainExploreModel(data).kind, 'explore', 'explore model should use a dedicated kind');
assert.ok(
  supplyChainRouteSource.includes("page.kind === 'explore' ? 'preserve'") &&
    supplyChainRouteSource.includes('data-supply-chain-explore={isExplore ?') &&
    supplyChainRouteSource.includes('data-sc-explore-enter') &&
    supplyChainRouteSource.includes('data-sc-explore-exit') &&
    supplyChainRouteSource.includes('class="sc-explore-rail"') &&
    supplyChainRouteSource.includes('class="graph-search-pill"') &&
    supplyChainRouteSource.includes('data-sc-graph-zoom="in"') &&
    supplyChainRouteSource.includes('data-sc-graph-zoom="out"') &&
    supplyChainRouteSource.includes('aria-label="Zoom graph in"') &&
    supplyChainRouteSource.includes('aria-label="Zoom graph out"') &&
    supplyChainRouteSource.includes('aria-label="Search graph"') &&
    supplyChainRouteSource.includes('title="Full screen"') &&
    supplyChainRouteSource.includes('aria-label="Toggle full screen"') &&
    supplyChainRouteSource.includes('title="Exit full screen"'),
  'route should expose full-screen explore controls on the persisted graph island'
);
assert.ok(
  supplyChainRouteSource.includes('Lineage Views') &&
    supplyChainRouteSource.includes('Malware Families') &&
    supplyChainRouteSource.includes('class="lineage-view-card"') &&
    supplyChainRouteSource.includes('data-graph-type={family.command.graphType}') &&
    supplyChainRouteSource.includes('.lineage-view-grid') &&
    supplyChainRouteSource.includes('.lineage-view-card'),
  'index route should expose malware-family lineage cards from the standard Supply Chain page'
);
assert.ok(
  supplyChainRouteSource.includes(':global(body.sc-explore-active)') &&
    supplyChainRouteSource.includes('overflow: hidden') &&
    supplyChainRouteSource.includes(':global(body.sc-explore-active) :global(main)') &&
    supplyChainRouteSource.includes('position: fixed') &&
    supplyChainRouteSource.includes('max-width: none') &&
    supplyChainRouteSource.includes(':global(body.sc-explore-active) .graph-hero-explore') &&
    supplyChainRouteSource.includes('class="graph-toolbar"') &&
    supplyChainRouteSource.includes('grid-template-rows: auto minmax(360px, 1fr) auto') &&
    supplyChainRouteSource.includes('z-index: 1000') &&
    supplyChainRouteSource.includes('background: var(--bg)') &&
    supplyChainRouteSource.includes('.graph-icon-button svg') &&
    supplyChainRouteSource.includes('stroke: currentColor'),
  'full-screen explore should lock background scroll, cover the viewport, and render an SVG icon control'
);
assert.ok(
  supplyChainRouteSource.includes('<circle cx="11" cy="11" r="6.25"></circle>') &&
    supplyChainRouteSource.includes('<path d="m16 16 4.2 4.2"></path>') &&
    supplyChainRouteSource.includes('class="graph-search-label"') &&
    supplyChainRouteSource.includes('>Search</span>') &&
    supplyChainRouteSource.includes('class="graph-search-shortcut"') &&
    supplyChainRouteSource.includes('⌘K / /') &&
    supplyChainRouteSource.includes('.graph-search-pill svg') &&
    supplyChainRouteSource.includes('stroke-width: 1.5') &&
    supplyChainRouteSource.includes('stroke: currentColor'),
  'graph search trigger should render as a magnifier search pill with shortcut hints'
);
assert.ok(
  supplyChainRouteSource.includes(':global(.sc-search-backdrop)') &&
    supplyChainRouteSource.includes(':global(.sc-search-palette)') &&
    supplyChainRouteSource.includes(':global(.sc-search-input)') &&
    supplyChainRouteSource.includes(':global(.sc-search-result[aria-selected=') &&
    !supplyChainRouteSource.includes('\n  .sc-search-backdrop {'),
  'dynamically-created graph search palette styles should be global, not Astro-scoped'
);
assert.ok(
  supplyChainRouteSource.includes('data-graph-target-type="stage"') &&
    supplyChainRouteSource.includes('data-graph-target-type="actor"') &&
    supplyChainRouteSource.includes('data-graph-target-type="incident"') &&
    supplyChainRouteSource.includes('data-graph-target-value={row.stage}') &&
    supplyChainRouteSource.includes('data-graph-target-value={incident.id}') &&
    supplyChainRouteSource.includes('class={`attack-bar ${severityClass(row.severity)}`') &&
    supplyChainRouteSource.includes('aria-label={`Filter graph to ${row.label}`}'),
  'index panels should expose G6 graph command targets for stage, actor, and incident controls'
);
assert.ok(
  supplyChainEntityListSource.includes('function graphTypeFor') &&
    supplyChainEntityListSource.includes('function graphCommandFor') &&
    supplyChainEntityListSource.includes("return 'select-entity'") &&
    supplyChainEntityListSource.includes('data-graph-target-type={item.graphType}') &&
    supplyChainEntityListSource.includes('data-graph-target-value={item.graphValue}'),
  'entity lists should expose graph command targets while preserving routed links'
);
assert.ok(
  supplyChainPagesSource.includes('function incidentPropagationTimeline') &&
    supplyChainPagesSource.includes("relationship.type === 'SEEDED_BY'") &&
    supplyChainPagesSource.includes('relationship.source_incident_id === incidentId') &&
    supplyChainRouteSource.includes('page.propagationTimeline.length > 0') &&
    supplyChainRouteSource.includes('class={`propagation-hop propagation-${edge.tier}`}') &&
    supplyChainRouteSource.includes('Evidence-Gated Propagation'),
  'incident pages should render G7 propagation timelines from local SEEDED_BY edges only'
);
assert.ok(
  supplyChainRouteSource.includes("page.kind === 'malware-family'") &&
    supplyChainRouteSource.includes('data-lineage-stage') &&
    supplyChainRouteSource.includes('lineage-edge lineage-${edge.confidence}') &&
    supplyChainRouteSource.includes('Strain Comparison') &&
    supplyChainRouteSource.includes('Family Changelog') &&
    supplyChainRouteSource.includes('EVOLVED_FROM') &&
    supplyChainRouteSource.includes('SEEDED_BY'),
  'malware-family pages should render phylogeny, strain table, changelog, and genealogy/infection distinction'
);
assert.ok(
  supplyChainRouteSource.includes('detail.replaceChildren') &&
    supplyChainRouteSource.includes("document.querySelector('div[data-lineage-detail]')") &&
    supplyChainRouteSource.includes('button.dataset.lineageSummary') &&
    supplyChainRouteSource.includes('textContent') &&
    !supplyChainRouteSource.includes('detail.innerHTML'),
  'lineage detail script should render dataset-backed content as text, not HTML'
);
assert.ok(
  supplyChainRouteSource.includes('const stack = [id]') &&
    supplyChainRouteSource.includes('Array.isArray(parents[child])') &&
    supplyChainRouteSource.includes('activeEdges.add(`${child}->${parent}`)') &&
    supplyChainRouteSource.includes('data-lineage-edge={`${edge.source}->${edge.target}`}') &&
    supplyChainRouteSource.includes('data-lineage-edge-label={`${edge.source}->${edge.target}`}'),
  'lineage detail script should trace all parent edges in a DAG lineage'
);
assert.ok(
  supplyChainRouteSource.includes('data-supply-chain-graph-root') &&
    supplyChainRouteSource.includes('data-sc-graph-canvas') &&
    supplyChainRouteSource.includes('data-sc-graph-focus-reflow') &&
    supplyChainRouteSource.includes('aria-describedby="supply-chain-graph-description"') &&
    supplyChainRouteSource.includes('tabindex="0"') &&
    supplyChainRouteSource.includes('data-sc-graph-description') &&
    supplyChainRouteSource.includes('/js/supply-chain-graph-core.js'),
  'route should mount the persisted keyboard-accessible WebGL graph island'
);
assert.ok(
  supplyChainRouteSource.includes('Supply Chain graph is loading. Keyboard controls become available after graph initialization.'),
  'route should not announce keyboard graph controls before initialization succeeds'
);
assert.ok(
  supplyChainGraphPayload.nodes.some((node) => node.tier === 'incident' && node.short_label && node.short_label !== node.label),
  'graph payload should include short incident labels for the visual label layer'
);
assert.ok(
  supplyChainGraphPayload.nodes.some((node) => node.id === 'family-shai-hulud' && node.type === 'malware_family') &&
    supplyChainGraphPayload.nodes.some((node) => node.id === 'strain-mini-shai-hulud' && node.type === 'malware_strain') &&
    supplyChainGraphPayload.nodes.some((node) => node.id === 'fork-mini-shai-source-release' && node.type === 'fork_event') &&
    supplyChainGraphPayload.edges.some((edge) => edge.type === 'EVOLVED_FROM' && edge.mutation_delta?.includes('added PyPI')) &&
    supplyChainGraphPayload.edges.some((edge) => edge.type === 'VARIANT_OF' && edge.confidence === 'suspected'),
  'graph payload should include malware-family, strain, fork-event, and EVOLVED_FROM/VARIANT_OF primitives'
);
assert.ok(
  supplyChainSearchIndexPayload.some((entry) => entry.id === 'family-shai-hulud' && entry.type === 'malware_family') &&
    supplyChainSearchIndexPayload.some((entry) => entry.id === 'strain-ironworm' && entry.type === 'malware_strain'),
  'search index should include malware-family and strain jump targets'
);
assert.equal(
  supplyChainSearchIndexPayload.find((entry) => entry.id === 'strain-ironworm')?.href,
  '/supply-chain/malware-families/family-shai-hulud/#strain-ironworm',
  'malware strain search targets should navigate to the family anchor'
);
assert.ok(
  supplyChainSearchIndexPayload
    .filter((entry) => entry.type === 'malware_family' || entry.type === 'malware_strain')
    .every((entry) => entry.aliases.every((alias) => typeof alias === 'string')),
  'malware-family search aliases should be flattened before indexing'
);
assert.ok(
  supplyChainGraphSource.includes('if (entry.href)') &&
    supplyChainGraphSource.includes('window.location.href = entry.href'),
  'graph search should navigate entries with explicit hrefs before graph-selection fallback'
);
assert.ok(
  supplyChainGraphSource.includes('const CAMERA_Z_MIN = 0.22') &&
    supplyChainGraphSource.includes('const CAMERA_Z_MAX = 3.4') &&
    supplyChainGraphSource.includes('data-sc-graph-zoom') &&
    supplyChainGraphSource.includes('zoomAt(event.clientX, event.clientY, zoomFactor)') &&
    supplyChainGraphSource.includes('startPinchGesture()') &&
    supplyChainGraphSource.includes('updatePinchGesture()') &&
    supplyChainGraphSource.includes('screenToWorldAtCamera') &&
    supplyChainGraphSource.includes('cameraForAnchoredZoom'),
  'graph runtime should support visible zoom controls, cursor-anchored wheel zoom, and pinch zoom'
);
const generatedStixBundle = buildMalwareFamilyStixBundle(data);
assert.deepEqual(malwareFamilyStixPayload, generatedStixBundle, 'malware-family STIX bundle should be generated from the same data object');
assert.equal(malwareFamilyStixPayload.type, 'bundle', 'malware-family STIX output should be a STIX bundle');
assert.ok(
  malwareFamilyStixPayload.objects.some((object) => object.type === 'malware' && object.name === 'Mini Shai-Hulud') &&
    malwareFamilyStixPayload.objects.some((object) => object.type === 'relationship' && object.relationship_type === 'variant-of'),
  'malware-family STIX bundle should include malware strain objects and variant relationships'
);
assert.ok(
  malwareFamilyStixPayload.objects.every((object) => /^[a-z-]+--[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(object.id)),
  'malware-family STIX object identifiers should use deterministic UUIDv5 shape'
);
assert.deepEqual(
  malwareFamilyStixPayload.objects.find((object) => object.type === 'malware' && object.name === 'Mini Shai-Hulud')?.malware_types,
  ['worm'],
  'malware-family STIX objects should derive malware type from the family/strain model'
);
const monthOnlyStixFixture = structuredClone(data);
monthOnlyStixFixture.malwareFamilies[0].strains[0].first_seen = '2025-09';
assert.equal(
  buildMalwareFamilyStixBundle(monthOnlyStixFixture).objects.find((object) => object.type === 'malware' && object.name === 'Shai-Hulud')?.first_seen,
  '2025-09-01T00:00:00.000Z',
  'month-only malware strain dates should emit valid full STIX timestamps'
);
assert.ok(
  supplyChainGraphSource.includes('REST_NODE_BUDGET = 40') &&
    supplyChainGraphSource.includes('RECENT_WINDOW_DAYS = 183') &&
    supplyChainGraphSource.includes('restVisibleIds()') &&
    supplyChainGraphSource.includes('visibleBaseNodes(options = {})'),
  'graph runtime should cull the resting view to actors plus recent-window incidents and campaigns'
);
assert.ok(
  supplyChainGraphSource.includes("const SEARCH_INDEX_URL = '/supply-chain-search-index.json'") &&
    supplyChainGraphSource.includes('openSearchPalette(trigger = null)') &&
    supplyChainGraphSource.includes('scoreSearchEntry(entry, query)') &&
    supplyChainGraphSource.includes("event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey) && !interactiveTarget") &&
    supplyChainGraphSource.includes("event.key === '/'") &&
    supplyChainGraphSource.includes('selectSearchResult(entry)') &&
    supplyChainGraphSource.includes('parseGraphStateParam') &&
    supplyChainGraphSource.includes('updateGraphUrl()') &&
    supplyChainGraphSource.includes('exitExploreRoute()'),
  'graph runtime should provide jump-to search, keyboard shortcuts, URL selection sync, and Esc explore exit'
);
assert.ok(
  supplyChainGraphSource.includes("this.openSearchPalette(searchTarget)") &&
    supplyChainGraphSource.includes('this.openSearchPalette()') &&
    supplyChainGraphSource.includes('trigger instanceof Element') &&
    supplyChainGraphSource.includes('document.activeElement instanceof Element') &&
    supplyChainGraphSource.includes('document.activeElement !== this.root') &&
    supplyChainGraphSource.includes("document.querySelector('[data-sc-search-open]') || this.root") &&
    supplyChainGraphSource.includes("document.getElementById('menu-search')?.blur()") &&
    supplyChainGraphSource.includes("backdrop.dataset.scSearchBackdrop = 'true'") &&
    supplyChainGraphSource.includes("this.searchInput?.focus({ preventScroll: true })") &&
    supplyChainGraphSource.includes('const returnTarget = this.searchReturnFocus?.isConnected ? this.searchReturnFocus : this.root') &&
    supplyChainGraphSource.includes("if (event.target === backdrop) this.closeSearchPalette()"),
  'graph search shortcuts should open the centered graph palette, avoid the global menu search, and restore trigger focus on close'
);
assert.ok(
  supplyChainGraphSource.includes('function shortNodeLabel') &&
    supplyChainGraphSource.includes('shouldLabelNode(node)') &&
    supplyChainGraphSource.includes('this.camera.z >= CAMPAIGN_LABEL_Z') &&
    supplyChainGraphSource.includes('this.camera.z >= INCIDENT_LABEL_Z') &&
    supplyChainGraphSource.includes('labelFits(candidate, occupied)') &&
    supplyChainGraphSource.includes('shortNodeLabel(item.node)'),
  'graph labels should use short labels, projected node positions, LOD thresholds, and collision rejection'
);
assert.ok(
  supplyChainGraphSource.includes('const pushCurve =') &&
    supplyChainGraphSource.includes("return edge.type === 'SEEDED_BY' ? 0.56 : 0.3;") &&
    supplyChainGraphSource.includes('return 0.035;') &&
    supplyChainGraphSource.includes('selection.nodes?.has(edge.source) && this.selection.nodes?.has(edge.target)'),
  'graph edges should render as subdued curves and brighten only for selected subgraphs'
);
assert.ok(
  !supplyChainRouteSource.includes('class="graph-hero graph-hero-persistent"\n    transition:persist='),
  'route should not persist page-specific hero copy or selection data'
);
assert.ok(
  baseLayoutSource.includes("document.addEventListener('astro:before-preparation'"),
  'Base layout should use Astro before-preparation to scope client transitions'
);
assert.ok(
  baseLayoutSource.includes('isSupplyChainPath(fromPath) && isSupplyChainPath(toPath)'),
  'Base layout should keep client transitions only between Supply Chain routes'
);
assert.ok(
  baseLayoutSource.includes('ev.preventDefault();') && baseLayoutSource.includes('window.location.href = to.href;'),
  'Base layout should force normal navigation outside Supply Chain routes'
);
assert.ok(
  baseLayoutSource.includes('const to = ev.to;') &&
    baseLayoutSource.includes('if (to)') &&
    baseLayoutSource.includes('to.pathname !== fromPath || to.search !== window.location.search') &&
    baseLayoutSource.includes('ev.preventDefault();') &&
    baseLayoutSource.includes('window.location.href = to.href;'),
  'Base layout transition fallback should guard optional destination data and preserve same-page hash navigation'
);
assert.ok(
  !baseLayoutSource.includes('function scopeAstroTransitionsToSupplyChain()'),
  'Base layout should not mutate anchor data-astro-reload attributes after Astro morphs'
);
assert.ok(
  !baseLayoutSource.includes("anchor.setAttribute('data-astro-reload', '')"),
  'Base layout should not rely on per-anchor reload markers'
);
assert.ok(
  baseLayoutSource.includes('function syncBodyScrollLock') &&
    baseLayoutSource.includes("document.body.style.overflow = panel?.classList.contains('open') ? 'hidden' : '';") &&
    baseLayoutSource.includes('syncBodyScrollLock(panel);'),
  'Base layout should prevent background scrolling while the hamburger menu is open'
);
assert.ok(
  baseLayoutSource.includes('function toggleMenu()') &&
    baseLayoutSource.includes("document.getElementById('hamburger-btn')") &&
    baseLayoutSource.includes('document.documentElement.dataset.threatpediaMenuBound'),
  'Base layout should use delegated hamburger menu handling against the current DOM'
);
assert.ok(
  baseLayoutSource.includes('function closeMenu()') && baseLayoutSource.includes("if (e.key !== 'Escape') return;\n          closeMenu();"),
  'Base layout should use the shared closeMenu helper for delegated Escape key handling'
);
assert.ok(
  baseLayoutSource.includes('function initializeThreatpediaLayout()'),
  'Base layout should expose a reusable initializer for first load and Astro transitions'
);
assert.ok(
  baseLayoutSource.includes('initializeThreatpediaLayout();'),
  'Base layout should bind menu/search/content enhancement immediately on first server-rendered load'
);
assert.ok(
  baseLayoutSource.includes("document.addEventListener('astro:page-load', initializeThreatpediaLayout)"),
  'Base layout should rerun bindings after Astro page transitions'
);
assert.ok(
  baseLayoutSource.includes('syncBodyScrollLock();'),
  'Base layout should clear stale scroll locks after Astro page transitions'
);
assert.ok(
  baseLayoutSource.includes('syncBodyScrollLock(panel);') &&
    baseLayoutSource.indexOf('syncBodyScrollLock(panel);') !== baseLayoutSource.lastIndexOf('syncBodyScrollLock(panel);'),
  'Base layout should preserve scroll lock when duplicate page-load initialization sees an already-open search menu'
);
assert.ok(
  baseLayoutSource.includes('searchInput.dataset.threatpediaAutoSearchFor !== autoSearchKey'),
  'Base layout should not repeat URL auto-search on duplicate initializer calls for the same page'
);
assert.ok(
  baseLayoutSource.includes('function handleSearchInput(searchInput)') &&
    baseLayoutSource.includes('if (searchInput.value.trim() === q)'),
  'Base layout search should not render stale async query results'
);
assert.ok(
  baseLayoutSource.includes('function handleSearchKeydown(e)') && baseLayoutSource.includes('e.stopPropagation();'),
  'Base layout search Escape handling should not close the full menu when dismissing visible results'
);
assert.ok(
  baseLayoutSource.includes('document.documentElement.dataset.threatpediaSearchBound') &&
    baseLayoutSource.includes("document.addEventListener('input',") &&
    baseLayoutSource.includes("document.addEventListener('keydown', (e) =>") &&
    baseLayoutSource.includes('}, { capture: true });'),
  'Base layout should use delegated search listeners with capture-phase Escape handling'
);
assert.ok(
  baseLayoutSource.includes('document.documentElement.dataset.threatpediaTooltipBound') &&
    baseLayoutSource.includes("document.addEventListener('mouseover',") &&
    baseLayoutSource.includes("document.addEventListener('focusin',") &&
    baseLayoutSource.includes("target?.closest('.tp-tooltip')") &&
    baseLayoutSource.includes('clearTimeout(tooltipHideTimeout);') &&
    !baseLayoutSource.includes("span.addEventListener('mouseenter'"),
  'Base layout should use delegated tooltip listeners that survive Astro cache restores and keep tooltip links focusable'
);
assert.ok(
  baseLayoutSource.includes('let glossaryPromise = null;') &&
    baseLayoutSource.includes('let crossRefPromise = null;') &&
    baseLayoutSource.includes("glossaryPromise = tryFetch('/glossary-data.json', '/src/data/glossary-index.json')") &&
    baseLayoutSource.includes("crossRefPromise = tryFetch('/cross-ref-index.json')") &&
    baseLayoutSource.includes('glossaryPromise,\n              crossRefPromise,'),
  'Base layout should cache glossary and cross-reference fetch promises across Astro transitions'
);
assert.ok(
  !/function initializeThreatpediaLayout\(\) \{[\s\S]*?if \(!btn \|\| !overlay \|\| !panel\) return;/.test(baseLayoutSource),
  'Base layout page-load handler should not return early when menu elements are absent'
);
assert.ok(
  !baseLayoutSource.includes('btn.dataset.threatpediaBound') && !baseLayoutSource.includes('searchInput.dataset.threatpediaBound'),
  'Base layout should not store listener guards on morphable menu or search elements'
);

const expectedRouteCount =
  2 +
  data.incidents.length +
  data.entities.packages.length +
  data.entities.repositories.length +
  data.entities.organizations.length +
  data.entities.maintainers.length +
  data.malwareFamilies.length;
assert.equal(routes.length, expectedRouteCount, 'enabled route count should match routed page types');

const index = getSupplyChainIndexModel(data);
assert.equal(index.counts.incidents, data.incidents.length, 'index should expose incident count');
assert.equal(index.counts.relationships, data.relationships.length, 'index should expose relationship count');
assert.equal(index.counts.releases, data.entities.releases.length, 'index should expose release count');
assert.equal(index.counts.buildSystems, data.entities.build_systems.length, 'index should expose build system count');
assert.equal(index.counts.distributionChannels, data.entities.distribution_channels.length, 'index should expose distribution channel count');
assert.ok(/supply chain/i.test(index.lede), 'index should include polished public copy');
assert.ok(!JSON.stringify(index).includes('Canary'), 'public page model should not expose the internal codename');
assert.equal(index.graphHero.status, 'WebGL graph loading', 'index should expose the G2 graph loading state');
assert.equal(index.graphHero.nodeCount, supplyChainGraphPayload.nodes.length, 'graph hero should expose rendered graph node count');
assert.equal(index.graphHero.relationshipCount, supplyChainGraphPayload.edges.length, 'graph hero should expose rendered graph edge count');
assert.equal(index.incidents.length, data.incidents.length, 'index should expose every incident row');
assert.ok(index.incidents.every((incident) => incident.summary), 'index incident rows should preserve summaries');
index.incidents.forEach((incident) => {
  assert.ok(routeUrls.has(incident.href), `index incident route should resolve: ${incident.href}`);
});
assert.ok(index.attackVectorBars.length > 0, 'index should include attack vector controls');
assert.ok(
  index.attackVectorBars.some((row) => row.stage === 'ci_cd_compromise' && row.label === 'CI/CD Compromise'),
  'attack vector labels should preserve CI/CD capitalization'
);
assert.equal(
  index.attackVectorBars.reduce((total, row) => total + row.count, 0),
  data.incidents.length,
  'attack vector bars should cover all incidents'
);
index.attackVectorBars.forEach((row) => {
  assert.equal(row.command.type, 'filter-stage', `attack vector should include graph filter command: ${row.stage}`);
  assert.ok(row.percent >= 8 && row.percent <= 100, `attack vector width should be bounded: ${row.stage}`);
  assert.ok(row.incidents.length === row.count, `attack vector incident list should match count: ${row.stage}`);
});
assert.ok(index.attributionRows.length > 0, 'index should include attribution rows');
index.attributionRows.forEach((row) => {
  assert.equal(row.command.type, 'select-actor', `attribution row should include graph select command: ${row.id}`);
  assert.ok(row.incidentCount > 0, `attribution row should be backed by incidents: ${row.id}`);
});
const malformedAttributionData = {
  ...data,
  incidentByNodeId: undefined,
  incidents: [null, ...data.incidents],
  relationships: [null, ...data.relationships],
  entities: {
    ...data.entities,
    actors: [null, { ...data.entities.actors[0], name: null, source_incident_ids: 'not-an-array' }],
    campaigns: [
      null,
      { ...data.entities.campaigns[0], source_incident_ids: 'not-an-array' },
      {
        ...data.entities.campaigns[0],
        id: 'campaign-missing-name',
        name: null,
        source_incident_ids: [data.entities.actors[0].source_incident_ids[0]],
      },
      {
        ...data.entities.campaigns[0],
        id: 'campaign-unresolved-incident',
        name: 'Unresolved Incident Campaign',
        source_incident_ids: ['SC-DOES-NOT-EXIST'],
      },
    ],
  },
};
const malformedAttributionIndex = getSupplyChainIndexModel(malformedAttributionData);
assert.ok(
  malformedAttributionIndex.attributionRows.length > 0,
  'attribution rows should resolve incident relationships without incidentByNodeId'
);
assert.ok(
  malformedAttributionIndex.attributionRows.some((row) =>
    row.campaigns.some((campaign) => campaign.id === 'campaign-missing-name' && campaign.label === 'campaign-missing-name')
  ),
  'attribution rows should fall back to campaign ID when a campaign name is missing'
);
assert.ok(
  malformedAttributionIndex.attributionRows.some(
    (row) => row.id === data.entities.actors[0].id && row.label === data.entities.actors[0].id
  ),
  'attribution rows should fall back to actor ID when an actor name is missing'
);
assert.ok(
  malformedAttributionIndex.attributionRows.every((row) =>
    row.campaigns.every((campaign) => campaign.id !== 'campaign-unresolved-incident')
  ),
  'attribution rows should not attach campaigns through unresolved incident IDs'
);
assert.ok(index.dwellTimeline.length > 0, 'index should include dwell timeline rows');
index.dwellTimeline.forEach((row) => {
  assert.equal(row.command.type, 'select-incident', `dwell row should include graph select command: ${row.id}`);
  assert.ok(row.dwellDays >= 0, `dwell row should expose non-negative dwell days: ${row.id}`);
  assert.ok(row.barPercent >= 6 && row.barPercent <= 100, `dwell bar width should be bounded: ${row.id}`);
  assert.ok(row.warningPercent >= 0 && row.warningPercent <= 100, `warning marker should be bounded: ${row.id}`);
  assert.ok(row.warningPercent <= row.barPercent, `warning marker should not exceed visible dwell bar: ${row.id}`);
  assert.ok(row.disclosedPercent >= 0 && row.disclosedPercent <= 100, `disclosure marker should be bounded: ${row.id}`);
  assert.equal(row.disclosedPercent, row.barPercent, `disclosure marker should align with visible dwell bar: ${row.id}`);
  if (row.warningDays === row.dwellDays) {
    assert.equal(row.warningPercent, row.barPercent, `same-day warning marker should align with dwell bar: ${row.id}`);
  }
  assert.ok(routeUrls.has(row.href), `dwell incident route should resolve: ${row.href}`);
});
const isoDwellIncidentId = index.dwellTimeline[0].id;
const isoDwellData = {
  ...data,
  incidents: data.incidents.map((incident) =>
    incident.id === isoDwellIncidentId
      ? {
          ...incident,
          first_observed_at: `${incident.first_observed_at || incident.first_public_warning_at || incident.disclosed_at}T00:00:00Z`,
        }
      : incident
  ),
};
const isoDwellRow = getSupplyChainIndexModel(isoDwellData).dwellTimeline.find((row) => row.id === isoDwellIncidentId);
assert.ok(isoDwellRow && isoDwellRow.dwellDays >= 0, 'dwell timeline should parse ISO timestamp date anchors');
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

const builtGraph = buildSupplyChainGraphData(data);
assert.equal(
  supplyChainGraphPayload.schema_version,
  'threatpedia-supply-chain-graph/1',
  'graph payload should expose the G2 schema version'
);
assert.equal(
  supplyChainGraphPayload.nodes.length,
  builtGraph.nodes.length,
  'checked graph payload should match builder node count'
);
assert.equal(
  supplyChainGraphPayload.edges.length,
  builtGraph.edges.length,
  'checked graph payload should match builder edge count'
);
assert.ok(
  supplyChainGraphPayload.renderer_contract.g2_drawable_tiers.includes('incident'),
  'graph payload should declare G2 drawable tiers'
);
assert.ok(
  supplyChainGraphPayload.renderer_contract.g3_drawable_tiers.includes('technique') &&
    supplyChainGraphPayload.renderer_contract.technique_focus === 'wide-shot-default-with-operator-reflow',
  'graph payload should declare G3 technique focus behavior'
);
assert.equal(
  supplyChainGraphPayload.renderer_contract.package_release_lod,
  'g4-dive-and-bloom',
  'graph payload should declare G4 package/release dive-and-bloom behavior'
);
assert.deepEqual(
  supplyChainGraphPayload.renderer_contract.bloom_tiers,
  ['organization', 'package', 'release'],
  'graph payload should declare G4 bloom tiers'
);
assert.equal(
  supplyChainGraphPayload.renderer_contract.seeded_by_edges,
  'causal-solid-temporal-dashed',
  'graph payload should declare SEEDED_BY rendering treatment'
);
assert.ok(
  supplyChainGraphPayload.nodes.some((node) => node.type === 'package') &&
    supplyChainGraphPayload.nodes.some((node) => node.type === 'release'),
  'graph payload should preserve package and release nodes for G4 bloom rendering'
);
assert.ok(
  supplyChainGraphPayload.nodes.some((node) => node.type === 'actor') &&
    supplyChainGraphPayload.nodes.some((node) => node.type === 'campaign') &&
    supplyChainGraphPayload.nodes.some((node) => node.type === 'incident') &&
    supplyChainGraphPayload.nodes.some((node) => node.type === 'technique'),
  'graph payload should include actor, campaign, incident, and technique tiers'
);
assert.ok(
  supplyChainGraphPayload.edges.some((edge) => edge.type === 'ATTRIBUTED_TO_ACTOR') &&
    supplyChainGraphPayload.edges.some((edge) => edge.type === 'RELATED_CAMPAIGN') &&
    supplyChainGraphPayload.edges.some((edge) => edge.type === 'INCIDENT_TECHNIQUE'),
  'graph payload should include actor, campaign, and technique graph edges'
);
assert.ok(
  supplyChainGraphPayload.edges.some(
    (edge) => edge.type === 'SEEDED_BY' && edge.propagation_tier === 'causal' && edge.evidence_refs.length > 0
  ) &&
    supplyChainGraphPayload.edges.some(
      (edge) => edge.type === 'SEEDED_BY' && edge.propagation_tier === 'temporal' && edge.evidence_refs.length > 0
    ),
  'graph payload should preserve evidence-tiered SEEDED_BY propagation edges for G4'
);
const builtSearchIndex = buildSupplyChainSearchIndex(data);
assert.deepEqual(builtSearchIndex, supplyChainSearchIndexPayload, 'checked search index payload should match the builder');
assert.ok(
  builtSearchIndex.every((entry) => entry.id && entry.type && entry.displayName && Array.isArray(entry.aliases)),
  'search index entries should use the flat entity shape'
);
assert.ok(
  builtSearchIndex.some((entry) => entry.id === 'incident-SC-2025-NPM-SHAI-HULUD' && entry.type === 'incident'),
  'search index should include incidents'
);
assert.ok(
  builtSearchIndex.some(
    (entry) => entry.id === 'actor-shai-hulud-operator' && entry.type === 'actor' && entry.aliases.includes('@ctrl/tinycolor')
  ),
  'search index should let a package query recall the connected actor'
);
assert.ok(
  builtSearchIndex.some(
    (entry) =>
      entry.id === 'pkg-npm-ctrl-tinycolor' &&
      entry.type === 'package' &&
      entry.aliases.includes('tinycolor') &&
      entry.aliases.includes('pkg:npm/@ctrl/tinycolor')
  ),
  'search index should include scoped/unscoped package and decoded PURL aliases'
);
assert.ok(
  builtSearchIndex.some(
    (entry) =>
      entry.id === 'release-npm-ctrl-tinycolor-4-1-1' &&
      entry.type === 'release' &&
      entry.aliases.includes('pkg:npm/@ctrl/tinycolor@4.1.1')
  ),
  'search index should include searchable release PURLs'
);
assert.ok(
  supplyChainGraphSource.includes("getContext('webgl2'") &&
    supplyChainGraphSource.includes("getContext('webgl'") &&
    supplyChainGraphSource.includes('class SupplyChainQuadtree') &&
    supplyChainGraphSource.includes('function isBaseDrawableNode') &&
    supplyChainGraphSource.includes("const BASE_DRAWABLE_TIERS = new Set(['actor', 'campaign', 'incident', 'technique'])") &&
    supplyChainGraphSource.includes("const REST_DRAWABLE_TIERS = new Set(['actor', 'campaign', 'incident'])") &&
    supplyChainGraphSource.includes("const BLOOM_TIERS = new Set(['organization', 'package', 'release', 'repository', 'maintainer', 'account', 'supporting'])") &&
    supplyChainGraphSource.includes('const baseNodes = allNodes.filter(isBaseDrawableNode)') &&
    supplyChainGraphSource.includes("baseNodes.filter((node) => node.tier === 'incident')") &&
    supplyChainGraphSource.includes("baseNodes.filter((node) => node.tier === 'technique')") &&
    supplyChainGraphSource.includes('selectEntityContext') &&
    supplyChainGraphSource.includes('source_incident_ids') &&
    supplyChainGraphSource.includes('connected incident') &&
    supplyChainGraphSource.includes('activeActorSlots.forEach') &&
    supplyChainGraphSource.includes('archiveActorSlots') &&
    supplyChainGraphSource.includes('let laneCursor = 0') &&
    supplyChainGraphSource.includes('setCameraTarget') &&
    supplyChainGraphSource.includes('clamp(') &&
    supplyChainGraphSource.includes('this.lastLabelKey') &&
    supplyChainGraphSource.includes('this.payload.nodes.length') &&
    supplyChainGraphSource.includes('corpus nodes and'),
  'graph client should use WebGL, quadtree picking, G2/G3 base LOD culling, clone-backed layout, clamped camera targets, cached labels, and ready status'
);
assert.ok(
  supplyChainGraphSource.includes('BLOOM_Z_THRESHOLD') &&
    supplyChainGraphSource.includes('buildBloomContext') &&
    supplyChainGraphSource.includes('buildBloomLayout') &&
    supplyChainGraphSource.includes('visibleGraph()') &&
    supplyChainGraphSource.includes('BLOOM_NODE_BUDGET') &&
    supplyChainGraphSource.includes('activeBloomIncidentId') &&
    supplyChainGraphSource.includes('ensureSemanticBloom') &&
    supplyChainGraphSource.includes('createBloomLayoutWorker') &&
    supplyChainGraphSource.includes('new Worker') &&
    supplyChainGraphSource.includes('worker_settled') &&
    supplyChainGraphSource.includes('!BASE_DRAWABLE_TIERS.has(node.tier) && !BLOOM_TIERS.has(node.tier)'),
  'graph client should include G4 semantic zoom, worker-settled bloom layout, LOD culling, and aggregation paths'
);
assert.ok(
  !supplyChainGraphSource.includes('return this.ensureBloomLayout(this.lastBloomIncidentId)'),
  'graph client should not keep cached bloom visible after semantic zoom or incident selection ends'
);
assert.ok(
  supplyChainGraphSource.includes('if (this.selection) return null;') &&
    supplyChainGraphSource.includes("if (node.tier !== 'incident' && !BLOOM_TIERS.has(node.tier)) this.lastBloomIncidentId = null;"),
  'graph client should prevent actor/campaign/entity selections from implicitly reactivating semantic bloom'
);
assert.ok(
  supplyChainGraphSource.includes('if (visibleChildren.length === 0)') &&
    supplyChainGraphSource.includes('return { incidentId: incident.id, nodes: [], edges: [], hiddenCount: 0, bounds: boundsForNodes([incident]) };'),
  'graph client should not fabricate virtual bloom nodes for incidents without payload children'
);
assert.ok(
  supplyChainGraphSource.includes("edge.type === 'SEEDED_BY'") &&
    supplyChainGraphSource.includes("edge.propagation_tier === 'temporal'") &&
    supplyChainGraphSource.includes("edge.propagation_tier === 'causal'"),
  'graph client should render causal and temporal SEEDED_BY edges distinctly'
);
assert.ok(
  supplyChainGraphSource.includes('handleKeydown') &&
    supplyChainGraphSource.includes('keyboardNodes()') &&
    supplyChainGraphSource.includes("closest?.('a, button, input, select, textarea, summary, [contenteditable=\"true\"]')") &&
    supplyChainGraphSource.includes("event.key === 'Escape'") &&
    supplyChainGraphSource.includes('this.root.addEventListener') &&
    supplyChainGraphSource.includes('this.description.textContent') &&
    supplyChainGraphSource.includes('Keyboard graph controls are not active.'),
  'graph client should provide keyboard traversal and truthful ARIA selected-node/failure text'
);
assert.ok(
  supplyChainGraphSource.includes('this.keyboardNodeId = incidentNodes[0]?.id || null;') &&
    supplyChainGraphSource.includes('this.keyboardNodeId = nodes[0]?.id || null;'),
  'graph client should reset keyboard focus for context and stage selections'
);
assert.ok(
  supplyChainGraphSource.includes("command === 'select-entity'") &&
    supplyChainGraphSource.includes('syncPageSelection') &&
    supplyChainGraphSource.includes("document.querySelectorAll('[data-graph-target-type][data-graph-target-value]')") &&
    supplyChainGraphSource.includes("target.classList.toggle('graph-linked-active', isActive)") &&
    supplyChainGraphSource.includes("target.setAttribute('aria-current', 'true')") &&
    supplyChainGraphSource.includes('this.pageSelection = { type, value }') &&
    supplyChainRouteSource.includes('.graph-linked-active'),
  'graph client should implement G6 page-to-graph commands and reverse active-state binding'
);
assert.ok(
  supplyChainGraphSource.includes('syncExploreMode()') &&
    supplyChainGraphSource.includes("document.body.classList.toggle('sc-explore-active', active)") &&
    supplyChainGraphSource.includes('queueExploreResize()') &&
    supplyChainGraphSource.includes("window.dispatchEvent(new Event('resize'))") &&
    supplyChainGraphSource.includes('restoreExploreScroll()') &&
    supplyChainGraphSource.includes('clearExploreMode()') &&
    supplyChainGraphSource.includes("document.body.classList.remove('sc-explore-active')") &&
    supplyChainGraphSource.includes("sessionStorage.setItem('sc-explore-scroll-y'") &&
    supplyChainGraphSource.includes('exitLink.click()'),
  'graph client should toggle explore body state, resize the canvas, preserve scroll, and exit without forcing a reload'
);
assert.ok(
  supplyChainGraphSource.includes('this.onPageLoad = () =>') &&
    supplyChainGraphSource.includes('!document.body.contains(this.root)') &&
    supplyChainGraphSource.includes('this.destroy();') &&
    supplyChainGraphSource.includes("document.removeEventListener('astro:page-load', this.onPageLoad)") &&
    supplyChainGraphSource.includes("document.removeEventListener('click', this.onDocumentClick)") &&
    supplyChainGraphSource.includes('this.resizeObserver?.disconnect()') &&
    supplyChainGraphSource.includes('this.bloomWorker?.terminate()') &&
    supplyChainGraphSource.includes('cancelAnimationFrame(this.animationFrame)'),
  'graph client should clean up global listeners, observers, workers, and animation frames when the persisted island is removed'
);
assert.ok(
  supplyChainGraphSource.includes('labelPriority') &&
    supplyChainGraphSource.includes('labelCandidates') &&
    supplyChainGraphSource.includes('labelFits') &&
    supplyChainGraphSource.includes('this.labelPlacements') &&
    supplyChainGraphSource.includes('sc-graph-label-keyboard'),
  'graph client should provide greedy label de-confliction with placement hysteresis'
);
assert.ok(
  supplyChainGraphSource.includes('this.focusReflow') &&
    supplyChainGraphSource.includes('Focus reflow') &&
    supplyChainGraphSource.includes("edge.type === 'INCIDENT_TECHNIQUE'") &&
    supplyChainGraphSource.includes("this.selection?.type === 'technique'") &&
    supplyChainGraphSource.includes('frameSelectedTechniqueWideShot') &&
    supplyChainGraphSource.includes("if (edge.type === 'INCIDENT_TECHNIQUE') return;") &&
    supplyChainGraphSource.includes('z: Math.min(fit.z, 0.82)') &&
    supplyChainGraphSource.includes("contextEdge.type === 'ATTRIBUTED_TO_ACTOR' || contextEdge.type === 'RELATED_CAMPAIGN'") &&
    supplyChainGraphSource.includes("this.focusReflow && this.selection?.type === 'technique'") &&
    supplyChainGraphSource.includes("node.tier === 'campaign'") &&
    supplyChainGraphSource.includes("if (node.tier === 'technique') return this.selection?.value === node.id;"),
  'graph client should implement bounded technique focus, reflow hit testing, and campaign-preserving labels'
);

const codecov = getSupplyChainIncidentPage('SC-2021-CODECOV-BASH-UPLOADER', data);
assert.ok(codecov.graphHero, 'incident pages should expose graph hero data');
assert.equal(codecov.graphHero.nodeCount, index.graphHero.nodeCount, 'incident graph hero should use shared corpus node count');
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
assert.equal(codecov.propagationTimeline.length, 0, 'incidents without SEEDED_BY edges should not expose propagation timelines');
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
assert.equal(threeCx.propagationTimeline.length, 1, '3CX page should expose the X_TRADER causal propagation edge');
assert.equal(threeCx.propagationTimeline[0].tier, 'causal', '3CX propagation edge should preserve causal tier');
assert.ok(
  threeCx.propagationTimeline[0].references.length > 0,
  '3CX propagation edge should resolve evidence references'
);

const shaiHulud = getSupplyChainIncidentPage('SC-2025-NPM-SHAI-HULUD', data);
assert.equal(shaiHulud.propagationTimeline.length, 2, 'Shai-Hulud page should expose temporal wave propagation edges');
assert.ok(
  shaiHulud.propagationTimeline.every((edge) => edge.tier === 'temporal' && edge.references.length > 0),
  'Shai-Hulud temporal propagation edges should preserve tier and evidence references'
);

const eventStreamPackage = getSupplyChainEntityPage('packages', 'pkg-npm-event-stream', data);
assert.ok(eventStreamPackage.graphHero, 'entity pages should expose graph hero data');
assert.equal(
  eventStreamPackage.graphHero.relationshipCount,
  index.graphHero.relationshipCount,
  'entity graph hero should use shared corpus relationship count'
);
assert.ok(eventStreamPackage.relatedIncidents.length > 0, 'entity page should include related incidents');
eventStreamPackage.relatedIncidents.forEach((incident) => {
  assert.ok(routeUrls.has(incident.href), `related incident route should resolve: ${incident.href}`);
});
const xTraderPackage = getSupplyChainEntityPage('packages', 'pkg-generic-x-trader', data);
assert.ok(
  xTraderPackage.relatedIncidents.some(
    (incident) => incident.id === 'SC-2023-THREE-CX-DESKTOP' && incident.type === 'SEEDED_BY'
  ),
  'SEEDED_BY package endpoints should preserve source incident context'
);
const threeCxPackage = getSupplyChainEntityPage('packages', 'pkg-generic-3cx-desktopapp', data);
assert.equal(
  threeCxPackage.relatedIncidents.filter((incident) => incident.id === 'SC-2023-THREE-CX-DESKTOP').length,
  1,
  'related incident lists should dedupe direct and SEEDED_BY context by incident id'
);
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
