/**
 * tests/saved-plan-flag.test.ts — run: npx tsx tests/saved-plan-flag.test.ts
 * The saved plan (+ Mi plan, plan bar, plan panel) is hidden until "Guardados" ships:
 * flag NEXT_PUBLIC_FEATURE_SAVED_PLAN, default off. Off means no plan_* events and no
 * plan UI; the code is still there. The concierge CTA stays, as "Planear mi viaje".
 */
import { readFileSync } from 'fs'
import { isSavedPlanEnabled } from '../lib/feature-flags'
import { trackPlanBook, trackPlanChange, trackPlanHandoff } from '../lib/catalog-analytics'
import type { PlanEntry } from '../lib/plan'

let pass = 0, fail = 0
function eq(a: unknown, b: unknown, msg: string) {
  if (JSON.stringify(a) === JSON.stringify(b)) pass++
  else { fail++; console.error(`FAIL ${msg}\n  got      ${JSON.stringify(a)}\n  expected ${JSON.stringify(b)}`) }
}
const ok = (c: boolean, msg: string) => eq(c, true, msg)

const sent: any[][] = []
;(globalThis as any).window = { gtag: (...a: any[]) => sent.push(a) }
const KEY = 'NEXT_PUBLIC_FEATURE_SAVED_PLAN'
const exp: PlanEntry = { type: 'experience', id: 'x', destinationSlug: 'roma', bookingUrl: 'https://www.getyourguide.com/x?partner_id=X71QPE5&cmp=experiencias-x' } as any
const hotel: PlanEntry = { type: 'hotel', id: 'h', destinationSlug: 'roma', provider: 'booking', bookingUrl: 'https://www.booking.com/h' } as any
const fireAll = () => {
  trackPlanChange('add', exp, 1, 'es'); trackPlanChange('remove', exp, 0, 'es')
  trackPlanHandoff('roma', 2, true, 'panel', 'es'); trackPlanHandoff(null, 0, false, 'concierge', 'es')
  trackPlanBook(exp, 1, 'es'); trackPlanBook(hotel, 2, 'es')
}

// ── default and values ─────────────────────────────────────────────────────
delete process.env[KEY]
eq(isSavedPlanEnabled(), false, 'default: off')
for (const v of ['', 'false', '0', 'TRUE', '1', 'yes']) { process.env[KEY] = v; eq(isSavedPlanEnabled(), false, `"${v}": off`) }
process.env[KEY] = 'true'; eq(isSavedPlanEnabled(), true, '"true": on')

// ── no events while off ────────────────────────────────────────────────────
delete process.env[KEY]; sent.length = 0
fireAll()
eq(sent.length, 0, 'flag off: no gtag call at all from the plan trackers (no plan_*, no plan-panel partner_link_click)')

// ── events unchanged while on ──────────────────────────────────────────────
process.env[KEY] = 'true'; sent.length = 0
fireAll()
eq(sent.map(s => s[1]), ['plan_add', 'plan_remove', 'plan_handoff', 'plan_handoff', 'partner_link_click', 'partner_link_click'], 'flag on: all six fire')

// ── components: plan UI only behind the flag; code still present ───────────
for (const f of ['components/experiences/ExperiencesHub.tsx', 'components/hotels/HotelsClient.tsx']) {
  const src = readFileSync(f, 'utf8')
  ok(src.includes('isSavedPlanEnabled()'), `${f}: reads the flag`)
  ok(/planEnabled \? <PlanButton /.test(src), `${f}: "+ Mi plan" button only when enabled`)
  ok(/\{planEnabled && \(\s*<PlanTray/.test(src), `${f}: plan bar/panel only when enabled`)
  ok(/usePlan\(planEnabled\)/.test(src), `${f}: plan storage untouched when disabled`)
  ok(src.includes('trackPlanChange') && src.includes('PlanTray'), `${f}: plan code kept, not deleted`)
}

// ── concierge copy ─────────────────────────────────────────────────────────
for (const [loc, cta] of [['es', 'Planear mi viaje →'], ['en', 'Plan my trip →']] as const) {
  const m = JSON.parse(readFileSync(`messages/${loc}.json`, 'utf8'))
  eq(m.experiences.concierge.cta, cta, `${loc}: concierge CTA copy`)
  ok(!/estas experiencias|these experiences/i.test(m.experiences.concierge.cta), `${loc}: no "with these experiences"`)
}
ok(/concierge\.cta/.test(readFileSync('components/experiences/ExperiencesHub.tsx', 'utf8')), 'concierge CTA still rendered')

console.log(`${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
