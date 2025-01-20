import { useEffect } from 'react';
import { useProjectStore } from '@/stores/project-store';
import { ProjectCard } from '@/components/project/project-card';
import { useAuthStore } from '@/stores/auth-store';
import { Loader } from 'lucide-react';

export function ProfileProjects() {
  const user = useAuthStore((state) => state.user);
  const { projects, loading, error, fetchProjects } = useProjectStore();

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user, fetchProjects]);

  if (!user) return null;

  const userProjects = projects.filter(project => project.owner_id === user.id);

  return (
    <div className="border-t border-gray-200">
      <div className="px-6 py-4">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Projects</h2>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader className="h-8 w-8 animate-spin text-red-600" />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            {error}
          </div>
        ) : userProjects.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No projects yet. Create one to get started!
          </div>
        ) : (
          <div className="space-y-6">
            {userProjects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}