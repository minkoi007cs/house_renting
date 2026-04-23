import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
const tenantSchema = z.object({
    unit_id: z.string().min(1, 'Vui lòng chọn phòng'),
    name: z.string().min(1, 'Tên người thuê không được để trống').max(255),
    email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
    phone: z.string().optional(),
    address: z.string().optional(),
    notes: z.string().max(1000).optional(),
});
export const CreateTenantForm = ({ units = [], onClose, onSubmit, isSubmitting = false }) => {
    const [error, setError] = useState(null);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(tenantSchema),
    });
    const handleSubmitForm = async (data) => {
        try {
            setError(null);
            await onSubmit(data);
            onClose();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Lỗi khi tạo người thuê');
        }
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white", children: [_jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Th\u00EAm ng\u01B0\u1EDDi thu\u00EA" }), _jsx("button", { onClick: onClose, className: "text-gray-500 hover:text-gray-700", children: _jsx(X, { size: 24 }) })] }), _jsxs("form", { onSubmit: handleSubmit(handleSubmitForm), className: "p-6 space-y-4", children: [error && (_jsx("div", { className: "p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm", children: error })), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Ph\u00F2ng *" }), _jsxs("select", { ...register('unit_id'), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: [_jsx("option", { value: "", children: "Ch\u1ECDn ph\u00F2ng" }), units.map((unit) => (_jsx("option", { value: unit.id, children: unit.name }, unit.id)))] }), errors.unit_id && _jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.unit_id.message })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "T\u00EAn *" }), _jsx("input", { ...register('name'), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", placeholder: "Nguy\u1EC5n V\u0103n A" }), errors.name && _jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.name.message })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Email" }), _jsx("input", { ...register('email'), type: "email", className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", placeholder: "email@example.com" }), errors.email && _jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.email.message })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i" }), _jsx("input", { ...register('phone'), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", placeholder: "0901234567" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "\u0110\u1ECBa ch\u1EC9" }), _jsx("input", { ...register('address'), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", placeholder: "\u0110\u1ECBa ch\u1EC9..." })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Ghi ch\u00FA" }), _jsx("textarea", { ...register('notes'), rows: 2, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", placeholder: "Ghi ch\u00FA..." })] }), _jsxs("div", { className: "flex gap-3 pt-4", children: [_jsx("button", { type: "button", onClick: onClose, className: "flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium", children: "H\u1EE7y" }), _jsx("button", { type: "submit", disabled: isSubmitting, className: "flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition font-medium", children: isSubmitting ? 'Đang lưu...' : 'Thêm' })] })] })] }) }));
};
