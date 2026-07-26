'use client'

/**
 * app/guia/[partner]/WeatherCard.tsx
 *
 * The "right now in the city" weather card, made live via Open-Meteo
 * (client-side, no key). Keeps the exact card design (dark Pine, mono
 * temperature, one-line description in the active language).
 *
 * Failure rule: on network error / timeout (>4s) / malformed data, the card
 * is HIDDEN — never a fallback temperature. While loading it reserves the
 * card's space (no layout shift); on failure it collapses cleanly.
 */

import { useEffect, useState } from 'react'
import { Sun, CloudSun, CloudRain, CloudLightning, type LucideIcon } from 'lucide-react'
import type { Lang } from '../../../content/guia/types'
import { fetchWeather, WX_COPY, type WxCategory } from '../../../lib/guia/weather'
import styles from './guia.module.css'

const CREAM = '#FFF9F3'

const WX_ICON: Record<WxCategory, LucideIcon> = {
  clear: Sun, partly: CloudSun, rain: CloudRain, storm: CloudLightning,
}

type State =
  | { status: 'loading' }
  | { status: 'ready'; max: number; min: number; category: WxCategory }
  | { status: 'failed' }

export default function WeatherCard({ lang }: { lang: Lang }) {
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    const ctrl = new AbortController()
    let active = true
    fetchWeather(ctrl.signal)
      .then((w) => { if (active) setState({ status: 'ready', ...w }) })
      .catch(() => { if (active) setState({ status: 'failed' }) })
    return () => { active = false; ctrl.abort() }
  }, [])

  // Failure → the card simply doesn't exist this visit (honest over wrong).
  if (state.status === 'failed') return null

  // Loading → reserve the card's footprint so nothing shifts when it resolves.
  if (state.status === 'loading') {
    return (
      <div className={`${styles.weatherCard} ${styles.wxLoading}`} aria-hidden>
        <div className={styles.wxIconSkeleton} />
        <div style={{ flex: 1 }}>
          <div className={styles.wxBar} style={{ width: 88 }} />
          <div className={styles.wxBar} style={{ width: 240, marginTop: 8, opacity: 0.55 }} />
        </div>
      </div>
    )
  }

  const Icon = WX_ICON[state.category]
  return (
    <div className={styles.weatherCard}>
      <Icon size={30} color={CREAM} strokeWidth={1.8} aria-hidden />
      <div>
        <div className={styles.weatherTemp}>{state.max}° / {state.min}°</div>
        <div className={styles.weatherBody}>{WX_COPY[state.category][lang]}</div>
      </div>
    </div>
  )
}
