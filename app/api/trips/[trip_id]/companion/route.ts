// app/api/trips/[trip_id]/companion/route.ts
//
// PATCH /api/trips/[trip_id]/companion
//
// Persistence endpoint for the mobile companion view (app/[locale]/trips/
// [trip_id]). One read-modify-write so a save never clobbers fields the caller
// didn't send. Splits writes across the two columns by ownership:
//
//   trip_progress  ← annotations (per-item notes/links) + packing check-off.
//                    Owned solely by the companion view; replaced wholesale
//                    from the client's full progress state. The desktop
//                    planner never touches this column.
//
//   trip_data      ← doneChecks (task completion) + budgetRows[].actual.
//                    These already round-trip through the planner's autosave,
//                    so we read-modify-write the blob (preserve every other
//                    field) to keep a single source of truth shared with desktop.
//
// Auth model mirrors booking-confirm exactly:
//   - Authenticated trip (user_id set): caller must be the owner.
//   - Anonymous trip   (user_id null):  any caller who knows the trip_id may
//                                        write (URL-knowledge-gated, same as the
//                                        public trip read).
//
// Body shape (all fields optional — send only what changed):
//   {
//     progress?:      { annotations?: { [itemId]: { note?, link? } }, packedItems?: number[] },
//     doneChecks?:    string[],
//     budgetActuals?: { [rowId: string]: number | null }
//   }

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer, getSupabaseAdmin } from '../../../../../lib/supabase/server'
import { normalizeTripProgress } from '../../../../../lib/planner/progress'

type TripDataLike = {
  doneChecks?: unknown
  budgetRows?: Array<{ id?: string; actual?: number | null; [k: string]: unknown }>
  [k: string]: unknown
}

const MAX_CHECK_IDS = 500
const MAX_ID_LEN = 120

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ trip_id: string }> },
) {
  const { trip_id } = await params
  if (!trip_id) {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 })
  }

  try {
    // ── 1. Parse body ───────────────────────────────────────────────────────
    const body = (await req.json().catch(() => null)) as {
      progress?: unknown
      doneChecks?: unknown
      budgetActuals?: unknown
      budgetUserEsts?: unknown
    } | null

    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'invalid_payload' }, { status: 400 })
    }

    const hasProgress = body.progress !== undefined
    const hasDoneChecks = body.doneChecks !== undefined
    const hasBudget = body.budgetActuals !== undefined || body.budgetUserEsts !== undefined
    if (!hasProgress && !hasDoneChecks && !hasBudget) {
      return NextResponse.json({ error: 'invalid_payload' }, { status: 400 })
    }

    // ── 2. Fetch the trip via admin (bypass RLS for read; gated below) ───────
    const admin = getSupabaseAdmin()
    const { data: rawTrip, error: fetchErr } = await (admin as any)
      .from('trips')
      .select('id, user_id, trip_data, trip_progress')
      .eq('id', trip_id)
      .single()

    if (fetchErr || !rawTrip) {
      return NextResponse.json({ error: 'trip_not_found' }, { status: 404 })
    }

    const trip = rawTrip as {
      id: string
      user_id: string | null
      trip_data: TripDataLike
      trip_progress: unknown
    }

    // ── 3. Auth gate (identical to booking-confirm) ─────────────────────────
    if (trip.user_id !== null) {
      const supabase = await getSupabaseServer()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || trip.user_id !== user.id) {
        return NextResponse.json({ error: 'forbidden' }, { status: 403 })
      }
    }
    // Anonymous trip: user_id is null → allow update without auth.

    // ── 4. Build column updates ─────────────────────────────────────────────
    const updatePayload: { trip_progress?: unknown; trip_data?: TripDataLike } = {}

    // 4a. trip_progress — replace wholesale from the client's full state. The
    //     normalizer sanitizes notes (trim+cap) and links (scheme/length check
    //     via the shared booking sanitizer) and drops malformed entries.
    if (hasProgress) {
      updatePayload.trip_progress = normalizeTripProgress(body.progress)
    }

    // 4b. trip_data — read-modify-write so we never drop days/packing/etc.
    if (hasDoneChecks || hasBudget) {
      const nextTripData: TripDataLike = { ...(trip.trip_data ?? {}) }

      if (hasDoneChecks) {
        nextTripData.doneChecks = Array.isArray(body.doneChecks)
          ? Array.from(
              new Set(
                (body.doneChecks as unknown[]).filter(
                  (s): s is string => typeof s === 'string' && s.length > 0 && s.length <= MAX_ID_LEN,
                ),
              ),
            ).slice(0, MAX_CHECK_IDS)
          : []
      }

      if (hasBudget) {
        const actuals = (body.budgetActuals && typeof body.budgetActuals === 'object') ? body.budgetActuals as Record<string, unknown> : {}
        const ests    = (body.budgetUserEsts && typeof body.budgetUserEsts === 'object') ? body.budgetUserEsts as Record<string, unknown> : {}
        const coerce = (v: unknown): number | null => (typeof v === 'number' && isFinite(v) && v >= 0 ? Math.round(v) : null)
        const rows = Array.isArray(nextTripData.budgetRows) ? nextTripData.budgetRows : []
        nextTripData.budgetRows = rows.map(row => {
          if (!row || typeof row.id !== 'string') return row
          let next = row
          if (row.id in actuals) next = { ...next, actual:  coerce(actuals[row.id]) }
          if (row.id in ests)    next = { ...next, userEst: coerce(ests[row.id]) }
          return next
        })
      }

      updatePayload.trip_data = nextTripData
    }

    // ── 5. Single write ─────────────────────────────────────────────────────
    const { error: updateErr } = await (admin as any)
      .from('trips')
      .update(updatePayload)
      .eq('id', trip_id)

    if (updateErr) {
      console.error('[companion] update failed:', updateErr.message)
      return NextResponse.json({ error: 'internal_error' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[companion] error:', message)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}
