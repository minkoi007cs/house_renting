import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Plus, Search, MoreVertical, Pencil, Trash2, MapPin, DollarSign } from 'lucide-react';
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
import { formatCurrency } from '@/utils/format';
import { Property } from '@/types';

const PropertyCard = ({
  property,
  onClick,
  onEdit,
  onDelete,
}: {
  property: Property;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const cover = property.cover_image_url || property.image_urls?.[0];

  return (
    <div
      className="card overflow-hidden hover:shadow-soft hover:border-brand-200 transition cursor-pointer relative group"
      onClick={onClick}
    >
      {/* Cover image / placeholder */}
      <div className="h-40 bg-gradient-to-br from-brand-50 to-brand-100 relative overflow-hidden">
        {cover ? (
          <img
            src={cover}
            alt={property.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Building2 className="w-12 h-12 text-brand-200" />
          </div>
        )}
        {/* Status badge overlay */}
        <div className="absolute top-3 left-3">
          <span className={statusBadgeClass(property.status)}>
            {PROPERTY_STATUS_LABELS[property.status]}
          </span>
        </div>
        {/* Menu button */}
        <div
          className="absolute top-2 right-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-ink-500 hover:text-ink-800 shadow-sm transition"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-8 w-36 bg-white rounded-lg shadow-soft border border-ink-200 py-1 z-20">
                <button
                  onClick={() => { setMenuOpen(false); onEdit(); }}
                  className="w-full px-3 py-2 text-left text-sm text-ink-700 hover:bg-ink-50 flex items-center gap-2"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => { setMenuOpen(false); onDelete(); }}
                  className="w-full px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-ink-900 truncate">{property.name}</h3>
            <p className="text-xs text-ink-500 mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{property.address}</span>
            </p>
          </div>
          <span className="badge-blue flex-shrink-0 text-xs">
            {PROPERTY_TYPE_LABELS[property.type] || property.type}
          </span>
        </div>

        {property.monthly_rent ? (
          <div className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
            <DollarSign className="w-4 h-4" />
            {formatCurrency(property.monthly_rent)}
            <span className="font-normal text-ink-400 text-xs">/mo</span>
          </div>
        ) : (
          <div className="mt-3 text-xs text-ink-400 italic">No rent set</div>
        )}
      </div>
    </div>
  );
};

export const PropertiesPage = () => {
  const navigate = useNavigate();
  const { properties, isLoading, fetchProperties, deleteProperty } = useProperties();
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<Property | null>(null);
  const [deleting, setDeleting] = useState<Property | null>(null);
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

  return (
    <Layout title="Properties">
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-ink-500">
            Managing{' '}
            <span className="font-semibold text-ink-800">{properties.length}</span>{' '}
            {properties.length === 1 ? 'property' : 'properties'}
          </p>
          <button onClick={() => setShowCreate(true)} className="btn-primary">
            <Plus className="w-4 h-4" /> Add Property
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
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="input md:w-44"
          >
            <option value="">All types</option>
            {Object.entries(PROPERTY_TYPE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input md:w-44"
          >
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
              <PropertyCard
                key={p.id}
                property={p}
                onClick={() => navigate(`/properties/${p.id}`)}
                onEdit={() => setEditing(p)}
                onDelete={() => setDeleting(p)}
              />
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
          message={`This will permanently remove "${deleting.name}" and all its data. You can't undo this.`}
          onCancel={() => setDeleting(null)}
          onConfirm={handleDelete}
        />
      )}
    </Layout>
  );
};
