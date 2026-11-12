import { useEffect, useState } from "react";
import { stats } from "../data/site.js";
import { useInView } from "./Reveal.jsx";

// A number that counts up from 0 when it scrolls into view
function CountUp({ value, decimals = 0, suffix = "", start }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!start) return;
    const duration = 1600;
    const begin = performance.now();
    let frame;
    const tick = (now) => {
      const progress = Math.min((now - begin) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4); // ease-out
      setCurrent(value * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, value]);

  return (
    <span>
      {current.toFixed(decimals)}
      {suffix}
    </span>
  );
}

// The Upwork stats box (numbers come from src/data/site.js)
export default function Stats({ className = "" }) {
  const [ref, visible] = useInView({ threshold: 0.4 });

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} md:rounded-2xl md:border md:border-ink-800 md:bg-ink-900 md:px-6 md:py-2 lg:px-10 ${className}`}
    >
      {/* Phones: each stat in its own box · Tablet: one box, 2 × 2 with dividers · Desktop: one row of 4 */}
      <div className="grid grid-cols-2 gap-3 md:gap-0 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-ink-800 bg-ink-900 px-3 py-6 text-center md:rounded-none md:border-0 md:border-ink-800 md:bg-transparent md:px-6 md:py-8 lg:px-4 lg:py-7 xl:px-8 ${
              i % 2 === 1 ? "md:border-l" : ""
            } ${i >= 2 ? "md:border-t lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""}`}
          >
            <p className="font-display text-[40px] leading-[1.1] font-bold tracking-[-0.02em] md:text-[56px] lg:text-[52px] xl:text-[64px]">
              <CountUp {...stat} start={visible} />
            </p>
            <p className="text-sm leading-[1.6] text-slate-400 md:text-base">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
