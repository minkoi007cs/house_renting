import { useState, useMemo } from 'react';
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
  Sparkles,
  Plus,
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

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];

const DeltaBadge = ({ pct }: { pct: number | null }) => {
  if (pct === null) return null;
  const label = `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`;
  const cls =
    pct > 0 ? 'bg-emerald-100 text-emerald-700'
    : pct < 0 ? 'bg-rose-100 text-rose-700'
    : 'bg-ink-100 text-ink-500';
  return (
    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none flex-shrink-0 ${cls}`}>
      {label}
    </span>
  );
};

const StatCard = ({
  label,
  value,
  sub,
  icon: Icon,
  accent = 'indigo',
  onClick,
  delta,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  accent?: string;
  onClick?: () => void;
  delta?: number | null;
}) => {
  const accentMap: Record<string, string> = {
    indigo: 'bg-brand-50 text-brand-600',
    green: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
    blue: 'bg-blue-50 text-blue-600',
  };
  return (
    <div
      className={`card p-5 flex items-start gap-4 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${accentMap[accent] || accentMap.indigo}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-ink-500 font-medium">{label}</p>
        <div className="mt-0.5 flex items-baseline gap-2 flex-wrap">
          <p className="text-2xl font-bold text-ink-900 truncate">{value}</p>
          {delta !== undefined && <DeltaBadge pct={delta} />}
        </div>
        {sub && <p className="mt-0.5 text-xs text-ink-400">{sub}</p>}
      </div>
    </div>
  );
};

const monthLabel = (m: string) => dayjs(m + '-01').format('MMM');

const ONBOARDING_STEPS = [
  { icon: Building2, title: 'Add a property', desc: 'Start by adding your first rental property — house, apartment, or any type.' },
  { icon: Users, title: 'Add tenants & units', desc: 'Create units inside the property, then link tenants and rental contracts.' },
  { icon: TrendingUp, title: 'Track finances', desc: 'Record income and expenses. See reports and cash flow at a glance.' },
];

const WelcomeBanner = ({ onGo }: { onGo: () => void }) => (
  <div className="card p-8 border-brand-100 bg-gradient-to-br from-brand-50/60 to-white">
    <div className="flex items-center gap-2 mb-2">
      <Sparkles className="w-5 h-5 text-brand-500" />
      <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Getting started</span>
    </div>
    <h2 className="text-2xl font-bold text-ink-900 mb-1">Welcome to Renthub!</h2>
    <p className="text-sm text-ink-500 mb-8">
      You don't have any properties yet. Follow these steps to get up and running.
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
      {ONBOARDING_STEPS.map(({ icon: Icon, title, desc }, i) => (
        <div key={i} className="flex gap-4 items-start">
          <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">
            {i + 1}
          </div>
          <div>
            <p className="font-semibold text-ink-800 text-sm">{title}</p>
            <p className="text-xs text-ink-500 mt-0.5 leading-relaxed">{desc}</p>
          </div>
        </div>
      ))}
    </div>
    <button onClick={onGo} className="btn-primary">
      <Plus className="w-4 h-4" /> Add your first property
    </button>
  </div>
);

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

  // Previous period for comparison (disabled for "all time" — no meaningful baseline)
  const prevDates = useMemo(() => {
    if (timeRange === 'month') return {
      start: dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
      end:   dayjs().subtract(1, 'month').endOf('month').format('YYYY-MM-DD'),
    };
    if (timeRange === 'quarter') {
      const qStart = Math.floor(dayjs().month() / 3) * 3;
      return {
        start: dayjs().month(qStart - 3).startOf('month').format('YYYY-MM-DD'),
        end:   dayjs().month(qStart).startOf('month').subtract(1, 'day').format('YYYY-MM-DD'),
      };
    }
    if (timeRange === 'year') return {
      start: dayjs().subtract(1, 'year').startOf('year').format('YYYY-MM-DD'),
      end:   dayjs().subtract(1, 'year').endOf('year').format('YYYY-MM-DD'),
    };
    return null;
  }, [timeRange]);

  const { stats: prevStats } = useDashboardStats(prevDates?.start, prevDates?.end, !!prevDates);

  const pct = (curr: number | undefined, prev: number | undefined): number | null => {
    if (curr === undefined || prev === undefined || prev === 0) return null;
    return ((curr - prev) / Math.abs(prev)) * 100;
  };

  if (isLoading) return <Layout title="Dashboard"><PageLoader /></Layout>;

  const s = stats?.summary;
  const ps = prevStats?.summary;
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

  const isNewUser = !isLoading && (s?.total_properties ?? 0) === 0;

  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        {isNewUser && <WelcomeBanner onGo={() => navigate('/properties')} />}

        {/* Top Header & Range Switcher */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-xl font-bold text-ink-900">Workspace Overview</h2>
            <p className="text-xs text-ink-500 mt-0.5">Real-time overview of your rental business</p>
          </div>

          <div className="flex gap-1 p-1 bg-white border border-ink-150 rounded-full shadow-sm">
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
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    timeRange === r
                      ? 'bg-brand-500 text-white shadow-sm'
                      : 'text-ink-600 hover:text-ink-900 hover:bg-ink-50'
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
            sub={`Income ${formatCurrency(s?.total_income)} · Exp ${formatCurrency(s?.total_expense)}`}
            icon={s?.net_profit && s.net_profit >= 0 ? TrendingUp : TrendingDown}
            accent={s?.net_profit && s.net_profit >= 0 ? 'green' : 'red'}
            onClick={() => navigate('/transactions')}
            delta={pct(s?.net_profit, ps?.net_profit)}
          />
        </div>

        {/* Period comparison row (only for time-scoped ranges) */}
        {prevDates && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'Income vs prev period', curr: s?.total_income, prev: ps?.total_income, accent: 'green' },
              { label: 'Expense vs prev period', curr: s?.total_expense, prev: ps?.total_expense, accent: 'red' },
              { label: 'Net profit vs prev period', curr: s?.net_profit, prev: ps?.net_profit, accent: 'indigo' },
            ].map(({ label, curr, prev, accent }) => {
              const delta = pct(curr, prev);
              const accMap: Record<string, string> = {
                green: 'text-emerald-700 bg-emerald-50 border-emerald-100',
                red: 'text-rose-700 bg-rose-50 border-rose-100',
                indigo: 'text-brand-700 bg-brand-50 border-brand-100',
              };
              return (
                <div key={label} className={`rounded-xl border px-4 py-3 flex items-center justify-between ${accMap[accent]}`}>
                  <span className="text-xs font-medium">{label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{formatCurrency(curr)}</span>
                    <DeltaBadge pct={delta} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Area chart */}
          <div className="card p-5 lg:col-span-2">
            <h2 className="text-sm font-semibold text-ink-700 mb-4">Income vs Expense</h2>
            {byMonth.length > 0 ? (
              <div className="h-48 sm:h-56 md:h-64">
              <ResponsiveContainer width="100%" height="100%">
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
                    tickFormatter={formatChartYAxis}
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
              </div>
            ) : (
              <div className="h-48 sm:h-56 md:h-64 flex items-center justify-center text-ink-400 text-sm">
                No transaction data yet
              </div>
            )}
          </div>

          {/* Pie chart */}
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-ink-700 mb-4">Income breakdown</h2>
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
                    formatter={(v) => <span className="text-xs text-ink-600">{v}</span>}
                  />
                  <Tooltip
                    formatter={(v: number) => formatCurrency(v)}
                    contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-48 sm:h-56 md:h-64 flex items-center justify-center text-ink-400 text-sm">
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
