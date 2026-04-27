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
  Home,
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
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={clsx(
          'fixed inset-y-0 left-0 w-60 bg-ink-900 z-40 flex flex-col transform transition-transform duration-200 ease-in-out',
          'lg:translate-x-0 lg:static lg:inset-auto lg:flex-shrink-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-5 flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-900/40">
            <Home className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-bold text-white tracking-tight">Renthub</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          <p className="px-3 pt-2 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-ink-500">
            Menu
          </p>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-900/30'
                    : 'text-ink-400 hover:text-white hover:bg-white/8',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={clsx('w-4 h-4 flex-shrink-0', isActive ? 'text-white' : 'text-ink-500')} />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}

          <div className="pt-3 mt-3 border-t border-white/8">
            <NavLink
              to="/settings"
              onClick={onClose}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-900/30'
                    : 'text-ink-400 hover:text-white hover:bg-white/8',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Settings className={clsx('w-4 h-4 flex-shrink-0', isActive ? 'text-white' : 'text-ink-500')} />
                  <span>Settings</span>
                </>
              )}
            </NavLink>
          </div>
        </nav>

        {/* Footer */}
        <div className="px-5 py-3 flex-shrink-0 border-t border-white/8">
          <p className="text-[11px] text-ink-600">Renthub © {new Date().getFullYear()}</p>
        </div>
      </aside>
    </>
  );
};
