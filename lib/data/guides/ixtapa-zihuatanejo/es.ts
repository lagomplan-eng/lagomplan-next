import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: "ixtapa-zihuatanejo",
  locale: "es",
  hero: {
    title: "Ixtapa-Zihuatanejo en familia",
    subtitle: "Una tortuga golfina del tamaño de una galleta camina hacia el mar y tu hijo la sigue con la mirada hasta que la ola se la lleva. Ixtapa y Zihuatanejo comparten aeropuerto y bahía, pero son dos ritmos: el bulevar de hoteles con alberca y club infantil, y el puerto pescador con su malecón. Esta guía alterna un día de aventura con uno de descanso para que nadie llegue agotado a la cena.",
    eyebrow: "Guía curada · Familia con niños pequeños · Playa · 5 días · Presupuesto medio",
    tags: ["Familia", "Playa", "Naturaleza", "Fin de semana largo"],
    image: "/images/guides/ixtapa-zihuatanejo.png",
  },
  itinerary: [
    {
      day: 1,
      title: "Llegada y primera alberca",
      items: [
        {
          time: "Mediodía",
          title: "Vuelo directo desde la CDMX, de poco más de una hora",
          description: "El aeropuerto queda a unos 20 minutos de Ixtapa.",
          tags: [],
        },
        {
          time: "Primera tarde",
          title: "Check-in, comida en el hotel y alberca infantil",
          description: "",
          tags: [],
        },
        {
          time: "Atardecer",
          title: "Playa El Palmar",
          description: "Si hay bandera roja, se mira desde la arena.",
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: "Liberación de tortugas",
      items: [
        {
          time: "Temprano",
          title: "Desayuno",
          description: "",
          tags: [],
        },
        {
          time: "Mañana o tarde, según el horario del campamento",
          title: "Tour de liberación de tortugas: cuatro horas con recogida en el hotel, a un campamento a 40 minutos donde ayudan a liberar crías de tortuga golfina",
          description: "Incluye refrigerio, bebida y comida.",
          tags: [],
        },
        {
          time: "Resto del día",
          title: "Hotel, club infantil y alberca",
          description: "",
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: "Tirolesa y Zihuatanejo",
      items: [
        {
          time: "Mañana",
          title: "Tirolesas en Ixtapa-Zihuatanejo, dos horas y media en un parque ecológico, con transporte desde la zona hotelera",
          description: "Con niños muy pequeños, cámbiala por un paseo en bici por la ciclopista de Ixtapa.",
          tags: [],
        },
        {
          time: "Mediodía",
          title: "Comida y siesta",
          description: "",
          tags: [],
        },
        {
          time: "Tarde",
          title: "Zihuatanejo: paseo por el Paseo del Pescador frente a Playa Principal, helado y cena en el centro",
          description: "",
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: "Campo, cocos y Barra de Potosí",
      items: [
        {
          time: "Mañana",
          title: "Tour por el campo de Ixtapa-Zihuatanejo: cinco horas con dos familias locales, una huerta de cocos donde se pela y se prueba la fruta, un taller de ladrillos y tejas, y comida de mariscos frente al mar en Barra de Potosí",
          description: "Paseo opcional en lancha por la laguna.",
          tags: [],
        },
        {
          time: "Tarde",
          title: "Regreso al hotel y tiempo libre",
          description: "",
          tags: [],
        },
        {
          time: "Alternativa",
          title: "Si las lanchas operan con normalidad, la Isla de Ixtapa es el plan clásico: aguas tranquilas para que los niños naden, a unos diez minutos en lancha desde Playa Linda",
          description: "Confírmalo en el hotel ese mismo día.",
          tags: [],
        },
      ],
    },
    {
      day: 5,
      title: "Último chapuzón y regreso",
      items: [
        {
          time: "Mañana",
          title: "Desayuno y última mañana de playa o alberca",
          description: "",
          tags: [],
        },
        {
          time: "Mediodía",
          title: "Check-out",
          description: "La mayoría de los hoteles guardan maletas.",
          tags: [],
        },
        {
          time: "Primera tarde",
          title: "Salida al aeropuerto, a unos 20 minutos",
          description: "",
          tags: [],
        },
      ],
    },
  ],
  itineraryDescription: "Cuatro noches en Ixtapa, frente a Playa El Palmar. Tres salidas cortas con recogida en el hotel y tardes de alberca para la siesta.",
  hotels: [
    {
      id: 'holiday-inn-resort-ixtapa-all-inclusive',
      name: "Holiday Inn Resort Ixtapa All-Inclusive",
      type: "Todo incluido · Playa El Palmar",
      priceTier: "$$",
      description: "Booking.com: 8.4/10 (2,111 opiniones) · Precio de referencia: US$200 a 260 por noche, todo incluido. El clásico familiar de Ixtapa: 431 habitaciones, dos albercas, alberca infantil y club de niños sin costo. Queda frente a la zona comercial, con restaurantes y mercado de artesanías cruzando el bulevar. Booking califica su ubicación con 9.2.",
      tag: "Club infantil gratis y todo resuelto sin salir del hotel",
      affiliateUrl: "https://www.booking.com/hotel/mx/holiday-inn-extapa-resort.html?ref=lagomplan",
      archetypes: ["Familias"],
    },
    {
      id: 'barcelo-ixtapa-all-inclusive',
      name: "Barceló Ixtapa All Inclusive",
      type: "Todo incluido · Playa El Palmar",
      priceTier: "$$",
      description: "Booking.com: 8.2/10 (393 opiniones) · Precio de referencia: US$175 a 240 por noche, todo incluido. 351 habitaciones y 47 villas, siete restaurantes, tres albercas y club infantil supervisado. Tiene más variedad de restaurantes a la carta que el Holiday Inn, útil si los papás quieren una cena distinta mientras los niños comen temprano.",
      tag: "Más restaurantes para cinco días de todo incluido",
      affiliateUrl: "https://www.booking.com/hotel/mx/barcelo-ixtapa-beach.html?ref=lagomplan",
      archetypes: ["Familias"],
    },
    {
      id: 'emporio-ixtapa',
      name: "Emporio Ixtapa",
      type: "Hotel con todo incluido opcional · Playa El Palmar",
      priceTier: "$",
      description: "Booking.com: 8.4/10 (1,293 opiniones) · Precio de referencia: desde unos US$90 por noche solo habitación. 219 habitaciones sobre playa privada, alberca infantil, spa y actividades para niños y adultos como bici, tenis y voleibol. Puedes reservar solo habitación y comer en Ixtapa o Zihuatanejo, o añadir el todo incluido. La opción con más margen para el presupuesto.",
      tag: "Flexibilidad: con o sin plan todo incluido",
      affiliateUrl: "https://www.booking.com/hotel/mx/emporio-ixtapa.html?ref=lagomplan",
      archetypes: ["Familias"],
    },
  ],
  hotelsDescription: "Tres hoteles frente a Playa El Palmar, a pocos metros entre sí. Calificación de Booking.com; precio de referencia por noche para dos adultos tomado de comparadores en 2026, en dólares. Con niños el total cambia según edades: confírmalo en el link.",
  experiences: [
    {
      id: 'liberacion-de-tortugas-en-ixtapa-zihuatanejo',
      name: "Liberación de tortugas en Ixtapa-Zihuatanejo",
      description: "GetYourGuide: 5.0/5 (4 reseñas) · Desde US$71 por persona. Cuatro horas en un campamento tortuguero a 40 minutos de Ixtapa. Los guías explican cómo se protege a la tortuga golfina, el proceso de los nidos, y los niños ayudan a liberar crías. Incluye transporte, refrigerio, bebida y comida. El guía habla inglés y francés; pregunta por español al reservar.",
      tags: ["Naturaleza", "4 horas", "Recogida en hotel", "Comida incluida"],
      category: 'naturaleza',
      duration: 'corto',
      affiliateUrl: 'https://www.getyourguide.com/zihuatanejo-l392/ixtapa-zihuatanejo-turtle-release-tour-t819389/',
    },
    {
      id: 'tirolesas-en-ixtapa-zihuatanejo',
      name: "Tirolesas en Ixtapa-Zihuatanejo",
      description: "GetYourGuide: 4.5/5 (3 reseñas) · Desde US$68 por persona. Dos horas y media en un parque ecológico en la selva, con tirolesas, escaleras, puentes colgantes y obstáculos móviles. Incluye arnés, guías bilingües y transporte desde las zonas hoteleras de Ixtapa y Zihuatanejo. Pide zapato cerrado. Confirma la edad y estatura mínimas antes de reservar para los más chicos.",
      tags: ["Aventura", "2.5 horas", "Grupo pequeño", "Transporte incluido"],
      category: 'aventura',
      duration: 'corto',
      affiliateUrl: 'https://www.getyourguide.com/zihuatanejo-l392/ixtapa-zihuatanejo-excursion-en-tirolesa-t657047/',
    },
    {
      id: 'tour-por-el-campo-y-barra-de-potosi',
      name: "Tour por el campo y Barra de Potosí",
      description: "GetYourGuide: 5.0/5 (1 reseña) · Desde US$103 por persona. Cinco horas con guía en español o inglés para conocer cómo se vive y se trabaja fuera de la zona hotelera: una huerta de cocos con degustación, un taller familiar de ladrillos y tejas, y comida de mariscos frente a la playa en el pueblo pesquero de Barra de Potosí. El paseo en lancha por la laguna es opcional y se paga aparte. También se puede tomar sin comida.",
      tags: ["Cultura local", "5 horas", "Transporte con aire acondicionado", "Comida incluida"],
      category: 'excursion',
      duration: 'medio',
      affiliateUrl: 'https://www.getyourguide.com/zihuatanejo-l392/zihuatanejo-ixtapa-countryside-tour-t658438/',
    },
  ],
  experiencesDescription: "Tres salidas de GetYourGuide con recogida en el hotel. Calificación y precio por persona de GetYourGuide al 23 de octubre de 2026, en dólares. Son operadores locales pequeños, con pocas reseñas todavía.",
  tips: [
    "Mira el mar antes que el clima. Con el huracán Trudy, Protección Civil pidió a los bañistas no entrar al mar por el oleaje. Respeta las banderas y deja que los más pequeños naden en la alberca cuando haya bandera roja.",
    "Una salida por día, siempre en la mañana. El sol de mediodía pega fuerte y las salidas duran de dos y media a cinco horas. Regresar a comer y dormir siesta en el hotel salva la tarde.",
    "Pregunta por el idioma del guía. Varios operadores ofrecen inglés por defecto. Si tus hijos son pequeños, pide guía en español al reservar.",
    "Las tortugas mandan. La liberación depende de que haya crías listas ese día. Si el campamento cambia horario, ajusta el resto del día alrededor.",
  ],
  funFact: "Zihuatanejo es el lugar con el que sueña Andy Dufresne en Sueños de fuga (1994): el pueblo del Pacífico mexicano donde planea vivir junto al mar cuando salga de prisión.",
  checklist: [
    "Bloqueador biodegradable y rashguards con manga larga para los niños",
    "Sombreros y lentes de sol",
    "Zapatos cerrados para la tirolesa y sandalias de agua para la playa",
    "Flotadores o chalecos para niños que aún no nadan",
    "Repelente de mosquitos para la laguna y las tardes",
    "Efectivo en billetes chicos para lanchas, propinas y antojos en Zihuatanejo",
    "Una muda seca en la mochila para cada salida",
  ],
  transport: [
    {
      mode: "Cómo llegar: avión (recomendado)",
      description: "Aeroméxico y Volaris vuelan directo de la Ciudad de México al Aeropuerto Internacional de Ixtapa-Zihuatanejo (ZIH); el vuelo dura poco más de una hora. Del aeropuerto, Zihuatanejo queda a unos 10 minutos y la zona hotelera de Ixtapa a unos 20, en taxi o con el traslado del hotel.",
    },
    {
      mode: "Cómo llegar: carretera",
      description: "No la recomendamos para esta guía: el Reino Unido exceptúa de su alerta para Guerrero solo a Zihuatanejo e Ixtapa por vía aérea.",
    },
    {
      mode: "Moverse",
      description: "Taxi entre Ixtapa y Zihuatanejo o los traslados incluidos en los tours. Dentro de la zona hotelera, la ciclopista de unos 10 kilómetros sirve para pasear en bici.",
    },
    {
      mode: "Clima",
      description: "A mediados de noviembre el día ronda los 31 a 33 °C y la noche los 25 a 27 °C, con el mar cerca de 30 °C. Noviembre es transición entre la temporada de lluvias y la seca: puede caer algún aguacero breve por la tarde. La temporada de huracanes del Pacífico cierra el 30 de noviembre.",
    },
  ],
  timely: {
    validUntil: "2027-03-31",
    eyebrow: "Esta temporada",
    title: "Temporada noviembre 2026 – marzo 2027",
    verifiedNote: "Datos verificados el 23 de octubre de 2026. Precios, horarios y avisos valen para la temporada de noviembre 2026 a marzo 2027.",
    essentialsTitle: "Lo esencial antes de reservar",
    essentials: [
      "Llega en avión. El Reino Unido desaconseja los viajes no esenciales a Guerrero, salvo a Zihuatanejo e Ixtapa por vía aérea.",
      "Los paseos en lancha dependen del oleaje. Confírmalos con tu hotel el día anterior.",
      "Para niños pequeños, las playas de aguas más tranquilas son Playa Quieta, Playa Linda, La Ropa y Las Gatas. El Palmar, frente a los hoteles, suele tener más ola.",
    ],
    whenTitle: "Cuándo ir",
    whenIntro: "La ruta funciona en cualquier puente de noviembre a marzo, fuera de la temporada de lluvias. Lo que cambia según la fecha está aquí.",
    window: "Ventana sugerida: del jueves 12 al lunes 16 de noviembre de 2026. El lunes 16 no hay clases en escuelas SEP.",
    table: {
      headers: ["Qué pasa", "Fechas", "Qué cambia para tu viaje"],
      rows: [
        {
          what: "Daños por los huracanes Polo, Rachel, Simón y Trudy",
          when: "Septiembre y octubre de 2026",
          impact: "El oleaje dañó los muelles de Playa Linda y Las Gatas y los 17 restaurantes de la Isla de Ixtapa, que estuvieron 23 días cerrados. Confirma qué lanchas operan antes de planear la isla",
        },
        {
          what: "Temporada de huracanes del Pacífico",
          when: "Hasta el 30 de noviembre",
          impact: "Revisa el pronóstico del Servicio Meteorológico Nacional la semana del viaje",
          until: "2026-11-30",
        },
        {
          what: "Liberación de tortugas",
          when: "De agosto a marzo, según los nidos",
          impact: "Confirma con el campamento el día anterior",
        },
        {
          what: "Temporada alta",
          when: "De diciembre a marzo",
          impact: "Más demanda en hoteles y tours: reserva con más anticipación",
        },
      ],
    },
    booking: {
      label: "Reserva con las fechas sugeridas:",
      links: [
        {
          name: "Holiday Inn Resort Ixtapa",
          url: "https://www.booking.com/hotel/mx/holiday-inn-extapa-resort.html?checkin=2026-11-12&checkout=2026-11-16&ref=lagomplan",
        },
        {
          name: "Barceló Ixtapa",
          url: "https://www.booking.com/hotel/mx/barcelo-ixtapa-beach.html?checkin=2026-11-12&checkout=2026-11-16&ref=lagomplan",
        },
        {
          name: "Emporio Ixtapa",
          url: "https://www.booking.com/hotel/mx/emporio-ixtapa.html?checkin=2026-11-12&checkout=2026-11-16&ref=lagomplan",
        },
      ],
    },
  },
}
