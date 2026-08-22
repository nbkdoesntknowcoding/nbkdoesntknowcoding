/**
 * Two views of the same year, deliberately fetched two different ways.
 *
 *  - `publicContributions()` hits the contributions HTML endpoint with NO
 *    credentials, because the number that matters is the one a stranger sees.
 *  - `authoredWork()` hits the authenticated search API, which can see the
 *    private repos the graph refuses to count.
 *
 * The gap between them is the point of the receipts panel, so neither may be
 * quietly substituted for the other.
 */

const LOGIN = process.env.PROFILE_LOGIN ?? 'nbkdoesntknowcoding';
const TOKEN = process.env.PROFILE_GH_TOKEN ?? process.env.GITHUB_TOKEN;

export class GhError extends Error {
  constructor(reason, detail) {
    super(`github:${reason}${detail ? ` — ${detail}` : ''}`);
    this.reason = reason;
  }
}

export async function publicContributions() {
  const res = await fetch(`https://github.com/users/${LOGIN}/contributions`, {
    headers: { accept: 'text/html', 'user-agent': 'nbk-profile-readme' },
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) throw new GhError(`contrib_http_${res.status}`);
  const html = await res.text();

  const perDay = [...html.matchAll(/>\s*([\d,]+)\s+contributions?\s+on/g)]
    .map((m) => Number(m[1].replace(/,/g, '')));
  const cells = [...html.matchAll(/data-level="(\d)"/g)].map((m) => m[1]);

  if (cells.length === 0) throw new GhError('contrib_parse_failed', 'no calendar cells in response');

  return {
    total: perDay.reduce((a, b) => a + b, 0),
    activeDays: cells.filter((c) => c !== '0').length,
    daysInWindow: cells.length,
  };
}

async function graphql(query, variables) {
  if (!TOKEN) throw new GhError('no_token', 'PROFILE_GH_TOKEN is unset');
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${TOKEN}`,
      'content-type': 'application/json',
      'user-agent': 'nbk-profile-readme',
    },
    body: JSON.stringify({ query, variables }),
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) throw new GhError(`graphql_http_${res.status}`, (await res.text()).slice(0, 200));
  const body = await res.json();
  if (body.errors) throw new GhError('graphql_error', body.errors.map((e) => e.message).join('; '));
  return body.data;
}

const Q = `
query($login:String!,$all:String!,$merged:String!,$year:String!){
  user(login:$login){ name createdAt }
  all:    search(query:$all,    type:ISSUE){ issueCount }
  merged: search(query:$merged, type:ISSUE){ issueCount }
  year:   search(query:$year,   type:ISSUE){ issueCount }
}`;

export async function authoredWork() {
  const since = new Date(Date.now() - 365 * 864e5).toISOString().slice(0, 10);
  const base = `is:pr author:${LOGIN}`;
  const d = await graphql(Q, {
    login: LOGIN,
    all: base,
    merged: `${base} is:merged`,
    year: `${base} created:>=${since}`,
  });
  return {
    name: d.user.name,
    joined: d.user.createdAt,
    prsAllTime: d.all.issueCount,
    prsMerged: d.merged.issueCount,
    prsThisYear: d.year.issueCount,
  };
}

/** Merged PRs across every repo the token can see, newest first — the ship log.
 *  policy.redactPr decides what of each one survives to the page. */
export async function recentMerges(limit = 40) {
  const d = await graphql(
    `query($q:String!,$n:Int!){ search(query:$q,type:ISSUE,first:$n){ nodes{
        ... on PullRequest { number title url mergedAt repository{ nameWithOwner } } } } }`,
    { q: `is:pr author:${LOGIN} is:merged sort:updated-desc`, n: limit },
  );
  // GitHub can only sort this query by update time, and a PR touched after it
  // merged would jump the queue. Re-sort by the field the log actually claims.
  return d.search.nodes
    .filter((n) => n && n.mergedAt)
    .sort((a, b) => Date.parse(b.mergedAt) - Date.parse(a.mergedAt));
}
