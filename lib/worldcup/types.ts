/**
 * lib/worldcup/types.ts
 *
 * Shared shape for all World Cup city guides.
 * Each city has an `es` locale and optionally an `en` locale in its data file
 * under lib/worldcup/data/<slug>.ts.
 *
 * Fields are permissive (some cities carry an `itinerary` or `neighborhoods`
 * block; others don't). The rendering template reads the same core fields and
 * ignores city-specific extensions.
 */

export interface MatchTeam {
  name: string
  flag: string
}

export interface Match {
  id: string
  date: string
  day: string
  time: string
  teams: [MatchTeam, MatchTeam]
  stadium: string
  tag: string
  highlight: boolean
}

export interface ScoreEntry {
  label: string
  value: number
}

export interface LabelValue {
  label: string
  value: string
}

export interface ManifestoSection {
  stadiumInfo: LabelValue[]
  body: string
  lagomNote: string
}

export interface VibeZone {
  name: string
  type: string
  typeColor: string
  desc: string
  tag?: string
}

export interface VibeSection {
  body: string
  lagomNote: string
  zones?: VibeZone[]
}

export interface Stay {
  name: string
  area: string
  price: string
  priceCAD?: string
  tags: string[]
  note: string
  best_for: string
  url?: string
  hotel_link?: string
}

export interface TransportItem {
  icon: string
  title: string
  text: string
  isWarning?: boolean
}

export interface CronologiaStep {
  time: string
  text: string
}

export interface MatchDayCronologia {
  matchName: string
  steps: CronologiaStep[]
}

export interface LogisticsSection {
  transport: TransportItem[]
  timings: LabelValue[]
  matchDayCronologia: MatchDayCronologia
  timing: string
  cost: string
}

export interface VibeCard {
  title: string
  type: string
  typeColor: string
  desc: string
  tag: string
}

export interface FoodItem {
  dish: string
  where: string
  price: string
  type: string
}

export interface Experience {
  title: string
  duration: string
  desc: string
  type: string
  affiliateLink?: string
  affiliateLabel?: string
}

export interface Neighborhood {
  name: string
  vibe: string
  best_for: string
  walk_to_stadium: string
  lagomNote?: string | null
}

export interface ItineraryDayStep {
  time: string
  text: string
}

export interface ItineraryDay {
  day: number
  title: string
  subtitle: string
  isMatchDay: boolean
  matchRef?: string
  steps: ItineraryDayStep[]
}

export interface Stadium {
  name: string
  capacity: string
  area?: string
}

export interface CityGuide {
  id: string
  city: string
  country: string
  state: string
  flag: string
  accent: string
  tags: string[]
  stadium: Stadium
  headline: string
  description: string
  scores: ScoreEntry[]
  matches: Match[]
  manifesto: ManifestoSection
  vibe: VibeSection
  stays: Stay[]
  logistics: LogisticsSection
  vibeCards: VibeCard[]
  food: FoodItem[]
  experiences: Experience[]
  lagomTips: string[]
  matchDayChecklist: string[]
  didYouKnow: string
  closingNote: string
  closingSignature: string
  plannerCTA: string
  /** City-specific optional extensions. */
  neighborhoods?: Neighborhood[]
  itinerary?: ItineraryDay[]
  /**
   * Section subtitles that reference city-specific facts (Azteca, Levi's,
   * Tasqueña, etc). Generic subtitles stay in ui-strings; these override them
   * for sections 01/04/05/06 where the copy is inherently per-city.
   */
  sectionSubtitles?: {
    matches?: string
    itinerary?: string
    stays?: string
    vibe?: string
    logistics?: string
    food?: string
    experiences?: string
  }
  /** Optional warning banner shown above the stays grid. */
  staysWarning?: string
}

/** Shape every per-city data file must export. */
export interface CityGuideLocales {
  es: CityGuide
  en?: CityGuide
}
