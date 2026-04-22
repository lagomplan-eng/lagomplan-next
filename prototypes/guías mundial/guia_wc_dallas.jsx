"use client";

import { useState, useEffect } from "react";

const T = {
  pine:"#0F3A33", sage:"#6B8F86", sageLight:"#EAF2F0",
  sand:"#EDE7E1", sandLight:"#F7F4F1", sandDark:"#D9D2C9",
  coral:"#E1615B", coralLight:"#FCEEED",
  fjord:"#2D4F6C", fjordLight:"#E3EBF2",
  ink:"#1C1C1A", inkMid:"#5A5A56", inkFaint:"#9A9A94",
  white:"#FFFFFF",
  matchGold:"#B8860B", matchGoldLight:"#FBF5E0",
  bg:"#fff9f3",
};

const RADIUS = 10;
const CARD_SHADOW = "0 1px 3px rgba(28,28,26,0.06)";
const CARD_BORDER = "rgba(28,28,26,0.09)";
const CITY_ACCENT = "#8B2635";
const SECTION_ALT_BG = "#F4F0EB";

const df = (size, weight=400, style="normal") => ({ fontFamily:"'Fraunces',serif", fontSize:size, fontWeight:weight, fontStyle:style });
const uf = (size, weight=400) => ({ fontFamily:"'Manrope',sans-serif", fontSize:size, fontWeight:weight });
const Label = ({ children, color=T.inkFaint, bg="transparent", style={} }) => (
  <span style={{ ...uf(10,600), letterSpacing:"0.13em", textTransform:"uppercase", color, background:bg, padding:bg!=="transparent"?"3px 9px":0, borderRadius:bg!=="transparent"?40:0, ...style }}>
    {children}
  </span>
);

