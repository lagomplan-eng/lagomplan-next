import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'napa-sonoma',
  locale: 'en',

  hero: {
    title: 'Napa Valley & Sonoma, California',
    subtitle: 'The world\'s first wine region with a sustainability certification program. Five days built around drinking well, cycling through organic vineyards, and discovering that regenerative viticulture isn\'t a trend — it\'s the reason this valley still produces North America\'s best wines.',
    eyebrow: 'Curated guide · Couple · Regenerative Wine · 5 days · Mid-range budget',
    tags: ['Couple', 'Wine', 'Sustainability'],
    image: '/images/guides/napa-sonoma.jpg',
  },

  itinerary: [
    {
      day: 1,
      title: 'Arrival in Yountville',
      items: [
        {
          time: '14:00',
          title: 'Check-in at Bardessono',
          description: '',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Walk through Yountville',
          description: 'Washington Street, boutiques, galleries',
          tags: [],
        },
        {
          time: '18:30',
          title: 'Welcome glass in the hotel garden',
          description: '',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Dinner at Lucy Restaurant',
          description: 'Inside Bardessono, Californian cuisine with ingredients from the hotel\'s own garden',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Vine Trail by bike',
      items: [
        {
          time: '08:30',
          title: 'Breakfast at the hotel',
          description: '',
          tags: [],
        },
        {
          time: '09:30',
          title: 'Depart by bike along the Vine Trail toward Rutherford',
          description: '',
          tags: [],
        },
        {
          time: '12:00',
          title: 'Tasting at Frog\'s Leap Winery',
          description: 'Book ahead. Dry-farmed, no irrigation, solar-powered since 1994',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Lunch in Rutherford or a picnic among the vines',
          description: '',
          tags: [],
        },
        {
          time: '16:30',
          title: 'Ride back to Yountville',
          description: '',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Free dinner in Yountville',
          description: 'Bouchon Bistro for a second taste of Thomas Keller',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Benziger and the move to Sonoma',
      items: [
        {
          time: '09:00',
          title: 'Depart Yountville toward Glen Ellen',
          description: '',
          tags: [],
        },
        {
          time: '10:30',
          title: 'Biodynamic tour at Benziger Family Winery',
          description: 'Tractor tour, reservation required',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Lunch in Glen Ellen or en route to Healdsburg',
          description: '',
          tags: [],
        },
        {
          time: '15:30',
          title: 'Check-in at H2Hotel',
          description: '',
          tags: [],
        },
        {
          time: '17:30',
          title: 'First walk around Healdsburg Plaza',
          description: '',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Dinner at Spoonbar',
          description: 'The hotel\'s restaurant',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'A food-and-wine day in Healdsburg',
      items: [
        {
          time: '10:00',
          title: 'Breakfast at the hotel or Healdsburg Bar & Grill',
          description: '',
          tags: [],
        },
        {
          time: '11:00',
          title: 'Tasting rooms on the plaza',
          description: 'Locals Tasting Room or Banshee Wines to start. Over 30 tasting rooms within a 10-minute walk',
          tags: [],
        },
        {
          time: '13:30',
          title: 'Lunch at Bravas Bar de Tapas',
          description: 'The best kitchen downtown',
          tags: [],
        },
        {
          time: '15:30',
          title: 'Free afternoon',
          description: 'Hotel spa, pool, reading',
          tags: [],
        },
        {
          time: '19:00',
          title: 'Farm-to-Table Dinner at a winery',
          description: 'Book ahead',
          tags: [],
        },
      ],
    },
    {
      day: 5,
      title: 'A coastal farewell',
      items: [
        {
          time: '09:00',
          title: 'Long breakfast at H2Hotel',
          description: '',
          tags: [],
        },
        {
          time: '11:00',
          title: 'Depart for the coast via Route 116',
          description: '',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Lunch in Bodega Bay',
          description: 'Pacific seafood',
          tags: [],
        },
        {
          time: '15:30',
          title: 'Point Reyes National Seashore',
          description: 'The trip\'s first view of the Pacific',
          tags: [],
        },
        {
          time: '18:00',
          title: 'Arrival in San Francisco or SFO airport',
          description: 'Route along Highway 1, passing Bodega Bay, Point Reyes, and the Marin coast before crossing the Golden Gate',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Bardessono Hotel & Spa',
      type: 'LEED Platinum hotel · Yountville, Napa Valley',
      priceTier: '$$$',
      description: 'California\'s only LEED Platinum hotel, and one of just 14 in the world with that certification. 190 rooftop solar panels, 72 geothermal wells drilled 90 meters deep for heating and cooling, reclaimed vineyard-walnut wood as room flooring, and a restaurant that grows its own ingredients in the hotel garden. The 62 suites have a private terrace, a jetted tub, and in-room spa service. Five minutes on foot from Thomas Keller\'s French Laundry. Winner of two Michelin Keys in 2025. Estimated price: $550–950 USD/night.',
      tag: 'LEED Platinum, 190 solar panels',
      affiliateUrl: 'https://www.booking.com/hotel/us/bardessono.html',
      archetypes: ['Parejas'],
    },
    {
      name: 'H2Hotel',
      type: 'Eco-boutique hotel · Healdsburg, Sonoma',
      priceTier: '$$',
      description: 'The reference eco-boutique hotel in the heart of Healdsburg, Sonoma\'s most food-driven town. Organic materials, bamboo flooring, certified linens, and a courtyard pool surrounded by gardens that supply the Spoonbar restaurant. Walking access to Healdsburg\'s central plaza and over 30 tasting rooms within a 10-minute walk. The option that combines design, sustainability, and location without trying too hard. Estimated price: $280–450 USD/night.',
      tag: 'LEED-certified, solar-heated courtyard pool',
      affiliateUrl: 'https://www.booking.com/hotel/us/healdsburg-219-healdsburg-avenue.html',
      archetypes: ['Parejas'],
    },
    {
      name: 'River Terrace Inn',
      type: 'Hotel · Napa',
      priceTier: '$$',
      description: 'Alongside the Oxbow Preserve and the Napa River, with EV chargers, reusable-water stations on every floor, an active recycling and composting program, and rooms that open directly onto the Vine Trail bike path. Rooftop bar with river views for sunset. The most practical base for the trip if the couple arrives from the Bay Area in an electric car — the hotel has 10 Level 2 charging stations. Estimated price: $320–500 USD/night.',
      tag: '10 EV chargers on-site, right on the Vine Trail',
      affiliateUrl: 'https://www.booking.com/hotel/us/river-terrace-inn.html',
      archetypes: ['Parejas'],
    },
  ],

  hotelsDescription: 'Yountville and Healdsburg as bases, each hotel with its own sustainability certification or practice.',

  experiences: [
    {
      name: 'Napa Valley: Guided Bike Tour through Sustainable Vineyards',
      description: 'The Napa Valley Vine Trail connects downtown Napa with Yountville and St. Helena over 47 kilometers of paved, traffic-free path. The full-day guided tour passes through three Napa Green-certified vineyards with tasting stops, explains the difference between conventional, organic, and biodynamic viticulture, and ends with a seasonal lunch at a working winery. For the couple who wants to understand what they\'re drinking before ordering the next glass.',
      tags: ['Vine Trail', 'Napa Green', 'Full day'],
      affiliateUrl: 'https://www.getyourguide.com/yountville-l145323/napa-valley-guided-e-bike-tour-with-winery-visits-t1146315/',
    },
    {
      name: 'Sonoma: Explore Natural Wineries with a Local Sommelier',
      description: 'A 6-hour tour with a local sommelier to two independent, family-run natural-wine producers in Sonoma, with tastings included and an introduction to sustainable viticulture practices. The closest thing to the biodynamic spirit.',
      tags: ['Natural wine', 'Sommelier', 'Sonoma'],
      affiliateUrl: 'https://www.getyourguide.com/sonoma-l2495/sonoma-explore-natural-wineries-with-a-local-sommeliere-t592711/',
    },
    {
      name: 'Farm-to-Table Dinner & Winery Experience in Napa',
      description: 'A private dinner at a working winery with a resident chef: ingredients from the estate garden, a wine pairing from that same harvest, and a table under the vines at sunset. A winery tour is included before dinner. The most memorable night of the five days — the one that outclasses any Michelin-starred restaurant on context alone.',
      tags: ['Farm-to-table', 'Private dinner', 'Winery'],
      affiliateUrl: 'https://www.getyourguide.com/s/?q=Farm%20to%20Table%20Dinner%20Winery%20Napa',
    },
  ],

  experiencesDescription: 'Regenerative viticulture, biking through vineyards, and an unforgettable winery dinner.',

  tips: [
    'Napa Green: Napa Valley\'s sustainability certification verifies soil-to-bottle practices — water quality, biodiversity, waste management, and renewable energy. Not every Napa wine carries this certification, so look for the seal on the bottle or ask directly. Napa Green-certified wineries include that context in their tastings.',
    'Book ahead: In August, Napa\'s most in-demand wineries (Opus One, Far Niente, Harlan) book up months in advance. Frog\'s Leap and Benziger have more availability, but still book at least a week out.',
    'Healdsburg\'s Dry Creek Valley: California\'s least-known valley, and the one with the world\'s best zinfandels — a varietal that found its terroir here 150 years ago. For the couple who wants something off the usual guidebook path: a day in Dry Creek Valley at small producers like Quivira (biodynamic) or Preston Farm & Winery (also with a garden, homemade bread, and olive oil).',
  ],

  funFact: 'Rutherford was the first appellation to reach 100% participation in the Napa Green Land program. The certification system covers not just vineyard practices but also the winery building and the entire production operation — making Rutherford the most sustainability-audited wine corridor in the Western Hemisphere.',

  checklist: [
    '🚲 Comfortable clothes for riding the Vine Trail',
    '🕶️ Sunscreen and sunglasses for the 82–97°F daytime heat',
    '🧥 A light sweater for the 59–64°F evenings',
    '👟 Comfortable shoes for tasting rooms and vineyard walks',
    '📅 Winery and dinner reservations made weeks ahead',
    '🩱 Swimsuit for the Bardessono and H2Hotel pools',
  ],

  transport: [
    {
      mode: 'Flight',
      description: 'San Francisco International (SFO) or Oakland International (OAK), both under 1.5 hours from Yountville by car. Car-free alternative: the SMART train from San Francisco to Santa Rosa, then an Uber to the hotel. The airport closest to the north end of the valley is Sonoma County (STS), with domestic flights from Los Angeles and Seattle.',
    },
    {
      mode: 'Getting around the valley',
      description: 'A rental electric car is the perfect fit for this itinerary — the charging network across Napa and Sonoma is extensive, and Bardessono has 10 chargers of its own. For car-free days: the Vine Trail by bike covers all of Yountville-Napa, and Healdsburg is walkable to every winery in town.',
    },
    {
      mode: 'Weather in August',
      description: 'Daytime highs of 82–97°F in the valley, evenings of 59–64°F. Summer is Napa\'s busiest season — book wineries and restaurants weeks in advance. Sonoma\'s wineries see less crowding than Napa\'s in August.',
    },
  ],
}
