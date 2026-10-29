'use client'

/**
 * app/guia/[partner]/AgendaSection.tsx
 *
 * "Mientras estás aquí" / "While you're here" — what happens in the city DURING THE
 * GUEST'S STAY. It replaces the weekly section ("Every week in Mexico City") on guides
 * that opt in (demo.json guide.display.agenda) and can be switched off for all of them
 * with AGENDA_ENABLED (content/guia/agenda/config.ts).
 *
 * The stay window comes from ?llegada & ?noches (check-out day included); without a
 * valid pair it is today … today + 13 days. The window is cut into calendar weeks
 * (Mon–Sun) shown as date-only chips; each chip lists, in one list, the dated events that
 * overlap it plus every occurrence of the weekly things. Below: two buttons that open "Próximamente en {mes}" (the whole month) and the day trips.
 *
 * Dates are computed IN THE BROWSER after mount (America/Mexico_City): pages are static,
 * so computing them at build time would freeze the window. Before mount only the header
 * renders. Reuses SectionHead, WeatherCard (kept above the section, unchanged) and the
 * guide's tokens / DM Mono; the chips have their own classes so the guide's filter-chip count stays comparable.
 */

import { useEffect, useId, useMemo, useState } from 'react'
import type { Lang } from '../../../content/guia/types'
import type { Agenda } from '../../../content/guia/agenda/schema'
import { AGENDA_COPY } from '../../../content/guia/agenda/copy'
import { aheadLabel, aheadRows, formatRange, mexicoToday, rowsForRange, splitRanges, stayWindow, type AgendaRow } from '../../../content/guia/agenda/logic'
import SectionHead from './SectionHead'
import WeatherCard from './WeatherCard'
import styles from './guia.module.css'

type Panel = 'ahead' | 'trips' | null

export interface AgendaSectionProps {
  lang: Lang
  agenda: Agenda
  /** Preview / local on /demo: also render events still "to_verify", each with a neutral "Por confirmar" pill. */
  showUnverified: boolean
  /** From the link (?llegada, ?noches), already validated by parseStay. */
  stay: { arrival?: string; nights?: number }
  onTrack?: (name: string, params: Record<string, string | number | boolean | undefined>) => void
}

export default function AgendaSection({ lang, agenda, showUnverified, stay, onTrack }: AgendaSectionProps) {
  const c = AGENDA_COPY[lang]
  const uid = useId()
  const [today, setToday] = useState<string | null>(null)
  const [sel, setSel] = useState(0)
  const [panel, setPanel] = useState<Panel>(null)

  useEffect(() => { setToday(mexicoToday()) }, [])

  const win = useMemo(() => (today ? stayWindow(stay, today) : null), [today, stay.arrival, stay.nights])
  const ranges = useMemo(() => (win ? splitRanges(win.start, win.end) : []), [win])
  const sig = ranges.map((r) => `${r.start}_${r.end}`).join('|')
  useEffect(() => { setSel(0); setPanel(null) }, [sig])

  const ctx = win && today ? { lang, today, showUnverified, window: win } : null
  const range = ranges[Math.min(sel, ranges.length - 1)]
  const rows = ctx && range ? rowsForRange(agenda, range, ctx) : []
  const ahead = ctx && win ? aheadRows(agenda, win, { lang, today: ctx.today, showUnverified }) : []

  const renderRow = (r: AgendaRow) => {
    const body = (
      <>
        <span className={styles.agItemDate}>
          <span>{r.dateLabel}</span>
          {r.time && <span className={styles.agItemTime}>{r.time}</span>}
        </span>
        <span className={styles.agItemBody}>
          <span className={styles.agItemTitle}>{r.title}</span>
          <span className={styles.agItemMeta}>{r.meta}</span>
          {r.afterStay && <span className={styles.agItemTime}>{c.afterStay}</span>}
          {r.toVerify && <span className={styles.agPill}>{c.toConfirm}</span>}
        </span>
      </>
    )
    return (
      <li key={r.id}>
        {r.url ? (
          <a className={`${styles.agItem} ${styles.agItemLink}`} href={r.url} target="_blank" rel="noopener noreferrer">
            {body}
            <span className={styles.agArrow} aria-hidden>↗</span>
            <span className={styles.agSr}>{c.officialSite}</span>
          </a>
        ) : (
          <div className={styles.agItem}>{body}</div>
        )}
      </li>
    )
  }

  const toggle = (next: Exclude<Panel, null>) => {
    setPanel((p) => (p === next ? null : next))
    if (panel !== next) onTrack?.('host_guide_agenda_panel', { panel: next })
  }

  return (
    <section className={`${styles.section} ${styles.sectionAlt}`} style={{ paddingTop: 88, paddingBottom: 88 }}>
      <div className={styles.container}>
        <WeatherCard lang={lang} />
        <div className={styles.secGrid}>
          <SectionHead eyebrow={c.eyebrow} title={c.title} lede={c.subtitle} />
          <div className={styles.secBody}>
            {!ctx ? (
              <div className={styles.agSkeleton} aria-hidden />
            ) : (
              <>
                <div className={styles.agRanges} role="group" aria-label={c.rangesLabel}>
                  {ranges.map((r, i) => (
                    <button
                      key={sig + i}
                      type="button"
                      aria-pressed={i === sel}
                      className={`${styles.agChip} ${i === sel ? styles.agChipActive : ''}`}
                      onClick={() => { setSel(i); onTrack?.('host_guide_agenda_range', { index: i }) }}
                    >{formatRange(r, lang)}</button>
                  ))}
                </div>

                {rows.length > 0 ? (
                  <ul className={styles.agList}>{rows.map(renderRow)}</ul>
                ) : (
                  <div className={styles.agQuiet}>
                    <h3 className={styles.agQuietTitle}>{c.quietTitle}</h3>
                    <p className={styles.agQuietBody}>{c.quietBody}</p>
                  </div>
                )}

                <div className={styles.agButtons}>
                  {ahead.length > 0 && (
                    <button type="button" className={styles.agBtn} aria-expanded={panel === 'ahead'} aria-controls={`${uid}-ahead`} onClick={() => toggle('ahead')}>{aheadLabel(win!, today!, lang)}</button>
                  )}
                  {agenda.dayTrips.length > 0 && (
                    <button type="button" className={styles.agBtn} aria-expanded={panel === 'trips'} aria-controls={`${uid}-trips`} onClick={() => toggle('trips')}>{c.trips}</button>
                  )}
                </div>

                {panel === 'ahead' && ahead.length > 0 && <ul id={`${uid}-ahead`} className={styles.agList}>{ahead.map(renderRow)}</ul>}
                {panel === 'trips' && (
                  <ul id={`${uid}-trips`} className={styles.agList}>
                    {agenda.dayTrips.map((d) => (
                      <li key={d.id}>
                        <div className={styles.agItem}>
                          <span className={styles.agItemDate}><span>{d.length[lang]}</span></span>
                          <span className={styles.agItemBody}>
                            <span className={styles.agItemTitle}>{d.title[lang]}</span>
                            <span className={styles.agItemMeta}>{d.why[lang]}</span>
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