const DAL = {
  id:"dal",
  city:"Dallas",
  country:"EE.UU.",
  state:"Texas",
  flag:"🇺🇸",
  accent: CITY_ACCENT,

  tags:["Fútbol","Argentina","BBQ","Semifinal"],

  stadium:{ name:"AT&T Stadium", capacity:"~80,000", area:"Arlington, Texas — a 25 km al oeste de Dallas" },

  headline:"El estadio más grande del torneo está en Arlington. No en Dallas. Y no hay metro que llegue ahí.",
  description:"El estadio más grande del torneo no está en Dallas — está en Arlington, a 25 km, sin transporte público que llegue. Nueve partidos confirmados, incluyendo dos de Argentina en la fase de grupos y una Semifinal. Cuando los 250,000 inmigrantes argentinos del área metropolitana se sumen a los que viajaron, el AT&T Stadium va a sonar como el Monumental en una final.",

  scores:[
    { label:"Ambiente",     value:5 },
    { label:"Fútbol local", value:3 },
    { label:"Gastronomía",  value:3 },
    { label:"Transporte",   value:3 },
    { label:"Seguridad",    value:4 },
    { label:"Costo",        value:3 },
  ],

  matches:[
    {
      id:"m1", date:"14 Jun", day:"Dom", time:"15:00 CT",
      teams:[{name:"Países Bajos",flag:"🇳🇱"},{name:"Japón",flag:"🇯🇵"}],
      stadium:"AT&T Stadium", tag:"Grupo F", highlight:false,
    },
    {
      id:"m2", date:"17 Jun", day:"Mar", time:"15:00 CT",
      teams:[{name:"Inglaterra",flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿"},{name:"Croacia",flag:"🇭🇷"}],
      stadium:"AT&T Stadium", tag:"Grupo L", highlight:false,
    },
    {
      id:"m3", date:"22 Jun", day:"Lun", time:"12:00 CT",
      teams:[{name:"Argentina",flag:"🇦🇷"},{name:"Austria",flag:"🇦🇹"}],
      stadium:"AT&T Stadium", tag:"Grupo J — Argentina en Dallas", highlight:true,
    },
    {
      id:"m4", date:"25 Jun", day:"Jue", time:"18:00 CT",
      teams:[{name:"Japón",flag:"🇯🇵"},{name:"Rep. UEFA B",flag:""}],
      stadium:"AT&T Stadium", tag:"Grupo F", highlight:false,
    },
    {
      id:"m5", date:"27 Jun", day:"Sáb", time:"21:00 CT",
      teams:[{name:"Argentina",flag:"🇦🇷"},{name:"Jordania",flag:"🇯🇴"}],
      stadium:"AT&T Stadium", tag:"Grupo J — Argentina confirma el grupo en primetime", highlight:true,
    },
    {
      id:"m6", date:"30 Jun", day:"Mar", time:"12:00 CT",
      teams:[{name:"Ronda de 32",flag:""},{name:"Por definir",flag:""}],
      stadium:"AT&T Stadium", tag:"Fase eliminatoria", highlight:false,
    },
    {
      id:"m7", date:"3 Jul", day:"Vie", time:"13:00 CT",
      teams:[{name:"Ronda de 32",flag:""},{name:"Por definir",flag:""}],
      stadium:"AT&T Stadium", tag:"Fase eliminatoria", highlight:false,
    },
    {
      id:"m8", date:"6 Jul", day:"Lun", time:"14:00 CT",
      teams:[{name:"Ronda de 16",flag:""},{name:"Por definir",flag:""}],
      stadium:"AT&T Stadium", tag:"Fase eliminatoria", highlight:false,
    },
    {
      id:"m9", date:"14 Jul", day:"Mar", time:"14:00 CT",
      teams:[{name:"Semifinal",flag:""},{name:"Por definir",flag:""}],
      stadium:"AT&T Stadium", tag:"Semifinal", highlight:true,
    },
  ],

  manifesto:{
    stadiumInfo:[
      { label:"Estadio FIFA",        value:"Dallas Stadium (AT&T Stadium), Arlington, Texas" },
      { label:"Aforo",               value:"~80,000 configuración FIFA — el estadio más grande del torneo. Capacidad histórica máxima: más de 100,000." },
      { label:"Techo",               value:"Retráctil con aire acondicionado — condiciones controladas dentro del recinto" },
      { label:"Clima",               value:"33–38°C días · Humedad moderada · Interior: A/C garantiza confort dentro del estadio" },
      { label:"Partidos",            value:"9 confirmados — el máximo de cualquier sede: 5 grupos + 2 Rondas de 32 + 1 Ronda de 16 + 1 Semifinal" },
      { label:"Ubicación crítica",   value:"Arlington, Texas — a 25 km al oeste de Dallas, 20 km al este de Fort Worth. NO existe transporte público al estadio." },
      { label:"Aeropuertos",         value:"DFW — Dallas/Fort Worth International (18 km del estadio, el más cercano). DAL — Dallas Love Field (30 km, hub doméstico de Southwest Airlines)." },
      { label:"Visa / ESTA",         value:"Ciudadanos de países del Programa de Exención de Visa necesitan ESTA aprobado antes de volar. Otros necesitan visa de turista B-2. Tramita con antelación en travel.state.gov." },
    ],
    body:"Dallas alberga más partidos que cualquier otra sede del torneo — nueve en total, incluyendo una Semifinal y dos Rondas de 32. El estadio es el más grande del Mundial y Argentina juega aquí dos veces en la fase de grupos. Cuando los hinchas albicelestes de la metrópolis de Dallas-Fort Worth — 250,000 personas que no necesitaron comprar vuelo — se sumen a los que sí viajaron, el AT&T Stadium va a sonar como el Monumental en una final de Copa América. Hay una sola instrucción que importa más que cualquier otra en esta guía: no hay metro que llegue al estadio. Arlington es la ciudad más grande de Estados Unidos sin sistema de transporte público propio. Uber, auto propio con parking anticipado o shuttle charter son las tres únicas opciones. Planifica ese segundo tramo con anticipación — no es un detalle, es la mitad del viaje. Calendario completo: 🇳🇱🇯🇵 Dom 14 Jun · 15:00 CT: Países Bajos vs. Japón; 🏴󠁧󠁢󠁥󠁮󠁧󠁿🇭🇷 Mar 17 Jun · 15:00 CT: Inglaterra vs. Croacia; 🇦🇷🇦🇹 Lun 22 Jun · 12:00 CT: Argentina vs. Austria; 🇯🇵 Jue 25 Jun · 18:00 CT: Japón vs. Rep. UEFA B; 🇦🇷🇯🇴 Sáb 27 Jun · 21:00 CT: Argentina vs. Jordania; Mar 30 Jun / Vie 3 Jul: Rondas de 32; Lun 6 Jul: Ronda de 16; Mar 14 Jul: Semifinal.",
    lagomNote:"Los partidos de Argentina (22 y 27 de junio) y la Semifinal (14 de julio) son las tres fechas de mayor demanda en Dallas. Los alojamientos en el corredor de Arlington se agotan meses antes para las noches de partido de Argentina. Si viajas específicamente para esos partidos, busca en Uptown, Addison o Plano — más lejos del estadio pero con mejor calidad de barrio.",
  },

  vibe:{
    body:"Argentina juega dos veces en el estadio más grande del Mundial. Países Bajos, Inglaterra, Japón y Croacia completan el grupo de equipos con mayor volumen de aficionados viajeros del torneo. En el AT&T Stadium con el techo cerrado, el ruido de los hinchas argentinos se amplifica de una manera que ningún otro estadio del torneo va a replicar. Dallas tiene FC Dallas, tiene comunidades latinoamericanas que llenan el estadio para la MLS y tiene la segunda mayor población de inmigrantes mexicanos de Estados Unidos. El fútbol existe y tiene raíces. El Bishop Arts District en Oak Cliff tiene la mejor concentración de restaurantes independientes de la ciudad. Deep Ellum tiene cuarenta años de música en vivo. El Klyde Warren Park en Uptown concentra el ambiente mundialista más accesible de la sede.",
    zones:[],
    lagomNote:"El corredor entre Uptown Dallas y el AT&T Stadium no tiene transporte público. Para los partidos de Argentina (22 y 27 de junio), calcula 35–45 minutos en Uber sin tráfico, 60–90 minutos con tráfico de partido. Solicita el Uber de regreso antes de que termine el partido si usas rideshare.",
  },

  neighborhoods:[
    {
      name:"Uptown Dallas / Knox-Henderson",
      vibe:"Base recomendada. La zona de mayor densidad gastronómica y hotelera de Dallas. Acceso al McKinney Avenue Trolley y al sistema DART. Desde Uptown a Arlington en Uber en día normal: 35–45 minutos. En día de partido con surge: 50–70 minutos.",
      best_for:"Fan WC",
      walk_to_stadium:"35–70 min en Uber (sin metro al estadio)",
      lagomNote:null,
    },
    {
      name:"Las Colinas / Irving",
      vibe:"Opción táctica para el fan que prioriza acceso al estadio. A 20 minutos del AT&T Stadium en auto sin tráfico. Hoteles de cadena bien equipados, acceso rápido a DFW por el DART Orange Line. Sin el ambiente de barrio de Uptown.",
      best_for:"Logística",
      walk_to_stadium:"20–40 min en auto al estadio",
      lagomNote:null,
    },
    {
      name:"Garland / Richardson",
      vibe:"Para aficionados latinoamericanos y argentinos. El corredor de Garland Road y Richardson tiene la mayor concentración de restaurantes latinoamericanos del área metropolitana. El DART Blue Line conecta Richardson con el centro en 25 minutos.",
      best_for:"Comunidad",
      walk_to_stadium:"Uber desde Richardson: 45–60 min al estadio",
      lagomNote:null,
    },
  ],

  stays:[
    {
      name:"The Joule Dallas",
      area:"Downtown Dallas / Main Street",
      price:"$$$",
      priceCAD:"Precio estimado en periodo mundialista: $300–500 USD/noche",
      tags:["Arte contemporáneo","Piscina rooftop","Acceso DART"],
      note:"El hotel más distinguido del downtown histórico: arte contemporáneo en cada piso, piscina en el rooftop con extensión sobre la fachada y CBD Provisions — una de las mejores mesas del centro. Acceso al DART desde la estación West End.",
      best_for:"Hotel boutique",
    },
    {
      name:"Rosewood Mansion on Turtle Creek",
      area:"Uptown / Turtle Creek",
      price:"$$$",
      priceCAD:"Precio estimado en periodo mundialista: $280–450 USD/noche",
      tags:["Mansión restaurada","143 habitaciones","Jardines"],
      note:"La mejor relación calidad-atmósfera de Uptown: 143 habitaciones en una mansión restaurada con jardines y restaurante propio. Más íntimo que los grandes hoteles de cadena.",
      best_for:"Pareja",
    },
    {
      name:"W Dallas — Victory",
      area:"Victory Park / AAC District",
      price:"$$$$",
      priceCAD:"Precio estimado en periodo mundialista: $380–750 USD/noche",
      tags:["Piscina","Spa","DART Victory Station"],
      note:"En el complejo de entretenimiento de Victory Park, a pasos del American Airlines Center. Piscina, spa y servicio Whatever/Whenever. Acceso al DART desde la estación Victory — misma línea que lleva al aeropuerto DFW.",
      best_for:"Lujo",
    },
  ],

  logistics:{
    transport:[
      {
        icon:"✈",
        title:"Llegar a Dallas — DFW o DAL",
        text:"DFW (Dallas/Fort Worth) está a 18 km del AT&T Stadium — el aeropuerto más cercano al estadio del torneo. DART Orange Line desde DFW a Downtown Dallas en 45 min. DAL (Love Field) es hub doméstico de Southwest, a 30 km del estadio. No hay DART desde DAL al estadio — requiere Uber.",
      },
      {
        icon:"🚗",
        title:"Al estadio — sin metro, tres opciones reales",
        text:"1) Auto propio con parking anticipado ($50–150 USD, reserva en sitio oficial del estadio). 2) Rideshare (Uber/Lyft): zona designada alrededor del estadio, 25–40 min desde Uptown, precio surge en partidos de Argentina. 3) Shuttle charter grupal desde hotel — la opción más eficiente para grupos de 6+ personas. Reserva con semanas de anticipación.",
      },
      {
        icon:"🏟",
        title:"Logística de regreso — el momento crítico",
        text:"Si tienes Uber: solicítalo antes de que termine el partido. Si tienes auto: sal en los primeros 15 minutos o espera 45 minutos dentro del recinto — la I-20 y la Highway 360 tardan entre 30 y 90 minutos en despejarse. Para la Semifinal del 14 de julio: calcula el doble de tiempo en todo.",
      },
      {
        icon:"⚠️",
        title:"Error crítico — no hay transporte público al AT&T Stadium",
        text:"Arlington es la ciudad más grande de Estados Unidos sin sistema de transporte público propio. El DART de Dallas no llega a Arlington. El tren DFW no llega al estadio. Quien llega en DART al downtown de Dallas o al aeropuerto DFW necesita un segundo tramo en Uber o auto al estadio. Este tramo no es opcional — es la mitad del viaje.",
        isWarning:true,
      },
    ],
    timings:[
      { label:"Desde Uptown Dallas en Uber (sin tráfico)",          value:"35–45 min" },
      { label:"Desde DFW (aeropuerto) en Uber directo",             value:"20–30 min" },
      { label:"Desde Downtown Dallas en auto por I-30",             value:"25–35 min normales · 60–90 min partido de Argentina" },
      { label:"Desde Irving/Las Colinas en auto",                   value:"15–25 min normales · 40–60 min partido grande" },
    ],
    matchDayCronologia:{
      matchName:"27 Jun · Argentina vs. Jordania · 21:00 CT",
      steps:[
        { time:"H-4:00", text:"Cena temprana en Dallas antes de las 17:00. Los partidos de Argentina de noche son los de mayor demanda de la sede." },
        { time:"H-2:30", text:"Sale hacia Arlington. A las 6:30pm el tráfico hacia el estadio ya está formado." },
        { time:"H-1:30", text:"Entrada al complejo del AT&T Stadium. Las puertas abren 90 minutos antes. El estadio con techo cerrado concentra el ruido albiceleste." },
        { time:"H-0:30", text:"En tu asiento. El A/C compensa el calor de junio. El estadio estará lleno mucho antes del inicio." },
        { time:"H+0:00", text:"Partido. Argentina confirma el grupo. El AT&T Stadium con 250,000 hinchas locales más los que viajaron." },
        { time:"H+1:45", text:"Sal inmediatamente si tienes Uber esperando. Si tienes auto, espera 45 minutos adentro del recinto antes de intentar salir." },
      ],
    },
    timing:"No hay metro. No hay bus. Solo auto propio con parking anticipado, Uber o shuttle charter. Esa es la realidad logística de Arlington y hay que calcularla en cada partido — especialmente en los dos de Argentina y la Semifinal.",
    cost:"Más accesible que las sedes costeras. Los hoteles en Uptown y Downtown son caros en partidos de Argentina y la Semifinal, pero hay más inventario por la escala de la metrópolis. El gasto en transporte al estadio — Uber o parking — es real y hay que sumarlo al presupuesto.",
  },

  vibeCards:[
    {
      title:"FIFA Fan Festival™ — Dallas + Arlington",
      type:"Fan fest oficial",
      typeColor:T.coral,
      desc:"Dallas distribuye su Fan Fest en dos ubicaciones: Kay Bailey Hutchison Convention Center en downtown Dallas (acceso DART) y zona fan satélite en el Entertainment District de Arlington (sin transporte público — mismo problema que el estadio). La zona del Convention Center es la opción para fans sin boleto.",
      tag:"Sin boleto OK",
    },
    {
      title:"Klyde Warren Park (Uptown)",
      type:"Parque urbano",
      typeColor:T.fjord,
      desc:"El parque construido sobre la autopista Woodall Rodgers en el corazón de Uptown instala pantallas durante eventos internacionales. Acceso peatonal desde los hoteles de Uptown y a dos cuadras de la estación de DART. El punto de reunión de los hinchas argentinos del Uptown para los partidos del 22 y 27 de junio.",
      tag:"Uptown",
    },
    {
      title:"The Common Table (Uptown)",
      type:"Bar de fútbol internacional",
      typeColor:T.pine,
      desc:"El bar de fútbol internacional de referencia en Dallas. Premier League los domingos, Champions los miércoles, Mundial las 24 horas durante junio y julio. Pantallas en todos los ángulos y la comunidad de soccer más informada de Uptown. Para los partidos de Argentina (22 y 27 de junio), reserva con días de anticipación.",
      tag:"Reserva necesaria",
    },
    {
      title:"Fair Park (Dallas)",
      type:"Fan zone histórico",
      typeColor:T.sage,
      desc:"El recinto ferial histórico de Dallas — sede de la Feria Estatal de Texas — es el Fan Fest oficial de la sede durante 34 días. El Cotton Bowl (estadio olímpico de 1936) y la escultura de fútbol más grande de Texas están en el mismo predio. El perímetro exterior es punto de reunión adicional.",
      tag:"Historia",
    },
    {
      title:"Billy Bob's Texas (Fort Worth Stockyards)",
      type:"Honky-tonk",
      typeColor:"#5A3A2A",
      desc:"El honky-tonk más grande del mundo en el distrito ganadero de Fort Worth activa sus espacios para transmisiones mundialistas. Ver un partido de Argentina con las botas puestas en una pista de baile country es la combinación más improbable y más auténtica de la sede.",
      tag:"Fort Worth",
    },
    {
      title:"Adair's Saloon (Deep Ellum)",
      type:"Saloon con pantallas",
      typeColor:"#1A3A5C",
      desc:"El honky-tonk más veterano del barrio de música en vivo de Dallas, con pantallas instaladas para el Mundial. Cocina de saloon americano honesta — hamburguesas, papas, sin complicaciones — y clientela que mezcla músicos, aficionados al fútbol y fans de Argentina que descubrieron el local por accidente.",
      tag:"Deep Ellum",
    },
  ],

  food:[
    { dish:"The Common Table",       where:"Uptown — hamburguesa artesanal + IPA de barril; el bar de fútbol más serio de Dallas, reserva para partidos de Argentina",       price:"$$",  type:"Fútbol" },
    { dish:"Truck Yard",             where:"Lower Greenville — food trucks rotativos + cerveza artesanal de Texas; pantalla al aire libre para partidos de mediodía",        price:"$$",  type:"Al aire libre" },
    { dish:"Adair's Saloon",         where:"Deep Ellum — hamburguesa doble + cerveza de lata; Deep Ellum sin filtro con partido en pantalla",                               price:"$",   type:"De barrio" },
    { dish:"BBQ de Texas",           where:"Pecan Lodge (Deep Ellum) o Cattleack (Farmers Branch) — la mejor BBQ del área metropolitana; llega antes de las 11am",        price:"$$",  type:"Imperdible" },
    { dish:"Bishop Arts District",   where:"Oak Cliff — restaurantes independientes de autor a precios razonables; la propuesta gastronómica más seria de Dallas",          price:"$$",  type:"Autor" },
  ],

  experiences:[
    {
      title:"Sixth Floor Museum — Dallas",
      duration:"2–3 horas",
      desc:"El Sixth Floor Museum en el antiguo Texas School Book Depository — desde cuya ventana se dispararon los tiros que mataron a John F. Kennedy en 1963 — es la visita más densa en términos históricos de cualquier sede del torneo. La perspectiva desde el sexto piso sobre Dealey Plaza es perturbadora en el mejor sentido. Entrada: $22 adultos. A dos cuadras, el Dallas Museum of Art tiene colecciones de arte precolombino, africano y asiático con entrada gratuita los viernes de 5 a 9pm.",
      type:"Histórico",
      affiliateLink:"AFFILIATE_LINK_DAL_SIXTHFLOOR",
      affiliateLabel:"Reservar el Sixth Floor Museum",
    },
    {
      title:"Fort Worth Stockyards + Kimbell Art Museum",
      duration:"Día completo",
      desc:"Fort Worth está a 45 minutos al oeste y merece el desvío. Los Stockyards — antiguo distrito ganadero reconvertido — ofrecen la experiencia de Texas más auténtica del área metropolitana: rodeos y arreo diario de ganado a las 11:30am y 4pm. A veinte minutos en auto, el Kimbell Art Museum tiene una colección permanente de arte europeo (Caravaggio, El Greco, Rubens) en un edificio de Louis Kahn que es en sí mismo el argumento para la visita.",
      type:"Cultural",
      affiliateLink:"AFFILIATE_LINK_DAL_FORTWORTH",
      affiliateLabel:"Tours a Fort Worth Stockyards",
    },
    {
      title:"Deep Ellum — música en vivo",
      duration:"Noche",
      desc:"El barrio de música en vivo de Dallas tiene cuarenta años de historia y más de veinte locales activos en ocho cuadras. Para la noche entre el partido del 22 y el del 27 de junio — el hueco entre los dos partidos de Argentina — Deep Ellum tiene jazz, blues, country alternativo y rock en vivo de martes a domingo. The Trees y el Bomb Factory son los recintos con mayor cartelera durante el periodo mundialista.",
      type:"Música",
      affiliateLink:"AFFILIATE_LINK_DAL_DEEPELLUM",
      affiliateLabel:"Guía de música en vivo en Deep Ellum",
    },
    {
      title:"Perot Museum + Klyde Warren Park",
      duration:"Mañana o tarde",
      desc:"El Perot Museum en el Arts District es el museo de ciencias más ambicioso del sur de Estados Unidos: ocho pisos sobre dinosaurios, geología, física y exploración espacial. Especialmente recomendado para familias con niños. Entrada: $25 adultos / $15 niños menores de 12. A una cuadra, el Klyde Warren Park — construido sobre una autopista soterrada — tiene food trucks, yoga al aire libre y los mejores atardeceres del downtown sin costo de entrada.",
      type:"Familia",
      affiliateLink:"AFFILIATE_LINK_DAL_PEROT",
      affiliateLabel:"Reservar el Perot Museum",
    },
  ],

  itinerary:[
    {
      day:1,
      title:"Llegada y primer pulso",
      subtitle:"Uptown Dallas · Arts District · Deep Ellum",
      isMatchDay:false,
      steps:[
        { time:"Llegada",   text:"DART Orange Line desde DFW hasta Downtown Dallas (45 min). La ciudad más grande del torneo en términos de partidos — y la más dispersa en términos de barrios." },
        { time:"Tarde",     text:"Arts District a pie: Dallas Museum of Art, Klyde Warren Park, la mejor concentración de museos del downtown." },
        { time:"Atardecer", text:"Uptown. McKinney Avenue, el barrio más denso en restaurantes de la ciudad. El Klyde Warren Park al atardecer." },
        { time:"Noche",     text:"Deep Ellum para música en vivo. Cuarenta años de historia, más de veinte locales activos en ocho cuadras." },
      ],
    },
    {
      day:2,
      title:"Día de partido — Argentina vs. Austria",
      subtitle:"AT&T Stadium · Lun 22 Jun · 12:00 CT",
      isMatchDay:true,
      matchRef:"m3",
      steps:[
        { time:"H-3:00", text:"Desayuno temprano — es un partido de mediodía. Comer bien antes de salir hacia Arlington." },
        { time:"H-2:30", text:"Sale hacia Arlington en Uber o auto propio. A las 9:30am el tráfico ya está formando en el corredor del estadio." },
        { time:"H-1:30", text:"Llegada al AT&T Stadium. El estadio más grande del Mundial con el A/C encendido." },
        { time:"12:00",  text:"Argentina vs. Austria. Dallas tiene 250,000 inmigrantes argentinos — nadie necesitó comprar vuelo para estar aquí." },
        { time:"Post",   text:"Regreso a Dallas. The Common Table en Uptown para el post-partido si el resultado lo merece." },
      ],
    },
    {
      day:3,
      title:"Sixth Floor Museum + Fort Worth",
      subtitle:"Dallas · Fort Worth Stockyards",
      isMatchDay:false,
      steps:[
        { time:"Mañana",   text:"Sixth Floor Museum. La ventana desde la que se dispararon los tiros que mataron a JFK en 1963. La visita más densa en términos históricos de la sede." },
        { time:"Mediodía", text:"Fort Worth en auto o Uber (45 min). Almuerzo en los Stockyards." },
        { time:"Tarde",    text:"Arreo de ganado por Main Street a las 4pm. Billy Bob's para la transmisión del partido nocturno si hay uno." },
        { time:"Noche",    text:"Kimbell Art Museum si queda tiempo, o regreso a Dallas para Deep Ellum." },
      ],
    },
    {
      day:4,
      title:"Día de partido — Argentina vs. Jordania",
      subtitle:"AT&T Stadium · Sáb 27 Jun · 21:00 CT",
      isMatchDay:true,
      matchRef:"m5",
      steps:[
        { time:"H-4:00", text:"Cena temprana en Dallas antes de las 17:00. Es el partido de noche de Argentina — máxima demanda de la sede." },
        { time:"H-2:30", text:"Sale hacia Arlington. A las 6:30pm el tráfico hacia el estadio ya está formado." },
        { time:"H-1:30", text:"Entrada al complejo. El AT&T Stadium con techo cerrado concentra el ruido albiceleste de 80,000 personas." },
        { time:"21:00",  text:"Argentina vs. Jordania. Primetime. El estadio más grande del torneo en su noche más intensa." },
        { time:"Post",   text:"Sal inmediatamente si tienes Uber. Si tienes auto, espera 45 minutos adentro — la I-20 tarda en despejarse." },
      ],
    },
  ],

  lagomTips:[
    "No hay metro al AT&T Stadium. Arlington es la ciudad más grande de EE.UU. sin sistema de transporte público. Auto propio con parking anticipado, Uber o shuttle charter son las tres únicas opciones. Planifica el transporte antes de planificar cualquier otra cosa.",
    "Para los partidos de Argentina (22 y 27 de junio), el Uber de regreso puede tardar 20–45 minutos de espera al finalizar. Solicita el viaje antes de que termine el partido — no esperes a que acabe.",
    "El parking oficial del AT&T Stadium tiene más de 20,000 espacios. Reserva con anticipación en el sitio oficial del estadio ($50–150 USD según zona). Es la opción más confiable para el regreso — puedes esperar dentro del recinto.",
    "La Semifinal del 14 de julio es la fecha de mayor demanda de toda la sede. Reserva alojamiento y transporte con meses de anticipación. Los precios de hoteles en Uptown y Victory Park se multiplican para esa fecha.",
  ],

  matchDayChecklist:[
    "Boleto digital del partido — app FIFA (sin versión en papel)",
    "Transporte al estadio confirmado: auto + parking reservado, Uber o shuttle charter",
    "ESTA aprobado o visa de turista B-2 vigente",
    "Para Uber de regreso: solicita antes de que termine el partido",
    "Llegada al estadio 90 min antes — puertas abren H-1:30",
    "Ropa ligera — el A/C del estadio cubre el interior; el calor de Texas aplica fuera",
    "Reserva de hotel confirmada para noches de partido de Argentina y Semifinal",
    "Efectivo USD o tarjeta para parking, food y Uber",
  ],

  didYouKnow:"El AT&T Stadium en Arlington tiene la pantalla de vídeo colgante más grande del mundo en un espacio cerrado: 49 metros de ancho por 27 de alto. El estadio ha albergado el Super Bowl, el NBA All-Star Game, la Copa Oro y el WrestleMania. En julio de 2026, albergará la Semifinal de la Copa del Mundo — el partido más importante de su historia.",

  closingNote:"Dallas alberga más partidos que cualquier otra sede del torneo — nueve en total, incluyendo una Semifinal y dos Rondas de 32. El estadio es el más grande del Mundial y Argentina juega aquí dos veces en grupos. No hay metro que llegue. El parking se reserva con meses de anticipación. LagomPlan te da el mapa real, no el que ignora que Arlington está entre dos ciudades sin transporte entre ellas. El resto es Argentina.",
  closingSignature:"Lagomplan · Guía de campo · Dallas · Mundial 2026",
  plannerCTA:"Generar mi viaje a Dallas",
};

// ─────────────────────────────────────────────────────────────────────────────
// CITY ILLUSTRATION — Dallas
// ─────────────────────────────────────────────────────────────────────────────
const DalIllustration = () => (
  <svg viewBox="0 0 280 140" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width:"100%", height:"100%" }}>
    <rect width="280" height="140" fill="#EAE0D5" rx={RADIUS} />
    <rect x="0" y="0" width="280" height="80" fill="#F5EDE5" opacity="0.5" />
    {/* Dallas skyline — Reunion Tower ball hint */}
    <rect x="10" y="50" width="7"  height="40" fill="#8B2635" opacity="0.28" rx={1} />
    <rect x="21" y="40" width="9"  height="50" fill="#8B2635" opacity="0.32" rx={1} />
    <rect x="34" y="44" width="6"  height="46" fill="#8B2635" opacity="0.22" rx={1} />
    <rect x="44" y="35" width="11" height="55" fill="#8B2635" opacity="0.30" rx={1} />
    <rect x="59" y="42" width="8"  height="48" fill="#8B2635" opacity="0.24" rx={1} />
    <rect x="71" y="38" width="7"  height="52" fill="#8B2635" opacity="0.28" rx={1} />
    {/* Reunion Tower — distinctive sphere on pole */}
    <rect x="82" y="30" width="4" height="60" fill="#8B2635" opacity="0.40" rx={1} />
    <circle cx="84" cy="28" r="7" fill="#8B2635" opacity="0.38" />
    {/* AT&T Stadium — large oval, Arlington */}
    <ellipse cx="210" cy="100" rx="52" ry="22" fill="#8B2635" opacity="0.14" />
    <ellipse cx="210" cy="100" rx="40" ry="16" fill="#8B2635" opacity="0.10" />
    {/* Stadium roof arc */}
    <path d="M158,100 Q210,68 262,100" stroke="#8B2635" strokeWidth="1.5" fill="none" opacity="0.25" />
    {/* Texas star */}
    <text x="240" y="60" fontSize="18" textAnchor="middle">⭐</text>
    {/* Flag */}
    <text x="258" y="38" fontSize="16" textAnchor="middle">🇺🇸</text>
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// SHARED COMPONENTS (identical pattern)
// ─────────────────────────────────────────────────────────────────────────────
const Card = ({ children, style={}, onClick, hover=false }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => hover && setIsHovered(true)} onMouseLeave={() => hover && setIsHovered(false)}
      style={{ background:T.white, border:`1px solid ${CARD_BORDER}`, borderRadius:RADIUS, boxShadow: isHovered ? "0 4px 16px rgba(28,28,26,0.09), 0 1px 3px rgba(28,28,26,0.05)" : CARD_SHADOW, transition:"box-shadow 0.22s, transform 0.22s", transform: isHovered ? "translateY(-1px)" : "none", cursor: onClick ? "pointer" : "default", ...style }}>
      {children}
    </div>
  );
};

