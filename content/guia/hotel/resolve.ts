// content/guia/hotel/resolve.ts
//
// Server-side preparation for the hotel edition. The page is the Livin guide, so this only does what the
// standing rules need, before anything reaches the browser (GuiaClient is a client component: whatever is
// passed to it is serialized into the page source even when it never renders):
//   - the Insider link and number are removed from the arrival cards and from the experience cards;
//   - everything that belongs to the Livin property is taken out of the partner layer (name, "Your house" address,
//     check-out time, private chefs, massages, host letter, pilot id);
//   - the matching Livin partner (one per zone) supplies the rest of the partner layer.
// Items that were once held for confirmation (airport, earthquakes, cash and ATMs) now render like in the Livin guides.
// Pure, no React.

import type { ArrivalItem, City, CityCopy, InlineLink, Lang, Mood, MoodItem, Neighborhood, Partner, Spot } from '../types'
import type { FaqItemKey } from '../faq/types'
import { getGuide } from '..'
import {
  HOTEL_CRAVING_LABEL, HOTEL_EXTRA_ZONES_ON, HOTEL_FREE_EDITION, HOTEL_MALEZA_PICK, HOTEL_MONDAY_ROW, HOTEL_MOOD_ORDER, HOTEL_ORIENTATION, HOTEL_PICK_ZONES, HOTEL_SHOP_MOOD, type HotelMode,
} from './config'
import { EXTRA_ZONES, type ExtraPlace, type ExtraZone } from './extra-zones'
import { CENTRO_ADDITION, POLANCO_SWAP, type TabSpot } from './tab-spots'
import { ADDRESSES, DINNER_PICKS, HOTEL_DINNER_MOOD, HOTEL_MICHELIN, SHOP_NEW_PICKS, type NewPick } from './mood-picks'
import { HOTEL_EXPERIENCE_IDS } from './experiences'
import { ZONE_NEIGHBORHOOD, type HotelZone } from './zones'

/** The Livin guide each hotel zone is a copy of. */
export const HOTEL_PARTNER_SLUG: Record<HotelZone, string> = {
  condesa: 'livin_condesa',
  roma: 'livin_roma',
  polanco: 'livin_polanco',
}

/** FAQ answers that only make sense for the Livin property. */
export const HOTEL_HIDDEN_FAQ_KEYS: FaqItemKey[] = [
  'chefsAtHome', 'massages',                                  // belong to the Livin property
  'laundry', 'groupRestaurants', 'cateringDelivery', 'lateReturn', // not for a hotel guide (content round, Nov 2026)
]

/** Arrival cards left out of the hotel edition (the matching FAQ answer, lateReturn, is hidden above). */
export const HOTEL_HIDDEN_ARRIVAL_IDS = ['coming-back-late']

/** "I'm hungry": the must-sees that have no other place in the guide move into this mood panel, keeping their label. */
// (Quintonil moved to "A special dinner"; Café Avellaneda has its own card in Coyoacán.)
export const HOTEL_HUNGRY_PICKS = ['El Vilsito', 'Café Avellaneda', 'Café Nin', 'Nevería Roxy']

const INSIDER_HREF = /wa\.me\/525539149062/i

function isInsiderLink(l: InlineLink): boolean {
  return l.linkName === 'insider' || INSIDER_HREF.test(l.href)
}

/** Arrival card without its Insider link; the body is cut back to the last complete sentence before the link. */
function stripInsider(item: ArrivalItem): ArrivalItem {
  if (!item.link || !isInsiderLink(item.link)) return item
  const cut = item.body.lastIndexOf('.')
  const { link: _removed, ...rest } = item
  return { ...rest, body: cut > 0 ? item.body.slice(0, cut + 1) : item.body }
}

/** Zone name of a place that is listed in one of the city's zone tabs; undefined when the repo holds no zone for it. */
function zoneOfPlace(city: City, name: string, lang: Lang): string | undefined {
  for (const [key, nb] of Object.entries(city.neighborhoods)) {
    if (nb.spots[lang].some((s) => s.name === name)) return nb.tabLabel?.[lang] ?? key
  }
  return undefined
}

function spotAsPick(city: City, name: string, lang: Lang): MoodItem | null {
  for (const nb of Object.values(city.neighborhoods)) {
    const spot = nb.spots[lang].find((s) => s.name === name)
    if (spot) return { name: spot.name, note: spot.note, zone: zoneOfPlace(city, name, lang) }
  }
  return null
}

/** A new pick as a mood item: its own text, or (Quintonil) the existing text of the place word for word. */
function newPick(p: NewPick, copy: CityCopy, lang: Lang): MoodItem {
  const note = p.note?.[lang] ?? copy.foodCollections.find((c) => c.name === p.name)?.note ?? ''
  return { name: p.name, note, zone: p.zone, address: p.address || undefined, ...(p.stars ? { tag: HOTEL_MICHELIN.labels[p.stars][lang] } : {}) }
}

