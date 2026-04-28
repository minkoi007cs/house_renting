import { useState, useEffect, useMemo } from 'react';
import { Users, Plus, Search, Phone, Mail, MapPin, Pencil, Trash2, Building2 } from 'lucide-react';
import { Layout } from '@/components/common/Layout';
import { PageLoader } from '@/components/common/Spinner';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { CreateTenantForm } from '@/components/forms/CreateTenantForm';
import { useTenants } from '@/hooks/useTenants';
import { useProperties } from '@/hooks/useProperties';
import api from '@/services/api';
import { Tenant, Unit } from '@/types';

export const TenantsPage = () => {
  const [search, setSearch] = useState('');
  const { tenants, isLoading, fetchTenants, deleteTenant } = useTenants(search || undefined);
  const { properties } = useProperties();
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<Tenant | null>(null);
  const [deleting, setDeleting] = useState<Tenant | null>(null);

  const [unitOptions, setUnitOptions] = useState<{ id: string; name: string; propertyName: string }[]>([]);
  const [propertyId, setPropertyId] = useState<string>('');

  useEffect(() => {
    if (!propertyId) {
      setUnitOptions([]);
      return;
    }
    api.get(`/properties/${propertyId}/units`).then((res) => {
      const list: Unit[] = res.data.data || [];
      const property = properties.find((p) => p.id === propertyId);
      setUnitOptions(list.map((u) => ({ id: u.id, name: u.name, propertyName: property?.name || '' })));
    });
  }, [propertyId, properties]);

  const tenantsWithLocation = useMemo(
    () =>
      tenants.map((t) => {
        const unit = t.unit;
        const property = unit?.property;
        return {
          tenant: t,
          unitName: unit?.name || '—',
          propertyName: property?.name || '—',
        };
      }),
    [tenants]
  );

  return (
    <Layout title="Tenants">
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-ink-500">
            <span className="font-semibold text-ink-800">{tenants.length}</span>{' '}
            {tenants.length === 1 ? 'tenant' : 'tenants'}
          </p>
          <button
            onClick={() => {
              setPropertyId('');
              setShowCreate(true);
            }}
            className="btn-primary"
          >
            <Plus className="w-4 h-4" /> Add tenant
          </button>
        </div>

        <div className="card p-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              placeholder="Search by name, phone, or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-9"
            />
          </div>
        </div>

        {isLoading ? (
          <PageLoader />
        ) : tenants.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={Users}
              title={search ? 'No matches' : 'No tenants yet'}
              description={search ? 'Try a different search term.' : 'Add tenants to track who lives in your units.'}
              action={
                !search && (
                  <button onClick={() => setShowCreate(true)} className="btn-primary">
                    <Plus className="w-4 h-4" /> Add tenant
                  </button>
                )
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {tenantsWithLocation.map(({ tenant: t, unitName, propertyName }) => (
              <div key={t.id} className="card p-5 hover:shadow-soft transition">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-11 h-11 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold flex-shrink-0">
                      {t.name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-ink-900 truncate">{t.name}</h3>
                      <p className="text-xs text-ink-500 truncate flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3" /> {propertyName} · {unitName}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => setEditing(t)} className="p-2 hover:bg-ink-100 rounded text-ink-400">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleting(t)} className="p-2 hover:bg-rose-50 rounded text-ink-400 hover:text-rose-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-1.5 text-sm">
                  {t.phone && (
                    <div className="flex items-center gap-2 text-ink-600">
                      <Phone className="w-3.5 h-3.5 text-ink-400" /> {t.phone}
                    </div>
                  )}
                  {t.email && (
                    <div className="flex items-center gap-2 text-ink-600 truncate">
                      <Mail className="w-3.5 h-3.5 text-ink-400 flex-shrink-0" />
                      <span className="truncate">{t.email}</span>
                    </div>
                  )}
                  {t.address && (
                    <div className="flex items-center gap-2 text-ink-600 truncate">
                      <MapPin className="w-3.5 h-3.5 text-ink-400 flex-shrink-0" />
                      <span className="truncate">{t.address}</span>
                    </div>
                  )}
                  {!t.phone && !t.email && !t.address && (
                    <p className="text-xs text-ink-400 italic">No contact info</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreate && (
        <div>
          {!propertyId ? (
            <PropertyPickerModal
              properties={properties}
              onCancel={() => setShowCreate(false)}
              onSelect={(id) => setPropertyId(id)}
            />
          ) : (
            <CreateTenantForm
              unitOptions={unitOptions}
              onUnitChange={() => {}}
              onClose={() => {
                setShowCreate(false);
                setPropertyId('');
              }}
              onSuccess={() => fetchTenants()}
            />
          )}
        </div>
      )}
      {editing && (
        <CreateTenantForm
          tenantId={editing.id}
          initialData={editing as any}
          onClose={() => setEditing(null)}
          onSuccess={() => fetchTenants()}
        />
      )}
      {deleting && (
        <ConfirmDialog
          title="Remove tenant?"
          message={`This will permanently remove "${deleting.name}".`}
          onCancel={() => setDeleting(null)}
          onConfirm={async () => {
            await deleteTenant(deleting.id);
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
    <div className="absolute inset-0 bg-ink-900/50" onClick={onCancel} />
    <div className="relative w-full max-w-md bg-white rounded-xl2 shadow-soft p-6">
      <h3 className="font-semibold text-ink-900">Pick a property</h3>
      <p className="text-sm text-ink-500 mt-1">Tenants are added to a unit inside a property.</p>
      <div className="mt-4 max-h-72 overflow-y-auto space-y-1">
        {properties.length === 0 ? (
          <p className="text-sm text-ink-400 italic py-4 text-center">No properties yet. Add a property first.</p>
        ) : (
          properties.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelect(p.id)}
              className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-brand-50 text-sm text-ink-700 hover:text-brand-700 transition"
            >
              <div className="font-medium">{p.name}</div>
              <div className="text-xs text-ink-500">{p.address}</div>
            </button>
          ))
        )}
      </div>
      <button onClick={onCancel} className="btn-secondary w-full mt-4">Cancel</button>
    </div>
  </div>
);
