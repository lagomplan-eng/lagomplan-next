/**
 * tests/partner-attribution.test.ts
 *
 * Unit suite for lib/analytics/partner-attribution — the B2B2C partner
 * attribution capture behind the Mexico City pilot (and future partners).
 * Focus: partner-touch recognition, persistence-across-navigation,
 * last-touch-on-fresh-signal, graceful missing-UTM behavior, no-PII shape,
 * and that generic marketing UTMs are never misclassified as partner
 * traffic (QA item: "Normal B2C traffic is NOT incorrectly classified as
 * partner traffic").
 *
 *   npx tsx tests/partner-attribution.test.ts
 *
 * Exit 0 on all-pass, 1 otherwise.
 */

import {
  capturePartnerTouch,
  getPartnerTouch,
  getPartnerAttributionParams,
} from '../lib/analytics/partner-attribution'

// ── Minimal browser shim (this module is client-only: window.location +
//    window.localStorage). Safe to set up after the static import above —
//    partner-attribution.ts only touches `window` inside function bodies,
//    never at module-evaluation time, so nothing runs before this. ──────
type FakeStorage = {
  getItem(k: string): string | null
  setItem(k: string, v: string): void
  removeItem(k: string): void
}

function makeFakeStorage(): FakeStorage {
  const store = new Map<string, string>()
  return {
    getItem: (k) => (store.has(k) ? store.get(k)! : null),
    setItem: (k, v) => { store.set(k, v) },
    removeItem: (k) => { store.delete(k) },
  }
}

let fakeStorage = makeFakeStorage()

// Records every window.gtag('event', name, params) call so tests can
// assert on partner_visit firing (or not firing) without a real GA4 SDK.
type GtagCall = { command: string; args: unknown[] }
let gtagCalls: GtagCall[] = []

;(globalThis as any).window = {
  location: { href: 'https://www.lagomplan.com/' },
  get localStorage() { return fakeStorage },
  gtag: (command: string, ...args: unknown[]) => { gtagCalls.push({ command, args }) },
}

function setUrl(href: string) {
  ;(globalThis as any).window.location.href = href
}

function resetStorage() {
  fakeStorage = makeFakeStorage()
}

function resetGtagCalls() {
  gtagCalls = []
}

function partnerVisitCalls(): GtagCall[] {
  // A gtag('event', 'partner_visit', params) call — args[0] is the event
  // name, args[1] the params object.
  return gtagCalls.filter(c => c.command === 'event' && c.args[0] === 'partner_visit')
}

type Result = { name: string; pass: boolean; detail?: string }
const results: Result[] = []
function expectEq<T>(name: string, got: T, expected: T) {
  const pass = JSON.stringify(got) === JSON.stringify(expected)
  results.push({ name, pass, detail: pass ? undefined : `expected ${JSON.stringify(expected)}, got ${JSON.stringify(got)}` })
}
function expectTrue(name: string, got: boolean) {
  results.push({ name, pass: got, detail: got ? undefined : `expected true` })
}

// ───────── PA-01..03: recognized partner touch is captured ─────────
resetStorage()
setUrl('https://www.lagomplan.com/guia/livin_roma?utm_source=livin_roma&utm_medium=partner&utm_campaign=mxcity_pilot&utm_content=guest_guide')
const t1 = capturePartnerTouch()
expectEq('PA-01 partner_id derived from utm_source', t1?.partner_id, 'livin_roma')
expectEq('PA-02 pilot_id derived from utm_campaign', t1?.pilot_id, 'mxcity_pilot')
expectEq('PA-03 distribution_channel derived from utm_content', t1?.distribution_channel, 'guest_guide')

// ───────── PA-04: attribution params shape matches events.ts merge contract ─────────
expectEq('PA-04 getPartnerAttributionParams returns exactly the 3 GA dimensions',
  getPartnerAttributionParams(),
  { partner_id: 'livin_roma', pilot_id: 'mxcity_pilot', distribution_channel: 'guest_guide' })

// ───────── PA-05..06: persists across navigation (no UTMs on the next page) ─────────
setUrl('https://www.lagomplan.com/en/planner?destination=Mexico%20City')
const t2 = capturePartnerTouch()
expectEq('PA-05 partner touch survives navigation to a UTM-less URL', t2?.partner_id, 'livin_roma')
expectEq('PA-06 getPartnerTouch reads the same persisted record', getPartnerTouch()?.pilot_id, 'mxcity_pilot')

