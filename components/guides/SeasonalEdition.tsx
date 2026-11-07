/**
 * components/guides/SeasonalEdition.tsx
 *
 * A guide's dated edition (Thanksgiving week today; Día de Muertos, Navidad, Spring Break next), placed under
 * the hero and above the itinerary. Presentational and server-rendered: the state (active/expired) is computed
 * on the server by the adapter in the destination's timezone and guide pages revalidate hourly, so the text is
 * in the HTML and the state flips without a deploy.
 *
 * Empty > invented: a missing field renders nothing; there is no placeholder or fallback copy.
 * Active: label band, essentials, one column per itinerary day, the whole-season lines, a dated-hotels line.
 * Expired: one compact band that says the edition has passed and links to the existing newsletter block.
 */

import type { FlatSeasonalEdition } from '../../lib/data/guides/types'
import { bandLabel, dayColumns, type SeasonalLocale, type SeasonalState } from '../../lib/data/guides/seasonal'

const COPY = {
  es: {
    essentials: 'Lo esencial antes de reservar',
    season: 'TODA LA TEMPORADA',
    book: 'Reserva con las fechas sugeridas:',
    expired: 'Esta edición ya pasó.',
    notify: 'Recibe aviso en el boletín ↓',
    strip: 'Calendario por día',
  },
  en: {
    essentials: 'The essentials before you book',
    season: 'ALL SEASON LONG',
    book: 'Book with the suggested dates:',
    expired: 'This edition has passed.',
    notify: 'Get notified in the newsletter ↓',
    strip: 'Day-by-day calendar',
  },
} as const

// Brand tokens (strict): Forest Green, Warm Cream, Off-White, Near Black, Muted Green, Pale Sage.
const FOREST = '#1B4D3E'
const CREAM = '#F4F0E8'
const NEAR_BLACK = '#0F1A16'
const MUTED = '#2D6B57'
const SAGE = '#C8D9D3'

export interface SeasonalEditionProps {
  edition: FlatSeasonalEdition
  state: SeasonalState
  locale: string
  /** Day numbers of the itinerary (1-based), one strip column each. */
  dayNumbers: readonly number[]
  /** Hotels already carrying (or not) the suggested dates, for the one-line "book" list. */
  hotels: ReadonlyArray<{ name: string; bookingUrl?: string }>
}

export function SeasonalEdition({ edition, state, locale, dayNumbers, hotels }: SeasonalEditionProps) {
  const l: SeasonalLocale = locale === 'en' ? 'en' : 'es'
  const c = COPY[l]

  if (state === 'expired') {
    // Nothing to say without a next-edition note: empty > invented.
    if (!edition.nextEditionNote) return null
    return (
      <section id="temporada" data-guide="seasonal" data-state="expired" className="px-5 sm:px-8" aria-label={edition.label}>
        <div
          className="max-w-[1200px] mx-auto flex flex-wrap items-baseline gap-x-4 gap-y-2 py-4 border-y font-sans text-[14px] leading-[1.6]"
          style={{ borderColor: SAGE, color: NEAR_BLACK }}
        >
          <span>
            <span className="font-medium">{c.expired}</span> {edition.nextEditionNote}
          </span>
          <a href="#newsletter" className="font-mono text-[11px] tracking-[.08em] uppercase underline underline-offset-4" style={{ color: MUTED, textDecorationColor: SAGE }}>
            {c.notify}
          </a>
        </div>
      </section>
    )
  }

  const columns = dayColumns(edition, dayNumbers, l)
  const essentials = (edition.essentials ?? []).slice(0, 4)
  const season = edition.seasonLong ?? []
  // Only links that actually carry the suggested dates belong in the "suggested dates" line.
  const dated = hotels.filter((h) => h.bookingUrl && /[?&]checkin=/.test(h.bookingUrl))

  return (
    <section id="temporada" data-guide="seasonal" data-state="active" className="px-5 sm:px-8" aria-label={edition.label}>
      <div className="max-w-[1200px] mx-auto py-8 border-y" style={{ borderColor: SAGE, background: CREAM, borderRadius: 4 }}>
        <div className="px-4 sm:px-8">
          <p className="font-mono text-[11px] font-medium tracking-[.12em] uppercase mb-4" style={{ color: MUTED }}>
            {bandLabel(edition, l)}
          </p>

          {essentials.length > 0 && (
            <div className="mb-8">
              <h3 className="font-sans font-medium text-[16px] mb-2" style={{ color: NEAR_BLACK }}>{c.essentials}</h3>
              <ul className="list-disc pl-5 space-y-1 font-sans text-[14px] leading-[1.7]" style={{ color: NEAR_BLACK }}>
                {essentials.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </div>
          )}

          <ol
            aria-label={c.strip}
            className="flex lg:grid lg:grid-cols-6 gap-0 overflow-x-auto lg:overflow-visible snap-x snap-mandatory lg:snap-none border-t border-l"
            style={{ borderColor: SAGE }}
          >
            {columns.map((col) => (
              <li key={col.n} className="snap-start shrink-0 w-[184px] lg:w-auto border-r border-b p-3 lg:p-4" style={{ borderColor: SAGE }}>
                <a href={`#${col.id}`} className="block no-underline" style={{ color: NEAR_BLACK }}>
                  <span className="block font-mono text-[18px] font-medium leading-none" style={{ color: FOREST }}>{col.label}</span>
                  <span className="block font-mono text-[10px] tracking-[.1em] uppercase mt-1 mb-3" style={{ color: MUTED }}>{col.weekday} {col.date}</span>
                </a>
                {col.events.map((ev, i) => (
                  <div key={i} className="mb-3 last:mb-0 font-sans text-[13px] leading-[1.5]" style={{ color: NEAR_BLACK }}>
                    <div className="font-medium">{ev.title}</div>
                    {ev.detail && <div style={{ color: MUTED }}>{ev.detail}</div>}
                  </div>
                ))}
              </li>
            ))}
          </ol>

          {season.length > 0 && (
            <div className="mt-8">
              <p className="font-mono text-[11px] font-medium tracking-[.12em] uppercase mb-2" style={{ color: MUTED }}>{c.season}</p>
              <ul className="space-y-1 font-sans text-[14px] leading-[1.6]" style={{ color: NEAR_BLACK }}>
                {season.map((s, i) => (
                  <li key={i}>
                    <span className="font-medium">{s.title}</span>
                    <span style={{ color: MUTED }}> · {s.dateRange}{s.detail ? ` · ${s.detail}` : ''}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {dated.length > 0 && (
            <p className="mt-8 font-sans text-[14px] leading-[1.7]" style={{ color: NEAR_BLACK }}>
              <span className="font-medium">{c.book} </span>
              {dated.map((h, i) => (
                <span key={h.name}>
                  {i > 0 && ' · '}
                  <a href={h.bookingUrl} target="_blank" rel="noopener noreferrer sponsored" className="underline underline-offset-2" style={{ color: FOREST, textDecorationColor: SAGE }}>{h.name}</a>
                </span>
              ))}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
