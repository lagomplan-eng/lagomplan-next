/**
 * lib/guides.ts
 * Static guide data layer.
 *
 * Each guide is a single bilingual object.
 * No duplication per language — both locales read from the same record.
 *
 * Swap strategy: replace getAllGuides() with a Supabase/CMS call later.
 * Every consumer already calls the helpers below, so zero call-site changes needed.
 */

import type { Locale }       from '../i18n'
import type { LocalizedEntity } from './routes'

// ── Types ─────────────────────────────────────────────────

export interface GuideSection {
  heading_es: string
  heading_en: string
  body_es:    string
  body_en:    string
  tip_es?:    string   // optional callout / lagom tip
  tip_en?:    string
}

export interface Guide extends LocalizedEntity {
  // slugs (inherited from LocalizedEntity)
  slug_es: string
  slug_en: string

  // metadata
  title_es:       string
  title_en:       string
  excerpt_es:     string
  excerpt_en:     string
  destination_es: string
  destination_en: string
  tags_es:        string[]
  tags_en:        string[]
  cover_img:      string    // path under /public/images/guides/

  // content
  sections:       GuideSection[]
}

// ── Data ──────────────────────────────────────────────────

const GUIDES: Guide[] = [
  {
    slug_es: 'valle-de-bravo-avandaro-aventura-en-familia',
    slug_en: 'valle-de-bravo-avandaro-family-adventure',

    title_es: 'Valle de Bravo / Avándaro',
    title_en: 'Valle de Bravo / Avándaro',

    excerpt_es: 'Agua, bosque y ritmo lento a dos horas de la Ciudad de México. La escapada perfecta para familias que quieren desconectar sin complicarse el plan.',
    excerpt_en: 'Water, forest, and slow rhythm two hours from Mexico City. The perfect getaway for families who want to disconnect without overcomplicating the plan.',

    destination_es: 'Estado de México',
    destination_en: 'State of Mexico',

    tags_es: ['Familia', 'Naturaleza', 'Fin de semana', 'Aventura'],
    tags_en: ['Family', 'Nature', 'Weekend', 'Adventure'],

    cover_img: '/images/guides/valle-de-bravo.jpg',

    sections: [
      {
        heading_es: 'Por qué ir',
        heading_en: 'Why go',
        body_es: 'Valle de Bravo combina el lago, los cerros y un pueblo con arquitectura colonial que sigue teniendo personalidad. A diferencia de otros destinos de fin de semana, aquí el ritmo no está dictado por el turismo masivo: la prioridad es el aire libre y la comida de mercado.',
        body_en: 'Valle de Bravo combines the lake, the hills, and a colonial town that still has personality. Unlike other weekend destinations, the pace here is not dictated by mass tourism: the priority is the outdoors and market food.',
        tip_es: 'Llega el viernes a las 3pm — evitas el tráfico del Paseo de la Reforma y llegas antes del atardecer.',
        tip_en: 'Arrive Friday at 3pm — you avoid Paseo de la Reforma traffic and get there before sunset.',
      },
      {
        heading_es: 'Dónde quedarse',
        heading_en: 'Where to stay',
        body_es: 'Los mejores hoteles están en el centro o con vista al lago. Evita los que quedan sobre la carretera: el ruido arruina la experiencia. Para familias, busca propiedades con jardín o alberca. Los Veleros y Avándaro tienen las mejores opciones con más espacio y tranquilidad.',
        body_en: 'The best hotels are in the center or with lake views. Avoid those on the highway — the noise ruins the experience. For families, look for properties with a garden or pool. Los Veleros and Avándaro have the best options with more space and calm.',
      },
      {
        heading_es: 'Qué hacer',
        heading_en: 'What to do',
        body_es: 'Paseo en lancha por el lago (mañana temprano, antes de que haya viento). Renta de bicicletas en el centro. Caminata al mirador de La Peña. Para niños: el parque de aventura Velo Velo tiene tirolesas y árboles de escalada que aguantan fácil tres horas.',
        body_en: 'Boat ride on the lake (early morning, before the wind picks up). Bike rentals in the center. Hike to La Peña viewpoint. For kids: Velo Velo adventure park has zip lines and climbing trees that easily fill three hours.',
        tip_es: 'El mercado del centro los sábados tiene los mejores tlayudas y memelas de todo el estado.',
        tip_en: 'The Saturday market in the center has the best tlayudas and memelas in the whole state.',
      },
      {
        heading_es: 'Dónde comer',
        heading_en: 'Where to eat',
        body_es: 'La Michoacana del Lago para helados de temporada con vista. El Santuario tiene la mejor terraza para cenar con niños. Para desayuno: Café Del Valle, sencillo y siempre bueno. Evita los restaurantes de la plaza en fin de semana — hay mucha lista de espera y la comida es turística.',
        body_en: 'La Michoacana del Lago for seasonal ice cream with a view. El Santuario has the best terrace for dinner with kids. For breakfast: Café Del Valle, simple and always good. Avoid the plaza restaurants on weekends — long waits and tourist-grade food.',
      },
      {
        heading_es: 'Cómo llegar y moverse',
        heading_en: 'Getting there and around',
        body_es: 'Autopista México–Toluca hasta Toluca, luego libramiento a Valle. En total: 2–2.5 horas desde CDMX dependiendo del tráfico. Una vez ahí, todo el centro se camina. Para Avándaro necesitas coche o taxi.',
        body_en: 'Mexico–Toluca expressway to Toluca, then the ring road to Valle. Total: 2–2.5 hours from CDMX depending on traffic. Once there, the whole center is walkable. For Avándaro you need a car or taxi.',
      },
    ],
  },

  {
    slug_es: 'riviera-maya-roadtrip-de-semana-santa',
    slug_en: 'riviera-maya-easter-road-trip',

    title_es: 'Riviera Maya',
    title_en: 'Riviera Maya',

    excerpt_es: 'Roadtrip de Semana Santa por la costa: Cancún, Playa del Carmen, Tulum y los cenotes en el camino. Cómo hacerlo sin que se convierta en caravana de tráfico y peleas de hotel.',
    excerpt_en: 'Easter road trip along the coast: Cancún, Playa del Carmen, Tulum, and cenotes along the way. How to do it without it turning into a traffic convoy and hotel fights.',

    destination_es: 'Quintana Roo',
    destination_en: 'Quintana Roo',

    tags_es: ['Playa', 'Roadtrip', 'Cenotes', 'Semana Santa'],
    tags_en: ['Beach', 'Road trip', 'Cenotes', 'Easter'],

    cover_img: '/images/guides/riviera-maya.jpg',

    sections: [
      {
        heading_es: 'La ruta recomendada',
        heading_en: 'The recommended route',
        body_es: 'Olvida ir de norte a sur — todo el mundo lo hace. Llega a Cancún, sube directo a Tulum el primer día, y ve subiendo hacia el norte durante el resto del viaje. Así esquivas el tráfico masivo y encuentras los cenotes sin filas.',
        body_en: 'Forget going north to south — everyone does it. Arrive in Cancún, go straight to Tulum on day one, and work your way north for the rest of the trip. This way you dodge mass traffic and find cenotes without queues.',
        tip_es: 'Reserva el cenote Dos Ojos con al menos 2 semanas de anticipación en Semana Santa.',
        tip_en: 'Book Cenote Dos Ojos at least 2 weeks in advance for Easter week.',
      },
      {
        heading_es: 'Playas que valen la pena',
        heading_en: 'Beaches worth it',
        body_es: 'Playa Paraíso en Tulum antes de las 8am (después es caos). Xpu-Ha es el secreto mejor guardado de la Riviera — arena blanca, aguas turquesas, sin clubs de playa. Akumal para ver tortugas marinas de manera segura y sin tour.',
        body_en: 'Playa Paraíso in Tulum before 8am (after that it\'s chaos). Xpu-Ha is the Riviera\'s best kept secret — white sand, turquoise water, no beach clubs. Akumal for sea turtles safely and without a tour.',
      },
      {
        heading_es: 'Cenotes imperdibles',
        heading_en: 'Must-see cenotes',
        body_es: 'Gran Cenote (Tulum): el más fotogénico, llega a las 8am. Ik Kil (Chichén Itzá): camino de regreso perfecto. Cenote Azul (Bacalar): el mejor para flotar sin multitudes. Evita los cenotes de la carretera 307 en Semana Santa — son trampas turísticas.',
        body_en: 'Gran Cenote (Tulum): the most photogenic, arrive at 8am. Ik Kil (Chichén Itzá): perfect on the way back. Cenote Azul (Bacalar): the best for floating without crowds. Avoid the highway 307 cenotes during Easter — tourist traps.',
      },
      {
        heading_es: 'Dónde comer en cada parada',
        heading_en: 'Where to eat at each stop',
        body_es: 'Tulum: La Eufemia para cenas, El Camello para mariscos sin pretensiones. Playa del Carmen: Babe\'s Noodles para romper con lo típico. Cancún: El Fish Fritanga en Mercado 28, lejos del Hotel Zone.',
        body_en: 'Tulum: La Eufemia for dinner, El Camello for no-frills seafood. Playa del Carmen: Babe\'s Noodles to break from the obvious. Cancún: El Fish Fritanga at Mercado 28, away from the Hotel Zone.',
      },
    ],
  },

  {
    slug_es: 'cuernavaca-refugio-de-primavera-estilo',
    slug_en: 'cuernavaca-spring-getaway-and-style',

    title_es: 'Cuernavaca',
    title_en: 'Cuernavaca',

    excerpt_es: 'La ciudad de la eterna primavera tiene más que jardines y fin de semana clasemediero. Guía editorial para descubrir sus vecindades, mercados y la arquitectura que no aparece en TripAdvisor.',
    excerpt_en: 'The city of eternal spring has more than gardens and middle-class weekends. An editorial guide to discovering its neighborhoods, markets, and the architecture that doesn\'t show up on TripAdvisor.',

    destination_es: 'Morelos',
    destination_en: 'Morelos',

    tags_es: ['Estilo de vida', 'Gastronomía', 'Arquitectura', 'Primavera'],
    tags_en: ['Lifestyle', 'Food', 'Architecture', 'Spring'],

    cover_img: '/images/guides/cuernavaca.jpg',

    sections: [
      {
        heading_es: 'Más allá del jardín Borda',
        heading_en: 'Beyond Jardín Borda',
        body_es: 'El circuito turístico básico de Cuernavaca es aburrido. La ciudad real está en las vecindades del centro histórico, el barrio de Tlaltenango y los alrededores del MUAA. Si solo tienes una tarde, camina desde el zócalo hacia Tlaltenango sin plan.',
        body_en: 'The basic tourist circuit in Cuernavaca is boring. The real city is in the historic center neighborhoods, the Tlaltenango district, and the surroundings of the MUAA. If you only have an afternoon, walk from the zócalo toward Tlaltenango without a plan.',
        tip_es: 'El Palacio de Cortés tiene una de las murallas de Diego Rivera menos visitadas del país. Entra.',
        tip_en: 'Cortés Palace has one of Diego Rivera\'s least-visited murals in the country. Go in.',
      },
      {
        heading_es: 'Dónde quedarse con criterio',
        heading_en: 'Where to stay with taste',
        body_es: 'Las villas con jardín son la razón real de ir. Busca propiedades en el barrio de Lomas de Cortés o cerca del Río Apatlaco. Hotel Las Mañanitas sigue siendo el referente si el presupuesto lo permite — el jardín con pavos reales es genuino, no kitsch.',
        body_en: 'Garden villas are the real reason to go. Look for properties in the Lomas de Cortés neighborhood or near the Apatlaco River. Hotel Las Mañanitas is still the benchmark if the budget allows — the peacock garden is genuine, not kitsch.',
      },
      {
        heading_es: 'Dónde comer',
        heading_en: 'Where to eat',
        body_es: 'Mercado Adolfo López Mateos: el mejor caldo tlalpeño de Morelos. La Universal: clásico para cecina con verdolagas. Los Arcos: terraza con vista al Palacio de Cortés, buen mezcal. Evita las cadenas del malecón.',
        body_en: 'Mercado Adolfo López Mateos: the best caldo tlalpeño in Morelos. La Universal: a classic for cecina with verdolagas. Los Arcos: terrace with views of the Cortés Palace, good mezcal. Avoid the chains on the malecón.',
      },
      {
        heading_es: 'Cómo llegar',
        heading_en: 'Getting there',
        body_es: 'Autopista del Sol desde el Periférico Sur: 1h 20min sin tráfico. Los viernes después de las 3pm la autopista es un estacionamiento. Si viajas ese día, sal antes de la 1pm o después de las 8pm. Los autobuses Pullman de Morelos desde Taxqueña son sorprendentemente buenos.',
        body_en: 'Autopista del Sol from Periférico Sur: 1h 20min without traffic. Friday afternoons after 3pm the highway is a parking lot. If traveling that day, leave before 1pm or after 8pm. Pullman de Morelos buses from Taxqueña are surprisingly good.',
        tip_es: 'Google Maps subestima siempre el tiempo en viernes — súmale 40 minutos.',
        tip_en: 'Google Maps always underestimates Friday travel time — add 40 minutes.',
      },
    ],
  },
]

