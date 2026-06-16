// e2e/support/helpers.ts
//
// Shared helpers for the mobile-view E2E suite. Most are thin wrappers; the
// TODO-marked ones depend on your test infra (how trips are seeded + how a
// session is established) and must be filled in by the tester — see
// e2e/README.md.

import type { Page } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'
import type { Fixture } from '../fixtures/trips'

export const LOCALE = 'es'

// Service-role client against whatever Supabase the run points at (local via
// env). Used to seed/clean trip rows the SSR route reads server-side — which is
// why page.route() can't fake them.
function admin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('seed/login need NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in env (point them at local Supabase)')
  }
  return createClient(url, key, { auth: { persistSession: false } })
}

/** Navigate to the mobile companion view for a trip id. */
export async function gotoTrip(page: Page, tripId: string) {
  await page.goto(`/${LOCALE}/trips/${tripId}`)
}

/**
 * Capture GA4 events. Stubs window.gtag BEFORE any app script runs and records
 * every call into window.__gaEvents. Returns a reader.
 *
 * Usage:
 *   const ga = await captureGaEvents(page)
 *   await gotoTrip(page, TRIP_OWNER.id)
 *   expect(await ga.find('mobile_view_opened')).toMatchObject({ is_owner: true })
 */
export async function captureGaEvents(page: Page) {
  await page.addInitScript(() => {
    ;(window as any).__gaEvents = []
    ;(window as any).gtag = (...args: any[]) => { (window as any).__gaEvents.push(args) }
    // dataLayer fallback some GA wrappers use
    ;(window as any).dataLayer = (window as any).dataLayer || []
  })
  return {
    /** All ['event', name, params] tuples recorded so far. */
    all: async () => page.evaluate(() => (window as any).__gaEvents ?? []),
    /** First params object logged for a given GA event name, or null. */
    find: async (name: string) =>
      page.evaluate((n) => {
        const ev = ((window as any).__gaEvents ?? []).find((a: any[]) => a[0] === 'event' && a[1] === n)
        return ev ? ev[2] ?? {} : null
      }, name),
  }
}

/**
 * Insert a fixture trip and return its DB-generated id. The route loads trips
 * server-side, so the row must exist in the DB the app reads — we don't pass an
 * id (Postgres generates the UUID and we hand it back). Clean up with deleteTrip.
 */
export async function seedTrip(fixture: Fixture): Promise<string> {
  const td = fixture.trip_data ?? {}
  const { data, error } = await admin().from('trips').insert({
    slug:              `e2e-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
    title:             td.title ?? fixture.destination,
    origin:            'Test Origin',
    destination:       fixture.destination,
    duration_days:     fixture.duration_days,
    travelers:         fixture.travelers,
    travel_style:      'equilibrado',
    interests:         [],
    user_id:           fixture.user_id,
    is_shared:         fixture.is_shared,
    currency:          td.currency ?? 'MXN',
    walking_tolerance: 'medium',
    trip_data:         td,
    trip_progress:     fixture.trip_progress ?? { annotations: {}, packedItems: [] },
  } as Record<string, unknown>).select('id').single()
  if (error) throw new Error(`seedTrip failed: ${error.message}`)
  return (data as { id: string }).id
}

/** Delete a seeded trip — use in afterEach so runs stay isolated. */
export async function deleteTrip(id: string): Promise<void> {
  await admin().from('trips').delete().eq('id', id)
}

/**
 * Log in as a test user through the REAL login UI (so @supabase/ssr sets its own
 * cookies — more robust than hand-crafting them). Returns the user's id (use as
 * a trip's user_id for owner cases).
 *
 * The user is created via the public signUp endpoint (anon key), NOT the admin
 * API: local Supabase (CLI ≥ 2.7x) signs JWTs asymmetrically, so the legacy
 * HS256 service-role key — fine for PostgREST — is rejected by GoTrue's admin
 * Bearer. signUp needs no admin auth and works under any scheme; local config
 * has enable_confirmations=false, so the account is immediately usable.
 */
export async function loginAs(
  page: Page,
  email = 'e2e-owner@test.local',
  password = 'e2e-password-123',
): Promise<string> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) {
    throw new Error('loginAs needs NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY in env')
  }
  const pub = createClient(url, anon, { auth: { persistSession: false } })

  // Create (idempotent — ignore "already registered"); then resolve the id.
  const { data: su, error } = await pub.auth.signUp({ email, password })
  if (error && !/already|registered|exists/i.test(error.message)) {
    throw new Error(`loginAs signUp failed: ${error.message}`)
  }
  let userId = su?.user?.id
  if (!userId) {
    const { data: si } = await pub.auth.signInWithPassword({ email, password })
    userId = si?.user?.id
  }
  if (!userId) throw new Error('loginAs could not resolve a user id')

  // trips.user_id → profiles(id). In prod an auth.users trigger creates the
  // profile row on signup, but that trigger lives in the auth schema and isn't
  // captured by the public-schema dump (#78 baseline), so seed it ourselves.
  const { error: profErr } = await admin().from('profiles').upsert({ id: userId, email }, { onConflict: 'id' })
  if (profErr) throw new Error(`loginAs could not seed profile: ${profErr.message}`)

  // Sign in through the UI so the app's @supabase/ssr client writes its cookies.
  await page.goto(`/${LOCALE}/login`)
  await page.locator('input[type="email"]').first().fill(email)
  await page.locator('input[type="password"]').first().fill(password)
  await page.getByRole('button', { name: /iniciar sesión|sign in|entrar|continuar/i }).first().click()
  await page.waitForURL((u) => !u.pathname.endsWith('/login'), { timeout: 15_000 })
  return userId
}
