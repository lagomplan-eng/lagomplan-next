// lib/supabase/env.ts
// Guarded readers for the Supabase env vars.
//
// Why this exists: the client constructors used `process.env.X!` (non-null
// assertion). When a var is undefined the client is built with `undefined`
// and the failure surfaces later as a cryptic crash with no hint at the cause.
// These helpers turn a missing var into a clear, named error.
//
// CRITICAL — must use LITERAL `process.env.NEXT_PUBLIC_*` references:
// Next.js only inlines NEXT_PUBLIC_* vars into the browser bundle when they
// appear as a *literal* member expression (`process.env.NEXT_PUBLIC_SUPABASE_URL`).
// A dynamic lookup (`process.env[name]`) is NOT inlined, so on the client it is
// `undefined` even when the var is set — which would make this guard throw on
// every page in a production build (it did: it took down preview deploys until
// this was fixed). So we read each var literally at the call site and pass the
// value in; the `name` string is only for the error message.

function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `[supabase] Missing env var ${name}. Set it for THIS Vercel environment — ` +
      `Production AND every Preview (incl. feature-branch previews), not just ` +
      `"Preview (main)". A var scoped to only some environments 500s on the rest.`,
    )
  }
  return value
}

// Literal references below — required for Next.js client-side inlining.
export const supabaseUrl            = () => requireEnv('NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL)
export const supabaseAnonKey        = () => requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
export const supabaseServiceRoleKey = () => requireEnv('SUPABASE_SERVICE_ROLE_KEY', process.env.SUPABASE_SERVICE_ROLE_KEY)
