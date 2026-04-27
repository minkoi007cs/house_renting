import { useState } from 'react';
import { User, Mail, LogOut, Shield, Bell, Moon, Save } from 'lucide-react';
import { Layout } from '@/components/common/Layout';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';

export const SettingsPage = () => {
  const { user, setUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      const res = await api.patch('/users/profile', { name });
      setUser(res.data.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = (user?.name || 'U')
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <Layout title="Settings">
      <div className="max-w-2xl space-y-5">
        {/* Profile */}
        <div className="card p-6">
          <h2 className="font-semibold text-ink-900 mb-5 flex items-center gap-2">
            <User className="w-4 h-4 text-ink-400" /> Profile
          </h2>

          <div className="flex items-center gap-5 mb-6">
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xl font-bold">
                {initials}
              </div>
            )}
            <div>
              <p className="font-semibold text-ink-900">{user?.name}</p>
              <p className="text-sm text-ink-500 flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5" /> {user?.email}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}
            {saved && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm">
                Changes saved successfully.
              </div>
            )}

            <div>
              <label className="label">Display name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="label">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="input bg-ink-50 text-ink-400 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-ink-400">Email is managed by your Google account.</p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving || name === user?.name}
                className="btn-primary"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </div>
        </div>

        {/* Account */}
        <div className="card p-6">
          <h2 className="font-semibold text-ink-900 mb-5 flex items-center gap-2">
            <Shield className="w-4 h-4 text-ink-400" /> Account
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-ink-100">
              <div>
                <p className="text-sm font-medium text-ink-900">Authentication</p>
                <p className="text-xs text-ink-500 mt-0.5">Signed in with Google OAuth</p>
              </div>
              <span className="badge-green">Active</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-ink-900">Member since</p>
                <p className="text-xs text-ink-500 mt-0.5">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Danger zone */}
        <div className="card p-6 border-rose-100">
          <h2 className="font-semibold text-rose-600 mb-5 flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Session
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-ink-900">Sign out</p>
              <p className="text-xs text-ink-500 mt-0.5">You'll be redirected to the login page.</p>
            </div>
            <button onClick={handleLogout} className="btn-danger">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};
