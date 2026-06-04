/**
 * tests/e2e/fixtures/auth.ts
 *
 * Inject a fake Supabase session for tests that need an authenticated
 * user. The @supabase/ssr browser client reads its session from
 * cookies; we set the same cookies the real signin flow would set.
 *
 * IMPORTANT — this is Phase 1 (network-mocked) auth. The real auth
 * round-trip (signup/signin via Supabase Auth) is NOT exercised. RLS
 * is also not exercised — see project memory
 * [[project-trip-data-wholesale-overwrite]] for the wider Phase 3
 * follow-up.
 *
 * The cookie value is a JSON-encoded session blob; @supabase/ssr
 * tolerates a thin shape as long as access_token + user are present.
 */

import type { Browser, BrowserContext } from '@playwright/test'
import { TEST_USER_ID } from './network-mocks'

const SUPABASE_PROJECT_REF = 'qvntwqnzvspoisaglgpp'
const COOKIE_NAME           = `sb-${SUPABASE_PROJECT_REF}-auth-token`

export type TestSession = {
  userId?: string
  email?:  string
}

/**
 * Build the session cookie value @supabase/ssr expects. Cookie chunking
 * (the .0/.1/... suffixes) only kicks in past ~3KB; our test session
 * is well under that so a single cookie is fine.
 */
function buildSessionCookie(session: Required<TestSession>): string {
  const value = {
    access_token:  'test-access-token',
    refresh_token: 'test-refresh-token',
    expires_in:    3600,
    expires_at:    Math.floor(Date.now() / 1000) + 3600,
    token_type:    'bearer',
    user: {
      id:    session.userId,
      email: session.email,
      aud:   'authenticated',
      role:  'authenticated',
    },
  }
  // @supabase/ssr base64-encodes the cookie payload with a `base64-`
  // prefix sentinel. The browser sends it back verbatim and the SSR
  // helpers decode.
  const encoded = Buffer.from(JSON.stringify(value)).toString('base64')
  return `base64-${encoded}`
}

/**
 * Returns a Playwright BrowserContext with the Supabase session
 * cookies pre-set. Use in place of `browser.newContext()` for tests
 * that need an authed user.
 *
 * Example:
 *   const context = await authedContext(browser, { email: 'a@b.test' })
 *   const page    = await context.newPage()
 *   await installAllMocks(page)
 */
export async function authedContext(
  browser: Browser,
  session: TestSession = {},
): Promise<BrowserContext> {
  const userId = session.userId ?? TEST_USER_ID
  const email  = session.email  ?? 'test@lagomplan.test'
  const value  = buildSessionCookie({ userId, email })

  const context = await browser.newContext()
  await context.addCookies([
    {
      name:     COOKIE_NAME,
      value,
      domain:   'localhost',
      path:     '/',
      httpOnly: false,
      secure:   false,
      sameSite: 'Lax',
      expires:  Math.floor(Date.now() / 1000) + 3600,
    },
  ])
  return context
}