const SectionHeader = ({ number, title, subtitle }) => (
  <div style={{ marginBottom:32 }}>
    <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
      <span style={{ ...uf(9,500), letterSpacing:"0.18em", textTransform:"uppercase", color:T.inkFaint }}>{number}</span>
      <div style={{ flex:1, height:1, background:"rgba(28,28,26,0.08)" }} />
    </div>
    <h2 style={{ ...df(27,700,"italic"), color:T.pine, lineHeight:1.05, marginBottom:subtitle ? 8 : 0 }}>{title}</h2>
    {subtitle && <p style={{ ...uf(14,400), color:T.inkMid, lineHeight:1.65, margin:0, maxWidth:540 }}>{subtitle}</p>}
  </div>
);

const LagomNote = ({ children }) => (
  <div style={{ display:"flex", gap:16, padding:"18px 22px", background:T.sandLight, borderLeft:`3px solid ${T.sage}`, borderRadius:`0 ${RADIUS}px ${RADIUS}px 0` }}>
    <span style={{ ...uf(9,700), color:T.sage, letterSpacing:"0.14em", textTransform:"uppercase", flexShrink:0, marginTop:3 }}>Lagom</span>
    <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.8, margin:0 }}>{children}</p>
  </div>
);

const ShowMoreToggle = ({ expanded, onToggle }) => (
  <button onClick={onToggle} style={{ display:"inline-flex", alignItems:"center", gap:5, marginTop:16, background:"transparent", border:`1px solid ${T.sage}55`, borderRadius:40, ...uf(10,600), color:T.sage, cursor:"pointer", letterSpacing:"0.08em", textTransform:"uppercase", padding:"5px 14px", transition:"all 0.18s" }}
    onMouseEnter={e => { e.currentTarget.style.background=T.sageLight; e.currentTarget.style.borderColor=T.sage; e.currentTarget.style.color=T.pine; }}
    onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor=`${T.sage}55`; e.currentTarget.style.color=T.sage; }}>
    {expanded ? "Ver menos ↑" : "Ver más ↓"}
  </button>
);

