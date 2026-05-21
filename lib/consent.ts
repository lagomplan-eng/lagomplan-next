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
