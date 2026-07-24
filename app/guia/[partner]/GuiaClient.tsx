'use client'

/**
 * app/guia/[partner]/GuiaClient.tsx
 *
 * Renders one co-branded guest guide = city layer + partner layer. Copy is
 * ported verbatim from /content; this file is presentation + interaction only.
 *
 * Layout: matches the lagomplan.com standard — a ~1160px container with an
 * editorial two-column section grid (intro left, content right) that stacks to
 * a single column on mobile.
 *
 * Interaction:
 *   • In-page ES/EN toggle (default EN). No /en route — same URL.
 *   • Chip nav swaps the "your neighborhood" list per colonia; "a perfect day"
 *     stays pinned to the partner's home colonia.
 *   • Mood picker expands an inline panel.
 *
 * Attribution + analytics:
 *   • localStorage lagom_ref + first-party cookie = "host:<slug>" on load
 *     (planner reads at trip creation → trips.ref_source).
 *   • GA4: host_guide_view on load, host_guide_insiders_view when the insiders
 *     section enters the viewport, host_guide_planner_click on the planner CTA.
 */

import { useEffect, useRef, useState } from 'react'
import {
  Plane, Car, CloudSun, Banknote, Wifi, ShieldCheck, Briefcase, Droplet, Moon,
  SquareParking, Coffee, Croissant, Utensils, ShoppingBasket, Trees, Plus,
  Landmark, Baby, Martini, Compass, Clock, CloudRain, ArrowDown,
  type LucideIcon,
} from 'lucide-react'
import { gaTrack } from '../../../lib/analytics/ga'
import { getRoute } from '../../../lib/routes'
import type { City, IconKey, Lang, Partner } from '../../../content/guia/types'
import styles from './guia.module.css'

const ICONS: Record<IconKey, LucideIcon> = {
  plane: Plane, car: Car, cloudSun: CloudSun, banknote: Banknote, wifi: Wifi,
  shield: ShieldCheck, briefcase: Briefcase, droplet: Droplet, moon: Moon,
  parking: SquareParking, coffee: Coffee, croissant: Croissant, utensilsSm: Utensils,
  basket: ShoppingBasket, trees: Trees, cross: Plus, landmark: Landmark,
  utensils: Utensils, baby: Baby, martini: Martini, compass: Compass, clock: Clock,
  cloudRain: CloudRain, arrowDown: ArrowDown,
}

function Icon({ name, size = 18, color = 'currentColor' }: { name: IconKey; size?: number; color?: string }) {
  const Cmp = ICONS[name]
  return <Cmp size={size} color={color} strokeWidth={1.8} aria-hidden />
}

/** Left column of an editorial section: eyebrow + heading + optional lede. */
function SectionHead({ eyebrow, title, lede }: { eyebrow: string; title?: string; lede?: string }) {
  return (
    <div className={styles.secHead}>
      <span className={styles.eyebrow}>{eyebrow}</span>
      {title && <h2 className={styles.h2}>{title}</h2>}
      {lede && <p className={styles.lede}>{lede}</p>}
    </div>
  )
}

const PINE = '#0F3A33'
const CREAM = '#FFF9F3'

