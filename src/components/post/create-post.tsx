import { useState } from 'react';
import { Image, FolderKanban, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { useAuthStore } from '@/stores/auth-store';

export function CreatePost() {
  const [isOpen, setIsOpen] = useState(false);
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm mb-4">
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar
              src="https://i.postimg.cc/GmHHCvXM/Screenshot-at-Jan-20-11-18-46.png"
              alt="Sai Rohith Vennu"
              size="sm"
              className="w-10 h-10"
            />
          </div>
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
            <FolderKanban className="w-5 h-5 mr-2" />
            Project
          </Button>
          <Button
            variant="ghost"
            className="flex-1 text-gray-600"
            onClick={() => setIsOpen(true)}
          >
            <Users className="w-5 h-5 mr-2" />
            Collab
          </Button>
        </div>
      </div>
    </div>
  );
}