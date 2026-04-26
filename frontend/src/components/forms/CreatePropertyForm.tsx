import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/services/api';
import { Modal } from '@/components/common/Modal';

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  address: z.string().min(5, 'Address must be at least 5 characters').max(500),
  type: z.enum(['house', 'apartment', 'townhouse', 'land', 'other']),
  status: z.enum(['active', 'inactive', 'sold']).default('active'),
  description: z.string().max(1000).optional(),
  notes: z.string().max(1000).optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Partial<FormData>;
  propertyId?: string;
}

export const CreatePropertyForm = ({ onClose, onSuccess, initialData, propertyId }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEdit = !!propertyId;

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { status: 'active', ...initialData },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      if (isEdit) {
        await api.patch(`/properties/${propertyId}`, data);
      } else {
        await api.post('/properties', data);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save property');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal title={isEdit ? 'Edit Property' : 'Add Property'} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="label">Property Name *</label>
          <input {...register('name')} className="input" placeholder="e.g. District 1 House" />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <label className="label">Address *</label>
          <input {...register('address')} className="input" placeholder="123 Main Street, District 1" />
          {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Type *</label>
            <select {...register('type')} className="input">
              <option value="">Select type</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="townhouse">Townhouse</option>
              <option value="land">Land</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="label">Status</label>
            <select {...register('status')} className="input">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="sold">Sold</option>
            </select>
          </div>
        </div>

        <div>
          <label className="label">Description</label>
          <textarea {...register('description')} rows={3} className="input" placeholder="Brief description…" />
        </div>

        <div>
          <label className="label">Notes</label>
          <textarea {...register('notes')} rows={2} className="input" placeholder="Internal notes…" />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
            {isSubmitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create property'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
