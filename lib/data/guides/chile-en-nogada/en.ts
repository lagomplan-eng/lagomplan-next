import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'chile-en-nogada',
  locale: 'en',

  hero: {
    title: 'The Chile en Nogada Route, Puebla',
    subtitle: 'The only Mexican dish with a built-in expiration date: August and September, when fresh walnuts, native peaches, and pomegranates are all in season at once in Puebla. Chile en nogada exists only when its ingredients do — the argument behind one of the most distinctly Mexican road trips available in September.',
    eyebrow: 'Curated guide · Family with young kids · Food road trip · 4 days · Mid-range budget',
    tags: ['Family', 'Food', 'Road Trip'],
    image: '/images/guides/chile-en-nogada.png',
  },

  itinerary: [
    {
      day: 1,
      title: 'Arrival in Puebla: Historic Center and the first chile',
      items: [
        {
          time: '10:00',
          title: 'Bus from TAPO (Mexico City) to Puebla CAPU',
          description: '',
          tags: [],
        },
        {
          time: '12:30',
          title: 'Arrival and check-in',
          description: 'At Casona de los Sapos, right in the Barrio del Artista',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Lunch at the San Román market',
          description: "The most authentic market in the historic center",
          tags: [],
        },
        {
          time: '16:00',
          title: 'Cathedral and Zócalo with the kids',
          description: '',
          tags: [],
        },
        {
          time: '19:30',
          title: 'Dinner and the trip\'s first chile en nogada',
          description: 'The first night has one job: track down the route\'s first chile en nogada, at La Casona del Carmen or Mural de los Poblanos',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Food tour and Talavera pottery',
      items: [
        {
          time: '09:00',
          title: '5-Hour Extraordinary Culinary Tour',
          description: 'Markets, mole mills, neighborhood fondas, and tastings of cemitas, chalupas, molotes, tamales, and mole poblano',
          tags: [],
        },
        {
          time: '14:30',
          title: 'Post-tour lunch',
          description: '',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Capilla del Rosario and the Sapos quarter',
          description: 'Mexico\'s most exuberant baroque interior, which the kids describe as "the golden church." Visit a Talavera de la Barca pottery workshop, the oldest in the Americas, running since 1824',
          tags: [],
        },
        {
          time: '19:30',
          title: 'Free-choice dinner in the Barrio del Artista',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Atlixco: the Valley of Flowers',
      items: [
        {
          time: '09:00',
          title: 'Drive to Atlixco',
          description: '45 minutes',
          tags: [],
        },
        {
          time: '10:00',
          title: 'Atlixco market and its dahlias',
          description: 'The best flower market in the region. In September, the dahlias and marigolds are at their peak, weeks ahead of Día de Muertos',
          tags: [],
        },
        {
          time: '12:30',
          title: 'Chile en nogada lunch',
          description: 'At a fonda in downtown Atlixco. The local version has its own regional spin: more fruit, less walnut, more pomegranate',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Check-in at Hotel Boutique La Rioja',
          description: '',
          tags: [],
        },
        {
          time: '16:30',
          title: 'Pool time at the hotel',
          description: '',
          tags: [],
        },
        {
          time: '19:30',
          title: 'Dinner at the hotel restaurant or downtown Atlixco',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'Cholula and the drive home',
      items: [
        {
          time: '09:30',
          title: 'Drive from Atlixco to Cholula',
          description: '40 minutes',
          tags: [],
        },
        {
          time: '10:00',
          title: 'Check-in at Casa Eva',
          description: 'If early check-in is available, or drop the bags',
          tags: [],
        },
        {
          time: '10:30',
          title: 'The Great Pyramid of Cholula and archaeological site',
          description: 'The largest pyramid by volume in the world, though not the tallest. A colonial church sits on top, with 8 kilometers of archaeological tunnels inside. For kids 3 and up, the most adventurous stop of the whole trip',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Lunch on the main plaza of San Andrés Cholula',
          description: '',
          tags: [],
        },
        {
          time: '15:30',
          title: 'Pool time at the hotel',
          description: '',
          tags: [],
        },
        {
          time: '18:00',
          title: 'One last chile en nogada dinner to close the loop',
          description: '',
          tags: [],
        },
        {
          time: 'Next day',
          title: 'Drive back to Mexico City on the highway',
          description: '2 hours',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Casona de los Sapos Hotel Boutique',
      type: 'Boutique hotel · Historic Center, Puebla',
      priceTier: '$$',
      description: 'A 19th-century townhouse in the Barrio del Artista, half a block from the Callejón de los Sapos — the most photogenic antiques row in downtown Puebla — and an eight-minute walk from the Zócalo. A terrace with volcano views on clear days, an in-house restaurant serving Pueblan cuisine, and a storied boutique-hotel atmosphere that young kids tend to tolerate better than adults expect. For night one in Puebla: the best address in the historic center at this price point. Estimated price: $1,800–3,200 MXN/night.',
      tag: 'Half a block from the Callejón de los Sapos',
      affiliateUrl: 'https://www.booking.com/hotel/mx/casona-de-los-sapos-boutique.html',
      archetypes: ['Familias'],
    },
    {
      name: 'Hotel Boutique La Rioja',
      type: 'Boutique hotel · Atlixco',
      priceTier: '$$',
      description: 'Affordable luxury boutique lodging in the town of flowers, with an outdoor pool, gardens, and the most consistent volcano-view terrace on the route. Atlixco is Puebla state\'s least-known food destination, and the one with the best chile en nogada recipes outside the capital. For night two: the perfect base for exploring the Atlixco market and its fondas. Estimated price: $1,600–2,800 MXN/night.',
      tag: 'The most consistent volcano-view terrace on the route',
      affiliateUrl: 'https://www.booking.com/hotel/mx/boutique-la-rioja-atlixco.html',
      archetypes: ['Familias'],
    },
    {
      name: 'Casa Eva Hotel Boutique & Spa',
      type: 'Boutique hotel & spa · Cholula',
      priceTier: '$$$',
      description: 'A boutique spa hotel 200 meters from the Great Pyramid, with a heated pool — the single most relevant detail for a family with kids after four days of a food road trip — an in-house restaurant, breakfast included, and a staff that arranges visits to the archaeological site. The family rooms are spacious, giving kids room to move without adults losing their minds. For the last night before heading back to Mexico City. Estimated price: $2,200–3,800 MXN/night.',
      tag: '200 meters from the Great Pyramid, with a heated pool',
      affiliateUrl: 'https://www.booking.com/hotel/mx/casa-eva-boutique.html',
      archetypes: ['Familias'],
    },
  ],

  hotelsDescription: 'Three towns, three scales: Puebla, Atlixco, and Cholula as the road trip\'s base.',

  experiences: [
    {
      name: '5-Hour Extraordinary Culinary Tour',
      description: "Puebla's most complete food tour: the markets where chile en nogada's ingredients are bought, the mole mills, neighborhood fondas, and tastings of cemitas, chalupas, molotes, tamales, and mole poblano. The guide explains why every ingredient in chile en nogada has its own season, and how 17th-century convents invented the dish. For kids 4 and up: the market and the fondas are the most sensory experience Puebla has to offer.",
      tags: ['Markets', 'Tastings', '5 hours'],
      affiliateUrl: 'https://www.getyourguide.com/es-mx/estado-libre-y-soberano-de-puebla-l1470/tour-culinario-extraordinario-por-puebla-t34817/',
    },
    {
      name: 'Puebla Culinary Experience: Cooking Class',
      description: 'A Pueblan cooking class that starts with a local market visit and moves to hands-on preparation of traditional dishes in the workshop kitchen. For the family that wants the kids actively involved — making tortillas, chopping ingredients, tasting as they go — not just watching. Duration: 3–4 hours, ingredients included.',
      tags: ['Cooking class', 'Market visit', 'Families'],
      affiliateUrl: 'https://www.getyourguide.com/puebla-l1471/puebla-culinary-experience-cooking-class-t781637/',
    },
    {
      name: "Val'Quirico, Puebla, and Towns: Food and Culture Tour",
      description: "A route from Mexico City or Puebla through the historic center with food stops that include in-season chile en nogada, cemitas, artisanal pulque, and local mezcal. It also passes through Val'Quirico — the Italian-style village in the middle of Puebla state that kids instantly clock as \"the place from the European movies.\"",
      tags: ["Val'Quirico", 'Chile en nogada', 'Full day'],
      affiliateUrl: 'https://www.getyourguide.com/mexico-city-l194/val-quirico-puebla-mexico-walking-tour-food-and-towns-t855901/',
    },
  ],

  experiencesDescription: 'Mole, pottery, and pyramids: the full food route.',

  tips: [
    "The season: Chile en nogada exists roughly between August 15 and September 15, whenever fresh walnuts are available. After that window, many restaurants keep serving it, but with dried nuts or last season's stock. The difference is obvious to anyone who's had it fresh.",
    "Price as a signal: A chile en nogada made with quality, in-season ingredients costs between $180 and $320 MXN. Anything significantly cheaper is running on last season's walnuts or a boxed nogada sauce.",
    "Kids and the chile: Chile en nogada's sweet-savory filling (fruit, meat, spices) is usually an easy sell for kids 3 and up. The walnut sauce itself is a harder pitch — try a spoonful before serving the full plate. The pomegranate and parsley on top are the most photogenic part, and the part kids most enjoy picking off.",
  ],

  funFact: 'Chile en nogada was created in 1821 by Augustinian nuns at the Convento de la Purísima in Puebla to honor General Agustín de Iturbide as he passed through on his way to Mexico City after Independence was consummated. The dish\'s colors represent the flag of the Army of the Three Guarantees, the precursor to Mexico\'s current flag.',

  checklist: [
    '🌶️ Book a table ahead during peak season (weekends in August and September)',
    "🧥 A light rain jacket for the kids: afternoon showers are common in September",
    '👟 Comfortable shoes for the tunnels under the Great Pyramid of Cholula',
    '🚗 Your own car for the Puebla–Atlixco–Cholula leg: more flexible than the bus',
    '💧 Water and sunscreen for the Atlixco flower market',
    '📸 A camera for the dahlias and marigolds at their peak',
    "🥄 Try the walnut sauce with a spoonful before serving the kids the full plate",
  ],

  transport: [
    {
      mode: 'Bus',
      description: 'ADO buses run from the Terminal de Autobuses de Oriente (TAPO) to Puebla CAPU every 30 minutes, a 2-hour ride, for $250–380 MXN per person. The most efficient option for families with young kids who want to skip Friday-afternoon traffic on the Mexico City–Puebla highway.',
    },
    {
      mode: 'Own car',
      description: 'The Mexico City–Puebla highway (150D) takes about four hours under normal conditions, with a toll of roughly $200 MXN. For the Atlixco and Cholula leg, a car gives you more flexibility than the bus — the distance between the three towns doesn\'t justify a taxi for every stretch.',
      tip: 'The road trip in three legs: Puebla → Atlixco, 45 minutes southwest on the 190D. Atlixco → Cholula, 40 minutes back north. Cholula → Mexico City, 2 hours on the highway.',
    },
    {
      mode: 'Weather',
      description: 'In September: 18–24°C in Puebla and Cholula, at 2,135 meters of altitude. Atlixco runs warmer (24–28°C, at a lower elevation). Afternoon showers are common in September — pack a light rain jacket for the kids and plan outdoor activities before 3pm.',
    },
  ],
}
