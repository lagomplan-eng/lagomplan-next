/**
 * @jest-environment node
 */
/**
 * The monthly hotel report: numbers against a fixture of events, "counted from" notes, the under-20 rule, the empty-section line,
 * the count-from date, a paid report with two properties, the email version and the sample.
 */
import { renderToStaticMarkup } from 'react-dom/server'
import ReportDoc from '../app/admin/hoteles/ReportDoc'
import { buildReport, buildProperty, canPercent } from '../lib/hotels/report/build'
import { toDoc, type Block, type Doc } from '../lib/hotels/report/doc'
import { renderEmail } from '../lib/hotels/report/email'
import { monthRange } from '../lib/hotels/report/period'
import { sampleReport, SAMPLE_MONTH } from '../lib/hotels/report/sample'
import type { PropertyInput, ReportEvent } from '../lib/hotels/report/types'

const ev = (iso: string, event_type: string, section: string | null, extra: Partial<ReportEvent> = {}): ReportEvent =>
  ({ event_type, section, lang: 'es', created_at: iso, ...extra })
const scan = (iso: string, lang = 'es') => ev(iso, 'scan', null, { lang })
const open = (iso: string, section: string, source: string) => ev(iso, 'section_open', section, { source })
const map = (iso: string, place: string, source: string) => ev(iso, 'outbound_click', 'map', { place, source })
const click = (iso: string, section: string) => ev(iso, 'outbound_click', section)

// November 2026, Mexico City. Mondays: Nov 2, 9, 16, 23, 30.
const FIXTURE: ReportEvent[] = [
  scan('2026-10-31T23:00:00Z'),                    // 2026-10-31 17:00 MX: October, not in the month
  scan('2026-11-01T05:59:59Z'),                    // 2026-10-31 23:59 MX: still October
  scan('2026-11-01T06:00:00Z'),                    // 2026-11-01 00:00 MX: first second of November (a Sunday, the week of Oct 26)
  scan('2026-11-03T18:00:00Z'), scan('2026-11-04T18:00:00Z', 'en'), scan('2026-11-10T18:00:00Z'),
  scan('2026-11-18T18:00:00Z', 'en'), scan('2026-11-25T18:00:00Z'), scan('2026-12-01T05:00:00Z'), // last one = 2026-11-30 23:00 MX
  scan('2026-12-01T06:00:00Z'),                    // December
  open('2026-11-24T18:00:00Z', 'mood', 'mood_hungry'),   // before opens were counted (26 Nov): ignored
  open('2026-11-27T18:00:00Z', 'mood', 'mood_hungry'), open('2026-11-27T19:00:00Z', 'mood', 'mood_hungry'), open('2026-11-28T18:00:00Z', 'mood', 'mood_dinner'),
  open('2026-11-27T20:00:00Z', 'zone', 'zone_roma_norte'), open('2026-11-29T20:00:00Z', 'plan', 'plan_48h'),
  map('2026-11-24T18:00:00Z', 'maleza', 'mood_dinner'),  // before places were counted (25 Nov): ignored
  map('2026-11-27T18:00:00Z', 'maleza', 'mood_dinner'), map('2026-11-28T18:00:00Z', 'maleza', 'zone_roma_norte'), map('2026-11-28T19:00:00Z', 'maleza', 'mood_dinner'),
  map('2026-11-29T18:00:00Z', 'contramar', 'plan_quick'),
  click('2026-11-10T18:00:00Z', 'experience_book'), click('2026-11-11T18:00:00Z', 'experience_book'), click('2026-11-12T18:00:00Z', 'planner'), click('2026-11-13T18:00:00Z', 'share'),
]
const hotel = (over: Partial<PropertyInput> = {}): PropertyInput => ({ name: 'Casa Cuenca', code: 'tjc9ckzteq', countFrom: '2026-11-01', approvedAt: '2026-11-01T18:00:00Z', events: FIXTURE, ...over })
const NOW = Date.UTC(2026, 11, 2, 12)
const free = (p: PropertyInput = hotel(), month = '2026-11', lang: 'es' | 'en' = 'es') => buildReport([p], { edition: 'free', lang, month, now: NOW })

