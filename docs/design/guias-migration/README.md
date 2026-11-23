# /guias and the guide pages on the home-based foundation

- `before/` and `after/`: /es/guias, /es/guias/roma and /es/guias/nueva-york at 1440 and 390 (main vs this branch, first 4200 px).
- `pdf/`: the guide PDF page by page, main on the left and this branch on the right, for Roma and Nueva York, plus `pixel-diff.txt` (every page of Roma, Nueva York, Cancún and the English Roma and Nueva York: 0 pixels different).
- `index.html` shows everything on one page.

How the PDF was compared: `page.pdf({ format: 'A4', printBackground: true })` on the same dev setup for main and for the branch (main also matches the production PDF, 0 pixels), pages rasterised at 1.5x with CoreGraphics and diffed pixel by pixel.

The PDF look is frozen in `app/globals.css` (block "FROZEN PDF LOOK", inside the existing `@media print`). Do not edit it without re-rendering the PDFs.
