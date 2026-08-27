import { useState } from 'react';
import { ArrowUpRight, MapPin, X } from 'lucide-react';
import { NEIGHBORHOODS_DATA, NeighborhoodInfo } from '../../data/harlowData';

export function NeighborhoodsSection() {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<NeighborhoodInfo | null>(null);

  return (
    <section id="neighborhoods" className="py-24 px-6 md:px-16 bg-[#0b1222]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-5 h-[1px] bg-[#c9a96e]" />
              <span className="font-sans text-[11px] font-medium tracking-[0.2em] uppercase text-[#c9a96e]">
                LOCAL EXPERTISE
              </span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl text-[#f4ede0] font-normal tracking-tight">
              Neighborhoods We Know
            </h2>
          </div>
          <p className="font-sans text-xs text-[#f4ede0]/70 max-w-md">
            Decades of block-by-block precision across Los Angeles’ most coveted enclave micro-markets.
          </p>
        </div>

        {/* 6-Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {NEIGHBORHOODS_DATA.map((n) => (
            <div
              key={n.name}
              onClick={() => setSelectedNeighborhood(n)}
              className="relative overflow-hidden aspect-[4/3] rounded-md group cursor-pointer border border-[#3d301d]/60 shadow-lg"
            >
              {/* Neighborhood Image */}
              <img
                src={n.image}
                alt={n.name}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:bg-black/60 transition-colors duration-300" />

              {/* Top-Right Arrow Indicator */}
              <div className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-[#0b1222]/80 backdrop-blur-sm border border-[#c9a96e]/30 flex items-center justify-center text-[#c9a96e] opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                <ArrowUpRight className="w-4 h-4" />
              </div>

              {/* Bottom Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-[#f4ede0] font-serif text-xl sm:text-2xl font-normal group-hover:text-[#c9a96e] transition-colors">
                  {n.name}
                </p>
                <p className="text-[#c9a96e] text-xs font-sans uppercase tracking-[0.18em] mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium">
                  {n.type}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Neighborhood Detail Spotlight Modal */}
      {selectedNeighborhood && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1222]/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#0b1222] border border-[#c9a96e]/40 rounded-lg shadow-2xl overflow-hidden p-6 md:p-8 space-y-6">
            <button
              onClick={() => setSelectedNeighborhood(null)}
              className="absolute top-4 right-4 p-2 text-[#f4ede0]/70 hover:text-[#c9a96e] rounded-full hover:bg-[#111a2e]"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-2 text-[#c9a96e]">
              <MapPin className="w-5 h-5" />
              <span className="text-xs uppercase tracking-[0.2em] font-sans font-semibold">
                Neighborhood Spotlight
              </span>
            </div>

            <div>
              <h3 className="font-serif text-3xl text-[#f4ede0] font-normal mb-1 not-italic">
                {selectedNeighborhood.name}
              </h3>
              <p className="text-xs uppercase font-sans tracking-widest text-[#c9a96e]">
                {selectedNeighborhood.type} · Avg Price {selectedNeighborhood.avgPrice}
              </p>
            </div>

            <p className="text-sm font-sans text-[#f4ede0]/80 font-light leading-relaxed">
              {selectedNeighborhood.description}
            </p>

            <div className="pt-4 border-t border-[#3d301d]">
              <p className="text-xs font-sans uppercase tracking-widest text-[#c9a96e] mb-3">
                Signature Micro-Market Attributes
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedNeighborhood.highlights.map((item, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded bg-[#111a2e] border border-[#3d301d] text-xs font-sans text-[#f4ede0]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
