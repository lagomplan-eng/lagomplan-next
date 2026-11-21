'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from '../../lib/navigation'
import { useTranslations } from 'next-intl'
import PlacesInput, { type PlaceResult } from './PlacesInput'
import DateRangePicker, { type DateRange } from './DateRangePicker'
import { buildSegment, serializeSegments, type TripSegment } from '../../lib/planner/segments'
import { FREE_TRIPS_LIMIT } from '../../lib/plan/limits'
import { events } from '../../lib/analytics'
import { Button, Chip, Eyebrow, InfoCard, Input, Textarea } from '../design'

// Same 3 reviewer photos used in the bottom Reviews section of the
// homepage. Kept inline (rather than imported from the page) so this
// form is portable to any host page without a cross-route coupling.
const HERO_AVATARS = [
  { name: 'Jorge', img: '/images/reviews/jorge.png' },
  { name: 'Julia', img: '/images/reviews/julia.png' },
  { name: 'Ana',   img: '/images/reviews/ana.png'   },
] as const

type Traveler = 'solo' | 'pareja' | 'familia' | 'amigos'

const INTERESTS = [
  'Playa',
  'Gastronomia',
  'Cultura',
  'Naturaleza',
  'Aventura',
  'Arte',
  'Vida nocturna',
  'Compras',
]

const BABY_AGES = ['0-11 m', '1 año', '2 años']
const KID_AGES = Array.from({ length: 12 }, (_, i) => `${i + 3} años`)

interface Child {
  id: number
  type: 'baby' | 'kid'
  age: string
}

type HeroFormProps = {
  locale?: 'es' | 'en'
  initialValues?: {
    origin?: string
    destination?: string
    start?: string
    end?: string
    nights?: string
    traveler?: string
    interests?: string
    pace?: string
    budget?: string
    walkingTolerance?: 'low' | 'medium' | 'high'
  }
}

// ── Inline helpers ─────────────────────────────────────────────────
// Field label, required marker and error line: the shared form text styles.
const LABEL = 'mb-2 block font-sans text-small font-semibold text-pine'

function Req() {
  return <span className="ml-0.5 font-normal text-error" aria-hidden="true">*</span>
}

function FieldError({ msg }: { msg: string }) {
  return (
    <p role="alert" className="m-0 mt-2 font-sans text-tiny font-semibold text-error">
      {msg}
    </p>
  )
}

// −/+ counter row (adults, friends in the group).
function Stepper({ label, value, onMinus, onPlus }: { label: string; value: number; onMinus: () => void; onPlus: () => void }) {
  return (
    <div className="flex items-center gap-3 rounded-info border border-line-soft bg-white px-4 py-2.5">
      <span className="flex-1 font-sans text-small font-semibold text-pine">{label}</span>
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" className="w-10 !px-0" onClick={onMinus}>−</Button>
        <span className="w-8 text-center font-sans text-body font-bold text-pine">{value}</span>
        <Button variant="secondary" size="sm" className="w-10 !px-0" onClick={onPlus}>+</Button>
      </div>
    </div>
  )
}

