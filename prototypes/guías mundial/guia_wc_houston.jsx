"use client";
import { useState, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS — LagomPlan canonical
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  pine:"#0F3A33", sage:"#6B8F86", sageLight:"#EAF2F0",
  sand:"#EDE7E1", sandLight:"#F7F4F1", sandDark:"#D9D2C9",
  coral:"#E1615B", coralLight:"#FCEEED",
  fjord:"#2D4F6C", fjordLight:"#E3EBF2",
  ink:"#1C1C1A", inkMid:"#5A5A56", inkFaint:"#9A9A94",
  white:"#FFFFFF",
  matchGold:"#B8860B", matchGoldLight:"#FBF5E0",
  bg:"#fff9f3",   // ← updated background for individual guides
};

const RADIUS = 8;
const CARD_SHADOW = "0 1px 3px rgba(28,28,26,0.06)";
const CITY_ACCENT = "#2D4F6C"; // Houston blue

const df = (size, weight=400, style="normal") => ({ fontFamily:"'Fraunces',serif", fontSize:size, fontWeight:weight, fontStyle:style });
const uf = (size, weight=400) => ({ fontFamily:"'Manrope',sans-serif", fontSize:size, fontWeight:weight });
const Label = ({ children, color=T.inkFaint, bg="transparent", style={} }) => (
  <span style={{ ...uf(10,600), letterSpacing:"0.13em", textTransform:"uppercase", color, background:bg, padding:bg!=="transparent"?"3px 9px":0, borderRadius:bg!=="transparent"?40:0, ...style }}>
    {children}
  </span>
);

