// lib/supabase/types.ts
// Database type definitions
// Run `supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/types.ts`
// to regenerate from your actual schema

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      // LIVE NOW
      trips: {
        Row: {
          id:           string
          slug:         string
          title:        string | null
          user_id:      string | null
          trip_data:    Json
          destination:  string | null
          origin:       string | null
          duration_days: number | null
          travelers:    string | null
          travel_style: Database['public']['Enums']['travel_style'] | null
          budget_level: string | null
          interests:    string[]
          created_at:   string
          share_id:     string | null   // UUID — non-guessable share token
          is_shared:    boolean         // false until owner explicitly shares
        }
        Insert: {
          id?:           string
          slug:          string
          title?:        string | null
          user_id?:      string | null
          trip_data:     Json
          destination?:  string | null
          origin?:       string | null
          duration_days?: number | null
          travelers?:    string | null
          travel_style?: Database['public']['Enums']['travel_style'] | null
          budget_level?: string | null
          interests?:    string[]
          created_at?:   string
          share_id?:     string | null
          is_shared?:    boolean
        }
        Update: Partial<Database['public']['Tables']['trips']['Insert']>
      }
      email_leads: {
        Row: {
          id:         string
          email:      string
          source:     string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['email_leads']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['email_leads']['Insert']>
      }
      contact_messages: {
        Row: {
          id:         string
          name:       string
          email:      string
          subject:    string | null
          message:    string
          created_at: string
        }
        Insert: {
          id?:         string
          name:        string
          email:       string
          subject?:    string | null
          message:     string
          created_at?: string
        }
        Update: {
          name?:       string
          email?:      string
          subject?:    string | null
          message?:    string
          created_at?: string
        }
        Relationships: []
      }

      // E11 — April (auth + user accounts)
      // users: { ... }
      // user_preferences: { ... }

      // E12/E13 — April (paywall + Stripe)
      user_entitlements: {
        Row: {
          user_id:                string
          tier:                   'free' | 'per_trip' | 'pack_5' | 'pack_10' | 'explorer'
          trips_remaining:        number
          trips_used:             number
          stripe_customer_id:     string | null
          stripe_subscription_id: string | null
          current_period_end:     string | null
          created_at:             string
          updated_at:             string
        }
        Insert: {
          user_id:                string
          tier?:                  'free' | 'per_trip' | 'pack_5' | 'pack_10' | 'explorer'
          trips_remaining?:       number
          trips_used?:            number
          stripe_customer_id?:    string | null
          stripe_subscription_id?: string | null
          current_period_end?:    string | null
          created_at?:            string
          updated_at?:            string
        }
        Update: Partial<Database['public']['Tables']['user_entitlements']['Insert']>
      }

      // CONTENT (ongoing)
      // guides: { ... }
      // guide_translations: { ... }
      // destinations: { ... }
      // recommendations: { ... }
    }
    Views:   {}
    Functions: {}
    Enums: {
      travel_style: 'relajado' | 'equilibrado' | 'activo'
      traveler_type: 'solo' | 'pareja' | 'familia' | 'amigos'
      subscription_tier: 'free' | 'per_trip' | 'pack_5' | 'pack_10' | 'explorer'
    }
  }
}

// Convenience type aliases
export type Trip         = Database['public']['Tables']['trips']['Row']
export type TripInsert   = Database['public']['Tables']['trips']['Insert']
export type EmailLead    = Database['public']['Tables']['email_leads']['Row']
export type TravelStyle  = Database['public']['Enums']['travel_style']
export type TravelerType     = Database['public']['Enums']['traveler_type']
export type ContactMessage   = Database['public']['Tables']['contact_messages']['Row']
export type ContactMessageInsert = Database['public']['Tables']['contact_messages']['Insert']
