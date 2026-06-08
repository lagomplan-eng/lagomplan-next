import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'cartagena',
  locale: 'en',

  hero: {
    title: 'Cartagena de Indias',
    subtitle: 'Colombia\'s walled heart. A week designed to uncover pirate treasures, coral islands, and Caribbean warmth — with the right balance between history and rest.',
    eyebrow: 'Curated guide · Family · 7 days · Beach, adventure',
    tags: ['Family', 'Beach', 'Adventure', 'History'],
    image: '/images/guides/cartagena.png',
  },

  itinerary: [
    {
      day: 1,
      title: 'Arrival inside the walls',
      items: [
        {
          time: '15:00',
          title: 'Check-in and first dip',
          description: '',
          tags: [],
        },
        {
          time: '17:30',
          title: 'Walk along the walls (Baluarte de Santo Domingo)',
          description: 'A gentle walk along the walls at sunset to get your bearings. Let the kids run while watching the kites fly.',
          tags: [],
        },
        {
          time: '19:30',
          title: 'Casual dinner of coastal snacks',
          description: 'Egg-stuffed arepas to ease into the local mood.',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Tunnels and pirates',
      items: [
        {
          time: '08:30',
          title: 'Explore Castillo de San Felipe',
          description: 'The largest fortification the Spanish built in the Americas.',
          tags: [],
        },
        {
          time: '11:30',
          title: 'Museo del Oro Zenú',
          description: 'Free entry and cool air — a refuge from the midday heat.',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Gourmet "corrientazo" lunch and an easy afternoon',
          description: 'Pool-time at the hotel.',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Turquoise paradise',
      items: [
        {
          time: '09:00',
          title: 'Private boat departure from the pier',
          description: 'Skip the crowded "white-beach" tours. Rent a small private boat to Isla Grande.',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Lunch on Isla Grande',
          description: 'Snorkel in crystal water and fresh-fish lunch at a private beach club.',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Back to the city and rest',
          description: 'Sun-tired and sea-full.',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'Getsemaní and color',
      items: [
        {
          time: '10:00',
          title: 'Getsemaní graffiti tour',
          description: 'Street murals and the Plaza de la Trinidad. The most vibrant, authentic place for kids to see local dance.',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Lunch at Celele',
          description: 'Book ahead to try creative Caribbean cuisine.',
          tags: [],
        },
        {
          time: '17:00',
          title: 'Ice cream at La Palettería',
          description: 'Artisan popsicles as the afternoon cools.',
          tags: [],
        },
      ],
    },
    {
      day: 5,
      title: 'Wings and jungle',
      items: [
        {
          time: '09:00',
          title: 'Visit the National Aviary',
          description: 'Pure nature experience that breaks from the city\'s architecture.',
          tags: [],
        },
        {
          time: '13:30',
          title: 'Lunch at Nena Beach (Barú)',
          description: '',
          tags: [],
        },
        {
          time: '16:30',
          title: 'Return to Cartagena',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 6,
      title: 'Chocolate and sunset',
      items: [
        {
          time: '10:00',
          title: '"Bean to bar" workshop at the Chocolate Museum',
          description: 'A complete hit with the kids.',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Shopping at Las Bóvedas',
          description: 'Final craft shopping.',
          tags: [],
        },
        {
          time: '18:00',
          title: 'Sunset at the Baluarte de San Francisco Javier',
          description: 'Dinner on the walls, watching the sun drop into the Caribbean.',
          tags: [],
        },
      ],
    },
    {
      day: 7,
      title: 'Gentle goodbye',
      items: [
        {
          time: '09:00',
          title: 'Farewell breakfast with fruit and Colombian coffee',
          description: 'A long breakfast with tropical fruit.',
          tags: [],
        },
        {
          time: '11:00',
          title: 'Last walk and airport transfer',
          description: 'Pick up a final wayuu bag before heading to the airport.',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Hotel Bastión Luxury',
      type: 'Boutique hotel · Walled city center',
      priceTier: '$$$',
      description: 'Set in a 16th-century mansion but with all the modern comforts. The pool terrace is the perfect refuge from Cartagena\'s midday. Impeccable service that understands a family\'s needs.',
      tag: 'Accessible luxury and the best terrace in town',
      affiliateUrl: 'https://booking.stay22.com/lagomplan/svehJT9jUV',
      archetypes: ['Families', 'Couples'],
    },
    {
      name: 'Ananda Boutique Hotel',
      type: 'Boutique hotel · Historic center',
      priceTier: '$$',
      description: 'A pocket of calm with colonial architecture, high ceilings and a pool surrounded by greenery that fascinates kids. In the heart of the center, close to everything but private enough.',
      tag: 'Balanced elegance and colonial cool',
      affiliateUrl: 'https://booking.stay22.com/lagomplan/IOBDEBRApt',
      archetypes: ['Families', 'Couples'],
    },
    {
      name: 'San Lazaro Art Hotel',
      type: 'Hotel · Facing Castillo de San Felipe',
      priceTier: '$',
      description: 'Right across from Castillo de San Felipe. Modern, with spacious rooms and a cinematic view of the fortress. The smart pick to stay close to the action without paying inside-the-walls rates.',
      tag: 'Epic views and "smart" value',
      affiliateUrl: 'https://booking.stay22.com/lagomplan/X3TmZOk_nW',
      archetypes: ['Families'],
    },
  ],

  hotelsDescription: 'Three options for a mid-range budget that doesn\'t compromise on design.',

  experiences: [
    {
      name: 'Castillo de San Felipe',
      description: 'The largest fortification the Spanish built in the Americas. For kids 6 to 8, walking its tunnels and ramps with a pirate story is the ultimate adventure.',
      tags: ['History', 'Family', 'Adventure'],
      affiliateUrl: 'https://getyourguide.stay22.com/lagomplan/VSUxS_YUGc',
    },
    {
      name: 'Rosario Islands (private boat)',
      description: 'Skip the crowded "white-beach" tours. The most Lagom move is renting a small private boat to Isla Grande. Snorkel in crystal-clear water and lunch on fresh fish at a private beach club.',
      tags: ['Islands', 'Snorkel', 'Private'],
      affiliateUrl: 'https://getyourguide.stay22.com/lagomplan/sDiNuW-An8',
    },
    {
      name: 'National Aviary of Colombia',
      description: 'On Barú. One of the most impressive in the world. Kids can see flamingos, condors and toucans in nearly free habitats. An educational, visually powerful immersion.',
      tags: ['Nature', 'Birds', 'Family'],
      affiliateUrl: 'https://getyourguide.stay22.com/lagomplan/HoNk7mwnx4',
    },
  ],

  tips: [
    'Strategic hydration: Fresh coconut water is sold on every corner. It\'s the best way to keep kids hydrated and a very local experience.',
    'Handling vendors: Cartagena has very persistent vendors. A firm "No, thanks" with a smile is usually enough. Teach the kids not to accept "free samples" of necklaces or massages.',
    'Repellent and sunscreen: On the islands and at the aviary there are "jejenes" (tiny biting flies). Bring strong repellent and reapply sunscreen every 2 hours; the Caribbean sun does not forgive.',
  ],

  funFact: 'Cartagena\'s walls took almost 200 years to complete. They were built to protect the gold and silver shipped to Spain from attacks by English and French pirates. Today those same walls are the best free lookout in the city.',

  checklist: [
    '🩱 Swimsuit for everyone',
    '🧴 Sunscreen (reapply every 2 hours)',
    '🦟 Insect repellent for jejenes',
    '👟 Sandals and comfortable shoes for cobblestones',
    '🧢 Hat or cap for midday sun',
    '💵 Colombian pesos in cash',
    '🥥 Openness to street coconut water',
    '🎒 A wayuu bag (to take home)',
  ],

  transport: [
    {
      mode: 'Flight',
      description: 'Arrival at Rafael Núñez International Airport (CTG).',
    },
    {
      mode: 'Transfer',
      description: 'The trip to the center is short (15 min). Use official airport taxis or Uber/InDrive, both of which work well. Agree on the price before getting in if it\'s a taxi.',
    },
    {
      mode: 'Weather',
      description: 'Cartagena is humid and hot. The golden rule with kids: outdoor activities from 8:00 to 11:00 and after 16:30. Midday is sacred for the pool or air-conditioned museums.',
    },
  ],
}
