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

import type { ArrivalItem, City, CityCopy, InlineLink, Lang, Mood, MoodItem, Partner } from '../types'
import type { FaqItemKey } from '../faq/types'
import { getGuide } from '..'
import { HOTEL_FREE_EDITION, HOTEL_MONDAY_ROW, HOTEL_MOOD_ORDER, HOTEL_SHOP_MOOD, type HotelMode } from './config'
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
export const HOTEL_HUNGRY_PICKS = ['El Vilsito', 'Café Avellaneda', 'Quintonil', 'Café Nin', 'Nevería Roxy']

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

/** "I want to shop": four places already in the guide, with their existing texts. */
function shopMood(city: City, copy: CityCopy, lang: Lang): Mood {
  const picks = ['Proyecto Rufina', 'Librería El Péndulo', 'LAGO'].map((n) => spotAsPick(city, n, lang)).filter((x): x is MoodItem => !!x)
  // Bazar Sábado comes from "Every week": the title names its zone ("Bazar Sábado, San Ángel"), the body is its text.
  const bazar = copy.todayItems.find((t) => t.title.startsWith('Bazar Sábado'))
  if (bazar) {
    const [name, ...zone] = bazar.title.split(', ')
    picks.push({ name, note: bazar.body, zone: zone.join(', ') || undefined })
  }
  return { id: 'shop', icon: 'basket', label: HOTEL_SHOP_MOOD[lang].label, title: HOTEL_SHOP_MOOD[lang].title, items: picks }
}

function sanitizeCopy(copy: CityCopy, city: City, lang: Lang): CityCopy {
  const moods = copy.moods
    .filter((m) => m.id !== 'short')
    .map((m) => m.id !== 'hungry' ? m : {
      ...m,
      items: [
        ...m.items,
        ...HOTEL_HUNGRY_PICKS.map((n) => copy.foodCollections.find((c) => c.name === n)).filter((c): c is NonNullable<typeof c> => !!c)
          .map((c) => ({ name: c.name, note: c.note, tag: c.tag })),
      ],
    })
  const withShop = [...moods, shopMood(city, copy, lang)]
  return {
    ...copy,
    arrivalItems: copy.arrivalItems.filter((i) => !HOTEL_HIDDEN_ARRIVAL_IDS.includes(i.id ?? '')).map(stripInsider),
    // Mood order is the hotel's; the zone name goes under a pick only where the repo holds the place's zone.
    moods: HOTEL_MOOD_ORDER.map((id) => withShop.find((m) => m.id === id)).filter((m): m is Mood => !!m)
      .map((m) => ({ ...m, items: m.items.map((it) => ({ ...it, zone: it.zone ?? zoneOfPlace(city, it.name, lang) })) })),
    // "Every week": one more row, Monday.
    todayItems: [HOTEL_MONDAY_ROW[lang], ...copy.todayItems],
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

export function toHotelCity(city: City): City {
  return { ...city, copy: { es: sanitizeCopy(city.copy.es, city, 'es'), en: sanitizeCopy(city.copy.en, city, 'en') } }
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
    city: toHotelCity(guide.city),
    hotel: { zone, edition: HOTEL_FREE_EDITION, hiddenFaqKeys: HOTEL_HIDDEN_FAQ_KEYS },
  }
}
