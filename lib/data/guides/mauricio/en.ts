import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'mauricio',
  locale: 'en',

  hero: {
    title: 'Mauritius',
    subtitle: 'A 65-kilometer-long island in the middle of the Indian Ocean, with white-sand beaches, dolphins less than a kilometer from shore, and a waterfall pouring over seven-colored earth. For the family with young kids who wants adventure without impossible logistics.',
    eyebrow: 'Curated guide · Family with young kids · Adventure · 8 days · Mid-range budget',
    tags: ['Family', 'Beach', 'Adventure', 'Nature'],
    image: '/images/guides/mauricio.png',
  },

  itinerary: [
    {
      day: 1,
      title: 'Arrival and first dip',
      items: [
        {
          time: '09:00',
          title: 'Arrival at MRU airport and transfer',
          description: 'An overnight flight, arriving first thing.',
          tags: [],
        },
        {
          time: '12:00',
          title: 'Check-in',
          description: '',
          tags: [],
        },
        {
          time: '14:00',
          title: 'First beach or pool time',
          description: 'The first afternoon is for settling in.',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Dinner at the hotel',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Beach day and getting your bearings',
      items: [
        {
          time: '09:00',
          title: 'Buffet breakfast',
          description: 'The itinerary\'s quietest day: no organized excursion.',
          tags: [],
        },
        {
          time: '10:00',
          title: 'Beach, kayak, snorkel from the resort',
          description: 'Until 17:00. The 25°C water and white sand fix a jet-lagged body clock without needing an agenda.',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Dinner',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Catamaran — West Coast (dolphins and Crystal Rock)',
      items: [
        {
          time: '08:30',
          title: 'Hotel pickup',
          description: "The week's most important excursion.",
          tags: [],
        },
        {
          time: '09:00',
          title: 'Catamaran cruise',
          description: 'Until 15:30. Dolphins, snorkeling, BBQ, beach. The route passes Crystal Rock, Île aux Bénitiers, and the Le Morne bays, where dolphins show up before noon.',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Back to the hotel',
          description: '',
          tags: [],
        },
        {
          time: '20:00',
          title: 'A light dinner',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'Chamarel — the land of seven colors',
      items: [
        {
          time: '09:00',
          title: 'Drive out to Chamarel',
          description: '40 minutes from the resort.',
          tags: [],
        },
        {
          time: '10:00',
          title: 'Chamarel Waterfall',
          description: "A 15-minute trail, kid-friendly. The island's tallest waterfall, at 100 meters.",
          tags: [],
        },
        {
          time: '11:30',
          title: 'Seven Coloured Earths',
          description: "Entry: €5/adult. Volcanic-earth dunes in seven natural colors — red, brown, violet, green, blue, purple, and yellow.",
          tags: [],
        },
        {
          time: '13:30',
          title: 'Lunch at a restaurant in the area',
          description: '',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Domaine de Chamarel',
          description: "Rum tasting for adults, cane juice for kids — Mauritius's most-visited distillery.",
          tags: [],
        },
        {
          time: '18:00',
          title: 'Back to the hotel',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 5,
      title: 'Catamaran — Southeast Coast (5 islands)',
      items: [
        {
          time: '08:30',
          title: 'Hotel pickup',
          description: 'Transfer included.',
          tags: [],
        },
        {
          time: '09:00',
          title: '5-islands cruise',
          description: 'Until 15:30. Snorkeling, possible dolphins, BBQ, beach. Five islands off the southeast coast with emerald-colored water and the most diverse coral reef on the island.',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Return',
          description: '',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Dinner',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 6,
      title: 'Île aux Cerfs and the east side',
      items: [
        {
          time: '08:30',
          title: 'Drive out to Grand Bassin',
          description: '',
          tags: [],
        },
        {
          time: '10:00',
          title: 'Grand Bassin',
          description: 'The sacred crater lake at 1,800 meters, where Mauritian Hindus make the Maha Shivaratri pilgrimage.',
          tags: [],
        },
        {
          time: '12:00',
          title: 'Drive to Trou d\'Eau Douce',
          description: '',
          tags: [],
        },
        {
          time: '12:30',
          title: 'Boat to Île aux Cerfs',
          description: '10 minutes.',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Île aux Cerfs beach',
          description: 'Until 17:00. The bluest water in Mauritius and fine white sand with no coral rock — the most accessible beach for young kids on the whole island.',
          tags: [],
        },
        {
          time: '18:00',
          title: 'Drive back to the hotel',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 7,
      title: 'Dolphin watching and a free beach day',
      items: [
        {
          time: '07:30',
          title: 'Depart for the dolphin-watching excursion',
          description: '',
          tags: [],
        },
        {
          time: '11:30',
          title: 'Back to the hotel',
          description: '',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Free beach time, adult spa, resort activities',
          description: 'Until 18:00.',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Farewell dinner',
          description: "The trip's longest dinner, saved for the last night.",
          tags: [],
        },
      ],
    },
    {
      day: 8,
      title: 'Last morning and the airport',
      items: [
        {
          time: '09:00',
          title: 'Breakfast',
          description: 'A long, unhurried one.',
          tags: [],
        },
        {
          time: '10:00',
          title: 'One last morning on the beach',
          description: '',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Transfer to MRU airport',
          description: '1.5 hours from the west coast.',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Sands Suites Resort & Spa',
      type: 'Family resort · Flic-en-Flac Beach',
      priceTier: '$$$',
      description: "The most complete family resort on the west coast — the side with the best dolphins and the best sunsets. On Tamarin Bay lagoon, with free water sports included (kayak, snorkel, paddleboard), a spa, a gym, two tennis courts, and staff reviewers describe as \"extraordinarily helpful.\" The buffet breakfast, with tropical fruit, local curries, and vegetarian options, settles the day's first debate for kids of any age.",
      tag: 'All-inclusive except boredom',
      affiliateUrl: '',
      archetypes: ['Familias'],
    },
    {
      name: 'La Pirogue Mauritius',
      type: 'Classic resort · Flic-en-Flac Beach',
      priceTier: '$$$',
      description: "A historic west-coast resort set in wide tropical gardens right on the beach. Villas and bungalows wrap around several pools in a space large enough for kids to run without constant supervision. A water-sports center, a kids' club, and the Sugar Mill restaurant turn dinner into an adults' plan while the kids have their own space.",
      tag: 'More breathing room between guests',
      affiliateUrl: '',
      archetypes: ['Familias'],
    },
    {
      name: 'C Mauritius',
      type: 'Boutique resort · Belle Mare, East Coast',
      priceTier: '$$$',
      description: "A boutique resort in Belle Mare — the island's calmest beach, on the east coast — with an infinity pool, direct access to Palmar Beach, and the quietest atmosphere of the three options. Rooms are spacious, breakfast is the best of the three, and the beach is the most photogenic on the island. Trade-off: the dolphins and the catamaran are a 1.5-hour transfer away.",
      tag: 'East-coast calm',
      affiliateUrl: '',
      archetypes: ['Familias'],
    },
  ],

  hotelsDescription: 'Three seaside bases — two on the busier west coast, one on the quieter east.',

  experiences: [
    {
      name: 'Catamaran cruise, West Coast, with dolphins, snorkeling, and beach',
      description: 'The west-coast route takes in Crystal Rock — the coral formation rising dramatically out of the turquoise lagoon — plus Île aux Bénitiers, a white-sand island with flat water perfect for young kids. Onboard BBQ, drinks included, and a chance to swim alongside spinner dolphins in the Le Morne bays.',
      tags: ['Dolphins', 'Catamaran', 'Family'],
      affiliateUrl: '',
    },
    {
      name: 'Full-day tour: Chamarel, seven colors, and southwest waterfalls',
      description: "Volcanic earth in seven natural colors, the Trou aux Cerfs volcano, the sacred Grand Bassin lake with wild monkeys nearby, the Chamarel waterfalls, and a rum distillery. For kids: the colored dunes and the park's giant tortoises are the highlight. For adults: Chamarel rum, with a tasting included.",
      tags: ['Nature', 'Chamarel', 'Family'],
      affiliateUrl: '',
    },
    {
      name: 'Quad-bike tour through southern Mauritius',
      description: "Sugar cane fields, the Gris Gris coast, the La Roche qui Pleure cliffs, and a stop to swim at a quiet, tourist-free beach — all by quad bike along the roads of the island's south. Best suited to kids 8 and up; for younger ones, check with the operator about passenger-seat options.",
      tags: ['Quad bike', 'Adventure', 'South coast'],
      affiliateUrl: '',
    },
  ],

  tips: [
    "Dolphins in the morning: Tamarin Bay's dolphins mostly show up between 7 and 11am, before midday boat traffic pushes them back out to sea. Excursions leaving before 8am have the best real odds of an encounter.",
    "Sun protection: the Indian Ocean sun at 10am in October is noticeably stronger than the Mediterranean's. SPF 50 on kids, applied before breakfast — not once you're already at the beach. Sunscreen loses effectiveness in the water in under an hour.",
    "Mauritian food: the island mixes Indian, African, Chinese, and French influences at the same table. Dholl puri (a lentil flatbread filled with curry) is the national street food and the cheapest, most satisfying breakfast around ($0.50 USD at any roadside stall). For kids: tomato rougaille with white rice.",
  ],

  funFact: 'Mauritius had no human inhabitants until the 16th century — one of the last major islands in the world to be settled. The dodo, the giant flightless bird that went extinct in 1681, is endemic to Mauritius and the island\'s national symbol. The Natural History Museum in Port Louis holds the most complete dodo skeleton in existence. Kids recognize it instantly from Alice in Wonderland.',

  checklist: [
    '🩱 Swimsuits for everyone',
    '🧴 SPF 50 sunscreen, applied before you get to the beach',
    '🦺 Your own life jackets for young kids, if you can bring them',
    '👟 Sandals for the beach and the quad tour',
    '💵 Mauritian rupees in cash for street-side dholl puri',
    '🚗 An international driving permit if you\'re renting a car',
  ],

  transport: [
    {
      mode: 'Flight',
      description: "Sir Seewoosagur Ramgoolam International Airport (MRU), in the southeast of the island. Direct flights from Paris (Air France, Air Mauritius, 11 hours), London (British Airways, 12 hours), Dubai (Emirates, 4.5 hours), and Nairobi (Kenya Airways, 4 hours). From Mexico or Latin America: connect via Dubai, Paris, or Johannesburg. It's a 1.5-hour drive from the airport to Flic-en-Flac on the west coast.",
    },
    {
      mode: 'Getting around the island',
      description: 'A rental car (~$30–50 USD/day) is the most flexible option for families. Driving is on the left (British legacy). Taxis are available but negotiate the fare beforehand. For catamaran excursions, hotel transfer is included in most tours.',
    },
    {
      mode: 'Weather',
      description: 'In October: 24-28°C, sea at 24-25°C. The last month of the dry season before November\'s rains arrive. Sunny, low humidity, calm seas. Cyclone season starts in November-December.',
    },
  ],
}
