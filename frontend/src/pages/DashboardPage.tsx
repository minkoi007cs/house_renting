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
import { formatCurrency, formatDate } from '@/utils/format';
import { statusBadgeClass, TX_CATEGORY_LABELS, CONTRACT_STATUS_LABELS } from '@/utils/labels';
import dayjs from 'dayjs';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];

const StatCard = ({
  label,
  value,
  sub,
  icon: Icon,
  accent = 'indigo',
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  accent?: string;
}) => {
  const accentMap: Record<string, string> = {
    indigo: 'bg-brand-50 text-brand-600',
    green: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
    blue: 'bg-blue-50 text-blue-600',
  };
  return (
    <div className="card p-5 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${accentMap[accent] || accentMap.indigo}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-ink-500 font-medium">{label}</p>
        <p className="mt-0.5 text-2xl font-bold text-ink-900 truncate">{value}</p>
        {sub && <p className="mt-0.5 text-xs text-ink-400">{sub}</p>}
      </div>
    </div>
  );
};

const monthLabel = (m: string) => dayjs(m + '-01').format('MMM');

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { stats, isLoading } = useDashboardStats();

  if (isLoading) return <Layout title="Dashboard"><PageLoader /></Layout>;

  const s = stats?.summary;
  const byMonth = stats?.by_month || [];
  const recentTx = stats?.recent_transactions || [];
  const upcomingReminders = stats?.upcoming_reminders || [];
  const expiringContracts = stats?.expiring_contracts || [];

  const incomeCategories = Object.entries(stats?.by_category?.income || {}).map(
    ([name, value]) => ({ name: TX_CATEGORY_LABELS[name] || name, value }),
  );
  const expenseCategories = Object.entries(stats?.by_category?.expense || {}).map(
    ([name, value]) => ({ name: TX_CATEGORY_LABELS[name] || name, value }),
  );

  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            label="Properties"
            value={s?.total_properties ?? 0}
            sub={`${s?.total_units ?? 0} total units`}
            icon={Building2}
            accent="indigo"
          />
          <StatCard
            label="Occupancy"
            value={`${s?.occupancy_rate ?? 0}%`}
            sub={`${s?.occupied_units ?? 0} occupied · ${s?.vacant_units ?? 0} vacant`}
            icon={Layers}
            accent="green"
          />
          <StatCard
            label="Tenants"
            value={s?.total_tenants ?? 0}
            sub={`${s?.active_contracts ?? 0} active contracts`}
            icon={Users}
            accent="blue"
          />
          <StatCard
            label="Net Profit"
            value={formatCurrency(s?.net_profit)}
            sub={`Income ${formatCurrency(s?.total_income)}`}
            icon={s?.net_profit && s.net_profit >= 0 ? TrendingUp : TrendingDown}
            accent={s?.net_profit && s.net_profit >= 0 ? 'green' : 'red'}
          />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Area chart */}
          <div className="card p-5 lg:col-span-2">
            <h2 className="text-sm font-semibold text-ink-700 mb-4">Income vs Expense</h2>
            {byMonth.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={byMonth} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="month"
                    tickFormatter={monthLabel}
                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={(v) => `${(v / 1e6).toFixed(0)}M`}
                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                    width={40}
                  />
                  <Tooltip
                    formatter={(v: number) => formatCurrency(v)}
                    labelFormatter={(l) => dayjs(l + '-01').format('MMMM YYYY')}
                    contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                  />
                  <Area type="monotone" dataKey="income" stroke="#6366f1" fill="url(#incomeGrad)" strokeWidth={2} name="Income" />
                  <Area type="monotone" dataKey="expense" stroke="#ef4444" fill="url(#expenseGrad)" strokeWidth={2} name="Expense" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-ink-400 text-sm">
                No transaction data yet
              </div>
            )}
          </div>

          {/* Pie chart */}
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-ink-700 mb-4">Income breakdown</h2>
            {incomeCategories.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
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
                    formatter={(v) => <span className="text-xs text-ink-600">{v}</span>}
                  />
                  <Tooltip
                    formatter={(v: number) => formatCurrency(v)}
                    contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-ink-400 text-sm">
                No data
              </div>
            )}
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent transactions */}
          <div className="card lg:col-span-2">
            <div className="px-5 py-4 border-b border-ink-100 flex justify-between items-center">
              <h2 className="text-sm font-semibold text-ink-700">Recent Transactions</h2>
              <button
                onClick={() => navigate('/transactions')}
                className="text-xs text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                View all <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            {recentTx.length > 0 ? (
              <div className="divide-y divide-ink-100">
                {recentTx.slice(0, 6).map((tx) => (
                  <div key={tx.id} className="px-5 py-3 flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${tx.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}
                    >
                      {tx.type === 'income' ? '+' : '−'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink-800 truncate">
                        {TX_CATEGORY_LABELS[tx.category] || tx.category}
                      </p>
                      <p className="text-xs text-ink-400">{formatDate(tx.transaction_date)}</p>
                    </div>
                    <p
                      className={`text-sm font-semibold flex-shrink-0 ${tx.type === 'income' ? 'text-emerald-600' : 'text-red-500'}`}
                    >
                      {tx.type === 'income' ? '+' : '−'}
                      {formatCurrency(tx.amount)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-ink-400 text-sm">No transactions yet</div>
            )}
          </div>

          {/* Sidebar: reminders + expiring contracts */}
          <div className="flex flex-col gap-4">
            <div className="card flex-1">
              <div className="px-5 py-4 border-b border-ink-100 flex justify-between items-center">
                <h2 className="text-sm font-semibold text-ink-700 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-500" />
                  Upcoming Reminders
                </h2>
                <button
                  onClick={() => navigate('/reminders')}
                  className="text-xs text-brand-600 hover:text-brand-700"
                >
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              {upcomingReminders.length > 0 ? (
                <div className="divide-y divide-ink-100">
                  {upcomingReminders.slice(0, 4).map((r) => (
                    <div key={r.id} className="px-5 py-3">
                      <p className="text-sm font-medium text-ink-800 truncate">{r.title}</p>
                      <p className="text-xs text-ink-400">{formatDate(r.due_date)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-ink-400 text-sm">No upcoming reminders</div>
              )}
            </div>

            {expiringContracts.length > 0 && (
              <div className="card">
                <div className="px-5 py-4 border-b border-ink-100 flex justify-between items-center">
                  <h2 className="text-sm font-semibold text-ink-700 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-500" />
                    Expiring Soon
                  </h2>
                  <button onClick={() => navigate('/contracts')} className="text-xs text-brand-600 hover:text-brand-700">
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="divide-y divide-ink-100">
                  {expiringContracts.slice(0, 3).map((c) => (
                    <div key={c.id} className="px-5 py-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-ink-800 truncate">
                          {(c.unit as any)?.name}
                        </p>
                        <p className="text-xs text-ink-400">{formatDate(c.end_date)}</p>
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
