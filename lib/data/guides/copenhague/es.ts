import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'copenhague',
  locale: 'es',

  hero: {
    title: 'Copenhague',
    subtitle: 'La capital nórdica que tiene más restaurantes con estrellas Michelin por kilómetro cuadrado que cualquier ciudad de Escandinavia, el barrio de fiesta más honesto de Europa en el Meatpacking District y una cultura del café que convierte el desayuno en el primer plan del día. Para el grupo que viene a comer bien, beber mejor y descubrir que Copenhague no cierra antes de las 2am.',
    eyebrow: 'Guía curada · Grupo de amigos · Gastronomía & Fiesta · 5 días · Presupuesto medio',
    tags: ['Grupo de amigos', 'Gastronomía', 'Fiesta'],
    image: '/images/guides/copenhague.jpg',
  },

  itinerary: [
    {
      day: 1,
      title: 'Llegada y canal tour',
      items: [
        {
          time: '14:00',
          title: 'Check-in y descanso',
          description: '',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Canal Boat Tour',
          description: '1 hora, desde Nyhavn, para orientarse con la geografía de la ciudad.',
          tags: [],
        },
        {
          time: '17:30',
          title: 'Nyhavn y primer paseo por el puerto',
          description: 'La postal obligatoria de las casas de colores sobre el canal — es turístico y merece ser visto.',
          tags: [],
        },
        {
          time: '19:30',
          title: 'Cena en Torvehallerne',
          description: 'El mercado cubierto de Nørreport con los mejores puestos de comida de la ciudad, sin reserva necesaria.',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Gastronomía y Vesterbro',
      items: [
        {
          time: '11:00',
          title: 'Food Tour',
          description: '3 horas por Vesterbro y el Meatpacking District.',
          tags: [],
        },
        {
          time: '14:30',
          title: 'Frederiksberg para el café post-tour',
          description: 'Tarde libre en el barrio de Frederiksberg, terrazas y boutiques independientes.',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Cena en Kødbyen',
          description: 'Kødbyens Fiskebar para marisco, Mother para pizza napolitana o Bæst para charcutería italiana.',
          tags: [],
        },
        {
          time: '23:00',
          title: 'La noche sigue en Kødbyen',
          description: 'El Meatpacking District con restaurantes, bares y clubs que abren cuando la mayoría de Europa ya está durmiendo.',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Castillo de Kronborg + Helsingør',
      items: [
        {
          time: '09:30',
          title: 'Tren a Helsingør',
          description: '45 minutos desde la Estación Central, €10 EUR.',
          tags: [],
        },
        {
          time: '11:00',
          title: 'Castillo de Kronborg',
          description: 'Entrada €18 EUR. El Elsinore de Hamlet, Patrimonio UNESCO, en el pueblo histórico de Helsingør.',
          tags: [],
        },
        {
          time: '13:30',
          title: 'Almuerzo en el puerto de Helsingør',
          description: 'Vista al estrecho de Øresund y Suecia al fondo.',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Tren de regreso',
          description: '',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Cena casual en Nørrebro',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'Nørrebro + Christiania + Nightlife',
      items: [
        {
          time: '10:00',
          title: 'Assistens Kirkegård y Nørrebro a pie',
          description: 'El cementerio donde están enterrados Hans Christian Andersen y Søren Kierkegaard, que los daneses usan como parque de picnic sin que nadie vea la incongruencia.',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Almuerzo en Reffen Street Food Market',
          description: '',
          tags: [],
        },
        {
          time: '15:00',
          title: 'Christianshavn y Christiania',
          description: 'Canales y arquitectura holandesa en Christianshavn; Christiania, la ciudad libre anarquista dentro de Copenhague, para el que quiera explorarla.',
          tags: [],
        },
        {
          time: '18:00',
          title: 'Nørrebro Tour',
          description: 'Nørrebro Street Food & Nightlife Tour por la tarde.',
          tags: [],
        },
        {
          time: '22:00',
          title: 'La noche más larga del viaje',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 5,
      title: 'Museos y despedida',
      items: [
        {
          time: '10:00',
          title: 'Tren al Louisiana Museum',
          description: '40 minutos desde la estación de Copenhague H. Entrada €18 EUR. El museo de arte más visitado de Escandinavia, con escultura de Giacometti y Calder en un jardín sobre el Mar Báltico.',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Regreso a Copenhague',
          description: '',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Últimas compras en el centro',
          description: 'Strøget o Torvehallerne.',
          tags: [],
        },
        {
          time: '',
          title: 'Transfer al aeropuerto',
          description: '',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Coco Hotel',
      type: 'Hotel boutique · Vesterbro',
      priceTier: '$$',
      description: 'Boutique hotel con diseño danés minimalista — ventanas altas, techos del siglo XIX, paleta de azules y neutros — en el corazón de Vesterbro, el barrio más activo para comer y salir de Copenhague. Desayuno orgánico incluido, bar propio en planta baja y una ubicación que pone al grupo a cuatro minutos caminando del Meatpacking District (Kødbyen) sin que nadie tenga que pagar Uber de vuelta. El hotel que no intenta ser otra cosa de lo que es. Precio estimado: €160–280/noche habitación doble.',
      tag: 'Diseño danés boutique en el corazón de Vesterbro',
      affiliateUrl: 'http://booking.com/hotel/dk/copenhagen-crown.en-gb.html',
    },
    {
      name: 'Cityhub Copenhagen',
      type: 'Hotel cápsula · Vesterbro',
      priceTier: '$$',
      description: 'La versión danesa del hotel cápsula japonés: hubs individuales con cama doble, sistema de iluminación y audio controlado por app, kimonos incluidos, baños spa compartidos de nivel de hotel de lujo y el Mikkeller Bar en el mismo edificio — la mejor cervecería artesanal de Copenhague. Adults-only. Para el miembro del grupo que prioriza el precio sobre el espacio y quiere la experiencia más "Copenhagen" del set. Precio estimado: €90–160/noche por hub.',
      tag: 'Hotel cápsula adults-only con cervecería propia',
      affiliateUrl: 'https://www.booking.com/hotel/dk/cityhub-copenhagen.en-gb.html',
    },
    {
      name: 'Hotel Ottilia',
      type: 'Hotel de diseño · Carlsberg City District',
      priceTier: '$$',
      description: 'Hotel de diseño en el antiguo distrito de la cervecería Carlsberg — los edificios de ladrillo rojo de la fábrica del siglo XIX reconvertidos en residencias, restaurantes y tiendas. Habitaciones con techos altos, selección de cervezas artesanales locales en el minibar y una ubicación a 10 minutos en bicicleta del Meatpacking District. Para el grupo que quiere el ambiente de barrio histórico reconvertido que Copenhagen ha dominado mejor que ninguna otra ciudad de Europa. Precio estimado: €140–240/noche habitación doble.',
      tag: 'Ladrillo industrial reconvertido en el distrito Carlsberg',
      affiliateUrl: 'http://booking.com/hotel/dk/ottilia.es.html',
    },
  ],

  hotelsDescription: 'Vesterbro y sin excusas.',

  experiences: [
    {
      name: 'Copenhagen Food Tour — Vesterbro & Meatpacking District',
      description: 'El tour gastronómico más completo de la ciudad: smørrebrød (el pan de centeno con toppings que es el desayuno de los daneses serios), cerveza artesanal de Mikkeller, stegt flæsk (la carne de cerdo crujiente que ganó el título de plato nacional danés por votación popular) y regaliz negro salado — el dulce más extraño y más adictivo del país. 3 horas, grupos pequeños, conductor en inglés. Para el grupo que quiere entender la gastronomía danesa antes de salir a los restaurantes.',
      tags: ['Gastronomía', 'Grupos pequeños', 'Vesterbro'],
      affiliateUrl: 'https://www.getyourguide.com/copenhague-l12/copenhague-tour-gastronomico-con-mas-de-6-degustaciones-de-clasicos-daneses-t612757/',
    },
    {
      name: 'Copenhagen Canal Boat Tour',
      description: 'Los canales de Copenhague son la forma más eficiente de entender la geografía de la ciudad: Nyhavn, el Puerto de Christianshavn, la Ópera de Henning Larsen y los barrios residenciales del agua en 1 hora. El tour incluye guía y sale cada 30 minutos desde Nyhavn. Para el grupo que quiere el plano de la ciudad antes de perderse en sus barrios: el canal tour primero, el resto después.',
      tags: ['Canales', 'Orientación', 'Nyhavn'],
      affiliateUrl: 'https://www.getyourguide.com/copenhague-l12/copenhague-tour-en-barco-por-los-canales-desde-gammel-strand-t37848/',
    },
    {
      name: 'Nørrebro Street Food & Nightlife Experience',
      description: 'Nørrebro es el barrio más multicultural de Copenhague y el que tiene la mayor densidad de restaurantes no-nórdicos de calidad: turco, etíope, mexicano, árabe. El tour de tarde-noche cubre el Reffen Street Food Market (el mercado al aire libre más grande de la ciudad), tres paradas de comida y una introducción al circuito de bares locales lejos del circuito turístico de Nyhavn. 3 horas, grupos de máximo 8 personas. El plan de la noche más interesante de los cinco días.',
      tags: ['Street food', 'Nightlife', 'Nørrebro'],
      affiliateUrl: 'https://www.getyourguide.com/en-gb/copenhagen-l12/copenhagen-s-a-taste-of-denmark-tasting-tour-t21977/',
    },
  ],

  experiencesDescription: 'Mercados, canales y smørrebrød.',

  tips: [
    'Los precios daneses son reales: Copenhague es cara. Una cerveza de bar cuesta €7–10 EUR, un almuerzo de restaurante €20–35 EUR, una cena con vino €50–80 EUR por persona. El grupo que lo sabe de antemano y presupuesta bien no tiene sorpresas. El que llega sin saberlo pasa los cinco días en shock.',
    'La hygge de los supermercados: El supermercado Netto o Aldi danés tiene quesos locales, rye bread, arenque marinado y cervezas Mikkeller en botella a precio de supermercado. Para el desayuno en el hostel o el picnic en el canal, es la versión más hygge y más barata del viaje.',
    'El Reffen: El Reffen Street Food Market en el puerto de Copenhague, abierto de mayo a octubre, tiene 80 puestos de cocinas del mundo, terrazas sobre el agua y música en vivo los fines de semana. Para el grupo que quiere el almuerzo más variado y más fotogénico de la ciudad: Reffen gana sobre cualquier restaurante en términos de experiencia colectiva.',
  ],

  funFact: 'Copenhague fue la primera ciudad del mundo en tener un Ombudsman — el defensor del pueblo — en 1809. También fue la primera en declararse "ciudad carbono neutro" con fecha concreta (2025, aunque el objetivo se retrasó a 2030). La bicicleta, el diseño sostenible y el urbanismo a escala humana no son tendencia aquí — llevan décadas siendo política municipal. El 62% de los copenhaguenses van al trabajo en bicicleta independientemente del clima.',

  checklist: [
    '🚲 Ropa y calzado cómodo para bici y caminatas — cubren el 95% del itinerario',
    '🧥 Una capa ligera para las noches — el Atlántico siempre enfría',
    '💳 Presupuesto extra para precios daneses (cerveza €7–10, cena con vino €50–80 por persona)',
    '💶 Efectivo o tarjeta para alquilar bicicleta (€10–15/día)',
    '🩱 Traje de baño para el harbor bath en el puerto',
    '🎫 Presupuesto para el City Pass de 24 horas (€12) del primer día',
    '🕶️ Lentes de sol — el sol no se pone hasta las 10pm en julio',
    '🧺 Bolsa reusable para el picnic de supermercado (Netto o Aldi)',
  ],

  transport: [
    {
      mode: 'Vuelo',
      description: 'Aeropuerto de Copenhague (CPH), a 12 km del centro. Metro M2 directo al centro en 15 minutos (€3 EUR). Vuelos directos desde Madrid, Barcelona, Roma, Londres, Frankfurt y Amsterdam. Desde México o América Latina: conexión en cualquier hub europeo (Iberia en Madrid, Lufthansa en Frankfurt, British Airways en Londres).',
    },
    {
      mode: 'Moverse en la ciudad',
      description: 'La combinación bici + metro + caminar cubre el 95% del programa de cinco días. Copenhague tiene 400 km de carriles bici y la mayoría de los hostales y hoteles alquilan bicis por €10–15 EUR/día. El City Pass de 24 horas cubre metro, buses y trenes de cercanías por €12 EUR — útil el primer día de orientación. Uber existe pero nadie lo usa.',
    },
    {
      mode: 'Clima en julio',
      description: 'Días de 20–25°C, noches de 14–17°C. El mejor mes del año para Copenhague: el sol no se pone hasta las 10pm en julio, los daneses sacan las mesas a la calle y el harbor bath (baño en el puerto) funciona a pleno rendimiento. Lleva una capa para las noches — el Atlántico siempre enfría.',
    },
  ],
}