// ── Helpers ───────────────────────────────────────────────

/** Returns all guides. Swap this for a DB call without changing consumers. */
export function getAllGuides(locale: Locale) {
  return GUIDES.map((guide) => ({
    ...guide,
    title: locale === 'es' ? guide.title_es : guide.title_en,
    excerpt: locale === 'es' ? guide.excerpt_es : guide.excerpt_en,
    slug: locale === 'es' ? guide.slug_es : guide.slug_en,
  }))
}



/**
 * Finds a guide by the slug for the given locale.
 * /es/guias/valle-de-bravo-...    → looks up slug_es
 * /en/guides/valle-de-bravo-...   → looks up slug_en
 */
export function getGuideBySlug(locale: Locale, slug: string): Guide | undefined {
  const field = locale === 'es' ? 'slug_es' : 'slug_en'
  return GUIDES.find(g => g[field] === slug)
}


/**
 * Returns all [locale, slug] pairs for generateStaticParams.
 * Produces one entry per locale per guide.
 */
export function getAllGuideParams(): { locale: string; slug: string }[] {
  const params: { locale: string; slug: string }[] = []
  for (const guide of GUIDES) {
    params.push({ locale: 'es', slug: guide.slug_es })
    params.push({ locale: 'en', slug: guide.slug_en })
  }
  return params
}

/** Returns a localized field value from a guide. */
export function guideField(guide: Guide, locale: Locale, field: 'title' | 'excerpt' | 'destination' | 'tags'): string | string[] {
  const key = `${field}_${locale}` as keyof Guide
  return guide[key] as string | string[]
}
