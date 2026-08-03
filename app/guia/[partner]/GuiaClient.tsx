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
  Landmark, Baby, Martini, Compass, Clock, CloudRain, ArrowDown, IceCreamCone,
  Mountain,
  type LucideIcon,
} from 'lucide-react'
import { gaTrack } from '../../../lib/analytics/ga'
import { getRoute } from '../../../lib/routes'
import type { City, CityCopy, Experience, IconKey, Lang, Partner } from '../../../content/guia/types'
import WeatherCard from './WeatherCard'
import NewsletterSignup from './NewsletterSignup'
import styles from './guia.module.css'

const ICONS: Record<IconKey, LucideIcon> = {
  plane: Plane, car: Car, cloudSun: CloudSun, banknote: Banknote, wifi: Wifi,
  shield: ShieldCheck, briefcase: Briefcase, droplet: Droplet, moon: Moon,
  parking: SquareParking, coffee: Coffee, croissant: Croissant, utensilsSm: Utensils,
  basket: ShoppingBasket, trees: Trees, cross: Plus, landmark: Landmark,
  utensils: Utensils, baby: Baby, martini: Martini, compass: Compass, clock: Clock,
  cloudRain: CloudRain, arrowDown: ArrowDown, iceCream: IceCreamCone,
  mountain: Mountain,
}

function Icon({ name, size = 18, color = 'currentColor' }: { name: IconKey; size?: number; color?: string }) {
  const Cmp = ICONS[name]
  return <Cmp size={size} color={color} strokeWidth={1.8} aria-hidden />
}

/** Section header: eyebrow + heading + optional lede. `eyebrowColor` overrides
 *  the default coral eyebrow (applies to both languages — it's just styling). */
function SectionHead({ eyebrow, title, lede, eyebrowColor }: { eyebrow: string; title?: string; lede?: string; eyebrowColor?: string }) {
  return (
    <div className={styles.secHead}>
      <span className={styles.eyebrow} style={eyebrowColor ? { color: eyebrowColor } : undefined}>{eyebrow}</span>
      {title && <h2 className={styles.h2}>{title}</h2>}
      {lede && <p className={styles.lede}>{lede}</p>}
    </div>
  )
}

const PINE = '#0F3A33'
const CREAM = '#FFF9F3'

/** WhatsApp booking link for experiences (routed through the local partner). */
const WA_BOOK_URL =
  "https://wa.me/525539149062?text=Hello!%20I'm%20interested%20in%20booking%20an%20Insider%20Mexico%20City%20experience."

/** Experience card images, keyed by the experience id. */
const EXP_PHOTOS: Record<string, string> = {
  'exp-teotihuacan': '/images/guia/experiences/exp-teotihuacan.jpg',
  'exp-lucha': '/images/guia/experiences/exp-lucha.jpg',
  'exp-frida': '/images/guia/experiences/exp-frida.jpg',
  'exp-own-plan': '/images/guia/experiences/exp-own-plan.jpg',
}

/** Experience card: teaser + WhatsApp link on the face, full copy behind a
 *  "Details" toggle so longer cards (e.g. Frida/Coyoacán) don't stretch the row. */
