// lib/hotels/admin.ts — the admin gate: a Supabase session whose email is in ADMIN_EMAILS.
import { getSupabaseServer } from '../supabase/server'

export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return adminEmails().includes(email.trim().toLowerCase())
}

/** The signed-in admin's email, or null (not signed in, or not on the allowlist). */
export async function getAdminEmail(): Promise<string | null> {
  try {
    const supabase = await getSupabaseServer()
    const { data: { user } } = await supabase.auth.getUser()
    return user && isAdminEmail(user.email) ? (user.email ?? null) : null
  } catch {
    return null
  }
}
