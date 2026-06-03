// app/api/trips/[trip_id]/booking-confirm/route.ts
//
// PATCH /api/trips/[trip_id]/booking-confirm
//
// Merge a user-confirmed `booking` object into a specific entry of
// trip_data.accommodations. One narrow purpose: capture "Ya reservé"
// confirmations from the planner's hotel card. Does NOT touch any
// other column on the trips row.
//
// Auth model:
//   - Authenticated trip (user_id set): caller must be the owner.
//   - Anonymous trip   (user_id null):  any caller who knows the
//                                       trip_id can update. Anonymous
//                                       trips are URL-knowledge-gated
//                                       anyway — the security model
//                                       for them is identical to the
//                                       existing public trip read.
//
// Body shape:
//   { accommodationId: string, booking: BookingConfirmation }

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer, getSupabaseAdmin } from '../../../../../lib/supabase/server'

type BookingConfirmation = {
  confirmed:   boolean
  code:        string
  checkinTime: string
  notes:       string
}

type AccommodationLike = {
  id?:      string
  booking?: BookingConfirmation
  [k: string]: unknown
}

type TripDataLike = {
  accommodations?: AccommodationLike[]
  [k: string]: unknown
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ trip_id: string }> },
) {
  const { trip_id } = await params
  if (!trip_id) {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 })
  }

  try {
    // ── 1. Parse + validate body ────────────────────────────────────────────
    const body = await req.json().catch(() => null) as
      | { accommodationId?: unknown; booking?: Partial<BookingConfirmation> }
      | null

    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'invalid_payload' }, { status: 400 })
    }

    const accommodationId = typeof body.accommodationId === 'string' ? body.accommodationId.trim() : ''
    if (!accommodationId) {
      return NextResponse.json({ error: 'invalid_payload' }, { status: 400 })
    }

    const rawBooking = body.booking ?? {}
    const code = typeof rawBooking.code === 'string' ? rawBooking.code.trim() : ''
    if (!code) {
      // Confirmation number is the one required field — without it the
      // entry has no actionable content.
      return NextResponse.json({ error: 'invalid_payload' }, { status: 400 })
    }

    const booking: BookingConfirmation = {
      confirmed:   true,
      code:        code.slice(0, 50),
      checkinTime: typeof rawBooking.checkinTime === 'string' ? rawBooking.checkinTime.trim().slice(0, 10) : '',
      notes:       typeof rawBooking.notes       === 'string' ? rawBooking.notes.trim().slice(0, 280) : '',
    }

    // ── 2. Fetch the trip via admin (bypass RLS for read; we gate below) ────
    const admin = getSupabaseAdmin()
    const { data: rawTrip, error: fetchErr } = await (admin as any)
      .from('trips')
      .select('id, user_id, trip_data')
      .eq('id', trip_id)
      .single()

    if (fetchErr || !rawTrip) {
      return NextResponse.json({ error: 'accommodation_not_found' }, { status: 404 })
    }

    const trip = rawTrip as { id: string; user_id: string | null; trip_data: TripDataLike }

    // ── 3. Auth gate ────────────────────────────────────────────────────────
    if (trip.user_id !== null) {
      const supabase = await getSupabaseServer()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || trip.user_id !== user.id) {
        return NextResponse.json({ error: 'forbidden' }, { status: 403 })
      }
    }
    // Anonymous trip: user_id is null → allow update without auth.

    // ── 4. Find + merge the accommodation ───────────────────────────────────
    const accommodations = Array.isArray(trip.trip_data?.accommodations)
      ? trip.trip_data!.accommodations!
      : []
    const idx = accommodations.findIndex(a => a && a.id === accommodationId)
    if (idx < 0) {
      return NextResponse.json({ error: 'accommodation_not_found' }, { status: 404 })
    }

    const updatedAccommodations = accommodations.map((a, i) =>
      i === idx ? { ...a, booking } : a
    )

    const updatedTripData: TripDataLike = {
      ...trip.trip_data,
      accommodations: updatedAccommodations,
    }

    // ── 5. Write the full trip_data blob back ───────────────────────────────
    // Single-column update keeps the change auditable — every other column
    // on this row is untouched. The admin client bypasses RLS; ownership
    // was already verified in step 3 for authed trips.
    const { error: updateErr } = await (admin as any)
      .from('trips')
      .update({ trip_data: updatedTripData })
      .eq('id', trip_id)

    if (updateErr) {
      console.error('[booking-confirm] update failed:', updateErr.message)
      return NextResponse.json({ error: 'internal_error' }, { status: 500 })
    }

    return NextResponse.json({ success: true, accommodationId, booking }, { status: 200 })

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[booking-confirm] error:', message)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}
