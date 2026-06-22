#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(moduleDir, '..');
const dataRoot = path.join(repoRoot, 'data');
const outputPath = path.join(repoRoot, 'site/public/supply-chain-graph.json');
const searchIndexOutputPath = path.join(repoRoot, 'site/public/supply-chain-search-index.json');
const supplyChainCandidateQueuePath = path.join(repoRoot, '.github/pipeline/supply-chain-candidates/latest.json');
const malwareFamilyStixOutputPath = path.join(repoRoot, 'site/public/supply-chain-malware-families-stix.json');
const stixUuidNamespace = '0a7b40c2-47b4-5506-81fd-3dfb15155024';

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
  malware_family: 'malware_family',
  malware_strain: 'malware_strain',
  fork_event: 'fork_event',
  maintainer: 'maintainer',
  organization: 'organization',
  package: 'package',
  release: 'release',
  repository: 'repository',
  technique: 'technique',
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

function readOptionalJson(filePath) {
  if (!existsSync(filePath)) return null;
  try {
    return readJson(filePath);
  } catch {
    return null;
  }
}

function displayLabel(value) {
  return String(value || 'unknown')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace('Ci/Cd', 'CI/CD');
}

function shortDisplayLabel(value, maxLength = 34) {
  const compact = String(value || 'unknown')
    .replace(/\bsoftware supply[- ]chain\b/gi, 'supply chain')
    .replace(/\bsupply[- ]chain\b/gi, 'SC')
    .replace(/\bself[- ]propagating\b/gi, 'propagating')
    .replace(/\bcredential[- ]stealing\b/gi, 'credential theft')
    .replace(/\bcompromise\b/gi, '')
    .replace(/\bmalicious\b/gi, '')
    .replace(/\bpackage\b/gi, 'pkg')
    .replace(/\bapplication\b/gi, 'app')
    .replace(/\brelease\b/gi, 'rel')
    .replace(/\s+/g, ' ')
    .trim();
  if (compact.length <= maxLength) return compact;
  return `${compact.slice(0, Math.max(8, maxLength - 3)).trim()}...`;
}

