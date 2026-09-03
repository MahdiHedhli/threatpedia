const GRAPH_DATA_URL = '/supply-chain-graph.json';
const SEARCH_INDEX_URL = '/supply-chain-search-index.json';
const BASE_DRAWABLE_TIERS = new Set(['actor', 'campaign', 'incident', 'technique']);
const REST_DRAWABLE_TIERS = new Set(['actor', 'campaign', 'incident']);
const BLOOM_TIERS = new Set(['organization', 'package', 'release', 'repository', 'maintainer', 'account', 'supporting']);
const BLOOM_NODE_BUDGET = 28;
const BLOOM_Z_THRESHOLD = 1.55;
const CAMPAIGN_LABEL_Z = 0.62;
const INCIDENT_LABEL_Z = 0.68;
const DEEP_LABEL_Z = 1.95;
const TECHNIQUE_Z_THRESHOLD = 1.45;
const ALL_INCIDENT_Z_THRESHOLD = 1.72;
const CAMERA_Z_MIN = 0.22;
const CAMERA_Z_MAX = 3.4;
const CAMERA_Z_STEP = 1.28;
const RECENT_WINDOW_DAYS = 183;
const REST_NODE_BUDGET = 40;
const SEVERITY_COLORS = {
  critical: [0.96, 0.22, 0.29, 1],
  high: [0.96, 0.48, 0.19, 1],
  medium: [0.91, 0.63, 0.13, 1],
  low: [0.22, 0.78, 0.44, 1],
  actor: [0.94, 0.27, 0.34, 1],
  campaign: [0.61, 0.36, 0.9, 1],
  technique: [0.32, 0.65, 0.98, 1],
  organization: [0.18, 0.76, 0.66, 1],
  package: [0.13, 0.78, 0.44, 1],
  release: [0.31, 0.76, 0.92, 1],
  repository: [0.32, 0.65, 0.98, 1],
  maintainer: [0.82, 0.84, 0.88, 1],
  account: [0.96, 0.72, 0.23, 1],
  supporting: [0.48, 0.56, 0.67, 1],
  propagation: [0.13, 0.78, 0.44, 1],
  context: [0.48, 0.55, 0.65, 1],
  default: [0.72, 0.77, 0.84, 1],
  muted: [0.353, 0.416, 0.494, 0.32],
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function clampAxis(value, min, max) {
  return min > max ? (min + max) / 2 : clamp(value, min, max);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function dateNumber(value) {
  const parsed = Date.parse(value || '');
  return Number.isFinite(parsed) ? parsed : null;
}

function shortNodeLabel(node) {
  return node?.short_label || node?.shortLabel || node?.name || node?.label || node?.id || 'Unknown';
}

function searchLabel(value) {
  return String(value || '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function normalizeSearchText(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9@:/._-]+/g, ' ').trim();
}

function compactSearchType(type) {
  const labels = {
    account: 'Account',
    actor: 'Actor',
    build_system: 'Build System',
    campaign: 'Campaign',
    distribution_channel: 'Distribution',
    incident: 'Incident',
    maintainer: 'Maintainer',
    organization: 'Organization',
    package: 'Package',
    release: 'Release',
    repository: 'Repository',
  };
  return labels[type] || searchLabel(type);
}

function scoreSearchEntry(entry, query) {
  const q = normalizeSearchText(query);
  if (!q) return 0;
  const displayName = normalizeSearchText(entry.displayName);
  const aliases = Array.isArray(entry.aliases) ? entry.aliases.map(normalizeSearchText) : [];
  let score = 0;
  if (displayName === q) score += 220;
  else if (displayName.startsWith(q)) score += 160;
  else if (displayName.includes(q)) score += 90;
  let aliasScore = 0;
  aliases.forEach((alias) => {
    if (alias === q) aliasScore = Math.max(aliasScore, 120);
    else if (alias.startsWith(q)) aliasScore = Math.max(aliasScore, 76);
    else if (alias.includes(q)) aliasScore = Math.max(aliasScore, 48);
  });
  score += aliasScore;
  const initials = displayName.split(/[\s/_-]+/).map((part) => part[0]).join('');
  if (initials && initials.startsWith(q)) score += 32;
  const typeBoost = {
    package: 24,
    release: 16,
    incident: 34,
    actor: 86,
    campaign: 48,
    organization: 12,
    repository: 10,
    maintainer: 8,
  };
  score += typeBoost[entry.type] || 0;
  return score;
}

function graphStateParam(selection) {
  if (!selection?.type || !selection?.value || selection.type === 'overview') return null;
  return `${selection.type}:${selection.value}`;
}

function parseGraphStateParam(value) {
  if (!value) return null;
  const separator = value.indexOf(':');
  if (separator <= 0) return null;
  const type = value.slice(0, separator);
  const selectedValue = value.slice(separator + 1);
  return type && selectedValue ? { type, value: selectedValue } : null;
}

function recentThreshold(incidentNodes) {
  const latest = Math.max(...incidentNodes.map((node) => dateNumber(node.time)).filter(Number.isFinite));
  if (!Number.isFinite(latest)) return null;
  return latest - RECENT_WINDOW_DAYS * 24 * 60 * 60 * 1000;
}

function isRecentIncident(node, threshold) {
  const time = dateNumber(node?.time);
  return Number.isFinite(time) && (threshold === null || time >= threshold);
}

function tierRank(tier) {
  if (tier === 'actor') return 0;
  if (tier === 'technique') return 1;
  if (tier === 'campaign') return 2;
  if (tier === 'incident') return 3;
  if (tier === 'organization') return 4;
  if (tier === 'package') return 5;
  if (tier === 'release') return 6;
  return 7;
}

function isBaseDrawableNode(node) {
  return BASE_DRAWABLE_TIERS.has(node?.tier);
}

function bloomRank(node) {
  if (node.tier === 'organization') return 0;
  if (node.tier === 'package') return 1;
  if (node.tier === 'release') return 2;
  if (node.tier === 'repository') return 3;
  if (node.tier === 'maintainer') return 4;
  if (node.tier === 'account') return 5;
  if (node.tier === 'supporting') return 6;
  return 7;
}

function nodeRadius(node) {
  if (node?.tier === 'actor') return 22;
  if (node?.tier === 'campaign') return 15;
  if (node?.tier === 'incident') return 11;
  if (node?.tier === 'organization') return 12;
  if (node?.tier === 'package') return 8;
  if (node?.tier === 'release') return 6;
  if (node?.tier === 'repository') return 8;
  if (node?.tier === 'maintainer') return 7;
  if (node?.tier === 'account') return 7;
  if (node?.tier === 'supporting') return 7;
  return 8;
}

function nodeShape(node) {
  if (node?.tier === 'actor' || node?.tier === 'release') return 1;
  if (node?.tier === 'campaign' || node?.tier === 'package' || node?.tier === 'repository' || node?.tier === 'account') return 2;
  return 0;
}

class SupplyChainQuadtree {
  constructor(bounds, depth = 0) {
    this.bounds = bounds;
    this.depth = depth;
    this.points = [];
    this.children = null;
  }

  contains(point) {
    const { x, y } = point;
    const { x0, y0, x1, y1 } = this.bounds;
    return x >= x0 && x <= x1 && y >= y0 && y <= y1;
  }

  subdivide() {
    const { x0, y0, x1, y1 } = this.bounds;
    const mx = (x0 + x1) / 2;
    const my = (y0 + y1) / 2;
    this.children = [
      new SupplyChainQuadtree({ x0, y0, x1: mx, y1: my }, this.depth + 1),
      new SupplyChainQuadtree({ x0: mx, y0, x1, y1: my }, this.depth + 1),
      new SupplyChainQuadtree({ x0, y0: my, x1: mx, y1 }, this.depth + 1),
      new SupplyChainQuadtree({ x0: mx, y0: my, x1, y1 }, this.depth + 1),
    ];
  }

  insert(point) {
    if (!this.contains(point)) return false;
    if (!this.children && (this.points.length < 6 || this.depth >= 8)) {
      this.points.push(point);
      return true;
    }
    if (!this.children) {
      const existing = this.points;
      this.points = [];
      this.subdivide();
      existing.forEach((item) => this.insert(item));
    }
    return this.children.some((child) => child.insert(point));
  }

  nearest(x, y, radius, best = null) {
    const { x0, y0, x1, y1 } = this.bounds;
    const dx = x < x0 ? x0 - x : x > x1 ? x - x1 : 0;
    const dy = y < y0 ? y0 - y : y > y1 ? y - y1 : 0;
    const boundaryDistance = Math.hypot(dx, dy);
    const currentRadius = best ? Math.min(radius, best.distance) : radius;
    if (boundaryDistance > currentRadius) return best;

    for (const point of this.points) {
      const distance = Math.hypot(point.x - x, point.y - y);
      if (distance <= currentRadius && (!best || distance < best.distance)) {
        best = { point, distance };
      }
    }
    if (this.children) {
      for (const child of this.children) best = child.nearest(x, y, radius, best);
    }
    return best;
  }
}

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) || 'WebGL shader compile failed');
  }
  return shader;
}

function createProgram(gl, vertexSource, fragmentSource) {
  const program = gl.createProgram();
  gl.attachShader(program, compileShader(gl, gl.VERTEX_SHADER, vertexSource));
  gl.attachShader(program, compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) || 'WebGL program link failed');
  }
  return program;
}

function fitBounds(nodes, viewport, padding = 120) {
  if (!nodes.length) return { cx: 0, cy: 0, z: 1.2 };
  const bounds = nodes.reduce(
    (acc, node) => ({
      x0: Math.min(acc.x0, node.x),
      y0: Math.min(acc.y0, node.y),
      x1: Math.max(acc.x1, node.x),
      y1: Math.max(acc.y1, node.y),
    }),
    { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity }
  );
  const width = Math.max(1, bounds.x1 - bounds.x0 + padding * 2);
  const height = Math.max(1, bounds.y1 - bounds.y0 + padding * 2);
  const z = Math.min(viewport.width / width, viewport.height / height);
  return {
    cx: (bounds.x0 + bounds.x1) / 2,
    cy: (bounds.y0 + bounds.y1) / 2,
    z: clamp(z, 0.22, 2.8),
  };
}

function boundsForNodes(nodes, fallback = { x0: -1200, y0: -240, x1: 1200, y1: 720 }) {
  if (!nodes.length) return { ...fallback };
  return nodes.reduce(
    (acc, node) => ({
      x0: Math.min(acc.x0, node.x - (node.radius || 10) * 3),
      y0: Math.min(acc.y0, node.y - (node.radius || 10) * 3),
      x1: Math.max(acc.x1, node.x + (node.radius || 10) * 3),
      y1: Math.max(acc.y1, node.y + (node.radius || 10) * 3),
    }),
    { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity }
  );
}

function mergeBounds(...boundsList) {
  return boundsList.filter(Boolean).reduce(
    (acc, bounds) => ({
      x0: Math.min(acc.x0, bounds.x0),
      y0: Math.min(acc.y0, bounds.y0),
      x1: Math.max(acc.x1, bounds.x1),
      y1: Math.max(acc.y1, bounds.y1),
    }),
    { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity }
  );
}

