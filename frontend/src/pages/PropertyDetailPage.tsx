import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/common/Navbar';
import api from '@/services/api';
import { Property } from '@/types';
import { ArrowLeft, Edit, Trash2, Plus } from 'lucide-react';

export const PropertyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await api.get(`/properties/${id}`);
        setProperty(response.data.data);
      } catch (error) {
        console.error('Failed to fetch property:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 pt-24">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 pt-24">
          <p className="text-gray-500">Không tìm thấy nhà này</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft size={20} />
            Quay lại
          </button>

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{property.name}</h1>
              <p className="text-gray-600 mt-2">{property.address}</p>
              <div className="mt-4 flex gap-4">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {property.type}
                </span>
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {property.status}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                <Edit size={18} />
                Sửa
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition">
                <Trash2 size={18} />
                Xóa
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200 overflow-x-auto">
            <div className="flex">
              {['overview', 'units', 'tenants', 'contracts', 'finance', 'documents', 'reminders', 'analytics'].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition ${
                      activeTab === tab
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab === 'overview' && 'Tổng quan'}
                    {tab === 'units' && 'Phòng'}
                    {tab === 'tenants' && 'Người thuê'}
                    {tab === 'contracts' && 'Hợp đồng'}
                    {tab === 'finance' && 'Tài chính'}
                    {tab === 'documents' && 'Tài liệu'}
                    {tab === 'reminders' && 'Nhắc nhở'}
                    {tab === 'analytics' && 'Thống kê'}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Thông tin</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Loại</p>
                      <p className="font-medium">{property.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Trạng thái</p>
                      <p className="font-medium">{property.status}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Mô tả</p>
                      <p className="font-medium">{property.description || '-'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Thống kê tháng này</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 rounded">
                      <p className="text-sm text-gray-600">Thu tiền</p>
                      <p className="font-semibold text-green-600">0 VND</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded">
                      <p className="text-sm text-gray-600">Chi tiêu</p>
                      <p className="font-semibold text-red-600">0 VND</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded">
                      <p className="text-sm text-gray-600">Lợi nhuận</p>
                      <p className="font-semibold text-blue-600">0 VND</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'units' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Danh sách phòng</h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                    <Plus size={18} />
                    Thêm phòng
                  </button>
                </div>
                <div className="bg-gray-50 p-6 rounded text-center text-gray-500">
                  Chưa có phòng nào
                </div>
              </div>
            )}

            {activeTab === 'tenants' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Danh sách người thuê</h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                    <Plus size={18} />
                    Thêm người thuê
                  </button>
                </div>
                <div className="bg-gray-50 p-6 rounded text-center text-gray-500">
                  Chưa có người thuê nào
                </div>
              </div>
            )}

            {activeTab === 'contracts' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Danh sách hợp đồng</h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                    <Plus size={18} />
                    Thêm hợp đồng
                  </button>
                </div>
                <div className="bg-gray-50 p-6 rounded text-center text-gray-500">
                  Chưa có hợp đồng nào
                </div>
              </div>
            )}

            {activeTab === 'finance' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Ghi nhận giao dịch</h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                    <Plus size={18} />
                    Thêm giao dịch
                  </button>
                </div>
                <div className="bg-gray-50 p-6 rounded text-center text-gray-500">
                  Chưa có giao dịch nào
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Tài liệu và ảnh</h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                    <Plus size={18} />
                    Tải lên
                  </button>
                </div>
                <div className="bg-gray-50 p-6 rounded text-center text-gray-500">
                  Chưa có tài liệu nào
                </div>
              </div>
            )}

            {activeTab === 'reminders' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Nhắc nhở</h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                    <Plus size={18} />
                    Thêm nhắc nhở
                  </button>
                </div>
                <div className="bg-gray-50 p-6 rounded text-center text-gray-500">
                  Chưa có nhắc nhở nào
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div>
                <h3 className="text-lg font-semibold mb-6">Thống kê chi tiết</h3>
                <div className="bg-gray-50 p-6 rounded text-center text-gray-500">
                  Dữ liệu thống kê sẽ hiển thị ở đây
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
