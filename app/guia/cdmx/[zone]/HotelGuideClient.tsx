'use client'

/**
 * app/guia/cdmx/[zone]/HotelGuideClient.tsx
 *
 * The hotel edition of the neighborhood guide. Driven entirely by the edition config
 * (content/guia/hotel/config.ts): which blocks render, in what order, which practical items show. It reuses the
 * Livin guide's stylesheet and small shared pieces but never touches GuiaClient, so Livin and demo cannot change.
 *
 * Tracking: section_open per block and outbound_click per link go to /api/hotels/event (only when the URL carries
 * a hotel code, ?h=); GA4 partner_link_click keeps firing with the hotel code as partner_slug and only reaches
 * Google after consent (Consent Mode, see app/guia/layout.tsx). No lagom_ref, no guide_visits insert, no guest data.
 */

import { useEffect, useMemo, useState } from 'react'
import type { City, Lang } from '../../../../content/guia/types'
import { gaTrack } from '../../../../lib/analytics/ga'
import { getRoute } from '../../../../lib/routes'
import { sendHotelEvent } from '../../../../lib/hotels/client'
import { isValidHotelCode } from '../../../../lib/hotels/codes'
import type { HotelPracticalCard } from '../../../../content/guia/hotel/resolve'
import { HOTEL_EXPERIENCES, experiencesArePlaceholders } from '../../../../content/guia/hotel/experiences'
import type { HotelBlockId, HotelEdition, HotelOutboundId } from '../../../../content/guia/hotel/config'
import { ZONE_LABEL, ZONE_NEIGHBORHOOD, ZONE_SLUG, type HotelZone } from '../../../../content/guia/hotel/zones'
import { Icon } from '../../[partner]/GuiaClient'
import SectionHead from '../../[partner]/SectionHead'
import WeatherCard from '../../[partner]/WeatherCard'
import styles from '../../[partner]/guia.module.css'

const PINE = '#0F3A33'

/** Experience photos for the placeholder cards (same files the city guide uses). */
const EXP_PHOTOS: Record<string, string> = {
  'exp-teotihuacan': '/images/guia/experiences/exp-teotihuacan.jpg',
  'exp-lucha': '/images/guia/experiences/exp-lucha.jpg',
  'exp-frida': '/images/guia/experiences/exp-frida.jpg',
  'exp-tacos': '/images/guia/experiences/exp-tacos.jpg',
}

const COPY: Record<Lang, { share: string; shareText: (zone: string) => string; book: string; cta: string }> = {
  es: { share: 'Enviar esta guía a mi teléfono', shareText: (z) => `Mi guía de barrio de ${z}, de Lagomplan:`, book: 'Reservar', cta: 'Empezar a explorar' },
  en: { share: 'Send this guide to my phone', shareText: (z) => `My ${z} neighborhood guide, from Lagomplan:`, book: 'Book', cta: 'Start exploring' },
}

