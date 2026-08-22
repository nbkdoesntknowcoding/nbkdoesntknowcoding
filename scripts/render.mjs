#!/usr/bin/env node
/**
 * snapshot.json + asked.json  →  six SVGs, README.md, ASKED.md
 *
 * Pure: reads committed state, writes committed state, talks to nothing. That
 * means `node scripts/render.mjs` reproduces the page byte-for-byte offline,
 * and a rendering bug can never be mistaken for a data outage.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { THEMES } from './lib/svg.mjs';
import { hero, receipts, shiplog } from './lib/panels.mjs';
import { QUESTIONS } from './lib/questions.mjs';

const url = (p) => new URL(`../${p}`, import.meta.url);
const REPO = process.env.PROFILE_REPO ?? 'nbkdoesntknowcoding/nbkdoesntknowcoding';

const readJson = async (p, fallback) => {
  try { return JSON.parse(await readFile(url(p), 'utf8')); } catch { return fallback; }
};

const n = (x) => Number(x ?? 0).toLocaleString('en-US');

const RAW = `https://raw.githubusercontent.com/${REPO}/main`;

/**
 * GitHub's camo proxy keys its cache on the source URL, so a regenerated SVG
 * at a stable path can keep serving the old bytes. Stamping a content hash
 * into the query string gives every new render a URL camo has never seen.
 */
function picture(name, alt) {
  const v = (theme) => createHash('sha256')
    .update(pending.get(`assets/${name}-${theme}.svg`))
    .digest('hex')
    .slice(0, 10);
  return [
    '<picture>',
    `  <source media="(prefers-color-scheme: dark)" srcset="${RAW}/assets/${name}-dark.svg?v=${v('dark')}">`,
    `  <img alt="${alt}" src="${RAW}/assets/${name}-light.svg?v=${v('light')}">`,
    '</picture>',
  ].join('\n');
}

/** Rendered SVG bodies, held so picture() can hash them before they hit disk. */
const pending = new Map();

function askTable() {
  return QUESTIONS.map((q) => {
    const title = encodeURIComponent(`ask|${q.slug}`);
    const body = encodeURIComponent(
      `Leave this body as-is and submit.\n\n`
      + `Only the issue title is read, and only against an allowlist of question slugs.\n`
      + `Nothing you type here is sent to the knowledge graph.\n`,
    );
    const href = `https://github.com/${REPO}/issues/new?title=${title}&body=${body}&labels=ask`;
    return `| [**${q.question}**](${href}) | ${q.blurb} |`;
  }).join('\n');
}

function latestAnswers(asked) {
  const items = (asked.answers ?? []).slice(-3).reverse();
  if (items.length === 0) {
    return '_Nobody has asked yet. The links above are live — the first one to click becomes the first entry._';
  }
  return items.map((a) => {
    const q = QUESTIONS.find((x) => x.slug === a.slug);
    return [
      `<details>`,
      `<summary><b>${q?.question ?? a.slug}</b> — asked by @${a.by} on ${a.at.slice(0, 10)}</summary>`,
      '',
      a.answer,
      '',
      `</details>`,
    ].join('\n');
  }).join('\n\n');
}

function statusLine(snap) {
  if (!snap.generatedAt) return '`never generated`';
  const when = snap.generatedAt.slice(0, 16).replace('T', ' ');
  if (snap.ok) return `\`refreshed ${when} UTC · all sources live\``;
  return `\`refreshed ${when} UTC · ⚠ stale sources: ${snap.failedSources.join(', ')}\``;
}

const main = async () => {
  const snap = await readJson('data/snapshot.json', null);
  if (!snap) {
    console.error('render: data/snapshot.json missing — run scripts/collect.mjs first. Refusing to render a blank page.');
    process.exit(1);
  }
  const asked = await readJson('data/asked.json', { answers: [] });

  for (const [name, theme] of Object.entries(THEMES)) {
    pending.set(`assets/hero-${name}.svg`, hero(snap, theme));
    pending.set(`assets/receipts-${name}.svg`, receipts(snap, theme));
    pending.set(`assets/shiplog-${name}.svg`, shiplog(snap, theme));
  }
  for (const [path, body] of pending) await writeFile(url(path), body);

  const auth = snap.sources.authored.data ?? {};
  const pub = snap.sources.publicGraph.data ?? {};
  const graph = snap.sources.graph.data ?? {};

  const tpl = await readFile(url('README.tmpl.md'), 'utf8');
  const readme = tpl
    .replaceAll('{{HERO_IMG}}', picture('hero', 'A live constellation drawn from the knowledge graph behind this profile'))
    .replaceAll('{{RECEIPTS_IMG}}', picture('receipts', 'Public contribution count versus pull requests actually merged'))
    .replaceAll('{{SHIPLOG_IMG}}', picture('shiplog', 'The most recent merged pull requests and the tasks they closed'))
    .replaceAll('{{ASK_TABLE}}', askTable())
    .replaceAll('{{LATEST_ANSWERS}}', latestAnswers(asked))
    .replaceAll('{{STATUS}}', statusLine(snap))
    .replaceAll('{{PUBLIC_SHOWN}}', n(pub.total))
    .replaceAll('{{ACTIVE_DAYS}}', n(pub.activeDays))
    .replaceAll('{{PRS_MERGED}}', n(auth.prsMerged))
    .replaceAll('{{PRS_TOTAL}}', n(auth.prsAllTime))
    .replaceAll('{{PRS_YEAR}}', n(auth.prsThisYear))
    .replaceAll('{{GRAPH_NODES}}', n(graph.nodes))
    .replaceAll('{{GRAPH_EDGES}}', n(graph.edges))
    .replaceAll('{{QUESTION_COUNT}}', String(QUESTIONS.length));

  if (readme.includes('{{')) {
    const left = [...readme.matchAll(/\{\{[A-Z_]+\}\}/g)].map((m) => m[0]);
    console.error(`render: template placeholders left unfilled: ${[...new Set(left)].join(', ')}`);
    process.exit(1);
  }

  await writeFile(url('README.md'), readme);

  const log = (asked.answers ?? []).slice().reverse().map((a) => {
    const q = QUESTIONS.find((x) => x.slug === a.slug);
    return `### ${q?.question ?? a.slug}\n\n`
      + `Asked by [@${a.by}](https://github.com/${a.by}) · ${a.at.slice(0, 16).replace('T', ' ')} UTC · [#${a.issue}](https://github.com/${REPO}/issues/${a.issue})\n\n`
      + `${a.answer}\n`;
  }).join('\n---\n\n');

  await writeFile(url('ASKED.md'), [
    '# Asked and answered',
    '',
    'Every question this profile has been asked, and what the knowledge graph said at the time.',
    'Answers are point-in-time — the graph moves.',
    '',
    log || '_Nothing asked yet._',
    '',
  ].join('\n'));

  console.log(`render: 6 svgs + README.md + ASKED.md written (${(asked.answers ?? []).length} answers logged)`);
};

await main();
