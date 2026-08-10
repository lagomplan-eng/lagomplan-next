import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'westfjords-islandia',
  locale: 'es',

  hero: {
    title: 'Westfjords, Islandia',
    subtitle: 'Islandia sin cola. Mientras el anillo dorado procesa autobuses hacia el mismo géiser desde 1970, los Westfjords tienen la cascada más impresionante del país, los acantilados de pájaro más verticales de Europa y una reserva natural accesible solo en barco, hogar de zorros árticos. Agosto trae 20 horas de luz sobre el paisaje que los fotógrafos guardan para no contarle a nadie.',
    eyebrow: 'Guía curada · Familia con adolescentes · Naturaleza Extrema · 6 días · Presupuesto medio',
    tags: ['Familia', 'Adolescentes', 'Naturaleza'],
    image: '/images/guides/westfjords-islandia.jpg',
  },

  itinerary: [
    {
      day: 1,
      title: 'Llegada a Ísafjörður',
      items: [
        {
          time: '13:00',
          title: 'Llegada y check-in en Hotel Isafjordur Torg',
          description: 'Vuelo desde Reykjavik o llegada en coche',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Westfjords Heritage Museum',
          description: '1.5 horas, el museo de historia marítima más bien curado del norte',
          tags: [],
        },
        {
          time: '17:30',
          title: 'Paseo por el centro de Ísafjörður y el muelle',
          description: 'La microcervecería Dokkan Brugghús está en el camino',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Cena en el restaurante del hotel',
          description: 'Mariscos locales y cordero islandés',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Hornstrandir Nature Reserve',
      items: [
        {
          time: '08:00',
          title: 'Desayuno y salida al muelle',
          description: '',
          tags: [],
        },
        {
          time: '09:00',
          title: 'Ferry a Hornstrandir',
          description: '1 hora. La reserva natural más remota de Islandia, sin carreteras ni habitantes permanentes desde 1952',
          tags: [],
        },
        {
          time: '10:00',
          title: 'Caminata guiada con guía local',
          description: '4–6 horas. Los zorros árticos de Hornstrandir se acercan por curiosidad, sin miedo, porque nunca han sido cazados',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Ferry de regreso a Ísafjörður',
          description: '',
          tags: [],
        },
        {
          time: '19:30',
          title: 'Cena libre en Ísafjörður',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Kayak y Centro del Zorro Ártico',
      items: [
        {
          time: '09:00',
          title: 'Desayuno',
          description: '',
          tags: [],
        },
        {
          time: '10:00',
          title: 'Tour de kayak',
          description: '2–3 horas por el fiordo. Focas grises y barbudas nadan alrededor de los kayaks en agosto',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Ruta a Súðavík',
          description: '20 minutos',
          tags: [],
        },
        {
          time: '14:30',
          title: 'Arctic Fox Centre',
          description: '2 horas, entrada €15. El único centro de investigación del mundo dedicado exclusivamente al zorro ártico',
          tags: [],
        },
        {
          time: '17:30',
          title: 'Regreso a Ísafjörður',
          description: '',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Cena en Tjöruhúsið',
          description: 'El restaurante de pescado más famoso de Ísafjörður, menú único de mariscos del día, sin reservas',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'Ruta al sur: Dynjandi y traslado a Patreksfjörður',
      items: [
        {
          time: '09:00',
          title: 'Check-out del Isafjordur Torg y salida',
          description: 'Ruta hacia el sur por la carretera de cornisa del Arnarfjörður',
          tags: [],
        },
        {
          time: '12:00',
          title: 'Llegada a Dynjandi',
          description: 'Tour + senderismo hasta la cima (45 min subida). Cascada de 100 metros de caída total en siete cascadas escalonadas',
          tags: [],
        },
        {
          time: '14:30',
          title: 'Picnic en el sitio o almuerzo en el camino',
          description: '',
          tags: [],
        },
        {
          time: '16:30',
          title: 'Llegada a Patreksfjörður',
          description: 'Check-in en Fosshotel',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Cena en el restaurante del hotel',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 5,
      title: 'Látrabjarg Bird Cliffs y Rauðasandur',
      items: [
        {
          time: '08:30',
          title: 'Desayuno y salida',
          description: '',
          tags: [],
        },
        {
          time: '10:00',
          title: 'Látrabjarg Bird Cliffs',
          description: '54 km desde Patreksfjörður, carretera de grava, 1.5h. El punto más occidental de Islandia y la colonia de aves marinas más grande de Europa',
          tags: [],
        },
        {
          time: '10:00',
          title: 'Acantilados y puffins',
          description: 'Lleva chaqueta, el viento en los acantilados es constante',
          tags: [],
        },
        {
          time: '13:30',
          title: 'Ruta a Rauðasandur',
          description: '20 minutos',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Playa de arena roja y almuerzo de picnic',
          description: 'La única playa de arena roja de Islandia',
          tags: [],
        },
        {
          time: '16:30',
          title: 'Regreso a Fosshotel',
          description: '',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Cena y descanso',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 6,
      title: 'Country Hotel Heydalur y regreso',
      items: [
        {
          time: '09:00',
          title: 'Check-out Fosshotel',
          description: 'Ruta hacia el norte con parada en Heydalur',
          tags: [],
        },
        {
          time: '10:30',
          title: 'Llegada a Heydalur',
          description: 'Baño en la piscina geotérmica al aire libre ($5/persona)',
          tags: [],
        },
        {
          time: '12:30',
          title: 'Almuerzo en el hotel de la granja',
          description: '',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Ruta de regreso hacia Reykjavik',
          description: 'O vuelo desde Ísafjörður',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Llegada a Reykjavik',
          description: '',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Hotel Isafjordur Torg',
      type: 'Hotel · Ísafjörður',
      priceTier: '$$',
      description: 'El hotel más estiloso de Ísafjörður, la capital de los Westfjords con 2,600 habitantes y una vida cultural desproporcionada para su tamaño, en la plaza central (Silfurtorg) con vistas panorámicas al fiordo y a las montañas de todos los ángulos. Restaurante con cocina local, bar y el personal más informado sobre condiciones meteorológicas, horarios de ferry y senderos de la región. La base central para los días de exploración del norte y el este de los Westfjords. Precio estimado: €180–280/noche.',
      tag: 'La base central en la plaza de Ísafjörður',
      affiliateUrl: 'https://www.booking.com/hotel/is/isafjordur.html',
      archetypes: ['Familias'],
    },
    {
      name: 'Country Hotel Heydalur',
      type: 'Hotel de granja · Heydalur Valley',
      priceTier: '$$',
      description: 'Hotel de granja familiar en un valle remoto del sur de los Westfjords, a 130 kilómetros de Ísafjörður. Caballos islandeses en los prados exteriores, piscina geotérmica al aire libre, hot tubs naturales y el ambiente más auténtico de los Westfjords, una familia que lleva generaciones en el mismo valle y que sabe más sobre la región que cualquier guía turístico. Habitaciones familiares, desayuno islandés con Skyr y salmón ahumado local. La noche más tranquila de los seis días. Precio estimado: €160–240/noche.',
      tag: 'Piscina geotérmica en un valle remoto',
      affiliateUrl: 'https://www.booking.com/hotel/is/heydalur.html',
      archetypes: ['Familias'],
    },
    {
      name: 'Fosshotel Westfjords',
      type: 'Hotel · Patreksfjörður',
      priceTier: '$$',
      description: 'El hotel de la cadena Íslandshótel, primera cadena en obtener certificación Green Key en todos sus 17 hoteles en Islandia, en el pueblo de Patreksfjörður, gateway para Dynjandi y los acantilados de Látrabjarg. 40 habitaciones con vistas al fiordo, restaurante con mariscos locales y la posición perfecta para los días más activos del viaje. A 24 kilómetros de Dynjandi y 54 de Látrabjarg, las dos experiencias más importantes de los Westfjords en el mismo radio. Precio estimado: €150–230/noche.',
      tag: 'Certificación Green Key, a un radio de Dynjandi y Látrabjarg',
      affiliateUrl: 'https://www.booking.com/hotel/is/fosshotel-westfjords.html',
      archetypes: ['Familias'],
    },
  ],

  hotelsDescription: 'Tres bases, tres Islandias distintas: Ísafjörður, Heydalur y Patreksfjörður.',

  experiences: [
    {
      name: 'Dynjandi Waterfall Day Tour from Ísafjörður',
      description: 'Dynjandi, también llamada Fjallfoss, tiene 100 metros de caída total en siete cascadas escalonadas, cada una con su propio nombre. La base mide 60 metros de ancho y la cima 30, la forma de abanico invertido que hace de Dynjandi la imagen más reconocida de los Westfjords y una de las más fotografiadas de Islandia. El tour desde Ísafjörður incluye transporte por la carretera de cornisa del fiordo Arnarfjörður y tiempo libre en el sitio. Para adolescentes: el sendero hasta la cima (45 min) es accesible y las vistas desde arriba cambian completamente la perspectiva.',
      tags: ['Dynjandi', 'Cascada', 'Día completo'],
      affiliateUrl: 'https://www.getyourguide.com/isafjordur-l32303/isafjordur-dynjandi-express-t488601/',
    },
    {
      name: 'Hornstrandir Nature Reserve Boat Tour & Hike',
      description: 'La reserva natural más remota de Islandia, sin carreteras, sin habitantes permanentes desde 1952 y accesible solo en ferry desde Ísafjörður. Zorros árticos que se acercan a menos de un metro sin miedo porque nunca han sido cazados, acantilados de 534 metros y senderismo en un paisaje que no ha sido intervenido en décadas. Para adolescentes con energía: el nivel de inmersión en naturaleza sin infraestructura turística es único en Europa. Tour de día completo con guía.',
      tags: ['Hornstrandir', 'Zorros árticos', 'Ferry'],
      affiliateUrl: 'https://www.getyourguide.com/isafjordur-l32303/isafjordur-hornstrandir-guided-hike-adalvik-to-hesteyri-t1005278/',
    },
    {
      name: 'Kayaking in the Westfjords Fjords',
      description: 'Tour de kayak de 2–3 horas desde Ísafjörður por los fiordos con guía local. Las focas grises y barbudas nadan alrededor de los kayaks en los fiordos del norte, presencia constante en agosto. El nivel de agua fría del Atlántico Norte requiere traje seco, incluido en el tour. Para adolescentes de 12 años en adelante sin experiencia previa en kayak: el nivel de los fiordos es plano y manejable.',
      tags: ['Kayak', 'Focas', 'Medio día'],
      affiliateUrl: 'https://www.getyourguide.com/s/?q=Kayaking%20Isafjordur%20fjords',
    },
  ],

  experiencesDescription: 'Zorros, puffins y cascadas sin cola de turistas.',

  tips: [
    'El combustible: Los Westfjords tienen estaciones de servicio escasas y algunas cierran a las 6pm o antes. Llena el tanque siempre que el indicador baje de media, la siguiente gasolinera puede estar a 100 kilómetros. Las estaciones con pago automático 24 horas son las más útiles para la logística del itinerario.',
    'Las carreteras de grava: Un coche de alquiler estándar funciona perfectamente para este itinerario, no hace falta SUV para los Westfjords en agosto. El seguro de grava (gravel insurance) que ofrecen las empresas de alquiler sí es útil: las piedras levantadas por otros coches pueden romper el parabrisas.',
    'El sol de medianoche: En agosto, el sol no se pone hasta las 11pm en los Westfjords. Para adolescentes esto es una invitación permanente a seguir despiertos. Para el itinerario, es una ventaja: los lugares más fotogénicos (Dynjandi, Látrabjarg) tienen luz suave de tarde-noche que es exactamente la que buscan los fotógrafos.',
  ],

  funFact: 'La cadena Íslandshótel fue la primera cadena hotelera en obtener la certificación Green Key completa en todos sus hoteles en Islandia (17 propiedades certificadas). El Green Key es una certificación internacional de sostenibilidad turística presente en más de 60 países. En Islandia, el 100% de la electricidad de la red proviene de fuentes renovables, geotérmica e hídrica, lo que hace que cualquier hotel conectado a la red nacional sea automáticamente alimentado por energía limpia.',

  checklist: [
    '🧥 Impermeable, la lluvia es posible en cualquier momento',
    '🧣 Capas para los 7–12°C de las noches',
    '😴 Antifaz para dormir, el sol no se pone hasta las 11pm',
    '🧢 Chaqueta para el viento constante en los acantilados de Látrabjarg',
    '⛽ Efectivo o tarjeta, y llenar el tanque siempre que baje de media',
    '🚗 Reserva de coche de alquiler con seguro de grava (gravel insurance)',
    '💶 Efectivo para la entrada al Arctic Fox Centre (€15)',
  ],

  transport: [
    {
      mode: 'Vuelo',
      description: 'Dos opciones. Vuelo directo de Reykjavik (RKV, aeropuerto doméstico) a Ísafjörður (IFJ) en 45 minutos con Eagle Air (2–3 vuelos al día en agosto). O ruta de 5–6 horas desde Reykjavik por la Route 60, la carretera de cornisa más dramática del país, que es en sí misma parte del viaje. Para familias con adolescentes: la ruta es más flexible y más barata.',
    },
    {
      mode: 'Moverse en los Westfjords',
      description: 'Coche de alquiler es indispensable, sin coche la mitad de las paradas son inaccesibles. Las carreteras son en parte de grava en el interior; con niños pequeños se puede ir despacio. El límite de velocidad general es 80 km/h en carretera asfaltada y 60 km/h en grava.',
    },
    {
      mode: 'Clima en agosto',
      description: 'Agosto es el mes más cálido y seco de los Westfjords, días de 12–18°C, noches de 7–12°C. El sol no se pone hasta las 11pm, la familia que no establece hora de dormir pierde la noción del tiempo rápidamente. Lluvia posible en cualquier momento.',
      tip: 'Lleva impermeables para todos, incluso en los días más despejados del pronóstico.',
    },
  ],
}
