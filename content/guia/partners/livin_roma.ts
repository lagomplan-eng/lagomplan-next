// content/guia/partners/livin_roma.ts
//
// Partner layer for Livin — second property, Roma Norte. Shares the "Livin"
// display identity with content/guia/partners/livin_condesa.ts; only slug,
// city zone tabs (shared with Livin Condesa via content/guia/cities/cdmx.ts),
// and yourHouse (this property's own address-level picks) differ.

import type { Partner } from '../types'
import { CHEF_WHATSAPP_NUMBER } from '../../../lib/guia/links'

export const livinRoma: Partner = {
  slug: 'livin_roma',
  displayName: 'Livin',
  // Curator shown in the hero eyebrow ("Curated by …").
  hostName: 'Livin',
  city: 'cdmx',
  homeNeighborhood: 'Roma Norte',
  yourHouse: {
    name: 'Livin Roma',
    tabLabel: { es: 'Tu casa', en: 'Your house' },
    mapUrl: 'https://maps.app.goo.gl/mamFTGz51ENJpT4D9',
    tagline: { es: 'A pasos de tu puerta', en: 'Steps from your door' },
    orientation: { es: 'Todo aquí está genuinamente a 10 minutos a pie de tu casa, sin matices, esta es la zona real.', en: 'Everything here is genuinely a 10-minute walk from your house, no hedging, this is the real thing.' },
    spots: {
      es: [
        { icon: 'coffee',     name: 'Panadería Rosetta',       distance: 'Colima 179', note: 'La panadería de Elena Reygadas: repostería, café y un pequeño patio al frente. El roll de guayaba es lo que hace la fila; ve antes de las 9am y no habrá.' },
        { icon: 'utensilsSm', name: 'La Once Mil',             distance: 'Orizaba 83', note: 'Tacos y clásicos mexicanos alrededor de un patio lleno de plantas, con las tortillas hechas a mano en la entrada. Abre desde las 11am; la espera en la cena es real, la comida es más tranquila.' },
        { icon: 'trees',      name: 'Plaza Río de Janeiro',    distance: 'Plaza Río de Janeiro, Roma Nte.', note: 'La plaza sobre la que se construyó el barrio: jacarandas, una fuente con un David de bronce y la Casa de las Brujas en la esquina. Bancas, perros y sombra toda la tarde.' },
        { icon: 'landmark',   name: 'MODO Museo del Objeto',   distance: 'Colima 145', note: 'Un museo de objetos cotidianos —empaques, diseño, publicidad— con exposiciones rotativas dentro de una casona de la Roma. Cierra los lunes.' },
        { icon: 'basket',     name: 'Metate',                  distance: 'Orizaba 92', note: 'Cerámica, textiles, joyería y objetos de artesanos mexicanos, curados en un solo espacio. El tipo de regalo que sí te vas a llevar a casa. Abre diario hasta las 7pm.' },
        { icon: 'martini',    name: 'Bar Mauro',                distance: 'Tabasco 149', note: 'Cocteles con un patio trasero interior-exterior y música que deja seguir hablando. Cierra los martes; abre a las 5pm, 4pm viernes y sábado.' },
      ],
      en: [
        { icon: 'coffee',     name: 'Panadería Rosetta',       distance: 'Colima 179', note: 'Elena Reygadas\'s bakery: pastries, coffee and a small patio out front. The guava roll is what the line is for; go before 9am and there isn\'t one.' },
        { icon: 'utensilsSm', name: 'La Once Mil',             distance: 'Orizaba 83', note: 'Tacos and Mexican classics around a plant-filled courtyard, with the tortillas made by hand at the entrance. Open from 11am; the dinner wait is real, lunch is calmer.' },
        { icon: 'trees',      name: 'Plaza Río de Janeiro',    distance: 'Plaza Río de Janeiro, Roma Nte.', note: 'The square the neighbourhood is built around: jacarandas, a fountain with a bronze David, and the Casa de las Brujas on the corner. Benches, dogs, and shade all afternoon.' },
        { icon: 'landmark',   name: 'MODO Museo del Objeto',   distance: 'Colima 145', note: 'A museum of everyday objects — packaging, design, advertising — with rotating exhibitions inside an old Roma house. Closed Mondays.' },
        { icon: 'basket',     name: 'Metate',                  distance: 'Orizaba 92', note: 'Ceramics, textiles, jewellery and objects from Mexican artisans, curated into one room. The kind of gift you\'ll actually carry home. Open daily until 7pm.' },
        { icon: 'martini',    name: 'Bar Mauro',                distance: 'Tabasco 149', note: 'Cocktails with an indoor-outdoor back patio and music that lets you keep talking. Closed Tuesdays; doors at 5pm, 4pm Friday and Saturday.' },
      ],
    },
  },
  edition: {
    es: 'Edición Julio 2026',
    en: 'July 2026 Edition',
  },
  pilotId: 'mxcity_pilot',
  hostLetterSignature: 'Livin',

  // Same as livin_condesa.ts: no bespoke insider copy yet, stays unpublished.
  insiders: {
    publish: false,
  },

  zone: 'roma',

  // "Health & Pharmacies" now renders under Take care instead of Before
  // you arrive — hides the city-level arrivalItems duplicate without
  // touching its text. 2026-09-28, Livin brief.
  arrivalItemsOmit: ['health-pharmacies'],

  faqAnswers: {
    chefsAtHome: {
      // Body ends right before "WhatsApp" / "por" so the two InlineLinks
      // below splice in as the actual hyperlinked words mid-sentence,
      // matching the pattern already used for Transportation's Insider
      // link. Moved 2026-09-28 per direct feedback on the live page.
      body: {
        en:
          'Two chefs we work with come to the apartment and plan the menu around ' +
          'your group. Chef Adán Canales cooks international cuisine; Chef Mateo ' +
          'di Monaco cooks Italian. Message us on',
        es:
          'Trabajamos con dos chefs que van al departamento y arman el menú según ' +
          'tu grupo. Chef Adán Canales cocina internacional; Chef Mateo di ' +
          'Monaco, italiana. Escríbenos por',
      },
      links: {
        en: [
          {
            text: 'WhatsApp',
            href: `https://wa.me/${CHEF_WHATSAPP_NUMBER}?text=Hi!%20I'm%20staying%20at%20Livin%20Roma%20and%20I'd%20like%20a%20private%20chef%20on%20%5Bdate%5D%20for%20%5B%23%5D%20people.`,
            after: ' with your date and headcount, ideally three days ahead. Looking for something else? Browse chefs on',
            linkName: 'chef_whatsapp',
          },
          // CONFIRM (Elena): does an English-language version of Take a
          // Chef's directory exist? Using the ES URL until confirmed.
          { text: 'Take a Chef', href: 'https://www.takeachef.com/es-mx/our-chefs', after: '.', linkName: 'chef_take_a_chef' },
        ],
        es: [
          {
            text: 'WhatsApp',
            href: `https://wa.me/${CHEF_WHATSAPP_NUMBER}?text=%C2%A1Hola!%20Me%20estoy%20quedando%20en%20Livin%20Roma%20y%20quiero%20un%20chef%20privado%20el%20%5Bfecha%5D%20para%20%5B%23%5D%20personas.`,
            after: ' con la fecha y el número de personas, idealmente con tres días de anticipación. ¿Buscas otra cocina? Explora chefs en',
            linkName: 'chef_whatsapp',
          },
          { text: 'Take a Chef', href: 'https://www.takeachef.com/es-mx/our-chefs', after: '.', linkName: 'chef_take_a_chef' },
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
      // Note: Casa Ancestras is in Condesa, not Roma — the brief lists this
      // as a partner-layer card for both livin_condesa AND livin_roma (not
      // zone-scoped), so the address stays Condesa's for both. Not a typo.
    },
  },
}
