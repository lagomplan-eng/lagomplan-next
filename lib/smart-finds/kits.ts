/**
 * lib/smart-finds/kits.ts
 *
 * Smart Finds kit definitions for the Familias volume. Each kit
 * references products by stable ID from PRODUCTS — never inlines them.
 *
 * Two kit shapes:
 *   - 'flat'    → hero card + grid (currently used by 01 and 03)
 *   - 'systems' → tabbed (currently used by 02 La mochila)
 *
 * Hero rules:
 *   - 'flat' kits mark exactly ONE product with hero: true → renders
 *     as the full-width HeroCard above the grid
 *   - 'systems' kits mark one product hero per system → renders as
 *     HeroCard at the top of that tab's content
 *
 * When the catalog migrates to Supabase, this array becomes rows in a
 * `kits` table; each section/subsection becomes a row in `kit_sections`
 * / `kit_subsections`; each productId becomes a row in the
 * `kit_section_products` join.
 */

import type { Kit } from './types'

export const KITS: Kit[] = [

  // ── KIT 01 ─────────────────────────────────────────────────────────────
  {
    id:         'operativo',
    num:        '01',
    title:      'El operativo',
    subtitle:   'Del aeropuerto al Uber al hotel al restaurante. Y repetir.',
    painMoment: 'El taxi no acepta la carriola',
    scene:      'El taxi no acepta la carriola. Y ese es solo el primero de los once traslados del viaje.',
    content: {
      type: 'flat',
      products: [
        { productId: 'doona-car-seat-stroller',  hero: true },
        { productId: 'babyzen-yoyo2'                       },
        { productId: 'ergobaby-omni-breeze'                },
        { productId: 'samsonite-cabin-suitcase'            },
        { productId: 'apple-airtag-4pack'                  },
      ],
    },
  },

  // ── KIT 02 ─────────────────────────────────────────────────────────────
  {
    id:         'mochila',
    num:        '02',
    title:      'La mochila',
    subtitle:   'Para vuelos largos y traslados que no terminan.',
    painMoment: 'La mochila de los niños · sin sistema, sin paz',
    scene:      'La mochila del niño puede ser la mejor herramienta del viaje o el mayor generador de caos. La diferencia no está en los productos — está en el sistema.',
    omit:       'Tablets sin contenido descargado previamente — en el avión no hay wifi confiable. Snacks con azúcar para el despegue — el pico y la caída se sienten en 60cm².',
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
          note:  'Clave: rotación cada 20–30 min. El mismo juego dos horas seguidas no funciona.',
          subSections: [
            {
              label: 'A — INICIO DEL VUELO · actividades tranquilas',
              products: [
                { productId: 'melissa-doug-travel-journal'            },
                { productId: 'fantasy-flight-mysterium-kids', hero: true },
                { productId: 'picasso-tiles-magnetic-40'              },
                { productId: 'crayola-notebook-crayons'               },
              ],
            },
            {
              label: 'B — MITAD DEL VUELO · actividades interactivas',
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

  // ── KIT 03 ─────────────────────────────────────────────────────────────
  {
    id:         'quedarse',
    num:        '03',
    title:      'Quedarse',
    subtitle:   'Lo que los hoteles no te dan. Y no son más toallas.',
    painMoment: '40 minutos en la playa · demasiado sol',
    scene:      'El hotel tiene toallas, camastros, y un niñero que trae agua. Lo que no tiene es sombra de verdad para un bebé de 10 meses.',
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
