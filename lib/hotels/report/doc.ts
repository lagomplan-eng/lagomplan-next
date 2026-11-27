// lib/hotels/report/doc.ts — a Report as words: sections of simple blocks. Two renderers draw it (the admin page and the email),
// so the page, the PDF and the email can never disagree. Spanish by default.
import { actionsTotal, canPercent, opensTotal, pct } from './build'
import { dateStartMx } from './period'
import type { Brand, Counted, Lang, PropertyReport, Report, SectionState } from './types'

export interface Row { label: string; sub?: string; value: number; text: string }
export type Block =
  | { t: 'text'; paras: string[] }
  | { t: 'bars'; title?: string; rows: Row[]; more: number; moreText?: string }
  | { t: 'figures'; items: { label: string; value: string }[] }
  | { t: 'grid'; head: string[]; rows: string[][]; foot?: string[] }
export interface Section { id: string; num: string; title: string; blocks: Block[] }
export interface Figure { value: string; label: string; sub?: string }
export interface Doc {
  lang: Lang; eyebrow: string; hotel: string; monthLabel: string; sample: string | null
  brand: Brand | null; poweredBy: string | null
  figures: Figure[]; partial: string | null
  sections: Section[]
  about: { title: string; lines: string[] } | null
  invite: { title: string; text: string; link: { label: string; href: string } } | null
  preparedBy: string; verified: string
}

const MONTHS = {
  es: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
}
export function monthLabel(month: string, lang: Lang): string {
  const [y, m] = month.split('-').map(Number)
  return lang === 'es' ? `${MONTHS.es[m - 1]} de ${y}` : `${MONTHS.en[m - 1]} ${y}`
}
export function dayLabel(date: string, lang: Lang): string {
  const [y, m, d] = date.split('-').map(Number)
  return lang === 'es' ? `${d} de ${MONTHS.es[m - 1]} de ${y}` : `${MONTHS.en[m - 1]} ${d}, ${y}`
}
const dayLabelShort = (date: string, lang: Lang) => { const [, m, d] = date.split('-').map(Number); return lang === 'es' ? `Semana del ${d} ${MONTHS.es[m - 1].slice(0, 3)}` : `Week of ${MONTHS.en[m - 1].slice(0, 3)} ${d}` }

