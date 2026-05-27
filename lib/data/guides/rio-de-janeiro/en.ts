import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'rio-de-janeiro',
  locale: 'en',

  hero: {
    title: 'Rio de Janeiro',
    subtitle: 'The most cinematic city in the world — and one with more layers than any four-day guide can cover. This is the version for the family that wants beaches, art, food, and Corcovado from the best vantage point available.',
    eyebrow: 'Curated guide · Family with teenagers · 4 days · Luxury',
    tags: ['Family', 'Teenagers', 'Luxury', 'Food'],
    image: '',
  },

  itinerary: [
    {
      day: 1,
      title: 'Arrival and beach',
      items: [
        {
          time: '14:00',
          title: 'Check-in and room reveal',
          description: 'Check-in at JANEIRO.',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Leblon beach / walk to Arpoador',
          description: '',
          tags: [],
        },
        {
          time: '18:30',
          title: 'Sunset at Arpoador (non-negotiable)',
          description: 'The most famous sunset in the world.',
          tags: [],
        },
        {
          time: '20:30',
          title: 'Dinner on Dias Ferreira',
          description: 'Leblon\'s most serious dining street.',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Corcovado and Santa Teresa',
      items: [
        {
          time: '07:30',
          title: 'Breakfast',
          description: '',
          tags: [],
        },
        {
          time: '08:30',
          title: 'Corcovado cog train',
          description: 'Take it first thing to avoid clouds and tour groups.',
          tags: [],
        },
        {
          time: '11:30',
          title: 'Santa Teresa neighborhood',
          description: '',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Lunch at Aprazível',
          description: 'Carioca cuisine, terrace with views.',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Escadaria Selarón',
          description: 'The 215-step mosaic staircase that João Selarón built over 20 years, now tiled with pieces from 60 countries.',
          tags: [],
        },
        {
          time: '16:30',
          title: 'Back to the hotel',
          description: '',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Casual dinner in Leblon',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Art, science and food',
      items: [
        {
          time: '09:00',
          title: 'Transfer to Museu do Amanhã',
          description: '',
          tags: [],
        },
        {
          time: '11:30',
          title: 'MAR (Museu de Arte do Rio)',
          description: 'Right across from the Amanhã.',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Lunch at Mercado do Porto de Gastronomia',
          description: 'Rio\'s most important food hall, with 50 chefs and cuisines from across Brazil under one roof.',
          tags: [],
        },
        {
          time: '15:30',
          title: 'Return and beach / rest',
          description: '',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Dinner at Lasai',
          description: 'Booking required well in advance. Rio\'s only Michelin-starred restaurant.',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'Gentle goodbye',
      items: [
        {
          time: '09:00',
          title: 'Breakfast',
          description: 'Long breakfast with ocean views.',
          tags: [],
        },
        {
          time: '10:30',
          title: 'Beach / Ipanema galleries / spa',
          description: 'Galeria Anna Maria Niemeyer and Galeria Jaqueline Martins show some of the most interesting contemporary Brazilian art.',
          tags: [],
        },
        {
          time: '12:30',
          title: 'Light lunch',
          description: '',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Transfer to GIG airport',
          description: '',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Janeiro Hotel',
      type: 'Hotel · Leblon',
      priceTier: '$$$',
      description: 'Fifty-one beachfront rooms in Rio\'s most elegant neighborhood. Floor-to-ceiling windows turn every room into a private lookout over Leblon, Ipanema and the Dois Irmãos — the rock formation that rises straight from the sand to 533 meters. Infinity pool on the rooftop, restaurant with contemporary Brazilian cuisine and beach service included. Estimated price: $350–600 USD/night.',
      tag: 'Beachfront design in Leblon',
      affiliateUrl: '',
      archetypes: ['Families', 'Couples'],
    },
    {
      name: 'Sol Ipanema Hotel',
      type: 'Hotel · Ipanema',
      priceTier: '$$',
      description: 'Directly in front of Posto 9 on Ipanema — Rio\'s most iconic stretch of beach, a block and a half from the bar where "Garota de Ipanema" was born. Family rooms with ocean views, buffet breakfast included with the famous chocolate brownie, and beach service with chairs, towels and umbrella at no extra cost. Rooftop pool. Estimated price: $200–350 USD/night for an oceanview family room.',
      tag: 'Right on Posto 9, family-friendly',
      affiliateUrl: '',
      archetypes: ['Families'],
    },
    {
      name: 'Hotel Fasano Rio de Janeiro',
      type: 'Luxury hotel · Ipanema',
      priceTier: '$$$',
      description: 'The first building in Brazil designed by Philippe Starck, right on Avenida Vieira Souto facing the Atlantic. 89 rooms with wood floors and leather furniture, in an aesthetic that honors the Bossa Nova era of the 50s and 60s. The rooftop infinity pool offers views of Arpoador, Dois Irmãos and Corcovado. Restaurant Gero Rio for contemporary Italian. Estimated price: $500–900 USD/night.',
      tag: 'Starck, Bossa Nova and an iconic rooftop',
      affiliateUrl: '',
      archetypes: ['Couples', 'Families'],
    },
  ],

  hotelsDescription: 'Three sanctuaries with an ocean view — from the most design-led to the most practical.',

  experiences: [
    {
      name: 'Corcovado on the cog train',
      description: 'The only way up to Christ the Redeemer that delivers on the promise. The Corcovado train leaves from Cosme Velho station (15 minutes by taxi from Leblon) and climbs 3.8 kilometers of Atlantic rainforest in 20 minutes. Arrival at the top — with Christ rising over the city at 710 meters — is the moment teenagers will use as their profile picture for at least two years. Book online weeks in advance.',
      tags: ['Iconic', 'Teenagers', 'Views'],
      affiliateUrl: '',
    },
    {
      name: 'Museu do Amanhã and the port district',
      description: 'The science museum designed by Santiago Calatrava on Rio\'s port is the most important contemporary building in Brazil. For curious teenagers, the interactive exhibits on climate change, neuroscience and cosmos are the city\'s most interesting morning plan. Combine with a walk through the Santa Teresa neighborhood, reachable by bonde (historic tram) or on foot from downtown.',
      tags: ['Museum', 'Architecture', 'Family'],
      affiliateUrl: '',
    },
    {
      name: 'Tasting dinner at Lasai',
      description: 'Rio de Janeiro\'s only Michelin-starred restaurant, five minutes from JANEIRO Hotel in Botafogo. Tasting menu with produce from the restaurant\'s own garden, wine pairings and a kitchen that fuses French technique with carioca ingredients. The biggest splurge of the trip — and the night you\'ll remember most. Booking required weeks in advance.',
      tags: ['Fine dining', 'Michelin', 'Carioca cuisine'],
      affiliateUrl: '',
    },
  ],

  tips: [
    'Açaí: In Leblon and Ipanema, there\'s an açaí stand every other block — the Amazonian fruit served in a bowl, frozen and topped with granola and banana. The most carioca breakfast available, and the one teenagers with taste photograph most. Bibi Sucos in Leblon is the local benchmark.',
    'Beach watermelon: The vendor walking Leblon beach with a cooler on his shoulder, cutting watermelon into bars, is part of the landscape. Buy. It costs less than $2 and is the most honest hydration of the trip.',
    'Brazilian wine: Southern Brazil — especially the Serra Gaúcha — produces the best wines in South America that most travelers have never tried. The JANEIRO Hotel restaurant has a serious selection. If the family drinks wine, order one from Serra Gaúcha on the first night.',
  ],

  funFact: 'Leblon and Ipanema are technically the same neighborhood — they\'re separated by a canal built in 1917 that split the beach in two. The song "Garota de Ipanema" was composed in 1962 by Tom Jobim and Vinícius de Moraes at Bar Veloso in Ipanema (today called Bar Garota de Ipanema), watching a neighbor walk past every day on her way to the beach. The bar is still open.',

  checklist: [
    '🩱 Swimsuits for everyone',
    '🧴 Sunscreen (Atlantic sun)',
    '👟 Comfortable sneakers for Corcovado and Santa Teresa',
    '📷 Camera with a spare battery',
    '👗 Something dressy for Lasai',
    '💵 Card and some cash in reais',
    '🕶️ Sunglasses',
    '🎒 Small hotel-issued bag for going out',
  ],

  transport: [
    {
      mode: 'Flight',
      description: 'Antonio Carlos Jobim International Airport (GIG / Galeão), 25 kilometers from Leblon. Private transfer to the hotel: 40–60 minutes depending on traffic, $40–55 USD. Alternative: Santos Dumont Airport (SDU), 10 kilometers from downtown, with domestic flights from São Paulo (30 minutes) — useful if the itinerary includes a São Paulo connection.',
    },
    {
      mode: 'Local transport',
      description: 'Uber works perfectly in Rio — it\'s the safest, most convenient transport for tourists. Avoid street taxis; always use Uber or a private hotel transfer. Leblon to Ipanema: 5 minutes. Leblon to Corcovado: 20 minutes. Leblon to the port / Museu do Amanhã: 30–40 minutes.',
    },
    {
      mode: 'Safety',
      description: 'Rio requires basic common sense. Leblon and Ipanema are the safest neighborhoods for tourists. Don\'t walk around with a camera around your neck; use the hotel-issued bag and carry only what you need. At the main sights (Corcovado, Museu do Amanhã, the Selarón), risk during daylight hours is minimal.',
    },
  ],
}
