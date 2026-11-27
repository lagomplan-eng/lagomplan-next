// lib/hotels/report/build.ts — the numbers of a monthly report. Pure: events in, a Report out. Reads nothing, writes nothing.
// Built only from hotel_guide_events rows; nothing about a guest exists in them.
import { HOTEL_OPEN_SOURCES, OPEN_KINDS } from '../../../content/guia/hotel/places'
import { moodLabel, placeName, planLabel, whereLabel, zoneLabel } from './labels'
import { DAY, OPENS_COUNTED_FROM, PLACES_COUNTED_FROM, dateOfMx, dateStartMx, isDate, monthRange, prevMonth, weeksIn } from './period'
import type { Brand, Change, Counted, Lang, PropertyInput, PropertyReport, Report, ReportEvent, SectionState } from './types'

/** Percentages only when the base is 20 or more; under that, counts. */
export const MIN_BASE_FOR_PERCENT = 20
export const canPercent = (base: number) => base >= MIN_BASE_FOR_PERCENT
export const pct = (n: number, base: number) => `${Math.round((n / base) * 100)}%`

const t = (e: ReportEvent) => Date.parse(e.created_at)
const tally = (events: ReportEvent[], key: (e: ReportEvent) => string | null | undefined) => {
  const m = new Map<string, number>()
  for (const e of events) { const k = key(e); if (k) m.set(k, (m.get(k) ?? 0) + 1) }
  return m
}
const sorted = (m: Map<string, number>, label: (id: string) => string): Counted[] =>
  [...m.entries()].map(([id, count]) => ({ id, label: label(id), count })).sort((a, b) => b.count - a.count || a.id.localeCompare(b.id))

/** Where counting starts for a hotel: its count-from date, else its approval day (Mexico City), else the beginning of time. */
export function effectiveCountFrom(p: Pick<PropertyInput, 'countFrom' | 'approvedAt'>): number {
  if (p.countFrom && isDate(p.countFrom)) return dateStartMx(p.countFrom)
  if (p.approvedAt && Number.isFinite(Date.parse(p.approvedAt))) return dateStartMx(dateOfMx(Date.parse(p.approvedAt)))
  return 0
}

/** The state of a section whose data only exists from `since` (a date). `lo`/`hi` bound the window being counted. */
function stateOf(since: string, lo: number, hi: number): { state: SectionState; from: number } {
  const s = dateStartMx(since)
  if (s >= hi) return { state: { kind: 'not_counted', from: since }, from: hi }
  if (s > lo) return { state: { kind: 'counted', from: since }, from: s }
  return { state: { kind: 'counted', from: null }, from: lo }
}

