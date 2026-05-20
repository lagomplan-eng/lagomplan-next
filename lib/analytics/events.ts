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
   *
   * trip_id is included when the purchase was triggered from a trip
   * context (paywall on planner page) so revenue can be attributed to
   * the trip that drove it.
   * Meta: `Purchase`  ·  GA: `purchase`.
   */
  purchase(params: CheckoutParams & { transaction_id?: string; trip_id?: string }) {
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
   *
   * `trip_id` is optional because at firing-time the DB autosave hasn't
   * happened yet — we get the real ID a few moments later via tripSaved.
   * Pass a client-generated UUID (or whatever's in the URL/state) when
   * available; analytics will resolve it server-side via the link emitted
   * by tripSaved.
   */
  itineraryGenerated(params: {
    destination: string
    nights:      number
    locale:      'es' | 'en'
    traveler?:   string
    trip_id?:    string
  }) {
    metaTrackCustom('ItineraryGenerated', params)
    gaTrack('itinerary_generated', params)
  },

  /**
   * Fired the FIRST time a trip is persisted to the DB (autosave success).
   * Carries the canonical DB trip_id so analytics can stitch this onto the
   * preceding itineraryGenerated event. Fires once per trip — distinguishes
   * "trips that survived past the result page" from "trips the user
   * abandoned after one look."
   * Meta custom: `TripSaved`  ·  GA: `trip_saved`.
   */
  tripSaved(params: { trip_id: string; signed_in: boolean }) {
    metaTrackCustom('TripSaved', params)
    gaTrack('trip_saved', params)
  },

  /**
   * Fired when the user copies a share link from TripShareModal.
   * Strong commitment signal — sharing implies the trip is "real enough"
   * to send to friends/family.
   * Meta custom: `TripShared`  ·  GA: `trip_shared`.
   */
  tripShared(params: { trip_id: string; audience?: 'link' | 'whatsapp' | 'email' }) {
    metaTrackCustom('TripShared', params)
    gaTrack('trip_shared', params)
  },

  /**
   * Unified outbound affiliate click. Covers planner hotels, Smart Finds
   * product cards, day-block booking CTAs, and any future affiliate surface.
   *
   * Use this rather than the older trackAffiliateClick in lib/booking.ts —
   * that one was GA-only and bypassed the events abstraction.
   *
   * Meta custom: `AffiliateClicked`  ·  GA: `affiliate_clicked`.
   */
  affiliateClicked(params: {
    /** Vendor / network the user is being sent to (booking, hotels, amazon, viator, stay22, …). */
    provider:    string
    /** What surface the click came from (planner-hotels, smart-finds-card, day-block-modal, …). */
    surface:     string
    /** Editorial category if relevant (hotel, tour, restaurant, product, …). */
    category?:   string
    /** Destination city when the click is trip-scoped. */
    destination?: string
    /** Trip-id stamp when available — None on Smart Finds pages, present on planner clicks. */
    trip_id?:    string
    /** Free-form metadata (product_id, kit_id, item_id, etc.). */
    meta?:       Record<string, string | number | boolean | undefined>
  }) {
    metaTrackCustom('AffiliateClicked', {
      provider: params.provider,
      surface:  params.surface,
      category: params.category,
    })
    gaTrack('affiliate_clicked', {
      provider:    params.provider,
      surface:     params.surface,
      category:    params.category,
      destination: params.destination,
      trip_id:     params.trip_id,
      ...params.meta,
    })
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
  waitlistSignup(params: { surface: 'popup' | 'sidebar' | 'end-of-guide' | 'footer' | 'pdf' }) {
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
   * Pairs with events.affiliateClicked when the click is specifically on
   * a Stay22 affiliate link — both fire together for hotel surfaces.
   *
   * tripId is accepted in the function signature for backward compat with
   * existing call sites, but emitted to GA as the canonical snake_case
   * `trip_id` so the custom dimension matches every other event.
   */
  plannerHotelClicked(params: {
    tripId:          string | null
    accommodationId: string
    source:          'ai' | 'fallback'
    provider:        string
    city:            string
  }) {
    metaTrackCustom('PlannerHotelClicked', { provider: params.provider, city: params.city })
    gaTrack('planner_hotel_clicked', {
      trip_id:         params.tripId ?? undefined,
      accommodationId: params.accommodationId,
      source:          params.source,
      provider:        params.provider,
      city:            params.city,
    })
    // Also fire the unified affiliateClicked event so the monetization
    // dashboard's "total affiliate clicks" rolls up consistently across
    // surfaces. Both events together let the dashboard slice on either
    // "hotel-specific" (planner_hotel_clicked) or "any affiliate"
    // (affiliate_clicked).
    metaTrackCustom('AffiliateClicked', { provider: params.provider, surface: 'planner-hotels' })
    gaTrack('affiliate_clicked', {
      provider:    params.provider,
      surface:     'planner-hotels',
      category:    'hotel',
      destination: params.city,
      trip_id:     params.tripId ?? undefined,
      accommodation_id: params.accommodationId,
      source:      params.source,
    })
  },
}
