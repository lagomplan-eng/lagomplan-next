/**
 * components/guides/SeasonalEdition.tsx
 *
 * A guide's dated edition (Thanksgiving week today; Día de Muertos, Navidad, Spring Break next), placed under
 * the hero and above the itinerary, on the page background and in the same content column as the hero text.
 * Structure is rules only: a 1px Pale Sage rule opens the block and one closes it; no panel, no boxes.
 *
 * Presentational and server-rendered: the state (active/expired) is computed on the server by the adapter in the
 * destination's timezone and guide pages revalidate hourly, so the text is in the HTML and the state flips
 * without a deploy. Empty > invented: a missing field renders nothing; there is no placeholder or fallback copy.
 *
 * Colour: green is for links only. Everything else is Near Black or the muted body token (70% Near Black).
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

// Brand tokens (strict): Forest Green, Near Black, Pale Sage, plus the muted body token (Near Black at 70%,
// pre-blended on the page background so it stays a solid colour: AA is asserted in tests/seasonal-edition.test.ts).
export const SEASONAL_COLORS = { forest: '#1B4D3E', nearBlack: '#0F1A16', sage: '#C8D9D3', mutedBody: '#575C58' } as const
const { forest: FOREST, nearBlack: NEAR_BLACK, sage: SAGE, mutedBody: MUTED_BODY } = SEASONAL_COLORS

/** Same column as the hero text and the main grid. */
const COLUMN = 'max-w-[1200px] mx-auto px-8 max-[768px]:px-5'

export interface SeasonalEditionProps {
  edition: FlatSeasonalEdition
  state: SeasonalState
  locale: string
  /** The itinerary's days (number + its own title), one strip column each. */
  days: ReadonlyArray<{ dayNumber: number; title: string }>
  /** Hotels already carrying (or not) the suggested dates, for the one-line "book" list. */
  hotels: ReadonlyArray<{ name: string; bookingUrl?: string }>
}

export function SeasonalEdition({ edition, state, locale, days, hotels }: SeasonalEditionProps) {
  const l: SeasonalLocale = locale === 'en' ? 'en' : 'es'
  const c = COPY[l]

  if (state === 'expired') {
    // Nothing to say without a next-edition note: empty > invented.
    if (!edition.nextEditionNote) return null
    return (
      <section id="temporada" data-guide="seasonal" data-state="expired" aria-label={edition.label} className={COLUMN}>
        <div
          className="flex flex-wrap items-baseline gap-x-4 gap-y-2 py-4 border-y font-sans text-[14px] leading-[1.6]"
          style={{ borderColor: SAGE, color: NEAR_BLACK }}
        >
          <span>
            <span className="font-medium">{c.expired}</span> <span style={{ color: MUTED_BODY }}>{edition.nextEditionNote}</span>
          </span>
          <a href="#newsletter" className="font-mono text-[11px] tracking-[.08em] uppercase underline underline-offset-4" style={{ color: FOREST, textDecorationColor: SAGE }}>
            {c.notify}
          </a>
        </div>
      </section>
    )
  }

  const columns = dayColumns(edition, days, l)
  const essentials = (edition.essentials ?? []).slice(0, 4)
  const season = edition.seasonLong ?? []
  // Only links that actually carry the suggested dates belong in the "suggested dates" line.
  const dated = hotels.filter((h) => h.bookingUrl && /[?&]checkin=/.test(h.bookingUrl))

  return (
    <section id="temporada" data-guide="seasonal" data-state="active" aria-label={edition.label} className={COLUMN}>
      <div className="pt-6 pb-10 border-y" style={{ borderColor: SAGE }}>
        <p className="font-mono text-[11px] font-medium tracking-[.12em] uppercase mb-8" style={{ color: MUTED_BODY }}>
          {bandLabel(edition, l)}
        </p>

        {(essentials.length > 0 || season.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 mb-10">
            {essentials.length > 0 && (
              <div className="lg:col-span-8 lg:pr-10">
                <h3 className="font-display text-[22px] font-normal leading-[1.2] mb-3" style={{ color: NEAR_BLACK }}>{c.essentials}</h3>
                <ul className="list-disc pl-5 space-y-1.5 max-w-[68ch] font-sans text-[14px] leading-[1.7]" style={{ color: NEAR_BLACK }}>
                  {essentials.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              </div>
            )}
            {season.length > 0 && (
              <div className={`lg:col-span-4 ${essentials.length > 0 ? 'lg:border-l lg:pl-8' : ''}`} style={{ borderColor: SAGE }}>
                <p className="font-mono text-[11px] font-medium tracking-[.12em] uppercase mb-3" style={{ color: MUTED_BODY }}>{c.season}</p>
                <ul className="space-y-3 font-sans text-[14px] leading-[1.5]">
                  {season.map((s, i) => (
                    <li key={i}>
                      <div className="font-medium" style={{ color: NEAR_BLACK }}>{s.title}</div>
                      <div style={{ color: MUTED_BODY }}>{[s.dateRange, s.detail].filter(Boolean).join(' · ')}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <ol aria-label={c.strip} className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6">
          {columns.map((col, i) => (
            <li
              key={col.n}
              className={`border-t border-[#C8D9D3] sm:border-[#0F1A16] ${i % 3 !== 0 ? 'sm:border-l-[1px] sm:border-l-[#C8D9D3]' : ''} ${i !== 0 ? 'lg:border-l-[1px] lg:border-l-[#C8D9D3]' : ''}`}
            >
              <a href={`#${col.id}`} className="group block no-underline py-3 sm:px-4 sm:first:pl-0 lg:first:pl-0" style={{ color: NEAR_BLACK }}>
                <div className="flex gap-4 sm:block">
                  <span className="font-mono text-[11px] font-medium tracking-[.08em] uppercase whitespace-nowrap w-[104px] shrink-0 sm:w-auto sm:block sm:mb-2" style={{ color: NEAR_BLACK }}>
                    {col.label} · {col.weekday} {col.dayOfMonth}
                  </span>
                  <span className="block min-w-0">
                    <span className="block font-sans text-[14px] font-medium leading-[1.35] decoration-[#1B4D3E] underline-offset-4 group-hover:underline group-focus-visible:underline">{col.title}</span>
                    {col.events[0] && (
                      <span className="block mt-1 font-sans text-[13px] leading-[1.45]" style={{ color: MUTED_BODY }}>{col.events[0].title}</span>
                    )}
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ol>

        {dated.length > 0 && (
          <p className="mt-8 font-sans text-[14px] leading-[1.7]" style={{ color: MUTED_BODY }}>
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
    </section>
  )
}
