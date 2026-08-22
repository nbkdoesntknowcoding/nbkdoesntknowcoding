/**
 * Draws a constellation whose *shape* is generated from the real graph's
 * aggregate structure — cluster count and edge density come from the live
 * counts, not from taste. It is an honest abstraction of 59k nodes, not a
 * literal plot of them, and the caption says so.
 */

import { rng, text, MONO, esc } from './svg.mjs';

function layout(nodeCount, clusterCount, density, seed) {
  const rand = rng(seed);
  const W = 470, H = 260;

  // Cluster centres on a jittered ring — mirrors how communities sit in the
  // real louvain output: a few dense cores, not a uniform cloud.
  const centres = Array.from({ length: clusterCount }, (_, i) => {
    const a = (i / clusterCount) * Math.PI * 2 + rand() * 0.5;
    const r = 52 + rand() * 58;
    return { x: W / 2 + Math.cos(a) * r, y: H / 2 + Math.sin(a) * r * 0.72 };
  });

  const nodes = Array.from({ length: nodeCount }, (_, i) => {
    const c = centres[i % clusterCount];
    const a = rand() * Math.PI * 2;
    const r = Math.pow(rand(), 0.65) * 34;
    return {
      i,
      cluster: i % clusterCount,
      x: c.x + Math.cos(a) * r,
      y: c.y + Math.sin(a) * r * 0.8,
      // Degree drives radius; a handful become visible hubs, as god-nodes do.
      deg: 0,
    };
  });

  const edges = [];
  const target = Math.round(nodeCount * density);
  let guard = 0;
  while (edges.length < target && guard++ < target * 40) {
    const a = Math.floor(rand() * nodeCount);
    // 80% intra-cluster, 20% bridging — clustered but not disconnected.
    const sameCluster = rand() < 0.8;
    const pool = nodes.filter((n) => (sameCluster ? n.cluster === nodes[a].cluster : n.cluster !== nodes[a].cluster));
    if (pool.length === 0) continue;
    const b = pool[Math.floor(rand() * pool.length)].i;
    if (a === b) continue;
    const key = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (edges.some((e) => e.key === key)) continue;
    edges.push({ key, a, b });
    nodes[a].deg++; nodes[b].deg++;
  }

  // A few relaxation passes so edges do not cross the frame in straight bars.
  for (let pass = 0; pass < 60; pass++) {
    for (const e of edges) {
      const p = nodes[e.a], q = nodes[e.b];
      const dx = q.x - p.x, dy = q.y - p.y;
      const d = Math.hypot(dx, dy) || 0.001;
      const f = (d - 26) * 0.012;
      p.x += (dx / d) * f; p.y += (dy / d) * f;
      q.x -= (dx / d) * f; q.y -= (dy / d) * f;
    }
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const p = nodes[i], q = nodes[j];
        const dx = q.x - p.x, dy = q.y - p.y;
        const d2 = dx * dx + dy * dy;
        if (d2 > 400 || d2 === 0) continue;
        const d = Math.sqrt(d2);
        const f = (14 - d) * 0.05;
        p.x -= (dx / d) * f; p.y -= (dy / d) * f;
        q.x += (dx / d) * f; q.y += (dy / d) * f;
      }
    }
  }

  // Relaxation contracts the whole cloud toward its centre, so the drawing
  // ends up a blob in the middle of an empty frame. Fit the final bounds to
  // the box instead of clamping — clamping only squashes the outliers.
  const pad = 16;
  const xs = nodes.map((n) => n.x), ys = nodes.map((n) => n.y);
  const x0 = Math.min(...xs), x1 = Math.max(...xs);
  const y0 = Math.min(...ys), y1 = Math.max(...ys);
  const sx = (W - pad * 2) / Math.max(x1 - x0, 1);
  const sy = (H - pad * 2) / Math.max(y1 - y0, 1);
  for (const n of nodes) {
    n.x = pad + (n.x - x0) * sx;
    n.y = pad + (n.y - y0) * sy;
  }

  return { nodes, edges, W, H };
}

export function constellation(stats, t, seed) {
  const clusters = Math.max(4, Math.min(9, Math.round(Math.log10(Math.max(stats.communities, 10)) * 2.2)));
  const density = Math.max(1.4, Math.min(4.2, stats.edges / Math.max(stats.nodes, 1)));
  const { nodes, edges } = layout(96, clusters, density, seed);
  const rand = rng(seed ^ 0x9e3779b9);

  const hubs = [...nodes].sort((a, b) => b.deg - a.deg).slice(0, 5);
  const hubSet = new Set(hubs.map((h) => h.i));
  const palette = [t.accent, t.blue, t.green, t.inkSoft];

  const edgeEls = edges.map((e, i) => {
    const p = nodes[e.a], q = nodes[e.b];
    const bridging = p.cluster !== q.cluster;
    const base = bridging ? 0.34 : 0.16;
    const dur = (7 + rand() * 9).toFixed(1);
    const delay = (rand() * 8).toFixed(1);
    return `<line x1="${p.x.toFixed(1)}" y1="${p.y.toFixed(1)}" x2="${q.x.toFixed(1)}" y2="${q.y.toFixed(1)}" stroke="${bridging ? t.accent : t.lineStrong}" stroke-width="${bridging ? 0.7 : 0.5}" opacity="${base}">`
      + `<animate attributeName="opacity" values="${base};${(base * 2.4).toFixed(2)};${base}" dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/></line>`;
  }).join('');

  const nodeEls = nodes.map((n) => {
    const hub = hubSet.has(n.i);
    const r = hub ? 3.4 : 1.1 + Math.min(n.deg, 6) * 0.28;
    const fill = hub ? t.accent : palette[n.cluster % palette.length];
    const op = hub ? 1 : 0.5 + Math.min(n.deg, 8) * 0.05;
    const dur = (5 + rand() * 7).toFixed(1);
    const dx = (rand() * 3 - 1.5).toFixed(1);
    const dy = (rand() * 3 - 1.5).toFixed(1);
    return `<circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="${r.toFixed(2)}" fill="${fill}" opacity="${op.toFixed(2)}">`
      + `<animateTransform attributeName="transform" type="translate" values="0 0;${dx} ${dy};0 0" dur="${dur}s" repeatCount="indefinite"/>`
      + (hub ? `<animate attributeName="r" values="${r};${(r * 1.45).toFixed(2)};${r}" dur="4.5s" repeatCount="indefinite"/>` : '')
      + `</circle>`;
  }).join('');

  // Halo behind the hubs so the eye lands on structure, not on noise.
  const haloEls = hubs.map((h, i) =>
    `<circle cx="${h.x.toFixed(1)}" cy="${h.y.toFixed(1)}" r="9" fill="none" stroke="${t.accent}" stroke-width="0.6" opacity="0.22">`
    + `<animate attributeName="r" values="7;18;7" dur="6s" begin="${(i * 1.1).toFixed(1)}s" repeatCount="indefinite"/>`
    + `<animate attributeName="opacity" values="0.28;0;0.28" dur="6s" begin="${(i * 1.1).toFixed(1)}s" repeatCount="indefinite"/></circle>`
  ).join('');

  return `<g>${edgeEls}${haloEls}${nodeEls}</g>`;
}
