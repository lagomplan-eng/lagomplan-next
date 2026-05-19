'use client'

/**
 * components/planner/PlannerHotelsSection.tsx
 *
 * The "Where to stay" surface — Phase 2 of the hotel monetization
 * rebuild. Renders `trip.accommodations[]` for every overnight trip,
 * with a deterministic fallback path so legacy trips (saved before
 * Phase 1 shipped) still see a hotel CTA.
 *
 * Design tone (per the audit + product brief): editorial, not
 * advertorial. Reads as travel guidance, not as an OTA banner.
 *
 * What this component is
 *   - Always present on overnight trips
 *   - Renders one card per accommodation entry
 *   - Each card has a single primary CTA → canonical Stay22 Allez URL
 *     via `buildAffiliateLink`. No second-tier "compare prices"
 *     decoration; one strong CTA per card keeps the UX clean.
 *
 * What it is NOT
 *   - Not a recommendation engine — it renders what the AI or fallback
 *     produced, nothing more.
 *   - Not coupled to a specific OTA — provider selection lives in
 *     `lib/affiliate/providers.ts` and Stay22's geo routing chooses
 *     the right destination locale at click time.
 */

import { useMemo } from 'react'
import { useLocale } from 'next-intl'
import type {
  Accommodation,
  TripDestinationContext,
} from '../../lib/planner/accommodations'
import { effectiveAccommodations } from '../../lib/planner/use-effective-accommodations'
import { titleCaseCity } from '../../lib/planner/format'
import { buildAffiliateLink } from '../../lib/affiliate'
import { events } from '../../lib/analytics'
import StatusPill from './StatusPill'

interface Props {
  tripId:           string | null
  accommodations:   Accommodation[] | undefined | null
  /** Server-derived trip context — destination + dates + nights. */
  ctx:              TripDestinationContext
  /** When true, the Hospedaje milestone has completed (the auto-injected
   *  "Reservar hotel" check is done). Flips every card's StatusPill from
   *  'recommended' to 'booked'. Treats all accommodations on the trip as
   *  a single booking unit — fine for the common 1-hotel trip; refine
   *  per-card in a later phase if multi-city stays need independent state. */
  hospedajeBooked?: boolean
  /** Total itinerary days. Backstop signal: when ctx.nights resolves to 0
   *  on a multi-city trip (date state lifecycle hiccups), we fall back to
   *  daysCount - 1 to keep the section visible. Without this, multi-city
   *  trips like "Buenos Aires → Uruguay" silently lose their hotel CTA. */
  daysCount?:       number
  /** Multi-city signal. When true, the section header swaps from "N nights
   *  in CityName" (single-city) to a chain-aware variant ("N nights · 3-
   *  city journey") since anchoring to ctx.destination misrepresents trips
   *  that span multiple cities. The per-card content already carries the
   *  correct city. */
  isMultiCity?:     boolean
  segmentCount?:    number
}

const TYPE_LABEL_ES: Record<Accommodation['accommodationType'], string> = {
  hotel:        'Hotel',
  boutique:     'Hotel boutique',
  hostel:       'Hostal',
  apartment:    'Apartamento',
  resort:       'Resort',
  cabin:        'Cabaña',
  glamping:     'Glamping',
  // Used as eyebrow ONLY — the heading falls back to the city-name
  // form when no neighborhood is set.
  unspecified:  'Hospedaje',
}

const TYPE_LABEL_EN: Record<Accommodation['accommodationType'], string> = {
  hotel:        'Hotel',
  boutique:     'Boutique hotel',
  hostel:       'Hostel',
  apartment:    'Apartment',
  resort:       'Resort',
  cabin:        'Cabin',
  glamping:     'Glamping',
  unspecified:  'Lodging',
}

const PRICE_TIER_LABEL_ES: Record<Accommodation['priceTier'], string> = {
  budget:  '$',
  mid:     '$$',
  upscale: '$$$',
  luxury:  '$$$$',
}

const PRICE_TIER_LABEL_EN = PRICE_TIER_LABEL_ES

