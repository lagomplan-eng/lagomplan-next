/**
 * lib/planner/readiness-copy.ts
 *
 * Trip Readiness System — the headline + sub copy shared by the planner's
 * TripReadinessBar and the mobile companion view's readiness header, so both
 * surfaces speak with one voice (emotional readiness % + departure countdown).
 *
 * Pure: no I/O, no React. Numbers in → strings out. Unit-tested in
 * tests/readiness-copy.test.ts.
 */

export interface ReadinessCopyInput {
  /** 0–100 doneChecks / totalChecks. */
  readinessPct: number
  totalChecks:  number
  pendingCount: number
  /** Itinerary day count — used for the pre-checklist "N días planificados". */
  daysCount:    number
  /** Whole days until departure; null/undefined when unknown or in the past. */
  daysUntilTrip?: number | null
  locale: 'es' | 'en'
}

export interface ReadinessCopy {
  /** Big line: "Tu viaje está 60% listo" / "✓ Tu viaje está listo". */
  headline: string
  /** Small line: "⏳ Faltan 3 días · Te faltan 2 pasos". */
  sub: string
  /** True inside the last week before departure — callers may emphasise. */
  urgent: boolean
}

export function readinessCopy(i: ReadinessCopyInput): ReadinessCopy {
  const { readinessPct, totalChecks, pendingCount, daysCount, daysUntilTrip, locale } = i
  const isES = locale === 'es'
  const tripReady = totalChecks > 0 && pendingCount === 0

  const headline = tripReady
    ? (isES ? '✓ Tu viaje está listo' : '✓ Your trip is ready')
    : totalChecks === 0
      ? (isES ? `${daysCount} ${daysCount === 1 ? 'día' : 'días'} planificados` : `${daysCount} ${daysCount === 1 ? 'day' : 'days'} planned`)
      : (isES ? `Tu viaje está ${readinessPct}% listo` : `Your trip is ${readinessPct}% ready`)

  // Countdown to departure — turns the readiness number into something
  // time-bound. Escalates emotionally (⏳) inside the last week.
  const d = daysUntilTrip
  const countdown = d == null ? null
    : d === 0 ? (isES ? 'Hoy es el día ✈️' : "Today's the day ✈️")
    : d === 1 ? (isES ? 'Falta 1 día'      : '1 day to go')
    :           (isES ? `Faltan ${d} días` : `${d} days to go`)
  const urgent = d != null && d > 0 && d <= 7

  const steps = tripReady
    ? (isES ? 'Todo confirmado'   : 'All confirmed')
    : totalChecks === 0
      ? (isES ? 'Listo para empezar' : 'Ready to plan')
      : pendingCount === 1
        ? (isES ? 'Te falta 1 paso'  : '1 step to go')
        : (isES ? `Te faltan ${pendingCount} pasos` : `${pendingCount} steps to go`)

  // With a countdown the date carries the urgency; without one keep the
  // standalone "…para viajar" framing (ES only — EN's "to go" already implies it).
  const sub = countdown
    ? `${urgent ? '⏳ ' : ''}${countdown} · ${steps}`
    : (totalChecks > 0 && !tripReady
        ? (isES ? `${steps} para viajar` : steps)
        : steps)

  return { headline, sub, urgent }
}
