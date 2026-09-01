/**
 * tests/guia-partner-registry.test.ts
 *
 * Regression suite for the Livin → Livin Condesa partner-slug rename.
 * Covers three layers that together prove the rename is safe:
 *
 *   1. Registry  — content/guia/index.ts resolves the new slug, the old
 *      slug is fully retired, Livin Roma is untouched.
 *   2. Redirects — next.config.mjs's redirects() contains exactly the
 *      rules the rename requires, and (via a small local matcher that
 *      mirrors Next.js's documented redirect semantics — path exact
 *      match, `has` query-value regex match, destination query merge
 *      with incoming-query pass-through for keys not in destination)
 *      resolves to the right destination URL for both a bare old-slug
 *      visit and a stale pre-rename tracking link.
 *   3. Attribution — feeding those resolved URLs into the real
 *      lib/analytics/partner-attribution.ts confirms partner_id
 *      actually comes out as livin_condesa, never the retired livin.
 *
 * Caveat: this cannot execute an actual HTTP redirect through Next.js
 * (no live dev server in this environment — see prior session notes).
 * The matcher in §2 is a manual re-implementation of Next.js's
 * documented `redirects()` semantics, not the framework's own code.
 * Recommend one live smoke test against a preview deploy before
 * sending links to the partner (see the final report's QA section).
 *
 *   npx tsx tests/guia-partner-registry.test.ts
 *
 * Exit 0 on all-pass, 1 otherwise.
 */

import { getPartner, getGuide, listPartnerSlugs } from '../content/guia'
import { capturePartnerTouch } from '../lib/analytics/partner-attribution'

type Result = { name: string; pass: boolean; detail?: string }
const results: Result[] = []
function expectEq<T>(name: string, got: T, expected: T) {
  const pass = JSON.stringify(got) === JSON.stringify(expected)
  results.push({ name, pass, detail: pass ? undefined : `expected ${JSON.stringify(expected)}, got ${JSON.stringify(got)}` })
}
function expectTrue(name: string, got: boolean) {
  results.push({ name, pass: got, detail: got ? undefined : `expected true` })
}

