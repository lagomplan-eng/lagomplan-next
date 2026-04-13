import React, { useMemo, useState } from "react";
import {
  CalendarDays,
  MapPin,
  Pencil,
  Plus,
  ChevronDown,
  ChevronRight,
  Sparkles,
  BedDouble,
  Wallet,
  CheckCircle2,
  Circle,
  Share2,
  Bookmark,
  Download,
  Plane,
  Car,
  Utensils,
  Waves,
  Trees,
  Coffee,
  X,
  SlidersHorizontal,
  Luggage,
} from "lucide-react";

const fonts = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&family=Fraunces:opsz,wght@9..144,600&display=swap');
`;

type ItemType = "hotel" | "activity" | "food" | "transfer" | "free" | "relax";

type TripItem = {
  id: string;
  time: string;
  type: ItemType;
  title: string;
  description: string;
  tags: string[];
  price?: string;
  cta?: string;
  booked?: boolean;
};

type DayPlan = {
  id: string;
  label: string;
  title: string;
  progress: string;
  note: string;
  items: TripItem[];
};

type EditState = {
  dayId: string;
  itemId: string;
  title: string;
  description: string;
  price: string;
};

type TripPreferences = {
  travelers: string;
  style: string;
  budget: string;
  origin: string;
  interests: string;
};

type ChecklistItem = {
  id: string;
  label: string;
  done: boolean;
};

type PackingItem = {
  id: string;
  label: string;
  packed: boolean;
  tag: string;
};

const initialPreferences: TripPreferences = {
  travelers: "Pareja · 2 viajeros",
  style: "Relajado",
  budget: "$15k–20k MXN",
  origin: "Vuelo desde CDMX",
  interests: "Playa + gastronomía",
};

const initialChecklist: ChecklistItem[] = [
  { id: "flights", label: "Vuelos confirmados", done: true },
  { id: "hotel", label: "Hotel por reservar", done: false },
  { id: "tour", label: "Tour del Día 2 pendiente", done: false },
  { id: "transfer", label: "Traslado aeropuerto pendiente", done: false },
  { id: "docs", label: "Documentos listos", done: true },
];

const initialPacking: PackingItem[] = [
  { id: "sun", label: "Bloqueador FPS 50+", packed: true, tag: "Esencial" },
  { id: "light", label: "Ropa ligera para 3 noches", packed: false, tag: "Playa" },
  { id: "water", label: "Calzado de agua", packed: false, tag: "Actividad" },
  { id: "dinner", label: "1 look para cena especial", packed: false, tag: "Noche" },
  { id: "repellent", label: "Repelente para la selva", packed: false, tag: "Salud" },
];

const initialDays: DayPlan[] = [
  {
    id: "day-1",
    label: "Día 01 · Jueves 17 Abr",
    title: "Llegada y primer atardecer",
    progress: "50% listo",
    note: "Confirma hospedaje primero para cerrar la base del viaje.",
    items: [
      {
        id: "hotel-mousai",
        time: "15:00",
        type: "hotel",
        title: "Hotel Mousai Puerto Vallarta",
        description:
          "Resort con vista al Pacífico y buen punto de partida para una llegada ligera, sin demasiados traslados.",
        tags: ["3 noches", "Vista mar", "Semana Santa"],
        price: "$8,400 MXN",
        cta: "Ver opciones",
      },
      {
        id: "dinner-artistes",
        time: "20:30",
        type: "food",
        title: "Cena en Café des Artistes",
        description:
          "Una cena con más atmósfera que ruido. Ideal para abrir el viaje con algo memorable.",
        tags: ["Reserva", "Cena", "Romántico"],
        price: "$1,800 MXN",
        cta: "Reservar mesa",
      },
    ],
  },
  {
    id: "day-2",
    label: "Día 02 · Viernes 18 Abr",
    title: "Mar, Malecón y mezcal",
    progress: "70% listo",
    note: "El tour de la mañana es tu siguiente punto de conversión.",
    items: [
      {
        id: "arcos-tour",
        time: "08:00",
        type: "activity",
        title: "Kayak + snorkel en Los Arcos",
        description:
          "Experiencia activa con guía. Funciona bien si quieren mañana de mar y tarde libre.",
        tags: ["4 hrs", "Guía", "Mañana"],
        price: "$1,200 MXN p/p",
        cta: "Reservar tour",
      },
      {
        id: "malecon-free",
        time: "17:00",
        type: "free",
        title: "Paseo libre por el Malecón y Zona Romántica",
        description:
          "Bloque flexible para caminar, improvisar, entrar a tiendas y bajar el ritmo.",
        tags: ["Libre", "Tarde", "Sin reserva"],
      },
      {
        id: "octopus-garden",
        time: "20:00",
        type: "food",
        title: "Cena frente al mar · Octopus Garden",
        description:
          "Una cena más casual, ideal después del día activo.",
        tags: ["Mariscos", "Vista", "Noche"],
        price: "$900 MXN",
      },
    ],
  },
  {
    id: "day-3",
    label: "Día 03 · Sábado 19 Abr",
    title: "Jungla, cenote y despedida",
    progress: "40% listo",
    note: "Todavía puedes cerrar este día con una experiencia más suave si quieren menos actividad.",
    items: [
      {
        id: "cenote-tour",
        time: "09:00",
        type: "activity",
        title: "Canopy + cenote",
        description:
          "Tour de media jornada para cerrar con algo más aventurero.",
        tags: ["Selva", "Transfer", "Medio día"],
        price: "$1,500 MXN p/p",
        cta: "Reservar tour",
      },
      {
        id: "spa-block",
        time: "16:00",
        type: "relax",
        title: "Spa o tarde libre antes del regreso",
        description:
          "Bloque abierto para bajar revoluciones antes del vuelo o aprovechar el hotel.",
        tags: ["Flexible", "Hotel", "Opcional"],
        price: "$600 MXN",
      },
    ],
  },
];

const typeConfig: Record<
  ItemType,
  { label: string; icon: React.ReactNode; accent: string; soft: string }
> = {
  hotel: {
    label: "Hotel",
    icon: <BedDouble className="h-4 w-4" />,
    accent: "#0F3A33",
    soft: "#EEF5F2",
  },
  activity: {
    label: "Actividad",
    icon: <Waves className="h-4 w-4" />,
    accent: "#2D4F6C",
    soft: "#EEF4F8",
  },
  food: {
    label: "Comida",
    icon: <Utensils className="h-4 w-4" />,
    accent: "#9A5E1A",
    soft: "#FBF2E8",
  },
  transfer: {
    label: "Traslado",
    icon: <Car className="h-4 w-4" />,
    accent: "#6B5B95",
    soft: "#F3F0FA",
  },
  free: {
    label: "Libre",
    icon: <Coffee className="h-4 w-4" />,
    accent: "#6B8F86",
    soft: "#F3F6F5",
  },
  relax: {
    label: "Relax",
    icon: <Trees className="h-4 w-4" />,
    accent: "#3F7A63",
    soft: "#EEF7F2",
  },
};

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#D9D3CC] bg-white px-3 py-1 text-[11px] font-medium text-[#0F3A33]/75">
      {children}
    </span>
  );
}

function ItemCard({
  item,
  onEdit,
}: {
  item: TripItem;
  onEdit: () => void;
}) {
  const config = typeConfig[item.type];
  return (
    <article
      className="rounded-[22px] border border-[#D9D3CC] bg-white p-5 shadow-[0_1px_0_rgba(15,58,51,0.03)]"
      style={{ borderLeft: `4px solid ${config.accent}` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]"
              style={{ color: config.accent, background: config.soft }}
            >
              {config.icon}
              {config.label}
            </span>
            <span className="font-mono text-[11px] text-[#6B8F86]">{item.time}</span>
            {item.booked ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#EDF7F1] px-2.5 py-1 text-[10px] font-semibold text-[#2F7D46]">
                <CheckCircle2 className="h-3.5 w-3.5" /> Confirmado
              </span>
            ) : null}
          </div>

          <h4 className="text-[18px] font-extrabold leading-tight text-[#0F3A33]">{item.title}</h4>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#0F3A33]/72">{item.description}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <Pill key={tag}>{tag}</Pill>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-3">
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-2 rounded-full border border-[#D9D3CC] bg-[#FFF9F3] px-3 py-1.5 text-xs font-semibold text-[#0F3A33]/75 transition hover:border-[#6B8F86] hover:text-[#0F3A33]"
            type="button"
          >
            <Pencil className="h-3.5 w-3.5" /> Editar
          </button>
          {item.price ? <div className="text-right text-sm font-bold text-[#0F3A33]">{item.price}</div> : null}
          {item.cta ? (
            <button
              type="button"
              className="rounded-full bg-[#0F3A33] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#17463e]"
            >
              {item.cta}
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function DaySection({
  day,
  expanded,
  onToggle,
  onEditItem,
}: {
  day: DayPlan;
  expanded: boolean;
  onToggle: () => void;
  onEditItem: (item: TripItem) => void;
}) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-[#D9D3CC] bg-white shadow-[0_1px_0_rgba(15,58,51,0.03)]">
      <button
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left"
        type="button"
      >
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#6B8F86]">{day.label}</div>
          <h3 className="mt-2 text-[24px] font-extrabold tracking-[-0.02em] text-[#0F3A33]">{day.title}</h3>
          <p className="mt-2 text-sm leading-6 text-[#0F3A33]/65">{day.note}</p>
        </div>
        <div className="flex shrink-0 items-center gap-3 pt-1">
          <span className="rounded-full bg-[#EEF5F2] px-3 py-1 text-[11px] font-semibold text-[#0F3A33]">
            {day.progress}
          </span>
          <span className="rounded-full border border-[#D9D3CC] bg-[#FFF9F3] p-2 text-[#0F3A33]/70">
            {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </span>
        </div>
      </button>

      {expanded ? (
        <div className="border-t border-[#E8E0D8] px-6 pb-6 pt-5">
          <div className="space-y-4">
            {day.items.map((item) => (
              <ItemCard key={item.id} item={item} onEdit={() => onEditItem(item)} />
            ))}
          </div>

          <button
            type="button"
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-dashed border-[#C7D7D1] bg-[#FFF9F3] px-4 py-2 text-sm font-semibold text-[#0F3A33]/75 transition hover:border-[#6B8F86] hover:text-[#0F3A33]"
          >
            <Plus className="h-4 w-4" /> Añadir actividad
          </button>
        </div>
      ) : null}
    </section>
  );
}

function EditDrawer({
  state,
  onClose,
  onChange,
  onSave,
}: {
  state: EditState | null;
  onClose: () => void;
  onChange: (patch: Partial<EditState>) => void;
  onSave: () => void;
}) {
  if (!state) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end bg-black/20 backdrop-blur-[2px] md:items-center md:justify-center">
      <div className="h-[88vh] w-full max-w-2xl overflow-auto rounded-t-[28px] border border-[#D9D3CC] bg-[#FFF9F3] p-6 shadow-2xl md:h-auto md:rounded-[28px]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#6B8F86]">Editar itinerario</div>
            <h3 className="mt-2 text-[28px] font-extrabold tracking-[-0.02em] text-[#0F3A33]">Ajusta esta parte del viaje</h3>
            <p className="mt-2 text-sm leading-6 text-[#0F3A33]/68">
              Cambia el nombre, la descripción o el precio sin romper el diseño editorial del plan.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#D9D3CC] bg-white p-2 text-[#0F3A33]/70"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 grid gap-4">
          <label className="grid gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#6B8F86]">Nombre</span>
            <input
              value={state.title}
              onChange={(e) => onChange({ title: e.target.value })}
              className="rounded-2xl border border-[#D9D3CC] bg-white px-4 py-3 text-sm outline-none"
            />
          </label>

          <label className="grid gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#6B8F86]">Descripción</span>
            <textarea
              value={state.description}
              onChange={(e) => onChange({ description: e.target.value })}
              className="min-h-[120px] rounded-2xl border border-[#D9D3CC] bg-white px-4 py-3 text-sm outline-none"
            />
          </label>

          <label className="grid gap-2 md:max-w-[240px]">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#6B8F86]">Precio</span>
            <input
              value={state.price}
              onChange={(e) => onChange({ price: e.target.value })}
              className="rounded-2xl border border-[#D9D3CC] bg-white px-4 py-3 text-sm outline-none"
            />
          </label>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 md:flex-row md:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#D9D3CC] bg-white px-5 py-3 text-sm font-semibold text-[#0F3A33]/75"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onSave}
            className="rounded-full bg-[#0F3A33] px-6 py-3 text-sm font-semibold text-white"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LagomplanTripResultsV2() {
  const [days, setDays] = useState(initialDays);
  const [preferences, setPreferences] = useState(initialPreferences);
  const [checklist, setChecklist] = useState(initialChecklist);
  const [packing, setPacking] = useState(initialPacking);
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({
    "day-1": true,
    "day-2": true,
    "day-3": true,
  });
  const [editState, setEditState] = useState<EditState | null>(null);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  const completion = useMemo(() => {
    const total = checklist.length;
    const done = checklist.filter((i) => i.done).length;
    return { done, total };
  }, [checklist]);

  const packedCount = useMemo(() => packing.filter((i) => i.packed).length, [packing]);

  const openEdit = (dayId: string, item: TripItem) => {
    setEditState({
      dayId,
      itemId: item.id,
      title: item.title,
      description: item.description,
      price: item.price ?? "",
    });
  };

  const saveEdit = () => {
    if (!editState) return;
    setDays((current) =>
      current.map((day) =>
        day.id !== editState.dayId
          ? day
          : {
              ...day,
              items: day.items.map((item) =>
                item.id !== editState.itemId
                  ? item
                  : {
                      ...item,
                      title: editState.title,
                      description: editState.description,
                      price: editState.price,
                    }
              ),
            }
      )
    );
    setEditState(null);
  };

  const budgetRows = [
    ["Hospedaje", "$8,400 MXN", "Pendiente"],
    ["Vuelos", "$9,200 MXN", "Confirmado"],
    ["Actividades", "$5,400 MXN", "Parcial"],
    ["Comidas", "$2,700 MXN", "Estimado"],
    ["Traslados", "$500 MXN", "Pendiente"],
  ];

  return (
    <div
      className="min-h-screen bg-[#FFF9F3] text-[#0F3A33]"
      style={{ fontFamily: "Manrope, system-ui, Segoe UI, Roboto, Arial, sans-serif" }}
    >
      <style>{fonts}</style>

      

      <section className="bg-[#FFF9F3]">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px]">
            <div className="min-w-0 max-w-3xl">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6B8F86]">Resultado del plan</div>
              <h1 className="mt-4 text-5xl font-extrabold leading-[0.95] tracking-[-0.04em] text-[#0F3A33] md:text-6xl xl:text-[76px]">
                Tu viaje,
                <br />
                editado con <em style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic", fontWeight: 600 }}>claridad</em>.
              </h1>
              <p className="mt-6 max-w-2xl text-[18px] leading-8 text-[#0F3A33]/72">
                Mantuve el resultado más editorial, pero recuperé lo importante del producto: imagen, ajustes del viaje, checklist, presupuesto y qué llevar.
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                <Pill><CalendarDays className="mr-2 h-3.5 w-3.5" /> 17–20 Abr</Pill>
                <Pill><MapPin className="mr-2 h-3.5 w-3.5" /> Puerto Vallarta</Pill>
                <Pill><Plane className="mr-2 h-3.5 w-3.5" /> {preferences.travelers}</Pill>
                <Pill><Sparkles className="mr-2 h-3.5 w-3.5" /> {preferences.interests}</Pill>
              </div>

              <div className="mt-7 flex items-center gap-3 border-t border-[#E4DDD6] pt-5">
                <button
                  type="button"
                  onClick={() => setPreferencesOpen((v) => !v)}
                  className="inline-flex items-center gap-2 rounded-full border border-[#0F3A33] bg-white px-4 py-2 text-sm font-semibold text-[#0F3A33]"
                >
                  <SlidersHorizontal className="h-4 w-4" /> Ajustar viaje
                  {preferencesOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                <span className="text-sm text-[#0F3A33]/58">Edita preferencias sin salir del resultado.</span>
              </div>
            </div>

            <div className="pt-2 lg:justify-self-end">
              <div className="overflow-hidden rounded-[28px] border border-[#D9D3CC] bg-white shadow-[0_1px_0_rgba(15,58,51,0.03)]">
                <div className="relative h-[250px] w-full bg-[linear-gradient(160deg,#1e4e44_0%,#2e6b5d_35%,#8fb7ad_72%,#dfe8e1_100%)] lg:w-[360px] xl:w-[400px]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(255,255,255,0.18),transparent_28%),linear-gradient(to_top,rgba(15,58,51,0.38),rgba(15,58,51,0.02)_55%)]" />
                  <div className="absolute right-5 top-5 rounded-full bg-white/14 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                    Jalisco, México
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/70">Visual del destino</div>
                    <div className="mt-2 text-[34px] font-semibold italic leading-none text-white" style={{ fontFamily: "Fraunces, Georgia, serif" }}>
                      Puerto Vallarta
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#D9D3CC] border-b border-[#D9D3CC] bg-white">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="mb-4 flex items-center justify-end gap-3">
            <button className="rounded-full border border-[#D9D3CC] bg-white px-5 py-2.5 text-sm font-semibold text-[#0F3A33]/75 transition hover:border-[#6B8F86] hover:text-[#0F3A33]">
              <Bookmark className="mr-2 inline h-4 w-4" /> Guardar
            </button>
            <button className="rounded-full border border-[#D9D3CC] bg-white px-5 py-2.5 text-sm font-semibold text-[#0F3A33]/75 transition hover:border-[#6B8F86] hover:text-[#0F3A33]">
              <Share2 className="mr-2 inline h-4 w-4" /> Compartir
            </button>
            <button className="rounded-full bg-[#0F3A33] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#17463e]">
              <Download className="mr-2 inline h-4 w-4" /> PDF
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6B8F86]">Tu viaje</span>
            <Pill>{preferences.travelers}</Pill>
            <Pill>{preferences.style}</Pill>
            <Pill>{preferences.budget}</Pill>
            <Pill>{preferences.origin}</Pill>
            <Pill>{preferences.interests}</Pill>
          </div>

          {preferencesOpen ? (
            <div className="mt-5 rounded-[24px] border border-[#D9D3CC] bg-[#FFF9F3] p-5">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                <label className="grid gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#6B8F86]">Viajeros</span>
                  <input
                    value={preferences.travelers}
                    onChange={(e) => setPreferences((p) => ({ ...p, travelers: e.target.value }))}
                    className="rounded-2xl border border-[#D9D3CC] bg-white px-4 py-3 text-sm outline-none"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#6B8F86]">Estilo</span>
                  <input
                    value={preferences.style}
                    onChange={(e) => setPreferences((p) => ({ ...p, style: e.target.value }))}
                    className="rounded-2xl border border-[#D9D3CC] bg-white px-4 py-3 text-sm outline-none"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#6B8F86]">Presupuesto</span>
                  <input
                    value={preferences.budget}
                    onChange={(e) => setPreferences((p) => ({ ...p, budget: e.target.value }))}
                    className="rounded-2xl border border-[#D9D3CC] bg-white px-4 py-3 text-sm outline-none"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#6B8F86]">Origen</span>
                  <input
                    value={preferences.origin}
                    onChange={(e) => setPreferences((p) => ({ ...p, origin: e.target.value }))}
                    className="rounded-2xl border border-[#D9D3CC] bg-white px-4 py-3 text-sm outline-none"
                  />
                </label>
                <label className="grid gap-2 md:col-span-2 xl:col-span-1">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#6B8F86]">Intereses</span>
                  <input
                    value={preferences.interests}
                    onChange={(e) => setPreferences((p) => ({ ...p, interests: e.target.value }))}
                    className="rounded-2xl border border-[#D9D3CC] bg-white px-4 py-3 text-sm outline-none"
                  />
                </label>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <main className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[1.05fr,0.95fr]">
        <div>
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6B8F86]">Itinerario</div>
              <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.02em] text-[#0F3A33]">Versión editable del viaje</h2>
            </div>
            <button className="rounded-full border border-dashed border-[#C7D7D1] bg-white px-4 py-2 text-sm font-semibold text-[#0F3A33]/75">
              <Plus className="mr-2 inline h-4 w-4" /> Añadir día
            </button>
          </div>

          <div className="space-y-5">
            {days.map((day) => (
              <DaySection
                key={day.id}
                day={day}
                expanded={!!expandedDays[day.id]}
                onToggle={() =>
                  setExpandedDays((current) => ({ ...current, [day.id]: !current[day.id] }))
                }
                onEditItem={(item) => openEdit(day.id, item)}
              />
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <section className="rounded-[28px] border border-[#D9D3CC] bg-white p-6 shadow-[0_1px_0_rgba(15,58,51,0.03)]">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6B8F86]">Centro de control</div>
            <div className="mt-4 text-[34px] font-extrabold tracking-[-0.03em] text-[#0F3A33]">
              {completion.done} / {completion.total}
            </div>
            <p className="mt-2 text-sm leading-6 text-[#0F3A33]/68">
              Mantengo el resumen arriba, pero ahora el estado y el presupuesto vuelven a sentirse útiles, no decorativos.
            </p>
            <div className="mt-5 h-2 rounded-full bg-[#EEF3F0]">
              <div
                className="h-2 rounded-full bg-[#0F3A33]"
                style={{ width: `${(completion.done / Math.max(1, completion.total)) * 100}%` }}
              />
            </div>
          </section>

          <section className="rounded-[28px] border border-[#D9D3CC] bg-white p-6 shadow-[0_1px_0_rgba(15,58,51,0.03)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6B8F86]">Estado del viaje</div>
                <h3 className="mt-3 text-[24px] font-extrabold tracking-[-0.02em] text-[#0F3A33]">Checklist real</h3>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {checklist.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setChecklist((current) =>
                      current.map((entry) =>
                        entry.id === item.id ? { ...entry, done: !entry.done } : entry
                      )
                    )
                  }
                  className="flex w-full items-center gap-3 rounded-2xl bg-[#FFF9F3] px-4 py-3 text-left"
                >
                  {item.done ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#2F7D46]" />
                  ) : (
                    <Circle className="h-4 w-4 shrink-0 text-[#6B8F86]" />
                  )}
                  <span className={`text-sm ${item.done ? "text-[#0F3A33]/45 line-through" : "text-[#0F3A33]/78"}`}>{item.label}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-[#D9D3CC] bg-white p-6 shadow-[0_1px_0_rgba(15,58,51,0.03)]">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6B8F86]">Presupuesto</div>
            <h3 className="mt-3 text-[24px] font-extrabold tracking-[-0.02em] text-[#0F3A33]">Visión rápida del gasto</h3>
            <div className="mt-5 space-y-3">
              {budgetRows.map(([label, amount, status]) => (
                <div key={label} className="rounded-2xl bg-[#FFF9F3] px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-[#0F3A33]/75">{label}</span>
                    <span className="text-sm font-bold text-[#0F3A33]">{amount}</span>
                  </div>
                  <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[#6B8F86]">{status}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-[#D9D3CC] bg-white px-4 py-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#6B8F86]">Total estimado</div>
              <div className="mt-2 text-[22px] font-extrabold tracking-[-0.02em] text-[#0F3A33]">$39,600 MXN</div>
            </div>
          </section>

          <section className="rounded-[28px] border border-[#D9D3CC] bg-white p-6 shadow-[0_1px_0_rgba(15,58,51,0.03)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6B8F86]">Qué llevar</div>
                <h3 className="mt-3 text-[24px] font-extrabold tracking-[-0.02em] text-[#0F3A33]">Checklist de maleta</h3>
              </div>
              <div className="rounded-full bg-[#EEF5F2] px-3 py-1 text-[11px] font-semibold text-[#0F3A33]">
                {packedCount} / {packing.length}
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {packing.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setPacking((current) =>
                      current.map((entry) =>
                        entry.id === item.id ? { ...entry, packed: !entry.packed } : entry
                      )
                    )
                  }
                  className="flex w-full items-center gap-3 rounded-2xl bg-[#FFF9F3] px-4 py-3 text-left"
                >
                  <div className={`flex h-5 w-5 items-center justify-center rounded-md border ${item.packed ? "border-[#0F3A33] bg-[#0F3A33] text-white" : "border-[#C7D7D1] bg-white text-transparent"}`}>
                    ✓
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className={`text-sm ${item.packed ? "text-[#0F3A33]/45 line-through" : "text-[#0F3A33]/78"}`}>{item.label}</div>
                  </div>
                  <span className="rounded-full border border-[#D9D3CC] bg-white px-2.5 py-1 text-[10px] font-semibold text-[#6B8F86]">
                    {item.tag}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-4 text-sm italic text-[#0F3A33]/58">
              Lista adaptada para playa, actividades y 3 noches.
            </div>
            <button className="mt-4 inline-flex items-center gap-2 rounded-full border border-dashed border-[#C7D7D1] bg-[#FFF9F3] px-4 py-2 text-sm font-semibold text-[#0F3A33]/75">
              <Luggage className="h-4 w-4" /> Añadir artículo
            </button>
          </section>
        </aside>
      </main>

      <EditDrawer
        state={editState}
        onClose={() => setEditState(null)}
        onChange={(patch) => setEditState((current) => (current ? { ...current, ...patch } : current))}
        onSave={saveEdit}
      />
    </div>
  );
}