/** Street address already in the repo for a place listed in a zone tab. */
function repoAddress(city: City, name: string, lang: Lang): string | undefined {
  for (const nb of Object.values(city.neighborhoods)) {
    const spot = nb.spots[lang].find((s) => s.name === name)
    if (spot) return spot.distance
  }
  return undefined
}

/** "A special dinner": five places, the Michelin rating in the small label slot. */
function dinnerMood(copy: CityCopy, lang: Lang): Mood {
  return { id: 'dinner', icon: 'chefHat', label: HOTEL_DINNER_MOOD[lang].label, title: HOTEL_DINNER_MOOD[lang].title, items: DINNER_PICKS.map((p) => newPick(p, copy, lang)) }
}

/** "I want to shop": four places already in the guide, with their existing texts, then three new ones. */
function shopMood(city: City, copy: CityCopy, lang: Lang): Mood {
  const picks = ['Proyecto Rufina', 'Librería El Péndulo', 'LAGO'].map((n) => spotAsPick(city, n, lang)).filter((x): x is MoodItem => !!x)
  // Bazar Sábado comes from "Every week": the title names its zone ("Bazar Sábado, San Ángel"), the body is its text.
  const bazar = copy.todayItems.find((t) => t.title.startsWith('Bazar Sábado'))
  if (bazar) {
    const [name, ...zone] = bazar.title.split(', ')
    picks.push({ name, note: bazar.body, zone: zone.join(', ') || undefined })
  }
  picks.push(...SHOP_NEW_PICKS.map((p) => newPick(p, copy, lang)))
  return { id: 'shop', icon: 'basket', label: HOTEL_SHOP_MOOD[lang].label, title: HOTEL_SHOP_MOOD[lang].title, items: picks }
}

/** "Every week": Monday, Tues & Fri, Saturday, Sunday, Sunset. */
function weeklyRows(copy: CityCopy, lang: Lang): CityCopy['todayItems'] {
  const by = (start: string) => copy.todayItems.find((t) => t.title.startsWith(start))
  const ordered = [by('Lucha libre'), by('Bazar Sábado'), by('Muévete en Bici'), by('Mirador')]
  const rest = copy.todayItems.filter((t) => !ordered.includes(t))
  return [HOTEL_MONDAY_ROW[lang], ...ordered.filter((t): t is NonNullable<typeof t> => !!t), ...rest]
}

function sanitizeCopy(copy: CityCopy, city: City, lang: Lang, moved: Set<string>): CityCopy {
  const moods = copy.moods
    .filter((m) => m.id !== 'short' && m.id !== 'kids') // "Traveling with kids" gives way to "A special dinner" in the hotel edition
    // A place that has a card in a hotel-only zone leaves the mood panel it was in, so it appears once.
    .map((m) => ({ ...m, items: m.items.filter((it) => !moved.has(it.name)) }))
    .map((m) => m.id !== 'hungry' ? m : {
      ...m,
      items: [
        ...m.items,
        ...HOTEL_HUNGRY_PICKS.filter((n) => !moved.has(n)).map((n) => copy.foodCollections.find((c) => c.name === n)).filter((c): c is NonNullable<typeof c> => !!c)
          .map((c) => ({ name: c.name, note: c.note, tag: HOTEL_CRAVING_LABEL[c.name] ?? c.tag })),
        { name: HOTEL_MALEZA_PICK[lang].name, note: HOTEL_MALEZA_PICK[lang].note, tag: HOTEL_MALEZA_PICK[lang].tag },
      ],
    })
  const withShop = [...moods, shopMood(city, copy, lang), dinnerMood(copy, lang)]
  return {
    ...copy,
    arrivalItems: copy.arrivalItems.filter((i) => !HOTEL_HIDDEN_ARRIVAL_IDS.includes(i.id ?? '')).map(stripInsider),
    // Mood order is the hotel's; the zone name goes under a pick only where the repo holds the place's zone.
    moods: HOTEL_MOOD_ORDER.map((id) => withShop.find((m) => m.id === id)).filter((m): m is Mood => !!m)
      .map((m) => ({
        ...m,
        items: m.items.map((it) => ({
          ...it,
          zone: HOTEL_PICK_ZONES[it.name] ?? it.zone ?? zoneOfPlace(city, it.name, lang),
          address: it.address ?? ADDRESSES[it.name]?.address ?? repoAddress(city, it.name, lang),
        })),
      })),
    // "Every week": one more row, Monday.
    todayItems: weeklyRows(copy, lang),
    // Only the four experience titles travel (the cards are in experiences.ts); nothing of the Insider copy does.
    experiences: copy.experiences
      .filter((e) => (HOTEL_EXPERIENCE_IDS as string[]).includes(e.id))
      .map((e) => ({ id: e.id, title: e.title, teaser: '', description: '', howToBookLinkText: '', howToBookLinkHref: '', howToBook: '', minBookingTime: '' })),
    expPartnerNote: '',
    expBookCta: '',
    // The host letter is not rendered in the hotel edition; its copy does not travel either.
    hostLetter: { ...copy.hostLetter, quote: '', body: '' },
  }
}

