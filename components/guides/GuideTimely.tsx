'use client'

/**
 * components/guides/GuideTimely.tsx
 *
 * The dated block at the bottom of a guide (verified-on note, essentials, "when to go" calendar,
 * dated booking links). It is rendered only while it is current: the date is checked in the
 * BROWSER (America/Mexico_City) after mount, because guide pages are static and a build-time check
 * would freeze. Before mount, and after `validUntil`, nothing renders.
 */

import { useEffect, useState } from 'react'
import type { FlatTimely } from '../../lib/data/guides/types'
import { activeTimely, mexicoToday } from '../../lib/data/guides/timely'

export function GuideTimely({ data }: { data: FlatTimely }) {
  const [today, setToday] = useState<string | null>(null)
  useEffect(() => { setToday(mexicoToday()) }, [])

  const t = today ? activeTimely(data, today) : undefined
  if (!t) return null

  return (
    <section
      data-guide="timely"
      aria-labelledby="guide-timely-title"
      className="bg-white border border-[#E4DFD8] rounded-[18px] overflow-hidden shadow-[0_1px_2px_rgba(15,58,51,.05)] mb-10"
    >
      <div className="px-6 pt-5 pb-4">
        <div className="font-mono text-[9px] font-medium tracking-[.12em] uppercase text-[#B8B5AF] mb-[5px]">{t.eyebrow}</div>
        <h2 id="guide-timely-title" className="font-sans font-bold text-[#0F3A33] leading-[1.1] tracking-[-0.4px]" style={{ fontSize: 'clamp(16px, 2.2vw, 20px)' }}>
          {t.title}
        </h2>
        <p className="mt-2 font-mono text-[11px] leading-[1.6] text-[#6B8F86]">{t.verifiedNote}</p>
      </div>
      <div className="border-t border-[#E4DFD8]" />

      <div className="px-6 pt-4 pb-5 font-sans text-[14px] leading-[1.8] text-[#4A4A46]">
        {t.essentials && t.essentials.length > 0 && (
          <div className="mb-5">
            {t.essentialsTitle && <h3 className="font-sans font-bold text-[15px] text-[#0F3A33] mb-1.5">{t.essentialsTitle}</h3>}
            <ul className="list-disc pl-5 space-y-1">
              {t.essentials.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          </div>
        )}

        <h3 className="font-sans font-bold text-[15px] text-[#0F3A33] mb-1.5">{t.whenTitle}</h3>
        {t.whenIntro && <p className="mb-2">{t.whenIntro}</p>}
        {t.window && <p className="mb-3 font-medium text-[#0F3A33]">{t.window}</p>}

        {t.table && t.table.rows.length > 0 && (
          <div className="border border-[#E4DFD8] rounded-[12px] overflow-hidden">
            <div className="hidden md:grid grid-cols-[1.1fr_1.1fr_1.6fr] gap-4 px-4 py-2.5 bg-[#FFF9F3] font-mono text-[10px] tracking-[.08em] uppercase text-[#6B8F86]">
              {t.table.headers.map((h) => <div key={h}>{h}</div>)}
            </div>
            <ul>
              {t.table.rows.map((r, i) => (
                <li key={i} className="grid grid-cols-1 md:grid-cols-[1.1fr_1.1fr_1.6fr] gap-x-4 gap-y-1 px-4 py-3 border-t border-[#E4DFD8] first:border-t-0 md:first:border-t">
                  <div className="font-medium text-[#0F3A33]">{r.what}</div>
                  <div>{r.when}</div>
                  <div className="text-[#4A4A46]">{r.impact}</div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {t.booking && t.booking.links.length > 0 && (
          <p className="mt-4">
            <span className="font-medium text-[#0F3A33]">{t.booking.label} </span>
            {t.booking.links.map((l, i) => (
              <span key={l.url}>
                {i > 0 && ' · '}
                <a href={l.url} target="_blank" rel="noopener noreferrer sponsored" className="text-[#0F3A33] underline underline-offset-2 decoration-[#6B8F86]/60 hover:decoration-[#0F3A33]">{l.name}</a>
              </span>
            ))}
          </p>
        )}
      </div>
    </section>
  )
}
