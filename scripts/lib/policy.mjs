/**
 * What may ever leave the workspace and land on a public profile page.
 *
 * This file is the whole disclosure boundary. Nothing downstream re-derives
 * it: collect.mjs filters through `publicProject()` / `repoDisclosure()` and
 * render.mjs trusts what it is handed. If you widen anything here, you are
 * widening what strangers can read.
 */

/** Mnema project slugs whose content may be named in public. */
export const PUBLIC_PROJECTS = new Set([
  'mnema-public',
  'display-share',
  'polybench',
]);

/**
 * Per-repo disclosure level.
 *   'full'  — PR titles + links are rendered verbatim (repo is already public)
 *   'count' — only aggregate counts and the conventional-commit type are
 *             rendered; titles and links are withheld (repo is private)
 * A repo absent from this map is treated as 'count'. Fail closed.
 */
export const REPO_DISCLOSURE = {
  'nbkdoesntknowcoding/mnema': 'full',
  'nbkdoesntknowcoding/display-share': 'full',
  'nbkdoesntknowcoding/polybench': 'full',
  'nbkdoesntknowcoding/project-x': 'count',
};

export function publicProject(slug) {
  return PUBLIC_PROJECTS.has(slug);
}

export function repoDisclosure(nameWithOwner) {
  return REPO_DISCLOSURE[nameWithOwner] ?? 'count';
}

/**
 * Reduce a merged PR to only what its repo's disclosure level permits.
 * Returns null when the PR must not be shown at all.
 */
export function redactPr(pr, nameWithOwner) {
  const level = repoDisclosure(nameWithOwner);
  const type = (pr.title ?? '').match(/^([a-z]+)(\(|:)/)?.[1] ?? 'chore';
  if (level === 'full') {
    return { number: pr.number, title: pr.title, url: pr.url, mergedAt: pr.mergedAt, type, task: pr.task?.publicId ?? null };
  }
  return { number: null, title: null, url: null, mergedAt: pr.mergedAt, type, task: null };
}
