/**
 * lib/newsletter-trigger.ts
 *
 * How far a visitor must scroll before the newsletter popup appears. Catalog
 * pages (Experiencias, Hoteles, Smart Finds) wait until the visitor is past 50%
 * of the page; every other page keeps the original 40%.
 *
 * `pathname` is next-intl's internal pathname (the keys of i18n.ts `pathnames`),
 * not the localized URL.
 */

export const DEFAULT_SCROLL_TRIGGER = 0.4
export const CATALOG_SCROLL_TRIGGER = 0.5

export function isCatalogPath(pathname: string): boolean {
  return pathname === '/experiences'
    || pathname === '/hotels'
    || pathname === '/smart-finds'
    || pathname.startsWith('/smart-finds/')
}

export function scrollTriggerFor(pathname: string): number {
  return isCatalogPath(pathname) ? CATALOG_SCROLL_TRIGGER : DEFAULT_SCROLL_TRIGGER
}
