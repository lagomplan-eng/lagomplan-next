'use client'
// components/PlacesInput.tsx
// Reutilizable — usa Google Maps Places Autocomplete API
//
// Setup:
//   1. npm install @googlemaps/js-api-loader
//   2. Añade NEXT_PUBLIC_GOOGLE_MAPS_API_KEY en .env.local
//      (habilita "Places API (New)" en Google Cloud Console)
//   3. Importa y úsalo: <PlacesInput ... />

import { useEffect, useRef, useState, useCallback } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

// ── Singleton loaders by locale ──
const loaderMap = new Map<string, Promise<typeof google>>()

function getLoader(locale: 'es' | 'en') {
  const key = `${locale}-places`
  const existing = loaderMap.get(key)
  if (existing) return existing

  const loader = new Loader({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    version: 'weekly',
    libraries: ['places'],
    language: locale,
    region: 'MX',
  })

  const promise = loader.load()
  loaderMap.set(key, promise)
  return promise
}

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
  locationBias = 'MX',
}: PlacesInputProps) {

  const inputRef   = useRef<HTMLInputElement>(null)
  const ddRef      = useRef<HTMLDivElement>(null)
  const acRef      = useRef<google.maps.places.AutocompleteService | null>(null)
  const sessionRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null)

  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([])
  const [open,        setOpen]        = useState(false)
  const [highlighted, setHighlighted] = useState(-1)
  const [loading,     setLoading]     = useState(false)
  const [hasValue,    setHasValue]    = useState(!!value)

  // ── Init Google Places ──────────────────────────────────────────
