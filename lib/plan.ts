/**
 * lib/plan.ts
 *
 * The traveler's plan, shared by Experiencias and Hoteles: a list of {type, id} refs kept
 * in localStorage under `lp_plan`. Pure helpers only (no React, no storage access), so
 * the rules are testable with a plain tsx script.
 *
 * Storage format: {"v":2,"items":[{"type":"experience","id":"…"},…]}. The v1 format
 * ({"v":1,"ids":[…]}, experiences only) and a bare array of ids are read as experiences.
 *
 * Nothing is sent to a server. Order = the order the traveler added them.
 */

export const PLAN_KEY = 'lp_plan'
/** Keeps a corrupted or hand-edited value from growing without bound. */
export const PLAN_MAX = 30

export type PlanItemType = 'experience' | 'hotel'
export const PLAN_ITEM_TYPES: readonly PlanItemType[] = ['experience', 'hotel']

export interface PlanRef { type: PlanItemType; id: string }

/**
 * One plan item as the traveler sees it. Built on the server for both corpora so any
 * page can show the whole plan.
 */
export interface PlanEntry extends PlanRef {
  name: string
  /** Guide registry key (or `wc-<city>`), the grouping key for the planner handoff. */
  destinationSlug: string
  /** Short display name for the locale: the value handed to the planner. */
  destinationName: string
  bookingUrl?: string
  /** Who the booking link goes to; a key of `catalog.provider` in the messages. */
  provider: string
}

const isType = (t: unknown): t is PlanItemType => t === 'experience' || t === 'hotel'
export const sameRef = (a: PlanRef, b: PlanRef): boolean => a.type === b.type && a.id === b.id

/** Tolerant parse: anything unexpected is an empty plan, never a throw. */
export function parsePlan(raw: string | null | undefined): PlanRef[] {
  if (!raw) return []
  try {
    const data = JSON.parse(raw)
    const list: unknown = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : data?.ids
    if (!Array.isArray(list)) return []
    const out: PlanRef[] = []
    for (const x of list) {
      const ref: PlanRef | null =
        typeof x === 'string' ? { type: 'experience', id: x } :
        x && typeof x === 'object' && isType((x as PlanRef).type) && typeof (x as PlanRef).id === 'string'
          ? { type: (x as PlanRef).type, id: (x as PlanRef).id } : null
      if (ref && ref.id && !out.some(o => sameRef(o, ref))) out.push(ref)
      if (out.length >= PLAN_MAX) break
    }
    return out
  } catch {
    return []
  }
}

export function serializePlan(items: PlanRef[]): string {
  return JSON.stringify({ v: 2, items: items.map(({ type, id }) => ({ type, id })) })
}

/** Refs that no longer exist (guide edited, link made non-bookable) drop out silently. */
export function resolvePlan(refs: PlanRef[], catalog: PlanEntry[]): PlanEntry[] {
  const byKey = new Map(catalog.map(e => [`${e.type}:${e.id}`, e]))
  const out: PlanEntry[] = []
  for (const r of refs) {
    const e = byKey.get(`${r.type}:${r.id}`)
    if (e) out.push(e)
  }
  return out
}

export function togglePlan(items: PlanRef[], ref: PlanRef): PlanRef[] {
  if (items.some(i => sameRef(i, ref))) return items.filter(i => !sameRef(i, ref))
  return items.length >= PLAN_MAX ? items : [...items, { type: ref.type, id: ref.id }]
}

export interface PlanDestination {
  /** Registry key. */
  slug: string
  /** Short display name for the locale: the value handed to the planner. */
  name: string
  /** Items in the plan at that destination. */
  count: number
  /** True when the plan spans more than one destination. */
  mixed: boolean
  /** True when another destination has as many items (the first one added won). */
  tied: boolean
}

/**
 * The destination the planner is opened with: the one with the most items (experiences
 * and hotels count alike). A tie goes to the destination whose item was added first.
 * null for an empty plan.
 */
export function planDestination(items: PlanEntry[]): PlanDestination | null {
  if (items.length === 0) return null
  const tally = new Map<string, { name: string; count: number }>()
  for (const e of items) {
    const t = tally.get(e.destinationSlug)
    if (t) t.count++
    else tally.set(e.destinationSlug, { name: e.destinationName, count: 1 })
  }
  let best: [string, { name: string; count: number }] | null = null
  for (const entry of Array.from(tally.entries())) {
    if (!best || entry[1].count > best[1].count) best = entry // strict > keeps the earliest on ties
  }
  const top = best![1].count
  const tied = Array.from(tally.values()).filter(t => t.count === top).length > 1
  return { slug: best![0], name: best![1].name, count: top, mixed: tally.size > 1, tied }
}

/** The plan grouped for the panel: experiences first, then hotels, each in the order added. */
export function groupPlan(items: PlanEntry[]): Array<{ type: PlanItemType; items: PlanEntry[] }> {
  return PLAN_ITEM_TYPES
    .map(type => ({ type, items: items.filter(i => i.type === type) }))
    .filter(g => g.items.length > 0)
}