function incidentNodeIdFromSourceIncidentId(sourceIncidentId) {
  return sourceIncidentId ? `incident-${sourceIncidentId}` : null;
}

function sortBloomNodes(nodes) {
  return nodes.sort((a, b) => bloomRank(a) - bloomRank(b) || (a.label || '').localeCompare(b.label || ''));
}

function packageIdForRelease(releaseId, edges) {
  const edge = edges.find((item) => item.type === 'PACKAGE_RELEASE' && item.target === releaseId);
  return edge?.source || null;
}

function buildBloomLayout(incident, context, sourceNodes, sourceEdges, offset = 0) {
  const centerX = incident.x + 620;
  const centerY = incident.y + 16;
  const visibleChildren = sortBloomNodes(
    [
      ...context.orgIds,
      ...context.packageIds,
      ...context.releaseIds,
      ...context.repositoryIds,
      ...context.maintainerIds,
      ...context.accountIds,
      ...context.supportingIds,
    ]
      .map((id) => sourceNodes.get(id))
      .filter(Boolean)
  );
  if (visibleChildren.length === 0) {
    return { incidentId: incident.id, nodes: [], edges: [], hiddenCount: 0, bounds: boundsForNodes([incident]) };
  }
  const orgIds = context.orgIds.length > 0 ? context.orgIds : ['virtual-org-unattributed'];
  const needsAggregation = visibleChildren.length > BLOOM_NODE_BUDGET;
  const visibleIds = new Set(
    visibleChildren
      .slice(0, BLOOM_NODE_BUDGET)
      .map((node) => node.id)
  );
  context.orgIds.forEach((id) => visibleIds.add(id));
  const hiddenCount = needsAggregation
    ? visibleChildren.filter((node) => !visibleIds.has(node.id) && !context.orgIds.includes(node.id)).length
    : 0;

  const nodes = [];
  orgIds.forEach((orgId, orgIndex) => {
    const source = sourceNodes.get(orgId);
    const angle = ((orgIndex + offset * 0.03) / Math.max(1, orgIds.length)) * Math.PI * 2 - Math.PI / 2;
    const orgRadius = orgIds.length === 1 ? 0 : 96 + orgIds.length * 8;
    const orgNode = source
      ? { ...source }
      : {
          id: orgId,
          entity_id: orgId,
          type: 'organization',
          tier: 'organization',
          label: 'Unattributed Cluster',
          radius: 11,
        };
    orgNode.x = centerX + Math.cos(angle) * orgRadius;
    orgNode.y = centerY + Math.sin(angle) * orgRadius;
    orgNode.radius = 12;
    orgNode.bloom_parent = incident.id;
    nodes.push(orgNode);

    const packagesForOrg = context.packageIds
      .concat(context.repositoryIds, context.maintainerIds, context.accountIds, context.supportingIds)
      .map((id) => sourceNodes.get(id))
      .filter((node) => node && visibleIds.has(node.id))
      .filter((node, index) => {
        if (orgIds.length === 1) return true;
        return index % orgIds.length === orgIndex;
      });
    packagesForOrg.forEach((packageNode, packageIndex) => {
      const packageAngle = (packageIndex / Math.max(1, packagesForOrg.length)) * Math.PI * 2 - Math.PI / 2;
      const packageRadius = 54 + Math.floor(packageIndex / 8) * 30;
      nodes.push({
        ...packageNode,
        x: orgNode.x + Math.cos(packageAngle) * packageRadius,
        y: orgNode.y + Math.sin(packageAngle) * packageRadius,
        radius: nodeRadius(packageNode),
        bloom_parent: incident.id,
      });
    });
  });

  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  context.releaseIds
    .map((id) => sourceNodes.get(id))
    .filter((node) => node && visibleIds.has(node.id))
    .forEach((releaseNode, releaseIndex) => {
      const packageId = packageIdForRelease(releaseNode.id, sourceEdges);
      const parentPackage = packageId ? nodeById.get(packageId) : null;
      const angle = (releaseIndex % 4) * (Math.PI / 2) + Math.PI / 4;
      const anchor = parentPackage || incident;
      const radius = parentPackage ? 30 : 128;
      const node = {
        ...releaseNode,
        x: anchor.x + Math.cos(angle) * radius,
        y: anchor.y + Math.sin(angle) * radius,
        radius: 6,
        bloom_parent: incident.id,
      };
      nodes.push(node);
      nodeById.set(node.id, node);
    });

  if (hiddenCount > 0) {
    nodes.push({
      id: `${incident.id}::bloom-more`,
      entity_id: `${incident.id}::bloom-more`,
      type: 'aggregate',
      tier: 'package',
      label: `+${hiddenCount} more`,
      x: centerX + 164,
      y: centerY + 118,
      radius: 10,
      bloom_parent: incident.id,
      aggregate: true,
    });
  }

  const visibleSet = new Set(nodes.map((node) => node.id));
  const edgeTypes = new Set([
    'AFFECTED_MAINTAINER',
    'AFFECTED_ORGANIZATION',
    'AFFECTED_PACKAGE',
    'AFFECTED_REPOSITORY',
    'COMPROMISED_ACCOUNT',
    'INCIDENT_AFFECTED_RELEASE',
    'PACKAGE_RELEASE',
    'SEEDED_BY',
    'SOURCE_ARTIFACT_DIVERGENCE',
    'USED_BUILD_SYSTEM',
    'USED_DISTRIBUTION_CHANNEL',
  ]);
  const edges = sourceEdges
    .filter((edge) => edgeTypes.has(edge.type))
    .filter((edge) => {
      if (edge.source === incident.id && visibleSet.has(edge.target)) return true;
      if (edge.target === incident.id && visibleSet.has(edge.source)) return true;
      if (visibleSet.has(edge.source) && visibleSet.has(edge.target)) return true;
      if (edge.type === 'SEEDED_BY' && edge.source_incident_id && incidentNodeIdFromSourceIncidentId(edge.source_incident_id) === incident.id) {
        return visibleSet.has(edge.source) && visibleSet.has(edge.target);
      }
      return false;
    });

  return { incidentId: incident.id, nodes, edges, hiddenCount, bounds: boundsForNodes([incident, ...nodes]) };
}

function buildBloomContext(incidentNodes, allNodes, edges) {
  const contextByIncident = new Map(incidentNodes.map((incident) => [
    incident.id,
    {
      incidentId: incident.id,
      orgIds: [],
      packageIds: [],
      releaseIds: [],
      repositoryIds: [],
      maintainerIds: [],
      accountIds: [],
      supportingIds: [],
    },
  ]));
  const add = (incidentId, key, value) => {
    if (!incidentId || !value || !contextByIncident.has(incidentId)) return;
    const list = contextByIncident.get(incidentId)[key];
    if (!list.includes(value)) list.push(value);
  };

  edges.forEach((edge) => {
    if (edge.type === 'AFFECTED_ORGANIZATION') add(edge.source, 'orgIds', edge.target);
    if (edge.type === 'AFFECTED_PACKAGE') add(edge.source, 'packageIds', edge.target);
    if (edge.type === 'INCIDENT_AFFECTED_RELEASE') add(edge.source, 'releaseIds', edge.target);
    if (edge.type === 'AFFECTED_REPOSITORY') add(edge.source, 'repositoryIds', edge.target);
    if (edge.type === 'AFFECTED_MAINTAINER') add(edge.source, 'maintainerIds', edge.target);
    if (edge.type === 'COMPROMISED_ACCOUNT') add(edge.source, 'accountIds', edge.target);
    if (edge.type === 'USED_BUILD_SYSTEM' || edge.type === 'USED_DISTRIBUTION_CHANNEL' || edge.type === 'SOURCE_ARTIFACT_DIVERGENCE') {
      add(edge.source, 'supportingIds', edge.target);
    }
    if (edge.type === 'PACKAGE_RELEASE') {
      allNodes.forEach((node) => {
        if (Array.isArray(node.source_incident_ids) && node.id === edge.source) {
          node.source_incident_ids.forEach((sourceIncidentId) => add(`incident-${sourceIncidentId}`, 'releaseIds', edge.target));
        }
      });
    }
    if (edge.type === 'SEEDED_BY') {
      const incidentId = incidentNodeIdFromSourceIncidentId(edge.source_incident_id);
      add(incidentId, edge.source?.startsWith('release-') ? 'releaseIds' : 'packageIds', edge.source);
      add(incidentId, edge.target?.startsWith('release-') ? 'releaseIds' : 'packageIds', edge.target);
      const sourcePackageId = edge.source?.startsWith('release-') ? packageIdForRelease(edge.source, edges) : null;
      const targetPackageId = edge.target?.startsWith('release-') ? packageIdForRelease(edge.target, edges) : null;
      add(incidentId, 'packageIds', sourcePackageId);
      add(incidentId, 'packageIds', targetPackageId);
    }
  });

  allNodes.forEach((node) => {
    if (!BLOOM_TIERS.has(node.tier) || !Array.isArray(node.source_incident_ids)) return;
    node.source_incident_ids.forEach((sourceIncidentId) => {
      const incidentId = `incident-${sourceIncidentId}`;
      if (node.tier === 'organization') add(incidentId, 'orgIds', node.id);
      if (node.tier === 'package') add(incidentId, 'packageIds', node.id);
      if (node.tier === 'release') add(incidentId, 'releaseIds', node.id);
      if (node.tier === 'repository') add(incidentId, 'repositoryIds', node.id);
      if (node.tier === 'maintainer') add(incidentId, 'maintainerIds', node.id);
      if (node.tier === 'account') add(incidentId, 'accountIds', node.id);
      if (node.tier === 'supporting') add(incidentId, 'supportingIds', node.id);
    });
  });

  return contextByIncident;
}