const S = {
  es: {
    prepared: 'Preparado por Lagomplan', verified: 'Solo lugares verificados. Nadie paga por aparecer.', powered: 'con tecnología de Lagomplan', eyebrow: 'Informe mensual',
    visits: 'Visitas', looked: 'Lo que miraron los huéspedes', places: 'Lugares que tocaron los huéspedes', actions: 'Acciones', tells: 'Lo que esto te dice',
    contacts: 'Contacto y servicios', change: 'Cambio frente al mes anterior', props: 'Por propiedad',
    byWeek: 'Por semana', byLang: 'Por idioma', es: 'Español', en: 'Inglés', other: 'Otro',
    zones: 'Zonas abiertas', moods: 'Ánimos abiertos', plans: 'Plan elegido',
    exp: 'Clics en experiencias', planner: 'Clics en el planificador', share: 'Guías enviadas a un teléfono',
    fVisits: 'Visitas', fShare: 'Guías enviadas a un teléfono', fMood: 'Ánimo más abierto', fPlace: 'Lugar más tocado',
    partial: 'Cifras hasta hoy.', moreN: (k: number) => `y ${k} más`,
    contact: 'Toques en el botón de contacto', requests: 'Solicitudes por servicio', reviews: 'Clics en reseñas', calendar: 'Aperturas del calendario',
    metric: 'Indicador', now: 'Este mes', before: 'Mes anterior', diff: 'Cambio', m_visits: 'Visitas', m_opens: 'Aperturas (zonas, ánimos, planes)', m_places: 'Toques en lugares', m_actions: 'Acciones',
    property: 'Propiedad', total: 'Total', opensCol: 'Aperturas', placesCol: 'Toques en lugares', actionsCol: 'Acciones',
    about: 'Sobre estas cifras',
    sinceLine: (a: string[]) => `Contado desde: ${a.join('; ')}.`, placesSince: (d: string) => `lugares, el ${d}`, opensSince: (d: string) => `zonas, ánimos y planes, el ${d}`,
    notYet: (a: string[]) => `Todavía no se contaba este mes: ${a.join('; ')}.`, notYetItem: (what: string, d: string) => `${what} (se cuentan desde el ${d})`,
    windowNote: (d: string) => `Este informe cuenta desde el ${d}, cuando empezó el conteo de este hotel.`, emptyMonth: (d: string) => `Este mes todavía no se contaba para este hotel: el conteo empieza el ${d}.`,
    quiet: (a: string[]) => `Sin actividad este mes: ${a.join(', ')}.`, qVisits: 'visitas', qLooked: 'zonas, ánimos y planes abiertos', qPlaces: 'lugares tocados', qActions: 'acciones',
    noChange: 'No hay un mes anterior comparable para mostrar el cambio.',
    invTitle: 'Haz esta guía tuya', invText: 'Tu marca, tus servicios, un calendario verificado y un informe más completo.', invLink: 'Hablemos',
    sampleBanner: 'MUESTRA · hotel inventado y datos de ejemplo. Nada de esto es real.',
  },
  en: {
    prepared: 'Prepared by Lagomplan', verified: 'Verified places only. Nobody pays to be listed.', powered: 'powered by Lagomplan', eyebrow: 'Monthly report',
    visits: 'Visits', looked: 'What guests looked at', places: 'Places guests tapped', actions: 'Actions', tells: 'What this tells you',
    contacts: 'Contact and services', change: 'Change against last month', props: 'By property',
    byWeek: 'By week', byLang: 'By language', es: 'Spanish', en: 'English', other: 'Other',
    zones: 'Zones opened', moods: 'Moods opened', plans: 'Plan chosen',
    exp: 'Experience clicks', planner: 'Planner clicks', share: 'Guides sent to a phone',
    fVisits: 'Visits', fShare: 'Guides sent to a phone', fMood: 'Most opened mood', fPlace: 'Most tapped place',
    partial: 'Numbers up to today.', moreN: (k: number) => `and ${k} more`,
    contact: 'Contact button taps', requests: 'Requests per service', reviews: 'Review clicks', calendar: 'Calendar opens',
    metric: 'Measure', now: 'This month', before: 'Last month', diff: 'Change', m_visits: 'Visits', m_opens: 'Opens (zones, moods, plans)', m_places: 'Taps on places', m_actions: 'Actions',
    property: 'Property', total: 'Total', opensCol: 'Opens', placesCol: 'Place taps', actionsCol: 'Actions',
    about: 'About these numbers',
    sinceLine: (a: string[]) => `Counted since: ${a.join('; ')}.`, placesSince: (d: string) => `places, ${d}`, opensSince: (d: string) => `zones, moods and plans, ${d}`,
    notYet: (a: string[]) => `Not being counted yet this month: ${a.join('; ')}.`, notYetItem: (what: string, d: string) => `${what} (counted from ${d})`,
    windowNote: (d: string) => `This report counts from ${d}, when counting began for this hotel.`, emptyMonth: (d: string) => `This month was not being counted for this hotel: counting starts on ${d}.`,
    quiet: (a: string[]) => `No activity this month: ${a.join(', ')}.`, qVisits: 'visits', qLooked: 'zones, moods and plans opened', qPlaces: 'places tapped', qActions: 'actions',
    noChange: 'There is no comparable previous month to show a change.',
    invTitle: 'Make this guide yours', invText: 'Your brand, your services, a verified calendar and a fuller report.', invLink: 'Talk to us',
    sampleBanner: 'SAMPLE · invented hotel and example data. None of this is real.',
  },
} as const

const n = (x: number) => String(x)
const MAX_ROWS = 8
const shareText = (c: number, base: number) => (canPercent(base) ? `${c} · ${pct(c, base)}` : n(c))

