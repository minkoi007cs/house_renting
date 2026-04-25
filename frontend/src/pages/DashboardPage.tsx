import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useProperties } from '@/hooks/useProperties';
import { Navbar } from '@/components/common/Navbar';
import { CreatePropertyForm } from '@/components/forms/CreatePropertyForm';
import { Home, Users, DollarSign, TrendingUp } from 'lucide-react';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { user } = useAuthStore();
  const { properties, isLoading, fetchProperties } = useProperties();

  const occupiedUnits = 0; // TODO: Calculate
  const totalUnits = 0; // TODO: Calculate
  const totalIncome = 0; // TODO: Calculate
  const totalExpense = 0; // TODO: Calculate

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Chào mừng, {user?.name || 'Người dùng'}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Quản lý {properties.length} nhà cho thuê của bạn
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Tổng nhà</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {properties.length}
                </p>
              </div>
              <Home className="text-primary" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Đang cho thuê</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {occupiedUnits}/{totalUnits}
                </p>
              </div>
              <Users className="text-green-600" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Tổng tiền vào</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {totalIncome.toLocaleString('vi-VN')} VND
                </p>
              </div>
              <DollarSign className="text-blue-600" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Lợi nhuận</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {(totalIncome - totalExpense).toLocaleString('vi-VN')} VND
                </p>
              </div>
              <TrendingUp className="text-green-600" size={32} />
            </div>
          </div>
        </div>

        {/* Properties List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Danh sách nhà</h2>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              + Thêm nhà
            </button>
          </div>

          {isLoading ? (
            <div className="p-6 text-center text-gray-500">Đang tải...</div>
          ) : properties.length === 0 ? (
            <div className="p-12 text-center">
              <Home size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">Chưa có nhà nào</p>
              <p className="text-gray-400">Tạo nhà mới để bắt đầu quản lý</p>
              <button className="mt-4 bg-primary hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition">
                Tạo nhà mới
              </button>
            </div>
          ) : (
            <div className="divide-y">
              {properties.map((property) => (
                <div
                  key={property.id}
                  className="p-6 hover:bg-gray-50 cursor-pointer transition"
                  onClick={() => navigate(`/properties/${property.id}`)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{property.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">{property.address}</p>
                      <p className="text-gray-500 text-sm mt-2">
                        Loại: {property.type} | Status: {property.status}
                      </p>
                    </div>
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => navigate(`/properties/${property.id}`)}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        Xem
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Property Modal */}
        {showCreateForm && (
          <CreatePropertyForm
            onClose={() => setShowCreateForm(false)}
            onSuccess={() => fetchProperties()}
          />
        )}
      </div>
    </div>
  );
};
