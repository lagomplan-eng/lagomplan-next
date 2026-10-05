import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'mauricio',
  locale: 'es',

  hero: {
    title: 'Mauricio',
    subtitle: 'Una isla de 65 kilómetros de largo en medio del Océano Índico con playas de arena blanca, delfines a menos de un kilómetro de la orilla y una cascada que cae sobre tierra de siete colores. Para la familia con niños pequeños que quiere aventura sin la logística imposible.',
    eyebrow: 'Guía curada · Familia con niños pequeños · Aventura · 8 días · Presupuesto medio',
    tags: ['Familia', 'Playa', 'Aventura', 'Naturaleza'],
    image: '/images/guides/mauricio.png',
  },

  itinerary: [
    {
      day: 1,
      title: 'Llegada y primer chapuzón',
      items: [
        {
          time: '09:00',
          title: 'Llegada al aeropuerto MRU y transfer',
          description: 'Vuelo nocturno, llegada a primera hora.',
          tags: [],
        },
        {
          time: '12:00',
          title: 'Check-in',
          description: '',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Primera playa o piscina',
          description: 'La primera tarde para aclimatarse.',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Cena en el hotel',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Día de playa y orientación',
      items: [
        {
          time: '09:00',
          title: 'Desayuno buffet',
          description: 'El día más tranquilo del itinerario: sin excursión organizada.',
          tags: [],
        },
        {
          time: '10:00',
          title: 'Playa, kayak, snorkel desde el resort',
          description: 'Hasta las 17:00. El agua a 25°C y la arena blanca resuelven el reloj biológico desajustado sin necesidad de agenda.',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Cena',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Catamarán — Costa Oeste (delfines y Crystal Rock)',
      items: [
        {
          time: '08:30',
          title: 'Recogida en el hotel',
          description: 'La excursión más importante de la semana.',
          tags: [],
        },
        {
          time: '09:00',
          title: 'Crucero en catamarán',
          description: 'Hasta las 15:30. Delfines, snorkel, BBQ, playa. La ruta pasa por Crystal Rock, Île aux Bénitiers y las bahías de Le Morne, donde los delfines aparecen antes del mediodía.',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Regreso al hotel',
          description: '',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Cena ligera',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'Chamarel — la tierra de los siete colores',
      items: [
        {
          time: '09:00',
          title: 'Salida en coche hacia Chamarel',
          description: 'A 40 minutos del resort.',
          tags: [],
        },
        {
          time: '10:00',
          title: 'Cascade Chamarel',
          description: 'Sendero de 15 minutos, accesible con niños. La cascada más alta de la isla, 100 metros.',
          tags: [],
        },
        {
          time: '11:30',
          title: 'Terres de Couleur',
          description: 'Entrada: €5/adulto. Las dunas de tierra volcánica en siete colores naturales — rojo, marrón, violeta, verde, azul, púrpura y amarillo.',
          tags: [],
        },
        {
          time: '13:30',
          title: 'Almuerzo en algún restaurante de la zona',
          description: '',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Domaine de Chamarel',
          description: 'Degustación de ron para adultos, jugo de caña para niños — la destilería más visitada de Mauricio.',
          tags: [],
        },
        {
          time: '18:00',
          title: 'Regreso al hotel',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 5,
      title: 'Catamarán — Costa Sureste (5 islas)',
      items: [
        {
          time: '08:30',
          title: 'Recogida en el hotel',
          description: 'Transfer incluido.',
          tags: [],
        },
        {
          time: '09:00',
          title: 'Crucero 5 islas',
          description: 'Hasta las 15:30. Snorkel, delfines posibles, BBQ, playa. Cinco islas de la costa sureste con aguas de color esmeralda y el fondo coralino más diverso de la isla.',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Regreso',
          description: '',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Cena',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 6,
      title: 'Île aux Cerfs y este de la isla',
      items: [
        {
          time: '08:30',
          title: 'Salida en coche hacia Grand Bassin',
          description: '',
          tags: [],
        },
        {
          time: '10:00',
          title: 'Grand Bassin',
          description: 'El lago sagrado en el cráter del volcán, a 1,800 metros de altitud, donde los hindúes mauricianos hacen la peregrinación de Maha Shivaratri.',
          tags: [],
        },
        {
          time: '12:00',
          title: 'Drive a Trou d\'Eau Douce',
          description: '',
          tags: [],
        },
        {
          time: '12:30',
          title: 'Barca a Île aux Cerfs',
          description: '10 minutos.',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Playa de Île aux Cerfs',
          description: 'Hasta las 17:00. El agua más turquesa de Mauricio y arenas blancas finas sin rocas de coral — la playa más accesible para niños pequeños de toda la isla.',
          tags: [],
        },
        {
          time: '18:00',
          title: 'Drive de regreso al hotel',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 7,
      title: 'Avistamiento de delfines y playa libre',
      items: [
        {
          time: '07:30',
          title: 'Salida para la excursión de delfines',
          description: '',
          tags: [],
        },
        {
          time: '11:30',
          title: 'Regreso al hotel',
          description: '',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Playa libre, spa para adultos, actividades del resort',
          description: 'Hasta las 18:00.',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Cena de despedida',
          description: 'La última noche tiene la cena más larga del viaje.',
          tags: [],
        },
      ],
    },
    {
      day: 8,
      title: 'Última mañana y aeropuerto',
      items: [
        {
          time: '09:00',
          title: 'Desayuno',
          description: 'Desayuno largo.',
          tags: [],
        },
        {
          time: '10:00',
          title: 'Última mañana en la playa',
          description: '',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Transfer al aeropuerto MRU',
          description: '1.5 horas desde la costa oeste.',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Sands Suites Resort & Spa',
      type: 'Resort familiar · Flic-en-Flac Beach',
      priceTier: '$$$',
      description: 'El resort familiar más completo de la costa oeste — la que tiene los mejores delfines y los mejores atardeceres. Sobre la laguna de Tamarin Bay, con deportes acuáticos gratuitos incluidos (kayak, snorkel, paddle), spa, gimnasio, dos pistas de tenis y personal extraordinariamente servicial. El desayuno buffet con fruta tropical, curris locales y opciones vegetarianas resuelve el primer plan del día para niños de cualquier edad.',
      tag: 'Todo incluido excepto el aburrimiento',
      affiliateUrl: 'https://www.booking.com/hotel/mu/sands-resort.html',
      archetypes: ['Familias'],
    },
    {
      name: 'La Pirogue Mauritius',
      type: 'Resort clásico · Flic-en-Flac Beach',
      priceTier: '$$$',
      description: 'Resort histórico de la costa oeste, en amplios jardines tropicales directamente sobre la playa. Las villas y bungalows rodean varias piscinas en un espacio suficientemente grande como para que los niños corran sin supervisión constante. Centro de deportes acuáticos, club infantil y el restaurante Sugar Mill que convierte la cena en plan para adultos mientras los niños tienen su propio espacio.',
      tag: 'Más espacio entre el huésped y el vecino',
      affiliateUrl: 'https://www.booking.com/hotel/mu/la-pirogue-mauritius.html',
      archetypes: ['Familias'],
    },
    {
      name: 'C Mauritius',
      type: 'Boutique resort · Belle Mare, Costa Este',
      priceTier: '$$$',
      description: 'Boutique resort en Belle Mare — la playa más tranquila de la isla, en la costa este — con piscina infinita, acceso directo a la playa de Palmar y el ambiente más silencioso de las tres opciones. Las habitaciones son amplias, el desayuno es el mejor de las tres opciones y la playa es la más fotogénica de la isla. Trade-off: los delfines y el catamarán quedan a 1.5 horas de traslado.',
      tag: 'La calma de la costa este',
      affiliateUrl: 'https://www.booking.com/hotel/mu/c-mauritius.html',
      archetypes: ['Familias'],
    },
  ],

  hotelsDescription: 'Tres bases de operaciones junto al mar, dos en la costa oeste (más activa) y una en la este (más tranquila).',

  experiences: [
    {
      name: 'Crucero en catamarán, Costa Oeste con delfines, esnórquel y playa',
      description: 'La ruta de la costa oeste tiene el Crystal Rock — la formación de coral que sube dramáticamente de la laguna turquesa — más la Île aux Bénitiers, isla de arena blanca y aguas planas perfectas para niños pequeños. BBQ a bordo, bebidas incluidas y la posibilidad de nadar junto a delfines spinners en las bahías de Le Morne.',
      tags: ['Delfines', 'Catamarán', 'Familia'],
      affiliateUrl: 'https://www.getyourguide.com/grande-riviere-noire-l110567/southwest-of-mauritius-catamaran-cruise-w-snorkeling-t876466/',
    },
    {
      name: 'Tour de día completo: Chamarel, 7 colores y cataratas del suroeste',
      description: 'Tierra volcánica en siete colores naturales, el volcán Trou aux Cerfs, el lago sagrado de Grand Bassin con monos salvajes en el entorno, las cataratas de Chamarel y la destilería de ron. Para los niños: las dunas de tierra de colores y las tortugas gigantes del parque son el highlight. Para los adultos: el ron de Chamarel con degustación incluida.',
      tags: ['Naturaleza', 'Chamarel', 'Familia'],
      affiliateUrl: 'https://www.getyourguide.com/chamarel-l2088/mauritius-chamarel-7-colours-waterfalls-south-west-tour-t756434/',
    },
    {
      name: 'Tour de quad por el sur de Mauricio',
      description: 'Los campos de caña de azúcar, la costa de Gris Gris, los acantilados de La Roche qui Pleure y una parada para nadar en una playa tranquila sin turistas — todo en quad por los caminos del sur de la isla. Más adecuado para niños de 8 años en adelante; para los más pequeños, consultar con el operador las opciones de pasajero acompañante.',
      tags: ['Quad', 'Aventura', 'Sur de la isla'],
      affiliateUrl: 'https://www.getyourguide.com/mauritius-l2105/mahebourg-south-mauritius-quad-bike-tour-t259177/',
    },
  ],

  tips: [
    'Los delfines por la mañana: los delfines de Tamarin Bay aparecen principalmente entre las 7 y las 11am, antes de que el tráfico de barcos del mediodía los haga retirarse mar adentro. Las excursiones que salen antes de las 8am tienen la probabilidad más alta de encuentro real.',
    'El parasol: el sol del Índico a las 10am en octubre es significativamente más intenso que el del Mediterráneo. Factor 50 para los niños, aplicado antes del desayuno. El protector solar en el agua reduce la eficacia en menos de una hora.',
    'La comida mauriciana: la isla tiene influencias indias, africanas, chinas y francesas en la misma mesa. El dholl puri (crepa de lentejas rellena de curry) es la comida callejera nacional y el desayuno más barato disponible ($0.50 USD en cualquier puesto de carretera). Para niños: la rougaille de tomates con arroz blanco.',
  ],

  funFact: 'Mauricio no tuvo habitantes humanos hasta el siglo XVI, una de las últimas grandes islas del mundo en ser colonizada. El dodo, el ave gigante incapaz de volar que se extinguió en 1681, es endémico de Mauricio y el símbolo nacional de la isla. El Museo de Historia Natural de Port Louis tiene el esqueleto de dodo más completo que existe en el mundo. Los niños lo identifican inmediatamente por el libro de Alicia en el País de las Maravillas.',

  checklist: [
    '🩱 Trajes de baño para todos',
    '🧴 Protector solar factor 50, aplicado antes de llegar a la playa',
    '🦺 Chalecos salvavidas propios para niños pequeños, si es posible',
    '👟 Sandalias para playa y quad',
    '💵 Efectivo en rupias mauricianas para el dholl puri callejero',
    '🚗 Licencia de conducir internacional si van a rentar coche',
  ],

  transport: [
    {
      mode: 'Vuelo',
      description: 'Aeropuerto Internacional Sir Seewoosagur Ramgoolam (MRU), en el sureste de la isla. Vuelos directos desde París (Air France, Air Mauritius, 11 horas), Londres (British Airways, 12 horas), Dubái (Emirates, 4.5 horas) y Nairobi (Kenya Airways, 4 horas). Desde México o América Latina: conexión en Dubái, París o Johannesburgo. La distancia del aeropuerto a Flic-en-Flac (costa oeste) es de 1.5 horas.',
    },
    {
      mode: 'Moverse en la isla',
      description: 'Alquiler de coche (~$30–50 USD/día) es la opción más flexible para familias. Se conduce por la izquierda (herencia británica). Los taxis están disponibles pero hay que negociar el precio antes. Para las excursiones en catamarán, el transfer desde el hotel está incluido en la mayoría de los tours.',
    },
    {
      mode: 'Clima',
      description: 'En octubre: 24-28°C, mar a 24-25°C. Último mes de la temporada seca antes de que lleguen las lluvias de noviembre. Sol, poca humedad, mar tranquilo. La temporada de ciclones empieza en noviembre-diciembre.',
    },
  ],
}
