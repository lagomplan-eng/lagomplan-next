/**
 * lib/navigation.ts
 *
 * Exports typed navigation primitives from next-intl.
 * ALL components must import Link, useRouter, usePathname from here
 * — NOT from 'next-intl/link', 'next/navigation', or 'next-intl/client'.
 *
 * The Link component accepts `href` as an internal path key (matching
 * the pathnames config), and next-intl automatically renders the
 * correct localized URL for the current locale.
 *
 * Examples:
 *   <Link href="/planner">             → /es/planificador  (in ES context)
 *   <Link href="/planner">             → /en/planner       (in EN context)
 *   <Link href="/guides" locale="en">  → /en/guides        (explicit locale)
 *
 * For parameterized routes:
 *   <Link href={{ pathname: '/guides/[slug]', params: { slug: 'valle-de-bravo' } }}>
 *     → /es/guias/valle-de-bravo
 *
 * Language switcher:
 *   const router = useRouter()
 *   const pathname = usePathname()   // returns internal path e.g. '/planner'
 *   router.replace(pathname, { locale: 'en' })  // → /en/planner
 */

import { createNavigation } from 'next-intl/navigation'
import { locales, pathnames } from '../i18n'

export const { Link, redirect, usePathname, useRouter } =
  createNavigation({ locales, pathnames })