function ExperienceCard({ exp, t }: { exp: Experience; t: CityCopy }) {
  const [isOpen, setIsOpen] = useState(false)
  const descriptions = Array.isArray(exp.description) ? exp.description : [exp.description]
  const minTimes = Array.isArray(exp.minBookingTime) ? exp.minBookingTime : [exp.minBookingTime]

  return (
    <div className={styles.expCard}>
      {EXP_PHOTOS[exp.id] ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={styles.expImg} src={EXP_PHOTOS[exp.id]} alt={exp.title} />
      ) : (
        <div className={styles.expThumb}>{exp.title}</div>
      )}
      <div className={styles.expBody}>
        <h5 className={styles.h5}>{exp.title}</h5>
        <p className={styles.expNote}>{exp.teaser}</p>
        <div className={styles.expActions}>
          <a className={styles.expBookLink} href={WA_BOOK_URL} target="_blank" rel="noopener">
            <svg className={styles.expBookIcon} viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" fill="currentColor">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.004c5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2Zm0 18.15h-.003a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.11.82.83-3.03-.2-.31a8.19 8.19 0 0 1-1.26-4.39c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.69 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43-.14 0-.31-.01-.48-.01-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.23-.17-.48-.29Z"/>
            </svg>
            {t.expBookCta}
          </a>
          <button
            type="button"
            className={styles.expDetailsToggle}
            onClick={() => setIsOpen((v) => !v)}
            aria-expanded={isOpen}
          >
            {t.expDetailsCta}
            <span
              className={styles.expDetailsChevron}
              style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}
              aria-hidden="true"
            >▾</span>
          </button>
        </div>
        <div
          className={styles.expDetailsPanel}
          style={{ maxHeight: isOpen ? '2000px' : '0', opacity: isOpen ? 1 : 0 }}
        >
          <div className={styles.expDetailsInner}>
            <p className={styles.expDetailLabel}>{t.expDescriptionLabel}</p>
            {descriptions.map((d, i) => <p className={styles.expDetailText} key={i}>{d}</p>)}
            <p className={styles.expDetailLabel}>{t.expHowToBookLabel}</p>
            <p className={styles.expDetailText}>
              <a className={styles.link} href={exp.howToBookLinkHref} target="_blank" rel="noopener noreferrer">{exp.howToBookLinkText}</a>
              {exp.howToBook}
            </p>
            <p className={styles.expDetailLabel}>{t.expMinTimeLabel}</p>
            {minTimes.map((mt, i) => <p className={styles.expDetailText} key={i}>{mt}</p>)}
            {exp.needSoonerNote && <p className={styles.expDetailNote}>{exp.needSoonerNote}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

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
  const itin = city.itinerary[lang]
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
            <div className={styles.letterCard}>
              <span className={styles.eyebrow} style={{ color: 'var(--sage)' }}>{t.hostLetter.eyebrow}</span>
              <p className={styles.hostQuote}>{t.hostLetter.quote}</p>
              <div className={styles.letterDivider} />
              <p className={styles.letterBody}>{t.hostLetter.body}</p>
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
            <SectionHead eyebrow={t.beforeEyebrow} title={t.beforeH2} lede={t.beforeLede} eyebrowColor="var(--pine)" />
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
            <div className={styles.secHead}>
              <span className={styles.eyebrow} style={{ color: 'var(--pine)' }}>{t.neighborhoodEyebrow}</span>
              <h2 className={styles.h2}>{t.neighborhoodH2}</h2>
              <p className={styles.nbTagline}>{browseNbData.tagline[lang]}</p>
              <p className={styles.lede}>{t.neighborhoodLede}</p>
            </div>
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
                <a
                  className={styles.nbMapCard}
                  href={browseNbData.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => gaTrack('host_guide_map_click', { partner: partner.slug, city: city.id, placement: 'neighborhood' })}
                >
                  <span className={styles.nbMapThumb} aria-hidden>
                    <span className={styles.nbMapDot} style={{ top: 13, left: 15 }} />
                    <span className={styles.nbMapDot} style={{ top: 29, left: 32, background: 'var(--coral)' }} />
                    <span className={styles.nbMapDot} style={{ top: 35, left: 18 }} />
                  </span>
                  <span className={styles.nbMapText}>
                    <span className={styles.nbMapPrimary}>{t.mapCardPrimary.replace('{n}', String(spots.length))}</span>
                    <span className={styles.nbMapSecondary}>{t.mapCardSecondary} · {browseNb}</span>
                  </span>
                  <span className={styles.nbMapArrow} aria-hidden>→</span>
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

      {/* ── 4. 48-hour itinerary (dark) ────────────────────── */}
      <section className={`${styles.section} ${styles.sectionPine}`} style={{ paddingTop: 88, paddingBottom: 88 }}>
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
                    <div className={styles.itinRow} key={ii}>
                      <span className={`${styles.eyebrowMono} ${styles.itinTime}`}>{it.time}</span>
                      <p className={styles.itinText}>{it.text}</p>
                    </div>
                  ))}
                </div>
                {day.note && <p className={styles.itinNote}>{day.note}</p>}
              </div>
            ))}
          </div>
          <a
            className={styles.itinMapsBtn}
            href={itin.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => gaTrack('host_guide_map_click', { partner: partner.slug, city: city.id })}
          >
            {itin.mapsCta}
          </a>
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
              <WeatherCard lang={lang} />
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
            <div className={styles.secHead}>
              <span className={styles.eyebrow}>{t.expEyebrow}</span>
              <h2 className={styles.h2}>{t.expH2}</h2>
              <p className={styles.lede} style={{ marginBottom: 8 }}>{t.expLede}</p>
              <p className={styles.expPartnerNote}>{t.expPartnerNote}</p>
            </div>
            <div className={styles.secBody}>
              <div className={styles.expGrid}>
                {t.experiences.map((exp) => (
                  <ExperienceCard exp={exp} t={t} key={exp.id} />
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
          <div className={styles.nlRule} />
          <NewsletterSignup
            lang={lang}
            copy={{
              title: t.newsletterTitle,
              body: t.newsletterBody,
              placeholder: t.newsletterPlaceholder,
              cta: t.newsletterCta,
              finePrint: t.newsletterFinePrint,
            }}
          />
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
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onPlannerClick('sticky_cta')}
        >
          {t.stickyCta}
        </a>
      </div>
    </div>
  )
}