// ─────────────────────────────────────────────────────────────────────────────
// HOUSTON GUIDE DATA — real content, no hallucinations
// ─────────────────────────────────────────────────────────────────────────────
const VANCOUVER = {
  id:"hou",
  city:"Houston",
  country:"Estados Unidos",
  state:"Texas",
  flag:"🇺🇸",
  accent: CITY_ACCENT,

  tags:["Fútbol","Gastronomía","Diversidad","Sede co-anfitriona"],

  stadium:{ name:"Houston Stadium (NRG Stadium)", capacity:"~72,220", area:"NRG Park — Medical Center corridor" },

  headline:"La ciudad más diversa de Texas recibe al torneo más diverso de la historia. La aritmética tiene sentido.",
  description:"La ciudad más diversa de Texas recibe al torneo más diverso de la historia. La aritmética tiene sentido. Houston llega al Mundial con siete partidos, techo retráctil, climatización interior y Portugal jugando dos veces aquí. Para una ciudad donde se hablan más de 145 lenguas, casi cada bandera que entra al estadio tiene una comunidad local detrás.",

  scores:[
    { label:"Ambiente",    value:5 },
    { label:"Fútbol local",value:4 },
    { label:"Gastronomía", value:4 },
    { label:"Transporte",  value:4 },
    { label:"Seguridad",   value:4 },
    { label:"Costo",       value:3 },
  ],

  // ── MATCHES — 7 confirmados ────────────────────────────────────────────────
  matches:[
    {
      id:"m1", date:"14 Jun", day:"Dom", time:"12:00 CT",
      teams:[{name:"Alemania",flag:"🇩🇪"},{name:"Curazao",flag:"🇨🇼"}],
      stadium:"Houston Stadium", tag:"Grupo E — apertura de la sede", highlight:false,
    },
    {
      id:"m2", date:"17 Jun", day:"Mié", time:"12:00 CT",
      teams:[{name:"Portugal",flag:"🇵🇹"},{name:"Playoff Intercontinental 1",flag:""}],
      stadium:"Houston Stadium", tag:"Portugal en Houston", highlight:true,
    },
    {
      id:"m3", date:"20 Jun", day:"Sáb", time:"12:00 CT",
      teams:[{name:"Países Bajos",flag:"🇳🇱"},{name:"Repechaje UEFA B",flag:""}],
      stadium:"Houston Stadium", tag:"Grupo F", highlight:false,
    },
    {
      id:"m4", date:"23 Jun", day:"Mar", time:"12:00 CT",
      teams:[{name:"Portugal",flag:"🇵🇹"},{name:"Uzbekistán",flag:"🇺🇿"}],
      stadium:"Houston Stadium", tag:"Grupo K — Portugal define el grupo", highlight:true,
    },
    {
      id:"m5", date:"26 Jun", day:"Vie", time:"19:00 CT",
      teams:[{name:"Cabo Verde",flag:"🇨🇻"},{name:"Arabia Saudita",flag:"🇸🇦"}],
      stadium:"Houston Stadium", tag:"Partido nocturno", highlight:false,
    },
    {
      id:"m6", date:"29 Jun", day:"Lun", time:"12:00 CT",
      teams:[{name:"Ronda de 32",flag:""},{name:"1°C vs. 2°F",flag:""}],
      stadium:"Houston Stadium", tag:"Fase eliminatoria", highlight:false,
    },
    {
      id:"m7", date:"4 Jul", day:"Sáb", time:"12:00 CT",
      teams:[{name:"Ronda de 16",flag:"🇺🇸"},{name:"Por definir",flag:"🎆"}],
      stadium:"Houston Stadium", tag:"Día de la Independencia", highlight:true,
    },
  ],

  // ── 01 MANIFIESTO ──────────────────────────────────────────────────────────
  manifesto:{
    stadiumInfo:[
      { label:"Estadio FIFA",   value:"Houston Stadium (NRG Stadium)" },
      { label:"Aforo",          value:"~72,220 — configuración FIFA" },
      { label:"Clima",          value:"Días: 33–37°C · Humedad tropical · Interior con techo retráctil y sistema de climatización — condiciones controladas dentro del recinto en todos los partidos" },
      { label:"Partidos",       value:"7 confirmados — 5 grupos + 1 Ronda de 32 + 1 Ronda de 16" },
      { label:"Calendario",     value:"Portugal juega DOS partidos en Houston (17 y 23 de junio). Si avanza, regresa en fase de eliminación." },
      { label:"Aeropuertos",    value:"IAH — George Bush Intercontinental · 35 km al norte del estadio · HOU — William P. Hobby Airport · 13 km al sur" },
    ],
    body:"Houston es la ciudad más étnicamente diversa de Estados Unidos — más de 145 lenguas se hablan en el área metropolitana. Para un torneo de 48 naciones, eso significa que casi cada bandera que entra al estadio tiene una comunidad local detrás. Alemania, Portugal, Países Bajos: todas tienen representación orgánica en la ciudad sin necesidad de que nadie vuele desde Europa. El Houston Dynamo tiene una de las aficiones más leales de la MLS y el NRG Stadium ya tiene historia mundialista — fue sede del torneo en 1994. La escena de fútbol latino en Houston, impulsada por la segunda mayor comunidad mexicana de Estados Unidos, funciona independientemente del Mundial.",
    lagomNote:"Portugal juega dos veces en Houston y ambos partidos arrancan al mediodía (12:00 CT). La comunidad lusa del área metropolitana — y la diáspora latinoamericana que sigue a Portugal por Cristiano Ronaldo — tiene Houston como punto de concentración esas dos semanas. Si Portugal avanza, puede volver en fase de eliminación. Reserva pensando en el 17 y 23 de junio como bloque, no como fechas aisladas.",
  },

  // ── 02 VIBRA ───────────────────────────────────────────────────────────────
  vibe:{
    body:"Houston es la ciudad más diversa de Estados Unidos y eso no es una frase de folleto: más de 145 lenguas se hablan en el área metropolitana. Para un Mundial de 48 naciones, eso significa que Alemania, Portugal, Países Bajos, Cabo Verde y Arabia Saudita tienen comunidades reales en la ciudad antes de que aterrice el primer vuelo de aficionados. La escena gastronómica es una de las más subestimadas del país: más restaurantes de James Beard por habitante que Chicago, la mayor concentración de cocina vietnamita fuera de Vietnam en el hemisferio occidental y barbecue tejana seria. Más accesible que las costas, comparable a Dallas y Atlanta, Houston tiene suficiente inventario hotelero para amortiguar mejor el impacto del torneo.",
    zones:[
      {
        name:"FIFA Fan Festival™ — Discovery Green",
        type:"Fan Fest oficial",
        typeColor:T.coral,
        desc:"El Fan Fest de Houston se instala en Discovery Green, el parque urbano en el corazón del downtown junto al George R. Brown Convention Center. Pantallas de gran formato, programación cultural y acceso por METRORail (estación Bell o Preston en la línea Roja). Para los partidos de mediodía, el parque tiene zonas de sombra y aspersores de agua — infraestructura diseñada para el calor de Houston en cualquier mes del año.",
        tag:"Sin boleto OK",
      },
      {
        name:"Midtown Park",
        type:"Pantalla exterior",
        typeColor:T.fjord,
        desc:"El parque de Midtown Houston tiene una tradición de watch parties para partidos de la CONCACAF y torneos internacionales. La comunidad mexicana de Midtown activa el parque para los partidos de El Tri con pantallas portátiles y ambiente de plaza. A dos cuadras del METRORail.",
        tag:"Local",
      },
      {
        name:"Kemah Boardwalk",
        type:"Waterfront",
        typeColor:T.sage,
        desc:"A 40 minutos al sureste de Houston por la I-45, el paseo marítimo de Kemah tiene pantallas en sus terrazas frente a la bahía de Galveston. Para el fan con partido al mediodía que quiere después del partido bajar al golfo y ver la transmisión de la tarde con el agua de fondo — la opción más alejada del caos de la ciudad central.",
        tag:"Golfo",
      },
      {
        name:"Phoenix on Westheimer",
        type:"Pub futbolero",
        typeColor:T.pine,
        desc:"El pub con más solera futbolera del corredor de Westheimer, conocido por repartir worksheets del sorteo durante el evento oficial del draw. Pantallas bien posicionadas, menú de pub con buenas alitas y la clientela más informada en fútbol internacional del west side de Houston. Para los partidos de Portugal — la sede lo tiene dos veces — el Phoenix es el primer lugar que se llena.",
        tag:"Portugal",
      },
    ],
    lagomNote:"Cuatro de los cinco partidos de grupos arrancan al mediodía hora local. El estadio climatizado absorbe el calor de junio en Texas — pero el exterior no. Llega temprano, hidratado y con ropa ligera.",
  },

  // ── 3.1 BARRIOS ────────────────────────────────────────────────────────────
  neighborhoods:[
    { body:"Houston es una ciudad enorme y sin zonificación urbana estricta — lo que la hace difícil de orientar a primera vista. La clave para el fan mundialista: quedarse en el corredor que conecta el centro con el Medical Center y el NRG Stadium, servido por el METRORail." },
    {
      name:"Midtown Houston / Museum District",
      vibe:"El Midtown de Houston combina acceso directo al METRORail (estaciones McGowen y Wheeler en la línea Roja, que va al estadio) con la mayor concentración de restaurantes y bares de la ciudad por kilómetro cuadrado. El Museum District, contiguo, tiene el corredor de museos más denso del sur de Estados Unidos y hoteles boutique a precios más razonables que el Downtown. Al estadio en METRORail: 12 minutos directos.",
      best_for:"Fan WC",
      walk_to_stadium:"12 min directos en METRORail Red Line",
      lagomNote:null,
    },
    {
      name:"Montrose",
      vibe:"El barrio más ecléctico e independiente de Houston: galerías de arte, cafeterías de especialidad, librerías de segunda mano y la escena de restaurantes más interesante de la ciudad. Conecta con el METRORail por la estación Wheeler (línea Roja). Para el fan que quiere el Houston real entre partidos de Alemania y Portugal.",
      best_for:"Carácter",
      walk_to_stadium:"Wheeler Station + Red Line hacia NRG Park",
      lagomNote:null,
    },
    {
      name:"Mahatma Gandhi District / Westheimer",
      vibe:"El corredor de Westheimer en el suroeste de Houston tiene la mayor concentración de restaurantes latinoamericanos, del Medio Oriente y del sur de Asia de la ciudad. La comunidad portuguesa de Houston, aunque pequeña, tiene sus puntos de reunión aquí. Para el fan de Portugal que quiere comer, beber y ver los partidos rodeado de gente que entiende lo que está pasando.",
      best_for:"Portugal / Latinoamérica",
      walk_to_stadium:"Conexión hacia METRORail por Wheeler o viaje corto en rideshare",
      lagomNote:null,
    },
    {
      name:"Downtown Houston",
      vibe:"El downtown de Houston es funcional para negocios y tiene buenos hoteles de cadena, pero muere a las 6pm. Sin vida de barrio, sin restaurantes informales accesibles caminando, sin bares de partido con atmósfera. El METRORail sale desde aquí al estadio, pero no hay razón para quedarse en el centro si Midtown o Montrose están a diez minutos.",
      best_for:"Evitar como base",
      walk_to_stadium:"METRORail directo, pero poca vida de barrio",
      lagomNote:"Evítalo como base si buscas ambiente entre partidos. Midtown y Montrose resuelven mejor la ciudad.",
    },
  ],

  // ── 3.2 HOTELES ────────────────────────────────────────────────────────────
  stays:[
    {
      name:"Hotel Zaza Houston",
      area:"Museum District / Montrose",
      price:"$$$",
      priceCAD:"$220–400 USD/noche (periodo mundialista)",
      tags:["Boutique","Piscina","Museum District"],
      note:"El hotel más personalidad de Houston: habitaciones temáticas, piscina con cabañas y un restaurante que funciona para el desayuno previo al partido de mediodía y la cena de celebración de la noche. Tres cuadras del METRORail en la estación Museum District.",
      best_for:"Carácter",
      hotel_link:"",
    },
    {
      name:"Houston House Apartments",
      area:"Midtown",
      price:"$$",
      priceCAD:"$90–180 USD/noche (periodo mundialista)",
      tags:["Apartamentos","Cocina","METRORail cerca"],
      note:"Para estancias de varios días, los apartamentos de Midtown con cocina y acceso al METRORail son la opción más eficiente económicamente. Plataformas como Airbnb tienen buena oferta en el corredor de Midtown a precios notablemente más bajos que los hoteles de cadena.",
      best_for:"Presupuesto",
      hotel_link:"",
    },
    {
      name:"Post Oak Hotel at Uptown Houston",
      area:"Galleria / Uptown",
      price:"$$$$",
      priceCAD:"$480–900 USD/noche (periodo mundialista)",
      tags:["Lujo","Spa","Uptown"],
      note:"El hotel de lujo más ambicioso abierto en Houston en la última década: dos restaurantes de Michelin, spa de 3,500 metros cuadrados y la mejor vista al skyline de Uptown. Para la noche de la Ronda de 16 del 4 de julio — el partido del mediodía da tiempo a llegar al hotel antes del atardecer.",
      best_for:"Lujo",
      hotel_link:"",
    },
  ],

  // ── 3.3 LOGÍSTICA ──────────────────────────────────────────────────────────
  logistics:{
    transport:[
      {
        icon:"✈",
        title:"Llegar a Houston — IAH / HOU",
        text:"IAH — George Bush Intercontinental está 35 km al norte del estadio. METRO Route 102 Express hasta el centro, luego Red Line al estadio: ~50 minutos total. Uber directo desde IAH al estadio: ~40 minutos y $45–65 USD. HOU — William P. Hobby Airport está a 13 km al sur; bus Route 40 hasta Fannin South + Red Line a NRG Park: ~30 minutos, $2.50.",
      },
      {
        icon:"🚇",
        title:"Ruta maestra — METRORail Red Line",
        text:"METRORail Red Line → NRG Park Station, a 2 minutos a pie del estadio. La línea Roja sale desde Main Street Square en el downtown, recorre Midtown y el Medical Center, y llega al NRG con una parada prácticamente en la puerta. Frecuencia en días de partido: cada 6 minutos. Tarifa: $1.25 con tarjeta Q Card.",
      },
      {
        icon:"🏟",
        title:"Al estadio el día del partido",
        text:"NRG Stadium tiene una de las rutas de tránsito público más directas de cualquier sede texana del torneo. Desde Midtown son ~12 minutos en METRORail; desde Museum District, ~8 minutos. Sin transbordo, sin conjeturas y con salida post-partido más limpia que Uber.",
      },
      {
        icon:"⚠️",
        title:"Error crítico — ignorar el calor exterior",
        text:"El estadio tiene A/C — la calle no. La fila de seguridad exterior al NRG en junio a las 10:30am con humedad del Golfo de México puede ser más dura que cualquier partido dentro del recinto. Hidratación antes de salir del hotel, ropa ligera, protector solar. El estadio climatizado es el premio — hay que merecerlo llegando bien equipado.",
        isWarning:true,
      },
    ],
    timings:[
      { label:"Desde Midtown (McGowen) en METRORail", value:"~12 min" },
      { label:"Desde Museum District en METRORail", value:"~8 min" },
      { label:"Desde HOU en bus + METRORail", value:"~30 min" },
      { label:"Uber desde Midtown", value:"15–25 min · post-partido con espera larga" },
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

  // ── 3.4 VIBE CARDS (puntos de encuentro) ───────────────────────────────────
  vibeCards:[
    {
      title:"FIFA Fan Festival™ — Discovery Green",
      type:"Fan fest oficial",
      typeColor:T.coral,
      desc:"El Fan Fest de Houston se instala en Discovery Green, el parque urbano en el corazón del downtown junto al George R. Brown Convention Center. Pantallas de gran formato, programación cultural y acceso por METRORail (estación Bell o Preston en la línea Roja). Para los partidos de mediodía, el parque tiene zonas de sombra y aspersores de agua — infraestructura diseñada para el calor de Houston en cualquier mes del año.",
      tag:"Sin boleto OK",
    },
    {
      title:"Discovery Green (Downtown)",
      type:"Pantalla exterior",
      typeColor:T.fjord,
      desc:"El parque urbano junto al George R. Brown Convention Center — donde está el Fan Fest oficial — tiene también zonas exteriores al perímetro que permanecen activas con pantallas informales y food trucks. Para el fan que llega después de que el registro del Fan Fest se agotó, el perímetro de Discovery Green es el segundo anillo natural.",
      tag:"Downtown",
    },
    {
      title:"Midtown Park",
      type:"Watch party",
      typeColor:T.sage,
      desc:"El parque de Midtown Houston tiene una tradición de watch parties para partidos de la CONCACAF y torneos internacionales. La comunidad mexicana de Midtown activa el parque para los partidos de El Tri con pantallas portátiles y ambiente de plaza. A dos cuadras del METRORail.",
      tag:"Local",
    },
    {
      title:"Kemah Boardwalk",
      type:"Waterfront",
      typeColor:T.pine,
      desc:"A 40 minutos al sureste de Houston por la I-45, el paseo marítimo de Kemah tiene pantallas en sus terrazas frente a la bahía de Galveston. Para el fan con partido al mediodía que quiere después del partido bajar al golfo y ver la transmisión de la tarde con el agua de fondo — la opción más alejada del caos de la ciudad central.",
      tag:"Golfo",
    },
    {
      title:"Richmond Arms Pub",
      type:"Pub inglés",
      typeColor:"#1A3A5C",
      desc:"El pub inglés más veterano de Houston, con décadas de historia transmitiendo Premier League y fútbol internacional. Para los partidos de Alemania (14 de junio), Países Bajos (20 de junio) y Portugal (17 y 23 de junio), es el punto de reunión de la comunidad europea de la ciudad — con pantallas en todos los rincones y un ambiente que sabe exactamente lo que está viendo. Qué pedir: Scotch egg + pinta de Fuller's London Pride. Vibe: Pub inglés auténtico, el más experimentado en fútbol internacional de Houston.",
      tag:"Westheimer",
    },
    {
      title:"Clé Houston",
      type:"Bar con terraza",
      typeColor:"#5A3A2A",
      desc:"Bar con terraza exterior y pantallas de gran formato. Para el partido nocturno de Cabo Verde vs. Arabia Saudita (26 de junio, 19:00 CT), la terraza de Clé funciona mejor que estar dentro — la temperatura de Midtown a las 7pm en junio ya ha bajado lo suficiente para disfrutar del exterior. Cocina de bar con opciones más interesantes que el promedio de los sports bars de la ciudad. Qué pedir: Flatbread de la casa + cóctel de temporada. Vibe: Midtown animado, terraza activa, pantalla siempre encendida.",
      tag:"Midtown",
    },
    {
      title:"Phoenix on Westheimer",
      type:"Pub futbolero",
      typeColor:"#093b12",
      desc:"El pub con más solera futbolera del corredor de Westheimer, conocido por repartir worksheets del sorteo durante el evento oficial del draw. Pantallas bien posicionadas, menú de pub con buenas alitas y la clientela más informada en fútbol internacional del west side de Houston. Para los partidos de Portugal — la sede lo tiene dos veces — el Phoenix es el primer lugar que se llena. Qué pedir: Fish & chips + Guinness o la IPA local que tenga de barril. Vibe: Pub futbolero serio, para quien sabe lo que está viendo.",
      tag:"Portugal",
    },
  ],

  // ── 3.5 COMIDA ─────────────────────────────────────────────────────────────
  food:[
    { dish:"Richmond Arms Pub", where:"Westheimer — scotch egg + pinta de Fuller's London Pride; pub inglés auténtico con décadas transmitiendo fútbol internacional", price:"$$", type:"Pre-partido" },
    { dish:"Clé Houston", where:"Midtown — flatbread de la casa + cóctel de temporada; terraza activa para el partido nocturno de Cabo Verde vs. Arabia Saudita", price:"$$$", type:"Terraza" },
    { dish:"Phoenix on Westheimer", where:"Montrose / Westheimer — fish & chips + Guinness o IPA local; pub futbolero serio y primer lugar que se llena para Portugal", price:"$$", type:"Portugal" },
    { dish:"Cocina vietnamita", where:"Bellaire Boulevard — Chinese-Vietnamese Corridor con más de 300 restaurantes asiáticos en menos de 5 km", price:"$–$$", type:"Imperdible" },
    { dish:"Barbecue tejana", where:"Houston — barbecue seria del estado y escena de food trucks activa", price:"$$", type:"Local" },
    { dish:"Crawfish vietnamita-cajún", where:"Suroeste de Houston — el cruce gastronómico que explica la ciudad mejor que cualquier folleto", price:"$$", type:"Fusión" },
  ],

  // ── 3.6 EXPERIENCIAS ───────────────────────────────────────────────────────
  experiences:[
    {
      title:"Museum District",
      duration:"Medio día o día completo",
      desc:"El Museum District de Houston tiene 19 museos en un radio de dos kilómetros, la mayoría gratuitos o con entrada reducida. El Houston Museum of Natural Science tiene una colección de mineralogía y meteoritos de nivel mundial; el Museum of Fine Arts Houston tiene la mejor colección de arte latinoamericano de Estados Unidos (especialmente relevante para el perfil de este torneo); el Children's Museum of Houston es uno de los cinco mejores del país para familias con niños. Todo el corredor tiene acceso por METRORail (estación Museum District). Para el día libre entre el partido del 17 y el del 20 de junio.",
      type:"Museos",
    },
    {
      title:"Houston Zoo + Hermann Park",
      duration:"Día completo",
      desc:"El Houston Zoo en Hermann Park tiene más de 6,000 animales en 55 acres de parque diseñado para fluir naturalmente sin agobio. Especialmente fuerte en grandes felinos, elefantes africanos y una sección de primates con gorilas de tierras bajas. Entrada: $26 adultos / $18 niños de 2–11 años. El parque tiene también un jardín botánico, un lago con botes de remo y un tren miniatura — suficiente para una jornada completa con niños de cualquier edad. Acceso por METRORail (estación Hermann Park/Rice U).",
      type:"Familia",
    },
    {
      title:"Space Center Houston",
      duration:"Día completo",
      desc:"El Space Center Houston es el centro de visitantes del Johnson Space Center de la NASA — el cuartel general de los vuelos tripulados de Estados Unidos desde 1961. A 40 kilómetros al sureste del centro en Clear Lake, accesible en auto o en tour organizado. Tiene el Saturno V más grande expuesto en el mundo, simuladores de misión y tours al interior del Mission Control histórico. Entrada: $35 adultos / $25 niños. Para el fan con hijos entre 8 y 16 años, es la visita con mayor impacto del torneo completo.",
      type:"NASA",
    },
    {
      title:"Bellaire Boulevard — Chinese-Vietnamese Corridor",
      duration:"Tarde o noche",
      desc:"El Chinatown de Houston en el suroeste de la ciudad — conocido como el Chinese-Vietnamese Corridor de Bellaire Boulevard — tiene más de 300 restaurantes asiáticos en menos de 5 kilómetros. Es la concentración de cocina vietnamita más alta fuera de Vietnam en el hemisferio occidental. Para el fan de Países Bajos o Portugal que quiere cenar bien y gastar poco entre partidos, este corredor es la respuesta que ninguna guía turística da primero.",
      type:"Gastronomía",
    },
  ],

  // ── ITINERARIO SUGERIDO ────────────────────────────────────────────────────
  itinerary:[
    {
      day:1,
      title:"Llegada y corredor METRORail",
      subtitle:"IAH / HOU · Midtown · Museum District",
      isMatchDay:false,
      steps:[
        { time:"Llegada",  text:"Elige aeropuerto según tu ruta: IAH al norte para vuelos internacionales; HOU al sur si llegas por Southwest o ruta doméstica. HOU está a 13 km del estadio y conecta por Route 40 + Red Line en ~30 minutos." },
        { time:"Tarde",    text:"Instálate en Midtown Houston o Museum District. La clave mundialista es quedarse en el corredor que conecta el centro con el Medical Center y NRG Stadium por METRORail." },
        { time:"Atardecer", text:"Reconoce tu estación de Red Line: McGowen, Wheeler o Museum District. NRG Park Station queda a 2 minutos a pie del estadio." },
        { time:"Noche",    text:"Cena en Montrose o Westheimer. Houston come mejor de lo que la mayoría de guías admite: vietnamita, barbecue, pubs de fútbol y cocina internacional real." },
      ],
    },
    {
      day:2,
      title:"Día de partido — Alemania vs. Curazao",
      subtitle:"Houston Stadium · Dom 14 Jun · 12:00 CT",
      isMatchDay:true,
      matchRef:"m1",
      steps:[
        { time:"H-3:00",   text:"Desayuna temprano en Midtown. Cuatro de los cinco partidos de grupos arrancan al mediodía y no dan margen para improvisar comida antes del estadio." },
        { time:"H-2:00",   text:"METRORail Red Line desde tu estación hacia NRG Park. Frecuencia en días de partido: cada 6 minutos." },
        { time:"H-1:30",   text:"Llegada al estadio. Puertas abiertas 90 minutos antes. Afuera hay calor y humedad; adentro hay techo retráctil y climatización." },
        { time:"12:00",    text:"Alemania vs. Curazao. Apertura de la sede y primera prueba de la logística de mediodía en Houston." },
        { time:"Post",     text:"METRORail de regreso. Discovery Green o Midtown Park para ver el partido de la tarde con algo de sombra y comida cerca." },
      ],
    },
    {
      day:3,
      title:"Día de partido — Portugal",
      subtitle:"Houston Stadium · Mié 17 Jun · 12:00 CT",
      isMatchDay:true,
      matchRef:"m2",
      steps:[
        { time:"H-3:00",   text:"Desayuna antes de las 9am. Portugal juega al mediodía y la comunidad lusa, más la diáspora latinoamericana que sigue a Cristiano Ronaldo, concentra demanda en esta fecha." },
        { time:"H-2:00",   text:"METRORail desde Midtown, Museum District o Medical Center. A las 10am el calor exterior ya está activo." },
        { time:"H-1:30",   text:"Seguridad exterior con agua, protector solar y ropa ligera. El estadio climatizado es el premio; la fila de acceso todavía es Houston en junio." },
        { time:"12:00",    text:"Portugal vs. Playoff Intercontinental 1. Primer partido portugués en Houston." },
        { time:"Post",     text:"Phoenix on Westheimer o Richmond Arms Pub si quieres seguir el día en modo fútbol internacional." },
      ],
    },
    {
      day:4,
      title:"Museos, Vietnamita y Países Bajos",
      subtitle:"Museum District · Bellaire Boulevard · Houston Stadium",
      isMatchDay:true,
      matchRef:"m3",
      steps:[
        { time:"Mañana",  text:"Museum District: 19 museos en dos kilómetros, la mayoría gratuitos o con entrada reducida. Houston Museum of Natural Science, MFAH y Children's Museum cubren ciencia, arte latinoamericano y familia." },
        { time:"H-2:00",  text:"Si vas al partido de Países Bajos, Red Line hacia NRG Park. Desde Museum District son ~8 minutos." },
        { time:"12:00",   text:"Países Bajos vs. Repechaje UEFA B. Otro partido de mediodía bajo techo climatizado." },
        { time:"Tarde",   text:"Bellaire Boulevard: más de 300 restaurantes asiáticos en menos de 5 kilómetros. La concentración vietnamita más alta fuera de Vietnam en el hemisferio occidental." },
        { time:"Noche",   text:"Cena vietnamita-cajún o barbecue tejana. Esta es la Houston que ninguna guía turística da primero." },
      ],
    },
    {
      day:5,
      title:"Portugal define el grupo o NASA",
      subtitle:"Houston Stadium · Mar 23 Jun · Space Center Houston",
      isMatchDay:true,
      matchRef:"m4",
      steps:[
        { time:"Opción partido",  text:"Portugal vs. Uzbekistán. Segundo partido de Portugal en Houston y definición del Grupo K. Misma regla de mediodía: desayuno temprano, Red Line y llegada 90 minutos antes." },
        { time:"Opción libre",  text:"Space Center Houston: centro de visitantes del Johnson Space Center de la NASA, a 40 km al sureste del centro. Saturno V, simuladores de misión y tours al Mission Control histórico." },
        { time:"Tarde",   text:"Si el partido fue al mediodía, el 4 de julio o cualquier día de eliminación dejan la tarde libre para hotel, piscina o Kemah Boardwalk." },
        { time:"Noche",   text:"Clé Houston para pantalla nocturna con terraza si baja la temperatura, o Richmond Arms si el plan pide pub inglés serio." },
      ],
    },
  ],

  // ── SIDEBAR — contenido real ───────────────────────────────────────────────
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
};

// ─────────────────────────────────────────────────────────────────────────────
// CITY ILLUSTRATION — Houston
// ─────────────────────────────────────────────────────────────────────────────
const VanIllustration = () => (
  <svg viewBox="0 0 280 140" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width:"100%", height:"100%" }}>
    <rect width="280" height="140" fill="#E8F0EC" rx={RADIUS} />
    {/* Water / False Creek */}
    <rect x="0" y="95" width="280" height="45" fill="#D8E5EE" />
    {/* Mountains — North Shore */}
    <polygon points="0,95 45,40 90,95"  fill="#4A7A6A" opacity="0.5" />
    <polygon points="40,95 90,28 140,95" fill="#2D4F4A" opacity="0.55" />
    <polygon points="90,95 145,32 200,95" fill="#3D6A5A" opacity="0.45" />
    <polygon points="155,95 200,52 245,95" fill="#4A7A6A" opacity="0.35" />
    {/* Snow caps */}
    <polygon points="90,28 102,46 78,46"  fill="white" opacity="0.85" />
    <polygon points="145,32 155,48 135,48" fill="white" opacity="0.7" />
    <polygon points="45,40 53,55 37,55"  fill="white" opacity="0.6" />
    {/* City skyline — Downtown */}
    <rect x="16" y="72" width="7"  height="23" fill="#2D4F6C" opacity="0.3" rx={1} />
    <rect x="27" y="64" width="9"  height="31" fill="#2D4F6C" opacity="0.35" rx={1} />
    <rect x="40" y="68" width="6"  height="27" fill="#2D4F6C" opacity="0.25" rx={1} />
    <rect x="50" y="60" width="8"  height="35" fill="#2D4F6C" opacity="0.3" rx={1} />
    <rect x="62" y="70" width="5"  height="25" fill="#2D4F6C" opacity="0.2" rx={1} />
    {/* Stadium dome */}
    <ellipse cx="226" cy="88" rx="30" ry="12" fill="#2D4F6C" opacity="0.18" />
    <rect x="196" y="76" width="60" height="12" fill="#2D4F6C" opacity="0.15" rx={2} />
    {/* Stadium roof arc */}
    <path d="M196,76 Q226,60 256,76" stroke="#2D4F6C" strokeWidth="1.5" fill="none" opacity="0.3" />
    {/* SkyTrain line hint */}
    <line x1="0" y1="93" x2="180" y2="93" stroke="#6B8F86" strokeWidth="1" opacity="0.4" strokeDasharray="4,3" />
    {/* Flag */}
    <text x="258" y="48" fontSize="20" textAnchor="middle">🇨🇦</text>
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// PRIMITIVE COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
const Card = ({ children, style={}, onClick, hover=false }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => hover && setIsHovered(true)}
      onMouseLeave={() => hover && setIsHovered(false)}
      style={{ background:T.white, border:`1px solid ${T.sandDark}`, borderRadius:RADIUS,
        boxShadow: isHovered?"0 3px 12px rgba(28,28,26,0.09)":CARD_SHADOW,
        transition:"box-shadow 0.18s, transform 0.18s",
        transform: isHovered?"translateY(-1px)":"none",
        cursor: onClick?"pointer":"default", ...style }}>
      {children}
    </div>
  );
};

