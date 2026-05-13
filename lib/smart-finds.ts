/**
 * lib/smart-finds.ts
 *
 * Editorial product list surfaced on the Hotels index ("Smart finds")
 * and (later) on the dedicated /smart-finds page. Content lifted from
 * the prototype at prototypes/lagomplan-smart-finds-v2.jsx — written
 * by the editorial team, no synthesized copy.
 *
 * Each entry's `link` is intentionally `#` until real affiliate URLs
 * are added (Amazon Associates tags, Airalo, etc.). The "where" field
 * tells the user which marketplace to expect, regardless of link
 * state.
 *
 * EN translations are pending — for now the Hotels page renders the
 * Spanish copy on both locales (product names + brands are universal,
 * opinion text reads as Spanish prose on /en/hotels). Add `_en` fields
 * per record when translations land.
 */

export type SmartFindCategory = 'avion' | 'organizado' | 'conectado' | 'familia'

export interface SmartFind {
  id:        string
  category:  SmartFindCategory
  name:      string
  brand:     string
  /** One-sentence editorial pull-quote shown as a pill on the card. */
  tag:       string
  /** Long-form opinion paragraph — preserve verbatim. */
  opinion:   string
  /** Optional connective note shown under the opinion when present. */
  aside?:    string | null
  /** Display price string (e.g. "$39 USD", "Desde $5 USD"). */
  price:     string
  /** Where to buy — surfaced as the CTA hint. */
  where:     string
  /** Outbound affiliate URL. `#` until real link supplied. */
  link:      string
  /** Optional emoji icon shown on the card. */
  emoji?:    string
}

export const SMART_FINDS: SmartFind[] = [
  // ── 02 · El kit del avión ───────────────────────────────────────────────
  {
    id:       'p2', category: 'avion',
    name:     'Cuello de viaje Trtl',
    brand:    'TRTL',
    tag:      'Difícil de explicar, fácil de usar',
    opinion:  'El diseño parece raro. El resultado no lo es. El mejor sueño que hemos tenido en un avión fue con este. Y lo decimos habiendo probado tres versiones de los que parecen almohadas de dona.',
    aside:    'La gente en el avión te va a mirar raro. Tú vas a llegar descansado.',
    price:    '$39 USD', where: 'Amazon', link: '#',
    emoji:    '😴',
  },
  {
    id:       'p3', category: 'avion',
    name:     'Antifaz de seda MZOO',
    brand:    'MZOO',
    tag:      'El más barato del kit',
    opinion:  'La pantalla del asiento de adelante es el enemigo. Este lo resuelve en $12. Es la proporción precio-impacto más eficiente de todo este listado.',
    aside:    null,
    price:    '$12 USD', where: 'Amazon', link: '#',
    emoji:    '🌙',
  },
  {
    id:       'p1b', category: 'avion',
    name:     'Cargador portátil Anker 10K',
    brand:    'ANKER',
    tag:      'El que no se siente pesado',
    opinion:  '10,000mAh, carga rápida, delgado. No ocupa todo el espacio de la bolsa. Ya no llegamos a ningún destino con el teléfono al 8% después de estar en el aeropuerto 3 horas.',
    aside:    'Nota: llévalo en el equipaje de mano, no en la maleta documentada.',
    price:    '$28 USD', where: 'Amazon', link: '#',
    emoji:    '🔋',
  },

  // ── 03 · El sistema ─────────────────────────────────────────────────────
  {
    id:       'p5', category: 'organizado',
    name:     'Cartera de viaje RFID',
    brand:    'TRAVELAMBO',
    tag:      'Reemplaza la billetera normal',
    opinion:  'Pasaporte, boarding pass, dos tarjetas, efectivo. Todo en un lugar. Bloqueo RFID. Cabe en bolsillo trasero. El único momento en que vas a sacar la cartera normal es cuando regreses a casa.',
    aside:    null,
    price:    '$14 USD', where: 'Amazon', link: '#',
    emoji:    '💳',
  },
  {
    id:       'p1', category: 'organizado',
    name:     'Organizador de cables BAGSMART',
    brand:    'BAGSMART',
    tag:      'Lo usamos en cada viaje',
    opinion:  'Antes de tener este, llegábamos al hotel a desempacar un nudo de cables. Ahora lo abrimos y está todo. Sin buscar. Sin enredar. Parece un detalle pequeño hasta que calculas cuánto tiempo pierdes buscando cables en cada viaje.',
    aside:    'Tiene espacio para cable USB-C, Lightning, adaptador, power bank pequeño y audífonos.',
    price:    '$18 USD', where: 'Amazon', link: '#',
    emoji:    '🔌',
  },

  // ── 04 · Conectado ──────────────────────────────────────────────────────
  {
    id:       'p7', category: 'conectado',
    name:     'eSIM Airalo',
    brand:    'AIRALO',
    tag:      'La que cambió los viajes internacionales',
    opinion:  'Sin ir a buscar chip en el aeropuerto. Sin roaming. Descargas el plan antes de salir y en el avión ya tienes datos para cuando aterrizas. Lo usamos en cada viaje internacional desde que lo descubrimos. No hemos vuelto a comprar un chip físico.',
    aside:    'Funciona en más de 200 países. Hay planes de 1GB hasta 20GB según el destino.',
    price:    'Desde $5 USD', where: 'Airalo', link: '#',
    emoji:    '📶',
  },
  {
    id:       'p8', category: 'conectado',
    name:     'Adaptador universal EPICKA',
    brand:    'EPICKA',
    tag:      'El que se queda en la maleta permanente',
    opinion:  'Un solo adaptador para todos los países. Carga 4 dispositivos al mismo tiempo. Lo que necesitas cuando hay un enchufe en el cuarto y somos 2 personas con 6 gadgets.',
    aside:    null,
    price:    '$20 USD', where: 'Amazon', link: '#',
    emoji:    '🔌',
  },

  // ── 05 · Para viajar con niños ──────────────────────────────────────────
  {
    id:       'p9', category: 'familia',
    name:     'Audífonos LilGadgets para niños',
    brand:    'LILGADGETS',
    tag:      'Imprescindible en vuelos largos',
    opinion:  'Se conectan al teléfono y al iPad al mismo tiempo. Tienen límite de volumen incorporado. Los niños se quedan en silencio, sus tímpanos están protegidos y tú puedes mirar por la ventana sin oír Bluey por décima vez en el vuelo.',
    aside:    'Los que tienen el límite de volumen de verdad, no los que dicen que lo tienen.',
    price:    '$35 USD', where: 'Amazon', link: '#',
    emoji:    '🎧',
  },
  {
    id:       'p10', category: 'familia',
    name:     'Bandeja de avión para toddlers',
    brand:    'TRAY BUDDI',
    tag:      'La que hace que el vuelo sea tolerable',
    opinion:  'Cubre la bandeja del asiento y tiene bolsillos para snacks, tablet y todo lo que necesitas tener a mano. El toddler puede comer, dibujar y ver la tablet sin tirar todo al piso cada 3 minutos. Inventado por alguien que definitivamente viajó con niños antes de diseñarlo.',
    aside:    null,
    price:    '$28 USD', where: 'Amazon', link: '#',
    emoji:    '🧒',
  },
]
