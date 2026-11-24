// lib/hotels/db.ts — service-role access to the hotel tables. Server only.
//
// NEVER CACHED. Next.js stores the result of every server-side GET fetch in its Data Cache, for up to a year, and it
// survives deployments. supabase-js reads through fetch, so a hotel lookup made while the hotel was paused kept being
// answered from the cache after the hotel was approved: /g/{code} kept redirecting without ?h= and no scan was ever
// written. A route's `dynamic = 'force-dynamic'` does not stop that in a route handler. This client therefore tells
// fetch `cache: 'no-store'` on every request, whatever the route says. Every hotel read and write goes through it.
import { createServerClient } from '@supabase/ssr'
import { supabaseServiceRoleKey, supabaseUrl } from '../supabase/env'
import { HOTEL_COLUMNS, type HotelRow } from './types'

/** fetch that bypasses the Next.js Data Cache. */
export const noStoreFetch: typeof fetch = (input, init) => fetch(input, { ...init, cache: 'no-store' })

// The generated Database type doesn't know these tables.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const hotelsDb = () => createServerClient(supabaseUrl(), supabaseServiceRoleKey(), {
  cookies: { get: () => '', set: () => {}, remove: () => {} },
  global: { fetch: noStoreFetch },
}) as any

export async function getHotelByCode(code: string): Promise<HotelRow | null> {
  const { data } = await hotelsDb().from('hotel_partners').select(HOTEL_COLUMNS).eq('code', code).maybeSingle()
  return (data as HotelRow) ?? null
}

export async function getHotelById(id: string): Promise<HotelRow | null> {
  const { data } = await hotelsDb().from('hotel_partners').select(HOTEL_COLUMNS).eq('id', id).maybeSingle()
  return (data as HotelRow) ?? null
}
