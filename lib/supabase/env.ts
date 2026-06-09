// lib/supabase/env.ts
// Guarded readers for the Supabase env vars.
//
// Why this exists: the client constructors used `process.env.X!` (non-null
// assertion). When a var is undefined the client is built with `undefined`
// and the failure surfaces later as a cryptic crash / 500 with no hint at the
// cause. We hit this exact class with the newsletter (MAILCHIMP_* scoped to
// "Preview (main)" only, so feature-branch previews broke). These helpers turn
// a missing var into a clear, named error that points straight at the fix:
// set the var for THIS Vercel environment, including every Preview.
//
// There is no meaningful fallback for a missing database — the right fix is
// always the Vercel env scope. This just makes the failure legible.

function required(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(
      `[supabase] Missing env var ${name}. Set it for THIS Vercel environment — ` +
      `Production AND every Preview (incl. feature-branch previews), not just ` +
      `"Preview (main)". A var scoped to only some environments 500s on the rest.`,
    )
  }
  return value
}

export const supabaseUrl            = () => required('NEXT_PUBLIC_SUPABASE_URL')
export const supabaseAnonKey        = () => required('NEXT_PUBLIC_SUPABASE_ANON_KEY')
export const supabaseServiceRoleKey = () => required('SUPABASE_SERVICE_ROLE_KEY')
