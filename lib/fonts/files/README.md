# Self-hosted font files

Used by `lib/fonts/index.ts` (next/font/local). 14 woff2 files, one per family / style / unicode-range
subset (variable fonts; the same file serves every weight of a family):

| Font | Used weights | Files |
|---|---|---|
| Manrope | 400 500 700, normal | `manrope-{cyrillic-ext,cyrillic,greek,vietnamese,latin-ext,latin}.woff2` |
| Fraunces | 500 600, normal and italic | `fraunces-{vietnamese,latin-ext,latin}.woff2` and `fraunces-{vietnamese,latin-ext,latin}-italic.woff2` |
| DM Mono | 400, normal | `dm-mono-{latin-ext,latin}.woff2` |

## Provenance
These are the exact files Next's `next/font/google` downloaded from Google Fonts at build time and
production served: byte-identical (sha256) to Google's response to the request Next sends
(`https://fonts.googleapis.com/css2?family=...` with Next's Chrome/Mac user agent), checked for all 14.
Google serves different binaries per platform user agent, so re-downloading with a different agent
gives different (visually equivalent) files. To refresh a font, use the same request.

## Licenses
Manrope, Fraunces and DM Mono are licensed under the SIL Open Font License 1.1, which allows
bundling and redistribution: see `../OFL-Manrope.txt`, `../OFL-Fraunces.txt`, `../OFL-DM-Mono.txt`.

## Adding or changing a weight
The weights are declared in `lib/fonts/index.ts`. The files already contain the full weight range of the
variable font, but only the weights listed there are exposed as `@font-face`; add a `src` entry
per extra weight in every subset call of that family.
