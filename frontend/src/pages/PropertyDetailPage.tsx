import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Plus,
  Building2,
  MapPin,
  Layers,
  Users,
  FileText,
  DollarSign,
  Bell,
  ChevronDown,
  ChevronRight,
  Phone,
  Mail,
  CheckCircle2,
  Circle,
  TrendingUp,
  TrendingDown,
  Wallet,
  Calendar,
} from 'lucide-react';
import { Layout } from '@/components/common/Layout';
import { PageLoader, Spinner } from '@/components/common/Spinner';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { CreatePropertyForm } from '@/components/forms/CreatePropertyForm';
import { CreateUnitForm } from '@/components/forms/CreateUnitForm';
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
  PROPERTY_TYPE_LABELS,
  PROPERTY_STATUS_LABELS,
  UNIT_STATUS_LABELS,
  CONTRACT_STATUS_LABELS,
  REMINDER_TYPE_LABELS,
  TX_CATEGORY_LABELS,
  PAYMENT_CYCLE_LABELS,
  statusBadgeClass,
} from '@/utils/labels';
import { formatCurrency, formatDate } from '@/utils/format';
import { Unit, Tenant, RentalContract, Transaction, Reminder } from '@/types';
import { useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

type Tab = 'overview' | 'units' | 'contracts' | 'transactions' | 'reminders';

export const PropertyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { property, isLoading, fetchProperty } = useProperty(id);
  const { deleteProperty } = useProperties();
  const [tab, setTab] = useState<Tab>('overview');
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (isLoading) {
    return (
      <Layout title="Property">
        <PageLoader />
      </Layout>
    );
  }

  if (!property) {
    return (
      <Layout title="Property">
        <div className="card">
          <EmptyState
            icon={Building2}
            title="Property not found"
            description="The property you're looking for might have been deleted."
            action={
              <button onClick={() => navigate('/properties')} className="btn-primary">
                Back to properties
              </button>
            }
          />
        </div>
      </Layout>
    );
  }

  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: 'overview', label: 'Overview', icon: Building2 },
    { key: 'units', label: 'Units', icon: Layers },
    { key: 'contracts', label: 'Contracts', icon: FileText },
    { key: 'transactions', label: 'Finance', icon: DollarSign },
    { key: 'reminders', label: 'Reminders', icon: Bell },
  ];

  return (
    <Layout title="Property">
      <div className="space-y-5">
        <button
          onClick={() => navigate('/properties')}
          className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-800"
        >
          <ArrowLeft className="w-4 h-4" /> All properties
        </button>

        <div className="card p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-ink-900">{property.name}</h1>
                <p className="text-ink-500 mt-1 flex items-center gap-1.5 text-sm">
                  <MapPin className="w-4 h-4" /> {property.address}
                </p>
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <span className="badge-blue">{PROPERTY_TYPE_LABELS[property.type] || property.type}</span>
                  <span className={statusBadgeClass(property.status)}>
                    {PROPERTY_STATUS_LABELS[property.status]}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(true)} className="btn-secondary">
                <Pencil className="w-4 h-4" /> Edit
              </button>
              <button onClick={() => setConfirmDelete(true)} className="btn-danger">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
          {property.description && (
            <p className="mt-5 text-sm text-ink-600 border-t border-ink-100 pt-4">{property.description}</p>
          )}
        </div>

        <div className="card">
          <div className="border-b border-ink-100 overflow-x-auto">
            <div className="flex">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`px-5 py-3.5 text-sm font-medium flex items-center gap-2 border-b-2 -mb-px transition whitespace-nowrap ${
                    tab === t.key
                      ? 'border-brand-600 text-brand-700'
                      : 'border-transparent text-ink-500 hover:text-ink-800'
                  }`}
                >
                  <t.icon className="w-4 h-4" />
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5">
            {tab === 'overview' && <OverviewTab propertyId={property.id} />}
            {tab === 'units' && <UnitsTab propertyId={property.id} />}
            {tab === 'contracts' && <ContractsTab propertyId={property.id} />}
            {tab === 'transactions' && <TransactionsTab propertyId={property.id} />}
            {tab === 'reminders' && <RemindersTab propertyId={property.id} />}
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
          message={`This will permanently remove "${property.name}" and all its data. You can't undo this.`}
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

