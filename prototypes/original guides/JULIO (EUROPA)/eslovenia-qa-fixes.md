# QA fixes — Eslovenia

**Estado: FAIL — no se publica en esta pasada.**

## Qué falta

La sección "4. Itinerario: 10 días en ruta" está escrita como bloques narrativos por
rango/día ("Días 1–2 · Ljubljana", "Días 3–4 · Lake Bled", "Día 5 · Lake Bohinj + Savica
Waterfall", "Días 6–7 · Valle del Soča + Bovec", "Días 8–9 · Piran + Costa del
Adriático", "Día 10 · Regreso a Ljubljana") sin una sola línea con hora
(`HH:MM: actividad`). Las demás guías del lote (Azores, Copenhague, País Vasco) sí traen,
debajo del párrafo narrativo de cada día, una lista de bullets con hora exacta — por
ejemplo (País Vasco, Día 1):

```
Día 1 · Llegada y primera ronda de pintxos
Check-in. Tarde libre para orientarse...

14:00: Check-in
16:00: Paseo por La Concha y Monte Urgull
19:30: Primera ronda de pintxos en Parte Vieja
22:00: Cena formal opcional (reserva previa en Arzak o Mugaritz si el presupuesto lo permite)
```

Eslovenia no tiene el equivalente. El pipeline de publicación (regla de hierro: cero
alucinación) no inventa horarios — así que esta guía queda pendiente hasta que la
redactora agregue los bullets de hora.

## Qué se necesita de la redactora

Para cada uno de los 6 bloques (Días 1–2, 3–4, Día 5, Días 6–7, 8–9, Día 10), agregar
debajo del párrafo narrativo una lista de actividades con hora, una por cada día
individual (los bloques de 2 días necesitan horarios separados para cada día, no un
bloque combinado) — mismo formato que Azores/Copenhague/País Vasco:

```
HH:MM: Actividad
HH:MM: Actividad
...
```

El resto de la guía (kicker, 3 hoteles/hostales con link/zona/tier/mood/precio, 3
experiencias con link, 3 bloques de "Cómo llegar", 3 Lagom Tips + Dato curioso) ya pasa
el QA gate sin cambios.

## Una vez corregido

Vuelve a dejar el .docx actualizado en `prototypes/original guides/JULIO (EUROPA)/` (o
donde Elena indique) y pide de nuevo "publica la guía de Eslovenia" — el resto del
pipeline (extracción, traducción, registro, worksheet de Stay22, checklist) no cambia.
