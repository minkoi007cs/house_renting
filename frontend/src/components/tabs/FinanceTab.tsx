import { useState } from 'react';
import { Transaction } from '@/types';

interface FinanceTabProps {
  transactions: Transaction[];
  isLoading: boolean;
}

export const FinanceTab = ({ transactions, isLoading }: FinanceTabProps) => {
  const [filterType, setFilterType] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const filteredTransactions = transactions.filter(t => {
    if (filterType && t.type !== filterType) return false;
    if (filterCategory && t.category !== filterCategory) return false;
    return true;
  });

  const categories = [...new Set(transactions.map(t => t.category))];
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  const categoryBreakdown = categories.reduce((acc, cat) => {
    const amount = transactions
      .filter(t => t.category === cat)
      .reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0);
    return { ...acc, [cat]: amount };
  }, {} as Record<string, number>);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-gray-600">Tổng tiền vào</p>
          <p className="text-2xl font-bold text-green-600 mt-2">
            {totalIncome.toLocaleString('vi-VN')} VND
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-sm text-gray-600">Tổng chi tiêu</p>
          <p className="text-2xl font-bold text-red-600 mt-2">
            {totalExpense.toLocaleString('vi-VN')} VND
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-600">Lợi nhuận</p>
          <p className="text-2xl font-bold text-blue-600 mt-2">
            {(totalIncome - totalExpense).toLocaleString('vi-VN')} VND
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-4">Phân loại chi tiêu</h4>
          <div className="space-y-3">
            {Object.entries(categoryBreakdown).map(([cat, amount]) => (
              <div key={cat} className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">{cat}</span>
                <span className={`font-medium ${amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {amount.toLocaleString('vi-VN')} VND
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Bộ lọc</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại giao dịch
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tất cả</option>
                <option value="income">Thu tiền</option>
                <option value="expense">Chi tiêu</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Danh mục
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tất cả danh mục</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-900 mb-4">Danh sách giao dịch</h4>
        {filteredTransactions.length === 0 ? (
          <div className="bg-gray-50 p-6 rounded text-center text-gray-500">
            Không có giao dịch nào
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ngày</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Danh mục</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Loại</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Số tiền</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {new Date(tx.transaction_date).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{tx.category}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        tx.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {tx.type === 'income' ? 'Thu tiền' : 'Chi tiêu'}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-right text-sm font-medium ${
                      tx.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {tx.amount.toLocaleString('vi-VN')} VND
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
