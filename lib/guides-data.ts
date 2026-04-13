// Auto-generated from /prototypes/original guides/ — DO NOT EDIT MANUALLY
// Source: 14 LagomPlan guides (Spanish)

export interface TransportOption {
  type: string
  description: string
}

export interface ItineraryItem {
  time: string
  title: string
  description: string
}

export interface ItineraryDay {
  day: number
  title: string
  items: ItineraryItem[]
}

export interface Hotel {
  id: string
  name: string
  priceLevel: "$" | "$$" | "$$$"
  description: string
  tags: string[]
  sourceGuide: string
}

export interface Experience {
  id: string
  name: string
  description: string
  tags: string[]
}

export interface Guide {
  slug: string
  locale: string
  content: {
    title: string
    subtitle: string
    kicker: string
    intro: string
    tips: string[]
    logisticsText: string
  }
  structuredData: {
    durationDays: number
    hotels: Hotel[]
    experiences: Experience[]
    itinerary: ItineraryDay[]
    logistics: {
      transportOptions: TransportOption[]
    }
  }
}

export const guides: Guide[] = [
  {
    "slug": "cancun-family-value-edition",
    "locale": "es",
    "content": {
      "title": "LagomPlan — Cancún (Family & Value Edition)",
      "subtitle": "El azul más famoso del mundo para todas las edades. Una pausa equilibrada entre el confort del resort, la aventura natural y el valor inteligente.",
      "kicker": "Guía curada · Viaje familiar",
      "intro": "",
      "tips": [
        "El supermercado es tu aliado: El Chedraui Selecto de la Zona Hotelera tiene comida gourmet preparada, bloqueadores y bebidas a precios de ciudad. Es el mejor lugar para armar un \"picnic\" de playa y ahorrar mucho dinero.",
        "Protección Inteligente: El sol del Caribe no perdona. Más que bloqueador, usen playeras de natación con protección UV. Ahorrarán en crema y evitarán quemaduras que arruinen el viaje.",
        "Agua siempre embotellada: Incluso en los hoteles de lujo, para beber usa siempre agua embotellada. Evita la \"venganza de Moctezuma\" que los puede dejar fuera de combate por un día entero.",
        "DATO CURIOSO: Cancún significa \"Nido de Serpientes\" en maya. Antes de 1970, sólo vivían aquí una docena de  cuidadores de una plantación de coco; hoy es el destino turístico más importante de América Latina."
      ],
      "logisticsText": "Vuelo: Llegada al Aeropuerto de Cancún (CUN). | Traslado: Prohibido tomar taxi al llegar (son súper caros). Reserven un transporte privado tipo shuttle con anticipación (como Happy Shuttle o USA Transfers). Es más barato, seguro y los esperan con su nombre. | Movilidad: Usen el autobús local (R1 o R2) para moverse dentro de la Zona Hotelera. Cuesta solo 12 pesos y pasa cada 2 minutos. Es el mejor secreto para evitar taxis de 40 USD por trayectos cortos."
    },
    "structuredData": {
      "durationDays": 4,
      "hotels": [
        {
          "name": "Nizuc Resort & Spa",
          "priceLevel": "$$$",
          "description": "El refugio de lujo más exclusivo al final de la Zona Hotelera. Ideal para familias que buscan paz, una playa sin sargazo (por su ubicación) y un Kids’ Club de primer nivel. Lujo zen y privacidad.",
          "tags": [],
          "id": "nizuc-resort-spa",
          "sourceGuide": "cancun-family-value-edition"
        },
        {
          "name": "Grand Fiesta Americana Coral Beach",
          "priceLevel": "$$",
          "description": "El mejor \"deal\" de lujo familiar. Recientemente se volvió All-Inclusive, pero mantiene una calidad gastronómica superior. Su club de niños es de los mejores de México. Resort de alta gama \"todo incluido\".",
          "tags": [],
          "id": "grand-fiesta-americana-coral-beach",
          "sourceGuide": "cancun-family-value-edition"
        },
        {
          "name": "Aloft Cancun",
          "priceLevel": "$",
          "description": "La opción \"smart value\". No es un resort frente al mar, pero está a pasos de la playa pública y rodeado de servicios. Perfecto para familias que prefieren invertir su presupuesto en parques y excursiones. Ubicación estratégica y ahorro.",
          "tags": [],
          "id": "aloft-cancun",
          "sourceGuide": "cancun-family-value-edition"
        }
      ],
      "experiences": [
        {
          "name": "Aventura compartida",
          "description": "",
          "tags": [],
          "id": "aventura-compartida"
        },
        {
          "name": "Día en Isla Mujeres",
          "description": "Tomen el ferry de UltraMar (un plan económico y divertido). Al llegar, renten un carrito de golf y pasen el día en Playa Norte; el agua es tan baja y tranquila que parece una alberca gigante.",
          "tags": [],
          "id": "dia-en-isla-mujeres"
        },
        {
          "name": "Parque Xcaret",
          "description": "Es una inversión, pero es el parque más completo. El show nocturno está lleno de cultura: una experiencia que los niños recordarán toda la vida. Tip: Reserven con 21 días de antelación para un 15% de descuento.",
          "tags": [],
          "id": "parque-xcaret"
        },
        {
          "name": "Cenote Azul",
          "description": "A una hora y media de Cancún. Es un cenote abierto, ideal para niños que no se sienten cómodos en cuevas cerradas. Es el \"deal\" perfecto para un día de naturaleza por poco dinero.",
          "tags": [],
          "id": "cenote-azul"
        }
      ],
      "itinerary": [
        {
          "day": 1,
          "title": "El aterrizaje",
          "items": [
            {
              "time": "15:00",
              "title": "Check-in y primera inmersión en la alberca.",
              "description": ""
            },
            {
              "time": "18:00",
              "title": "Caminata por la playa y cena familiar en el hotel.",
              "description": ""
            }
          ]
        },
        {
          "day": 2,
          "title": "El highlight del viaje",
          "items": [
            {
              "time": "08:30",
              "title": "Día completo en Xcaret o Xel-Há.",
              "description": ""
            },
            {
              "time": "21:00",
              "title": "Regreso al hotel después del show nocturno (los niños caerán rendidos).",
              "description": ""
            }
          ]
        },
        {
          "day": 3,
          "title": "Isla Mujeres \"Smart\"",
          "items": [
            {
              "time": "09:30",
              "title": "Ferry desde Playa Tortugas hacia Isla Mujeres.",
              "description": ""
            },
            {
              "time": "11:00",
              "title": "Playa Norte y comida local de pescado \"Tikin-xic\".",
              "description": ""
            },
            {
              "time": "17:00",
              "title": "Regreso y cena de tacos en el centro de Cancún (más barato y auténtico).",
              "description": ""
            }
          ]
        },
        {
          "day": 4,
          "title": "Despedida y compras",
          "items": [
            {
              "time": "10:00",
              "title": "Visita a Playa Delfines (el mirador con las letras de Cancún) para la foto familiar.",
              "description": ""
            },
            {
              "time": "12:00",
              "title": "Compras de último minuto en el supermercado Chedraui Selecto (mejores precios que en tiendas de souvenirs) y salida al aeropuerto.",
              "description": ""
            }
          ]
        }
      ],
      "logistics": {
        "transportOptions": [
          {
            "type": "Vuelo",
            "description": "Llegada al Aeropuerto de Cancún (CUN)."
          },
          {
            "type": "Traslado",
            "description": "Prohibido tomar taxi al llegar (son súper caros). Reserven un transporte privado tipo shuttle con anticipación (como Happy Shuttle o USA Transfers). Es más barato, seguro y los esperan con su nombre."
          },
          {
            "type": "Movilidad",
            "description": "Usen el autobús local (R1 o R2) para moverse dentro de la Zona Hotelera. Cuesta solo 12 pesos y pasa cada 2 minutos. Es el mejor secreto para evitar taxis de 40 USD por trayectos cortos."
          }
        ]
      }
    }
  },
  {
    "slug": "ciudad-de-mexico-arte-mesa",
    "locale": "es",
    "content": {
      "title": "LagomPlan — Ciudad de México (Arte & Mesa)",
      "subtitle": "Una metrópoli que respira creatividad en cada esquina. El pulso perfecto entre museos de clase mundial y una de las escenas gastronómicas más excitantes del planeta.TRIP SUBTITLE",
      "kicker": "Guía curada · Parejas",
      "intro": "",
      "tips": [
        "El Hack de la \"Barra para dos\": LAGOM TIPS: TITLE",
        "Si no consiguieron reservación en los \"top\" de la Roma (como Pujol o Rosetta), lleguen a la hora de apertura y pregunten por espacio en barra. Casi siempre guardan un par de asientos para \"walk-ins\" que viajan en pareja.LAGOM TIPS: BODY",
        "La altura y el mezcal: La CDMX está a más de 2,200 metros. El alcohol pega el doble de rápido aquí. La regla de oro: un vaso de agua por cada copa de mezcal para evitar que el mareo arruine el plan artístico del día siguiente.",
        "El secreto del domingo: La mayoría de los museos son gratuitos para locales el domingo y se llenan demasiado. Si quieren paz, dejen los museos para el viernes o sábado y usen el domingo para el paseo dominical en bici por Reforma; cierran la avenida a los coches y es una gloria.",
        "DATO CURIOSO: La Ciudad de México es la segunda ciudad con más museos en el mundo (después de Londres). Tiene más de 150 espacios culturales, lo que significa que podrías visitar uno diferente cada semana durante tres años y no terminarías."
      ],
      "logisticsText": "Vuelo: Llegada al AICM (más céntrico) o AIFA. | Traslado: Uber y Didi funcionan de maravilla. Tip: Si llegan al AICM, caminen hacia las salidas autorizadas para apps; es más rápido y económico que el taxi oficial. | Movilidad: No renten coche. La CDMX es la capital del tráfico. Usen Uber para distancias largas y EcoBici para moverse entre la Roma, Condesa y Reforma; es rápido y eficiente."
    },
    "structuredData": {
      "durationDays": 3,
      "hotels": [
        {
          "name": "The Ritz-Carlton, Mexico City",
          "priceLevel": "$$$",
          "description": "Lujo en las alturas. Ubicado en los pisos superiores de un rascacielos en Reforma, ofrece las vistas más románticas del Castillo de Chapultepec desde tu cama. RECOMMENDATIONS: REASON",
          "tags": [
            "Lujo en las nubes. RECOMMENDATIONS: WHY"
          ],
          "id": "the-ritz-carlton-mexico-city",
          "sourceGuide": "ciudad-de-mexico-arte-mesa"
        },
        {
          "name": "Brick Hotel",
          "priceLevel": "$$",
          "description": "Una joya en la Roma Norte. Combina una fachada de principios del siglo XX con un interior moderno y minimalista. Es el punto de partida ideal para explorar galerías a pie.",
          "tags": [
            "Modern Heritage."
          ],
          "id": "brick-hotel",
          "sourceGuide": "ciudad-de-mexico-arte-mesa"
        },
        {
          "name": "Casa Cuenca",
          "priceLevel": "$$",
          "description": "Un refugio contemporáneo que prioriza el descanso y la ubicación estratégica. Sus habitaciones están diseñadas para estancias largas y cómodas (con batas de lujo y salas de estar), complementadas por un restaurante romántico que es el oasis perfecto tras explorar los museos cercanos.",
          "tags": [
            "Ubicación imbatible y confort."
          ],
          "id": "casa-cuenca",
          "sourceGuide": "ciudad-de-mexico-arte-mesa"
        }
      ],
      "experiences": [
        {
          "name": "Estética y sabor",
          "description": "",
          "tags": [],
          "id": "estetica-y-sabor"
        },
        {
          "name": "Casa Luis Barragán",
          "description": "RECOMMENDATIONS NAME",
          "tags": [],
          "id": "casa-luis-barragan"
        },
        {
          "name": "Es indispensable reservar con meses de antelación. Es una lección de luz, color y silencio; la experiencia arquitectónica más íntima que puedes tener en pareja. RECOMMENDATIONS: REASON",
          "description": "",
          "tags": [],
          "id": "es-indispensable-reservar-con-meses-de-antelacion-es-una-leccion-de-luz-color-y-silencio-la-experiencia-arquitectonica-mas-intima-que-puedes-tener-en-pareja-recommendations-reason"
        },
        {
          "name": "Ruta de galerías en la San Rafael",
          "description": "Salgan de la Roma y exploren el barrio de la San Rafael. Visiten galerías como Hilario Galguera o Eco; encontrarán arte contemporáneo de alto nivel sin las multitudes.",
          "tags": [],
          "id": "ruta-de-galerias-en-la-san-rafael"
        },
        {
          "name": "Cena en barra de autor",
          "description": "Busquen lugares como Expendio de Maíz o la barra de Máximo. Ver la precisión de los chefs a pocos centímetros mientras comparten un vino natural es el epítome del lujo relajado.",
          "tags": [],
          "id": "cena-en-barra-de-autor"
        }
      ],
      "itinerary": [
        {
          "day": 1,
          "title": "El eje cultural",
          "items": [
            {
              "time": "11:00",
              "title": "Museo Nacional de Antropología (enfóquense solo en la sala Mexica para no abrumarse).",
              "description": ""
            },
            {
              "time": "14:30",
              "title": "Comida en Contramar (el pulpo a las brasas es ley).",
              "description": ""
            },
            {
              "time": "17:00",
              "title": "Caminata por el Bosque de Chapultepec. ITINERARY: DETAILED RICH TEXT",
              "description": ""
            }
          ]
        },
        {
          "day": 2,
          "title": "Centro Histórico y murallas",
          "items": [
            {
              "time": "10:00",
              "title": "Palacio de Bellas Artes y los murales del Palacio Nacional.",
              "description": ""
            },
            {
              "time": "13:00",
              "title": "Tacos de canasta \"Los Especiales\" (el snack rápido más auténtico del Centro).",
              "description": ""
            },
            {
              "time": "19:00",
              "title": "Cena en Lorea o Merotoro en la Condesa.",
              "description": ""
            }
          ]
        },
        {
          "day": 3,
          "title": "Diseño y despedida",
          "items": [
            {
              "time": "11:00",
              "title": "Visita a Casa Barragán o Museo Soumaya/Jumex.",
              "description": ""
            },
            {
              "time": "14:00",
              "title": "Brunch largo en Panaderia Rosetta.",
              "description": ""
            },
            {
              "time": "16:00",
              "title": "Últimas compras de diseño en Lago DF y salida al aeropuerto.",
              "description": ""
            }
          ]
        }
      ],
      "logistics": {
        "transportOptions": [
          {
            "type": "Vuelo",
            "description": "Llegada al AICM (más céntrico) o AIFA."
          },
          {
            "type": "Traslado",
            "description": "Uber y Didi funcionan de maravilla. Tip: Si llegan al AICM, caminen hacia las salidas autorizadas para apps; es más rápido y económico que el taxi oficial."
          },
          {
            "type": "Movilidad",
            "description": "No renten coche. La CDMX es la capital del tráfico. Usen Uber para distancias largas y EcoBici para moverse entre la Roma, Condesa y Reforma; es rápido y eficiente."
          }
        ]
      }
    }
  },
  {
    "slug": "guadalajara-foodies-adventure",
    "locale": "es",
    "content": {
      "title": "LagomPlan — Guadalajara (Foodies & Adventure)",
      "subtitle": "Tierra de tequila, arquitectura y sabores audaces. Una pausa diseñada para explorar mercados, brindar en destilerías y descubrir por qué es la capital del estilo tapatío.",
      "kicker": "Guía curada · Amigos aventureros",
      "intro": "",
      "tips": [
        "La cruda es real: El tequila artesanal no perdona si no te hidratas. El tejuino (bebida de maíz fermentado con nieve de limón) es el mejor remedio local; no se vayan sin probarlo en el mercado.",
        "Reserva con estrategia: Restaurantes como Alcalde o Xokol se llenan con semanas de antelación. Si son foodies serios, aseguren su mesa con antelación.",
        "Zapatos para caminar: Guadalajara se disfruta caminando por sus colonias. Olviden lo formal; unos tenis con estilo son el uniforme adecuado para aguantar del mercado a la terraza.",
        "DATO CURIOSO: Guadalajara es la cuna del mariachi y el tequila, pero también es conocida como el \"Silicon Valley de México\" por su enorme industria tecnológica y creativa que convive con sus tradiciones más antiguas."
      ],
      "logisticsText": "Vuelo: Llegada al Aeropuerto de Guadalajara (GDL). | Traslado: Uber funciona perfectamente y es muy económico en la ciudad. Desde el aeropuerto a la Colonia Americana son unos 30-40 minutos. | Movilidad: Guadalajara es una ciudad de barrios. Para moverse entre la Americana, Providencia y el Centro, Uber es la mejor opción. No renten coche; el tráfico y el estacionamiento son un dolor de cabeza innecesario."
    },
    "structuredData": {
      "durationDays": 3,
      "hotels": [
        {
          "name": "Casa Habita",
          "priceLevel": "$$",
          "description": "Ubicado en la Colonia Americana (el barrio más cool). Diseño retro-moderno con una alberca en la terraza ideal para el \"pre\" con los amigos.",
          "tags": [
            "Estilo puro y vida nocturna."
          ],
          "id": "casa-habita",
          "sourceGuide": "guadalajara-foodies-adventure"
        },
        {
          "name": "Villa Ganz",
          "priceLevel": "$$$",
          "description": "Una casona antigua restaurada con un gusto impecable. Se siente como la casa de un amigo sofisticado. Perfecta para quienes buscan confort clásico en el corazón de la zona foodie.",
          "tags": [
            "Calidez y sofisticación."
          ],
          "id": "villa-ganz",
          "sourceGuide": "guadalajara-foodies-adventure"
        },
        {
          "name": "Hilton DoubleTree Centro Histórico",
          "priceLevel": "$",
          "description": "El equilibrio ideal entre la eficiencia de una gran cadena y el alma vibrante del centro tapatío. Ofrece habitaciones insonorizadas que funcionan como un búnker de calma absoluta a solo pasos de la Catedral, coronadas por una terraza con vistas privilegiadas del skyline histórico.",
          "tags": [
            "Fiabilidad y ubicación premium."
          ],
          "id": "hilton-doubletree-centro-historico",
          "sourceGuide": "guadalajara-foodies-adventure"
        }
      ],
      "experiences": [
        {
          "name": "Tour de tequila artesanal",
          "description": "Eviten el tren turístico masivo. Renten un conductor privado hacia la zona de Tequila para visitar destilerías boutique como Cascahuín o Fortaleza. Es aventura líquida para conocedores.",
          "tags": [],
          "id": "tour-de-tequila-artesanal"
        },
        {
          "name": "Safari de tortas ahogadas",
          "description": "No se queden con una. Hagan un recorrido por las clásicas (como El Güerito) y las modernas. Es el rito de iniciación obligatorio para cualquier foodie.",
          "tags": [],
          "id": "safari-de-tortas-ahogadas"
        },
        {
          "name": "Caminata por la colonia Americana",
          "description": "Exploren las galerías y tiendas de diseño independiente. Terminen la tarde en una cata de café de especialidad en Pólvora o Taller de Espresso.",
          "tags": [],
          "id": "caminata-por-la-colonia-americana"
        }
      ],
      "itinerary": [
        {
          "day": 1,
          "title": "Barrio y Coctelería",
          "items": [
            {
              "time": "15:00",
              "title": "Check-in en la Americana y caminata por la zona.",
              "description": ""
            },
            {
              "time": "17:00",
              "title": "Comida tarde en Hueso (arquitectura y comida de autor).",
              "description": ""
            },
            {
              "time": "21:00",
              "title": "Tour de bares: Empiecen en El Gallo Altanero (el templo del tequila).",
              "description": ""
            }
          ]
        },
        {
          "day": 2,
          "title": "El Corazón del Agave",
          "items": [
            {
              "time": "09:00",
              "title": "Salida hacia el pueblo de Tequila o Amatitán.",
              "description": ""
            },
            {
              "time": "14:00",
              "title": "Comida rústica en el mercado de Tequila o en una hacienda.",
              "description": ""
            },
            {
              "time": "19:00",
              "title": "Regreso a GDL y cena de \"alivio\" con una carne en su jugo en Kamilos 333.",
              "description": ""
            }
          ]
        },
        {
          "day": 3,
          "title": "Tradición y Cierre",
          "items": [
            {
              "time": "10:00",
              "title": "Desayuno de campeones en Pal Real (el mejor lonche de pancita).",
              "description": ""
            },
            {
              "time": "12:00",
              "title": "Visita al Hospicio Cabañas para ver los murales de Orozco (la parte cultural/aventura).",
              "description": ""
            },
            {
              "time": "15:00",
              "title": "Última ronda de tejuinos y salida al aeropuerto.",
              "description": ""
            }
          ]
        }
      ],
      "logistics": {
        "transportOptions": [
          {
            "type": "Vuelo",
            "description": "Llegada al Aeropuerto de Guadalajara (GDL)."
          },
          {
            "type": "Traslado",
            "description": "Uber funciona perfectamente y es muy económico en la ciudad. Desde el aeropuerto a la Colonia Americana son unos 30-40 minutos."
          },
          {
            "type": "Movilidad",
            "description": "Guadalajara es una ciudad de barrios. Para moverse entre la Americana, Providencia y el Centro, Uber es la mejor opción. No renten coche; el tráfico y el estacionamiento son un dolor de cabeza innecesario."
          }
        ]
      }
    }
  },
  {
    "slug": "los-cabos-relax-spa-edition",
    "locale": "es",
    "content": {
      "title": "LagomPlan — Los Cabos (Relax & Spa Edition)",
      "subtitle": "Donde el desierto abraza al mar. Una escapada diseñada para renovar cuerpo y mente, con el equilibrio perfecto entre misticismo y sofisticación.",
      "kicker": "Guía curada · Relax entre amigas",
      "intro": "",
      "tips": [
        "El \"Dry Look\" de la Baja: El aire aquí es muy seco. Empaca un buen aceite facial y capilar. El sol y la brisa del Pacífico pueden resecar más de lo que imaginas.",
        "Mesa con vista: Si vas a The Cape para el atardecer (incluso si no te hospedas ahí), reserva en el Rooftop con una semana de antelación. Es el mejor spot de la zona y se llena rápido. Tienen precios especiales para residentes mexicanos.",
        "Capas ligeras: Aunque es desierto, la brisa marina de noche en Los Cabos puede ser fresca. Un pashmina o un blazer ligero es tu mejor aliado para las cenas al aire libre.",
        "DATO CURIOSO: Jacques Cousteau llamó a este lugar \"el acuario del mundo\". Es el punto exacto donde el Mar de Cortés se abraza con el Pacífico en el \"Fin de la Tierra\", creando una energía de calma ideal para el descanso profundo."
      ],
      "logisticsText": "Vuelo: Llegada al Aeropuerto de San José del Cabo (SJD). | Traslado: Para grupos de amigas, lo más Lagom es reservar un transporte privado previo. Evita las filas de taxis y la confusión del Uber (que tiene restricciones en la zona federal del aeropuerto). | Movilidad: Si se quedan en Hacienda Encantada o The Cape, están en el \"Corredor Turístico\". Uber funciona bien para ir de un hotel a otro o hacia San José."
    },
    "structuredData": {
      "durationDays": 3,
      "hotels": [
        {
          "name": "The Cape, a Thompson Hotel",
          "priceLevel": "$$$",
          "description": "Arquitectura impactante y estética mid-century modern. Es el lugar para ver y ser visto, con vistas frontales al Arco desde cada tina de baño.",
          "tags": [
            "Lujo icónico y diseño."
          ],
          "id": "the-cape-a-thompson-hotel",
          "sourceGuide": "los-cabos-relax-spa-edition"
        },
        {
          "name": "Hacienda Encantada Resort & Residences",
          "priceLevel": "$$",
          "description": "La experiencia clásica de la Baja. Arquitectura tipo hacienda con vistas espectaculares al Mar de Cortés. Es ideal para grupos que buscan amplitud (sus suites y villas son enormes) y un servicio de spa tradicional y completo.",
          "tags": [
            "Confort clásico y amplitud."
          ],
          "id": "hacienda-encantada-resort-residences",
          "sourceGuide": "los-cabos-relax-spa-edition"
        },
        {
          "name": "Drift San José",
          "priceLevel": "$",
          "description": "Minimalismo industrial en el corazón del Distrito del Arte. Un refugio \"smart\" para quienes prefieren la vida de barrio, las fogatas nocturnas y una estética limpia sin el costo de un gran resort.",
          "tags": [
            "Smart Value y estilo local."
          ],
          "id": "drift-san-jose",
          "sourceGuide": "los-cabos-relax-spa-edition"
        }
      ],
      "experiences": [
        {
          "name": "Bienestar consciente",
          "description": "",
          "tags": [],
          "id": "bienestar-consciente"
        },
        {
          "name": "Mañana de spa y agua",
          "description": "Dedicar 2-3 horas al circuito de hidroterapia (vapor, sauna, fosa fría). En Los Cabos, el spa es una de las principales actividades del viaje.",
          "tags": [],
          "id": "manana-de-spa-y-agua"
        },
        {
          "name": "Sunset Sail Privado",
          "description": "Un catamarán solo para ustedes hacia el Arco. Ver el atardecer con una copa de vino desde el mar es el momento cumbre de la desconexión.",
          "tags": [],
          "id": "sunset-sail-privado"
        },
        {
          "name": "Cena en el Huerto",
          "description": "Visita a Flora Farms o Acre en San José. Gastronomía \"farm-to-table\" rodeadas de flores y coctelería botánica.",
          "tags": [],
          "id": "cena-en-el-huerto"
        }
      ],
      "itinerary": [
        {
          "day": 1,
          "title": "La llegada",
          "items": [
            {
              "time": "15:00",
              "title": "Check-in y brindis con vista al mar.",
              "description": ""
            },
            {
              "time": "17:30",
              "title": "Caminata por la playa al atardecer.",
              "description": ""
            },
            {
              "time": "20:00",
              "title": "Cena relajada en el hotel (The Rooftop en The Cape o Los Riscos en Hacienda Encantada).",
              "description": ""
            }
          ]
        },
        {
          "day": 2,
          "title": "Spa y mar",
          "items": [
            {
              "time": "09:00",
              "title": "Yoga o meditación matutina.",
              "description": ""
            },
            {
              "time": "11:00",
              "title": "Sesión de Spa (Masaje + Hidroterapia).",
              "description": ""
            },
            {
              "time": "16:30",
              "title": "Navegación privada hacia el Arco.",
              "description": ""
            },
            {
              "time": "20:30",
              "title": "Cena de gala en el Distrito del Arte de San José.",
              "description": ""
            }
          ]
        },
        {
          "day": 3,
          "title": "San José y diseño",
          "items": [
            {
              "time": "10:00",
              "title": "Brunch largo y nutritivo.",
              "description": ""
            },
            {
              "time": "11:30",
              "title": "Paseo por las galerías de San José (compras de diseño local).",
              "description": ""
            },
            {
              "time": "14:30",
              "title": "Último café frente al mar y salida al aeropuerto.",
              "description": ""
            }
          ]
        }
      ],
      "logistics": {
        "transportOptions": [
          {
            "type": "Vuelo",
            "description": "Llegada al Aeropuerto de San José del Cabo (SJD)."
          },
          {
            "type": "Traslado",
            "description": "Para grupos de amigas, lo más Lagom es reservar un transporte privado previo. Evita las filas de taxis y la confusión del Uber (que tiene restricciones en la zona federal del aeropuerto)."
          },
          {
            "type": "Movilidad",
            "description": "Si se quedan en Hacienda Encantada o The Cape, están en el \"Corredor Turístico\". Uber funciona bien para ir de un hotel a otro o hacia San José."
          }
        ]
      }
    }
  },
  {
    "slug": "merida-selva-aventura-familiar",
    "locale": "es",
    "content": {
      "title": "LagomPlan — Mérida (Selva & Aventura Familiar)",
      "subtitle": "El corazón vibrante de Yucatán. Una expedición diseñada para explorar cenotes ocultos, escalar pirámides y conectar con la naturaleza salvaje, sin perder el confort de la Ciudad Blanca.",
      "kicker": "Guía curada · Familia Aventurera",
      "intro": "",
      "tips": [
        "La regla del \"pico de calor\": Entre las 13:00 y las 16:00, el sol de Yucatán es implacable. Hagan como los locales: programen las actividades pesadas temprano, regresen a la alberca o al hotel a mediodía, y salgan de nuevo cuando baje el sol.",
        "Repelente de grado selva: No confíen en los sprays comerciales suaves. Busquen repelentes que contengan ingredientes naturales fuertes o DEET moderado, especialmente para las tardes en las haciendas o cenotes.",
        "Zapatos de agua rígidos: Para los niños, los aquashoes con suela de goma son obligatorios. Las rocas en los cenotes pueden ser resbaladizas y esto les da la confianza para saltar y explorar sin miedo.",
        "DATO CURIOSO: Mérida fue construida sobre los restos de una antigua ciudad maya llamada T’Hó. Si observas con atención las paredes de la Catedral de San Ildefonso, verás piedras talladas que pertenecieron a las pirámides originales."
      ],
      "logisticsText": "Vuelo: Llegada al Aeropuerto de Mérida (MID). | Traslado: Para una familia de 4 o 5, lo más Lagom es rentar una camioneta (SUV) directamente en el aeropuerto. Mérida es muy segura para manejar y la verdadera aventura está en los pueblos y cenotes aledaños. | Movilidad: En la ciudad, Uber funciona de maravilla. Para las excursiones a la selva o la costa, el coche propio les da la flexibilidad de regresar al hotel cuando los peques necesiten una siesta."
    },
    "structuredData": {
      "durationDays": 6,
      "hotels": [
        {
          "name": "Chablé Yucatán",
          "priceLevel": "$$$",
          "description": "Lujo absoluto integrado en la selva. Ubicado en una antigua hacienda, cuenta con su propio cenote, casitas con alberca privada y un programa para niños enfocado en la naturaleza y la cocina maya.",
          "tags": [
            "El máximo santuario maya."
          ],
          "id": "chable-yucatan",
          "sourceGuide": "merida-selva-aventura-familiar"
        },
        {
          "name": "Hacienda Xcanatun by Angsana",
          "priceLevel": "$$",
          "description": "La elegancia histórica de una hacienda con amenidades modernas. Sus amplios jardines y piscinas son perfectos para que los peques corran libremente tras un día de exploración arqueológica.",
          "tags": [
            "Confort clásico y jardines."
          ],
          "id": "hacienda-xcanatun-by-angsana",
          "sourceGuide": "merida-selva-aventura-familiar"
        },
        {
          "name": "Las Brisas",
          "priceLevel": "$",
          "description": "Es el balance perfecto entre lujo tradicional y practicidad urbana. Su alberca es de las mejores de la ciudad para que los niños se refresquen y su ubicación a pasos de Paseo de Montejo te permite disfrutar de la ciudad sin complicaciones.",
          "tags": [
            "Confort icónico y ubicación."
          ],
          "id": "las-brisas",
          "sourceGuide": "merida-selva-aventura-familiar"
        }
      ],
      "experiences": [
        {
          "name": "Aventura en el Mundo Maya",
          "description": "",
          "tags": [],
          "id": "aventura-en-el-mundo-maya"
        },
        {
          "name": "Cenotes de Santa Bárbara",
          "description": "Una aventura que les encantará. Se recorren tres cenotes diferentes en un truck (pequeño vagón jalado por caballos sobre rieles) o en bicicleta. Es seguro, organizado y el agua es cristalina.",
          "tags": [],
          "id": "cenotes-de-santa-barbara"
        },
        {
          "name": "Uxmal + Choco-Story",
          "description": "Exploren la zona arqueológica de Uxmal (menos saturada que Chichén Itzá) y crucen la calle hacia el museo del chocolate. Ahí, los niños pueden ver animales rescatados y aprender cómo los mayas hacían cacao.",
          "tags": [],
          "id": "uxmal-choco-story"
        },
        {
          "name": "Reserva de El Corchito",
          "description": "Un viaje corto en lancha desde Progreso hacia un oasis de manglares y cenotes bajos. Es el lugar ideal para ver mapaches y coatíes en su hábitat natural mientras nadan.",
          "tags": [],
          "id": "reserva-de-el-corchito"
        }
      ],
      "itinerary": [
        {
          "day": 1,
          "title": "El aterrizaje",
          "items": [
            {
              "time": "15:00",
              "title": "Check-in y paseo por Paseo de Montejo.",
              "description": ""
            },
            {
              "time": "19:00",
              "title": "Cena de antojitos yucatecos en Santa Ana.",
              "description": ""
            }
          ]
        },
        {
          "day": 2,
          "title": "Cenotes y bicicletas",
          "items": [
            {
              "time": "09:30",
              "title": "Expedición a los cenotes de Santa Bárbara.",
              "description": ""
            },
            {
              "time": "15:00",
              "title": "Comida de pueblo en Homún y regreso al hotel para alberca.",
              "description": ""
            }
          ]
        },
        {
          "day": 3,
          "title": "Pirámides y chocolate",
          "items": [
            {
              "time": "08:30",
              "title": "Exploración de Uxmal (llegar temprano para evitar el calor).",
              "description": ""
            },
            {
              "time": "12:00",
              "title": "Taller de cacao en Choco-Story.",
              "description": ""
            },
            {
              "time": "18:00",
              "title": "Noche de leyendas en el centro de Mérida.",
              "description": ""
            }
          ]
        },
        {
          "day": 4,
          "title": "Manglares y costa",
          "items": [
            {
              "time": "10:00",
              "title": "Reserva El Corchito en Progreso.",
              "description": ""
            },
            {
              "time": "14:30",
              "title": "Comida frente al mar en Crabster y tiempo de playa.",
              "description": ""
            }
          ]
        },
        {
          "day": 5,
          "title": "La ciudad amarilla",
          "items": [
            {
              "time": "10:00",
              "title": "Visita a Izamal. Suban a la pirámide de Kinich Kakmó (es gratuita y divertida).",
              "description": ""
            },
            {
              "time": "13:00",
              "title": "Comida en Kinich (el mejor restaurante de la zona).",
              "description": ""
            }
          ]
        },
        {
          "day": 6,
          "title": "Mercado y cierre",
          "items": [
            {
              "time": "09:00",
              "title": "Desayuno de tacos de lechón en el Mercado de Santiago.",
              "description": ""
            },
            {
              "time": "11:00",
              "title": "Compras finales de hamacas o guayaberas y salida al aeropuerto.",
              "description": ""
            }
          ]
        }
      ],
      "logistics": {
        "transportOptions": [
          {
            "type": "Vuelo",
            "description": "Llegada al Aeropuerto de Mérida (MID)."
          },
          {
            "type": "Traslado",
            "description": "Para una familia de 4 o 5, lo más Lagom es rentar una camioneta (SUV) directamente en el aeropuerto. Mérida es muy segura para manejar y la verdadera aventura está en los pueblos y cenotes aledaños."
          },
          {
            "type": "Movilidad",
            "description": "En la ciudad, Uber funciona de maravilla. Para las excursiones a la selva o la costa, el coche propio les da la flexibilidad de regresar al hotel cuando los peques necesiten una siesta."
          }
        ]
      }
    }
  },
  {
    "slug": "oaxaca-tradicion-en-familia",
    "locale": "es",
    "content": {
      "title": "LagomPlan — Oaxaca (Tradición en familia)",
      "subtitle": "Un festín de colores, sabores y texturas. Una ciudad para explorar a pie, aprender de artesanos y disfrutar del ritmo pausado del sur.",
      "kicker": "Guía curada · Viaje familiar",
      "intro": "",
      "tips": [
        "El snack oaxaqueño: Siempre ten a la mano una bolsa de chapulines con limón. Son la botana perfecta, saludable y a los niños les suele dar mucha curiosidad probarlos (y les encantan). ¡Dicen que es la comida del futuro!",
        "Sol de mediodía: En las zonas arqueológicas no hay sombra. Lleva sombreros de ala ancha y bloqueador. En Oaxaca el sol \"pica\" más de lo que parece.",
        "Reserva el Etnobotánico: Las visitas son guiadas y los cupos son muy limitados. No llegues sin cita; es uno de los lugares más relajantes de la ciudad.",
        "DATO CURIOSO: En el Árbol del Tule, los niños pueden jugar a encontrar figuras de animales escondidas en el tronco más ancho del mundo. Además, es el hogar de los alebrijes, donde cada miembro de la familia puede descubrir su propio guía espiritual de madera."
      ],
      "logisticsText": "En avión: La opción más sensata para familias. El aeropuerto (OAX) está a solo 20-30 min del centro. Reserva un transporte privado con antelación para no pelear por taxis a la llegada. | En coche (desde CDMX): Son unas 6 horas por la autopista. La carretera es buena pero tiene muchas curvas al llegar a Oaxaca (Cuesta Blanca); si tus hijos se marean, prepárate con tiempo. | Tip Lagom: Una vez en el centro, muévete a pie. Para las excursiones (Monte Albán, Mitla), renta un chofer privado por el día. Es más barato que un tour y te permite ir a tu propio ritmo familiar."
    },
    "structuredData": {
      "durationDays": 5,
      "hotels": [
        {
          "name": "Quinta Real Oaxaca",
          "priceLevel": "$$$",
          "description": "Ubicado en el antiguo Convento de Santa Catalina. Sus jardines y alberca son un oasis absoluto después de caminar por el centro.",
          "tags": [
            "Historia con alberca."
          ],
          "id": "quinta-real-oaxaca",
          "sourceGuide": "oaxaca-tradicion-en-familia"
        },
        {
          "name": "Hotel con Corazón",
          "priceLevel": "$$",
          "description": "Un hotel boutique con causa (apoyan la educación local). Es moderno, limpio y muy acogedor. El desayuno en su patio es el inicio perfecto del día.",
          "tags": [
            "Socialmente responsable."
          ],
          "id": "hotel-con-corazon",
          "sourceGuide": "oaxaca-tradicion-en-familia"
        },
        {
          "name": "City Centro Oaxaca",
          "priceLevel": "$$",
          "description": "Ubicado en el Barrio de Jalatlaco (el más colorido). Tiene un diseño contemporáneo muy fotogénico y una alberca pequeña pero efectiva para refrescarse.",
          "tags": [
            "Estilo en Jalatlaco."
          ],
          "id": "city-centro-oaxaca",
          "sourceGuide": "oaxaca-tradicion-en-familia"
        }
      ],
      "experiences": [
        {
          "name": "Manos a la obra",
          "description": "",
          "tags": [],
          "id": "manos-a-la-obra"
        },
        {
          "name": "Taller de alebrijes en Arrazola",
          "description": "Más que verlos, los niños pueden sentarse con los artesanos a pintar su propia figura de madera. Es el souvenir más valioso.",
          "tags": [],
          "id": "taller-de-alebrijes-en-arrazola"
        },
        {
          "name": "Hierve el Agua",
          "description": "Las \"cascadas petrificadas\" son un espectáculo natural. Ir temprano garantiza fotos sin gente y una temperatura agradable para nadar en las pozas.",
          "tags": [],
          "id": "hierve-el-agua"
        },
        {
          "name": "Mercado de Tlacolula (Domingo)",
          "description": "Una inmersión cultural total. Es el mercado más antiguo; ideal para probar \"pan de cazuela\" y ver el trueque vivo.",
          "tags": [],
          "id": "mercado-de-tlacolula-domingo"
        }
      ],
      "itinerary": [
        {
          "day": 1,
          "title": "Jalatlaco y chocolate",
          "items": [
            {
              "time": "15:00",
              "title": "Check-in y caminata por el Barrio de Jalatlaco (calles empedradas y murales).",
              "description": ""
            },
            {
              "time": "17:00",
              "title": "Visita a Chocolate Mayordomo para ver cómo muelen el cacao. Merienda de chocolate con pan.",
              "description": ""
            },
            {
              "time": "19:00",
              "title": "Cena ligera cerca del Templo de Santo Domingo.",
              "description": ""
            }
          ]
        },
        {
          "day": 2,
          "title": "Historia y barro",
          "items": [
            {
              "time": "09:00",
              "title": "Monte Albán. Es imponente y hay espacio para que los niños corran entre las ruinas.",
              "description": ""
            },
            {
              "time": "13:00",
              "title": "Comida en Alfonsina (cocina de humo auténtica).",
              "description": ""
            },
            {
              "time": "16:00",
              "title": "Taller de barro negro en San Bartolo Coyotepec.",
              "description": ""
            }
          ]
        },
        {
          "day": 3,
          "title": "Naturaleza y textiles",
          "items": [
            {
              "time": "08:30",
              "title": "Hierve el Agua (salida temprana es clave).",
              "description": ""
            },
            {
              "time": "13:00",
              "title": "Visita al Árbol del Tule (el más ancho del mundo, a los niños les encanta buscar formas en el tronco).",
              "description": ""
            },
            {
              "time": "15:00",
              "title": "Comida en Teotitlán del Valle y demostración de tintes naturales en textiles.",
              "description": ""
            }
          ]
        },
        {
          "day": 4,
          "title": "El corazón de la ciudad",
          "items": [
            {
              "time": "10:00",
              "title": "Jardín Etnobotánico (Reserva con tiempo, el tour es bellísimo).",
              "description": ""
            },
            {
              "time": "13:00",
              "title": "Comida en el Mercado 20 de Noviembre (El \"Pasillo de Humo\" es toda una experiencia sensorial).",
              "description": ""
            },
            {
              "time": "17:00",
              "title": "Tarde libre de alberca o compras de diseño en la calle de Macedonio Alcalá.",
              "description": ""
            }
          ]
        },
        {
          "day": 5,
          "title": "Despedida suave",
          "items": [
            {
              "time": "10:00",
              "title": "Desayuno de despedida en Itanoni (culto al maíz).",
              "description": ""
            },
            {
              "time": "12:00",
              "title": "Compra de quesillo y mezcal para llevar a casa. Salida al aeropuerto.",
              "description": ""
            }
          ]
        }
      ],
      "logistics": {
        "transportOptions": [
          {
            "type": "En avión",
            "description": "La opción más sensata para familias. El aeropuerto (OAX) está a solo 20-30 min del centro. Reserva un transporte privado con antelación para no pelear por taxis a la llegada."
          },
          {
            "type": "En coche (desde CDMX)",
            "description": "Son unas 6 horas por la autopista. La carretera es buena pero tiene muchas curvas al llegar a Oaxaca (Cuesta Blanca); si tus hijos se marean, prepárate con tiempo."
          },
          {
            "type": "Tip Lagom",
            "description": "Una vez en el centro, muévete a pie. Para las excursiones (Monte Albán, Mitla), renta un chofer privado por el día. Es más barato que un tour y te permite ir a tu propio ritmo familiar."
          }
        ]
      }
    }
  },
  {
    "slug": "queretaro-amigos-estilo",
    "locale": "es",
    "content": {
      "title": "LagomPlan — Querétaro (Amigos & Estilo)",
      "subtitle": "Arquitectura barroca, viñedos cercanos y una escena gastronómica que sorprende. La ciudad perfecta para caminar de día y brindar de noche.",
      "kicker": "Guía curada · Grupo de amigos",
      "intro": "",
      "tips": [
        "El clima engaña: Querétaro es semicálido de día pero refresca mucho en cuanto cae el sol. Una chamarra ligera o blazer es indispensable para las terrazas de noche.",
        "Reservas grupales: Si son más de 4 personas, Querétaro se llena rápido los fines de semana. Reserva las cenas con al menos 4 días de anticipación; no confíes en la suerte si quieres mesa en terraza.",
        "Agua de pie de cama: El aire de Querétaro es seco. Mantén siempre una botella de agua en tu habitación para evitar el dolor de cabeza matutino, especialmente después del vino en los viñedos.",
        "DATO CURIOSO: El icónico Acueducto de 74 arcos fue construido originalmente por amor para llevar agua a una monja, pero hoy es el marco arquitectónico perfecto para las mejores fotos de grupo."
      ],
      "logisticsText": "En coche desde CDMX: Un trayecto de unas 3 horas por la Autopista 57. Es la vía principal, pero suele tener tramos en reparación; salgan temprano (7:00 AM) para evitar el tráfico de carga. | En autobús: La opción más relajada. Los servicios ETN o Primera Plus desde Taxqueña o el Norte son de lujo, con asientos amplios para ir platicando o durmiendo. | Tip Lagom: Una vez en Querétaro, no usen coche. El centro se camina o se recorre en Uber. El tráfico local puede ser pesado y el estacionamiento es escaso."
    },
    "structuredData": {
      "durationDays": 4,
      "hotels": [
        {
          "name": "Hotel Boutique Casa del Atrio",
          "priceLevel": "$$$",
          "description": "Una joya frente al Templo de San Agustín. Sus habitaciones son eclécticas y llenas de arte. El patio central es el lugar perfecto para el primer café del día.",
          "tags": [
            "Arte y sofisticación."
          ],
          "id": "hotel-boutique-casa-del-atrio",
          "sourceGuide": "queretaro-amigos-estilo"
        },
        {
          "name": "Hotel Danza del Sol",
          "priceLevel": "$$",
          "description": "Amplio, con un aire de hacienda renovada y excelente servicio. Ideal si el grupo es grande y buscan comodidad sin complicaciones.",
          "tags": [
            "Confort clásico."
          ],
          "id": "hotel-danza-del-sol",
          "sourceGuide": "queretaro-amigos-estilo"
        },
        {
          "name": "Morazul Hotel Boutique",
          "priceLevel": "$$",
          "description": "Un refugio diseñado para quienes valoran la atención al detalle, a pasos de los templos más icónicos. Sus áreas exteriores ofrecen ese respiro de calma necesario para procesar la ciudad después de un día de exploración.",
          "tags": [
            "Servicio curado y ubicación imbatible."
          ],
          "id": "morazul-hotel-boutique",
          "sourceGuide": "queretaro-amigos-estilo"
        }
      ],
      "experiences": [
        {
          "name": "Ruta del Queso y Vino",
          "description": "Escapada a solo 45 min hacia Tequisquiapan o Ezequiel Montes. Visita a Freixenet o De Cote para una cata con vista a la Peña de Bernal.",
          "tags": [],
          "id": "ruta-del-queso-y-vino"
        },
        {
          "name": "Bar Hopping de Terrazas",
          "description": "Querétaro tiene las mejores vistas desde arriba. Lugares como La Grupa o Dodo Café son obligatorios para el \"pre\" nocturno.",
          "tags": [],
          "id": "bar-hopping-de-terrazas"
        },
        {
          "name": "Caminata por el Acueducto",
          "description": "Recorrido fotográfico por los arcos icónicos y los callejones del centro histórico (Patrimonio de la Humanidad).",
          "tags": [],
          "id": "caminata-por-el-acueducto"
        }
      ],
      "itinerary": [
        {
          "day": 1,
          "title": "El aterrizaje",
          "items": [
            {
              "time": "14:00",
              "title": "Check-in y comida en el Centro (prueba las \"Gorditas de migajas\").",
              "description": ""
            },
            {
              "time": "17:00",
              "title": "Caminata por la Plaza de Armas y el Andador Protasio Tagle.",
              "description": ""
            },
            {
              "time": "20:00",
              "title": "Cena en Hacienda La Laborcilla para una atmósfera impactante.",
              "description": ""
            }
          ]
        },
        {
          "day": 2,
          "title": "Viñedos y Peña",
          "items": [
            {
              "time": "10:00",
              "title": "Roadtrip hacia Bernal. Subida (parcial o total) a la Peña.",
              "description": ""
            },
            {
              "time": "14:00",
              "title": "Comida y cata en Viñedos De Cote (reservar con antelación).",
              "description": ""
            },
            {
              "time": "19:00",
              "title": "Regreso a la ciudad y noche de mezcales en el Centro.",
              "description": ""
            }
          ]
        },
        {
          "day": 3,
          "title": "Cultura y Diseño",
          "items": [
            {
              "time": "11:00",
              "title": "Visita al Museo de Arte de Querétaro (el claustro es de los más bellos de América).",
              "description": ""
            },
            {
              "time": "14:00",
              "title": "Brunch largo en Mosecafé.",
              "description": ""
            },
            {
              "time": "17:00",
              "title": "Tarde de compras en tiendas de diseño local y galerías.",
              "description": ""
            },
            {
              "time": "21:00",
              "title": "Cena de despedida en La Biznaga.",
              "description": ""
            }
          ]
        },
        {
          "day": 4,
          "title": "El cierre suave",
          "items": [
            {
              "time": "10:00",
              "title": "Visita al Acueducto y caminata por el barrio de La Cruz.",
              "description": ""
            },
            {
              "time": "12:00",
              "title": "Comida ligera y salida hacia CDMX para llegar antes del anochecer.",
              "description": ""
            }
          ]
        }
      ],
      "logistics": {
        "transportOptions": [
          {
            "type": "En coche desde CDMX",
            "description": "Un trayecto de unas 3 horas por la Autopista 57. Es la vía principal, pero suele tener tramos en reparación; salgan temprano (7:00 AM) para evitar el tráfico de carga."
          },
          {
            "type": "En autobús",
            "description": "La opción más relajada. Los servicios ETN o Primera Plus desde Taxqueña o el Norte son de lujo, con asientos amplios para ir platicando o durmiendo."
          },
          {
            "type": "Tip Lagom",
            "description": "Una vez en Querétaro, no usen coche. El centro se camina o se recorre en Uber. El tráfico local puede ser pesado y el estacionamiento es escaso."
          }
        ]
      }
    }
  },
  {
    "slug": "cuernavaca-refugio-de-primavera-estilo",
    "locale": "es",
    "content": {
      "title": "LagomPlan — Cuernavaca (Refugio de primavera & estilo)",
      "subtitle": "La ciudad de la eterna primavera. Un retiro diseñado para disfrutar de jardines exuberantes, gastronomía de altura y el lujo del tiempo lento en la cercanía de la capital.",
      "kicker": "Guía curada · Escape de fin de semana largo",
      "intro": "",
      "tips": [
        "El \"Dress Code\" Cuerna: Es el lugar para lucir el lino en su máxima expresión. Para las cenas, un estilo Resort Chic es perfecto: vestidos vaporosos para ellas y guayaberas o camisas de lino para ellos.",
        "Reserva con Antelación: En Semana Santa, los restaurantes icónicos como Las Mañanitas o Gaia se llenan con semanas de anticipación. Asegura tus mesas en cuanto confirmes el viaje.",
        "El Protector Solar: El sol de Cuernavaca es más fuerte de lo que parece debido a la frescura del viento. Un buen protector y un sombrero de palma de calidad son básicos para las comidas en el jardín.",
        "DATO CURIOSO: Cuernavaca ha sido el refugio de la élite desde tiempos prehispánicos. Los emperadores aztecas tenían aquí sus casas de verano, seguidos por Hernán Cortés y más tarde por Maximiliano de Habsburgo y Carlota, quienes se enamoraron del Jardín Borda por recordarle a las villas europeas."
      ],
      "logisticsText": "Ruta: Desde CDMX, la ruta es por la Autopista del Sol. En Semana Santa, la clave es salir el jueves a las 7:00 AM o el viernes muy temprano. El tráfico en \"El Paso Express\" puede ser crítico; paciencia y un buen playlist son esenciales. | Movilidad: Para un grupo de 4-6 personas, lo más Lagom es contratar una camioneta con chofer privado para los traslados a restaurantes o Jardines de México. Esto permite que todos disfruten de la coctelería sin preocuparse por el regreso o el estacionamiento. | Tip de acceso: Si van al centro, dejen el auto en el hotel. Las calles son estrechas y el tráfico local en días santos es pesado; caminar o usar transporte privado es mucho más eficiente."
    },
    "structuredData": {
      "durationDays": 3,
      "hotels": [
        {
          "name": "Anticavilla Hotel",
          "priceLevel": "$$$",
          "description": "El encuentro perfecto entre una villa italiana y el modernismo mexicano. Ubicado en una propiedad histórica con un jardín impecable y una alberca de diseño, es ideal para grupos que aprecian el arte, la exclusividad y un spa de clase mundial. Lujo contemporáneo y herencia histórica.",
          "tags": [],
          "id": "anticavilla-hotel",
          "sourceGuide": "cuernavaca-refugio-de-primavera-estilo"
        },
        {
          "name": "Hacienda de Cortés",
          "priceLevel": "$$",
          "description": "Dormir entre muros de piedra del siglo XVI y jardines que parecen sacados de una novela. Es la experiencia clásica de lujo en Morelos, con techos altos y una atmósfera señorial que transporta a otra época. Elegancia colonial y jardines épicos.",
          "tags": [],
          "id": "hacienda-de-cortes",
          "sourceGuide": "cuernavaca-refugio-de-primavera-estilo"
        },
        {
          "name": "Las Casas B+B",
          "priceLevel": "$",
          "description": "Un hotel boutique con alma de casa particular en el corazón del centro. Diseño minimalista, textiles locales y una cocina de autor excelente. Ideal si el grupo prefiere una atmósfera más íntima y moderna. Diseño sofisticado y atmósfera chic.",
          "tags": [],
          "id": "las-casas-bb",
          "sourceGuide": "cuernavaca-refugio-de-primavera-estilo"
        }
      ],
      "experiences": [
        {
          "name": "Degustación de comida mexicana",
          "description": "Entra en una casa local en Cuernavaca para una sesión de degustación guiada con 34 comidas y bebidas tradicionales mexicanas, cuidadosamente seleccionadas para mostrar la rica cultura culinaria del país.",
          "tags": [],
          "id": "degustacion-de-comida-mexicana"
        },
        {
          "name": "Visita a los jardines de México",
          "description": "A unos minutos de la ciudad, es el jardín floral más grande del mundo. Recorrer el jardín japonés o el italiano al atardecer es una experiencia visualmente impactante y muy instagrameable.",
          "tags": [],
          "id": "visita-a-los-jardines-de-mexico"
        },
        {
          "name": "Cata de mezcal o tequila en el jardín",
          "description": "Organizar una degustación privada en los jardines de su hotel. Cuernavaca se presta para largas sobremesas que comienzan con una cata guiada por un experto antes de la cena.",
          "tags": [],
          "id": "cata-de-mezcal-o-tequila-en-el-jardin"
        }
      ],
      "itinerary": [
        {
          "day": 1,
          "title": "Llegada a la eterna primavera",
          "items": [
            {
              "time": "14:00",
              "title": "Comida en Las Mañanitas (el clásico absoluto).",
              "description": ""
            },
            {
              "time": "17:30",
              "title": "Check-in y tarde de alberca con coctelería botánica.",
              "description": ""
            },
            {
              "time": "21:00",
              "title": "Cena de autor en House (dentro de Las Casas B+B).",
              "description": ""
            }
          ]
        },
        {
          "day": 2,
          "title": "Jardines y gastronomía de autor",
          "items": [
            {
              "time": "10:00",
              "title": "Visita a Jardines de México.",
              "description": ""
            },
            {
              "time": "15:00",
              "title": "Comida ligera en Verdesalvia (comida italiana-mediterránea).",
              "description": ""
            },
            {
              "time": "17:30",
              "title": "Sesión de masajes o hidromasaje en el spa del hotel.",
              "description": ""
            },
            {
              "time": "21:00",
              "title": "Cena de gala en Anticavilla (Restaurante Verdesalvia).",
              "description": ""
            }
          ]
        },
        {
          "day": 3,
          "title": "Brunch y despedida",
          "items": [
            {
              "time": "10:30",
              "title": "Brunch largo en Moscato o Hacienda de Cortés.",
              "description": ""
            },
            {
              "time": "12:30",
              "title": "Compras de artesanía fina o última caminata por el jardín Borda.",
              "description": ""
            },
            {
              "time": "15:00",
              "title": "Salida estratégica hacia CDMX.",
              "description": ""
            }
          ]
        }
      ],
      "logistics": {
        "transportOptions": [
          {
            "type": "Ruta",
            "description": "Desde CDMX, la ruta es por la Autopista del Sol. En Semana Santa, la clave es salir el jueves a las 7:00 AM o el viernes muy temprano. El tráfico en \"El Paso Express\" puede ser crítico; paciencia y un buen playlist son esenciales."
          },
          {
            "type": "Movilidad",
            "description": "Para un grupo de 4-6 personas, lo más Lagom es contratar una camioneta con chofer privado para los traslados a restaurantes o Jardines de México. Esto permite que todos disfruten de la coctelería sin preocuparse por el regreso o el estacionamiento."
          },
          {
            "type": "Tip de acceso",
            "description": "Si van al centro, dejen el auto en el hotel. Las calles son estrechas y el tráfico local en días santos es pesado; caminar o usar transporte privado es mucho más eficiente."
          }
        ]
      }
    }
  },
  {
    "slug": "puerto-vallarta-romance-relax",
    "locale": "es",
    "content": {
      "title": "LagomPlan — Puerto Vallarta (romance & relax)",
      "subtitle": "Donde la Sierra Madre se funde con el Pacífico. Una escapada diseñada para redescubrir el encanto del Viejo Vallarta, con el equilibrio perfecto entre lujo contemporáneo y alma colonial.",
      "kicker": "Guía curada · pareja & sofisticación",
      "intro": "",
      "tips": [
        "Reserva con antelación: En Semana Santa, los restaurantes con vista (como Le Kliff o The Iguana) se llenan meses antes. No dejes nada al azar si buscas esa mesa específica frente al mar.",
        "El look Vallarta: El clima es húmedo y cálido. Opta por lino y algodones ligeros. Para las cenas elegantes, un vestido midi o una guayabera de lino son el estándar del lujo relajado en la costa.",
        "Evita el malecón al mediodía: En estas fechas, el malecón se satura de turistas. Recórrelo muy temprano en la mañana o ya entrada la noche; es cuando realmente se aprecia la escultura y la arquitectura sin el ruido de las masas.",
        "DATO CURIOSO: Puerto Vallarta saltó a la fama mundial en 1963 gracias a la filmación de La Noche de la Iguana. Lo que hoy es un destino de lujo, era entonces un pequeño pueblo de pescadores accesible solo por mar. Richard Burton y Elizabeth Taylor pusieron a Vallarta en el mapa, y su legado de romance sigue siendo el alma de la Zona Romántica."
      ],
      "logisticsText": "Vuelo: Llegada al Aeropuerto Internacional de Puerto Vallarta (PVR). | Traslado: En Semana Santa, el aeropuerto es un caos. Reserva un transporte privado para que te esperen a la salida. Uber funciona bien en la ciudad, pero para salir del aeropuerto deberás cruzar el puente peatonal hacia la zona federal. | Movilidad: Si te hospedas en la Zona Romántica o el Centro, lo mejor es caminar. Para ir a la Zona Sur o Marina Vallarta, Uber es la opción más rápida y segura. Evita rentar auto si planeas quedarte en el casco histórico; el estacionamiento es casi inexistente."
    },
    "structuredData": {
      "durationDays": 4,
      "hotels": [
        {
          "name": "Casa Kimberly",
          "priceLevel": "$$$",
          "description": "El epítome del romance histórico. Fue el refugio de Elizabeth Taylor y Richard Burton; hoy es una joya boutique con puentes de mármol, tinas al aire libre y un servicio que te transporta a la época dorada de Hollywood. Lujo legendario y elegancia clásica.",
          "tags": [],
          "id": "casa-kimberly",
          "sourceGuide": "puerto-vallarta-romance-relax"
        },
        {
          "name": "Hotel Mousai",
          "priceLevel": "$$$",
          "description": "Vanguardia y diseño exclusivo en la Zona Sur. Un hotel \"Adults Only\" con una de las albercas infinity más espectaculares del mundo. Es el lugar para quienes buscan tecnología, vistas infinitas y una atmósfera vibrante y moderna. Modernidad audaz y vistas panorámicas.",
          "tags": [],
          "id": "hotel-mousai",
          "sourceGuide": "puerto-vallarta-romance-relax"
        },
        {
          "name": "Hotel Amapa",
          "priceLevel": "$$",
          "description": "Minimalismo contemporáneo en el corazón de la Zona Romántica. Un hotel boutique \"Adults Only\" que celebra el diseño mexicano con una estética limpia, textiles locales y una terraza perfecta para ver el atardecer sin pretensiones. Diseño \"smart\" y pulso local.",
          "tags": [],
          "id": "hotel-amapa",
          "sourceGuide": "puerto-vallarta-romance-relax"
        }
      ],
      "experiences": [
        {
          "name": "Navegación privada a Majahuitas",
          "description": "Evita los barcos turísticos masivos. Renta una panga de lujo o un yate pequeño para ir a las calas del sur. El agua es más clara, el entorno es selvático y la privacidad es el verdadero lujo de la jornada.",
          "tags": [],
          "id": "navegacion-privada-a-majahuitas"
        },
        {
          "name": "Atardecer en The Iguana",
          "description": "Cenar o tomar un coctel en el restaurante de Casa Kimberly. La vista de las cúpulas de la Iglesia de Guadalupe bajo el cielo rosado es, probablemente, el momento más romántico de todo el Pacífico mexicano.",
          "tags": [],
          "id": "atardecer-en-the-iguana"
        },
        {
          "name": "Visita al mercado y clase de cocina mexicana",
          "description": "Del mercado a la cocina, despierta tus sentidos con sabores atrevidos y un ambiente vibrante. Descubre la magia de la cultura mexicana con una divertida y auténtica aventura culinaria.",
          "tags": [],
          "id": "visita-al-mercado-y-clase-de-cocina-mexicana"
        }
      ],
      "itinerary": [
        {
          "day": 1,
          "title": "Atardecer y viejo Vallarta",
          "items": [
            {
              "time": "15:00",
              "title": "Check-in y brindis de bienvenida.",
              "description": ""
            },
            {
              "time": "18:30",
              "title": "Cócteles en la terraza de The Iguana (Casa Kimberly).",
              "description": ""
            },
            {
              "time": "21:00",
              "title": "Cena romántica en Tintoque (cocina de autor frente al río).",
              "description": ""
            }
          ]
        },
        {
          "day": 2,
          "title": "Mar, selva y calma",
          "items": [
            {
              "time": "10:00",
              "title": "Salida en bote privado desde Los Muertos hacia el sur.",
              "description": ""
            },
            {
              "time": "14:00",
              "title": "Comida de mariscos frescos en Casitas Maraika.",
              "description": ""
            },
            {
              "time": "17:00",
              "title": "Regreso al hotel y tiempo de descanso/alberca.",
              "description": ""
            },
            {
              "time": "20:30",
              "title": "Cena relajada en La Palapa (cenar con los pies en la arena).",
              "description": ""
            }
          ]
        },
        {
          "day": 3,
          "title": "Arte y jardines secretos",
          "items": [
            {
              "time": "10:00",
              "title": "Visita al Jardín Botánico de Vallarta (un oasis de paz).",
              "description": ""
            },
            {
              "time": "14:30",
              "title": "Brunch tardío en Bistro Teresa.",
              "description": ""
            },
            {
              "time": "17:00",
              "title": "Recorrido por las galerías del centro (Art Walk).",
              "description": ""
            },
            {
              "time": "21:00",
              "title": "Cena de gala en Café des Artistes.",
              "description": ""
            }
          ]
        },
        {
          "day": 4,
          "title": "Brunch y despedida",
          "items": [
            {
              "time": "10:00",
              "title": "Brunch en Coco’s Kitchen (un clásico local en la Zona Romántica).",
              "description": ""
            },
            {
              "time": "12:00",
              "title": "Última caminata por el muelle y compras de diseño local.",
              "description": ""
            },
            {
              "time": "14:30",
              "title": "Salida hacia el aeropuerto.",
              "description": ""
            }
          ]
        }
      ],
      "logistics": {
        "transportOptions": [
          {
            "type": "Vuelo",
            "description": "Llegada al Aeropuerto Internacional de Puerto Vallarta (PVR)."
          },
          {
            "type": "Traslado",
            "description": "En Semana Santa, el aeropuerto es un caos. Reserva un transporte privado para que te esperen a la salida. Uber funciona bien en la ciudad, pero para salir del aeropuerto deberás cruzar el puente peatonal hacia la zona federal."
          },
          {
            "type": "Movilidad",
            "description": "Si te hospedas en la Zona Romántica o el Centro, lo mejor es caminar. Para ir a la Zona Sur o Marina Vallarta, Uber es la opción más rápida y segura. Evita rentar auto si planeas quedarte en el casco histórico; el estacionamiento es casi inexistente."
          }
        ]
      }
    }
  },
  {
    "slug": "riviera-maya-roadtrip-de-semana-santa",
    "locale": "es",
    "content": {
      "title": "LagomPlan — Riviera Maya (roadtrip de Semana Santa)",
      "subtitle": "Una travesía de siete días diseñada para encontrar el lujo de la privacidad en la época más vibrante del año. El equilibrio exacto entre la energía del Caribe y el refugio de la selva.",
      "kicker": "Guía curada · Roadtrip familiar de temporada alta",
      "intro": "",
      "tips": [
        "Reserva TODO ahora: En Semana Santa, no existe el \"llegar a ver si hay mesa\". Restaurantes como Hartwood o Arca requieren reserva inmediata.",
        "El semáforo del sargazo: En marzo/abril el sargazo puede ser un factor. Descarga la app o sigue los reportes diarios de \"Red de Monitoreo del Sargazo de Quintana Roo\" para elegir la playa del día.",
        "Efectivo en pesos: Muchos cenotes y propinas en barcos no aceptan tarjeta. En Semana Santa, los cajeros de Tulum suelen quedarse sin efectivo rápido. Lleven lo necesario desde CDMX.",
        "DATO CURIOSO: ¿Sabías que el arrecife que corre frente a la Riviera Maya es el segundo más grande del mundo? Se llama el Gran Arrecife Maya (o Sistema Arrecifal Mesoamericano) y se extiende por más de 1,000 kilómetros. Nadar en él durante el amanecer es una de las experiencias más potentes que puedes vivir en este viaje."
      ],
      "logisticsText": "Vuelo: Si pueden, vuelen al nuevo Aeropuerto de Tulum (TQO). Les ahorrará el tráfico pesado que se forma entre Cancún y Playa del Carmen durante estas fechas. | Renta de auto: Indispensable una SUV. Durante Semana Santa hay más retenes y el tráfico en la carretera 307 puede ser lento; un vehículo cómodo y alto hace toda la diferencia. | Fricción cero: Salgan siempre antes de las 8:30 AM. En Semana Santa, quien llega tarde a un cenote o a una playa, llega a una fila. La regla de oro: \"aventura temprano, brunch largo después\"."
    },
    "structuredData": {
      "durationDays": 7,
      "hotels": [
        {
          "name": "Mayakoba",
          "priceLevel": "$$$",
          "description": "El refugio perfecto para los primeros días. Al ser una comunidad cerrada, Mayakoba te aísla por completo de las multitudes de Playa del Carmen. Las villas con alberca propia son ideales para que el adolescente tenga su espacio mientras ustedes disfrutan del silencio de los canales. Privacidad absoluta y logística impecable.",
          "tags": [],
          "id": "mayakoba",
          "sourceGuide": "riviera-maya-roadtrip-de-semana-santa"
        },
        {
          "name": "Hotel Esencia, Xpu-Há",
          "priceLevel": "$$$",
          "description": "Ubicado en una de las playas más hermosas y amplias de la zona. En Semana Santa, su exclusividad garantiza que la playa nunca se sienta saturada. Es el punto medio perfecto entre Playa del Carmen y Tulum. Lujo silencioso y la mejor playa de la Riviera.",
          "tags": [],
          "id": "hotel-esencia-xpu-ha",
          "sourceGuide": "riviera-maya-roadtrip-de-semana-santa"
        },
        {
          "name": "Habitas Tulum",
          "priceLevel": "$$",
          "description": "Si buscas el \"vibe\" de Tulum pero con orden. Sus tiendas de campaña de lujo en la zona de la selva ofrecen una desconexión total. Es visualmente increíble para un adolescente y tiene un enfoque de bienestar muy auténtico. Eco-diseño y sofisticación bohemia.",
          "tags": [],
          "id": "habitas-tulum",
          "sourceGuide": "riviera-maya-roadtrip-de-semana-santa"
        }
      ],
      "experiences": [
        {
          "name": "Río secreto",
          "description": "Al ser una reserva con grupos controlados y horarios estrictos, es la mejor forma de vivir la aventura subterránea sin sentir el peso de la temporada alta. La versión \"Plus\" incluye actividades que mantienen al adolescente en constante movimiento.",
          "tags": [],
          "id": "rio-secreto"
        },
        {
          "name": "Sian Ka’an (acceso por Muyil)",
          "description": "En lugar de entrar por la saturada zona hotelera de Tulum, entren por Muyil. Flotar por los canales milenarios en total silencio es el antídoto perfecto para el ruido de Semana Santa.",
          "tags": [],
          "id": "sian-kaan-acceso-por-muyil"
        },
        {
          "name": "Cenote Zapote (ruta de los cenotes)",
          "description": "Mientras todos se agolpan en los cenotes famosos de Tulum, este cenote en Puerto Morelos ofrece plataformas de saltos y una arquitectura natural impresionante con mucha menos gente.",
          "tags": [],
          "id": "cenote-zapote-ruta-de-los-cenotes"
        }
      ],
      "itinerary": [
        {
          "day": 1,
          "title": "El refugio de Mayakoba",
          "items": []
        },
        {
          "day": 1,
          "title": "Día 1: Arribo, check-in y cena de bienvenida en Zapote Bar.",
          "items": []
        },
        {
          "day": 2,
          "title": "Día 2: Mañana de kayak y snorkel. Comida en Aquí me quedo (pies en la arena).",
          "items": []
        },
        {
          "day": 3,
          "title": "Exploración subterránea",
          "items": [
            {
              "time": "09:00",
              "title": "Expedición en Río Secreto (reserva el primer turno).",
              "description": ""
            },
            {
              "time": "15:00",
              "title": "Comida en Ciudad Mayakoba o alrededores para evitar entrar al centro de Playa.",
              "description": ""
            },
            {
              "time": "18:00",
              "title": "Check-in en Xpu-Há.",
              "description": ""
            }
          ]
        },
        {
          "day": 4,
          "title": "El secreto de Xpu-Há",
          "items": [
            {
              "time": "10:00",
              "title": "Mañana de lectura y mar.",
              "description": ""
            },
            {
              "time": "14:00",
              "title": "Comida de mariscos en el hotel o en un club de playa privado.",
              "description": ""
            },
            {
              "time": "17:00",
              "title": "Tarde de spa para los padres, paddle board para el hijo.",
              "description": ""
            }
          ]
        },
        {
          "day": 5,
          "title": "Tulum & Sian Ka'an",
          "items": [
            {
              "time": "08:00",
              "title": "Ruinas de Tulum (es vital ser de los primeros en entrar).",
              "description": ""
            },
            {
              "time": "13:00",
              "title": "Comida en Hartwood (reserva con semanas de antelación).",
              "description": ""
            }
          ]
        },
        {
          "day": 6,
          "title": "Día 6: Tour privado por los canales de Sian Ka'an. Cena de despedida en Arca.",
          "items": []
        },
        {
          "day": 7,
          "title": "Despedida nutritiva",
          "items": [
            {
              "time": "10:00",
              "title": "Brunch en The Real Coconut.",
              "description": ""
            },
            {
              "time": "12:00",
              "title": "Compras finales en el pueblo de Tulum (lino y cerámica).",
              "description": ""
            },
            {
              "time": "15:00",
              "title": "Salida estratégica hacia el aeropuerto.",
              "description": ""
            }
          ]
        }
      ],
      "logistics": {
        "transportOptions": [
          {
            "type": "Vuelo",
            "description": "Si pueden, vuelen al nuevo Aeropuerto de Tulum (TQO). Les ahorrará el tráfico pesado que se forma entre Cancún y Playa del Carmen durante estas fechas."
          },
          {
            "type": "Renta de auto",
            "description": "Indispensable una SUV. Durante Semana Santa hay más retenes y el tráfico en la carretera 307 puede ser lento; un vehículo cómodo y alto hace toda la diferencia."
          },
          {
            "type": "Fricción cero",
            "description": "Salgan siempre antes de las 8:30 AM. En Semana Santa, quien llega tarde a un cenote o a una playa, llega a una fila. La regla de oro: \"aventura temprano, brunch largo después\"."
          }
        ]
      }
    }
  },
  {
    "slug": "valle-de-bravo-avandaro-aventura-en-familia",
    "locale": "es",
    "content": {
      "title": "LagomPlan — Valle de Bravo / Avándaro (aventura en familia)",
      "subtitle": "El refugio donde el bosque se encuentra con el agua. Una escapada diseñada para quemar adrenalina, explorar la naturaleza y disfrutar de la mejor gastronomía de montaña.",
      "kicker": "Guía curada · familia & aventura",
      "intro": "",
      "tips": [
        "Capas de Ropa: En Valle el clima es súper engañoso. De día el sol quema, pero en cuanto baja, la temperatura en el bosque cae drásticamente. Empaca chalecos o chamarras ligeras siempre, incluso en primavera.",
        "Reserva de Restaurantes: En Semana Santa, los lugares top se llenan. Reserva tus cenas con al menos 4 días de antelación, especialmente para grupos de cuatro o más.",
        "El “secret spot” de pan: No te vayas sin pasar por la panadería del hotel Rodavento o la del centro para llevarse pan de caja artesanal. Es el mejor recuerdo comestible del viaje.",
        "DATO CURIOSO: Valle de Bravo se llama así en honor a Nicolás Bravo, héroe de la Independencia, pero su nombre original era San Francisco del Valle de Temascaltepec. La represa que hoy vemos (el lago) se creó artificialmente en 1947 como parte de un sistema hidroeléctrico, transformando para siempre el paisaje de montaña en un puerto de altura."
      ],
      "logisticsText": "Ruta: Desde CDMX, la vía más rápida es por la Autopista Toluca-Zitácuaro (ramal Valle de Bravo). En Semana Santa, salgan antes de las 7:00 AM para evitar el nudo vial de Santa Fe y Toluca. | Movilidad: Lo más Lagom es llevar una SUV propia. Las calles de Valle y Avándaro son empedradas y empinadas; un vehículo con buena altura evitará complicaciones y te dará libertad para ir a las cascadas. | Tip de tráfico: Durante Semana Santa, evita mover el auto entre las 13:00 y las 16:00 en el centro de Valle. Uber es escaso; prioriza caminar o usar los taxis locales identificables."
    },
    "structuredData": {
      "durationDays": 5,
      "hotels": [
        {
          "name": "Hotel Rodavento",
          "priceLevel": "$$$",
          "description": "Lujo rústico-contemporáneo escondido en el bosque. Es el paraíso para los niños por su tirolesa, tiro con arco y lago propio, permitiendo a los padres relajarse en un spa de primer nivel integrado a la naturaleza. Aventura chic y bosque profundo.",
          "tags": [],
          "id": "hotel-rodavento",
          "sourceGuide": "valle-de-bravo-avandaro-aventura-en-familia"
        },
        {
          "name": "Hotel Avándaro Golf & Spa",
          "priceLevel": "$$",
          "description": "El corazón social de Avándaro. Ofrece una experiencia clásica familiar con alberca climatizada, canchas de tenis y cercanía a la zona comercial, ideal para quienes buscan comodidad y movimiento. Confort clásico y atmósfera familiar.",
          "tags": [],
          "id": "hotel-avandaro-golf-spa",
          "sourceGuide": "valle-de-bravo-avandaro-aventura-en-familia"
        },
        {
          "name": "Wander Cabins",
          "priceLevel": "$",
          "description": "Desconexión absoluta en \"tiny cabins\" de diseño alpino-contemporáneo. Ubicadas en terrenos amplios para garantizar privacidad total, son el refugio ideal para vivir el bosque sin distracciones tecnológicas (poca señal y sin Wi-Fi). Minimalismo y desconexión radical.",
          "tags": [],
          "id": "wander-cabins",
          "sourceGuide": "valle-de-bravo-avandaro-aventura-en-familia"
        }
      ],
      "experiences": [
        {
          "name": "Adrenalina y Tierra",
          "description": "",
          "tags": [],
          "id": "adrenalina-y-tierra"
        },
        {
          "name": "Vuelo en parapente",
          "description": "La actividad insignia de Valle. Volar en tándem sobre el lago al atardecer es una experiencia que los niños (mayores de 6-7 años) y adultos recordarán siempre por la sensación de libertad absoluta.",
          "tags": [],
          "id": "vuelo-en-parapente"
        },
        {
          "name": "Reserva Monte Alto",
          "description": "Un parque estatal perfecto para el senderismo o el ciclismo de montaña. Las rutas están bien marcadas y ofrecen miradores espectaculares para ver el despegue de los parapentes y toda la cuenca del lago.",
          "tags": [],
          "id": "reserva-monte-alto"
        },
        {
          "name": "Mañana de esquí o wakeboard",
          "description": "Rentar una lancha privada para practicar deportes acuáticos. El lago es el escenario ideal para que los peques aprendan a esquiar en un ambiente controlado antes de disfrutar de un picnic a bordo.",
          "tags": [],
          "id": "manana-de-esqui-o-wakeboard"
        }
      ],
      "itinerary": [
        {
          "day": 1,
          "title": "La llegada",
          "items": [
            {
              "time": "14:00",
              "title": "Comida en Los Girasoles (clásico familiar).",
              "description": ""
            },
            {
              "time": "17:00",
              "title": "Caminata por la calle principal de Avándaro.",
              "description": ""
            },
            {
              "time": "20:00",
              "title": "Pizza artesanal en Dipao.",
              "description": ""
            }
          ]
        },
        {
          "day": 2,
          "title": "Agua y tradición",
          "items": [
            {
              "time": "09:30",
              "title": "Visita a la Cascada Velo de Novia.",
              "description": ""
            },
            {
              "time": "11:30",
              "title": "Renta de lancha para esquí o paseo.",
              "description": ""
            },
            {
              "time": "15:00",
              "title": "Comida en La Michoacana (comida típica).",
              "description": ""
            },
            {
              "time": "18:30",
              "title": "Paseo por el centro histórico de Valle.",
              "description": ""
            }
          ]
        },
        {
          "day": 3,
          "title": "Bosque y altura",
          "items": [
            {
              "time": "09:00",
              "title": "Senderismo en Reserva Monte Alto.",
              "description": ""
            },
            {
              "time": "14:30",
              "title": "Brunch tardío en Mosecafé.",
              "description": ""
            },
            {
              "time": "17:00",
              "title": "Tarde de alberca o lectura.",
              "description": ""
            },
            {
              "time": "21:00",
              "title": "Cena en Da Ciro (italiano acogedor).",
              "description": ""
            }
          ]
        },
        {
          "day": 4,
          "title": "Adrenalina y vuelo",
          "items": [
            {
              "time": "10:00",
              "title": "Vuelo en Parapente (Salida desde el muelle o torre).",
              "description": ""
            },
            {
              "time": "14:00",
              "title": "Comida en Rancho Avándaro (ideal para que los niños corran).",
              "description": ""
            },
            {
              "time": "17:00",
              "title": "Clase de equitación o descanso.",
              "description": ""
            },
            {
              "time": "20:30",
              "title": "Cena de despedida en Hueso Valle o Nauta.",
              "description": ""
            }
          ]
        },
        {
          "day": 5,
          "title": "Silencio y regreso",
          "items": [
            {
              "time": "10:00",
              "title": "Brunch en Margarita Concept.",
              "description": ""
            },
            {
              "time": "12:00",
              "title": "Visita a la Gran Stupa de la Paz.",
              "description": ""
            },
            {
              "time": "14:00",
              "title": "Salida hacia CDMX (antes del pico de tráfico).",
              "description": ""
            }
          ]
        }
      ],
      "logistics": {
        "transportOptions": [
          {
            "type": "Ruta",
            "description": "Desde CDMX, la vía más rápida es por la Autopista Toluca-Zitácuaro (ramal Valle de Bravo). En Semana Santa, salgan antes de las 7:00 AM para evitar el nudo vial de Santa Fe y Toluca."
          },
          {
            "type": "Movilidad",
            "description": "Lo más Lagom es llevar una SUV propia. Las calles de Valle y Avándaro son empedradas y empinadas; un vehículo con buena altura evitará complicaciones y te dará libertad para ir a las cascadas."
          },
          {
            "type": "Tip de tráfico",
            "description": "Durante Semana Santa, evita mover el auto entre las 13:00 y las 16:00 en el centro de Valle. Uber es escaso; prioriza caminar o usar los taxis locales identificables."
          }
        ]
      }
    }
  },
  {
    "slug": "san-miguel-de-allende-parejas-terrazas",
    "locale": "es",
    "content": {
      "title": "LagomPlan — San Miguel de Allende (Parejas & Terrazas)",
      "subtitle": "Estética colonial, viñedos de altura y los mejores atardeceres de México. Una pausa diseñada para caminar, brindar y reconectar en el corazón del país.",
      "kicker": "Guía curada · Viaje de parejas",
      "intro": "",
      "tips": [
        "La regla de las puertas: No juzgues por la fachada; los mejores spots no tienen letreros. Asómate a los patios interiores tras las puertas pesadas de madera para encontrar el San Miguel auténtico, silencioso y sin multitudes.",
        "Break de Independencia: Programen un par de horas de exploración libre por separado el tercer día. Reencontrarse en la cena con historias nuevas mantiene la dinámica grupal fresca y evita el agotamiento de estar siempre juntos.",
        "Foto en la Parroquia: Evita el tumulto yendo en la \"Hora Azul\" (amanecer o 15 min tras el ocaso). Haz la toma desde la calle de Aldama; el encuadre con paredes ocre y la cúpula iluminada es mucho más sofisticado.",
        "DATO CURIOSO: La famosa Parroquia no fue diseñada por un arquitecto, sino por un maestro de obras local que se inspiró en postales de catedrales góticas europeas. Sus terrazas ofrecen la \"hora azul\" más larga y fotogénica del país."
      ],
      "logisticsText": "En coche desde CDMX: Un trayecto de 3.5 a 4 horas. Tip Lagom: Usa el libramiento para entrar a la ciudad y evita meterte al centro histórico con el coche; las calles son extremadamente estrechas y empedradas. | En autobús: Los servicios de lujo (ETN o Primera Plus) llegan a la terminal de SMA. De ahí, un Uber de 10 minutos te deja en tu hotel. | Movilidad: San Miguel se camina. Lleva zapatos cómodos. Para distancias largas o si llevan maletas, Uber funciona de manera excelente y económica."
    },
    "structuredData": {
      "durationDays": 4,
      "hotels": [
        {
          "name": "Rosewood San Miguel de Allende",
          "priceLevel": "$$$",
          "description": "Es el referente del lujo en la ciudad. Sus suites son amplias y el servicio es impecable. Para dos parejas, su bar en la terraza (Luna Rooftop) es el punto de reunión obligatorio.",
          "tags": [
            "El estándar de oro."
          ],
          "id": "rosewood-san-miguel-de-allende",
          "sourceGuide": "san-miguel-de-allende-parejas-terrazas"
        },
        {
          "name": "Hotel Casa Blanca 7",
          "priceLevel": "$$",
          "description": "Un refugio de lujo mediterráneo en el corazón de San Miguel. Su atmósfera de 5 estrellas combina la serenidad de sus jardines internos con amenidades de bienestar que invitan a la pausa total.",
          "tags": [
            "Sofisticación y calma absoluta."
          ],
          "id": "hotel-casa-blanca-7",
          "sourceGuide": "san-miguel-de-allende-parejas-terrazas"
        },
        {
          "name": "Selina San Miguel de Allende",
          "priceLevel": "$",
          "description": "No te dejes engañar por el nombre; sus \"Suites Privadas\" en la casona histórica son amplias, con mucho estilo y a una fracción del costo de los hoteles de gran lujo. La ubicación es inmejorable (a pasos de la Parroquia).",
          "tags": [
            "Smart Value en el centro."
          ],
          "id": "selina-san-miguel-de-allende",
          "sourceGuide": "san-miguel-de-allende-parejas-terrazas"
        }
      ],
      "experiences": [
        {
          "name": "Día de viñedos en Cuna de Tierra",
          "description": "A solo 40 minutos. Es la bodega más premiada de la zona. Una cata con maridaje entre los viñedos es la actividad perfecta para cuatro adultos.",
          "tags": [],
          "id": "dia-de-vinedos-en-cuna-de-tierra"
        },
        {
          "name": "Fábrica la Aurora",
          "description": "Un antiguo centro textil convertido en galerías de arte y diseño. Es ideal para caminar sin prisa, comprar decoración o simplemente inspirarse.",
          "tags": [],
          "id": "fabrica-la-aurora"
        },
        {
          "name": "Mañana de aguas termales",
          "description": "Visita a The Mayan Baths o Escondida Place. Pozas de agua caliente en entornos diseñados para la relajación, ideales para una mañana de \"reset\".",
          "tags": [],
          "id": "manana-de-aguas-termales"
        }
      ],
      "itinerary": [
        {
          "day": 1,
          "title": "Atardecer y Tejados",
          "items": [
            {
              "time": "15:00",
              "title": "Check-in y caminata suave hacia la Parroquia para la foto obligatoria.",
              "description": ""
            },
            {
              "time": "18:30",
              "title": "Drinks en Luna Rooftop (Rosewood) para ver cómo se ilumina la ciudad.",
              "description": ""
            },
            {
              "time": "21:00",
              "title": "Cena de bienvenida en The Restaurant (cocina de autor en un patio precioso).",
              "description": ""
            }
          ]
        },
        {
          "day": 2,
          "title": "Arte y Gastronomía",
          "items": [
            {
              "time": "11:00",
              "title": "Recorrido por Fábrica La Aurora.",
              "description": ""
            },
            {
              "time": "14:30",
              "title": "Comida larga en el mercado gastronómico Doce-18 Concept House.",
              "description": ""
            },
            {
              "time": "17:00",
              "title": "Tarde libre para explorar tiendas de diseño o descansar en el hotel.",
              "description": ""
            },
            {
              "time": "20:30",
              "title": "Cena en Quince Rooftop (considerado uno de los mejores rooftops del mundo).",
              "description": ""
            }
          ]
        },
        {
          "day": 3,
          "title": "Viñedos y Alrededores",
          "items": [
            {
              "time": "11:00",
              "title": "Roadtrip a Dolores Hidalgo y visita al viñedo Cuna de Tierra.",
              "description": ""
            },
            {
              "time": "14:00",
              "title": "Comida maridaje en el viñedo.",
              "description": ""
            },
            {
              "time": "18:00",
              "title": "Regreso a SMA. Paseo nocturno por el Parque Juárez.",
              "description": ""
            },
            {
              "time": "21:00",
              "title": "Mezcales y tapas en La Azotea.",
              "description": ""
            }
          ]
        },
        {
          "day": 4,
          "title": "Brunch y Despedida",
          "items": [
            {
              "time": "10:00",
              "title": "Brunch en Lavanda Café (prepárense para una pequeña fila, vale la pena por el café de especialidad).",
              "description": ""
            },
            {
              "time": "12:30",
              "title": "Últimas compras en el Mercado de Artesanías.",
              "description": ""
            },
            {
              "time": "14:00",
              "title": "Salida de regreso, con el espíritu renovado.",
              "description": ""
            }
          ]
        }
      ],
      "logistics": {
        "transportOptions": [
          {
            "type": "En coche desde CDMX",
            "description": "Un trayecto de 3.5 a 4 horas. Tip Lagom: Usa el libramiento para entrar a la ciudad y evita meterte al centro histórico con el coche; las calles son extremadamente estrechas y empedradas."
          },
          {
            "type": "En autobús",
            "description": "Los servicios de lujo (ETN o Primera Plus) llegan a la terminal de SMA. De ahí, un Uber de 10 minutos te deja en tu hotel."
          },
          {
            "type": "Movilidad",
            "description": "San Miguel se camina. Lleva zapatos cómodos. Para distancias largas o si llevan maletas, Uber funciona de manera excelente y económica."
          }
        ]
      }
    }
  },
  {
    "slug": "tepoztlan-romantic-edition",
    "locale": "es",
    "content": {
      "title": "LagomPlan — Tepoztlán (Romantic Edition)",
      "subtitle": "Una pausa mística bajo la sombra del Tepozteco. El equilibrio perfecto entre lujo sutil y tiempo para conectar.",
      "kicker": "Guía curada · Escapada en pareja",
      "intro": "",
      "tips": [
        "Zapatos: El fin del romance es un esguince. Tepoztlán es súper empedrado. Deja los tacones o zapatos de suela lisa; necesitas tenis con buen agarre o botas, incluso para ir a cenar.",
        "Magia entre semana: Si pueden, viajen de domingo a martes. El pueblo se transforma de un mercado ruidoso a un refugio de paz absoluta donde los hoteles bajan de precio hasta un 30%.",
        "El \"hack\" del Tepozteco: No subas a mediodía. El calor rebota en la piedra y la experiencia se vuelve agotadora. Inicia a las 8:30 AM; tendrás la cima casi para ti solo y una luz perfecta para fotos.",
        "DATO CURIOSO: Se dice que el valle tiene un magnetismo especial debido a los minerales de sus cerros, lo que ayuda a las parejas a sincronizar sus ritmos y relajarse. Es uno de los pocos lugares donde puedes dormir literalmente a la sombra de una pirámide milenaria."
      ],
      "logisticsText": "Tepoztlán es una pausa cercana a la CDMX, pero requiere estrategia para que el trayecto sea parte del descanso y no una fuente de estrés. Aquí te damos las mejores opciones:  | En coche propio: Libertad y precaución: | Autobús Ejecutivo: El lujo de no manejar Transporte Privado / App | Uber/Didi: Es posible llegar desde la CDMX, pero ten cuidado: es muy difícil encontrar un Uber de regreso desde Tepoztlán hacia la Ciudad de México. | Recomendación: Si no quieres manejar, es mejor contratar un servicio de transporte privado de confianza o usar el autobús ejecutivo para garantizar un regreso sin complicaciones."
    },
    "structuredData": {
      "durationDays": 3,
      "hotels": [
        {
          "name": "Amomoxtli",
          "priceLevel": "$$$",
          "description": "Es el estándar de oro del romance en Tepoztlán. Jardines impecables y una de las mejores albercas de México.",
          "tags": [
            "Cero ruido, máximo lujo."
          ],
          "id": "amomoxtli",
          "sourceGuide": "tepoztlan-romantic-edition"
        },
        {
          "name": "Posada del Tepozteco",
          "priceLevel": "$$",
          "description": "Ubicación histórica con la mejor vista al cerro desde la terraza. Ideal para desayunos largos.",
          "tags": [
            "El corazón del pueblo."
          ],
          "id": "posada-del-tepozteco",
          "sourceGuide": "tepoztlan-romantic-edition"
        },
        {
          "name": "Hotel Boutique Casa Fernanda",
          "priceLevel": "$$",
          "description": "Servicio impecable y un spa de primer nivel diseñado para parejas. Su restaurante, La Veladora, es imperdible.",
          "tags": [
            "Wellness y gastronomía."
          ],
          "id": "hotel-boutique-casa-fernanda",
          "sourceGuide": "tepoztlan-romantic-edition"
        }
      ],
      "experiences": [
        {
          "name": "Conexión sin prisas",
          "description": "",
          "tags": [],
          "id": "conexion-sin-prisas"
        },
        {
          "name": "Ascenso místico al Tepozteco",
          "description": "Una caminata de 1.5 horas. La clave es el horario (ver Tips) para evitar la multitud.",
          "tags": [],
          "id": "ascenso-mistico-al-tepozteco"
        },
        {
          "name": "Ritual de temazcal en pareja",
          "description": "Una experiencia de purificación tradicional. Muchos hoteles lo ofrecen de forma privada.",
          "tags": [],
          "id": "ritual-de-temazcal-en-pareja"
        },
        {
          "name": "Cena en la terraza al atardecer",
          "description": "Degustación de cocina contemporánea de Morelos con vista a las montañas iluminadas.",
          "tags": [],
          "id": "cena-en-la-terraza-al-atardecer"
        }
      ],
      "itinerary": [
        {
          "day": 1,
          "title": "Aterrizaje y atmósfera",
          "items": [
            {
              "time": "15:00",
              "title": "Check-in en Amomoxtli.",
              "description": ""
            },
            {
              "time": "18:00",
              "title": "Caminata ligera por el centro para comprar artesanías de madera y un \"Itacate\" tradicional.",
              "description": ""
            },
            {
              "time": "20:00",
              "title": "Cena romántica en el hotel para evitar traslados nocturnos.",
              "description": ""
            }
          ]
        },
        {
          "day": 2,
          "title": "El highlight",
          "items": [
            {
              "time": "08:30",
              "title": "Inicio del ascenso al cerro (antes de que suba la temperatura y el turismo masivo).",
              "description": ""
            },
            {
              "time": "13:00",
              "title": "Comida relajada en el mercado: cecina y quesadillas de flores locales.",
              "description": ""
            },
            {
              "time": "17:00",
              "title": "Sesión de masaje o Temazcal. Tiempo de lectura junto a la alberca.",
              "description": ""
            },
            {
              "time": "20:30",
              "title": "Vino en la terraza bajo las estrellas.",
              "description": ""
            }
          ]
        },
        {
          "day": 3,
          "title": "Cierre suave",
          "items": [
            {
              "time": "10:00",
              "title": "Brunch largo y lento.",
              "description": ""
            },
            {
              "time": "11:30",
              "title": "Visita al Ex-Convento de la Natividad (silencio y arquitectura).",
              "description": ""
            },
            {
              "time": "13:30",
              "title": "Salida hacia CDMX para evitar el \"nudo\" de tráfico de las 4 PM.",
              "description": ""
            }
          ]
        }
      ],
      "logistics": {
        "transportOptions": [
          {
            "type": "Tepoztlán es una pausa cercana a la CDMX, pero requiere estrategia para que el trayecto sea parte del descanso y no una fuente de estrés. Aquí te damos las mejores opciones",
            "description": ""
          },
          {
            "type": "En coche propio",
            "description": "Libertad y precaución:"
          },
          {
            "type": "Autobús Ejecutivo",
            "description": "El lujo de no manejar Transporte Privado / App"
          },
          {
            "type": "Uber/Didi",
            "description": "Es posible llegar desde la CDMX, pero ten cuidado: es muy difícil encontrar un Uber de regreso desde Tepoztlán hacia la Ciudad de México."
          },
          {
            "type": "Recomendación",
            "description": "Si no quieres manejar, es mejor contratar un servicio de transporte privado de confianza o usar el autobús ejecutivo para garantizar un regreso sin complicaciones."
          }
        ]
      }
    }
  },
  {
    "slug": "tulum-solo-social-edition",
    "locale": "es",
    "content": {
      "title": "LagomPlan — Tulum (Solo & Social Edition)",
      "subtitle": "Selva, mar turquesa y el beat de la noche. Una pausa diseñada para reconectar contigo misma sin renunciar a la fiesta más icónica del Caribe.",
      "kicker": "Guía curada · Solo Trip",
      "intro": "",
      "tips": [
        "Efectivo en mano: Muchos lugares en la playa \"pierden la señal\" de la terminal o solo aceptan efectivo. Lleva pesos mexicanos; el tipo de cambio en dólares dentro de los comercios siempre te perjudicará.",
        "Dress Code \"Sand-Chic\": Olvida los tacones; Tulum es arena y raíces. Un par de sandalias bonitas o incluso ir descalza es la norma, incluso en las cenas más caras.",
        "Repelente y bloqueador: Usa versiones biodegradables. Los mosquitos en la selva son implacables al atardecer y los cenotes prohíben químicos que dañen el agua.",
        "DATO CURIOSO: Tulum es la única ciudad maya construida frente al mar. Su nombre original era \"Zama\", que significa \"amanecer\", porque su ubicación permite ver el primer rayo de sol que toca tierra mexicana."
      ],
      "logisticsText": "Vuelo: Puedes llegar vía el Aeropuerto de Cancún (CUN) o el nuevo Aeropuerto de Tulum (TQY), que queda mucho más cerca de la zona hotelera. | Traslado: Lo más seguro para una mujer sola es un traslado privado pre-pagado. Si vas en plan \"smart\", el bus ADO es excelente, limpio y seguro; te deja en el pueblo y de ahí tomas un taxi. | Movilidad: Renta una bicicleta o scooter. Los taxis en Tulum son excesivamente caros y el tráfico en la zona hotelera es lento; la bici te da la libertad de moverte a tu ritmo."
    },
    "structuredData": {
      "durationDays": 5,
      "hotels": [
        {
          "name": "Our Habitas",
          "priceLevel": "$$$",
          "description": "Lujo sustentable en tiendas de campaña de alto diseño frente al mar. Es ideal para una mujer sola por su ambiente comunitario, cenas compartidas y rituales de bienvenida.",
          "tags": [
            "Eco-chic y conexión."
          ],
          "id": "our-habitas",
          "sourceGuide": "tulum-solo-social-edition"
        },
        {
          "name": "Dune Boutique Hotel",
          "priceLevel": "$$",
          "description": "Un santuario diseñado para el bienestar, donde puedes empezar el día con yoga frente al mar y explorarlo en bicicleta, para luego refugiarte en una atmósfera de diseño mediterráneo que se funde con la selva y el Caribe.",
          "tags": [
            "Bienestar y lujo frente al mar."
          ],
          "id": "dune-boutique-hotel",
          "sourceGuide": "tulum-solo-social-edition"
        },
        {
          "name": "Astral Tulum",
          "priceLevel": "$",
          "description": "Ubicado directamente en la zona hotelera (playa), ofrece suites privadas con estilo. Refugio perfecto para quienes buscan la estética del Caribe sin sacrificar la comodidad de servicios completos y una cocina inclusiva.",
          "tags": [
            "Beachfront y versátil."
          ],
          "id": "astral-tulum",
          "sourceGuide": "tulum-solo-social-edition"
        }
      ],
      "experiences": [
        {
          "name": "Cenotes al amanecer",
          "description": "Visita el Cenote Dos Ojos o Gran Cenote a las 8:00 AM. Estar sola en el agua cristalina antes de que lleguen los tours es la definición de paz absoluta.",
          "tags": [],
          "id": "cenotes-al-amanecer"
        },
        {
          "name": "Beach Club Day",
          "description": "Pasa la tarde en Papaya Playa Project. Es el equilibrio perfecto: música de DJ de clase mundial, buenos cocteles y una atmósfera donde estar sola se siente totalmente natural.",
          "tags": [],
          "id": "beach-club-day"
        },
        {
          "name": "Sanación de sonido (sound healing)",
          "description": "Participa en una ceremonia en la selva. Es la experiencia mística obligatoria para equilibrar la energía después de una noche de fiesta.",
          "tags": [],
          "id": "sanacion-de-sonido-sound-healing"
        }
      ],
      "itinerary": [
        {
          "day": 1,
          "title": "El Aterrizaje",
          "items": [
            {
              "time": "15:00",
              "title": "Check-in y primera caminata por la arena.",
              "description": ""
            },
            {
              "time": "18:00",
              "title": "Sunset drink en Azulik (vistas increíbles).",
              "description": ""
            }
          ]
        },
        {
          "day": 2,
          "title": "Agua y calma",
          "items": [
            {
              "time": "08:30",
              "title": "Exploración de cenotes.",
              "description": ""
            },
            {
              "time": "13:00",
              "title": "Comida de tacos gourmet en Taquería La Eufemia.",
              "description": ""
            },
            {
              "time": "20:00",
              "title": "Cena tranquila en Hartwood (reserva con tiempo).",
              "description": ""
            }
          ]
        },
        {
          "day": 3,
          "title": "Reset y social",
          "items": [
            {
              "time": "10:00",
              "title": "Sesión de yoga y spa.",
              "description": ""
            },
            {
              "time": "15:00",
              "title": "Tarde de Beach Club en Gitano Beach.",
              "description": ""
            },
            {
              "time": "22:00",
              "title": "Cena y baile en Casa Jaguar.",
              "description": ""
            }
          ]
        },
        {
          "day": 4,
          "title": "Ruinas y noche",
          "items": [
            {
              "time": "09:00",
              "title": "Visita a las Ruinas de Tulum (antes del calor).",
              "description": ""
            },
            {
              "time": "14:00",
              "title": "Comida en el pueblo para conocer el lado local.",
              "description": ""
            },
            {
              "time": "21:00",
              "title": "Noche de fiesta en Papaya Playa Project.",
              "description": ""
            }
          ]
        },
        {
          "day": 5,
          "title": "Cierre suave",
          "items": [
            {
              "time": "10:00",
              "title": "Brunch largo frente al mar.",
              "description": ""
            },
            {
              "time": "12:00",
              "title": "Compras de diseño local en las boutiques de la carretera y salida.",
              "description": ""
            }
          ]
        }
      ],
      "logistics": {
        "transportOptions": [
          {
            "type": "Vuelo",
            "description": "Puedes llegar vía el Aeropuerto de Cancún (CUN) o el nuevo Aeropuerto de Tulum (TQY), que queda mucho más cerca de la zona hotelera."
          },
          {
            "type": "Traslado",
            "description": "Lo más seguro para una mujer sola es un traslado privado pre-pagado. Si vas en plan \"smart\", el bus ADO es excelente, limpio y seguro; te deja en el pueblo y de ahí tomas un taxi."
          },
          {
            "type": "Movilidad",
            "description": "Renta una bicicleta o scooter. Los taxis en Tulum son excesivamente caros y el tráfico en la zona hotelera es lento; la bici te da la libertad de moverte a tu ritmo."
          }
        ]
      }
    }
  }
]

/**
 * Returns all hotels across all guides, flattened into a single array.
 * Useful for the Hotels page to display all options with their source guide.
 */
export function extractHotelsFromGuides(guideList: Guide[] = guides): Hotel[] {
  return guideList.flatMap((guide) => guide.structuredData.hotels)
}

/**
 * Find a single guide by slug.
 */
export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug)
}

/**
 * Returns all guides for a given locale.
 */
export function getGuidesByLocale(locale: string): Guide[] {
  return guides.filter((g) => g.locale === locale)
}