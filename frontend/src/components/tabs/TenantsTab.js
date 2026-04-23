import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Plus, Edit, Trash2, Phone, Mail } from 'lucide-react';
import { CreateTenantForm } from '@/components/forms/CreateTenantForm';
import { EditTenantForm } from '@/components/forms/EditTenantForm';
export const TenantsTab = ({ tenants, units, isLoading, onCreateTenant, onUpdateTenant, onDeleteTenant, }) => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingTenant, setEditingTenant] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleCreate = async (data) => {
        setIsSubmitting(true);
        try {
            await onCreateTenant(data);
            setShowCreateForm(false);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleUpdate = async (data) => {
        if (!editingTenant)
            return;
        setIsSubmitting(true);
        try {
            await onUpdateTenant(editingTenant.id, data);
            setEditingTenant(null);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleDelete = async (id) => {
        if (confirm('Bạn có chắc chắn muốn xóa người thuê này?')) {
            try {
                await onDeleteTenant(id);
            }
            catch (err) {
                console.error('Failed to delete tenant:', err);
            }
        }
    };
    if (isLoading) {
        return (_jsx("div", { className: "flex justify-center items-center h-32", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" }) }));
    }
    return (_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Danh s\u00E1ch ng\u01B0\u1EDDi thu\u00EA" }), _jsxs("button", { onClick: () => setShowCreateForm(true), className: "flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition", children: [_jsx(Plus, { size: 18 }), "Th\u00EAm ng\u01B0\u1EDDi thu\u00EA"] })] }), tenants.length === 0 ? (_jsx("div", { className: "bg-gray-50 p-6 rounded text-center text-gray-500", children: "Ch\u01B0a c\u00F3 ng\u01B0\u1EDDi thu\u00EA n\u00E0o" })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-gray-50 border-b border-gray-200", children: [_jsx("th", { className: "px-4 py-3 text-left text-sm font-semibold text-gray-700", children: "T\u00EAn" }), _jsx("th", { className: "px-4 py-3 text-left text-sm font-semibold text-gray-700", children: "Li\u00EAn h\u1EC7" }), _jsx("th", { className: "px-4 py-3 text-left text-sm font-semibold text-gray-700", children: "\u0110\u1ECBa ch\u1EC9" }), _jsx("th", { className: "px-4 py-3 text-right text-sm font-semibold text-gray-700", children: "H\u00E0nh \u0111\u1ED9ng" })] }) }), _jsx("tbody", { children: tenants.map((tenant) => (_jsxs("tr", { className: "border-b border-gray-200 hover:bg-gray-50", children: [_jsx("td", { className: "px-4 py-3 text-sm font-medium text-gray-900", children: tenant.name }), _jsx("td", { className: "px-4 py-3 text-sm text-gray-600", children: _jsxs("div", { className: "space-y-1", children: [tenant.phone && (_jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx(Phone, { size: 14 }), tenant.phone] })), tenant.email && (_jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx(Mail, { size: 14 }), tenant.email] }))] }) }), _jsx("td", { className: "px-4 py-3 text-sm text-gray-600", children: tenant.address || '-' }), _jsxs("td", { className: "px-4 py-3 text-right text-sm flex justify-end gap-2", children: [_jsx("button", { onClick: () => setEditingTenant(tenant), className: "p-2 text-blue-600 hover:bg-blue-50 rounded transition", children: _jsx(Edit, { size: 18 }) }), _jsx("button", { onClick: () => handleDelete(tenant.id), className: "p-2 text-red-600 hover:bg-red-50 rounded transition", children: _jsx(Trash2, { size: 18 }) })] })] }, tenant.id))) })] }) })), showCreateForm && (_jsx(CreateTenantForm, { units: units, onClose: () => setShowCreateForm(false), onSubmit: handleCreate, isSubmitting: isSubmitting })), editingTenant && (_jsx(EditTenantForm, { tenant: editingTenant, onClose: () => setEditingTenant(null), onSubmit: handleUpdate, isSubmitting: isSubmitting }))] }));
};
