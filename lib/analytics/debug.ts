/**
 * lib/analytics/debug.ts
 *
 * Dev-only console logger for analytics events. Eliminates the
 * GA DebugView round-trip for verifying that an event fires:
 * instead of refreshing GA and looking for the event in the
 * timeline, just open DevTools console and the fire is there
 * inline, with payload, in ~10 ms.
 *
 * Opt-in — never logs by default, even in development. Three ways
 * to enable:
 *
 *   1. URL param (one-shot): append `?analytics_debug=1` to any
 *      URL. Persists across navigation via localStorage. Disable
 *      with `?analytics_debug=0`.
 *
 *   2. Console toggle: in DevTools, type
 *        lagomplanAnalytics.debug.enable()
 *        lagomplanAnalytics.debug.disable()
 *      The `lagomplanAnalytics` global is exposed automatically
 *      on every page so it's always available.
 *
 *   3. Direct localStorage:
 *        localStorage.setItem('lagomplan-analytics-debug', '1')
 *
 * What gets logged on each event fire:
 *   - Timestamp (HH:MM:SS.mmm)
 *   - Source (GA / Meta) + event name
 *   - Payload object
 *   - Consent state (none/essential/all) so you can see at a glance
 *     whether the event will actually transmit or be dropped by
 *     Consent Mode v2
 *   - gtag/fbq loaded flag — true when the SDK is present in the
 *     window. If false, even an enabled debug mode means the call
 *     no-ops at the wrapper layer (e.g., Meta isn't loaded for
 *     Essential-only users).
 */

import { getConsent } from '../consent'

const DEBUG_KEY = 'lagomplan-analytics-debug'

function readLocalStorageDebug(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem(DEBUG_KEY) === '1'
  } catch {
    return false
  }
}

function writeLocalStorageDebug(enabled: boolean): void {
  if (typeof window === 'undefined') return
  try {
    if (enabled) window.localStorage.setItem(DEBUG_KEY, '1')
    else         window.localStorage.removeItem(DEBUG_KEY)
  } catch {
    // Private mode — ignore.
  }
}

// Honour URL param on first load. Side-effect runs once per
// module-load (effectively once per page) so navigating to
// `?analytics_debug=1` enables and persists; `?analytics_debug=0`
// disables. Anything else preserves the existing localStorage state.
function applyUrlParam(): void {
  if (typeof window === 'undefined') return
  try {
    const param = new URL(window.location.href).searchParams.get('analytics_debug')
    if (param === '1') writeLocalStorageDebug(true)
    else if (param === '0') writeLocalStorageDebug(false)
  } catch {
    // Malformed URL — ignore.
  }
}
applyUrlParam()

function isDebugEnabled(): boolean {
  return readLocalStorageDebug()
}

/**
 * Logs one analytics event fire to the console when debug is on.
 * Format chosen for at-a-glance scanability:
 *
 *   [analytics] 14:23:08.412 GA itinerary_generated [consent:all] [gtag:loaded]
 *     ▸ { destination: "CDMX", nights: 3, locale: "es" }
 *
 * Color-coded with %c so the prefix stands out in console output.
 */
export function analyticsDebug(
  label:    string,
  payload?: unknown,
  meta?:    { gtagLoaded?: boolean; fbqLoaded?: boolean },
): void {
  if (!isDebugEnabled()) return
  if (typeof window === 'undefined') return

  const now = new Date()
  const ts =
    String(now.getHours()).padStart(2, '0') + ':' +
    String(now.getMinutes()).padStart(2, '0') + ':' +
    String(now.getSeconds()).padStart(2, '0') + '.' +
    String(now.getMilliseconds()).padStart(3, '0')

  const consent = getConsent() ?? 'none'

  const tags: string[] = [`consent:${consent}`]
  if (meta?.gtagLoaded !== undefined) tags.push(`gtag:${meta.gtagLoaded ? 'loaded' : 'absent'}`)
  if (meta?.fbqLoaded  !== undefined) tags.push(`fbq:${meta.fbqLoaded ? 'loaded' : 'absent'}`)

  console.log(
    `%c[analytics] ${ts} ${label} %c${tags.map(t => `[${t}]`).join(' ')}`,
    'color:#0F3A33;font-weight:600',
    'color:#7A7A76;font-weight:400;font-size:11px',
    payload ?? '',
  )
}

/**
 * Programmatic toggles — also wired to the `lagomplanAnalytics`
 * global below so they're reachable from the browser DevTools
 * console without imports.
 */
export function enableAnalyticsDebug(): void {
  writeLocalStorageDebug(true)
  if (typeof console !== 'undefined') {
    console.log('%c[analytics] debug enabled', 'color:#0F3A33;font-weight:600')
  }
}

export function disableAnalyticsDebug(): void {
  writeLocalStorageDebug(false)
  if (typeof console !== 'undefined') {
    console.log('%c[analytics] debug disabled', 'color:#7A7A76')
  }
}

// Expose a window-level handle so the toggles are reachable from
// DevTools without imports. Type-cast through `unknown` because we
// only want the surface visible to humans typing in the console;
// the app itself uses the named exports above.
if (typeof window !== 'undefined') {
  ;(window as unknown as { lagomplanAnalytics?: object }).lagomplanAnalytics = {
    debug: {
      enable:    enableAnalyticsDebug,
      disable:   disableAnalyticsDebug,
      isEnabled: isDebugEnabled,
    },
  }
}