function buildLayout(payload) {
  const allNodes = payload.nodes.map((node) => ({ ...node }));
  const nodeById = new Map(allNodes.map((node) => [node.id, node]));
  const baseNodes = allNodes.filter(isBaseDrawableNode);
  const incidentNodes = baseNodes.filter((node) => node.tier === 'incident');
  const actorNodes = baseNodes.filter((node) => node.tier === 'actor');
  const campaignNodes = baseNodes.filter((node) => node.tier === 'campaign');
  const techniqueNodes = baseNodes.filter((node) => node.tier === 'technique');
  const actorIds = new Set(actorNodes.map((node) => node.id));
  const campaignIds = new Set(campaignNodes.map((node) => node.id));
  const incidentActor = new Map();
  const incidentCampaign = new Map();

  payload.edges.forEach((edge) => {
    if (edge.type === 'ATTRIBUTED_TO_ACTOR' && actorIds.has(edge.source) && nodeById.has(edge.target)) {
      incidentActor.set(edge.target, edge.source);
    }
    if (edge.type === 'RELATED_CAMPAIGN' && campaignIds.has(edge.source) && nodeById.has(edge.target)) {
      incidentCampaign.set(edge.target, edge.source);
    }
  });

  const threshold = recentThreshold(incidentNodes);
  const actorSlots = [...actorNodes, { id: 'actor-unattributed', virtual: true, label: 'Unattributed' }];
  const incidentsByActor = new Map(actorSlots.map((node) => [node.id, []]));
  incidentNodes
    .sort((a, b) => String(b.time || '').localeCompare(String(a.time || '')))
    .forEach((node) => {
      const actorId = incidentActor.get(node.id) || 'actor-unattributed';
      const list = incidentsByActor.get(actorId) || incidentsByActor.get('actor-unattributed');
      list.push(node);
    });

  const activeActorSlots = actorSlots.filter((actor) =>
    (incidentsByActor.get(actor.id) || []).some((incident) => isRecentIncident(incident, threshold))
  );
  const archiveActorSlots = actorSlots.filter((actor) => !activeActorSlots.includes(actor));
  const orderedActorSlots = [...activeActorSlots, ...archiveActorSlots];
  let laneCursor = 0;
  activeActorSlots.forEach((actor) => {
    const items = (incidentsByActor.get(actor.id) || []).filter((incident) => isRecentIncident(incident, threshold));
    const rows = Math.max(1, Math.ceil(items.length / 2));
    const laneHeight = Math.max(108, rows * 58 + 44);
    const centerY = laneCursor + laneHeight / 2;
    if (!actor.virtual) {
      actor.x = -560;
      actor.y = centerY;
      actor.radius = nodeRadius(actor);
    }
    items.forEach((node, index) => {
      const column = index % 2;
      const row = Math.floor(index / 2);
      node.x = 40 + column * 190;
      node.y = laneCursor + 34 + row * 58;
      node.radius = nodeRadius(node);
    });
    laneCursor += laneHeight + 18;
  });

  orderedActorSlots.forEach((actor) => {
    const items = (incidentsByActor.get(actor.id) || []).filter((incident) => !isRecentIncident(incident, threshold));
    if (items.length === 0) return;
    const rows = Math.max(1, Math.ceil(items.length / 2));
    const laneHeight = Math.max(150, rows * 86 + 54);
    const centerY = laneCursor + laneHeight / 2;
    if (!activeActorSlots.includes(actor)) {
      if (!actor.virtual) {
        actor.x = -560;
        actor.y = centerY;
        actor.radius = nodeRadius(actor);
      }
    }
    items.forEach((node, index) => {
      const column = index % 2;
      const row = Math.floor(index / 2);
      node.x = 40 + column * 190;
      node.y = laneCursor + 54 + row * 86;
      node.radius = nodeRadius(node);
    });
    laneCursor += laneHeight + 34;
  });

  const layoutMidpoint = Math.max(0, laneCursor - 34) / 2;
  actorNodes.forEach((node) => { node.y -= layoutMidpoint; });
  incidentNodes.forEach((node) => { node.y -= layoutMidpoint; });

  campaignNodes.forEach((node, index) => {
    const allIncidentChildren = incidentNodes.filter((incident) => incidentCampaign.get(incident.id) === node.id);
    const recentIncidentChildren = allIncidentChildren.filter((incident) => isRecentIncident(incident, threshold));
    const incidentChildren = recentIncidentChildren.length > 0 ? recentIncidentChildren : allIncidentChildren;
    if (incidentChildren.length > 0) {
      node.x = -240;
      node.y = incidentChildren.reduce((sum, child) => sum + child.y, 0) / incidentChildren.length;
    } else {
      node.x = -240;
      node.y = -layoutMidpoint + index * 96;
    }
    node.radius = nodeRadius(node);
  });

  techniqueNodes.forEach((node, index) => {
    const allIncidentChildren = payload.edges
      .filter((edge) => edge.type === 'INCIDENT_TECHNIQUE' && edge.source === node.id)
      .map((edge) => nodeById.get(edge.target))
      .filter(Boolean);
    const recentIncidentChildren = allIncidentChildren.filter((incident) => isRecentIncident(incident, threshold));
    const incidentChildren = recentIncidentChildren.length > 0 ? recentIncidentChildren : allIncidentChildren;
    if (incidentChildren.length > 0) {
      const avg = {
        x: incidentChildren.reduce((sum, child) => sum + child.x, 0) / incidentChildren.length,
        y: incidentChildren.reduce((sum, child) => sum + child.y, 0) / incidentChildren.length,
      };
      const offset = (index % 5) - 2;
      node.x = 480 + Math.floor(index / 5) * 54;
      node.y = avg.y + offset * 34;
    } else {
      node.x = 480 + (index % 4) * 48;
      node.y = layoutMidpoint + 100 + Math.floor(index / 4) * 42;
    }
    node.radius = nodeRadius(node);
  });

  allNodes.forEach((node) => {
    if (node.x !== undefined && node.y !== undefined) return;
    node.x = 0;
    node.y = 0;
    node.radius = nodeRadius(node);
  });

  const laidOutNodes = baseNodes.sort((a, b) => tierRank(a.tier) - tierRank(b.tier));
  const laidOutById = new Map(laidOutNodes.map((node) => [node.id, node]));
  const edges = payload.edges
    .filter((edge) => nodeById.has(edge.source) && nodeById.has(edge.target))
    .map((edge) => ({ ...edge, sourceNode: nodeById.get(edge.source), targetNode: nodeById.get(edge.target) }));
  const bounds = laidOutNodes.reduce(
    (acc, node) => ({
      x0: Math.min(acc.x0, node.x - 180),
      y0: Math.min(acc.y0, node.y - 120),
      x1: Math.max(acc.x1, node.x + 180),
      y1: Math.max(acc.y1, node.y + 120),
    }),
    { x0: -1200, y0: -240, x1: 1200, y1: 720 }
  );

  const quadtree = new SupplyChainQuadtree(bounds);
  laidOutNodes.forEach((node) => quadtree.insert(node));
  const bloomContext = buildBloomContext(incidentNodes, allNodes, edges);
  return { nodes: laidOutNodes, allNodes, nodeById, baseNodeById: laidOutById, edges, bounds, quadtree, bloomContext };
}

function createBloomLayoutWorker() {
  if (!('Worker' in window) || !('Blob' in window) || !('URL' in window)) return null;
  const source = `
    function boundsForNodes(nodes) {
      return nodes.reduce((acc, node) => ({
        x0: Math.min(acc.x0, node.x - (node.radius || 8) * 3),
        y0: Math.min(acc.y0, node.y - (node.radius || 8) * 3),
        x1: Math.max(acc.x1, node.x + (node.radius || 8) * 3),
        y1: Math.max(acc.y1, node.y + (node.radius || 8) * 3),
      }), { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity });
    }
    self.onmessage = (event) => {
      const { requestId, incident, layout } = event.data || {};
      const nodes = (layout?.nodes || []).map((node) => ({ ...node }));
      for (let iteration = 0; iteration < 10; iteration += 1) {
        for (let a = 0; a < nodes.length; a += 1) {
          for (let b = a + 1; b < nodes.length; b += 1) {
            const left = nodes[a];
            const right = nodes[b];
            if (left.aggregate || right.aggregate) continue;
            const minDistance = (left.radius || 8) + (right.radius || 8) + 13;
            const dx = right.x - left.x;
            const dy = right.y - left.y;
            const distance = Math.hypot(dx, dy) || 1;
            if (distance >= minDistance) continue;
            const push = (minDistance - distance) / 2;
            const ux = dx / distance;
            const uy = dy / distance;
            left.x -= ux * push;
            left.y -= uy * push;
            right.x += ux * push;
            right.y += uy * push;
          }
        }
      }
      self.postMessage({
        requestId,
        layout: {
          ...layout,
          nodes,
          bounds: boundsForNodes([incident, ...nodes]),
          worker_settled: true,
        },
      });
    };
  `;
  return new Worker(URL.createObjectURL(new Blob([source], { type: 'text/javascript' })));
}

class SupplyChainGraph {
  constructor(root, payload) {
    this.root = root;
    this.payload = payload;
    this.stage = root.querySelector('[data-sc-graph-stage]') || root;
    this.canvas = root.querySelector('[data-sc-graph-canvas]');
    this.labelLayer = root.querySelector('[data-sc-graph-labels]');
    this.status = root.querySelector('[data-sc-graph-status]');
    this.captionTitle = root.querySelector('[data-sc-graph-caption-title]');
    this.captionBody = root.querySelector('[data-sc-graph-caption-body]');
    this.description = root.querySelector('[data-sc-graph-description]');
    this.reflowButton = root.querySelector('[data-sc-graph-focus-reflow]');
    this.viewport = { width: 1, height: 1, dpr: 1 };
    this.layout = buildLayout(payload);
    this.bloomLayouts = new Map();
    this.bloomWorkerRequests = new Map();
    this.bloomWorker = createBloomLayoutWorker();
    if (this.bloomWorker) {
      this.bloomWorker.onmessage = (event) => {
        const { requestId, layout } = event.data || {};
        const incidentId = this.bloomWorkerRequests.get(requestId);
        this.bloomWorkerRequests.delete(requestId);
        if (!incidentId || !layout) return;
        this.bloomLayouts.set(incidentId, layout);
        this.lastLabelKey = '';
      };
    }
    this.lastBloomIncidentId = null;
    this.camera = { cx: 0, cy: 0, z: 1 };
    this.targetCamera = { cx: 0, cy: 0, z: 1 };
    this.selection = null;
    this.pageSelection = { type: 'overview', value: 'recent' };
    this.searchIndex = null;
    this.searchQuery = '';
    this.searchResults = [];
    this.searchActiveIndex = 0;
    this.searchDebounce = null;
    this.focusReflow = false;
    this.keyboardNodeId = null;
    this.drag = null;
    this.activePointers = new Map();
    this.pinch = null;
    this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.gl = this.canvas.getContext('webgl2', { antialias: true }) || this.canvas.getContext('webgl', { antialias: true });
    if (!this.gl) throw new Error('WebGL is not available');
    this.initWebGL();
    this.bind();
    this.resize();
    this.syncExploreMode();
    this.selectFromRoute();
    this.animationFrame = requestAnimationFrame(() => this.frame());
  }

  initWebGL() {
    const gl = this.gl;
    this.nodeProgram = createProgram(
      gl,
      `
        attribute vec2 a_position;
        attribute vec4 a_color;
        attribute float a_size;
        attribute float a_shape;
        uniform vec2 u_resolution;
        uniform vec3 u_camera;
        varying vec4 v_color;
        varying float v_shape;
        void main() {
          vec2 screen = (a_position - u_camera.xy) * u_camera.z + u_resolution * 0.5;
          vec2 clip = (screen / u_resolution) * 2.0 - 1.0;
          gl_Position = vec4(clip * vec2(1.0, -1.0), 0.0, 1.0);
          gl_PointSize = a_size * u_camera.z;
          v_color = a_color;
          v_shape = a_shape;
        }
      `,
      `
        precision mediump float;
        varying vec4 v_color;
        varying float v_shape;
        void main() {
          vec2 center = gl_PointCoord - vec2(0.5);
          float d = length(center);
          if (v_shape > 0.5 && v_shape < 1.5) d = abs(center.x) + abs(center.y);
          if (v_shape >= 1.5) d = max(abs(center.x), abs(center.y));
          if (d > 0.5) discard;
          float core = 1.0 - smoothstep(0.02, 0.5, d);
          float rim = smoothstep(0.28, 0.5, d);
          vec3 lit = mix(v_color.rgb, vec3(1.0), core * 0.26);
          vec3 shaded = mix(lit, v_color.rgb * 0.42, rim);
          float alpha = v_color.a * (1.0 - smoothstep(0.44, 0.5, d));
          gl_FragColor = vec4(shaded, alpha);
        }
      `
    );
    this.edgeProgram = createProgram(
      gl,
      `
        attribute vec2 a_position;
        attribute vec4 a_color;
        uniform vec2 u_resolution;
        uniform vec3 u_camera;
        varying vec4 v_color;
        void main() {
          vec2 screen = (a_position - u_camera.xy) * u_camera.z + u_resolution * 0.5;
          vec2 clip = (screen / u_resolution) * 2.0 - 1.0;
          gl_Position = vec4(clip * vec2(1.0, -1.0), 0.0, 1.0);
          v_color = a_color;
        }
      `,
      `
        precision mediump float;
        varying vec4 v_color;
        void main() {
          gl_FragColor = v_color;
        }
      `
    );
    this.nodeBuffer = gl.createBuffer();
    this.edgeBuffer = gl.createBuffer();
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }

