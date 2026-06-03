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
 * "Ya reservé" confirmation flow (2026-06-03):
 *   Per-card state machine — `prompted → form_open → confirmed`.
 *   The nudge is visible by default on every unconfirmed card so it
 *   also serves users who booked outside the planner (or in a prior
 *   session). Earlier revisions delayed it 3s after the Reservar
 *   click, but background-tab `setTimeout` throttling made it
 *   unreliable — the user would click Reservar, switch to the new
 *   tab, and the prompt would never appear. Persisted to
 *   trip_data.accommodations[i].booking for authed users (via
 *   /api/trips/[trip_id]/booking-confirm), or to localStorage for
 *   anonymous trips. Survives page refresh. Per-id state means
 *   multi-city trips can confirm each segment independently.
 */

import { useEffect, useMemo, useState } from 'react'
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
  /** Drives the "Ya reservé" persistence path. When true, confirmations
   *  POST to the trip's booking-confirm API; when false they go to
   *  localStorage keyed by tripId. Plumbed from TripResult's auth state. */
  isLoggedIn?:      boolean
  /** Fired when the user saves a booking confirmation on a card. The
   *  index is the accommodation's position in `effective` — single-city
   *  trips will always pass 0; multi-city trips pass the segment index.
   *  Wired upstream to flip the matching pre-trip "Reservar hotel" check
   *  done, which rolls up into the Hospedaje milestone + progress bar. */
  onBookingConfirmed?: (accommodationIndex: number) => void
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

// ─── "Ya reservé" UI state machine ────────────────────────────────────────────
//   prompted   → small inline nudge below the CTA ("¿Ya reservaste?") — default
//   form_open  → inline expand-down form with three fields
//   confirmed  → booking saved; CTA replaced with "Ver en Booking →"
//   dismissed  → user clicked × on the nudge; session-scoped, resets on reload
type AccUIState = 'prompted' | 'form_open' | 'confirmed' | 'dismissed'

// localStorage key for anonymous-trip persistence. The trip ID is part of
// the key so trips can't leak each other's bookings across the same
// device's incognito sessions.
function lsBookingKey(tripId: string, accId: string): string {
  return `lagomplan_booking_${tripId}_${accId}`
}

