/**
 * Generic UI labels shared across all 16 World Cup city guides.
 * City-specific copy lives in each lib/worldcup/data/<slug>.ts file.
 */

export type WorldcupUi = {
  // Match card
  rivalTBD: string
  // Show more / less
  showMore: string
  showLess: string
  // Stay card
  checkAvailability: string
  // Sidebar
  plannerKicker: string
  plannerPitch: string
  lagomNotes: string
  matchDayChecklist: string
  didYouKnow: string
  optimizeAi: string
  optimizeAiPitch: string
  optimizeAiCta: string
  // Hero
  matchesLabel: string
  // Sticky nav
  navMatches: string
  navManifesto: string
  navStays: string
  navVibe: string
  navLogistics: string
  navFood: string
  navBeyond: string
  navItinerary: string
  // Itinerary section (used by cities that include guide.itinerary)
  sectionItineraryTitle: string
  matchDayBadge: string
  // Section 01
  section01Title: string
  // Section 02
  section02Title: string
  section02Subtitle: string
  // Section 03
  section03Title: string
  section03Subtitle: string
  // Section 04
  section04Title: string
  // Section 05
  section05Title: string
  section05RealTimes: string
  section05Timeline: string
  // Section 06
  section06Title: string
  foodWhatToOrder: string
  foodVibe: string
  // Section 07
  section07Title: string
  section07Subtitle: string
}

export const ui: { es: WorldcupUi; en: WorldcupUi } = {
  es: {
    rivalTBD: "Rival por definir al terminar fase de grupos",
    showMore: "Ver más ↓",
    showLess: "Ver menos ↑",
    checkAvailability: "Ver disponibilidad",
    plannerKicker: "Lagomplan · Planificador",
    plannerPitch: "¿Listo para tu versión del Mundial? Convierte esta guía en un itinerario adaptado a tus tiempos y presupuesto.",
    lagomNotes: "Notas Lagom",
    matchDayChecklist: "Checklist día de partido",
    didYouKnow: "¿Sabías que?",
    optimizeAi: "Optimizar itinerario con IA",
    optimizeAiPitch: "Dinos cuántos días tienes y cuáles partidos quieres ver. La IA arma la ruta.",
    optimizeAiCta: "Optimizar ruta →",
    matchesLabel: "partidos",
    navMatches: "Partidos",
    navManifesto: "Manifiesto",
    navStays: "Dónde dormir",
    navVibe: "Ambiente",
    navLogistics: "Llegar",
    navFood: "Comer",
    navBeyond: "Fuera del estadio",
    navItinerary: "Itinerario",
    sectionItineraryTitle: "Ruta sugerida",
    matchDayBadge: "Día de partido",
    section01Title: "Tus partidos",
    section02Title: "Manifiesto de campo",
    section02Subtitle: "Lo que necesitas saber antes de llegar.",
    section03Title: "Dónde dormir · Base de descanso",
    section03Subtitle: "Refugios seleccionados para recargar energías entre diseño de autor y confort estratégico.",
    section04Title: "Siente el ambiente",
    section05Title: "Llegar al estadio",
    section05RealTimes: "Tiempos reales de desplazamiento",
    section05Timeline: "Cronología recomendada",
    section06Title: "Dónde comer · Sobremesa mundialista",
    foodWhatToOrder: "Qué pedir",
    foodVibe: "Vibe",
    section07Title: "Fuera del estadio",
    section07Subtitle: "El entretiempo ideal para descubrir que hay vida — y mucha cultura — más allá de los 90 minutos.",
  },
  en: {
    rivalTBD: "Opponent TBD after group stage",
    showMore: "Show more ↓",
    showLess: "Show less ↑",
    checkAvailability: "Check availability",
    plannerKicker: "Lagomplan · Planner",
    plannerPitch: "Ready for your version of the World Cup? Turn this guide into an itinerary tailored to your schedule and budget.",
    lagomNotes: "Lagom notes",
    matchDayChecklist: "Match-day checklist",
    didYouKnow: "Did you know?",
    optimizeAi: "Optimize your itinerary with AI",
    optimizeAiPitch: "Tell us how many days you have and which matches you want to see. The AI builds the route.",
    optimizeAiCta: "Optimize route →",
    matchesLabel: "matches",
    navMatches: "Matches",
    navManifesto: "Manifesto",
    navStays: "Where to stay",
    navVibe: "Atmosphere",
    navLogistics: "Getting there",
    navFood: "Eating",
    navBeyond: "Beyond the stadium",
    navItinerary: "Itinerary",
    sectionItineraryTitle: "Suggested route",
    matchDayBadge: "Match day",
    section01Title: "Your matches",
    section02Title: "Field manifesto",
    section02Subtitle: "What you need to know before arriving.",
    section03Title: "Where to stay · Rest base",
    section03Subtitle: "Curated retreats to recharge between chef-driven design and strategic comfort.",
    section04Title: "Feel the atmosphere",
    section05Title: "Getting to the stadium",
    section05RealTimes: "Real travel times",
    section05Timeline: "Recommended timeline",
    section06Title: "Where to eat · World Cup table",
    foodWhatToOrder: "What to order",
    foodVibe: "Vibe",
    section07Title: "Beyond the stadium",
    section07Subtitle: "The perfect halftime to discover there's life — and real culture — beyond the 90 minutes.",
  },
}
