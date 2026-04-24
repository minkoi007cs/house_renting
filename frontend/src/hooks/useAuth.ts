import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/services/supabase';
import api from '@/services/api';

export const useAuth = () => {
  const { user, token, setUser, setToken, setLoading, setError } = useAuthStore();

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        setLoading(true);
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (session?.access_token) {
          try {
            // Verify token with backend and get JWT
            const response = await api.post('/auth/verify', {}, {
              headers: { Authorization: `Bearer ${session.access_token}` },
            });

            if (mounted) {
              const { data } = response;
              setUser(data.data);
              setToken(data.data.token);
            }
          } catch (error) {
            console.error('Token verification failed:', error);
            if (mounted) setError('Token verification failed');
          }
        }
      } catch (error) {
        if (mounted) {
          setError(error instanceof Error ? error.message : 'Auth error');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT') {
        setUser(null);
        setToken(null);
      }
    });

    return () => {
      mounted = false;
      data?.subscription.unsubscribe();
    };
  }, []);

  return { user, token };
};
