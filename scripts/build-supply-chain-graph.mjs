#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(moduleDir, '..');
const dataRoot = path.join(repoRoot, 'data');
const outputPath = path.join(repoRoot, 'site/public/supply-chain-graph.json');

const entityFiles = {
  accounts: 'accounts.json',
  actors: 'actors.json',
  build_systems: 'build_systems.json',
  campaigns: 'campaigns.json',
  distribution_channels: 'distribution_channels.json',
  maintainers: 'maintainers.json',
  organizations: 'organizations.json',
  packages: 'packages.json',
  releases: 'releases.json',
  repositories: 'repositories.json',
};

const entityTypeByCollection = {
  accounts: 'account',
  actors: 'actor',
  build_systems: 'build_system',
  campaigns: 'campaign',
  distribution_channels: 'distribution_channel',
  maintainers: 'maintainer',
  organizations: 'organization',
  packages: 'package',
  releases: 'release',
  repositories: 'repository',
};

const tierByType = {
  account: 'account',
  actor: 'actor',
  build_system: 'supporting',
  campaign: 'campaign',
  distribution_channel: 'supporting',
  incident: 'incident',
  maintainer: 'maintainer',
  organization: 'organization',
  package: 'package',
  release: 'release',
  repository: 'repository',
};

const severityByAttackStage = {
  account_compromise: 'high',
  build_compromise: 'critical',
  ci_cd_compromise: 'critical',
  dependency_resolution: 'high',
  distribution_compromise: 'medium',
  package_publish: 'medium',
  source_compromise: 'high',
};

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function displayLabel(value) {
  return String(value || 'unknown')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace('Ci/Cd', 'CI/CD');
}

function nodeHref(type, id, entity = {}) {
  if (entity.href) return entity.href;
  if (type === 'incident') return `/supply-chain/incidents/${id.replace(/^incident-/, '')}/`;
  const routeSegments = {
    maintainer: 'maintainers',
    organization: 'organizations',
    package: 'packages',
    repository: 'repositories',
  };
  return routeSegments[type] ? `/supply-chain/${routeSegments[type]}/${id}/` : null;
}

function incidentTime(incident) {
  return incident.disclosed_at || incident.first_public_warning_at || incident.first_observed_at || null;
}

function incidentTechniques(incident) {
  return [
    ...(Array.isArray(incident.supply_chain_vectors) ? incident.supply_chain_vectors : []),
    ...(Array.isArray(incident.impact_categories) ? incident.impact_categories : []),
    ...(Array.isArray(incident.tags) ? incident.tags : []),
  ]
    .filter(Boolean)
    .map((item) => String(item));
}

function loadCorpus() {
  const incidents = readJson(path.join(dataRoot, 'supply-chain-incidents/incidents.json'));
  const relationships = readJson(path.join(dataRoot, 'supply-chain-relationships/relationships.json'));
  const entities = Object.fromEntries(
    Object.entries(entityFiles).map(([key, filename]) => [
      key,
      readJson(path.join(dataRoot, 'supply-chain-entities', filename)),
    ])
  );
  return { incidents, relationships, entities };
}

