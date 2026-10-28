'use client'

/**
 * app/guia/[partner]/AgendaSection.tsx
 *
 * "Mientras estás aquí" / "While you're here" — the dated city agenda. It
 * replaces the weekly section ("Every week in Mexico City") on guides that opt
 * in (demo.json guide.display.agenda); the live WeatherCard stays above it and
 * the weekly items live on in the "Siempre en la ciudad" pill.
 *
 * Collapsed by default. Open: pills (this month · next month · spare day ·
 * always), then the host pick. Everything reuses the guide's own pieces:
 * SectionHead, WeatherCard, the filterChip pills, the experience card image +
 * details typography, the weekly rows, withPlaceholders.
 *
 * Dates are computed IN THE BROWSER after mount (America/Mexico_City): the page
 * is statically generated, so computing "this month" at build time would freeze
 * it. Before mount only the closed header renders (summary reserved, empty).
 * Unverified events render only when `showUnverified` (Preview / local), each
 * with the existing "Por confirmar" pill; Production gets verified ones only.
 */

import { useEffect, useId, useState, type ReactNode } from 'react'
import { Moon } from 'lucide-react'
import type { Lang, TodayItem } from '../../../content/guia/types'
import type { Agenda, AgendaEvent, Category } from '../../../content/guia/agenda/schema'
import { AGENDA_COPY, type AgendaCopy } from '../../../content/guia/agenda/copy'
import { addMonths, mexicoToday, monthPlans, monthTabLabel, shortMonth, summaryLine, type MonthPlans } from '../../../content/guia/agenda/logic'
import SectionHead from './SectionHead'
import WeatherCard from './WeatherCard'
import { withPlaceholders } from './placeholders'
import styles from './guia.module.css'

const COLLAPSED_LIMIT = 4

type TabId = 'm0' | 'm1' | 'trips' | 'always'

export interface AgendaSectionProps {
  lang: Lang
  agenda: Agenda
  /** Preview / local: also render events still "to_verify". Production: verified only. */
  showUnverified: boolean
  /** The city's recurring weekly items (already interpolated): the "Siempre en la ciudad" pill. */
  alwaysItems: TodayItem[]
  hostName: string
  /** The operator's logo node (GuiaClient passes its BrandLogo). Missing → highlighted placeholder. */
  hostLogo?: ReactNode
  hostPick?: Partial<Record<Lang, string>>
  onTrack?: (name: string, params: Record<string, string | number | boolean | undefined>) => void
}

const catLabel = (c: AgendaCopy, cat: Category) => ({ food: c.catFood, culture: c.catCulture, sport: c.catSport, outdoors: c.catOutdoors })[cat]

function DateBlock({ e, lang }: { e: AgendaEvent; lang: Lang }) {
  const multi = e.end !== e.start
  return (
    <div className={styles.agDate}>
      <span className={styles.agDay}>{Number(e.start.slice(8))}</span>
      <span className={styles.agMon}>{shortMonth(e.start, lang)}</span>
      {multi && <span className={styles.agMon}>→ {Number(e.end.slice(8))} {shortMonth(e.end, lang)}</span>}
    </div>
  )
}

