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
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex gap-4 text-sm text-ink-500">
            <span>
              <span className="font-semibold text-ink-800">{pending.length}</span> pending
            </span>
            {overdue.length > 0 && (
              <span className="flex items-center gap-1 text-rose-600 font-medium">
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
              const overdue = r.status === 'pending' && due < new Date();
              return (
                <div
                  key={r.id}
                  className={`card px-4 py-3.5 flex items-center gap-3 transition ${
                    r.status === 'done'
                      ? 'opacity-60'
                      : overdue
                      ? 'border-rose-200 bg-rose-50/30'
                      : ''
                  }`}
                >
                  <button
                    onClick={() => toggleReminder(r)}
                    className="flex-shrink-0 text-ink-400 hover:text-brand-600 transition"
                    title={r.status === 'done' ? 'Mark pending' : 'Mark done'}
                  >
                    {r.status === 'done' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-medium ${
                        r.status === 'done' ? 'text-ink-400 line-through' : 'text-ink-900'
                      }`}
                    >
                      {r.title}
                    </p>
                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-ink-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {formatDate(r.due_date)}
                      </span>
                      <span>{REMINDER_TYPE_LABELS[r.type] || r.type}</span>
                      {r.property && <span className="text-ink-400">· {r.property.name}</span>}
                      {overdue && (
                        <span className="text-rose-600 font-medium flex items-center gap-0.5">
                          <AlertCircle className="w-3 h-3" /> Overdue
                        </span>
                      )}
                    </div>
                    {r.description && (
                      <p className="text-xs text-ink-400 mt-1 truncate">{r.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => setEditing(r)} className="p-2 hover:bg-ink-100 rounded text-ink-400">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleting(r)}
                      className="p-2 hover:bg-rose-50 rounded text-ink-400 hover:text-rose-600"
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
    <div className="absolute inset-0 bg-ink-900/50" onClick={onCancel} />
    <div className="relative w-full max-w-sm bg-white rounded-xl2 shadow-soft">
      <div className="px-6 py-4 border-b border-ink-200">
        <h3 className="font-semibold text-ink-900">Select a property</h3>
      </div>
      <div className="max-h-64 overflow-y-auto px-3 py-3 space-y-1">
        {properties.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-brand-50 text-sm transition"
          >
            <div className="font-medium text-ink-900">{p.name}</div>
            <div className="text-xs text-ink-500">{p.address}</div>
          </button>
        ))}
      </div>
      <div className="px-6 py-4 border-t border-ink-100">
        <button onClick={onCancel} className="btn-secondary w-full">Cancel</button>
      </div>
    </div>
  </div>
);
