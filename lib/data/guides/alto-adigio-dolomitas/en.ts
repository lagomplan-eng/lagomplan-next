import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'alto-adigio-dolomitas',
  locale: 'en',

  hero: {
    title: 'South Tyrol, Italy',
    subtitle: 'The Italian region that generates more than 60% of its energy from renewable sources, well above the national average of 20%. The Dolomites have been a UNESCO World Heritage Site since 2009. For the family that wants Europe\'s most photogenic mountains, with kids young enough that the world\'s bluest lake leaves them speechless.',
    eyebrow: 'Curated guide · Family with young kids · UNESCO nature · 4 days · Mid-range budget',
    tags: ['Family', 'Young kids', 'Nature'],
    image: '/images/guides/alto-adigio-dolomitas.jpg',
  },

  itinerary: [
    {
      day: 1,
      title: 'Arrival in San Candido',
      items: [
        {
          time: '14:00',
          title: 'Check-in at your chosen hotel',
          description: '',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Walk through downtown San Candido (Innichen)',
          description: '12th-century collegiate church, a regional-favorite gelateria, and the valley\'s best local cheese market',
          tags: [],
        },
        {
          time: '17:30',
          title: 'Lake Dobbiaco',
          description: 'The most accessible lake in the Dolomites, 5 minutes by car, flat 3km trail, water that reaches 18°C in August',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Dinner at the hotel restaurant or a Gasthof downtown',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Lake Braies',
      items: [
        {
          time: '06:30',
          title: 'Depart for Lake Braies',
          description: '25-minute drive',
          tags: [],
        },
        {
          time: '07:30',
          title: 'Arrival at the lake with the first light',
          description: '',
          tags: [],
        },
        {
          time: '07:30',
          title: 'Morning tour, rowboat included',
          description: 'Before 10am, when the lake fills up with people',
          tags: [],
        },
        {
          time: '10:00',
          title: 'Return to the hotel',
          description: '',
          tags: [],
        },
        {
          time: '11:00',
          title: 'Pool, family spa, downtime',
          description: 'Free afternoon',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Dinner at the hotel or a local restaurant',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Tre Cime di Lavaredo',
      items: [
        {
          time: '08:30',
          title: 'Breakfast and departure',
          description: 'Pack a snack for the car — kids need fuel before the parking lot',
          tags: [],
        },
        {
          time: '09:30',
          title: 'Arrival at the Auronzo parking lot',
          description: '€30 parking, alternative shuttle available',
          tags: [],
        },
        {
          time: '10:00',
          title: 'Start the guided loop trail',
          description: '10km flat, 3 hours. The guide is worth it more for the geological context — why the Dolomites are coral limestone from a Triassic sea, not granite — than for navigation',
          tags: [],
        },
        {
          time: '13:30',
          title: 'Lunch at Rifugio Auronzo',
          description: 'Pasta and polenta at 2,320 meters',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Return to the parking lot',
          description: '',
          tags: [],
        },
        {
          time: '16:30',
          title: 'Return to the hotel',
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
      day: 4,
      title: 'Alpe di Siusi and farewell',
      items: [
        {
          time: '08:30',
          title: 'Breakfast and departure toward Ortisei',
          description: '',
          tags: [],
        },
        {
          time: '10:00',
          title: 'Cable car up to Alpe di Siusi',
          description: '',
          tags: [],
        },
        {
          time: '10:30',
          title: 'Family walk across the alpine meadow',
          description: '56 square kilometers of meadow with the Sassolungo and Sassopiatto peaks behind it, rifugio for lunch',
          tags: [],
        },
        {
          time: '14:30',
          title: 'Cable car back down',
          description: '',
          tags: [],
        },
        {
          time: '15:30',
          title: 'Drive to Innsbruck airport',
          description: '1.5 hours, or continue your trip',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Naturhotel Leitlhof',
      type: 'Eco-boutique hotel · San Candido',
      priceTier: '$$',
      description: 'South Tyrol\'s most awarded eco-boutique hotel: certified under the South Tyrol sustainability seal, with the region\'s highest score on renewable energy, waste management, and local sourcing criteria. 37 rooms with local maple wood on walls and floors, a spa with a fir-wood sauna, a heated indoor pool, and an in-house breakfast with cheeses and cured meats from the valley. A 5-minute drive from Lake Dobbiaco, the most accessible lake in the Dolomites, and 20 minutes from Lake Braies. The staff recommends trails by age and activity level with the precision of people who\'ve walked them all themselves. Estimated price: €180–320/night, family room.',
      tag: 'Certified sustainability, 5 min from Lake Dobbiaco',
      affiliateUrl: 'https://www.booking.com/hotel/it/panorama-leitlhof.html',
      archetypes: ['Familias'],
    },
    {
      name: 'Hotel Cavallino Bianco',
      type: 'Family hotel · San Candido',
      priceTier: '$$',
      description: 'The Dolomites\' most awarded family hotel for kids\' entertainment: indoor pool with waterslide, cinema, bowling alley, game room, kids\' club with certified childcare, and a nutritionist-designed kids\' menu. For the family that wants the kids to have their own plan while the parents eat a slow meal on the mountain-view terrace. The restaurant has a South Tyrol wine list and a tasting menu for the adults. Estimated price: €200–350/night, family room.',
      tag: 'The most complete kids\' entertainment program',
      affiliateUrl: 'https://www.booking.com/hotel/it/cavallino-bianco-san-candido.html',
      archetypes: ['Familias'],
    },
    {
      name: 'Sonnwies Family Resort',
      type: 'Organic-farm resort · Lüsen',
      priceTier: '$$',
      description: 'A family resort with its own organic farm: over 30 animals, an active vegetable garden, and farm produce at every meal. Set in a small mountain village 12 kilometers from Bressanone, with 300 sunny days a year and direct views of the UNESCO Dolomites. 70 weekly hours of childcare, 5 pools including a splash zone for the youngest kids, and the most genuinely alpine-farm atmosphere in South Tyrol. For the family that wants the kids to learn where milk comes from while the adults go hiking. Estimated price: €220–380/night, family room (half board included).',
      tag: 'Own organic farm and 70h/week of childcare',
      affiliateUrl: 'https://www.sonnwies.com/en/family-hotel',
      archetypes: ['Familias'],
    },
  ],

  hotelsDescription: 'San Candido as a base, with an optional farm night in Lüsen if the itinerary stretches longer.',

  experiences: [
    {
      name: 'Lake Braies Early Morning Tour',
      description: 'The most photographed lake in the Dolomites — impossible turquoise water ringed by vertical dolomite rock walls — has one problem: by 10am in August, it\'s busier than a shopping street. The solution is the usual one: get there before everyone else. An early departure from the San Candido area gets you to the lake with the first light, mountains reflected in the water with not a single kayak and no one else on the trail. For kids of any age: the rowboat on the lake costs €10 and is the most-remembered part of the four days.',
      tags: ['Lake Braies', 'Early morning', 'Rowboat'],
      affiliateUrl: 'https://www.getyourguide.com/urtijei-l102963/lago-di-braies-tour-a-day-tour-to-the-magic-lago-di-braies-t947430/',
    },
    {
      name: 'Tre Cime di Lavaredo Guided Family Hike',
      description: 'The Tre Cime di Lavaredo are the most recognizable rock formations in the Alps and the visual symbol of the Dolomites. The loop trail at the base of the three spires (2,999 meters) is flat and accessible — 10 kilometers with no significant elevation gain — and the route is so well marked that the guide earns their keep more through geological context than navigation. For kids age 4 and up with an all-terrain stroller or baby carrier: the first hour from the parking lot is fully accessible.',
      tags: ['Tre Cime', 'Loop trail', 'Kid-friendly'],
      affiliateUrl: 'https://www.getyourguide.com/auronzo-l213997/misurinadolomites-tour-of-the-tre-cime-di-lavaredo-t1275876/',
    },
    {
      name: 'Dolomites Cable Car & Family Alpine Meadow Experience',
      description: 'Alpe di Siusi (Seiser Alm) is the largest high-alpine meadow in Europe: 56 square kilometers of green grass above the Dolomites, reachable by cable car from Ortisei in Val Gardena. In August it has seasonal wildflowers, cowbells, and 1,800-meter-altitude air that has toddlers asleep in the stroller within 20 minutes. Family tour with cable car included and lunch at a rifugio.',
      tags: ['Alpe di Siusi', 'Cable car', 'Alpine meadow'],
      affiliateUrl: 'https://www.getyourguide.com/alpe-di-siusi-l96607/',
    },
  ],

  experiencesDescription: 'Turquoise lakes, rock spires, and the largest alpine meadow in Europe.',

  tips: [
    'Lake Braies parking: In August, private car access to the lake is restricted starting at 9am — you\'ll need the shuttle from the Ponticello parking lot (~€5/person). The only way to drive up before the restriction is to arrive before 9am. The morning tour solves this with included transport that departs ahead of the cutoff.',
    'Afternoon storms: the Dolomites get summer afternoon thunderstorms with a punctuality the locals trust more than the forecast. The standard rule: high-altitude activities before 2pm, valley shelter after. Mountain rifugios serve pasta and polenta — the most satisfying lunch available at 2,500 meters.',
    'South Tyrolean breakfast: hotels in the region serve Italy\'s most generous breakfasts — Graukäse cheese, Speck (mountain-cured ham), farm yogurt, rye bread, and local blueberry jam. The breakfast table at a Naturhotel with Dolomites views at sunrise is reason enough to get up early.',
  ],

  funFact: 'South Tyrol gets more than 60% of its energy from renewable sources, far above Italy\'s national average of 20%, thanks to nearly 1,000 small private hydroelectric plants. In 2023, South Tyrol launched its own tourism sustainability seal — the first of its kind by region in Italy — certifying 141 properties across three tiers of criteria covering energy, water, local gastronomy, and waste management.',

  checklist: [
    '🧥 Waterproof jacket for the afternoon storms',
    '🚼 All-terrain stroller or baby carrier for the Tre Cime trail',
    '🩱 Swimsuit for Lake Dobbiaco and the hotel pools',
    '💶 Cash for the Braies shuttle (~€5/person) and Auronzo parking (€30)',
    '🥾 Comfortable walking shoes for the 10km flat Tre Cime loop',
    '🧢 Sun protection — high-altitude sun on the meadows is strong even in cool weather',
  ],

  transport: [
    {
      mode: 'Flight',
      description: 'Bolzano Airport (BZO) — small, domestic flights from Rome only. Better-connected alternatives: Innsbruck Airport (INN, Austria, 1.5h drive from San Candido) with connections across Europe, or Venice (VCE, 2.5h drive) with flights from Mexico and Latin America via a connection in Madrid, Frankfurt, or Amsterdam. The train from Munich to San Candido takes 3.5 hours — the most sustainable option for families arriving from Central Europe.',
    },
    {
      mode: 'Getting around the region',
      description: 'A rental car from Bolzano or Innsbruck is the most flexible option with young kids. Alternative: South Tyrol has a bus network connecting every town, and many hotels run shuttles to the trailheads.',
      tip: 'Lake Braies has limited car access in August — mandatory shuttle from the Ponticello parking lot starting at 9am.',
    },
    {
      mode: 'August weather',
      description: 'Days of 22–28°C in the valley, 15–20°C at altitude. Afternoon storms are common in the Dolomites in August — the right plan is physical activities before 2pm, then spa, pool, or a village visit after. Morning sun on the dolomite rock produces Europe\'s most photogenic pink light.',
    },
  ],
}
