import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { CreateUnitForm } from '@/components/forms/CreateUnitForm';
import { EditUnitForm } from '@/components/forms/EditUnitForm';
export const UnitsTab = ({ units, isLoading, onCreateUnit, onUpdateUnit, onDeleteUnit, }) => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingUnit, setEditingUnit] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleCreate = async (data) => {
        setIsSubmitting(true);
        try {
            await onCreateUnit(data);
            setShowCreateForm(false);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleUpdate = async (data) => {
        if (!editingUnit)
            return;
        setIsSubmitting(true);
        try {
            await onUpdateUnit(editingUnit.id, data);
            setEditingUnit(null);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleDelete = async (id) => {
        if (confirm('Bạn có chắc chắn muốn xóa phòng này?')) {
            try {
                await onDeleteUnit(id);
            }
            catch (err) {
                console.error('Failed to delete unit:', err);
            }
        }
    };
    if (isLoading) {
        return (_jsx("div", { className: "flex justify-center items-center h-32", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" }) }));
    }
    return (_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Danh s\u00E1ch ph\u00F2ng" }), _jsxs("button", { onClick: () => setShowCreateForm(true), className: "flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition", children: [_jsx(Plus, { size: 18 }), "Th\u00EAm ph\u00F2ng"] })] }), units.length === 0 ? (_jsx("div", { className: "bg-gray-50 p-6 rounded text-center text-gray-500", children: "Ch\u01B0a c\u00F3 ph\u00F2ng n\u00E0o" })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: units.map((unit) => (_jsxs("div", { className: "border border-gray-200 rounded-lg p-4", children: [_jsxs("div", { className: "flex justify-between items-start mb-3", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-gray-900", children: unit.name }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: _jsxs("span", { className: `inline-block px-2 py-1 rounded text-xs font-medium ${unit.status === 'available' ? 'bg-green-100 text-green-800' :
                                                    unit.status === 'occupied' ? 'bg-blue-100 text-blue-800' :
                                                        unit.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-gray-100 text-gray-800'}`, children: [unit.status === 'available' && 'Trống', unit.status === 'occupied' && 'Đã cho thuê', unit.status === 'maintenance' && 'Bảo trì', unit.status === 'unavailable' && 'Không khả dụng'] }) })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => setEditingUnit(unit), className: "p-2 text-blue-600 hover:bg-blue-50 rounded transition", children: _jsx(Edit, { size: 18 }) }), _jsx("button", { onClick: () => handleDelete(unit.id), className: "p-2 text-red-600 hover:bg-red-50 rounded transition", children: _jsx(Trash2, { size: 18 }) })] })] }), unit.description && (_jsx("p", { className: "text-sm text-gray-600", children: unit.description }))] }, unit.id))) })), showCreateForm && (_jsx(CreateUnitForm, { onClose: () => setShowCreateForm(false), onSubmit: handleCreate, isSubmitting: isSubmitting })), editingUnit && (_jsx(EditUnitForm, { unit: editingUnit, onClose: () => setEditingUnit(null), onSubmit: handleUpdate, isSubmitting: isSubmitting }))] }));
};
