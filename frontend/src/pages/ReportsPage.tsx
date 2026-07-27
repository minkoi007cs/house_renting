import { useState, useMemo } from 'react';
import dayjs from 'dayjs';
import {
  BarChart2,
  TrendingUp,
  TrendingDown,
  Wallet,
  Home,
  Users,
  FileText,
  Layers,
  Download,
  Printer,
} from 'lucide-react';
import { Layout } from '@/components/common/Layout';
import { SkeletonCardGrid } from '@/components/common/Skeleton';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { TX_CATEGORY_LABELS } from '@/utils/labels';
import { formatCurrency, formatChartYAxis } from '@/utils/format';
import { downloadCSV, printPage } from '@/utils/export';
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

const PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

const DeltaBadge = ({ pct }: { pct: number | null }) => {
  if (pct === null) return null;
  const label = `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`;
  const cls =
    pct > 0
      ? 'bg-emerald-100 text-emerald-700'
      : pct < 0
        ? 'bg-rose-100 text-rose-700'
        : 'bg-ink-100 text-ink-500';
  return (
    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none ${cls}`}>
      {label}
    </span>
  );
};

export const ReportsPage = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [appliedDates, setAppliedDates] = useState<{ start: string; end: string } | null>(null);

  const { stats, isLoading } = useDashboardStats(appliedDates?.start, appliedDates?.end);

  const prevDates = useMemo(() => {
    if (!appliedDates?.start || !appliedDates?.end) return null;
    const start = dayjs(appliedDates.start);
    const end = dayjs(appliedDates.end);
    const days = end.diff(start, 'day');
    return {
      start: start.subtract(days + 1, 'day').format('YYYY-MM-DD'),
      end: start.subtract(1, 'day').format('YYYY-MM-DD'),
    };
  }, [appliedDates]);

  const { stats: prevStats } = useDashboardStats(prevDates?.start, prevDates?.end, !!prevDates);

  const pct = (curr: number | undefined, prev: number | undefined): number | null => {
    const p = Number(prev ?? 0);
    if (!p) return null;
    return ((Number(curr ?? 0) - p) / Math.abs(p)) * 100;
  };

  const handleApply = () => setAppliedDates({ start: startDate, end: endDate });

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setAppliedDates(null);
  };

  const handleExportCSV = () => {
    if (!stats) return;
    const s = stats.summary;
    const period = appliedDates?.start
      ? `${appliedDates.start} to ${appliedDates.end}`
      : 'All time';
    downloadCSV(
      'reports_summary',
      ['Metric', 'Value', '', ''],
      [
        ['Period', period, '', ''],
        ['Total Income', s.total_income, '', ''],
        ['Total Expense', s.total_expense, '', ''],
        ['Net Profit', s.net_profit, '', ''],
        ['Properties', s.total_properties, '', ''],
        ['Units', s.total_units, '', ''],
        ['Tenants', s.total_tenants, '', ''],
        ['Active Contracts', s.active_contracts, '', ''],
        ['Occupancy %', s.occupancy_rate ?? 0, '', ''],
        [],
        ['Month', 'Income', 'Expense', 'Net'],
        ...stats.by_month.map((m) => [m.month, m.income, m.expense, m.income - m.expense]),
      ],
    );
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
        {/* Date range filter + actions */}
        <div className="card p-4 flex flex-wrap gap-3 items-end">
          <div>
            <label className="label">From</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input w-40"
            />
          </div>
          <div>
            <label className="label">To</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input w-40"
            />
          </div>
          <button onClick={handleApply} className="btn-primary">
            Apply
          </button>
          <button onClick={handleReset} className="btn-secondary">
            Reset
          </button>
          <div className="ml-auto flex gap-2">
            <button
              onClick={handleExportCSV}
              disabled={!stats}
              className="btn-secondary flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <button onClick={printPage} className="btn-secondary flex items-center gap-1.5">
              <Printer className="w-4 h-4" /> Print PDF
            </button>
          </div>
        </div>

        {isLoading ? (
          <SkeletonCardGrid count={8} />
        ) : !stats ? (
          <div className="card p-10 text-center text-ink-400">No data available.</div>
        ) : (
          <>
            {/* Summary KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <KPI icon={Home} label="Properties" value={stats.summary.total_properties} tone="brand" />
              <KPI icon={Layers} label="Units" value={stats.summary.total_units} tone="blue" />
              <KPI icon={Users} label="Tenants" value={stats.summary.total_tenants} tone="purple" />
              <KPI
                icon={FileText}
                label="Active contracts"
                value={stats.summary.active_contracts}
                tone="green"
              />
              <KPI
                icon={TrendingUp}
                label="Total income"
                value={formatCurrency(stats.summary.total_income)}
                tone="green"
                delta={pct(stats.summary.total_income, prevStats?.summary.total_income)}
              />
              <KPI
                icon={TrendingDown}
                label="Total expense"
                value={formatCurrency(stats.summary.total_expense)}
                tone="red"
                delta={pct(stats.summary.total_expense, prevStats?.summary.total_expense)}
              />
              <KPI
                icon={Wallet}
                label="Net profit"
                value={formatCurrency(stats.summary.net_profit)}
                tone={stats.summary.net_profit >= 0 ? 'brand' : 'red'}
                delta={pct(stats.summary.net_profit, prevStats?.summary.net_profit)}
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
              <h2 className="font-semibold text-ink-900 mb-4">
                Cash flow — Income vs Expense by month
              </h2>
              <div className="h-48 sm:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.by_month}>
                    <defs>
                      <linearGradient id="rIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="rExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={formatChartYAxis} />
                    <Tooltip
                      formatter={(v: any) => formatCurrency(v)}
                      contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="income"
                      stroke="#10b981"
                      strokeWidth={2}
                      fill="url(#rIncome)"
                    />
                    <Area
                      type="monotone"
                      dataKey="expense"
                      stroke="#ef4444"
                      strokeWidth={2}
                      fill="url(#rExpense)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly bar chart */}
            <div className="card p-5">
              <h2 className="font-semibold text-ink-900 mb-4">Net profit by month</h2>
              <div className="h-44 sm:h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.by_month.map((m) => ({ ...m, net: m.income - m.expense }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={formatChartYAxis} />
                    <Tooltip
                      formatter={(v: any) => formatCurrency(v)}
                      contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
                    />
                    <Bar dataKey="net" radius={[4, 4, 0, 0]} fill="#6366f1" />
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
  delta,
}: {
  icon: any;
  label: string;
  value: string | number;
  tone: 'brand' | 'blue' | 'green' | 'red' | 'amber' | 'purple';
  delta?: number | null;
}) => {
  const bg: Record<string, string> = {
    brand: 'bg-brand-50 text-brand-600',
    blue: 'bg-sky-50 text-sky-600',
    green: 'bg-emerald-50 text-emerald-600',
    red: 'bg-rose-50 text-rose-600',
    amber: 'bg-amber-50 text-amber-600',
    purple: 'bg-violet-50 text-violet-600',
  };
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-ink-400 uppercase tracking-wide font-medium">{label}</p>
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <p className="text-xl font-bold text-ink-900">{value}</p>
            {delta !== undefined && <DeltaBadge pct={delta ?? null} />}
          </div>
        </div>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${bg[tone]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

const CategoryPie = ({
  title,
  data,
}: {
  title: string;
  data: { name: string; value: number }[];
}) => (
  <div className="card p-5">
    <h3 className="font-semibold text-ink-900 mb-4">{title}</h3>
    {data.length === 0 ? (
      <p className="text-sm text-ink-400 italic py-6 text-center">No data</p>
    ) : (
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="w-44 h-44 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" innerRadius={50} outerRadius={75} paddingAngle={3}>
                {data.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: any) => formatCurrency(v)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-1.5">
          {data.map((d, i) => (
            <div key={d.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                />
                <span className="text-ink-600">{d.name}</span>
              </div>
              <span className="font-medium text-ink-900">{formatCurrency(d.value)}</span>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);
