import { useState, useMemo } from 'react';
import { DollarSign, Plus, Pencil, Trash2, TrendingUp, TrendingDown, Wallet, Search } from 'lucide-react';
import { Layout } from '@/components/common/Layout';
import { PageLoader } from '@/components/common/Spinner';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { CreateTransactionForm } from '@/components/forms/CreateTransactionForm';
import { useTransactions } from '@/hooks/useTransactions';
import { useProperties } from '@/hooks/useProperties';
import { TX_CATEGORY_LABELS, statusBadgeClass } from '@/utils/labels';
import { formatCurrency, formatDate } from '@/utils/format';
import { Transaction } from '@/types';

const INCOME_CATS = ['rent', 'service_fee', 'deposit_refund', 'other_income'];
const EXPENSE_CATS = ['repair', 'maintenance', 'utilities', 'brokerage', 'cleaning', 'other_expense'];

export const TransactionsPage = () => {
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [search, setSearch] = useState('');

  const { transactions, total, isLoading, fetchTransactions, deleteTransaction } = useTransactions({
    type: typeFilter || undefined,
    category: categoryFilter || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
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

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-ink-500">
            Showing <span className="font-semibold text-ink-800">{filtered.length}</span> of {total} transactions
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
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
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
                      <td className="text-ink-600">{t.property?.name || '—'}</td>
                      <td>{TX_CATEGORY_LABELS[t.category] || t.category}</td>
                      <td className="max-w-[200px] truncate text-ink-500">{t.note || '—'}</td>
                      <td>
                        <span className={t.type === 'income' ? 'badge-green' : 'badge-red'}>
                          {t.type === 'income' ? 'Income' : 'Expense'}
                        </span>
                      </td>
                      <td
                        className={`text-right font-semibold ${
                          t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {t.type === 'income' ? '+' : '-'}
                        {formatCurrency(t.amount)}
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditing(t)}
                            className="p-1.5 hover:bg-ink-100 rounded text-ink-400"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleting(t)}
                            className="p-1.5 hover:bg-rose-50 rounded text-ink-400 hover:text-rose-600"
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
    brand: 'bg-brand-50 text-brand-600',
    green: 'bg-emerald-50 text-emerald-600',
    red: 'bg-rose-50 text-rose-600',
  };
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tones[tone]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-ink-500 font-medium uppercase tracking-wide">{label}</p>
        <p className="mt-1 text-xl font-bold text-ink-900">{value}</p>
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
    <div className="absolute inset-0 bg-ink-900/50" onClick={onCancel} />
    <div className="relative w-full max-w-sm bg-white rounded-xl2 shadow-soft">
      <div className="px-6 py-4 border-b border-ink-200">
        <h3 className="font-semibold text-ink-900">Select a property</h3>
      </div>
      <div className="max-h-64 overflow-y-auto px-3 py-3 space-y-1">
        {properties.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-brand-50 text-sm transition"
          >
            <div className="font-medium text-ink-900">{p.name}</div>
            <div className="text-xs text-ink-500">{p.address}</div>
          </button>
        ))}
      </div>
      <div className="px-6 py-4 border-t border-ink-100">
        <button onClick={onCancel} className="btn-secondary w-full">Cancel</button>
      </div>
    </div>
  </div>
);
