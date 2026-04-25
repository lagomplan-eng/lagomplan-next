import type { CityGuide } from '../types'

const CORAL = '#E1615B'
const FJORD = '#2D4F6C'
const SAGE  = '#6B8F86'
const PINE  = '#0F3A33'
const ACCENT = '#2D4F6C'

export const es: CityGuide = {
  id:"hou",
  city:"Houston",
  country:"Estados Unidos",
  state:"Texas",
  flag:"🇺🇸",
  accent: ACCENT,

  tags:["Fútbol","Gastronomía","Diversidad","Sede co-anfitriona"],

  stadium:{ name:"Houston Stadium (NRG Stadium)", capacity:"~72,220", area:"NRG Park — Medical Center corridor" },

  headline:"La ciudad más diversa de Texas recibe al torneo más diverso de la historia. La aritmética tiene sentido.",
  description:"La ciudad más diversa de Texas recibe al torneo más diverso de la historia. La aritmética tiene sentido. Houston llega al Mundial con siete partidos, techo retráctil, climatización interior y Portugal jugando dos veces aquí. Para una ciudad donde se hablan más de 145 lenguas, casi cada bandera que entra al estadio tiene una comunidad local detrás.",

  scores:[
    { label:"Ambiente",     value:5 },
    { label:"Fútbol local", value:4 },
    { label:"Gastronomía",  value:4 },
    { label:"Transporte",   value:4 },
    { label:"Seguridad",    value:4 },
    { label:"Costo",        value:3 },
  ],

  matches:[
    { id:"m1", date:"14 Jun", day:"Dom", time:"12:00 CT", teams:[{name:"Alemania",flag:"🇩🇪"},{name:"Curazao",flag:"🇨🇼"}], stadium:"Houston Stadium", tag:"Grupo E — apertura de la sede", highlight:false },
    { id:"m2", date:"17 Jun", day:"Mié", time:"12:00 CT", teams:[{name:"Portugal",flag:"🇵🇹"},{name:"Playoff Intercontinental 1",flag:""}], stadium:"Houston Stadium", tag:"Portugal en Houston", highlight:true },
    { id:"m3", date:"20 Jun", day:"Sáb", time:"12:00 CT", teams:[{name:"Países Bajos",flag:"🇳🇱"},{name:"Repechaje UEFA B",flag:""}], stadium:"Houston Stadium", tag:"Grupo F", highlight:false },
    { id:"m4", date:"23 Jun", day:"Mar", time:"12:00 CT", teams:[{name:"Portugal",flag:"🇵🇹"},{name:"Uzbekistán",flag:"🇺🇿"}], stadium:"Houston Stadium", tag:"Grupo K — Portugal define el grupo", highlight:true },
    { id:"m5", date:"26 Jun", day:"Vie", time:"19:00 CT", teams:[{name:"Cabo Verde",flag:"🇨🇻"},{name:"Arabia Saudita",flag:"🇸🇦"}], stadium:"Houston Stadium", tag:"Partido nocturno", highlight:false },
    { id:"m6", date:"29 Jun", day:"Lun", time:"12:00 CT", teams:[{name:"Ronda de 32",flag:""},{name:"1°C vs. 2°F",flag:""}], stadium:"Houston Stadium", tag:"Fase eliminatoria", highlight:false },
    { id:"m7", date:"4 Jul",  day:"Sáb", time:"12:00 CT", teams:[{name:"Ronda de 16",flag:"🇺🇸"},{name:"Por definir",flag:"🎆"}], stadium:"Houston Stadium", tag:"Día de la Independencia", highlight:true },
  ],

  manifesto:{
    stadiumInfo:[
      { label:"Estadio FIFA", value:"Houston Stadium (NRG Stadium)" },
      { label:"Aforo",        value:"~72,220 — configuración FIFA" },
      { label:"Clima",        value:"Días: 33–37°C · Humedad tropical · Interior con techo retráctil y sistema de climatización — condiciones controladas dentro del recinto en todos los partidos" },
      { label:"Partidos",     value:"7 confirmados — 5 grupos + 1 Ronda de 32 + 1 Ronda de 16" },
      { label:"Calendario",   value:"Portugal juega DOS partidos en Houston (17 y 23 de junio). Si avanza, regresa en fase de eliminación." },
      { label:"Aeropuertos",  value:"IAH — George Bush Intercontinental · 35 km al norte del estadio · HOU — William P. Hobby Airport · 13 km al sur" },
    ],
    body:"Houston es la ciudad más étnicamente diversa de Estados Unidos — más de 145 lenguas se hablan en el área metropolitana. Para un torneo de 48 naciones, eso significa que casi cada bandera que entra al estadio tiene una comunidad local detrás. Alemania, Portugal, Países Bajos: todas tienen representación orgánica en la ciudad sin necesidad de que nadie vuele desde Europa. El Houston Dynamo tiene una de las aficiones más leales de la MLS y el NRG Stadium ya tiene historia mundialista — fue sede del torneo en 1994. La escena de fútbol latino en Houston, impulsada por la segunda mayor comunidad mexicana de Estados Unidos, funciona independientemente del Mundial.",
    lagomNote:"Portugal juega dos veces en Houston y ambos partidos arrancan al mediodía (12:00 CT). La comunidad lusa del área metropolitana — y la diáspora latinoamericana que sigue a Portugal por Cristiano Ronaldo — tiene Houston como punto de concentración esas dos semanas. Si Portugal avanza, puede volver en fase de eliminación. Reserva pensando en el 17 y 23 de junio como bloque, no como fechas aisladas.",
  },

  vibe:{
    body:"Houston es la ciudad más diversa de Estados Unidos y eso no es una frase de folleto: más de 145 lenguas se hablan en el área metropolitana. Para un Mundial de 48 naciones, eso significa que Alemania, Portugal, Países Bajos, Cabo Verde y Arabia Saudita tienen comunidades reales en la ciudad antes de que aterrice el primer vuelo de aficionados. La escena gastronómica es una de las más subestimadas del país: más restaurantes de James Beard por habitante que Chicago, la mayor concentración de cocina vietnamita fuera de Vietnam en el hemisferio occidental y barbecue tejana seria. Más accesible que las costas, comparable a Dallas y Atlanta, Houston tiene suficiente inventario hotelero para amortiguar mejor el impacto del torneo.",
    lagomNote:"Cuatro de los cinco partidos de grupos arrancan al mediodía hora local. El estadio climatizado absorbe el calor de junio en Texas — pero el exterior no. Llega temprano, hidratado y con ropa ligera.",
  },

  neighborhoods:[
    { name:"Midtown Houston / Museum District", vibe:"El Midtown de Houston combina acceso directo al METRORail (estaciones McGowen y Wheeler en la línea Roja, que va al estadio) con la mayor concentración de restaurantes y bares de la ciudad por kilómetro cuadrado. El Museum District, contiguo, tiene el corredor de museos más denso del sur de Estados Unidos y hoteles boutique a precios más razonables que el Downtown. Al estadio en METRORail: 12 minutos directos.", best_for:"Fan WC", walk_to_stadium:"12 min directos en METRORail Red Line", lagomNote:null },
    { name:"Montrose", vibe:"El barrio más ecléctico e independiente de Houston: galerías de arte, cafeterías de especialidad, librerías de segunda mano y la escena de restaurantes más interesante de la ciudad. Conecta con el METRORail por la estación Wheeler (línea Roja). Para el fan que quiere el Houston real entre partidos de Alemania y Portugal.", best_for:"Carácter", walk_to_stadium:"Wheeler Station + Red Line hacia NRG Park", lagomNote:null },
    { name:"Mahatma Gandhi District / Westheimer", vibe:"El corredor de Westheimer en el suroeste de Houston tiene la mayor concentración de restaurantes latinoamericanos, del Medio Oriente y del sur de Asia de la ciudad. La comunidad portuguesa de Houston, aunque pequeña, tiene sus puntos de reunión aquí. Para el fan de Portugal que quiere comer, beber y ver los partidos rodeado de gente que entiende lo que está pasando.", best_for:"Portugal / Latinoamérica", walk_to_stadium:"Conexión hacia METRORail por Wheeler o viaje corto en rideshare", lagomNote:null },
    { name:"Downtown Houston", vibe:"El downtown de Houston es funcional para negocios y tiene buenos hoteles de cadena, pero muere a las 6pm. Sin vida de barrio, sin restaurantes informales accesibles caminando, sin bares de partido con atmósfera. El METRORail sale desde aquí al estadio, pero no hay razón para quedarse en el centro si Midtown o Montrose están a diez minutos.", best_for:"Evitar como base", walk_to_stadium:"METRORail directo, pero poca vida de barrio", lagomNote:"Evítalo como base si buscas ambiente entre partidos. Midtown y Montrose resuelven mejor la ciudad." },
  ],

  stays:[
    { name:"Hotel Zaza Houston", area:"Museum District / Montrose", price:"$$$", priceCAD:"$220–400 USD/noche (periodo mundialista)", tags:["Boutique","Piscina","Museum District"], note:"El hotel más personalidad de Houston: habitaciones temáticas, piscina con cabañas y un restaurante que funciona para el desayuno previo al partido de mediodía y la cena de celebración de la noche. Tres cuadras del METRORail en la estación Museum District.", best_for:"Carácter", url:"https://booking.stay22.com/lagomplan/2aSmYzQyvT" },
    { name:"Houston House Apartments", area:"Midtown", price:"$$", priceCAD:"$90–180 USD/noche (periodo mundialista)", tags:["Apartamentos","Cocina","METRORail cerca"], note:"Para estancias de varios días, los apartamentos de Midtown con cocina y acceso al METRORail son la opción más eficiente económicamente. Plataformas como Airbnb tienen buena oferta en el corredor de Midtown a precios notablemente más bajos que los hoteles de cadena.", best_for:"Presupuesto", url:"" },
    { name:"Post Oak Hotel at Uptown Houston", area:"Galleria / Uptown", price:"$$$$", priceCAD:"$480–900 USD/noche (periodo mundialista)", tags:["Lujo","Spa","Uptown"], note:"El hotel de lujo más ambicioso abierto en Houston en la última década: dos restaurantes de Michelin, spa de 3,500 metros cuadrados y la mejor vista al skyline de Uptown. Para la noche de la Ronda de 16 del 4 de julio — el partido del mediodía da tiempo a llegar al hotel antes del atardecer.", best_for:"Lujo", url:"https://www.booking.com/hotel/us/the-post-oak.html" },
  ],

  logistics:{
    transport:[
      { icon:"✈", title:"Llegar a Houston — IAH / HOU", text:"IAH — George Bush Intercontinental está 35 km al norte del estadio. METRO Route 102 Express hasta el centro, luego Red Line al estadio: ~50 minutos total. Uber directo desde IAH al estadio: ~40 minutos y $45–65 USD. HOU — William P. Hobby Airport está a 13 km al sur; bus Route 40 hasta Fannin South + Red Line a NRG Park: ~30 minutos, $2.50." },
      { icon:"🚇", title:"Ruta maestra — METRORail Red Line", text:"METRORail Red Line → NRG Park Station, a 2 minutos a pie del estadio. La línea Roja sale desde Main Street Square en el downtown, recorre Midtown y el Medical Center, y llega al NRG con una parada prácticamente en la puerta. Frecuencia en días de partido: cada 6 minutos. Tarifa: $1.25 con tarjeta Q Card." },
      { icon:"🏟", title:"Al estadio el día del partido", text:"NRG Stadium tiene una de las rutas de tránsito público más directas de cualquier sede texana del torneo. Desde Midtown son ~12 minutos en METRORail; desde Museum District, ~8 minutos. Sin transbordo, sin conjeturas y con salida post-partido más limpia que Uber." },
      { icon:"⚠️", title:"Error crítico — ignorar el calor exterior", text:"El estadio tiene A/C — la calle no. La fila de seguridad exterior al NRG en junio a las 10:30am con humedad del Golfo de México puede ser más dura que cualquier partido dentro del recinto. Hidratación antes de salir del hotel, ropa ligera, protector solar. El estadio climatizado es el premio — hay que merecerlo llegando bien equipado.", isWarning:true },
    ],
    timings:[
      { label:"Desde Midtown (McGowen) en METRORail", value:"~12 min" },
      { label:"Desde Museum District en METRORail",   value:"~8 min" },
      { label:"Desde HOU en bus + METRORail",         value:"~30 min" },
      { label:"Uber desde Midtown",                   value:"15–25 min · post-partido con espera larga" },
    ],
    matchDayCronologia:{
      matchName:"17 Jun · Portugal · 12:00 CT",
      steps:[
        { time:"H-3:00", text:"Desayuna en Midtown antes de las 9am. Los partidos de mediodía no dan margen para improvisar el desayuno." },
        { time:"H-2:00", text:"METRORail desde tu estación. A las 10am el calor exterior ya está activo." },
        { time:"H-1:30", text:"Llegada al estadio. Puertas abiertas 90 minutos antes. Dentro: aire acondicionado." },
        { time:"H-0:30", text:"En tu asiento. Boleto digital listo." },
        { time:"H+0:00", text:"Partido." },
        { time:"H+1:45", text:"METRORail de regreso. Primera salida. No hay razón para quedarse en el exterior." },
      ],
    },
    timing:"NRG Stadium tiene una de las rutas de tránsito público más directas de cualquier sede texana del torneo. El METRORail Red Line conecta el centro, Midtown y el Museum District con el estadio en línea recta. Sin transbordo, sin conjeturas.",
    cost:"Más accesible que las costas, comparable a Dallas y Atlanta. Los precios suben en los partidos de Portugal y el 4 de julio, pero Houston tiene suficiente inventario hotelero para amortiguar el impacto mejor que ciudades más compactas.",
  },

  vibeCards:[
    { title:"FIFA Fan Festival™ — Discovery Green", type:"Fan fest oficial", typeColor:CORAL, desc:"El Fan Fest de Houston se instala en Discovery Green, el parque urbano en el corazón del downtown junto al George R. Brown Convention Center. Pantallas de gran formato, programación cultural y acceso por METRORail (estación Bell o Preston en la línea Roja). Para los partidos de mediodía, el parque tiene zonas de sombra y aspersores de agua — infraestructura diseñada para el calor de Houston en cualquier mes del año.", tag:"Sin boleto OK" },
    { title:"Discovery Green (Downtown)", type:"Pantalla exterior", typeColor:FJORD, desc:"El parque urbano junto al George R. Brown Convention Center — donde está el Fan Fest oficial — tiene también zonas exteriores al perímetro que permanecen activas con pantallas informales y food trucks. Para el fan que llega después de que el registro del Fan Fest se agotó, el perímetro de Discovery Green es el segundo anillo natural.", tag:"Downtown" },
    { title:"Midtown Park", type:"Watch party", typeColor:SAGE, desc:"El parque de Midtown Houston tiene una tradición de watch parties para partidos de la CONCACAF y torneos internacionales. La comunidad mexicana de Midtown activa el parque para los partidos de El Tri con pantallas portátiles y ambiente de plaza. A dos cuadras del METRORail.", tag:"Local" },
    { title:"Kemah Boardwalk", type:"Waterfront", typeColor:PINE, desc:"A 40 minutos al sureste de Houston por la I-45, el paseo marítimo de Kemah tiene pantallas en sus terrazas frente a la bahía de Galveston. Para el fan con partido al mediodía que quiere después del partido bajar al golfo y ver la transmisión de la tarde con el agua de fondo — la opción más alejada del caos de la ciudad central.", tag:"Golfo" },
    { title:"Richmond Arms Pub", type:"Pub inglés", typeColor:"#1A3A5C", desc:"El pub inglés más veterano de Houston, con décadas de historia transmitiendo Premier League y fútbol internacional. Para los partidos de Alemania (14 de junio), Países Bajos (20 de junio) y Portugal (17 y 23 de junio), es el punto de reunión de la comunidad europea de la ciudad — con pantallas en todos los rincones y un ambiente que sabe exactamente lo que está viendo. Qué pedir: Scotch egg + pinta de Fuller's London Pride. Vibe: Pub inglés auténtico, el más experimentado en fútbol internacional de Houston.", tag:"Westheimer" },
    { title:"Clé Houston", type:"Bar con terraza", typeColor:"#5A3A2A", desc:"Bar con terraza exterior y pantallas de gran formato. Para el partido nocturno de Cabo Verde vs. Arabia Saudita (26 de junio, 19:00 CT), la terraza de Clé funciona mejor que estar dentro — la temperatura de Midtown a las 7pm en junio ya ha bajado lo suficiente para disfrutar del exterior. Cocina de bar con opciones más interesantes que el promedio de los sports bars de la ciudad. Qué pedir: Flatbread de la casa + cóctel de temporada. Vibe: Midtown animado, terraza activa, pantalla siempre encendida.", tag:"Midtown" },
  ],

  food:[
    { dish:"Richmond Arms Pub",         where:"Westheimer — scotch egg + pinta de Fuller's London Pride; pub inglés auténtico con décadas transmitiendo fútbol internacional", price:"$$",  type:"Pre-partido" },
    { dish:"Clé Houston",               where:"Midtown — flatbread de la casa + cóctel de temporada; terraza activa para el partido nocturno de Cabo Verde vs. Arabia Saudita",      price:"$$$", type:"Terraza" },
    { dish:"Phoenix on Westheimer",     where:"Montrose / Westheimer — fish & chips + Guinness o IPA local; pub futbolero serio y primer lugar que se llena para Portugal",          price:"$$",  type:"Portugal" },
    { dish:"Cocina vietnamita",         where:"Bellaire Boulevard — Chinese-Vietnamese Corridor con más de 300 restaurantes asiáticos en menos de 5 km",                              price:"$–$$",type:"Imperdible" },
    { dish:"Barbecue tejana",           where:"Houston — barbecue seria del estado y escena de food trucks activa",                                                                    price:"$$",  type:"Local" },
    { dish:"Crawfish vietnamita-cajún", where:"Suroeste de Houston — el cruce gastronómico que explica la ciudad mejor que cualquier folleto",                                        price:"$$",  type:"Fusión" },
  ],

  experiences:[
    { title:"Museum District", duration:"Medio día o día completo", desc:"El Museum District de Houston tiene 19 museos en un radio de dos kilómetros, la mayoría gratuitos o con entrada reducida. El Houston Museum of Natural Science tiene una colección de mineralogía y meteoritos de nivel mundial; el Museum of Fine Arts Houston tiene la mejor colección de arte latinoamericano de Estados Unidos (especialmente relevante para el perfil de este torneo); el Children's Museum of Houston es uno de los cinco mejores del país para familias con niños. Todo el corredor tiene acceso por METRORail (estación Museum District). Para el día libre entre el partido del 17 y el del 20 de junio.", type:"Museos" },
    { title:"Houston Zoo + Hermann Park", duration:"Día completo", desc:"El Houston Zoo en Hermann Park tiene más de 6,000 animales en 55 acres de parque diseñado para fluir naturalmente sin agobio. Especialmente fuerte en grandes felinos, elefantes africanos y una sección de primates con gorilas de tierras bajas. Entrada: $26 adultos / $18 niños de 2–11 años. El parque tiene también un jardín botánico, un lago con botes de remo y un tren miniatura — suficiente para una jornada completa con niños de cualquier edad. Acceso por METRORail (estación Hermann Park/Rice U).", type:"Familia" },
    { title:"Space Center Houston", duration:"Día completo", desc:"El Space Center Houston es el centro de visitantes del Johnson Space Center de la NASA — el cuartel general de los vuelos tripulados de Estados Unidos desde 1961. A 40 kilómetros al sureste del centro en Clear Lake, accesible en auto o en tour organizado. Tiene el Saturno V más grande expuesto en el mundo, simuladores de misión y tours al interior del Mission Control histórico. Entrada: $35 adultos / $25 niños. Para el fan con hijos entre 8 y 16 años, es la visita con mayor impacto del torneo completo.", type:"NASA" },
    { title:"Bellaire Boulevard — Chinese-Vietnamese Corridor", duration:"Tarde o noche", desc:"El Chinatown de Houston en el suroeste de la ciudad — conocido como el Chinese-Vietnamese Corridor de Bellaire Boulevard — tiene más de 300 restaurantes asiáticos en menos de 5 kilómetros. Es la concentración de cocina vietnamita más alta fuera de Vietnam en el hemisferio occidental. Para el fan de Países Bajos o Portugal que quiere cenar bien y gastar poco entre partidos, este corredor es la respuesta que ninguna guía turística da primero.", type:"Gastronomía" },
  ],

  itinerary:[
    { day:1, title:"Llegada y corredor METRORail", subtitle:"IAH / HOU · Midtown · Museum District", isMatchDay:false, steps:[
      { time:"Llegada",   text:"Elige aeropuerto según tu ruta: IAH al norte para vuelos internacionales; HOU al sur si llegas por Southwest o ruta doméstica. HOU está a 13 km del estadio y conecta por Route 40 + Red Line en ~30 minutos." },
      { time:"Tarde",     text:"Instálate en Midtown Houston o Museum District. La clave mundialista es quedarse en el corredor que conecta el centro con el Medical Center y NRG Stadium por METRORail." },
      { time:"Atardecer", text:"Reconoce tu estación de Red Line: McGowen, Wheeler o Museum District. NRG Park Station queda a 2 minutos a pie del estadio." },
      { time:"Noche",     text:"Cena en Montrose o Westheimer. Houston come mejor de lo que la mayoría de guías admite: vietnamita, barbecue, pubs de fútbol y cocina internacional real." },
    ]},
    { day:2, title:"Día de partido — Alemania vs. Curazao", subtitle:"Houston Stadium · Dom 14 Jun · 12:00 CT", isMatchDay:true, matchRef:"m1", steps:[
      { time:"H-3:00", text:"Desayuna temprano en Midtown. Cuatro de los cinco partidos de grupos arrancan al mediodía y no dan margen para improvisar comida antes del estadio." },
      { time:"H-2:00", text:"METRORail Red Line desde tu estación hacia NRG Park. Frecuencia en días de partido: cada 6 minutos." },
      { time:"H-1:30", text:"Llegada al estadio. Puertas abiertas 90 minutos antes. Afuera hay calor y humedad; adentro hay techo retráctil y climatización." },
      { time:"12:00",  text:"Alemania vs. Curazao. Apertura de la sede y primera prueba de la logística de mediodía en Houston." },
      { time:"Post",   text:"METRORail de regreso. Discovery Green o Midtown Park para ver el partido de la tarde con algo de sombra y comida cerca." },
    ]},
    { day:3, title:"Día de partido — Portugal", subtitle:"Houston Stadium · Mié 17 Jun · 12:00 CT", isMatchDay:true, matchRef:"m2", steps:[
      { time:"H-3:00", text:"Desayuna antes de las 9am. Portugal juega al mediodía y la comunidad lusa, más la diáspora latinoamericana que sigue a Cristiano Ronaldo, concentra demanda en esta fecha." },
      { time:"H-2:00", text:"METRORail desde Midtown, Museum District o Medical Center. A las 10am el calor exterior ya está activo." },
      { time:"H-1:30", text:"Seguridad exterior con agua, protector solar y ropa ligera. El estadio climatizado es el premio; la fila de acceso todavía es Houston en junio." },
      { time:"12:00",  text:"Portugal vs. Playoff Intercontinental 1. Primer partido portugués en Houston." },
      { time:"Post",   text:"Phoenix on Westheimer o Richmond Arms Pub si quieres seguir el día en modo fútbol internacional." },
    ]},
    { day:4, title:"Museos, Vietnamita y Países Bajos", subtitle:"Museum District · Bellaire Boulevard · Houston Stadium", isMatchDay:true, matchRef:"m3", steps:[
      { time:"Mañana", text:"Museum District: 19 museos en dos kilómetros, la mayoría gratuitos o con entrada reducida. Houston Museum of Natural Science, MFAH y Children's Museum cubren ciencia, arte latinoamericano y familia." },
      { time:"H-2:00", text:"Si vas al partido de Países Bajos, Red Line hacia NRG Park. Desde Museum District son ~8 minutos." },
      { time:"12:00",  text:"Países Bajos vs. Repechaje UEFA B. Otro partido de mediodía bajo techo climatizado." },
      { time:"Tarde",  text:"Bellaire Boulevard: más de 300 restaurantes asiáticos en menos de 5 kilómetros. La concentración vietnamita más alta fuera de Vietnam en el hemisferio occidental." },
      { time:"Noche",  text:"Cena vietnamita-cajún o barbecue tejana. Esta es la Houston que ninguna guía turística da primero." },
    ]},
    { day:5, title:"Portugal define el grupo o NASA", subtitle:"Houston Stadium · Mar 23 Jun · Space Center Houston", isMatchDay:true, matchRef:"m4", steps:[
      { time:"Opción partido", text:"Portugal vs. Uzbekistán. Segundo partido de Portugal en Houston y definición del Grupo K. Misma regla de mediodía: desayuno temprano, Red Line y llegada 90 minutos antes." },
      { time:"Opción libre",   text:"Space Center Houston: centro de visitantes del Johnson Space Center de la NASA, a 40 km al sureste del centro. Saturno V, simuladores de misión y tours al Mission Control histórico." },
      { time:"Tarde",          text:"Si el partido fue al mediodía, el 4 de julio o cualquier día de eliminación dejan la tarde libre para hotel, piscina o Kemah Boardwalk." },
      { time:"Noche",          text:"Clé Houston para pantalla nocturna con terraza si baja la temperatura, o Richmond Arms si el plan pide pub inglés serio." },
    ]},
  ],

  lagomTips:[
    "Portugal juega dos veces en Houston: 17 y 23 de junio, ambos al mediodía. Reserva hotel y arma logística como bloque de dos partidos.",
    "La ruta maestra es METRORail Red Line → NRG Park Station. Desde Midtown son ~12 minutos; desde Museum District, ~8 minutos. Uber post-partido no es la salida inteligente.",
    "El estadio tiene A/C, pero la fila exterior no. Para partidos de mediodía: hidratación antes de salir, ropa ligera y protector solar.",
    "Bellaire Boulevard tiene más de 300 restaurantes asiáticos en menos de 5 km. Para cenar bien y gastar poco entre partidos, esa es la respuesta.",
  ],

  matchDayChecklist:[
    "Boleto digital del partido — app FIFA",
    "Q Card o pago listo para METRORail",
    "Ruta Red Line definida hacia NRG Park Station",
    "Agua antes de salir del hotel",
    "Protector solar",
    "Ropa ligera para humedad tropical",
    "Reserva de hotel confirmada para partidos de Portugal y 4 de julio",
    "Llegada al estadio 90 min antes — seguridad exterior bajo calor",
  ],

  didYouKnow:"El Chinatown de Houston en Bellaire Boulevard tiene más de 300 restaurantes asiáticos en menos de 5 kilómetros y la concentración de cocina vietnamita más alta fuera de Vietnam en el hemisferio occidental. Para un Mundial de 48 naciones, Houston ya vive en formato torneo.",
  closingNote:"Houston no aparece en los itinerarios estándar de viaje internacional. No tiene la notoriedad de Nueva York ni el atractivo visual de Miami. Tiene algo diferente: 145 lenguas, la escena de food trucks más activa de Texas, museos gratuitos, un metro que va directo al estadio y un calor que el estadio climatizado resuelve. Para el torneo más diverso de la historia del fútbol, la ciudad más diversa de Estados Unidos tiene una coherencia que ningún comité de turismo podría haber inventado. LagomPlan te da el METRORail, el crawfish vietnamita-cajún y el itinerario. La ciudad pone el resto.",
  closingSignature:"Lagomplan · Guía de campo · Houston · Mundial 2026",
  plannerCTA:"Generar mi viaje a Houston",

  sectionSubtitles:{
    matches:"7 partidos confirmados en Houston Stadium: cinco de grupos, Ronda de 32 y Ronda de 16.",
    itinerary:"Construida alrededor de Portugal, partidos de mediodía y la ruta directa del METRORail.",
    stays:"Tres bases reales para descansar entre el estadio climatizado, Bellaire y el calor de Houston.",
    vibe:"Fan Fest oficial, parques con pantallas, pubs de fútbol y el golfo como plan alterno.",
    logistics:"METRORail directo al estadio y una advertencia: el estadio tiene A/C, la calle no.",
    food:"Vietnamita, barbecue, pubs de fútbol y la cocina que explica la diversidad de Houston.",
    experiences:"Museos gratuitos, NASA, Hermann Park y Bellaire para entender la ciudad entre partidos.",
  },
  staysWarning:"Los precios indicados son estimaciones para el periodo mundialista. Portugal juega dos veces en Houston y el 4 de julio añade demanda de Ronda de 16. Si no tienes reserva confirmada, busca opciones en Midtown, Museum District o Montrose con acceso razonable al METRORail.",
}

