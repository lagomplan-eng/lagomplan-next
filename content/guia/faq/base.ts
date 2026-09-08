// content/guia/faq/base.ts
//
// The canonical FAQ schema for "During your stay": the full item set, its
// order, group membership, anchors, and bilingual labels. This is the only
// place structural edits happen — add/reorder/relabel an item here and it
// reaches every partner's rendered module through getFaqBase().
//
// This file defines STRUCTURE (item titles, which are themselves the FAQ
// questions guests ask). `defaults` stays empty except for the rare
// answer that's true everywhere, not just in one zone or property —
// gyms/Fitpass is the first: Fitpass isn't Condesa-specific, so it belongs
// here rather than duplicated into every zone file. Per-property and
// per-zone answers live in partner and zone files, not here.

import type { FaqBase } from './types'

export const faqBase: FaqBase = {
  groups: [
    { id: 'stay', label: { es: 'Tu estancia', en: 'Your stay' } },
    { id: 'errands', label: { es: 'El día a día', en: 'Everyday errands' } },
    { id: 'eating', label: { es: 'Comer en casa', en: 'Eating in' } },
  ],

  items: [
    // Group 1 — stay (Tier A, property policy)
    { key: 'checkinCheckout', group: 'stay', anchor: 'estancia-checkin-checkout',
      label: { es: 'Entrada y salida', en: 'Check-in and check-out' } },
    { key: 'earlyLate', group: 'stay', anchor: 'estancia-entrada-salida-fuera-de-horario',
      label: { es: 'Llegada temprano y salida tarde', en: 'Early arrival and late departure' } },
    { key: 'keys', group: 'stay', anchor: 'estancia-llaves',
      label: { es: 'Dónde dejar las llaves', en: 'Where to leave the keys' } },
    { key: 'luggage', group: 'stay', anchor: 'estancia-equipaje',
      label: { es: 'Equipaje antes de entrar y después de salir', en: 'Luggage before check-in and after checkout' } },
    { key: 'cleaning', group: 'stay', anchor: 'estancia-limpieza',
      label: { es: 'Limpieza durante tu estancia', en: 'Cleaning during your stay' } },
    { key: 'towels', group: 'stay', anchor: 'estancia-toallas',
      label: { es: 'Toallas y cambios extra', en: 'Towels and extra changes' } },
    { key: 'lateReturn', group: 'stay', anchor: 'estancia-llegar-tarde',
      label: { es: 'Llegar tarde', en: 'Coming back late' } },

    // Group 2 — errands (Tier B, destination)
    { key: 'laundry', group: 'errands', anchor: 'estancia-lavanderia',
      label: { es: 'Lavandería y tintorería', en: 'Laundry and dry cleaning' } },
    { key: 'supermarkets', group: 'errands', anchor: 'estancia-supermercados',
      label: { es: 'Supermercados', en: 'Supermarkets' } },
    { key: 'currencyExchange', group: 'errands', anchor: 'estancia-cambio-divisas',
      label: { es: 'Cambio de divisas y apps de dinero', en: 'Currency exchange and money apps' } },
    { key: 'cashAtms', group: 'errands', anchor: 'estancia-cajeros',
      label: { es: 'Cajeros y efectivo', en: 'Cash and ATMs' } },
    { key: 'oddHours', group: 'errands', anchor: 'estancia-horarios-especiales',
      label: { es: 'Abierto a horas raras', en: 'Open at odd hours' } },
    { key: 'coworking', group: 'errands', anchor: 'estancia-coworking',
      label: { es: 'Trabajar desde aquí', en: 'Working from here' } },
    { key: 'gyms', group: 'errands', anchor: 'estancia-gimnasios',
      label: { es: 'Gyms and studios', en: 'Gyms and studios' } }, // deliberately not localized, per instruction
    { key: 'haircuts', group: 'errands', anchor: 'estancia-cortes-de-pelo',
      label: { es: 'Cortes de pelo', en: 'Haircuts' } },

    // Group 3 — eating in and hosting (Tier B, destination)
    { key: 'groupRestaurants', group: 'eating', anchor: 'estancia-restaurantes-grupos',
      label: { es: 'Restaurantes que reciben grupos', en: 'Restaurants that take groups' } },
    { key: 'chefsAtHome', group: 'eating', anchor: 'estancia-chefs-a-domicilio',
      label: { es: 'Chefs a domicilio', en: 'Chefs at home' } },
    { key: 'cateringDelivery', group: 'eating', anchor: 'estancia-catering-entrega',
      label: { es: 'Catering y entrega a domicilio', en: 'Catering and delivery' } },
    { key: 'wineLiquor', group: 'eating', anchor: 'estancia-vinos-licores',
      label: { es: 'Vino y licores', en: 'Wine and liquor' } },
    { key: 'privateEvents', group: 'eating', anchor: 'estancia-eventos-privados',
      label: { es: 'Eventos privados', en: 'Private events' } },
  ],

  defaults: {
    // Deliberately not localized, per instruction — same English text in
    // both languages.
    gyms: {
      body: {
        en: 'Fitpass is the easiest way in — one membership gives you rotating access to many gyms and studios in the area, either as a monthly plan or a 10-visit pack. Most studios also let you drop in and pay for a single class if you\'d rather not commit to a pass.',
        es: 'Fitpass is the easiest way in — one membership gives you rotating access to many gyms and studios in the area, either as a monthly plan or a 10-visit pack. Most studios also let you drop in and pay for a single class if you\'d rather not commit to a pass.',
      },
    },
  },
}
