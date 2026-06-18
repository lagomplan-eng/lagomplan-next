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
   * Auth login completed. Fires on every Supabase SIGNED_IN event,
   * including the one that follows a fresh sign-up (so signup users
   * get BOTH completeRegistration + login — same as GA4's
   * recommended sign_up / login pair).
   *
   * Distinguished from `completeRegistration` because GA4 cohort
   * analysis ("new vs returning") depends on having BOTH events:
   * sign_up fires once, login fires every session.
   *
   * Meta custom: `Login`  ·  GA: `login`.
   */
  login(params?: { method?: string }) {
    metaTrackCustom('Login', params)
    gaTrack('login', params)
  },

  /**
   * Surface-agnostic error tracker. Fires to GA only (Meta marketing
   * pixel has no useful event for failures). Use for: AI generation
   * timeouts, validation gate failures, Stripe checkout creation
   * errors, auth errors — anything the user encounters as a broken
   * path that would otherwise only land in console.error.
   *
   * Keep `surface` short and stable so the dashboard can group by it
   * (e.g. 'planner-generate', 'checkout-create', 'auth-signup').
   *
   * GA: `error_occurred`.
   */
  errorOccurred(params: {
    surface:  string
    code?:    string
    message?: string
    /** Optional extra context — destination, trip_id, plan, etc. */
    meta?:    Record<string, string | number | boolean | undefined>
  }) {
    gaTrack('error_occurred', {
      surface: params.surface,
      code:    params.code,
      // Truncate message — GA4 has per-parameter size limits and
      // a stack trace would blow them out.
      message: params.message?.slice(0, 100),
      ...params.meta,
    })
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
   * Fired when a previously-saved trip is loaded from the DB (loadFromDB
   * success). Pure retention signal — fires once per DB load, regardless of
   * how much time has passed since creation. The days_since_creation param
   * lets dashboards split "just created moments ago" (still active session)
   * from "returned after N days" (real retention).
   *
   * Meta custom: `TripReopened`  ·  GA: `trip_reopened`.
   */
  tripReopened(params: { trip_id: string; days_since_creation?: number }) {
    metaTrackCustom('TripReopened', params)
    gaTrack('trip_reopened', params)
  },

  /**
   * Fired when a content page (guide, kit) is viewed. Acquisition signal —
   * lets the dashboard answer "which guides drive the most planner starts?"
   * and "do Smart Finds kit views convert to affiliate clicks?"
   *
   * `view_item` is the GA4-recommended event for content engagement;
   * ViewContent is the Meta canonical (used for retargeting audiences too).
   *
   * Meta: `ViewContent`  ·  GA: `view_item`.
   */
  contentViewed(params: {
    content_type: 'guide' | 'kit' | 'hotel' | 'destination'
    content_id:   string
    locale:       'es' | 'en'
    persona?:     string
  }) {
    metaTrack('ViewContent', {
      content_name:     params.content_id,
      content_category: params.content_type,
    })
    gaTrack('view_item', {
      item_id:       params.content_id,
      item_category: params.content_type,
      locale:        params.locale,
      persona:       params.persona,
    })
  },

  /**
   * Fired on the first input focus / first character typed in the planner
   * form, before submit. Captures users who STARTED but didn't finish — the
   * activation drop-off the form-submit `search` event can't see.
   *
   * Idempotent within a session via a useRef flag in HeroForm so it doesn't
   * fire on every keystroke.
   *
   * Meta custom: `PlannerStarted`  ·  GA: `planner_started`.
   */
  plannerStarted(params?: { source?: string }) {
    metaTrackCustom('PlannerStarted', params)
    gaTrack('planner_started', params)
  },

  /**
   * Fired the FIRST time a specific day card is expanded within a trip
   * session. Sampled via a useRef set keyed by trip_id+day_number — if the
   * user expands → collapses → expands the same day, only the first
   * expansion fires. Otherwise we'd flood GA's event budget.
   *
   * Engagement-depth signal: trips with 80%+ of days expanded reach a
   * different state of commitment than trips where the user only opened
   * Day 1.
   *
   * Meta custom: `ItineraryDayExpanded`  ·  GA: `itinerary_day_expanded`.
   */
  itineraryDayExpanded(params: { trip_id?: string; day_number: number }) {
    metaTrackCustom('ItineraryDayExpanded', params)
    gaTrack('itinerary_day_expanded', params)
  },

  /**
   * Trip completeness snapshot fired on page-hide (tab close, navigation
   * away). Captures the % of checks done in the final state the user
   * leaves the planner in for this session — the cleanest single
   * commitment signal we have.
   *
   * Pairs with the live `current_completeness` user_property which is
   * kept in sync on every check toggle for cohort filtering in GA
   * reports ("users who reached ≥80% completeness").
   *
   * Meta custom: `TripCompleteness`  ·  GA: `trip_completeness`.
   */
  tripCompleteness(params: {
    trip_id?:      string
    total_checks:  number
    done_checks:   number
    percentage:    number
  }) {
    metaTrackCustom('TripCompleteness', params)
    gaTrack('trip_completeness', params)
  },

  /**
   * Fired when the user edits the itinerary: adds a new block, removes
   * one, or modifies an existing one's details. Strong engagement
   * signal — most trips never get edited; the ones that do are
   * substantially more likely to be saved, shared, and reopened.
   *
   * `action` distinguishes the kind of edit so the dashboard can split
   * "creators" (lots of adds) from "curators" (lots of edits) from
   * "trimmers" (lots of removes). `item_type` carries the block type
   * (hotel / restaurant / tour / transfer / culture / nature / free)
   * when relevant; null for day-level operations.
   *
   * Fires per-action, NOT sampled — these are infrequent enough that
   * flooding GA's event budget isn't a concern (a power user might
   * edit 20 blocks in a session; 1000s of users isn't a problem).
   *
   * Meta custom: `ItineraryEdited`  ·  GA: `itinerary_edited`.
   */
  itineraryEdited(params: {
    trip_id?:    string
    day_number?: number
    action:      'add' | 'remove' | 'edit' | 'add_day'
    item_type?:  string
  }) {
    metaTrackCustom('ItineraryEdited', params)
    gaTrack('itinerary_edited', params)
  },

  /**
   * Fired the FIRST time a specific check is toggled (in either direction)
   * within a trip session. Sampled like itineraryDayExpanded. Tracks active
   * use of the readiness checklist — high check_toggled rate vs trip_saved
   * means the user is actively planning, not just generating-and-leaving.
   *
   * Meta custom: `CheckToggled`  ·  GA: `check_toggled`.
   */
  checkToggled(params: { trip_id?: string; check_id: string; milestone?: string }) {
    metaTrackCustom('CheckToggled', params)
    gaTrack('check_toggled', params)
  },

  /**
   * Fired when the user explicitly regenerates an itinerary (regenerate
   * button OR drawer "Actualizar plan" save). Engagement-quality signal:
   * a high regen rate means the AI defaults are wrong for that cohort and
   * we should look at the prompt / preferences UX.
   *
   * `reason` distinguishes manual retry from drawer-driven regen so the
   * dashboard can split "AI quality" from "preference change" causes.
   *
   * Meta custom: `RegenerateRequested`  ·  GA: `regenerate_requested`.
   */
  regenerateRequested(params: {
    trip_id?:    string
    reason:      'manual' | 'drawer-edit' | 'replace'
    destination: string
    nights:      number
  }) {
    metaTrackCustom('RegenerateRequested', params)
    gaTrack('regenerate_requested', params)
  },

  /**
   * Unified outbound affiliate click. Covers planner hotels, Smart Finds
   * product cards, day-block booking CTAs, and any future affiliate surface.
   * This is the ONLY affiliate-click emitter — the older GA-only
   * trackAffiliateClick (which fired a duplicate `affiliate_click`, no "d")
   * was removed in favor of this single canonical event.
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

  /**
   * User confirmed a hotel booking from the planner's "Ya reservé" form.
   * Distinct from `plannerHotelClicked` (intent to book) — this is the
   * realized conversion. Fired AFTER the booking metadata is saved
   * (optimistic UI; analytics fires alongside the save).
   *
   * Meta custom: `HotelBookingConfirmed`  ·  GA: `hotel_booking_confirmed`.
   */
  hotelBookingConfirmed(params: {
    tripId:          string | null
    accommodationId: string
    city:            string
    provider:        string
  }) {
    metaTrackCustom('HotelBookingConfirmed', {
      provider: params.provider,
      city:     params.city,
    })
    gaTrack('hotel_booking_confirmed', {
      trip_id:          params.tripId ?? undefined,
      accommodation_id: params.accommodationId,
      city:             params.city,
      provider:         params.provider,
    })
  },

  // ── Mobile companion view (app/[locale]/trips/[trip_id]) ──────────────────
  // The read-mostly trip view a traveler opens on their phone. These events
  // track engagement with that surface specifically, separate from the desktop
  // planner's lifecycle events above.

  /** Companion view loaded. `dayIndex` is the day auto-selected from today's date. */
  mobileViewOpened(params: { tripId: string; isOwner: boolean; dayIndex: number }) {
    metaTrackCustom('MobileViewOpened', { is_owner: params.isOwner })
    gaTrack('mobile_view_opened', {
      trip_id:   params.tripId,
      is_owner:  params.isOwner,
      day_index: params.dayIndex,
    })
  },

  /** Traveler tapped a different day pill on the Itinerario tab. */
  mobileViewDaySwitched(params: { tripId: string; dayIndex: number }) {
    metaTrackCustom('MobileViewDaySwitched')
    gaTrack('mobile_view_day_switched', {
      trip_id:   params.tripId,
      day_index: params.dayIndex,
    })
  },

  /** Traveler switched between Itinerario / Presupuesto / Qué llevar. */
  mobileViewTabSwitched(params: { tripId: string; tab: 'itin' | 'budget' | 'packing' }) {
    metaTrackCustom('MobileViewTabSwitched', { tab: params.tab })
    gaTrack('mobile_view_tab_switched', { trip_id: params.tripId, tab: params.tab })
  },

  /** Traveler expanded an activity to reveal its actions/notes. */
  mobileViewActivityExpanded(params: { tripId: string; activityType: string; dayIndex: number }) {
    metaTrackCustom('MobileViewActivityExpanded', { activity_type: params.activityType })
    gaTrack('mobile_view_activity_expanded', {
      trip_id:       params.tripId,
      activity_type: params.activityType,
      day_index:     params.dayIndex,
    })
  },

  /** Traveler saved a note and/or link on an activity. */
  mobileViewNoteSaved(params: { tripId: string; activityId: string; hasNote: boolean; hasLink: boolean }) {
    metaTrackCustom('MobileViewNoteSaved', { has_note: params.hasNote, has_link: params.hasLink })
    gaTrack('mobile_view_note_saved', {
      trip_id:     params.tripId,
      activity_id: params.activityId,
      has_note:    params.hasNote,
      has_link:    params.hasLink,
    })
  },

  /** Anonymous traveler subscribed via the in-view newsletter card. Also a Lead. */
  mobileViewNewsletterCaptured(params: { tripId: string }) {
    metaTrack('Lead', { content_name: 'mobile-view-newsletter' })
    gaTrack('mobile_view_newsletter_captured', { trip_id: params.tripId })
  },

  /** Traveler checked off a per-day task. */
  mobileViewTaskCompleted(params: { tripId: string; taskId: string; dayIndex: number }) {
    metaTrackCustom('MobileViewTaskCompleted')
    gaTrack('mobile_view_task_completed', {
      trip_id:   params.tripId,
      task_id:   params.taskId,
      day_index: params.dayIndex,
    })
  },
}
