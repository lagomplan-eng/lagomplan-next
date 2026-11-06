/**
 * tests/guide-timely.test.ts — the dated block at the bottom of a guide: it shows through
 * `validUntil` (inclusive, America/Mexico_City) and is gone from the next day; rows can expire
 * earlier; the adapter drops an expired block.
 *   npx tsx tests/guide-timely.test.ts
 */
import { activeRows, activeTimely, isTimelyActive, mexicoToday } from '../lib/data/guides/timely'
import { adaptFlatGuide } from '../lib/data/guides/adapter'
import type { FlatGuide, FlatTimely } from '../lib/data/guides/types'

let failed = 0
const eq = (name: string, got: unknown, want: unknown) => {
  if (JSON.stringify(got) !== JSON.stringify(want)) { failed++; console.error(`FAIL ${name}\n   got:  ${JSON.stringify(got)}\n   want: ${JSON.stringify(want)}`) }
}

const T: FlatTimely = {
  validUntil: '2026-11-30',
  eyebrow: 'Esta temporada', title: 'Semana de Thanksgiving 2026', verifiedNote: 'Datos verificados el 23 de octubre de 2026.',
  whenTitle: 'Cuándo ir',
  table: { headers: ['Qué pasa', 'Fechas', 'Qué cambia'], rows: [
    { what: 'Desfile', when: 'Jueves 26', impact: 'Gratis' },
    { what: 'Cascanueces', when: 'Hasta el 28 de noviembre', impact: 'Estreno', until: '2026-11-28' },
  ] },
}

// "today" is the Mexico City date (UTC−6, no DST): 05:59Z is still the previous day
eq('today: 05:59:59Z Dec 1 is still Nov 30 in CDMX', mexicoToday(new Date('2026-12-01T05:59:59Z')), '2026-11-30')
eq('today: 06:00:00Z Dec 1 is Dec 1 in CDMX', mexicoToday(new Date('2026-12-01T06:00:00Z')), '2026-12-01')

eq('day before the last day: shown', isTimelyActive(T, '2026-11-29'), true)
eq('the last day (Nov 30): still shown', isTimelyActive(T, '2026-11-30'), true)
eq('the day after (Dec 1): gone', isTimelyActive(T, '2026-12-01'), false)
eq('a block without timely data is never active', isTimelyActive(undefined, '2026-11-01'), false)

eq('rows: both rows show up to their dates', activeRows(T.table!.rows, '2026-11-28').map((r) => r.what), ['Desfile', 'Cascanueces'])
eq('rows: a row is gone the day after its own until (Nov 29), the other stays', activeRows(T.table!.rows, '2026-11-29').map((r) => r.what), ['Desfile'])

eq('activeTimely: returns the block with its still-current rows', activeTimely(T, '2026-11-29')!.table!.rows.map((r) => r.what), ['Desfile'])
eq('activeTimely: undefined once expired', activeTimely(T, '2026-12-01'), undefined)
eq('activeTimely: undefined for a guide without the block', activeTimely(undefined, '2026-11-01'), undefined)

// The adapter drops an expired block, keeps a current one (real clock: validUntil far in the past / future)
const flat = (timely?: FlatTimely): FlatGuide => ({
  slug: 'x', locale: 'es', hero: { title: 'X', subtitle: '', tags: [], image: '' }, itinerary: [], hotels: [], experiences: [], tips: [], checklist: [], transport: [], timely,
})
eq('adapter: an expired block is dropped from the page data', adaptFlatGuide(flat({ ...T, validUntil: '2020-01-01' })).timely, undefined)
eq('adapter: a current block is passed through', adaptFlatGuide(flat({ ...T, validUntil: '2099-01-01' })).timely?.title, 'Semana de Thanksgiving 2026')
eq('adapter: a guide with no block has none', adaptFlatGuide(flat()).timely, undefined)

if (failed) { console.error(`\n${failed} failed`); process.exit(1) }
console.log('guide-timely: all passed')
