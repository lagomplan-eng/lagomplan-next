'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { getSupabaseBrowser } from '../../lib/supabase/client'

const UserContext = createContext<User | null | undefined>(undefined)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined)

  useEffect(() => {
    const supabase = getSupabaseBrowser()

    // Initial session — fast, no network
    supabase.auth.getSession().then(({ data }) => {
      console.log('[Auth] initial session:', data.session?.user ?? null)
      setUser(data.session?.user ?? null)
    })

    // Real-time auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[Auth] state change:', event, session?.user ?? null)
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

// undefined = loading, null = logged out, User = logged in
export function useUser(): User | null | undefined {
  return useContext(UserContext)
}
