/**
 * lib/guides.ts
 * Static guide data layer.
 *
 * Each guide is a single bilingual object.
 * No duplication per language — both locales read from the same record.
 *
 * Swap strategy: replace getAllGuides() with a Supabase/CMS call later.
 * Every consumer already calls the helpers below, so zero call-site changes needed.
 */

import type { Locale }       from '../i18n'
import type { LocalizedEntity } from './routes'

// ── Types ─────────────────────────────────────────────────

export interface GuideSection {
  heading_es: string
  heading_en: string
  body_es:    string
  body_en:    string
  tip_es?:    string   // optional callout / lagom tip
  tip_en?:    string
}

export interface QuickInfo {
  duration_es:  string
  duration_en:  string
  best_time_es: string
  best_time_en: string
  trip_type_es: string
  trip_type_en: string
  budget_es:    string
  budget_en:    string
}

export interface Itinerary {
  day:      number
  title_es: string
  title_en: string
  items_es: string[]
  items_en: string[]
}

export interface Experience {
  title_es:       string
  title_en:       string
  description_es: string
  description_en: string
  badge_es:       string
  badge_en:       string
}

/**
 * Optional structured hotel data for the "Where to stay" inline section.
 * Currently unused in guide data — available for future rich content.
 */
export interface Hotel {
  name_es:        string
  name_en:        string
  description_es: string
  description_en: string
  image?:         string
  booking_url?:   string
}

export interface Guide extends LocalizedEntity {
  // slugs (inherited from LocalizedEntity)
  slug_es: string
  slug_en: string

  // metadata
  title_es:       string
  title_en:       string
  excerpt_es:     string
  excerpt_en:     string
  destination_es: string
  destination_en: string
  tags_es:        string[]
  tags_en:        string[]
  cover_img:      string    // path under /public/images/guides/

  // extended content (optional — present on rich guides, absent on legacy)
  quick_info?:      QuickInfo
  overview_es?:     string
  overview_en?:     string
  itineraries?:     Itinerary[]
  experiences?:     Experience[]
  hotels?:          Hotel[]           // optional curated hotel list for inline display
  tips_content_es?: string[]
  tips_content_en?: string[]

  // content
  sections:       GuideSection[]
}

// ── Data ──────────────────────────────────────────────────

