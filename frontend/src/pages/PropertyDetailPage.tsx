import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Pencil, Trash2, Plus, Building2, MapPin, FileText, DollarSign,
  Bell, Phone, Mail, AlertCircle, CheckCircle2, Circle, TrendingUp, TrendingDown,
  Wallet, Calendar, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { Layout } from '@/components/common/Layout';
import { PageLoader, Spinner } from '@/components/common/Spinner';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { CreatePropertyForm } from '@/components/forms/CreatePropertyForm';
import { CreateTenantForm } from '@/components/forms/CreateTenantForm';
import { CreateContractForm } from '@/components/forms/CreateContractForm';
import { CreateTransactionForm } from '@/components/forms/CreateTransactionForm';
import { CreateReminderForm } from '@/components/forms/CreateReminderForm';
import { useProperty, useProperties } from '@/hooks/useProperties';
import { useUnits } from '@/hooks/useUnits';
import { useTenantsByUnit } from '@/hooks/useTenants';
import { useContractsByUnit } from '@/hooks/useContracts';
import { useAnalytics } from '@/hooks/useAnalytics';
import api from '@/services/api';
import {
  PROPERTY_TYPE_LABELS, PROPERTY_STATUS_LABELS, CONTRACT_STATUS_LABELS,
  REMINDER_TYPE_LABELS, TX_CATEGORY_LABELS, PAYMENT_CYCLE_LABELS, statusBadgeClass,
} from '@/utils/labels';
import { formatCurrency, formatDate } from '@/utils/format';
import { Tenant, RentalContract, Transaction, Reminder } from '@/types';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

type Tab = 'overview' | 'contract' | 'tenants' | 'finance' | 'reminder';

