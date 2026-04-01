'use client'

import { useEffect, useState } from 'react'
import { Link } from '../../../lib/navigation'

type ItemType = 'hotel' | 'tour' | 'restaurant' | 'free' | 'transfer' | 'relax'

interface ItineraryItem {
  id: string
  type: ItemType
  time: string
  name: string
  desc: string
  price?: string
  affiliate?: string
}

interface Day {
  n: number
  label: string
  title: string
  progress: number
  items: ItineraryItem[]
}

interface CheckItem {
  id: string
  icon: string
  text: string
  done: boolean
  day?: number
}

interface BudgetRow {
  id: string
  label: string
  amount: number
  category: string
}

interface TripData {
  title: string
  subtitle: string
  days: Day[]
  checks: CheckItem[]
  budgetRows: BudgetRow[]
  packing: string[]
}

interface Props {
  params: Record<string, string>
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-[#1B4D3E] animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <p className="font-mono text-[11px] tracking-[2px] text-[#2D6B57] uppercase">
        Generating your plan…
      </p>
      <p className="font-sans text-[14px] text-[#8A8A8A] text-center">
        We are creating your personalized itinerary.
      </p>
    </div>
  )
}

function normalizeDay(raw: any, index: number): Day {
  // Backend sends blocks; UI expects items — map either shape
  const rawItems: any[] = Array.isArray(raw?.items)  ? raw.items
                        : Array.isArray(raw?.blocks) ? raw.blocks
                        : []

  return {
    n:        typeof raw?.n === 'number'        ? raw.n        : index + 1,
    label:    typeof raw?.label === 'string'    ? raw.label    : `Day ${index + 1}`,
    title:    typeof raw?.title === 'string'    ? raw.title    : '',
    progress: typeof raw?.progress === 'number' ? raw.progress : 0,
    items:    rawItems.map(normalizeItem),
  }
}

function normalizeItem(raw: any, index: number): ItineraryItem {
  return {
    id:        typeof raw?.id === 'string'   ? raw.id   : `item-${index}`,
    type:      raw?.type   ?? 'free',
    time:      raw?.time   ?? '',
    name:      raw?.title  ?? raw?.name  ?? '',
    desc:      raw?.description ?? raw?.desc ?? '',
    price:     raw?.price,
    affiliate: raw?.affiliate,
  }
}

function normalizeTripData(row: any, destination: string, nights: string): TripData {
  // row is a trips table row: { id, slug, title, trip_data, ... }
  // trip_data holds the full itinerary JSON from the Edge Function
  const source = row?.trip_data ?? row?.trip ?? row?.data ?? row ?? {}

  const rawDays = Array.isArray(source.days) ? source.days : []

  return {
    title:      row?.title ?? source.title ?? `${destination} · ${parseInt(nights || '0', 10) || 3} nights`,
    subtitle:   source.subtitle ?? 'AI-generated trip plan',
    days:       rawDays.map(normalizeDay),
    checks:     Array.isArray(source.checks)     ? source.checks     : [],
    budgetRows: Array.isArray(source.budgetRows) ? source.budgetRows : [],
    packing:    Array.isArray(source.packing)    ? source.packing    : [],
  }
}

