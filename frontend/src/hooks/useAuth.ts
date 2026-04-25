import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export const useAuth = () => {
  const { user, token } = useAuthStore();

  useEffect(() => {
    // Restore auth state from localStorage on mount (already done in store init)
    // No Supabase dependency — using custom Google + backend JWT flow
  }, []);

  return { user, token };
};
