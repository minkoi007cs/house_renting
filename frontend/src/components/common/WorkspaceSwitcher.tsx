import { useState, useEffect } from 'react';
import { ChevronDown, Briefcase, User, ShieldCheck } from 'lucide-react';
import api from '@/services/api';

interface Workspace {
  id: string;
  role: 'viewer' | 'editor';
  inviter: {
    id: string;
    email: string;
    name: string | null;
  };
}

export const WorkspaceSwitcher = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeOwnerId, setActiveOwnerId] = useState<string | null>(
    localStorage.getItem('active_workspace_owner_id')
  );

  const fetchWorkspaces = async () => {
    try {
      const res = await api.get('/users/invitations/received');
      // Only show accepted invitations
      const accepted = res.data.data.filter((i: any) => i.status === 'accepted');
      setWorkspaces(accepted);
    } catch (err) {
      console.error('Failed to fetch workspaces', err);
    }
  };

  useEffect(() => {
    fetchWorkspaces();

    const handleUpdate = () => {
      fetchWorkspaces();
      setActiveOwnerId(localStorage.getItem('active_workspace_owner_id'));
    };

    window.addEventListener('workspace-list-updated', handleUpdate);
    return () => {
      window.removeEventListener('workspace-list-updated', handleUpdate);
    };
  }, []);

  const handleSelect = (workspace: Workspace | null) => {
    if (workspace === null) {
      localStorage.removeItem('active_workspace_owner_id');
      localStorage.removeItem('active_workspace_owner_name');
      localStorage.removeItem('active_workspace_role');
    } else {
      localStorage.setItem('active_workspace_owner_id', workspace.inviter.id);
      localStorage.setItem(
        'active_workspace_owner_name',
        workspace.inviter.name || workspace.inviter.email
      );
      localStorage.setItem('active_workspace_role', workspace.role);
    }
    setIsOpen(false);
    // Reload page to reset all states and headers
    window.location.reload();
  };

  const activeName =
    activeOwnerId === null
      ? 'Personal Workspace'
      : localStorage.getItem('active_workspace_owner_name') || 'Shared Workspace';

  const activeRole = localStorage.getItem('active_workspace_role');

  return (
    <div className="relative font-sans">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
          activeOwnerId === null
            ? 'bg-ink-50 border-ink-200 text-ink-700 hover:bg-ink-100'
            : 'bg-brand-50 border-brand-200 text-brand-700 hover:bg-brand-100/50'
        } hover:scale-[1.02] active:scale-[0.98]`}
      >
        <Briefcase className="w-3.5 h-3.5" />
        <span className="max-w-[120px] truncate">{activeName}</span>
        {activeOwnerId !== null && (
          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-200/50 text-brand-800">
            {activeRole}
          </span>
        )}
        <ChevronDown className="w-3.5 h-3.5 opacity-60" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop to close the switcher */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          
          <div className="absolute right-0 mt-1.5 w-60 bg-white rounded-2xl border border-ink-150 shadow-lg py-2 z-20 overflow-hidden animate-fade-in">
            <p className="px-4 py-1.5 text-[10px] font-bold text-ink-400 uppercase tracking-wider">
              Select Workspace
            </p>
            
            {/* Personal Workspace */}
            <button
              onClick={() => handleSelect(null)}
              className={`w-full flex items-center gap-2.5 px-4 py-2 text-left text-xs font-semibold transition-all ${
                activeOwnerId === null
                  ? 'bg-brand-50/50 text-brand-700'
                  : 'text-ink-700 hover:bg-ink-50'
              }`}
            >
              <User className="w-4 h-4 opacity-70" />
              <div className="flex-1 min-w-0">
                <p className="truncate">Personal Workspace</p>
                <p className="text-[10px] text-ink-400 font-normal mt-0.5">Your properties and units</p>
              </div>
            </button>

            {/* Shared Workspaces */}
            {workspaces.map((ws) => (
              <button
                key={ws.id}
                onClick={() => handleSelect(ws)}
                className={`w-full flex items-center gap-2.5 px-4 py-2 text-left text-xs font-semibold transition-all ${
                  activeOwnerId === ws.inviter.id
                    ? 'bg-brand-50/50 text-brand-700'
                    : 'text-ink-700 hover:bg-ink-50'
                }`}
              >
                <ShieldCheck className="w-4 h-4 opacity-70" />
                <div className="flex-1 min-w-0">
                  <p className="truncate">{ws.inviter.name || ws.inviter.email}</p>
                  <p className="text-[10px] text-ink-400 font-normal mt-0.5">
                    Workspace Owner • {ws.role === 'editor' ? 'Can Edit' : 'Read-only'}
                  </p>
                </div>
              </button>
            ))}

            {workspaces.length === 0 && (
              <p className="px-4 py-3 text-[11px] text-ink-400 text-center italic border-t border-ink-50 mt-1">
                No joined shared workspaces.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};
