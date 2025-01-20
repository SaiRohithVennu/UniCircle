import { useEffect, useMemo } from 'react';
import { useProjectStore } from '@/stores/project-store';
import { ProjectCard } from './project-card';
import { Loader } from 'lucide-react';

interface ProjectListProps {
  searchQuery?: string;
}

export function ProjectList({ searchQuery = '' }: ProjectListProps) {
  const { projects, loading, error, fetchProjects } = useProjectStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filteredProjects = useMemo(() => {
    if (!searchQuery) return projects;
    
    const query = searchQuery.toLowerCase();
    return projects.filter((project) => 
      project.name.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      project.tags?.some(tag => tag.toLowerCase().includes(query))
    );
  }, [projects, searchQuery]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-600">
        {error}
      </div>
    );
  }

  if (filteredProjects.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {searchQuery ? 'No projects found matching your search.' : 'No projects found. Create one to get started!'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {filteredProjects.map((project) => (
        <ProjectCard key={project.id} {...project} />
      ))}
    </div>
  );
}