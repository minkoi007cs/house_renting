import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/services/api';
import { Modal } from '@/components/common/Modal';
import { ImageUploader } from '@/components/common/ImageUploader';

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  address: z.string().min(5, 'Address must be at least 5 characters').max(500),
  type: z.enum(['house', 'apartment', 'townhouse', 'land', 'other']).default('house'),
  status: z.enum(['active', 'inactive', 'sold']).default('active'),
  monthly_rent: z
    .union([z.coerce.number().min(0), z.literal('').transform(() => undefined)])
    .optional(),
  description: z.string().max(1000).optional(),
  notes: z.string().max(1000).optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Partial<FormData & { image_urls?: string[]; cover_image_url?: string }>;
  propertyId?: string;
}

export const CreatePropertyForm = ({ onClose, onSuccess, initialData, propertyId }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>(initialData?.image_urls || []);
  const [cover, setCover] = useState<string | undefined>(initialData?.cover_image_url);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const isEdit = !!propertyId;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'house', status: 'active', ...initialData },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const payload = {
        ...data,
        image_urls: images,
        cover_image_url: cover || images[0] || null,
      };
      if (isEdit) {
        await api.patch(`/properties/${propertyId}`, payload);
      } else {
        await api.post('/properties', payload);
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
    <Modal title={isEdit ? 'Edit Property' : 'Add Property'} onClose={onClose} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-sm">
            {error}
          </div>
        )}

        <ImageUploader
          label="Photos"
          images={images}
          cover={cover}
          onChange={({ images: nextImg, cover: nextCover }) => {
            setImages(nextImg);
            setCover(nextCover);
          }}
        />

        <div>
          <label className="label">Property name *</label>
          <input
            {...register('name')}
            className="input"
            placeholder="e.g. District 1 Townhouse"
          />
          {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name.message}</p>}
        </div>

        <div>
          <label className="label">Address *</label>
          <input
            {...register('address')}
            className="input"
            placeholder="123 Main Street, District 1"
          />
          {errors.address && (
            <p className="mt-1 text-xs text-rose-500">{errors.address.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Monthly rent (VND)</label>
            <input
              {...register('monthly_rent')}
              type="number"
              className="input"
              placeholder="5000000"
            />
            <p className="mt-1 text-xs text-ink-400">Reference rent — contracts can override.</p>
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
          <textarea
            {...register('description')}
            rows={3}
            className="input"
            placeholder="Highlights, amenities, neighborhood…"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          className="text-xs text-brand-600 hover:text-brand-700 font-medium"
        >
          {showAdvanced ? 'Hide' : 'Show'} advanced options
        </button>

        {showAdvanced && (
          <div className="space-y-4 pt-2 border-t border-ink-100">
            <div>
              <label className="label">Property type</label>
              <select {...register('type')} className="input">
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="townhouse">Townhouse</option>
                <option value="land">Land</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="label">Internal notes</label>
              <textarea
                {...register('notes')}
                rows={2}
                className="input"
                placeholder="Private notes only you can see…"
              />
            </div>
          </div>
        )}

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
