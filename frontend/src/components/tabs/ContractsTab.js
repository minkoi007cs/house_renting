import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Plus, Edit, Trash2, Calendar, DollarSign } from 'lucide-react';
import { CreateContractForm } from '@/components/forms/CreateContractForm';
import { EditContractForm } from '@/components/forms/EditContractForm';
export const ContractsTab = ({ contracts, units, tenants, isLoading, onCreateContract, onUpdateContract, onDeleteContract, }) => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingContract, setEditingContract] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusFilter, setStatusFilter] = useState('');
    const handleCreate = async (data) => {
        setIsSubmitting(true);
        try {
            await onCreateContract(data);
            setShowCreateForm(false);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleUpdate = async (data) => {
        if (!editingContract)
            return;
        setIsSubmitting(true);
        try {
            await onUpdateContract(editingContract.id, data);
            setEditingContract(null);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleDelete = async (id) => {
        if (confirm('Bạn có chắc chắn muốn xóa hợp đồng này?')) {
            try {
                await onDeleteContract(id);
            }
            catch (err) {
                console.error('Failed to delete contract:', err);
            }
        }
    };
    const getUnitName = (unitId) => {
        return units.find(u => u.id === unitId)?.name || 'Unknown';
    };
    const filteredContracts = statusFilter
        ? contracts.filter(c => c.status === statusFilter)
        : contracts;
    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'signed': return 'bg-blue-100 text-blue-800';
            case 'draft': return 'bg-gray-100 text-gray-800';
            case 'expired': return 'bg-red-100 text-red-800';
            case 'terminated': return 'bg-red-100 text-red-800';
            case 'renewed': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const getStatusLabel = (status) => {
        switch (status) {
            case 'active': return 'Hoạt động';
            case 'signed': return 'Đã ký';
            case 'draft': return 'Nháp';
            case 'expired': return 'Hết hạn';
            case 'terminated': return 'Chấm dứt';
            case 'renewed': return 'Gia hạn';
            default: return status;
        }
    };
    if (isLoading) {
        return (_jsx("div", { className: "flex justify-center items-center h-32", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" }) }));
    }
    return (_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Danh s\u00E1ch h\u1EE3p \u0111\u1ED3ng" }), _jsxs("button", { onClick: () => setShowCreateForm(true), className: "flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition", children: [_jsx(Plus, { size: 18 }), "Th\u00EAm h\u1EE3p \u0111\u1ED3ng"] })] }), _jsx("div", { className: "mb-4", children: _jsxs("select", { value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), className: "px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: [_jsx("option", { value: "", children: "T\u1EA5t c\u1EA3 tr\u1EA1ng th\u00E1i" }), _jsx("option", { value: "active", children: "Ho\u1EA1t \u0111\u1ED9ng" }), _jsx("option", { value: "signed", children: "\u0110\u00E3 k\u00FD" }), _jsx("option", { value: "draft", children: "Nh\u00E1p" }), _jsx("option", { value: "expired", children: "H\u1EBFt h\u1EA1n" }), _jsx("option", { value: "terminated", children: "Ch\u1EA5m d\u1EE9t" }), _jsx("option", { value: "renewed", children: "Gia h\u1EA1n" })] }) }), filteredContracts.length === 0 ? (_jsx("div", { className: "bg-gray-50 p-6 rounded text-center text-gray-500", children: "Ch\u01B0a c\u00F3 h\u1EE3p \u0111\u1ED3ng n\u00E0o" })) : (_jsx("div", { className: "space-y-4", children: filteredContracts.map((contract) => (_jsx("div", { className: "border border-gray-200 rounded-lg p-4", children: _jsxs("div", { className: "flex justify-between items-start mb-3", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h4", { className: "font-semibold text-gray-900", children: getUnitName(contract.unit_id) }), _jsx("span", { className: `inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(contract.status)}`, children: getStatusLabel(contract.status) })] }), _jsxs("div", { className: "mt-2 space-y-1 text-sm text-gray-600", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Calendar, { size: 14 }), new Date(contract.start_date).toLocaleDateString('vi-VN'), " - ", contract.end_date
                                                        ? new Date(contract.end_date).toLocaleDateString('vi-VN')
                                                        : 'Không xác định'] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(DollarSign, { size: 14 }), contract.rent_amount.toLocaleString('vi-VN'), " VND / ", contract.payment_cycle === 'monthly' ? 'tháng' : contract.payment_cycle] })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => setEditingContract(contract), className: "p-2 text-blue-600 hover:bg-blue-50 rounded transition", children: _jsx(Edit, { size: 18 }) }), _jsx("button", { onClick: () => handleDelete(contract.id), className: "p-2 text-red-600 hover:bg-red-50 rounded transition", children: _jsx(Trash2, { size: 18 }) })] })] }) }, contract.id))) })), showCreateForm && (_jsx(CreateContractForm, { units: units, tenants: tenants, onClose: () => setShowCreateForm(false), onSubmit: handleCreate, isSubmitting: isSubmitting })), editingContract && (_jsx(EditContractForm, { contract: editingContract, units: units, onClose: () => setEditingContract(null), onSubmit: handleUpdate, isSubmitting: isSubmitting }))] }));
};
