// content/guia/agenda/logic.ts
//
// Pure date / filtering logic for the agenda. No window, no fs, no clock reads
// except through the `now` argument, so every rule is unit-testable.
// "Today" is always the calendar date in America/Mexico_City, never the
// visitor's or the server's zone.

import type { Agenda, AgendaEvent, Category } from './schema'
import type { AgendaLang } from './copy'

export const MX_TZ = 'America/Mexico_City'

/** YYYY-MM-DD of `now` in Mexico City. */
export function mexicoToday(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: MX_TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now)
  const get = (t: string) => parts.find((p) => p.type === t)!.value
  return `${get('year')}-${get('month')}-${get('day')}`
}

/** "2026-10" → shifted by n months. */
export function addMonths(ym: string, n: number): string {
  const [y, m] = ym.split('-').map(Number)
  const t = new Date(Date.UTC(y, m - 1 + n, 1))
  return `${t.getUTCFullYear()}-${String(t.getUTCMonth() + 1).padStart(2, '0')}`
}

export function monthBounds(ym: string): { first: string; last: string } {
  const [y, m] = ym.split('-').map(Number)
  const lastDay = new Date(Date.UTC(y, m, 0)).getUTCDate()
  return { first: `${ym}-01`, last: `${ym}-${String(lastDay).padStart(2, '0')}` }
}

/** Events a guest may see right now: not ended, and (verified, or unverified allowed outside Production). */
export function visibleEvents(events: readonly AgendaEvent[], today: string, showUnverified: boolean): AgendaEvent[] {
  return events.filter((e) => e.end >= today && (e.status === 'verified' || showUnverified))
}

/** An event belongs to every month it touches (until its end date passes). */
export function touchesMonth(e: Pick<AgendaEvent, 'start' | 'end'>, ym: string): boolean {
  const { first, last } = monthBounds(ym)
  return e.start <= last && e.end >= first
}

/** Round-robin over the categories so the first cards mix them; stable inside a category. */
const MIX_ORDER: readonly Category[] = ['food', 'sport', 'outdoors', 'culture']
export function mixByCategory<T extends { category: Category }>(list: readonly T[]): T[] {
  const buckets = new Map<Category, T[]>(MIX_ORDER.map((c) => [c, []]))
  for (const e of list) buckets.get(e.category)!.push(e)
  const out: T[] = []
  while (out.length < list.length) {
    for (const c of MIX_ORDER) { const next = buckets.get(c)!.shift(); if (next) out.push(next) }
  }
  return out
}

export interface MonthPlans {
  ym: string
  /** At most one: the first `featured: true` event of the month. */
  featured: AgendaEvent | null
  /** The other plans, category-mixed. */
  compact: AgendaEvent[]
  /** featured + compact: what the summary counts. */
  total: number
}

export function monthPlans(agenda: Pick<Agenda, 'events'>, ym: string, today: string, showUnverified: boolean): MonthPlans {
  const inMonth = visibleEvents(agenda.events, today, showUnverified).filter((e) => touchesMonth(e, ym))
  const featured = inMonth.find((e) => e.featured) ?? null
  const rest = inMonth.filter((e) => e !== featured)
  return { ym, featured, compact: mixByCategory(rest), total: inMonth.length }
}

/** How many distinct categories the first `n` compact cards cover. */
export function categoriesInFirst(compact: readonly Pick<AgendaEvent, 'category'>[], n = 4): number {
  return new Set(compact.slice(0, n).map((e) => e.category)).size
}
export const MIN_CATEGORIES = 3

export function monthName(ym: string, lang: AgendaLang): string {
  return new Intl.DateTimeFormat(lang === 'es' ? 'es-MX' : 'en-US', { timeZone: 'UTC', month: 'long' }).format(new Date(`${ym}-15T12:00:00Z`))
}
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
export const monthTabLabel = (ym: string, lang: AgendaLang) => cap(monthName(ym, lang))

export function shortMonth(iso: string, lang: AgendaLang): string {
  return new Intl.DateTimeFormat(lang === 'es' ? 'es-MX' : 'en-US', { timeZone: 'UTC', month: 'short' }).format(new Date(`${iso}T12:00:00Z`)).replace('.', '').toUpperCase()
}

export const plural = (n: number, one: string, many: string) => (n === 1 ? one : many)

/** "OCTUBRE · 6 PLANES · NOVIEMBRE · 9 PLANES" */
export function summaryLine(m0: MonthPlans, m1: MonthPlans, lang: AgendaLang, copy: { plan: string; plans: string }): string {
  const part = (m: MonthPlans) => `${monthName(m.ym, lang)} · ${m.total} ${plural(m.total, copy.plan, copy.plans)}`
  return `${part(m0)} · ${part(m1)}`.toUpperCase()
}
