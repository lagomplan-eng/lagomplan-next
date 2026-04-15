// app/api/checkout/route.ts
// POST — create a Stripe Checkout session and return { url }.
// Auth required. The user is identified from the Supabase session; their
// Supabase user ID is stored in session metadata so the webhook can credit
// the right row without any extra DB lookup.
//
// Required env vars (add to Vercel → Settings → Environment Variables):
//   STRIPE_SECRET_KEY          sk_live_... or sk_test_...
//   STRIPE_PRICE_TRIP_1        price_... (one-time, MXN)
//   STRIPE_PRICE_TRIP_5        price_... (one-time, MXN)
//   STRIPE_PRICE_TRIP_10       price_... (one-time, MXN)
//   STRIPE_PRICE_EXPLORER      price_... (recurring monthly, MXN)

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getSupabaseServer } from '../../../lib/supabase/server'

export const dynamic = 'force-dynamic'

const PLAN_PRICE_ENV: Record<string, string> = {
  'trip-1':      'STRIPE_PRICE_TRIP_1',
  'trip-5':      'STRIPE_PRICE_TRIP_5',
  'trip-10':     'STRIPE_PRICE_TRIP_10',
  'subscription': 'STRIPE_PRICE_EXPLORER',
}

export async function POST(req: NextRequest) {
  // ── Auth ─────────────────────────────────────────────────────────────────────
  const supabase = getSupabaseServer()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // ── Parse body ───────────────────────────────────────────────────────────────
  let plan: string
  let locale: string
  try {
    const body = await req.json()
    plan   = body.plan   ?? ''
    locale = body.locale ?? 'es'
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!PLAN_PRICE_ENV[plan]) {
    return NextResponse.json({ error: `Unknown plan: ${plan}` }, { status: 400 })
  }

  // ── Env guard ────────────────────────────────────────────────────────────────
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    console.error('[checkout] STRIPE_SECRET_KEY is not set')
    return NextResponse.json({ error: 'Payment not configured' }, { status: 503 })
  }

  const priceId = process.env[PLAN_PRICE_ENV[plan]]
  if (!priceId) {
    console.error(`[checkout] ${PLAN_PRICE_ENV[plan]} is not set`)
    return NextResponse.json({ error: 'Price not configured' }, { status: 503 })
  }

  // ── Build Stripe session ─────────────────────────────────────────────────────
  const stripe = new Stripe(secretKey)
  const isSubscription = plan === 'subscription'

  const origin = req.headers.get('origin') ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.lagomplan.com'
  const successUrl = `${origin}/${locale}/planner?checkout=success&session_id={CHECKOUT_SESSION_ID}`
  const cancelUrl  = `${origin}/${locale}/planner?checkout=cancelled`

  try {
    const session = await stripe.checkout.sessions.create({
      mode: isSubscription ? 'subscription' : 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url:  cancelUrl,
      customer_email: user.email,
      client_reference_id: user.id,   // fallback for webhook user lookup
      metadata: { user_id: user.id, plan },
      ...(isSubscription && {
        subscription_data: {
          metadata: { user_id: user.id },  // also on subscription for cancellation events
        },
      }),
    })

    console.log('[checkout] created session:', session.id, 'for user:', user.id, 'plan:', plan)
    return NextResponse.json({ url: session.url })

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[checkout] Stripe error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