export default function PlannerHotelsSection({
  tripId,
  accommodations,
  ctx,
  hospedajeBooked,
  daysCount,
  isMultiCity,
  isLoggedIn = false,
  onBookingConfirmed,
}: Props) {
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

  // ── "Ya reservé" state, keyed by acc.id ─────────────────────────────────────
  // Initialised from `acc.booking?.confirmed` so confirmed entries survive
  // page refresh. Unconfirmed cards default to 'prompted' (nudge visible)
  // so prior-reserved users see the affordance immediately. Anonymous
  // localStorage rehydration runs in a useEffect below.
  const [accUIState, setAccUIState] = useState<Record<string, AccUIState>>(() => {
    const initial: Record<string, AccUIState> = {}
    for (const a of (accommodations ?? [])) {
      if (a?.booking?.confirmed) initial[a.id] = 'confirmed'
    }
    return initial
  })

  // Locally-overlaid booking metadata. Lets the confirmed card render with
  // the just-submitted code/checkinTime/notes WITHOUT waiting for the
  // parent to re-fetch trip_data. Keyed by acc.id, merged into the
  // accommodation passed to the card.
  const [localBookings, setLocalBookings] = useState<Record<string, NonNullable<Accommodation['booking']>>>({})

  // Rehydrate anonymous bookings from localStorage on mount. Authed trips
  // already have `booking` baked into trip_data from the API.
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (isLoggedIn) return
    if (!tripId) return
    const rehydrated: Record<string, NonNullable<Accommodation['booking']>> = {}
    const updates: Record<string, AccUIState> = {}
    for (const a of (accommodations ?? [])) {
      if (!a?.id) continue
      if (a.booking?.confirmed) continue // already on the row, skip
      try {
        const raw = localStorage.getItem(lsBookingKey(tripId, a.id))
        if (!raw) continue
        const parsed = JSON.parse(raw)
        if (parsed && parsed.confirmed === true && typeof parsed.code === 'string') {
          rehydrated[a.id] = {
            confirmed:   true,
            code:        String(parsed.code),
            checkinTime: typeof parsed.checkinTime === 'string' ? parsed.checkinTime : '',
            notes:       typeof parsed.notes === 'string' ? parsed.notes : '',
            ...(typeof parsed.bookingUrl === 'string' && parsed.bookingUrl
              ? { bookingUrl: parsed.bookingUrl }
              : {}),
          }
          updates[a.id] = 'confirmed'
        }
      } catch { /* ignore single-card parse failures */ }
    }
    if (Object.keys(rehydrated).length > 0) {
      setLocalBookings(prev => ({ ...prev, ...rehydrated }))
      setAccUIState(prev => ({ ...prev, ...updates }))
    }
  // accommodations / tripId / isLoggedIn intentionally captured; effect
  // runs once per mount and on prop change. The internal guard against
  // re-rehydrating confirmed entries prevents loops.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId, isLoggedIn])

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

  function updateAccState(accId: string, next: AccUIState) {
    setAccUIState(prev => ({ ...prev, [accId]: next }))
  }

  function dismissPrompt(accId: string) {
    setAccUIState(prev => ({ ...prev, [accId]: 'dismissed' }))
  }

  function applyLocalBooking(accId: string, booking: NonNullable<Accommodation['booking']>) {
    setLocalBookings(prev => ({ ...prev, [accId]: booking }))
  }

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

      {/* Cards stack vertically — same column treatment as days. */}
      <div className="flex flex-col gap-3.5">
        {effective.map((acc, idx) => {
          const mergedAcc: Accommodation = localBookings[acc.id]
            ? { ...acc, booking: localBookings[acc.id] }
            : acc
          return (
            <AccommodationCard
              key={acc.id}
              acc={mergedAcc}
              ctx={ctx}
              tripId={tripId}
              typeLabel={typeLabel[acc.accommodationType]}
              priceLabel={priceLabel[acc.priceTier]}
              ctaText={ctaPrimary}
              ctaBooked={ctaBooked}
              fallbackTagline={fallbackTagline}
              locale={locale}
              booked={!!hospedajeBooked}
              isLoggedIn={isLoggedIn}
              uiState={accUIState[acc.id] ?? 'prompted'}
              onUIStateChange={(next) => updateAccState(acc.id, next)}
              onDismissPrompt={() => dismissPrompt(acc.id)}
              onLocalBookingSaved={(b) => applyLocalBooking(acc.id, b)}
              onConfirmed={() => onBookingConfirmed?.(idx)}
            />
          )
        })}
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
  /** CTA label shown when `booked` is true. */
  ctaBooked:       string
  fallbackTagline: string
  locale:          'es' | 'en'
  booked:          boolean
  isLoggedIn:      boolean
  uiState:         AccUIState
  onUIStateChange: (next: AccUIState) => void
  onDismissPrompt: () => void
  onLocalBookingSaved: (booking: NonNullable<Accommodation['booking']>) => void
  /** Fired after a successful save so the parent can tick the matching
   *  pre-trip "Reservar hotel" check. Only fires on first confirmation,
   *  not on edits. */
  onConfirmed: () => void
}

