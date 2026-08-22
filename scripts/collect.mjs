#!/usr/bin/env node
/**
 * Gather every number the page shows into data/snapshot.json.
 *
 * House rule, applied literally: a source that fails must say so. Each source
 * carries its own {ok, reason, fetchedAt}; a failure keeps the last good value
 * but flips `stale` and records why, and the process exits non-zero so the
 * Action goes red. What it must never do is emit a plausible-looking number,
 * or quietly render an empty panel as though the day were simply quiet.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { publicContributions, authoredWork, recentMerges } from './lib/gh.mjs';
import { callTool, keyConfigured } from './lib/mnema.mjs';
import { redactPr } from './lib/policy.mjs';

const SNAPSHOT = new URL('../data/snapshot.json', import.meta.url);

async function previous() {
  try {
    return JSON.parse(await readFile(SNAPSHOT, 'utf8'));
  } catch {
    return { sources: {} };
  }
}

/** Run one source; on failure fall back to the previous value, loudly. */
async function source(name, prev, fn) {
  const at = new Date().toISOString();
  try {
    const data = await fn();
    return { ok: true, stale: false, reason: null, fetchedAt: at, data };
  } catch (err) {
    const reason = err.reason ?? err.name ?? 'unknown';
    console.error(`collect: source "${name}" FAILED — ${err.message}`);
    const old = prev.sources?.[name];
    if (!old?.data) {
      return { ok: false, stale: true, reason, fetchedAt: null, data: null };
    }
    return {
      ok: false,
      stale: true,
      reason,
      fetchedAt: old.fetchedAt,
      staleSince: old.staleSince ?? at,
      data: old.data,
    };
  }
}

const main = async () => {
  const prev = await previous();
  const sources = {};

  sources.publicGraph = await source('publicGraph', prev, publicContributions);
  sources.authored = await source('authored', prev, authoredWork);

  sources.ships = await source('ships', prev, async () => {
    const merges = await recentMerges(40);
    return merges
      .map((m) => redactPr(m, m.repository.nameWithOwner))
      .filter(Boolean)
      .map((m, i) => ({ ...m, repo: merges[i].repository.nameWithOwner }));
  });

  if (!keyConfigured()) {
    console.error('collect: MNEMA_API_KEY unset — graph and shipped panels will render as unavailable, not as zero');
  }

  sources.graph = await source('graph', prev, async () => {
    const r = await callTool('get_graph_report');
    return {
      nodes: r.totalNodes,
      edges: r.totalEdges,
      communities: r.totalCommunities,
      godNodes: r.godNodeCount,
      builtAt: r.lastBuiltAt,
    };
  });

  sources.shipped30d = await source('shipped30d', prev, async () => {
    const r = await callTool('what_shipped', { project: 'mnema', since: '30d' });
    const prs = r.mergedPrs ?? [];
    return {
      merged: prs.length,
      taskLinked: prs.filter((p) => p.task).length,
      costUsd: Number(r.estCostUsd ?? 0),
    };
  });

  const failed = Object.entries(sources).filter(([, s]) => !s.ok).map(([k]) => k);

  const snapshot = {
    generatedAt: new Date().toISOString(),
    ok: failed.length === 0,
    failedSources: failed,
    sources,
  };

  await writeFile(SNAPSHOT, `${JSON.stringify(snapshot, null, 2)}\n`);

  if (failed.length > 0) {
    console.error(`collect: ${failed.length}/${Object.keys(sources).length} sources failed: ${failed.join(', ')}`);
    console.error('collect: snapshot written with last-known-good values, marked stale. Exiting non-zero.');
    process.exitCode = 1;
    return;
  }
  console.log(`collect: all ${Object.keys(sources).length} sources ok`);
};

await main();
