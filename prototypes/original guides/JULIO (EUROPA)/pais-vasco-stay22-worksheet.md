# País Vasco — Stay22 / GetYourGuide link worksheet

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
| 1 | ~~Hotel Arbaso~~ | http://booking.com/hotel/es/arbaso.html | **RESUELTO** — link directo publicado | — |
| 2 | ~~Lasala Plaza Hotel~~ | http://booking.com/hotel/es/plaza-lasala.html | **RESUELTO** — link directo publicado | — |
| 3 | ~~Hotel de Londres y de Inglaterra~~ | https://www.booking.com/hotel/es/londresinglaterra.html | **RESUELTO** — link directo publicado | — |
| 4 | ~~Private Pintxos Tour in Parte Vieja~~ | https://www.getyourguide.com/en-gb/san-sebastian-l94/san-sebastian-food-tour-pintxo-tasting-wines-t110908/ | **RESUELTO (sin confirmar monetización)** — link directo publicado | — |
| 5 | ~~Txakoli Winery Tour in Getaria~~ | https://www.getyourguide.com/en-gb/san-sebastian-l94/discover-the-essence-of-txakoli-wine-from-san-sebastian-t110959/ | **RESUELTO (sin confirmar monetización)** — link directo publicado | — |
| 6 | ~~San Sebastián Market Tour + Cooking Experience~~ | https://www.getyourguide.com/en-gb/san-sebastian-l94/san-sebastian-market-tour-and-basque-cooking-class-english-t980847/ | **RESUELTO (sin confirmar monetización)** — link directo publicado | — |