// ───────── PA-07: fresh partner touch on a NEW URL overwrites the old one ─────────
setUrl('https://www.lagomplan.com/guia/livin?utm_source=livin&utm_medium=partner&utm_campaign=mxcity_pilot&utm_content=whatsapp')
const t3 = capturePartnerTouch()
expectEq('PA-07 fresh signal overwrites partner_id', t3?.partner_id, 'livin')
expectEq('PA-07b fresh signal overwrites distribution_channel', t3?.distribution_channel, 'whatsapp')

// ───────── PA-08..09: generic marketing UTMs are NOT misread as partner traffic ─────────
resetStorage()
setUrl('https://www.lagomplan.com/?utm_source=google&utm_medium=cpc&utm_campaign=brand')
const t4 = capturePartnerTouch()
expectEq('PA-08 utm_medium=cpc is not a partner touch (no prior record → null)', t4, null)
expectEq('PA-09 no attribution params leak from non-partner UTMs', getPartnerAttributionParams(), {})

// utm_medium=partner but no utm_source at all — still not a valid touch.
setUrl('https://www.lagomplan.com/?utm_medium=partner')
expectEq('PA-09b utm_medium=partner without utm_source is not captured', capturePartnerTouch(), null)

// ───────── PA-10..11: missing UTMs entirely never breaks anything ─────────
resetStorage()
setUrl('https://www.lagomplan.com/en/planner')
expectEq('PA-10 no UTMs, no prior record → null (never throws)', capturePartnerTouch(), null)
expectEq('PA-11 getPartnerAttributionParams is {} with nothing stored', getPartnerAttributionParams(), {})

// ───────── PA-12: malformed localStorage JSON degrades to null, not a throw ─────────
resetStorage()
fakeStorage.setItem('lagomplan-partner-touch', '{not valid json')
let threw = false
let readAfterCorruption: unknown = 'unset'
try {
  readAfterCorruption = getPartnerTouch()
} catch {
  threw = true
}
expectTrue('PA-12 malformed stored JSON does not throw', !threw)
expectEq('PA-12b malformed stored JSON reads as null', readAfterCorruption, null)

// ───────── PA-13: no-PII shape — only the documented, non-identifying keys ever appear ─────────
resetStorage()
setUrl('https://www.lagomplan.com/guia/livin_roma?utm_source=livin_roma&utm_medium=partner&utm_campaign=mxcity_pilot&utm_content=qr_code')
const t5 = capturePartnerTouch()
const ALLOWED_KEYS = new Set(['partner_id', 'pilot_id', 'distribution_channel', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'captured_at'])
const gotKeys = Object.keys(t5 ?? {})
expectTrue('PA-13 captured record has no unexpected keys (no PII surface)',
  gotKeys.every(k => ALLOWED_KEYS.has(k)))
expectTrue('PA-13b captured record actually has content (test isn\'t vacuously true)', gotKeys.length > 0)

// ───────── PA-14: overlong utm_source is truncated, not passed through raw ─────────
resetStorage()
setUrl('https://www.lagomplan.com/?utm_source=' + 'a'.repeat(200) + '&utm_medium=partner')
const t6 = capturePartnerTouch()
expectTrue('PA-14 overlong utm_source is truncated to <= 60 chars', (t6?.partner_id.length ?? 999) <= 60)

// ───────── PA-15: storage-denied (private mode) still returns the captured value in-memory ─────────
resetStorage()
const originalSetItem = fakeStorage.setItem
fakeStorage.setItem = () => { throw new Error('storage denied') }
setUrl('https://www.lagomplan.com/guia/livin?utm_source=livin&utm_medium=partner&utm_campaign=mxcity_pilot&utm_content=prearrival')
let threwOnDeniedStorage = false
let t7: ReturnType<typeof capturePartnerTouch> = null
try {
  t7 = capturePartnerTouch()
} catch {
  threwOnDeniedStorage = true
}
fakeStorage.setItem = originalSetItem
expectTrue('PA-15 storage-denied does not throw', !threwOnDeniedStorage)
expectEq('PA-15b storage-denied still returns the in-memory captured record', t7?.partner_id, 'livin')

// ═════════ partner_visit event ═════════
// The event-scoped, non-sticky source of truth for "Partner Visits" —
// fires exactly once per genuinely NEW partner touch, never on plain
// re-renders/navigation, never for non-partner traffic.

