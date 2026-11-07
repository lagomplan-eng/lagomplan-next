/**
 * lib/data/guides/now.ts
 *
 * "Now" for guide pages. Dated blocks (timely / seasonal editions) compare against it when the page is
 * rendered on the server. For local testing only, GUIDE_NOW_OVERRIDE (an ISO date-time) can move the clock;
 * it is ignored whenever NODE_ENV is "production" (every Vercel build and runtime, Preview included) and
 * on Vercel Production explicitly, so it can never change what visitors see.
 */
export function guideNow(env: Record<string, string | undefined> = process.env): Date {
  const override = env.GUIDE_NOW_OVERRIDE
  if (override && env.NODE_ENV !== 'production' && env.VERCEL_ENV !== 'production') {
    const d = new Date(override)
    if (!Number.isNaN(d.getTime())) return d
  }
  return new Date()
}
