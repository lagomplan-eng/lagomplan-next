/**
 * content/guia/zones/roma.ts
 *
 * Zone-tier FAQ content for Roma Norte. Inherited by every partner property
 * whose `zone` is 'roma'.
 *
 * ANCHOR
 * Every place below is a 4–10 minute walk from Plaza Río de Janeiro. Nothing
 * further out was included, even where a better-known option exists — La
 * Europea, for example, is in the Condesa file but is 1.2 km from the plaza
 * and does not belong here.
 *
 * SOURCING
 * Names, street addresses and opening hours are machine-sourced from Google
 * Places on 2026-09-07. Nothing is derived from reviews or subjective
 * impressions. Editorial enrichment is Pili's layer, not this file's.
 *
 * VERIFICATION DEBT
 * Google hours drift, and Roma has more of it than Condesa. Entries flagged
 * CONFIRM need a walk-past before this ships to a live partner.
 *
 * Keys deliberately absent (no confirmed answer, so they render nothing):
 *   privateEvents  — Livin policy question
 *   taquizasChefs  — pending the same rework as the Condesa entry; the two
 *                    citywide phone numbers contradict the host letter's
 *                    "we checked every recommendation ourselves"
 */

import type { Zone } from './types'

export const roma: Zone = {
  id: 'roma',

  answers: {
    // ---------------------------------------------------------------
    // Everyday errands
    // ---------------------------------------------------------------

    laundry: {
      body: {
        es:
          'Clean Club, en Guanajuato 53, entrega el mismo día si dejas la ' +
          'ropa temprano, pero cierra a las 6 y no abre domingos. LimLim, en ' +
          'Querétaro 189, abre los siete días de 8 a 8, es autoservicio y ' +
          'acepta tarjeta. Para tintorería, Alta está en Durango 70, a cinco ' +
          'minutos de la plaza.',
        en:
          'Clean Club, at Guanajuato 53, turns laundry around the same day if ' +
          'you drop it early, but closes at 6 and not on Sundays. LimLim, at ' +
          'Querétaro 189, is open seven days from 8 to 8, self-service, and ' +
          'takes cards. For dry cleaning, Alta is at Durango 70, five minutes ' +
          'from the plaza.',
      },
    },

    supermarkets: {
      body: {
        es:
          'Sumesa en Colima 115 es la más cercana y abre de 7 a 10 todos los ' +
          'días; la de Álvaro Obregón 120 es más grande. Puerta Roma, en ' +
          'Chapultepec 266, abre 24 horas de jueves a domingo, que resuelve ' +
          'las compras a deshoras. Y el Mercado Roma, en Querétaro 225, es ' +
          'más para comer que para surtir la despensa.',
        en:
          'Sumesa at Colima 115 is the closest and opens 7 to 10 every day; ' +
          'the one at Álvaro Obregón 120 is larger. Puerta Roma, at ' +
          'Chapultepec 266, is open 24 hours from Thursday to Sunday, which ' +
          'covers the odd-hour shop. And Mercado Roma, at Querétaro 225, is ' +
          'more a place to eat than to stock a kitchen.',
      },
    },

    currencyExchange: {
      body: {
        es:
          'Roseel, en Insurgentes Sur 295B, es la casa de cambio confiable ' +
          'más cerca, pero solo abre entre semana de 10 a 5:30. Evita las ' +
          'ventanillas sobre Álvaro Obregón, donde la calidad varía mucho, y ' +
          'nunca cambies en el aeropuerto. Muchos huéspedes prefieren no ' +
          'cambiar efectivo y usar Wise, Revolut o DolarApp.',
        en:
          'Roseel, at Insurgentes Sur 295B, is the nearest reliable exchange, ' +
          'but it only opens weekdays from 10 to 5:30. Skip the windows along ' +
          'Álvaro Obregón, where quality varies a lot, and never change money ' +
          'at the airport. Many guests skip cash entirely and use Wise, ' +
          'Revolut or DolarApp.',
      },
      // CONFIRM: Roseel's weekday-only hours, and whether Livin is
      // comfortable steering guests away from the Álvaro Obregón windows by
      // name. Softened to "quality varies" rather than naming one.
    },

    cashAtms: {
      body: {
        es:
          'Banamex es la mejor opción práctica: comisión baja y cajeros por ' +
          'toda la colonia. Evita los cajeros sueltos de tiendas de ' +
          'conveniencia: cobran más y dan peor tipo de cambio. Y en ' +
          'cualquier cajero, cuando te ofrezca cobrarte en tu moneda, di que ' +
          'no y elige "sin conversión". Esa pantalla cuesta más que la ' +
          'comisión.',
        en:
          'Banamex is the practical pick: low withdrawal fee and machines all ' +
          'over the neighbourhood. Avoid the standalone machines in ' +
          'convenience stores, which charge more and use worse rates. And at ' +
          'any machine, when it offers to charge you in your own currency, ' +
          'decline and choose "sin conversión". That screen costs more than ' +
          'the fee does.',
      },
      // TODO: add one specific nearby Banamex once someone walks past and
      // confirms it. Left generic rather than guessed.
      // RE-CHECK QUARTERLY: bank fees move monthly. No peso amounts here on
      // purpose.
    },

    oddHours: {
      body: {
        es:
          'Farmacia San Pablo, en Chihuahua 232, abre 24 horas y es la más ' +
          'confiable de la zona a esa hora. Puerta Roma, en Chapultepec 266, ' +
          'también abre toda la noche de jueves a domingo. El resto de la ' +
          'semana quedan los OXXO, que están por todas partes.',
        en:
          'Farmacia San Pablo, at Chihuahua 232, is open 24 hours and is the ' +
          'most reliable option at that hour. Puerta Roma, at Chapultepec ' +
          '266, is also open all night from Thursday to Sunday. The rest of ' +
          'the week, what stays open is OXXO, and there is one on almost ' +
          'every corner.',
      },
      // NOTE: one nearby pharmacy on Querétaro advertises 24 hours and
      // repeatedly is not. Deliberately excluded.
    },

    coworking: {
      body: {
        es:
          'Privat, en Córdoba 95, está a cuatro minutos de la plaza, acepta ' +
          'walk-ins y vende pases por día y por semana; abre hasta las 10 de ' +
          'la noche entre semana. Los coworkings más grandes de la zona ' +
          'trabajan por contrato mensual, así que no sirven para unos días. ' +
          'Si solo necesitas un par de horas, casi cualquier café de Roma ' +
          'funciona.',
        en:
          'Privat, at Córdoba 95, is four minutes from the plaza, takes ' +
          'walk-ins, and sells day and week passes; it stays open until 10 on ' +
          'weekdays. The larger coworking spaces nearby work on monthly ' +
          'contracts, so they are no use for a few days. If you only need a ' +
          'couple of hours, almost any café in Roma will do.',
      },
    },

    // gyms: intentionally absent — falls back to the generic Fitpass
    // default (content/guia/faq/base.ts) rather than naming La Jungla /
    // Sports World specifically. Per instruction: Roma shows the same
    // generic gyms text as Condesa, not zone-specific gym picks.

    haircuts: {
      body: {
        es:
          "The Barber's Spa, en Colima 220, está prácticamente en la plaza, " +
          'abre los siete días y acepta walk-ins. Barbería Capital, en ' +
          'Monterrey 118B, abre de 10 a 9 todos los días, también sin cita. ' +
          "Y Bardo's, en Monterrey 159, es la opción más cuidada si prefieres " +
          'reservar por WhatsApp.',
        en:
          "The Barber's Spa, at Colima 220, is practically on the plaza, open " +
          'seven days, and takes walk-ins. Barbería Capital, at Monterrey ' +
          '118B, is open 10 to 9 every day, also without an appointment. And ' +
          "Bardo's, at Monterrey 159, is the more considered option if you " +
          'would rather book over WhatsApp.',
      },
    },

    // ---------------------------------------------------------------
    // Eating in and hosting
    // ---------------------------------------------------------------

    groupRestaurants: {
      body: {
        es:
          'Huset, en Colima 256, tiene un patio con mesas largas y es lo más ' +
          'cercano a la plaza. Gardela, en Álvaro Obregón 31, es parrilla ' +
          'argentina y aguanta grupos grandes. Macelleria, en Orizaba 127, ' +
          'es italiano, ruidoso y divertido. En los tres conviene reservar, ' +
          'y en Roma reservar significa llamar.',
        en:
          'Huset, at Colima 256, has a patio with long tables and is the ' +
          'closest to the plaza. Gardela, at Álvaro Obregón 31, is an ' +
          'Argentine grill and handles large groups. Macelleria, at Orizaba ' +
          '127, is Italian, loud and fun. Book at all three, and in Roma ' +
          'booking means calling.',
      },
      // CONFIRM: none of these publish a group policy or party-size cap. Do
      // not claim they "take groups of N" without asking them.
    },

    cateringDelivery: {
      body: {
        es:
          'Rappi, Uber Eats y Didi Food cubren toda la colonia y casi todo ' +
          'llega en menos de quince minutos. Descarga la que prefieras antes ' +
          'de necesitarla: las tres piden configurar el pago primero. Rappi ' +
          'además trae despensa y farmacia, que resuelve la mayoría de los ' +
          'pendientes sin salir.',
        en:
          'Rappi, Uber Eats and Didi Food all cover the neighbourhood, and ' +
          'almost everything arrives in under fifteen minutes. Download ' +
          'whichever you prefer before you need it — they all ask you to set ' +
          'up payment first. Rappi also delivers groceries and pharmacy ' +
          'items, which handles most errands without leaving the apartment.',
      },
    },

    wineLiquor: {
      body: {
        es:
          'La Contra, en Jalapa 129, se especializa en vino mexicano y está ' +
          'a cuatro minutos. El Liquor Store, en Orizaba 203, es la mejor ' +
          'parada para mezcal y tequila, y dan a probar antes de comprar. ' +
          'Bodegas Alianza, en Oaxaca 137, sale más barato y tiene botellas ' +
          'chicas para llevar en la maleta.',
        en:
          'La Contra, at Jalapa 129, specialises in Mexican wine and is four ' +
          'minutes away. El Liquor Store, at Orizaba 203, is the best stop ' +
          'for mezcal and tequila, and they let you taste before you buy. ' +
          'Bodegas Alianza, at Oaxaca 137, is cheaper and carries small ' +
          'bottles that travel in a suitcase.',
      },
    },
  },
}
