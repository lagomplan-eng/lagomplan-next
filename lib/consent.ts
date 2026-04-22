/**
 * lib/consent.ts
 *
 * Single source of truth for consent types, cookie I/O, and versioning.
 * Bump CONSENT_VERSION whenever cookie practices change materially
 * (new category, new third-party, new purpose) — this invalidates stored
 * consent and re-surfaces the banner for all users.
 */

export const CONSENT_COOKIE  = 'lagomplan_consent'
export const CONSENT_VERSION = '1.0'
export const CONSENT_TTL_MS  = 365 * 24 * 60 * 60 * 1000   // 12 months

// ── Types ──────────────────────────────────────────────────

export type ConsentState = {
  necessary:   true       // immutable — always active
  analytics:   boolean
  marketing:   boolean
  preferences: boolean
  timestamp:   number     // Date.now() at time of consent
  version:     string     // must match CONSENT_VERSION to be valid
}

export type ConsentChoices = Omit<ConsentState, 'necessary' | 'timestamp' | 'version'>

// ── Builders ───────────────────────────────────────────────

export function buildConsent(choices: ConsentChoices): ConsentState {
  return {
    necessary: true,
    ...choices,
    timestamp: Date.now(),
    version:   CONSENT_VERSION,
  }
}

export const allAccepted = (): ConsentState =>
  buildConsent({ analytics: true,  marketing: true,  preferences: true  })

export const allRejected = (): ConsentState =>
  buildConsent({ analytics: false, marketing: false, preferences: false })

// ── Validation ─────────────────────────────────────────────

export function isConsentValid(c: ConsentState | null): c is ConsentState {
  if (!c) return false
  if (c.version !== CONSENT_VERSION) return false
  if (Date.now() - c.timestamp > CONSENT_TTL_MS) return false
  return true
}

// ── Cookie I/O (client-side only) ──────────────────────────

export function readConsentCookie(): ConsentState | null {
  if (typeof document === 'undefined') return null
  const raw = document.cookie
    .split('; ')
    .find(s => s.startsWith(`${CONSENT_COOKIE}=`))
    ?.split('=')
    .slice(1)
    .join('=')

  if (!raw) return null
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as ConsentState
    return isConsentValid(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function writeConsentCookie(state: ConsentState): void {
  const value   = encodeURIComponent(JSON.stringify(state))
  const maxAge  = Math.floor(CONSENT_TTL_MS / 1000)
  const secure  = location.protocol === 'https:' ? '; Secure' : ''
  document.cookie =
    `${CONSENT_COOKIE}=${value}; max-age=${maxAge}; path=/; SameSite=Lax${secure}`
}

export function clearConsentCookie(): void {
  document.cookie = `${CONSENT_COOKIE}=; max-age=0; path=/`
}

// ── localStorage mirror (fast reads on hydration) ──────────

const LS_KEY = CONSENT_COOKIE

export function readConsentLS(): ConsentState | null {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as ConsentState
    return isConsentValid(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function writeConsentLS(state: ConsentState): void {
  try { localStorage.setItem(LS_KEY, JSON.stringify(state)) } catch {}
}

export function clearConsentLS(): void {
  try { localStorage.removeItem(LS_KEY) } catch {}
}

// ── Persist to both stores ──────────────────────────────────

export function persistConsent(state: ConsentState): void {
  writeConsentCookie(state)
  writeConsentLS(state)
}

export function clearConsent(): void {
  clearConsentCookie()
  clearConsentLS()
}
