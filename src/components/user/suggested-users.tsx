import { Link } from 'react-router-dom';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth-store';

const SUGGESTED_USERS = [
  {
    id: '1',
    name: 'Emily Rodriguez',
    department: 'Computer Science',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
  },
  {
    id: '2',
    name: 'David Kim',
    department: 'Mechanical Engineering',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
  },
  {
    id: '3',
    name: 'Sarah Chen',
    department: 'Data Science',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
  },
];

export function SuggestedUsers() {
  const currentUser = useAuthStore((state) => state.user);

  return (
    <div className="bg-white rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-semibold text-gray-900">Suggested Students</h2>
          <p className="text-sm text-gray-500">Based on your department</p>
        </div>
      </div>

      <div className="space-y-4">
        {SUGGESTED_USERS.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            <Link to={`/students/${user.id}`} className="flex items-center space-x-3">
              <Avatar src={user.avatar} alt={user.name} size="sm" />
              <div>
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.department}</p>
              </div>
            </Link>
            <Button variant="outline" size="sm">
              Connect
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <Link to="/departments" className="text-sm text-red-600 hover:text-red-700">
          View All Students
        </Link>
      </div>
    </div>
  );
}