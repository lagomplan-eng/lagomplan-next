import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: "nueva-york",
  locale: "en",
  hero: {
    title: "New York for Couples",
    subtitle: "A warm bagel on Bleecker Street mid-morning, tacos and cream pastries at Chelsea Market at midday, a Michelin-starred dinner in SoHo. In November, Bryant Park's Winter Village has its ice rink open and the tables that matter get booked weeks ahead. This guide builds four days for eating well, walking a lot and sleeping in neighborhoods where everything is close by.",
    eyebrow: "Curated guide · Couples · Food · Long weekend · 4 days · High budget",
    tags: ["Couples", "Food", "City", "Long weekend"],
    image: "/images/guides/nueva-york.png",
  },
  itinerary: [
    {
      day: 1,
      title: "Arrival and Greenwich Village",
      items: [
        {
          time: "Midday",
          title: "Arrival in Manhattan",
          description: "From JFK, the AirTrain plus subway is the cheapest option; with luggage, a taxi or car service saves you the transfer.",
          tags: [],
        },
        {
          time: "Early afternoon",
          title: "Check-in and a short stroll through SoHo",
          description: "",
          tags: [],
        },
        {
          time: "Mid-afternoon",
          title: "Greenwich Village food tour: bagel with cream cheese, New York pizza, cupcakes, gourmet donuts and a surprise dish",
          description: "Three hours that double as a light dinner.",
          tags: [],
        },
        {
          time: "Evening",
          title: "A drink in the neighborhood and an early night",
          description: "The big dinner is tomorrow.",
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: "Chelsea Market, the High Line and Bryant Park",
      items: [
        {
          time: "Morning",
          title: "Food tour through Chelsea Market, the Meatpacking District and the High Line",
          description: "It departs from Buddakan, 75 Ninth Avenue, and stops at Market 57 before heading up to the High Line. Groups of up to 10 people; a full lunch is included.",
          tags: [],
        },
        {
          time: "Early afternoon",
          title: "Back to the hotel, or shopping in the Meatpacking District",
          description: "",
          tags: [],
        },
        {
          time: "Around sunset",
          title: "Bryant Park Winter Village, if you travel in season (dates under When to go): more than 180 holiday stalls, a free-entry ice rink and The Lodge, a bar and food area",
          description: "Private igloos are also available by reservation.",
          tags: [],
        },
        {
          time: "Evening",
          title: "Michelin-starred dinner",
          description: "Options from the current list: Le Coucou (SoHo), Torrisi (Nolita) or Crown Shy (Financial District).",
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: "Brunch on the river and a new dinner",
      items: [
        {
          time: "Midday",
          title: "Brunch aboard the Bateaux New York, a glass-enclosed boat leaving from Chelsea Piers",
          description: "Brunch with unlimited mimosas and views of the Empire State Building, the Brooklyn Bridge and the Statue of Liberty.",
          tags: [],
        },
        {
          time: "Afternoon",
          title: "Free time: stroll the West Village on foot or unwind at the hotel spa",
          description: "",
          tags: [],
        },
        {
          time: "Evening",
          title: "Dinner at one of the restaurants the Michelin Guide added to New York in 2026: Le Chêne (Parisian cuisine, Greenwich Village), Elcielo (Colombian tasting menu, NoMad), Cove (Flynn McGarry's Californian cuisine, Hudson Square) or Hwaro (a 22-seat counter, Midtown West)",
          description: "",
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: "A last breakfast and the trip home",
      items: [
        {
          time: "Morning",
          title: "An unhurried breakfast and one last walk around the neighborhood",
          description: "",
          tags: [],
        },
        {
          time: "Midday",
          title: "Check-out",
          description: "Leave your bags at the hotel if your flight is in the afternoon.",
          tags: [],
        },
        {
          time: "Afternoon",
          title: "Head to the airport with at least three hours to spare for an international flight",
          description: "",
          tags: [],
        },
      ],
    },
  ],
  itineraryDescription: "Three nights in Manhattan, based in SoHo, Tribeca or NoMad. Two food tours, a brunch cruise and three dinners to book right now.",
  hotels: [
    {
      id: 'crosby-street-hotel',
      name: "Crosby Street Hotel",
      type: "Boutique hotel · SoHo",
      priceTier: "$$$$",
      description: "Booking.com: 9.5/10 (156 reviews) · Average price: about US$1,770 per night. On a cobblestone SoHo street, one block from the Spring Street subway. Rooms with high ceilings and big windows, a courtyard garden, a drawing room with a fireplace and a private screening room that shows films on Sundays. Its afternoon tea is among the most talked-about with guests. Booking rates its location 9.8.",
      tag: "SoHo at your door and afternoon tea in-house",
      affiliateUrl: "https://www.booking.com/hotel/us/crosby-street.html?ref=lagomplan",
      archetypes: ["Parejas"],
    },
    {
      id: 'the-greenwich-hotel',
      name: "The Greenwich Hotel",
      type: "Boutique hotel · Tribeca",
      priceTier: "$$$$",
      description: "Booking.com: 9.1/10 (62 reviews) · Reference price: from US$1,675 per night. Robert De Niro's hotel in Tribeca, with one Michelin Key. It has 88 rooms, each different from the next, the Shibui Spa with a pool and, next to the lobby, Locanda Verde, the neighborhood trattoria. Tribeca is quiet and residential: a good base for resting between long meals.",
      tag: "A spa with a pool and a trattoria downstairs",
      affiliateUrl: "https://www.booking.com/hotel/us/the-greenwich.html?ref=lagomplan",
      archetypes: ["Parejas"],
    },
    {
      id: 'the-ned-nomad',
      name: "The Ned NoMad",
      type: "Hotel · NoMad",
      priceTier: "$$$",
      description: "Booking.com: 8.1/10 (56 reviews) · Reference price: US$400 to 760 per night. A restored Beaux-Arts building at Broadway and 28th Street, with 167 rooms, the restaurant Cecconi's and access to areas of the private club. It's steps from the Flatiron and from Elcielo. The best value for the location of the three.",
      tag: "The New York of the 1920s, close to everything",
      affiliateUrl: "https://www.booking.com/hotel/us/the-ned-nomad.html?ref=lagomplan",
      archetypes: ["Parejas"],
    },
  ],
  hotelsDescription: "Three hotels in neighborhoods made for eating on foot. Booking.com ratings; average nightly prices from comparison sites in 2026, in dollars. Confirm the rate for your dates at the link.",
  experiences: [
    {
      id: 'greenwich-village-food-tour-con-6-degustaciones',
      name: "Greenwich Village Food Tour with 6 tastings",
      description: "GetYourGuide: 4.9/5 (116 reviews) · From US$101 per person. Three hours through Manhattan's bohemian neighborhood with a local guide: bagel with cream cheese, New York pizza, cupcakes, gourmet donuts and a secret dish revealed on the day. Groups of up to 12 people, free cancellation up to 24 hours before. Run by Secret Food Tours, in English.",
      tags: ["Food tour", "3 hours", "Small group", "Free cancellation"],
      category: 'comida',
      duration: 'corto',
      affiliateUrl: 'https://www.getyourguide.com/new-york-city-l59/nyc-trendy-greenwich-village-food-tour-with-6-tastings-t105856/',
    },
    {
      id: 'chelsea-market-meatpacking-y-high-line-food-tour',
      name: "Chelsea Market, Meatpacking and High Line Food Tour",
      description: "GetYourGuide: 4.7/5 (140 reviews) · From US$88 per person. A three-hour route with a maximum of 10 people: an hour of tastings at Chelsea Market, another at Market 57 facing the Hudson and the last walking the High Line with the story of its architecture. Includes a full lunch. Meeting point in front of Buddakan, 75 Ninth Avenue.",
      tags: ["Food tour", "3 hours", "Max 10 people", "Lunch included"],
      category: 'comida',
      duration: 'corto',
      affiliateUrl: 'https://www.getyourguide.com/new-york-city-l59/nyc-chelsea-market-meatpacking-high-line-food-tour-t210972/',
    },
    {
      id: 'brunch-almuerzo-o-cena-a-bordo-del-bateaux-new-york',
      name: "Brunch, Lunch or Dinner Cruise aboard the Bateaux New York",
      description: "GetYourGuide: 4.5/5 (1,055 reviews) · From US$115 per person. A City Cruises sailing on a glass-enclosed boat that leaves from Chelsea Piers and cruises the Hudson and East Rivers facing the skyline, with a private table, a three-course menu and live music. Brunch includes unlimited mimosas; dinner calls for smart-casual attire and costs more than the entry price. For a couple, it's the way to see the Statue of Liberty without the lines.",
      tags: ["Cruise", "2 to 3 hours", "Meal included", "Dress code at dinner"],
      category: 'comida',
      duration: 'corto',
      affiliateUrl: 'https://www.getyourguide.com/new-york-city-l59/nyc-city-cruises-luxury-brunch-lunch-or-dinner-cruise-t279782/',
    },
  ],
  experiencesDescription: "Three GetYourGuide experiences for eating your way through the city, neighborhood by neighborhood. GetYourGuide rating and price per person as of October 23, 2026, in dollars.",
  tips: [
    "Book dinners before your flight. Michelin Guide restaurants open their tables weeks in advance and fill up fast on weekends. Have a backup for each night.",
    "One food tour a day is plenty. Each tour amounts to a full meal. If you do the Chelsea one at midday, the Michelin-starred dinner is more enjoyable on an appetite.",
    "Tip is not included. At restaurants, figure 18 to 20% of the bill before tax.",
    "The subway is your best transportation. Each ride costs 3 dollars and you pay by tapping your card or phone at the turnstile. Each person should use their own card: the weekly cap is calculated per card.",
  ],
  funFact: "The Michelin Guide published its first North American edition in New York, in 2005. Today the city has more than 350 restaurants in the selection, and the guide adds new places throughout the year before handing out stars in December.",
  checklist: [
    "Valid passport and U.S. visa",
    "Coat, scarf and gloves: nights drop to 3 to 7 °C",
    "Comfortable walking shoes and another pair for dinners",
    "Smart-casual clothes if you take the evening cruise",
    "Credit card or phone with contactless payment for the subway",
    "Compact umbrella: November is rainy",
    "Restaurant confirmations saved on your phone",
  ],
  transport: [
    {
      mode: "Getting there: by air",
      description: "New York has three airports: JFK, LaGuardia and Newark. From JFK, the AirTrain costs 8.25 dollars and connects to the subway into Manhattan. A taxi or car service is more comfortable with luggage.",
    },
    {
      mode: "Getting there: documents",
      description: "Valid passport and a B1/B2 visa. Check that your visa doesn't expire during the trip.",
    },
    {
      mode: "Getting around the city",
      description: "Since January 2026, the subway and buses are paid for with OMNY only: you tap your credit card, debit card or phone on the reader. A ride costs 3 dollars and there's a weekly cap of 35 dollars per card. If you don't have a contactless card, a physical OMNY card is sold at stations. For short hops between SoHo, the Village and Chelsea, walking is fastest.",
    },
    {
      mode: "Weather",
      description: "In mid-November, highs in Central Park hover around 10 to 14 °C and lows around 3 to 7 °C. It's a rainy month and the wind off the river makes it feel colder. Dress in layers.",
    },
  ],
  timely: {
    validUntil: "2026-12-31",
    eyebrow: "This season",
    title: "November and December 2026",
    verifiedNote: "Data verified on October 23, 2026. Prices, hours and events apply to the November and December 2026 season.",
    essentialsTitle: "The essentials before you book",
    essentials: [
      "You need a valid U.S. visa (B1/B2) and a passport.",
      "Michelin-starred dinners are booked weeks in advance.",
      "The subway is paid for only by contactless card or phone (OMNY): the MetroCard is no longer sold.",
    ],
    whenTitle: "When to go",
    whenIntro: "The route works on any long weekend in November or December. What changes depending on the date is here.",
    window: "Suggested window: Friday, November 13 to Monday, November 16, 2026, the Mexican Revolution Day long weekend. Monday the 16th is an official day off in Mexico, with no classes at SEP schools.",
    table: {
      headers: ["What's happening", "2026 dates", "What it changes for your trip"],
      rows: [
        {
          what: "Bryant Park Winter Village",
          when: "Shops from October 28 to January 3; rink through February 28, 2027",
          impact: "Free-entry rink from 8:00 am to 10:00 pm; from November 19 to January 3 it stays open until midnight",
        },
        {
          what: "Private igloos at Bryant Park",
          when: "From November 5",
          impact: "Food and drink in a dome beside the rink; reserve in advance",
        },
        {
          what: "Thanksgiving and the Macy's parade",
          when: "Thursday, November 26",
          impact: "A high-demand weekend: book your hotel and dinners further ahead",
          until: "2026-11-26",
        },
        {
          what: "Union Square and Grand Central holiday markets",
          when: "Usually open in mid-November",
          impact: "Confirm the 2026 dates before you go",
        },
        {
          what: "Michelin Northeast Cities ceremony",
          when: "December 14",
          impact: "Until that date the current star list applies; afterward, check the new 2026 stars",
          until: "2026-12-14",
        },
      ],
    },
    booking: {
      label: "Book with the suggested dates:",
      links: [
        {
          name: "Crosby Street Hotel",
          url: "https://www.booking.com/hotel/us/crosby-street.html?checkin=2026-11-13&checkout=2026-11-16&ref=lagomplan",
        },
        {
          name: "The Greenwich Hotel",
          url: "https://www.booking.com/hotel/us/the-greenwich.html?checkin=2026-11-13&checkout=2026-11-16&ref=lagomplan",
        },
        {
          name: "The Ned NoMad",
          url: "https://www.booking.com/hotel/us/the-ned-nomad.html?checkin=2026-11-13&checkout=2026-11-16&ref=lagomplan",
        },
      ],
    },
  },
}
