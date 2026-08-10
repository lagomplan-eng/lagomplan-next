import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'alto-adigio-dolomitas',
  locale: 'es',

  hero: {
    title: 'Alto Adigio / Südtirol, Italia',
    subtitle: 'La región italiana que genera más del 60% de su energía de fuentes renovables, muy por encima de la media nacional del 20%. Los Dolomitas son Patrimonio UNESCO desde 2009. Para la familia que quiere las montañas más fotogénicas de Europa, con niños lo bastante pequeños para que el lago más azul del mundo los deje sin palabras.',
    eyebrow: 'Guía curada · Familia con niños pequeños · Naturaleza UNESCO · 4 días · Presupuesto intermedio',
    tags: ['Familia', 'Niños pequeños', 'Naturaleza'],
    image: '/images/guides/alto-adigio-dolomitas.jpg',
  },

  itinerary: [
    {
      day: 1,
      title: 'Llegada a San Candido',
      items: [
        {
          time: '14:00',
          title: 'Check-in en el hotel elegido',
          description: '',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Paseo por el centro de San Candido (Innichen)',
          description: 'Colegiata del siglo XII, heladería de obsesión regional y el mejor mercado de quesos locales del valle',
          tags: [],
        },
        {
          time: '17:30',
          title: 'Lago di Dobbiaco',
          description: 'El lago más accesible de los Dolomitas, a 5 minutos en coche, sendero llano de 3 km, aguas que en agosto llegan a 18°C',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Cena en el restaurante del hotel o en el Gasthof del centro',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Lago di Braies',
      items: [
        {
          time: '06:30',
          title: 'Salida hacia Lago di Braies',
          description: '25 minutos en coche',
          tags: [],
        },
        {
          time: '07:30',
          title: 'Llegada al lago con primera luz',
          description: '',
          tags: [],
        },
        {
          time: '07:30',
          title: 'Tour matutino, bote de remos incluido',
          description: 'Antes de las 10am, cuando el lago se llena de gente',
          tags: [],
        },
        {
          time: '10:00',
          title: 'Regreso al hotel',
          description: '',
          tags: [],
        },
        {
          time: '11:00',
          title: 'Piscina, spa familiar, descanso',
          description: 'Tarde libre',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Cena en el hotel o en el restaurante local',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Tre Cime di Lavaredo',
      items: [
        {
          time: '08:30',
          title: 'Desayuno y salida',
          description: 'Aperitivo en el coche, los niños necesitan combustible antes del parking',
          tags: [],
        },
        {
          time: '09:30',
          title: 'Llegada al parking de Auronzo',
          description: '€30 aparcamiento, hay shuttle alternativo',
          tags: [],
        },
        {
          time: '10:00',
          title: 'Inicio del sendero circular guiado',
          description: '10km llanos, 3 horas. El guía da el contexto geológico del porqué las Dolomitas no son granito sino calcáreo coralino de un mar del Triásico',
          tags: [],
        },
        {
          time: '13:30',
          title: 'Almuerzo en el Rifugio Auronzo',
          description: 'Pasta y polenta a 2,320 metros',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Regreso al aparcamiento',
          description: '',
          tags: [],
        },
        {
          time: '16:30',
          title: 'Regreso al hotel',
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
      day: 4,
      title: 'Alpe di Siusi y despedida',
      items: [
        {
          time: '08:30',
          title: 'Desayuno y salida hacia Ortisei',
          description: '',
          tags: [],
        },
        {
          time: '10:00',
          title: 'Telecabina a la Alpe di Siusi',
          description: '',
          tags: [],
        },
        {
          time: '10:30',
          title: 'Paseo familiar en el prado alpino',
          description: '56 kilómetros cuadrados de prado con los Sassolungo y el Sassopiatto de fondo, rifugio para el almuerzo',
          tags: [],
        },
        {
          time: '14:30',
          title: 'Telecabina de bajada',
          description: '',
          tags: [],
        },
        {
          time: '15:30',
          title: 'Drive al aeropuerto de Innsbruck',
          description: '1.5 horas, o continuación del viaje',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Naturhotel Leitlhof',
      type: 'Hotel eco-boutique · San Candido',
      priceTier: '$$',
      description: 'El hotel eco-boutique más premiado del Alto Adigio: certificado con el sello de sostenibilidad South Tyrol y con la puntuación más alta de la región en criterios de energía renovable, gestión de residuos y producto local. 37 habitaciones con madera de arce local en paredes y suelos, spa con sauna de abeto, piscina interior climatizada y desayuno de producción propia con quesos y embutidos del valle. A 5 minutos en coche del Lago di Dobbiaco, el lago más accesible de los Dolomitas, y a 20 minutos de Lago di Braies. El personal recomienda senderos por edad y nivel de actividad de los niños con la precisión de quien los ha recorrido. Precio estimado: €180–320/noche habitación familiar.',
      tag: 'Sostenibilidad certificada, 5 min del Lago di Dobbiaco',
      affiliateUrl: 'https://www.booking.com/hotel/it/panorama-leitlhof.html',
      archetypes: ['Familias'],
    },
    {
      name: 'Hotel Cavallino Bianco',
      type: 'Hotel familiar · San Candido',
      priceTier: '$$',
      description: 'El hotel familiar más premiado de los Dolomitas por capacidad de entretenimiento infantil: piscina interior con tobogán, cine, bolera, sala de juegos, kids club con guardería certificada y menú infantil diseñado por nutricionista. Para la familia que quiere que los niños tengan plan propio mientras los padres comen despacio en la terraza con vista a las montañas. El restaurante tiene carta de vinos del Alto Adigio y menú de degustación para los adultos. Precio estimado: €200–350/noche habitación familiar.',
      tag: 'El más completo en entretenimiento infantil',
      affiliateUrl: 'https://www.booking.com/hotel/it/cavallino-bianco-san-candido.html',
      archetypes: ['Familias'],
    },
    {
      name: 'Sonnwies Family Resort',
      type: 'Resort con granja orgánica · Lüsen',
      priceTier: '$$',
      description: 'Resort familiar con granja orgánica propia: más de 30 animales, huerto activo y productos de la finca en todas las comidas. Situado en un pequeño pueblo de montaña a 12 kilómetros de Bressanone, con 300 días de sol al año y vistas directas a los Dolomitas UNESCO. 70 horas de cuidado de niños semanales, 5 piscinas incluyendo zona de agua para los más pequeños y el ambiente más genuino de granja alpina del Alto Adigio. Para la familia que quiere que los niños aprendan de dónde viene la leche mientras los adultos hacen senderismo. Precio estimado: €220–380/noche habitación familiar (media pensión incluida).',
      tag: 'Granja orgánica propia y 70h de cuidado infantil',
      affiliateUrl: 'https://www.sonnwies.com/en/family-hotel',
      archetypes: ['Familias'],
    },
  ],

  hotelsDescription: 'San Candido como base, con una noche de granja en Lüsen si el itinerario se extiende.',

  experiences: [
    {
      name: 'Lago di Braies Early Morning Tour',
      description: 'El lago más fotografiado de los Dolomitas, agua turquesa imposible rodeada de paredes verticales de roca dolomítica, tiene un problema: en agosto a las 10am hay más gente que en una calle comercial. La solución es la misma de siempre: llegar antes que nadie. Salida temprana desde la zona de San Candido, llegada al lago con la primera luz, con las montañas reflejadas en el agua sin un solo kayak y sin nadie más en el sendero. Para niños de cualquier edad: el bote de remos en el lago cuesta €10 y es el plan más recordado de los cuatro días.',
      tags: ['Lago di Braies', 'Madrugada', 'Bote de remos'],
      affiliateUrl: 'https://www.getyourguide.com/urtijei-l102963/lago-di-braies-tour-a-day-tour-to-the-magic-lago-di-braies-t947430/',
    },
    {
      name: 'Tre Cime di Lavaredo Guided Family Hike',
      description: 'Las Tres Cimas de Lavaredo son las formaciones de roca más reconocibles de los Alpes y el símbolo visual de los Dolomitas. El sendero circular a los pies de las tres agujas (2,999 metros) es llano y accesible, 10 kilómetros sin desnivel significativo, y la ruta está tan bien señalizada que el guía vale más por el contexto geológico que por la orientación. Para niños de 4 años en adelante con cochecito todo-terreno o portabebés: la primera hora desde el aparcamiento es completamente accesible.',
      tags: ['Tre Cime', 'Sendero circular', 'Apto para niños'],
      affiliateUrl: 'https://www.getyourguide.com/auronzo-l213997/misurinadolomites-tour-of-the-tre-cime-di-lavaredo-t1275876/',
    },
    {
      name: 'Dolomites Cable Car & Family Alpine Meadow Experience',
      description: 'La Alpe di Siusi (Seiser Alm) es el prado alpino de alta montaña más grande de Europa: 56 kilómetros cuadrados de hierba verde sobre las Dolomitas, accesibles en telecabina desde Ortisei en Val Gardena. En agosto tiene flores de temporada, vacas con cencerro y el aire a 1,800 metros que hace que los niños pequeños se duerman en el cochecito a los 20 minutos. Tour familiar con telecabina incluida y almuerzo en rifugio.',
      tags: ['Alpe di Siusi', 'Telecabina', 'Prado alpino'],
      affiliateUrl: 'https://www.getyourguide.com/alpe-di-siusi-l96607/',
    },
  ],

  experiencesDescription: 'Lagos turquesa, agujas de roca y el prado alpino más grande de Europa.',

  tips: [
    'El parking de Lago di Braies: En agosto, el acceso en coche privado al lago está restringido a partir de las 9am, hay que usar el shuttle desde el parking de Ponticello (~€5/persona). La única forma de llegar en coche antes de las restricciones es antes de las 9am. El tour matutino resuelve esto con transporte incluido que sale antes de la restricción.',
    'Las tormentas de tarde: Los Dolomitas tienen tormentas eléctricas de tarde en verano con una puntualidad que los locales conocen mejor que el reporte meteorológico. La regla estándar: actividades en altura antes de las 14:00, refugio en el valle después. Los rifugios de montaña sirven pasta y polenta, el almuerzo más satisfactorio disponible a 2,500 metros.',
    'El desayuno del Alto Adigio: Los hoteles de la región tienen los desayunos más abundantes de Italia — queso Graukäse, Speck (jamón curado en montaña), yogur de granja, pan de centeno y mermelada de arándano local. La mesa de desayuno en un Naturhotel con vistas a los Dolomitas al amanecer es la primera razón para levantarse temprano.',
  ],

  funFact: 'El Alto Adigio tiene más del 60% de su energía derivada de fuentes renovables, superando con creces el promedio nacional italiano del 20%, gracias a casi 1,000 pequeñas plantas hidroeléctricas privadas. En 2023, el Alto Adigio lanzó su propio sello de sostenibilidad turística, el primero de su tipo en Italia por región, certificando 141 alojamientos bajo tres niveles de criterios que incluyen energía, agua, gastronomía local y gestión de residuos.',

  checklist: [
    '🧥 Chaqueta impermeable para las tormentas de tarde',
    '🚼 Cochecito todo-terreno o portabebés para el sendero a Tre Cime',
    '🩱 Traje de baño para el Lago di Dobbiaco y las piscinas del hotel',
    '💶 Efectivo para el shuttle de Braies (~€5/persona) y el parking de Auronzo (€30)',
    '🥾 Calzado cómodo de caminata para los 10km llanos de Tre Cime',
    '🧢 Protección solar, el sol de altura en los prados es fuerte incluso con clima fresco',
  ],

  transport: [
    {
      mode: 'Vuelo',
      description: 'Aeropuerto de Bolzano (BZO), pequeño, vuelos domésticos desde Roma. Alternativas mejor conectadas: Aeropuerto de Innsbruck (INN, Austria, 1.5h en coche desde San Candido) con conexiones desde toda Europa, o Venecia (VCE, 2.5h en coche) con vuelos desde México y Latinoamérica vía conexión en Madrid, Frankfurt o Amsterdam. El tren desde Múnich a San Candido dura 3.5 horas, la opción más sustentable para familias que llegan desde Europa Central.',
    },
    {
      mode: 'Moverse en la región',
      description: 'Coche de alquiler en Bolzano o en Innsbruck es la opción más flexible con niños pequeños. Alternativa: el Alto Adigio tiene una red de autobuses que conecta todos los pueblos, y muchos hoteles tienen servicio de shuttle a los trailheads.',
      tip: 'El Lago di Braies tiene acceso limitado en coche en agosto, shuttle obligatorio desde el parking de Ponticello desde las 9am.',
    },
    {
      mode: 'Clima en agosto',
      description: 'Días de 22–28°C en el valle, 15–20°C en altura. Las tormentas de tarde son frecuentes en los Dolomitas en agosto, el plan correcto es actividades físicas antes de las 14:00 y spa, piscina o visita de pueblo después. El sol de la mañana en las rocas dolomíticas produce la luz rosada más fotogénica de Europa.',
    },
  ],
}
