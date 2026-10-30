'use client'

/**
 * app/guia/[partner]/AgendaSection.tsx
 *
 * "Mientras estás aquí" / "While you're here" — what happens in the city DURING THE
 * GUEST'S STAY. It replaces the weekly section ("Every week in Mexico City") on guides
 * that opt in (demo.json guide.display.agenda) and can be switched off for all of them
 * with AGENDA_ENABLED (content/guia/agenda/config.ts).
 *
 * The stay window comes from ?llegada & ?noches (check-out day included); without a valid
 * pair it is today … today + 13 days. Tabs: "Your stay" + the check-out month + the next month
 * (a month with no visible event is left out). "Your stay": the featured event first, the dated
 * events (max 6, then "See all N →"), and an "All through your stay" group for events that cover
 * every night. Month tabs: compact rows. Recurring items are never rows of a tab: they have their own
 * group, "Every week in the city", right after the agenda. Weather sits inline in the header.
 *
 * Dates are computed IN THE BROWSER after mount (America/Mexico_City): pages are static,
 * so computing them at build time would freeze the window. Before mount only the header
 * renders.
 */

import { useEffect, useId, useMemo, useState } from 'react'
import type { Lang } from '../../../content/guia/types'
import type { Agenda } from '../../../content/guia/agenda/schema'
import { AGENDA_COPY } from '../../../content/guia/agenda/copy'
import { mexicoToday, monthTabs, stayTabRows, stayWindow, weeklyCards, type AgendaRow } from '../../../content/guia/agenda/logic'
import WeatherInline from './WeatherInline'
import styles from './guia.module.css'

/** Rows shown in the "Your stay" tab before "See all N →". */
const STAY_ROWS_SHOWN = 6

export interface AgendaSectionProps {
  lang: Lang
  agenda: Agenda
  /** Preview / local on /demo: also render events still "to_verify", each with a neutral "Por confirmar" pill. */
  showUnverified: boolean
  /** From the link (?llegada, ?noches), already validated by parseStay. */
  stay: { arrival?: string; nights?: number }
  /** Section background (alternating rhythm). */
  toneClass?: string
  onTrack?: (name: string, params: Record<string, string | number | boolean | undefined>) => void
}

