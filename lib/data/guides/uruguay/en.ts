import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'uruguay',
  locale: 'en',

  hero: {
    title: 'Uruguay',
    subtitle: 'The quietest country in South America. A trip designed for families that want adventure without unnecessary adrenaline, history you can touch, and the most honest asado on the continent.',
    eyebrow: 'Curated guide · Family & Nature · 6 days',
    tags: ['Family', 'Nature', 'History', 'Calm'],
    image: '/images/guides/uruguay.png',
  },

  itinerary: [
    {
      day: 1,
      title: 'Landing in Montevideo',
      items: [
        {
          time: '14:00',
          title: 'Check-in and rest',
          description: 'Check-in at the Hyatt Centric.',
          tags: [],
        },
        {
          time: '17:00',
          title: 'Pocitos rambla with the kids',
          description: 'Free afternoon on the rambla — kids on the urban beach, adults with mate looking out over the river.',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Dinner in Ciudad Vieja',
          description: 'Dinner at Mercado de los Artesanos: simple plates, fair prices, neighborhood vibe.',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Ciudad Vieja & Mercado del Puerto',
      items: [
        {
          time: '09:30',
          title: 'Ciudad Vieja walking tour',
          description: 'Metropolitan Cathedral, Cabildo, Teatro Solís. 90 minutes on foot.',
          tags: [],
        },
        {
          time: '12:30',
          title: 'Lunch at Mercado del Puerto',
          description: 'Uruguay\'s most photogenic asado, with grills open to the public and a local-fervor atmosphere.',
          tags: [],
        },
        {
          time: '15:30',
          title: 'National Museum of Natural History',
          description: 'Free entry, ideal for kids.',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Quiet dinner in Pocitos',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Day in the countryside',
      items: [
        {
          time: '08:30',
          title: 'Departure by transfer',
          description: 'Private transfer to an estancia 60 kilometers from Montevideo.',
          tags: [],
        },
        {
          time: '10:00',
          title: 'Arrival at the estancia',
          description: '',
          tags: [],
        },
        {
          time: '10:30',
          title: 'Countryside activities',
          description: '90-minute horseback ride and wildlife sightings: capybaras roaming free in the fields.',
          tags: [],
        },
        {
          time: '12:30',
          title: 'Asado and long lunch',
          description: 'Midday asado with regional tannat wine.',
          tags: [],
        },
        {
          time: '15:30',
          title: 'Return to Montevideo',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'Transfer to Colonia del Sacramento',
      items: [
        {
          time: '09:00',
          title: 'Departure for Colonia',
          description: 'Bus or transfer to Colonia (2.5 hours).',
          tags: [],
        },
        {
          time: '12:00',
          title: 'Check-in at Radisson',
          description: 'Arrival at the Radisson before noon.',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Walking tour of the Historic Quarter',
          description: 'The Lighthouse, the 17th-century cobblestone streets, the Citadel Gate and the Paseo de San Gabriel.',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Dinner at Del Carmen Restaurante',
          description: 'Hotel restaurant with river views.',
          tags: [],
        },
      ],
    },
    {
      day: 5,
      title: 'Free day in Colonia',
      items: [
        {
          time: '09:30',
          title: 'Buffet breakfast at the hotel',
          description: '',
          tags: [],
        },
        {
          time: '11:00',
          title: 'Portuguese Museum and Municipal Museum',
          description: '',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Lunch at Buen Suspiro restaurant',
          description: 'River view, terrace.',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Pool / spa / free time',
          description: 'Hotel pool for the kids, spa for the adults.',
          tags: [],
        },
        {
          time: '17:30',
          title: 'Sunset from the Lighthouse',
          description: 'The Río de la Plata turning orange.',
          tags: [],
        },
      ],
    },
    {
      day: 6,
      title: 'Easy return',
      items: [
        {
          time: '09:00',
          title: 'Breakfast',
          description: 'Long breakfast.',
          tags: [],
        },
        {
          time: '11:00',
          title: 'Transfer to MVD',
          description: 'Return transfer to Montevideo with time to spare for an afternoon flight.',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Final hours in Montevideo or at the airport',
          description: 'If the flight is at night, free afternoon in Pocitos for a last walk along the rambla.',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Radisson Hotel Colonia del Sacramento',
      type: 'Hotel · Colonia del Sacramento',
      priceTier: '$$$',
      description: 'A block from the UNESCO World Heritage Historic Quarter, with panoramic Río de la Plata views and indoor and outdoor pools. Family rooms with two queen beds have a balcony over the river — the buffet breakfast is the best argument not to rush out to explore before 9am. The playground in the garden solves the first half hour after lunch while the adults have coffee. Estimated price: $110–160 USD/night for a family room.',
      tag: 'Across from a UNESCO World Heritage site',
      affiliateUrl: '',
      archetypes: ['Families'],
    },
    {
      name: 'Hyatt Centric Montevideo',
      type: 'Hotel · Montevideo · Pocitos',
      priceTier: '$$$',
      description: 'Across from the Pocitos rambla, with the iconic "MONTEVIDEO" sign visible from the room. Heated indoor pool, spacious rooms with a free crib on request, and direct access to the urban beach for the kids. Plantado Restaurant serves a buffet breakfast with tropical fruit and kid-friendly options. To reach Mercado del Puerto in the old town: 20 minutes by taxi or Uber. Estimated price: $180–280 USD/night for a family room.',
      tag: 'Across from the Pocitos rambla',
      affiliateUrl: '',
      archetypes: ['Families'],
    },
  ],

  hotelsDescription: 'Two bases for a family trip: Montevideo and Colonia, both built for actual rest.',

  experiences: [
    {
      name: 'Ferry to Colonia from Buenos Aires',
      description: 'If the trip starts in Argentina, the 1-hour Buquebus is the best first memory of Uruguay for kids. The muddy Río de la Plata, the open-air deck and arrival at the Colonia pier work as a threshold into the country.',
      tags: ['Ferry', 'Family', 'Crossing'],
      affiliateUrl: '',
    },
    {
      name: 'Day at a Uruguayan estancia',
      description: '60–80 kilometers from Montevideo, the historic estancias open their gates for full-day visits: rheas and capybaras roaming free, horseback rides through eucalyptus fields, and a traditional asado lunch. Estancia La Magdalena in Canelones and Estancia Panagea in San José run day trips without an overnight stay. For kids 4 and up: the most memorable experience of the trip.',
      tags: ['Estancia', 'Countryside', 'Asado'],
      affiliateUrl: '',
    },
    {
      name: 'Visit to the Colonia Valdense ruins',
      description: 'The Waldensian colonist village founded in 1858, 30 kilometers from Colonia del Sacramento, has Uruguay\'s most unusual architecture — stone houses with European roofs in the middle of the pampa. For teenagers and adults who want to step off the standard tourist circuit.',
      tags: ['History', 'Architecture', 'Off the beaten path'],
      affiliateUrl: '',
    },
  ],

  tips: [
    'Tannat: Uruguay\'s flagship wine is a red made from a French grape that finds its best expression here. If the countryside excursion includes a winery, take it. Pisano and Bouza are the national reference labels that kids tolerate seeing on the adult table without too much complaining.',
    'Cards everywhere — but carry pesos: Hotels and restaurants accept cards. Markets, estancias and Colonia\'s street stalls prefer Uruguayan pesos. Exchange available at the airport and at any bank in Montevideo.',
    'The Pocitos rambla: It\'s the longest linear park in South America — 22 kilometers along the river. With small kids, an hour walking the rambla in the morning works better than any organized activity.',
  ],

  funFact: 'Uruguay was the first country in Latin America to legalize same-sex marriage (2013), to distribute marijuana under state regulation (2013), and to provide internet in every public school (Plan Ceibal, 2007). On a continent of contrasts, Uruguay is a major exception.',

  checklist: [
    '🧥 Layers for the southern winter (10–17°C)',
    '🧣 Scarf and gloves for the wind off the Plata',
    '👟 Comfortable shoes for Colonia\'s cobblestones',
    '🧉 Mate or thermos (optional — you\'ll be offered one anyway)',
    '💵 Uruguayan pesos for markets and estancias',
    '📷 Camera for the Lighthouse sunset',
    '🐎 Comfortable clothing for the estancia ride',
    '🍷 Openness to trying tannat',
  ],

  transport: [
    {
      mode: 'Flight',
      description: 'Arrival at Carrasco International Airport (MVD), 20 kilometers from downtown Montevideo. Taxi or private transfer to the hotel: 30–40 minutes, $30–40 USD.',
    },
    {
      mode: 'Local transport',
      description: 'Uruguay is a country of manageable distances. Montevideo to Colonia: 2.5 hours by car or bus. COT and Turil buses are comfortable, on time and have bathrooms — a valid option for families. For countryside excursions: private transfer or car rental ($40–70 USD/day).',
    },
    {
      mode: 'Weather',
      description: 'June–July is southern winter. Temperatures of 10–17°C, clear days and clean skies. Bring layers — the Montevideo rambla with wind off the Plata can surprise you. It\'s not beach season, but it\'s the best for countryside and city.',
    },
  ],
}
