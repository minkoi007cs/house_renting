import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
const INCOME_CATEGORIES = ['rent', 'service_fee', 'deposit_refund', 'other_income'];
const EXPENSE_CATEGORIES = ['repair', 'maintenance', 'utilities', 'brokerage', 'cleaning', 'other_expense'];
export const CreateTransactionForm = ({ propertyId, onClose, onSuccess, }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [type, setType] = useState('income');
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(transactionSchema),
        defaultValues: { type: 'income', transaction_date: new Date().toISOString().split('T')[0] },
    });
    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            setError(null);
            await api.post(`/properties/${propertyId}/transactions`, {
                ...data,
                type: data.type || type,
            });
            onSuccess();
            onClose();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Lỗi khi tạo giao dịch');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white rounded-lg shadow-lg max-w-md w-full mx-4", children: [_jsxs("div", { className: "flex justify-between items-center p-6 border-b border-gray-200", children: [_jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Ghi nh\u1EADn giao d\u1ECBch" }), _jsx("button", { onClick: onClose, className: "text-gray-500 hover:text-gray-700", children: _jsx(X, { size: 24 }) })] }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "p-6 space-y-4", children: [error && (_jsx("div", { className: "p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm", children: error })), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Lo\u1EA1i *" }), _jsxs("div", { className: "flex gap-4", children: [_jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "radio", value: "income", checked: type === 'income', onChange: (e) => setType(e.target.value), className: "w-4 h-4" }), _jsx("span", { className: "text-sm", children: "Thu" })] }), _jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "radio", value: "expense", checked: type === 'expense', onChange: (e) => setType(e.target.value), className: "w-4 h-4" }), _jsx("span", { className: "text-sm", children: "Chi" })] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Danh m\u1EE5c *" }), _jsxs("select", { ...register('category'), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: [_jsx("option", { value: "", children: "Ch\u1ECDn danh m\u1EE5c" }), categories.map((cat) => (_jsxs("option", { value: cat, children: [cat === 'rent' && 'Tiền thuê', cat === 'service_fee' && 'Phí dịch vụ', cat === 'deposit_refund' && 'Hoàn cọc', cat === 'other_income' && 'Thu khác', cat === 'repair' && 'Sửa chữa', cat === 'maintenance' && 'Bảo trì', cat === 'utilities' && 'Điện nước', cat === 'brokerage' && 'Môi giới', cat === 'cleaning' && 'Vệ sinh', cat === 'other_expense' && 'Chi khác'] }, cat)))] }), errors.category && _jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.category.message })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "S\u1ED1 ti\u1EC1n *" }), _jsx("input", { ...register('amount', { valueAsNumber: true }), type: "number", min: "0", step: "1000", className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", placeholder: "0" }), errors.amount && _jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.amount.message })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Ng\u00E0y *" }), _jsx("input", { ...register('transaction_date'), type: "date", className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Ghi ch\u00FA" }), _jsx("textarea", { ...register('note'), rows: 2, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", placeholder: "Ghi ch\u00FA..." })] }), _jsxs("div", { className: "flex gap-3 pt-4", children: [_jsx("button", { type: "button", onClick: onClose, className: "flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium", children: "H\u1EE7y" }), _jsx("button", { type: "submit", disabled: isSubmitting, className: "flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition font-medium", children: isSubmitting ? 'Đang lưu...' : 'Lưu' })] })] })] }) }));
};
