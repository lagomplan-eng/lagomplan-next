import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: "punta-cana",
  locale: "es",
  hero: {
    title: "Punta Cana en grupo familiar",
    subtitle: "Los abuelos en la palapa, los primos en el parque acuático, los papás en la alberca con bar, y a la hora de la cena todos en la misma mesa larga. Punta Cana funciona para familias grandes porque el resort resuelve casi todo y las excursiones salen de la puerta del hotel. Esta guía arma una semana con tres salidas y suficiente tiempo libre para que cada generación tenga su día.",
    eyebrow: "Guía curada · Grupo familiar grande · Playa y todo incluido · 7 días · Presupuesto medio-alto",
    tags: ["Familia multigeneracional", "Playa", "Todo incluido", "Una semana"],
    image: "/images/guides/punta-cana.png",
  },
  itinerary: [
    {
      day: 1,
      title: "Llegada",
      items: [
        {
          time: "Mañana",
          title: "Vuelo directo desde la CDMX, de unas cuatro horas y tres cuartos",
          description: "El de Aeroméxico sale temprano y aterriza a media tarde, hora local.",
          tags: [],
        },
        {
          time: "Tarde",
          title: "Traslado privado en van al hotel (unos 16 km desde el aeropuerto hasta Bávaro) y check-in",
          description: "",
          tags: [],
        },
        {
          time: "Noche",
          title: "Cena de bienvenida en un restaurante a la carta del resort, reservada desde la llegada para todo el grupo",
          description: "",
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: "Playa Bávaro",
      items: [
        {
          time: "Todo el día",
          title: "Playa, alberca, parque acuático y club infantil",
          description: "Que cada generación encuentre su rincón.",
          tags: [],
        },
        {
          time: "Atardecer",
          title: "En la playa, con foto de grupo",
          description: "",
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: "Isla Saona",
      items: [
        {
          time: "Muy temprano",
          title: "Excursión a Isla Saona en lancha rápida y catamarán con recogida en el hotel",
          description: "Salida por Bayahibe, parada en la piscina natural de estrellas de mar y comida en la isla.",
          tags: [],
        },
        {
          time: "Noche",
          title: "Regreso y cena libre",
          description: "",
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: "Descanso",
      items: [
        {
          time: "Mañana",
          title: "Spa para los adultos, club infantil o de adolescentes para los chicos",
          description: "",
          tags: [],
        },
        {
          time: "Tarde",
          title: "Alberca y siesta",
          description: "",
          tags: [],
        },
        {
          time: "Noche",
          title: "Espectáculo del resort",
          description: "",
          tags: [],
        },
      ],
    },
    {
      day: 5,
      title: "Scape Park y Hoyo Azul",
      items: [
        {
          time: "Mañana",
          title: "Hoyo Azul y Scape Park en Cap Cana: traslado en autobús con aire acondicionado, el cenote de agua azul, tirolesas, cuevas y senderos en un parque ecológico de 100 hectáreas",
          description: "",
          tags: [],
        },
        {
          time: "Tarde",
          title: "Regreso al hotel",
          description: "",
          tags: [],
        },
      ],
    },
    {
      day: 6,
      title: "Aventura o playa, a elegir",
      items: [
        {
          time: "Mañana",
          title: "El grupo se divide: los aventureros van al Bávaro Adventure Park (buggies, tirolesa y laguna azul, comida incluida); los demás, día de playa",
          description: "",
          tags: [],
        },
        {
          time: "Noche",
          title: "Cena de despedida en el restaurante favorito de la semana",
          description: "",
          tags: [],
        },
      ],
    },
    {
      day: 7,
      title: "Regreso",
      items: [
        {
          time: "Mañana",
          title: "Último chapuzón y check-out",
          description: "",
          tags: [],
        },
        {
          time: "Mediodía",
          title: "Traslado al aeropuerto con tres horas de margen",
          description: "El vuelo directo de Aeroméxico de regreso sale por la tarde y llega a la CDMX en la noche.",
          tags: [],
        },
      ],
    },
  ],
  itineraryDescription: "Seis noches en un todo incluido de Playa Bávaro. Tres excursiones de día completo separadas por días libres para que los abuelos y los más chicos descansen.",
  hotels: [
    {
      name: "Barceló Bávaro Palace All Inclusive",
      type: "Todo incluido · Playa Bávaro",
      priceTier: "$$$",
      description: "Booking.com: 8.0/10 (1,258 opiniones) · Precio de referencia: US$145 a 245 por noche. Un resort enorme sobre la playa, con 1,402 habitaciones, cuatro albercas, alberca infantil, club infantil sin costo, campo de golf y parque acuático con cargo extra. Está conectado a un centro comercial y al centro de convenciones Barceló. Booking califica su ubicación con 9.0. Para grupos grandes, el tamaño juega a favor: hay espacio y opciones para todos.",
      tag: "Para que nadie se aburra en una semana",
      affiliateUrl: "https://www.booking.com/hotel/do/barcelo-bavaro-palace-deluxe.html?ref=lagomplan",
      archetypes: ["Familias"],
    },
    {
      name: "Iberostar Selection Bávaro Suites",
      type: "Todo incluido · Playa Bávaro",
      priceTier: "$$$",
      description: "Booking.com: 8.3/10 (264 opiniones) · Precio de referencia: US$195 a 310 por noche. 448 suites frente a la playa, siete restaurantes, juegos infantiles, habitaciones familiares y traslado al aeropuerto. Una guía especializada en todo incluido destaca su Family Junior Suite entre las mejores habitaciones familiares de la zona. Booking califica su ubicación con 9.2.",
      tag: "Suites amplias para repartir al grupo",
      affiliateUrl: "https://www.booking.com/hotel/do/iberostar-bavaro-suites.html?ref=lagomplan",
      archetypes: ["Familias"],
    },
    {
      name: "Lopesan Costa Bávaro Resort, Spa & Casino",
      type: "Todo incluido · Playa Bávaro",
      priceTier: "$$$$",
      description: "Booking.com: 7.9/10 (963 opiniones) · Precio de referencia: desde unos US$430 por noche. El más completo para un grupo con edades muy distintas: diez restaurantes, seis albercas, parque acuático sin costo, club infantil y club de adolescentes, boliche, spa, casino y una zona solo para adultos. Tiene junior suites con acceso directo a la alberca y suites de dos recámaras.",
      tag: "Club de adolescentes y zona solo adultos en el mismo resort",
      affiliateUrl: "https://www.booking.com/hotel/do/lopesan-costa-bavaro-resort-spa-amp-casino.html?ref=lagomplan",
      archetypes: ["Familias"],
    },
  ],
  hotelsDescription: "Tres todo incluido sobre Playa Bávaro, pensados para grupos con varias generaciones. Calificación de Booking.com; precio de referencia por noche de comparadores en 2026, en dólares, para habitación doble. Para grupos grandes pide cotización por bloque de habitaciones directo al hotel y compárala con la de Booking.",
  experiences: [
    {
      name: "Isla Saona en lancha rápida y catamarán",
      description: "GetYourGuide: 4.3/5 (36 reseñas) · Desde US$70 por persona. Día completo desde Punta Cana hasta Bayahibe, donde se aborda la lancha o el catamarán hacia la Isla Saona, dentro del Parque Nacional del Este. Incluye una parada en la piscina natural de estrellas de mar, playa de arena blanca y animación a bordo. La excursión sale con lluvia o sol. Para grupos de diez o más, GetYourGuide también ofrece catamaranes privados a Saona.",
      tags: ["Isla", "Día completo", "Recogida en hotel", "Lancha y catamarán"],
      affiliateUrl: "https://www.getyourguide.com/punta-cana-l411/punta-cana-saona-island-tour-speedboat-and-catamaran-t471626/?ref=lagomplan",
    },
    {
      name: "Hoyo Azul y Scape Park en Cap Cana",
      description: "GetYourGuide: 4.4/5 (176 reseñas) · Desde US$129 por persona. Traslado en autobús con aire acondicionado hasta Scape Park, un parque ecológico de 100 hectáreas dentro de Cap Cana. El protagonista es el Hoyo Azul, un cenote de agua turquesa; alrededor hay tirolesas, cuevas, ruta cultural y un pequeño rancho de animales. Funciona para todas las edades: cada quien elige su nivel de aventura.",
      tags: ["Naturaleza", "Día completo", "Transporte incluido", "Para todas las edades"],
      affiliateUrl: "https://www.getyourguide.com/punta-cana-l411/punta-cana-hoyo-azul-and-scape-park-cap-cana-full-day-trip-t50328/?ref=lagomplan",
    },
    {
      name: "Bávaro Adventure Park con acceso total y comida",
      description: "GetYourGuide: 4.4/5 (105 reseñas) · Desde US$169 por persona. Seis horas en un parque de aventura con buggies, tirolesa y una laguna azul para nadar, con comida y recogida en el hotel incluidas. Guías en español, inglés y francés. Ideal para la parte del grupo que quiere adrenalina mientras el resto se queda en la playa. Puedes reservar ahora y pagar después.",
      tags: ["Aventura", "6 horas", "Comida incluida", "Guía en español"],
      affiliateUrl: "https://www.getyourguide.com/punta-cana-l411/full-access-to-bavaro-adventure-park-t468196/?ref=lagomplan",
    },
  ],
  experiencesDescription: "Tres excursiones de día completo de GetYourGuide con recogida en el hotel. Calificación y precio por persona de GetYourGuide al 23 de octubre de 2026, en dólares.",
  tips: [
    "Un solo e-Ticket por familia. El formulario de entrada lo puede llenar una persona para hasta siete familiares. Repartan la tarea por núcleo familiar y guarden los códigos QR en el celular antes de ir al aeropuerto.",
    "Reserva las cenas a la carta el primer día. En los todo incluido, las mesas grandes se llenan rápido. Pide en recepción reservar todas las noches especiales del grupo al hacer check-in.",
    "No todos tienen que ir a todo. Las excursiones son de día completo. Divide al grupo según energía y edades, y junta a todos en la cena.",
    "Contrata traslado privado. Con diez o más personas y maletas, una van privada desde el aeropuerto mantiene al grupo junto y evita coordinar varios taxis. Compara el precio por persona.",
  ],
  funFact: "En el primer semestre de 2026, el Aeropuerto Internacional de Punta Cana registró 6.38 millones de entradas y salidas de pasajeros internacionales, 19.3% más que en el mismo periodo de 2025. Es la principal puerta de entrada al país.",
  checklist: [
    "Pasaportes con al menos seis meses de vigencia para cada integrante",
    "Códigos QR del e-Ticket de entrada y de salida",
    "Seguro de viaje con cobertura médica y por cancelación",
    "Bloqueador biodegradable, sombreros y rashguards",
    "Zapatos de agua para la piscina natural de Saona y el cenote",
    "Dólares en billetes chicos para propinas",
    "Ropa casual elegante para las cenas a la carta",
    "Lista del grupo con habitaciones y teléfonos",
  ],
  transport: [
    {
      mode: "Cómo llegar: desde la CDMX",
      description: "Aeroméxico vuela directo todos los días desde el AICM; el vuelo dura cerca de 4 horas 45 minutos. Arajet vuela directo desde el AIFA siete veces por semana.",
    },
    {
      mode: "Cómo llegar: desde Cancún",
      description: "Arajet tiene vuelos directos de unas tres horas, útil si parte del grupo sale del sureste.",
    },
    {
      mode: "Requisitos de entrada",
      description: "Sin visa para turistas mexicanos. Pasaporte con al menos seis meses de vigencia y e-Ticket gratuito de entrada y salida en el portal oficial de Migración (eticket.migracion.gob.do). Migración puede pedir boleto de regreso y datos del hotel.",
    },
    {
      mode: "Moverse",
      description: "El aeropuerto queda a unos 16 km de la zona de Bávaro. Las excursiones recomendadas incluyen recogida en el hotel, así que no hace falta rentar auto.",
    },
    {
      mode: "Clima",
      description: "En noviembre las temperaturas van de 24 a 29 °C, el mar está cerca de 28 °C y hay unas ocho horas de sol al día. Los chubascos suelen ser breves y pasan rápido. La temporada de huracanes del Atlántico cierra el 30 de noviembre.",
    },
  ],
  timely: {
    validUntil: "2027-04-30",
    eyebrow: "Esta temporada",
    title: "Noviembre 2026 – abril 2027",
    verifiedNote: "Datos verificados el 23 de octubre de 2026. Requisitos, precios y avisos valen para la temporada de noviembre de 2026 a abril de 2027.",
    essentialsTitle: "Lo esencial antes de reservar",
    essentials: [
      "Los mexicanos no necesitan visa como turistas. Basta pasaporte con al menos seis meses de vigencia y el e-Ticket, un formulario gratuito de entrada y salida. Una sola persona puede llenarlo para hasta siete familiares.",
      "Aeroméxico vuela directo diario de la CDMX a Punta Cana, en unas cuatro horas y tres cuartos; Arajet vuela directo desde el AIFA.",
      "Con un grupo grande, contrata seguro de viaje con cobertura médica y por cancelación para todos.",
    ],
    whenTitle: "Cuándo ir",
    whenIntro: "La ruta funciona en cualquier semana del año. Lo que cambia según la fecha está aquí.",
    window: "Ventana sugerida: del sábado 14 al viernes 20 de noviembre 2026. El lunes 16 no hay clases en escuelas SEP; el resto de la semana sí.",
    table: {
      headers: ["Qué pasa", "Fechas", "Qué cambia para tu viaje"],
      rows: [
        {
          what: "Temporada de huracanes del Atlántico",
          when: "Del 1 de junio al 30 de noviembre",
          impact: "Contrata seguro con cobertura por cancelación y revisa el pronóstico la semana del viaje",
          until: "2026-11-30",
        },
        {
          what: "Clima de noviembre",
          when: "Todo el mes",
          impact: "De 24 a 29 °C, mar cerca de 28 °C y unas ocho horas de sol al día; chubascos breves",
          until: "2026-11-30",
        },
        {
          what: "Semana Santa",
          when: "Marzo o abril, según el año",
          impact: "Se suspenden los deportes acuáticos en todo el país: evita esas fechas si quieren Saona o catamarán",
        },
      ],
    },
    booking: {
      label: "Reserva con las fechas sugeridas:",
      links: [
        {
          name: "Barceló Bávaro Palace",
          url: "https://www.booking.com/hotel/do/barcelo-bavaro-palace-deluxe.html?checkin=2026-11-14&checkout=2026-11-20&ref=lagomplan",
        },
        {
          name: "Iberostar Selection Bávaro Suites",
          url: "https://www.booking.com/hotel/do/iberostar-bavaro-suites.html?checkin=2026-11-14&checkout=2026-11-20&ref=lagomplan",
        },
        {
          name: "Lopesan Costa Bávaro",
          url: "https://www.booking.com/hotel/do/lopesan-costa-bavaro-resort-spa-amp-casino.html?checkin=2026-11-14&checkout=2026-11-20&ref=lagomplan",
        },
      ],
    },
  },
}
