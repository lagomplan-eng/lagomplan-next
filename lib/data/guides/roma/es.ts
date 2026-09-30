import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: 'roma',
  locale: 'es',

  hero: {
    title: 'Roma',
    subtitle: 'Octubre es el mes que Roma guarda para sí misma. El calor y las filas del verano ya se fueron y la ciudad recupera su escala humana. Para la pareja que quiere comer bien, caminar despacio y terminar cada noche en una trattoria de Trastevere sin reserva previa.',
    eyebrow: 'Guía curada · Pareja · Gastronomía & Relax · 5 días · Presupuesto medio',
    tags: ['Pareja', 'Gastronomía', 'Relax', 'Historia'],
    image: '/images/guides/roma.png',
  },

  itinerary: [
    {
      day: 1,
      title: 'Llegada y primera noche en Trastevere',
      items: [
        {
          time: '15:00',
          title: 'Llegada y check-in',
          description: 'Leonardo Express a Termini, taxi o Bolt al hotel. La primera tarde no tiene agenda.',
          tags: [],
        },
        {
          time: '17:00',
          title: 'Primera caminata por Trastevere',
          description: 'Paseo por Trastevere al ritmo del barrio, sin prisa.',
          tags: [],
        },
        {
          time: '19:00',
          title: 'Aperitivo en la Piazza di Santa Maria',
          description: '',
          tags: [],
        },
        {
          time: '20:30',
          title: 'Cena en trattoria local (Da Enzo al 29 o Tonnarello)',
          description: 'Alguna trattoria sin menú en inglés visible en la fachada.',
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: "Campo de' Fiori y clase de pasta",
      items: [
        {
          time: '08:30',
          title: "Mercado de Campo de' Fiori",
          description: 'El más fotogénico y el más turístico de Roma, pero a las 8:30am todavía tiene verduras y vendedores locales.',
          tags: [],
        },
        {
          time: '10:30',
          title: 'Café en el Barrio Monti (Antico Caffè del Moro)',
          description: '',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Almuerzo en alguna enoteca del Monti',
          description: '',
          tags: [],
        },
        {
          time: '16:00',
          title: 'Clase de pasta en Trastevere con food tour',
          description: 'Al atardecer.',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Regreso al hotel',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: 'Vaticano y Prati',
      items: [
        {
          time: '09:00',
          title: 'Museos Vaticanos (entrada reservada online)',
          description: 'Las entradas online con entrada prioritaria son clave.',
          tags: [],
        },
        {
          time: '12:30',
          title: 'Almuerzo en Prati',
          description: 'El barrio, adyacente al Vaticano, tiene el mejor tiramisú de Roma (Il Sorpasso) y las mejores pizzerías al taglio del centro norte.',
          tags: [],
        },
        {
          time: '14:30',
          title: "Paseo por el Castel Sant'Angelo y la orilla del Tíber",
          description: '',
          tags: [],
        },
        {
          time: '18:00',
          title: 'Aperitivo en algún bar de Prati',
          description: '',
          tags: [],
        },
        {
          time: '21:00',
          title: 'Tour gastronómico nocturno en Trastevere (si no se hizo el día 2)',
          description: 'Cuatro horas al atardecer con un guía local que sabe exactamente qué trattoria tiene la carbonara correcta.',
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: 'Coliseo, Foro Romano y Testaccio',
      items: [
        {
          time: '09:00',
          title: 'Coliseo (entrada online, acceso prioritario)',
          description: 'El lado más antiguo de Roma.',
          tags: [],
        },
        {
          time: '11:00',
          title: 'Foro Romano y Palatino',
          description: 'Un conjunto arqueológico que ocupa la mañana entera sin necesidad de guía.',
          tags: [],
        },
        {
          time: '13:30',
          title: 'Mercado de Testaccio',
          description: 'Los mejores puestos de comida romana del centro sin los precios de restaurante.',
          tags: [],
        },
        {
          time: '15:30',
          title: 'Clase de pasta junto al Coliseo (si no se hizo antes)',
          description: '',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Cena en Testaccio',
          description: '',
          tags: [],
        },
      ],
    },
    {
      day: 5,
      title: 'Despedida por los Castelli Romani',
      items: [
        {
          time: '09:30',
          title: 'Tren desde Termini a Frascati',
          description: '30 minutos, €2.10.',
          tags: [],
        },
        {
          time: '10:30',
          title: 'Pueblo de Frascati o Castelgandolfo',
          description: 'La residencia de verano de los papas.',
          tags: [],
        },
        {
          time: '13:00',
          title: 'Almuerzo largo con Frascati DOC',
          description: 'El plan más Lagom de los cinco días: sin agenda después del postre. A 30 km al sureste de Roma, los Castelli Romani tienen los vinos blancos más frescos del Lacio y vistas al volcán Albano.',
          tags: [],
        },
        {
          time: '16:30',
          title: 'Regreso a Roma',
          description: '',
          tags: [],
        },
        {
          time: '18:30',
          title: 'Últimas compras en el Monti',
          description: '',
          tags: [],
        },
        {
          time: '20:00',
          title: 'Transfer al aeropuerto',
          description: 'Según horario de vuelo.',
          tags: [],
        },
      ],
    },
  ],

  hotels: [
    {
      name: 'Casa Monti Roma',
      type: 'Hotel boutique · Barrio Monti',
      priceTier: '$$$',
      description: 'El hotel boutique mejor valorado por parejas de todo el centro histórico (9.8 sobre 10 en Booking). Abierto en 2024 en una casa del barrio más bohemio de Roma, con restaurante propio de cocina italiana de autor, bar, jacuzzi y terraza con vistas al Foro de Trajano. El barrio de Monti tiene la concentración más alta de enotecas, tiendas de diseño independiente y trattorias sin menú turístico de la ciudad. El Coliseo está a ocho minutos caminando; la estación de Metro Cavour, a tres.',
      tag: 'El favorito de las parejas en el centro histórico',
      affiliateUrl: '',
      archetypes: ['Parejas'],
    },
    {
      name: 'Trastevere Luxury Rooms',
      type: 'Hotel · Trastevere',
      priceTier: '$$$',
      description: 'En el barrio más fotogénico de Roma, a pasos de la Piazza di Santa Maria in Trastevere. Desayuno buffet continental con opciones veganas y sin gluten, cerveza y vino en la habitación como bienvenida, minibar incluido y personal súper amable. Para la pareja que quiere despertar en Trastevere antes de que lleguen los turistas del día.',
      tag: 'Despertar en Trastevere antes que nadie',
      affiliateUrl: '',
      archetypes: ['Parejas'],
    },
    {
      name: 'Condominio Monti Boutique Hotel',
      type: 'Hotel · Barrio Monti',
      priceTier: '$$',
      description: 'Jardín en la azotea con vistas panorámicas a los techos de Roma, desayuno buffet con frutas y croissants. A cinco minutos caminando del Coliseo y una parada de Metro desde Termini. Las habitaciones son funcionales y amplias, el ambiente es de hotel de barrio de toda la vida y el rooftop bar que sirve aperitivo es, según las reseñas, la mejor terraza del centro.',
      tag: 'El Monti sin pagar precio de diseño',
      affiliateUrl: '',
      archetypes: ['Parejas'],
    },
  ],

  hotelsDescription: 'Tres opciones entre Monti y Trastevere, los dos barrios donde vale la pena quedarse.',

  experiences: [
    {
      name: 'Clase de pasta en Trastevere',
      description: 'Tres horas recorriendo los callejones de Trastevere con paradas en el mercado de San Cosimato (donde los romanos hacen sus compras cada mañana) seguidas de una clase de pasta fresca en la trattoria Rione XIII con vino ilimitado incluido. Aprenderás a hacer fettuccine y ravioli desde cero. Incluye catas de porchetta y gelato artesanal.',
      tags: ['Gastronomía', 'Clase', 'Trastevere'],
      affiliateUrl: '',
    },
    {
      name: 'Tour exclusivo del Coliseo con acceso al sótano de la arena',
      description: 'Acceso a las zonas restringidas del Coliseo: los túneles subterráneos donde los gladiadores y los animales esperaban antes de subir a la arena, y el suelo donde pelearon. Incluye el Foro Romano y el Palatino. Lo más distinto que puedes hacer en el Coliseo respecto a la entrada estándar.',
      tags: ['Historia', 'Coliseo', 'Acceso exclusivo'],
      affiliateUrl: '',
    },
    {
      name: 'Tour gastronómico nocturno en Trastevere con cata de vinos',
      description: "Cuatro horas al atardecer por las calles de Trastevere con un guía local que sabe exactamente qué trattoria tiene la carbonara correcta y en cuál bodega hay que bajar al sótano para encontrar el vino de la zona. Pizza romana, pasta, porchetta, gelato y vino en bodega de 150 años incluidos.",
      tags: ['Gastronomía', 'Vino', 'Nocturno'],
      affiliateUrl: '',
    },
  ],

  tips: [
    'La carbonara correcta: huevo, guanciale (papada de cerdo, no pancetta), pecorino romano y pimienta negra. Sin crema, sin cebolla, sin ajo. Los mejores: Roscioli (Centro Histórico, reserva necesaria), Da Enzo al 29 (Trastevere), Osteria dell\'Angelo (Prati).',
    'El agua potable de Roma: las nasoni (fuentes públicas de hierro fundido) tienen agua de manantial del Aqueducto Vergine, en servicio desde el 19 a.C. No compres botellas de plástico en Roma.',
    'Evita las terrazas del Panteón: los bares y restaurantes inmediatamente alrededor del Panteón y de la Fontana di Trevi tienen precios injustificados. Caminando dos calles en cualquier dirección, el mismo café cuesta la mitad y está mejor hecho.',
  ],

  funFact: 'Roma tiene más fuentes públicas que cualquier otra ciudad del mundo. El sistema de acueductos de la ciudad tiene en algunos tramos más de 2,000 años de antigüedad y sigue operativo. El Acueducto Vergine, que alimenta la Fontana di Trevi, fue construido en el año 19 a.C. por Marco Vipsanio Agripa para suministrar agua a las termas de Agrippa.',

  checklist: [
    '👟 Zapatos cómodos para adoquines',
    '🧥 Chamarra ligera para las noches (11-15°C)',
    '☔ Impermeable compacto — lluvia posible en octubre',
    '📱 Entradas reservadas online para el Coliseo y el Vaticano',
    '💶 Euros en efectivo para mercados y trattorias pequeñas',
    '🍝 Apetito — hay mucho que comer',
  ],

  transport: [
    {
      mode: 'Vuelo',
      description: 'Aeropuerto Internacional Leonardo da Vinci (FCO, Fiumicino), a 32 km del centro. Leonardo Express directo a Roma Termini cada 30 minutos: 32 minutos, €14. Alternativa económica: Ciampino (CIA) a 15 km, con bus Terravision o SitBusShuttle a Termini (~50 min, €6). Vuelos directos desde Madrid, Barcelona, Ciudad de México (con conexión) y la mayoría de capitales europeas.',
    },
    {
      mode: 'Moverse en Roma',
      description: "El centro histórico se camina; Trastevere, Monti, el Panteón, el Campo de' Fiori y el Vaticano están conectados a pie. El Metro tiene dos líneas (A y B) útiles para llegar a puntos extremos. Bolt funciona bien y es más barato que los taxis amarillos de la calle. Para el Vaticano y el Coliseo en octubre: reservar la entrada online antes de llegar.",
    },
    {
      mode: 'Clima',
      description: 'En octubre: 17-22°C de día, 11-15°C de noche. Algo de lluvia posible, lleva una chamarra ligera e impermeable compacto. La luz de octubre en Roma tiene una calidad que los fotógrafos buscan específicamente: el ángulo bajo del sol sobre los edificios de travertino al atardecer.',
    },
  ],
}