/** Rows sorted by the caller; scaled to the largest value; up to 8, the rest counted in "and N more". */
function bars(title: string | undefined, rows: Row[], lang: Lang): Block | null {
  if (rows.length === 0) return null
  const shown = rows.slice(0, MAX_ROWS), rest = rows.length - shown.length
  return { t: 'bars', ...(title ? { title } : {}), rows: shown, more: rest, ...(rest ? { moreText: S[lang].moreN(rest) } : {}) }
}
const fromCounted = (xs: Counted[]): Row[] => { const base = xs.reduce((a, c) => a + c.count, 0); return xs.map((c) => ({ label: c.label, value: c.count, text: shareText(c.count, base) })) }

/** One view over one or several properties: sums, merged lists. State of a part = the least-counted property's. */
export function mergeProperties(ps: PropertyReport[]): PropertyReport {
  if (ps.length === 1) return ps[0]
  const mergeC = (pick: (p: PropertyReport) => Counted[]) => {
    const m = new Map<string, Counted>()
    for (const p of ps) for (const c of pick(p)) m.set(c.id, { ...c, count: (m.get(c.id)?.count ?? 0) + c.count })
    return [...m.values()].sort((a, b) => b.count - a.count || a.id.localeCompare(b.id))
  }
  const state = (pick: (p: PropertyReport) => SectionState): SectionState => {
    const all = ps.map(pick)
    const counted = all.filter((s) => s.kind === 'counted') as Extract<SectionState, { kind: 'counted' }>[]
    if (counted.length === 0) return all[0]
    const froms = counted.map((s) => s.from).filter(Boolean) as string[]
    return { kind: 'counted', from: froms.length ? froms.sort().slice(-1)[0] : null }
  }
  const weeks = new Map<string, { weekStart: string; from: string; scans: number }>()
  for (const p of ps) for (const w of p.visits.weeks) weeks.set(w.weekStart, { ...w, scans: (weeks.get(w.weekStart)?.scans ?? 0) + w.scans, from: weeks.get(w.weekStart)?.from && weeks.get(w.weekStart)!.from < w.from ? weeks.get(w.weekStart)!.from : w.from })
  const places = new Map<string, { id: string; name: string; count: number; where: Map<string, Counted> }>()
  for (const p of ps) for (const it of p.places.items) {
    const e = places.get(it.id) ?? { id: it.id, name: it.name, count: 0, where: new Map() }
    e.count += it.count
    for (const w of it.where) e.where.set(w.id, { ...w, count: (e.where.get(w.id)?.count ?? 0) + w.count })
    places.set(it.id, e)
  }
  return {
    ...ps[0], name: ps.map((p) => p.name).join(' + '), code: '',
    windowNote: null, empty: ps.every((p) => p.empty), partial: ps.some((p) => p.partial),
    visits: {
      total: ps.reduce((a, p) => a + p.visits.total, 0), weeks: [...weeks.values()].sort((a, b) => a.weekStart.localeCompare(b.weekStart)),
      languages: ps.reduce((a, p) => ({ es: a.es + p.visits.languages.es, en: a.en + p.visits.languages.en, other: a.other + p.visits.languages.other }), { es: 0, en: 0, other: 0 }),
    },
    opens: { state: state((p) => p.opens.state), zones: mergeC((p) => p.opens.zones), moods: mergeC((p) => p.opens.moods), plans: mergeC((p) => p.opens.plans) },
    places: {
      state: state((p) => p.places.state), total: ps.reduce((a, p) => a + p.places.total, 0),
      items: [...places.values()].map((e) => ({ id: e.id, name: e.name, count: e.count, where: [...e.where.values()].sort((a, b) => b.count - a.count || a.id.localeCompare(b.id)) })).sort((a, b) => b.count - a.count || a.id.localeCompare(b.id)),
    },
    actions: ps.reduce((a, p) => ({ experience: a.experience + p.actions.experience, planner: a.planner + p.actions.planner, share: a.share + p.actions.share }), { experience: 0, planner: 0, share: 0 }),
  }
}


