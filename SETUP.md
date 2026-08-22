# How this profile page is built

Nothing here runs on a server. Two GitHub Actions generate a set of SVGs and a README,
commit them, and go red when a data source fails.

```
collect.mjs ──► data/snapshot.json ──► render.mjs ──► assets/*.svg + README.md + ASKED.md
   │                                       ▲
   ├─ github.com/users/<login>/contributions   (no auth — what a stranger sees)
   ├─ api.github.com/graphql                   (auth — can see private repos)
   └─ api.theboringpeople.in/mcp               (Mnema, over MCP)
                                               │
ask.mjs ◄── issue titled `ask|<slug>` ─────────┘
```

## Required secrets

| Secret | What it is | Why |
|---|---|---|
| `PROFILE_GH_TOKEN` | Classic PAT, `repo` scope | The search API only counts private-repo PRs for a token that can see them. Without it the receipts panel shows the public number twice. |
| `MNEMA_API_KEY` | A `mnema_api_…` key | Bearer auth for the MCP endpoint. |

### Minting the Mnema key — two things will silently break it

1. **It must not be an act-as key.** An act-as key resolves the caller from an
   `X-Mnema-Act-As-Email` header and, with no meeting in scope, roster validation denies
   the request. The symptom is not an error — it is a successful call that returns nothing.
2. **Scope it to a project, not the workspace.** `api_keys.project_id` hard-bounds every
   query the key can make. Pointing it at a public project means a bug in the disclosure
   allowlist still cannot reach a private one. Defence in depth, and it costs nothing.

## Running it locally

```bash
PROFILE_GH_TOKEN=ghp_… MNEMA_API_KEY=mnema_api_… node scripts/collect.mjs
node scripts/render.mjs
```

`render.mjs` is pure — it reads `data/snapshot.json` and writes files, talking to nothing.
So it reproduces the page offline, and a rendering bug can never be mistaken for an outage.

`collect.mjs` exits non-zero if any source failed, *after* writing the snapshot with the last
known-good values marked `stale`. The page still renders; it just renders with a red band
naming the reason code. That is deliberate: a panel that quietly shows yesterday's number as
though it were today's is the exact failure mode this project is built to avoid.

## Adding a question

Append to `QUESTIONS` in [`scripts/lib/questions.mjs`](scripts/lib/questions.mjs). Each entry
names a fixed tool call. A slug that is not in that array is refused, so the set of things a
stranger can ask is exactly the set of things committed to this repo.

## What the disclosure boundary is

[`scripts/lib/policy.mjs`](scripts/lib/policy.mjs), and only that file:

- `PUBLIC_PROJECTS` — Mnema project slugs that may be named publicly.
- `REPO_DISCLOSURE` — per-repo, `full` (titles and links) or `count` (aggregates only).
  A repo not listed is treated as `count`. It fails closed.

## Failure modes worth knowing

| Symptom | Cause |
|---|---|
| Panels render but a red `STALE` band names `no_api_key` | `MNEMA_API_KEY` is unset in Actions secrets. |
| `STALE — …:unauthorized` | Key revoked, or it is an act-as key. See above. |
| Receipts shows the same number in both bars | `PROFILE_GH_TOKEN` is missing, so the search API cannot see private repos. |
| `contrib_parse_failed` | GitHub changed the contributions page markup. The scraper is intentionally strict — it throws rather than reporting zero. |
| Images look stale on github.com | Camo caches by URL. `render.mjs` stamps a content hash into each `?v=`, so a changed SVG always gets a URL camo has not seen. |
