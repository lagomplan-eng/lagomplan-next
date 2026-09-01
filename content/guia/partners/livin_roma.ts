// content/guia/partners/livin_roma.ts
//
// Partner layer for Livin — second property, Roma Norte. Shares the "Livin"
// display identity with content/guia/partners/livin.ts; only slug, city
// zone tabs (shared with livin via content/guia/cities/cdmx.ts), and
// yourHouse (this property's own address-level picks) differ.

import type { Partner } from '../types'

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
  plannerCampaign: 'livin',
  hostLetterSignature: 'Livin',

  // Same as livin.ts: no bespoke insider copy yet, stays unpublished.
  insiders: {
    publish: false,
  },
}
