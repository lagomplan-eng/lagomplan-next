'use client'

/**
 * components/guides/GuideNav.tsx
 *
 * Sticky pill navigation for the guide detail page.
 * Smooth-scrolls to each section and tracks the active section via IntersectionObserver.
 */

import { useEffect, useRef, useState } from 'react'
import type { Locale } from '../../i18n'

interface NavItem {
  id:    string
  es:    string
  en:    string
}

const NAV_ITEMS: NavItem[] = [
  { id: 'itinerario',   es: 'Itinerario',   en: 'Itinerary'   },
  { id: 'hoteles',      es: 'Hoteles',       en: 'Hotels'      },
  { id: 'experiencias', es: 'Experiencias',  en: 'Experiences' },
  { id: 'logistica',    es: 'Logística',     en: 'Logistics'   },
  { id: 'tips',         es: 'Tips',          en: 'Tips'        },
]

interface Props {
  locale: Locale
}

export function GuideNav({ locale }: Props) {
  const isES = locale === 'es'
  const [active, setActive] = useState<string>('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ids = NAV_ITEMS.map(n => n.id)
    const observers: IntersectionObserver[] = []

    ids.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id) },
        { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach(o => o.disconnect())
  }, [])

  function scrollTo(id: string) {
    const el = document.getElementById(id)
    if (!el) return
    const offset = 72 // nav height
    const top = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: 'smooth' })
    setActive(id)
  }

  return (
    <div
      className="sticky top-[64px] z-30 border-b"
      style={{ background: '#FAF8F5', borderColor: 'rgba(200,191,181,0.5)' }}
    >
      <div
        ref={scrollRef}
        className="max-w-[900px] mx-auto px-7 py-2.5 flex items-center gap-2 overflow-x-auto scrollbar-none"
      >
        {NAV_ITEMS.map(item => {
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="whitespace-nowrap font-mono text-[10px] font-medium tracking-[.08em] uppercase px-3.5 py-[7px] rounded-full transition-all flex-shrink-0"
              style={
                isActive
                  ? { background: '#0F3A33', color: '#fff', border: '1px solid #0F3A33' }
                  : { background: 'transparent', color: '#7A7A76', border: '1px solid #CEC8C0' }
              }
            >
              {isES ? item.es : item.en}
            </button>
          )
        })}
      </div>
    </div>
  )
}
