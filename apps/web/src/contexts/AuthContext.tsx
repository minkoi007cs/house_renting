import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/utils/supabaseClient';
import { useAuthStore } from '@/store/authStore';

interface AuthContextValue {
  session: Session | null;
  user: SupabaseUser | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setUser, setToken, setAuthChecked, logout } = useAuthStore();

  useEffect(() => {
    // 1. Initial session load
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s) {
        setToken(s.access_token);
        setUser({
          id: s.user.id,
          email: s.user.email || '',
          name: s.user.user_metadata?.full_name || s.user.user_metadata?.name || s.user.email?.split('@')[0] || 'User',
          avatar_url: s.user.user_metadata?.avatar_url || null,
        });
      }
      setAuthChecked(true);
      setIsLoading(false);
    });

    // 2. Reactive Auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s) {
        setToken(s.access_token);
        setUser({
          id: s.user.id,
          email: s.user.email || '',
          name: s.user.user_metadata?.full_name || s.user.user_metadata?.name || s.user.email?.split('@')[0] || 'User',
          avatar_url: s.user.user_metadata?.avatar_url || null,
        });
        setAuthChecked(true);
      } else {
        // Only logout if not a demo session
        const currentToken = localStorage.getItem('auth_token');
        if (!currentToken?.startsWith('demo-jwt-token')) {
          logout();
        }
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setToken, setAuthChecked, logout]);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    logout();
  };

  const user = session?.user ?? null;

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isLoading,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}
