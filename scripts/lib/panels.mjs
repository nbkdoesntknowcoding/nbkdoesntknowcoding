/**
 * The three panels, each rendered once per theme from the same snapshot.
 *
 * A panel whose source is stale draws a visible band saying so. There is no
 * mode in which a panel silently shows yesterday's number as though it were
 * today's — that is the exact failure this codebase is allergic to.
 */

import { text, card, doc, clamp, seedFrom } from './svg.mjs';
import { constellation } from './graph-art.mjs';

const n = (x) => Number(x ?? 0).toLocaleString('en-US');
const usd = (x) => `$${Number(x ?? 0).toFixed(0)}`;
const day = (iso) => (iso ? iso.slice(0, 10) : '—');

function staleBand(y, t, sources) {
  const bad = Object.entries(sources).filter(([, s]) => s.stale);
  if (bad.length === 0) return '';
  const label = bad.map(([k, s]) => `${k}:${s.reason}`).join('  ');
  return `<g><rect x="20" y="${y}" width="840" height="22" rx="6" fill="none" stroke="${t.red}" stroke-width="0.8" opacity="0.7"/>`
    + text(32, y + 15, `STALE — ${clamp(label, 92)}`, { fill: t.red, size: 10, spacing: '0.06em' })
    + `</g>`;
}

/* ── hero ─────────────────────────────────────────────────────────────── */

export function hero(snap, t) {
  const g = snap.sources.graph.data;
  const stale = snap.sources.graph.stale;
  const seed = seedFrom(`${g?.nodes ?? 0}:${g?.edges ?? 0}:${g?.communities ?? 0}`);

  const art = g
    ? `<g transform="translate(392,20)">${constellation(g, t, seed)}</g>`
    : `<g transform="translate(392,20)">${text(235, 130, 'graph unavailable', { fill: t.red, size: 12, anchor: 'middle' })}</g>`;

  const stats = [
    ['NODES', g ? n(g.nodes) : '—'],
    ['EDGES', g ? n(g.edges) : '—'],
    ['CLUSTERS', g ? n(g.communities) : '—'],
  ];
  const statEls = stats.map(([k, v], i) => {
    const x = 32 + i * 116;
    return text(x, 214, k, { fill: t.inkFaint, size: 9, spacing: '0.14em' })
      + text(x, 236, v, { fill: t.ink, size: 19, weight: 600 });
  }).join('');

  return doc(880, 300, t, [
    art,
    text(32, 52, 'THE BORING PEOPLE  ·  BENGALURU', { fill: t.accent, size: 9.5, spacing: '0.18em' }),
    text(32, 96, 'nbkdoesntknowcoding', { fill: t.ink, size: 27, weight: 600 }),
    text(32, 128, 'The handle is a joke. The graph on the right is not.', { fill: t.inkSoft, size: 12.5, mono: false }),
    text(32, 152, 'I build context infrastructure for AI agents —', { fill: t.inkMuted, size: 12.5, mono: false }),
    text(32, 172, 'then point a fleet of them back at the codebase.', { fill: t.inkMuted, size: 12.5, mono: false }),
    statEls,
    text(32, 268, g ? `live knowledge graph · rebuilt ${day(g.builtAt)}` : 'live knowledge graph · unavailable', {
      fill: t.inkFaint, size: 9.5, spacing: '0.06em',
    }),
    text(848, 268, 'structure from live cluster + density stats', { fill: t.inkFaint, size: 9, anchor: 'end' }),
    stale ? staleBand(6, t, { graph: snap.sources.graph }) : '',
  ].join('\n'));
}

/* ── receipts ─────────────────────────────────────────────────────────── */

