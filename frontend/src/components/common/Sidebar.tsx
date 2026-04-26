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
  { to: '/transactions', label: 'Transactions', icon: Wallet },
  { to: '/reminders', label: 'Reminders', icon: Bell },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export const Sidebar = ({ open, onClose }: Props) => {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-ink-900/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={clsx(
          'fixed inset-y-0 left-0 w-64 bg-white border-r border-ink-200 z-40 transform transition-transform duration-200 ease-in-out',
          'lg:translate-x-0 lg:static lg:inset-auto lg:flex-shrink-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="h-16 flex items-center gap-2 px-6 border-b border-ink-200">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <Home className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-ink-900">Renthub</span>
        </div>

        <nav className="p-3 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition',
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900',
                )
              }
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-ink-200">
          <p className="text-xs text-ink-400 text-center">
            Renthub © {new Date().getFullYear()}
          </p>
        </div>
      </aside>
    </>
  );
};
