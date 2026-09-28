// content/guia/partners/livin_polanco.ts
//
// Partner layer for Livin — third property, Polanco (Horacio and Thiers
// block). Shares the "Livin" display identity with livin_condesa.ts and
// livin_roma.ts; slug, zone, homeNeighborhood and yourHouse differ.
//
// tagline/orientation below: no copy was given for these, so they're
// drafted here from the walking-time facts only (10-15 min for most spots,
// ~20-30 min for two) — flag for review, this is new phrasing, not sourced
// copy like the rest of the file.
//
// No atAGlance — no confirmed check-in/out/luggage facts yet, so "Your
// stay" stays absent (panels.length >= 2 rule; faqAnswers.chefsAtHome
// below is Tier B/ZoneFaqKey, not Tier A, so it doesn't clear that gate).

import type { Partner } from '../types'
import { CHEF_WHATSAPP_NUMBER } from '../../../lib/guia/links'

export const livinPolanco: Partner = {
  slug: 'livin_polanco',
  displayName: 'Livin',
  hostName: 'Livin',
  city: 'cdmx',
  homeNeighborhood: 'Polanco',
  yourHouse: {
    name: 'Horacio y Thiers',
    tabLabel: { es: 'Tu casa', en: 'Your house' },
    mapUrl: 'https://maps.app.goo.gl/RrvHRV6ny45J8yen6',
    tagline: { es: 'Una caminata corta, casi siempre', en: 'A short walk, mostly' },
    orientation: {
      es: 'La mayoría de estos lugares está a 10–15 minutos caminando desde Horacio y Thiers; dos quedan más lejos y valen la distancia extra, como se indica abajo.',
      en: 'Most of these are 10–15 minutes from Horacio and Thiers on foot; two are further out and worth the extra distance, noted below.',
    },
    spots: {
      es: [
        { icon: 'coffee',     name: 'La Caja de Cristal', distance: 'Av. Isaac Newton 186',      note: 'Café de especialidad en dos pisos, grano de Chiapas y espacio de sobra para sentarte con la computadora. A unos quince minutos caminando. Cierra los domingos.' },
        { icon: 'utensilsSm', name: 'Ticuchi',            distance: 'Petrarca 254',               note: 'Cocina de agave en el local donde empezó Pujol. Siéntate en la barra si puedes. Cierra los domingos y la cocina trabaja hasta tarde.' },
        // CONFIRM: the Pujol lineage. Well documented, but verify before it ships.
        { icon: 'trees',      name: 'Parque Gandhi',      distance: 'Bosque de Chapultepec',      note: 'Un circuito de un kilómetro bajo los árboles, abierto a cualquier hora, y conecta directo con Chapultepec si quieres lo de verdad. A unos quince minutos.' },
        { icon: 'landmark',   name: 'Museo Tamayo',       distance: 'Paseo de la Reforma 51',     note: 'Arte contemporáneo en un edificio que vale la visita por sí solo, en la orilla de Chapultepec. Cierra los lunes; el resto de la semana abre hasta las 6.' },
        { icon: 'basket',     name: 'Liverpool',          distance: 'Mariano Escobedo 425',       note: 'La tienda departamental está a diez minutos y resuelve casi todo lo que se te haya olvidado. Si buscas algo mejor, sigue caminando hacia Polanco: las boutiques de Masaryk y las calles de alrededor valen los minutos extra.' },
        { icon: 'martini',    name: 'Librería Castelar',  distance: 'Av. Emilio Castelar 135',    note: 'Una barra de coctelería escondida detrás de un librero, más lejos que todo lo demás de esta lista: media hora caminando, o un viaje corto. Vale la pena. Abre a las 5 y cierra los lunes.' },
      ],
      en: [
        { icon: 'coffee',     name: 'La Caja de Cristal', distance: 'Av. Isaac Newton 186',      note: 'Specialty coffee across two floors, beans from Chiapas, and room enough to sit with a laptop. About fifteen minutes on foot. Closed Sundays.' },
        { icon: 'utensilsSm', name: 'Ticuchi',            distance: 'Petrarca 254',               note: 'Agave cooking in the space where Pujol began. Sit at the bar if you can. Closed Sundays, and the kitchen runs late.' },
        // CONFIRM: the Pujol lineage. Well documented, but verify before it ships.
        { icon: 'trees',      name: 'Parque Gandhi',      distance: 'Bosque de Chapultepec',      note: 'A one-kilometre loop under trees, open at any hour, and it runs straight into Chapultepec if you want the real thing. About fifteen minutes away.' },
        { icon: 'landmark',   name: 'Museo Tamayo',       distance: 'Paseo de la Reforma 51',     note: 'Contemporary art in a building worth the trip on its own, at the edge of Chapultepec. Closed Mondays; open until 6 the rest of the week.' },
        { icon: 'basket',     name: 'Liverpool',          distance: 'Mariano Escobedo 425',       note: 'The department store is ten minutes away and covers most of what you forgot to pack. For something better, keep walking into Polanco — the boutiques on Masaryk and the side streets are worth the extra few minutes.' },
        { icon: 'martini',    name: 'Librería Castelar',  distance: 'Av. Emilio Castelar 135',    note: 'A cocktail bar hidden behind a bookshelf, further out than anything else on this list — half an hour on foot, or a short ride. Worth it. Opens at 5, closed Mondays.' },
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

  zone: 'polanco',
  utmContent: 'polanco_guide',
  practicalSubhead: {
    es: 'Lo práctico está a unas cuadras. El resto de Polanco vale la caminata.',
    en: 'Everything practical is within a few blocks. The rest of Polanco is worth the walk.',
  },

  // "Health & Pharmacies" now renders under Take care instead of Before
  // you arrive — hides the city-level arrivalItems duplicate without
  // touching its text. 2026-09-28, Livin brief.
  arrivalItemsOmit: ['health-pharmacies'],

  // No massages entry here — deliberately excluded per the brief (Casa
  // Ancestras is Condesa/Roma only). Take care renders 3 cards for
  // Polanco (gyms, healthPharmacies, and familiesPets once a zone entry
  // exists), not 4 — expected, not a gap to fill.
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
            href: `https://wa.me/${CHEF_WHATSAPP_NUMBER}?text=Hi!%20I'm%20staying%20at%20Livin%20Polanco%20and%20I'd%20like%20a%20private%20chef%20on%20%5Bdate%5D%20for%20%5B%23%5D%20people.`,
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
            href: `https://wa.me/${CHEF_WHATSAPP_NUMBER}?text=%C2%A1Hola!%20Me%20estoy%20quedando%20en%20Livin%20Polanco%20y%20quiero%20un%20chef%20privado%20el%20%5Bfecha%5D%20para%20%5B%23%5D%20personas.`,
            after: ' · ',
            linkName: 'chef_whatsapp',
          },
          { text: 'Take a Chef', href: 'https://www.takeachef.com/es-mx/our-chefs', linkName: 'chef_take_a_chef' },
        ],
      },
    },
  },
}
