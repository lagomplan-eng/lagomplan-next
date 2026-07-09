import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'azores',
  locale: 'es',

  hero: {
    title: 'Azores',
    subtitle: 'El archipiélago volcánico en medio del Atlántico que lleva años siendo el secreto mejor guardado de Europa. Una semana diseñada para descubrir lagos dentro de cráteres, bañarse en piscinas termales y ver ballenas desde un catamarán con el Atlántico como único horizonte.',
    eyebrow: 'Guía curada · Pareja · Relax & Playa · 7 días · Presupuesto alto',
    tags: ['Pareja', 'Relax', 'Playa', 'Naturaleza'],
    image: '/images/guides/azores.jpg',
  },

  itinerary: [
    {
      day: 1,
      title: 'Llegada y primer chapuzón',
      items: [
        {
          time: '14:00',
          title: 'Check-in y apertura de villa',
          description: 'Check-in en SENSI.',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Primera piscina privada',
          description: '',
          tags: [],
        },
        {
          time: '19:30',
          title: 'Cena en el restaurante del hotel con txakoli azoriano',
          description: '',
          tags: [],
        },
        {
          time: '21:00',
          title: 'Fuego de terraza y noche sin agenda',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Sete Cidades',
      items: [
        {
          time: '08:00',
          title: 'Salida temprana hacia Sete Cidades',
          description: 'Tour privado o en carro alquilado hacia el noroeste de la isla.',
          tags: [],
        },
        {
          time: '09:00',
          title: 'Mirador Vista do Rei',
          description: 'Al amanecer.',
          tags: [],
        },
        {
          time: '10:30',
          title: 'Bajada al pueblo y orilla del lago',
          description: 'Kayak en la laguna si el estado físico lo permite.',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Almuerzo en Lagoa Azul Restaurant',
          description: 'Restaurante frente al agua.',
          tags: [],
        },
        {
          time: '15:30',
          title: 'Regreso por la costa norte (Ribeira Grande)',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Avistamiento de ballenas',
      items: [
        {
          time: '09:00',
          title: 'Embarque en Vila Franca do Campo',
          description: 'Tour de avistamiento de ballenas (sur de la isla, 30 min en carro desde SENSI).',
          tags: [],
        },
        {
          time: '12:30',
          title: 'Regreso al muelle',
          description: '',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Almuerzo en el hotel',
          description: '',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Piscinas naturales de Ponta da Ferraria',
          description: 'Piscinas naturales de agua termal volcánica a 10 minutos del hotel donde el agua del océano se mezcla con la geotérmica.',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'Traslado a Furnas y piscinas nocturnas',
      items: [
        {
          time: '10:00',
          title: 'Check-out SENSI',
          description: '',
          tags: [],
        },
        {
          time: '12:00',
          title: 'Check-in Octant Furnas',
          description: 'Ruta hacia el valle de Furnas (1 hora).',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Terra Nostra Park (€8 EUR entrada, llevar traje de baño viejo)',
          description: 'Jardín botánico con la piscina termal de agua ferruginosa marrón que tiñe los trajes de baño.',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Experiencia nocturna de piscinas termales y Cozido das Furnas',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 5,
      title: 'Valle de Furnas y Lagoa do Fogo',
      items: [
        {
          time: '09:00',
          title: 'Paseo por las fumarolas del parque de Furnas',
          description: '',
          tags: [],
        },
        {
          time: '11:00',
          title: 'Ruta a la Lagoa do Fogo',
          description: 'La laguna más alta y más remota de la isla.',
          tags: [],
        },
        {
          time: '12:00',
          title: 'Sendero hasta la orilla (ida y vuelta)',
          description: 'Sendero de 90 minutos ida y vuelta.',
          tags: [],
        },
        {
          time: '14:30',
          title: 'Almuerzo en Ribeira Grande',
          description: '',
          tags: [],
        },
        {
          time: '16:30',
          title: 'Check-out Octant, traslado a White Exclusive Suites',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 6,
      title: 'Relax y costa sur',
      items: [
        {
          time: '10:00',
          title: 'Check-in y mañana de piscina',
          description: 'Piscina infinita, café con vistas al acantilado.',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Excursión libre a Praia dos Mosteiros o miradores de la costa sur',
          description: 'Playa volcánica con olas y piedra negra, la más fotogénica de la isla.',
          tags: [],
        },
        {
          time: '19:30',
          title: 'Cena en Ponta Delgada (restaurante O Caldo Verde o Anfiteatro)',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 7,
      title: 'Despedida lenta',
      items: [
        {
          time: '09:00',
          title: 'Desayuno y última piscina',
          description: '',
          tags: [],
        },
        {
          time: '11:00',
          title: 'Mercado da Graça en Ponta Delgada',
          description: 'Café y queijadinhas (pastelito de queso azoriano).',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Almuerzo ligero',
          description: '',
          tags: [],
        },
        {
          time: '',
          title: 'Transfer al aeropuerto PDL',
          description: '',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'SENSI Azores Nature and SPA',
      type: 'Villas · Ginetes, São Miguel',
      priceTier: '$$$',
      description: 'Villas con piscina privada tipo plunge pool al borde de un acantilado sobre el Atlántico, en el extremo más tranquilo de la isla. Cada unidad tiene terraza con tumbonas y vistas directas al océano, habitación con cortinas blackout para dormir con el sonido del mar, spa con sauna y hammam, y restaurante con cocina azoriana de producto. El review más repetido dice lo mismo: "no quisimos salir del hotel." Para la pareja que quiere que el destino sea también la habitación. Precio estimado: €300–500/noche.',
      tag: 'Plunge pool privado sobre el acantilado',
      affiliateUrl: 'https://www.booking.com/hotel/pt/sensi-azores-nature-and-spa.en-gb.html',
      archetypes: ['Parejas'],
    },
    {
      name: 'White Exclusive Suites & Villas',
      type: 'Suites y Villas · Lagoa, São Miguel',
      priceTier: '$$$',
      description: 'Suites y villas en un acantilado frente al mar con piscina infinita y diseño que mezcla las islas griegas con la paleta volcánica de los Azores. Interiores modernos, fogata exterior al atardecer, desayuno saludable y aguas saladas de piscina. A 20 minutos en auto de Ponta Delgada y bien posicionado para recorrer la isla en carro. El favorito de las parejas que buscan impacto visual y privacidad simultáneamente. Precio estimado: €280–480/noche.',
      tag: 'Piscina infinita con estética de islas griegas',
      affiliateUrl: 'https://www.booking.com/hotel/pt/white-exclusive-suites-amp-villas.en-gb.html',
      archetypes: ['Parejas'],
    },
    {
      name: 'Octant Furnas',
      type: 'Hotel · Vale das Furnas, São Miguel',
      priceTier: '$$$',
      description: 'Hotel de diseño contemporáneo en el corazón del valle geotérmico más activo de Europa. Dos piscinas termales exteriores al aire libre, restaurante con cocina de temporada azoriana y la posibilidad de cenar el Cozido das Furnas — el guiso que se cocina literalmente bajo tierra en las fumarolas del valle. Para la noche más diferente de la semana: dormirse con el olor a azufre del suelo y despertarse con niebla volcánica entre los árboles. Precio estimado: €200–380/noche.',
      tag: 'Piscinas termales en el valle geotérmico',
      affiliateUrl: 'http://booking.com/hotel/pt/octant-furnas.html',
      archetypes: ['Parejas'],
    },
  ],

  hotelsDescription: 'Refugios con volcán de fondo.',

  experiences: [
    {
      name: 'Avistamiento de ballenas — Terra Azul',
      description: 'Excursión de 3 horas en catamarán desde el muelle de Vila Franca do Campo con biólogos marinos a bordo. Los Azores son uno de los diez mejores destinos del mundo para el avistamiento de cetáceos. Cachalotes, ballenas sei y cuatro especies de delfines son los habituales. Briefing de seguridad y ética marina antes de zarpar, sin límite de edad mínima para parejas. Disponible con cancelación gratuita 24 horas antes.',
      tags: ['Catamarán', 'Biólogos marinos', 'Cetáceos'],
      affiliateUrl: 'https://www.getyourguide.com/azores-whale-watching-terra-azul-s9545/',
    },
    {
      name: 'Sete Cidades & Lagoa do Fogo — Full Day Tour',
      description: 'El recorrido más importante de São Miguel: el lago doble dentro del cráter de Sete Cidades — azul y verde simultáneamente según desde dónde se mire — más la Lagoa do Fogo en la cima central de la isla. Tour de 8 horas con almuerzo incluido, guía local en inglés y español, y paradas en todos los miradores principales. Para la pareja que alquila carro, se puede hacer por libre — pero el guía local aporta contexto volcánico que no viene en Google Maps.',
      tags: ['Full day', 'Cráter volcánico', 'Miradores'],
      affiliateUrl: 'https://www.getyourguide.com/sao-miguel-l1663/sete-cidades-y-lagoa-do-fogo-tour-de-dia-completo-con-almuerzo-t62199/',
    },
    {
      name: 'Furnas: piscinas termales nocturnas & cena',
      description: 'La experiencia más inusual de la isla: visita nocturna al valle de Furnas con baño en las piscinas termales al aire libre iluminadas, seguido de cena con el Cozido das Furnas auténtico — siete carnes y verduras cocinadas en las fumarolas del suelo durante 7-8 horas. Tour de 6 horas con recogida disponible desde Ponta Delgada. Reserva obligatoria.',
      tags: ['Piscinas termales', 'Nocturno', 'Cozido das Furnas'],
      affiliateUrl: 'https://www.getyourguide.com/sao-miguel-l1663/experiencia-nocturna-en-furnas-con-bano-termal-y-cena-t120166/',
    },
  ],

  experiencesDescription: 'Volcanes, ballenas y té.',

  tips: [
    'El carro es la libertad: La isla tiene carreteras en perfecto estado y los miradores más impresionantes no tienen transporte público. Alquilar un carro por €40–50 EUR/día en los días de exploración es la mejor inversión del viaje. Los días de hotel con piscina privada, no hace falta.',
    'El queso de São Miguel: El queijo da ilha — el queso amarillo picante de la región — se vende en cualquier supermercado de la isla a €3–5 EUR la pieza. Es el mejor souvenir comestible de Europa que nadie lleva. Lleva más de uno.',
    'El traje de baño en Terra Nostra: El agua ferruginosa de la piscina termal tiñe los tejidos de naranja permanentemente. No lleves el traje de baño nuevo.',
  ],

  funFact: 'Las Azores pertenecen a Portugal pero están más cerca de Canadá que de Lisboa. El archipiélago está a 1,500 kilómetros de la costa portuguesa y a 3,900 kilómetros de Nueva York. El punto más cercano de tierra a los Azores es la Península Ibérica — pero solo por 400 kilómetros de diferencia con Terranova, Canadá.',

  checklist: [
    '🧴 Protector solar para los días de catamarán y piscina',
    '🕶️ Lentes de sol para los días soleados de julio',
    '🧥 Una chaqueta ligera para las noches frescas',
    '👙 Un traje de baño viejo para las piscinas ferruginosas de Terra Nostra',
    '👟 Zapatillas de trekking para el sendero de la Lagoa do Fogo',
    '💶 Efectivo en euros para el mercado y las entradas',
    '🚗 Reservar el carro con antelación para los días de exploración',
    '📷 Una cámara para los miradores y la niebla matutina',
  ],

  transport: [
    {
      mode: 'Vuelo',
      description: 'Aeropuerto Internacional João Paulo II (PDL) en Ponta Delgada, São Miguel. Vuelos directos desde Lisboa (TAP Air Portugal, ~2 horas), Madrid y Londres. Desde Ciudad de México o Buenos Aires: conexión en Lisboa o Madrid. La isla no requiere alquiler de carro si el plan es quedarse en un solo hotel con excursiones organizadas — pero con carro propio el acceso a miradores y pueblos pequeños es notablemente mejor.',
    },
    {
      mode: 'Traslados',
      description: 'Uber funciona en São Miguel. Taxis disponibles en el aeropuerto. El alquiler de carro cuesta €30–60 EUR/día y es la forma más libre de recorrer la isla.',
    },
    {
      mode: 'Clima en julio',
      description: 'Días soleados de 22–26°C, noches frescas de 17–20°C. Julio es el mes más seco y soleado del año en São Miguel. Sin lluvia significativa. La única variable es la niebla matutina en las zonas altas — que desaparece antes del mediodía y hace las fotos más dramáticas.',
    },
  ],
}
