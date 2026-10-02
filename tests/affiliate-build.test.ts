/**
 * tests/affiliate-build.test.ts
 *
 * Regression suite for lib/affiliate/build.buildAffiliateLink — the pure
 * Stay22 Allez URL builder. Previously untested; gained a new consumer this
 * session (the guide pages' hotel/experience fallback links, see
 * components/guides/HotelsSection.tsx + ExperiencesSection.tsx), so a
 * regression here would now silently degrade live guide booking links, not
 * just the planner.
 *
 *   npx tsx tests/affiliate-build.test.ts
 *
 * Exit 0 on all-pass, 1 otherwise.
 */

import { buildAffiliateLink, type AffiliateLinkContext } from '../lib/affiliate/build'
import type { ProviderId } from '../lib/affiliate/providers'

type Result = { name: string; pass: boolean; detail?: string }
const results: Result[] = []
function expectTrue(name: string, got: boolean, detail?: string) {
  results.push({ name, pass: got, detail: got ? undefined : (detail ?? 'expected true') })
}
function expectEq<T>(name: string, got: T, expected: T) {
  const pass = JSON.stringify(got) === JSON.stringify(expected)
  results.push({ name, pass, detail: pass ? undefined : `expected ${JSON.stringify(expected)}, got ${JSON.stringify(got)}` })
}

function parse(url: string) {
  const [base, qs] = url.split('?')
  return { base, params: new URLSearchParams(qs ?? '') }
}

// ── aid always present, regardless of context completeness ─────────────────────
{
  const url = buildAffiliateLink('booking', { city: 'Oaxaca' })
  const { params } = parse(url)
  expectEq('booking: aid is always lagomplan', params.get('aid'), 'lagomplan')
}
{
  const url = buildAffiliateLink('getyourguide', { city: '' })
  const { params } = parse(url)
  expectEq('getyourguide, empty city: aid still set', params.get('aid'), 'lagomplan')
}

// ── base URL / allez slug per provider ──────────────────────────────────────────
{
  const url = buildAffiliateLink('booking', { city: 'Roma' })
  expectTrue('booking: base URL is stay22 allez/booking', url.startsWith('https://www.stay22.com/allez/booking?'))
}
{
  const url = buildAffiliateLink('getyourguide', { city: 'Roma' })
  expectTrue('getyourguide: base URL is stay22 allez/getyourguide', url.startsWith('https://www.stay22.com/allez/getyourguide?'))
}
{
  // TS enforces ProviderId at compile time; cast to exercise the runtime
  // defensive branch that a future refactor (e.g. widening ProviderId) could
  // otherwise silently break.
  const url = buildAffiliateLink('not-a-real-provider' as ProviderId, { city: 'Roma' })
  expectEq('unknown provider: falls back to bare base URL', url, 'https://www.stay22.com/allez')
}

// ── city / address param ────────────────────────────────────────────────────────
{
  const url = buildAffiliateLink('booking', { city: 'Cancún' })
  const { params } = parse(url)
  expectEq('city is forwarded as address', params.get('address'), 'Cancún')
}
{
  const url = buildAffiliateLink('booking', { city: '  Mérida  ' })
  const { params } = parse(url)
  expectEq('city is trimmed before being set as address', params.get('address'), 'Mérida')
}
{
  const url = buildAffiliateLink('booking', { city: 'A' })
  const { params } = parse(url)
  expectEq('single-char city (< 2 chars) is dropped, not sent as address', params.has('address'), false)
}
{
  const url = buildAffiliateLink('booking', { city: '' })
  const { params } = parse(url)
  expectEq('empty city is dropped, not sent as address', params.has('address'), false)
}