export function receipts(snap, t) {
  const pub = snap.sources.publicGraph.data;
  const auth = snap.sources.authored.data;
  const sh = snap.sources.shipped30d.data;

  const shown = pub?.total ?? 0;
  const real = auth?.prsMerged ?? 0;
  const max = Math.max(shown, real, 1);
  const BAR_X = 32, BAR_W = 460;

  /** The value sits inside the bar when the bar is long enough to hold it, and
   *  outside when it is not. A fixed position would either collide with the
   *  stats card at x=576 or float in the middle of an empty track. */
  const bar = (y, label, value, colour, sub, onColour) => {
    const w = Math.max(2, (value / max) * BAR_W);
    const label_w = String(n(value)).length * 9 + sub.length * 6 + 26;
    const inside = w > label_w;
    const tx = inside ? BAR_X + w - 12 : BAR_X + w + 12;
    const anchor = inside ? 'end' : undefined;
    const vFill = inside ? onColour : t.ink;
    const sx = inside ? tx - String(n(value)).length * 9 - 10 : tx + String(n(value)).length * 9 + 10;
    return text(BAR_X, y - 10, label, { fill: t.inkMuted, size: 10, spacing: '0.1em' })
      + `<rect x="${BAR_X}" y="${y}" width="${BAR_W}" height="26" rx="5" fill="${t.surface2}"/>`
      // The bar is drawn at its final width. It used to grow from width="0"
      // via SMIL, which meant that wherever the animation did not run — an
      // <img>-embedded SVG, which is exactly how a README loads it — the bar
      // rendered as an empty track and the panel silently showed nothing.
      + `<rect x="${BAR_X}" y="${y}" width="${w.toFixed(1)}" height="26" rx="5" fill="${colour}" opacity="0.92"/>`
      + text(tx, y + 18, n(value), { fill: vFill, size: 15, weight: 600, anchor })
      + text(sx, y + 18, sub, { fill: inside ? vFill : t.inkFaint, size: 10, anchor, opacity: inside ? 0.75 : 1 });
  };

  const cells = [
    ['ACTIVE DAYS SHOWN', pub ? `${pub.activeDays}/${pub.daysInWindow}` : '—'],
    ['PRs AUTHORED', auth ? n(auth.prsAllTime) : '—'],
    ['MERGED, 30d', sh ? n(sh.merged) : '—'],
    ['SPEND, 30d', sh ? usd(sh.costUsd) : '—'],
  ];
  const cellEls = cells.map(([k, v], i) => {
    const x = 596, y = 64 + i * 44;
    return text(x, y, k, { fill: t.inkFaint, size: 8.5, spacing: '0.14em' })
      + text(x, y + 22, v, { fill: t.ink, size: 17, weight: 600 });
  }).join('');

  return doc(880, 268, t, [
    card(576, 40, 272, 196, t, 10),
    text(32, 40, 'THE CONTRIBUTION GRAPH IS NOT THE WORK', { fill: t.accent, size: 10, spacing: '0.16em' }),
    bar(84, 'WHAT A LOGGED-OUT VISITOR SEES', shown, t.inkMuted, 'contributions', t.canvas),
    bar(152, 'PULL REQUESTS ACTUALLY MERGED', real, t.accent, 'merged', t.canvas),
    cellEls,
    text(32, 216, 'Left number is scraped anonymously from the public contributions page.', { fill: t.inkMuted, size: 10.5, mono: false }),
    text(32, 234, 'Right number comes from the authenticated search API, which can see private repos.', { fill: t.inkMuted, size: 10.5, mono: false }),
    text(32, 254, 'Same year. Same person. Two sources, on purpose.', { fill: t.inkFaint, size: 10.5, mono: false }),
    staleBand(6, t, {
      contributions: snap.sources.publicGraph,
      authored: snap.sources.authored,
      shipped: snap.sources.shipped30d,
    }),
  ].join('\n'));
}

/* ── ship log ─────────────────────────────────────────────────────────── */

export function shiplog(snap, t, rows = 8) {
  const ships = (snap.sources.ships.data ?? []).slice(0, rows);
  const H = 74 + rows * 26;

  const lines = ships.map((s, i) => {
    const y = 84 + i * 26;
    const repo = s.repo.split('/')[1];
    const withheld = s.title === null;
    const label = withheld
      ? `${s.type}(…) — title withheld, private repo`
      : clamp(s.title, 74);
    return text(32, y, day(s.mergedAt), { fill: t.inkFaint, size: 10.5 })
      + text(120, y, clamp(repo, 15), { fill: t.blue, size: 10.5 })
      + text(248, y, label, { fill: withheld ? t.inkFaint : t.inkSoft, size: 11 })
      + (s.task ? text(848, y, s.task, { fill: t.green, size: 10, anchor: 'end' }) : '');
  }).join('');

  const empty = ships.length === 0
    ? text(32, 92, 'no merges retrieved — reported as empty rather than padded', { fill: t.red, size: 11 })
    : '';

  return doc(880, H, t, [
    text(32, 40, 'SHIP LOG', { fill: t.accent, size: 10, spacing: '0.16em' }),
    text(848, 40, 'newest first', { fill: t.inkFaint, size: 9.5, anchor: 'end' }),
    `<line x1="32" y1="56" x2="848" y2="56" stroke="${t.line}"/>`,
    text(32, 72, 'MERGED', { fill: t.inkFaint, size: 8.5, spacing: '0.14em' }),
    text(120, 72, 'REPO', { fill: t.inkFaint, size: 8.5, spacing: '0.14em' }),
    text(248, 72, 'WHAT', { fill: t.inkFaint, size: 8.5, spacing: '0.14em' }),
    text(848, 72, 'TASK', { fill: t.inkFaint, size: 8.5, spacing: '0.14em', anchor: 'end' }),
    lines,
    empty,
    staleBand(6, t, { ships: snap.sources.ships }),
  ].join('\n'));
}
