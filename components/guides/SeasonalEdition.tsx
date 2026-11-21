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
import { Button, CardTitle, Eyebrow, InfoCard } from '../design'

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
        <div className="max-w-[1200px] mx-auto flex flex-wrap items-center gap-x-4 gap-y-2 py-4 border-y border-line-strong font-sans text-body text-pine">
          <span>
            <span className="font-semibold">{c.expired}</span> {edition.nextEditionNote}
          </span>
          <Button href="#newsletter" variant="ghost" size="sm" className="underline underline-offset-4">
            {c.notify}
          </Button>
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
      <InfoCard tone="sand" size="flush" className="max-w-[1200px] mx-auto py-8">
        <div className="px-4 sm:px-8">
          <Eyebrow className="!mb-4">
            {bandLabel(edition, l)}
          </Eyebrow>

          {essentials.length > 0 && (
            <div className="mb-8">
              <CardTitle className="mb-2 !text-[20px] !leading-[1.2]">{c.essentials}</CardTitle>
              <ul className="list-disc pl-5 space-y-1 font-sans text-body text-pine">
                {essentials.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </div>
          )}

          <ol
            aria-label={c.strip}
            className="flex lg:grid lg:grid-cols-6 gap-0 overflow-x-auto lg:overflow-visible snap-x snap-mandatory lg:snap-none border-t border-l border-line-strong"
          >
            {columns.map((col) => (
              <li key={col.n} className="snap-start shrink-0 w-[184px] lg:w-auto border-r border-b border-line-strong p-3 lg:p-4">
                <a href={`#${col.id}`} className="block text-pine no-underline">
                  <span className="block text-h3 leading-none text-pine">{col.label}</span>
                  <Eyebrow as="span" className="!mb-3 mt-1">{col.weekday} {col.date}</Eyebrow>
                </a>
                {col.events.map((ev, i) => (
                  <div key={i} className="mb-3 last:mb-0 font-sans text-small text-pine">
                    <div className="font-semibold">{ev.title}</div>
                    {ev.detail && <div className="text-ink-3">{ev.detail}</div>}
                  </div>
                ))}
              </li>
            ))}
          </ol>

          {season.length > 0 && (
            <div className="mt-8">
              <Eyebrow className="!mb-2">{c.season}</Eyebrow>
              <ul className="m-0 list-none space-y-1 p-0 font-sans text-body text-pine">
                {season.map((s, i) => (
                  <li key={i}>
                    <span className="font-semibold">{s.title}</span>
                    <span className="text-ink-3"> · {s.dateRange}{s.detail ? ` · ${s.detail}` : ''}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {dated.length > 0 && (
            <p className="m-0 mt-8 font-sans text-body text-pine">
              <span className="font-semibold">{c.book} </span>
              {dated.map((h, i) => (
                <span key={h.name}>
                  {i > 0 && ' · '}
                  <a href={h.bookingUrl} target="_blank" rel="noopener noreferrer sponsored" className="text-pine underline underline-offset-2 decoration-line-strong">{h.name}</a>
                </span>
              ))}
            </p>
          )}
        </div>
      </InfoCard>
    </section>
  )
}
