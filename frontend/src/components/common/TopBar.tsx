import { Menu, Settings } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Link } from 'react-router-dom';

interface Props {
  onMenuClick: () => void;
  title: string;
}

export const TopBar = ({ onMenuClick, title }: Props) => {
  const { user } = useAuthStore();

  const initials = user?.name
    ? user.name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <header className="h-14 bg-white border-b border-ink-100 flex items-center px-4 gap-3 flex-shrink-0">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 sm:p-2.5 rounded-lg text-ink-500 hover:bg-ink-100 transition"
      >
        <Menu className="w-5 h-5" />
      </button>

      <h1 className="text-base font-semibold text-ink-900 flex-1">{title}</h1>

      <div className="flex items-center gap-2">
        <Link
          to="/settings"
          className="p-2 sm:p-2.5 rounded-lg text-ink-400 hover:text-ink-700 hover:bg-ink-100 transition"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </Link>

        <Link to="/settings" className="flex items-center gap-2 pl-2 border-l border-ink-100">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold">
            {initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-ink-800 leading-none">{user?.name}</p>
            <p className="text-[10px] text-ink-400 mt-0.5 leading-none">{user?.email}</p>
          </div>
        </Link>
      </div>
    </header>
  );
};