describe('the numbers of a month match the events exactly', () => {
  const r = free().properties[0]
  test('month boundaries are Mexico City midnight', () => {
    const { start, end } = monthRange('2026-11')
    expect(new Date(start).toISOString()).toBe('2026-11-01T06:00:00.000Z')
    expect(new Date(end).toISOString()).toBe('2026-12-01T06:00:00.000Z')
  })
  test('visits: total, by week (Monday weeks, first one clipped to the 1st) and by language', () => {
    expect(r.visits.total).toBe(7)
    expect(r.visits.languages).toEqual({ es: 5, en: 2, other: 0 })
    expect(r.visits.weeks.map((w) => [w.weekStart, w.from, w.scans])).toEqual([
      ['2026-10-26', '2026-11-01', 1], ['2026-11-02', '2026-11-02', 2], ['2026-11-09', '2026-11-09', 1],
      ['2026-11-16', '2026-11-16', 1], ['2026-11-23', '2026-11-23', 1], ['2026-11-30', '2026-11-30', 1],
    ])
  })
  test('opens are counted from 26 Nov and by id', () => {
    expect(r.opens.moods.map((m) => [m.id, m.count])).toEqual([['mood_hungry', 2], ['mood_dinner', 1]])
    expect(r.opens.zones.map((m) => [m.id, m.count])).toEqual([['zone_roma_norte', 1]])
    expect(r.opens.plans.map((m) => [m.id, m.count])).toEqual([['plan_48h', 1]])
    expect(r.opens.moods[0].label).toBe('Tengo hambre')
  })
  test('places: count and where, counted from 25 Nov', () => {
    expect(r.places.items.map((p) => [p.id, p.count])).toEqual([['maleza', 3], ['contramar', 1]])
    expect(r.places.items[0].name).toBe('Maleza')
    expect(r.places.items[0].where.map((w) => [w.id, w.count])).toEqual([['mood_dinner', 2], ['zone_roma_norte', 1]])
    expect(r.places.total).toBe(4)
  })
  test('actions', () => { expect(r.actions).toEqual({ experience: 2, planner: 1, share: 1 }) })
})


// ── layout: how the numbers are laid out. (The numbers above and the "what this tells you" rules below do not depend on layout.)
const sec = (d: Doc, id: string) => d.sections.find((s) => s.id === id)
const bars = (d: Doc, id: string) => (sec(d, id)?.blocks ?? []).filter((b): b is Extract<Block, { t: 'bars' }> => b.t === 'bars')
const aboutText = (d: Doc) => (d.about?.lines ?? []).join(' ')
const doc = (r: ReturnType<typeof free>, o = {}) => toDoc(r, { now: NOW, ...o })

describe('"counted from" and "not counted": said once, near the end', () => {
  test('November starts before places (25 Nov) and moods/zones/plans (26 Nov) were counted: one line, both dates', () => {
    const r = free().properties[0]
    expect(r.opens.state).toEqual({ kind: 'counted', from: '2026-11-26' })
    expect(r.places.state).toEqual({ kind: 'counted', from: '2026-11-25' })
    const d = doc(free())
    expect(aboutText(d)).toContain('Contado desde: lugares, el 25 de noviembre de 2026; zonas, ánimos y planes, el 26 de noviembre de 2026.')
    expect(JSON.stringify(d.sections)).not.toMatch(/Contado desde|counted from/i) // never inside a section
  })
  test('December is fully counted: no counting line', () => {
    const r = free(hotel(), '2026-12').properties[0]
    expect(r.opens.state).toEqual({ kind: 'counted', from: null })
    expect(r.places.state).toEqual({ kind: 'counted', from: null })
    expect(aboutText(doc(free(hotel(), '2026-12')))).not.toContain('Contado desde')
  })
  test('a month before counting began: those sections are not shown, never a zero, and the about block says why', () => {
    const o = hotel({ countFrom: '2026-10-01', approvedAt: '2026-10-01T18:00:00Z' })
    const r = free(o, '2026-10').properties[0]
    expect(r.opens.state).toEqual({ kind: 'not_counted', from: '2026-11-26' })
    expect(r.places.state).toEqual({ kind: 'not_counted', from: '2026-11-25' })
    const d = doc(free(o, '2026-10'))
    expect(sec(d, 'looked')).toBeUndefined(); expect(sec(d, 'places')).toBeUndefined()
    expect(aboutText(d)).toContain('Todavía no se contaba este mes: lugares (se cuentan desde el 25 de noviembre de 2026); zonas, ánimos y planes (se cuentan desde el 26 de noviembre de 2026).')
  })
  test('English', () => {
    expect(aboutText(doc(free(hotel(), '2026-11', 'en')))).toContain('Counted since: places, November 25, 2026; zones, moods and plans, November 26, 2026.')
  })
})

