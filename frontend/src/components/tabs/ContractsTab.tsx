import { useState } from 'react';
import { Plus, Edit, Trash2, Calendar, DollarSign } from 'lucide-react';
import { RentalContract, Unit } from '@/types';
import { CreateContractForm } from '@/components/forms/CreateContractForm';
import { EditContractForm } from '@/components/forms/EditContractForm';

interface ContractsTabProps {
  contracts: RentalContract[];
  units: Unit[];
  tenants: any[];
  isLoading: boolean;
  onCreateContract: (data: any) => Promise<void>;
  onUpdateContract: (id: string, data: any) => Promise<void>;
  onDeleteContract: (id: string) => Promise<void>;
}

export const ContractsTab = ({
  contracts,
  units,
  tenants,
  isLoading,
  onCreateContract,
  onUpdateContract,
  onDeleteContract,
}: ContractsTabProps) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingContract, setEditingContract] = useState<RentalContract | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const handleCreate = async (data: any) => {
    setIsSubmitting(true);
    try {
      await onCreateContract(data);
      setShowCreateForm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: any) => {
    if (!editingContract) return;
    setIsSubmitting(true);
    try {
      await onUpdateContract(editingContract.id, data);
      setEditingContract(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa hợp đồng này?')) {
      try {
        await onDeleteContract(id);
      } catch (err) {
        console.error('Failed to delete contract:', err);
      }
    }
  };

  const getUnitName = (unitId: string) => {
    return units.find(u => u.id === unitId)?.name || 'Unknown';
  };

  const filteredContracts = statusFilter
    ? contracts.filter(c => c.status === statusFilter)
    : contracts;

  const getStatusColor = (status: string) => {
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

  const getStatusLabel = (status: string) => {
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
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Danh sách hợp đồng</h3>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          <Plus size={18} />
          Thêm hợp đồng
        </button>
      </div>

      <div className="mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="signed">Đã ký</option>
          <option value="draft">Nháp</option>
          <option value="expired">Hết hạn</option>
          <option value="terminated">Chấm dứt</option>
          <option value="renewed">Gia hạn</option>
        </select>
      </div>

      {filteredContracts.length === 0 ? (
        <div className="bg-gray-50 p-6 rounded text-center text-gray-500">
          Chưa có hợp đồng nào
        </div>
      ) : (
        <div className="space-y-4">
          {filteredContracts.map((contract) => (
            <div key={contract.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900">{getUnitName(contract.unit_id)}</h4>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(contract.status)}`}>
                      {getStatusLabel(contract.status)}
                    </span>
                  </div>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      {new Date(contract.start_date).toLocaleDateString('vi-VN')} - {
                        contract.end_date
                          ? new Date(contract.end_date).toLocaleDateString('vi-VN')
                          : 'Không xác định'
                      }
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign size={14} />
                      {contract.rent_amount.toLocaleString('vi-VN')} VND / {contract.payment_cycle === 'monthly' ? 'tháng' : contract.payment_cycle}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingContract(contract)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(contract.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateForm && (
        <CreateContractForm
          units={units}
          tenants={tenants}
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreate}
          isSubmitting={isSubmitting}
        />
      )}

      {editingContract && (
        <EditContractForm
          contract={editingContract}
          units={units}
          onClose={() => setEditingContract(null)}
          onSubmit={handleUpdate}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};