export default function PlannerHotelsSection({ tripId, accommodations, ctx, hospedajeBooked, daysCount, isMultiCity, segmentCount }: Props) {
  const localeRaw = useLocale()
  const locale: 'es' | 'en' = localeRaw === 'en' ? 'en' : 'es'

  // Backstop nights value. ctx.nights can resolve to 0 on multi-city trips
  // where prefStart/prefEnd haven't fully hydrated, which used to make the
  // whole section disappear (effectiveAccommodations treats nights=0 as
  // same-day and skips fallback). Fall back to daysCount - 1 so any trip
  // with a real itinerary keeps its hotel CTA.
  const effectiveNights = useMemo(() => {
    if (ctx.nights >= 1) return ctx.nights
    if (daysCount && daysCount > 1) return daysCount - 1
    return 0
  }, [ctx.nights, daysCount])

  const resolvedCtx = useMemo(
    () => ({ ...ctx, nights: effectiveNights }),
    [ctx, effectiveNights],
  )

  // Resolve once per render — covers both new-pipeline trips (AI or
  // server fallback) and legacy trips where the field never existed.
  const effective = useMemo(
    () => effectiveAccommodations(accommodations ?? null, resolvedCtx),
    [accommodations, resolvedCtx],
  )

  // Same-day trip → render nothing. (Same-day branch also short-circuits
  // upstream in `effectiveAccommodations`; the second guard is here so
  // the parent component can drop this section in unconditionally.)
  if (effective.length === 0) return null

  const typeLabel  = locale === 'en' ? TYPE_LABEL_EN  : TYPE_LABEL_ES
  const priceLabel = locale === 'en' ? PRICE_TIER_LABEL_EN : PRICE_TIER_LABEL_ES

  // Section copy — kept inline to ship fast. Move to messages/*.json
  // alongside the rest of the planner copy when the page settles.
  const sectionEyebrow = locale === 'en' ? 'Where to stay' : 'Dónde quedarse'
  const cityDisplay = titleCaseCity(ctx.destination)
  const sectionHeadlineSingular = (n: number) => locale === 'en'
    ? `${n} night in ${cityDisplay}`
    : `${n} noche en ${cityDisplay}`
  const sectionHeadlinePlural   = (n: number) => locale === 'en'
    ? `${n} nights in ${cityDisplay}`
    : `${n} noches en ${cityDisplay}`
  // Multi-city: drop duration/city anchor from the headline entirely. The
  // hero already shows both (chip row + date pill), and each card carries
  // its own city + nights — repeating it here adds noise without info.
  // The section just needs to say what's in it ("a hotel per leg").
  const sectionHeadlineMultiCity = locale === 'en'
    ? 'A stay for each city'
    : 'Un hospedaje por tramo'
  // Use effectiveNights here too so the headline reads "4 noches en X"
  // rather than "0 noches en X" on the multi-city ctx.nights=0 path.
  const sectionHeadline = isMultiCity
    ? sectionHeadlineMultiCity
    : effectiveNights === 1
      ? sectionHeadlineSingular(effectiveNights)
      : sectionHeadlinePlural(effectiveNights)

  // Booked-aware CTA. Default = trip-progression action; booked state =
  // a softer "view your booking" affordance so the card doesn't keep
  // pushing a CTA the user already acted on.
  const ctaPrimary = locale === 'en' ? 'Book for this trip' : 'Reservar para este viaje'
  const ctaBooked  = locale === 'en' ? 'View booking'        : 'Ver reserva'
  const fallbackTagline = locale === 'en'
    ? 'Hand-picked area for this trip'
    : 'Zona recomendada para este viaje'

  return (
    <section
      data-section="where-to-stay"
      aria-labelledby="where-to-stay-heading"
      className="mb-10"
    >
      {/* Header mirrors the "Tu itinerario" header below — same eyebrow
          font, weight, color (#B8B5AF), same display headline weight
          and color (#1C1C1A). Visual rhythm matches the rest of the
          result page. */}
      <div className="flex items-baseline justify-between mb-[18px]">
        <div>
          <div className="font-mono text-[9px] font-medium tracking-[.12em] uppercase text-[#B8B5AF] mb-1">
            {sectionEyebrow}
          </div>
          <div
            id="where-to-stay-heading"
            className="font-display text-[19px] font-normal tracking-[-0.01em] text-[#1C1C1A]"
          >
            {sectionHeadline}
          </div>
        </div>
      </div>

      {/* Cards stack vertically — same column treatment as days.
          Multi-city / multi-night fan-out is Phase 3, at which point
          a md:grid-cols-2 becomes worth it. */}
      <div className="flex flex-col gap-3.5">
        {effective.map(acc => (
          <AccommodationCard
            key={acc.id}
            acc={acc}
            ctx={ctx}
            tripId={tripId}
            typeLabel={typeLabel[acc.accommodationType]}
            priceLabel={priceLabel[acc.priceTier]}
            ctaText={ctaPrimary}
            ctaBooked={ctaBooked}
            fallbackTagline={fallbackTagline}
            locale={locale}
            booked={!!hospedajeBooked}
          />
        ))}
      </div>
    </section>
  )
}

// ── Single card ────────────────────────────────────────────────────────────────

