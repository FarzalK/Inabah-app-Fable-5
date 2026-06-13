// Auto-generated from Supabase schema — do not edit manually.
// Regenerate with: supabase gen types typescript --project-id znfptrzrxrmryokwwokk

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      muhasabah_sessions: {
        Row: {
          answers: Json
          categories: string[]
          created_at: string | null
          date: string
          id: string
          resolution: string | null
          summary: Json
          user_id: string
        }
        Insert: {
          answers?: Json
          categories: string[]
          created_at?: string | null
          date: string
          id: string
          resolution?: string | null
          summary?: Json
          user_id: string
        }
        Update: {
          answers?: Json
          categories?: string[]
          created_at?: string | null
          date?: string
          id?: string
          resolution?: string | null
          summary?: Json
          user_id?: string
        }
        Relationships: []
      }
      muraqabah_sessions: {
        Row: {
          breathing_used: boolean | null
          created_at: string | null
          date: string
          duration: number
          heart_state: string | null
          id: string
          name_id: number
          name_transliteration: string | null
          note: string | null
          user_id: string
        }
        Insert: {
          breathing_used?: boolean | null
          created_at?: string | null
          date: string
          duration: number
          heart_state?: string | null
          id: string
          name_id: number
          name_transliteration?: string | null
          note?: string | null
          user_id: string
        }
        Update: {
          breathing_used?: boolean | null
          created_at?: string | null
          date?: string
          duration?: number
          heart_state?: string | null
          id?: string
          name_id?: number
          name_transliteration?: string | null
          note?: string | null
          user_id?: string
        }
        Relationships: []
      }
      api_rate_limits: {
        Row: {
          user_id: string
          endpoint: string
          window_start: string
          call_count: number
        }
        Insert: {
          user_id: string
          endpoint: string
          window_start: string
          call_count?: number
        }
        Update: {
          user_id?: string
          endpoint?: string
          window_start?: string
          call_count?: number
        }
        Relationships: []
      }
      onboarding_responses: {
        Row: {
          created_at: string | null
          id: string
          question_id: string
          slider_value: number
          text_response: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          question_id: string
          slider_value: number
          text_response?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          question_id?: string
          slider_value?: number
          text_response?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          active_categories: string[] | null
          created_at: string | null
          discipline_level: number | null
          first_name: string | null
          last_name: string | null
          focus_plan: string | null
          id: string
          onboarding_completed: boolean | null
        }
        Insert: {
          active_categories?: string[] | null
          created_at?: string | null
          discipline_level?: number | null
          first_name?: string | null
          last_name?: string | null
          focus_plan?: string | null
          id: string
          onboarding_completed?: boolean | null
        }
        Update: {
          active_categories?: string[] | null
          created_at?: string | null
          discipline_level?: number | null
          first_name?: string | null
          last_name?: string | null
          focus_plan?: string | null
          id?: string
          onboarding_completed?: boolean | null
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  T extends keyof DefaultSchema["Tables"],
> = DefaultSchema["Tables"][T]["Row"]

export type TablesInsert<
  T extends keyof DefaultSchema["Tables"],
> = DefaultSchema["Tables"][T]["Insert"]

export type TablesUpdate<
  T extends keyof DefaultSchema["Tables"],
> = DefaultSchema["Tables"][T]["Update"]
