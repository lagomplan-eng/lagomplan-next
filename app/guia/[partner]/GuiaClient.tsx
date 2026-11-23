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
import { sendHotelEvent } from '../../../lib/hotels/client'
import { isValidHotelCode } from '../../../lib/hotels/codes'
import {
  HOTEL_FOOTER_LINE, HOTEL_JUMP, HOTEL_PLAN_BUTTONS, HOTEL_PLANS_EYEBROW, hotelUpdatedLine, type HotelMode, type HotelOutboundId,
} from '../../../content/guia/hotel/config'
import { distanceLabel } from '../../../content/guia/hotel/distance'
import { THEME_LABEL, placeThemes } from '../../../content/guia/hotel/themes'
import { HOTEL_BOOK_LABEL, HOTEL_EXPERIENCES } from '../../../content/guia/hotel/experiences'
import { HOTEL_TIME_TITLE, quickPlanFor, stopMapUrl } from '../../../content/guia/hotel/time'
import { HOTEL_HOST_NAME, hotelReword, zonesHeading } from '../../../content/guia/hotel/rewords'
import { ZONE_LABEL, ZONE_NEIGHBORHOOD, ZONE_SLUG, ZONE_TAB_ORDER } from '../../../content/guia/hotel/zones'
import { withPilotUtm } from '../../../lib/guia/links'
import { getRoute } from '../../../lib/routes'
import { parseStay, stayHeading, type Stay } from '../../../lib/guia/stay'
import { applyArrivalOverride } from '../../../lib/guia/arrival'
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
import SectionHead from './SectionHead'
import AgendaSection from './AgendaSection'
import WeatherInline from './WeatherInline'
import type { Agenda } from '../../../content/guia/agenda/schema'
import { AGENDA_ENABLED } from '../../../content/guia/agenda/config'
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

/** Partner logo with a graceful fallback: if the file is missing or broken it
 *  warns in the console and shows the partner name instead of a broken image. */
function BrandLogo({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const fail = () => {
    console.warn(`[guia] logo failed to load: ${src} — showing "${alt}" instead`)
    setFailed(true)
  }
  // The server-rendered <img> can fail before React hydrates (so onError never
  // fires): re-check once on mount.
  useEffect(() => {
    const el = imgRef.current
    if (el && el.complete && el.naturalWidth === 0) fail()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src])
  if (failed) return <span className={className} style={{ width: 'auto', fontWeight: 600 }}>{alt}</span>
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img ref={imgRef} src={src} alt={alt} className={className} onError={fail} />
  )
}

/** Set by /demo/[prospect]: switches attribution, analytics naming and shows
 *  the "Demo prepared for" banner. Absent on the regular /guia route. */
export interface DemoMeta { slug: string; prospectName: string }

/** recordVisits: true only on production deployments (VERCEL_ENV, read on the
 *  server by the page). Local and Preview never write to guide_visits/demo_visits. */
