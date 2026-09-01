import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'kioto-osaka',
  locale: 'en',

  hero: {
    title: 'Kyoto and Osaka, Japan',
    subtitle: "September is Japan's open secret: the same Kyoto everyone wants, without the autumn-foliage crowds. 26–30°C by day, clear skies, and temples at half their usual visitor count. Tokyo's September Grand Sumo tournament adds Japan's most singular sporting event. For the couple who wants the real Japan before the crowds arrive.",
    eyebrow: 'Curated guide · Couple · Before the Crowds · 8 days · High budget',
    tags: ['Couple', 'Temples', 'Food'],
    image: '/images/guides/kioto-osaka.png',
  },

  itinerary: [
    {
      day: 1,
      title: 'Arrival in Kyoto',
      items: [
        {
          time: 'Variable',
          title: 'Airport arrival and Shinkansen to Kyoto',
          description: '2 hours 15 minutes from Tokyo on the Nozomi Shinkansen to Kyoto Station',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Check-in and first walk through Gion',
          description: 'Check-in at the chosen ryokan, then a sunset walk down Hanamikoji, Gion\'s most photographed street',
          tags: [],
        },
        {
          time: '19:00',
          title: 'Dinner in Kyoto',
          description: 'Any restaurant in the Gion area, no reservation needed',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Kyoto: Eastern temples',
      items: [
        {
          time: '07:30',
          title: 'Kiyomizu-dera at sunrise',
          description: 'The temple built into the hillside without a single metal nail, a UNESCO World Heritage Site. Before 9am it\'s practically empty',
          tags: [],
        },
        {
          time: '09:00',
          title: 'Sanneizaka and Ninenzaka',
          description: 'The stone-paved lanes lined with 17th-century craft shops, plus Otani Cemetery — one of the most photogenic spots in Asia — on the way back',
          tags: [],
        },
        {
          time: '11:30',
          title: 'Back to the ryokan',
          description: 'Late breakfast',
          tags: [],
        },
        {
          time: '14:30',
          title: 'Garden Tea Ceremony',
          description: 'Advance booking required',
          tags: [],
        },
        {
          time: '19:00',
          title: 'Dinner, no plans, in Gion',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Kyoto: Northwest temples',
      items: [
        {
          time: '09:00',
          title: 'Kinkakuji',
          description: 'The Golden Pavilion. Arrive before 9:30am for the crowd-free photo',
          tags: [],
        },
        {
          time: '10:30',
          title: 'Ryoanji',
          description: 'The world\'s most famous kare-sansui (dry rock garden), and Kyoto\'s quietest if you arrive before noon',
          tags: [],
        },
        {
          time: '12:00',
          title: 'Ninnaji and lunch nearby',
          description: 'A less-visited temple, shorter lines, the same visual impact',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Nishiki Market',
          description: 'A 400-meter stretch of neighborhood-food stalls that locals call "Kyoto\'s kitchen"',
          tags: [],
        },
        {
          time: '19:30',
          title: 'Dinner',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'Arashiyama',
      items: [
        {
          time: '08:00',
          title: 'Bamboo Grove at sunrise',
          description: 'The one hour of the day it\'s completely empty',
          tags: [],
        },
        {
          time: '09:00',
          title: 'Tenryuji and its gardens',
          description: 'A temple with a Zen garden set above the lake. Admission: $6 USD',
          tags: [],
        },
        {
          time: '11:00',
          title: 'Walk through Saga-Toriimoto',
          description: 'The neighborhood of historic houses',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Riverside lunch',
          description: '',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Rowboat on the Oi River',
          description: '$5 USD, self-guided rental',
          tags: [],
        },
        {
          time: '18:00',
          title: 'Train back to Gion',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 5,
      title: 'Day trip to Nara',
      items: [
        {
          time: '08:30',
          title: 'Train from Kyoto to Nara',
          description: '30 minutes, $4 USD',
          tags: [],
        },
        {
          time: '09:30',
          title: 'Nara Park',
          description: '1,200 sacred deer roaming freely among visitors, plus the Kasuga Taisha shrine with its 3,000 stone lanterns',
          tags: [],
        },
        {
          time: '10:30',
          title: 'Todaiji and the Great Buddha',
          description: 'The world\'s largest wooden building houses Japan\'s largest bronze Buddha. Admission: $5 USD',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Lunch in Nara',
          description: '',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Back to Kyoto or on to Osaka',
          description: '',
          tags: [],
        },
        {
          time: '18:00',
          title: 'Check-in in Osaka',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 6,
      title: 'Osaka: Food',
      items: [
        {
          time: '09:00',
          title: 'Kuromon Ichiba Market',
          description: '170 stalls open since 7am — the most authentic breakfast in Osaka',
          tags: [],
        },
        {
          time: '11:30',
          title: 'Dotonbori',
          description: 'Japan\'s most photogenic corridor of neon and restaurants',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Ramen lunch in Dotonbori',
          description: '',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Osaka Castle',
          description: 'Optional, admission: $6 USD',
          tags: [],
        },
        {
          time: '19:00',
          title: 'Hungry Osaka Street Food Tour',
          description: 'Nighttime food tour through Shinsekai',
          tags: [],
        },
      ],
    },
    {
      day: 7,
      title: 'Free day in Osaka, or Hiroshima (optional)',
      items: [
        {
          time: 'Option A',
          title: 'Hiroshima and Miyajima by Shinkansen',
          description: 'Full day, 1 hour from Osaka ($60 USD). The Peace Memorial Park and Atomic Bomb Museum — the most reflective visit available in the Kansai region',
          tags: [],
        },
        {
          time: 'Option B',
          title: 'A quiet day in Osaka',
          description: 'Museum, market, a neighborhood sento (bathhouse), or the Tempozan Aquarium, the largest in Japan',
          tags: [],
        },
      ],
    },
    {
      day: 8,
      title: 'Flight home',
      items: [
        {
          time: 'Morning',
          title: 'Breakfast at the hotel',
          description: '',
          tags: [],
        },
        {
          time: 'Variable',
          title: 'Transfer to Kansai Airport (KIX)',
          description: '50 minutes on the Airport Express from central Osaka ($12 USD)',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Hotel The Celestine Kyoto Gion',
      type: 'Boutique hotel · Gion, Kyoto',
      priceTier: '$$$',
      description: 'Gion\'s most praised boutique hotel — the historic geisha district — with "absolutely stunning" the single most repeated phrase in English and Spanish reviews from the past 12 months. Bright, spacious rooms in contemporary Japanese design, free in-room drinks and snacks, concierge service that got a taxi through pouring rain when Uber never showed, and a location that puts Kiyomizu-dera temple 15 minutes away on foot. For the couple who wants Gion\'s most complete hotel: this is it. Estimated price: €200–380/night.',
      tag: 'Gion\'s most complete boutique hotel',
      affiliateUrl: 'https://www.booking.com/searchresults.html?ss=Hotel+The+Celestine+Kyoto+Gion',
      archetypes: ['Parejas'],
    },
    {
      name: 'Gion Shinmonso',
      type: 'Ryokan with onsen · Gion, Kyoto',
      priceTier: '$$',
      description: 'A ryokan with an onsen (hot spring bath) in the heart of Gion, 500 meters from Gion-Shijo Station. Rooms with tatami mats and futons, a public bath with a gender-separated onsen, and the most authentic ryokan experience available in Kyoto\'s most historic district. Reviews single out the onsen as the best part of every day — walking back from a temple at night and slipping into the hot bath before dinner is the ritual no Western hotel can replicate. Estimated price: €150–280/night.',
      tag: 'Gion\'s most authentic onsen, every night',
      affiliateUrl: 'https://www.booking.com/hotel/jp/kyoto-ryokan-gion-shinmonso.html',
      archetypes: ['Parejas'],
    },
    {
      name: 'Ryokan Uemura',
      type: 'Ryokan · Gion, Kyoto',
      priceTier: '$',
      description: 'Gion\'s most authentic, highest-rated ryokan: a 9.7 rating on Booking, 9.8 for location. An older couple has run it for decades — he poured the tea on our first visit and sketched a map to the bathroom for newly arrived guests. Tatami floors, a shared Japanese bath, a yukata robe included, and Hanamikoji — Kyoto\'s most photogenic street — literally at the front door. The ryokan that shows up most often in repeat travelers\' "what I\'d do differently in Japan" lists. Estimated price: €120–200/night.',
      tag: "Gion's highest-rated ryokan: 9.7 on Booking",
      affiliateUrl: 'https://www.booking.com/hotel/jp/ryokan-uemura.html',
      archetypes: ['Parejas'],
    },
  ],

  hotelsDescription: 'Gion as a base, right in the historic heart of Kyoto.',

  experiences: [
    {
      name: 'Tea Ceremony in a Garden Tea House',
      description: 'Kyoto\'s most recommended tea ceremony: in a traditional tea house with a private garden steps from Kiyomizu-dera temple, with garden views throughout the 45-minute ceremony. The tea master explains wabi-sabi — the philosophy of deliberate imperfection — while preparing matcha through a 400-year-old ritual. The best single-format introduction to Japanese culture available: calm, specific, and completely authentic.',
      tags: ['Tea', 'Kiyomizu-dera', '45 min'],
      affiliateUrl: 'https://www.getyourguide.com/kyoto-l96826/kyoto-tea-ceremony-in-a-traditional-tea-house-in-kiyomizu-t551173/',
    },
    {
      name: 'Hungry Osaka Street Food Tour: 15 Tastings & 3 Drinks',
      description: 'Osaka\'s top-rated food tour for seven consecutive years. Shinsekai — the city\'s most authentic and least touristy neighborhood — with five local stops: kushikatsu (fried skewers in sauce), takoyaki (octopus balls), karaage, oden, and a full meal at a neighborhood izakaya. 15 dishes and 3 drinks included over 3 hours. The guide speaks fluent English, and the neighborhood operates exclusively in Japanese — which is exactly the point.',
      tags: ['Shinsekai', 'Food', '3 hours'],
      affiliateUrl: 'https://www.getyourguide.com/osaka-l1204/hungry-osaka-street-food-tour-15-tastings-3-drinks-t513983/',
    },
    {
      name: 'Osaka: 15-Dish Food Tour with 3 Drinks',
      description: 'The alternative tour from Hungry Osaka Tours — same company, different format: five different venues in Shinsekai, authentic local cooking with no adjustments for the Western palate, and cultural context for every dish explained by a guide who lives in the neighborhood. For the couple who wants to repeat Osaka\'s food-tour experience with a different operator, or on a date when the main tour is sold out.',
      tags: ['Shinsekai', 'Alternative', 'Food'],
      affiliateUrl: 'https://www.getyourguide.com/osaka-l1204/osaka-shinsekai-food-tour-t315237/',
    },
  ],

  experiencesDescription: 'Tea, geishas, and the food of Osaka.',

  tips: [
    'Restaurant reservations in Kyoto: Kyoto\'s best restaurants (Kichisen, Kikunoi, Mizai) require reservations months in advance — some only accept bookings made through luxury hotels. For the special dinner: ask the ryokan concierge to handle the reservation the moment you confirm the room. It\'s the service that separates a well-run ryokan from an average one.',
    'The onsen: the hot spring bath at the ryokan follows specific protocol — a full shower before entering the communal bath, no clothing, no soap in the bath itself. The first onsen can feel disorienting; that\'s completely normal. The second one is already the ritual of the trip.',
    'The IC Card: the rechargeable ICOCA card (in Osaka/Kyoto) or SUICA (in Tokyo) works on the subway, buses, and local trains across the whole Kansai region. Top it up at any station machine. It\'s the most efficient way to get around — no buying individual tickets for every ride.',
    'The konbini: Japanese convenience stores (7-Eleven, FamilyMart, Lawson) have the best prepared food of any convenience chain in the world — onigiri, cold soba, curry rice, steamed gyoza. For a fast breakfast before a 7am temple visit or dinner on the last night, the konbini is the most lagom plan available in Japan.',
  ],

  funFact: 'Kyoto was Japan\'s imperial capital for more than 1,000 years — from 794 to 1869, when the government moved to Tokyo. During World War II, Kyoto was removed from the list of American atomic bomb targets, partly due to the objections of Secretary of War Henry Stimson, who had visited the city on his honeymoon in 1926. The decision saved 17 UNESCO World Heritage sites, 2,000 temples and shrines, and the most intact architecture of historic Japan.',

  checklist: [
    '🎫 A rechargeable IC Card (ICOCA) for subway, bus, and train across the Kansai region',
    '👘 Light, breathable clothing for September humidity — skip the cotton that seems obvious',
    '🥾 Shoes that come off and go back on easily: temples, ryokans, and restaurants ask for it constantly',
    '📷 Camera ready for sunrise at the Bamboo Grove and Kiyomizu-dera before 9am',
    '🍵 Tea ceremony and ryokan reservations booked months in advance',
    '💴 Cash in yen for konbinis, izakayas, and markets — not everywhere takes cards',
    '🚄 Reserved Shinkansen seats for the Osaka–Hiroshima leg if you pick Option A on day 7',
  ],

  transport: [
    {
      mode: 'Flight from Mexico',
      description: 'The most direct flight from CDMX is CDMX–Tokyo (Narita or Haneda), connecting through Los Angeles, Vancouver, or Dallas. From Tokyo, the Nozomi Shinkansen reaches Kyoto in 2 hours 15 minutes (roughly $130–160 USD). Alternative: fly direct to Osaka (Kansai, KIX), connecting through an Asian hub (Seoul, Taipei, Hong Kong).',
    },
    {
      mode: 'JR Pass vs. ICOCA',
      description: "For 8 days in Kyoto and Osaka with a Nara day trip and an arrival Shinkansen, the national JR Pass isn't necessarily the better financial option — run the numbers on your planned routes before buying it. The rechargeable ICOCA card covers the subway and local trains across the whole Kansai region and is more efficient for shorter stays.",
      tip: 'Osaka to Kyoto: 15 minutes by Shinkansen or 30 minutes on the Hankyu/JR line ($3–6 USD), the easiest connection in the region.',
    },
    {
      mode: 'Getting around Kyoto',
      description: 'Subway, bus, and on foot. Kyoto has a bus grid that covers every major temple. A rental bike ($8–12 USD/day) is the most lagom option for the couple who wants to cover the Philosopher\'s Path or Arashiyama without working around a schedule.',
    },
    {
      mode: 'September weather',
      description: '28–32°C in Kyoto and Osaka — hot but manageable, especially in the mornings. Kyoto\'s temples before 9am are practically empty. Humidity is the factor that matters most: light, breathable fabrics, not the cotton that seems like the obvious choice.',
    },
  ],
}
