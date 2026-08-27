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
          theme: 'filled_black',
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
    <div className="min-h-screen flex bg-[#0b1222] text-[#f4ede0]">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[440px] bg-[#0b1222] border-r border-[#3d301d] p-12 flex-shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-[#111a2e] border border-[#c9a96e] flex items-center justify-center shadow-[0_0_15px_rgba(201,169,110,0.3)]">
              <Home className="w-5 h-5 text-[#c9a96e]" />
            </div>
            <span className="font-serif font-bold text-xl text-[#f4ede0] tracking-tight">Renthub</span>
          </div>
          <h2 className="font-serif text-3xl font-normal text-[#f4ede0] leading-snug mb-4">
            Manage your rental properties with luxury standards
          </h2>
          <p className="font-sans text-[#f4ede0]/70 text-sm leading-relaxed font-light">
            Everything you need to run your rental portfolio — from properties and tenants to contracts, finances, and reminders.
          </p>
          <div className="mt-10 space-y-4 font-sans">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#111a2e] border border-[#3d301d] flex items-center justify-center flex-shrink-0 text-[#c9a96e]">
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <span className="text-[#f4ede0]/90 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="font-sans text-[#f4ede0]/40 text-xs">© {new Date().getFullYear()} Renthub</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center bg-[#0b1222] p-6">
        <div className="w-full max-w-md bg-[#111a2e] border border-[#3d301d] p-8 md:p-10 rounded-2xl shadow-2xl">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-[#111a2e] border border-[#c9a96e] flex items-center justify-center">
              <Home className="w-5 h-5 text-[#c9a96e]" />
            </div>
            <span className="font-serif font-bold text-xl text-[#f4ede0]">Renthub</span>
          </div>

          <h1 className="font-serif text-3xl font-normal text-[#f4ede0] mb-2">Welcome back</h1>
          <p className="font-sans text-[#f4ede0]/60 text-sm mb-8 font-light">Sign in to your portfolio account to continue</p>

          {error && (
            <div className="mb-6 p-3.5 bg-rose-950/60 border border-rose-800/80 rounded-xl text-rose-400 text-sm font-sans">
              {error}
            </div>
          )}

          <div ref={googleButtonRef} className="w-full min-h-[44px]" />

          <p className="text-center text-[#f4ede0]/40 text-xs mt-8 font-sans">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};
