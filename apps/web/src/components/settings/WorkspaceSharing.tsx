import { useState, useEffect } from 'react';
import { Mail, Share2, Shield, Eye, Edit3, Trash2, Check, X, RefreshCw } from 'lucide-react';
import api from '@/services/api';
import { toast } from '@/store/toastStore';

interface Invitation {
  id: string;
  invitee_email: string;
  role: 'viewer' | 'editor';
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  invitee?: {
    email: string;
    name: string | null;
    avatar_url: string | null;
  };
  inviter?: {
    id: string;
    email: string;
    name: string | null;
    avatar_url: string | null;
  };
}

export const WorkspaceSharing = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'viewer' | 'editor'>('viewer');
  const [sending, setSending] = useState(false);
  
  const [sentInvites, setSentInvites] = useState<Invitation[]>([]);
  const [receivedInvites, setReceivedInvites] = useState<Invitation[]>([]);
  
  const [loadingSent, setLoadingSent] = useState(false);
  const [loadingReceived, setLoadingReceived] = useState(false);

  const fetchSent = async () => {
    try {
      setLoadingSent(true);
      const res = await api.get('/users/invitations/sent');
      setSentInvites(res.data.data);
    } catch (err: any) {
      console.error('Failed to fetch sent invitations', err);
    } finally {
      setLoadingSent(false);
    }
  };

  const fetchReceived = async () => {
    try {
      setLoadingReceived(true);
      const res = await api.get('/users/invitations/received');
      setReceivedInvites(res.data.data);
    } catch (err: any) {
      console.error('Failed to fetch received invitations', err);
    } finally {
      setLoadingReceived(false);
    }
  };

  const loadAll = () => {
    fetchSent();
    fetchReceived();
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setSending(true);
      await api.post('/users/invitations/invite', {
        email: email.trim().toLowerCase(),
        role,
      });
      toast.success(`Successfully invited ${email}!`);
      setEmail('');
      fetchSent();
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to send invitation';
      toast.error(msg);
    } finally {
      setSending(false);
    }
  };

  const handleAccept = async (id: string, inviterName: string) => {
    try {
      await api.post(`/users/invitations/${id}/accept`);
      toast.success(`Accepted invitation to join ${inviterName || 'user'}'s workspace!`);
      loadAll();
      // Trigger a window event so the workspace switcher updates its options immediately
      window.dispatchEvent(new Event('workspace-list-updated'));
    } catch (err: any) {
      toast.error('Failed to accept invitation');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await api.post(`/users/invitations/${id}/reject`);
      toast.success('Rejected invitation successfully.');
      loadAll();
    } catch (err: any) {
      toast.error('Failed to reject invitation');
    }
  };

  const handleDelete = async (id: string, label: string) => {
    if (!window.confirm(`Are you sure you want to ${label}?`)) return;

    try {
      await api.delete(`/users/invitations/${id}`);
      toast.success('Invitation removed successfully.');
      loadAll();
      window.dispatchEvent(new Event('workspace-list-updated'));
    } catch (err: any) {
      toast.error('Failed to remove invitation');
    }
  };

  const acceptedReceived = receivedInvites.filter((i) => i.status === 'accepted');
  const pendingReceived = receivedInvites.filter((i) => i.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Invite Member */}
      <div className="card p-6">
        <h2 className="font-serif text-xl font-normal text-[#f4ede0] mb-4 flex items-center gap-2">
          <Share2 className="w-5 h-5 text-[#c9a96e]" /> Share Workspace
        </h2>
        <p className="text-xs text-[#f4ede0]/70 mb-5 leading-relaxed font-sans">
          Invite another registered user to collaborate on your property data. You can choose whether they can only view your data (viewer) or edit it as well (editor).
        </p>

        <form onSubmit={handleSendInvite} className="space-y-4 font-sans">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Collaborator Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-10"
                  placeholder="collaborator@example.com"
                />
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#c9a96e]" />
              </div>
            </div>

            <div>
              <label className="label col-span-1">Permission Role</label>
              <div className="flex gap-2 p-1 bg-[#0b1222] border border-[#3d301d] rounded-xl">
                <button
                  type="button"
                  onClick={() => setRole('viewer')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                    role === 'viewer'
                      ? 'bg-[#c9a96e] text-[#0b1222] shadow-sm'
                      : 'text-[#f4ede0]/70 hover:text-[#f4ede0]'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  Viewer (Read-only)
                </button>
                <button
                  type="button"
                  onClick={() => setRole('editor')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                    role === 'editor'
                      ? 'bg-[#c9a96e] text-[#0b1222] shadow-sm'
                      : 'text-[#f4ede0]/70 hover:text-[#f4ede0]'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Editor (Can Edit)
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={sending || !email}
              className="btn-primary hover:scale-[1.02] active:scale-[0.97] transition-all"
            >
              {sending ? 'Sending Invite…' : 'Send Invitation'}
            </button>
          </div>
        </form>
      </div>

      {/* Received Pending Invitations */}
      {pendingReceived.length > 0 && (
        <div className="card p-6 border-amber-800/80 bg-amber-950/20">
          <h2 className="font-serif text-lg text-amber-400 mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" /> Received Invitations ({pendingReceived.length})
          </h2>
          <div className="divide-y divide-[#3d301d]">
            {pendingReceived.map((invite) => {
              const inviterName = invite.inviter?.name || invite.inviter?.email || 'Someone';
              return (
                <div key={invite.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-semibold text-[#f4ede0]">{inviterName}</p>
                    <p className="text-xs text-[#f4ede0]/70 mt-0.5">
                      Invited you to co-work as a{' '}
                      <span className={`font-semibold ${invite.role === 'editor' ? 'text-[#c9a96e]' : 'text-sky-400'}`}>
                        {invite.role}
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAccept(invite.id, inviterName)}
                      className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-700 text-emerald-300 hover:scale-105 active:scale-95 transition-all flex items-center gap-1 text-xs font-semibold px-2.5"
                    >
                      <Check className="w-3.5 h-3.5" /> Accept
                    </button>
                    <button
                      onClick={() => handleReject(invite.id)}
                      className="p-1.5 rounded-lg bg-[#0b1222] border border-[#3d301d] text-[#f4ede0]/70 hover:scale-105 active:scale-95 transition-all flex items-center gap-1 text-xs font-semibold px-2.5"
                    >
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Joined Workspaces */}
      <div className="card p-6">
        <h2 className="font-serif text-xl font-normal text-[#f4ede0] mb-4 flex items-center gap-2 justify-between">
          <span className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#c9a96e]" /> Joined Workspaces
          </span>
          <button onClick={loadAll} className="p-1 hover:bg-[#0b1222] text-[#f4ede0]/60 hover:text-[#c9a96e] rounded-full transition-all">
            <RefreshCw className="w-4 h-4" />
          </button>
        </h2>
        {loadingReceived ? (
          <p className="text-center py-5 text-sm text-[#f4ede0]/50">Loading workspaces…</p>
        ) : acceptedReceived.length === 0 ? (
          <p className="text-center py-6 text-sm text-[#f4ede0]/50 italic">You have not joined any shared workspaces yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#3d301d] text-xs font-semibold text-[#c9a96e]">
                  <th className="py-2.5">Workspace Owner</th>
                  <th className="py-2.5">Role</th>
                  <th className="py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3d301d]/60">
                {acceptedReceived.map((invite) => (
                  <tr key={invite.id} className="text-sm">
                    <td className="py-3">
                      <p className="font-medium text-[#f4ede0]">{invite.inviter?.name || 'Registered User'}</p>
                      <p className="text-xs text-[#f4ede0]/50">{invite.inviter?.email}</p>
                    </td>
                    <td className="py-3">
                      <span className={invite.role === 'editor' ? 'badge-purple' : 'badge-blue'}>
                        {invite.role === 'editor' ? 'Editor' : 'Viewer'}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleDelete(invite.id, 'leave this workspace')}
                        className="text-rose-400 hover:text-rose-300 text-xs font-semibold flex items-center gap-1 ml-auto"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Leave Workspace
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Sent Invitations */}
      <div className="card p-6">
        <h2 className="font-serif text-xl font-normal text-[#f4ede0] mb-4 flex items-center gap-2">
          <Share2 className="w-5 h-5 text-[#c9a96e]" /> Sent Invitations
        </h2>
        {loadingSent ? (
          <p className="text-center py-5 text-sm text-[#f4ede0]/50">Loading invitations…</p>
        ) : sentInvites.length === 0 ? (
          <p className="text-center py-6 text-sm text-[#f4ede0]/50 italic">You have not invited anyone to your workspace yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#3d301d] text-xs font-semibold text-[#c9a96e]">
                  <th className="py-2.5">User Invited</th>
                  <th className="py-2.5">Role</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3d301d]/60">
                {sentInvites.map((invite) => (
                  <tr key={invite.id} className="text-sm">
                    <td className="py-3">
                      <p className="font-medium text-[#f4ede0]">{invite.invitee?.name || 'Registered User'}</p>
                      <p className="text-xs text-[#f4ede0]/50">{invite.invitee_email}</p>
                    </td>
                    <td className="py-3">
                      <span className={invite.role === 'editor' ? 'badge-purple' : 'badge-blue'}>
                        {invite.role === 'editor' ? 'Editor' : 'Viewer'}
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={
                          invite.status === 'accepted'
                            ? 'badge-green'
                            : invite.status === 'pending'
                            ? 'badge-amber'
                            : 'badge-gray'
                        }
                      >
                        {invite.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleDelete(invite.id, 'cancel this invitation')}
                        className="text-[#f4ede0]/50 hover:text-rose-400 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
