import { Menu, Settings, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Link } from 'react-router-dom';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';

interface Props {
  onMenuClick: () => void;
  title: string;
}

export const TopBar = ({ onMenuClick, title }: Props) => {
  const { user } = useAuthStore();

  const initials = user?.name
    ? user.name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()
    : 'EH';

  return (
    <header className="h-16 bg-[#0b1222] border-b border-[#3d301d] flex items-center px-6 gap-4 flex-shrink-0 text-[#f4ede0]">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-[#f4ede0]/70 hover:text-[#c9a96e] hover:bg-[#111a2e] transition"
      >
        <Menu className="w-5 h-5" />
      </button>

      <h1 className="font-serif text-lg sm:text-xl font-normal text-[#f4ede0] flex-1 tracking-tight">
        {title}
      </h1>

      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#c9a96e]/40 bg-[#111a2e] text-xs font-sans text-[#c9a96e] hover:bg-[#c9a96e] hover:text-[#0b1222] transition-colors"
          title="Visit Public Showcase Website"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Showcase Website</span>
        </Link>

        {/* Workspace Switcher Dropdown */}
        <WorkspaceSwitcher />

        <Link
          to="/settings"
          className="p-2 rounded-lg text-[#f4ede0]/70 hover:text-[#c9a96e] hover:bg-[#111a2e] transition"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </Link>

        <Link to="/settings" className="flex items-center gap-2 pl-3 border-l border-[#3d301d] flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-[#c9a96e] text-[#0b1222] flex items-center justify-center text-xs font-bold font-serif shadow-[0_0_10px_rgba(201,169,110,0.3)]">
            {initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-[#f4ede0] leading-none">{user?.name || 'Elena Harlow'}</p>
            <p className="text-[10px] text-[#c9a96e] mt-0.5 leading-none">{user?.email || 'elena@harlowproperties.com'}</p>
          </div>
        </Link>
      </div>
    </header>
  );
};
