import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/services/api';
import { X } from 'lucide-react';

const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  category: z.string(),
  amount: z.number().min(0),
  transaction_date: z.string(),
  note: z.string().optional(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface CreateTransactionFormProps {
  propertyId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const INCOME_CATEGORIES = ['rent', 'service_fee', 'deposit_refund', 'other_income'];
const EXPENSE_CATEGORIES = ['repair', 'maintenance', 'utilities', 'brokerage', 'cleaning', 'other_expense'];

export const CreateTransactionForm = ({
  propertyId,
  onClose,
  onSuccess,
}: CreateTransactionFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState<'income' | 'expense'>('income');

  const { register, handleSubmit, formState: { errors } } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: { type: 'income', transaction_date: new Date().toISOString().split('T')[0] },
  });

  const onSubmit = async (data: TransactionFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await api.post(`/properties/${propertyId}/transactions`, {
        ...data,
        type: data.type || type,
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tạo giao dịch');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Ghi nhận giao dịch</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Loại *</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="income"
                  checked={type === 'income'}
                  onChange={(e) => setType(e.target.value as 'income' | 'expense')}
                  className="w-4 h-4"
                />
                <span className="text-sm">Thu</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="expense"
                  checked={type === 'expense'}
                  onChange={(e) => setType(e.target.value as 'income' | 'expense')}
                  className="w-4 h-4"
                />
                <span className="text-sm">Chi</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục *</label>
            <select
              {...register('category')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Chọn danh mục</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'rent' && 'Tiền thuê'}
                  {cat === 'service_fee' && 'Phí dịch vụ'}
                  {cat === 'deposit_refund' && 'Hoàn cọc'}
                  {cat === 'other_income' && 'Thu khác'}
                  {cat === 'repair' && 'Sửa chữa'}
                  {cat === 'maintenance' && 'Bảo trì'}
                  {cat === 'utilities' && 'Điện nước'}
                  {cat === 'brokerage' && 'Môi giới'}
                  {cat === 'cleaning' && 'Vệ sinh'}
                  {cat === 'other_expense' && 'Chi khác'}
                </option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền *</label>
            <input
              {...register('amount', { valueAsNumber: true })}
              type="number"
              min="0"
              step="1000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
            {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày *</label>
            <input
              {...register('transaction_date')}
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
            <textarea
              {...register('note')}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ghi chú..."
            />
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
              {isSubmitting ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
