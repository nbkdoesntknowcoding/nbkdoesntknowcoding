{{HERO_IMG}}

I'm **Nischay** — founder at [The Boring People](https://theboringpeople.in), building
[**Mnema**](https://github.com/nbkdoesntknowcoding/mnema), a context engine that publishes a team's
docs, decisions and workflows to any MCP-aware AI client. The handle is from 2024 and I've kept it,
because the interesting part of the last year wasn't learning to type faster. It was learning to
direct a fleet of agents at a real codebase and still be able to prove what they did.

This page is generated. Every number on it is fetched, dated, and allowed to fail out loud.

---

{{RECEIPTS_IMG}}

A logged-out visitor sees **{{PUBLIC_SHOWN}} contributions** across **{{ACTIVE_DAYS}} active days**.
In the same year I opened **{{PRS_YEAR}} pull requests**, and **{{PRS_MERGED}}** of them are merged.
Both numbers are real. They just come from different places, and only one of them is on my profile by
default. None of this is solo work either — `project-x` has a human collaborator and a very busy
dependabot, so every count here is scoped to PRs I actually authored.

---

## Ask this profile a question

The links below open a pre-filled issue. A workflow reads the title, calls **Mnema over MCP**,
commits the answer back into this page, and replies on the issue. You are querying the same
knowledge graph my agents query — there is no cached copy, and no human in the loop.

| Question | What answers it |
|---|---|
{{ASK_TABLE}}

<sub>**Why this is safe to leave open.** The issue title is matched against
`^ask\|[a-z0-9-]+$` and then against an allowlist of {{QUESTION_COUNT}} slugs defined in
[`scripts/lib/questions.mjs`](scripts/lib/questions.mjs). Each slug names a fixed tool call.
The issue body is never read. There is no free-text path from an issue into the graph, which means
there is no prompt to inject into and no way to enumerate the workspace. Disclosure is capped again
in [`scripts/lib/policy.mjs`](scripts/lib/policy.mjs): private repos surface counts only, never
titles. Three questions per person per day.</sub>

### Recently asked

{{LATEST_ANSWERS}}

Full history: [**ASKED.md**](ASKED.md)

---

## Point your own agent at it

The same MCP server that answers the questions above will answer yours. It runs the workspace's
real access rules, so you'll get the public projects and nothing else.

```jsonc
{
  "mcpServers": {
    "mnema": {
      "type": "http",
      "url": "https://api.theboringpeople.in/mcp",
      "headers": { "Authorization": "Bearer <your mnema_api_ key>" }
    }
  }
}
```

Self-host the whole thing instead: [**nbkdoesntknowcoding/mnema**](https://github.com/nbkdoesntknowcoding/mnema) — fair-code, MCP-native, bring your own model keys.

---

{{SHIPLOG_IMG}}

The `TASK` column isn't decoration. Branches are named `t-<n>-<slug>`, and that string is the only
thing binding a task to the PR that closed it — from it, the board moves on its own. It's the piece
that took longest to get right, because for months **0 of 1,956 branches carried one** and the whole
chain sat idle looking perfectly healthy.

---

## What I'm building

| | |
|---|---|
| [**Mnema**](https://github.com/nbkdoesntknowcoding/mnema) | Context engine for AI work — knowledge graph, docs, flows, meetings, all exposed over MCP. Fair-code, self-hostable. |
| [**display-share**](https://github.com/nbkdoesntknowcoding/display-share) | A Windows laptop as a genuine extended display for a Mac. Swift, and mostly a latency problem wearing a UI. |
| [**polybench**](https://github.com/nbkdoesntknowcoding/polybench) | Benchmarking harness. |

Currently sharp on: agent orchestration at fleet scale, MCP server design, Postgres RLS and
multi-tenancy, knowledge graphs that survive contact with real data, and the unglamorous work of
proving a feature actually ran.

---

## The bug I look for first

> A feature that runs clean and produces nothing.

One audit of my own codebase found four in a day — a bare `catch {}`, two dropped queue jobs, an
early `return` with no reason attached. Each turned a broken feature into a working-looking one: the
route 202s, the queue drains, the bill arrives, the table stays empty. So every guard that can
swallow work has to log why, with a counter, and every skip needs a denominator — *"fires 100% of
the time"* is invisible until you print `0/1,073`.

That rule applies to this page too. If a source is unreachable you'll see a red **STALE** band with
the reason code, not a confident-looking zero.

---

<sub>{{STATUS}} · built by [`scripts/collect.mjs`](scripts/collect.mjs) →
[`scripts/render.mjs`](scripts/render.mjs), on a cron and on every answered question ·
[how it works](SETUP.md) · [nischaybk@theboringpeople.in](mailto:nischaybk@theboringpeople.in)</sub>
