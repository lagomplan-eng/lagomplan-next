/**
 * tests/e2e/fixtures/page-objects.ts
 *
 * Selector encapsulation for the surfaces the funnel tests touch.
 * Keeps the tests readable and gives one place to update when copy
 * or DOM shape changes.
 *
 * Selector strategy:
 *   - Prefer existing `data-trip*` and `data-trip-hero*` attributes
 *     (already on most of the planner surface — see TripResult.tsx).
 *   - Use semantic role/label selectors for form inputs.
 *   - Fall back to text-content locators (with `getByRole('button',
 *     { name: ... })`) only when no stable hook exists. Phase 2 may
 *     need to add a few `data-testid` markers to HeroForm + the
 *     regen modal — done minimally and noted in PR description.
 */

import type { Page, Locator } from '@playwright/test'

// ── HeroForm ──────────────────────────────────────────────────────────────
//
// The marketing-page trip-generator form. Lives at the locale root
// (/es, /en) and on /planner.

export class HeroForm {
  constructor(public readonly page: Page) {}

  /** The form element itself — useful for scoping inner queries. */
  get root(): Locator {
    return this.page.locator('form').first()
  }

  /** Destination input — uses the locale's placeholder copy. */
  destination(): Locator {
    return this.root.getByPlaceholder(/destino|destination/i).first()
  }

  origin(): Locator {
    return this.root.getByPlaceholder(/origen|origin/i).first()
  }

  submit(): Locator {
    return this.root.locator('button[type="submit"]').first()
  }

  async fillDestination(value: string): Promise<void> {
    await this.destination().fill(value)
  }

  async clickSubmit(): Promise<void> {
    await this.submit().click()
  }
}

// ── TripResult ────────────────────────────────────────────────────────────
//
// The post-generation planner screen. Has stable `data-trip*` hooks
// across most of its surface.

export class TripResult {
  constructor(public readonly page: Page) {}

  /** The whole hero section. `:visible` filter avoids matching the
   *  hidden version that flashes during streaming generation. */
  get hero(): Locator {
    return this.page.locator('[data-trip="hero"]')
  }

  get title(): Locator {
    return this.page.locator('[data-trip-hero="title"]')
  }

  get eyebrow(): Locator {
    return this.page.locator('[data-trip-hero="eyebrow"]')
  }

  get subtitle(): Locator {
    return this.page.locator('[data-trip-hero="subtitle"]')
  }

  /** Pref drawer trigger. Opens the prefs-edit panel. */
  prefDrawerToggle(): Locator {
    return this.page.getByRole('button', { name: /ajustar preferencias|adjust preferences/i })
  }

  prefDrawer(): Locator {
    return this.page.locator('[data-trip="pref-drawer"]')
  }

  /** Regen confirm modal — fires after a prefs-edit that would
   *  overwrite existing edits. Modal copy is stable; we match it. */
  regenConfirmModal(): Locator {
    return this.page.getByText(/vas a perder tus cambios|you.{1,2}ll lose your changes/i)
  }

  /** Itinerary day cards. */
  dayCards(): Locator {
    return this.page.locator('[data-trip-day="card"]')
  }

  dayCardByIndex(n: number): Locator {
    return this.dayCards().nth(n)
  }
}
