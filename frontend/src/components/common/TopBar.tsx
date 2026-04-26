import { Menu, LogOut, Bell } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

interface Props {
  onMenuClick: () => void;
  title: string;
}

export const TopBar = ({ onMenuClick, title }: Props) => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U';

  return (
    <header className="h-16 bg-white border-b border-ink-200 flex items-center px-4 gap-4 flex-shrink-0">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-ink-500 hover:bg-ink-100 transition"
      >
        <Menu className="w-5 h-5" />
      </button>

      <h1 className="text-lg font-semibold text-ink-900 flex-1">{title}</h1>

      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-lg text-ink-500 hover:bg-ink-100 transition">
          <Bell className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-ink-200">
          <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-semibold">
            {initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-ink-800 leading-none">{user?.name}</p>
            <p className="text-xs text-ink-400 mt-0.5">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="ml-1 p-1.5 rounded-lg text-ink-400 hover:text-ink-700 hover:bg-ink-100 transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
