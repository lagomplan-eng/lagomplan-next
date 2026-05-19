 // supabase/functions/generate-trip/index.ts                                                                 
  import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
  import { WC_2026_CALENDAR, WC_HOST_CITY_HINTS, type WcMatch } from "./wc-2026-calendar.ts";                                          
                                                            
  const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");                                                   
                                                                                                                 
  const corsHeaders = {                                                                                          
    "Access-Control-Allow-Origin": "*",                                                                          
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",                        
    "Access-Control-Allow-Methods": "POST, OPTIONS",        
  };                                                                                                           
                                                                                                                 
  type ErrBody = { success: false; code: string; message: string; detail?: unknown };
  const errorResponse = (status: number, code: string, message: string, detail?: unknown) =>                     
    new Response(                                                                                                
      JSON.stringify({ success: false, code, message, detail } satisfies ErrBody),                             
      { status, headers: { ...corsHeaders, "Content-Type": "application/json" } }                                
    );                                                                                                         
                                                                                                                 
  const SYSTEM_PROMPT = `Eres un experto planificador de viajes mexicano con profundo conocimiento de destinos,
  gastronomía, cultura y logística en México.
  Tu tono es cálido y cercano, como un amigo experto que recomienda, no un guía turístico genérico.
  Usas información real: nombres de restaurantes, carreteras, tiempos de manejo, tips locales.

  REGLA DE ALOJAMIENTO (CRÍTICA):
  Si el viaje incluye al menos una noche (overnight === true), DEBES llenar el campo
  "accommodations" con al menos una entrada que cubra TODAS las noches del viaje.
  Recomienda zonas o barrios concretos donde quedarse y explica BREVEMENTE por qué encajan
  con el estilo y los intereses del viajero. NO inventes nombres de hoteles específicos
  ni precios exactos; recomienda zonas y tipo de alojamiento ("hotel boutique en Coyoacán",
  "apartamento en Roma Norte cerca del Bosque"). Las fechas de check-in y check-out vienen
  predeterminadas en el input — úsalas tal cual, no las modifiques.

  Si el viaje es de un solo día (overnight === false), deja "accommodations" como arreglo vacío.

  Cuando el usuario te pida un itinerario, llama a la herramienta emit_trip con los datos completos.
  No respondas con texto, sólo con la llamada a la herramienta.`;                                                            
                                                                                                                 
  const budgetLine = {                                                                                           
    type: "object",                                                                                              
    required: ["label", "range"],                                                                                
    properties: { label: { type: "string" }, range: { type: "string" } },
  };                                                                                                             
                                                                                                               
  // Structured accommodations entity — first-class hotel surface (not regex-extracted).
  // The Edge Function fills city, checkInDate, checkOutDate, nights deterministically
  // before calling Claude (see buildPrompt) so the AI only chooses neighborhood +
  // accommodationType + rationale + priceTier.
  const accommodationItem = {
    type: "object",
    required: ["city", "accommodationType", "rationale", "priceTier", "checkInDate", "checkOutDate", "nights"],
    properties: {
      city:              { type: "string" },
      neighborhood:      { type: "string" },
      accommodationType: { type: "string", enum: ["hotel", "boutique", "hostel", "apartment", "resort", "cabin", "glamping", "unspecified"] },
      rationale:         { type: "string" },
      priceTier:         { type: "string", enum: ["budget", "mid", "upscale", "luxury"] },
      familyFriendly:    { type: "boolean" },
      checkInDate:       { type: "string" },
      checkOutDate:      { type: "string" },
      nights:            { type: "integer" },
    },
  };

  const TRIP_SCHEMA = {
    type: "object",
    required: ["title", "tagline", "hero_tags", "before_you_go", "days", "budget_breakdown", "accommodations"],
    properties: {                                           
      title:   { type: "string" },                                                                             
      tagline: { type: "string" },                                                                               
      hero_tags: {                                                                                             
        type: "object",                                                                                          
        required: ["from", "duration", "travelers", "budget"],
        properties: {                                                                                            
          from:      { type: "string" },                                                                       
          duration:  { type: "string" },                                                                         
          travelers: { type: "string" },
          budget:    { type: "string" },                                                                         
        },                                                                                                       
      },                          
      before_you_go: {                                                                                           
        type: "object",                                     
        required: ["departure_details", "best_time_to_leave", "what_to_pack", "tips"],
        properties: {
          departure_details:  { type: "string" },                                                              
          best_time_to_leave: { type: "string" },                                                                
          what_to_pack:       { type: "array", items: { type: "string" } },                                    
          tips:               { type: "array", items: { type: "string" } },                                      
        },                                                  
      },                                                                                                         
      days: {                                                                                                    
        type: "array",            
        items: {                                                                                                 
          type: "object",                                   
          required: ["day_number", "day_label", "title", "objective", "blocks"],
          properties: {
            day_number: { type: "integer" },                                                                   
            day_label:  { type: "string" },                                                                      
            title:      { type: "string" },
            objective:  { type: "string" },                                                                      
            blocks: {                                                                                            
              type: "array",      
              items: {                                                                                           
                type: "object",                             
                required: ["time", "title", "description", "type"],
                properties: {
                  time:        { type: "string" },                                                             
                  title:       { type: "string" },                                                               
                  description: { type: "string" },
                  type:        { type: "string", enum: ["hotel", "restaurant", "tour", "transfer", "culture", "nature", "free"] },                                                                                                    
                },                                                                                             
              },                                                                                                 
            },                                              
          },                                                                                                     
        },                                                  
      },                                                                                                       
      budget_breakdown: {
        type: "object",
        required: ["accommodation", "food", "activities", "transport", "total"],
        properties: {
          accommodation: budgetLine,
          food:          budgetLine,
          activities:    budgetLine,
          transport:     budgetLine,
          total:         budgetLine,
        },
      },
      // Always present in the output (empty array for same-day trips).
      // Required+empty is intentional: forces the model to acknowledge
      // it considered lodging rather than silently omitting the field.
      accommodations: {
        type: "array",
        items: accommodationItem,
      },
    },
  };                              
                                                                                                                 
  // ── Temporal-context helpers ────────────────────────────────────────────────
  // Pure date math. Derives the season + per-day weekday so the AI can pick
  // climate-appropriate activities (indoor in winter, shaded in summer) and
  // respect day-of-week realities (museum closures, market days). No external
  // data, no API calls — runs entirely off `start` + destination text.

  // Tiny lookup of destinations that fall in the southern hemisphere. Covers
  // the bulk of Lagomplan's relevant non-northern destinations for a Mexico-
  // based audience. Match is substring-based on lowercased destination text.
  const SOUTHERN_HEMISPHERE_HINTS = [
    "argentina", "buenos aires", "patagonia", "mendoza", "bariloche", "ushuaia", "iguazu",
    "uruguay", "montevideo", "punta del este", "colonia del sacramento",
    "chile", "santiago", "valparaíso", "atacama",
    "perú", "peru", "lima", "cusco", "arequipa", "machu picchu",
    "bolivia", "la paz", "sucre", "uyuni",
    "paraguay", "asunción",
    "brasil", "brazil", "río de janeiro", "rio de janeiro", "são paulo", "sao paulo", "salvador", "florianópolis", "florianopolis", "fortaleza",
    "australia", "sydney", "melbourne", "brisbane", "perth",
    "nueva zelanda", "new zealand", "auckland", "wellington", "queenstown",
    "sudáfrica", "south africa", "cape town", "ciudad del cabo", "johannesburgo", "johannesburg",
    "fiji", "tahití", "tahiti", "samoa",
  ];

  function isSouthernHemisphere(destination: string): boolean {
    if (!destination) return false;
    const d = destination.toLowerCase();
    return SOUTHERN_HEMISPHERE_HINTS.some(h => d.includes(h));
  }

  // Month-index → season (0-indexed: Jan = 0). Equinox cutoffs are simplified
  // (always month-boundary). Good enough for prompt context.
  const SEASONS_NORTHERN_ES = [
    "invierno", "invierno", "primavera", "primavera", "primavera",
    "verano", "verano", "verano", "otoño", "otoño", "otoño", "invierno",
  ];
  const SEASONS_SOUTHERN_ES = [
    "verano", "verano", "otoño", "otoño", "otoño",
    "invierno", "invierno", "invierno", "primavera", "primavera", "primavera", "verano",
  ];
  const MONTH_NAMES_ES = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
  ];
  const WEEKDAY_LABELS_ES = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

  function buildSeasonLine(start: string, destination: string): string {
    if (!start) return "";
    const date = new Date(`${start}T00:00:00Z`);
    if (isNaN(date.getTime())) return "";
    const m = date.getUTCMonth();
    const southern = isSouthernHemisphere(destination);
    const season = (southern ? SEASONS_SOUTHERN_ES : SEASONS_NORTHERN_ES)[m];
    const hemi   = southern ? "hemisferio sur" : "hemisferio norte";
    return `\n  - Estación en destino: ${season} (${hemi}, ${MONTH_NAMES_ES[m]})`;
  }

  function buildDayOfWeekLine(start: string, durationDays: number): string {
    if (!start || !durationDays || durationDays <= 0) return "";
    const d0 = new Date(`${start}T00:00:00Z`);
    if (isNaN(d0.getTime())) return "";
    // Cap at 14 days printed inline — beyond that the prompt gets noisy.
    const cap = Math.min(durationDays, 14);
    const items: string[] = [];
    for (let i = 0; i < cap; i++) {
      const d = new Date(d0);
      d.setUTCDate(d0.getUTCDate() + i);
      items.push(`Día ${i + 1} ${WEEKDAY_LABELS_ES[d.getUTCDay()]}`);
    }
    const suffix = durationDays > cap ? ` (… +${durationDays - cap} más)` : "";
    return `\n  - Días de la semana: ${items.join(" · ")}${suffix}`;
  }

  // ── World Cup 2026 calendar helpers ─────────────────────────────────────────
  // The calendar is generated from lib/worldcup/data/<city>.ts (editorial
  // source of truth) by scripts/build-wc-calendar.mjs. The Edge Fn imports
  // the flat list + a host-city-hint lookup, and only surfaces a prompt block
  // when the trip overlaps a host city during the tournament window.

  function resolveWcCityId(destination: string): string | null {
    if (!destination) return null;
    const d = destination.toLowerCase();
    for (const [cityId, hints] of Object.entries(WC_HOST_CITY_HINTS)) {
      if (hints.some(h => d.includes(h.toLowerCase()))) return cityId;
    }
    return null;
  }

  function findWcMatchesInRange(cityId: string, start: string, end: string): WcMatch[] {
    if (!cityId || !start || !end) return [];
    return WC_2026_CALENDAR.filter(m =>
      m.cityId === cityId && m.date >= start && m.date <= end
    );
  }

  /**
   * Returns the full prompt fragment (data-block line + guidance block) when
   * the destination matches a WC host city AND the trip window overlaps real
   * matches. Empty string otherwise — non-WC trips don't see any of this
   * context, so prompt length stays honest.
   */
  function buildWcContext(destination: string, start: string, end: string): string {
    if (!destination || !start || !end) return "";
    const cityId = resolveWcCityId(destination);
    if (!cityId) return "";
    const matches = findWcMatchesInRange(cityId, start, end);
    if (matches.length === 0) return "";

    const lines = matches.map(m => {
      const teamsLabel = m.teams.some(t => t === "Por definir" || !t)
        ? `${m.tag}`
        : `${m.teamsLabel} — ${m.tag}`;
      return `      · ${m.dateRaw} ${m.day} ${m.time} — ${teamsLabel} (${m.stadium})`;
    }).join("\n");

    return `

  COPA MUNDIAL 2026 (importante — el viaje cae en sede mundialista):
  Hay ${matches.length} partido${matches.length === 1 ? "" : "s"} confirmado${matches.length === 1 ? "" : "s"} en ${matches[0].cityDisplay} durante la estancia:
${lines}

  Aplica este contexto al armar el itinerario:
    - HOSPEDAJE: la demanda y el precio son ALTOS en fechas de partido. Si el
      viajero NO va al estadio, sugiere reservar con anticipación o barrios
      alejados del recinto. Si va, hospedaje cerca del transit al estadio.
    - TRANSPORTE: el día de partido hay surge alto en Uber/taxis y saturación
      de transporte público alrededor del estadio (3 h antes / 2 h después).
      Recomienda salir con margen o evitar la zona en esas ventanas.
    - GASTRONOMÍA: restaurantes cerca del estadio y en zonas turísticas se
      llenan antes/después del partido. Sugiere reservar mesa con anticipación
      o pivotar a barrios alternativos.
    - SI EL VIAJERO QUIERE IR AL PARTIDO: incluye el partido como un bloque
      "tour" en el día correspondiente. Bloquea ~4 h alrededor (2 h antes,
      2 h después) sin otros bookings, y describe el partido en el name del
      bloque (ej. "Partido: México vs Sudáfrica en Estadio Banorte").
    - SI NO VA AL PARTIDO: aprovecha que la atención local está en el estadio
      para visitar atracciones tradicionalmente concurridas (museos, miradores)
      con menos cola en la franja del partido.`;
  }

  // ── Multi-city segments ─────────────────────────────────────────────────────
  // When the trip carries a `segments` array (≥2 entries), the prompt switches
  // from single-destination mode to a structured chain. Each segment has its
  // own destination + dates + nights, and accommodations must be emitted one
  // per segment.

  interface TripSegment {
    destination: string;
    startDate:   string;
    endDate:     string;
    nights:      number;
    /** Optional explicit origin for this segment. Persisted by the form
     *  only when the user sets it to something other than the previous
     *  segment's destination (i.e. the chain-implicit value). */
    origin?:     string;
  }

  function isMultiCity(segments: unknown): segments is TripSegment[] {
    return Array.isArray(segments) && segments.length >= 2
      && segments.every(s => s && typeof s === "object"
        && typeof (s as TripSegment).destination === "string"
        && typeof (s as TripSegment).startDate   === "string"
        && typeof (s as TripSegment).endDate     === "string");
  }

  function buildSegmentsContext(segments: TripSegment[]): string {
    if (!segments || segments.length < 2) return "";
    const chain = segments.map((s, i) => {
      // If the segment carries an explicit origin (user set From to
      // something other than the chain-implicit previous destination),
      // show it as "from X to Y" so the AI accounts for the transit.
      const where = s.origin
        ? `de ${s.origin} a ${s.destination}`
        : s.destination;
      return `      ${i + 1}) ${where} · ${s.startDate} → ${s.endDate} (${s.nights} noche${s.nights === 1 ? "" : "s"})`;
    }).join("\n");
    return `

  MULTI-CIUDAD (importante — el viaje tiene ${segments.length} tramos):
${chain}

  Aplica este contexto al armar el itinerario:
    - DÍAS DE TRANSICIÓN: el día en que se cambia de ciudad NO debe ser intensivo.
      Incluye el traslado como un bloque "transfer" temprano + 1-2 bloques opcionales
      al llegar. Sin tours largos ni cenas formales tarde el día de transición.
    - HOSPEDAJE POR TRAMO: DEBES emitir una entrada en "accommodations" POR CADA
      tramo (${segments.length} en total). Ver bloque ALOJAMIENTO POR TRAMO más abajo.
    - ITINERARIO POR TRAMO: respeta a qué ciudad pertenece cada día. No mezcles
      restaurantes ni atracciones de una ciudad en días que pertenecen a otra.
    - REPETICIONES: si una ciudad aparece más de una vez (base → escapada → base),
      la segunda estancia debe ofrecer actividades distintas a la primera. No
      repitas atracciones ni restaurantes.`;
  }

  // ── Jet-lag context ─────────────────────────────────────────────────────────
  // Coarse "is this a long-haul flight from Mexico-base?" lookup. The Edge Fn
  // serves a primarily Latin-American audience, so the heuristic assumes
  // Americas-origin; trans-continental destinations get a relaxed-arrival
  // prompt block. Future refinement: factor in true origin continent.

  const LONG_HAUL_HINTS = [
    // Europe
    "paris", "parís", "london", "londres", "madrid", "barcelona", "rome", "roma",
    "amsterdam", "berlin", "berlín", "lisbon", "lisboa", "milan", "milán",
    "vienna", "viena", "prague", "praga", "athens", "atenas", "porto", "oporto",
    "francia", "france", "italia", "italy", "españa", "spain", "alemania", "germany",
    "portugal", "grecia", "greece", "reino unido", "united kingdom",
    // Asia
    "tokyo", "tokio", "kyoto", "osaka", "seoul", "seúl", "beijing", "pekín",
    "shanghai", "shanghái", "bangkok", "singapore", "singapur", "hong kong",
    "taipei", "bali", "dubai", "estambul", "istanbul",
    "japon", "japón", "japan", "china", "tailandia", "thailand", "india",
    "turquía", "turkey", "vietnam", "indonesia",
    // Oceania
    "sydney", "melbourne", "auckland", "wellington",
    "australia", "nueva zelanda", "new zealand",
    // Africa
    "cape town", "ciudad del cabo", "el cairo", "cairo", "marrakech", "casablanca",
    "sudáfrica", "south africa", "marruecos", "morocco", "egipto", "egypt",
  ];

  function isLongHaul(destination: string): boolean {
    if (!destination) return false;
    const d = destination.toLowerCase();
    return LONG_HAUL_HINTS.some(h => d.includes(h));
  }

  function buildJetLagContext(destination: string, origin: string): string {
    if (!isLongHaul(destination)) return "";
    const originLabel = origin && origin.trim() ? origin.trim() : "México";
    return `

  VUELO LARGO (importante):
  El destino implica un vuelo de larga distancia desde ${originLabel}. Suaviza
  el día de llegada para acomodar jet-lag:
    - Día 1: máximo 3-4 bloques, mayormente flexibles ("paseo ligero por el
      barrio", "comida cercana al hotel"). Evita tours largos, museos extensos
      o actividades que requieran energía alta o reservas con hora estricta.
    - Cena del día 1: hora razonable (idealmente 19:30-20:30), restaurante a
      ≤15 minutos del hotel, ambiente tranquilo.
    - Día 2: ya puede tener intensidad normal.
    - Día de regreso: si el vuelo es por la tarde/noche, también de menor
      intensidad — deja 4-5 h libres antes del check-out al aeropuerto.`;
  }

  function buildPrompt(input: any): string {
    const d = input.duration_days as number;
    const interests = (input.interests || []).join(", ") || "(sin preferencias)";

    // Deterministic lodging context — computed in the calling layer
    // (Next /api/generate-trip) from start/end dates and passed through
    // so the model never invents nights.
    const nights    = typeof input.nights    === "number" ? input.nights    : Math.max(0, d - 1);
    const overnight = typeof input.overnight === "boolean" ? input.overnight : nights >= 1;
    const start     = typeof input.start === "string" ? input.start : "";
    const end       = typeof input.end   === "string" ? input.end   : "";

    // When the previous attempt produced bad output, the calling
    // layer sends a retryHint describing what failed. The retry prompt
    // is tighter — explicit rejection of the prior output shape +
    // diagnosis of what was wrong, so the model has a meaningful chance
    // of doing better on the second pass.
    const isRetryNoAccommodations = input.retryHint === "no_accommodations_emitted";
    const isRetryNoDays           = input.retryHint === "no_days_emitted";
    const isRetry                 = isRetryNoAccommodations || isRetryNoDays;

    // Multi-city: one accommodation REQUIRED per segment. Single-city falls
    // back to the original "at least 1 entry covering all nights" contract.
    const multiCity = isMultiCity(input.segments) ? input.segments as TripSegment[] : null;

    const accommodationsBlock = overnight
      ? multiCity
        ? `
  ALOJAMIENTO POR TRAMO (OBLIGATORIO):
  Este viaje tiene ${multiCity.length} tramos. DEBES devolver "accommodations" con UNA entrada
  POR CADA tramo (${multiCity.length} en total), en el mismo orden que los tramos:
${multiCity.map((s, i) => `    Tramo ${i + 1}:
      - city:         "${s.destination}"        ← usa esto exacto
      - checkInDate:  "${s.startDate}"          ← usa esto exacto
      - checkOutDate: "${s.endDate}"            ← usa esto exacto
      - nights:       ${s.nights}`).join("\n")}
  Cada entrada debe incluir además:
    - neighborhood: zona concreta dentro de esa ciudad
    - accommodationType: "hotel" | "boutique" | "hostel" | "apartment" | "resort" | "cabin" | "glamping"
    - rationale: 1 oración explicando por qué encaja con el tramo y el estilo
    - priceTier: "budget" | "mid" | "upscale" | "luxury"
    - familyFriendly: true | false`
        : `
  ALOJAMIENTO (OBLIGATORIO):
  Este viaje incluye ${nights} noche(s). DEBES devolver "accommodations" con al menos 1 entrada
  que cubra TODAS las noches (del ${start} al ${end}). Cada entrada:
    - city: "${input.destination}"                ← usa esto exacto
    - checkInDate: "${start}"                     ← usa esto exacto
    - checkOutDate: "${end}"                      ← usa esto exacto
    - nights: ${nights}
    - neighborhood: zona concreta (ej. "Roma Norte", "Coyoacán")
    - accommodationType: "hotel" | "boutique" | "hostel" | "apartment" | "resort" | "cabin" | "glamping"
    - rationale: 1 oración explicando por qué encaja con este itinerario y estilo
    - priceTier: "budget" | "mid" | "upscale" | "luxury"
    - familyFriendly: true | false`
      : `
  ALOJAMIENTO:
  Este viaje es de un solo día. Devuelve "accommodations": [] (arreglo vacío).`;

    const retryNote = isRetryNoDays
      ? `
  IMPORTANTE: La generación anterior devolvió un arreglo "days" vacío y fue rechazada.
  DEBES devolver exactamente ${d} día(s) en el arreglo "days", cada uno con 4-7 bloques.
  No omitas el arreglo. No lo dejes vacío. Genera contenido real para cada día.
  `
      : isRetryNoAccommodations
      ? `
  IMPORTANTE: La generación anterior NO incluyó alojamiento y fue rechazada.
  Asegúrate de que el arreglo "accommodations" esté completo según las reglas siguientes.
  `
      : "";

    // Phase 3 — family composition awareness. If traveler_details ships
    // children data, surface it explicitly in the prompt + add a soft
    // guidance block so the AI deliberately adapts venue / pacing / food
    // choices to the family. Kept short on purpose — the user warned us
    // not to overcorrect into "family spam".
    const td = input.traveler_details
    const isFamily   = input.travelers === "familia" && td && Array.isArray(td.children) && td.children.length > 0
    const familyLine = isFamily
      ? `\n  - Composición familiar: ${td.adults ?? 2} adulto(s) + ${td.children.length} niño(s) [${td.children.map((c: any) => c?.age ?? "?").join(", ")}]`
      : "";
    const familyGuidance = isFamily
      ? `

  VIAJE FAMILIAR (importante):
  El grupo incluye niños. Adapta el itinerario con criterio — sin exagerar — para que funcione
  para todos:
    - Restaurantes: prioriza opciones kid-friendly (menú infantil, espacios amplios, sin
      ambiente demasiado formal a la cena). Mantén variedad para los adultos.
    - Hoteles: prioriza opciones familiares (cuartos comunicantes, alberca, kit infantil).
    - Actividades: incluye 1-2 bloques por día que niños puedan disfrutar (parques,
      experiencias interactivas, museos con sección infantil). Evita atracciones con
      restricciones de edad evidentes.
    - Pacing: deja espacio para descansos a media tarde. No empujes 7 bloques en un día con
      niños pequeños — 4-5 es mejor.
    - No hagas el viaje exclusivamente para niños. Sigue siendo un viaje para todos.`
      : "";

    // Temporal context — derived once per prompt, surfaces in the data block.
    const seasonLine    = buildSeasonLine(start, input.destination);
    const weekdaysLine  = buildDayOfWeekLine(start, d);

    // WC 2026 context — only fires when destination is a host city AND the
    // trip window overlaps at least one real match. Empty for non-WC trips.
    const wcContext     = buildWcContext(input.destination, start, end);

    // Multi-city — fires only when input.segments has ≥2 contiguous entries.
    // Empty for single-city trips (the default).
    const segmentsContext = multiCity ? buildSegmentsContext(multiCity) : "";

    // Jet-lag — fires only when destination is on the long-haul hint list
    // (Europe / Asia / Oceania / Africa). Origin is surfaced in the prompt
    // so the AI knows where the relaxed Day 1 is coming from.
    const jetLagContext   = buildJetLagContext(input.destination, input.origin);

    // Layered temporal guidance — fires when we have a real start date.
    // Kept short on purpose; AI is smart enough to act on the structured
    // signal without a wall of instructions.
    const temporalGuidance = start
      ? `

  CONTEXTO TEMPORAL (importante):
  Aplica la estación y los días de la semana al armar el itinerario:
    - Estación: prioriza actividades apropiadas para el clima (interiores y
      bebidas calientes en invierno, sombra y horarios tempranos en verano,
      capas ligeras en transición). Refleja la ropa adecuada en el packing.
    - Días de la semana: respeta cierres habituales. Muchos museos cierran
      lunes (especialmente en Europa); mercados tradicionales suelen ser
      sábado o domingo; bancos cerrados domingo; algunos restaurantes
      tienen día de descanso (lunes o martes es lo común). Asigna cada
      bloque al día concreto que le toca.`
      : "";

    return `Genera un itinerario de viaje con estos datos:
  - Origen: ${input.origin ?? "(no especificado)"}
  - Destino: ${input.destination}
  - Duración: ${d} días${overnight ? ` (${nights} noche(s))` : " (sin pernocta)"}
  - Fechas: ${start || "(no especificadas)"} → ${end || "(no especificadas)"}${seasonLine}${weekdaysLine}
  - Viajeros: ${input.travelers} persona(s)${familyLine}
  - Estilo: ${input.travel_style}
  - Presupuesto: ${input.budget_level}
  - Intereses: ${interests}
  ${retryNote}${accommodationsBlock}${segmentsContext}${jetLagContext}${familyGuidance}${temporalGuidance}${wcContext}

  TIPOS DE BLOQUE (CRÍTICO):
  Cada bloque DEBE tener un \`type\` exacto del enum. Úsalo intencionalmente:
    - "hotel"      → check-in, check-out, llegada/salida del hotel, descanso en alojamiento.
    - "restaurant" → cualquier comida bookeable: desayuno, almuerzo, comida, cena, brunch
                     en un restaurante / fonda / taquería / marisquería / parrilla /
                     café / panadería / bistró específico.
    - "tour"       → atracciones, museos, recorridos guiados, experiencias, clases,
                     excursiones, parques temáticos, actividades programadas.
    - "transfer"   → vuelos, traslados al/del aeropuerto, taxis, Uber, autobús, tren,
                     ferry, metro, renta de auto, shuttle, transporte entre puntos.
    - "culture"    → exploración cultural sin booking (callejear por un barrio, plazas,
                     mercados como paseo, miradores, edificios históricos en exterior).
    - "nature"     → exploración natural sin booking (playa, parques, senderos cortos,
                     observación de paisaje).
    - "free"       → tiempo libre / opcional / descanso sin estructura específica.

  Regla clave: si el bloque es una comida en un lugar concreto, type DEBE ser "restaurant",
  NUNCA "free", "culture" o "nature". El usuario debe poder reservar mesa desde ese bloque.

  Llama a la herramienta emit_trip con el itinerario completo. Usa lugares, restaurantes y rutas reales de
  ${input.destination}. Incluye exactamente ${d} día(s). Cada día debe tener entre 4 y 7 bloques.`;
  }                                                                                                            
                                                                                                                 
  serve(async (req) => {          
    if (req.method === "OPTIONS") {                                                                              
      return new Response(null, { headers: corsHeaders });  
    }                                                                                                          
                                                                                                                 
    if (req.method !== "POST") {  
      return errorResponse(405, "method_not_allowed", "Only POST is supported");                                 
    }                                                       
                                                                                                               
    const startedAt = Date.now();                                                                                
                                                                                                               
    try {                                                                                                        
      if (!ANTHROPIC_API_KEY) {                             
        console.error("[generate-trip] ANTHROPIC_API_KEY missing");                                              
        return errorResponse(503, "config_missing", "Anthropic API key not configured");
      }                                                                                                        
                                                                                                                 
      let body: any;              
      try {                                                                                                      
        body = await req.json();                            
      } catch {                                                                                                
        return errorResponse(400, "invalid_body", "Request body is not valid JSON");                             
      }                           
                                                                                                                 
      if (!body?.destination) {                                                                                
        return errorResponse(400, "missing_destination", "destination is required");                             
      }                           
                                                                                                                 
      const rawDays = Number(body.duration_days ?? body.nights ?? 5);                                            
      const duration_days = Math.min(Math.max(rawDays || 5, 1), 30);                                           
                                                                                                                 
      // Nights / overnight are deterministic — computed by the calling
      // layer (Next /api/generate-trip) from the date range. The Edge
      // Function only re-derives them if the caller didn't provide them
      // (e.g. direct invocations from tests or legacy clients).
      const nights = typeof body.nights === "number"
        ? body.nights
        : Math.max(0, duration_days - 1);
      const overnight = typeof body.overnight === "boolean"
        ? body.overnight
        : nights >= 1;

      const input = {
        ...body,
        duration_days,
        nights,
        overnight,
        start:        typeof body.start === "string" ? body.start : "",
        end:          typeof body.end   === "string" ? body.end   : "",
        travelers:    body.travelers    ?? 2,
        travel_style: body.travel_style ?? body.pace   ?? "cultural",
        budget_level: body.budget_level ?? body.budget ?? "medium",
        retryHint:    typeof body.retryHint === "string" ? body.retryHint : undefined,
      };                                                                                                       
                                                                                                                 
      const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",                                                                                          
        headers: {                                                                                               
          "Content-Type":      "application/json",
          "x-api-key":         ANTHROPIC_API_KEY,                                                                
          "anthropic-version": "2023-06-01",                                                                   
        },                                                                                                       
        body: JSON.stringify({                                                                                 
          model: "claude-sonnet-4-20250514",                                                                     
          max_tokens: 16000,                                
          system: SYSTEM_PROMPT,                                                                                 
          tools: [{                                         
            name: "emit_trip",                                                                                 
            description: "Emite el itinerario de viaje estructurado.",                                           
            input_schema: TRIP_SCHEMA,
          }],                                                                                                    
          tool_choice: { type: "tool", name: "emit_trip" },                                                      
          messages: [{ role: "user", content: buildPrompt(input) }],
        }),                                                                                                      
      });                                                                                                        
                                  
      const ms = Date.now() - startedAt;                                                                         
                                                                                                               
      if (!claudeRes.ok) {                                                                                       
        const errText = await claudeRes.text().catch(() => "");
        console.error("[generate-trip] claude upstream", claudeRes.status, errText.slice(0, 500));               
        return errorResponse(502, "claude_upstream_failed", `Claude API returned ${claudeRes.status}`, {       
          status: claudeRes.status,                                                                              
          body: errText.slice(0, 500),                                                                           
        });                                                                                                      
      }                                                                                                          
                                                                                                                 
      const claudeData = await claudeRes.json();            
                                                                                                               
      console.log("[generate-trip]", JSON.stringify({                                                            
        stop_reason:   claudeData.stop_reason,
        input_tokens:  claudeData.usage?.input_tokens,                                                           
        output_tokens: claudeData.usage?.output_tokens,                                                        
        ms,                                                                                                      
      }));                                                                                                     
                                                                                                                 
      if (claudeData.stop_reason === "max_tokens") {        
        return errorResponse(502, "llm_truncated", `La respuesta del modelo excedió el límite de tokens. Reduce  
  la duración o los intereses e intenta de nuevo.`, {       
          output_tokens: claudeData.usage?.output_tokens,                                                      
        });                                                                                                      
      }                                                                                                        
                                                                                                                 
      const toolUse = Array.isArray(claudeData.content)     
        ? claudeData.content.find((c: any) => c?.type === "tool_use" && c?.name === "emit_trip")                 
        : null;                                             
                                                                                                               
      if (!toolUse?.input) {                                                                                     
        console.error("[generate-trip] no tool_use in response", JSON.stringify(claudeData).slice(0, 500));    
        return errorResponse(502, "llm_no_tool_use", "El modelo no emitió la estructura esperada", {             
          stop_reason: claudeData.stop_reason,                                                                 
        });                                                                                                      
      }                                                                                                          
                                                                                                                 
      return new Response(                                                                                       
        JSON.stringify({ success: true, trip_data: toolUse.input }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );                                                                                                       
                                                                                                                 
    } catch (err) {                                                                                              
      const message = err instanceof Error ? err.message : String(err);                                          
      console.error("[generate-trip] unhandled", message);                                                       
      return errorResponse(500, "internal", `Internal error: ${message}`);                                     
    }                                                                                                            
  });