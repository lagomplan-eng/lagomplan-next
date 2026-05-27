/**
 * types/intelligence.ts
 *
 * Trip-intelligence data layer. Computed in lib/intelligence.ts at trip
 * save time and persisted to trips.intelligence (JSONB). Surfaced to the
 * user via DayFlowBadge / IntelligenceCallout / HotelFitBadge (Phase 1B).
 *
 * Design constraints (from the Lagomplan Intelligence Foundation spec):
 *   • Numeric scores (0-100) are INTERNAL only. Never rendered in the UI.
 *     The user sees qualitative labels: "Fluido" / "Manejable" / "Pesado"
 *     for days; "Base ideal" / "Funcional" / "Alejado" for hotels.
 *   • Tone of messages and suggestions stays calm + human, not alarming.
 *   • No external API dependencies (geocoding, maps). Distance comes from
 *     a hardcoded neighborhood-centroid table.
 *
 * Persistence contract: this entire shape is the value of trips.intelligence.
 * If the column is null on a row, treat the trip as "no intelligence
 * computed" and don't render the badges — common for trips generated
 * before the migration landed.
 */

// ── Per-day analysis ─────────────────────────────────────────────────────────

export type DayFlagType =
  | 'post_arrival'
  | 'overloaded'
  | 'late_dinner'
  | 'early_departure'
  | 'energy_warning'

export type FlagSeverity = 'info' | 'warning' | 'critical'

export interface DayFlag {
  type:       DayFlagType
  severity:   FlagSeverity
  /** User-facing message in Spanish, calm editorial tone. */
  message:    string
  /** One-line action suggestion the user can act on. */
  suggestion: string
}

export type DayLabel = 'Fluido' | 'Manejable' | 'Pesado'

export interface DayIntelligence {
  day_number:               number
  /** Qualitative label rendered in the UI. Derived from day_score. */
  day_label:                DayLabel
  /** Internal score 0-100. NEVER rendered to the user — internal use only. */
  day_score:                number
  estimated_walking_min:    number
  estimated_transit_segments: number
  activity_count:           number
  flags:                    DayFlag[]
}

// ── Hotel fit ────────────────────────────────────────────────────────────────

export type HotelFitLabel = 'Base ideal' | 'Funcional' | 'Alejado'

export interface HotelFitScore {
  label: HotelFitLabel
  /** Internal score 0-100. NEVER rendered. */
  score: number
  /** One-line human explanation, e.g. "A 0.8 km promedio de tus actividades." */
  note:  string
}

// ── Trip-level flags ─────────────────────────────────────────────────────────

export type TripFlagType =
  | 'arrival_day_full'
  | 'departure_day_full'
  | 'no_rest_days'

export interface TripFlag {
  type:     TripFlagType
  severity: FlagSeverity
  message:  string
}

// ── Root ─────────────────────────────────────────────────────────────────────

export interface TripIntelligence {
  /** ISO timestamp when this analysis was computed. */
  computed_at: string
  days:        DayIntelligence[]
  hotel_fit:   HotelFitScore
  trip_flags:  TripFlag[]
}

// ── Input shape for the engine (subset of Lagomplan trip_data) ──────────────
//
// The engine accepts a permissive subset of the real trip_data shape so it
// degrades cleanly on missing fields (legacy trips, malformed AI output, etc).

export interface IntelligenceInputBlock {
  time?:         string
  title?:        string
  description?:  string
  type?:         string
  neighborhood?: string
}

export interface IntelligenceInputDay {
  day_number?: number
  title?:      string
  blocks?:     IntelligenceInputBlock[]
}

export interface IntelligenceInputAccommodation {
  city?:         string
  neighborhood?: string
}

export interface IntelligenceInput {
  days?:               IntelligenceInputDay[]
  accommodations?:     IntelligenceInputAccommodation[]
  /** Total trip duration in days. Used for arrival/departure heuristics. */
  duration_days?:      number
  /** User's walking pace preference. Falls back to 'medium' if missing. */
  walking_tolerance?:  'low' | 'medium' | 'high'
  /** 1-indexed arrival day (defaults to 1 if absent). */
  arrival_day?:        number
  /** 1-indexed departure day (defaults to duration_days if absent). */
  departure_day?:      number
}