function AccommodationCard({
  acc, ctx, tripId, typeLabel, priceLabel, ctaText, ctaBooked, fallbackTagline, locale, booked,
  isLoggedIn, uiState, onUIStateChange, onDismissPrompt, onLocalBookingSaved, onConfirmed,
}: CardProps) {
  // Build the Stay22 Allez URL eagerly so the <a href> ships in HTML —
  // lets LetMeAllez see it on page load, and respects the user's "open
  // in new tab via middle-click" instinct.
  const affiliateHref = useMemo(
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
  // Once a user has confirmed their booking and pasted the link to it,
  // jump them straight to their own reservation page. Falls back to the
  // affiliate search URL for unconfirmed cards.
  const customBookingUrl = acc.booking?.bookingUrl?.trim() || ''
  const href = customBookingUrl || affiliateHref

  // Click telemetry — fires before the new tab opens so the event
  // survives navigation. Also re-shows the "¿Ya reservaste?" nudge if
  // the user previously dismissed it on this card — clicking Reservar
  // is a clear signal they're booking and may want to confirm shortly.
  //
  // When the user has saved their own bookingUrl, bypass Stay22's
  // LetMeAllez script (loaded in app/[locale]/layout.tsx). LetMeAllez
  // attaches a document-level click interceptor and redirects clicks
  // on travel-card links through its own affiliate URL — even when our
  // `<a href>` points at a non-booking domain. preventDefault + manual
  // window.open routes around it.
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    events.plannerHotelClicked({
      tripId,
      accommodationId: acc.id,
      source:          acc.source,
      provider:        'booking',
      city:            acc.city,
    })
    if (uiState === 'dismissed') {
      onUIStateChange('prompted')
    }
    if (customBookingUrl) {
      e.preventDefault()
      e.stopPropagation()
      window.open(customBookingUrl, '_blank', 'noopener,noreferrer')
    }
  }

  // Heading: prefer the neighborhood (editorial hook). When the trip
  // is a fallback / no-neighborhood case, fall back to actionable city
  // copy — "Hoteles en Oaxaca" reads as a real surface; "Stay" or
  // "Lodging" alone reads like an unfilled placeholder.
  const cityDisplay = titleCaseCity(acc.city)
  const heading = acc.neighborhood?.trim() ||
    (locale === 'en' ? `Hotels in ${cityDisplay}` : `Hoteles en ${cityDisplay}`)

  // Rationale — fall back to a generic line for synthesized stubs that
  // ship without one.
  const rationale = acc.rationale?.trim() || fallbackTagline

  // Date range formatting + nights word agree with locale.
  const nightsWord = locale === 'en'
    ? (acc.nights === 1 ? 'night' : 'nights')
    : (acc.nights === 1 ? 'noche' : 'noches')

  const isConfirmed = uiState === 'confirmed' || !!acc.booking?.confirmed
  const ctaLabel    = isConfirmed
    ? (locale === 'en' ? 'View on Booking' : 'Ver en Booking')
    : (booked ? ctaBooked : ctaText)

  return (
    <article
      data-accommodation-id={acc.id}
      data-accommodation-source={acc.source}
      data-accommodation-status={isConfirmed ? 'confirmed' : (booked ? 'booked' : 'recommended')}
      className={[
        'bg-white rounded-[18px] p-6 transition-colors',
        isConfirmed
          ? 'border border-[#0F3A33]/60 hover:border-[#0F3A33]'
          : booked
            ? 'border border-[#0F3A33]/50 hover:border-[#0F3A33]'
            : 'border border-[#E4DFD8] hover:border-[#0F3A33]/30',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          {/* Eyebrow row — type label + StatusPill. */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <p className="font-mono text-[9px] font-medium tracking-[.12em] uppercase text-[#B8B5AF]">
              {typeLabel}
              {acc.familyFriendly ? (locale === 'en' ? ' · Family' : ' · Familiar') : ''}
            </p>
            <StatusPill
              status={isConfirmed ? 'booked' : (booked ? 'booked' : 'recommended')}
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

      {/* Confirmed-state inline strip — replaces the date range when a
          booking is on file. Subtle Pine-tinted background, green check,
          confirmation code prominent. */}
      {isConfirmed && acc.booking && (
        <ConfirmedStrip
          booking={acc.booking}
          locale={locale}
          onEdit={() => onUIStateChange('form_open')}
        />
      )}

      <div className="flex items-center justify-between gap-3 flex-wrap">
        {!isConfirmed && (
          <span className="font-mono text-[10px] tracking-[.06em] text-[#9CA3AF]">
            {acc.checkInDate} → {acc.checkOutDate} · {acc.nights} {nightsWord}
          </span>
        )}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={handleClick}
          className={[
            'inline-flex items-center gap-1.5 font-sans text-[12px] font-semibold px-4 py-2 rounded-md transition-colors',
            isConfirmed
              // Secondary style when confirmed — softer, less primary
              // visual weight, since the user already booked.
              ? 'text-[#0F3A33] bg-transparent border border-[#0F3A33]/25 hover:bg-[rgba(15,58,51,.06)] hover:border-[#0F3A33]/45'
              : booked
                ? 'text-[#0F3A33] bg-[rgba(15,58,51,.08)] hover:bg-[rgba(15,58,51,.14)]'
                : 'text-white bg-[#0F3A33] hover:bg-[#2D6B5A]',
            isConfirmed ? 'ml-auto' : '',
          ].join(' ')}
        >
          {ctaLabel}
          <span aria-hidden>→</span>
        </a>
      </div>

      {/* "Ya reservé" prompt — small nudge bar inside the card flow,
          visible by default on unconfirmed cards. Persists until the
          user opens the form, dismisses it, or completes confirmation. */}
      <PromptNudge
        visible={uiState === 'prompted'}
        locale={locale}
        onOpenForm={() => onUIStateChange('form_open')}
        onDismiss={onDismissPrompt}
      />

      {/* "Ya reservé" inline form — expand-down using the codebase's
          max-height / opacity transition idiom. */}
      <BookingConfirmForm
        visible={uiState === 'form_open'}
        locale={locale}
        accId={acc.id}
        tripId={tripId}
        isLoggedIn={isLoggedIn}
        initial={acc.booking}
        onCancel={() => onUIStateChange(acc.booking?.confirmed ? 'confirmed' : 'prompted')}
        onSaved={(booking) => {
          const wasEditing = !!acc.booking?.confirmed
          onLocalBookingSaved(booking)
          onUIStateChange('confirmed')
          // onConfirmed is idempotent (parent skips the setter when the
          // check is already ticked) so it's safe to fire on edits too —
          // this auto-heals trips whose original confirmation predates
          // the milestone wiring.
          onConfirmed()
          // Analytics-only gate — repeat edits shouldn't inflate the
          // booking-confirmed funnel metric.
          if (!wasEditing) {
            events.hotelBookingConfirmed({
              tripId,
              accommodationId: acc.id,
              city:            acc.city,
              provider:        'booking',
            })
          }
        }}
        onPersistFailed={() => onUIStateChange('form_open')}
      />
    </article>
  )
}

// ── Confirmed strip ───────────────────────────────────────────────────────────

function ConfirmedStrip({
  booking,
  locale,
  onEdit,
}: {
  booking: NonNullable<Accommodation['booking']>
  locale:  'es' | 'en'
  onEdit:  () => void
}) {
  return (
    <div
      className="rounded-[10px] bg-[rgba(15,58,51,.06)] border border-[#0F3A33]/15 px-4 py-3 mb-5"
      data-state="confirmed"
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-[#0F3A33] text-white text-[11px] leading-none"
          >
            ✓
          </span>
          <span className="font-mono text-[10px] font-medium tracking-[.1em] uppercase text-[#0F3A33]">
            {locale === 'en' ? 'Booked' : 'Reservado'}
          </span>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="font-sans text-[11px] text-[#0F3A33]/70 hover:text-[#0F3A33] underline-offset-2 hover:underline print:hidden"
        >
          {locale === 'en' ? 'Edit' : 'Editar'}
        </button>
      </div>
      <div className="font-sans text-[13px] text-[#1C1C1A] leading-[1.5]">
        <span className="font-mono font-medium">{booking.code}</span>
        {' · '}
        {locale === 'en' ? 'Check-in' : 'Check-in'}{' '}
        <span className="font-mono">{booking.checkinTime || '—'}</span>
      </div>
      {booking.notes && (
        <p className="font-sans text-[12px] text-[#4A5568] leading-[1.45] mt-1 truncate">
          {booking.notes}
        </p>
      )}
    </div>
  )
}

// ── Prompt nudge ──────────────────────────────────────────────────────────────

function PromptNudge({
  visible,
  locale,
  onOpenForm,
  onDismiss,
}: {
  visible:    boolean
  locale:     'es' | 'en'
  onOpenForm: () => void
  onDismiss:  () => void
}) {
  return (
    <div
      className="print:hidden"
      style={{
        maxHeight:  visible ? 80 : 0,
        opacity:    visible ? 1 : 0,
        overflow:   'hidden',
        transition: 'max-height 0.35s ease, opacity 0.25s ease',
      }}
    >
      <div className="mt-4 flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-[8px] bg-[#FAF5EC] border border-[#E4DFD8]">
        <p className="font-sans text-[12px] text-[#4A5568] leading-[1.4]">
          {locale === 'en'
            ? <>Already booked? <span className="text-[#9CA3AF]">Add your confirmation</span></>
            : <>¿Ya reservaste? <span className="text-[#9CA3AF]">Agrega tu confirmación</span></>}
        </p>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onOpenForm}
            className="font-sans text-[12px] font-semibold text-[#0F3A33] hover:underline px-2 py-1"
          >
            {locale === 'en' ? 'Add →' : 'Agregar →'}
          </button>
          <button
            type="button"
            onClick={onDismiss}
            aria-label={locale === 'en' ? 'Dismiss' : 'Cerrar'}
            className="font-mono text-[14px] text-[#9CA3AF] hover:text-[#1C1C1A] px-2 py-1 leading-none"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Inline booking-confirm form ───────────────────────────────────────────────

function BookingConfirmForm({
  visible,
  locale,
  accId,
  tripId,
  isLoggedIn,
  initial,
  onCancel,
  onSaved,
  onPersistFailed,
}: {
  visible:         boolean
  locale:          'es' | 'en'
  accId:           string
  tripId:          string | null
  isLoggedIn:      boolean
  initial?:        Accommodation['booking']
  onCancel:        () => void
  onSaved:         (booking: NonNullable<Accommodation['booking']>) => void
  onPersistFailed: () => void
}) {
  const [code, setCode]               = useState(initial?.code        ?? '')
  const [checkinTime, setCheckinTime] = useState(initial?.checkinTime ?? '')
  const [notes, setNotes]             = useState(initial?.notes       ?? '')
  const [bookingUrl, setBookingUrl]   = useState(initial?.bookingUrl  ?? '')
  const [submitting, setSubmitting]   = useState(false)
  const [error, setError]             = useState<string | null>(null)

  // Re-sync the form when the user opens it for edit. Without this,
  // useState's initial values are captured once on mount, so the form
  // would show empty fields the first time a user clicks Edit on a
  // booking that loaded from the DB.
  useEffect(() => {
    if (!visible) return
    setCode(initial?.code              ?? '')
    setCheckinTime(initial?.checkinTime ?? '')
    setNotes(initial?.notes            ?? '')
    setBookingUrl(initial?.bookingUrl  ?? '')
    setError(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  // Lightweight URL validation. Server re-validates with the URL
  // constructor; this check keeps obvious typos from triggering a
  // round-trip and surfaces a clear inline error.
  function isValidUrl(raw: string): boolean {
    const trimmed = raw.trim()
    if (!trimmed) return true // empty is allowed (field is optional)
    try {
      const u = new URL(trimmed)
      return u.protocol === 'https:' || u.protocol === 'http:'
    } catch {
      return false
    }
  }

  async function handleSubmit() {
    setError(null)
    const trimmedCode = code.trim()
    if (!trimmedCode) {
      setError(locale === 'en' ? 'Confirmation number is required.' : 'El nº de confirmación es obligatorio.')
      return
    }
    const trimmedUrl = bookingUrl.trim()
    if (trimmedUrl && !isValidUrl(trimmedUrl)) {
      setError(locale === 'en'
        ? 'That link doesn’t look valid. Paste a https:// URL.'
        : 'Ese enlace no parece válido. Pega una URL https://.')
      return
    }
    const booking: NonNullable<Accommodation['booking']> = {
      confirmed:   true,
      code:        trimmedCode.slice(0, 50),
      checkinTime: checkinTime.trim().slice(0, 10),
      notes:       notes.trim().slice(0, 280),
      ...(trimmedUrl ? { bookingUrl: trimmedUrl.slice(0, 500) } : {}),
    }

    setSubmitting(true)
    // Optimistic UI — let the parent flip to confirmed immediately. If
    // the persistence call fails we revert (see catch below).
    onSaved(booking)

    try {
      if (isLoggedIn && tripId) {
        // Authed trip → persist via the API route. The route's auth
        // check verifies the owner matches the session.
        const res = await fetch(`/api/trips/${encodeURIComponent(tripId)}/booking-confirm`, {
          method:  'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ accommodationId: accId, booking }),
        })
        if (!res.ok) throw new Error(`status ${res.status}`)
      } else if (tripId) {
        // Anonymous trip → localStorage. Survives reload but is
        // device-local; signing up later doesn't migrate it (that's
        // a separate Phase 3 ask).
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(lsBookingKey(tripId, accId), JSON.stringify(booking))
        }
      }
      // No tripId → just keep the in-memory state. Rare (would mean
      // pre-save anon trip) but not worth failing the UX.
    } catch (err) {
      console.warn('[booking-confirm] persistence failed:', err)
      setError(locale === 'en'
        ? "We couldn't save it. Try again."
        : 'No pudimos guardar. Intenta de nuevo.')
      onPersistFailed()
    } finally {
      setSubmitting(false)
    }
  }

  // Labels
  const L = locale === 'en'
    ? {
        codeLabel:     'Confirmation #',
        codePlaceholder: 'BK-483920',
        timeLabel:     'Check-in time',
        timePlaceholder: '15:00',
        notesLabel:    'Note (optional)',
        notesPlaceholder: 'Ask for a higher floor',
        urlLabel:      'Booking link (optional)',
        urlPlaceholder: 'https://booking.com/...',
        submit:        'Save confirmation',
        cancel:        'Cancel',
      }
    : {
        codeLabel:     'Nº de confirmación',
        codePlaceholder: 'BK-483920',
        timeLabel:     'Hora de check-in',
        timePlaceholder: '15:00',
        notesLabel:    'Nota (opcional)',
        notesPlaceholder: 'Pedir habitación alta',
        urlLabel:      'Enlace de la reserva (opcional)',
        urlPlaceholder: 'https://booking.com/...',
        submit:        'Guardar confirmación',
        cancel:        'Cancelar',
      }

  return (
    <div
      className="print:hidden"
      style={{
        maxHeight:  visible ? 600 : 0,
        opacity:    visible ? 1 : 0,
        overflow:   'hidden',
        transition: 'max-height 0.4s ease, opacity 0.3s ease',
      }}
    >
      <div className="mt-4 rounded-[10px] bg-[#FAF8F5] border border-[#E4DFD8] p-4">
        <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-3 mb-3">
          <label className="block">
            <span className="font-mono text-[9px] font-medium tracking-[.12em] uppercase text-[#B8B5AF] block mb-1">
              {L.codeLabel}
            </span>
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder={L.codePlaceholder}
              maxLength={50}
              className="w-full font-mono text-[13px] text-[#1C1C1A] bg-white border border-[#E4DFD8] rounded-md px-3 py-2 outline-none focus:border-[#0F3A33]"
              required
            />
          </label>
          <label className="block">
            <span className="font-mono text-[9px] font-medium tracking-[.12em] uppercase text-[#B8B5AF] block mb-1">
              {L.timeLabel}
            </span>
            <input
              type="text"
              value={checkinTime}
              onChange={e => setCheckinTime(e.target.value)}
              placeholder={L.timePlaceholder}
              maxLength={10}
              className="w-full font-mono text-[13px] text-[#1C1C1A] bg-white border border-[#E4DFD8] rounded-md px-3 py-2 outline-none focus:border-[#0F3A33]"
            />
          </label>
        </div>
        <label className="block mb-3">
          <span className="font-mono text-[9px] font-medium tracking-[.12em] uppercase text-[#B8B5AF] block mb-1">
            {L.notesLabel}
          </span>
          <input
            type="text"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder={L.notesPlaceholder}
            maxLength={280}
            className="w-full font-sans text-[13px] text-[#1C1C1A] bg-white border border-[#E4DFD8] rounded-md px-3 py-2 outline-none focus:border-[#0F3A33]"
          />
        </label>
        <label className="block mb-3">
          <span className="font-mono text-[9px] font-medium tracking-[.12em] uppercase text-[#B8B5AF] block mb-1">
            {L.urlLabel}
          </span>
          <input
            type="url"
            inputMode="url"
            value={bookingUrl}
            onChange={e => setBookingUrl(e.target.value)}
            placeholder={L.urlPlaceholder}
            maxLength={500}
            className="w-full font-mono text-[12px] text-[#1C1C1A] bg-white border border-[#E4DFD8] rounded-md px-3 py-2 outline-none focus:border-[#0F3A33]"
          />
        </label>

        {error && (
          <p className="font-sans text-[12px] text-[#B94030] mb-3 leading-snug">
            {error}
          </p>
        )}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="font-sans text-[12px] font-semibold text-white bg-[#0F3A33] hover:bg-[#2D6B5A] disabled:opacity-60 disabled:cursor-not-allowed rounded-md px-4 py-2 transition-colors"
          >
            {L.submit}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="font-sans text-[12px] text-[#7A7A76] hover:text-[#1C1C1A] underline-offset-2 hover:underline"
          >
            {L.cancel}
          </button>
        </div>
      </div>
    </div>
  )
}
