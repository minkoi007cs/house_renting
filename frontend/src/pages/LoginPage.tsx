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
  const { setUser, setToken, setError } = useAuthStore();
  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Google Sign-In button
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
  }, []);

  const handleGoogleResponse = async (response: any) => {
    try {
      if (!response.credential) {
        throw new Error('No credential received');
      }

      // Send ID token to backend
      const result = await api.post('/auth/google', {
        idToken: response.credential,
      });

      if (result.data.status === 'success') {
        setUser(result.data.data);
        setToken(result.data.data.token);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(
        error instanceof Error ? error.message : 'Google login failed',
      );
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

        <div ref={googleButtonRef} className="w-full"></div>

        <p className="text-center text-gray-600 text-sm mt-6">
          Bằng cách đăng nhập, bạn đồng ý với Điều khoản dịch vụ của chúng tôi
        </p>
      </div>
    </div>
  );
};
