'use client'

/**
 * components/guides/GuidePageClientV2.tsx
 *
 * Guide page shell — two-column layout matching the prototype exactly.
 *
 * Left column:  Itinerary → Hotels → Experiences
 * Right column (sticky): Tips → PlanCTA → Checklist → Transport
 *
 * Handles:
 *  - Toast notifications (shared across child components)
 *  - Save / Share hero actions
 *  - Planner URL construction per locale
 */

import { useState, useCallback, useEffect } from 'react'

import { GuideHero }               from './GuideHero'
import { Itinerary }               from './Itinerary'
import { HotelsSection }           from './HotelsSection'
import { ExperiencesSection }      from './ExperiencesSection'
import { Tips }                    from './RightColumn/Tips'
import { PlanCTA }                 from './RightColumn/PlanCTA'
import { Checklist }               from './RightColumn/Checklist'
import { Transport }               from './RightColumn/Transport'
import { CuratedGuideShareModal }  from './CuratedGuideShareModal'
import type { GuideShare }         from './CuratedGuideShareModal'

import type { GuidePageData } from '../../lib/data/guides/types'
import { ROUTE_MAP }          from '../../lib/routes'

// ── Analytics placeholder ──────────────────────────────────────────────────────
// Replace with your analytics provider (GA4, Amplitude, Mixpanel, etc.)
function trackGuideView(slug: string, locale: string) {
  if (process.env.NODE_ENV === 'development') {
    console.log('[analytics] guide_view', { slug, locale })
  }
}

// ── Props ──────────────────────────────────────────────────────────────────────

interface Props {
  data: GuidePageData
  locale: string
  alternateLocaleUrl?: string
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function buildPlannerHref(slug: string, locale: string): string {
  const plannerPath = ROUTE_MAP.planner[locale as 'es' | 'en'] ?? 'planificador'
  const paramKey = locale === 'en' ? 'destination' : 'destino'
  return `/${locale}/${plannerPath}?${paramKey}=${encodeURIComponent(slug)}`
}

// ── Toast ──────────────────────────────────────────────────────────────────────

function useToast() {
  const [message, setMessage] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)

  const show = useCallback((msg: string) => {
    setMessage(msg)
    setVisible(true)
    const timer = setTimeout(() => setVisible(false), 2500)
    return () => clearTimeout(timer)
  }, [])

  return { message, visible, show }
}

// ── Component ──────────────────────────────────────────────────────────────────

export function GuidePageClientV2({ data, locale, alternateLocaleUrl }: Props) {
  const toast       = useToast()
  const plannerHref = buildPlannerHref(data.slug, locale)
  const [shareOpen, setShareOpen] = useState(false)

  // Analytics: fire on mount
  useEffect(() => {
    trackGuideView(data.slug, locale)
  }, [data.slug, locale])

  const handleSave = () => {
    toast.show(locale === 'en' ? '✓ Guide saved' : '✓ Guía guardada')
  }

  const handleShare = () => setShareOpen(true)

  // Build the GuideShare object from GuidePageData
  const guideShare: GuideShare = {
    title:    data.hero.title,
    subtitle: data.hero.subtitle,
    tags:     data.hero.chips,
    days:     data.itinerary.days.map(d => ({ day: d.dayNumber, title: d.title })),
    shareUrl: typeof window !== 'undefined' ? window.location.href : '',
  }

  const handlePdf = () => {
    toast.show(locale === 'en' ? '📄 Generating PDF…' : '📄 Generando PDF…')
    setTimeout(() => window.print(), 300)
  }

  const checklistDone =
    locale === 'en'
      ? `✓ All packed for ${data.hero.title}`
      : `✓ Todo listo para ${data.hero.title}`

  return (
    <div className="bg-[#FFF9F3] min-h-screen pt-[100px]">

      {/* Hidden input consumed by Nav locale switcher */}
      {alternateLocaleUrl && (
        <input type="hidden" id="__alternate_locale_url" value={alternateLocaleUrl} />
      )}

      {/* ── Hero ── */}
      <GuideHero
        data={data.hero}
        slug={data.slug}
        plannerHref={plannerHref}
        onSave={handleSave}
        onShare={handleShare}
        onPdf={handlePdf}
      />

      {/* ── Main two-column layout ── */}
      <div className="max-w-[1200px] mx-auto px-8 max-[768px]:px-5">
        <div className="grid grid-cols-[1fr_320px] gap-12 py-12 pb-20 items-start max-[960px]:grid-cols-1 max-[960px]:gap-10">

          {/* ── Left column ── */}
          <div>
            <Itinerary data={data.itinerary} locale={locale} />
            <HotelsSection data={data.hotels} locale={locale} onToast={toast.show} />
            <ExperiencesSection data={data.experiences} onToast={toast.show} />
          </div>

          {/* ── Right column (sticky) ── */}
          <div className="flex flex-col gap-5 sticky top-20 max-[960px]:static">
            <Tips data={data.tips} />
            <PlanCTA data={data.planCta} plannerHref={plannerHref} />
            <Checklist
              data={data.checklist}
              onToast={toast.show}
              completionMessage={checklistDone}
            />
            <Transport data={data.transport} />
          </div>

        </div>

        {/* ── PRINT FOOTER — logo, shown only in PDF/print ─── */}
        <div className="hidden print:flex items-center justify-center gap-3 mt-10 pt-6 border-t border-[#E4DFD8]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="Lagomplan" className="h-8 w-auto opacity-75" />
        </div>
      </div>

      {/* ── Toast ── */}
      <div
        role="status"
        aria-live="polite"
        className="fixed bottom-8 left-1/2 font-mono text-[12px] font-medium tracking-[.06em] text-white bg-[#0F3A33] px-5 py-2.5 rounded-full shadow-[0_8px_24px_rgba(15,58,51,.25)] pointer-events-none z-[9999] transition-all duration-250"
        style={{
          transform: `translateX(-50%) translateY(${toast.visible ? '0' : '12px'})`,
          opacity: toast.visible ? 1 : 0,
        }}
      >
        {toast.message}
      </div>

      {/* ── Share modal ── */}
      <CuratedGuideShareModal
        guide={guideShare}
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
      />

    </div>
  )
}
