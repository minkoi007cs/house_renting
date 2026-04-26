import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/services/api';
import { Modal } from '@/components/common/Modal';

const schema = z.object({
  type: z.enum(['rent_payment_due', 'contract_expiring', 'maintenance_needed', 'custom_task']),
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().max(1000).optional(),
  due_date: z.string().min(1, 'Due date is required'),
  status: z.enum(['pending', 'done']).default('pending'),
});

type FormData = z.infer<typeof schema>;

interface PropertyOption {
  id: string;
  name: string;
}

interface Props {
  propertyId?: string;
  propertyOptions?: PropertyOption[];
  onPropertyChange?: (id: string) => void;
  reminderId?: string;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Partial<FormData>;
}

export const CreateReminderForm = ({
  propertyId,
  propertyOptions,
  onPropertyChange,
  reminderId,
  onClose,
  onSuccess,
  initialData,
}: Props) => {
  const isEdit = !!reminderId;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState(propertyId || '');

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'custom_task', status: 'pending', ...initialData },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      if (isEdit) {
        await api.patch(`/reminders/${reminderId}`, data);
      } else {
        const target = selectedProperty || propertyId;
        if (!target) {
          setError('Please select a property');
          return;
        }
        await api.post(`/properties/${target}/reminders`, data);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save reminder');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal title={isEdit ? 'Edit Reminder' : 'New Reminder'} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
        )}

        {!isEdit && propertyOptions && propertyOptions.length > 0 && (
          <div>
            <label className="label">Property *</label>
            <select
              value={selectedProperty}
              onChange={(e) => {
                setSelectedProperty(e.target.value);
                onPropertyChange?.(e.target.value);
              }}
              className="input"
            >
              <option value="">Select property</option>
              {propertyOptions.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="label">Type *</label>
          <select {...register('type')} className="input">
            <option value="custom_task">Custom task</option>
            <option value="rent_payment_due">Rent payment due</option>
            <option value="contract_expiring">Contract expiring</option>
            <option value="maintenance_needed">Maintenance needed</option>
          </select>
        </div>

        <div>
          <label className="label">Title *</label>
          <input {...register('title')} className="input" placeholder="e.g. Collect rent for Unit A" />
          {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
        </div>

        <div>
          <label className="label">Description</label>
          <textarea {...register('description')} rows={3} className="input" placeholder="Optional details…" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Due date *</label>
            <input {...register('due_date')} type="date" className="input" />
            {errors.due_date && <p className="mt-1 text-xs text-red-500">{errors.due_date.message}</p>}
          </div>
          <div>
            <label className="label">Status</label>
            <select {...register('status')} className="input">
              <option value="pending">Pending</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
            {isSubmitting ? 'Saving…' : isEdit ? 'Save changes' : 'Add reminder'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
