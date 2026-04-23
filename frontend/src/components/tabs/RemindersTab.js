import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { CreateReminderForm } from '@/components/forms/CreateReminderForm';
export const RemindersTab = ({ reminders, isLoading, onCreateReminder, onUpdateReminder, onDeleteReminder, }) => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleCreate = async (data) => {
        setIsSubmitting(true);
        try {
            await onCreateReminder(data);
            setShowCreateForm(false);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleToggleStatus = async (reminder) => {
        try {
            await onUpdateReminder(reminder.id, {
                status: reminder.status === 'done' ? 'pending' : 'done',
            });
        }
        catch (err) {
            console.error('Failed to update reminder:', err);
        }
    };
    const handleDelete = async (id) => {
        if (confirm('Bạn có chắc chắn muốn xóa nhắc nhở này?')) {
            try {
                await onDeleteReminder(id);
            }
            catch (err) {
                console.error('Failed to delete reminder:', err);
            }
        }
    };
    if (isLoading) {
        return (_jsx("div", { className: "flex justify-center items-center h-32", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" }) }));
    }
    const getTypeLabel = (type) => {
        switch (type) {
            case 'rent_payment_due': return 'Thanh toán tiền thuê';
            case 'contract_expiring': return 'Hợp đồng sắp hết hạn';
            case 'maintenance_needed': return 'Cần bảo trì';
            case 'custom_task': return 'Tác vụ tùy chỉnh';
            default: return type;
        }
    };
    const getTypeColor = (type) => {
        switch (type) {
            case 'rent_payment_due': return 'bg-blue-100 text-blue-800';
            case 'contract_expiring': return 'bg-yellow-100 text-yellow-800';
            case 'maintenance_needed': return 'bg-orange-100 text-orange-800';
            case 'custom_task': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const pendingReminders = reminders.filter(r => r.status === 'pending');
    const doneReminders = reminders.filter(r => r.status === 'done');
    return (_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Nh\u1EAFc nh\u1EDF" }), _jsxs("button", { onClick: () => setShowCreateForm(true), className: "flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition", children: [_jsx(Plus, { size: 18 }), "Th\u00EAm nh\u1EAFc nh\u1EDF"] })] }), reminders.length === 0 ? (_jsx("div", { className: "bg-gray-50 p-6 rounded text-center text-gray-500", children: "Ch\u01B0a c\u00F3 nh\u1EAFc nh\u1EDF n\u00E0o" })) : (_jsxs("div", { className: "space-y-6", children: [pendingReminders.length > 0 && (_jsxs("div", { children: [_jsxs("h4", { className: "text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2", children: [_jsx(AlertCircle, { size: 16, className: "text-orange-600" }), "Ch\u01B0a ho\u00E0n th\u00E0nh (", pendingReminders.length, ")"] }), _jsx("div", { className: "space-y-3", children: pendingReminders.map((reminder) => (_jsx("div", { className: "border border-gray-200 rounded-lg p-4", children: _jsxs("div", { className: "flex justify-between items-start gap-4", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: () => handleToggleStatus(reminder), className: "text-gray-400 hover:text-blue-600 transition", children: _jsx(Circle, { size: 20 }) }), _jsx("h5", { className: "font-semibold text-gray-900", children: reminder.title }), _jsx("span", { className: `inline-block px-2 py-1 rounded text-xs font-medium ${getTypeColor(reminder.type)}`, children: getTypeLabel(reminder.type) })] }), reminder.description && (_jsx("p", { className: "text-sm text-gray-600 mt-2 ml-7", children: reminder.description })), _jsxs("p", { className: "text-xs text-gray-500 mt-2 ml-7", children: ["\u0110\u1EBFn h\u1EA1n: ", new Date(reminder.due_date).toLocaleDateString('vi-VN')] })] }), _jsx("button", { onClick: () => handleDelete(reminder.id), className: "p-2 text-red-600 hover:bg-red-50 rounded transition", children: _jsx(Trash2, { size: 18 }) })] }) }, reminder.id))) })] })), doneReminders.length > 0 && (_jsxs("div", { children: [_jsxs("h4", { className: "text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2", children: [_jsx(CheckCircle2, { size: 16, className: "text-green-600" }), "Ho\u00E0n th\u00E0nh (", doneReminders.length, ")"] }), _jsx("div", { className: "space-y-3", children: doneReminders.map((reminder) => (_jsx("div", { className: "border border-gray-200 rounded-lg p-4 opacity-60", children: _jsxs("div", { className: "flex justify-between items-start gap-4", children: [_jsx("div", { className: "flex-1", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: () => handleToggleStatus(reminder), className: "text-green-600 hover:text-gray-400 transition", children: _jsx(CheckCircle2, { size: 20 }) }), _jsx("h5", { className: "font-semibold text-gray-600 line-through", children: reminder.title })] }) }), _jsx("button", { onClick: () => handleDelete(reminder.id), className: "p-2 text-red-600 hover:bg-red-50 rounded transition", children: _jsx(Trash2, { size: 18 }) })] }) }, reminder.id))) })] }))] })), showCreateForm && (_jsx(CreateReminderForm, { onClose: () => setShowCreateForm(false), onSubmit: handleCreate, isSubmitting: isSubmitting }))] }));
};
