import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, Bell, MessageSquare, User, LogOut } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Feed', to: '/', icon: Home },
  { name: 'Departments', to: '/departments', icon: Users },
  { name: 'Notifications', to: '/notifications', icon: Bell },
  { name: 'Messages', to: '/messages', icon: MessageSquare },
  { name: 'Profile', to: '/profile', icon: User },
];

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:top-0 md:bottom-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between md:justify-start md:space-x-10 py-3">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.to}
              className={`text-gray-600 hover:text-red-600 flex flex-col items-center md:flex-row md:space-x-2 ${
                location.pathname === item.to ? 'text-red-600' : ''
              }`}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs md:text-sm">{item.name}</span>
            </Link>
          ))}
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-gray-600 hover:text-red-600 flex flex-col items-center md:flex-row md:space-x-2"
          >
            <LogOut className="h-6 w-6" />
            <span className="text-xs md:text-sm">Logout</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}