// lib/entitlements.ts
// Server-side entitlement checking and credit management.
// Always call from API routes — never from client components.

import { getSupabaseAdmin, getSupabaseServer } from './supabase/server'

export type EntitlementCheck =
  | { allowed: true;  tier: string; remaining: number | null }
  | { allowed: false; reason: 'no_credits' | 'error'; tier: string }

type EntitlementRow = {
  tier: string
  trips_remaining: number
  trips_used: number
}

async function getOrCreateEntitlement(userId: string): Promise<EntitlementRow> {
  const admin = getSupabaseAdmin()

  const { data } = await (admin as any)
    .from('user_entitlements')
    .select('tier, trips_remaining, trips_used')
    .eq('user_id', userId)
    .single()

  if (data) return data as EntitlementRow

  // Race condition: signup trigger may not have fired yet — create the row now
  await (admin as any)
    .from('user_entitlements')
    .upsert({ user_id: userId, tier: 'free', trips_remaining: 3, trips_used: 0 })

  return { tier: 'free', trips_remaining: 3, trips_used: 0 }
}

/**
 * Check whether the authenticated request is allowed to generate a trip.
 * Returns the user_id on success so the caller can pass it to consumeOneTrip.
 */
export async function checkGenerationAllowed(): Promise<
  | { allowed: true;  userId: string; tier: string; remaining: number | null }
  | { allowed: false; reason: 'not_authenticated' | 'no_credits' | 'error'; tier?: string }
> {
  const supabase = await getSupabaseServer()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { allowed: false, reason: 'not_authenticated' }
  }

  try {
    const ent = await getOrCreateEntitlement(user.id)

    if (ent.tier === 'explorer') {
      return { allowed: true, userId: user.id, tier: 'explorer', remaining: null }
    }

    if (ent.trips_remaining > 0) {
      return { allowed: true, userId: user.id, tier: ent.tier, remaining: ent.trips_remaining }
    }

    return { allowed: false, reason: 'no_credits', tier: ent.tier }
  } catch {
    return { allowed: false, reason: 'error' }
  }
}

/**
 * Decrement trips_remaining by 1 after a successful generation.
 * No-op for explorer tier.
 */
export async function consumeOneTrip(userId: string): Promise<void> {
  const admin = getSupabaseAdmin()

  const { data } = await (admin as any)
    .from('user_entitlements')
    .select('tier, trips_remaining, trips_used')
    .eq('user_id', userId)
    .single()

  const ent = data as EntitlementRow | null
  if (!ent || ent.tier === 'explorer') return

  await (admin as any)
    .from('user_entitlements')
    .update({
      trips_remaining: Math.max(0, ent.trips_remaining - 1),
      trips_used:      ent.trips_used + 1,
      updated_at:      new Date().toISOString(),
    })
    .eq('user_id', userId)
}

/**
 * Get the current plan state for a user — used by GET /api/me/plan.
 */
export async function getPlanState(userId: string): Promise<{
  tier: string
  trips_remaining: number
  trips_used: number
  is_subscriber: boolean
}> {
  const ent = await getOrCreateEntitlement(userId)
  return {
    tier:             ent.tier,
    trips_remaining:  ent.trips_remaining,
    trips_used:       ent.trips_used,
    is_subscriber:    ent.tier === 'explorer',
  }
}