/** The text of a place that already exists in the guide, to reuse word for word. */
function existingNote(copy: CityCopy, name: string): string {
  const fromMood = copy.moods.flatMap((m) => m.items).find((i) => i.name === name)
  return (fromMood ?? copy.foodCollections.find((c) => c.name === name))?.note ?? ''
}

function extraNeighborhood(z: ExtraZone, city: City, hotelZone: HotelZone): Neighborhood {
  const spots = (lang: Lang): Spot[] => z.places.map((p: ExtraPlace) => ({
    icon: p.icon,
    name: p.name[lang],
    distance: p.where[lang],
    note: p.reuse ? existingNote(city.copy[lang], p.reuse) : (p.note?.[lang] ?? ''),
  }))
  return {
    name: z.key,
    mapUrl: z.mapUrl,
    tagline: z.tagline,
    orientation: z.orientation[hotelZone] ?? z.orientation.default,
    spots: { es: spots('es'), en: spots('en') },
  }
}

/** Zones the hotel edition has on top of the city layer, and the places that move into them (switches in config.ts). */
function enabledExtras(): ExtraZone[] {
  return EXTRA_ZONES.filter((z) => HOTEL_EXTRA_ZONES_ON[z.key])
}

export function toHotelCity(city: City, hotelZone: HotelZone = 'condesa'): City {
  const extras = enabledExtras()
  const moved = new Set(extras.flatMap((z) => z.places.filter((p) => p.reuse).map((p) => p.reuse as string)))
  const neighborhoods: Record<string, Neighborhood> = { ...city.neighborhoods }
  // The city layer's distance sentences are written from Condesa's point of view; the hotel edition replaces them per hotel zone.
  for (const [k, line] of Object.entries(HOTEL_ORIENTATION[hotelZone])) if (neighborhoods[k]) neighborhoods[k] = { ...neighborhoods[k], orientation: line }
  for (const z of extras) neighborhoods[z.key] = extraNeighborhood(z, city, hotelZone)
  // Tab edits for the hotel edition only (tab-spots.ts): Siembra replaces El Turix (not in the Polanco hotel); La Ciudadela joins Centro.
  const asSpot = (t: TabSpot, lang: Lang): Spot => ({ icon: t.icon, name: t.name, distance: t.where, note: t.note[lang] })
  const editSpots = (key: string, edit: (spots: Spot[], lang: Lang) => Spot[]) => {
    if (!neighborhoods[key]) return
    neighborhoods[key] = { ...neighborhoods[key], spots: { es: edit(neighborhoods[key].spots.es, 'es'), en: edit(neighborhoods[key].spots.en, 'en') } }
  }
  if (hotelZone !== POLANCO_SWAP.except) editSpots('Polanco', (spots, lang) => spots.map((sp) => (sp.name === POLANCO_SWAP.replace ? asSpot(POLANCO_SWAP.spot, lang) : sp)))
  editSpots('Centro', (spots, lang) => spots.flatMap((sp) => (sp.name === CENTRO_ADDITION.after ? [sp, asSpot(CENTRO_ADDITION.spot, lang)] : [sp])))
  const withZones: City = { ...city, neighborhoods, neighborhoodOrder: [...city.neighborhoodOrder, ...extras.map((z) => z.key)] }
  return { ...withZones, copy: { es: sanitizeCopy(city.copy.es, withZones, 'es', moved), en: sanitizeCopy(city.copy.en, withZones, 'en', moved) } }
}

/** The Livin partner layer without anything that belongs to the Livin property. */
export function toHotelPartner(partner: Partner, city: City, zone: HotelZone): Partner {
  const faqAnswers = { ...partner.faqAnswers }
  for (const k of HOTEL_HIDDEN_FAQ_KEYS) delete faqAnswers[k]
  return {
    ...partner,
    slug: `hotel_${zone}`,
    displayName: 'Lagomplan',
    hostName: 'Lagomplan',
    // The "Your house" tab is not shown; this keeps the type satisfied with the zone's own data, not Livin's address.
    yourHouse: city.neighborhoods[ZONE_NEIGHBORHOOD[zone]],
    pilotId: HOTEL_FREE_EDITION.planner.utmCampaign,
    edition: undefined,
    atAGlance: undefined,
    hostLetter: undefined,
    hostLetterSignature: undefined,
    stayGlance: undefined,
    operatorWhatsApp: undefined,
    ownTours: undefined,
    insiders: undefined,
    faqAnswers,
  }
}

export function buildHotelGuideProps(zone: HotelZone): { partner: Partner; city: City; hotel: HotelMode } | null {
  const guide = getGuide(HOTEL_PARTNER_SLUG[zone])
  if (!guide) return null
  return {
    partner: toHotelPartner(guide.partner, guide.city, zone),
    city: toHotelCity(guide.city, zone),
    hotel: { zone, edition: HOTEL_FREE_EDITION, hiddenFaqKeys: HOTEL_HIDDEN_FAQ_KEYS },
  }
}
