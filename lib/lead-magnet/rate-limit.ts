// lib/lead-magnet/rate-limit.ts
//
// Durable rate limiting for POST /api/lead-magnet, backed by the
// lead_magnet_attempts table (service role only). In-memory counters don't
// survive serverless cold starts, hence Supabase.
//
// Fails OPEN on infra errors (table missing, Supabase down): a broken limiter
// must not take the signup form down. Failures are logged.

import { createHash } from 'crypto'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getSupabaseAdmin } from '../supabase/server'

export const IP_LIMIT    = { max: 5, windowMs: 10 * 60_000 }
export const EMAIL_LIMIT = { max: 3, windowMs: 24 * 3_600_000 }

const PEPPER = process.env.CONSENT_IP_SALT ?? 'lagomplan-dev-pepper-do-not-use-in-prod'

export function hashKey(kind: 'ip' | 'email', raw: string): string {
  return createHash('sha256').update(`${PEPPER}:${kind}:${raw.trim().toLowerCase()}`).digest('hex')
}

/**
 * Returns true when the attempt is allowed (and records it), false when the
 * limit is already reached (nothing recorded).
 */
export async function takeAttempt(
  kind: 'ip' | 'email',
  raw: string,
  limit: { max: number; windowMs: number },
): Promise<boolean> {
  try {
    const db = getSupabaseAdmin() as unknown as SupabaseClient
    const keyHash = hashKey(kind, raw)
    const since = new Date(Date.now() - limit.windowMs).toISOString()

    const { count, error } = await db
      .from('lead_magnet_attempts')
      .select('id', { count: 'exact', head: true })
      .eq('kind', kind)
      .eq('key_hash', keyHash)
      .gte('created_at', since)
    if (error) throw error
    if ((count ?? 0) >= limit.max) return false

    const { error: insErr } = await db
      .from('lead_magnet_attempts')
      .insert({ kind, key_hash: keyHash })
    if (insErr) throw insErr
    return true
  } catch (err) {
    console.error(`[lead-magnet] rate-limit (${kind}) unavailable, failing open:`, err)
    return true
  }
}