const Divider = ({ my=40 }) => <div style={{ height:1, background:T.sandDark, margin:`${my}px 0` }} />;

const SectionHeader = ({ number, title, subtitle }) => (
  <div style={{ marginBottom:24 }}>
    <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:6 }}>
      <span style={{ ...uf(10,700), letterSpacing:"0.18em", textTransform:"uppercase", color:T.coral }}>{number}</span>
      <div style={{ flex:1, height:1, background:T.sandDark }} />
    </div>
    <h2 style={{ ...uf(26, 700), color:T.pine, lineHeight:1.1, marginBottom:subtitle?6:0 }}>{title}</h2>
    {subtitle && <p style={{ ...uf(14,400), color:T.inkMid, lineHeight:1.6, margin:0, maxWidth:520 }}>{subtitle}</p>}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MATCH CARD
// ─────────────────────────────────────────────────────────────────────────────
const MatchCard = ({ match, onPlanAround }) => {
  const isTBD = !match.teams[0].flag && !match.teams[1].flag;
  const bgColor = match.highlight ? T.matchGoldLight : T.white;
  const borderColor = match.highlight ? `${T.matchGold}50` : T.sandDark;
  const accentBar = match.highlight ? T.matchGold : isTBD ? T.sandDark : CITY_ACCENT;

  return (
    <Card style={{ overflow:"hidden", borderColor, opacity: isTBD ? 0.6 : 1 }}>
      <div style={{ height:3, background:accentBar }} />
      <div style={{ padding:"18px 20px", background:bgColor }}>
        {/* Date + tag row */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ textAlign:"center", minWidth:44, padding:"6px 10px", background:T.sand, borderRadius:6 }}>
              <div style={{ ...uf(9,600), letterSpacing:"0.1em", textTransform:"uppercase", color:T.inkFaint }}>{match.day}</div>
              <div style={{ ...df(18,700), color:T.pine, lineHeight:1.1 }}>{match.date.split(" ")[0]}</div>
              <div style={{ ...uf(9,500), color:T.inkFaint }}>{match.date.split(" ")[1]}</div>
            </div>
            <div>
              <div style={{ ...uf(11,600), color:T.inkFaint, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:2 }}>
                {match.stadium}
              </div>
              <div style={{ ...uf(12,500), color:T.inkFaint }}>{match.time} local</div>
            </div>
          </div>
          {match.tag && (
            <span style={{ ...uf(9,700), letterSpacing:"0.1em", textTransform:"uppercase",
              color: match.highlight ? T.matchGold : CITY_ACCENT,
              background: match.highlight ? T.matchGoldLight : CITY_ACCENT+"18",
              border:`1px solid ${match.highlight ? T.matchGold : CITY_ACCENT}40`,
              padding:"3px 9px", borderRadius:40, flexShrink:0,
            }}>{match.tag}</span>
          )}
        </div>

        {/* Teams */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:16,
          padding:"14px 0", borderTop:`1px solid ${T.sandDark}`, borderBottom:`1px solid ${T.sandDark}`, marginBottom:14 }}>
          <div style={{ flex:1, textAlign:"right" }}>
            <div style={{ ...df(15,700), color:T.ink, marginBottom:2 }}>{match.teams[0].name}</div>
            {match.teams[0].flag && <div style={{ fontSize:24 }}>{match.teams[0].flag}</div>}
          </div>
          <div style={{ ...uf(12,600), color:T.inkFaint, letterSpacing:"0.1em", padding:"5px 12px", background:T.sand, borderRadius:6 }}>
            vs
          </div>
          <div style={{ flex:1, textAlign:"left" }}>
            <div style={{ ...df(15,700), color:T.ink, marginBottom:2 }}>{match.teams[1].name}</div>
            {match.teams[1].flag && <div style={{ fontSize:24 }}>{match.teams[1].flag}</div>}
          </div>
        </div>

        {/* CTA */}
        {!isTBD && (
          <button onClick={() => onPlanAround && onPlanAround(match)} style={{
            width:"100%", padding:"9px",
            background:"transparent", border:`1px solid ${T.sandDark}`, borderRadius:RADIUS-2,
            ...uf(10,600), letterSpacing:"0.1em", textTransform:"uppercase", color:T.inkMid,
            cursor:"pointer", transition:"all 0.18s", display:"flex", alignItems:"center", justifyContent:"center", gap:8,
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor=CITY_ACCENT; e.currentTarget.style.color=T.pine; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor=T.sandDark; e.currentTarget.style.color=T.inkMid; }}
          >
            <span style={{ fontSize:13 }}>✦</span> Planear mi viaje alrededor de este partido
          </button>
        )}
        {isTBD && (
          <div style={{ ...uf(11,400), color:T.inkFaint, textAlign:"center", padding:"8px 0" }}>
            Rival por definir al terminar fase de grupos
          </div>
        )}
      </div>
    </Card>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ITINERARY DAY
