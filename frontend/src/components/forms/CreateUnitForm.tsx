import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/common/Modal';

const schema = z.object({
  name: z.string().min(1, 'Unit name is required').max(255),
  status: z.enum(['available', 'occupied', 'maintenance', 'unavailable']).default('available'),
  description: z.string().max(1000).optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
  initialData?: Partial<FormData>;
  isEdit?: boolean;
}

export const CreateUnitForm = ({ onClose, onSubmit, initialData, isEdit = false }: Props) => {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { status: 'available', ...initialData },
  });

  const handleFormSubmit = async (data: FormData) => {
    try {
      setError(null);
      setIsSubmitting(true);
      await onSubmit(data);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save unit');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal title={isEdit ? 'Edit Unit' : 'Add Unit'} onClose={onClose} size="sm">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="label">Unit Name *</label>
          <input {...register('name')} className="input" placeholder="e.g. Room 101" />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <label className="label">Status</label>
          <select {...register('status')} className="input">
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="maintenance">Maintenance</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>

        <div>
          <label className="label">Description</label>
          <textarea {...register('description')} rows={3} className="input" placeholder="Unit details…" />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
            {isSubmitting ? 'Saving…' : isEdit ? 'Save changes' : 'Add unit'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
