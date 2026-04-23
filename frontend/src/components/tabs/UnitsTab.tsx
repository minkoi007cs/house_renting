import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Unit } from '@/types';
import { CreateUnitForm } from '@/components/forms/CreateUnitForm';
import { EditUnitForm } from '@/components/forms/EditUnitForm';

interface UnitsTabProps {
  units: Unit[];
  isLoading: boolean;
  onCreateUnit: (data: any) => Promise<void>;
  onUpdateUnit: (id: string, data: any) => Promise<void>;
  onDeleteUnit: (id: string) => Promise<void>;
}

export const UnitsTab = ({
  units,
  isLoading,
  onCreateUnit,
  onUpdateUnit,
  onDeleteUnit,
}: UnitsTabProps) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (data: any) => {
    setIsSubmitting(true);
    try {
      await onCreateUnit(data);
      setShowCreateForm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: any) => {
    if (!editingUnit) return;
    setIsSubmitting(true);
    try {
      await onUpdateUnit(editingUnit.id, data);
      setEditingUnit(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa phòng này?')) {
      try {
        await onDeleteUnit(id);
      } catch (err) {
        console.error('Failed to delete unit:', err);
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
        <h3 className="text-lg font-semibold">Danh sách phòng</h3>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          <Plus size={18} />
          Thêm phòng
        </button>
      </div>

      {units.length === 0 ? (
        <div className="bg-gray-50 p-6 rounded text-center text-gray-500">
          Chưa có phòng nào
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {units.map((unit) => (
            <div key={unit.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{unit.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      unit.status === 'available' ? 'bg-green-100 text-green-800' :
                      unit.status === 'occupied' ? 'bg-blue-100 text-blue-800' :
                      unit.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {unit.status === 'available' && 'Trống'}
                      {unit.status === 'occupied' && 'Đã cho thuê'}
                      {unit.status === 'maintenance' && 'Bảo trì'}
                      {unit.status === 'unavailable' && 'Không khả dụng'}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingUnit(unit)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(unit.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              {unit.description && (
                <p className="text-sm text-gray-600">{unit.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {showCreateForm && (
        <CreateUnitForm
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreate}
          isSubmitting={isSubmitting}
        />
      )}

      {editingUnit && (
        <EditUnitForm
          unit={editingUnit}
          onClose={() => setEditingUnit(null)}
          onSubmit={handleUpdate}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};
