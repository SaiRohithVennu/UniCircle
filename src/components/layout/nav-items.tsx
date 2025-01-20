import { Home, Users, Search, PlusSquare, User, LogOut, FolderKanban } from 'lucide-react';

export const navItems = [
  { name: 'Home', to: '/', icon: Home },
  { name: 'Projects', to: '/projects', icon: FolderKanban },
  { name: 'Departments', to: '/departments', icon: Users },
  { name: 'Search', to: '/search', icon: Search },
  { name: 'Create', to: '/create', icon: PlusSquare },
  { name: 'Profile', to: '/profile', icon: User },
];

export const logoutItem = {
  name: 'Logout',
  icon: LogOut,
};