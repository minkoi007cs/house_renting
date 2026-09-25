import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  Building2,
  Users,
  Wallet,
  Bell,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  X,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthStore } from '@/store/authStore';
import heroImage from '@/assets/luxury-hero.jpg';

interface FeatureHighlight {
  icon: typeof Building2;
  title: string;
  desc: string;
}

const APP_FEATURES: FeatureHighlight[] = [
  {
    icon: Building2,
    title: 'Multi-Property & Unit Management',
    desc: 'Organize houses, apartments, and room units with custom pricing, amenities, and image galleries.',
  },
  {
    icon: Users,
    title: 'Tenant & Lease Tracking',
    desc: 'Keep complete renter profiles, emergency contacts, identity documents, and lease terms in one place.',
  },
  {
    icon: Wallet,
    title: 'Rent & Expense Bookkeeping',
    desc: 'Log rent payments via Zelle, Venmo, ACH, and cash while tracking maintenance costs and cashflow.',
  },
  {
    icon: Bell,
    title: 'Automated Expiry & Rent Reminders',
    desc: 'Never miss an overdue rent payment or contract renewal with smart scheduled reminders.',
  },
  {
    icon: BarChart3,
    title: 'Financial & Occupancy Analytics',
    desc: 'Real-time profit & loss breakdowns, occupancy rates, and exportable financial reports.',
  },
  {
    icon: ShieldCheck,
    title: 'Multi-Workspace Collaboration',
    desc: 'Share property access with co-hosts, partners, or property managers securely.',
  },
];