const MatchCard = ({ match, onPlanAround }) => {
  const isTBD = !match.teams[0].flag && !match.teams[1].flag;
  const borderColor = match.highlight ? `${T.matchGold}50` : T.sandDark;
  const accentBar = match.highlight ? T.matchGold : isTBD ? T.sandDark : CITY_ACCENT;
  return (
    <Card style={{ overflow:"hidden", borderColor, opacity: isTBD ? 0.55 : 1 }}>
      <div style={{ height:4, background:accentBar }} />
      <div style={{ padding:"22px 24px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ textAlign:"center", minWidth:48, padding:"8px 12px", background:T.sand, borderRadius:RADIUS-2, border:`1px solid ${T.sandDark}` }}>
              <div style={{ ...uf(9,600), letterSpacing:"0.1em", textTransform:"uppercase", color:T.inkFaint }}>{match.day}</div>
              <div style={{ ...df(20,700), color:T.pine, lineHeight:1.1, margin:"2px 0" }}>{match.date.split(" ")[0]}</div>
              <div style={{ ...uf(9,500), color:T.inkFaint }}>{match.date.split(" ")[1]}</div>
            </div>
            <div>
              <div style={{ ...uf(11,600), color:T.inkFaint, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:3 }}>{match.stadium}</div>
              <div style={{ ...uf(13,500), color:T.inkMid }}>{match.time} local</div>
            </div>
          </div>
          {match.tag && <span style={{ ...uf(9,700), letterSpacing:"0.08em", textTransform:"uppercase", color: match.highlight ? T.matchGold : CITY_ACCENT, background: match.highlight ? T.matchGoldLight : CITY_ACCENT+"15", border:`1px solid ${match.highlight ? T.matchGold+"50" : CITY_ACCENT+"35"}`, padding:"4px 10px", borderRadius:40, flexShrink:0, maxWidth:180, textAlign:"right" }}>{match.tag}</span>}
        </div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:16, padding:"18px 0", borderTop:`1px solid ${T.sandDark}`, borderBottom:`1px solid ${T.sandDark}`, marginBottom:18 }}>
          <div style={{ flex:1, textAlign:"right" }}>
            <div style={{ ...df(16,700), color:T.ink, marginBottom:4, lineHeight:1.2 }}>{match.teams[0].name}</div>
            {match.teams[0].flag && <div style={{ fontSize:26, lineHeight:1 }}>{match.teams[0].flag}</div>}
          </div>
          <div style={{ ...uf(11,600), color:T.inkFaint, letterSpacing:"0.12em", padding:"6px 14px", background:T.sand, borderRadius:6, border:`1px solid ${T.sandDark}` }}>vs</div>
          <div style={{ flex:1, textAlign:"left" }}>
            <div style={{ ...df(16,700), color:T.ink, marginBottom:4, lineHeight:1.2 }}>{match.teams[1].name}</div>
            {match.teams[1].flag && <div style={{ fontSize:26, lineHeight:1 }}>{match.teams[1].flag}</div>}
          </div>
        </div>
        {!isTBD ? (
          <button onClick={() => onPlanAround && onPlanAround(match)} style={{ width:"100%", padding:"10px", background:"transparent", border:`1px solid ${T.sandDark}`, borderRadius:RADIUS-2, ...uf(10,600), letterSpacing:"0.1em", textTransform:"uppercase", color:T.inkMid, cursor:"pointer", transition:"all 0.18s", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor=CITY_ACCENT; e.currentTarget.style.color=T.pine; e.currentTarget.style.background=T.sageLight; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor=T.sandDark; e.currentTarget.style.color=T.inkMid; e.currentTarget.style.background="transparent"; }}>
            <span style={{ fontSize:12 }}>✦</span> Planear mi viaje alrededor de este partido
          </button>
        ) : (
          <div style={{ ...uf(12,400), color:T.inkFaint, textAlign:"center", padding:"8px 0", fontStyle:"italic" }}>Rival por definir al terminar fase de grupos</div>
        )}
      </div>
    </Card>
  );
};

