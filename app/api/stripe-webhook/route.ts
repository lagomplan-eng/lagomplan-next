// app/api/stripe-webhook/route.ts
// Stripe webhook receiver — updates user_entitlements in Supabase after payment.
//
// Required env var:
//   STRIPE_WEBHOOK_SECRET    whsec_... (from Stripe Dashboard → Webhooks)
//   STRIPE_SECRET_KEY        sk_live_... or sk_test_...
//
// Events handled:
//   checkout.session.completed  → add credits (one-time) or upgrade to explorer (subscription)
//   customer.subscription.deleted → revert explorer → free

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getSupabaseAdmin } from '../../../lib/supabase/server'

export const dynamic = 'force-dynamic'

// Credits granted per one-time plan
const PLAN_CREDITS: Record<string, number> = {
  'trip-1':  1,
  'trip-5':  5,
  'trip-10': 10,
}

export async function POST(req: NextRequest) {
  const secretKey     = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!secretKey || !webhookSecret) {
    console.error('[stripe-webhook] Missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET')
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  // ── Validate Stripe signature ────────────────────────────────────────────────
  const body = await req.text()
  const sig  = req.headers.get('stripe-signature') ?? ''

  const stripe = new Stripe(secretKey)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let event: any

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[stripe-webhook] Signature validation failed:', msg)
    return NextResponse.json({ error: `Invalid signature: ${msg}` }, { status: 400 })
  }

  console.log('[stripe-webhook] received event:', event.type)

  // ── Handle events ────────────────────────────────────────────────────────────

  if (event.type === 'checkout.session.completed') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session: any = event.data.object

    // payment_status is 'no_payment_required' when a 100% coupon is applied
    const isSettled = session.payment_status === 'paid' || session.payment_status === 'no_payment_required'
    if (!isSettled && session.mode !== 'subscription') {
      return NextResponse.json({ received: true })
    }

    const userId = session.metadata?.user_id ?? session.client_reference_id
    const plan   = session.metadata?.plan ?? ''

    if (!userId) {
      console.error('[stripe-webhook] checkout.session.completed: no user_id in metadata')
      return NextResponse.json({ error: 'No user_id' }, { status: 400 })
    }

    const admin = getSupabaseAdmin()

    // Idempotency: skip if this session was already fulfilled
    const { data: existing0 } = await (admin as any)
      .from('user_entitlements')
      .select('last_session_id')
      .eq('user_id', userId)
      .single()
    if ((existing0 as any)?.last_session_id === session.id) {
      console.log('[stripe-webhook] already processed session:', session.id)
      return NextResponse.json({ received: true })
    }

    if (session.mode === 'subscription') {
      // ── Upgrade to Explorer (unlimited) ──────────────────────────────────────
      const stripeSubId = typeof session.subscription === 'string'
        ? session.subscription
        : session.subscription?.id ?? null

      const { error } = await (admin as any)
        .from('user_entitlements')
        .upsert({
          user_id:                userId,
          tier:                   'explorer',
          trips_remaining:        0,
          stripe_customer_id:     session.customer as string | null,
          stripe_subscription_id: stripeSubId,
          last_session_id:        session.id,
          updated_at:             new Date().toISOString(),
        }, { onConflict: 'user_id' })

      if (error) console.error('[stripe-webhook] upsert explorer error:', error.message)
      else       console.log('[stripe-webhook] user upgraded to explorer:', userId)

    } else {
      // ── Add one-time credits ──────────────────────────────────────────────────
      const toAdd = PLAN_CREDITS[plan] ?? 0
      if (toAdd === 0) {
        console.warn('[stripe-webhook] unknown plan for credits:', plan)
        return NextResponse.json({ received: true })
      }

      // Fetch current row (upsert-safe)
      const { data: existing } = await (admin as any)
        .from('user_entitlements')
        .select('trips_remaining, tier')
        .eq('user_id', userId)
        .single()

      const current = existing as { trips_remaining: number; tier: string } | null
      const newRemaining = (current?.trips_remaining ?? 0) + toAdd
      // Resolve tier: 'free' → 'per_trip', keep higher tiers as-is
      const newTier = (!current || current.tier === 'free') ? 'per_trip' : current.tier

      const { error } = await (admin as any)
        .from('user_entitlements')
        .upsert({
          user_id:            userId,
          tier:               newTier,
          trips_remaining:    newRemaining,
          stripe_customer_id: session.customer as string | null,
          last_session_id:    session.id,
          updated_at:         new Date().toISOString(),
        }, { onConflict: 'user_id' })

      if (error) console.error('[stripe-webhook] upsert credits error:', error.message)
      else       console.log(`[stripe-webhook] +${toAdd} credits for user:`, userId, '→', newRemaining)
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sub: any = event.data.object
    const userId = sub.metadata?.user_id

    if (!userId) {
      // Fallback: look up by stripe_subscription_id
      const admin = getSupabaseAdmin()
      const { data } = await (admin as any)
        .from('user_entitlements')
        .select('user_id')
        .eq('stripe_subscription_id', sub.id)
        .single()

      const row = data as { user_id: string } | null
      if (!row) {
        console.warn('[stripe-webhook] subscription.deleted: user not found for sub:', sub.id)
        return NextResponse.json({ received: true })
      }

      await (admin as any)
        .from('user_entitlements')
        .update({ tier: 'free', stripe_subscription_id: null, updated_at: new Date().toISOString() })
        .eq('user_id', row.user_id)

      console.log('[stripe-webhook] explorer reverted → free for sub:', sub.id)
      return NextResponse.json({ received: true })
    }

    const admin = getSupabaseAdmin()
    await (admin as any)
      .from('user_entitlements')
      .update({ tier: 'free', stripe_subscription_id: null, updated_at: new Date().toISOString() })
      .eq('user_id', userId)

    console.log('[stripe-webhook] explorer reverted → free for user:', userId)
  }

  return NextResponse.json({ received: true })
}
