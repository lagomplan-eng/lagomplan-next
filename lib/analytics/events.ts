/**
 * lib/analytics/events.ts
 *
 * High-level event surface for the Lagomplan growth team. Every event
 * fires to BOTH Meta Pixel and Google Analytics 4 with a single call,
 * using the parameter shape each provider expects.
 *
 * Why this layer:
 *
 *   Without it, every component that wants to track "user submitted the
 *   planner form" needs to know the GA event name (`generate_lead`),
 *   the Meta standard event name (`Lead`), and how their parameter
 *   shapes differ. Adding a third provider later (e.g. TikTok Pixel)
 *   would require touching every call site.
 *
 *   With it, the component calls `events.lead({ value: 199 })` and the
 *   provider mapping is one diff in this file.
 *
 * Naming convention:
 *
 *   - Method name = the Lagomplan action in camelCase (`itineraryGenerated`).
 *   - Meta standard events keep their canonical names (`Lead`, `Search`).
 *   - Lagomplan-specific events become Meta custom events with the
 *     PascalCase form of the method name (`ItineraryGenerated`).
 *   - GA event name uses snake_case Google's recommended events catalog
 *     where there's a match (`generate_lead`, `view_item`, `search`),
 *     otherwise the snake_case form of the method name.
 */

import { metaTrack, metaTrackCustom } from './meta'
import { gaTrack } from './ga'

// ── Standard / recommended events ──────────────────────────────────────────────

interface ContentParams {
  content_name?:     string
  content_category?: string
  content_ids?:      string[]
  value?:            number
  currency?:         string
}

interface CheckoutParams {
  value?:        number
  currency?:     string
  content_name?: string
  num_items?:    number
}

