import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/services/supabase';
import { LogOut } from 'lucide-react';
export const Navbar = () => {
    const { user, logout } = useAuthStore();
    const handleLogout = async () => {
        await supabase.auth.signOut();
        logout();
        window.location.href = '/login';
    };
    return (_jsx("nav", { className: "fixed top-0 w-full bg-white shadow-sm border-b border-gray-200 z-40", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex justify-between items-center h-16", children: [_jsx("div", { className: "flex items-center", children: _jsx("h1", { className: "text-xl font-bold text-primary", children: "\uD83C\uDFE0 Qu\u1EA3n l\u00FD cho thu\u00EA" }) }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("span", { className: "text-sm text-gray-700", children: user?.name || user?.email }), _jsxs("button", { onClick: handleLogout, className: "flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition", children: [_jsx(LogOut, { size: 18 }), _jsx("span", { className: "text-sm", children: "\u0110\u0103ng xu\u1EA5t" })] })] })] }) }) }));
};
