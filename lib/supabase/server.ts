// lib/supabase/server.ts
// Server client — use in Server Components, Route Handlers, Server Actions
// Reads/writes cookies for session management

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './types'

export async function getSupabaseServer() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string)               { return cookieStore.get(name)?.value },
        set(name, value, options)       { try { cookieStore.set({ name, value, ...options }) } catch {} },
        remove(name, options)           { try { cookieStore.set({ name, value: '', ...options }) } catch {} },
      },
    }
  )
}

// Service role client — only for server-side admin operations
// NEVER expose to client
export function getSupabaseAdmin() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { get: () => '', set: () => {}, remove: () => {} } }
  )
}
