import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

type Project = Database['public']['Tables']['projects']['Insert'];

export function useCreateProject() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProject = async (projectData: Omit<Project, 'id' | 'owner_id'>) => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error: projectError } = await supabase
        .from('projects')
        .insert([
          {
            ...projectData,
            owner_id: user.id
          }
        ])
        .select()
        .single();

      if (projectError) throw projectError;
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create project';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createProject, loading, error };
}