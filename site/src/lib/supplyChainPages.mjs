import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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
  build_systems: 'build_systems.json',
  distribution_channels: 'distribution_channels.json',
  maintainers: 'maintainers.json',
  organizations: 'organizations.json',
  packages: 'packages.json',
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
  build_systems: 'Build System',
  distribution_channels: 'Distribution Channel',
  accounts: 'Compromised Account',
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

export function isSupplyChainPagesEnabled(env = typeof process !== 'undefined' ? process.env || {} : {}) {
  return String(env.ENABLE_SUPPLY_CHAIN_PAGES || '').toLowerCase() === 'true';
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf-8'));
}

export function loadSupplyChainData() {
  if (cachedData) return cachedData;
  const incidents = readJson(incidentPath);
  const relationships = readJson(relationshipPath);
  const entities = Object.fromEntries(
    Object.entries(allEntityFiles).map(([key, filename]) => [key, readJson(path.join(entityDir, filename))])
  );
  const entityById = new Map();
  Object.entries(entities).forEach(([type, items]) => {
    items.forEach((entity) => {
      entityById.set(entity.id, { ...entity, entityCollection: type });
    });
  });
  const incidentByNodeId = new Map(incidents.map((incident) => [`incident-${incident.id}`, incident]));
  cachedData = { incidents, relationships, entities, entityById, incidentByNodeId };
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
  const type = SUPPLY_CHAIN_ENTITY_TYPES.find((item) => item.key === entity.entityCollection);
  return type ? `/supply-chain/${type.segment}/${entity.id}/` : null;
}

function entityLink(data, entityId) {
  const entity = data.entityById.get(entityId);
  if (!entity) return null;
  const href = linkForEntity(entity);
  return { href, label: entity.name, id: entity.id };
}

function compareLabel(a, b) {
  return (a.label || '').localeCompare(b.label || '');
}

function compareTitle(a, b) {
  return (a.title || '').localeCompare(b.title || '');
}

function incidentLinksFor(data, entityId) {
  return relationshipRows(data, entityId)
    .filter((row) => row.incident)
    .map((row) => ({
      href: `/supply-chain/incidents/${row.incident.id}/`,
      label: row.incident.title,
      id: row.incident.id,
      type: row.type,
    }))
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
    }))
    .filter((item) => item.href);

  const incidentNodes = relationshipRows(data, entityId)
    .filter((row) => row.incident)
    .map((row) => `incident-${row.incident.id}`);
  const throughIncidents = incidentNodes.flatMap((incidentNode) =>
    relationshipRows(data, incidentNode)
      .filter((row) => row.entity && row.entity.id !== entityId)
      .map((row) => ({
        href: linkForEntity(row.entity),
        label: row.entity.name,
        id: row.entity.id,
        type: row.type,
        entityType: entityTypeLabel(row.entity),
        context: data.incidentByNodeId.get(incidentNode)?.title,
      }))
      .filter((item) => item.href)
  );

  return dedupeRows([...direct, ...throughIncidents]).sort(compareLabel);
}

function incidentConnectedEntities(data, incidentId) {
  const nodeId = `incident-${incidentId}`;
  const rows = relationshipRows(data, nodeId)
    .filter((row) => row.entity)
    .map((row) => ({
      href: linkForEntity(row.entity),
      label: row.entity.name,
      id: row.entity.id,
      type: row.type,
      entityType: entityTypeLabel(row.entity),
    }));
  return dedupeRows(rows).sort(compareLabel);
}

function incidentEntityLinks(data, incidentId, relationshipType) {
  const nodeId = `incident-${incidentId}`;
  return data.relationships
    .filter((relationship) => relationship.source === nodeId && relationship.type === relationshipType)
    .map((relationship) => entityLink(data, relationship.target))
    .filter(Boolean)
    .sort(compareLabel);
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

export function getSupplyChainIndexModel(data = loadSupplyChainData()) {
  const featuredIncidents = SUPPLY_CHAIN_FEATURED_INCIDENT_IDS.map((id) => {
    const incident = data.incidents.find((item) => item.id === id);
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

  return {
    kind: 'index',
    title: 'Supply Chain',
    lede: SUPPLY_CHAIN_INDEX_COPY.lede,
    explanatorySections: SUPPLY_CHAIN_INDEX_COPY.sections,
    featuredIncidents,
    entitySummaries: entitySummaryDefinitions.map((summary) => ({
      ...summary,
      count: data.entities[summary.key]?.length || 0,
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
      incidents: data.incidents.length,
      packages: data.entities.packages.length,
      repositories: data.entities.repositories.length,
      organizations: data.entities.organizations.length,
      maintainers: data.entities.maintainers.length,
      buildSystems: data.entities.build_systems.length,
      distributionChannels: data.entities.distribution_channels.length,
      relationships: data.relationships.length,
    },
    incidents: data.incidents
      .map((incident) => ({
        id: incident.id,
        title: incident.title,
        summary: incident.summary,
        href: `/supply-chain/incidents/${incident.id}/`,
        attackStage: incident.attack_stage,
        evidenceLevel: incident.evidence_level,
      }))
      .sort(compareTitle),
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
    editorialSections: editorialSectionsFor(incident),
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
      repositories: incidentEntityLinks(data, id, 'AFFECTED_REPOSITORY'),
      organizations: incidentEntityLinks(data, id, 'AFFECTED_ORGANIZATION'),
      maintainers: incidentEntityLinks(data, id, 'AFFECTED_MAINTAINER'),
      buildSystems: incidentEntities(data, id, 'build_systems', 'USED_BUILD_SYSTEM'),
      distributionChannels: incidentEntities(data, id, 'distribution_channels', 'USED_DISTRIBUTION_CHANNEL'),
      compromisedAccounts: incidentEntities(data, id, 'compromised_accounts', 'COMPROMISED_ACCOUNT'),
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

export function getSupplyChainRoutes(options = {}) {
  const enabled = options.enabled ?? isSupplyChainPagesEnabled(options.env);
  if (!enabled) return [];
  const data = options.data || loadSupplyChainData();
  const errors = validateSupplyChainPageData(data);
  if (errors.length > 0) {
    throw new Error(`Supply Chain page data is invalid:\n${errors.join('\n')}`);
  }

  const routes = [{ slug: undefined, page: getSupplyChainIndexModel(data) }];
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
  return routes;
}

export function pageFromSlug(slug, data = loadSupplyChainData()) {
  if (!slug) return getSupplyChainIndexModel(data);
  const [segment, id] = slug.split('/');
  if (segment === 'incidents') return getSupplyChainIncidentPage(id, data);
  const entityType = routeEntityBySegment[segment];
  if (!entityType) return null;
  return getSupplyChainEntityPage(entityType.key, id, data);
}
