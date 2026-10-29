// content/guia/agenda/schema.ts
//
// Zod schema (strict) for content/guia/cdmx/agenda.json — the dated agenda
// ("Mientras estás aquí" / "While you're here") and the evergreen day trips.
// City layer: any guide can use it later. Unknown keys are errors, so typos
// fail the build instead of being silently ignored. Pure (no fs).

import { z } from 'zod'

export const SCHEMA_VERSION = 1
export const CATEGORIES = ['food', 'culture', 'sport', 'outdoors', 'music', 'city'] as const
export type Category = (typeof CATEGORIES)[number]
export const STATUSES = ['verified', 'to_verify'] as const

const text = (what: string) => z.string({ error: `${what} must be text` }).trim().min(1, `${what} can't be empty`)
const bilingual = (what: string) =>
  z.object({ es: text(`${what}.es`), en: text(`${what}.en`) }, { error: `${what} needs both "es" and "en"` }).strict()
const https = z.string({ error: 'must be text' }).regex(/^https:\/\/[^\s]+$/, 'must be a full https:// URL')

/** A real calendar date, YYYY-MM-DD, in a sane range. */
const isoDate = z.string({ error: 'must be a YYYY-MM-DD date' }).superRefine((d, ctx) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return ctx.addIssue({ code: 'custom', message: `must be YYYY-MM-DD (got "${d}")` })
  const [y, m, day] = d.split('-').map(Number)
  const t = new Date(Date.UTC(y, m - 1, day))
  if (y < 2000 || y > 2100 || t.getUTCFullYear() !== y || t.getUTCMonth() !== m - 1 || t.getUTCDate() !== day) {
    ctx.addIssue({ code: 'custom', message: `"${d}" is not a real date` })
  }
})

const id = z.string().regex(/^[a-z0-9][a-z0-9-]{0,63}$/, 'lowercase letters, digits and hyphens only (max 64)')

export const eventSchema = z.object({
  id,
  title: bilingual('title'),
  category: z.enum(CATEGORIES, { error: `must be one of: ${CATEGORIES.join(', ')}` }),
  start: isoDate,
  end: isoDate,
  /** Free-form date text, e.g. "29 oct–2 nov". Not shown in the stay-window layout (dates come from start/end); kept for reference. */
  dateLabel: bilingual('dateLabel'),
  /** Venue. Omit when there is none (city-wide) or it is unknown: the row then shows only the category. */
  place: bilingual('place').optional(),
  /** Short clock label shown under the date in the list, e.g. "14:00" / "10–19 h". Omit when unknown: never invented. */
  time: bilingual('time').optional(),
  /** Reference facts. Not shown in the stay-window layout; omit what we do not know instead of writing a placeholder. */
  why: bilingual('why').optional(),
  hours: bilingual('hours').optional(),
  cost: bilingual('cost').optional(),
  /** Official / source page. When present the whole row links to it. */
  url: https.optional(),
  featured: z.boolean({ error: 'must be true or false' }),
  status: z.enum(STATUSES, { error: `must be one of: ${STATUSES.join(', ')}` }),
  verifiedAt: isoDate.optional(),
  verifiedBy: text('verifiedBy').optional(),
  /** Internal QA note (never rendered); listed by agenda:check. */
  checkNote: text('checkNote').optional(),
}).strict().superRefine((e, ctx) => {
  const add = (path: string, message: string) => ctx.addIssue({ code: 'custom', path: [path], message })
  if (e.end < e.start) add('end', `ends before it starts (${e.start} → ${e.end})`)
  if (e.status === 'verified') {
    if (!e.verifiedAt) add('verifiedAt', 'a verified event needs verifiedAt')
    if (!e.verifiedBy) add('verifiedBy', 'a verified event needs verifiedBy')
  }
})

/** Things that happen every week (not dated). 0 = Sunday … 6 = Saturday. */
export const recurringSchema = z.object({
  id,
  title: bilingual('title'),
  /** Weekdays on which an occurrence row appears in the calendar. Empty = it never appears in the calendar (e.g. a daily thing). */
  weekdays: z.array(z.number().int().min(0).max(6)).max(7).refine((d) => new Set(d).size === d.length, 'weekdays must be unique'),
  /** Short clock label under the date in the list (e.g. "8–14 h", "Noche"). Omit when unknown. */
  time: bilingual('time').optional(),
  /** Reference label, e.g. "Domingos · 8–14 h". */
  when_label: bilingual('when_label'),
  /** One-line description (reference; the "Cada semana" row was removed). */
  line: bilingual('line'),
}).strict()

export const dayTripSchema = z.object({
  id,
  title: bilingual('title'),
  length: bilingual('length'),
  why: bilingual('why'),
  /** null = no official page yet: renders the highlighted placeholder instead of a link. */
  url: https.nullable(),
}).strict()

export const agendaSchema = z.object({
  schema_version: z.literal(SCHEMA_VERSION, { error: `must be ${SCHEMA_VERSION}` }),
  events: z.array(eventSchema).min(1, 'at least one event'),
  recurring: z.array(recurringSchema).min(1, 'at least one recurring item'),
  dayTrips: z.array(dayTripSchema).min(1, 'at least one day trip'),
}).strict().superRefine((a, ctx) => {
  const seen = new Set<string>()
  for (const [list, key] of [[a.events, 'events'], [a.recurring, 'recurring'], [a.dayTrips, 'dayTrips']] as const) {
    list.forEach((x, i) => {
      if (seen.has(x.id)) ctx.addIssue({ code: 'custom', path: [key, i, 'id'], message: `duplicate id "${x.id}"` })
      seen.add(x.id)
    })
  }
})

export type AgendaEvent = z.infer<typeof eventSchema>
export type DayTrip = z.infer<typeof dayTripSchema>
export type RecurringItem = z.infer<typeof recurringSchema>
export type Agenda = z.infer<typeof agendaSchema>
