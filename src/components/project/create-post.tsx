import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProjectStore } from '@/stores/project-store';
import { projectSchema } from '@/lib/validations/project';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/file/file-upload';
import { Image, Video, FileText, X, Loader } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { useAuthStore } from '@/stores/auth-store';
import type { z } from 'zod';

type ProjectFormValues = z.infer<typeof projectSchema>;

export function CreatePost() {
  const [isOpen, setIsOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const createProject = useProjectStore((state) => state.createProject);
  const user = useAuthStore((state) => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema)
  });

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      await createProject({
        ...data,
        image_url: imageUrl
      });
      reset();
      setImageUrl(undefined);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm mb-4">
      {!isOpen ? (
        <div className="p-4">
          <div className="flex items-center gap-3">
            <Avatar
              src={user.avatar_url || undefined}
              alt={`${user.first_name} ${user.last_name}`}
              size="sm"
            />
            <button
              onClick={() => setIsOpen(true)}
              className="flex-1 text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-500"
            >
              Start a post, try writing with AI
            </button>
          </div>
          <div className="flex justify-between mt-3">
            <Button
              variant="ghost"
              className="flex-1 text-gray-600"
              onClick={() => setIsOpen(true)}
            >
              <Image className="w-5 h-5 mr-2" />
              Photo
            </Button>
            <Button
              variant="ghost"
              className="flex-1 text-gray-600"
              onClick={() => setIsOpen(true)}
            >
              <Video className="w-5 h-5 mr-2" />
              Video
            </Button>
            <Button
              variant="ghost"
              className="flex-1 text-gray-600"
              onClick={() => setIsOpen(true)}
            >
              <FileText className="w-5 h-5 mr-2" />
              Write article
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar
                src={user.avatar_url || undefined}
                alt={`${user.first_name} ${user.last_name}`}
                size="sm"
              />
              <div>
                <p className="font-medium text-gray-900">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-sm text-gray-500">{user.department}</p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <input
                {...register('name')}
                placeholder="Project name"
                className="w-full px-0 py-2 bg-transparent border-none text-lg font-medium placeholder:text-gray-400 focus:outline-none focus:ring-0"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-orange-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <textarea
                {...register('description')}
                placeholder="What do you want to share about this project?"
                rows={4}
                className="w-full px-0 py-2 bg-transparent border-none placeholder:text-gray-400 focus:outline-none focus:ring-0 resize-none"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-orange-600">{errors.description.message}</p>
              )}
            </div>

            <div>
              <input
                {...register('tags')}
                placeholder="Add tags (comma separated)"
                className="w-full px-0 py-2 bg-transparent border-none placeholder:text-gray-400 focus:outline-none focus:ring-0"
              />
              {errors.tags && (
                <p className="mt-1 text-sm text-orange-600">{errors.tags.message}</p>
              )}
            </div>

            <div>
              <select
                {...register('status')}
                className="w-full px-0 py-2 bg-transparent border-none text-gray-600 focus:outline-none focus:ring-0"
              >
                <option value="planning">Planning</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-orange-600">{errors.status.message}</p>
              )}
            </div>

            <FileUpload onUpload={setImageUrl} />
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                'Post'
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}