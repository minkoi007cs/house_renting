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

// Handle errors — any 401 means expired/invalid token → notify user then redirect
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const skip = error.config?.headers?.['X-Skip-Auth-Redirect'] === 'true';
    if (error.response?.status === 401 && !skip && window.location.pathname !== '/login') {
      toast.warning('Your session has expired. Please sign in again.', 0);
      useAuthStore.getState().logout();
      setTimeout(() => { window.location.href = '/login'; }, 2000);
    }
    return Promise.reject(error);
  },
);

export default api;
