import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Calendar, Sparkles } from 'lucide-react';
import { HARLOW_BRAND } from '../../data/harlowData';

interface HeroSectionProps {
  onViewListings: () => void;
  onOpenSchedule: () => void;
}

export function HeroSection({ onViewListings, onOpenSchedule }: HeroSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const rightPanelY = useTransform(scrollY, [0, 600], [0, -80]);
  const rightPanelScale = useTransform(scrollY, [0, 600], [1.15, 1.05]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-[#0b1222] pt-20 md:pt-0"
    >
      {/* Background for Mobile Only */}
      <div className="md:hidden absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85"
          alt="Luxury property exterior at golden hour"
          className="w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1222]/90 via-[#0b1222]/80 to-[#0b1222]" />
      </div>

      {/* Left Panel: Navy Text Area (55% desktop) */}
      <div className="relative z-20 w-full md:w-[55%] flex items-center px-6 md:px-16 lg:px-24 py-16 md:py-24">
        <div className="max-w-xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-2 mb-6"
          >
            <span className="w-6 h-[1px] bg-[#c9a96e]" />
            <span className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase text-[#c9a96e]">
              {HARLOW_BRAND.areas}
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#f4ede0] leading-[1.05] tracking-[-0.01em] mb-8"
          >
            Where Home <br />
            <span className="italic font-normal text-[#c9a96e]">Begins</span>
          </motion.h1>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-sans text-base sm:text-lg text-[#f4ede0]/80 font-light leading-relaxed mb-10 max-w-lg"
          >
            <strong className="font-normal text-[#f4ede0]">Harlow Properties</strong> — boutique
            representation for buyers and sellers who expect more than a transaction.
          </motion.p>

          {/* CTA Row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
          >
            <button
              onClick={onViewListings}
              className="btn-gold group cursor-pointer shadow-lg hover:shadow-[0_0_30px_rgba(201,169,110,0.3)]"
            >
              <span>View Current Listings</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={onOpenSchedule}
              className="btn-outline-cream group cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#c9a96e]" />
              <span>Schedule a Consultation</span>
            </button>
          </motion.div>

          {/* Quick Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-14 pt-8 border-t border-[#c9a96e]/15 flex items-center gap-8 text-xs text-[#f4ede0]/60 font-sans tracking-wide"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#c9a96e]" />
              <span>Private Off-Market Access</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c9a96e]" />
              <span>Over $1.2B Career Sales</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel: Property Photo with Parallax (50% desktop, hidden mobile) */}
      <div className="hidden md:block absolute right-0 top-0 w-[50%] h-full overflow-hidden z-10">
        <motion.div style={{ y: rightPanelY, scale: rightPanelScale }} className="w-full h-full">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85"
            alt="Luxury property exterior at golden hour"
            className="w-full h-full object-cover object-center"
            style={{ willChange: 'transform' }}
          />
        </motion.div>

        {/* Gradient Blend Overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, rgba(11,18,34,1) 0%, rgba(11,18,34,0.4) 25%, transparent 60%), linear-gradient(to top, rgba(11,18,34,0.6) 0%, transparent 30%)',
          }}
        />

        {/* Subtle Decorative Gold Badge Overlay */}
        <div className="absolute bottom-12 right-12 z-20 hidden lg:flex items-center gap-4 bg-[#0b1222]/80 backdrop-blur-md p-4 rounded-sm border border-[#c9a96e]/30 shadow-2xl">
          <div className="w-10 h-10 rounded-full border border-[#c9a96e] flex items-center justify-center bg-[#c9a96e]/10">
            <span className="font-serif text-[#c9a96e] font-bold text-xs">LA</span>
          </div>
          <div>
            <p className="text-xs font-serif text-[#f4ede0]">Bel Air Estate Sanctuary</p>
            <p className="text-[10px] uppercase font-sans tracking-widest text-[#c9a96e]">
              Offered at $6,850,000
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
