/**
 * lib/consent.ts
 *
 * GDPR/RGPD cookie consent state — single source of truth.
 *
 * Three states:
 *   - 'all'       — user accepted essential + analytics + marketing
 *   - 'essential' — user rejected non-essential; only Supabase auth cookies allowed
 *   - null        — no decision yet; CookieBanner is rendered to capture it
 *
 * Persisted in localStorage so the decision survives across sessions
 * and tabs. Cross-component reactivity is achieved by dispatching a
 * window CustomEvent on every setConsent — ConsentSync listens to it
 * and flips Google Consent Mode + injects Meta Pixel accordingly.
 *
 * SSR-safe: every entry point checks `typeof window` and degrades to
 * a no-op on the server.
 */

export type ConsentState = 'all' | 'essential' | null

const STORAGE_KEY  = 'lagomplan-consent'
const CHANGE_EVENT = 'lagomplan-consent-change'

export function getConsent(): ConsentState {
  if (typeof window === 'undefined') return null
  try {
    const v = window.localStorage.getItem(STORAGE_KEY)
    if (v === 'all' || v === 'essential') return v
  } catch {
    // Private mode / storage disabled — treat as undecided.
  }
  return null
}

export function setConsent(value: Exclude<ConsentState, null>): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, value)
  } catch {
    // Storage refused — still dispatch so the UI reacts; the decision
    // simply won't survive a reload.
  }
  window.dispatchEvent(new CustomEvent<ConsentState>(CHANGE_EVENT, { detail: value }))

  // Fire-and-forget audit log to the server. localStorage is the
  // runtime source of truth; this row is the GDPR Article 7(1) paper
  // trail. Failures are swallowed — the user's decision is already
  // saved client-side, so a failed log entry mustn't surface as an
  // error toast or block the UI. keepalive lets the request finish
  // even if the page unloads immediately after (e.g. if setConsent
  // is followed by a reload, as in DoNotSellLink).
  try {
    // Locale derived from the URL prefix — robust to the localStorage
    // write happening before next-intl's client context has hydrated.
    const localeMatch = window.location.pathname.match(/^\/(en|es)\b/)
    const locale      = localeMatch?.[1] ?? null
    fetch('/api/consent', {
      method:      'POST',
      headers:     { 'Content-Type': 'application/json' },
      credentials: 'include',
      keepalive:   true,
      body:        JSON.stringify({ choice: value, locale, gpc: isGPCEnabled() }),
    }).catch(() => {})
  } catch {}
}

/**
 * Wipes the stored decision so the banner can be re-shown. Wired to the
 * footer "Cookie settings" link — GDPR Article 7(3) requires withdrawal
 * to be as easy as granting consent. CookieBanner subscribes to the
 * change event and re-renders itself when state becomes null again.
 *
 * Note: this only reopens the prompt. It does NOT retroactively delete
 * cookies that GA/Meta already set during a prior 'all' session — for
 * that the user would need to clear cookies in their browser too. The
 * privacy policy says so explicitly.
 */
export function clearConsent(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {}
  window.dispatchEvent(new CustomEvent<ConsentState>(CHANGE_EVENT, { detail: null }))
}

/**
 * Returns true when the user's browser is signaling "do not track me"
 * via Global Privacy Control. CCPA explicitly requires honoring GPC,
 * and EU regulators have indicated GPC counts as a withdrawal of
 * consent. Treated as an implicit 'essential' choice — no banner
 * shown, no analytics loaded.
 *
 * Spec: https://globalprivacycontrol.org/
 */
export function isGPCEnabled(): boolean {
  if (typeof navigator === 'undefined') return false
  return (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true
}

/**
 * Subscribe to consent changes. Returns an unsubscribe function — pair
 * it with useEffect's cleanup.
 */
export function onConsentChange(cb: (state: ConsentState) => void): () => void {
  if (typeof window === 'undefined') return () => {}
  const handler = (e: Event) => cb((e as CustomEvent<ConsentState>).detail ?? null)
  window.addEventListener(CHANGE_EVENT, handler)
  return () => window.removeEventListener(CHANGE_EVENT, handler)
}
