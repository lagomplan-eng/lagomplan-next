import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'pais-vasco',
  locale: 'es',

  hero: {
    title: 'País Vasco',
    subtitle: 'La región con más estrellas Michelin por kilómetro cuadrado del mundo. Cuatro días diseñados para tres parejas que quieren comer en serio, beber txakoli en la orilla del Cantábrico y descubrir que la diferencia entre un pintxo y una tapa no es solo el palillo que lo sostiene — es una filosofía entera.',
    eyebrow: 'Guía curada · 3 parejas · Gastronomía, Vino & Relax · 4 días · Presupuesto medio',
    tags: ['Parejas', 'Gastronomía', 'Vino', 'Relax'],
    image: '/images/guides/pais-vasco.jpg',
  },

  itinerary: [
    {
      day: 1,
      title: 'Llegada y primera ronda de pintxos',
      items: [
        {
          time: '14:00',
          title: 'Check-in',
          description: '',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Paseo por La Concha y Monte Urgull',
          description: 'La mejor playa urbana de Europa sin discusión seria, con subida al Monte Urgull para las vistas de la bahía y bajada al barrio de Gros para el primer café en la terraza del Zurriola.',
          tags: [],
        },
        {
          time: '19:30',
          title: 'Primera ronda de pintxos en Parte Vieja',
          description: 'Por libre — sin tour, sin lista: la Calle 31 de Agosto y la Calle Fermín Calbetón tienen la mayor densidad de bares por metro cuadrado de la ciudad.',
          tags: [],
        },
        {
          time: '22:00',
          title: 'Cena formal opcional',
          description: 'Reserva previa en Arzak o Mugaritz si el presupuesto lo permite.',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: 'Tour de pintxos + bodega de txakoli',
      items: [
        {
          time: '11:00',
          title: 'Private Pintxos Tour',
          description: '3 horas.',
          tags: [],
        },
        {
          time: '14:30',
          title: 'Descanso en el hotel',
          description: '',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Salida hacia Getaria',
          description: 'Txakoli Winery Tour.',
          tags: [],
        },
        {
          time: '20:30',
          title: 'Regreso y cena libre en Parte Vieja',
          description: 'La primera noche donde el grupo sabe exactamente qué está pidiendo y por qué, con criterio adquirido.',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Bilbao + Guggenheim',
      items: [
        {
          time: '09:00',
          title: 'Tren a Bilbao',
          description: 'Tren temprano, 1h15 de trayecto.',
          tags: [],
        },
        {
          time: '10:30',
          title: 'Museo Guggenheim',
          description: 'Entrada €13 EUR, reserva online. El edificio de Frank Gehry, el más influyente de la arquitectura de los últimos 30 años.',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Casco Viejo y Mercado de la Ribera',
          description: 'El mercado cubierto más grande de Europa.',
          tags: [],
        },
        {
          time: '14:30',
          title: 'Almuerzo de pintxos en el Casco Viejo',
          description: 'Los pintxos de Bilbao tienen su propio estilo y merecen ser comparados con los de San Sebastián.',
          tags: [],
        },
        {
          time: '17:00',
          title: 'Tren de regreso a San Sebastián',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'Mercado + clase de cocina + despedida',
      items: [
        {
          time: '09:30',
          title: 'Market Tour + Cooking Experience',
          description: '4 horas.',
          tags: [],
        },
        {
          time: '14:00',
          title: 'Almuerzo con lo cocinado',
          description: '',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Tarde libre',
          description: 'Última playa de La Concha, última vuelta por Parte Vieja, compras en las tiendas de conservas de anchoa y txakoli para llevar.',
          tags: [],
        },
        {
          time: '20:30',
          title: 'Cena de despedida',
          description: 'En el restaurante del hotel o en alguna de las referencias que el grupo haya identificado durante el viaje.',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Hotel Arbaso',
      type: 'Hotel boutique · Parte Vieja',
      priceTier: '$$',
      description: 'Boutique hotel en un edificio histórico restaurado a pasos de la Catedral del Buen Pastor y del barrio de pintxos de Parte Vieja. El restaurante Narru del chef Iñigo Peña tiene una estrella Michelin y sirve cocina vasca contemporánea — la mejor mesa del hotel que no requiere desplazamiento. Bicicletas gratuitas para explorar la ciudad, personal que conoce cada pintxos bar de la ciudad por nombre y temporada. Para las tres parejas que quieren estar en el centro de la gastronomía vasca sin salir del hotel. Precio estimado: €180–320/noche habitación doble.',
      tag: 'Boutique en el corazón pintxero, con Narru (Michelin)',
      affiliateUrl: 'http://booking.com/hotel/es/arbaso.html',
      archetypes: ['Parejas'],
    },
    {
      name: 'Lasala Plaza Hotel',
      type: 'Hotel de diseño · Puerto Deportivo',
      priceTier: '$$',
      description: 'Hotel de diseño contemporáneo frente al puerto deportivo y la bahía de la Concha, con rooftop bar y terraza con vistas al Cantábrico y al Monte Urgull. Ubicación perfecta entre la Parte Vieja (5 minutos a pie) y Gros (el barrio de surf). El restaurante propio tiene acceso a los mejores proveedores locales de txipirón y merluza. Para la pareja del grupo que quiere las vistas al mar con el mismo acceso a los pintxos. Precio estimado: €200–350/noche habitación doble.',
      tag: 'Frente al puerto deportivo y La Concha',
      affiliateUrl: 'http://booking.com/hotel/es/plaza-lasala.html',
      archetypes: ['Parejas'],
    },
    {
      name: 'Hotel de Londres y de Inglaterra',
      type: 'Hotel histórico · La Concha',
      priceTier: '$$$',
      description: 'El gran hotel histórico de San Sebastián desde 1863: balcones Belle Époque directamente sobre la playa de La Concha, la bahía más fotogénica de Europa al frente. Donde se han alojado Alfonso XIII, el rey Balduino de Bélgica y Ava Gardner en temporadas diferentes. Restaurante Negresco con cocina vasca clásica, bar del lobby con la mejor lista de vinos de Rioja y Ribera del Duero de la ciudad. Para la pareja del grupo que quiere el hotel con más historia de la costa vasca. Precio estimado: €280–480/noche habitación doble.',
      tag: 'Balcones Belle Époque sobre La Concha desde 1863',
      affiliateUrl: 'https://www.booking.com/hotel/es/londresinglaterra.html',
      archetypes: ['Parejas'],
    },
  ],

  hotelsDescription: 'San Sebastián como epicentro.',

  experiences: [
    {
      name: 'Private Pintxos Tour in Parte Vieja',
      description: 'El tour de pintxos más bien valorado de San Sebastián: guía local con selección curada de seis bares de Parte Vieja, maridaje de txakoli y sidra asturiana con cada parada y contexto sobre la cultura de la barra vasca — las reglas no escritas del pintxo, la diferencia entre los bares de pintxos fríos y calientes y por qué se come de pie. Para las tres parejas que quieren la introducción correcta antes de explorar por libre. 3 horas, grupos de máximo 8 personas. Disponible en inglés y español.',
      tags: ['Pintxos', 'Maridaje', 'Grupo reducido'],
      affiliateUrl: 'https://www.getyourguide.com/en-gb/san-sebastian-l94/san-sebastian-food-tour-pintxo-tasting-wines-t110908/',
    },
    {
      name: 'Txakoli Winery Tour in Getaria',
      description: 'Getaria está a 20 km al oeste de San Sebastián — el pueblo de pescadores donde nació Juan Sebastián Elcano y donde crece el txakoli, el vino blanco con burbuja natural que es el vino del País Vasco por excelencia. El tour incluye visita a una bodega familiar en activo, recorrido por los viñedos sobre el Cantábrico y degustación de cuatro txakolis con pintxos de anchoa local. Medio día, transporte desde San Sebastián incluido.',
      tags: ['Vino', 'Viñedos', 'Getaria'],
      affiliateUrl: 'https://www.getyourguide.com/en-gb/san-sebastian-l94/discover-the-essence-of-txakoli-wine-from-san-sebastian-t110959/',
    },
    {
      name: 'San Sebastián Market Tour + Cooking Experience',
      description: 'El Mercado de La Bretxa en el centro de Parte Vieja tiene los mejores productos del Cantábrico: anchoa fresca de Bermeo, txipirón de temporada, hongos de Navarra y queso Idiazabal. El tour combina recorrido matutino por el mercado con el cocinero que compra los ingredientes y una clase de cocina vasca de 2 horas (bacalao al pil-pil o merluza en salsa verde). Para el grupo que quiere entender la cocina vasca antes de sentarse a comerla.',
      tags: ['Mercado', 'Clase de cocina', 'Cocina vasca'],
      affiliateUrl: 'https://www.getyourguide.com/en-gb/san-sebastian-l94/san-sebastian-market-tour-and-basque-cooking-class-english-t980847/',
    },
  ],

  experiencesDescription: 'Pintxos, txakoli y mercado de La Bretxa.',

  tips: [
    'La hora del pintxo: Los pintxos se comen entre las 12:00 y las 14:00 (vermut) y entre las 19:00 y las 21:00 (la hora de antes de cenar). A las 22:00 los mejores pintxos ya están agotados en la mayoría de los bares. El grupo que llega a las 7:30pm tiene la barra llena y el producto fresco.',
    'El sistema de barra: En los mejores bares de Parte Vieja, los pintxos están sobre la barra y se cogen directamente — se cuenta al pagar. En algunos bares más nuevos hay carta. La diferencia entre un pintxos bar serio y uno turístico: el de los locales tiene la barra llena a las 7:45pm y vacía a las 9pm. El turístico tiene la barra llena a las 9pm.',
    'El txakoli se sirve desde altura: El txakoli se vierte desde 30–40 cm de altura para oxigenar el vino y crear la burbuja natural. Si el barman no hace esto, no es un bar de txakoli serio. Si lo hace, el primer vaso se convierte en un pequeño espectáculo.',
  ],

  funFact: 'El idioma vasco — el euskera — es el único idioma de Europa occidental sin relación genética conocida con ninguna otra lengua del mundo. No es indoeuropeo, no es semítico, no deriva del latín ni del árabe. Los lingüistas llevan 200 años debatiendo su origen y no hay consenso. Los vascos lo llaman "la lengua madre" — hitzezko erroa, la raíz de las palabras — y lo hablan 750,000 personas entre España y Francia como primera o segunda lengua.',

  checklist: [
    '👟 Zapatos cómodos para caminar la ciudad y subir al Monte Urgull',
    '💵 Efectivo para las barras de pintxos',
    '🩱 Traje de baño para La Concha',
    '🧴 Protector solar para los días despejados',
    '📅 Reservas de restaurantes y hotel hechas con semanas de antelación',
    '👗 Algo elegante para una cena en Arzak o Mugaritz',
    '🎟️ Entrada online reservada para el Guggenheim',
    '🚲 Ropa cómoda para aprovechar las bicicletas gratuitas del hotel',
  ],

  transport: [
    {
      mode: 'Vuelo',
      description: 'Aeropuerto de San Sebastián (EAS), a 20 km del centro — vuelos domésticos desde Madrid y Barcelona. Alternativa más conectada: Aeropuerto de Bilbao (BIO), a 100 km de San Sebastián (1 hora y 15 minutos en autobús ALSA, €12 EUR; vuelos directos desde Madrid, Barcelona, Londres, Paris y Amsterdam). Para volar desde México o Latinoamérica: conexión en Madrid (Iberia) o en Londres o Paris.',
    },
    {
      mode: 'Traslados',
      description: 'San Sebastián a pie y en bici para los cuatro días (la ciudad entera cabe en un radio de 3 km). Para la excursión a Bilbao: tren Euskotren desde la estación de Amara (1h 15min, €5 EUR) o autobús ALSA. Para la bodega de Getaria: el tour incluye transporte.',
    },
    {
      mode: 'Clima en julio',
      description: 'Días de 22–26°C, cielos despejados y el Cantábrico a 21°C de temperatura. Julio es el mes más concurrido de la ciudad — reserva restaurantes y hoteles con semanas de anticipación. La lluvia que caracteriza el País Vasco el resto del año prácticamente desaparece en julio.',
    },
  ],
}