const CollapsibleVibeCard = ({ item }) => {
  const [open, setOpen] = useState(false);
  return (
    <Card hover style={{ overflow:"hidden", display:"flex", flexDirection:"row" }}>
      <div style={{ width:3, flexShrink:0, background:item.typeColor, opacity:0.7 }} />
      <div style={{ padding:"18px 20px", display:"flex", flexDirection:"column", gap:9, flex:1 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ ...uf(9,600), letterSpacing:"0.1em", textTransform:"uppercase", color:item.typeColor }}>{item.type}</span>
          <span style={{ ...uf(9,500), letterSpacing:"0.08em", textTransform:"uppercase", color:T.inkFaint }}>{item.tag}</span>
        </div>
        <div style={{ ...df(14,700), color:T.pine, lineHeight:1.25 }}>{item.title}</div>
        <p style={{ ...uf(12,400), color:T.inkMid, lineHeight:1.72, margin:0, ...(open ? {} : { display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }) }}>{item.desc}</p>
        <ShowMoreToggle expanded={open} onToggle={() => setOpen(!open)} />
      </div>
    </Card>
  );
};

const StayCard = ({ stay }) => (
  <Card hover style={{ display:"flex", flexDirection:"column", height:"100%" }}>
    <div style={{ padding:"22px 22px 0" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
        <span style={{ ...df(26,700), color:T.pine, letterSpacing:"-0.02em" }}>{stay.price}</span>
        <Label color={T.sage} bg={T.sageLight}>{stay.best_for}</Label>
      </div>
      <div style={{ ...df(17,700), color:T.pine, lineHeight:1.2, marginBottom:4 }}>{stay.name}</div>
      <div style={{ ...uf(12,500), color:T.inkFaint, marginBottom:10 }}>{stay.area}</div>
      {stay.priceCAD && <div style={{ ...uf(12,600), color:CITY_ACCENT, marginBottom:14, letterSpacing:"0.02em" }}>{stay.priceCAD}</div>}
      <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>
        {stay.tags.map(tag => <span key={tag} style={{ ...uf(9,600), letterSpacing:"0.08em", textTransform:"uppercase", color:T.inkFaint, background:T.sand, padding:"3px 8px", borderRadius:5, border:`1px solid ${T.sandDark}` }}>{tag}</span>)}
      </div>
      <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.7 }}>{stay.note}</p>
    </div>
    <div style={{ marginTop:"auto", padding:"14px 22px", borderTop:`1px solid ${T.sandDark}` }}>
      <button style={{ width:"100%", padding:"11px", background:T.pine, border:"none", borderRadius:RADIUS-2, ...uf(10,700), letterSpacing:"0.12em", textTransform:"uppercase", color:T.white, cursor:"pointer", transition:"opacity 0.18s" }}
        onMouseEnter={e => e.currentTarget.style.opacity="0.82"} onMouseLeave={e => e.currentTarget.style.opacity="1"}>
        Ver opciones →
      </button>
    </div>
  </Card>
);

