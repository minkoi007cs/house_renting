import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Users,
  FileText,
  TrendingUp,
  TrendingDown,
  Layers,
  Bell,
  ArrowRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Layout } from '@/components/common/Layout';
import { PageLoader } from '@/components/common/Spinner';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { formatCurrency, formatDate, formatChartYAxis } from '@/utils/format';
import { statusBadgeClass, TX_CATEGORY_LABELS, CONTRACT_STATUS_LABELS } from '@/utils/labels';
import dayjs from 'dayjs';

const COLORS = ['#c9a96e', '#34d399', '#fbbf24', '#f87171', '#38bdf8', '#a78bfa'];

const StatCard = ({
  label,
  value,
  sub,
  icon: Icon,
  accent = 'indigo',
  onClick,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  accent?: string;
  onClick?: () => void;
}) => {
  const accentMap: Record<string, string> = {
    indigo: 'bg-[#0b1222] text-[#c9a96e] border border-[#3d301d]',
    green: 'bg-emerald-950/50 text-emerald-400 border border-emerald-800/60',
    amber: 'bg-amber-950/50 text-amber-400 border border-amber-800/60',
    red: 'bg-rose-950/50 text-rose-400 border border-rose-800/60',
    blue: 'bg-sky-950/50 text-sky-400 border border-sky-800/60',
  };
  return (
    <div
      className={`card p-5 flex items-start gap-4 ${onClick ? 'cursor-pointer hover:border-[#c9a96e]/60 transition-all' : ''}`}
      onClick={onClick}
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${accentMap[accent] || accentMap.indigo}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs uppercase font-sans tracking-widest text-[#c9a96e] font-semibold">{label}</p>
        <p className="mt-1 text-2xl font-bold font-sans text-[#f4ede0] truncate">{value}</p>
        {sub && <p className="mt-0.5 text-xs font-sans text-[#f4ede0]/60">{sub}</p>}
      </div>
    </div>
  );
};

const monthLabel = (m: string) => dayjs(m + '-01').format('MMM');

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year' | 'all'>('all');

  const getDates = () => {
    let startDate: string | undefined;
    let endDate: string | undefined;

    if (timeRange === 'month') {
      startDate = dayjs().startOf('month').format('YYYY-MM-DD');
      endDate = dayjs().endOf('month').format('YYYY-MM-DD');
    } else if (timeRange === 'quarter') {
      const qStartMonth = Math.floor(dayjs().month() / 3) * 3;
      startDate = dayjs().month(qStartMonth).startOf('month').format('YYYY-MM-DD');
      endDate = dayjs().month(qStartMonth + 2).endOf('month').format('YYYY-MM-DD');
    } else if (timeRange === 'year') {
      startDate = dayjs().startOf('year').format('YYYY-MM-DD');
      endDate = dayjs().endOf('year').format('YYYY-MM-DD');
    }

    return { startDate, endDate };
  };

  const { startDate, endDate } = getDates();
  const { stats, isLoading } = useDashboardStats(startDate, endDate);

  if (isLoading) return <Layout title="Dashboard"><PageLoader /></Layout>;

  const s = stats?.summary;
  const byMonth = stats?.by_month || [];
  const recentTx = stats?.recent_transactions || [];
  const upcomingReminders = stats?.upcoming_reminders || [];
  const expiringContracts = stats?.expiring_contracts || [];

  const incomeCategories = Object.entries(stats?.by_category?.income || {}).map(
    ([name, value]) => ({ name: TX_CATEGORY_LABELS[name] || name, value }),
  );

  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        {/* Top Header & Range Switcher */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="font-serif text-2xl font-normal text-[#f4ede0]">Workspace Overview</h2>
            <p className="text-xs font-sans text-[#f4ede0]/60 mt-0.5">Real-time overview of your rental business</p>
          </div>

          <div className="flex gap-1 p-1 bg-[#111a2e] border border-[#3d301d] rounded-full shadow-sm">
            {(['all', 'month', 'quarter', 'year'] as const).map((r) => {
              const labels = {
                all: 'All Time',
                month: 'This Month',
                quarter: 'This Quarter',
                year: 'This Year',
              };
              return (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-semibold transition-all duration-200 ${
                    timeRange === r
                      ? 'bg-[#c9a96e] text-[#0b1222] shadow-sm'
                      : 'text-[#f4ede0]/70 hover:text-[#f4ede0] hover:bg-[#0b1222]'
                  }`}
                >
                  {labels[r]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            label="Properties"
            value={s?.total_properties ?? 0}
            sub={`${s?.total_units ?? 0} total units`}
            icon={Building2}
            accent="indigo"
            onClick={() => navigate('/properties')}
          />
          <StatCard
            label="Occupancy"
            value={`${s?.occupancy_rate ?? 0}%`}
            sub={`${s?.occupied_units ?? 0} occupied · ${s?.vacant_units ?? 0} vacant`}
            icon={Layers}
            accent="green"
            onClick={() => navigate('/properties')}
          />
          <StatCard
            label="Tenants"
            value={s?.total_tenants ?? 0}
            sub={`${s?.active_contracts ?? 0} active contracts`}
            icon={Users}
            accent="blue"
            onClick={() => navigate('/tenants')}
          />
          <StatCard
            label="Net Profit"
            value={formatCurrency(s?.net_profit)}
            sub={`Income ${formatCurrency(s?.total_income)}`}
            icon={s?.net_profit && s.net_profit >= 0 ? TrendingUp : TrendingDown}
            accent={s?.net_profit && s.net_profit >= 0 ? 'green' : 'red'}
            onClick={() => navigate('/transactions')}
          />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Area chart */}
          <div className="card p-5 lg:col-span-2">
            <h2 className="font-serif text-base text-[#f4ede0] mb-4">Income vs Expense</h2>
            {byMonth.length > 0 ? (
              <div className="h-48 sm:h-56 md:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={byMonth} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c9a96e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#c9a96e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f87171" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3d301d" />
                  <XAxis
                    dataKey="month"
                    tickFormatter={monthLabel}
                    tick={{ fontSize: 12, fill: '#baa58b' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={formatChartYAxis}
                    tick={{ fontSize: 12, fill: '#baa58b' }}
                    axisLine={false}
                    tickLine={false}
                    width={40}
                  />
                  <Tooltip
                    formatter={(v: number) => formatCurrency(v)}
                    labelFormatter={(l) => dayjs(l + '-01').format('MMMM YYYY')}
                    contentStyle={{ backgroundColor: '#111a2e', borderRadius: 8, border: '1px solid #3d301d', color: '#f4ede0', fontSize: 12 }}
                  />
                  <Area type="monotone" dataKey="income" stroke="#c9a96e" fill="url(#incomeGrad)" strokeWidth={2} name="Income" />
                  <Area type="monotone" dataKey="expense" stroke="#f87171" fill="url(#expenseGrad)" strokeWidth={2} name="Expense" />
                </AreaChart>
              </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-48 sm:h-56 md:h-64 flex items-center justify-center text-[#f4ede0]/40 text-sm font-sans">
                No transaction data yet
              </div>
            )}
          </div>

          {/* Pie chart */}
          <div className="card p-5">
            <h2 className="font-serif text-base text-[#f4ede0] mb-4">Income breakdown</h2>
            {incomeCategories.length > 0 ? (
              <div className="h-48 sm:h-56 md:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incomeCategories}
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={80}
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {incomeCategories.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend
                    iconSize={8}
                    iconType="circle"
                    formatter={(v) => <span className="text-xs text-[#f4ede0]/80">{v}</span>}
                  />
                  <Tooltip
                    formatter={(v: number) => formatCurrency(v)}
                    contentStyle={{ backgroundColor: '#111a2e', borderRadius: 8, border: '1px solid #3d301d', color: '#f4ede0', fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-48 sm:h-56 md:h-64 flex items-center justify-center text-[#f4ede0]/40 text-sm font-sans">
                No data
              </div>
            )}
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent transactions */}
          <div className="card lg:col-span-2">
            <div className="px-5 py-4 border-b border-[#3d301d] flex justify-between items-center">
              <h2 className="font-serif text-base text-[#f4ede0]">Recent Transactions</h2>
              <button
                onClick={() => navigate('/transactions')}
                className="text-xs font-sans text-[#c9a96e] hover:text-[#d6b87e] flex items-center gap-1 font-semibold uppercase tracking-wider"
              >
                View all <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            {recentTx.length > 0 ? (
              <div className="divide-y divide-[#3d301d]/60">
                {recentTx.slice(0, 6).map((tx) => (
                  <div key={tx.id} className="px-5 py-3 flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${tx.type === 'income' ? 'bg-emerald-950/80 border border-emerald-700 text-emerald-400' : 'bg-rose-950/80 border border-rose-700 text-rose-400'}`}
                    >
                      {tx.type === 'income' ? '+' : '−'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#f4ede0] truncate">
                        {TX_CATEGORY_LABELS[tx.category] || tx.category}
                      </p>
                      <p className="text-xs text-[#f4ede0]/50">{formatDate(tx.transaction_date)}</p>
                    </div>
                    <p
                      className={`text-sm font-semibold flex-shrink-0 ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}
                    >
                      {tx.type === 'income' ? '+' : '−'}
                      {formatCurrency(tx.amount)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-[#f4ede0]/40 text-sm font-sans">No transactions yet</div>
            )}
          </div>

          {/* Sidebar: reminders + expiring contracts */}
          <div className="flex flex-col gap-4">
            <div className="card flex-1">
              <div className="px-5 py-4 border-b border-[#3d301d] flex justify-between items-center">
                <h2 className="font-serif text-base text-[#f4ede0] flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#c9a96e]" />
                  Upcoming Reminders
                </h2>
                <button
                  onClick={() => navigate('/reminders')}
                  className="text-xs font-sans text-[#c9a96e] hover:text-[#d6b87e]"
                >
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              {upcomingReminders.length > 0 ? (
                <div className="divide-y divide-[#3d301d]/60">
                  {upcomingReminders.slice(0, 4).map((r) => (
                    <div key={r.id} className="px-5 py-3">
                      <p className="text-sm font-medium text-[#f4ede0] truncate">{r.title}</p>
                      <p className="text-xs text-[#f4ede0]/50">{formatDate(r.due_date)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-[#f4ede0]/40 text-sm font-sans">No upcoming reminders</div>
              )}
            </div>

            {expiringContracts.length > 0 && (
              <div className="card">
                <div className="px-5 py-4 border-b border-[#3d301d] flex justify-between items-center">
                  <h2 className="font-serif text-base text-[#f4ede0] flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#c9a96e]" />
                    Expiring Soon
                  </h2>
                  <button onClick={() => navigate('/contracts')} className="text-xs font-sans text-[#c9a96e] hover:text-[#d6b87e]">
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="divide-y divide-[#3d301d]/60">
                  {expiringContracts.slice(0, 3).map((c) => (
                    <div key={c.id} className="px-5 py-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#f4ede0] truncate">
                          {(c.unit as any)?.name}
                        </p>
                        <p className="text-xs text-[#f4ede0]/50">{formatDate(c.end_date)}</p>
                      </div>
                      <span className={statusBadgeClass(c.status)}>{CONTRACT_STATUS_LABELS[c.status]}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};
