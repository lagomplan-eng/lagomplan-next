// lib/guia/weather.ts
//
// Live weather for the guide's "right now in the city" card, via Open-Meteo
// (free, no API key, CORS-enabled → fetched client-side). This file owns the
// WMO-code → category logic and the category → copy map; extend it here
// (e.g. add 'fog', seasonal wording) without touching the card UI.

import type { Lang } from '../../content/guia/types'

export type WxCategory = 'clear' | 'partly' | 'rain' | 'storm'

export interface WeatherNow {
  /** Today's max/min, already rounded to whole degrees. */
  max: number
  min: number
  category: WxCategory
}

// WMO weather_code (+ daily precip probability) → one of four categories.
// Reorder/extend here; the UI only knows these four buckets.
export function categorize(weatherCode: number, precipProbability: number): WxCategory {
  if (weatherCode >= 95) return 'storm'                        // 95/96/99 thunderstorm
  const isRainCode =
    (weatherCode >= 51 && weatherCode <= 67) ||               // drizzle + rain (incl. freezing)
    (weatherCode >= 80 && weatherCode <= 82)                  // rain showers
  if (isRainCode || precipProbability >= 50) return 'rain'    // raining, or ≥50% chance today
  if (weatherCode === 0 || weatherCode === 1) return 'clear'  // clear / mainly clear
  return 'partly'                                             // 2,3 cloud · 45,48 fog · else
}

// Category → one-line description per language: practical fact + consequence.
// This is the seasonally-extendable copy table.
export const WX_COPY: Record<WxCategory, Record<Lang, string>> = {
  clear:  { es: 'Despejado todo el día.',                                en: 'Clear all day.' },
  partly: { es: 'Parcialmente nublado.',                                en: 'Partly cloudy.' },
  rain:   { es: 'Lluvia por la tarde, probable; sal con capa ligera.', en: 'Afternoon rain likely; bring a light rain layer.' },
  storm:  { es: 'Tormenta esperada, planea bajo techo por la tarde.',  en: 'Storms expected, plan indoors for the afternoon.' },
}

// Mexico City, fixed coordinates + timezone.
const ENDPOINT =
  'https://api.open-meteo.com/v1/forecast' +
  '?latitude=19.4326&longitude=-99.1332&timezone=America%2FMexico_City' +
  '&current=temperature_2m,weather_code' +
  '&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max'

/**
 * Fetch today's Mexico City weather. Resolves to WeatherNow, or THROWS on
 * network error, timeout (>4s), non-OK response, or malformed payload. The
 * caller must hide the card on any throw — never show a fallback number.
 * `signal` (component unmount) is chained into the internal 4s timeout.
 */
export async function fetchWeather(signal?: AbortSignal): Promise<WeatherNow> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 4000)
  if (signal) signal.addEventListener('abort', () => ctrl.abort(), { once: true })

  try {
    const res = await fetch(ENDPOINT, { signal: ctrl.signal })
    if (!res.ok) throw new Error(`weather ${res.status}`)
    const data = await res.json()

    const max    = data?.daily?.temperature_2m_max?.[0]
    const min    = data?.daily?.temperature_2m_min?.[0]
    const code   = data?.current?.weather_code
    const precip = data?.daily?.precipitation_probability_max?.[0]

    if (typeof max !== 'number' || typeof min !== 'number' || typeof code !== 'number') {
      throw new Error('weather malformed')
    }

    return {
      max: Math.round(max),
      min: Math.round(min),
      category: categorize(code, typeof precip === 'number' ? precip : 0),
    }
  } finally {
    clearTimeout(timer)
  }
}
