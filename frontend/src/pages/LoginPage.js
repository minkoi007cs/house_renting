import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/services/supabase';
export const LoginPage = () => {
    const navigate = useNavigate();
    const { token } = useAuthStore();
    useEffect(() => {
        if (token) {
            navigate('/dashboard');
        }
    }, [token, navigate]);
    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error)
                throw error;
        }
        catch (error) {
            console.error('Login error:', error);
        }
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100", children: _jsxs("div", { className: "max-w-md w-full bg-white rounded-lg shadow-lg p-8", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h1", { className: "text-4xl font-bold text-primary mb-2", children: "\uD83C\uDFE0" }), _jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Qu\u1EA3n l\u00FD Cho Thu\u00EA Nh\u00E0" }), _jsx("p", { className: "text-gray-600 mt-2", children: "Qu\u1EA3n l\u00FD b\u1EA5t \u0111\u1ED9ng s\u1EA3n c\u1EE7a b\u1EA1n m\u1ED9t c\u00E1ch d\u1EC5 d\u00E0ng" })] }), _jsxs("button", { onClick: handleGoogleLogin, className: "w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition", children: [_jsxs("svg", { className: "w-5 h-5", viewBox: "0 0 24 24", children: [_jsx("path", { fill: "currentColor", d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" }), _jsx("path", { fill: "currentColor", d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" }), _jsx("path", { fill: "currentColor", d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" }), _jsx("path", { fill: "currentColor", d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" })] }), "\u0110\u0103ng nh\u1EADp v\u1EDBi Google"] }), _jsx("p", { className: "text-center text-gray-600 text-sm mt-6", children: "B\u1EB1ng c\u00E1ch \u0111\u0103ng nh\u1EADp, b\u1EA1n \u0111\u1ED3ng \u00FD v\u1EDBi \u0110i\u1EC1u kho\u1EA3n d\u1ECBch v\u1EE5 c\u1EE7a ch\u00FAng t\u00F4i" })] }) }));
};
