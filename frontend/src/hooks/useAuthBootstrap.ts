import { useEffect } from 'react';
import api from '@/services/api';
import { useAuthStore } from '@/store/authStore';

export const useAuthBootstrap = () => {
  const {
    token,
    isAuthChecked,
    setAuthChecked,
    setLoading,
    setUser,
    logout,
  } = useAuthStore();

  useEffect(() => {
    let cancelled = false;

    const verifySession = async () => {
      if (!token) {
        setAuthChecked(true);
        return;
      }

      try {
        setLoading(true);
        const res = await api.get('/auth/profile', {
          headers: {
            'X-Skip-Auth-Redirect': 'true',
          },
        });

        if (!cancelled) {
          setUser(res.data.data);
          setAuthChecked(true);
        }
      } catch {
        if (!cancelled) {
          logout();
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (!isAuthChecked) {
      verifySession();
    }

    return () => {
      cancelled = true;
    };
  }, [token, isAuthChecked, logout, setAuthChecked, setLoading, setUser]);
};
