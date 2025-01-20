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
      departments: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          phone: string
          department: string
          department_id: string | null
          avatar_url: string | null
          bio: string | null
          interests: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name: string
          last_name: string
          phone: string
          department: string
          department_id?: string | null
          avatar_url?: string | null
          bio?: string | null
          interests?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          phone?: string
          department?: string
          department_id?: string | null
          avatar_url?: string | null
          bio?: string | null
          interests?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string
          owner_id: string
          image_url: string | null
          tags: string[] | null
          status: 'planning' | 'in-progress' | 'completed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          owner_id: string
          image_url?: string | null
          tags?: string[] | null
          status?: 'planning' | 'in-progress' | 'completed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          owner_id?: string
          image_url?: string | null
          tags?: string[] | null
          status?: 'planning' | 'in-progress' | 'completed'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}