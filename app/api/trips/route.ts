// app/api/trips/route.ts
// Inserts a new trip into the database.
// Called only when the user explicitly clicks "Save".

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer } from '../../../lib/supabase/server'
import type { TravelerType, TravelStyle } from '../../../lib/supabase/types'

const VALID_TRAVELER_TYPES: TravelerType[] = ['solo', 'pareja', 'familia', 'amigos']
const VALID_TRAVEL_STYLES: TravelStyle[]   = ['relajado', 'equilibrado', 'activo']

function generateSlug(destination: string): string {
  const base = destination
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .slice(0, 30)
  const rand = Math.random().toString(36).slice(2, 7)
  return `${base}-${rand}`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      title,
      destination, origin, duration_days,
      travelers, travel_style, budget_level, interests, trip_data,
      traveler_adults, traveler_children, traveler_group_count,
      currency,
    } = body

    // ── Validation ────────────────────────────────────────────────────────────
    if (!trip_data) {
      return NextResponse.json({ error: 'Missing trip_data' }, { status: 400 })
    }
    if (!destination || typeof destination !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid destination' }, { status: 400 })
    }
    if (duration_days !== undefined && typeof duration_days !== 'number') {
      return NextResponse.json({ error: 'duration_days must be a number' }, { status: 400 })
    }

    // ── Auth ──────────────────────────────────────────────────────────────────
    const supabase = await getSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    console.log('[trips/post] getUser result:', { userId: user?.id ?? null, authError: authError?.message ?? null })

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // ── Normalise payload to match DB schema ──────────────────────────────────
    // travelers: traveler_type enum ('solo' | 'pareja' | 'familia' | 'amigos')
    const travelersRaw = travelers ? String(travelers).toLowerCase() : null
    const travelersValue: TravelerType | null = travelersRaw && VALID_TRAVELER_TYPES.includes(travelersRaw as TravelerType)
      ? (travelersRaw as TravelerType)
      : null

    // travel_style: travel_style enum ('relajado' | 'equilibrado' | 'activo')
    const travelStyleRaw = travel_style ? String(travel_style).toLowerCase() : null
    const travelStyleValue: TravelStyle | null = travelStyleRaw && VALID_TRAVEL_STYLES.includes(travelStyleRaw as TravelStyle)
      ? (travelStyleRaw as TravelStyle)
      : null

    // budget_level: TEXT — empty string treated as null
    const budgetLevelValue: string | null = budget_level && String(budget_level).trim()
      ? String(budget_level).trim()
      : null

    // interests: TEXT[] — already an array from frontend
    const interestsValue: string[] = Array.isArray(interests) ? interests : []

    // duration_days: INTEGER. 0 is a valid same-day value, so we can't use `||`.
    const rawDuration = Number(duration_days)
    const durationDaysValue: number = isNaN(rawDuration)
      ? 1
      : Math.min(Math.max(rawDuration, 0), 30)

    // ── Traveler details (Phase 2B columns) ───────────────────────────────────
    // Each defaults to the column default if omitted from the request body, so
    // older clients that don't send these fields keep working.
    const adultsRaw = Number(traveler_adults)
    const adultsValue: number | undefined = isNaN(adultsRaw) ? undefined : Math.min(Math.max(adultsRaw, 1), 20)

    const childrenValue: Array<{ type: 'baby' | 'kid'; age: string }> | undefined =
      Array.isArray(traveler_children)
        ? traveler_children
            .filter((c): c is { type: string; age: string } => !!c && typeof c === 'object')
            .map(c => ({
              type: c.type === 'baby' ? 'baby' as const : 'kid' as const,
              age:  typeof c.age === 'string' ? c.age : '',
            }))
        : undefined

    const groupRaw = Number(traveler_group_count)
    const groupValue: number | null | undefined = traveler_group_count === null
      ? null
      : isNaN(groupRaw) ? undefined : Math.min(Math.max(groupRaw, 2), 50)

    const slug = generateSlug(destination)

    const insertPayload: Record<string, unknown> = {
      slug,
      title:        title && String(title).trim() ? String(title).trim() : null,
      origin:       origin   ? String(origin)   : null,
      destination:  String(destination),
      duration_days: durationDaysValue,
      travelers:    travelersValue,
      travel_style: travelStyleValue,
      budget_level: budgetLevelValue,
      interests:    interestsValue,
      trip_data,
      user_id:      user.id,
    }
    if (adultsValue !== undefined)   insertPayload.traveler_adults      = adultsValue
    if (childrenValue !== undefined) insertPayload.traveler_children    = childrenValue
    if (groupValue !== undefined)    insertPayload.traveler_group_count = groupValue

    // currency: enum-style TEXT ('USD' | 'MXN'). Invalid values fall back to
    // the column default rather than 400ing the request.
    if (currency === 'USD' || currency === 'MXN') insertPayload.currency = currency

    console.log('[trips/post] inserting:', {
      ...insertPayload,
      trip_data: '[omitted]',
    })

    // ── Insert ────────────────────────────────────────────────────────────────
    const { data, error } = await supabase
      .from('trips')
      .insert(insertPayload as any)
      .select('id, slug')
      .single()

    if (error) {
      console.error('[trips/post] insert error:', error.message, error.details)
      return NextResponse.json(
        { error: `Insert failed: ${error.message}` },
        { status: 500 },
      )
    }

    const row = data as { id: string; slug: string }
    console.log('[trips/post] saved trip:', row.id, 'user:', user.id)
    return NextResponse.json({ success: true, trip_id: row.id, slug: row.slug })

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[trips/post] error:', message)
    return NextResponse.json({ error: `Internal error: ${message}` }, { status: 500 })
  }
}
