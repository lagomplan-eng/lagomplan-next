# Albania — Stay22 / GetYourGuide link worksheet

Per Elena's standing decision from the prior guide-conversion session: hotel and experience links are published as **live, clean direct links** (not `#` placeholders). Hotels are monetized site-wide via the site's Booking.com/Hotels.com/Expedia LetMeAllez script (any booking.com link on the page is automatically intercepted and rewritten with our affiliate params at render time — see `project_stay22-letmeallez-intercept.md`), so the `.ts` files publish the **clean, stripped** booking.com URL (all `?...` tracking/query params removed) rather than the raw tracking URL captured from the docx hyperlink. Experience links point to the raw GetYourGuide URL (query string stripped) — GetYourGuide affiliate-program coverage is unconfirmed for this account, same caveat noted on previous guides. Real Stay22 shortlinks for both categories are a future upgrade, not a blocker for shipping this guide.

| # | Ítem | URL publicado (limpio) | Nota |
|---|---|---|---|
| 1 | GrandView Hotel (Berat) | https://www.booking.com/hotel/al/grandview.es.html | OK |
| 2 | Bougainville Bay Hotel (Sarandë) | https://www.booking.com/hotel/al/bougainville-bay-sarande.en-gb.html | OK |
| 3 | Hotel Apollon Sarande (Sarandë) | https://www.booking.com/hotel/al/hoteli-apollon.en-gb.html | OK |
| 4 | Day Tour: Gjirokastra + Blue Eye | https://www.getyourguide.com/sarande-l122815/gjirokastra-la-ciudad-de-piedra-y-ojo-azul-el-monumento-de-la-naturaleza-t634221/ | OK |
| 5 | Day Tour: Butrint y las Islas Ksamil | https://www.getyourguide.com/ksamil-l120680/ksamil-excursion-en-barco-a-las-5-islas-de-ksamil-y-las-islas-gemelas-t992657/ | OK |
| 6 | Cañón de Osumi + Termas de Benja | https://www.getyourguide.com/tirana-l2468/desde-tirana-tour-a-la-cascada-de-peshtura-y-a-los-banos-termales-de-benja-t1320735/ | OK — GYG listing departs from Tirana (tour operator location), the doc's copy says the excursion runs "desde Sarandë o Berat"; the listing content/operator matched the docx hyperlink so published as-is, flagging for Elena to spot-check departure city on the live GYG page before it ships |

6/6 rows, all straightforward 1:1 matches between the docx hyperlink target and the item it's attached to.
