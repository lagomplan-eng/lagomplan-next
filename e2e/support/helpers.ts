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
    // Intercept dataLayer.push rather than stubbing window.gtag: when
    // NEXT_PUBLIC_GA_MEASUREMENT_ID is set the real gtag.js loads and
    // overwrites any window.gtag stub, but every gtag('event', …) call still
    // funnels through dataLayer.push(arguments) — and that happens regardless
    // of consent state (consent only gates network/cookies, not the push).
    ;(window as any).__gaEvents = []
    const dl: any[] = ((window as any).dataLayer = (window as any).dataLayer || [])
    const origPush = dl.push.bind(dl)
    dl.push = (...items: any[]) => {
      for (const it of items) (window as any).__gaEvents.push(Array.from(it ?? []))
      return origPush(...items)
    }
    // Fallback gtag for runs where gtag.js never loads (no GA id) — the real
    // loader will replace this, but its calls still hit our patched push.
    ;(window as any).gtag = (window as any).gtag || function () { dl.push(arguments) }
  })
  return {
    /** All recorded gtag tuples (e.g. ['event', name, params]). */
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
 * Capture window.open() calls. Stubs window.open BEFORE any app script runs and
 * records every requested URL into window.__opened. Returns a reader.
 *
 * The mobile view opens affiliate/booking links via window.open(url, '_blank')
 * — both the per-item booking drawer and the hotel "Reservar" CTA do this to
 * bypass the Stay22 anchor interceptor. Stubbing window.open lets us assert the
 * intended target (host, not Booking.com) without a real cross-site navigation.
 *
 * Usage:
 *   const opened = await captureWindowOpen(page)
 *   await gotoTrip(page, id)
 *   // …click a Reservar button…
 *   expect(await opened.last()).toContain('stay22.com')
 */
export async function captureWindowOpen(page: Page) {
  await page.addInitScript(() => {
    ;(window as any).__opened = []
    ;(window as any).open = (url?: string | URL) => {
      ;(window as any).__opened.push(String(url ?? ''))
      return null // the app discards the return value
    }
  })
  return {
    /** Every URL passed to window.open so far. */
    all: async () => page.evaluate(() => (window as any).__opened ?? []),
    /** The most recent window.open URL, or null. */
    last: async () =>
      page.evaluate(() => {
        const a = (window as any).__opened ?? []
        return a.length ? a[a.length - 1] : null
      }),
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
/**
 * Create a profile-backed test user (no UI session) and return its id. Use to
 * seed a trip owner who is NOT the logged-in viewer (read-only / shared cases).
 *
 * The account is made via the public signUp endpoint (anon key), NOT the admin
 * API: local Supabase (CLI ≥ 2.7x) signs JWTs asymmetrically, so the legacy
 * HS256 service-role key — fine for PostgREST — is rejected by GoTrue's admin
 * Bearer. signUp needs no admin auth and works under any scheme; local config
 * has enable_confirmations=false, so the account is immediately usable.
 *
 * trips.user_id → profiles(id), and profiles.id → auth.users(id). In prod an
 * auth.users trigger creates the profile on signup, but that trigger lives in
 * the auth schema and isn't captured by the public-schema dump (#78 baseline),
 * so we seed the profiles row ourselves.
 */
export async function createTestUser(
  email = 'e2e-owner@test.local',
  password = 'e2e-password-123',
): Promise<string> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) {
    throw new Error('createTestUser needs NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY in env')
  }
  const pub = createClient(url, anon, { auth: { persistSession: false } })

  // Create (idempotent — ignore "already registered"); then resolve the id.
  const { data: su, error } = await pub.auth.signUp({ email, password })
  if (error && !/already|registered|exists/i.test(error.message)) {
    throw new Error(`createTestUser signUp failed: ${error.message}`)
  }
  let userId = su?.user?.id
  if (!userId) {
    const { data: si } = await pub.auth.signInWithPassword({ email, password })
    userId = si?.user?.id
  }
  if (!userId) throw new Error('createTestUser could not resolve a user id')

  const { error: profErr } = await admin().from('profiles').upsert({ id: userId, email }, { onConflict: 'id' })
  if (profErr) throw new Error(`createTestUser could not seed profile: ${profErr.message}`)
  return userId
}

export async function loginAs(
  page: Page,
  email = 'e2e-owner@test.local',
  password = 'e2e-password-123',
): Promise<string> {
  const userId = await createTestUser(email, password)

  // Sign in through the UI so the app's @supabase/ssr client writes its cookies.
  await page.goto(`/${LOCALE}/login`)
  await page.locator('input[type="email"]').first().fill(email)
  await page.locator('input[type="password"]').first().fill(password)
  await page.getByRole('button', { name: /iniciar sesión|sign in|entrar|continuar/i }).first().click()
  await page.waitForURL((u) => !u.pathname.endsWith('/login'), { timeout: 15_000 })
  return userId
}
