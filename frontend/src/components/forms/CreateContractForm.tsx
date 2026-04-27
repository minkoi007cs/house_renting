import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import api from '@/services/api';
import { Modal } from '@/components/common/Modal';

const schema = z.object({
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().optional(),
  signed_date: z.string().optional(),
  rent_amount: z.coerce.number().min(1, 'Rent amount must be > 0'),
  deposit_amount: z.coerce.number().min(0).default(0),
  payment_cycle: z.string().default('monthly'),
  status: z
    .enum(['draft', 'signed', 'active', 'expired', 'terminated', 'renewed'])
    .default('active'),
  terms: z.string().optional(),
  notes: z.string().max(1000).optional(),
});

type FormData = z.infer<typeof schema>;

interface UnitOption { id: string; name: string; }

interface Props {
  unitId?: string;
  unitOptions?: UnitOption[];
  onUnitChange?: (id: string) => void;
  contractId?: string;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Partial<FormData & { image_urls?: string[] }>;
}

export const CreateContractForm = ({
  unitId, unitOptions, onUnitChange, contractId, onClose, onSuccess, initialData,
}: Props) => {
  const isEdit = !!contractId;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState(unitId || '');
  const [images, setImages] = useState<string[]>(initialData?.image_urls || []);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { payment_cycle: 'monthly', status: 'active', deposit_amount: 0, ...initialData },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of files) {
        const form = new FormData();
        form.append('file', file);
        const res = await api.post('/upload', form);
        urls.push(res.data.data.url);
      }
      setImages((prev) => [...prev, ...urls]);
    } catch {
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const removeImage = (url: string) => setImages((prev) => prev.filter((u) => u !== url));

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const payload = { ...data, image_urls: images };
      if (isEdit) {
        await api.patch(`/contracts/${contractId}`, payload);
      } else {
        const targetUnit = selectedUnit || unitId;
        if (!targetUnit) { setError('Please select a unit'); return; }
        await api.post(`/units/${targetUnit}/contracts`, payload);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save contract');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal title={isEdit ? 'Edit Contract' : 'New Contract'} onClose={onClose} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-sm">{error}</div>
        )}

        {!isEdit && unitOptions && unitOptions.length > 0 && (
          <div>
            <label className="label">Unit *</label>
            <select
              value={selectedUnit}
              onChange={(e) => { setSelectedUnit(e.target.value); onUnitChange?.(e.target.value); }}
              className="input"
            >
              <option value="">Select unit</option>
              {unitOptions.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="label">Start date *</label>
            <input {...register('start_date')} type="date" className="input" />
            {errors.start_date && <p className="mt-1 text-xs text-rose-500">{errors.start_date.message}</p>}
          </div>
          <div>
            <label className="label">End date</label>
            <input {...register('end_date')} type="date" className="input" />
          </div>
          <div>
            <label className="label">Signed date</label>
            <input {...register('signed_date')} type="date" className="input" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Rent (VND) *</label>
            <input {...register('rent_amount')} type="number" className="input" placeholder="5000000" />
            {errors.rent_amount && <p className="mt-1 text-xs text-rose-500">{errors.rent_amount.message}</p>}
          </div>
          <div>
            <label className="label">Deposit (VND)</label>
            <input {...register('deposit_amount')} type="number" className="input" placeholder="0" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Payment cycle</label>
            <select {...register('payment_cycle')} className="input">
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div>
            <label className="label">Status</label>
            <select {...register('status')} className="input">
              <option value="draft">Draft</option>
              <option value="signed">Signed</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="terminated">Terminated</option>
              <option value="renewed">Renewed</option>
            </select>
          </div>
        </div>

        <div>
          <label className="label">Terms</label>
          <textarea {...register('terms')} rows={2} className="input" placeholder="Contract terms and conditions…" />
        </div>

        <div>
          <label className="label">Notes</label>
          <textarea {...register('notes')} rows={2} className="input" placeholder="Internal notes…" />
        </div>

        {/* Image upload */}
        <div>
          <label className="label">Contract images / documents</label>
          <div className="space-y-3">
            {images.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {images.map((url) => (
                  <div key={url} className="relative group w-20 h-20">
                    <img
                      src={url}
                      alt="contract"
                      className="w-20 h-20 object-cover rounded-lg border border-ink-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '';
                        (e.target as HTMLImageElement).className = 'hidden';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-3 py-2 border border-dashed border-ink-300 rounded-lg text-sm text-ink-500 hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50 transition w-full justify-center"
            >
              {uploading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</>
              ) : (
                <><ImagePlus className="w-4 h-4" /> Add images</>
              )}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,.pdf"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={isSubmitting || uploading} className="btn-primary flex-1">
            {isSubmitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create contract'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
