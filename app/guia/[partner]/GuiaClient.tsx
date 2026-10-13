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
  Mountain, KeyRound, Luggage, Sparkles, DoorOpen, Shirt, ShoppingCart,
  Wallet, AlarmClock, Laptop, ChefHat, Truck, PartyPopper, Dumbbell, Scissors,
  Flower2,
  type LucideIcon,
} from 'lucide-react'
import { gaTrack, trackOutboundLink } from '../../../lib/analytics/ga'
import { withPilotUtm } from '../../../lib/guia/links'
import { getRoute } from '../../../lib/routes'
import { parseStay, stayHeading, type Stay } from '../../../lib/guia/stay'
import { buildVisit } from '../../../lib/guia/visit'
import type { City, CityCopy, Experience, IconKey, Lang, OwnTour, Partner } from '../../../content/guia/types'
import { getZone } from '../../../content/guia/zones'
import { resolveFaqModule } from '../../../content/guia/faq/resolve'
import type { FaqItemKey } from '../../../content/guia/faq/types'
import WeatherCard from './WeatherCard'
import NewsletterSignup from './NewsletterSignup'
import PracticalSection from './PracticalSection'
import { withPlaceholders } from './placeholders'
import { WhatsAppIcon } from './WhatsAppIcon'
import StayGlance from './StayGlance'
import styles from './guia.module.css'

const ICONS: Record<IconKey, LucideIcon> = {
  plane: Plane, car: Car, cloudSun: CloudSun, banknote: Banknote, wifi: Wifi,
  shield: ShieldCheck, briefcase: Briefcase, droplet: Droplet, moon: Moon,
  parking: SquareParking, coffee: Coffee, croissant: Croissant, utensilsSm: Utensils,
  basket: ShoppingBasket, trees: Trees, cross: Plus, landmark: Landmark,
  utensils: Utensils, baby: Baby, martini: Martini, compass: Compass, clock: Clock,
  cloudRain: CloudRain, arrowDown: ArrowDown, iceCream: IceCreamCone,
  mountain: Mountain,
  keyRound: KeyRound, suitcase: Luggage, sparkles: Sparkles, doorOpen: DoorOpen,
  shirt: Shirt, cart: ShoppingCart, wallet: Wallet, alarmClock: AlarmClock,
  laptop: Laptop, chefHat: ChefHat, truck: Truck, partyPopper: PartyPopper,
  dumbbell: Dumbbell, scissors: Scissors, flower: Flower2,
}

