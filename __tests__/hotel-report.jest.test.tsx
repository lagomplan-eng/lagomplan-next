/**
 * @jest-environment node
 */
/**
 * The monthly hotel report: numbers against a fixture of events, "counted from" notes, the under-20 rule, the empty-section line,
 * the count-from date, a paid report with two properties, the email version and the sample.
 */
import { buildReport, buildProperty, canPercent } from '../lib/hotels/report/build'
import { toDoc } from '../lib/hotels/report/doc'
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

describe('"counted from" notes', () => {
  test('November starts before the opens and places were counted: both notes, with their dates', () => {
    const r = free().properties[0]
    expect(r.opens.state).toEqual({ kind: 'counted', from: '2026-11-26' })
    expect(r.places.state).toEqual({ kind: 'counted', from: '2026-11-25' })
    const text = JSON.stringify(toDoc(free()))
    expect(text).toContain('Contado desde el 26 de noviembre de 2026')
    expect(text).toContain('Contado desde el 25 de noviembre de 2026')
  })
  test('December is fully counted: no note', () => {
    const r = free(hotel(), '2026-12').properties[0]
    expect(r.opens.state).toEqual({ kind: 'counted', from: null })
    expect(r.places.state).toEqual({ kind: 'counted', from: null })
    expect(JSON.stringify(toDoc(free(hotel(), '2026-12')))).not.toContain('Contado desde')
  })
  test('a month before counting began says so and never shows a zero or a table', () => {
    const r = free(hotel({ countFrom: '2026-10-01', approvedAt: '2026-10-01T18:00:00Z' }), '2026-10').properties[0]
    expect(r.opens.state).toEqual({ kind: 'not_counted', from: '2026-11-26' })
    expect(r.places.state).toEqual({ kind: 'not_counted', from: '2026-11-25' })
    const doc = toDoc(free(hotel({ countFrom: '2026-10-01', approvedAt: '2026-10-01T18:00:00Z' }), '2026-10'))
    const looked = doc.sections.find((s) => s.id === 'looked')!
    expect(looked.blocks.map((b) => b.t)).toEqual(['note'])
    expect(JSON.stringify(looked)).toContain('todavía no se registraba')
    expect(doc.sections.find((s) => s.id === 'places')!.blocks.map((b) => b.t)).toEqual(['note'])
  })
  test('English', () => {
    expect(JSON.stringify(toDoc(free(hotel(), '2026-11', 'en')))).toContain('Counted from November 26, 2026')
  })
})

describe('the under-20 rule', () => {
  test('percentages need a base of 20', () => { expect(canPercent(19)).toBe(false); expect(canPercent(20)).toBe(true) })
  const many = (n: number) => Array.from({ length: n }, (_, i) => scan(`2026-12-${String(2 + (i % 20)).padStart(2, '0')}T18:00:00Z`, i % 2 ? 'en' : 'es'))
  const langRows = (events: ReportEvent[]) => {
    const doc = toDoc(buildReport([hotel({ events })], { edition: 'free', lang: 'es', month: '2026-12', now: NOW }))
    const t = doc.sections.find((s) => s.id === 'visits')!.blocks.find((b) => b.t === 'table' && b.head[0] === 'Idioma')!
    return t.t === 'table' ? t.rows : []
  }
  test('19 scans: counts only', () => { expect(langRows(many(19)).flat().join(' ')).not.toContain('%') })
  test('20 scans: counts and percentages', () => { expect(langRows(many(20)).flat().join(' ')).toContain('%') })
  test('the change against last month shows a percentage only when last month had 20 or more', () => {
    const run = (before: number) => {
      const events = [...many(3), ...Array.from({ length: before }, (_, i) => scan(`2026-11-${String(1 + (i % 28)).padStart(2, '0')}T18:00:00Z`))]
      const doc = toDoc(buildReport([hotel({ events, prevEvents: events, countFrom: '2026-11-01' })], { edition: 'paid', lang: 'es', month: '2026-12', now: NOW }))
      return JSON.stringify(doc.sections.find((s) => s.id === 'change'))
    }
    expect(run(10)).not.toContain('%')
    expect(run(25)).toContain('%')
  })
  test('the sentences of "what this tells you" never carry a percentage', () => {
    expect(free().insights.join(' ')).not.toContain('%')
  })
})

describe('empty sections show one calm line', () => {
  const empty = (month = '2026-12') => toDoc(buildReport([hotel({ events: [] })], { edition: 'free', lang: 'es', month, now: NOW }))
  test('no taps, no opens, no actions, no scans', () => {
    const d = empty()
    expect(d.sections.find((s) => s.id === 'places')!.blocks).toEqual([{ t: 'p', text: 'Ningún toque en lugares este mes.' }])
    expect(d.sections.find((s) => s.id === 'looked')!.blocks).toEqual([{ t: 'p', text: 'Ninguna zona, ánimo ni plan abierto este mes.' }])
    expect(d.sections.find((s) => s.id === 'actions')!.blocks.map((b) => b.t)).toEqual(['p'])
    expect(d.sections.find((s) => s.id === 'visits')!.blocks.some((b) => b.t === 'table')).toBe(false)
    expect(d.sections.find((s) => s.id === 'tells')!.blocks).toHaveLength(1)
  })
  test('English line', () => {
    const d = toDoc(buildReport([hotel({ events: [] })], { edition: 'free', lang: 'en', month: '2026-12', now: NOW }))
    expect(d.sections.find((s) => s.id === 'places')!.blocks).toEqual([{ t: 'p', text: 'No taps on places this month.' }])
  })
  test('no table is ever empty', () => {
    for (const d of [empty(), toDoc(free()), toDoc(sampleReport('es'))]) for (const s of d.sections) for (const b of s.blocks) if (b.t === 'table') expect(b.rows.length).toBeGreaterThan(0)
  })
})

