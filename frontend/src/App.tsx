import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { PageLoader } from '@/components/common/Spinner';

const LoginPage = lazy(() => import('@/pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const DashboardPage = lazy(() => import('@/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const PropertiesPage = lazy(() => import('@/pages/PropertiesPage').then((m) => ({ default: m.PropertiesPage })));
const PropertyDetailPage = lazy(() => import('@/pages/PropertyDetailPage').then((m) => ({ default: m.PropertyDetailPage })));
const TenantsPage = lazy(() => import('@/pages/TenantsPage').then((m) => ({ default: m.TenantsPage })));
const ContractsPage = lazy(() => import('@/pages/ContractsPage').then((m) => ({ default: m.ContractsPage })));
const TransactionsPage = lazy(() => import('@/pages/TransactionsPage').then((m) => ({ default: m.TransactionsPage })));
const RemindersPage = lazy(() => import('@/pages/RemindersPage').then((m) => ({ default: m.RemindersPage })));
const ReportsPage = lazy(() => import('@/pages/ReportsPage').then((m) => ({ default: m.ReportsPage })));
const SettingsPage = lazy(() => import('@/pages/SettingsPage').then((m) => ({ default: m.SettingsPage })));

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuthStore();
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const wrap = (el: React.ReactNode) => <ProtectedRoute>{el}</ProtectedRoute>;

export function App() {
  return (
    <Router>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><PageLoader /></div>}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<LoginPage />} />
          <Route path="/dashboard" element={wrap(<DashboardPage />)} />
          <Route path="/properties" element={wrap(<PropertiesPage />)} />
          <Route path="/properties/:id" element={wrap(<PropertyDetailPage />)} />
          <Route path="/tenants" element={wrap(<TenantsPage />)} />
          <Route path="/contracts" element={wrap(<ContractsPage />)} />
          <Route path="/transactions" element={wrap(<TransactionsPage />)} />
          <Route path="/reminders" element={wrap(<RemindersPage />)} />
          <Route path="/reports" element={wrap(<ReportsPage />)} />
          <Route path="/settings" element={wrap(<SettingsPage />)} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