describe('the under-20 rule', () => {
  test('percentages need a base of 20', () => { expect(canPercent(19)).toBe(false); expect(canPercent(20)).toBe(true) })
  const many = (n: number) => Array.from({ length: n }, (_, i) => scan(`2026-12-${String(2 + (i % 20)).padStart(2, '0')}T18:00:00Z`, i % 2 ? 'en' : 'es'))
  const langRows = (events: ReportEvent[]) => {
    const d = toDoc(buildReport([hotel({ events })], { edition: 'free', lang: 'es', month: '2026-12', now: NOW }), { now: NOW })
    return bars(d, 'visits').find((b) => b.title === 'Por idioma')!.rows.map((r) => r.text)
  }
  test('19 scans: counts only', () => { expect(langRows(many(19)).join(' ')).not.toContain('%') })
  test('20 scans: counts and percentages', () => { expect(langRows(many(20)).join(' ')).toContain('%') })
  test('the change against last month shows a percentage only when last month had 20 or more', () => {
    const run = (before: number) => {
      const events = [...many(3), ...Array.from({ length: before }, (_, i) => scan(`2026-11-${String(1 + (i % 28)).padStart(2, '0')}T18:00:00Z`))]
      const d = toDoc(buildReport([hotel({ events, prevEvents: events, countFrom: '2026-11-01' })], { edition: 'paid', lang: 'es', month: '2026-12', now: NOW }), { now: NOW })
      return JSON.stringify(sec(d, 'change'))
    }
    expect(run(10)).not.toContain('%')
    expect(run(25)).toContain('%')
  })
  test('the sentences of "what this tells you" never carry a percentage', () => {
    expect(free().insights.join(' ')).not.toContain('%')
  })
})

describe('a section with no data is not shown; the about block says which had no activity', () => {
  const empty = (lang: 'es' | 'en' = 'es') => toDoc(buildReport([hotel({ events: [] })], { edition: 'free', lang, month: '2026-12', now: NOW }), { now: NOW })
  test('no scans, opens, taps or actions: only "what this tells you" is left, with the calm line', () => {
    const d = empty()
    expect(d.sections.map((s) => s.id)).toEqual(['tells'])
    expect(d.figures).toEqual([])
    expect(aboutText(d)).toBe('Sin actividad este mes: visitas, zonas, ánimos y planes abiertos, lugares tocados, acciones.')
    expect(JSON.stringify(d.sections)).not.toMatch(/Ningún|No taps|este mes\./) // no per-section "none this month"
  })
  test('English', () => { expect(aboutText(empty('en'))).toBe('No activity this month: visits, zones, moods and plans opened, places tapped, actions.') })
  test('a bar group is never empty', () => {
    for (const d of [empty(), doc(free()), toDoc(sampleReport('es'), { now: Date.UTC(2027, 1, 3) })]) for (const s of d.sections) for (const b of s.blocks) if (b.t === 'bars') expect(b.rows.length).toBeGreaterThan(0)
  })
})

