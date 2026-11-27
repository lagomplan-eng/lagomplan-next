// lib/hotels/report/types.ts — the report as data (no wording): built by build.ts, turned into words by doc.ts.
export type Lang = 'es' | 'en'

export interface ReportEvent {
  event_type: 'scan' | 'section_open' | 'outbound_click' | string
  section: string | null
  place?: string | null
  source?: string | null
  lang: string | null
  created_at: string
}

export interface PropertyInput {
  name: string
  code: string
  /** Set in /admin/hoteles. Overrides the approval date. "YYYY-MM-DD" (Mexico City). */
  countFrom: string | null
  /** ISO timestamp of the approval: the default "count from" day. */
  approvedAt: string | null
  events: ReportEvent[]
  /** The same hotel's events of the previous month (paid change-vs-last-month). */
  prevEvents?: ReportEvent[]
  /** Paid edition only: taps counted by the paid_guide_* events, when they are stored. Absent = not stored = not shown. */
  paid?: PaidCounts
}

export interface PaidCounts { contact: number; requests: { label: string; count: number }[]; reviews: number; calendar: number }

export interface Brand { name: string; logoUrl?: string; colour?: string }

export type SectionState =
  | { kind: 'counted'; from: string | null } // `from` = a "counted from <date>" note, when the period began before counting did
  | { kind: 'not_counted'; from: string } // nothing was being counted in this month yet

export interface Counted { id: string; label: string; count: number }

export interface PropertyReport {
  name: string
  code: string
  month: string
  /** First day of the window actually counted (the month, or later when the hotel's count-from date falls inside it). */
  windowFrom: string
  windowNote: string | null // set when the hotel's count-from / approval date cut into the month
  partial: boolean // the month is not over yet
  empty: boolean // the whole month is before the count-from date
  visits: { total: number; weeks: { weekStart: string; from: string; scans: number }[]; languages: { es: number; en: number; other: number } }
  opens: { state: SectionState; zones: Counted[]; moods: Counted[]; plans: Counted[] }
  places: { state: SectionState; items: { id: string; name: string; count: number; where: Counted[] }[]; total: number }
  actions: { experience: number; planner: number; share: number }
  paid?: PaidCounts
}

export interface Change { metric: 'visits' | 'opens' | 'places' | 'actions'; now: number; before: number }

export interface Report {
  edition: 'free' | 'paid'
  lang: Lang
  month: string
  brand: Brand | null
  /** One entry for a hotel; several for a client with several properties. */
  properties: PropertyReport[]
  totals: { visits: number; opens: number; places: number; actions: number } | null // only with 2+ properties
  /** Paid: change against the previous month (null when it cannot be compared honestly). */
  change: Change[] | null
  insights: string[]
}
