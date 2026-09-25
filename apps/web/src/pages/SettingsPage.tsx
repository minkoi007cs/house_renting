import { useState } from 'react';
import { User, Mail, LogOut, Shield, Save } from 'lucide-react';
import { Layout } from '@/components/common/Layout';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { WorkspaceSharing } from '@/components/settings/WorkspaceSharing';

export const SettingsPage = () => {
  const { user, setUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [currency, setCurrency] = useState(user?.currency || 'USD');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      const res = await api.patch('/users/profile', { name, currency });
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
      <div className="max-w-2xl space-y-5 font-sans">
        {/* Profile */}
        <div className="card p-6">
          <h2 className="font-serif text-xl font-normal text-[#f4ede0] mb-5 flex items-center gap-2">
            <User className="w-5 h-5 text-[#c9a96e]" /> Profile
          </h2>

          <div className="flex items-center gap-5 mb-6">
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover border border-[#c9a96e]"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#c9a96e] text-[#0b1222] flex items-center justify-center text-xl font-serif font-bold">
                {initials}
              </div>
            )}
            <div>
              <p className="font-semibold text-lg text-[#f4ede0]">{user?.name}</p>
              <p className="text-xs text-[#f4ede0]/60 flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-[#c9a96e]" /> {user?.email}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-950/60 border border-rose-800/80 rounded-xl text-rose-400 text-sm">
                {error}
              </div>
            )}
            {saved && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-emerald-400 text-sm">
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
              <label className="label">Workspace Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="input cursor-pointer"
              >
                <option value="VND">VND (₫)</option>
                <option value="USD">USD ($)</option>
              </select>
              <p className="mt-1 text-xs text-[#f4ede0]/50">
                This currency will apply globally to your workspace, including other members viewing it.
              </p>
            </div>

            <div>
              <label className="label">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="input bg-[#0b1222] text-[#f4ede0]/40 border-[#3d301d] cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-[#f4ede0]/40">Email is managed by your Google account.</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSave}
                disabled={saving || (name === user?.name && currency === user?.currency)}
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
          <h2 className="font-serif text-xl font-normal text-[#f4ede0] mb-5 flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#c9a96e]" /> Account
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-[#3d301d]">
              <div>
                <p className="text-sm font-medium text-[#f4ede0]">Authentication</p>
                <p className="text-xs text-[#f4ede0]/50 mt-0.5">Signed in with Google OAuth</p>
              </div>
              <span className="badge-green">Active</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-[#f4ede0]">Member since</p>
                <p className="text-xs text-[#f4ede0]/50 mt-0.5">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Workspace Sharing & Collaborators */}
        <WorkspaceSharing />

        {/* Danger zone */}
        <div className="card p-6 border-rose-900/60">
          <h2 className="font-serif text-xl font-normal text-rose-400 mb-5 flex items-center gap-2">
            <LogOut className="w-5 h-5 text-rose-400" /> Session
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#f4ede0]">Sign out</p>
              <p className="text-xs text-[#f4ede0]/50 mt-0.5">You'll be redirected to the login page.</p>
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
