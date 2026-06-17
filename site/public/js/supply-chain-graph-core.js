const GRAPH_DATA_URL = '/supply-chain-graph.json';
const BASE_DRAWABLE_TIERS = new Set(['actor', 'campaign', 'incident', 'technique']);
const BLOOM_TIERS = new Set(['organization', 'package', 'release']);
const BLOOM_NODE_BUDGET = 28;
const BLOOM_Z_THRESHOLD = 1.55;
const SEVERITY_COLORS = {
  critical: [1.0, 0.267, 0.267, 1],
  high: [1.0, 0.647, 0.0, 1],
  medium: [0.91, 0.627, 0.125, 1],
  low: [0.318, 0.812, 0.4, 1],
  actor: [1.0, 0.267, 0.267, 1],
  campaign: [0.91, 0.627, 0.125, 1],
  technique: [0.804, 0.835, 0.878, 1],
  organization: [0.49, 0.69, 1.0, 1],
  package: [0.318, 0.812, 0.4, 1],
  release: [0.804, 0.835, 0.878, 1],
  propagation: [1.0, 0.647, 0.0, 1],
  default: [0.804, 0.835, 0.878, 1],
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
  return 3;
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
  const centerX = incident.x + 280;
  const centerY = incident.y + 16;
  const visibleChildren = sortBloomNodes(
    [...context.orgIds, ...context.packageIds, ...context.releaseIds]
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
        radius: 8,
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
  const edgeTypes = new Set(['AFFECTED_ORGANIZATION', 'AFFECTED_PACKAGE', 'PACKAGE_RELEASE', 'INCIDENT_AFFECTED_RELEASE', 'SEEDED_BY']);
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
    { incidentId: incident.id, orgIds: [], packageIds: [], releaseIds: [] },
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

  const laneIds = Array.from(new Set([...actorNodes.map((node) => node.id), 'actor-unattributed']));
  const laneIndex = new Map(laneIds.map((id, index) => [id, index]));
  const minTime = Math.min(...incidentNodes.map((node) => dateNumber(node.time)).filter(Number.isFinite));
  const maxTime = Math.max(...incidentNodes.map((node) => dateNumber(node.time)).filter(Number.isFinite));
  const timeSpan = Math.max(1, maxTime - minTime);
  const xForTime = (value) => {
    const parsed = dateNumber(value);
    if (!Number.isFinite(parsed)) return 0;
    return ((parsed - minTime) / timeSpan) * 1600 - 800;
  };

  actorNodes.forEach((node) => {
    const lane = laneIndex.get(node.id) || 0;
    node.x = -980;
    node.y = lane * 190;
    node.radius = 18;
  });

  incidentNodes.forEach((node, index) => {
    const actorId = incidentActor.get(node.id) || 'actor-unattributed';
    const lane = laneIndex.get(actorId) ?? laneIndex.get('actor-unattributed') ?? 0;
    node.x = xForTime(node.time);
    node.y = lane * 190 + 72 + ((index % 3) - 1) * 18;
    node.radius = 10;
  });

  campaignNodes.forEach((node, index) => {
    const incidentChildren = incidentNodes.filter((incident) => incidentCampaign.get(incident.id) === node.id);
    if (incidentChildren.length > 0) {
      const actorId = incidentActor.get(incidentChildren[0].id) || 'actor-unattributed';
      const lane = laneIndex.get(actorId) || 0;
      node.x = incidentChildren.reduce((sum, child) => sum + child.x, 0) / incidentChildren.length;
      node.y = lane * 190 + 34;
    } else {
      node.x = -620 + index * 160;
      node.y = -120;
    }
    node.radius = 13;
  });

  techniqueNodes.forEach((node, index) => {
    const incidentChildren = payload.edges
      .filter((edge) => edge.type === 'INCIDENT_TECHNIQUE' && edge.source === node.id)
      .map((edge) => nodeById.get(edge.target))
      .filter(Boolean);
    if (incidentChildren.length > 0) {
      node.x = incidentChildren.reduce((sum, child) => sum + child.x, 0) / incidentChildren.length;
      node.y = -150 - (index % 3) * 36;
    } else {
      node.x = -760 + index * 120;
      node.y = -180;
    }
    node.radius = 12;
  });

  allNodes.forEach((node) => {
    if (node.x !== undefined && node.y !== undefined) return;
    node.x = 0;
    node.y = 0;
    node.radius = node.tier === 'release' ? 6 : node.tier === 'package' ? 8 : node.tier === 'organization' ? 12 : 9;
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
    this.focusReflow = false;
    this.keyboardNodeId = null;
    this.drag = null;
    this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.gl = this.canvas.getContext('webgl2', { antialias: true }) || this.canvas.getContext('webgl', { antialias: true });
    if (!this.gl) throw new Error('WebGL is not available');
    this.initWebGL();
    this.bind();
    this.resize();
    this.selectFromRoute();
    requestAnimationFrame(() => this.frame());
  }

  initWebGL() {
    const gl = this.gl;
    this.nodeProgram = createProgram(
      gl,
      `
        attribute vec2 a_position;
        attribute vec4 a_color;
        attribute float a_size;
        uniform vec2 u_resolution;
        uniform vec3 u_camera;
        varying vec4 v_color;
        void main() {
          vec2 screen = (a_position - u_camera.xy) * u_camera.z + u_resolution * 0.5;
          vec2 clip = (screen / u_resolution) * 2.0 - 1.0;
          gl_Position = vec4(clip * vec2(1.0, -1.0), 0.0, 1.0);
          gl_PointSize = a_size * u_camera.z;
          v_color = a_color;
        }
      `,
      `
        precision mediump float;
        varying vec4 v_color;
        void main() {
          vec2 center = gl_PointCoord - vec2(0.5);
          float d = length(center);
          if (d > 0.5) discard;
          float ring = smoothstep(0.47, 0.5, d);
          vec4 fill = vec4(v_color.rgb, v_color.a * 0.72);
          vec4 edge = vec4(v_color.rgb, 1.0);
          gl_FragColor = mix(fill, edge, ring);
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
    const resizeObserver = new ResizeObserver(() => this.resize());
    resizeObserver.observe(this.root);
    this.canvas.addEventListener('pointerdown', (event) => {
      this.canvas.setPointerCapture(event.pointerId);
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
      if (!this.drag) return;
      const dx = event.clientX - this.drag.x;
      const dy = event.clientY - this.drag.y;
      if (Math.hypot(dx, dy) > 3) this.drag.moved = true;
      this.setCameraTarget({
        ...this.targetCamera,
        cx: this.drag.startCx - dx / this.targetCamera.z,
        cy: this.drag.startCy - dy / this.targetCamera.z,
      });
    });
    this.canvas.addEventListener('pointerup', (event) => {
      const drag = this.drag;
      this.drag = null;
      if (!drag || drag.moved) return;
      const node = this.pick(event.clientX, event.clientY);
      if (node) this.selectNode(node);
    });
    this.canvas.addEventListener('wheel', (event) => {
      event.preventDefault();
      const zoomFactor = Math.exp(-event.deltaY * 0.001);
      this.setCameraTarget({ ...this.targetCamera, z: clamp(this.targetCamera.z * zoomFactor, 0.22, 3.4) });
      this.ensureSemanticBloom();
    }, { passive: false });
    this.reflowButton?.addEventListener('click', () => {
      if (this.selection?.type !== 'technique') return;
      this.focusReflow = !this.focusReflow;
      if (!this.focusReflow) this.frameSelectedTechniqueWideShot();
      this.reflowButton.setAttribute('aria-pressed', String(this.focusReflow));
      this.reflowButton.textContent = this.focusReflow ? 'Restore wide shot' : 'Focus reflow';
    });
    document.addEventListener('click', (event) => {
      const commandTarget = event.target.closest('[data-graph-command][data-graph-value]');
      if (!commandTarget) return;
      const command = commandTarget.dataset.graphCommand;
      const value = commandTarget.dataset.graphValue;
      if (command === 'select-incident') this.selectByEntityId('incident', value);
      if (command === 'select-actor') this.selectByEntityId('actor', value);
      if (command === 'filter-stage') this.filterStage(value);
    });
    document.addEventListener('astro:page-load', () => this.selectFromRoute());
    this.root.addEventListener('keydown', (event) => this.handleKeydown(event));
  }

  resize() {
    const rect = this.root.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    this.viewport = { width: Math.max(1, rect.width), height: Math.max(1, rect.height), dpr };
    this.canvas.width = Math.floor(this.viewport.width * dpr);
    this.canvas.height = Math.floor(this.viewport.height * dpr);
    this.canvas.style.width = `${this.viewport.width}px`;
    this.canvas.style.height = `${this.viewport.height}px`;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    if (!this.hasInitialFrame) {
      this.setCameraTarget(fitBounds(this.recentNodes(), this.viewport), true);
      this.hasInitialFrame = true;
    }
  }

  recentNodes() {
    const incidents = this.layout.nodes
      .filter((node) => node.tier === 'incident')
      .sort((a, b) => String(b.time || '').localeCompare(String(a.time || '')))
      .slice(0, 16);
    const relatedIds = new Set(incidents.map((node) => node.id));
    this.layout.edges.forEach((edge) => {
      if (relatedIds.has(edge.target)) relatedIds.add(edge.source);
      if (relatedIds.has(edge.source)) relatedIds.add(edge.target);
    });
    return this.layout.nodes.filter((node) => relatedIds.has(node.id));
  }

  activeBounds() {
    const bloom = this.activeBloomLayout();
    return bloom ? mergeBounds(this.layout.bounds, bloom.bounds) : this.layout.bounds;
  }

  setCameraTarget(target, immediate = false) {
    const z = clamp(target.z, 0.22, 3.4);
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

  screenToWorld(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left - this.viewport.width / 2) / this.camera.z + this.camera.cx,
      y: (clientY - rect.top - this.viewport.height / 2) / this.camera.z + this.camera.cy,
    };
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
    const hero = document.querySelector('[data-graph-selection-type][data-graph-selection-value]');
    const type = hero?.dataset.graphSelectionType;
    const value = hero?.dataset.graphSelectionValue;
    if (type === 'incident') {
      if (!this.selectByEntityId('incident', value)) this.showOverview();
    } else if (type && type !== 'overview') {
      const normalizedType = type.replace(/\s+/g, '_');
      if (!this.selectByEntityId(normalizedType, value)) this.selectEntityContext(normalizedType, value);
    } else {
      this.showOverview();
    }
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
    this.setCameraTarget(fitBounds(incidentNodes, this.viewport, 180));
    this.updateCaption(
      entity?.label || value,
      `${incidentNodes.length} connected incident${incidentNodes.length === 1 ? '' : 's'} framed for this entity.`
    );
  }

  showOverview() {
    this.selection = null;
    this.keyboardNodeId = null;
    this.lastBloomIncidentId = null;
    this.setCameraTarget(fitBounds(this.recentNodes(), this.viewport));
    this.updateCaption(
      'Supply Chain Graph',
      `${this.payload.nodes.length} corpus nodes and ${this.payload.edges.length} typed edges loaded.`
    );
  }

  filterStage(stage) {
    const nodes = this.layout.nodes.filter((node) => node.tier === 'incident' && node.attack_stage === stage);
    if (nodes.length === 0) return;
    this.selection = { type: 'stage', value: stage, nodes: new Set(nodes.map((node) => node.id)) };
    this.keyboardNodeId = nodes[0]?.id || null;
    this.focusReflow = false;
    this.lastBloomIncidentId = null;
    this.updateReflowControl();
    this.setCameraTarget(fitBounds(nodes, this.viewport));
    this.updateCaption(`Attack stage: ${stage.replace(/_/g, ' ')}`, `${nodes.length} incident${nodes.length === 1 ? '' : 's'} selected.`);
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
    if (this.selection && BLOOM_TIERS.has(this.selection.type)) {
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
      if (context.orgIds.includes(nodeId) || context.packageIds.includes(nodeId) || context.releaseIds.includes(nodeId)) return incidentId;
    }
    return null;
  }

  visibleGraph(forcedBloom = null) {
    const bloom = forcedBloom || this.activeBloomLayout();
    const nodes = bloom ? [...this.layout.nodes, ...bloom.nodes] : this.layout.nodes;
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
    const bounds = bloom ? mergeBounds(this.layout.bounds, bloom.bounds) : this.layout.bounds;
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

  colorForNode(node) {
    if (node.tier === 'technique') return SEVERITY_COLORS.technique;
    if (node.tier === 'organization') return SEVERITY_COLORS.organization;
    if (node.tier === 'package') return node.aggregate ? SEVERITY_COLORS.muted : SEVERITY_COLORS.package;
    if (node.tier === 'release') return SEVERITY_COLORS.release;
    if (this.selection?.type === 'stage' && node.tier === 'incident') {
      return this.selection.nodes.has(node.id) ? SEVERITY_COLORS[node.sev] || SEVERITY_COLORS.default : SEVERITY_COLORS.muted;
    }
    if (this.selection?.type === 'technique' && node.tier === 'incident') {
      return this.selection.nodes.has(node.id) ? SEVERITY_COLORS[node.sev] || SEVERITY_COLORS.default : SEVERITY_COLORS.muted;
    }
    if (node.tier === 'actor') return SEVERITY_COLORS.actor;
    if (node.tier === 'campaign') return SEVERITY_COLORS.campaign;
    return SEVERITY_COLORS[node.sev] || SEVERITY_COLORS.default;
  }

  edgeAlpha(edge) {
    if (!this.selection) return 0.28;
    if (edge.type === 'SEEDED_BY') return edge.propagation_tier === 'causal' ? 0.78 : 0.42;
    if (this.selection.nodes?.has(edge.source) || this.selection.nodes?.has(edge.target)) return 0.64;
    return 0.1;
  }

  colorForEdge(edge) {
    if (edge.type === 'ATTRIBUTED_TO_ACTOR') return SEVERITY_COLORS.high;
    if (edge.type === 'INCIDENT_TECHNIQUE') return SEVERITY_COLORS.technique;
    if (edge.type === 'SEEDED_BY') return edge.propagation_tier === 'causal' ? SEVERITY_COLORS.propagation : SEVERITY_COLORS.muted;
    if (edge.type === 'PACKAGE_RELEASE' || edge.type === 'INCIDENT_AFFECTED_RELEASE') return SEVERITY_COLORS.release;
    if (edge.type === 'AFFECTED_ORGANIZATION' || edge.type === 'AFFECTED_PACKAGE') return SEVERITY_COLORS.package;
    return SEVERITY_COLORS.medium;
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
    const width = Math.min(220, Math.max(68, String(node.label || '').length * 7.4 + 16));
    const height = 24;
    const anchors = [
      { anchorIndex: 0, x: 12, y: -10 },
      { anchorIndex: 1, x: -width - 12, y: -10 },
      { anchorIndex: 2, x: 12, y: 14 },
      { anchorIndex: 3, x: -width - 12, y: 14 },
      { anchorIndex: 4, x: -width / 2, y: -34 },
      { anchorIndex: 5, x: -width / 2, y: 20 },
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
    visible.edges.forEach((edge) => {
      const alpha = this.edgeAlpha(edge);
      const color = this.colorForEdge(edge);
      const sourceNode = this.displayNode(edge.sourceNode);
      const targetNode = this.displayNode(edge.targetNode);
      if (edge.type === 'SEEDED_BY' && edge.propagation_tier === 'temporal') {
        const segments = 10;
        for (let index = 0; index < segments; index += 2) {
          const a = index / segments;
          const b = (index + 1) / segments;
          pushSegment(
            { x: lerp(sourceNode.x, targetNode.x, a), y: lerp(sourceNode.y, targetNode.y, a) },
            { x: lerp(sourceNode.x, targetNode.x, b), y: lerp(sourceNode.y, targetNode.y, b) },
            color,
            alpha
          );
        }
      } else {
        pushSegment(sourceNode, targetNode, color, alpha);
      }
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
        selected ? node.radius * 2.5 : node.radius * 2
      );
    });
    gl.useProgram(this.nodeProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.nodeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(values), gl.DYNAMIC_DRAW);
    const stride = 7 * 4;
    const position = gl.getAttribLocation(this.nodeProgram, 'a_position');
    const color = gl.getAttribLocation(this.nodeProgram, 'a_color');
    const size = gl.getAttribLocation(this.nodeProgram, 'a_size');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, stride, 0);
    gl.enableVertexAttribArray(color);
    gl.vertexAttribPointer(color, 4, gl.FLOAT, false, stride, 2 * 4);
    gl.enableVertexAttribArray(size);
    gl.vertexAttribPointer(size, 1, gl.FLOAT, false, stride, 6 * 4);
    gl.uniform2f(gl.getUniformLocation(this.nodeProgram, 'u_resolution'), this.canvas.width, this.canvas.height);
    gl.uniform3f(
      gl.getUniformLocation(this.nodeProgram, 'u_camera'),
      this.camera.cx,
      this.camera.cy,
      this.camera.z * this.viewport.dpr
    );
    gl.drawArrays(gl.POINTS, 0, values.length / 7);
  }

  drawLabels() {
    if (!this.labelPlacements) this.labelPlacements = new Map();
    const occupied = [];
    const nextPlacements = new Map();
    const labelNodes = this.getVisibleGraph().nodes
      .filter((node) => {
        if (node.aggregate) return true;
        if (node.tier === 'actor' || node.tier === 'campaign') return true;
        if (node.tier === 'organization' && node.bloom_parent) return true;
        if (node.tier === 'technique' && this.selection?.value === node.id) return true;
        return this.selection?.nodes?.has(node.id) || node.id === this.keyboardNodeId;
      })
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
    const labelKey = labels.map((item) => `${item.node.id}:${item.x}:${item.y}`).join('|');
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
        label.textContent = item.node.label;
        label.style.transform = `translate(${item.x}px, ${item.y}px)`;
        return label;
      })
    );
  }

  frame() {
    this.camera = {
      cx: lerp(this.camera.cx, this.targetCamera.cx, this.reduceMotion ? 1 : 0.14),
      cy: lerp(this.camera.cy, this.targetCamera.cy, this.reduceMotion ? 1 : 0.14),
      z: lerp(this.camera.z, this.targetCamera.z, this.reduceMotion ? 1 : 0.16),
    };
    this.ensureSemanticBloom();
    this.currentVisibleGraph = this.visibleGraph();
    const gl = this.gl;
    gl.clearColor(0.031, 0.043, 0.063, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    this.drawEdges();
    this.drawNodes();
    this.drawLabels();
    this.currentVisibleGraph = null;
    requestAnimationFrame(() => this.frame());
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
