import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'westfjords-islandia',
  locale: 'en',

  hero: {
    title: 'Westfjords, Iceland',
    subtitle: 'Iceland without the line. While the Golden Circle buses tourists toward the same geyser it has since 1970, the Westfjords have the country\'s most impressive waterfall, Europe\'s most vertical bird cliffs, and a nature reserve reachable only by boat, home to Arctic foxes. August brings 20 hours of daylight over the landscape photographers keep to themselves.',
    eyebrow: 'Curated guide · Family with teens · Extreme Nature · 6 days · Mid budget',
    tags: ['Family', 'Teens', 'Nature'],
    image: '/images/guides/westfjords-islandia.jpg',
  },

  itinerary: [
    {
      day: 1,
      title: 'Arrival in Ísafjörður',
      items: [
        {
          time: '13:00',
          title: 'Arrival and check-in at Hotel Isafjordur Torg',
          description: 'Flight from Reykjavik or arrival by car',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Westfjords Heritage Museum',
          description: '1.5 hours — the best-curated maritime history museum in the north',
          tags: [],
        },
        {
          time: '17:30',
          title: 'Walk through downtown Ísafjörður and the pier',
          description: 'Dokkan Brugghús microbrewery is right along the way',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Dinner at the hotel restaurant',
          description: 'Local seafood and Icelandic lamb',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Hornstrandir Nature Reserve',
      items: [
        {
          time: '08:00',
          title: 'Breakfast and departure to the dock',
          description: '',
          tags: [],
        },
        {
          time: '09:00',
          title: 'Ferry to Hornstrandir',
          description: '1 hour. Iceland\'s most remote nature reserve, no roads and no permanent residents since 1952',
          tags: [],
        },
        {
          time: '10:00',
          title: 'Guided hike with a local guide',
          description: '4–6 hours. Hornstrandir\'s Arctic foxes approach out of curiosity, unafraid, since they\'ve never been hunted',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Ferry back to Ísafjörður',
          description: '',
          tags: [],
        },
        {
          time: '19:30',
          title: 'Free dinner in Ísafjörður',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Kayaking and the Arctic Fox Centre',
      items: [
        {
          time: '09:00',
          title: 'Breakfast',
          description: '',
          tags: [],
        },
        {
          time: '10:00',
          title: 'Kayak tour',
          description: '2–3 hours on the fjord. Grey and bearded seals swim around the kayaks in August',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Drive to Súðavík',
          description: '20 minutes',
          tags: [],
        },
        {
          time: '14:30',
          title: 'Arctic Fox Centre',
          description: '2 hours, €15 admission. The world\'s only research center dedicated exclusively to the Arctic fox',
          tags: [],
        },
        {
          time: '17:30',
          title: 'Return to Ísafjörður',
          description: '',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Dinner at Tjöruhúsið',
          description: 'Ísafjörður\'s most famous seafood restaurant — a single daily catch menu, no reservations, first come first served',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'South to Dynjandi and on to Patreksfjörður',
      items: [
        {
          time: '09:00',
          title: 'Check-out from Isafjordur Torg and departure',
          description: 'South along the Arnarfjörður coastal road',
          tags: [],
        },
        {
          time: '12:00',
          title: 'Arrival at Dynjandi',
          description: 'Tour + hike to the top (45 min climb). A 100-meter waterfall dropping in seven cascading tiers',
          tags: [],
        },
        {
          time: '14:30',
          title: 'Picnic on site or lunch along the way',
          description: '',
          tags: [],
        },
        {
          time: '16:30',
          title: 'Arrival in Patreksfjörður',
          description: 'Check-in at Fosshotel',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Dinner at the hotel restaurant',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 5,
      title: 'Látrabjarg Bird Cliffs and Rauðasandur',
      items: [
        {
          time: '08:30',
          title: 'Breakfast and departure',
          description: '',
          tags: [],
        },
        {
          time: '10:00',
          title: 'Látrabjarg Bird Cliffs',
          description: '54 km from Patreksfjörður, gravel road, 1.5h. Iceland\'s westernmost point and Europe\'s largest seabird colony',
          tags: [],
        },
        {
          time: '10:00',
          title: 'Cliffs and puffins',
          description: 'Bring a jacket — the wind on the cliffs is constant',
          tags: [],
        },
        {
          time: '13:30',
          title: 'Drive to Rauðasandur',
          description: '20 minutes',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Red sand beach and picnic lunch',
          description: 'Iceland\'s only red sand beach',
          tags: [],
        },
        {
          time: '16:30',
          title: 'Return to Fosshotel',
          description: '',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Dinner and rest',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 6,
      title: 'Country Hotel Heydalur and return',
      items: [
        {
          time: '09:00',
          title: 'Check-out from Fosshotel',
          description: 'North with a stop in Heydalur',
          tags: [],
        },
        {
          time: '10:30',
          title: 'Arrival in Heydalur',
          description: 'Soak in the outdoor geothermal pool ($5/person)',
          tags: [],
        },
        {
          time: '12:30',
          title: 'Lunch at the farm hotel',
          description: '',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Drive back toward Reykjavik',
          description: 'Or flight from Ísafjörður',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Arrival in Reykjavik',
          description: '',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Hotel Isafjordur Torg',
      type: 'Hotel · Ísafjörður',
      priceTier: '$$',
      description: 'The most stylish hotel in Ísafjörður, the Westfjords\' capital with 2,600 residents and an outsized cultural life for its size, right on the central square (Silfurtorg) with panoramic fjord and mountain views from every angle. On-site restaurant with local cuisine, a bar, and the most knowledgeable staff on weather conditions, ferry schedules, and regional trails. The central base for the north and east Westfjords exploration days. Estimated price: €180–280/night.',
      tag: 'The central base on Ísafjörður\'s main square',
      affiliateUrl: 'https://www.booking.com/hotel/is/isafjordur.html',
      archetypes: ['Familias'],
    },
    {
      name: 'Country Hotel Heydalur',
      type: 'Farm hotel · Heydalur Valley',
      priceTier: '$$',
      description: 'A family-run farm hotel in a remote valley in the southern Westfjords, 130 kilometers from Ísafjörður. Icelandic horses in the outdoor pastures, an outdoor geothermal pool, natural hot tubs, and the most authentic atmosphere in the Westfjords — a family that\'s worked the same valley for generations and knows more about the region than any guidebook. Family rooms, Icelandic breakfast with skyr and local smoked salmon. The calmest night of the six-day trip. Estimated price: €160–240/night.',
      tag: 'Geothermal pool in a remote valley',
      affiliateUrl: 'https://www.booking.com/hotel/is/heydalur.html',
      archetypes: ['Familias'],
    },
    {
      name: 'Fosshotel Westfjords',
      type: 'Hotel · Patreksfjörður',
      priceTier: '$$',
      description: 'A property of the Íslandshótel chain — the first hotel chain to earn Green Key certification across all 17 of its Iceland properties — in the town of Patreksfjörður, gateway to Dynjandi and the Látrabjarg cliffs. 40 rooms with fjord views, a restaurant serving local seafood, and the perfect base for the trip\'s most active days. 24 kilometers from Dynjandi and 54 from Látrabjarg — the Westfjords\' two most important experiences within the same radius. Estimated price: €150–230/night.',
      tag: 'Green Key certified, within range of Dynjandi and Látrabjarg',
      affiliateUrl: 'https://www.booking.com/hotel/is/fosshotel-westfjords.html',
      archetypes: ['Familias'],
    },
  ],

  hotelsDescription: 'Three bases, three different Icelands: Ísafjörður, Heydalur, and Patreksfjörður.',

  experiences: [
    {
      name: 'Dynjandi Waterfall Day Tour from Ísafjörður',
      description: 'Dynjandi, also called Fjallfoss, drops 100 meters total across seven cascading tiers, each with its own name. The base spans 60 meters wide and the top 30 — the inverted-fan shape that makes Dynjandi the Westfjords\' most recognizable image and one of Iceland\'s most photographed. The tour from Ísafjörður includes transport along the Arnarfjörður coastal road and free time on site. For teens: the trail to the top (45 min) is accessible, and the view from above completely changes the perspective.',
      tags: ['Dynjandi', 'Waterfall', 'Full day'],
      affiliateUrl: 'https://www.getyourguide.com/isafjordur-l32303/isafjordur-dynjandi-express-t488601/',
    },
    {
      name: 'Hornstrandir Nature Reserve Boat Tour & Hike',
      description: 'Iceland\'s most remote nature reserve — no roads, no permanent residents since 1952, and reachable only by ferry from Ísafjörður. Arctic foxes that approach within a meter without fear, since they\'ve never been hunted, 534-meter cliffs, and hiking through landscape untouched for decades. For energetic teens: this level of nature immersion with zero tourist infrastructure is unique in Europe. Full-day guided tour.',
      tags: ['Hornstrandir', 'Arctic foxes', 'Ferry'],
      affiliateUrl: 'https://www.getyourguide.com/isafjordur-l32303/isafjordur-hornstrandir-guided-hike-adalvik-to-hesteyri-t1005278/',
    },
    {
      name: 'Kayaking in the Westfjords Fjords',
      description: 'A 2–3 hour kayak tour from Ísafjörður through the fjords with a local guide. Grey and bearded seals swim around the kayaks in the northern fjords — a constant presence in August. The cold North Atlantic water means a dry suit is required, included in the tour. For teens 12 and up with no prior kayak experience: the fjords are flat and manageable.',
      tags: ['Kayak', 'Seals', 'Half day'],
      affiliateUrl: 'https://www.getyourguide.com/s/?q=Kayaking%20Isafjordur%20fjords',
    },
  ],

  experiencesDescription: 'Foxes, puffins, and waterfalls without the tourist queue.',

  tips: [
    'Fuel: Gas stations in the Westfjords are scarce, and some close by 6pm or earlier. Fill the tank whenever the gauge drops below half — the next station could be 100 kilometers away. 24-hour automated-payment stations are the most useful for the itinerary\'s logistics.',
    'Gravel roads: A standard rental car works perfectly for this itinerary — you don\'t need an SUV for the Westfjords in August. Gravel insurance, offered by rental companies, is genuinely worth it: rocks kicked up by other cars can crack a windshield.',
    'The midnight sun: In August, the sun doesn\'t set until 11pm in the Westfjords. For teens, that\'s a standing invitation to stay up. For the itinerary, it\'s an advantage: the most photogenic spots (Dynjandi, Látrabjarg) get soft late-evening light, exactly what photographers are after.',
  ],

  funFact: 'The Íslandshótel chain was the first hotel chain to earn full Green Key certification across all of its hotels in Iceland (17 certified properties). Green Key is an international tourism sustainability certification present in over 60 countries. In Iceland, 100% of grid electricity comes from renewable sources — geothermal and hydro — which means any hotel connected to the national grid runs automatically on clean energy.',

  checklist: [
    '🧥 Rain jacket — showers are possible at any moment',
    '🧣 Layers for the 45–54°F (7–12°C) nights',
    '😴 Sleep mask — the sun doesn\'t set until 11pm',
    '🧢 A jacket for the constant wind at the Látrabjarg cliffs',
    '⛽ Cash or card, and fill the tank whenever it drops below half',
    '🚗 Rental car booking with gravel insurance',
    '💶 Cash for the Arctic Fox Centre admission (€15)',
  ],

  transport: [
    {
      mode: 'Flight',
      description: 'Two options. A direct 45-minute flight from Reykjavik (RKV, the domestic airport) to Ísafjörður (IFJ) with Eagle Air (2–3 flights daily in August). Or a 5–6 hour drive from Reykjavik via Route 60, the country\'s most dramatic coastal road, which is a part of the trip in its own right. For families with teens: driving is more flexible and cheaper.',
    },
    {
      mode: 'Getting around the Westfjords',
      description: 'A rental car is essential — without one, half the stops are unreachable. Roads are partly gravel inland; with younger kids you can just go slow. The general speed limit is 80 km/h (50 mph) on paved roads and 60 km/h (37 mph) on gravel.',
    },
    {
      mode: 'August weather',
      description: 'August is the warmest, driest month in the Westfjords — days of 54–64°F (12–18°C), nights of 45–54°F (7–12°C). The sun doesn\'t set until 11pm — a family that doesn\'t set a bedtime loses track of time fast. Rain is possible at any moment.',
      tip: 'Pack rain jackets for everyone, even on the clearest forecast days.',
    },
  ],
}
