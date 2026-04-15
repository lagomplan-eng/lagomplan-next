'use client'
// components/forms/PlacesInput.tsx
// Uses lib/googleMaps.ts as the single script loader.
// Setup:
//   1. Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to Vercel env vars (not just .env.local)
//   2. Enable "Places API" + "Maps JavaScript API" in Google Cloud Console

import { useEffect, useRef, useState, useCallback } from 'react'
import { loadGoogleMaps } from '../../lib/googleMaps'

export interface PlaceResult {
  displayName: string
  formattedAddress: string
  placeId: string
  location: { lat: number; lng: number } | null
  types: string[]
}

interface PlacesInputProps {
  id: string
  locale: 'es' | 'en'
  placeholder?: string
  value: string
  onChange: (raw: string) => void
  onSelect: (place: PlaceResult) => void
  types?: string[]
  locationBias?: 'MX' | 'US' | 'global'
}

// ── Component ────────────────────────────────────────────────────
export default function PlacesInput({
  id,
  locale,
  placeholder = 'Escribe un destino…',
  value,
  onChange,
  onSelect,
  types = ['(cities)'],
  locationBias = 'global',
}: PlacesInputProps) {

  const inputRef     = useRef<HTMLInputElement>(null)
  const ddRef        = useRef<HTMLDivElement>(null)
  const mapsReadyRef = useRef<boolean>(false)
  const sessionRef   = useRef<any>(null)

  const [predictions, setPredictions] = useState<any[]>([])
  const [open,        setOpen]        = useState(false)
  const [highlighted, setHighlighted] = useState(-1)
  const [loading,     setLoading]     = useState(false)
  const [hasValue,    setHasValue]    = useState(!!value)

  // ── Init Google Places ──────────────────────────────────────────
  useEffect(() => {
    loadGoogleMaps().then(() => {
      const g = (window as any).google
      mapsReadyRef.current = true
      sessionRef.current   = new g.maps.places.AutocompleteSessionToken()
    }).catch((err) => {
      console.error('PlacesInput: Google Maps failed to load', err)
    })
  }, [])

  // ── Fetch predictions (debounced) ───────────────────────────────
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  const fetchPredictions = useCallback((input: string) => {
    if (!mapsReadyRef.current || input.length < 2) {
      setPredictions([])
      setOpen(false)
      return
    }
    clearTimeout(timerRef.current)
    setLoading(true)
    timerRef.current = setTimeout(async () => {
      const g = (window as any).google
      // Mexico bounding box — used as a soft bias, NOT a restriction.
      // includedRegionCodes would hard-filter to one country; locationBias just
      // ranks local results higher while still returning global matches.
      const MX_BOUNDS = {
        rectangle: {
          low:  { latitude: 14.5, longitude: -118.4 },
          high: { latitude: 32.7, longitude:  -86.7 },
        },
      }

      const request: any = {
        input,
        sessionToken: sessionRef.current ?? undefined,
        includedPrimaryTypes: types,
        ...(locationBias === 'MX' && { locationBias: MX_BOUNDS }),
      }
      try {
        const { suggestions } = await g.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(request)
        setLoading(false)
        if (suggestions?.length) {
          setPredictions(suggestions)
          setOpen(true)
        } else {
          setPredictions([])
          setOpen(false)
        }
      } catch (err) {
        console.error('PlacesInput: fetchAutocompleteSuggestions failed', err)
        setLoading(false)
        setPredictions([])
        setOpen(false)
      }
    }, 200)
  }, [types, locationBias])

  // ── Resolve a prediction to full PlaceResult ────────────────────
  async function selectPrediction(suggestion: any) {
    const g = (window as any).google
    const placePrediction = suggestion.placePrediction

    try {
      const place = placePrediction.toPlace()
      await place.fetchFields({ fields: ['displayName', 'formattedAddress', 'location', 'types', 'id'] })

      sessionRef.current = new g.maps.places.AutocompleteSessionToken()

      const result: PlaceResult = {
        displayName:      place.displayName ?? placePrediction.mainText.text,
        formattedAddress: place.formattedAddress ?? '',
        placeId:          place.id ?? placePrediction.placeId,
        location: place.location
          ? { lat: place.location.lat(), lng: place.location.lng() }
          : null,
        types: place.types ?? [],
      }
      onChange(result.displayName)
      onSelect(result)
      setHasValue(true)
    } catch (err) {
      console.error('PlacesInput: fetchFields failed', err)
    }

    setPredictions([])
    setOpen(false)
    setHighlighted(-1)
  }

  // ── Keyboard nav ────────────────────────────────────────────────
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || !predictions.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted(h => Math.min(h + 1, predictions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted(h => Math.max(h - 1, 0))
    } else if (e.key === 'Enter' && highlighted >= 0) {
      e.preventDefault()
      selectPrediction(predictions[highlighted])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  // ── Close on outside click ──────────────────────────────────────
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        inputRef.current && !inputRef.current.contains(e.target as Node) &&
        ddRef.current    && !ddRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // ── Highlight matched text ──────────────────────────────────────
  function renderMain(suggestion: any) {
    const { text, matches } = suggestion.placePrediction.mainText
    if (!matches?.length) return <span>{text}</span>
    const parts: React.ReactNode[] = []
    let cursor = 0
    matches.forEach(({ startOffset, endOffset }: { startOffset: number; endOffset: number }, i: number) => {
      if (startOffset > cursor) parts.push(<span key={`pre-${i}`}>{text.slice(cursor, startOffset)}</span>)
      parts.push(<strong key={`match-${i}`} className="text-[#1B4D3E] font-semibold">{text.slice(startOffset, endOffset)}</strong>)
      cursor = endOffset
    })
    if (cursor < text.length) parts.push(<span key="post">{text.slice(cursor)}</span>)
    return <>{parts}</>
  }

  // ── Icon by place type ──────────────────────────────────────────
  function iconForTypes(t: string[]) {
    if (t.some(x => ['airport', 'transit_station'].includes(x))) return '✈'
    if (t.some(x => ['natural_feature', 'park', 'campground'].includes(x))) return '🌿'
    if (t.some(x => ['beach', 'tourist_attraction'].includes(x))) return '🌊'
    return '📍'
  }

  // ── Label by type ───────────────────────────────────────────────
  function labelForTypes(t: string[]) {
    if (t.includes('country'))                     return 'País'
    if (t.includes('administrative_area_level_1'))  return 'Estado'
    if (t.includes('locality'))                    return 'Ciudad'
    if (t.includes('sublocality'))                 return 'Colonia'
    if (t.includes('airport'))                     return 'Aeropuerto'
    return 'Lugar'
  }

  const baseInput = [
    'w-full font-sans text-[13px] border bg-white',
    'py-2 text-[#0F1A16] placeholder-[#BDBDBD]',
    'focus:outline-none focus:shadow-[0_0_0_3px_rgba(27,77,62,0.06)]',
    'rounded-[2px] transition-all',
    hasValue ? 'border-[#1B4D3E] pr-7 pl-3' : 'border-[#C8D9D3] pr-7 pl-3',
    open     ? 'border-[#1B4D3E]'           : '',
  ].join(' ')

  return (
    <div className="relative">
      {/* Input */}
      <input
        ref={inputRef}
        id={id}
        type="text"
        autoComplete="off"
        placeholder={placeholder}
        value={value}
        onChange={e => {
          onChange(e.target.value)
          setHasValue(false)
          fetchPredictions(e.target.value)
        }}
        onFocus={() => { if (value.length >= 2) fetchPredictions(value) }}
        onKeyDown={handleKeyDown}
        className={baseInput}
      />

      {/* Pin icon */}
      <svg
        className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none transition-opacity ${hasValue ? 'opacity-60' : 'opacity-25'}`}
        viewBox="0 0 14 18" fill="none"
      >
        <path d="M7 0C4.24 0 2 2.24 2 5c0 3.75 5 11 5 11s5-7.25 5-11c0-2.76-2.24-5-5-5zm0 6.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="#1B4D3E"/>
      </svg>

      {/* Clear button */}
      {hasValue && (
        <button
          type="button"
          onClick={() => { onChange(''); setHasValue(false); setPredictions([]); setOpen(false); inputRef.current?.focus() }}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-[#BDBDBD] hover:text-[#4A4A4A] text-[15px] leading-none transition-colors"
          aria-label="Limpiar"
        >×</button>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="absolute right-8 top-1/2 -translate-y-1/2">
          <div className="w-3 h-3 border border-[#C8D9D3] border-t-[#1B4D3E] rounded-full animate-spin" />
        </div>
      )}

      {/* Dropdown */}
      {open && predictions.length > 0 && (
        <div
          ref={ddRef}
          className="absolute top-[calc(100%+2px)] left-0 right-0 bg-[#FDFCF9] border border-[#C8D9D3] rounded-[2px] shadow-[0_4px_16px_rgba(27,77,62,0.10)] z-50 overflow-hidden"
        >
          <div className="font-mono text-[8px] tracking-[2px] text-[#A0A0A0] uppercase px-3 py-2 border-b border-[#E8E0D0]">
            Sugerencias
          </div>

          {predictions.map((s, i) => (
            <div
              key={s.placePrediction.placeId}
              onMouseDown={() => selectPrediction(s)}
              onMouseEnter={() => setHighlighted(i)}
              className={[
                'flex items-start gap-2.5 px-3 py-2.5 cursor-pointer border-b border-[#F0EDE6] last:border-0 transition-colors',
                highlighted === i ? 'bg-[#F4F0E8]' : 'hover:bg-[#F4F0E8]',
              ].join(' ')}
            >
              <div className="w-7 h-7 rounded-[2px] bg-[#E8F0EE] flex items-center justify-center flex-shrink-0 mt-0.5 text-[13px]">
                {iconForTypes(s.placePrediction.types ?? [])}
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-sans text-[13px] text-[#0F1A16] truncate">
                  {renderMain(s)}
                </div>
                <div className="font-mono text-[10px] text-[#8A8A8A] mt-0.5 tracking-[0.3px]">
                  {s.placePrediction.secondaryText?.text}
                </div>
              </div>

              <span className="font-mono text-[8px] tracking-[1px] uppercase text-[#2D6B57] bg-[#E8F0EE] border border-[rgba(27,77,62,0.15)] px-1.5 py-0.5 rounded-full self-center flex-shrink-0">
                {labelForTypes(s.placePrediction.types ?? [])}
              </span>
            </div>
          ))}

          {/* Google attribution — required by ToS */}
          <div className="flex items-center justify-end gap-1.5 px-3 py-1.5 border-t border-[#E8E0D0]">
            <span className="font-mono text-[8px] text-[#BDBDBD] tracking-[0.5px]">Impulsado por</span>
            <img
              src="https://maps.gstatic.com/mapfiles/api-3/images/powered-by-google-on-white3_hdpi.png"
              alt="Powered by Google"
              className="h-3 opacity-50"
            />
          </div>
        </div>
      )}
    </div>
  )
}
