// content/guia/partners/livin_polanco.ts
//
// Partner layer for Livin — third property, Polanco (Horacio and Thiers
// block). Shares the "Livin" display identity with livin_condesa.ts and
// livin_roma.ts; slug, zone, homeNeighborhood and yourHouse differ.
//
// yourHouse.mapUrl is still Condesa's — no real Polanco list link exists
// yet, and per instruction this is flagged rather than guessed. Same for
// tagline/orientation below: no copy was given for these, so they're
// drafted here from the walking-time facts only (10-15 min for most spots,
// ~20-30 min for two) — flag for review, this is new phrasing, not sourced
// copy like the rest of the file.
//
// No faqAnswers/atAGlance/arrivalItemsOmit — no property-tier content yet,
// so "Your stay" stays absent (panels.length >= 2 rule).

import type { Partner } from '../types'

export const livinPolanco: Partner = {
  slug: 'livin_polanco',
  displayName: 'Livin',
  hostName: 'Livin',
  city: 'cdmx',
  homeNeighborhood: 'Polanco',
  yourHouse: {
    name: 'Horacio y Thiers',
    tabLabel: { es: 'Tu casa', en: 'Your house' },
    mapUrl: 'https://maps.app.goo.gl/qQSdT8RVpHCzGpxi8', // FLAG: Condesa's map link — needs a real Polanco list
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
}
