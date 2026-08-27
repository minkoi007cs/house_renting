import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Quote, CheckCircle2 } from 'lucide-react';
import { TESTIMONIALS_DATA } from '../../data/harlowData';

export function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="testimonials" className="py-24 px-6 md:px-16 bg-[#0b1222] border-t border-[#3d301d]/50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-5 h-[1px] bg-[#c9a96e]" />
            <span className="font-sans text-[11px] font-medium tracking-[0.2em] uppercase text-[#c9a96e]">
              CLIENT EXPERIENCES
            </span>
            <span className="w-5 h-[1px] bg-[#c9a96e]" />
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl text-[#f4ede0] font-normal tracking-tight">
            Endorsements of Trust
          </h2>
          <p className="font-sans text-xs text-[#f4ede0]/70 font-light mt-3">
            Reflections from clients who expected discretionary standards and exceptional outcomes.
          </p>
        </div>

        {/* 3-Col Staggered Grid */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS_DATA.map((t, i) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
              animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
              transition={{
                duration: 0.65,
                delay: i * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative p-8 rounded-lg flex flex-col justify-between"
              style={{
                background: 'rgba(244,237,224,0.06)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(201,169,110,0.18)',
              }}
            >
              <div>
                {/* 5 Gold Stars & Quote Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-1 text-[#c9a96e]">
                    {[...Array(t.rating)].map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-current text-[#c9a96e]" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-[#c9a96e]/30" />
                </div>

                {/* Quote Text */}
                <blockquote className="font-serif text-base sm:text-lg italic font-normal text-[#f4ede0] leading-relaxed mb-6">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-[#c9a96e]/15">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-sans text-sm font-semibold text-[#f4ede0]">
                      {t.author}
                    </p>
                    <p className="font-sans text-xs text-[#c9a96e]">
                      {t.role}, {t.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-[#f4ede0]/50 font-sans">
                    <CheckCircle2 className="w-3 h-3 text-[#c9a96e]" />
                    <span>Verified</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
