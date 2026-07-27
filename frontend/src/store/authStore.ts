import { create } from 'zustand';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthChecked: boolean;
  error: string | null;

  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  updateTokens: (token: string, refreshToken: string) => void;
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

const getInitialRefreshToken = () => {
  try {
    return localStorage.getItem('auth_refresh_token');
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: getInitialUser(),
  token: getInitialToken(),
  refreshToken: getInitialRefreshToken(),
  isLoading: false,
  isAuthChecked: false,
  error: null,

  setUser: (user) => {
    if (user) {
      localStorage.setItem('auth_user', JSON.stringify(user));
      const activeOwnerId = localStorage.getItem('active_workspace_owner_id');
      if (!activeOwnerId) {
        localStorage.setItem('active_workspace_currency', user.currency || 'USD');
      }
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
  setRefreshToken: (token) => {
    if (token) {
      localStorage.setItem('auth_refresh_token', token);
    } else {
      localStorage.removeItem('auth_refresh_token');
    }
    set({ refreshToken: token });
  },
  // Silently rotate both tokens without triggering isAuthChecked reset
  updateTokens: (token, refreshToken) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_refresh_token', refreshToken);
    set({ token, refreshToken });
  },
  setLoading: (isLoading) => set({ isLoading }),
  setAuthChecked: (isAuthChecked) => set({ isAuthChecked }),
  setError: (error) => set({ error }),
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_refresh_token');
    localStorage.removeItem('auth_user');
    set({ user: null, token: null, refreshToken: null, isAuthChecked: true });
  },
}));
