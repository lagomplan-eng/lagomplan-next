// app/api/trips/share/[shareId]/route.ts
// GET — public endpoint that returns a safe preview of a shared trip.
//        Returns only: title, destination, duration_days, trip_id.
//        Does NOT return trip_data — that is only available post-auth.

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '../../../../../lib/supabase/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: { shareId: string } },
) {
  const { shareId } = params

  if (!shareId) {
    return NextResponse.json({ error: 'Missing shareId' }, { status: 400 })
  }

  // Use admin client — bypasses RLS so we can look up by share_id
  const supabase = getSupabaseAdmin()

  const { data: raw, error } = await supabase
    .from('trips')
    .select('id, title, destination, duration_days, is_shared')
    .eq('share_id' as any, shareId)
    .single()

  const data = raw as {
    id: string
    title: string | null
    destination: string | null
    duration_days: number | null
    is_shared: boolean
  } | null

  if (error || !data) {
    return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
  }

  if (!data.is_shared) {
    return NextResponse.json({ error: 'This trip is not shared' }, { status: 403 })
  }

  // Safe public preview — never expose trip_data or user_id
  return NextResponse.json({
    trip_id:       data.id,
    title:         data.title,
    destination:   data.destination,
    duration_days: data.duration_days,
  })
}
