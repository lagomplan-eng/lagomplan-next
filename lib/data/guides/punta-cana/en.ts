import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: "punta-cana",
  locale: "en",
  hero: {
    title: "Punta Cana for a Big Family Group",
    subtitle: "Grandparents in the palapa, cousins at the water park, parents at the swim-up bar, and everyone at the same long table come dinnertime. Punta Cana works for big families because the resort handles almost everything and the excursions leave right from the hotel door. This guide builds a week with three outings and enough free time for every generation to have its own day.",
    eyebrow: "Curated guide · Large family group · Beach and all-inclusive · 7 days · Upper mid-range budget",
    tags: ["Multigenerational family", "Beach", "All-inclusive", "One week"],
    image: "/images/guides/punta-cana.png",
  },
  itinerary: [
    {
      day: 1,
      title: "Arrival",
      items: [
        {
          time: "Morning",
          title: "Nonstop flight from Mexico City, about four hours and forty-five minutes",
          description: "The Aeroméxico flight leaves early and lands in mid-afternoon, local time.",
          tags: [],
        },
        {
          time: "Afternoon",
          title: "Private van transfer to the hotel (about 16 km from the airport to Bávaro) and check-in",
          description: "",
          tags: [],
        },
        {
          time: "Evening",
          title: "Welcome dinner at one of the resort's à la carte restaurants, booked on arrival for the whole group",
          description: "",
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: "Bávaro Beach",
      items: [
        {
          time: "All day",
          title: "Beach, pool, water park and kids' club",
          description: "Let each generation find its own corner.",
          tags: [],
        },
        {
          time: "Sunset",
          title: "On the beach, with a group photo",
          description: "",
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: "Saona Island",
      items: [
        {
          time: "Very early",
          title: "Saona Island excursion by speedboat and catamaran, with hotel pickup",
          description: "Departs from Bayahibe, with a stop at the natural starfish pool and lunch on the island.",
          tags: [],
        },
        {
          time: "Evening",
          title: "Back at the resort, dinner on your own",
          description: "",
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: "Rest day",
      items: [
        {
          time: "Morning",
          title: "Spa for the adults, kids' or teen club for the young ones",
          description: "",
          tags: [],
        },
        {
          time: "Afternoon",
          title: "Pool and a siesta",
          description: "",
          tags: [],
        },
        {
          time: "Evening",
          title: "Resort show",
          description: "",
          tags: [],
        },
      ],
    },
    {
      day: 5,
      title: "Scape Park and Hoyo Azul",
      items: [
        {
          time: "Morning",
          title: "Hoyo Azul and Scape Park in Cap Cana: air-conditioned bus transfer, the blue-water cenote, zip lines, caves and trails in a 100-hectare eco-park",
          description: "",
          tags: [],
        },
        {
          time: "Afternoon",
          title: "Back at the hotel",
          description: "",
          tags: [],
        },
      ],
    },
    {
      day: 6,
      title: "Adventure or beach, your choice",
      items: [
        {
          time: "Morning",
          title: "The group splits up: the adventurers head to Bávaro Adventure Park (buggies, zip line and a blue lagoon, lunch included); everyone else gets a beach day",
          description: "",
          tags: [],
        },
        {
          time: "Evening",
          title: "Farewell dinner at the week's favorite restaurant",
          description: "",
          tags: [],
        },
      ],
    },
    {
      day: 7,
      title: "Return",
      items: [
        {
          time: "Morning",
          title: "One last dip and check-out",
          description: "",
          tags: [],
        },
        {
          time: "Midday",
          title: "Transfer to the airport with a three-hour cushion",
          description: "The nonstop Aeroméxico flight home leaves in the afternoon and lands in Mexico City at night.",
          tags: [],
        },
      ],
    },
  ],
  itineraryDescription: "Six nights at an all-inclusive on Bávaro Beach. Three full-day excursions separated by free days so the grandparents and the little ones can rest.",
  hotels: [
    {
      id: 'barcelo-bavaro-palace-all-inclusive',
      name: "Barceló Bávaro Palace All Inclusive",
      type: "All-inclusive · Bávaro Beach",
      priceTier: "$$$",
      description: "Booking.com: 8.0/10 (1,258 reviews) · Reference price: US$145 to 245 per night. A huge beachfront resort with 1,402 rooms, four pools, a kids' pool, a free kids' club, a golf course and a water park at an extra charge. It connects to a shopping center and the Barceló convention center. Booking rates its location 9.0. For big groups, the size works in your favor: there is room and variety for everyone.",
      tag: "So no one gets bored over a whole week",
      affiliateUrl: "https://www.booking.com/hotel/do/barcelo-bavaro-palace-deluxe.html?ref=lagomplan",
      archetypes: ["Familias"],
    },
    {
      id: 'iberostar-selection-bavaro-suites',
      name: "Iberostar Selection Bávaro Suites",
      type: "All-inclusive · Bávaro Beach",
      priceTier: "$$$",
      description: "Booking.com: 8.3/10 (264 reviews) · Reference price: US$195 to 310 per night. 448 beachfront suites, seven restaurants, kids' play areas, family rooms and an airport transfer. A guide specializing in all-inclusives singles out its Family Junior Suite as one of the best family rooms in the area. Booking rates its location 9.2.",
      tag: "Roomy suites to spread the group out",
      affiliateUrl: "https://www.booking.com/hotel/do/iberostar-bavaro-suites.html?ref=lagomplan",
      archetypes: ["Familias"],
    },
    {
      id: 'lopesan-costa-bavaro-resort-spa-casino',
      name: "Lopesan Costa Bávaro Resort, Spa & Casino",
      type: "All-inclusive · Bávaro Beach",
      priceTier: "$$$$",
      description: "Booking.com: 7.9/10 (963 reviews) · Reference price: from about US$430 per night. The most complete option for a group with very different ages: ten restaurants, six pools, a free water park, a kids' club and a teen club, bowling, a spa, a casino and an adults-only area. It has junior suites with direct pool access and two-bedroom suites.",
      tag: "A teen club and an adults-only zone in the same resort",
      affiliateUrl: "https://www.booking.com/hotel/do/lopesan-costa-bavaro-resort-spa-amp-casino.html?ref=lagomplan",
      archetypes: ["Familias"],
    },
  ],
  hotelsDescription: "Three all-inclusives on Bávaro Beach, designed for groups spanning several generations. Ratings are from Booking.com; reference prices per night come from 2026 comparison sites, in US dollars, for a double room. For large groups, ask the hotel directly for a room-block quote and compare it with Booking's.",
  experiences: [
    {
      id: 'isla-saona-en-lancha-rapida-y-catamaran',
      name: "Saona Island by speedboat and catamaran",
      description: "GetYourGuide: 4.3/5 (36 reviews) · From US$70 per person. A full day from Punta Cana to Bayahibe, where you board the speedboat or catamaran to Saona Island, inside Del Este National Park. Includes a stop at the natural starfish pool, a white-sand beach and entertainment on board. The excursion runs rain or shine. For groups of ten or more, GetYourGuide also offers private catamarans to Saona.",
      tags: ["Island", "Full day", "Hotel pickup", "Speedboat and catamaran"],
      category: 'excursion',
      duration: 'completo',
      affiliateUrl: "https://www.getyourguide.com/punta-cana-l411/punta-cana-saona-island-tour-speedboat-and-catamaran-t471626/?ref=lagomplan",
    },
    {
      id: 'hoyo-azul-y-scape-park-en-cap-cana',
      name: "Hoyo Azul and Scape Park in Cap Cana",
      description: "GetYourGuide: 4.4/5 (176 reviews) · From US$129 per person. Air-conditioned bus transfer to Scape Park, a 100-hectare eco-park inside Cap Cana. The star is Hoyo Azul, a turquoise-water cenote; around it you will find zip lines, caves, a cultural trail and a small animal ranch. It works for all ages: everyone picks their own level of adventure.",
      tags: ["Nature", "Full day", "Transportation included", "All ages"],
      category: 'naturaleza',
      duration: 'completo',
      affiliateUrl: "https://www.getyourguide.com/punta-cana-l411/punta-cana-hoyo-azul-and-scape-park-cap-cana-full-day-trip-t50328/?ref=lagomplan",
    },
    {
      id: 'bavaro-adventure-park-con-acceso-total-y-comida',
      name: "Bávaro Adventure Park with full access and lunch",
      description: "GetYourGuide: 4.4/5 (105 reviews) · From US$169 per person. Six hours at an adventure park with buggies, a zip line and a blue lagoon for swimming, with lunch and hotel pickup included. Guides in Spanish, English and French. Ideal for the part of the group that wants adrenaline while the rest stays on the beach. You can book now and pay later.",
      tags: ["Adventure", "6 hours", "Lunch included", "Spanish-speaking guide"],
      category: 'aventura',
      duration: 'medio',
      affiliateUrl: "https://www.getyourguide.com/punta-cana-l411/full-access-to-bavaro-adventure-park-t468196/?ref=lagomplan",
    },
  ],
  experiencesDescription: "Three full-day excursions from GetYourGuide with hotel pickup. Rating and price per person from GetYourGuide as of October 23, 2026, in US dollars.",
  tips: [
    "One e-Ticket per family. One person can fill out the entry form for up to seven family members. Split the task by household and save the QR codes on your phone before heading to the airport.",
    "Book the à la carte dinners on day one. At all-inclusives, the big tables fill up fast. Ask the front desk at check-in to reserve all of the group's special nights.",
    "Not everyone has to do everything. The excursions are full-day affairs. Divide the group by energy level and age, and bring everyone back together for dinner.",
    "Book a private transfer. With ten or more people and luggage, a private van from the airport keeps the group together and spares you from coordinating several taxis. Compare the price per person.",
  ],
  funFact: "In the first half of 2026, Punta Cana International Airport recorded 6.38 million international passenger arrivals and departures, 19.3% more than in the same period of 2025. It is the country's main gateway.",
  checklist: [
    "Passports valid for at least six months for every member of the group",
    "QR codes for the entry and exit e-Ticket",
    "Travel insurance with medical and cancellation coverage",
    "Reef-safe sunscreen, hats and rash guards",
    "Water shoes for Saona's natural pool and the cenote",
    "US dollars in small bills for tips",
    "Smart-casual clothes for the à la carte dinners",
    "A group list with rooms and phone numbers",
  ],
  transport: [
    {
      mode: "Getting there: from Mexico City",
      description: "Aeroméxico flies nonstop every day from AICM; the flight takes about 4 hours 45 minutes. Arajet flies nonstop from AIFA seven times a week.",
    },
    {
      mode: "Getting there: from Cancún",
      description: "Arajet has nonstop flights of about three hours, handy if part of the group is leaving from the southeast.",
    },
    {
      mode: "Entry requirements",
      description: "No visa for Mexican tourists. A passport valid for at least six months and the free entry and exit e-Ticket on the official Immigration portal (eticket.migracion.gob.do). Immigration may ask for a return ticket and your hotel details.",
    },
    {
      mode: "Getting around",
      description: "The airport is about 16 km from the Bávaro area. The recommended excursions include hotel pickup, so there is no need to rent a car.",
    },
    {
      mode: "Weather",
      description: "In November, temperatures range from 24 to 29 °C, the sea is around 28 °C and you get about eight hours of sun a day. Showers tend to be brief and pass quickly. The Atlantic hurricane season ends on November 30.",
    },
  ],
  timely: {
    validUntil: "2027-04-30",
    eyebrow: "This season",
    title: "November 2026 – April 2027",
    verifiedNote: "Data verified on October 23, 2026. Requirements, prices and notices apply to the November 2026 to April 2027 season.",
    essentialsTitle: "The essentials before you book",
    essentials: [
      "Mexicans don't need a visa as tourists. A passport valid for at least six months and the e-Ticket, a free entry and exit form, are enough. One person can fill it out for up to seven family members.",
      "Aeroméxico flies nonstop daily from Mexico City to Punta Cana, in about four hours and forty-five minutes; Arajet flies nonstop from AIFA.",
      "With a large group, get travel insurance with medical and cancellation coverage for everyone.",
    ],
    whenTitle: "When to go",
    whenIntro: "The route works any week of the year. What changes by date is right here.",
    window: "Suggested window: Saturday, November 14 to Friday, November 20, 2026. Monday the 16th is a no-school day for SEP schools; the rest of the week is not.",
    table: {
      headers: ["What's happening", "Dates", "What it changes for your trip"],
      rows: [
        {
          what: "Atlantic hurricane season",
          when: "June 1 to November 30",
          impact: "Get insurance with cancellation coverage and check the forecast the week you travel",
          until: "2026-11-30",
        },
        {
          what: "November weather",
          when: "All month",
          impact: "24 to 29 °C, sea around 28 °C and about eight hours of sun a day; brief showers",
          until: "2026-11-30",
        },
        {
          what: "Holy Week",
          when: "March or April, depending on the year",
          impact: "Water sports are suspended nationwide: avoid those dates if you want Saona or a catamaran",
        },
      ],
    },
    booking: {
      label: "Book with the suggested dates:",
      links: [
        {
          name: "Barceló Bávaro Palace",
          url: "https://www.booking.com/hotel/do/barcelo-bavaro-palace-deluxe.html?checkin=2026-11-14&checkout=2026-11-20&ref=lagomplan",
        },
        {
          name: "Iberostar Selection Bávaro Suites",
          url: "https://www.booking.com/hotel/do/iberostar-bavaro-suites.html?checkin=2026-11-14&checkout=2026-11-20&ref=lagomplan",
        },
        {
          name: "Lopesan Costa Bávaro",
          url: "https://www.booking.com/hotel/do/lopesan-costa-bavaro-resort-spa-amp-casino.html?checkin=2026-11-14&checkout=2026-11-20&ref=lagomplan",
        },
      ],
    },
  },
}
