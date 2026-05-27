import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'guatemala',
  locale: 'es',

  hero: {
    title: 'Guatemala',
    subtitle: 'El corazón del mundo maya. Un viaje diseñado para perderse entre buganvilias, despertar frente a volcanes activos y navegar el lago más bello del mundo con el equilibrio perfecto entre confort y aventura.',
    eyebrow: 'Guía curada · Romance & Naturaleza · 5 días · Lujo, gastronomía',
    tags: ['Parejas', 'Naturaleza', 'Lujo', 'Gastronomía'],
    image: '',
  },

  itinerary: [
    {
      day: 1,
      title: 'Aterrizaje colonial',
      items: [
        {
          time: '14:00',
          title: 'Check-in y comida ligera en Hector\'s Bistro',
          description: '',
          tags: [],
        },
        {
          time: '17:00',
          title: 'Caminata histórica por el centro',
          description: 'Iglesia de la Merced y calles empedradas de Antigua bajo el Arco de Santa Catalina.',
          tags: [],
        },
        {
          time: '20:30',
          title: 'Cena romántica en Mesón Panza Verde',
          description: 'Cena en un patio iluminado por velas, disfrutando de la primera noche entre muros coloniales.',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Sabores y volcanes',
      items: [
        {
          time: '09:00',
          title: 'Tour privado y cata de café en Finca Filadelfia',
          description: 'Mañana dedicada a los sentidos en una finca de café.',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Brunch largo en Bistrot Cinq',
          description: '',
          tags: [],
        },
        {
          time: '16:30',
          title: 'Compras de diseño local en Casa del Algodón',
          description: 'Boutiques de textiles finos.',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Cena en Tartines',
          description: 'Vistas a las ruinas de la Catedral.',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Hacia el ojo del mundo',
      items: [
        {
          time: '09:00',
          title: 'Traslado privado hacia el Lago Atitlán',
          description: 'La primera vista del lago al descender por la montaña les quitará el aliento.',
          tags: [],
        },
        {
          time: '13:30',
          title: 'Check-in en Casa Palopó y comida con vista al lago',
          description: '',
          tags: [],
        },
        {
          time: '17:00',
          title: 'Tiempo de lectura y meditación frente a los volcanes',
          description: 'Brindis al atardecer desde la terraza privada.',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Cena de autor en el hotel',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'El azul y el arte',
      items: [
        {
          time: '09:00',
          title: 'Tour en bote privado por San Juan y Santiago Atitlán',
          description: 'San Juan ofrece galerías de arte y cooperativas de mujeres tejedoras que usan tintes naturales.',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Almuerzo en el muelle de algún hotel boutique local',
          description: '',
          tags: [],
        },
        {
          time: '17:00',
          title: 'Masaje en pareja con aceites locales',
          description: '',
          tags: [],
        },
        {
          time: '20:30',
          title: 'Cena de despedida bajo el cielo de Atitlán',
          description: 'Última noche de estrellas y fogata.',
          tags: [],
        },
      ],
    },
    {
      day: 5,
      title: 'Despedida suave',
      items: [
        {
          time: '09:00',
          title: 'Desayuno largo y pausado',
          description: 'Último desayuno nutritivo con frutas tropicales y café recién molido frente al agua.',
          tags: [],
        },
        {
          time: '11:00',
          title: 'Traslado de regreso hacia Guatemala City (Aeropuerto)',
          description: '',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Casa Santo Domingo',
      type: 'Hotel · Antigua',
      priceTier: '$$$',
      description: 'Un ícono de la hospitalidad guatemalteca erigido sobre las ruinas del antiguo Convento de Santo Domingo del siglo XVII. Es un "hotel museo" donde el lujo contemporáneo se entrelaza con muros coloniales, criptas arqueológicas y jardines secretos iluminados por cientos de velas al atardecer. Perfecto para quienes buscan una inmersión profunda en la historia y el arte sacro de Antigua sin salir de su refugio.',
      tag: 'Esplendor colonial y arqueología de lujo',
      affiliateUrl: '',
      archetypes: ['Parejas'],
    },
    {
      name: 'Casa Palopó',
      type: 'Villa boutique · Lago Atitlán',
      priceTier: '$$$',
      description: 'Ubicado en las colinas sobre Santa Catarina Palopó. Una villa privada con servicio impecable, decoración de alta artesanía guatemalteca y una alberca infinity que se funde con el azul del lago. Es, probablemente, el lugar más romántico de Centroamérica.',
      tag: 'Vistas de ensueño y exclusividad',
      affiliateUrl: '',
      archetypes: ['Parejas', 'Bienestar'],
    },
  ],

  hotelsDescription: 'Dos paradas estratégicas para una estancia de alto nivel.',

  experiences: [
    {
      name: 'Cata privada de café',
      description: 'Guatemala produce algunos de los mejores granos del mundo. Realizar una cata sensorial en una finca histórica como La Azotea permite entender la relación entre el suelo volcánico y la taza perfecta.',
      tags: ['Café', 'Cata', 'Finca'],
      affiliateUrl: '',
    },
    {
      name: 'Navegación privada en Atitlán',
      description: 'Evita las lanchas públicas. Renta un bote privado para visitar San Juan La Laguna (el pueblo del arte y textiles) y Santa Catarina. Ver los tres volcanes (Atitlán, Tolimán y San Pedro) desde el centro del lago en silencio es una experiencia espiritual.',
      tags: ['Lago', 'Volcanes', 'Privado'],
      affiliateUrl: '',
    },
    {
      name: 'Vuelo en helicóptero',
      description: 'Para el máximo nivel de lujo y evitar el tráfico, el traslado de Antigua a Atitlán en helicóptero ofrece una perspectiva aérea de los volcanes que es simplemente inolvidable.',
      tags: ['Helicóptero', 'Vista aérea', 'Lujo'],
      affiliateUrl: '',
    },
  ],

  tips: [
    'Capas para la lluvia: En junio, una gabardina ligera o rompevientos de diseño es esencial para las tardes. No olviden calzado con buena tracción para el empedrado de Antigua, que puede ser resbaladizo con la lluvia.',
    'Efectivo (Quetzales): Aunque en hoteles y restaurantes de lujo aceptan tarjetas, para comprar artesanías en los pueblos de Atitlán necesitarán efectivo. Cambien en el aeropuerto o en Antigua.',
    'El "Xocomil": En el lago, después del mediodía, suele soplar un viento fuerte llamado Xocomil que agita las aguas. Si son sensibles al mareo, asegúrense de que sus traslados en bote sean temprano por la mañana.',
  ],

  funFact: 'Antigua Guatemala fue la capital de toda Centroamérica durante más de 200 años hasta que una serie de terremotos en 1773 obligó a trasladarla a la actual Ciudad de Guatemala. Gracias a ese "abandono", la ciudad conservó su arquitectura barroca casi intacta, convirtiéndose en Patrimonio de la Humanidad.',

  checklist: [
    '🧥 Rompevientos o gabardina ligera para la tarde',
    '👟 Calzado con buena tracción para el empedrado',
    '💵 Quetzales en efectivo para artesanías',
    '📷 Cámara para los volcanes y los textiles',
    '🧴 Bloqueador y repelente',
    '🕶️ Lentes de sol',
    '👗 Algo elegante para la cena en Mesón Panza Verde',
    '☕ Disposición para catar café guatemalteco',
  ],

  transport: [
    {
      mode: 'Vuelo',
      description: 'Llegada al Aeropuerto Internacional La Aurora (GUA).',
    },
    {
      mode: 'Traslados',
      description: 'En Guatemala, el tráfico puede ser impredecible. Lo más Lagom es contratar traslados privados de puerta a puerta. De GUA a Antigua es 1 hora; de Antigua a Atitlán son aproximadamente 2.5 a 3 horas por carretera sinuosa.',
    },
    {
      mode: 'Clima de junio',
      description: 'Es temporada de lluvias ("Invierno"). Las mañanas suelen ser soleadas y espectaculares; la lluvia llega por la tarde. Planea todas tus actividades al aire libre antes de las 14:00.',
    },
  ],
}
