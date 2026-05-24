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
        <div className="fixed inset-0 bg-ink-900/40 backdrop-blur-xs z-30 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={clsx(
          'fixed inset-y-0 left-0 w-60 bg-ink-900 z-40 flex flex-col transform transition-transform duration-300 ease-out',
          'lg:translate-x-0 lg:static lg:inset-auto lg:flex-shrink-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-6 flex-shrink-0 border-b border-white/5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
            <Home className="w-5 h-5 text-white" />
          </div>
          <span className="text-base font-extrabold text-white tracking-tight flex items-center gap-1.5">
            Renthub <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 pt-2 pb-2 text-[10px] font-bold uppercase tracking-widest text-ink-500">
            Menu
          </p>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]',
                  isActive
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                    : 'text-ink-400 hover:text-white hover:bg-white/8',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={clsx('w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110', isActive ? 'text-white' : 'text-ink-500')} />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}

          <div className="pt-4 mt-4 border-t border-white/5">
            <NavLink
              to="/settings"
              onClick={onClose}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]',
                  isActive
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                    : 'text-ink-400 hover:text-white hover:bg-white/8',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Settings className={clsx('w-5 h-5 flex-shrink-0', isActive ? 'text-white' : 'text-ink-500')} />
                  <span>Settings</span>
                </>
              )}
            </NavLink>
          </div>
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 flex-shrink-0 border-t border-white/5 bg-ink-950/40">
          <p className="text-[10px] font-medium text-ink-600">Renthub App © {new Date().getFullYear()}</p>
        </div>
      </aside>
    </>
  );
};
