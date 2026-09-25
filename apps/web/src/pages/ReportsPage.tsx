import { useState } from 'react';
import {
  BarChart2,
  TrendingUp,
  TrendingDown,
  Wallet,
  Home,
  Users,
  FileText,
  Layers,
} from 'lucide-react';
import { Layout } from '@/components/common/Layout';
import { PageLoader } from '@/components/common/Spinner';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { TX_CATEGORY_LABELS } from '@/utils/labels';
import { formatCurrency, formatChartYAxis } from '@/utils/format';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';

const PIE_COLORS = ['#c9a96e', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#38bdf8', '#f472b6'];

export const ReportsPage = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { stats, isLoading, fetchStats } = useDashboardStats();

  const handleFilter = () => {
    fetchStats(startDate || undefined, endDate || undefined);
  };

  const byCategory = stats?.by_category;
  const incomePie = Object.entries(byCategory?.income || {}).map(([k, v]) => ({
    name: TX_CATEGORY_LABELS[k] || k,
    value: Number(v),
  }));
  const expensePie = Object.entries(byCategory?.expense || {}).map(([k, v]) => ({
    name: TX_CATEGORY_LABELS[k] || k,
    value: Number(v),
  }));

  return (
    <Layout title="Reports">
      <div className="space-y-6">
        {/* Date range filter */}
        <div className="card p-4 flex flex-wrap gap-3 items-end font-sans">
          <div>
            <label className="label">From</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input w-40" />
          </div>
          <div>
            <label className="label">To</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input w-40" />
          </div>
          <button onClick={handleFilter} className="btn-primary">
            Apply
          </button>
          <button
            onClick={() => {
              setStartDate('');
              setEndDate('');
              fetchStats();
            }}
            className="btn-secondary"
          >
            Reset
          </button>
        </div>

        {isLoading ? (
          <PageLoader />
        ) : !stats ? (
          <div className="card p-10 text-center text-[#f4ede0]/40 font-sans">No data available.</div>
        ) : (
          <>
            {/* Summary KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <KPI icon={Home} label="Properties" value={stats.summary.total_properties} tone="brand" />
              <KPI icon={Layers} label="Units" value={stats.summary.total_units} tone="blue" />
              <KPI icon={Users} label="Tenants" value={stats.summary.total_tenants} tone="purple" />
              <KPI icon={FileText} label="Active contracts" value={stats.summary.active_contracts} tone="green" />
              <KPI
                icon={TrendingUp}
                label="Total income"
                value={formatCurrency(stats.summary.total_income)}
                tone="green"
              />
              <KPI
                icon={TrendingDown}
                label="Total expense"
                value={formatCurrency(stats.summary.total_expense)}
                tone="red"
              />
              <KPI
                icon={Wallet}
                label="Net profit"
                value={formatCurrency(stats.summary.net_profit)}
                tone={stats.summary.net_profit >= 0 ? 'brand' : 'red'}
              />
              <KPI
                icon={BarChart2}
                label="Occupancy"
                value={`${stats.summary.occupancy_rate ?? 0}%`}
                tone="amber"
              />
            </div>

            {/* Cash flow chart */}
            <div className="card p-5">
              <h2 className="font-serif text-base font-normal text-[#f4ede0] mb-4">Cash flow — Income vs Expense by month</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.by_month}>
                    <defs>
                      <linearGradient id="rIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#34d399" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="rExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f87171" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3d301d" />
                    <XAxis dataKey="month" stroke="#baa58b" fontSize={12} />
                    <YAxis
                      stroke="#baa58b"
                      fontSize={12}
                      tickFormatter={formatChartYAxis}
                    />
                    <Tooltip
                      formatter={(v: any) => formatCurrency(v)}
                      contentStyle={{ backgroundColor: '#111a2e', borderRadius: 12, border: '1px solid #3d301d', color: '#f4ede0', fontSize: 12 }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="income"
                      stroke="#34d399"
                      strokeWidth={2}
                      fill="url(#rIncome)"
                      name="Income"
                    />
                    <Area
                      type="monotone"
                      dataKey="expense"
                      stroke="#f87171"
                      strokeWidth={2}
                      fill="url(#rExpense)"
                      name="Expense"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly bar chart */}
            <div className="card p-5">
              <h2 className="font-serif text-base font-normal text-[#f4ede0] mb-4">Net profit by month</h2>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.by_month.map((m) => ({ ...m, net: m.income - m.expense }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3d301d" />
                    <XAxis dataKey="month" stroke="#baa58b" fontSize={12} />
                    <YAxis
                      stroke="#baa58b"
                      fontSize={12}
                      tickFormatter={formatChartYAxis}
                    />
                    <Tooltip
                      formatter={(v: any) => formatCurrency(v)}
                      contentStyle={{ backgroundColor: '#111a2e', borderRadius: 12, border: '1px solid #3d301d', color: '#f4ede0', fontSize: 12 }}
                    />
                    <Bar
                      dataKey="net"
                      radius={[4, 4, 0, 0]}
                      fill="#c9a96e"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <CategoryPie title="Income breakdown" data={incomePie} />
              <CategoryPie title="Expense breakdown" data={expensePie} />
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

const KPI = ({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: any;
  label: string;
  value: string | number;
  tone: 'brand' | 'blue' | 'green' | 'red' | 'amber' | 'purple';
}) => {
  const bg: Record<string, string> = {
    brand: 'bg-[#0b1222] text-[#c9a96e] border border-[#3d301d]',
    blue: 'bg-sky-950/60 text-sky-400 border border-sky-800/60',
    green: 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60',
    red: 'bg-rose-950/60 text-rose-400 border border-rose-800/60',
    amber: 'bg-amber-950/60 text-amber-400 border border-amber-800/60',
    purple: 'bg-purple-950/60 text-purple-400 border border-purple-800/60',
  };
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-[#c9a96e] uppercase tracking-widest font-semibold font-sans">{label}</p>
          <p className="mt-2 text-xl font-bold text-[#f4ede0] font-sans">{value}</p>
        </div>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${bg[tone]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

const CategoryPie = ({ title, data }: { title: string; data: { name: string; value: number }[] }) => (
  <div className="card p-5">
    <h3 className="font-serif text-base font-normal text-[#f4ede0] mb-4">{title}</h3>
    {data.length === 0 ? (
      <p className="text-sm text-[#f4ede0]/40 italic py-6 text-center font-sans">No data</p>
    ) : (
      <div className="flex flex-col sm:flex-row items-center gap-6 font-sans">
        <div className="w-44 h-44 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" innerRadius={50} outerRadius={75} paddingAngle={3}>
                {data.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: any) => formatCurrency(v)} contentStyle={{ backgroundColor: '#111a2e', borderRadius: 12, border: '1px solid #3d301d', color: '#f4ede0', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-1.5 w-full">
          {data.map((d, i) => (
            <div key={d.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                />
                <span className="text-[#f4ede0]/80">{d.name}</span>
              </div>
              <span className="font-semibold text-[#f4ede0]">{formatCurrency(d.value)}</span>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);
