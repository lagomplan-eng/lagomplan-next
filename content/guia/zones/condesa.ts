/**
 * content/guia/zones/condesa.ts
 *
 * Zone-tier FAQ content for Condesa. Inherited by every partner property
 * whose `zone` is 'condesa'.
 *
 * SOURCING
 * Names, street addresses and opening hours below are machine-sourced from
 * Google Places on 2026-09-07. Nothing here is derived from reviews or
 * subjective impressions — no "great service", no "the best in the
 * neighbourhood". Editorial enrichment is Pili's layer, not this file's.
 *
 * VERIFICATION DEBT
 * Google hours drift. Every entry that states or implies opening hours needs
 * a walk-past confirmation before this ships to a live partner. Entries
 * flagged CONFIRM below are the ones where the hours are load-bearing.
 *
 * Keys deliberately left absent (no confirmed answer yet, so they render
 * nothing): privateEvents.
 */

import type { Zone } from './types'

export const condesa: Zone = {
  id: 'condesa',

  answers: {
    // ---------------------------------------------------------------
    // GROUP 2 — Everyday errands
    // ---------------------------------------------------------------

    laundry: {
      body: {
        es:
          'Laundry Lounge, en Insurgentes Centro 309, abre los siete días y ' +
          'tiene autoservicio y entrega el mismo día si la dejas temprano. ' +
          'Tintorería Blanco está en Ensenada 50; ' +
          'cierra a las 6 entre semana y a las 2 el sábado, así que conviene ' +
          'llamar antes de cruzar la ciudad con un saco.',
        en:
          'Laundry Lounge, at Insurgentes Centro 309, is open seven days and ' +
          'does both self-service and same-day drop-off if you get there ' +
          'early. For dry cleaning, Tintorería Blanco is at Ensenada 50; ' +
          'it closes at 6 on weekdays and 2 on Saturday, so call before you ' +
          'walk over with a jacket.',
      },
      // CONFIRM: Blanco's hours. Multiple reports of the posted hours not
      // holding. Worth a walk-past before this goes live anywhere.
    },

    supermarkets: {
      body: {
        es:
          'Walmart Express, en Pachuca 99, es el más completo y abre de 7 a ' +
          '11 todos los días. Para despensa más cuidada, The Green Corner en ' +
          'Mazatlán 81 y Estado Natural en Vicente Suárez 85, que vende a ' +
          'granel. Y si quieres fruta, verdura y un desayuno de paso, el ' +
          'Mercado Michoacán sobre Tamaulipas abre todos los días hasta las 7.',
        en:
          'Walmart Express, at Pachuca 99, is the most complete and opens 7 ' +
          'to 11 every day. For a better-sourced shop, The Green Corner at ' +
          'Mazatlán 81 and Estado Natural at Vicente Suárez 85, which sells ' +
          'in bulk. For produce and a breakfast while you are at it, Mercado ' +
          'Michoacán on Tamaulipas is open daily until 7.',
      },
      // NOTE: Several guests have reported Walmart Express declining foreign
      // cards. Ask Livin whether they want that stated — it is useful but it
      // is a claim about a third party, so it has been left out.
    },

    currencyExchange: {
      body: {
        es:
          'EXE, en Tamaulipas 75B, es la casa de cambio del barrio; abre de ' +
          '10 a 7 entre semana y hasta las 2 el sábado. Como regla general, ' +
          'evita cambiar en el aeropuerto: es donde peor pagan. Muchos ' +
          'huéspedes prefieren no cambiar efectivo y usar Wise, Revolut o ' +
          'DolarApp, que dan un tipo de cambio cercano al real.',
        en:
          'EXE, at Tamaulipas 75B, is the neighbourhood exchange; open 10 to ' +
          '7 on weekdays and until 2 on Saturday. As a rule, avoid changing ' +
          'money at the airport, where the rates are worst. Many guests skip ' +
          'cash entirely and use Wise, Revolut or DolarApp, which sit close ' +
          'to the real rate.',
      },
      // Apps stated descriptively, not as a recommendation, and with no
      // referral links. Keep it that way unless something is signed.
    },

    cashAtms: {
      body: {
        es:
          'Banamex es la mejor opción práctica: comisión baja y cajeros en casi ' +
          'cada esquina. Hay uno dentro del Walmart Express de Pachuca 99. ' +
          'Evita los cajeros sueltos de tiendas de conveniencia: cobran más y ' +
          'dan peor tipo de cambio. Y en cualquier cajero, cuando te ofrezca ' +
          'cobrarte en tu moneda, di que no y elige "sin conversión". Esa ' +
          'pantalla cuesta más que la comisión.',
        en:
          'Banamex is the practical pick: low withdrawal fee and machines on ' +
          'almost every corner. There is one inside the Walmart Express at ' +
          'Pachuca 99. Avoid the standalone machines in convenience stores, ' +
          'which charge more and use worse rates. And at any machine, when it ' +
          'offers to charge you in your own currency, decline and choose "sin ' +
          'conversión". That screen costs more than the fee does.',
      },
    },

    oddHours: {
      body: {
        es:
          'La Farmacia del Ahorro de Sonora 156 abre 24 horas. Walmart ' +
          'Express, en Pachuca 99, cierra a las 11 todos los días, y ' +
          'Licoría Condesa, en Atlixco 147, también. Después de esa hora ' +
          'lo que queda abierto son los OXXO, que están por todas partes.',
        en:
          'Farmacia del Ahorro on Sonora 156 is open 24 hours. Walmart ' +
          'Express at Pachuca 99 closes at 11 every day, and Licoría ' +
          'Condesa at Atlixco 147 does too. After that, what stays open is ' +
          'OXXO, and there is one on almost every corner.',
      },
    },

    haircuts: {
      body: {
        es:
          "Bardo's, en Nuevo León 144, abre los siete días hasta las 9. La MEXA, " +
          'en Francisco Márquez 145, es más pequeña y cierra los domingos. Las ' +
          'dos dan cita el mismo día por WhatsApp, que es como se reserva casi ' +
          'todo aquí.',
        en:
          "Bardo's, at Nuevo León 144, is open seven days until 9. La MEXA, at " +
          'Francisco Márquez 145, is smaller and closed Sundays. Both take ' +
          'same-day appointments over WhatsApp, which is how most things get ' +
          'booked here.',
      },
    },

    coworking: {
      body: {
        es:
          'Uotan Studio, en Fernando Montes de Oca 86, tiene cabinas para ' +
          'llamadas y pases por día. The Club, en Campeche 410, abre de 9 a ' +
          '6 entre semana. Si solo necesitas un par de horas con buen wifi, ' +
          'casi cualquier café del barrio funciona.',
        en:
          'Uotan Studio, at Fernando Montes de Oca 86, has phone booths and ' +
          'day passes. The Club, at Campeche 410, is open 9 to 6 on ' +
          'weekdays. If you only need a couple of hours and good wifi, ' +
          'almost any café in the neighbourhood will do.',
      },
      // LEAD: Uotan reportedly stores luggage. If that is a real service it
      // is a better answer for the `luggage` item than any third party.
    },

    // ---------------------------------------------------------------
    // GROUP 3 — Eating in and hosting
    // ---------------------------------------------------------------

    groupRestaurants: {
      body: {
        es:
          'Azul Condesa, en Nuevo León 68, es el más grande y el más ' +
          'acostumbrado a mesas largas. Bulla, en Mazatlán 20C, funciona ' +
          'bien para grupos medianos con tapas al centro. Black Legend, en ' +
          'Tamaulipas 100, abre hasta las 2 los fines de semana. En los ' +
          'tres conviene reservar, y en Condesa reservar significa llamar.',
        en:
          'Azul Condesa, at Nuevo León 68, is the largest and the most used ' +
          'to long tables. Bulla, at Mazatlán 20C, works well for mid-size ' +
          'groups sharing tapas. Black Legend, at Tamaulipas 100, runs ' +
          'until 2 on weekends. Book at all three, and in Condesa booking ' +
          'means calling.',
      },
      // CONFIRM: none of these have a stated group policy or party-size cap
      // on Google. Do not claim they "take groups of N" without asking them.
    },

    // chefsAtHome: intentionally absent — falls back to the generic
    // concierge default (content/guia/faq/base.ts), same as every other
    // zone. Not property/zone-specific.

    cateringDelivery: {
      body: {
        es:
          'Rappi, Uber Eats y Didi Food cubren toda la zona y casi todo ' +
          'está a menos de quince minutos. Rappi además trae despensa y ' +
          'farmacia, que resuelve la mayoría de los pendientes sin salir.',
        en:
          'Rappi, Uber Eats and Didi Food all cover the area, and almost ' +
          'everything is under fifteen minutes away. Rappi also delivers ' +
          'groceries and pharmacy items, which handles most errands without ' +
          'leaving the apartment.',
      },
    },

    wineLiquor: {
      body: {
        es:
          'La Europea, en Colima 436, tiene la mejor selección y también ' +
          'quesos y embutidos si vas a armar una tabla. KANA, en Michoacán ' +
          '153, está más cerca y sale más barato. Licoría Condesa, en ' +
          'Atlixco 147, es la que abre hasta las 11.',
        en:
          'La Europea, at Colima 436, has the best selection and also ' +
          'carries cheese and cured meats if you are putting a board ' +
          'together. KANA, at Michoacán 153, is closer and cheaper. Licoría ' +
          'Condesa, at Atlixco 147, is the one open until 11.',
      },
    },

    // privateEvents: intentionally absent — no confirmed answer.
    // Renders nothing until Livin tells us how they handle it.
  },
}