// ── campaign label ───────────────────────────────────────────────────────────────
{
  const url = buildAffiliateLink('booking', { city: 'Roma', surface: 'guide', locale: 'es' })
  const { params } = parse(url)
  expectEq('campaign defaults to lagomplan-{surface}-{locale}', params.get('campaign'), 'lagomplan-guide-es')
}
{
  const url = buildAffiliateLink('getyourguide', { city: 'Roma', surface: 'guide', locale: 'en' })
  const { params } = parse(url)
  expectEq('campaign reflects guide/en surface+locale', params.get('campaign'), 'lagomplan-guide-en')
}
{
  const url = buildAffiliateLink('booking', { city: 'Roma' })
  const { params } = parse(url)
  expectEq('campaign falls back to planner/es when surface+locale are omitted', params.get('campaign'), 'lagomplan-planner-es')
}
{
  const url = buildAffiliateLink('booking', { city: 'Roma', campaign: 'custom-campaign' })
  const { params } = parse(url)
  expectEq('explicit campaign override wins', params.get('campaign'), 'custom-campaign')
}

// ── date range validation ────────────────────────────────────────────────────────
{
  const url = buildAffiliateLink('booking', { city: 'Roma', startDate: '2026-11-01', endDate: '2026-11-05' })
  const { params } = parse(url)
  expectEq('valid date range: checkin set', params.get('checkin'), '2026-11-01')
  expectEq('valid date range: checkout set', params.get('checkout'), '2026-11-05')
}
{
  const url = buildAffiliateLink('booking', { city: 'Roma', startDate: '2026-11-05', endDate: '2026-11-01' })
  const { params } = parse(url)
  expectEq('checkout before checkin: dates dropped', params.has('checkin'), false)
  expectEq('checkout before checkin: checkout also dropped', params.has('checkout'), false)
}
{
  const url = buildAffiliateLink('booking', { city: 'Roma', startDate: '2026-11-01', endDate: '2026-11-01' })
  const { params } = parse(url)
  expectEq('same-day checkin/checkout: dropped (Booking rejects same-day)', params.has('checkin'), false)
}
{
  const url = buildAffiliateLink('booking', { city: 'Roma', startDate: '11/01/2026', endDate: '2026-11-05' })
  const { params } = parse(url)
  expectEq('malformed startDate: both dates dropped', params.has('checkin'), false)
}
{
  const url = buildAffiliateLink('booking', { city: 'Roma', startDate: '2026-11-01' })
  const { params } = parse(url)
  expectEq('only startDate present: dropped', params.has('checkin'), false)
}

// ── adults ────────────────────────────────────────────────────────────────────────
{
  const url = buildAffiliateLink('booking', { city: 'Roma', adults: 3 })
  const { params } = parse(url)
  expectEq('valid adults forwarded', params.get('adults'), '3')
}
{
  const url = buildAffiliateLink('booking', { city: 'Roma', adults: 0 })
  const { params } = parse(url)
  expectEq('adults below 1 is dropped', params.has('adults'), false)
}
{
  const url = buildAffiliateLink('booking', { city: 'Roma', adults: 31 })
  const { params } = parse(url)
  expectEq('adults above 30 is dropped', params.has('adults'), false)
}
{
  const url = buildAffiliateLink('booking', { city: 'Roma', adults: 2.9 })
  const { params } = parse(url)
  expectEq('fractional adults is floored', params.get('adults'), '2')
}

// ── never throws on garbage input ───────────────────────────────────────────────
{
  let threw = false
  try {
    buildAffiliateLink('booking', {} as AffiliateLinkContext)
  } catch {
    threw = true
  }
  expectEq('missing city entirely does not throw', threw, false)
}

const passed = results.filter(r => r.pass).length
const failed = results.length - passed
console.log(`\naffiliate-build: ${passed}/${results.length} passed${failed ? `, ${failed} failed` : ''}\n`)
if (failed) {
  for (const f of results.filter(r => !r.pass)) console.log(`  ✗ ${f.name}\n      ${f.detail}`)
  console.log()
  process.exit(1)
}
process.exit(0)
