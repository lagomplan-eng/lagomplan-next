// lib/hotels/report/doc.ts — a Report as words: sections of simple blocks. Two renderers draw it (the admin page and the email),
// so the page, the PDF and the email can never disagree. Spanish by default.
import { actionsTotal, canPercent, opensTotal, pct } from './build'
import type { Brand, Counted, Lang, PropertyReport, Report, SectionState } from './types'

export type Block =
  | { t: 'p'; text: string }
  | { t: 'note'; text: string }
  | { t: 'h'; text: string }
  | { t: 'stats'; items: { label: string; value: string }[] }
  | { t: 'table'; head: string[]; rows: string[][]; foot?: string[] }
export interface Section { id: string; title: string; blocks: Block[] }
export interface Doc {
  lang: Lang; title: string; hotel: string; monthLabel: string; preparedBy: string; sample: string | null
  brand: Brand | null; poweredBy: string | null; sections: Section[]
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
const shortDay = (date: string, lang: Lang) => { const [, m, d] = date.split('-').map(Number); return lang === 'es' ? `${d} ${MONTHS.es[m - 1].slice(0, 3)}` : `${MONTHS.en[m - 1].slice(0, 3)} ${d}` }

const S = {
  es: {
    prepared: 'Preparado por Lagomplan', powered: 'con tecnología de Lagomplan', title: 'Informe mensual de la guía',
    visits: 'Visitas', looked: 'Lo que miraron los huéspedes', places: 'Lugares que tocaron los huéspedes', actions: 'Acciones',
    tells: 'Lo que esto te dice', contacts: 'Contacto y servicios', change: 'Cambio frente al mes anterior', props: 'Por propiedad', invite: 'Y si quieres ir más lejos',
    scans: 'Escaneos del QR', week: 'Semana del', language: 'Idioma', es: 'Español', en: 'Inglés', other: 'Otro', of: 'de',
    zones: 'Zonas abiertas', moods: 'Ánimos abiertos', plans: 'Plan elegido', times: 'Veces', place: 'Lugar', taps: 'Toques', where: 'Dónde',
    exp: 'Clics en experiencias', planner: 'Clics en el planificador', share: 'Guías enviadas a un teléfono',
    noLooked: 'Ninguna zona, ánimo ni plan abierto este mes.', noPlaces: 'Ningún toque en lugares este mes.', noActions: 'Sin clics en experiencias, planificador ni guías enviadas este mes.',
    noVisits: 'Ningún escaneo este mes.', countedFrom: (d: string) => `Contado desde el ${d}.`, notCounted: (d: string) => `Esta parte todavía no se registraba en este mes: se cuenta desde el ${d}.`,
    windowNote: (d: string) => `Este informe cuenta desde el ${d} (inicio del conteo de este hotel).`, emptyMonth: (d: string) => `Este mes todavía no se contaba para este hotel: el conteo empieza el ${d}.`,
    partial: 'El mes no ha terminado: las cifras son hasta hoy.',
    contact: 'Toques en el botón de contacto', requests: 'Solicitudes por servicio', reviews: 'Clics en reseñas', calendar: 'Aperturas del calendario',
    metric: 'Indicador', now: 'Este mes', before: 'Mes anterior', diff: 'Cambio', m_visits: 'Escaneos', m_opens: 'Aperturas (zonas, ánimos, planes)', m_places: 'Toques en lugares', m_actions: 'Acciones',
    noChange: 'No hay un mes anterior comparable: el conteo empezó a mitad de ese mes o después.', property: 'Propiedad', total: 'Total', opensCol: 'Aperturas', placesCol: 'Toques en lugares', actionsCol: 'Acciones',
    inviteText: 'La edición de pago pone tu marca, tus servicios, un calendario verificado y un informe más completo en la guía de tus huéspedes. Escríbenos y te la mostramos con tu hotel.',
    sampleBanner: 'MUESTRA · hotel inventado y datos de ejemplo. Nada de esto es real.',
  },
  en: {
    prepared: 'Prepared by Lagomplan', powered: 'powered by Lagomplan', title: 'Monthly guide report',
    visits: 'Visits', looked: 'What guests looked at', places: 'Places guests tapped', actions: 'Actions',
    tells: 'What this tells you', contacts: 'Contact and services', change: 'Change against last month', props: 'By property', invite: 'And if you want to go further',
    scans: 'QR scans', week: 'Week of', language: 'Language', es: 'Spanish', en: 'English', other: 'Other', of: 'of',
    zones: 'Zones opened', moods: 'Moods opened', plans: 'Plan chosen', times: 'Times', place: 'Place', taps: 'Taps', where: 'Where',
    exp: 'Experience clicks', planner: 'Planner clicks', share: 'Guides sent to a phone',
    noLooked: 'No zone, mood or plan opened this month.', noPlaces: 'No taps on places this month.', noActions: 'No experience, planner or send-to-phone clicks this month.',
    noVisits: 'No scans this month.', countedFrom: (d: string) => `Counted from ${d}.`, notCounted: (d: string) => `This part was not being counted yet this month: counting starts on ${d}.`,
    windowNote: (d: string) => `This report counts from ${d} (when counting began for this hotel).`, emptyMonth: (d: string) => `This month was not being counted for this hotel: counting starts on ${d}.`,
    partial: 'The month is not over: figures are up to today.',
    contact: 'Contact button taps', requests: 'Requests per service', reviews: 'Review clicks', calendar: 'Calendar opens',
    metric: 'Measure', now: 'This month', before: 'Last month', diff: 'Change', m_visits: 'Scans', m_opens: 'Opens (zones, moods, plans)', m_places: 'Taps on places', m_actions: 'Actions',
    noChange: 'There is no comparable previous month: counting began in the middle of it or later.', property: 'Property', total: 'Total', opensCol: 'Opens', placesCol: 'Place taps', actionsCol: 'Actions',
    inviteText: 'The paid edition puts your brand, your services, a verified calendar and a fuller report in your guests’ guide. Write to us and we will show it with your hotel.',
    sampleBanner: 'SAMPLE · invented hotel and example data. None of this is real.',
  },
} as const

const n = (x: number) => String(x)
const withShare = (c: number, base: number) => (canPercent(base) ? `${c} (${pct(c, base)})` : n(c))
const noteFor = (s: SectionState, lang: Lang): Block | null =>
  s.kind === 'not_counted' ? { t: 'note', text: S[lang].notCounted(dayLabel(s.from, lang)) } : s.from ? { t: 'note', text: S[lang].countedFrom(dayLabel(s.from, lang)) } : null

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

export function toDoc(r: Report, opts: { sample?: boolean } = {}): Doc {
  const lang = r.lang, s = S[lang]
  const v = mergeProperties(r.properties)
  const multi = r.properties.length > 1
  const paid = r.edition === 'paid'
  const sections: Section[] = []

  // Notes that apply to the whole report.
  const lead: Block[] = []
  if (v.empty) lead.push({ t: 'note', text: s.emptyMonth(dayLabel(v.windowFrom, lang)) })
  else if (!multi && v.windowNote) lead.push({ t: 'note', text: s.windowNote(dayLabel(v.windowNote, lang)) })
  if (v.partial) lead.push({ t: 'note', text: s.partial })

  // 2. Visits
  const vb: Block[] = [...lead]
  if (v.empty || v.visits.total === 0) vb.push({ t: 'p', text: v.empty ? '' : s.noVisits })
  else {
    const L = v.visits.languages, total = v.visits.total
    vb.push({ t: 'stats', items: [{ label: s.scans, value: n(total) }] })
    vb.push({ t: 'table', head: [s.week, s.scans], rows: v.visits.weeks.map((w) => [shortDay(w.from, lang), n(w.scans)]) })
    vb.push({ t: 'table', head: [s.language, s.scans], rows: ([['es', L.es], ['en', L.en], ['other', L.other]] as const).filter(([, c]) => c > 0).map(([k, c]) => [s[k], withShare(c, total)]) })
  }
  sections.push({ id: 'visits', title: s.visits, blocks: vb.filter((b) => !(b.t === 'p' && b.text === '')) })

  // 3. What guests looked at
  const lb: Block[] = []
  if (!v.empty) {
    const note = noteFor(v.opens.state, lang)
    if (note) lb.push(note)
    if (v.opens.state.kind === 'counted') {
      const kinds: [string, Counted[]][] = [[s.zones, v.opens.zones], [s.moods, v.opens.moods], [s.plans, v.opens.plans]]
      const shown = kinds.filter(([, xs]) => xs.length > 0)
      if (shown.length === 0) lb.push({ t: 'p', text: s.noLooked })
      for (const [title, xs] of shown) {
        const base = xs.reduce((a, c) => a + c.count, 0)
        lb.push({ t: 'table', head: [title, s.times], rows: xs.map((c) => [c.label, withShare(c.count, base)]) })
      }
    }
  }
  if (!v.empty) sections.push({ id: 'looked', title: s.looked, blocks: lb })

  // 4. Places
  if (!v.empty) {
    const pb: Block[] = []
    const note = noteFor(v.places.state, lang)
    if (note) pb.push(note)
    if (v.places.state.kind === 'counted') {
      if (v.places.items.length === 0) pb.push({ t: 'p', text: s.noPlaces })
      else pb.push({ t: 'table', head: [s.place, s.taps, s.where], rows: v.places.items.map((it) => [it.name, n(it.count), it.where.map((w) => `${w.label} ×${w.count}`).join(' · ')]) })
    }
    sections.push({ id: 'places', title: s.places, blocks: pb })
  }

  // 5. Actions
  if (!v.empty) {
    const a = v.actions
    sections.push({ id: 'actions', title: s.actions, blocks: a.experience + a.planner + a.share === 0 ? [{ t: 'p', text: s.noActions }] : [{ t: 'stats', items: [{ label: s.exp, value: n(a.experience) }, { label: s.planner, value: n(a.planner) }, { label: s.share, value: n(a.share) }] }] })
  }

  // 6. What this tells you
  sections.push({ id: 'tells', title: s.tells, blocks: r.insights.map((text) => ({ t: 'p', text }) as Block) })

  // 7-9. Paid only
  if (paid) {
    const withPaid = r.properties.filter((p) => p.paid)
    if (withPaid.length > 0) {
      const c = withPaid.reduce((a, p) => ({ contact: a.contact + p.paid!.contact, reviews: a.reviews + p.paid!.reviews, calendar: a.calendar + p.paid!.calendar }), { contact: 0, reviews: 0, calendar: 0 })
      const req = new Map<string, number>()
      for (const p of withPaid) for (const q of p.paid!.requests) req.set(q.label, (req.get(q.label) ?? 0) + q.count)
      const blocks: Block[] = [{ t: 'stats', items: [{ label: s.contact, value: n(c.contact) }, { label: s.reviews, value: n(c.reviews) }, { label: s.calendar, value: n(c.calendar) }] }]
      if (req.size) blocks.push({ t: 'table', head: [s.requests, s.times], rows: [...req.entries()].sort((a, b) => b[1] - a[1]).map(([k, x]) => [k, n(x)]) })
      sections.push({ id: 'paid', title: s.contacts, blocks })
    }
    if (r.change) {
      const label = { visits: s.m_visits, opens: s.m_opens, places: s.m_places, actions: s.m_actions }
      sections.push({
        id: 'change', title: s.change,
        blocks: [{ t: 'table', head: [s.metric, s.now, s.before, s.diff], rows: r.change.map((c) => {
          const d = c.now - c.before, sign = d > 0 ? '+' : d < 0 ? '−' : ''
          return [label[c.metric], n(c.now), n(c.before), `${sign}${Math.abs(d)}${canPercent(c.before) ? ` (${d >= 0 ? '+' : '−'}${Math.abs(Math.round((d / c.before) * 100))}%)` : ''}`]
        }) }],
      })
    } else sections.push({ id: 'change', title: s.change, blocks: [{ t: 'p', text: s.noChange }] })
    if (multi && r.totals) {
      sections.push({
        id: 'properties', title: s.props,
        blocks: [{ t: 'table', head: [s.property, s.scans, s.opensCol, s.placesCol, s.actionsCol],
          rows: r.properties.map((p) => [p.name, n(p.visits.total), n(opensTotal(p)), n(p.places.total), n(actionsTotal(p))]),
          foot: [s.total, n(r.totals.visits), n(r.totals.opens), n(r.totals.places), n(r.totals.actions)] }],
      })
    }
  } else {
    // 11. Free only: a short invitation to the paid edition.
    sections.push({ id: 'invite', title: s.invite, blocks: [{ t: 'p', text: s.inviteText }] })
  }

  return {
    lang, title: s.title, hotel: multi && r.brand ? r.brand.name : r.properties[0].name, monthLabel: monthLabel(r.month, lang),
    preparedBy: s.prepared, sample: opts.sample ? s.sampleBanner : null,
    brand: r.brand, poweredBy: paid && r.brand ? s.powered : null, sections,
  }
}
