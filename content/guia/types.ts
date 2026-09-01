// content/guia/types.ts
//
// Types for the co-branded white-label guest guide at /guia/[partner].
//
// Two content layers (see /content/guia/cities and /content/guia/partners):
//   • City layer  — reusable across partners (zones, chip nav, food, maps).
//   • Partner layer — small + specific (slug, displayName, home colonia,
//     edition, planner campaign, optional insiders/host letter).
// The rendered page = template(city[partner.city] + partner).

export type Lang = 'es' | 'en'

/** A lucide-react icon key. Mapped to a component in GuiaClient. */
export type IconKey =
  | 'plane' | 'car' | 'cloudSun' | 'banknote' | 'wifi' | 'shield'
  | 'briefcase' | 'droplet' | 'moon' | 'parking'
  | 'coffee' | 'croissant' | 'utensilsSm' | 'basket' | 'trees' | 'cross'
  | 'landmark' | 'utensils' | 'baby' | 'martini' | 'compass' | 'clock'
  | 'cloudRain' | 'arrowDown' | 'iceCream' | 'mountain'

/** Inline link inside an arrival card body (e.g. the Airalo eSIM link). */
export interface InlineLink {
  text: string
  href: string
  /** Trailing copy rendered after the link. */
  after?: string
}

export interface ArrivalItem {
  icon: IconKey
  title: string
  /** Plain body. Supports the {neighborhood} token. */
  body: string
  /** When present, the body is followed by this link + its `after` copy. */
  link?: InlineLink
}

export interface Spot {
  icon: IconKey
  name: string
  distance: string
  note: string
}

export interface Neighborhood {
  /** Display name and chip label, e.g. "Roma Norte". */
  name: string
  /**
   * Optional per-language override for the chip/tab label and the "Google
   * Maps list · …" line, when the internal key (`name`) isn't guest-facing
   * copy — e.g. an address used as the zone id, shown to guests as
   * "Your house" / "Tu casa" instead of the raw street address.
   */
  tabLabel?: Record<Lang, string>
  /** Google Maps deep-link for "open list in Maps". */
  mapUrl: string
  /** One-line zone descriptor, shown under the heading (switches per tab). */
  tagline: Record<Lang, string>
  /** Honest distance/orientation line for this zone (switches per tab). */
  orientation: Record<Lang, string>
  spots: Record<Lang, Spot[]>
}

export interface MoodItem {
  name: string
  note: string
}

export interface Mood {
  id: string
  icon: IconKey
  label: string
  title: string
  items: MoodItem[]
}

export interface TodayItem {
  tag: string
  title: string
  /** Supports the {neighborhood} token. */
  body: string
}

export interface Experience {
  id: string
  title: string
  /** Short teaser line shown on the card face. */
  teaser: string
  /** One paragraph, or several for cards that need paragraph breaks. */
  description: string | string[]
  /** Clickable lead-in phrase (e.g. "Contact us via WhatsApp"), linking to howToBookLinkHref. */
  howToBookLinkText: string
  howToBookLinkHref: string
  /** How-to-book copy that follows the linked phrase. */
  howToBook: string
  /** One line, or two for cards with a primary + alternative booking window. */
  minBookingTime: string | string[]
  /** Optional "need it sooner?" note — omit for cards where it doesn't apply. */
  needSoonerNote?: string
}

export interface FoodCollection {
  tag: string
  name: string
  note: string
}

export interface Destination {
  name: string
  /** Public path under /public, e.g. /images/guides/oaxaca.jpg */
  photoUrl: string
}

