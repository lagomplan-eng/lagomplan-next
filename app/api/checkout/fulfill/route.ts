// app/api/checkout/fulfill/route.ts
// POST { session_id } — fallback fulfillment for when the Stripe webhook
// doesn't fire (e.g. not configured in prod) or fires after the user
// has already landed on the success URL.
// Idempotent: skips if last_session_id already matches.

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getSupabaseServer, getSupabaseAdmin } from '../../../../lib/supabase/server'

export const dynamic = 'force-dynamic'

const PLAN_CREDITS: Record<string, number> = {
  'trip-1':  1,
  'trip-5':  5,
  'trip-10': 10,
}

export async function POST(req: NextRequest) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const supabase = await getSupabaseServer()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // ── Parse ─────────────────────────────────────────────────────────────────
  let session_id: string
  try {
    const body = await req.json()
    session_id = body.session_id ?? ''
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  if (!session_id) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 })
  }

  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  // ── Fetch Stripe session ──────────────────────────────────────────────────
  const stripe = new Stripe(secretKey)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let session: any
  try {
    session = await stripe.checkout.sessions.retrieve(session_id)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[fulfill] Stripe retrieve error:', msg)
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  // ── Verify ownership ──────────────────────────────────────────────────────
  const sessionUserId = session.metadata?.user_id ?? session.client_reference_id
  if (sessionUserId !== user.id) {
    console.error('[fulfill] user mismatch:', user.id, 'vs', sessionUserId)
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // ── Check payment status ──────────────────────────────────────────────────
  const isSettled = session.payment_status === 'paid' || session.payment_status === 'no_payment_required'
  if (!isSettled && session.mode !== 'subscription') {
    console.log('[fulfill] session not settled:', session.payment_status)
    return NextResponse.json({ fulfilled: false })
  }

  const admin = getSupabaseAdmin()

  // ── Idempotency check ─────────────────────────────────────────────────────
  const { data: row } = await (admin as any)
    .from('user_entitlements')
    .select('last_session_id, trips_remaining, tier')
    .eq('user_id', user.id)
    .single()

  if ((row as any)?.last_session_id === session_id) {
    console.log('[fulfill] already processed:', session_id)
    return NextResponse.json({ fulfilled: true, already: true })
  }

  const plan = session.metadata?.plan ?? ''

  // ── Fulfill ───────────────────────────────────────────────────────────────
  if (session.mode === 'subscription') {
    const stripeSubId = typeof session.subscription === 'string'
      ? session.subscription
      : session.subscription?.id ?? null

    const { error } = await (admin as any)
      .from('user_entitlements')
      .upsert({
        user_id:                user.id,
        tier:                   'explorer',
        trips_remaining:        0,
        stripe_customer_id:     session.customer ?? null,
        stripe_subscription_id: stripeSubId,
        last_session_id:        session_id,
        updated_at:             new Date().toISOString(),
      }, { onConflict: 'user_id' })

    if (error) {
      console.error('[fulfill] upsert explorer error:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    console.log('[fulfill] explorer granted for user:', user.id)

  } else {
    const toAdd = PLAN_CREDITS[plan] ?? 0
    if (toAdd === 0) {
      console.warn('[fulfill] unknown plan:', plan)
      return NextResponse.json({ fulfilled: false, reason: 'unknown_plan' })
    }

    const current = row as { trips_remaining: number; tier: string } | null
    const newRemaining = (current?.trips_remaining ?? 0) + toAdd
    const newTier = (!current || current.tier === 'free') ? 'per_trip' : current.tier

    const { error } = await (admin as any)
      .from('user_entitlements')
      .upsert({
        user_id:            user.id,
        tier:               newTier,
        trips_remaining:    newRemaining,
        stripe_customer_id: session.customer ?? null,
        last_session_id:    session_id,
        updated_at:         new Date().toISOString(),
      }, { onConflict: 'user_id' })

    if (error) {
      console.error('[fulfill] upsert credits error:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    console.log(`[fulfill] +${toAdd} credits for user:`, user.id, '→', newRemaining)
  }

  return NextResponse.json({ fulfilled: true })
}
