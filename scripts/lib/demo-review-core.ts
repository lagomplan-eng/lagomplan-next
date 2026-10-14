// scripts/lib/demo-review-core.ts — pure logic for `npm run demo:review`.
import { makeDemoSchema } from '../../content/guia/demos/schema'

export interface ReviewResult { ok: boolean; errors: string[]; next?: Record<string, unknown> }

/**
 * Sets `review` on a parsed demo.json. Validates ONLY through the real schema
 * (reviewer from the config list, real ISO date, not in the future) and refuses
 * to overwrite an existing review unless `replace` is true. Nothing else in the
 * document changes.
 */
export function applyReview(raw: Record<string, unknown>, by: string, date: string, reviewers: readonly string[], replace = false): ReviewResult {
  if (raw.review && !replace) {
    const r = raw.review as { by: string; date: string }
    return { ok: false, errors: [`already reviewed by ${r.by} on ${r.date} — pass --replace to overwrite`] }
  }
  const next = { ...raw, review: { by, date } }
  const parsed = makeDemoSchema(reviewers).safeParse(next)
  if (!parsed.success) {
    const errs = parsed.error.issues.filter((i) => i.path[0] === 'review').map((i) => `${i.path.join('.')}: ${i.message}`)
    // Other issues are not about the review: report them separately so nothing is hidden.
    const other = parsed.error.issues.filter((i) => i.path[0] !== 'review').map((i) => `${i.path.join('.')}: ${i.message}`)
    return { ok: false, errors: [...errs, ...other] }
  }
  return { ok: true, errors: [], next }
}
