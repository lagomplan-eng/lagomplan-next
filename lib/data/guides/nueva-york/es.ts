import type { FlatGuide } from '../types'

export const guide: FlatGuide = {
  slug: "nueva-york",
  locale: "es",
  hero: {
    title: "Nueva York en pareja",
    subtitle: "Un bagel tibio en Bleecker Street a media mañana, tacos y pasteles de nata en Chelsea Market al mediodía, una cena de estrella Michelin en SoHo. En noviembre el Winter Village de Bryant Park ya tiene su pista de hielo abierta y las mesas que importan se reservan con semanas. Esta guía arma cuatro días para comer bien, caminar mucho y dormir en barrios donde todo queda cerca.",
    eyebrow: "Guía curada · Pareja · Gastronomía · Fin de semana largo · 4 días · Presupuesto alto",
    tags: ["Pareja", "Gastronomía", "Ciudad", "Fin de semana largo"],
    image: "/images/guides/nueva-york.png",
  },
  itinerary: [
    {
      day: 1,
      title: "Llegada y Greenwich Village",
      items: [
        {
          time: "Mediodía",
          title: "Llegada a Manhattan",
          description: "Desde JFK, el AirTrain más metro es la opción más barata; con maletas, un taxi o auto con chofer ahorra el transbordo.",
          tags: [],
        },
        {
          time: "Primera tarde",
          title: "Check-in y paseo corto por SoHo",
          description: "",
          tags: [],
        },
        {
          time: "Media tarde",
          title: "Tour de comida por Greenwich Village: bagel con queso crema, pizza neoyorquina, cupcakes, donas gourmet y un platillo sorpresa",
          description: "Tres horas que sirven de cena ligera.",
          tags: [],
        },
        {
          time: "Noche",
          title: "Copa en el barrio y descanso",
          description: "La cena fuerte va mañana.",
          tags: [],
        },
      ],
    },
    {
      day: 2,
      title: "Chelsea Market, High Line y Bryant Park",
      items: [
        {
          time: "Mañana",
          title: "Tour de comida por Chelsea Market, Meatpacking y High Line",
          description: "Sale de Buddakan, 75 Ninth Avenue, y pasa por Market 57 antes de subir a la High Line. Grupo de máximo 10 personas; incluye un almuerzo completo.",
          tags: [],
        },
        {
          time: "Primera tarde",
          title: "Regreso al hotel o compras en el Meatpacking",
          description: "",
          tags: [],
        },
        {
          time: "Al atardecer",
          title: "Winter Village de Bryant Park, si viajas en temporada (fechas en Cuándo ir): más de 180 puestos navideños, pista de hielo con entrada libre y The Lodge, bar y área de comida",
          description: "También hay iglús privados con reservación.",
          tags: [],
        },
        {
          time: "Noche",
          title: "Cena de estrella Michelin",
          description: "Opciones de la lista vigente: Le Coucou (SoHo), Torrisi (Nolita) o Crown Shy (Distrito Financiero).",
          tags: [],
        },
      ],
    },
    {
      day: 3,
      title: "Brunch en el río y una cena nueva",
      items: [
        {
          time: "Mediodía",
          title: "Brunch a bordo del Bateaux New York, barco de cristal que sale de Chelsea Piers",
          description: "Brunch con mimosas ilimitadas y vistas al Empire State, al puente de Brooklyn y a la Estatua de la Libertad.",
          tags: [],
        },
        {
          time: "Tarde",
          title: "Tiempo libre: West Village a pie o descanso en el spa del hotel",
          description: "",
          tags: [],
        },
        {
          time: "Noche",
          title: "Cena en uno de los restaurantes que la Guía Michelin sumó a Nueva York en 2026: Le Chêne (cocina parisina, Greenwich Village), Elcielo (menú de degustación colombiano, NoMad), Cove (cocina californiana de Flynn McGarry, Hudson Square) o Hwaro (barra de 22 lugares, Midtown West)",
          description: "",
          tags: [],
        },
      ],
    },
    {
      day: 4,
      title: "Último desayuno y regreso",
      items: [
        {
          time: "Mañana",
          title: "Desayuno sin prisa y última vuelta por el barrio",
          description: "",
          tags: [],
        },
        {
          time: "Mediodía",
          title: "Check-out",
          description: "Deja las maletas en el hotel si tu vuelo es de tarde.",
          tags: [],
        },
        {
          time: "Tarde",
          title: "Salida al aeropuerto con al menos tres horas de margen para vuelo internacional",
          description: "",
          tags: [],
        },
      ],
    },
  ],
  itineraryDescription: "Tres noches en Manhattan, con base en SoHo, Tribeca o NoMad. Dos tours de comida, un crucero con brunch y tres cenas para reservar desde ya.",
  hotels: [
    {
      name: "Crosby Street Hotel",
      type: "Hotel boutique · SoHo",
      priceTier: "$$$$",
      description: "Booking.com: 9.5/10 (156 opiniones) · Precio promedio: cerca de US$1,770 por noche. En una calle empedrada de SoHo, a una cuadra del metro de Spring Street. Habitaciones con techos altos y ventanales, patio interior, salón con chimenea y un cine privado que proyecta películas los domingos. Su té de la tarde es de lo más comentado por los huéspedes. Booking califica su ubicación con 9.8.",
      tag: "SoHo a la puerta y té de la tarde en casa",
      affiliateUrl: "https://www.booking.com/hotel/us/crosby-street.html?ref=lagomplan",
      archetypes: ["Parejas"],
    },
    {
      name: "The Greenwich Hotel",
      type: "Hotel boutique · Tribeca",
      priceTier: "$$$$",
      description: "Booking.com: 9.1/10 (62 opiniones) · Precio de referencia: desde US$1,675 por noche. El hotel de Robert De Niro en Tribeca, con una Llave Michelin. Tiene 88 habitaciones distintas entre sí, el Shibui Spa con alberca y, junto al lobby, Locanda Verde, la trattoria del barrio. Tribeca es tranquilo y residencial: buena base para descansar entre comidas largas.",
      tag: "Spa con alberca y trattoria en la planta baja",
      affiliateUrl: "https://www.booking.com/hotel/us/the-greenwich.html?ref=lagomplan",
      archetypes: ["Parejas"],
    },
    {
      name: "The Ned NoMad",
      type: "Hotel · NoMad",
      priceTier: "$$$",
      description: "Booking.com: 8.1/10 (56 opiniones) · Precio de referencia: US$400 a 760 por noche. Edificio Beaux-Arts restaurado en Broadway y la calle 28, con 167 habitaciones, el restaurante Cecconi's y acceso a áreas del club privado. Queda a pasos del Flatiron y de Elcielo. La opción con mejor relación precio-ubicación de las tres.",
      tag: "El Nueva York de los años veinte, cerca de todo",
      affiliateUrl: "https://www.booking.com/hotel/us/the-ned-nomad.html?ref=lagomplan",
      archetypes: ["Parejas"],
    },
  ],
  hotelsDescription: "Tres hoteles en barrios para comer a pie. Calificación de Booking.com; precio promedio por noche de comparadores en 2026, en dólares. Confirma la tarifa de tus fechas en el link.",
  experiences: [
    {
      name: "Greenwich Village Food Tour con 6 degustaciones",
      description: "GetYourGuide: 4.9/5 (116 reseñas) · Desde US$101 por persona. Tres horas por el barrio bohemio de Manhattan con un guía local: bagel con queso crema, pizza neoyorquina, cupcakes, donas gourmet y un platillo secreto que se revela ese día. Grupo de máximo 12 personas, cancelación gratis hasta 24 horas antes. Lo opera Secret Food Tours, en inglés.",
      tags: ["Tour de comida", "3 horas", "Grupo pequeño", "Cancelación gratis"],
      affiliateUrl: "https://www.getyourguide.com/new-york-city-l59/nyc-trendy-greenwich-village-food-tour-with-6-tastings-t105856/?ref=lagomplan",
    },
    {
      name: "Chelsea Market, Meatpacking y High Line Food Tour",
      description: "GetYourGuide: 4.7/5 (140 reseñas) · Desde US$88 por persona. Recorrido de tres horas con máximo 10 personas: una hora de degustaciones en Chelsea Market, otra en Market 57 frente al Hudson y la última caminando la High Line con historia de su arquitectura. Incluye un almuerzo completo. Punto de encuentro frente a Buddakan, 75 Ninth Avenue.",
      tags: ["Tour de comida", "3 horas", "Máximo 10 personas", "Almuerzo incluido"],
      affiliateUrl: "https://www.getyourguide.com/new-york-city-l59/nyc-chelsea-market-meatpacking-high-line-food-tour-t210972/?ref=lagomplan",
    },
    {
      name: "Brunch, almuerzo o cena a bordo del Bateaux New York",
      description: "GetYourGuide: 4.5/5 (1,055 reseñas) · Desde US$115 por persona. Crucero de City Cruises en un barco de cristal que sale de Chelsea Piers y recorre los ríos Hudson y East frente al skyline, con mesa privada, menú de tres tiempos y música en vivo. El brunch incluye mimosas ilimitadas; la cena pide ropa semiformal y cuesta más que el precio de entrada. Para una pareja es la forma de ver la Estatua de la Libertad sin filas.",
      tags: ["Crucero", "2 a 3 horas", "Comida incluida", "Código de vestimenta en la cena"],
      affiliateUrl: "https://www.getyourguide.com/new-york-city-l59/nyc-city-cruises-luxury-brunch-lunch-or-dinner-cruise-t279782/?ref=lagomplan",
    },
  ],
  experiencesDescription: "Tres experiencias de GetYourGuide para comer la ciudad por barrios. Calificación y precio por persona de GetYourGuide al 23 de octubre de 2026, en dólares.",
  tips: [
    "Reserva las cenas antes que el vuelo. Los restaurantes de la Guía Michelin abren sus mesas con semanas de anticipación y se llenan rápido en fin de semana. Ten una alternativa por noche.",
    "Un tour de comida al día basta. Cada tour equivale a una comida completa. Si haces el de Chelsea al mediodía, la cena de estrella Michelin se disfruta más con hambre.",
    "La propina no viene incluida. En restaurantes calcula entre 18 y 20% sobre la cuenta antes de impuestos.",
    "El metro es tu mejor transporte. Cada viaje cuesta 3 dólares y se paga tocando la tarjeta o el celular en el torniquete. Cada persona debe usar su propia tarjeta: el tope semanal se calcula por tarjeta.",
  ],
  funFact: "La Guía Michelin publicó su primera edición norteamericana en Nueva York, en 2005. Hoy la ciudad tiene más de 350 restaurantes en la selección, y la guía suma lugares nuevos a lo largo del año antes de repartir estrellas en diciembre.",
  checklist: [
    "Pasaporte y visa estadounidense vigente",
    "Abrigo, bufanda y guantes: las noches bajan a 3 a 7 °C",
    "Zapatos cómodos para caminar y otros para las cenas",
    "Ropa semiformal si vas al crucero de noche",
    "Tarjeta de crédito o celular con pago sin contacto para el metro",
    "Paraguas compacto: noviembre es lluvioso",
    "Confirmaciones de restaurantes guardadas en el celular",
  ],
  transport: [
    {
      mode: "Cómo llegar: avión",
      description: "Nueva York tiene tres aeropuertos: JFK, LaGuardia y Newark. Desde JFK, el AirTrain cuesta 8.25 dólares y conecta con el metro a Manhattan. Un taxi o auto con chofer es más cómodo con maletas.",
    },
    {
      mode: "Cómo llegar: documentos",
      description: "Pasaporte vigente y visa B1/B2. Revisa que la visa no venza durante el viaje.",
    },
    {
      mode: "Moverse en la ciudad",
      description: "Desde enero de 2026 el metro y los autobuses se pagan solo con OMNY: tocas tu tarjeta de crédito, débito o celular en el lector. El viaje cuesta 3 dólares y existe un tope semanal de 35 dólares por tarjeta. Si no tienes tarjeta sin contacto, venden una tarjeta OMNY física en las estaciones. Para tramos cortos entre SoHo, el Village y Chelsea, caminar es lo más rápido.",
    },
    {
      mode: "Clima",
      description: "A mediados de noviembre las máximas en Central Park rondan los 10 a 14 °C y las mínimas los 3 a 7 °C. Es un mes lluvioso y el viento junto al río hace sentir más frío. Vístete en capas.",
    },
  ],
  timely: {
    validUntil: "2026-12-31",
    eyebrow: "Esta temporada",
    title: "Noviembre y diciembre 2026",
    verifiedNote: "Datos verificados el 23 de octubre de 2026. Precios, horarios y eventos valen para la temporada de noviembre y diciembre 2026.",
    essentialsTitle: "Lo esencial antes de reservar",
    essentials: [
      "Necesitas visa estadounidense vigente (B1/B2) y pasaporte.",
      "Las cenas de estrella Michelin se reservan con semanas de anticipación.",
      "El metro se paga solo con tarjeta o celular sin contacto (OMNY): la MetroCard dejó de venderse.",
    ],
    whenTitle: "Cuándo ir",
    whenIntro: "La ruta funciona en cualquier fin de semana largo de noviembre o diciembre. Lo que cambia según la fecha está aquí.",
    window: "Ventana sugerida: del viernes 13 al lunes 16 de noviembre de 2026, el puente del Día de la Revolución. El lunes 16 es día de descanso obligatorio y no hay clases en escuelas SEP.",
    table: {
      headers: ["Qué pasa", "Fechas 2026", "Qué cambia para tu viaje"],
      rows: [
        {
          what: "Winter Village de Bryant Park",
          when: "Tiendas del 28 de octubre al 3 de enero; pista hasta el 28 de febrero de 2027",
          impact: "Pista con entrada libre de 8:00 a 22:00; del 19 de noviembre al 3 de enero abre hasta medianoche",
        },
        {
          what: "Iglús privados en Bryant Park",
          when: "Desde el 5 de noviembre",
          impact: "Comida y bebida en un domo junto a la pista; se reservan con anticipación",
        },
        {
          what: "Thanksgiving y desfile de Macy's",
          when: "Jueves 26 de noviembre",
          impact: "Fin de semana de mucha demanda: reserva hotel y cenas con más tiempo",
          until: "2026-11-26",
        },
        {
          what: "Mercados navideños de Union Square y Grand Central",
          when: "Suelen abrir a mediados de noviembre",
          impact: "Confirma las fechas 2026 antes de ir",
        },
        {
          what: "Ceremonia Michelin Northeast Cities",
          when: "14 de diciembre",
          impact: "Hasta esa fecha rige la lista de estrellas vigente; después, revisa las nuevas estrellas 2026",
          until: "2026-12-14",
        },
      ],
    },
    booking: {
      label: "Reserva con las fechas sugeridas:",
      links: [
        {
          name: "Crosby Street Hotel",
          url: "https://www.booking.com/hotel/us/crosby-street.html?checkin=2026-11-13&checkout=2026-11-16&ref=lagomplan",
        },
        {
          name: "The Greenwich Hotel",
          url: "https://www.booking.com/hotel/us/the-greenwich.html?checkin=2026-11-13&checkout=2026-11-16&ref=lagomplan",
        },
        {
          name: "The Ned NoMad",
          url: "https://www.booking.com/hotel/us/the-ned-nomad.html?checkin=2026-11-13&checkout=2026-11-16&ref=lagomplan",
        },
      ],
    },
  },
}
