import React from "react";

export default function MyTripsV3() {
  const hoteles = ["Hoteles familiares", "Boutique stays", "Mejor ubicación"];
  const guias = ["Guía Tokyo con niños", "Itinerario 5 días", "Top barrios"];
  const smart = ["Qué empacar Japón", "Kit avión largo", "Viajar con niños"];

  const trips = [
    {
      name: "Tokyo",
      active: true,
      days: "10 días",
      tagline: "En progreso",
      chips: ["Familia", "Cultura", "Ritmo medio"],
    },
    {
      name: "Oaxaca",
      days: "4 días",
      tagline: "Escapada cultural",
      chips: ["Pareja", "Gastronomía", "Relajado"],
    },
    {
      name: "CDMX",
      days: "3 días",
      tagline: "Fin de semana",
      chips: ["Amigos", "Ciudad", "Intenso"],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F0E8] text-[#1B4D3E] font-sans">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-serif mb-2">Hola, Elena 👋</h1>
        <p className="text-[#6B7280]">Tus viajes y todo lo que necesitas para mejorarlos</p>
      </div>

      {/* YOUR TRIPS */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif">Tus viajes</h2>
          <button className="text-sm underline">+ Nuevo viaje</button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <div
              key={trip.name}
              className={`group flex flex-col rounded-2xl overflow-hidden bg-white transition cursor-pointer ${trip.active ? "shadow-md" : "hover:shadow-lg"}`}
            >

              {/* TOP LINE ACTIVE */}
              {trip.active && (
                <div className="h-[3px] w-full bg-[#1B4D3E]" />
              )}

              {/* COVER */}
              <div className="relative h-44 overflow-hidden">
                <div
                  className="w-full h-full"
                  style={{
                    background:
                      trip.name === "Tokyo"
                        ? "linear-gradient(135deg, #2E5E4E 0%, #6E9F8F 100%)"
                        : trip.name === "Oaxaca"
                        ? "linear-gradient(135deg, #A67C52 0%, #E6C7A3 100%)"
                        : "linear-gradient(135deg, #2C3E50 0%, #6C8EA4 100%)",
                  }}
                />

                <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
                     style={{
                       backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
                       backgroundSize: "6px 6px",
                     }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                <div className="absolute bottom-4 left-5 text-white/90 font-serif text-3xl">
                  {trip.name.substring(0, 2).toUpperCase()}
                </div>

                {trip.active && (
                  <div className="absolute top-3 right-3 bg-white text-[#1B4D3E] text-xs px-2 py-1 rounded-full shadow-sm">
                    Último viaje
                  </div>
                )}
              </div>

              {/* CONTENT */}
              <div className="p-5 flex flex-col gap-2">
                <h3 className="font-serif text-lg">{trip.name}</h3>
                <p className="text-sm text-[#6B7280]">Ver itinerario →</p>
                <p className="text-xs text-[#1B4D3E]/70">
                  {trip.days} • {trip.tagline}
                </p>

                <div className="flex flex-wrap gap-2 text-[11px] mt-2">
                  {trip.chips.map((chip) => (
                    <span key={chip} className="px-2 py-1 border rounded-full bg-[#F8F5EF] border-[#E5E0D6]">
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* DIVIDER */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="h-px bg-[#E5E0D6]" />
      </div>

      {/* USEFUL SECTION */}
      <section className="max-w-7xl mx-auto px-6 pb-24">

          <div className="mb-12 max-w-2xl">
            <h2 className="text-4xl font-serif mb-3">Útil para tus viajes</h2>
            <p className="text-[#6B7280] text-sm">
              Recomendaciones seleccionadas para mejorar tu experiencia
            </p>
          </div>

          {/* HOTELS BLOCK */}
          <div className="mb-20">
            <div className="flex justify-between items-end mb-8">
              <h3 className="font-serif text-lg text-[#6B7280]">Hoteles recomendados</h3>
              <span className="text-sm underline">Ver todos</span>
            </div>

            <div className="grid md:grid-cols-3 gap-6 opacity-90">
              {hoteles.map((h) => (
                <div key={h} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition">
                  <p className="text-xs text-[#6B7280] mb-1">Hotel</p>
                  <h4 className="font-semibold">{h}</h4>
                </div>
              ))}
            </div>
          </div>

          {/* SMART BLOCK */}
          <div className="mb-20">
            <div className="flex justify-between items-end mb-8">
              <h3 className="font-serif text-lg text-[#6B7280]">Smart finds</h3>
              <span className="text-sm underline">Ver todos</span>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {smart.map((s) => (
                <div key={s} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition">
                  <p className="text-xs text-[#6B7280] mb-1">Tip</p>
                  <h4 className="font-serif">{s}</h4>
                </div>
              ))}
            </div>
          </div>

          {/* GUIDES BLOCK */}
          <div>
            <div className="flex justify-between items-end mb-8">
              <h3 className="font-serif text-2xl">Guías</h3>
              <span className="text-sm underline">Ver todos</span>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {guias.map((g, i) => (
                <div key={g} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer">
                  {/* IMAGE */}
                  <div className="h-28 bg-gradient-to-br from-[#C7D2FE] to-[#A5B4FC]" />

                  {/* CONTENT */}
                  <div className="p-4">
                    <p className="text-[10px] text-[#6B7280] uppercase tracking-wide mb-1">Guía</p>
                    <h4 className="font-serif text-sm leading-snug">{g}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

      </section>

    </div>
  );
}
