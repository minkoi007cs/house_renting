import { PropertyAnalytics } from '@/hooks/useAnalytics';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

interface AnalyticsTabProps {
  analytics: PropertyAnalytics | null;
  isLoading: boolean;
}

export const AnalyticsTab = ({ analytics, isLoading }: AnalyticsTabProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="bg-gray-50 p-6 rounded text-center text-gray-500">
        Không có dữ liệu thống kê
      </div>
    );
  }

  const { summary, by_category, units_breakdown } = analytics;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng thu nhập</p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                {summary.total_income.toLocaleString('vi-VN')} VND
              </p>
            </div>
            <TrendingUp className="text-green-600" size={32} />
          </div>
        </div>

        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng chi phí</p>
              <p className="text-2xl font-bold text-red-600 mt-2">
                {summary.total_expense.toLocaleString('vi-VN')} VND
              </p>
            </div>
            <TrendingDown className="text-red-600" size={32} />
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Lợi nhuận ròng</p>
              <p className={`text-2xl font-bold mt-2 ${summary.net_profit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {summary.net_profit.toLocaleString('vi-VN')} VND
              </p>
            </div>
            <BarChart3 className="text-blue-600" size={32} />
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      {Object.keys(by_category).length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân tích theo danh mục</h3>
          <div className="space-y-3">
            {Object.entries(by_category).map(([category, amount]) => {
              const percentage = (Math.abs(amount) / (summary.total_income + summary.total_expense)) * 100 || 0;
              return (
                <div key={category}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">{category}</span>
                    <span className={`font-semibold ${amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {amount.toLocaleString('vi-VN')} VND
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${amount >= 0 ? 'bg-green-600' : 'bg-red-600'}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Units Breakdown */}
      {units_breakdown && units_breakdown.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân tích theo phòng</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Phòng</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Thu nhập</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Chi phí</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Lợi nhuận</th>
                </tr>
              </thead>
              <tbody>
                {units_breakdown.map((unit) => {
                  const unitIncome = unit.income || 0;
                  const unitExpense = unit.expense || 0;
                  const unitProfit = unitIncome - unitExpense;
                  return (
                    <tr key={unit.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{unit.name}</td>
                      <td className="px-4 py-3 text-right text-sm text-green-600">
                        {unitIncome.toLocaleString('vi-VN')} VND
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-red-600">
                        {unitExpense.toLocaleString('vi-VN')} VND
                      </td>
                      <td className={`px-4 py-3 text-right text-sm font-semibold ${unitProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                        {unitProfit.toLocaleString('vi-VN')} VND
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