// tsx transforms this file to CJS, which doesn't support top-level await
// (needed below for the dynamic next.config.mjs import) — so everything
// runs inside this async IIFE instead.
async function main() {

// ═════════ 1. Registry ═════════

const condesa = getPartner('livin_condesa')
expectTrue('REG-01 (A) getPartner("livin_condesa") resolves', condesa !== null)
expectEq('REG-02 (4) Livin Condesa slug is livin_condesa', condesa?.slug, 'livin_condesa')
expectEq('REG-03 (5) Livin Condesa retains pilotId mxcity_pilot', condesa?.pilotId, 'mxcity_pilot')

const roma = getPartner('livin_roma')
expectTrue('REG-04 (E) getPartner("livin_roma") still resolves, unchanged', roma !== null)
expectEq('REG-05 (6) Livin Roma slug is still livin_roma', roma?.slug, 'livin_roma')
expectEq('REG-06 (7) Livin Roma retains pilotId mxcity_pilot', roma?.pilotId, 'mxcity_pilot')

expectEq('REG-07 the retired slug "livin" no longer resolves', getPartner('livin'), null)

const slugs = listPartnerSlugs().slice().sort()
expectEq('REG-08 registry contains exactly livin_condesa + livin_roma', slugs, ['livin_condesa', 'livin_roma'])

const condesaGuide = getGuide('livin_condesa')
expectTrue('REG-09 getGuide("livin_condesa") resolves partner + city', condesaGuide !== null && condesaGuide.city.id === 'cdmx')

// ═════════ 2. Redirects (next.config.mjs) ═════════

type RedirectRule = {
  source: string
  destination: string
  permanent: boolean
  has?: { type: string; key: string; value: string }[]
}

const { default: nextConfigWithIntl } = await import('../next.config.mjs')
const redirectRules = (await nextConfigWithIntl.redirects()) as RedirectRule[]

const shortSlugRule = redirectRules.find(r => r.source === '/livin')
expectTrue('RED-01 short-slug /livin rule exists', !!shortSlugRule)
expectEq('RED-02 short-slug /livin now points at /guia/livin_condesa', shortSlugRule?.destination, '/guia/livin_condesa')
expectEq('RED-03 short-slug /livin permanence is unchanged (307, pre-existing convention)', shortSlugRule?.permanent, false)

const guiaLivinRules = redirectRules.filter(r => r.source === '/guia/livin')
expectEq('RED-04 exactly two /guia/livin rules (specific stale-UTM + fallback)', guiaLivinRules.length, 2)

const staleUtmRule = guiaLivinRules.find(r => !!r.has)
expectTrue('RED-05 (B/D setup) a /guia/livin rule with `has` query conditions exists', !!staleUtmRule)
expectEq('RED-06 stale-UTM rule is permanent', staleUtmRule?.permanent, true)
expectEq('RED-07 stale-UTM rule rewrites utm_source in its destination', staleUtmRule?.destination, '/guia/livin_condesa?utm_source=livin_condesa&utm_medium=partner')

const fallbackRule = guiaLivinRules.find(r => !r.has)
expectTrue('RED-08 (B) a plain /guia/livin fallback rule exists', !!fallbackRule)
expectEq('RED-09 fallback rule destination', fallbackRule?.destination, '/guia/livin_condesa')
expectEq('RED-10 fallback rule is permanent', fallbackRule?.permanent, true)

expectTrue('RED-11 no redirect rule touches /guia/livin_roma (source or destination)',
  redirectRules.every(r => r.source !== '/guia/livin_roma' && !r.destination.includes('livin_roma')))

// ── Manual matcher mirroring Next.js's documented redirect semantics ──
// (exact path match; `has` query values matched as anchored regex;
// destination's own query keys win, unmatched incoming keys pass through)
function simulateRedirect(
  pathname: string,
  query: Record<string, string>,
  rules: RedirectRule[],
): { pathname: string; query: Record<string, string> } | null {
  for (const rule of rules) {
    if (rule.source !== pathname) continue
    const hasConditionsMet = (rule.has ?? []).every(h => {
      const v = query[h.key]
      return v !== undefined && new RegExp(h.value).test(v)
    })
    if (!hasConditionsMet) continue

    const [destPath, destQueryStr] = rule.destination.split('?')
    const destQuery: Record<string, string> = {}
    if (destQueryStr) {
      for (const [k, v] of new URLSearchParams(destQueryStr)) destQuery[k] = v
    }
    // Incoming keys not present in the destination's own query pass through.
    for (const [k, v] of Object.entries(query)) {
      if (!(k in destQuery)) destQuery[k] = v
    }
    return { pathname: destPath, query: destQuery }
  }
  return null
}

// Case B: bare old-slug visit, no UTMs at all.
const caseB = simulateRedirect('/guia/livin', {}, redirectRules)
expectTrue('RED-12 (B) /guia/livin with no UTMs matches a redirect rule', caseB !== null)
expectEq('RED-13 (B) /guia/livin redirects to /guia/livin_condesa', caseB?.pathname, '/guia/livin_condesa')

// Case D: stale pre-rename tracking link.
const caseD = simulateRedirect('/guia/livin', {
  utm_source: 'livin',
  utm_medium: 'partner',
  utm_campaign: 'mxcity_pilot',
  utm_content: 'prearrival',
}, redirectRules)
expectTrue('RED-14 (D) stale tracked /guia/livin matches a redirect rule', caseD !== null)
expectEq('RED-15 (D) resolves to /guia/livin_condesa', caseD?.pathname, '/guia/livin_condesa')
expectEq('RED-16 (D) utm_source is rewritten to livin_condesa', caseD?.query.utm_source, 'livin_condesa')
expectEq('RED-17 (D) utm_medium stays partner', caseD?.query.utm_medium, 'partner')
expectEq('RED-18 (D) utm_campaign (mxcity_pilot) passes through unchanged', caseD?.query.utm_campaign, 'mxcity_pilot')
expectEq('RED-19 (D) utm_content (prearrival) passes through unchanged', caseD?.query.utm_content, 'prearrival')

// Sanity: /guia/livin_roma is never touched by any rule (no rule's
// source matches it — a real request would simply pass through).
const romaPassthrough = simulateRedirect('/guia/livin_roma', { utm_source: 'livin_roma', utm_medium: 'partner' }, redirectRules)
expectEq('RED-20 (E) /guia/livin_roma never matches any redirect rule', romaPassthrough, null)

// ═════════ 3. Attribution — feed the resolved URLs into the real library ═════════

function toUrl(pathname: string, query: Record<string, string>): string {
  const qs = new URLSearchParams(query).toString()
  return `https://www.lagomplan.com${pathname}${qs ? `?${qs}` : ''}`
}

// Minimal localStorage/window shim (same pattern as tests/partner-attribution.test.ts).
const store = new Map<string, string>()
;(globalThis as any).window = {
  location: { href: 'https://www.lagomplan.com/' },
  localStorage: {
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
    setItem: (k: string, v: string) => { store.set(k, v) },
    removeItem: (k: string) => { store.delete(k) },
  },
  gtag: () => { /* no-op recorder — not asserted on in this file */ },
}
function setUrl(href: string) { (globalThis as any).window.location.href = href }

// (C) New tracked Condesa URL → partner_id=livin_condesa
store.clear()
setUrl('https://www.lagomplan.com/guia/livin_condesa?utm_source=livin_condesa&utm_medium=partner&utm_campaign=mxcity_pilot&utm_content=prearrival')
const touchC = capturePartnerTouch()
expectEq('ATTR-01 (C) direct Condesa tracking URL resolves partner_id=livin_condesa', touchC?.partner_id, 'livin_condesa')
expectEq('ATTR-02 (C) pilot_id=mxcity_pilot', touchC?.pilot_id, 'mxcity_pilot')
expectEq('ATTR-03 (12) distribution_channel derived from utm_content', touchC?.distribution_channel, 'prearrival')

// (D) The REDIRECTED old tracked URL, fed through the same library — must
// NOT resolve to partner_id=livin. This is the end-to-end proof: §2's
// simulateRedirect() output is what a real request to the stale link
// would land on, and here we prove that landing page correctly attributes
// livin_condesa, never the retired livin.
store.clear()
setUrl(toUrl(caseD!.pathname, caseD!.query))
const touchD = capturePartnerTouch()
expectEq('ATTR-04 (D) redirected stale link resolves partner_id=livin_condesa', touchD?.partner_id, 'livin_condesa')
expectTrue('ATTR-05 (D) redirected stale link never resolves partner_id=livin', touchD?.partner_id !== 'livin')
expectEq('ATTR-06 (D) pilot_id survives the redirect unchanged', touchD?.pilot_id, 'mxcity_pilot')
expectEq('ATTR-07 (D) distribution_channel survives the redirect unchanged', touchD?.distribution_channel, 'prearrival')

// (F) Livin Roma tracking → partner_id=livin_roma, unaffected by any of this.
store.clear()
setUrl('https://www.lagomplan.com/guia/livin_roma?utm_source=livin_roma&utm_medium=partner&utm_campaign=mxcity_pilot&utm_content=qr_code')
const touchF = capturePartnerTouch()
expectEq('ATTR-08 (F) Livin Roma tracking URL resolves partner_id=livin_roma', touchF?.partner_id, 'livin_roma')
expectEq('ATTR-09 (F) pilot_id=mxcity_pilot', touchF?.pilot_id, 'mxcity_pilot')

// ═════════ Planner-CTA UTM mirror (8, 9) ═════════
// GuiaClient.tsx builds the CTA with:
//   new URLSearchParams({ utm_source: partner.slug, utm_medium: 'partner',
//                          utm_campaign: partner.pilotId, utm_content: 'guest_guide' })
// This can't be rendered here (no React harness in this test convention),
// but it's a direct, branchless pass-through of partner.slug/pilotId —
// both already proven correct above (REG-02/03/05/06) — so mirroring the
// exact same construction against the real registry objects is a faithful
// proxy for what the component renders.
function mirrorPlannerCtaQuery(partner: { slug: string; pilotId: string }): URLSearchParams {
  return new URLSearchParams({
    utm_source: partner.slug,
    utm_medium: 'partner',
    utm_campaign: partner.pilotId,
    utm_content: 'guest_guide',
  })
}

const condesaCta = mirrorPlannerCtaQuery(condesa!)
expectEq('CTA-01 (8) Condesa planner CTA generates utm_source=livin_condesa', condesaCta.get('utm_source'), 'livin_condesa')
expectEq('CTA-02 (8) Condesa planner CTA utm_campaign=mxcity_pilot', condesaCta.get('utm_campaign'), 'mxcity_pilot')

const romaCta = mirrorPlannerCtaQuery(roma!)
expectEq('CTA-03 (9) Roma planner CTA generates utm_source=livin_roma', romaCta.get('utm_source'), 'livin_roma')
expectEq('CTA-04 (9) Roma planner CTA utm_campaign=mxcity_pilot', romaCta.get('utm_campaign'), 'mxcity_pilot')

// ───────── tally + exit ─────────
const passed = results.filter(r => r.pass).length
const failed = results.length - passed
console.log(`\nguia-partner-registry: ${passed}/${results.length} passed${failed ? `, ${failed} failed` : ''}\n`)
if (failed) {
  for (const f of results.filter(r => !r.pass)) console.log(`  ✗ ${f.name}\n      ${f.detail}`)
  console.log()
  process.exit(1)
}
process.exit(0)

}

main()
