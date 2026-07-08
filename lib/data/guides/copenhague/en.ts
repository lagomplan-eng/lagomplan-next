import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'copenhague',
  locale: 'en',

  hero: {
    title: 'Copenhagen',
    subtitle: 'The Nordic capital with more Michelin-starred restaurants per square kilometer than any other city in Scandinavia, the most honest party neighborhood in Europe in the Meatpacking District, and a coffee culture that turns breakfast into the first plan of the day. For the group that comes to eat well, drink better, and discover that Copenhagen doesn\'t close before 2am.',
    eyebrow: 'Curated guide · Group of friends · Food & Nightlife · 5 days · Mid-range budget',
    tags: ['Group of friends', 'Food', 'Nightlife'],
    image: '/images/guides/copenhague.jpg',
  },

  itinerary: [
    {
      day: 1,
      title: 'Arrival and canal tour',
      items: [
        {
          time: '14:00',
          title: 'Check-in and rest',
          description: '',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Canal Boat Tour',
          description: '1 hour, from Nyhavn, to get oriented with the city\'s geography.',
          tags: [],
        },
        {
          time: '17:30',
          title: 'Nyhavn and first walk along the harbor',
          description: 'The obligatory postcard of the colorful houses along the canal — it\'s touristy and worth seeing.',
          tags: [],
        },
        {
          time: '19:30',
          title: 'Dinner at Torvehallerne',
          description: 'Nørreport\'s covered market with the best food stalls in the city, no reservation needed.',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Food and Vesterbro',
      items: [
        {
          time: '11:00',
          title: 'Food Tour',
          description: '3 hours through Vesterbro and the Meatpacking District.',
          tags: [],
        },
        {
          time: '14:30',
          title: 'Frederiksberg for post-tour coffee',
          description: 'Free afternoon in the Frederiksberg neighborhood, terraces and independent boutiques.',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Dinner in Kødbyen',
          description: 'Kødbyens Fiskebar for seafood, Mother for Neapolitan pizza, or Bæst for Italian charcuterie.',
          tags: [],
        },
        {
          time: '23:00',
          title: 'The night continues in Kødbyen',
          description: 'The Meatpacking District with restaurants, bars and clubs that open when most of Europe is already asleep.',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Kronborg Castle + Helsingør',
      items: [
        {
          time: '09:30',
          title: 'Train to Helsingør',
          description: '45 minutes from Central Station, €10 EUR.',
          tags: [],
        },
        {
          time: '11:00',
          title: 'Kronborg Castle',
          description: 'Admission €18 EUR. The Elsinore of Hamlet, a UNESCO World Heritage Site, in the historic town of Helsingør.',
          tags: [],
        },
        {
          time: '13:30',
          title: 'Lunch at the Helsingør harbor',
          description: 'Views of the Øresund strait with Sweden in the distance.',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Train back',
          description: '',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Casual dinner in Nørrebro',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'Nørrebro + Christiania + Nightlife',
      items: [
        {
          time: '10:00',
          title: 'Assistens Kirkegård and Nørrebro on foot',
          description: 'The cemetery where Hans Christian Andersen and Søren Kierkegaard are buried, which Danes use as a picnic park without anyone seeing the incongruity.',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Lunch at Reffen Street Food Market',
          description: '',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Christianshavn and Christiania',
          description: 'Canals and Dutch architecture in Christianshavn; Christiania, the anarchist free town within Copenhagen, for whoever wants to explore it.',
          tags: [],
        },
        {
          time: '18:00',
          title: 'Nørrebro Tour',
          description: 'Nørrebro Street Food & Nightlife Tour in the evening.',
          tags: [],
        },
        {
          time: '22:00',
          title: 'The longest night of the trip',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 5,
      title: 'Museums and farewell',
      items: [
        {
          time: '10:00',
          title: 'Train to the Louisiana Museum',
          description: '40 minutes from Copenhagen H station. Admission €18 EUR. Scandinavia\'s most visited art museum, with sculpture by Giacometti and Calder in a garden overlooking the Baltic Sea.',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Return to Copenhagen',
          description: '',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Last-minute shopping downtown',
          description: 'Strøget or Torvehallerne.',
          tags: [],
        },
        {
          time: '',
          title: 'Transfer to the airport',
          description: '',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Coco Hotel',
      type: 'Boutique hotel · Vesterbro',
      priceTier: '$$',
      description: 'Boutique hotel with minimalist Danish design — tall windows, 19th-century ceilings, a palette of blues and neutrals — in the heart of Vesterbro, Copenhagen\'s most active neighborhood for eating and going out. Organic breakfast included, its own bar on the ground floor, and a location that puts the group four minutes on foot from the Meatpacking District (Kødbyen) without anyone having to pay for an Uber back. The hotel that doesn\'t try to be anything other than what it is. Estimated price: €160–280/night for a double room.',
      tag: 'Boutique Danish design in the heart of Vesterbro',
      affiliateUrl: 'http://booking.com/hotel/dk/copenhagen-crown.en-gb.html',
    },
    {
      name: 'Cityhub Copenhagen',
      type: 'Capsule hotel · Vesterbro',
      priceTier: '$$',
      description: 'The Danish take on the Japanese capsule hotel: individual hubs with a double bed, app-controlled lighting and audio, kimonos included, shared spa-level bathrooms, and the Mikkeller Bar in the same building — Copenhagen\'s best craft brewery. Adults-only. For the member of the group who prioritizes price over space and wants the most "Copenhagen" experience of the set. Estimated price: €90–160/night per hub.',
      tag: 'Adults-only capsule hotel with its own brewery',
      affiliateUrl: 'https://www.booking.com/hotel/dk/cityhub-copenhagen.en-gb.html',
    },
    {
      name: 'Hotel Ottilia',
      type: 'Design hotel · Carlsberg City District',
      priceTier: '$$',
      description: 'Design hotel in the former Carlsberg brewery district — the 19th-century factory\'s red-brick buildings converted into residences, restaurants and shops. Rooms with high ceilings, a selection of local craft beers in the minibar, and a location 10 minutes by bike from the Meatpacking District. For the group that wants the reconverted historic-neighborhood atmosphere that Copenhagen has mastered better than any other city in Europe. Estimated price: €140–240/night for a double room.',
      tag: 'Industrial brick reconverted in the Carlsberg district',
      affiliateUrl: 'http://booking.com/hotel/dk/ottilia.es.html',
    },
  ],

  hotelsDescription: 'Vesterbro, no excuses.',

  experiences: [
    {
      name: 'Copenhagen Food Tour — Vesterbro & Meatpacking District',
      description: 'The city\'s most complete food tour: smørrebrød (the rye bread with toppings that is the breakfast of serious Danes), Mikkeller craft beer, stegt flæsk (the crispy pork belly that won the title of Denmark\'s national dish by popular vote), and salty black licorice — the country\'s strangest and most addictive sweet. 3 hours, small groups, guide in English. For the group that wants to understand Danish food before heading out to the restaurants.',
      tags: ['Food', 'Small groups', 'Vesterbro'],
      affiliateUrl: 'https://www.getyourguide.com/copenhague-l12/copenhague-tour-gastronomico-con-mas-de-6-degustaciones-de-clasicos-daneses-t612757/',
    },
    {
      name: 'Copenhagen Canal Boat Tour',
      description: 'Copenhagen\'s canals are the most efficient way to understand the city\'s geography: Nyhavn, the Port of Christianshavn, Henning Larsen\'s Opera House, and the residential waterside neighborhoods in 1 hour. The tour includes a guide and departs every 30 minutes from Nyhavn. For the group that wants the map of the city before getting lost in its neighborhoods: the canal tour first, everything else after.',
      tags: ['Canals', 'Orientation', 'Nyhavn'],
      affiliateUrl: 'https://www.getyourguide.com/copenhague-l12/copenhague-tour-en-barco-por-los-canales-desde-gammel-strand-t37848/',
    },
    {
      name: 'Nørrebro Street Food & Nightlife Experience',
      description: 'Nørrebro is Copenhagen\'s most multicultural neighborhood and the one with the highest density of quality non-Nordic restaurants: Turkish, Ethiopian, Mexican, Arab. The evening tour covers the Reffen Street Food Market (the city\'s largest open-air market), three food stops, and an introduction to the local bar circuit far from the tourist circuit of Nyhavn. 3 hours, groups of max 8 people. The most interesting night plan of the five days.',
      tags: ['Street food', 'Nightlife', 'Nørrebro'],
      affiliateUrl: 'https://www.getyourguide.com/en-gb/copenhagen-l12/copenhagen-s-a-taste-of-denmark-tasting-tour-t21977/',
    },
  ],

  experiencesDescription: 'Markets, canals, and smørrebrød.',

  tips: [
    'Danish prices are real: Copenhagen is expensive. A bar beer costs €7–10 EUR, a restaurant lunch €20–35 EUR, a dinner with wine €50–80 EUR per person. The group that knows this in advance and budgets well has no surprises. The one that arrives unaware spends all five days in shock.',
    'The hygge of the supermarkets: The Danish Netto or Aldi supermarket has local cheeses, rye bread, marinated herring, and bottled Mikkeller beers at supermarket prices. For hostel breakfast or a picnic by the canal, it\'s the most hygge and cheapest version of the trip.',
    'The Reffen: The Reffen Street Food Market in Copenhagen\'s harbor, open from May to October, has 80 stalls with cuisines from around the world, terraces over the water, and live music on weekends. For the group that wants the most varied and most photogenic lunch in the city: Reffen beats any restaurant in terms of collective experience.',
  ],

  funFact: 'Copenhagen was the first city in the world to have an Ombudsman — a public advocate — in 1809. It was also the first to declare itself a "carbon-neutral city" with a concrete date (2025, though the target was pushed back to 2030). Bicycles, sustainable design, and human-scale urban planning aren\'t a trend here — they\'ve been municipal policy for decades. 62% of Copenhageners commute to work by bike regardless of the weather.',

  checklist: [
    '🚲 Comfortable clothes and shoes for biking and long walks — they cover 95% of the itinerary',
    '🧥 A light layer for the evenings — the Atlantic always cools things down',
    '💳 Extra budget for Danish prices (beer €7–10, dinner with wine €50–80 per person)',
    '💶 Cash or card to rent a bike (€10–15/day)',
    '🩱 Swimsuit for the harbor bath',
    '🎫 Budget for the 24-hour City Pass (€12) on the first day',
    '🕶️ Sunglasses — the sun doesn\'t set until 10pm in July',
    '🧺 Reusable bag for a supermarket picnic (Netto or Aldi)',
  ],

  transport: [
    {
      mode: 'Flight',
      description: 'Copenhagen Airport (CPH), 12 km from downtown. Direct M2 metro to the center in 15 minutes (€3 EUR). Direct flights from Madrid, Barcelona, Rome, London, Frankfurt, and Amsterdam. From Mexico or Latin America: connection through any European hub (Iberia via Madrid, Lufthansa via Frankfurt, British Airways via London).',
    },
    {
      mode: 'Getting around the city',
      description: 'The combination of bike + metro + walking covers 95% of the five-day program. Copenhagen has 400 km of bike lanes, and most hostels and hotels rent bikes for €10–15 EUR/day. The 24-hour City Pass covers metro, buses, and regional trains for €12 EUR — useful for the first day of orientation. Uber exists but nobody uses it.',
    },
    {
      mode: 'Weather in July',
      description: 'Days of 20–25°C, nights of 14–17°C. The best month of the year for Copenhagen: the sun doesn\'t set until 10pm in July, Danes bring their tables out onto the street, and the harbor bath runs at full capacity. Bring a layer for the evenings — the Atlantic always cools things down.',
    },
  ],
}