function uniqueEdges(edges) {
  const seen = new Set();
  return edges.filter((edge) => {
    const key = `${edge.source}\0${edge.target}\0${edge.type}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function normalizeRelationshipEdge(relationship, nodeIds) {
  if (!relationship?.source || !relationship?.target || !relationship?.type) return null;
  if (!nodeIds.has(relationship.source) || !nodeIds.has(relationship.target)) return null;

  const directionOverrides = {
    ATTRIBUTED_TO_ACTOR: { source: relationship.target, target: relationship.source },
    RELATED_CAMPAIGN: { source: relationship.target, target: relationship.source },
    PACKAGE_RELEASE: { source: relationship.source, target: relationship.target },
    INCIDENT_AFFECTED_RELEASE: { source: relationship.source, target: relationship.target },
    AFFECTED_PACKAGE: { source: relationship.source, target: relationship.target },
  };
  const directed = directionOverrides[relationship.type] || {
    source: relationship.source,
    target: relationship.target,
  };

  return {
    id: `${relationship.type}:${directed.source}->${directed.target}`,
    source: directed.source,
    target: directed.target,
    type: relationship.type,
    evidence_tier: relationship.evidence_tier || null,
    source_refs: Array.isArray(relationship.source_refs) ? relationship.source_refs : [],
  };
}

function deriveIncidentContextEdges(nodes, incidents, entities) {
  const edges = [];
  const actorIds = new Set((entities.actors || []).map((actor) => actor.id));
  const campaignIds = new Set((entities.campaigns || []).map((campaign) => campaign.id));
  const nodeIds = new Set(nodes.map((node) => node.id));

  incidents.forEach((incident) => {
    const incidentNodeId = `incident-${incident.id}`;
    (incident.threat_actors || []).forEach((actor) => {
      if (actor?.id && actorIds.has(actor.id) && nodeIds.has(incidentNodeId)) {
        edges.push({
          id: `INCIDENT_ACTOR_CONTEXT:${actor.id}->${incidentNodeId}`,
          source: actor.id,
          target: incidentNodeId,
          type: 'ATTRIBUTED_TO_ACTOR',
          derived: true,
        });
      }
    });
    (incident.campaigns || []).forEach((campaign) => {
      if (campaign?.id && campaignIds.has(campaign.id) && nodeIds.has(incidentNodeId)) {
        edges.push({
          id: `INCIDENT_CAMPAIGN_CONTEXT:${campaign.id}->${incidentNodeId}`,
          source: campaign.id,
          target: incidentNodeId,
          type: 'RELATED_CAMPAIGN',
          derived: true,
        });
      }
    });
  });

  return edges;
}

export function buildSupplyChainGraphData(corpus = loadCorpus()) {
  const { incidents, relationships, entities } = corpus;
  const nodes = [];

  incidents.forEach((incident) => {
    const id = `incident-${incident.id}`;
    const time = incidentTime(incident);
    nodes.push({
      id,
      entity_id: incident.id,
      type: 'incident',
      label: incident.title,
      tier: 'incident',
      sev: severityByAttackStage[incident.attack_stage] || 'medium',
      time,
      parent: null,
      techniques: incidentTechniques(incident),
      purl: null,
      href: nodeHref('incident', id),
      attack_stage: incident.attack_stage || null,
      evidence_level: incident.evidence_level || null,
      confidence: incident.confidence || null,
      summary: incident.summary || '',
    });
  });

  Object.entries(entities).forEach(([collection, collectionItems]) => {
    const type = entityTypeByCollection[collection];
    if (!type || !Array.isArray(collectionItems)) return;
    collectionItems.forEach((entity) => {
      nodes.push({
        id: entity.id,
        entity_id: entity.id,
        type,
        label: entity.name || entity.id,
        tier: tierByType[type] || type,
        sev: null,
        time: entity.published_at || null,
        parent: null,
        techniques: [],
        purl: entity.purl || entity.package_url || null,
        href: nodeHref(type, entity.id, entity),
        ecosystem: entity.ecosystem || null,
        aliases: Array.isArray(entity.aliases) ? entity.aliases : [],
        source_incident_ids: Array.isArray(entity.source_incident_ids) ? entity.source_incident_ids : [],
      });
    });
  });

  const nodeIds = new Set(nodes.map((node) => node.id));
  const corpusEdges = relationships
    .map((relationship) => normalizeRelationshipEdge(relationship, nodeIds))
    .filter(Boolean);
  const derivedEdges = deriveIncidentContextEdges(nodes, incidents, entities);
  const edges = uniqueEdges([...corpusEdges, ...derivedEdges]);

  const parentByIncident = new Map();
  edges.forEach((edge) => {
    if (edge.type === 'RELATED_CAMPAIGN' && edge.target.startsWith('incident-')) {
      parentByIncident.set(edge.target, edge.source);
    }
  });
  edges.forEach((edge) => {
    if (edge.type === 'ATTRIBUTED_TO_ACTOR' && edge.target.startsWith('incident-') && !parentByIncident.has(edge.target)) {
      parentByIncident.set(edge.target, edge.source);
    }
  });
  nodes.forEach((node) => {
    if (node.type === 'incident') node.parent = parentByIncident.get(node.id) || null;
  });

  const counts = nodes.reduce((acc, node) => {
    acc[node.type] = (acc[node.type] || 0) + 1;
    return acc;
  }, {});
  const attackStages = Array.from(
    new Set(incidents.map((incident) => incident.attack_stage).filter(Boolean))
  )
    .sort()
    .map((stage) => ({ id: stage, label: displayLabel(stage) }));

  return {
    schema_version: 'threatpedia-supply-chain-graph/1',
    generated_at: new Date().toISOString(),
    source: {
      incidents: 'data/supply-chain-incidents/incidents.json',
      relationships: 'data/supply-chain-relationships/relationships.json',
      entities: 'data/supply-chain-entities/*.json',
    },
    renderer_contract: {
      g2_drawable_tiers: ['actor', 'campaign', 'incident'],
      package_release_lod: 'payload-only-until-G4',
      layout: 'time-anchored-actor-lanes',
    },
    counts,
    attack_stages: attackStages,
    nodes: nodes.sort((a, b) => a.id.localeCompare(b.id)),
    edges: edges.sort((a, b) => a.id.localeCompare(b.id)),
  };
}

function stableStringify(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

export function writeSupplyChainGraphData(options = {}) {
  const graph = buildSupplyChainGraphData();
  const current = existsSync(outputPath) ? readFileSync(outputPath, 'utf8') : '';
  if (current) {
    try {
      const currentGraph = JSON.parse(current);
      if (typeof currentGraph.generated_at === 'string') graph.generated_at = currentGraph.generated_at;
    } catch {
      // Fall through and overwrite malformed generated payloads.
    }
  }
  const serialized = stableStringify(graph);
  if (options.check) {
    if (current !== serialized) {
      throw new Error(`${path.relative(repoRoot, outputPath)} is out of date; run node scripts/build-supply-chain-graph.mjs`);
    }
    return { graph, outputPath, changed: false };
  }
  mkdirSync(path.dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, serialized);
  return { graph, outputPath, changed: true };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const check = process.argv.includes('--check');
  const { graph } = writeSupplyChainGraphData({ check });
  console.log(
    `Supply Chain graph ${check ? 'checked' : 'written'}: nodes=${graph.nodes.length} edges=${graph.edges.length}`
  );
}
