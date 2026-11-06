/**
 * tests/guide-timely.test.ts — the dated block at the bottom of a guide: it shows through
 * `validUntil` (inclusive, America/Mexico_City) and is gone from the next day; rows can expire
 * earlier; the adapter drops an expired block.
 *   npx tsx tests/guide-timely.test.ts
 */
import { activeRows, activeTimely, isTimelyActive, mexicoToday } from '../lib/data/guides/timely'
import { adaptFlatGuide } from '../lib/data/guides/adapter'
import { guideNow } from '../lib/data/guides/now'
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

// The adapter decides on the server, from the `now` it is given (guide pages revalidate hourly)
const flat = (timely?: FlatTimely): FlatGuide => ({
  slug: 'x', locale: 'es', hero: { title: 'X', subtitle: '', tags: [], image: '' }, itinerary: [], hotels: [], experiences: [], tips: [], checklist: [], transport: [], timely,
})
const at = (iso: string) => new Date(iso)
eq('adapter: last day (Nov 30, 12:00 CDMX) still has the block', adaptFlatGuide(flat(T), at('2026-11-30T18:00:00Z')).timely?.title, 'Semana de Thanksgiving 2026')
eq('adapter: Dec 1 00:00 in Mexico City: the block is gone', adaptFlatGuide(flat(T), at('2026-12-01T06:00:00Z')).timely, undefined)
eq('adapter: 05:59Z on Dec 1 is still Nov 30 in CDMX: still there', adaptFlatGuide(flat(T), at('2026-12-01T05:59:00Z')).timely?.title, 'Semana de Thanksgiving 2026')
eq('adapter: a row past its own until is dropped, the block stays (Nov 29)', adaptFlatGuide(flat(T), at('2026-11-29T18:00:00Z')).timely?.table?.rows.map((r) => r.what), ['Desfile'])
eq('adapter: a guide with no block has none', adaptFlatGuide(flat(), at('2026-11-01T18:00:00Z')).timely, undefined)

// GUIDE_NOW_OVERRIDE: dev only, never in production
eq('override: honoured outside production', guideNow({ GUIDE_NOW_OVERRIDE: '2026-12-01T12:00:00Z', NODE_ENV: 'development' }).toISOString(), '2026-12-01T12:00:00.000Z')
eq('override: ignored when NODE_ENV is production (every Vercel build, Preview included)', Math.abs(guideNow({ GUIDE_NOW_OVERRIDE: '2020-01-01T00:00:00Z', NODE_ENV: 'production' }).getTime() - Date.now()) < 5000, true)
eq('override: ignored on Vercel Production even if NODE_ENV were not production', Math.abs(guideNow({ GUIDE_NOW_OVERRIDE: '2020-01-01T00:00:00Z', NODE_ENV: 'development', VERCEL_ENV: 'production' }).getTime() - Date.now()) < 5000, true)
eq('override: a garbage value is ignored', Math.abs(guideNow({ GUIDE_NOW_OVERRIDE: 'not-a-date', NODE_ENV: 'development' }).getTime() - Date.now()) < 5000, true)
eq('override: unset means the real clock', Math.abs(guideNow({ NODE_ENV: 'development' }).getTime() - Date.now()) < 5000, true)

if (failed) { console.error(`\n${failed} failed`); process.exit(1) }
console.log('guide-timely: all passed')
