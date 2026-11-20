// lib/hotels/csv.ts — CSV of the dashboard table. Cells that start with = + - @ are prefixed so a
// spreadsheet never evaluates hotel-supplied text as a formula.
import type { HotelWithStats } from './stats'

const esc = (v: unknown) => {
  let s = v == null ? '' : String(v)
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export const CSV_HEADER = [
  'hotel', 'zone', 'requested_zone', 'status', 'edition', 'contact_name', 'contact_role', 'contact_email', 'contact_phone', 'rooms',
  'signup_date', 'approval_date', 'scans_30d', 'scans_total', 'last_scan', 'code', 'maps_url', 'notes',
]

export function hotelsToCsv(rows: HotelWithStats[]): string {
  const lines = [CSV_HEADER.join(',')]
  for (const h of rows) {
    lines.push([
      h.hotel_name, h.zone, h.requested_zone, h.status, h.edition, h.contact_name, h.contact_role, h.contact_email, h.contact_phone, h.rooms,
      h.created_at, h.approved_at, h.scans_30d, h.scans_total, h.last_scan, h.code, h.maps_url, h.notes,
    ].map(esc).join(','))
  }
  return lines.join('\n') + '\n'
}

export interface HotelFilters { status?: string; zone?: string; q?: string }

export function filterHotels<T extends HotelWithStats>(rows: T[], f: HotelFilters): T[] {
  const q = (f.q ?? '').trim().toLowerCase()
  return rows.filter((h) =>
    (!f.status || h.status === f.status) &&
    (!f.zone || (f.zone === 'other' ? !h.zone : h.zone === f.zone)) &&
    (!q || h.hotel_name.toLowerCase().includes(q)))
}
