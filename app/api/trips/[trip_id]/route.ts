// app/api/trips/[trip_id]/route.ts
// GET    — fetch a saved trip by ID
// PATCH  — update title / trip_data (autosave)
// DELETE — remove a trip (owner-gated). Used by the regenerate/replaceTrip
//          flows to clean up the previous version after a successful save.

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer, getSupabaseAdmin } from '../../../../lib/supabase/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ trip_id: string }> },
) {
  const { trip_id } = await params

  if (!trip_id) {
    return NextResponse.json({ error: 'Missing trip_id' }, { status: 400 })
  }

  console.log('[trips/get] fetching trip_id:', trip_id)

  try {
    const supabase = await getSupabaseServer()

    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('id', trip_id)
      .single()

    if (error) {
      console.error('[trips/get] Supabase error:', error.message, error.code)
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.code === 'PGRST116' ? 404 : 500 },
      )
    }

    if (!data) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
    }

    console.log('[trips/get] found trip:', trip_id, '| title:', (data as any)?.title)
    return NextResponse.json(data)

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[trips/get] error:', message)
    return NextResponse.json({ error: `Internal error: ${message}` }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ trip_id: string }> },
) {
  const { trip_id } = await params
  if (!trip_id) return NextResponse.json({ error: 'Missing trip_id' }, { status: 400 })

  try {
    const body = await req.json()
    const {
      title, trip_data,
      travelers, travel_style, budget_level, interests,
      traveler_adults, traveler_children, traveler_group_count,
      currency,
    } = body

    const supabase = await getSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const updatePayload: Record<string, unknown> = {}
    if (title !== undefined)        updatePayload.title        = title || null
    if (trip_data !== undefined)    updatePayload.trip_data    = trip_data
    // Pref fields — only assigned when the client explicitly sends them so the
    // autosave path can choose to bundle them with content edits or not.
    if (travelers !== undefined)    updatePayload.travelers    = travelers || null
    if (travel_style !== undefined) updatePayload.travel_style = travel_style || null
    if (budget_level !== undefined) updatePayload.budget_level = budget_level || null
    if (Array.isArray(interests))   updatePayload.interests    = interests
    if (traveler_adults !== undefined) {
      const n = Number(traveler_adults)
      if (!isNaN(n)) updatePayload.traveler_adults = Math.min(Math.max(n, 1), 20)
    }
    if (Array.isArray(traveler_children)) {
      updatePayload.traveler_children = traveler_children
        .filter((c: any) => !!c && typeof c === 'object')
        .map((c: any) => ({
          type: c.type === 'baby' ? 'baby' : 'kid',
          age:  typeof c.age === 'string' ? c.age : '',
        }))
    }
    if (traveler_group_count !== undefined) {
      if (traveler_group_count === null) {
        updatePayload.traveler_group_count = null
      } else {
        const n = Number(traveler_group_count)
        if (!isNaN(n)) updatePayload.traveler_group_count = Math.min(Math.max(n, 2), 50)
      }
    }
    // currency — only accept the two known values; anything else is ignored
    // rather than 400ing the autosave.
    if (currency === 'USD' || currency === 'MXN') updatePayload.currency = currency

    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
    }

    // Use admin client for the write so RLS policies don't silently block the
    // UPDATE. Ownership is already verified above via getUser() + eq('user_id').
    const admin = getSupabaseAdmin()
    const { data: updated, error } = await admin
      .from('trips')
      .update(updatePayload as unknown as never)
      .eq('id', trip_id)
      .eq('user_id', user.id)   // ownership guard
      .select('id')

    if (error) {
      console.error('[trips/patch] update error:', error.message)
      return NextResponse.json({ error: `Update failed: ${error.message}` }, { status: 500 })
    }

    if (!updated || updated.length === 0) {
      console.warn('[trips/patch] no rows updated — trip_id:', trip_id, 'user_id:', user.id)
      return NextResponse.json({ error: 'Trip not found or not owned by user' }, { status: 404 })
    }

    console.log('[trips/patch] updated trip:', trip_id)
    return NextResponse.json({ success: true })

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[trips/patch] error:', message)
    return NextResponse.json({ error: `Internal error: ${message}` }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ trip_id: string }> },
) {
  const { trip_id } = await params
  if (!trip_id) return NextResponse.json({ error: 'Missing trip_id' }, { status: 400 })

  try {
    const supabase = await getSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Use admin client + explicit user_id guard so RLS can't silently no-op
    // and a different user's id in the URL can't delete someone else's row.
    const admin = getSupabaseAdmin()
    const { data: deleted, error } = await admin
      .from('trips')
      .delete()
      .eq('id', trip_id)
      .eq('user_id', user.id)
      .select('id')

    if (error) {
      console.error('[trips/delete] error:', error.message)
      return NextResponse.json({ error: `Delete failed: ${error.message}` }, { status: 500 })
    }

    if (!deleted || deleted.length === 0) {
      return NextResponse.json({ error: 'Trip not found or not owned by user' }, { status: 404 })
    }

    console.log('[trips/delete] removed trip:', trip_id)
    return NextResponse.json({ success: true })

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[trips/delete] error:', message)
    return NextResponse.json({ error: `Internal error: ${message}` }, { status: 500 })
  }
}