export function buildProperty(input: PropertyInput, month: string, lang: Lang, now = Date.now()): PropertyReport {
  const { start: mStart, end: mEnd } = monthRange(month)
  const cf = effectiveCountFrom(input)
  const lo = Math.max(mStart, cf)
  const empty = cf >= mEnd
  const inWindow = input.events.filter((e) => t(e) >= lo && t(e) < mEnd)

  const scans = inWindow.filter((e) => e.event_type === 'scan')
  const weeks = empty ? [] : weeksIn(lo, mEnd).map((w) => {
    const from = Math.max(w, lo)
    return { weekStart: dateOfMx(w), from: dateOfMx(from), scans: scans.filter((e) => t(e) >= w && t(e) < w + 7 * DAY).length }
  })
  const languages = { es: 0, en: 0, other: 0 }
  for (const e of scans) { if (e.lang === 'es') languages.es++; else if (e.lang === 'en') languages.en++; else languages.other++ }

  // opens: zones, moods, plans
  const op = stateOf(OPENS_COUNTED_FROM, lo, mEnd)
  const opens = inWindow.filter((e) => e.event_type === 'section_open' && (OPEN_KINDS as readonly string[]).includes(e.section ?? '') && t(e) >= op.from)
  const openOf = (kind: 'zone' | 'mood' | 'plan', label: (id: string) => string) =>
    sorted(tally(opens.filter((e) => e.section === kind && HOTEL_OPEN_SOURCES[kind].includes(e.source ?? '')), (e) => e.source), label)

  // places: Map taps with a place
  const pl = stateOf(PLACES_COUNTED_FROM, lo, mEnd)
  const taps = inWindow.filter((e) => e.event_type === 'outbound_click' && e.section === 'map' && e.place && t(e) >= pl.from)
  const byPlace = new Map<string, ReportEvent[]>()
  for (const e of taps) byPlace.set(e.place!, [...(byPlace.get(e.place!) ?? []), e])
  const items = [...byPlace.entries()].map(([id, evs]) => ({
    id, name: placeName(id), count: evs.length,
    where: sorted(tally(evs, (e) => e.source ?? 'unknown'), (s) => (s === 'unknown' ? (lang === 'es' ? 'Sin dato' : 'Not recorded') : whereLabel(s, lang))),
  })).sort((a, b) => b.count - a.count || a.id.localeCompare(b.id))

  const click = (s: string) => inWindow.filter((e) => e.event_type === 'outbound_click' && e.section === s).length
  const note = cf > mStart && cf < mEnd ? dateOfMx(cf) : null

  return {
    name: input.name, code: input.code, month,
    windowFrom: dateOfMx(lo), windowNote: note, partial: now < mEnd, empty,
    visits: { total: scans.length, weeks, languages },
    opens: { state: op.state, zones: openOf('zone', zoneLabel), moods: openOf('mood', (s) => moodLabel(s, lang)), plans: openOf('plan', (s) => planLabel(s, lang)) },
    places: { state: pl.state, items, total: taps.length },
    actions: { experience: click('experience_book'), planner: click('planner'), share: click('share') },
    ...(input.paid ? { paid: input.paid } : {}),
  }
}

const sum = (xs: Counted[]) => xs.reduce((n, x) => n + x.count, 0)
export const opensTotal = (p: PropertyReport) => sum(p.opens.zones) + sum(p.opens.moods) + sum(p.opens.plans)
export const actionsTotal = (p: PropertyReport) => p.actions.experience + p.actions.planner + p.actions.share

export function totalsOf(props: PropertyReport[]) {
  return {
    visits: props.reduce((n, p) => n + p.visits.total, 0),
    opens: props.reduce((n, p) => n + opensTotal(p), 0),
    places: props.reduce((n, p) => n + p.places.total, 0),
    actions: props.reduce((n, p) => n + actionsTotal(p), 0),
  }
}

/** Change against the previous month, only where BOTH months were fully counted (no count-from cut, nothing "not counted"). */
export function changeOf(now: PropertyReport[], before: PropertyReport[]): Change[] | null {
  if (before.length !== now.length || before.some((p) => p.empty || p.windowNote)) return null
  const bt = totalsOf(before), nt = totalsOf(now)
  const full = (s: SectionState, month: string) => s.kind === 'counted' && s.from === null && month !== ''
  const out: Change[] = [{ metric: 'visits', now: nt.visits, before: bt.visits }]
  if (before.every((p) => full(p.opens.state, p.month))) out.push({ metric: 'opens', now: nt.opens, before: bt.opens })
  if (before.every((p) => full(p.places.state, p.month))) out.push({ metric: 'places', now: nt.places, before: bt.places })
  out.push({ metric: 'actions', now: nt.actions, before: bt.actions })
  return out
}