function slugify(value) {
  return String(value || 'unknown')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function uniqueStrings(values) {
  const seen = new Set();
  return stringsFromValue(values)
    .map((value) => value.trim())
    .filter(Boolean)
    .filter((value) => {
      const key = value.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function stringsFromValue(value, results = []) {
  if (value === null || value === undefined) return results;
  if (typeof value === 'string' || typeof value === 'number') {
    results.push(String(value));
    return results;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => stringsFromValue(item, results));
    return results;
  }
  if (typeof value === 'object') {
    Object.values(value).forEach((item) => stringsFromValue(item, results));
  }
  return results;
}

function identifiersFromValue(value) {
  const text = stringsFromValue(value).join('\n');
  return uniqueStrings([
    text.match(/\bCVE-\d{4}-\d{4,7}\b/gi) || [],
    text.match(/\bpkg:[^\s"'<>),;]+/gi) || [],
  ]);
}

function decodedPurlAliases(purl) {
  if (!purl) return [];
  const aliases = [purl];
  try {
    const decoded = decodeURIComponent(purl);
    if (decoded !== purl) aliases.push(decoded);
  } catch {
    // Keep the raw PURL if it is not URI-decodable.
  }
  return aliases;
}

function scopedPackageAliases(name) {
  if (!name || !String(name).startsWith('@')) return [];
  const unscoped = String(name).split('/').pop();
  return unscoped ? [unscoped] : [];
}

function entityBaseAliases(entity) {
  return uniqueStrings([
    entity.id,
    entity.entity_id,
    entity.name,
    entity.label,
    entity.title,
    entity.package_name,
    entity.version,
    entity.purl,
    entity.package_url,
    Array.isArray(entity.aliases) ? entity.aliases : [],
    decodedPurlAliases(entity.purl || entity.package_url),
    scopedPackageAliases(entity.name || entity.package_name),
    identifiersFromValue(entity),
  ]);
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
  const malwareFamilies = readJson(path.join(dataRoot, 'supply-chain-malware-families/families.json'));
  const entities = Object.fromEntries(
    Object.entries(entityFiles).map(([key, filename]) => [
      key,
      readJson(path.join(dataRoot, 'supply-chain-entities', filename)),
    ])
  );
  const candidateQueue = readOptionalJson(supplyChainCandidateQueuePath);
  return { incidents, relationships, entities, candidateQueue, malwareFamilies };
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

  const edge = {
    id: `${relationship.type}:${directed.source}->${directed.target}`,
    source: directed.source,
    target: directed.target,
    type: relationship.type,
    evidence_tier: relationship.evidence_tier || null,
    source_refs: Array.isArray(relationship.source_refs) ? relationship.source_refs : [],
  };
  if (Array.isArray(relationship.evidence_refs)) edge.evidence_refs = relationship.evidence_refs;
  if (relationship.propagation_tier) edge.propagation_tier = relationship.propagation_tier;
  if (relationship.source_incident_id) edge.source_incident_id = relationship.source_incident_id;
  if (relationship.summary) edge.summary = relationship.summary;
  return edge;
}

function malwareFamilyHref(familyId) {
  return `/supply-chain/malware-families/${familyId}/`;
}

function strainHref(familyId, strainId) {
  return `${malwareFamilyHref(familyId)}#${strainId}`;
}

function malwareFamilyNodes(malwareFamilies = []) {
  return malwareFamilies.flatMap((family) => {
    if (!family?.id) return [];
    const familyNode = {
      id: family.id,
      entity_id: family.id,
      type: 'malware_family',
      label: family.name || family.id,
      short_label: shortDisplayLabel(family.name || family.id),
      tier: tierByType.malware_family,
      sev: null,
      time: family.first_seen || null,
      parent: family.root_actor_id || null,
      techniques: [],
      purl: null,
      href: malwareFamilyHref(family.id),
      aliases: Array.isArray(family.aliases) ? family.aliases : [],
      source_incident_ids: Array.from(
        new Set((family.strains || []).flatMap((strain) => Array.isArray(strain.incident_ids) ? strain.incident_ids : []))
      ).sort(),
    };
    const strainNodes = (family.strains || []).map((strain) => ({
      id: strain.id,
      entity_id: strain.id,
      type: 'malware_strain',
      label: strain.name || strain.id,
      short_label: shortDisplayLabel(strain.name || strain.id),
      tier: tierByType.malware_strain,
      sev: strain.severity || null,
      time: strain.first_seen || null,
      parent: family.id,
      techniques: Array.isArray(strain.ecosystems) ? strain.ecosystems : [],
      purl: null,
      href: strainHref(family.id, strain.id),
      aliases: Array.isArray(strain.aliases) ? strain.aliases : [],
      family_id: family.id,
      lineage_confidence: strain.lineage_confidence || null,
      source_incident_ids: Array.isArray(strain.incident_ids) ? strain.incident_ids : [],
    }));
    const forkNodes = (family.fork_events || []).map((event) => ({
      id: event.id,
      entity_id: event.id,
      type: 'fork_event',
      label: event.name || event.id,
      short_label: shortDisplayLabel(event.name || event.id),
      tier: tierByType.fork_event,
      sev: null,
      time: event.date || null,
      parent: family.id,
      techniques: [],
      purl: null,
      href: `${malwareFamilyHref(family.id)}#${event.id}`,
      aliases: [],
      family_id: family.id,
      source_incident_ids: [],
    }));
    return [familyNode, ...strainNodes, ...forkNodes];
  });
}

function malwareFamilyEdges(malwareFamilies = [], nodeIds) {
  const edges = [];
  malwareFamilies.forEach((family) => {
    if (!family?.id || !nodeIds.has(family.id)) return;
    (family.associated_actor_ids || []).forEach((actorId) => {
      if (nodeIds.has(actorId)) {
        edges.push({
          id: `MALWARE_FAMILY_ACTOR:${actorId}->${family.id}`,
          source: actorId,
          target: family.id,
          type: 'ATTRIBUTED_TO_ACTOR',
          derived: true,
        });
      }
    });
    (family.strains || []).forEach((strain) => {
      if (!nodeIds.has(strain.id)) return;
      edges.push({
        id: `MALWARE_FAMILY_STRAIN:${family.id}->${strain.id}`,
        source: family.id,
        target: strain.id,
        type: 'HAS_STRAIN',
        derived: true,
      });
      (strain.incident_ids || []).forEach((incidentId) => {
        const incidentNode = `incident-${incidentId}`;
        if (nodeIds.has(incidentNode)) {
          edges.push({
            id: `STRAIN_INCIDENT:${strain.id}->${incidentNode}`,
            source: strain.id,
            target: incidentNode,
            type: 'STRAIN_INCIDENT',
            derived: true,
          });
        }
      });
    });
    (family.fork_events || []).forEach((event) => {
      if (nodeIds.has(event.id)) {
        edges.push({
          id: `MALWARE_FAMILY_FORK_EVENT:${family.id}->${event.id}`,
          source: family.id,
          target: event.id,
          type: 'FORK_EVENT',
          derived: true,
        });
      }
    });
    (family.lineage_edges || []).forEach((edge) => {
      if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) return;
      edges.push({
        id: `${edge.type}:${edge.source}->${edge.target}`,
        source: edge.source,
        target: edge.target,
        type: edge.type,
        evidence_class: edge.evidence_class || edge.confidence || null,
        confidence: edge.confidence || null,
        relation_kind: edge.relation_kind || null,
        mutation_delta: Array.isArray(edge.mutation_delta) ? edge.mutation_delta : [],
        source_refs: Array.isArray(edge.external_refs)
          ? edge.external_refs.map((ref) => ref.source_ref).filter(Boolean)
          : [],
        fork_event_id: edge.fork_event_id || null,
        summary: edge.summary || '',
      });
    });
  });
  return edges;
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
  const { incidents, relationships, entities, candidateQueue = null, malwareFamilies = [] } = corpus;
  const nodes = [];

  incidents.forEach((incident) => {
    const id = `incident-${incident.id}`;
    const time = incidentTime(incident);
    nodes.push({
      id,
      entity_id: incident.id,
      type: 'incident',
      label: incident.title,
      short_label: incident.shortLabel || incident.short_label || shortDisplayLabel(incident.title),
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

  const techniqueById = new Map();
  incidents.forEach((incident) => {
    incidentTechniques(incident).forEach((technique) => {
      const id = `technique-${slugify(technique)}`;
      if (!techniqueById.has(id)) {
        techniqueById.set(id, {
          id,
          entity_id: technique,
          type: 'technique',
          label: displayLabel(technique),
          short_label: displayLabel(technique),
          tier: 'technique',
          sev: null,
          time: null,
          parent: null,
          techniques: [technique],
          purl: null,
          href: null,
          source_incident_ids: [],
        });
      }
      techniqueById.get(id).source_incident_ids.push(incident.id);
    });
  });
  nodes.push(...Array.from(techniqueById.values()).map((node) => ({
    ...node,
    source_incident_ids: Array.from(new Set(node.source_incident_ids)).sort(),
  })));

  Object.entries(entities).forEach(([collection, collectionItems]) => {
    const type = entityTypeByCollection[collection];
    if (!type || !Array.isArray(collectionItems)) return;
    collectionItems.forEach((entity) => {
      nodes.push({
        id: entity.id,
        entity_id: entity.id,
        type,
        label: entity.name || entity.id,
        short_label: entity.shortLabel || entity.short_label || shortDisplayLabel(entity.name || entity.id),
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
  nodes.push(...malwareFamilyNodes(malwareFamilies));

  const nodeIds = new Set(nodes.map((node) => node.id));
  const corpusEdges = relationships
    .map((relationship) => normalizeRelationshipEdge(relationship, nodeIds))
    .filter(Boolean);
  const derivedEdges = deriveIncidentContextEdges(nodes, incidents, entities);
  const lineageEdges = malwareFamilyEdges(malwareFamilies, nodeIds);
  const techniqueEdges = incidents.flatMap((incident) =>
    incidentTechniques(incident).map((technique) => {
      const source = `technique-${slugify(technique)}`;
      const target = `incident-${incident.id}`;
      return {
        id: `INCIDENT_TECHNIQUE:${source}->${target}`,
        source,
        target,
        type: 'INCIDENT_TECHNIQUE',
        derived: true,
      };
    })
  );
  const edges = uniqueEdges([...corpusEdges, ...derivedEdges, ...lineageEdges, ...techniqueEdges]);

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
      candidate_queue: '.github/pipeline/supply-chain-candidates/latest.json',
    },
    discovery_currency: candidateQueue?.currency || {
      latest_corpus_incident_at: null,
      latest_discovery_signal_at: null,
      pending_candidate_count: 0,
      pending_current_count: 0,
      graph_latest_reflects: 'corpus',
    },
    renderer_contract: {
      g2_drawable_tiers: ['actor', 'campaign', 'incident'],
      g3_drawable_tiers: ['actor', 'campaign', 'incident', 'technique'],
      technique_focus: 'wide-shot-default-with-operator-reflow',
      package_release_lod: 'g4-dive-and-bloom',
      bloom_tiers: ['organization', 'package', 'release'],
      seeded_by_edges: 'causal-solid-temporal-dashed',
      evolved_from_edges: 'confirmed-solid-suspected-dashed',
      layout: 'time-anchored-actor-lanes',
    },
    counts,
    attack_stages: attackStages,
    nodes: nodes.sort((a, b) => a.id.localeCompare(b.id)),
    edges: edges.sort((a, b) => a.id.localeCompare(b.id)),
  };
}

export function buildSupplyChainSearchIndex(corpus = loadCorpus()) {
  const { incidents, relationships, entities, malwareFamilies = [] } = corpus;
  const entriesById = new Map();
  const incidentById = new Map(incidents.map((incident) => [incident.id, incident]));
  const entityById = new Map();

  Object.values(entities).forEach((collectionItems) => {
    if (!Array.isArray(collectionItems)) return;
    collectionItems.forEach((entity) => entityById.set(entity.id, entity));
  });

  const connectedAliasesByIncidentId = new Map();
  const addIncidentAlias = (incidentId, values) => {
    if (!incidentId) return;
    const current = connectedAliasesByIncidentId.get(incidentId) || [];
    current.push(...uniqueStrings(values));
    connectedAliasesByIncidentId.set(incidentId, current);
  };

  incidents.forEach((incident) => {
    const componentAliases = (incident.affected_components || []).flatMap((component) => [
      component?.name,
      component?.vendor,
      component?.package_url,
      decodedPurlAliases(component?.package_url),
      scopedPackageAliases(component?.name),
    ]);
    addIncidentAlias(incident.id, [
      incident.id,
      incident.title,
      incident.summary,
      incident.tags || [],
      incident.affected_ecosystems || [],
      incident.supply_chain_vectors || [],
      incident.impact_categories || [],
      componentAliases,
      identifiersFromValue(incident),
    ]);
  });

  Object.values(entities).forEach((collectionItems) => {
    if (!Array.isArray(collectionItems)) return;
    collectionItems.forEach((entity) => {
      (entity.source_incident_ids || []).forEach((incidentId) => {
        addIncidentAlias(incidentId, entityBaseAliases(entity));
      });
    });
  });

  relationships.forEach((relationship) => {
    const sourceIncidentId = relationship.source?.startsWith('incident-') ? relationship.source.slice('incident-'.length) : relationship.source_incident_id;
    const targetIncidentId = relationship.target?.startsWith('incident-') ? relationship.target.slice('incident-'.length) : relationship.source_incident_id;
    const sourceEntity = entityById.get(relationship.source);
    const targetEntity = entityById.get(relationship.target);
    if (sourceEntity) addIncidentAlias(targetIncidentId, entityBaseAliases(sourceEntity));
    if (targetEntity) addIncidentAlias(sourceIncidentId, entityBaseAliases(targetEntity));
  });

  const addEntry = ({ id, type, displayName, aliases, href }) => {
    if (!id || !type || !displayName) return;
    const entry = {
      id,
      type,
      displayName,
      aliases: uniqueStrings(aliases).filter((alias) => alias.toLowerCase() !== String(displayName).toLowerCase()),
    };
    if (href) entry.href = href;
    entriesById.set(id, entry);
  };

  incidents.forEach((incident) => {
    addEntry({
      id: `incident-${incident.id}`,
      type: 'incident',
      displayName: incident.title,
      aliases: [
        incident.id,
        connectedAliasesByIncidentId.get(incident.id) || [],
        identifiersFromValue(incident),
      ],
    });
  });

  Object.entries(entities).forEach(([collection, collectionItems]) => {
    const type = entityTypeByCollection[collection];
    if (!type || !Array.isArray(collectionItems)) return;
    collectionItems.forEach((entity) => {
      const sourceIncidentAliases = (entity.source_incident_ids || []).flatMap((incidentId) => {
        const incident = incidentById.get(incidentId);
        return [incident?.id, incident?.title, connectedAliasesByIncidentId.get(incidentId) || []];
      });
      addEntry({
        id: entity.id,
        type,
        displayName: entity.name || entity.id,
        aliases: [
          entityBaseAliases(entity),
          sourceIncidentAliases,
        ],
      });
    });
  });

  malwareFamilies.forEach((family) => {
    addEntry({
      id: family.id,
      type: 'malware_family',
      displayName: family.name || family.id,
      href: malwareFamilyHref(family.id),
      aliases: [
        family.id,
        family.aliases || [],
        family.summary,
        (family.strains || []).flatMap((strain) => [strain.id, strain.name, strain.aliases || []]),
      ],
    });
    (family.strains || []).forEach((strain) => {
      addEntry({
        id: strain.id,
        type: 'malware_strain',
        displayName: strain.name || strain.id,
        href: strainHref(family.id, strain.id),
        aliases: [
          strain.id,
          strain.aliases || [],
          strain.key_mutation,
          strain.mutation_summary,
          strain.ecosystems || [],
          strain.incident_ids || [],
          family.name,
          family.aliases || [],
        ],
      });
    });
  });

  return Array.from(entriesById.values()).sort((a, b) => a.type.localeCompare(b.type) || a.displayName.localeCompare(b.displayName) || a.id.localeCompare(b.id));
}

function uuidBytes(uuid) {
  return Buffer.from(uuid.replaceAll('-', ''), 'hex');
}

function formatUuid(bytes) {
  const hex = Buffer.from(bytes).toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

function stixUuid(seed) {
  const digest = createHash('sha1')
    .update(Buffer.concat([uuidBytes(stixUuidNamespace), Buffer.from(seed, 'utf8')]))
    .digest()
    .subarray(0, 16);
  digest[6] = (digest[6] & 0x0f) | 0x50;
  digest[8] = (digest[8] & 0x3f) | 0x80;
  return formatUuid(digest);
}

function stixId(type, seed) {
  return `${type}--${stixUuid(seed)}`;
}

function stixTimestamp(value) {
  if (!value) return undefined;
  const dateValue = value.length === 7 ? `${value}-01` : value;
  return `${dateValue}T00:00:00.000Z`;
}

export function buildMalwareFamilyStixBundle(corpus = loadCorpus()) {
  const objects = [];
  (corpus.malwareFamilies || []).forEach((family) => {
    const malwareIds = new Map();
    (family.strains || []).forEach((strain) => {
      const malwareId = stixId('malware', `threatpedia:${strain.id}`);
      malwareIds.set(strain.id, malwareId);
      objects.push({
        type: 'malware',
        spec_version: '2.1',
        id: malwareId,
        created: '2026-06-22T00:00:00.000Z',
        modified: '2026-06-22T00:00:00.000Z',
        name: strain.name || strain.id,
        is_family: false,
        malware_types: ['trojan'],
        aliases: strain.aliases || [],
        first_seen: stixTimestamp(strain.first_seen),
        description: strain.mutation_summary || strain.key_mutation || family.summary,
        external_references: [
          {
            source_name: 'Threatpedia',
            external_id: strain.id,
            url: `https://threatpedia.wiki/supply-chain/malware-families/${family.id}/#${strain.id}`,
          },
        ],
        'x_threatpedia_family_id': family.id,
        'x_threatpedia_lineage_confidence': strain.lineage_confidence || null,
      });
    });
    (family.lineage_edges || []).forEach((edge) => {
      const sourceRef = malwareIds.get(edge.source);
      const targetRef = malwareIds.get(edge.target);
      if (!sourceRef || !targetRef) return;
      objects.push({
        type: 'relationship',
        spec_version: '2.1',
        id: stixId('relationship', `threatpedia:${edge.source}:${edge.type}:${edge.target}`),
        created: '2026-06-22T00:00:00.000Z',
        modified: '2026-06-22T00:00:00.000Z',
        relationship_type: edge.type === 'VARIANT_OF' ? 'variant-of' : 'derived-from',
        source_ref: sourceRef,
        target_ref: targetRef,
        description: edge.summary,
        external_references: (edge.external_refs || []).map((ref) => ({
          source_name: 'Threatpedia',
          external_id: ref.source_ref,
        })),
        'x_threatpedia_relation_kind': edge.relation_kind,
        'x_threatpedia_confidence': edge.confidence,
        'x_threatpedia_mutation_delta': edge.mutation_delta || [],
      });
    });
  });
  return {
    type: 'bundle',
    id: stixId('bundle', 'threatpedia:supply-chain-malware-families'),
    objects,
  };
}

function stableStringify(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

export function writeSupplyChainGraphData(options = {}) {
  const graph = buildSupplyChainGraphData();
  const searchIndex = buildSupplyChainSearchIndex();
  const malwareFamilyStix = buildMalwareFamilyStixBundle();
  const current = existsSync(outputPath) ? readFileSync(outputPath, 'utf8') : '';
  const currentSearchIndex = existsSync(searchIndexOutputPath) ? readFileSync(searchIndexOutputPath, 'utf8') : '';
  const currentStix = existsSync(malwareFamilyStixOutputPath) ? readFileSync(malwareFamilyStixOutputPath, 'utf8') : '';
  if (current) {
    try {
      const currentGraph = JSON.parse(current);
      if (typeof currentGraph.generated_at === 'string') graph.generated_at = currentGraph.generated_at;
    } catch {
      // Fall through and overwrite malformed generated payloads.
    }
  }
  const serialized = stableStringify(graph);
  const serializedSearchIndex = stableStringify(searchIndex);
  const serializedStix = stableStringify(malwareFamilyStix);
  if (options.check) {
    if (current !== serialized) {
      throw new Error(`${path.relative(repoRoot, outputPath)} is out of date; run node scripts/build-supply-chain-graph.mjs`);
    }
    if (currentSearchIndex !== serializedSearchIndex) {
      throw new Error(`${path.relative(repoRoot, searchIndexOutputPath)} is out of date; run node scripts/build-supply-chain-graph.mjs`);
    }
    if (currentStix !== serializedStix) {
      throw new Error(`${path.relative(repoRoot, malwareFamilyStixOutputPath)} is out of date; run node scripts/build-supply-chain-graph.mjs`);
    }
    return { graph, searchIndex, malwareFamilyStix, outputPath, searchIndexOutputPath, malwareFamilyStixOutputPath, changed: false };
  }
  mkdirSync(path.dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, serialized);
  writeFileSync(searchIndexOutputPath, serializedSearchIndex);
  writeFileSync(malwareFamilyStixOutputPath, serializedStix);
  return { graph, searchIndex, malwareFamilyStix, outputPath, searchIndexOutputPath, malwareFamilyStixOutputPath, changed: true };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const check = process.argv.includes('--check');
  const { graph, searchIndex } = writeSupplyChainGraphData({ check });
  console.log(
    `Supply Chain graph ${check ? 'checked' : 'written'}: nodes=${graph.nodes.length} edges=${graph.edges.length} search=${searchIndex.length}`
  );
}
