// lib/hotels/types.ts
export const HOTEL_STATUSES = ['pending', 'approved', 'rejected', 'paused', 'waitlist'] as const
export type HotelStatus = (typeof HOTEL_STATUSES)[number]

export interface HotelRow {
  id: string
  code: string
  hotel_name: string
  zone: 'condesa' | 'roma' | 'polanco' | null
  requested_zone: string | null
  contact_name: string
  contact_email: string
  maps_url: string | null
  status: HotelStatus
  edition: 'free' | 'paid'
  lang: 'es' | 'en'
  notes: string | null
  email_opt_out: boolean
  /** Optional signup fields (migration 20261118000000); absent until it is applied. */
  contact_phone?: string | null
  rooms?: number | null
  contact_role?: string | null
  /** Report "count from" date, set in /admin/hoteles (migration 20261127000000); absent until it is applied. "YYYY-MM-DD". */
  count_from?: string | null
  terms_accepted_at: string
  created_at: string
  approved_at: string | null
}

// '*' (not a column list) so reads keep working whether or not the optional-fields migration has been applied.
export const HOTEL_COLUMNS = '*'