export const LoginPage = () => {
  const navigate = useNavigate();
  const { signInWithGoogle, isLoading: isAuthLoading } = useAuth();
  const { token, setUser, setToken, setError, error } = useAuthStore();
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    if (token) navigate('/dashboard', { replace: true });
  }, [token, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      setError(null);
      await signInWithGoogle();
    } catch (err: any) {
      const msg = err?.message || 'Không thể đăng nhập bằng tài khoản Google. Vui lòng thử lại.';
      setError(msg);
      setIsSigningIn(false);
    }
  };

  // Demo access for preview and evaluation
  const handleDemoLogin = async () => {
    try {
      setError(null);
      const demoUser = {
        id: 'demo-user-id',
        email: 'landlord.demo@renthub.app',
        name: 'Alex Harrison (Demo Owner)',
      };
      setUser(demoUser);
      setToken('demo-jwt-token-' + Date.now());
      navigate('/dashboard', { replace: true });
    } catch {
      setError('Unable to initialize demo session.');
    }
  };

  return (
    <div className="min-h-screen bg-[#070d18] text-[#f4ede0] font-sans flex flex-col justify-between selection:bg-[#c9a96e] selection:text-[#070d18] relative overflow-hidden">
      {/* Right-Side Full-Bleed Background Image with Seamless Gradient Fade */}
      <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[55%] pointer-events-none z-0 overflow-hidden">
        <img
          src={heroImage}
          alt="Luxury Modern Rental Architecture"
          className="w-full h-full object-cover object-center transform scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070d18] via-[#070d18]/90 lg:via-[#070d18]/40 to-transparent" />
        <div className="hidden lg:block absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-[#070d18] to-transparent" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#070d18] via-[#070d18]/80 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#070d18] via-[#070d18]/80 to-transparent" />
      </div>

      {/* Top Navigation Bar */}
      <header className="w-full px-6 md:px-12 lg:px-16 py-4 flex items-center justify-between border-b border-[#3d301d]/40 z-20 backdrop-blur-md bg-[#070d18]/80 sticky top-0">
        {/* Brand Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setShowFeaturesModal(false)}
        >
          <div className="w-9 h-9 rounded-xl bg-[#111a2e] border border-[#c9a96e]/70 flex items-center justify-center shadow-[0_0_18px_rgba(201,169,110,0.25)] transition-transform hover:scale-105">
            <Home className="w-4.5 h-4.5 text-[#c9a96e]" />
          </div>
          <div>
            <span className="font-sans font-bold text-base tracking-tight text-[#f4ede0] flex items-center gap-1.5">
              Renthub <span className="w-1.5 h-1.5 rounded-full bg-[#c9a96e] animate-pulse"></span>
            </span>
            <span className="text-[9px] text-[#c9a96e] tracking-[0.2em] uppercase font-mono block -mt-0.5">
              Rental Property Management
            </span>
          </div>
        </div>

        {/* Center Nav Links - Desktop */}
        <nav className="hidden lg:flex items-center gap-8 text-xs uppercase tracking-[0.18em] text-[#f4ede0]/70 font-medium">
          <button
            onClick={() => setShowFeaturesModal(true)}
            className="hover:text-[#c9a96e] transition-colors py-1 cursor-pointer"
          >
            Properties & Units
          </button>
          <button
            onClick={() => setShowFeaturesModal(true)}
            className="hover:text-[#c9a96e] transition-colors py-1 cursor-pointer"
          >
            Tenants & Leases
          </button>
          <button
            onClick={() => setShowFeaturesModal(true)}
            className="hover:text-[#c9a96e] transition-colors py-1 cursor-pointer"
          >
            Rent & Finance
          </button>
          <button
            onClick={() => setShowFeaturesModal(true)}
            className="hover:text-[#c9a96e] transition-colors py-1 cursor-pointer"
          >
            Reminders
          </button>
        </nav>

        {/* Right Action */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFeaturesModal(true)}
            className="px-3.5 py-1.5 rounded-xl text-xs uppercase tracking-wider font-semibold border border-[#3d301d] bg-[#111a2e]/80 text-[#f4ede0] hover:border-[#c9a96e] hover:text-[#c9a96e] transition-all duration-200 cursor-pointer shadow-sm"
          >
            App Features
          </button>
        </div>
      </header>

      {/* Main Hero & Login Content */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-16 py-8 lg:py-14 flex items-center">
        <div className="w-full lg:w-[540px]">
          {/* Category / Badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className="h-px w-6 bg-[#c9a96e]/60 inline-block" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#c9a96e]">
              Smart Rental Management Platform
            </p>
          </div>

          {/* Editorial Serif Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-[60px] font-normal leading-[1.06] text-[#f4ede0] tracking-tight mb-5">
            Smart Rental
            <br />
            Management,
            <br />
            Elevated.
          </h1>

          {/* Description */}
          <p className="text-[#f4ede0]/75 font-light text-sm sm:text-base leading-relaxed mb-6 max-w-lg">
            Renthub brings effortless management to landlords and property managers — contracts,
            rent collection (Zelle/Venmo), tenant tracking, and real-time financial insights in
            one elegant workspace.
          </p>

          {/* Client Portal / Google Login Box */}
          <div className="bg-[#111a2e]/90 border border-[#3d301d] p-5 sm:p-6 rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl max-w-lg mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#c9a96e]/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif text-base font-normal text-[#f4ede0]">Landlord Portal</h3>
                <p className="text-xs text-[#f4ede0]/60 font-light mt-0.5">
                  Sign in with Google to manage your properties & tenants
                </p>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#070d18] border border-[#3d301d] text-[10px] uppercase tracking-wider text-[#c9a96e]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Supabase Auth</span>
              </div>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="mb-4 p-3 bg-rose-950/60 border border-rose-800/80 rounded-xl text-rose-300 text-xs font-sans leading-relaxed">
                {error}
              </div>
            )}

            {/* Google Sign-In Button */}
            <div className="space-y-3">
              <button
                onClick={handleGoogleSignIn}
                disabled={isSigningIn || isAuthLoading}
                className="w-full py-3 px-4 rounded-xl font-medium text-sm bg-white text-gray-900 hover:bg-gray-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{isSigningIn ? 'Đang chuyển hướng Google...' : 'Đăng nhập bằng Google'}</span>
              </button>

              {/* Instant Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  onClick={handleDemoLogin}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider bg-[#c9a96e] text-[#070d18] hover:bg-[#d6b87e] hover:shadow-[0_0_25px_rgba(201,169,110,0.35)] transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Instant Demo Tour</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  onClick={() => setShowFeaturesModal(true)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider bg-[#070d18] text-[#f4ede0] border border-[#3d301d] hover:border-[#c9a96e] hover:text-[#c9a96e] transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>App Features</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p className="text-[10px] text-[#f4ede0]/40 text-center mt-3">
              Single Sign-On powered by Supabase Auth (Google Provider). Multi-tenant secure workspace.
            </p>
          </div>

          {/* Minimal Brand Credential */}
          <div className="pt-2 flex items-center gap-3 text-[11px] text-[#f4ede0]/50 font-mono tracking-widest">
            <span className="h-px w-8 bg-[#c9a96e]/50 inline-block" />
            <span>RENTHUB · SMART PROPERTY & RENTAL SYSTEM</span>
          </div>
        </div>
      </main>

      {/* Editorial Footer Bottom Bar */}
      <footer className="w-full px-6 md:px-12 lg:px-16 py-4 border-t border-[#3d301d]/40 flex flex-col sm:flex-row items-center justify-between text-xs text-[#f4ede0]/40 font-light gap-3 z-20 bg-[#070d18]/90 backdrop-blur-md">
        <div className="flex items-center gap-6">
          <span>© {new Date().getFullYear()} Renthub Suite. All rights reserved.</span>
          <span className="hidden md:inline text-[#3d301d]">|</span>
          <span className="hidden md:inline">Smart Property & Tenant Management Application</span>
        </div>
        <div className="flex items-center gap-6 text-[11px] tracking-wider uppercase">
          <button
            onClick={() => setShowFeaturesModal(true)}
            className="hover:text-[#c9a96e] transition-colors cursor-pointer"
          >
            Documentation
          </button>
          <span className="hover:text-[#c9a96e] transition-colors cursor-pointer">Privacy</span>
          <span className="hover:text-[#c9a96e] transition-colors cursor-pointer">Terms</span>
        </div>
      </footer>

      {/* App Features & Capabilities Modal */}
      {showFeaturesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#070d18]/90 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-[#111a2e] border border-[#3d301d] rounded-3xl p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.9)] max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowFeaturesModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-[#070d18] border border-[#3d301d] text-[#f4ede0]/70 hover:text-[#c9a96e] hover:border-[#c9a96e] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#c9a96e] font-semibold">
                Renthub Management Suite
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#f4ede0] font-normal mt-1">
                Everything you need to manage rental properties
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {APP_FEATURES.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-[#3d301d] p-4 bg-[#070d18]/80 hover:border-[#c9a96e]/60 transition-all duration-200"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#111a2e] border border-[#3d301d] flex items-center justify-center text-[#c9a96e] mb-3">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="font-sans font-semibold text-sm text-[#f4ede0] mb-1">{title}</h3>
                  <p className="text-xs text-[#f4ede0]/70 font-light leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-[#3d301d] flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-[#f4ede0]/60">
                Ready to take control of your rental portfolio?
              </p>
              <button
                onClick={() => {
                  setShowFeaturesModal(false);
                  handleDemoLogin();
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#c9a96e] text-[#070d18] font-semibold text-xs uppercase tracking-wider hover:bg-[#d6b87e] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <span>Launch Demo Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
