import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface Department {
  id: string;
  name: string;
  description: string | null;
  students: Profile[];
  studentCount: number;
}

export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch departments with their students and university info
        const { data: depts, error: deptsError } = await supabase
          .from('departments')
          .select(`
            id,
            name,
            description,
            profiles!department_id(
              id,
              first_name,
              last_name,
              email,
              avatar_url,
              bio,
              department,
              university_id,
              universities!university_id(name)
            )
          `)
          .order('name');

        if (deptsError) throw deptsError;

        // Transform the data
        const transformedDepts = depts.map((dept: any) => {
          const students = dept.profiles?.map((profile: any) => ({
            ...profile,
            university: profile.universities?.name
          })) || [];

          return {
            id: dept.id,
            name: dept.name,
            description: dept.description,
            students,
            studentCount: students.length
          };
        });

        setDepartments(transformedDepts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch departments');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { departments, loading, error };
}