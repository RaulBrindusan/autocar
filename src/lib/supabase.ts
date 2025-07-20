import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      car_requests: {
        Row: {
          id: string
          created_at: string
          full_name: string
          email: string
          phone: string | null
          car_make: string
          car_model: string
          year_from: number | null
          year_to: number | null
          budget_min: number | null
          budget_max: number | null
          transmission: string | null
          fuel_type: string | null
          features: string[] | null
          additional_notes: string | null
          status: 'pending' | 'processing' | 'completed' | 'cancelled'
        }
        Insert: {
          id?: string
          created_at?: string
          full_name: string
          email: string
          phone?: string | null
          car_make: string
          car_model: string
          year_from?: number | null
          year_to?: number | null
          budget_min?: number | null
          budget_max?: number | null
          transmission?: string | null
          fuel_type?: string | null
          features?: string[] | null
          additional_notes?: string | null
          status?: 'pending' | 'processing' | 'completed' | 'cancelled'
        }
        Update: {
          id?: string
          created_at?: string
          full_name?: string
          email?: string
          phone?: string | null
          car_make?: string
          car_model?: string
          year_from?: number | null
          year_to?: number | null
          budget_min?: number | null
          budget_max?: number | null
          transmission?: string | null
          fuel_type?: string | null
          features?: string[] | null
          additional_notes?: string | null
          status?: 'pending' | 'processing' | 'completed' | 'cancelled'
        }
      }
      openlane_submissions: {
        Row: {
          id: string
          created_at: string
          full_name: string
          email: string
          phone: string | null
          openlane_url: string
          notes: string | null
          status: 'pending' | 'processing' | 'completed' | 'cancelled'
        }
        Insert: {
          id?: string
          created_at?: string
          full_name: string
          email: string
          phone?: string | null
          openlane_url: string
          notes?: string | null
          status?: 'pending' | 'processing' | 'completed' | 'cancelled'
        }
        Update: {
          id?: string
          created_at?: string
          full_name?: string
          email?: string
          phone?: string | null
          openlane_url?: string
          notes?: string | null
          status?: 'pending' | 'processing' | 'completed' | 'cancelled'
        }
      }
      cost_estimates: {
        Row: {
          id: string
          created_at: string
          car_value: number
          import_fees: number
          shipping_cost: number
          taxes: number
          total_cost: number
          email: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          car_value: number
          import_fees: number
          shipping_cost: number
          taxes: number
          total_cost: number
          email?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          car_value?: number
          import_fees?: number
          shipping_cost?: number
          taxes?: number
          total_cost?: number
          email?: string | null
        }
      }
    }
  }
}