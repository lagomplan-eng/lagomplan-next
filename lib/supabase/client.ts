// lib/supabase/client.ts
// Browser client — use in 'use client' components
// Singleton pattern matches existing window.LAGOMPLAN.supabase convention

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

// Singleton so we don't create multiple clients
let client: ReturnType<typeof createBrowserClient<Database>> | null = null

export function getSupabaseBrowser() {
  if (client) return client
  client = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  // Mirror existing convention: window.LAGOMPLAN.supabase
  if (typeof window !== 'undefined') {
    (window as any).LAGOMPLAN = { ...(window as any).LAGOMPLAN, supabase: client }
  }
  return client
}
