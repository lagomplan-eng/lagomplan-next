# Copenhague — Stay22 / GetYourGuide link worksheet

**Actualización 2026-07-08 (v2):** las 6 filas (3 hoteles + 3 experiencias) ya NO
requieren shortlink por ahora — se publicó el link directo y limpio en el `.ts`
(hoteles → Booking.com, experiencias → GetYourGuide). Confirmado en código: el sitio
monetiza clics salientes a Booking.com/Hotels.com/Expedia vía el script LetMeAllez de
Stay22 (`app/[locale]/layout.tsx`). **Para GetYourGuide la cobertura de LetMeAllez NO
está confirmada en el código** (nunca se le menciona junto a Booking/Hotels.com/Expedia
en los comentarios de `layout.tsx` ni de `Stay22Guard.tsx`) — publicamos el link limpio
de todos modos por decisión explícita de Elena, aceptando que los 3 clics a GetYourGuide
podrían no monetizarse hasta que se generen shortlinks reales de
`getyourguide.stay22.com`. Vale la pena confirmar empíricamente (DevTools → Network, ver
si el clic redirige por stay22.com) antes de asumir que ya está resuelto del todo.

| # | Ítem | URL destino limpio | Formato final | Shortlink |
|---|---|---|---|---|
| 1 | ~~Coco Hotel~~ ⚠️ ver nota abajo | http://booking.com/hotel/dk/copenhagen-crown.en-gb.html | **RESUELTO** — link directo publicado | — |
| 2 | ~~Cityhub Copenhagen~~ | https://www.booking.com/hotel/dk/cityhub-copenhagen.en-gb.html | **RESUELTO** — link directo publicado | — |
| 3 | ~~Hotel Ottilia~~ | http://booking.com/hotel/dk/ottilia.es.html | **RESUELTO** — link directo publicado | — |
| 4 | ~~Copenhagen Food Tour — Vesterbro & Meatpacking District~~ | https://www.getyourguide.com/copenhague-l12/copenhague-tour-gastronomico-con-mas-de-6-degustaciones-de-clasicos-daneses-t612757/ | **RESUELTO (sin confirmar monetización)** — link directo publicado | — |
| 5 | ~~Copenhagen Canal Boat Tour~~ | https://www.getyourguide.com/copenhague-l12/copenhague-tour-en-barco-por-los-canales-desde-gammel-strand-t37848/ | **RESUELTO (sin confirmar monetización)** — link directo publicado | — |
| 6 | ~~Nørrebro Street Food & Nightlife Experience~~ | https://www.getyourguide.com/en-gb/copenhagen-l12/copenhagen-s-a-taste-of-denmark-tasting-tour-t21977/ | **RESUELTO (sin confirmar monetización)** — link directo publicado | — |

⚠️ **Sin resolver — verificar antes de confiar en el link:** el hyperlink de "Coco
Hotel" en el docx apunta al slug de Booking.com `copenhagen-crown`, que no tiene
relación textual con "Coco" — puede ser un nombre anterior/de marca blanca del mismo
edificio, o el redactor pudo haber enlazado la propiedad equivocada. Publiqué el link
tal como viene en el doc (siguiendo la instrucción de usar los URLs originales), pero
antes de que alguien reserve a través de este botón, confirma manualmente que
`copenhagen-crown` en Booking.com es efectivamente el "Coco Hotel" de Vesterbro.
