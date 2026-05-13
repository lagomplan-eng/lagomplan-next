/**
 * lib/smart-finds/products.ts
 *
 * The Smart Finds product catalog — single source of truth for every
 * product that can appear on a kit page (Familias) or the Hotels-page
 * strip. Lookup is keyed by stable kebab-case product ID so kit
 * definitions reference products without copying them.
 *
 * Two product cohorts coexist here:
 *
 *   1. Familias-kit products — render with an SVG glyph from icons.tsx
 *      (`icon` field). Used by KITS in ./kits.ts. No surface tag needed
 *      — kit membership is the surface.
 *
 *   2. Hotels-strip products — render with an emoji glyph (`emoji`
 *      field) and carry `surfaces: ['hotels-strip']`. Consumed by
 *      `components/hotels/SmartFindsSection.tsx`.
 *
 * Adding a new product: pick a stable kebab-case ID, fill the catalog
 * entry, then reference the ID from KITS or rely on `surfaces` for
 * surface-driven rendering.
 *
 * Affiliate links: `'#'` is a deliberate placeholder. Real Amazon
 * Associates / Stay22 URLs replace these in a follow-up pass.
 */

import type { Product } from './types'

export const PRODUCTS: Record<string, Product> = {

  // ────────────────────────────────────────────────────────────────────────
  // FAMILIAS KIT 01 — El operativo
  // ────────────────────────────────────────────────────────────────────────

  'doona-car-seat-stroller': {
    id:      'doona-car-seat-stroller',
    icon:    'doona',
    brand:   'DOONA',
    name:    'Silla de auto + carriola',
    tag:     'LA INVERSIÓN QUE SE PAGA SOLA',
    opinion: 'Tres segundos de silla de auto a carriola. La única manera de que llegar al taxi con un bebé no sea un proyecto de 8 minutos.',
    price:   '$10,000–14,000 MXN',
    where:   'Amazon MX · Liverpool',
    link:    '#',
  },
  'babyzen-yoyo2': {
    id:      'babyzen-yoyo2',
    icon:    'stroller',
    brand:   'BABYZEN',
    name:    'YOYO2 — carriola de cabina',
    tag:     'ENTRA EN CABINA. PUNTO.',
    opinion: 'Cabe en el compartimento superior del avión. No documentas, no esperas, no rezas.',
    price:   '$12,000–15,000 MXN',
    where:   'Amazon MX',
    link:    '#',
  },
  'ergobaby-omni-breeze': {
    id:      'ergobaby-omni-breeze',
    icon:    'carrier',
    brand:   'ERGOBABY',
    name:    'Omni Breeze — portabebé',
    tag:     'MANOS LIBRES EN AEROPUERTOS',
    opinion: 'Para cuando la carriola no entra o no cabe. Manos libres sin que tu espalda te lo cobre después.',
    price:   '$2,800–3,500 MXN',
    where:   'Amazon MX',
    link:    '#',
  },
  'samsonite-cabin-suitcase': {
    id:      'samsonite-cabin-suitcase',
    icon:    'suitcase',
    brand:   'SAMSONITE',
    name:    'Maleta de cabina',
    tag:     'TODO LO ESENCIAL, CONTIGO',
    opinion: 'La maleta que documentas no está cuando la necesitas. Esta va siempre en cabina, siempre a la mano.',
    price:   'Ver precio',
    where:   'Amazon MX',
    link:    'https://amzn.to/4bxXhrh',
  },
  'apple-airtag-4pack': {
    id:      'apple-airtag-4pack',
    icon:    'airtag',
    brand:   'APPLE',
    name:    'AirTag 4-pack',
    tag:     'RASTREADOR DE PAZ MENTAL',
    opinion: 'Una por maleta, una por carriola. Cuando el vuelo conecte y el equipaje no, sabrás exactamente dónde están.',
    price:   '$1,400–1,600 MXN',
    where:   'Amazon MX',
    link:    '#',
  },

  // ────────────────────────────────────────────────────────────────────────
  // FAMILIAS KIT 02 — La mochila
  //   2a · EL CONTENEDOR
  // ────────────────────────────────────────────────────────────────────────

  'skip-hop-mini-backpack': {
    id:      'skip-hop-mini-backpack',
    icon:    'backpack',
    brand:   'SKIP HOP',
    name:    'Mini mochila infantil',
    tag:     'EL NIÑO CARGA SU PROPIA MOCHILA',
    opinion: 'Ligera, fácil de abrir sola, con divisiones. El niño se siente independiente y tú no cargas todo.',
    price:   'Ver precio',
    where:   'Amazon MX',
    link:    '#',
  },
  'packing-pouches-3cat': {
    id:      'packing-pouches-3cat',
    icon:    'pouches',
    brand:   'ORGANIZADOR',
    name:    'Packing pouches — 3 categorías',
    tag:     'EL SISTEMA QUE EVITA EL CAOS',
    opinion: 'Actividades · snacks · higiene en tres bolsitas. Cada cosa en su lugar antes de subir al avión.',
    price:   'Ver precio',
    where:   'Amazon MX',
    link:    'https://amzn.to/3PP26VW',
  },

  // 2b · EL PROGRAMA · A — INICIO DEL VUELO
  'melissa-doug-travel-journal': {
    id:      'melissa-doug-travel-journal',
    icon:    'journal',
    brand:   'MELISSA & DOUG',
    name:    'Travel journal + stickers',
    tag:     'PRIMER BLOQUE — 0 A 30 MIN',
    opinion: 'Primera media hora: alta concentración, cero ruido, cero piezas sueltas.',
    price:   'Ver precio',
    where:   'Amazon MX',
    link:    'https://amzn.to/4lE5vCU',
  },
  'fantasy-flight-mysterium-kids': {
    id:      'fantasy-flight-mysterium-kids',
    icon:    'ghost',
    brand:   'FANTASY FLIGHT',
    name:    'Mysterium kids — juego fantasma',
    tag:     'EL QUE DURA MÁS',
    opinion: 'Juego de mesa compacto para 2+ jugadores. Funciona en la mesita y dura más que cualquier libro de actividades.',
    price:   'Ver precio',
    where:   'Amazon MX',
    link:    'https://amzn.to/3NEblrj',
  },
  'picasso-tiles-magnetic-40': {
    id:      'picasso-tiles-magnetic-40',
    icon:    'magnetic',
    brand:   'PICASSO TILES',
    name:    'Magnetic tiles — 40 piezas',
    tag:     '45 MIN. SIN PANTALLA',
    opinion: 'Sin piezas sueltas, caja metálica. 45 minutos de concentración sin pantalla, garantizado.',
    price:   'Ver precio',
    where:   'MercadoLibre',
    link:    'https://www.mercadolibre.com.mx/picasso-tiles-pn01-nano-tiles-40-piezas-caja-metalica/up/MLMU3621311517',
  },
  'crayola-notebook-crayons': {
    id:      'crayola-notebook-crayons',
    icon:    'crayons',
    brand:   'CRAYOLA',
    name:    'Cuaderno + crayones lavables',
    tag:     'EL CLÁSICO QUE NO FALLA',
    opinion: 'El clásico que siempre funciona. Los lavables son obligatorios — el asiento de atrás te lo agradece.',
    price:   'Ver precio',
    where:   'Amazon MX',
    link:    '#',
  },

  // 2b · EL PROGRAMA · B — MITAD DEL VUELO
  'creativity-hub-question-cards': {
    id:      'creativity-hub-question-cards',
    icon:    'cards',
    brand:   'CREATIVITY HUB',
    name:    'Tarjetas — preguntas y memoria',
    tag:     'ACTIVA SIN ESPACIO',
    opinion: 'Para cuando las actividades tranquilas terminaron. Activa sin ocupar espacio.',
    price:   'Ver precio',
    where:   'Amazon MX',
    link:    'https://amzn.to/41irNkd',
  },
  'smily-play-magnetic-pad': {
    id:      'smily-play-magnetic-pad',
    icon:    'magnetic',
    brand:   'SMILY PLAY',
    name:    'Pizarrón magnético portátil',
    tag:     'DRAW. ERASE. REPEAT.',
    opinion: 'Dibujo libre, se borra, no hace ruido, no tiene piezas. Muy subestimado.',
    price:   'Ver precio',
    where:   'Amazon MX',
    link:    'https://amzn.to/4uIzdLg',
  },

  // 2b · EL PROGRAMA · C — CUANDO TODO FALLA
  'buddyphones-play-plus': {
    id:      'buddyphones-play-plus',
    icon:    'headphones',
    brand:   'BUDDYPHONES',
    name:    'Play+ — audífonos con limitador',
    tag:     'EL PLAN C QUE SIEMPRE LLEGA',
    opinion: 'Límite de volumen real. El plan C que siempre llega en algún punto del vuelo.',
    price:   '$600–900 MXN',
    where:   'Amazon MX',
    link:    '#',
  },
  'amazon-fire-hd-kids': {
    id:      'amazon-fire-hd-kids',
    icon:    'tablet',
    brand:   'AMAZON FIRE',
    name:    'Fire HD Kids — tablet',
    tag:     'SOLO OFFLINE. SOLO AL FINAL.',
    opinion: 'Para el tramo final cuando todo lo demás falló. Solo offline, solo al final.',
    price:   'Ver precio',
    where:   'Amazon MX',
    link:    'https://amzn.to/4rNZcOC',
  },

  // 2c · LA DESPENSA
  'sistema-snack-spinner': {
    id:      'sistema-snack-spinner',
    icon:    'snackspinner',
    brand:   'SISTEMA',
    name:    'Snack spinner — bento box',
    tag:     'EL SISTEMA DE SNACKS',
    opinion: 'Compartimentos pequeños, fácil de abrir sola, no se derrama. El niño saca su snack sin ayuda.',
    price:   'Ver precio',
    where:   'Amazon MX',
    link:    '#',
  },
  'dried-fruit-mix': {
    id:      'dried-fruit-mix',
    icon:    'driedfruit',
    brand:   'VARIADOS',
    name:    'Fruta deshidratada — 3 tipos',
    tag:     'SIN PICO DE AZÚCAR',
    opinion: 'Sin azúcar añadida, sin derrame, sin olor. Rotar los tres tipos evita que se aburra.',
    price:   'Ver precio',
    where:   'Amazon MX',
    link:    'https://amzn.to/3NxexVO',
  },
  'gerber-crackers': {
    id:      'gerber-crackers',
    icon:    'crackers',
    brand:   'GERBER',
    name:    'Galletas + crackers',
    tag:     'TEXTURA QUE ENTRETIENE',
    opinion: 'Textura que entretiene la mano. Sin sal, sin relleno — aptos para los dos.',
    price:   'Ver precio',
    where:   'Amazon MX',
    link:    '#',
  },
  'contigo-spill-bottle': {
    id:      'contigo-spill-bottle',
    icon:    'bottle',
    brand:   'CONTIGO',
    name:    'Botella anti-derrame reusable',
    tag:     'EL VASO DEL AVIÓN SE TIRA',
    opinion: 'El vaso del avión siempre se tira. La botella tuya, nunca.',
    price:   'Ver precio',
    where:   'Amazon MX',
    link:    '#',
  },
  'pampers-wipes-ziplock': {
    id:      'pampers-wipes-ziplock',
    icon:    'wipes',
    brand:   'PAMPERS',
    name:    'Toallitas + bolsas zip extras',
    tag:     'EL COMODÍN DEL VUELO',
    opinion: 'Las toallitas son obvias. Las bolsas zip son el comodín que nadie menciona — para todo lo demás.',
    price:   'Ver precio',
    where:   'Amazon MX',
    link:    'https://amzn.to/3PP26VW',
  },

  // 2d · EL RITUAL
  'favorite-object': {
    id:      'favorite-object',
    icon:    'toy',
    brand:   'EL FAVORITO',
    name:    'Objeto favorito del niño',
    tag:     'IRREMPLAZABLE. SIN EXCEPCIONES.',
    opinion: 'No sustituible, no opcional. Va en la mochila de mano, nunca en la documentada.',
    price:   '—',
    where:   'Ya lo tienes',
    link:    '#',
  },
  'trtl-kids-neckpillow': {
    id:      'trtl-kids-neckpillow',
    icon:    'neckpillow',
    brand:   'TRTL / BCOZZY',
    name:    'Neck pillow — kids',
    tag:     'DUERME BIEN. LLEGA BIEN.',
    opinion: 'Para vuelos de más de 2 horas. El que se queda dormido mal despertará mal el resto del día.',
    price:   'Ver precio',
    where:   'Amazon MX',
    link:    '#',
  },
  'light-blanket': {
    id:      'light-blanket',
    icon:    'blanket',
    brand:   'LIGERA',
    name:    'Suéter ligero o mantita',
    tag:     'EL AVIÓN SIEMPRE ESTÁ FRÍO.',
    opinion: 'El avión siempre está frío cuando el niño se queda dormido. Siempre.',
    price:   '—',
    where:   'Ya lo tienes',
    link:    '#',
  },

  // ────────────────────────────────────────────────────────────────────────
  // FAMILIAS KIT 03 — Quedarse
  // ────────────────────────────────────────────────────────────────────────

  'monobeach-popup-tent': {
    id:      'monobeach-popup-tent',
    icon:    'tent',
    brand:   'MONOBEACH',
    name:    'Carpa pop-up UPF 50+',
    tag:     'LA QUE ALARGA EL DÍA',
    opinion: 'La diferencia entre 40 minutos en la playa y 3 horas. Abre sola, es donde el bebé duerme la siesta mientras Isa sigue en la arena.',
    price:   '$900–1,300 MXN',
    where:   'Amazon MX',
    link:    '#',
  },
  'babyganics-mineral-spf50': {
    id:      'babyganics-mineral-spf50',
    icon:    'sunscreen',
    brand:   'BABYGANICS',
    name:    'Mineral SPF 50 — bebé',
    tag:     'MINERAL. SOLO MINERAL.',
    opinion: 'Mineral puro, no arde en los ojos, no huele raro. La diferencia importa más en bebés de menos de 12 meses.',
    price:   '$400–600 MXN',
    where:   'Amazon MX',
    link:    '#',
  },
  'swimways-spring-float': {
    id:      'swimways-spring-float',
    icon:    'float',
    brand:   'SWIMWAYS',
    name:    'Baby Spring Float + techito',
    tag:     'SOMBRA EN EL AGUA',
    opinion: 'Techito de sol incorporado, asiento ergonómico. El bebé en el agua y tú con las manos libres.',
    price:   '$450–650 MXN',
    where:   'Amazon MX',
    link:    '#',
  },
  'cgear-sandless-mat': {
    id:      'cgear-sandless-mat',
    icon:    'mat',
    brand:   'CGEAR',
    name:    'Sandless Beach Mat',
    tag:     'SIN ARENA ARRIBA',
    opinion: 'La arena no se queda arriba — se va para abajo. Una vez que lo usas, la toalla normal se vuelve obsoleta.',
    price:   '$700–1,200 MXN',
    where:   'Amazon MX',
    link:    '#',
  },
  'huggies-little-swimmers': {
    id:      'huggies-little-swimmers',
    icon:    'diaper',
    brand:   'HUGGIES',
    name:    'Little Swimmers',
    tag:     'LOS QUE NO PUEDEN FALTAR',
    opinion: 'La tiendita del resort los cobra el triple. Lleva los tuyos — una caja alcanza para el viaje.',
    price:   '$200–280 MXN',
    where:   'Amazon MX · Soriana',
    link:    '#',
  },

  // ────────────────────────────────────────────────────────────────────────
  // HOTELS-STRIP — adult/general travel kit (migrated from old lib/smart-finds.ts)
  // These render on the Hotels-page strip via `surfaces: ['hotels-strip']`.
  // ────────────────────────────────────────────────────────────────────────

  'trtl-travel-pillow': {
    id:       'trtl-travel-pillow',
    brand:    'TRTL',
    name:     'Cuello de viaje Trtl',
    tag:      'Difícil de explicar, fácil de usar',
    opinion:  'El diseño parece raro. El resultado no lo es. El mejor sueño que hemos tenido en un avión fue con este. Y lo decimos habiendo probado tres versiones de los que parecen almohadas de dona.',
    aside:    'La gente en el avión te va a mirar raro. Tú vas a llegar descansado.',
    price:    '$39 USD', where: 'Amazon', link: '#',
    emoji:    '😴',
    category: 'avion',
    surfaces: ['hotels-strip'],
  },
  'mzoo-silk-mask': {
    id:       'mzoo-silk-mask',
    brand:    'MZOO',
    name:     'Antifaz de seda MZOO',
    tag:      'El más barato del kit',
    opinion:  'La pantalla del asiento de adelante es el enemigo. Este lo resuelve en $12. Es la proporción precio-impacto más eficiente de todo este listado.',
    price:    '$12 USD', where: 'Amazon', link: '#',
    emoji:    '🌙',
    category: 'avion',
    surfaces: ['hotels-strip'],
  },
  'anker-portable-charger-10k': {
    id:       'anker-portable-charger-10k',
    brand:    'ANKER',
    name:     'Cargador portátil Anker 10K',
    tag:      'El que no se siente pesado',
    opinion:  '10,000mAh, carga rápida, delgado. No ocupa todo el espacio de la bolsa. Ya no llegamos a ningún destino con el teléfono al 8% después de estar en el aeropuerto 3 horas.',
    aside:    'Nota: llévalo en el equipaje de mano, no en la maleta documentada.',
    price:    '$28 USD', where: 'Amazon', link: '#',
    emoji:    '🔋',
    category: 'avion',
    surfaces: ['hotels-strip'],
  },
  'travelambo-rfid-wallet': {
    id:       'travelambo-rfid-wallet',
    brand:    'TRAVELAMBO',
    name:     'Cartera de viaje RFID',
    tag:      'Reemplaza la billetera normal',
    opinion:  'Pasaporte, boarding pass, dos tarjetas, efectivo. Todo en un lugar. Bloqueo RFID. Cabe en bolsillo trasero. El único momento en que vas a sacar la cartera normal es cuando regreses a casa.',
    price:    '$14 USD', where: 'Amazon', link: '#',
    emoji:    '💳',
    category: 'organizado',
    surfaces: ['hotels-strip'],
  },
  'bagsmart-cable-organizer': {
    id:       'bagsmart-cable-organizer',
    brand:    'BAGSMART',
    name:     'Organizador de cables BAGSMART',
    tag:      'Lo usamos en cada viaje',
    opinion:  'Antes de tener este, llegábamos al hotel a desempacar un nudo de cables. Ahora lo abrimos y está todo. Sin buscar. Sin enredar. Parece un detalle pequeño hasta que calculas cuánto tiempo pierdes buscando cables en cada viaje.',
    aside:    'Tiene espacio para cable USB-C, Lightning, adaptador, power bank pequeño y audífonos.',
    price:    '$18 USD', where: 'Amazon', link: '#',
    emoji:    '🔌',
    category: 'organizado',
    surfaces: ['hotels-strip'],
  },
  'airalo-esim': {
    id:       'airalo-esim',
    brand:    'AIRALO',
    name:     'eSIM Airalo',
    tag:      'La que cambió los viajes internacionales',
    opinion:  'Sin ir a buscar chip en el aeropuerto. Sin roaming. Descargas el plan antes de salir y en el avión ya tienes datos para cuando aterrizas. Lo usamos en cada viaje internacional desde que lo descubrimos. No hemos vuelto a comprar un chip físico.',
    aside:    'Funciona en más de 200 países. Hay planes de 1GB hasta 20GB según el destino.',
    price:    'Desde $5 USD', where: 'Airalo', link: '#',
    emoji:    '📶',
    category: 'conectado',
    surfaces: ['hotels-strip'],
  },
  'epicka-universal-adapter': {
    id:       'epicka-universal-adapter',
    brand:    'EPICKA',
    name:     'Adaptador universal EPICKA',
    tag:      'El que se queda en la maleta permanente',
    opinion:  'Un solo adaptador para todos los países. Carga 4 dispositivos al mismo tiempo. Lo que necesitas cuando hay un enchufe en el cuarto y somos 2 personas con 6 gadgets.',
    price:    '$20 USD', where: 'Amazon', link: '#',
    emoji:    '🔌',
    category: 'conectado',
    surfaces: ['hotels-strip'],
  },
  'lilgadgets-kids-headphones': {
    id:       'lilgadgets-kids-headphones',
    brand:    'LILGADGETS',
    name:     'Audífonos LilGadgets para niños',
    tag:      'Imprescindible en vuelos largos',
    opinion:  'Se conectan al teléfono y al iPad al mismo tiempo. Tienen límite de volumen incorporado. Los niños se quedan en silencio, sus tímpanos están protegidos y tú puedes mirar por la ventana sin oír Bluey por décima vez en el vuelo.',
    aside:    'Los que tienen el límite de volumen de verdad, no los que dicen que lo tienen.',
    price:    '$35 USD', where: 'Amazon', link: '#',
    emoji:    '🎧',
    category: 'familia',
    surfaces: ['hotels-strip'],
  },
  'tray-buddi-airplane-tray': {
    id:       'tray-buddi-airplane-tray',
    brand:    'TRAY BUDDI',
    name:     'Bandeja de avión para toddlers',
    tag:      'La que hace que el vuelo sea tolerable',
    opinion:  'Cubre la bandeja del asiento y tiene bolsillos para snacks, tablet y todo lo que necesitas tener a mano. El toddler puede comer, dibujar y ver la tablet sin tirar todo al piso cada 3 minutos. Inventado por alguien que definitivamente viajó con niños antes de diseñarlo.',
    price:    '$28 USD', where: 'Amazon', link: '#',
    emoji:    '🧒',
    category: 'familia',
    surfaces: ['hotels-strip'],
  },
}

// ── Lookup helpers ───────────────────────────────────────────────────────────

/**
 * Returns the product or throws when the ID isn't in the catalog.
 * Use this when the caller knows the ID must exist (e.g. a kit
 * reference) — failing loud beats silently rendering a blank card.
 */
export function getProduct(id: string): Product {
  const p = PRODUCTS[id]
  if (!p) throw new Error(`[smart-finds] Unknown product ID: ${id}`)
  return p
}

/**
 * Returns every product carrying the given surface tag, in insertion
 * order. Used by the Hotels-page strip to pull only its cohort
 * without traversing kit structure.
 */
export function getProductsBySurface(tag: 'hotels-strip'): Product[] {
  return Object.values(PRODUCTS).filter(p => p.surfaces?.includes(tag))
}
