import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
export const CreateReminderForm = ({ onClose, onSubmit, isSubmitting = false }) => {
    const [error, setError] = useState(null);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(reminderSchema),
    });
    const handleSubmitForm = async (data) => {
        try {
            setError(null);
            await onSubmit(data);
            onClose();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Lỗi khi tạo nhắc nhở');
        }
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white rounded-lg shadow-lg max-w-md w-full mx-4", children: [_jsxs("div", { className: "flex justify-between items-center p-6 border-b border-gray-200", children: [_jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Th\u00EAm nh\u1EAFc nh\u1EDF" }), _jsx("button", { onClick: onClose, className: "text-gray-500 hover:text-gray-700", children: _jsx(X, { size: 24 }) })] }), _jsxs("form", { onSubmit: handleSubmit(handleSubmitForm), className: "p-6 space-y-4", children: [error && (_jsx("div", { className: "p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm", children: error })), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Lo\u1EA1i" }), _jsxs("select", { ...register('type'), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: [_jsx("option", { value: "", children: "Ch\u1ECDn lo\u1EA1i" }), _jsx("option", { value: "rent_payment_due", children: "Thanh to\u00E1n ti\u1EC1n thu\u00EA" }), _jsx("option", { value: "contract_expiring", children: "H\u1EE3p \u0111\u1ED3ng s\u1EAFp h\u1EBFt h\u1EA1n" }), _jsx("option", { value: "maintenance_needed", children: "C\u1EA7n b\u1EA3o tr\u00EC" }), _jsx("option", { value: "custom_task", children: "T\u00E1c v\u1EE5 t\u00F9y ch\u1EC9nh" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Ti\u00EAu \u0111\u1EC1 *" }), _jsx("input", { ...register('title'), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", placeholder: "Nh\u1EAFc nh\u1EDF..." }), errors.title && _jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.title.message })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "M\u00F4 t\u1EA3" }), _jsx("textarea", { ...register('description'), rows: 3, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", placeholder: "M\u00F4 t\u1EA3 chi ti\u1EBFt..." })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Ng\u00E0y \u0111\u1EBFn h\u1EA1n *" }), _jsx("input", { ...register('due_date'), type: "date", className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" }), errors.due_date && _jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.due_date.message })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Tr\u1EA1ng th\u00E1i" }), _jsxs("select", { ...register('status'), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: [_jsx("option", { value: "pending", children: "Ch\u01B0a ho\u00E0n th\u00E0nh" }), _jsx("option", { value: "done", children: "Ho\u00E0n th\u00E0nh" })] })] }), _jsxs("div", { className: "flex gap-3 pt-4", children: [_jsx("button", { type: "button", onClick: onClose, className: "flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium", children: "H\u1EE7y" }), _jsx("button", { type: "submit", disabled: isSubmitting, className: "flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition font-medium", children: isSubmitting ? 'Đang lưu...' : 'Thêm' })] })] })] }) }));
};
