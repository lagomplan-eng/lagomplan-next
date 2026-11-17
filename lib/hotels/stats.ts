// lib/hotels/stats.ts — dashboard numbers, computed server-side from hotel_guide_events (service role).
import { hotelsDb } from './db'
import { HOTEL_COLUMNS, type HotelRow } from './types'

export interface HotelWithStats extends HotelRow {
  scans_30d: number
  scans_total: number
  last_scan: string | null
}

export interface DashboardData {
  hotels: HotelWithStats[]
  totals: { live: number; pending: number; waitlist: number; scansThisMonth: number }
}

const DAY = 86_400_000
const PAGE = 1000
const MAX_ROWS = 200_000 // safety valve: far above what a pilot produces

/** Start of the current month in Mexico City (UTC-6, no DST since 2022), as epoch ms. */
export function monthStartMx(now = Date.now()): number {
  const mx = new Date(now - 6 * 3600_000)
  return Date.UTC(mx.getUTCFullYear(), mx.getUTCMonth(), 1, 6, 0, 0)
}

export async function loadDashboard(now = Date.now()): Promise<DashboardData> {
  const db = hotelsDb()
  const { data: hotelRows } = await db.from('hotel_partners').select(HOTEL_COLUMNS).order('created_at', { ascending: false })
  const hotels = (hotelRows ?? []) as HotelRow[]

  const total = new Map<string, number>()
  const d30 = new Map<string, number>()
  const last = new Map<string, string>()
  let thisMonth = 0
  const since30 = now - 30 * DAY
  const monthStart = monthStartMx(now)

  for (let from = 0; from < MAX_ROWS; from += PAGE) {
    const { data } = await db
      .from('hotel_guide_events')
      .select('hotel_id, created_at')
      .eq('event_type', 'scan')
      .order('id', { ascending: true })
      .range(from, from + PAGE - 1)
    const rows = (data ?? []) as { hotel_id: string; created_at: string }[]
    for (const r of rows) {
      const t = Date.parse(r.created_at)
      total.set(r.hotel_id, (total.get(r.hotel_id) ?? 0) + 1)
      if (t >= since30) d30.set(r.hotel_id, (d30.get(r.hotel_id) ?? 0) + 1)
      if (t >= monthStart) thisMonth += 1
      if (!last.get(r.hotel_id) || r.created_at > last.get(r.hotel_id)!) last.set(r.hotel_id, r.created_at)
    }
    if (rows.length < PAGE) break
  }

  const withStats: HotelWithStats[] = hotels.map((h) => ({
    ...h,
    scans_30d: d30.get(h.id) ?? 0,
    scans_total: total.get(h.id) ?? 0,
    last_scan: last.get(h.id) ?? null,
  }))
  return {
    hotels: withStats,
    totals: {
      live: hotels.filter((h) => h.status === 'approved').length,
      pending: hotels.filter((h) => h.status === 'pending').length,
      waitlist: hotels.filter((h) => h.status === 'waitlist').length,
      scansThisMonth: thisMonth,
    },
  }
}

export interface HotelDetailStats {
  weeks: { weekStart: string; scans: number }[]   // last 12 ISO weeks, oldest first
  topSections: { section: string; opens: number }[]
  outbound: { section: string; clicks: number }[]
}

/** Monday 00:00 (Mexico City) of the week containing `t`, as epoch ms. */
export function weekStartMx(t: number): number {
  const mx = new Date(t - 6 * 3600_000)
  const dow = (mx.getUTCDay() + 6) % 7 // Monday = 0
  return Date.UTC(mx.getUTCFullYear(), mx.getUTCMonth(), mx.getUTCDate() - dow, 6, 0, 0)
}

export async function loadHotelDetail(hotelId: string, now = Date.now()): Promise<HotelDetailStats> {
  const db = hotelsDb()
  const firstWeek = weekStartMx(now) - 11 * 7 * DAY
  const scans = new Map<number, number>()
  for (let i = 0; i < 12; i++) scans.set(firstWeek + i * 7 * DAY, 0)
  const opens = new Map<string, number>()
  const clicks = new Map<string, number>()

  for (let from = 0; from < MAX_ROWS; from += PAGE) {
    const { data } = await db
      .from('hotel_guide_events')
      .select('event_type, section, created_at')
      .eq('hotel_id', hotelId)
      .order('id', { ascending: true })
      .range(from, from + PAGE - 1)
    const rows = (data ?? []) as { event_type: string; section: string | null; created_at: string }[]
    for (const r of rows) {
      if (r.event_type === 'scan') {
        const w = weekStartMx(Date.parse(r.created_at))
        if (scans.has(w)) scans.set(w, scans.get(w)! + 1)
      } else if (r.event_type === 'section_open' && r.section) {
        opens.set(r.section, (opens.get(r.section) ?? 0) + 1)
      } else if (r.event_type === 'outbound_click' && r.section) {
        clicks.set(r.section, (clicks.get(r.section) ?? 0) + 1)
      }
    }
    if (rows.length < PAGE) break
  }
  const sorted = <T extends string>(m: Map<string, number>, k: T) =>
    [...m.entries()].sort((a, b) => b[1] - a[1]).map(([section, n]) => ({ section, [k]: n }))
  return {
    weeks: [...scans.entries()].map(([t, n]) => ({ weekStart: new Date(t).toISOString().slice(0, 10), scans: n })),
    topSections: sorted(opens, 'opens') as HotelDetailStats['topSections'],
    outbound: sorted(clicks, 'clicks') as HotelDetailStats['outbound'],
  }
}
