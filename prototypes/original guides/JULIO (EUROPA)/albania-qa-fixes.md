# QA fixes — Albania

**Estado: FAIL — no se publica en esta pasada.**

## Qué falta

La sección "4. Itinerario: 14 días de aventura equilibrada" está escrita como bloques
narrativos por rango de días ("Días 1–2 · Tirana", "Días 3–4 · Berat", ... "Días 13–14 ·
Últimos días en Sarandë") sin una sola línea con hora (`HH:MM: actividad`). Todas las
demás guías del lote (Azores, Copenhague, País Vasco) sí traen, debajo del párrafo
narrativo de cada día, una lista de bullets con hora exacta — por ejemplo (Azores, Día 1):

```
Día 1 · Llegada y primer chapuzón
Check-in en SENSI. La primera tarde es para no hacer nada...

14:00: Check-in y apertura de villa
16:00: Primera piscina privada
19:30: Cena en el restaurante del hotel con txakoli azoriano
21:00: Fuego de terraza y noche sin agenda
```

Albania no tiene el equivalente. El pipeline de publicación (regla de hierro:
cero alucinación) no inventa horarios — así que esta guía queda pendiente hasta que la
redactora agregue los bullets de hora.

## Qué se necesita de la redactora

Para cada uno de los 7 bloques de días (Días 1–2, 3–4, 5–6, 7–8, 9–10, 11–12, 13–14),
agregar debajo del párrafo narrativo una lista de actividades con hora, una por cada día
individual (es decir, "Días 1–2" necesita horarios separados para el Día 1 Y el Día 2,
no un bloque combinado) — mismo formato que Azores/Copenhague/País Vasco:

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
donde Elena indique) y pide de nuevo "publica la guía de Albania" — el resto del pipeline
(extracción, traducción, registro, worksheet de Stay22, checklist) no cambia.
