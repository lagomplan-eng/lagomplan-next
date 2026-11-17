// content/guia/hotel/resolve.ts
//
// Resolves the hotel edition's practical part for one zone and language:
// zone layer + base defaults only (never a partner layer), held items
// skipped, Insider links stripped. Pure, no React.

import type { ArrivalItem, City, CityCopy, IconKey, InlineLink, Lang } from '../types'
import type { FaqItemKey } from '../faq/types'
import { faqBase } from '../faq/base'
import { getZone } from '../zones'
import { HOTEL_FREE_EDITION, type HotelEdition } from './config'
import { ZONE_LABEL, type HotelZone } from './zones'

export interface HotelPracticalCard {
  key: string
  anchor?: string
  icon: IconKey
  title: string
  body: string
  links?: InlineLink[]
}

const FAQ_ICONS: Partial<Record<FaqItemKey, IconKey>> = {
  cashAtms: 'landmark',
  oddHours: 'alarmClock',
  healthPharmacies: 'cross',
}

const INSIDER_HREF = /wa\.me\/525539149062/i

function isInsiderLink(l: InlineLink): boolean {
  return l.linkName === 'insider' || INSIDER_HREF.test(l.href)
}

/** Arrival card → hotel card, or null when held / not in the config. */
function arrivalCard(item: ArrivalItem, zone: HotelZone, edition: HotelEdition): HotelPracticalCard | null {
  const key = item.id ?? item.icon
  if (!edition.practical.arrival.includes(key)) return null
  if (item.hold) return null

  let body = item.body.replace(/\{neighborhood\}/g, ZONE_LABEL[zone]).replace(/\{host\}/g, 'Lagomplan')
  let links = item.link ? [item.link] : undefined
  if (links) {
    const kept = links.filter((l) =>
      edition.practical.allowBookingPartnerLinks ? true : !isInsiderLink(l) && edition.practical.allowedLinkNames.includes(l.linkName ?? ''),
    )
    if (kept.length !== links.length && links.some(isInsiderLink) && !edition.practical.allowBookingPartnerLinks) {
      // The body leads into the removed link ("…te recomendamos "): keep only the complete sentences before it.
      const cut = body.lastIndexOf('.')
      if (cut > 0) body = body.slice(0, cut + 1)
    }
    links = kept.length > 0 ? kept : undefined
  }
  return { key, anchor: item.id, icon: item.icon, title: item.title, body, links }
}

export function resolveHotelPractical(
  city: City,
  zone: HotelZone,
  lang: Lang,
  edition: HotelEdition = HOTEL_FREE_EDITION,
): HotelPracticalCard[] {
  const out: HotelPracticalCard[] = []

  for (const key of edition.practical.arrival) {
    const item = city.copy[lang].arrivalItems.find((it) => (it.id ?? it.icon) === key)
    if (!item) continue
    const card = arrivalCard(item, zone, edition)
    if (card) out.push(card)
  }

  const zoneAnswers = getZone(zone)?.answers
  for (const key of edition.practical.faq) {
    const def = faqBase.items.find((i) => i.key === key)
    if (!def) continue
    // Zone first, then base defaults — same order as resolveFaqModule, minus the partner layer.
    const answer = [zoneAnswers?.[key], faqBase.defaults?.[key]].find((a) => a?.body?.[lang])
    if (!answer || answer.hold) continue
    const body = answer.body?.[lang]
    if (!body) continue
    out.push({
      key,
      anchor: def.anchor,
      icon: FAQ_ICONS[key] ?? 'compass',
      title: def.label[lang],
      body,
      links: answer.links?.[lang]?.filter((l) => !isInsiderLink(l)),
    })
  }
  return out
}

// ── Props for the client component ──────────────────────────────────────────────
// HotelGuideClient is a client component, so everything passed to it is serialized into the page source
// (RSC payload) even when it never renders. The city layer carries Insider's WhatsApp number and copy in its
// arrival items and experience cards, so the page hands the client a sanitized city plus the practical cards
// already resolved on the server: no Insider link, number or name can reach the browser.


function sanitizeCopy(copy: CityCopy): CityCopy {
  return {
    ...copy,
    arrivalItems: [], // replaced by the resolved practical cards
    expPartnerNote: '',
    expBookCta: '',
    experiences: copy.experiences
      .filter((e) => e.id !== 'exp-own-plan')
      .map((e) => ({
        id: e.id, title: e.title, teaser: e.teaser,
        description: '', howToBookLinkText: '', howToBookLinkHref: '', howToBook: '', minBookingTime: '',
      })),
  }
}

export function toHotelCity(city: City): City {
  return { ...city, copy: { es: sanitizeCopy(city.copy.es), en: sanitizeCopy(city.copy.en) } }
}

export function buildHotelGuideProps(city: City, zone: HotelZone) {
  return {
    zone,
    city: toHotelCity(city),
    practical: {
      es: resolveHotelPractical(city, zone, 'es'),
      en: resolveHotelPractical(city, zone, 'en'),
    } as Record<Lang, HotelPracticalCard[]>,
    edition: HOTEL_FREE_EDITION,
  }
}