const FoodCard = ({ item }) => (
  <div style={{ background:T.white, border:`1px solid ${CARD_BORDER}`, borderRadius:RADIUS, boxShadow:CARD_SHADOW, padding:"16px 18px", display:"flex", flexDirection:"column", gap:6 }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10 }}>
      <span style={{ ...uf(13,600), color:T.pine, lineHeight:1.3 }}>{item.dish}</span>
      <span style={{ ...uf(12,500), color:T.inkFaint, flexShrink:0 }}>{item.price}</span>
    </div>
    <p style={{ ...uf(12,400), color:T.inkFaint, lineHeight:1.55, margin:0 }}>{item.where}</p>
    <div style={{ marginTop:4 }}><Label color={T.sage} bg={T.sageLight}>{item.type}</Label></div>
  </div>
);

const LogisticsCard = ({ item }) => (
  <Card style={{ display:"flex", gap:16, padding:"18px 22px", alignItems:"flex-start", borderColor: item.isWarning ? `${T.coral}55` : T.sandDark, background: item.isWarning ? T.coralLight : T.white }}>
    <div style={{ width:40, height:40, flexShrink:0, background:item.isWarning ? T.coral+"20" : T.sageLight, borderRadius:RADIUS-2, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{item.icon}</div>
    <div>
      <div style={{ ...uf(13,700), color:item.isWarning ? T.coral : T.pine, marginBottom:6 }}>{item.title}</div>
      <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.75, margin:0 }}>{item.text}</p>
    </div>
  </Card>
);

