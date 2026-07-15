# Islas Feroe — Stay22 link worksheet

Hoteles se monetizan vía el script LetMeAllez de Stay22 del sitio (Booking.com/Hotels.com/Expedia,
`app/[locale]/layout.tsx`). Experiencias van con link crudo de GetYourGuide; **la cobertura de
LetMeAllez para GetYourGuide NO está confirmada en el código** (mismo caveat que en Azores/País
Vasco/Copenhague — nunca se menciona junto a Booking/Hotels.com/Expedia en los comentarios de
`layout.tsx` ni de `Stay22Guard.tsx`). Se publican los links limpios de todos modos, aceptando que
podrían no monetizarse hasta que existan shortlinks reales de `getyourguide.stay22.com`.

**⚠️ DOS problemas de link reales encontrados en el .docx de origen — no son solo naming, son
productos equivocados. Publicados tal cual aparecen en la fuente por la misma política del
precedente "Coco Hotel" (Copenhague): se publica el link real del documento, no una corrección
inventada. Ambos necesitan resolución de Elena antes de confiar en ellos como definitivos.**

| # | Ítem | URL publicado (limpio) | Nota |
|---|---|---|---|
| 1 | Hotel Føroyar | https://www.booking.com/hotel/fo/foroyar-torshavn.html | Link limpio, sin query string. Booking.com directo. |
| 2 | Havgrim Seaside Hotel 1948 | https://www.booking.com/hotel/fo/havgrim-seaside-hotel-1948.html | Link limpio, sin query string. Booking.com directo. |
| 3 | Hotel Brandan | http://booking.com/hotel/fo/brandan.html | Query string de tracking (`label=...&aid=304142...`) eliminada. Se conserva `http://` (sin `s`) tal como aparece en la fuente — mismo patrón que "Octant Furnas" en Azores. |
| 4 | Islas Feroe: Full Day Highlights Tour | https://www.getyourguide.com/en-gb/gjogv-l137328/faroe-islands-private-highlights-tour-t938909/ | Query string de tracking eliminada. El producto coincide con el texto (Saksun, Sørvágsvatn, Trælanípa). |
| 5 | Puffin Watching & Mykines Island Day Trip | https://www.getyourguide.com/en-gb/reykjavik-l30/reykjavik-puffin-watching-boat-tour-t22613/ | ⚠️ **MISMATCH GRAVE.** El texto describe Mykines (Islas Feroe), pero el link apunta a un tour de avistamiento de frailecillos en **Reykjavik, Islandia** — país y producto distintos. Esto es un error real del documento fuente, no solo un naming diferente. Publicado tal cual por la política del precedente "Coco Hotel", pero un lector de esta guía de Feroe podría terminar reservando un tour en Islandia por error. Requiere que Elena confirme el link correcto de GetYourGuide para el tour a Mykines antes de publicar en producción. |
| 6 | Gasadalur Village & Múlafossur Waterfall Tour | https://www.getyourguide.com/en-gb/sorvagur-l190518/exclusive-15-hour-drangarnir-boat-tour-t468221/ | ⚠️ **MISMATCH.** El texto describe la visita al pueblo de Gásadalur y la cascada Múlafossur (a pie, con mirador), pero el link apunta a un tour en barco de 1.5 horas a **Drangarnir** — otra atracción feroesa (agujas de roca vistas desde el mar), producto distinto. Publicado tal cual por la misma política, pero necesita revisión de Elena para confirmar el link correcto del tour a Gásadalur/Múlafossur antes de publicar en producción. |
