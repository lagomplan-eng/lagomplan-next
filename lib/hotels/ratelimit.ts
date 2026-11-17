// lib/hotels/ratelimit.ts
//
// Best-effort, in-memory, per-instance rate limiter. Keys are salted hashes held only in this
// process's memory for the length of the window — nothing is written to a table or a log, so no
// identifier of a guest is ever persisted. Serverless instances don't share memory, so this blunts
// floods rather than guaranteeing a hard cap; the event route also validates everything else.

import { createHash } from 'crypto'

const buckets = new Map<string, { n: number; reset: number }>()
const SALT = process.env.HOTEL_RATELIMIT_SALT || 'lagomplan-hotels'

export function clientKey(headers: { get(n: string): string | null }, scope: string): string {
  const ip = (headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || headers.get('x-real-ip') || 'unknown'
  return `${scope}:${createHash('sha256').update(SALT + ip).digest('hex').slice(0, 24)}`
}

/** true = allowed. */
export function allow(key: string, max: number, windowMs: number, now = Date.now()): boolean {
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (v.reset <= now) buckets.delete(k)
  }
  const b = buckets.get(key)
  if (!b || b.reset <= now) {
    buckets.set(key, { n: 1, reset: now + windowMs })
    return true
  }
  b.n += 1
  return b.n <= max
}

export function _resetForTests() { buckets.clear() }
