/**
 * lib/data/guides/adapter.ts
 *
 * Converts a FlatGuide (docx-sourced, spec format) to a GuidePageData
 * (component-ready format used by GuidePageClientV2).
 *
 * UI strings (eyebrows, section titles, plan CTA copy) are standard
 * interface labels — not guide content — and are generated per locale here.
 */

import type { FlatGuide, GuidePageData, ChecklistItem } from './types'

// ── UI label maps ──────────────────────────────────────────────────────────────

const L = {
  es: {
    guideEyebrow:        'Guía curada',
    itineraryEyebrow:    'Itinerario',
    hotelsEyebrow:       'Dónde quedarte',
    hotelsTitle:         'Alojamientos seleccionados',
    hotelsDesc:          'Opciones seleccionadas por ubicación, comodidad y relación precio–calidad.',
    expEyebrow:          'Cosas que hacer',
    expTitle:            'Experiencias recomendadas',
    expDesc:             'Actividades con ritmo Lagom — sin sobresaturar el plan.',
    tipsEyebrow:         'Consejos curados',
    tipsTitle:           'Lagom Tips',
    funFactEyebrow:      'Dato curioso',
    checklistEyebrow:    'Checklist',
    checklistTitle:      'Qué llevar',
    transportEyebrow:    'Logística',
    transportTitle:      'Cómo llegar',
    planCtaEyebrow:      'AI · Lagomplan',
    planCtaDesc:         'Convierte una guía en tu plan personalizado, fechas, viajeros y presupuesto exactos para tu viaje en 60 segundos.',
    planCtaButton:       'Planear mi viaje →',
    bookingLabel:        'Ver opciones →',
  },
  en: {
    guideEyebrow:        'Curated guide',
    itineraryEyebrow:    'Itinerary',
    hotelsEyebrow:       'Where to stay',
    hotelsTitle:         'Selected accommodations',
    hotelsDesc:          'Options selected for location, comfort, and real price-to-quality ratio.',
    expEyebrow:          'Things to do',
    expTitle:            'Recommended experiences',
    expDesc:             'Lagom-paced activities — without overloading the plan.',
    tipsEyebrow:         'Curated tips',
    tipsTitle:           'Lagom Tips',
    funFactEyebrow:      'Fun fact',
    checklistEyebrow:    'Checklist',
    checklistTitle:      'What to pack',
    transportEyebrow:    'Logistics',
    transportTitle:      'How to get there',
    planCtaEyebrow:      'AI · Lagomplan',
    planCtaDesc:         'Turn this guide into a personalized AI itinerary — exact dates, travelers, and budget for your trip in 60 seconds.',
    planCtaButton:       'Plan my trip →',
    bookingLabel:        'See options →',
  },
} as const

// ── Checklist parser ───────────────────────────────────────────────────────────

function parseChecklistItem(s: string): ChecklistItem {
  // Split "🎒 Description text" → emoji + label
  const match = s.match(/^(\S+)\s+(.+)$/)
  if (match && match[1].length <= 4) {
    return { emoji: match[1], label: match[2] }
  }
  return { emoji: '•', label: s }
}

// ── Transport icon map ─────────────────────────────────────────────────────────

function transportIcon(mode: string): string {
  const m = mode.toLowerCase()
  if (/coche|auto|suv|car/.test(m))   return '🚗'
  if (/avión|vuelo|flight|plane/.test(m)) return '✈️'
  if (/autobús|bus/.test(m))          return '🚌'
  if (/uber|didi|taxi/.test(m))        return '📱'
  if (/bici|bike/.test(m))            return '🚲'
  if (/scooter/.test(m))              return '🛵'
  if (/traslado|shuttle|transfer/.test(m)) return '🚐'
  if (/barco|bote|boat/.test(m))      return '⛵'
  return '🗺️'
}

// ── Main adapter ───────────────────────────────────────────────────────────────

export function adaptFlatGuide(flat: FlatGuide): GuidePageData {
  const loc = flat.locale === 'en' ? 'en' : 'es'
  const l = L[loc]

  // Derive itinerary section title from first day count
  const dayCount = flat.itinerary.length
  const itineraryTitle =
    loc === 'es'
      ? `${dayCount} ${dayCount === 1 ? 'día' : 'días'} de itinerario`
      : `${dayCount}-day itinerary`

  // Derive planCta title from hero
  const planCtaTitle =
    loc === 'es'
      ? `¿Viajando a ${flat.hero.title}?`
      : `Heading to ${flat.hero.title}?`

  return {
    slug:   flat.slug,
    locale: flat.locale,

    hero: {
      eyebrow:    flat.hero.eyebrow ?? l.guideEyebrow,
      title:      flat.hero.title,
      subtitle:   flat.hero.subtitle,
      chips:      flat.hero.tags,
      imageTag:   '',
      coverImage: flat.hero.image || undefined,
    },

    itinerary: {
      eyebrow:     l.itineraryEyebrow,
      title:       itineraryTitle,
      description: '',
      days: flat.itinerary.map((d) => ({
        dayNumber: d.day,
        dayLabel:  '',
        title:     d.title,
        items:     d.items.map((it) => ({
          time:        it.time,
          title:       it.title,
          description: it.description,
          badges:      it.tags,
        })),
      })),
    },

    hotels: {
      eyebrow:     l.hotelsEyebrow,
      title:       l.hotelsTitle,
      description: flat.hotelsDescription ?? l.hotelsDesc,
      items: flat.hotels.map((h, i) => ({
        number:     String(i + 1).padStart(2, '0'),
        name:       h.name,
        type:       h.type,
        priceTier:  h.priceTier,
        description: h.description,
        highlight:   h.tag,
        bookingUrl:  h.affiliateUrl || undefined,
      })),
    },

    experiences: {
      eyebrow:     l.expEyebrow,
      title:       l.expTitle,
      description: flat.experiencesDescription ?? l.expDesc,
      items: flat.experiences.map((e, i) => ({
        number:      String(i + 1).padStart(2, '0'),
        name:        e.name,
        description: e.description,
        tags:        e.tags,
        bookingUrl:  e.affiliateUrl || undefined,
        bookingLabel: l.bookingLabel,
      })),
    },

    tips: {
      eyebrow: l.tipsEyebrow,
      title:   `${l.tipsTitle} para ${flat.hero.title}`,
      items:   flat.tips,
      funFact: flat.funFact
        ? { eyebrow: l.funFactEyebrow, text: flat.funFact }
        : undefined,
    },

    checklist: {
      eyebrow: l.checklistEyebrow,
      title:   l.checklistTitle,
      items:   flat.checklist.map(parseChecklistItem),
    },

    transport: {
      eyebrow: l.transportEyebrow,
      title:   l.transportTitle,
      options: flat.transport.map((t) => ({
        icon:        transportIcon(t.mode),
        name:        t.mode,
        badge:       '',
        description: t.description,
        tip:         t.tip,
      })),
    },

    planCta: {
      eyebrow:     l.planCtaEyebrow,
      title:       planCtaTitle,
      description: l.planCtaDesc,
      buttonText:  l.planCtaButton,
    },
  }
}