export const events = {
  /**
   * A user submitted info (form, signup, newsletter) suitable for the
   * top of a paid-ads funnel.  Meta: `Lead`  ·  GA: `generate_lead`.
   */
  lead(params?: { content_name?: string; value?: number; currency?: string }) {
    metaTrack('Lead', params)
    gaTrack('generate_lead', params)
  },

  /**
   * User viewed something we'd target ads to (a guide, a pricing page,
   * an itinerary detail).  Meta: `ViewContent`  ·  GA: `view_item`.
   */
  viewContent(params: ContentParams) {
    metaTrack('ViewContent', params)
    gaTrack('view_item', params)
  },

  /**
   * Planner form submitted with a destination string.
   * Meta: `Search`  ·  GA: `search`.
   */
  search(params: { search_string: string; destination?: string }) {
    metaTrack('Search', { search_string: params.search_string })
    gaTrack('search', { search_term: params.search_string })
  },

  /**
   * Stripe Checkout session created from the pricing page or paywall.
   * Meta: `InitiateCheckout`  ·  GA: `begin_checkout`.
   */
  initiateCheckout(params: CheckoutParams & { plan?: string }) {
    metaTrack('InitiateCheckout', params)
    gaTrack('begin_checkout', params)
  },

  /**
   * Auth signup completed (Supabase confirmation handled).
   * Meta: `CompleteRegistration`  ·  GA: `sign_up`.
   */
  completeRegistration(params?: { method?: string }) {
    metaTrack('CompleteRegistration', params)
    gaTrack('sign_up', params)
  },

  /**
   * Stripe webhook fulfilled — fired browser-side from the success
   * landing page. Eventually move to Conversions API for reliability;
   * see lib/analytics/meta.ts header for guidance.
   * Meta: `Purchase`  ·  GA: `purchase`.
   */
  purchase(params: CheckoutParams & { transaction_id?: string }) {
    metaTrack('Purchase', params)
    gaTrack('purchase', params)
  },

  /**
   * Contact form submitted.
   * Meta: `Contact`  ·  GA: `contact`.
   */
  contact() {
    metaTrack('Contact')
    gaTrack('contact')
  },

  // ── Lagomplan-specific custom events ────────────────────────────────────────

  /**
   * AI itinerary generation completed successfully.
   * Meta custom: `ItineraryGenerated`  ·  GA: `itinerary_generated`.
   */
  itineraryGenerated(params: {
    destination: string
    nights:      number
    locale:      'es' | 'en'
    traveler?:   string
  }) {
    metaTrackCustom('ItineraryGenerated', params)
    gaTrack('itinerary_generated', params)
  },

  /**
   * Outbound click on a hotel affiliate link (Booking/Hotels.com via Stay22).
   * Meta custom: `HotelAffiliateClick`  ·  GA: `hotel_affiliate_click`.
   */
  hotelAffiliateClick(params: { provider: string; destination: string }) {
    metaTrackCustom('HotelAffiliateClick', params)
    gaTrack('hotel_affiliate_click', params)
  },

  /**
   * Outbound click on any partner (activities, flights, transfers).
   * Meta custom: `OutboundPartnerClick`  ·  GA: `outbound_partner_click`.
   */
  outboundPartnerClick(params: { provider: string; category: string }) {
    metaTrackCustom('OutboundPartnerClick', params)
    gaTrack('outbound_partner_click', params)
  },

  /**
   * Newsletter subscribe success (popup, sidebar, end-of-guide, footer).
   * Mirrors `lead` for Meta but adds a custom GA event for surface
   * attribution.
   */
  waitlistSignup(params: { surface: 'popup' | 'sidebar' | 'end-of-guide' | 'footer' }) {
    metaTrack('Lead', { content_name: `newsletter-${params.surface}` })
    gaTrack('waitlist_signup', params)
  },

  /**
   * A guide was opened in print/PDF view.
   * Meta custom: `GuideDownload`  ·  GA: `guide_download`.
   */
  guideDownload(params: { slug: string; locale: 'es' | 'en' }) {
    metaTrackCustom('GuideDownload', params)
    gaTrack('guide_download', params)
  },

  /**
   * Generic CTA click — pass `cta_id` for in-page heatmaps.
   */
  ctaClick(params: { cta_id: string; surface?: string }) {
    metaTrackCustom('CtaClick', params)
    gaTrack('cta_click', params)
  },

  // ── Planner monetization-reliability funnel ─────────────────────────────────
  //
  // These events instrument the hotel-monetization pipeline (see
  // lib/planner/validate-trip.ts + app/api/generate-trip/route.ts). They
  // exist primarily for ops dashboards and revenue-leak alerts rather than
  // ad attribution, which is why they only fire to GA — Meta's standard
  // events don't have a natural mapping for "validation gate triggered."

  /**
   * Fired when the planner generates an itinerary that triggered the
   * validation gate's fallback path. Tracking this is how we'll know
   * if AI prompt drift is causing the synthesizer to fire more often.
   */
  plannerFallbackUsed(params: { destination: string; nights: number; reason: string }) {
    gaTrack('planner_fallback_used', params)
  },

  /**
   * Fired on every accommodation render (Phase 2 — left in place now so
   * Phase 2 doesn't need to touch this file). `source` separates
   * AI-recommended rows from synthesized stubs in the dashboard.
   */
  plannerHotelRendered(params: {
    tripId:       string | null
    accommodationId: string
    source:       'ai' | 'fallback'
    nights:       number
  }) {
    gaTrack('planner_hotel_rendered', params)
  },

  /**
   * Fired when a user clicks any hotel/accommodation CTA in the planner.
   * Pairs with events.hotelAffiliateClick (above) when the click is
   * specifically on a Stay22 affiliate link.
   */
  plannerHotelClicked(params: {
    tripId:       string | null
    accommodationId: string
    source:       'ai' | 'fallback'
    provider:     string
    city:         string
  }) {
    metaTrackCustom('PlannerHotelClicked', { provider: params.provider, city: params.city })
    gaTrack('planner_hotel_clicked', params)
  },
}