const GuideSidebar = ({ guide, onPlan }) => {
  const [checked, setChecked] = useState({});
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <Card style={{ padding:"22px", background:T.sandLight, borderColor:T.sandDark }}>
        <Label color={T.sage} style={{ marginBottom:10, display:"block" }}>Lagomplan · Planificador</Label>
        <p style={{ ...df(16,700,"italic"), color:T.pine, lineHeight:1.4, marginBottom:16 }}>¿Listo para tu versión del Mundial? Convierte esta guía en un itinerario adaptado a tus tiempos y presupuesto.</p>
        <button onClick={onPlan} style={{ width:"100%", padding:"11px 16px", background:T.pine, border:"none", borderRadius:RADIUS-2, ...uf(10,600), letterSpacing:"0.12em", textTransform:"uppercase", color:T.white, cursor:"pointer", transition:"opacity 0.18s" }}
          onMouseEnter={e => e.currentTarget.style.opacity="0.82"} onMouseLeave={e => e.currentTarget.style.opacity="1"}>
          {guide.plannerCTA} →
        </button>
      </Card>
      <Card style={{ padding:"20px 22px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16, paddingBottom:14, borderBottom:`1px solid ${T.sandDark}` }}>
          <div style={{ width:28, height:28, background:T.sageLight, borderRadius:RADIUS-2, display:"flex", alignItems:"center", justifyContent:"center" }}><span style={{ fontSize:13 }}>✦</span></div>
          <Label color={T.pine} style={{ fontSize:11 }}>Notas Lagom</Label>
        </div>
        {guide.lagomTips.map((tip, i) => (
          <div key={i} style={{ display:"flex", gap:11, paddingTop:12, paddingBottom:12, borderBottom: i < guide.lagomTips.length-1 ? `1px solid ${T.sandDark}` : "none" }}>
            <div style={{ width:5, height:5, borderRadius:"50%", background:T.sage, flexShrink:0, marginTop:7 }} />
            <p style={{ ...uf(12,400), color:T.inkMid, lineHeight:1.72, margin:0 }}>{tip}</p>
          </div>
        ))}
      </Card>
      <Card style={{ padding:"20px 22px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16, paddingBottom:14, borderBottom:`1px solid ${T.sandDark}` }}>
          <div style={{ width:28, height:28, background:T.matchGoldLight, borderRadius:RADIUS-2, display:"flex", alignItems:"center", justifyContent:"center" }}><span style={{ fontSize:13 }}>☑</span></div>
          <Label color={T.pine} style={{ fontSize:11 }}>Checklist día de partido</Label>
        </div>
        {guide.matchDayChecklist.map((item, i) => (
          <button key={i} onClick={() => setChecked(p => ({...p,[i]:!p[i]}))} style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"9px 0", borderTop: i > 0 ? `1px solid ${T.sandDark}` : "none", background:"transparent", border:"none", cursor:"pointer", textAlign:"left", width:"100%" }}>
            <div style={{ width:16, height:16, flexShrink:0, marginTop:2, border:`1.5px solid ${checked[i] ? T.sage : T.sandDark}`, borderRadius:4, background:checked[i] ? T.sage : "transparent", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.15s" }}>
              {checked[i] && <span style={{ color:T.white, fontSize:9, lineHeight:1 }}>✓</span>}
            </div>
            <span style={{ ...uf(12,400), color:checked[i] ? T.inkFaint : T.inkMid, lineHeight:1.55, textDecoration:checked[i] ? "line-through" : "none", transition:"all 0.15s" }}>{item}</span>
          </button>
        ))}
      </Card>
      <Card style={{ padding:"20px 22px", background:T.fjordLight, borderColor:`${T.fjord}30` }}>
        <Label color={T.fjord} style={{ marginBottom:10, display:"block" }}>¿Sabías que?</Label>
        <p style={{ ...uf(13,400), color:T.fjord, lineHeight:1.72, margin:0 }}>{guide.didYouKnow}</p>
      </Card>
      <Card style={{ padding:"18px 22px", borderStyle:"dashed", borderColor:T.sandDark }}>
        <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
          <span style={{ fontSize:16, flexShrink:0, marginTop:1 }}>✦</span>
          <div>
            <div style={{ ...uf(12,700), color:T.pine, marginBottom:6 }}>Optimizar itinerario con IA</div>
            <p style={{ ...uf(12,400), color:T.inkMid, lineHeight:1.65, margin:"0 0 12px" }}>Dinos cuántos días tienes y cuáles partidos quieres ver. La IA arma la ruta.</p>
            <button onClick={onPlan} style={{ ...uf(9,700), letterSpacing:"0.1em", textTransform:"uppercase", color:T.pine, background:"none", border:`1px solid ${T.pine}`, borderRadius:RADIUS-2, padding:"7px 14px", cursor:"pointer", transition:"all 0.18s" }}
              onMouseEnter={e => { e.currentTarget.style.background=T.pine; e.currentTarget.style.color=T.white; }}
              onMouseLeave={e => { e.currentTarget.style.background="none"; e.currentTarget.style.color=T.pine; }}>
              Optimizar ruta →
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

const GuideHero = ({ guide }) => (
  <div style={{ display:"grid", gridTemplateColumns:"1fr 280px", gap:56, alignItems:"center", padding:"72px 0 64px", borderBottom:`1px solid rgba(28,28,26,0.08)`, marginBottom:56 }}>
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:18, flexWrap:"wrap" }}>
        <span style={{ fontSize:18 }}>{guide.flag}</span>
        <Label color={T.inkFaint}>{guide.country} · {guide.state}</Label>
        <span style={{ color:T.sandDark, fontSize:12 }}>·</span>
        <Label color={T.inkFaint}>{guide.stadium.name}</Label>
        <span style={{ color:T.sandDark, fontSize:12 }}>·</span>
        <Label color={T.inkFaint}>{guide.stadium.capacity}</Label>
      </div>
      <h1 style={{ ...df("clamp(44px,5.5vw,72px)",900,"italic"), color:T.pine, lineHeight:0.92, letterSpacing:"-0.03em", marginBottom:22 }}>{guide.city}</h1>
      <p style={{ ...uf(15,400), color:T.inkMid, lineHeight:1.85, maxWidth:500, marginBottom:32 }}>{guide.description}</p>
      <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:36 }}>
        {guide.tags.map(tag => <span key={tag} style={{ ...uf(10,600), letterSpacing:"0.1em", textTransform:"uppercase", color:T.pine, background:T.sageLight, border:`1px solid ${T.sage}30`, padding:"5px 13px", borderRadius:40 }}>{tag}</span>)}
        <span style={{ ...uf(10,600), letterSpacing:"0.1em", textTransform:"uppercase", color:T.matchGold, background:T.matchGoldLight, border:`1px solid ${T.matchGold}35`, padding:"5px 13px", borderRadius:40 }}>⚽ {guide.matches.length} partidos</span>
      </div>
      <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
        {guide.scores.map(s => (
          <div key={s.label} style={{ display:"flex", flexDirection:"column", gap:5 }}>
            <Label color={T.inkFaint}>{s.label}</Label>
            <div style={{ display:"flex", gap:3 }}>
              {[1,2,3,4,5].map(i => <div key={i} style={{ width:6, height:6, borderRadius:"50%", background: i<=s.value ? T.sage : T.sandDark }} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
    <div style={{ height:210, borderRadius:RADIUS+2, overflow:"hidden", boxShadow:CARD_SHADOW }}><DalIllustration /></div>
  </div>
);

const NAV_ITEMS = [
  {id:"matches",   label:"Partidos"},
  {id:"manifesto", label:"Manifiesto"},
  {id:"stays",     label:"Dónde dormir"},
  {id:"vibe",      label:"Ambiente"},
  {id:"logistics", label:"Logística"},
];

const StickyNav = ({ active, onNavigate, onBack }) => (
  <div style={{ position:"sticky", top:0, zIndex:40, background:`${T.bg}F5`, backdropFilter:"blur(18px)", borderBottom:`1px solid ${T.sandDark}`, height:52, display:"flex", alignItems:"center", padding:"0 40px", gap:0, overflowX:"auto" }}>
    <button onClick={onBack} style={{ ...uf(11,500), color:T.inkFaint, background:"none", border:"none", cursor:"pointer", padding:"0 14px 0 0", marginRight:14, borderRight:`1px solid ${T.sandDark}`, whiteSpace:"nowrap", letterSpacing:"0.06em", transition:"color 0.15s" }}
      onMouseEnter={e => e.currentTarget.style.color=T.pine} onMouseLeave={e => e.currentTarget.style.color=T.inkFaint}>← Guías</button>
    <span style={{ ...df(14,700,"italic"), color:T.pine, marginRight:20, whiteSpace:"nowrap" }}>Dallas</span>
    <div style={{ width:1, height:20, background:T.sandDark, marginRight:4, flexShrink:0 }} />
    {NAV_ITEMS.map(item => (
      <button key={item.id} onClick={() => onNavigate(item.id)} style={{ ...uf(10, active===item.id ? 700 : 500), letterSpacing:"0.08em", textTransform:"uppercase", color: active===item.id ? T.pine : T.inkFaint, background:"none", border:"none", padding:"0 13px", height:"100%", cursor:"pointer", borderBottom:`2px solid ${active===item.id ? T.coral : "transparent"}`, transition:"all 0.18s", whiteSpace:"nowrap", flexShrink:0 }}>{item.label}</button>
    ))}
  </div>
);

const GuideDetail = ({ guide, onBack }) => {
  const [active, setActive] = useState("matches");
  const [showManifesto, setShowManifesto] = useState(false);
  const [showVibe,      setShowVibe]      = useState(false);
  const [showLogistics, setShowLogistics] = useState(false);
  const [showFood,      setShowFood]      = useState(false);
  const [showExp,       setShowExp]       = useState(false);

  useEffect(() => {
    const observers = [];
    NAV_ITEMS.forEach(item => {
      const el = document.getElementById(item.id);
      if (!el) return;
      const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setActive(item.id); }, { rootMargin:"-30% 0px -65% 0px" });
      obs.observe(el); observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const scrollTo = id => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior:"smooth", block:"start" }); };

  return (
    <div style={{ background:T.bg, minHeight:"100vh" }}>
      <StickyNav active={active} onNavigate={scrollTo} onBack={onBack} />
      <div style={{ maxWidth:1140, margin:"0 auto", padding:"0 40px" }}>
        <GuideHero guide={guide} />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 316px", gap:52, alignItems:"flex-start" }}>
          <div>

            <section id="matches" style={{ marginBottom:64, scrollMarginTop:64 }}>
              <SectionHeader number="01" title="Tus partidos" subtitle="9 partidos confirmados — el máximo de cualquier sede. Argentina juega el 22 y el 27 de junio. Semifinal el 14 de julio." />
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16 }}>
                {guide.matches.map(match => <MatchCard key={match.id} match={match} onPlanAround={() => {}} />)}
              </div>
            </section>

            <section id="manifesto" style={{ marginBottom:64, scrollMarginTop:64, background:SECTION_ALT_BG, borderRadius:RADIUS+2, padding:"32px 28px 28px", marginLeft:-4, marginRight:-4 }}>
              <SectionHeader number="02" title="Manifiesto de campo" subtitle="Lo que necesitas saber — y lo que Arlington no te dice hasta que llegas." />
              <Card style={{ marginBottom:24, overflow:"hidden" }}>
                <div style={{ height:4, background:CITY_ACCENT }} />
                <div style={{ padding:"20px 24px" }}>
                  {guide.manifesto.stadiumInfo.map((item, i) => (
                    <div key={i} style={{ display:"flex", gap:20, padding:"11px 0", borderBottom: i < guide.manifesto.stadiumInfo.length-1 ? `1px solid ${T.sandDark}` : "none" }}>
                      <span style={{ ...uf(11,600), color:T.inkFaint, minWidth:148, flexShrink:0, letterSpacing:"0.05em" }}>{item.label}</span>
                      <span style={{ ...uf(13,500), color:T.ink, lineHeight:1.6 }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
              {showManifesto && (<><p style={{ ...uf(15,400), color:T.ink, lineHeight:1.9, marginBottom:24, maxWidth:640 }}>{guide.manifesto.body}</p><LagomNote>{guide.manifesto.lagomNote}</LagomNote></>)}
              <ShowMoreToggle expanded={showManifesto} onToggle={() => setShowManifesto(!showManifesto)} />
            </section>

            <section id="stays" style={{ marginBottom:64, scrollMarginTop:64 }}>
              <SectionHeader number="03" title="Dónde dormir · Base de descanso" subtitle="Refugios seleccionados en Dallas — no en Arlington." />
              <div style={{ marginBottom:18, padding:"14px 18px", background:T.coralLight, border:`1px solid ${T.coral}40`, borderRadius:RADIUS }}>
                <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                  <span style={{ fontSize:14, flexShrink:0 }}>⚠️</span>
                  <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.7, margin:0 }}>
                    Los partidos de Argentina (22 y 27 de junio) y la Semifinal (14 de julio) son las tres fechas de mayor demanda. El corredor de Arlington se agota meses antes para las noches de Argentina. Si viajas para esos partidos, busca en <strong>Uptown</strong>, <strong>Addison</strong> o <strong>Plano</strong> — más lejos del estadio pero con mejor calidad de barrio y más inventario.
                  </p>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(256px,1fr))", gap:16 }}>
                {guide.stays.map(stay => <StayCard key={stay.name} stay={stay} />)}
              </div>
            </section>

            <section id="vibe" style={{ marginBottom:64, scrollMarginTop:64, background:SECTION_ALT_BG, borderRadius:RADIUS+2, padding:"32px 28px 28px", marginLeft:-4, marginRight:-4 }}>
              <SectionHeader number="04" title="Siente el ambiente" subtitle="Klyde Warren Park, Deep Ellum, Fort Worth Stockyards y los 250,000 hinchas argentinos que no necesitaron vuelo." />
              <p style={{ ...uf(15,400), color:T.inkMid, lineHeight:1.85, marginBottom:showVibe ? 28 : 0, maxWidth:640, ...(showVibe ? {} : { display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden" }) }}>
                {guide.vibe.body}
              </p>
              {showVibe && (<><div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:20 }}>{guide.vibeCards.map(item => <CollapsibleVibeCard key={item.title} item={item} />)}</div><LagomNote>{guide.vibe.lagomNote}</LagomNote></>)}
              <ShowMoreToggle expanded={showVibe} onToggle={() => setShowVibe(!showVibe)} />
            </section>

            <section id="logistics" style={{ marginBottom:64, scrollMarginTop:64 }}>
              <SectionHeader number="05" title="Llegar al estadio" subtitle="No hay metro. Tres opciones reales: auto con parking anticipado, Uber o shuttle charter." />
              <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom: showLogistics ? 24 : 0 }}>
                {guide.logistics.transport.slice(0,2).map((item, i) => <LogisticsCard key={i} item={item} />)}
              </div>
              {showLogistics && (<>
                <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
                  {guide.logistics.transport.slice(2).map((item, i) => <LogisticsCard key={i} item={item} />)}
                </div>
                <Card style={{ marginBottom:24 }}>
                  <div style={{ padding:"18px 24px" }}>
                    <div style={{ ...uf(10,700), letterSpacing:"0.16em", textTransform:"uppercase", color:T.inkFaint, marginBottom:14 }}>Tiempos reales de desplazamiento</div>
                    {guide.logistics.timings.map((t, i) => (
                      <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"11px 0", borderBottom: i < guide.logistics.timings.length-1 ? `1px solid ${T.sandDark}` : "none" }}>
                        <span style={{ ...uf(13,400), color:T.inkMid }}>{t.label}</span>
                        <span style={{ ...uf(13,700), color:T.pine }}>{t.value}</span>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card style={{ overflow:"hidden", marginBottom:16 }}>
                  <div style={{ height:4, background:T.matchGold }} />
                  <div style={{ padding:"20px 24px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
                      <span style={{ fontSize:16 }}>⚽</span>
                      <div style={{ ...uf(11,700), letterSpacing:"0.12em", textTransform:"uppercase", color:T.matchGold }}>Cronología recomendada</div>
                      <span style={{ ...uf(13,600), color:T.ink }}>{guide.logistics.matchDayCronologia.matchName}</span>
                    </div>
                    {guide.logistics.matchDayCronologia.steps.map((step, i) => (
                      <div key={i} style={{ display:"flex", gap:16, paddingTop: i>0 ? 14 : 0, paddingBottom: i<guide.logistics.matchDayCronologia.steps.length-1 ? 14 : 0, borderBottom: i<guide.logistics.matchDayCronologia.steps.length-1 ? `1px solid ${T.sandDark}` : "none" }}>
                        <span style={{ ...uf(10,700), color:T.matchGold, minWidth:46, flexShrink:0, letterSpacing:"0.04em", paddingTop:2 }}>{step.time}</span>
                        <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.72, margin:0 }}>{step.text}</p>
                      </div>
                    ))}
                  </div>
                </Card>
                <div style={{ display:"flex", gap:12, padding:"14px 18px", background:T.sandLight, border:`1px solid ${T.sandDark}`, borderRadius:RADIUS }}>
                  <span style={{ fontSize:15, flexShrink:0 }}>💡</span>
                  <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.72, margin:0 }}>{guide.logistics.timing}</p>
                </div>
              </>)}
              <ShowMoreToggle expanded={showLogistics} onToggle={() => setShowLogistics(!showLogistics)} />
            </section>

            <section style={{ marginBottom:64, scrollMarginTop:64, background:SECTION_ALT_BG, borderRadius:RADIUS+2, padding:"32px 28px 28px", marginLeft:-4, marginRight:-4 }}>
              <SectionHeader number="06" title="Dónde comer · Sobremesa mundialista" subtitle="Más allá de los steakhouses: Bishop Arts, Deep Ellum y la mejor BBQ de Texas en el área metropolitana." />
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:12 }}>
                {guide.food.slice(0,3).map((f, i) => <FoodCard key={i} item={f} />)}
                {showFood && guide.food.slice(3).map((f, i) => <FoodCard key={i+3} item={f} />)}
              </div>
              <ShowMoreToggle expanded={showFood} onToggle={() => setShowFood(!showFood)} />
            </section>

            <section style={{ marginBottom:64 }}>
              <SectionHeader number="07" title="Fuera del estadio" subtitle="La ciudad que tiene más museos, barrios y distritos con identidad de los que su skyline corporativo sugiere." />
              <div style={{ display:"flex", flexDirection:"column", gap:28 }}>
                {guide.experiences.slice(0,1).map((exp, i) => (
                  <div key={i} style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:"0 24px" }}>
                    <div style={{ ...df(32,900), color:T.sandDark, lineHeight:1, userSelect:"none", paddingTop:4, width:40, textAlign:"right", flexShrink:0 }}>{String(i+1).padStart(2,"0")}</div>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8, flexWrap:"wrap" }}>
                        <span style={{ ...uf(15,600), color:T.pine }}>{exp.title}</span>
                        <Label bg={T.fjordLight} color={T.fjord}>{exp.type}</Label>
                        <span style={{ ...uf(11,400), color:T.inkFaint }}>{exp.duration}</span>
                      </div>
                      <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.8, margin:"0 0 12px", maxWidth:580 }}>{exp.desc}</p>
                      {exp.affiliateLink && <a href={exp.affiliateLink} target="_blank" rel="noopener noreferrer sponsored" style={{ display:"inline-flex", alignItems:"center", gap:6, ...uf(11,600), color:T.sage, letterSpacing:"0.05em", textDecoration:"none", borderBottom:`1px solid ${T.sage}50`, paddingBottom:1, transition:"color 0.15s, border-color 0.15s" }} onMouseEnter={e => { e.currentTarget.style.color=T.pine; e.currentTarget.style.borderColor=T.pine; }} onMouseLeave={e => { e.currentTarget.style.color=T.sage; e.currentTarget.style.borderColor=`${T.sage}50`; }}>{exp.affiliateLabel} ↗</a>}
                    </div>
                  </div>
                ))}
                {showExp && guide.experiences.slice(1).map((exp, i) => (
                  <div key={i+1} style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:"0 24px" }}>
                    <div style={{ ...df(32,900), color:T.sandDark, lineHeight:1, userSelect:"none", paddingTop:4, width:40, textAlign:"right", flexShrink:0 }}>{String(i+2).padStart(2,"00")}</div>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8, flexWrap:"wrap" }}>
                        <span style={{ ...uf(15,600), color:T.pine }}>{exp.title}</span>
                        <Label bg={T.fjordLight} color={T.fjord}>{exp.type}</Label>
                        <span style={{ ...uf(11,400), color:T.inkFaint }}>{exp.duration}</span>
                      </div>
                      <p style={{ ...uf(13,400), color:T.inkMid, lineHeight:1.8, margin:"0 0 12px", maxWidth:580 }}>{exp.desc}</p>
                      {exp.affiliateLink && <a href={exp.affiliateLink} target="_blank" rel="noopener noreferrer sponsored" style={{ display:"inline-flex", alignItems:"center", gap:6, ...uf(11,600), color:T.sage, letterSpacing:"0.05em", textDecoration:"none", borderBottom:`1px solid ${T.sage}50`, paddingBottom:1, transition:"color 0.15s, border-color 0.15s" }} onMouseEnter={e => { e.currentTarget.style.color=T.pine; e.currentTarget.style.borderColor=T.pine; }} onMouseLeave={e => { e.currentTarget.style.color=T.sage; e.currentTarget.style.borderColor=`${T.sage}50`; }}>{exp.affiliateLabel} ↗</a>}
                    </div>
                  </div>
                ))}
              </div>
              <ShowMoreToggle expanded={showExp} onToggle={() => setShowExp(!showExp)} />
            </section>

            <section style={{ marginBottom:0 }}>
              <div style={{ background:T.pine, borderRadius:RADIUS+2, padding:"48px 44px 44px", overflow:"hidden" }}>
                <div style={{ width:32, height:2, background:T.coral, marginBottom:28, opacity:0.85 }} />
                <blockquote style={{ ...df("clamp(18px,2.4vw,24px)",400,"italic"), color:T.sand, lineHeight:1.75, margin:"0 0 24px", maxWidth:540 }}>"{guide.closingNote}"</blockquote>
                <Label color={`${T.sage}`} style={{ opacity:0.7 }}>{guide.closingSignature}</Label>
              </div>
            </section>

          </div>
          <div style={{ position:"sticky", top:64, alignSelf:"flex-start", paddingBottom:48 }}>
            <GuideSidebar guide={guide} onPlan={() => alert("Planificador: Dallas")} />
          </div>
        </div>
        <div style={{ height:96 }} />
      </div>
    </div>
  );
};

export default function App() {
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
      <GuideDetail guide={DAL} onBack={() => {}} />
    </>
  );
}
