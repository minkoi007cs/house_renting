import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { Eye, Edit3, ArrowLeftRight } from 'lucide-react';

interface Props {
  title: string;
  children: React.ReactNode;
}

export const Layout = ({ title, children }: Props) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeOwnerId, setActiveOwnerId] = useState<string | null>(null);
  const [activeOwnerName, setActiveOwnerName] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<string | null>(null);

  useEffect(() => {
    setActiveOwnerId(localStorage.getItem('active_workspace_owner_id'));
    setActiveOwnerName(localStorage.getItem('active_workspace_owner_name'));
    setActiveRole(localStorage.getItem('active_workspace_role'));
  }, []);

  const handleSwitchBack = () => {
    localStorage.removeItem('active_workspace_owner_id');
    localStorage.removeItem('active_workspace_owner_name');
    localStorage.removeItem('active_workspace_role');
    window.location.reload();
  };

  return (
    <div className="flex h-screen bg-ink-50 overflow-hidden font-sans">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar title={title} onMenuClick={() => setSidebarOpen(true)} />
        
        {/* Switched Workspace Banner */}
        {activeOwnerId && (
          <div
            className={`px-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b text-xs font-semibold transition-all ${
              activeRole === 'viewer'
                ? 'bg-amber-50/80 border-amber-200 text-amber-800'
                : 'bg-brand-50/80 border-brand-200 text-brand-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {activeRole === 'viewer' ? (
                <Eye className="w-4 h-4 text-amber-600 flex-shrink-0 animate-pulse" />
              ) : (
                <Edit3 className="w-4 h-4 text-brand-600 flex-shrink-0" />
              )}
              <span>
                {activeRole === 'viewer'
                  ? `Viewing ${activeOwnerName}'s Workspace (Read-only mode). All actions to create, update or delete are restricted.`
                  : `Co-editing ${activeOwnerName}'s Workspace. You can view, add or update records as an authorized collaborator.`}
              </span>
            </div>
            
            <button
              onClick={handleSwitchBack}
              className="flex items-center justify-center gap-1.5 px-3 py-1 bg-white hover:bg-ink-50 border border-ink-200 text-ink-700 rounded-lg shadow-sm text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              Switch back to Personal
            </button>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};
