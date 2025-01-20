import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { 
  ArrowRight, 
  MoreVertical, 
  MessageSquare, 
  Repeat2, 
  Heart,
  Share2,
  Trash2 
} from 'lucide-react';
import { useProjectStore } from '@/stores/project-store';
import type { Database } from '@/types/supabase';

type Project = Database['public']['Tables']['projects']['Row'] & {
  profiles: {
    first_name: string;
    last_name: string;
    avatar_url: string | null;
    department: string;
  };
};

interface ProjectCardProps extends Project {}

export function ProjectCard({ 
  id, 
  name, 
  description, 
  image_url, 
  profiles, 
  tags, 
  status,
  owner_id,
  created_at
}: ProjectCardProps) {
  const deleteProject = useProjectStore((state) => state.deleteProject);
  const ownerName = `${profiles.first_name} ${profiles.last_name}`;
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id);
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Avatar 
              src="https://i.postimg.cc/GmHHCvXM/Screenshot-at-Jan-20-11-18-46.png"
              alt={ownerName}
              size="sm" 
            />
            <div>
              <h3 className="font-medium text-gray-900">
                {ownerName}
              </h3>
              <p className="text-sm text-gray-500">
                {profiles.department} • {new Date(created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-gray-500 hover:text-orange-600"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            {name}
          </h2>
          <p className="text-gray-600 mb-4">
            {description}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {tags?.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
              >
                {tag}
              </span>
            ))}
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {status}
            </span>
          </div>

          {image_url && (
            <div className="mb-4">
              <img
                src={image_url}
                alt={name}
                className="w-full rounded-lg object-cover"
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t">
          <Button variant="ghost" className="flex-1">
            <Heart className="w-4 h-4 mr-2" />
            Like
          </Button>
          <Button variant="ghost" className="flex-1">
            <MessageSquare className="w-4 h-4 mr-2" />
            Comment
          </Button>
          <Button variant="ghost" className="flex-1">
            <Repeat2 className="w-4 h-4 mr-2" />
            Repost
          </Button>
          <Button variant="ghost" className="flex-1">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
}