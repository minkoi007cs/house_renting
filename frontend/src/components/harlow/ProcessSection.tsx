import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { PROCESS_STEPS } from '../../data/harlowData';

export function ProcessSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="process" className="py-24 px-6 md:px-16 bg-[#0b1222] relative overflow-hidden">
      <div ref={ref} className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-5 h-[1px] bg-[#c9a96e]" />
            <span className="font-sans text-[11px] font-medium tracking-[0.2em] uppercase text-[#c9a96e]">
              HOW WE WORK
            </span>
            <span className="w-5 h-[1px] bg-[#c9a96e]" />
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl text-[#f4ede0] font-normal tracking-tight">
            From First Call to Closing Day
          </h2>
          <p className="font-sans text-sm text-[#f4ede0]/70 font-light mt-4">
            A disciplined, high-touch methodology designed to provide clarity, protection, and peace of mind at every phase.
          </p>
        </div>

        {/* Timeline Steps Container */}
        <div className="relative">
          {/* Desktop Connecting Line */}
          <div className="hidden lg:block absolute top-[52px] left-[10%] right-[10%] h-[1px] bg-[#3d301d] z-0">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              className="w-full h-full bg-[#c9a96e]/40 origin-left"
            />
          </div>

          {/* 4 Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {PROCESS_STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  delay: i * 0.15,
                  duration: 0.65,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative p-6 rounded-lg bg-[#111a2e]/60 border border-[#3d301d] hover:border-[#c9a96e]/40 transition-all duration-300 group flex flex-col justify-between"
              >
                {/* Large Background Step Number */}
                <div className="font-serif text-7xl font-bold text-[#c9a96e]/10 group-hover:text-[#c9a96e]/20 transition-colors select-none mb-2">
                  {step.number}
                </div>

                <div>
                  {/* Step Title */}
                  <h3 className="font-serif text-xl text-[#f4ede0] font-bold mb-3 not-italic group-hover:text-[#c9a96e] transition-colors">
                    {step.number} — {step.title}
                  </h3>

                  {/* Description */}
                  <p className="font-sans text-xs text-[#f4ede0]/80 font-light leading-relaxed mb-4">
                    {step.description}
                  </p>
                </div>

                {/* Details Footer */}
                <div className="pt-3 border-t border-[#3d301d]/60 text-[11px] text-[#c9a96e]/80 font-sans italic">
                  {step.details}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
