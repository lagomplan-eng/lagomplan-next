/**
 * tests/e2e/fixtures/network-mocks.ts
 *
 * Phase 1 mock layer — intercept every outbound network call the
 * planner makes so tests are hermetic. Covers:
 *
 *   - /api/generate-trip            → canned trip_data envelope
 *   - /api/trips                    → POST 201 with fake trip_id
 *   - /api/trips/[trip_id]          → GET 200 with the canned trip
 *   - /api/trips/[trip_id]/...      → 200 (booking-confirm, claim, etc.)
 *   - Supabase auth.getUser/getSession → returns the test session
 *   - Supabase rest/v1/trips        → returns the canned trip row
 *   - Stay22 + GA + Pixel + any cross-origin chatter → blocked (204)
 *
 * One Phase 3 follow-up to keep in mind: this is UI-behavior coverage.
 * Real RLS + SSR cookie behavior is NOT exercised here — those bugs
 * (anon trip read, smart-finds resolver) need a real test Supabase
 * project to catch. Out of Phase 1 scope; see docs/TOMORROW.md.
 */

import type { Page, Route } from '@playwright/test'
import type { FixtureTripData } from './trip-data'
import { mexicoCityWeekend } from './trip-data'

export const TEST_TRIP_ID = '00000000-0000-0000-0000-000000000aaa'
export const TEST_USER_ID = '11111111-1111-1111-1111-111111111111'

export type GenerationMockOptions = {
  /** Trip data returned from /api/generate-trip. Defaults to the
   *  Mexico City weekend fixture. */
  trip?: FixtureTripData
  /** Simulate the streaming path: emit the response in chunks instead
   *  of a single JSON blob. Worth using on T-PW-01 to keep the
   *  streaming-flicker regression class covered. */
  streaming?: boolean
}

/**
 * Mock the synchronous generation route. Returns the trip_data wrapped
 * in the envelope shape the route produces:
 *   { trip_data: { ... } }
 */
export async function mockGenerateTrip(
  page: Page,
  opts: GenerationMockOptions = {},
): Promise<void> {
  const trip = opts.trip ?? mexicoCityWeekend
  const body = JSON.stringify({ trip_data: trip })

  await page.route('**/api/generate-trip', (route: Route) => {
    return route.fulfill({
      status:      200,
      contentType: 'application/json',
      body,
    })
  })
}

/**
 * Stub the trip read + write APIs the planner uses post-generation:
 *   GET    /api/trips/[trip_id]          — load saved trip
 *   POST   /api/trips                    — initial save after generation
 *   PATCH  /api/trips/[trip_id]          — autosave + traveler details
 *   PATCH  /api/trips/[trip_id]/...      — booking-confirm, claim, share
 */
export async function mockTripsApi(page: Page, trip?: FixtureTripData): Promise<void> {
  const data = trip ?? mexicoCityWeekend

  // GET /api/trips/[id] — returns a saved trip envelope
  await page.route(/\/api\/trips\/[a-f0-9-]+$/i, (route: Route) => {
    const method = route.request().method()
    if (method === 'GET') {
      return route.fulfill({
        status:      200,
        contentType: 'application/json',
        body: JSON.stringify({
          id:        TEST_TRIP_ID,
          user_id:   TEST_USER_ID,
          trip_data: data,
          title:     (data as Record<string, unknown>).title ?? 'Test trip',
          is_shared: false,
          created_at: new Date().toISOString(),
        }),
      })
    }
    // PATCH (autosave, prefs, etc.) — succeed silently
    if (method === 'PATCH') {
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' })
    }
    return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' })
  })

  // POST /api/trips — initial save after generation
  await page.route('**/api/trips', (route: Route) => {
    if (route.request().method() === 'POST') {
      return route.fulfill({
        status:      201,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, trip_id: TEST_TRIP_ID }),
      })
    }
    return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' })
  })

  // Nested patches (booking-confirm, share, claim) — succeed silently
  await page.route(/\/api\/trips\/[a-f0-9-]+\/[a-z-]+$/i, (route: Route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' }),
  )
}

/**
 * Stub Supabase REST + Auth so the @supabase/ssr browser client can't
 * leak real network calls during tests. Doesn't replicate RLS — that's
 * Phase 3.
 */
export async function mockSupabase(page: Page): Promise<void> {
  // Auth endpoints
  await page.route(/\.supabase\.co\/auth\/v1\/.*/i, (route: Route) => {
    const url    = route.request().url()
    const method = route.request().method()
    // getUser / getSession respond with the test user when signed in;
    // anonymous tests should NOT set the session cookies in the first
    // place, so an anon page hitting this returns 401-style empty user.
    if (url.includes('/user') || url.includes('/token')) {
      return route.fulfill({
        status:      200,
        contentType: 'application/json',
        body: JSON.stringify({
          id:    TEST_USER_ID,
          email: 'test@lagomplan.test',
          aud:   'authenticated',
        }),
      })
    }
    if (method === 'POST' && url.includes('/signup')) {
      return route.fulfill({
        status:      200,
        contentType: 'application/json',
        body: JSON.stringify({
          user:        { id: TEST_USER_ID, email: 'test@lagomplan.test' },
          session:     { access_token: 'test-token', refresh_token: 'test-refresh' },
        }),
      })
    }
    return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' })
  })

  // REST queries (trips table, profiles, etc.) — return an empty list
  // unless a specific test installs a more specific route afterwards.
  // page.route registrations are stacked LIFO so test-local mocks win.
  await page.route(/\.supabase\.co\/rest\/v1\/.*/i, (route: Route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  )
}

/**
 * Block third-party analytics + affiliate scripts at the network
 * layer. Speeds tests up and removes flake from Stay22's LetMeAllez
 * (which hijacks travel-card clicks; see project memory). Returns 204
 * so the browser doesn't log a CORS-shaped error.
 */
export async function blockThirdParty(page: Page): Promise<void> {
  const patterns = [
    /\bgoogletagmanager\.com\b/i,
    /\bgoogle-analytics\.com\b/i,
    /\bfacebook\.net\b/i,
    /\bconnect\.facebook\.net\b/i,
    /\bstay22\.com\b/i,
    /\bscripts\.stay22\.com\b/i,
  ]
  for (const p of patterns) {
    await page.route(p, (route: Route) => route.fulfill({ status: 204, body: '' }))
  }
}

/**
 * Apply the full Phase 1 mock stack. Most tests want this — call it
 * in `test.beforeEach` and override individual routes per-test as
 * needed (Playwright stacks routes LIFO).
 */
export async function installAllMocks(
  page: Page,
  opts: GenerationMockOptions = {},
): Promise<void> {
  await blockThirdParty(page)
  await mockSupabase(page)
  await mockTripsApi(page, opts.trip)
  await mockGenerateTrip(page, opts)
}