interface CardProps {
  acc:             Accommodation
  ctx:             TripDestinationContext
  tripId:          string | null
  typeLabel:       string
  priceLabel:      string
  ctaText:         string
  /** CTA label shown when `booked` is true. Lets the card swap from
   *  the trip-progression action ("Reservar para este viaje") to a
   *  softer post-booking affordance ("Ver reserva"). */
  ctaBooked:       string
  fallbackTagline: string
  locale:          'es' | 'en'
  /** True when the Hospedaje milestone is done; flips the StatusPill. */
  booked:          boolean
}

function AccommodationCard({
  acc, ctx, tripId, typeLabel, priceLabel, ctaText, ctaBooked, fallbackTagline, locale, booked,
}: CardProps) {
  // Build the Stay22 Allez URL eagerly so the <a href> ships in HTML —
  // lets LetMeAllez see it on page load, and respects the user's "open
  // in new tab via middle-click" instinct.
  const href = useMemo(
    () => buildAffiliateLink('booking', {
      city:       acc.city,
      startDate:  acc.checkInDate,
      endDate:    acc.checkOutDate,
      adults:     ctx.adults,
      locale,
      surface:    'planner',
    }),
    [acc.city, acc.checkInDate, acc.checkOutDate, ctx.adults, locale],
  )

  // Click telemetry — fires before the new tab opens so the event
  // survives navigation.
  function handleClick() {
    events.plannerHotelClicked({
      tripId,
      accommodationId: acc.id,
      source:          acc.source,
      provider:        'booking',
      city:            acc.city,
    })
  }

  // Heading: prefer the neighborhood (editorial hook). When the trip
  // is a fallback / no-neighborhood case, fall back to actionable city
  // copy — "Hoteles en Oaxaca" reads as a real surface; "Stay" or
  // "Lodging" alone reads like an unfilled placeholder.
  const cityDisplay = titleCaseCity(acc.city)
  const heading = acc.neighborhood?.trim() ||
    (locale === 'en' ? `Hotels in ${cityDisplay}` : `Hoteles en ${cityDisplay}`)

  // Rationale — fall back to a generic line for synthesized stubs that
  // ship without one. Phase 1's fallback synthesizer already provides
  // one, so this is mostly defensive.
  const rationale = acc.rationale?.trim() || fallbackTagline

  // Date range formatting + nights word agree with locale.
  const nightsWord = locale === 'en'
    ? (acc.nights === 1 ? 'night' : 'nights')
    : (acc.nights === 1 ? 'noche' : 'noches')

  return (
    <article
      data-accommodation-id={acc.id}
      data-accommodation-source={acc.source}
      data-accommodation-status={booked ? 'booked' : 'recommended'}
      className={[
        'bg-white rounded-[18px] p-6 transition-colors',
        booked
          ? 'border border-[#0F3A33]/50 hover:border-[#0F3A33]'
          : 'border border-[#E4DFD8] hover:border-[#0F3A33]/30',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          {/* Eyebrow row — type label + StatusPill. Pill flips to
              'Reservado' when the Hospedaje milestone completes. */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <p className="font-mono text-[9px] font-medium tracking-[.12em] uppercase text-[#B8B5AF]">
              {typeLabel}
              {acc.familyFriendly ? (locale === 'en' ? ' · Family' : ' · Familiar') : ''}
            </p>
            <StatusPill
              status={booked ? 'booked' : 'recommended'}
              locale={locale}
              size="xs"
            />
          </div>
          <h3 className="font-display text-[19px] font-normal tracking-[-0.01em] text-[#1C1C1A] leading-tight">
            {heading}
          </h3>
        </div>
        <span
          aria-label={locale === 'en' ? `Price tier ${priceLabel}` : `Nivel de precio ${priceLabel}`}
          className="font-mono text-[11px] font-medium tracking-[.04em] text-[#0F3A33] bg-[#EDE7E1] rounded-md px-2 py-[3px] shrink-0"
        >
          {priceLabel}
        </span>
      </div>

      <p className="font-sans text-[14px] text-[#4A5568] leading-[1.6] mb-5">
        {rationale}
      </p>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <span className="font-mono text-[10px] tracking-[.06em] text-[#9CA3AF]">
          {acc.checkInDate} → {acc.checkOutDate} · {acc.nights} {nightsWord}
        </span>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={handleClick}
          className={[
            'inline-flex items-center gap-1.5 font-sans text-[12px] font-semibold px-4 py-2 rounded-md transition-colors',
            booked
              ? 'text-[#0F3A33] bg-[rgba(15,58,51,.08)] hover:bg-[rgba(15,58,51,.14)]'
              : 'text-white bg-[#0F3A33] hover:bg-[#2D6B5A]',
          ].join(' ')}
        >
          {booked ? ctaBooked : ctaText}
          <span aria-hidden>→</span>
        </a>
      </div>
    </article>
  )
}
