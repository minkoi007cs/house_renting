import { useState, useMemo } from 'react';
import { Bell, Plus, Pencil, Trash2, CheckCircle2, Circle, Calendar, AlertCircle } from 'lucide-react';
import { Layout } from '@/components/common/Layout';
import { PageLoader } from '@/components/common/Spinner';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { CreateReminderForm } from '@/components/forms/CreateReminderForm';
import { useReminders } from '@/hooks/useReminders';
import { useProperties } from '@/hooks/useProperties';
import { REMINDER_TYPE_LABELS } from '@/utils/labels';
import { formatDate } from '@/utils/format';
import { Reminder } from '@/types';

export const RemindersPage = () => {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const { reminders, isLoading, fetchReminders, toggleReminder, deleteReminder } = useReminders(
    statusFilter || undefined
  );
  const { properties } = useProperties();

  const [showCreate, setShowCreate] = useState(false);
  const [createPropId, setCreatePropId] = useState('');
  const [editing, setEditing] = useState<Reminder | null>(null);
  const [deleting, setDeleting] = useState<Reminder | null>(null);
  const [propStep, setPropStep] = useState(false);

  const sorted = useMemo(() => {
    return [...reminders].sort((a, b) => {
      if (a.status !== b.status) return a.status === 'pending' ? -1 : 1;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    });
  }, [reminders]);

  const pending = reminders.filter((r) => r.status === 'pending');
  const overdue = pending.filter((r) => new Date(r.due_date) < new Date());

  return (
    <Layout title="Reminders">
      <div className="space-y-5 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex gap-4 text-sm text-[#f4ede0]/70">
            <span>
              <span className="font-semibold text-[#c9a96e]">{pending.length}</span> pending
            </span>
            {overdue.length > 0 && (
              <span className="flex items-center gap-1 text-rose-400 font-medium">
                <AlertCircle className="w-4 h-4" /> {overdue.length} overdue
              </span>
            )}
          </div>
          <button
            onClick={() => {
              if (properties.length === 1) {
                setCreatePropId(properties[0].id);
                setShowCreate(true);
              } else {
                setPropStep(true);
              }
            }}
            className="btn-primary"
          >
            <Plus className="w-4 h-4" /> Add reminder
          </button>
        </div>

        <div className="card p-4 flex gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input md:w-44"
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="done">Done</option>
          </select>
        </div>

        {isLoading ? (
          <PageLoader />
        ) : sorted.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={Bell}
              title={statusFilter ? 'No reminders found' : 'No reminders yet'}
              description="Stay on top of rent collections, contract expirations, and maintenance."
              action={
                !statusFilter && (
                  <button onClick={() => setPropStep(true)} className="btn-primary">
                    <Plus className="w-4 h-4" /> Add reminder
                  </button>
                )
              }
            />
          </div>
        ) : (
          <div className="space-y-2">
            {sorted.map((r) => {
              const due = new Date(r.due_date);
              const now = new Date();
              const daysUntil = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
              const overdue = r.status === 'pending' && due < now;
              const soon = r.status === 'pending' && !overdue && daysUntil <= 7;
              return (
                <div
                  key={r.id}
                  className={`card px-4 py-3.5 flex items-center gap-3 transition ${
                    r.status === 'done'
                      ? 'opacity-50'
                      : overdue
                      ? 'border-rose-800/80 bg-rose-950/40'
                      : soon
                      ? 'border-amber-800/80 bg-amber-950/40'
                      : ''
                  }`}
                >
                  <button
                    onClick={() => toggleReminder(r)}
                    className="flex-shrink-0 text-[#f4ede0]/50 hover:text-[#c9a96e] transition"
                    title={r.status === 'done' ? 'Mark pending' : 'Mark done'}
                  >
                    {r.status === 'done' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : overdue ? (
                      <Circle className="w-5 h-5 text-rose-400" />
                    ) : soon ? (
                      <Circle className="w-5 h-5 text-amber-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-[#c9a96e]" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-medium ${
                        r.status === 'done' ? 'text-[#f4ede0]/40 line-through' : 'text-[#f4ede0]'
                      }`}
                    >
                      {r.title}
                    </p>
                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-[#f4ede0]/60">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#c9a96e]" /> {formatDate(r.due_date)}
                      </span>
                      <span>{REMINDER_TYPE_LABELS[r.type] || r.type}</span>
                      {r.property && <span className="text-[#f4ede0]/40">· {r.property.name}</span>}
                      {overdue && (
                        <span className="text-rose-400 font-medium flex items-center gap-0.5">
                          <AlertCircle className="w-3 h-3" /> Overdue
                        </span>
                      )}
                      {soon && (
                        <span className="text-amber-400 font-medium flex items-center gap-0.5">
                          <AlertCircle className="w-3 h-3" /> Due in {daysUntil}d
                        </span>
                      )}
                    </div>
                    {r.description && (
                      <p className="text-xs text-[#f4ede0]/50 mt-1 truncate">{r.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => setEditing(r)} className="p-2 hover:bg-[#0b1222] rounded text-[#f4ede0]/60 hover:text-[#c9a96e]">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleting(r)}
                      className="p-2 hover:bg-rose-950/40 rounded text-[#f4ede0]/60 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {propStep && (
        <PropertyPickerModal
          properties={properties}
          onCancel={() => setPropStep(false)}
          onSelect={(id) => {
            setCreatePropId(id);
            setPropStep(false);
            setShowCreate(true);
          }}
        />
      )}

      {showCreate && (
        <CreateReminderForm
          propertyId={createPropId}
          onClose={() => setShowCreate(false)}
          onSuccess={() => fetchReminders()}
        />
      )}

      {editing && (
        <CreateReminderForm
          reminderId={editing.id}
          initialData={editing as any}
          onClose={() => setEditing(null)}
          onSuccess={() => {
            setEditing(null);
            fetchReminders();
          }}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete reminder?"
          message={`Remove "${deleting.title}"?`}
          onCancel={() => setDeleting(null)}
          onConfirm={async () => {
            await deleteReminder(deleting.id);
            setDeleting(null);
          }}
        />
      )}
    </Layout>
  );
};

const PropertyPickerModal = ({
  properties,
  onCancel,
  onSelect,
}: {
  properties: any[];
  onCancel: () => void;
  onSelect: (id: string) => void;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-[#0b1222]/80 backdrop-blur-sm" onClick={onCancel} />
    <div className="relative w-full max-w-sm bg-[#111a2e] rounded-2xl border border-[#3d301d] shadow-2xl text-[#f4ede0]">
      <div className="px-6 py-4 border-b border-[#3d301d]">
        <h3 className="font-serif text-lg font-normal text-[#f4ede0]">Select a property</h3>
      </div>
      <div className="max-h-64 overflow-y-auto px-3 py-3 space-y-1">
        {properties.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#0b1222] text-xs font-sans border border-transparent hover:border-[#3d301d] transition"
          >
            <div className="font-semibold text-sm text-[#f4ede0]">{p.name}</div>
            <div className="text-xs text-[#f4ede0]/50">{p.address}</div>
          </button>
        ))}
      </div>
      <div className="px-6 py-4 border-t border-[#3d301d]">
        <button onClick={onCancel} className="btn-secondary w-full">Cancel</button>
      </div>
    </div>
  </div>
);