/* ─── Image gallery ─────────────────────────────────────────────────── */
const ImageGallery = ({ images, cover }: { images?: string[] | null; cover?: string }) => {
  // Guard against non-array values (e.g. null from DB rows before migration)
  const imgs = Array.isArray(images) ? images : [];
  const sorted = useMemo(() => {
    if (!imgs.length) return [];
    return cover ? [cover, ...imgs.filter((u) => u !== cover)] : imgs;
  }, [imgs, cover]);

  const [idx, setIdx] = useState(0);
  if (!sorted.length) return null;

  return (
    <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden bg-ink-100 flex-shrink-0">
      <img
        src={sorted[idx]}
        alt=""
        className="w-full h-full object-cover"
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
      />
      {sorted.length > 1 && (
        <>
          <button
            onClick={() => setIdx((i) => (i - 1 + sorted.length) % sorted.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIdx((i) => (i + 1) % sorted.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {sorted.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`w-2 h-2 rounded-full transition ${i === idx ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

/* ─── Stat card ─────────────────────────────────────────────────────── */
const Stat = ({
  icon: Icon, label, value, sub, tone = 'brand',
}: {
  icon: any; label: string; value: string | number; sub?: string;
  tone?: 'brand' | 'green' | 'red' | 'blue' | 'amber';
}) => {
  const tones: Record<string, string> = {
    brand: 'bg-brand-50 text-brand-600',
    green: 'bg-emerald-50 text-emerald-600',
    red: 'bg-rose-50 text-rose-600',
    blue: 'bg-sky-50 text-sky-600',
    amber: 'bg-amber-50 text-amber-600',
  };
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-ink-400 font-medium">{label}</p>
          <p className="mt-1.5 text-xl font-bold text-ink-900 leading-tight">{value}</p>
          {sub && <p className="text-xs text-ink-400 mt-0.5">{sub}</p>}
        </div>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${tones[tone]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

/* ─── Overview tab ──────────────────────────────────────────────────── */
const OverviewTab = ({ propertyId }: { propertyId: string }) => {
  const { analytics, isLoading } = useAnalytics(propertyId);
  if (isLoading) return <PageLoader />;
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Stat icon={TrendingUp} label="Income (all time)" value={formatCurrency(analytics?.summary.total_income || 0)} tone="green" />
        <Stat icon={TrendingDown} label="Expense (all time)" value={formatCurrency(analytics?.summary.total_expense || 0)} tone="red" />
        <Stat icon={Wallet} label="Net profit" value={formatCurrency(analytics?.summary.net_profit || 0)} tone={(analytics?.summary.net_profit || 0) >= 0 ? 'brand' : 'red'} />
      </div>

      <div className="card p-5">
        <h3 className="font-semibold text-ink-900 mb-4">Cash flow — last 12 months</h3>
        {(analytics?.by_month || []).length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.by_month || []}>
                <defs>
                  <linearGradient id="ovIn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="ovEx" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`} />
                <Tooltip
                  formatter={(v: any) => formatCurrency(v as number)}
                  contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
                />
                <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} fill="url(#ovIn)" name="Income" />
                <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} fill="url(#ovEx)" name="Expense" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center text-ink-400 text-sm">
            No transaction data yet
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Contract tab ──────────────────────────────────────────────────── */
const ContractTab = ({ primaryUnitId }: { primaryUnitId: string }) => {
  const { contracts, isLoading, fetchContracts } = useContractsByUnit(primaryUnitId);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<RentalContract | null>(null);
  const [deleting, setDeleting] = useState<RentalContract | null>(null);

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-ink-900">{contracts.length} contract{contracts.length !== 1 ? 's' : ''}</h3>
        <button onClick={() => setShowAdd(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> New contract
        </button>
      </div>

      {contracts.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No contracts yet"
          description="Create a rental contract to track the tenancy period, rent, and deposit."
          action={<button onClick={() => setShowAdd(true)} className="btn-primary"><Plus className="w-4 h-4" /> New contract</button>}
        />
      ) : (
        <div className="space-y-3">
          {contracts.map((c) => (
            <div key={c.id} className={`card p-4 border-l-4 ${c.status === 'active' ? 'border-l-emerald-400' : c.status === 'expired' || c.status === 'terminated' ? 'border-l-rose-300' : 'border-l-ink-200'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-ink-900">{formatCurrency(c.rent_amount)}</span>
                    <span className="text-sm text-ink-500">/ {PAYMENT_CYCLE_LABELS[c.payment_cycle] || c.payment_cycle}</span>
                    <span className={statusBadgeClass(c.status)}>{CONTRACT_STATUS_LABELS[c.status]}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-ink-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(c.start_date)} → {c.end_date ? formatDate(c.end_date) : 'open-ended'}
                    </span>
                    {c.deposit_amount > 0 && (
                      <span>Deposit: {formatCurrency(c.deposit_amount)}</span>
                    )}
                    {c.rent_due_day && (
                      <span>Due: day {c.rent_due_day}</span>
                    )}
                  </div>
                  {c.contract_tenants && c.contract_tenants.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {c.contract_tenants.map(({ tenant, role }) => (
                        <span key={tenant.id} className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${role === 'primary' ? 'bg-brand-100 text-brand-700' : 'bg-ink-100 text-ink-600'}`}>
                          {role === 'primary' && '★ '}
                          {tenant.name}
                        </span>
                      ))}
                    </div>
                  )}
                  {Array.isArray(c.image_urls) && c.image_urls.length > 0 && (
                    <div className="mt-2 flex gap-2 overflow-x-auto">
                      {c.image_urls.map((url) => (
                        <a key={url} href={url} target="_blank" rel="noopener noreferrer">
                          <img src={url} alt="" className="w-14 h-14 rounded-lg object-cover border border-ink-200 flex-shrink-0" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => setEditing(c)} className="p-2 hover:bg-ink-100 rounded-lg text-ink-400 hover:text-ink-700">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleting(c)} className="p-2 hover:bg-rose-50 rounded-lg text-ink-400 hover:text-rose-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <CreateContractForm unitId={primaryUnitId} onClose={() => setShowAdd(false)} onSuccess={() => fetchContracts()} />
      )}
      {editing && (
        <CreateContractForm
          unitId={editing.unit_id}
          contractId={editing.id}
          initialData={editing as any}
          onClose={() => setEditing(null)}
          onSuccess={() => fetchContracts()}
        />
      )}
      {deleting && (
        <ConfirmDialog
          title="Delete contract?"
          message="This contract will be permanently removed."
          onCancel={() => setDeleting(null)}
          onConfirm={async () => {
            await api.delete(`/contracts/${deleting.id}`);
            await fetchContracts();
            setDeleting(null);
          }}
        />
      )}
    </div>
  );
};

/* ─── Tenants tab ───────────────────────────────────────────────────── */
const TenantsTab = ({ primaryUnitId }: { primaryUnitId: string }) => {
  const { tenants, isLoading, fetchTenants } = useTenantsByUnit(primaryUnitId);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Tenant | null>(null);
  const [deleting, setDeleting] = useState<Tenant | null>(null);

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-ink-900">{tenants.length} tenant{tenants.length !== 1 ? 's' : ''}</h3>
        <button onClick={() => setShowAdd(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Add tenant
        </button>
      </div>

      {tenants.length === 0 ? (
        <EmptyState
          icon={Phone}
          title="No tenants yet"
          description="Add tenants and link them to a contract."
          action={<button onClick={() => setShowAdd(true)} className="btn-primary"><Plus className="w-4 h-4" /> Add tenant</button>}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {tenants.map((t) => (
            <div key={t.id} className="card p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                {t.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-ink-900">{t.name}</p>
                <div className="mt-1.5 space-y-1">
                  {t.phone && (
                    <p className="text-xs text-ink-500 flex items-center gap-1.5">
                      <Phone className="w-3 h-3" /> {t.phone}
                    </p>
                  )}
                  {t.email && (
                    <p className="text-xs text-ink-500 flex items-center gap-1.5">
                      <Mail className="w-3 h-3" /> {t.email}
                    </p>
                  )}
                  {(t as any).emergency_contact && (
                    <p className="text-xs text-amber-600 flex items-center gap-1.5">
                      <AlertCircle className="w-3 h-3" /> {(t as any).emergency_contact}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => setEditing(t)} className="p-2 hover:bg-ink-100 rounded-lg text-ink-400 hover:text-ink-700">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => setDeleting(t)} className="p-2 hover:bg-rose-50 rounded-lg text-ink-400 hover:text-rose-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <CreateTenantForm unitId={primaryUnitId} onClose={() => setShowAdd(false)} onSuccess={() => fetchTenants()} />
      )}
      {editing && (
        <CreateTenantForm
          unitId={primaryUnitId}
          tenantId={editing.id}
          initialData={editing as any}
          onClose={() => setEditing(null)}
          onSuccess={() => fetchTenants()}
        />
      )}
      {deleting && (
        <ConfirmDialog
          title="Remove tenant?"
          message={`Remove "${deleting.name}" from this property?`}
          onCancel={() => setDeleting(null)}
          onConfirm={async () => {
            await api.delete(`/tenants/${deleting.id}`);
            await fetchTenants();
            setDeleting(null);
          }}
        />
      )}
    </div>
  );
};

/* ─── Finance tab ───────────────────────────────────────────────────── */
const FinanceTab = ({ propertyId }: { propertyId: string }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<'' | 'income' | 'expense'>('');
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [deleting, setDeleting] = useState<Transaction | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const params: any = { limit: 200 };
      if (type) params.type = type;
      const res = await api.get(`/properties/${propertyId}/transactions`, { params });
      const raw = res.data.data;
      setTransactions(Array.isArray(raw) ? raw : (raw?.data ?? []));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, [propertyId, type]);

  const totals = useMemo(() => {
    const income = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
    const expense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
    return { income, expense, net: income - expense };
  }, [transactions]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-ink-900">{transactions.length} transactions</h3>
          <select value={type} onChange={(e) => setType(e.target.value as any)} className="input w-36">
            <option value="">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Add transaction
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Stat icon={TrendingUp} label="Income" value={formatCurrency(totals.income)} tone="green" />
        <Stat icon={TrendingDown} label="Expense" value={formatCurrency(totals.expense)} tone="red" />
        <Stat icon={Wallet} label="Net" value={formatCurrency(totals.net)} tone={totals.net >= 0 ? 'brand' : 'red'} />
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><Spinner /></div>
      ) : transactions.length === 0 ? (
        <EmptyState icon={DollarSign} title="No transactions" description="Record income or expenses for this property." />
      ) : (
        <div className="overflow-x-auto -mx-5">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Note</th>
                <th>Type</th>
                <th className="text-right">Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td>{formatDate(t.transaction_date)}</td>
                  <td>{TX_CATEGORY_LABELS[t.category] || t.category}</td>
                  <td className="max-w-xs truncate text-ink-500">{t.note || '—'}</td>
                  <td>
                    <span className={t.type === 'income' ? 'badge-green' : 'badge-red'}>
                      {t.type === 'income' ? 'Income' : 'Expense'}
                    </span>
                  </td>
                  <td className={`text-right font-semibold ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setEditing(t)} className="p-2 hover:bg-ink-100 rounded text-ink-400"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => setDeleting(t)} className="p-2 hover:bg-rose-50 rounded text-ink-400 hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAdd && <CreateTransactionForm propertyId={propertyId} onClose={() => setShowAdd(false)} onSuccess={() => fetchAll()} />}
      {editing && <CreateTransactionForm propertyId={propertyId} transactionId={editing.id} initialData={editing as any} onClose={() => setEditing(null)} onSuccess={() => fetchAll()} />}
      {deleting && (
        <ConfirmDialog
          title="Delete transaction?"
          message="This transaction will be permanently removed."
          onCancel={() => setDeleting(null)}
          onConfirm={async () => { await api.delete(`/transactions/${deleting.id}`); await fetchAll(); setDeleting(null); }}
        />
      )}
    </div>
  );
};

/* ─── Reminder tab ──────────────────────────────────────────────────── */
const ReminderTab = ({ propertyId }: { propertyId: string }) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Reminder | null>(null);
  const [deleting, setDeleting] = useState<Reminder | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/properties/${propertyId}/reminders`);
      const list = (res.data.data || []) as Reminder[];
      list.sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
      setReminders(list);
    } finally {
      setLoading(false);
    }
  };

  const toggle = async (r: Reminder) => {
    const newStatus = r.status === 'pending' ? 'done' : 'pending';
    await api.patch(`/reminders/${r.id}`, { status: newStatus });
    setReminders((list) => list.map((x) => (x.id === r.id ? { ...x, status: newStatus } : x)));
  };

  useEffect(() => { fetchAll(); }, [propertyId]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-ink-900">{reminders.length} reminder{reminders.length !== 1 ? 's' : ''}</h3>
        <button onClick={() => setShowAdd(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Add reminder
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><Spinner /></div>
      ) : reminders.length === 0 ? (
        <EmptyState icon={Bell} title="No reminders" description="Stay on top of rent payments, contract renewals, and maintenance tasks." />
      ) : (
        <div className="space-y-2">
          {reminders.map((r) => {
            const due = new Date(r.due_date);
            const overdue = r.status === 'pending' && due < new Date();
            return (
              <div
                key={r.id}
                className={`flex items-center gap-3 p-3 rounded-xl border transition ${
                  r.status === 'done' ? 'bg-ink-50/60 border-ink-100' : overdue ? 'bg-rose-50/50 border-rose-200' : 'bg-white border-ink-100'
                }`}
              >
                <button onClick={() => toggle(r)} className="flex-shrink-0">
                  {r.status === 'done' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Circle className={`w-5 h-5 ${overdue ? 'text-rose-400' : 'text-ink-300'}`} />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium ${r.status === 'done' ? 'text-ink-400 line-through' : 'text-ink-900'}`}>{r.title}</p>
                  <div className="flex flex-wrap gap-3 mt-0.5 text-xs text-ink-500">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(r.due_date)}</span>
                    <span>{REMINDER_TYPE_LABELS[r.type] || r.type}</span>
                    {overdue && <span className="text-rose-600 font-medium">Overdue</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => setEditing(r)} className="p-2 hover:bg-ink-100 rounded text-ink-400"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => setDeleting(r)} className="p-2 hover:bg-rose-50 rounded text-ink-400 hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showAdd && <CreateReminderForm propertyId={propertyId} onClose={() => setShowAdd(false)} onSuccess={() => fetchAll()} />}
      {editing && <CreateReminderForm propertyId={propertyId} reminderId={editing.id} initialData={editing as any} onClose={() => setEditing(null)} onSuccess={() => fetchAll()} />}
      {deleting && (
        <ConfirmDialog
          title="Delete reminder?"
          message={`Remove "${deleting.title}"?`}
          onCancel={() => setDeleting(null)}
          onConfirm={async () => { await api.delete(`/reminders/${deleting.id}`); await fetchAll(); setDeleting(null); }}
        />
      )}
    </div>
  );
};

/* ─── Main page ─────────────────────────────────────────────────────── */
export const PropertyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { property, isLoading, fetchProperty } = useProperty(id);
  const { deleteProperty } = useProperties();
  const { units } = useUnits(id);
  const [tab, setTab] = useState<Tab>('overview');
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const primaryUnitId = units[0]?.id;

  const tabs: { key: Tab; label: string; icon: any; needsUnit?: boolean }[] = [
    { key: 'overview', label: 'Overview', icon: Building2 },
    { key: 'contract', label: 'Contract', icon: FileText, needsUnit: true },
    { key: 'tenants', label: 'Tenants', icon: Phone, needsUnit: true },
    { key: 'finance', label: 'Finance', icon: DollarSign },
    { key: 'reminder', label: 'Reminders', icon: Bell },
  ];

  if (isLoading) return <Layout title="Property"><PageLoader /></Layout>;

  if (!property) {
    return (
      <Layout title="Property">
        <div className="card">
          <EmptyState
            icon={Building2}
            title="Property not found"
            description="This property may have been deleted."
            action={<button onClick={() => navigate('/properties')} className="btn-primary">Back to properties</button>}
          />
        </div>
      </Layout>
    );
  }

  const safeImages = Array.isArray(property.image_urls) ? property.image_urls : [];
  const hasImages = safeImages.length > 0;

  return (
    <Layout title="Property">
      <div className="space-y-5">
        <button
          onClick={() => navigate('/properties')}
          className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-800 transition"
        >
          <ArrowLeft className="w-4 h-4" /> All properties
        </button>

        {/* Header card */}
        <div className="card overflow-hidden">
          {hasImages && (
            <div className="p-4 pb-0">
              <ImageGallery images={safeImages} cover={property.cover_image_url} />
            </div>
          )}

          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex items-start gap-4">
                {!hasImages && (
                  <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-7 h-7" />
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold text-ink-900">{property.name}</h1>
                  <p className="text-ink-500 mt-1 flex items-center gap-1.5 text-sm">
                    <MapPin className="w-4 h-4 flex-shrink-0" /> {property.address}
                  </p>
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <span className="badge-blue">{PROPERTY_TYPE_LABELS[property.type] || property.type}</span>
                    <span className={statusBadgeClass(property.status)}>{PROPERTY_STATUS_LABELS[property.status]}</span>
                    {property.monthly_rent && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {formatCurrency(property.monthly_rent)}/mo
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => setEditing(true)} className="btn-secondary">
                  <Pencil className="w-4 h-4" /> Edit
                </button>
                <button onClick={() => setConfirmDelete(true)} className="btn-danger">
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
            {property.description && (
              <p className="mt-4 text-sm text-ink-600 border-t border-ink-100 pt-4 leading-relaxed">
                {property.description}
              </p>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="card">
          <div className="border-b border-ink-100 overflow-x-auto">
            <div className="flex">
              {tabs.map((t) => {
                const disabled = t.needsUnit && !primaryUnitId;
                return (
                  <button
                    key={t.key}
                    onClick={() => !disabled && setTab(t.key)}
                    disabled={disabled}
                    title={disabled ? 'Loading unit data…' : undefined}
                    className={`px-5 py-3.5 text-sm font-medium flex items-center gap-2 border-b-2 -mb-px transition whitespace-nowrap ${
                      tab === t.key
                        ? 'border-brand-600 text-brand-700'
                        : disabled
                        ? 'border-transparent text-ink-300 cursor-not-allowed'
                        : 'border-transparent text-ink-500 hover:text-ink-800'
                    }`}
                  >
                    <t.icon className="w-4 h-4" />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-5">
            {tab === 'overview' && <OverviewTab propertyId={property.id} />}
            {tab === 'contract' && primaryUnitId && <ContractTab primaryUnitId={primaryUnitId} />}
            {tab === 'tenants' && primaryUnitId && <TenantsTab primaryUnitId={primaryUnitId} />}
            {tab === 'finance' && <FinanceTab propertyId={property.id} />}
            {tab === 'reminder' && <ReminderTab propertyId={property.id} />}
            {(tab === 'contract' || tab === 'tenants') && !primaryUnitId && (
              <div className="flex justify-center py-8"><Spinner /></div>
            )}
          </div>
        </div>
      </div>

      {editing && (
        <CreatePropertyForm
          onClose={() => setEditing(false)}
          onSuccess={() => fetchProperty()}
          propertyId={property.id}
          initialData={property as any}
        />
      )}
      {confirmDelete && (
        <ConfirmDialog
          title="Delete property?"
          message={`This will permanently remove "${property.name}" and all its data. This cannot be undone.`}
          onCancel={() => setConfirmDelete(false)}
          onConfirm={async () => {
            await deleteProperty(property.id);
            navigate('/properties');
          }}
        />
      )}
    </Layout>
  );
};