export default function AgendaSection({ lang, agenda, showUnverified, stay, toneClass = '', onTrack }: AgendaSectionProps) {
  const c = AGENDA_COPY[lang]
  const uid = useId()
  const [today, setToday] = useState<string | null>(null)
  const [tab, setTab] = useState('stay')
  const [all, setAll] = useState(false)
  const [tripsOpen, setTripsOpen] = useState(false)

  useEffect(() => { setToday(mexicoToday()) }, [])

  const win = useMemo(() => (today ? stayWindow(stay, today) : null), [today, stay.arrival, stay.nights])
  const ctx = win && today ? { lang, today, showUnverified } : null
  const stayTab = ctx && win ? stayTabRows(agenda, win, ctx) : null
  const months = ctx && win ? monthTabs(agenda, win, ctx) : []
  const sig = win ? `${win.start}_${win.end}` : ''
  useEffect(() => { setTab('stay'); setAll(false) }, [sig])

  const tabs = [{ id: 'stay', label: c.tabStay }, ...months.map((m) => ({ id: m.id, label: m.label }))]
  const activeMonth = months.find((m) => m.id === tab)
  const current = activeMonth ? activeMonth.id : 'stay'

  const renderRow = (r: AgendaRow, compact = false) => {
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
          <a className={`${styles.agItem} ${styles.agItemLink} ${compact ? styles.agItemCompact : ''}`} href={r.url} target="_blank" rel="noopener noreferrer">
            {body}
            <span className={styles.agArrow} aria-hidden>↗</span>
            <span className={styles.agSr}>{c.officialSite}</span>
          </a>
        ) : (
          <div className={`${styles.agItem} ${compact ? styles.agItemCompact : ''}`}>{body}</div>
        )}
      </li>
    )
  }

  const stayRows = stayTab?.rows ?? []
  const shownStay = all ? stayRows : stayRows.slice(0, STAY_ROWS_SHOWN)

  return (
    <section id="aqui" className={`${styles.section} ${toneClass}`}>
      <div className={styles.container}>
        <div className={styles.secGrid}>
          <div className={styles.secHead}>
            <span className={styles.eyebrow}>{c.eyebrow}</span>
            <h2 className={styles.h2}>{c.title}</h2>
            <p className={styles.lede}>{c.subtitle}</p>
            <WeatherInline lang={lang} />
          </div>
          <div className={`${styles.secBody} ${styles.agBody}`}>
            {!ctx || !stayTab ? (
              <div className={styles.agSkeleton} aria-hidden />
            ) : (
              <>
                <div className={styles.agRanges} role="group" aria-label={c.rangesLabel}>
                  {tabs.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      aria-pressed={t.id === current}
                      className={`${styles.agChip} ${t.id === current ? styles.agChipActive : ''}`}
                      onClick={() => { setTab(t.id); onTrack?.('host_guide_agenda_tab', { tab: t.id }) }}
                    >{t.label}</button>
                  ))}
                </div>

                {current === 'stay' ? (
                  <>
                    {stayRows.length > 0 ? (
                      <ul className={styles.agList}>{shownStay.map((r) => renderRow(r))}</ul>
                    ) : stayTab.allThrough.length === 0 ? (
                      <div className={styles.agQuiet}>
                        <h3 className={styles.agQuietTitle}>{c.quietTitle}</h3>
                        <p className={styles.agQuietBody}>{c.quietBody}</p>
                      </div>
                    ) : null}
                    {stayRows.length > STAY_ROWS_SHOWN && !all && (
                      <button type="button" className={styles.practicalMore} onClick={() => { setAll(true); onTrack?.('host_guide_agenda_see_all', {}) }}>
                        {c.seeAll.replace('{n}', String(stayRows.length))}
                      </button>
                    )}
                    {stayTab.allThrough.length > 0 && (
                      <div className={styles.agThrough}>
                        <h3 className={styles.agThroughTitle}>{c.allThrough}</h3>
                        <ul className={styles.agThroughList}>
                          {stayTab.allThrough.map((l) => (
                            <li key={l.id}>
                              {l.url ? (
                                <a href={l.url} target="_blank" rel="noopener noreferrer">
                                  {l.title}{l.area ? ` · ${l.area}` : ''}<span className={styles.agSr}> — {c.officialSite}</span>
                                </a>
                              ) : (
                                <span>{l.title}{l.area ? ` · ${l.area}` : ''}</span>
                              )}
                              {l.toVerify && <span className={styles.agPill}>{c.toConfirm}</span>}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                ) : (
                  <ul className={styles.agList}>{activeMonth!.rows.map((r) => renderRow(r, true))}</ul>
                )}

                <div className={styles.agWeeklyWrap}>
                  <h3 className={styles.agWeeklyTitle}>{c.weeklyTitle}</h3>
                  <ul className={styles.agWeekly}>
                    {weeklyCards(agenda, lang).map((w) => (
                      <li className={styles.agWeeklyCard} key={w.id}>
                        <span className={styles.agItemTime}>{w.when}</span>
                        <span className={styles.agItemTitle}>{w.title}</span>
                        <span className={styles.agItemMeta}>{w.line}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={styles.agButtons}>
                  {agenda.dayTrips.length > 0 && (
                    <button
                      type="button"
                      className={styles.agBtn}
                      aria-expanded={tripsOpen}
                      aria-controls={`${uid}-trips`}
                      onClick={() => { setTripsOpen((o) => !o); if (!tripsOpen) onTrack?.('host_guide_agenda_panel', { panel: 'trips' }) }}
                    >{c.trips}</button>
                  )}
                </div>

                {tripsOpen && (
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
