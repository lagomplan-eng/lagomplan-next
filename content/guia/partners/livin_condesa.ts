// content/guia/partners/livin_condesa.ts
//
// Partner layer for Livin Condesa — the original filled slot, renamed
// from slug 'livin' now that a second Livin property (Livin Roma, see
// livin_roma.ts) exists in the same pilot. Small and specific: everything
// reusable lives in the city layer.

import type { Partner } from '../types'
import { CHEF_WHATSAPP_NUMBER } from '../../../lib/guia/links'

export const livinCondesa: Partner = {
  slug: 'livin_condesa',
  displayName: 'Livin',
  // Curator shown in the hero eyebrow ("Curated by …").
  hostName: 'Livin',
  city: 'cdmx',
  homeNeighborhood: 'Condesa',
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
  pilotId: 'mxcity_pilot',
  hostLetterSignature: 'Livin',

  // No bespoke insider copy provided yet, so the Insiders section stays
  // unpublished — it unpublishes cleanly (no empty hole). Do NOT invent
  // experiences here; fill items[] + set publish: true when real copy arrives.
  insiders: {
    publish: false,
  },

  zone: 'condesa',
  atAGlance: {
    checkOut: '11:00',
  },

  // "Health & Pharmacies" now renders under Take care (faqAnswers falls
  // through to base.defaults.healthPharmacies) instead of Before you
  // arrive — this hides the city-level arrivalItems duplicate for this
  // partner without touching its text. 2026-09-28, Livin brief.
  arrivalItemsOmit: ['health-pharmacies'],

  // Partner-tier (Tier A doesn't apply here — chefsAtHome/massages are
  // Tier B/ZoneFaqKey, just set at the partner layer per the brief rather
  // than the zone layer, so Partner > Zone > base resolution picks these
  // over condesa.ts's absence and faqBase.defaults' generic concierge
  // text). Added 2026-09-28.
  faqAnswers: {
    chefsAtHome: {
      body: {
        en:
          'Two chefs we work with come to the apartment and plan the menu around ' +
          'your group. Chef Adán Canales cooks international cuisine; Chef Mateo ' +
          'di Monaco cooks Italian. Message us on WhatsApp with your date and ' +
          'headcount, ideally three days ahead. Looking for something else? ' +
          'Browse chefs on Take a Chef.',
        es:
          'Trabajamos con dos chefs que van al departamento y arman el menú según ' +
          'tu grupo. Chef Adán Canales cocina internacional; Chef Mateo di ' +
          'Monaco, italiana. Escríbenos por WhatsApp con la fecha y el número de ' +
          'personas, idealmente con tres días de anticipación. ¿Buscas otra ' +
          'cocina? Explora chefs en Take a Chef.',
      },
      links: {
        en: [
          {
            text: 'WhatsApp',
            href: `https://wa.me/${CHEF_WHATSAPP_NUMBER}?text=Hi!%20I'm%20staying%20at%20Livin%20Condesa%20and%20I'd%20like%20a%20private%20chef%20on%20%5Bdate%5D%20for%20%5B%23%5D%20people.`,
            after: ' · ',
            linkName: 'chef_whatsapp',
          },
          // CONFIRM (Elena): does an English-language version of Take a
          // Chef's directory exist? Using the ES URL until confirmed.
          { text: 'Take a Chef', href: 'https://www.takeachef.com/es-mx/our-chefs', linkName: 'chef_take_a_chef' },
        ],
        es: [
          {
            text: 'WhatsApp',
            href: `https://wa.me/${CHEF_WHATSAPP_NUMBER}?text=%C2%A1Hola!%20Me%20estoy%20quedando%20en%20Livin%20Condesa%20y%20quiero%20un%20chef%20privado%20el%20%5Bfecha%5D%20para%20%5B%23%5D%20personas.`,
            after: ' · ',
            linkName: 'chef_whatsapp',
          },
          { text: 'Take a Chef', href: 'https://www.takeachef.com/es-mx/our-chefs', linkName: 'chef_take_a_chef' },
        ],
      },
    },
    massages: {
      body: {
        en:
          'Casa Ancestras, at Tenancingo 26 in Condesa, is a small, unpretentious ' +
          'space where the therapists are the reason to go. They do massages and ' +
          'facials rooted in traditional Mexican bodywork, and they work in ' +
          'English too. By appointment only.',
        es:
          'Casa Ancestras, en Tenancingo 26 en la Condesa, es un espacio sencillo ' +
          'donde lo que vale la pena son las terapeutas. Hacen masajes y faciales ' +
          'basados en la tradición mexicana del cuidado con las manos, y ' +
          'atienden también en inglés. Solo con cita.',
      },
      links: {
        en: [
          { text: 'Book online', href: 'https://app.acuityscheduling.com/schedule/96fb162e', after: ' · ', linkName: 'massage_book' },
          { text: 'WhatsApp', href: 'https://wa.me/525611224292', after: ' · ', linkName: 'massage_whatsapp' },
          { text: 'Map', href: 'https://www.google.com/maps/search/?api=1&query=Tenancingo%2026%2C%20Condesa%2C%20CDMX', linkName: 'massage_map' },
        ],
        es: [
          { text: 'Reservar en línea', href: 'https://app.acuityscheduling.com/schedule/96fb162e', after: ' · ', linkName: 'massage_book' },
          { text: 'WhatsApp', href: 'https://wa.me/525611224292', after: ' · ', linkName: 'massage_whatsapp' },
          { text: 'Mapa', href: 'https://www.google.com/maps/search/?api=1&query=Tenancingo%2026%2C%20Condesa%2C%20CDMX', linkName: 'massage_map' },
        ],
      },
      // Optional fields intentionally omitted per the brief (empty > invented): price, what's included, languages, group size.
    },
  },
}