export default function TripResult({ params }: Props) {
  const {
    destination = '',
    origin = '',
    start = '',
    end = '',
    nights = '',
    traveler = '',
    interests = '',
    pace = '',
    budget = '',
  } = params

  const locale = params.locale || 'es'
  const editHref = `/planner?edit=1&destination=${encodeURIComponent(destination)}&origin=${encodeURIComponent(origin)}&start=${start}&end=${end}&nights=${nights}&traveler=${traveler}&interests=${encodeURIComponent(interests)}&pace=${pace}&budget=${budget}`
  console.log('editHref:', editHref)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rawResponse, setRawResponse] = useState<any>(null)

  const [tripTitle, setTripTitle] = useState('')
  const [tripSubtitle, setTripSubtitle] = useState('')
  const [days, setDays] = useState<Day[]>([])
  const [checks, setChecks] = useState<CheckItem[]>([])
  const [budgetRows, setBudgetRows] = useState<BudgetRow[]>([])
  const [packing, setPacking] = useState<string[]>([])

  useEffect(() => {
    async function generate() {
      setLoading(true)
      setError(null)

      try {
        const parsedInterests = interests
          ? interests.split(',').map((i) => i.trim()).filter(Boolean)
          : []

        const payload = {
          destination,
          origin,
          start,
          end,
          nights,
          traveler,
          interests: parsedInterests,
          pace,
          budget,
        }

        console.log('[TripResult] POST payload:', JSON.stringify(payload))

        // Step 1 — generate and save the trip
        const genRes  = await fetch('/api/generate-trip', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const genData = await genRes.json().catch(() => null)
        console.log('[TripResult] POST status:', genRes.status, 'response:', genData)
        setRawResponse(genData)

        if (!genRes.ok) {
          const base   = typeof genData?.error === 'string' ? genData.error : 'Generation failed'
          const detail = genData?.detail ? `\n\n${JSON.stringify(genData.detail, null, 2)}` : ''
          throw new Error(base + detail)
        }

        const tripId = genData?.trip_id
        if (!tripId) {
          throw new Error(
            `No trip_id in generation response. Got: ${JSON.stringify(genData)}`
          )
        }

        // Step 2 — fetch full trip data from database
        console.log('[TripResult] GET /api/trips/' + tripId)
        const tripRes  = await fetch(`/api/trips/${tripId}`)
        const tripData = await tripRes.json().catch(() => null)
        console.log('[TripResult] GET status:', tripRes.status, 'response:', tripData)
        setRawResponse(tripData)

        if (!tripRes.ok) {
          const base = typeof tripData?.error === 'string' ? tripData.error : 'Failed to load trip'
          throw new Error(base)
        }

        // Step 3 — normalize and render
        const normalized = normalizeTripData(tripData, destination, nights)
        setTripTitle(normalized.title)
        setTripSubtitle(normalized.subtitle)
        setDays(normalized.days)
        setChecks(normalized.checks)
        setBudgetRows(normalized.budgetRows)
        setPacking(normalized.packing)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    generate()
  }, [destination, origin, start, end, nights, traveler, interests, pace, budget])

  const totalBudget = budgetRows.reduce((sum, row) => sum + row.amount, 0)
  const nightsNum = parseInt(nights || '0', 10) || 3
  const dateRange = start && end ? `${start} — ${end}` : `${nightsNum} nights`

  if (loading) {
    return (
      <main className="pt-[64px] min-h-screen bg-[#F4F0E8]">
        <div className="page-inner">
          <LoadingState />
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="pt-[64px] min-h-screen bg-[#F4F0E8]">
        <div className="page-inner py-10">
          <div className="max-w-[900px] mx-auto bg-white border border-[rgba(15,58,51,.12)] rounded-[12px] p-6">
            <p className="font-mono text-[10px] tracking-[2px] uppercase text-[#B33A3A] mb-3">
              Generation error
            </p>
            <h1 className="font-sans text-[24px] font-semibold text-[#0F3A33] mb-3">
              The planner reached the API, but the response is not ready for the UI yet.
            </h1>
            <p className="font-sans text-[14px] text-[#4F6F68] mb-4">
              This is progress. We are past the original submit issue and now inspecting the real backend response.
            </p>

            <div className="mb-4">
              <p className="font-mono text-[10px] tracking-[1px] uppercase text-[#6B8F86] mb-2">
                Error
              </p>
              <pre className="bg-[#F7F3EE] text-[#0F3A33] text-[12px] p-4 rounded-[8px] overflow-auto whitespace-pre-wrap">
                {error}
              </pre>
            </div>

            <div className="mb-4">
              <p className="font-mono text-[10px] tracking-[1px] uppercase text-[#6B8F86] mb-2">
                Raw response
              </p>
              <pre className="bg-[#F7F3EE] text-[#0F3A33] text-[12px] p-4 rounded-[8px] overflow-auto whitespace-pre-wrap">
                {JSON.stringify(rawResponse, null, 2)}
              </pre>
            </div>

            <Link
              href="/planner"
              className="inline-block font-mono text-[10px] tracking-[1.2px] uppercase bg-[#0F3A33] text-[#FFF9F3] px-4 py-3 rounded-[4px]"
            >
              Back to planner
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="pt-[64px] min-h-screen bg-[#F4F0E8]">
      <div className="page-inner py-10">
        <div className="max-w-[1100px] mx-auto">
          <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="font-mono text-[10px] tracking-[2px] uppercase text-[#6B8F86] mb-2">
                {origin ? `${origin} → ${destination}` : destination}
              </p>
              <h1 className="font-sans text-[34px] font-semibold text-[#0F3A33] mb-2">
                {tripTitle}
              </h1>
              <p className="font-sans text-[15px] text-[#4F6F68] mb-3">{tripSubtitle}</p>
              <div className="flex gap-2 flex-wrap">
                <span className="font-mono text-[10px] px-3 py-1.5 rounded-full bg-white border border-[rgba(15,58,51,.12)]">
                  {dateRange}
                </span>
                {traveler && (
                  <span className="font-mono text-[10px] px-3 py-1.5 rounded-full bg-white border border-[rgba(15,58,51,.12)] capitalize">
                    {traveler}
                  </span>
                )}
                {pace && (
                  <span className="font-mono text-[10px] px-3 py-1.5 rounded-full bg-white border border-[rgba(15,58,51,.12)] capitalize">
                    pace {pace}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2">
  <div className="flex gap-2">
  <Link
    href={editHref}
    className="font-mono text-[10px] tracking-[1.2px] uppercase bg-[#0F3A33] text-[#FFF9F3] px-4 py-3 rounded-[4px]"
  >
    Edit trip
  </Link>

  <Link
    href={editHref}
    className="font-mono text-[10px] tracking-[1.2px] uppercase text-[#0F3A33] border border-[rgba(15,58,51,.2)] px-4 py-3 rounded-[4px] hover:bg-white"
  >
    New
  </Link>
</div>

</div>
          </div>

          <div className="grid grid-cols-[1fr_320px] gap-6 max-[1024px]:grid-cols-1">
            <div className="space-y-4">
              {days.length === 0 ? (
                <div className="bg-white border border-[rgba(15,58,51,.12)] rounded-[12px] p-6">
                  <p className="font-sans text-[15px] text-[#4F6F68]">
                    The API returned successfully, but no itinerary days were found in the expected format.
                  </p>
                </div>
              ) : (
                days.map((day) => (
                  <div
                    key={day.n}
                    className="bg-white border border-[rgba(15,58,51,.12)] rounded-[12px] p-5"
                  >
                    <p className="font-mono text-[10px] tracking-[2px] uppercase text-[#6B8F86] mb-2">
                      {day.label}
                    </p>
                    <h2 className="font-sans text-[24px] font-semibold text-[#0F3A33] mb-3">
                      {day.title}
                    </h2>
                    <div className="space-y-3">
                      {day.items.map((item) => (
                        <div
                          key={item.id}
                          className="border border-[rgba(15,58,51,.08)] rounded-[10px] p-4"
                        >
                          <div className="flex items-center justify-between gap-3 mb-2">
                            <span className="font-mono text-[10px] uppercase text-[#6B8F86]">
                              {item.time}
                            </span>
                            {item.price && (
                              <span className="font-mono text-[11px] text-[#0F3A33]">
                                {item.price}
                              </span>
                            )}
                          </div>
                          <p className="font-sans text-[16px] font-medium text-[#0F3A33] mb-1">
                            {item.name}
                          </p>
                          <p className="font-sans text-[14px] text-[#4F6F68]">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-white border border-[rgba(15,58,51,.12)] rounded-[12px] p-5">
                <p className="font-mono text-[10px] tracking-[2px] uppercase text-[#6B8F86] mb-3">
                  Budget
                </p>
                <p className="font-sans text-[28px] font-semibold text-[#0F3A33] mb-4">
                  ${totalBudget.toLocaleString()} MXN
                </p>
                <div className="space-y-2">
                  {budgetRows.map((row) => (
                    <div key={row.id} className="flex items-center justify-between gap-3">
                      <span className="font-sans text-[14px] text-[#4F6F68]">{row.label}</span>
                      <span className="font-mono text-[11px] text-[#0F3A33]">
                        ${row.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-[rgba(15,58,51,.12)] rounded-[12px] p-5">
                <p className="font-mono text-[10px] tracking-[2px] uppercase text-[#6B8F86] mb-3">
                  Packing
                </p>
                <ul className="space-y-2">
                  {packing.map((item, i) => (
                    <li key={`${item}-${i}`} className="font-sans text-[14px] text-[#4F6F68]">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white border border-[rgba(15,58,51,.12)] rounded-[12px] p-5">
                <p className="font-mono text-[10px] tracking-[2px] uppercase text-[#6B8F86] mb-3">
                  Checks
                </p>
                <ul className="space-y-2">
                  {checks.map((item) => (
                    <li key={item.id} className="font-sans text-[14px] text-[#4F6F68]">
                      {item.icon} {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}