// ── "What this tells you": fixed rules over the numbers, nothing else ──────────────────────────────────────────────────
export function insightsOf(props: PropertyReport[], lang: Lang): string[] {
  const es = lang === 'es'
  const merge = (pick: (p: PropertyReport) => Counted[]) => {
    const m = new Map<string, Counted>()
    for (const p of props) for (const c of pick(p)) m.set(c.id, { ...c, count: (m.get(c.id)?.count ?? 0) + c.count })
    return [...m.values()].sort((a, b) => b.count - a.count || a.id.localeCompare(b.id))
  }
  const top = (xs: Counted[]) => {
    if (xs.length === 0) return null
    const tied = xs.filter((x) => x.count === xs[0].count)
    return { names: tied.map((x) => x.label), count: xs[0].count, tie: tied.length > 1 }
  }
  const list = (names: string[]) => names.length < 2 ? names[0] : `${names.slice(0, -1).join(', ')} ${es ? 'y' : 'and'} ${names[names.length - 1]}`
  const out: string[] = []
  const mood = top(merge((p) => p.opens.moods))
  if (mood) out.push(mood.tie
    ? (es ? `Las opciones más abiertas empataron: ${list(mood.names)} (${mood.count} ${mood.count === 1 ? 'vez' : 'veces'} cada una).` : `The most opened moods tied: ${list(mood.names)} (${mood.count} ${mood.count === 1 ? 'time' : 'times'} each).`)
    : (es ? `La opción más abierta fue «${mood.names[0]}» (${mood.count} ${mood.count === 1 ? 'vez' : 'veces'}).` : `The most opened mood was “${mood.names[0]}” (${mood.count} ${mood.count === 1 ? 'time' : 'times'}).`))
  const place = top(props.flatMap((p) => p.places.items).reduce<Counted[]>((acc, it) => {
    const i = acc.findIndex((a) => a.id === it.id)
    if (i >= 0) acc[i] = { ...acc[i], count: acc[i].count + it.count }; else acc.push({ id: it.id, label: it.name, count: it.count })
    return acc
  }, []).sort((a, b) => b.count - a.count || a.id.localeCompare(b.id)))
  if (place) out.push(place.tie
    ? (es ? `Los lugares más tocados en el mapa empataron: ${list(place.names)} (${place.count} ${place.count === 1 ? 'toque' : 'toques'} cada uno).` : `The most tapped places tied: ${list(place.names)} (${place.count} ${place.count === 1 ? 'tap' : 'taps'} each).`)
    : (es ? `El lugar más tocado en el mapa fue ${place.names[0]} (${place.count} ${place.count === 1 ? 'toque' : 'toques'}).` : `The most tapped place on the map was ${place.names[0]} (${place.count} ${place.count === 1 ? 'tap' : 'taps'}).`))
  const plan = top(merge((p) => p.opens.plans))
  if (plan && !plan.tie) out.push(es ? `Entre los planes, los huéspedes eligieron más «${plan.names[0]}» (${plan.count}).` : `Among the plans, guests chose “${plan.names[0]}” most (${plan.count}).`)
  const v = props.reduce((n, p) => n + p.visits.total, 0)
  const l = props.reduce((a, p) => ({ es: a.es + p.visits.languages.es, en: a.en + p.visits.languages.en }), { es: 0, en: 0 })
  if (v > 0 && l.es !== l.en) {
    const main = l.es > l.en ? (es ? 'español' : 'Spanish') : (es ? 'inglés' : 'English'), n = Math.max(l.es, l.en)
    out.push(es ? `La mayoría de los escaneos abrió la guía en ${main} (${n} de ${v}).` : `Most scans opened the guide in ${main} (${n} of ${v}).`)
  }
  if (out.length === 0) return [es ? 'Todavía no hay suficientes datos este mes para sacar conclusiones.' : 'There is not enough data this month yet to draw conclusions.']
  return out.slice(0, 3)
}

export interface BuildOptions {
  edition: 'free' | 'paid'
  lang: Lang
  month: string
  brand?: Brand | null
  now?: number
}

export function buildReport(properties: PropertyInput[], o: BuildOptions): Report {
  const now = o.now ?? Date.now()
  const props = properties.map((p) => buildProperty(p, o.month, o.lang, now))
  const paid = o.edition === 'paid'
  const before = paid && properties.every((p) => p.prevEvents) ? properties.map((p) => buildProperty({ ...p, events: p.prevEvents! }, prevMonth(o.month), o.lang, now)) : null
  return {
    edition: o.edition, lang: o.lang, month: o.month, brand: paid ? (o.brand ?? null) : null,
    properties: props,
    totals: props.length > 1 ? totalsOf(props) : null,
    change: before ? changeOf(props, before) : null,
    insights: insightsOf(props, o.lang),
  }
}
