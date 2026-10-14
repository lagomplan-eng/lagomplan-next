// scripts/lib/demo-publish-core.ts
//
// Pure helpers for scripts/demo-publish.ts (no I/O) so they can be unit-tested.

export const PROD_ORIGIN = 'https://www.lagomplan.com'
const SLUG = /^[a-z0-9][a-z0-9-]{0,63}$/

export function assertSlug(slug: string | undefined): string {
  if (!slug || !SLUG.test(slug)) throw new Error(`slug "${slug ?? ''}" is not valid: lowercase letters, digits and hyphens (max 64)`)
  return slug
}

/**
 * ?ref= tag for the demo link. demo_visits.ref must match ^[a-z0-9_-]{1,32}$,
 * so a longer slug is cut to 32 chars (no trailing hyphen). Default: the slug.
 */
export function refFor(slug: string): string {
  return slug.slice(0, 32).replace(/-+$/, '')
}

export function demoUrl(origin: string, slug: string, ref = refFor(slug)): string {
  return `${origin}/demo/${slug}?ref=${ref}`
}

export const branchFor = (slug: string) => `demo/${slug}`

/**
 * Files that would reach Production but are NOT this demo. The promote step
 * stops and shows them unless the user accepts them explicitly (--allow-other).
 */
export function otherChanges(files: string[], slug: string): string[] {
  const own = `content/demos/${slug}/`
  return files.filter((f) => f && !f.startsWith(own))
}

export interface PromoteInput {
  environments?: string[]
  review: { by: string; date: string } | null
  errors: number
}

/** Reasons the demo can't go to Production (empty = OK). */
export function promoteBlockers(i: PromoteInput): string[] {
  const out: string[] = []
  if (i.errors) out.push(`${i.errors} validation error(s) — run npm run demo:check -- <slug> --production`)
  if (i.environments && !i.environments.includes('production')) out.push('environments excludes "production" (preview-only demo)')
  if (!i.review) out.push('no review { by, date } yet — Production needs the editorial OK; Preview works without it')
  return out
}

/** Commit message for adding or updating the demo folder. */
export function commitMessage(slug: string, existed: boolean, trailer?: string): string {
  const head = `feat(demo): ${existed ? 'update' : 'add'} ${slug} demo`
  return trailer ? `${head}\n\n${trailer}` : head
}

/** Last http(s) URL printed by `vercel deploy`. */
export function lastUrl(output: string): string | null {
  const urls = output.match(/https:\/\/[a-z0-9-]+\.vercel\.app/gi)
  return urls ? urls[urls.length - 1] : null
}

export function robotsOf(html: string): string | null {
  return (html.match(/<meta name="robots" content="([^"]*)"/) || [])[1] ?? null
}