export function toDoc(r: Report, opts: { sample?: boolean; now?: number } = {}): Doc {
  const lang = r.lang, s = S[lang]
  const now = opts.now ?? Date.now()
  const v = mergeProperties(r.properties)
  const multi = r.properties.length > 1
  const paid = r.edition === 'paid'
  const counted = (st: SectionState) => st.kind === 'counted'
  const sections: Omit<Section, 'num'>[] = []
  const quiet: string[] = []

  // Key figures of the band: only the ones with data.
  const figures: Figure[] = []
  if (!v.empty) {
    if (v.visits.total > 0) figures.push({ value: n(v.visits.total), label: s.fVisits })
    if (v.actions.share > 0) figures.push({ value: n(v.actions.share), label: s.fShare })
    if (counted(v.opens.state) && v.opens.moods.length > 0) figures.push({ value: n(v.opens.moods[0].count), label: s.fMood, sub: v.opens.moods[0].label })
    if (counted(v.places.state) && v.places.items.length > 0) figures.push({ value: n(v.places.items[0].count), label: s.fPlace, sub: v.places.items[0].name })
  }

  // What this tells you (first).
  sections.push({ id: 'tells', title: s.tells, blocks: [{ t: 'text', paras: r.insights }] })

  if (!v.empty) {
    // Visits: by week (chronological; a week that has not started yet is not shown) and by language.
    if (v.visits.total === 0) quiet.push(s.qVisits)
    else {
      const L = v.visits.languages, total = v.visits.total
      const weeks = v.visits.weeks.filter((w) => dateStartMx(w.from) <= now).map((w) => ({ label: dayLabelShort(w.from, lang), value: w.scans, text: n(w.scans) }))
      const langs = ([['es', L.es], ['en', L.en], ['other', L.other]] as const).filter(([, c]) => c > 0).sort((a, b) => b[1] - a[1]).map(([k, c]) => ({ label: s[k], value: c, text: shareText(c, total) }))
      sections.push({ id: 'visits', title: s.visits, blocks: [bars(s.byWeek, weeks, lang), bars(s.byLang, langs, lang)].filter(Boolean) as Block[] })
    }
    // What guests looked at.
    const looked = counted(v.opens.state) ? [bars(s.zones, fromCounted(v.opens.zones), lang), bars(s.moods, fromCounted(v.opens.moods), lang), bars(s.plans, fromCounted(v.opens.plans), lang)].filter(Boolean) as Block[] : []
    if (looked.length) sections.push({ id: 'looked', title: s.looked, blocks: looked })
    else if (counted(v.opens.state)) quiet.push(s.qLooked)
    // Places.
    const placeRows: Row[] = v.places.items.map((it) => ({ label: it.name, sub: it.where.map((w) => `${w.label} ×${w.count}`).join(' · '), value: it.count, text: n(it.count) }))
    if (counted(v.places.state) && placeRows.length) sections.push({ id: 'places', title: s.places, blocks: [bars(undefined, placeRows, lang)!] })
    else if (counted(v.places.state)) quiet.push(s.qPlaces)
    // Actions.
    const a = v.actions
    if (a.experience + a.planner + a.share > 0) sections.push({ id: 'actions', title: s.actions, blocks: [{ t: 'figures', items: [{ label: s.exp, value: n(a.experience) }, { label: s.planner, value: n(a.planner) }, { label: s.share, value: n(a.share) }] }] })
    else quiet.push(s.qActions)
  }

  // Paid only.
  if (paid) {
    const withPaid = r.properties.filter((p) => p.paid)
    if (withPaid.length > 0) {
      const c = withPaid.reduce((a, p) => ({ contact: a.contact + p.paid!.contact, reviews: a.reviews + p.paid!.reviews, calendar: a.calendar + p.paid!.calendar }), { contact: 0, reviews: 0, calendar: 0 })
      const req = new Map<string, number>()
      for (const p of withPaid) for (const q of p.paid!.requests) req.set(q.label, (req.get(q.label) ?? 0) + q.count)
      const rows = [...req.entries()].sort((a, b) => b[1] - a[1]).map(([label, x]) => ({ label, value: x, text: n(x) }))
      const blocks: Block[] = [{ t: 'figures', items: [{ label: s.contact, value: n(c.contact) }, { label: s.reviews, value: n(c.reviews) }, { label: s.calendar, value: n(c.calendar) }] }]
      const b = bars(s.requests, rows, lang)
      if (b) blocks.push(b)
      sections.push({ id: 'paid', title: s.contacts, blocks })
    }
    if (r.change) {
      const label = { visits: s.m_visits, opens: s.m_opens, places: s.m_places, actions: s.m_actions }
      sections.push({
        id: 'change', title: s.change,
        blocks: [{ t: 'grid', head: [s.metric, s.now, s.before, s.diff], rows: r.change.map((c) => {
          const d = c.now - c.before, sign = d > 0 ? '+' : d < 0 ? '−' : ''
          return [label[c.metric], n(c.now), n(c.before), `${sign}${Math.abs(d)}${canPercent(c.before) ? ` (${d >= 0 ? '+' : '−'}${Math.abs(Math.round((d / c.before) * 100))}%)` : ''}`]
        }) }],
      })
    }
    if (multi && r.totals) {
      sections.push({
        id: 'properties', title: s.props,
        blocks: [{ t: 'grid', head: [s.property, s.fVisits, s.opensCol, s.placesCol, s.actionsCol],
          rows: r.properties.map((p) => [p.name, n(p.visits.total), n(opensTotal(p)), n(p.places.total), n(actionsTotal(p))]),
          foot: [s.total, n(r.totals.visits), n(r.totals.opens), n(r.totals.places), n(r.totals.actions)] }],
      })
    }
  }

  // About these numbers: what was counted since when, and what had no activity. Said once.
  const lines: string[] = []
  if (v.empty) lines.push(s.emptyMonth(dayLabel(v.windowFrom, lang)))
  else {
    if (!multi && v.windowNote) lines.push(s.windowNote(dayLabel(v.windowNote, lang)))
    const since: string[] = [], notYet: string[] = []
    if (v.places.state.kind === 'counted' && v.places.state.from) since.push(s.placesSince(dayLabel(v.places.state.from, lang)))
    if (v.opens.state.kind === 'counted' && v.opens.state.from) since.push(s.opensSince(dayLabel(v.opens.state.from, lang)))
    if (since.length) lines.push(s.sinceLine(since))
    if (v.places.state.kind === 'not_counted') notYet.push(s.notYetItem(lang === 'es' ? 'lugares' : 'places', dayLabel(v.places.state.from, lang)))
    if (v.opens.state.kind === 'not_counted') notYet.push(s.notYetItem(lang === 'es' ? 'zonas, ánimos y planes' : 'zones, moods and plans', dayLabel(v.opens.state.from, lang)))
    if (notYet.length) lines.push(s.notYet(notYet))
    if (quiet.length) lines.push(s.quiet(quiet))
  }
  if (paid && !r.change) lines.push(s.noChange)

  const numbered: Section[] = sections.map((x, i) => ({ ...x, num: String(i + 1).padStart(2, '0') }))
  return {
    lang, eyebrow: s.eyebrow, hotel: multi && r.brand ? r.brand.name : r.properties[0].name, monthLabel: monthLabel(r.month, lang),
    sample: opts.sample ? s.sampleBanner : null, brand: r.brand, poweredBy: paid && r.brand ? s.powered : null,
    figures, partial: v.partial ? s.partial : null, sections: numbered,
    about: lines.length ? { title: s.about, lines } : null,
    invite: paid ? null : { title: s.invTitle, text: s.invText, link: { label: s.invLink, href: lang === 'es' ? 'https://www.lagomplan.com/es/para-hoteles' : 'https://www.lagomplan.com/en/for-hotels' } },
    preparedBy: s.prepared, verified: s.verified,
  }
}
