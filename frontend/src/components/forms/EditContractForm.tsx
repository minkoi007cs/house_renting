import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { RentalContract, Unit } from '@/types';

const contractSchema = z.object({
  unit_id: z.string().min(1, 'Vui lòng chọn phòng'),
  start_date: z.string().min(1, 'Ngày bắt đầu không được để trống'),
  end_date: z.string().optional(),
  rent_amount: z.number().min(0, 'Tiền thuê phải lớn hơn 0'),
  deposit_amount: z.number().min(0).optional(),
  payment_cycle: z.string().optional(),
  status: z.enum(['draft', 'signed', 'active', 'expired', 'terminated', 'renewed']).optional(),
  notes: z.string().max(1000).optional(),
});

type ContractFormData = z.infer<typeof contractSchema>;

interface EditContractFormProps {
  contract: RentalContract;
  units: Unit[];
  onClose: () => void;
  onSubmit: (data: ContractFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export const EditContractForm = ({
  contract,
  units,
  onClose,
  onSubmit,
  isSubmitting = false,
}: EditContractFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<ContractFormData>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      unit_id: contract.unit_id,
      start_date: contract.start_date.split('T')[0],
      end_date: contract.end_date ? contract.end_date.split('T')[0] : '',
      rent_amount: contract.rent_amount,
      deposit_amount: contract.deposit_amount,
      payment_cycle: contract.payment_cycle,
      status: contract.status,
      notes: contract.notes,
    },
  });

  const handleSubmitForm = async (data: ContractFormData) => {
    try {
      setError(null);
      await onSubmit(data);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi cập nhật hợp đồng');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-900">Chỉnh sửa hợp đồng</h2>
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
              Phòng *
            </label>
            <select
              {...register('unit_id')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Chọn phòng</option>
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name}
                </option>
              ))}
            </select>
            {errors.unit_id && <p className="mt-1 text-sm text-red-600">{errors.unit_id.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày bắt đầu *
            </label>
            <input
              {...register('start_date')}
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.start_date && <p className="mt-1 text-sm text-red-600">{errors.start_date.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày kết thúc
            </label>
            <input
              {...register('end_date')}
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tiền thuê hàng tháng *
            </label>
            <input
              {...register('rent_amount', { valueAsNumber: true })}
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="5000000"
            />
            {errors.rent_amount && <p className="mt-1 text-sm text-red-600">{errors.rent_amount.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tiền đặt cọc
            </label>
            <input
              {...register('deposit_amount', { valueAsNumber: true })}
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chu kỳ thanh toán
            </label>
            <select
              {...register('payment_cycle')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="monthly">Hàng tháng</option>
              <option value="quarterly">Hàng quý</option>
              <option value="biannual">Nửa năm</option>
              <option value="annual">Hàng năm</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái
            </label>
            <select
              {...register('status')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="draft">Nháp</option>
              <option value="signed">Đã ký</option>
              <option value="active">Hoạt động</option>
              <option value="expired">Hết hạn</option>
              <option value="terminated">Chấm dứt</option>
              <option value="renewed">Gia hạn</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ghi chú
            </label>
            <textarea
              {...register('notes')}
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
              {isSubmitting ? 'Đang lưu...' : 'Cập nhật'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
