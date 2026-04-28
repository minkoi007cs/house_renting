import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/services/api';
import { Modal } from '@/components/common/Modal';
import { TX_CATEGORY_LABELS } from '@/utils/labels';

const INCOME_CATS = ['rent', 'service_fee', 'deposit_received', 'deposit_refund', 'other_income'];
const EXPENSE_CATS = ['repair', 'maintenance', 'utilities', 'brokerage', 'cleaning', 'tax', 'insurance', 'other_expense'];

const schema = z.object({
  type: z.enum(['income', 'expense']),
  category: z.string().min(1, 'Category is required'),
  amount: z.coerce.number().min(1, 'Amount must be > 0'),
  transaction_date: z.string().min(1, 'Date is required'),
  note: z.string().optional(),
  unit_id: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  propertyId: string;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Partial<FormData>;
  transactionId?: string;
}

export const CreateTransactionForm = ({
  propertyId,
  onClose,
  onSuccess,
  initialData,
  transactionId,
}: Props) => {
  const isEdit = !!transactionId;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txType, setTxType] = useState<'income' | 'expense'>(initialData?.type || 'income');

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 'income',
      transaction_date: new Date().toISOString().split('T')[0],
      ...initialData,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const payload = { ...data, type: txType };
      if (isEdit) {
        await api.patch(`/transactions/${transactionId}`, payload);
      } else {
        await api.post(`/properties/${propertyId}/transactions`, payload);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = txType === 'income' ? INCOME_CATS : EXPENSE_CATS;

  return (
    <Modal title={isEdit ? 'Edit Transaction' : 'Record Transaction'} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
        )}

        <div>
          <label className="label">Type *</label>
          <div className="flex gap-3">
            {(['income', 'expense'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTxType(t)}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition ${
                  txType === t
                    ? t === 'income'
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-700'
                      : 'bg-red-50 border-red-400 text-red-700'
                    : 'border-ink-200 text-ink-500 hover:bg-ink-50'
                }`}
              >
                {t === 'income' ? '+ Income' : '− Expense'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Category *</label>
          <select {...register('category')} className="input">
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c} value={c}>{TX_CATEGORY_LABELS[c] || c}</option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Amount (USD) *</label>
            <input {...register('amount')} type="number" min="0" className="input" placeholder="0" />
            {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount.message}</p>}
          </div>
          <div>
            <label className="label">Date *</label>
            <input {...register('transaction_date')} type="date" className="input" />
          </div>
        </div>

        <div>
          <label className="label">Note</label>
          <textarea {...register('note')} rows={2} className="input" placeholder="Optional note…" />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
            {isSubmitting ? 'Saving…' : isEdit ? 'Save changes' : 'Record'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
