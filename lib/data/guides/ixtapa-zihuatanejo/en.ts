import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: "ixtapa-zihuatanejo",
  locale: "en",
  hero: {
    title: "Ixtapa-Zihuatanejo with Family",
    subtitle: "A cookie-sized olive ridley hatchling waddles toward the sea, and your child watches it until a wave carries it away. Ixtapa and Zihuatanejo share an airport and a bay, but they keep two different rhythms: the hotel boulevard with its pools and kids' clubs, and the fishing port with its waterfront promenade. This guide alternates an adventure day with a rest day so no one arrives at dinner exhausted.",
    eyebrow: "Curated guide · Family with young kids · Beach · 5 days · Mid-range budget",
    tags: ["Family", "Beach", "Nature", "Long weekend"],
    image: "/images/guides/ixtapa-zihuatanejo.png",
  },
  itinerary: [
    {
      day: 1,
      title: "Arrival and the first pool",
      items: [
        {
          time: "Midday",
          title: "Direct flight from Mexico City, just over an hour",
          description: "The airport is about 20 minutes from Ixtapa.",
          tags: [],
        },
        {
          time: "Early afternoon",
          title: "Check-in, lunch at the hotel and the kids' pool",
          description: "",
          tags: [],
        },
        {
          time: "Sunset",
          title: "Playa El Palmar",
          description: "If the red flag is up, enjoy the view from the sand.",
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: "Turtle release",
      items: [
        {
          time: "Early",
          title: "Breakfast",
          description: "",
          tags: [],
        },
        {
          time: "Morning or afternoon, depending on the camp's schedule",
          title: "Turtle release tour: four hours with hotel pickup, to a camp 40 minutes away where you help release olive ridley hatchlings",
          description: "Includes a snack, a drink and lunch.",
          tags: [],
        },
        {
          time: "Rest of the day",
          title: "Hotel, kids' club and pool",
          description: "",
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: "Zip lines and Zihuatanejo",
      items: [
        {
          time: "Morning",
          title: "Zip lines in Ixtapa-Zihuatanejo, two and a half hours in an eco park, with transportation from the hotel zone",
          description: "With very young kids, swap it for a bike ride along Ixtapa's bike path.",
          tags: [],
        },
        {
          time: "Midday",
          title: "Lunch and a nap",
          description: "",
          tags: [],
        },
        {
          time: "Afternoon",
          title: "Zihuatanejo: a stroll along the Paseo del Pescador in front of Playa Principal, ice cream and dinner downtown",
          description: "",
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: "Countryside, coconuts and Barra de Potosí",
      items: [
        {
          time: "Morning",
          title: "Ixtapa-Zihuatanejo countryside tour: five hours with two local families, a coconut grove where you peel and taste the fruit, a brick and roof-tile workshop, and a seafood lunch by the water in Barra de Potosí",
          description: "Optional boat ride on the lagoon.",
          tags: [],
        },
        {
          time: "Afternoon",
          title: "Back to the hotel and free time",
          description: "",
          tags: [],
        },
        {
          time: "Alternative",
          title: "If the boats are running normally, Isla de Ixtapa is the classic plan: calm waters for the kids to swim, about a ten-minute boat ride from Playa Linda",
          description: "Confirm with the hotel that same day.",
          tags: [],
        },
      ],
    },
    {
      day: 5,
      title: "One last splash and the trip home",
      items: [
        {
          time: "Morning",
          title: "Breakfast and one last morning at the beach or pool",
          description: "",
          tags: [],
        },
        {
          time: "Midday",
          title: "Check-out",
          description: "Most hotels will hold your bags.",
          tags: [],
        },
        {
          time: "Early afternoon",
          title: "Head to the airport, about 20 minutes away",
          description: "",
          tags: [],
        },
      ],
    },
  ],
  itineraryDescription: "Four nights in Ixtapa, right on Playa El Palmar. Three short outings with hotel pickup and pool afternoons for naps.",
  hotels: [
    {
      id: 'holiday-inn-resort-ixtapa-all-inclusive',
      name: "Holiday Inn Resort Ixtapa All-Inclusive",
      type: "All-inclusive · Playa El Palmar",
      priceTier: "$$",
      description: "Booking.com: 8.4/10 (2,111 reviews) · Reference price: US$200 to 260 per night, all-inclusive. Ixtapa's family classic: 431 rooms, two pools, a kids' pool and a kids' club at no extra cost. It sits across from the shopping area, with restaurants and a crafts market just across the boulevard. Booking.com rates its location 9.2.",
      tag: "Free kids' club and everything taken care of without leaving the hotel",
      affiliateUrl: "https://www.booking.com/hotel/mx/holiday-inn-extapa-resort.html?ref=lagomplan",
      archetypes: ["Familias"],
    },
    {
      id: 'barcelo-ixtapa-all-inclusive',
      name: "Barceló Ixtapa All Inclusive",
      type: "All-inclusive · Playa El Palmar",
      priceTier: "$$",
      description: "Booking.com: 8.2/10 (393 reviews) · Reference price: US$175 to 240 per night, all-inclusive. 351 rooms and 47 villas, seven restaurants, three pools and a supervised kids' club. It has more à la carte restaurants than the Holiday Inn, handy if the parents want a different dinner while the kids eat early.",
      tag: "More restaurants for five days of all-inclusive",
      affiliateUrl: "https://www.booking.com/hotel/mx/barcelo-ixtapa-beach.html?ref=lagomplan",
      archetypes: ["Familias"],
    },
    {
      id: 'emporio-ixtapa',
      name: "Emporio Ixtapa",
      type: "Hotel with optional all-inclusive · Playa El Palmar",
      priceTier: "$",
      description: "Booking.com: 8.4/10 (1,293 reviews) · Reference price: from about US$90 per night, room only. 219 rooms on a private beach, a kids' pool, a spa and activities for kids and adults such as biking, tennis and volleyball. You can book room only and eat in Ixtapa or Zihuatanejo, or add the all-inclusive plan. The option with the most room in the budget.",
      tag: "Flexibility: with or without an all-inclusive plan",
      affiliateUrl: "https://www.booking.com/hotel/mx/emporio-ixtapa.html?ref=lagomplan",
      archetypes: ["Familias"],
    },
  ],
  hotelsDescription: "Three hotels on Playa El Palmar, just steps from one another. Ratings are from Booking.com; reference prices per night for two adults come from comparison sites in 2026, in US dollars. With kids the total changes depending on their ages: confirm it at the link.",
  experiences: [
    {
      id: 'liberacion-de-tortugas-en-ixtapa-zihuatanejo',
      name: "Turtle release in Ixtapa-Zihuatanejo",
      description: "GetYourGuide: 5.0/5 (4 reviews) · From US$71 per person. Four hours at a turtle camp 40 minutes from Ixtapa. Guides explain how olive ridley turtles are protected and how the nests work, and the kids help release hatchlings. Includes transportation, a snack, a drink and lunch. The guide speaks English and French; ask about Spanish when you book.",
      tags: ["Nature", "4 hours", "Hotel pickup", "Lunch included"],
      category: 'naturaleza',
      duration: 'corto',
      affiliateUrl: 'https://www.getyourguide.com/zihuatanejo-l392/ixtapa-zihuatanejo-turtle-release-tour-t819389/',
    },
    {
      id: 'tirolesas-en-ixtapa-zihuatanejo',
      name: "Ziplining in Ixtapa-Zihuatanejo",
      description: "GetYourGuide: 4.5/5 (3 reviews) · From US$68 per person. Two and a half hours in an eco park in the jungle, with zip lines, ladders, hanging bridges and moving obstacles. Includes a harness, bilingual guides and transportation from the Ixtapa and Zihuatanejo hotel zones. Wear closed-toe shoes. Confirm the minimum age and height before booking for the little ones.",
      tags: ["Adventure", "2.5 hours", "Small group", "Transportation included"],
      category: 'aventura',
      duration: 'corto',
      affiliateUrl: 'https://www.getyourguide.com/zihuatanejo-l392/ixtapa-zihuatanejo-excursion-en-tirolesa-t657047/',
    },
    {
      id: 'tour-por-el-campo-y-barra-de-potosi',
      name: "Countryside tour and Barra de Potosí",
      description: "GetYourGuide: 5.0/5 (1 review) · From US$103 per person. Five hours with a Spanish- or English-speaking guide to see how people live and work outside the hotel zone: a coconut grove with a tasting, a family-run brick and roof-tile workshop, and a seafood lunch on the beach in the fishing village of Barra de Potosí. The boat ride on the lagoon is optional and paid separately. You can also take it without lunch.",
      tags: ["Local culture", "5 hours", "Air-conditioned transportation", "Lunch included"],
      category: 'excursion',
      duration: 'medio',
      affiliateUrl: 'https://www.getyourguide.com/zihuatanejo-l392/zihuatanejo-ixtapa-countryside-tour-t658438/',
    },
  ],
  experiencesDescription: "Three GetYourGuide outings with hotel pickup. Rating and per-person price from GetYourGuide as of October 23, 2026, in US dollars. These are small local operators with few reviews so far.",
  tips: [
    "Check the sea before the weather. During Hurricane Trudy, Civil Protection asked swimmers to stay out of the water because of the surf. Respect the flags and let the little ones swim in the pool when the red flag is up.",
    "One outing a day, always in the morning. The midday sun is strong and outings last from two and a half to five hours. Heading back for lunch and a nap at the hotel saves the afternoon.",
    "Ask about the guide's language. Several operators default to English. If your kids are young, request a Spanish-speaking guide when you book.",
    "The turtles call the shots. The release depends on hatchlings being ready that day. If the camp changes its schedule, plan the rest of your day around it.",
  ],
  funFact: "Zihuatanejo is the place Andy Dufresne dreams of in The Shawshank Redemption (1994): the Mexican Pacific town where he plans to live by the sea once he gets out of prison.",
  checklist: [
    "Biodegradable sunscreen and long-sleeve rash guards for the kids",
    "Sun hats and sunglasses",
    "Closed-toe shoes for the zip line and water sandals for the beach",
    "Floaties or life vests for kids who can't swim yet",
    "Mosquito repellent for the lagoon and the evenings",
    "Cash in small bills for boats, tips and snacks in Zihuatanejo",
    "A dry change of clothes in the backpack for each outing",
  ],
  transport: [
    {
      mode: "Getting there: by plane (recommended)",
      description: "Aeroméxico and Volaris fly direct from Mexico City to Ixtapa-Zihuatanejo International Airport (ZIH); the flight takes just over an hour. From the airport, Zihuatanejo is about 10 minutes away and the Ixtapa hotel zone about 20, by taxi or with your hotel's transfer.",
    },
    {
      mode: "Getting there: by road",
      description: "We don't recommend it for this guide: the United Kingdom exempts only Zihuatanejo and Ixtapa, when reached by air, from its travel warning for Guerrero.",
    },
    {
      mode: "Getting around",
      description: "Taxi between Ixtapa and Zihuatanejo, or the transfers included in the tours. Within the hotel zone, the roughly 10-kilometer bike path is great for a ride.",
    },
    {
      mode: "Weather",
      description: "In mid-November days hover around 31 to 33 °C and nights around 25 to 27 °C, with the sea near 30 °C. November is a transition between the rainy and dry seasons: a brief afternoon shower is possible. The Pacific hurricane season ends on November 30.",
    },
  ],
  timely: {
    validUntil: "2027-03-31",
    eyebrow: "This season",
    title: "November 2026 – March 2027 season",
    verifiedNote: "Data verified on October 23, 2026. Prices, schedules and advisories apply to the November 2026 to March 2027 season.",
    essentialsTitle: "The essentials before you book",
    essentials: [
      "Arrive by plane. The United Kingdom advises against non-essential travel to Guerrero, except to Zihuatanejo and Ixtapa by air.",
      "Boat rides depend on the surf. Confirm them with your hotel the day before.",
      "For young kids, the calmest beaches are Playa Quieta, Playa Linda, La Ropa and Las Gatas. El Palmar, in front of the hotels, tends to have bigger waves.",
    ],
    whenTitle: "When to go",
    whenIntro: "The route works on any long weekend from November to March, outside the rainy season. What changes depending on the date is here.",
    window: "Suggested window: Thursday, November 12 to Monday, November 16, 2026. On Monday the 16th there is no school at SEP schools.",
    table: {
      headers: ["What's happening", "Dates", "What it changes for your trip"],
      rows: [
        {
          what: "Damage from hurricanes Polo, Rachel, Simón and Trudy",
          when: "September and October 2026",
          impact: "The surf damaged the piers at Playa Linda and Las Gatas and all 17 restaurants on Isla de Ixtapa, which were closed for 23 days. Confirm which boats are running before planning the island",
        },
        {
          what: "Pacific hurricane season",
          when: "Through November 30",
          impact: "Check the National Weather Service forecast the week of your trip",
          until: "2026-11-30",
        },
        {
          what: "Turtle release",
          when: "August to March, depending on the nests",
          impact: "Confirm with the camp the day before",
        },
        {
          what: "High season",
          when: "December to March",
          impact: "More demand for hotels and tours: book further ahead",
        },
      ],
    },
    booking: {
      label: "Book with the suggested dates:",
      links: [
        {
          name: "Holiday Inn Resort Ixtapa",
          url: "https://www.booking.com/hotel/mx/holiday-inn-extapa-resort.html?checkin=2026-11-12&checkout=2026-11-16&ref=lagomplan",
        },
        {
          name: "Barceló Ixtapa",
          url: "https://www.booking.com/hotel/mx/barcelo-ixtapa-beach.html?checkin=2026-11-12&checkout=2026-11-16&ref=lagomplan",
        },
        {
          name: "Emporio Ixtapa",
          url: "https://www.booking.com/hotel/mx/emporio-ixtapa.html?checkin=2026-11-12&checkout=2026-11-16&ref=lagomplan",
        },
      ],
    },
  },
}