const GUIDES: Guide[] = [
  {
    slug_es: 'valle-de-bravo-avandaro-aventura-en-familia',
    slug_en: 'valle-de-bravo-avandaro-family-adventure',

    title_es: 'Valle de Bravo / Avándaro',
    title_en: 'Valle de Bravo / Avándaro',

    excerpt_es: 'Agua, bosque y ritmo lento a dos horas de la Ciudad de México. La escapada perfecta para familias que quieren desconectar sin complicarse el plan.',
    excerpt_en: 'Water, forest, and slow rhythm two hours from Mexico City. The perfect getaway for families who want to disconnect without overcomplicating the plan.',

    destination_es: 'Estado de México',
    destination_en: 'State of Mexico',

    tags_es: ['Familia', 'Naturaleza', 'Fin de semana', 'Aventura'],
    tags_en: ['Family', 'Nature', 'Weekend', 'Adventure'],

    cover_img: '/images/guides/valle-de-bravo.jpg',

    sections: [
      {
        heading_es: 'Por qué ir',
        heading_en: 'Why go',
        body_es: 'Valle de Bravo combina el lago, los cerros y un pueblo con arquitectura colonial que sigue teniendo personalidad. A diferencia de otros destinos de fin de semana, aquí el ritmo no está dictado por el turismo masivo: la prioridad es el aire libre y la comida de mercado.',
        body_en: 'Valle de Bravo combines the lake, the hills, and a colonial town that still has personality. Unlike other weekend destinations, the pace here is not dictated by mass tourism: the priority is the outdoors and market food.',
        tip_es: 'Llega el viernes a las 3pm — evitas el tráfico del Paseo de la Reforma y llegas antes del atardecer.',
        tip_en: 'Arrive Friday at 3pm — you avoid Paseo de la Reforma traffic and get there before sunset.',
      },
      {
        heading_es: 'Dónde quedarse',
        heading_en: 'Where to stay',
        body_es: 'Los mejores hoteles están en el centro o con vista al lago. Evita los que quedan sobre la carretera: el ruido arruina la experiencia. Para familias, busca propiedades con jardín o alberca. Los Veleros y Avándaro tienen las mejores opciones con más espacio y tranquilidad.',
        body_en: 'The best hotels are in the center or with lake views. Avoid those on the highway — the noise ruins the experience. For families, look for properties with a garden or pool. Los Veleros and Avándaro have the best options with more space and calm.',
      },
      {
        heading_es: 'Qué hacer',
        heading_en: 'What to do',
        body_es: 'Paseo en lancha por el lago (mañana temprano, antes de que haya viento). Renta de bicicletas en el centro. Caminata al mirador de La Peña. Para niños: el parque de aventura Velo Velo tiene tirolesas y árboles de escalada que aguantan fácil tres horas.',
        body_en: 'Boat ride on the lake (early morning, before the wind picks up). Bike rentals in the center. Hike to La Peña viewpoint. For kids: Velo Velo adventure park has zip lines and climbing trees that easily fill three hours.',
        tip_es: 'El mercado del centro los sábados tiene los mejores tlayudas y memelas de todo el estado.',
        tip_en: 'The Saturday market in the center has the best tlayudas and memelas in the whole state.',
      },
      {
        heading_es: 'Dónde comer',
        heading_en: 'Where to eat',
        body_es: 'La Michoacana del Lago para helados de temporada con vista. El Santuario tiene la mejor terraza para cenar con niños. Para desayuno: Café Del Valle, sencillo y siempre bueno. Evita los restaurantes de la plaza en fin de semana — hay mucha lista de espera y la comida es turística.',
        body_en: 'La Michoacana del Lago for seasonal ice cream with a view. El Santuario has the best terrace for dinner with kids. For breakfast: Café Del Valle, simple and always good. Avoid the plaza restaurants on weekends — long waits and tourist-grade food.',
      },
      {
        heading_es: 'Cómo llegar y moverse',
        heading_en: 'Getting there and around',
        body_es: 'Autopista México–Toluca hasta Toluca, luego libramiento a Valle. En total: 2–2.5 horas desde CDMX dependiendo del tráfico. Una vez ahí, todo el centro se camina. Para Avándaro necesitas coche o taxi.',
        body_en: 'Mexico–Toluca expressway to Toluca, then the ring road to Valle. Total: 2–2.5 hours from CDMX depending on traffic. Once there, the whole center is walkable. For Avándaro you need a car or taxi.',
      },
    ],
  },

  {
    slug_es: 'riviera-maya-roadtrip-de-semana-santa',
    slug_en: 'riviera-maya-easter-road-trip',

    title_es: 'Riviera Maya',
    title_en: 'Riviera Maya',

    excerpt_es: 'Roadtrip de Semana Santa por la costa: Cancún, Playa del Carmen, Tulum y los cenotes en el camino. Cómo hacerlo sin que se convierta en caravana de tráfico y peleas de hotel.',
    excerpt_en: 'Easter road trip along the coast: Cancún, Playa del Carmen, Tulum, and cenotes along the way. How to do it without it turning into a traffic convoy and hotel fights.',

    destination_es: 'Quintana Roo',
    destination_en: 'Quintana Roo',

    tags_es: ['Playa', 'Roadtrip', 'Cenotes', 'Semana Santa'],
    tags_en: ['Beach', 'Road trip', 'Cenotes', 'Easter'],

    cover_img: '/images/guides/riviera-maya.jpg',

    sections: [
      {
        heading_es: 'La ruta recomendada',
        heading_en: 'The recommended route',
        body_es: 'Olvida ir de norte a sur — todo el mundo lo hace. Llega a Cancún, sube directo a Tulum el primer día, y ve subiendo hacia el norte durante el resto del viaje. Así esquivas el tráfico masivo y encuentras los cenotes sin filas.',
        body_en: 'Forget going north to south — everyone does it. Arrive in Cancún, go straight to Tulum on day one, and work your way north for the rest of the trip. This way you dodge mass traffic and find cenotes without queues.',
        tip_es: 'Reserva el cenote Dos Ojos con al menos 2 semanas de anticipación en Semana Santa.',
        tip_en: 'Book Cenote Dos Ojos at least 2 weeks in advance for Easter week.',
      },
      {
        heading_es: 'Playas que valen la pena',
        heading_en: 'Beaches worth it',
        body_es: 'Playa Paraíso en Tulum antes de las 8am (después es caos). Xpu-Ha es el secreto mejor guardado de la Riviera — arena blanca, aguas turquesas, sin clubs de playa. Akumal para ver tortugas marinas de manera segura y sin tour.',
        body_en: 'Playa Paraíso in Tulum before 8am (after that it\'s chaos). Xpu-Ha is the Riviera\'s best kept secret — white sand, turquoise water, no beach clubs. Akumal for sea turtles safely and without a tour.',
      },
      {
        heading_es: 'Cenotes imperdibles',
        heading_en: 'Must-see cenotes',
        body_es: 'Gran Cenote (Tulum): el más fotogénico, llega a las 8am. Ik Kil (Chichén Itzá): camino de regreso perfecto. Cenote Azul (Bacalar): el mejor para flotar sin multitudes. Evita los cenotes de la carretera 307 en Semana Santa — son trampas turísticas.',
        body_en: 'Gran Cenote (Tulum): the most photogenic, arrive at 8am. Ik Kil (Chichén Itzá): perfect on the way back. Cenote Azul (Bacalar): the best for floating without crowds. Avoid the highway 307 cenotes during Easter — tourist traps.',
      },
      {
        heading_es: 'Dónde comer en cada parada',
        heading_en: 'Where to eat at each stop',
        body_es: 'Tulum: La Eufemia para cenas, El Camello para mariscos sin pretensiones. Playa del Carmen: Babe\'s Noodles para romper con lo típico. Cancún: El Fish Fritanga en Mercado 28, lejos del Hotel Zone.',
        body_en: 'Tulum: La Eufemia for dinner, El Camello for no-frills seafood. Playa del Carmen: Babe\'s Noodles to break from the obvious. Cancún: El Fish Fritanga at Mercado 28, away from the Hotel Zone.',
      },
    ],
  },

  // ── Rich mock guide (uses all extended fields) ────────────
  {
    slug_es: 'oaxaca-guia-esencial',
    slug_en: 'oaxaca-essential-guide',

    title_es: 'Oaxaca',
    title_en: 'Oaxaca',

    excerpt_es: 'La ciudad con la gastronomía más celebrada de México, tradición artesanal viva y un centro histórico que todavía tiene escala humana. Una guía sin concesiones.',
    excerpt_en: "Mexico's most celebrated culinary city, living artisan tradition, and a historic center that still has human scale. An uncompromising guide.",

    destination_es: 'Oaxaca',
    destination_en: 'Oaxaca',

    tags_es: ['Gastronomía', 'Cultura', 'Artesanía', 'Largo fin de semana'],
    tags_en: ['Gastronomy', 'Culture', 'Craft', 'Long weekend'],

    cover_img: '/images/guides/oaxaca.jpg',

    quick_info: {
      duration_es:  '3–5 días',
      duration_en:  '3–5 days',
      best_time_es: 'Oct–Mar',
      best_time_en: 'Oct–Mar',
      trip_type_es: 'Cultural',
      trip_type_en: 'Cultural',
      budget_es:    'Medio–Alto',
      budget_en:    'Mid–High',
    },

    overview_es: 'Oaxaca es uno de esos destinos que justifica el cliché: hay que ir al menos una vez. El centro histórico, Patrimonio de la Humanidad, es sorprendentemente compacto y caminable. Pero lo que hace a Oaxaca única es la superposición de capas — arqueología zapoteca, cocina indígena convertida en alta gastronomía, artesanía que compite con los mejores museos del mundo, y una vida de barrio que ningún tour va a enseñarte. Esta guía es para los que quieren ir más allá del circuito básico.',
    overview_en: "Oaxaca is one of those destinations that justifies the cliché: you have to go at least once. The historic center, a UNESCO World Heritage Site, is surprisingly compact and walkable. But what makes Oaxaca unique is the layering — Zapotec archaeology, indigenous cuisine elevated to haute gastronomy, craft that rivals the world's best museums, and a neighborhood life that no tour will show you. This guide is for those who want to go beyond the standard circuit.",

    itineraries: [
      {
        day: 1,
        title_es: 'Centro histórico y el mercado',
        title_en: 'Historic center and the market',
        items_es: [
          'Desayuna en el Mercado 20 de Noviembre — memelas, tlayudas y chocolate caliente.',
          'Sube a la terraza del Hotel Marqués del Valle para ver la catedral sin multitudes.',
          'Santo Domingo: la iglesia más barroca de México. Entra al museo del convento.',
          'Almuerza en La Biznaga — cocina oaxaqueña sin pretensiones, excelente valor.',
          'Tarde: Barrio de Jalatlaco, a 10 minutos a pie del zócalo.',
          'Cena en Criollo (reserva con anticipación) o Levadura de Olla.',
        ],
        items_en: [
          'Breakfast at Mercado 20 de Noviembre — memelas, tlayudas, and hot chocolate.',
          'Head up to the Hotel Marqués del Valle terrace to see the cathedral without crowds.',
          "Santo Domingo: Mexico's most baroque church. Go into the convent museum.",
          'Lunch at La Biznaga — Oaxacan cuisine without pretense, excellent value.',
          'Afternoon: Jalatlaco neighborhood, a 10-minute walk from the zócalo.',
          'Dinner at Criollo (book ahead) or Levadura de Olla.',
        ],
      },
      {
        day: 2,
        title_es: 'Monte Albán y mezcal en el valle',
        title_en: 'Monte Albán and mezcal in the valley',
        items_es: [
          'Monte Albán a las 8am — tienes la zona arqueológica casi para ti solo.',
          'Regresa al centro para el almuerzo. La Olla, siempre confiable.',
          'Tarde: ruta de mezcal en los Valles Centrales. Destilería In Situ o El Cortijo.',
          'Cena en Los Danzantes — terraza frente a Santo Domingo.',
        ],
        items_en: [
          "Monte Albán at 8am — you'll have the archaeological site almost to yourself.",
          "Return to the center for lunch. La Olla, always reliable.",
          'Afternoon: mezcal route in the Central Valleys. Destilería In Situ or El Cortijo.',
          'Dinner at Los Danzantes — terrace facing Santo Domingo.',
        ],
      },
      {
        day: 3,
        title_es: 'Pueblos artesanales',
        title_en: 'Artisan villages',
        items_es: [
          'San Bartolo Coyotepec: cerámica negra. El taller de Doña Rosa vale la pena.',
          'Teotitlán del Valle: tapetes de lana. Compra en los talleres familiares, no en el mercado de entrada.',
          'Tlacolula: el mercado más auténtico de la región (solo domingos).',
          'De regreso: parada en el árbol del Tule en Santa María del Tule.',
        ],
        items_en: [
          'San Bartolo Coyotepec: black clay ceramics. Doña Rosa\'s workshop is worth it.',
          'Teotitlán del Valle: wool tapetes. Buy directly from family workshops, not the entrance market.',
          'Tlacolula: the most authentic market in the region (Sundays only).',
          'On the way back: stop at the Tule tree in Santa María del Tule.',
        ],
      },
    ],

    experiences: [
      {
        title_es:       'Clase de cocina con chef local',
        title_en:       'Cooking class with local chef',
        description_es: 'Aprende mole negro desde cero: mercado, molino tradicional y fogón en cocina de casa. Grupos de máximo 8 personas.',
        description_en: 'Learn mole negro from scratch: market, traditional mill, and open fire in a home kitchen. Groups of maximum 8.',
        badge_es:       'Gastronomía',
        badge_en:       'Gastronomy',
      },
      {
        title_es:       'Cata de mezcal en palenque artesanal',
        title_en:       'Mezcal tasting at artisan palenque',
        description_es: 'Visita un palenque familiar en los Valles Centrales. El proceso artesanal y la diferencia con el mezcal industrial son brutales.',
        description_en: 'Visit a family palenque in the Central Valleys. The artisanal process and the difference from industrial mezcal is stark.',
        badge_es:       'Cultura',
        badge_en:       'Culture',
      },
      {
        title_es:       'Taller de tejido en Teotitlán',
        title_en:       'Weaving workshop in Teotitlán',
        description_es: 'Dos horas aprendiendo el telar tradicional con una familia local. Incluye demostración de tintes naturales con cochinilla e índigo.',
        description_en: 'Two hours learning the traditional loom with a local family. Includes a natural dye demonstration with cochineal and indigo.',
        badge_es:       'Artesanía',
        badge_en:       'Craft',
      },
    ],

    tips_content_es: [
      'Reserva restaurantes top con 3–5 días de anticipación en temporada alta (nov–ene). Criollo y Origen se llenan rápido.',
      'Monte Albán: llega antes de las 9am. Después de las 11am el calor y las multitudes son insoportables. Lleva agua y sombrero.',
      'El mezcal más honesto está en los palenques, no en los bares del centro. Vale la pena salir de la ciudad al menos una tarde.',
      'Las artesanías más auténticas (y baratas) se consiguen directo en los talleres de los pueblos, no en el Mercado de Artesanías del centro.',
      'Guelaguetza (julio): si coincide con tu viaje, reserva con meses de anticipación. Las entradas buenas se agotan en horas.',
      'Uber funciona bien en la ciudad y es más económico que los taxis del aeropuerto. Úsalo desde que aterrices.',
    ],

    tips_content_en: [
      'Book top restaurants 3–5 days ahead during high season (Nov–Jan). Criollo and Origen fill up fast.',
      'Monte Albán: arrive before 9am. After 11am the heat and crowds are unbearable. Bring water and a hat.',
      'The most honest mezcal is at the palenques, not the city center bars. Worth leaving the city for at least one afternoon.',
      'The most authentic (and cheapest) crafts are found at village workshops, not at the city\'s Mercado de Artesanías.',
      'Guelaguetza (July): if it coincides with your trip, book months ahead. Good tickets sell out in hours.',
      'Uber works well in the city and is cheaper than airport taxis. Use it from the moment you land.',
    ],

    sections: [
      {
        heading_es: 'Por qué ir',
        heading_en: 'Why go',
        body_es: 'Oaxaca tiene la densidad cultural más alta de cualquier ciudad mexicana de su tamaño. En un fin de semana largo puedes comer en uno de los mejores restaurantes de México, visitar una zona arqueológica de primer nivel, comprar artesanía que es arte contemporáneo y entender algo de la cosmovisión zapoteca. Todo a escala caminable.',
        body_en: "Oaxaca has the highest cultural density of any Mexican city its size. In a long weekend you can eat at one of Mexico's best restaurants, visit a first-class archaeological site, buy craft that is contemporary art, and understand something of the Zapotec worldview. All at walkable scale.",
        tip_es: 'La Guelaguetza en julio es espectacular, pero octubre–noviembre es más tranquilo y perfectamente bueno.',
        tip_en: 'Guelaguetza in July is spectacular, but October–November is calmer and perfectly fine.',
      },
      {
        heading_es: 'Dónde quedarse',
        heading_en: 'Where to stay',
        body_es: 'El centro histórico es la única opción sensata sin coche. Los hoteles boutique de Jalatlaco son los mejores de la ciudad — Casa Antonieta y Quinta Real tienen los jardines más bonitos. Para presupuesto ajustado, los hostales del centro son sorprendentemente buenos.',
        body_en: "The historic center is the only sensible option without a car. Jalatlaco boutique hotels are the city's best — Casa Antonieta and Quinta Real have the most beautiful gardens. For tighter budgets, the city center hostels are surprisingly good.",
      },
      {
        heading_es: 'Cómo llegar',
        heading_en: 'Getting there',
        body_es: 'Vuelo directo desde CDMX: 1 hora. Low-cost (VivaAerobus, Volaris) tienen rutas frecuentes — reserva con 2 semanas mínimo en temporada alta. Alternativa: bus ADO nocturno desde TAPO (6–7 horas), cómodo si no te importa llegar de madrugada.',
        body_en: 'Direct flight from CDMX: 1 hour. Budget airlines (VivaAerobus, Volaris) have frequent routes — book at least 2 weeks ahead in high season. Alternative: ADO overnight bus from TAPO (6–7 hours), comfortable if you don\'t mind arriving in the early morning.',
        tip_es: 'El aeropuerto está a 9 km del centro. Uber o taxi autorizado: 15 minutos y ~180 MXN.',
        tip_en: 'The airport is 9km from the center. Uber or authorized taxi: 15 minutes and ~180 MXN.',
      },
    ],
  },

  {
    slug_es: 'cuernavaca-refugio-de-primavera-estilo',
    slug_en: 'cuernavaca-spring-getaway-and-style',

    title_es: 'Cuernavaca',
    title_en: 'Cuernavaca',

    excerpt_es: 'La ciudad de la eterna primavera tiene más que jardines y fin de semana clasemediero. Guía editorial para descubrir sus vecindades, mercados y la arquitectura que no aparece en TripAdvisor.',
    excerpt_en: 'The city of eternal spring has more than gardens and middle-class weekends. An editorial guide to discovering its neighborhoods, markets, and the architecture that doesn\'t show up on TripAdvisor.',

    destination_es: 'Morelos',
    destination_en: 'Morelos',

    tags_es: ['Estilo de vida', 'Gastronomía', 'Arquitectura', 'Primavera'],
    tags_en: ['Lifestyle', 'Food', 'Architecture', 'Spring'],

    cover_img: '/images/guides/cuernavaca.jpg',

    sections: [
      {
        heading_es: 'Más allá del jardín Borda',
        heading_en: 'Beyond Jardín Borda',
        body_es: 'El circuito turístico básico de Cuernavaca es aburrido. La ciudad real está en las vecindades del centro histórico, el barrio de Tlaltenango y los alrededores del MUAA. Si solo tienes una tarde, camina desde el zócalo hacia Tlaltenango sin plan.',
        body_en: 'The basic tourist circuit in Cuernavaca is boring. The real city is in the historic center neighborhoods, the Tlaltenango district, and the surroundings of the MUAA. If you only have an afternoon, walk from the zócalo toward Tlaltenango without a plan.',
        tip_es: 'El Palacio de Cortés tiene una de las murallas de Diego Rivera menos visitadas del país. Entra.',
        tip_en: 'Cortés Palace has one of Diego Rivera\'s least-visited murals in the country. Go in.',
      },
      {
        heading_es: 'Dónde quedarse con criterio',
        heading_en: 'Where to stay with taste',
        body_es: 'Las villas con jardín son la razón real de ir. Busca propiedades en el barrio de Lomas de Cortés o cerca del Río Apatlaco. Hotel Las Mañanitas sigue siendo el referente si el presupuesto lo permite — el jardín con pavos reales es genuino, no kitsch.',
        body_en: 'Garden villas are the real reason to go. Look for properties in the Lomas de Cortés neighborhood or near the Apatlaco River. Hotel Las Mañanitas is still the benchmark if the budget allows — the peacock garden is genuine, not kitsch.',
      },
      {
        heading_es: 'Dónde comer',
        heading_en: 'Where to eat',
        body_es: 'Mercado Adolfo López Mateos: el mejor caldo tlalpeño de Morelos. La Universal: clásico para cecina con verdolagas. Los Arcos: terraza con vista al Palacio de Cortés, buen mezcal. Evita las cadenas del malecón.',
        body_en: 'Mercado Adolfo López Mateos: the best caldo tlalpeño in Morelos. La Universal: a classic for cecina with verdolagas. Los Arcos: terrace with views of the Cortés Palace, good mezcal. Avoid the chains on the malecón.',
      },
      {
        heading_es: 'Cómo llegar',
        heading_en: 'Getting there',
        body_es: 'Autopista del Sol desde el Periférico Sur: 1h 20min sin tráfico. Los viernes después de las 3pm la autopista es un estacionamiento. Si viajas ese día, sal antes de la 1pm o después de las 8pm. Los autobuses Pullman de Morelos desde Taxqueña son sorprendentemente buenos.',
        body_en: 'Autopista del Sol from Periférico Sur: 1h 20min without traffic. Friday afternoons after 3pm the highway is a parking lot. If traveling that day, leave before 1pm or after 8pm. Pullman de Morelos buses from Taxqueña are surprisingly good.',
        tip_es: 'Google Maps subestima siempre el tiempo en viernes — súmale 40 minutos.',
        tip_en: 'Google Maps always underestimates Friday travel time — add 40 minutes.',
      },
    ],
  },

  // ── Cancún ─────────────────────────────────────────────
  {
    slug_es: 'cancun-guia-familiar',
    slug_en: 'cancun-family-guide',
    title_es: 'Cancún',
    title_en: 'Cancún',
    excerpt_es: 'El azul más famoso del mundo para todas las edades. Una pausa equilibrada entre el confort del resort, la aventura natural y el valor inteligente.',
    excerpt_en: "The world's most famous blue for all ages. A balanced pause between resort comfort, natural adventure, and smart value.",
    destination_es: 'Quintana Roo',
    destination_en: 'Quintana Roo',
    tags_es: ['Familia', 'Playa', 'Todo incluido'],
    tags_en: ['Family', 'Beach', 'All-inclusive'],
    cover_img: '/images/guides/cancun.jpg',
    sections: [
      {
        heading_es: 'Por qué ir',
        heading_en: 'Why go',
        body_es: 'Cancún es el destino familiar por excelencia del Caribe mexicano. El mar turquesa, los parques temáticos de clase mundial y la facilidad logística lo hacen ideal para familias de todos los tamaños. La clave está en saber moverse inteligentemente y evitar las trampas turísticas.',
        body_en: "Cancún is the quintessential family destination on the Mexican Caribbean. The turquoise sea, world-class theme parks, and logistical ease make it ideal for families of all sizes. The key is knowing how to move around smartly and avoid tourist traps.",
      },
      {
        heading_es: 'Dónde quedarse',
        heading_en: 'Where to stay',
        body_es: 'Nizuc Resort & Spa: el refugio de lujo más exclusivo, ideal para paz y playa sin sargazo. Grand Fiesta Americana Coral Beach: el mejor deal familiar de alta gama, recientemente todo incluido con gastronomía superior. Aloft Cancún: la opción smart — sin frente de playa pero a pasos del mar y perfecta para invertir el presupuesto en excursiones.',
        body_en: 'Nizuc Resort & Spa: the most exclusive luxury retreat, ideal for peace and sargazo-free beach. Grand Fiesta Americana Coral Beach: the best upscale family deal, recently all-inclusive with superior gastronomy. Aloft Cancún: the smart option — no beachfront but steps from the sea, perfect for investing your budget in excursions.',
        tip_es: 'Usa el autobús local R1 o R2 para moverte por la Zona Hotelera. Cuesta 12 pesos y pasa cada 2 minutos — mejor que los taxis de 40 USD.',
        tip_en: 'Use the local R1 or R2 bus around the Hotel Zone. It costs 12 pesos and comes every 2 minutes — better than USD 40 taxis.',
      },
      {
        heading_es: 'Qué hacer',
        heading_en: 'What to do',
        body_es: 'Isla Mujeres en ferry UltraMar: alquila un carrito de golf y pasa el día en Playa Norte, agua tan tranquila que parece una alberca gigante. Xcaret: la inversión vale — el show nocturno de cultura mexicana es experiencia que los niños recordarán toda la vida (reserva con 21 días para 15% de descuento). Cenote Azul a 1.5 horas: perfecto para niños que no se sienten cómodos en cuevas cerradas.',
        body_en: 'Isla Mujeres by UltraMar ferry: rent a golf cart and spend the day at Playa Norte, water so calm it feels like a giant pool. Xcaret: the investment is worth it — the Mexican culture night show is an experience kids will remember forever (book 21 days ahead for 15% off). Cenote Azul 1.5 hours away: perfect for kids not comfortable in enclosed caves.',
        tip_es: 'El Chedraui Selecto de la Zona Hotelera tiene comida gourmet preparada, bloqueadores y bebidas a precios de ciudad — ideal para picnic de playa y ahorrar.',
        tip_en: 'The Zona Hotelera Chedraui Selecto has prepared gourmet food, sunscreen, and drinks at city prices — perfect for a beach picnic and saving money.',
      },
      {
        heading_es: 'Cómo llegar',
        heading_en: 'Getting there',
        body_es: 'Aeropuerto de Cancún (CUN). Prohibido tomar taxi al llegar — son excesivamente caros. Reserva un shuttle privado con anticipación (Happy Shuttle, USA Transfers). Es más barato, seguro y te esperan con tu nombre.',
        body_en: 'Cancún Airport (CUN). Do not take a taxi on arrival — they are excessively expensive. Book a private shuttle in advance (Happy Shuttle, USA Transfers). Cheaper, safe, and they wait with your name.',
      },
    ],
  },

  // ── Ciudad de México ────────────────────────────────────
  {
    slug_es: 'ciudad-de-mexico-guia-de-parejas',
    slug_en: 'mexico-city-couples-guide',
    title_es: 'Ciudad de México',
    title_en: 'Mexico City',
    excerpt_es: 'Una metrópoli que respira creatividad en cada esquina. El pulso perfecto entre museos de clase mundial y una de las escenas gastronómicas más excitantes del planeta.',
    excerpt_en: 'A metropolis that breathes creativity around every corner. The perfect pulse between world-class museums and one of the most exciting food scenes on the planet.',
    destination_es: 'Ciudad de México',
    destination_en: 'Mexico City',
    tags_es: ['Parejas', 'Gastronomía', 'Cultura', 'Arte'],
    tags_en: ['Couples', 'Food', 'Culture', 'Art'],
    cover_img: '/images/guides/cdmx.jpg',
    sections: [
      {
        heading_es: 'Por qué ir',
        heading_en: 'Why go',
        body_es: 'La CDMX tiene más de 150 espacios culturales — podrías visitar uno diferente cada semana durante 3 años y no terminarías. Para parejas, la combinación de museos de primer nivel, gastronomía de autor y barrios con personalidad es imbatible. La clave: no intentar verlo todo — ir despacio y en profundidad.',
        body_en: 'CDMX has over 150 cultural spaces — you could visit a different one every week for 3 years and not finish. For couples, the combination of top-tier museums, chef-driven restaurants, and neighborhood personality is unbeatable. The key: do not try to see everything — go slow and deep.',
        tip_es: 'El domingo cierra Reforma a los coches. Alquila una bici y pedalea desde Chapultepec hasta el Centro — la CDMX más linda.',
        tip_en: 'On Sundays Reforma closes to cars. Rent a bike and pedal from Chapultepec to the Center — the most beautiful version of CDMX.',
      },
      {
        heading_es: 'Dónde quedarse',
        heading_en: 'Where to stay',
        body_es: 'The Ritz-Carlton: lujo en las alturas con vistas románticas al Castillo de Chapultepec. Brick Hotel (Roma Norte): fachada del siglo XX, interior moderno — base ideal para explorar galerías a pie. Casa Cuenca: refugio contemporáneo con restaurante romántico, perfecto para estancias largas.',
        body_en: 'The Ritz-Carlton: high-altitude luxury with romantic views of Chapultepec Castle. Brick Hotel (Roma Norte): early-20th-century facade, modern interior — ideal base for gallery-hopping on foot. Casa Cuenca: contemporary retreat with a romantic restaurant, perfect for longer stays.',
      },
      {
        heading_es: 'Qué hacer',
        heading_en: 'What to do',
        body_es: 'Casa Luis Barragán: reserva con meses de anticipación — la experiencia arquitectónica más íntima de la ciudad. Ruta de galerías en la San Rafael: arte contemporáneo de alto nivel sin multitudes (Hilario Galguera, Eco). Cena en barra de autor: Expendio de Maíz o Máximo — ver la precisión del chef a centímetros es el lujo relajado máximo.',
        body_en: "Casa Luis Barragán: book months ahead — the most intimate architectural experience in the city. Gallery route in San Rafael: world-class contemporary art without crowds (Hilario Galguera, Eco). Dinner at the chef's counter: Expendio de Maíz or Máximo — watching precision up close is the ultimate relaxed luxury.",
        tip_es: 'Si no consigues mesa en los top de la Roma, llega en la apertura y pide barra — casi siempre guardan asientos para parejas walk-in.',
        tip_en: "If you can't get a table at Roma's top spots, arrive at opening and ask for bar seats — they almost always keep spots for walk-in couples.",
      },
      {
        heading_es: 'Cómo moverse',
        heading_en: 'Getting around',
        body_es: 'No rentes coche — la CDMX es la capital del tráfico. Uber para distancias largas, EcoBici entre Roma, Condesa y Reforma. Si llegas al AICM, camina hacia las salidas autorizadas para apps — más rápido y económico que el taxi oficial.',
        body_en: "Don't rent a car — CDMX is the traffic capital. Uber for long distances, EcoBici between Roma, Condesa, and Reforma. If you arrive at AICM, walk to the app-authorized exit — faster and cheaper than the official taxi.",
        tip_es: 'La altitud (2,200m) hace que el alcohol pegue el doble. Un vaso de agua por cada copa de mezcal evita que el mareo arruine el día siguiente.',
        tip_en: 'The altitude (2,200m) makes alcohol hit twice as hard. One glass of water per mezcal prevents a dizzying next day.',
      },
    ],
  },

  // ── Guadalajara ────────────────────────────────────────
  {
    slug_es: 'guadalajara-guia-de-amigos',
    slug_en: 'guadalajara-friends-guide',
    title_es: 'Guadalajara',
    title_en: 'Guadalajara',
    excerpt_es: 'Tierra de tequila, arquitectura y sabores audaces. Una pausa diseñada para explorar mercados, brindar en destilerías y descubrir por qué es la capital del estilo tapatío.',
    excerpt_en: 'Land of tequila, architecture, and bold flavors. A pause designed to explore markets, toast at distilleries, and discover why it is the capital of tapatío style.',
    destination_es: 'Jalisco',
    destination_en: 'Jalisco',
    tags_es: ['Amigos', 'Tequila', 'Gastronomía', 'Arte'],
    tags_en: ['Friends', 'Tequila', 'Food', 'Art'],
    cover_img: '/images/guides/guadalajara.jpg',
    sections: [
      {
        heading_es: 'Por qué ir',
        heading_en: 'Why go',
        body_es: 'Guadalajara es la cuna del mariachi y el tequila, pero también el Silicon Valley mexicano — una ciudad con doble identidad que convive sin contradicción. La Colonia Americana es el barrio más cool del país para un fin de semana con amigos: cafés de especialidad, galerías, tortas ahogadas y coctelería de autor en un radio caminable.',
        body_en: "Guadalajara is the birthplace of mariachi and tequila, but also Mexico's Silicon Valley — a city with a double identity that coexists without contradiction. Colonia Americana is the country's coolest neighborhood for a friends weekend: specialty coffee, galleries, tortas ahogadas, and craft cocktails within walking distance.",
        tip_es: 'Restaurantes como Alcalde o Xokol se llenan con semanas de anticipación. Si son foodies serios, reserva con antelación.',
        tip_en: 'Restaurants like Alcalde or Xokol fill up weeks in advance. If you are serious foodies, book ahead.',
      },
      {
        heading_es: 'Dónde quedarse',
        heading_en: 'Where to stay',
        body_es: 'Casa Habita (Colonia Americana): diseño retro-moderno con alberca en terraza — ideal para el pre con amigos. Villa Ganz: casona restaurada con gusto impecable, como la casa de un amigo sofisticado. Hilton DoubleTree Centro Histórico: habitaciones insonorizadas y terraza con vistas del skyline histórico.',
        body_en: 'Casa Habita (Colonia Americana): retro-modern design with a rooftop pool — perfect for pre-drinks with friends. Villa Ganz: restored mansion with impeccable taste, like staying at a sophisticated friend\'s house. Hilton DoubleTree Centro Histórico: soundproofed rooms and a terrace with historic skyline views.',
      },
      {
        heading_es: 'Qué hacer',
        heading_en: 'What to do',
        body_es: 'Tour de tequila artesanal: renta un conductor privado hacia Tequila o Amatitán para visitar destilerías boutique como Cascahuín o Fortaleza — aventura líquida para conocedores. Safari de tortas ahogadas: de El Güerito a versiones modernas, el rito de iniciación del foodie. Hospicio Cabañas: los murales de Orozco son de los mejores del mundo — obligatorio.',
        body_en: 'Artisanal tequila tour: rent a private driver to Tequila or Amatitán to visit boutique distilleries like Cascahuín or Fortaleza — liquid adventure for connoisseurs. Tortas ahogadas safari: from El Güerito to modern versions, the mandatory foodie initiation rite. Hospicio Cabañas: Orozco\'s murals are among the world\'s best — non-negotiable.',
        tip_es: 'El tejuino (maíz fermentado con nieve de limón) es el mejor remedio local para la cruda del tequila. No se vayan sin probarlo.',
        tip_en: 'Tejuino (fermented corn with lime sorbet) is the best local remedy for a tequila hangover. Don\'t leave without trying it.',
      },
      {
        heading_es: 'Cómo llegar',
        heading_en: 'Getting there',
        body_es: 'Aeropuerto de Guadalajara (GDL). Uber funciona perfectamente y es muy económico — 30–40 minutos a la Colonia Americana. Una vez ahí, Guadalajara se disfruta caminando por colonias: muévete en Uber entre la Americana, Providencia y el Centro y olvida el coche.',
        body_en: 'Guadalajara Airport (GDL). Uber works perfectly and is very affordable — 30–40 minutes to Colonia Americana. Once there, Guadalajara is best enjoyed walking between neighborhoods: use Uber between Americana, Providencia, and downtown and forget the car.',
      },
    ],
  },

  // ── Los Cabos ──────────────────────────────────────────
  {
    slug_es: 'los-cabos-relax-entre-amigas',
    slug_en: 'los-cabos-girls-getaway',
    title_es: 'Los Cabos',
    title_en: 'Los Cabos',
    excerpt_es: 'Donde el desierto abraza al mar. Una escapada diseñada para renovar cuerpo y mente, con el equilibrio perfecto entre misticismo y sofisticación.',
    excerpt_en: 'Where the desert embraces the sea. A getaway designed to renew body and mind, with the perfect balance between mysticism and sophistication.',
    destination_es: 'Baja California Sur',
    destination_en: 'Baja California Sur',
    tags_es: ['Amigas', 'Playa', 'Spa', 'Lujo'],
    tags_en: ['Girls trip', 'Beach', 'Spa', 'Luxury'],
    cover_img: '/images/guides/los-cabos.jpg',
    sections: [
      {
        heading_es: 'Por qué ir',
        heading_en: 'Why go',
        body_es: 'Jacques Cousteau llamó a este lugar "el acuario del mundo" — el punto exacto donde el Mar de Cortés se abraza con el Pacífico. Para un grupo de amigas, Los Cabos ofrece lo mejor: spa de clase mundial, navegación privada al Arco, gastronomía farm-to-table y atardeceres sobre el Pacífico que no se olvidan.',
        body_en: 'Jacques Cousteau called this place "the world\'s aquarium" — the exact point where the Sea of Cortez meets the Pacific. For a group of friends, Los Cabos has it all: world-class spa, private sailing to the Arch, farm-to-table gastronomy, and unforgettable Pacific sunsets.',
        tip_es: 'El aire es muy seco. Empaca un buen aceite facial y capilar — el sol y la brisa del Pacífico resecan más de lo que imaginas.',
        tip_en: 'The air is very dry. Pack a good facial and hair oil — the sun and Pacific breeze dry you out more than you expect.',
      },
      {
        heading_es: 'Dónde quedarse',
        heading_en: 'Where to stay',
        body_es: 'The Cape (Thompson Hotel): arquitectura mid-century modern, el lugar para ver y ser vista, con vistas al Arco desde la tina. Hacienda Encantada: experiencia clásica con vistas al Mar de Cortés y suites amplias. Drift San José: minimalismo industrial en el Distrito del Arte — smart value para quienes prefieren la vida de barrio.',
        body_en: "The Cape (Thompson Hotel): mid-century modern architecture, the place to see and be seen, with Arch views from the tub. Hacienda Encantada: classic experience with Sea of Cortez views and spacious suites. Drift San José: industrial minimalism in the Art District — smart value for those who prefer neighborhood life.",
        tip_es: 'Para el atardecer en The Cape, reserva el Rooftop con una semana de anticipación. Tienen precios especiales para residentes mexicanos.',
        tip_en: 'For sunset at The Cape, book the Rooftop a week ahead. They have special prices for Mexican residents.',
      },
      {
        heading_es: 'Qué hacer',
        heading_en: 'What to do',
        body_es: 'Circuito de spa: dedica 2–3 horas al circuito de hidroterapia (vapor, sauna, fosa fría) — en Los Cabos el spa es actividad principal, no un extra. Sunset Sail Privado: catamarán hacia el Arco con copa de vino al atardecer desde el mar — el momento cumbre de la desconexión. Cena farm-to-table: Flora Farms o Acre en San José, gastronomía rodeada de flores y coctelería botánica.',
        body_en: 'Spa circuit: spend 2–3 hours in the hydrotherapy circuit (steam, sauna, cold plunge) — in Los Cabos the spa is a main activity, not an extra. Private Sunset Sail: catamaran to the Arch with wine at sunset from the sea — the peak disconnection moment. Farm-to-table dinner: Flora Farms or Acre in San José, gastronomy surrounded by flowers and botanical cocktails.',
      },
      {
        heading_es: 'Cómo llegar',
        heading_en: 'Getting there',
        body_es: 'Aeropuerto de San José del Cabo (SJD). Para grupos de amigas, reserva transporte privado previo — evitas filas de taxis y la confusión del Uber (que tiene restricciones en la zona federal del aeropuerto). Si te quedas en el Corredor Turístico, Uber funciona bien entre hoteles y hacia San José.',
        body_en: "San José del Cabo Airport (SJD). For groups of friends, book private transport in advance — you avoid taxi queues and Uber confusion (it has restrictions in the airport's federal zone). If you stay in the Tourist Corridor, Uber works well between hotels and to San José.",
      },
    ],
  },

  // ── Mérida ─────────────────────────────────────────────
  {
    slug_es: 'merida-familia-aventurera',
    slug_en: 'merida-adventurous-family',
    title_es: 'Mérida',
    title_en: 'Mérida',
    excerpt_es: 'El corazón vibrante de Yucatán. Una expedición para explorar cenotes ocultos, escalar pirámides y conectar con la naturaleza salvaje sin perder el confort de la Ciudad Blanca.',
    excerpt_en: 'The vibrant heart of Yucatán. An expedition to explore hidden cenotes, climb pyramids, and connect with wild nature — without losing the comfort of the White City.',
    destination_es: 'Yucatán',
    destination_en: 'Yucatan',
    tags_es: ['Familia', 'Cenotes', 'Arqueología', 'Naturaleza'],
    tags_en: ['Family', 'Cenotes', 'Archaeology', 'Nature'],
    cover_img: '/images/guides/merida.jpg',
    sections: [
      {
        heading_es: 'Por qué ir',
        heading_en: 'Why go',
        body_es: "Mérida fue construida sobre la antigua ciudad maya T'Hó — las piedras de las pirámides originales están en las paredes de la Catedral. Para familias aventureras, Yucatán ofrece una densidad de experiencias difícil de superar: cenotes cristalinos, zonas arqueológicas menos saturadas que Chichén Itzá, naturaleza y una ciudad base segura y caminable.",
        body_en: "Mérida was built on the ancient Maya city of T'Hó — original pyramid stones are in the Cathedral walls. For adventurous families, Yucatán offers a hard-to-beat density of experiences: crystal-clear cenotes, less crowded archaeological sites than Chichén Itzá, wildlife, and a safe, walkable base city.",
        tip_es: 'Entre las 13:00 y 16:00, el sol de Yucatán es implacable. Haz las actividades pesadas de mañana, alberca al mediodía, y sal de nuevo cuando baje el sol.',
        tip_en: 'Between 1pm and 4pm, the Yucatán sun is merciless. Do heavy activities in the morning, pool at midday, and head out again when the sun drops.',
      },
      {
        heading_es: 'Dónde quedarse',
        heading_en: 'Where to stay',
        body_es: 'Chablé Yucatán: lujo integrado en selva con cenote propio y programa para niños enfocado en naturaleza y cocina maya. Hacienda Xcanatun: jardines amplios perfectos para que los niños corran después de explorar. Las Brisas: una de las mejores albercas de la ciudad, a pasos de Paseo de Montejo.',
        body_en: 'Chablé Yucatán: jungle-integrated luxury with its own cenote and a kids program focused on nature and Maya cooking. Hacienda Xcanatun: spacious gardens perfect for kids to run around after exploring. Las Brisas: one of the best city pools, steps from Paseo de Montejo.',
      },
      {
        heading_es: 'Qué hacer',
        heading_en: 'What to do',
        body_es: 'Cenotes de Santa Bárbara: recorrido de tres cenotes en truck o bicicleta — seguro, organizado, agua cristalina. Uxmal + Choco-Story: zona arqueológica menos saturada y cruzar la calle al museo del chocolate donde los niños aprenden cómo los mayas hacían cacao. Reserva El Corchito: lancha desde Progreso a oasis de manglares para ver mapaches y coatíes nadando en su hábitat.',
        body_en: 'Santa Bárbara cenotes: three-cenote tour by cart or bicycle — safe, organized, crystal-clear water. Uxmal + Choco-Story: less crowded archaeological site, cross the street to the chocolate museum where kids learn how the Maya made cacao. El Corchito Reserve: boat from Progreso to a mangrove oasis to see raccoons and coatis in their habitat.',
        tip_es: 'Para niños: aquashoes con suela de goma son obligatorios. Las rocas en los cenotes son resbaladizas — buenos zapatos les dan confianza para saltar y explorar.',
        tip_en: "For kids: rubber-soled aquashoes are mandatory. Cenote rocks are slippery — good shoes give them the confidence to jump and explore.",
      },
      {
        heading_es: 'Cómo llegar',
        heading_en: 'Getting there',
        body_es: 'Aeropuerto de Mérida (MID). Para una familia de 4–5, lo más práctico es rentar una SUV en el aeropuerto — Mérida es muy segura para manejar y la aventura real está en los pueblos y cenotes aledaños. El coche da la flexibilidad de regresar al hotel cuando los peques necesiten siesta.',
        body_en: 'Mérida Airport (MID). For a family of 4–5, renting an SUV at the airport is most practical — Mérida is very safe to drive and the real adventure is in the surrounding villages and cenotes. The car gives flexibility to head back when the kids need a nap.',
      },
    ],
  },

  // ── Querétaro ──────────────────────────────────────────
  {
    slug_es: 'queretaro-guia-de-amigos',
    slug_en: 'queretaro-friends-guide',
    title_es: 'Querétaro',
    title_en: 'Querétaro',
    excerpt_es: 'Arquitectura barroca, viñedos cercanos y una escena gastronómica que sorprende. La ciudad perfecta para caminar de día y brindar de noche.',
    excerpt_en: 'Baroque architecture, nearby vineyards, and a gastronomy scene that surprises. The perfect city for walking by day and toasting by night.',
    destination_es: 'Querétaro',
    destination_en: 'Querétaro',
    tags_es: ['Amigos', 'Vinos', 'Cultura', 'Gastronomía'],
    tags_en: ['Friends', 'Wine', 'Culture', 'Food'],
    cover_img: '/images/guides/queretaro.jpg',
    sections: [
      {
        heading_es: 'Por qué ir',
        heading_en: 'Why go',
        body_es: 'El acueducto de 74 arcos fue construido por amor para llevar agua a una monja — hoy es el marco perfecto para las mejores fotos de grupo. Querétaro es Patrimonio de la Humanidad, todo a distancia caminable, viñedos a 45 minutos y una escena gastronómica que compite con cualquier ciudad del país.',
        body_en: "The 74-arch aqueduct was built out of love to bring water to a nun — today it's the perfect backdrop for group photos. Querétaro is a UNESCO World Heritage Site with everything walkable, vineyards 45 minutes away, and a gastronomy scene that competes with any city in the country.",
        tip_es: 'Querétaro refresca mucho en cuanto cae el sol. Una chamarra ligera o blazer es indispensable para las terrazas de noche.',
        tip_en: 'Querétaro cools significantly after sunset. A light jacket or blazer is essential for night terraces.',
      },
      {
        heading_es: 'Dónde quedarse',
        heading_en: 'Where to stay',
        body_es: 'Hotel Boutique Casa del Atrio: frente al Templo de San Agustín, habitaciones eclécticas llenas de arte. Hotel Danza del Sol: aire de hacienda renovada, ideal para grupos grandes. Morazul Hotel Boutique: atención al detalle a pasos de los templos más icónicos.',
        body_en: 'Hotel Boutique Casa del Atrio: facing San Agustín Temple, eclectic art-filled rooms. Hotel Danza del Sol: renovated hacienda feel, ideal for larger groups. Morazul Hotel Boutique: attention to detail steps from the most iconic temples.',
      },
      {
        heading_es: 'Qué hacer',
        heading_en: 'What to do',
        body_es: 'Ruta del Queso y Vino a 45 min: cata en Freixenet o De Cote con vista a la Peña de Bernal. Bar hopping de terrazas: La Grupa o Dodo Café para las mejores vistas. Museo de Arte de Querétaro: el claustro es de los más bellos de América. Caminata por el Acueducto al amanecer — el mejor encuadre de la ciudad.',
        body_en: 'Cheese & Wine Route 45 min away: tastings at Freixenet or De Cote with views of Peña de Bernal. Terrace bar hopping: La Grupa or Dodo Café for the best views. Querétaro Art Museum: the cloister is among the most beautiful in the Americas. Aqueduct walk at sunrise — the city\'s best frame.',
        tip_es: 'Si son más de 4, Querétaro se llena los fines de semana. Reserva cenas con al menos 4 días de anticipación si quieres mesa en terraza.',
        tip_en: "If you're more than 4, Querétaro fills up on weekends. Book dinners at least 4 days ahead if you want a terrace table.",
      },
      {
        heading_es: 'Cómo llegar',
        heading_en: 'Getting there',
        body_es: 'Autopista 57 desde CDMX: ~3 horas (sal temprano a las 7:00 AM para evitar el tráfico de carga). En autobús: ETN o Primera Plus desde Taxqueña o el Norte, cómodo con asientos amplios. Una vez en Querétaro, el centro no necesita coche — todo se camina o se toma Uber.',
        body_en: 'Autopista 57 from CDMX: ~3 hours (leave early at 7:00 AM to avoid truck traffic). By bus: ETN or Primera Plus from Taxqueña or Norte, comfortable with wide seats. Once in Querétaro, no car needed downtown — everything is walkable or a short Uber.',
      },
    ],
  },

  // ── Puerto Vallarta ────────────────────────────────────
  {
    slug_es: 'puerto-vallarta-guia-romantica',
    slug_en: 'puerto-vallarta-romantic-guide',
    title_es: 'Puerto Vallarta',
    title_en: 'Puerto Vallarta',
    excerpt_es: 'Donde la Sierra Madre se funde con el Pacífico. El equilibrio perfecto entre lujo contemporáneo y el alma colonial del Viejo Vallarta.',
    excerpt_en: 'Where the Sierra Madre meets the Pacific. The perfect balance between contemporary luxury and the colonial soul of Old Vallarta.',
    destination_es: 'Jalisco',
    destination_en: 'Jalisco',
    tags_es: ['Parejas', 'Playa', 'Gastronomía', 'Romance'],
    tags_en: ['Couples', 'Beach', 'Food', 'Romance'],
    cover_img: '/images/guides/vallarta.jpg',
    sections: [
      {
        heading_es: 'Por qué ir',
        heading_en: 'Why go',
        body_es: 'Vallarta saltó a la fama en 1963 con el rodaje de La Noche de la Iguana. Lo que hoy es un destino de lujo era entonces un pequeño pueblo de pescadores accesible solo por mar. Richard Burton y Elizabeth Taylor lo pusieron en el mapa — su legado de romance sigue siendo el alma de la Zona Romántica.',
        body_en: "Vallarta rose to fame in 1963 with the filming of The Night of the Iguana. What is now a luxury destination was then a small fishing village accessible only by sea. Richard Burton and Elizabeth Taylor put it on the map — their romantic legacy still defines the Zona Romántica.",
        tip_es: 'Recorre el malecón muy temprano en la mañana o ya entrada la noche — cuando se aprecia la escultura y arquitectura sin el ruido de las masas.',
        tip_en: 'Walk the malecón very early in the morning or late at night — when you can appreciate the sculpture and architecture without the crowd noise.',
      },
      {
        heading_es: 'Dónde quedarse',
        heading_en: 'Where to stay',
        body_es: 'Casa Kimberly: el refugio de Elizabeth Taylor y Richard Burton, hoy joya boutique con puentes de mármol y tinas al aire libre. Hotel Mousai: "Adults Only" con alberca infinity espectacular en la Zona Sur — vanguardia y vistas infinitas. Hotel Amapa: minimalismo en la Zona Romántica con terraza perfecta para el atardecer.',
        body_en: "Casa Kimberly: Elizabeth Taylor and Richard Burton's retreat, now a boutique gem with marble bridges and open-air tubs. Hotel Mousai: Adults Only with a spectacular infinity pool in Zona Sur — avant-garde design and infinite views. Hotel Amapa: minimalism in Zona Romántica with a perfect sunset terrace.",
      },
      {
        heading_es: 'Qué hacer',
        heading_en: 'What to do',
        body_es: 'Navegación privada a Majahuitas: renta una panga de lujo hacia las calas del sur — agua más clara, entorno selvático y privacidad real. Atardecer en The Iguana (Casa Kimberly): la vista de las cúpulas de la Iglesia de Guadalupe bajo el cielo rosado es el momento más romántico del Pacífico mexicano. Jardín Botánico de Vallarta: oasis de paz para la mañana tranquila.',
        body_en: "Private boat to Majahuitas: rent a luxury panga to the southern coves — clearer water, jungle setting, and real privacy. Sunset at The Iguana (Casa Kimberly): the view of the Guadalupe Church domes under a pink sky is the most romantic moment on Mexico's Pacific. Vallarta Botanical Garden: a peaceful morning oasis.",
        tip_es: 'Restaurantes con vista como Le Kliff o The Iguana se llenan meses antes en temporada alta. No dejes nada al azar.',
        tip_en: "View restaurants like Le Kliff or The Iguana fill up months ahead in high season. Don't leave anything to chance.",
      },
      {
        heading_es: 'Cómo llegar',
        heading_en: 'Getting there',
        body_es: 'Aeropuerto Internacional de Puerto Vallarta (PVR). Reserva transporte privado para que te esperen a la salida. Uber funciona bien en la ciudad pero para salir del aeropuerto debes cruzar el puente peatonal hacia la zona federal. Si te quedas en la Zona Romántica, todo el centro histórico se camina.',
        body_en: "Puerto Vallarta International Airport (PVR). Book private transport to wait at arrivals. Uber works well in the city but to leave the airport you must cross the pedestrian bridge to the federal zone. If you stay in Zona Romántica, the entire historic center is walkable.",
      },
    ],
  },

  // ── San Miguel de Allende ──────────────────────────────
  {
    slug_es: 'san-miguel-de-allende-viaje-de-parejas',
    slug_en: 'san-miguel-de-allende-couples-trip',
    title_es: 'San Miguel de Allende',
    title_en: 'San Miguel de Allende',
    excerpt_es: 'Estética colonial, viñedos de altura y los mejores atardeceres de México. Una pausa diseñada para caminar, brindar y reconectar en el corazón del país.',
    excerpt_en: 'Colonial aesthetics, high-altitude vineyards, and the best sunsets in Mexico. A pause designed for walking, toasting, and reconnecting in the heart of the country.',
    destination_es: 'Guanajuato',
    destination_en: 'Guanajuato',
    tags_es: ['Parejas', 'Cultura', 'Vinos', 'Arquitectura'],
    tags_en: ['Couples', 'Culture', 'Wine', 'Architecture'],
    cover_img: '/images/guides/san-miguel-de-allende.jpg',
    sections: [
      {
        heading_es: 'Por qué ir',
        heading_en: 'Why go',
        body_es: 'La famosa Parroquia no fue diseñada por un arquitecto sino por un maestro de obras local que se inspiró en postales de catedrales góticas europeas. San Miguel es el mejor destino de México para un fin de semana largo en pareja: caminable, llena de arte, con viñedos a 40 minutos y una escena de rooftops sin igual.',
        body_en: "The famous Parroquia was designed not by an architect but by a local master builder inspired by postcards of European Gothic cathedrals. San Miguel is Mexico's best destination for a couple's long weekend: walkable, art-filled, with vineyards 40 minutes away and an unmatched rooftop scene.",
        tip_es: 'Foto en la Parroquia en la "Hora Azul" (amanecer o 15 min tras el ocaso) desde la calle Aldama — el encuadre con paredes ocre es mucho más sofisticado que las fotos de mediodía.',
        tip_en: "Parroquia photo during the \"Blue Hour\" (sunrise or 15 min after sunset) from Calle Aldama — the ochre wall framing is far more sophisticated than midday shots.",
      },
      {
        heading_es: 'Dónde quedarse',
        heading_en: 'Where to stay',
        body_es: 'Rosewood San Miguel: el referente del lujo, con el bar Luna Rooftop para el atardecer obligatorio. Hotel Casa Blanca 7: santuario mediterráneo con serenidad de jardines y amenidades de bienestar. Selina SMA: Suites Privadas en casona histórica con estilo a fracción del costo, a pasos de la Parroquia.',
        body_en: "Rosewood San Miguel: the gold standard of luxury, with Luna Rooftop bar for the mandatory sunset. Hotel Casa Blanca 7: Mediterranean sanctuary with serene gardens and wellness amenities. Selina SMA: Private Suites in the historic mansion, stylish at a fraction of the cost, steps from the Parroquia.",
      },
      {
        heading_es: 'Qué hacer',
        heading_en: 'What to do',
        body_es: 'Viñedos Cuna de Tierra a 40 minutos: la bodega más premiada de la zona con cata y maridaje entre los viñedos. Fábrica La Aurora: antiguo centro textil convertido en galerías de arte y diseño — ideal para caminar sin prisa. Aguas termales en The Mayan Baths o Escondida Place: pozas de agua caliente en entornos diseñados para la relajación.',
        body_en: "Cuna de Tierra vineyards 40 minutes away: the most awarded winery in the region with food and wine pairing tastings. La Aurora Factory: former textile mill turned art and design galleries — perfect for leisurely browsing. Thermal waters at The Mayan Baths or Escondida Place: hot spring pools designed for relaxation.",
        tip_es: 'No juzgues por la fachada — los mejores spots de San Miguel no tienen letreros. Asómate a los patios interiores tras las puertas pesadas de madera.',
        tip_en: "Don't judge by the facade — San Miguel's best spots have no signs. Peek into interior courtyards through heavy wooden doors.",
      },
      {
        heading_es: 'Cómo llegar',
        heading_en: 'Getting there',
        body_es: 'En coche desde CDMX: 3.5–4 horas. Usa el libramiento para entrar — las calles del centro histórico son extremadamente estrechas y empedradas. En autobús: ETN o Primera Plus hasta la terminal de SMA, de ahí 10 minutos en Uber hasta el hotel.',
        body_en: 'By car from CDMX: 3.5–4 hours. Use the bypass road to enter — historic center streets are extremely narrow and cobblestoned. By bus: ETN or Primera Plus to the SMA terminal, then 10 minutes by Uber to your hotel.',
      },
    ],
  },

  // ── Tepoztlán ──────────────────────────────────────────
  {
    slug_es: 'tepoztlan-escapada-en-pareja',
    slug_en: 'tepoztlan-couple-escape',
    title_es: 'Tepoztlán',
    title_en: 'Tepoztlán',
    excerpt_es: 'Una pausa mística bajo la sombra del Tepozteco. El equilibrio perfecto entre lujo sutil y tiempo para reconectar.',
    excerpt_en: 'A mystical pause under the shadow of Tepozteco. The perfect balance between subtle luxury and time to reconnect.',
    destination_es: 'Morelos',
    destination_en: 'Morelos',
    tags_es: ['Parejas', 'Naturaleza', 'Bienestar', 'Escapada'],
    tags_en: ['Couples', 'Nature', 'Wellness', 'Getaway'],
    cover_img: '/images/guides/tepoztlan.jpg',
    sections: [
      {
        heading_es: 'Por qué ir',
        heading_en: 'Why go',
        body_es: 'Se dice que el valle tiene un magnetismo especial por los minerales de sus cerros. Es uno de los pocos lugares donde puedes dormir literalmente a la sombra de una pirámide milenaria. Para parejas desde CDMX, es el destino más cercano que combina verdadera desconexión, temazcal, gastronomía y cerros para caminar.',
        body_en: "The valley is said to have a special magnetism from its hillside minerals. It is one of the few places where you can sleep literally in the shadow of a thousand-year-old pyramid. For couples from CDMX, it is the closest destination combining true disconnection, temazcal, gastronomy, and hikeable hills.",
        tip_es: 'Viaja de domingo a martes. El pueblo se transforma de mercado ruidoso a refugio de paz — y los hoteles bajan hasta un 30%.',
        tip_en: 'Travel Sunday to Tuesday. The village transforms from a noisy market to a peaceful refuge — and hotels drop in price up to 30%.',
      },
      {
        heading_es: 'Dónde quedarse',
        heading_en: 'Where to stay',
        body_es: 'Amomoxtli: el estándar de oro del romance, jardines impecables y una de las mejores albercas de México — cero ruido, máximo lujo. Posada del Tepozteco: la mejor vista al cerro desde la terraza, ideal para desayunos largos. Hotel Boutique Casa Fernanda: spa de primer nivel para parejas y el restaurante La Veladora imperdible.',
        body_en: "Amomoxtli: the gold standard of romance, impeccable gardens, and one of Mexico's best pools — zero noise, maximum luxury. Posada del Tepozteco: the best hillside views from the terrace, ideal for long breakfasts. Hotel Boutique Casa Fernanda: first-class couples spa and the unmissable La Veladora restaurant.",
      },
      {
        heading_es: 'Qué hacer',
        heading_en: 'What to do',
        body_es: 'Ascenso al Tepozteco: caminata de 1.5 horas — inicia a las 8:30 AM para tener la cima casi para ti solo con luz perfecta (no subas a mediodía, el calor rebota en la piedra). Temazcal privado en pareja: muchos hoteles ofrecen la experiencia de purificación de forma privada. Cena en terraza al atardecer: cocina contemporánea de Morelos con vista a las montañas iluminadas.',
        body_en: 'Climb to Tepozteco: 1.5-hour hike — start at 8:30 AM to have the summit nearly to yourself with perfect light (do not go at midday, the heat bounces off the stone). Private couples temazcal: many hotels offer the purification experience privately. Terrace dinner at sunset: contemporary Morelos cuisine with views of the illuminated mountains.',
        tip_es: 'Tepoztlán es súper empedrado. Deja los tacones — necesitas tenis con buen agarre incluso para ir a cenar.',
        tip_en: "Tepoztlán is very cobblestoned. Leave the heels — you need sneakers with good grip even to go to dinner.",
      },
      {
        heading_es: 'Cómo llegar',
        heading_en: 'Getting there',
        body_es: 'En coche propio: 1.5–2 horas desde CDMX. La curva de La Pera puede ser traicionera si llueve — maneja con calma. En autobús: Pullman de Morelos desde Taxqueña con salidas cada 30–40 minutos, cómodo con Wi-Fi y aire acondicionado. En Tepoztlán deja el coche y muévete a pie o en taxi local.',
        body_en: 'By car: 1.5–2 hours from CDMX. La Pera curve can be treacherous in rain — drive calmly. By bus: Pullman de Morelos from Taxqueña with departures every 30–40 minutes, comfortable with Wi-Fi and AC. Once in Tepoztlán leave the car and walk or use local taxis.',
      },
    ],
  },

  // ── Tulum ──────────────────────────────────────────────
  {
    slug_es: 'tulum-guia-viaje-solo',
    slug_en: 'tulum-solo-trip-guide',
    title_es: 'Tulum',
    title_en: 'Tulum',
    excerpt_es: 'Selva, mar turquesa y el beat de la noche. Una pausa diseñada para reconectar contigo misma sin renunciar a la fiesta más icónica del Caribe.',
    excerpt_en: 'Jungle, turquoise sea, and the beat of the night. A pause designed to reconnect with yourself without giving up the most iconic party in the Caribbean.',
    destination_es: 'Quintana Roo',
    destination_en: 'Quintana Roo',
    tags_es: ['Viaje solo', 'Playa', 'Bienestar', 'Cenotes'],
    tags_en: ['Solo travel', 'Beach', 'Wellness', 'Cenotes'],
    cover_img: '/images/guides/tulum.jpg',
    sections: [
      {
        heading_es: 'Por qué ir',
        heading_en: 'Why go',
        body_es: 'Tulum es la única ciudad maya construida frente al mar. Su nombre original era "Zama" — amanecer — porque su ubicación permite ver el primer rayo de sol que toca tierra mexicana. Ofrece lo que pocos destinos logran: estar completamente sola en agua cristalina a las 8 AM, y en la fiesta más icónica del Caribe a las 10 PM.',
        body_en: 'Tulum is the only Maya city built facing the sea. Its original name was "Zama" — sunrise — because its location lets you see the first ray of sunlight touching Mexican soil. It offers what few destinations achieve: being completely alone in crystal-clear water at 8 AM, and at the most iconic Caribbean party at 10 PM.',
        tip_es: 'Lleva efectivo en pesos — muchos lugares en la playa solo aceptan efectivo y el tipo de cambio en dólares dentro de los comercios siempre te perjudica.',
        tip_en: 'Bring cash in pesos — many beach spots only accept cash and in-store dollar exchange rates always work against you.',
      },
      {
        heading_es: 'Dónde quedarse',
        heading_en: 'Where to stay',
        body_es: 'Our Habitas: lujo sustentable en tiendas de campaña de alto diseño frente al mar — ideal para viaje solo por su ambiente comunitario y cenas compartidas. Dune Boutique Hotel: yoga frente al mar de mañana y diseño mediterráneo que se funde con la selva. Astral Tulum: suites privadas con estilo en zona hotelera — beachfront y versátil.',
        body_en: "Our Habitas: sustainable luxury in high-design tents facing the sea — ideal for solo travel with its community atmosphere and shared dinners. Dune Boutique Hotel: morning yoga facing the sea and Mediterranean design blending with the jungle. Astral Tulum: stylish private suites in the hotel zone — beachfront and versatile.",
      },
      {
        heading_es: 'Qué hacer',
        heading_en: 'What to do',
        body_es: 'Cenotes al amanecer: Cenote Dos Ojos o Gran Cenote a las 8:00 AM — estar sola en el agua cristalina antes de que lleguen los tours es la definición de paz absoluta. Beach Club Day en Papaya Playa Project: DJ de clase mundial y atmósfera donde estar sola se siente completamente natural. Sanación de sonido en la selva: ceremonia de sound healing — el balance perfecto después de una noche de fiesta.',
        body_en: "Cenotes at sunrise: Cenote Dos Ojos or Gran Cenote at 8:00 AM — being alone in crystal water before the tours arrive is the definition of absolute peace. Beach Club Day at Papaya Playa Project: world-class DJ and an atmosphere where being alone feels completely natural. Sound healing in the jungle: the perfect balance after a night out.",
        tip_es: 'Usa repelente y bloqueador biodegradables — los mosquitos en la selva son implacables al atardecer y los cenotes prohíben químicos que dañen el agua.',
        tip_en: 'Use biodegradable repellent and sunscreen — jungle mosquitoes are relentless at dusk and cenotes prohibit chemicals that damage the water.',
      },
      {
        heading_es: 'Cómo llegar',
        heading_en: 'Getting there',
        body_es: 'Aeropuerto de Cancún (CUN) o el nuevo Aeropuerto de Tulum (TQY) — mucho más cercano a la zona hotelera. El bus ADO es excelente, limpio y seguro — te deja en el pueblo y de ahí tomas taxi local. Renta bicicleta o scooter para moverte: los taxis en Tulum son caros y la bici te da libertad total.',
        body_en: 'Cancún Airport (CUN) or the new Tulum Airport (TQY) — much closer to the hotel zone. The ADO bus is excellent, clean, and safe — drops you in town where you take a local taxi. Rent a bicycle or scooter to get around: Tulum taxis are expensive and a bike gives you total freedom.',
      },
    ],
  },
]

