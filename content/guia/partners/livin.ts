// content/guia/partners/livin.ts
//
// Partner layer for Livin — the first (and currently only) filled slot.
// Small and specific: everything reusable lives in the city layer.

import type { Partner } from '../types'

export const livin: Partner = {
  slug: 'livin',
  displayName: 'Livin',
  // Curator shown in the hero eyebrow ("Curated by …").
  hostName: 'Livin',
  city: 'cdmx',
  homeNeighborhood: 'Roma Norte',
  yourHouse: {
    name: 'Veracruz 85',
    tabLabel: { es: 'Tu casa', en: 'Your house' },
    mapUrl: 'https://maps.app.goo.gl/qQSdT8RVpHCzGpxi8',
    tagline: { es: 'A pasos de tu puerta', en: 'Steps from your door' },
    orientation: { es: 'Todo aquí está genuinamente a 10 minutos a pie de tu casa, sin matices, esta es la zona real.', en: 'Everything here is genuinely a 10-minute walk from your house, no hedging, this is the real thing.' },
    spots: {
      es: [
        { icon: 'coffee',     name: 'Quentin',      distance: 'Ámsterdam 67a',                    note: 'Café de especialidad, repostería y una pequeña zona para sentarte, con decoración cuidada, el favorito del barrio.' },
        { icon: 'utensilsSm', name: 'Maizajo',       distance: 'Fernando Montes de Oca 113',       note: 'Tortillería en funcionamiento abajo, restaurante formal arriba. Pide el suadero y el tamal de boda. La taquería es de pie, sin reservación; el comedor de arriba sí las toma.' },
        { icon: 'trees',      name: 'Parque España',  distance: 'Parque España',   note: 'A unas cuadras: la contraparte más chica y tranquila del Parque México, una vuelta para correr, tianguis los sábados y bancas que se mantienen en sombra casi todo el día.' },
        { icon: 'landmark',   name: 'Foro Shakespeare', distance: 'Zamora 7, esq. Veracruz',       note: 'Un teatro independiente activo desde 1982, el foro alternativo de la ciudad, en la esquina misma. Taquilla abre a las 5pm entre semana.' },
        { icon: 'basket',     name: 'Choza',          distance: 'Tenancingo 38',                    note: 'Tienda y cafetería de vida artesanal: cerámica, textiles y objetos hechos en colaboración con artesanos independientes; buen lugar para un café mientras curioseas.' },
        { icon: 'martini',    name: 'Antesala',       distance: 'Sinaloa 141, Roma Nte., entre Cozumel y Salamanca', note: 'Coctelería de precisión junto a Lorea, con barra a la vista de los mixólogos y sets en vinil; más tranquilo que la Roma de fin de semana. Abre de martes a sábado desde las 6 pm, unos 10 minutos caminando.' },
      ],
      en: [
        { icon: 'coffee',     name: 'Quentin',      distance: 'Ámsterdam 67a',                    note: 'Specialty coffee, baked goods, a small seating area with trendy decor, the neighborhood\'s go-to.' },
        { icon: 'utensilsSm', name: 'Maizajo',       distance: 'Fernando Montes de Oca 113',       note: 'A working tortillería downstairs, a proper restaurant upstairs. Order the suadero and the tamal de boda. Standing-room taquería, no reservations; the upstairs dining room does take them.' },
        { icon: 'trees',      name: 'Parque España',  distance: 'Parque España',   note: 'A few blocks over: a smaller, calmer counterpart to Parque México, a loop for running, a Saturday market, and benches that stay in the shade most of the day.' },
        { icon: 'landmark',   name: 'Foro Shakespeare', distance: 'Zamora 7, esq. Veracruz',       note: 'An independent theater running since 1982, Mexico City\'s own alternative stage, right on the corner. Box office opens at 5pm on weekdays.' },
        { icon: 'basket',     name: 'Choza',          distance: 'Tenancingo 38',                    note: 'A lifestyle shop and coffee counter: ceramics, textiles and objects made in collaboration with independent artisans; good for a coffee while you browse.' },
        { icon: 'martini',    name: 'Antesala',       distance: 'Sinaloa 141, Roma Nte., entre Cozumel y Salamanca', note: 'Precision cocktails next to Lorea, with a bar that puts you right beside the mixologists and vinyl DJ sets; calmer than weekend Roma. Open Tuesday–Saturday from 6 pm, about a 10-minute walk.' },
      ],
    },
  },
  edition: {
    es: 'Edición Julio 2026',
    en: 'July 2026 Edition',
  },
  plannerCampaign: 'livin',
  hostLetterSignature: 'Livin',

  // No bespoke insider copy provided yet, so the Insiders section stays
  // unpublished — it unpublishes cleanly (no empty hole). Do NOT invent
  // experiences here; fill items[] + set publish: true when real copy arrives.
  insiders: {
    publish: false,
  },
}
