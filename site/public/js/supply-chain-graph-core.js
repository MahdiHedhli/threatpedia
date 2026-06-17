const GRAPH_DATA_URL = '/supply-chain-graph.json';
const DRAWABLE_TIERS = new Set(['actor', 'campaign', 'incident', 'technique']);
const SEVERITY_COLORS = {
  critical: [1.0, 0.267, 0.267, 1],
  high: [1.0, 0.647, 0.0, 1],
  medium: [0.91, 0.627, 0.125, 1],
  low: [0.318, 0.812, 0.4, 1],
  actor: [1.0, 0.267, 0.267, 1],
  campaign: [0.91, 0.627, 0.125, 1],
  technique: [0.804, 0.835, 0.878, 1],
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
  return 3;
}

function isG2DrawableNode(node) {
  return DRAWABLE_TIERS.has(node?.tier);
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

function buildLayout(payload) {
  const drawableNodes = payload.nodes.filter(isG2DrawableNode);
  const nodeById = new Map(drawableNodes.map((node) => [node.id, { ...node }]));
  const incidentNodes = drawableNodes.filter((node) => node.tier === 'incident');
  const actorNodes = drawableNodes.filter((node) => node.tier === 'actor');
  const campaignNodes = drawableNodes.filter((node) => node.tier === 'campaign');
  const techniqueNodes = drawableNodes.filter((node) => node.tier === 'technique');
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
    const lane = laneIndex.get(actorId) || laneIndex.get('actor-unattributed') || 0;
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

  const laidOutNodes = Array.from(nodeById.values()).sort((a, b) => tierRank(a.tier) - tierRank(b.tier));
  const laidOutById = new Map(laidOutNodes.map((node) => [node.id, node]));
  const edges = payload.edges
    .filter((edge) => laidOutById.has(edge.source) && laidOutById.has(edge.target))
    .map((edge) => ({ ...edge, sourceNode: laidOutById.get(edge.source), targetNode: laidOutById.get(edge.target) }));
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
  return { nodes: laidOutNodes, nodeById: laidOutById, edges, bounds, quadtree };
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
    this.reflowButton = root.querySelector('[data-sc-graph-focus-reflow]');
    this.viewport = { width: 1, height: 1, dpr: 1 };
    this.layout = buildLayout(payload);
    this.camera = { cx: 0, cy: 0, z: 1 };
    this.targetCamera = { cx: 0, cy: 0, z: 1 };
    this.selection = null;
    this.focusReflow = false;
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
    }, { passive: false });
    this.reflowButton?.addEventListener('click', () => {
      if (this.selection?.type !== 'technique') return;
      this.focusReflow = !this.focusReflow;
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

  setCameraTarget(target, immediate = false) {
    const z = clamp(target.z, 0.22, 3.4);
    const halfWidth = this.viewport.width / z / 2;
    const halfHeight = this.viewport.height / z / 2;
    const bounds = this.layout.bounds;
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
    const nearest = this.layout.quadtree.nearest(world.x, world.y, radius);
    return nearest?.point || null;
  }

  selectFromRoute() {
    const hero = document.querySelector('[data-graph-selection-type][data-graph-selection-value]');
    const type = hero?.dataset.graphSelectionType;
    const value = hero?.dataset.graphSelectionValue;
    if (type === 'incident') this.selectByEntityId('incident', value);
    else if (type && type !== 'overview') this.selectByEntityId(type.replace(/\s+/g, '_'), value);
  }

  selectByEntityId(type, value) {
    const normalizedType = type === 'threat actor' || type === 'threat_actor' ? 'actor' : type;
    const node = this.layout.nodes.find(
      (item) => item.type === normalizedType && (item.id === value || item.entity_id === value)
    );
    if (node) this.selectNode(node);
  }

  filterStage(stage) {
    const nodes = this.layout.nodes.filter((node) => node.tier === 'incident' && node.attack_stage === stage);
    if (nodes.length === 0) return;
    this.selection = { type: 'stage', value: stage, nodes: new Set(nodes.map((node) => node.id)) };
    this.focusReflow = false;
    this.updateReflowControl();
    this.setCameraTarget(fitBounds(nodes, this.viewport));
    this.updateCaption(`Attack stage: ${stage.replace(/_/g, ' ')}`, `${nodes.length} incident${nodes.length === 1 ? '' : 's'} selected.`);
  }

  selectNode(node) {
    this.focusReflow = false;
    const cluster = this.clusterFor(node);
    const selectionNodes =
      node.tier === 'technique'
        ? cluster.filter((item) => item.tier === 'technique' || item.tier === 'incident').map((item) => item.id)
        : [node.id];
    this.selection = { type: node.type, value: node.id, nodes: new Set(selectionNodes) };
    const fit = fitBounds(cluster, this.viewport, node.tier === 'technique' ? 300 : node.tier === 'incident' ? 170 : 140);
    this.setCameraTarget(node.tier === 'technique' ? { ...fit, z: Math.min(fit.z, 0.82) } : fit);
    this.updateCaption(node.label, node.summary || `${node.type.replace(/_/g, ' ')} node selected.`);
    this.updateReflowControl();
  }

  clusterFor(node) {
    const clusterIds = new Set([node.id]);
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
        if (edge.target === node.id) clusterIds.add(edge.source);
        if (edge.source === node.id) clusterIds.add(edge.target);
      });
    } else if (node.tier === 'technique') {
      this.layout.edges.forEach((edge) => {
        if (edge.source === node.id && edge.type === 'INCIDENT_TECHNIQUE') {
          clusterIds.add(edge.target);
          this.layout.edges.forEach((contextEdge) => {
            if (contextEdge.target === edge.target) clusterIds.add(contextEdge.source);
          });
        }
      });
    }
    return this.layout.nodes.filter((item) => clusterIds.has(item.id));
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
  }

  colorForNode(node) {
    if (node.tier === 'technique') return SEVERITY_COLORS.technique;
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
    if (this.selection.nodes?.has(edge.source) || this.selection.nodes?.has(edge.target)) return 0.64;
    return 0.1;
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
    this.layout.edges.forEach((edge) => {
      const alpha = this.edgeAlpha(edge);
      const color =
        edge.type === 'ATTRIBUTED_TO_ACTOR'
          ? SEVERITY_COLORS.high
          : edge.type === 'INCIDENT_TECHNIQUE'
            ? SEVERITY_COLORS.technique
            : SEVERITY_COLORS.medium;
      const sourceNode = this.displayNode(edge.sourceNode);
      const targetNode = this.displayNode(edge.targetNode);
      values.push(sourceNode.x, sourceNode.y, color[0], color[1], color[2], alpha);
      values.push(targetNode.x, targetNode.y, color[0], color[1], color[2], alpha);
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
    this.layout.nodes.forEach((node) => {
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
    const labelNodes = this.layout.nodes.filter(
      (node) => node.tier === 'actor' || node.tier === 'technique' || node.tier === 'campaign' || this.selection?.nodes?.has(node.id)
    );
    this.labelLayer.replaceChildren(
      ...labelNodes.slice(0, 24).map((node) => {
        const position = this.worldToScreen(this.displayNode(node));
        const label = document.createElement('span');
        label.className = `sc-graph-label sc-graph-label-${node.tier}`;
        label.textContent = node.label;
        label.style.transform = `translate(${Math.round(position.x + 12)}px, ${Math.round(position.y - 10)}px)`;
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
    const gl = this.gl;
    gl.clearColor(0.031, 0.043, 0.063, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    this.drawEdges();
    this.drawNodes();
    this.drawLabels();
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
    console.error(error);
  }
}

bootSupplyChainGraph();
document.addEventListener('astro:page-load', bootSupplyChainGraph);