describe('the count-from date', () => {
  test('visits before it are excluded and the report says where it starts', () => {
    const r = buildProperty(hotel({ countFrom: '2026-11-10' }), '2026-11', 'es', NOW)
    expect(r.visits.total).toBe(4) // Nov 10, Nov 18, Nov 25, Nov 30
    expect(r.windowFrom).toBe('2026-11-10')
    expect(r.windowNote).toBe('2026-11-10')
    expect(JSON.stringify(toDoc(free(hotel({ countFrom: '2026-11-10' }))))).toContain('Este informe cuenta desde el 10 de noviembre de 2026')
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
    expect(JSON.stringify(toDoc(free(hotel({ countFrom: '2026-12-15' }))))).toContain('todavía no se contaba para este hotel')
  })
})

describe('a paid report with two properties adds up to its total', () => {
  const r = sampleReport('es')
  test('totals are the sum of the properties', () => {
    expect(r.properties).toHaveLength(2)
    const sum = (f: (p: (typeof r.properties)[number]) => number) => r.properties.reduce((n, p) => n + f(p), 0)
    expect(r.totals!.visits).toBe(sum((p) => p.visits.total))
    expect(r.totals!.places).toBe(sum((p) => p.places.total))
    expect(r.totals!.actions).toBe(sum((p) => p.actions.experience + p.actions.planner + p.actions.share))
    expect(r.totals!.visits).toBeGreaterThan(0)
  })
  test('the page: one line per property, then a total row that matches', () => {
    const props = toDoc(r, { sample: true }).sections.find((s) => s.id === 'properties')!
    const t = props.blocks[0]
    if (t.t !== 'table') throw new Error('table expected')
    expect(t.rows.map((x) => x[0])).toEqual(['Casa Lagom Condesa', 'Casa Lagom Roma'])
    for (const col of [1, 2, 3, 4]) expect(t.rows.reduce((n, x) => n + Number(x[col]), 0)).toBe(Number(t.foot![col]))
  })
  test('the merged sections add up too (visits by week and by language)', () => {
    const doc = toDoc(r, { sample: true })
    const visits = doc.sections.find((s) => s.id === 'visits')!
    const stats = visits.blocks.find((b) => b.t === 'stats')!
    expect(stats.t === 'stats' && stats.items[0].value).toBe(String(r.totals!.visits))
    const week = visits.blocks.find((b) => b.t === 'table' && b.head[0] === 'Semana del')!
    expect(week.t === 'table' && week.rows.reduce((n, x) => n + Number(x[1]), 0)).toBe(r.totals!.visits)
  })
  test('change against the previous month exists and is comparable', () => {
    expect(r.change!.map((c) => c.metric)).toEqual(['visits', 'opens', 'places', 'actions'])
  })
})

describe('free and paid differ where they should', () => {
  const pf = toDoc(free())
  const pd = toDoc(buildReport([hotel({ events: FIXTURE, prevEvents: FIXTURE })], { edition: 'paid', lang: 'es', month: '2026-12', now: NOW, brand: { name: 'Casa Cuenca', colour: '#3D4F7C' } }))
  test('free ends with the invitation, no brand, no paid sections', () => {
    expect(pf.sections.map((s) => s.id)).toEqual(['visits', 'looked', 'places', 'actions', 'tells', 'invite'])
    expect(pf.brand).toBeNull(); expect(pf.poweredBy).toBeNull()
    expect(pf.preparedBy).toBe('Preparado por Lagomplan')
  })
  test('paid has the change section, brand, "powered by", no invitation; contacts only when that data exists', () => {
    expect(pd.sections.map((s) => s.id)).toEqual(['visits', 'looked', 'places', 'actions', 'tells', 'change'])
    expect(pd.poweredBy).toBe('con tecnología de Lagomplan')
    expect(sampleReport('es').properties.every((p) => p.paid)).toBe(true)
    expect(toDoc(sampleReport('es')).sections.map((s) => s.id)).toContain('paid')
  })
  test('one property: no per-property section', () => { expect(pd.sections.some((s) => s.id === 'properties')).toBe(false) })
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

describe('the email version', () => {
  const html = renderEmail(toDoc(free()))
  test('is plain, email-safe HTML with the same content', () => {
    expect(html).toMatch(/^<!doctype html>/)
    expect(html).not.toMatch(/<script|<style|class=|@import|<link/i)
    expect(html).toContain('Casa Cuenca'); expect(html).toContain('noviembre de 2026'); expect(html).toContain('Preparado por Lagomplan')
    expect(html).toContain('Maleza')
    expect(html).not.toContain('#E8') // no coral
  })
  test('escapes what it prints', () => {
    expect(renderEmail(toDoc(free(hotel({ name: 'A <b>&"' })))).includes('A &lt;b&gt;&amp;&quot;')).toBe(true)
  })
  test('a paid report carries the logo and the brand colour', () => {
    const h = renderEmail(toDoc(sampleReport('es'), { sample: true }))
    expect(h).toContain('casa-lagom-sample.svg'); expect(h).toContain('#3D4F7C'); expect(h).toContain('con tecnología de Lagomplan'); expect(h).toContain('MUESTRA')
  })
})

describe('the sample', () => {
  test('is Casa Lagom, two invented properties, labelled as a sample in both languages', () => {
    const es = toDoc(sampleReport('es'), { sample: true }), en = toDoc(sampleReport('en'), { sample: true })
    expect(es.sample).toMatch(/MUESTRA/); expect(en.sample).toMatch(/SAMPLE/)
    expect(es.hotel).toBe('Casa Lagom'); expect(es.monthLabel).toBe('enero de 2027'); expect(SAMPLE_MONTH).toBe('2027-01')
  })
})