export default function GuiaClient({ partner, city }: { partner: Partner; city: City }) {
  const [lang, setLang] = useState<Lang>('en')
  const [mood, setMood] = useState<string | null>(null)
  const [browseNb, setBrowseNb] = useState<string>(partner.homeNeighborhood)
  const [showSticky, setShowSticky] = useState(false)
  const insidersRef = useRef<HTMLElement | null>(null)

  const t = city.copy[lang]
  const interp = (s: string) =>
    s.replace(/\{host\}/g, partner.hostName).replace(/\{neighborhood\}/g, partner.homeNeighborhood)

  // ── Attribution flag + view event (once on load) ──────────────────────────
  useEffect(() => {
    const ref = `host:${partner.slug}`
    try { window.localStorage.setItem('lagom_ref', ref) } catch { /* private mode */ }
    try {
      const secure = window.location.protocol === 'https:' ? '; Secure' : ''
      document.cookie = `lagom_ref=${encodeURIComponent(ref)}; Path=/; Max-Age=15552000; SameSite=Lax${secure}`
    } catch { /* cookies disabled */ }
    gaTrack('host_guide_view', { partner: partner.slug, city: city.id })
  }, [partner.slug, city.id])

  // Keep the document language in sync with the toggle (a11y / SEO).
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  // Reveal the sticky planner CTA once the guest scrolls past the hero.
  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 480)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── Insiders section in-viewport event (published partners only) ──────────
  const insidersPublished = !!partner.insiders?.publish && !!partner.insiders?.items?.[lang]?.length
  useEffect(() => {
    if (!insidersPublished || !insidersRef.current) return
    let fired = false
    const el = insidersRef.current
    const obs = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting && !fired) {
          fired = true
          gaTrack('host_guide_insiders_view', { partner: partner.slug, city: city.id })
          obs.disconnect()
        }
      }
    }, { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [insidersPublished, partner.slug, city.id])

  // ── Planner CTA ───────────────────────────────────────────────────────────
  const plannerBase = getRoute(lang, 'planner')
  const plannerHref =
    `${plannerBase}?destino=${city.id}&utm_source=host&utm_medium=guia&utm_campaign=${partner.plannerCampaign}`
  const onPlannerClick = (placement: string) =>
    gaTrack('host_guide_planner_click', { placement, partner: partner.slug, city: city.id })

  const homeNb = city.neighborhoods[partner.homeNeighborhood] ?? city.neighborhoods[city.neighborhoodOrder[0]]
  const browseNbData = city.neighborhoods[browseNb] ?? homeNb
  const spots = browseNbData.spots[lang]
  const perfectDay = homeNb.perfectDay[lang]
  const selectedMood = t.moods.find((m) => m.id === mood) ?? null
  const insiders = partner.insiders

  return (
    <div className={styles.page}>
      {/* ── Header ─────────────────────────────────────────── */}
      <header className={styles.header}>
        <div className={styles.headerRow}>
          <span className={styles.brand}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo.png"
              alt="Lagomplan"
              className={styles.brandLogo}
              onError={(e) => {
                const img = e.currentTarget
                img.style.display = 'none'
                const fb = img.nextElementSibling as HTMLElement | null
                if (fb) fb.style.display = 'inline'
              }}
            />
            <span className={styles.brandFallback}>lagomplan</span>
          </span>
          <div className={styles.navRight}>
            <span className={styles.eyebrowMono} style={{ color: 'var(--sage)' }}>{t.navLabel}</span>
            <div className={styles.langGroup} role="group" aria-label={lang === 'es' ? 'Idioma' : 'Language'}>
              <button
                type="button"
                className={`${styles.langBtn} ${lang === 'es' ? styles.langOn : ''}`}
                aria-pressed={lang === 'es'}
                onClick={() => setLang('es')}
              >ES</button>
              <button
                type="button"
                className={`${styles.langBtn} ${lang === 'en' ? styles.langOn : ''}`}
                aria-pressed={lang === 'en'}
                onClick={() => setLang('en')}
              >EN</button>
            </div>
          </div>
        </div>
      </header>

      {/* ── 1. Welcome ─────────────────────────────────────── */}
      <section className={styles.hero}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.heroImg} src={city.heroImage} alt="Ciudad de México" />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <span className={styles.heroEyebrow}>{interp(t.heroEyebrow)}</span>
          <h1 className={styles.heroTitle}>{t.heroTitle}</h1>
          <p className={styles.heroSub}>{interp(t.heroSub)}</p>
          <a href="#before" className={styles.ctaLight}>
            {t.beginExploring} <Icon name="arrowDown" size={15} color={PINE} />
          </a>
        </div>
      </section>

      {/* ── Host letter (renders when the partner provides a signature) ── */}
      {partner.hostLetterSignature && (
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.letterInner}>
              <span className={styles.eyebrow} style={{ color: 'var(--sage)' }}>{t.hostLetter.eyebrow}</span>
              <p className={styles.hostQuote}>{'“'}{t.hostLetter.quote}{'”'}</p>
              <p className={styles.lede} style={{ maxWidth: 640 }}>{t.hostLetter.body}</p>
              <div className={styles.hostSig}>
                <div className={styles.hostSigName}>{partner.hostLetterSignature}</div>
                <span className={styles.eyebrowMono} style={{ color: 'var(--sage)' }}>{t.hostLetter.roleLabel}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 2. Before you arrive ───────────────────────────── */}
      <section id="before" className={styles.section}>
        <div className={styles.container}>
          <div className={styles.secGrid}>
            <SectionHead eyebrow={t.beforeEyebrow} title={t.beforeH2} lede={t.beforeLede} />
            <div className={styles.secBody}>
              <div className={styles.cardGrid}>
                {t.arrivalItems.map((item, i) => (
                  <div className={styles.card} key={i}>
                    <div className={styles.iconChip}><Icon name={item.icon} color={CREAM} /></div>
                    <h4 className={styles.h4}>{item.title}</h4>
                    <p className={styles.cardBody}>
                      {interp(item.body)}
                      {item.link && (
                        <>
                          <a className={styles.link} href={item.link.href} target="_blank" rel="noopener noreferrer">{item.link.text}</a>
                          {item.link.after}
                        </>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Your neighborhood ───────────────────────────── */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <div className={styles.secGrid}>
            <SectionHead
              eyebrow={t.neighborhoodEyebrow}
              title={`${t.neighborhoodH2Prefix}${browseNb}`}
              lede={t.neighborhoodLede}
            />
            <div className={styles.secBody}>
              <div className={styles.nbControls}>
                <div className={styles.tabRow} role="tablist" aria-label={t.neighborhoodEyebrow}>
                  {city.neighborhoodOrder.map((name) => (
                    <button
                      key={name}
                      type="button"
                      role="tab"
                      aria-selected={name === browseNb}
                      className={`${styles.tab} ${name === browseNb ? styles.tabActive : ''}`}
                      onClick={() => setBrowseNb(name)}
                    >{name}</button>
                  ))}
                </div>
                <a className={styles.mapsLink} href={browseNbData.mapUrl} target="_blank" rel="noopener noreferrer">
                  {t.openInMapsLabel} →
                </a>
              </div>
              <div className={styles.spotList}>
                {spots.map((spot, i) => (
                  <div className={styles.spotRow} key={`${browseNb}-${i}`}>
                    <div className={styles.spotIcon}><Icon name={spot.icon} size={16} color={PINE} /></div>
                    <div>
                      <div className={styles.spotHead}>
                        <h5 className={styles.h5}>{spot.name}</h5>
                        <span className={styles.spotDist}>{spot.distance}</span>
                      </div>
                      <p className={styles.spotNote}>{spot.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. A perfect day ───────────────────────────────── */}
      <section className={styles.section} style={{ paddingTop: 88, paddingBottom: 88 }}>
        <div className={styles.container}>
          <div className={styles.secGrid}>
            <SectionHead eyebrow={t.perfectDayEyebrow} title={t.perfectDayH2} lede={t.perfectDayLede} />
            <div className={styles.secBody}>
              <div className={styles.spotList}>
                {perfectDay.map((m, i) => (
                  <div className={styles.momentRow} key={i}>
                    <span className={`${styles.eyebrowMono} ${styles.momentTime}`}>{m.time}</span>
                    <div>
                      <h4 className={styles.h4}>{m.title}</h4>
                      <p className={styles.momentBody}>{m.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Explore by mood ─────────────────────────────── */}
      <section className={`${styles.section} ${styles.sectionAlt}`} style={{ paddingTop: 88, paddingBottom: 88 }}>
        <div className={styles.container}>
          <div className={styles.secGrid}>
            <SectionHead eyebrow={t.moodEyebrow} title={t.moodH2} lede={t.moodLede} />
            <div className={styles.secBody}>
              <div className={styles.moodGrid}>
                {t.moods.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    aria-pressed={mood === m.id}
                    className={`${styles.moodBtn} ${mood === m.id ? styles.moodBtnActive : ''}`}
                    onClick={() => setMood(m.id)}
                  >
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
                      <div key={i}>
                        <div className={styles.moodItemName}>{it.name}</div>
                        <div className={styles.moodItemNote}>{it.note}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Today ───────────────────────────────────────── */}
      <section className={styles.section} style={{ paddingTop: 88, paddingBottom: 88 }}>
        <div className={styles.container}>
          <div className={styles.secGrid}>
            <SectionHead eyebrow={t.todayDateLabel} title={t.todayH2} />
            <div className={styles.secBody}>
              <div className={styles.weatherCard}>
                <Icon name="cloudRain" size={30} color={CREAM} />
                <div>
                  <div className={styles.weatherTemp}>{t.weatherTemp}</div>
                  <div className={styles.weatherBody}>{t.weatherBody}</div>
                </div>
              </div>
              <div className={styles.spotList}>
                {t.todayItems.map((ti, i) => (
                  <div className={styles.todayRow} key={i}>
                    <span className={`${styles.eyebrowMono} ${styles.tag}`}>{ti.tag}</span>
                    <div>
                      <div className={styles.todayTitle}>{ti.title}</div>
                      <div className={styles.todayBody}>{interp(ti.body)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Experiences ─────────────────────────────────── */}
      <section className={`${styles.section} ${styles.sectionAlt}`} style={{ paddingTop: 88, paddingBottom: 88 }}>
        <div className={styles.container}>
          <div className={styles.secGrid}>
            <SectionHead eyebrow={t.expEyebrow} title={t.expH2} lede={t.expLede} />
            <div className={styles.secBody}>
              <div className={styles.expGrid}>
                {t.experiences.map((exp) => (
                  <div className={styles.expCard} key={exp.id}>
                    <div className={styles.expThumb}>{exp.title}</div>
                    <div className={styles.expBody}>
                      <h5 className={styles.h5}>{exp.title}</h5>
                      <p className={styles.expNote}>{exp.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. Food ────────────────────────────────────────── */}
      <section className={styles.section} style={{ paddingTop: 88, paddingBottom: 88 }}>
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

      {/* ── Insiders (partner-specific, published only) ────── */}
      {insidersPublished && insiders?.items && (
        <section
          ref={insidersRef}
          className={`${styles.section} ${styles.sectionAlt}`}
          style={{ paddingTop: 88, paddingBottom: 88 }}
        >
          <div className={styles.container}>
            <div className={styles.secGrid}>
              <SectionHead eyebrow={insiders.eyebrow?.[lang] ?? partner.displayName} title={insiders.h2?.[lang]} />
              <div className={styles.secBody}>
                <div className={styles.insiderGrid}>
                  {insiders.items[lang].map((it, i) => (
                    <div className={styles.insiderCard} key={i}>
                      <h5 className={styles.h5}>{it.name}</h5>
                      <p className={styles.insiderNote}>{it.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 9. Continue your trip (planner CTA) ────────────── */}
      <section className={`${styles.section} ${styles.sectionPine}`} style={{ paddingTop: 96, paddingBottom: 96 }}>
        <div className={`${styles.container} ${styles.continueWrap}`}>
          <span className={`${styles.eyebrowMono} ${styles.continueEyebrow}`}>{t.continueEyebrow}</span>
          <h2 className={styles.continueH2}>{t.continueH2}</h2>
          <p className={styles.continueLede}>{t.continueLede}</p>
          <a className={styles.ctaPlanner} href={plannerHref} onClick={() => onPlannerClick('continue_section')}>
            {t.continueCta}
          </a>
        </div>
      </section>

      {/* ── 10. Discover more ──────────────────────────────── */}
      <section className={styles.section} style={{ paddingTop: 88, paddingBottom: 88 }}>
        <div className={styles.containerWide}>
          <span className={styles.eyebrow}>{t.discoverEyebrow}</span>
          <h2 className={styles.h2}>{t.discoverH2}</h2>
          <div className={styles.discoverGrid}>
            {city.destinations.map((dest) => (
              <div className={styles.discoverCard} key={dest.name}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={styles.discoverImg} src={dest.photoUrl} alt={dest.name} />
                <div className={styles.discoverOverlay} />
                <span className={styles.discoverLabel}>{dest.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className={styles.footer}>
        <span className={styles.footerText}>{t.footer}</span>
      </div>

      {/* ── Fixed planner CTA (carries the same attributed link) ────────── */}
      <div className={`${styles.stickyWrap} ${showSticky ? '' : styles.stickyWrapHidden}`}>
        <a
          className={styles.stickyCta}
          href={plannerHref}
          onClick={() => onPlannerClick('sticky_cta')}
        >
          {t.stickyCta}
        </a>
      </div>
    </div>
  )
}
