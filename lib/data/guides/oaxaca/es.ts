import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'oaxaca',
  locale: 'es',

  hero: {
    title: 'Oaxaca de Juárez',
    subtitle: 'Un festín de colores, sabores y texturas. Una ciudad para explorar a pie, aprender de artesanos y disfrutar del ritmo pausado del sur.',
    eyebrow: 'Guía curada · Viaje familiar',
    tags: ['Familia', 'Cultura', 'Gastronomía', 'Artesanía'],
    image: '',
  },

  itinerary: [
    {
      day: 1,
      title: 'Jalatlaco y chocolate',
      items: [
        {
          time: '15:00',
          title: 'Check-in y caminata por el Barrio de Jalatlaco',
          description: 'Calles empedradas y murales.',
          tags: [],
        },
        {
          time: '17:00',
          title: 'Visita a Chocolate Mayordomo',
          description: 'Ver cómo muelen el cacao. Merienda de chocolate con pan.',
          tags: [],
        },
        {
          time: '19:00',
          title: 'Cena ligera cerca del Templo de Santo Domingo',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Historia y barro',
      items: [
        {
          time: '09:00',
          title: 'Monte Albán',
          description: 'Es imponente y hay espacio para que los niños corran entre las ruinas.',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Comida en Alfonsina',
          description: 'Cocina de humo auténtica.',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Taller de barro negro en San Bartolo Coyotepec',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Naturaleza y textiles',
      items: [
        {
          time: '08:30',
          title: 'Hierve el Agua',
          description: 'Salida temprana es clave.',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Visita al Árbol del Tule',
          description: 'El más ancho del mundo, a los niños les encanta buscar formas en el tronco.',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Comida en Teotitlán del Valle y demostración de tintes naturales en textiles',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'El corazón de la ciudad',
      items: [
        {
          time: '10:00',
          title: 'Jardín Etnobotánico',
          description: 'Reserva con tiempo, el tour es bellísimo.',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Comida en el Mercado 20 de Noviembre',
          description: 'El "Pasillo de Humo" es toda una experiencia sensorial.',
          tags: [],
        },
        {
          time: '17:00',
          title: 'Tarde libre de alberca o compras de diseño en la calle de Macedonio Alcalá',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 5,
      title: 'Despedida suave',
      items: [
        {
          time: '10:00',
          title: 'Desayuno de despedida en Itanoni',
          description: 'Culto al maíz.',
          tags: [],
        },
        {
          time: '12:00',
          title: 'Compra de quesillo y mezcal para llevar a casa',
          description: 'Salida al aeropuerto.',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Quinta Real Oaxaca',
      type: 'Hotel · Centro histórico',
      priceTier: '$$$',
      description: 'Ubicado en el antiguo Convento de Santa Catalina. Sus jardines y alberca son un oasis absoluto después de caminar por el centro.',
      tag: 'Historia con alberca',
      affiliateUrl: '',
    },
    {
      name: 'Hotel con Corazón',
      type: 'Hotel boutique · Centro',
      priceTier: '$$',
      description: 'Un hotel boutique con causa (apoyan la educación local). Es moderno, limpio y muy acogedor. El desayuno en su patio es el inicio perfecto del día.',
      tag: 'Socialmente responsable',
      affiliateUrl: '',
    },
    {
      name: 'City Centro Oaxaca',
      type: 'Hotel · Barrio de Jalatlaco',
      priceTier: '$$',
      description: 'Ubicado en el Barrio de Jalatlaco (el más colorido). Tiene un diseño contemporáneo muy fotogénico y una alberca pequeña pero efectiva para refrescarse.',
      tag: 'Estilo en Jalatlaco',
      affiliateUrl: '',
    },
  ],

  experiences: [
    {
      name: 'Taller de alebrijes en Arrazola',
      description: 'Más que verlos, los niños pueden sentarse con los artesanos a pintar su propia figura de madera. Es el souvenir más valioso.',
      tags: [],
      affiliateUrl: '',
    },
    {
      name: 'Hierve el Agua',
      description: 'Las "cascadas petrificadas" son un espectáculo natural. Ir temprano garantiza fotos sin gente y una temperatura agradable para nadar en las pozas.',
      tags: [],
      affiliateUrl: '',
    },
    {
      name: 'Mercado de Tlacolula (domingo)',
      description: 'Una inmersión cultural total. Es el mercado más antiguo; ideal para probar "pan de cazuela" y ver el trueque vivo.',
      tags: [],
      affiliateUrl: '',
    },
  ],

  hotelsDescription: '3 opciones con espacios abiertos, ideales para que los niños se sientan libres.',
  experiencesDescription: 'Actividades interactivas que mantienen a los niños comprometidos.',

  tips: [
    'El snack oaxaqueño: Siempre ten a la mano una bolsa de chapulines con limón. Son la botana perfecta, saludable y a los niños les suele dar mucha curiosidad probarlos (y les encantan). ¡Dicen que es la comida del futuro!',
    'Sol de mediodía: En las zonas arqueológicas no hay sombra. Lleva sombreros de ala ancha y bloqueador. En Oaxaca el sol "pica" más de lo que parece.',
    'Reserva el Etnobotánico: Las visitas son guiadas y los cupos son muy limitados. No llegues sin cita; es uno de los lugares más relajantes de la ciudad.',
  ],

  funFact: 'En el Árbol del Tule, los niños pueden jugar a encontrar figuras de animales escondidas en el tronco más ancho del mundo. Además, es el hogar de los alebrijes, donde cada miembro de la familia puede descubrir su propio guía espiritual de madera.',

  checklist: [
    '🧢 Sombrero de ala ancha (zonas arqueológicas sin sombra)',
    '🧴 Bloqueador solar SPF 50+',
    '👟 Zapatos cómodos para caminar adoquines',
    '🎨 Ropa que pueda mancharse (talleres de artesanía)',
    '💵 Efectivo para mercados y artesanos',
    '🫙 Bolsa extra para llevar quesillo y mezcal',
    '🌿 Repelente de insectos para las noches',
    '🔋 Power bank para los días largos de excursión',
  ],

  transport: [
    {
      mode: 'Vuelo',
      description: 'La opción más sensata para familias. El aeropuerto (OAX) está a solo 20-30 min del centro. Reserva un transporte privado con antelación para no pelear por taxis a la llegada.',
    },
    {
      mode: 'Coche desde CDMX',
      description: 'Son unas 6 horas por la autopista. La carretera es buena pero tiene muchas curvas al llegar a Oaxaca (Cuesta Blanca); si tus hijos se marean, prepárate con tiempo.',
    },
    {
      mode: 'Movilidad local',
      description: 'Una vez en el centro, muévete a pie. Para las excursiones (Monte Albán, Mitla), renta un chofer privado por el día. Es más barato que un tour y te permite ir a tu propio ritmo familiar.',
    },
  ],
}
