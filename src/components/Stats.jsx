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
      className={`reveal ${visible ? "is-visible" : ""} rounded-2xl border border-ink-800 bg-ink-900 px-6 py-2 md:px-10 ${className}`}
    >
      <div className="grid grid-cols-2 md:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`flex flex-col items-center justify-center gap-1.5 px-4 py-7 text-center md:px-8 ${
              i > 0 ? "md:border-l md:border-ink-800" : ""
            } ${i % 2 === 1 ? "border-l border-ink-800" : ""} ${i > 1 ? "border-t border-ink-800 md:border-t-0" : ""}`}
          >
            <p className="font-display text-[40px] leading-[1.1] font-bold tracking-[-0.02em] md:text-[64px]">
              <CountUp {...stat} start={visible} />
            </p>
            <p className="text-sm leading-[1.6] text-slate-400 md:text-base">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
