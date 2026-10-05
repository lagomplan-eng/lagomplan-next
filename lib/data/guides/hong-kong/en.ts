import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'hong-kong',
  locale: 'en',

  hero: {
    title: 'Hong Kong',
    subtitle: 'The city where breakfast dim sum carries three Michelin stars and the night runs longer than anyone planned. For the trip that mixes a work agenda with the friend group you haven\'t all seen in months: October in Hong Kong means 26°C, clear skies, and the city at its best.',
    eyebrow: 'Curated guide · Business & friends · 5 days · High budget',
    tags: ['Friends', 'Business', 'Food', 'City'],
    image: '/images/guides/hong-kong.png',
  },

  itinerary: [
    {
      day: 1,
      title: 'Arrival and first night in Kowloon',
      items: [
        {
          time: '16:00',
          title: 'Arrival via Airport Express',
          description: 'From HKG to Kowloon Station.',
          tags: [],
        },
        {
          time: '17:30',
          title: 'Check-in',
          description: '',
          tags: [],
        },
        {
          time: '19:30',
          title: 'Tsim Sha Tsui Promenade',
          description: 'A walk along the harbor.',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Symphony of Lights',
          description: 'Free, from the Tsim Sha Tsui Promenade — the best welcome you\'ll get.',
          tags: [],
        },
        {
          time: '21:00',
          title: 'Dinner at a Cantonese restaurant in Tsim Sha Tsui',
          description: 'The first night has exactly one plan: get up to DarkSide at the Rosewood, or any rooftop bar, and see the Hong Kong Island skyline for the first time.',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Victoria Peak and Central',
      items: [
        {
          time: '09:00',
          title: 'Peak Tram + city walk + dim sum tour',
          description: 'Victoria Peak at dawn has the clearest views of the year in October. The historic tram climbing a 45-degree incline is the city\'s single most Hong Kong mode of transport. The tour pairs the Peak with Central — the Man Mo Temple market, the Soho escalators, Hollywood Road — and ends with dim sum at a local go-to restaurant.',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Work meetings in Central, or a free afternoon in Soho',
          description: '',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Dinner at Yat Lok',
          description: 'Michelin-starred roast goose at local prices — HK$100 a plate.',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Kowloon — markets, art, and food',
      items: [
        {
          time: '10:00',
          title: 'The Hong Kong Museum of Art, or Sham Shui Po',
          description: 'Sham Shui Po is Kowloon\'s most local, most photogenic neighborhood.',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Dim sum lunch at Tim Ho Wan',
          description: 'Mong Kok — the first Michelin-starred dim sum spot to keep local prices.',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Harbour City or Temple Street',
          description: '',
          tags: [],
        },
        {
          time: '19:00',
          title: 'Night market and street food tour in Kowloon',
          description: 'Four hours through the night markets and streets of Kowloon with a Hong Kong local: Temple Street Night Market, the Mong Kok alleys, the curry fish ball stalls.',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'Lantau — the Big Buddha and Tai O',
      items: [
        {
          time: '09:00',
          title: 'MTR to Tung Chung Station',
          description: 'A full-day trip to Lantau.',
          tags: [],
        },
        {
          time: '09:30',
          title: 'Ngong Ping 360 cable car',
          description: 'A 30-minute ride over the sea and the hills.',
          tags: [],
        },
        {
          time: '11:00',
          title: 'The Big Buddha and Po Lin Monastery',
          description: "The world's largest outdoor seated bronze Buddha.",
          tags: [],
        },
        {
          time: '13:00',
          title: 'Bus to Tai O',
          description: 'The fishing village built on stilts.',
          tags: [],
        },
        {
          time: '13:30',
          title: 'Lunch in Tai O',
          description: 'Dried shrimp, salted eggs, river crab.',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Bus back and MTR to the hotel',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 5,
      title: 'Wan Chai and the last night',
      items: [
        {
          time: '10:00',
          title: 'Sheung Wan + Cat Street',
          description: "A former traditional-medicine district turned into the city's most active gallery corridor — antiques and design shops.",
          tags: [],
        },
        {
          time: '13:00',
          title: 'Lunch at the Wan Chai Market',
          description: '',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Check-out and bag storage at the hotel',
          description: '',
          tags: [],
        },
        {
          time: '16:00',
          title: 'One last free afternoon',
          description: '',
          tags: [],
        },
        {
          time: '19:30',
          title: 'Star Ferry + Symphony of Lights + night tour',
          description: 'Crossing Victoria Harbour, past the Kowloon wholesale fruit market in full swing and the Kowloon Peak for the last views.',
          tags: [],
        },
        {
          time: '',
          title: 'Transfer to the airport',
          description: 'Timed to your flight.',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'The Murray Hong Kong',
      type: 'Design hotel · Central, Hong Kong Island',
      priceTier: '$$$',
      description: "A 1969 Brutalist government building turned into Central's most elegant design hotel — the financial heart of Hong Kong. A 25th-floor infinity pool with city views, five restaurants and bars including the rooftop Popinjays, and the island's most convenient location: steps from the Peak Tram, the Star Ferry, and Lan Kwai Fong. Every room has floor-to-ceiling windows.",
      tag: 'The right address for business and friends alike',
      affiliateUrl: 'https://www.booking.com/hotel/hk/the-murray-hong-kong.html',
      archetypes: [],
    },
    {
      name: 'Hotel Indigo Hong Kong Island',
      type: 'Boutique hotel · Wan Chai, Hong Kong Island',
      priceTier: '$$$',
      description: "A design-forward boutique hotel in Wan Chai, the island's most eclectic neighborhood, between Central and Causeway Bay. Rooms styled with Hong Kong street-art motifs, a rooftop bar with harbor views, and the perfect base for dining at Wan Chai's best restaurants without needing a taxi between a meeting and a night out.",
      tag: 'More character for less money',
      affiliateUrl: 'https://www.booking.com/hotel/hk/indigo-hong-kong-island.html',
      archetypes: [],
    },
    {
      name: 'Rosewood Hong Kong',
      type: 'Hotel · Tsim Sha Tsui, Kowloon',
      priceTier: '$$$',
      description: "Hong Kong's most visually striking hotel: 65 floors over Victoria Harbour in Kowloon, with the best views of Hong Kong Island available from any hotel in the city. The DarkSide bar on floor 6 has the trip's most photogenic view: the full Hong Kong Island skyline through the window at 11pm.",
      tag: 'The address that says the most with the fewest words',
      affiliateUrl: 'https://www.booking.com/hotel/hk/rosewood-hong-kong.html',
      archetypes: [],
    },
  ],

  hotelsDescription: 'Three options split between Hong Kong Island and Kowloon, each with a different view of the skyline.',

  experiences: [
    {
      name: 'Kowloon: private night market and street food tour',
      description: "Hong Kong's most authentic tour for groups: four hours through the night markets and streets of Kowloon with a Hong Kong local. It passes the Temple Street Night Market, the Mong Kok alleys, the curry fish ball stalls, and the neighborhood dim sum spots that never make a Michelin list but that locals have eaten at every Sunday for as long as anyone can remember.",
      tags: ['Street food', 'Night', 'Kowloon'],
      affiliateUrl: 'https://www.getyourguide.com/hong-kong-l174/kowloon-private-night-markets-street-food-experience-t225462/',
    },
    {
      name: 'Day tour with dim sum',
      description: "Victoria Peak at dawn has the clearest views of the year in October, without summer's haze. The historic tram climbing a 45-degree incline is the city's single most Hong Kong mode of transport. The tour pairs the Peak with Central and ends with dim sum at a local go-to restaurant.",
      tags: ['Peak', 'Dim sum', 'Central'],
      affiliateUrl: 'https://www.getyourguide.com/hong-kong-l174/',
    },
    {
      name: 'Star Ferry, Symphony of Lights, and the wholesale market',
      description: "The Star Ferry crossing Victoria Harbour, the Symphony of Lights at 8pm over the full skyline, Kowloon's wholesale fruit market in full night-time swing, and Kowloon Peak for the final views. The plan for the night the group wants the cinematic version of Hong Kong.",
      tags: ['Star Ferry', 'Night', 'Skyline'],
      affiliateUrl: 'https://www.getyourguide.com/china-l169032/hong-kong-night-adventure-and-foodie-tour-t830029/',
    },
  ],

  tips: [
    "Private kitchens: Hong Kong has a restaurant format with no real equivalent anywhere else — \"private kitchens,\" domestic or semi-private spaces where a chef cooks a fixed, no-menu meal for a group of 6 to 20. Most have no restaurant license and no presence on Google. You book by direct recommendation, weeks ahead, at $100–250 USD per person.",
    "Dim sum at 7am: neighborhood dim sum restaurants open at 7am and fill with elders reading the newspaper and groups of neighbors who've shared the same Sunday table for decades. If your group is up early on the last day: Lin Heung Tea House (Central, open since 1926) or Victoria City Seafood (Wan Chai) is the city's most authentic, least touristy experience.",
    "The Octopus Card: the rechargeable card that works on the metro, buses, trams, taxis, and ferries costs a $12 USD deposit plus $20 USD of credit. It's the first mandatory purchase after you step off the Airport Express.",
  ],

  funFact: "The Star Ferry, running between Hong Kong Island and Kowloon, has operated since 1888 and costs under $0.60 USD in lower class. In 2006, the government proposed scrapping it to expand the harbor, and Hong Kong responded with the city's first mass historic-preservation protests. The Star Ferry is still running. The skyline view from the deck is still the same.",

  checklist: [
    '💳 An Octopus Card as soon as you step off the Airport Express',
    '👔 Light formal wear for meetings + casual clothes for the evenings',
    '👟 Comfortable shoes — you\'ll walk a lot, and climb the Peak',
    '📅 Reservations weeks ahead for the private kitchens',
    '☂️ A compact umbrella, even though October is dry',
    '🥟 An appetite for dim sum at 7am',
  ],

  transport: [
    {
      mode: 'Flight',
      description: "Hong Kong International Airport (HKG), on Lantau Island. The Airport Express reaches Hong Kong Station (in Central) in 24 minutes — the fastest airport-to-city link in Asia. There's also service to Kowloon Station in 20 minutes. Direct flights from Mexico City (via a stop in Los Angeles or Dallas), Madrid, Paris, Dubai, and most Asian hubs.",
    },
    {
      mode: 'Getting around Hong Kong',
      description: "The MTR is the most efficient metro system in Asia — punctual to the second, clean, with total city coverage. The rechargeable Octopus Card works on the metro, buses, trams, and even some supermarkets and taxis. Hong Kong Island's historic double-decker tram costs HK$2.60 a ride and is the city's cheapest, most authentic way to get around.",
    },
    {
      mode: 'Weather',
      description: 'In October: 22-28°C, no significant rain, clear skies. Typhoon season officially ends in September — October brings the best weather of the year in Hong Kong.',
    },
  ],
}
