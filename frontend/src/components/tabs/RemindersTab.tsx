import { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { Reminder } from '@/types';
import { CreateReminderForm } from '@/components/forms/CreateReminderForm';

interface RemindersTabProps {
  reminders: Reminder[];
  isLoading: boolean;
  onCreateReminder: (data: any) => Promise<void>;
  onUpdateReminder: (id: string, data: any) => Promise<void>;
  onDeleteReminder: (id: string) => Promise<void>;
}

export const RemindersTab = ({
  reminders,
  isLoading,
  onCreateReminder,
  onUpdateReminder,
  onDeleteReminder,
}: RemindersTabProps) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (data: any) => {
    setIsSubmitting(true);
    try {
      await onCreateReminder(data);
      setShowCreateForm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (reminder: Reminder) => {
    try {
      await onUpdateReminder(reminder.id, {
        status: reminder.status === 'done' ? 'pending' : 'done',
      });
    } catch (err) {
      console.error('Failed to update reminder:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa nhắc nhở này?')) {
      try {
        await onDeleteReminder(id);
      } catch (err) {
        console.error('Failed to delete reminder:', err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'rent_payment_due': return 'Thanh toán tiền thuê';
      case 'contract_expiring': return 'Hợp đồng sắp hết hạn';
      case 'maintenance_needed': return 'Cần bảo trì';
      case 'custom_task': return 'Tác vụ tùy chỉnh';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'rent_payment_due': return 'bg-blue-100 text-blue-800';
      case 'contract_expiring': return 'bg-yellow-100 text-yellow-800';
      case 'maintenance_needed': return 'bg-orange-100 text-orange-800';
      case 'custom_task': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const pendingReminders = reminders.filter(r => r.status === 'pending');
  const doneReminders = reminders.filter(r => r.status === 'done');

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Nhắc nhở</h3>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          <Plus size={18} />
          Thêm nhắc nhở
        </button>
      </div>

      {reminders.length === 0 ? (
        <div className="bg-gray-50 p-6 rounded text-center text-gray-500">
          Chưa có nhắc nhở nào
        </div>
      ) : (
        <div className="space-y-6">
          {pendingReminders.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <AlertCircle size={16} className="text-orange-600" />
                Chưa hoàn thành ({pendingReminders.length})
              </h4>
              <div className="space-y-3">
                {pendingReminders.map((reminder) => (
                  <div key={reminder.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleStatus(reminder)}
                            className="text-gray-400 hover:text-blue-600 transition"
                          >
                            <Circle size={20} />
                          </button>
                          <h5 className="font-semibold text-gray-900">{reminder.title}</h5>
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getTypeColor(reminder.type)}`}>
                            {getTypeLabel(reminder.type)}
                          </span>
                        </div>
                        {reminder.description && (
                          <p className="text-sm text-gray-600 mt-2 ml-7">{reminder.description}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-2 ml-7">
                          Đến hạn: {new Date(reminder.due_date).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(reminder.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {doneReminders.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-600" />
                Hoàn thành ({doneReminders.length})
              </h4>
              <div className="space-y-3">
                {doneReminders.map((reminder) => (
                  <div key={reminder.id} className="border border-gray-200 rounded-lg p-4 opacity-60">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleStatus(reminder)}
                            className="text-green-600 hover:text-gray-400 transition"
                          >
                            <CheckCircle2 size={20} />
                          </button>
                          <h5 className="font-semibold text-gray-600 line-through">{reminder.title}</h5>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(reminder.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {showCreateForm && (
        <CreateReminderForm
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreate}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};
