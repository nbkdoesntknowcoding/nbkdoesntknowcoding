/**
 * The allowlist of questions the profile will answer.
 *
 * This is deliberately a registry and not a prompt. A stranger opens an issue
 * titled `ask|<slug>`; the workflow looks the slug up here and runs the tool
 * call *this file* specifies. Free text from the issue never reaches Mnema,
 * so there is no query to inject into and no surface to enumerate the
 * workspace with. Adding a question is a commit, reviewable like any other.
 */

import { callTool, MnemaError } from './mnema.mjs';
import { publicProject } from './policy.mjs';

/**
 * Assert that a tool actually returned the fields a formatter is about to
 * print. Without this a missing field renders the string "undefined" onto a
 * public page and the run stays green — a wrong answer is worse than no answer.
 *
 * This is not hypothetical. `whoami` shipped reading r.name/r.title/r.team; the
 * deployed server returns no structuredContent for it, the client fell back to
 * {text}, and the profile published "undefined — undefined, undefined team."
 */
function need(result, fields, tool) {
  const missing = fields.filter((f) => result?.[f] === undefined || result?.[f] === null);
  if (missing.length > 0) {
    throw new MnemaError('missing_fields', `${tool} returned no ${missing.join(', ')}`);
  }
  return result;
}

const usd = (n) => `$${Number(n ?? 0).toFixed(2)}`;
const n = (x) => Number(x ?? 0).toLocaleString('en-US');

export const QUESTIONS = [
  {
    slug: 'who-is-this',
    question: 'Who am I, according to my own knowledge graph?',
    blurb: 'Answered by Mnema’s `whoami`, not by me typing a bio.',
    async answer() {
      const r = await callTool('whoami');
      // Prefer the structured fields; fall back to the tool's own prose, which
      // is accurate and readable, when the server does not emit them. The
      // prose is always present as _text, including when structuredContent
      // came back but without the fields this formatter needs.
      const prose = (r._text ?? r.text ?? '').trim();
      if (r.name === undefined && prose) {
        return [
          prose,
          '',
          'That line is not written into this README. It is resolved at answer time from the',
          'org chart inside Mnema, through the same MCP tool any connected agent would call.',
        ].join('\n');
      }
      need(r, ['name', 'title', 'team'], 'whoami');
      return [
        `**${r.name}** — ${r.title}, ${r.team} team.`,
        '',
        'That line is not written into this README. It is resolved at answer time from the',
        'org chart inside Mnema, through the same MCP tool any connected agent would call.',
      ].join('\n');
    },
  },

  {
    slug: 'graph-size',
    question: 'How big is the knowledge graph behind this profile?',
    blurb: 'Live node / edge / community counts from the running graph.',
    async answer() {
      const r = await callTool('get_graph_report');
      need(r, ['totalNodes', 'totalEdges', 'totalCommunities', 'godNodeCount'], 'get_graph_report');
      return [
        `| | |`,
        `|---|--:|`,
        `| Nodes | ${n(r.totalNodes)} |`,
        `| Edges | ${n(r.totalEdges)} |`,
        `| Communities | ${n(r.totalCommunities)} |`,
        `| God-nodes | ${n(r.godNodeCount)} |`,
        '',
        `Last rebuilt \`${r.lastBuiltAt}\`.`,
      ].join('\n');
    },
  },

  {
    slug: 'what-shipped',
    question: 'What shipped in the last 7 days?',
    blurb: 'Merged PRs joined to the tasks they closed — by branch name.',
    async answer() {
      const r = await callTool('what_shipped', { project: 'mnema', since: '7d' });
      need(r, ['mergedPrs'], 'what_shipped');
      const prs = r.mergedPrs;
      if (prs.length === 0) {
        return 'Nothing merged in that window. Reported as zero rather than rounded up.';
      }
      const byType = {};
      for (const pr of prs) {
        const t = (pr.title ?? '').match(/^([a-z]+)(\(|:)/)?.[1] ?? 'other';
        byType[t] = (byType[t] ?? 0) + 1;
      }
      const linked = prs.filter((p) => p.task).length;
      const breakdown = Object.entries(byType)
        .sort((a, b) => b[1] - a[1])
        .map(([t, c]) => `\`${t}\` ${c}`)
        .join(' · ');
      return [
        `**${prs.length} PRs merged** into a private repo, so titles are withheld.`,
        '',
        `Breakdown: ${breakdown}`,
        '',
        `${linked} of ${prs.length} carried a \`t-<n>\` branch and auto-closed their task.`,
        `Estimated model spend for the window: **${usd(r.estCostUsd)}**.`,
      ].join('\n');
    },
  },

  {
    slug: 'what-am-i-building',
    question: 'What am I actually building right now?',
    blurb: 'Public projects and their live board counts.',
    async answer() {
      const r = await callTool('list_projects', { status: 'active' });
      need(r, ['projects'], 'list_projects');
      const rows = r.projects
        .filter((p) => publicProject(p.slug))
        .map((p) => {
          const c = p.taskCounts ?? {};
          const done = c.done ?? 0;
          const wip = c.in_progress ?? 0;
          const todo = (c.backlog ?? 0) + (c.review ?? 0);
          return `| [${p.name}](${p.githubRepoUrl ?? '#'}) | ${done} | ${wip} | ${todo} |`;
        });
      if (rows.length === 0) {
        return 'No public projects matched the disclosure allowlist. Reported as empty, not padded.';
      }
      return ['| Project | done | in progress | queued |', '|---|--:|--:|--:|', ...rows].join('\n');
    },
  },

  {
    slug: 'what-did-it-cost',
    question: 'What does running an agent fleet actually cost?',
    blurb: 'Real metered spend, because I built the meter.',
    async answer() {
      const r = await callTool('what_shipped', { project: 'mnema', since: '30d' });
      need(r, ['mergedPrs', 'estCostUsd'], 'what_shipped');
      const prs = r.mergedPrs;
      const cost = Number(r.estCostUsd ?? 0);
      const per = prs.length > 0 ? cost / prs.length : 0;
      return [
        `Last 30 days on the Mnema codebase: **${usd(cost)}** of model spend across`,
        `**${prs.length} merged PRs** — about **${usd(per)} per shipped PR**.`,
        '',
        'That number exists because metering was built before the bill got interesting.',
        'It once caught a $10-in-two-days runaway that produced nothing at all.',
      ].join('\n');
    },
  },
];

export const BY_SLUG = new Map(QUESTIONS.map((q) => [q.slug, q]));
