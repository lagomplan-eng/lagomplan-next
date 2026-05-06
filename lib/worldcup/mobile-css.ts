/**
 * Shared mobile responsive CSS for the World Cup guide pages.
 *
 * The 16 city guide components and the index page (WorldcupClient) are
 * written with all-inline styles — no Tailwind, no media queries. This
 * stylesheet uses CSS attribute selectors against the React-rendered
 * inline `style` strings to override layout-defining declarations
 * (grid columns, sticky positioning, side gutters) below 768px without
 * having to refactor every component.
 *
 * IMPORTANT — colon spacing
 * Next.js / React's SSR output writes inline styles compactly (no space
 * after the colon, e.g. `max-width:1020px`). After client hydration, the
 * browser re-serializes the same attribute with a space (`max-width: 1020px`).
 * Each selector below lists BOTH forms so the rule matches before AND
 * after hydration — otherwise mobile users would see a flash of the
 * desktop layout when React hydrates.
 */

export const MOBILE_CSS = `
  @media (max-width: 768px) {

    /* ── Index page (/worldcup) ─────────────────────────────────────── */

    /* Header & cards container — tighter side padding */
    [style*="max-width:1020px"],
    [style*="max-width: 1020px"] {
      padding-left: 16px !important;
      padding-right: 16px !important;
    }

    /* City card row → vertical stack (editorial above matches) */
    [style*="1fr 204px"] {
      grid-template-columns: 1fr !important;
    }

    /* Hide the oversized ghost city-abbreviation behind the matches panel */
    [style*="right:218px"],
    [style*="right: 218px"] {
      display: none !important;
    }

    /* The matches panel border flips from left → top when stacked. */
    [style*="border-left:1px solid #D9D2C9"],
    [style*="border-left: 1px solid rgb(217, 210, 201)"] {
      border-left: none !important;
      border-top: 1px solid rgb(217, 210, 201) !important;
    }


    /* ── City guide pages (/worldcup/[slug]) ────────────────────────── */

    /* Page-pad container — tighter side padding */
    [style*="max-width:1140px"],
    [style*="max-width: 1140px"] {
      padding-left: 16px !important;
      padding-right: 16px !important;
    }

    /* Hero: text + image side-by-side → stack */
    [style*="1fr 280px"] {
      grid-template-columns: 1fr !important;
      gap: 24px !important;
      padding: 28px 0 24px !important;
      margin-bottom: 24px !important;
      align-items: stretch !important;
    }

    /* Hero image — slightly shorter on mobile */
    [style*="height:210px"],
    [style*="height: 210px"] {
      height: 200px !important;
    }

    /* Main content + right sidebar → stack */
    [style*="1fr 316px"] {
      grid-template-columns: 1fr !important;
      gap: 32px !important;
    }

    /* Sidebar — unstick so it falls below the main content */
    [style*="position:sticky"][style*="top:64px"],
    [style*="position: sticky"][style*="top: 64px"] {
      position: static !important;
      top: auto !important;
      align-self: auto !important;
      padding-bottom: 0 !important;
    }

    /* Sticky nav (top:0 sticky element) — tighter padding.
       React serializes the unitless 0 as "top:0" before hydration and
       the browser re-serializes it as "top: 0px" after. */
    [style*="position:sticky"][style*="top:0;"],
    [style*="position: sticky"][style*="top: 0px"] {
      padding-left: 14px !important;
      padding-right: 14px !important;
    }

    /* Hide the "← Guías" back-button (and its right-divider) inside the
       sticky nav on mobile. The global site nav already exposes a
       "Mundial" link, and removing this clears ~120px so the section
       chips have room to breathe. */
    [style*="position:sticky"][style*="top:0;"] > button:first-of-type,
    [style*="position: sticky"][style*="top: 0px"] > button:first-of-type {
      display: none !important;
    }

    /* Vibe cards 2-col → 1-col */
    [style*="1fr 1fr"] {
      grid-template-columns: 1fr !important;
    }

    /* Auto-fill subgrids (matches/stays/food) — collapse to single column.
       Without this, minmax(280px, 1fr) can push min-content of the parent
       grid item past the viewport, causing horizontal scroll on phones. */
    [style*="minmax(280px"],
    [style*="minmax(256px"] {
      grid-template-columns: 1fr !important;
    }

    /* Let grid/flex children shrink below their intrinsic min-content
       (long unbreakable strings — stadium names, URLs — would otherwise
       force the parent track to grow past the viewport). */
    [style*="1fr 316px"] > *,
    [style*="1fr 280px"] > *,
    [style*="1fr 1fr"] > *,
    main > div > div {
      min-width: 0 !important;
    }

    /* Defensive: never allow horizontal scroll on mobile body. */
    html, body {
      overflow-x: hidden !important;
    }

    /* Make long unbreakable words wrap inside text content */
    p, h1, h2, h3, span {
      overflow-wrap: anywhere;
    }

    /* Section alt-bg blocks — drop the −4px side bleed */
    [style*="margin-left:-4px"],
    [style*="margin-left: -4px"] {
      margin-left: 0 !important;
      margin-right: 0 !important;
      padding-left: 18px !important;
      padding-right: 18px !important;
      padding-top: 26px !important;
      padding-bottom: 22px !important;
    }

    /* Section spacing — tighten vertical rhythm */
    section[style*="margin-bottom:64px"],
    section[style*="margin-bottom: 64px"] {
      margin-bottom: 40px !important;
    }


    /* ── Typography scale-down ──────────────────────────────────────── */

    /* GuideHero h1 — clamp(44px, 5.5vw, 72px) */
    h1[style*="font-size:clamp(44px"],
    h1[style*="font-size: clamp(44px"] {
      font-size: clamp(28px, 9vw, 38px) !important;
      line-height: 1 !important;
    }

    /* SectionHeader h2 — fontSize 27 → 22 */
    h2[style*="font-size:27px"],
    h2[style*="font-size: 27px"] {
      font-size: 22px !important;
    }

    /* Index-page giant h1 — clamp(38px, 5.5vw, 60px) */
    h1[style*="font-size:clamp(38px"],
    h1[style*="font-size: clamp(38px"] {
      font-size: clamp(28px, 8vw, 36px) !important;
      line-height: 1.05 !important;
    }
  }
`
