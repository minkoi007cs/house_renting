import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-50 p-6">
      <div className="text-center space-y-5 max-w-sm">
        <p className="text-8xl font-extrabold text-ink-150 select-none">404</p>
        <div>
          <h1 className="text-xl font-bold text-ink-900">Page not found</h1>
          <p className="mt-1 text-sm text-ink-500">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate(-1)} className="btn-secondary">
            <ArrowLeft className="w-4 h-4" /> Go back
          </button>
          <button onClick={() => navigate('/dashboard')} className="btn-primary">
            <Home className="w-4 h-4" /> Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
