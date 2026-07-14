import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSupplyChainGraphData } from '../../../scripts/build-supply-chain-graph.mjs';

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const incidentRelativePath = 'data/supply-chain-incidents/incidents.json';

function findRepoRoot(startDirs) {
  const seen = new Set();

  for (const startDir of startDirs) {
    let currentDir = path.resolve(startDir);

    while (!seen.has(currentDir)) {
      seen.add(currentDir);

      if (existsSync(path.join(currentDir, incidentRelativePath))) {
        return currentDir;
      }

      const parentDir = path.dirname(currentDir);
      if (parentDir === currentDir) {
        break;
      }
      currentDir = parentDir;
    }
  }

  throw new Error(`Unable to locate Supply Chain corpus from ${startDirs.join(', ')}`);
}

const repoRoot = findRepoRoot([moduleDir, process.cwd()]);
const incidentPath = path.join(repoRoot, 'data/supply-chain-incidents/incidents.json');
const relationshipPath = path.join(repoRoot, 'data/supply-chain-relationships/relationships.json');
const entityDir = path.join(repoRoot, 'data/supply-chain-entities');
const candidateQueuePath = path.join(repoRoot, '.github/pipeline/supply-chain-candidates/latest.json');
const malwareFamilyPath = path.join(repoRoot, 'data/supply-chain-malware-families/families.json');
let cachedData = null;

export const SUPPLY_CHAIN_ENTITY_TYPES = [
  { key: 'packages', segment: 'packages', label: 'Package', plural: 'Packages' },
  { key: 'repositories', segment: 'repositories', label: 'Repository', plural: 'Repositories' },
  { key: 'organizations', segment: 'organizations', label: 'Organization', plural: 'Organizations' },
  { key: 'maintainers', segment: 'maintainers', label: 'Maintainer', plural: 'Maintainers' },
];

export const SUPPLY_CHAIN_FEATURED_INCIDENT_IDS = [
  'SC-2024-XZ-UTILS',
  'SC-2023-THREE-CX-DESKTOP',
  'SC-2020-SOLARWINDS-ORION',
  'SC-2018-NPM-EVENT-STREAM',
  'SC-2021-UA-PARSER-JS',
];

export const SUPPLY_CHAIN_INDEX_COPY = {
  lede:
    'Threatpedia tracks software supply chain incidents as connected facts about packages, repositories, organizations, maintainers, build systems, distribution channels, and compromised accounts.',
  sections: [
    {
      title: 'What Threatpedia Tracks',
      body:
        'This section models confirmed supply chain incidents and the entities named by the corpus. The goal is structured recall: which packages, repositories, maintainers, and organizations appear together in public evidence.',
    },
    {
      title: 'Why Supply Chain Incidents Matter',
      body:
        'A supply chain compromise can turn trusted update channels, build systems, or package registries into distribution paths. Tracking those links helps defenders compare incidents without inventing risk scores.',
    },
    {
      title: 'How Entities Connect',
      body:
        'Entities are connected through explicit relationship records derived from the curated incident corpus. A package, repository, organization, or maintainer page shows the incidents that support that connection.',
    },
    {
      title: 'Evidence and Confidence Model',
      body:
        'Each incident carries confidence and evidence-level fields from the corpus. Pages show those fields directly and avoid conclusions beyond the recorded evidence.',
    },
  ],
};

const indexDescription =
  'Threatpedia Supply Chain tracks curated software supply chain incidents and the packages, repositories, organizations, maintainers, build systems, and distribution channels connected to them.';