useEffect(() => {
  getLoader(locale).then(() => {
    acRef.current = new google.maps.places.AutocompleteService()
    sessionRef.current = new google.maps.places.AutocompleteSessionToken()
  })
}, [locale])

  // ── Fetch predictions (debounced) ───────────────────────────────
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  const fetchPredictions = useCallback((input: string) => {
    if (!acRef.current || input.length < 2) {
      setPredictions([])
      setOpen(false)
      return
    }
    clearTimeout(timerRef.current)
    setLoading(true)
    timerRef.current = setTimeout(() => {
      const request: google.maps.places.AutocompletionRequest = {
        input,
        sessionToken: sessionRef.current ?? undefined,
        types,
        ...(locationBias === 'MX' && {
          componentRestrictions: undefined,
          // Bias toward Mexico without hard restriction
          locationBias: {
            center: { lat: 23.6345, lng: -102.5528 },
            radius: 2_000_000,
          } as any,
        }),
      }
      acRef.current!.getPlacePredictions(request, (results, status) => {
        setLoading(false)
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          setPredictions(results)
          setOpen(true)
        } else {
          setPredictions([])
          setOpen(false)
        }
      })
    }, 200)
  }, [types, locationBias])

  // ── Resolve a prediction to full PlaceResult ────────────────────
  function selectPrediction(prediction: google.maps.places.AutocompletePrediction) {
    const service = new google.maps.places.PlacesService(
      document.createElement('div')
    )
    service.getDetails(
      {
        placeId: prediction.place_id,
        sessionToken: sessionRef.current ?? undefined,
        fields: ['name', 'formatted_address', 'place_id', 'geometry', 'types'],
      },
      (place, status) => {
        // Reset session token after each completed session
        sessionRef.current = new google.maps.places.AutocompleteSessionToken()

        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          const result: PlaceResult = {
            displayName:      place.name ?? prediction.structured_formatting.main_text,
            formattedAddress: place.formatted_address ?? '',
            placeId:          place.place_id ?? prediction.place_id,
            location:         place.geometry?.location
              ? { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }
              : null,
            types: place.types ?? [],
          }
          onChange(result.displayName)
          onSelect(result)
          setHasValue(true)
        }
      }
    )
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
        ddRef.current   && !ddRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // ── Highlight matched text ──────────────────────────────────────
  function renderMain(prediction: google.maps.places.AutocompletePrediction) {
    const { main_text, main_text_matched_substrings: matches } = prediction.structured_formatting
    if (!matches?.length) return <span>{main_text}</span>
    const parts: React.ReactNode[] = []
    let cursor = 0
    matches.forEach(({ offset, length }, i) => {
      if (offset > cursor) parts.push(<span key={`pre-${i}`}>{main_text.slice(cursor, offset)}</span>)
      parts.push(<strong key={`match-${i}`} className="text-[#1B4D3E] font-semibold">{main_text.slice(offset, offset + length)}</strong>)
      cursor = offset + length
    })
    if (cursor < main_text.length) parts.push(<span key="post">{main_text.slice(cursor)}</span>)
    return <>{parts}</>
  }

  // ── Icon by place type ──────────────────────────────────────────
  function iconForTypes(types: string[]) {
    if (types.some(t => ['airport','transit_station'].includes(t))) return '✈'
    if (types.some(t => ['natural_feature','park','campground'].includes(t))) return '🌿'
    if (types.some(t => ['beach','tourist_attraction'].includes(t))) return '🌊'
    return '📍'
  }

  // ── Label by type ───────────────────────────────────────────────
  function labelForTypes(types: string[]) {
    if (types.includes('country'))                    return 'País'
    if (types.includes('administrative_area_level_1')) return 'Estado'
    if (types.includes('locality'))                   return 'Ciudad'
    if (types.includes('sublocality'))                return 'Colonia'
    if (types.includes('airport'))                    return 'Aeropuerto'
    return 'Lugar'
  }

  const baseInput = [
    'w-full font-sans text-[13px] border bg-white',
    'py-2 text-[#0F1A16] placeholder-[#BDBDBD]',
    'focus:outline-none focus:shadow-[0_0_0_3px_rgba(27,77,62,0.06)]',
    'rounded-[2px] transition-all',
    hasValue  ? 'border-[#1B4D3E] pr-7 pl-3'   : 'border-[#C8D9D3] pr-7 pl-3',
    open      ? 'border-[#1B4D3E]'              : '',
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

      {/* Pin icon — always visible, dimmer when no value */}
      <svg
        className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none transition-opacity ${hasValue ? 'opacity-60' : 'opacity-25'}`}
        viewBox="0 0 14 18" fill="none"
      >
        <path d="M7 0C4.24 0 2 2.24 2 5c0 3.75 5 11 5 11s5-7.25 5-11c0-2.76-2.24-5-5-5zm0 6.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="#1B4D3E"/>
      </svg>

      {/* Clear button — only when has value */}
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
          {/* Header */}
          <div className="font-mono text-[8px] tracking-[2px] text-[#A0A0A0] uppercase px-3 py-2 border-b border-[#E8E0D0]">
            Sugerencias
          </div>

          {/* Results */}
          {predictions.map((p, i) => (
            <div
              key={p.place_id}
              onMouseDown={() => selectPrediction(p)}
              onMouseEnter={() => setHighlighted(i)}
              className={[
                'flex items-start gap-2.5 px-3 py-2.5 cursor-pointer border-b border-[#F0EDE6] last:border-0 transition-colors',
                highlighted === i ? 'bg-[#F4F0E8]' : 'hover:bg-[#F4F0E8]',
              ].join(' ')}
            >
              {/* Icon */}
              <div className="w-7 h-7 rounded-[2px] bg-[#E8F0EE] flex items-center justify-center flex-shrink-0 mt-0.5 text-[13px]">
                {iconForTypes(p.types ?? [])}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="font-sans text-[13px] text-[#0F1A16] truncate">
                  {renderMain(p)}
                </div>
                <div className="font-mono text-[10px] text-[#8A8A8A] mt-0.5 tracking-[0.3px]">
                  {p.structured_formatting.secondary_text}
                </div>
              </div>

              {/* Type badge */}
              <span className="font-mono text-[8px] tracking-[1px] uppercase text-[#2D6B57] bg-[#E8F0EE] border border-[rgba(27,77,62,0.15)] px-1.5 py-0.5 rounded-full self-center flex-shrink-0">
                {labelForTypes(p.types ?? [])}
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
