/**
 * lib/smart-finds/products.ts
 *
 * DEPRECATED — kept as the seed source for Supabase until the cutover is
 * complete. New consumers should fetch via the async resolver:
 *   import { getProducts } from '@/lib/smart-finds'   // DB-backed
 * The static `PRODUCTS` export still works (pages haven't migrated yet)
 * but will be removed once every consumer has swapped over. Edits to
 * product metadata should happen in Supabase Studio, not here.
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
    image:   '/images/smart-finds/doona-car-seat-stroller.jpg',
    brand:   'DOONA',
    name:    'Silla de auto + carriola',
    tag:     'LA INVERSIÓN QUE SE PAGA SOLA',
    opinion: 'Tres segundos de silla de auto a carriola. La única manera de que llegar al taxi con un bebé no sea un proyecto de 8 minutos.',
    price:   '$870–1,160 USD',
    where:   'Amazon MX',
    link:    'https://amzn.to/4ua7nXB',
  },
  'gb-pockit-all-city': {
    id:      'gb-pockit-all-city',
    icon:    'stroller',
    image:   '/images/smart-finds/gb-pockit-all-city.jpg',
    brand:   'GB',
    name:    'Pockit+ All City — carriola ultra compacta',
    tag:     'ENTRA EN CABINA. PUNTO.',
    opinion: 'Cabe en el compartimento superior del avión. No documentas, no esperas, no rezas.',
    price:   '$230–290 USD',
    where:   'Amazon MX',
    link:    'https://amzn.to/4nnNp92',
  },
  'ergobaby-omni-breeze': {
    id:      'ergobaby-omni-breeze',
    icon:    'carrier',
    image:   '/images/smart-finds/ergobaby-omni-breeze.jpg',
    brand:   'ERGOBABY',
    name:    'Omni Breeze — portabebé',
    tag:     'MANOS LIBRES EN AEROPUERTOS',
    opinion: 'Para cuando la carriola no entra o no cabe. Manos libres sin que tu espalda te lo cobre después.',
    price:   '$115–175 USD',
    where:   'Amazon MX',
    link:    'https://amzn.to/43b6wd6',
  },
  'mia-mily-cabin-suitcase': {
    id:      'mia-mily-cabin-suitcase',
    icon:    'suitcase',
    image:   '/images/smart-finds/mia-mily-cabin-suitcase.jpg',
    brand:   'MIA MILY',
    name:    'Maleta de cabina',
    tag:     'TODO LO ESENCIAL, CONTIGO',
    opinion: 'La maleta que documentas no está cuando la necesitas. Esta va siempre en cabina, siempre a la mano.',
    price:   '$290–350 USD',
    where:   'Amazon MX',
    link:    'https://amzn.to/4tIZ4Ba',
  },
  'apple-airtag-4pack': {
    id:      'apple-airtag-4pack',
    icon:    'airtag',
    image:   '/images/smart-finds/apple-airtag-4pack.jpg',
    brand:   'APPLE',
    name:    'AirTag 4-pack',
    tag:     'RASTREADOR DE PAZ MENTAL',
    opinion: 'Una por maleta, una por carriola. Cuando el vuelo conecte y el equipaje no, sabrás exactamente dónde están.',
    price:   '$87–116 USD',
    where:   'Amazon MX',
    link:    'https://amzn.to/4tx6uXM',
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

  // ────────────────────────────────────────────────────────────────────────
  // PAREJAS KIT 04 — Nunca más en el carrusel
  // ────────────────────────────────────────────────────────────────────────

  'calpak-carry-on-expandable': {
    id: 'calpak-carry-on-expandable', icon: 'suitcase',
    brand: 'CALPAK', name: 'Carry-on expandible',
    tag: 'LA QUE NO DOCUMENTAS',
    opinion: 'El balance correcto entre tamaño y estilo. Expandible cuando necesitas el espacio extra, cabe en cabina cuando no.',
    price: '$3,500–5,000 MXN', where: 'Amazon MX', link: '#',
  },
  'eagle-creek-pack-it-cubes': {
    id: 'eagle-creek-pack-it-cubes', icon: 'pouches',
    brand: 'EAGLE CREEK', name: 'Pack-It Cubes — set 3',
    tag: 'EL SISTEMA, NO EL PRODUCTO',
    opinion: 'Un cubo por categoría. Tres cubos y sabes exactamente qué va dónde. El carry-on only no existe sin esto.',
    price: '$700–1,200 MXN', where: 'Amazon MX', link: '#',
  },
  'matador-flatpak-toiletry': {
    id: 'matador-flatpak-toiletry', icon: 'wipes',
    brand: 'MATADOR', name: 'FlatPak toiletry bag',
    tag: 'FLAT. TSA. LISTO.',
    opinion: 'La bolsa de toiletries que no ocupa el espacio que no tiene. Flat, TSA-ready.',
    price: '$500–900 MXN', where: 'Amazon MX', link: '#',
  },
  'etekcity-luggage-scale': {
    id: 'etekcity-luggage-scale', icon: 'scale',
    brand: 'ETEKCITY', name: 'Báscula de equipaje digital',
    tag: 'PÉSALA ANTES DE SALIR',
    opinion: 'Pésala antes de salir. El aeropuerto no tiene compasión con los kilos de más.',
    price: '$200–350 MXN', where: 'Amazon MX', link: '#',
  },
  'bellroy-tech-kit': {
    id: 'bellroy-tech-kit', icon: 'pouches',
    brand: 'BELLROY', name: 'Tech Kit — cable organizer',
    tag: 'EL CAOS DE CABLES, RESUELTO',
    opinion: 'Todo tu cable chaos en un flat pouch. Sin revolver el bolso cada vez que necesitas algo.',
    price: '$900–1,400 MXN', where: 'Amazon MX', link: '#',
  },

  // ────────────────────────────────────────────────────────────────────────
  // PAREJAS KIT 05 — Para que el lunes no duela tanto
  // ────────────────────────────────────────────────────────────────────────

  'jbl-clip-5': {
    id: 'jbl-clip-5', icon: 'speaker',
    brand: 'JBL', name: 'Clip 5 — bocina portátil',
    tag: 'EL VIAJE SUENA MEJOR',
    opinion: 'La bocina que no pesa y cabe en cualquier bolso. Del balcón del hotel a la vista al mar, al restaurante de noche.',
    price: '$900–1,400 MXN', where: 'Amazon MX', link: '#',
  },
  'beis-the-weekender': {
    id: 'beis-the-weekender', icon: 'backpack',
    brand: 'BÉIS', name: 'The Weekender bag',
    tag: 'EL BAG DEL PUENTE',
    opinion: 'Para 72 horas, ni la maleta grande ni solo el backpack. Cabe en cabina, se lleva al restaurante sin pena.',
    price: '$2,500–3,500 MXN', where: 'BÉIS online', link: '#',
  },
  'slip-silk-eye-mask': {
    id: 'slip-silk-eye-mask', icon: 'neckpillow',
    brand: 'SLIP', name: 'Silk eye mask — 2-pack',
    tag: 'DORMIRSE DE VERDAD',
    opinion: 'Para la pareja que viaja para descansar de verdad. El cuarto del hotel nunca está completamente oscuro.',
    price: '$350–600 MXN', where: 'Amazon MX', link: '#',
  },
  'wacaco-nanopresso': {
    id: 'wacaco-nanopresso', icon: 'bottle',
    brand: 'WACACO', name: 'Nanopresso — espresso portátil',
    tag: 'PORQUE EL CAFÉ DEL HOTEL NO',
    opinion: 'El café del hotel es un insulto. Este cabe en el bolsillo, hace un espresso real, y pesa 336 gramos.',
    price: '$1,200–1,800 MXN', where: 'Amazon MX', link: '#',
  },
  'hydroflask-32oz': {
    id: 'hydroflask-32oz', icon: 'bottle',
    brand: 'HYDROFLASK', name: '32oz — termo de viaje',
    tag: 'SIN COMPRAR AGUA TODO EL DÍA',
    opinion: 'Para el par que siempre está buscando agua en el resort. Llena el tuyo al salir del cuarto.',
    price: '$700–1,200 MXN', where: 'Amazon MX', link: '#',
  },

  // ────────────────────────────────────────────────────────────────────────
  // PAREJAS KIT 06 — Sin cargador prestado
  // ────────────────────────────────────────────────────────────────────────

  'anker-733-power-bank-65w': {
    id: 'anker-733-power-bank-65w', icon: 'powerbank',
    brand: 'ANKER', name: '733 Power Bank GaNPrime 65W',
    tag: 'UN CABLE PARA TODO',
    opinion: 'Carga el laptop, el teléfono, y la tablet al mismo tiempo. Desde un solo cuerpo. El único hub de viaje que realmente funciona.',
    price: '$1,500–2,200 MXN', where: 'Amazon MX', link: '#',
  },
  'anker-727-gan-charger': {
    id: 'anker-727-gan-charger', icon: 'adapter',
    brand: 'ANKER', name: '727 GaN charger — 4 puertos',
    tag: 'EL BLOCK QUE REEMPLAZA A TODOS',
    opinion: 'El block de corriente que reemplaza a todos tus blocks. 4 puertos, 100W total, del tamaño de un borrador.',
    price: '$800–1,300 MXN', where: 'Amazon MX', link: '#',
  },
  'epicka-travel-adapter': {
    id: 'epicka-travel-adapter', icon: 'adapter',
    brand: 'EPICKA', name: 'Universal travel adapter',
    tag: '150 DESTINOS, UN ADAPTADOR',
    opinion: 'Para el viajero que va a más de un país. Compatible con más de 150 destinos, USB-C incluido.',
    price: '$350–600 MXN', where: 'Amazon MX', link: '#',
  },
  'airalo-esim-no-roaming': {
    id: 'airalo-esim-no-roaming', icon: 'esim',
    brand: 'AIRALO', name: 'eSIM — sin roaming',
    tag: 'SIN SORPRESAS EN LA FACTURA',
    opinion: 'Sin SIM física. Sin roaming. Compras el plan antes de subir al avión y llegas con señal.',
    price: 'desde $150 MXN', where: 'airalo.com', link: '#',
  },
  'nomad-cable-organizer': {
    id: 'nomad-cable-organizer', icon: 'pouches',
    brand: 'NOMAD', name: 'Cable organizer pouch',
    tag: 'SIN REVOLVER EL BOLSO',
    opinion: 'Un pouch flat con separadores. Nada se enreda, todo se encuentra.',
    price: '$600–900 MXN', where: 'Amazon MX', link: '#',
  },

  // ────────────────────────────────────────────────────────────────────────
  // FAN KIT 07 — En las gradas
  // ────────────────────────────────────────────────────────────────────────

  'patagonia-black-hole-crossbody': {
    id: 'patagonia-black-hole-crossbody', icon: 'crossbody',
    brand: 'PATAGONIA', name: 'Black Hole Crossbody 5L',
    tag: 'EL QUE ENTRA AL ESTADIO',
    opinion: 'La mayoría de los estadios FIFA tienen restricciones de bolso. Este entra. Cabe el teléfono, la billetera, los documentos, y la cámara.',
    price: '$1,200–1,800 MXN', where: 'Amazon MX · patagonia.com', link: '#',
  },
  'anker-powercore-10000-slim': {
    id: 'anker-powercore-10000-slim', icon: 'powerbank',
    brand: 'ANKER', name: 'PowerCore 10000 slim',
    tag: 'PARA LAS 6 HORAS DE PARTIDO',
    opinion: 'Día de partido = 6-8 horas fuera de casa. Videos, fotos, stories, GPS, Uber. El teléfono no llega. Este sí.',
    price: '$550–800 MXN', where: 'Amazon MX', link: '#',
  },
  'loop-experience-earplugs': {
    id: 'loop-experience-earplugs', icon: 'headphones',
    brand: 'LOOP', name: 'Experience earplugs',
    tag: 'EL AMBIENTE, SIN EL DAÑO',
    opinion: 'Un estadio lleno puede llegar a 110dB. Estos filtran el ruido dañino sin quitar la emoción.',
    price: '$800–1,200 MXN', where: 'Amazon MX', link: '#',
  },
  'sol-rain-poncho': {
    id: 'sol-rain-poncho', icon: 'poncho',
    brand: 'SOL', name: 'Emergency rain poncho compacto',
    tag: 'PARA LA LLUVIA QUE NO VES VENIR',
    opinion: 'En el estadio no puedes salir cuando llueve. Este pesa 60 gramos y cabe en el bolsillo.',
    price: '$150–300 MXN', where: 'Amazon MX', link: '#',
  },
  'bellroy-travel-wallet': {
    id: 'bellroy-travel-wallet', icon: 'wallet',
    brand: 'BELLROY', name: 'Travel Wallet — slim',
    tag: 'TODO EN UN SOLO LUGAR',
    opinion: 'La entrada, el pasaporte, el efectivo, la tarjeta — en uno. Para entrar al estadio con todo en orden.',
    price: '$900–1,400 MXN', where: 'Amazon MX', link: '#',
  },

  // ────────────────────────────────────────────────────────────────────────
  // FAN KIT 08 — De estadio en estadio
  // ────────────────────────────────────────────────────────────────────────

  'osprey-farpoint-40': {
    id: 'osprey-farpoint-40', icon: 'backpack',
    brand: 'OSPREY', name: 'Farpoint 40 — travel backpack',
    tag: 'CERO MALETAS DOCUMENTADAS',
    opinion: '40 litros. Cabe en cabina. El backpack que cambia la manera de viajar multi-ciudad.',
    price: '$3,500–5,500 MXN', where: 'Amazon MX · decathlon.mx', link: '#',
  },
  'sea-to-summit-scrubba': {
    id: 'sea-to-summit-scrubba', icon: 'pouches',
    brand: 'SEA TO SUMMIT', name: 'Scrubba Wash Bag',
    tag: 'PARA LLEVAR MENOS Y LAVAR MÁS',
    opinion: 'Un bolso que es también una lavadora manual. Lavas un jersey en 3 minutos en cualquier lavabo.',
    price: '$700–1,000 MXN', where: 'Amazon MX', link: '#',
  },
  'eagle-creek-compression-cubes': {
    id: 'eagle-creek-compression-cubes', icon: 'pouches',
    brand: 'EAGLE CREEK', name: 'Compression packing cubes',
    tag: 'EL TRUCO DEL ESPACIO',
    opinion: 'Para comprimir los jerseys y la ropa de partido. Lo que normalmente llenaría dos bolsos cabe en uno.',
    price: '$600–1,000 MXN', where: 'Amazon MX', link: '#',
  },
  'etekcity-luggage-scale-fan': {
    id: 'etekcity-luggage-scale-fan', icon: 'scale',
    brand: 'ETEKCITY', name: 'Báscula de equipaje digital',
    tag: 'PÉSALA EN CADA CIUDAD',
    opinion: 'Las aerolíneas en Estados Unidos cobran $35 USD por maleta de más. Sin sorpresas.',
    price: '$200–350 MXN', where: 'Amazon MX', link: '#',
  },
  'lagomplan-planner-wc': {
    id: 'lagomplan-planner-wc', icon: 'journal',
    brand: 'LAGOMPLAN', name: 'Planificador IA — ruta WC',
    tag: 'PLANIFICA LA RUTA PRIMERO',
    opinion: 'Antes de reservar vuelos entre ciudades, planifica la ruta completa con el planificador.',
    price: 'Gratis', where: 'lagomplan.com', link: '/planificador',
  },

  // ────────────────────────────────────────────────────────────────────────
  // FAN KIT 09 — El viaje grande
  // ────────────────────────────────────────────────────────────────────────

  'bellroy-passport-sleeve': {
    id: 'bellroy-passport-sleeve', icon: 'wallet',
    brand: 'BELLROY', name: 'Passport Sleeve — document wallet',
    tag: 'TODO EN ORDEN, DESDE EL INICIO',
    opinion: 'El pasaporte, la visa, el seguro impreso, los confirmations del hotel. Todo en una cosa.',
    price: '$700–1,000 MXN', where: 'Amazon MX', link: '#',
  },
  'world-nomads-insurance': {
    id: 'world-nomads-insurance', icon: 'insurance',
    brand: 'WORLD NOMADS', name: 'Travel insurance',
    tag: 'EL QUE NADIE CONTRATA (Y TODOS NECESITAN)',
    opinion: 'El que más se arrepiente de no haberlo contratado es el que tuvo un problema. Para el viaje grande, no es opcional.',
    price: 'desde $500 MXN', where: 'worldnomads.com', link: '#',
  },
  'airalo-esim-usa-canada': {
    id: 'airalo-esim-usa-canada', icon: 'esim',
    brand: 'AIRALO', name: 'eSIM USA + Canadá',
    tag: 'SEÑAL DESDE QUE ATERRIZAS',
    opinion: 'Sin SIM física, sin ir a la tienda de AT&T en el aeropuerto, sin depender del WiFi del hotel.',
    price: 'desde $200 MXN', where: 'airalo.com', link: '#',
  },
  'wise-card': {
    id: 'wise-card', icon: 'cards',
    brand: 'WISE', name: 'Wise card — tipo de cambio real',
    tag: 'EL TIPO DE CAMBIO REAL',
    opinion: 'La tarjeta que convierte pesos a dólares al tipo de cambio real, sin comisiones absurdas.',
    price: 'Gratis (app)', where: 'wise.com', link: '#',
  },
  'pacsafe-coversafe-belt': {
    id: 'pacsafe-coversafe-belt', icon: 'suitcase',
    brand: 'PACSAFE', name: 'Coversafe anti-theft belt',
    tag: 'LO QUE NADIE VE QUE LLEVAS',
    opinion: 'Para el primer viaje a una ciudad que no conoces. El efectivo y los documentos extra van en el cinturón.',
    price: '$500–800 MXN', where: 'Amazon MX', link: '#',
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
