/**
 * lib/planner/milestones.ts
 *
 * Trip Readiness System — milestone taxonomy + categorizer.
 *
 * Groups the AI-emitted check items into 5 bookable categories so the
 * user sees "where they are" in the trip prep journey instead of just
 * a flat "N of M tasks" count.
 *
 * Mapping is heuristic (regex on the check's display text). Categories
 * are intentionally broad — the goal is a visible state machine, not
 * a forensic taxonomy.
 *
 * Milestones list (locked for Phase 1):
 *   1. Itinerario — auto-done when days.length > 0
 *   2. Hospedaje  — hotel / lodging checks
 *   3. Traslados  — transport checks (flight, transfer, rental)
 *   4. Reservas   — restaurants, tours, attractions (fallback bucket)
 *   5. Listos     — docs + packing + check-in
 *
 * Categorizer keywords cover ES + EN since the AI emits per-locale.
 */

export type MilestoneId =
  | 'itinerario'
  | 'hospedaje'
  | 'traslados'
  | 'reservas'
  | 'listos'

export type MilestoneState = 'done' | 'pending' | 'na'

export interface Milestone {
  id:            MilestoneId
  labelES:       string
  labelEN:       string
  state:         MilestoneState
  matchedChecks: number
  doneChecks:    number
}

interface CheckInput {
  id:   string
  text: string
  done: boolean
}

const MILESTONE_DEFS: { id: MilestoneId; labelES: string; labelEN: string }[] = [
  { id: 'itinerario', labelES: 'Itinerario', labelEN: 'Itinerary' },
  { id: 'hospedaje',  labelES: 'Hospedaje',  labelEN: 'Lodging'   },
  { id: 'traslados',  labelES: 'Traslados',  labelEN: 'Transport' },
  { id: 'reservas',   labelES: 'Reservas',   labelEN: 'Bookings'  },
  { id: 'listos',     labelES: 'Listos',     labelEN: 'Ready'     },
]

/**
 * Categorize a single check by its display text. Falls back to 'reservas'
 * (the broad activity-booking bucket) when nothing else matches — keeps
 * the UI honest, never produces an uncategorized check.
 */
function categorizeCheck(text: string): MilestoneId {
  const t = text.toLowerCase()
  if (/\bhotel\b|hospedaj|alojam|airbnb|hostal|hostel|posada|lodging/.test(t)) return 'hospedaje'
  if (/vuelo|traslado|uber|taxi|tren|metro|bus|renta de auto|car rental|transport|flight|airport|aeropuerto/.test(t)) return 'traslados'
  if (/pasaporte|visa|seguro|documento|passport|equipaje|empacar|maleta|check[-\s]in|packing|insurance/.test(t)) return 'listos'
  return 'reservas'
}

interface ComputeArgs {
  /** Number of itinerary days; > 0 marks the itinerario milestone done. */
  daysCount: number
  /** Flat check list with completion state. */
  checks:    CheckInput[]
}

/**
 * Returns the 5 milestones in tracker order, each tagged with its
 * current state (done / pending / na). A bucket with zero matched
 * checks renders as 'na' (dimmed) so a trip without an air leg
 * doesn't shame the user for an unfillable Traslados milestone.
 */
export function computeMilestones({ daysCount, checks }: ComputeArgs): Milestone[] {
  const buckets: Record<Exclude<MilestoneId, 'itinerario'>, CheckInput[]> = {
    hospedaje: [],
    traslados: [],
    reservas:  [],
    listos:    [],
  }
  for (const c of checks) {
    const id = categorizeCheck(c.text)
    if (id !== 'itinerario') buckets[id].push(c)
  }

  return MILESTONE_DEFS.map<Milestone>(def => {
    if (def.id === 'itinerario') {
      return {
        id:            'itinerario',
        labelES:       def.labelES,
        labelEN:       def.labelEN,
        state:         daysCount > 0 ? 'done' : 'pending',
        matchedChecks: 0,
        doneChecks:    0,
      }
    }
    const matched = buckets[def.id]
    if (matched.length === 0) {
      return {
        id:            def.id,
        labelES:       def.labelES,
        labelEN:       def.labelEN,
        state:         'na',
        matchedChecks: 0,
        doneChecks:    0,
      }
    }
    const doneCount = matched.filter(c => c.done).length
    return {
      id:            def.id,
      labelES:       def.labelES,
      labelEN:       def.labelEN,
      state:         doneCount === matched.length ? 'done' : 'pending',
      matchedChecks: matched.length,
      doneChecks:    doneCount,
    }
  })
}
