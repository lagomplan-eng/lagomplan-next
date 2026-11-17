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
  terms_accepted_at: string
  created_at: string
  approved_at: string | null
}

export const HOTEL_COLUMNS =
  'id, code, hotel_name, zone, requested_zone, contact_name, contact_email, maps_url, status, edition, lang, notes, email_opt_out, terms_accepted_at, created_at, approved_at'
