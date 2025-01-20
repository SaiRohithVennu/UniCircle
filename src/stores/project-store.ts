import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

type Project = Database['public']['Tables']['projects']['Row'] & {
  profiles: {
    first_name: string;
    last_name: string;
    avatar_url: string | null;
    department: string;
  };
};

interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  createProject: (project: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'owner_id' | 'profiles'>) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  loading: false,
  error: null,

  fetchProjects: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          profiles:owner_id (
            first_name,
            last_name,
            avatar_url,
            department
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ projects: data || [] });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch projects' });
    } finally {
      set({ loading: false });
    }
  },

  createProject: async (project) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('projects')
      .insert([{ ...project, owner_id: userData.user.id }])
      .select(`
        *,
        profiles:owner_id (
          first_name,
          last_name,
          avatar_url,
          department
        )
      `)
      .single();

    if (error) throw error;
    if (data) {
      set((state) => ({ projects: [data, ...state.projects] }));
    }
  },

  updateProject: async (id, updates) => {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        profiles:owner_id (
          first_name,
          last_name,
          avatar_url,
          department
        )
      `)
      .single();

    if (error) throw error;
    if (data) {
      set((state) => ({
        projects: state.projects.map((p) => (p.id === id ? data : p))
      }));
    }
  },

  deleteProject: async (id) => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;

    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id)
    }));
  },
}));