export default function HotelGuideClient({ zone, city, edition, practical: practicalByLang }: {
  zone: HotelZone; city: City; edition: HotelEdition
  /** Resolved on the server (held items skipped, Insider stripped) — see buildHotelGuideProps. */
  practical: Record<Lang, HotelPracticalCard[]>
}) {
  const [lang, setLang] = useState<Lang>('en')
  const [code, setCode] = useState<string | null>(null)
  const [mood, setMood] = useState<string | null>(null)
  const ownNb = ZONE_NEIGHBORHOOD[zone]
  const [browseNb, setBrowseNb] = useState<string>(ownNb)

  const t = city.copy[lang]
  const zoneName = ZONE_LABEL[zone]
  const interp = (s: string) => s.replace(/\{neighborhood\}/g, zoneName).replace(/\{host\}/g, 'Lagomplan')

  // ?lang and ?h are read after mount so the first client render matches the server HTML (static page).
  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    const l = p.get('lang')
    if (l === 'es' || l === 'en') setLang(l)
    const h = p.get('h')
    if (isValidHotelCode(h)) setCode(h)
  }, [])
  useEffect(() => { document.documentElement.lang = lang }, [lang])

  const partnerSlug = code ?? `zone_${zone}`
  const track = (linkName: HotelOutboundId, href: string, extra: Record<string, string> = {}) => {
    let destination = href
    try { destination = new URL(href, window.location.origin).hostname } catch { /* keep */ }
    gaTrack('partner_link_click', { link_name: linkName, partner_slug: partnerSlug, zone, lang, section: linkName, destination, ...extra })
    if (code) sendHotelEvent({ code, type: 'outbound_click', section: linkName, lang })
  }

  useEffect(() => { gaTrack('hotel_guide_view', { partner_slug: partnerSlug, zone }) }, [partnerSlug, zone])

  // section_open: once per block per page view, when 30% of it is on screen. Only with a hotel code.
  useEffect(() => {
    if (!code) return
    const seen = new Set<string>()
    const obs = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const id = (e.target as HTMLElement).dataset.hotelSection
        if (e.isIntersecting && id && !seen.has(id)) {
          seen.add(id)
          sendHotelEvent({ code, type: 'section_open', section: id, lang: document.documentElement.lang === 'es' ? 'es' : 'en' })
        }
      }
    }, { threshold: 0.3 })
    document.querySelectorAll('[data-hotel-section]').forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [code])

  const plannerHref = `${getRoute(lang, 'planner')}?${new URLSearchParams({
    utm_source: `${edition.utmSourcePrefix}${code ?? 'zone'}`,
    utm_medium: 'partner',
    utm_campaign: edition.planner.utmCampaign,
  })}`

  const shareHref = useMemo(() => {
    const url = typeof window === 'undefined' ? '' : `${window.location.origin}/guia/cdmx/${ZONE_SLUG[zone]}${code ? `?h=${code}` : ''}`
    return `https://wa.me/?text=${encodeURIComponent(`${COPY[lang].shareText(zoneName)} ${url}`.trim())}`
  }, [lang, zone, zoneName, code])

  const nbOrder = edition.neighborhoods.ownZoneFirst
    ? [ownNb, ...city.neighborhoodOrder.filter((n) => n !== ownNb)]
    : city.neighborhoodOrder
  const nb = city.neighborhoods[browseNb] ?? city.neighborhoods[ownNb]
  const spots = nb.spots[lang]
  const itin = city.itinerary[lang]
  const practical = practicalByLang[lang]
  const selectedMood = t.moods.find((m) => m.id === mood) ?? null
  const placeholderExps = t.experiences.filter((e) => e.id !== 'exp-own-plan' && EXP_PHOTOS[e.id])

  const sec = (id: HotelBlockId) => ({ 'data-hotel-section': id } as const)

  const blocks: Record<HotelBlockId, React.ReactNode> = {
    hero: (
      <section className={styles.hero} {...sec('hero')} key="hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.heroImg} src={city.heroImage} alt={lang === 'es' ? 'Ciudad de México' : 'Mexico City'} />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <span className={styles.heroEyebrow}>{edition.heroEyebrow[lang]}</span>
          <h1 className={styles.heroTitle}>{t.heroTitle}</h1>
          <p className={styles.heroSub}>{interp(t.heroSub)}</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <a href="#zonas" className={styles.ctaLight}>{COPY[lang].cta} <Icon name="arrowDown" size={15} color={PINE} /></a>
            {edition.share && (
              <a
                href={shareHref}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ctaLight}
                onClick={() => track('share', shareHref)}
              >{COPY[lang].share}</a>
            )}
          </div>
        </div>
      </section>
    ),

    neighborhoods: (
      <section id="zonas" className={`${styles.section} ${styles.sectionAlt}`} {...sec('neighborhoods')} key="neighborhoods">
        <div className={styles.container}>
          <div className={styles.secGrid}>
            <div className={styles.secHead}>
              <span className={styles.eyebrow} style={{ color: 'var(--pine)' }}>{t.neighborhoodEyebrow}</span>
              <h2 className={styles.h2}>{t.neighborhoodH2}</h2>
              <p className={styles.nbTagline}>{nb.tagline[lang]}</p>
              <p className={styles.lede}>{nb.orientation[lang]}</p>
            </div>
            <div className={styles.secBody}>
              <div className={styles.nbControls}>
                <div className={styles.tabRow} role="tablist" aria-label={t.neighborhoodEyebrow}>
                  {nbOrder.map((name) => (
                    <button key={name} type="button" role="tab" aria-selected={name === browseNb}
                      className={`${styles.tab} ${name === browseNb ? styles.tabActive : ''}`}
                      onClick={() => setBrowseNb(name)}>{city.neighborhoods[name].tabLabel?.[lang] ?? name}</button>
                  ))}
                </div>
                <a className={styles.nbMapCard} href={nb.mapUrl || undefined} target="_blank" rel="noopener noreferrer"
                  onClick={() => track('map', nb.mapUrl)}>
                  <span className={styles.nbMapThumb} aria-hidden>
                    <span className={styles.nbMapDot} style={{ top: 13, left: 15 }} />
                    <span className={styles.nbMapDot} style={{ top: 29, left: 32, background: 'var(--coral)' }} />
                    <span className={styles.nbMapDot} style={{ top: 35, left: 18 }} />
                  </span>
                  <span className={styles.nbMapText}>
                    <span className={styles.nbMapPrimary}>{t.mapCardPrimary.replace('{n}', String(spots.length))}</span>
                    <span className={styles.nbMapSecondary}>{t.mapCardSecondary} · {nb.tabLabel?.[lang] ?? browseNb}</span>
                  </span>
                  <span className={styles.nbMapArrow} aria-hidden>→</span>
                </a>
              </div>
              <div className={styles.spotList}>
                {spots.map((spot, i) => (
                  <div className={styles.spotRow} key={`${browseNb}-${i}`}>
                    <div className={styles.spotIcon}><Icon name={spot.icon} size={16} color={PINE} /></div>
                    <div>
                      <div className={styles.spotHead}><h5 className={styles.h5}>{spot.name}</h5><span className={styles.spotDist}>{spot.distance}</span></div>
                      <p className={styles.spotNote}>{spot.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    ),

    food: (
      <section className={styles.section} style={{ paddingTop: 88, paddingBottom: 88 }} {...sec('food')} key="food">
        <div className={styles.container}>
          <div className={styles.secGrid}>
            <SectionHead eyebrow={t.foodEyebrow} title={t.foodH2} lede={t.foodLede} />
            <div className={styles.secBody}>
              <div className={styles.foodGrid}>
                {t.foodCollections.map((col, i) => (
                  <div className={styles.foodCard} key={i}>
                    <span className={styles.eyebrowMono} style={{ color: 'var(--coral)' }}>{col.tag}</span>
                    <h5 className={`${styles.h5} ${styles.foodName}`}>{col.name}</h5>
                    <p className={styles.foodNote}>{col.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    ),

    moods: (
      <section className={`${styles.section} ${styles.sectionAlt}`} style={{ paddingTop: 88, paddingBottom: 88 }} {...sec('moods')} key="moods">
        <div className={styles.container}>
          <div className={styles.secGrid}>
            <SectionHead eyebrow={t.moodEyebrow} title={t.moodH2} lede={t.moodLede} />
            <div className={styles.secBody}>
              <div className={styles.moodGrid}>
                {t.moods.map((m) => (
                  <button key={m.id} type="button" aria-pressed={mood === m.id}
                    className={`${styles.moodBtn} ${mood === m.id ? styles.moodBtnActive : ''}`} onClick={() => setMood(m.id)}>
                    <Icon name={m.icon} color={PINE} />
                    <div className={styles.moodLabel}>{m.label}</div>
                  </button>
                ))}
              </div>
              {selectedMood && (
                <div className={`${styles.moodPanel} ${styles.fade}`}>
                  <div className={styles.moodPanelHead}>
                    <h4 className={styles.h4}>{selectedMood.title}</h4>
                    <button type="button" className={styles.moodClose} onClick={() => setMood(null)}>{t.closeLabel}</button>
                  </div>
                  <div className={styles.moodItems}>
                    {selectedMood.items.map((it, i) => (
                      <div key={i}><div className={styles.moodItemName}>{it.name}</div><div className={styles.moodItemNote}>{it.note}</div></div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    ),

    rhythm: (
      <section className={styles.section} style={{ paddingTop: 88, paddingBottom: 88 }} {...sec('rhythm')} key="rhythm">
        <div className={styles.container}>
          <div className={styles.secGrid}>
            <SectionHead eyebrow={t.todayDateLabel} title={t.todayH2} />
            <div className={styles.secBody}>
              <WeatherCard lang={lang} />
              <div className={styles.spotList}>
                {t.todayItems.map((ti, i) => (
                  <div className={styles.todayRow} key={i}>
                    <span className={`${styles.eyebrowMono} ${styles.tag}`}>{ti.tag}</span>
                    <div><div className={styles.todayTitle}>{ti.title}</div><div className={styles.todayBody}>{interp(ti.body)}</div></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    ),

    experiences: (
      <section className={`${styles.section} ${styles.sectionAlt}`} style={{ paddingTop: 88, paddingBottom: 88 }} {...sec('experiences')} key="experiences">
        <div className={styles.container}>
          <div className={styles.secGrid}>
            {/* No "booked through our local partner" note and no own-plan banner in this edition. */}
            <SectionHead eyebrow={t.expEyebrow} title={t.expH2} lede={t.expLede} />
            <div className={styles.secBody}>
              <div className={styles.expGrid}>
                {experiencesArePlaceholders()
                  ? placeholderExps.map((e) => (
                      <div className={styles.expCard} key={e.id}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img className={styles.expImg} src={EXP_PHOTOS[e.id]} alt={e.title} />
                        <div className={styles.expBody}>
                          <div className={styles.expTextBlock}><h5 className={styles.h5}>{e.title}</h5><p className={styles.expNote}>{e.teaser}</p></div>
                        </div>
                      </div>
                    ))
                  : HOTEL_EXPERIENCES.items.map((e) => (
                      <div className={styles.expCard} key={e.id}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img className={styles.expImg} src={e.image} alt={e.title[lang]} />
                        <div className={styles.expBody}>
                          <div className={styles.expTextBlock}><h5 className={styles.h5}>{e.title[lang]}</h5><p className={styles.expNote}>{e.teaser[lang]}</p></div>
                          <div className={styles.expActions}>
                            <a className={styles.expBookLink} href={e.bookUrl} target="_blank" rel="sponsored noopener noreferrer"
                              onClick={() => track('experience_book', e.bookUrl, { experience_name: e.id })}>{COPY[lang].book}</a>
                          </div>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    ),

    practical: (
      <section id="practico" className={styles.section} {...sec('practical')} key="practical">
        <div className={styles.container}>
          <div className={styles.secGrid}>
            <div className={styles.secHead}>
              <span className={styles.eyebrowMono} style={{ color: 'var(--pine)', display: 'block', marginBottom: 12 }}>{lang === 'es' ? 'LO PRÁCTICO' : 'THE PRACTICAL PART'}</span>
              <h2 className={styles.h2}>{lang === 'es' ? 'Un comienzo tranquilo' : 'A calm start to your trip'}</h2>
            </div>
            <div className={styles.secBody}>
              <div className={styles.cardGrid}>
                {practical.map((c) => (
                  <div className={styles.card} id={c.anchor || undefined} key={c.key}>
                    <div className={styles.iconChip}><Icon name={c.icon} color="var(--cream)" /></div>
                    <h4 className={styles.h4}>{c.title}</h4>
                    <p className={styles.cardBody}>
                      {c.body}
                      {c.links?.map((l, i) => (
                        <span key={i}>{' '}
                          <a className={styles.link} href={l.href} target="_blank" rel="noopener noreferrer" onClick={() => track('airalo', l.href)}>{l.text}</a>
                          {l.after}
                        </span>
                      ))}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    ),

    itinerary: (
      <section className={`${styles.section} ${styles.sectionPine}`} style={{ paddingTop: 96, paddingBottom: 96 }} {...sec('itinerary')} key="itinerary">
        <div className={styles.container}>
          <div className={styles.itinGrid}>
            <div className={styles.itinIntro}>
              <span className={styles.eyebrowMono} style={{ color: 'var(--sage-soft)' }}>{itin.eyebrow}</span>
              <h2 className={styles.itinTitle}>{itin.title}</h2>
              <p className={styles.itinLede}>{itin.lede}</p>
            </div>
            {itin.days.map((day, di) => (
              <div className={styles.itinDay} key={di}>
                <h3 className={styles.itinDayTitle}>{day.title}</h3>
                <div className={styles.itinList}>
                  {day.items.map((it, ii) => (
                    <div className={styles.itinRow} key={ii}><span className={`${styles.eyebrowMono} ${styles.itinTime}`}>{it.time}</span><p className={styles.itinText}>{it.text}</p></div>
                  ))}
                </div>
                {day.note && <p className={styles.itinNote}>{day.note}</p>}
              </div>
            ))}
          </div>
          <a className={styles.itinMapsBtn} href={itin.mapsUrl} target="_blank" rel="noopener noreferrer" onClick={() => track('map', itin.mapsUrl)}>{itin.mapsCta}</a>
        </div>
      </section>
    ),

    planner: (
      <section className={`${styles.section} ${styles.lightBand}`} style={{ paddingTop: 88, paddingBottom: 88 }} {...sec('planner')} key="planner">
        <div className={`${styles.container} ${styles.continueWrap}`}>
          <span className={`${styles.eyebrowMono} ${styles.continueEyebrow}`}>{t.continueEyebrow}</span>
          <h2 className={styles.continueH2}>{t.continueH2}</h2>
          <p className={styles.continueLede}>{t.continueLede}</p>
          <a className={styles.ctaPlanner} href={plannerHref} onClick={() => track('planner', plannerHref)}>{t.continueCta}</a>
        </div>
      </section>
    ),
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerRow}>
          <span className={styles.brand}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.png" alt="Lagomplan" className={styles.brandLogo} />
          </span>
          <div className={styles.navRight}>
            <span className={styles.eyebrowMono} style={{ color: 'var(--sage)' }}>{edition.headerLabel[lang]}</span>
            <div className={styles.langGroup} role="group" aria-label={lang === 'es' ? 'Idioma' : 'Language'}>
              <button type="button" className={`${styles.langBtn} ${lang === 'es' ? styles.langOn : ''}`} aria-pressed={lang === 'es'} onClick={() => setLang('es')}>ES</button>
              <button type="button" className={`${styles.langBtn} ${lang === 'en' ? styles.langOn : ''}`} aria-pressed={lang === 'en'} onClick={() => setLang('en')}>EN</button>
            </div>
          </div>
        </div>
      </header>

      {edition.blocks.map((id) => blocks[id])}

      <div className={styles.footer}><span className={styles.footerText}>{t.footer}</span></div>
    </div>
  )
}
