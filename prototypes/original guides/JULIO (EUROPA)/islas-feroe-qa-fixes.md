# QA fixes — Islas Feroe

**Estado: FAIL — no se publica en esta pasada.**

## Qué falta

La sección "4. Itinerario: 7 días en el Atlántico Norte" trae un único párrafo narrativo
por día (Día 1 a Día 7) y ninguno tiene, debajo, la lista de bullets con hora exacta
(`HH:MM: actividad`) que sí traen las demás guías del lote (Azores, Copenhague, País
Vasco) — por ejemplo (Copenhague, Día 1):

```
Día 1 · Llegada y canal tour
Check-in. Canal Boat Tour desde Nyhavn para orientarse...

14:00: Check-in y descanso
16:00: Canal Boat Tour (1 hora)
17:30: Nyhavn y primer paseo por el puerto
19:30: Cena en Torvehallerne
```

Islas Feroe solo tiene el párrafo narrativo, sin la lista de horas. El pipeline de
publicación (regla de hierro: cero alucinación) no inventa horarios — así que esta guía
queda pendiente hasta que la redactora agregue los bullets de hora.

## Qué se necesita de la redactora

Para cada uno de los 7 días, agregar debajo del párrafo narrativo una lista de
actividades con hora — mismo formato que Azores/Copenhague/País Vasco:

```
HH:MM: Actividad
HH:MM: Actividad
...
```

El resto de la guía (kicker, 3 hoteles con link/zona/tier/mood/precio, 3 experiencias con
link, 3 bloques de "Cómo llegar", 3 Lagom Tips + Dato curioso) ya pasa el QA gate sin
cambios.

## Una vez corregido

Vuelve a dejar el .docx actualizado en `prototypes/original guides/JULIO (EUROPA)/` (o
donde Elena indique) y pide de nuevo "publica la guía de Islas Feroe" — el resto del
pipeline (extracción, traducción, registro, worksheet de Stay22, checklist) no cambia.
