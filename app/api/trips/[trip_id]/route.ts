// app/api/trips/[trip_id]/route.ts
// Fetches a saved trip from Supabase by ID

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer } from '../../../../lib/supabase/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: { trip_id: string } },
) {
  const { trip_id } = params

  if (!trip_id) {
    return NextResponse.json({ error: 'Missing trip_id' }, { status: 400 })
  }

  console.log('[trips/get] fetching trip_id:', trip_id)

  try {
    const supabase = getSupabaseServer()

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
  { params }: { params: { trip_id: string } },
) {
  const { trip_id } = params

  if (!trip_id) {
    return NextResponse.json({ error: 'Missing trip_id' }, { status: 400 })
  }

  try {
    const body = await req.json()
    const updatePayload: Record<string, unknown> = body

    const supabase = getSupabaseServer()

    const { data, error } = await supabase
      .from('trips')
      // Double assertion required: Supabase generated types collapse the update
      // parameter to `never` when the table type is strict. `as any` alone is still
      // rejected; going through `unknown` first satisfies the compiler without
      // changing runtime behavior.
      .update(updatePayload as unknown as never)
      .eq('id', trip_id)
      .select()
      .single()

    if (error) {
      console.error('[trips/patch] Supabase error:', error.message, error.code)
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.code === 'PGRST116' ? 404 : 500 },
      )
    }

    return NextResponse.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[trips/patch] error:', message)
    return NextResponse.json({ error: `Internal error: ${message}` }, { status: 500 })
  }
}