  bind() {
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.stage);
    this.canvas.addEventListener('pointerdown', (event) => {
      this.canvas.setPointerCapture(event.pointerId);
      this.activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (this.activePointers.size >= 2) {
        this.drag = null;
        this.startPinchGesture();
        return;
      }
      this.drag = {
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        startCx: this.targetCamera.cx,
        startCy: this.targetCamera.cy,
        moved: false,
      };
    });
    this.canvas.addEventListener('pointermove', (event) => {
      if (this.activePointers.has(event.pointerId)) {
        this.activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      }
      if (this.pinch && this.activePointers.size >= 2) {
        event.preventDefault();
        this.updatePinchGesture();
        return;
      }
      if (!this.drag) {
        const node = this.pick(event.clientX, event.clientY);
        const nextHover = node?.id || null;
        if (nextHover !== this.hoverNodeId) {
          this.hoverNodeId = nextHover;
          this.lastLabelKey = '';
        }
        return;
      }
      const dx = event.clientX - this.drag.x;
      const dy = event.clientY - this.drag.y;
      if (Math.hypot(dx, dy) > 3) this.drag.moved = true;
      this.setCameraTarget({
        ...this.targetCamera,
        cx: this.drag.startCx - dx / this.targetCamera.z,
        cy: this.drag.startCy - dy / this.targetCamera.z,
      });
    });
    this.canvas.addEventListener('pointerleave', () => {
      this.hoverNodeId = null;
      this.lastLabelKey = '';
    });
    const endPointer = (event) => {
      const drag = this.drag;
      this.activePointers.delete(event.pointerId);
      if (this.pinch) {
        if (this.activePointers.size >= 2) this.startPinchGesture();
        else this.pinch = null;
        this.drag = null;
        return;
      }
      this.drag = null;
      if (!drag || drag.moved) return;
      const node = this.pick(event.clientX, event.clientY);
      if (node) this.selectNode(node);
    };
    this.canvas.addEventListener('pointerup', endPointer);
    this.canvas.addEventListener('pointercancel', endPointer);
    this.canvas.addEventListener('wheel', (event) => {
      event.preventDefault();
      const zoomFactor = Math.exp(-event.deltaY * 0.001);
      this.zoomAt(event.clientX, event.clientY, zoomFactor);
    }, { passive: false });
    this.reflowButton?.addEventListener('click', () => {
      if (this.selection?.type !== 'technique') return;
      this.focusReflow = !this.focusReflow;
      if (!this.focusReflow) this.frameSelectedTechniqueWideShot();
      this.reflowButton.setAttribute('aria-pressed', String(this.focusReflow));
      this.reflowButton.textContent = this.focusReflow ? 'Restore wide shot' : 'Focus reflow';
    });
    this.onDocumentClick = (event) => {
      const searchTarget = event.target.closest('[data-sc-search-open]');
      if (searchTarget) {
        event.preventDefault();
        event.stopPropagation();
        this.openSearchPalette(searchTarget);
        return;
      }
      const zoomTarget = event.target.closest('[data-sc-graph-zoom]');
      if (zoomTarget) {
        event.preventDefault();
        const direction = zoomTarget.dataset.scGraphZoom;
        this.zoomFromControl(direction === 'out' ? 1 / CAMERA_Z_STEP : CAMERA_Z_STEP);
        return;
      }
      const exploreLink = event.target.closest('[data-sc-explore-enter], [data-sc-explore-exit]');
      if (exploreLink) {
        this.prepareExploreNavigation(exploreLink);
        this.syncExploreLink(exploreLink);
        return;
      }
      const commandTarget = event.target.closest('[data-graph-command][data-graph-value]');
      if (!commandTarget) return;
      const command = commandTarget.dataset.graphCommand;
      const value = commandTarget.dataset.graphValue;
      const type = commandTarget.dataset.graphType;
      if (command === 'select-incident') this.selectByEntityId('incident', value);
      if (command === 'select-actor') this.selectByEntityId('actor', value);
      if (command === 'select-entity' && type) {
        if (!this.selectByEntityId(type, value)) this.selectEntityContext(type, value);
      }
      if (command === 'filter-stage') this.filterStage(value);
    };
    document.addEventListener('click', this.onDocumentClick);
    this.onDocumentKeydown = (event) => this.handleDocumentKeydown(event);
    document.addEventListener('keydown', this.onDocumentKeydown, { capture: true });
    this.onPageLoad = () => {
      if (!document.body.contains(this.root)) {
        this.destroy();
        return;
      }
      this.syncExploreMode();
      this.selectFromRoute();
      this.syncPageSelection();
    };
    document.addEventListener('astro:page-load', this.onPageLoad);
    this.root.addEventListener('keydown', (event) => this.handleKeydown(event));
  }

  destroy() {
    if (this.destroyed) return;
    this.clearExploreMode();
    this.destroyed = true;
    if (this.onDocumentClick) document.removeEventListener('click', this.onDocumentClick);
    if (this.onDocumentKeydown) document.removeEventListener('keydown', this.onDocumentKeydown, { capture: true });
    if (this.onPageLoad) document.removeEventListener('astro:page-load', this.onPageLoad);
    this.resizeObserver?.disconnect();
    this.bloomWorker?.terminate();
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
  }

  isExploreRoute() {
    return window.location.pathname === '/supply-chain/explore' || window.location.pathname === '/supply-chain/explore/';
  }

  currentGraphStateParam() {
    const fromUrl = new URLSearchParams(window.location.search).get('graph');
    return fromUrl || graphStateParam(this.pageSelection);
  }

  syncExploreLink(link) {
    const target = new URL(link.getAttribute('href') || link.href, window.location.href);
    const graph = this.currentGraphStateParam();
    if (graph) target.searchParams.set('graph', graph);
    else target.searchParams.delete('graph');
    link.href = `${target.pathname}${target.search}${target.hash}`;
  }

  prepareExploreNavigation(link) {
    if (link.matches('[data-sc-explore-enter]') && !this.isExploreRoute()) {
      sessionStorage.setItem('sc-explore-scroll-y', String(window.scrollY || 0));
    }
    if (link.matches('[data-sc-explore-exit]')) {
      sessionStorage.setItem('sc-explore-restore-scroll', 'true');
    }
  }

  syncExploreMode() {
    const active = this.isExploreRoute();
    const wasActive = document.body.classList.contains('sc-explore-active');
    document.body.classList.toggle('sc-explore-active', active);
    if (!active) this.restoreExploreScroll();
    if (active !== wasActive) this.queueExploreResize();
  }

  clearExploreMode() {
    const wasActive = document.body.classList.contains('sc-explore-active');
    document.body.classList.remove('sc-explore-active');
    if (wasActive) this.restoreExploreScroll();
    sessionStorage.removeItem('sc-explore-restore-scroll');
    sessionStorage.removeItem('sc-explore-scroll-y');
  }

  queueExploreResize() {
    const resize = () => {
      if (this.destroyed || !document.body.contains(this.root)) return;
      this.resize();
      window.dispatchEvent(new Event('resize'));
    };
    requestAnimationFrame(() => {
      resize();
      requestAnimationFrame(resize);
    });
  }

  restoreExploreScroll() {
    if (sessionStorage.getItem('sc-explore-restore-scroll') !== 'true') return;
    const scrollY = Number(sessionStorage.getItem('sc-explore-scroll-y') || 0);
    sessionStorage.removeItem('sc-explore-restore-scroll');
    sessionStorage.removeItem('sc-explore-scroll-y');
    requestAnimationFrame(() => {
      window.scrollTo(0, Number.isFinite(scrollY) ? scrollY : 0);
    });
  }

  updateGraphUrl() {
    if (this.suppressUrlSync) return;
    const url = new URL(window.location.href);
    const state = graphStateParam(this.pageSelection);
    if (state) url.searchParams.set('graph', state);
    else url.searchParams.delete('graph');
    const next = `${url.pathname}${url.search}${url.hash}`;
    const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (next !== current) {
      window.history.replaceState({ ...(window.history.state || {}), supplyChainGraph: state }, '', next);
    }
  }

  exitExploreRoute() {
    const exitLink = document.querySelector('[data-sc-explore-exit]');
    if (exitLink instanceof HTMLAnchorElement) {
      this.prepareExploreNavigation(exitLink);
      this.syncExploreLink(exitLink);
      exitLink.click();
      return;
    }
    const url = new URL('/supply-chain/', window.location.href);
    const state = this.currentGraphStateParam();
    if (state) url.searchParams.set('graph', state);
    sessionStorage.setItem('sc-explore-restore-scroll', 'true');
    window.location.href = `${url.pathname}${url.search}`;
  }

  handleDocumentKeydown(event) {
    const target = event.target instanceof Element ? event.target : null;
    const interactiveTarget = target?.closest('input, textarea, select, [contenteditable="true"]');
    const paletteOpen = Boolean(this.searchPalette?.isConnected);
    const isSupplyChainPath = window.location.pathname === '/supply-chain' || window.location.pathname.startsWith('/supply-chain/');

    if (paletteOpen) {
      this.handleSearchKeydown(event);
      return;
    }

    if (event.key === 'Escape' && this.isExploreRoute()) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      this.exitExploreRoute();
      return;
    }

    const opensWithSlash = event.key === '/' && !interactiveTarget;
    const opensWithCommand = event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey) && !interactiveTarget;
    if (!opensWithSlash && !opensWithCommand) return;
    if (!isSupplyChainPath || !document.body.contains(this.root)) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    this.openSearchPalette();
  }

  async loadSearchIndex() {
    if (this.searchIndex) return this.searchIndex;
    const response = await fetch(SEARCH_INDEX_URL, { credentials: 'same-origin' });
    if (!response.ok) throw new Error(`Search index fetch failed: ${response.status}`);
    this.searchIndex = await response.json();
    return this.searchIndex;
  }

  openSearchPalette(trigger = null) {
    if (trigger instanceof Element) this.searchReturnFocus = trigger;
    else if (document.activeElement instanceof Element && document.activeElement !== document.body && document.activeElement !== this.root) {
      this.searchReturnFocus = document.activeElement;
    } else {
      this.searchReturnFocus = document.querySelector('[data-sc-search-open]') || this.root;
    }
    document.getElementById('menu-search')?.blur();

    if (this.searchPalette?.isConnected) {
      this.searchInput?.focus({ preventScroll: true });
      this.searchInput?.select();
      return;
    }

    const backdrop = document.createElement('div');
    backdrop.className = 'sc-search-backdrop';
    backdrop.dataset.scSearchBackdrop = 'true';
    backdrop.setAttribute('role', 'presentation');
    backdrop.innerHTML = `
      <div class="sc-search-palette" role="dialog" aria-modal="true" aria-label="Search Supply Chain graph">
        <input class="sc-search-input" type="text" placeholder="Jump to entity..." aria-label="Search Supply Chain graph" autocomplete="off" />
        <div class="sc-search-results" role="listbox" aria-label="Supply Chain graph search results"></div>
      </div>
    `;
    document.body.appendChild(backdrop);
    this.searchPalette = backdrop;
    this.searchInput = backdrop.querySelector('.sc-search-input');
    this.searchResultsEl = backdrop.querySelector('.sc-search-results');
    this.searchQuery = '';
    this.searchResults = [];
    this.searchActiveIndex = 0;
    backdrop.addEventListener('mousedown', (event) => {
      if (event.target === backdrop) this.closeSearchPalette();
    });
    this.searchInput.addEventListener('input', () => {
      clearTimeout(this.searchDebounce);
      this.searchQuery = this.searchInput.value;
      this.searchDebounce = setTimeout(() => this.updateSearchResults(), 90);
    });
    this.renderSearchResults();
    this.loadSearchIndex()
      .then(() => this.updateSearchResults())
      .catch(() => {
        this.searchResults = [];
        this.renderSearchResults('Search index unavailable.');
      });
    requestAnimationFrame(() => {
      this.searchInput?.focus({ preventScroll: true });
      this.searchInput?.select();
    });
  }

  closeSearchPalette() {
    clearTimeout(this.searchDebounce);
    this.searchPalette?.remove();
    this.searchPalette = null;
    this.searchInput = null;
    this.searchResultsEl = null;
    const returnTarget = this.searchReturnFocus?.isConnected ? this.searchReturnFocus : this.root;
    this.searchReturnFocus = null;
    returnTarget?.focus?.({ preventScroll: true });
  }

  handleSearchKeydown(event) {
    if (!this.searchPalette?.isConnected) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      this.closeSearchPalette();
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      this.searchActiveIndex = (this.searchActiveIndex + direction + Math.max(1, this.searchResults.length)) % Math.max(1, this.searchResults.length);
      this.renderSearchResults();
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      const result = this.searchResults[this.searchActiveIndex];
      if (result) this.selectSearchResult(result);
    }
  }

  updateSearchResults() {
    const query = this.searchQuery.trim();
    if (!query || !Array.isArray(this.searchIndex)) {
      this.searchResults = [];
      this.searchActiveIndex = 0;
      this.renderSearchResults();
      return;
    }
    this.searchResults = this.searchIndex
      .map((entry) => ({ entry, score: scoreSearchEntry(entry, query) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || a.entry.type.localeCompare(b.entry.type) || a.entry.displayName.localeCompare(b.entry.displayName))
      .slice(0, 10)
      .map((item) => item.entry);
    this.searchActiveIndex = Math.min(this.searchActiveIndex, Math.max(0, this.searchResults.length - 1));
    this.renderSearchResults();
  }

  searchContextFor(entry) {
    const node = this.layout.nodeById.get(entry.id) || this.layout.allNodes.find((item) => item.id === entry.id || item.entity_id === entry.id);
    if (!node) return `${compactSearchType(entry.type)} entity`;
    if (node.type === 'incident') return node.summary || `${searchLabel(node.attack_stage)} incident`;
    const incidentIds = Array.isArray(node.source_incident_ids) ? node.source_incident_ids : [];
    if (incidentIds.length > 0) {
      const titles = incidentIds
        .map((id) => this.layout.nodeById.get(`incident-${id}`)?.label || this.payload.nodes.find((item) => item.id === `incident-${id}`)?.label)
        .filter(Boolean)
        .slice(0, 2);
      if (titles.length > 0) return `Connected to ${titles.join(', ')}`;
    }
    if (node.purl) return node.purl;
    return `${compactSearchType(entry.type)} node`;
  }

  renderSearchResults(message = '') {
    if (!this.searchResultsEl) return;
    if (message) {
      this.searchResultsEl.innerHTML = `<div class="sc-search-empty">${message}</div>`;
      return;
    }
    if (!this.searchQuery.trim()) {
      this.searchResultsEl.innerHTML = '<div class="sc-search-empty">Type an entity, package, PURL, CVE, actor, or incident.</div>';
      return;
    }
    if (this.searchResults.length === 0) {
      this.searchResultsEl.innerHTML = '<div class="sc-search-empty">No graph matches.</div>';
      return;
    }
    this.searchResultsEl.replaceChildren(
      ...this.searchResults.map((entry, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'sc-search-result';
        button.setAttribute('role', 'option');
        button.setAttribute('aria-selected', String(index === this.searchActiveIndex));
        button.innerHTML = `
          <span class="sc-search-title"></span>
          <span class="sc-search-type"></span>
          <span class="sc-search-context"></span>
        `;
        button.querySelector('.sc-search-title').textContent = entry.displayName;
        button.querySelector('.sc-search-type').textContent = compactSearchType(entry.type);
        button.querySelector('.sc-search-context').textContent = this.searchContextFor(entry);
        button.addEventListener('click', () => this.selectSearchResult(entry));
        return button;
      })
    );
  }

  selectSearchResult(entry) {
    this.closeSearchPalette();
    if (entry.href) {
      window.location.href = entry.href;
      return;
    }
    if (!this.selectByEntityId(entry.type, entry.id)) {
      this.selectEntityContext(entry.type, entry.id);
    }
    this.root.focus({ preventScroll: true });
  }

  resize() {
    const rect = this.stage.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    this.viewport = { width: Math.max(1, rect.width), height: Math.max(1, rect.height), dpr };
    this.canvas.width = Math.floor(this.viewport.width * dpr);
    this.canvas.height = Math.floor(this.viewport.height * dpr);
    this.canvas.style.width = `${this.viewport.width}px`;
    this.canvas.style.height = `${this.viewport.height}px`;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    if (!this.hasInitialFrame) {
      this.setCameraTarget(fitBounds(this.recentNodes(), this.viewport, 70), true);
      this.hasInitialFrame = true;
    }
  }

  recentNodes() {
    return this.visibleBaseNodes({ forceRest: true });
  }

  restVisibleIds() {
    const incidentNodes = this.layout.nodes.filter((node) => node.tier === 'incident');
    const threshold = recentThreshold(incidentNodes);
    const incidents = incidentNodes
      .filter((node) => isRecentIncident(node, threshold))
      .sort((a, b) => String(b.time || '').localeCompare(String(a.time || '')));
    const incidentIds = new Set(incidents.map((node) => node.id));
    const relatedIds = new Set(incidentIds);
    this.layout.edges.forEach((edge) => {
      const sourceIsIncident = incidentIds.has(edge.source);
      const targetIsIncident = incidentIds.has(edge.target);
      if (!sourceIsIncident && !targetIsIncident) return;
      const sourceTier = this.layout.nodeById.get(edge.source)?.tier;
      const targetTier = this.layout.nodeById.get(edge.target)?.tier;
      if (sourceTier === 'actor' || sourceTier === 'campaign' || sourceTier === 'incident') relatedIds.add(edge.source);
      if (targetTier === 'actor' || targetTier === 'campaign' || targetTier === 'incident') relatedIds.add(edge.target);
    });
    const ordered = this.layout.nodes
      .filter((node) => relatedIds.has(node.id) && REST_DRAWABLE_TIERS.has(node.tier))
      .sort((a, b) => tierRank(a.tier) - tierRank(b.tier) || String(b.time || '').localeCompare(String(a.time || '')));
    return new Set(ordered.slice(0, REST_NODE_BUDGET).map((node) => node.id));
  }

  selectedVisibleIds() {
    if (!this.selection) return null;
    const ids = new Set(this.selection.nodes || []);
    if (this.selection.value) ids.add(this.selection.value);
    this.layout.edges.forEach((edge) => {
      if (ids.has(edge.source) || ids.has(edge.target)) {
        const sourceTier = this.layout.nodeById.get(edge.source)?.tier;
        const targetTier = this.layout.nodeById.get(edge.target)?.tier;
        if (BASE_DRAWABLE_TIERS.has(sourceTier)) ids.add(edge.source);
        if (BASE_DRAWABLE_TIERS.has(targetTier)) ids.add(edge.target);
      }
    });
    return ids;
  }

  visibleBaseNodes(options = {}) {
    const selectedIds = options.forceRest ? null : this.selectedVisibleIds();
    const ids = selectedIds || (this.camera.z >= ALL_INCIDENT_Z_THRESHOLD && !options.forceRest
      ? new Set(this.layout.nodes.filter((node) => REST_DRAWABLE_TIERS.has(node.tier)).map((node) => node.id))
      : this.restVisibleIds());
    if (this.camera.z >= TECHNIQUE_Z_THRESHOLD || selectedIds) {
      this.layout.edges.forEach((edge) => {
        if (edge.type !== 'INCIDENT_TECHNIQUE') return;
        if (ids.has(edge.target)) ids.add(edge.source);
      });
    }
    return this.layout.nodes.filter((node) => ids.has(node.id));
  }

  activeBounds() {
    const bloom = this.activeBloomLayout();
    const baseBounds = boundsForNodes(this.visibleBaseNodes());
    return bloom ? mergeBounds(baseBounds, bloom.bounds) : baseBounds;
  }

  setCameraTarget(target, immediate = false) {
    const z = clamp(target.z, CAMERA_Z_MIN, CAMERA_Z_MAX);
    const halfWidth = this.viewport.width / z / 2;
    const halfHeight = this.viewport.height / z / 2;
    const bounds = this.activeBounds();
    this.targetCamera = {
      cx: clampAxis(target.cx, bounds.x0 + halfWidth, bounds.x1 - halfWidth),
      cy: clampAxis(target.cy, bounds.y0 + halfHeight, bounds.y1 - halfHeight),
      z,
    };
    if (immediate || this.reduceMotion) this.camera = { ...this.targetCamera };
  }

  screenToWorldAtCamera(clientX, clientY, camera = this.camera) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left - this.viewport.width / 2) / camera.z + camera.cx,
      y: (clientY - rect.top - this.viewport.height / 2) / camera.z + camera.cy,
    };
  }

  screenToWorld(clientX, clientY) {
    return this.screenToWorldAtCamera(clientX, clientY);
  }

  cameraForAnchoredZoom(clientX, clientY, nextZ, camera = this.targetCamera) {
    const rect = this.canvas.getBoundingClientRect();
    const z = clamp(nextZ, CAMERA_Z_MIN, CAMERA_Z_MAX);
    const world = this.screenToWorldAtCamera(clientX, clientY, camera);
    const dx = clientX - rect.left - this.viewport.width / 2;
    const dy = clientY - rect.top - this.viewport.height / 2;
    return {
      cx: world.x - dx / z,
      cy: world.y - dy / z,
      z,
    };
  }

  zoomAt(clientX, clientY, factor, camera = this.targetCamera) {
    if (!Number.isFinite(factor) || factor <= 0) return;
    this.setCameraTarget(this.cameraForAnchoredZoom(clientX, clientY, camera.z * factor, camera));
    this.ensureSemanticBloom();
  }

  zoomFromControl(factor) {
    const rect = this.canvas.getBoundingClientRect();
    this.zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, factor);
    this.root.focus({ preventScroll: true });
  }

  pointerPair() {
    return Array.from(this.activePointers.values()).slice(0, 2);
  }

  pinchMetrics() {
    const [a, b] = this.pointerPair();
    if (!a || !b) return null;
    return {
      distance: Math.max(1, Math.hypot(b.x - a.x, b.y - a.y)),
      centerX: (a.x + b.x) / 2,
      centerY: (a.y + b.y) / 2,
    };
  }

  startPinchGesture() {
    const metrics = this.pinchMetrics();
    if (!metrics) return;
    const startCamera = { ...this.targetCamera };
    this.pinch = {
      ...metrics,
      startCamera,
      startWorld: this.screenToWorldAtCamera(metrics.centerX, metrics.centerY, startCamera),
    };
  }

  updatePinchGesture() {
    const metrics = this.pinchMetrics();
    if (!metrics || !this.pinch) return;
    const rect = this.canvas.getBoundingClientRect();
    const z = clamp(this.pinch.startCamera.z * (metrics.distance / this.pinch.distance), CAMERA_Z_MIN, CAMERA_Z_MAX);
    const dx = metrics.centerX - rect.left - this.viewport.width / 2;
    const dy = metrics.centerY - rect.top - this.viewport.height / 2;
    this.setCameraTarget({
      cx: this.pinch.startWorld.x - dx / z,
      cy: this.pinch.startWorld.y - dy / z,
      z,
    });
    this.ensureSemanticBloom();
  }

  worldToScreen(node) {
    return {
      x: (node.x - this.camera.cx) * this.camera.z + this.viewport.width / 2,
      y: (node.y - this.camera.cy) * this.camera.z + this.viewport.height / 2,
    };
  }

  pick(clientX, clientY) {
    const world = this.screenToWorld(clientX, clientY);
    const radius = 24 / this.camera.z;
    const visible = this.visibleGraph();
    if (this.focusReflow && this.selection?.type === 'technique') {
      const nearest = visible.nodes.reduce((best, node) => {
        const displayNode = this.displayNode(node);
        const distance = Math.hypot(displayNode.x - world.x, displayNode.y - world.y);
        if (distance > radius || (best && best.distance <= distance)) return best;
        return { point: node, distance };
      }, null);
      return nearest?.point || null;
    }
    const nearest = visible.quadtree.nearest(world.x, world.y, radius);
    return nearest?.point || null;
  }

  selectFromRoute() {
    this.suppressUrlSync = true;
    try {
      const urlState = parseGraphStateParam(new URLSearchParams(window.location.search).get('graph'));
      if (urlState && this.applySelectionState(urlState)) return;

      const hero = document.querySelector('[data-graph-selection-type][data-graph-selection-value]');
      const type = hero?.dataset.graphSelectionType;
      const value = hero?.dataset.graphSelectionValue;
      if (type === 'preserve') {
        if (!this.selection) this.showOverview();
      } else if (type === 'incident') {
        if (!this.selectByEntityId('incident', value)) this.showOverview();
      } else if (type && type !== 'overview') {
        const normalizedType = type.replace(/\s+/g, '_');
        if (!this.selectByEntityId(normalizedType, value)) this.selectEntityContext(normalizedType, value);
      } else {
        this.showOverview();
      }
    } finally {
      this.suppressUrlSync = false;
    }
  }

  applySelectionState(state) {
    if (!state?.type || !state?.value) return false;
    if (state.type === 'overview') {
      this.showOverview();
      return true;
    }
    if (state.type === 'stage') {
      this.filterStage(state.value);
      return true;
    }
    if (this.selectByEntityId(state.type, state.value)) return true;
    this.selectEntityContext(state.type, state.value);
    return Boolean(this.selection && this.selection.type === state.type && this.selection.value === state.value);
  }

  selectByEntityId(type, value) {
    const normalizedType = type === 'threat actor' || type === 'threat_actor' ? 'actor' : type;
    const node = this.layout.allNodes.find(
      (item) => item.type === normalizedType && (item.id === value || item.entity_id === value)
    );
    if (!node) return false;
    if (!BASE_DRAWABLE_TIERS.has(node.tier) && !BLOOM_TIERS.has(node.tier)) return false;
    this.selectNode(node);
    return true;
  }

  selectEntityContext(type, value) {
    const entity = this.payload.nodes.find((node) => node.type === type && (node.id === value || node.entity_id === value));
    const incidentIds = new Set(
      (Array.isArray(entity?.source_incident_ids) ? entity.source_incident_ids : []).map((id) => `incident-${id}`)
    );
    this.payload.edges.forEach((edge) => {
      if (edge.source === value && edge.target?.startsWith('incident-')) incidentIds.add(edge.target);
      if (edge.target === value && edge.source?.startsWith('incident-')) incidentIds.add(edge.source);
    });
    const incidentNodes = this.layout.nodes.filter((node) => node.tier === 'incident' && incidentIds.has(node.id));
    if (!incidentNodes.length) {
      this.showOverview();
      return;
    }
    this.selection = { type, value, nodes: new Set(incidentNodes.map((node) => node.id)) };
    this.keyboardNodeId = incidentNodes[0]?.id || null;
    this.lastBloomIncidentId = null;
    this.pageSelection = { type, value };
    this.setCameraTarget(fitBounds(incidentNodes, this.viewport, 180));
    this.updateCaption(
      entity?.label || value,
      `${incidentNodes.length} connected incident${incidentNodes.length === 1 ? '' : 's'} framed for this entity.`
    );
    this.syncPageSelection();
  }

  showOverview() {
    this.selection = null;
    this.pageSelection = { type: 'overview', value: 'recent' };
    this.keyboardNodeId = null;
    this.lastBloomIncidentId = null;
    this.setCameraTarget(fitBounds(this.recentNodes(), this.viewport, 70));
    this.updateCaption(
      'Supply Chain Graph',
      `${this.payload.nodes.length} corpus nodes and ${this.payload.edges.length} typed edges loaded.`
    );
    this.syncPageSelection();
  }

  filterStage(stage) {
    const nodes = this.layout.nodes.filter((node) => node.tier === 'incident' && node.attack_stage === stage);
    if (nodes.length === 0) return;
    this.selection = { type: 'stage', value: stage, nodes: new Set(nodes.map((node) => node.id)) };
    this.keyboardNodeId = nodes[0]?.id || null;
    this.pageSelection = { type: 'stage', value: stage };
    this.focusReflow = false;
    this.lastBloomIncidentId = null;
    this.updateReflowControl();
    this.setCameraTarget(fitBounds(nodes, this.viewport));
    this.updateCaption(`Attack stage: ${stage.replace(/_/g, ' ')}`, `${nodes.length} incident${nodes.length === 1 ? '' : 's'} selected.`);
    this.syncPageSelection();
  }

  selectNode(node) {
    this.focusReflow = false;
    if (node.tier !== 'incident' && !BLOOM_TIERS.has(node.tier)) this.lastBloomIncidentId = null;
    this.keyboardNodeId = node.id;
    if (node.tier === 'incident') this.ensureBloomLayout(node.id);
    if (BLOOM_TIERS.has(node.tier)) {
      const incidentId = this.incidentIdForBloomNode(node.id);
      if (incidentId) this.ensureBloomLayout(incidentId);
    }
    const cluster = this.clusterFor(node);
    const selectionNodes =
      node.tier === 'technique'
        ? cluster.filter((item) => item.tier === 'technique' || item.tier === 'incident').map((item) => item.id)
        : cluster.some((item) => item.id === node.id) ? cluster.map((item) => item.id) : [node.id];
    this.selection = { type: node.type, value: node.id, nodes: new Set(selectionNodes) };
    this.pageSelection = { type: node.type, value: node.entity_id || node.id };
    if (node.tier === 'technique') {
      this.frameSelectedTechniqueWideShot(cluster);
    } else if (node.tier === 'incident') {
      this.setCameraTarget(fitBounds(this.clusterFor(node), this.viewport, 190));
    } else if (BLOOM_TIERS.has(node.tier)) {
      this.setCameraTarget(fitBounds(cluster, this.viewport, 180));
    } else {
      this.setCameraTarget(fitBounds(cluster, this.viewport, node.tier === 'incident' ? 170 : 140));
    }
    this.updateCaption(node.label, node.summary || `${node.type.replace(/_/g, ' ')} node selected.`);
    this.updateReflowControl();
    this.syncPageSelection();
  }

  keyboardNodes() {
    return this.visibleGraph().nodes
      .filter((node) => !node.aggregate)
      .sort((a, b) => tierRank(a.tier) - tierRank(b.tier) || (a.y - b.y) || (a.x - b.x));
  }

  handleKeydown(event) {
    const interactiveTarget = event.target?.closest?.('a, button, input, select, textarea, summary, [contenteditable="true"]');
    if (interactiveTarget && interactiveTarget !== this.root) return;
    const forwardKeys = new Set(['ArrowRight', 'ArrowDown']);
    const backwardKeys = new Set(['ArrowLeft', 'ArrowUp']);
    if (!forwardKeys.has(event.key) && !backwardKeys.has(event.key) && event.key !== 'Enter' && event.key !== 'Escape') return;
    event.preventDefault();
    if (event.key === 'Escape') {
      if (this.isExploreRoute()) {
        this.exitExploreRoute();
        return;
      }
      this.showOverview();
      return;
    }
    const nodes = this.keyboardNodes();
    if (!nodes.length) return;
    const currentIndex = Math.max(0, nodes.findIndex((node) => node.id === this.keyboardNodeId));
    if (event.key === 'Enter') {
      this.selectNode(nodes[currentIndex]);
      return;
    }
    const direction = forwardKeys.has(event.key) ? 1 : -1;
    const nextIndex = (currentIndex + direction + nodes.length) % nodes.length;
    this.selectNode(nodes[nextIndex]);
  }

  ensureBloomLayout(incidentId) {
    const incident = this.layout.baseNodeById.get(incidentId);
    const context = this.layout.bloomContext.get(incidentId);
    if (!incident || !context) return null;
    if (!this.bloomLayouts.has(incidentId)) {
      const layout = buildBloomLayout(incident, context, this.layout.nodeById, this.layout.edges);
      this.bloomLayouts.set(incidentId, layout);
      if (this.bloomWorker) {
        const requestId = `${incidentId}:${performance.now()}`;
        this.bloomWorkerRequests.set(requestId, incidentId);
        this.bloomWorker.postMessage({ requestId, incident, layout });
      }
    }
    this.lastBloomIncidentId = incidentId;
    return this.bloomLayouts.get(incidentId);
  }

  activeBloomIncidentId() {
    if (this.selection?.type === 'incident') return this.selection.value;
    const selectedNode = this.selection ? this.layout.nodeById.get(this.selection.value) : null;
    if (this.selection && (BLOOM_TIERS.has(this.selection.type) || BLOOM_TIERS.has(selectedNode?.tier))) {
      const incidentId = this.incidentIdForBloomNode(this.selection.value);
      if (incidentId) return incidentId;
    }
    if (this.selection) return null;
    if (this.camera.z < BLOOM_Z_THRESHOLD || this.focusReflow) return null;
    const worldCenter = { x: this.camera.cx, y: this.camera.cy };
    const nearest = this.layout.nodes
      .filter((node) => node.tier === 'incident')
      .reduce((best, node) => {
        const distance = Math.hypot(node.x - worldCenter.x, node.y - worldCenter.y);
        if (distance > 190 || (best && best.distance <= distance)) return best;
        return { node, distance };
      }, null);
    return nearest?.node?.id || null;
  }

  ensureSemanticBloom() {
    const incidentId = this.activeBloomIncidentId();
    if (incidentId) this.ensureBloomLayout(incidentId);
  }

  activeBloomLayout() {
    const incidentId = this.activeBloomIncidentId();
    return incidentId ? this.ensureBloomLayout(incidentId) : null;
  }

  incidentIdForBloomNode(nodeId) {
    for (const [incidentId, bloom] of this.bloomLayouts.entries()) {
      if (bloom.nodes.some((node) => node.id === nodeId)) return incidentId;
    }
    for (const [incidentId, context] of this.layout.bloomContext.entries()) {
      if (
        context.orgIds.includes(nodeId) ||
        context.packageIds.includes(nodeId) ||
        context.releaseIds.includes(nodeId) ||
        context.repositoryIds.includes(nodeId) ||
        context.maintainerIds.includes(nodeId) ||
        context.accountIds.includes(nodeId) ||
        context.supportingIds.includes(nodeId)
      ) return incidentId;
    }
    return null;
  }

  visibleGraph(forcedBloom = null) {
    const bloom = forcedBloom || this.activeBloomLayout();
    const baseNodes = this.visibleBaseNodes();
    const nodes = bloom ? [...baseNodes, ...bloom.nodes] : baseNodes;
    const visibleById = new Map(nodes.map((node) => [node.id, node]));
    const edges = this.layout.edges
      .filter((edge) => visibleById.has(edge.source) && visibleById.has(edge.target))
      .filter((edge) => {
        if (!bloom && (BLOOM_TIERS.has(edge.sourceNode?.tier) || BLOOM_TIERS.has(edge.targetNode?.tier))) return false;
        if (edge.type === 'SEEDED_BY') return Boolean(bloom);
        if (bloom?.edges.some((bloomEdge) => bloomEdge.id === edge.id)) return true;
        return BASE_DRAWABLE_TIERS.has(edge.sourceNode?.tier) && BASE_DRAWABLE_TIERS.has(edge.targetNode?.tier);
      })
      .map((edge) => ({ ...edge, sourceNode: visibleById.get(edge.source), targetNode: visibleById.get(edge.target) }));
    const bounds = bloom ? mergeBounds(boundsForNodes(baseNodes), bloom.bounds) : boundsForNodes(baseNodes);
    const quadtree = new SupplyChainQuadtree(bounds);
    nodes.forEach((node) => quadtree.insert(node));
    return { nodes, nodeById: visibleById, edges, bounds, quadtree };
  }

  getVisibleGraph() {
    return this.currentVisibleGraph || this.visibleGraph();
  }

  frameSelectedTechniqueWideShot(cluster = null) {
    if (this.selection?.type !== 'technique') return;
    const selectedNode = this.layout.nodeById.get(this.selection.value);
    const techniqueCluster = cluster || (selectedNode ? this.clusterFor(selectedNode) : []);
    if (!techniqueCluster.length) return;
    const fit = fitBounds(techniqueCluster, this.viewport, 300);
    this.setCameraTarget({ ...fit, z: Math.min(fit.z, 0.82) });
  }

  clusterFor(node) {
    const clusterIds = new Set([node.id]);
    let forcedBloom = null;
    if (node.tier === 'actor') {
      this.layout.edges.forEach((edge) => {
        if (edge.source === node.id) clusterIds.add(edge.target);
      });
    } else if (node.tier === 'campaign') {
      this.layout.edges.forEach((edge) => {
        if (edge.source === node.id) clusterIds.add(edge.target);
      });
    } else if (node.tier === 'incident') {
      this.layout.edges.forEach((edge) => {
        if (edge.type === 'INCIDENT_TECHNIQUE') return;
        if (edge.target === node.id) clusterIds.add(edge.source);
        if (edge.source === node.id) clusterIds.add(edge.target);
      });
      forcedBloom = this.ensureBloomLayout(node.id);
      forcedBloom?.nodes.forEach((item) => clusterIds.add(item.id));
    } else if (node.tier === 'technique') {
      this.layout.edges.forEach((edge) => {
        if (edge.source === node.id && edge.type === 'INCIDENT_TECHNIQUE') {
          clusterIds.add(edge.target);
          this.layout.edges.forEach((contextEdge) => {
            if (
              contextEdge.target === edge.target &&
              (contextEdge.type === 'ATTRIBUTED_TO_ACTOR' || contextEdge.type === 'RELATED_CAMPAIGN')
            ) {
              clusterIds.add(contextEdge.source);
            }
          });
        }
      });
    } else if (BLOOM_TIERS.has(node.tier)) {
      const incidentId = this.incidentIdForBloomNode(node.id);
      if (incidentId) {
        clusterIds.add(incidentId);
        forcedBloom = this.ensureBloomLayout(incidentId);
        forcedBloom?.nodes.forEach((item) => {
          if (item.id === node.id || item.tier === 'organization' || item.tier === 'package') clusterIds.add(item.id);
        });
        forcedBloom?.edges.forEach((edge) => {
          if (edge.type === 'SEEDED_BY' && (edge.source === node.id || edge.target === node.id)) {
            clusterIds.add(edge.source);
            clusterIds.add(edge.target);
          }
        });
      }
    }
    const visible = this.visibleGraph(forcedBloom);
    return visible.nodes.filter((item) => clusterIds.has(item.id));
  }

  updateReflowControl() {
    if (!this.reflowButton) return;
    const isTechnique = this.selection?.type === 'technique';
    this.reflowButton.disabled = !isTechnique;
    this.reflowButton.hidden = !isTechnique;
    this.reflowButton.setAttribute('aria-pressed', String(isTechnique && this.focusReflow));
    this.reflowButton.textContent = isTechnique && this.focusReflow ? 'Restore wide shot' : 'Focus reflow';
  }

  updateCaption(title, body) {
    if (this.captionTitle) this.captionTitle.textContent = title;
    if (this.captionBody) this.captionBody.textContent = body;
    if (this.status) this.status.textContent = title;
    if (this.description) this.description.textContent = `${title}. ${body}`;
  }

  syncPageSelection() {
    const active = this.pageSelection || { type: 'overview', value: 'recent' };
    this.root.dataset.graphSelectionType = active.type;
    this.root.dataset.graphSelectionValue = active.value;
    document.querySelectorAll('[data-graph-target-type][data-graph-target-value]').forEach((target) => {
      const targetType = target.dataset.graphTargetType;
      const targetValue = target.dataset.graphTargetValue;
      const isActive = targetType === active.type && targetValue === active.value;
      target.classList.toggle('graph-linked-active', isActive);
      if (isActive) target.setAttribute('aria-current', 'true');
      else target.removeAttribute('aria-current');
    });
    document.querySelectorAll('[data-sc-explore-enter], [data-sc-explore-exit]').forEach((link) => this.syncExploreLink(link));
    this.updateGraphUrl();
  }

  colorForNode(node) {
    if (this.selection && !this.selection.nodes?.has(node.id) && node.id !== this.selection.value) return SEVERITY_COLORS.muted;
    if (node.tier === 'incident') return SEVERITY_COLORS[node.sev] || SEVERITY_COLORS.default;
    if (node.tier === 'package') return node.aggregate ? SEVERITY_COLORS.muted : SEVERITY_COLORS[node.sev] || SEVERITY_COLORS.package;
    if (node.tier === 'technique') return SEVERITY_COLORS.technique;
    if (node.tier === 'organization') return SEVERITY_COLORS.organization;
    if (node.tier === 'release') return SEVERITY_COLORS.release;
    if (node.tier === 'repository') return SEVERITY_COLORS.repository;
    if (node.tier === 'maintainer') return SEVERITY_COLORS.maintainer;
    if (node.tier === 'account') return SEVERITY_COLORS.account;
    if (node.tier === 'supporting') return SEVERITY_COLORS.supporting;
    if (this.selection?.type === 'stage' && node.tier === 'incident') {
      return this.selection.nodes.has(node.id) ? SEVERITY_COLORS[node.sev] || SEVERITY_COLORS.default : SEVERITY_COLORS.muted;
    }
    if (this.selection?.type === 'technique' && node.tier === 'incident') {
      return this.selection.nodes.has(node.id) ? SEVERITY_COLORS[node.sev] || SEVERITY_COLORS.default : SEVERITY_COLORS.muted;
    }
    if (node.tier === 'actor') return SEVERITY_COLORS.actor;
    if (node.tier === 'campaign') return SEVERITY_COLORS.campaign;
    return SEVERITY_COLORS.default;
  }

  edgeAlpha(edge) {
    if (!this.selection) return edge.type === 'SEEDED_BY' ? 0.56 : 0.3;
    if (edge.type === 'SEEDED_BY') return edge.propagation_tier === 'causal' ? 0.82 : 0.5;
    if (this.selection.nodes?.has(edge.source) && this.selection.nodes?.has(edge.target)) return 0.76;
    if (this.selection.nodes?.has(edge.source) || this.selection.nodes?.has(edge.target)) return 0.48;
    return 0.035;
  }

  colorForEdge(edge) {
    if (edge.type === 'ATTRIBUTED_TO_ACTOR' || edge.type === 'RELATED_CAMPAIGN') return SEVERITY_COLORS.context;
    if (edge.type === 'INCIDENT_TECHNIQUE') return SEVERITY_COLORS.technique;
    if (edge.type === 'SEEDED_BY') return edge.propagation_tier === 'causal' ? SEVERITY_COLORS.propagation : SEVERITY_COLORS.muted;
    if (edge.type === 'PACKAGE_RELEASE' || edge.type === 'INCIDENT_AFFECTED_RELEASE') return SEVERITY_COLORS.propagation;
    if (edge.type.startsWith('AFFECTED_') || edge.type === 'COMPROMISED_ACCOUNT') return SEVERITY_COLORS.propagation;
    return SEVERITY_COLORS.context;
  }

  labelPriority(node) {
    if (node.id === this.keyboardNodeId) return 100;
    if (this.selection?.nodes?.has(node.id)) return 90;
    if (node.tier === 'actor' || node.tier === 'technique') return 72;
    if (node.tier === 'organization') return 62;
    if (node.tier === 'campaign') return 54;
    if (node.tier === 'incident') return 46;
    if (node.tier === 'package') return 34;
    if (node.tier === 'release') return 26;
    return 10;
  }

  labelCandidates(node) {
    const position = this.worldToScreen(this.displayNode(node));
    const text = shortNodeLabel(node);
    const width = Math.min(178, Math.max(52, String(text || '').length * 6.3 + 13));
    const height = 18;
    const anchors = [
      { anchorIndex: 0, x: 12, y: -7 },
      { anchorIndex: 1, x: -width - 12, y: -7 },
      { anchorIndex: 2, x: 12, y: 10 },
      { anchorIndex: 3, x: -width - 12, y: 10 },
      { anchorIndex: 4, x: -width / 2, y: -26 },
      { anchorIndex: 5, x: -width / 2, y: 16 },
    ];
    const previous = this.labelPlacements?.get(node.id);
    if (Number.isInteger(previous)) {
      const index = anchors.findIndex((anchor) => anchor.anchorIndex === previous);
      if (index > 0) anchors.unshift(anchors.splice(index, 1)[0]);
    }
    return anchors.map((offset) => ({
      anchorIndex: offset.anchorIndex,
      x: Math.round(position.x + offset.x),
      y: Math.round(position.y + offset.y),
      width,
      height,
    }));
  }

  shouldLabelNode(node) {
    if (node.aggregate) return true;
    if (node.id === this.keyboardNodeId || node.id === this.hoverNodeId || this.selection?.nodes?.has(node.id)) return true;
    if (node.tier === 'actor') return true;
    if (node.tier === 'campaign') return this.camera.z >= CAMPAIGN_LABEL_Z || this.selection?.type === 'campaign';
    if (node.tier === 'incident') return this.camera.z >= INCIDENT_LABEL_Z || this.selection?.type === 'incident';
    if (node.tier === 'technique') return this.selection?.value === node.id;
    if (BLOOM_TIERS.has(node.tier)) return this.camera.z >= DEEP_LABEL_Z && Boolean(node.bloom_parent);
    return false;
  }

  labelFits(candidate, occupied) {
    if (candidate.x < 8 || candidate.y < 8 || candidate.x + candidate.width > this.viewport.width - 8 || candidate.y + candidate.height > this.viewport.height - 8) {
      return false;
    }
    return !occupied.some((box) =>
      candidate.x < box.x + box.width + 6 &&
      candidate.x + candidate.width + 6 > box.x &&
      candidate.y < box.y + box.height + 6 &&
      candidate.y + candidate.height + 6 > box.y
    );
  }

  displayNode(node) {
    if (!this.focusReflow || this.selection?.type !== 'technique') return node;
    if (node.id === this.selection.value) return { ...node, x: this.camera.cx, y: this.camera.cy - 40 };
    if (!this.selection.nodes?.has(node.id) || node.tier !== 'incident') return node;
    const incidents = this.layout.nodes.filter((item) => this.selection.nodes.has(item.id) && item.tier === 'incident');
    const index = incidents.findIndex((item) => item.id === node.id);
    const angle = (index / Math.max(1, incidents.length)) * Math.PI * 2 - Math.PI / 2;
    const radius = 150 + Math.floor(index / 12) * 72;
    return {
      ...node,
      x: this.camera.cx + Math.cos(angle) * radius,
      y: this.camera.cy - 40 + Math.sin(angle) * radius,
    };
  }

  drawEdges() {
    const gl = this.gl;
    const values = [];
    const visible = this.getVisibleGraph();
    const pushSegment = (sourceNode, targetNode, color, alpha) => {
      values.push(sourceNode.x, sourceNode.y, color[0], color[1], color[2], alpha);
      values.push(targetNode.x, targetNode.y, color[0], color[1], color[2], alpha);
    };
    const pushCurve = (sourceNode, targetNode, color, alpha, dashed = false) => {
      const dx = targetNode.x - sourceNode.x;
      const dy = targetNode.y - sourceNode.y;
      const distance = Math.hypot(dx, dy) || 1;
      const bend = clamp(distance * 0.11, 18, 82);
      const normal = { x: -dy / distance, y: dx / distance };
      const control = {
        x: (sourceNode.x + targetNode.x) / 2 + normal.x * bend,
        y: (sourceNode.y + targetNode.y) / 2 + normal.y * bend,
      };
      const segments = 12;
      let previous = sourceNode;
      for (let index = 1; index <= segments; index += 1) {
        const t = index / segments;
        const a = (1 - t) * (1 - t);
        const b = 2 * (1 - t) * t;
        const c = t * t;
        const point = {
          x: a * sourceNode.x + b * control.x + c * targetNode.x,
          y: a * sourceNode.y + b * control.y + c * targetNode.y,
        };
        if (!dashed || index % 3 !== 0) pushSegment(previous, point, color, alpha);
        previous = point;
      }
    };
    visible.edges.forEach((edge) => {
      const alpha = this.edgeAlpha(edge);
      const color = this.colorForEdge(edge);
      const sourceNode = this.displayNode(edge.sourceNode);
      const targetNode = this.displayNode(edge.targetNode);
      pushCurve(sourceNode, targetNode, color, alpha, edge.type === 'SEEDED_BY' && edge.propagation_tier === 'temporal');
    });
    gl.useProgram(this.edgeProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.edgeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(values), gl.DYNAMIC_DRAW);
    const stride = 6 * 4;
    const position = gl.getAttribLocation(this.edgeProgram, 'a_position');
    const color = gl.getAttribLocation(this.edgeProgram, 'a_color');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, stride, 0);
    gl.enableVertexAttribArray(color);
    gl.vertexAttribPointer(color, 4, gl.FLOAT, false, stride, 2 * 4);
    gl.uniform2f(gl.getUniformLocation(this.edgeProgram, 'u_resolution'), this.canvas.width, this.canvas.height);
    gl.uniform3f(
      gl.getUniformLocation(this.edgeProgram, 'u_camera'),
      this.camera.cx,
      this.camera.cy,
      this.camera.z * this.viewport.dpr
    );
    gl.drawArrays(gl.LINES, 0, values.length / 6);
  }

  drawNodes() {
    const gl = this.gl;
    const values = [];
    this.getVisibleGraph().nodes.forEach((node) => {
      const displayNode = this.displayNode(node);
      const color = this.colorForNode(node);
      const selected = this.selection?.nodes?.has(node.id);
      values.push(
        displayNode.x,
        displayNode.y,
        color[0],
        color[1],
        color[2],
        color[3],
        selected ? node.radius * 2.5 : node.radius * 2,
        nodeShape(node)
      );
    });
    gl.useProgram(this.nodeProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.nodeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(values), gl.DYNAMIC_DRAW);
    const stride = 8 * 4;
    const position = gl.getAttribLocation(this.nodeProgram, 'a_position');
    const color = gl.getAttribLocation(this.nodeProgram, 'a_color');
    const size = gl.getAttribLocation(this.nodeProgram, 'a_size');
    const shape = gl.getAttribLocation(this.nodeProgram, 'a_shape');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, stride, 0);
    gl.enableVertexAttribArray(color);
    gl.vertexAttribPointer(color, 4, gl.FLOAT, false, stride, 2 * 4);
    gl.enableVertexAttribArray(size);
    gl.vertexAttribPointer(size, 1, gl.FLOAT, false, stride, 6 * 4);
    gl.enableVertexAttribArray(shape);
    gl.vertexAttribPointer(shape, 1, gl.FLOAT, false, stride, 7 * 4);
    gl.uniform2f(gl.getUniformLocation(this.nodeProgram, 'u_resolution'), this.canvas.width, this.canvas.height);
    gl.uniform3f(
      gl.getUniformLocation(this.nodeProgram, 'u_camera'),
      this.camera.cx,
      this.camera.cy,
      this.camera.z * this.viewport.dpr
    );
    gl.drawArrays(gl.POINTS, 0, values.length / 8);
  }

  drawLabels() {
    if (!this.labelPlacements) this.labelPlacements = new Map();
    const occupied = [];
    const nextPlacements = new Map();
    const labelNodes = this.getVisibleGraph().nodes
      .filter((node) => this.shouldLabelNode(node))
      .sort((a, b) => this.labelPriority(b) - this.labelPriority(a));
    const labels = [];
    for (const node of labelNodes) {
      const candidate = this.labelCandidates(node).find((item) => this.labelFits(item, occupied));
      if (!candidate) continue;
      occupied.push(candidate);
      nextPlacements.set(node.id, candidate.anchorIndex);
      labels.push({ node, ...candidate });
      if (labels.length >= 32) break;
    }
    this.labelPlacements = nextPlacements;
    const labelKey = labels.map((item) => [
      item.node.id,
      item.x,
      item.y,
      shortNodeLabel(item.node),
      this.selection?.nodes?.has(item.node.id) ? 'selected' : '',
      item.node.id === this.keyboardNodeId ? 'keyboard' : '',
      item.node.id === this.hoverNodeId ? 'hover' : '',
    ].join(':')).join('|');
    if (labelKey === this.lastLabelKey) return;
    this.lastLabelKey = labelKey;
    this.labelLayer.replaceChildren(
      ...labels.map((item) => {
        const label = document.createElement('span');
        label.className = [
          'sc-graph-label',
          `sc-graph-label-${item.node.tier}`,
          this.selection?.nodes?.has(item.node.id) ? 'sc-graph-label-selected' : '',
          item.node.id === this.keyboardNodeId ? 'sc-graph-label-keyboard' : '',
        ].filter(Boolean).join(' ');
        label.textContent = shortNodeLabel(item.node);
        label.style.transform = `translate(${item.x}px, ${item.y}px)`;
        return label;
      })
    );
  }

  frame() {
    if (this.destroyed || !document.body.contains(this.root)) {
      this.destroy();
      return;
    }
    this.camera = {
      cx: lerp(this.camera.cx, this.targetCamera.cx, this.reduceMotion ? 1 : 0.14),
      cy: lerp(this.camera.cy, this.targetCamera.cy, this.reduceMotion ? 1 : 0.14),
      z: lerp(this.camera.z, this.targetCamera.z, this.reduceMotion ? 1 : 0.16),
    };
    this.ensureSemanticBloom();
    this.currentVisibleGraph = this.visibleGraph();
    const gl = this.gl;
    gl.clearColor(0.019, 0.031, 0.047, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    this.drawEdges();
    this.drawNodes();
    this.drawLabels();
    this.currentVisibleGraph = null;
    this.animationFrame = requestAnimationFrame(() => this.frame());
  }
}

async function bootSupplyChainGraph() {
  const root = document.querySelector('[data-supply-chain-graph-root]');
  if (!root || root.dataset.graphBooted === 'true') return;
  root.dataset.graphBooted = 'true';
  try {
    const response = await fetch(GRAPH_DATA_URL, { credentials: 'same-origin' });
    if (!response.ok) throw new Error(`Graph payload fetch failed: ${response.status}`);
    const payload = await response.json();
    const graph = new SupplyChainGraph(root, payload);
    window.__threatpediaSupplyChainGraph = graph;
    root.dataset.graphStatus = 'ready';
  } catch (error) {
    root.dataset.graphStatus = 'failed';
    const status = root.querySelector('[data-sc-graph-status]');
    if (status) status.textContent = 'Graph unavailable';
    const description = root.querySelector('[data-sc-graph-description]');
    if (description) description.textContent = 'Supply Chain graph unavailable. Keyboard graph controls are not active.';
    console.error(error);
  }
}

bootSupplyChainGraph();
document.addEventListener('astro:page-load', bootSupplyChainGraph);
