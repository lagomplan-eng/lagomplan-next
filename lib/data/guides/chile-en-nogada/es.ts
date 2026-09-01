import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'chile-en-nogada',
  locale: 'es',

  hero: {
    title: 'La Ruta del Chile en Nogada, Puebla',
    subtitle: 'El único plato de México con fecha de caducidad natural: agosto y septiembre, cuando la nuez de Castilla fresca, el durazno criollo y la granada están en temporada simultánea en Puebla. El chile en nogada existe solo cuando sus ingredientes existen — el argumento detrás del roadtrip gastronómico más mexicano de septiembre.',
    eyebrow: 'Guía curada · Familia con niños pequeños · Roadtrip gastronómico · 4 días · Presupuesto medio',
    tags: ['Familia', 'Gastronomía', 'Roadtrip'],
    image: '/images/guides/chile-en-nogada.png',
  },

  itinerary: [
    {
      day: 1,
      title: 'Llegada a Puebla: Centro Histórico y primer chile',
      items: [
        {
          time: '10:00',
          title: 'Bus desde TAPO (CDMX) a Puebla CAPU',
          description: '',
          tags: [],
        },
        {
          time: '12:30',
          title: 'Llegada y check-in',
          description: 'En Casona de los Sapos, en pleno Barrio del Artista',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Almuerzo en el mercado de San Román',
          description: 'El más auténtico del centro histórico',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Catedral y Zócalo con los niños',
          description: '',
          tags: [],
        },
        {
          time: '19:30',
          title: 'Cena y primer chile en nogada de la ruta',
          description: 'La primera noche tiene una sola misión: encontrar el primer chile en nogada de la ruta, en La Casona del Carmen o en el Mural de los Poblanos',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Tour gastronómico y Talavera',
      items: [
        {
          time: '09:00',
          title: 'Tour Culinario Extraordinario de 5 Horas',
          description: 'Mercados, molinos de mole, fondas de barrio y degustación de cemitas, chalupas, molotes, tamales y mole poblano',
          tags: [],
        },
        {
          time: '14:30',
          title: 'Almuerzo post-tour',
          description: '',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Capilla del Rosario y Zona de los Sapos',
          description: 'El barroco más exuberante de México, que los niños describen como "la iglesia de oro". Visita a un taller de cerámica Talavera de la Barca, la más antigua de América, en operación desde 1824',
          tags: [],
        },
        {
          time: '19:30',
          title: 'Cena libre en el barrio del Artista',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Atlixco: el Valle de las Flores',
      items: [
        {
          time: '09:00',
          title: 'Salida en carro hacia Atlixco',
          description: '45 minutos',
          tags: [],
        },
        {
          time: '10:00',
          title: 'Mercado de Atlixco y dalias',
          description: 'El mejor tianguis de flores de la región. En septiembre las dalias y los cempasúchil están en su apogeo, semanas antes del Día de Muertos',
          tags: [],
        },
        {
          time: '12:30',
          title: 'Almuerzo con chile en nogada',
          description: 'En alguna fonda del centro de Atlixco. La nogada local tiene variaciones regionales propias: más frutas, menos nuez, más granada',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Check-in en Hotel Boutique La Rioja',
          description: '',
          tags: [],
        },
        {
          time: '16:30',
          title: 'Piscina del hotel',
          description: '',
          tags: [],
        },
        {
          time: '19:30',
          title: 'Cena en el restaurante del hotel o en el centro de Atlixco',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'Cholula y regreso',
      items: [
        {
          time: '09:30',
          title: 'Drive de Atlixco a Cholula',
          description: '40 minutos',
          tags: [],
        },
        {
          time: '10:00',
          title: 'Check-in en Casa Eva',
          description: 'Si hay disponibilidad temprana, o guarda maletas',
          tags: [],
        },
        {
          time: '10:30',
          title: 'Gran Pirámide de Cholula y zona arqueológica',
          description: 'La de mayor volumen del mundo, no la más alta. Iglesia colonial en la cima y 8 kilómetros de túneles arqueológicos en el interior. Para niños de 3 años en adelante, el plan más aventurero del roadtrip',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Almuerzo en la plaza principal de San Andrés Cholula',
          description: '',
          tags: [],
        },
        {
          time: '15:30',
          title: 'Piscina del hotel',
          description: '',
          tags: [],
        },
        {
          time: '18:00',
          title: 'Última cena de chile en nogada para cerrar el circuito',
          description: '',
          tags: [],
        },
        {
          time: 'Al día siguiente',
          title: 'Regreso a CDMX por autopista',
          description: '2 horas',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Casona de los Sapos Hotel Boutique',
      type: 'Hotel boutique · Centro Histórico de Puebla',
      priceTier: '$$',
      description: 'Casona del siglo XIX en el Barrio del Artista, a media cuadra del Callejón de los Sapos — el corredor de antigüedades más fotogénico del centro poblano — y a ocho minutos caminando del Zócalo. Terraza con vistas a los volcanes en días despejados, restaurante propio con cocina poblana y el ambiente de hotel boutique con historia que los niños pequeños toleran mejor que los adultos anticipan. Para la primera noche en Puebla: la mejor dirección del centro histórico en su rango de precio. Precio estimado: $1,800–3,200 MXN/noche.',
      tag: 'A media cuadra del Callejón de los Sapos',
      affiliateUrl: 'https://www.booking.com/hotel/mx/casona-de-los-sapos-boutique.html',
      archetypes: ['Familias'],
    },
    {
      name: 'Hotel Boutique La Rioja',
      type: 'Hotel boutique · Atlixco',
      priceTier: '$$',
      description: 'Boutique de lujo accesible en el pueblo de las flores, con piscina exterior, jardines y la terraza con vista a los volcanes más consistente de la ruta. Atlixco es el destino gastronómico menos conocido del estado de Puebla y el que tiene las mejores recetas de chile en nogada fuera de la capital. Para la segunda noche: base perfecta para explorar el mercado de Atlixco y sus fondas. Precio estimado: $1,600–2,800 MXN/noche.',
      tag: 'La terraza con vista a los volcanes más consistente de la ruta',
      affiliateUrl: 'https://www.booking.com/hotel/mx/boutique-la-rioja-atlixco.html',
      archetypes: ['Familias'],
    },
    {
      name: 'Casa Eva Hotel Boutique & Spa',
      type: 'Hotel boutique & spa · Cholula',
      priceTier: '$$$',
      description: 'Hotel boutique spa a 200 metros de la Gran Pirámide con piscina climatizada — el detalle más relevante para una familia con niños después de cuatro días de roadtrip gastronómico — restaurante propio, desayuno incluido y personal que organiza visitas a la zona arqueológica. Las habitaciones familiares son amplias y los niños tienen espacio para moverse sin que los adultos pierdan la cordura. Para la última noche antes de regresar a CDMX. Precio estimado: $2,200–3,800 MXN/noche.',
      tag: 'A 200 metros de la Gran Pirámide, con piscina climatizada',
      affiliateUrl: 'https://www.booking.com/hotel/mx/casa-eva-boutique.html',
      archetypes: ['Familias'],
    },
  ],

  hotelsDescription: 'Tres ciudades, tres escalas: Puebla, Atlixco y Cholula como base del roadtrip.',

  experiences: [
    {
      name: 'Tour Culinario Extraordinario de 5 Horas',
      description: 'El tour gastronómico más completo para Puebla: visita a los mercados donde se compran los ingredientes del chile en nogada, los molinos de mole, las fondas de barrio y degustación de cemitas, chalupas, molotes, tamales y mole poblano. El guía explica por qué cada ingrediente del chile en nogada tiene temporada propia y cómo los conventos del siglo XVII inventaron el plato. Para niños de 4 años en adelante: el mercado y las fondas son el plan más sensorial disponible en Puebla.',
      tags: ['Mercados', 'Degustación', '5 horas'],
      affiliateUrl: 'https://www.getyourguide.com/es-mx/estado-libre-y-soberano-de-puebla-l1470/tour-culinario-extraordinario-por-puebla-t34817/',
    },
    {
      name: 'Experiencia Culinaria Puebla: Clase de Cocina',
      description: 'Clase de cocina poblana con visita al mercado local y preparación de platos tradicionales en el taller. Para la familia que quiere que los niños participen activamente en el proceso — hacer tortillas, picar ingredientes, probar — y no solo observar. Duración: 3–4 horas con ingredientes incluidos.',
      tags: ['Clase de cocina', 'Mercado', 'Familias'],
      affiliateUrl: 'https://www.getyourguide.com/puebla-l1471/puebla-culinary-experience-cooking-class-t781637/',
    },
    {
      name: "Val'Quirico, Puebla y Ciudades: Tour Gastronómico y Cultural",
      description: "Recorrido desde CDMX o Puebla por el centro histórico con paradas gastronómicas que incluyen chile en nogada en temporada, cemitas, pulque artesanal y mezcal local. Pasa también por Val'Quirico — el pueblo de arquitectura italiana en medio de Puebla que los niños identifican instantáneamente como \"el lugar de las películas europeas\".",
      tags: ["Val'Quirico", 'Chile en nogada', 'Día completo'],
      affiliateUrl: 'https://www.getyourguide.com/mexico-city-l194/val-quirico-puebla-mexico-walking-tour-food-and-towns-t855901/',
    },
  ],

  experiencesDescription: 'Mole, cerámica y pirámides: la ruta gastronómica completa.',

  tips: [
    'La temporada: El chile en nogada existe entre el 15 de agosto y el 15 de septiembre aproximadamente, cuando la nuez de Castilla fresca está disponible. Pasada esa fecha, muchos restaurantes siguen ofreciéndolo pero con nuez seca o de temporada anterior. La diferencia en la nogada es notable para quien lo ha probado fresco.',
    'El precio como indicador: Un chile en nogada hecho con ingredientes de temporada y de calidad cuesta entre $180 y $320 MXN. Cualquier cosa significativamente más barata tiene nuez de la pasada temporada o nogada de caja.',
    'Los niños y el chile: El chile en nogada tiene un relleno dulce-salado (frutas, carne, especias) que los niños de 3 años en adelante suelen aceptar sin drama. La nogada de nuez es más difícil; prueba primero con una cucharita antes de servir el plato completo. La granada y el perejil encima son el elemento más fotogénico y el que más les gusta separar.',
  ],

  funFact: 'El chile en nogada fue creado en 1821 por las monjas agustinas del Convento de la Purísima en Puebla para festejar al general Agustín de Iturbide en su paso hacia la Ciudad de México tras la consumación de la Independencia. Los colores del plato representan la bandera del Ejército Trigarante, precursor de la bandera mexicana actual.',

  checklist: [
    '🌶️ Reserva mesa con anticipación en temporada alta (fines de semana de agosto y septiembre)',
    '🧥 Impermeable ligero para los niños: lluvia vespertina frecuente en septiembre',
    '👟 Calzado cómodo para los túneles de la Gran Pirámide de Cholula',
    '🚗 Carro propio para el tramo Puebla–Atlixco–Cholula: más flexible que el bus',
    '💧 Agua y protector solar para el mercado de flores de Atlixco',
    '📸 Cámara para las dalias y cempasúchil en su apogeo',
    '🥄 Prueba la nogada con una cucharita antes de servir el plato completo a los niños',
  ],

  transport: [
    {
      mode: 'Bus',
      description: 'Bus ADO desde la Terminal de Autobuses de Oriente (TAPO) hasta Puebla CAPU: cada 30 minutos, 2 horas de trayecto, $250–380 MXN por persona. La opción más eficiente para familias con niños pequeños que quieren evitar el tráfico de la autopista México-Puebla un viernes por la tarde.',
    },
    {
      mode: 'Carro propio',
      description: 'La autopista México-Puebla (150D) tiene cuatro horas de viaje en condiciones normales y un peaje de $200 MXN aproximado. Para el roadtrip a Atlixco y Cholula, el carro da más flexibilidad que el bus: la distancia entre los tres destinos no justifica el taxi en cada tramo.',
      tip: 'El roadtrip en tres tramos: Puebla → Atlixco, 45 minutos al suroeste por la 190D. Atlixco → Cholula, 40 minutos de regreso hacia el norte. Cholula → CDMX, 2 horas por la autopista.',
    },
    {
      mode: 'Clima',
      description: 'En septiembre: 18–24°C en Puebla y Cholula, a 2,135 metros de altitud. Atlixco es más cálida (24–28°C, a menor altura). Lluvia vespertina frecuente en septiembre: lleva impermeable ligero para los niños y planifica las actividades al aire libre antes de las 3pm.',
    },
  ],
}