const allEntityFiles = {
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

const routeEntityBySegment = Object.fromEntries(SUPPLY_CHAIN_ENTITY_TYPES.map((item) => [item.segment, item]));

const entitySummaryDefinitions = [
  {
    key: 'packages',
    title: 'Packages',
    description: 'Named software packages affected by or involved in supply chain incidents.',
    href: null,
  },
  {
    key: 'repositories',
    title: 'Repositories',
    description: 'Source repositories, release repositories, and project repositories cited by incident evidence.',
    href: null,
  },
  {
    key: 'organizations',
    title: 'Organizations',
    description: 'Vendors, projects, companies, registries, and public organizations connected to incidents.',
    href: null,
  },
  {
    key: 'maintainers',
    title: 'Maintainers',
    description: 'Individual maintainers or maintainer identities named by the structured corpus.',
    href: null,
  },
  {
    key: 'build_systems',
    title: 'Build Systems',
    description: 'Build, CI, release, or signing systems recorded as part of the incident chain.',
    href: null,
  },
  {
    key: 'distribution_channels',
    title: 'Distribution Channels',
    description: 'Registries, update systems, downloads, and other channels used to distribute affected artifacts.',
    href: null,
  },
  {
    key: 'accounts',
    title: 'Compromised Accounts',
    description: 'Accounts or identities recorded as compromised in the incident corpus.',
    href: null,
  },
];

const ENTITY_COLLECTION_LABELS = {
  packages: 'Package',
  repositories: 'Repository',
  organizations: 'Organization',
  maintainers: 'Maintainer',
  releases: 'Release',
  build_systems: 'Build System',
  distribution_channels: 'Distribution Channel',
  accounts: 'Compromised Account',
  actors: 'Threat Actor',
  campaigns: 'Campaign',
};

const editorialSectionDefinitions = [
  { key: 'executive_summary', title: 'Executive Summary', type: 'claim' },
  { key: 'timeline', title: 'Timeline', type: 'timeline' },
  { key: 'attack_chain', title: 'Attack Chain', type: 'attack_chain' },
  { key: 'affected_ecosystem', title: 'Affected Ecosystem', type: 'claim' },
  { key: 'defensive_lessons', title: 'Defensive Lessons', type: 'claim' },
  { key: 'detection_notes', title: 'Detection Notes', type: 'claim' },
  { key: 'open_questions', title: 'Open Questions', type: 'claim' },
];

function entityTypeLabel(entity) {
  return ENTITY_COLLECTION_LABELS[entity.entityCollection] || entity.entityCollection;
}

export function isSupplyChainPagesEnabled(env = (typeof process !== 'undefined' ? process.env : null) || {}) {
  return String(env.ENABLE_SUPPLY_CHAIN_PAGES || '').toLowerCase() === 'true';
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf-8'));
}

function readOptionalJson(filePath) {
  if (!existsSync(filePath)) return null;
  try {
    return readJson(filePath);
  } catch {
    return null;
  }
}

export function loadSupplyChainData() {
  if (cachedData) return cachedData;
  const incidents = readJson(incidentPath);
  const relationships = readJson(relationshipPath);
  const malwareFamilies = readJson(malwareFamilyPath);
  const entities = Object.fromEntries(
    Object.entries(allEntityFiles).map(([key, filename]) => [key, readJson(path.join(entityDir, filename))])
  );
  const candidateQueue = readOptionalJson(candidateQueuePath);
  const entityById = new Map();
  Object.entries(entities).forEach(([type, items]) => {
    items.forEach((entity) => {
      entityById.set(entity.id, { ...entity, entityCollection: type });
    });
  });
  const incidentByNodeId = new Map(incidents.map((incident) => [`incident-${incident.id}`, incident]));
  cachedData = { incidents, relationships, malwareFamilies, entities, entityById, incidentByNodeId, candidateQueue };
  return cachedData;
}

export function validateSupplyChainPageData(data = loadSupplyChainData()) {
  const errors = [];
  const validIncidentNodes = new Set(data.incidents.map((incident) => `incident-${incident.id}`));
  data.relationships.forEach((relationship, index) => {
    const sourceExists = validIncidentNodes.has(relationship.source) || data.entityById.has(relationship.source);
    const targetExists = validIncidentNodes.has(relationship.target) || data.entityById.has(relationship.target);
    if (!sourceExists) errors.push(`relationships[${index}].source unknown: ${relationship.source}`);
    if (!targetExists) errors.push(`relationships[${index}].target unknown: ${relationship.target}`);
  });
  (data.malwareFamilies || []).forEach((family, index) => {
    if (!family?.id || !family.id.startsWith('family-')) errors.push(`malwareFamilies[${index}].id invalid: ${family?.id}`);
  });
  return errors;
}

function relationshipRows(data, nodeId) {
  return data.relationships
    .filter((relationship) => relationship.source === nodeId || relationship.target === nodeId)
    .map((relationship) => {
      const oppositeId = relationship.source === nodeId ? relationship.target : relationship.source;
      const incident = data.incidentByNodeId.get(oppositeId);
      const entity = data.entityById.get(oppositeId);
      return {
        ...relationship,
        oppositeId,
        incident,
        entity,
      };
    });
}

function linkForEntity(entity) {
  if (entity.href) return entity.href;
  const type = SUPPLY_CHAIN_ENTITY_TYPES.find((item) => item.key === entity.entityCollection);
  return type ? `/supply-chain/${type.segment}/${entity.id}/` : null;
}

function entityLink(data, entityId) {
  const entity = data.entityById.get(entityId);
  if (!entity) return null;
  const href = linkForEntity(entity);
  return { href, label: entity.name, id: entity.id };
}

function attributionItemLink(data, item, collectionKey) {
  if (!item?.id) return null;
  const linkedEntity = entityLink(data, item.id);
  if (linkedEntity) return linkedEntity;
  const href = item.href || (collectionKey === 'campaigns' && item.slug ? `/campaigns/${item.slug}/` : null);
  return { href, label: item.name || item.id, id: item.id };
}

function compareLabel(a, b) {
  return (a.label || '').localeCompare(b.label || '');
}

function compareTitle(a, b) {
  return (a.title || '').localeCompare(b.title || '');
}

function compareDateDesc(a, b) {
  return (b.sortDate || '').localeCompare(a.sortDate || '') || compareTitle(a, b);
}

function normalizeEntitySlug(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function daysBetween(startDate, endDate) {
  if (!startDate || !endDate) return null;
  const normalize = (value) => {
    if (value instanceof Date) return value.toISOString().split('T')[0];
    return String(value).split('T')[0];
  };
  const start = Date.parse(`${normalize(startDate)}T00:00:00Z`);
  const end = Date.parse(`${normalize(endDate)}T00:00:00Z`);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) return null;
  return Math.round((end - start) / 86400000);
}

function displayLabel(value) {
  if (value === 'ci_cd_compromise') return 'CI/CD Compromise';
  return String(value || 'unknown')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function severityForAttackStage(stage) {
  const stageSeverity = {
    build_compromise: 'critical',
    ci_cd_compromise: 'critical',
    source_compromise: 'high',
    account_compromise: 'high',
    dependency_resolution: 'high',
    package_publish: 'medium',
    distribution_compromise: 'medium',
  };
  return stageSeverity[stage] || 'medium';
}

function incidentSortDate(incident) {
  return incident.disclosed_at || incident.first_public_warning_at || incident.first_observed_at || '';
}

function incidentLinkRow(incident) {
  return {
    id: incident.id,
    title: incident.title,
    href: `/supply-chain/incidents/${incident.id}/`,
    attackStage: incident.attack_stage,
    evidenceLevel: incident.evidence_level,
    confidence: incident.confidence,
    sortDate: incidentSortDate(incident),
  };
}

function incidentLinksFor(data, entityId) {
  const direct = relationshipRows(data, entityId)
    .filter((row) => row.incident)
    .map((row) => ({
      href: `/supply-chain/incidents/${row.incident.id}/`,
      label: row.incident.title,
      id: row.incident.id,
      type: row.type,
    }));
  const seededByContext = data.relationships
    .filter((relationship) => relationship.type === 'SEEDED_BY')
    .filter((relationship) => relationship.source === entityId || relationship.target === entityId)
    .map((relationship) => data.incidentByNodeId.get(`incident-${relationship.source_incident_id}`))
    .filter(Boolean)
    .map((incident) => ({
      href: `/supply-chain/incidents/${incident.id}/`,
      label: incident.title,
      id: incident.id,
      type: 'SEEDED_BY',
    }));
  const seen = new Set();
  return [...direct, ...seededByContext]
    .filter((row) => {
      const key = row.id;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort(compareLabel);
}

function dedupeRows(rows) {
  if (!Array.isArray(rows)) return [];
  const seen = new Set();
  return rows.filter((row) => {
    const key = `${row.href || row.id}:${row.context || ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function entityConnectionsFor(data, entityId) {
  const direct = relationshipRows(data, entityId)
    .filter((row) => row.entity && row.oppositeId !== entityId)
    .map((row) => ({
      href: linkForEntity(row.entity),
      label: row.entity.name,
      id: row.entity.id,
      type: row.type,
      entityType: entityTypeLabel(row.entity),
    }));
  const directEntityIds = new Set(direct.map((row) => row.id));

  const incidentNodes = relationshipRows(data, entityId)
    .filter((row) => row.incident)
    .map((row) => `incident-${row.incident.id}`);
  const throughIncidents = incidentNodes.flatMap((incidentNode) =>
    relationshipRows(data, incidentNode)
      .filter((row) => row.entity && row.entity.id !== entityId && !directEntityIds.has(row.entity.id))
      .map((row) => ({
        href: linkForEntity(row.entity),
        label: row.entity.name,
        id: row.entity.id,
        type: row.type,
        entityType: entityTypeLabel(row.entity),
        context: data.incidentByNodeId.get(incidentNode)?.title,
      }))
  );

  return dedupeRows([...direct, ...throughIncidents]).sort(compareLabel);
}

function incidentConnectedEntities(data, incidentId) {
  const nodeId = `incident-${incidentId}`;
  const incident = data.incidents.find((item) => item.id === incidentId);
  const rows = relationshipRows(data, nodeId)
    .filter((row) => row.entity)
    .map((row) => ({
      href: linkForEntity(row.entity),
      label: row.entity.name,
      id: row.entity.id,
      type: row.type,
      entityType: entityTypeLabel(row.entity),
    }));
  const actorRows = (incident?.threat_actors || [])
    .map((item) => attributionItemLink(data, item, 'actors'))
    .filter(Boolean)
    .map((item) => ({ ...item, type: 'ATTRIBUTED_TO_ACTOR', entityType: 'Threat Actor' }));
  const campaignRows = (incident?.campaigns || [])
    .map((item) => attributionItemLink(data, item, 'campaigns'))
    .filter(Boolean)
    .map((item) => ({ ...item, type: 'RELATED_CAMPAIGN', entityType: 'Campaign' }));
  const attributionRows = [...actorRows, ...campaignRows];
  return dedupeRows([...rows, ...attributionRows]).sort(compareLabel);
}

function incidentEntityLinks(data, incidentId, relationshipType) {
  const nodeId = `incident-${incidentId}`;
  return data.relationships
    .filter((relationship) => relationship.source === nodeId && relationship.type === relationshipType)
    .map((relationship) => entityLink(data, relationship.target))
    .filter(Boolean)
    .sort(compareLabel);
}

function incidentReleaseLinks(data, incidentId) {
  const nodeId = `incident-${incidentId}`;
  return data.relationships
    .filter((relationship) => relationship.source === nodeId && relationship.type === 'INCIDENT_AFFECTED_RELEASE')
    .map((relationship) => {
      const release = data.entityById.get(relationship.target);
      if (!release) return null;
      return {
        href: null,
        label: release.name,
        id: release.id,
        type: relationship.type,
        entityType: entityTypeLabel(release),
        context: [release.purl, release.published_at ? `published ${release.published_at}` : null]
          .filter(Boolean)
          .join(' · '),
      };
    })
    .filter(Boolean)
    .sort(compareLabel);
}

function incidentReleaseEntities(data, incidentId) {
  const nodeId = `incident-${incidentId}`;
  return data.relationships
    .filter((relationship) => relationship.source === nodeId && relationship.type === 'INCIDENT_AFFECTED_RELEASE')
    .map((relationship) => data.entityById.get(relationship.target))
    .filter(Boolean)
    .sort((a, b) => (a.published_at || '').localeCompare(b.published_at || '') || (a.name || '').localeCompare(b.name || ''));
}

function maintainerTenureAtMaliciousRelease(data, incidentId) {
  const incident = data.incidents.find((item) => item.id === incidentId);
  if (!incident) return [];
  const releases = incidentReleaseEntities(data, incidentId);
  if (releases.length === 0) return [];
  return (incident.maintainers || []).flatMap((maintainer) => {
    const anchorDate = maintainer.onboarding_date || maintainer.first_publish_date;
    if (!anchorDate) return [];
    const anchorLabel = maintainer.onboarding_date ? 'onboarding' : 'first publish';
    const maintainerId = `maintainer-${normalizeEntitySlug(maintainer.id_slug)}`;
    const maintainerLink = entityLink(data, maintainerId) || { href: null, label: maintainer.name, id: maintainerId };
    return releases
      .map((release) => {
        const days = daysBetween(anchorDate, release.published_at);
        if (days === null) return null;
        return {
          maintainer: maintainerLink,
          anchorDate,
          anchorLabel,
          release: {
            label: release.name,
            id: release.id,
            purl: release.purl,
            publishedAt: release.published_at,
          },
          days,
        };
      })
      .filter(Boolean);
  });
}

function incidentAttributionLinks(data, incidentId, relationshipType, collectionKey) {
  const relationshipLinks = incidentEntityLinks(data, incidentId, relationshipType);
  const incident = data.incidents.find((item) => item.id === incidentId);
  const corpusLinks = (incident?.[collectionKey] || [])
    .map((item) => attributionItemLink(data, item, collectionKey))
    .filter(Boolean);
  return dedupeRows([...relationshipLinks, ...corpusLinks]).sort(compareLabel);
}

function incidentEntities(data, incidentId, collectionKey, relationshipType) {
  const links = incidentEntityLinks(data, incidentId, relationshipType);
  if (links.length > 0) return links;
  const incident = data.incidents.find((item) => item.id === incidentId);
  return (incident?.[collectionKey] || []).map((item) => ({ label: item.name, id: item.name, href: null }));
}

function referenceMapFor(incident) {
  return new Map((incident.references || []).filter((reference) => reference.id).map((reference) => [reference.id, reference]));
}

function referencesForItem(item, referenceById) {
  return (item.reference_ids || []).map((referenceId) => referenceById.get(referenceId)).filter(Boolean);
}

function attributionEvidenceFor(incident) {
  const referenceById = referenceMapFor(incident);
  return (incident.attribution_evidence || []).map((item) => ({
    ...item,
    references: (item.source_refs || []).map((referenceId) => referenceById.get(referenceId)).filter(Boolean),
  }));
}

function propagationNode(data, nodeId) {
  const incident = data.incidentByNodeId.get(nodeId);
  if (incident) {
    return {
      id: incident.id,
      label: incident.title,
      entityType: 'Supply Chain Incident',
      href: `/supply-chain/incidents/${incident.id}/`,
      publishedAt: incident.first_observed_at || incident.first_public_warning_at || incident.disclosed_at || null,
      purl: null,
    };
  }
  const entity = data.entityById.get(nodeId);
  if (!entity) {
    return {
      id: nodeId,
      label: nodeId,
      entityType: 'Unknown',
      href: null,
      publishedAt: null,
      purl: null,
    };
  }
  return {
    id: entity.id,
    label: entity.name || entity.id,
    entityType: entityTypeLabel(entity),
    href: linkForEntity(entity),
    publishedAt: entity.published_at || null,
    purl: entity.purl || null,
  };
}

function incidentPropagationTimeline(data, incidentId) {
  const incident = data.incidents.find((item) => item.id === incidentId);
  if (!incident) return [];
  const referenceById = referenceMapFor(incident);
  return data.relationships
    .filter((relationship) => relationship.type === 'SEEDED_BY' && relationship.source_incident_id === incidentId)
    .map((relationship, index) => {
      const source = propagationNode(data, relationship.source);
      const target = propagationNode(data, relationship.target);
      const sortDate = source.publishedAt || target.publishedAt || incidentSortDate(incident);
      return {
        id: `propagation-${incidentId}-${index + 1}`,
        source,
        target,
        tier: relationship.propagation_tier,
        summary: relationship.summary,
        sortDate,
        references: (relationship.evidence_refs || []).map((referenceId) => referenceById.get(referenceId)).filter(Boolean),
      };
    })
    .sort((a, b) => (a.sortDate || '').localeCompare(b.sortDate || '') || a.source.label.localeCompare(b.source.label));
}

function editorialSectionsFor(incident) {
  const referenceById = referenceMapFor(incident);
  return editorialSectionDefinitions
    .map((section) => {
      const items = incident[section.key];
      if (!Array.isArray(items) || items.length === 0) return null;
      return {
        key: section.key,
        title: section.title,
        type: section.type,
        items: items.map((item) => ({
          ...item,
          references: referencesForItem(item, referenceById),
        })),
      };
    })
    .filter(Boolean);
}

const graphHeroModelCache = new WeakMap();

function buildEmptyGraphHeroModel() {
  return {
    title: 'Supply Chain',
    eyebrow: 'Corpus Graph',
    summary:
      'A graph-first view of curated supply chain incidents and the packages, repositories, organizations, maintainers, actors, campaigns, releases, and accounts connected by evidence.',
    status: 'WebGL graph loading',
    nodeCount: 0,
    relationshipCount: 0,
    latestIncident: null,
    pendingCandidateCount: 0,
    latestDiscoverySignalAt: null,
  };
}

function buildGraphHeroModel(data) {
  if (!data || typeof data !== 'object' || !Array.isArray(data.incidents)) {
    return buildEmptyGraphHeroModel();
  }
  if (graphHeroModelCache.has(data)) {
    return graphHeroModelCache.get(data);
  }

  const incidents = data.incidents.filter(Boolean);
  const entities = data?.entities && typeof data.entities === 'object' ? data.entities : {};
  const relationships = Array.isArray(data?.relationships) ? data.relationships : [];
  const graphCorpus = {
    incidents: incidents.filter((incident) => incident && typeof incident === 'object' && typeof incident.id === 'string'),
    relationships: relationships.filter((relationship) => relationship && typeof relationship === 'object'),
    malwareFamilies: Array.isArray(data.malwareFamilies)
      ? data.malwareFamilies.filter((family) => family && typeof family === 'object' && typeof family.id === 'string')
      : [],
    entities: Object.fromEntries(
      Object.entries(entities).map(([key, collection]) => [
        key,
        Array.isArray(collection)
          ? collection.filter((entity) => entity && typeof entity === 'object' && typeof entity.id === 'string')
          : [],
      ])
    ),
  };
  const graphData = buildSupplyChainGraphData(graphCorpus);
  const nodeCount = Array.isArray(graphData.nodes) ? graphData.nodes.length : 0;
  const edgeCount = Array.isArray(graphData.edges) ? graphData.edges.length : relationships.length;
  const latestIncident =
    incidents.length > 0
      ? incidents.map((incident) => incidentLinkRow(incident)).sort(compareDateDesc)[0] || null
      : null;
  const graphHeroModel = {
    title: 'Supply Chain',
    eyebrow: 'Corpus Graph',
    summary:
      'A graph-first view of curated supply chain incidents and the packages, repositories, organizations, maintainers, actors, campaigns, releases, and accounts connected by evidence.',
    status: 'WebGL graph loading',
    nodeCount,
    relationshipCount: edgeCount,
    latestIncident,
    pendingCandidateCount: data.candidateQueue?.currency?.pending_candidate_count || 0,
    latestDiscoverySignalAt: data.candidateQueue?.currency?.latest_discovery_signal_at || null,
  };
  graphHeroModelCache.set(data, graphHeroModel);
  return graphHeroModel;
}

function buildAttackVectorBars(data) {
  if (!Array.isArray(data?.incidents)) return [];
  const byStage = new Map();
  data.incidents.filter(Boolean).forEach((incident) => {
    const stage = incident.attack_stage || 'unknown';
    const existing = byStage.get(stage) || {
      stage,
      label: displayLabel(stage),
      count: 0,
      incidents: [],
      severity: severityForAttackStage(stage),
    };
    existing.count += 1;
    existing.incidents.push(incidentLinkRow(incident));
    byStage.set(stage, existing);
  });
  const maxCount = Math.max(...Array.from(byStage.values()).map((row) => row.count), 1);
  return Array.from(byStage.values())
    .map((row) => ({
      ...row,
      incidents: row.incidents.sort(compareDateDesc),
      percent: Math.max(8, Math.round((row.count / maxCount) * 100)),
      command: { type: 'filter-stage', value: row.stage },
    }))
    .sort((a, b) => b.count - a.count || compareLabel(a, b));
}

function buildAttributionRows(data) {
  if (
    !data ||
    !Array.isArray(data.relationships) ||
    !Array.isArray(data.incidents) ||
    !data.entities ||
    !Array.isArray(data.entities.actors) ||
    !Array.isArray(data.entities.campaigns)
  ) {
    return [];
  }

  const incidents = data.incidents.filter(Boolean);
  const incidentById = new Map(incidents.map((incident) => [incident.id, incident]));
  const attributedRelationshipsByActor = new Map();
  data.relationships.filter(Boolean).forEach((relationship) => {
    if (relationship.type !== 'ATTRIBUTED_TO_ACTOR') return;
    const actorRelationships = attributedRelationshipsByActor.get(relationship.target) || [];
    actorRelationships.push(relationship);
    attributedRelationshipsByActor.set(relationship.target, actorRelationships);
  });
  const campaignsByIncidentId = new Map();
  data.entities.campaigns.filter(Boolean).forEach((campaign) => {
    const campaignIncidentIds = Array.isArray(campaign.source_incident_ids) ? campaign.source_incident_ids : [];
    campaignIncidentIds.forEach((incidentId) => {
      const campaigns = campaignsByIncidentId.get(incidentId) || [];
      campaigns.push(campaign);
      campaignsByIncidentId.set(incidentId, campaigns);
    });
  });

  return data.entities.actors
    .filter(Boolean)
    .map((actor) => {
      const incidentIds = new Set(Array.isArray(actor.source_incident_ids) ? actor.source_incident_ids : []);
      (attributedRelationshipsByActor.get(actor.id) || []).forEach((relationship) => {
        const incident =
          data.incidentByNodeId?.get(relationship.source) ||
          (typeof relationship.source === 'string' && relationship.source.startsWith('incident-')
            ? incidentById.get(relationship.source.slice('incident-'.length))
            : null);
        if (incident) incidentIds.add(incident.id);
      });
      const actorIncidents = Array.from(incidentIds)
        .map((id) => incidentById.get(id))
        .filter(Boolean)
        .map((incident) => incidentLinkRow(incident))
        .sort(compareDateDesc);
      const campaignSet = new Set();
      actorIncidents.forEach((incident) => {
        (campaignsByIncidentId.get(incident.id) || []).forEach((campaign) => {
          campaignSet.add(campaign);
        });
      });
      const campaigns = Array.from(campaignSet)
        .map((campaign) => ({
          id: campaign.id,
          label: campaign.name || campaign.id,
          href: campaign.href || (campaign.slug ? `/campaigns/${campaign.slug}/` : null),
        }))
        .sort(compareLabel);
      return {
        id: actor.id,
        label: actor.name || actor.id,
        href: actor.href || null,
        confidence: actor.attribution_confidence || 'unknown',
        actorType: actor.actor_type || 'unknown',
        incidentCount: actorIncidents.length,
        incidents: actorIncidents,
        campaigns,
        command: { type: 'select-actor', value: actor.id },
      };
    })
    .filter((row) => row.incidentCount > 0)
    .sort((a, b) => b.incidentCount - a.incidentCount || compareLabel(a, b));
}

function buildDwellTimeline(data) {
  if (!Array.isArray(data?.incidents)) return [];
  const rows = data.incidents
    .filter(Boolean)
    .map((incident) => {
      const startDate = incident.first_observed_at || incident.first_public_warning_at || incident.disclosed_at;
      const warningDate = incident.first_public_warning_at || incident.disclosed_at;
      const disclosedDate = incident.disclosed_at;
      const dwellDays = daysBetween(startDate, disclosedDate);
      if (!startDate || !disclosedDate || dwellDays === null) return null;
      const warningDays = daysBetween(startDate, warningDate);
      return {
        ...incidentLinkRow(incident),
        startDate,
        warningDate,
        disclosedDate,
        dwellDays,
        warningDays: warningDays ?? dwellDays,
        severity: severityForAttackStage(incident.attack_stage),
        command: { type: 'select-incident', value: incident.id },
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.dwellDays - a.dwellDays || compareDateDesc(a, b))
    .slice(0, 12);
  const maxDays = Math.max(...rows.map((row) => row.dwellDays), 1);
  return rows.map((row) => {
    const rawDwellPercent = Math.min(100, Math.max(0, Math.round((row.dwellDays / maxDays) * 100)));
    const rawWarningPercent = Math.min(100, Math.max(0, Math.round((row.warningDays / maxDays) * 100)));
    const barPercent = Math.max(6, rawDwellPercent);
    const warningPercent = row.warningDays === row.dwellDays ? barPercent : Math.min(barPercent, rawWarningPercent);
    return {
      ...row,
      barPercent,
      warningPercent,
      disclosedPercent: barPercent,
    };
  });
}

function sourceByIdForFamily(family) {
  return new Map((family.sources || []).map((source) => [source.id, source]));
}

function familyIncidentLinks(data, incidentIds = []) {
  return incidentIds
    .map((id) => data.incidents.find((incident) => incident.id === id))
    .filter(Boolean)
    .map((incident) => ({
      href: `/supply-chain/incidents/${incident.id}/`,
      label: incident.title,
      id: incident.id,
      type: 'STRAIN_INCIDENT',
      entityType: 'Supply Chain Incident',
      context: incidentSortDate(incident),
    }))
    .sort(compareDateDesc);
}

function lineageEdgePath(edge, nodeById, forkById) {
  const source = nodeById.get(edge.source);
  const target = nodeById.get(edge.target);
  if (!source || !target) return null;
  const from = target;
  const to = source;
  const fork = edge.fork_event_id ? forkById.get(edge.fork_event_id) : null;
  const startOffset = from.kind === 'fork' ? 14 : 70;
  const endOffset = to.kind === 'fork' ? 14 : 70;
  const x1 = Number(from.layout?.x ?? 0) + startOffset;
  const y1 = Number(from.layout?.y ?? 0);
  const x2 = Number(to.layout?.x ?? 0) - endOffset;
  const y2 = Number(to.layout?.y ?? 0);
  const mx = fork ? Number(fork.layout?.x ?? (x1 + x2) / 2) : (x1 + x2) / 2;
  const labelY = fork ? Number(fork.layout?.y ?? 0) + 56 : (y1 + y2) / 2 - (Math.abs(y2 - y1) > 40 ? 0 : 14);
  return {
    ...edge,
    id: `${edge.source}->${edge.target}`,
    displaySource: target,
    displayTarget: source,
    path: `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`,
    labelX: mx,
    labelY,
    label: (edge.mutation_delta || []).join(' · '),
    references: (edge.external_refs || []).map((ref) => ref.source).filter(Boolean),
  };
}

function buildFamilyPhylogenyModel(data, family) {
  const sourceById = sourceByIdForFamily(family);
  const strains = (family.strains || []).map((strain) => ({
    ...strain,
    kind: 'strain',
    incidents: familyIncidentLinks(data, strain.incident_ids || []),
  }));
  const forks = (family.fork_events || []).map((event) => ({
    ...event,
    kind: 'fork',
    references: (event.source_refs || []).map((sourceId) => sourceById.get(sourceId)).filter(Boolean),
  }));
  const forkById = new Map(forks.map((event) => [event.id, event]));
  const nodeById = new Map([
    ...strains.map((strain) => [strain.id, strain]),
    ...forks.map((event) => [event.id, event]),
  ]);
  const edgeInputs = (family.lineage_edges || []).map((edge) => ({
    ...edge,
    external_refs: Array.isArray(edge.external_refs)
      ? edge.external_refs.map((ref) => ({
          ...ref,
          source: sourceById.get(ref?.source_ref),
        }))
      : [],
  }));
  const edges = edgeInputs.map((edge) => lineageEdgePath(edge, nodeById, forkById)).filter(Boolean);
  const parentByChild = {};
  edgeInputs.forEach((edge) => {
    if (!parentByChild[edge.source]) parentByChild[edge.source] = [];
    parentByChild[edge.source].push(edge.target);
  });
  return {
    strains,
    forks,
    edges,
    parentByChild,
    ticks: Array.isArray(family.timeline_ticks) ? family.timeline_ticks : [],
  };
}

export function getSupplyChainIndexModel(data = loadSupplyChainData()) {
  const incidents = Array.isArray(data?.incidents) ? data.incidents.filter(Boolean) : [];
  const entities = data?.entities && typeof data.entities === 'object' ? data.entities : {};
  const relationships = Array.isArray(data?.relationships) ? data.relationships : [];
  const featuredIncidents = SUPPLY_CHAIN_FEATURED_INCIDENT_IDS.map((id) => {
    const incident = incidents.find((item) => item.id === id);
    if (!incident) throw new Error(`Featured Supply Chain incident not found: ${id}`);
    return {
      id: incident.id,
      title: incident.title,
      summary: incident.summary,
      href: `/supply-chain/incidents/${incident.id}/`,
      attackStage: incident.attack_stage,
      evidenceLevel: incident.evidence_level,
      confidence: incident.confidence,
    };
  });
  const incidentRows = incidents
    .map((incident) => ({
      ...incidentLinkRow(incident),
      summary: incident.summary,
    }))
    .sort(compareTitle);
  const lineageViews = (Array.isArray(data.malwareFamilies) ? data.malwareFamilies : [])
    .filter((family) => family && typeof family.id === 'string')
    .map((family) => {
      const strains = Array.isArray(family.strains) ? family.strains : [];
      const ecosystems = Array.from(
        new Set(strains.flatMap((strain) => (Array.isArray(strain.ecosystems) ? strain.ecosystems : [])))
      ).sort((a, b) => String(a).localeCompare(String(b)));
      return {
        id: family.id,
        title: family.name || family.id,
        summary: family.summary || '',
        href: `/supply-chain/malware-families/${family.id}/`,
        strainCount: strains.length,
        edgeCount: Array.isArray(family.lineage_edges) ? family.lineage_edges.length : 0,
        ecosystems,
        command: { type: 'select-entity', value: family.id, graphType: 'malware_family' },
      };
    })
    .sort(compareTitle);

  return {
    kind: 'index',
    title: 'Supply Chain',
    graphHero: buildGraphHeroModel(data),
    lede: SUPPLY_CHAIN_INDEX_COPY.lede,
    explanatorySections: SUPPLY_CHAIN_INDEX_COPY.sections,
    attackVectorBars: buildAttackVectorBars(data),
    attributionRows: buildAttributionRows(data),
    dwellTimeline: buildDwellTimeline(data),
    lineageViews,
    featuredIncidents,
    entitySummaries: entitySummaryDefinitions.map((summary) => ({
      ...summary,
      count: Array.isArray(entities[summary.key]) ? entities[summary.key].length : 0,
    })),
    seo: {
      title: 'Supply Chain',
      description: indexDescription,
      canonicalPath: '/supply-chain/',
      ogTitle: 'Threatpedia Supply Chain',
      ogDescription: indexDescription,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Threatpedia Supply Chain',
        description: indexDescription,
        url: 'https://threatpedia.wiki/supply-chain/',
      },
    },
    counts: {
      incidents: incidents.length,
      packages: Array.isArray(entities.packages) ? entities.packages.length : 0,
      releases: Array.isArray(entities.releases) ? entities.releases.length : 0,
      repositories: Array.isArray(entities.repositories) ? entities.repositories.length : 0,
      organizations: Array.isArray(entities.organizations) ? entities.organizations.length : 0,
      maintainers: Array.isArray(entities.maintainers) ? entities.maintainers.length : 0,
      buildSystems: Array.isArray(entities.build_systems) ? entities.build_systems.length : 0,
      distributionChannels: Array.isArray(entities.distribution_channels) ? entities.distribution_channels.length : 0,
      compromisedAccounts: Array.isArray(entities.accounts) ? entities.accounts.length : 0,
      relationships: relationships.length,
    },
    incidents: incidentRows,
  };
}

export function getSupplyChainExploreModel(data = loadSupplyChainData()) {
  const indexModel = getSupplyChainIndexModel(data);
  const description =
    'Full-screen explorer for the Threatpedia Supply Chain graph, with search, docked panels, and persistent graph selection.';
  return {
    ...indexModel,
    kind: 'explore',
    title: 'Supply Chain Explore',
    graphHero: {
      ...indexModel.graphHero,
      eyebrow: 'Corpus Explorer',
      status: 'Full-screen graph',
    },
    seo: {
      title: 'Supply Chain Explore',
      description,
      canonicalPath: '/supply-chain/explore/',
      ogTitle: 'Threatpedia Supply Chain Explore',
      ogDescription: description,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Threatpedia Supply Chain Explore',
        description,
        url: 'https://threatpedia.wiki/supply-chain/explore/',
      },
    },
  };
}

export function getSupplyChainIncidentPage(id, data = loadSupplyChainData()) {
  const incident = data.incidents.find((item) => item.id === id);
  if (!incident) return null;
  const description = incident.summary;
  return {
    kind: 'incident',
    title: incident.title,
    incident,
    graphHero: buildGraphHeroModel(data),
    editorialSections: editorialSectionsFor(incident),
    propagationTimeline: incidentPropagationTimeline(data, id),
    connectedEntities: incidentConnectedEntities(data, id),
    seo: {
      title: `Supply Chain: ${incident.title}`,
      description,
      canonicalPath: `/supply-chain/incidents/${incident.id}/`,
      ogTitle: `${incident.title} - Threatpedia Supply Chain`,
      ogDescription: description,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: incident.title,
        description,
        url: `https://threatpedia.wiki/supply-chain/incidents/${incident.id}/`,
        datePublished: incident.disclosed_at || incident.first_observed_at,
        author: {
          '@type': 'Organization',
          name: 'Threatpedia',
          url: 'https://threatpedia.wiki/',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Threatpedia',
          url: 'https://threatpedia.wiki/',
        },
        about: (Array.isArray(incident.supply_chain_vectors) ? incident.supply_chain_vectors : []).map((vector) => ({
          '@type': 'Thing',
          name: vector,
        })),
      },
    },
    sections: {
      packages: incidentEntityLinks(data, id, 'AFFECTED_PACKAGE'),
      releases: incidentReleaseLinks(data, id),
      repositories: incidentEntityLinks(data, id, 'AFFECTED_REPOSITORY'),
      organizations: incidentEntityLinks(data, id, 'AFFECTED_ORGANIZATION'),
      maintainers: incidentEntityLinks(data, id, 'AFFECTED_MAINTAINER'),
      actors: incidentAttributionLinks(data, id, 'ATTRIBUTED_TO_ACTOR', 'threat_actors'),
      campaigns: incidentAttributionLinks(data, id, 'RELATED_CAMPAIGN', 'campaigns'),
      buildSystems: incidentEntities(data, id, 'build_systems', 'USED_BUILD_SYSTEM'),
      distributionChannels: incidentEntities(data, id, 'distribution_channels', 'USED_DISTRIBUTION_CHANNEL'),
      compromisedAccounts: incidentEntities(data, id, 'compromised_accounts', 'COMPROMISED_ACCOUNT'),
      attributionEvidence: attributionEvidenceFor(incident),
      maintainerTenureAtMaliciousRelease: maintainerTenureAtMaliciousRelease(data, id),
    },
  };
}

export function getSupplyChainEntityPage(collectionKey, id, data = loadSupplyChainData()) {
  const collection = data.entities[collectionKey] || [];
  const entity = collection.find((item) => item.id === id);
  if (!entity) return null;
  const type = SUPPLY_CHAIN_ENTITY_TYPES.find((item) => item.key === collectionKey);
  if (!type) return null;
  const relatedIncidents = incidentLinksFor(data, id);
  const description = `${type.label} entity in the Threatpedia Supply Chain corpus with ${relatedIncidents.length} connected incident${relatedIncidents.length === 1 ? '' : 's'}.`;
  return {
    kind: 'entity',
    title: entity.name,
    entity: { ...entity, entityCollection: collectionKey },
    entityType: type.label,
    graphHero: buildGraphHeroModel(data),
    relatedIncidents,
    connectedIncidents: relatedIncidents,
    connectedEntities: entityConnectionsFor(data, id),
    seo: {
      title: `Supply Chain ${type.label}: ${entity.name}`,
      description,
      canonicalPath: `/supply-chain/${type.segment}/${entity.id}/`,
      ogTitle: `${entity.name} - Threatpedia Supply Chain ${type.label}`,
      ogDescription: description,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Thing',
        name: entity.name,
        identifier: entity.id,
        description,
        url: `https://threatpedia.wiki/supply-chain/${type.segment}/${entity.id}/`,
      },
    },
  };
}

export function getSupplyChainMalwareFamilyPage(id, data = loadSupplyChainData()) {
  const family = (data.malwareFamilies || []).find((item) => item.id === id);
  if (!family) return null;
  const description = family.summary;
  const phylogeny = buildFamilyPhylogenyModel(data, family);
  const strainComparisonRows = phylogeny.strains.map((strain) => ({
    id: strain.id,
    generation: strain.name,
    firstSeen: strain.first_seen,
    ecosystems: (strain.ecosystems || []).join(' · '),
    keyMutation: strain.key_mutation,
    provenanceAbuse: strain.provenance_abuse,
    attribution: strain.attribution?.label || 'Unknown',
    confidence: strain.lineage_confidence,
  }));
  const changelogRows = phylogeny.strains.map((strain) => ({
    id: strain.id,
    title: strain.name,
    when: [
      strain.first_seen,
      (strain.ecosystems || []).join(' + '),
      strain.lineage_confidence,
    ].filter(Boolean).join(' · '),
    kept: strain.retained_features || [],
    mutation: strain.mutation_summary,
    confidence: strain.lineage_confidence,
  }));
  return {
    kind: 'malware-family',
    title: family.name,
    family,
    graphHero: buildGraphHeroModel(data),
    phylogeny,
    strainComparisonRows,
    changelogRows,
    relatedIncidents: familyIncidentLinks(data, Array.from(new Set(phylogeny.strains.flatMap((strain) => strain.incident_ids || [])))),
    seo: {
      title: `Supply Chain Malware Family: ${family.name}`,
      description,
      canonicalPath: `/supply-chain/malware-families/${family.id}/`,
      ogTitle: `${family.name} lineage - Threatpedia Supply Chain`,
      ogDescription: description,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: `${family.name} malware-family lineage`,
        description,
        url: `https://threatpedia.wiki/supply-chain/malware-families/${family.id}/`,
        about: phylogeny.strains.map((strain) => ({ '@type': 'Thing', name: strain.name })),
      },
    },
  };
}

export function getSupplyChainRoutes(options = {}) {
  const enabled = options.enabled ?? isSupplyChainPagesEnabled(options.env);
  if (!enabled) return [];
  const data = options.data || loadSupplyChainData();
  const errors = validateSupplyChainPageData(data);
  if (errors.length > 0) {
    throw new Error(`Supply Chain page data is invalid:\n${errors.join('\n')}`);
  }

  const routes = [
    { slug: undefined, page: getSupplyChainIndexModel(data) },
    { slug: 'explore', page: getSupplyChainExploreModel(data) },
  ];
  data.incidents.forEach((incident) => {
    routes.push({ slug: `incidents/${incident.id}`, page: getSupplyChainIncidentPage(incident.id, data) });
  });
  SUPPLY_CHAIN_ENTITY_TYPES.forEach((entityType) => {
    data.entities[entityType.key].forEach((entity) => {
      routes.push({
        slug: `${entityType.segment}/${entity.id}`,
        page: getSupplyChainEntityPage(entityType.key, entity.id, data),
      });
    });
  });
  (data.malwareFamilies || []).forEach((family) => {
    routes.push({
      slug: `malware-families/${family.id}`,
      page: getSupplyChainMalwareFamilyPage(family.id, data),
    });
  });
  return routes;
}

export function pageFromSlug(slug, data = loadSupplyChainData()) {
  if (!slug) return getSupplyChainIndexModel(data);
  const [segment, id] = slug.split('/');
  if (segment === 'explore') return getSupplyChainExploreModel(data);
  if (segment === 'incidents') return getSupplyChainIncidentPage(id, data);
  if (segment === 'malware-families') return getSupplyChainMalwareFamilyPage(id, data);
  const entityType = routeEntityBySegment[segment];
  if (!entityType) return null;
  return getSupplyChainEntityPage(entityType.key, id, data);
}
