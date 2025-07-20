export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      car_requests: {
        Row: {
          id: string
          user_id: string | null
          brand: string
          model: string
          year: number | null
          max_budget: number | null
          preferred_color: string | null
          fuel_type: string | null
          transmission: string | null
          mileage_max: number | null
          additional_requirements: string | null
          contact_email: string
          contact_phone: string | null
          contact_name: string
          status: 'pending' | 'in_progress' | 'quoted' | 'completed' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          brand: string
          model: string
          year?: number | null
          max_budget?: number | null
          preferred_color?: string | null
          fuel_type?: string | null
          transmission?: string | null
          mileage_max?: number | null
          additional_requirements?: string | null
          contact_email: string
          contact_phone?: string | null
          contact_name: string
          status?: 'pending' | 'in_progress' | 'quoted' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          brand?: string
          model?: string
          year?: number | null
          max_budget?: number | null
          preferred_color?: string | null
          fuel_type?: string | null
          transmission?: string | null
          mileage_max?: number | null
          additional_requirements?: string | null
          contact_email?: string
          contact_phone?: string | null
          contact_name?: string
          status?: 'pending' | 'in_progress' | 'quoted' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
      }
      cost_estimates: {
        Row: {
          id: string
          user_id: string | null
          car_value: number
          import_fees: number
          shipping_cost: number
          taxes: number
          total_cost: number
          contact_email: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          car_value: number
          import_fees: number
          shipping_cost: number
          taxes: number
          total_cost: number
          contact_email?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          car_value?: number
          import_fees?: number
          shipping_cost?: number
          taxes?: number
          total_cost?: number
          contact_email?: string | null
          created_at?: string
        }
      }
      openlane_submissions: {
        Row: {
          id: string
          user_id: string | null
          openlane_url: string
          contact_email: string
          contact_phone: string | null
          contact_name: string
          notes: string | null
          status: 'pending' | 'reviewed' | 'quoted' | 'completed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          openlane_url: string
          contact_email: string
          contact_phone?: string | null
          contact_name: string
          notes?: string | null
          status?: 'pending' | 'reviewed' | 'quoted' | 'completed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          openlane_url?: string
          contact_email?: string
          contact_phone?: string | null
          contact_name?: string
          notes?: string | null
          status?: 'pending' | 'reviewed' | 'quoted' | 'completed'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}