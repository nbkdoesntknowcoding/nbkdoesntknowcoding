<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/nbkdoesntknowcoding/nbkdoesntknowcoding/main/assets/hero-dark.svg?v=b43a52ee74">
  <img alt="A live constellation drawn from the knowledge graph behind this profile" src="https://raw.githubusercontent.com/nbkdoesntknowcoding/nbkdoesntknowcoding/main/assets/hero-light.svg?v=970046e4ec">
</picture>

I'm **Nischay** — founder at [The Boring People](https://theboringpeople.in), building
[**Mnema**](https://github.com/nbkdoesntknowcoding/mnema), a context engine that publishes a team's
docs, decisions and workflows to any MCP-aware AI client. The handle is from 2024 and I've kept it,
because the interesting part of the last year wasn't learning to type faster. It was learning to
direct a fleet of agents at a real codebase and still be able to prove what they did.

This page is generated. Every number on it is fetched, dated, and allowed to fail out loud.

---

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/nbkdoesntknowcoding/nbkdoesntknowcoding/main/assets/receipts-dark.svg?v=e045f31e9a">
  <img alt="Public contribution count versus pull requests actually merged" src="https://raw.githubusercontent.com/nbkdoesntknowcoding/nbkdoesntknowcoding/main/assets/receipts-light.svg?v=e13cc1852d">
</picture>

A logged-out visitor sees **238 contributions** across **28 active days**.
In the same year I opened **569 pull requests**, and **559** of them are merged.
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
| [**Who am I, according to my own knowledge graph?**](https://github.com/nbkdoesntknowcoding/nbkdoesntknowcoding/issues/new?title=ask%7Cwho-is-this&body=Leave%20this%20body%20as-is%20and%20submit.%0A%0AOnly%20the%20issue%20title%20is%20read%2C%20and%20only%20against%20an%20allowlist%20of%20question%20slugs.%0ANothing%20you%20type%20here%20is%20sent%20to%20the%20knowledge%20graph.%0A&labels=ask) | Answered by Mnema’s `whoami`, not by me typing a bio. |
| [**How big is the knowledge graph behind this profile?**](https://github.com/nbkdoesntknowcoding/nbkdoesntknowcoding/issues/new?title=ask%7Cgraph-size&body=Leave%20this%20body%20as-is%20and%20submit.%0A%0AOnly%20the%20issue%20title%20is%20read%2C%20and%20only%20against%20an%20allowlist%20of%20question%20slugs.%0ANothing%20you%20type%20here%20is%20sent%20to%20the%20knowledge%20graph.%0A&labels=ask) | Live node / edge / community counts from the running graph. |
| [**What shipped in the last 7 days?**](https://github.com/nbkdoesntknowcoding/nbkdoesntknowcoding/issues/new?title=ask%7Cwhat-shipped&body=Leave%20this%20body%20as-is%20and%20submit.%0A%0AOnly%20the%20issue%20title%20is%20read%2C%20and%20only%20against%20an%20allowlist%20of%20question%20slugs.%0ANothing%20you%20type%20here%20is%20sent%20to%20the%20knowledge%20graph.%0A&labels=ask) | Merged PRs joined to the tasks they closed — by branch name. |
| [**What am I actually building right now?**](https://github.com/nbkdoesntknowcoding/nbkdoesntknowcoding/issues/new?title=ask%7Cwhat-am-i-building&body=Leave%20this%20body%20as-is%20and%20submit.%0A%0AOnly%20the%20issue%20title%20is%20read%2C%20and%20only%20against%20an%20allowlist%20of%20question%20slugs.%0ANothing%20you%20type%20here%20is%20sent%20to%20the%20knowledge%20graph.%0A&labels=ask) | Public projects and their live board counts. |
| [**What does running an agent fleet actually cost?**](https://github.com/nbkdoesntknowcoding/nbkdoesntknowcoding/issues/new?title=ask%7Cwhat-did-it-cost&body=Leave%20this%20body%20as-is%20and%20submit.%0A%0AOnly%20the%20issue%20title%20is%20read%2C%20and%20only%20against%20an%20allowlist%20of%20question%20slugs.%0ANothing%20you%20type%20here%20is%20sent%20to%20the%20knowledge%20graph.%0A&labels=ask) | Real metered spend, because I built the meter. |

<sub>**Why this is safe to leave open.** The issue title is matched against
`^ask\|[a-z0-9-]+$` and then against an allowlist of 5 slugs defined in
[`scripts/lib/questions.mjs`](scripts/lib/questions.mjs). Each slug names a fixed tool call.
The issue body is never read. There is no free-text path from an issue into the graph, which means
there is no prompt to inject into and no way to enumerate the workspace. Disclosure is capped again
in [`scripts/lib/policy.mjs`](scripts/lib/policy.mjs): private repos surface counts only, never
titles. Three questions per person per day.</sub>

### Recently asked

_Nobody has asked yet. The links above are live — the first one to click becomes the first entry._

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

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/nbkdoesntknowcoding/nbkdoesntknowcoding/main/assets/shiplog-dark.svg?v=433288702a">
  <img alt="The most recent merged pull requests and the tasks they closed" src="https://raw.githubusercontent.com/nbkdoesntknowcoding/nbkdoesntknowcoding/main/assets/shiplog-light.svg?v=920456c170">
</picture>

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

<sub>`refreshed 2026-08-24 02:42 UTC · ⚠ stale sources: authored, ships, graph, shipped30d` · built by [`scripts/collect.mjs`](scripts/collect.mjs) →
[`scripts/render.mjs`](scripts/render.mjs), on a cron and on every answered question ·
[how it works](SETUP.md) · [nischaybk@theboringpeople.in](mailto:nischaybk@theboringpeople.in)</sub>
