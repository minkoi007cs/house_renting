import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/services/supabase';
import api from '@/services/api';

export const useAuth = () => {
  const { user, token, setUser, setToken, setLoading, setError } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.access_token) {
          // Verify token with backend and get JWT
          const response = await api.post('/auth/verify', {}, {
            headers: { Authorization: `Bearer ${session.access_token}` },
          });

          const { data } = response;
          setUser(data.data);
          setToken(data.data.token);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Auth error');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setToken(null);
      }
    });

    return () => {
      data?.subscription.unsubscribe();
    };
  }, []);

  return { user, token };
};