const OverviewTab = ({ propertyId }: { propertyId: string }) => {
  const { units } = useUnits(propertyId);
  const { analytics, isLoading } = useAnalytics(propertyId);

  const occupied = units.filter((u) => u.status === 'occupied').length;
  const occupancyRate = units.length ? Math.round((occupied / units.length) * 100) : 0;

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat icon={Layers} label="Units" value={units.length} tone="brand" />
        <Stat icon={Users} label="Occupied" value={`${occupied}/${units.length}`} tone="blue" sub={`${occupancyRate}%`} />
        <Stat icon={TrendingUp} label="Income" value={formatCurrency(analytics?.summary.total_income || 0)} tone="green" />
        <Stat icon={TrendingDown} label="Expense" value={formatCurrency(analytics?.summary.total_expense || 0)} tone="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="card p-5 lg:col-span-2">
          <h3 className="font-semibold text-ink-900 mb-4">Cash flow (last 12 months)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.by_month || []}>
                <defs>
                  <linearGradient id="ovIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="ovExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`} />
                <Tooltip
                  formatter={(v: any) => formatCurrency(v as number)}
                  contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
                />
                <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} fill="url(#ovIncome)" />
                <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} fill="url(#ovExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold text-ink-900 mb-4">Summary</h3>
          <div className="space-y-2.5">
            <FinanceRow label="Total income" value={formatCurrency(analytics?.summary.total_income || 0)} tone="green" />
            <FinanceRow label="Total expense" value={formatCurrency(analytics?.summary.total_expense || 0)} tone="red" />
            <div className="border-t border-ink-100 my-2" />
            <FinanceRow
              label="Net profit"
              value={formatCurrency(analytics?.summary.net_profit || 0)}
              tone={(analytics?.summary.net_profit || 0) >= 0 ? 'brand' : 'red'}
              bold
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Stat = ({
  icon: Icon,
  label,
  value,
  sub,
  tone = 'brand',
}: {
  icon: any;
  label: string;
  value: string | number;
  sub?: string;
  tone?: 'brand' | 'green' | 'red' | 'blue';
}) => {
  const tones: Record<string, string> = {
    brand: 'bg-brand-50 text-brand-600',
    green: 'bg-emerald-50 text-emerald-600',
    red: 'bg-rose-50 text-rose-600',
    blue: 'bg-sky-50 text-sky-600',
  };
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-ink-400 font-medium">{label}</p>
          <p className="mt-2 text-xl font-bold text-ink-900">{value}</p>
          {sub && <p className="text-xs text-ink-500 mt-0.5">{sub}</p>}
        </div>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${tones[tone]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

const FinanceRow = ({
  label,
  value,
  tone = 'ink',
  bold,
}: {
  label: string;
  value: string;
  tone?: 'green' | 'red' | 'brand' | 'ink';
  bold?: boolean;
}) => {
  const tones: Record<string, string> = {
    green: 'text-emerald-600',
    red: 'text-rose-600',
    brand: 'text-brand-700',
    ink: 'text-ink-900',
  };
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-ink-500">{label}</span>
      <span className={`${tones[tone]} ${bold ? 'font-bold text-base' : 'font-medium'}`}>{value}</span>
    </div>
  );
};

const UnitsTab = ({ propertyId }: { propertyId: string }) => {
  const { units, isLoading, createUnit, updateUnit, deleteUnit, fetchUnits } = useUnits(propertyId);
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<Unit | null>(null);
  const [deleting, setDeleting] = useState<Unit | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-ink-900">{units.length} units</h3>
        <button onClick={() => setShowCreate(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Add unit
        </button>
      </div>

      {units.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No units yet"
          description="Add the first unit to start tracking tenants, contracts, and finances."
          action={
            <button onClick={() => setShowCreate(true)} className="btn-primary">
              <Plus className="w-4 h-4" /> Add unit
            </button>
          }
        />
      ) : (
        <div className="space-y-2">
          {units.map((u) => (
            <div key={u.id} className="border border-ink-100 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 hover:bg-ink-50/50">
                <button
                  onClick={() => setExpanded(expanded === u.id ? null : u.id)}
                  className="flex items-center gap-3 flex-1 text-left"
                >
                  {expanded === u.id ? (
                    <ChevronDown className="w-4 h-4 text-ink-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-ink-400" />
                  )}
                  <div className="font-medium text-ink-900">{u.name}</div>
                  <span className={statusBadgeClass(u.status)}>{UNIT_STATUS_LABELS[u.status]}</span>
                </button>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditing(u)}
                    className="p-2 rounded-lg hover:bg-ink-100 text-ink-400 hover:text-ink-700"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleting(u)}
                    className="p-2 rounded-lg hover:bg-rose-50 text-ink-400 hover:text-rose-600"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {expanded === u.id && <UnitDetail unit={u} onChanged={fetchUnits} />}
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <CreateUnitForm
          onClose={() => setShowCreate(false)}
          onSubmit={async (data) => {
            await createUnit(data);
          }}
        />
      )}
      {editing && (
        <CreateUnitForm
          isEdit
          initialData={editing as any}
          onClose={() => setEditing(null)}
          onSubmit={async (data) => {
            await updateUnit(editing.id, data);
          }}
        />
      )}
      {deleting && (
        <ConfirmDialog
          title="Delete unit?"
          message={`This will remove "${deleting.name}" and its tenants/contracts. You can't undo this.`}
          onCancel={() => setDeleting(null)}
          onConfirm={async () => {
            await deleteUnit(deleting.id);
            setDeleting(null);
          }}
        />
      )}
    </div>
  );
};

