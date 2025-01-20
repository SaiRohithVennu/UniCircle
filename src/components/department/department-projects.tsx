import { ProjectCard } from '@/components/project/project-card';
import type { Database } from '@/types/supabase';

type Project = Database['public']['Tables']['projects']['Row'] & {
  profiles: {
    first_name: string;
    last_name: string;
    avatar_url: string | null;
    department: string;
  };
};

interface DepartmentProjectsProps {
  projects: Project[];
}

export function DepartmentProjects({ projects }: DepartmentProjectsProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No projects in this department yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
      <div className="space-y-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>
    </div>
  );
}