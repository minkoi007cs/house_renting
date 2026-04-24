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

        // Check if we already have a valid JWT token
        const existingToken = localStorage.getItem('auth_token');
        if (existingToken) {
          // Token exists, skip verification for now
          setLoading(false);
          return;
        }

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

            if (mounted && response.data.status === 'success') {
              const { data } = response;
              setUser(data.data);
              setToken(data.data.token);
            }
          } catch (error) {
            console.error('Token verification failed:', error);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
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