// ───────── PV-1: fresh partner URL → exactly one partner_visit ─────────
resetStorage()
resetGtagCalls()
setUrl('https://www.lagomplan.com/guia/livin_roma?utm_source=livin_roma&utm_medium=partner&utm_campaign=mxcity_pilot&utm_content=guest_guide')
capturePartnerTouch()
expectEq('PV-1 exactly one partner_visit fires on a fresh partner URL', partnerVisitCalls().length, 1)
const pv1Params = partnerVisitCalls()[0]?.args[1] as Record<string, unknown> | undefined
expectEq('PV-1b partner_visit carries partner_id', pv1Params?.partner_id, 'livin_roma')
expectEq('PV-1c partner_visit carries pilot_id', pv1Params?.pilot_id, 'mxcity_pilot')
expectEq('PV-1d partner_visit carries distribution_channel', pv1Params?.distribution_channel, 'guest_guide')
expectEq('PV-1e partner_visit carries landing_path', pv1Params?.landing_path, '/guia/livin_roma')

// ───────── PV-2: same-page rerender (capture invoked again, same URL) → no duplicate ─────────
capturePartnerTouch()
capturePartnerTouch()
expectEq('PV-2 repeated capture on the identical tagged URL does not re-fire', partnerVisitCalls().length, 1)

// ───────── PV-3: navigation after capture (no UTMs) → no duplicate ─────────
setUrl('https://www.lagomplan.com/en/planner')
capturePartnerTouch()
expectEq('PV-3 navigating away (no UTMs) does not re-fire partner_visit', partnerVisitCalls().length, 1)

// ───────── PV-4: further UTM-less navigation → still no duplicate ─────────
setUrl('https://www.lagomplan.com/en/planner/trip-result')
capturePartnerTouch()
capturePartnerTouch()
expectEq('PV-4 further UTM-less navigation still does not re-fire', partnerVisitCalls().length, 1)

// ───────── PV-5: partner A then partner B → each fresh touch fires its own event ─────────
setUrl('https://www.lagomplan.com/guia/livin?utm_source=livin&utm_medium=partner&utm_campaign=mxcity_pilot&utm_content=whatsapp')
capturePartnerTouch()
expectEq('PV-5 a genuinely different partner touch (B) fires a second partner_visit', partnerVisitCalls().length, 2)
const pv5Params = partnerVisitCalls()[1]?.args[1] as Record<string, unknown> | undefined
expectEq('PV-5b second partner_visit carries the NEW partner_id', pv5Params?.partner_id, 'livin')
expectEq('PV-5c second partner_visit carries the NEW distribution_channel', pv5Params?.distribution_channel, 'whatsapp')

// ───────── PV-6: non-partner UTM (e.g. paid search) → no partner_visit ─────────
resetStorage()
resetGtagCalls()
setUrl('https://www.lagomplan.com/?utm_source=google&utm_medium=cpc&utm_campaign=brand')
capturePartnerTouch()
expectEq('PV-6 utm_medium=cpc never fires partner_visit', partnerVisitCalls().length, 0)

// ───────── PV-7: missing / malformed UTMs → no event, no error ─────────
resetStorage()
resetGtagCalls()
setUrl('https://www.lagomplan.com/en/planner')
let pv7Threw = false
try {
  capturePartnerTouch()
} catch {
  pv7Threw = true
}
expectTrue('PV-7 no UTMs at all does not throw', !pv7Threw)
expectEq('PV-7b no UTMs at all does not fire partner_visit', partnerVisitCalls().length, 0)

// utm_medium=partner present but utm_source empty/missing — malformed partner signal.
setUrl('https://www.lagomplan.com/?utm_medium=partner&utm_source=')
let pv7bThrew = false
try {
  capturePartnerTouch()
} catch {
  pv7bThrew = true
}
expectTrue('PV-7c malformed partner UTM (empty utm_source) does not throw', !pv7bThrew)
expectEq('PV-7d malformed partner UTM (empty utm_source) does not fire partner_visit', partnerVisitCalls().length, 0)

// ───────── tally + exit ─────────
const passed = results.filter(r => r.pass).length
const failed = results.length - passed
console.log(`\npartner-attribution: ${passed}/${results.length} passed${failed ? `, ${failed} failed` : ''}\n`)
if (failed) {
  for (const f of results.filter(r => !r.pass)) console.log(`  ✗ ${f.name}\n      ${f.detail}`)
  console.log()
  process.exit(1)
}
process.exit(0)
