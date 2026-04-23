import { create } from 'zustand';
export const useAuthStore = create((set) => ({
    user: null,
    token: localStorage.getItem('auth_token'),
    isLoading: false,
    error: null,
    setUser: (user) => set({ user }),
    setToken: (token) => {
        if (token) {
            localStorage.setItem('auth_token', token);
        }
        else {
            localStorage.removeItem('auth_token');
        }
        set({ token });
    },
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
    logout: () => {
        localStorage.removeItem('auth_token');
        set({ user: null, token: null });
    },
}));
