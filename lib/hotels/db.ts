// lib/hotels/db.ts — service-role access to the hotel tables. Server only.
import { getSupabaseAdmin } from '../supabase/server'
import { HOTEL_COLUMNS, type HotelRow } from './types'

// The generated Database type doesn't know these tables.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const hotelsDb = () => getSupabaseAdmin() as any

export async function getHotelByCode(code: string): Promise<HotelRow | null> {
  const { data } = await hotelsDb().from('hotel_partners').select(HOTEL_COLUMNS).eq('code', code).maybeSingle()
  return (data as HotelRow) ?? null
}

export async function getHotelById(id: string): Promise<HotelRow | null> {
  const { data } = await hotelsDb().from('hotel_partners').select(HOTEL_COLUMNS).eq('id', id).maybeSingle()
  return (data as HotelRow) ?? null
}
