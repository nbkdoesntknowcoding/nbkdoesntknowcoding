#!/usr/bin/env node
/**
 * Answer one issue-driven question.
 *
 * The only thing a stranger controls is which slug they pick. The title is
 * matched against a strict pattern, the slug against a registry in this repo,
 * and the issue body is never read at all. There is no free-text path from an
 * issue into the knowledge graph, so there is nothing to inject into.
 *
 * Writes the reply to $GITHUB_OUTPUT-adjacent files for the workflow to post:
 *   .ask-reply.md     the comment body
 *   .ask-status       one of: answered | rejected | failed
 */

import { readFile, writeFile } from 'node:fs/promises';
import { BY_SLUG, QUESTIONS } from './lib/questions.mjs';

const url = (p) => new URL(`../${p}`, import.meta.url);

const TITLE = process.env.ISSUE_TITLE ?? '';
const AUTHOR = process.env.ISSUE_AUTHOR ?? 'unknown';
const NUMBER = Number(process.env.ISSUE_NUMBER ?? 0);

const PER_AUTHOR_PER_DAY = 3;
const KEEP = 60;

const finish = async (status, body) => {
  await writeFile(url('.ask-reply.md'), body);
  await writeFile(url('.ask-status'), status);
  console.log(`ask: ${status}`);
  if (status === 'failed') process.exitCode = 1;
};

const menu = () => QUESTIONS.map((q) => `- \`ask|${q.slug}\` — ${q.question}`).join('\n');

const main = async () => {
  const m = TITLE.trim().match(/^ask\|([a-z0-9-]{1,40})$/);
  if (!m) {
    return finish('rejected', [
      "This repo only answers issues titled exactly `ask|<slug>`, and only for slugs on its allowlist.",
      '',
      'Available questions:',
      '',
      menu(),
      '',
      'Nothing in the issue body is read — the title is the entire input surface.',
    ].join('\n'));
  }

  const slug = m[1];
  const q = BY_SLUG.get(slug);
  if (!q) {
    return finish('rejected', [
      `\`${slug}\` is not on the allowlist, so nothing was queried.`,
      '',
      'Available questions:',
      '',
      menu(),
    ].join('\n'));
  }

  let asked;
  try {
    asked = JSON.parse(await readFile(url('data/asked.json'), 'utf8'));
  } catch {
    asked = { answers: [] };
  }

  const dayAgo = Date.now() - 864e5;
  const recent = asked.answers.filter((a) => a.by === AUTHOR && Date.parse(a.at) > dayAgo);
  if (recent.length >= PER_AUTHOR_PER_DAY) {
    return finish('rejected',
      `@${AUTHOR} has already asked ${recent.length} questions in the last 24 hours, which is the cap. `
      + 'The full history is in [ASKED.md](../blob/main/ASKED.md).');
  }

  let answer;
  try {
    answer = await q.answer();
  } catch (err) {
    // Print the full message. A bare reason code with the detail stripped is
    // half a log — the first failure of this kind reported `missing_fields`
    // and nothing in the run said which fields, or what shape came back.
    console.error(`ask: ${slug} failed — ${err.message}`);
    return finish('failed', [
      `The knowledge graph did not answer: \`${err.reason ?? 'unknown'}\`.`,
      '',
      `Detail: \`${(err.message ?? '').slice(0, 300)}\``,
      '',
      'Reported as a failure rather than as an empty result. The workflow run is red and I will see it.',
    ].join('\n'));
  }

  if (!answer || !answer.trim()) {
    return finish('failed', 'The tool returned an empty answer. Reported as failed rather than rendered as blank.');
  }

  // Last line of defence before something reaches a public page. A formatter
  // reading a field the tool did not return renders the literal string
  // "undefined" and stays green, which is the one failure this repo argues
  // against. Per-formatter assertions in questions.mjs catch it first; this
  // catches whatever those miss.
  if (/\bundefined\b|\bNaN\b|\[object Object\]/.test(answer)) {
    return finish('failed', [
      'The answer came back malformed and was not published.',
      '',
      'A formatter printed `undefined`, `NaN`, or `[object Object]`, which means a tool',
      'returned a different shape than the formatter expects. Refusing to publish a',
      'confident-looking wrong answer. The run is red and I will see it.',
    ].join('\n'));
  }

  asked.answers.push({ slug, by: AUTHOR, issue: NUMBER, at: new Date().toISOString(), answer });
  asked.answers = asked.answers.slice(-KEEP);
  await writeFile(url('data/asked.json'), `${JSON.stringify(asked, null, 2)}\n`);

  return finish('answered', [
    `**${q.question}**`,
    '',
    answer,
    '',
    '---',
    '',
    `Answered live by [Mnema](https://github.com/nbkdoesntknowcoding/mnema) over MCP, then committed to `
    + `[ASKED.md](../blob/main/ASKED.md) and the profile page.`,
  ].join('\n'));
};

await main();