export function Icon({ name, size = 18, color = 'currentColor' }: { name: IconKey; size?: number; color?: string }) {
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

/** Synthetic key for the partner-specific "Your house" tab — kept out of
 *  city.neighborhoods/neighborhoodOrder so two partners sharing a city don't
 *  collide on each other's home-address tab. */
const HOME_TAB_ID = 'your-house'

/** WhatsApp booking link for experiences (routed through the local partner),
 *  with a language-matched prefilled message. */
const WA_BOOK_URL: Record<Lang, string> = {
  en: "https://wa.me/525539149062?text=Hello!%20I'm%20interested%20in%20booking%20an%20Insider%20Mexico%20City%20experience.",
  es: 'https://wa.me/525539149062?text=%C2%A1Hola!%20Me%20interesa%20reservar%20una%20experiencia%20de%20Insider%20en%20la%20Ciudad%20de%20M%C3%A9xico.',
}

/**
 * Maps an ArrivalItem.id to the FAQ item that's meant to replace it once
 * that FAQ item has real content. Omitting the arrival item is only safe
 * once its FAQ counterpart actually resolves — otherwise the answer just
 * disappears rather than moves. See visibleArrivalItems below.
 */
const ARRIVAL_FAQ_COUNTERPART: Partial<Record<string, FaqItemKey>> = {
  'coming-back-late': 'lateReturn',
  // Added 2026-09-28 alongside the Livin "Take care"/errands work — this
  // mapping is what actually gates arrivalItemsOmit (see
  // visibleArrivalItems below), and was missed when 'health-pharmacies'
  // was added to arrivalItemsOmit on the Livin partners: without an
  // entry here, `counterpart` was always undefined, so the safety check
  // never omitted the card and it rendered under BOTH "Before you
  // arrive" and (correctly) "Everyday errands" at once. Confirmed live
  // on production before this fix (curl + grep the SSR HTML).
  'health-pharmacies': 'healthPharmacies',
}

/** Experience card images, keyed by the experience id. */
const EXP_PHOTOS: Record<string, string> = {
  'exp-teotihuacan': '/images/guia/experiences/exp-teotihuacan.jpg',
  'exp-lucha': '/images/guia/experiences/exp-lucha.jpg',
  'exp-frida': '/images/guia/experiences/exp-frida.jpg',
  'exp-tacos': '/images/guia/experiences/exp-tacos.jpg',
  'exp-own-plan': '/images/guia/experiences/exp-own-plan.jpg',
}

/** Experience card: teaser + WhatsApp link on the face, full copy behind a
 *  "Details" toggle so longer cards (e.g. Frida/Coyoacán) don't stretch the row. */

/** Maps an operator tour onto the Experience shape the card renders. */
function ownAsExperience(o: OwnTour): Experience {
  return {
    id: o.id,
    title: o.title,
    teaser: o.teaser,
    description: o.description ?? [],
    howToBookLinkText: '',
    howToBookLinkHref: '',
    howToBook: o.howToBook ?? '',
    minBookingTime: o.minBookingTime ?? [],
  }
}

/** The same card renders both Insider experiences and an operator's own
 *  tours (`own`): own tours get their own Book link (no Lagomplan UTMs, no
 *  WhatsApp icon), an optional price line, and a highlighted "[imagen]"
 *  placeholder when we have no illustration that fits. */
function ExperienceCard({ exp, t, lang, partnerSlug, zone, pilotId, own, onOwnBook }: { exp: Experience; t: CityCopy; lang: Lang; partnerSlug: string; zone?: string; pilotId: string; own?: OwnTour; onOwnBook?: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const descriptions = (Array.isArray(exp.description) ? exp.description : [exp.description]).filter(Boolean)
  const minTimes = (Array.isArray(exp.minBookingTime) ? exp.minBookingTime : [exp.minBookingTime]).filter(Boolean)

  const hasPhoto = own ? true : Boolean(EXP_PHOTOS[exp.id])
  const bookHref = withPilotUtm(WA_BOOK_URL[lang], pilotId, partnerSlug)
  const detailsHref = withPilotUtm(exp.howToBookLinkHref, pilotId, partnerSlug)

  return (
    <div id={own?.id} className={`${styles.expCard} ${hasPhoto ? '' : styles.expCardNoImg}`}>
      {own ? (
        own.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className={styles.expImg} src={own.image} alt={exp.title} />
        ) : (
          <div className={`${styles.expImg} ${styles.expImgPlaceholder}`}>
            <mark className={styles.placeholder}>[imagen]</mark>
          </div>
        )
      ) : hasPhoto && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={styles.expImg} src={EXP_PHOTOS[exp.id]} alt={exp.title} />
      )}
      <div className={styles.expBody}>
        <div className={styles.expTextBlock}>
          <h5 className={styles.h5}>{exp.title}</h5>
          <p className={styles.expNote}>{exp.teaser}</p>
          {own?.price && <p className={styles.tourPrice}>{withPlaceholders(own.price)}</p>}
        </div>
        <div className={styles.expActions}>
          {own ? (
            <a
              className={styles.expBookLink}
              href={own.bookHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onOwnBook}
            >{own.bookLabel ?? (lang === 'es' ? 'Reservar' : 'Book')}</a>
          ) : (
            <a
              className={styles.expBookLink}
              href={bookHref}
              target="_blank"
              rel="noopener"
              onClick={() => trackOutboundLink({
                linkName: 'insider', href: bookHref, partnerSlug, zone, lang,
                section: 'experience_book', experienceName: exp.title,
              })}
            >
              <WhatsAppIcon className={styles.expBookIcon} />
              {t.expBookCta}
            </a>
          )}
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
            {descriptions.length > 0 && (
              <>
                <p className={styles.expDetailLabel}>{t.expDescriptionLabel}</p>
                {descriptions.map((d, i) => <p className={styles.expDetailText} key={i}>{withPlaceholders(d)}</p>)}
              </>
            )}
            <p className={styles.expDetailLabel}>{t.expHowToBookLabel}</p>
            <p className={styles.expDetailText}>
              {!own && (
                <a
                  className={styles.link}
                  href={detailsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackOutboundLink({
                    linkName: 'insider', href: detailsHref, partnerSlug, zone, lang,
                    section: 'experience_details', experienceName: exp.title,
                  })}
                >{exp.howToBookLinkText}</a>
              )}
              {withPlaceholders(exp.howToBook)}
            </p>
            {minTimes.length > 0 && (
              <>
                <p className={styles.expDetailLabel}>{t.expMinTimeLabel}</p>
                {minTimes.map((mt, i) => <p className={styles.expDetailText} key={i}>{withPlaceholders(mt)}</p>)}
              </>
            )}
            {exp.needSoonerNote && <p className={styles.expDetailNote}>{exp.needSoonerNote}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

/** "Your Own Plan" renders as a full-width closing banner below the experience
 *  grid, not as a peer card, since it's an invitation rather than a place. */
function ExperienceBanner({ exp, t, lang, partnerSlug, zone, pilotId, operator }: { exp: Experience; t: CityCopy; lang: Lang; partnerSlug: string; zone?: string; pilotId: string; operator?: { label: string; href?: string } }) {
  const [isOpen, setIsOpen] = useState(false)
  const descriptions = Array.isArray(exp.description) ? exp.description : [exp.description]
  const minTimes = Array.isArray(exp.minBookingTime) ? exp.minBookingTime : [exp.minBookingTime]
  const bookHref = withPilotUtm(WA_BOOK_URL[lang], pilotId, partnerSlug)
  const detailsHref = withPilotUtm(exp.howToBookLinkHref, pilotId, partnerSlug)

  return (
    <div className={styles.expBanner}>
      <div className={styles.expBannerRow}>
        <div className={styles.expBannerText}>
          <h5 className={styles.expBannerTitle}>{exp.title}</h5>
          <p className={styles.expBannerNote}>{exp.teaser}</p>
        </div>
        <div className={styles.expActions}>
          {operator ? (
            // Operator demo: the CTA goes to the OPERATOR's WhatsApp — never Insider's.
            operator.href ? (
              <a className={styles.expBookLink} href={operator.href} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className={styles.expBookIcon} />
                {operator.label}
              </a>
            ) : (
              <span className={`${styles.expBookLink} ${styles.expBookDisabled}`} aria-disabled="true">
                <WhatsAppIcon className={styles.expBookIcon} />
                {withPlaceholders(operator.label)}
              </span>
            )
          ) : (
            <a
              className={styles.expBookLink}
              href={bookHref}
              target="_blank"
              rel="noopener"
              onClick={() => trackOutboundLink({
                linkName: 'insider', href: bookHref, partnerSlug, zone, lang,
                section: 'experience_book', experienceName: exp.title,
              })}
            >
              <WhatsAppIcon className={styles.expBookIcon} />
              {t.expBookCta}
            </a>
          )}
          <button
            type="button"
            className={styles.expBannerDetailsToggle}
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
      </div>
      <div
        className={styles.expBannerDetailsPanel}
        style={{ maxHeight: isOpen ? '2000px' : '0', opacity: isOpen ? 1 : 0 }}
      >
        <div className={styles.expBannerDetailsInner}>
          <p className={styles.expBannerDetailLabel}>{t.expDescriptionLabel}</p>
          {descriptions.map((d, i) => <p className={styles.expBannerDetailText} key={i}>{d}</p>)}
          <p className={styles.expBannerDetailLabel}>{t.expHowToBookLabel}</p>
          <p className={styles.expBannerDetailText}>
            {operator ? (
              operator.href
                ? <a className={styles.expBannerLink} href={operator.href} target="_blank" rel="noopener noreferrer">{exp.howToBookLinkText}</a>
                : withPlaceholders(operator.label)
            ) : (
              <a
                className={styles.expBannerLink}
                href={detailsHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackOutboundLink({
                  linkName: 'insider', href: detailsHref, partnerSlug, zone, lang,
                  section: 'experience_details', experienceName: exp.title,
                })}
              >{exp.howToBookLinkText}</a>
            )}
            {exp.howToBook}
          </p>
          <p className={styles.expBannerDetailLabel}>{t.expMinTimeLabel}</p>
          {minTimes.map((mt, i) => <p className={styles.expBannerDetailText} key={i}>{mt}</p>)}
          {exp.needSoonerNote && <p className={styles.expBannerDetailNote}>{exp.needSoonerNote}</p>}
        </div>
      </div>
    </div>
  )
}

/** Set by /demo/[prospect]: switches attribution, analytics naming and shows
 *  the "Demo prepared for" banner. Absent on the regular /guia route. */
export interface DemoMeta { slug: string; prospectName: string }

/** recordVisits: true only on production deployments (VERCEL_ENV, read on the
 *  server by the page). Local and Preview never write to guide_visits/demo_visits. */
export default function GuiaClient({ partner, city, demo, recordVisits = false }: {
  partner: Partner; city: City; demo?: DemoMeta; recordVisits?: boolean
}) {
  const [lang, setLang] = useState<Lang>('en')
  const [mood, setMood] = useState<string | null>(null)
  const [stay, setStay] = useState<Stay>({})
  const [browseNb, setBrowseNb] = useState<string>(partner.defaultNeighborhood ?? HOME_TAB_ID)
  const [showSticky, setShowSticky] = useState(false)
  const insidersRef = useRef<HTMLElement | null>(null)

  const t = city.copy[lang]
  // Demo traffic must not pollute the real-partner pilot metrics, so every
  // host_guide_* event is renamed demo_guide_* on /demo.
  const track = (name: string, params: Record<string, string | number | boolean | undefined>) =>
    gaTrack(demo ? name.replace(/^host_guide_/, 'demo_guide_') : name, params)
  const interp = (s: string) =>
    s.replace(/\{host\}/g, partner.hostName).replace(/\{neighborhood\}/g, partner.homeNeighborhood)

  // ── ?lang=es|en seeds the toggle ────────────────────────────────────────
  // Kept as a post-mount effect (not a useState lazy initializer) so the
  // very first client render still matches the server-rendered 'en'
  // default — reading window.location here to decide initial state would
  // hydrate-mismatch a Spanish deep link against the English SSR HTML.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const requested = params.get('lang')
    if (requested === 'es' || requested === 'en') setLang(requested)

    // ?llegada&noches&adultos&ninos personalize the guide. Same post-mount
    // timing as ?lang for the same hydration reason. With no (or invalid)
    // params `stay` stays {} and nothing below changes.
    const parsed = parseStay(params)
    setStay(parsed)
    // Traveling with kids → open that mood by default.
    if (parsed.children && parsed.children > 0) setMood('kids')
  }, [])

  // ── Attribution flag + view event (once on load) ──────────────────────────
  useEffect(() => {
    const ref = demo ? `demo:${demo.slug}` : `host:${partner.slug}`
    try { window.localStorage.setItem('lagom_ref', ref) } catch { /* private mode */ }
    try {
      const secure = window.location.protocol === 'https:' ? '; Secure' : ''
      document.cookie = `lagom_ref=${encodeURIComponent(ref)}; Path=/; Max-Age=15552000; SameSite=Lax${secure}`
    } catch { /* cookies disabled */ }
    track('host_guide_view', { partner: partner.slug, city: city.id })
  }, [partner.slug, city.id])

  // ── Visit log (production only) ───────────────────────────────────────────
  // Fire-and-forget INSERT without .select(): anon has no SELECT privilege, so
  // asking for the row back would fail. Errors are swallowed; logging a visit
  // must never break the guide.
  useEffect(() => {
    if (!recordVisits) return
    const row = buildVisit(demo ? demo.slug : partner.slug, window.location.search, navigator.userAgent)
    // Dynamic import: the Supabase browser client is ~60 kB and only
    // production visits need it, so it stays out of the initial bundle
    // (static import took the guides' first load from 115 kB to 176 kB).
    import('../../../lib/supabase/client')
      .then(({ getSupabaseBrowser }) =>
        // The generated Database type doesn't know these two tables.
        (getSupabaseBrowser() as any).from(demo ? 'demo_visits' : 'guide_visits').insert(row))
      .catch(() => { /* telemetry only */ })
  }, [recordVisits, demo?.slug, partner.slug])

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
          track('host_guide_insiders_view', { partner: partner.slug, city: city.id })
          obs.disconnect()
        }
      }
    }, { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [insidersPublished, partner.slug, city.id])

  // ── Planner CTA ───────────────────────────────────────────────────────────
  // UTM scheme: utm_source=<partner slug>, utm_medium=partner (constant),
  // utm_campaign=<pilot id>, utm_content=partner.utmContent, defaulting to
  // guest_guide (this route IS the guest-guide distribution channel —
  // other channels, e.g. prearrival/qr, are separate links documented in
  // docs/analytics/mxcity-pilot-links.md). partner.utmContent existed as a
  // field with no reader until now — this was the missing wiring.
  const plannerBase = getRoute(lang, 'planner')
  const plannerQuery = new URLSearchParams({
    utm_source: partner.slug,
    utm_medium: 'partner',
    utm_campaign: partner.pilotId,
    utm_content: partner.utmContent ?? 'guest_guide',
  })
  const plannerHref = `${plannerBase}?${plannerQuery}`
  const onPlannerClick = (placement: string) =>
    track('host_guide_planner_click', { placement, partner: partner.slug, city: city.id })

  // Tab order + lookup = partner's own "Your house" pick list, followed by
  // the zones shared across all partners in this city.
  const nbOrder = [HOME_TAB_ID, ...city.neighborhoodOrder]
  const getNeighborhood = (key: string) => (key === HOME_TAB_ID ? partner.yourHouse : city.neighborhoods[key])
  const browseNbData = getNeighborhood(browseNb) ?? partner.yourHouse
  const ownTours = partner.ownTours?.[lang] ?? []
  const letter = { ...t.hostLetter, ...partner.hostLetter?.[lang] }
  // Demo template option — only on /demo/*, only when the data exists. Every
  // /guia/<partner> page has no `demo` prop, so none of this can apply there.
  const cobrand = !!demo && !!partner.cobrand && !!partner.brand?.logo
  const splitLetter = !!demo && !!partner.cobrand && !!partner.stayGlance && !!partner.hostLetter?.[lang]?.paragraphs?.length
  const spots = browseNbData.spots[lang]
  const itin = city.itinerary[lang]
  const selectedMood = t.moods.find((m) => m.id === mood) ?? null
  const insiders = partner.insiders

  // ── The practical part (arrival items + FAQ module, merged) ────────────
  const faqZone = getZone(partner.zone)
  const faqGroups = resolveFaqModule(partner, faqZone, lang)
  const resolvedFaqKeys = new Set(faqGroups?.flatMap((g) => g.items.map((it) => it.key)) ?? [])
  const visibleArrivalItems = t.arrivalItems
    .filter((item) => {
      if (!item.id || !partner.arrivalItemsOmit?.includes(item.id)) return true
      const counterpart = ARRIVAL_FAQ_COUNTERPART[item.id]
      // Omit only once the FAQ counterpart has actually resolved — otherwise
      // omitting here would delete the answer rather than relocate it.
      return !(counterpart && resolvedFaqKeys.has(counterpart))
    })
    .map((item) => ({ ...item, body: interp(item.body) }))

  return (
    <div
      className={`${styles.page} ${partner.brand?.accent ? styles.accented : ''}`}
      style={partner.brand?.accent ? ({ '--accent': partner.brand.accent } as React.CSSProperties) : undefined}
    >
      {demo && (
        <div className={styles.demoBanner} role="note">
          <span>{lang === 'es' ? `Demo preparada para ${demo.prospectName}` : `Demo prepared for ${demo.prospectName}`}</span>
          {cobrand && <span className={styles.poweredBy}>Powered by Lagomplan</span>}
        </div>
      )}
      {/* ── Header ─────────────────────────────────────────── */}
      <header className={styles.header}>
        <div className={styles.headerRow}>
          {cobrand ? (
            // Demo co-brand option: the prospect's logo alone, on the left.
            <span className={styles.brand}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={partner.brand!.logo} alt={partner.displayName} className={styles.hmtLogo} />
            </span>
          ) : (
          <>
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
          {demo && (
            <span className={styles.coBrand}>
              <span aria-hidden>×</span>
              {partner.brand?.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={partner.brand.logo} alt={partner.displayName} className={styles.coBrandLogo} />
              ) : (
                <span className={styles.coBrandName}>{partner.displayName}</span>
              )}
            </span>
          )}
          </>
          )}
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
        <img className={styles.heroImg} src={city.heroImage} alt={lang === 'es' ? 'Ciudad de México' : 'Mexico City'} />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <span className={styles.heroEyebrow}>{interp(t.heroEyebrow)}</span>
          {stay.nights && (
            <p className={styles.heroStay}>{stayHeading(lang, stay.nights, partner.homeNeighborhood)}</p>
          )}
          <h1 className={styles.heroTitle}>{t.heroTitle}</h1>
          <p className={styles.heroSub}>{interp(t.heroSub)}</p>
          <a href="#practico" className={styles.ctaLight}>
            {t.beginExploring} <Icon name="arrowDown" size={15} color={PINE} />
          </a>
        </div>
      </section>

      {/* ── Host letter (renders when the partner provides a signature) ── */}
      {splitLetter && partner.hostLetter?.[lang]?.paragraphs && (
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.letterSplit}>
              <article className={styles.letterMain}>
                <span className={styles.eyebrow} style={{ color: 'var(--sage)' }}>{letter.eyebrow}</span>
                {partner.hostLetter[lang]!.paragraphs!.map((para, i) => {
                  const link = partner.hostLetter![lang]!.link
                  const at = link ? para.indexOf(link.text) : -1
                  return (
                    <p className={styles.letterP} key={i}>
                      {link && at >= 0
                        ? <>{para.slice(0, at)}<a href={link.href}>{link.text}</a>{para.slice(at + link.text.length)}</>
                        : para}
                    </p>
                  )
                })}
                <div className={styles.letterSig}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={partner.brand!.logo} alt={partner.displayName} className={styles.letterSigLogo} />
                  <span className={styles.eyebrowMono} style={{ color: 'var(--sage)' }}>{letter.roleLabel}</span>
                </div>
              </article>
              <StayGlance
                lang={lang}
                glance={partner.stayGlance!}
                whatsapp={partner.operatorWhatsApp ? { label: partner.operatorWhatsApp.label[lang], href: partner.operatorWhatsApp.href } : undefined}
              />
            </div>
          </div>
        </section>
      )}

      {partner.hostLetterSignature && !splitLetter && (
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.letterCard}>
              <span className={styles.eyebrow} style={{ color: 'var(--sage)' }}>{letter.eyebrow}</span>
              {letter.quote && <p className={styles.hostQuote}>{letter.quote}</p>}
              <div className={styles.letterDivider} />
              {letter.body.split('\n').map((line, i) => (
                <p className={styles.letterBody} key={i}>{withPlaceholders(line)}</p>
              ))}
              <div className={styles.hostSig}>
                <div className={styles.hostSigName}>{partner.hostLetterSignature}</div>
                <span className={styles.eyebrowMono} style={{ color: 'var(--sage)' }}>{letter.roleLabel}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 2. The practical part (arrival items + FAQ, merged) ── */}
      <PracticalSection
        arrivalItems={visibleArrivalItems}
        faqGroups={faqGroups}
        atAGlance={partner.atAGlance}
        practicalSubhead={partner.practicalSubhead}
        partnerSlug={partner.slug}
        zone={partner.zone}
        pilotId={partner.pilotId}
        lang={lang}
      />

      {/* ── 3. Your neighborhood ───────────────────────────── */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <div className={styles.secGrid}>
            <div className={styles.secHead}>
              <span className={styles.eyebrow} style={{ color: 'var(--pine)' }}>{t.neighborhoodEyebrow}</span>
              <h2 className={styles.h2}>{t.neighborhoodH2}</h2>
              <p className={styles.nbTagline}>{withPlaceholders(browseNbData.tagline[lang])}</p>
              <p className={styles.lede}>{withPlaceholders(browseNbData.orientation[lang])}</p>
            </div>
            <div className={styles.secBody}>
              <div className={styles.nbControls}>
                <div className={styles.tabRow} role="tablist" aria-label={t.neighborhoodEyebrow}>
                  {nbOrder.map((name) => (
                    <button
                      key={name}
                      type="button"
                      role="tab"
                      aria-selected={name === browseNb}
                      className={`${styles.tab} ${name === browseNb ? styles.tabActive : ''}`}
                      onClick={() => setBrowseNb(name)}
                    >{getNeighborhood(name).tabLabel?.[lang] ?? name}</button>
                  ))}
                </div>
                <a
                  className={styles.nbMapCard}
                  href={browseNbData.mapUrl || undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track('host_guide_map_click', { partner: partner.slug, city: city.id, placement: 'neighborhood' })}
                >
                  <span className={styles.nbMapThumb} aria-hidden>
                    <span className={styles.nbMapDot} style={{ top: 13, left: 15 }} />
                    <span className={styles.nbMapDot} style={{ top: 29, left: 32, background: 'var(--coral)' }} />
                    <span className={styles.nbMapDot} style={{ top: 35, left: 18 }} />
                  </span>
                  <span className={styles.nbMapText}>
                    <span className={styles.nbMapPrimary}>{t.mapCardPrimary.replace('{n}', String(spots.length))}</span>
                    <span className={styles.nbMapSecondary}>{t.mapCardSecondary} · {browseNbData.tabLabel?.[lang] ?? browseNb}</span>
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
                        <h5 className={styles.h5}>{withPlaceholders(spot.name)}</h5>
                        <span className={styles.spotDist}>{withPlaceholders(spot.distance)}</span>
                      </div>
                      <p className={styles.spotNote}>{withPlaceholders(spot.note)}</p>
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
            onClick={() => track('host_guide_map_click', { partner: partner.slug, city: city.id })}
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
              <p className={styles.expPartnerNote}>
                {ownTours.length > 0 ? (partner.experiencesPartnerNote?.[lang] ?? t.expPartnerNote) : t.expPartnerNote}
              </p>
            </div>
            <div className={styles.secBody}>
              <div className={styles.expGrid}>
                {ownTours.length > 0
                  ? ownTours.map((tour) => (
                      <ExperienceCard
                        exp={ownAsExperience(tour)} own={tour} t={t} lang={lang}
                        partnerSlug={partner.slug} zone={partner.zone} pilotId={partner.pilotId} key={tour.id}
                        onOwnBook={() => track('host_guide_tour_click', { partner: partner.slug, city: city.id, tour: tour.id })}
                      />
                    ))
                  : t.experiences.filter((exp) => exp.id !== 'exp-own-plan').map((exp) => (
                      <ExperienceCard exp={exp} t={t} lang={lang} partnerSlug={partner.slug} zone={partner.zone} pilotId={partner.pilotId} key={exp.id} />
                    ))}
              </div>
              {t.experiences.filter((exp) => exp.id === 'exp-own-plan').map((exp) => (
                <ExperienceBanner
                  exp={exp} t={t} lang={lang} partnerSlug={partner.slug} zone={partner.zone} pilotId={partner.pilotId} key={exp.id}
                  operator={ownTours.length > 0 && partner.operatorWhatsApp
                    ? { label: partner.operatorWhatsApp.label[lang], href: partner.operatorWhatsApp.href }
                    : undefined}
                />
              ))}
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
              <a
                className={styles.discoverCard}
                href={dest.url[lang]}
                key={dest.name}
                onClick={() => track('host_guide_discover_click', { partner: partner.slug, city: city.id, destination: dest.name })}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={styles.discoverImg} src={dest.photoUrl} alt={dest.name} />
                <div className={styles.discoverOverlay} />
                <span className={styles.discoverLabel}>{dest.name}</span>
              </a>
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
