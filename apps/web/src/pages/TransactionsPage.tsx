import { useState, useMemo } from 'react';
import { DollarSign, Plus, Pencil, Trash2, TrendingUp, TrendingDown, Wallet, Search } from 'lucide-react';
import { Layout } from '@/components/common/Layout';
import { PageLoader } from '@/components/common/Spinner';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { CreateTransactionForm } from '@/components/forms/CreateTransactionForm';
import { useTransactions } from '@/hooks/useTransactions';
import { useProperties } from '@/hooks/useProperties';
import { TX_CATEGORY_LABELS } from '@/utils/labels';
import { formatCurrency, formatDate } from '@/utils/format';
import { Transaction } from '@/types';

const INCOME_CATS = ['rent', 'service_fee', 'deposit_received', 'deposit_refund', 'other_income'];
const EXPENSE_CATS = ['repair', 'maintenance', 'utilities', 'electricity', 'water_sewage', 'gas', 'lawn_care', 'snow_removal', 'hoa_fee', 'pest_control', 'hvac_maintenance', 'painting', 'appliance_repair', 'brokerage', 'cleaning', 'tax', 'insurance', 'other_expense'];

export const TransactionsPage = () => {
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [search, setSearch] = useState('');

  const { transactions, total, isLoading, error, fetchTransactions, deleteTransaction } = useTransactions({
    type: typeFilter || undefined,
    category: categoryFilter || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    limit: 200,
  });

  const { properties } = useProperties();

  const [showCreate, setShowCreate] = useState(false);
  const [createPropId, setCreatePropId] = useState('');
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [deleting, setDeleting] = useState<Transaction | null>(null);
  const [propStep, setPropStep] = useState(false);

  const filtered = useMemo(() => {
    if (!search) return transactions;
    const q = search.toLowerCase();
    return transactions.filter(
      (t) =>
        (t.note || '').toLowerCase().includes(q) ||
        (TX_CATEGORY_LABELS[t.category] || t.category).toLowerCase().includes(q)
    );
  }, [transactions, search]);

  const totals = useMemo(() => {
    const income = filtered.filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
    const expense = filtered.filter((t) => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
    return { income, expense, net: income - expense };
  }, [filtered]);

  const availableCategories =
    typeFilter === 'income' ? INCOME_CATS : typeFilter === 'expense' ? EXPENSE_CATS : [...INCOME_CATS, ...EXPENSE_CATS];

  return (
    <Layout title="Transactions">
      <div className="space-y-5">
        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard icon={TrendingUp} label="Total income" value={formatCurrency(totals.income)} tone="green" />
          <StatCard icon={TrendingDown} label="Total expense" value={formatCurrency(totals.expense)} tone="red" />
          <StatCard
            icon={Wallet}
            label="Net profit"
            value={formatCurrency(totals.net)}
            tone={totals.net >= 0 ? 'brand' : 'red'}
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 font-sans">
          <p className="text-sm text-[#f4ede0]/70">
            Showing <span className="font-semibold text-[#f4ede0]">{filtered.length}</span> of {total} transactions
          </p>
          <button
            onClick={() => {
              setCreatePropId(properties[0]?.id || '');
              if (properties.length === 1) {
                setCreatePropId(properties[0].id);
                setShowCreate(true);
              } else {
                setPropStep(true);
              }
            }}
            className="btn-primary"
          >
            <Plus className="w-4 h-4" /> Record transaction
          </button>
        </div>

        {/* Filters */}
        <div className="card p-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#c9a96e]" />
            <input
              type="text"
              placeholder="Search by note or category…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-9"
            />
          </div>
          <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setCategoryFilter(''); }} className="input md:w-36">
            <option value="">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="input md:w-44">
            <option value="">All categories</option>
            {availableCategories.map((c) => (
              <option key={c} value={c}>{TX_CATEGORY_LABELS[c] || c}</option>
            ))}
          </select>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input md:w-40" title="From" />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input md:w-40" title="To" />
        </div>

        {isLoading ? (
          <PageLoader />
        ) : error ? (
          <div className="card p-6 text-center">
            <p className="text-rose-400 font-medium mb-1 font-sans">Failed to load transactions</p>
            <p className="text-sm text-[#f4ede0]/60 mb-4 font-sans">{error}</p>
            <button onClick={fetchTransactions} className="btn-secondary">Retry</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={DollarSign}
              title="No transactions"
              description="Record your rental income and property expenses."
              action={
                <button onClick={() => setPropStep(true)} className="btn-primary">
                  <Plus className="w-4 h-4" /> Record transaction
                </button>
              }
            />
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Property</th>
                    <th>Category</th>
                    <th>Note</th>
                    <th>Type</th>
                    <th className="text-right">Amount</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t) => (
                    <tr key={t.id}>
                      <td className="whitespace-nowrap">{formatDate(t.transaction_date)}</td>
                      <td className="text-[#f4ede0]/80">{t.property?.name || '—'}</td>
                      <td>{TX_CATEGORY_LABELS[t.category] || t.category}</td>
                      <td className="max-w-[200px] truncate text-[#f4ede0]/50">{t.note || '—'}</td>
                      <td>
                        <span className={t.type === 'income' ? 'badge-green' : 'badge-red'}>
                          {t.type === 'income' ? 'Income' : 'Expense'}
                        </span>
                      </td>
                      <td
                        className={`text-right font-semibold ${
                          t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {t.type === 'income' ? '+' : '-'}
                        {formatCurrency(t.amount)}
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditing(t)}
                            className="p-2 hover:bg-[#0b1222] rounded text-[#f4ede0]/60 hover:text-[#c9a96e]"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleting(t)}
                            className="p-2 hover:bg-rose-950/40 rounded text-[#f4ede0]/60 hover:text-rose-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {propStep && (
        <PropertyPickerModal
          properties={properties}
          onCancel={() => setPropStep(false)}
          onSelect={(id) => {
            setCreatePropId(id);
            setPropStep(false);
            setShowCreate(true);
          }}
        />
      )}

      {showCreate && (
        <CreateTransactionForm
          propertyId={createPropId}
          onClose={() => setShowCreate(false)}
          onSuccess={() => fetchTransactions()}
        />
      )}

      {editing && (
        <CreateTransactionForm
          propertyId={editing.property_id}
          transactionId={editing.id}
          initialData={editing as any}
          onClose={() => setEditing(null)}
          onSuccess={() => {
            setEditing(null);
            fetchTransactions();
          }}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete transaction?"
          message="This transaction will be permanently removed."
          onCancel={() => setDeleting(null)}
          onConfirm={async () => {
            await deleteTransaction(deleting.id);
            setDeleting(null);
          }}
        />
      )}
    </Layout>
  );
};

const StatCard = ({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: any;
  label: string;
  value: string;
  tone: 'brand' | 'green' | 'red';
}) => {
  const tones: Record<string, string> = {
    brand: 'bg-[#0b1222] text-[#c9a96e] border border-[#3d301d]',
    green: 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60',
    red: 'bg-rose-950/60 text-rose-400 border border-rose-800/60',
  };
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tones[tone]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs uppercase font-sans tracking-widest text-[#c9a96e] font-semibold">{label}</p>
        <p className="mt-1 text-xl font-bold font-sans text-[#f4ede0]">{value}</p>
      </div>
    </div>
  );
};

const PropertyPickerModal = ({
  properties,
  onCancel,
  onSelect,
}: {
  properties: any[];
  onCancel: () => void;
  onSelect: (id: string) => void;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-[#0b1222]/80 backdrop-blur-sm" onClick={onCancel} />
    <div className="relative w-full max-w-sm bg-[#111a2e] rounded-2xl border border-[#3d301d] shadow-2xl text-[#f4ede0]">
      <div className="px-6 py-4 border-b border-[#3d301d]">
        <h3 className="font-serif text-lg font-normal text-[#f4ede0]">Select a property</h3>
      </div>
      <div className="max-h-64 overflow-y-auto px-3 py-3 space-y-1">
        {properties.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#0b1222] text-xs font-sans border border-transparent hover:border-[#3d301d] transition"
          >
            <div className="font-semibold text-sm text-[#f4ede0]">{p.name}</div>
            <div className="text-xs text-[#f4ede0]/50">{p.address}</div>
          </button>
        ))}
      </div>
      <div className="px-6 py-4 border-t border-[#3d301d]">
        <button onClick={onCancel} className="btn-secondary w-full">Cancel</button>
      </div>
    </div>
  </div>
);
