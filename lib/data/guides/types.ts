/**
 * lib/data/guides/types.ts
 *
 * Type definitions for the new Guide Page data layer.
 * Language-agnostic: content is pre-translated per file (es.ts / en.ts).
 * Components receive a GuidePageData object with the correct locale's strings.
 */

// ── Atoms ──────────────────────────────────────────────────────────────────────

export interface DayItem {
  time: string
  title: string
  description: string
  badges?: string[]
}

export interface ItineraryDay {
  dayNumber: number
  /** e.g. "Viernes" / "Friday" */
  dayLabel: string
  title: string
  items: DayItem[]
}

export interface HotelData {
  number: string
  name: string
  /** e.g. "Hotel boutique · Lago" */
  type: string
  priceTier: '$' | '$$' | '$$$'
  description: string
  /** Short pill text: "Mejor para familias con niños" */
  highlight: string
  bookingUrl?: string
}

export interface ExperienceData {
  number: string
  name: string
  description: string
  tags: string[]
  bookingUrl?: string
  bookingLabel: string
}

export interface ChecklistItem {
  emoji: string
  label: string
}

export interface TransportOption {
  icon: string
  name: string
  /** e.g. "2–2.5 hrs" or "~$250 MXN ida" */
  badge: string
  description: string
  tip?: string
}

// ── Section blocks ─────────────────────────────────────────────────────────────

export interface HeroData {
  /** e.g. "Guía curada · Naturaleza & Aventura" */
  eyebrow: string
  title: string
  subtitle: string
  chips: string[]
  /** Floating tag on hero image, e.g. "Estado de México" */
  imageTag: string
  coverImage?: string
}

export interface ItinerarySection {
  eyebrow: string
  title: string
  description: string
  days: ItineraryDay[]
}

export interface HotelsSection {
  eyebrow: string
  title: string
  description: string
  items: HotelData[]
}

export interface ExperiencesSection {
  eyebrow: string
  title: string
  description: string
  items: ExperienceData[]
}

export interface TipsSection {
  eyebrow: string
  title: string
  items: string[]
  funFact?: {
    eyebrow: string
    text: string
  }
}

export interface ChecklistSection {
  eyebrow: string
  title: string
  items: ChecklistItem[]
}

export interface TransportSection {
  eyebrow: string
  title: string
  options: TransportOption[]
}

export interface PlanCtaSection {
  eyebrow: string
  title: string
  description: string
  buttonText: string
}

// ── FlatGuide ─────────────────────────────────────────────────────────────────
// Flat, spec-compliant format used for docx-sourced guides.
// Adapted to GuidePageData at runtime via lib/data/guides/adapter.ts

export interface FlatDayItem {
  time: string
  title: string
  description: string
  tags: string[]
}

export interface FlatDay {
  day: number
  title: string
  items: FlatDayItem[]
}

export interface FlatHotel {
  name: string
  /** e.g. "Hotel boutique · Lago" */
  type: string
  priceTier: '$' | '$$' | '$$$'
  description: string
  /** Short pill text */
  tag: string
  affiliateUrl: string
}

export interface FlatExperience {
  name: string
  description: string
  tags: string[]
  affiliateUrl: string
}

export interface FlatTransport {
  mode: string
  description: string
  tip?: string
}

export interface FlatGuide {
  slug: string
  locale: string
  hero: {
    title: string
    subtitle: string
    /** Kicker from source doc, e.g. "Guía curada · Viaje familiar" */
    eyebrow?: string
    tags: string[]
    image: string
  }
  itinerary: FlatDay[]
  hotels: FlatHotel[]
  /** Guide-specific hotels section description (from source doc) */
  hotelsDescription?: string
  experiences: FlatExperience[]
  /** Guide-specific experiences section description (from source doc) */
  experiencesDescription?: string
  tips: string[]
  funFact?: string
  checklist: string[]
  transport: FlatTransport[]
}

// ── Root ───────────────────────────────────────────────────────────────────────

export interface GuidePageData {
  slug: string
  locale: string

  hero: HeroData
  itinerary: ItinerarySection
  hotels: HotelsSection
  experiences: ExperiencesSection
  tips: TipsSection
  checklist: ChecklistSection
  transport: TransportSection
  planCta: PlanCtaSection
}
