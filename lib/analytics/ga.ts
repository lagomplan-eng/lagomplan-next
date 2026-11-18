/**
 * lib/analytics/ga.ts
 *
 * Typed wrapper around Google Analytics 4's `window.gtag` global.
 *
 * The base loader + `gtag('config', …)` are emitted by the inline
 * <Script> in app/[locale]/layout.tsx. After that, every event goes
 * through this module — same rationale as the Meta wrapper next door.
 *
 * Notes on the App Router fix this enables:
 *
 *   GA4's gtag('config', GA_ID) auto-fires `page_view` once when the
 *   library loads. App Router client navs do NOT re-trigger config, so
 *   subsequent virtual page changes are missed by default. The base
 *   <Script> sends `send_page_view: false` to disable the auto-fire,
 *   and `<GoogleAnalyticsTracker>` fires `page_view` on every URL
 *   change (including the initial load) via usePathname/useSearchParams.
 */

import { analyticsDebug } from './debug'

declare global {
  interface Window {
    gtag?:      (command: string, ...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

const MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

/** True when GA4 is configured for this build. */
export const isGAEnabled = !!MEASUREMENT_ID

/**
 * Fire any GA4 event with optional parameters.
 *
 * Param type is `object` rather than `Record<string, unknown>` so
 * call-site interfaces with optional fields (ContentParams,
 * CheckoutParams, etc.) are assignable without a cast under TS strict.
 */
export function gaTrack(
  event:  string,
  params?: object,
): void {
  if (typeof window === 'undefined') return
  const gtagLoaded = typeof window.gtag === 'function'
  analyticsDebug(`GA ${event}`, params ?? {}, { gtagLoaded })
  if (!gtagLoaded) return
  if (params && Object.keys(params).length > 0) {
    window.gtag!('event', event, params)
  } else {
    window.gtag!('event', event)
  }
}

/** Fire a page_view event. Called by the route-change tracker. */
export function gaPageView(path: string, title?: string): void {
  if (typeof window === 'undefined') return
  const gtagLoaded = typeof window.gtag === 'function'
  analyticsDebug(`GA page_view`, { path, title }, { gtagLoaded })
  if (!gtagLoaded) return
  if (!MEASUREMENT_ID) return
  window.gtag!('event', 'page_view', {
    page_path:     path,
    page_location: typeof window !== 'undefined' ? window.location.href : path,
    page_title:    title ?? (typeof document !== 'undefined' ? document.title : ''),
    send_to:       MEASUREMENT_ID,
  })
}

/**
 * The three /guia contexts an outbound partner link (Insider, Airalo) can
 * sit in — deliberately distinct, not collapsed into one "guide" bucket:
 * a passing mention in "Before you arrive" carries different intent than
 * the experience card's own "Book" button, which is the highest-intent
 * action on the page.
 */
// services_contact added 2026-09-28 (Livin brief, Take care tab) — chef
// and massage outbound links (WhatsApp, Book online, Mapa, Take a Chef).
// Catalog pages: the card and the plan panel are separate sections, so a booking click can be
// attributed to where it happened:
//   experience_hub  booking link on a card of the /experiencias hub
//   experience_plan booking link inside the plan panel, for an experience
//   hotels_index    booking link on a card of the Hoteles page
//   hotels_plan     booking link inside the plan panel, for a hotel
export type PartnerLinkSection = 'before_you_arrive' | 'experience_book' | 'experience_details' | 'services_contact' | 'experience_hub' | 'experience_plan' | 'hotels_index' | 'hotels_plan'

/**
 * Fires partner_link_click for any of the four tracked render sites
 * (PracticalCard's InlineLink, the experience "Book" button, the
 * experience details "how to book" link, and Take care's services_contact
 * links). One implementation, four call sites — see lib/guia/links.ts for
 * the UTM side of this (Insider only, never Airalo).
 */
export function trackOutboundLink(params: {
  linkName: 'insider' | 'airalo' | 'chef_whatsapp' | 'chef_take_a_chef' | 'massage_book' | 'massage_whatsapp' | 'massage_map' | 'gyg_experience' | 'hotel_booking'
  href: string
  partnerSlug: string
  zone?: string
  lang: string
  section: PartnerLinkSection
  experienceName?: string
  /** Hub only (gyg_experience). Stable experience id from the guide file. */
  experienceId?: string
  /** Hoteles only (hotel_booking). Stable hotel id from the guide / World Cup data. */
  hotelId?: string
  /** Hub and Hoteles. 1-based position in the list the traveler was looking at (the card list, or the plan panel for the *_plan sections). */
  position?: number
  /** Hub only. The booking provider, passed explicitly ('gyg'). */
  provider?: string
  /**
   * Hub only. Registry key of the place (e.g. 'ciudad-de-mexico'). Kept apart from
   * `destination`, which stays the outbound hostname for every link_name.
   */
  destinationSlug?: string
}): void {
  let destination = params.href
  try { destination = new URL(params.href).hostname } catch { /* leave as-is if unparseable */ }

  gaTrack('partner_link_click', {
    link_name: params.linkName,
    partner_slug: params.partnerSlug,
    ...(params.zone ? { zone: params.zone } : {}),
    lang: params.lang,
    section: params.section,
    destination,
    ...(params.experienceName ? { experience_name: params.experienceName } : {}),
    ...(params.experienceId ? { experience_id: params.experienceId } : {}),
    ...(params.hotelId ? { hotel_id: params.hotelId } : {}),
    ...(params.position !== undefined ? { position: params.position } : {}),
    ...(params.provider ? { provider: params.provider } : {}),
    ...(params.destinationSlug ? { destination_slug: params.destinationSlug } : {}),
  })
}