describe('bars', () => {
  const d = toDoc(sampleReport('es'), { now: Date.UTC(2027, 1, 3) })
  test('sorted by count, highest first (weeks stay in date order)', () => {
    for (const id of ['looked', 'places']) for (const b of bars(d, id)) expect(b.rows.map((r) => r.value)).toEqual([...b.rows.map((r) => r.value)].sort((a, c) => c - a))
    expect(bars(d, 'visits').find((b) => b.title === 'Por semana')!.rows.map((r) => r.label)[0]).toMatch(/^Semana del 1 ene/)
  })
  test('up to 8 rows, then "and N more"', () => {
    const many = Array.from({ length: 11 }, (_, i) => map('2026-12-05T18:00:00Z', `place${i}`, 'mood_dinner'))
    const ev = many.flatMap((e, i) => Array.from({ length: 11 - i }, () => ({ ...e })))
    const r = buildReport([hotel({ events: ev })], { edition: 'free', lang: 'en', month: '2026-12', now: NOW })
    // place ids that are not in the registry still print (their id); the cap is what matters here
    const b = bars(toDoc(r, { now: NOW }), 'places')[0]
    expect(b.rows).toHaveLength(8); expect(b.more).toBe(3); expect(b.moreText).toBe('and 3 more')
  })
  test('a week that has not started yet is not shown', () => {
    const half = toDoc(buildReport([hotel()], { edition: 'free', lang: 'en', month: '2026-11', now: Date.UTC(2026, 10, 12, 18) }), { now: Date.UTC(2026, 10, 12, 18) })
    const weeks = bars(half, 'visits').find((b) => b.title === 'By week')!.rows.map((r) => r.label)
    expect(weeks).toEqual(['Week of Nov 1', 'Week of Nov 2', 'Week of Nov 9']) // 16, 23 and 30 Nov have not started
  })
  test('bars scale to the largest value of their group', () => {
    const html = renderToStaticMarkup(<ReportDoc doc={d} />)
    expect(html).toContain('width:100%') // the largest row of a group fills its track
  })
})

