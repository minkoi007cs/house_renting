import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { STATS_DATA } from '../../data/harlowData';

interface AnimatedCounterProps {
  target: number;
  prefix?: string;
  suffix?: string;
  isDecimal?: boolean;
}

function AnimatedCounter({ target, prefix = '', suffix = '', isDecimal = false }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const totalFrames = duration / 16;
    const step = target / totalFrames;

    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [inView, target]);

  const formattedCount = isDecimal
    ? count.toFixed(1)
    : Math.floor(count).toLocaleString();

  return (
    <span ref={ref}>
      {prefix}
      {formattedCount}
      {suffix}
    </span>
  );
}

export function StatsBar() {
  return (
    <section className="relative z-30 bg-[#111a2e] border-y border-[#3d301d]">
      <div className="max-w-7xl mx-auto py-12 px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 items-center divide-y md:divide-y-0 md:divide-x divide-[#3d301d]">
          {STATS_DATA.map((stat, idx) => (
            <div
              key={stat.label}
              className={`flex flex-col items-center justify-center text-center ${
                idx > 0 ? 'pt-8 md:pt-0' : ''
              }`}
            >
              <div className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#c9a96e] font-normal mb-2 tracking-tight">
                <AnimatedCounter
                  target={stat.target}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  isDecimal={stat.decimal}
                />
              </div>
              <p className="font-sans text-xs uppercase font-medium tracking-[0.18em] text-[#f4ede0]/80">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
