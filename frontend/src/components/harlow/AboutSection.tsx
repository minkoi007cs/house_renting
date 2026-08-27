import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, ShieldCheck, Star, Sparkles } from 'lucide-react';
import { CREDENTIALS, HARLOW_BRAND } from '../../data/harlowData';

interface AboutSectionProps {
  onOpenSchedule: () => void;
}

export function AboutSection({ onOpenSchedule }: AboutSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="py-24 px-6 md:px-16 bg-[#0b1222] border-t border-[#3d301d]/50">
      <div ref={ref} className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Portrait Image (5 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative"
          >
            {/* Image Frame with Gold Border Accent */}
            <div className="relative aspect-[4/5] rounded-sm overflow-hidden border border-[#c9a96e]/30 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=85"
                alt="Elena Harlow, founder of Harlow Properties"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1222]/80 via-transparent to-transparent" />

              {/* Bottom Overlay Label */}
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#0b1222]/85 backdrop-blur-md rounded border border-[#c9a96e]/30">
                <p className="font-serif text-lg text-[#f4ede0] font-normal">Elena Harlow</p>
                <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#c9a96e]">
                  Founder & Principal Broker
                </p>
              </div>
            </div>

            {/* Decorative Gold Corner Accent */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 border-r-2 border-b-2 border-[#c9a96e]/40 pointer-events-none hidden sm:block" />
          </motion.div>

          {/* Right Column: Narrative Text (7 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-2">
              <span className="w-5 h-[1px] bg-[#c9a96e]" />
              <span className="font-sans text-[11px] font-medium tracking-[0.2em] uppercase text-[#c9a96e]">
                ABOUT ELENA HARLOW
              </span>
            </div>

            {/* Heading */}
            <h2 className="font-serif text-4xl sm:text-5xl text-[#f4ede0] font-normal leading-[1.15]">
              15 Years of <br />
              <span className="italic text-[#c9a96e]">Making It Personal</span>
            </h2>

            {/* Bio Paragraphs */}
            <div className="space-y-4 font-sans text-[#f4ede0]/80 font-light text-base leading-relaxed">
              <p>
                Real estate is, at its core, about people — the transitions they&apos;re navigating,
                the lives they&apos;re building. Elena Harlow founded Harlow Properties on a simple
                premise: every client deserves an advisor, not just an agent.
              </p>
              <p>
                With over <strong className="font-normal text-[#c9a96e]">$1.2 billion in career sales</strong> across Bel Air,
                Beverly Hills, and the Palisades, Elena brings a depth of market knowledge that only comes
                from years of being genuinely present in every deal.
              </p>
              <p>
                Her approach is measured, transparent, and deeply personal. She returns every call. She
                knows every neighborhood block by block. And she stays with you long after the keys change
                hands.
              </p>
            </div>

            {/* Credentials Badges */}
            <div className="pt-4 border-t border-[#3d301d]">
              <p className="text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-[#c9a96e] mb-3">
                AFFILIATIONS & RECOGNITION
              </p>
              <div className="flex flex-wrap gap-3">
                {CREDENTIALS.map((cred) => (
                  <div
                    key={cred}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-sm bg-[#111a2e] border border-[#3d301d] text-xs font-sans text-[#f4ede0]/90"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#c9a96e]" />
                    <span>{cred}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="pt-4">
              <button
                onClick={onOpenSchedule}
                className="btn-gold cursor-pointer"
              >
                <span>Schedule a Private Consultation</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
