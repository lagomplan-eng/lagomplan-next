import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'guanacaste',
  locale: 'en',

  hero: {
    title: 'Guanacaste, Costa Rica',
    subtitle: 'The Pacific-North province that solves the perfect weekend: beaches without the crowds, sunsets people photograph for twenty minutes straight, and the chance to do nothing — elegantly.',
    eyebrow: 'Curated guide · Friends & Relaxation · Weekend',
    tags: ['Friends', 'Relaxation', 'Beach', 'Weekend'],
    image: '/images/guides/guanacaste.png',
  },

  itinerary: [
    {
      day: 1,
      title: 'Friday · Arrival',
      items: [
        {
          time: '16:00',
          title: 'Check-in',
          description: 'Arrival in the afternoon. Airport transfer to the hotel.',
          tags: [],
        },
        {
          time: '17:30',
          title: 'Walk to Playa Langosta',
          description: 'Two kilometers south of Tamarindo, dark sand and stronger waves for the most photogenic sunset in the area.',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Dinner in town',
          description: 'La Palapa Beach Club or any restaurant along Tamarindo\'s boardwalk.',
          tags: [],
        },
        {
          time: '22:00',
          title: 'Let the night decide',
          description: 'The town has a main street with bars that doesn\'t try to be Cancún.',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Saturday · Surf and rest',
      items: [
        {
          time: '07:30',
          title: 'Breakfast',
          description: '',
          tags: [],
        },
        {
          time: '09:00',
          title: 'Surf lesson (2 hours)',
          description: 'Tamarindo\'s wave is long, gentle, and perfect for beginners.',
          tags: [],
        },
        {
          time: '12:30',
          title: 'Lunch at the hotel or on the beach',
          description: '',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Pool / rest / no agenda',
          description: 'Pool and reading afternoon — or whatever each person needs.',
          tags: [],
        },
        {
          time: '18:00',
          title: 'Sunset from the terrace',
          description: 'The hotel terrace or bar with Pacific views.',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Dinner',
          description: 'At the hotel or in town.',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Sunday · Mangroves and return',
      items: [
        {
          time: '07:00',
          title: 'Kayak tour on Estero El Salado',
          description: 'Early morning in the mangroves, 2-hour tour.',
          tags: [],
        },
        {
          time: '10:00',
          title: 'Back to the hotel',
          description: '',
          tags: [],
        },
        {
          time: '11:00',
          title: 'Brunch / pool',
          description: 'Last dip in the pool.',
          tags: [],
        },
        {
          time: '13:30',
          title: 'Transfer to LIR airport',
          description: '',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Tamarindo Diria Beach Resort',
      type: 'Resort · Playa Tamarindo',
      priceTier: '$$',
      description: 'The most established resort in Tamarindo, right on the beach. Three pools, four restaurants, a beach bar and a hammock area with Pacific views. For the group of friends who want to wake up steps from the sea and stop thinking about logistics. Buffet breakfast included and a beach bar that closes the loop without anyone having to make extra decisions. Estimated price: $130–200 USD/night per room.',
      tag: 'Friction-free beach resort',
      affiliateUrl: 'https://booking.stay22.com/lagomplan/mbywnGzA64',
      archetypes: ['Families', 'Couples'],
    },
    {
      name: 'Wyndham Tamarindo',
      type: 'Hotel · Hilltop above Tamarindo',
      priceTier: '$$',
      description: 'On the hill above Tamarindo, with an infinity pool and Pacific views that show up most often in the reviews. Free shuttle to town and to the Langosta Beach Club every hour — solving the distance without needing a car. For the group that wants spectacular sunset views and easy access into town at night. Estimated price: $110–180 USD/night per room.',
      tag: 'Infinity views and shuttle into town',
      affiliateUrl: 'https://booking.stay22.com/lagomplan/xwSkTk6GWZ',
      archetypes: ['Couples'],
    },{
      name: 'Capitan Suizo Beachfront Boutique',
      type: 'Hotel · Beachfront Tamarindo',
      priceTier: '$$',
      description: 'In the calmest area of Tamarindo Bay, wooden bungalows between tropical gardens. Estimated price: $180–320 USD/night per room.',
      tag: 'Beach front in the calmest area',
      affiliateUrl: 'https://booking.stay22.com/lagomplan/xwSkTk6GWZ',
      archetypes: ['Couples'],
    },
  ],

  hotelsDescription: 'A no-stress base for a weekend that doesn\'t want friction.',

  experiences: [
    {
      name: 'Surf or surf lessons at Playa Tamarindo',
      description: 'Tamarindo\'s wave is long, gentle, and perfect for beginners. The town\'s surf schools (Witch\'s Rock Surf Camp, Tamarindo Surf School) offer two-hour lessons for $60–80 USD with a private instructor. For the group that has never surfed — or has been meaning to try for years — this is the Saturday morning plan.',
      tags: ['Surf', 'Beginners', 'Beach'],
      affiliateUrl: 'https://getyourguide.stay22.com/lagomplan/gGkZgcCnzP',
    },
    {
      name: 'Kayak tour through Estero El Salado',
      description: 'A 15-minute drive from Tamarindo, the Estero mangrove has crocodiles sunning on sandbanks, tropical birds in the trees, and the silence that doesn\'t exist in town. Two-hour guided kayak tours run $40–55 USD per person. The Sunday plan before the flight home.',
      tags: ['Kayak', 'Mangrove', 'Nature'],
      affiliateUrl: '',
    },
    {
      name: 'Sunset on Playa Langosta',
      description: 'Two kilometers south of Tamarindo, Playa Langosta has no vendors and no tourists with speakers. Dark sand, stronger waves and the most photogenic sunset in the area. Reach it by walking along the beach in 25 minutes or by tuk-tuk in 10. The Friday-night plan, fresh off the plane.',
      tags: ['Sunset', 'Beach', 'Photo'],
      affiliateUrl: '',
    },
  ],

  tips: [
    'Casado: Costa Rica\'s national dish — rice, black beans, meat or fish, fried plantain and salad — is the most honest, cheapest lunch of the trip. At any soda (local restaurant) in Tamarindo it runs $7–12 USD. Use it as the active-day lunch.',
    'Pura vida: Use it. Not as a cliché — as travel instruction. Guanacaste\'s pace does not accept hurry. The late transfer, the slow restaurant, the wave that never comes: all solved with the same phrase. The group that gets it on day one has a better weekend than the one that learns it on the last.',
    'Sunscreen, no exceptions: The Pacific-North Costa Rica sun at 10am is the most convincing argument for SPF 50 before breakfast. The day-one burn ruins day two.',
  ],

  funFact: 'Guanacaste was part of the Federal Republic of Central America before joining Costa Rica in 1824 by popular vote. July 25 — Annexation Day — is the province\'s biggest celebration, with bullfights, traditional music and civic parties. If your weekend overlaps, the experience changes completely.',

  checklist: [
    '🩱 Swimsuit and beachwear',
    '🧴 Sunscreen SPF 50',
    '🏄 Openness to a surf lesson',
    '🕶️ Sunglasses',
    '💵 Some dollars and colones in cash',
    '🥾 Sandals plus a comfortable pair for walking',
    '📷 Camera for the Langosta sunset',
    '🧢 Cap or sun hat for midday',
  ],

  transport: [
    {
      mode: 'Flight',
      description: 'Daniel Oduber Quirós International Airport (LIR) in Liberia, 80 kilometers from Tamarindo. Direct flights from Mexico City (Aeroméxico, Volaris), Miami, Houston and several U.S. cities. Private airport transfer to Tamarindo: 70–80 minutes, $60–80 USD per vehicle (not per person).',
    },
    {
      mode: 'Alternate route',
      description: 'Juan Santamaría Airport (SJO) in San José, 4.5 hours from Tamarindo. Only if flights to LIR are full or significantly more expensive.',
    },
    {
      mode: 'Weather',
      description: 'Dry season in Guanacaste runs November through April — peak summer with guaranteed sun. May through October is rainy season: sunny mornings, 30–60 minute afternoon showers. Both work for a beach weekend.',
    },
  ],
}
