import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: "houston",
  locale: "es",
  hero: {
    title: "Houston con adolescentes",
    subtitle: "La Galleria abre temprano en Black Friday y tus hijos llegan con una lista. Un día antes vieron pasar globos gigantes por el centro; al siguiente van a pararse frente al control de misión que llevó al hombre a la Luna. Esta ruta usa la semana de Thanksgiving en Houston para mezclar compras, deporte en vivo, NASA y luces navideñas.",
    eyebrow: "Guía curada · Familia con adolescentes · Compras y diversión · 6 días · Presupuesto alto",
    tags: ["Familia", "Adolescentes", "Compras", "Ciudad"],
    image: "/images/guides/houston.png",
  },
  itinerary: [
    {
      day: 1,
      title: "Llegada, Galleria y Rockets",
      items: [
        {
          time: "Mediodía",
          title: "Llegada a Houston, renta de auto y check-in",
          description: "",
          tags: [],
        },
        {
          time: "Tarde",
          title: "Primera vuelta a la Galleria, el centro comercial más grande de Texas, con más de 400 tiendas y pista de hielo bajo techo",
          description: "",
          tags: [],
        },
        {
          time: "Noche",
          title: "Partido de los Houston Rockets si juegan en casa",
          description: "En 2026 reciben a los Phoenix Suns (ver Cuándo ir).",
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: "Desfile de Thanksgiving y Zoo Lights",
      items: [
        {
          time: "Temprano",
          title: "Lleguen al centro con tiempo por un buen lugar en la ruta",
          description: "",
          tags: [],
        },
        {
          time: "9:00",
          title: "Desfile de Thanksgiving H-E-B, gratuito, con carros alegóricos, globos gigantes y bandas",
          description: "Recorre más de 20 cuadras del lado de City Hall: de Lamar y Smith hacia el norte por Smith, Walker, Milam, Pease, Louisiana y Clay, hasta Smith y Dallas.",
          tags: [],
        },
        {
          time: "Mediodía",
          title: "Comida de Thanksgiving con reservación",
          description: "",
          tags: [],
        },
        {
          time: "Desde las 17:30",
          title: "Zoo Lights en el Zoológico de Houston, abierto incluso en Thanksgiving",
          description: "Horarios y precio en Cuándo ir.",
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: "Black Friday",
      items: [
        {
          time: "A primera hora",
          title: "Galleria, que en Black Friday abre antes de lo habitual",
          description: "Horarios en Cuándo ir.",
          tags: [],
        },
        {
          time: "Mediodía",
          title: "Pausa para comer y escape room en la Galleria (ver Experiencias), junto a la pista de hielo",
          description: "",
          tags: [],
        },
        {
          time: "Tarde",
          title: "Segunda ronda: outlets o tiendas pendientes",
          description: "",
          tags: [],
        },
        {
          time: "Noche",
          title: "Cena y descanso",
          description: "Si les interesa el ballet, El Cascanueces del Houston Ballet abre temporada ese viernes en el Wortham Theater Center.",
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: "NASA y el control de misión",
      items: [
        {
          time: "Mañana",
          title: "Tour del Control de Misión Histórico + entrada a Space Center Houston",
          description: "Un día completo con el Saturn V, Rocket Park y la sala desde donde se dirigieron las misiones Apolo.",
          tags: [],
        },
        {
          time: "Al atardecer",
          title: "Si quieren quedarse, Galaxy Lights, el festival de luces de Space Center Houston",
          description: "Fechas en Cuándo ir.",
          tags: [],
        },
        {
          time: "Noche",
          title: "Cena de regreso en Houston",
          description: "",
          tags: [],
        },
      ],
    },
    {
      day: 5,
      title: "Texans o acuario",
      items: [
        {
          time: "Mediodía, opción A",
          title: "Partido de los Houston Texans si juegan en casa",
          description: "En 2026 reciben a los Baltimore Ravens en NRG Park. Compren boletos y estacionamiento con anticipación.",
          tags: [],
        },
        {
          time: "Mañana, opción B",
          title: "Downtown Aquarium con pase de todo el día, juegos mecánicos incluidos",
          description: "",
          tags: [],
        },
        {
          time: "Tarde",
          title: "Última ronda de compras o descanso en el hotel",
          description: "",
          tags: [],
        },
      ],
    },
    {
      day: 6,
      title: "Regreso",
      items: [
        {
          time: "Mañana",
          title: "Desayuno y maletas",
          description: "Reserven espacio: las compras ocupan más de lo que parece.",
          tags: [],
        },
        {
          time: "Mediodía",
          title: "Check-out y salida al aeropuerto con tres horas de margen para vuelo internacional",
          description: "",
          tags: [],
        },
      ],
    },
  ],
  itineraryDescription: "Cinco noches con base en la zona de la Galleria (Uptown) o en el centro. En Houston conviene rentar auto: las distancias son largas.",
  hotels: [
    {
      name: "The Post Oak Hotel at Uptown Houston",
      type: "Hotel de lujo · Uptown, a 1.6 km de la Galleria",
      priceTier: "$$$$",
      description: "Booking.com: 9.4/10 (196 opiniones) · Precio de referencia: desde US$532 por noche. Torre de 38 pisos con alberca al aire libre, spa, cinco restaurantes y estacionamiento propio. Aparece en la selección de hoteles de la Guía Michelin. Es la opción para quien quiere volver de las compras a un hotel que se siente como parte del viaje.",
      tag: "Lujo completo a minutos de la Galleria",
      affiliateUrl: "https://www.booking.com/hotel/us/the-post-oak.html?ref=lagomplan",
      archetypes: ["Familias"],
    },
    {
      name: "JW Marriott Houston by the Galleria",
      type: "Hotel · Frente a la Galleria",
      priceTier: "$$$",
      description: "Booking.com: 8.5/10 (133 opiniones) · Precio de referencia: desde unos US$200 por noche. Cruzando la calle de la Galleria, con 516 habitaciones, albercas interior y exterior más una alberca en la azotea, y el restaurante de cocina texana Stray Horse. Booking califica su ubicación con 9.3. Con adolescentes que quieren ir y volver solos al centro comercial, es la base más práctica.",
      tag: "La Galleria cruzando la calle",
      affiliateUrl: "https://www.booking.com/hotel/us/jw-marriott-houston.html?ref=lagomplan",
      archetypes: ["Familias"],
    },
    {
      name: "Marriott Marquis Houston",
      type: "Hotel · Centro de Houston",
      priceTier: "$$$",
      description: "Booking.com: 8.5/10 (681 opiniones) · Precio de referencia: desde US$225 por noche. Junto al parque Discovery Green y a una caminata corta del Toyota Center. Su sello es el río lento en la azotea con forma del mapa de Texas, al lado de una alberca infinita. Queda cerca de la ruta del desfile de Thanksgiving. Pregunta si el río lento estará climatizado en tus fechas.",
      tag: "Río lento con forma de Texas en la azotea",
      affiliateUrl: "https://www.booking.com/hotel/us/marriott-marquis-houston.html?ref=lagomplan",
      archetypes: ["Familias"],
    },
  ],
  hotelsDescription: "Dos hoteles junto a la Galleria y uno en el centro, a pasos de los Rockets y del desfile. Calificación de Booking.com; precio de referencia por noche tomado de comparadores en 2026, en dólares. La semana de Thanksgiving suele costar más: confirma la tarifa en el link.",
  experiences: [
    {
      name: "Control de Misión Histórico de la NASA + entrada general",
      description: "GetYourGuide: 4.8/5 (177 reseñas) · Desde US$150. Marcada como mejor calificada en GetYourGuide: entrada general más el recorrido en tranvía al Control de Misión Histórico, la sala desde donde se dirigieron las misiones Apolo. Dura unas ocho horas en grupo pequeño. La disponibilidad del tranvía la define la NASA y puede variar; los boletos llegan por correo o mensaje una hora antes del horario de entrada. Si solo quieren el museo, la entrada general en GetYourGuide cuesta desde US$30 (4.5/5, más de 3,800 reseñas).",
      tags: ["Ciencia", "8 horas", "Grupo pequeño", "Tranvía al Control de Misión"],
      affiliateUrl: "https://www.getyourguide.com/houston-l719/houston-driving-tour-nasa-space-center-tickettransport-t600673/?ref=lagomplan",
    },
    {
      name: "Downtown Aquarium: pase de todo el día",
      description: "GetYourGuide: 4.4/5 (339 reseñas) · Desde US$27 por persona. Acuario en el centro de Houston con la exhibición Aquarium Adventure, Stingray Reef y juegos mecánicos ilimitados, incluido el tren Shark Voyage que atraviesa un túnel con tiburones. Entras a cualquier hora del día y sin fila para el boleto. Buen plan de medio día o alternativa al partido del domingo.",
      tags: ["Acuario", "Medio día", "Juegos ilimitados", "Entrada flexible"],
      affiliateUrl: "https://www.getyourguide.com/houston-l719/houston-downtown-aquarium-all-day-pass-t431145/?ref=lagomplan",
    },
    {
      name: "Escape room de una hora en la Galleria",
      description: "GetYourGuide: 5.0/5 (4 reseñas) · Desde US$43 por persona. Una hora para resolver la misión en uno de cuatro cuartos temáticos: recuperar un cuadro robado, una operación especial, un laboratorio submarino o un viaje en tren por el tiempo. Hasta ocho jugadores, edad sugerida desde 13 años. Está en el nivel inferior de la Galleria, junto a la pista de hielo: encaja en medio del Black Friday.",
      tags: ["Juego en equipo", "1 hora", "Hasta 8 personas", "En la Galleria"],
      affiliateUrl: "https://www.getyourguide.com/houston-l719/escape-rooms-tc357/?ref=lagomplan",
    },
  ],
  experiencesDescription: "Tres experiencias de GetYourGuide para adolescentes. Calificación y precio por persona de GetYourGuide al 23 de octubre de 2026, en dólares.",
  tips: [
    "Haz la lista antes del viernes. El Black Friday premia a quien llega con prioridades. Que cada adolescente lleve su lista y un tope de gasto; el resto se negocia en la comida.",
    "El precio de etiqueta no es el final. En Texas el impuesto de venta se suma al pagar. Considéralo en el presupuesto de cada compra.",
    "Compra boletos de deporte con tiempo. Rockets el miércoles y Texans el domingo coinciden con un fin de semana largo de viaje en Estados Unidos. Compra en canales oficiales y reserva estacionamiento en línea.",
    "Deja espacio en la maleta o lleva una vacía. Revisa la franquicia de compras vigente del SAT antes de regresar a México para no pagar de más en la aduana.",
  ],
  funFact: "El mensaje con el que Neil Armstrong confirmó que el módulo Eagle había alunizado, el 20 de julio de 1969, empezaba con una palabra: Houston. Del otro lado lo escuchaba el control de misión, el mismo cuarto que visitarás en el tour del Día 04.",
  checklist: [
    "Pasaportes y visas vigentes de toda la familia",
    "Licencia de manejo vigente y tarjeta de crédito para rentar auto",
    "Una maleta vacía o plegable para las compras",
    "Chamarra ligera: con un frente frío las noches bajan de 10 °C",
    "Tenis cómodos: la Galleria y Space Center Houston se recorren a pie",
    "Cargador portátil para boletos digitales y mapas",
    "Lista de compras y presupuesto por persona",
  ],
  transport: [
    {
      mode: "Cómo llegar",
      description: "Houston tiene dos aeropuertos: George Bush Intercontinental (IAH), al norte, y William P. Hobby (HOU), al sur. Revisa a cuál llega tu vuelo: cambia el tiempo de traslado a la Galleria o al centro.",
    },
    {
      mode: "Cómo llegar: documentos",
      description: "Pasaporte vigente y visa B1/B2 para cada integrante de la familia.",
    },
    {
      mode: "Moverse",
      description: "Renta un auto. Space Center Houston queda a 45 o 60 minutos del centro, y Galleria, centro, zoológico y estadio están separados entre sí. Si vas al estadio o al desfile, compra estacionamiento con anticipación.",
    },
    {
      mode: "Clima",
      description: "A finales de noviembre la máxima normal en Houston ronda los 21 °C y la mínima los 10 °C. Los frentes fríos pueden bajar las mínimas a menos de 10 °C, y también hay días cálidos cercanos a 28 °C. Lleva capas.",
    },
    {
      mode: "Compras",
      description: "En 2025 la Galleria abrió a las 7:00 en Black Friday y los outlets Houston Premium y Tanger a las 6:00. Los horarios 2026 se publican cerca de la fecha en las páginas de cada centro comercial.",
    },
  ],
  timely: {
    validUntil: "2026-11-30",
    eyebrow: "Esta temporada",
    title: "Semana de Thanksgiving 2026",
    verifiedNote: "Datos verificados el 23 de octubre de 2026. Eventos, horarios y precios valen para la semana de Thanksgiving de 2026.",
    essentialsTitle: "Lo esencial antes de reservar",
    essentials: [
      "Todos necesitan pasaporte y visa estadounidense vigente.",
      "Esta ruta está hecha para la semana de Thanksgiving: desfile el jueves, Black Friday el viernes. Fuera de esa semana funciona igual, sin esos dos días.",
      "El jueves de Thanksgiving muchos restaurantes cierran o solo abren con reservación. Asegura la comida de ese día con tiempo.",
    ],
    whenTitle: "Cuándo ir",
    whenIntro: "La semana de Thanksgiving concentra en seis días el desfile, el Black Friday, la apertura de las luces navideñas y deporte en casa. Este es el calendario de 2026.",
    window: "Ventana sugerida: del miércoles 25 al lunes 30 de noviembre de 2026. Thanksgiving es el jueves 26 y el Black Friday el viernes 27.",
    table: {
      headers: ["Qué pasa", "Fechas 2026", "Qué cambia para tu viaje"],
      rows: [
        {
          what: "Houston Rockets contra Phoenix Suns",
          when: "Miércoles 25 de noviembre, Toyota Center",
          impact: "Primera noche del viaje; confirma el horario al comprar boletos",
          until: "2026-11-25",
        },
        {
          what: "77.º Desfile de Thanksgiving H-E-B",
          when: "Jueves 26 de noviembre, 9:00, centro de Houston",
          impact: "Gratuito; llega temprano por lugar",
          until: "2026-11-26",
        },
        {
          what: "Black Friday",
          when: "Viernes 27 de noviembre",
          impact: "En 2025 la Galleria abrió a las 7:00 y los outlets Houston Premium y Tanger a las 6:00; los horarios 2026 se publican cerca de la fecha",
          until: "2026-11-27",
        },
        {
          what: "Zoo Lights",
          when: "Del 19 de noviembre al 3 de enero, 17:30 a 22:30",
          impact: "Abre también en Thanksgiving; desde 24.95 dólares",
        },
        {
          what: "Galaxy Lights en Space Center Houston",
          when: "Del 14 de noviembre al 3 de enero",
          impact: "Se combina con el día de la NASA",
        },
        {
          what: "El Cascanueces, Houston Ballet",
          when: "Del 27 de noviembre al 28 de diciembre",
          impact: "Estreno de temporada el viernes de Black Friday",
        },
        {
          what: "Houston Texans contra Baltimore Ravens",
          when: "Domingo 29 de noviembre, 12:00, NRG Park",
          impact: "Compra boletos y estacionamiento con anticipación",
          until: "2026-11-29",
        },
        {
          what: "Calendario SEP",
          when: "Viernes 27 sin clases (Consejo Técnico); 25, 26 y 30 con clases",
          impact: "Alternativa sin faltar a clases: el puente del 13 al 16 de noviembre, sin desfile ni Black Friday",
        },
      ],
    },
    booking: {
      label: "Reserva con las fechas sugeridas:",
      links: [
        {
          name: "The Post Oak Hotel",
          url: "https://www.booking.com/hotel/us/the-post-oak.html?checkin=2026-11-25&checkout=2026-11-30&ref=lagomplan",
        },
        {
          name: "JW Marriott by the Galleria",
          url: "https://www.booking.com/hotel/us/jw-marriott-houston.html?checkin=2026-11-25&checkout=2026-11-30&ref=lagomplan",
        },
        {
          name: "Marriott Marquis Houston",
          url: "https://www.booking.com/hotel/us/marriott-marquis-houston.html?checkin=2026-11-25&checkout=2026-11-30&ref=lagomplan",
        },
      ],
    },
  },
}
