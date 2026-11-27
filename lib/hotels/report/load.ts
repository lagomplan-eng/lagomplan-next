// lib/hotels/report/load.ts — reads the events of a hotel for a month (and the month before) and builds its report. Server only.
import { hotelsDb, getHotelByCode, getHotelById } from '../db'
import { resolveHotelCode } from '../aliases'
import { isValidHotelCode } from '../codes'
import type { HotelRow } from '../types'
import { buildReport } from './build'
import { monthRange, prevMonth } from './period'
import type { Brand, Lang, Report, ReportEvent } from './types'

const PAGE = 1000
const MAX_ROWS = 200_000
const UUID = /^[0-9a-f-]{36}$/i

/** A hotel by uuid, random code or readable alias (/admin/hoteles/casa-cuenca/reportes). */
export async function findHotel(idOrCode: string): Promise<HotelRow | null> {
  if (UUID.test(idOrCode)) return getHotelById(idOrCode)
  const code = resolveHotelCode(idOrCode)
  return isValidHotelCode(code) ? getHotelByCode(code) : null
}

export async function loadEvents(hotelId: string, fromMs: number, toMs: number): Promise<ReportEvent[]> {
  const db = hotelsDb()
  const out: ReportEvent[] = []
  for (let from = 0; from < MAX_ROWS; from += PAGE) {
    const q = (cols: string) => db.from('hotel_guide_events').select(cols).eq('hotel_id', hotelId)
      .gte('created_at', new Date(fromMs).toISOString()).lt('created_at', new Date(toMs).toISOString()).order('id', { ascending: true }).range(from, from + PAGE - 1)
    let { data, error } = await q('event_type, section, place, source, lang, created_at')
    if (error && (error.code === '42703' || error.code === 'PGRST204')) ({ data, error } = await q('event_type, section, lang, created_at')) // place/source migration not applied
    if (error) throw new Error(`events read failed: ${error.code}`)
    const rows = (data ?? []) as ReportEvent[]
    out.push(...rows)
    if (rows.length < PAGE) break
  }
  return out
}

/** The report of one hotel for "YYYY-MM". Free and paid read the same events; paid adds the change against last month. */
export async function loadHotelReport(hotel: HotelRow, month: string, lang: Lang, brand: Brand | null = null): Promise<Report> {
  const prev = prevMonth(month)
  const events = await loadEvents(hotel.id, monthRange(prev).start, monthRange(month).end)
  const countFrom = (hotel as HotelRow & { count_from?: string | null }).count_from ?? null
  return buildReport([{ name: hotel.hotel_name, code: hotel.code, countFrom, approvedAt: hotel.approved_at, events, prevEvents: events }], { edition: hotel.edition, lang, month, brand })
}