// ─────────────────────────────────────────────────────────────────────────────
const ItineraryDay = ({ day, matchMap }) => {
  const [open, setOpen] = useState(day.isMatchDay);
  const match = day.matchRef ? matchMap[day.matchRef] : null;

  return (
    <Card style={{ overflow:"hidden", borderColor: day.isMatchDay ? `${T.matchGold}50` : T.sandDark }} hover>
      {day.isMatchDay && <div style={{ height:3, background:T.matchGold }} />}
      <button onClick={() => setOpen(!open)} style={{ width:"100%", padding:"17px 20px", display:"flex", alignItems:"center", gap:14, background:"transparent", border:"none", cursor:"pointer", textAlign:"left" }}>
        <div style={{ width:34, height:34, background:day.isMatchDay?T.matchGold:T.sageLight, borderRadius:"50%",
          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <span style={{ ...uf(12,700), color:day.isMatchDay?T.white:T.pine }}>{day.day}</span>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:2 }}>
            <span style={{ ...df(15,700), color:T.pine }}>{day.title}</span>
            {day.isMatchDay && (
              <span style={{ ...uf(9,700), letterSpacing:"0.1em", textTransform:"uppercase",
                color:T.matchGold, background:T.matchGoldLight, padding:"2px 7px", borderRadius:40, border:`1px solid ${T.matchGold}40` }}>
                Día de partido
              </span>
            )}
          </div>
          <span style={{ ...uf(11,400), color:T.inkFaint }}>{day.subtitle}</span>
        </div>
        <div style={{ width:26, height:26, border:`1px solid ${T.sandDark}`, borderRadius:"50%",
          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
          transform:open?"rotate(180deg)":"none", transition:"transform 0.2s" }}>
          <span style={{ ...uf(11,600), color:T.inkMid, lineHeight:1 }}>↓</span>
        </div>
      </button>

      {open && (
        <div style={{ borderTop:`1px solid ${T.sandDark}`, padding:"4px 20px 18px" }}>
          {match && (
            <div style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 13px",
              background:T.matchGoldLight, border:`1px solid ${T.matchGold}40`, borderRadius:RADIUS-2, margin:"12px 0 18px" }}>
              <span style={{ fontSize:16 }}>⚽</span>
              <div>
                <div style={{ ...uf(10,700), letterSpacing:"0.1em", textTransform:"uppercase", color:T.matchGold, marginBottom:1 }}>
                  {match.date} · {match.time}
                </div>
                <div style={{ ...uf(13,600), color:T.ink }}>
                  {match.teams[0].flag} {match.teams[0].name} vs {match.teams[1].flag} {match.teams[1].name}
                </div>
              </div>
            </div>
          )}
          {day.steps.map((step, i) => (
            <div key={i} style={{ display:"flex", gap:14,
              paddingTop:14, paddingBottom: i<day.steps.length-1?14:0,
              borderBottom: i<day.steps.length-1?`1px solid ${T.sandDark}`:"none" }}>
              <div style={{ width:58, flexShrink:0, paddingTop:2 }}>
                <span style={{ ...uf(10,600), color:T.inkFaint, letterSpacing:"0.04em" }}>{step.time}</span>
              </div>
              <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.7, margin:0 }}>{step.text}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STAY CARD
// ─────────────────────────────────────────────────────────────────────────────
const StayCard = ({ stay }) => (
  <Card hover style={{ display:"flex", flexDirection:"column", height:"100%" }}>
    <div style={{ padding:"18px 18px 0" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
        <span style={{ ...df(22,700), color:T.pine }}>{stay.price}</span>
        <Label color={T.sage} bg={T.sageLight}>{stay.best_for}</Label>
      </div>
      <div style={{ ...df(16,700), color:T.pine, lineHeight:1.2, marginBottom:3 }}>{stay.name}</div>
      <div style={{ ...uf(11,500), color:T.inkFaint, marginBottom:6 }}>{stay.area}</div>
      {stay.priceCAD && (
        <div style={{ ...uf(11,600), color:CITY_ACCENT, marginBottom:10, letterSpacing:"0.04em" }}>{stay.priceCAD}</div>
      )}
      <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:10 }}>
        {stay.tags.map(tag => (
          <span key={tag} style={{ ...uf(9,600), letterSpacing:"0.08em", textTransform:"uppercase",
            color:T.inkFaint, background:T.sand, padding:"2px 7px", borderRadius:4 }}>{tag}</span>
        ))}
      </div>
      <p style={{ ...uf(12,400), color:T.inkMid, lineHeight:1.6 }}>{stay.note}</p>
    </div>
    <div style={{ marginTop:"auto", padding:"12px 18px", borderTop:`1px solid ${T.sandDark}` }}>
      <a href={stay.url || "#"} target={stay.url ? "_blank" : undefined} rel="noopener noreferrer" style={{
        display:"block", textAlign:"center", width:"100%", padding:"9px", borderRadius:RADIUS-2,
        background: stay.url ? T.pine : T.sandDark,
        ...uf(9,700), letterSpacing:"0.1em", textTransform:"uppercase", color:T.white,
        textDecoration:"none", transition:"opacity 0.18s",
        pointerEvents: stay.url ? "auto" : "none", opacity: stay.url ? 1 : 0.45,
      }}
        onMouseEnter={e => { if (stay.url) e.currentTarget.style.opacity="0.85"; }}
        onMouseLeave={e => { if (stay.url) e.currentTarget.style.opacity="1"; }}>
        Ver opciones →
      </a>
    </div>
  </Card>
);

// ─────────────────────────────────────────────────────────────────────────────
// EXPERIENCE CARD
// ─────────────────────────────────────────────────────────────────────────────
const ExperienceCard = ({ item }) => (
  <Card hover style={{ padding:"16px 18px", display:"flex", flexDirection:"column", gap:9 }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
      <span style={{ ...uf(9,700), letterSpacing:"0.1em", textTransform:"uppercase",
        color:item.typeColor, background:item.typeColor+"18", padding:"3px 8px", borderRadius:40 }}>
        {item.type}
      </span>
      <span style={{ ...uf(9,600), letterSpacing:"0.08em", textTransform:"uppercase",
        color:T.inkFaint, background:T.sand, padding:"3px 7px", borderRadius:40 }}>
        {item.tag}
      </span>
    </div>
    <div style={{ ...df(15,700), color:T.pine, lineHeight:1.2 }}>{item.title}</div>
    <p style={{ ...uf(12,400), color:T.inkMid, lineHeight:1.65, margin:0 }}>{item.desc}</p>
  </Card>
);

// ─────────────────────────────────────────────────────────────────────────────
// LOGISTICS CARD
// ─────────────────────────────────────────────────────────────────────────────
const LogisticsCard = ({ item }) => (
  <Card style={{ display:"flex", gap:14, padding:"14px 18px", alignItems:"flex-start",
    borderColor: item.isWarning?`${T.coral}50`:T.sandDark,
    background: item.isWarning?T.coralLight:T.white }}>
    <div style={{ width:36, height:36, flexShrink:0, background:item.isWarning?T.coral+"20":T.sageLight,
      borderRadius:RADIUS-2, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>
      {item.icon}
    </div>
    <div>
      <div style={{ ...uf(13,700), color:item.isWarning?T.coral:T.pine, marginBottom:4 }}>{item.title}</div>
      <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.65, margin:0 }}>{item.text}</p>
    </div>
  </Card>
);

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────
const GuideSidebar = ({ guide, onPlan }) => {
  const [checked, setChecked] = useState({});
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

      {/* CTA primario */}
      <Card style={{ padding:"22px", background:T.pine, border:"none" }}>
        <Label color={T.sage} style={{ marginBottom:10, display:"block" }}>Lagomplan · Planificador</Label>
        <p style={{ ...uf(17, 700), color:T.sand, lineHeight:1.3, marginBottom:14 }}>
          Arma tu ruta alrededor de los partidos.
        </p>
        <button onClick={onPlan} style={{ width:"100%", padding:"12px", background:T.coral, border:"none",
          borderRadius:RADIUS-2, ...uf(10,700), letterSpacing:"0.12em", textTransform:"uppercase",
          color:T.white, cursor:"pointer" }}
          onMouseEnter={e => e.currentTarget.style.opacity="0.88"}
          onMouseLeave={e => e.currentTarget.style.opacity="1"}>
          {guide.plannerCTA} →
        </button>
      </Card>

      {/* Notas Lagom */}
      <Card style={{ padding:"18px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
          <div style={{ width:26, height:26, background:T.sageLight, borderRadius:RADIUS-2,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontSize:13 }}>✦</span>
          </div>
          <Label color={T.pine}>Notas Lagom</Label>
        </div>
        {guide.lagomTips.map((tip, i) => (
          <div key={i} style={{ display:"flex", gap:9,
            paddingTop:10, paddingBottom:10,
            borderBottom: i<guide.lagomTips.length-1?`1px solid ${T.sandDark}`:"none" }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:T.sage, flexShrink:0, marginTop:6 }} />
            <p style={{ ...uf(12,400), color:T.inkMid, lineHeight:1.65, margin:0 }}>{tip}</p>
          </div>
        ))}
      </Card>

      {/* Checklist día de partido */}
      <Card style={{ padding:"18px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
          <div style={{ width:26, height:26, background:T.matchGoldLight, borderRadius:RADIUS-2,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontSize:13 }}>☑</span>
          </div>
          <Label color={T.pine}>Checklist día de partido</Label>
        </div>
        {guide.matchDayChecklist.map((item, i) => (
          <button key={i} onClick={() => setChecked(p => ({...p,[i]:!p[i]}))} style={{
            display:"flex", alignItems:"flex-start", gap:9, padding:"7px 0",
            borderTop: i>0?`1px solid ${T.sandDark}`:"none",
            background:"transparent", border:"none", cursor:"pointer", textAlign:"left", width:"100%",
          }}>
            <div style={{ width:15, height:15, flexShrink:0, marginTop:2,
              border:`1.5px solid ${checked[i]?T.sage:T.sandDark}`, borderRadius:3,
              background:checked[i]?T.sage:"transparent",
              display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.15s" }}>
              {checked[i] && <span style={{ color:T.white, fontSize:9, lineHeight:1 }}>✓</span>}
            </div>
            <span style={{ ...uf(12,400), color:checked[i]?T.inkFaint:T.inkMid, lineHeight:1.5,
              textDecoration:checked[i]?"line-through":"none", transition:"all 0.15s" }}>
              {item}
            </span>
          </button>
        ))}
      </Card>

      {/* ¿Sabías que? */}
      <Card style={{ padding:"16px 18px", background:T.fjordLight, borderColor:`${T.fjord}30` }}>
        <Label color={T.fjord} style={{ marginBottom:8, display:"block" }}>¿Sabías que?</Label>
        <p style={{ ...uf(12,400), color:T.fjord, lineHeight:1.65, margin:0 }}>{guide.didYouKnow}</p>
      </Card>

      {/* IA — optimizar */}
      <Card style={{ padding:"14px 18px", borderStyle:"dashed" }}>
        <div style={{ display:"flex", gap:9, alignItems:"flex-start" }}>
          <span style={{ fontSize:16, flexShrink:0 }}>✦</span>
          <div>
            <div style={{ ...uf(11,700), color:T.pine, marginBottom:4 }}>Optimizar itinerario con IA</div>
            <p style={{ ...uf(11,400), color:T.inkMid, lineHeight:1.6, margin:"0 0 9px" }}>
              Dinos cuántos días tienes y cuáles partidos quieres ver. La IA arma la ruta.
            </p>
            <button onClick={onPlan} style={{ ...uf(9,700), letterSpacing:"0.1em", textTransform:"uppercase",
              color:T.pine, background:"none", border:`1px solid ${T.pine}`, borderRadius:RADIUS-2,
              padding:"6px 12px", cursor:"pointer" }}>
              Optimizar ruta →
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// GUIDE HERO
// ─────────────────────────────────────────────────────────────────────────────
const GuideHero = ({ guide }) => (
  <div style={{ display:"grid", gridTemplateColumns:"1fr 260px", gap:36, alignItems:"center",
    padding:"44px 0 36px", borderBottom:`1px solid ${T.sandDark}`, marginBottom:36 }}>
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
        <span style={{ fontSize:20 }}>{guide.flag}</span>
        <Label color={T.inkFaint}>{guide.country} · {guide.state}</Label>
        <span style={{ color:T.sandDark }}>·</span>
        <Label color={T.inkFaint}>{guide.stadium.name}</Label>
        <span style={{ color:T.sandDark }}>·</span>
        <Label color={T.inkFaint}>{guide.stadium.capacity}</Label>
      </div>
      <h1 style={{ ...uf("clamp(40px,5.5vw,68px)", 900), color:T.pine, lineHeight:0.95,
        letterSpacing:"-0.03em", marginBottom:18 }}>
        {guide.city}
      </h1>
      <p style={{ ...uf(15,400), color:T.inkMid, lineHeight:1.7, maxWidth:460, marginBottom:22 }}>
        {guide.description}
      </p>
      <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginBottom:22 }}>
        {guide.tags.map(tag => (
          <span key={tag} style={{ ...uf(10,600), letterSpacing:"0.1em", textTransform:"uppercase",
            color:T.pine, background:T.sageLight, border:`1px solid ${T.sage}30`,
            padding:"5px 12px", borderRadius:40 }}>{tag}</span>
        ))}
        <span style={{ ...uf(10,600), letterSpacing:"0.1em", textTransform:"uppercase",
          color:T.matchGold, background:T.matchGoldLight, border:`1px solid ${T.matchGold}30`,
          padding:"5px 12px", borderRadius:40 }}>
          ⚽ {guide.matches.length} partidos
        </span>
      </div>
      <div style={{ display:"flex", gap:18, flexWrap:"wrap" }}>
        {guide.scores.map(s => (
          <div key={s.label} style={{ display:"flex", alignItems:"center", gap:5 }}>
            <Label color={T.inkFaint}>{s.label}</Label>
            <div style={{ display:"flex", gap:2 }}>
              {[1,2,3,4,5].map(i => (
                <div key={i} style={{ width:5, height:5, borderRadius:"50%",
                  background: i<=s.value ? T.sage : T.sandDark }} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
    <div style={{ height:190, borderRadius:RADIUS, overflow:"hidden" }}>
      <VanIllustration />
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// STICKY NAV
// ─────────────────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  {id:"matches",   label:"Partidos"},
  {id:"manifesto", label:"Manifiesto"},
  {id:"itinerary", label:"Itinerario"},
  {id:"stays",     label:"Dónde dormir"},
  {id:"vibe",      label:"Ambiente"},
  {id:"logistics", label:"Logística"},
];

const StickyNav = ({ active, onNavigate, onBack }) => (
  <div style={{ position:"sticky", top:0, zIndex:40,
    background:`${T.bg}F2`, backdropFilter:"blur(16px)",
    borderBottom:`1px solid ${T.sandDark}`, height:50,
    display:"flex", alignItems:"center", padding:"0 32px", gap:0, overflowX:"auto" }}>
    <button onClick={onBack} style={{ ...uf(11,500), color:T.inkFaint, background:"none", border:"none",
      cursor:"pointer", padding:"0 12px 0 0", marginRight:12,
      borderRight:`1px solid ${T.sandDark}`, whiteSpace:"nowrap", letterSpacing:"0.06em" }}>
      ← Guías
    </button>
    <span style={{ ...uf(14, 700), color:T.pine, marginRight:18, whiteSpace:"nowrap" }}>Houston</span>
    <div style={{ width:1, height:20, background:T.sandDark, marginRight:4 }} />
    {NAV_ITEMS.map(item => (
      <button key={item.id} onClick={() => onNavigate(item.id)} style={{
        ...uf(10, active===item.id?700:500),
        letterSpacing:"0.08em", textTransform:"uppercase",
        color: active===item.id?T.pine:T.inkFaint,
        background:"none", border:"none", padding:"0 12px", height:"100%",
        cursor:"pointer",
        borderBottom:`2px solid ${active===item.id?T.coral:"transparent"}`,
        transition:"all 0.18s", whiteSpace:"nowrap", flexShrink:0,
      }}>{item.label}</button>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// GUIDE DETAIL — main layout
// ─────────────────────────────────────────────────────────────────────────────
const GuideDetail = ({ guide, onBack }) => {
  const [active, setActive] = useState("matches");
  const matchMap = Object.fromEntries(guide.matches.map(m => [m.id, m]));

  useEffect(() => {
    const observers = [];
    NAV_ITEMS.forEach(item => {
      const el = document.getElementById(item.id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(item.id); },
        { rootMargin:"-30% 0px -65% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const scrollTo = id => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior:"smooth", block:"start" });
  };

  return (
    <div style={{ background:T.bg, minHeight:"100vh" }}>
      <StickyNav active={active} onNavigate={scrollTo} onBack={onBack} />

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 32px" }}>
        <GuideHero guide={guide} />

        {/* TWO-COLUMN LAYOUT */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 304px", gap:44, alignItems:"flex-start" }}>

          {/* ── MAIN ── */}
          <div>

            {/* 01 — MATCHES */}
            <section id="matches" style={{ marginBottom:52, scrollMarginTop:60 }}>
              <SectionHeader number="01" title="Tus partidos"
                subtitle="7 partidos confirmados en Houston Stadium: cinco de grupos, Ronda de 32 y Ronda de 16." />
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))", gap:14 }}>
                {guide.matches.map(match => (
                  <MatchCard key={match.id} match={match} onPlanAround={() => {}} />
                ))}
              </div>
            </section>

            {/* 02 — MANIFIESTO */}
            <section id="manifesto" style={{ marginBottom:52, scrollMarginTop:60 }}>
              <SectionHeader number="02" title="Manifiesto de campo"
                subtitle="Lo que necesitas saber antes de llegar." />

              {/* Stadium metadata */}
              <Card style={{ marginBottom:20, overflow:"hidden" }}>
                <div style={{ height:3, background:CITY_ACCENT }} />
                <div style={{ padding:"18px 20px" }}>
                  {guide.manifesto.stadiumInfo.map((item, i) => (
                    <div key={i} style={{ display:"flex", gap:16, padding:"9px 0",
                      borderBottom: i<guide.manifesto.stadiumInfo.length-1?`1px solid ${T.sandDark}`:"none" }}>
                      <span style={{ ...uf(11,600), color:T.inkFaint, minWidth:140, flexShrink:0,
                        letterSpacing:"0.06em" }}>{item.label}</span>
                      <span style={{ ...uf(13,500), color:T.ink, lineHeight:1.5 }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <p style={{ ...uf(15,400), color:T.ink, lineHeight:1.85, marginBottom:20 }}>
                {guide.manifesto.body}
              </p>

              {/* Lagom note */}
              <div style={{ display:"flex", gap:14, padding:"16px 18px", background:T.sandLight,
                borderLeft:`3px solid ${T.sage}`, borderRadius:`0 ${RADIUS}px ${RADIUS}px 0` }}>
                <span style={{ ...uf(9,700), color:T.sage, fontWeight:700, letterSpacing:"0.12em",
                  textTransform:"uppercase", flexShrink:0, marginTop:2 }}>Lagom</span>
                <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.75, margin:0 }}>
                  {guide.manifesto.lagomNote}
                </p>
              </div>
            </section>

            {/* 03 — ITINERARY */}
            <section id="itinerary" style={{ marginBottom:52, scrollMarginTop:60 }}>
              <SectionHeader number="03" title="Ruta sugerida — 5 días"
                subtitle="Construida alrededor de Portugal, partidos de mediodía y la ruta directa del METRORail." />
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {guide.itinerary.map(day => (
                  <ItineraryDay key={day.day} day={day} matchMap={matchMap} />
                ))}
              </div>
            </section>

            {/* 04 — STAYS */}
            <section id="stays" style={{ marginBottom:52, scrollMarginTop:60 }}>
              <SectionHeader number="04" title="Dónde dormir"
                subtitle="Tres bases reales para descansar entre el estadio climatizado, Bellaire y el calor de Houston." />
              <div style={{ marginBottom:14, padding:"12px 16px", background:T.coralLight,
                border:`1px solid ${T.coral}40`, borderRadius:RADIUS }}>
                <div style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
                  <span style={{ fontSize:14, flexShrink:0 }}>⚠️</span>
                  <p style={{ ...uf(12,400), color:T.inkMid, lineHeight:1.6, margin:0 }}>
                    Los precios indicados son estimaciones para el periodo mundialista. Portugal juega dos veces en Houston y el 4 de julio añade demanda de Ronda de 16.
                    Si no tienes reserva confirmada, busca opciones en <strong>Midtown</strong>, <strong>Museum District</strong> o <strong>Montrose</strong> con acceso razonable al METRORail.
                  </p>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))", gap:14 }}>
                {guide.stays.map(stay => (
                  <StayCard key={stay.name} stay={stay} />
                ))}
              </div>
            </section>

            {/* 05 — VIBE / AMBIENTE */}
            <section id="vibe" style={{ marginBottom:52, scrollMarginTop:60 }}>
              <SectionHeader number="05" title="Siente el ambiente"
                subtitle="Fan Fest oficial, parques con pantallas, pubs de fútbol y el golfo como plan alterno." />

              {/* Vibe body text */}
              <p style={{ ...uf(14,400), color:T.inkMid, lineHeight:1.8, marginBottom:20 }}>
                {guide.vibe.body}
              </p>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:16 }}>
                {guide.vibeCards.map(item => (
                  <ExperienceCard key={item.title} item={item} />
                ))}
              </div>

              {/* Lagom note vibe */}
              <div style={{ display:"flex", gap:14, padding:"16px 18px", background:T.sandLight,
                borderLeft:`3px solid ${T.sage}`, borderRadius:`0 ${RADIUS}px ${RADIUS}px 0` }}>
                <span style={{ ...uf(9,700), color:T.sage, letterSpacing:"0.12em", textTransform:"uppercase",
                  flexShrink:0, marginTop:2 }}>Lagom</span>
                <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.75, margin:0 }}>{guide.vibe.lagomNote}</p>
              </div>
            </section>

            {/* 06 — LOGISTICS */}
            <section id="logistics" style={{ marginBottom:52, scrollMarginTop:60 }}>
              <SectionHeader number="06" title="Llegar al estadio"
                subtitle="METRORail directo al estadio y una advertencia: el estadio tiene A/C, la calle no." />

              <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:20 }}>
                {guide.logistics.transport.map((item, i) => (
                  <LogisticsCard key={i} item={item} />
                ))}
              </div>

              {/* Timings table */}
              <Card style={{ marginBottom:20 }}>
                <div style={{ padding:"16px 18px" }}>
                  <div style={{ ...uf(10,700), letterSpacing:"0.14em", textTransform:"uppercase",
                    color:T.inkFaint, marginBottom:12 }}>Tiempos reales de desplazamiento</div>
                  {guide.logistics.timings.map((t, i) => (
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                      padding:"9px 0", borderBottom: i<guide.logistics.timings.length-1?`1px solid ${T.sandDark}`:"none" }}>
                      <span style={{ ...uf(12,400), color:T.inkMid }}>{t.label}</span>
                      <span style={{ ...uf(12,600), color:T.pine }}>{t.value}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Match day cronología */}
              <Card style={{ overflow:"hidden" }}>
                <div style={{ height:3, background:T.matchGold }} />
                <div style={{ padding:"18px 20px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:16 }}>
                    <span style={{ fontSize:16 }}>⚽</span>
                    <div style={{ ...uf(11,700), letterSpacing:"0.12em", textTransform:"uppercase", color:T.matchGold }}>
                      Cronología recomendada
                    </div>
                    <span style={{ ...uf(12,600), color:T.ink }}>{guide.logistics.matchDayCronologia.matchName}</span>
                  </div>
                  {guide.logistics.matchDayCronologia.steps.map((step, i) => (
                    <div key={i} style={{ display:"flex", gap:14,
                      paddingTop: i>0?12:0, paddingBottom: i<guide.logistics.matchDayCronologia.steps.length-1?12:0,
                      borderBottom: i<guide.logistics.matchDayCronologia.steps.length-1?`1px solid ${T.sandDark}`:"none" }}>
                      <span style={{ ...uf(10,700), color:T.matchGold, minWidth:44, flexShrink:0,
                        letterSpacing:"0.04em", paddingTop:1 }}>{step.time}</span>
                      <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.65, margin:0 }}>{step.text}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Timing note */}
              <div style={{ display:"flex", gap:10, marginTop:14, padding:"12px 16px",
                background:T.sandLight, border:`1px solid ${T.sandDark}`, borderRadius:RADIUS }}>
                <span style={{ fontSize:15, flexShrink:0 }}>💡</span>
                <p style={{ ...uf(12,400), color:T.inkMid, lineHeight:1.65, margin:0 }}>
                  {guide.logistics.timing}
                </p>
              </div>
            </section>

            {/* 07 — FOOD */}
            <section style={{ marginBottom:52 }}>
              <SectionHeader number="07" title="Dónde comer"
                subtitle="Vietnamita, barbecue, pubs de fútbol y la cocina que explica la diversidad de Houston." />
              <div style={{ display:"flex", flexDirection:"column" }}>
                {guide.food.map((f, i) => (
                  <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr auto auto",
                    alignItems:"center", gap:14, padding:"13px 0",
                    borderBottom: i<guide.food.length-1?`1px solid ${T.sandDark}`:"none" }}>
                    <div>
                      <span style={{ ...uf(13,600), color:T.pine }}>{f.dish}</span>
                      <span style={{ ...uf(12,400), color:T.inkFaint, marginLeft:8 }}>— {f.where}</span>
                    </div>
                    <Label bg={T.sageLight} color={T.sage}>{f.type}</Label>
                    <span style={{ ...uf(12,500), color:T.inkFaint, textAlign:"right" }}>{f.price}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 08 — EXPERIENCES */}
            <section style={{ marginBottom:52 }}>
              <SectionHeader number="08" title="Fuera del estadio"
                subtitle="Museos gratuitos, NASA, Hermann Park y Bellaire para entender la ciudad entre partidos." />
              <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
                {guide.experiences.map((exp, i) => (
                  <div key={i} style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:"0 20px" }}>
                    <div style={{ ...df(30,900), color:T.sandDark, lineHeight:1, userSelect:"none",
                      paddingTop:3, width:36, textAlign:"right" }}>
                      {String(i+1).padStart(2,"0")}
                    </div>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:5 }}>
                        <span style={{ ...uf(14,600), color:T.pine }}>{exp.title}</span>
                        <Label bg={T.fjordLight} color={T.fjord}>{exp.type}</Label>
                        <span style={{ ...uf(11,400), color:T.inkFaint }}>{exp.duration}</span>
                      </div>
                      <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.75, margin:0 }}>{exp.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 09 — CIERRE */}
            <section style={{ paddingBottom:0 }}>
              <div style={{ width:36, height:3, background:T.coral, marginBottom:22 }} />
              <blockquote style={{ ...uf(21, 400), color:T.pine, lineHeight:1.65,
                margin:"0 0 14px", maxWidth:560, borderLeft:`3px solid ${T.coral}`, paddingLeft:22 }}>
                "{guide.closingNote}"
              </blockquote>
              <Label color={T.inkFaint} style={{ paddingLeft:22 }}>{guide.closingSignature}</Label>
            </section>

          </div>

          {/* ── SIDEBAR ── */}
          <div style={{ position:"sticky", top:60, alignSelf:"flex-start", paddingBottom:40 }}>
            <GuideSidebar guide={guide} onPlan={() => alert("Planificador: Houston")} />
          </div>
        </div>

        <div style={{ height:80 }} />
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("guide");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;0,9..144,900;1,9..144,400;1,9..144,700;1,9..144,900&family=Manrope:wght@400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        button{font-family:'Manrope',sans-serif;}
        button:focus-visible{outline:2px solid ${T.coral};outline-offset:2px;}
        ::-webkit-scrollbar{width:5px;height:5px;}
        ::-webkit-scrollbar-track{background:${T.bg};}
        ::-webkit-scrollbar-thumb{background:${T.sandDark};border-radius:3px;}
      `}</style>
      <GuideDetail guide={VANCOUVER} onBack={() => {}} />
    </>
  );
}
