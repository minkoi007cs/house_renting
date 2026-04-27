import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Building2, Users, TrendingUp } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import api from '@/services/api';

declare global {
  interface Window { google: any; }
}

const features = [
  { icon: Building2, text: 'Manage properties & units' },
  { icon: Users, text: 'Track tenants & contracts' },
  { icon: TrendingUp, text: 'Income & expense reports' },
];

export const LoginPage = () => {
  const navigate = useNavigate();
  const { token, setUser, setToken, setError, error } = useAuthStore();
  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (token) navigate('/dashboard', { replace: true });
  }, [token, navigate]);

  useEffect(() => {
    const initGoogle = () => {
      if (window.google && googleButtonRef.current) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'signin_with',
          shape: 'rectangular',
        });
      }
    };

    if (window.google) {
      initGoogle();
    } else {
      const script = document.getElementById('google-gsi');
      if (script) {
        script.addEventListener('load', initGoogle);
        return () => script.removeEventListener('load', initGoogle);
      }
    }
  }, []);

  const handleGoogleResponse = async (response: any) => {
    try {
      setError(null);
      if (!response.credential) throw new Error('No credential received');
      const result = await api.post('/auth/google', { idToken: response.credential });
      if (result.data?.status === 'success') {
        const { userId, email, name, token: jwt } = result.data.data;
        setUser({ id: userId, email, name });
        setToken(jwt);
        navigate('/dashboard', { replace: true });
      } else {
        throw new Error('Unexpected server response');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || (err instanceof Error ? err.message : 'Login failed');
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] bg-ink-900 p-10 flex-shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg">Renthub</span>
          </div>
          <h2 className="text-3xl font-bold text-white leading-snug mb-4">
            Manage your rental properties with ease
          </h2>
          <p className="text-ink-400 text-sm leading-relaxed">
            Everything you need to run your rental business — from properties and tenants to contracts, finances, and reminders.
          </p>
          <div className="mt-8 space-y-3">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-brand-400" />
                </div>
                <span className="text-ink-300 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-ink-600 text-xs">© {new Date().getFullYear()} Renthub</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center bg-ink-50 p-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-ink-900">Renthub</span>
          </div>

          <h1 className="text-2xl font-bold text-ink-900 mb-1">Welcome back</h1>
          <p className="text-ink-400 text-sm mb-8">Sign in to your account to continue</p>

          {error && (
            <div className="mb-5 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm">
              {error}
            </div>
          )}

          <div ref={googleButtonRef} className="w-full" />

          <p className="text-center text-ink-400 text-xs mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};
