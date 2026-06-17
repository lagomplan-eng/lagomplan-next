/**
 * tests/readiness-copy.test.ts
 *
 * Unit suite for lib/planner/readiness-copy — the headline+sub copy shared by
 * the planner's TripReadinessBar and the mobile companion view, so both
 * surfaces stay in lockstep. Framework-free; `npx tsx tests/readiness-copy.test.ts`.
 */

import { readinessCopy } from '../lib/planner/readiness-copy'

type Result = { name: string; pass: boolean; detail?: string }
const results: Result[] = []
function expectEq<T>(name: string, got: T, expected: T) {
  const pass = JSON.stringify(got) === JSON.stringify(expected)
  results.push({ name, pass, detail: pass ? undefined : `expected ${JSON.stringify(expected)}, got ${JSON.stringify(got)}` })
}

const base = { readinessPct: 60, totalChecks: 5, pendingCount: 2, daysCount: 5, locale: 'es' as const }

// No date → standalone "…para viajar" framing, not urgent
expectEq('RC-01: no date headline', readinessCopy({ ...base }).headline, 'Tu viaje está 60% listo')
expectEq('RC-02: no date sub',      readinessCopy({ ...base }).sub, 'Te faltan 2 pasos para viajar')
expectEq('RC-03: no date not urgent', readinessCopy({ ...base }).urgent, false)

// Far-off date → countdown prefix, not urgent
expectEq('RC-04: far date sub', readinessCopy({ ...base, daysUntilTrip: 20 }).sub, 'Faltan 20 días · Te faltan 2 pasos')
expectEq('RC-05: far date not urgent', readinessCopy({ ...base, daysUntilTrip: 20 }).urgent, false)

// Inside the last week → urgent ⏳
expectEq('RC-06: urgent sub', readinessCopy({ ...base, daysUntilTrip: 3 }).sub, '⏳ Faltan 3 días · Te faltan 2 pasos')
expectEq('RC-07: urgent flag', readinessCopy({ ...base, daysUntilTrip: 3 }).urgent, true)

// Singular day + departure day
expectEq('RC-08: 1 day', readinessCopy({ ...base, daysUntilTrip: 1 }).sub, '⏳ Falta 1 día · Te faltan 2 pasos')
expectEq('RC-09: day 0', readinessCopy({ ...base, daysUntilTrip: 0 }).sub, 'Hoy es el día ✈️ · Te faltan 2 pasos')

// Singular step
expectEq('RC-10: 1 step', readinessCopy({ ...base, pendingCount: 1 }).sub, 'Te falta 1 paso para viajar')

// Trip ready (0 pending)
expectEq('RC-11: ready headline', readinessCopy({ ...base, pendingCount: 0 }).headline, '✓ Tu viaje está listo')
expectEq('RC-12: ready sub',      readinessCopy({ ...base, pendingCount: 0 }).sub, 'Todo confirmado')

// No checks yet → "N días planificados" / "Listo para empezar"
expectEq('RC-13: planned headline', readinessCopy({ ...base, totalChecks: 0, pendingCount: 0 }).headline, '5 días planificados')
expectEq('RC-14: planned sub',      readinessCopy({ ...base, totalChecks: 0, pendingCount: 0 }).sub, 'Listo para empezar')

// English
expectEq('RC-15: EN headline', readinessCopy({ ...base, locale: 'en' }).headline, 'Your trip is 60% ready')
expectEq('RC-16: EN sub (no date)', readinessCopy({ ...base, locale: 'en' }).sub, '2 steps to go')
expectEq('RC-17: EN countdown', readinessCopy({ ...base, locale: 'en', daysUntilTrip: 3 }).sub, '⏳ 3 days to go · 2 steps to go')

// ───────── tally + exit ─────────
const passed = results.filter(r => r.pass).length
const failed = results.length - passed
console.log(`\nreadiness-copy: ${passed}/${results.length} passed${failed ? `, ${failed} failed` : ''}\n`)
if (failed) {
  for (const f of results.filter(r => !r.pass)) console.log(`  ✗ ${f.name}\n      ${f.detail}`)
  console.log()
  process.exit(1)
}
process.exit(0)
