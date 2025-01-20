import { useAuthStore } from '@/stores/auth-store';

export function ProfileInfo() {
  const user = useAuthStore((state) => state.user);
  
  if (!user) return null;

  return (
    <div className="px-6 py-4 border-t border-gray-200">
      <div className="mb-4">
        <h2 className="font-bold text-gray-900 mb-1">Department</h2>
        <p className="text-gray-600">{user.department}</p>
      </div>
      
      {user.bio && (
        <div className="mb-4">
          <h2 className="font-bold text-gray-900 mb-1">Bio</h2>
          <p className="text-gray-600">{user.bio}</p>
        </div>
      )}
      
      {user.interests && user.interests.length > 0 && (
        <div>
          <h2 className="font-bold text-gray-900 mb-2">Interests</h2>
          <div className="flex flex-wrap gap-2">
            {user.interests.map((interest) => (
              <span
                key={interest}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}