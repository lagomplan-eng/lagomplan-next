/**
 * tests/generate-trip-headcount-currency.test.ts
 *
 * Regression suite for two bugs in the trip-generation pipeline
 * (supabase/functions/generate-trip/logic.ts):
 *
 *   Bug 1 — "Familia" party type sometimes described as "couple". Root
 *   cause was a client/server field-name mismatch: the client sends the
 *   party-type category as `traveler` (singular); the Edge Function read
 *   `body.travelers` (plural, never sent by any caller), which silently
 *   fell back to a literal `2` and broke family detection regardless of
 *   what the user picked.
 *
 *   Bug 2 — currency toggle (MXN/USD) not reliably reflected in the
 *   output. Fix added an explicit `currency` field to the request and a
 *   post-generation sanity check (isBudgetCurrencySuspect) that flags —
 *   never blocks — implausible per-person-per-night totals for the
 *   requested currency.
 *
 * These tests start from a raw, client-shaped `body` object (using the
 * field names the client actually sends — `traveler`, not `travelers`) so
 * a regression in the buildInput() field-name mapping fails the test, not
 * just a regression in the downstream arithmetic.
 *
 * Run with:
 *
 *   npx tsx tests/generate-trip-headcount-currency.test.ts
 *
 * Exit 0 on all-pass, 1 otherwise.
 */

import {
  buildInput, isFamilyTraveler, computeHeadcount, isBudgetCurrencySuspect,
} from '../supabase/functions/generate-trip/logic'

let passed = 0
let failed = 0
const failures: string[] = []

function check(label: string, got: unknown, expected: unknown) {
  const ok = JSON.stringify(got) === JSON.stringify(expected)
  if (ok) {
    passed++
  } else {
    failed++
    failures.push(`  ✗ ${label}\n      expected ${JSON.stringify(expected)}\n      got      ${JSON.stringify(got)}`)
  }
}

// ── Scenario 1: Familia / MXN ────────────────────────────────────────────
// Mirrors the exact shape TripResult.tsx sends — `traveler` (singular),
// `traveler_details` with real adults/children, `currency`. No `travelers`
// (plural) key anywhere, matching what the client actually sends — this is
// what makes the test fail if buildInput() regresses back to reading the
// wrong field.
{
  const body = {
    destination: 'Oaxaca',
    traveler: 'familia',
    traveler_details: { adults: 2, children: [{ type: 'kid', age: '8' }] },
    currency: 'MXN',
    nights: 3,
    duration_days: 4,
  }
  const input = buildInput(body)
  const headcount = computeHeadcount(input)

  check('familia: input.travelers holds the category string', input.travelers, 'familia')
  check('familia: isFamilyTraveler() true', isFamilyTraveler(input), true)
  check('familia: headcount = 2 adults + 1 child', headcount, 3)
  check('familia: currency passed through as MXN', input.currency, 'MXN')

  // Plausible MXN budget for a 3-night/3-person low-budget domestic trip
  // (~$1,333/person/night — see the worked example in the PR/report this
  // test accompanies) — must NOT be flagged.
  const legitBudget = {
    accommodation: { range: '$1,800' },
    food:          { range: '$1,200' },
    activities:    { range: '$600' },
    transport:     { range: '$400' },
  }
  check(
    'familia/MXN: legit low-budget total is not flagged suspect',
    isBudgetCurrencySuspect(legitBudget, input.currency, input.nights, headcount),
    false,
  )

  // The kind of USD-scale numbers that shouldn't pass as MXN for 3 nights /
  // 3 people (~$137/person/night — under the $150 floor).
  const suspectBudget = {
    accommodation: { range: '$500' },
    food:          { range: '$450' },
    activities:    { range: '$200' },
    transport:     { range: '$80' },
  }
  check(
    'familia/MXN: USD-scale total mislabeled MXN is flagged suspect',
    isBudgetCurrencySuspect(suspectBudget, input.currency, input.nights, headcount),
    true,
  )
}

// ── Scenario 2: Pareja / USD ──────────────────────────────────────────────
{
  const body = {
    destination: 'Torres del Paine',
    traveler: 'pareja',
    currency: 'USD',
    nights: 7,
    duration_days: 8,
  }
  const input = buildInput(body)
  const headcount = computeHeadcount(input)

  check('pareja: input.travelers holds the category string', input.travelers, 'pareja')
  check('pareja: isFamilyTraveler() false', isFamilyTraveler(input), false)
  check('pareja: headcount defaults to 2', headcount, 2)
  check('pareja: currency passed through as USD', input.currency, 'USD')

  // Plausible USD budget for a 7-night/2-person mid-range international
  // trip (~$147/person/night) — must NOT be flagged.
  const legitBudget = {
    accommodation: { range: '$900' },
    food:          { range: '$420' },
    activities:    { range: '$480' },
    transport:     { range: '$260' },
  }
  check(
    'pareja/USD: legit total is not flagged suspect',
    isBudgetCurrencySuspect(legitBudget, input.currency, input.nights, headcount),
    false,
  )

  // MXN-scale numbers mislabeled USD (~$2,700/person/night — over the
  // ceiling) must be flagged.
  const suspectBudget = {
    accommodation: { range: '$16,000' },
    food:          { range: '$10,000' },
    activities:    { range: '$8,000' },
    transport:     { range: '$4,000' },
  }
  check(
    'pareja/USD: MXN-scale total mislabeled USD is flagged suspect',
    isBudgetCurrencySuspect(suspectBudget, input.currency, input.nights, headcount),
    true,
  )
}

// ── Scenario 3: field-name regression guard ───────────────────────────────
// If someone reverts buildInput() to read `body.travelers` (plural)
// instead of `body.traveler`, this must fail — the body below only ever
// sets `traveler`, exactly like the real client.
{
  const body = { destination: 'Bacalar', traveler: 'familia', traveler_details: { adults: 3, children: [] } }
  const input = buildInput(body)
  check('regression guard: familia still detected from `traveler` alone', isFamilyTraveler(input), true)
  check('regression guard: headcount reflects 3 adults, 0 children', computeHeadcount(input), 3)
}

// ── Scenario 4: default currency when omitted ─────────────────────────────
{
  const input = buildInput({ destination: 'CDMX', traveler: 'solo' })
  check('no currency sent: defaults to MXN (matches HeroForm default)', input.currency, 'MXN')
  check('solo: headcount is 1', computeHeadcount(input), 1)
}

const total = passed + failed
console.log(`\ngenerate-trip headcount/currency: ${passed}/${total} passed${failed ? `, ${failed} failed` : ''}\n`)
if (failures.length) {
  console.log(failures.join('\n\n'))
  console.log()
  process.exit(1)
}
process.exit(0)
