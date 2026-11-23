# Design tokens

One source: the `:root` block of `app/globals.css`. `tailwind.config.js` only maps names to those variables and defines no value of its own. Live specimen of every token and component: **`/dev/design`** (noindex, not linked). Components: `components/design/`. Input: the look-and-feel audit (`docs/design/look-and-feel-audit-2026-11-18.html`) and the home measurements (`docs/design/home-canon.md`).

Colours are stored as RGB channels (`--pine-rgb: 15 58 51`) with a ready colour next to them (`--pine: rgb(var(--pine-rgb))`), so `text-pine/70` works in Tailwind and `var(--pine)` works in plain CSS.

## Decisions (final): the canon is the HOME page

Everything below equals what www.lagomplan.com/es renders today (measured values: `docs/design/home-canon.md`; `e2e/design-system.spec.ts` re-checks them against home's real markup and the live page). Where home has no example, the component is derived from home's colours, radii and type, and listed as derived in that file and on `/dev/design`.

| Area | Value (home) | Token / component |
|---|---|---|
| Buttons | 8px radius (not pills), Manrope 13px, tracking .03em, padding 12/24; solid 600 pine fill, hover #1A4A42 + 1px lift; outline 500 with a 1.5px pine border, mint hover | `Button`, `--radius-btn`, `--btn-solid-hover` |
| Page title | 60px / 700 / −1.5px / 1.05, pine (40px on mobile) | `PageTitle`, `--fs-title` |
| Section title | 40px / 700 / 1.15 (30px on mobile); closing title 50px (34px) | `SectionTitle`, `--fs-h2`, `--fs-h2-xl` |
| Card title, names, feature titles | 22/400/−0.02em; 18/600; 15/600 | `CardTitle`, `--fs-h3`, `--fs-h4`, `--fs-h5` |
| Eyebrow | 11px / 500 / 0.12em, uppercase, sage-text #5A7871 (home's sage #6B8F86, darkened to AA) | `Eyebrow`, `--fs-eyebrow` |
| Body | 15px / 1.8, ink-body #3E5F58 (lede 15px / 1.7); card excerpt #35584F | `Body`, `Lede`, `--ink-body`, `--ink-card` |
| Cards | Guide card: radius 22, no border, shadow-sm, image 4:3, body padding 24. Review card: radius 12, hairline border, cream, padding 36. Planner card: radius 12, #E5E5E5 border, shadow 0 4px 24px pine/6% | `DestinationCard`, `InfoCard` (tone cream / white) |
| Chips | White, 1px sage/22% border, sage-text text, full radius; selected = mint fill, pine text. 10px / 24px high | `Chip size="sm"` |
| Fields | Place / date: 13px, radius 2, #C8D9D3. Budget / textarea: radius 8, sage/22% border | `Input`, `Input variant="soft"`, `Textarea` |
| Sections | 96px top and bottom (64 on mobile), cream / white alternating, hairline between, page 1280 with 24px gutter | `--section-y`, `--page-gutter` |

Derived (home has no example): filter chip size (`Chip` md), `Tag`, `SearchInput`, `FilterPanel`, `BottomSheet`, button `sm` / `ghost` / `inverse`, `Input variant="onDark"`, `InfoCard` mint / pine / sm / flush, `DestinationCard` eyebrow / badge / tags / cta / featured.

Accessibility: home's sage text (#6B8F86) is 3.4:1 on cream and 3.6:1 on white, below WCAG AA 4.5:1. Decided: components use `--sage-text` (#5A7871, same hue, 4.61:1 on cream) for every piece of sage text; `--sage` is for icons, dots and rules only.

Not decided by home, so chosen: the two input styles both exist (see home-canon.md), the newsletter button / field use radius 8 (home's are square), and the 12-step spacing scale is a 4px base.

## Token groups

- **Brand:** `pine` `sage` `sage-text` (all sage text) `sand` `cream` `coral` `fjord` `mint` `white`. **Functional:** `success` `warning` `error`, plus home's `field-error` #B94030.
- **Text:** `ink-body` #3E5F58, `ink-card` #35584F, `ink-input` #0F1A16, `placeholder` #BDBDBD; older pages keep `ink-2`, `ink-3`, `label`.
- **Lines:** home's `line-section`, `line-hair`, `line-field`, `line-sage`, `line-form`, `line-divider`; older pages keep `line-soft`, `line-strong` and the pine-alpha `line-card` / `line-panel` / `line-chip` / `line-btn`.
- **Radii:** `btn` 8, `info` 12, `destination` 22, `field` 2, `sheet` 22 (derived), `pill` 9999; legacy `card` 20 / `panel` 24 stay for the catalog.
- **Shadows:** `soft` (guide card), `lift` (its hover), `form` (planner card); derived `pop`, `sheet`.
- **Type:** `--fs-*` / `--lh-*` / `--ls-*` / `--fw-*`; mobile step at 768px in a `:root` media query.
- **Controls:** `--control-h` 46 (button), `--field-h` 38, `--chip-h` 44, `--chip-h-sm` 24.

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
| Body text: home #3E5F58, hub #3E5650, planner #2D6B57, guides #4A4A4A (weight 300), familias #7A7773, /guias pine@72%, landings pine@80% | `text-ink-body` (#3E5F58: body and lede) | Small shifts of green/grey; guides lose the weight-300 grey look |
| `#7A7A76`, `#8A8A8A`, `#B8B5AF` (guide meta, placeholders) | `text-label` or `text-ink-body` | Greys become the green-tinted label colour |
| `#D8CFC1`, `#CEC8C0`, `#E2DDD5` (borders) | `line-soft` (hairline) or `line-strong` (card/search) | One-shade border changes |
| `#1F3D37` (near-pine) | `pine` | Barely visible |
| `#C8D9D3` (old sage, home form borders) | `line-chip` | Input borders get the shared line |
| `#F4F0E8`, `#FDFCF9` (old sand/card) | `sand` / `white` | Slightly warmer/whiter |
| Cards r30 (/guias), r20 (hub, hotels), r16 (guides, guest, landings) | `DestinationCard` r22 / `InfoCard` r12 | /guias and hub/hotels cards change radius and lose the /guias border |
| 8px / mono-caps buttons (home, guide pages, login), pill buttons elsewhere | `Button` | Home, guides, planner, login get pill buttons |
| Chips 24–50px | `Chip` 44px | Home interest chips grow |
| Mobile filters: /guias "+ Más", hub and hotels sideways rows | `FilterPanel` (sheet) | New mobile pattern |

## Not migrated in this change

No existing page was changed (pixel-diffed: home, /guias, /experiencias, /hoteles and a guide page at 1440 and 390, plus the guide's print render). `components/catalog/*` (hub, hotels) and `components/guides/GuidesClient.tsx` keep their own markup until each is moved onto `components/design`.
