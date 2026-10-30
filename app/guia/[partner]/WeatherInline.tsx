'use client'

/**
 * app/guia/[partner]/WeatherInline.tsx
 *
 * Today's weather as one small mono line ("24° / 14° · Partly cloudy…") that sits under a section's
 * subtitle (replaces the standalone dark weather card). Open-Meteo, client-side, no key.
 *
 * Failure rule (unchanged): on network error / timeout (>4s) / malformed data nothing is rendered,
 * never a fallback temperature. While loading it keeps its line height (no layout shift).
 */

import { useEffect, useState } from 'react'
import { Sun, CloudSun, CloudRain, CloudLightning, type LucideIcon } from 'lucide-react'
import type { Lang } from '../../../content/guia/types'
import { fetchWeather, WX_COPY, type WxCategory } from '../../../lib/guia/weather'
import styles from './guia.module.css'

const WX_ICON: Record<WxCategory, LucideIcon> = { clear: Sun, partly: CloudSun, rain: CloudRain, storm: CloudLightning }

type State =
  | { status: 'loading' }
  | { status: 'ready'; max: number; min: number; category: WxCategory }
  | { status: 'failed' }

export default function WeatherInline({ lang }: { lang: Lang }) {
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    const ctrl = new AbortController()
    let active = true
    fetchWeather(ctrl.signal)
      .then((w) => { if (active) setState({ status: 'ready', ...w }) })
      .catch(() => { if (active) setState({ status: 'failed' }) })
    return () => { active = false; ctrl.abort() }
  }, [])

  if (state.status === 'failed') return null
  if (state.status === 'loading') return <p className={styles.wxInline} aria-hidden><span className={styles.wxInlineSkeleton} /></p>

  const Icon = WX_ICON[state.category]
  return (
    <p className={styles.wxInline}>
      <Icon size={14} strokeWidth={1.8} aria-hidden />
      <span>{state.max}° / {state.min}° · {WX_COPY[state.category][lang]}</span>
    </p>
  )
}