// ── Component ──────────────────────────────────────────────────────
export default function HeroForm({
  locale = 'es',
  initialValues,
}: HeroFormProps) {
  const router = useRouter()
  const t  = useTranslations('form')
  const tI = useTranslations('interests')
  const interestLabel: Record<string, string> = {
    Playa:           tI('playa'),
    Gastronomia:     tI('gastronomy'),
    Cultura:         tI('culture'),
    Naturaleza:      tI('nature'),
    Aventura:        tI('adventure'),
    Arte:            tI('art'),
    'Vida nocturna': tI('nightlife'),
    Compras:         tI('shopping'),
  }

const parsedStart = initialValues?.start ? new Date(initialValues.start) : null
const parsedEnd = initialValues?.end ? new Date(initialValues.end) : null

const initialInterestList = initialValues?.interests
  ? initialValues.interests.split(',').map((i) => i.trim()).filter(Boolean)
  : []

const knownInterests = INTERESTS.filter((item) => initialInterestList.includes(item))
const extraInterests = initialInterestList.filter((item) => !INTERESTS.includes(item))

const [originText,  setOriginText]  = useState(initialValues?.origin ?? '')
const [originPlace, setOriginPlace] = useState<PlaceResult | null>(null)

const [destText,    setDestText]    = useState(initialValues?.destination ?? '')
const [destPlace,   setDestPlace]   = useState<PlaceResult | null>(null)

const [dates, setDates] = useState<DateRange>({
  start: parsedStart,
  end: parsedEnd,
  nights: Number(initialValues?.nights ?? 0),
})

const [traveler, setTraveler] = useState<Traveler | null>(
  (initialValues?.traveler as Traveler) ?? null
)

const [adults, setAdults] = useState(2)

const [children, setChildren] = useState<Child[]>([
  { id: 0, type: 'baby', age: '0-11 m' },
  { id: 1, type: 'kid',  age: '3 anos' },
])

const [nextKidId, setNextKidId] = useState(2)
const [groupCount, setGroupCount] = useState(2)

const [interests, setInterests] = useState<string[]>(knownInterests)
const [extra, setExtra] = useState(extraInterests.join(', '))

const [pace, setPace] = useState(initialValues?.pace ?? '')

// Walking tolerance — captured at trip creation, drives the energy_warning
// threshold in lib/intelligence.ts on the result page. Defaults to 'medium'
// so users who skip the question still get a reasonable analysis.
const [walkingTolerance, setWalkingTolerance] =
  useState<'low' | 'medium' | 'high'>(initialValues?.walkingTolerance ?? 'medium')

const isES = locale === 'es'
const [budget, setBudget] = useState(initialValues?.budget ?? '')
// Currency toggle for the budget field. The amount goes into the AI prompt as
// a free-text string (e.g. "20,000 MXN") so the model sees the unit clearly.
const [budgetCurrency, setBudgetCurrency] = useState<'MXN' | 'USD'>('MXN')

const [submitted, setSubmitted] = useState(false)
const [generating, setGenerating] = useState(false)

// Fires events.plannerStarted once per HeroForm mount, on the first
// user-driven change to any input. Captures users who STARTED the form
// but didn't submit — the activation-stage drop-off that the form-submit
// `search` event can't see.
const plannerStartedFiredRef = useRef(false)
const fireStartedOnce = () => {
  if (plannerStartedFiredRef.current) return
  plannerStartedFiredRef.current = true
  events.plannerStarted()
}

// Multi-city — additional segments beyond the main destination. Each
// segment carries the same From + To + DateRangePicker shape as
// Segment 1 (the trip's main "Where" + "When" rows). On add, the new
// segment's From defaults to the previous segment's To and its start
// defaults to the previous segment's end — contiguous chains are zero-
// friction. User can override anything.
type ExtraSegment = {
  destination: string                  // "To"
  destPlace:   PlaceResult | null
  originDest:  string                  // "From" (this segment's origin)
  originPlace: PlaceResult | null
  dates:       DateRange
}
const MAX_EXTRA_SEGMENTS = 4
// Hard cap on trip length. Tied to the worker's segment chain budget
// (SEGMENT_DAYS=5 × ~7 chunks fits inside the cron-rescue window on
// Supabase Free). Mirror constants in app/api/trips/jobs/route.ts and
// supabase/functions/generate-trip-worker/index.ts.
const MAX_TRIP_DAYS = 35
const [additionalSegments, setAdditionalSegments] = useState<ExtraSegment[]>([])

function addSegment() {
  if (additionalSegments.length >= MAX_EXTRA_SEGMENTS) return
  // Seed From = previous segment's To, start = previous segment's end.
  const prevSeg     = additionalSegments[additionalSegments.length - 1]
  const prevDestStr = prevSeg
    ? (prevSeg.destPlace?.displayName ?? prevSeg.destination)
    : destValue   // first extra → previous "To" is the main destination
  const prevEnd: Date | null = prevSeg
    ? (prevSeg.dates.end ?? dates.end)
    : dates.end
  setAdditionalSegments(prev => [...prev, {
    destination: '',
    destPlace:   null,
    originDest:  prevDestStr,
    originPlace: null,
    dates:       { start: prevEnd, end: null, nights: 0 },
  }])
}
function removeSegment(idx: number) {
  setAdditionalSegments(prev => prev.filter((_, i) => i !== idx))
}
function updateSegment(idx: number, patch: Partial<ExtraSegment>) {
  setAdditionalSegments(prev => prev.map((s, i) => i === idx ? { ...s, ...patch } : s))
}

  const originValue = originPlace?.displayName ?? originText
const destValue = destPlace?.displayName ?? destText
const datesValid = !!(dates.start && dates.end)

// Total trip length across all segments. Single-city = dates.nights;
// multi-city = sum of segment nights. Drives the MAX_TRIP_DAYS guard
// rendered under the dates picker.
const totalNights = dates.nights + additionalSegments.reduce(
  (sum, s) => sum + (s.dates.nights || 0),
  0,
)
const exceedsMax = totalNights > MAX_TRIP_DAYS

// Snap the main dates picker to exactly MAX_TRIP_DAYS. Only meaningful
// for single-city trips (multi-city users shorten individual segments
// instead). Preserves the chosen start date.
function trimToMax() {
  if (!dates.start) return
  const newEnd = new Date(dates.start)
  newEnd.setDate(newEnd.getDate() + MAX_TRIP_DAYS)
  setDates({ start: dates.start, end: newEnd, nights: MAX_TRIP_DAYS })
}

function submit(e: React.FormEvent) {
  e.preventDefault()
  setSubmitted(true)
  // Hard-block over-cap submissions so the date range can never disagree
  // with the duration the backend will actually generate.
  if (exceedsMax) return

  if (!originValue || !destValue || !datesValid || !traveler || !pace) return

    setGenerating(true)

    // Append the currency code to the budget so the AI prompt sees the unit
    // ("20,000 MXN" vs "20,000 USD"). Empty input stays empty — never emit a
    // bare currency code with no number, which would confuse the model.
    const budgetWithCurrency = budget.trim() ? `${budget.trim()} ${budgetCurrency}` : ''

    // Build the multi-city segments array (or [] for single-city). Each
    // segment now carries its own full date range (same shape as the main
    // dates picker), so we read start + end directly per row. Invalid
    // extras (missing destination or either date) are dropped silently.
    const tripStartISO = dates.start?.toISOString().split('T')[0] ?? ''
    const tripEndISO   = dates.end?.toISOString().split('T')[0]   ?? ''
    const isoFromDate  = (d: Date | null): string =>
      d ? d.toISOString().split('T')[0] : ''
    const validExtras  = additionalSegments.filter(s => {
      const dest = s.destPlace?.displayName ?? s.destination
      return !!dest && !!s.dates.start && !!s.dates.end
    })
    const fullSegments: TripSegment[] = validExtras.length === 0
      ? []
      : [
          // Segment 1: main destination + dates + trip origin
          buildSegment(destValue, tripStartISO, tripEndISO, originValue),
          // Segments 2..N: each row's own from / to / date range. Origin
          // is only persisted if the user changed it from the default
          // (previous segment's destination) — otherwise it's implicit
          // from the chain order.
          ...validExtras.map((extra, i) => {
            const segDest    = extra.destPlace?.displayName ?? extra.destination
            const segOriginRaw = extra.originPlace?.displayName ?? extra.originDest
            // Default From for this row = previous segment's destination.
            // If it matches, don't persist (keeps URLs short + signal clean).
            const prevDest = i === 0
              ? destValue
              : (validExtras[i - 1].destPlace?.displayName ?? validExtras[i - 1].destination)
            const segOrigin = segOriginRaw && segOriginRaw.trim() !== prevDest.trim()
              ? segOriginRaw
              : undefined
            return buildSegment(
              segDest,
              isoFromDate(extra.dates.start),
              isoFromDate(extra.dates.end),
              segOrigin,
            )
          }),
        ]
    const segmentsParam = serializeSegments(fullSegments)

    // Multi-city: the trip-level start/end/nights cover the FULL chain (first
    // segment's start → last segment's end, sum of nights). Without this the
    // hero date pill shows only Segment 1 and the Edge Fn receives a duration
    // that contradicts the segments array — the AI then generates a too-short
    // itinerary and the sync/async routing picks the wrong path.
    const isMultiCity   = fullSegments.length > 0
    const effectiveStart  = isMultiCity ? fullSegments[0].startDate                              : tripStartISO
    const effectiveEnd    = isMultiCity ? fullSegments[fullSegments.length - 1].endDate          : tripEndISO
    const effectiveNights = isMultiCity ? fullSegments.reduce((sum, s) => sum + s.nights, 0)     : dates.nights

    const params = new URLSearchParams({
      origin: originValue,
      destination: destValue,
      start:       effectiveStart,
      end:         effectiveEnd,
      nights:      String(effectiveNights),
      traveler:    traveler,
      interests:   [...interests, extra].filter(Boolean).join(', '),
      pace,
      budget:      budgetWithCurrency,
      // Explicit currency param so the result page can initialize the
      // budgetCurrency state without sniffing the budget string. DB load
      // will override this once the trip is saved.
      currency:    budgetCurrency,
      // Walking tolerance — captured here, threaded to /planner so
      // TripResult can pass it to /api/trips on save. Drives the
      // Intelligence Foundation's energy_warning threshold.
      walkingTolerance,
      // Multi-city chain (empty string for single-city trips → no-op).
      ...(segmentsParam ? { segments: segmentsParam } : {}),
    })

    // Traveler-detail serialization — only when relevant to the selected
    // type, so URLs for solo/pareja stay clean. The result page parses
    // these to hydrate the pref drawer (prevents losing children data on
    // the form → result transition).
    if (traveler === 'familia') {
      params.set('adults', String(adults))
      if (children.length > 0) {
        // `type:age` per child, joined by `|`. URLSearchParams handles the
        // percent-encoding of accented age labels.
        params.set('children', children.map(c => `${c.type}:${c.age}`).join('|'))
      }
    }
    if (traveler === 'amigos') {
      params.set('groupCount', String(groupCount))
    }

    // ── Analytics ──────────────────────────────────────────────
    // Fires before the router navigation so the events land in the
    // current session before the result page mounts. Both pixels
    // get the same intent signal in their own canonical shape:
    //   events.search    → Meta 'Search', GA 'search'   (query term)
    //   events.lead      → Meta 'Lead',   GA 'generate_lead' (top-of-funnel
    //                       conversion — needed for Meta optimization)
    // We tag content_name = "planner-form" so paid campaigns can target
    // this specific surface separately from newsletter/PDF leads.
    events.search({ search_string: destValue, destination: destValue })
    events.lead({ content_name: 'planner-form' })

    router.push(`/planner?${params}` as any)
  }

  // Divider used between major form sections
  const sectionDivider = 'border-t border-line-soft pt-4 mt-2 mb-4'

  return (
    <div className="w-full max-w-[920px] ml-auto max-[1024px]:max-w-full max-[1024px]:ml-0">
      <form onSubmit={submit} noValidate className="flex flex-col">
        <InfoCard className="shadow-pop">

          <Eyebrow className="!mb-4 border-b border-line-soft pb-3">{t('title')}</Eyebrow>

          {/* ── 1. Where ─────────────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-2.5 mb-4 max-[560px]:grid-cols-1">
            <div>
              <label htmlFor="origin" className={LABEL}>
                {t('origin')}<Req />
              </label>
              <PlacesInput
                id="origin"
                locale={locale}
                placeholder={t('originPlaceholder')}
                value={originText}
                onChange={(v) => { setOriginText(v); if (!v) setOriginPlace(null) }}
                onSelect={setOriginPlace}
              />
              {submitted && !originValue && (
                <FieldError msg={t('errorFrom')} />
              )}
            </div>

            <div>
              <label htmlFor="destination" className={LABEL}>
                {t('destination')}<Req />
              </label>
              <PlacesInput
                id="destination"
                locale={locale}
                placeholder={t('destinationPlaceholder')}
                value={destText}
                onChange={(v) => { fireStartedOnce(); setDestText(v); if (!v) setDestPlace(null) }}
                onSelect={(p) => { fireStartedOnce(); setDestPlace(p) }}
              />
              {submitted && !destValue && (
                <FieldError msg={t('errorDestination')} />
              )}
            </div>
          </div>

          {/* ── 2. When ──────────────────────────────────────────── */}
          <div className={sectionDivider}>
            <label className={LABEL}>
              {t('dates')}<Req />
            </label>
            <DateRangePicker value={dates} onChange={setDates} />
            {submitted && !datesValid && (
              <FieldError msg={t('errorDates')} />
            )}
          </div>

          {/* ── 2b. Multi-city (optional) ───────────────────────────
              Each extra segment renders as a sub-section with the SAME
              input chrome as the main "To" + "Dates" pair above: a
              PlacesInput + a DateRangePicker. The "+ Add city" button
              sits below. Empty array = single-city; nothing renders. */}
          {additionalSegments.map((seg, idx) => (
            <div key={idx} className={sectionDivider}>
              <div className="flex items-center justify-between mb-3">
                <span className={`${LABEL} !mb-0`}>
                  {locale === 'es' ? `Tramo ${idx + 2}` : `Segment ${idx + 2}`}
                </span>
                <Button variant="ghost" size="sm" onClick={() => removeSegment(idx)}>
                  {locale === 'es' ? '× Quitar' : '× Remove'}
                </Button>
              </div>
              {/* From + To — same grid as Segment 1's "Where" row. From
                  defaults to the previous segment's To but is editable. */}
              <div className="grid grid-cols-2 gap-2.5 mb-3 max-[560px]:grid-cols-1">
                <div>
                  <label className={LABEL}>{t('origin')}</label>
                  <PlacesInput
                    id={`origin-segment-${idx + 2}`}
                    locale={locale}
                    placeholder={t('originPlaceholder')}
                    value={seg.originDest}
                    onChange={(v) => updateSegment(idx, { originDest: v, originPlace: null })}
                    onSelect={(p) => updateSegment(idx, { originPlace: p })}
                  />
                </div>
                <div>
                  <label className={LABEL}>{t('destination')}</label>
                  <PlacesInput
                    id={`destination-segment-${idx + 2}`}
                    locale={locale}
                    placeholder={t('destinationPlaceholder')}
                    value={seg.destination}
                    onChange={(v) => updateSegment(idx, { destination: v, destPlace: null })}
                    onSelect={(p) => updateSegment(idx, { destPlace: p })}
                  />
                </div>
              </div>
              <DateRangePicker
                value={seg.dates}
                onChange={(d) => updateSegment(idx, { dates: d })}
              />
            </div>
          ))}
          {/* Trip-total summary + over-cap warning. Lives below ALL segments so
              the count is unambiguous about what it sums. Calm sand row when
              under cap; warning border when over. The trim affordance only renders for
              single-city — multi-city users shorten an individual segment
              instead (auto-trimming would silently drop one). */}
          {datesValid && (additionalSegments.length > 0 || exceedsMax) && (
            <div className={sectionDivider}>
              <InfoCard size="sm" tone="sand" role="status" className={exceedsMax ? '!border-warning' : ''}>
                <p className="m-0">
                  {locale === 'es'
                    ? (additionalSegments.length > 0
                        ? `Total del viaje: ${totalNights} ${totalNights === 1 ? 'noche' : 'noches'} sumando los ${additionalSegments.length + 1} tramos.`
                        : `Tu rango cubre ${totalNights} ${totalNights === 1 ? 'noche' : 'noches'}.`)
                    : (additionalSegments.length > 0
                        ? `Trip total: ${totalNights} ${totalNights === 1 ? 'night' : 'nights'} across ${additionalSegments.length + 1} segments.`
                        : `Your range covers ${totalNights} ${totalNights === 1 ? 'night' : 'nights'}.`)}
                </p>
                {exceedsMax && (
                  <p className="m-0 mt-1">
                    {locale === 'es'
                      ? `Por ahora generamos itinerarios de hasta ${MAX_TRIP_DAYS} días${additionalSegments.length > 0 ? ' en total' : ''}. Ajusta las fechas para continuar.`
                      : `We currently plan trips of up to ${MAX_TRIP_DAYS} days${additionalSegments.length > 0 ? ' total' : ''}. Adjust your dates to continue.`}
                  </p>
                )}
                {exceedsMax && additionalSegments.length === 0 && dates.start && (
                  <Button variant="secondary" size="sm" className="mt-3" onClick={trimToMax}>
                    {locale === 'es'
                      ? `Ajustar a ${MAX_TRIP_DAYS} días`
                      : `Trim to ${MAX_TRIP_DAYS} days`}
                  </Button>
                )}
              </InfoCard>
            </div>
          )}
          {additionalSegments.length < MAX_EXTRA_SEGMENTS && (
            <div className={sectionDivider}>
              <Button
                variant="ghost"
                size="sm"
                onClick={addSegment}
                disabled={!destValue || !datesValid}
                title={!destValue || !datesValid
                  ? (locale === 'es' ? 'Completa destino y fechas primero' : 'Complete destination + dates first')
                  : undefined}
              >
                + {locale === 'es' ? 'Añadir ciudad' : 'Add city'}
              </Button>
            </div>
          )}

          {/* ── 3. Who ───────────────────────────────────────────── */}
          <div className="mb-4">
            <label className={LABEL}>
              {t('whoTravels')}<Req />
            </label>

            <div className="grid grid-cols-4 gap-2 max-[560px]:grid-cols-2">
              {([
                ['solo',    '🧳', t('solo')],
                ['pareja',  '💑', t('pareja')],
                ['familia', '👨‍👩‍👧‍👦', t('familia')],
                ['amigos',  '🙌', t('amigos')],
              ] as [Traveler, string, string][]).map(
                ([id, icon, label]) => (
                  <Chip
                    key={id}
                    className="w-full justify-center !px-3"
                    selected={traveler === id}
                    onClick={() => setTraveler(id)}
                    label={<><span aria-hidden="true">{icon}</span>{label}</>}
                  />
                )
              )}
            </div>

            {submitted && !traveler && (
              <FieldError msg={t('errorTraveler')} />
            )}

            {/* Family expanded */}
            {traveler === 'familia' && (
              <div className="mt-3 flex flex-col gap-3">
                <Stepper
                  label={t('adults')}
                  value={adults}
                  onMinus={() => setAdults(n => Math.max(1, n - 1))}
                  onPlus={() => setAdults(n => Math.min(10, n + 1))}
                />

                <div>
                  <p className="m-0 mb-2 font-sans text-small font-semibold text-pine">
                    {t('childrenAges')}
                  </p>
                  <div className="flex flex-wrap gap-2 items-center">
                    {children.map(child => (
                      <div key={child.id} className="flex items-center gap-2 rounded-full border border-line-chip bg-white px-3 py-1.5">
                        <span className="text-small">{child.type === 'baby' ? '👶' : '🧒'}</span>
                        <select
                          value={child.age}
                          title="age"
                          onChange={e => setChildren(prev => prev.map(c => c.id === child.id ? { ...c, age: e.target.value } : c))}
                          className="cursor-pointer appearance-none border-none bg-transparent font-sans text-small text-pine outline-none"
                        >
                          {(child.type === 'baby' ? BABY_AGES : KID_AGES).map(age => (
                            <option key={age}>{age}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => setChildren(prev => prev.filter(c => c.id !== child.id))}
                          className="text-body leading-none text-label transition-colors hover:text-pine"
                        >×</button>
                      </div>
                    ))}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setChildren(prev => [...prev, { id: nextKidId, type: 'baby', age: '0-11 m' }])
                        setNextKidId(n => n + 1)
                      }}
                    >
                      {t('addBaby')}
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setChildren(prev => [...prev, { id: nextKidId, type: 'kid', age: '3 anos' }])
                        setNextKidId(n => n + 1)
                      }}
                    >
                      {t('addChild')}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Friends expanded */}
            {traveler === 'amigos' && (
              <div className="mt-3">
                <Stepper
                  label={t('groupCount')}
                  value={groupCount}
                  onMinus={() => setGroupCount(n => Math.max(2, n - 1))}
                  onPlus={() => setGroupCount(n => Math.min(30, n + 1))}
                />
              </div>
            )}
          </div>

          {/* ── 4. Interests + Pace ──────────────────────────────── */}
          <div className={sectionDivider}>
            <label className={LABEL}>{t('interests')}</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {INTERESTS.map(item => (
                <Chip
                  key={item}
                  label={interestLabel[item] ?? item}
                  selected={interests.includes(item)}
                  onClick={() =>
                    setInterests(prev =>
                      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
                    )
                  }
                />
              ))}
            </div>

            <Textarea
              label={t('interests')}
              hideLabel
              rows={2}
              value={extra}
              onChange={e => setExtra(e.target.value)}
              placeholder={t('interestsPlaceholder')}
            />
          </div>

          {/* Pace */}
          <div className="mb-4">
            <label className={LABEL}>
              {t('pace')}<Req />
            </label>
            <div className="flex flex-wrap gap-2">
              {([
                ['Relajado', t('paceRelax')],
                ['Equilibrado', t('paceBalance')],
                ['Activo', t('paceActive')],
              ] as [string, string][]).map(([id, label]) => (
                <Chip key={id} label={label} selected={pace === id} onClick={() => setPace(id)} />
              ))}
            </div>
            {submitted && !pace && (
              <FieldError msg={t('errorPace')} />
            )}
          </div>

          {/* ── 4.5 Walking tolerance ───────────────────────────── */}
          {/* Powers the Intelligence Foundation's energy_warning threshold.
              Three options match the engine's 'low' | 'medium' | 'high' enum
              one-to-one (see lib/intelligence.ts buildDayFlags). Default
              'medium' is pre-selected so users who skip get a sensible
              analysis instead of nothing. Same visual chrome as Pace. */}
          <div className="mb-4">
            <label className={LABEL}>
              {isES ? '¿Cuánto caminas en un día típico de turismo?' : 'How much do you walk on a typical sightseeing day?'}
            </label>
            <div className="flex flex-wrap gap-2">
              {([
                ['low',    isES ? 'Poco · menos de 30 min'  : 'Light · under 30 min'  ],
                ['medium', isES ? 'Moderado · 30 – 60 min'  : 'Moderate · 30 – 60 min'],
                ['high',   isES ? 'Mucho · más de 60 min'   : 'A lot · over 60 min'   ],
              ] as ['low' | 'medium' | 'high', string][]).map(([id, label]) => (
                <Chip key={id} label={label} selected={walkingTolerance === id} onClick={() => setWalkingTolerance(id)} />
              ))}
            </div>
          </div>

          {/* ── 5. Budget ────────────────────────────────────────── */}
          <div className="border-t border-line-soft pt-4">
            <label htmlFor="budget" className={LABEL}>
              {t('budget')}
            </label>
            <div className="flex items-center gap-2 max-[560px]:flex-wrap">
              <Input
                id="budget"
                label={t('budget')}
                hideLabel
                className="min-w-0 flex-1"
                type="text"
                value={budget}
                onChange={e => setBudget(e.target.value.replace(/[^0-9,]/g, ''))}
                placeholder={t('budgetPlaceholder')}
              />
              {/* Currency toggle */}
              <div className="flex gap-2" role="group" aria-label="Currency">
                {(['MXN', 'USD'] as const).map(c => (
                  <Chip key={c} label={c} selected={budgetCurrency === c} onClick={() => setBudgetCurrency(c)} />
                ))}
              </div>
            </div>
          </div>

          {/* ── Footer / CTA ──────────────────────────────────────── */}
          <div className="mt-6 border-t border-line-soft pt-5">
            {/* Social proof — sits directly above the CTA the visitor is about to click. */}
            <div className="mb-4 flex items-center gap-3">
              <div className="flex">
                {HERO_AVATARS.map((r) => (
                  <div
                    key={r.name}
                    className="-mr-[9px] h-[30px] w-[30px] flex-shrink-0 overflow-hidden rounded-full border-2 border-sand bg-mint"
                  >
                    <Image
                      src={r.img}
                      alt={r.name}
                      width={30}
                      height={30}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="m-0 ml-3 font-sans text-tiny text-ink-2">
                <strong className="font-semibold text-pine">
                  {locale === 'es' ? '+400 itinerarios creados' : '+400 itineraries created'}
                </strong>{' '}
                {locale === 'es' ? 'este mes' : 'this month'}
                <br />
                {locale === 'es'
                  ? 'parejas, familias y fans del Mundial'
                  : 'couples, families, and World Cup fans'}
              </p>
            </div>
            <Button type="submit" fullWidth disabled={generating}>
              {generating ? (
                <>
                  <span className="inline-block size-3 animate-spin rounded-full border-2 border-cream/40 border-t-cream" />
                  {locale === 'es' ? 'Generando...' : 'Generating...'}
                </>
              ) : (
                t('submit')
              )}
            </Button>

            <p className="m-0 mt-3 text-center font-sans text-tiny text-label">
              {t('freeNote', { count: FREE_TRIPS_LIMIT })}
            </p>
          </div>
        </InfoCard>
      </form>
    </div>
  )
}
