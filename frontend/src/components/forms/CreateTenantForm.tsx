import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/services/api';
import { Modal } from '@/components/common/Modal';

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().max(1000).optional(),
  emergency_contact: z.string().max(500).optional(),
});

type FormData = z.infer<typeof schema>;

interface UnitOption {
  id: string;
  name: string;
}

interface Props {
  unitId?: string;
  unitOptions?: UnitOption[];
  onUnitChange?: (id: string) => void;
  tenantId?: string;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Partial<FormData>;
}

export const CreateTenantForm = ({
  unitId,
  unitOptions,
  onUnitChange,
  tenantId,
  onClose,
  onSuccess,
  initialData,
}: Props) => {
  const isEdit = !!tenantId;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState(unitId || '');

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { ...initialData },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      if (isEdit) {
        await api.patch(`/tenants/${tenantId}`, data);
      } else {
        const targetUnit = selectedUnit || unitId;
        if (!targetUnit) {
          setError('Please select a unit');
          return;
        }
        await api.post(`/units/${targetUnit}/tenants`, data);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save tenant');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal title={isEdit ? 'Edit Tenant' : 'Add Tenant'} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
        )}

        {!isEdit && unitOptions && unitOptions.length > 0 && (
          <div>
            <label className="label">Unit *</label>
            <select
              value={selectedUnit}
              onChange={(e) => {
                setSelectedUnit(e.target.value);
                onUnitChange?.(e.target.value);
              }}
              className="input"
            >
              <option value="">Select unit</option>
              {unitOptions.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="label">Full name *</label>
          <input {...register('name')} className="input" placeholder="John Doe" />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Phone</label>
            <input {...register('phone')} className="input" placeholder="+84 901 234 567" />
          </div>
          <div>
            <label className="label">Email</label>
            <input {...register('email')} type="email" className="input" placeholder="email@example.com" />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>
        </div>

        <div>
          <label className="label">Address</label>
          <input {...register('address')} className="input" placeholder="Home address" />
        </div>

        <div>
          <label className="label">Emergency contact</label>
          <input
            {...register('emergency_contact')}
            className="input"
            placeholder="Name & phone of emergency contact"
          />
        </div>

        <div>
          <label className="label">Notes</label>
          <textarea {...register('notes')} rows={2} className="input" placeholder="Internal notes…" />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
            {isSubmitting ? 'Saving…' : isEdit ? 'Save changes' : 'Add tenant'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