/** Per-language copy block for a city. */
export interface CityCopy {
  navLabel: string
  heroEyebrow: string      // token: {host}
  heroTitle: string
  heroSub: string          // token: {neighborhood}
  beginExploring: string
  beforeEyebrow: string
  beforeH2: string
  beforeLede: string
  arrivalItems: ArrivalItem[]
  neighborhoodEyebrow: string
  neighborhoodH2: string         // zone-agnostic heading, identical across all zone tabs
  openInMapsLabel: string
  /** Maps card in the neighborhood header. {n} = place count. */
  mapCardPrimary: string
  mapCardSecondary: string
  moodEyebrow: string
  moodH2: string
  moodLede: string
  moods: Mood[]
  closeLabel: string
  todayDateLabel: string
  todayH2: string
  weatherTemp: string
  weatherBody: string
  todayItems: TodayItem[]
  expEyebrow: string
  expH2: string
  expLede: string
  /** Small sage line under the lede: booking handled by the local partner. */
  expPartnerNote: string
  /** Per-card inline WhatsApp booking link label. */
  expBookCta: string
  /** Toggle label for expanding a card's extra details (e.g. "Details"). */
  expDetailsCta: string
  /** Label above the description paragraph(s) in the expanded panel. */
  expDescriptionLabel: string
  /** Label above the how-to-book paragraph in the expanded panel. */
  expHowToBookLabel: string
  /** Label above the minimum booking time line(s) in the expanded panel. */
  expMinTimeLabel: string
  experiences: Experience[]
  foodEyebrow: string
  foodH2: string
  foodLede: string
  foodCollections: FoodCollection[]
  continueEyebrow: string
  continueH2: string
  continueLede: string
  continueCta: string
  /** Label for the fixed/sticky planner button. */
  stickyCta: string
  /** "El Itinerario" newsletter capture (in the dark band). */
  newsletterTitle: string
  newsletterBody: string
  newsletterPlaceholder: string
  newsletterCta: string
  newsletterFinePrint: string
  discoverEyebrow: string
  discoverH2: string
  footer: string
  /** Host letter (city-level copy; the signature name comes from the partner). */
  hostLetter: {
    eyebrow: string
    quote: string
    body: string
    roleLabel: string
  }
}

export interface ItineraryItem {
  time: string
  text: string
}

export interface ItineraryDay {
  title: string
  items: ItineraryItem[]
  /** Optional closing aside (rendered italic). */
  note?: string
}

/** Multi-day itinerary shown as the dark "48 hours" section. */
export interface Itinerary {
  eyebrow: string
  title: string
  lede: string
  days: ItineraryDay[]
  /** Full-width "open the whole route in Google Maps" button. */
  mapsCta: string
  mapsUrl: string
}

export interface City {
  id: string
  /** Hero background, public path. */
  heroImage: string
  /** Ordered colonia names for the chip nav; keys into `neighborhoods`. */
  neighborhoodOrder: string[]
  neighborhoods: Record<string, Neighborhood>
  destinations: Destination[]
  itinerary: Record<Lang, Itinerary>
  copy: Record<Lang, CityCopy>
}

/** A host's personal insider pick — partner-specific, optional. */
export interface InsiderPick {
  name: string
  note: string
}

export interface Partner {
  slug: string
  displayName: string
  /** Curator name shown in the hero eyebrow ("Curado por …"). */
  hostName: string
  /** City id, keys into the city registry. */
  city: string
  /** The colonia the property sits in; drives hero copy + "A perfect day". */
  homeNeighborhood: string
  /**
   * The "Your house" / "Tu casa" tab — the hyper-local, address-level pick
   * list. Partner-specific (unlike the other zone tabs, which are shared at
   * the city level), because it's literally the walk from this partner's
   * front door.
   */
  yourHouse: Neighborhood
  /** Small label, e.g. "Edición Julio 2026". Optional. */
  edition?: Record<Lang, string>
  /** utm_campaign value for the planner CTA. */
  plannerCampaign: string
  /** Signature name for the host letter. When set, the letter section renders. */
  hostLetterSignature?: string
  /**
   * Insiders section. Publishes ONLY when publish === true AND items exist,
   * so a partner without bespoke copy unpublishes cleanly (no empty hole).
   */
  insiders?: {
    publish: boolean
    eyebrow?: Record<Lang, string>
    h2?: Record<Lang, string>
    items?: Record<Lang, InsiderPick[]>
  }
}