export default function GuiaClient({ partner, city, demo, recordVisits = false, agenda, showUnverified = false, hotel }: {
  partner: Partner; city: City; demo?: DemoMeta; recordVisits?: boolean
  /** Hotel edition (/guia/cdmx/[zone]): this same guide with a short list of differences. Absent on every other guide. */
  hotel?: HotelMode
  /** Validated agenda data (server-loaded). Used only when partner.agenda is set. */
  agenda?: Agenda
  /** Render events still "to_verify" (Preview / local on /demo). Default false: /guia/* and Production never show them. */
  showUnverified?: boolean
}) {
  const [lang, setLang] = useState<Lang>('en')
  const [mood, setMood] = useState<string | null>(null)
  const [stay, setStay] = useState<Stay>({})
  const [browseNb, setBrowseNb] = useState<string>(hotel ? ZONE_NEIGHBORHOOD[hotel.zone] : (partner.defaultNeighborhood ?? HOME_TAB_ID))
  const [hotelCode, setHotelCode] = useState<string | null>(null)
  // Hotel edition: which plan of "How much time do you have?" is open (the short one by default, where it exists).
  const [plan, setPlan] = useState<'quick' | 'full'>(hotel && quickPlanFor(hotel.zone) ? 'quick' : 'full')
  const seenSections = useRef(new Set<string>())
  const [showSticky, setShowSticky] = useState(false)
  const insidersRef = useRef<HTMLElement | null>(null)

  const t = city.copy[lang]
  // Demo traffic must not pollute the real-partner pilot metrics, so every
  // host_guide_* event is renamed demo_guide_* on /demo.
  // Hotel edition: the same events under hotel_guide_*, tagged with the hotel code, never with the Livin partner.
  const trackSlug = hotel ? (hotelCode ?? `zone_${hotel.zone}`) : partner.slug
  const track = (name: string, params: Record<string, string | number | boolean | undefined>) =>
    hotel
      ? gaTrack(name.replace(/^host_guide_/, 'hotel_guide_'), { ...params, partner: trackSlug, partner_slug: trackSlug, zone: hotel.zone })
      : gaTrack(demo ? name.replace(/^host_guide_/, 'demo_guide_') : name, params)
  const hs = (id: string) => (hotel ? ({ 'data-hotel-section': id } as const) : {})
  const interp = (s: string) =>
    s.replace(/\{host\}/g, hotel ? HOTEL_HOST_NAME[lang] : partner.hostName).replace(/\{neighborhood\}/g, partner.homeNeighborhood)

  // ── ?lang=es|en seeds the toggle ────────────────────────────────────────
  // Kept as a post-mount effect (not a useState lazy initializer) so the
  // very first client render still matches the server-rendered 'en'
  // default — reading window.location here to decide initial state would
  // hydrate-mismatch a Spanish deep link against the English SSR HTML.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const requested = params.get('lang')
    if (requested === 'es' || requested === 'en') setLang(requested)

    if (hotel) {
      const h = params.get('h')
      if (isValidHotelCode(h)) setHotelCode(h)
    }

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
    if (hotel) {
      // Hotel edition: no lagom_ref (the guest is not a Livin guest) and no host_guide_view.
      gaTrack('hotel_guide_view', { partner_slug: trackSlug, zone: hotel.zone })
      return
    }
    const ref = demo ? `demo:${demo.slug}` : `host:${partner.slug}`
    try { window.localStorage.setItem('lagom_ref', ref) } catch { /* private mode */ }
    try {
      const secure = window.location.protocol === 'https:' ? '; Secure' : ''
      document.cookie = `lagom_ref=${encodeURIComponent(ref)}; Path=/; Max-Age=15552000; SameSite=Lax${secure}`
    } catch { /* cookies disabled */ }
    track('host_guide_view', { partner: partner.slug, city: city.id })
  }, [partner.slug, city.id, trackSlug])

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

  // ── Hotel edition: section_open + outbound_click per hotel (only when the URL carries ?h=) ──────────────
  useEffect(() => {
    if (!hotel || !hotelCode) return
    const seen = seenSections.current // once per section per page view, even when a plan swap re-observes
    const obs = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const id = (e.target as HTMLElement).dataset.hotelSection
        if (e.isIntersecting && id && !seen.has(id)) {
          seen.add(id)
          sendHotelEvent({ code: hotelCode, type: 'section_open', section: id, lang: document.documentElement.lang === 'es' ? 'es' : 'en' })
        }
      }
    }, { threshold: 0.3 })
    document.querySelectorAll('[data-hotel-section]').forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [hotel, hotelCode, plan])

  useEffect(() => {
    if (!hotel || !hotelCode) return
    const plannerPath = (l: Lang) => getRoute(l, 'planner')
    const classify = (a: HTMLAnchorElement): HotelOutboundId | null => {
      let u: URL
      try { u = new URL(a.href, window.location.origin) } catch { return null }
      const host = u.hostname.toLowerCase()
      if (host.endsWith('getyourguide.com')) return 'experience_book'
      if (host === 'airalo.tpm.li') return 'airalo'
      if (host === 'maps.app.goo.gl' || (host.endsWith('google.com') && u.pathname.startsWith('/maps'))) return 'map'
      if (host === 'wa.me' && u.pathname === '/') return 'share'
      if (u.origin === window.location.origin && (u.pathname === plannerPath('es') || u.pathname === plannerPath('en'))) return 'planner'
      return null
    }
    const onClick = (ev: MouseEvent) => {
      const a = (ev.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
      const id = a && classify(a)
      if (id) sendHotelEvent({ code: hotelCode, type: 'outbound_click', section: id, lang: document.documentElement.lang === 'es' ? 'es' : 'en' })
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [hotel, hotelCode])

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
  const plannerQuery = hotel
    ? new URLSearchParams({ utm_source: `${hotel.edition.utmSourcePrefix}${hotelCode ?? 'zone'}`, utm_medium: 'partner', utm_campaign: hotel.edition.planner.utmCampaign })
    : new URLSearchParams({
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
  // Hotel edition: no "Your house" tab (that is the Livin property's address), only the city zones.
  const nbOrder = hotel ? ZONE_TAB_ORDER[hotel.zone].filter((n) => city.neighborhoods[n]) : [HOME_TAB_ID, ...city.neighborhoodOrder]
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
  const faqGroupsAll = resolveFaqModule(partner, faqZone, lang)
  // Hotel edition: answers still on hold never render (a group left empty disappears with them).
  // Hotel edition: private chefs and massages never render; copy about "the apartment", "your host" and the
  // property is reworded for a hotel (content/guia/hotel/rewords.ts). A group left empty disappears with them.
  const rw = (x: string) => (hotel ? hotelReword(x, lang) : x)
  const faqKept = hotel && faqGroupsAll
    ? faqGroupsAll
        .map((g) => ({
          ...g,
          items: g.items
            .filter((it) => !hotel.hiddenFaqKeys.includes(it.key))
            .map((it) => ({ ...it, body: rw(it.body), links: it.links?.map((l) => ({ ...l, text: rw(l.text), after: l.after ? rw(l.after) : l.after })) })),
        }))
        .filter((g) => g.items.length > 0)
    : faqGroupsAll
  // Hotel edition: "Wine and liquor" moves from Eating in to Everyday errands, so it stays when Eating in empties out.
  const faqMoved = hotel && faqKept
    ? (() => {
        const wine = faqKept.flatMap((g) => g.items).find((it) => it.key === 'wineLiquor')
        if (!wine) return faqKept
        return faqKept
          .map((g) => g.id === 'errands' ? { ...g, items: [...g.items, wine] } : { ...g, items: g.items.filter((it) => it.key !== 'wineLiquor') })
          .filter((g) => g.items.length > 0)
      })()
    : faqKept
  const faqGroups = faqMoved && faqMoved.length > 0 ? faqMoved : null
  const resolvedFaqKeys = new Set(faqGroups?.flatMap((g) => g.items.map((it) => it.key)) ?? [])
  const visibleArrivalItems = t.arrivalItems
    .filter((item) => {
      if (!item.id || !partner.arrivalItemsOmit?.includes(item.id)) return true
      const counterpart = ARRIVAL_FAQ_COUNTERPART[item.id]
      // Omit only once the FAQ counterpart has actually resolved — otherwise
      // omitting here would delete the answer rather than relocate it.
      return !(counterpart && resolvedFaqKeys.has(counterpart))
    })
    .map((item) => applyArrivalOverride(item, partner.arrivalItemOverrides, lang))
    .map((item) => ({
      ...item,
      body: rw(interp(item.body)),
      ...(hotel && item.link ? { link: { ...item.link, text: rw(item.link.text), after: item.link.after ? rw(item.link.after) : item.link.after } } : {}),
    }))

  // Agenda layout (demos with display.agenda + agenda data, kill switch on): Experiences move under the
  // 48-hour itinerary and "A calm start to your trip" becomes collapsible. Everything else is unchanged.
  const agendaLayout = AGENDA_ENABLED && !!partner.agenda && !!agenda

  // Demo guides only (the `demo` prop): alternating section backgrounds (grey, cream, …, starting with
  // grey on "Explore by mood"), one section padding, mood tiles as anchors, kids block in Must-sees.
  // Everything else (Livin and every non-demo guide) keeps the previous markup exactly.
  const rhythm = !!demo
  let toneN = 0
  const nextTone = () => (toneN++ % 2 === 0 ? styles.sectionAlt : '')
  const kidsMood = t.moods.find((m) => m.id === 'kids' && m.items.length > 0) ?? null
  const MOOD_TARGET: Record<string, string> = { hungry: 'comer', culture: 'itinerario', hidden: 'zonas', short: 'itinerario' }
  const moodTarget = (id: string) => (id === 'kids' ? (kidsMood ? 'ninos' : undefined) : MOOD_TARGET[id])

  // Demo guides: "Explore by mood" tiles jump to the section they belong to; a tile without a target is not shown.
  const renderMood = (tone: string) => (
      <section className={`${styles.section} ${styles.rhythm} ${tone}`}>
        <div className={styles.container}>
          <div className={styles.secGrid}>
            <SectionHead eyebrow={t.moodEyebrow} title={t.moodH2} lede={t.moodLede} />
            <div className={styles.secBody}>
              <div className={styles.moodGrid}>
                {t.moods.filter((m) => moodTarget(m.id)).map((m) => (
                  <a
                    key={m.id}
                    href={`#${moodTarget(m.id)}`}
                    className={`${styles.moodBtn} ${styles.moodLink}`}
                    onClick={() => track('host_guide_mood_click', { partner: partner.slug, city: city.id, mood: m.id, target: moodTarget(m.id) })}
                  >
                    <Icon name={m.icon} color={PINE} />
                    <div className={styles.moodLabel}>{m.label}</div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
  )

  // Hotel edition helpers.
  // Theme marks (Art / Food and drink / Hidden gem) and, in a mood panel, the zone name: small labels in the guide's own style.
  const themeMarks = (name: string, zoneName?: string) => {
    const marks = placeThemes(name)
    if (marks.length === 0 && !zoneName) return null
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px 12px', marginTop: 6 }}>
        {marks.map((m) => <span key={m} className={styles.eyebrowMono} style={{ color: 'var(--coral)' }}>{THEME_LABEL[m][lang]}</span>)}
        {zoneName && <span className={styles.eyebrowMono} style={{ color: 'var(--sage)' }}>{zoneName}</span>}
      </div>
    )
  }
  const HOTEL_SHARE: Record<Lang, string> = { es: 'Enviar esta guía a mi teléfono', en: 'Send this guide to my phone' }
  const hotelShareHref = hotel
    ? `https://wa.me/?text=${encodeURIComponent(`${lang === 'es' ? `Mi guía de barrio de ${ZONE_LABEL[hotel.zone]}, de Lagomplan:` : `My ${ZONE_LABEL[hotel.zone]} neighborhood guide, from Lagomplan:`} ${typeof window === 'undefined' ? '' : `${window.location.origin}/guia/cdmx/${ZONE_SLUG[hotel.zone]}${hotelCode ? `?h=${hotelCode}` : ''}`}`.trim())}`
    : ''

  const renderExperiences = (tone: string) => (
      <section
        {...(rhythm ? { id: 'experiencias', className: `${styles.section} ${styles.rhythm} ${tone}` } : { className: `${styles.section} ${styles.sectionAlt}`, style: { paddingTop: 88, paddingBottom: 88 } })}
        {...hs('experiences')}
      >
        <div className={styles.container}>
          <div className={styles.secGrid}>
            <div className={styles.secHead}>
              <span className={styles.eyebrow}>{t.expEyebrow}</span>
              <h2 className={styles.h2}>{t.expH2}</h2>
              <p className={styles.lede} style={{ marginBottom: 8 }}>{t.expLede}</p>
              {!hotel && (
                <p className={styles.expPartnerNote}>
                  {ownTours.length > 0 ? (partner.experiencesPartnerNote?.[lang] ?? t.expPartnerNote) : t.expPartnerNote}
                </p>
              )}
            </div>
            <div className={styles.secBody}>
              <div className={styles.expGrid}>
                {hotel
                  ? HOTEL_EXPERIENCES.items.map((e) => {
                      const title = t.experiences.find((x) => x.id === e.id)?.title ?? e.id
                      return (
                        <div className={styles.expCard} key={e.id}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img className={styles.expImg} src={e.image} alt={title} />
                          <div className={styles.expBody}>
                            <div className={styles.expTextBlock}><h5 className={styles.h5}>{title}</h5><p className={styles.expNote}>{e.teaser[lang]}</p></div>
                            <div className={styles.expActions}>
                              <a
                                className={styles.expBookLink}
                                href={e.bookUrl}
                                target="_blank"
                                rel="sponsored noopener noreferrer"
                                onClick={() => trackOutboundLink({
                                  linkName: 'gyg_experience', href: e.bookUrl, partnerSlug: trackSlug, zone: hotel.zone, lang,
                                  section: 'experience_book', experienceName: e.id,
                                })}
                              >{HOTEL_BOOK_LABEL[lang]}</a>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  : ownTours.length > 0
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
              {(hotel ? [] : t.experiences.filter((exp) => exp.id === 'exp-own-plan')).map((exp) => (
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
  )

  const moodOriginal = (
      <section className={`${styles.section} ${styles.sectionAlt}`} style={{ paddingTop: 88, paddingBottom: 88 }} {...hs('moods')}>
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
                        {it.tag && <span className={styles.eyebrowMono} style={{ color: 'var(--coral)' }}>{it.tag}</span>}
                        <div className={styles.moodItemName}>{it.name}</div>
                        <div className={styles.moodItemNote}>{it.note}</div>
                        {hotel && themeMarks(it.name, it.zone)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
  )

  const HOTEL_PRACTICAL_TITLE: Record<Lang, string> = { es: 'Bueno saber', en: 'Good to know' }
  const HOTEL_WHERE_NEXT: Record<Lang, string> = { es: '¿Cuál es tu próximo destino?', en: 'Where next?' }
  const renderPractical = () => (
      <PracticalSection
        arrivalItems={visibleArrivalItems}
        faqGroups={faqGroups}
        atAGlance={partner.atAGlance}
        practicalSubhead={partner.practicalSubhead}
        partnerSlug={trackSlug}
        zone={partner.zone}
        pilotId={partner.pilotId}
        lang={lang}
        rhythm={rhythm}
        toneClass={rhythm ? nextTone() : ''}
        hotelSection={hotel ? 'practical' : undefined}
        headingOverride={hotel ? HOTEL_PRACTICAL_TITLE[lang] : undefined}
        keepSmallPanels={hotel ? true : undefined}
      />
  )
  const renderZones = () => (
      <section {...(rhythm ? { id: 'zonas', className: `${styles.section} ${styles.rhythm} ${nextTone()}` } : { className: `${styles.section} ${styles.sectionAlt}` })} {...hs('neighborhoods')}>
        <div className={styles.container}>
          <div className={styles.secGrid}>
            <div className={styles.secHead}>
              <span className={styles.eyebrow} style={{ color: 'var(--pine)' }}>{t.neighborhoodEyebrow}</span>
              <h2 className={styles.h2}>{hotel ? zonesHeading(lang, nbOrder.length) : t.neighborhoodH2}</h2>
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
                    >
                      {getNeighborhood(name).tabLabel?.[lang] ?? name}
                      {hotel && distanceLabel(hotel.zone, getNeighborhood(name).orientation, lang) && (
                        <span className={styles.eyebrowMono} style={{ marginLeft: 8 }}>{distanceLabel(hotel.zone, getNeighborhood(name).orientation, lang)}</span>
                      )}
                    </button>
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
                      {hotel && themeMarks(spot.name)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
  )
  const renderItinerary = () => (
      <section {...(rhythm ? { id: 'itinerario', className: `${styles.section} ${styles.rhythm} ${styles.lightBand} ${nextTone()}` } : { className: `${styles.section} ${styles.sectionPine}`, style: { paddingTop: 88, paddingBottom: 88 } })} {...hs('itinerary')}>
        <div className={styles.container}>
          <div className={styles.itinGrid}>
            <div className={styles.itinIntro}>
              <span className={styles.eyebrowMono} style={{ color: rhythm ? 'var(--sage)' : 'var(--sage-soft)' }}>{itin.eyebrow}</span>
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
  )
  const renderToday = () => (
      <section {...(rhythm ? { id: 'aqui', className: `${styles.section} ${styles.rhythm} ${nextTone()}` } : { className: styles.section, style: { paddingTop: 88, paddingBottom: 88 } })} {...hs('rhythm')}>
        <div className={styles.container}>
          <div className={styles.secGrid}>
            {rhythm ? (
              <div className={styles.secHead}>
                <span className={styles.eyebrow}>{t.todayDateLabel}</span>
                <h2 className={styles.h2}>{t.todayH2}</h2>
                <WeatherInline lang={lang} />
              </div>
            ) : (
              <SectionHead eyebrow={t.todayDateLabel} title={t.todayH2} />
            )}
            <div className={styles.secBody}>
              {!rhythm && <WeatherCard lang={lang} />}
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
  )
  const renderPlanner = () => (
      <section {...(rhythm ? { className: `${styles.section} ${styles.rhythm} ${styles.lightBand} ${nextTone()}` } : { className: `${styles.section} ${styles.sectionPine}`, style: { paddingTop: 96, paddingBottom: 96 } })} {...hs('planner')}>
        <div className={`${styles.container} ${styles.continueWrap}`}>
          <span className={`${styles.eyebrowMono} ${styles.continueEyebrow}`}>{t.continueEyebrow}</span>
          <h2 className={styles.continueH2}>{t.continueH2}</h2>
          <p className={styles.continueLede}>{t.continueLede}</p>
          <a className={styles.ctaPlanner} href={plannerHref} onClick={() => onPlannerClick('continue_section')}>
            {t.continueCta}
          </a>
          {!partner.hideNewsletter && !hotel && (
            <>
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
            </>
          )}
        </div>
      </section>
  )
  const heroHotel = hotel ? (
        <section className={styles.hero} {...hs('hero')}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.heroImg} src={city.heroImage} alt={lang === 'es' ? 'Ciudad de México' : 'Mexico City'} />
          <div className={styles.heroOverlay} />
          <div className={styles.heroContent}>
            <span className={styles.heroEyebrow}>{hotel.edition.heroEyebrow[lang]}</span>
            <h1 className={styles.heroTitle}>{hotel.edition.zoneHeadline[lang].replace('{zone}', ZONE_LABEL[hotel.zone])}</h1>
            <p className={styles.heroSub}>{hotel.edition.heroSub[lang]}</p>
            <p className={styles.heroSub} style={{ fontSize: 13, opacity: 0.8, marginTop: -8 }}>{hotelUpdatedLine(lang)}</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <a href="#zonas" className={styles.ctaLight}>{t.beginExploring} <Icon name="arrowDown" size={15} color={PINE} /></a>
              {hotel.edition.share && (
                <a href={hotelShareHref} target="_blank" rel="noopener noreferrer" className={styles.ctaLight}>{HOTEL_SHARE[lang]}</a>
              )}
            </div>
          </div>
        </section>
  ) : null

  // Hotel edition: "How much time do you have?" is a choice. With a short plan (Condesa) two buttons pick which plan is
  // shown; without one (Roma Norte, Polanco) the 48 hours plan shows directly, no buttons.
  const quick = hotel ? quickPlanFor(hotel.zone) : null
  const showQuick = !!quick && plan === 'quick'
  const timeSection = hotel ? (
    <div {...hs('time')}>
      <section className={`${styles.section} ${styles.sectionAlt}`} style={{ paddingTop: 88, paddingBottom: showQuick ? 88 : 40 }}>
        <div className={styles.container}>
          <div className={styles.secGrid}>
            <SectionHead eyebrow={HOTEL_PLANS_EYEBROW[lang]} title={HOTEL_TIME_TITLE[lang]} />
            <div className={styles.secBody}>
              {quick && (
                <div className={styles.nbControls}>
                  <div className={styles.tabRow} role="tablist" aria-label={HOTEL_TIME_TITLE[lang]}>
                    {([['quick', HOTEL_PLAN_BUTTONS.quick], ['full', HOTEL_PLAN_BUTTONS.full]] as const).map(([id, label]) => (
                      <button
                        key={id}
                        type="button"
                        role="tab"
                        aria-selected={plan === id}
                        className={`${styles.tab} ${plan === id ? styles.tabActive : ''}`}
                        onClick={() => setPlan(id)}
                      >{label[lang]}</button>
                    ))}
                  </div>
                </div>
              )}
              {showQuick && quick && (
                <>
                  <div className={styles.spotList}>
                    {quick.stops.map((stop) => (
                      <div className={styles.spotRow} key={stop.name}>
                        <div className={styles.spotIcon}><Icon name={stop.icon} size={16} color={PINE} /></div>
                        <div>
                          <div className={styles.spotHead}><h5 className={styles.h5}>{stop.name}</h5><span className={styles.spotDist}>{stop.where}</span></div>
                          <p className={styles.spotNote}>{stop.note[lang]}</p>
                          {themeMarks(stop.name)}
                          <p className={styles.spotNote}>
                            <a className={styles.link} href={stopMapUrl(stop)} target="_blank" rel="noopener noreferrer">{lang === 'es' ? 'Mapa' : 'Map'}</a>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className={styles.nbTagline} style={{ marginTop: 18 }}>{quick.line[lang]}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      {!showQuick && renderItinerary()}
    </div>
  ) : null

  // Hotel edition: jump menu under the banner (chips) and the offset anchors it scrolls to (the header is sticky).
  const anchor = (id: string) => <span id={id} aria-hidden="true" style={{ display: 'block', height: 0, position: 'relative', top: -96 }} />
  const jumpMenu = hotel ? (
    <div className={styles.container} style={{ paddingTop: 24, paddingBottom: 4 }}>
      <nav aria-label={lang === 'es' ? 'Ir a' : 'Jump to'}>
        <div className={styles.tabRow}>
          {HOTEL_JUMP.map((j) => (
            <a key={j.id} href={`#${j.id}`} className={styles.tab} style={{ display: 'inline-block', textDecoration: 'none' }}>{j.label[lang]}</a>
          ))}
        </div>
      </nav>
    </div>
  ) : null

  // Hotel edition: the destination guide cards (as in the old "Lagomplan goes further" section), right after the invitation.
  const destinationsSection = hotel ? (
    <section className={styles.section} style={{ paddingTop: 88, paddingBottom: 88 }} {...hs('discover')}>
      <div className={styles.containerWide}>
        <span className={styles.eyebrow}>{HOTEL_WHERE_NEXT[lang]}</span>
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
  ) : null

  return (
    <div
      className={`${styles.page} ${partner.brand?.accent ? styles.accented : ''}${partner.placeholderPill ? ` ${styles.phPill}` : ''}`}
      style={partner.brand?.accent || partner.placeholderPill
        ? ({
            ...(partner.brand?.accent ? { '--accent': partner.brand.accent } : {}),
            ...(partner.placeholderPill ? { '--ph-label': JSON.stringify(partner.placeholderPill[lang]) } : {}),
          } as React.CSSProperties)
        : undefined}
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
              <BrandLogo src={partner.brand!.logo!} alt={partner.displayName} className={styles.hmtLogo} />
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
                <BrandLogo src={partner.brand.logo} alt={partner.displayName} className={styles.coBrandLogo} />
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

      {hotel ? (
        <>
          {/* Hotel order: welcome, zones, how much time, mood, weekly rhythm, experiences, good to know, one Lagomplan block. */}
          {heroHotel}
          {jumpMenu}
          {anchor('zonas')}
          {renderZones()}
          {anchor('planes')}
          {timeSection}
          {moodOriginal}
          {renderToday()}
          {anchor('experiencias')}
          {renderExperiences('')}
          {anchor('bueno-saber')}
          {renderPractical()}
          {renderPlanner()}
          {destinationsSection}
        </>
      ) : (
        <>
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
        <section className={rhythm ? `${styles.section} ${styles.rhythm}` : styles.section}>
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
                  <BrandLogo src={partner.brand!.logo!} alt={partner.displayName} className={styles.letterSigLogo} />
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

      {partner.hostLetterSignature && !splitLetter && !hotel && (
        <section className={rhythm ? `${styles.section} ${styles.rhythm}` : styles.section}>
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

      {rhythm && !agendaLayout && renderMood(nextTone())}

      {/* ── 2. The practical part (arrival items + FAQ, merged) ── */}
      {renderPractical()}

      {/* ── 3. Your neighborhood ───────────────────────────── */}
      {renderZones()}

      {/* ── 4. 48-hour itinerary (dark) ────────────────────── */}
      {renderItinerary()}

      {/* Agenda layout: Experiences sit right under the 48-hour itinerary (otherwise they stay after the weekly/agenda section). */}
      {agendaLayout && renderExperiences(nextTone())}
      {/* Agenda layout: "Explore by mood" follows "Worth the time" instead of the host letter. */}
      {agendaLayout && renderMood(nextTone())}

      {!rhythm && moodOriginal}

      {/* ── 6. Today ───────────────────────────────────────── */}
      {agendaLayout ? (
        <AgendaSection
          lang={lang}
          agenda={agenda}
          showUnverified={showUnverified}
          toneClass={nextTone()}
          onTrack={(name, params) => track(name, { partner: partner.slug, city: city.id, ...params })}
        />
      ) : renderToday()}

      {!agendaLayout && renderExperiences(rhythm ? nextTone() : '')}

      {/* ── 8. Food ────────────────────────────────────────── */}
      <section {...(rhythm ? { id: 'comer', className: `${styles.section} ${styles.rhythm} ${nextTone()}` } : { className: styles.section, style: { paddingTop: 88, paddingBottom: 88 } })} {...hs('food')}>
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
              {/* Demo guides: the kids picks of the city layer (same data as the "Traveling with kids" mood), as a small block. */}
              {rhythm && kidsMood && (
                <div id="ninos" className={styles.kidsBlock}>
                  <h3 className={styles.kidsTitle}>{kidsMood.title}</h3>
                  <div className={styles.foodGrid}>
                    {kidsMood.items.slice(0, 6).map((it, i) => (
                      <div className={styles.foodCard} key={i}>
                        <h5 className={`${styles.h5} ${styles.foodName}`}>{it.name}</h5>
                        <p className={styles.foodNote}>{it.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Insiders (partner-specific, published only) ────── */}
      {insidersPublished && insiders?.items && (
        <section
          ref={insidersRef}
          {...(rhythm ? { className: `${styles.section} ${styles.rhythm} ${nextTone()}` } : { className: `${styles.section} ${styles.sectionAlt}`, style: { paddingTop: 88, paddingBottom: 88 } })}
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
      {renderPlanner()}

      {/* ── 10. Discover more ──────────────────────────────── */}
      <section {...(rhythm ? { className: `${styles.section} ${styles.rhythm} ${nextTone()}` } : { className: styles.section, style: { paddingTop: 88, paddingBottom: 88 } })} {...hs('discover')}>
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
        </>
      )}

      <div className={styles.footer}>
        {hotel && <span className={styles.footerText} style={{ display: 'block', marginBottom: 6 }}>{HOTEL_FOOTER_LINE[lang]}</span>}
        <span className={styles.footerText}>{t.footer}</span>
      </div>

      {/* ── Fixed planner CTA (carries the same attributed link); the hotel edition has no floating button ── */}
      {!hotel && (
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
      )}
    </div>
  )
}
