/**
 * content/guia/zones/polanco.ts
 *
 * Zone-tier FAQ content for Polanco. Inherited by every partner property
 * whose `zone` is 'polanco'.
 *
 * ANCHOR
 * Walking distances are measured from the Horacio and Thiers block. Polanco
 * is more spread out than Condesa or Roma, so this zone runs to roughly 15
 * minutes rather than 10. Where something is genuinely far, the copy says so.
 *
 * SOURCING
 * Names, street addresses and opening hours are machine-sourced from Google
 * Places on 2026-09-07. Nothing is derived from reviews or subjective
 * impressions. Editorial enrichment is Pili's layer, not this file's.
 *
 * VERIFICATION DEBT
 * Google hours drift. Entries flagged CONFIRM need a walk-past before this
 * ships to a live partner.
 *
 * Keys deliberately absent (no confirmed answer, so they render nothing):
 *   privateEvents    — Livin policy question
 *   taquizasChefs    — pending the same rework as the Condesa entry
 */

import type { Zone } from './types'

export const polanco: Zone = {
  id: 'polanco',

  answers: {
    // ---------------------------------------------------------------
    // Everyday errands
    // ---------------------------------------------------------------

    laundry: {
      body: {
        es:
          'Mamute, en Ejército Nacional 125, está a tres minutos, abre los ' +
          'siete días de 7 a 9 y ofrece recolección y entrega. Para ' +
          'tintorería, Azteca está en Bahía de las Palmas 81, a cinco ' +
          'minutos, aunque cierra a las 3 el sábado y no abre domingos.',
        en:
          'Mamute, at Ejército Nacional 125, is three minutes away, open ' +
          'seven days from 7 to 9, and offers pickup and delivery. For dry ' +
          'cleaning, Azteca is at Bahía de las Palmas 81, five minutes away, ' +
          'though it closes at 3 on Saturday and not at all on Sunday.',
      },
      // Two dry cleaners on Schiller were excluded: both have repeated
      // reports of lost and damaged garments.
    },

    supermarkets: {
      body: {
        es:
          'La Comer, en Lago Xochimilco 343, está a tres minutos y abre de 7 ' +
          'a 10 todos los días; es la más completa de la zona y tiene ' +
          'farmacia adentro. Para despensa asiática, Toyo en Leibnitz 205 y ' +
          'Yuandong en Mariano Escobedo 424, ambas a menos de diez minutos.',
        en:
          'La Comer, at Lago Xochimilco 343, is three minutes away and opens ' +
          '7 to 10 every day; it is the most complete in the area and has a ' +
          'pharmacy inside. For Asian groceries, Toyo at Leibnitz 205 and ' +
          'Yuandong at Mariano Escobedo 424, both under ten minutes away.',
      },
    },

    currencyExchange: {
      body: {
        es:
          'Arcángeles, en Leibnitz 100, es la casa de cambio más cercana: ' +
          'detrás de Camino Real, junto a DHL. El tipo de cambio del pizarrón ' +
          'es el que te dan, y piden pasaporte. Abre de 9 a 5:30 entre semana, ' +
          'hasta las 2:30 el sábado. Revisa los billetes grandes antes de ' +
          'salir del mostrador, y evita el aeropuerto por completo. Muchos ' +
          'huéspedes prefieren Wise, Revolut o DolarApp.',
        en:
          "Arcángeles, at Leibnitz 100, is the closest reliable exchange — " +
          'behind Camino Real, next to DHL. The board rate is what you get, ' +
          "and they'll scan your passport. Open 9 to 5:30 weekdays, until " +
          '2:30 Saturday. Check large notes before leaving the counter, and ' +
          'skip the airport entirely. Many guests use Wise, Revolut or ' +
          'DolarApp instead of cash.',
      },
      // CONFIRM: hours. Several exchanges in Polanco post hours they do not keep.
      // NOTE: one counterfeit-notes complaint among 42 reviews. The
      // check-your-notes line is deliberate and is good practice anywhere.
    },

    cashAtms: {
      body: {
        es:
          'Banamex es la mejor opción práctica: comisión baja y cajeros por ' +
          'toda la zona. Evita los cajeros sueltos de tiendas de ' +
          'conveniencia: cobran más y dan peor tipo de cambio. Y en ' +
          'cualquier cajero, cuando te ofrezca cobrarte en tu moneda, di que ' +
          'no y elige "sin conversión". Esa pantalla cuesta más que la ' +
          'comisión.',
        en:
          'Banamex is the practical pick: low withdrawal fee and machines all ' +
          'over the area. Avoid the standalone machines in convenience ' +
          'stores, which charge more and use worse rates. And at any machine, ' +
          'when it offers to charge you in your own currency, decline and ' +
          'choose "sin conversión". That screen costs more than the fee does.',
      },
      // TODO: add one specific nearby Banamex once someone confirms it.
      // RE-CHECK QUARTERLY: bank fees move monthly. No peso amounts on purpose.
    },

    oddHours: {
      body: {
        es:
          'Farmacia San Pablo, en Mariano Escobedo 369, abre 24 horas y está ' +
          'a unos ocho minutos. La Comer cierra a las 10 todos los días. ' +
          'Después de esa hora quedan los OXXO, que están por todas partes.',
        en:
          'Farmacia San Pablo, at Mariano Escobedo 369, is open 24 hours and ' +
          'about eight minutes away. La Comer closes at 10 every day. After ' +
          'that, what stays open is OXXO, and there is one on almost every ' +
          'corner.',
      },
    },

    coworking: {
      body: {
        es:
          'Homework, en Mariano Escobedo 438, abre 24 horas y está a unos ' +
          'ocho minutos. La Chamba, en Masaryk 101, abre de 6 a 8 entre ' +
          'semana y sábados, con cabinas para llamadas. Si solo necesitas un ' +
          'par de horas, casi cualquier café de Polanco funciona.',
        en:
          'Homework, at Mariano Escobedo 438, is open 24 hours and about ' +
          'eight minutes away. La Chamba, at Masaryk 101, opens 6 to 8 on ' +
          'weekdays and Saturdays, with phone booths. If you only need a ' +
          'couple of hours, almost any café in Polanco will do.',
      },
    },

    gyms: {
      body: {
        es:
          'AlGym, en Lago Alberto 442, abre 24 horas y está a tres minutos, ' +
          'lo más cerca que vas a encontrar. Si prefieres clases, Fitness ' +
          'Collective en Sudermann 248 tiene yoga, pilates y funcional.',
        en:
          'AlGym, at Lago Alberto 442, is open 24 hours and three minutes ' +
          'away, the closest you will find. If you prefer classes, Fitness ' +
          'Collective at Sudermann 248 runs yoga, pilates and functional ' +
          'training.',
      },
      // CONFIRM: whether AlGym sells day passes to non-members. Not stated.
      // One large gym nearby was excluded: no day passes, and a repeated
      // pattern of billing complaints after members leave the country.
    },

    haircuts: {
      body: {
        es:
          "Bardo's, en Horacio 112, está sobre tu misma calle y abre los ate " +
          'siete días hasta las 9. Sovereign, en Masaryk 18, es más ' +
          'tranquilo y acepta walk-ins. Los dos dan cita el mismo día por ' +
          'WhatsApp, que es como se reserva casi todo aquí.',
        en:
          "Bardo's, at Horacio 112, is on your own street and open seven days " +
          'until 9. Sovereign, at Masaryk 18, is quieter and takes walk-ins. ' +
          'Both give same-day appointments over WhatsApp, which is how most ' +
          'things get booked here.',
      },
    },

    // ---------------------------------------------------------------
    // Eating in and hosting
    // ---------------------------------------------------------------

    groupRestaurants: {
      body: {
        es:
          'Catorze, en Masaryk 61, es cocina española y aguanta mesas de ocho ' +
          'sin problema; la paella grande se pide con tres días de ' +
          'anticipación. Taboo, en Masaryk 294, es más ruidoso y abre hasta ' +
          'las 2 todos los días. En los dos conviene reservar.',
        en:
          'Catorze, at Masaryk 61, is Spanish cooking and handles tables of ' +
          'eight without trouble; the large paella needs three days notice. ' +
          'Taboo, at Masaryk 294, is louder and open until 2 every day. Book ' +
          'at both.',
      },
      // CONFIRM: the three-day paella lead time and the party-size ceiling
      // at Catorze. Do not claim a specific cap without asking them.
    },

    cateringDelivery: {
      body: {
        es:
          'Rappi, Uber Eats y Didi Food cubren toda la zona y casi todo llega ' +
          'en menos de quince minutos. Descarga la que prefieras antes de ' +
          'necesitarla: las tres piden configurar el pago primero. Rappi ' +
          'además trae despensa y farmacia, que resuelve la mayoría de los ' +
          'pendientes sin salir.',
        en:
          'Rappi, Uber Eats and Didi Food all cover the area, and almost ' +
          'everything arrives in under fifteen minutes. Download whichever ' +
          'you prefer before you need it — they all ask you to set up payment ' +
          'first. Rappi also delivers groceries and pharmacy items, which ' +
          'handles most errands without leaving the apartment.',
      },
    },

    wineLiquor: {
      body: {
        es:
          'La Comer, a tres minutos, tiene una sección de vinos suficiente ' +
          'para resolver una cena. Si quieres algo más específico, La Europea ' +
          'en Emilio Castelar 44 tiene la mejor selección de la zona, aunque ' +
          'queda a unos veinte minutos caminando o un viaje corto en coche.',
        en:
          'La Comer, three minutes away, has a wine section good enough to ' +
          'sort out a dinner. For something more specific, La Europea at ' +
          'Emilio Castelar 44 has the best selection in the area, though it ' +
          'is about twenty minutes on foot or a short ride.',
      },
      // The nearest liquor store to Horacio and Thiers was excluded on
      // repeated service complaints, including a wrong-size bottle on
      // delivery. La Europea is further but reliable.
    },
  },
}