export const en: CityGuide = {
  id:"hou",
  city:"Houston",
  country:"United States",
  state:"Texas",
  flag:"🇺🇸",
  accent: ACCENT,

  tags:["Football","Food","Diversity","Co-host city"],

  stadium:{ name:"Houston Stadium (NRG Stadium)", capacity:"~72,220", area:"NRG Park — Medical Center corridor" },

  headline:"The most diverse city in Texas welcomes the most diverse tournament in history. The math adds up.",
  description:"The most diverse city in Texas welcomes the most diverse tournament in history. The math adds up. Houston arrives at the World Cup with seven matches, a retractable roof, indoor climate control, and Portugal playing twice here. In a city where 145+ languages are spoken, nearly every flag that walks into the stadium has a local community behind it.",

  scores:[
    { label:"Atmosphere", value:5 },
    { label:"Football",   value:4 },
    { label:"Food",       value:4 },
    { label:"Transit",    value:4 },
    { label:"Safety",     value:4 },
    { label:"Cost",       value:3 },
  ],

  matches:[
    { id:"m1", date:"Jun 14", day:"Sun", time:"12:00 CT", teams:[{name:"Germany",flag:"🇩🇪"},{name:"Curaçao",flag:"🇨🇼"}], stadium:"Houston Stadium", tag:"Group E — venue opener", highlight:false },
    { id:"m2", date:"Jun 17", day:"Wed", time:"12:00 CT", teams:[{name:"Portugal",flag:"🇵🇹"},{name:"Intercontinental Playoff 1",flag:""}], stadium:"Houston Stadium", tag:"Portugal in Houston", highlight:true },
    { id:"m3", date:"Jun 20", day:"Sat", time:"12:00 CT", teams:[{name:"Netherlands",flag:"🇳🇱"},{name:"UEFA Playoff B",flag:""}], stadium:"Houston Stadium", tag:"Group F", highlight:false },
    { id:"m4", date:"Jun 23", day:"Tue", time:"12:00 CT", teams:[{name:"Portugal",flag:"🇵🇹"},{name:"Uzbekistan",flag:"🇺🇿"}], stadium:"Houston Stadium", tag:"Group K — Portugal decides the group", highlight:true },
    { id:"m5", date:"Jun 26", day:"Fri", time:"19:00 CT", teams:[{name:"Cape Verde",flag:"🇨🇻"},{name:"Saudi Arabia",flag:"🇸🇦"}], stadium:"Houston Stadium", tag:"Night match", highlight:false },
    { id:"m6", date:"Jun 29", day:"Mon", time:"12:00 CT", teams:[{name:"Round of 32",flag:""},{name:"1°C vs. 2°F",flag:""}], stadium:"Houston Stadium", tag:"Knockout stage", highlight:false },
    { id:"m7", date:"Jul 4",  day:"Sat", time:"12:00 CT", teams:[{name:"Round of 16",flag:"🇺🇸"},{name:"TBD",flag:"🎆"}], stadium:"Houston Stadium", tag:"Independence Day", highlight:true },
  ],

  manifesto:{
    stadiumInfo:[
      { label:"FIFA stadium",      value:"Houston Stadium (NRG Stadium)" },
      { label:"Capacity",          value:"~72,220 — FIFA configuration" },
      { label:"Weather",           value:"Days: 33–37°C · Tropical humidity · Retractable roof and climate control indoors — controlled conditions inside the venue at every match" },
      { label:"Matches",           value:"7 confirmed — 5 group + 1 Round of 32 + 1 Round of 16" },
      { label:"Schedule",          value:"Portugal plays TWO matches in Houston (June 17 and June 23). If they advance, they return in the knockout stage." },
      { label:"Airports",          value:"IAH — George Bush Intercontinental · 35 km north of the stadium · HOU — William P. Hobby Airport · 13 km south" },
    ],
    body:"Houston is the most ethnically diverse city in the United States — more than 145 languages are spoken in the metro area. For a 48-nation tournament, that means nearly every flag walking into the stadium has a local community behind it. Germany, Portugal, Netherlands: all have organic representation in the city without anyone flying in from Europe. Houston Dynamo has one of the most loyal fan bases in MLS, and NRG Stadium already has World Cup history — it hosted matches in 1994. The Latino football scene in Houston, driven by the second-largest Mexican community in the U.S., runs independently of the tournament.",
    lagomNote:"Portugal plays twice in Houston and both matches kick off at noon (12:00 CT). The Portuguese community in the metro area — plus the Latin American diaspora that follows Portugal because of Cristiano Ronaldo — turns Houston into a gathering point for those two weeks. If Portugal advances, they can return for the knockout rounds. Book treating June 17 and June 23 as a block, not as isolated dates.",
  },

  vibe:{
    body:"Houston is the most diverse city in the U.S. and that's not brochure copy: 145+ languages are spoken in the metro area. For a 48-nation World Cup, that means Germany, Portugal, Netherlands, Cape Verde, and Saudi Arabia all have real communities in town before the first flight of traveling fans lands. The food scene is one of the most underrated in the country: more James Beard restaurants per capita than Chicago, the highest concentration of Vietnamese food outside Vietnam in the Western Hemisphere, and serious Texas barbecue. More accessible than the coasts, comparable to Dallas and Atlanta — Houston has enough hotel inventory to absorb the tournament's impact better than most host cities.",
    lagomNote:"Four of the five group matches kick off at noon local time. The climate-controlled stadium absorbs a Texas June — but the outdoors doesn't. Arrive early, hydrated, and in light clothing.",
  },

  neighborhoods:[
    { name:"Midtown Houston / Museum District", vibe:"Midtown Houston combines direct METRORail access (McGowen and Wheeler stations on the Red Line, which runs to the stadium) with the city's densest concentration of restaurants and bars per square kilometer. The Museum District, right next door, has the densest museum corridor in the southern U.S. and boutique hotels at more reasonable prices than Downtown. To the stadium by METRORail: 12 minutes direct.", best_for:"WC fan", walk_to_stadium:"12 min direct on METRORail Red Line", lagomNote:null },
    { name:"Montrose", vibe:"Houston's most eclectic and independent neighborhood: art galleries, specialty coffee, used bookstores, and the city's most interesting restaurant scene. Connects to METRORail via Wheeler station (Red Line). For the fan who wants the real Houston between Germany and Portugal matches.", best_for:"Character", walk_to_stadium:"Wheeler Station + Red Line to NRG Park", lagomNote:null },
    { name:"Mahatma Gandhi District / Westheimer", vibe:"The Westheimer corridor in southwest Houston holds the city's highest concentration of Latin American, Middle Eastern, and South Asian restaurants. Houston's Portuguese community, though small, gathers here. For the Portugal fan who wants to eat, drink, and watch matches surrounded by people who understand what's happening.", best_for:"Portugal / Latin America", walk_to_stadium:"Connection to METRORail via Wheeler or a short rideshare", lagomNote:null },
    { name:"Downtown Houston", vibe:"Downtown Houston works for business and has solid chain hotels, but it dies at 6pm. No neighborhood life, no walkable casual restaurants, no bars with match-day atmosphere. METRORail to the stadium starts here, but there's no reason to base downtown when Midtown or Montrose are ten minutes away.", best_for:"Avoid as a base", walk_to_stadium:"Direct METRORail, but little neighborhood life", lagomNote:"Skip it as a base if you want atmosphere between matches. Midtown and Montrose solve the city better." },
  ],

  stays:[
    { name:"Hotel Zaza Houston", area:"Museum District / Montrose", price:"$$$", priceCAD:"$220–400 USD/night (World Cup period)", tags:["Boutique","Pool","Museum District"], note:"Houston's most character-driven hotel: themed rooms, a pool with cabanas, and a restaurant that works for pre-match breakfast and post-match celebration dinner. Three blocks from METRORail at the Museum District station.", best_for:"Character", url:"https://booking.stay22.com/lagomplan/2aSmYzQyvT" },
    { name:"Houston House Apartments", area:"Midtown", price:"$$", priceCAD:"$90–180 USD/night (World Cup period)", tags:["Apartments","Kitchen","Near METRORail"], note:"For multi-day stays, Midtown apartments with kitchens and METRORail access are the most cost-efficient option. Airbnb has solid Midtown inventory at noticeably lower prices than chain hotels.", best_for:"Budget", url:"" },
    { name:"Post Oak Hotel at Uptown Houston", area:"Galleria / Uptown", price:"$$$$", priceCAD:"$480–900 USD/night (World Cup period)", tags:["Luxury","Spa","Uptown"], note:"The most ambitious luxury hotel opened in Houston in the last decade: two Michelin restaurants, a 3,500 square-meter spa, and the best Uptown skyline view. For Round of 16 night on July 4 — a noon match gives you time to reach the hotel before sunset.", best_for:"Luxury", url:"https://www.booking.com/hotel/us/the-post-oak.html" },
  ],

  logistics:{
    transport:[
      { icon:"✈", title:"Arriving in Houston — IAH / HOU", text:"IAH — George Bush Intercontinental is 35 km north of the stadium. METRO Route 102 Express to downtown, then Red Line to the stadium: ~50 minutes total. Uber direct IAH → stadium: ~40 minutes and $45–65 USD. HOU — William P. Hobby Airport is 13 km south; Route 40 bus to Fannin South + Red Line to NRG Park: ~30 minutes, $2.50." },
      { icon:"🚇", title:"Master route — METRORail Red Line", text:"METRORail Red Line → NRG Park Station, a 2-minute walk from the stadium. The Red Line starts at Main Street Square downtown, runs through Midtown and the Medical Center, and lands at NRG practically at the gate. Match-day frequency: every 6 minutes. Fare: $1.25 with a Q Card." },
      { icon:"🏟", title:"To the stadium on match day", text:"NRG Stadium has one of the most direct public-transit routes of any Texas venue in the tournament. From Midtown it's ~12 minutes by METRORail; from the Museum District, ~8 minutes. No transfers, no guessing, and a cleaner post-match exit than Uber." },
      { icon:"⚠️", title:"Critical error — ignoring the outdoor heat", text:"The stadium has A/C — the street doesn't. The outdoor security line at NRG in June at 10:30am with Gulf humidity can be rougher than any match inside. Hydrate before leaving the hotel, wear light clothing, use sunscreen. The climate-controlled stadium is the reward — you earn it by arriving prepared.", isWarning:true },
    ],
    timings:[
      { label:"From Midtown (McGowen) on METRORail", value:"~12 min" },
      { label:"From Museum District on METRORail",   value:"~8 min" },
      { label:"From HOU by bus + METRORail",         value:"~30 min" },
      { label:"Uber from Midtown",                    value:"15–25 min · long post-match wait" },
    ],
    matchDayCronologia:{
      matchName:"Jun 17 · Portugal · 12:00 CT",
      steps:[
        { time:"H-3:00", text:"Breakfast in Midtown before 9am. Noon matches leave no room to improvise food before the stadium." },
        { time:"H-2:00", text:"METRORail from your station. By 10am outdoor heat is already active." },
        { time:"H-1:30", text:"Arrive at the stadium. Gates open 90 minutes before kickoff. Inside: air conditioning." },
        { time:"H-0:30", text:"In your seat. Digital ticket ready." },
        { time:"H+0:00", text:"Kickoff." },
        { time:"H+1:45", text:"METRORail back. First train out. No reason to linger outside." },
      ],
    },
    timing:"NRG Stadium has one of the most direct public-transit routes of any Texas venue in the tournament. METRORail's Red Line links downtown, Midtown, and the Museum District with the stadium in a straight line. No transfers, no guessing.",
    cost:"More affordable than the coasts, comparable to Dallas and Atlanta. Prices rise for Portugal's matches and July 4, but Houston has enough hotel inventory to absorb the impact better than tighter cities.",
  },

  vibeCards:[
    { title:"FIFA Fan Festival™ — Discovery Green", type:"Official fan fest", typeColor:CORAL, desc:"Houston's Fan Fest sets up at Discovery Green, the urban park in the heart of downtown next to the George R. Brown Convention Center. Big-format screens, cultural programming, and METRORail access (Bell or Preston stations on the Red Line). For noon matches, the park has shade and misting systems — infrastructure built for Houston heat in any month.", tag:"No ticket needed" },
    { title:"Discovery Green (Downtown)", type:"Outdoor screen", typeColor:FJORD, desc:"The urban park next to the George R. Brown Convention Center — also the official Fan Fest site — has outer-perimeter zones that stay active with informal screens and food trucks. For fans who arrive after Fan Fest registration is full, Discovery Green's perimeter is the natural second ring.", tag:"Downtown" },
    { title:"Midtown Park", type:"Watch party", typeColor:SAGE, desc:"Midtown Houston's park has a tradition of watch parties for CONCACAF and international tournaments. Midtown's Mexican community activates the park for El Tri matches with portable screens and plaza energy. Two blocks from METRORail.", tag:"Local" },
    { title:"Kemah Boardwalk", type:"Waterfront", typeColor:PINE, desc:"40 minutes southeast of Houston on I-45, the Kemah boardwalk has screens on its terraces facing Galveston Bay. For the fan with a noon match who wants to head to the Gulf afterward and watch the afternoon broadcast with water in the background — the farthest option from the central-city chaos.", tag:"Gulf" },
    { title:"Richmond Arms Pub", type:"English pub", typeColor:"#1A3A5C", desc:"Houston's most veteran English pub, with decades of history broadcasting Premier League and international football. For Germany (June 14), Netherlands (June 20), and Portugal (June 17 and 23), it's the city's European community gathering point — with screens in every corner and a crowd that knows exactly what it's watching. What to order: Scotch egg + pint of Fuller's London Pride. Vibe: authentic English pub, the most experienced in international football in Houston.", tag:"Westheimer" },
    { title:"Clé Houston", type:"Bar with terrace", typeColor:"#5A3A2A", desc:"Bar with an outdoor terrace and big-format screens. For the night match Cape Verde vs. Saudi Arabia (June 26, 19:00 CT), Clé's terrace works better than indoors — Midtown's 7pm June temperature has dropped enough to enjoy outside. Bar kitchen with more interesting options than the average Houston sports bar. What to order: house flatbread + seasonal cocktail. Vibe: lively Midtown, active terrace, screen always on.", tag:"Midtown" },
  ],

  food:[
    { dish:"Richmond Arms Pub",     where:"Westheimer — scotch egg + pint of Fuller's London Pride; authentic English pub with decades of international football", price:"$$",  type:"Pre-match" },
    { dish:"Clé Houston",            where:"Midtown — house flatbread + seasonal cocktail; active terrace for Cape Verde vs. Saudi Arabia night match",                 price:"$$$", type:"Terrace" },
    { dish:"Phoenix on Westheimer",  where:"Montrose / Westheimer — fish & chips + Guinness or local IPA; serious football pub and the first to fill up for Portugal",   price:"$$",  type:"Portugal" },
    { dish:"Vietnamese kitchen",     where:"Bellaire Boulevard — Chinese-Vietnamese Corridor with 300+ Asian restaurants in under 5 km",                                  price:"$–$$",type:"Must try" },
    { dish:"Texas barbecue",         where:"Houston — serious state-wide barbecue tradition and an active food-truck scene",                                              price:"$$",  type:"Local" },
    { dish:"Viet-Cajun crawfish",    where:"Southwest Houston — the culinary crossroads that explains the city better than any brochure",                                price:"$$",  type:"Fusion" },
  ],

  experiences:[
    { title:"Museum District", duration:"Half or full day", desc:"Houston's Museum District has 19 museums within a two-kilometer radius, most of them free or low-cost. The Houston Museum of Natural Science has a world-class mineralogy and meteorite collection; the Museum of Fine Arts Houston has the best Latin American art collection in the U.S. (especially relevant for this tournament's profile); the Children's Museum of Houston ranks among the top five in the country for families. The whole corridor is METRORail-accessible (Museum District station). Perfect for the off-day between the June 17 and June 20 matches.", type:"Museums" },
    { title:"Houston Zoo + Hermann Park", duration:"Full day", desc:"The Houston Zoo in Hermann Park holds 6,000+ animals across 55 acres designed to flow without crowding. Especially strong on big cats, African elephants, and a primate section with lowland gorillas. Admission: $26 adults / $18 kids 2–11. The park also has a botanical garden, a rowing lake, and a miniature train — enough for a full day with kids of any age. METRORail access (Hermann Park/Rice U station).", type:"Family" },
    { title:"Space Center Houston", duration:"Full day", desc:"Space Center Houston is the visitor center for NASA's Johnson Space Center — the U.S. crewed-spaceflight headquarters since 1961. 40 km southeast of downtown in Clear Lake, reachable by car or organized tour. Home to the largest Saturn V on display in the world, mission simulators, and tours inside the historic Mission Control. Admission: $35 adults / $25 kids. For the fan with kids between 8 and 16, it's the highest-impact visit of the whole tournament.", type:"NASA" },
    { title:"Bellaire Boulevard — Chinese-Vietnamese Corridor", duration:"Afternoon or evening", desc:"Houston's Chinatown in the southwest of the city — known as the Chinese-Vietnamese Corridor on Bellaire Boulevard — has 300+ Asian restaurants in under 5 kilometers. It's the highest concentration of Vietnamese food outside Vietnam in the Western Hemisphere. For the Netherlands or Portugal fan who wants to eat well and spend little between matches, this corridor is the answer no tourist guide gives first.", type:"Food" },
  ],

  itinerary:[
    { day:1, title:"Arrival and METRORail corridor", subtitle:"IAH / HOU · Midtown · Museum District", isMatchDay:false, steps:[
      { time:"Arrival", text:"Choose an airport based on your route: IAH to the north for international flights; HOU to the south if arriving via Southwest or a domestic route. HOU is 13 km from the stadium and connects via Route 40 + Red Line in ~30 minutes." },
      { time:"Afternoon", text:"Base yourself in Midtown Houston or Museum District. The World Cup key is staying in the corridor that connects downtown with the Medical Center and NRG Stadium via METRORail." },
      { time:"Evening", text:"Identify your Red Line station: McGowen, Wheeler, or Museum District. NRG Park Station is a 2-minute walk from the stadium." },
      { time:"Night", text:"Dinner in Montrose or Westheimer. Houston eats better than most guides admit: Vietnamese, barbecue, football pubs, and real international cuisine." },
    ]},
    { day:2, title:"Match day — Germany vs. Curaçao", subtitle:"Houston Stadium · Sun Jun 14 · 12:00 CT", isMatchDay:true, matchRef:"m1", steps:[
      { time:"H-3:00", text:"Early breakfast in Midtown. Four of the five group matches kick off at noon and leave no margin for improvising food before the stadium." },
      { time:"H-2:00", text:"METRORail Red Line from your station toward NRG Park. Match-day frequency: every 6 minutes." },
      { time:"H-1:30", text:"Arrive at the stadium. Gates open 90 minutes before kickoff. Outside: heat and humidity; inside: retractable roof and climate control." },
      { time:"12:00",  text:"Germany vs. Curaçao. Venue opener and first test of Houston's noon-match logistics." },
      { time:"Post",   text:"METRORail back. Discovery Green or Midtown Park to watch the afternoon match with shade and food nearby." },
    ]},
    { day:3, title:"Match day — Portugal", subtitle:"Houston Stadium · Wed Jun 17 · 12:00 CT", isMatchDay:true, matchRef:"m2", steps:[
      { time:"H-3:00", text:"Breakfast before 9am. Portugal plays at noon and the Portuguese community — plus the Latin American diaspora following Cristiano Ronaldo — concentrates demand on this date." },
      { time:"H-2:00", text:"METRORail from Midtown, Museum District, or Medical Center. By 10am outdoor heat is already active." },
      { time:"H-1:30", text:"Exterior security with water, sunscreen, and light clothing. The climate-controlled stadium is the reward; the entry line is still Houston in June." },
      { time:"12:00",  text:"Portugal vs. Intercontinental Playoff 1. First Portuguese match in Houston." },
      { time:"Post",   text:"Phoenix on Westheimer or Richmond Arms Pub if you want to keep the day in international-football mode." },
    ]},
    { day:4, title:"Museums, Vietnamese food, and Netherlands", subtitle:"Museum District · Bellaire Boulevard · Houston Stadium", isMatchDay:true, matchRef:"m3", steps:[
      { time:"Morning", text:"Museum District: 19 museums within two kilometers, most free or reduced-price. Houston Museum of Natural Science, MFAH, and the Children's Museum cover science, Latin American art, and family." },
      { time:"H-2:00",  text:"If you're going to the Netherlands match, Red Line toward NRG Park. From Museum District it's ~8 minutes." },
      { time:"12:00",   text:"Netherlands vs. UEFA Playoff B. Another noon match under the climate-controlled roof." },
      { time:"Afternoon", text:"Bellaire Boulevard: 300+ Asian restaurants in under 5 kilometers. The highest Vietnamese concentration outside Vietnam in the Western Hemisphere." },
      { time:"Night",    text:"Viet-Cajun dinner or Texas barbecue. This is the Houston no tourist guide leads with." },
    ]},
    { day:5, title:"Portugal decides the group — or NASA", subtitle:"Houston Stadium · Tue Jun 23 · Space Center Houston", isMatchDay:true, matchRef:"m4", steps:[
      { time:"Match option", text:"Portugal vs. Uzbekistan. Portugal's second match in Houston and Group K decider. Same noon rule: early breakfast, Red Line, arrive 90 minutes ahead." },
      { time:"Free option",  text:"Space Center Houston: the visitor center for NASA's Johnson Space Center, 40 km southeast of downtown. Saturn V, mission simulators, and tours of the historic Mission Control." },
      { time:"Afternoon",    text:"If the match was at noon, July 4 or any knockout day leaves the afternoon free for the hotel, pool, or Kemah Boardwalk." },
      { time:"Night",        text:"Clé Houston for a night screen with a terrace if the temperature drops, or Richmond Arms if the plan calls for a serious English pub." },
    ]},
  ],

  lagomTips:[
    "Portugal plays twice in Houston: June 17 and June 23, both at noon. Book hotels and build logistics as a two-match block.",
    "The master route is METRORail Red Line → NRG Park Station. From Midtown it's ~12 minutes; from Museum District, ~8 minutes. Post-match Uber is not the smart exit.",
    "The stadium has A/C, but the outdoor line doesn't. For noon matches: hydrate before leaving, light clothing, sunscreen.",
    "Bellaire Boulevard has 300+ Asian restaurants in under 5 km. To eat well and spend little between matches, that's the answer.",
  ],

  matchDayChecklist:[
    "Digital match ticket — FIFA app",
    "Q Card or payment ready for METRORail",
    "Red Line route defined toward NRG Park Station",
    "Water before leaving the hotel",
    "Sunscreen",
    "Light clothing for tropical humidity",
    "Hotel reservation confirmed for Portugal matches and July 4",
    "Arrive at the stadium 90 min ahead — outdoor security under heat",
  ],

  didYouKnow:"Houston's Chinatown on Bellaire Boulevard has 300+ Asian restaurants in under 5 kilometers and the highest concentration of Vietnamese food outside Vietnam in the Western Hemisphere. For a 48-nation World Cup, Houston already lives in tournament format.",
  closingNote:"Houston doesn't show up on standard international itineraries. It doesn't have New York's profile or Miami's visual appeal. It has something different: 145 languages, the most active food-truck scene in Texas, free museums, a subway straight to the stadium, and a heat that the climate-controlled stadium handles. For the most diverse tournament in football history, the most diverse city in the United States has a coherence no tourism board could have engineered. LagomPlan gives you the METRORail, the Viet-Cajun crawfish, and the itinerary. The city provides the rest.",
  closingSignature:"Lagomplan · Field Guide · Houston · World Cup 2026",
  plannerCTA:"Generate my Houston trip",

  sectionSubtitles:{
    matches:"7 matches confirmed at Houston Stadium: five group, Round of 32, and Round of 16.",
    itinerary:"Built around Portugal, noon matches, and the direct METRORail route.",
    stays:"Three real bases to recover between the climate-controlled stadium, Bellaire, and Houston heat.",
    vibe:"Official Fan Fest, parks with screens, football pubs, and the Gulf as a plan B.",
    logistics:"METRORail straight to the stadium, with one warning: the stadium has A/C, the street doesn't.",
    food:"Vietnamese, barbecue, football pubs, and the cuisine that explains Houston's diversity.",
    experiences:"Free museums, NASA, Hermann Park, and Bellaire to understand the city between matches.",
  },
  staysWarning:"Prices shown are estimates for the World Cup period. Portugal plays twice in Houston and July 4 adds Round-of-16 demand. If you don't have a confirmed reservation, look at Midtown, Museum District, or Montrose with reasonable METRORail access.",
}
