import { useState } from 'react';
import { Plus, Edit, Trash2, Phone, Mail } from 'lucide-react';
import { Tenant, Unit } from '@/types';
import { CreateTenantForm } from '@/components/forms/CreateTenantForm';
import { EditTenantForm } from '@/components/forms/EditTenantForm';

interface TenantsTabProps {
  tenants: Tenant[];
  units: Unit[];
  isLoading: boolean;
  onCreateTenant: (data: any) => Promise<void>;
  onUpdateTenant: (id: string, data: any) => Promise<void>;
  onDeleteTenant: (id: string) => Promise<void>;
}

export const TenantsTab = ({
  tenants,
  units,
  isLoading,
  onCreateTenant,
  onUpdateTenant,
  onDeleteTenant,
}: TenantsTabProps) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (data: any) => {
    setIsSubmitting(true);
    try {
      await onCreateTenant(data);
      setShowCreateForm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: any) => {
    if (!editingTenant) return;
    setIsSubmitting(true);
    try {
      await onUpdateTenant(editingTenant.id, data);
      setEditingTenant(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa người thuê này?')) {
      try {
        await onDeleteTenant(id);
      } catch (err) {
        console.error('Failed to delete tenant:', err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Danh sách người thuê</h3>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          <Plus size={18} />
          Thêm người thuê
        </button>
      </div>

      {tenants.length === 0 ? (
        <div className="bg-gray-50 p-6 rounded text-center text-gray-500">
          Chưa có người thuê nào
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tên</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Liên hệ</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Địa chỉ</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((tenant) => (
                <tr key={tenant.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{tenant.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div className="space-y-1">
                      {tenant.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone size={14} />
                          {tenant.phone}
                        </div>
                      )}
                      {tenant.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail size={14} />
                          {tenant.email}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{tenant.address || '-'}</td>
                  <td className="px-4 py-3 text-right text-sm flex justify-end gap-2">
                    <button
                      onClick={() => setEditingTenant(tenant)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(tenant.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showCreateForm && (
        <CreateTenantForm
          units={units}
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreate}
          isSubmitting={isSubmitting}
        />
      )}

      {editingTenant && (
        <EditTenantForm
          tenant={editingTenant}
          onClose={() => setEditingTenant(null)}
          onSubmit={handleUpdate}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};
