# Design tokens

One source: the `:root` block of `app/globals.css`. `tailwind.config.js` only maps names to those variables and defines no value of its own. Live specimen of every token and component: **`/dev/design`** (noindex, not linked). Components: `components/design/`. Input: the look-and-feel audit (`docs/design/look-and-feel-audit-2026-11-18.html`, in PR #150).

Colours are stored as RGB channels (`--pine-rgb: 15 58 51`) with a ready colour next to them (`--pine: rgb(var(--pine-rgb))`), so `text-pine/70` works in Tailwind and `var(--pine)` works in plain CSS.

## Decisions (final)

| Area | Decision | Token / component |
|---|---|---|
| Buttons | Pill, Manrope 14–15/700, 48px (small 40px); primary / secondary / ghost | `Button`, `--control-h`, `--control-h-sm`, `--pine-hover` |
| Page title | The /guias H1: clamp(44px, 7vw, 72px), 800, −0.04em, line-height .92, pine | `PageTitle`, `--fs-title` `--lh-title` `--ls-title` `--fw-title` |
| H2 / H3 / eyebrow | /guias: H2 36/800/−0.02em/1.05; H3 24/800/−0.02em/1.12; eyebrow 11/500/0.12em caps, in `sage-text` (/guias uses #6B8F86, 3.4:1; the eyebrow here is the darker #5A7871, 4.6:1, same hue) | `SectionTitle`, `CardTitle`, `Eyebrow`, `--sage-text` |
| Cards | Destination card (illustration on top, r24) for guides, experiences, hotels; Info card (r16) for everything else | `DestinationCard`, `InfoCard`, `--radius-destination`, `--radius-info` |
| Filters | One pattern: inline chips on desktop; on mobile a "Filtros (n)" button opening a bottom sheet with live "Ver N resultados" and "Limpiar" | `FilterPanel`, `BottomSheet`, `Chip` |

Text contrast: every text colour in the tokens is at least 4.5:1 on cream and on white (`tests/design-tokens.test.ts` checks it).

Not decided by the brief, so chosen here (change freely): text inputs are 48px pills (same family as buttons and search), the search field is the /guias 56px pill, and the card shadow is the /guias shadow (`0 2px 8px rgb(0 0 0 / .04)`).

## Token groups

- **Brand:** `pine` `sage` (decorative only, 3.4:1 on cream) `sage-text` (#5A7871, sage for text: 4.61:1 on cream, 4.82:1 on white) `sand` `cream` `coral` `fjord` `mint` `white`. **Functional:** `success` `warning` `error`.
- **Text neutrals:** `ink-2` (body), `ink-3` (green tertiary), `label` (small labels), plus pine and sage. Alpha tints used on /guias: `--text-lede` (pine 72%), `--text-soft` (pine 68%).
- **Lines:** `line-soft` #E4DFD8 (info card, hairlines), `line-strong` #C8BFB5 (destination card, search), and the pine-alpha lines `line-card` `line-panel` `line-chip` `line-btn`.
- **Radii:** `pill` 999, `destination` 24, `info` 16, `sheet` 24. Legacy, until the catalog pages migrate: `--radius-card` 20, `--radius-panel` 24.
- **Shadows:** `soft`, `pop`, `sheet`. **Spacing:** `--space-1…20` (4px base), `--section-y`, `--page-gutter`. **Controls:** `--control-h` 48, `--control-h-sm` 40, `--control-h-lg` 56, `--chip-h` 44.
- **Type:** `--fs-*` / `--lh-*` / `--ls-*` / `--fw-*` for title, h2, h3, eyebrow, lede, body, small, tiny, button. In Tailwind: `text-title`, `text-h2`, `text-h3`, `text-eyebrow`, `text-lede`, `text-body`, `text-small`, `text-tiny`, `text-button`.

## What was removed

| Removed | Why |
|---|---|
| `--forest`, `--ink`, `--card` | Same value as `--pine` / `--pine` / `--cream`, 0 references |
| `--accent` (global) | Same value as `--coral`; the guest guide sets its own `--accent` per partner inline, unaffected |
| `--border` → `--line-strong` | Renamed; 29 references updated, same value #C8BFB5 |
| `--muted` → `--ink-3` | Renamed; 1 reference updated, same value #3D6B5C |
| `--text-xs … --text-3xl` | 0 references; replaced by the `--fs-*` scale |
| Brand hex in `tailwind.config.js` | Colours now read the `:root` channels, so there is one definition |
| Hardcoded `#E4DFD8` (134 uses) | Now `border-line-soft` / `bg-line-soft` / `var(--line-soft)`; same value, no visual change |

## Legacy values → token (migration map)

Not applied yet, because snapping them changes how existing pages look. Apply page by page when each page moves onto the components.

| Legacy value (where) | Becomes | Visible change |
|---|---|---|
| Body text: home #3E5F58, hub #3E5650, planner #2D6B57, guides #4A4A4A (weight 300), familias #7A7773, /guias pine@72%, landings pine@80% | `text-ink-2` (body), `--text-lede` (lede) | Small shifts of green/grey; guides lose the weight-300 grey look |
| `#7A7A76`, `#8A8A8A`, `#B8B5AF` (guide meta, placeholders) | `text-label` or `text-ink-2` | Greys become the green-tinted label colour |
| `#D8CFC1`, `#CEC8C0`, `#E2DDD5` (borders) | `line-soft` (hairline) or `line-strong` (card/search) | One-shade border changes |
| `#1F3D37` (near-pine) | `pine` | Barely visible |
| `#C8D9D3` (old sage, home form borders) | `line-chip` | Input borders get the shared line |
| `#F4F0E8`, `#FDFCF9` (old sand/card) | `sand` / `white` | Slightly warmer/whiter |
| Cards r30 (/guias), r20 (hub, hotels), r16 (guides, guest, landings) | `DestinationCard` r24 / `InfoCard` r16 | /guias and hub/hotels cards change radius |
| 8px / mono-caps buttons (home, guide pages, login), pill buttons elsewhere | `Button` | Home, guides, planner, login get pill buttons |
| Chips 24–50px | `Chip` 44px | Home interest chips grow |
| Mobile filters: /guias "+ Más", hub and hotels sideways rows | `FilterPanel` (sheet) | New mobile pattern |

## Not migrated in this change

No existing page was changed. `components/catalog/*` (hub, hotels) and `components/guides/GuidesClient.tsx` keep their own markup until each is moved onto `components/design`.
