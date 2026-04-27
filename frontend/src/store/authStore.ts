import { create } from 'zustand';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthChecked: boolean;
  error: string | null;

  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setAuthChecked: (isAuthChecked: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

const getInitialUser = () => {
  try {
    const user = localStorage.getItem('auth_user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const getInitialToken = () => {
  try {
    return localStorage.getItem('auth_token');
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: getInitialUser(),
  token: getInitialToken(),
  isLoading: false,
  isAuthChecked: false,
  error: null,

  setUser: (user) => {
    if (user) {
      localStorage.setItem('auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('auth_user');
    }
    set({ user });
  },
  setToken: (token) => {
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
    set({ token, isAuthChecked: false });
  },
  setLoading: (isLoading) => set({ isLoading }),
  setAuthChecked: (isAuthChecked) => set({ isAuthChecked }),
  setError: (error) => set({ error }),
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    set({ user: null, token: null, isAuthChecked: true });
  },
}));
