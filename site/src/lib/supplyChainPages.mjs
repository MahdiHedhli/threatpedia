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

function entityConnectionsFor(data, entityId) {
  return relationshipRows(data, entityId)
    .filter((row) => row.entity)
    .map((row) => ({
      href: linkForEntity(row.entity),
      label: row.entity.name,
      id: row.entity.id,
      type: row.type,
      entityType: row.entity.entityCollection,
    }))
    .filter((item) => item.href)
    .sort(compareLabel);
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

export function getSupplyChainIndexModel(data = loadSupplyChainData()) {
  return {
    kind: 'index',
    title: 'Supply Chain',
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
  return {
    kind: 'incident',
    title: incident.title,
    incident,
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
  return {
    kind: 'entity',
    title: entity.name,
    entity: { ...entity, entityCollection: collectionKey },
    entityType: type.label,
    connectedIncidents: incidentLinksFor(data, id),
    connectedEntities: entityConnectionsFor(data, id),
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
