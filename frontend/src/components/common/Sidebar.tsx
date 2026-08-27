import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  Wallet,
  Bell,
  BarChart3,
  Settings,
  Sparkles,
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/properties', label: 'Properties', icon: Building2 },
  { to: '/tenants', label: 'Tenants', icon: Users },
  { to: '/contracts', label: 'Contracts', icon: FileText },
  { to: '/transactions', label: 'Finance', icon: Wallet },
  { to: '/reminders', label: 'Reminders', icon: Bell },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export const Sidebar = ({ open, onClose }: Props) => {
  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-[#0b1222]/80 backdrop-blur-sm z-30 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={clsx(
          'fixed inset-y-0 left-0 w-64 bg-[#0b1222] border-r border-[#3d301d] z-40 flex flex-col transform transition-transform duration-300 ease-out',
          'lg:translate-x-0 lg:static lg:inset-auto lg:flex-shrink-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-6 flex-shrink-0 border-b border-[#3d301d]">
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-sm border border-[#c9a96e] bg-[#111a2e] flex items-center justify-center shadow-[0_0_15px_rgba(201,169,110,0.2)]">
              <span className="font-serif font-bold text-xs text-[#c9a96e]">H·P</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-[#f4ede0] tracking-[0.18em] uppercase group-hover:text-[#c9a96e] transition-colors">
                HARLOW RENTHUB
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#c9a96e]/70">
                PORTFOLIO MANAGEMENT
              </span>
            </div>
          </NavLink>
        </div>

        {/* Public Showcase Quick Link */}
        <div className="px-4 pt-4">
          <NavLink
            to="/"
            className="flex items-center justify-between px-3.5 py-2 rounded-lg bg-[#111a2e] border border-[#c9a96e]/30 text-xs font-sans text-[#c9a96e] hover:bg-[#c9a96e] hover:text-[#0b1222] transition-all group"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#c9a96e] group-hover:text-[#0b1222]" />
              <span className="font-medium tracking-wide">Public Showcase</span>
            </div>
            <span className="text-[10px] uppercase tracking-widest opacity-80">View Site →</span>
          </NavLink>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 pt-2 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#c9a96e]/70">
            NAVIGATION
          </p>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-all duration-200',
                  isActive
                    ? 'bg-[#c9a96e] text-[#0b1222] font-semibold shadow-[0_0_20px_rgba(201,169,110,0.3)]'
                    : 'text-[#f4ede0]/70 hover:text-[#f4ede0] hover:bg-[#111a2e] hover:border hover:border-[#3d301d]',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={clsx('w-4 h-4 flex-shrink-0', isActive ? 'text-[#0b1222]' : 'text-[#c9a96e]')} />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}

          <div className="pt-4 mt-4 border-t border-[#3d301d]">
            <NavLink
              to="/settings"
              onClick={onClose}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-all duration-200',
                  isActive
                    ? 'bg-[#c9a96e] text-[#0b1222] font-semibold shadow-[0_0_20px_rgba(201,169,110,0.3)]'
                    : 'text-[#f4ede0]/70 hover:text-[#f4ede0] hover:bg-[#111a2e] hover:border hover:border-[#3d301d]',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Settings className={clsx('w-4 h-4 flex-shrink-0', isActive ? 'text-[#0b1222]' : 'text-[#c9a96e]')} />
                  <span>Settings</span>
                </>
              )}
            </NavLink>
          </div>
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 flex-shrink-0 border-t border-[#3d301d] bg-[#0b1222]">
          <p className="text-[10px] font-sans text-[#f4ede0]/40">
            Harlow Properties &copy; {new Date().getFullYear()}
          </p>
        </div>
      </aside>
    </>
  );
};
