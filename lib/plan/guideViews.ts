/**
 * lib/plan/guideViews.ts
 *
 * Anonymous guide-view tracking via localStorage. Logged-in users are not
 * tracked — once you have an account, guides are unlimited.
 *
 * Storage shape: a JSON array of canonical guide slugs the user has viewed.
 * Re-visiting the same guide never counts twice; only unique slugs accrue.
 *
 * Clearing localStorage resets the counter (acceptable per product spec).
 */

import { FREE_GUIDE_VIEWS } from './limits'

const STORAGE_KEY = 'lagomplan:guide_views'

/** True when we're in a browser environment that has localStorage. */
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

export function getSeenGuides(): string[] {
  if (!isBrowser()) return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((s: unknown): s is string => typeof s === 'string') : []
  } catch {
    return []
  }
}

export function hasSeenGuide(slug: string): boolean {
  return getSeenGuides().includes(slug)
}

export function markGuideSeen(slug: string): void {
  if (!isBrowser()) return
  const seen = getSeenGuides()
  if (seen.includes(slug)) return
  seen.push(slug)
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seen))
  } catch {
    // quota / private-mode — swallow silently, tracking is best-effort
  }
}

export type GuideAccessState =
  /** Anonymous, first-ever guide view (list empty). */
  | { kind: 'first-free'; slug: string }
  /** Anonymous, but already previously viewed THIS guide — still allowed. */
  | { kind: 'revisit'; slug: string }
  /** Anonymous, has seen other guide(s), now trying a new one → nudge to sign up. */
  | { kind: 'over-limit'; slug: string; seenCount: number }

/**
 * Compute the access state for the current slug given what's in localStorage.
 * Meant to be called on the client AFTER hydration.
 */
export function getGuideAccessState(slug: string): GuideAccessState {
  const seen = getSeenGuides()
  if (seen.includes(slug)) return { kind: 'revisit', slug }
  if (seen.length < FREE_GUIDE_VIEWS) return { kind: 'first-free', slug }
  return { kind: 'over-limit', slug, seenCount: seen.length }
}
