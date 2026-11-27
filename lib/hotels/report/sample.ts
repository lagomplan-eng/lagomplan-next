// lib/hotels/report/sample.ts — a SAMPLE paid report for the invented Casa Lagom (two invented properties, invented numbers).
// Nothing here is real; the page and the email both carry the "sample" banner. Deterministic, so tests can pin it.
import { buildReport } from './build'
import { monthRange } from './period'
import type { Lang, PropertyInput, Report, ReportEvent } from './types'

export const SAMPLE_MONTH = '2027-01'
export const SAMPLE_PREVIOUS = '2026-12'
export const SAMPLE_BRAND = { name: 'Casa Lagom', logoUrl: '/images/report/casa-lagom-sample.svg', colour: '#3D4F7C' }

function rng(seed: number) { let s = seed >>> 0; return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 2 ** 32) }

interface Plan { scans: number; es: number; opens: [string, string, number][]; maps: [string, string, number][]; exp: number; planner: number; share: number }

function events(month: string, seed: number, p: Plan): ReportEvent[] {
  const { start, end } = monthRange(month), r = rng(seed), out: ReportEvent[] = []
  const at = () => new Date(start + Math.floor(r() * (end - start - 1))).toISOString()
  for (let i = 0; i < p.scans; i++) out.push({ event_type: 'scan', section: null, lang: r() < p.es ? 'es' : 'en', created_at: at() })
  for (const [section, source, n] of p.opens) for (let i = 0; i < n; i++) out.push({ event_type: 'section_open', section, source, lang: 'es', created_at: at() })
  for (const [place, source, n] of p.maps) for (let i = 0; i < n; i++) out.push({ event_type: 'outbound_click', section: 'map', place, source, lang: 'es', created_at: at() })
  for (const [section, n] of [['experience_book', p.exp], ['planner', p.planner], ['share', p.share]] as const) for (let i = 0; i < n; i++) out.push({ event_type: 'outbound_click', section, lang: 'es', created_at: at() })
  return out
}

const CONDESA = (k: number): Plan => ({
  scans: Math.round(84 * k), es: 0.55,
  opens: [['mood', 'mood_dinner', Math.round(21 * k)], ['mood', 'mood_hungry', Math.round(15 * k)], ['mood', 'mood_culture', Math.round(9 * k)], ['zone', 'zone_roma_norte', Math.round(18 * k)], ['zone', 'zone_polanco', Math.round(7 * k)], ['plan', 'plan_48h', Math.round(12 * k)], ['plan', 'plan_quick', Math.round(6 * k)]],
  maps: [['maleza', 'mood_dinner', Math.round(5 * k)], ['contramar', 'zone_roma_norte', Math.round(4 * k)], ['parque_mexico', 'plan_quick', Math.round(3 * k)], ['rosetta', 'mood_dinner', Math.round(2 * k)]],
  exp: Math.round(14 * k), planner: Math.round(6 * k), share: Math.round(9 * k),
})
const ROMA = (k: number): Plan => ({
  scans: Math.round(31 * k), es: 0.4,
  opens: [['mood', 'mood_shop', Math.round(8 * k)], ['mood', 'mood_dinner', Math.round(5 * k)], ['zone', 'zone_condesa', Math.round(6 * k)], ['plan', 'plan_quick', Math.round(4 * k)]],
  maps: [['pujol', 'mood_dinner', Math.round(2 * k)], ['maleza', 'zone_condesa', Math.round(1 * k)]],
  exp: Math.round(4 * k), planner: Math.round(1 * k), share: Math.round(3 * k),
})

export function sampleInputs(): PropertyInput[] {
  const mk = (name: string, code: string, seed: number, now: Plan, before: Plan, paid: PropertyInput['paid']): PropertyInput => ({
    name, code, countFrom: null, approvedAt: '2026-11-27T18:00:00Z', paid,
    events: [...events(SAMPLE_MONTH, seed, now), ...events(SAMPLE_PREVIOUS, seed + 1, before)],
    prevEvents: undefined,
  })
  const list = [
    mk('Casa Lagom Condesa', 'sample0001', 11, CONDESA(1), CONDESA(0.85), { contact: 23, requests: [{ label: 'Traslado al aeropuerto', count: 9 }, { label: 'Reserva de restaurante', count: 7 }, { label: 'Late check-out', count: 4 }], reviews: 11, calendar: 31 }),
    mk('Casa Lagom Roma', 'sample0002', 21, ROMA(1), ROMA(1.1), { contact: 8, requests: [{ label: 'Reserva de restaurante', count: 5 }, { label: 'Traslado al aeropuerto', count: 2 }], reviews: 3, calendar: 12 }),
  ]
  return list.map((p) => ({ ...p, prevEvents: p.events }))
}

export function sampleReport(lang: Lang, now = Date.UTC(2027, 1, 3, 12)): Report {
  return buildReport(sampleInputs(), { edition: 'paid', lang, month: SAMPLE_MONTH, brand: SAMPLE_BRAND, now })
}
