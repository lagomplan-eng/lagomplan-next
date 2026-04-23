// app/api/apply-coupon/route.ts
// POST { code } — validate and apply a custom coupon code.
// Does NOT go through Stripe checkout — handles $0 flows directly.

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer, getSupabaseAdmin } from '../../../lib/supabase/server'
import { getEntitlement } from '../../../lib/entitlements'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const supabase = await getSupabaseServer()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // ── Parse ─────────────────────────────────────────────────────────────────
  let code: string
  try {
    const body = await req.json()
    code = (body.code ?? '').trim().toUpperCase()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  if (!code) {
    return NextResponse.json({ error: 'missing_code', message: 'Coupon code is required' }, { status: 400 })
  }

  const admin = getSupabaseAdmin()

  // ── Fetch coupon ──────────────────────────────────────────────────────────
  const { data: coupon } = await (admin as any)
    .from('coupons')
    .select('id, credits_granted, grants_subscription, max_uses, uses_count, expires_at')
    .eq('code', code)
    .single()

  if (!coupon) {
    return NextResponse.json({ error: 'invalid_coupon', message: 'Invalid coupon code' }, { status: 400 })
  }

  // ── Validate expiry ───────────────────────────────────────────────────────
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return NextResponse.json({ error: 'coupon_expired', message: 'This coupon has expired' }, { status: 400 })
  }

  // ── Validate max uses ─────────────────────────────────────────────────────
  if (coupon.max_uses !== null && coupon.uses_count >= coupon.max_uses) {
    return NextResponse.json({ error: 'coupon_exhausted', message: 'This coupon has no uses remaining' }, { status: 400 })
  }

  // ── Check if user already redeemed this coupon ────────────────────────────
  const { data: redemption } = await (admin as any)
    .from('coupon_redemptions')
    .select('coupon_id')
    .eq('coupon_id', coupon.id)
    .eq('user_id', user.id)
    .single()

  if (redemption) {
    return NextResponse.json({ error: 'already_redeemed', message: 'You have already used this coupon' }, { status: 400 })
  }

  // ── Apply entitlement ─────────────────────────────────────────────────────
  if (coupon.grants_subscription) {
    const { error: upsertErr } = await (admin as any)
      .from('user_entitlements')
      .upsert({
        user_id:        user.id,
        tier:           'explorer',
        trips_remaining: 0,
        updated_at:     new Date().toISOString(),
      }, { onConflict: 'user_id' })

    if (upsertErr) {
      console.error('[apply-coupon] upsert explorer error:', upsertErr.message)
      return NextResponse.json({ error: 'internal_error' }, { status: 500 })
    }
  } else {
    const credits = coupon.credits_granted ?? 0
    if (credits <= 0) {
      return NextResponse.json({ error: 'invalid_coupon', message: 'Invalid coupon configuration' }, { status: 400 })
    }

    const { data: existing } = await (admin as any)
      .from('user_entitlements')
      .select('trips_remaining, tier')
      .eq('user_id', user.id)
      .single()

    const current = existing as { trips_remaining: number; tier: string } | null
    const newRemaining = (current?.trips_remaining ?? 0) + credits
    const newTier = (!current || current.tier === 'free') ? 'per_trip' : current.tier

    const { error: upsertErr } = await (admin as any)
      .from('user_entitlements')
      .upsert({
        user_id:         user.id,
        tier:            newTier,
        trips_remaining: newRemaining,
        updated_at:      new Date().toISOString(),
      }, { onConflict: 'user_id' })

    if (upsertErr) {
      console.error('[apply-coupon] upsert credits error:', upsertErr.message)
      return NextResponse.json({ error: 'internal_error' }, { status: 500 })
    }
    console.log(`[apply-coupon] +${credits} credits for user:`, user.id, '→', newRemaining)
  }

  // ── Record redemption ─────────────────────────────────────────────────────
  await (admin as any)
    .from('coupon_redemptions')
    .insert({ coupon_id: coupon.id, user_id: user.id })

  await (admin as any)
    .from('coupons')
    .update({ uses_count: (coupon.uses_count ?? 0) + 1 })
    .eq('id', coupon.id)

  // ── Return updated entitlement ────────────────────────────────────────────
  const entitlement = await getEntitlement(user.id)
  return NextResponse.json({ success: true, entitlement })
}
