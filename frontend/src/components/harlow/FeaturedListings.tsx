import { useState } from 'react';
import { Bed, Bath, Maximize2, ArrowRight, Heart } from 'lucide-react';
import { LISTINGS_DATA, PropertyListing } from '../../data/harlowData';

interface FeaturedListingsProps {
  onSelectProperty: (property: PropertyListing) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export function FeaturedListings({
  onSelectProperty,
  favorites,
  onToggleFavorite,
}: FeaturedListingsProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  const filterOptions = [
    { label: 'All Properties', value: 'ALL' },
    { label: 'Bel Air', value: 'Bel Air' },
    { label: 'Beverly Hills', value: 'Beverly Hills' },
    { label: 'Pacific Palisades', value: 'Pacific Palisades' },
    { label: 'For Sale', value: 'FOR SALE' },
    { label: 'Just Listed', value: 'JUST LISTED' },
  ];

  const filteredListings = LISTINGS_DATA.filter((item) => {
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'FOR SALE' || selectedFilter === 'JUST LISTED') {
      return item.status === selectedFilter;
    }
    return item.neighborhood === selectedFilter;
  });

  return (
    <section id="properties" className="py-24 px-6 md:px-16 bg-[#0b1222]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-5 h-[1px] bg-[#c9a96e]" />
              <span className="font-sans text-[11px] font-medium tracking-[0.2em] uppercase text-[#c9a96e]">
                CURRENTLY AVAILABLE
              </span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl text-[#f4ede0] font-normal tracking-tight">
              Featured Properties
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelectedFilter(opt.value)}
                className={`px-4 py-2 text-xs font-sans font-medium tracking-wider uppercase rounded-full transition-all whitespace-nowrap ${
                  selectedFilter === opt.value
                    ? 'bg-[#c9a96e] text-[#0b1222] font-semibold shadow-[0_0_15px_rgba(201,169,110,0.3)]'
                    : 'bg-[#111a2e] text-[#f4ede0]/70 border border-[#3d301d] hover:border-[#c9a96e]/50 hover:text-[#f4ede0]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3-Column Glassmorphism Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredListings.map((property) => {
            const isFav = favorites.includes(property.id);
            return (
              <div
                key={property.id}
                onClick={() => onSelectProperty(property)}
                className="relative rounded-lg overflow-hidden group cursor-pointer flex flex-col justify-between"
                style={{
                  background: 'rgba(244,237,224,0.06)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(201,169,110,0.18)',
                  transition: 'transform 0.35s ease, box-shadow 0.35s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)';
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    '0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(201,169,110,0.3)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                <div>
                  {/* Photo Container */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-black">
                    <img
                      src={property.image}
                      alt={property.address}
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b1222] via-transparent to-transparent opacity-80" />

                    {/* Status Badge (Top Right) */}
                    <div className="absolute top-4 right-4 z-10">
                      <span className="px-3 py-1 text-[10px] uppercase font-sans font-bold tracking-widest rounded bg-[#0b1222]/85 text-[#c9a96e] border border-[#c9a96e]/40 shadow-lg backdrop-blur-sm">
                        {property.status}
                      </span>
                    </div>

                    {/* Heart / Favorite Button (Top Left) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(property.id);
                      }}
                      className={`absolute top-4 left-4 z-10 p-2 rounded-full backdrop-blur-md transition-colors ${
                        isFav
                          ? 'bg-red-500/20 border border-red-500/50 text-red-400'
                          : 'bg-[#0b1222]/60 border border-white/10 text-white/70 hover:text-[#c9a96e]'
                      }`}
                      title={isFav ? 'Remove from saved' : 'Save property'}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-6">
                    {/* Neighborhood Eyebrow */}
                    <p className="font-sans text-[11px] uppercase tracking-[0.18em] font-medium text-[#c9a96e] mb-2">
                      {property.neighborhood}
                    </p>

                    {/* Address Title */}
                    <h3 className="font-serif text-2xl text-[#f4ede0] font-bold mb-3 group-hover:text-[#c9a96e] transition-colors not-italic">
                      {property.address}
                    </h3>

                    {/* Price */}
                    <p className="font-sans text-2xl font-semibold text-[#c9a96e] mb-6">
                      {property.priceFormatted}
                    </p>

                    {/* Beds / Baths / SqFt Row */}
                    <div className="grid grid-cols-3 gap-2 py-3 px-4 rounded bg-[#0b1222]/60 border border-[#3d301d] text-xs font-sans text-[#f4ede0]/80">
                      <div className="flex items-center gap-1.5">
                        <Bed className="w-4 h-4 text-[#c9a96e]" />
                        <span>{property.beds} Beds</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Bath className="w-4 h-4 text-[#c9a96e]" />
                        <span>{property.baths} Baths</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Maximize2 className="w-4 h-4 text-[#c9a96e]" />
                        <span>{property.sqftFormatted} sqft</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Link */}
                <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-[#c9a96e]/10 mt-2">
                  <span className="font-sans text-xs font-semibold tracking-wider uppercase text-[#c9a96e] group-hover:underline flex items-center gap-1">
                    View Property
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                  <span className="text-[10px] text-[#f4ede0]/40 uppercase tracking-widest font-sans">
                    {property.architecturalStyle}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
