import { useAuthStore } from '@/store/authStore';
import { LogOut } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <nav className="fixed top-0 w-full bg-white shadow-sm border-b border-gray-200 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-primary">🏠 Quản lý cho thuê</h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">{user?.name || user?.email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              <LogOut size={18} />
              <span className="text-sm">Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
