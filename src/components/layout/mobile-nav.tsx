import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { navItems, logoutItem } from './nav-items';
import { useAuthStore } from '@/stores/auth-store';

export function MobileNav() {
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
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <div className="grid grid-cols-6 py-2 px-1">
        {navItems.slice(0, 5).map((item) => (
          <Link
            key={item.name}
            to={item.to}
            className={cn(
              'flex flex-col items-center px-2 py-1',
              location.pathname === item.to
                ? 'text-red-600'
                : 'text-gray-600'
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] mt-0.5">{item.name}</span>
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center px-2 py-1 text-gray-600"
        >
          <logoutItem.icon className="h-5 w-5" />
          <span className="text-[10px] mt-0.5">{logoutItem.name}</span>
        </button>
      </div>
    </nav>
  );
}