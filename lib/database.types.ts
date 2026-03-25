export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          username?: string;
          display_name?: string | null;
          avatar_url?: string | null;
        };
      };
      habits: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          icon: string;
          color: string;
          sort_order: number;
          archived: boolean;
          schedule_type: 'daily' | 'custom';
          schedule_days: number[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          icon?: string;
          color?: string;
          sort_order?: number;
          archived?: boolean;
          schedule_type?: 'daily' | 'custom';
          schedule_days?: number[];
        };
        Update: {
          name?: string;
          icon?: string;
          color?: string;
          sort_order?: number;
          archived?: boolean;
          schedule_type?: 'daily' | 'custom';
          schedule_days?: number[];
          updated_at?: string;
        };
      };
      habit_logs: {
        Row: {
          id: string;
          habit_id: string;
          user_id: string;
          date: string;
          completed: boolean;
          logged_at: string;
        };
        Insert: {
          id?: string;
          habit_id: string;
          user_id: string;
          date: string;
          completed?: boolean;
        };
        Update: {
          completed?: boolean;
        };
      };
      mood_logs: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          time_of_day: 'morning' | 'evening';
          score: number;
          logged_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          time_of_day: 'morning' | 'evening';
          score: number;
        };
        Update: {
          score?: number;
        };
      };
      friendships: {
        Row: {
          id: string;
          requester_id: string;
          addressee_id: string;
          status: 'pending' | 'accepted' | 'blocked';
          created_at: string;
        };
        Insert: {
          id?: string;
          requester_id: string;
          addressee_id: string;
          status?: 'pending' | 'accepted' | 'blocked';
        };
        Update: {
          status?: 'pending' | 'accepted' | 'blocked';
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// Convenience row types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Habit = Database['public']['Tables']['habits']['Row'];
export type HabitLog = Database['public']['Tables']['habit_logs']['Row'];
export type MoodLog = Database['public']['Tables']['mood_logs']['Row'];
export type Friendship = Database['public']['Tables']['friendships']['Row'];
