import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import api from '@/services/api';

declare global {
  interface Window {
    google: any;
  }
}

export const LoginPage = () => {
  const navigate = useNavigate();
  const { token, setUser, setToken, setError, error } = useAuthStore();
  const googleButtonRef = useRef<HTMLDivElement>(null);

  // Already logged in → go to dashboard
  useEffect(() => {
    if (token) {
      navigate('/dashboard', { replace: true });
    }
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
        });
      }
    };

    // GSI script might not be ready yet
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

      if (!response.credential) {
        throw new Error('Không nhận được credential từ Google');
      }

      const result = await api.post('/auth/google', {
        idToken: response.credential,
      });

      if (result.data?.status === 'success') {
        const { userId, email, name, token: jwt } = result.data.data;
        setUser({ id: userId, email, name });
        setToken(jwt);
        navigate('/dashboard', { replace: true });
      } else {
        throw new Error('Backend trả về lỗi không xác định');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const msg =
        err?.response?.data?.message ||
        (err instanceof Error ? err.message : 'Đăng nhập thất bại');
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">🏠</h1>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý Cho Thuê Nhà</h2>
          <p className="text-gray-600 mt-2">Quản lý bất động sản của bạn một cách dễ dàng</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div ref={googleButtonRef} className="w-full"></div>

        <p className="text-center text-gray-600 text-sm mt-6">
          Bằng cách đăng nhập, bạn đồng ý với Điều khoản dịch vụ của chúng tôi
        </p>
      </div>
    </div>
  );
};
