import { useEffect, useState } from 'react';
import { useProfileStore } from '@/stores/profile-store';
import { ProfileHeader } from './components/profile-header';
import { ProfileEditForm } from './components/profile-edit-form';
import { Loader } from 'lucide-react';

export function ProfilePage() {
  const { loading, error, fetchProfile } = useProfileStore();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-50 text-orange-600 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm mb-16 md:mb-0">
      <ProfileHeader onEdit={() => setIsEditing(true)} />
      {isEditing ? (
        <div className="p-6 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Edit Profile</h2>
          <ProfileEditForm onSuccess={() => setIsEditing(false)} />
        </div>
      ) : null}
    </div>
  );
}