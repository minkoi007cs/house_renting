import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
const unitSchema = z.object({
    name: z.string().min(1, 'Tên phòng không được để trống').max(255),
    status: z.enum(['available', 'occupied', 'maintenance', 'unavailable']).optional(),
    description: z.string().max(1000).optional(),
});
export const EditUnitForm = ({ unit, onClose, onSubmit, isSubmitting = false }) => {
    const [error, setError] = useState(null);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(unitSchema),
        defaultValues: {
            name: unit.name,
            status: unit.status,
            description: unit.description,
        },
    });
    const handleSubmitForm = async (data) => {
        try {
            setError(null);
            await onSubmit(data);
            onClose();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Lỗi khi cập nhật phòng');
        }
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white rounded-lg shadow-lg max-w-md w-full mx-4", children: [_jsxs("div", { className: "flex justify-between items-center p-6 border-b border-gray-200", children: [_jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Ch\u1EC9nh s\u1EEDa ph\u00F2ng" }), _jsx("button", { onClick: onClose, className: "text-gray-500 hover:text-gray-700", children: _jsx(X, { size: 24 }) })] }), _jsxs("form", { onSubmit: handleSubmit(handleSubmitForm), className: "p-6 space-y-4", children: [error && (_jsx("div", { className: "p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm", children: error })), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "T\u00EAn ph\u00F2ng *" }), _jsx("input", { ...register('name'), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", placeholder: "Ph\u00F2ng 101" }), errors.name && _jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.name.message })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Tr\u1EA1ng th\u00E1i" }), _jsxs("select", { ...register('status'), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: [_jsx("option", { value: "available", children: "Tr\u1ED1ng" }), _jsx("option", { value: "occupied", children: "\u0110\u00E3 cho thu\u00EA" }), _jsx("option", { value: "maintenance", children: "B\u1EA3o tr\u00EC" }), _jsx("option", { value: "unavailable", children: "Kh\u00F4ng kh\u1EA3 d\u1EE5ng" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "M\u00F4 t\u1EA3" }), _jsx("textarea", { ...register('description'), rows: 3, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", placeholder: "M\u00F4 t\u1EA3 ph\u00F2ng..." })] }), _jsxs("div", { className: "flex gap-3 pt-4", children: [_jsx("button", { type: "button", onClick: onClose, className: "flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium", children: "H\u1EE7y" }), _jsx("button", { type: "submit", disabled: isSubmitting, className: "flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition font-medium", children: isSubmitting ? 'Đang lưu...' : 'Cập nhật' })] })] })] }) }));
};
