/**
 * SVG helpers. Everything renders twice — once per GitHub theme — because a
 * README <img> cannot read GitHub's theme toggle; only a <picture> with a
 * prefers-color-scheme <source> can pick between two files.
 *
 * Palette is lifted from apps/web/src/styles/tokens.css so the profile and the
 * product look like the same hand made them.
 */

export const THEMES = {
  dark: {
    name: 'dark',
    canvas: '#0A0B0D',
    surface: '#131418',
    surface2: '#1A1C20',
    line: 'rgba(255,255,255,0.08)',
    lineStrong: 'rgba(255,255,255,0.16)',
    ink: '#F4F5F7',
    inkSoft: '#B8BCC4',
    inkMuted: '#6E737C',
    inkFaint: '#3F434B',
    accent: '#FFB370',
    green: '#6BE39B',
    blue: '#7C9CFF',
    red: '#FF7A8A',
  },
  light: {
    name: 'light',
    canvas: '#FFFFFF',
    surface: '#F7F7F5',
    surface2: '#F1F1EE',
    line: 'rgba(10,11,13,0.10)',
    lineStrong: 'rgba(10,11,13,0.18)',
    ink: '#0A0B0D',
    inkSoft: '#4A4E56',
    inkMuted: '#6E737C',
    inkFaint: '#C2C5CA',
    accent: '#B45309',
    green: '#0F8B4C',
    blue: '#3B5BDB',
    red: '#C92A3B',
  },
};

export const MONO = "'Geist Mono',ui-monospace,'SF Mono',Menlo,Consolas,monospace";
export const SANS = "'Geist',ui-sans-serif,system-ui,-apple-system,'Segoe UI',sans-serif";

export const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Deterministic PRNG — the same snapshot must always draw the same picture,
 *  or every run produces a diff and the commit history becomes noise. */
export function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5;  s >>>= 0;
    return s / 4294967296;
  };
}

export function seedFrom(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function text(x, y, s, o = {}) {
  const a = [
    `x="${x}"`, `y="${y}"`,
    `fill="${o.fill}"`,
    `font-family="${o.mono === false ? SANS : MONO}"`,
    `font-size="${o.size ?? 12}"`,
  ];
  if (o.weight) a.push(`font-weight="${o.weight}"`);
  if (o.anchor) a.push(`text-anchor="${o.anchor}"`);
  if (o.opacity !== undefined) a.push(`opacity="${o.opacity}"`);
  if (o.spacing) a.push(`letter-spacing="${o.spacing}"`);
  return `<text ${a.join(' ')}>${esc(s)}</text>`;
}

export function card(x, y, w, h, t, r = 12) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${t.surface}" stroke="${t.line}"/>`;
}

export function doc(w, h, t, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img">
<rect width="${w}" height="${h}" rx="14" fill="${t.canvas}"/>
${body}
</svg>`;
}

/** Truncate to a character budget rather than measuring text — SVG has no
 *  layout engine here and a clipped label is worse than a short one. */
export function clamp(s, max) {
  const v = String(s ?? '');
  return v.length <= max ? v : `${v.slice(0, max - 1)}…`;
}
