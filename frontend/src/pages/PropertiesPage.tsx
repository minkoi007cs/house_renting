import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Plus, Search, MoreVertical, Pencil, Trash2, MapPin, Layers } from 'lucide-react';
import { Layout } from '@/components/common/Layout';
import { PageLoader } from '@/components/common/Spinner';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { CreatePropertyForm } from '@/components/forms/CreatePropertyForm';
import { useProperties } from '@/hooks/useProperties';
import {
  PROPERTY_TYPE_LABELS,
  PROPERTY_STATUS_LABELS,
  statusBadgeClass,
} from '@/utils/labels';
import { Property } from '@/types';

export const PropertiesPage = () => {
  const navigate = useNavigate();
  const { properties, isLoading, fetchProperties, deleteProperty } = useProperties();
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<Property | null>(null);
  const [deleting, setDeleting] = useState<Property | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (statusFilter && p.status !== statusFilter) return false;
      if (typeFilter && p.type !== typeFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.address.toLowerCase().includes(q))
          return false;
      }
      return true;
    });
  }, [properties, search, statusFilter, typeFilter]);

  const handleDelete = async () => {
    if (!deleting) return;
    await deleteProperty(deleting.id);
    setDeleting(null);
  };

  const unitsCount = (p: Property) => {
    if (Array.isArray(p.units) && p.units.length && (p.units[0] as any).count !== undefined) {
      return (p.units[0] as any).count;
    }
    return Array.isArray(p.units) ? p.units.length : 0;
  };

  return (
    <Layout title="Properties">
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-sm text-ink-500">
              Managing <span className="font-semibold text-ink-800">{properties.length}</span>{' '}
              {properties.length === 1 ? 'property' : 'properties'}
            </p>
          </div>
          <button onClick={() => setShowCreate(true)} className="btn-primary">
            <Plus className="w-4 h-4" />
            Add Property
          </button>
        </div>

        {/* Filters */}
        <div className="card p-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              placeholder="Search by name or address…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-9"
            />
          </div>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="input md:w-44">
            <option value="">All types</option>
            {Object.entries(PROPERTY_TYPE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input md:w-44">
            <option value="">All statuses</option>
            {Object.entries(PROPERTY_STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <PageLoader />
        ) : filtered.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={Building2}
              title={properties.length === 0 ? 'No properties yet' : 'No matches'}
              description={
                properties.length === 0
                  ? 'Add your first property to start managing rentals.'
                  : 'Try adjusting your search or filters.'
              }
              action={
                properties.length === 0 && (
                  <button onClick={() => setShowCreate(true)} className="btn-primary">
                    <Plus className="w-4 h-4" /> Add Property
                  </button>
                )
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="card p-5 hover:shadow-soft hover:border-brand-200 transition cursor-pointer relative group"
                onClick={() => navigate(`/properties/${p.id}`)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 flex-shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-ink-900 truncate">{p.name}</h3>
                    <p className="text-sm text-ink-500 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{p.address}</span>
                    </p>
                  </div>
                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setOpenMenu(openMenu === p.id ? null : p.id)}
                      className="p-1.5 rounded-lg hover:bg-ink-100 text-ink-400 hover:text-ink-700 transition"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {openMenu === p.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                        <div className="absolute right-0 top-8 w-40 bg-white rounded-lg shadow-soft border border-ink-200 py-1 z-20">
                          <button
                            onClick={() => {
                              setOpenMenu(null);
                              setEditing(p);
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-ink-700 hover:bg-ink-50 flex items-center gap-2"
                          >
                            <Pencil className="w-4 h-4" /> Edit
                          </button>
                          <button
                            onClick={() => {
                              setOpenMenu(null);
                              setDeleting(p);
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 flex-wrap">
                  <span className="badge-blue">{PROPERTY_TYPE_LABELS[p.type] || p.type}</span>
                  <span className={statusBadgeClass(p.status)}>{PROPERTY_STATUS_LABELS[p.status]}</span>
                </div>

                <div className="mt-4 pt-4 border-t border-ink-100 flex items-center gap-4 text-xs text-ink-500">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    {unitsCount(p)} units
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreate && (
        <CreatePropertyForm onClose={() => setShowCreate(false)} onSuccess={() => fetchProperties()} />
      )}
      {editing && (
        <CreatePropertyForm
          onClose={() => setEditing(null)}
          onSuccess={() => fetchProperties()}
          propertyId={editing.id}
          initialData={editing as any}
        />
      )}
      {deleting && (
        <ConfirmDialog
          title="Delete property?"
          message={`This will permanently remove "${deleting.name}". You can't undo this.`}
          onCancel={() => setDeleting(null)}
          onConfirm={handleDelete}
        />
      )}
    </Layout>
  );
};
