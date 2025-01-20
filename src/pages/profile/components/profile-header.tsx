import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { useProfileStore } from '@/stores/profile-store';

interface ProfileHeaderProps {
  onEdit: () => void;
}

export function ProfileHeader({ onEdit }: ProfileHeaderProps) {
  const profile = useProfileStore((state) => state.profile);
  
  if (!profile) return null;

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6">
      <Avatar
        src={profile.avatar_url || undefined}
        alt={`${profile.first_name} ${profile.last_name}`}
        size="lg"
        className="w-24 h-24 md:w-32 md:h-32"
      />
      <div className="flex-1">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {profile.first_name} {profile.last_name}
            </h1>
            <p className="text-gray-600">{profile.email}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Edit Profile
          </Button>
        </div>
        
        <div className="flex gap-6 mb-4">
          <div className="text-center">
            <div className="font-bold text-gray-900">0</div>
            <div className="text-sm text-gray-600">Projects</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-gray-900">0</div>
            <div className="text-sm text-gray-600">Connections</div>
          </div>
        </div>

        <div className="space-y-2">
          {profile.department && (
            <div className="text-gray-600">
              Department: {profile.department}
            </div>
          )}
          {profile.bio && (
            <p className="text-gray-600">{profile.bio}</p>
          )}
          {profile.interests && profile.interests.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <span
                  key={interest}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}