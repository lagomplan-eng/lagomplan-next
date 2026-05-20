/**
 * lib/smart-finds/kits.ts
 *
 * Smart Finds kit definitions. Each kit references products by stable ID
 * from PRODUCTS — never inlines them.
 *
 * Two kit shapes:
 *   - 'flat'    → hero card + grid (used by 8 of 9 kits)
 *   - 'systems' → tabbed (used by 02 Para que duerma)
 *
 * Hero rules:
 *   - 'flat' kits mark exactly ONE product with hero: true → renders
 *     as the full-width HeroCard above the grid
 *   - 'systems' kits mark one product hero per system → renders as
 *     HeroCard at the top of that tab's content
 *
 * Persona field drives the persona-coloured badge in each kit's section
 * header AND the FilterBar membership. `situations` is reserved for
 * future filtering — empty array on launch.
 *
 * When the catalog migrates to Supabase, this array becomes rows in a
 * `kits` table; each section/subsection becomes a row in `kit_sections`
 * / `kit_subsections`; each productId becomes a row in the
 * `kit_section_products` join.
 */

import type { Kit } from './types'

export const KITS: Kit[] = [

  // ═════════════════════════════════════════════════════════════════════
  // FAMILIAS
  // ═════════════════════════════════════════════════════════════════════

  {
    id:         'sin-perder-a-nadie',
    num:        '01',
    persona:    'familias',
    situations: [],
    title:      'Sin perder a nadie',
    subtitle:   'Del aeropuerto al Uber al hotel al restaurante. Y repetir.',
    painMoment: 'El taxi no acepta la carriola',
    scene:      'El taxi no acepta la carriola. Y ese es solo el primero de los once traslados del viaje.',
    content: {
      type: 'flat',
      products: [
        { productId: 'doona-car-seat-stroller',  hero: true },
        { productId: 'gb-pockit-all-city'                  },
        { productId: 'ergobaby-omni-breeze'                },
        { productId: 'mia-mily-cabin-suitcase'             },
        { productId: 'apple-airtag-4pack'                  },
      ],
    },
  },

  {
    id:         'para-que-duerma',
    num:        '02',
    persona:    'familias',
    situations: [],
    title:      'Para que duerma',
    subtitle:   'Para vuelos largos y traslados que no terminan.',
    painMoment: 'La mochila de los niños · sin sistema, sin paz',
    scene:      'El avión tiene 3 horas de vuelo. El bebé no duerme si no llevas el sistema correcto. Esto es el sistema.',
    omit:       'Tablets sin contenido descargado previamente — en el avión no hay wifi confiable. Snacks con azúcar para el despegue.',
    content: {
      type: 'systems',
      systems: [
        {
          id:    'contenedor',
          label: 'EL CONTENEDOR',
          note:  'El niño carga su mochila. Tú no cargas todo.',
          products: [
            { productId: 'skip-hop-mini-backpack', hero: true },
            { productId: 'packing-pouches-3cat'                },
          ],
        },
        {
          id:    'programa',
          label: 'EL PROGRAMA',
          note:  'Rotación cada 20–30 min. El mismo juego dos horas seguidas no funciona.',
          subSections: [
            {
              label: 'A — INICIO DEL VUELO · tranquilas',
              products: [
                { productId: 'melissa-doug-travel-journal'              },
                { productId: 'fantasy-flight-mysterium-kids', hero: true },
                { productId: 'picasso-tiles-magnetic-40'                },
                { productId: 'crayola-notebook-crayons'                 },
              ],
            },
            {
              label: 'B — MITAD DEL VUELO · interactivas',
              products: [
                { productId: 'creativity-hub-question-cards' },
                { productId: 'smily-play-magnetic-pad'       },
              ],
            },
            {
              label: 'C — CUANDO TODO FALLA · backup digital',
              products: [
                { productId: 'buddyphones-play-plus', hero: true },
                { productId: 'amazon-fire-hd-kids'               },
              ],
            },
          ],
        },
        {
          id:    'despensa',
          label: 'LA DESPENSA',
          note:  'Donde muchas mamás improvisan. No improvises.',
          products: [
            { productId: 'sistema-snack-spinner', hero: true },
            { productId: 'dried-fruit-mix'                   },
            { productId: 'gerber-crackers'                   },
            { productId: 'contigo-spill-bottle'              },
            { productId: 'pampers-wipes-ziplock'             },
          ],
        },
        {
          id:    'ritual',
          label: 'EL RITUAL',
          note:  'Lo que reduce el estrés emocional. No es secundario.',
          products: [
            { productId: 'favorite-object'      },
            { productId: 'trtl-kids-neckpillow' },
            { productId: 'light-blanket'        },
          ],
        },
      ],
    },
  },

  {
    id:         'para-no-salir-corriendo',
    num:        '03',
    persona:    'familias',
    situations: [],
    title:      'Para no salir corriendo',
    subtitle:   'Lo que los hoteles no te dan. Y no son más toallas.',
    painMoment: '40 minutos en la playa · demasiado sol',
    scene:      'Llegaron a la playa. Cuarenta minutos después, todos están de regreso en el cuarto. Con el kit correcto esos 40 minutos se convierten en 3 horas.',
    content: {
      type: 'flat',
      products: [
        { productId: 'monobeach-popup-tent',     hero: true },
        { productId: 'babyganics-mineral-spf50'             },
        { productId: 'swimways-spring-float'                },
        { productId: 'cgear-sandless-mat'                   },
        { productId: 'huggies-little-swimmers'              },
      ],
    },
  },

  // ═════════════════════════════════════════════════════════════════════
  // PAREJAS
  // ═════════════════════════════════════════════════════════════════════

  {
    id:         'nunca-mas-en-el-carrusel',
    num:        '04',
    persona:    'parejas',
    situations: [],
    title:      'Nunca más en el carrusel',
    subtitle:   'Cuatro días. Una maleta de mano. Sin esperar en baggage claim.',
    painMoment: 'Aterrizaste · todo el mundo camina a la salida · tú esperas',
    scene:      'Aterrizaste. Todo el mundo camina directo a la salida. Tú esperas la maleta. Esta es la última vez.',
    content: {
      type: 'flat',
      products: [
        { productId: 'calpak-carry-on-expandable', hero: true },
        { productId: 'eagle-creek-pack-it-cubes'              },
        { productId: 'matador-flatpak-toiletry'               },
        { productId: 'etekcity-luggage-scale'                 },
        { productId: 'bellroy-tech-kit'                       },
      ],
    },
  },

  {
    id:         'para-que-el-lunes-no-duela-tanto',
    num:        '05',
    persona:    'parejas',
    situations: [],
    title:      'Para que el lunes no duela tanto',
    subtitle:   '72 horas. Sin desperdiciar ninguna.',
    painMoment: '3 días · sin aprovecharlos regresas como de la oficina',
    scene:      'Tienes del viernes por la noche al domingo a las 10pm. O lo aprovechas bien, o regresas sintiéndote como si hubieras desperdiciado el único puente del mes.',
    content: {
      type: 'flat',
      products: [
        { productId: 'jbl-clip-5',          hero: true },
        { productId: 'beis-the-weekender'              },
        { productId: 'slip-silk-eye-mask'              },
        { productId: 'wacaco-nanopresso'               },
        { productId: 'hydroflask-32oz'                 },
      ],
    },
  },

  {
    id:         'sin-cargador-prestado',
    num:        '06',
    persona:    'parejas',
    situations: [],
    title:      'Sin cargador prestado',
    subtitle:   'Para el viajero que siempre encuentra la forma de quedarse sin batería.',
    painMoment: 'El teléfono en 4% · el vuelo en 20 minutos',
    scene:      'El teléfono en 4%, el vuelo en 20 minutos, nadie alrededor con el cable correcto. Esto no vuelve a pasar.',
    content: {
      type: 'flat',
      products: [
        { productId: 'anker-733-power-bank-65w', hero: true },
        { productId: 'anker-727-gan-charger'                },
        { productId: 'epicka-travel-adapter'                },
        { productId: 'airalo-esim-no-roaming'               },
        { productId: 'nomad-cable-organizer'                },
      ],
    },
  },

  // ═════════════════════════════════════════════════════════════════════
  // FAN
  // ═════════════════════════════════════════════════════════════════════

  {
    id:         'en-las-gradas',
    num:        '07',
    persona:    'fan',
    situations: [],
    title:      'En las gradas, no en la pantalla',
    subtitle:   'Lo que llevas el día del partido. Nada más, nada menos.',
    painMoment: 'La entrada costó lo que costó · y la mochila no pasó la revisión',
    scene:      'La entrada costó lo que costó. Lo último que quieres es que algo falle en la puerta. Esto es exactamente lo que llevas al estadio.',
    content: {
      type: 'flat',
      products: [
        { productId: 'patagonia-black-hole-crossbody', hero: true },
        { productId: 'anker-powercore-10000-slim'                 },
        { productId: 'loop-experience-earplugs'                   },
        { productId: 'sol-rain-poncho'                            },
        { productId: 'bellroy-travel-wallet'                      },
      ],
    },
  },

  {
    id:         'de-estadio-en-estadio',
    num:        '08',
    persona:    'fan',
    situations: [],
    title:      'De estadio en estadio',
    subtitle:   'Tres ciudades. Tres partidos. Una sola mochila.',
    painMoment: 'Tres ciudades · diez días · una maleta que no cabe en cabina',
    scene:      'Tres ciudades. Tres partidos. Diez días. Si documentas maleta en cada vuelo, pierdes dos horas de viaje en cada escala.',
    content: {
      type: 'flat',
      products: [
        { productId: 'osprey-farpoint-40',         hero: true },
        { productId: 'sea-to-summit-scrubba'                  },
        { productId: 'eagle-creek-compression-cubes'          },
        { productId: 'etekcity-luggage-scale-fan'             },
        { productId: 'lagomplan-planner-wc'                   },
      ],
    },
  },

  {
    id:         'el-viaje-grande',
    num:        '09',
    persona:    'fan',
    situations: [],
    title:      'El viaje que le vas a contar a tus hijos',
    subtitle:   'Primera vez cruzando al otro lado para ver un partido.',
    painMoment: 'Primera vez en el extranjero · puede salir perfecto o como película de terror',
    scene:      'Es la primera vez que cruzas para ver un partido. Puede salir perfecto o puede salir como una película de terror logístico.',
    content: {
      type: 'flat',
      products: [
        { productId: 'bellroy-passport-sleeve', hero: true },
        { productId: 'world-nomads-insurance'              },
        { productId: 'airalo-esim-usa-canada'              },
        { productId: 'wise-card'                           },
        { productId: 'pacsafe-coversafe-belt'              },
      ],
    },
  },

]

// ── Lookup ──────────────────────────────────────────────────────────────

/**
 * Returns the kit matching the slug used in the URL (e.g. 'operativo'),
 * or undefined if the slug doesn't exist. Pages should treat undefined
 * as a 404.
 */
export function getKit(id: string): Kit | undefined {
  return KITS.find(k => k.id === id)
}

/**
 * Returns kits filtered by persona. Passing 'all' returns every kit
 * unchanged. Used by the FilterBar on the Familias page.
 */
export function getKitsByPersona(
  persona: 'all' | 'familias' | 'parejas' | 'fan',
): Kit[] {
  if (persona === 'all') return KITS
  return KITS.filter(k => k.persona === persona)
}
