import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
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
export const EditContractForm = ({ contract, units, onClose, onSubmit, isSubmitting = false, }) => {
    const [error, setError] = useState(null);
    const { register, handleSubmit, formState: { errors } } = useForm({
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
    const handleSubmitForm = async (data) => {
        try {
            setError(null);
            await onSubmit(data);
            onClose();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Lỗi khi cập nhật hợp đồng');
        }
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white", children: [_jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Ch\u1EC9nh s\u1EEDa h\u1EE3p \u0111\u1ED3ng" }), _jsx("button", { onClick: onClose, className: "text-gray-500 hover:text-gray-700", children: _jsx(X, { size: 24 }) })] }), _jsxs("form", { onSubmit: handleSubmit(handleSubmitForm), className: "p-6 space-y-4", children: [error && (_jsx("div", { className: "p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm", children: error })), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Ph\u00F2ng *" }), _jsxs("select", { ...register('unit_id'), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: [_jsx("option", { value: "", children: "Ch\u1ECDn ph\u00F2ng" }), units.map((unit) => (_jsx("option", { value: unit.id, children: unit.name }, unit.id)))] }), errors.unit_id && _jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.unit_id.message })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Ng\u00E0y b\u1EAFt \u0111\u1EA7u *" }), _jsx("input", { ...register('start_date'), type: "date", className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" }), errors.start_date && _jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.start_date.message })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Ng\u00E0y k\u1EBFt th\u00FAc" }), _jsx("input", { ...register('end_date'), type: "date", className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Ti\u1EC1n thu\u00EA h\u00E0ng th\u00E1ng *" }), _jsx("input", { ...register('rent_amount', { valueAsNumber: true }), type: "number", className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", placeholder: "5000000" }), errors.rent_amount && _jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.rent_amount.message })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Ti\u1EC1n \u0111\u1EB7t c\u1ECDc" }), _jsx("input", { ...register('deposit_amount', { valueAsNumber: true }), type: "number", className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", placeholder: "0" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Chu k\u1EF3 thanh to\u00E1n" }), _jsxs("select", { ...register('payment_cycle'), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: [_jsx("option", { value: "monthly", children: "H\u00E0ng th\u00E1ng" }), _jsx("option", { value: "quarterly", children: "H\u00E0ng qu\u00FD" }), _jsx("option", { value: "biannual", children: "N\u1EEDa n\u0103m" }), _jsx("option", { value: "annual", children: "H\u00E0ng n\u0103m" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Tr\u1EA1ng th\u00E1i" }), _jsxs("select", { ...register('status'), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: [_jsx("option", { value: "draft", children: "Nh\u00E1p" }), _jsx("option", { value: "signed", children: "\u0110\u00E3 k\u00FD" }), _jsx("option", { value: "active", children: "Ho\u1EA1t \u0111\u1ED9ng" }), _jsx("option", { value: "expired", children: "H\u1EBFt h\u1EA1n" }), _jsx("option", { value: "terminated", children: "Ch\u1EA5m d\u1EE9t" }), _jsx("option", { value: "renewed", children: "Gia h\u1EA1n" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Ghi ch\u00FA" }), _jsx("textarea", { ...register('notes'), rows: 2, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", placeholder: "Ghi ch\u00FA..." })] }), _jsxs("div", { className: "flex gap-3 pt-4", children: [_jsx("button", { type: "button", onClick: onClose, className: "flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium", children: "H\u1EE7y" }), _jsx("button", { type: "submit", disabled: isSubmitting, className: "flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition font-medium", children: isSubmitting ? 'Đang lưu...' : 'Cập nhật' })] })] })] }) }));
};
