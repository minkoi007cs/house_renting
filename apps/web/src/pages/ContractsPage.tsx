import { useState, useEffect, useMemo } from 'react';
import { FileText, Plus, Pencil, Trash2, Calendar, Building2 } from 'lucide-react';
import { Layout } from '@/components/common/Layout';
import { PageLoader } from '@/components/common/Spinner';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { CreateContractForm } from '@/components/forms/CreateContractForm';
import { useContracts } from '@/hooks/useContracts';
import { useProperties } from '@/hooks/useProperties';
import api from '@/services/api';
import {
  CONTRACT_STATUS_LABELS,
  PAYMENT_CYCLE_LABELS,
  statusBadgeClass,
} from '@/utils/labels';
import { formatCurrency, formatDate } from '@/utils/format';
import { RentalContract, Unit } from '@/types';

export const ContractsPage = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const { contracts, isLoading, fetchContracts, deleteContract } = useContracts(statusFilter || undefined);
  const { properties } = useProperties();

  const [step, setStep] = useState<'idle' | 'pick-property' | 'form'>('idle');
  const [pickerProp, setPickerProp] = useState('');
  const [unitOptions, setUnitOptions] = useState<{ id: string; name: string }[]>([]);
  const [editing, setEditing] = useState<RentalContract | null>(null);
  const [deleting, setDeleting] = useState<RentalContract | null>(null);

  useEffect(() => {
    if (!pickerProp) {
      setUnitOptions([]);
      return;
    }
    api.get(`/properties/${pickerProp}/units`).then((res) => {
      const list: Unit[] = res.data.data || [];
      setUnitOptions(list.map((u) => ({ id: u.id, name: u.name })));
    });
  }, [pickerProp]);

  const totals = useMemo(() => {
    const active = contracts.filter((c) => c.status === 'active').length;
    const totalRent = contracts
      .filter((c) => c.status === 'active')
      .reduce((s, c) => s + Number(c.rent_amount), 0);
    return { active, totalRent };
  }, [contracts]);

  const resetCreate = () => {
    setStep('idle');
    setPickerProp('');
  };

  return (
    <Layout title="Contracts">
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 font-sans">
          <p className="text-sm text-[#f4ede0]/70">
            <span className="font-semibold text-[#f4ede0]">{contracts.length}</span> total ·{' '}
            <span className="font-semibold text-emerald-400">{totals.active}</span> active ·{' '}
            <span className="font-semibold text-[#c9a96e]">{formatCurrency(totals.totalRent)}</span> / month
          </p>
          <button onClick={() => setStep('pick-property')} className="btn-primary">
            <Plus className="w-4 h-4" /> Add contract
          </button>
        </div>

        <div className="card p-4 flex gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input md:w-48"
          >
            <option value="">All statuses</option>
            {Object.entries(CONTRACT_STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <PageLoader />
        ) : contracts.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={FileText}
              title={statusFilter ? 'No contracts found' : 'No contracts yet'}
              description={
                statusFilter
                  ? 'No contracts match this status filter.'
                  : 'Create a rental contract to track tenancy terms and payments.'
              }
              action={
                !statusFilter && (
                  <button onClick={() => setStep('pick-property')} className="btn-primary">
                    <Plus className="w-4 h-4" /> Add contract
                  </button>
                )
              }
            />
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Property / Unit</th>
                    <th>Period</th>
                    <th>Rent</th>
                    <th>Cycle</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.map((c) => {
                    const unit = c.unit;
                    const property = unit?.property;
                    return (
                      <tr key={c.id}>
                        <td>
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-[#c9a96e] flex-shrink-0" />
                            <div>
                              <div className="font-medium text-[#f4ede0]">{property?.name || '—'}</div>
                              <div className="text-xs text-[#f4ede0]/50">{unit?.name || '—'}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-1.5 text-sm text-[#f4ede0]/80">
                            <Calendar className="w-3.5 h-3.5 text-[#c9a96e]" />
                            {formatDate(c.start_date)} → {c.end_date ? formatDate(c.end_date) : 'open'}
                          </div>
                        </td>
                        <td className="font-semibold text-[#c9a96e]">{formatCurrency(c.rent_amount)}</td>
                        <td className="text-[#f4ede0]/80">{PAYMENT_CYCLE_LABELS[c.payment_cycle] || c.payment_cycle}</td>
                        <td>
                          <span className={statusBadgeClass(c.status)}>
                            {CONTRACT_STATUS_LABELS[c.status]}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setEditing(c)}
                              className="p-2 hover:bg-[#0b1222] rounded text-[#f4ede0]/60 hover:text-[#c9a96e]"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleting(c)}
                              className="p-2 hover:bg-rose-950/40 rounded text-[#f4ede0]/60 hover:text-rose-400"
                            >
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
          </div>
        )}
      </div>

      {step === 'pick-property' && (
        <PropertyPickerModal
          properties={properties}
          onCancel={resetCreate}
          onSelect={(id) => {
            setPickerProp(id);
            setStep('form');
          }}
        />
      )}

      {step === 'form' && (
        <CreateContractForm
          unitOptions={unitOptions}
          onClose={resetCreate}
          onSuccess={() => {
            resetCreate();
            fetchContracts();
          }}
        />
      )}

      {editing && (
        <CreateContractForm
          unitId={editing.unit_id}
          contractId={editing.id}
          initialData={editing as any}
          onClose={() => setEditing(null)}
          onSuccess={() => {
            setEditing(null);
            fetchContracts();
          }}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete contract?"
          message="This contract will be permanently removed."
          onCancel={() => setDeleting(null)}
          onConfirm={async () => {
            await deleteContract(deleting.id);
            setDeleting(null);
          }}
        />
      )}
    </Layout>
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
        <p className="text-xs font-sans text-[#f4ede0]/60 mt-0.5">Contracts are linked to units inside a property.</p>
      </div>
      <div className="max-h-72 overflow-y-auto px-3 py-3 space-y-1">
        {properties.length === 0 ? (
          <p className="text-xs font-sans text-[#f4ede0]/40 italic py-4 text-center">No properties yet.</p>
        ) : (
          properties.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelect(p.id)}
              className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#0b1222] text-xs font-sans border border-transparent hover:border-[#3d301d] transition"
            >
              <div className="font-semibold text-sm text-[#f4ede0]">{p.name}</div>
              <div className="text-xs text-[#f4ede0]/50">{p.address}</div>
            </button>
          ))
        )}
      </div>
      <div className="px-6 py-4 border-t border-[#3d301d]">
        <button onClick={onCancel} className="btn-secondary w-full">Cancel</button>
      </div>
    </div>
  </div>
);
