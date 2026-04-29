import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/store/toastStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Single-flight logout: the first 401 triggers the session-expiry flow;
// subsequent 401s from concurrent requests in the same batch are ignored.
let logoutScheduled = false;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const skip = error.config?.headers?.['X-Skip-Auth-Redirect'] === 'true';
    if (
      error.response?.status === 401 &&
      !skip &&
      !logoutScheduled &&
      window.location.pathname !== '/login'
    ) {
      // Verify the token is actually expired before logging out, so a single
      // misbehaving endpoint does not collapse the whole session.
      try {
        await api.get('/auth/profile', { headers: { 'X-Skip-Auth-Redirect': 'true' } });
        // Token is still valid — this was a permission issue, not an auth failure.
      } catch (verifyErr: any) {
        if (verifyErr.response?.status === 401) {
          logoutScheduled = true;
          toast.warning('Your session has expired. Please sign in again.', 0);
          useAuthStore.getState().logout();
          setTimeout(() => { window.location.href = '/login'; }, 2500);
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;