const UnitDetail = ({ unit, onChanged }: { unit: Unit; onChanged: () => void }) => {
  const { tenants, isLoading: loadingT, fetchTenants } = useTenantsByUnit(unit.id);
  const { contracts, isLoading: loadingC, fetchContracts } = useContractsByUnit(unit.id);
  const [showTenant, setShowTenant] = useState(false);
  const [editTenant, setEditTenant] = useState<Tenant | null>(null);
  const [delTenant, setDelTenant] = useState<Tenant | null>(null);
  const [showContract, setShowContract] = useState(false);
  const [editContract, setEditContract] = useState<RentalContract | null>(null);
  const [delContract, setDelContract] = useState<RentalContract | null>(null);

  return (
    <div className="border-t border-ink-100 bg-ink-50/40 px-4 py-4 space-y-4">
      {unit.description && <p className="text-sm text-ink-600">{unit.description}</p>}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-ink-500 uppercase tracking-wide flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> Tenants ({tenants.length})
            </h4>
            <button onClick={() => setShowTenant(true)} className="text-xs text-brand-600 hover:text-brand-700 font-medium">
              + Add
            </button>
          </div>
          {loadingT ? (
            <Spinner />
          ) : tenants.length === 0 ? (
            <p className="text-xs text-ink-400 italic">No tenants assigned.</p>
          ) : (
            <div className="space-y-2">
              {tenants.map((t) => (
                <div key={t.id} className="bg-white rounded-lg p-3 text-sm flex items-center justify-between">
                  <div>
                    <p className="font-medium text-ink-900">{t.name}</p>
                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-ink-500">
                      {t.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {t.phone}
                        </span>
                      )}
                      {t.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {t.email}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => setEditTenant(t)} className="p-1.5 hover:bg-ink-100 rounded text-ink-400">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setDelTenant(t)} className="p-1.5 hover:bg-rose-50 rounded text-ink-400 hover:text-rose-600">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-ink-500 uppercase tracking-wide flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Contracts ({contracts.length})
            </h4>
            <button onClick={() => setShowContract(true)} className="text-xs text-brand-600 hover:text-brand-700 font-medium">
              + Add
            </button>
          </div>
          {loadingC ? (
            <Spinner />
          ) : contracts.length === 0 ? (
            <p className="text-xs text-ink-400 italic">No contracts yet.</p>
          ) : (
            <div className="space-y-2">
              {contracts.map((c) => (
                <div key={c.id} className="bg-white rounded-lg p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-ink-900">
                        {formatCurrency(c.rent_amount)}{' '}
                        <span className="text-xs text-ink-500">/ {PAYMENT_CYCLE_LABELS[c.payment_cycle] || c.payment_cycle}</span>
                      </p>
                      <p className="text-xs text-ink-500 mt-0.5">
                        {formatDate(c.start_date)} → {c.end_date ? formatDate(c.end_date) : 'open'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={statusBadgeClass(c.status)}>{CONTRACT_STATUS_LABELS[c.status]}</span>
                      <button onClick={() => setEditContract(c)} className="p-1.5 hover:bg-ink-100 rounded text-ink-400">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDelContract(c)} className="p-1.5 hover:bg-rose-50 rounded text-ink-400 hover:text-rose-600">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showTenant && (
        <CreateTenantForm
          unitId={unit.id}
          onClose={() => setShowTenant(false)}
          onSuccess={() => fetchTenants()}
        />
      )}
      {editTenant && (
        <CreateTenantForm
          unitId={unit.id}
          tenantId={editTenant.id}
          initialData={editTenant as any}
          onClose={() => setEditTenant(null)}
          onSuccess={() => fetchTenants()}
        />
      )}
      {delTenant && (
        <ConfirmDialog
          title="Remove tenant?"
          message={`This will remove "${delTenant.name}" from this unit.`}
          onCancel={() => setDelTenant(null)}
          onConfirm={async () => {
            await api.delete(`/tenants/${delTenant.id}`);
            await fetchTenants();
            setDelTenant(null);
            onChanged();
          }}
        />
      )}
      {showContract && (
        <CreateContractForm
          unitId={unit.id}
          onClose={() => setShowContract(false)}
          onSuccess={() => fetchContracts()}
        />
      )}
      {editContract && (
        <CreateContractForm
          unitId={unit.id}
          contractId={editContract.id}
          initialData={editContract as any}
          onClose={() => setEditContract(null)}
          onSuccess={() => fetchContracts()}
        />
      )}
      {delContract && (
        <ConfirmDialog
          title="Delete contract?"
          message="This contract will be permanently removed."
          onCancel={() => setDelContract(null)}
          onConfirm={async () => {
            await api.delete(`/contracts/${delContract.id}`);
            await fetchContracts();
            setDelContract(null);
          }}
        />
      )}
    </div>
  );
};

const ContractsTab = ({ propertyId }: { propertyId: string }) => {
  const { units } = useUnits(propertyId);
  const [contracts, setContracts] = useState<RentalContract[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<RentalContract | null>(null);
  const [deleting, setDeleting] = useState<RentalContract | null>(null);
  const [unitForCreate, setUnitForCreate] = useState('');

  const fetchAll = async () => {
    if (!units.length) {
      setContracts([]);
      return;
    }
    setLoading(true);
    try {
      const results = await Promise.all(
        units.map((u) => api.get(`/units/${u.id}/contracts`).then((r) => r.data.data || []))
      );
      const all = results.flat() as RentalContract[];
      all.sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());
      setContracts(all);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [units.map((u) => u.id).join(',')]);

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-ink-900">{contracts.length} contracts</h3>
        {units.length > 0 && (
          <button
            onClick={() => {
              setUnitForCreate(units[0].id);
              setShowAdd(true);
            }}
            className="btn-primary"
          >
            <Plus className="w-4 h-4" /> Add contract
          </button>
        )}
      </div>

      {units.length === 0 ? (
        <EmptyState icon={FileText} title="Add a unit first" description="Contracts are linked to units." />
      ) : contracts.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No contracts yet"
          description="Create a rental contract to track tenancy and payments."
        />
      ) : (
        <div className="overflow-x-auto -mx-5">
          <table className="table">
            <thead>
              <tr>
                <th>Unit</th>
                <th>Period</th>
                <th>Rent</th>
                <th>Cycle</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((c) => {
                const unit = units.find((u) => u.id === c.unit_id);
                return (
                  <tr key={c.id}>
                    <td className="font-medium text-ink-900">{unit?.name || '—'}</td>
                    <td>
                      {formatDate(c.start_date)} → {c.end_date ? formatDate(c.end_date) : 'open'}
                    </td>
                    <td>{formatCurrency(c.rent_amount)}</td>
                    <td>{PAYMENT_CYCLE_LABELS[c.payment_cycle] || c.payment_cycle}</td>
                    <td>
                      <span className={statusBadgeClass(c.status)}>{CONTRACT_STATUS_LABELS[c.status]}</span>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setEditing(c)} className="p-1.5 hover:bg-ink-100 rounded text-ink-400">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleting(c)} className="p-1.5 hover:bg-rose-50 rounded text-ink-400 hover:text-rose-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showAdd && (
        <CreateContractForm
          unitId={unitForCreate}
          unitOptions={units.map((u) => ({ id: u.id, name: u.name }))}
          onUnitChange={(id) => setUnitForCreate(id)}
          onClose={() => setShowAdd(false)}
          onSuccess={() => fetchAll()}
        />
      )}
      {editing && (
        <CreateContractForm
          unitId={editing.unit_id}
          contractId={editing.id}
          initialData={editing as any}
          onClose={() => setEditing(null)}
          onSuccess={() => fetchAll()}
        />
      )}
      {deleting && (
        <ConfirmDialog
          title="Delete contract?"
          message="This contract will be permanently removed."
          onCancel={() => setDeleting(null)}
          onConfirm={async () => {
            await api.delete(`/contracts/${deleting.id}`);
            await fetchAll();
            setDeleting(null);
          }}
        />
      )}
    </div>
  );
};

const TransactionsTab = ({ propertyId }: { propertyId: string }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<'' | 'income' | 'expense'>('');
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [deleting, setDeleting] = useState<Transaction | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (type) params.type = type;
      const res = await api.get(`/properties/${propertyId}/transactions`, { params });
      setTransactions(res.data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId, type]);

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
        <PageLoader />
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
                  <td className="max-w-xs truncate">{t.note || '—'}</td>
                  <td>
                    <span className={t.type === 'income' ? 'badge-green' : 'badge-red'}>
                      {t.type === 'income' ? 'Income' : 'Expense'}
                    </span>
                  </td>
                  <td className={`text-right font-semibold ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {t.type === 'income' ? '+' : '-'}
                    {formatCurrency(t.amount)}
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setEditing(t)} className="p-1.5 hover:bg-ink-100 rounded text-ink-400">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleting(t)} className="p-1.5 hover:bg-rose-50 rounded text-ink-400 hover:text-rose-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAdd && (
        <CreateTransactionForm
          propertyId={propertyId}
          onClose={() => setShowAdd(false)}
          onSuccess={() => fetchAll()}
        />
      )}
      {editing && (
        <CreateTransactionForm
          propertyId={propertyId}
          transactionId={editing.id}
          initialData={editing as any}
          onClose={() => setEditing(null)}
          onSuccess={() => fetchAll()}
        />
      )}
      {deleting && (
        <ConfirmDialog
          title="Delete transaction?"
          message="This transaction will be permanently removed."
          onCancel={() => setDeleting(null)}
          onConfirm={async () => {
            await api.delete(`/transactions/${deleting.id}`);
            await fetchAll();
            setDeleting(null);
          }}
        />
      )}
    </div>
  );
};

const RemindersTab = ({ propertyId }: { propertyId: string }) => {
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

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-ink-900">{reminders.length} reminders</h3>
        <button onClick={() => setShowAdd(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Add reminder
        </button>
      </div>

      {loading ? (
        <PageLoader />
      ) : reminders.length === 0 ? (
        <EmptyState icon={Bell} title="No reminders" description="Stay on top of payments, expirations, and maintenance tasks." />
      ) : (
        <div className="space-y-2">
          {reminders.map((r) => {
            const due = new Date(r.due_date);
            const overdue = r.status === 'pending' && due < new Date();
            return (
              <div
                key={r.id}
                className={`flex items-center gap-3 p-3 rounded-xl border ${
                  r.status === 'done'
                    ? 'bg-ink-50/50 border-ink-100'
                    : overdue
                    ? 'bg-rose-50/40 border-rose-100'
                    : 'bg-white border-ink-100'
                }`}
              >
                <button onClick={() => toggle(r)} className="text-ink-400 hover:text-brand-600">
                  {r.status === 'done' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium ${r.status === 'done' ? 'text-ink-400 line-through' : 'text-ink-900'}`}>
                    {r.title}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-0.5 text-xs text-ink-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {formatDate(r.due_date)}
                    </span>
                    <span>{REMINDER_TYPE_LABELS[r.type] || r.type}</span>
                    {overdue && <span className="text-rose-600 font-medium">Overdue</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setEditing(r)} className="p-1.5 hover:bg-ink-100 rounded text-ink-400">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleting(r)} className="p-1.5 hover:bg-rose-50 rounded text-ink-400 hover:text-rose-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showAdd && (
        <CreateReminderForm
          propertyId={propertyId}
          onClose={() => setShowAdd(false)}
          onSuccess={() => fetchAll()}
        />
      )}
      {editing && (
        <CreateReminderForm
          propertyId={propertyId}
          reminderId={editing.id}
          initialData={editing as any}
          onClose={() => setEditing(null)}
          onSuccess={() => fetchAll()}
        />
      )}
      {deleting && (
        <ConfirmDialog
          title="Delete reminder?"
          message={`This will remove "${deleting.title}".`}
          onCancel={() => setDeleting(null)}
          onConfirm={async () => {
            await api.delete(`/reminders/${deleting.id}`);
            await fetchAll();
            setDeleting(null);
          }}
        />
      )}
    </div>
  );
};