export default function AgendaSection({ lang, agenda, showUnverified, alwaysItems, hostName, hostLogo, hostPick, onTrack }: AgendaSectionProps) {
  const c = AGENDA_COPY[lang]
  const panelId = useId()
  const [today, setToday] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [tab, setTab] = useState<TabId>('m0')
  const [openId, setOpenId] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => { setToday(mexicoToday()) }, [])

  const ym0 = today ? today.slice(0, 7) : null
  const ym1 = ym0 ? addMonths(ym0, 1) : null
  const m0 = today && ym0 ? monthPlans(agenda, ym0, today, showUnverified) : null
  const m1 = today && ym1 ? monthPlans(agenda, ym1, today, showUnverified) : null

  const pick = (next: TabId) => {
    setTab(next); setOpenId(null); setShowAll(false)
    onTrack?.('host_guide_agenda_tab', { tab: next })
  }

  const renderMonth = (m: MonthPlans) => {
    if (m.total === 0) {
      return (
        <div className={`${styles.insiderCard} ${styles.agEmpty}`}>
          <Moon size={32} color="var(--sage)" strokeWidth={1.5} aria-hidden />
          <h3 className={styles.agEmptyTitle}>{c.emptyTitle}</h3>
          <p className={styles.agBody}>{c.emptyBody}</p>
          <button type="button" className={styles.agBtn} onClick={() => pick('trips')}>{c.emptyCta}</button>
        </div>
      )
    }
    const shown = showAll ? m.compact : m.compact.slice(0, COLLAPSED_LIMIT)
    return (
      <div className={styles.agList}>
        {m.featured && (
          <article className={styles.expCard}>
            <div className={`${styles.expImg} ${styles.expImgPlaceholder} ${styles.agFeaturedImg}`}>
              <mark className={styles.placeholder}>{c.photo}</mark>
              <span className={styles.agBadge}>{c.featuredBadge}</span>
            </div>
            <div className={styles.expBody}>
              <div className={styles.expTextBlock}>
                <span className={styles.agFeaturedDate}>{m.featured.dateLabel[lang]}</span>
                <h3 className={styles.agFeaturedTitle}>{m.featured.title[lang]}</h3>
                <p className={styles.agBody}>{withPlaceholders(m.featured.why[lang])}</p>
                {m.featured.status === 'to_verify' && <span className={styles.agPill}>{withPlaceholders(c.toConfirm)}</span>}
              </div>
              <div className={styles.expActions}>
                <a className={styles.link} href={m.featured.url} target="_blank" rel="noopener noreferrer">{c.official}</a>
              </div>
            </div>
          </article>
        )}
        {shown.map((e) => {
          const open = openId === e.id
          const title = e.title[lang]
          const detailsId = `${panelId}-${e.id}`
          return (
            <article className={styles.agCard} key={e.id}>
              <div className={styles.agRow}>
                <DateBlock e={e} lang={lang} />
                <div className={styles.agText}>
                  <h4 className={styles.agTitle}>{title}</h4>
                  <span className={styles.agMeta}>{catLabel(c, e.category)} · {withPlaceholders(e.place[lang])}</span>
                  {e.status === 'to_verify' && <span className={styles.agPill}>{withPlaceholders(c.toConfirm)}</span>}
                </div>
                <button
                  type="button"
                  className={styles.agPlus}
                  aria-expanded={open}
                  aria-controls={detailsId}
                  aria-label={`${open ? c.detailsHide : c.detailsShow} ${title}`}
                  onClick={() => { setOpenId(open ? null : e.id); if (!open) onTrack?.('host_guide_agenda_details', { event: e.id }) }}
                >{open ? '–' : '+'}</button>
              </div>
              {open && (
                <div id={detailsId} className={styles.expDetailsInner}>
                  <p className={styles.expDetailText}>{withPlaceholders(e.why[lang])}</p>
                  <p className={styles.expDetailLabel}>{c.dates}</p>
                  <p className={styles.expDetailText}>{e.dateLabel[lang]}</p>
                  <p className={styles.expDetailLabel}>{c.hours}</p>
                  <p className={styles.expDetailText}>{withPlaceholders(e.hours[lang])}</p>
                  {e.cost && (
                    <>
                      <p className={styles.expDetailLabel}>{c.cost}</p>
                      <p className={styles.expDetailText}>{withPlaceholders(e.cost[lang])}</p>
                    </>
                  )}
                  <p className={styles.expDetailText}>
                    <a className={styles.link} href={e.url} target="_blank" rel="noopener noreferrer">{c.official}</a>
                  </p>
                </div>
              )}
            </article>
          )
        })}
        {m.compact.length > COLLAPSED_LIMIT && (
          <button type="button" className={styles.agBtn} onClick={() => { setShowAll((v) => !v); setOpenId(null) }}>
            {showAll ? c.showLess : c.showAll.replace('{n}', String(m.total))}
          </button>
        )}
      </div>
    )
  }

  const tabs: { id: TabId; label: string }[] = m0 && m1 && ym0 && ym1
    ? [
        { id: 'm0', label: monthTabLabel(ym0, lang) },
        { id: 'm1', label: monthTabLabel(ym1, lang) },
        { id: 'trips', label: c.tabTrips },
        { id: 'always', label: c.tabAlways },
      ]
    : []

  return (
    <section className={`${styles.section} ${styles.sectionAlt}`} style={{ paddingTop: 88, paddingBottom: 88 }}>
      <div className={styles.container}>
        <div className={styles.secGrid}>
          <SectionHead eyebrow={c.eyebrow} title={c.title} lede={c.subtitle} />
          <div className={styles.secBody}>
            <WeatherCard lang={lang} />
            <button
              type="button"
              className={styles.agToggle}
              aria-expanded={expanded}
              aria-controls={panelId}
              onClick={() => { setExpanded((v) => !v); onTrack?.('host_guide_agenda_toggle', { open: !expanded }) }}
            >
              <span className={styles.agToggleText}>
                <span className={styles.agToggleLabel}>{expanded ? c.close : c.open}</span>
                <span className={styles.agSummary}>{m0 && m1 ? summaryLine(m0, m1, lang, c) : ''}</span>
              </span>
              <span className={styles.agSign} aria-hidden>{expanded ? '–' : '+'}</span>
            </button>

            {expanded && m0 && m1 && (
              <div id={panelId} className={styles.agPanel}>
                <div className={styles.filterChips} role="group" aria-label={c.title}>
                  {tabs.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      aria-pressed={tab === t.id}
                      className={`${styles.filterChip} ${styles.agChip} ${tab === t.id ? styles.filterChipActive : ''}`}
                      onClick={() => pick(t.id)}
                    >{t.label}</button>
                  ))}
                </div>

                {tab === 'm0' && renderMonth(m0)}
                {tab === 'm1' && renderMonth(m1)}

                {tab === 'trips' && (
                  <div className={styles.agList}>
                    {agenda.dayTrips.map((d) => (
                      <article className={`${styles.agCard} ${styles.agTrip}`} key={d.id}>
                        <div className={`${styles.agThumb} ${styles.expImgPlaceholder}`}><mark className={styles.placeholder}>{c.photo}</mark></div>
                        <div className={styles.agText}>
                          <span className={styles.agTripLength}>{d.length[lang]}</span>
                          <h4 className={styles.agTitle}>{d.title[lang]}</h4>
                          <p className={styles.agBody}>{withPlaceholders(d.why[lang])}</p>
                          {d.url
                            ? <a className={styles.link} href={d.url} target="_blank" rel="noopener noreferrer">{c.official}</a>
                            : <span>{withPlaceholders(c.link)}</span>}
                        </div>
                      </article>
                    ))}
                  </div>
                )}

                {tab === 'always' && (
                  <div className={styles.spotList}>
                    {alwaysItems.map((ti, i) => (
                      <div className={styles.todayRow} key={i}>
                        <span className={`${styles.eyebrowMono} ${styles.tag}`}>{ti.tag}</span>
                        <div>
                          <div className={styles.todayTitle}>{ti.title}</div>
                          <div className={styles.todayBody}>{ti.body}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <article className={styles.insiderCard}>
                  <div className={styles.agHostHead}>
                    {hostLogo ?? <mark className={styles.placeholder}>[logo]</mark>}
                    <div className={styles.agText}>
                      <span className={`${styles.eyebrowMono} ${styles.agHostLabel}`}>{c.hostPickLabel}</span>
                      <span className={styles.agTitle}>{hostName}</span>
                    </div>
                  </div>
                  <p className={styles.agBody}>{withPlaceholders(hostPick?.[lang] ?? c.hostPickMissing)}</p>
                </article>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
