'use client'

/**
 * app/guia/[partner]/AgendaSection.tsx
 *
 * "Mientras estás aquí" / "While you're here" — what happens in the city this month and the next.
 * It replaces the weekly section ("Every week in Mexico City") on guides that opt in
 * (demo.json guide.display.agenda) and can be switched off for all of them with AGENDA_ENABLED
 * (content/guia/agenda/config.ts).
 *
 * Tabs: the current month + the next one (a month with no visible event is left out); each lists
 * its events from today on as compact rows. Recurring items are never rows of a tab: "Every week
 * in the city" and "Day trips" are two groups right after the agenda, in the same card layout.
 * Weather sits inline in the header.
 *
 * Dates are computed IN THE BROWSER after mount (America/Mexico_City): pages are static,
 * so computing them at build time would freeze the month. Before mount only the header renders.
 */

import { useEffect, useMemo, useState } from 'react'
import type { Lang } from '../../../content/guia/types'
import type { Agenda } from '../../../content/guia/agenda/schema'
import { AGENDA_COPY } from '../../../content/guia/agenda/copy'
import { mexicoToday, monthTabs, weeklyCards, type AgendaRow } from '../../../content/guia/agenda/logic'
import WeatherInline from './WeatherInline'
import styles from './guia.module.css'

export interface AgendaSectionProps {
  lang: Lang
  agenda: Agenda
  /** Preview / local on /demo: also render events still "to_verify", each with a neutral "Por confirmar" pill. */
  showUnverified: boolean
  /** Section background (alternating rhythm). */
  toneClass?: string
  onTrack?: (name: string, params: Record<string, string | number | boolean | undefined>) => void
}

export default function AgendaSection({ lang, agenda, showUnverified, toneClass = '', onTrack }: AgendaSectionProps) {
  const c = AGENDA_COPY[lang]
  const [today, setToday] = useState<string | null>(null)
  const [tab, setTab] = useState('')

  useEffect(() => { setToday(mexicoToday()) }, [])

  const months = useMemo(() => (today ? monthTabs(agenda, { lang, today, showUnverified }) : []), [agenda, lang, today, showUnverified])
  const active = months.find((m) => m.id === tab) ?? months[0]

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
          {r.toVerify && <span className={styles.agPill}>{c.toConfirm}</span>}
        </span>
      </>
    )
    return (
      <li key={r.id}>
        {r.url ? (
          <a className={`${styles.agItem} ${styles.agItemLink} ${styles.agItemCompact}`} href={r.url} target="_blank" rel="noopener noreferrer">
            {body}
            <span className={styles.agArrow} aria-hidden>↗</span>
            <span className={styles.agSr}>{c.officialSite}</span>
          </a>
        ) : (
          <div className={`${styles.agItem} ${styles.agItemCompact}`}>{body}</div>
        )}
      </li>
    )
  }

  /** "Every week in the city" and "Day trips" share this layout: a small title over a row of cards. */
  const renderCards = (title: string, cards: { id: string; when: string; title: string; line: string }[]) => (
    <div className={styles.agGroup}>
      <h3 className={styles.agGroupTitle}>{title}</h3>
      <ul className={styles.agCards}>
        {cards.map((w) => (
          <li className={styles.agCard} key={w.id}>
            <span className={styles.agItemTime}>{w.when}</span>
            <span className={styles.agItemTitle}>{w.title}</span>
            <span className={styles.agItemMeta}>{w.line}</span>
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <section id="aqui" className={`${styles.section} ${styles.rhythm} ${toneClass}`}>
      <div className={styles.container}>
        <div className={styles.secGrid}>
          <div className={styles.secHead}>
            <span className={styles.eyebrow}>{c.eyebrow}</span>
            <h2 className={styles.h2}>{c.title}</h2>
            <p className={styles.lede}>{c.subtitle}</p>
            <WeatherInline lang={lang} />
          </div>
          <div className={`${styles.secBody} ${styles.agBody}`}>
            {!today ? (
              <div className={styles.agSkeleton} aria-hidden />
            ) : (
              <>
                {active ? (
                  <>
                    <div className={styles.agRanges} role="group" aria-label={c.rangesLabel}>
                      {months.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          aria-pressed={m.id === active.id}
                          className={`${styles.agChip} ${m.id === active.id ? styles.agChipActive : ''}`}
                          onClick={() => { setTab(m.id); onTrack?.('host_guide_agenda_tab', { tab: m.id }) }}
                        >{m.label}</button>
                      ))}
                    </div>
                    <ul className={styles.agList}>{active.rows.map(renderRow)}</ul>
                  </>
                ) : (
                  <div className={styles.agQuiet}>
                    <h3 className={styles.agQuietTitle}>{c.quietTitle}</h3>
                    <p className={styles.agQuietBody}>{c.quietBody}</p>
                  </div>
                )}

                {renderCards(c.weeklyTitle, weeklyCards(agenda, lang))}
                {agenda.dayTrips.length > 0 && renderCards(c.tripsTitle, agenda.dayTrips.map((d) => ({ id: d.id, when: d.length[lang], title: d.title[lang], line: d.why[lang] })))}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
