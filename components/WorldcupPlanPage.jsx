"use client";

export default function WorldCupPlanPage({ plan }) {
  if (!plan) return null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 space-y-16">

      {/* ========================= */}
      {/* HERO */}
      {/* ========================= */}

      <section className="space-y-4">
        <p className="text-sm tracking-widest text-gray-500">
          YOUR WORLD CUP PLAN
        </p>

        <h1 className="text-5xl font-serif text-green-900 leading-tight">
          {plan.route.join(" → ")}
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl">
          {plan.summary.totalMatches} matches ·{" "}
          {plan.summary.cities} cities ·{" "}
          {plan.summary.duration} days
        </p>
      </section>

      {/* ========================= */}
      {/* ROUTE TIMELINE */}
      {/* ========================= */}

      <section className="space-y-8">
        <h2 className="text-2xl font-serif text-green-900">
          Your journey
        </h2>

        <div className="space-y-10">
          {plan.matches.map((match, index) => (
            <div key={match.id} className="space-y-4">

              {/* MATCH CARD */}
              <div className="border p-6 flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">
                    {formatDate(match.date)}
                  </p>

                  <h3 className="text-xl font-semibold">
                    {match.team} vs {match.opponent}
                  </h3>

                  <p className="text-gray-600">{match.city}</p>
                </div>

                <span className="text-xs uppercase text-green-900">
                  {match.stage}
                </span>
              </div>

              {/* TRANSITION */}
              {plan.transitions[index] && (
                <div className="text-sm text-gray-500 px-2">
                  ✈ {plan.transitions[index].from} →{" "}
                  {plan.transitions[index].to} ·{" "}
                  {plan.transitions[index].daysBetween} days
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ========================= */}
      {/* SMART LAYERS */}
      {/* ========================= */}

      <section className="space-y-8">
        <h2 className="text-2xl font-serif text-green-900">
          Where to stay (by stop)
        </h2>

        <div className="space-y-6">
          {plan.route.map((city) => (
            <div key={city} className="border p-6">
              <h3 className="font-semibold text-lg">{city}</h3>
              <p className="text-sm text-gray-600">
                Best areas selected based on your route and timing
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================= */}
      {/* EXPERIENCE LAYER */}
      {/* ========================= */}

      <section className="space-y-8">
        <h2 className="text-2xl font-serif text-green-900">
          Between matches
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="border p-6">
            <h3 className="font-semibold">Recovery days</h3>
            <p className="text-sm text-gray-600">
              Built-in rest based on match spacing
            </p>
          </div>

          <div className="border p-6">
            <h3 className="font-semibold">Local highlights</h3>
            <p className="text-sm text-gray-600">
              Top experiences near your route
            </p>
          </div>
        </div>
      </section>

      {/* ========================= */}
      {/* CTA */}
      {/* ========================= */}

      <section className="pt-10 border-t flex justify-between items-center">
        <button className="text-sm text-gray-500">
          ← Adjust plan
        </button>

        <button className="bg-green-900 text-white px-6 py-3">
          Save / Share →
        </button>
      </section>
    </div>
  );
}

/* ========================= */
/* HELPERS */
/* ========================= */

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}