describe('the band, the key figures and the order', () => {
  test('free: band figures are only the ones with data; "what this tells you" comes first; invitation, about, then the footer', () => {
    const d = doc(free())
    expect(d.eyebrow).toBe('Informe mensual'); expect(d.hotel).toBe('Casa Cuenca'); expect(d.monthLabel).toBe('noviembre de 2026')
    expect(d.figures).toEqual([
      { value: '7', label: 'Visitas' }, { value: '1', label: 'Guías enviadas a un teléfono' },
      { value: '2', label: 'Ánimo más abierto', sub: 'Tengo hambre' }, { value: '3', label: 'Lugar más tocado', sub: 'Maleza' },
    ])
    expect(d.sections.map((s) => [s.num, s.id])).toEqual([['01', 'tells'], ['02', 'visits'], ['03', 'looked'], ['04', 'places'], ['05', 'actions']])
    expect(d.invite!.title).toBe('Haz esta guía tuya'); expect(d.invite!.link.label).toBe('Hablemos')
    expect(d.preparedBy).toBe('Preparado por Lagomplan'); expect(d.verified).toBe('Solo lugares verificados. Nadie paga por aparecer.')
    expect(d.partial).toBeNull()
  })
  test('with little data the band shows only what exists, and a month in progress says so', () => {
    const r = buildReport([hotel({ events: [scan('2026-11-03T18:00:00Z')] })], { edition: 'free', lang: 'en', month: '2026-11', now: Date.UTC(2026, 10, 12) })
    const d = toDoc(r, { now: Date.UTC(2026, 10, 12) })
    expect(d.figures).toEqual([{ value: '1', label: 'Visits' }])
    expect(d.partial).toBe('Numbers up to today.')
    expect(d.eyebrow).toBe('Monthly report'); expect(d.verified).toBe('Verified places only. Nobody pays to be listed.')
  })
  test('actions stay three large figures', () => {
    const a = sec(doc(free()), 'actions')!.blocks[0]
    expect(a.t).toBe('figures')
    expect(a.t === 'figures' && a.items.map((i) => i.value)).toEqual(['2', '1', '1'])
  })
  test('the page prints the band, eyebrows 01.. and the A4 print rules', () => {
    const html = renderToStaticMarkup(<ReportDoc doc={doc(free())} />)
    expect(html).toContain('rp-band'); expect(html).toContain('>01<'); expect(html).toContain('@page{size:A4')
    expect(html).toContain('break-inside:avoid'); expect(html).toContain('.rp-noprint{display:none')
    expect(html).not.toMatch(/coral|#E8/i)
  })
})

describe('the count-from date', () => {
  test('visits before it are excluded and the about block says where it starts', () => {
    const r = buildProperty(hotel({ countFrom: '2026-11-10' }), '2026-11', 'es', NOW)
    expect(r.visits.total).toBe(4) // Nov 10, Nov 18, Nov 25, Nov 30
    expect(r.windowFrom).toBe('2026-11-10')
    expect(r.windowNote).toBe('2026-11-10')
    expect(aboutText(doc(free(hotel({ countFrom: '2026-11-10' }))))).toContain('Este informe cuenta desde el 10 de noviembre de 2026')
  })
  test('by default it is the approval day (Mexico City)', () => {
    const r = buildProperty(hotel({ countFrom: null, approvedAt: '2026-11-18T03:00:00Z' }), '2026-11', 'es', NOW) // 17 Nov 21:00 MX
    expect(r.windowFrom).toBe('2026-11-17')
    expect(r.visits.total).toBe(3) // Nov 18, Nov 25, Nov 30
  })
  test('a month entirely before it is empty, with its own message', () => {
    const r = buildProperty(hotel({ countFrom: '2026-12-15' }), '2026-11', 'es', NOW)
    expect(r.empty).toBe(true)
    expect(r.visits.total).toBe(0)
    expect(aboutText(doc(free(hotel({ countFrom: '2026-12-15' }))))).toContain('todavía no se contaba para este hotel')
  })
})

describe('a paid report with two properties adds up to its total', () => {
  const r = sampleReport('es')
  const d = toDoc(r, { sample: true, now: Date.UTC(2027, 1, 3) })
  test('totals are the sum of the properties', () => {
    expect(r.properties).toHaveLength(2)
    const sum = (f: (p: (typeof r.properties)[number]) => number) => r.properties.reduce((n, p) => n + f(p), 0)
    expect(r.totals!.visits).toBe(sum((p) => p.visits.total))
    expect(r.totals!.places).toBe(sum((p) => p.places.total))
    expect(r.totals!.actions).toBe(sum((p) => p.actions.experience + p.actions.planner + p.actions.share))
    expect(r.totals!.visits).toBeGreaterThan(0)
  })
  test('one line per property, then a total row that matches', () => {
    const t = sec(d, 'properties')!.blocks[0]
    if (t.t !== 'grid') throw new Error('grid expected')
    expect(t.rows.map((x) => x[0])).toEqual(['Casa Lagom Condesa', 'Casa Lagom Roma'])
    for (const col of [1, 2, 3, 4]) expect(t.rows.reduce((n, x) => n + Number(x[col]), 0)).toBe(Number(t.foot![col]))
  })
  test('the merged sections add up too: the band figure and the weeks equal the total', () => {
    expect(d.figures[0]).toEqual({ value: String(r.totals!.visits), label: 'Visitas' })
    const weeks = bars(d, 'visits').find((b) => b.title === 'Por semana')!
    expect(weeks.rows.reduce((n, x) => n + x.value, 0)).toBe(r.totals!.visits)
  })
  test('change against the previous month exists and is comparable', () => {
    expect(r.change!.map((c) => c.metric)).toEqual(['visits', 'opens', 'places', 'actions'])
  })
})

describe('free and paid differ where they should', () => {
  const pd = toDoc(buildReport([hotel({ events: FIXTURE, prevEvents: FIXTURE })], { edition: 'paid', lang: 'es', month: '2026-12', now: NOW, brand: { name: 'Casa Cuenca', colour: '#3D4F7C' } }), { now: NOW })
  test('free has the invitation and no brand or paid sections', () => {
    const d = doc(free())
    expect(d.invite).not.toBeNull(); expect(d.brand).toBeNull(); expect(d.poweredBy).toBeNull()
    expect(d.sections.some((s) => ['paid', 'change', 'properties'].includes(s.id))).toBe(false)
  })
  test('paid has the change section, brand and "powered by", no invitation; contacts only when that data exists', () => {
    expect(pd.invite).toBeNull(); expect(pd.poweredBy).toBe('con tecnología de Lagomplan'); expect(sec(pd, 'change')).toBeDefined(); expect(sec(pd, 'paid')).toBeUndefined()
    expect(sampleReport('es').properties.every((p) => p.paid)).toBe(true)
    expect(sec(toDoc(sampleReport('es'), { now: Date.UTC(2027, 1, 3) }), 'paid')).toBeDefined()
  })
  test('one property: no per-property section', () => { expect(sec(pd, 'properties')).toBeUndefined() })
})

describe('what this tells you', () => {
  test('is built from the numbers: most opened mood, most tapped place', () => {
    const t = free().insights
    expect(t[0]).toBe('La opción más abierta fue «Tengo hambre» (2 veces).')
    expect(t[1]).toBe('El lugar más tocado en el mapa fue Maleza (3 toques).')
    expect(t.length).toBeLessThanOrEqual(3)
  })
  test('ties are said as ties', () => {
    const e = [open('2026-12-02T18:00:00Z', 'mood', 'mood_hungry'), open('2026-12-02T19:00:00Z', 'mood', 'mood_dinner')]
    expect(buildReport([hotel({ events: e })], { edition: 'free', lang: 'en', month: '2026-12', now: NOW }).insights[0]).toMatch(/tied/)
  })
  test('with no data it says so instead of inventing something', () => {
    expect(buildReport([hotel({ events: [] })], { edition: 'free', lang: 'es', month: '2026-12', now: NOW }).insights).toEqual(['Todavía no hay suficientes datos este mes para sacar conclusiones.'])
  })
})

describe('the email version: the same report', () => {
  const d = doc(free())
  const html = renderEmail(d)
  test('is plain, email-safe HTML: tables and inline styles, system fonts, no coral', () => {
    expect(html).toMatch(/^<!doctype html>/)
    expect(html).not.toMatch(/<script|<style|class=|@import|<link|Manrope/i)
    expect(html).toContain('Helvetica'); expect(html).not.toMatch(/#E8|coral/i)
  })
  test('same structure and order as the page: band, figures, what this tells you, numbered sections, about, invitation, footer', () => {
    const at = (s: string) => html.indexOf(s)
    const order = ['Informe mensual', 'Casa Cuenca', 'noviembre de 2026', 'Ánimo más abierto', 'Lo que esto te dice', '>02<', 'Lo que miraron los huéspedes', 'Lugares que tocaron los huéspedes', 'Acciones', 'Sobre estas cifras', 'Haz esta guía tuya', 'Solo lugares verificados']
    const idx = order.map(at)
    expect(idx.every((i) => i >= 0)).toBe(true)
    expect([...idx].sort((a, b) => a - b)).toEqual(idx)
    for (const num of ['>01<', '>02<', '>03<', '>04<', '>05<']) expect(html).toContain(num)
  })
  test('bars are table cells with a background colour; the largest fills its track', () => {
    expect(html).toContain('bgcolor="#0F3A33"'); expect(html).toContain('bgcolor="#EDE7E1"'); expect(html).toContain('width="100%" height="10" bgcolor="#0F3A33"')
  })
  test('the same text as the page', () => {
    for (const s of d.sections) expect(html).toContain(s.title.replace(/&/g, '&amp;'))
    for (const f of d.figures) expect(html).toContain(f.label)
    expect(html).toContain(d.about!.lines[0])
  })
  test('escapes what it prints', () => {
    expect(renderEmail(doc(free(hotel({ name: 'A <b>&"' })))).includes('A &lt;b&gt;&amp;&quot;')).toBe(true)
  })
  test('images: absolute addresses when sent, relative inside the admin preview', () => {
    expect(html).toContain('src="https://www.lagomplan.com/images/report/lagomplan-logo-light.png"')
    expect(renderEmail(d, { assetBase: '' })).toContain('src="/images/report/lagomplan-logo-light.png"')
  })
  test('a paid report carries the client logo, the brand colour and "powered by Lagomplan"', () => {
    const h = renderEmail(toDoc(sampleReport('es'), { sample: true, now: Date.UTC(2027, 1, 3) }))
    expect(h).toContain('casa-lagom-sample.svg'); expect(h).toContain('#3D4F7C'); expect(h).toContain('con tecnología de Lagomplan'); expect(h).toContain('MUESTRA')
  })
})

describe('the sample', () => {
  test('is Casa Lagom, two invented properties, labelled as a sample in both languages', () => {
    const now = Date.UTC(2027, 1, 3)
    const es = toDoc(sampleReport('es'), { sample: true, now }), en = toDoc(sampleReport('en'), { sample: true, now })
    expect(es.sample).toMatch(/MUESTRA/); expect(en.sample).toMatch(/SAMPLE/)
    expect(es.hotel).toBe('Casa Lagom'); expect(es.monthLabel).toBe('enero de 2027'); expect(SAMPLE_MONTH).toBe('2027-01')
    expect(en.figures.length).toBe(4)
  })
})
