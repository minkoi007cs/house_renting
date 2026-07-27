import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/store/toastStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  const workspaceOwnerId = localStorage.getItem('active_workspace_owner_id');
  if (workspaceOwnerId) config.headers['x-workspace-owner-id'] = workspaceOwnerId;
  return config;
});

// Token refresh state — module-level so it persists across interceptor calls
let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const flushQueue = (token: string) => {
  pendingQueue.forEach(({ resolve }) => resolve(token));
  pendingQueue = [];
};

const drainQueue = (err: unknown) => {
  pendingQueue.forEach(({ reject }) => reject(err));
  pendingQueue = [];
};

let logoutScheduled = false;

const triggerLogout = () => {
  if (logoutScheduled) return;
  logoutScheduled = true;
  toast.warning('Your session has expired. Please sign in again.', 0);
  useAuthStore.getState().logout();
  setTimeout(() => {
    logoutScheduled = false;
    window.location.href = '/login';
  }, 2500);
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const skip = originalRequest?.headers?.['X-Skip-Auth-Redirect'] === 'true';

    if (
      error.response?.status !== 401 ||
      skip ||
      window.location.pathname === '/login'
    ) {
      return Promise.reject(error);
    }

    // Already retried — give up
    if ((originalRequest as any)._retry) {
      return Promise.reject(error);
    }

    // Another refresh is in flight — queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({
          resolve: (token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    (originalRequest as any)._retry = true;
    isRefreshing = true;

    const storedRefreshToken = localStorage.getItem('auth_refresh_token');

    if (!storedRefreshToken) {
      isRefreshing = false;
      drainQueue(error);
      triggerLogout();
      return Promise.reject(error);
    }

    try {
      const res = await api.post(
        '/auth/refresh',
        { refreshToken: storedRefreshToken },
        { headers: { 'X-Skip-Auth-Redirect': 'true' } },
      );
      const { accessToken, refreshToken: newRefreshToken } = res.data.data;
      useAuthStore.getState().updateTokens(accessToken, newRefreshToken || storedRefreshToken);
      flushQueue(accessToken);
      isRefreshing = false;
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return api(originalRequest);
    } catch (refreshErr) {
      isRefreshing = false;
      drainQueue(refreshErr);
      triggerLogout();
      return Promise.reject(refreshErr);
    }
  },
);

export default api;
