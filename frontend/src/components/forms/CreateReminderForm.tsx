import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';

const reminderSchema = z.object({
  type: z.enum(['rent_payment_due', 'contract_expiring', 'maintenance_needed', 'custom_task']).optional(),
  title: z.string().min(1, 'Tiêu đề không được để trống').max(255),
  description: z.string().max(1000).optional(),
  due_date: z.string().min(1, 'Ngày đến hạn không được để trống'),
  status: z.enum(['pending', 'done']).optional().default('pending'),
});

type ReminderFormData = z.infer<typeof reminderSchema>;

interface CreateReminderFormProps {
  onClose: () => void;
  onSubmit: (data: ReminderFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export const CreateReminderForm = ({ onClose, onSubmit, isSubmitting = false }: CreateReminderFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<ReminderFormData>({
    resolver: zodResolver(reminderSchema),
  });

  const handleSubmitForm = async (data: ReminderFormData) => {
    try {
      setError(null);
      await onSubmit(data);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tạo nhắc nhở');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Thêm nhắc nhở</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleSubmitForm)} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại
            </label>
            <select
              {...register('type')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Chọn loại</option>
              <option value="rent_payment_due">Thanh toán tiền thuê</option>
              <option value="contract_expiring">Hợp đồng sắp hết hạn</option>
              <option value="maintenance_needed">Cần bảo trì</option>
              <option value="custom_task">Tác vụ tùy chỉnh</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tiêu đề *
            </label>
            <input
              {...register('title')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhắc nhở..."
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Mô tả chi tiết..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày đến hạn *
            </label>
            <input
              {...register('due_date')}
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.due_date && <p className="mt-1 text-sm text-red-600">{errors.due_date.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái
            </label>
            <select
              {...register('status')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="pending">Chưa hoàn thành</option>
              <option value="done">Hoàn thành</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition font-medium"
            >
              {isSubmitting ? 'Đang lưu...' : 'Thêm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