// ── Helpers ───────────────────────────────────────────────

/** Returns all guides. Swap this for a DB call without changing consumers. */
export function getAllGuides(locale: Locale) {
  return GUIDES.map((guide) => ({
    ...guide,
    title: locale === 'es' ? guide.title_es : guide.title_en,
    excerpt: locale === 'es' ? guide.excerpt_es : guide.excerpt_en,
    slug: locale === 'es' ? guide.slug_es : guide.slug_en,
  }))
}



/**
 * Finds a guide by the slug for the given locale.
 * /es/guias/valle-de-bravo-...    → looks up slug_es
 * /en/guides/valle-de-bravo-...   → looks up slug_en
 */
export function getGuideBySlug(locale: Locale, slug: string): Guide | undefined {
  const field = locale === 'es' ? 'slug_es' : 'slug_en'
  return GUIDES.find(g => g[field] === slug)
}


/**
 * Returns all [locale, slug] pairs for generateStaticParams.
 * Produces one entry per locale per guide.
 */
export function getAllGuideParams(): { locale: string; slug: string }[] {
  const params: { locale: string; slug: string }[] = []
  for (const guide of GUIDES) {
    params.push({ locale: 'es', slug: guide.slug_es })
    params.push({ locale: 'en', slug: guide.slug_en })
  }
  return params
}

/** Returns a localized field value from a guide. */
export function guideField(guide: Guide, locale: Locale, field: 'title' | 'excerpt' | 'destination' | 'tags'): string | string[] {
  const key = `${field}_${locale}` as keyof Guide
  return guide[key] as string | string[]
}
