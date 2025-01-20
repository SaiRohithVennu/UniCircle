import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from '@/components/layout/logo';
import { navItems, logoutItem } from './nav-items';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="hidden md:flex w-[245px] h-screen border-r border-gray-200 fixed left-0 top-0 flex-col bg-white">
      <div className="p-6 border-b border-gray-200">
        <Logo />
      </div>

      <nav className="flex-1 px-2 py-4">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.to}
            className={cn(
              'flex items-center gap-4 px-4 py-3 rounded-lg text-base font-medium transition-colors',
              location.pathname === item.to
                ? 'text-black'
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            <item.icon className="h-6 w-6" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3 w-full rounded-lg text-base font-medium text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <logoutItem.icon className="h-6 w-6" />
          <span>{logoutItem.name}</span>
        </button>
      </div>
    </div>
  );
}